// The wardrobe. Two shelves that never mix:
//   game   - 5 slots that mirror the presets inside Hytale (ids game-0 .. game-4)
//   custom - up to 45 skins that exist only on this site
import * as db from './db.js';
import { sanitize, cleanName } from './skin.js';
import * as assets from './assets.js';
import * as anim from './anim.js';

export const GAME_SLOTS = 5, CUSTOM_MAX = 45;
const gameId = i => 'game-' + i;

export async function list() {
  const rows = (await db.all('skins')).filter(r => r && sanitize(r.skin));
  const game = Array.from({ length: GAME_SLOTS }, (_, i) => rows.find(r => r.id === gameId(i)) || null);
  const custom = rows.filter(r => r.kind === 'custom').sort((a, b) => b.updated - a.updated);
  return { game, custom };
}
function record(id, kind, name, skin, slot) { return { id, kind, slot: kind === 'game' ? slot : undefined, name: cleanName(name) || 'Unnamed', skin: sanitize(skin), updated: Date.now() }; }
async function put(r) { if (!r.skin) throw new Error('That is not a skin.'); await db.put('skins', r.id, r); return r; }
const write = async r => { await put(r); await mirror(); return r; };

export async function saveCustom(name, skin, id) {
  if (!id && (await list()).custom.length >= CUSTOM_MAX) throw new Error(`My skins is full (${CUSTOM_MAX})`);
  return write(record(id || crypto.randomUUID(), 'custom', name, skin));
}
export const hasCustomItem = skin => Object.values(skin || {}).some(v => typeof v === 'string' && v.startsWith('Custom_'));
export async function uniqueName(name, exceptId) { const used = new Set((await list()).custom.filter(r => r.id !== exceptId).map(r => r.name)), base = cleanName(name) || 'My skin'; if (!used.has(base)) return base; const stem = base; for (let k = 2; k < 1000; k++) { const n = cleanName(stem.slice(0, 36) + ' ' + k); if (!used.has(n)) return n; } return base; }   // a taken name gets a number
export async function saveGame(slot, name, skin) {   // an in-game slot never holds custom items: such a look is kept in My skins instead (and that record is returned)
  if (hasCustomItem(skin)) return saveCustom(await uniqueName(name), skin);
  return write(record(gameId(slot), 'game', name, skin, slot)); }
export const remove = async id => { await db.del('skins', id); await mirror(); };

// Put a custom skin into an in-game slot. Whatever was in the slot takes the custom skin's place, so nothing is lost.
export async function swap(customId, slot) {
  const { game, custom } = await list(), c = custom.find(r => r.id === customId); if (!c) throw new Error('That skin is gone.');
  const old = game[slot];
  await put(record(gameId(slot), 'game', c.name, c.skin, slot));
  if (old) await put(record(c.id, 'custom', await uniqueName(old.name, c.id), old.skin)); else await db.del('skins', c.id);   /* the skin that moves out keeps a unique name */
  await mirror();
}

export async function exportAll() { const { game, custom } = await list();
  const mine = []; for (const a of await assets.list()) mine.push(await packAsset(a));
  return { format: 'skin-editor-backup', version: 2, game: game.map(r => r && { name: r.name, skin: r.skin }), custom: custom.map(r => ({ name: r.name, skin: r.skin, updated: r.updated })), assets: mine }; }
export async function packAsset(a) { return { id: a.id, name: a.name, field: a.field, baseId: a.baseId, model: a.model, w: a.w, h: a.h, shape: a.shape, labels: a.labels, split: !!a.split, tone: a.tone, png: await toBase64(a.data) }; }   // one item with its texture, shape and part names
export async function unpackAssets(list, check = () => true) { const have = new Set((await assets.list()).map(a => a.id)); let n = 0; for (const m of Array.isArray(list) ? list.slice(0, 200) : []) { try { if (m && typeof m.png === 'string' && m.png.length < 3_000_000 && check(m) && await takeAsset(m, Uint8Array.from(atob(m.png), c => c.charCodeAt(0)), have)) n++; } catch { /* not a usable item */ } } return n; }
async function toBase64(blob) { const b = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); }
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
// a custom asset from outside (a backup or the skins folder): the picture must really be a PNG of the size it claims, and its id must be free
async function takeAsset(meta, bytes, have) {
  if (!meta || typeof meta.id !== 'string' || have.has(meta.id) || have.size >= assets.MAX || bytes.length > 2_000_000 || !PNG.every((v, i) => bytes[i] === v)) return false;
  const data = new Blob([bytes], { type: 'image/png' }), bmp = await createImageBitmap(data); if (bmp.width !== meta.w || bmp.height !== meta.h) return false;
  await assets.save({ id: meta.id, name: meta.name, field: meta.field, baseId: meta.baseId, model: meta.model, w: bmp.width, h: bmp.height, data, shape: typeof meta.shape === 'string' && meta.shape.length < 1_000_000 ? meta.shape : undefined, labels: meta.labels, split: !!meta.split, tone: meta.tone }); have.add(meta.id); return true;
}
export async function importAll(data) {   // adds to what is there; never overwrites a filled in-game slot
  if (!data || data.format !== 'skin-editor-backup' || !Array.isArray(data.custom)) throw new Error('That file is not a Skin Editor backup.');
  const cur = await list(); let added = 0, skipped = 0, room = CUSTOM_MAX - cur.custom.length;
  const had = new Set((await assets.list()).map(a => a.id)), offered = Array.isArray(data.assets) ? data.assets.filter(m => m && !had.has(m.id)).length : 0, items = await unpackAssets(data.assets);   /* items already here are not 'skipped' */   // items first, so restored skins that wear them find them
  const there = cur.custom.map(r => [r.name, JSON.stringify(r.skin)]), names = new Set(cur.custom.map(r => r.name)), now = Date.now();
  const seen = (nm, k) => there.some(([n, x]) => x === k && (n === nm || (n.startsWith(nm + ' ') && /^\d+$/.test(n.slice(nm.length + 1)))));   // restoring the same backup twice does not double up, also when the first restore had to number the name
  for (const [i, r] of data.custom.slice(0, 500).entries()) { const s = sanitize(r?.skin); if (!s) continue; const base = cleanName(r.name) || 'My skin', k = JSON.stringify(s); if (seen(base, k)) continue; if (room <= 0) { skipped++; continue; } let nm = base, q = 2; while (names.has(nm)) nm = cleanName(base.slice(0, 36) + ' ' + q++);
    const rec = record(crypto.randomUUID(), 'custom', nm, s); rec.updated = Number.isFinite(r.updated) ? r.updated : now - i; await write(rec); names.add(nm); there.push([nm, k]); room--; added++; }   /* a taken name gets a number; skins keep their order */
  for (let i = 0; i < GAME_SLOTS; i++) { const r = data.game?.[i], s = sanitize(r?.skin); if (s && !cur.game[i]) { if (hasCustomItem(s)) { const sk = JSON.stringify(s); if ((await list()).custom.some(c => JSON.stringify(c.skin) === sk)) continue; if (room <= 0) { skipped++; continue; } room--; } await saveGame(i, r.name, s); added++; } }   /* custom looks go to My skins (saveGame), once */   /* in-game slots never get custom items */
  return { added, items, skipped, itemsSkipped: Math.max(0, offered - items) };   /* skins and items counted apart */
}

// ---- a folder on the player's own computer (Chrome and Edge). The browser copy stays the working copy; every change is
// mirrored into two subfolders as one small .json file per skin, and skins found there are brought in when the folder connects.
export const folderSupported = typeof self.showDirectoryPicker === 'function';
const SUB = { custom: 'My skins', game: 'In-game slots' }, ASSET_DIR = 'Custom assets', ANIM_DIR = 'Animations';
export const sync = () => mirror();
// what the player is wearing, for the companion mod: "<skins folder>/Wearing.json" (on:false when Show in game is off)
let lastWearing = null;
export async function writeWearing(data) {
  if (!dir) return false; const text = JSON.stringify({ format: 'skin-editor-wearing', version: 1, ...data }, null, 1); if (text === lastWearing) return true;
  const w = await (await dir.getFileHandle('Wearing.json', { create: true })).createWritable(); await w.write(text); await w.close(); lastWearing = text; return true;
}
// the companion mod writes "<skins folder>/Skin Editor Sync.json" once a day while it runs: { version, seen } when it has, else null
export async function modSeen() {
  if (!dir) return null;
  try { const j = JSON.parse(await (await (await dir.getFileHandle('Skin Editor Sync.json')).getFile()).text());
    return j && j.format === 'skin-editor-sync' && /^\d{4}-\d{2}-\d{2}$/.test(j.seen) ? { version: String(j.version || '').slice(0, 20), seen: j.seen } : null; } catch { return null; }
}
// the connected skins folder (or one of its subfolders), for a file picker to open in; null when none is connected
export async function skinsFolder(sub) { if (!dir || dir.bridge) return null; if (!sub) return dir; try { return await dir.getDirectoryHandle(sub); } catch { return dir; } }
export let lockedOf = () => false;   // set by the page: repaints of edition and reward items, which the mod will not wear
export const setLockedOf = f => { lockedOf = f; };
export let keepOwnOf = () => [];   // set by the page: slots holding paid items, which the mod keeps as the player's own
export const setKeepOwnOf = f => { keepOwnOf = f; };
let dir = null; const written = new Map(), known = new Set();
const safe = n => { let t = String(n).replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').replace(/^[. ]+|[. ]+$/g, '').slice(0, 60) || 'Unnamed'; return /^(con|prn|aux|nul|com\d|lpt\d)$/i.test(t) ? '_' + t : t; };
export async function folderState() {
  if (dir?.bridge) return { state: 'on', name: FOLDER_NAME, via: 'mod', mod: await modSeen() };
  if (bridgeWanted) return { state: 'wait', name: FOLDER_NAME, via: 'mod', mod: { version: '', seen: '', offline: true } };   // through the mod, and the game is not running
  if (!folderSupported) return { state: 'none' };
  const h = await db.get('meta', 'folder'); if (!h) return { state: 'none' };
  const on = dir && (await h.queryPermission({ mode: 'readwrite' })) === 'granted';
  return { state: on ? 'on' : 'ask', name: h.name, mod: on ? await modSeen() : null };   // mod: the companion mod's marker, when it has run
}
// the skins folder is always Documents/Hytale Skins, where the Skin Editor Sync mod looks: picking Documents makes (or finds) it there,
// picking the Hytale Skins folder itself is fine, and any other folder is turned down so the mod never misses the skins
export const FOLDER_NAME = 'Hytale Skins';
// ---- the mod as the folder: with Hytale running, the Skin Editor Sync mod (1.2+) answers on this computer (127.0.0.1) and writes into
// Documents/Hytale Skins itself, so no folder has to be picked and any browser works. It looks like a folder to the code below.
const BRIDGE_PORTS = [47815, 47816, 47817]; let bridgeBase = null, bridgeWanted = false, bridgeTimer = 0;
async function findBridge() { for (const p of BRIDGE_PORTS) { try { const r = await fetch(`http://127.0.0.1:${p}/v1/hello`, { signal: AbortSignal.timeout(1500), credentials: 'omit' }), j = await r.json();
  if (j && j.app === 'skin-editor-sync') { bridgeBase = `http://127.0.0.1:${p}`; return j; } } catch { /* not this port */ } } bridgeBase = null; return null; }
const bget = async (path, q) => { const r = await fetch(`${bridgeBase}${path}?${new URLSearchParams(q)}`, { credentials: 'omit' }); if (r.status === 404) throw new DOMException('Not found', 'NotFoundError'); if (!r.ok) throw new Error('The mod did not answer'); return r; };
function bridgeFile(path, name) { return { kind: 'file', name,
  async getFile() { return new File([await (await bget('/v1/file', { path })).blob()], name); },
  async createWritable() { const parts = []; return { write: async d => { parts.push(d); }, close: async () => { const r = await fetch(`${bridgeBase}/v1/file?${new URLSearchParams({ path })}`, { method: 'PUT', body: new Blob(parts), credentials: 'omit' }); if (!r.ok) throw new Error('The mod could not save ' + name); } }; } }; }
function bridgeDir(sub) { const at = n => sub ? sub + '/' + n : n; return { kind: 'directory', name: sub || FOLDER_NAME, bridge: true,
  async getDirectoryHandle(n) { return bridgeDir(n); },
  async getFileHandle(n, o) { if (!o?.create) await bget('/v1/file', { path: at(n) }); return bridgeFile(at(n), n); },
  async removeEntry(n) { await fetch(`${bridgeBase}/v1/file?${new URLSearchParams({ path: at(n) })}`, { method: 'DELETE', credentials: 'omit' }); },
  async *entries() { for (const x of await (await bget('/v1/list', { dir: sub })).json()) yield [x.name, bridgeFile(at(x.name), x.name)]; },
  async queryPermission() { return 'granted'; }, async requestPermission() { return 'granted'; } }; }
const changed = () => self.dispatchEvent(new Event('skinsfolder'));
function watchBridge() { clearInterval(bridgeTimer); if (!bridgeWanted) return; bridgeTimer = setInterval(async () => {   /* the game starts and stops: follow it */
  if (dir && !dir.bridge) return; const ok = !!(await findBridge());
  if (ok && !dir) { dir = bridgeDir(); written.clear(); known.clear(); lastWearing = null; try { await attach(); } catch (e) { console.warn(e); } changed(); }
  else if (!ok && dir?.bridge) { dir = null; changed(); } }, 15000); }
// after "Get the mod" the site looks for the mod by itself (every 15 s) and connects as soon as Hytale runs; nobody else is ever probed
let autoTimer = 0;
export async function wantMod() { await db.put('meta', 'wantmod', true); autoConnect(); }
async function autoConnect() { clearInterval(autoTimer); if (!(await db.get('meta', 'wantmod'))) return;
  const tryNow = async () => { if (dir || bridgeWanted) { clearInterval(autoTimer); return; } if (!(await findBridge())) return; clearInterval(autoTimer);
    try { const r = await connectMod(); self.dispatchEvent(new CustomEvent('skinsfolder', { detail: { auto: true, imported: r?.imported || 0 } })); } catch (e) { console.warn(e); } };
  autoTimer = setInterval(tryNow, 15000); tryNow(); }
export async function connectMod() { const j = await findBridge(); if (!j) throw new Error('Start Hytale with the Skin Editor Sync mod (1.2 or newer) turned on, then try again.');
  bridgeWanted = true; await db.put('meta', 'bridge', true); await db.del('meta', 'folder'); dir = bridgeDir(); written.clear(); known.clear(); lastWearing = null; watchBridge(); return attach(); }

export async function chooseFolder() { const h = await self.showDirectoryPicker({ id: 'skins', mode: 'readwrite', startIn: 'documents' });
  if (h.name === FOLDER_NAME) return useFolder(h);
  if (/^(Documents|Documenten|Dokumente|Documentos|Documenti|My Documents)$/i.test(h.name)) return useFolder(await h.getDirectoryHandle(FOLDER_NAME, { create: true }));
  throw new Error(`Pick your Documents folder (the site makes "${FOLDER_NAME}" in it), or the "${FOLDER_NAME}" folder itself. The mod only looks there.`); }
export async function useFolder(h) { bridgeWanted = false; clearInterval(bridgeTimer); await db.del('meta', 'bridge'); await db.put('meta', 'folder', h); dir = h; written.clear(); known.clear(); lastWearing = null; return attach(); }
export async function resumeFolder(ask) {
  if (!(await db.get('meta', 'bridge')) && !(await db.get('meta', 'folder'))) autoConnect();   // waiting for the mod they downloaded
  if (await db.get('meta', 'bridge')) { bridgeWanted = true; watchBridge(); if (!(await findBridge())) return null; dir = bridgeDir(); written.clear(); known.clear(); return attach(); }
  if (!folderSupported) return null; const h = await db.get('meta', 'folder'); if (!h) return null;
  let p = await h.queryPermission({ mode: 'readwrite' }); if (p !== 'granted' && ask) p = await h.requestPermission({ mode: 'readwrite' });
  if (p !== 'granted') return null; dir = h; written.clear(); known.clear(); return attach();
}
export async function forgetFolder() { dir = null; bridgeWanted = false; clearInterval(bridgeTimer); clearInterval(autoTimer); await db.del('meta', 'wantmod'); await db.del('meta', 'folder'); await db.del('meta', 'bridge'); }
async function attach() {   // bring in skins the folder has and this browser does not, then write everything out
  const cur = await list(); let imported = 0, room = CUSTOM_MAX - cur.custom.length;
  const have = new Set(cur.custom.map(r => r.name + '|' + JSON.stringify(r.skin)));
  for (const kind of ['custom', 'game']) { const d = await dir.getDirectoryHandle(SUB[kind], { create: true }); let n = 0;
    for await (const [name, h] of d.entries()) { if (h.kind !== 'file' || !/\.json$/i.test(name) || ++n > 300) continue;
      try { const f = await h.getFile(); if (f.size > 200000) continue; const j = JSON.parse(await f.text()), sk = sanitize(j && j.skin); if (!sk) continue;
        known.add(SUB[kind] + '/' + name); const nm = cleanName(j.name || name.replace(/\.json$/i, ''));
        if (kind === 'custom') { const key = nm + '|' + JSON.stringify(sk); if (have.has(key) || room <= 0) continue; have.add(key); await put(record(crypto.randomUUID(), 'custom', await uniqueName(nm), sk)); room--; imported++; }
        else { const i = Number.isInteger(j.slot) ? j.slot : -1; if (i < 0 || i >= GAME_SLOTS || cur.game[i]) continue; if (hasCustomItem(sk)) { if (room > 0) { await put(record(crypto.randomUUID(), 'custom', await uniqueName(nm), sk)); room--; imported++; } continue; } cur.game[i] = await put(record(gameId(i), 'game', nm, sk, i)); imported++; }
      } catch { /* not one of ours */ } } }
  try { const d = await dir.getDirectoryHandle(ASSET_DIR, { create: true }), have = new Set((await assets.list()).map(a => a.id)); let n = 0;
    for await (const [name, h] of d.entries()) { if (h.kind !== 'file' || !/\.json$/i.test(name) || ++n > 200) continue;
      try { const f = await h.getFile(); if (f.size > 20000) continue; const meta = JSON.parse(await f.text()); if (!meta || meta.format !== 'skin-editor-asset') continue;
        const png = await (await d.getFileHandle(name.replace(/\.json$/i, '.png'))).getFile(); try { const sh = await (await d.getFileHandle(name.replace(/\.json$/i, '.blockymodel'))).getFile(); if (sh.size < 1_000_000) meta.shape = await sh.text(); } catch { /* no reshaped model */ } known.add(ASSET_DIR + '/' + name); known.add(ASSET_DIR + '/' + name.replace(/\.json$/i, '.png'));
        if (await takeAsset(meta, new Uint8Array(await png.arrayBuffer()), have)) imported++; } catch { /* not one of ours */ } } } catch (e) { console.warn(e); }
  await mirror(); return { imported };
}
let mirroring = Promise.resolve();
export const syncFolder = () => mirror();   // the Animate tab saves through this too
function mirror() { if (!dir) return Promise.resolve(); return mirroring = mirroring.catch(() => {}).then(doMirror); }
async function doMirror() {
  if (!dir) return;
  try {
    const { game, custom } = await list(), want = new Map(), used = new Set();
    const file = r => JSON.stringify({ format: 'skin-editor-skin', version: 1, name: r.name, kind: r.kind, slot: r.slot, keepOwn: keepOwnOf(r.skin), skin: r.skin }, null, 1);
    for (const r of game) if (r) want.set(`${SUB.game}/Slot ${r.slot + 1} - ${safe(r.name)}.json`, file(r));
    for (const r of [...custom].sort((a, b) => a.id < b.id ? -1 : 1)) { let b = safe(r.name), n = b, i = 2; while (used.has(n.toLowerCase())) n = `${b} (${i++})`; used.add(n.toLowerCase()); want.set(`${SUB.custom}/${n}.json`, file(r)); }
    for (const kind of ['custom', 'game']) { const d = await dir.getDirectoryHandle(SUB[kind], { create: true });
      for (const [path, text] of want) { if (!path.startsWith(SUB[kind] + '/') || written.get(path) === text) continue;
        const w = await (await d.getFileHandle(path.slice(SUB[kind].length + 1), { create: true })).createWritable(); await w.write(text); await w.close(); written.set(path, text); known.add(path); }
      for (const path of [...known]) if (path.startsWith(SUB[kind] + '/') && !want.has(path)) { try { await d.removeEntry(path.slice(SUB[kind].length + 1)); } catch { /* already gone */ } known.delete(path); written.delete(path); } }
    // custom assets: the painted picture as a PNG, with a small .json beside it saying which item it belongs to
    const ad = await dir.getDirectoryHandle(ASSET_DIR, { create: true }), keep = new Set();
    for (const a of await assets.list()) { const stem = `${safe(a.name)} (${a.id})`, files = [[stem + '.png', a.data, a.id + '@' + a.updated], ...(a.shape ? [[stem + '.blockymodel', a.shape, null]] : []), [stem + '.json', JSON.stringify({ format: 'skin-editor-asset', version: 1, id: a.id, name: a.name, field: a.field, baseId: a.baseId, model: a.model, w: a.w, h: a.h, labels: a.labels, split: !!a.split, tone: a.tone, locked: !!lockedOf(a) }, null, 1), null]];
      for (const [name, body, stamp] of files) { const path = ASSET_DIR + '/' + name, mark = stamp || body; keep.add(path); if (written.get(path) === mark) continue;
        const w = await (await ad.getFileHandle(name, { create: true })).createWritable(); await w.write(body); await w.close(); written.set(path, mark); known.add(path); } }
    for (const path of [...known]) if (path.startsWith(ASSET_DIR + '/') && !keep.has(path)) { try { await ad.removeEntry(path.slice(ASSET_DIR.length + 1)); } catch { /* already gone */ } known.delete(path); written.delete(path); }
    // animations: "<name> (<id>).blockyanim", read by the mod and turned into emotes in game
    const nd = await dir.getDirectoryHandle(ANIM_DIR, { create: true }), keepA = new Set();
    for (const k of (await db.keys('meta')).filter(k => String(k).startsWith('anim:'))) { const r = await db.get('meta', k); if (!r || !r.a) continue;
      if (!/^[0-9a-f-]{8,40}$/i.test(String(r.id))) continue; const name = `${safe(String(r.name).replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, '')).slice(0, 60).trim() || 'Animation'} (${r.id}).blockyanim`, path = ANIM_DIR + '/' + name,   /* the name the mod reads back: no line breaks, 60 at most, the id in brackets */ text = anim.write(r.a); keepA.add(path); if (written.get(path) === text) continue;
      const w = await (await nd.getFileHandle(name, { create: true })).createWritable(); await w.write(text); await w.close(); written.set(path, text); known.add(path); }
    const keepLow = new Set([...keepA].map(x => x.toLowerCase())); for (const path of [...known]) if (path.startsWith(ANIM_DIR + '/') && !keepA.has(path)) { if (keepLow.has(path.toLowerCase())) { known.delete(path); written.delete(path); continue; }   /* a rename that only changed case: on Windows it is the same file */ try { await nd.removeEntry(path.slice(ANIM_DIR.length + 1)); } catch { /* already gone */ } known.delete(path); written.delete(path); }
  } catch (e) { console.error(e); throw new Error('Could not write to your skins folder. Your skins are still saved in this browser.'); }
}
