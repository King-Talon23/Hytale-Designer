// The site moved from hytale-skin-editor.com to hytaledesigner.com. A browser keeps saved things per address, so the old
// address hands them over before it forwards (move.js). Locally 127.0.0.1 plays the old address and localhost the new one,
// and only when the test switch hd_movetest is set, so normal local work is never forwarded.
const local = ['127.0.0.1', 'localhost'].includes(location.hostname),
  port = location.port;
export const NEW_ORIGIN = local ? `http://localhost:${port}` : 'https://hytaledesigner.com';
export const OLD_ORIGINS = local ? [`http://127.0.0.1:${port}`] : ['https://hytale-skin-editor.com', 'https://www.hytale-skin-editor.com'];
let testing = false;
try {
  testing = localStorage.getItem('hd_movetest') === '1';
} catch {
  /* no storage: not testing */
}
export const onOld = () => OLD_ORIGINS.includes(location.origin) && (!local || testing);
export const moved = () => {
  try {
    return localStorage.getItem('hd_moved') === '1';
  } catch {
    return false;
  }
};

const NAME = 'skin-editor';
// game files are the player's own copy of Assets.zip: too big to pass over and made again by connecting the zip on the new site
const SKIP_META = new Set(['game', 'zipHandle', 'anims']);
const req = r =>
  new Promise((ok, no) => {
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  });
const isHandle = v => typeof FileSystemHandle !== 'undefined' && v instanceof FileSystemHandle;
// folder and file handles cannot cross to another address; anything holding one stays behind
const portable = v => !isHandle(v) && !(v && typeof v === 'object' && !(v instanceof Blob) && Object.values(v).some(isHandle));

function openExisting() {
  return new Promise(ok => {
    const r = indexedDB.open(NAME);
    // no database here yet: do not make one
    r.onupgradeneeded = () => r.transaction.abort();
    r.onsuccess = () => ok(r.result);
    r.onerror = () => ok(null);
  });
}

// everything this browser keeps for the site at this address, except the game files
export async function gather() {
  const out = { version: 0, stores: {}, local: {} },
    d = await openExisting();
  if (d) {
    out.version = d.version;
    for (const s of d.objectStoreNames) {
      if (s === 'files') continue;
      const st = d.transaction(s).objectStore(s),
        [ks, vs] = await Promise.all([req(st.getAllKeys()), req(st.getAll())]);
      out.stores[s] = ks.map((k, i) => [k, vs[i]]).filter(([k, v]) => !(s === 'meta' && SKIP_META.has(k)) && portable(v));
    }
    d.close();
  }
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k.startsWith('hd_move')) out.local[k] = localStorage.getItem(k);
    }
  } catch {
    /* no storage */
  }
  return out;
}

// skins, items, a draft or published looks: something the player would miss
export const worthMoving = g =>
  ['skins', 'assets'].some(s => g.stores[s]?.length) || (g.stores.meta || []).some(([k]) => ['draft', 'published', 'locker'].includes(k));

function openFor(g) {
  return new Promise((ok, no) => {
    const r = indexedDB.open(NAME, g.version || 1);
    r.onupgradeneeded = () => {
      for (const s of [...Object.keys(g.stores), 'files']) if (!r.result.objectStoreNames.contains(s)) r.result.createObjectStore(s);
    };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  }).catch(e => {
    // the new address already runs a newer version of the database: open it as it is
    if (e?.name !== 'VersionError') throw e;
    return new Promise((ok, no) => {
      const r = indexedDB.open(NAME);
      r.onsuccess = () => ok(r.result);
      r.onerror = () => no(r.error);
    });
  });
}

// adds what is missing here and never overwrites: a skin made on the new address already wins
export async function receive(g) {
  let skins = 0,
    items = 0;
  if (g.version) {
    const d = await openFor(g);
    for (const [s, rows] of Object.entries(g.stores)) {
      if (!d.objectStoreNames.contains(s) || !rows.length) continue;
      const t = d.transaction(s, 'readwrite'),
        st = t.objectStore(s),
        have = new Set((await req(st.getAllKeys())).map(k => JSON.stringify(k)));
      for (const [k, v] of rows) {
        if (have.has(JSON.stringify(k))) continue;
        st.put(v, k);
        if (s === 'skins') skins++;
        if (s === 'assets') items++;
      }
      await new Promise((ok, no) => {
        t.oncomplete = () => ok();
        t.onerror = t.onabort = () => no(t.error);
      });
    }
    d.close();
  }
  try {
    for (const [k, v] of Object.entries(g.local || {}))
      if (typeof v === 'string' && localStorage.getItem(k) === null) localStorage.setItem(k, v);
  } catch {
    /* no storage */
  }
  return { skins, items };
}
