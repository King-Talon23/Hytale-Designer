// Report a bug: the form (a dialog in the editor, the whole page on /bug), and a record of the page's recent errors to send with it.
// Imported first by main.js, so errors from the start of the visit are caught.

const MAX_ERRORS = 15;
const errors = [];
// file paths keep no user folder names, addresses no query strings, and email addresses are dropped
export const scrub = s =>
  String(s)
    .replace(/\b[A-Za-z]:[\\/]+Users[\\/]+[^\\/\s'"]+/gi, '~')
    .replace(/(^|[\s('"])\/(Users|home)\/[^/\s'"]+/g, '$1~')
    .replace(/\b(https?:\/\/[^\s?#'"]+)[?#][^\s'"]*/g, '$1')
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '<email>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 400);
const keep = s => {
  const t = scrub(s);
  if (!t) return;
  if (errors.length && errors[errors.length - 1].endsWith(t)) return;
  errors.push(new Date().toISOString().slice(11, 19) + ' ' + t);
  if (errors.length > MAX_ERRORS) errors.shift();
};
const describe = e => (e && (e.stack || e.message) ? String(e.stack || e.message) : String(e));
addEventListener('error', e => keep(e.error ? describe(e.error) : `${e.message} (${e.filename || ''}:${e.lineno || 0})`));
addEventListener('unhandledrejection', e => keep('Unhandled: ' + describe(e.reason)));
{
  const orig = console.error;
  console.error = (...a) => {
    keep(a.map(x => (x instanceof Error ? describe(x) : typeof x === 'string' ? x : safeJson(x))).join(' '));
    orig.apply(console, a);
  };
}
function safeJson(x) {
  try {
    return JSON.stringify(x);
  } catch {
    return String(x);
  }
}

function el(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k.includes('-') || k === 'role' || k === 'for') e.setAttribute(k, v);
    else e[k] = v;
  }
  e.append(...kids.flat().filter(k => k != null && k !== false));
  return e;
}

function browserOf(ua) {
  const m =
    /(Edg|OPR|Firefox|Chrome|Version)\/(\d+)/.exec(ua.replace(/Chrome\/(\d+).*Edg\//, 'Edg/')) || /(Firefox|Chrome)\/(\d+)/.exec(ua);
  if (!m) return 'Unknown';
  const name = { Edg: 'Edge', OPR: 'Opera', Version: 'Safari' }[m[1]] || m[1];
  return `${name} ${m[2]}`;
}
const osOf = ua =>
  /Windows NT 10/.test(ua)
    ? 'Windows 10/11'
    : /Windows/.test(ua)
      ? 'Windows'
      : /Mac OS X/.test(ua)
        ? 'macOS'
        : /CrOS/.test(ua)
          ? 'ChromeOS'
          : /Linux/.test(ua)
            ? 'Linux'
            : 'Other';

// the site version: the start of main.js's tag (its content hash), so each deploy reads differently
let version = null;
const siteVersion = () =>
  (version ||= fetch('/app/main.js', { method: 'HEAD', cache: 'no-store' })
    .then(r => (/([0-9a-f]{7})/i.exec(r.headers.get('ETag') || '') || [])[1] || '-')
    .catch(() => '-'));

async function infoNow() {
  const ua = navigator.userAgent,
    on = document.querySelector('#tabs button.on');
  return {
    browser: browserOf(ua),
    os: osOf(ua),
    version: await siteVersion(),
    tab: on ? on.textContent.trim() : '',
    page: location.pathname,
    window: `${innerWidth}x${innerHeight}`,
    errors: errors.slice(),
  };
}
const infoText = i =>
  [
    `Browser: ${i.browser}, ${i.os}, ${i.window}`,
    `Version: ${i.version}`,
    `Page: ${i.page}${i.tab ? ' (' + i.tab + ')' : ''}`,
    `Errors: ${i.errors.length ? '\n' + i.errors.join('\n') : 'none'}`,
  ].join('\n');

// a picture, shrunk to at most 1920 px and re-encoded (which also drops its metadata, like where a photo was taken)
const MAX_SIDE = 1920,
  MAX_BYTES = 2 * 1024 * 1024;
async function shrink(file) {
  if (!/^image\//.test(file.type) || file.size > 40 * 1024 * 1024) throw new Error('Pick an image file.');
  const bmp = await createImageBitmap(file).catch(() => {
    throw new Error('That image could not be read.');
  });
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height)),
    c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(bmp.width * k));
  c.height = Math.max(1, Math.round(bmp.height * k));
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close?.();
  for (const q of [0.88, 0.75, 0.6, 0.45]) {
    const url = c.toDataURL('image/jpeg', q);
    if (url.length * 0.75 < MAX_BYTES) return url;
  }
  throw new Error('That image is too big.');
}

// the form. done() is called after a report goes out or on Cancel.
function bugForm({ done, inDialog }) {
  const what = el('textarea', { id: 'bug-what', rows: 5, maxLength: 2000, required: true }),
    steps = el('textarea', { id: 'bug-steps', rows: 4, maxLength: 2000, placeholder: '1.\n2.\n3.' }),
    contact = el('input', { id: 'bug-contact', type: 'text', maxLength: 120, autocomplete: 'off', placeholder: 'Discord or email' }),
    file = el('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp', hidden: true }),
    thumb = el('img', { alt: 'Screenshot' }),
    dropShot = el('button', { type: 'button', class: 'bugx', 'aria-label': 'Remove screenshot', title: 'Remove', text: '×' }),
    shotBox = el('div', { class: 'bugshot', hidden: true }, thumb, dropShot),
    addShot = el(
      'button',
      { type: 'button', class: 'bugdrop' },
      el('b', { text: 'Add screenshot' }),
      el('span', { text: 'Click, drop or paste an image' })
    ),
    infoPre = el('pre', { class: 'buginfo' }),
    msg = el('p', { class: 'bugmsg', role: 'status' }),
    send = el('button', { type: 'submit', class: 'btn primary', text: 'Send' }),
    cancel = inDialog ? el('button', { type: 'button', class: 'btn ghost', text: 'Cancel' }) : null;
  let shot = null;
  const setShot = async f => {
    msg.textContent = '';
    try {
      shot = await shrink(f);
      thumb.src = shot;
      shotBox.hidden = false;
      addShot.hidden = true;
    } catch (e) {
      msg.textContent = e.message;
      msg.classList.add('bad');
    }
  };
  addShot.onclick = () => file.click();
  file.onchange = () => file.files[0] && setShot(file.files[0]).finally(() => (file.value = ''));
  addShot.ondragover = e => {
    e.preventDefault();
    addShot.classList.add('over');
  };
  addShot.ondragleave = () => addShot.classList.remove('over');
  addShot.ondrop = e => {
    e.preventDefault();
    addShot.classList.remove('over');
    const f = [...(e.dataTransfer?.files || [])][0];
    if (f) setShot(f);
  };
  dropShot.onclick = () => {
    shot = null;
    thumb.removeAttribute('src');
    shotBox.hidden = true;
    addShot.hidden = false;
    addShot.focus();
  };
  const form = el(
    'form',
    { class: inDialog ? 'bugform' : 'bugform panel', noValidate: true },
    el(
      'div',
      { class: 'bugfields' },
      el('label', { for: 'bug-what', text: 'What happened' }),
      what,
      el('label', { for: 'bug-steps', text: 'Steps to reproduce' }, el('span', { class: 'opt', text: 'Optional' })),
      steps,
      el('label', { text: 'Screenshot' }, el('span', { class: 'opt', text: 'Optional' })),
      addShot,
      shotBox,
      file,
      el('label', { for: 'bug-contact', text: 'Contact' }, el('span', { class: 'opt', text: 'Optional' })),
      contact,
      el(
        'details',
        { class: 'bugdetails' },
        el('summary', { text: 'Also sent: browser, OS, window size, site version, page, recent errors' }),
        infoPre
      ),
      msg
    ),
    el('div', { class: 'dlgbtns' }, cancel, send)
  );
  // a pasted image becomes the screenshot
  form.addEventListener('paste', e => {
    const f = [...(e.clipboardData?.files || [])].find(x => /^image\//.test(x.type));
    if (f) {
      e.preventDefault();
      setShot(f);
    }
  });
  const showInfo = () => infoNow().then(i => (infoPre.textContent = infoText(i)));
  form.querySelector('details').addEventListener('toggle', showInfo);
  if (cancel) cancel.onclick = () => done(false);
  form.onsubmit = async e => {
    e.preventDefault();
    msg.classList.remove('bad');
    if (what.value.trim().length < 3) {
      msg.textContent = 'Say what happened.';
      msg.classList.add('bad');
      what.focus();
      return;
    }
    send.disabled = true;
    msg.textContent = 'Sending…';
    try {
      const r = await fetch('/api/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ what: what.value, steps: steps.value, contact: contact.value, info: await infoNow(), shot }),
      });
      const a = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(a.error || 'The report could not be sent. Try again later.');
      form.replaceChildren(
        el('p', { class: 'bugdone', text: 'Report sent. Thanks!' }),
        el(
          'div',
          { class: 'dlgbtns' },
          inDialog
            ? el('button', { type: 'button', class: 'btn primary', text: 'Close', onclick: () => done(true) })
            : el('a', { class: 'btn primary', href: '/', text: 'Back to the editor' })
        )
      );
      form.querySelector('.dlgbtns .btn').focus();
    } catch (err) {
      msg.textContent = err.message === 'Failed to fetch' ? 'No connection. Try again.' : err.message;
      msg.classList.add('bad');
      send.disabled = false;
    }
  };
  return { form, focus: () => what.focus() };
}

// the editor: the footer link opens the form in a dialog over the page, so the open tab and the errors so far go with it
let dlg = null;
export function openBugDialog() {
  if (dlg?.open) return;
  dlg = el('dialog', { class: 'bugdlg', 'aria-labelledby': 'bug-title' });
  const f = bugForm({ inDialog: true, done: () => dlg.close() });
  dlg.append(el('h3', { id: 'bug-title', text: 'Report a bug' }), f.form);
  dlg.onclose = () => dlg.remove();
  document.body.append(dlg);
  dlg.showModal();
  f.focus();
}
// the /bug page
export function mountBugPage(where) {
  const f = bugForm({ inDialog: false, done: () => {} });
  where.append(f.form);
  f.focus();
}

document.addEventListener('click', e => {
  const a = e.target.closest?.('a[href="/bug"]');
  if (!a || !document.getElementById('tabs') || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
  e.preventDefault();
  openBugDialog();
});
