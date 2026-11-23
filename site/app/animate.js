// The Animate tab: make player animations in the game's own format. A library of your animations, and the editor: pick a bone
// (list or click on the model), turn or move it with the gizmo or the number fields, keys on a timeline, undo, save.
import * as A from './anim.js';
import { pickList } from './picklist.js';
import * as db from './db.js';
import * as game from './game.js';
import * as store from './store.js';
import * as THREE from '../vendor/three.module.min.js';

const R2D = 180 / Math.PI, D2R = Math.PI / 180;
const r1 = v => Math.round(v * 10) / 10;

// quaternion <-> Euler XYZ in degrees (what the fields show), without three.js
function toEuler(q) {
  const { x, y, z, w } = q; const sy = 2 * (w * y - z * x);
  const ex = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)), ey = Math.abs(sy) >= 1 ? Math.sign(sy) * Math.PI / 2 : Math.asin(sy), ez = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
  return [ex * R2D, ey * R2D, ez * R2D];
}
function fromEuler(ex, ey, ez) {   // X then Y then Z (the inverse of toEuler)
  const [hx, hy, hz] = [ex * D2R / 2, ey * D2R / 2, ez * D2R / 2], cx = Math.cos(hx), sx = Math.sin(hx), cy = Math.cos(hy), sy = Math.sin(hy), cz = Math.cos(hz), sz = Math.sin(hz);
  return { x: sx * cy * cz - cx * sy * sz, y: cx * sy * cz + sx * cy * sz, z: cx * cy * sz - sx * sy * cz, w: cx * cy * cz + sx * sy * sz };
}

export function createAnimate(ctx) {
  const { el, st, render, say, ask, head, nice } = ctx, CATS = () => ctx.cat() || {};
  let GAMEANIMS = null; let AN = null, LIB = null, RIG = null, mode = 'rotate', ghostsOn = false;
  // simple mode (the default): the figure, the pose strip and a few buttons; "More tools" shows the rest
  const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } }, lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* private window */ } };
  let simple = lsGet('se_anim_simple') !== '0', startMode = null, guideStep = lsGet('se_anim_guide') ? -1 : 0;
  const friendly = b => { const s = String(b).replace(/^([LR])[-_]/, (m, c) => c === 'L' ? 'Left ' : 'Right ').replace(/[-_]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim().toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); };   // R-Forearm -> Right forearm
  const secs = f => (f / 60).toFixed(f % 6 ? 2 : 1).replace(/\.?0+$/, '') + ' s';
  const GUIDE = ['Click a body part on the figure.', 'Drag the rings to turn it. That is a pose.', 'Click later on the pose strip, pose again, then press Play.'];
  function guideNext() { guideStep++; if (guideStep >= GUIDE.length) guideEnd(); else render(); }
  function guideEnd() { guideStep = -1; lsSet('se_anim_guide', '1'); render(); }
  function guideBox() { if (guideStep < 0 || guideStep >= GUIDE.length) return null;
    return el('div', { class: 'animguide', role: 'note' }, el('b', { text: `${guideStep + 1}/${GUIDE.length}` }), el('span', { text: GUIDE[guideStep] }),
      el('button', { class: 'mini', text: guideStep < GUIDE.length - 1 ? 'Next' : 'Got it', onclick: guideNext }), el('button', { class: 'linkbtn', text: 'Skip', onclick: guideEnd })); }
  // poses: every frame with a key is a pose of the whole figure
  function addPose() { const f = frame(), bones = [...new Set([...poseBones(), ...(AN.bone ? [AN.bone] : [])])]; if (!bones.length) { say('Click a body part on the figure first'); return; }
    step(); for (const b of bones) { const p = pose(b); if (!p || A.TRACKS.some(k => A.keyAt(AN.a, b, k, f))) continue; const g = group(b), q = g.userData.rest.q.clone().invert().multiply(g.quaternion);
      setPose(b, 'orientation', { x: q.x, y: q.y, z: q.z, w: q.w }); if ((AN.a.nodeAnimations[b]?.position || []).length || p.pos.some(v => Math.abs(v) > 1e-6)) setPose(b, 'position', { x: p.pos[0], y: p.pos[1], z: p.pos[2] }); }
    if (guideStep === 2) { guideStep = -1; lsSet('se_anim_guide', '1'); } show(); queueSave(); runChecks(); render(); }
  function removePose() { const f = frame(), bones = poseBones().filter(b => A.TRACKS.some(k => A.keyAt(AN.a, b, k, f))); if (!bones.length) return; step();
    for (const b of bones) { dropHolds(b, f, true); for (const k of A.TRACKS) A.deleteKey(AN.a, b, k, f); } show(); queueSave(); runChecks(); render(); }
  // the pose strip: a small picture of the whole figure at each pose, placed by time; drag one to retime it, click to go there
  const shots = new Map(); let shotGen = 0;
  function poseTrack() { const a = AN.a, n = Math.max(1, a.duration), times = A.keyTimes(a), f = frame(), many = times.length > 16;
    const track = el('div', { class: 'posetrack' + (many ? ' many' : ''), 'aria-label': 'Poses' }), head_ = el('div', { class: 'posehead' }), pct = t => (t / n) * 100;
    const seek = t => { st.anim.playing = false; st.anim.t = Math.max(0, Math.min(n, t)); show(); refreshBox(); };
    track.onpointerdown = e => { if (e.target.closest('.posecard')) return; const r = track.getBoundingClientRect(); seek(Math.round((e.clientX - r.left) / r.width * n)); render(); };
    const cards = times.map((t, i) => { const prev = times[i - 1] ?? -1, next = times[i + 1] ?? n + 1, img = el('img', { alt: '', draggable: false }), lab = el('small', { text: secs(t) });
      const c = el('button', { class: 'posecard' + (t === f ? ' on' : ''), title: secs(t), 'aria-label': 'Pose at ' + secs(t) }, many ? null : img, many ? null : lab); c.style.left = pct(t) + '%';
      let drag = null;
      c.onpointerdown = e => { e.preventDefault(); drag = { x: e.clientX, t, moved: false }; c.setPointerCapture?.(e.pointerId); };
      c.onpointermove = e => { if (!drag) return; const r = track.getBoundingClientRect(), nt = Math.max(prev + 1, Math.min(next - 1, Math.round((e.clientX - r.left) / r.width * n))); if (Math.abs(e.clientX - drag.x) > 3) drag.moved = true; if (!drag.moved) return; drag.to = nt; c.style.left = pct(nt) + '%'; lab.textContent = secs(nt); };
      c.onpointerup = () => { const d = drag; drag = null; if (!d) return; if (!d.moved || d.to === undefined || d.to === t) { seek(t); render(); return; }
        step(); A.moveKeys(a, Object.keys(a.nodeAnimations), t, d.to); st.anim.t = d.to; show(); queueSave(); runChecks(); render(); };
      if (!many) { const k = `${AN.id}|${AN.rev || 0}|${t}`; if (shots.has(k)) img.src = shots.get(k); else img.dataset.want = k; img.dataset.t = String(t); }
      return c; });
    track.append(...cards, head_);
    const tick = () => { if (!track.isConnected || !AN) return; head_.style.left = pct(st.anim.t) + '%'; requestAnimationFrame(tick); }; requestAnimationFrame(tick);
    const gen = ++shotGen; setTimeout(async () => { for (const img of track.querySelectorAll('img[data-want]')) { if (gen !== shotGen || !img.isConnected || !AN) return; try { const url = await ctx.poseShot?.(AN.a, +img.dataset.t); if (url) { shots.set(img.dataset.want, url); if (shots.size > 200) shots.delete(shots.keys().next().value); img.src = url; } } catch { return; } await new Promise(r => setTimeout(r, 0)); } }, 60);   /* pictures one at a time, after the panel is drawn */
    return el('div', { class: 'posestrip' }, track, el('div', { class: 'row' }, el('button', { class: 'btn primary', text: 'Add pose', title: 'K', onclick: addPose }), el('button', { class: 'btn ghost', text: 'Remove pose', disabled: !times.includes(f), onclick: removePose }), el('span', { class: 'dim', text: secs(f) + ' / ' + secs(n) }))); }

  // ---- the rig: the player's bones, in the model's own order, with their depth for the list
  async function rig() {
    if (RIG) return RIG; const m = await game.json('Common/Characters/Player.blockymodel'), out = [];
    const walk = (ns, d) => { for (const n of ns || []) { if (n.name && n.name !== 'Origin') out.push({ name: n.name, depth: d }); walk(n.children, n.name && n.name !== 'Origin' ? d + 1 : d); } };
    walk(m.nodes, 0); const body = out.filter(b => !/Eyelid|Eyelash/.test(b.name)); const face = ['Mouth', 'L-Eyebrow', 'R-Eyebrow', 'L-Eyelid-Top', 'R-Eyelid-Top', 'L-Eyelid-Bot', 'R-Eyelid-Bot'].filter(n => !body.some(b => b.name === n)).map(name => ({ name, depth: 1 }));
    return (RIG = [...body, ...face]);   /* the face's bones come from the face model, not the body */
  }
  const group = name => st.anim.figure?.userData.parts.get(name)?.[0] || null;

  // every player animation the game has, sub-folders too (Expressions/Talk, Poses/Hero, Damage ...), by folder
  async function gameAnims() { const out = {}; for (const k of await db.keys('files')) { const m = /^Common\/Characters\/Animations\/(.+)\/([^/]+)\.blockyanim$/.exec(k); if (!m || /^Items\//.test(m[1]) || /_FPS$/.test(m[2])) continue; (out[m[1]] ||= []).push(m[2]); }
    for (const g in out) out[g].sort(); GAMEANIMS = out; }
  // ---- library (meta store, key anim:<id>)
  async function loadLib() { await rescue().catch(() => {}); const ks = (await db.keys('meta')).filter(k => String(k).startsWith('anim:')); LIB = (await Promise.all(ks.map(k => db.get('meta', k)))).filter(Boolean).sort((a, b) => b.updated - a.updated); }
  async function save(x = AN) { if (!x) return; const there = await db.get('meta', 'anim:' + x.id);
    if (!there && x.saved) { if (AN === x) { AN = null; st.anim.playing = false; st.boneGizmo(null); st.onion(null); ctx.idle?.(); say('Deleted in another tab', true); } await loadLib(); render(); return; }   /* deleted elsewhere: not brought back */
    x.updated = x.saved = Date.now(); x.dirty = false; await db.put('meta', 'anim:' + x.id, { id: x.id, name: x.name, a: x.a, updated: x.updated }); try { localStorage.removeItem('se_anim_rescue'); } catch { /* fine */ } store.syncFolder().catch(() => {}); }   // the skins folder gets it too (for the mod)
  addEventListener('pagehide', () => { if (AN?.dirty) { try { localStorage.setItem('se_anim_rescue', JSON.stringify({ id: AN.id, name: AN.name, a: AN.a, updated: Date.now(), base: AN.saved })); } catch { /* full */ } save(AN).catch(() => {}); } });   /* a reload inside the save delay keeps the edit */
  async function rescue() { let r = null; try { r = JSON.parse(localStorage.getItem('se_anim_rescue') || 'null'); } catch { /* none */ } if (!r || !r.id) return; const there = await db.get('meta', 'anim:' + r.id);
    if (there && (!r.base || there.updated <= r.base)) await db.put('meta', 'anim:' + r.id, { id: r.id, name: r.name, a: A.read(r.a), updated: r.updated }); try { localStorage.removeItem('se_anim_rescue'); } catch { /* fine */ } }
  let saveT = 0; const queueSave = () => { AN.dirty = true; AN.rev = (AN.rev || 0) + 1; clearTimeout(saveT); const x = AN; saveT = setTimeout(() => save(x).catch(e => say(e.message, true)), 500); };

  // ---- editing
  function tidyHolds() { const n = AN.a.duration; for (const tr of Object.values(AN.a.nodeAnimations)) for (const k of A.TRACKS) { const ks = tr[k] || []; for (let i = ks.length - 1; i >= 0; i--) { const c = ks[i]; if (!c.hold) continue; const p = ks[i - 1], nx = ks[i + 1];
      if (!nx && c.time !== n && p && JSON.stringify(p.delta) === JSON.stringify(c.delta)) { c.time = n; continue; }   /* a hold on the last key follows the length */
      if (!p || JSON.stringify(p.delta) !== JSON.stringify(c.delta) || (nx ? nx.time !== c.time + 1 : c.time !== n)) ks.splice(i, 1); } ks.sort((x, y) => x.time - y.time); } }   // a Hold copy whose key moved or got a key in between is dropped
  function show() { tidyHolds(); const sa = st.anim; sa.anim = AN.a; sa.blend = 1; sa.resting = false; sa.apply(); placeGizmo(); ghosts(); runChecks(); }
  function ghosts() { if (!ghostsOn || !AN) { st.onion(null); return; } const f = frame(), ts = A.keyTimes(AN.a, AN.bone && AN.a.nodeAnimations[AN.bone] ? AN.bone : undefined);   // the keys either side of this frame (of the picked bone, if it has any)
    const before = [...ts].reverse().find(t => t < f), after = ts.find(t => t > f); st.onion([before ?? null, after ?? null]); }
  const frame = () => Math.max(0, Math.min(AN.a.duration, Math.round(st.anim.t)));
  function step() { AN.hist.push(JSON.stringify(AN.a)); let bytes = AN.hist.reduce((s, x) => s + x.length, 0); while (AN.hist.length > 1 && (AN.hist.length > 200 || bytes > 30e6)) bytes -= AN.hist.shift().length; AN.fut = []; }   /* at most 200 steps and ~60 MB of copies */   // before every change
  function undo(redo) { const from = redo ? AN.fut : AN.hist, to = redo ? AN.hist : AN.fut; if (!from.length) return; to.push(JSON.stringify(AN.a)); AN.a = JSON.parse(from.pop()); show(); queueSave(); render(); }
  async function open(id) { const rec = await db.get('meta', 'anim:' + id); if (!rec) { await loadLib(); render(); return; }   /* always the saved copy, never a stale list entry */
    ikOn = false; AN = { saved: rec.updated, id: rec.id, name: rec.name, a: A.read(rec.a), bone: null, hist: [], fut: [], dirty: false }; st.anim.playing = false; st.anim.t = 0; show(); render(); }
  async function close() { if (recording) return; const x = AN; clearTimeout(saveT); AN = null; if (held) { held = ''; ctx.hold?.('', 'R'); } st.anim.playing = false; st.boneGizmo(null); st.onion(null); ctx.idle?.(); if (x?.dirty) await save(x).catch(e => say(e.message, true)); await loadLib(); render(); }
  async function create(src, name) { await loadLib(); const used = new Set(LIB.map(x => x.name.toLowerCase())); let nm = animName(name || 'My animation') || 'My animation', k = 2; const base = nm; while (used.has(nm.toLowerCase())) nm = animName(base, String(k++));   /* a taken name gets a number */
    const rec = { id: crypto.randomUUID(), name: nm, a: src ? A.read(src) : A.blank(60), updated: Date.now() }; await db.put('meta', 'anim:' + rec.id, rec); store.syncFolder().catch(() => {}); await loadLib(); await open(rec.id); }
  // names: no control or line-break characters, cut on whole characters (an emoji is never split), 60 at most
  function animName(t, suffix) { const s0 = String(t || '').replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u034f\u115f\u1160\u17b4\u17b5\u180e\u2028\u2029\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u2069\u2800\u3164\ufeff\uffa0]/g, '').replace(/(?!\u200d)\p{Cf}/gu, ''), s = /^[\p{M}\s]*$/u.test(s0) ? '' : s0.replace(/\s+/g, ' ').trim(), g = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s)].map(x => x.segment), room = 60 - (suffix ? suffix.length + 1 : 0);
    const cut = g.slice(0, room).join('').replace(/[\u{E0000}-\u{E007F}]/gu, '').trim(); return (cut || (suffix ? 'My animation' : '')) + (suffix ? ' ' + suffix : ''); }   /* nothing left: '' (the caller keeps the old name or uses the default) */
  // a file name Windows accepts: no reserved characters or names, no trailing dot or space
  function fileName(t, ext) { let n = String(t).replace(/[\\/:*?"<>|\u0000-\u001f]/g, '').replace(/[. ]+$/, '').trim(); if (!n) n = 'animation'; if (/^(con|prn|aux|nul|com\d|lpt\d)$/i.test(n)) n += '_'; return n + ext; }
  function download(text, type, name) { const url = URL.createObjectURL(text instanceof Blob ? text : new Blob([text], { type })), a = el('a', { href: url, download: name }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000); }

  // the bone's pose now (interpolated), as the fields show it
  function pose(bone) { const g = group(bone); if (!g) return null; const r = g.userData.rest, q = r.q.clone().invert().multiply(g.quaternion);
    return { rot: toEuler(q), pos: [g.position.x - r.p.x, g.position.y - r.p.y, g.position.z - r.p.z] }; }
  function trackAt(bone, k, f) { const ks = AN.a.nodeAnimations[bone]?.[k] || []; if (!ks.length) return null; let a = null, b = null; for (const x of ks) { if (x.time <= f) a = x; else { b = x; break; } }
    if (!a) return ks[0].delta; if (!b || k !== 'shapeStretch') return a.delta; const u = (f - a.time) / (b.time - a.time || 1), L = c => (a.delta[c] ?? 1) + ((b.delta[c] ?? 1) - (a.delta[c] ?? 1)) * u; return { x: L('x'), y: L('y'), z: L('z') }; }
  // a Hold copy: same pose as the key before it, one frame before the next key (or on the last frame)
  function holdCopyAfter(ks, i) { const k = ks[i], c = ks[i + 1]; if (!k || !c || k.interpolationType !== 'linear' || JSON.stringify(c.delta) !== JSON.stringify(k.delta)) return null; const nx = ks[i + 2]; return (nx && c.time === nx.time - 1) || (!nx && c.time === AN.a.duration) ? c : null; }
  function dropHolds(bone, t, deleting) { const tr = AN.a.nodeAnimations[bone]; if (!tr) return; for (const k of A.TRACKS) { const ks = tr[k] || []; for (let i = ks.length - 1; i >= 0; i--) { const c = holdCopyAfter(ks, i); if (!c) continue; if ((deleting && ks[i].time === t) || (!deleting && ks[i].time < t && c.time > t)) ks.splice(ks.indexOf(c), 1); } } }
  function setPose(bone, part, delta, interp) { if (!A.keyAt(AN.a, bone, part, frame())) dropHolds(bone, frame(), false); if ((part === 'shapeStretch' || part === 'shapeUvOffset') && frame() > 0 && !(AN.a.nodeAnimations[bone]?.[part] || []).some(x => x.time < frame())) A.setKey(AN.a, bone, part, 0, part === 'shapeStretch' ? { x: 1, y: 1, z: 1 } : { x: 0, y: 0 }, 'linear');   /* earlier frames stay at rest */ A.setKey(AN.a, bone, part, frame(), delta, interp || A.keyAt(AN.a, bone, part, frame())?.interpolationType || 'smooth'); show(); queueSave(); }
  function keyNow(bone) { const p = pose(bone), f = frame(); if (!p || A.TRACKS.some(k => A.keyAt(AN.a, bone, k, f))) return; step(); setPose(bone, 'orientation', fromEuler(...p.rot));
    if ((AN.a.nodeAnimations[bone]?.position || []).length || p.pos.some(v => Math.abs(v) > 1e-6)) setPose(bone, 'position', { x: p.pos[0], y: p.pos[1], z: p.pos[2] }); render(); }   /* a position key only for a bone that moves */
  function deleteNow(bone) { const f = frame(); if (!A.TRACKS.some(k => A.keyAt(AN.a, bone, k, f))) return; step(); dropHolds(bone, f, true); for (const k of A.TRACKS) A.deleteKey(AN.a, bone, k, f); show(); queueSave(); render(); }

  // the whole pose at this frame: every bone that moves in this animation (or the selected one), as keys
  let clip = null;
  function poseBones() { return Object.keys(AN.a.nodeAnimations); }   // the bones this animation moves
  function copyPose() { clip = {}; for (const b of poseBones()) { const p = pose(b); if (p) clip[b] = { turns: !!(AN.a.nodeAnimations[b]?.orientation || []).length || p.rot.some(v => Math.abs(v) > 1e-3), orientation: fromEuler(...p.rot), position: { x: p.pos[0], y: p.pos[1], z: p.pos[2] }, moves: !!(AN.a.nodeAnimations[b]?.position || []).length || p.pos.some(v => Math.abs(v) > 1e-6), shapes: Object.fromEntries(['shapeStretch', 'shapeUvOffset', 'shapeVisible'].filter(k => (AN.a.nodeAnimations[b]?.[k] || []).length).map(k => [k, trackAt(b, k, frame())])) }; } render(); }
  function pastePose(mirrored) { if (!clip) return; step();
    if (mirrored) { const targets = new Set([...Object.keys(clip), ...Object.keys(clip).map(A.sideSwap)]); for (const t of targets) { if (!group(t)) continue; const src = clip[A.sideSwap(t)], own = clip[t], d = src ? { orientation: A.mirrorKeyDelta('orientation', src.orientation), position: A.mirrorKeyDelta('position', src.position), moves: src.moves, turns: src.turns } : { orientation: { x: 0, y: 0, z: 0, w: 1 }, position: { x: 0, y: 0, z: 0 }, moves: !!own?.moves, turns: !!own?.turns };
      if (!src && own) for (const k of Object.keys(own.shapes || {})) setPose(t, k, k === 'shapeStretch' ? { x: 1, y: 1, z: 1 } : k === 'shapeUvOffset' ? { x: 0, y: 0 } : true, 'linear');   /* the side left out goes back to rest */
      if (d.turns) A.setKey(AN.a, t, 'orientation', frame(), d.orientation, 'smooth'); if (d.moves) A.setKey(AN.a, t, 'position', frame(), d.position, 'smooth'); for (const [k, v] of Object.entries(src?.shapes || {})) if (v !== null) setPose(t, k, v, 'linear'); } show(); queueSave(); render(); return; }   /* both sides swap; a side that was at rest comes back to rest */
    for (const [b, d] of Object.entries(clip)) { const to = mirrored ? A.sideSwap(b) : b; for (const k of ['orientation', 'position']) { if ((k === 'position' && !d.moves) || (k === 'orientation' && !d.turns)) continue; A.setKey(AN.a, to, k, frame(), mirrored ? A.mirrorKeyDelta(k, d[k]) : d[k], 'smooth'); } for (const [k, v] of Object.entries(d.shapes || {})) if (v !== null) A.setKey(AN.a, to, k, frame(), v, 'linear'); } show(); queueSave(); render(); }   /* moves only for bones that move */
  // this bone's pose on its other side, mirrored (an arm raised on the left becomes the same on the right)
  function toOtherSide(bone) { const other = A.sideSwap(bone), p = pose(bone); if (other === bone || !p || !group(other)) return; step(); const tr = AN.a.nodeAnimations[bone] || {};
    if ((tr.orientation || []).length || p.rot.some(v => Math.abs(v) > 1e-3)) A.setKey(AN.a, other, 'orientation', frame(), A.mirrorKeyDelta('orientation', fromEuler(...p.rot)), 'smooth'); if ((tr.position || []).length || p.pos.some(v => Math.abs(v) > 1e-6)) A.setKey(AN.a, other, 'position', frame(), A.mirrorKeyDelta('position', { x: p.pos[0], y: p.pos[1], z: p.pos[2] }), 'smooth');
    for (const k of ['shapeStretch', 'shapeUvOffset', 'shapeVisible']) if ((AN.a.nodeAnimations[bone]?.[k] || []).length) { const v = trackAt(bone, k, frame()); if (v !== null) setPose(other, k, v, 'linear'); }   /* face shapes go across too (earlier frames stay at rest) */ show(); queueSave(); render(); }
  // loops: the last frame gets the first frame's pose, so the move joins up
  function matchEnds() { const sa = st.anim, keep = sa.t; sa.t = 0; sa.apply(); const first = {}; for (const b of poseBones()) { const p = pose(b); if (p) first[b] = p; } sa.t = keep;
    step(); for (const b of Object.keys(AN.a.nodeAnimations)) for (const k of A.TRACKS) { const ks = AN.a.nodeAnimations[b][k] || []; if (!ks.length) continue;   /* every track that has keys, face shapes too */
      if (first[b] && k === 'orientation') { A.setKey(AN.a, b, k, AN.a.duration, fromEuler(...first[b].rot), 'smooth'); continue; } if (first[b] && k === 'position') { const p = first[b].pos; A.setKey(AN.a, b, k, AN.a.duration, { x: p[0], y: p[1], z: p[2] }, 'smooth'); continue; }
      const k0 = ks.filter(x => x.time <= 0).pop() || ks[0]; A.setKey(AN.a, b, k, AN.a.duration, k0.delta, k0.interpolationType || 'smooth'); }
    show(); queueSave(); render(); }

  // checks, marked on the ruler: pops (a bone turning far faster on one frame than around it), a hand inside the chest or belly,
  // and a loop whose end does not meet its start
  let checkT = 0;
  function runChecks() { clearTimeout(checkT); checkT = setTimeout(() => { if (!AN) return; AN.checks = checks(); const cv = document.querySelector('canvas.timeline'); cv?.redraw?.(); const slot = document.querySelector('.checkslot'); if (slot) slot.replaceChildren(...[checkRow()].filter(Boolean)); }, 250); }
  function checks() {
    const sa = st.anim, fig = sa.figure, keep = sa.t, n = AN.a.duration, bones = Object.keys(AN.a.nodeAnimations).filter(b => group(b)), out = { pops: [], clips: [], seam: false };
    if (!fig || !bones.length) return out; const box = new THREE.Box3(), v = new THREE.Vector3(), prev = new Map(), speed = new Map(bones.map(b => [b, []]));
    const torso = ['Chest', 'Belly'].map(group).filter(g => g && g.userData.mesh), hands = ['L-Hand', 'R-Hand'].map(group).filter(Boolean), feet = ['L-Foot', 'R-Foot'].map(group).filter(Boolean), fp = feet.map(() => []);
    sa.anim = AN.a; sa.blend = 1;
    const stride = Math.max(1, Math.ceil(n / 900)), exact = (b, f0, f1) => { let best = f1, top = -1, prev = null; for (let f = f0; f <= f1; f++) { sa.t = f; sa.apply(); const q = group(b).quaternion.clone(); if (prev) { const d = 2 * Math.acos(Math.min(1, Math.abs(q.dot(prev)))); if (d > top) { top = d; best = f; } } prev = q; } return best; };   /* long animations are sampled, so a check never stalls the page */
    for (let f = 0; f <= n; f += stride) { sa.t = f; sa.apply(); fig.updateMatrixWorld(true);
      for (const b of bones) { const q = group(b).quaternion.clone(), p = prev.get(b); speed.get(b).push(p ? 2 * Math.acos(Math.min(1, Math.abs(q.dot(p)))) * R2D : 0); prev.set(b, q); }
      feet.forEach((g, i) => { g.getWorldPosition(v); fp[i].push([f, v.x, v.y, v.z]); });
      if (torso.length && hands.length) { let inside = false; for (const t of torso) { const tm = t.userData.mesh; tm.geometry.computeBoundingBox(); box.copy(tm.geometry.boundingBox).expandByScalar(-1.5);   /* the torso's own box, in its own space */ for (const h of hands) { if (h.userData.mesh) { new THREE.Box3().setFromObject(h.userData.mesh).getCenter(v); } else h.getWorldPosition(v); tm.worldToLocal(v); if (box.containsPoint(v)) inside = true; } } if (inside) out.clips.push(f); } }
    for (const [b, sp] of speed) for (let f = 1; f < sp.length - 1; f++) { const around = (sp[f - 1] + sp[f + 1]) / 2 + 1; if (sp[f] > 12 * stride && sp[f] > around * 4) { const fr = stride > 1 ? exact(b, (f - 1) * stride, f * stride) : f, held = A.TRACKS.some(k => (AN.a.nodeAnimations[b]?.[k] || []).some(x => x.hold && x.time === fr - 1)); if (!held) out.pops.push(fr); } }   /* only a Hold's own snap is wanted */   /* keys on neighbouring frames are a deliberate snap (Hold) */   /* the exact frame inside a sampled stretch */
    if (!AN.a.holdLastKeyframe) { let worst = 0; sa.t = 0; sa.apply(); const q0 = new Map(bones.map(b => [b, group(b).quaternion.clone()])); sa.t = n; sa.apply(); for (const b of bones) worst = Math.max(worst, 2 * Math.acos(Math.min(1, Math.abs(group(b).quaternion.dot(q0.get(b))))) * R2D);
      { sa.t = 0; sa.apply(); const p0 = new Map(bones.map(b => [b, group(b).position.clone()])); sa.t = n; sa.apply(); for (const b of bones) if (group(b).position.distanceTo(p0.get(b)) > 1) worst = Math.max(worst, 99); }   /* a bone that moves away and doesn't come back */
      const val = (b, k, t) => { const ks = AN.a.nodeAnimations[b]?.[k] || []; let v = null; for (const x of ks) if (x.time <= t) v = x.delta; return v === null ? (ks[0]?.delta ?? null) : v; };
      const shapes = Object.keys(AN.a.nodeAnimations).some(b => ['shapeUvOffset', 'shapeStretch', 'shapeVisible'].some(k => (AN.a.nodeAnimations[b][k] || []).length && JSON.stringify(val(b, k, 0)) !== JSON.stringify(val(b, k, n))));
      out.seam = worst > 8; void shapes; }
    const pel = group('Pelvis'), yaws = []; if (pel) for (let f = 0; f <= n; f += Math.max(stride, 5)) { sa.t = f; sa.apply(); const e = new THREE.Euler().setFromQuaternion(pel.quaternion, 'YXZ'); yaws.push(e.y); }
    const spins = yaws.length && (Math.max(...yaws) - Math.min(...yaws)) > 0.8, mins = fp.map(pts => Math.min(...pts.map(p => p[2]))), floorless = mins.length === 2 && Math.abs(mins[0] - mins[1]) > 2;   /* a turning figure or no shared floor: feet can't be judged */
    out.slides = []; const cycle = fp.length === 2 && fp.every(pts => { let same = 0, all = 0; const low = Math.min(...pts.map(p => p[2])); for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (a[2] - low < 0.6 && b[2] - low < 0.6) { const dz = b[3] - a[3]; if (Math.abs(dz) > 0.05) { all++; if (dz < 0) same++; } } } return all >= 4 && (same / all > 0.7 || same / all < 0.3); });
    if (!spins && !floorless && cycle) for (const pts of fp) { const low = Math.min(...pts.map(p => p[2])); let prev = -9; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (a[2] - low < 0.2 && b[2] - low < 0.2 && Math.abs(b[1] - a[1]) > 0.6 * stride) { if (prev === i - 1) out.slides.push(a[0], b[0]); prev = i; } } }   /* in a walk loop the foot slides back by design, sideways it shouldn't */
    if (!spins && !floorless && !cycle) for (const [fi, pts] of fp.entries()) { if (pts.length < 2) continue; const other = fp[1 - fi]; const low = Math.min(...pts.map(p => p[2])), moving = Math.max(...pts.map(p => p[2])) - low > 0.5;   /* a foot on the ground (near its lowest) that slides sideways */
      for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (a[2] - low < 0.2 && b[2] - low < 0.2 && Math.abs(b[2] - a[2]) < 0.05 && Math.hypot(b[1] - a[1], b[3] - a[3]) > 0.6 * stride && (moving || Math.hypot(b[1] - a[1], b[3] - a[3]) > 0.8 * stride)) { const oa = other?.[i - 1], ob = other?.[i], together = oa && ob && Math.hypot((ob[1] - oa[1]) - (b[1] - a[1]), (ob[3] - oa[3]) - (b[3] - a[3])) < 0.3; if (together) continue;   /* both feet carried together (the whole body moves) */
          if (pts.prevSlide === i - 1) out.slides.push(a[0], b[0]); pts.prevSlide = i; } } }   /* a slide counts when it lasts two frames or more (a single step is the foot settling) */
    out.slides = [...new Set(out.slides)].sort((x, y) => x - y);
    out.pops = [...new Set(out.pops)].sort((x, y) => x - y); sa.t = keep; sa.apply(); return out;
  }
  // IK: move a hand or foot and the two joints above it turn to reach (written as turn keys on those joints, like posing by hand)
  const CHAIN = { 'R-Hand': ['R-Forearm', 'R-Arm'], 'L-Hand': ['L-Forearm', 'L-Arm'], 'R-Foot': ['R-Calf', 'R-Thigh'], 'L-Foot': ['L-Calf', 'L-Thigh'] };
  let ikOn = false;
  function ikSolve(bone, target) { const end = group(bone), joints = (CHAIN[bone] || []).map(group); if (!end || joints.some(j => !j)) return false; const fig = st.anim.figure, e = new THREE.Vector3(), j = new THREE.Vector3(), q = new THREE.Quaternion(), pq = new THREE.Quaternion();
    { const lower = joints[0], tw = new THREE.Vector3(); fig.updateMatrixWorld(true); end.getWorldPosition(e); joints[1].getWorldPosition(j); lower.getWorldPosition(tw); const a1 = tw.clone().sub(j), a2 = e.clone().sub(tw); if (a1.angleTo(a2) < 0.09) lower.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), /Foot/.test(bone) ? -0.25 : 0.25)); }   /* a straight limb gets a small bend first */
    for (let it = 0; it < 40; it++) { for (const g of joints) { fig.updateMatrixWorld(true); end.getWorldPosition(e); g.getWorldPosition(j); const a = e.clone().sub(j), b = target.clone().sub(j); if (a.lengthSq() < 1e-6 || b.lengthSq() < 1e-6) continue;
        q.setFromUnitVectors(a.normalize(), b.normalize()); const wq = g.getWorldQuaternion(new THREE.Quaternion()); g.parent.getWorldQuaternion(pq); g.quaternion.copy(pq.clone().invert().multiply(q.multiply(wq))); }
      fig.updateMatrixWorld(true); end.getWorldPosition(e); if (e.distanceTo(target) < 0.05) break; }
    for (const g of joints) { const name = CHAIN[bone][joints.indexOf(g)], d = g.userData.rest.q.clone().invert().multiply(g.quaternion); A.setKey(AN.a, name, 'orientation', frame(), { x: d.x, y: d.y, z: d.z, w: d.w }, A.keyAt(AN.a, name, 'orientation', frame())?.interpolationType || 'smooth'); }
    return true; }
  function placeGizmo() { if (!AN || !AN.bone) { st.boneGizmo(null); return; } const g = group(AN.bone); if (!g) { st.boneGizmo(null); return; }
    st.boneGizmo({ g, mode, onChange: (d, end) => { if (end && !gizmoStep) return; if (!gizmoStep) { step(); gizmoStep = true; }   /* a click on the gizmo without a drag is not a change */ const part = Object.keys(d)[0]; if (part === 'position') for (const c of ['x', 'y', 'z']) d[part][c] = Math.max(-256, Math.min(256, d[part][c]));
      if (ikOn && part === 'position' && CHAIN[AN.bone]) { const gg = group(AN.bone), tgt = gg.parent.localToWorld(gg.userData.rest.p.clone().add(new THREE.Vector3(d.position.x, d.position.y, d.position.z))); st.anim.anim = AN.a; st.anim.apply(); ikSolve(AN.bone, tgt); st.anim.apply(); if (end) { gizmoStep = false; if (guideStep === 1) guideStep = 2; queueSave(); placeGizmo(); runChecks(); render(); } return; }   /* IK: the joints turn, the hand is not moved off its arm */ A.setKey(AN.a, AN.bone, part, frame(), d[part], A.keyAt(AN.a, AN.bone, part, frame())?.interpolationType || 'smooth');
      st.anim.anim = AN.a; st.anim.apply(); if (end) { gizmoStep = false; if (guideStep === 1) guideStep = 2; queueSave(); placeGizmo(); runChecks(); render(); } } }); }
  let gizmoStep = false;

  // a click on the model picks the bone it belongs to
  function pickAt(x, y) { if (!AN) return false; const m = st.pickMesh(x, y, () => true); if (!m) return false; const names = new Set((RIG || []).map(b => b.name)), parts = st.anim.figure.userData.parts, owner = new Map(); parts.forEach((gs, k) => gs.forEach(g => owner.set(g, k)));
    for (let o = m; o; o = o.parent) { const k = owner.get(o); if (k && names.has(k) && !/Attachment$/.test(k)) {   /* clicks land on the body bone, not the small attachment points */ AN.bone = k; if (!CHAIN[k]) ikOn = false; if (guideStep === 0) guideStep = 1; placeGizmo(); render(); return true; } } return false; }

  // ---- timeline (one canvas: frame ruler, a row per animated bone, diamonds for keys, the playhead)
  function timeline() {
    const rows = [...new Set([...(AN.bone ? [AN.bone] : []), ...Object.keys(AN.a.nodeAnimations)])], RH = 18, TOP = 18, LW = 92;
    const cv = el('canvas', { class: 'timeline', height: TOP + Math.max(1, rows.length) * RH + 2, tabIndex: 0, 'aria-label': 'Timeline' });
    let W = 0, drag = null;   // the view: frames v0..v1 (the wheel zooms about the pointer, Shift+wheel pans, the playhead stays in view)
    const view = () => { const n = AN.a.duration, v = AN.view || [0, n]; let [a0, a1] = v; a1 = Math.min(n, a1); a0 = Math.max(0, Math.min(a0, a1 - 4)); if (a1 - a0 < 4) a1 = Math.min(n, a0 + 4); return [a0, a1]; };
    const fx = f => { const [a0, a1] = view(); return LW + ((f - a0) / (a1 - a0 || 1)) * (W - LW - 8); }, xf = x => { const [a0, a1] = view(); return Math.round(a0 + ((x - LW) / (W - LW - 8)) * (a1 - a0)); };
    cv.onwheel = e => { e.preventDefault(); const n = AN.a.duration, [a0, a1] = view(), span = a1 - a0, r0 = cv.getBoundingClientRect();
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) { const d = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) / 400 * span, b0 = Math.max(0, Math.min(n - span, a0 + d)); AN.view = [b0, b0 + span]; }
      else { const at = Math.max(a0, Math.min(a1, a0 + ((e.clientX - r0.left - LW) / (W - LW - 8)) * span)), k = Math.exp(e.deltaY / 500), ns = Math.max(8, Math.min(n, span * k)), t = (at - a0) / (span || 1);
        let b0 = at - ns * t; b0 = Math.max(0, Math.min(n - ns, b0)); AN.view = ns >= n ? null : [b0, b0 + ns]; }
      draw(); };
    function draw() { if (!AN) return; W = cv.clientWidth || 300; cv.width = W; const c = cv.getContext('2d'), n = AN.a.duration, now = frame();
      c.fillStyle = '#0d1a2b'; c.fillRect(0, 0, W, cv.height); c.font = '11px system-ui'; c.textBaseline = 'middle';
      { const [a0, a1] = view(); if (AN.view && !drag && now !== AN.lastNow && (now < a0 || now > a1)) { const span = a1 - a0, b0 = Math.max(0, Math.min(n - span, now - span / 2)); AN.view = [b0, b0 + span]; } }   /* the playhead never leaves the view */
      AN.lastNow = now; const [v0, v1] = view(), per = (W - LW - 8) / (v1 - v0 || 1), stepF = [1, 2, 5, 10, 20, 30, 60, 120, 300, 600, 1200].find(s => s * per >= 34) || 1200;   /* labels at least 34 px apart */ for (let f = Math.ceil(v0 / stepF) * stepF; f <= v1; f += stepF) { const x = fx(f); c.fillStyle = '#2a3d58'; c.fillRect(x, TOP, 1, cv.height - TOP); c.fillStyle = '#8aa0ba'; c.fillText(String(f), x + 2, TOP / 2); }
      rows.forEach((b, i) => { const y = TOP + i * RH; c.fillStyle = b === AN.bone ? '#1d3352' : i % 2 ? '#101f33' : '#0f1d30'; c.fillRect(0, y, W, RH); c.fillStyle = b === AN.bone ? '#f4c452' : '#c9d6e6'; c.fillText(b.length > 13 ? b.slice(0, 12) + '…' : b, 4, y + RH / 2);
        for (const t of A.keyTimes(AN.a, b)) { if (t < v0 || t > v1) continue; const x = fx(t), cy = y + RH / 2; c.save(); c.translate(x, cy); c.rotate(Math.PI / 4); c.fillStyle = t === now ? '#f4c452' : '#9fd0ff'; c.fillRect(-4, -4, 8, 8); c.restore(); } });
      const ck = AN.checks; if (ck) { const mark = (f, col) => { if (f < v0 || f > v1) return; c.fillStyle = col; c.fillRect(fx(f) - 1, TOP - 5, 3, 5); };
        ck.clips.forEach(f => mark(f, '#ff9a3c')); (ck.slides || []).forEach(f => mark(f, '#c77dff')); ck.pops.forEach(f => mark(f, '#ff4d5e')); if (ck.seam) { c.fillStyle = '#ff4d5e'; c.fillRect(fx(n) - 4, 0, 4, TOP); } }
      const S = cv.parentElement?.scrollTop || 0; if (S) { c.fillStyle = '#0d1a2b'; c.fillRect(0, S, W, TOP); for (let f = Math.ceil(v0 / stepF) * stepF; f <= v1; f += stepF) { c.fillStyle = '#8aa0ba'; c.fillText(String(f), fx(f) + 2, S + TOP / 2); }
        if (ck) { const mk = (f, col) => { if (f < v0 || f > v1) return; c.fillStyle = col; c.fillRect(fx(f) - 1, S + TOP - 5, 3, 5); }; ck.clips.forEach(f => mk(f, '#ff9a3c')); (ck.slides || []).forEach(f => mk(f, '#c77dff')); ck.pops.forEach(f => mk(f, '#ff4d5e')); if (ck.seam) { c.fillStyle = '#ff4d5e'; c.fillRect(fx(n) - 4, S, 4, TOP); } } }   /* sticky ruler */
      if (now >= v0 && now <= v1) { const px = fx(now); c.fillStyle = '#f4c452'; c.fillRect(px - 1, 0, 2, cv.height); } }
    const at = e => { const r = cv.getBoundingClientRect(), y = e.clientY - r.top, S = cv.parentElement?.scrollTop || 0; return { x: e.clientX - r.left, y: S && y - S < TOP ? y - S : y }; };   /* the ruler stays on top when scrolled */
    cv.onpointerdown = e => { const p = at(e), row = Math.floor((p.y - TOP) / RH), bone = p.y >= TOP ? rows[row] : null; if (p.x < LW) { if (bone) { AN.bone = bone; if (!CHAIN[bone]) ikOn = false; placeGizmo(); render(); } return; }
      const f = Math.max(0, Math.min(AN.a.duration, xf(p.x))), hit = bone && A.keyTimes(AN.a, bone).find(t => Math.abs(fx(t) - p.x) <= 6);
      if (p.y < TOP) { const col = A.keyTimes(AN.a).find(t => Math.abs(fx(t) - p.x) <= 6); if (col !== undefined) { drag = { bones: Object.keys(AN.a.nodeAnimations), from: col, to: col, stepped: false, base: JSON.stringify(AN.a) }; st.anim.t = col; st.anim.playing = false; show(); draw(); cv.setPointerCapture?.(e.pointerId); return; } }   /* on the ruler: a frame that has keys drags all of them */
      if (bone && AN.bone !== bone) { AN.bone = bone; ikOn = false; }
      if (hit !== undefined && hit !== null && bone) { drag = { bone, from: hit, to: hit, stepped: false, base: JSON.stringify(AN.a) }; st.anim.t = hit; } else { st.anim.t = f; drag = { seek: true }; }
      st.anim.playing = false; show(); draw(); cv.setPointerCapture?.(e.pointerId); };
    cv.onpointermove = e => { if (!drag) return; const f = Math.max(0, Math.min(AN.a.duration, xf(at(e).x)));
      if (drag.seek) { st.anim.t = f; show(); draw(); return; }
      if (f !== drag.to) { if (!drag.stepped) { step(); drag.stepped = true; } AN.a = JSON.parse(drag.base); A.moveKeys(AN.a, drag.bones || [drag.bone], drag.from, f);   /* always from where the drag began */ drag.to = f; st.anim.t = f; show(); draw(); } };
    cv.onpointerup = () => { if (drag && drag.stepped) queueSave(); const was = drag; drag = null; if (was) render(); };
    cv.onkeydown = e => { if (e.key === 'Delete' && AN.bone) { e.preventDefault(); deleteNow(AN.bone); return; }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); st.anim.playing = false; st.anim.t = Math.max(0, Math.min(AN.a.duration, frame() + (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 10 : 1))); show(); draw(); refreshBox(); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); const i = Math.max(0, Math.min(rows.length - 1, rows.indexOf(AN.bone) + (e.key === 'ArrowDown' ? 1 : -1))); if (rows[i]) { AN.bone = rows[i]; ikOn = false; placeGizmo(); draw(); refreshBox(); } } };   /* arrows: frames (Shift: 10) and rows */
    requestAnimationFrame(draw); let lastF = -1, wasPlaying = false; const tick = () => { if (!cv.isConnected || !AN) return; const playing = st.anim.playing; if (wasPlaying && !playing) { st.anim.t = Math.round(st.anim.t); st.anim.apply(); }   /* stopped: on a whole frame, so keys land where the playhead shows */
      const f = frame(); if (playing || f !== lastF || wasPlaying) { draw(); if (!playing && (f !== lastF || wasPlaying)) { ghosts(); placeGizmo(); refreshBox(); } lastF = f; } wasPlaying = playing; requestAnimationFrame(tick); };   /* the frame bar moves the playhead, the ghosts and the gizmo too */ requestAnimationFrame(tick); cv.redraw = draw; return cv;
  }

  // ---- panels
  // publishing (needs Sign in with Hytale; hidden until it exists): the server keeps the .blockyanim, your name and your UUID
  let PUBS = null; const loadPubs = async () => { PUBS = (await db.get('meta', 'animpub').catch(() => null)) || {}; };
  function pubBtn(rec) { if (!ctx.canPublish?.()) return ctx.lockedPublish?.() || null; if (!PUBS) { loadPubs().then(render); return null; } const sid = PUBS[rec.id];
    return el('button', { class: 'mini', text: sid ? 'Unpublish' : 'Publish', onclick: async () => { try { const x = await db.get('meta', 'anim:' + rec.id); if (!x) return;
      if (sid) { const r = await fetch('/api/anims/' + encodeURIComponent(sid), { method: 'DELETE', credentials: 'same-origin' }); if (!r.ok && r.status !== 404) throw new Error((await r.json().catch(() => ({}))).error || 'Could not unpublish'); delete PUBS[rec.id]; }
      else { const out = A.write(x.a), keys = Object.values(out.nodeAnimations).reduce((s, tr) => s + A.TRACKS.reduce((t, k) => t + (tr[k] || []).length, 0), 0), size = JSON.stringify({ formatVersion: 1, duration: out.duration, holdLastKeyframe: !!out.holdLastKeyframe, nodeAnimations: out.nodeAnimations }).length;   /* the server's own limits, said plainly before sending */
        if (out.duration > 6000 || Object.keys(out.nodeAnimations).length > 200 || keys > 20000 || size > 590000) throw new Error(`Too big to publish: ${keys.toLocaleString()} keys (${Math.ceil(size / 1024)} KB). Published animations can have up to 6000 frames, 200 bones and about 580 KB of keys.`);
        const r = await fetch('/api/anims', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: x.name, anim: out }) }), j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Could not publish'); PUBS[rec.id] = j.id; }
      await db.put('meta', 'animpub', PUBS); render(); } catch (e) { say(e.message, true); } } }); }
  let gamePick = null;
  const PROPNAME = { battleaxe: 'Battleaxe', wizstaff: 'Wizard staff', staff: 'Staff', block: 'Block', potion: 'Potion', book: 'Spellbook', pickaxe: 'Pickaxe', sword: 'Sword', mace: 'Mace', bow: 'Bow', shield: 'Shield', torch: 'Torch' };
  const curve = d => `<svg viewBox="0 0 28 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  const EASES = [{ value: 'smooth', text: 'Smooth', icon: curve('M2 16 C12 16 16 2 26 2') }, { value: 'linear', text: 'Steady', icon: curve('M2 16 L26 2') }, { value: 'hold', text: 'Snap', icon: curve('M2 16 H19 V2 H26') }];   /* each shows its curve */
  async function createStill(src, name) { await create(src, animName(name, 'pose')); if (!AN) return; const a = AN.a, t = Math.round(a.duration * 0.45); st.anim.t = t; show(); st.anim.apply();
    const out = A.blank(60); for (const [b, tr] of Object.entries(a.nodeAnimations)) { const g = group(b), p = pose(b); if (!g || !p) continue;
      if ((tr.orientation || []).length) { const q = g.userData.rest.q.clone().invert().multiply(g.quaternion); A.setKey(out, b, 'orientation', 0, { x: q.x, y: q.y, z: q.z, w: q.w }, 'smooth'); }
      if ((tr.position || []).length) A.setKey(out, b, 'position', 0, { x: p.pos[0], y: p.pos[1], z: p.pos[2] }, 'smooth');
      for (const k of ['shapeStretch', 'shapeUvOffset', 'shapeVisible']) if ((tr[k] || []).length) { const v = trackAt(b, k, t); if (v != null) A.setKey(out, b, k, 0, v, 'linear'); } }
    AN.a = out; AN.hist = []; st.anim.t = 0; show(); queueSave(); render(); }   // the pose part-way through the move, as a one-pose animation
  function libraryPanel() {
    if (!LIB) { loadLib().then(render); return [head('Animate'), el('div', { class: 'pbody' }, el('p', { class: 'dim', text: 'Loading…' }))]; }
    if (!GAMEANIMS) { gameAnims().then(render); }
    const groups = Object.keys(GAMEANIMS || {}).sort(), label = ctx.label || ((g, n) => nice(n));
    const play = v => { if (!v) { ctx.idle?.(); return; } const [g, n] = v.split('|'); ctx.play?.(g, n); };   /* the figure plays the animation under the pointer */
    const pick = { items: groups.flatMap(g => GAMEANIMS[g].map(n => ({ value: g + '|' + n, text: label(g, n), group: g.split('/').map(nice).join(' / '), icon: ctx.thumb ? () => ctx.thumb(g, n) : null }))) };   /* every game move, with its picture; the figure plays the one under the pointer */
    const card = (k, t, pic, onclick) => el('button', { class: 'startcard' + (startMode === k ? ' on' : ''), onclick }, el('span', { class: 'pic' }, pic || null), el('b', { text: t }));
    const chooser = startMode ? pickList(el, { label: 'Game animation', placeholder: startMode === 'pose' ? 'Pick a move to take a pose from…' : 'Pick a game move…', search: true, value: null, items: pick.items || [],
        onPreview: v => play(v), onChoose: async v => { const [g, n] = v.split('|'), src = await game.json(`Common/Characters/Animations/${g}/${n}.blockyanim`); const m = startMode; startMode = null; if (m === 'pose') await createStill(src, label(g, n)); else await create(src, label(g, n)); } }) : null;
    if (chooser) setTimeout(() => chooser.isConnected && chooser.click(), 0);   /* the list opens at once */
    return [head('Animate'), el('div', { class: 'pbody' },
      el('div', { class: 'startcards' }, card('move', 'Start from a game move', ctx.thumb?.('Default', 'Run'), () => { startMode = startMode === 'move' ? null : 'move'; render(); }),
        card('pose', 'Start from a still pose', ctx.thumb?.('Emote', 'Wave'), () => { startMode = startMode === 'pose' ? null : 'pose'; render(); }),
        card('blank', 'Blank', ctx.thumb?.('Default', 'Idle'), () => { startMode = null; create(null); })),
      chooser,
      el('h3', { text: 'My animations' }),
      LIB.length ? el('div', { class: 'animlib' }, LIB.map(rec => el('div', { class: 'animrow' },
        el('button', { class: 'animopen', onclick: () => open(rec.id) }, el('b', { text: rec.name }), el('small', { text: `${(rec.a.duration / 60).toFixed(2)} s` })),
        pubBtn(rec),
        el('button', { class: 'mini', text: 'Export', onclick: async () => { const x = await db.get('meta', 'anim:' + rec.id); if (x) download(A.write(x.a), 'application/json', fileName(x.name, '.blockyanim')); } }),
        el('button', { class: 'mini', text: 'Delete', onclick: async () => { const x = await db.get('meta', 'anim:' + rec.id); const v = await ask('Delete animation', el('p', { text: `"${x?.name || rec.name}" will be deleted.` }), [{ label: 'Cancel', value: '' }, { label: 'Delete', value: 'yes', danger: true }]); if (v !== 'yes') return; await db.del('meta', 'anim:' + rec.id); store.syncFolder().catch(() => {}); await loadLib(); render(); } }))))
        : el('p', { class: 'dim', text: 'None yet.' }))];
  }
  function editorPanel() {
    const a = AN.a, bones = RIG || [], f = frame();
    const nameIn = el('input', { type: 'text', class: 'wsname', value: AN.name, maxLength: 60, 'aria-label': 'Name', onchange: async e => { const base = animName(e.target.value); if (!base) { e.target.value = AN.name; return; } await loadLib(); const used = new Set(LIB.filter(x => x.id !== AN.id).map(x => x.name.toLowerCase())); let nm = base, k = 2; while (used.has(nm.toLowerCase())) nm = animName(base, String(k++)); AN.name = nm; e.target.value = nm; queueSave(); } });
    const len = el('input', { type: 'number', min: 0.1, max: A.MAX_FRAMES / 60, step: 0.1, value: +(a.duration / 60).toFixed(2), class: 'adjnum', 'aria-label': 'Length in seconds', onchange: e => { const v = Math.round(+e.target.value * 60); if (!(v >= 1)) { e.target.value = +(a.duration / 60).toFixed(2); return; } step(); A.setDuration(a, v); if (st.anim.t > a.duration) st.anim.t = a.duration; show(); queueSave(); render(); document.querySelector('.animedit input[aria-label="Length in seconds"]')?.focus(); } });
    const loop = el('input', { type: 'checkbox', checked: !a.holdLastKeyframe, onchange: e => { step(); a.holdLastKeyframe = !e.target.checked; show(); queueSave(); render(); } });
    const sel = el('div', { class: 'boneslot' }, boneBox());
    const list = boneList(bones);
    return editorShell(a, nameIn, len, loop, sel, list);
  }
  function boneBox() { if (!AN || !AN.bone) return null; const a = AN.a, f = frame();
    const p = pose(AN.bone), hasKey = A.TRACKS.some(k => A.keyAt(a, AN.bone, k, f)); if (!p) return null;
    const ty = AN.typed; if (ty && ty.bone === AN.bone && ty.f === f) { const q = fromEuler(...ty.rot), g = group(AN.bone), rq = g.userData.rest.q.clone().invert().multiply(g.quaternion); if (Math.abs(q.x * rq.x + q.y * rq.y + q.z * rq.z + q.w * rq.w) > 0.9999) p.rot = [...ty.rot]; }   /* the same turn as typed: show the typed numbers */
    const field = (label, v, set, lim) => el('label', { class: 'axf' }, el('span', { text: label }), el('input', { type: 'number', step: 1, 'aria-label': (lim ? 'Move ' : 'Turn ') + label, value: r1(v), onchange: e => { const t = e.target.value.trim(), n = +t; if (!t || !Number.isFinite(n)) { e.target.value = r1(v); return; } step(); set(lim ? Math.max(-lim, Math.min(lim, n)) : n); const all = [...document.querySelectorAll('.bonebox input')], at = all.indexOf(e.target); refreshBox(); document.querySelector('canvas.timeline')?.redraw?.(); if (at >= 0) document.querySelectorAll('.bonebox input')[at]?.focus(); } }));   /* empty or junk puts the old value back */
    return el('div', { class: 'bonebox' },
      el('div', { class: 'row' }, el('b', { text: friendly(AN.bone), title: AN.bone }), !simple && CHAIN[AN.bone] ? el('label', { class: 'chk' }, el('input', { type: 'checkbox', checked: ikOn, onchange: e => { ikOn = e.target.checked; if (ikOn) mode = 'move'; placeGizmo(); refreshBox(); } }), el('span', { text: 'IK' })) : null, el('button', { class: 'mini' + (mode === 'rotate' ? ' on' : ''), text: 'Turn', title: 'R', onclick: () => { mode = 'rotate'; placeGizmo(); render(); } }), el('button', { class: 'mini' + (mode === 'move' ? ' on' : ''), text: 'Move', title: 'G', onclick: () => { mode = 'move'; placeGizmo(); render(); } })),
      simple ? null : el('div', { class: 'xyzrow' }, el('span', { class: 'dim', text: 'Turn' }), ...['X', 'Y', 'Z'].map((k, i) => field(k, p.rot[i], n => { const e = [...p.rot]; e[i] = n; AN.typed = { bone: AN.bone, f: frame(), rot: e };
        const g = group(AN.bone), cur = g.userData.rest.q.clone().invert().multiply(g.quaternion), sh = fromEuler(...p.rot), shq = new THREE.Quaternion(sh.x, sh.y, sh.z, sh.w), res = shq.clone().invert().multiply(cur), nq = fromEuler(...e), out = new THREE.Quaternion(nq.x, nq.y, nq.z, nq.w).multiply(res);   /* what the fields can't show is kept */
        setPose(AN.bone, 'orientation', { x: out.x, y: out.y, z: out.z, w: out.w }); }))),
      ...(simple ? [] : shapeRows(f)),
      simple ? null : el('div', { class: 'xyzrow' }, el('span', { class: 'dim', text: 'Move' }), ...['X', 'Y', 'Z'].map((k, i) => field(k, p.pos[i], n => { const v = [...p.pos]; v[i] = n; setPose(AN.bone, 'position', { x: v[0], y: v[1], z: v[2] }); }, 256))),
      el('div', { class: 'row' }, simple ? null : el('button', { class: 'btn ghost', text: hasKey ? 'Posed here' : 'Pose this part', disabled: !!hasKey, onclick: () => keyNow(AN.bone) }),
        el('button', { class: 'btn ghost', text: simple ? 'Clear this part' : 'Remove', title: 'Delete', disabled: !hasKey, onclick: () => deleteNow(AN.bone) }),
        A.sideSwap(AN.bone) !== AN.bone ? el('button', { class: 'btn ghost', text: 'To other side', onclick: () => toOtherSide(AN.bone) }) : null,
        hasKey ? pickList(el, { label: 'Motion', value: easeNow(a, f), items: EASES, onChoose: v => { step(); const wasHold = easeNow(a, f) === 'hold'; for (const k of A.TRACKS) { const key = A.keyAt(a, AN.bone, k, f); if (!key) continue; key.interpolationType = v === 'hold' ? 'linear' : v;
            if (wasHold && v !== 'hold') { const ks = a.nodeAnimations[AN.bone][k], i = ks.lastIndexOf(ks.filter(x => x.time === f).pop()), nx = ks[i + 1]; if (nx && JSON.stringify(nx.delta) === JSON.stringify(key.delta)) ks.splice(i + 1, 1); }   /* leaving Hold removes its copy */
            if (v === 'hold') { const next = (a.nodeAnimations[AN.bone][k] || []).find(x => x.time > f); if (next && next.time - 1 > f && !A.keyAt(a, AN.bone, k, next.time - 1)) A.setKey(a, AN.bone, k, next.time - 1, JSON.parse(JSON.stringify(key.delta)), 'linear');
              else if (!next && f < a.duration) A.setKey(a, AN.bone, k, a.duration, JSON.parse(JSON.stringify(key.delta)), 'linear');
              const ks2 = a.nodeAnimations[AN.bone][k], ci = ks2.findIndex(x => x.time > f); const cp = ci >= 0 ? ks2[ci] : null; if (cp && JSON.stringify(cp.delta) === JSON.stringify(key.delta)) cp.hold = true; } } show(); queueSave(); render(); } })   /* the copy is marked, so it can follow its key */   /* the last key holds to the end */   /* Hold: a copy of the key one frame before the next key, so the pose stays and then snaps */ : null)); }
  function easeNow(a, f) { const tr = a.nodeAnimations[AN.bone] || {}; for (const k of A.TRACKS) { const ks = tr[k] || [], i = ks.map(x => x.time).lastIndexOf(f); if (i < 0) continue; const key = ks[i], nx = ks[i + 1];
      if (key.interpolationType === 'linear' && nx && JSON.stringify(nx.delta) === JSON.stringify(key.delta) && (nx.time === (ks[i + 2]?.time ?? a.duration + 1) - 1 || !ks[i + 2])) return 'hold'; return key.interpolationType || 'smooth'; } return 'smooth'; }   /* a held key reads back as Hold */
  // face and shape keys: stretch (eyelids close), texture slide (the mouth's expressions), visible
  function shapeRows(f) { const g = group(AN.bone); if (!g || !g.userData.mesh) return []; if (!/Mouth|Eyebrow|Eyelid|Eye\b|Eyes/.test(AN.bone) && !['shapeStretch', 'shapeUvOffset', 'shapeVisible'].some(k => (AN.a.nodeAnimations[AN.bone]?.[k] || []).length)) return [];   /* face parts, or shapes already keyed */
    const st0 = trackAt(AN.bone, 'shapeStretch', f) || { x: 1, y: 1, z: 1 }, uv = trackAt(AN.bone, 'shapeUvOffset', f) || { x: 0, y: 0 }, vis = trackAt(AN.bone, 'shapeVisible', f);
    const num = (label, v, set, stepv = 0.1) => el('label', { class: 'axf' }, el('span', { text: label }), el('input', { type: 'number', step: stepv, value: Math.round(v * 100) / 100, onchange: e => { const t = e.target.value.trim(), n = +t; if (!t || !Number.isFinite(n)) { e.target.value = Math.round(v * 100) / 100; return; } step(); const all = [...document.querySelectorAll('.bonebox input')], at = all.indexOf(e.target); set(n); refreshBox(); document.querySelector('canvas.timeline')?.redraw?.(); if (at >= 0) document.querySelectorAll('.bonebox input')[at]?.focus(); } }));
    return [el('div', { class: 'xyzrow' }, el('span', { class: 'dim', text: 'Stretch' }), ...['x', 'y', 'z'].map(c => num(c.toUpperCase(), st0[c] ?? 1, n => setPose(AN.bone, 'shapeStretch', { ...st0, [c]: Math.max(0, Math.min(64, n)) }, 'linear')))),
      el('div', { class: 'xyzrow' }, el('span', { class: 'dim', text: 'Slide' }), ...['x', 'y'].map(c => num(c.toUpperCase(), uv[c] ?? 0, n => setPose(AN.bone, 'shapeUvOffset', { ...uv, [c]: Math.round(Math.max(-512, Math.min(512, n))) }, 'linear'), 1)),
        el('label', { class: 'chk' }, el('input', { type: 'checkbox', checked: vis !== false, onchange: e => { step(); const f0 = frame(), ks = AN.a.nodeAnimations[AN.bone]?.shapeVisible || []; if (f0 > 0 && !ks.some(x => x.time < f0)) A.setKey(AN.a, AN.bone, 'shapeVisible', 0, !e.target.checked, 'linear');   /* the frames before keep the other state */
          A.setKey(AN.a, AN.bone, 'shapeVisible', f0, e.target.checked, 'linear'); show(); queueSave(); refreshBox(); } }), el('span', { text: 'Visible' })))]; }
  function refreshBox() { const slot = document.querySelector('.boneslot'); if (slot) slot.replaceChildren(...[boneBox()].filter(Boolean)); const [u, r] = [...document.querySelectorAll('.animedit button')].filter(b => b.textContent === '↶' || b.textContent === '↷'); if (u) u.disabled = !AN?.hist.length; if (r) r.disabled = !AN?.fut.length; }   /* Undo/Redo follow typed edits */
  function boneList(bones) { const a = AN.a; return el('div', { class: 'bonelist' }, bones.map(b => el('button', { class: 'bonerow' + (b.name === AN.bone ? ' on' : '') + (a.nodeAnimations[b.name] ? ' keyed' : ''), style: `padding-left:${6 + b.depth * 10}px`, text: friendly(b.name), title: b.name, onclick: () => { AN.bone = b.name; if (!CHAIN[b.name]) ikOn = false; placeGizmo(); render(); } }))); }
  function editorShell(a, nameIn, len, loop, sel, list) {
    return [head('Animate'), el('div', { class: 'pbody animedit' + (simple ? ' simple' : '') },
      el('div', { class: 'row' }, nameIn, el('button', { class: 'btn ghost', text: '↶', title: 'Undo (Ctrl+Z)', disabled: !AN.hist.length, onclick: () => undo(false) }), el('button', { class: 'btn ghost', text: '↷', title: 'Redo (Ctrl+Y)', disabled: !AN.fut.length, onclick: () => undo(true) }), el('button', { class: 'btn ghost', text: '?', title: 'Tips', 'aria-label': 'Show tips', onclick: () => { guideStep = 0; render(); } }), el('button', { class: 'btn primary', text: 'Done', disabled: recording, onclick: close })),
      guideBox(),
      el('div', { class: 'row' }, el('label', { class: 'axf' }, el('span', { text: 'Length' }), len, el('span', { class: 'dim', text: 's' })), el('label', { class: 'chk' }, loop, el('span', { text: 'Loop' })),
        el('button', { class: 'btn ghost' + (simple ? '' : ' on'), text: simple ? 'More tools' : 'Fewer tools', 'aria-pressed': String(!simple), onclick: () => { simple = !simple; lsSet('se_anim_simple', simple ? '1' : '0'); render(); } })),
      poseTrack(),
      simple ? null : el('div', { class: 'row' },
        el('button', { class: 'btn ghost', text: 'Mirror', onclick: () => { step(); AN.a = A.mirror(AN.a, b => !!group(b)); show(); queueSave(); render(); } }),
        el('button', { class: 'btn ghost', text: 'Match ends', disabled: !!a.holdLastKeyframe, onclick: matchEnds }),
        el('button', { class: 'btn ghost', text: 'Loosen', onclick: loosen }),
        pickList(el, { label: 'Held item', value: held || '', items: [{ value: '', text: 'No item' }, ...(ctx.props || []).map(k => ({ value: k, text: PROPNAME[k] || nice(k) }))], onPreview: v => ctx.hold?.(v === null ? held : v, 'R'), onChoose: v => { held = v; ctx.hold?.(held, 'R'); } }),   /* the figure holds the item under the pointer */
        el('button', { class: 'btn ghost' + (ghostsOn ? ' on' : ''), text: 'Ghosts', 'aria-pressed': String(ghostsOn), title: 'O', onclick: () => { ghostsOn = !ghostsOn; ghosts(); render(); } }),
        el('button', { class: 'btn ghost', text: recording ? 'Recording…' : 'Video', disabled: recording, onclick: () => recordVideo().catch(e => { recording = false; st.recordMode?.(false); say(e.message, true); render(); }) }),
        el('button', { class: 'btn ghost', text: 'Copy pose', title: 'Ctrl+C', onclick: copyPose }), el('button', { class: 'btn ghost', text: 'Paste pose', title: 'Ctrl+V (Ctrl+Shift+V mirrored)', disabled: !clip, onclick: () => pastePose(false) })),
      AN.bone ? sel : guideStep === 0 ? null : el('p', { class: 'dim hint', text: 'Click a body part on the figure to pose it.' }),
      simple ? null : el('div', { class: 'tlwrap', onscroll: e => e.currentTarget.querySelector('canvas.timeline')?.redraw?.() }, timeline()), el('div', { class: 'checkslot' }, checkRow()), simple ? null : el('h3', { text: 'Body parts' }), simple ? null : list)];
  }
  // one loop of the animation as a WebM video of the stage, from the current view
  async function recordVideo() {
    const v = document.getElementById('view'), cv = v && v.tagName === 'CANVAS' ? v : v?.querySelector('canvas'); if (!cv || !window.MediaRecorder) return say('This browser cannot record video', true);
    const type = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t)); if (!type) return say('This browser cannot record video', true);
    const name = AN.name, keep = st.anim.t; st.boneGizmo(null); st.onion(null); st.recordMode?.(true); await new Promise(ok => setTimeout(ok, 80));   /* twice the screen's pixels, set before recording starts */
    const rec = new MediaRecorder(cv.captureStream(60), { mimeType: type, videoBitsPerSecond: 8e6 }), parts = [];
    rec.ondataavailable = e => { if (e.data.size) parts.push(e.data); }; const done = new Promise(ok => { rec.onstop = ok; });
    st.anim.t = 0; st.anim.playing = true; rec.start(); recording = true; render();
    await new Promise(ok => setTimeout(ok, (AN.a.duration / 60) * 1000 + 120)); rec.stop(); await done; st.recordMode?.(false); recording = false; st.anim.playing = false;
    download(new Blob(parts, { type: 'video/webm' }), 'video/webm', fileName(name, '.webm')); st.anim.t = keep; if (AN) show(); render(); }
  let recording = false, held = '';
  // Loosen: the keys between the first and last move a little (up to a frame, up to 2 degrees), so repeats don't look machine-made; one undo step
  function loosen() { const a = AN.a, n = a.duration, rnd = s => (Math.random() * 2 - 1) * s, same = (p, q) => !!p && !!q && JSON.stringify(p.delta) === JSON.stringify(q.delta);
    if (true) { if (!Object.values(a.nodeAnimations).some(tr => ['orientation', 'position'].some(k => (tr[k] || []).length >= 3))) return; const fut0 = AN.fut; step();
      for (const tr of Object.values(a.nodeAnimations)) { const ks = k => tr[k] || [], fixed = new Set([0, n]);
        for (const k of ['orientation', 'position']) { const l = ks(k); const cnt = new Map(); for (const y of l) cnt.set(y.time, (cnt.get(y.time) || 0) + 1); l.forEach((x, i) => { if (i === 0 || i === l.length - 1 || cnt.get(x.time) > 1 || same(x, l[i - 1]) || same(x, l[i + 1]) || (l[i - 1] && l[i - 1].time === x.time - 1) || (l[i + 1] && l[i + 1].time === x.time + 1)) fixed.add(x.time); }); }   /* holds, cuts and the ends stay */
        const times = [...new Set(['orientation', 'position'].flatMap(k => ks(k).map(x => x.time)))].sort((p, q) => p - q), byT = new Map(); for (const k of ['orientation', 'position']) for (const x of ks(k)) { if (!byT.has(x.time)) byT.set(x.time, []); byT.get(x.time).push(x); }
        for (let i = 1; i < times.length - 1; i++) { const t = times[i]; if (fixed.has(t)) continue; const nt = t + Math.round(rnd(1)); if (nt <= times[i - 1] || nt >= times[i + 1] || nt <= 0 || nt >= n) continue;
          for (const x of byT.get(t) || []) x.time = nt; times[i] = nt; }   /* the bone's turn and move keys on a frame move together */
        for (const k of ['orientation', 'position']) { const l = ks(k); for (const x of l) { if (fixed.has(x.time)) continue;
          if (k === 'orientation') { const ax = [rnd(1), rnd(1), rnd(1)], L = Math.hypot(...ax) || 1, ang = rnd(2) * D2R / 2, sn = Math.sin(ang), dq = new THREE.Quaternion(ax[0] / L * sn, ax[1] / L * sn, ax[2] / L * sn, Math.cos(ang)), q = new THREE.Quaternion(x.delta.x, x.delta.y, x.delta.z, x.delta.w); dq.multiply(q).normalize(); x.delta = { x: dq.x, y: dq.y, z: dq.z, w: dq.w }; }
          else x.delta = { x: x.delta.x + rnd(0.15), y: x.delta.y + rnd(0.15), z: x.delta.z + rnd(0.15) }; } l.sort((p, q) => p.time - q.time); } }
      if (JSON.stringify(a) === AN.hist[AN.hist.length - 1]) { AN.hist.pop(); AN.fut = fut0; say('Nothing to loosen: every key is an end, a hold or a cut'); return; }   /* unchanged: no step, no save */
      show(); queueSave(); render(); return; }
    if (!Object.values(a.nodeAnimations).some(tr => ['orientation', 'position'].some(k => (tr[k] || []).length >= 3))) return;   /* nothing between a first and last key: no change, no step */ step();
    for (const tr of Object.values(a.nodeAnimations)) { const shift = new Map();   // one shift per frame for the whole bone, so its turn and move keys stay together
      for (const k of ['orientation', 'position']) { const ks = tr[k] || []; if (ks.length < 3) continue;
      for (let i = 1; i < ks.length - 1; i++) { const x = ks[i]; if (same(x, ks[i - 1]) && ks[i - 1].time === x.time - 1 || same(x, ks[i + 1]) && ks[i + 1].time === x.time + 1) continue;   /* a Hold copy stays exactly as it is */
        if (!shift.has(x.time)) shift.set(x.time, Math.round(rnd(1))); const lo = ks[i - 1].time + 1, hi = ks[i + 1].time - 1, t = x.time + shift.get(x.time); if (t >= lo && t <= hi && t > 0 && t < n && !['orientation', 'position'].some(k2 => k2 !== k && (tr[k2] || []).some(y => y.time === t))) x.time = t;
        if (k === 'orientation') { const ax = [rnd(1), rnd(1), rnd(1)], L = Math.hypot(...ax) || 1, ang = rnd(2) * D2R / 2, sn = Math.sin(ang), dq = { x: ax[0] / L * sn, y: ax[1] / L * sn, z: ax[2] / L * sn, w: Math.cos(ang) }, q = x.delta;
          x.delta = A.read({ duration: 1, nodeAnimations: { b: { orientation: [{ time: 0, delta: { x: dq.w * q.x + dq.x * q.w + dq.y * q.z - dq.z * q.y, y: dq.w * q.y - dq.x * q.z + dq.y * q.w + dq.z * q.x, z: dq.w * q.z + dq.x * q.y - dq.y * q.x + dq.z * q.w, w: dq.w * q.w - dq.x * q.x - dq.y * q.y - dq.z * q.z } }] } } }).nodeAnimations.b.orientation[0].delta; }
        else x.delta = { x: x.delta.x + rnd(0.15), y: x.delta.y + rnd(0.15), z: x.delta.z + rnd(0.15) }; } ks.sort((p, q) => p.time - q.time); } }
    show(); queueSave(); render(); }
  function checkRow() { const ck = AN.checks; if (!ck || (!ck.pops.length && !ck.clips.length && !ck.seam && !(ck.slides || []).length)) return null;
    const go = f => { st.anim.t = f; st.anim.playing = false; show(); render(); };
    return el('div', { class: 'checks' }, ck.pops.length ? el('button', { class: 'chip bad', text: `Pops ${ck.pops.length}`, onclick: () => go(ck.pops.find(f => f > frame()) ?? ck.pops[0]) }) : null,
      ck.clips.length ? el('button', { class: 'chip warn', text: `Hand in body ${ck.clips.length}`, onclick: () => go(ck.clips.find(f => f > frame()) ?? ck.clips[0]) }) : null,
      (ck.slides || []).length ? el('button', { class: 'chip warn', text: `Feet slide ${ck.slides.length}`, onclick: () => go(ck.slides.find(f => f > frame()) ?? ck.slides[0]) }) : null,
      ck.seam ? el('button', { class: 'chip bad', text: 'Loop jumps', onclick: () => go(AN.a.duration) }) : null); }
  function panel() { if (!RIG) { rig().then(render).catch(e => say(e.message, true)); } return AN ? editorPanel() : libraryPanel(); }

  // keys: K set key, Delete removes, R / G turn or move, Ctrl+Z / Ctrl+Y undo and redo
  addEventListener('keydown', e => { if (!AN || ctx.tab() !== 'animate' || e.target.matches?.('input:not([type=range]):not([type=checkbox]),textarea,select,[contenteditable]')) return;   /* the frame slider keeps the keys working */
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'c') { e.preventDefault(); copyPose(); } else if ((e.ctrlKey || e.metaKey) && k === 'v') { e.preventDefault(); pastePose(e.shiftKey); }   /* Ctrl+Shift+V pastes it mirrored */
    else if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); undo(e.shiftKey); } else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); undo(true); }
    else if (e.ctrlKey || e.metaKey || e.altKey) return;
    else if (k === 'k' && (simple || !AN.bone)) { e.preventDefault(); addPose(); } else if (k === 'k' && AN.bone) { e.preventDefault(); keyNow(AN.bone); } else if (k === 'delete' && AN.bone && (e.target === document.body || e.target.matches?.('input[type=range]'))) { e.preventDefault(); deleteNow(AN.bone); }
    else if (k === 'o') { ghostsOn = !ghostsOn; ghosts(); render(); } else if (k === 'r') { mode = 'rotate'; placeGizmo(); render(); } else if (k === 'g') { mode = 'move'; placeGizmo(); render(); } });

  rescue().then(() => store.syncFolder()).catch(() => {});   // a rescued edit is saved at start, not when the tab is opened
  function cleanImport(src) { if (src && typeof src === 'object' && typeof src.duration === 'string') { const t = src.duration.trim(); src = { ...src, duration: t ? +t : 60 }; }
    if (src && typeof src === 'object' && src.nodeAnimations && typeof src.nodeAnimations === 'object' && !Array.isArray(src.nodeAnimations)) { const na = {}; for (const [b, tr] of Object.entries(src.nodeAnimations)) { if (!tr || typeof tr !== 'object') continue; na[b] = {}; for (const k of A.TRACKS) { const by = new Map(); for (const x of Array.isArray(tr[k]) ? tr[k] : []) if (x && Number.isFinite(x.time)) by.set(Math.round(x.time), { ...x, time: Math.round(x.time) }); na[b][k] = [...by.values()]; } } src = { ...src, nodeAnimations: na }; }
    const a = A.read(src); for (const tr of Object.values(a.nodeAnimations)) for (const x of tr.position || []) for (const c of ['x', 'y', 'z']) x.delta[c] = Math.max(-256, Math.min(256, x.delta[c])); return a; }
  async function importAnim(src, name) { try { if (src && typeof src === 'object' && typeof src.duration === 'string') { const t = src.duration.trim(); src = { ...src, duration: t ? +t : 60 }; }
      if (src && typeof src === 'object' && src.nodeAnimations && typeof src.nodeAnimations === 'object' && !Array.isArray(src.nodeAnimations)) { const na = {}; for (const [b, tr] of Object.entries(src.nodeAnimations)) { if (!tr || typeof tr !== 'object') continue; na[b] = {}; for (const k of A.TRACKS) { const by = new Map(); for (const x of Array.isArray(tr[k]) ? tr[k] : []) if (x && Number.isFinite(x.time)) by.set(Math.round(x.time), { ...x, time: Math.round(x.time) }); na[b][k] = [...by.values()]; } } src = { ...src, nodeAnimations: na }; }   /* whole frames before the length check; two keys on one frame keep the later */
      const a = A.read(src); for (const tr of Object.values(a.nodeAnimations)) for (const k of A.TRACKS) { const ks = tr[k]; for (const x of ks) { x.time = Math.round(x.time); if (k === 'position' && x.delta) for (const c of ['x', 'y', 'z']) x.delta[c] = Math.max(-256, Math.min(256, x.delta[c])); } ks.sort((p, q) => p.time - q.time); }   /* whole frames, moves like the fields allow */
      await create(a, name); } catch (e) { say(e.message, true); } }
  return { simple: () => simple, reload: async () => { await loadLib(); if (!AN) render(); }, names: () => (LIB || []).map(x => x.name.toLowerCase()), cleanImport, cleanName: t => animName(t), importAnim, debug: () => ({ ghostsOn, AN, mode, ikSolve, group }), panel, pickAt, active: () => !!AN, leave: () => { if (AN) close(); }, refresh: () => { if (AN) placeGizmo(); } };
}
