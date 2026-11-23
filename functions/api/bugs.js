// POST /api/bugs {what, steps?, contact?, info, shot?}: a bug report from the site. It goes to the site owner's private Discord
// channel through a webhook (the BUG_WEBHOOK secret) and a copy without the screenshot is kept 90 days. No sign-in needed.
import { addrCode, body, ensure, json, sameSite } from '../../lib/api.js';

export const BUGS_PER_HOUR = 5, // from one address
  BUGS_PER_HOUR_ALL = 60, // from everyone together, so a flood can't swamp the channel
  MAX_SHOT = 2 * 1024 * 1024; // screenshot bytes, after the browser shrinks it
const KEEP_DAYS = 90;
const HOOK = /^https:\/\/(discord\.com|discordapp\.com|ptb\.discord\.com|canary\.discord\.com)\/api\/webhooks\/\d+\/[\w-]+$/;

// text as typed, control characters out (newlines and tabs kept), cut to max
const text = (v, max) =>
  String(v ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max);
const line = (v, max) => text(v, max).replace(/\s+/g, ' ');

// what the browser attached by itself: a fixed set of short fields, nothing else rides along
export function infoOf(o) {
  const i = o && typeof o === 'object' && !Array.isArray(o) ? o : {};
  const errors = (Array.isArray(i.errors) ? i.errors : [])
    .slice(-15)
    .map(e => line(e, 400))
    .filter(Boolean);
  return {
    browser: line(i.browser, 80),
    os: line(i.os, 80),
    version: line(i.version, 40),
    tab: line(i.tab, 40),
    page: line(i.page, 80),
    window: line(i.window, 20),
    errors,
  };
}
// a screenshot: PNG, JPEG or WebP only, checked by its first bytes
export function shotOf(s) {
  if (s == null || s === '') return { none: true };
  const m = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(typeof s === 'string' ? s : '');
  if (!m) return null;
  let bin;
  try {
    bin = atob(m[2]);
  } catch {
    return null;
  }
  if (bin.length > MAX_SHOT) return null;
  const head = bin.slice(0, 12);
  const ok = {
    png: head.startsWith('\x89PNG'),
    jpeg: head.startsWith('\xff\xd8\xff'),
    webp: head.startsWith('RIFF') && head.slice(8, 12) === 'WEBP',
  }[m[1]];
  if (!ok) return null;
  const bytes = new Uint8Array(bin.length);
  for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
  return { type: 'image/' + m[1], ext: m[1] === 'jpeg' ? 'jpg' : m[1], bytes };
}

const cut = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
// the Discord message: one embed, every value inside Discord's limits, and no pings whatever was typed
export function discordMessage(r) {
  const i = r.info,
    desc = r.steps ? `${r.what}\n\n**Steps**\n${r.steps}` : r.what;
  const fields = [
    { name: 'Contact', value: r.contact || '-', inline: true },
    { name: 'Tab', value: i.tab || i.page || '-', inline: true },
    { name: 'Version', value: i.version || '-', inline: true },
    { name: 'Browser', value: [i.browser, i.os, i.window].filter(Boolean).join(' · ') || '-' },
  ];
  if (i.errors.length) fields.push({ name: 'Errors', value: cut('```\n' + i.errors.join('\n').replace(/`/g, "'"), 1020) + '\n```' });
  return {
    username: 'Hytale Designer bugs',
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: cut(r.what.split('\n')[0], 200),
        description: cut(desc, 4000),
        color: 0xe0685a,
        fields: fields.map(f => ({ ...f, value: cut(f.value, 1024) })),
        timestamp: new Date(r.at).toISOString(),
        ...(r.shot ? { image: { url: 'attachment://screenshot.' + r.shot.ext } } : {}),
      },
    ],
  };
}

export async function onRequestPost({ request, env }) {
  if (!sameSite(request)) return json({ error: 'Not allowed.' }, 403);
  if (!env.DB || !env.SESSION_KEY || !HOOK.test(env.BUG_WEBHOOK || '')) return json({ error: 'Bug reports are switched off.' }, 503);
  const b = await body(request, 3 * 1024 * 1024);
  if (!b || typeof b !== 'object') return json({ error: 'That report could not be read.' }, 400);
  const what = text(b.what, 2000),
    steps = text(b.steps, 2000),
    contact = line(b.contact, 120),
    shot = shotOf(b.shot);
  if (what.length < 3) return json({ error: 'Say what happened.' }, 400);
  if (!shot) return json({ error: 'The screenshot must be a PNG, JPEG or WebP image under 2 MB.' }, 400);

  await ensure(env.DB);
  const now = Date.now(),
    who = await addrCode(env.SESSION_KEY, request, 'bug');
  await env.DB.prepare('DELETE FROM bugs WHERE at < ?1')
    .bind(now - KEEP_DAYS * 864e5)
    .run();
  const since = now - 3600e3,
    mine = (await env.DB.prepare('SELECT COUNT(*) AS n FROM bugs WHERE who = ?1 AND at > ?2').bind(who, since).first()).n,
    all = (await env.DB.prepare('SELECT COUNT(*) AS n FROM bugs WHERE at > ?1').bind(since).first()).n;
  if (mine >= BUGS_PER_HOUR || all >= BUGS_PER_HOUR_ALL) return json({ error: 'Too many reports for now. Try again in an hour.' }, 429);

  const r = { what, steps, contact, info: infoOf(b.info), shot: shot.none ? null : shot, at: now };
  // stored before sending, so failed sends count towards the limit too
  const copy = JSON.stringify({ what, steps, contact, info: r.info, shot: !!r.shot });
  await env.DB.prepare('INSERT INTO bugs (who, at, report) VALUES (?1, ?2, ?3)').bind(who, now, copy).run();
  const form = new FormData();
  form.append('payload_json', JSON.stringify(discordMessage(r)));
  if (r.shot) form.append('files[0]', new Blob([r.shot.bytes], { type: r.shot.type }), 'screenshot.' + r.shot.ext);
  let sent;
  try {
    sent = await fetch(env.BUG_WEBHOOK, { method: 'POST', body: form });
  } catch {
    sent = null;
  }
  if (!sent || !sent.ok) return json({ error: 'The report could not be sent. Try again later.' }, 502);
  return json({ ok: true }, 201);
}
