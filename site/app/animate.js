// The Animate tab: make player animations in the game's own format. A library of your animations, and the editor: pick a bone
// (list or click on the model), turn or move it with the gizmo or the number fields, keys on a timeline, undo, save.
import * as A from './anim.js';
import * as db from './db.js';
import * as game from './game.js';

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
  let AN = null, LIB = null, RIG = null, mode = 'rotate';

  // ---- the rig: the player's bones, in the model's own order, with their depth for the list
  async function rig() {
    if (RIG) return RIG; const m = await game.json('Common/Characters/Player.blockymodel'), out = [];
    const walk = (ns, d) => { for (const n of ns || []) { if (n.name && n.name !== 'Origin') out.push({ name: n.name, depth: d }); walk(n.children, n.name && n.name !== 'Origin' ? d + 1 : d); } };
    walk(m.nodes, 0); return (RIG = out.filter(b => !/Eyelid|Eyelash/.test(b.name)));
  }
  const group = name => st.anim.figure?.userData.parts.get(name)?.[0] || null;

  // ---- library (meta store, key anim:<id>)
  async function loadLib() { const ks = (await db.keys('meta')).filter(k => String(k).startsWith('anim:')); LIB = (await Promise.all(ks.map(k => db.get('meta', k)))).filter(Boolean).sort((a, b) => b.updated - a.updated); }
  async function save() { if (!AN) return; AN.updated = Date.now(); await db.put('meta', 'anim:' + AN.id, { id: AN.id, name: AN.name, a: AN.a, updated: AN.updated }); AN.dirty = false; }
  let saveT = 0; const queueSave = () => { AN.dirty = true; clearTimeout(saveT); saveT = setTimeout(() => save().catch(e => say(e.message, true)), 500); };

  // ---- editing
  function show() { const sa = st.anim; sa.anim = AN.a; sa.blend = 1; sa.resting = false; sa.apply(); placeGizmo(); }
  const frame = () => Math.max(0, Math.min(AN.a.duration, Math.round(st.anim.t)));
  function step() { AN.hist.push(JSON.stringify(AN.a)); if (AN.hist.length > 200) AN.hist.shift(); AN.fut = []; }   // before every change
  function undo(redo) { const from = redo ? AN.fut : AN.hist, to = redo ? AN.hist : AN.fut; if (!from.length) return; to.push(JSON.stringify(AN.a)); AN.a = JSON.parse(from.pop()); show(); queueSave(); render(); }
  function open(rec) { AN = { id: rec.id, name: rec.name, a: A.read(rec.a), bone: null, hist: [], fut: [], dirty: false }; st.anim.playing = false; st.anim.t = 0; show(); render(); }
  function close() { if (AN?.dirty) save(); AN = null; st.boneGizmo(null); render(); }
  async function create(src, name) { const rec = { id: crypto.randomUUID(), name: name || 'My animation', a: src ? A.read(src) : A.blank(60), updated: Date.now() }; await db.put('meta', 'anim:' + rec.id, rec); await loadLib(); open(rec); }

  // the bone's pose now (interpolated), as the fields show it
  function pose(bone) { const g = group(bone); if (!g) return null; const r = g.userData.rest, q = r.q.clone().invert().multiply(g.quaternion);
    return { rot: toEuler(q), pos: [g.position.x - r.p.x, g.position.y - r.p.y, g.position.z - r.p.z] }; }
  function setPose(bone, part, delta, interp) { A.setKey(AN.a, bone, part, frame(), delta, interp || A.keyAt(AN.a, bone, part, frame())?.interpolationType || 'smooth'); show(); queueSave(); }
  function keyNow(bone) { const p = pose(bone); if (!p) return; step(); setPose(bone, 'orientation', fromEuler(...p.rot)); setPose(bone, 'position', { x: p.pos[0], y: p.pos[1], z: p.pos[2] }); render(); }
  function deleteNow(bone) { const f = frame(); if (!A.TRACKS.some(k => A.keyAt(AN.a, bone, k, f))) return; step(); for (const k of A.TRACKS) A.deleteKey(AN.a, bone, k, f); show(); queueSave(); render(); }

  function placeGizmo() { if (!AN || !AN.bone) { st.boneGizmo(null); return; } const g = group(AN.bone); if (!g) { st.boneGizmo(null); return; }
    st.boneGizmo({ g, mode, onChange: (d, end) => { if (!gizmoStep) { step(); gizmoStep = true; } const part = Object.keys(d)[0]; A.setKey(AN.a, AN.bone, part, frame(), d[part], A.keyAt(AN.a, AN.bone, part, frame())?.interpolationType || 'smooth');
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
    function draw() { W = cv.clientWidth || 300; cv.width = W; const c = cv.getContext('2d'), n = AN.a.duration, now = frame();
      c.fillStyle = '#0d1a2b'; c.fillRect(0, 0, W, cv.height); c.font = '11px system-ui'; c.textBaseline = 'middle';
      const stepF = n > 300 ? 60 : n > 120 ? 30 : n > 40 ? 10 : 5; for (let f = 0; f <= n; f += stepF) { const x = fx(f); c.fillStyle = '#2a3d58'; c.fillRect(x, TOP, 1, cv.height - TOP); c.fillStyle = '#8aa0ba'; c.fillText(String(f), x + 2, TOP / 2); }
      rows.forEach((b, i) => { const y = TOP + i * RH; c.fillStyle = b === AN.bone ? '#1d3352' : i % 2 ? '#101f33' : '#0f1d30'; c.fillRect(0, y, W, RH); c.fillStyle = b === AN.bone ? '#f4c452' : '#c9d6e6'; c.fillText(b.length > 13 ? b.slice(0, 12) + '…' : b, 4, y + RH / 2);
        for (const t of A.keyTimes(AN.a, b)) { const x = fx(t), cy = y + RH / 2; c.save(); c.translate(x, cy); c.rotate(Math.PI / 4); c.fillStyle = t === now ? '#f4c452' : '#9fd0ff'; c.fillRect(-4, -4, 8, 8); c.restore(); } });
      const px = fx(now); c.fillStyle = '#f4c452'; c.fillRect(px - 1, 0, 2, cv.height); }
    const at = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    cv.onpointerdown = e => { const p = at(e), row = Math.floor((p.y - TOP) / RH), bone = p.y >= TOP ? rows[row] : null; if (p.x < LW) { if (bone) { AN.bone = bone; placeGizmo(); render(); } return; }
      const f = Math.max(0, Math.min(AN.a.duration, xf(p.x))), hit = bone && A.keyTimes(AN.a, bone).find(t => Math.abs(fx(t) - p.x) <= 6);
      if (bone && AN.bone !== bone) { AN.bone = bone; }
      if (hit !== undefined && hit !== null && bone) { drag = { bone, from: hit, to: hit, stepped: false }; st.anim.t = hit; } else { st.anim.t = f; drag = { seek: true }; }
      st.anim.playing = false; show(); draw(); cv.setPointerCapture?.(e.pointerId); };
    cv.onpointermove = e => { if (!drag) return; const f = Math.max(0, Math.min(AN.a.duration, xf(at(e).x)));
      if (drag.seek) { st.anim.t = f; show(); draw(); return; }
      if (f !== drag.to) { if (!drag.stepped) { step(); drag.stepped = true; } A.moveKeys(AN.a, [drag.bone], drag.to, f); drag.to = f; st.anim.t = f; show(); draw(); } };
    cv.onpointerup = () => { if (drag && drag.stepped) queueSave(); const was = drag; drag = null; if (was) render(); };
    cv.onkeydown = e => { if (e.key === 'Delete' && AN.bone) { e.preventDefault(); deleteNow(AN.bone); } };
    requestAnimationFrame(draw); const tick = () => { if (!cv.isConnected) return; if (st.anim.playing) draw(); requestAnimationFrame(tick); }; requestAnimationFrame(tick); cv.redraw = draw; return cv;
  }

  // ---- panels
  function libraryPanel() {
    if (!LIB) { loadLib().then(render); return [head('Animate'), el('div', { class: 'pbody' }, el('p', { class: 'dim', text: 'Loading…' }))]; }
    const CAT = CATS(), groups = Object.keys(CAT.anims || {}).sort();
    const pick = el('select', { 'aria-label': 'Game animation' }, el('option', { value: '', text: 'Copy a game animation…' }),
      ...groups.map(g => el('optgroup', { label: nice(g) }, ...(CAT.anims[g] || []).map(n => el('option', { value: g + '/' + n, text: nice(n) })))));
    pick.onchange = async () => { const v = pick.value; if (!v) return; const [g, ...rest] = v.split('/'), n = rest.join('/'); const src = await game.json(`Common/Characters/Animations/${g}/${n}.blockyanim`); create(src, nice(n) + ' (mine)'); };
    return [head('Animate'), el('div', { class: 'pbody' },
      el('div', { class: 'row' }, el('button', { class: 'btn primary', text: 'New', onclick: () => create(null) }), pick),
      el('h3', { text: 'My animations' }),
      LIB.length ? el('div', { class: 'animlib' }, LIB.map(rec => el('div', { class: 'animrow' },
        el('button', { class: 'animopen', onclick: () => open(rec) }, el('b', { text: rec.name }), el('small', { text: `${(rec.a.duration / 60).toFixed(2)} s` })),
        el('button', { class: 'mini', text: 'Export', onclick: () => { const a = el('a', { href: URL.createObjectURL(new Blob([A.write(rec.a)], { type: 'application/json' })), download: rec.name.replace(/[\\/:*?"<>|]/g, '') + '.blockyanim' }); document.body.appendChild(a); a.click(); a.remove(); } }),
        el('button', { class: 'mini', text: 'Delete', onclick: async () => { const v = await ask('Delete animation', el('p', { text: `"${rec.name}" will be deleted.` }), [{ label: 'Cancel', value: '' }, { label: 'Delete', value: 'yes', danger: true }]); if (v !== 'yes') return; await db.del('meta', 'anim:' + rec.id); await loadLib(); render(); } }))))
        : el('p', { class: 'dim', text: 'None yet.' }))];
  }
  function editorPanel() {
    const a = AN.a, bones = RIG || [], f = frame();
    const nameIn = el('input', { type: 'text', class: 'wsname', value: AN.name, maxLength: 60, 'aria-label': 'Name', onchange: e => { AN.name = e.target.value.trim().slice(0, 60) || AN.name; e.target.value = AN.name; queueSave(); } });
    const len = el('input', { type: 'number', min: 1, max: A.MAX_FRAMES, value: a.duration, class: 'adjnum', 'aria-label': 'Length in frames', onchange: e => { const v = Math.round(+e.target.value); if (!(v >= 1)) { e.target.value = a.duration; return; } step(); A.setDuration(a, v); if (st.anim.t > a.duration) st.anim.t = a.duration; show(); queueSave(); render(); } });
    const loop = el('input', { type: 'checkbox', checked: !a.holdLastKeyframe, onchange: e => { step(); a.holdLastKeyframe = !e.target.checked; queueSave(); } });
    const p = AN.bone ? pose(AN.bone) : null, hasKey = AN.bone && A.TRACKS.some(k => A.keyAt(a, AN.bone, k, f));
    const field = (label, v, set) => el('label', { class: 'axf' }, el('span', { text: label }), el('input', { type: 'number', step: 1, value: r1(v), onchange: e => { const n = +e.target.value; if (!Number.isFinite(n)) { e.target.value = r1(v); return; } step(); set(n); render(); } }));
    const sel = AN.bone && p ? el('div', { class: 'bonebox' },
      el('div', { class: 'row' }, el('b', { text: AN.bone }), el('button', { class: 'mini' + (mode === 'rotate' ? ' on' : ''), text: 'Turn', title: 'R', onclick: () => { mode = 'rotate'; placeGizmo(); render(); } }), el('button', { class: 'mini' + (mode === 'move' ? ' on' : ''), text: 'Move', title: 'G', onclick: () => { mode = 'move'; placeGizmo(); render(); } })),
      el('div', { class: 'xyzrow' }, el('span', { class: 'dim', text: 'Turn' }), ...['X', 'Y', 'Z'].map((k, i) => field(k, p.rot[i], n => { const e = [...p.rot]; e[i] = n; setPose(AN.bone, 'orientation', fromEuler(...e)); }))),
      el('div', { class: 'xyzrow' }, el('span', { class: 'dim', text: 'Move' }), ...['X', 'Y', 'Z'].map((k, i) => field(k, p.pos[i], n => { const v = [...p.pos]; v[i] = n; setPose(AN.bone, 'position', { x: v[0], y: v[1], z: v[2] }); }))),
      el('div', { class: 'row' }, el('button', { class: 'btn ghost', text: hasKey ? 'Key set' : 'Set key', title: 'K', disabled: !!hasKey, onclick: () => keyNow(AN.bone) }),
        el('button', { class: 'btn ghost', text: 'Delete key', disabled: !hasKey, onclick: () => deleteNow(AN.bone) }),
        hasKey ? el('select', { 'aria-label': 'Easing', onchange: e => { step(); for (const k of A.TRACKS) { const key = A.keyAt(a, AN.bone, k, f); if (key) key.interpolationType = e.target.value; } show(); queueSave(); } },
          ...[['smooth', 'Smooth'], ['linear', 'Linear']].map(([v, t]) => el('option', { value: v, text: t, selected: (A.TRACKS.map(k => A.keyAt(a, AN.bone, k, f)).find(Boolean)?.interpolationType || 'smooth') === v }))) : null))
      : el('p', { class: 'dim', text: 'Pick a bone in the list or on the model.' });
    const list = el('div', { class: 'bonelist' }, bones.map(b => el('button', { class: 'bonerow' + (b.name === AN.bone ? ' on' : '') + (a.nodeAnimations[b.name] ? ' keyed' : ''), style: `padding-left:${6 + b.depth * 10}px`, text: b.name, onclick: () => { AN.bone = b.name; placeGizmo(); render(); } })));
    return [head('Animate'), el('div', { class: 'pbody animedit' },
      el('div', { class: 'row' }, nameIn, el('button', { class: 'btn ghost', text: '↶', title: 'Undo (Ctrl+Z)', disabled: !AN.hist.length, onclick: () => undo(false) }), el('button', { class: 'btn ghost', text: '↷', title: 'Redo (Ctrl+Y)', disabled: !AN.fut.length, onclick: () => undo(true) }), el('button', { class: 'btn primary', text: 'Done', onclick: close })),
      el('div', { class: 'row' }, el('label', { class: 'axf' }, el('span', { text: 'Frames' }), len), el('label', { class: 'chk' }, loop, el('span', { text: 'Loop' })),
        el('button', { class: 'btn ghost', text: 'Mirror', title: 'Swap left and right', onclick: () => { step(); AN.a = A.mirror(AN.a); show(); queueSave(); render(); } })),
      timeline(), sel, el('h3', { text: 'Bones' }), list)];
  }
  function panel() { if (!RIG) { rig().then(render).catch(e => say(e.message, true)); } return AN ? editorPanel() : libraryPanel(); }

  // keys: K set key, Delete removes, R / G turn or move, Ctrl+Z / Ctrl+Y undo and redo
  addEventListener('keydown', e => { if (!AN || ctx.tab() !== 'animate' || e.target.matches?.('input,textarea,select,[contenteditable]')) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); undo(e.shiftKey); } else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); undo(true); }
    else if (e.ctrlKey || e.metaKey || e.altKey) return;
    else if (k === 'k' && AN.bone) { e.preventDefault(); keyNow(AN.bone); } else if ((k === 'delete' || k === 'x') && AN.bone && e.target === document.body) { e.preventDefault(); deleteNow(AN.bone); }
    else if (k === 'r') { mode = 'rotate'; placeGizmo(); render(); } else if (k === 'g') { mode = 'move'; placeGizmo(); render(); } });

  return { panel, pickAt, active: () => !!AN, leave: () => { if (AN) close(); }, refresh: () => { if (AN) placeGizmo(); } };
}
