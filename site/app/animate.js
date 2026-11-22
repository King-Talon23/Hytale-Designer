// The Animate tab: make player animations in the game's own format. A library of your animations, and the editor: pick a bone
// (list or click on the model), turn or move it with the gizmo or the number fields, keys on a timeline, undo, save.
import * as A from './anim.js';
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
  let saveT = 0; const queueSave = () => { AN.dirty = true; clearTimeout(saveT); const x = AN; saveT = setTimeout(() => save(x).catch(e => say(e.message, true)), 500); };

  // ---- editing
  function show() { const sa = st.anim; sa.anim = AN.a; sa.blend = 1; sa.resting = false; sa.apply(); placeGizmo(); ghosts(); runChecks(); }
  function ghosts() { if (!ghostsOn || !AN) { st.onion(null); return; } const f = frame(), ts = A.keyTimes(AN.a, AN.bone && AN.a.nodeAnimations[AN.bone] ? AN.bone : undefined);   // the keys either side of this frame (of the picked bone, if it has any)
    const before = [...ts].reverse().find(t => t < f), after = ts.find(t => t > f); st.onion([before ?? null, after ?? null]); }
  const frame = () => Math.max(0, Math.min(AN.a.duration, Math.round(st.anim.t)));
  function step() { AN.hist.push(JSON.stringify(AN.a)); if (AN.hist.length > 200) AN.hist.shift(); AN.fut = []; }   // before every change
  function undo(redo) { const from = redo ? AN.fut : AN.hist, to = redo ? AN.hist : AN.fut; if (!from.length) return; to.push(JSON.stringify(AN.a)); AN.a = JSON.parse(from.pop()); show(); queueSave(); render(); }
  async function open(id) { const rec = await db.get('meta', 'anim:' + id); if (!rec) { await loadLib(); render(); return; }   /* always the saved copy, never a stale list entry */
    AN = { saved: rec.updated, id: rec.id, name: rec.name, a: A.read(rec.a), bone: null, hist: [], fut: [], dirty: false }; st.anim.playing = false; st.anim.t = 0; show(); render(); }
  async function close() { if (recording) return; const x = AN; clearTimeout(saveT); AN = null; st.anim.playing = false; st.boneGizmo(null); st.onion(null); ctx.idle?.(); if (x?.dirty) await save(x).catch(e => say(e.message, true)); await loadLib(); render(); }
  async function create(src, name) { await loadLib(); const used = new Set(LIB.map(x => x.name)); let nm = animName(name || 'My animation'), k = 2; const base = nm; while (used.has(nm)) nm = animName(base, String(k++));   /* a taken name gets a number */
    const rec = { id: crypto.randomUUID(), name: nm, a: src ? A.read(src) : A.blank(60), updated: Date.now() }; await db.put('meta', 'anim:' + rec.id, rec); store.syncFolder().catch(() => {}); await loadLib(); open(rec.id); }
  // names: no control or line-break characters, cut on whole characters (an emoji is never split), 60 at most
  function animName(t, suffix) { const s = String(t || '').replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, '').replace(/\s+/g, ' ').trim(), g = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s)].map(x => x.segment), room = 60 - (suffix ? suffix.length + 1 : 0);
    const cut = g.slice(0, room).join('').trim(); return (cut || 'My animation') + (suffix ? ' ' + suffix : ''); }
  // a file name Windows accepts: no reserved characters or names, no trailing dot or space
  function fileName(t, ext) { let n = String(t).replace(/[\\/:*?"<>|\u0000-\u001f]/g, '').replace(/[. ]+$/, '').trim(); if (!n) n = 'animation'; if (/^(con|prn|aux|nul|com\d|lpt\d)$/i.test(n)) n += '_'; return n + ext; }
  function download(text, type, name) { const url = URL.createObjectURL(text instanceof Blob ? text : new Blob([text], { type })), a = el('a', { href: url, download: name }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000); }

  // the bone's pose now (interpolated), as the fields show it
  function pose(bone) { const g = group(bone); if (!g) return null; const r = g.userData.rest, q = r.q.clone().invert().multiply(g.quaternion);
    return { rot: toEuler(q), pos: [g.position.x - r.p.x, g.position.y - r.p.y, g.position.z - r.p.z] }; }
  function setPose(bone, part, delta, interp) { A.setKey(AN.a, bone, part, frame(), delta, interp || A.keyAt(AN.a, bone, part, frame())?.interpolationType || 'smooth'); show(); queueSave(); }
  function keyNow(bone) { const p = pose(bone), f = frame(); if (!p || A.TRACKS.some(k => A.keyAt(AN.a, bone, k, f))) return; step(); setPose(bone, 'orientation', fromEuler(...p.rot));
    if ((AN.a.nodeAnimations[bone]?.position || []).length || p.pos.some(v => Math.abs(v) > 1e-6)) setPose(bone, 'position', { x: p.pos[0], y: p.pos[1], z: p.pos[2] }); render(); }   /* a position key only for a bone that moves */
  function deleteNow(bone) { const f = frame(); if (!A.TRACKS.some(k => A.keyAt(AN.a, bone, k, f))) return; step(); for (const k of A.TRACKS) A.deleteKey(AN.a, bone, k, f); show(); queueSave(); render(); }

  // the whole pose at this frame: every bone that moves in this animation (or the selected one), as keys
  let clip = null;
  function poseBones() { return [...new Set([...Object.keys(AN.a.nodeAnimations), ...(AN.bone ? [AN.bone] : [])])]; }
  function copyPose() { clip = {}; for (const b of poseBones()) { const p = pose(b); if (p) clip[b] = { orientation: fromEuler(...p.rot), position: { x: p.pos[0], y: p.pos[1], z: p.pos[2] }, moves: !!(AN.a.nodeAnimations[b]?.position || []).length || p.pos.some(v => Math.abs(v) > 1e-6) }; } render(); }
  function pastePose(mirrored) { if (!clip) return; step(); for (const [b, d] of Object.entries(clip)) { const to = mirrored ? A.sideSwap(b) : b; for (const k of ['orientation', 'position']) { if (k === 'position' && !d.moves) continue; A.setKey(AN.a, to, k, frame(), mirrored ? A.mirrorKeyDelta(k, d[k]) : d[k], 'smooth'); } } show(); queueSave(); render(); }   /* moves only for bones that move */
  // this bone's pose on its other side, mirrored (an arm raised on the left becomes the same on the right)
  function toOtherSide(bone) { const other = A.sideSwap(bone), p = pose(bone); if (other === bone || !p || !group(other)) return; step();
    A.setKey(AN.a, other, 'orientation', frame(), A.mirrorKeyDelta('orientation', fromEuler(...p.rot)), 'smooth'); A.setKey(AN.a, other, 'position', frame(), A.mirrorKeyDelta('position', { x: p.pos[0], y: p.pos[1], z: p.pos[2] }), 'smooth'); show(); queueSave(); render(); }
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
    const torso = ['Chest', 'Belly'].map(group).filter(g => g && g.userData.mesh), hands = ['L-Hand', 'R-Hand'].map(group).filter(Boolean);
    sa.anim = AN.a; sa.blend = 1;
    const stride = Math.max(1, Math.ceil(n / 900));   /* long animations are sampled, so a check never stalls the page */
    for (let f = 0; f <= n; f += stride) { sa.t = f; sa.apply(); fig.updateMatrixWorld(true);
      for (const b of bones) { const q = group(b).quaternion.clone(), p = prev.get(b); speed.get(b).push(p ? 2 * Math.acos(Math.min(1, Math.abs(q.dot(p)))) * R2D : 0); prev.set(b, q); }
      if (torso.length && hands.length) { let inside = false; for (const t of torso) { box.setFromObject(t.userData.mesh).expandByScalar(-1.5); for (const h of hands) { if (h.userData.mesh) { const hb = new THREE.Box3().setFromObject(h.userData.mesh); hb.getCenter(v); if (box.containsPoint(v) || box.intersectsBox(hb.expandByScalar(-1))) inside = true; } else { h.getWorldPosition(v); if (box.containsPoint(v)) inside = true; } } } if (inside) out.clips.push(f); } }
    for (const [b, sp] of speed) for (let f = 1; f < sp.length - 1; f++) { const around = (sp[f - 1] + sp[f + 1]) / 2 + 1; if (sp[f] > 12 * stride && sp[f] > around * 4) out.pops.push(f * stride); }   /* sample number back to its frame */
    if (!AN.a.holdLastKeyframe) { let worst = 0; sa.t = 0; sa.apply(); const q0 = new Map(bones.map(b => [b, group(b).quaternion.clone()])); sa.t = n; sa.apply(); for (const b of bones) worst = Math.max(worst, 2 * Math.acos(Math.min(1, Math.abs(group(b).quaternion.dot(q0.get(b))))) * R2D);
      const val = (b, k, t) => { const ks = AN.a.nodeAnimations[b]?.[k] || []; let v = null; for (const x of ks) if (x.time <= t) v = x.delta; return v === null ? (ks[0]?.delta ?? null) : v; };
      const shapes = Object.keys(AN.a.nodeAnimations).some(b => ['shapeUvOffset', 'shapeStretch', 'shapeVisible'].some(k => (AN.a.nodeAnimations[b][k] || []).length && JSON.stringify(val(b, k, 0)) !== JSON.stringify(val(b, k, n))));
      out.seam = worst > 8 || shapes; }
    out.pops = [...new Set(out.pops)].sort((x, y) => x - y); sa.t = keep; sa.apply(); return out;
  }
  function placeGizmo() { if (!AN || !AN.bone) { st.boneGizmo(null); return; } const g = group(AN.bone); if (!g) { st.boneGizmo(null); return; }
    st.boneGizmo({ g, mode, onChange: (d, end) => { if (end && !gizmoStep) return; if (!gizmoStep) { step(); gizmoStep = true; }   /* a click on the gizmo without a drag is not a change */ const part = Object.keys(d)[0]; if (part === 'position') for (const c of ['x', 'y', 'z']) d[part][c] = Math.max(-256, Math.min(256, d[part][c])); A.setKey(AN.a, AN.bone, part, frame(), d[part], A.keyAt(AN.a, AN.bone, part, frame())?.interpolationType || 'smooth');
      st.anim.anim = AN.a; st.anim.apply(); if (end) { gizmoStep = false; queueSave(); placeGizmo(); render(); } } }); }
  let gizmoStep = false;

  // a click on the model picks the bone it belongs to
  function pickAt(x, y) { if (!AN) return false; const m = st.pickMesh(x, y, () => true); if (!m) return false; const names = new Set((RIG || []).map(b => b.name)), parts = st.anim.figure.userData.parts, owner = new Map(); parts.forEach((gs, k) => gs.forEach(g => owner.set(g, k)));
    for (let o = m; o; o = o.parent) { const k = owner.get(o); if (k && names.has(k) && !/Attachment$/.test(k)) {   /* clicks land on the body bone, not the small attachment points */ AN.bone = k; placeGizmo(); render(); return true; } } return false; }

  // ---- timeline (one canvas: frame ruler, a row per animated bone, diamonds for keys, the playhead)
  function timeline() {
    const rows = [...new Set([...(AN.bone ? [AN.bone] : []), ...Object.keys(AN.a.nodeAnimations)])], RH = 18, TOP = 18, LW = 92;
    const cv = el('canvas', { class: 'timeline', height: TOP + Math.max(1, rows.length) * RH + 2, tabIndex: 0, 'aria-label': 'Timeline' });
    let W = 0, drag = null; const fx = f => LW + (f / AN.a.duration) * (W - LW - 8), xf = x => Math.round(((x - LW) / (W - LW - 8)) * AN.a.duration);
    function draw() { if (!AN) return; W = cv.clientWidth || 300; cv.width = W; const c = cv.getContext('2d'), n = AN.a.duration, now = frame();
      c.fillStyle = '#0d1a2b'; c.fillRect(0, 0, W, cv.height); c.font = '11px system-ui'; c.textBaseline = 'middle';
      const per = (W - LW - 8) / n, stepF = [1, 2, 5, 10, 20, 30, 60, 120, 300, 600, 1200].find(s => s * per >= 34) || 1200;   /* labels at least 34 px apart */ for (let f = 0; f <= n; f += stepF) { const x = fx(f); c.fillStyle = '#2a3d58'; c.fillRect(x, TOP, 1, cv.height - TOP); c.fillStyle = '#8aa0ba'; c.fillText(String(f), x + 2, TOP / 2); }
      rows.forEach((b, i) => { const y = TOP + i * RH; c.fillStyle = b === AN.bone ? '#1d3352' : i % 2 ? '#101f33' : '#0f1d30'; c.fillRect(0, y, W, RH); c.fillStyle = b === AN.bone ? '#f4c452' : '#c9d6e6'; c.fillText(b.length > 13 ? b.slice(0, 12) + '…' : b, 4, y + RH / 2);
        for (const t of A.keyTimes(AN.a, b)) { const x = fx(t), cy = y + RH / 2; c.save(); c.translate(x, cy); c.rotate(Math.PI / 4); c.fillStyle = t === now ? '#f4c452' : '#9fd0ff'; c.fillRect(-4, -4, 8, 8); c.restore(); } });
      const ck = AN.checks; if (ck) { const mark = (f, col) => { c.fillStyle = col; c.fillRect(fx(f) - 1, TOP - 5, 3, 5); };
        ck.clips.forEach(f => mark(f, '#ff9a3c')); ck.pops.forEach(f => mark(f, '#ff4d5e')); if (ck.seam) { c.fillStyle = '#ff4d5e'; c.fillRect(fx(n) - 4, 0, 4, TOP); } }
      const px = fx(now); c.fillStyle = '#f4c452'; c.fillRect(px - 1, 0, 2, cv.height); }
    const at = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    cv.onpointerdown = e => { const p = at(e), row = Math.floor((p.y - TOP) / RH), bone = p.y >= TOP ? rows[row] : null; if (p.x < LW) { if (bone) { AN.bone = bone; placeGizmo(); render(); } return; }
      const f = Math.max(0, Math.min(AN.a.duration, xf(p.x))), hit = bone && A.keyTimes(AN.a, bone).find(t => Math.abs(fx(t) - p.x) <= 6);
      if (p.y < TOP) { const col = A.keyTimes(AN.a).find(t => Math.abs(fx(t) - p.x) <= 6); if (col !== undefined) { drag = { bones: Object.keys(AN.a.nodeAnimations), from: col, to: col, stepped: false, base: JSON.stringify(AN.a) }; st.anim.t = col; st.anim.playing = false; show(); draw(); cv.setPointerCapture?.(e.pointerId); return; } }   /* on the ruler: a frame that has keys drags all of them */
      if (bone && AN.bone !== bone) { AN.bone = bone; }
      if (hit !== undefined && hit !== null && bone) { drag = { bone, from: hit, to: hit, stepped: false, base: JSON.stringify(AN.a) }; st.anim.t = hit; } else { st.anim.t = f; drag = { seek: true }; }
      st.anim.playing = false; show(); draw(); cv.setPointerCapture?.(e.pointerId); };
    cv.onpointermove = e => { if (!drag) return; const f = Math.max(0, Math.min(AN.a.duration, xf(at(e).x)));
      if (drag.seek) { st.anim.t = f; show(); draw(); return; }
      if (f !== drag.to) { if (!drag.stepped) { step(); drag.stepped = true; } AN.a = JSON.parse(drag.base); A.moveKeys(AN.a, drag.bones || [drag.bone], drag.from, f);   /* always from where the drag began */ drag.to = f; st.anim.t = f; show(); draw(); } };
    cv.onpointerup = () => { if (drag && drag.stepped) queueSave(); const was = drag; drag = null; if (was) render(); };
    cv.onkeydown = e => { if (e.key === 'Delete' && AN.bone) { e.preventDefault(); deleteNow(AN.bone); } };
    requestAnimationFrame(draw); let lastF = -1, wasPlaying = false; const tick = () => { if (!cv.isConnected || !AN) return; const playing = st.anim.playing; if (wasPlaying && !playing) { st.anim.t = Math.round(st.anim.t); st.anim.apply(); }   /* stopped: on a whole frame, so keys land where the playhead shows */
      const f = frame(); if (playing || f !== lastF || wasPlaying) { draw(); if (!playing && (f !== lastF || wasPlaying)) { ghosts(); placeGizmo(); refreshBox(); } lastF = f; } wasPlaying = playing; requestAnimationFrame(tick); };   /* the frame bar moves the playhead, the ghosts and the gizmo too */ requestAnimationFrame(tick); cv.redraw = draw; return cv;
  }

  // ---- panels
  function libraryPanel() {
    if (!LIB) { loadLib().then(render); return [head('Animate'), el('div', { class: 'pbody' }, el('p', { class: 'dim', text: 'Loading…' }))]; }
    if (!GAMEANIMS) { gameAnims().then(render); }
    const groups = Object.keys(GAMEANIMS || {}).sort(), label = ctx.label || ((g, n) => nice(n));
    const pick = el('select', { 'aria-label': 'Game animation' }, el('option', { value: '', text: 'Copy a game animation…' }),
      ...groups.map(g => el('optgroup', { label: g.split('/').map(nice).join(' / ') }, ...GAMEANIMS[g].map(n => el('option', { value: g + '|' + n, text: label(g, n) })))));
    pick.onchange = async () => { const v = pick.value; if (!v) return; const [g, n] = v.split('|'); const src = await game.json(`Common/Characters/Animations/${g}/${n}.blockyanim`); create(src, label(g, n)); };
    return [head('Animate'), el('div', { class: 'pbody' },
      el('div', { class: 'row' }, el('button', { class: 'btn primary', text: 'New', onclick: () => create(null) }), pick),
      el('h3', { text: 'My animations' }),
      LIB.length ? el('div', { class: 'animlib' }, LIB.map(rec => el('div', { class: 'animrow' },
        el('button', { class: 'animopen', onclick: () => open(rec.id) }, el('b', { text: rec.name }), el('small', { text: `${(rec.a.duration / 60).toFixed(2)} s` })),
        el('button', { class: 'mini', text: 'Export', onclick: async () => { const x = await db.get('meta', 'anim:' + rec.id); if (x) download(A.write(x.a), 'application/json', fileName(x.name, '.blockyanim')); } }),
        el('button', { class: 'mini', text: 'Delete', onclick: async () => { const x = await db.get('meta', 'anim:' + rec.id); const v = await ask('Delete animation', el('p', { text: `"${x?.name || rec.name}" will be deleted.` }), [{ label: 'Cancel', value: '' }, { label: 'Delete', value: 'yes', danger: true }]); if (v !== 'yes') return; await db.del('meta', 'anim:' + rec.id); store.syncFolder().catch(() => {}); await loadLib(); render(); } }))))
        : el('p', { class: 'dim', text: 'None yet.' }))];
  }
  function editorPanel() {
    const a = AN.a, bones = RIG || [], f = frame();
    const nameIn = el('input', { type: 'text', class: 'wsname', value: AN.name, maxLength: 60, 'aria-label': 'Name', onchange: async e => { if (!e.target.value.trim()) { e.target.value = AN.name; return; } await loadLib(); const used = new Set(LIB.filter(x => x.id !== AN.id).map(x => x.name)), base = animName(e.target.value); let nm = base, k = 2; while (used.has(nm)) nm = animName(base, String(k++)); AN.name = nm; e.target.value = nm; queueSave(); } });
    const len = el('input', { type: 'number', min: 1, max: A.MAX_FRAMES, value: a.duration, class: 'adjnum', 'aria-label': 'Length in frames', onchange: e => { const v = Math.round(+e.target.value); if (!(v >= 1)) { e.target.value = a.duration; return; } step(); A.setDuration(a, v); if (st.anim.t > a.duration) st.anim.t = a.duration; show(); queueSave(); render(); } });
    const loop = el('input', { type: 'checkbox', checked: !a.holdLastKeyframe, onchange: e => { step(); a.holdLastKeyframe = !e.target.checked; show(); queueSave(); render(); } });
    const sel = el('div', { class: 'boneslot' }, boneBox());
    const list = boneList(bones);
    return editorShell(a, nameIn, len, loop, sel, list);
  }
  function boneBox() { if (!AN || !AN.bone) return null; const a = AN.a, f = frame();
    const p = pose(AN.bone), hasKey = A.TRACKS.some(k => A.keyAt(a, AN.bone, k, f)); if (!p) return null;
    const ty = AN.typed; if (ty && ty.bone === AN.bone && ty.f === f) { const q = fromEuler(...ty.rot), g = group(AN.bone), rq = g.userData.rest.q.clone().invert().multiply(g.quaternion); if (Math.abs(q.x * rq.x + q.y * rq.y + q.z * rq.z + q.w * rq.w) > 0.9999) p.rot = [...ty.rot]; }   /* the same turn as typed: show the typed numbers */
    const field = (label, v, set, lim) => el('label', { class: 'axf' }, el('span', { text: label }), el('input', { type: 'number', step: 1, value: r1(v), onchange: e => { const t = e.target.value.trim(), n = +t; if (!t || !Number.isFinite(n)) { e.target.value = r1(v); return; } step(); set(lim ? Math.max(-lim, Math.min(lim, n)) : n); const all = [...document.querySelectorAll('.bonebox input')], at = all.indexOf(e.target); refreshBox(); document.querySelector('canvas.timeline')?.redraw?.(); if (at >= 0) document.querySelectorAll('.bonebox input')[at]?.focus(); } }));   /* empty or junk puts the old value back */
    return el('div', { class: 'bonebox' },
      el('div', { class: 'row' }, el('b', { text: AN.bone }), el('button', { class: 'mini' + (mode === 'rotate' ? ' on' : ''), text: 'Turn', title: 'R', onclick: () => { mode = 'rotate'; placeGizmo(); render(); } }), el('button', { class: 'mini' + (mode === 'move' ? ' on' : ''), text: 'Move', title: 'G', onclick: () => { mode = 'move'; placeGizmo(); render(); } })),
      el('div', { class: 'xyzrow' }, el('span', { class: 'dim', text: 'Turn' }), ...['X', 'Y', 'Z'].map((k, i) => field(k, p.rot[i], n => { const e = [...p.rot]; e[i] = n; AN.typed = { bone: AN.bone, f: frame(), rot: e }; setPose(AN.bone, 'orientation', fromEuler(...e)); }))),
      el('div', { class: 'xyzrow' }, el('span', { class: 'dim', text: 'Move' }), ...['X', 'Y', 'Z'].map((k, i) => field(k, p.pos[i], n => { const v = [...p.pos]; v[i] = n; setPose(AN.bone, 'position', { x: v[0], y: v[1], z: v[2] }); }, 256))),
      el('div', { class: 'row' }, el('button', { class: 'btn ghost', text: hasKey ? 'Key set' : 'Set key', title: 'K', disabled: !!hasKey, onclick: () => keyNow(AN.bone) }),
        el('button', { class: 'btn ghost', text: 'Delete key', disabled: !hasKey, onclick: () => deleteNow(AN.bone) }),
        A.sideSwap(AN.bone) !== AN.bone ? el('button', { class: 'btn ghost', text: 'To other side', onclick: () => toOtherSide(AN.bone) }) : null,
        hasKey ? el('select', { 'aria-label': 'Easing', onchange: e => { step(); for (const k of A.TRACKS) { const key = A.keyAt(a, AN.bone, k, f); if (key) key.interpolationType = e.target.value; } show(); queueSave(); } },
          ...[['smooth', 'Smooth'], ['linear', 'Linear']].map(([v, t]) => el('option', { value: v, text: t, selected: (A.TRACKS.map(k => A.keyAt(a, AN.bone, k, f)).find(Boolean)?.interpolationType || 'smooth') === v }))) : null)); }
  function refreshBox() { const slot = document.querySelector('.boneslot'); if (slot) slot.replaceChildren(...[boneBox()].filter(Boolean)); }
  function boneList(bones) { const a = AN.a; return el('div', { class: 'bonelist' }, bones.map(b => el('button', { class: 'bonerow' + (b.name === AN.bone ? ' on' : '') + (a.nodeAnimations[b.name] ? ' keyed' : ''), style: `padding-left:${6 + b.depth * 10}px`, text: b.name, onclick: () => { AN.bone = b.name; placeGizmo(); render(); } }))); }
  function editorShell(a, nameIn, len, loop, sel, list) {
    return [head('Animate'), el('div', { class: 'pbody animedit' },
      el('div', { class: 'row' }, nameIn, el('button', { class: 'btn ghost', text: '↶', title: 'Undo (Ctrl+Z)', disabled: !AN.hist.length, onclick: () => undo(false) }), el('button', { class: 'btn ghost', text: '↷', title: 'Redo (Ctrl+Y)', disabled: !AN.fut.length, onclick: () => undo(true) }), el('button', { class: 'btn primary', text: 'Done', onclick: close })),
      el('div', { class: 'row' }, el('label', { class: 'axf' }, el('span', { text: 'Frames' }), len), el('label', { class: 'chk' }, loop, el('span', { text: 'Loop' })),
        el('button', { class: 'btn ghost', text: 'Mirror', onclick: () => { step(); AN.a = A.mirror(AN.a); show(); queueSave(); render(); } }),
        el('button', { class: 'btn ghost', text: 'Match ends', disabled: !!a.holdLastKeyframe, onclick: matchEnds }),
        el('button', { class: 'btn ghost' + (ghostsOn ? ' on' : ''), text: 'Ghosts', 'aria-pressed': String(ghostsOn), title: 'O', onclick: () => { ghostsOn = !ghostsOn; ghosts(); render(); } }),
        el('button', { class: 'btn ghost', text: recording ? 'Recording…' : 'Video', disabled: recording, onclick: () => recordVideo().catch(e => { recording = false; say(e.message, true); render(); }) }),
        el('button', { class: 'btn ghost', text: 'Copy pose', title: 'Ctrl+C', onclick: copyPose }), el('button', { class: 'btn ghost', text: 'Paste pose', title: 'Ctrl+V (Ctrl+Shift+V mirrored)', disabled: !clip, onclick: () => pastePose(false) })),
      el('div', { class: 'tlwrap' }, timeline()), el('div', { class: 'checkslot' }, checkRow()), sel, el('h3', { text: 'Bones' }), list)];
  }
  // one loop of the animation as a WebM video of the stage, from the current view
  async function recordVideo() {
    const v = document.getElementById('view'), cv = v && v.tagName === 'CANVAS' ? v : v?.querySelector('canvas'); if (!cv || !window.MediaRecorder) return say('This browser cannot record video', true);
    const type = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t)); if (!type) return say('This browser cannot record video', true);
    const name = AN.name, keep = st.anim.t; st.boneGizmo(null); st.onion(null); const rec = new MediaRecorder(cv.captureStream(60), { mimeType: type, videoBitsPerSecond: 8e6 }), parts = [];
    rec.ondataavailable = e => { if (e.data.size) parts.push(e.data); }; const done = new Promise(ok => { rec.onstop = ok; });
    st.anim.t = 0; st.anim.playing = true; rec.start(); recording = true; render();
    await new Promise(ok => setTimeout(ok, (AN.a.duration / 60) * 1000 + 120)); rec.stop(); await done; recording = false; st.anim.playing = false;
    download(new Blob(parts, { type: 'video/webm' }), 'video/webm', fileName(name, '.webm')); st.anim.t = keep; if (AN) show(); render(); }
  let recording = false;
  function checkRow() { const ck = AN.checks; if (!ck || (!ck.pops.length && !ck.clips.length && !ck.seam)) return null;
    const go = f => { st.anim.t = f; st.anim.playing = false; show(); render(); };
    return el('div', { class: 'checks' }, ck.pops.length ? el('button', { class: 'chip bad', text: `Pops ${ck.pops.length}`, onclick: () => go(ck.pops.find(f => f > frame()) ?? ck.pops[0]) }) : null,
      ck.clips.length ? el('button', { class: 'chip warn', text: `Hand in body ${ck.clips.length}`, onclick: () => go(ck.clips.find(f => f > frame()) ?? ck.clips[0]) }) : null,
      ck.seam ? el('button', { class: 'chip bad', text: 'Loop jumps', onclick: () => go(AN.a.duration) }) : null); }
  function panel() { if (!RIG) { rig().then(render).catch(e => say(e.message, true)); } return AN ? editorPanel() : libraryPanel(); }

  // keys: K set key, Delete removes, R / G turn or move, Ctrl+Z / Ctrl+Y undo and redo
  addEventListener('keydown', e => { if (!AN || ctx.tab() !== 'animate' || e.target.matches?.('input:not([type=range]):not([type=checkbox]),textarea,select,[contenteditable]')) return;   /* the frame slider keeps the keys working */
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'c') { e.preventDefault(); copyPose(); } else if ((e.ctrlKey || e.metaKey) && k === 'v') { e.preventDefault(); pastePose(e.shiftKey); }   /* Ctrl+Shift+V pastes it mirrored */
    else if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); undo(e.shiftKey); } else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); undo(true); }
    else if (e.ctrlKey || e.metaKey || e.altKey) return;
    else if (k === 'k' && AN.bone) { e.preventDefault(); keyNow(AN.bone); } else if (k === 'delete' && AN.bone && e.target === document.body) { e.preventDefault(); deleteNow(AN.bone); }
    else if (k === 'o') { ghostsOn = !ghostsOn; ghosts(); render(); } else if (k === 'r') { mode = 'rotate'; placeGizmo(); render(); } else if (k === 'g') { mode = 'move'; placeGizmo(); render(); } });

  rescue().then(() => store.syncFolder()).catch(() => {});   // a rescued edit is saved at start, not when the tab is opened
  return { debug: () => ({ ghostsOn, AN, mode }), panel, pickAt, active: () => !!AN, leave: () => { if (AN) close(); }, refresh: () => { if (AN) placeGizmo(); } };
}
