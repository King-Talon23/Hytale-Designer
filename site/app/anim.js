// .blockyanim read/write and key editing for the Animate tab. The editor works on the game's own format, so a saved file is exactly
// what the game reads: { formatVersion, duration (frames, 60 a second), holdLastKeyframe, nodeAnimations: { bone: { position,
// orientation, shapeStretch, shapeVisible, shapeUvOffset: [{ time, delta, interpolationType }] } } }.
export const TRACKS = ['position', 'orientation', 'shapeStretch', 'shapeVisible', 'shapeUvOffset'];
export const FPS = 60, MAX_FRAMES = 6000, MAX_BONES = 200;
const NAME = /^[^\u0000-\u001f]{1,96}$/;   // bone names as the game writes them (Dress_Base:Pelvis has a colon)
const num = (v, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

// a delta of the right shape for its track (anything else is dropped)
function cleanDelta(track, d) {
  if (track === 'shapeVisible') return typeof d === 'boolean' ? d : null;
  if (!d || typeof d !== 'object') return null;
  if (track === 'orientation') { const q = { x: num(d.x), y: num(d.y), z: num(d.z), w: num(d.w, 1) }, L = Math.hypot(q.x, q.y, q.z, q.w); if (!L) return null; return L > 0.999 && L < 1.001 ? q : { x: q.x / L, y: q.y / L, z: q.z / L, w: q.w / L }; }
  if (track === 'shapeUvOffset') return { x: num(d.x), y: num(d.y) };
  return { x: num(d.x, track === 'shapeStretch' ? 1 : 0), y: num(d.y, track === 'shapeStretch' ? 1 : 0), z: num(d.z, track === 'shapeStretch' ? 1 : 0) };
}
// read: a parsed .blockyanim (game file or ours) made safe to edit; fields the game left out stay out, so writing it back gives the same file
export function read(src) {
  if (!src || typeof src !== 'object' || Array.isArray(src)) throw new Error('That is not an animation file.');
  const out = {}; if ('formatVersion' in src) out.formatVersion = num(src.formatVersion, 1);
  out.duration = Math.max(1, Math.min(MAX_FRAMES, Math.round(num(src.duration, 60)))); out.holdLastKeyframe = !!src.holdLastKeyframe; out.nodeAnimations = {};
  const na = src.nodeAnimations && typeof src.nodeAnimations === 'object' && !Array.isArray(src.nodeAnimations) ? src.nodeAnimations : {};
  for (const [bone, tr] of Object.entries(na).slice(0, MAX_BONES)) {
    if (!NAME.test(bone) || !tr || typeof tr !== 'object') continue; const t2 = {};
    for (const k of TRACKS) { const keys = []; for (const key of Array.isArray(tr[k]) ? tr[k] : []) { const d = cleanDelta(k, key && key.delta); if (d === null || !Number.isFinite(key.time) || key.time < 0 || key.time > out.duration) continue;   /* keys inside the length only */
        const o = { time: key.time, delta: d }; if (typeof key.interpolationType === 'string') o.interpolationType = key.interpolationType === 'linear' ? 'linear' : 'smooth'; keys.push(o); }
      keys.sort((a, b) => a.time - b.time); t2[k] = keys; }
    if (TRACKS.some(k => t2[k].length)) out.nodeAnimations[bone] = t2;   // a bone with no usable keys is left out
  }
  return out;
}
// write: the file text, keys in the game's order
export function write(a) {
  const o = {}; if ('formatVersion' in a) o.formatVersion = a.formatVersion;   // a game file without one stays without one
  o.duration = a.duration; o.holdLastKeyframe = !!a.holdLastKeyframe; o.nodeAnimations = {};
  for (const [bone, tr] of Object.entries(a.nodeAnimations)) { const t2 = {}; for (const k of TRACKS) t2[k] = (tr[k] || []).map(key => ({ time: key.time, delta: key.delta, ...(key.interpolationType ? { interpolationType: key.interpolationType } : {}) })); o.nodeAnimations[bone] = t2; }
  return JSON.stringify(o, null, 2);
}
export const blank = (duration = 60) => ({ formatVersion: 1, duration, holdLastKeyframe: false, nodeAnimations: {} });   // new files carry the version
export const clone = a => JSON.parse(JSON.stringify(a));

// ---- key editing (each returns nothing; the caller snapshots for undo)
const track = (a, bone, k) => { const tr = (a.nodeAnimations[bone] ||= Object.fromEntries(TRACKS.map(t => [t, []]))); return (tr[k] ||= []); };
export function keyAt(a, bone, k, time) { return (a.nodeAnimations[bone]?.[k] || []).find(x => x.time === time) || null; }
export function setKey(a, bone, k, time, delta, interp = 'smooth') {
  time = Math.max(0, Math.min(a.duration, Math.round(time))); const d = cleanDelta(k, delta); if (d === null) return;
  const ks = track(a, bone, k), same = ks.filter(x => x.time === time); if (same.length) { for (const x of same) { x.delta = d; if (interp) x.interpolationType = interp; } return; }   /* two keys on one frame (a cut in some game files) both take the new pose */
  ks.push({ time, delta: d, interpolationType: interp }); ks.sort((x, y) => x.time - y.time);
}
export function deleteKey(a, bone, k, time) { const ks = a.nodeAnimations[bone]?.[k]; if (!ks) return; for (let i = ks.length - 1; i >= 0; i--) if (ks[i].time === time) ks.splice(i, 1); prune(a, bone); }   // every key on that frame
// move every key at one frame (on the given bones) to another frame; a key already there is replaced
export function moveKeys(a, bones, from, to) {
  to = Math.max(0, Math.min(a.duration, Math.round(to))); if (to === from) return;
  for (const bone of bones) for (const k of TRACKS) { const ks = a.nodeAnimations[bone]?.[k]; if (!ks) continue; const moving = ks.filter(x => x.time === from); if (!moving.length) continue;
    for (let i = ks.length - 1; i >= 0; i--) if (ks[i].time === to) ks.splice(i, 1); for (const key of moving) key.time = to; ks.sort((x, y) => x.time - y.time); }
}
export function setDuration(a, n) { a.duration = Math.max(1, Math.min(MAX_FRAMES, Math.round(n))); for (const bone of Object.keys(a.nodeAnimations)) { for (const k of TRACKS) { const ks = a.nodeAnimations[bone][k]; if (ks) a.nodeAnimations[bone][k] = ks.filter(x => x.time <= a.duration); } prune(a, bone); } }
function prune(a, bone) { const tr = a.nodeAnimations[bone]; if (tr && TRACKS.every(k => !(tr[k] || []).length)) delete a.nodeAnimations[bone]; }
// every frame that has a key (for the timeline), per bone or for all
export function keyTimes(a, bone) { const s = new Set(); for (const [b, tr] of Object.entries(a.nodeAnimations)) { if (bone && b !== bone) continue; for (const k of TRACKS) for (const x of tr[k] || []) s.add(x.time); } return [...s].sort((x, y) => x - y); }
// left/right mirror of a whole animation: L- and R- bones swap, x positions and the y/z turn flip
export const sideSwap = n => /^L-/.test(n) ? n.replace(/^L-/, 'R-') : /^R-/.test(n) ? n.replace(/^R-/, 'L-') : /^L_/.test(n) ? n.replace(/^L_/, 'R_') : /^R_/.test(n) ? n.replace(/^R_/, 'L_') : n;
export function mirrorKeyDelta(k, d) { if (k === 'orientation') return { x: d.x, y: -d.y, z: -d.z, w: d.w }; if (k === 'position') return { x: -d.x, y: d.y, z: d.z }; return typeof d === 'object' ? { ...d } : d; }
export function mirror(a, has = () => true) { const out = { ...a, nodeAnimations: {} }; for (const [bone, tr] of Object.entries(a.nodeAnimations)) { const t2 = {}; for (const k of TRACKS) t2[k] = (tr[k] || []).map(x => ({ ...x, delta: mirrorKeyDelta(k, x.delta) })); const to = sideSwap(bone); out.nodeAnimations[to !== bone && has(bone) && !has(to) ? bone : to] = t2; } return out; }   // a bone the model has without a partner (R-Ear2) stays itself, mirrored in place
