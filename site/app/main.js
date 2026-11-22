import { OrbitControls } from '../vendor/OrbitControls.js';
import * as game from './game.js';
import * as db from './db.js';
import * as fig from './figure.js';
import * as store from './store.js';
import * as auth from './auth.js';
import * as assets from './assets.js';
import { createPainter, SHAPES, ONCE } from './paint.js';
import { icon as catIcon } from './icons.js';
import { toolIcon } from './toolicons.js';
import { createAnimate } from './animate.js';
import { SUPPORT_URL, MOD_URL } from './config.js';
const modLink = cls => /^https:\/\/(www\.)?curseforge\.com\/hytale\/[a-z-]+\/[a-z0-9-]{2,80}$/.test(MOD_URL) ? el('a', { class: 'btn ' + cls, href: MOD_URL, target: '_blank', rel: 'noopener noreferrer', text: 'Get the mod' }) : null;
// the footer's support link: only a Ko-fi page, and only when one is set
if (/^https:\/\/ko-fi\.com\/[A-Za-z0-9_]{2,60}$/.test(SUPPORT_URL)) { const a = document.getElementById('support'); if (a) { a.href = SUPPORT_URL; a.hidden = false; document.getElementById('supportdot').hidden = false; } }
import { rules, sanitize, cleanName, clip, parse, nice, LABEL, GROUPS, REQUIRED } from './skin.js';

const $ = id => document.getElementById(id);
// Every element is made here with textContent and properties: no HTML strings anywhere, so nothing typed, imported or looked up can inject markup.
function el(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) { if (v == null) continue;
    if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k === 'data') Object.assign(e.dataset, v); else if (k.includes('-') || k === 'role') e.setAttribute(k, v); else e[k] = v; }   // aria-*, data-* and role are attributes, not properties
  e.append(...kids.flat(Infinity).filter(k => k != null && k !== false));
  if (e.title && e.textContent.trim().toLowerCase().includes(e.title.trim().toLowerCase())) e.removeAttribute('title');   /* a tooltip that only repeats what is written is dropped */
  return e;
}
const VERSION = '0.1.0', REPO = 'https://github.com/King-Talon23/Hytale-Skin-Design-Website';
const HEX = /^#[0-9a-fA-F]{3,8}$/;
const store_ = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private window */ } } };
const say = (t, bad) => { const s = $('status'); s.textContent = t || ''; s.classList.toggle('bad', !!bad); clearTimeout(say.t); if (t) say.t = setTimeout(() => s.textContent = '', bad ? 8000 : 4000); };

// ---------------------------------------------------------------- dialogs
function ask(title, body, buttons) {
  const d = $('dlg'); $('dlgtitle').textContent = title; $('dlgbody').replaceChildren(...[].concat(body));
  $('dlgbtns').replaceChildren(...buttons.map(b => el('button', { class: 'btn ' + (b.primary ? 'primary' : b.danger ? 'danger' : 'ghost'), value: b.value, text: b.label })));
  const main = buttons.find(b => b.primary) || buttons.find(b => b.danger); let enter = null; d.onkeydown = e => { if (e.key === 'Enter' && main && e.target.matches?.('input:not([type=checkbox]):not([type=radio])')) { e.preventDefault(); d.close(main.value); enter && enter(main.value); } };   // Enter in a text box presses the main button, not Cancel
  let opener = document.activeElement; { const ca = opener?.closest?.('.cardacts'); if (ca && ca.previousElementSibling) opener = ca.previousElementSibling; } const rid = opener?.closest?.('[data-rid]')?.dataset.rid;   /* from a card menu: back to its ⋯ (found again by id if the list was redrawn) */
  return new Promise(ok => { let done = false; const end = v => { if (done) return; done = true; ok(v); setTimeout(() => { const ae = document.activeElement; if (!ae || ae === document.body || ae.closest?.('.cardacts')?.hidden) { if (opener?.isConnected) opener.focus(); else if (rid) setTimeout(() => document.querySelector(`[data-rid="${CSS.escape(rid)}"] .cardmenu`)?.focus(), 300); } }, 0); }; enter = end;   /* focus goes back to what opened the dialog */   /* Enter answers at once too (a close event can come late) */   /* a button answers at once; closing (Esc) answers too */
    for (const b of $('dlgbtns').children) b.addEventListener('click', e => { e.preventDefault(); d.close(b.value); end(b.value); });
    d.onclose = () => end(d.returnValue || ''); d.returnValue = ''; d.showModal(); const fi = $('dlgbody').querySelector('input[type=text]'); if (fi) { fi.focus(); fi.select(); } });   /* a name field opens selected, so typing replaces it */
}
const confirmBox = (title, text, yes, danger) => ask(title, el('p', { text }), [{ label: 'Cancel', value: '' }, { label: yes, value: 'yes', primary: !danger, danger }]).then(v => v === 'yes');
function download(name, data) { const a = el('a', { href: URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })), download: name }); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
async function readJsonFile(file, max = 2_000_000) { if (file.size > max) throw new Error('That file is too large.'); return JSON.parse(await file.text()); }

// ---------------------------------------------------------------- connect screen
const PATHS = { win: '%APPDATA%\\Hytale\\install\\release\\package\\game\\latest', mac: '~/Library/Application Support/Hytale/install/release/package/game/latest', linux: '~/.local/share/Hytale/install/release/package/game/latest' };
function showConnect() {
  const had = R && META; $('app').hidden = true; $('connect').hidden = false; if (!had) setConn(null);
  $('connback')?.remove(); if (had) $('connect').prepend(el('button', { id: 'connback', class: 'btn ghost', text: 'Back', onclick: () => { $('connback')?.remove(); $('connect').hidden = true; $('app').hidden = false; } }));   /* already connected: the files are still here, so Back returns to the app */
  const os = /Mac/i.test(navigator.platform) ? 'mac' : /Linux/i.test(navigator.platform) ? 'linux' : 'win';
  const pick = o => { $('path').textContent = PATHS[o]; for (const b of $('os').children) b.classList.toggle('on', b.dataset.os === o); };
  for (const b of $('os').children) b.onclick = () => pick(b.dataset.os); pick(os);
  $('copypath').onclick = async () => { try { await navigator.clipboard.writeText($('path').textContent); $('copypath').textContent = 'Copied'; } catch { $('copypath').textContent = 'Select and copy it'; } setTimeout(() => $('copypath').textContent = 'Copy path', 1800); };
  $('zipfile').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) doConnect(() => game.connect(f, progress)); };
  // Chrome and Edge: pick through the file-system picker so the site can remember this Assets.zip and re-read it after a game update
  if (typeof self.showOpenFilePicker === 'function') $('zipfile').parentElement.onclick = async e => { e.preventDefault(); if (connecting) return;
    let h; try { [h] = await showOpenFilePicker({ id: 'hytale-assets', types: [{ description: 'Hytale Assets.zip', accept: { 'application/zip': ['.zip'] } }] }); } catch { return; }   // cancelled
    connectHandle(h); };
  game.zipHandle().then(h => { const b = $('samezip'); if (b) b.remove(); if (!h) return;
    $('zipfile').parentElement.after(el('button', { id: 'samezip', class: 'btn ghost', text: 'Use the same Assets.zip again', onclick: () => connectHandle(h, true) })); });
}
// read Assets.zip from a remembered file handle; ask=true asks the browser for permission (needs a click)
async function connectHandle(h, ask) {
  if (ask && (await h.queryPermission({ mode: 'read' })) !== 'granted' && (await h.requestPermission({ mode: 'read' })) !== 'granted') return;
  doConnect(async () => { const f = await h.getFile(); await game.connect(f, progress); await game.rememberZip(h); });
}
// on every visit: if the remembered Assets.zip changed (a game update) and the browser still allows reading it, refresh quietly
async function checkGameUpdate(force) {
  const h = await game.zipHandle().catch(() => null); if (!h || !META) return;
  try { if ((await h.queryPermission({ mode: 'read' })) !== 'granted') return; const f = await h.getFile();
    if (!force && f.size === META.size && f.lastModified === META.modified && (META.v || 1) >= game.FILES_V) return;   // same file, and read with today's list of files
    say(force ? 'Reading your game files again…' : (META.v || 1) < game.FILES_V && f.size === META.size ? 'Reading a few more of your game files…' : 'Hytale updated, reading the new game files…'); BD_MADE.clear(); bdShown = null; await game.connect(f, () => {}); fig.clearCache(); pics.clear(); META = await game.status(); CAT = await game.catalog(); R = rules(CAT); registerAssets(); setConn(META); rebuild(); render(); say('Game files updated.');
  } catch (e) { console.warn('game update check', e); say('Could not read the updated game files', true); } }
// the browser forgets the read permission between visits: the first click of a visit asks for it once (Chrome then offers "Allow on every
// visit"), so a game update is picked up without the player connecting again
async function askZipOnce() { askZipOnce.done = true; const h = await game.zipHandle().catch(() => null); if (!h || !META) return;
  try { if ((await h.queryPermission({ mode: 'read' })) === 'prompt' && (await h.requestPermission({ mode: 'read' })) === 'granted') checkGameUpdate(); } catch { /* not allowed now */ } }
addEventListener('pointerdown', () => { if (!askZipOnce.done) askZipOnce(); }, { capture: true });
// Connect again: the remembered Assets.zip is read straight away (one click); only without one does the file picker come up
async function reconnect() { const h = await game.zipHandle().catch(() => null);
  if (!h) return showConnect();
  try { if ((await h.queryPermission({ mode: 'read' })) !== 'granted' && (await h.requestPermission({ mode: 'read' })) !== 'granted') return showConnect(); await h.getFile(); }
  catch { return showConnect(); }
  checkGameUpdate(true); }
function progress(p) { const b = $('progress'); b.hidden = false; b.firstElementChild.style.width = Math.round(p * 100) + '%'; b.lastElementChild.textContent = p < 1 ? `Reading your game files… ${Math.round(p * 100)}%` : 'Done'; }
let connecting = false;
async function doConnect(run) {
  if (connecting) return; connecting = true; $('connerr').textContent = ''; $('app').hidden = true; $('connect').hidden = false; progress(0);
  try { await run(); fig.clearCache(); await startApp(); }
  catch (e) { console.error(e); $('progress').hidden = true; $('connerr').textContent = (e && e.message) || 'Could not read that file.'; }
  connecting = false;
}
addEventListener('dragover', e => { if ([...e.dataTransfer.types].includes('Files')) { e.preventDefault(); $('drop').hidden = false; } });
addEventListener('dragleave', e => { if (!e.relatedTarget) $('drop').hidden = true; });
addEventListener('drop', e => { e.preventDefault(); $('drop').hidden = true; const fs = [...e.dataTransfer.files]; if (!fs.length) return;
  const zi = [...e.dataTransfer.items].findIndex(i => i.kind === 'file' && /\.zip$/i.test(i.getAsFile()?.name || '')), hp = zi >= 0 && e.dataTransfer.items[zi].getAsFileSystemHandle ? e.dataTransfer.items[zi].getAsFileSystemHandle() : null;
  const zip = fs.find(f => /\.zip$/i.test(f.name)); if (zip) return doConnect(async () => { await game.connect(zip, progress); const h = await hp?.catch(() => null); if (h && h.kind === 'file') await game.rememberZip(h); });
  if (R) importSkinFiles(fs); });
function setConn(meta) { const c = $('conn'); c.classList.toggle('ok', !!meta); c.lastElementChild.textContent = meta ? 'Game files connected' : 'Not connected'; c.onclick = () => { if (meta) return setTab('help'); showConnect(); const b = document.querySelector('#connect .btn.primary'); if (b) { b.focus(); b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash'); } };   /* already on the steps: point at the button */ }

// ---------------------------------------------------------------- app state
let CAT, R, st, META, tab = 'editor', group = 'Head', slot = 'haircut', filter = '';
let cur = { id: null, kind: null, slot: null, name: '', skin: null }, hist = [], hpos = -1, dirty = false, WARD = { game: [], custom: [] };
let FOLDER = { state: 'none' }, ACCOUNT = null, SHOWGAME = false;
let found = [];   // skins brought in this session by a lookup or from files; not saved until the player saves them

async function startApp() {
  META = await game.status(); CAT = await game.catalog(); R = rules(CAT); setConn(META); ASSETS = await assets.list().catch(() => []); registerAssets(); await applyRescue().catch(e => console.warn(e)); await loadLock(); await loadEmotes(); SHOWGAME = !!(await db.get('meta', 'showInGame').catch(() => false));
  $('connect').hidden = true; $('app').hidden = false;
  if (!st) { st = fig.stage($('view'), OrbitControls);
    ANIMATE = createAnimate({ el, st, render, say, ask, head, cat: () => CAT, nice, label: (g, n) => animLabel(g, n), idle: () => playAnim('Default', 'Idle', 0.5), tab: () => tab }); if (location.hostname.endsWith('localhost')) window.__an = ANIMATE;   // the Animate tab
    $('view').addEventListener('pointerdown', e => { if (tab !== 'animate' || !ANIMATE.active() || e.button !== 0 || st.gizmoBusy(e.clientX, e.clientY)) return; ANIMATE.pickAt(e.clientX, e.clientY); });
    if (location.hostname.endsWith('localhost')) { window.__st = st; window.__dbg = { combineWith: (...a) => combineWith(...a), combinePick: () => combinePick(), cat: () => CAT, ed: () => ED, sizeOf: sh => sizeOf(sh), colourPart: n => colourPart(n), geoTwin: n => geoTwin(n), boxes: () => boxesOf(ED.model).map(b => b.node.name) }; }   // local tests only
    st.onMissing = () => say('Missing game files for this move', true); st.onFacing(f => { const t = $('facing') || $('view').parentElement.appendChild(el('div', { id: 'facing', class: 'facing' })); t.textContent = 'Facing you: ' + f; }); bindPaint($('view'), e => ED && !ED.shapeOpen && ED.painter.tool !== 'select' ? st.pick(e.clientX, e.clientY, ED.canvas, ED.mirror) : null, 10, true);
    $('view').addEventListener('pointermove', e => { if (!ED) return; partHover(e); const p = ED.shapeOpen || ED.painter.tool === 'select' ? st.cursor(null) : st.cursor(e.clientX, e.clientY, ED.canvas, brushSize(), ED.mirror);
      ED.hover = p; ED.hoverM = p?.m || null; drawOvl(); });
    $('view').addEventListener('pointerleave', () => { if (!ED) return; st.cursor(null); ED.hover = ED.hoverM = null; drawOvl(); });
    st.afterShow = () => { outlineBox(); placeGizmo(); if (ED && ED.frame) { ED.frame = false; st.frameOn(ED.canvas); } };
    $('view').addEventListener('pointerdown', e => { if (!ED || !ED.shapeOpen || e.button !== 0 || (!ED.placing && st.gizmoBusy(e.clientX, e.clientY))) return;
      const mine = o => o.material?.map?.image === ED.canvas;
      if (ED.placing) { const h = st.pickHit(e.clientX, e.clientY, mine); if (!h) { say('Missed the item', true); return; } e.stopImmediatePropagation(); ED.placing = false; say("");
        const k = boxesOf(ED.model).findIndex(b => b.node.name === h.mesh.userData.nodeName); if (k >= 0) { ED.box = k; addBox('add', h); } return; }
      const hit = st.pickMesh(e.clientX, e.clientY, mine); if (!hit) return;
      const k = boxesOf(ED.model).findIndex(b => b.node.name === hit.userData.nodeName); if (k >= 0 && k !== ED.box) { ED.box = k; render(); placeGizmo(); return; }
      if (k >= 0 && ED.stool === 'move') dragBox(e, hit); }, true); }
  try { if (await store.resumeFolder(false)) await reloadAssets(); } catch (e) { console.warn(e); }
  FOLDER = await store.folderState(); WARD = await store.list(); ACCOUNT = await auth.account().catch(() => null); await loadPub();
  const movedOut = {}; for (const g of WARD.game) if (g && hasCustom(g.skin)) { try { const r = await store.saveGame(g.slot, g.name, g.skin); if (r.kind === 'custom') { await store.remove(g.id); movedOut[g.id] = r; } } catch (e) { console.warn(e); } }   /* older data: an in-game slot holding custom items moves to My skins */
  if (Object.keys(movedOut).length) WARD = await store.list();
  let draft = await db.get('meta', 'draft'); try { const q = JSON.parse(localStorage.getItem('se_draft') || 'null'); localStorage.removeItem('se_draft'); if (q && sanitize(q.skin) && (!draft || (q.t || 0) > (draft.t || 0))) { draft = q; db.put('meta', 'draft', q).catch(() => {}); } } catch { /* none */ }   /* and the stored draft catches up */   /* the outfit written at the last unload wins if newer */
  const ds = sanitize(draft?.skin);
  cur = ds ? { id: draft.id || null, kind: draft.kind || null, slot: draft.slot ?? null, name: cleanName(draft.name), skin: R.fit(ds), auto: !!draft.auto, random: !!draft.random } : { id: null, kind: null, slot: null, name: '', skin: R.blank() };
  if (cur.id && movedOut[cur.id]) { Object.assign(cur, { id: movedOut[cur.id].id, kind: 'custom', slot: null, name: movedOut[cur.id].name }); keepDraft(); }
  if (cur.id && ![...WARD.game, ...WARD.custom].some(r => r && r.id === cur.id)) { cur.id = null; cur.kind = null; }
  hist = [JSON.stringify(cur.skin)]; hpos = 0; dirty = false;
  { const rec = cur.id && [...WARD.game, ...WARD.custom].find(r => r && r.id === cur.id); if ((rec && (draft?.t || 0) > (rec.updated || 0) && JSON.stringify(R.fit(rec.skin)) !== JSON.stringify(cur.skin)) || (!cur.id && draft?.dirty)) { dirty = true; autosave(); }
    else if (rec && JSON.stringify(R.fit(rec.skin)) !== JSON.stringify(cur.skin)) { cur.skin = R.fit(rec.skin); hist = [JSON.stringify(cur.skin)]; keepDraft(); } }   /* only a newer draft wins over the saved skin; an older one gives way */   /* an unsaved look from before a reload still gets saved */   /* the draft is ahead of the saved skin: save it */
  playAnim('Default', 'Idle', 0.5); render(); rebuild(); pushWearing(); READY = true;
}
function open(rec, asNew, look) {   // put a skin on the stage: a wardrobe record, or a found skin (asNew); look = just looking (not sent to the game)
  if (flush.stuck && dirty) { ask('Not saved', el('p', { text: `My skins is full (${store.CUSTOM_MAX}), so this look isn't saved.` }), [{ label: 'Cancel', value: '' }, { label: 'Discard', value: 'yes', danger: true }]).then(v => { if (v === 'yes') { flush.stuck = false; dirty = false; open(rec, asNew, look); } }); return; }   /* never drops an unsaved look without asking */
  flush();
  cur = asNew ? { id: null, kind: null, slot: null, name: cleanName(rec.name), skin: R.fit(rec.skin) } : { id: rec.id, kind: rec.kind, slot: rec.slot ?? null, name: rec.name, skin: R.fit(rec.skin) };
  hist = [JSON.stringify(cur.skin)]; hpos = 0; dirty = !!asNew && !look; keepDraft();   /* just looking at someone's skin is not a change to save */ rebuild(); plate(); if (!look) pushWearing();
}
function setSkin(s, random = false) { cur.random = random; cur.skin = s; autosave(); pushWearing(); hist = hist.slice(0, hpos + 1); hist.push(JSON.stringify(s)); if (hist.length > 200) hist.shift(); hpos = hist.length - 1; dirty = true; keepDraft(); rebuild(); render(); }
function step(d) { const p = hpos + d; if (p < 0 || p >= hist.length) return; hpos = p; { const h = JSON.parse(hist[p]), f2 = R.fit(h); for (const k of Object.keys(h)) if (typeof h[k] === 'string' && h[k].startsWith('Custom_') && !f2[k] && cur.skin[k]) f2[k] = cur.skin[k]; cur.skin = f2; } dirty = true;   /* a deleted item's slot keeps what is worn now, never empty */   /* a deleted item never comes back through undo */ autosave(); pushWearing(); keepDraft(); rebuild(); render(); }
// the companion mod dresses you in game from "<skins folder>/Wearing.json"
function pushWearing() { clearTimeout(pushWearing.t); pushWearing.t = setTimeout(async () => {
  if (FOLDER.state !== 'on') return;
  try { await store.writeWearing(SHOWGAME ? { on: true, name: cur.name || 'New skin', keepOwn: store.keepOwnOf(cur.skin), skin: cur.skin } : { on: false }); } catch (e) { console.warn(e); } }, 400); }
function drawGameSwitch() { const b = $('ingame'); if (!b) return; b.hidden = FOLDER.state !== 'on'; b.classList.toggle('primary', SHOWGAME); b.classList.toggle('ghost', !SHOWGAME);
  b.textContent = SHOWGAME ? 'In game: on' : 'In game: off'; b.title = 'Skin Editor Sync mod'; }
const persist = c => c.kind === 'game' ? store.saveGame(c.slot, c.name, c.skin) : store.saveCustom(c.name, c.skin, c.id);
function autosave() { flush.stuck = false; clearTimeout(autosave.t); autosave.t = setTimeout(flush, 700); }   // every change saves itself; a new skin becomes "My skin N" in My skins on its first change
function restoreFrom(s, before, fs) { const o = { ...s }; for (const f of fs) { if (before[f] == null) delete o[f]; else o[f] = before[f]; } return o; }
function keptSkin() { const s = cur.skin; if (!ED || !ED.before || !ED.asset) return s; const f = ED.asset.field; if (ED.keeping) return restoreFrom(s, ED.before, HIDE[f] || []);   /* Wear was pressed: the item stays on */ return restoreFrom(s, ED.before, [f, ...(HIDE[f] || [])]); }   // an item worn only for editing is not saved into the skin
async function flush() { clearTimeout(autosave.t); if (ASIDE || !dirty) return flush.p; const was = cur, c = { ...cur, skin: keptSkin() };   /* saves queue up in order: a change made while one is writing is never dropped */
  flush.p = (flush.p || Promise.resolve()).then(() => saveSnap(was, c)); return flush.p; }
const GONE = new Set();   // skins deleted this session: a save already queued for one is dropped
async function saveSnap(was, c) { if (GONE.has(c.id) || (!c.id && GONE.has(was.id))) return; flush.busy = true; if (!c.id && was.id) c.id = was.id;   /* an earlier save in the queue already made the skin */
  try {
    if (c.kind === 'game' && hasCustom(c.skin)) { if (WARD.custom.length >= store.CUSTOM_MAX) { flush.stuck = true; plate(); say(`My skins is full (${store.CUSTOM_MAX})`, true); return; }   /* stops retrying until the next change */   /* an in-game slot can't hold custom items: the look is kept in My skins */
      const used = new Set(WARD.custom.map(r => r.name)); let n = c.name || 'My skin', k = 2; while (used.has(n)) n = cleanName(clip(c.name || 'My skin', 37) + ' ' + k++);
      const r = await store.saveCustom(n, c.skin); if (cur === was) Object.assign(cur, { id: r.id, kind: 'custom', slot: null, name: r.name, auto: false }); keepDraft(); WARD = await store.list(); if (cur === was && JSON.stringify(keptSkin()) === JSON.stringify(c.skin)) dirty = false; plate(); say("Custom items can't go in game slots: saved to My skins"); return; }
    if (!c.id) { if (WARD.custom.length >= store.CUSTOM_MAX) { flush.stuck = true; if (!flush.full) { flush.full = true; say(`My skins is full (${store.CUSTOM_MAX})`, true); } return; }
      const used = new Set([...WARD.custom, ...WARD.game.filter(Boolean)].map(r => r.name)); let k = 1, n; while (used.has(n = 'My skin ' + k)) k++;   /* the first free number, never a name an in-game slot already shows */
      const r = await store.saveCustom(n, c.skin); if (cur === was && !cur.id) Object.assign(cur, { id: r.id, kind: r.kind, slot: null, name: r.name, auto: true }); c.id = r.id; keepDraft();
      }
    else await persist(c);
    WARD = await store.list(); if (cur.id === c.id && JSON.stringify(keptSkin()) === JSON.stringify(c.skin)) dirty = false; plate();
  } catch (e) { console.error(e); say(e.message || 'Could not save.', true); }
  finally { flush.busy = false; if (dirty && cur.id && !flush.stuck) { clearTimeout(autosave.t); autosave.t = setTimeout(flush, 700); } } }
function keepDraft() { clearTimeout(keepDraft.t); keepDraft.t = setTimeout(() => !ASIDE && db.put('meta', 'draft', { id: cur.id, kind: cur.kind, slot: cur.slot, name: cur.name, skin: keptSkin(), auto: !!cur.auto, random: !!cur.random, t: Date.now() }).catch(() => {}), 300); }
let building = 0;
async function rebuild() { const my = ++building, stg = $('view').parentElement, slow = setTimeout(() => stg.classList.add('loading'), 300);   // a slow build says so instead of an empty stage
  try { const root = await fig.build(cur.skin, R); if (my !== building) return fig.dispose(root); st.show(root); }
  catch (e) { console.error(e); if (my === building) say('Could not build this skin: ' + e.message, true); }
  finally { clearTimeout(slow); if (my === building) stg.classList.remove('loading'); } }
let peekT;
function peek(part) { peek.part = part; clearTimeout(peekT); peekT = setTimeout(async () => { const my = ++building;
  try { const root = await fig.build(part === undefined ? cur.skin : { ...cur.skin, [slot]: part }, R); if (my !== building) return fig.dispose(root); st.show(root); } catch (e) { console.warn(e); } }, part === undefined ? 140 : 120); }
let scrolledAt = 0; addEventListener('wheel', () => { scrolledAt = performance.now(); }, { passive: true, capture: true }); addEventListener('scroll', () => { scrolledAt = performance.now(); }, { passive: true, capture: true });   // cards sliding under a resting pointer while scrolling don't count as hovering
const hover = part => ({ onpointerenter: e => { if (e.pointerType === 'mouse' && performance.now() - scrolledAt > 300) peek(part); }, onpointermove: e => { if (e.pointerType === 'mouse' && performance.now() - scrolledAt > 300 && peek.part !== part) peek(part); }, onpointerleave: e => { if (e.pointerType === 'mouse') peek(); } });
function plate() {
  const tag = cur.kind === 'game' ? ['In-game slot ' + (cur.slot + 1), 'game'] : cur.kind === 'custom' ? ['My skin', 'custom'] : ['Not saved', 'none'];
  $('nameplate').replaceChildren(el('b', { text: cur.name || 'New skin' }), el('span', { class: 'tag ' + tag[1], text: tag[0] }), ...(cur.id ? [el('span', { class: 'tag none', text: dirty ? (flush.stuck ? 'Not saved' : 'Saving…') : 'Saved' })] : []));
  $('undo').disabled = hpos <= 0; $('redo').disabled = hpos >= hist.length - 1;
}

// ---------------------------------------------------------------- pictures: one at a time, only for tiles on screen
let jobGen = 0; const pics = new Map(); let chain = Promise.resolve();
const HEADF = new Set(['face', 'eyes', 'eyebrows', 'mouth', 'ears', 'haircut', 'facialHair', 'headAccessory', 'faceAccessory', 'earAccessory']), LEGF = new Set(['pants', 'overpants', 'shoes', 'underwear']);
const BASE = ['bodyCharacteristic', 'face', 'eyes', 'eyebrows', 'mouth', 'ears', 'underwear'];
// pictures of game items are also kept in this browser (per game version), so the next visit shows them at once instead of drawing each again;
// a custom piece in the picture is named with the time it was last changed, so a repaint makes a new picture
const THUMB_V = 2, keepKey = key => { if (!META) return null; let gone = false;
  const k = key.replace(/Custom_([A-Za-z0-9_-]+)/g, (m, id) => { const a = ASSETS.find(x => x.id === id); if (!a || !a.updated) gone = true; return m + '@' + (a && a.updated); });
  return gone ? null : THUMB_V + '|' + META.size + '|' + META.modified + '|' + k; };
function picture(key, make) { if (pics.has(key)) return Promise.resolve(pics.get(key)); const gen = jobGen, kk = keepKey(key);
  return (kk ? db.get('thumbs', kk).catch(() => null) : Promise.resolve(null)).then(saved => { if (saved) { pics.set(key, saved); return saved; }
    return chain = chain.then(async () => { if (gen !== jobGen) return undefined; if (pics.has(key)) return pics.get(key);
      try { const u = await make(); pics.set(key, u); if (pics.size > 1500) pics.delete(pics.keys().next().value); if (kk) db.put('thumbs', kk, u).catch(() => {}); await new Promise(r => setTimeout(r)); return u; } catch (e) { console.warn(e); return null; } }); }); }
// the kept pictures are dropped when the game files change, or when there are a lot of them
async function trimThumbs() { try { const ks = await db.keys('thumbs'), pre = keepKey(''); if (ks.length > 3000 || ks.some(k => !k.startsWith(pre))) await db.clear('thumbs'); } catch { /* no store yet */ } }
const lazy = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) { lazy.unobserve(e.target); e.target._load?.(); } }, { rootMargin: '200px' });
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';   // a picture that could not be drawn stops pulsing
const lastPic = new Map();   // the previous picture of a tile stays up until its new one is drawn
function lazyImg(key, make, prev) { const img = el('img', { alt: '', draggable: false });
  if (pics.has(key)) { img.src = pics.get(key); if (prev) lastPic.set(prev, img.src); }
  else { if (prev && lastPic.has(prev)) img.src = lastPic.get(prev);
    img._load = async () => { const u = await picture(key, make); if (u) { img.src = u; if (prev) lastPic.set(prev, u); } else if (u === null && !img.src) img.src = BLANK; }; lazy.observe(img); }
  return img; }
// in a picture of one face item, the things that would cover it come off (a hood hides hair, a beard hides the mouth ...)
const HIDE = { haircut: ['headAccessory'], face: ['headAccessory', 'faceAccessory', 'facialHair', 'haircut'], eyes: ['headAccessory', 'faceAccessory', 'haircut'],
  eyebrows: ['headAccessory', 'faceAccessory', 'haircut'], mouth: ['headAccessory', 'faceAccessory', 'facialHair'], facialHair: ['headAccessory', 'faceAccessory'],
  skinFeature: ['headAccessory', 'faceAccessory', 'facialHair'], ears: ['headAccessory', 'haircut', 'earAccessory', 'faceAccessory', 'facialHair'], earAccessory: ['headAccessory', 'haircut', 'faceAccessory', 'facialHair'], faceAccessory: ['headAccessory'],
  gloves: ['overtop', 'cape'], overpants: ['shoes', 'pants'], underwear: ['pants', 'overpants', 'undertop', 'overtop', 'cape', 'shoes'], undertop: ['overtop', 'cape'], pants: ['cape', 'shoes', 'overpants'], shoes: ['cape'] };
const FACE_FRAME = { face: 'face', eyes: 'face', eyebrows: 'face', mouth: 'face', facialHair: 'face', faceAccessory: 'face', ears: 'ear', earAccessory: 'ear',
  headAccessory: 'hat', haircut: 'head', pants: 'pants', overpants: 'socks', shoes: 'shoes', gloves: 'gloves', underwear: 'hips', undertop: 'top', overtop: 'top' };
// pieces that hide the one in the picture: a coat over the gloves, boots over the socks, trousers over underwear
function bareSkin(f, part) {   // the character stripped to the body, its face and boxers, plus one part in slot f (null for none)
  const keep = new Set(['bodyCharacteristic', 'face', 'eyes', 'mouth', 'ears']), boxer = R.ITEMS.underwear.find(e => e.Id === 'Boxer');
  const s = Object.fromEntries(Object.entries(cur.skin).map(([k, v]) => [k, keep.has(k) ? v : null])); s.underwear = boxer ? R.partStr(boxer) : cur.skin.underwear;
  if (f && (part || !keep.has(f) && f !== 'underwear')) s[f] = part; return s; }
function itemThumb(f, it, color, variant, bare) {   // the current character, wearing this option (bare: in boxers with only this option)
  let s = { ...cur.skin, [f]: it ? R.partStr(it, color, variant) : null }; for (const k of HIDE[f] || []) s[k] = null;
  if (bare || f === 'bodyCharacteristic') s = bareSkin(f, s[f]);   // a body is always shown bare
  const frame = FACE_FRAME[f] || (HEADF.has(f) ? 'head' : LEGF.has(f) ? 'legs' : f === 'bodyCharacteristic' || f === 'skinFeature' ? 'body' : 'torso');
  return lazyImg('i|' + f + '|' + JSON.stringify(s), async () => fig.snapshot(await fig.build(s, R), frame, f === 'cape'), f + '|' + (it ? it.Id : 'none') + (bare ? '|bare' : ''));
}
// an animation's picture: the current skin caught part-way through the move
function animThumb(g, n) { const s = R.fit(cur.skin);
  return lazyImg('a|' + g + '|' + n + '|' + JSON.stringify(s), async () => { const [root, a] = await Promise.all([fig.build(s, R), fig.loadAnim(g, n)]);
    const an = new fig.Animator(); an.setFigure(root); an.set(a, 1, true); an.t = an.duration * 0.45; an.apply(); return fig.snapshot(root, g === 'Expressions' ? 'head' : 'full'); }, 'anim|' + g + '|' + n); }   // faces are pictured close, so they can be told apart
const portrait = skin => { const s = R.fit(skin); return lazyImg('p|' + JSON.stringify(s), async () => fig.snapshot(await fig.build(s, R), 'full')); };

// ---------------------------------------------------------------- panels
let ANIMATE = null;
function setTab(t) { if (t !== 'editor' && picking) leavePicker();
  if (t !== tab && tab === 'animate' && ANIMATE) { ANIMATE.leave(); if (R) playAnim('Default', 'Idle', 0.5); }   // leaving Animate saves and puts the idle back
  // opening or leaving the Animations tab stops whatever move is playing (and drops what it holds)
  if (t !== tab && (t === 'animations' || tab === 'animations') && R && !(playing.group === 'Default' && playing.name === 'Idle')) playAnim('Default', 'Idle', 0.5);
  if (t !== tab && (t === 'animations' || tab === 'animations') && st) st.unclose();   /* in and out of Animations the view returns to the front framing (a move's own camera stays behind) */   // moves are watched whole, from the front, not from a Wardrobe close-up
  if (ED && t !== 'creator') closeAsset(true).then(() => { playAnim('Default', 'Idle', 0.5); rebuild(); render(); });   // render again once the piece is closed, or the editor (and its tool tip) stays up under the new tab
  tab = t; for (const b of $('tabs').children) b.classList.toggle('on', b.dataset.tab === t);
  const on = $('tabs').querySelector('.on'), nav = on?.parentElement;   // on a phone the tab row scrolls sideways: keep the open tab in view
  if (nav && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: nav.scrollLeft + on.getBoundingClientRect().left - nav.getBoundingClientRect().left - (nav.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' });
  if (R) render(); }
let pressing = false, renderLater = false;
const flushRender = () => { pressing = false; if (renderLater) { renderLater = false; render(); } };
addEventListener('pointerdown', e => { if (e.target.closest?.('button, a, summary, label, select, .skin')) { pressing = true; setTimeout(flushRender, 1500); } }, true);
for (const ev of ['pointerup', 'pointercancel']) addEventListener(ev, () => { if (pressing) setTimeout(flushRender, 0); }, true);
function viewInset() {   // the character is centred above the buttons at the bottom of the view, not behind them
  const stg = $('view')?.parentElement, bar = stg?.querySelector('.bar'); if (!st || !stg) return; if (stg.classList.contains('clean')) return;   // Clean view keeps the same picture centre as with the buttons
  const on = bar && bar.offsetParent && !stg.classList.contains('clean') && !$('app').classList.contains('ws');
  const em = stg.querySelector('.emotes'), sr = stg.getBoundingClientRect(), emOn = on && em && em.offsetParent && em.getBoundingClientRect().height > 0;
  const bh = on ? sr.bottom - bar.getBoundingClientRect().top : 0; stg.style.setProperty('--bar', bh + 'px');
  st.inset(bh, emOn ? sr.right - em.getBoundingClientRect().left + 4 : 0); if (!viewInset.ro) { viewInset.ro = new ResizeObserver(() => viewInset()); viewInset.ro.observe(stg); } }
function render() { if (pressing) { renderLater = true; return; } jobGen++; plate(); drawEmotes(); drawTransport(); drawStageBtns(); drawGameSwitch(); outlineBox(); viewInset();
  if (!!ED !== $('app').classList.contains('ws')) scrollTo(0, 0);   // opening or closing the Creator workspace starts at the top of the page
  $('app').classList.toggle('ws', !!ED); $('app').classList.toggle('ws-tex', !!ED); /* the texture panel is always there in the Creator */ if (ED && document.querySelector('input.rename:not([data-done])')) return;   /* a part being renamed: the redraw waits (the click that opened it redraws a moment later) */
  if (ED) { const fa = document.activeElement, fk = fa && fa !== document.body && fa.closest?.('#app') ? (fa.dataset?.fk || [fa.tagName, fa.textContent, fa.title || fa.getAttribute('aria-label') || ''].join('|')) : null, pb_ = ED.box_, sl = pb_?.scrollLeft, stp = pb_?.scrollTop; const r_ = renderWorkspace(); if (pb_ && ED.box_ === pb_) { pb_.scrollLeft = sl; pb_.scrollTop = stp; }   /* the zoomed texture view stays where it was */ if (fk && !document.activeElement?.closest?.('#app')) { const m = [...document.querySelectorAll('#app button, #app input, #app select')].find(x => (x.dataset?.fk || [x.tagName, x.textContent, x.title || x.getAttribute('aria-label') || ''].join('|')) === fk); m?.focus(); } return r_; }   /* keyboard focus stays on the control after the panel redraws */ const p = $('panel'), was = p.className, top = p.querySelector('.pbody')?.scrollTop || 0; p.className = 'panel tab-' + tab;
  p.replaceChildren(...({ editor: panelEditor, wardrobe: panelWardrobe, animations: panelAnimations, animate: () => ANIMATE.panel(), lookup: panelLookup, creator: panelCreator, help: panelHelp }[tab])());
  if (was === p.className && top) { const b = p.querySelector('.pbody'); if (b) b.scrollTop = top; } }
// our own small symbols for the category rail (drawn here, not taken from the game)
const ICON = { Head: 'M6 3h12v13H6zM9 8v3h2V8zM13 8v3h2V8zM9 17h6v4H9z', Body: 'M9 2h6v6H9zM7 9h10v8H7zM3 9h3v8H3zM18 9h3v8h-3zM8 18h3v4H8zM13 18h3v4h-3z',
  Torso: 'M8 3l4 2 4-2 5 3-2 4-2-1v12H7V9l-2 1-2-4z', Legs: 'M6 3h12l1 18h-5l-2-11-2 11H5z', Capes: 'M8 3h8l4 18-4-2-4 2-4-2-4 2z' };
const SLOT_ICON = { haircut: 'M5 13V8l2-4 3 2 2-3 2 3 3-2 2 4v5h-3V9H8v4z', eyebrows: 'M3 11l7-3 1 2-7 3zM21 11l-7-3-1 2 7 3z', eyes: 'M3 8h8v8H3zM13 8h8v8h-8zM6 11v3h3v-3zM15 11v3h3v-3z',
  facialHair: 'M5 5h3v6h8V5h3v10l-4 5H9l-4-5z', headAccessory: 'M7 6h10v8h5v3H2v-3h5z', faceAccessory: 'M2 9h9v6H2zM13 9h9v6h-9zM4 11v2h5v-2zM15 11v2h5v-2z',
  earAccessory: 'M11 2h2v5h-2zM7 13a5 5 0 1 0 10 0a5 5 0 1 0-10 0zM10 13a2 2 0 1 1 4 0a2 2 0 1 1-4 0z', bodyCharacteristic: ICON.Body, face: 'M5 4h14v16H5zM8 9v3h2V9zM14 9v3h2V9zM9 15v2h6v-2z',
  mouth: 'M3 9h18v3l-3 5H6l-3-5zM6 12v1h12v-1z', ears: 'M8 20V9l10-6-3 9v8z', skinFeature: 'M5 6h3v3H5zM14 4h3v3h-3zM10 11h3v3h-3zM17 12h3v3h-3zM5 15h3v3H5zM13 18h3v3h-3z',
  underwear: 'M4 6h16v6l-6 6h-4l-6-6z', undertop: ICON.Torso, overtop: 'M8 3l4 3 4-3 5 3-2 4-2-1v12h-4V8l-1 1-1-1v13H7V9l-2 1-2-4z', gloves: 'M7 21v-8L5 9l2-1 2 3V4h2v6h1V3h2v7h1V5h2v9l-2 7z',
  pants: ICON.Legs, overpants: 'M9 3h7v10l4 4v4H9z', shoes: 'M6 4h7v9l7 3v5H6z', cape: ICON.Capes };
function icon(d) { const NS = 'http://www.w3.org/2000/svg', s = document.createElementNS(NS, 'svg'), p = document.createElementNS(NS, 'path');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); p.setAttribute('d', d); p.setAttribute('fill-rule', 'evenodd'); s.append(p); return s; }
const head = (title, right) => el('div', { class: 'phead' }, el('h2', { text: title }), right);

// ---------------------------------------------------------------- the locker: every slot at a glance, and a picker per slot
const TIERS = ['Standard', 'Base', 'Supporter', 'Cursebreaker', 'Event'];
function tierOf(e) {   // from how the game unlocks the item (its entitlements), standing in for rarity
  if (!e || e.custom) return 0; const t = Array.isArray(e.Entitlements) ? e.Entitlements : []; if (!t.length) return 0;
  if (t.some(x => !String(x).startsWith('game.'))) return 4; if (t.includes('game.base')) return 1; if (t.includes('game.deluxe')) return 2; return 3;
}
const tierClass = e => e && e.custom ? 'mine' : 't' + tierOf(e);
let LOCK = { favs: new Set(), seen: null, recent: {} }, picking = false, slotScroll = 0, seenSlot = null, lockFilter = 'all', lockSort = 'up';
const favKey = (f, e) => f + '|' + e.Id, isNew = (f, e) => !e.custom && LOCK.seen && !LOCK.seen.has(favKey(f, e));
const saveLock = () => db.put('meta', 'locker', { favs: [...LOCK.favs], seen: [...LOCK.seen], recent: LOCK.recent }).catch(() => {});
// the last items worn in each slot, newest first, for the picker's Recent filter
const noteWorn = (f, e) => { if (!e) return; const l = (LOCK.recent[f] || []).filter(id => id !== e.Id); l.unshift(e.Id); LOCK.recent[f] = l.slice(0, 12); saveLock(); };
async function loadLock() {
  const m = await db.get('meta', 'locker').catch(() => null), all = game.FIELDS.flatMap(f => R.ITEMS[f].filter(e => !e.custom).map(e => favKey(f, e)));
  LOCK.favs = new Set(m?.favs || []); LOCK.recent = m && m.recent && typeof m.recent === 'object' ? m.recent : {}; LOCK.seen = m ? new Set(m.seen || []) : new Set(all); if (!m) saveLock();   // on a first visit nothing counts as new
}
function leavePicker() { if (peek.part !== undefined) peek();   /* a hover preview never outlives the picker (leaving by keyboard sends no pointerleave) */ if (seenSlot) { for (const e of R.ITEMS[seenSlot]) if (!e.custom) LOCK.seen.add(favKey(seenSlot, e)); saveLock(); seenSlot = null; } picking = false; }
function variantName(it, v) { const nk = it?.Variants?.[v]?.NameKey; return (nk && CAT.names[nk]) || nice(v); }
function lookCard(r, kind) { return el('button', { class: 'look ' + kind + (cur.id === r.id ? ' on' : ''), title: r.name, onclick: () => open(r) }, portrait(r.skin)); }
function panelEditor() { return picking ? panelPicker() : panelLocker(); }
function panelLocker() {
  const tile = f => { const it = R.find(f, cur.skin[f]), { color, variant } = parse(cur.skin[f]);
    return el('button', { class: 'slot ' + (it ? tierClass(it) : 'none'), title: LABEL[f], onclick: () => { scrolledAt = performance.now(); slotScroll = document.querySelector('.panel .pbody')?.scrollTop || 0; slot = f; picking = true; seenSlot = f; filter = ''; lockFilter = 'all'; render(); for (const p of document.querySelectorAll('.pbody')) p.scrollTop = 0; } },
      it ? itemThumb(f, it, color, variant) : el('span', { class: 'nothing', text: '—' }),
      el('i', {}, icon(SLOT_ICON[f]), el('span', { text: LABEL[f] })), el('b', { text: it ? itemName(it) : 'None' })); };
  const looks = [...WARD.game.filter(Boolean).map(r => lookCard(r, 'game')), ...WARD.custom.map(r => lookCard(r, 'custom'))];
  return [head('Wardrobe'), el('div', { class: 'pbody locker' },
    GROUPS.map(([g, fs]) => { const fields = fs.filter(f => R.ITEMS[f].length); return fields.length ? [el('h3', { text: g }), el('div', { class: 'slots' }, fields.map(tile))] : null; }),
    el('h3', { text: 'Saved looks' }), el('div', { class: 'looks' }, looks, el('button', { class: 'look add', title: 'Save look', text: '+', onclick: saveAs })))];
}
function panelPicker() {
  const f = slot, it = R.find(f, cur.skin[f]), { color, variant } = parse(cur.skin[f]);
  const change = (item, c, v) => { if (item !== it) noteWorn(f, it); noteWorn(f, item); setSkin({ ...cur.skin, [f]: R.partStr(item, c, v) }); };
  const all = oneEach(R.ITEMS[f].filter(e => e === it || !isTmp(e))).concat(it && !it.custom && !oneEach(R.ITEMS[f]).includes(it) ? [it] : []), tiersHere = [...new Set(all.filter(e => !e.custom).map(tierOf))].sort();
  const recentIds = (LOCK.recent[f] || []).filter(id => all.some(e => e.Id === id));
  const counts = { recent: recentIds.length, fav: all.filter(e => LOCK.favs.has(favKey(f, e))).length, new: all.filter(e => isNew(f, e)).length, mine: all.filter(e => e.custom).length }; if ((lockFilter === 'mine' && !counts.mine) || (lockFilter === 'new' && !counts.new)) lockFilter = 'all';   /* a filter that emptied goes back to All */
  const chip = (id, label) => el('button', { class: 'chip' + (lockFilter === id ? ' on' : ''), text: label, onclick: () => { lockFilter = id; sortBox.hidden = id !== 'all'; drawCards(); for (const c of bar.querySelectorAll('.chip[data-f]')) c.classList.toggle('on', c.dataset.f === id); }, data: { f: id } });
  const sortBox = el('select', { class: 'sort', 'aria-label': 'Order', hidden: lockFilter !== 'all', onchange: e => { lockSort = e.target.value; drawCards(); } },
    [['up', 'Standard first'], ['down', 'Rarest first']].map(([v, t]) => el('option', { value: v, text: t, selected: v === lockSort })));
  const bar = el('div', { class: 'options lockbar' }, chip('all', 'All'), chip('fav', counts.fav ? `★ Favourites ${counts.fav}` : '☆ Favourites'), counts.recent > 1 ? chip('recent', 'Recent') : null, counts.new ? chip('new', `New ${counts.new}`) : null,
    tiersHere.length > 1 ? tiersHere.map(t => chip('t' + t, TIERS[t])) : null, counts.mine ? chip('mine', 'Custom') : null,
    sortBox);
  const detail = el('div', { class: 'detail' }), showDetail = (e, trying) => { const t = e ? (e.custom ? 'Site only' : TIERS[tierOf(e)]) : '';
    detail.classList.toggle('trying', !!trying); detail.replaceChildren(el('span', { class: 'dim', text: trying ? 'Trying on: ' : 'Wearing: ' }), el('b', { text: e ? itemName(e) : 'None' }), el('span', { text: ' · ' + LABEL[f] }), el('em', { class: e ? tierClass(e) : '', text: t })); };
  const cardsBox = el('div', { class: 'cards lcards' });
  function drawCards() {
    const q = filter.toLowerCase(); let items = all.filter(e => itemName(e).toLowerCase().includes(q));
    if (lockFilter === 'fav') items = items.filter(e => LOCK.favs.has(favKey(f, e))); else if (lockFilter === 'recent') items = recentIds.map(id => items.find(e => e.Id === id)).filter(Boolean); else if (lockFilter === 'new') items = items.filter(e => isNew(f, e));
    else if (lockFilter === 'mine') items = items.filter(e => e.custom); else if (/^t\d$/.test(lockFilter)) items = items.filter(e => !e.custom && 't' + tierOf(e) === lockFilter);
    const dir = lockFilter === 'all' && lockSort === 'down' ? -1 : 1, rank = e => e.custom ? 5 : tierOf(e);   // the game's order inside each tier; custom assets last
    const pin = e => lockFilter === 'all' && LOCK.favs.has(favKey(f, e)) ? 0 : 1;   // starred items sit at the top of All
    if (lockFilter !== 'recent') items = items.map((e, i) => [e, i]).sort((a, b) => pin(a[0]) - pin(b[0]) || (rank(a[0]) - rank(b[0])) * dir || a[1] - b[1]).map(x => x[0]);
    const card = e => { const part = e ? R.partStr(e, color, variant) : null, hv = hover(part), k = e && favKey(f, e), fav = e && LOCK.favs.has(k);
      const star = e ? el('span', { class: 'star' + (fav ? ' on' : ''), role: 'button', title: fav ? 'Remove from favourites' : 'Add to favourites', text: fav ? '★' : '☆',
        onclick: ev => { ev.stopPropagation(); LOCK.favs.has(k) ? LOCK.favs.delete(k) : LOCK.favs.add(k); saveLock(); render(); } }) : null;
      const a = e?.custom && ASSETS.find(x => 'Custom_' + x.id === e.Id);
      const bin = a ? el('span', { class: 'bin' + (fav ? ' off' : ''), role: 'button', title: fav ? 'Unstar to delete' : 'Delete', text: '🗑',
        onclick: ev => { ev.stopPropagation(); if (fav) { say('Unstar to delete', true); return; } guard(() => deleteAsset(a))(); } }) : null;   /* deletes at once; the status bar offers Undo */
      return el('button', { class: 'lcard ' + (e ? tierClass(e) : 'none') + ((e?.Id ?? null) === (it?.Id ?? null) ? ' on' : ''), 'aria-label': e ? itemName(e) + (fav ? ', favourite' : '') : 'None', 'aria-keyshortcuts': star ? 'F' + (bin ? ' Delete' : '') : null, onclick: () => change(e, color, variant), onkeydown: ev => { if (ev.ctrlKey || ev.metaKey || ev.altKey) return; if (star && (ev.key === 'f' || ev.key === 'F')) { ev.preventDefault(); const nm = itemName(e); star.click(); setTimeout(() => [...document.querySelectorAll('button.lcard')].find(b => (b.getAttribute('aria-label') || '').replace(/, favourite$/, '') === nm)?.focus(), 80); } else if (bin && ev.key === 'Delete') { ev.preventDefault(); bin.click(); } },   /* keyboard: F stars, Delete deletes (the icons inside the card can't take focus) */
        onpointerenter: ev => { hv.onpointerenter(ev); if (peek.part === part) showDetail(e, e !== it); }, onpointermove: ev => { if (peek.part === part) return; hv.onpointermove(ev); if (peek.part === part) showDetail(e, e !== it); }, onpointerleave: ev => { hv.onpointerleave(ev); showDetail(it); } },
        e ? itemThumb(f, e, color, variant) : el('span', { class: 'nothing', text: '✕' }), star, bin, e && isNew(f, e) ? el('span', { class: 'new', text: 'NEW' }) : null, el('b', { text: e ? itemName(e) : 'None' })); };
    cardsBox.replaceChildren(...(REQUIRED.has(f) || lockFilter !== 'all' ? [] : [card(null)]), ...items.map(card));
    if (!items.length) cardsBox.append(el('p', { class: 'blank', text: filter.trim() ? 'No results' : lockFilter === 'fav' ? 'No favourites' : 'Nothing here.' }));
  }
  drawCards(); showDetail(it);
  const search = el('input', { type: 'search', placeholder: 'Search', value: filter, maxLength: 40, oninput: e => { filter = e.target.value; if (peek.part !== undefined) { peek(); showDetail(it); } drawCards(); } });
  const cols = it ? R.colorsOf(it, variant) : [], vs = it?.Variants ? Object.keys(it.Variants) : [];
  const swatches = el('div', { class: 'swatches' }, cols.map(([k, base]) => { const b = el('button', { title: nice(k), class: k === color ? 'on' : '', onclick: () => change(it, k, variant), ...hover(R.partStr(it, k, variant)) });
    const ok = (Array.isArray(base) ? base : [base]).filter(c => HEX.test(c)); b.style.background = ok.length > 1 ? `linear-gradient(135deg, ${ok.join(',')})` : ok[0] || '#888'; return b; }));
  const options = el('div', { class: 'options' }, vs.map(v => el('button', { class: 'chip' + (v === (variant || vs[0]) ? ' on' : ''), text: variantName(it, v), onclick: () => change(it, color, v), ...hover(R.partStr(it, color, v)) })));
  return [head('Wardrobe'), el('div', { class: 'pbody' },
    el('div', { class: 'pickhead' }, el('button', { class: 'btn ghost', text: '‹ Wardrobe', onclick: () => { leavePicker(); render(); const pb = document.querySelector('.panel .pbody'); if (pb) pb.scrollTop = slotScroll; } }), icon(SLOT_ICON[f]), el('b', { text: LABEL[f] })),
    el('div', { class: 'row' }, search, locked('Owned only', 'the owned cosmetics filter', 'chip')), bar, cardsBox, el('div', { class: 'pickfoot' }, detail,
    it?.custom ? (() => { const a = ASSETS.find(x => 'Custom_' + x.id === it.Id);
      return a ? [el('h3', { text: 'Colour' }), el('button', { class: 'btn ghost small', text: 'Edit in Creator', onclick: guard(() => openAsset(a)) })] : null; })()
      : cols.length ? [el('h3', { text: 'Colour' }), swatches] : null, vs.length > 1 ? [el('h3', { text: 'Option' }), options] : null))];
}
// top-left of the stage: the background behind the character, and a clean view with the controls hidden (for a good look or a screenshot).
// Studio is the site's own; the others are built from the player's game files, so they look the way those places look in the game at noon.
const BACKDROPS = [['dark', 'Studio'], ...Object.entries(game.SCENES).map(([k, b]) => [k, b.name])];
const hexIn = v => { const m = /#([0-9a-f]{6})/i.exec(String(v || '')); return m ? '#' + m[1].toLowerCase() : null; };
function atNoon(keys) {   // a weather's colour keys [{Hour, Color}] at 12:00, blended between the keys either side (round midnight if need be)
  const ks = (Array.isArray(keys) ? keys : []).map(k => ({ h: +k.Hour, c: hexIn(k.Color) })).filter(k => k.c && Number.isFinite(k.h)).sort((x, y) => x.h - y.h); if (!ks.length) return null;
  const lo = ks.filter(k => k.h <= 12).pop() || { ...ks[ks.length - 1], h: ks[ks.length - 1].h - 24 }, hi = ks.find(k => k.h >= 12) || { ...ks[0], h: ks[0].h + 24 };
  if (hi.h === lo.h) return lo.c; const t = (12 - lo.h) / (hi.h - lo.h), A = hexRgb(lo.c), B = hexRgb(hi.c);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
const BD_MADE = new Map();
async function backdropSpec(key) {   // the sky and fog colours of the zone's weather at noon, and the biome colour its grass takes
  if (BD_MADE.has(key)) return BD_MADE.get(key); const sc = game.SCENES[key], w = await game.json(sc.weather);
  const top = atNoon(w.SkyTopColors), fog = atNoon(w.FogColors) || top; if (!top) throw new Error('no sky colours in ' + sc.weather);
  const tint = sc.tintFrom ? hexIn((/"Color"\s*:\s*"(#[0-9a-fA-F]{6})"/.exec(JSON.stringify(await game.json(sc.tintFrom))) || [])[1]) : null;
  const spec = { sky: { top, fog }, sc, tint }; BD_MADE.set(key, spec); return spec; }
let bdShown = null;
async function showBackdrop(key) {
  if (!st || key === bdShown) return; bdShown = key;
  if (key === 'dark') return st.setBackdrop(null);
  const stg = $('view').parentElement, slow = setTimeout(() => stg.classList.add('loading'), 250);   // a place that takes a moment to build says so
  try { const spec = await backdropSpec(key); if (bdShown === key) await st.setBackdrop(spec.sky, spec.sc, spec.tint); }
  catch (e) { console.warn('backdrop', e); bdShown = 'dark'; st.setBackdrop(null); store_.set('se_backdrop', 'dark'); drawStageBtns();
    say('Missing game files for this background', true); }
  finally { clearTimeout(slow); stg.classList.remove('loading'); } }
async function savePicture(transparent) {   // a PNG of the stage: the scene as shown, or the character on transparency
  const shot = st.capture(transparent); let url = shot.url;
  if (!transparent && !shot.sky) { const img = new Image(); img.src = url; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); const g = x.createRadialGradient(c.width * 0.5, c.height * 0.4, 0, c.width * 0.5, c.height * 0.4, Math.max(c.width, c.height) * 0.75); g.addColorStop(0, '#1d3a3a'); g.addColorStop(1, '#0a1220'); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0); url = c.toDataURL('image/png'); }   /* Studio is drawn by the page behind the stage: put it in the picture */
  const a = el('a', { href: url, download: `${cleanName(cur.name || 'skin').replace(/[\/:*?"<>|]/g, '') || 'skin'}${transparent ? ' (transparent)' : ''}.png` }); document.body.appendChild(a); a.click(); a.remove(); }
function drawStageBtns() {
  const box = $('stagebtns'), stg = $('view').parentElement; if (!box) return;
  if (!box._menu) { box._menu = true; addEventListener('pointerdown', e => { if ((box._open || box._shot) && !box.contains(e.target)) { box._open = false; box._shot = false; drawStageBtns(); } }, true); addEventListener('keydown', e => { if (e.key === 'Escape' && box._open) { box._open = false; box._focus = 'btn'; drawStageBtns(); } }); }
  if (!box._ro) { box._ro = new ResizeObserver(() => { const vb = $('viewbtns'); if (vb) vb.style.paddingLeft = box.offsetWidth ? box.offsetWidth + 10 + 'px' : ''; }); box._ro.observe(box); }   // the Creator's view buttons keep clear of the background button
  let bd = store_.get('se_backdrop'); if (!BACKDROPS.some(b => b[0] === bd)) bd = 'dark'; showBackdrop(bd);
  const name = BACKDROPS.find(b => b[0] === bd)[1], clean = stg.classList.contains('clean');
  box.replaceChildren(...[
    el('button', { class: 'stbtn', title: null, 'aria-label': 'Background: ' + name, 'aria-haspopup': 'listbox', 'aria-expanded': String(!!box._open), onclick: e => { e.stopPropagation(); box._open = !box._open; box._focus = box._open ? 'menu' : 'btn'; drawStageBtns(); } },
      el('span', { class: 'bdchip bd-' + bd }), el('b', { text: name }), el('span', { class: 'caret', text: '▾' })),
    box._open ? el('div', { class: 'bdmenu', role: 'listbox', 'aria-label': 'Backgrounds', onkeydown: e => { if (e.key === 'Tab') { box._open = false; drawStageBtns(); return; } if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return; e.preventDefault(); const os = [...e.currentTarget.querySelectorAll('.bdopt')], i = os.indexOf(document.activeElement), n = os.length; os[e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + n) % n]?.focus(); } },   /* arrows move through the backgrounds */ BACKDROPS.map(([k, n]) => el('button', { class: 'bdopt' + (k === bd ? ' on' : ''), role: 'option', 'aria-selected': String(k === bd),
      onclick: e => { e.stopPropagation(); box._open = false; box._focus = 'btn'; store_.set('se_backdrop', k); drawStageBtns(); } }, el('span', { class: 'bdchip bd-' + k }), el('b', { text: n })))) : null,
    ED ? null : el('div', { class: 'shotwrap' }, el('button', { class: 'stbtn', 'aria-label': 'Save picture', title: 'Save picture', 'aria-haspopup': 'menu', 'aria-expanded': String(!!box._shot), onclick: e => { e.stopPropagation(); box._shot = !box._shot; box._open = false; drawStageBtns(); } }, toolIcon('camera')),
      box._shot ? el('div', { class: 'bdmenu shotmenu', role: 'menu' }, [['scene', 'With background'], ['clear', 'Transparent']].map(([k, n]) => el('button', { class: 'bdopt', role: 'menuitem', text: n, onclick: e => { e.stopPropagation(); box._shot = false; drawStageBtns(); savePicture(k === 'clear'); } }))) : null),
    ED ? null : el('button', { class: 'stbtn', title: clean ? 'Show buttons (Esc)' : 'Clean view', 'aria-label': clean ? 'Show buttons' : 'Clean view', onclick: () => { stg.classList.toggle('clean'); drawStageBtns(); viewInset(); } },
      el('span', { text: clean ? '\u25c9' : '\u25ce' }), el('b', { text: clean ? 'Show buttons' : 'Clean view' }))].filter(Boolean));
  if (box._focus) { const f = box._focus; box._focus = null; (f === 'menu' ? box.querySelector('.bdopt.on') || box.querySelector('.bdopt') : box.querySelector('.stbtn'))?.focus(); }   // keyboard focus follows the menu
}
addEventListener('keydown', e => { if (e.key === 'Escape' && !ED) { const stg = $('view')?.parentElement; if (stg?.classList.contains('clean')) { stg.classList.remove('clean'); drawStageBtns(); viewInset(); } } });
// six favourite moves under the character, one click to play
let EMOTES = null;
const EMOTE_DEFAULT = ['Wave', 'Clap', 'Dance_Boogie', 'Shrug', 'Salute_Chest', 'Laugh_Strong'];
async function loadEmotes() { const m = await db.get('meta', 'emotes').catch(() => null), have = new Set(CAT.anims.Emote || []);
  EMOTES = (Array.isArray(m) ? m : EMOTE_DEFAULT.map(n => 'Emote/' + n)).filter(k => { const [g, n] = k.split('/'); return (CAT.anims[g] || []).includes(n); }).slice(0, 6);
  if (!EMOTES.length) EMOTES = [...have].slice(0, 6).map(n => 'Emote/' + n); }
function toggleEmote(g, n) { const k = g + '/' + n, i = EMOTES.indexOf(k); if (i >= 0) EMOTES.splice(i, 1); else { EMOTES.push(k); if (EMOTES.length > 6) EMOTES.shift(); } db.put('meta', 'emotes', EMOTES).catch(() => {}); drawEmotes(); }
function drawEmotes() { const box = $('emotes'); if (!box || !EMOTES) return; box.hidden = !!ED || tab === 'animate';   /* the Animate tab owns the figure's moves */
  box.replaceChildren(...EMOTES.map(k => { const [g, n] = k.split('/');
    return el('button', { class: 'emote' + (st.anim.anim && playing.group === g && playing.name === n ? ' on' : ''), title: animLabel(g, n), 'aria-pressed': String(!!(st.anim.anim && playing.group === g && playing.name === n)), onclick: () => playing.group === g && playing.name === n ? playAnim('Default', 'Idle', 0.5) : playAnim(g, n) }, animThumb(g, n)); })); }   // plays on a loop until clicked again

// the animation transport on the stage (Animations tab): play/pause, step a frame, scrub to any frame
function drawTransport() {
  const stg = $('view').parentElement; let bar = $('transport'); const show = (tab === 'animations' || (tab === 'animate' && ANIMATE?.active())) && !ED && !!st.anim.anim;
  if (!show) { if (bar) bar.hidden = true; return; }
  if (!bar) {
    const A = () => st.anim, frames = () => Math.max(1, Math.round(A().duration)), seek = f => { const a = A(); a.playing = false; a.blend = 1; a.held = 0; a.t = Math.max(0, Math.min(frames(), f)); a.apply(); sync(); };
    const play = el('button', { class: 'tbtn', 'aria-label': 'Play', onclick: () => { const a = A(); a.playing = !a.playing; if (a.playing && a.t >= frames() && a.anim?.holdLastKeyframe) a.t = 0; sync(); } });
    const back = el('button', { class: 'tbtn', 'aria-label': 'Previous frame', title: ',', text: '‹', onclick: () => seek(Math.round(A().t) - 1) });
    const fwd = el('button', { class: 'tbtn', 'aria-label': 'Next frame', title: '.', text: '›', onclick: () => seek(Math.round(A().t) + 1) });
    const slider = el('input', { type: 'range', min: 0, step: 1, 'aria-label': 'Frame', oninput: e => seek(+e.target.value) }), lab = el('span', { class: 'tframe' });
    function sync() { const a = A(), n = frames(); slider.max = n; if (document.activeElement !== slider || a.playing) slider.value = Math.min(n, Math.round(a.t)); lab.textContent = `${Math.min(n, Math.round(a.t))} / ${n}`; play.textContent = a.playing ? '❚❚' : '▶'; play.setAttribute('aria-label', a.playing ? 'Pause' : 'Play'); }
    bar = el('div', { id: 'transport', class: 'transport' }, back, play, fwd, slider, lab); bar.sync = sync; bar.seek = seek; stg.appendChild(bar);
    const tick = () => { if (!bar.hidden) sync(); requestAnimationFrame(tick); }; requestAnimationFrame(tick);
    addEventListener('keydown', e => { if (bar.hidden || e.ctrlKey || e.metaKey || e.altKey || e.target.matches?.('input:not([type=range]),textarea,select,[contenteditable]')) return;
      if (e.key === ',' || e.key === '.') { e.preventDefault(); bar.seek(Math.round(st.anim.t) + (e.key === '.' ? 1 : -1)); }
      else if (e.key === ' ' && !e.target.closest?.('button')) { e.preventDefault(); play.click(); } });   /* , and . step a frame, Space plays/pauses (as in video players) */
  }
  bar.hidden = false; bar.sync();
}

// ---- publishing: skins made of game items can be shared under the player's name (needs Sign in with Hytale)
let PUB = { on: false, signedIn: false }, PUBMAP = {};   // PUBMAP: local skin id -> published id
const api = async (path, method = 'GET', data) => { const r = await fetch('/api' + path, { method, credentials: 'same-origin', cache: 'no-store', headers: data ? { 'Content-Type': 'application/json' } : {}, body: data ? JSON.stringify(data) : undefined });
  const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'The skin server did not answer. Try again.'); return j; };
async function loadPub() {
  PUBMAP = (await db.get('meta', 'published').catch(() => null)) || {};
  try { PUB = await api('/me'); } catch { PUB = { on: false, signedIn: false }; }
  if (PUB.signedIn) { const live = new Set(PUB.skins.map(s => s.id)); for (const k of Object.keys(PUBMAP)) if (!live.has(PUBMAP[k])) delete PUBMAP[k]; await savePubMap(); }
}
const savePubMap = () => db.put('meta', 'published', PUBMAP).catch(() => {});
const canPublish = () => auth.enabled && PUB.on && PUB.signedIn;
const publish = guard(async (rec, quiet) => {
  if (hasCustom(rec.skin)) throw new Error('Skins with custom assets can only be shared as files. Custom assets stay on your computer.');
  const r = await api('/skins', 'POST', { id: PUBMAP[rec.id] || null, name: rec.name, skin: rec.skin }); PUBMAP[rec.id] = r.id; await savePubMap();
  if (!quiet) { say(`Published "${rec.name}"`); render(); } });
const unpublish = guard(async (rec, quiet) => { const id = PUBMAP[rec.id]; if (!id) return; await api('/skins/' + id, 'DELETE').catch(e => { if (!/Unknown skin/.test(e.message)) throw e; });
  delete PUBMAP[rec.id]; await savePubMap(); if (!quiet) { say(`Unpublished "${rec.name}"`); render(); } });
const movePub = async (from, to) => { if (PUBMAP[from] && to) { PUBMAP[to] = PUBMAP[from]; delete PUBMAP[from]; await savePubMap(); } };
const pubButton = rec => !canPublish() ? locked('Publish', 'publishing', 'mini') : el('button', { class: 'mini' + (PUBMAP[rec.id] ? ' on' : ''), text: PUBMAP[rec.id] ? 'Unpublish' : 'Publish',
  title: PUBMAP[rec.id] ? 'Published: anyone who looks you up sees it. Saving updates it.' : 'Let anyone who looks you up see this skin', onclick: e => { e.stopPropagation(); (PUBMAP[rec.id] ? unpublish : publish)(rec); } });
const forgetMe = guard(async () => {
  if (!await confirmBox('Delete my published data', 'Remove every skin you published and your profile from this site’s server? Skins on your computer stay.', 'Delete', true)) return;
  await api('/me', 'DELETE'); PUBMAP = {}; await savePubMap(); await auth.signOut(); ACCOUNT = null; PUB = { on: PUB.on, signedIn: false }; say('Your published data was deleted'); render(); });

function card(rec, kind, i) {
  if (!rec) return el('div', { class: 'skin empty ' + kind, role: 'button', tabIndex: 0, 'aria-label': `Save to slot ${i + 1}`, onclick: () => saveAs(i), onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); saveAs(i); } } }, el('div', { class: 'pic' }, el('span', { text: '+' })), el('b', { text: 'Slot ' + (i + 1) }), el('small', { text: 'Empty' }));   // the + saves the look you have on into this slot
  const act = (label, fn, cls) => el('button', { class: 'mini ' + (cls || ''), text: label, onclick: e => { e.stopPropagation(); fn(); } });
  const acts = kind === 'game' ? [act('Set in game', () => checklist(rec)), act('Rename', () => renameSkin(rec)), act('Move out', () => moveOut(rec)), pubButton(rec), locked('Send to game', 'sending this skin to your in-game preset', 'mini')]
    : kind === 'custom' ? [hasCustom(rec.skin) ? null : act('Send to game', () => toGame(rec)), act('Rename', () => renameSkin(rec)), act('Copy', () => duplicate(rec)), pubButton(rec), act('Export', guard(() => exportSkin(rec))), act('Delete', () => removeSkin(rec), 'danger')]
    : [act('Save', () => { open(rec, true); saveAs(); })];
  const menu = acts.filter(Boolean).length > 1 ? cardMenu(acts.filter(Boolean)) : null;   /* card actions live in a ⋯ menu, as in file browsers */
  return el('div', { class: 'skin ' + kind + (cur.id && cur.id === rec.id ? ' on' : ''), tabIndex: 0, data: { rid: String(rec.id) }, onclick: () => { if (kind === 'pub') { open(rec, true, true); return render(); } open(rec, kind === 'found'); setTab('editor'); },
    onkeydown: e => { if (e.key === 'Enter' && e.target === e.currentTarget) e.currentTarget.click(); } },
    el('div', { class: 'pic' }, portrait(rec.skin)), el('b', { text: rec.name }), kind === 'game' ? el('small', { text: 'Slot ' + (rec.slot + 1) }) : null,
    menu || el('div', { class: 'acts' }, acts));
}
// Features that need a Hytale account. Sign in with Hytale is not available to this site yet, so they are shown greyed out.
const NEED = f => ACCOUNT ? `Hytale does not offer ${f} to other apps yet` : !auth.enabled ? `Coming soon: ${f} needs Sign in with Hytale, which is waiting on Hytale's approval` : `Connect your Hytale account to enable ${f}`;
const locked = (label, feature, cls = 'btn ghost') => !auth.enabled ? null :   /* features waiting on Sign in with Hytale stay hidden until it exists */ el('button', { class: cls + ' locked', 'aria-disabled': 'true', title: NEED(feature), text: label, onclick: e => { e.stopPropagation(); say(NEED(feature)); } });   // not disabled: a click says why it can't be used yet
const need = feature => el('p', { class: 'need', text: NEED(feature) + '.' });
function accountRow() { if (!auth.enabled) return null;
  if (!auth.enabled) return el('div', { class: 'folder account' }, el('div', {}, el('b', {}, 'Hytale account ', el('span', { class: 'tag none', text: 'WIP' })),
    ),
    el('button', { class: 'btn primary locked', disabled: true, title: 'Coming soon', text: 'Connect Hytale account' }));
  if (!ACCOUNT) return el('div', { class: 'folder account' }, el('div', {}, el('b', { text: 'Hytale account' }),
    ),
    el('button', { class: 'btn primary', text: 'Connect Hytale account', onclick: guard(() => auth.start()) }));
  return el('div', { class: 'folder account on' }, el('div', {}, el('b', { text: 'Signed in as ' + ACCOUNT.username })),
    el('button', { class: 'btn ghost', text: 'Show my skin', onclick: () => { setTab('lookup'); lookup(ACCOUNT.username); } }),
    el('button', { class: 'btn ghost', text: 'Sign out', onclick: guard(async () => { await auth.signOut(); ACCOUNT = null; PUB = { on: PUB.on, signedIn: false }; render(); }) }),
    PUB.signedIn ? el('button', { class: 'btn ghost danger', text: 'Delete my published data', onclick: forgetMe }) : null);
}
function folderRow() {
  if (!store.folderSupported) return el('p', { class: 'note', text: 'Saving to a folder needs Chrome or Edge.' });
  if (FOLDER.state === 'none') return null;   // the numbered steps above cover choosing one
  const after = async r => { FOLDER = await store.folderState(); await reloadAssets(); await refreshWard(); pushWearing(); if (r) say(r.imported ? `Folder connected, ${r.imported} skin${r.imported > 1 ? 's' : ''} brought in` : 'Folder connected'); };
  const btn = (t, fn, c = 'ghost') => el('button', { class: 'btn ' + c, text: t, onclick: guard(fn) });
  const [title, text] = FOLDER.state === 'on' ? ['Saving to folder: ' + FOLDER.name, 'Every skin and custom asset is a small file in this folder and updates as you edit.']
    : FOLDER.state === 'ask' ? ['Folder paused: ' + FOLDER.name, 'Your browser needs your OK again before it can write to the folder. Until then, changes are kept in the browser.']
    : ['Save skins to a folder', 'Pick your Documents folder and the site makes a "Hytale Skins" folder in it, the one the mod reads. Each skin becomes a small file there.'];
  return el('div', { class: 'folder ' + FOLDER.state }, el('div', {}, el('b', { text: title })),
    FOLDER.state === 'none' ? btn('Choose folder', async () => after(await store.chooseFolder()), 'primary')
      : [FOLDER.state === 'ask' ? btn('Reconnect', async () => after(await store.resumeFolder(true)), 'primary') : btn('Change', async () => after(await store.chooseFolder())),
         btn('Stop', async () => { await store.forgetFolder(); await after(); })]);
}
function gameSteps() {   // the path to wearing your skins in Hytale, in order
  if (!store.folderSupported) return null; const linked = FOLDER.state === 'on', all = linked && SHOWGAME && !!FOLDER.mod;
  const row = (n, done, title, text, action) => el('li', { class: done ? 'done' : '' }, el('span', { class: 'num', text: done ? '✓' : n }), el('b', { text: title }), done ? null : action);
  return el('details', { class: 'gamesteps', open: !all }, el('summary', { text: all ? 'In game: ready' : 'Play in Hytale' }), el('ol', {},
    row(1, !!FOLDER.mod, 'Skin Editor Sync mod', '', modLink('ghost')),
    row(2, linked, 'Skins folder', '', linked ? null : el('button', { class: 'btn ghost', text: FOLDER.state === 'ask' ? 'Reconnect folder' : 'Choose folder', onclick: guard(async () => { FOLDER.state === 'ask' ? await store.resumeFolder(true) : await store.chooseFolder(); FOLDER = await store.folderState(); await reloadAssets(); await refreshWard(); pushWearing(); }) })),
    row(3, linked && SHOWGAME, 'In game', '', el('button', { class: 'btn ghost', text: 'Turn on', disabled: !linked, onclick: () => { if (!SHOWGAME) $('ingame').onclick(); } }))));
}
function panelWardrobe() {
  return [head('Locker'), el('div', { class: 'pbody' }, gameSteps(), folderRow(), accountRow(),
    el('div', { class: 'shelf game' }, el('h3', {}, el('span', { text: 'In-game slots' }), el('em', { text: `${WARD.game.filter(Boolean).length} / ${store.GAME_SLOTS}` })),
      el('div', { class: 'row' }, locked('Load my presets', 'loading your in-game presets'), locked('Send all to game', 'sending skins to your in-game presets')),
      el('div', { class: 'cards' }, WARD.game.map((r, i) => card(r, 'game', i)))),
    el('div', { class: 'shelf custom' }, el('h3', {}, el('span', { text: 'My skins' }), el('em', { text: `${WARD.custom.length} / ${store.CUSTOM_MAX}` })),
      WARD.custom.length ? el('div', { class: 'cards' }, WARD.custom.map(r => card(r, 'custom'))) : el('p', { class: 'blank', text: 'No skins' })))];
}
async function refreshWard() { WARD = await store.list(); if (cur.id && ![...WARD.game, ...WARD.custom].some(r => r && r.id === cur.id)) { cur.id = null; cur.kind = null; cur.slot = null; } render(); }
function guard(fn) { return async (...a) => { try { await fn(...a); } catch (e) { if (e && e.name === 'AbortError') return; if (!/is full|Limit is|Texture full|can't go in game/.test(e?.message || '')) console.error(e);   /* expected refusals are messages, not errors */ say(e.message || 'That did not work.', true); } }; }
const slotButtons = () => WARD.game.map((r, i) => ({ label: `Slot ${i + 1}${r ? ': ' + r.name : ' (empty)'}`, value: String(i) }));
const toGame = guard(async rec => { rec = liveRec(rec);
  if (hasCustom(rec.skin)) throw new Error("Custom items can't go in game slots");
  const v = await ask('Send to game', WARD.game.some(Boolean) ? el('p', { text: 'The skin in that slot moves to My skins.' }) : [], [...slotButtons(), { label: 'Cancel', value: '' }]);
  if (v === '') return; await store.swap(rec.id, +v); await movePub(rec.id, 'game-' + v); if (cur.id === rec.id) { cur.id = 'game-' + v; cur.kind = 'game'; cur.slot = +v; cur.random = false; keepDraft(); } else if (cur.id === 'game-' + v) { const mv = (await store.list()).custom.find(r => r.id === rec.id); Object.assign(cur, { id: rec.id, kind: 'custom', slot: null, name: mv ? mv.name : cur.name, random: false }); keepDraft(); }   /* the skin that was in the slot moved to My skins under the sent skin's id: the open look follows it */ await refreshWard(); say('Moved to in-game slot ' + (+v + 1));
});
const moveOut = guard(async rec => { rec = liveRec(rec); const used = new Set(WARD.custom.map(r => r.name)); let nm = rec.name, k = 2; while (used.has(nm)) nm = cleanName(clip(rec.name, 37) + ' ' + k++); const n = await store.saveCustom(nm, rec.skin); await movePub(rec.id, n && n.id); await store.remove(rec.id); if (n && cur.id === rec.id) { Object.assign(cur, { id: n.id, kind: 'custom', slot: null, name: n.name }); keepDraft(); } await refreshWard(); plate(); say('Moved to My skins'); });   /* the open skin follows its record */
const liveRec = rec => { const w = [...WARD.game, ...WARD.custom].find(r => r && r.id === rec.id) || rec; return cur && cur.id === rec.id ? { ...w, skin: cur.skin } : w; };   // the skin as it is now, not as the card was drawn
const renameSkin = guard(async rec => { rec = liveRec(rec);
  const name = el('input', { type: 'text', value: rec.name || '', maxLength: 120, placeholder: 'Skin name', autofocus: true });
  const asked = ask('Rename skin', [el('label', { text: 'Name' }), name], [{ label: 'Cancel', value: '' }, { label: 'Rename', value: 'yes', primary: true }]); requestAnimationFrame(() => { name.focus(); name.select(); }); if (await asked !== 'yes') return;
  const n = cleanName(name.value); if (!n || n === rec.name) return;
  const fresh = rec.kind === 'game' ? (await store.list()).game[rec.slot] : null, r = rec.kind === 'game' ? (fresh ? await store.saveGame(rec.slot, n, fresh.skin) : rec) : await store.saveCustom(await store.uniqueName(n, rec.id), rec.skin, rec.id);   /* a game slot is renamed with what it holds now; a taken name gets a number */
  if (cur.id === rec.id) { cur.name = r.name; cur.auto = false; cur.random = false; keepDraft(); }   /* a renamed skin is kept: Randomize starts a new one */
  await refreshWard(); if (PUBMAP[r.id] && canPublish() && !hasCustom(r.skin)) publish(r, true); });
const duplicate = guard(async rec => { rec = liveRec(rec); const used = new Set(WARD.custom.map(r => r.name)), stem = String(rec.name).replace(/ copy( \d+)?$/, ''); let n = ''; for (let k = 1; k < 1000; k++) { const suf = ' copy' + (k > 1 ? ' ' + k : ''); n = cleanName(clip(stem, 40 - suf.length) + suf);   /* never cuts an emoji, even multi-part ones */ if (!used.has(n)) break; } await store.saveCustom(n, rec.skin); await refreshWard(); });   /* the number always fits in 40 characters */
const removeSkin = guard(async rec => { if (PUBMAP[rec.id] && canPublish()) await unpublish(rec, true); const wasOpen = cur.id === rec.id; GONE.add(rec.id); if (flush.stuck && !wasOpen) { flush.stuck = false; setTimeout(() => { if (dirty) autosave(); }, 0); }   /* a freed place lets a stuck look save */ if (wasOpen) { clearTimeout(autosave.t); dirty = false; } await store.remove(rec.id);   /* a pending autosave can't bring it back */ await refreshWard(); if (wasOpen) { Object.assign(cur, { id: null, kind: null, slot: null, name: '', auto: false }); keepDraft(); plate(); }   /* the look on screen is no longer that skin */   /* deleted at once, with Undo, instead of asking first */
  sayUndo(`Deleted "${rec.name}"`, guard(async () => { if (rec.kind !== 'game' && WARD.custom.length >= store.CUSTOM_MAX) throw new Error(`My skins is full (${store.CUSTOM_MAX})`); GONE.delete(rec.id); const back = await store.saveCustom(await store.uniqueName(rec.name, rec.id), rec.skin, rec.id); await refreshWard();
    if (!cur.id && JSON.stringify(cur.skin) === JSON.stringify(R.fit(rec.skin))) { Object.assign(cur, { id: rec.id, kind: 'custom', slot: null, name: back.name }); keepDraft(); plate(); } }));   /* with the name it came back under */ });   /* the look on screen is that skin again */
function sayUndo(text, undo) { const s = $('status'); say(text); s.append(' ', el('button', { class: 'linkbtn', text: 'Undo', onclick: () => { say(''); undo(); } })); clearTimeout(say.t); say.t = setTimeout(() => s.textContent = '', 8000); }
function checklist(rec) { rec = liveRec(rec);
  const rows = GROUPS.flatMap(([g, fs]) => fs.filter(f => rec.skin[f]).map(f => { const p = parse(rec.skin[f]), item = R.find(f, rec.skin[f]);
    return el('tr', {}, el('td', { text: g + ' ▸ ' + LABEL[f] }), el('td', { text: item ? itemName(item) : nice(p.id) }), el('td', { text: [p.color && nice(p.color), p.variant && nice(p.variant)].filter(Boolean).join(', ') })); }));
  ask(`Set "${rec.name}" in game`, [el('p', { text: `In Hytale, open My Avatar, choose preset ${rec.slot + 1} and pick these parts:` }), el('table', { class: 'parts' }, el('tbody', {}, rows))], [{ label: 'Done', value: '', primary: true }]);
}
async function save() { cur.random = false; if (!cur.id) return saveAs();
  await guard(async () => { const r = cur.kind === 'game' ? await store.saveGame(cur.slot, cur.name, cur.skin) : await store.saveCustom(cur.name, cur.skin, cur.id); dirty = false; const moved = r.kind !== cur.kind; if (moved) { Object.assign(cur, { id: r.id, kind: r.kind, slot: null, name: r.name, auto: false }); keepDraft(); } await refreshWard(); plate(); say(moved ? "Custom items can't go in game slots: saved to My skins" : `Saved "${r.name}"`);
    if (PUBMAP[r.id] && canPublish() && !hasCustom(r.skin)) publish(r, true); })(); }
async function saveAs(slot) { cur.random = false; if (typeof slot !== 'number') slot = null;
  const name = el('input', { type: 'text', value: cur.name || '', maxLength: 120, placeholder: 'Skin name', autofocus: true });
  const where = el('select', {}, el('option', { value: 'custom', text: `My skins (${WARD.custom.length} / ${store.CUSTOM_MAX})` }), WARD.game.map((r, i) => el('option', { value: String(i), selected: i === slot, text: `In-game slot ${i + 1}${r ? ', replaces "' + r.name + '"' : ' (empty)'}` })));
  const v = await ask('Save skin', [el('label', { text: 'Name' }), name, el('label', { text: 'Save to' }), where], [{ label: 'Cancel', value: '' }, { label: 'Save', value: 'yes', primary: true }]);
  if (v !== 'yes') return; let n = cleanName(name.value) || cur.name || 'My skin';   /* a blank name keeps the current one */
  if (where.value === 'custom') { const autoId = cur.auto && cur.kind === 'custom' ? cur.id : null, used = new Set(WARD.custom.filter(r => r.id !== autoId).map(r => r.name)); if (used.has(n)) { const stem = n; let k = 2; while (used.has(cleanName(clip(stem, 37) + ' ' + k))) k++; n = cleanName(clip(stem, 37) + ' ' + k); } }   /* Save as never makes two skins with one name */
  if (where.value !== 'custom' && hasCustom(cur.skin)) return say("Custom items can't go in game slots", true);
  await guard(async () => { const auto = cur.auto && cur.kind === 'custom' && cur.id, r = where.value === 'custom' ? await store.saveCustom(n, cur.skin, auto || undefined) : await store.saveGame(+where.value, n, cur.skin);
    if (auto && where.value !== 'custom') await store.remove(auto);
    cur.auto = false; cur.id = r.id; cur.kind = r.kind; cur.slot = r.slot ?? null; cur.name = r.name; dirty = false; keepDraft(); await refreshWard(); say(`Saved "${r.name}"`); })();
}

// animations
let playing = { group: 'Default', name: 'Idle' };
const ORDER = ['Emote', 'Default', 'Poses', 'Taunt', 'Flavor', 'Expressions'];
let onceT;
// ---- Mount moves: the player rides the animal the game lets them ride (tamed horse, camel, ram), with its own matching move.
// Checked against a ridden horse in game 2026-11-20 (side, front, back, high views): seat height and place match; no saddle;
// mane and tail are black or grey at random (black shown).
const MOUNT_PATH = 'NPC/Livestock/', BLOCK = 64;   // model units per block
const MOUNTS = {
  Horse: { model: MOUNT_PATH + 'Horse/Models/Model.blockymodel', tex: MOUNT_PATH + 'Horse/Models/Texture.png', seat: [0, 1.6, 0], anims: MOUNT_PATH + 'Horse/Animations/Default/',
    atts: [{ model: MOUNT_PATH + 'Horse/Models/Attachments/Mane.blockymodel', tex: MOUNT_PATH + 'Horse/Models/Attachments/Mane_Black.png' }] },   // the ridden (Tamed_Horse) role uses the plain horse: no saddle; mane and tail black or grey at random
  Camel: { model: MOUNT_PATH + 'Camel/Models/Model.blockymodel', tex: MOUNT_PATH + 'Camel/Models/Texture.png', seat: [0, 2.25, 0.2], anims: MOUNT_PATH + 'Camel/Animations/Default/',
    atts: [{ model: MOUNT_PATH + 'Camel/Models/Attachments/Shell.blockymodel', tex: MOUNT_PATH + 'Camel/Models/Attachments/Shell_Textures/Green.png' }] },
  Ram: { model: MOUNT_PATH + 'Ram/Models/Model.blockymodel', tex: MOUNT_PATH + 'Ram/Models/Texture.png', seat: [0, 1.3, 0], anims: MOUNT_PATH + 'Ram/Animations/Default/', atts: [] } };
const MOUNT_MOVE = { Mount_Idle: ['Idle', 1], Mount_Walk: ['Walk', 1], Mount_Walk_Backward: ['Walk_Backward', 1], Mount_Run: ['Run', 1], Mount_Run_Backward: ['Walk_Backward', 1], Mount_Sprint: ['Run', 1] };   // the game's animals have only Idle/Walk/WalkBackward/Run, all at speed 1 (Server/Models/Livestock/*.json)
let mountKind = 'Horse', mountOn = null, mountMsg = '';
async function setMount(kind, move) {
  if (!st) return; if (!kind) { if (mountOn) { st.mount(null); mountOn = null; } return; }
  const M = MOUNTS[kind];
  try {
    if (mountOn !== kind) { const root = await fig.buildCreature(M); st.mount(root, M.seat.map(v => v * BLOCK)); mountOn = kind; }
    const [n, sp] = MOUNT_MOVE[move] || ['Idle', 1]; st.mountAnim.set(await game.json(game.common(M.anims + n + '.blockyanim')), sp); mountMsg = '';
  } catch (e) { console.warn(e); st.mount(null); mountOn = null; mountMsg = 'Your saved copy of the game files is from before animals were added. Refresh it once to see them (your skins are kept).'; }
}
// what each move holds, and in which hand (the game's attachment bones)
const HELD = { Glide: { '*': [['glider', 'R-Attachment', [0, -62, 0]]] },   // as in game: the hands on the glider's grips (measured 62 above them unshifted)
  Poses: { BattleAxe: [['battleaxe', 'R-Attachment']], Book_Read: [['book', 'L-Attachment']], Show_Block: [['block', 'R-Attachment']], Show_Item: [['potion', 'R-Attachment']], Pickaxe: [['pickaxe', 'R-Attachment']], Staff: [['wizstaff', 'R-Attachment', null, [180, 0, 0]]], Sword: [['sword', 'R-Attachment']],
    Warhammer: [['mace', 'R-Attachment']], Outlander_Sword: [['sword', 'R-Attachment']], Outlander_Archer_Bow_Charge: [['bow', 'L-Attachment']], Outlander_Archer_Bow_Pose: [['bow', 'L-Attachment']] },
  Taunt: { Staff_Helicopter: [['staff', 'R-Attachment']], Sword_Back: [['sword', 'R-Attachment']], Sword_Front: [['sword', 'R-Attachment', [0, 0, 14]]] } };   // [item, hand, shift]: Sword Front's blade would cross the face and body
const heldBy = (g, n) => HELD[g]?.[n] || HELD[g]?.['*'] || [];
// scenery for the moves that use something in the world, in model units (a block is 64; the figure faces +z, its pelvis rests at 51)
const W = game.SCENERY_TEX;
// the game's own furniture (its village set and workbench, see scene-data.js), placed where the moves use them
const CHAIR = [{ block: game.SET_PIECES.chair, at: [0, 0, 0], turn: 0 }];   // sit moves drop the pelvis 45 and hang the lower legs
const BED = [{ block: game.SET_PIECES.bed, at: [-32, 0, -61], turn: 0, stretch: 1.12 }];   // lengthwise along z, pillow end at -z; 12% longer so the sleeper (z -71..58) fits between headboard (-75) and footboard (60)   // lying moves drop the pelvis about 42, head towards -z
const BENCH = [{ block: game.SET_PIECES.bench, at: [-32, 0, 84], turn: 180 }];   // something to work at, centred in front of the hands (it is two blocks wide: x -64..64)
const LADDERS = cols => [{ ladder: [cols, 7], at: [0, 0, -8] }];   // climbing faces +z: the rungs just in front of the hands, planks behind them
const DEEP = 192;   // how far above the lake bed a swimmer floats (3 blocks)
const WATER = (y, under) => [{ plane: [6400, 6400], at: [0, y, 0], tex: W.water, repeat: [56, 56], color: 0x7fb2e6, opacity: 0.55, flow: true }, ...(under ? [{ box: [6400, y, 6400], at: [0, y / 2, 0], color: 0x1d5ca8, opacity: 0.62, volume: true }] : [])];   // a lake to the hills, drifting with the land while swimming
function sceneryFor(g, n) {
  if (g === 'Flavor' && /^Sit2?$/.test(n)) return [CHAIR, 32];   // the village chair's seat top
  if (g === 'Flavor' && /^Sleep/.test(n)) return [BED, 50];   // on the mattress, under the blanket's top
  if (g === 'Climb') return [LADDERS(/_(Left|Right)$/.test(n) ? 3 : 1), 0];   // one ladder up and down, a few side by side to climb across
  if (g === 'Default' && n === 'Interact') return [BENCH, 0];
  if (g === 'Swim') return [WATER(DEEP + (/Dive|Sink/.test(n) ? 150 : 92), true), 0];   // deep water: the swimmer floats DEEP above the lake bed
  // pulling up: the move starts about two blocks below and ends on top, so the figure stands that much higher on a stone block it climbs onto
  if (g === 'Mantle' && /^Mantle_Up/.test(n)) return [[{ box: [160, 126, 128], at: [0, 63, 26], tex: W.stone, repeat: [2.5, 2] }], 126];
  if (g === 'Mantle') return [[{ box: [160, 84, 64], at: [0, 42, 50], tex: W.stone, repeat: [2.5, 1.2] }], 0];   // hands resting on a chest-high ledge in front
  return [null, 0]; }
// moves done facing something (a ladder, a workbench) are watched from behind, as in the game
const facesAway = (g, n) => g === 'Climb' || g === 'Mantle' || (g === 'Default' && n === 'Interact');
let propsKey = '';   // the props in the hands now: a move that uses the same ones keeps them (the glider never blinks out between glide moves)
async function setProps(g, n) { const want = heldBy(g, n), key = JSON.stringify(want); if (key === propsKey) return; propsKey = key;
  const built = await Promise.all(want.map(async ([k, bone, shift, turn]) => { try { const [model, tex] = game.PROPS[k]; return { root: model ? await fig.buildCreature({ model, tex }) : await fig.buildBlock(tex), bone, shift, turn }; } catch (e) { console.warn(k, e.message); return null; } }));
  st.props(built.filter(Boolean)); if (built.some(b => !b)) say('Your saved copy of the game files is from before held items were added. Refresh it once in the Locker to see them (your skins are kept).', true); }
// st.lift: tall moves aim the view higher, moves near the floor aim lower so they clear the buttons under the view
// the speed each move plays at in game (Server/Models/Human/Player.json, AnimationSets); everything else plays at 1
const GAME_SPEED = { 'Default/Idle': 0.3, 'Default/Run': 0.6, 'Default/Run_Backward': 0.6, 'Default/Sprint': 0.6, 'Default/Crouch': 0.5, 'Default/Crouch_Walk': 0.8, 'Default/Crouch_Walk_Backward': 0.8, 'Default/Walk': 0.6, 'Default/Walk_Backward': 0.6, 'Default/Jump': 0.8, 'Default/Jump_Far': 0.8, 'Default/Jump_Far2': 0.8, 'Default/Step_Run': 1.1, 'Default/Step_Run2': 1.1, 'Default/Step_Sprint': 1.2, 'Default/Step_Sprint2': 1.2, 'Default/Step_Crouch_Walk': 1.1, 'Default/Step_Crouch_Walk2': 1.1, 'Roll/Roll': 2, 'Roll/Roll_Backward': 2, 'Roll/Roll_Left': 2, 'Roll/Roll_Right': 2, 'Swim/Swim': 0.6, 'Swim/Swim_Fast': 0.6, 'Swim/Swim_Jump': 0.8, 'Swim/Swim_Dive': 0.6, 'Swim/Swim_Dive_Fast': 0.6, 'Swim/Swim_Dive_Fast2': 0.6, 'Climb/Climb_Idle': 0.5, 'Mantle/Mantle_Idle': 0.5, 'Flavor/Sit': 0.5, 'Flavor/Sit2': 0.5, 'Flavor/Sit_Ground': 0.5 };
let playSeq = 0;   // a newer move cancels one still loading, so two never mix (one's camera with the other's height)
async function playAnim(g, n, speed = 1, once = false) { clearTimeout(onceT); const my = ++playSeq; try { await setMount(g === 'Mount' ? mountKind : null, n); if (my !== playSeq) return; await setProps(g, n); if (my !== playSeq) return; const faceUp = /^Expressions/.test(g) || g === 'Flavor' && /^(Blink|Eye)/.test(n); st.lift(faceUp ? 98 : g === 'Glide' ? 210 : g === 'Fly' || g === 'Flavor' && /^Fly_/.test(n) ? 106 : g === 'Climb' ? 86 : g === 'Taunt' && /Staff_Helicopter/.test(n) ? 100 : g === 'Default' && n === 'Interact' ? 70 : g === 'Mantle' ? (/^Mantle_Up/.test(n) ? 150 : 110) : g === 'Swim' ? 62 + DEEP : g === 'Flavor' && /^(Sit_Ground|Sleep)/.test(n) ? 34 : g === 'Flavor' && /^Sit2?$/.test(n) ? 58 : 0, g === 'Flavor' && /^Sleep/.test(n) ? 0.9 : g === 'Default' && n === 'Interact' ? 1.1 : 0, g === 'Glide' ? 470 : faceUp ? -200 : g === 'Flavor' && /^Sit2?$/.test(n) ? 440 : 360, g === 'Flavor' && /^Sleep/.test(n) ? -24 : 0); st.scenery(...sceneryFor(g, n)); st.plantClear(g === 'Swim' ? 99 : g === 'Flavor' && /^(Sit_Ground|Sleep|Lay|Lie)/.test(n) || /Crawl|Prone/.test(n) ? 1.9 : 0); if (facesAway(g, n) && !facesAway(playing.group, playing.name)) st.behind(); else if (!facesAway(g, n) && facesAway(playing.group, playing.name)) st.toFront(); st.keepBehind(facesAway(g, n)); st.wall(g === 'Climb' ? (/_Up$/.test(n) ? [0, 55] : /_Down$/.test(n) ? [0, -55] : /_Left$/.test(n) ? [45, 0] : /_Right$/.test(n) ? [-45, 0] : [0, 0]) : null); let a = await fig.loadAnim(g, n); if (my !== playSeq) return; { const m = g === 'Flavor' && /^(Crouch(?:_Walk)?|Fly)_Look_Around/.exec(n); if (m) { const base = await (m[1] === 'Fly' ? fig.loadAnim('Fly', 'Fly_Idle') : fig.loadAnim('Default', m[1])).catch(() => null); if (my !== playSeq) return; if (base) a = { ...a, nodeAnimations: { ...base.nodeAnimations, ...a.nodeAnimations } }; } } st.pitch(g === 'Swim' && /^Swim(_Fast|_Dive|_Dive_Fast2?)?$/.test(n) ? 65 : 0); st.shadow(g !== 'Swim'); st.hover(g === 'Fly' || g === 'Flavor' && /^Fly_/.test(n) ? 44 : g === 'Glide' ? 150 : g === 'Swim' ? DEEP : 0, g === 'Swim'); /* a swimmer is in the water at once, not floating up from the lake bed */ playing = { group: g, name: n }; const gs = GAME_SPEED[g + '/' + n]; st.anim.set(a, gs ?? speed);
    if (once) { const still = fig.motionOf(g, n) && st.anim.still, ms = still ? 1700 : (Math.max(1, a.duration || 60) / 60 / speed) * 1000 + (a.holdLastKeyframe ? 700 : 0) + 250;
      onceT = setTimeout(() => { if (playing.group === g && playing.name === n) playAnim('Default', 'Idle', 0.5); }, ms); } st.anim.setMove((m => m && m.map(v => v * (GAME_SPEED[g + '/' + n] ?? 1)))(fig.motionOf(g, n))); st.anim.playing = true; drawEmotes(); } catch (e) { say('That animation could not be loaded.', true); } if (tab === 'animations') render(); }
let animGroup = 'Emote';
// the move groups as locker tiles: the game's 16 folders folded into a few, each tile showing its signature move
// a group can be split with "Group:part": Sit and Sleep live in Flavor in the game files but players look for them under Poses
const REST = /^(Sit|Sleep)/, PART = { rest: n => REST.test(n), idle: n => !REST.test(n) }, PARTNAME = { rest: 'Sit and lie' };
const animsOf = spec => { if (spec[0] === '@') return CAT[spec.slice(1)] || []; const [g, part] = spec.split(':'), all = CAT.anims[g] || []; return part ? all.filter(PART[part]) : all; };   // '@wheel' / '@faces': the game's own lists (entries with g, n, name)
const animLabel = (g, n) => ([...(CAT.wheel || []), ...(CAT.faces || [])].find(e => e.g === g && e.n === n) || {}).name || nice(n);   // the name the game shows for it
const CATS = [['Emote', ['@wheel']], ['Moves', ['Default']], ['Poses', ['Poses', 'Flavor:rest']], ['Taunt', ['Taunt']], ['Idle extras', ['Flavor:idle']], ['Faces', ['@faces']],
  ['Travel', ['Fly', 'Glide', 'Dash', 'Roll', 'Slide', 'Swim', 'Climb', 'Mantle']], ['Mount', ['Mount']]];
function animCats() {
  const have = g => animsOf(g).length, out = CATS.map(([k, gs]) => [k, gs.filter(have)]).filter(([, gs]) => gs.length);
  const used = new Set(['Emote', 'Expressions', ...out.flatMap(c => c[1].map(g => g.split(':')[0]))]);   /* the game's lists stand for those folders */ for (const g of Object.keys(CAT.anims)) if (!used.has(g) && have(g)) out.push([nice(g), [g]]);
  return out;
}
function panelAnimations() {
  const cats = animCats(); if (!cats.some(c => c[0] === animGroup)) animGroup = cats[0][0];
  const gs = cats.find(c => c[0] === animGroup)[1], A = st.anim, count = list => list.reduce((t, g) => t + animsOf(g).length, 0);
  const item = (g, n, label = animLabel(g, n)) => { const k = g + '/' + n, pinned = EMOTES && EMOTES.includes(k);
    return el('button', { class: A.anim && playing.group === g && playing.name === n ? 'on' : '', title: label, 'aria-keyshortcuts': 'F', 'aria-pressed': A.anim && playing.group === g && playing.name === n ? String(!!st.anim.playing) : null, onclick: () => { if (playing.group === g && playing.name === n) { st.anim.playing = !st.anim.playing; render(); } else playAnim(g, n); },   /* the playing card pauses and resumes */ onkeydown: ev => { if (!ev.ctrlKey && !ev.metaKey && !ev.altKey && (ev.key === 'f' || ev.key === 'F')) { ev.preventDefault(); toggleEmote(g, n); render(); setTimeout(() => [...document.querySelectorAll('.animlist button')].find(b => b.querySelector('span')?.textContent === animLabel(g, n))?.focus(), 80); } } }, animThumb(g, n), el('span', { text: label }),
      el('i', { class: 'star' + (pinned ? ' on' : ''), 'aria-label': pinned ? 'Unfavourite' : 'Favourite', title: pinned ? 'Unfavourite' : 'Favourite', text: pinned ? '★' : '☆', onclick: e => { e.stopPropagation(); toggleEmote(g, n); render(); } })); };
  return [head('Animations'), el('div', { class: 'pbody' },
    el('div', { class: 'cattiles' }, cats.map(([k, list]) => el('button', { class: 'cattile' + (k === animGroup ? ' on' : ''), onclick: () => { const changed = animGroup !== k; animGroup = k; render(); if (changed) { const pb = document.querySelector('.panel .pbody'); if (pb) pb.scrollTop = 0; } } },
      catIcon(k), el('b', { text: k }), el('small', { text: String(count(list)) })))),
    animGroup === 'Mount' ? el('div', { class: 'options' }, el('b', { class: 'dim', text: 'Ride:' }), Object.keys(MOUNTS).map(k => el('button', { class: 'chip' + (k === mountKind ? ' on' : ''), text: k,
      onclick: () => { mountKind = k; if (playing.group === 'Mount' && A.anim) playAnim('Mount', playing.name); else render(); } }))) : null,
    animGroup === 'Mount' && mountMsg ? el('div', { class: 'row' }, el('p', { class: 'need', text: mountMsg }), el('button', { class: 'btn ghost', text: 'Refresh game files', onclick: () => showConnect() })) : null,
    gs.length > 1 ? gs.map(spec => { const [g, part] = spec.split(':'); return [el('h3', { class: 'animhead', text: PARTNAME[part] || nice(g) }), el('div', { class: 'animlist' }, animsOf(spec).map(n => typeof n === 'object' ? item(n.g, n.n, n.name) : item(g, n)))]; })
      : el('div', { class: 'animlist' }, animsOf(gs[0]).map(n => typeof n === 'object' ? item(n.g, n.n, n.name) : item(gs[0].split(':')[0], n))))];
}

// other players' skins
let lookupMsg = '', lookupQ = '', shown = null;   // shown: the last player found, with the skins they published on this site
const lookup = guard(async name => {
  name = name.trim(); lookupQ = name; if (!/^[A-Za-z0-9_-]{2,36}$/.test(name)) { lookupMsg = 'Enter a username'; return render(); }
  lookupMsg = 'Looking…'; render();
  try {
    const r = await fetch('https://playerdb.co/api/player/hytale/' + encodeURIComponent(name), { credentials: 'omit', referrerPolicy: 'no-referrer' });
    const j = r.ok ? await r.json() : null, p = j?.data?.player, s = sanitize(p?.skin);
    if (!s) lookupMsg = r.status === 429 ? 'Too many lookups for now. Try again in a minute.' : 'No player found';
    else { const nm = cleanName(p.username) || name; found = [{ name: nm, skin: s }, ...found.filter(f => f.name !== nm)].slice(0, 60); lookupMsg = ''; open(found[0], true, true); loadPublished(nm, p.id); }
  } catch { lookupMsg = 'The lookup service could not be reached.'; }
  render();
});
async function loadPublished(name, id) {
  if (!/^[0-9a-f-]{32,36}$/i.test(id || '')) { shown = null; return; }
  const me = shown = { name, uuid: id, skins: null }; render();
  try { const r = await fetch('/api/players/' + encodeURIComponent(id) + '/skins', { credentials: 'omit', cache: 'no-store' }), j = r.ok ? await r.json() : null;
    if (!r.ok && r.status !== 404) me.failed = true; if (r.status === 404 && !j) me.failed = true;   /* the skins service missing is not 'no skins' */
    me.skins = (Array.isArray(j?.skins) ? j.skins : []).map(k => ({ id: 'pub_' + String(k.id).slice(0, 24), name: cleanName(k.name) || 'Skin', skin: sanitize(k.skin) })).filter(k => k.skin).slice(0, 45);
  } catch { me.skins = []; me.failed = true; }
  if (shown === me) render();
}
async function exportSkin(rec) { rec = liveRec(rec);   // the skin plus the items of yours it wears, so it opens the same on another computer
  const ids = new Set(Object.values(rec.skin || {}).map(v => (String(v).match(/^Custom_([\w-]+)/) || [])[1]).filter(Boolean)), mine = [];
  for (const a of ASSETS) if (ids.has(a.id)) mine.push(await store.packAsset(a));
  say('Exported'); download((rec.name.replace(/[\\/:*?"<>|]/g, '').trim() || 'skin') + '.skin.json', mine.length ? { name: rec.name, skin: rec.skin, assets: mine } : { name: rec.name, skin: rec.skin }); }
async function importSkinFiles(files) { let n = 0, items = 0, offered = 0;
  for (const f of [...files].slice(0, 200)) { try { const j = await readJsonFile(f, 8_000_000); if (Array.isArray(j?.assets)) offered += j.assets.filter(m => m && !ASSETS.some(a => a.id === m.id)).length; if (Array.isArray(j?.assets)) items += await store.unpackAssets(j.assets, m => !!CAT.items[m.field]?.some(e => !e.custom && e.Id === m.baseId)); const s = sanitize(j?.skin || j); if (s) { found.unshift({ name: cleanName(j?.name || f.name.replace(/(_portrait\.png)?(\.(skin|json))+$/i, '')).slice(0, 40) || 'Imported', skin: s }); n++; } } catch { /* not a skin file */ } }
  if (items) { await reloadAssets(); const d = await db.get('meta', 'draft').catch(() => null), ds = sanitize(d?.skin), have = new Set(ASSETS.map(x => 'Custom_' + x.id)); if (ds && (d.id || null) === (cur.id || null)) { const s2 = { ...cur.skin }; let n2 = 0; for (const f of Object.keys(ds)) { const v = ds[f], id = typeof v === 'string' && v.split('.')[0]; if (id && id.startsWith('Custom_') && have.has(id) && !cur.skin[f]?.startsWith?.('Custom_') && (cur.skin[f] || null) !== v) { s2[f] = v; n2++; } } if (n2) { cur.skin = R.fit(s2); keepDraft(); rebuild(); render(); } } }   /* only slots that wore a just-imported item go back; nothing else changes */   /* items that just arrived go back on the outfit that wore them */ found = found.slice(0, 200); say(n ? `Imported ${n} skin${n > 1 ? 's' : ''}` + (items ? ` and ${items} item${items > 1 ? 's' : ''}` : '') + (offered > items ? `; ${offered - items} item${offered - items > 1 ? 's' : ''} skipped` : '') : 'No skins in those files', !n || offered > items); tab = 'lookup'; setTab('lookup'); }
// opens in your skins folder when one is connected, else in Documents (no picker id: a remembered id folder would beat Documents); browsers without the picker fall back to the plain file box
async function pickSkinFiles(fallback) {
  if (typeof self.showOpenFilePicker !== 'function') return fallback.click();
  try { const start = await store.skinsFolder('My skins'), hs = await showOpenFilePicker({ multiple: true, startIn: start || 'documents', types: [{ description: 'Skin files', accept: { 'application/json': ['.json', '.skin'] } }] });
    importSkinFiles(await Promise.all(hs.map(h => h.getFile()))); } catch (e) { if (e.name !== 'AbortError') say(e.message, true); }
}
function panelLookup() {
  const input = el('input', { type: 'text', placeholder: 'Username or UUID', maxLength: 36, autocomplete: 'off', spellcheck: false, value: lookupQ });   // the name you looked up stays in the box
  const form = el('form', { class: 'row', onsubmit: e => { e.preventDefault(); lookup(input.value); } }, input, el('button', { class: 'btn primary', text: 'Find' }));
  const file = el('input', { type: 'file', accept: '.json,.skin,application/json', multiple: true, hidden: true, onchange: e => { importSkinFiles(e.target.files); e.target.value = ''; } });
  return [head('Players'), el('div', { class: 'pbody' },
    el('h3', { text: 'Find a player' }), form, el('p', { class: 'err', text: lookupMsg }),
    shown ? [el('h3', {}, 'Published by ' + shown.name, null), shown.skins === null ? el('p', { class: 'need', text: 'Looking…' })
      : shown.skins.length ? el('div', { class: 'cards' }, shown.skins.map(r => card(r, 'pub'))) : el('p', { class: 'need', text: shown.failed ? 'Could not load skins' : 'No skins' })] : null,
    el('h3', { text: 'Open skin files' }),
    el('button', { class: 'btn ghost', text: 'Choose skin files', onclick: () => pickSkinFiles(file) }), file,
    found.length ? [el('h3', { text: 'Found this session' }), el('div', { class: 'cards' }, found.map(r => card(r, 'found')))] : null)];
}

function panelHelp() {
  const sec = (t, ...ps) => [el('h3', { text: t }), ...ps.filter(p => p !== '').map(p => typeof p === 'string' ? el('p', { text: p }) : p)];
  const backupFile = el('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: guard(async e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; const data = await readJsonFile(f, 40_000_000), r = await store.importAll(data);
      { let more = 0; if (Array.isArray(data.favourites)) for (const k of data.favourites.slice(0, 2000)) if (typeof k === 'string' && k.length <= 200 && !LOCK.favs.has(k)) { LOCK.favs.add(k); more++; } if (more) saveLock();   /* favourites and pinned animations come back too */
        if (Array.isArray(data.emotes) && EMOTES) { for (const k of data.emotes.slice(0, 6)) { if (EMOTES.length >= 6) break; const [g, n] = typeof k === 'string' ? k.split('/') : []; if (g && n && (CAT.anims[g] || []).includes(n) && !EMOTES.includes(k)) { EMOTES.push(k); more++; } } db.put('meta', 'emotes', EMOTES).catch(() => {}); }   /* only real animations, only into free places: the player's own pins stay */
        if (Array.isArray(data.animations)) { const anim = await import('./anim.js'), have = new Set((await db.keys('meta')).filter(k => String(k).startsWith('anim:')));   /* animations: new ones added, ones already here left alone */
          for (const x of data.animations.slice(0, 500)) { try { if (!x || typeof x.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x.id) || have.has('anim:' + x.id) || !x.a || typeof x.a.nodeAnimations !== 'object' || !x.a.nodeAnimations) continue;
              const nm = clip(String(x.name || '').replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, '').replace(/\s+/g, ' ').trim(), 60) || 'My animation';
              await db.put('meta', 'anim:' + x.id, { id: x.id, name: nm, a: anim.read(x.a), updated: Number.isFinite(x.updated) ? x.updated : Date.now() }); have.add('anim:' + x.id); r.anims = (r.anims || 0) + 1; } catch { /* a broken one is skipped */ } } store.syncFolder().catch(() => {}); }
        r.extras = more; } await reloadAssets(); await refreshWard(); if (!r.added && !r.items && !r.skipped && !r.itemsSkipped && !r.extras && !r.anims) return say('Everything in that backup is already here'); if (!r.added && !r.items && r.anims) return say(`Restored ${r.anims} animation${r.anims === 1 ? '' : 's'}`); say(`Restored ${r.added} skin${r.added === 1 ? '' : 's'}` + (r.items ? `, ${r.items} item${r.items === 1 ? '' : 's'}` : '') + (r.skipped || r.itemsSkipped ? `; ${r.skipped + r.itemsSkipped} skipped (full)` : ''), !!(r.skipped || r.itemsSkipped)); }) });
  const steps = [['Wardrobe', 'pick a slot, click items to try them on.'], ['Locker', 'your saved skins.'], ['Animations', "the game's moves on your skin."],
    ['Creator', 'make your own items from any item.'], ['Players', 'look someone up by username.']];
  return [head('Help'), el('div', { class: 'pbody prose' },

    sec('Game files', META ? `${META.name} · ${META.files} files · ${new Date(META.at).toLocaleDateString()}` : 'Not connected yet.',
      el('div', { class: 'row' }, el('button', { class: 'btn ghost', text: 'Connect again', onclick: reconnect }),
        el('button', { class: 'btn danger', text: 'Forget game files', onclick: guard(async () => { if (!await confirmBox('Forget game files', 'Removes the copy of your game files from this browser. Your saved skins stay.', 'Forget', true)) return; await game.forget(); R = null; pics.clear(); fig.clearCache(); showConnect(); }) }))),
    MOD_URL ? sec('Skin Editor Sync', '', el('div', { class: 'row' }, modLink('primary'))) : null,
    sec('Backup', '',
      el('div', { class: 'row' }, el('button', { class: 'btn ghost', text: 'Download backup', onclick: guard(async () => download('skin-editor-backup.json', { ...(await store.exportAll()), favourites: [...LOCK.favs], emotes: EMOTES || undefined, animations: await Promise.all((await db.keys('meta')).filter(k => String(k).startsWith('anim:')).map(k => db.get('meta', k))) })) }), el('label', { class: 'btn ghost', tabIndex: 0, role: 'button', onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.querySelector('input')?.click(); } } }, 'Restore backup', backupFile))),
    )];
}


// ---------------------------------------------------------------- asset creator
let ASSETS = [], ED = null, edN = 0;
const itemName = e => e && e.custom ? e.Name : String((e && CAT.names && CAT.names[e.Name]) || nice(e ? e.Id : '')).replace(/^\[[A-Z]+\]\s*/, '');   /* the game's own work tags ([TMP]) are not part of the name */
// names the game already uses (its items and moves): custom pieces may not take them, and items sharing one show once
function gameNamed(n) { const k = String(n).trim().toLowerCase(); if (!gameNamed.set || gameNamed.cat !== CAT) {
    gameNamed.cat = CAT; gameNamed.set = new Set([...Object.values(CAT.items).flat().filter(e => !e.custom).map(e => itemName(e).toLowerCase()), ...Object.values(CAT.anims || {}).flat().map(a => nice(a).toLowerCase())]); }
  return gameNamed.set.has(k); }
const isTmp = e => !e.custom && (/^\s*\[?tmp\]?/i.test(itemName(e)) || /\bW\.?I\.?P\b/i.test(itemName(e)) || /(^|_)(tmp|wip)(_|$)/i.test(e.Id));   // the game's unfinished placeholder items
const oneEach = items => { const seen = new Set(); return items.filter(e => { if (e.custom) return true; const k = itemName(e).toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }); };
const hasCustom = skin => Object.values(skin).some(v => typeof v === 'string' && v.startsWith('Custom_'));
async function reloadAssets() { ASSETS = await assets.list().catch(() => []); registerAssets(); await loadLock(); await loadEmotes(); SHOWGAME = !!(await db.get('meta', 'showInGame').catch(() => false)); cur.skin = R.fit(cur.skin); }
const syncFolder = () => store.sync().catch(e => say(e.message, true));
function registerAssets() {   // custom assets join the catalogue as extra items in their slot, so the editor treats them like any other
  for (const f of game.FIELDS) { const arr = CAT.items[f]; for (let i = arr.length - 1; i >= 0; i--) if (arr[i].custom) arr.splice(i, 1); }
  for (const a of ASSETS) { const base = CAT.items[a.field].find(e => e.Id === a.baseId) || {};
    CAT.items[a.field].push({ ...base, Id: 'Custom_' + a.id, custom: true, baseId: a.baseId, Name: a.name, Tone: a.tone,
      Model: (ED && ED.asset.id === a.id ? ED.model : a.shape) ? `shape:${a.id}@${ED && ED.asset.id === a.id ? 'e' + ED.n + '.' + (ED.shapeN || 0) : a.updated}` : a.model, Variants: undefined, GradientSet: undefined, GreyscaleTexture: undefined, IsDefaultAsset: false,
      Textures: { Mine: { Texture: `custom:${a.id}@${ED && ED.asset.id === a.id ? 'live' + ED.n : a.updated}`, BaseColor: ['#f4c452'] } } }); }
}
fig.setCustomSource(async id => {
  if (ED && ED.asset.id === id) return ED.canvas;
  const a = ASSETS.find(x => x.id === id); if (!a) throw new Error('that custom asset is gone');
  const bmp = await createImageBitmap(a.data), c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height; c.getContext('2d').drawImage(bmp, 0, 0); return c;
});
const newAsset = guard(async (f, val) => { if (newAsset.busy) return; newAsset.busy = true;   /* a double click makes one copy */
  document.body.classList.add('busy');
  try { await makeAsset(f, val); } finally { document.body.classList.remove('busy'); newAsset.busy = false; }
});
async function makeAsset(f, val) {
  if (ASSETS.length + MAKING >= assets.MAX) throw new Error(`My items is full (${assets.MAX})`); MAKING++; try { return await makeAsset1(f, val); } finally { MAKING--; } }
async function makeAsset1(f, val) {
  if (val && cur.skin[f] && parse(cur.skin[f]).id === parse(val).id) val = cur.skin[f];   /* the worn item keeps its worn colour */
  const skin = val ? { ...cur.skin, [f]: val } : { ...cur.skin }; for (const h of HIDE[f] || []) delete skin[h]; const r = R.resolve(f, skin), it = R.find(f, skin[f]); if (!r || !it) throw new Error('Pick an item');
  const paidBase = it.custom ? CAT.items[f].find(e => e.Id === it.baseId) : it;
  if (paidBase && paidLocked(paidBase)) throw new Error(`${itemName(paidBase)} is a ${TIERS[tierOf(paidBase)]} item. Paid items can only be edited by an account that owns them.`);
  const src = it.custom ? ASSETS.find(x => 'Custom_' + x.id === it.Id) : null;
  if (it.custom && !src) throw new Error('That custom item is gone. Pick another one.');
  let a;
  if (src) a = await assets.save({ ...src, id: assets.newId(), name: copyName(src.name), flag: undefined });
  else { const c = await fig.bakedCanvas(r.tex, r.tint).catch(() => { throw new Error(`${itemName(it)} is not in your game files, so it can't be edited here.`); }), data = await new Promise(ok => c.toBlob(ok, 'image/png'));
    a = await assets.save({ id: assets.newId(), name: (() => { const used = new Set(ASSETS.map(x => x.name)), b = itemName(it) + ' (mine)'; let n = b, k = 2; while (used.has(n)) n = cleanName(clip(itemName(it), 30) + ' (mine) ' + k++); return n; })(), field: f, baseId: it.Id, model: r.model, w: c.width, h: c.height, data, tone: f === 'bodyCharacteristic' ? parse(skin[f]).color || undefined : undefined }); }
  ASSETS = await assets.list(); registerAssets(); beforeEdit = cur.skin; editMark ||= { at: hpos, dirty }; setSkin({ ...cur.skin, [f]: 'Custom_' + a.id + '.Mine' }); dirty = editMark.dirty; await openAsset(a);
  
}
const makePainter = (c, a) => createPainter(c, final => { fig.refreshCustom(a.id); if (final) { queueAssetSave(); recordPaint(); if (ED && !ED.replaying) render(); } }, () => render());
// a texture with no free room grows downwards (twice as tall, up to 256): the old paint stays where it was, the new rows are empty
function growWider() { const c = ED.canvas; if (c.width >= 256) return false; ED.painter.grow(c.height, Math.min(256, c.width * 2));   /* up to 256, also from sizes that are not powers of two */ ED.asset = { ...ED.asset, w: c.width }; ED.n = ++edN; requestAnimationFrame(() => { if (ED) { if (!ED.userZoom) fitTexture(); render(); } }); return true; }
function growAny() { const c = ED.canvas; return c.width < c.height ? (growWider() || growTexture()) : (growTexture() || growWider()); }   // grows the shorter side first
function growTexture() {
  const c = ED.canvas; if (c.height >= 256) return false;
  ED.painter.grow(Math.min(256, c.height * 2)); ED.asset = { ...ED.asset, h: c.height }; ED.n = ++edN; requestAnimationFrame(() => { if (ED) { if (!ED.userZoom) fitTexture(); render(); } }); return true;
}
async function openAsset(a) { say('');
  if (ED) await closeAsset(true);
  const bmp = await createImageBitmap(a.data), c = el('canvas', { width: bmp.width, height: bmp.height, className: 'paint' }); c.getContext('2d', { willReadFrequently: true }).drawImage(bmp, 0, 0);
  ED = { frame: true, asset: a, canvas: c, n: ++edN, zoom: Math.max(2, Math.min(8, Math.floor(280 / bmp.width))), rects: [], mode: 'paint', stool: 'move', hist: [], fut: [] };
  if (a.shape) ED.model = JSON.parse(a.shape);
  try { ED.rects = fig.usedRects(ED.model || await game.json(game.common(a.model))); } catch (e) { console.warn('no drawn area for', a.model, e); }
  ED.painter = makePainter(c, a); Object.assign(ED.painter, BRUSH);
  ED.painter.faceRect = (x, y) => ED.rects.filter(q => x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h).sort((p_, q) => p_.w * p_.h - q.w * q.h)[0] || null;   // the texture face a fill starts on
  { const k = STEPS.get(a.id); if (k && ED.painter.takeSteps(k.paint)) { ED.hist = k.hist; ED.fut = k.fut; ED.asset = { ...ED.asset, w: c.width, h: c.height }; } if (k && k.mode === 'shape') ED.reopenShape = true; }
  ED.painter.twinAt = (x, y) => st ? st.twinTexel(ED.canvas, x, y) : null; ED.painter.symOn = () => !!(ED && ED.mirror && st && !ONCE.has(ED.painter.tool));   // Symmetry: the painter maps every texel it paints to its twin
  ED.painter.faceAt = (x, y) => ED && ED.rects.find(r => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h);   // Fill > Whole side: which side was clicked
  if (ED.rects.length) { const m = new Uint8Array(c.width * c.height); for (const r of ED.rects) for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(c.height, Math.ceil(r.y + r.h)); y++) for (let x = Math.max(0, Math.floor(r.x)); x < Math.min(c.width, Math.ceil(r.x + r.w)); x++) m[y * c.width + x] = 1; ED.painter.mask = m; }
  ED.palette = ED.painter.palette(); ED.ovl = el('canvas', { className: 'limits' }); requestAnimationFrame(() => { fitTexture(); render(); }); setTimeout(() => { if (ED && !ED.userZoom) { const z = ED.zoom; fitTexture(); if (ED.zoom !== z) render(); } }, 150);   /* also when no frame comes (background tab) */ if (ED.reopenShape) { ED.reopenShape = false; setMode('shape').catch(e => console.warn(e)); }
  const flatPx = e => { const r = c.getBoundingClientRect(); return { x: Math.min(c.width - 1, Math.max(0, Math.floor((e.clientX - r.left) / r.width * c.width))), y: Math.min(c.height - 1, Math.max(0, Math.floor((e.clientY - r.top) / r.height * c.height))) }; };
  const flatPxM = e => { const p = flatPx(e); if (ED && ED.mirror && st) { const m = st.twinTexel(ED.canvas, p.x, p.y); if (m && (m.x !== p.x || m.y !== p.y)) p.m = m; } return p; };   /* Symmetry on the flat texture: the matching texel on the other side */
  bindPaint(c, flatPxM, 1e9); bindSelect(c, flatPx);
  c.addEventListener('pointermove', e => { if (!ED) return; ED.hover = flatPx(e); ED.hoverM = null; drawOvl(); }); c.addEventListener('pointerleave', () => { if (!ED) return; ED.hover = null; drawOvl(); });
  registerAssets(); ED.before = beforeEdit || cur.skin; beforeEdit = null; { const s = { ...cur.skin, [a.field]: 'Custom_' + a.id + '.Mine' }, cov = (HIDE[a.field] || []).filter(f => s[f]); for (const f of cov) delete s[f]; if (cov.length || !(cur.skin[a.field] || '').startsWith('Custom_' + a.id)) { editMark ||= { at: hpos, dirty }; setSkin(s); dirty = editMark.dirty; } }   /* what covers the item comes off while editing */
  setMount(null); ED.iso = true; st.isolate(c); st.anim.set(null); st.paintMode(true); tab = 'creator'; for (const b of $('tabs').children) b.classList.toggle('on', b.dataset.tab === 'creator'); render(); rebuild();
}
const BRUSH = (() => { try { const b = JSON.parse(store_.get('se_brush') || '{}'), o = {}; if (/^#[0-9a-f]{6}$/i.test(b.color)) o.color = b.color; if (b.size >= 1 && b.size <= 8) o.size = Math.round(b.size); if (b.opacity > 0 && b.opacity <= 1) o.opacity = b.opacity; if (['area', 'side', 'every'].includes(b.fillMode)) o.fillMode = b.fillMode; if (['brush', 'erase', 'part', 'fill', 'pick', 'replace', 'line', 'box', 'boxfill', 'light', 'dark', 'noise'].includes(b.tool)) o.tool = b.tool; return o; } catch { return {}; } })();
const keepBrush = () => { if (!ED) return; const P = ED.painter; Object.assign(BRUSH, { color: P.color, size: P.size, opacity: P.opacity, fillMode: P.fillMode, tool: P.tool === 'select' ? 'brush' : P.tool }); store_.set('se_brush', JSON.stringify(BRUSH)); };
const markSaved = ok => { if (!ED) return; ED.saved = ok; const s = $('wssaved'); if (s) { s.textContent = ok ? 'Saved' : 'Saving…'; s.classList.toggle('busy', !ok); } };
function queueAssetSave() { markSaved(false); clearTimeout(queueAssetSave.t); queueAssetSave.pending = true; queueAssetSave.t = setTimeout(() => { queueAssetSave.pending = false; flushAsset().catch(e => { console.warn(e); say('Could not save', true); }); }, 400); }
// leaving or hiding the page saves a waiting edit at once; if one is still waiting on reload or close, the browser asks first, so no edit is lost
// a reload can cut the async save short: the unsaved item is also kept in localStorage at once, and put back on the next start
const rescue = () => { try { if (document.activeElement?.matches?.('.wsname')) document.activeElement.blur(); } catch { /* fine */ } try { if (ED?.adjOpen && ED.adjCancel) ED.adjCancel(); } catch { /* fine */ }   /* the rescue copy never holds a colour preview */ if (!ED || ASIDE || !(queueAssetSave.pending || ED.saved === false)) return; try { const out = trimmedCanvas(ED);
  localStorage.setItem('se_rescue', JSON.stringify({ id: ED.asset.id, t: Date.now(), name: ED.asset.name, png: out.toDataURL('image/png'), w: out.width, h: out.height, shape: ED.model && ED.shapeN ? JSON.stringify(ED.model) : null, labels: ED.asset.labels || null, split: !!ED.asset.split })); } catch { /* storage full or blocked */ } };
async function applyRescue() { let r = null; try { r = JSON.parse(localStorage.getItem('se_rescue') || 'null'); localStorage.removeItem('se_rescue'); } catch { return; } if (!r || typeof r.png !== 'string') return;
  const a = ASSETS.find(x => x.id === r.id); if (!a || (a.updated || 0) >= r.t) return;
  const bin = atob(r.png.split(',')[1] || ''), u8 = Uint8Array.from(bin, c => c.charCodeAt(0));
  await assets.save({ ...a, data: new Blob([u8], { type: 'image/png' }), w: r.w, h: r.h, name: r.name || a.name, shape: r.shape || a.shape, labels: r.labels || a.labels, split: !!r.split }); ASSETS = await assets.list(); registerAssets(); }
const flushNow = () => { if (queueAssetSave.pending) { queueAssetSave.pending = false; flushAsset().catch(() => {}); } };
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushNow(); });
addEventListener('pageshow', e => { if (e.persisted) location.reload(); });   // back/forward cache: start fresh, the pagehide below already saved
addEventListener('pagehide', () => { rescue(); flushNow(); if (dirty && !ASIDE && READY) { clearTimeout(keepDraft.t); try { db.put('meta', 'draft', { id: cur.id, kind: cur.kind, slot: cur.slot, name: cur.name, skin: keptSkin(), auto: !!cur.auto, random: !!cur.random, t: Date.now() }).catch(() => {}); } catch { /* closing */ } flush(); }   /* the outfit starts saving at once, not after its timer */ if (!ASIDE && READY && cur) try { localStorage.setItem('se_draft', JSON.stringify({ id: cur.id, kind: cur.kind, slot: cur.slot, name: cur.name, skin: ED ? keptSkin() : cur.skin, auto: !!cur.auto, random: !!cur.random, dirty: !!dirty, t: Date.now() })); } catch { /* blocked */ }   /* the outfit survives a quick reload */ if (!ASIDE && ED && (ED.before || beforeEdit)) { cur.skin = ED.before ? keptSkin() : beforeEdit; db.put('meta', 'draft', { id: cur.id, kind: cur.kind, slot: cur.slot, name: cur.name, skin: cur.skin, auto: !!cur.auto, t: Date.now() }).catch(() => {}); } });
addEventListener('beforeunload', e => { if (dirty && !ASIDE && READY && (autosave.t || keepDraft.t)) { flush(); }   /* a change still on its save timer starts saving now */
  if (queueAssetSave.pending || (ED && ED.saved === false)) { rescue(); flushNow(); e.preventDefault(); e.returnValue = ''; } });
// the saved picture is only as big as what is drawn and used (a texture that grew for parts since removed shrinks back), in powers of two
function trimmedCanvas(e) { const c = e.canvas, W = c.width, H = c.height; let mx = 0, my = 0;
  for (const r of e.rects || []) { mx = Math.max(mx, Math.ceil(r.x + r.w)); my = Math.max(my, Math.ceil(r.y + r.h)); }
  const d = c.getContext('2d').getImageData(0, 0, W, H).data; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3]) { if (x + 1 > mx) mx = x + 1; if (y + 1 > my) my = y + 1; }
  const up = v => { let k = 16; while (k < v) k *= 2; return k; }, w = Math.min(W, up(mx)), h = Math.min(H, up(my)); if (w === W && h === H) return c;
  const t = document.createElement('canvas'); t.width = w; t.height = h; t.getContext('2d').drawImage(c, 0, 0); return t; }
async function flushAsset() { clearTimeout(queueAssetSave.t); if (!ED || ASIDE) return; if (ED.adjOpen) { ED.saveDeferred = true; markSaved(false); return; }   /* never save a colour preview; it saves once Adjust closes */ const e = ED, out = trimmedCanvas(e), data = await new Promise(ok => out.toBlob(ok, 'image/png'));
  const sent = e.asset, n0 = e.shapeN; let ok = false, threw = true;
  try { const saved = await assets.save({ ...sent, data, w: out.width, h: out.height, shape: e.model && e.shapeN ? JSON.stringify(e.model) : sent.shape });
    e.asset = e.asset === sent ? saved : { ...e.asset, w: saved.w, h: saved.h, updated: saved.updated, shape: saved.shape };   /* a rename or new labels made during the save are kept */
    threw = false; ok = e.asset === saved && e.shapeN === n0; ASSETS = await assets.list(); syncFolder(); }
  finally { if (ED === e) { if (ok) markSaved(true); else { markSaved(false); e.fails = threw ? (e.fails || 0) + 1 : 0; if (!queueAssetSave.pending && e.fails < 3) queueAssetSave(); if (e.fails >= 3 && $('wssaved')) $('wssaved').textContent = 'Not saved'; } } } }   /* a failed or overtaken save stays unsaved and tries again */
let CLIP = null;   // copied texture area, kept across items
let editMark = null;   // the outfit history point and save state before an item went on for editing: Done goes back to it with no trace
let beforeEdit = null;   // the outfit before an item went on for editing: Done puts it back, Equip keeps the item on
const STEPS = new Map();   // undo history per custom item, kept for this visit so reopening an item can still undo
function closeAsset(quiet, keep = false) { return (closeAsset.last = closeAsset1(quiet, keep)); }   // the last close is kept, so a delete can wait for its save
async function closeAsset1(quiet, keep = false) {
  if (!ED) return; $('app').classList.remove('ws-wide');   /* the panel width goes back with the editor */ if (ED.adjOpen && ED.adjCancel) ED.adjCancel();   /* Done with Adjust open drops the preview first */ const before = ED.before, fld = ED.asset.field, edited = ED.asset.id; keepBrush(); if (ED.float) placeFloat(); STEPS.delete(ED.asset.id); STEPS.set(ED.asset.id, { hist: ED.hist, fut: ED.fut, paint: ED.painter.keepSteps(), mode: ED.mode }); while (STEPS.size > 4) STEPS.delete(STEPS.keys().next().value);   /* undo history is kept for the last few items only (each can hold tens of MB) */ tour(99); if ($('viewhint')) $('viewhint').hidden = true; st.cursor(null); await checkReplica(); if (queueAssetSave.pending || ED.saved === false) await flushAsset().catch(() => {}); else clearTimeout(queueAssetSave.t);
  if (ED && ED.saved === false && ED.fails) { rescue(); say('Could not save', true); return; }   /* a failing save keeps the editor open (and a rescue copy) instead of dropping the work */
  ED = null;   /* nothing changed: nothing is re-saved */ if ($('viewhint')) $('viewhint').hidden = true; registerAssets(); const mark = editMark; editMark = null;
  if (before) { const fs = [...(keep ? [] : [fld]), ...(HIDE[fld] || [])], s = restoreFrom(cur.skin, before, fs);
    if (!keep && mark && hist[mark.at] && JSON.stringify(R.fit(JSON.parse(hist[mark.at]))) === JSON.stringify(R.fit(s))) { const s0 = R.fit(JSON.parse(hist[mark.at])); hist = hist.slice(0, mark.at + 1); hpos = mark.at; cur.skin = s0; dirty = mark.dirty; pushWearing(); keepDraft(); rebuild(); render(); }   /* Done without Wear: the outfit and its history are as before */
    else if (JSON.stringify(s) !== JSON.stringify(cur.skin)) setSkin(s); else if (keep) { dirty = true; autosave(); keepDraft(); } } st.highlight(null); st.isolate(null); st.paintMode(false); st.gizmo(null); setTimeout(() => { viewInset(); st.unclose(); }, 60); for (const k of [...pics.keys()]) if (k.includes(edited)) pics.delete(k);
  if (!quiet) { playAnim('Default', 'Idle', 0.5); rebuild(); render(); }
}
// painting: the same strokes whether the pointer is on the flat texture or on the 3D model
function geoTwin(node) {   // the part on the other side found on the model itself (parts nested under unnamed halves, like a pigtail's Side under Top~2)
  const votes = new Map(); for (const r of ED.rects.filter(x => x.node === node)) for (const [fx, fy] of [[0.5, 0.5], [0.25, 0.25], [0.75, 0.75]]) { const t = st.twinTexel(ED.canvas, Math.floor(r.x + r.w * fx), Math.floor(r.y + r.h * fy)); if (!t) continue;
    for (const o of ED.rects) if (o.node !== node && t.x >= o.x && t.x < o.x + o.w && t.y >= o.y && t.y < o.y + o.h) votes.set(o.node, (votes.get(o.node) || 0) + 1); }
  const best = [...votes].sort((a, b) => b[1] - a[1])[0]; return best ? best[0] : null; }   /* a name: look it up after the model is rebuilt */
const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
function sharersOf(node) { const mine = ED.rects.filter(r => r.node === node); return [...new Set(ED.rects.filter(r => r.node !== node && mine.some(m => overlaps(m, r))).map(r => r.node))]; }
async function colourPart(node) {
  ED.noCap = true; const h0 = ED.hist.length, splitWas = !!ED.asset.split, sz0 = [ED.canvas.width, ED.canvas.height]; await editModel(); splitShared();   /* every part (cuffs and other attached pieces too) gets its own paint first, so the colour never leaks to a twin */
  const others = sharersOf(node);
  if (others.length) { await editModel(); const k = boxesOf(ED.model).findIndex(b => b.node.name === node);
    if (k >= 0) { ED.box = k; if (!ownArea(true)) { if (ED.hist.length > h0) ED.hist.push({ k: 'g', splitWas, splitNow: !!ED.asset.split, sz: [sz0, [ED.canvas.width, ED.canvas.height]], parts: ED.hist.splice(h0) }); ED.noCap = false; capHist(); return say('Texture full', true); } } }
  let tw = null; if (ED.mirror) { const bb = boxesOf(ED.model).find(x => x.node.name === node); tw = bb && twinOf(bb); if (tw && tw.name === node) tw = null; if (!tw) { const m = /^(.*)~(\d+)$/.exec(node), other = m ? (m[2] === '2' ? m[1] : null) : node + '~2'; tw = other && boxesOf(ED.model).find(b => b.node.name === other)?.node || null; } }   /* a shared mirrored part the split copied (Side under Top, Side~2 under Top~2) */
  if (tw && sharersOf(tw.name).some(n => n !== node)) { await editModel(); const k = boxesOf(ED.model).findIndex(b => b.node.name === tw.name); if (k >= 0) { const was = ED.box; ED.box = k; if (!ownArea(true)) tw = null; ED.box = was; } }   /* the twin's paint must not leak to the parts it shares texture with either */
  tintAll(ED.painter.color, tw ? [node, tw.name] : node);   /* Symmetry: both sides in one pass, one shared shade, one step */
  if (ED.hist.length > h0) ED.hist.push({ k: 'g', splitWas, splitNow: !!ED.asset.split, sz: [sz0, [ED.canvas.width, ED.canvas.height]], parts: ED.hist.splice(h0) }); if (ED.lastTint) ED.lastTint.top = ED.hist[ED.hist.length - 1]; ED.noCap = false; capHist();   /* one click, one undo (the cap waits, so it can't shift the start) */
}
const partName = n => { const b = ED.model && boxesOf(ED.model).find(x => x.node.name === n); return b ? boxLabel(b.node) : /^Box_/.test(n) ? 'New box' : boxLabel({ name: n }); };   // same names in Paint as in Shape's outliner
function partHover(e) { if (ED.mode === 'shape' || ED.painter.tool !== 'part') return;
  const m = st.pickMesh(e.clientX, e.clientY, o => o.material?.map?.image === ED.canvas), n = m ? m.userData.nodeName : null; if (n === ED.partLit) return;
  ED.partLit = n; st.highlight(n ? o => o.material?.map?.image === ED.canvas && o.userData.nodeName === n : null); }
function partAt(e, onModel, toPixel) {   // the box under the pointer: on the model by its mesh, on the texture by the area it owns
  if (onModel) { const m = st.pickMesh(e.clientX, e.clientY, o => o.material?.map?.image === ED.canvas); return m ? m.userData.nodeName : null; }
  const p = toPixel(e); if (!p) return null; const hit = ED.rects.filter(q => p.x >= q.x && p.x < q.x + q.w && p.y >= q.y && p.y < q.y + q.h).sort((a, b) => a.w * a.h - b.w * b.h)[0]; return hit ? hit.node : null;
}
function turnDrag(e) {   // drag on empty space or another body part: the model turns, like right-drag
  const v = $('view'); let x = e.clientX, y = e.clientY; try { v.setPointerCapture(e.pointerId); } catch { /* fine */ }
  const move = ev => { st.orbit(ev.clientX - x, ev.clientY - y); x = ev.clientX; y = ev.clientY; };
  const up = () => { v.removeEventListener('pointermove', move); v.removeEventListener('pointerup', up); v.removeEventListener('pointercancel', up); };
  v.addEventListener('pointermove', move); v.addEventListener('pointerup', up); v.addEventListener('pointercancel', up);
}
function bindPaint(target, toPixel, reach, onModel) { let down = false, last = null;
  let lastC = null, startC = null;
  const at = (x, y) => toPixel({ clientX: x, clientY: y });
  const along = (a, b, step = 2) => { const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / step)), out = []; for (let i = 1; i <= n; i++) out.push({ x: a.x + (b.x - a.x) * i / n, y: a.y + (b.y - a.y) * i / n }); return out; };
  const outline = (a, b) => { const c = [a, { x: b.x, y: a.y }, b, { x: a.x, y: b.y }, a]; const pts = [a]; for (let i = 0; i < 4; i++) pts.push(...along(c[i], c[i + 1]), null); return pts; };
  const shapeOnModel = (cur, final) => { const t = ED.painter.tool, a = startC; let pts;
    if (t === 'line') pts = [a, ...along(a, cur)];
    else if (t === 'boxfill' && final) { pts = []; const x0 = Math.min(a.x, cur.x), x1 = Math.max(a.x, cur.x), y0 = Math.min(a.y, cur.y), y1 = Math.max(a.y, cur.y);
      for (let y = y0; y <= y1; y += 2) { for (let x = x0; x <= x1; x += 2) pts.push({ x, y }); pts.push(null); } }
    else pts = outline(a, cur);
    ED.painter.trace(pts.map(q => q && at(q.x, q.y)), reach); };
  target.addEventListener('pointerdown', e => { if (!ED || e.button !== 0 || (!onModel && (ED.painter.tool === 'select' || ED.mode === 'shape'))) return;
    if (ED.adjOpen) { if (onModel) turnDrag(e); return; }   /* no painting while colours are being adjusted: Cancel must put everything back */
    if (ED.painter.tool === 'part' && ED.mode !== 'shape') { const node = partAt(e, onModel, toPixel); if (node) { e.preventDefault(); colourPart(node).catch(err => say(err.message, true)); return; } if (!onModel) return; }
    const p = onModel && (ED.painter.tool === 'select' || ED.painter.tool === 'part') ? null : toPixel(e);
    if (!p) { if (onModel && !st.gizmoBusy(e.clientX, e.clientY) && !(ED.mode === 'shape' && st.pickMesh(e.clientX, e.clientY, o => o.material?.map?.image === ED.canvas))) turnDrag(e); return; } e.preventDefault(); try { target.setPointerCapture(e.pointerId); } catch { /* fine */ }
    down = true; last = p; lastC = startC = { x: e.clientX, y: e.clientY }; ED.painter.begin();
    if (onModel && SHAPES.has(ED.painter.tool)) shapeOnModel(startC, false); else { ED.painter.stroke(p, p); if (ED.mirror && (p.m || ED.painter.fillMode !== 'side')) ED.painter.fillAlso(p.m || p); } });
  const paintTo = p => { if (!p) { last = null; return; } const from = last && Math.abs(last.x - p.x) + Math.abs(last.y - p.y) <= reach ? last : p; ED.painter.stroke(from, p); last = p; };
  target.addEventListener('pointermove', e => { if (!down || !ED) return; const cur = { x: e.clientX, y: e.clientY };
    if (!onModel) { const p = toPixel(e); if (p) { ED.painter.stroke(last && !SHAPES.has(ED.painter.tool) && Math.abs(last.x - p.x) + Math.abs(last.y - p.y) > reach ? p : last || p, p); last = p; } return; }
    if (SHAPES.has(ED.painter.tool)) { shapeOnModel(cur, false); lastC = cur; return; }
    for (const q of along(lastC, cur)) paintTo(at(q.x, q.y));   // a fast drag is filled in between pointer positions, so it never breaks into dots
    lastC = cur; });
  const up = e => { if (!down) return; down = false; if (ED && onModel && SHAPES.has(ED.painter.tool) && ED.painter.tool === 'boxfill' && e && e.clientX != null) shapeOnModel({ x: e.clientX, y: e.clientY }, true); ED && ED.painter.end(); };
  target.addEventListener('pointerup', up); target.addEventListener('pointercancel', up);
}
const urls = new Map();
function assetThumb(a) {   // the piece as it looks worn, on the bare character (falls back to the flat texture)
  const it = R?.ITEMS[a.field]?.find(e => e.Id === 'Custom_' + a.id); if (!it) return assetPicture(a);
  const s = bareSkin(a.field, R.partStr(it)), frame = FACE_FRAME[a.field] || (HEADF.has(a.field) ? 'head' : LEGF.has(a.field) ? 'legs' : a.field === 'bodyCharacteristic' || a.field === 'skinFeature' ? 'body' : 'torso');
  return lazyImg('a|' + a.id + '@' + a.updated, async () => fig.snapshot(await fig.build(s, R), frame, a.field === 'cape'), 'a|' + a.id); }
function assetPicture(a) { const k = a.id + '@' + a.updated; if (!urls.has(k)) { for (const [o, u] of urls) if (o.startsWith(a.id + '@')) { URL.revokeObjectURL(u); urls.delete(o); } urls.set(k, URL.createObjectURL(a.data)); } return el('img', { alt: '', src: urls.get(k), draggable: false }); }
function downloadBlob(name, blob) { const a = el('a', { href: URL.createObjectURL(blob), download: name }); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
// Paid (edition and reward) items: open to edit only for an account that owns them. Hytale's sign-in tells us what an account
// owns (its entitlements, the same names the game files list under each item); until then every paid item stays locked.
const owns = e => { const need = Array.isArray(e?.Entitlements) ? e.Entitlements : [], have = ACCOUNT && Array.isArray(ACCOUNT.entitlements) ? ACCOUNT.entitlements : null;
  return !!have && need.length > 0 && need.every(x => have.includes(x)); };
const paidLocked = e => tierOf(e) > 0 && !owns(e);
const lockedBase = a => { const it = CAT.items[a.field].find(e => e.Id === a.baseId); return it && paidLocked(it) ? tierOf(it) : 0; };
const modReady = a => lockedBase(a) === 0 && !a.flag;
store.setLockedOf(a => !modReady(a));
store.setKeepOwnOf(skin => R ? game.FIELDS.filter(f => { const it = R.find(f, skin[f]); if (!it) return false; if (!it.custom) return paidLocked(it); const a = ASSETS.find(x => 'Custom_' + x.id === it.Id); return !a || !modReady(a); }) : []);
// ---- paid items stay paid: no repaints of edition or reward items, and no repaints that copy one
// A custom asset keeps its base item's 3D shape, so it can only pass for a paid item that uses the same model. Its texture is
// compared, on the drawn area only, with every paid texture for that model: pixel colours (a straight copy) and the light and
// dark pattern around the average (a recolour). It is flagged when it matches a paid item closely and matches that item clearly
// better than its own free base.
const imgCache = new Map();
async function imageData(path) {   // { d, w, h } of a game texture
  if (imgCache.has(path)) return imgCache.get(path);
  let out = null;
  try { const b = await game.bitmap(game.common(path)), c = el('canvas', { width: b.width, height: b.height }), x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(b, 0, 0); out = { d: x.getImageData(0, 0, b.width, b.height).data, w: b.width, h: b.height }; } catch { /* not readable */ }
  imgCache.set(path, out); return out;
}
function cropTo(data, mask, W, w, h) {   // the top-left w x h of a W-wide picture and its mask
  const d = new Uint8ClampedArray(w * h * 4), m = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) { d.set(data.subarray(y * W * 4, (y * W + w) * 4), y * w * 4); m.set(mask.subarray(y * W, y * W + w), y * w); }
  return [d, m];
}
function texturesFor(item, model) {   // [path, coloured?] for every look of an item on this model
  const out = [], take = s => { if (!s || s.Model !== model) return; if (s.Textures) for (const t of Object.values(s.Textures)) if (t.Texture) out.push([t.Texture, true]); if (s.GreyscaleTexture) out.push([s.GreyscaleTexture, false]); };
  take(item); for (const v of Object.values(item.Variants || {})) take({ ...item, ...v, Model: v.Model || item.Model });
  return out;
}
function likeness(mine, other, mask, coloured) {
  let n = 0, sa = 0, sb = 0;
  for (let k = 0; k < mask.length; k++) { const i = k * 4; if (!mask[k] || !mine[i + 3] || !other[i + 3]) continue; n++; sa += mine[i] + mine[i + 1] + mine[i + 2]; sb += other[i] + other[i + 1] + other[i + 2]; }
  if (n < 24) return 0; const ma = sa / n / 3, mb = sb / n / 3; let same = 0, shape = 0;
  for (let k = 0; k < mask.length; k++) { const i = k * 4; if (!mask[k] || !mine[i + 3] || !other[i + 3]) continue;
    if (coloured && Math.abs(mine[i] - other[i]) + Math.abs(mine[i + 1] - other[i + 1]) + Math.abs(mine[i + 2] - other[i + 2]) <= 36) same++;
    if (Math.abs((mine[i] + mine[i + 1] + mine[i + 2]) / 3 - ma - ((other[i] + other[i + 1] + other[i + 2]) / 3 - mb)) <= 10) shape++; }
  return Math.max(same, shape) / n;
}
async function replicaOf(a, canvas, mask) {
  const items = CAT.items[a.field].filter(e => !e.custom), paid = items.filter(e => tierOf(e) > 0 && texturesFor(e, a.model).length); if (!paid.length) return null;
  const w = canvas.width, h = canvas.height, mine = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
  const m = mask || new Uint8Array(w * h).fill(1), crops = new Map(), best = async e => { let s = 0; for (const [p, col] of texturesFor(e, a.model)) { const img = await imageData(p); if (!img || img.w > w || img.h > h) continue;
    const k = img.w + 'x' + img.h; if (!crops.has(k)) crops.set(k, img.w === w && img.h === h ? [mine, m] : cropTo(mine, m, w, img.w, img.h)); const [mm, mk] = crops.get(k); s = Math.max(s, likeness(mm, img.d, mk, col)); } return s; };
  const base = items.find(e => e.Id === a.baseId), own = base ? await best(base) : 0;
  let hit = null, top = 0; for (const e of paid) { const s = await best(e); if (s > top) { top = s; hit = e; } }
  return top >= 0.85 && top >= own + 0.1 ? itemName(hit) : null;
}
// ---- shapes: a reshaped item may not copy a paid item's shape either. Each model becomes its list of boxes (centre and sorted
// sizes, with every node's position, turn and offset applied); two shapes match when most boxes of each have a twin in the
// other (centre and sizes within a tolerance that grows with the box). Flagged like a texture copy: the shape matches a paid item closely
// and clearly better than the free item it was made from does.
function qmul(a, b) { return { x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y, y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x, z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w, w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z }; }
function qrot(q, v) { const p = qmul(qmul(q, { x: v[0], y: v[1], z: v[2], w: 0 }), { x: -q.x, y: -q.y, z: -q.z, w: q.w }); return [p.x, p.y, p.z]; }
function boxList(model) {
  const out = [], v = o => [o?.x ?? 0, o?.y ?? 0, o?.z ?? 0];
  const walk = (n, R, t) => { const q = { x: n.orientation?.x ?? 0, y: n.orientation?.y ?? 0, z: n.orientation?.z ?? 0, w: n.orientation?.w ?? 1 };
    const p = qrot(R, v(n.position)), R2 = qmul(R, q), t2 = [t[0] + p[0], t[1] + p[1], t[2] + p[2]], sh = n.shape || {}, o = qrot(R2, v(sh.offset)), c = [t2[0] + o[0], t2[1] + o[1], t2[2] + o[2]];
    if ((sh.type === 'box' || sh.type === 'quad') && sh.visible !== false) { const st = v(sh.stretch).map(x => x || 1), sz = v(sh.settings?.size).map((x, k) => Math.abs(x * st[k])).sort((a, b) => a - b); out.push({ c, s: sz }); }
    for (const ch of n.children || []) walk(ch, R2, c); };
  for (const n of model.nodes || []) walk(n, { x: 0, y: 0, z: 0, w: 1 }, [0, 0, 0]);
  return out;
}
function shapeLikeness(A, B) {
  if (!A.length || !B.length) return 0;
  // tolerances grow with the box, so small shifts and stretches of a copied shape still count as the same box
  const twin = (b, list) => list.some(a => Math.hypot(a.c[0] - b.c[0], a.c[1] - b.c[1], a.c[2] - b.c[2]) <= Math.max(2.5, 0.3 * b.s[2]) && a.s.every((x, k) => Math.abs(x - b.s[k]) <= Math.max(2, 0.25 * b.s[k])));
  return Math.min(B.filter(b => twin(b, A)).length / B.length, A.filter(a => twin(a, B)).length / A.length);
}
async function shapeReplicaOf(a, model) {
  const items = CAT.items[a.field].filter(e => !e.custom), models = e => [...new Set([e.Model, ...Object.values(e.Variants || {}).map(v => v.Model)].filter(Boolean))];
  const mine = boxList(model), load = async p => { try { return boxList(await game.json(game.common(p))); } catch { return []; } };
  const base = items.find(e => e.Id === a.baseId); let own = 0;
  let hit = null, top = 0;
  for (const e of items.filter(e => tierOf(e) > 0)) for (const m of models(e)) { const s = shapeLikeness(mine, await load(m)); if (s > top) { top = s; hit = e;
    if (base) for (const bm of models(base)) own = Math.max(own, shapeLikeness(await load(bm), await load(m))); } }
  return top >= 0.8 && top >= own + 0.15 ? itemName(hit) : null;
}
async function checkReplica() {   // after an import, a recolour, a shape change or leaving the editor
  if (!ED) return; const e = ED;
  let flag = await replicaOf(e.asset, e.canvas, e.painter.mask).catch(() => null), why = 'looks';
  if (!flag && e.model && (e.shapeN || e.asset.shape)) { flag = await shapeReplicaOf(e.asset, e.model).catch(() => null); why = 'shape is'; }
  if ((flag || undefined) === e.asset.flag) return;
  e.asset = { ...e.asset, flag: flag || undefined }; queueAssetSave();
  if (flag) say(`Too close to ${flag} (paid): site only`, true);
  render();
}

const FLAG_WHY = n => `Too close to ${n} (paid): site only until it differs more`;
function copyName(n) { const stem = n.replace(/ \(mine\)$/, '').replace(/ copy( \d+)?$/, ''), used = new Set(ASSETS.map(x => x.name)); for (let k = 1; k < 1000; k++) { const suf = ' copy' + (k > 1 ? ' ' + k : ''), out = cleanName(clip(stem, 40 - suf.length) + suf); if (!used.has(out)) return out; } return cleanName(clip(stem, 34) + ' copy'); }   /* the suffix always fits the 40-character limit */
let MAKING = 0;   // copies being written: quick repeat clicks can't pass the item limit
async function copyAsset(a) { if (copyAsset.busy) return; copyAsset.busy = true; try { return await copyAsset1(a); } finally { copyAsset.busy = false; } }   /* a double click makes one copy */
async function copyAsset1(a) { if (ASSETS.length + MAKING >= assets.MAX) throw new Error(`My items is full (${assets.MAX})`);
  MAKING++; try { await assets.save({ ...a, id: assets.newId(), name: copyName(a.name), flag: undefined }); ASSETS = await assets.list(); } finally { MAKING--; } registerAssets(); syncFolder(); render(); }
const keepAny = () => store_.set('se_anyitem', JSON.stringify({ picks: anyItem.picks || {}, slot: anyItem.slot }));   // the picker's slot and item, remembered between visits
function anyItem() {   // or start from any free item in the game, worn or not
  if (!anyItem.loaded) { anyItem.loaded = true; try { const k = JSON.parse(store_.get('se_anyitem') || '{}'); anyItem.picks = k.picks || {}; anyItem.slot = k.slot; } catch { /* fresh */ } }
  const slots = game.FIELDS.filter(f => CAT.items[f].some(e => !e.custom && !paidLocked(e))), slot = el('select', { title: 'Slot' }, slots.map(f => el('option', { value: f, text: LABEL[f] })));
  const ok = e => !e.custom && !paidLocked(e) && !/^\s*\[?tmp\]?/i.test(itemName(e)) && !/(^|_)tmp(_|$)/i.test(e.Id);
  // the item list is our own drop-down (a plain one can't tell us what the pointer is over): the picture shows the item under the pointer or arrow keys, and goes back to the chosen one
  const edit = el('button', { class: 'btn primary', text: 'Edit a copy', onclick: () => { const [f, e] = pick(); if (e) newAsset(f, R.partStr(e)); } });
  const item = el('button', { type: 'button', class: 'anypick', 'aria-label': 'Item' }), menu = el('div', { class: 'anymenu', role: 'listbox', hidden: true });
  item.setAttribute('aria-haspopup', 'listbox'); item.setAttribute('aria-expanded', 'false');
  const find_ = el('input', { type: 'search', placeholder: 'Search', class: 'anysearch' }), pic = el('div', { class: 'pic anypic' });
  let list = [], at = -1, act = -1, hov = 0;
  const pick = () => { const r = list[at]; return r ? [r[1], r[2]] : []; };
  const draw = i => { const r = list[i]; setPic(itemThumb(r ? r[1] : slot.value, r ? r[2] : null, undefined, undefined, true)); };
  const setPic = img => {
    if (img.src || !pic.firstChild) { pic.replaceChildren(img); return; }   // ready now: swap at once; otherwise keep the old picture until the new one is drawn
    img.classList.add('next'); img.addEventListener('load', () => { if (img.isConnected) { img.classList.remove('next'); pic.replaceChildren(img); } }, { once: true });
    [...pic.querySelectorAll('img.next')].forEach(x => x.remove()); pic.append(img); };
  const peek = i => { clearTimeout(hov); hov = setTimeout(() => draw(i), 40); };
  const mark = i => { act = i; menu.querySelectorAll('[aria-selected=true]').forEach(o => o.setAttribute('aria-selected', 'false')); const o = menu.children[i]; if (o) { o.setAttribute('aria-selected', 'true'); o.scrollIntoView({ block: 'nearest' }); } };
  const label = () => { item.textContent = list[at]?.[0] || (list.length ? 'Choose an item' : 'Nothing found'); edit.disabled = !list[at]?.[2]; };
  const away = ev => { if (!menu.contains(ev.target) && ev.target !== item) close(); };
  const drift = ev => { if (!menu.contains(ev.target)) close(); };   // the list floats over the page, so it closes when the page under it scrolls
  const close = () => { if (menu.hidden) return; menu.hidden = true; if (item.isConnected) item.after(menu); else menu.remove(); item.setAttribute('aria-expanded', 'false'); peek(at); document.removeEventListener('pointerdown', away, true); removeEventListener('scroll', drift, true); removeEventListener('resize', close); };
  const edge = () => Math.min(innerHeight, document.querySelector('.panel')?.getBoundingClientRect().bottom || innerHeight);   // the panel's own bottom, above the footer
  const place = () => { const r = item.getBoundingClientRect(), below = edge() - r.bottom - 8, above = r.top - 8, up = below < 220 && above > below, h = Math.min(320, up ? above : below);
    Object.assign(menu.style, { left: r.left + 'px', width: r.width + 'px', maxHeight: Math.max(80, h) + 'px', top: up ? '' : r.bottom + 2 + 'px', bottom: up ? innerHeight - r.top + 2 + 'px' : '' }); };
  const open = () => { if (!list.length || !menu.hidden) return; document.querySelectorAll('body > .anymenu').forEach(x => x.remove()); document.body.append(menu); place(); menu.hidden = false; item.setAttribute('aria-expanded', 'true'); mark(at);
    document.addEventListener('pointerdown', away, true); addEventListener('scroll', drift, true); addEventListener('resize', close); };
  const choose = i => { if (list[i]?.[3]) return; at = i; if (list[i] && list[i][2]) { (anyItem.picks ||= {})[list[i][1]] = list[i][2].Id; anyItem.slot = list[i][1]; if (slot.value !== list[i][1]) { slot.value = list[i][1]; slotBtn.textContent = LABEL[slot.value]; } } keepAny(); label(); close(); clearTimeout(hov); draw(at); };
  item.onclick = () => menu.hidden ? open() : close();
  item.onkeydown = ev => { const k = ev.key, n = list.length; if (!n) return;
    if (k === 'ArrowDown' || k === 'ArrowUp') { ev.preventDefault(); if (menu.hidden) open(); const i = Math.max(0, Math.min(n - 1, act + (k === 'ArrowDown' ? 1 : -1))); mark(i); peek(i); }
    else if ((k === 'Home' || k === 'End') && !menu.hidden) { ev.preventDefault(); const i = k === 'Home' ? 0 : n - 1; mark(i); peek(i); }
    else if ((k === 'Enter' || k === ' ') && !menu.hidden) { ev.preventDefault(); choose(act); }
    else if (k === 'Escape' && !menu.hidden) { ev.preventDefault(); close(); } else if (k === 'Tab') close(); };
  menu.onpointerover = ev => { const o = ev.target.closest('[role=option]'); if (o && +o.dataset.i !== act) { const i = +o.dataset.i; mark(i); peek(i); } };
  menu.onpointerleave = () => peek(at);
  menu.onclick = ev => { const o = ev.target.closest('[role=option]'); if (o) { choose(+o.dataset.i); item.focus(); } };
  const fill = () => { const q = find_.value.trim().toLowerCase(), from = q ? slots : [slot.value];   // a search looks in every slot
    const rank = r => { if (!q || !r[2]) return 0; const nm = itemName(r[2]).toLowerCase(), w = nm.split(/\s+/); return nm === q ? 0 : nm.startsWith(q) ? 1 : w[0] === q || w.includes(q) && w.indexOf(q) === 0 ? 1 : nm.split(/\s+/).some(x => x === q) ? 2 : 3; };
    const paidOk = e => !e.custom && paidLocked(e) && !isTmp(e) && !/^\s*\[?tmp\]?/i.test(itemName(e));   /* paid items are listed, greyed: they can't be copied */
    list = from.flatMap(f => oneEach(CAT.items[f]).filter(e => (ok(e) || paidOk(e)) && !isTmp(e) && (!q || itemName(e).toLowerCase().includes(q))).map(e => [itemName(e) + (q ? ` (${LABEL[f]})` : ''), f, e, paidLocked(e)])).sort((a, b) => (a[3] - b[3]) || rank(a) - rank(b) || a[0].localeCompare(b[0]));   // a search puts exact names first, then names that start with it
      // None: the picture shows the slot empty; wearing nothing there starts on a random item
    menu.replaceChildren(...list.map(([n, , , paid], i) => el('div', { role: 'option', class: 'anyopt' + (paid ? ' paid' : ''), 'aria-disabled': paid ? 'true' : null, data: { i }, 'aria-selected': 'false' }, el('span', { text: n }), paid ? el('small', { text: 'Paid' }) : null)));
    const worn = !q && parse(cur.skin[slot.value]).id, kept = (anyItem.picks ||= {})[slot.value], at0 = id => list.findIndex(r => r[2] && !r[3] && r[2].Id === id), free = list.findIndex(r => !r[3]); at = q ? free : kept ? at0(kept) : -1; if (!q && at < 0) at = at0(worn);   // the item shown last time stays, so the picker doesn't jump around between visits
    if (!q && at < 0 && (anyItem.rand ||= {})[slot.value]) at = at0(anyItem.rand[slot.value]);
    if (!q && at < 0 && free >= 0) { const frees = list.map((r, i) => r[3] ? -1 : i).filter(i => i >= 0); at = frees[Math.floor(Math.random() * frees.length)]; anyItem.rand[slot.value] = list[at][2].Id; } if (!q && at >= 0 && list[at][2]) anyItem.picks[slot.value] = list[at][2].Id;   // whatever is shown first stays shown (wearing something new doesn't swap it)
    act = Math.max(0, at); label(); item.disabled = !list.length; close(); clearTimeout(hov); draw(at); };
  slot.value = slots.includes(anyItem.slot) ? anyItem.slot : slots.includes('overtop') ? 'overtop' : slots[0]; fill(); slot.onchange = () => { anyItem.slot = slot.value; keepAny(); find_.value = ''; fill(); slotBtn.textContent = LABEL[slot.value]; }; find_.oninput = fill;
  const slotBtn = el('button', { type: 'button', class: 'anypick', text: LABEL[slot.value], 'aria-label': 'Item type' }), slotMenu = el('div', { class: 'anymenu', role: 'listbox', hidden: true });
  const slotItem = f => { const items = oneEach(CAT.items[f]).filter(ok), want = (anyItem.picks || {})[f] || parse(cur.skin[f]).id; return items.find(e => e.Id === want) || items[0] || null; };
  const showSlot = f => setPic(itemThumb(f, slotItem(f), undefined, undefined, true));
  const slotClose = () => { if (slotMenu.hidden) return; slotMenu.hidden = true; slotMenu.remove(); draw(at); document.removeEventListener('pointerdown', slotAway, true); removeEventListener('scroll', slotScroll, true); slotBtn.setAttribute('aria-expanded', 'false'); };
  const slotScroll = e => { if (!slotMenu.contains(e.target)) slotClose(); };   // the page scrolling closes it; scrolling its own list does not
  let si = -1; slotBtn.setAttribute('aria-haspopup', 'listbox'); slotBtn.setAttribute('aria-expanded', 'false');
  slotBtn.addEventListener('keydown', ev => { const opts = [...slotMenu.children], k = ev.key;   // the type menu works by keyboard: arrows move, Enter picks, Escape closes
    if (k === 'Escape' && !slotMenu.hidden) { ev.preventDefault(); ev.stopPropagation(); slotClose(); return; }
    if (k === 'Tab') { slotClose(); return; }
    if ((k === 'Home' || k === 'End') && !slotMenu.hidden) { ev.preventDefault(); si = k === 'Home' ? 0 : opts.length - 1; opts.forEach((o, i) => { o.classList.toggle('on', i === si); o.setAttribute('aria-selected', String(i === si)); }); opts[si]?.scrollIntoView({ block: 'nearest' }); showSlot(slots[si]); return; }
    if (k === 'ArrowDown' || k === 'ArrowUp') { ev.preventDefault(); if (slotMenu.hidden) { slotBtn.click(); si = Math.max(0, slots.indexOf(slot.value)); } else si = (si + (k === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
      opts.forEach((o, i) => { o.classList.toggle('on', i === si); o.setAttribute('aria-selected', String(i === si)); }); opts[si]?.scrollIntoView({ block: 'nearest' }); showSlot(slots[si]); return; }
    if ((k === 'Enter' || k === ' ') && !slotMenu.hidden && si >= 0) { ev.preventDefault(); opts[si]?.click(); slotBtn.focus(); } });
  const slotAway = ev => { if (!slotMenu.contains(ev.target) && ev.target !== slotBtn) slotClose(); };
  slotMenu.replaceChildren(...slots.map(f => el('div', { role: 'option', class: 'anyopt', text: LABEL[f], onpointerenter: () => showSlot(f), onclick: () => { slot.value = f; slotClose(); slot.onchange(); } })));
  slotMenu.onpointerleave = () => draw(at);
  slotBtn.onclick = () => { if (!slotMenu.hidden) return slotClose(); document.querySelectorAll('body > .anymenu').forEach(x => x.remove()); document.body.append(slotMenu); const r = slotBtn.getBoundingClientRect();
    const below = edge() - r.bottom - 12, above = r.top - 12, up = below < 200 && above > below;   /* opens upward when there is no room below the panel */
    Object.assign(slotMenu.style, up ? { left: r.left + 'px', width: Math.max(r.width, 180) + 'px', top: '', bottom: innerHeight - r.top + 2 + 'px', maxHeight: Math.min(420, above) + 'px' } : { left: r.left + 'px', width: Math.max(r.width, 180) + 'px', top: r.bottom + 2 + 'px', maxHeight: Math.min(420, below) + 'px', bottom: '' });
    slotMenu.hidden = false; slotBtn.setAttribute('aria-expanded', 'true'); si = slots.indexOf(slot.value); [...slotMenu.children].forEach((o, i) => { o.classList.toggle('on', i === si); o.setAttribute('aria-selected', String(i === si)); }); slotMenu.children[si]?.scrollIntoView({ block: 'nearest' }); document.addEventListener('pointerdown', slotAway, true); setTimeout(() => addEventListener('scroll', slotScroll, true), 0); };
  find_.onkeydown = ev => { if (ev.key === 'ArrowDown' && list.length) { ev.preventDefault(); item.focus(); item.onkeydown(ev); } };
  return [el('h3', { text: 'Any item' }), el('div', { class: 'row anyitem' }, pic, el('div', { class: 'anycol' }, el('div', { class: 'row' }, el('div', { class: 'anywrap' }, slotBtn), find_), el('div', { class: 'anywrap' }, item, menu)), edit)];
}
function assetCard(a) {
  const act = (label, fn, cls) => el('button', { class: 'mini ' + (cls || ''), text: label, onclick: e => { e.stopPropagation(); fn(); } });
  const worn = cur.skin[a.field] && cur.skin[a.field].startsWith('Custom_' + a.id);
  return el('div', { class: 'skin asset' + (worn ? ' on' : ''), tabIndex: 0, data: { rid: 'a' + a.id }, onclick: guard(() => openAsset(a)), onkeydown: e => { if (e.key === 'Enter' && e.target === e.currentTarget) e.currentTarget.click(); } },
    el('div', { class: 'pic' }, assetThumb(a)), el('b', { text: a.name }), el('small', { text: modReady(a) ? LABEL[a.field] : a.flag ? 'Site only' : 'Paid item: site only', title: a.flag ? FLAG_WHY(a.flag) : '' }),
    worn ? el('span', { class: 'worntick', text: '✓', 'aria-label': 'Worn' }) : null,
    cardMenu([act('Edit', guard(() => openAsset(a))), act('Copy', guard(() => copyAsset(a))), worn ? null : act('Wear', () => { const v = 'Custom_' + a.id + '.Mine'; if (cur.skin[a.field] !== v) setSkin({ ...cur.skin, [a.field]: v }); }),

      act('Delete', guard(async () => { pressing = false; await deleteAsset(a); }), 'danger')]));
}
addEventListener('keydown', e => { if (e.key !== 'Escape') return; const open_ = [...document.querySelectorAll('.cardacts')].filter(x => !x.hidden); if (!open_.length) return; open_.forEach(x => x.hidden = true); document.querySelectorAll('.cardmenu').forEach(x => x.setAttribute('aria-expanded', 'false')); e.stopPropagation(); });   // Escape closes an open card menu wherever focus is
function showKeys() {   // the shortcut list (?), as in other editors
  const groups = [['Paint', [['B', 'Paint'], ['E', 'Erase'], ['F', 'Fill'], ['P', 'Whole part'], ['I / hold Alt', 'Pick'], ['H', 'Replace'], ['L / U / Q', 'Line / Rectangle / Filled'], ['O / D / N', 'Lighten / Darken / Noise'], ['[ ]', 'Brush size'],
      ['M', 'Select'], ['Ctrl+A', 'Select all'], ['Ctrl+C / X / V', 'Copy / Cut / Paste'], ['Arrows, Shift+arrows', 'Move a paste'], ['Enter', 'Place a paste'], ['Delete', 'Clear selection']]],
    ['Shape', [['G / S / R', 'Move / Resize / Turn'], ['A', 'Add'], ['Ctrl+D', 'Duplicate'], ['Shift+M', 'Mirror'], ['Delete / X', 'Delete part'], ['F2', 'Rename part'], ['Arrows, Shift+arrows', 'Nudge']]],
    ['General', [['Ctrl+Z / Y', 'Undo / Redo'], ['Ctrl+S', 'Save now'], ['1 2 3 5 7', 'Views'], ['Ctrl+0', 'Fit texture'], ['Esc', 'Cancel'], ['?', 'Shortcuts']]]];
  const t = el('table', { class: 'keys' }, groups.flatMap(([g, rows]) => [el('tr', {}, el('th', { colSpan: 2, text: g })), ...rows.map(([k, v]) => el('tr', {}, el('td', {}, el('kbd', { text: k })), el('td', { text: v })))]));
  ask('Shortcuts', t, [{ label: 'Close', value: 'ok', primary: true }]).then(() => { try { document.activeElement?.blur?.(); } catch { /* fine */ } }); }
function cardMenu(acts) {   // a card's actions in a ⋯ menu, as in file browsers
  for (const a of acts) a?.setAttribute?.('role', 'menuitem');
  const m = el('div', { class: 'cardacts', role: 'menu', hidden: true, onkeydown: e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') { e.preventDefault(); e.stopPropagation(); const bs = [...m.querySelectorAll('button:not(:disabled)')], i = bs.indexOf(document.activeElement), n = bs.length; const j = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + n) % n; bs[j]?.focus(); return; }   /* arrows move through the menu */
    if (e.key === 'Escape') { e.stopPropagation(); m.hidden = true; b.setAttribute('aria-expanded', 'false'); b.focus(); } } }, acts);
  m.addEventListener('click', e => { if (e.target.closest('button')) { m.hidden = true; b.setAttribute('aria-expanded', 'false'); } }, true);   /* capture: actions stop their own clicks */   // picking an action closes the menu
  m.addEventListener('focusout', e => { if (!m.contains(e.relatedTarget) && e.relatedTarget !== b) { m.hidden = true; b.setAttribute('aria-expanded', 'false'); } });
  const b = el('button', { class: 'cardmenu', text: '⋯', 'aria-label': 'More', 'aria-haspopup': 'menu', 'aria-expanded': 'false', onclick: e => { e.stopPropagation(); const open_ = m.hidden; document.querySelectorAll('.cardacts').forEach(x => x.hidden = true); document.querySelectorAll('.cardmenu').forEach(x => x.setAttribute('aria-expanded', 'false')); m.hidden = !open_; b.setAttribute('aria-expanded', String(open_)); if (open_) { m.classList.remove('up'); const r = m.getBoundingClientRect(), box = m.closest('.pbody, .panel')?.getBoundingClientRect(); if (r.bottom > Math.min(innerHeight, box ? box.bottom : innerHeight) - 4) m.classList.add('up'); }   /* opens upward when it would go off the panel */ if (open_) m.querySelector('button')?.focus();
    if (open_) { const close = ev => { if (!m.contains(ev.target) && ev.target !== b) { m.hidden = true; removeEventListener('pointerdown', close, true); } }; addEventListener('pointerdown', close, true); } } });
  return [b, m]; }
async function deleteAsset(a) {   // skins wearing it go back to the game item it was copied from (or the slot's usual item)
  await closeAsset.last?.catch(() => {});   /* a close still saving would write the item back */
  if (!ASSETS.some(x => x.id === a.id)) return;   /* already gone (a double click) */
  const mine = v => typeof v === 'string' && v.startsWith('Custom_' + a.id), base = R.ITEMS[a.field]?.find(e => e.Id === a.baseId && !e.custom), back = base ? (a.tone ? base.Id + '.' + a.tone : R.partStr(base)) : null;   /* a copied body hands back its own tone */
  const swap = sk => (mine(sk[a.field]) ? { ...sk, [a.field]: back } : sk), worn = mine(cur.skin[a.field]);
  const full = (await assets.list()).find(x => x.id === a.id) || a, was = cur.skin, wasCur = cur, hit = [...WARD.custom, ...WARD.game].filter(r => r && mine(r.skin?.[a.field]));
  const put = (rec, sk) => (rec.kind === 'game' ? store.saveGame(rec.slot, rec.name, sk) : store.saveCustom(rec.name, sk, rec.id)).catch(e => console.warn(e));
  for (const rec of hit)   // saved skins too, so none is left missing a part
    await (rec.kind === 'game' ? store.saveGame(rec.slot, rec.name, swap(rec.skin)) : store.saveCustom(rec.name, swap(rec.skin), rec.id)).catch(e => console.warn(e));
  await assets.remove(a.id); ASSETS = await assets.list(); syncFolder(); registerAssets(); WARD = await store.list();
  if (worn) setSkin(R.fit(swap(cur.skin))); else cur.skin = R.fit(cur.skin); pics.clear(); rebuild(); render();
  const back1 = async () => { if ((await assets.list()).length >= assets.MAX) throw new Error(`My items is full (${assets.MAX})`); await assets.save(full); ASSETS = await assets.list(); registerAssets(); const now = await store.list(), live = id => [...now.game, ...now.custom].find(r => r && r.id === id);
    const fb = v => (v || null) === (back || null);   /* only a slot still on the fallback goes back; a later choice stays */
    for (const rec of hit) { const l = live(rec.id) || rec; if (fb(l.skin?.[a.field])) await put(l, { ...l.skin, [a.field]: rec.skin[a.field] }); }
    if (worn && (cur === wasCur || (cur.id && cur.id === wasCur.id)) && fb(cur.skin[a.field])) setSkin(R.fit({ ...cur.skin, [a.field]: was[a.field] })); },   /* only that slot goes back; later changes stay */   /* the item is known again before the outfit is put back */   /* the look on screen only changes back if it is still the same skin */
    prev = deleteAsset.undo && Date.now() - deleteAsset.at < 8000 ? deleteAsset.undo : null, all = async () => { await back1(); if (prev) await prev(); };
  deleteAsset.undo = all; deleteAsset.at = Date.now();
  deleteAsset.n = prev ? (deleteAsset.n || 1) + 1 : 1; sayUndo(prev ? `Deleted ${deleteAsset.n} items` : `Deleted "${a.name}"`, guard(async () => { deleteAsset.undo = null; await all(); ASSETS = await assets.list(); syncFolder(); registerAssets(); WARD = await store.list(); pics.clear(); rebuild(); render(); }));
}
// the drawn area over the flat texture: everything outside it is dimmed and each drawn face is outlined
function limits(c) {
  const z = ED.zoom, o = el('canvas', { className: 'limits', width: c.width * z, height: c.height * z }), x = o.getContext('2d');
  o.style.width = c.width * z + 'px';
  if (!ED.rects.length) return o;
  x.fillStyle = 'rgba(8, 14, 24, 0.72)'; x.fillRect(0, 0, o.width, o.height);
  for (const r of ED.rects) x.clearRect(r.x * z, r.y * z, r.w * z, r.h * z);
  x.strokeStyle = 'rgba(244, 196, 82, 0.9)'; x.lineWidth = 1;
  for (const r of ED.rects) x.strokeRect(r.x * z + 0.5, r.y * z + 0.5, r.w * z - 1, r.h * z - 1);
  const sel = ED.mode === 'shape' && curBox() ? curBox().node.name : null;   // Shape mode: the selected box's faces, lit blue
  if (sel) { x.fillStyle = 'rgba(127, 211, 255, 0.28)'; x.strokeStyle = '#7fd3ff'; x.lineWidth = 2;
    for (const r of ED.rects) if (r.node === sel) { x.fillRect(r.x * z, r.y * z, r.w * z, r.h * z); x.strokeRect(r.x * z + 1, r.y * z + 1, r.w * z - 2, r.h * z - 2); } x.lineWidth = 1; }
  if (z >= 4) { x.fillStyle = 'rgba(244, 196, 82, 0.95)'; x.font = '700 10px Lexend, sans-serif';
    const many = new Set(ED.rects.map(r => r.node)).size > 1;   // several parts: say which part as well as which side
    const spots = new Map(); for (const r of ED.rects) { const k = r.x + ',' + r.y; (spots.get(k) || spots.set(k, []).get(k)).push(r); }   // faces sharing one spot (left and right glasses painted alike) get one label
    for (const rs of spots.values()) { const r = rs[0]; if (!(r.w * z > 34 && r.h * z > 14)) continue; const uniq = a => [...new Set(a)];
      const parts = uniq(rs.map(q => partName(q.node))), faces = uniq(rs.map(q => q.face)).join('/');
      const opts = parts.length > 1 ? [parts.join(' + '), parts[0] + ' +' + (parts.length - 1)] : (ED.rects.filter(q => q.node === r.node).length === 1 ? [parts[0], faces] : [many ? parts[0] + ' · ' + faces : faces, faces]);   /* parts painted alike: name them once and say so, no repeated sides */
      const t = opts.find(v => x.measureText(v).width <= r.w * z - 6); if (t) { const fs = x.fillStyle, tw = x.measureText(t).width; x.fillStyle = 'rgba(8, 14, 24, 0.78)'; x.fillRect(r.x * z + 1, r.y * z + 1, tw + 4, 13); x.fillStyle = fs; x.fillText(t, r.x * z + 3, r.y * z + 11); }   /* a dark pill keeps labels readable on light paint */ } }
  return o;
}
// ---------------------------------------------------------------- shapes: an asset's own copy of its item's 3D model
fig.setShapeSource(async id => {
  if (ED && ED.asset.id === id && ED.model) return ED.model;
  const a = ASSETS.find(x => x.id === id); if (!a || !a.shape) throw new Error('that shape is gone'); return JSON.parse(a.shape);
});
const boxesOf = m => { const out = []; const walk = (n, parent) => { const s = n.shape || {}; if ((s.type === 'box' || s.type === 'quad') && s.visible !== false) out.push({ node: n, parent }); for (const c of n.children || []) walk(c, n); }; for (const n of m.nodes) walk(n, null); return out; };
function uniqNames(model) { const seen = new Set(); const walk = l => { for (const n of l || []) { if (seen.has(n.name)) { const b = String(n.name).slice(0, 56); let k = 2; while (seen.has(b + '~' + k)) k++; n.name = b + '~' + k; } seen.add(n.name); walk(n.children); } }; walk(model.nodes); return model; }   // game models repeat some part names; every part gets its own, so picking and dragging find the right one
async function editModel() { if (!ED.model) ED.model = uniqNames(ED.asset.shape ? JSON.parse(ED.asset.shape) : structuredClone(await game.json(game.common(ED.asset.model)))); return ED.model; }
function shapeChanged() {   // the preview, the drawn-area guide and the saved copy follow every edit
  ED.shapeN = (ED.shapeN || 0) + 1; ED.rects = fig.usedRects(ED.model); maskFromRects();
  if (ED.asset.labels) { const have = new Set(); const walk = l => { for (const n of l || []) { have.add(n.name); walk(n.children); } }; walk(ED.model.nodes);   /* names of parts that are gone are dropped */
    const kept = Object.fromEntries(Object.entries(ED.asset.labels).filter(([k]) => have.has(k))); if (Object.keys(kept).length !== Object.keys(ED.asset.labels).length) ED.asset = { ...ED.asset, labels: kept }; }
  registerAssets(); rebuild(); queueAssetSave(); render();
  clearTimeout(shapeChanged.t); shapeChanged.t = setTimeout(() => checkReplica(), 1200);
}
function maskFromRects() { const c = ED.canvas, m = new Uint8Array(c.width * c.height);
  for (const r of ED.rects) for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(c.height, Math.ceil(r.y + r.h)); y++) for (let x = Math.max(0, Math.floor(r.x)); x < Math.min(c.width, Math.ceil(r.x + r.w)); x++) m[y * c.width + x] = 1;
  ED.painter.mask = ED.rects.length ? m : null; }
function outlineBox() {   // the selected box, outlined on the model while the shape tools are open
  if (!st) return; if (ED) ED.partLit = null; if (!ED || !ED.shapeOpen || !ED.model) return st.highlight(null);
  const b = boxesOf(ED.model)[ED.box || 0], tw = ED.sym ? twinOf(b) : null; st.highlight(b ? o => o.material?.map?.image === ED.canvas && (o.userData.nodeName === b.node.name || !!tw && o.userData.nodeName === tw.name) : null); }
// turning a box: its node's orientation as X/Y/Z degrees (applied X, then Y, then Z, as the 3D view does)
const D2R = Math.PI / 180;
function toEuler(q) { const { x = 0, y = 0, z = 0, w = 1 } = q || {};
  const m11 = 1 - 2 * (y * y + z * z), m12 = 2 * (x * y - w * z), m13 = 2 * (x * z + w * y), m22 = 1 - 2 * (x * x + z * z), m23 = 2 * (y * z - w * x), m32 = 2 * (y * z + w * x), m33 = 1 - 2 * (x * x + y * y);
  const far = Math.abs(m13) > 0.999998, ey = Math.atan2(m13, Math.hypot(m11, m12));   /* Y from atan2 stays exact near ±90 (asin of a rounded value did not) */   /* stored turns are rounded to 1e-6: near Y = ±90 snap to exactly ±90 */
  const a = [far ? Math.atan2(m32, m22) : Math.atan2(-m23, m33), ey, far ? 0 : Math.atan2(-m12, m11)].map(r => r / D2R);
  const w_ = v => { const t = ((v + 180) % 360 + 360) % 360 - 180; return Math.abs(t + 180) < 1e-6 ? 180 : t; }, b = [w_(a[0] + 180), w_(180 - a[1]), w_(a[2] + 180)];   /* the same turn written the other way round */
  const cost = v => Math.abs(v[0]) + Math.abs(v[2]) + Math.abs(v[1]) * 0.5; return (cost(b) + 1e-6 < cost(a) ? b : a).map(r => Math.round(r * 10) / 10); }
function toQuat(dx, dy, dz) { const [c1, c2, c3] = [dx, dy, dz].map(d => Math.cos(d * D2R / 2)), [s1, s2, s3] = [dx, dy, dz].map(d => Math.sin(d * D2R / 2)), r = v => Math.round(v * 1e6) / 1e6;
  return { x: r(s1 * c2 * c3 + c1 * s2 * s3), y: r(c1 * s2 * c3 - s1 * c2 * s3), z: r(c1 * c2 * s3 + s1 * s2 * c3), w: r(c1 * c2 * c3 - s1 * s2 * s3) }; }
// ---------------------------------------------------------------- the creator workspace, laid out like Blockbench
// top: name, Paint/Shape tabs, undo, redo, Done. Left edge: tools with their shortcut keys. Left panel: the texture. Middle: the
// model with view buttons and, in Shape mode, a gizmo. Right: colours and brush (Paint), or the outliner and box fields (Shape).
const PAINT_TOOLS = [['select', 'Select area', 'M', '⬚'], ['brush', 'Brush', 'B', '✎'], ['erase', 'Eraser', 'E', '⌫'], ['part', 'Whole part', 'P', '◩'], ['fill', 'Fill', 'F', '◧'], ['pick', 'Pick colour', 'I', '◉'], ['replace', 'Replace colour', 'H', '⇄'],
  ['line', 'Line', 'L', '╱'], ['box', 'Rectangle', 'U', '▢'], ['boxfill', 'Filled rectangle', 'Q', '■'], ['light', 'Lighten', 'O', '☀'], ['dark', 'Darken', 'D', '☾'], ['noise', 'Noise', 'N', '░']];
const SHORT = { part: 'Whole part', more: 'More', select: 'Select', pick: 'Pick', replace: 'Replace', boxfill: 'Filled', light: 'Lighten', dark: 'Darken', dup: 'Copy', del: 'Delete' };   // names under the tool icons
const SHAPE_TOOLS = [['move', 'Move', 'G', '✥'], ['resize', 'Resize', 'S', '⤢'], ['rotate', 'Turn', 'R', '⟳']];   // click a part to pick it; these set what its handles do
const paintsIn = e => e.k === 'p' ? 1 : e.k === 'g' ? e.parts.reduce((n, x) => n + paintsIn(x), 0) : 0;
const capHist = () => { if (ED.noCap) return; let n = ED.hist.reduce((a, x) => a + paintsIn(x), 0); while (ED.hist.length && (ED.hist.length > 90 || n > 110)) n -= paintsIn(ED.hist.shift()); };   /* counts the paint steps inside groups too */   /* below the painter's own step limit, so every undo still has its paint */
const recordPaint = () => { if (ED && !ED.replaying) { ED.hist.push({ k: 'p' }); ED.fut = []; capHist(); } };
function recordShape(before, sel) { ED.hist.push({ k: 's', other: before, lab: JSON.stringify(ED.asset.labels || null), sel }); ED.fut = []; capHist(); }   // sel: the part selected before the change, picked again on undo   // part names go back with the shape
function sizeTo([w, h]) { const c = ED.canvas; if (c.width === w && c.height === h) return; ED.painter.grow(h, w); ED.asset = { ...ED.asset, w, h }; ED.n = ++edN; requestAnimationFrame(() => { if (ED) { if (!ED.userZoom) fitTexture(); render(); } }); }
function undoEntry(e, redo) {
  if (e.k === 'l') { const now = JSON.stringify(ED.asset.labels || null); ED.asset = { ...ED.asset, labels: JSON.parse(e.other) || undefined }; queueAssetSave(); return { k: 'l', other: now }; }
  if (e.k === 'p') { ED.replaying = true; redo ? ED.painter.redo() : ED.painter.undo(); ED.replaying = false; return e; }
  if (e.k === 'g') { if (e.splitWas !== undefined) { const v = redo ? !!e.splitNow : e.splitWas; ED.splitDone = v; ED.asset = { ...ED.asset, split: v }; if (e.sz && redo) sizeTo(e.sz[1]); const parts = e.parts.slice().reverse().map(x => undoEntry(x, redo)); if (e.sz && !redo) sizeTo(e.sz[0]); return { k: 'g', splitWas: e.splitWas, splitNow: e.splitNow, sz: e.sz, parts }; }   /* the texture shrinks back to its size before the step (and grows again on redo) */
    if (e.setup) { ED.splitDone = !!redo; ED.asset = { ...ED.asset, split: !!redo }; } return { k: 'g', setup: e.setup, parts: e.parts.slice().reverse().map(x => undoEntry(x, redo)) }; }   /* undoing the split makes the next Shape visit split again */
  const now = JSON.stringify(ED.model), keep = (!redo && e.sel) || boxesOf(ED.model)[ED.box || 0]?.node.name, selNow = boxesOf(ED.model)[ED.box || 0]?.node.name; { if (e.lab !== undefined) { const nowLab = JSON.stringify(ED.asset.labels || null); ED.asset = { ...ED.asset, labels: JSON.parse(e.lab) || undefined }; e = { ...e, labNow: nowLab }; } } const namesNow = new Set(boxesOf(ED.model).map(x => x.node.name)); ED.model = JSON.parse(e.other); { const back = boxesOf(ED.model).findIndex(x => !namesNow.has(x.node.name)); if (back >= 0) { ED.box = back; ED.reshaped = true; return { k: 's', other: now, lab: e.labNow }; } }   /* a part that comes back is picked */
  { const bs = boxesOf(ED.model), i = bs.findIndex(x => x.node.name === keep); ED.box = i >= 0 ? i : Math.min(ED.box || 0, bs.length - 1); } ED.reshaped = true; return { k: 's', other: now, lab: e.labNow, sel: selNow };
}
function wsUndo(redo) {
  if (!ED) return; if (ED.adjOpen) { if (!redo && ED.adjCancel) ED.adjCancel(); return; } say('');   /* inside Adjust colours, undo cancels the adjustment */
  if (ED.float && !redo) { ED.float = null; render(); return; }   /* the first undo only drops a paste that isn't placed yet */
  if (ED.float && redo) placeFloat(); ED.float = null; const from = redo ? ED.fut : ED.hist, to = redo ? ED.hist : ED.fut, e = from.pop(); if (!e) return;
  ED.reshaped = false; to.push(undoEntry(e, redo)); if (ED.reshaped) shapeChanged();
  ED.palette = ED.painter.palette(); render();
}
function shapeEdit(fn) {   // with Symmetry on, the box's twin on the other side follows the change
  const before = JSON.stringify(ED.model), b0 = curBox(), tw = symTwin(); shapeEdit.sel = b0?.node.name; fn();
  if (tw && b0 && b0.node !== tw && boxesOf(ED.model).some(x => x.node === b0.node) && boxesOf(ED.model).some(x => x.node === tw)) mirrorNode(b0.node, tw);
  finishShape(before); }
async function setMode(m) { if (ED.adjOpen && ED.adjCancel) ED.adjCancel(); if (ED.placing) { ED.placing = false; say(''); }   /* leaving Paint drops an unapplied colour adjustment */
  if (ED.float) placeFloat(); if (m === 'shape') ED.sel = null; say(''); if (m === 'shape') { await editModel(); ED.noCap = true; const h0 = ED.hist.length; if (boxesOf(ED.model).filter(b => /^Box_/.test(b.node.name) && bakeOffset(b.node)).length) shapeChanged(); splitShared(); if (ED.hist.length > h0) ED.hist.push({ k: 'g', setup: true, parts: ED.hist.splice(h0) }); ED.noCap = false; capHist();   /* setup on entering Shape is one undo step */
    ED.box ||= 0; if (!ED.stool || ED.stool === 'select') ED.stool = 'move'; st.cursor(null); ED.hover = ED.hoverM = null; } ED.mode = m; ED.shapeOpen = m === 'shape'; render(); placeGizmo(); }
function pickTool(id) { if (ED.placing) { ED.placing = false; say(''); }   /* changing tool cancels Add part */ if (ED.mode === 'shape') { if (ED.stool !== id) say(''); ED.stool = id; ED.moreTools = false; } else { if (id !== 'select' && ED.float) placeFloat(); ED.painter.tool = id; } render(); placeGizmo(); }
function curBox() { return ED.model ? boxesOf(ED.model)[ED.box || 0] : null; }
function placeGizmo() {
  if (!st) return; wsAnim(); const b = ED && ED.mode === 'shape' && ['move', 'resize', 'rotate'].includes(ED.stool) ? curBox() : null;
  const mesh = b && st.findMesh(o => o.material?.map?.image === ED.canvas && o.userData.nodeName === b.node.name);
  if (!mesh) return st.gizmo(null);
  st.gizmo({ mesh, mode: ED.stool, onEnd: ({ move, scale, turn }) => shapeEdit(() => { const sh = b.node.shape, r = (v, q) => Math.round(v / q) * q;
    if (ED.stool === 'move') { const o = sh.offset || {}, m1 = (a) => Math.abs(move[a]) < 1e-4 ? (o[a] ?? 0) : r((o[a] ?? 0) + move[a], 0.5); sh.offset = { x: m1('x'), y: m1('y'), z: m1('z') }; }   /* only the dragged axis snaps */
    else if (ED.stool === 'resize') { const z = sh.settings.size, f = v => Math.max(0.25, Math.min(4, v)), c = v => Math.max(1, Math.min(64, v));
      sh.settings.size = { x: z.x ? c(r(z.x * f(scale.x), 1)) : 0, y: z.y ? c(r(z.y * f(scale.y), 1)) : 0, z: z.z ? c(r(z.z * f(scale.z), 1)) : 0 }   /* flat parts keep no depth */; }
    else { const k = v => Math.round(v * 1e6) / 1e6; b.node.orientation = { x: k(turn.x), y: k(turn.y), z: k(turn.z), w: k(turn.w) }; } }) });
}
// a number you can type, or drag left and right on its letter, like Blender and Blockbench
function scrub(label, get, set, step = 1, min = -64, max = 64, prec = step) {   // prec: how finely a typed value is kept (turns keep 0.01)
  const clamp = v => Math.max(min, Math.min(max, Math.round(v / prec) * prec));
  const shown = () => Math.round(get() * 100) / 100;
  const inp = el('input', { type: 'number', class: 'scrubin', step, min, max, value: shown(), onchange: e => { const t = e.target.value.trim(); if (t === '' || !Number.isFinite(Number(t))) { e.target.value = shown(); return; } const v = clamp(Number(t)); if (Math.abs(v - get()) < 1e-9) { e.target.value = shown(); return; } shapeEdit(() => set(v)); } });   /* no change, no step */   /* an emptied field goes back to its value */
  inp.onkeydown = e => { if (e.key !== 'Tab' && e.key !== 'Enter') return; const all = [...document.querySelectorAll('input.scrubin')], to = all.indexOf(inp) + (e.key === 'Tab' ? (e.shiftKey ? -1 : 1) : 0); if (e.key === 'Tab' && (to < 0 || to >= all.length)) return;
    e.preventDefault(); if (String(shown()) !== inp.value.trim()) inp.dispatchEvent(new Event('change')); const n = [...document.querySelectorAll('input.scrubin')][to]; if (n) { n.focus(); n.select(); } };   /* the panel redraws on commit: keep the caret in the fields */
  const lab = el('span', { class: 'scrub', text: label });
  lab.onpointerdown = e => { e.preventDefault(); const x0 = e.clientX, v0 = get(), before = JSON.stringify(ED.model), tw = symTwin(), me = curBox(); let moved = false, t = 0; lab.setPointerCapture(e.pointerId);
    lab.onpointermove = ev => { const v = clamp(v0 + Math.round((ev.clientX - x0) / 6) * step); if (v === get()) return; set(v); if (tw && me) mirrorNode(me.node, tw); inp.value = v; moved = true;
      clearTimeout(t); t = setTimeout(() => { registerAssets(); rebuild(); }, 60); };
    lab.onpointerup = () => { lab.onpointermove = lab.onpointerup = null; if (moved) finishShape(before); }; };
  return el('label', { class: 'numfield' }, lab, inp);
}
// the whole drawn area in one colour: each pixel keeps how light or dark it was compared with the item's average
function tintAll(hex, node) {   // node: only that box's texture area (or several boxes, tinted together from one shared average so they match exactly)
  const nodes = node ? [].concat(node) : null; node = nodes ? nodes.join('|') : null; const lt = ED.lastTint; if (lt && lt.hex === hex && lt.node === (node || null) && lt.top === ED.hist[ED.hist.length - 1]) return;   /* the same tint again changes nothing (it used to drift lighter) */
  const P = ED.painter, c = ED.canvas, [r0, g0, b0] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)), lum = (d, i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  let m = P.mask; if (node) { m = new Uint8Array(c.width * c.height); let any = false; for (const r of ED.rects) if (nodes.includes(r.node)) { any = true; for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(c.height, Math.ceil(r.y + r.h)); y++) for (let x = Math.max(0, Math.floor(r.x)); x < Math.min(c.width, Math.ceil(r.x + r.w)); x++) m[y * c.width + x] = 1; } if (!any) return; }
  P.write((d, W, H) => { let sum = 0, n = 0; for (let p = 0; p < W * H; p++) if (d[p * 4 + 3] && (!m || m[p])) { sum += lum(d, p * 4); n++; } if (!n) return;
    const avg = Math.max(1, sum / n);
    for (let p = 0; p < W * H; p++) { const i = p * 4; if (!d[i + 3] || (m && !m[p])) continue; const k = Math.min(1.8, Math.max(0.35, lum(d, i) / avg)); d[i] = Math.min(255, r0 * k); d[i + 1] = Math.min(255, g0 * k); d[i + 2] = Math.min(255, b0 * k); } });
  ED.lastTint = { hex, node: node || null, top: ED.hist[ED.hist.length - 1] };
  ED.palette = P.palette(); render(); checkReplica(); say('');
}
function paintSide() {
  const P = ED.painter, adj = (ED.adjVals ||= { h: 0, s: 0, l: 0 });   // kept on the editor: the panel redraws (switching Paint/Shape) must not zero what you set
  const slider = (label, min, max, step, get, set, fmt) => { const lab = el('span', { text: `${label} ${fmt(get())}` });
    return el('label', { class: 'wsslider' }, lab, el('input', { type: 'range', min, max, step, value: get(), oninput: e => { set(+e.target.value); lab.textContent = `${label} ${fmt(get())}`; } })); };
  const adjRow = (key, label, min, max) => { const set = v => { adj[key] = Math.max(min, Math.min(max, Math.round(v) || 0)); P.adjust(adj.h, adj.s / 100, adj.l / 100, false); };
    const num = el('input', { type: 'number', min, max, step: 1, value: adj[key], class: 'adjnum', oninput: e => { if (e.target.value === '' || e.target.value === '-') return; set(+e.target.value); rng.value = adj[key]; }, onchange: e => { set(+e.target.value); rng.value = e.target.value = adj[key]; } }),
      rng = el('input', { type: 'range', min, max, step: 1, value: adj[key], oninput: e => { set(+e.target.value); num.value = adj[key]; } });
    return el('label', { class: 'wsslider adj' }, el('span', { text: label }), rng, num); };
  const endAdjust = keep => { if (!keep) adj.h = adj.s = adj.l = 0; P.adjust(adj.h, adj.s / 100, adj.l / 100, true); ED.adjVals = null; ED.palette = P.palette(); render(); if (keep) checkReplica(); if (ED.saveDeferred) { ED.saveDeferred = false; queueAssetSave(); } }; ED.adjCancel = () => { ED.adjOpen = false; endAdjust(false); };
  const toggle = (text, on, fn) => el('button', { class: 'chip' + (on ? ' on' : ''), text, 'aria-pressed': String(!!on), onclick: fn });
  const chip = (text, fn, key, off) => el('button', { class: 'chip', text, title: key || '', disabled: !!off, onclick: () => { fn(); render(); } });
  if (ED.adjOpen) return [el('div', { class: 'wshead', text: 'Adjust colours' }),
    adjRow('h', 'Hue', -180, 180), adjRow('s', 'Saturation', -100, 100), adjRow('l', 'Brightness', -100, 100),
    el('div', { class: 'row' }, el('button', { class: 'btn primary', text: 'Apply', onclick: () => { ED.adjOpen = false; endAdjust(true); } }), el('button', { class: 'btn ghost', text: 'Cancel', onclick: () => { ED.adjOpen = false; endAdjust(false); } }))];
  return [el('div', { class: 'wshead', text: 'Colour' }),
    el('div', { class: 'row' }, el('input', { type: 'color', value: P.color, oninput: e => { P.color = e.target.value; }, onchange: e => useColour(e.target.value) }), el('input', { type: 'text', class: 'hex', value: P.color, maxLength: 7, spellcheck: false, onchange: e => { let v = e.target.value.trim().replace(/^#?/, '#'); if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + [...v.slice(1)].map(c => c + c).join(''); if (/^#[0-9a-f]{6}$/i.test(v)) useColour(v.toLowerCase()); else e.target.value = P.color; }, onkeydown: e => { if (e.key === 'Enter') e.target.blur(); } })),
    el('div', { class: 'swlabel', text: 'Basic' }), swatchRow(BASIC), el('div', { class: 'swlabel', text: 'In this item' }), swatchRow(ED.palette),
    (() => { const r = [el('div', { class: 'swlabel', text: 'Recent' }), swatchRow(RECENT.length ? RECENT : ['#000000'])]; if (!RECENT.length) r.forEach(x => { x.style.visibility = 'hidden'; x.setAttribute('aria-hidden', 'true'); }); return r; })(),   /* the row keeps its place, so buttons below don't jump */
    el('button', { class: 'btn ghost wide', text: 'Tint item', onclick: () => tintAll(P.color) }),
    el('div', { class: 'options' }, (() => { const t = toggle('Symmetry', ED.mirror, () => { ED.mirror = !ED.mirror; render(); }); t.disabled = ['select', 'pick', 'replace'].includes(P.tool); return t; })())   /* greyed for tools it does not mirror */,
    ED.adjOpen ? [el('div', { class: 'wshead', text: 'Adjust colours' }), adjRow('h', 'Hue', -180, 180), adjRow('s', 'Saturation', -100, 100), adjRow('l', 'Brightness', -100, 100),
      el('div', { class: 'row' }, el('button', { class: 'btn primary', text: 'Apply', onclick: () => { ED.adjOpen = false; endAdjust(true); } }), el('button', { class: 'btn ghost', text: 'Cancel', onclick: () => { ED.adjOpen = false; endAdjust(false); } }))]
      : el('button', { class: 'btn ghost wide', text: 'Adjust colours…', onclick: () => { ED.adjOpen = true; ED.sel = null; render(); } }),   /* tool options come after the fixed buttons, so Symmetry and Adjust colours stay put */
    P.tool === 'fill' ? [el('div', { class: 'swlabel', text: 'Fill' }), el('div', { class: 'seg', role: 'radiogroup' }, ...[['area', 'Area', ''], ['side', 'Face', ''], ['every', 'Colour', '']]
      .map(([m, t, why]) => el('button', { class: (P.fillMode || 'area') === m ? 'on' : '', role: 'radio', 'aria-checked': String((P.fillMode || 'area') === m), text: t, onclick: () => { P.fillMode = m; render(); viewHint(); } }))),
      P.fillMode !== 'side' ? slider('Tolerance', 0, 100, 4, () => P.tolerance, v => { P.tolerance = v; }, v => v + '%') : null] : null,
    P.tool === 'select' || ED.sel || ED.float || CLIP ? [el('div', { class: 'wshead', text: 'Selection' }), el('div', { class: 'options' },
      ...(ED.float ? [chip('Place', placeFloat, 'Enter'), chip('Flip ↔', () => flipFloat(true)), chip('Flip ↕', () => flipFloat(false)), chip('Cancel', () => { ED.float = null; render(); }, 'Esc')]
        : [chip('Copy', () => copySel(false), 'Ctrl+C', !ED.sel), chip('Cut', () => copySel(true), 'Ctrl+X', !ED.sel), chip('Paste', pasteClip, 'Ctrl+V', !CLIP), chip('Clear', clearSel, 'Del', !ED.sel)]))] : null,
    ['brush', 'erase', 'light', 'dark', 'noise', 'line', 'box'].includes(P.tool) ? [el('div', { class: 'wshead', text: 'Brush' }), slider('Size', 1, 8, 1, () => P.size, v => { P.size = v; }, v => v),
      ['brush', 'line', 'box'].includes(P.tool) ? slider('Strength', 10, 100, 10, () => Math.round(P.opacity * 100), v => { P.opacity = v / 100; }, v => v + '%') : null] : null];   /* tool options all sit below the fixed buttons: only the tool's own show */
}
// boxes get readable names: the player's own, else one made from the game's node name ("L-ArmCostume" -> "Left arm", new boxes -> "Box 2")
function boxLabel(node) {   // names come from one pass per model change (it was a name lookup per part per part: slow at 64 parts)
  const key = ED.model, lk = JSON.stringify(ED.asset.labels || null), memo = boxLabel.memo;
  if (memo && memo.model === key && memo.lk === lk && memo.n === ED.shapeN && memo.map.has(node)) return memo.map.get(node);
  if (ED.model && !(memo && memo.model === key && memo.lk === lk && memo.n === ED.shapeN)) { boxLabel.memo = { model: key, lk, n: ED.shapeN, map: new Map() }; const map = boxLabel.memo.map; for (const b of boxesOf(ED.model)) map.set(b.node, boxLabel1(b.node)); if (map.has(node)) return map.get(node); }
  return boxLabel1(node); }
function boxLabel1(node) {
  const own = ED.asset.labels && ED.asset.labels[node.name]; if (own) return own;
  if (/^Box_/.test(node.name)) { const all = boxesOf(ED.model).filter(b => /^Box_/.test(b.node.name)); return 'Box ' + (all.findIndex(b => b.node === node) + 1); }
  const raw = n => { n = String(n).replace(/(~|_)\d+$/, '');   /* merge suffixes (~2, _2) are not part of the name */ const m = /^(.*?)-+C(\d+)$/i.exec(n), base = (m ? m[1] : n).replace(/Costume$/, '').replace(/([A-Za-z])(\d+)$/, '$1 $2').replace(/^L-/, 'Left ').replace(/^R-/, 'Right ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]+/g, ' ').replace(/\s+([lr])$/i, (x, c) => c.toLowerCase() === 'l' ? ' left' : ' right').replace(/^\s*([lr])\s+/i, (x, c) => c.toLowerCase() === 'l' ? 'Left ' : 'Right ')
      .replace(/\bbot\b/ig, 'bottom').replace(/\bacc\b/ig, 'accessory').replace(/\bc (\d+)\b/ig, 'part $1').replace(/\s+/g, ' ').trim().toLowerCase();
    const t = base ? base[0].toUpperCase() + base.slice(1) : n; return m ? `${t}, piece ${+m[2] + 1}` : t; };   // "ChestPart--C1" -> "Chest part, piece 2"
  const s = raw(node.name), bs = ED.model ? (boxLabel.bs && boxLabel.bs.model === ED.model && boxLabel.bs.n === ED.shapeN ? boxLabel.bs.list : (boxLabel.bs = { model: ED.model, n: ED.shapeN, list: boxesOf(ED.model) }).list) : [], same = bs.filter(b => !/^Box_/.test(b.node.name) && !(ED.asset.labels || {})[b.node.name] && raw(b.node.name) === s);
  return same.length > 1 ? `${s} (${same.findIndex(b => b.node === node) + 1})` : s;   // two parts with one name get numbers
}
function renameBox(btn, node) {
  const inp = el('input', { type: 'text', value: boxLabel(node), maxLength: 80, class: 'rename' });
  let ended = false; const done = keep => { if (ended) return; ended = true; inp.dataset.done = '1'; if (keep && clip(cleanName(inp.value), 30).trim() === boxLabel(node)) keep = false;
    if (keep) { const want = clip(cleanName(inp.value), 30).trim(), taken = new Set(boxesOf(ED.model).filter(b => b.node !== node).map(b => boxLabel(b.node))); if (want && taken.has(want)) { const cut = k => clip(want, 30 - String(k).length - 1).trimEnd() + ' ' + k; let k = 2; while (taken.has(cut(k))) k++; inp.value = cut(k); } }   /* a name another part has gets a number; the other part keeps its name */   /* unchanged: no step */
    if (keep) { const v = clip(cleanName(inp.value), 30).trim(), was = JSON.stringify(ED.asset.labels || null); ED.asset = { ...ED.asset, labels: { ...(ED.asset.labels || {}), [node.name]: v || undefined } }; if (!v) delete ED.asset.labels[node.name]; if (JSON.stringify(ED.asset.labels || null) !== was) { ED.hist.push({ k: 'l', other: was }); ED.fut = []; capHist(); } queueAssetSave(); } render(); document.querySelector('.partrow.on > button')?.focus(); };   /* focus goes back to the part */   /* a rename is an undo step */
  inp.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') done(true); else if (e.key === 'Escape') done(false); }; inp.onblur = () => done(true);
  btn.replaceWith(inp); inp.focus(); inp.select();
}
// the texture view: the wheel zooms, right- or middle-drag pans; in Shape mode a click picks the box that owns that area
function fitTexture() { if (!ED) return; if (!fitTexture.ro && window.ResizeObserver) { fitTexture.ro = new ResizeObserver(() => { if (ED && !ED.userZoom) { const z = ED.zoom; fitTexture(); if (ED.zoom !== z) render(); } }); fitTexture.ro.observe($('wsleft')); }   /* refits when the panel changes size, unless zoomed by hand */
  const pb = ED.box_, w = pb && pb.clientWidth > 60 ? pb.clientWidth - 8 : $('wsleft').clientWidth - 26, h = pb && pb.clientHeight > 60 ? pb.clientHeight - 8 : Infinity; ED.zoom = Math.max(ZOOMS[0], Math.min(24, Math.floor(Math.min(w / ED.canvas.width, h / ED.canvas.height) * 100) / 100)); }   /* fits width and height exactly (any zoom, not only whole steps) */
function zoomCentre(z) {   // the − / + buttons zoom around the middle of the view, as the wheel does around the pointer
  const pb = ED.box_, cv = () => pb?.querySelector('canvas.paint'), r0 = cv()?.getBoundingClientRect(), br = pb?.getBoundingClientRect(); ED.userZoom = true; ED.zoom = z; render();
  if (!pb || !r0 || !br) return; const cx = br.left + br.width / 2, cy = br.top + br.height / 2, tx = (cx - r0.left) / r0.width, ty = (cy - r0.top) / r0.height, r1 = cv().getBoundingClientRect(); pb.scrollLeft += r1.left + tx * r1.width - cx; pb.scrollTop += r1.top + ty * r1.height - cy; }
const ZOOMS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24];   // zoom steps, as in image editors
const zoomStep = (z, d) => d > 0 ? (ZOOMS.find(v => v > z + 1e-6) ?? 24) : ([...ZOOMS].reverse().find(v => v < z - 1e-6) ?? ZOOMS[0]);
function bindTexView(box) {
  box.addEventListener('wheel', e => { if (!ED) return; e.preventDefault(); const z = zoomStep(ED.zoom, e.deltaY < 0 ? 1 : -1); if (z === ED.zoom) return; ED.userZoom = true;
    const cv = () => box.querySelector('canvas'), r0 = cv()?.getBoundingClientRect(), tx = r0 ? (e.clientX - r0.left) / r0.width : 0, ty = r0 ? (e.clientY - r0.top) / r0.height : 0;
    ED.zoom = z; render(); const r1 = cv()?.getBoundingClientRect(); if (r0 && r1) { box.scrollLeft += r1.left + tx * r1.width - e.clientX; box.scrollTop += r1.top + ty * r1.height - e.clientY; } }, { passive: false });   /* the texel under the cursor stays under it */
  box.addEventListener('contextmenu', e => e.preventDefault());
  box.addEventListener('pointerdown', e => {
    if (!ED) return;
    if (e.button === 1 || e.button === 2) { e.preventDefault(); const x0 = e.clientX, y0 = e.clientY, sx = box.scrollLeft, sy = box.scrollTop; box.setPointerCapture(e.pointerId);
      box.onpointermove = ev => { box.scrollLeft = sx - (ev.clientX - x0); box.scrollTop = sy - (ev.clientY - y0); }; box.onpointerup = () => { box.onpointermove = box.onpointerup = null; }; return; }
    if (e.button !== 0 || ED.mode !== 'shape') return;
    const c = ED.canvas, r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * c.width, y = (e.clientY - r.top) / r.height * c.height;
    const hit = ED.rects.filter(q => x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h).sort((a, b) => a.w * a.h - b.w * b.h)[0]; if (!hit) return;
    const k = boxesOf(ED.model).findIndex(b => b.node.name === hit.node); if (k < 0) return; ED.box = k;
    if (ED.stool !== 'resize') { render(); placeGizmo(); return; }
    // Resize on the texture: drag across a part's area to make that side wider or narrower, up and down to make it taller or shorter
    const b = boxesOf(ED.model)[k], sh = b.node.shape, lay = sh.textureLayout || {}, px = r.width / c.width;
    const key = Object.keys(lay).filter(f => FACE_UV[f]).find(f => { const o = lay[f].offset || {}; return Math.abs((o.x ?? 0) - hit.x) <= hit.w && Math.abs((o.y ?? 0) - hit.y) <= hit.h; }) || (sh.type === 'quad' ? 'front' : null);
    if (!key) { render(); placeGizmo(); return; } const [ua, va] = FACE_UV[sh.type === 'quad' ? 'front' : key].map(i => ['x', 'y', 'z'][i]);
    const s0 = { ...sh.settings.size }, before = JSON.stringify(ED.model), x0 = e.clientX, y0 = e.clientY; let changed = false; e.preventDefault(); box.setPointerCapture(e.pointerId);
    box.onpointermove = ev => { const du = Math.round((ev.clientX - x0) / px), dv = Math.round((ev.clientY - y0) / px), nu = Math.max(1, Math.min(64, (s0[ua] ?? 0) + du)), nv = Math.max(1, Math.min(64, (s0[va] ?? 0) + dv));
      if (nu === sh.settings.size[ua] && nv === sh.settings.size[va]) return; sh.settings = { ...sh.settings, size: { ...sh.settings.size, [ua]: nu, [va]: nv } }; changed = true; shapeChanged(); };
    box.onpointerup = () => { box.onpointermove = box.onpointerup = null; if (changed) finishShape(before); else { render(); placeGizmo(); } };
  });
}

function tour() { document.querySelector('.tour')?.remove(); }   // the old first-time tour is gone; this only clears a leftover
function viewHint() { const h = $('viewhint'); if (h) { h.hidden = true; h.textContent = ''; } }   // no tool sentences on the view
// ---- colours: a fixed set of basics, the item's own colours and the ones used lately
const BASIC = ['#ffffff', '#c9c9c9', '#808080', '#3d3d3d', '#000000', '#e23b3b', '#ef8a35', '#f4d24a', '#7cc444', '#2e9a58', '#3db7c9', '#3b6fe0', '#7a4fd6', '#d65ab4', '#8a5a32', '#f2c9a1'];
let RECENT = (() => { try { const r = JSON.parse(store_.get('se_recent') || '[]'); return Array.isArray(r) ? r.filter(h => /^#[0-9a-f]{6}$/i.test(h)).slice(0, 8) : []; } catch { return []; } })();
function useColour(h) { if (!ED) return; const P = ED.painter; P.color = h; if (ED.float) placeFloat();   /* a floating paste is placed before the tool changes, never dropped */ if (!ED.altFrom && P.tool === 'pick' || P.tool === 'erase' || P.tool === 'select') P.tool = 'brush';
  RECENT = [h, ...RECENT.filter(x => x !== h)].slice(0, 8); store_.set('se_recent', JSON.stringify(RECENT)); render(); }
const swatchRow = list => el('div', { class: 'swatches' }, list.map(h => { const b = el('button', { title: h, class: h === ED.painter.color ? 'on' : '', onclick: () => useColour(h) }); b.style.background = h; return b; }));
// ---- the finish: after Done, say what happens next
async function finishAsset(equip = false) { if (finishAsset.busy) return; finishAsset.busy = true; try { return await finishAsset0(equip); } finally { finishAsset.busy = false; } }   // a second Done/Wear while one is saving is ignored
async function finishAsset0(equip = false) { if (ED && equip) ED.keeping = true; document.body.classList.add('busy'); try { return await finishAsset1(equip); } finally { document.body.classList.remove('busy'); if (ED) ED.keeping = false; } }   // busy cursor while it saves
async function finishAsset1(equip = false) {
  const a = ED.asset; await closeAsset(false, equip); if (ED || !equip) return;   /* still open: the save failed */   /* the editor closing is the result; no message */ const linked = FOLDER.state === 'on';
  const text = linked ? (SHOWGAME ? 'It is on your character in your own worlds too, through the Skin Editor Sync mod.' : 'Turn on In game to wear it in your own Hytale worlds (needs the Skin Editor Sync mod).')
    : 'To wear it in Hytale, install the Skin Editor Sync mod and pick a skins folder in the Locker.';
  const upd = cur.id && cur.name ? ` "${cur.name}" now wears it too.` : '';
  if (true) return say(`Wearing ${a.name}`); void upd;   /* no once-only explainer dialog */
  store_.set('se_finished', '1');
  const btns = [{ label: 'Back to my items', value: 'back', primary: true }, { label: 'Keep editing', value: 'edit' },
    ...(linked && !SHOWGAME ? [{ label: 'Show in game', value: 'game' }] : [])];
  await flush(); const unsaved = !cur.id || dirty;
  const big = el('img', { alt: '', draggable: false }); fig.build(R.fit(cur.skin), R).then(root => { big.src = fig.snapshot(root, 'full', false, 256); }).catch(() => {});   // drawn now, not behind the thumbnail queue
  const v = await ask('You are wearing it', [el('div', { class: 'finishpic' }, big), el('p', { text }),
    unsaved ? el('p', { class: 'dim', text: 'Your item is saved. The outfit you are wearing is not saved yet: press Save under the preview to keep it in My skins.' }) : null].filter(Boolean), btns);
  if (v === 'game') $('ingame').onclick(); else if (v === 'setup') setTab('wardrobe');
  else if (v === 'edit') { const x = ASSETS.find(y => y.id === a.id); if (x) openAsset(x); }
  else if (v === 'copy') newAsset(a.field);
}
// ---- resizing keeps the paint tidy: a box that grows gets fresh room on the texture, its old paint stretched to fit
const sizeOf = sh => ['x', 'y', 'z'].map(k => Math.ceil(Math.abs(sh.settings?.size?.[k] ?? 0)));
function tidyResized(beforeJson) { if (ED.noTidy) return [];   /* Reset puts the game's own layout back as it is */
  let before; try { before = JSON.parse(beforeJson); } catch { return []; }
  const old = new Map(), oldList = boxesOf(before), nowList = boxesOf(ED.model); for (const b of oldList) old.set(b.node.name, b.node.shape);
  const paints = [];
  for (const [k, b] of nowList.entries()) {   /* parts are matched by their place in the list (game models reuse names), by name only when parts were added or removed */
    const sh = b.node.shape, o = oldList.length === nowList.length ? oldList[k].node.shape : old.get(b.node.name); if (!o || !sh.textureLayout || !o.textureLayout) continue;
    const ns = sizeOf(sh), os = sizeOf(o); if (!ns.some((v, k) => v > os[k])) continue;   // only a box that grows can spill over other paint
    if (JSON.stringify(sh.textureLayout) !== JSON.stringify(o.textureLayout)) continue;
    let lay = allocLayout(sh); while (!lay && (ED.canvas.width < ED.canvas.height ? growWider() || growTexture() : growTexture() || growWider())) lay = allocLayout(sh);
    if (!lay) { sh.settings = { ...sh.settings, size: { ...o.settings.size } }; say('Too big for the texture', true); continue; }   /* no room even at the largest texture: the part keeps its old size, never paint off the texture */
    const src = o.textureLayout; sh.textureLayout = lay;
    paints.push((d, W, H) => { for (const [f, fu, fv] of faceDims(sh)) { const to = lay[f], from = src[f]; if (!to || !from) continue;
      const [ua, va] = FACE_UV[f], ou = Math.max(1, os[ua]), ov = Math.max(1, os[va]);
      for (let v = 0; v < fv; v++) for (let u = 0; u < fu; u++) { const [dx, dy] = texelAt(to, u, v); if (dx < 0 || dy < 0 || dx >= W || dy >= H) continue;
        const [sx, sy] = texelAt(from, Math.min(ou - 1, Math.floor(u * ou / fu)), Math.min(ov - 1, Math.floor(v * ov / fv))); if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
        const i = (sy * W + sx) * 4, j = (dy * W + dx) * 4; d[j] = d[i]; d[j + 1] = d[i + 1]; d[j + 2] = d[i + 2]; d[j + 3] = d[i + 3]; } } });
    ED.rects = ED.rects.concat(fig.usedRects({ nodes: [b.node] }));   // the next grown box must not take the same room
  }
  return paints;
}
// a box the player added turns about its own middle: any shift of it goes into its place (position), never its offset from that place
function bakeOffset(n) { const o = n.shape?.offset; if (!o || !(o.x || o.y || o.z)) return false; const q = n.orientation || { x: 0, y: 0, z: 0, w: 1 }, p = n.position || { x: 0, y: 0, z: 0 }, r = v => Math.round(v * 100) / 100;
  const ix = q.w * o.x + q.y * o.z - q.z * o.y, iy = q.w * o.y + q.z * o.x - q.x * o.z, iz = q.w * o.z + q.x * o.y - q.y * o.x, iw = -q.x * o.x - q.y * o.y - q.z * o.z;
  n.position = { x: r(p.x + ix * q.w - iw * q.x - iy * q.z + iz * q.y), y: r(p.y + iy * q.w - iw * q.y - iz * q.x + ix * q.z), z: r(p.z + iz * q.w - iw * q.z - ix * q.y + iy * q.x) }; n.shape.offset = { x: 0, y: 0, z: 0 }; return true; }
function finishShape(before) {
  for (const b of boxesOf(ED.model)) if (/^Box_/.test(b.node.name)) bakeOffset(b.node);
  for (const b of boxesOf(ED.model)) { const p = b.node.position; for (const o of [p, b.node.shape?.offset]) if (o) for (const k of ['x', 'y', 'z']) if (typeof o[k] === 'number') o[k] = Math.max(-64, Math.min(64, o[k])); }   /* every move path (gizmo, drag, Bring forward) keeps the same ±64 limit as the fields */
  const paints = tidyResized(before); recordShape(before, shapeEdit.sel);
  if (paints.length) { ED.painter.write((d, W, H) => paints.forEach(p => p(d, W, H))); ED.hist.push({ k: 'g', parts: ED.hist.splice(-2) }); }
  shapeChanged();
}
const CORE_TOOLS = ['select', 'brush', 'erase', 'part', 'fill', 'pick'];

function shapeSide() {
  const boxes = boxesOf(ED.model), i = Math.min(ED.box || 0, boxes.length - 1), b = boxes[i], sh = b.node.shape;
  const axisField = (lab, obj, key, ax, min, max, step = 1) => scrub(lab, () => obj[key]?.[ax] ?? 0, v => { obj[key] = { x: 0, y: 0, z: 0, ...obj[key], [ax]: v }; }, step, min, max);
  const wrap = v => { const w = ((v + 180) % 360 + 360) % 360 - 180; return w === -180 ? 180 : w; }, turnNow = () => { const c = ED.turns?.get(b.node), q = b.node.orientation || {}, t = c && toQuat(...c);
    return t && Math.abs(Math.abs(t.x * (q.x ?? 0) + t.y * (q.y ?? 0) + t.z * (q.z ?? 0) + t.w * (q.w ?? 1)) - 1) < 1e-4 && Math.max(...['x', 'y', 'z', 'w'].map(k => Math.min(Math.abs((t[k] ?? 0) - (q[k] ?? (k === 'w' ? 1 : 0))), Math.abs((t[k] ?? 0) + (q[k] ?? (k === 'w' ? 1 : 0)))))) < 3e-6 ? c : toEuler(b.node.orientation); };   /* typed values are kept only while the stored turn is exactly the typed one (as rounded) */
  const turnField = (lab, k) => scrub(lab, () => turnNow()[k], v => { const d = [...turnNow()]; d[k] = wrap(v); b.node.orientation = toQuat(...d); (ED.turns ||= new Map()).set(b.node, d); }, 1, -100000, 100000, 0.01);
  const xyz = (label, fields) => el('div', { class: 'wsgroup' }, el('b', { text: label }), el('div', { class: 'xyzrow' }, ...fields));   /* one row of axis fields, as in other editors */
  const own = /^Box_/.test(b.node.name), pos = own ? [b.node, 'position'] : [sh, 'offset'];
  // Position: where the box's middle is (pivot + offset), the same number for game parts and added ones; a game part moves by its offset (so what hangs from it stays put), an added one by its position
  const posField = (lab, ax) => scrub(lab, () => (b.node.position?.[ax] ?? 0) + (sh.offset?.[ax] ?? 0), v => { const [o, k] = pos, other = own ? (sh.offset?.[ax] ?? 0) : (b.node.position?.[ax] ?? 0); o[k] = { x: 0, y: 0, z: 0, ...o[k], [ax]: v - other }; }, 0.5, -64, 64);
  const act = (t, fn, tip) => el('button', { class: 'chip', text: t, title: tip ? `${t} (${tip})` : '', onclick: fn });
  const nudgeZ = d => () => { let ax = 'z', sg = 1; const m = st.findMesh(o => o.userData.nodeName === b.node.name), memo = (ED.fwd ||= new Map()).get(b.node.name);   /* forward = away from the body's middle, in the part's own axes */
    if (m && m.parent) { let root = m; while (root.parent && root.parent.type !== 'Scene') root = root.parent; const v = m.position.clone(), rp = m.position.clone(); m.getWorldPosition(v); root.getWorldPosition(rp);
      const cp = st.camera.position.clone(), out = cp.sub(v); if (Math.hypot(out.x, out.z) > Math.abs(out.y) * 0.4) out.y = 0; if (out.length() < 1e-3) out.set(0, 0, 1);   /* from above, forward is up */ void rp;   /* forward = toward the viewer, like layers in a 2D editor */ const fr = pos[0] === b.node && m.parent.parent ? m.parent.parent : m.parent; out.normalize().applyQuaternion(fr.getWorldQuaternion(fr.quaternion.clone()).invert());
      ax = ['x', 'y', 'z'].reduce((a, c) => Math.abs(out[c]) > Math.abs(out[a]) ? c : a, 'x'); sg = Math.sign(out[ax]) || 1; }
    if (memo) ({ ax, sg } = memo); else ED.fwd.set(b.node.name, { ax, sg });   /* the direction is fixed once per part: moving near the camera can't flip it, so Send backward undoes Bring forward */
    shapeEdit(() => { const [o_, k_] = pos, v0 = o_[k_]?.[ax] ?? 0; o_[k_] = { x: 0, y: 0, z: 0, ...o_[k_], [ax]: Math.max(-64, Math.min(64, d * sg > 0 ? Math.floor(v0 * 2 + 1e-6) / 2 + 0.5 : Math.ceil(v0 * 2 - 1e-6) / 2 - 0.5)) }; }); };   /* off-grid parts snap to the next half step, then move evenly */
  return [el('div', { class: 'wshead row' }, el('span', { class: 'grow', text: 'Parts' }),
      el('button', { class: 'iconbtn', text: '+', title: 'Add part (A)', 'aria-label': 'Add part', onclick: startPlacing }), el('button', { class: 'iconbtn', text: '⧉', title: 'Add item…', 'aria-label': 'Add item', onclick: guard(combinePick) })),
    el('div', { class: 'outliner' }, boxes.map((x, k) => { const name = boxLabel(x.node), same = boxes.filter(y => boxLabel(y.node) === name), nth = same.length > 1 ? ' ' + (same.findIndex(y => y.node === x.node) + 1) : '';
      return el('div', { class: 'partrow' + (k === i ? ' on' : '') }, el('button', { class: k === i ? 'on' : '', text: name + nth, onclick: e => { const now = Date.now(), again = ED.box === k && now - (ED.pickAt || 0) < 450; ED.pickAt = now; if (again) return renameBox(e.currentTarget, x.node); ED.box = k; render(); placeGizmo(); st.showMesh(st.findMesh(o => o.material?.map?.image === ED.canvas && o.userData.nodeName === x.node.name)); },
        onmouseenter: () => st.highlight(o => o.material?.map?.image === ED.canvas && o.userData.nodeName === x.node.name), onmouseleave: () => outlineBox() }),
        el('button', { class: 'partdel', text: '✕', title: 'Delete (Del)', 'aria-label': 'Delete ' + name + nth, onclick: () => delBox(k) })); })),
    el('div', { class: 'options' }, act('Reset item', resetShape)),
    el('div', { class: 'wshead', text: boxLabel(b.node) }),
    el('div', { class: 'options' }, act('Duplicate', () => addBox('dup'), 'Ctrl+D'), act('Mirror', () => addBox('mirror'), 'Shift+M'), el('button', { class: 'chip' + (ED.sym ? ' on' : ''), text: 'Symmetry', 'aria-pressed': String(!!ED.sym), onclick: () => { ED.sym = !ED.sym; render(); } })),
    xyz('Position', ['x', 'y', 'z'].map(ax => posField(ax.toUpperCase(), ax))),
    el('div', { class: 'options' }, act('Bring forward', nudgeZ(0.5)), act('Send backward', nudgeZ(-0.5))),
    xyz('Size', [axisField('W', sh.settings, 'size', 'x', 1, 64), axisField('H', sh.settings, 'size', 'y', 1, 64), sh.type === 'quad' ? null : axisField('D', sh.settings, 'size', 'z', 1, 64)]),
    xyz('Rotation', [turnField('X', 0), turnField('Y', 1), turnField('Z', 2)]),
    el('div', { class: 'options' }, (() => { const cb = curBox(), x = act('Separate texture', () => { const b = curBox(); if (b && !sharersOf(b.node.name).length) return; ownArea(); }); x.disabled = !cb || !sharersOf(cb.node.name).length; return x; })()   /* only when the part shares paint */)];
}
const dupBox = () => addBox('dup');
function delBox(k = ED.box || 0) { const boxes = boxesOf(ED.model), i = k, b = boxes[i]; if (!b) return;   /* a part goes with the parts attached to it (an added hat's pieces) */
  const inside = boxesOf({ nodes: [b.node] }).length; if (boxes.length - inside < 1) return say(inside > 1 ? 'Every other part is attached to it' : "Can't delete the last part", true);
  const tw = ED.sym ? twinOf(b) : null, twB = tw && tw !== b.node && boxes.find(x => x.node === tw && !boxesOf({ nodes: [b.node] }).some(y => y.node === tw)), twIn = twB ? boxesOf({ nodes: [tw] }).length : 0, both = twB && boxes.length - inside - twIn >= 1;   /* Symmetry: the twin goes too */
  { const before = JSON.stringify(ED.model); const cut = x => { const list = x.parent ? x.parent.children : ED.model.nodes; list.splice(list.indexOf(x.node), 1); }; cut(b); if (both) cut(twB); ED.box = Math.max(0, Math.min(i, boxesOf(ED.model).length - 1)); finishShape(before); }
  const gone = inside + (both ? twIn : 0);
  const keep = fig.usedRects(ED.model);   /* the paint no part uses any more goes too, so no old blocks stay on the texture */
  ED.painter.write((d, W, H) => { const used = new Uint8Array(W * H); for (const r of keep) for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(H, Math.ceil(r.y + r.h)); y++) used.fill(1, y * W + Math.max(0, Math.floor(r.x)), y * W + Math.min(W, Math.ceil(r.x + r.w)));
    for (let k = 0; k < W * H; k++) if (!used[k]) d[k * 4 + 3] = 0; }); ED.hist.push({ k: 'g', parts: ED.hist.splice(-2) }); render();
  if (gone > 1) { const top = ED.hist[ED.hist.length - 1]; sayUndo(`Deleted ${gone} parts`, () => { if (ED && ED.hist[ED.hist.length - 1] === top) wsUndo(false); }); } else say('');   /* a part with pieces under it says how many went */
}
const resetShape = guard(async () => {   // the game's own shape and paint come back (one undo step)
  say('');
  const e = ED, f = e.asset.field, base = CAT.items[f]?.find(x => x.Id === e.asset.baseId && !x.custom), orig = uniqNames(structuredClone(await game.json(game.common(e.asset.model))));
  let img = null; if (base) { const worn = e.before?.[f], val = e.asset.tone ? base.Id + '.' + e.asset.tone : worn && parse(worn).id === base.Id ? worn : R.partStr(base), sk = { ...cur.skin, [f]: val }; for (const h of HIDE[f] || []) delete sk[h];
    const r = R.resolve(f, sk); if (r) img = await fig.bakedCanvas(r.tex, r.tint).catch(() => null); }
  if (ED !== e) return;
  if (img && e.model && JSON.stringify(e.model) === JSON.stringify(orig)) { const c = e.canvas, d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, src = img.getContext('2d').getImageData(0, 0, img.width, img.height).data; let same = true;
    for (let y = 0; y < c.height && same; y++) for (let x = 0; x < c.width; x++) { const k = (y * c.width + x) * 4, inside = x < img.width && y < img.height, j = (y * img.width + x) * 4; if (inside ? (d[k] !== src[j] || d[k + 1] !== src[j + 1] || d[k + 2] !== src[j + 2] || d[k + 3] !== src[j + 3]) : d[k + 3]) { same = false; break; } }
    if (same) return; }   /* already the game version: no step */
  e.noCap = true; const h0 = e.hist.length;
  if (img) { const c = e.canvas; if (img.width > c.width || img.height > c.height) { e.painter.grow(Math.max(c.height, img.height), Math.max(c.width, img.width)); e.asset = { ...e.asset, w: c.width, h: c.height }; }
    const src = img.getContext('2d').getImageData(0, 0, img.width, img.height).data; e.painter.write((d, W) => { d.fill(0); for (let y = 0; y < img.height; y++) d.set(src.subarray(y * img.width * 4, (y + 1) * img.width * 4), y * W * 4); }); }
  const splitWas = !!e.asset.split; e.asset = { ...e.asset, split: false }; e.splitDone = false;   /* shared paint is shared again, as in the game */
  e.noTidy = true; try { shapeEdit(() => { ED.model = orig; ED.box = 0; }); } finally { e.noTidy = false; } e.asset = { ...e.asset, labels: undefined }; if (e.hist.length > h0) e.hist.push({ k: 'g', splitWas, parts: e.hist.splice(h0) }); e.noCap = false; capHist(); ED.palette = ED.painter.palette(); requestAnimationFrame(() => { if (ED) { fitTexture(); render(); } }); });
function renderWorkspace() {
  const P = ED.painter, a = ED.asset, c = ED.canvas, mode = ED.mode || 'paint'; ED.shapeOpen = mode === 'shape';
  const tools = mode === 'paint' ? PAINT_TOOLS : SHAPE_TOOLS, active = mode === 'paint' ? P.tool : ED.stool || 'select';
  $('wstop').replaceChildren(...[
    el('input', { type: 'text', class: 'wsname', value: a.name, maxLength: 120, 'aria-label': 'Name', onkeydown: e => { if (e.key === 'Enter') e.target.blur(); else if (e.key === 'Escape') { e.target.value = ED.asset.name; e.target.blur(); } }, onchange: e => { const v = cleanName(e.target.value); if (v && gameNamed(v)) { e.target.value = ED.asset.name; return say('A game item has that name', true); } say(''); const taken = new Set(ASSETS.filter(x => x.id !== ED.asset.id).map(x => x.name)); let v2 = v, k2 = 2; while (v2 && taken.has(v2)) v2 = cleanName(clip(v, 36) + ' ' + k2++); if (v2 !== v) e.target.value = v2;   /* two items never share a name */ ED.asset = { ...ED.asset, name: v2 || a.name }; e.target.value = ED.asset.name; queueAssetSave(); } }),
    el('span', { id: 'wssaved', class: 'wssaved', text: ED.saved === false ? 'Saving…' : 'Saved' }),
    el('span', { class: 'grow' }), a.flag ? el('button', { class: 'tag none', text: 'Site only', title: FLAG_WHY(a.flag), onclick: () => say(FLAG_WHY(a.flag), true) }) : null,
    el('button', { class: 'btn icon', text: '↶', title: 'Undo (Ctrl+Z)', disabled: !ED.hist.length, onclick: () => wsUndo(false) }),
    el('button', { class: 'btn icon', text: '↷', title: 'Redo (Ctrl+Y)', disabled: !ED.fut.length, onclick: () => wsUndo(true) }),
    
    el('button', { id: 'wsdone', class: 'btn primary', text: 'Done', onclick: () => finishAsset(true) })   /* Done saves and puts the item on the character */].filter(Boolean));
  const tool = (id, label, key, ic, on, fn) => el('button', { class: 'wstool' + (on ? ' on' : ''), title: (SHORT[id] || label) + (key ? ` (${key})` : ''), onclick: fn }, el('span', {}, toolIcon(id) || ic), el('b', { text: SHORT[id] || label }), key && key.length === 1 ? el('i', { text: key }) : null);
  const pickAny = (kind, id) => guard(async () => { if (ED.mode !== kind) await setMode(kind); pickTool(id); })();
  const paintIds = ['brush', 'erase', 'fill', 'pick'], extra = PAINT_TOOLS.filter(t => !paintIds.includes(t[0]));
  const NAMES = { brush: 'Paint', erase: 'Erase', fill: 'Fill', pick: 'Pick', move: 'Move', resize: 'Resize', rotate: 'Turn' };
  const btn = (kind, [id, label, key, ic]) => { const on = ED.mode === kind && (kind === 'paint' ? P.tool : ED.stool) === id;
    return el('button', { class: 'wstool' + (on ? ' on' : ''), title: (NAMES[id] || SHORT[id] || label) + (key ? ` (${key})` : ''), onclick: () => pickAny(kind, id) }, el('span', {}, toolIcon(id) || ic), el('b', { text: NAMES[id] || SHORT[id] || label })); };
  const stg = $('view').parentElement; if ($('wstools').parentElement !== stg) stg.appendChild($('wstools'));   // the toolbar floats in the view, under the character
  $('wstools').replaceChildren(
    el('div', { class: 'wsgroup2' }, ...PAINT_TOOLS.filter(t => paintIds.includes(t[0])).sort((a, b) => paintIds.indexOf(a[0]) - paintIds.indexOf(b[0])).map(t => btn('paint', t)),
      ED.moreTools ? el('div', { class: 'wsextra' }, ...extra.map(t => btn('paint', t))) : null,
      el('button', { data: { fk: 'moretools' }, class: 'wstool' + (ED.mode !== 'shape' && !ED.moreTools && extra.some(t => t[0] === ED.painter.tool) ? ' on' : ''), 'aria-label': ED.moreTools ? 'Fewer tools' : 'More tools', onclick: () => { ED.moreTools = !ED.moreTools; render(); } }, el('span', {}, toolIcon(ED.moreTools ? 'less' : 'more')), el('b', { text: ED.moreTools ? 'Less' : 'More' }))),
    el('div', { class: 'wsgroup2' }, ...SHAPE_TOOLS.map(t => btn('shape', t)),
      el('button', { class: 'wstool', title: 'Add part (A)', onclick: guard(async () => { if (ED.mode !== 'shape') await setMode('shape'); startPlacing(); }) }, el('span', {}, toolIcon('add')), el('b', { text: 'Add' }))));
  c.style.width = c.width * ED.zoom + 'px';
  if (!ED.box_) { ED.box_ = el('div', { class: 'paintbox' }); bindTexView(ED.box_); }
  ED.box_.replaceChildren(el('div', { class: 'paintwrap' }, c, limits(c), sizeOvl()));
  ED.box_.classList.toggle('resizing', mode === 'shape' && ED.stool === 'resize');   // drag a part's area on the texture to resize it
  $('wsleft').replaceChildren(...[el('div', { class: 'wshead row' }, el('span', { text: 'Texture', class: 'grow' }),
      el('button', { class: 'chip' + (ED.wide ? ' on' : ''), text: ED.wide ? 'Smaller' : 'Bigger', onclick: e => { ED.wide = !ED.wide; ED.userZoom = false; e.currentTarget.textContent = ED.wide ? 'Smaller' : 'Bigger'; e.currentTarget.classList.toggle('on', ED.wide); $('app').classList.toggle('ws-wide', ED.wide); requestAnimationFrame(() => { fitTexture(); render(); }); } })),
    ED.box_,
    el('div', { class: 'row' }, el('button', { class: 'btn icon', text: '−', title: 'Zoom out', disabled: ED.zoom <= ZOOMS[0], onclick: () => zoomCentre(zoomStep(ED.zoom, -1)) }), el('button', { data: { fk: 'zoompct' }, class: 'btn ghost zoompct', text: Math.round(ED.zoom * 100) + '%', title: 'Fit (Ctrl+0)', onclick: () => { ED.userZoom = false; fitTexture(); render(); } }), el('button', { class: 'btn icon', text: '+', title: 'Zoom in', disabled: ED.zoom >= 24, onclick: () => zoomCentre(zoomStep(ED.zoom, 1)) }),
      ED.rects.length && ED.mode !== 'shape' ? el('button', { class: 'chip' + (P.inside ? '' : ' on'), text: 'Paint outside', 'aria-pressed': String(!P.inside), onclick: () => { P.inside = !P.inside; render(); } }) : null),
    ].filter(Boolean));
  $('wsright').replaceChildren(...(mode === 'paint' ? paintSide() : shapeSide()).flat(Infinity).filter(Boolean)); $('wsright').querySelector('.partrow.on')?.scrollIntoView({ block: 'nearest' });
  viewHint();
  $('viewbtns').replaceChildren(   // just the item/whole-body switch: turning and zooming are drag and wheel (number keys still jump to a view)
    el('button', { class: ED.iso ? 'on' : '', text: 'Item only', 'aria-pressed': String(!!ED.iso), onclick: () => { ED.iso = !ED.iso; st.isolate(ED.iso ? ED.canvas : null); render(); } }));
}
// shortcuts while the workspace is open (caught before the page's own Ctrl+Z, which undoes the skin)
addEventListener('keydown', e => {
  if (ED && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && e.target?.matches?.('input, textarea')) { e.preventDefault(); return; }   /* no bookmark dialog from inside the editor's fields */
  if (ED && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); e.stopImmediatePropagation(); try { document.activeElement?.blur?.(); } catch { /* fine */ } flushNow(); if (ED.saved === false) queueAssetSave(); return; }   /* Ctrl+S saves now, from anywhere in the editor */
  if (!ED || e.target?.matches?.('input, textarea, select') || $('dlg').open) return;
  const k = e.key.toLowerCase(), ctrl = e.ctrlKey || e.metaKey; let done = true;
  if (ctrl && k === 'z') wsUndo(e.shiftKey); else if (ctrl && k === 'y') wsUndo(true);
  else if (ED.adjOpen) { if (k === 'escape' && ED.adjCancel) ED.adjCancel(); else done = !['tab', 'shift', 'control', 'alt'].includes(k); }   /* nothing edits the texture while colours are being adjusted */
  else if (ctrl && k === 'd' && ED.mode === 'shape') dupBox();
  else if (k === 'f2' && ED.mode === 'shape' && curBox()) { const b = document.querySelector('.partrow.on > button'); if (b) renameBox(b, curBox().node); }
  else if (ED.mode === 'shape' && !ctrl && k === 'a') startPlacing();   /* M is Select area everywhere; Mirror is Shift+M */
  else if (ED.mode === 'shape' && !ctrl && k === 'm' && e.shiftKey) addBox('mirror');
  else if (k === 'escape' && ED.placing) { ED.placing = false; say(''); viewHint(); }
  else if (ED.mode !== 'shape' && ctrl && (k === 'c' || k === 'x')) copySel(k === 'x');
  else if (ED.mode !== 'shape' && ctrl && k === 'v') pasteClip();
  else if (ED.mode !== 'shape' && ctrl && k === 'a') { ED.sel = { x: 0, y: 0, w: ED.canvas.width, h: ED.canvas.height }; ED.painter.tool = 'select'; render(); }
  else if (ED.mode !== 'shape' && k === 'enter' && ED.float) { placeFloat(); render(); }
  else if (ED.mode !== 'shape' && k === 'escape' && (ED.float || ED.sel)) { if (ED.float) ED.float = null; else ED.sel = null; render(); }
  else if (ED.mode !== 'shape' && (k === 'delete' || k === 'backspace') && ED.sel && !ED.float) clearSel();
  else if ((k === 'delete' || k === 'x') && ED.mode === 'shape' && !ctrl) delBox();
  else if (k === 'a' && !ctrl && !e.altKey) guard(async () => { if (ED.mode !== 'shape') await setMode('shape'); startPlacing(); })();
  else if (ED.float && !ctrl && k.startsWith('arrow')) { const d = { arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, -1], arrowdown: [0, 1] }[k], m = e.shiftKey ? 8 : 1; keepFloatOn(ED.float.x + d[0] * m, ED.float.y + d[1] * m); render(); }   /* arrows move a paste that isn't placed yet */
  else if (ED.mode === 'shape' && (k === 'arrowup' || k === 'arrowdown') && e.target?.closest?.('.partrow')) { const n = boxesOf(ED.model).length; ED.box = Math.max(0, Math.min(n - 1, (ED.box || 0) + (k === 'arrowup' ? -1 : 1))); render(); placeGizmo(); document.querySelector('.partrow.on > button')?.focus(); }   /* arrows in the parts list move the selection */
  else if (ctrl && k === 's') { flushNow(); if (ED.saved === false) queueAssetSave(); }   /* everything saves by itself; Ctrl+S just saves now */
  else if (ctrl && k === 'd' && ED.mode !== 'shape') { }   /* no bookmark dialog while painting */
  else if (e.key === '?') showKeys();
  else if (ctrl && k === '0') { ED.userZoom = false; fitTexture(); render(); }   /* Ctrl+0 fits the texture */
  else if (k === 'escape' && ED.moreTools) { ED.moreTools = false; render(); }
  else if (ED.mode === 'shape' && !ctrl && k.startsWith('arrow') && curBox()) { const sh = curBox().node.shape, d = { arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, 1], arrowdown: [0, -1] }[k];
    shapeEdit(() => { const o = { x: 0, y: 0, z: 0, ...sh.offset }; if (e.shiftKey) o.z += d[1] || -d[0]; else { o.x += d[0]; o.y += d[1]; } sh.offset = o; }); }
  else if (['1', '2', '3', '7', '5'].includes(k) && !ctrl) { st.setView({ 1: 'front', 2: 'back', 3: 'side', 7: 'top', 5: 'persp' }[k]); st.frameOn(ED.canvas); }
  else if (ED.mode !== 'shape' && !ctrl && (k === '[' || k === ']') && ['brush', 'erase', 'light', 'dark', 'noise', 'line', 'box'].includes(ED.painter.tool)) { const P = ED.painter; P.size = Math.max(1, Math.min(8, P.size + (k === ']' ? 1 : -1))); render(); }
  else if (ED.mode !== 'shape' && k === 'alt' && !e.repeat && !ED.float && ED.painter.tool !== 'pick') { ED.altFrom = ED.painter.tool; pickTool('pick'); }
  else if (!ctrl && !e.altKey) { const same = (ED.mode === 'shape' ? SHAPE_TOOLS : PAINT_TOOLS).find(x => x[2] && x[2].toLowerCase() === k), other = (ED.mode === 'shape' ? PAINT_TOOLS : SHAPE_TOOLS).find(x => x[2] && x[2].toLowerCase() === k);
    if (same) pickTool(same[0]); else if (other) guard(async () => { await setMode(ED.mode === 'shape' ? 'paint' : 'shape'); pickTool(other[0]); })(); else done = false; }
  else done = false;
  if (done) { e.preventDefault(); e.stopImmediatePropagation(); }
}, true);

addEventListener('keyup', e => { if (ED && e.key === 'Alt' && ED.altFrom) { const t = ED.altFrom; ED.altFrom = null; if (ED.mode !== 'shape' && !ED.float) pickTool(t); e.preventDefault(); } }, true);   // holding Alt picks colours, letting go goes back
addEventListener('blur', () => { if (ED && ED.altFrom) { const t = ED.altFrom; ED.altFrom = null; if (ED.mode !== 'shape') pickTool(t); } });
// ---- brush outline, area selection and copy-paste on the flat texture
const brushSize = () => { const t = ED.painter.tool; return t === 'line' || t === 'box' ? ED.painter.size : SHAPES.has(t) || ONCE.has(t) || t === 'select' ? 1 : ED.painter.size; };
function sizeOvl() { const o = ED.ovl, z = ED.zoom, c = ED.canvas, W = Math.round(c.width * z), H = Math.round(c.height * z); if (o.width !== W || o.height !== H) { o.width = W; o.height = H; o.style.width = W + 'px'; } drawOvl(); return o; }
function drawOvl() {
  if (!ED || !ED.ovl) return; const o = ED.ovl, z = ED.zoom, x = o.getContext('2d'); x.clearRect(0, 0, o.width, o.height);
  const box = (r, col, dash) => { for (const [c, w] of [['rgba(0,0,0,.7)', 3], [col, 1]]) { x.setLineDash(dash && w === 1 ? [4, 3] : []); x.strokeStyle = c; x.lineWidth = w; x.strokeRect(r.x * z + 0.5, r.y * z + 0.5, r.w * z - 1, r.h * z - 1); } x.setLineDash([]); };
  const f = ED.float;
  if (f) { if (!f.cv) { f.cv = el('canvas', { width: f.img.width, height: f.img.height }); f.cv.getContext('2d').putImageData(f.img, 0, 0); }
    x.imageSmoothingEnabled = false; x.drawImage(f.cv, f.x * z, f.y * z, f.img.width * z, f.img.height * z); box({ x: f.x, y: f.y, w: f.img.width, h: f.img.height }, '#7fd3ff', true); }
  else if (ED.sel) box(ED.sel, '#7fd3ff', true);
  if (ED.mode !== 'shape') { const s = brushSize(), off = Math.floor((s - 1) / 2); for (const [p, col] of [[ED.hover, '#ffffff'], [ED.hoverM, '#f4c452']]) if (p) box({ x: p.x - off, y: p.y - off, w: s, h: s }, col); }
}
function bindSelect(c, toPixel) {   // the Select tool: drag out an area, or drag a pasted piece to move it
  let drag = null;
  c.addEventListener('pointerdown', e => { if (!ED || e.button !== 0 || ED.painter.tool !== 'select' || ED.mode === 'shape') return; const p = toPixel(e); e.preventDefault(); try { c.setPointerCapture(e.pointerId); } catch { /* fine */ }
    const f = ED.float; if (f && p.x >= f.x && p.y >= f.y && p.x < f.x + f.img.width && p.y < f.y + f.img.height) drag = { move: true, dx: p.x - f.x, dy: p.y - f.y };
    else { if (f) placeFloat(); drag = { x: p.x, y: p.y }; ED.sel = { x: p.x, y: p.y, w: 1, h: 1 }; } drawOvl(); });
  c.addEventListener('pointermove', e => { if (!drag || !ED) return; const p = toPixel(e);
    if (drag.move) keepFloatOn(p.x - drag.dx, p.y - drag.dy); else ED.sel = { x: Math.min(drag.x, p.x), y: Math.min(drag.y, p.y), w: Math.abs(p.x - drag.x) + 1, h: Math.abs(p.y - drag.y) + 1 };
    drawOvl(); });
  const up = () => { if (drag) { drag = null; render(); } }; c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
}
function copySel(cut) {
  if (!ED.sel) return say('Select an area first', true);
  const { x, y, w, h } = ED.sel; CLIP = ED.canvas.getContext('2d', { willReadFrequently: true }).getImageData(x, y, w, h);
  if (cut && CLIP.data.some((v, i) => i % 4 === 3 && v)) ED.painter.write((d, W) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) d[(j * W + i) * 4 + 3] = 0; });
  render();
}
function pasteClip() {
  if (!CLIP) return say('Nothing copied', true); if (ED.float) placeFloat();
  const W = ED.canvas.width, H = ED.canvas.height, a0 = ED.sel || ED.hover || { x: 0, y: 0 }, at = { x: Math.max(0, Math.min(a0.x, W - CLIP.width)), y: Math.max(0, Math.min(a0.y, H - CLIP.height)) }; ED.float = { img: new ImageData(new Uint8ClampedArray(CLIP.data), CLIP.width, CLIP.height), x: at.x, y: at.y };
  ED.painter.tool = 'select'; render();
}
function keepFloatOn(x, y) { const f = ED.float, W = ED.canvas.width, H = ED.canvas.height; f.x = Math.max(1 - f.img.width, Math.min(W - 1, x)); f.y = Math.max(1 - f.img.height, Math.min(H - 1, y)); }   // at least one texel of a paste stays on the texture
function placeFloat() {   // stamps the pasted piece where it sits (see-through texels stay as they were; Inside only still holds)
  const f = ED.float; if (!f) return; ED.float = null; const P = ED.painter, w = f.img.width, h = f.img.height, s = f.img.data;
  { const C = ED.canvas, cur_ = C.getContext('2d').getImageData(0, 0, C.width, C.height).data; let diff = false; for (let j = 0; j < h && !diff; j++) for (let i = 0; i < w; i++) { const X = f.x + i, Y = f.y + j, a = (j * w + i) * 4; if (X < 0 || Y < 0 || X >= C.width || Y >= C.height || !s[a + 3]) continue; if (P.inside && P.mask && !P.mask[Y * C.width + X]) continue; const k = (Y * C.width + X) * 4; if (cur_[k] !== s[a] || cur_[k + 1] !== s[a + 1] || cur_[k + 2] !== s[a + 2] || cur_[k + 3] !== s[a + 3]) { diff = true; break; } } if (!diff) { const x0 = Math.max(0, f.x), y0 = Math.max(0, f.y); ED.sel = { x: x0, y: y0, w: Math.max(1, Math.min(C.width, f.x + w) - x0), h: Math.max(1, Math.min(C.height, f.y + h) - y0) }; return; } }   /* placed where it already was: no step */
  P.write((d, W, H) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const X = f.x + i, Y = f.y + j, a = (j * w + i) * 4; if (X < 0 || Y < 0 || X >= W || Y >= H || !s[a + 3]) continue;
    const k = Y * W + X; if (P.inside && P.mask && !P.mask[k]) continue; d.set(s.subarray(a, a + 4), k * 4); } });
  { const W = ED.canvas.width, H = ED.canvas.height, x0 = Math.max(0, f.x), y0 = Math.max(0, f.y); ED.sel = { x: x0, y: y0, w: Math.max(1, Math.min(W, f.x + w) - x0), h: Math.max(1, Math.min(H, f.y + h) - y0) }; }
}
function flipFloat(across) {
  const f = ED.float; if (!f) return; const w = f.img.width, h = f.img.height, s = f.img.data, out = new ImageData(w, h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const a = (j * w + i) * 4, b = ((across ? j : h - 1 - j) * w + (across ? w - 1 - i : i)) * 4; out.data.set(s.subarray(b, b + 4), a); }
  f.img = out; f.cv = null; drawOvl();
}
function clearSel() { const s = ED.sel; if (!s) return; { const d = ED.canvas.getContext('2d').getImageData(s.x, s.y, s.w, s.h).data; let any = false; for (let i = 3; i < d.length; i += 4) if (d[i]) { any = true; break; } if (!any) return; }   /* an empty area: nothing to clear, no step */
  ED.painter.write((d, W) => { for (let j = s.y; j < s.y + s.h; j++) for (let i = s.x; i < s.x + s.w; i++) d[(j * W + i) * 4 + 3] = 0; }); }

// ---- boxes with their own room on the texture, mirrored copies and symmetry
const FACE_UV = { front: [0, 1], back: [0, 1], right: [2, 1], left: [2, 1], top: [0, 2], bottom: [0, 2] };
const faceDims = sh => { const s = ['x', 'y', 'z'].map(k => Math.ceil(Math.abs(sh.settings?.size?.[k] ?? 0)));
  return (sh.type === 'quad' ? ['front'] : Object.keys(FACE_UV)).map(f => [f, s[FACE_UV[f][0]], s[FACE_UV[f][1]]]).filter(([, w, h]) => w > 0 && h > 0); };
function allocLayout(sh) {   // free room on the texture for a box's faces: one Blockbench-style block if it fits, else face by face
  const W = ED.canvas.width, H = ED.canvas.height, occ = new Uint8Array(W * H);
  for (const r of ED.rects) for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(H, Math.ceil(r.y + r.h)); y++) for (let x = Math.max(0, Math.floor(r.x)); x < Math.min(W, Math.ceil(r.x + r.w)); x++) occ[y * W + x] = 1;
  const fits = (x0, y0, w, h) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (occ[y * W + x]) return false; return true; };
  const spot = (w, h) => { for (let y = 0; y + h <= H; y++) for (let x = 0; x + w <= W; x++) if (fits(x, y, w, h)) return { x, y }; return null; };
  const face = (x, y) => ({ offset: { x, y }, mirror: { x: false, y: false }, angle: 0 }), dims = faceDims(sh); if (!dims.length) return null;
  if (dims.length === 6) { const by = Object.fromEntries(dims.map(d => [d[0], d])), w = by.front[1], h = by.front[2], d = by.top[2], at = spot(2 * (w + d), d + h);
    if (at) { const { x, y } = at; return { top: face(x + d, y), bottom: face(x + d + w, y), right: face(x, y + d), front: face(x + d, y + d), left: face(x + d + w, y + d), back: face(x + 2 * d + w, y + d) }; } }
  const out = {}; for (const [f, w, h] of dims.sort((a, b) => b[1] * b[2] - a[1] * a[2])) { const at = spot(w, h); if (!at) return null;
    for (let y = at.y; y < at.y + h; y++) occ.fill(1, y * W + at.x, y * W + at.x + w); out[f] = face(at.x, at.y); }
  return out;
}
function texelAt(fl, u, v) { const pu = (u + 0.5) * (fl.mirror?.x ? -1 : 1), pv = (v + 0.5) * (fl.mirror?.y ? -1 : 1), ox = fl.offset?.x ?? 0, oy = fl.offset?.y ?? 0, a = ((fl.angle | 0) % 360 + 360) % 360;
  const [X, Y] = a === 90 ? [ox - pv, oy + pu] : a === 180 ? [ox - pu, oy - pv] : a === 270 ? [ox + pv, oy - pu] : [ox + pu, oy + pv]; return [Math.floor(X), Math.floor(Y)]; }
// paints a box's faces in their new place: copied from the old place (flipped left to right for a mirror), or one colour
const paintFaces = (sh, dst, src, flip, rgb) => (d, W, H) => {
  for (const [f, fu, fv] of faceDims(sh)) { const to = dst[f], from = src && src[flip ? ({ left: 'right', right: 'left' }[f] || f) : f]; if (!to) continue;
    for (let v = 0; v < fv; v++) for (let u = 0; u < fu; u++) { const [dx, dy] = texelAt(to, u, v); if (dx < 0 || dy < 0 || dx >= W || dy >= H) continue; const j = (dy * W + dx) * 4;
      if (rgb) { d[j] = rgb[0]; d[j + 1] = rgb[1]; d[j + 2] = rgb[2]; d[j + 3] = 255; continue; } if (!from) continue;
      const [sx, sy] = texelAt(from, flip ? fu - 1 - u : u, v); if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue; const i = (sy * W + sx) * 4; d[j] = d[i]; d[j + 1] = d[i + 1]; d[j + 2] = d[i + 2]; d[j + 3] = d[i + 3]; } } };
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function mirrorNode(src, dst) {   // dst becomes src flipped across the middle (left to right)
  const s = src.shape, d = dst.shape, p = src.position || {}, o = s.offset || {}, q = src.orientation || {}, neg = v => -(v ?? 0) || 0;
  d.settings = { ...d.settings, size: { ...s.settings?.size } }; if (s.type === 'quad' && /X$/.test(s.settings?.normal || '')) d.settings.normal = (s.settings.normal[0] === '+' ? '-' : '+') + 'X';
  d.offset = { x: neg(o.x), y: o.y ?? 0, z: o.z ?? 0 }; dst.position = { x: neg(p.x), y: p.y ?? 0, z: p.z ?? 0 }; dst.orientation = { x: q.x ?? 0, y: neg(q.y), z: neg(q.z), w: q.w ?? 1 };
}
// the other side's name: L-Arm <-> R-Arm, Left_Boot <-> Right_Boot, Glove_L <-> Glove_R; null for a name with no side
function sideSwap(name) {
  const rules = [[/^L-/, 'R-'], [/^R-/, 'L-'], [/Left/, 'Right'], [/Right/, 'Left'], [/left/, 'right'], [/right/, 'left'], [/([_-])L(?=$|[_-])/, '$1R'], [/([_-])R(?=$|[_-])/, '$1L']];
  for (const [re, to] of rules) if (re.test(name)) return name.replace(re, to); return null;
}
function nodeNamed(name) { let hit = null; const walk = (list, parent) => { for (const n of list || []) { if (hit) return; if (n.name === name) { hit = { node: n, parent }; return; } walk(n.children, n); } }; walk(ED.model.nodes, null); return hit; }
const twinParentOf = parent => { const sw = parent && sideSwap(parent.name), t = sw && nodeNamed(sw); return t ? t.node : null; };
function twinOf(b) {   // the box on the other side: the part with the other side's name, else the mirrored box in the other side's parent or beside it
  if (!b) return null; const n = b.node, sh = n.shape, near = (a, c) => Math.abs((a ?? 0) - (c ?? 0)) < 0.01;
  const sw = sideSwap(n.name), byName = sw && nodeNamed(sw); if (byName && byName.node.shape) return byName.node;
  { const path = (l, t, acc = []) => { for (const x of l || []) { if (x === t) return [...acc, x]; const p = path(x.children, t, [...acc, x]); if (p) return p; } return null; }, chain = path(ED.model.nodes, n) || [];   /* a part deep under L-Arm: the same place under R-Arm */
    for (let i = chain.length - 2; i >= 0; i--) { const s2 = sideSwap(chain[i].name), top = s2 && nodeNamed(s2)?.node; if (!top) continue; let at = top;
      for (let j = i + 1; j < chain.length && at; j++) { const k = (chain[j - 1].children || []).indexOf(chain[j]); at = (at.children || [])[k]; }
      if (at && at !== n && at.shape && at.shape.type === sh.type) return at; break; } }
  const tp = twinParentOf(b.parent);
  if (!tp && Math.abs((n.position?.x ?? 0) + (sh.offset?.x ?? 0)) < 0.25) return null;
  return (tp ? tp.children || [] : b.parent ? b.parent.children : ED.model.nodes).find(t => t !== n && t.shape && t.shape.type === sh.type && ['x', 'y', 'z'].every(k => near(t.shape.settings?.size?.[k], sh.settings?.size?.[k]))
    && ['x', 'y', 'z'].every(a => near((t.position?.[a] ?? 0) + (t.shape.offset?.[a] ?? 0), (a === 'x' ? -1 : 1) * ((n.position?.[a] ?? 0) + (sh.offset?.[a] ?? 0))))) || null;   /* where the box really sits, however it is split between position and offset */
}
const symTwin = () => ED.sym && ED.mode === 'shape' ? twinOf(curBox()) : null;
function standOut(hex) {   // the brush colour, unless it would hide the new box against the item's main colour
  const mains = (ED.palette || []).slice(0, 4), d = (a, b) => { const [p, q] = [hexRgb(a), hexRgb(b)]; return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]); };
  const far = c => Math.min(Infinity, ...mains.map(m => d(c, m)));   // how far a colour is from the nearest of the item's main colours
  if (!mains.length || far(hex) > 160) return hex; return ['#f4c452', '#3db7c9', '#7cc444', '#ffffff', '#7a4fd6'].reduce((a, b) => far(b) > far(a) ? b : a);
}
function copyLabel(src, mirror) {   // a copy is named after its part: "Horn copy"; a mirrored "Left glove" becomes "Right glove"
  const used = new Set(boxesOf(ED.model).map(b => boxLabel(b.node))), side = mirror && /^(Left|Right) /.test(src) ? src.replace(/^(Left|Right) /, m => m === 'Left ' ? 'Right ' : 'Left ') : null, stem = side || src.replace(/ copy( \d+)?$/, ''), suf = side ? '' : ' copy';
  let n = '', k = 1; do { const t = suf + (k > 1 ? ' ' + k : ''); n = stem.slice(0, 30 - t.length).trimEnd() + t; k++; } while (used.has(n) && k < 1000); return n; }   /* the name is cut, never the "copy N" ending, so copies stay unique */
function nextBoxName() { const used = new Set(boxesOf(ED.model).map(b => boxLabel(b.node))); let k = 1; while (used.has('Box ' + k)) k++; return 'Box ' + k; }
function startPlacing() { if (ED.model && boxesOf(ED.model).length >= assets.MAX_BOXES) return say(`Limit is ${assets.MAX_BOXES} parts`, true); ED.placing = true; say('Click to place · Esc to cancel'); viewHint(); }   // the hint under the view says what to do
function dragBox(e, mesh) {   // the Move tool: drag the box itself
  const d = st.boxDrag(mesh, e.clientX, e.clientY); if (!d) return; e.stopImmediatePropagation(); let last = null; const v = $('view'); try { v.setPointerCapture(e.pointerId); } catch { /* fine */ }
  const move = ev => { last = d.move(ev.clientX, ev.clientY) || last; };
  const up = () => { v.removeEventListener('pointermove', move); v.removeEventListener('pointerup', up); d.end(); const b = curBox(); if (!last || !b || last.length() < 0.25) return;
    const sh = b.node.shape, r = v => Math.round(v * 2) / 2; shapeEdit(() => { sh.offset = { x: r((sh.offset?.x ?? 0) + last.x), y: r((sh.offset?.y ?? 0) + last.y), z: r((sh.offset?.z ?? 0) + last.z) }; }); };
  v.addEventListener('pointermove', move); v.addEventListener('pointerup', up);
}
// ---- Combine: another item's parts and paint join the one being edited (worn together as one piece in this slot)
async function combineSource(f, e) {   // that item's model and its painted texture
  if (e.custom) { const a = ASSETS.find(x => 'Custom_' + x.id === e.Id); if (!a) throw new Error('That custom item is gone.');
    const bmp = await createImageBitmap(a.data), c = el('canvas', { width: bmp.width, height: bmp.height }); c.getContext('2d').drawImage(bmp, 0, 0);
    return { model: a.shape ? JSON.parse(a.shape) : structuredClone(await game.json(game.common(a.model))), canvas: c }; }
  if (paidLocked(e)) throw new Error(`${itemName(e)} is a ${TIERS[tierOf(e)]} item. Paid items can only be used by an account that owns them.`);
  const r = R.resolve(f, { ...cur.skin, [f]: R.partStr(e) }); if (!r) throw new Error('That item could not be read.');
  const c = await fig.bakedCanvas(r.tex, r.tint).catch(() => { throw new Error(`${itemName(e)} is not in your game files.`); });
  return { model: structuredClone(await game.json(game.common(r.model))), canvas: c };
}
async function combineWith(f, e) { say('');
  const src = await combineSource(f, e); await editModel();
  const names = new Set(), seen = list => { for (const n of list || []) { names.add(n.name); seen(n.children); } }; seen(ED.model.nodes);
  const fresh = n => { const b = String(n).slice(0, 56); let k = n, i = 2; while (names.has(k)) k = b + '_' + i++; names.add(k); return k; };   /* names stay under the 64-character limit */
  const renameAll = n => { n.name = fresh(n.name); for (const c of n.children || []) renameAll(c); };
  const holder = n => !n.shape || n.shape.type === 'none' || n.shape.visible === false;   // a bone the parts hang on, not a part
  const added = [];   // [box node, its layout in the other item's texture]
  const merge = (into, list) => { for (const n of list || []) { const same = into.find(x => x.name === n.name);
    if (same && holder(same) && holder(n)) { merge(same.children ||= [], n.children); continue; }
    renameAll(n); into.push(n); const walk = m => { if (m.shape && (m.shape.type === 'box' || m.shape.type === 'quad') && m.shape.visible !== false) added.push([m, m.shape.textureLayout || {}]); for (const c of m.children || []) walk(c); }; walk(n); } };
  const count = boxesOf(ED.model).length, before = JSON.stringify(ED.model), canvasW0 = ED.canvas.width, canvasH0 = ED.canvas.height;
  const incoming = []; { const walk = m => { if (m.shape && (m.shape.type === 'box' || m.shape.type === 'quad') && m.shape.visible !== false) incoming.push(m); for (const c of m.children || []) walk(c); }; src.model.nodes.forEach(walk); }
  if (count + incoming.length > assets.MAX_BOXES) throw new Error(`Limit is ${assets.MAX_BOXES} parts`);
  merge(ED.model.nodes, src.model.nodes);
  // room on this item's texture for each new box (the texture grows when it must), then their paint is copied across in one step
  let used = fig.usedRects(JSON.parse(before)); const lays = [];   // the free room counts this item's own parts and the new ones already placed (not their old spots)
  for (const [n] of added) { ED.rects = used; let lay = allocLayout(n.shape);
    while (!lay && (ED.canvas.width < ED.canvas.height ? growWider() || growTexture() : growTexture() || growWider())) { ED.rects = used; lay = allocLayout(n.shape); }
    if (!lay) { ED.model = JSON.parse(before); ED.rects = fig.usedRects(ED.model); throw new Error('Texture full'); }
    lays.push(lay); n.shape.textureLayout = lay; used = used.concat(fig.usedRects({ nodes: [{ ...n, children: [] }] })); }
  const S = src.canvas.getContext('2d').getImageData(0, 0, src.canvas.width, src.canvas.height), SW = S.width, SH = S.height, sd = S.data;
  recordShape(before);
  ED.painter.write((d, W, H) => { added.forEach(([n, from], i) => { const to = lays[i]; for (const [fc, fu, fv] of faceDims(n.shape)) { const a = to[fc], b = from[fc]; if (!a || !b) continue;
    for (let v = 0; v < fv; v++) for (let u = 0; u < fu; u++) { const [dx, dy] = texelAt(a, u, v), [sx, sy] = texelAt(b, u, v); if (dx < 0 || dy < 0 || dx >= W || dy >= H || sx < 0 || sy < 0 || sx >= SW || sy >= SH) continue;
      const j = (dy * W + dx) * 4, k = (sy * SW + sx) * 4; d[j] = sd[k]; d[j + 1] = sd[k + 1]; d[j + 2] = sd[k + 2]; d[j + 3] = sd[k + 3]; } } }); });
  ED.hist.push({ k: 'g', parts: ED.hist.splice(-2) }); shapeChanged();
  if (added.length) { const k = boxesOf(ED.model).findIndex(b => b.node === added[0][0]); if (k >= 0) { ED.box = k; render(); placeGizmo(); const nm = added[0][0].name; setTimeout(() => { const m = ED && st.findMesh(o => o.userData.nodeName === nm); if (m) { st.showMesh(m); placeGizmo(); } }, 200); } }   /* the added item comes in picked and in view */
}
async function combinePick() { if (ED?.model && boxesOf(ED.model).length >= assets.MAX_BOXES) return say(`Limit is ${assets.MAX_BOXES} parts`, true);   // types down the left (hovering one shows its items at once), item pictures on the right
  const slots = game.FIELDS.filter(f => CAT.items[f]?.length);
  let cur_ = slots.includes(combinePick.last) ? combinePick.last : slots.includes('faceAccessory') && ED?.asset.field !== 'faceAccessory' ? 'faceAccessory' : slots[0], chosen = null, hov = 0, shown = null;
  const find = el('input', { type: 'text', placeholder: 'Search', maxLength: 40, autocomplete: 'off' }), grid = el('div', { class: 'cards combinegrid' });
  const fill = (f, force) => { if (f === shown && !force) return; shown = f; const q = find.value.trim().toLowerCase();
    const okE = e => !isTmp(e) && !(!e.custom && paidLocked(e)) && !(ED && e.Id === 'Custom_' + ED.asset.id) && (!q || itemName(e).toLowerCase().includes(q));
    const list = (q ? slots : [f]).flatMap(g => oneEach(CAT.items[g]).filter(okE).map(e => [g, e])).slice(0, 300);   /* a search looks in every type */
    grid.replaceChildren(...list.map(([g, e]) => { const a = e.custom && ASSETS.find(x => 'Custom_' + x.id === e.Id);
      const card = el('button', { type: 'button', class: 'skin' + (chosen && chosen.e === e ? ' on' : ''), title: itemName(e), onclick: () => { cur_ = g; types(); chosen = { f: g, e }; const add = [...$('dlgbtns').children].find(b => b.value === 'yes'); if (add) add.disabled = false; for (const c of grid.children) c.classList.toggle('on', c === card); }, ondblclick: () => { const add = [...$('dlgbtns').children].find(b => b.value === 'yes'); if (add && chosen) add.click(); }, onkeydown: ev => { if (ev.key === 'Enter' && chosen && chosen.e === e) { ev.preventDefault(); const add = [...$('dlgbtns').children].find(b => b.value === 'yes'); if (add) add.click(); } } },
        el('div', { class: 'pic' }, a ? assetThumb(a) : itemThumb(g, e, null, null, true)), el('b', { text: itemName(e) }));
      return card; }));
    if (!list.length) grid.append(el('p', { class: 'blank', text: 'No results' })); grid.scrollTop = 0; };
  const typeList = el('div', { class: 'combinetypes', onpointerleave: () => { clearTimeout(hov); fill(cur_); } });
  const types = () => typeList.replaceChildren(...slots.map(f => el('button', { type: 'button', class: f === cur_ ? 'on' : '', text: LABEL[f],
    onpointerenter: () => { clearTimeout(hov); hov = setTimeout(() => fill(f), 60); }, onclick: () => { clearTimeout(hov); cur_ = f; types(); fill(f); } })));
  find.oninput = () => fill(cur_, true); find.onkeydown = ev => { if (ev.key !== 'Enter') return; ev.preventDefault(); ev.stopPropagation(); const c = chosen ? null : grid.querySelector('.skin'); if (c) c.click(); else if (chosen) [...$('dlgbtns').children].find(b => b.value === 'yes')?.click(); };   /* Enter picks the first result, Enter again adds it */ types(); fill(cur_);
  $('dlg').classList.add('wide');
  const asked = ask('Add item', [find, el('div', { class: 'combinebody' }, typeList, grid)], [{ label: 'Cancel', value: '' }, { label: 'Add', value: 'yes', primary: true }]);
  { const add = [...$('dlgbtns').children].find(b => b.value === 'yes'); if (add) add.disabled = true; }
  setTimeout(() => typeList.querySelector('button.on')?.scrollIntoView({ block: 'nearest' }), 0);   /* the remembered type is in view */
  const v = await asked.finally(() => $('dlg').classList.remove('wide'));
  if (v !== 'yes' || !chosen) return; combinePick.last = chosen.f;
  document.body.classList.add('busy'); try { await combineWith(chosen.f, chosen.e); } finally { document.body.classList.remove('busy'); }
}
function onCentre(n) { const m = st.findMesh(o => o.userData.nodeName === n.name); if (!m) return Math.abs((n.position?.x ?? 0) + (n.shape.offset?.x ?? 0)) < 0.25;
  m.geometry.computeBoundingBox(); const bb = m.geometry.boundingBox, lo = bb.min.clone(), hi = bb.max.clone(); m.localToWorld(lo); m.localToWorld(hi);
  let root = m; while (root.parent && root.parent.type !== 'Scene') root = root.parent; const r = m.position.clone(); root.getWorldPosition(r);
  const cx = (lo.x + hi.x) / 2 - r.x; return Math.abs(cx) < 0.25; }
function addBox(kind = 'dup', at = null) { say('');   // 'dup' a copy, 'mirror' a copy on the other side, 'add' a new 4-block box; each gets its own room on the texture
  const boxes = boxesOf(ED.model), b = boxes[ED.box || 0]; if (!b) return; if (boxes.length >= assets.MAX_BOXES) return say(`Limit is ${assets.MAX_BOXES} parts`, true);
  const n = b.node, sh = n.shape;
  const into = kind === 'mirror' ? twinParentOf(b.parent) : null;   // a box on the left arm gets its copy on the right arm
  if (kind === 'mirror' && twinOf(b)) return say('Already mirrored', true);
  if (kind === 'mirror' && !into && onCentre(n))   /* the copy would overlap the original (measured on the body, not in the part's own frame) */ return say('Part is on the centre line', true);
  let paint = null, full = false;
  shapeEdit(() => { const label = kind === 'add' ? nextBoxName() : copyLabel(boxLabel(n), kind === 'mirror'), copy = structuredClone({ ...n, children: [] }), cs = copy.shape; copy.name = 'Box_' + Math.random().toString(36).slice(2, 7); cs.offset = { x: 0, y: 0, z: 0, ...cs.offset };
    if (kind === 'mirror') mirrorNode(n, copy); else if (kind === 'add' && at) { cs.type = 'box'; cs.settings = { ...cs.settings, normal: undefined, size: { x: 4, y: 4, z: 4 } };   // always a solid box, even when started from a flat part
      cs.stretch = { x: 1, y: 1, z: 1 }; const r = v => Math.round(v * 2) / 2;
      const o = { x: at.point.x + at.normal.x * 2, y: at.point.y + at.normal.y * 2, z: at.point.z + at.normal.z * 2 }, q = n.orientation || { x: 0, y: 0, z: 0, w: 1 }, p = n.position || { x: 0, y: 0, z: 0 };
      const ix = q.w * o.x + q.y * o.z - q.z * o.y, iy = q.w * o.y + q.z * o.x - q.x * o.z, iz = q.w * o.z + q.x * o.y - q.y * o.x, iw = -q.x * o.x - q.y * o.y - q.z * o.z;
      copy.position = { x: r(p.x + ix * q.w - iw * q.x - iy * q.z + iz * q.y), y: r(p.y + iy * q.w - iw * q.y - iz * q.x + ix * q.z), z: r(p.z + iz * q.w - iw * q.z - ix * q.y + iy * q.x) }; cs.offset = { x: 0, y: 0, z: 0 }; }
    else if (kind === 'add') { const front = (sh.offset?.z ?? 0) + Math.abs(sh.settings?.size?.z ?? 0) / 2 * (n.shape?.stretch?.z || 1); cs.type = 'box'; cs.settings = { ...cs.settings, normal: undefined, size: { x: 4, y: 4, z: 4 } }; cs.stretch = { x: 1, y: 1, z: 1 }; cs.offset.z = front + 2; } else cs.offset.x += 2;
    if (!(kind === 'add' && at)) { const o = cs.offset, q = copy.orientation || { x: 0, y: 0, z: 0, w: 1 }, p = copy.position || { x: 0, y: 0, z: 0 }, r = v => Math.round(v * 100) / 100;   // the copy turns about its own middle, not the part it came from
      const ix = q.w * o.x + q.y * o.z - q.z * o.y, iy = q.w * o.y + q.z * o.x - q.x * o.z, iz = q.w * o.z + q.x * o.y - q.y * o.x, iw = -q.x * o.x - q.y * o.y - q.z * o.z;
      copy.position = { x: r(p.x + ix * q.w - iw * q.x - iy * q.z + iz * q.y), y: r(p.y + iy * q.w - iw * q.y - iz * q.x + ix * q.z), z: r(p.z + iz * q.w - iw * q.z - ix * q.y + iy * q.x) }; cs.offset = { x: 0, y: 0, z: 0 }; }
    if (copy.position) for (const a of ['x', 'y', 'z']) copy.position[a] = Math.max(-64, Math.min(64, copy.position[a] ?? 0));   /* copies never wander past the Place limits */
    const lay = allocLayout(cs) || (growAny() ? allocLayout(cs) : null) || (growAny() ? allocLayout(cs) : null); if (lay) { cs.textureLayout = lay; paint = paintFaces(cs, lay, sh.textureLayout, kind === 'mirror', kind === 'add' ? hexRgb(standOut(ED.painter.color)) : null); } else { full = true; return; }   /* no room: no part is added */
    if (into) (into.children ||= []).push(copy); else (b.parent ? b.parent.children : ED.model.nodes).push(copy); ED.box = boxesOf(ED.model).findIndex(x => x.node === copy);
    ED.asset = { ...ED.asset, labels: { ...(ED.asset.labels || {}), [copy.name]: label } }; });
  if (full) { const e = ED.hist.pop(); if (e && e.k === 's') ED.model = JSON.parse(e.other); shapeChanged(); return say('Texture full', true); }
  if (paint) { ED.painter.write(paint); ED.hist.push({ k: 'g', parts: ED.hist.splice(-2) }); render(); }
}
// parts painted from one shared spot each get their own spot (paint copied, so nothing looks different): the texture then matches the parts list
function splitShared() { if (ED.splitDone || ED.asset.split) return; ED.splitDone = true; ED.asset = { ...ED.asset, split: true }; const keep = ED.box || 0, seen = new Set(); let n = 0;
  boxesOf(ED.model).forEach((b, k) => { const cells = rs => rs.flatMap(r => { const o = []; for (let y = Math.floor(r.y); y < Math.ceil(r.y + r.h); y++) for (let x = Math.floor(r.x); x < Math.ceil(r.x + r.w); x++) o.push(x + ',' + y); return o; }), keys = cells(fig.usedRects({ nodes: [{ ...b.node, children: [] }] })); if (!keys.length) return;   /* any texel another part already uses */   /* any face on a spot another part already uses */
    if (keys.some(q => seen.has(q))) { ED.box = k; if (ownArea(true)) { n++; cells(fig.usedRects({ nodes: [{ ...boxesOf(ED.model)[k].node, children: [] }] })).forEach(q => seen.add(q)); return; } } keys.forEach(q => seen.add(q)); });
  ED.box = keep; if (n) render(); }
function ownArea(quiet) {   // move the selected box's paint to free room of its own, so it no longer shares texels with other boxes
  const b = curBox(); if (!b) return false; const sh = b.node.shape, old = structuredClone(sh.textureLayout || {}), lay = allocLayout(sh) || (growAny() ? allocLayout(sh) : null) || (growAny() ? allocLayout(sh) : null);
  if (!lay) { if (!quiet) say('Texture full', true); return false; }
  { const fs = Object.keys(old), same = (p, q) => p && q && (p.offset?.x ?? 0) === (q.offset?.x ?? 0) && (p.offset?.y ?? 0) === (q.offset?.y ?? 0) && ((p.angle | 0) % 360) === ((q.angle | 0) % 360);   /* faces that shared one area in the game's layout share one area again (both gloves end up alike) */
    for (let i = 0; i < fs.length; i++) for (let j = 0; j < i; j++) { const A = old[fs[j]], B = old[fs[i]], An = lay[fs[j]], pair = { front: 'back', back: 'front', left: 'right', right: 'left', top: 'bottom', bottom: 'top' }; if (pair[fs[i]] !== fs[j] || !An || !lay[fs[i]] || !same(A, B)) continue;   /* only opposite faces, which are the same size */
      lay[fs[i]] = { ...An, offset: { ...An.offset }, mirror: { x: !!An.mirror?.x !== (!!A.mirror?.x !== !!B.mirror?.x), y: !!An.mirror?.y !== (!!A.mirror?.y !== !!B.mirror?.y) } }; break; } }
  shapeEdit(() => { sh.textureLayout = lay; }); ED.painter.write(paintFaces(sh, lay, old, false, null)); ED.hist.push({ k: 'g', parts: ED.hist.splice(-2) }); render();
  return true;
}
// ---- a move playing while you work (paused while a gizmo is out, so the handles stay on the box)
function animChoices() { const have = k => { const [g, n] = k.split('/'); return (CAT.anims[g] || []).includes(n); };
  return [...new Set(['Default/Idle', 'Default/Walk', 'Default/Run', 'Default/Crouch', ...(EMOTES || [])])].filter(have); }
function wsAnim() {
  if (!ED || !st) return; const want = ED.mode === 'shape' && ['move', 'resize', 'rotate'].includes(ED.stool) ? null : ED.anim || null;
  if (want === ED.animOn) return; ED.animOn = want;
  if (!want) { clearTimeout(onceT); st.anim.set(null); st.anim.setMove(null); } else { const [g, n] = want.split('/'); playAnim(g, n, 1); }
}
const animPicker = () => el('select', { class: 'wsanim', 'aria-label': 'Move', onchange: e => { ED.anim = e.target.value || null; wsAnim(); } },
  el('option', { value: '', text: 'Still', selected: !ED.anim }), animChoices().map(k => el('option', { value: k, text: nice(k.split('/')[1]), selected: ED.anim === k })));

function panelCreator() {
  if (!ED) { const worn = game.FIELDS.filter(f => cur.skin[f] && R.find(f, cur.skin[f]));   /* a haircut under a hood still counts */
    const paidIn = f => { const it = R.find(f, cur.skin[f]), b = it && it.custom ? CAT.items[f].find(e => e.Id === it.baseId) : it; return b && paidLocked(b); };
    const tile = f => { const it = R.find(f, cur.skin[f]), p = parse(cur.skin[f]), paid = paidIn(f);
      return el('div', { class: 'skin starttile' + (paid ? ' paid' : '') }, el('div', { class: 'pic' }, itemThumb(f, it, p.color, p.variant)), el('b', { text: itemName(it) }), el('small', { text: LABEL[f] }),
        paid ? el('small', { class: 'dim', text: 'Paid' }) : it.custom ? el('div', { class: 'acts' }, el('button', { class: 'mini', text: 'Edit', onclick: guard(() => { const a = ASSETS.find(x => 'Custom_' + x.id === it.Id); if (!a) throw new Error('That custom item is gone.'); return openAsset(a); }) }),
          el('button', { class: 'mini', text: 'Copy', onclick: () => newAsset(f) }))
        : el('button', { class: 'mini', text: 'Edit a copy', onclick: () => newAsset(f) })); };
    return [head('Creator'), el('div', { class: 'pbody' },
      el('h3', { text: 'Your outfit' }), el('div', { class: 'cards' }, worn.map(tile)), anyItem(),
      el('h3', { text: `My items ${ASSETS.length}/${assets.MAX}` }),
      ASSETS.length ? el('div', { class: 'cards' }, ASSETS.map(assetCard)) : el('p', { class: 'blank', text: 'No items' }))]; }
  return [];
}

// ---------------------------------------------------------------- wiring
for (const b of $('tabs').children) b.onclick = () => setTab(b.dataset.tab);
document.addEventListener('click', e => { const a = e.target.closest('a[data-tab]'); if (a) { e.preventDefault(); if (R) setTab(a.dataset.tab); else ask('How this works', el('p', { text: 'The editor reads the character files from your own Assets.zip and keeps them in this browser only. Nothing is uploaded, and this site hosts no Hytale files.' }), [{ label: 'OK', value: '', primary: true }]); } });
$('undo').onclick = () => step(-1); $('redo').onclick = () => step(1);
const unsavedOk = go => { if (!(flush.stuck && dirty)) return go(); ask('Not saved', el('p', { text: `My skins is full (${store.CUSTOM_MAX}), so this look isn't saved.` }), [{ label: 'Cancel', value: '' }, { label: 'Discard', value: 'yes', danger: true }]).then(v => { if (v === 'yes') { flush.stuck = false; dirty = false; go(); } }); };   // New and Randomize ask first too
$('random').onclick = () => unsavedOk(randomNow); function randomNow() { if (cur.id && !cur.random) {   // another roll right after one replaces that look in place (no pile of saved skins)
   flush(); cur = { id: null, kind: null, slot: null, name: '', skin: cur.skin }; hist = [JSON.stringify(cur.skin)]; hpos = 0; dirty = false; }   // never overwrites a saved look
  setSkin(R.random(e => !e.custom && !isTmp(e)), true); };
$('new').onclick = () => unsavedOk(() => { flush(); cur = { id: null, kind: null, slot: null, name: '', skin: R.blank() }; hist = [JSON.stringify(cur.skin)]; hpos = 0; dirty = false; keepDraft(); rebuild(); render(); });
$('front').onclick = () => st.view(true);
$('ingame').onclick = async () => { SHOWGAME = !SHOWGAME; await db.put('meta', 'showInGame', SHOWGAME).catch(() => {}); drawGameSwitch(); pushWearing(); say(SHOWGAME ? 'Showing in game' : 'Your own skin is back in game'); };
$('save').onclick = save; $('saveas').onclick = saveAs;
addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && !ED) { e.preventDefault(); flush(); return; }   /* Ctrl+S saves now instead of saving the web page */
  if (!R || e.target?.matches?.('input, textarea, select') || $('dlg').open) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); step(e.shiftKey ? 1 : -1); } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); step(1); } });

// one tab at a time: a newly opened tab asks the others to save and step aside, so two tabs never write over each other
let ASIDE = false; const TAB_ID = Math.random().toString(36).slice(2), TABS = 'BroadcastChannel' in self ? new BroadcastChannel('skin-editor-tabs') : null;
let READY = false, HANDING = false; const BORN = Date.now();
for (const ev of ['keydown', 'pointerdown', 'wheel']) addEventListener(ev, e => { if (ASIDE || HANDING) { e.stopImmediatePropagation(); if (ev !== 'wheel') e.preventDefault(); } }, { capture: true, passive: false });   /* a tab handing off or stepped aside takes no edits */
const stepAside = () => { ASIDE = true; HANDING = false; try { if ($('dlg').open) $('dlg').close(''); } catch { /* no dialog */ } if (document.querySelector('.elsewhere')) return;
  document.body.append(el('div', { class: 'elsewhere' }, el('div', { class: 'elsebox' }, el('b', { text: 'Open in another tab' }), el('button', { class: 'btn primary', text: 'Use here', onclick: () => location.reload() })))); };
if (TABS) TABS.onmessage = async e => { const m = e.data || {}; if (!m.hi || m.hi === TAB_ID || ASIDE || HANDING) return;
  if (!READY) { if ((m.t || 0) > BORN) stepAside(); return; }   /* still starting: nothing loaded to save; the older starter wins */
  HANDING = true; TABS.postMessage({ wait: m.hi }); try { document.activeElement?.blur?.(); } catch { /* typed names commit on blur */ }
  clearTimeout(queueAssetSave.t); clearTimeout(autosave.t); try { if (ED) await flushAsset(); if (ED && ED.before) cur.skin = keptSkin(); dirty = dirty || !!ED; await flush(); await db.put('meta', 'draft', { id: cur.id, kind: cur.kind, slot: cur.slot, name: cur.name, skin: cur.skin, auto: !!cur.auto, random: !!cur.random, t: Date.now() }); } catch (err) { console.error(err); }
  if (ED && ED.saved === false) rescue();   /* a save that failed still leaves a rescue copy */
  stepAside(); TABS.postMessage({ bye: m.hi }); };
const claimTab = () => !TABS ? Promise.resolve() : new Promise(ok => { let t = setTimeout(done, 120); function done() { clearTimeout(t); TABS.removeEventListener('message', on); ok(); } function on(e) { if (e.data?.wait === TAB_ID) { clearTimeout(t); t = setTimeout(done, 15000); } if (e.data?.bye === TAB_ID) done(); } TABS.addEventListener('message', on); TABS.postMessage({ hi: TAB_ID, t: BORN }); });   /* another tab answers 'wait' at once, then 'bye' once saved */
(async function boot() {
  try { await claimTab();
    // Local development only: read the developer's own Assets.zip through the dev server (dev/ is never deployed).
    if ((['localhost', '127.0.0.1'].includes(location.hostname) || location.hostname.endsWith('.localhost')) && new URLSearchParams(location.search).has('devzip') && ((await game.status())?.v || 0) < game.FILES_V)   // dev: read again whenever the file list grows
      { const { devSource } = await import('../dev/devsource.js'); showConnect(); return doConnect(async () => game.importFrom(await devSource(), { name: 'Assets.zip (dev)', size: 0, modified: 0 }, progress)); }
    if (await game.status()) { await startApp(); checkGameUpdate().then(trimThumbs); } else showConnect();
  } catch (e) { console.error(e); showConnect(); $('connerr').textContent = 'This browser blocked local storage, which the editor needs. Try a normal (not private) window.'; }
})();
