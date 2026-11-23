// POST /api/bugs: checks, limits and the Discord message, against node:sqlite as D1 and a stand-in for Discord.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import * as api from '../../lib/api.js';
import * as bugs from '../../functions/api/bugs.js';

const sq = new DatabaseSync(':memory:');
const stmt = (sql, args = []) => ({
  bind: (...a) => stmt(sql, a),
  first: async () => sq.prepare(sql).get(...args) ?? null,
  all: async () => ({ results: sq.prepare(sql).all(...args) }),
  run: async () => ({ meta: { changes: Number(sq.prepare(sql).run(...args).changes) } }),
});
const DB = { prepare: sql => stmt(sql), batch: async ss => Promise.all(ss.map(s => s.run())) };
const HOOK = 'https://discord.com/api/webhooks/123/abc-DEF_1';
const env = { DB, SESSION_KEY: 'test-key-123', BUG_WEBHOOK: HOOK };

let sent = [],
  discordOk = true;
globalThis.fetch = async (url, init) => {
  sent.push({ url, form: init.body });
  return new Response(null, { status: discordOk ? 204 : 500 });
};
const post = async (b, { ip = '1.1.1.1', origin = api.SITE, e = env } = {}) => {
  const r = await bugs.onRequestPost({
    request: new Request(api.SITE + '/api/bugs', {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
      body: JSON.stringify(b),
    }),
    env: e,
  });
  return [r.status, await r.json()];
};
const PNG = 'data:image/png;base64,' + Buffer.from('\x89PNG\r\n\x1a\nrest', 'latin1').toString('base64');

test('bug reports need the site as origin, a webhook and some text', async () => {
  assert.deepEqual(await post({ what: 'broken' }, { origin: 'https://evil.example' }), [403, { error: 'Not allowed.' }]);
  assert.equal((await post({ what: 'broken' }, { e: { DB, SESSION_KEY: 'k', BUG_WEBHOOK: 'https://evil.example/x' } }))[0], 503);
  assert.equal((await post({ what: ' ' }))[0], 400);
  assert.equal((await post({ what: 'broken', shot: 'data:image/png;base64,AAAA' }))[0], 400);
  assert.equal((await post({ what: 'broken', shot: 'data:text/html;base64,PGI+' }))[0], 400);
  assert.equal(sent.length, 0);
});

test('a report goes to Discord with its screenshot, no pings, and a copy is kept', async () => {
  sent = [];
  const [s] = await post({
    what: 'Cape @everyone sticks out\non Sleep 2',
    steps: '1. open Animations',
    contact: 'me#1',
    shot: PNG,
    info: { browser: 'Edge 131', os: 'Windows 10/11', tab: 'Animations', errors: ['x'], extra: 'dropped' },
  });
  assert.equal(s, 201);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, HOOK);
  const msg = JSON.parse(sent[0].form.get('payload_json'));
  assert.deepEqual(msg.allowed_mentions, { parse: [] });
  assert.equal(msg.embeds[0].title, 'Cape @everyone sticks out');
  assert.match(msg.embeds[0].description, /Steps\*\*\n1\. open Animations/);
  assert.equal(msg.embeds[0].image.url, 'attachment://screenshot.png');
  assert.equal(sent[0].form.get('files[0]').size, 12);
  const row = sq.prepare('SELECT * FROM bugs').get();
  const copy = JSON.parse(row.report);
  assert.equal(copy.shot, true);
  assert.equal(copy.info.extra, undefined);
  assert.notEqual(row.who, '1.1.1.1');
});

test('Discord limits hold for the longest report', () => {
  const m = bugs.discordMessage({
    what: 'a'.repeat(2000),
    steps: 'b'.repeat(2000),
    contact: 'c'.repeat(120),
    info: bugs.infoOf({ errors: Array(30).fill('e'.repeat(500)), browser: 'x'.repeat(500) }),
    at: Date.now(),
  });
  const e = m.embeds[0];
  assert.ok(e.title.length <= 256 && e.description.length <= 4096);
  for (const f of e.fields) assert.ok(f.value.length <= 1024);
  assert.ok(e.title.length + e.description.length + e.fields.reduce((n, f) => n + f.name.length + f.value.length, 0) <= 6000);
});

test(`at most ${bugs.BUGS_PER_HOUR} reports an hour from one address, failed sends included`, async () => {
  sq.prepare('DELETE FROM bugs').run();
  discordOk = false;
  assert.equal((await post({ what: 'one' }, { ip: '2.2.2.2' }))[0], 502);
  discordOk = true;
  for (let k = 1; k < bugs.BUGS_PER_HOUR; k++) assert.equal((await post({ what: 'again' }, { ip: '2.2.2.2' }))[0], 201);
  assert.equal((await post({ what: 'again' }, { ip: '2.2.2.2' }))[0], 429);
  assert.equal((await post({ what: 'other' }, { ip: '3.3.3.3' }))[0], 201);
});
