// Builds the character in 3D from the game's own model and texture files, and plays the game's own animations on it.
import * as THREE from '../vendor/three.module.min.js';
import { TransformControls } from '../vendor/TransformControls.js';
import * as game from './game.js';
import { FIELDS } from './game.js';
import { BLOCKS, SET_PIECES } from './scene-data.js';

const cache = new Map(),
  once = (k, f) => (cache.has(k) ? cache.get(k) : (cache.set(k, f()), cache.get(k)));
export const clearCache = () => cache.clear();
// a custom asset's texture comes from the asset creator (the live canvas while it is being painted), not from the game files
let customSource = null;
export const setCustomSource = f => {
  customSource = f;
};
let shapeSource = null;
export const setShapeSource = f => {
  shapeSource = f;
}; // 'shape:<id>@<version>' -> model JSON
export function refreshCustom(id) {
  for (const [k, v] of cache)
    if (k.startsWith('t:custom:' + id + '@'))
      v.then(
        T => {
          T.mat.map.needsUpdate = true;
        },
        () => {}
      );
}
export async function bakedCanvas(tex, tint) {
  const T = await texture(tex, tint),
    c = document.createElement('canvas');
  c.width = T.w;
  c.height = T.h;
  c.getContext('2d').drawImage(T.mat.map.image, 0, 0);
  return c;
}
// None eyes: a face has two holes where the eye pieces sit, painted round with lids, lashes and makeup, and blink lids over them. Each hole and its rim (2 px to
// the sides, 4 above, 1 below) is refilled column by column, blending from the skin just above it to the skin just below (window medians), so the
// eye area reads as plain skin with the face's own shading.
function smoothEyes(d) {
  const { width: w, height: h, data: a } = d,
    sc = Math.max(1, Math.round(w / 64)),
    fw = 30 * sc,
    fh = 28 * sc, // the front of the face on its texture
    seen = new Uint8Array(w * h),
    clear = (x, y) => a[(y * w + x) * 4 + 3] === 0;
  // the face model's blink lids and lashes take their pixels from these areas: cleared, so they draw nothing
  for (const [x1, y1, x2, y2] of [
    [14, 38, 52, 52],
    [30, 0, 64, 28],
  ])
    for (let y = y1 * sc; y < Math.min(h, y2 * sc); y++) for (let x = x1 * sc; x < Math.min(w, x2 * sc); x++) a[(y * w + x) * 4 + 3] = 0;
  for (let y0 = 0; y0 < fh; y0++)
    for (let x0 = 0; x0 < fw; x0++) {
      if (seen[y0 * w + x0] || !clear(x0, y0)) continue;
      let [l, r, t, b] = [x0, x0, y0, y0];
      const st = [[x0, y0]];
      seen[y0 * w + x0] = 1;
      while (st.length) {
        const [x, y] = st.pop();
        l = Math.min(l, x);
        r = Math.max(r, x);
        t = Math.min(t, y);
        b = Math.max(b, y);
        for (const [nx, ny] of [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ])
          if (nx >= 0 && ny >= 0 && nx < fw && ny < fh && !seen[ny * w + nx] && clear(nx, ny)) {
            seen[ny * w + nx] = 1;
            st.push([nx, ny]);
          }
      }
      if ((r - l + 1) * (b - t + 1) < 4 * sc * sc) continue; // a stray clear pixel, not an eye hole
      (l = Math.max(0, l - 2 * sc)), (r = Math.min(fw - 1, r + 2 * sc)), (t = Math.max(1, t - 4 * sc)), (b = Math.min(fh - 2, b + sc));
      // the skin at each edge: the median of a 5 x 2 window, so a freckle or wrinkle there isn't stretched into a streak
      const edge = (x, ys) => {
        const px = [];
        for (const y of ys)
          for (let xx = Math.max(0, x - 2 * sc); xx <= Math.min(w - 1, x + 2 * sc); xx++) {
            const k = (y * w + xx) * 4;
            if (y >= 0 && y < h && a[k + 3]) px.push([a[k], a[k + 1], a[k + 2]]);
          }
        px.sort((p, q) => p[0] + p[1] + p[2] - q[0] - q[1] - q[2]);
        return px[px.length >> 1] || [228, 228, 228];
      };
      const tops = [],
        bots = [];
      for (let x = l; x <= r; x++) tops.push(edge(x, [t - 1, t - 2])), bots.push(edge(x, [b + 1, b + 2]));
      for (let x = l; x <= r; x++)
        for (let y = t; y <= b; y++) {
          const k = (y * w + x) * 4,
            f = (y - t + 1) / (b - t + 2),
            [up, dn] = [tops[x - l], bots[x - l]];
          for (let c = 0; c < 3; c++) a[k + c] = Math.round(up[c] * (1 - f) + dn[c] * f);
          a[k + 3] = 255;
        }
    }
}
async function pixels(p) {
  if (p.startsWith('noeyes:')) {
    const r = await pixels(p.slice(7));
    smoothEyes(r.d);
    r.x.putImageData(r.d, 0, 0);
    return r;
  }
  if (p.startsWith('custom:')) {
    const c = await customSource(p.slice(7).split('@')[0]),
      x = c.getContext('2d', { willReadFrequently: true });
    return { c, x, d: x.getImageData(0, 0, c.width, c.height) };
  }
  const i = await game.bitmap(game.common(p)),
    c = document.createElement('canvas');
  c.width = i.width;
  c.height = i.height;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(i, 0, 0);
  return { c, x, d: x.getImageData(0, 0, i.width, i.height) };
}
const texture = (tex, tint) =>
  once('t:' + tex + '|' + tint, async () => {
    const { c, x, d } = await pixels(tex);
    if (tint) {
      const g = (await pixels(tint)).d,
        gw = g.width,
        a = d.data; // the gradient is a ramp: a grey texel takes the ramp's colour at its own brightness; coloured texels stay
      for (let i = 0; i < a.length; i += 4)
        if (a[i + 3] && Math.abs(a[i] - a[i + 1]) < 3 && Math.abs(a[i + 1] - a[i + 2]) < 3) {
          const k = Math.min(gw - 1, Math.round((a[i] * (gw - 1)) / 255)) * 4;
          a[i] = g.data[k];
          a[i + 1] = g.data[k + 1];
          a[i + 2] = g.data[k + 2];
        }
      x.putImageData(d, 0, 0);
    }
    const t = new THREE.CanvasTexture(c);
    t.magFilter = t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    t.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshLambertMaterial({ map: t, alphaTest: 0.05, side: THREE.DoubleSide, fog: false });
    // centroid sampling: antialiased edge pixels look up the texture inside the face, not past its edge (that drew thin lines along box edges)
    mat.onBeforeCompile = sh => {
      const c = k => THREE.ShaderChunk[k].replace(/varying vec2/g, 'centroid varying vec2');
      sh.vertexShader = sh.vertexShader.replace('#include <uv_pars_vertex>', c('uv_pars_vertex'));
      sh.fragmentShader = sh.fragmentShader.replace('#include <uv_pars_fragment>', c('uv_pars_fragment'));
    };
    mat.customProgramCacheKey = () => 'centroid-uv';
    return { mat, w: c.width, h: c.height };
  });

// ---- a blockymodel box/quad as a mesh
const FACES = {
  front: [2, 1, 0, 1, 1, -1],
  back: [2, -1, 0, -1, 1, -1],
  right: [0, 1, 2, -1, 1, -1],
  left: [0, -1, 2, 1, 1, -1],
  top: [1, 1, 0, 1, 2, -1],
  bottom: [1, -1, 0, 1, 2, 1],
};
const S = 0.7071068,
  QUADROT = { '+Z': [0, 0, 0, 1], '-Z': [0, 1, 0, 0], '+Y': [-S, 0, 0, S], '-Y': [S, 0, 0, S], '+X': [0, S, 0, S], '-X': [0, -S, 0, S] };
const xyz = (o, d = 0) => [o?.x ?? d, o?.y ?? d, o?.z ?? d];
export function usedRects(modelJson) {
  const out = [];
  // each rect is named by the way that face really points on the model (a quad's 'front' may face sideways, a turned part's faces turn with it)
  const DIR = [
      ['right', 'left'],
      ['top', 'bottom'],
      ['front', 'back'],
    ],
    facing = (name, q) => {
      const [ax, sg] = FACES[name],
        v = new THREE.Vector3();
      v.setComponent(ax, sg);
      v.applyQuaternion(q);
      const a = [v.x, v.y, v.z].map(Math.abs),
        k = a.indexOf(Math.max(...a));
      return DIR[k][v.getComponent(k) > 0 ? 0 : 1];
    };
  const walk = (n, pq = new THREE.Quaternion()) => {
    const sh = n.shape || {},
      o = n.orientation,
      q = pq.clone().multiply(new THREE.Quaternion(o?.x ?? 0, o?.y ?? 0, o?.z ?? 0, o?.w ?? 1));
    if ((sh.type === 'box' || sh.type === 'quad') && sh.visible !== false) {
      const size = xyz(sh.settings?.size),
        lay = sh.textureLayout || {},
        fq = sh.type === 'quad' ? q.clone().multiply(new THREE.Quaternion(...(QUADROT[sh.settings?.normal] || QUADROT['+Z']))) : q;
      for (const [name, [, , ua, , va]] of Object.entries(sh.type === 'quad' ? { front: FACES.front } : FACES)) {
        const fl = lay[name];
        if (!fl) continue;
        const fu = size[ua],
          fv = size[va];
        if (fu <= 0 || fv <= 0) continue;
        const ox = fl.offset?.x ?? 0,
          oy = fl.offset?.y ?? 0,
          a = (((fl.angle | 0) % 360) + 360) % 360,
          xs = [],
          ys = [];
        for (const [su, sv] of [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ]) {
          const pu = su * fu * (fl.mirror?.x ? -1 : 1),
            pv = sv * fv * (fl.mirror?.y ? -1 : 1);
          const [X, Y] =
            a === 90 ? [ox - pv, oy + pu] : a === 180 ? [ox - pu, oy - pv] : a === 270 ? [ox + pv, oy - pu] : [ox + pu, oy + pv];
          xs.push(X);
          ys.push(Y);
        }
        out.push({
          x: Math.min(...xs),
          y: Math.min(...ys),
          w: Math.max(...xs) - Math.min(...xs),
          h: Math.max(...ys) - Math.min(...ys),
          face: facing(name, fq),
          node: n.name,
        });
      }
    }
    for (const c of n.children || []) walk(c, q);
  };
  for (const n of modelJson.nodes || []) walk(n);
  return out;
}
function shapeMesh(sh, T) {
  const size = xyz(sh.settings?.size),
    st = xyz(sh.stretch, 1),
    off = xyz(sh.offset),
    half = size.map(v => v / 2),
    quad = sh.type === 'quad';
  if (quad) half[2] = 0;
  const qr = new THREE.Quaternion(...(quad ? QUADROT[sh.settings?.normal] || QUADROT['+Z'] : QUADROT['+Z'])),
    lay = sh.textureLayout || {},
    pos = [],
    uv = [],
    idx = [],
    fuv = [];
  for (const [name, [na, ns, ua, us, va, vs]] of Object.entries(quad ? { front: FACES.front } : FACES)) {
    const fl = lay[name];
    if (!fl) continue;
    const fu = size[ua],
      fv = size[va];
    if (fu <= 0 || fv <= 0) continue;
    const ox = fl.offset?.x ?? 0,
      oy = fl.offset?.y ?? 0,
      a = (((fl.angle | 0) % 360) + 360) % 360,
      b = pos.length / 3;
    for (const [su, sv] of [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]) {
      const g = [0, 0, 0];
      g[na] = ns * half[na];
      g[ua] = us * (su - 0.5) * size[ua];
      g[va] = vs * (sv - 0.5) * size[va];
      const v = new THREE.Vector3(...g).applyQuaternion(qr);
      pos.push(v.x * st[0] + off[0], v.y * st[1] + off[1], v.z * st[2] + off[2]);
      // mirrored (that axis runs back from the offset), then turned about the offset by the angle
      const pu = su * fu * (fl.mirror?.x ? -1 : 1),
        pv = sv * fv * (fl.mirror?.y ? -1 : 1);
      const [X, Y] = a === 90 ? [ox - pv, oy + pu] : a === 180 ? [ox - pu, oy - pv] : a === 270 ? [ox + pv, oy - pu] : [ox + pu, oy + pv];
      fuv.push(X, Y);
    }
    // pull the corners a hair inside the face's rectangle: with antialiasing, edge pixels otherwise sample the texel next door and draw thin lines along box edges
    const cx = (fuv[0] + fuv[2] + fuv[4] + fuv[6]) / 4,
      cy = (fuv[1] + fuv[3] + fuv[5] + fuv[7]) / 4,
      E = 1 / 64;
    for (let k = 0; k < 8; k += 2) {
      const X = fuv[k] + Math.sign(cx - fuv[k]) * E,
        Y = fuv[k + 1] + Math.sign(cy - fuv[k + 1]) * E;
      uv.push(X / T.w, 1 - Y / T.h);
    }
    fuv.length = 0;
    idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
  }
  if (!idx.length) return null;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, T.mat);
  mesh.userData.texel = st;
  mesh.userData.off = off;
  mesh.userData.tex = [T.w, T.h];
  return mesh; // off and tex: face animations stretch the shape about its offset and slide its texture
}
// a node: its pivot group, its own shape, and a child holder at the shape's offset (children hang from pivot + offset)
function node(n, T, bones, parts) {
  const g = new THREE.Group();
  g.position.set(...xyz(n.position));
  const o = n.orientation;
  if (o) g.quaternion.set(o.x ?? 0, o.y ?? 0, o.z ?? 0, o.w ?? 1);
  const sh = n.shape || {};
  if ((sh.type === 'box' || sh.type === 'quad') && sh.visible !== false) {
    const m = shapeMesh(sh, T);
    if (m) {
      g.add(m);
      g.userData.mesh = m;
      m.userData.nodeName = n.name;
    }
  }
  const kids = new THREE.Group();
  kids.position.set(...xyz(sh.offset));
  g.add(kids);
  if (bones && !bones[n.name]) bones[n.name] = kids;
  if (n.name) {
    g.userData.rest = { p: g.position.clone(), q: g.quaternion.clone() };
    (parts.get(n.name) || parts.set(n.name, []).get(n.name)).push(g);
  }
  for (const c of n.children || []) kids.add(node(c, T, bones, parts));
  return g;
}
// a cosmetic's pieces sit under empty nodes named after the body's bones: re-hang them on that bone
function attach(ns, T, bones, parts) {
  for (const n of ns) {
    const b = bones[n.name];
    if (!b) {
      attach(n.children || [], T, bones, parts);
      continue;
    }
    for (const c of n.children || []) if (!bones[c.name]) b.add(node(c, T, null, parts));
    for (const c of n.children || []) {
      const bb = bones[c.name],
        pg = bb && bb.parent,
        sh = c.shape || {}; /* a piece named like a body bone (the face's eyelids) keeps its own shape, on that bone */
      if (pg && !pg.userData.mesh && (sh.type === 'box' || sh.type === 'quad') && sh.visible !== false) {
        const m = shapeMesh(sh, T);
        if (m) {
          pg.add(m);
          pg.userData.mesh = m;
          m.userData.nodeName = c.name;
        }
      }
    }
    attach(
      (n.children || []).filter(c => bones[c.name]),
      T,
      bones,
      parts
    );
  }
}
export async function build(skin, R) {
  const list = FIELDS.map(f => [f, R.resolve(f, skin)])
    .filter(p => p[1])
    .map(([f, r]) => (f === 'face' && !skin.eyes ? [f, { ...r, tex: 'noeyes:' + r.tex }] : [f, r])); // None eyes: no eye holes
  const loaded = (
    await Promise.all(
      list.map(async ([f, r]) => {
        try {
          return [
            f,
            r.model.startsWith('shape:') ? await shapeSource(r.model.slice(6).split('@')[0]) : await game.json(game.common(r.model)),
            await texture(r.tex, r.tint),
          ];
        } catch (e) {
          console.warn(f, e.message);
          return null;
        }
      })
    )
  ).filter(Boolean);
  const root = new THREE.Group(),
    bones = {},
    parts = new Map(),
    body = loaded.find(l => l[0] === 'bodyCharacteristic');
  if (!body) throw new Error('the body model is missing from the game files');
  for (const n of body[1].nodes) root.add(node(n, body[2], bones, parts));
  for (const [f, m, T] of loaded) if (f !== 'bodyCharacteristic') attach(m.nodes, T, bones, parts);
  root.userData.parts = parts;
  root.userData.bones = bones;
  return root;
}
// an animal (or any model with attachments) built the same way, for the Mount moves
export async function buildCreature(cfg) {
  const m = await game.json(game.common(cfg.model)),
    T = await texture(cfg.tex),
    root = new THREE.Group(),
    bones = {},
    parts = new Map();
  for (const n of m.nodes) root.add(node(n, T, bones, parts));
  for (const a of cfg.atts || []) {
    try {
      attach((await game.json(game.common(a.model))).nodes, await texture(a.tex), bones, parts);
    } catch (e) {
      console.warn(a.model, e.message);
    }
  }
  root.userData.parts = parts;
  return root;
}
// a held thing from game.PROPS, drawn as big as the game draws it in the hand (Spellbook 1.3)
export async function buildProp(k) {
  const [model, tex, scale = 1] = game.PROPS[k];
  const root = model ? await buildCreature({ model, tex }) : await buildBlock(tex);
  root.scale.setScalar(scale);
  return root;
}
// a block held in the hand: a cube wearing the block's texture on every side, about 40 units across as in game
// (measured 2026-11-23 on Show Block: 1.35 times the head's width, its top 150 above the feet)
export async function buildBlock(tex, size = 40) {
  const T = await texture(tex),
    root = new THREE.Group(),
    m = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), T.mat);
  m.position.y = size / 2 + 2;
  root.add(m);
  root.userData.parts = new Map();
  return root;
}
export function dispose(root) {
  root?.traverse(o => o.geometry?.dispose());
}

// ---- animation: .blockyanim keyframes are deltas on the rest pose, 60 frames a second
const q0 = new THREE.Quaternion(),
  q1 = new THREE.Quaternion();
function span(keys, T, dur, loop) {
  // the two keyframes around T and how far between them
  const n = keys.length;
  if (!n) return null;
  if (n === 1) return [keys[0], keys[0], 0];
  if (T < keys[0].time || T > keys[n - 1].time) {
    // a frame exactly on the first or last key is that key
    if (!loop) return T <= keys[0].time ? [keys[0], keys[0], 0] : [keys[n - 1], keys[n - 1], 0];
    const a = keys[n - 1],
      b = keys[0],
      gap = b.time + dur - a.time;
    return [a, b, gap > 0 ? ((T >= a.time ? T : T + dur) - a.time) / gap : 0];
  }
  let i = 1;
  while (keys[i].time < T) i++;
  const a = keys[i - 1],
    b = keys[i];
  return [a, b, (T - a.time) / (b.time - a.time || 1)];
}
// 'smooth' keys (most of the game's) run on a Catmull-Rom curve through the keys around them, like Blockbench's smooth; 'linear' stays straight
const isSmooth = (a, b) => a.interpolationType === 'smooth' || b.interpolationType === 'smooth';
function around(keys, a, b, loop) {
  const n = keys.length,
    i = keys.indexOf(a),
    j = keys.indexOf(b);
  const pi = i > 0 ? i - 1 : loop ? n - 1 : i,
    nj = j < n - 1 ? j + 1 : loop ? 0 : j;
  return [keys[pi], keys[nj]];
}
const cr = (p0, p1, p2, p3, u) => {
  const u2 = u * u,
    u3 = u2 * u;
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
};
// a face shape's animated stretch (about its own offset) and texture slide; null puts it back
function faceShape(m, stretch, uvOff) {
  const o = m.userData.off || [0, 0, 0],
    k = stretch || [1, 1, 1];
  m.scale.set(k[0], k[1], k[2]);
  m.position.set(o[0] * (1 - k[0]), o[1] * (1 - k[1]), o[2] * (1 - k[2]));
  const uv = m.geometry.attributes.uv,
    base = (m.userData.uv0 ||= Float32Array.from(uv.array)),
    [w, h] = m.userData.tex || [1, 1],
    du = uvOff ? uvOff[0] / w : 0,
    dv = uvOff ? uvOff[1] / h : 0; /* the game's y offset runs up the texture: -20 is 20 texels further down */
  if (du !== m.userData.du || dv !== m.userData.dv) {
    for (let i = 0; i < base.length; i += 2) {
      uv.array[i] = base[i] + du;
      uv.array[i + 1] = base[i + 1] + dv;
    }
    uv.needsUpdate = true;
    m.userData.du = du;
    m.userData.dv = dv;
  }
  m.userData.shaped = !!(stretch || uvOff);
}
// Moves that carry the player across the ground in game (walk, run, dash, roll, swim, fly ...). The animation files only hold the
// body motion, so the stage shows the travel itself: the ground slides under the figure, in units a second ([sideways, forward]).
const STILL = new Set(['Poses', 'Emote', 'Taunt', 'Flavor', 'Expressions', 'Climb', 'Mantle']);
export function motionOf(group, n) {
  if (STILL.has(group) || /Idle|Look|Float|Sink|Step_|Interact|Death|Hurt|Wake|Fall|^Jump(_Crouch)?$|^Crouch$/.test(n)) return null;
  const back = /Back(ward)?$/.test(n),
    left = /_Left$/.test(n),
    right = /_Right$/.test(n);
  let s = /^Dash/.test(n)
    ? 720
    : /^Roll/.test(n)
      ? 380
      : /^Slide/.test(n)
        ? 430
        : /Sprint/.test(n)
          ? 440
          : /^(Fly|Glide)_Fast/.test(n)
            ? 540
            : /^Glide/.test(n)
              ? 380
              : /^Fly_Crouch/.test(n)
                ? 130
                : /^Fly/.test(n)
                  ? 300
                  : /Run_Slow/.test(n)
                    ? 200
                    : /Run/.test(n)
                      ? 300
                      : /Crouch_Walk/.test(n)
                        ? 85
                        : /Walk/.test(n)
                          ? 140
                          : /^Jump_Far/.test(n)
                            ? 260
                            : /^Swim_(Dive_)?Fast/.test(n)
                              ? 260
                              : /^Swim(_Backward|_Dive|_Dive_Backward)?$/.test(n)
                                ? 150
                                : 0;
  if (!s) return null;
  if (back) s *= 0.75;
  return left ? [s, 0] : right ? [-s, 0] : [0, back ? -s : s];
}
const BLEND = 0.28,
  HOLD = 1.4; // seconds to ease into a new move; seconds a one-shot move rests on its last frame before it replays
export class Animator {
  constructor() {
    this.anim = null;
    this.t = 0;
    this.speed = 1;
    this.playing = true;
    this.figure = null;
    this.blend = 1;
    this.held = 0;
    this.move = null;
    this.pulse = false;
    this.resting = false;
    this.pt = 0;
    this.still = false;
  }
  setFigure(root) {
    if (root !== this.figure) this.blend = 1;
    this.figure = root;
    this.apply();
  } // the same figure again (held things hung on it) keeps its blend going
  set(anim, speed = 1, instant = false) {
    if (anim)
      for (const tr of Object.values(anim.nodeAnimations || {}))
        for (const k of ['position', 'orientation', 'shapeVisible', 'shapeStretch', 'shapeUvOffset'])
          (tr[k] ||= []).sort((a, b) => a.time - b.time);
    const times = new Set();
    if (anim)
      for (const tr of Object.values(anim.nodeAnimations || {}))
        for (const ks of Object.values(tr)) if (Array.isArray(ks)) for (const k of ks) times.add(k.time);
    this.blendTime = anim && times.size <= 1 ? 0.5 : BLEND; // a move that is one held pose gets a slower, visible ease into it
    this.still = !!anim && times.size <= 1;
    this.move = null;
    this.pulse = false;
    this.resting = false;
    this.pt = 0;
    this.capture(instant);
    this.anim = anim;
    this.baseSpeed = speed;
    this.t = 0;
    this.held = 0;
    this.apply();
  }
  // travel for this move; a held pose that travels (a dash) is shown as a burst: into the pose, across the ground, back to standing, again
  setMove(v) {
    this.move = v || null;
    this.pulse = !!v && this.still;
    this.resting = false;
    this.pt = 0;
    if (this.pulse) this.blendTime = 0.15;
  }
  get velocity() {
    return this.move && this.anim && this.playing && !this.resting ? this.move : null;
  }
  // remember the pose the figure is in now, so the next move eases out of it instead of snapping
  capture(instant) {
    this.blend = instant || !this.figure ? 1 : 0;
    if (this.blend) return;
    this.figure.userData.parts.forEach(gs =>
      gs.forEach(g => {
        const f = (g.userData.from ||= { p: new THREE.Vector3(), q: new THREE.Quaternion() });
        f.p.copy(g.position);
        f.q.copy(g.quaternion);
      })
    );
  }
  get duration() {
    return Math.max(1, this.anim?.duration || 1);
  }
  update(dt) {
    if (this.blend < 1) this.blend = Math.min(1, this.blend + dt / (this.blendTime || BLEND));
    if (this.pulse && this.playing) {
      this.pt += dt;
      if (!this.resting && this.pt > 0.55) {
        this.capture(false);
        this.blendTime = 0.4;
        this.resting = true;
        this.pt = 0;
      } else if (this.resting && this.pt > 1.0) {
        this.capture(false);
        this.blendTime = 0.15;
        this.resting = false;
        this.pt = 0;
      }
    }
    const A = this.anim;
    if (A && this.playing) {
      const end = this.duration;
      if (this.t < end) this.t += dt * 60 * this.speed * (this.baseSpeed || 1);
      if (this.t >= end) {
        if (!A.holdLastKeyframe) this.t %= end;
        else {
          this.t = end;
          this.held += dt;
          if (this.held > HOLD) {
            this.capture(false);
            this.t = 0;
            this.held = 0;
          }
        }
      }
    } // a one-shot move plays again after a rest
    this.apply();
  }
  apply() {
    const A = this.resting ? null : this.anim,
      parts = this.figure?.userData.parts;
    if (!parts) return;
    parts.forEach(gs =>
      gs.forEach(g => {
        g.position.copy(g.userData.rest.p);
        g.quaternion.copy(g.userData.rest.q);
        const m = g.userData.mesh;
        if (m) {
          m.visible = true;
          if (m.userData.shaped) faceShape(m, null, null);
        }
      })
    );
    if (A) {
      const dur = this.duration,
        loop = !A.holdLastKeyframe,
        T = Math.min(this.t, dur);
      for (const [name, tr] of Object.entries(A.nodeAnimations || {})) {
        const gs = parts.get(name);
        if (!gs) continue;
        const o = span(tr.orientation, T, dur, loop),
          p = span(tr.position, T, dur, loop),
          v = tr.shapeVisible.length ? span(tr.shapeVisible, T, dur, loop) : null;
        for (const g of gs) {
          const r = g.userData.rest;
          if (o) {
            const a = o[0].delta,
              b = o[1].delta;
            q0.set(a.x ?? 0, a.y ?? 0, a.z ?? 0, a.w ?? 1);
            q1.set(b.x ?? 0, b.y ?? 0, b.z ?? 0, b.w ?? 1);
            if (o[0] !== o[1] && o[2] > 0 && o[2] < 1 && isSmooth(o[0], o[1])) {
              const [pk, nk] = around(tr.orientation, o[0], o[1], loop),
                A0 = pk.delta,
                B1 = nk.delta,
                dq = (p, q) => (p.x ?? 0) * (q.x ?? 0) + (p.y ?? 0) * (q.y ?? 0) + (p.z ?? 0) * (q.z ?? 0) + (p.w ?? 1) * (q.w ?? 1),
                s = dq(a, b) < 0 ? -1 : 1,
                s0 = dq(A0, a) < 0 ? -1 : 1,
                s1 = s * (dq(B1, b) < 0 ? -1 : 1); /* all four on the same side as the first key, then a curve per component */
              const C = (k, d) => cr(s0 * (A0[k] ?? d), a[k] ?? d, s * (b[k] ?? d), s1 * (B1[k] ?? d), o[2]);
              q0.set(C('x', 0), C('y', 0), C('z', 0), C('w', 1)).normalize();
              g.quaternion.copy(r.q).multiply(q0);
            } else g.quaternion.copy(r.q).multiply(q0.slerp(q1, o[2]));
          }
          // as in game: a move turns a held item's own parts but does not shift them (checked 2026-11-23: Staff, Battle Axe)
          if (p && !g.userData.held) {
            const a = p[0].delta,
              b = p[1].delta,
              u = p[2];
            let L = k => (a[k] ?? 0) + ((b[k] ?? 0) - (a[k] ?? 0)) * u;
            if (p[0] !== p[1] && u > 0 && u < 1 && isSmooth(p[0], p[1])) {
              const [pk, nk] = around(tr.position, p[0], p[1], loop);
              L = k => cr(pk.delta[k] ?? 0, a[k] ?? 0, b[k] ?? 0, nk.delta[k] ?? 0, u);
            }
            g.position.set(r.p.x + L('x'), r.p.y + L('y'), r.p.z + L('z'));
          }
          const at = s => (s[2] >= 1 - 1e-9 ? s[1] : s[0]); /* held tracks: on a key's own frame, that key */
          if (v && g.userData.mesh) g.userData.mesh.visible = at(v).delta !== false;
          const m = g.userData.mesh;
          if (m && (tr.shapeStretch.length || tr.shapeUvOffset.length)) {
            const sk = tr.shapeStretch.length ? span(tr.shapeStretch, T, dur, loop) : null,
              uk = tr.shapeUvOffset.length ? span(tr.shapeUvOffset, T, dur, loop) : null;
            const L = (a, b, u, k, d) => (a[k] ?? d) + ((b[k] ?? d) - (a[k] ?? d)) * u;
            faceShape(
              m,
              sk && [
                L(sk[0].delta, sk[1].delta, sk[2], 'x', 1),
                L(sk[0].delta, sk[1].delta, sk[2], 'y', 1),
                L(sk[0].delta, sk[1].delta, sk[2], 'z', 1),
              ],
              uk && [at(uk).delta.x ?? 0, at(uk).delta.y ?? 0]
            );
          }
        }
      }
    } /* face: eyelids stretch, the mouth slides to another part of its texture (held until the next key, as in game) */
    if (this.blend < 1) {
      const k = this.blend * this.blend * (3 - 2 * this.blend);
      parts.forEach(gs =>
        gs.forEach(g => {
          const f = g.userData.from;
          if (!f) return;
          g.position.lerpVectors(f.p, g.position, k);
          q0.copy(f.q).slerp(g.quaternion, k);
          g.quaternion.copy(q0);
        })
      );
    }
  }
}
export async function loadAnim(group, name) {
  return game.json(`Common/Characters/Animations/${group}/${name}.blockyanim`);
}

// ---- the game's blocks as meshes, drawn many at a time: a cube block's six faces, or a block model baked into one geometry
const REV_EDGE = 92 * 64, // how far a background change runs: past the mountain ring (scene units)
  WAVE_SPREAD = 1.25, // seconds from the character's feet to the mountains
  WAVE_POP = 0.42; // seconds one block takes to shrink away or pop up
const BLOCK = 64; // one block in the figure's units (block models are made at 32 to a block, so they are doubled)
const SHADE = 0.72; // the scene's lights are set for the figure; scenery takes this much of them so a sunlit top shows the block's own colour
const canvasOf = path =>
  once('c:' + path, async () => {
    const i = await game.bitmap(game.common(path)),
      c = document.createElement('canvas');
    c.width = i.width;
    c.height = i.height;
    c.getContext('2d').drawImage(i, 0, 0);
    return c;
  });
function tinted(c, hex) {
  // a greyscale texture coloured the way the game tints it (multiply), keeping its see-through parts
  if (!hex) return c;
  const o = document.createElement('canvas');
  o.width = c.width;
  o.height = c.height;
  const x = o.getContext('2d');
  x.drawImage(c, 0, 0);
  x.globalCompositeOperation = 'multiply';
  x.fillStyle = hex;
  x.fillRect(0, 0, o.width, o.height);
  x.globalCompositeOperation = 'destination-in';
  x.drawImage(c, 0, 0);
  return o;
}
function blockMat(c, cut, k = 1) {
  /* k: a face's own shade (block sides darker than tops, so slopes read even in snow) */ const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestMipmapLinearFilter;
  return new THREE.MeshLambertMaterial({
    map: t,
    color: new THREE.Color(SHADE * k, SHADE * k, SHADE * k),
    alphaTest: cut ? 0.5 : 0,
    side: cut ? THREE.DoubleSide : THREE.FrontSide,
  });
}
function mergeMeshes(group) {
  // every box and quad of a model, moved into place and joined into one geometry
  group.updateMatrixWorld(true);
  const pos = [],
    uv = [],
    nor = [],
    idx = [];
  const v = new THREE.Vector3(),
    nm = new THREE.Matrix3();
  group.traverse(m => {
    if (!m.isMesh) return;
    const g = m.geometry,
      P = g.attributes.position,
      U = g.attributes.uv,
      N = g.attributes.normal,
      base = pos.length / 3;
    nm.getNormalMatrix(m.matrixWorld);
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i).applyMatrix4(m.matrixWorld);
      pos.push(v.x, v.y, v.z);
      uv.push(U.getX(i), U.getY(i));
      v.fromBufferAttribute(N, i).applyMatrix3(nm).normalize();
      nor.push(v.x, v.y, v.z);
    }
    for (let i = 0; i < g.index.count; i++) idx.push(base + g.index.getX(i));
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}
// one block type as [{ geo, mat }] (a cube with several tops gives one entry per top, the world picks among them)
const blockParts = (name, tint) =>
  once('blk:' + name + '|' + tint, async () => {
    const b = BLOCKS[name];
    if (!b) throw new Error('unknown block ' + name);
    if (b.cube) {
      const all = async c => (b.tint ? tinted(c, b.tint) : c), // a block tinted whole (moss) takes its colour on every face
        side0 = await all(await canvasOf(b.cube.side)),
        bottom = blockMat(await all(await canvasOf(b.cube.bottom)), false, 0.6);
      let side = side0;
      if (b.cube.sideMask) {
        side = document.createElement('canvas');
        side.width = side0.width;
        side.height = side0.height;
        const x = side.getContext('2d');
        x.drawImage(side0, 0, 0);
        x.drawImage(tinted(await canvasOf(b.cube.sideMask), tint), 0, 0, side.width, side.height);
      }
      const sideM = blockMat(side, false, 0.78),
        tops = Array.isArray(b.cube.top) ? b.cube.top : [b.cube.top],
        geo = new THREE.BoxGeometry(BLOCK, BLOCK, BLOCK).translate(0, BLOCK / 2, 0);
      return Promise.all(
        tops.map(async t => ({
          geo,
          mat: [sideM, sideM, blockMat(b.tintUp ? tinted(await canvasOf(t), tint) : await all(await canvasOf(t))), bottom, sideM, sideM],
        }))
      );
    }
    const m = await game.json(game.common(b.model)),
      c = tinted(await canvasOf(b.tex[0]), b.tint),
      mat = blockMat(c, true),
      T = { w: c.width, h: c.height, mat },
      g = new THREE.Group();
    for (const n of m.nodes) g.add(node(n, T, null, new Map()));
    g.scale.setScalar(BLOCK / 32);
    const geo = mergeMeshes(g);
    g.traverse(o => {
      if (o.isMesh) o.geometry.dispose();
    });
    return [{ geo, mat }];
  });
export async function blockModel(name) {
  const [p] = await blockParts(name);
  const m = new THREE.Mesh(p.geo, Array.isArray(p.mat) ? p.mat : p.mat);
  m.userData.shared = true;
  return m;
} // one piece of furniture (a chair, a ladder ...)
// block geometries and materials are shared and cached, only the instance lists go (and the few meshes a world made for itself, whose textures are the shared blocks')
// still water, one surface tile per cell: the game's water texture, see-through, coloured the way the game shows open water
const WATER_KEY = '~water|0';
const waterParts = () =>
  once('water', async () => {
    const t = new THREE.CanvasTexture(await canvasOf(game.SCENERY_TEX.water));
    t.colorSpace = THREE.SRGBColorSpace;
    t.magFilter = t.minFilter = THREE.NearestFilter;
    const mat = new THREE.MeshLambertMaterial({
      map: t,
      color: 0x6aa6e8,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    return [{ geo: new THREE.PlaneGeometry(BLOCK, BLOCK).rotateX(-Math.PI / 2), mat }];
  });
// lava: the game's lava texture on a whole block, unlit so it glows
const LAVA_KEY = '~lava|0';
const lavaParts = () =>
  once('lava', async () => {
    const t = new THREE.CanvasTexture(await canvasOf(game.SCENERY_TEX.lava));
    t.colorSpace = THREE.SRGBColorSpace;
    t.magFilter = t.minFilter = THREE.NearestFilter;
    const mat = new THREE.MeshBasicMaterial({ map: t, color: 0xffd0a0 });
    return [{ geo: new THREE.BoxGeometry(BLOCK, BLOCK, BLOCK).translate(0, BLOCK / 2, 0), mat }];
  });
const disposeTree = root =>
  root.traverse(o => {
    if (o.isInstancedMesh) o.dispose();
    if (o.userData.own) {
      o.geometry.dispose();
      o.material.dispose();
    }
  });
// the fall's shaft: four walls of a 5x5 block (or grid cell) square round the character, each a plane facing in, so a view from
// outside looks straight through the near wall into the shaft. Below SHAFT_CAP the walls rise with the fall; past it they stay
// and their pattern scrolls instead, so the fall can go on for ever.
const SHAFT_CAP = 1000,
  shaftWalls = (half, mat, geo) => {
    const g = new THREE.Group();
    for (const [x, z, r] of [
      [0, -half, 0],
      [0, half, Math.PI],
      [-half, 0, Math.PI / 2],
      [half, 0, -Math.PI / 2],
    ]) {
      const w = new THREE.Mesh(geo, mat);
      w.position.set(x, 0, z);
      w.rotation.y = r;
      w.frustumCulled = false;
      g.add(w);
    }
    return g;
  };
// a wall of cols x rows of a block's side face (the wall's top edge at y 0), each block a touch lighter or darker than the next
// (a pattern repeating every SHADE_ROWS rows) so the rows read as blocks even when the texture tiles seamlessly, darkening to
// black below fadeAt
const SHADE_ROWS = 8;
function blockWall(part, cols, rows, fadeAt = Infinity) {
  const side = Array.isArray(part.mat) ? part.mat[0] : part.mat,
    pos = [],
    uv = [],
    col = [],
    idx = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const n = Math.sin(c * 12.9898 + (r % SHADE_ROWS) * 78.233) * 43758.5453,
        k = 0.8 + 0.2 * (n - Math.floor(n)),
        x0 = (c - cols / 2) * BLOCK,
        y0 = -r * BLOCK,
        i = pos.length / 3;
      for (const [dx, dy] of [
        [0, 0],
        [1, 0],
        [0, -1],
        [1, -1],
      ]) {
        const y = y0 + dy * BLOCK,
          d = Math.min(1, Math.max(0.02, 1 - (-y - fadeAt) / 900));
        pos.push(x0 + dx * BLOCK, y, 0);
        uv.push(dx, 1 + dy);
        col.push(k * d, k * d, k * d);
      }
      idx.push(i, i + 2, i + 1, i + 2, i + 3, i + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const mat = new THREE.MeshLambertMaterial({ map: side.map, color: side.color.clone(), vertexColors: true, alphaTest: side.alphaTest });
  return { geo: g, mat };
}
// a block's turn in a prefab: 0-63, quarter turns about y, then x, then z
const turnOf = r =>
  new THREE.Quaternion().setFromEuler(
    new THREE.Euler((((r >> 2) & 3) * Math.PI) / 2, ((r & 3) * Math.PI) / 2, (((r >> 4) & 3) * Math.PI) / 2, 'YXZ')
  );
// a small piece of the zone: rolling land of its ground blocks, its own grasses and flowers, and a few of its trees, from the game's prefabs
// a box (in blocks) on screen as [x0, y0, x1, y1] in -1..1, or null when part of it is behind the camera
const CORNER = new THREE.Vector3();
function onScreen(eye, x0, y0, z0, x1, y1, z1) {
  const r = [Infinity, Infinity, -Infinity, -Infinity];
  for (const x of [x0, x1])
    for (const y of [y0, y1])
      for (const z of [z0, z1]) {
        CORNER.set(x * BLOCK, y * BLOCK, z * BLOCK).project(eye);
        if (CORNER.z > 1) return null;
        r[0] = Math.min(r[0], CORNER.x);
        r[1] = Math.min(r[1], CORNER.y);
        r[2] = Math.max(r[2], CORNER.x);
        r[3] = Math.max(r[3], CORNER.y);
      }
  return r;
}
async function buildWorld(sc, tint) {
  // An open plain that slides under moving animations in any direction for ever (ground and plants, repeating every P blocks), with the
  // place's hills and trees as a fixed ring of distant scenery standing on it, from RIN blocks out into the haze. Nothing that slides is
  // solid and nothing solid moves, so nothing can ever reach the character or the camera, and no move ever needs a correction.
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const P = 128,
    RIN = 44,
    R = 80,
    FIX = 45,
    TAU = Math.PI * 2,
    sym = v => {
      const w = ((v % P) + P) % P;
      return w >= P / 2 ? w - P : w;
    };
  const raw = (x, z) => {
    const n =
      Math.sin((TAU * 2 * x) / P + 1.3) * Math.cos((TAU * 3 * z) / P - 0.7) +
      0.7 * Math.sin((TAU * (x + z)) / P + 2.1) +
      0.4 * Math.cos((TAU * 4 * (x - z)) / P);
    return Math.max(0, (n + 0.5) * sc.hills * 0.55);
  };
  // everything nearer than RIN slides with the move; from RIN out stands a ring of hills rising into mountains, far enough that standing still is what
  // far land looks like while you move (no near border between moving and fixed ground). Every cell of the ring is at least a block high, so its foot hides the plain's edge.
  const SEA = sc.water?.kind === 'sea'; /* open sea: water all the way to the haze, no land at all */
  const h = (x, z) => {
    if (SEA) return 0;
    const d = Math.hypot(x, z);
    if (d < RIN) return 0;
    const a = Math.atan2(z, x),
      t = Math.min(1, (d - RIN) / (R - RIN));
    const peaks = 0.55 + 0.25 * Math.sin(a * 3 + 1.1) + 0.2 * Math.cos(a * 7 - 0.4) + 0.12 * Math.sin(a * 13 + x * 0.21 - z * 0.17);
    return Math.max(1, Math.round(1 + raw(x, z) * 0.6 + Math.pow(t, 1.3) * (4 + 12 * peaks)));
  };
  const items = new Map(),
    put = (key, x, y, z, q, plant, slide) => {
      const k = key + (slide ? '|s' : '|f');
      (items.get(k) || items.set(k, { plant, slide, name: key, list: [] }).get(k)).list.push([x, y, z, q]);
    };
  const nTops = (await blockParts(sc.ground, tint)).length;
  // plant sizes (third value): 1 low, 2 knee-high, none tall
  const pick = size => {
    const from = sc.plants.filter(p => (size === 1 ? p[2] === 1 : size === 2 ? p[2] : true));
    if (!from.length) return null;
    let r = rnd() * from.reduce((t, p) => t + p[1], 0);
    for (const [n, w] of from) if ((r -= w) <= 0) return n;
    return from[0][0];
  };
  // trees in the ring, each wholly inside it, never touching another
  const taken = new Set(),
    trees = await Promise.all(sc.trees.map(p => game.json(p))),
    placed = [];
  for (let i = 0, tries = 0; trees.length && placed.length < (sc.treeCount ?? 30) && tries < 2400; tries++) {
    const tb = trees[i % trees.length].blocks,
      reach = Math.max(0, ...tb.map(b => Math.hypot(b.x, b.z)));
    const a = rnd() * TAU,
      d = RIN + reach + 2 + rnd() * Math.max(0, Math.min(R - 2, RIN + 26) - (RIN + reach + 2)),
      cx = Math.round(Math.cos(a) * d),
      cz = Math.round(Math.sin(a) * d);
    if (placed.some(t => Math.hypot(t[0] - cx, t[1] - cz) < t[2] + reach + 2)) {
      if (tries % 40 === 39) i++;
      continue;
    }
    placed.push([cx, cz, reach]);
    i++;
    const trunks = tb.filter(b => /Trunk/.test(b.name)),
      lift = trunks.length ? -Math.min(...trunks.map(b => b.y)) : 0,
      base = h(cx, cz); // the trunk's foot on the ground
    for (const b0 of tb) {
      if (!BLOCKS[b0.name]) continue;
      const x = cx + b0.x,
        z = cz + b0.z,
        y = base + b0.y + lift;
      put(b0.name + '|0', x, y, z, b0.rotation ? turnOf(b0.rotation) : null, false, false);
      if (b0.y + lift === 0) taken.add(x + ',' + z);
    }
  }
  // lava (sc.lava): glowing streams running down the hills from their tops, and pools on the highest ground
  const lavaAt = (x, z, top) => {
    if (!sc.lava || top < 3) return false;
    const a = Math.atan2(z, x),
      d = Math.hypot(x, z);
    return Math.sin(a * 13 + Math.sin(d * 0.21) * 1.4) > 0.9 || (top >= 10 && Math.sin(x * 0.37) * Math.cos(z * 0.41) > 0.55);
  };
  // the ring's hills: columns standing on the plain (the plain's own ground is under them), plants on their tops
  for (let x = -R; x <= R; x++)
    for (let z = -R; z <= R; z++) {
      const top = h(x, z),
        dc = Math.hypot(x, z);
      if (SEA) {
        if (dc >= FIX - 0.5 && dc <= R + 1) {
          put(sc.water.bed + '|0', x, -1 - (sc.water.depth || 2), z, null, false, false);
          put(WATER_KEY, x, -0.15, z, null, false, false);
        }
        continue;
      }
      if (dc >= FIX - 0.5 && dc <= R + 1) put(sc.ground + '|' + Math.floor(rnd() * nTops), x, -0.996, z, null, false, false); // from FIX blocks out the land is fixed, ground and all (a hair above the sliding ground it covers)
      if (!top) {
        if (dc >= FIX && dc <= R && !taken.has(x + ',' + z) && rnd() < sc.density) {
          const r = rnd(),
            name = pick(r < 0.45 ? 1 : r < 0.8 ? 2 : 0);
          if (name) put(name + '|0', x + (rnd() - 0.5) * 0.5, 0, z + (rnd() - 0.5) * 0.5, rnd() * TAU, true, false);
        }
        continue;
      }
      const low = Math.min(top, h(x + 1, z), h(x - 1, z), h(x, z + 1), h(x, z - 1));
      for (let y = Math.max(1, low); y <= top; y++)
        put(
          y === top ? (lavaAt(x, z, top) ? LAVA_KEY : sc.ground + '|' + Math.floor(rnd() * nTops)) : sc.under + '|0',
          x,
          y - 1,
          z,
          null,
          false,
          false
        );
      if (!taken.has(x + ',' + z) && rnd() < sc.density) {
        const name = pick(0);
        if (name) put(name + '|0', x + (rnd() - 0.5) * 0.5, top, z + (rnd() - 0.5) * 0.5, rnd() * TAU, true, false);
      }
    }
  // water on the plain: a river winding across behind the character, a shore with the water beyond it, or open sea. Its cells are dug two blocks down to the bed and the banks walled with the under-ground block, so the water
  // has depth (sc.water.depth blocks, 2 if not given); the pattern repeats every P blocks like the rest of the plain (the seam is far out, under the fixed land)
  const wet = (() => {
    const k = sc.water?.kind,
      bend = x => Math.sin((TAU * x) / 64);
    // a river every 64 blocks and the shore's water a 52-block band in every 128: wherever a move carries the character, water is
    // always within sight (the plain shows 46 blocks round it)
    const half = v => (((((v % 64) + 64) % 64) + 32) % 64) - 32;
    if (k === 'river') return (x, z) => Math.abs(half(z + 17 - 4 * bend(sym(x)))) < 4.5;
    if (k === 'shore') return (x, z) => Math.abs(sym(z + 40 - 3 * bend(sym(x)))) < 26;
    if (k === 'sea') return () => true;
    return () => false;
  })();
  const DEEP = sc.water?.depth || 2;
  const pickWet = () => {
    const from = sc.water?.plants || [];
    let r = rnd() * from.reduce((t, p) => t + p[1], 0);
    for (const [n, w] of from) if ((r -= w) <= 0) return n;
    return null;
  };
  // the plain: one ground block per cell and its plants, repeating every P blocks, sliding with the move
  for (let x = 0; x < P; x++)
    for (let z = 0; z < P; z++) {
      if (wet(x, z)) {
        put(sc.water.bed + '|0', x, -1 - DEEP, z, null, false, true);
        put(WATER_KEY, x, -0.15, z, null, false, true);
        if (rnd() < (sc.water.density || 0)) {
          const name = pickWet();
          if (name) put(name + '|0', x + (rnd() - 0.5) * 0.5, -DEEP, z + (rnd() - 0.5) * 0.5, rnd() * TAU, true, true);
        }
        continue;
      }
      put(sc.ground + '|' + Math.floor(rnd() * nTops), x, -1, z, null, false, true);
      if (wet(x + 1, z) || wet(x - 1, z) || wet(x, z + 1) || wet(x, z - 1))
        for (let y = -2; y >= -DEEP; y--) put(sc.under + '|0', x, y, z, null, false, true); // the bank
      if (rnd() >= sc.density) continue;
      const r = rnd(),
        name = pick(r < 0.45 ? 1 : r < 0.8 ? 2 : 0);
      if (name) put(name + '|0', x + (rnd() - 0.5) * 0.5, 0, z + (rnd() - 0.5) * 0.5, rnd() * TAU, true, true);
    }
  const root = new THREE.Group(),
    M = new THREE.Matrix4(),
    V = new THREE.Vector3(),
    Q = new THREE.Quaternion(),
    Y = new THREE.Vector3(0, 1, 0),
    ONE = new THREE.Vector3(1, 1, 1),
    S = new THREE.Vector3();
  const sets = [];
  for (const [, { name: key, plant, slide, list }] of items) {
    const [name, k] = key.split('|'),
      parts =
        name === WATER_KEY.split('|')[0]
          ? await waterParts()
          : name === LAVA_KEY.split('|')[0]
            ? await lavaParts()
            : await blockParts(name, tint),
      p = parts[+k] || parts[0];
    const im = new THREE.InstancedMesh(p.geo, p.mat, list.length);
    im.frustumCulled = false;
    root.add(im);
    if (plant && !p.geo.boundingBox) p.geo.computeBoundingBox();
    const bb = plant ? p.geo.boundingBox : null;
    sets.push({
      im,
      list,
      plant,
      slide,
      tall: bb ? bb.max.y / BLOCK : 0,
      wide: bb ? Math.max(-bb.min.x, bb.max.x, -bb.min.z, bb.max.z) / BLOCK : 0,
    });
  }
  // the fall: the land goes and only a shaft is left, walled with the zone's own blocks: a row of its ground block at the top
  // (the rim the character drops in from) and its under-ground block all the way down, dark at the very bottom
  const shaft = new THREE.Group(),
    wall = blockWall((await blockParts(sc.under, tint))[0], 5, 40, SHAFT_CAP + 700),
    rimW = blockWall((await blockParts(sc.ground, tint))[0], 5, 1),
    walls = shaftWalls(2.5 * BLOCK, wall.mat, wall.geo.translate(0, -BLOCK, 0)),
    rim = shaftWalls(2.5 * BLOCK, rimW.mat, rimW.geo);
  walls.children[0].userData.own = rim.children[0].userData.own = true;
  {
    const end = new THREE.Mesh(
      new THREE.PlaneGeometry(5 * BLOCK, 5 * BLOCK).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0 })
    );
    end.position.y = -41 * BLOCK;
    end.userData.own = true;
    walls.add(end);
  }
  /* the shaft's dark bottom, far below */
  shaft.add(walls, rim);
  shaft.visible = false;
  root.add(shaft);
  let falling = false;
  // r: how far the character has fallen (scene units), or null when not falling. Past SHAFT_CAP the walls step back down a whole
  // shade pattern at a time, which looks the same, so they can rush past for ever
  root.userData.fall = r => {
    if ((r != null) !== falling) {
      falling = r != null;
      for (const o of root.children) o.visible = o === shaft ? falling : !falling;
    }
    if (!falling) return;
    walls.position.y = r <= SHAFT_CAP ? r : SHAFT_CAP + ((r - SHAFT_CAP) % (SHADE_ROWS * BLOCK));
    rim.position.y = r;
    rim.visible = r < SHAFT_CAP + 1500;
  };
  let ax = 0,
    az = 0; // how far the plain has slid (scene units)
  const avoid = () => root.userData.avoid || []; // set pieces' ground rectangles [x0, z0, x1, z1] in blocks: no plant inside them
  const layout = plantsOnly => {
    const ox = ax / BLOCK,
      oz = az / BLOCK,
      c = root.userData.cam,
      clear = root.userData.clear || 1,
      rects = avoid(),
      cx = c ? c.x / BLOCK : 0,
      cy = c ? c.y / BLOCK : 0,
      cz = c ? c.z / BLOCK : 0,
      cl = Math.hypot(cx, cz) || 1,
      eye = root.userData.camera,
      who = root.userData.who || [0.5, 2.1];
    if (eye) eye.updateMatrixWorld();
    const me = eye ? onScreen(eye, -who[0], 0, -who[0], who[0], who[1], who[0]) : null; /* the character's box as the camera sees it */
    for (const st of sets) {
      if (plantsOnly && !st.plant) continue;
      if (!st.slide && st.laid && plantsOnly) continue;
      let n = 0;
      for (const [x0, y, z0, q] of st.list) {
        const x = st.slide ? sym(x0 + ox) : x0,
          z = st.slide ? sym(z0 + oz) : z0;
        if (x * x + z * z > (st.slide ? (FIX + 1.5) * (FIX + 1.5) : R * R)) continue; // what slides stays inside the fixed land
        let k = 1,
          s = 1;
        if (st.plant && st.slide) {
          const d = Math.hypot(x, z); // a plant shrinks away near the character, the camera's lens and any set piece
          const e = v => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v)); // long, eased fades, so a plant sliding past never visibly pops in or out
          k = Math.min(
            e((d - clear) / 1.8),
            e((38 - d) / 8),
            c ? e((Math.hypot(x * BLOCK - c.x, z * BLOCK - c.z) / BLOCK - 1.2) / 2.2) : 1
          );
          if (me) {
            /* a plant nearer the camera than the character whose box covers the character on screen shrinks, down to below the sight line to the feet */
            const t = (x * cx + z * cz) / (cl * cl);
            if (t > 0 && t < 1 && Math.abs(x * cz - z * cx) / cl < st.wide + who[0] + 1) {
              const pr = onScreen(eye, x - st.wide, y, z - st.wide, x + st.wide, y + st.tall, z + st.wide),
                o = pr ? Math.min(Math.min(pr[2], me[2]) - Math.max(pr[0], me[0]), Math.min(pr[3], me[3]) - Math.max(pr[1], me[1])) : 0;
              if (o > 0) s = 1 - (1 - Math.max(0.15, Math.min(1, (t * cy - y - 0.1) / st.tall))) * e(o / 0.04);
            }
          }
          for (const r of rects) if (x > r[0] - 0.6 && x < r[2] + 0.6 && z > r[1] - 0.6 && z < r[3] + 0.6) k = 0;
          if (k < 0.02) continue;
        }
        st.im.setMatrixAt(
          n++,
          M.compose(
            V.set(x * BLOCK, (y - (1 - k) * 2.2) * BLOCK, z * BLOCK),
            st.plant ? Q.setFromAxisAngle(Y, q) : q || Q.identity(),
            s < 1 ? S.set(s, s, s) : ONE
          )
        );
      } /* a plant that must clear the way sinks into the ground at full size; one covering the character shrinks */
      st.im.count = n;
      st.im.instanceMatrix.needsUpdate = true;
      if (!st.slide) st.laid = true;
    }
  };
  const span = P * BLOCK;
  root.userData.move = (dx, dz) => {
    if (!dx && !dz) return layout(true);
    ax = (ax + dx) % span;
    az = (az + dz) % span;
    layout(false);
  };
  root.userData.offset = () => [ax, az];
  root.userData.span = span;
  root.userData.snap = () => {}; // kept for callers: nothing ever needs putting back now
  root.userData.solids = () =>
    sets.filter(t => !t.plant && !t.slide).flatMap(t => t.list.filter(b => b[1] >= 0).map(b => [b[0], b[1], b[2]])); // for tests: blocks above the plain, in blocks
  root.userData.solidNear = (px = 0, pz = 0) => {
    let best = Infinity; // for tests: the nearest solid block above the plain to a point (scene units), in blocks
    for (const st of sets) {
      if (st.plant || st.slide) continue;
      for (const [x, y, z] of st.list) {
        if (y < 0) continue;
        best = Math.min(best, Math.max(0, Math.hypot(x - px / BLOCK, z - pz / BLOCK) - 0.71));
      }
    }
    return best;
  };
  root.userData.relayout = () => {
    for (const st of sets) st.laid = false;
    layout(false);
  };
  layout(false);
  root.position.y = -0.5;
  return root;
}
// ---- the stage (main view) and a small off-screen renderer for thumbnails
function lights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 1.25));
  const l = new THREE.DirectionalLight(0xfff4e0, 2.9);
  l.position.set(30, 170, 140);
  scene.add(l);
} // matched by eye to the same character in game at noon: less flat fill, a stronger sun from above the front
export function stage(canvas, Controls) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  lights(scene);
  const cam = new THREE.PerspectiveCamera(32, 1, 1, 16000);
  cam.position.set(-75, 95, 255);
  const ctl = new Controls(cam, canvas);
  ctl.target.set(0, 62, 0);
  ctl.enablePan = false;
  ctl.zoomToCursor = false; // zoom stays on the figure's centre, lined up with the buttons under it
  ctl.minDistance = 40;
  ctl.maxDistance = 1250;
  ctl.rotateSpeed = 0.55;
  // the camera stays above the floor everywhere (Studio matches the backgrounds)
  ctl.maxPolarAngle = Math.PI * 0.47;
  ctl.update();
  // a change of background spreads out from the character: block by block, nearest first, the old place's blocks and plants shrink
  // away and the new one's pop up in their place, while the sky fades from one to the other
  const REV = { r: { value: 0 }, t: { value: 0 }, spread: { value: WAVE_SPREAD }, edge: { value: REV_EDGE }, dur: { value: WAVE_POP } };
  let wave = null; // a background change on its way out (see setBackdrop)
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(58, 48),
    new THREE.MeshBasicMaterial({ color: 0x0b1626, transparent: true, opacity: 0.55, fog: false })
  );
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = -0.2;
  scene.add(disc);
  const CELL = 32,
    grid = new THREE.Mesh(
      new THREE.PlaneGeometry(40000, 40000).rotateX(-Math.PI / 2),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        // both faces: on Studio the camera may tip below the floor (far out at the lowest tilt it is under it), and the floor must still show
        side: THREE.DoubleSide,
        extensions: { derivatives: true },
        // the Studio floor: grid lines on an endless plane, fading into the dark with distance so no edge is ever seen
        uniforms: {
          opacity: { value: 0 },
          color: { value: new THREE.Color(0x5a8cc8) },
          cell: { value: CELL },
          revR: REV.r,
          revMode: { value: 0 },
        },
        vertexShader:
          'varying vec3 vL; varying vec3 vW; void main() { vL = position; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
        fragmentShader:
          'uniform float opacity; uniform vec3 color; uniform float cell; uniform float revR; uniform float revMode; varying vec3 vL; varying vec3 vW; void main() { float rv = revMode == 0.0 ? 1.0 : smoothstep(-400.0, 0.0, revMode * (revR - length(vW.xz))); vec2 g = abs(fract(vL.xz / cell - 0.5) - 0.5) / fwidth(vL.xz / cell); float line = 1.0 - smoothstep(0.0, 1.3, min(g.x, g.y)); float d = length(vW.xz); float fade = 1.0 - smoothstep(300.0, 3200.0, d); gl_FragColor = vec4(color, line * fade * opacity * rv); if (gl_FragColor.a < 0.003) discard; }',
      })
    );
  Object.defineProperty(grid.material, 'opacity', {
    get() {
      return this.uniforms.opacity.value;
    },
    set(v) {
      this.uniforms.opacity.value = v;
    },
  });
  scene.add(grid);
  let sky = null,
    world = null,
    scrollers = [],
    flowing = [],
    mist = null;
  // the climbing wall: the same grid stood up in front of the figure, sliding the other way as it climbs
  const wallG = new THREE.GridHelper(CELL * 16, 16, 0x4a76ad, 0x33557f);
  wallG.rotation.x = Math.PI / 2;
  wallG.material.transparent = true;
  wallG.material.opacity = 0;
  wallG.material.depthWrite = false;
  wallG.visible = false;
  scene.add(wallG);
  // the Studio's fall shaft: grid walls fading into the dark below, and streaks of rushing air for every background
  const SHAFT = 80 * CELL,
    shaftM = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      extensions: { derivatives: true },
      uniforms: {
        opacity: { value: 0 },
        color: { value: new THREE.Color(0x5a8cc8) },
        cell: { value: CELL },
        scroll: { value: 0 },
        depth: { value: SHAFT },
      },
      vertexShader:
        'varying vec2 vL; void main() { vL = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader:
        'uniform float opacity; uniform vec3 color; uniform float cell; uniform float scroll; uniform float depth; varying vec2 vL; void main() { vec2 u = vec2(vL.x / cell + 2.5, (vL.y - scroll) / cell); vec2 g = abs(fract(u - 0.5) - 0.5) / fwidth(u); float line = 1.0 - smoothstep(0.0, 1.3, min(g.x, g.y)); float fade = 1.0 - smoothstep(depth * 0.55, depth, -vL.y); gl_FragColor = vec4(color, (line + 0.12 * (1.0 - line)) * fade * opacity); if (gl_FragColor.a < 0.003) discard; }',
    }),
    shaftG = shaftWalls(2.5 * CELL, shaftM, new THREE.PlaneGeometry(5 * CELL, SHAFT).translate(0, -SHAFT / 2, 0));
  shaftG.visible = false;
  scene.add(shaftG);
  const STREAKS = 40,
    streakPos = new Float32Array(STREAKS * 6),
    streakLen = [],
    streaks = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(streakPos, 3)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, fog: false })
    );
  for (let i = 0; i < STREAKS; i++) {
    const x = Math.random() * 1.8 - 0.9,
      z = Math.random() * 1.8 - 0.9,
      y = Math.random() * 1000 - 400;
    streakLen.push(40 + Math.random() * 90);
    streakPos.set([x, y, z, x, y + streakLen[i], z], i * 6);
  }
  streaks.frustumCulled = false;
  streaks.visible = false;
  scene.add(streaks);
  let wallOn = null;
  const WALL_Z = 12,
    WALL_Y = 70;
  const vel = new THREE.Vector2(),
    want = new THREE.Vector2(),
    O2 = new THREE.Vector2();
  let yawTo = 0,
    yawAt = 0; // yaw: which way the figure faces (walking with WASD); the ground slides the way it faces
  // the fall: the ground goes, the character drops FALL_D into the shaft and then falls on at the speed reached, the walls rushing up
  const FALL_D = 2 * BLOCK,
    FALL_G = 3000,
    FALL_V = Math.sqrt(2 * FALL_D * FALL_G);
  let jumpH = 0,
    jumpAt = 0,
    fallOn = false,
    fallT = 0;
  function airStep(dt) {
    // jumps and falls (the files only hold the body; the stage shows the air under it)
    let fell = null;
    if (fallOn) {
      fallT += dt;
      const land = FALL_V / FALL_G;
      fell = fallT < land ? 0.5 * FALL_G * fallT * fallT : FALL_D + FALL_V * (fallT - land);
    }
    if (world) world.userData.fall(fell);
    const half = (world ? 2.5 * BLOCK : 2.5 * CELL) - 6;
    shaftG.visible = fell != null && !world;
    if (shaftG.visible) {
      shaftG.position.y = Math.min(fell, SHAFT_CAP);
      shaftM.uniforms.scroll.value = Math.max(0, fell - SHAFT_CAP) % CELL;
      shaftM.uniforms.opacity.value = 0.55;
    }
    {
      /* rushing air: thin streaks flying up inside the shaft, a little faster than the walls */
      const sp = Math.min(1, fallT / 0.4);
      streaks.visible = fell != null;
      streaks.material.opacity = fell != null ? 0.32 * sp : 0;
      streaks.scale.set(half, 1, half);
      if (streaks.visible) {
        for (let i = 0; i < STREAKS; i++) {
          let y = streakPos[i * 6 + 1] + FALL_V * 1.3 * sp * dt;
          if (y > 600) y -= 1000;
          streakPos[i * 6 + 1] = y;
          streakPos[i * 6 + 4] = y + streakLen[i];
        }
        streaks.geometry.attributes.position.needsUpdate = true;
      }
    }
    disc.visible = disc.userData.on !== false && fell == null;
    if (figure && (jumpH || jumpAt)) {
      const p = anim.anim && anim.playing && !anim.resting ? (anim.t % Math.max(1, anim.duration)) / Math.max(1, anim.duration) : 0,
        h = jumpH * Math.sin(Math.PI * p);
      jumpAt = h;
      seatAt();
      figure.position.y += h;
      disc.scale.setScalar(1 - 0.45 * Math.min(1, h / 40));
      if (!jumpH && h < 0.01) {
        jumpAt = 0;
        disc.scale.setScalar(1);
      }
    }
  }
  function travel(dt) {
    {
      let d = yawTo - yawAt;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      yawAt += d * (1 - Math.exp(-dt * 12));
      if (figure) figure.rotation.y = yawAt;
    }
    const v = anim.velocity;
    want.set(v ? v[0] : 0, v ? v[1] : 0).rotateAround(O2, -yawAt);
    vel.lerp(want, 1 - Math.exp(-dt * 9));
    // the clearing's floor slides with the move (a horse needs more room round it than a person)
    if (world) {
      world.userData.cam = cam.position;
      world.userData.camera = cam;
      world.userData.who = mountRoot ? [1.3, 2.9] : [0.5, 2.1];
      world.userData.clear = Math.max(mountRoot ? 2.3 : anim.move ? 1.7 : 1, plantClear, painting ? 4 : 0);
      let mx = anim.move ? -vel.x * dt : 0,
        mz = anim.move ? -vel.y * dt : 0;
      world.userData.move(mx, mz);
      wave?.old?.userData.move?.(mx, mz);
    }
    for (const w of flowing) {
      const [ox, oz] = world ? world.userData.offset() : [0, 0],
        m = w.material.map;
      if (m) m.offset.set(-ox / w.userData.flow, oz / w.userData.flow);
    } // water drifts with the land
    grid.position.x = (grid.position.x - vel.x * dt) % CELL;
    grid.position.z = (grid.position.z - vel.y * dt) % CELL; // the ground runs backwards under the figure
    grid.material.opacity = fallOn
      ? 0
      : grid.material.opacity + ((!world || wave?.grid ? 0.5 : 0) - grid.material.opacity) * (1 - Math.exp(-dt * 6));
    grid.visible = grid.material.opacity > 0.01;
    const wy = wallG.position.y - WALL_Y - (wallOn ? wallOn[1] : 0) * dt,
      wx = wallG.position.x - (wallOn ? wallOn[0] : 0) * dt;
    wallG.position.set(wx % CELL, WALL_Y + (wy % CELL), WALL_Z);
    for (const p of scrollers) {
      const b = p.userData.scroll;
      if (!wallOn) {
        p.position.copy(b);
        continue;
      }
      p.position.x = b.x + ((p.position.x - b.x - wallOn[0] * dt) % BLOCK);
      p.position.y = b.y + ((p.position.y - b.y - wallOn[1] * dt) % BLOCK);
    }
    wallG.material.opacity += ((wallOn && !scrollers.length ? 0.5 : 0) - wallG.material.opacity) * (1 - Math.exp(-dt * 6));
    wallG.visible = wallG.material.opacity > 0.01;
  }
  let hl = null,
    helpers = []; // outlines around picked boxes (see drawHL)
  const anim = new Animator(),
    mountAnim = new Animator();
  let figure = null,
    held = [],
    perchY = 0,
    perchFrom = 0,
    faceCb = null,
    faced = '',
    last = performance.now(),
    mountRoot = null,
    seat = null,
    hoverTo = 0,
    hoverAt = 0,
    pitchTo = 0,
    pitchAt = 0;
  let inset = 0,
    insetR = 0,
    figTop = 130,
    autoFit = true; // the buttons over the bottom and right of the view: the picture is centred on what is left, at the same scale
  const insets = () => {
    const w = canvas.clientWidth || 1,
      h = canvas.clientHeight || 1;
    return [inset > 0 && inset < h * 0.45 ? inset : 0, insetR > 0 && insetR < w * 0.35 ? insetR : 0, w, h];
  };
  function fit() {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const [b, r] = insets();
    cam.aspect = (w + r) / (h + b);
    cam.fov = (2 * Math.atan((Math.tan((16 * Math.PI) / 180) * (h + b)) / h) * 180) / Math.PI;
    if (b || r) cam.setViewOffset(w + r, h + b, r, b, w, h);
    else cam.clearViewOffset();
    cam.updateProjectionMatrix();
  }
  new ResizeObserver(() => {
    fit();
    refit();
  }).observe(canvas);
  fit(); // a resized window refits the character (unless the player set the view)
  let tw = null; // a camera glide in progress (glideCam below)
  const stepCam = now => {
    if (!tw) return;
    const k = Math.min(1, (now - tw.at) / 400),
      e = k * k * (3 - 2 * k);
    ctl.target.lerpVectors(tw.t0, tw.t1, e);
    const sp = new THREE.Spherical(
      tw.s0.radius + (tw.s1.radius - tw.s0.radius) * e,
      tw.s0.phi + (tw.s1.phi - tw.s0.phi) * e,
      tw.s0.theta + tw.dth * e
    );
    cam.position.copy(ctl.target).add(new THREE.Vector3().setFromSpherical(sp));
    ctl.update();
    if (k >= 1) tw = null;
  };
  (function loop(now) {
    requestAnimationFrame(loop);
    stepCam(now);
    waveStep(now);
    {
      const d = cam.position.distanceTo(ctl.target),
        n = Math.min(40, Math.max(1, d / 30));
      if (Math.abs(n - cam.near) > 0.05) {
        cam.near = n;
        cam.updateProjectionMatrix();
      }
    }
    /* the near plane moves out with the camera: depth stays sharp, so close layers (coat over shirt) don't flicker when zoomed out */ const dt =
      Math.min(0.1, (now - last) / 1000 || 0);
    anim.update(dt);
    mountAnim.playing = anim.playing;
    mountAnim.update(dt);
    travel(dt);
    airStep(dt);
    float(dt, now);
    for (const h of helpers) h.update();
    dropHeld();
    facing();
    last = now;
    renderer.render(scene, cam);
  })(last);
  const ray = new THREE.Raycaster(),
    ndc = new THREE.Vector2();
  // the texel of `image` under a screen point, for painting straight on the model
  function texel(image, ok) {
    for (const h of ray.intersectObject(figure, true)) {
      if (!h.uv || !h.object.visible || h.object.material?.map?.image !== image || (ok && !ok(h.object))) continue;
      return {
        x: Math.min(image.width - 1, Math.max(0, Math.floor(h.uv.x * image.width))),
        y: Math.min(image.height - 1, Math.max(0, Math.floor((1 - h.uv.y) * image.height))),
        at: h.point.clone(),
        obj: h.object,
      };
    }
    return null;
  }
  // the brush outline on the model: a square of brush-size texels, snapped to the texel grid of the face under the pointer
  const curs = [0xffffff, 0xf4c452].map(col => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(12), 3));
    const l = new THREE.LineLoop(g, new THREE.LineBasicMaterial({ color: col, depthTest: false, transparent: true }));
    l.renderOrder = 12;
    l.visible = false;
    l.frustumCulled = false;
    scene.add(l);
    return l;
  });
  const hitOn = image => {
    for (const h of ray.intersectObject(figure, true))
      if (h.uv && h.face && h.object.visible && h.object.material?.map?.image === image) return h;
    return null;
  };
  const texOf = (h, image) => ({
    x: Math.min(image.width - 1, Math.max(0, Math.floor(h.uv.x * image.width))),
    y: Math.min(image.height - 1, Math.max(0, Math.floor((1 - h.uv.y) * image.height))),
  });
  const tv = new THREE.Vector3();
  function square(l, h, size) {
    if (!h) {
      l.visible = false;
      return;
    }
    const o = h.object,
      n = h.face.normal,
      ax = Math.abs(n.x) > 0.5 ? 0 : Math.abs(n.y) > 0.5 ? 1 : 2,
      ts = (o.userData.texel || [1, 1, 1]).map(v => Math.abs(v) || 1);
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    const mn = o.geometry.boundingBox.min.toArray(),
      lp = o.worldToLocal(h.point.clone()).toArray(),
      [u, v] = [0, 1, 2].filter(k => k !== ax);
    for (const k of [u, v]) lp[k] = mn[k] + (Math.floor((lp[k] - mn[k]) / ts[k] + 1e-6) + 0.5) * ts[k];
    lp[ax] += Math.sign(n.getComponent(ax)) * 0.15;
    const pos = l.geometry.attributes.position;
    [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ].forEach(([a, b], i) => {
      const p = lp.slice();
      p[u] += (a * size * ts[u]) / 2;
      p[v] += (b * size * ts[v]) / 2;
      o.localToWorld(tv.fromArray(p));
      pos.setXYZ(i, tv.x, tv.y, tv.z);
    });
    pos.needsUpdate = true;
    l.visible = true;
  }
  function aim(cx, cy) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
  }
  function cursor(cx, cy, image, size, mirror) {
    // draws the outline(s) and returns the texel under the pointer (with .m for the mirrored spot)
    if (cx == null || !figure) {
      for (const l of curs) l.visible = false;
      return null;
    }
    aim(cx, cy);
    const h = hitOn(image);
    square(curs[0], h, size);
    const p = h ? texOf(h, image) : null;
    if (mirror && h) {
      ray.ray.origin.x *= -1;
      ray.ray.direction.x *= -1;
      const h2 = hitOn(image);
      square(curs[1], h2, size);
      if (h2) p.m = texOf(h2, image);
    } else curs[1].visible = false;
    return p;
  }
  function pick(cx, cy, image, mirror) {
    if (!figure) return null;
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const p = texel(image);
    if (!p || !mirror) return p;
    ray.ray.origin.x *= -1;
    ray.ray.direction.x *= -1;
    const m = texel(image),
      want = p.at.clone();
    want.x *= -1;
    p.m = m && m.at.distanceTo(want) < 1.0 ? m : null;
    return p;
  } /* no surface right at the mirrored spot: no mirrored dab */ // the same ray flipped left to right lands on the matching spot of the other side
  // the texel on the other side of the body that matches texel (tx, ty): find it on the model, flip the point left to right, look back at the surface there
  function twinTexel(image, tx, ty) {
    if (!figure) return null;
    figure.updateMatrixWorld(true);
    const u = (tx + 0.5) / image.width,
      v = 1 - (ty + 0.5) / image.height;
    const A = new THREE.Vector3(),
      B = new THREE.Vector3(),
      C = new THREE.Vector3(),
      P = new THREE.Vector3(),
      N = new THREE.Vector3();
    let found = false,
      src = null;
    figure.traverse(o => {
      if (found || !o.isMesh || !o.visible || (o.userData.realMat || o.material)?.map?.image !== image) return;
      const g = o.geometry,
        pos = g.attributes.position,
        uv = g.attributes.uv;
      if (!uv) return;
      const idx = g.index ? g.index.array : null,
        n = idx ? idx.length : pos.count;
      for (let t = 0; t < n && !found; t += 3) {
        const i0 = idx ? idx[t] : t,
          i1 = idx ? idx[t + 1] : t + 1,
          i2 = idx ? idx[t + 2] : t + 2;
        const x0 = uv.getX(i0),
          y0 = uv.getY(i0),
          x1 = uv.getX(i1),
          y1 = uv.getY(i1),
          x2 = uv.getX(i2),
          y2 = uv.getY(i2),
          d = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2);
        if (Math.abs(d) < 1e-12) continue;
        const a = ((y1 - y2) * (u - x2) + (x2 - x1) * (v - y2)) / d,
          b = ((y2 - y0) * (u - x2) + (x0 - x2) * (v - y2)) / d,
          c = 1 - a - b;
        if (a < -1e-6 || b < -1e-6 || c < -1e-6) continue;
        A.fromBufferAttribute(pos, i0).applyMatrix4(o.matrixWorld);
        B.fromBufferAttribute(pos, i1).applyMatrix4(o.matrixWorld);
        C.fromBufferAttribute(pos, i2).applyMatrix4(o.matrixWorld);
        P.set(0, 0, 0).addScaledVector(A, a).addScaledVector(B, b).addScaledVector(C, c);
        N.subVectors(B, A).cross(new THREE.Vector3().subVectors(C, A)).normalize();
        found = true;
        src = o;
      }
    });
    if (!found) return null;
    P.x *= -1;
    N.x *= -1;
    const near = ray.near,
      far = ray.far;
    ray.near = 0;
    ray.far = 1e6;
    const sb = new THREE.Box3().setFromObject(src),
      want = new THREE.Box3(new THREE.Vector3(-sb.max.x, sb.min.y, sb.min.z), new THREE.Vector3(-sb.min.x, sb.max.y, sb.max.z)),
      ob = new THREE.Box3();
    const err = o => {
      ob.setFromObject(o);
      return Math.max(ob.min.distanceTo(want.min), ob.max.distanceTo(want.max));
    };
    let best = Infinity;
    figure.traverse(o => {
      if (o.isMesh && o.visible && (o.userData.realMat || o.material)?.map?.image === image) best = Math.min(best, err(o));
    });
    const ok = o => best < 1.5 && err(o) <= best + 0.05; // only the part's own mirror partner (or itself, if it sits in the middle): never another part that happens to be near the flipped spot

    ray.ray.origin.copy(P).addScaledVector(N, 0.05);
    ray.ray.direction.copy(N).negate();
    let hit = texel(image, ok);
    if (hit && hit.at.distanceTo(P) > 0.2) hit = null;
    if (!hit) {
      ray.ray.origin.copy(P).addScaledVector(N, -0.05);
      ray.ray.direction.copy(N);
      hit = texel(image, ok);
      if (hit && hit.at.distanceTo(P) > 0.2) hit = null;
    } /* a mirrored mesh winds the other way; nothing right there: no twin */
    if (hit && hit.obj !== src && Math.abs(hit.x - tx) + Math.abs(hit.y - ty) === 1)
      hit = {
        ...hit,
        x: tx,
        y: ty,
      }; /* a pair sharing one texture area (bangles), a pixel apart on the model: the same texel, not the one beside it */
    ray.near = near;
    ray.far = far;
    return hit;
  }
  // while painting, the left button paints and the right button turns the view
  let painting = false,
    plantClear = 0; // plants keep further away while an item is edited, or when a move sits or lies on the ground
  function paintMode(on) {
    painting = !!on;
    ctl.zoomToCursor = false;
    /* the wheel zooms toward the middle, so the item stays centred (zoom-to-pointer moved the target and the character drifted off-screen) */ ctl.maxPolarAngle =
      on ? Math.PI * 0.97 : Math.PI * 0.47;
    ctl.mouseButtons.LEFT = on ? -1 : THREE.MOUSE.ROTATE;
    ctl.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
    ctl.touches.ONE = on ? -1 : THREE.TOUCH.ROTATE;
    canvas.style.cursor = on ? 'crosshair' : '';
  }
  // the box under a screen point (first hit that passes the filter), and outlines around the boxes a filter picks
  // the picked box glows (its own copy of the material, lit gold) as well as getting an outline
  let lit = [];
  const glow = new Map();
  function drawHL() {
    for (const h of helpers) {
      scene.remove(h);
      h.geometry.dispose();
    }
    helpers = [];
    for (const m of lit)
      if (m.userData.baseMat) {
        m.material = m.userData.baseMat;
        delete m.userData.baseMat;
      }
    lit = [];
    if (!hl || !figure) return;
    figure.updateMatrixWorld(true);
    figure.traverse(o => {
      if (o.isMesh && o.visible && hl(o)) {
        const h = new THREE.BoxHelper(o, 0xf4c452);
        h.material.depthTest = false;
        h.renderOrder = 10;
        helpers.push(h);
        scene.add(h);
        const base = o.material;
        if (!glow.has(base)) {
          const g = base.clone();
          g.emissive = new THREE.Color(0x6a4a08);
          glow.set(base, g);
        }
        o.userData.baseMat = base;
        o.material = glow.get(base);
        lit.push(o);
      }
    });
  }
  // the item being edited stands out: every other part of the character turns into a faint see-through mannequin
  const ghost = new THREE.MeshLambertMaterial({ color: 0xa9bfd6, transparent: true, opacity: 0.14, depthWrite: false });
  let isoImage = null;
  // while one item is edited (the body see-through), a FRONT mark on the floor says which way the figure faces
  const frontMark = (() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#f4c452';
    g.beginPath();
    g.moveTo(128, 6);
    g.lineTo(168, 50);
    g.lineTo(88, 50);
    g.closePath();
    g.fill();
    g.font = '800 44px Lexend, Segoe UI, sans-serif';
    g.textAlign = 'center';
    g.fillText('FRONT', 128, 108);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(48, 24),
      new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0.85 })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(0, 0.4, 46);
    m.visible = false;
    scene.add(m);
    return m;
  })();
  function applyIsolate() {
    frontMark.visible = !!isoImage;
    figure?.traverse(o => {
      if (!o.isMesh) return;
      const real = o.userData.realMat || o.material,
        keep = !isoImage || real?.map?.image === isoImage;
      if (keep && o.userData.realMat) {
        o.material = o.userData.realMat;
        delete o.userData.realMat;
      } else if (!keep && !o.userData.realMat) {
        o.userData.realMat = o.material;
        o.material = ghost;
      }
    });
  }
  function pickMesh(cx, cy, keep) {
    if (!figure) return null;
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    for (const h of ray.intersectObject(figure, true)) if (h.object.visible && keep(h.object)) return h.object;
    return null;
  }
  // the gizmo: drag arrows (move), cubes (resize) or rings (rotate) on one box, like Blockbench and Blender. The box itself
  // follows live; on release onEnd gets the change in the box's own axes, and the caller rebuilds the model from its data.
  const tc = new TransformControls(cam, canvas);
  tc.setSize(0.85);
  tc.setTranslationSnap(0.5);
  tc.setRotationSnap(THREE.MathUtils.degToRad(5));
  tc.setScaleSnap(0.05);
  scene.add(tc);
  const handle = new THREE.Object3D();
  scene.add(handle);
  let gz = null,
    start = null;
  const damp = v => new THREE.Vector3(1 + (v.x - 1) * 0.4, 1 + (v.y - 1) * 0.4, 1 + (v.z - 1) * 0.4); // the resize cubes are gentler than the raw scale
  tc.addEventListener('dragging-changed', e => {
    ctl.enabled = !e.value;
  });
  tc.addEventListener('objectChange', () => {
    if (bz) return boneChange(false);
    if (!gz) return;
    const g = gz.mesh.parent;
    if (gz.mode === 'move') gz.mesh.position.copy(handle.position.clone().sub(start.p).applyQuaternion(start.q.clone().invert()));
    else if (gz.mode === 'resize') {
      const k = damp(handle.scale),
        c = start.c;
      gz.mesh.scale.copy(k);
      gz.mesh.position.set(start.mp.x + c.x * (1 - k.x), start.mp.y + c.y * (1 - k.y), start.mp.z + c.z * (1 - k.z));
    } /* grows about its middle, as the result does */ else
      g.quaternion.copy(g.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(handle.quaternion));
  });
  tc.addEventListener('mouseUp', () => {
    if (bz) return boneChange(true);
    if (!gz) return;
    const g = gz.mesh.parent;
    gz.onEnd({
      move: handle.position.clone().sub(start.p).applyQuaternion(start.q.clone().invert()),
      scale: damp(handle.scale),
      turn: g.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(handle.quaternion),
    });
  });
  // ghost frames for the Animate tab: faint copies of the figure posed at other frames (the keys before and after)
  const ghostMat = [
    new THREE.MeshBasicMaterial({ color: 0x6fb6ff, transparent: true, opacity: 0.16, depthWrite: false }),
    new THREE.MeshBasicMaterial({ color: 0xffa25a, transparent: true, opacity: 0.16, depthWrite: false }),
  ];
  let ghosts = [],
    ghostOf = null;
  function onion(frames) {
    // frames: [before, after] (null to leave one out); no list clears them
    if (!frames || !figure || !anim.anim) {
      ghosts.forEach(g => g.root.removeFromParent());
      ghosts = [];
      ghostOf = null;
      return;
    }
    if (ghostOf !== figure) {
      ghosts.forEach(g => g.root.removeFromParent());
      ghosts = [];
      for (let i = 0; i < 2; i++) {
        const root = figure.clone(true),
          map = new Map(),
          a = [],
          b = [];
        figure.traverse(o => a.push(o));
        root.traverse(o => b.push(o));
        a.forEach((o, k) => map.set(o, b[k]));
        a.forEach(o => {
          const c = map.get(o);
          c.userData = { ...o.userData };
          if (o.userData.mesh) c.userData.mesh = map.get(o.userData.mesh);
        }); /* clone() copies userData through JSON: links to meshes and rest poses are put back by hand */
        const parts = new Map();
        figure.userData.parts.forEach((gs, k) => parts.set(k, gs.map(g => map.get(g)).filter(Boolean)));
        root.traverse(o => {
          if (o.isMesh) {
            o.material = ghostMat[i];
            o.renderOrder = 2;
            o.raycast = () => {};
          }
        });
        root.userData = { parts };
        figure.parent.add(root);
        const an = new Animator();
        an.figure = root;
        ghosts.push({ root, an });
      }
      ghostOf = figure;
    }
    ghosts.forEach((g, i) => {
      const f = frames[i];
      g.root.visible = f != null;
      if (f == null) return;
      g.root.position.copy(figure.position);
      g.root.rotation.copy(figure.rotation);
      g.an.anim = anim.anim;
      g.an.blend = 1;
      g.an.t = f;
      g.an.apply();
    });
  }
  // the Animate tab's gizmo: turns or moves one bone about its pivot and reports the change as an animation delta (from the rest pose)
  let bz = null;
  function boneDelta() {
    const g = bz.g,
      pq = g.parent.getWorldQuaternion(new THREE.Quaternion()),
      local = pq.clone().invert().multiply(handle.quaternion);
    const q = g.userData.rest.q.clone().invert().multiply(local),
      p = g.parent.worldToLocal(handle.position.clone()).sub(g.userData.rest.p);
    return { q: { x: q.x, y: q.y, z: q.z, w: q.w }, p: { x: p.x, y: p.y, z: p.z } };
  }
  function boneChange(end) {
    const d = boneDelta();
    bz.onChange(bz.mode === 'rotate' ? { orientation: d.q } : { position: d.p }, end);
  }
  function boneGizmo(o) {
    // o: { g (the bone's group), mode: 'rotate' | 'move', onChange(delta, end) } or null
    bz = o || null;
    if (!o) {
      if (!gz) tc.detach();
      tc.setSize(0.85);
      return;
    }
    gz = null;
    const g = o.g;
    g.updateMatrixWorld(true);
    tc.setSize(0.55); /* smaller than the box gizmo: the turn ball must not cover the whole body, so other bones can be clicked */
    handle.position.copy(g.getWorldPosition(new THREE.Vector3()));
    handle.quaternion.copy(g.getWorldQuaternion(new THREE.Quaternion()));
    handle.scale.set(1, 1, 1);
    tc.setMode(o.mode === 'move' ? 'translate' : 'rotate');
    tc.setSpace('local');
    tc.setRotationSnap(null);
    tc.setTranslationSnap(null);
    tc.attach(handle);
  }
  function gizmo(o) {
    if (o) {
      bz = null;
      tc.setRotationSnap(THREE.MathUtils.degToRad(5));
      tc.setTranslationSnap(0.5);
    }
    gz = o;
    if (!o) {
      if (!bz) tc.detach();
      return;
    }
    const g = o.mesh.parent;
    g.updateMatrixWorld(true);
    handle.position.copy(
      o.mode === 'rotate' ? g.getWorldPosition(new THREE.Vector3()) : new THREE.Box3().setFromObject(o.mesh).getCenter(new THREE.Vector3())
    );
    handle.quaternion.copy(g.getWorldQuaternion(new THREE.Quaternion()));
    handle.scale.set(1, 1, 1);
    o.mesh.geometry.computeBoundingBox();
    start = {
      p: handle.position.clone(),
      q: handle.quaternion.clone(),
      mp: o.mesh.position.clone(),
      c: o.mesh.geometry.boundingBox.getCenter(new THREE.Vector3()),
    };
    tc.setMode(o.mode === 'move' ? 'translate' : o.mode === 'resize' ? 'scale' : 'rotate');
    tc.setSpace('local');
    tc.attach(handle);
  }
  const VIEWS = { front: [0, 62, 270], back: [0, 62, -270], side: [-270, 62, 0], top: [0, 330, 1], persp: [-75, 95, 255] };
  // a ridden animal under the figure: the figure sits at the animal's seat (in model units) and the view backs off to fit both
  const seatAt = () => {
    if (!figure) return;
    const k = anim.blend < 1 ? anim.blend * anim.blend * (3 - 2 * anim.blend) : 1;
    figure.position.set(0, (seat ? seat[1] : 0) + hoverAt + perchFrom + (perchY - perchFrom) * k, seat ? seat[2] : 0);
    figure.rotation.x = pitchAt;
    figure.rotation.y = yawAt;
    if (pitchAt) {
      const c = 70;
      figure.position.y += c - c * Math.cos(pitchAt);
      figure.position.z -= c * Math.sin(pitchAt);
    }
  }; // a swimmer lies forward, turning about the chest   // a seat's lift eases in with the pose, so nobody stands on the chair first
  // scenery a move needs: boxes and planes in the scene (a chair, a bed, the water's surface); perch lifts the figure onto it
  const setPiece = new THREE.Group();
  scene.add(setPiece);
  async function scenery(list, perch = 0) {
    const my = (scenery.n = (scenery.n || 0) + 1);
    const made = await Promise.all(
      (list || []).map(async it => {
        let map = null;
        if (it.block) {
          const g = new THREE.Group();
          try {
            g.add(await blockModel(it.block));
          } catch (e) {
            console.warn(it.block, e.message);
            return null;
          }
          g.position.set(...it.at);
          g.rotation.y = ((it.turn || 0) * Math.PI) / 180;
          if (it.stretch) g.scale.z = it.stretch;
          return g;
        } // the game's own furniture (stretch: a touch longer along its own z)
        if (it.ladder) {
          const [cols, rows] = it.ladder,
            g = new THREE.Group();
          try {
            await blockModel(SET_PIECES.ladder);
            await blockModel(SET_PIECES.wall);
          } catch (e) {
            console.warn('ladder', e.message);
            return null;
          } // a wall of the game's ladders on planks, one block more each way so it can slide
          for (let c = -3; c <= cols + 2; c++)
            for (let r = -1; r <= rows; r++) {
              const x = (c - (cols - 1) / 2) * BLOCK,
                w = await blockModel(SET_PIECES.wall);
              w.position.set(x, r * BLOCK, BLOCK);
              g.add(w);
              if (cols > 1 ? c >= -1 && c <= cols : c === 0) {
                const l = await blockModel(SET_PIECES.ladder);
                l.position.set(x, r * BLOCK, 0);
                l.rotation.y = Math.PI;
                g.add(l);
              }
            } // the wall wider than the ladders
          g.position.set(...it.at);
          g.userData.scroll = g.position.clone();
          return g;
        }
        if (it.tex) {
          try {
            const T = await texture(it.tex);
            map = T.mat.map.clone();
            map.wrapS = map.wrapT = THREE.RepeatWrapping;
            map.repeat.set(...(it.repeat || [1, 1]));
            map.needsUpdate = true;
          } catch (e) {
            console.warn(it.tex, e.message);
          }
        }
        const mat = new THREE.MeshLambertMaterial({
          map,
          color: it.color ?? 0xffffff,
          transparent: it.opacity != null,
          opacity: it.opacity ?? 1,
          depthWrite: it.opacity == null,
          side: THREE.DoubleSide,
        });
        const geo = it.plane ? new THREE.PlaneGeometry(...it.plane) : new THREE.BoxGeometry(...it.box),
          m = new THREE.Mesh(geo, mat);
        if (it.plane) m.rotation.x = -Math.PI / 2;
        if (it.volume) {
          m.userData.volume = true;
          m.renderOrder = 2;
        }
        m.position.set(...it.at);
        if (it.flow) m.userData.flow = it.plane[0] / (it.repeat || [1])[0];
        return m;
      })
    );
    const drop = m =>
      m.traverse(o => {
        if (o.isMesh && !o.userData.shared) {
          o.geometry.dispose();
          o.material.map?.dispose();
          o.material.dispose();
        }
      }); // game blocks are shared, kept
    const lost = made.some(m => !m);
    made.splice(0, made.length, ...made.filter(Boolean));
    if (lost) api.onMissing?.(); // older copies of the game files lack the furniture
    if (my !== scenery.n) return made.forEach(drop);
    for (const m of [...setPiece.children]) {
      setPiece.remove(m);
      drop(m);
    }
    for (const m of made) setPiece.add(m);
    scrollers = made.filter(m => m.userData.scroll);
    flowing = made.filter(m => m.userData.flow);
    perchFrom = perchY;
    perchY = perch;
    seatAt();
    groundRects();
  }
  // the ground each set piece stands on, in blocks, so no plant grows through a chair, a bed or a ladder wall
  function groundRects() {
    const box = new THREE.Box3(),
      rs = [];
    setPiece.updateMatrixWorld(true);
    for (const m of setPiece.children) {
      if (m.userData.flow || m.userData.volume) continue;
      box.setFromObject(m);
      if (box.isEmpty() || box.min.y > 40) continue;
      rs.push([box.min.x / BLOCK, box.min.z / BLOCK, box.max.x / BLOCK, box.max.z / BLOCK]);
    }
    if (world) {
      world.userData.avoid = rs;
      world.userData.relayout();
    } else pendingRects = rs;
  }
  let pendingRects = [];
  // flying moves: the figure rises off the ground and bobs gently, easing up and down when the move changes
  function float(dt, now) {
    if (figure && (perchY || perchFrom)) seatAt();
    for (const h of held) {
      if (anim.blend > 0.8 || now - (h.at || 0) > 600) h.shown = true;
      h.root.visible = !!h.shown;
    } // a held thing shows once the hands have reached it, not swinging up from the feet
    if (figure && (pitchTo || pitchAt)) {
      pitchAt += (pitchTo - pitchAt) * (1 - Math.exp(-dt * 5));
      if (Math.abs(pitchTo - pitchAt) < 0.002) pitchAt = pitchTo;
      seatAt();
    }
    if (!figure || (!hoverTo && !hoverAt)) return;
    hoverAt += (hoverTo - hoverAt) * (1 - Math.exp(-dt * 4));
    if (Math.abs(hoverTo - hoverAt) < 0.05) hoverAt = hoverTo;
    seatAt();
    if (hoverAt > 1 && hoverTo) figure.position.y += Math.sin((now / 1000) * 2.2) * 2.5 * Math.min(1, hoverAt / hoverTo);
  }
  // things held in the hands (a glider, a sword ...): each hangs on a bone of the figure and moves with it; re-hung when the figure is rebuilt
  // a held thing can sit a little away from where the move puts it (shift: [x, y, z] in model units in the scene, the figure faces +z, whatever the hand's turn)
  const dq = new THREE.Quaternion(),
    dv = new THREE.Vector3(),
    ds = new THREE.Vector3();
  // which side of the figure faces the camera (the figure faces +z): told to api.onFacing when it changes
  function facing() {
    if (!faceCb) return;
    const a = (Math.atan2(cam.position.x - ctl.target.x, cam.position.z - ctl.target.z) * 180) / Math.PI;
    const f = Math.abs(a) <= 45 ? 'front' : Math.abs(a) >= 135 ? 'back' : a > 0 ? 'left side' : 'right side';
    if (f !== faced) {
      faced = f;
      faceCb(f);
    }
  }
  function dropHeld() {
    for (const h of held) {
      const b = h.root.parent;
      if (!h.shift || !b) continue;
      b.updateWorldMatrix(true, false);
      b.getWorldQuaternion(dq).invert();
      b.getWorldScale(ds);
      h.root.position.copy(
        dv
          .set(...h.shift)
          .applyQuaternion(dq)
          .divide(ds)
      );
    }
  }
  // the moves animate the held thing's own parts too (the glider's frame and flaps), so those parts join the figure's while it is held;
  // parts sharing a name with the body (the item's root is named after the hand's attachment) stay out, or the move would apply twice
  const unhang = () => {
    for (const h of held) {
      h.root.parent?.remove(h.root);
      const fp = h.on?.userData.parts;
      if (fp)
        for (const [k, g] of h.added || []) {
          const gs = fp.get(k);
          if (gs) {
            const i = gs.indexOf(g);
            if (i >= 0) gs.splice(i, 1);
            if (!gs.length) fp.delete(k);
          }
        }
      h.on = null;
      h.added = [];
    }
  };
  const hang = () => {
    unhang();
    for (const h of held) {
      const b = figure?.userData.bones?.[h.bone];
      if (!b) continue;
      b.add(h.root);
      if (h.turn) h.root.rotation.set(...h.turn.map(d => (d * Math.PI) / 180));
      if (h.root.children.length === 1) {
        const top = h.root.children[0];
        top.position.set(0, 0, 0);
        top.userData.rest?.p.set(0, 0, 0);
      } // as in game: the item's own root node sits ON the hand's attachment point (its offset in the file is ignored)
      const fp = figure.userData.parts;
      h.on = figure;
      h.added = [];
      h.root.userData.parts?.forEach((gs, k) => {
        if (fp.has(k) && !h.added.some(a => a[0] === k)) return;
        for (const g of gs) {
          g.userData.held = true;
          (fp.get(k) || fp.set(k, []).get(k)).push(g);
          h.added.push([k, g]);
        }
      });
    }
    anim.setFigure(figure);
  };
  function props(list) {
    unhang();
    for (const h of held) dispose(h.root);
    held = list || [];
    for (const h of held) h.at = performance.now();
    if (figure) hang();
  }
  // a tall move (gliding, arms and glider high overhead): aim higher and back off so it all fits; lift(0) puts the view back
  let lifted = null;
  // camera moves glide (about 0.4 s) around the character instead of jumping; grabbing the view stops a glide
  const endGlide = () => {
    if (tw) stepCam(tw.at + 1e6);
  }; // jump a running glide to its end
  const glideCam = fn => {
    const t0 = ctl.target.clone(),
      p0 = cam.position.clone();
    const r = fn();
    const t1 = ctl.target.clone(),
      p1 = cam.position.clone();
    if (t0.distanceTo(t1) < 0.5 && p0.distanceTo(p1) < 0.5) return r;
    const s0 = new THREE.Spherical().setFromVector3(p0.clone().sub(t0)),
      s1 = new THREE.Spherical().setFromVector3(p1.clone().sub(t1));
    let dth = s1.theta - s0.theta;
    dth = ((((dth + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
    tw = { t0, t1, s0, s1, dth, at: performance.now() };
    ctl.target.copy(t0);
    cam.position.copy(p0);
    ctl.update();
    return r;
  };
  function lift(...a) {
    return glideCam(() => liftNow(...a));
  }
  function liftNow(y, phi = 0, len = 360, z = 0) {
    const off = cam.position.clone().sub(ctl.target); // phi: look down from at least this high (polar angle), to see into a bed
    if (y) {
      if (!lifted) lifted = { len: off.length(), phi: new THREE.Spherical().setFromVector3(off).phi };
      off.setLength(len < 0 ? -len : Math.max(off.length(), len));
      if (len < 0) {
        const sp = new THREE.Spherical().setFromVector3(off);
        sp.theta = 0;
        off.setFromSpherical(sp);
      }
      ctl.target.set(0, y, z); // a negative len is an exact distance (close on the face)
      if (phi) {
        const sp = new THREE.Spherical().setFromVector3(off);
        sp.phi = Math.min(sp.phi, phi);
        off.setFromSpherical(sp);
      }
    } else if (lifted && mountRoot) {
      lifted = null;
      return;
    } // the mount has framed rider and animal itself: leave that
    else if (lifted) {
      const sp = new THREE.Spherical().setFromVector3(off);
      sp.radius = lifted.len;
      sp.phi = Math.max(sp.phi, lifted.phi);
      off.setFromSpherical(sp);
      ctl.target.set(0, 62, 0);
      lifted = null;
    } else return;
    cam.position.copy(ctl.target).add(off);
    ctl.update();
  }
  function mount(root, at) {
    endGlide();
    return mountNow(root, at);
  }
  function mountNow(root, at) {
    const was = !!mountRoot;
    if (mountRoot) {
      scene.remove(mountRoot);
      dispose(mountRoot);
    }
    mountRoot = root || null;
    seat = root ? at : null;
    if (root) {
      scene.add(root);
      mountAnim.setFigure(root);
    } else {
      mountAnim.anim = null;
      mountAnim.figure = null;
    }
    seatAt();
    if (root) {
      const top = at[1] + 135,
        [b, , , h] = insets(),
        len = Math.min(700, ((top + 40) * h) / (2 * Math.tan((16 * Math.PI) / 180) * (h - b))); // rider and animal both in view: the rider's head is the seat plus a body
      ctl.maxDistance = Math.max(1250, len);
      const off = cam.position.clone().sub(ctl.target).setLength(len),
        sp = new THREE.Spherical().setFromVector3(off);
      sp.phi = Math.min(sp.phi, 1.3);
      off.setFromSpherical(sp);
      /* the player's angle stays: only the distance fits the animal */ ctl.target.set(0, top / 2 + 4, 0);
      cam.position.copy(ctl.target).add(off);
      ctl.update();
    } else if (was) {
      ctl.maxDistance = 1250;
      const off = cam.position.clone().sub(ctl.target).setLength(fitLen());
      ctl.target.set(0, 62, 0);
      cam.position.copy(ctl.target).add(off);
      ctl.update();
    }
  }
  const fitLen = () => {
    const [b, r, w, h] = insets(),
      t = Math.tan((16 * Math.PI) / 180),
      tall = 2 * Math.max(62, figTop - 62) + 26; // far enough that the whole character (helmet and all) fits in the free part of the view
    return Math.min(470, Math.max((tall * h) / (2 * t * (h - b)), (48 * h) / (t * (w - r))));
  };
  const refit = () => glideCam(refitNow);
  const refitNow = () => {
    if (!autoFit || lifted || mountRoot) return;
    const off = cam.position.clone().sub(ctl.target);
    off.setLength(fitLen());
    cam.position.copy(ctl.target).add(off);
    ctl.update();
  };
  let grabbed = null;
  ctl.addEventListener('start', () => {
    tw = null;
    grabbed = cam.position.clone();
  });
  ctl.addEventListener('end', () => {
    if (grabbed && cam.position.distanceTo(grabbed) > 2) autoFit = false;
    grabbed = null;
  }); // once the player really zooms or turns the view, it stays theirs (a click is not a turn)
  const api = {
    target: () => ctl.target,
    face: (rad, now) => {
      yawTo = rad || 0;
      if (now) yawAt = yawTo;
    },
    facing: () => yawTo,
    onion,
    boneGizmo,
    twinTexel,
    inset: (px, right = 0) => {
      px = Math.max(0, Math.round(px || 0));
      right = Math.max(0, Math.round(right || 0));
      if (px !== inset || right !== insetR) {
        inset = px;
        insetR = right;
        fit();
        refit();
      }
    },
    plantClear: r => {
      plantClear = r || 0;
    },
    isolate: img => {
      isoImage = img || null;
      applyIsolate();
      drawHL();
    },
    anim,
    mountAnim,
    mount,
    props,
    lift,
    scenery,
    onFacing: cb => {
      faceCb = cb;
      faced = '';
    },
    wall: v => {
      wallOn = v || null;
    },
    keepBehind: on => {
      ctl.minAzimuthAngle = on ? Math.PI - 1.1 : -Infinity;
      ctl.maxAzimuthAngle = on ? -Math.PI + 1.1 : Infinity;
      ctl.update();
    },
    hover: (h, now) => {
      if (h === null) return;
      hoverTo = Math.max(0, h || 0);
      if (now) {
        hoverAt = hoverTo;
        seatAt();
      }
    },
    shadow: on => {
      disc.userData.on = on !== false;
      disc.visible = on !== false;
    },
    jump: h => {
      jumpH = Math.max(0, h || 0);
    },
    fall: on => {
      if (!!on !== fallOn) fallT = 0;
      fallOn = !!on;
    },
    pitch: deg => {
      pitchTo = ((deg || 0) * Math.PI) / 180;
    },
    pick,
    pickMesh,
    paintMode,
    gizmo,
    cursor,
    afterShow: null,
    gizmoBusy: (cx, cy) => {
      if (cx != null && tc.object && !tc.dragging) {
        const r = canvas.getBoundingClientRect();
        tc.pointerHover({ x: ((cx - r.left) / r.width) * 2 - 1, y: -((cy - r.top) / r.height) * 2 + 1, button: 0 });
      }
      return tc.dragging || tc.axis !== null;
    }, // a press right on the gizmo (ring, arrow, handle) is the gizmo's, even with no hover before it
    // where a click lands on a box: the point and the face's outward direction, in the box's own part (node) space
    pickHit(cx, cy, keep) {
      if (!figure) return null;
      aim(cx, cy);
      for (const h of ray.intersectObject(figure, true))
        if (h.object.visible && keep(h.object)) {
          const g = h.object.parent,
            point = g.worldToLocal(h.point.clone()),
            geo = h.object.geometry;
          if (!geo.boundingBox) geo.computeBoundingBox();
          const normal = h.face ? h.face.normal.clone() : new THREE.Vector3(0, 0, 1);
          if (normal.dot(point.clone().sub(geo.boundingBox.getCenter(new THREE.Vector3()))) < 0) normal.negate(); // always outward
          return { mesh: h.object, point, normal };
        }
      return null;
    },
    // drag a box itself: it slides flat to the screen; move() gives the shift in the box's own axes, like the gizmo
    boxDrag(mesh, cx, cy) {
      const g = mesh.parent;
      g.updateMatrixWorld(true);
      aim(cx, cy);
      const hit = ray.intersectObject(mesh, false)[0];
      if (!hit) return null;
      const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(cam.getWorldDirection(new THREE.Vector3()), hit.point),
        start = hit.point.clone(),
        q = g.getWorldQuaternion(new THREE.Quaternion()).invert(),
        s = g.getWorldScale(new THREE.Vector3()),
        p0 = mesh.position.clone();
      ctl.enabled = false;
      return {
        move(x, y) {
          aim(x, y);
          const p = ray.ray.intersectPlane(plane, new THREE.Vector3());
          if (!p) return null;
          const d = p.sub(start).applyQuaternion(q).divide(s);
          mesh.position.copy(p0).add(d);
          return d;
        },
        end() {
          ctl.enabled = true;
          mesh.position.copy(p0);
        },
      };
    },
    zoomBy(k) {
      autoFit = false;
      const off = cam.position.clone().sub(ctl.target),
        len = Math.max(ctl.minDistance, Math.min(ctl.maxDistance, off.length() * k));
      cam.position.copy(ctl.target).add(off.setLength(len));
      ctl.update();
    },
    frameOn(img) {
      // turn the view on the parts painted with this texture, close enough to fill the view
      if (!figure || !img) return;
      endGlide();
      autoFit = false;
      const box = new THREE.Box3();
      figure.updateMatrixWorld(true); // a close-up is the player's view now: no refit or glide pulls it back
      figure.traverse(o => {
        if (o.isMesh && (o.userData.realMat || o.material)?.map?.image === img) box.expandByObject(o);
      });
      if (box.isEmpty()) return;
      const c = box.getCenter(new THREE.Vector3()),
        r = Math.max(14, box.getSize(new THREE.Vector3()).length() / 2),
        dir = cam.position.clone().sub(ctl.target).normalize();
      ctl.target.copy(c);
      const half = Math.min((cam.fov * Math.PI) / 360, Math.atan(Math.tan((cam.fov * Math.PI) / 360) * cam.aspect)); // the narrower of the two view angles
      cam.position.copy(c).add(dir.multiplyScalar(Math.min(ctl.maxDistance, Math.max(ctl.minDistance, (r / Math.sin(half)) * 1.1))));
      ctl.update();
    },
    orbit(dx, dy) {
      const off = cam.position.clone().sub(ctl.target),
        s = new THREE.Spherical().setFromVector3(off);
      const k = (0.55 * 2 * Math.PI) / Math.max(1, canvas.clientHeight);
      s.theta -= dx * k;
      s.phi = Math.max(0.05, Math.min(Math.PI - 0.05, s.phi - dy * k));
      off.setFromSpherical(s);
      cam.position.copy(ctl.target).add(off);
      ctl.update();
    },
    showMesh(mesh) {
      if (!mesh) return;
      const box = new THREE.Box3().setFromObject(mesh);
      if (box.isEmpty()) return;
      const c = box.getCenter(new THREE.Vector3()),
        p = c.clone().project(cam); /* a picked part off screen: the view slides over to it, keeping its angle and distance */
      if (Math.abs(p.x) < 0.8 && Math.abs(p.y) < 0.8 && p.z < 1) return;
      glideCam(() => {
        const off = cam.position.clone().sub(ctl.target);
        ctl.target.copy(c);
        cam.position.copy(c).add(off);
        autoFit = false;
        ctl.update();
      });
    },
    findMesh(keep) {
      let hit = null;
      figure?.traverse(o => {
        if (!hit && o.isMesh && keep(o)) hit = o;
      });
      return hit;
    },
    setView(name) {
      const v = VIEWS[name] || VIEWS.persp;
      cam.position.set(...v);
      ctl.target.set(0, 62, 0);
      ctl.update();
    },
    highlight(f) {
      hl = f;
      drawHL();
    },
    show(root) {
      if (figure) {
        unhang();
        scene.remove(figure);
        dispose(figure);
      }
      figure = root;
      scene.add(root);
      {
        const y = new THREE.Box3().setFromObject(root).max.y;
        if (isFinite(y) && Math.abs(y - figTop) > 4) {
          figTop = Math.max(120, Math.min(220, y));
          refit();
        }
      }
      seatAt();
      anim.setFigure(root);
      hang();
      lit = [];
      applyIsolate();
      drawHL();
      if (api.afterShow) api.afterShow();
    },
    view(front) {
      return glideCam(() => api.viewNow(front));
    },
    viewNow(front) {
      const off = new THREE.Vector3(front ? 0 : -75, 33, front ? 265 : 255); // during a tall move (gliding, flying, climbing) keep its raised aim and distance
      if (lifted) off.setLength(Math.max(off.length(), 360));
      else {
        ctl.target.set(0, 62, 0);
        off.setLength(fitLen());
        autoFit = true;
      }
      cam.position.copy(ctl.target).add(off);
      ctl.update();
    },
    // back to full-body distance after a close-up, keeping the angle the player chose
    unclose() {
      return glideCam(() => {
        if (lifted || mountRoot) return;
        const off = cam.position.clone().sub(ctl.target),
          L = fitLen();
        ctl.target.set(0, 62, 0);
        off.setLength(Math.max(L, Math.min(off.length(), ctl.maxDistance)));
        autoFit = true;
        cam.position.copy(ctl.target).add(off);
        ctl.update();
      });
    },
    // the camera to the figure's front side, mirrored from where it is (after watching a climb from behind)
    toFront() {
      return glideCam(() => {
        const off = cam.position.clone().sub(ctl.target);
        if (off.z >= 0) return;
        off.x = -off.x;
        off.z = -off.z;
        cam.position.copy(ctl.target).add(off);
        ctl.update();
      });
    },
    behind() {
      endGlide();
      return api.behindNow();
    },
    behindNow() {
      if (cam.position.z - ctl.target.z < 0) return;
      const off = cam.position.clone().sub(ctl.target);
      off.x = -off.x;
      off.z = -off.z;
      cam.position.copy(ctl.target).add(off);
      ctl.update();
    },
  }; // a climb is watched from behind, as in the game
  // ---- in-game backgrounds: a sky dome from the zone's sky and fog colours, and a floor of its ground blocks fading into that fog
  const shadow = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d'),
      g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(0,0,0,0.42)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.22)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  // bd: { top, fog } colours from the zone's weather at noon, sc: its entry in SCENES, tint: the biome's grass colour
  // a picture of the stage as it is now, at twice the screen's pixels: with its background, or the character alone on transparency
  let recPr = null;
  api.recordMode = on => {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (on && recPr === null) {
      recPr = renderer.getPixelRatio();
      renderer.setPixelRatio(Math.max(2, recPr));
      renderer.setSize(w, h, false);
    } else if (!on && recPr !== null) {
      renderer.setPixelRatio(recPr);
      recPr = null;
      renderer.setSize(w, h, false);
    }
  }; // videos at twice the screen's pixels
  api.capture = transparent => {
    const hide = transparent ? [sky, world, disc, grid, wallG, shaftG, streaks, mist, setPiece].filter(o => o && o.visible) : [],
      fog = scene.fog,
      bg = scene.background,
      pr = renderer.getPixelRatio(),
      w = canvas.clientWidth,
      h = canvas.clientHeight;
    hide.forEach(o => {
      o.visible = false;
    });
    if (transparent) {
      scene.fog = null;
      scene.background = null;
    }
    renderer.setPixelRatio(Math.max(2, pr));
    renderer.setSize(w, h, false);
    try {
      renderer.render(scene, cam);
      return { url: renderer.domElement.toDataURL('image/png'), sky: !!sky };
    } finally {
      hide.forEach(o => {
        o.visible = true;
      });
      scene.fog = fog;
      scene.background = bg;
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
      renderer.render(scene, cam);
    }
  };
  api.world = () => world;
  api.camera = cam;
  api.orbitTo = (az, el, dist) => {
    const t = ctl.target;
    cam.position.set(t.x + Math.sin(az) * Math.cos(el) * dist, t.y + Math.sin(el) * dist, t.z + Math.cos(az) * Math.cos(el) * dist);
    ctl.update();
  }; // for tests
  // the wave: every block of a side is drawn with a copy of its material that scales each block (instance) by the wave's clock at its
  // distance; block materials are shared between places, so the copies are what differ. When it has passed, the old place goes
  const WAVE_LAG = 0.12; // the new block starts this much after the old one, so the two never sit the same size in the same place
  const waveMat = (m, inside) => {
    const c = m.clone();
    c.defines = { ...(c.defines || {}), [inside ? 'WAVE_IN' : 'WAVE_OUT']: '' };
    c.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, { uWaveT: REV.t, uWaveSpread: REV.spread, uWaveEdge: REV.edge, uWaveDur: REV.dur });
      sh.vertexShader =
        'uniform float uWaveT; uniform float uWaveSpread; uniform float uWaveEdge; uniform float uWaveDur;\n' +
        sh.vertexShader.replace(
          '#include <begin_vertex>',
          [
            '#include <begin_vertex>',
            '#ifdef USE_INSTANCING',
            'vec3 waveC = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;',
            '#else',
            'vec3 waveC = (modelMatrix * vec4(position, 1.0)).xyz;',
            '#endif',
            'float waveJ = fract(sin(dot(floor(waveC.xz / 64.0), vec2(12.9898, 78.233))) * 43758.5453);',
            'float waveS = uWaveSpread * pow(clamp(length(waveC.xz) / uWaveEdge, 0.0, 1.0), 0.6) + waveJ * ' + WAVE_LAG + ';',
            '#ifdef WAVE_IN',
            'float waveK = clamp((uWaveT - waveS - ' + WAVE_LAG + ') / uWaveDur, 0.0, 1.0);',
            'float waveE = waveK <= 0.0 ? 0.0 : 1.0 + 2.70158 * pow(waveK - 1.0, 3.0) + 1.70158 * pow(waveK - 1.0, 2.0);',
            '#else',
            'float waveK = clamp((uWaveT - waveS) / uWaveDur, 0.0, 1.0);',
            'float waveE = 1.0 - waveK * waveK * (3.0 - 2.0 * waveK);',
            '#endif',
            'transformed *= waveE;',
          ].join('\n')
        );
    };
    c.customProgramCacheKey = () => 'wave' + (inside ? 'in' : 'out');
    return c;
  }; /* a new block grows from its foot with a little overshoot; an old one shrinks smoothly away */
  const dress = (root, inside) => {
    const copies = new Map(),
      copy = m => (copies.has(m) ? copies.get(m) : copies.set(m, waveMat(m, inside)).get(m));
    root?.traverse(o => {
      if (!o.isMesh || !o.material) return;
      o.userData.waveOwn = o.material;
      o.material = Array.isArray(o.material) ? o.material.map(copy) : copy(o.material);
    });
    return copies;
  };
  const undress = (root, copies) => {
    root?.traverse(o => {
      if (o.userData.waveOwn) {
        o.material = o.userData.waveOwn;
        delete o.userData.waveOwn;
      }
    });
    for (const c of copies.values()) c.dispose();
  };
  const dropSky = s => {
    if (!s) return;
    scene.remove(s);
    s.geometry.dispose();
    s.material.dispose();
  };
  const skyFade = (s, a) => {
    if (!s) return;
    s.material.opacity =
      a; /* the sky is made transparent from the start: switching that later needs a new shader, so it would draw solid */
  };
  function waveEnd() {
    if (!wave) return;
    const w = wave;
    wave = null;
    for (const [root, copies] of w.dressed) undress(root, copies);
    dropSky(w.oldSky);
    skyFade(sky, 1);
    if (w.old) {
      scene.remove(w.old);
      disposeTree(w.old);
    }
    grid.material.uniforms.revMode.value = 0;
  }
  const WAVE_ALL = WAVE_SPREAD + 2 * WAVE_LAG + WAVE_POP;
  function waveStep(now) {
    if (!wave) return;
    if (wave.at == null) wave.at = now;
    const s = (now - wave.at) / 1000,
      k = Math.min(1, s / WAVE_ALL) /* the sky blends over exactly the wave's time */,
      f = k * k * k * (k * (k * 6 - 15) + 10);
    REV.t.value = s;
    REV.r.value =
      REV_EDGE * Math.pow(Math.min(1, Math.max(0, s - WAVE_POP * 0.4) / WAVE_SPREAD), 1 / 0.6); /* where the blocks are half way */
    skyFade(sky, f);
    skyFade(
      wave.oldSky,
      sky ? 1 : 1 - f
    ); /* the new sky is drawn over the old one and fades in; going to the Studio, the old one fades out */
    if (s >= WAVE_ALL) waveEnd();
  }
  const reduceMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // animate: spread the change out from the character (a pick from the menu), rather than swap at once (opening the page)
  api.setBackdrop = async (bd, sc, tint, animate = false) => {
    const my = (api.setBackdrop.n = (api.setBackdrop.n || 0) + 1);
    let built = null;
    if (bd)
      try {
        built = await buildWorld(sc, tint);
      } catch (e) {
        console.warn('scene', e);
        if (my === api.setBackdrop.n) throw new Error('scene files missing');
        return;
      } // the caller says what is missing
    if (my !== api.setBackdrop.n) {
      if (built) disposeTree(built);
      return;
    }
    waveEnd();
    const goWave = animate && !reduceMotion() && !fallOn && !!(sky || bd),
      oldSky = sky,
      oldWorld = world;
    sky = null;
    world = null;
    if (!goWave) {
      dropSky(oldSky);
      if (oldWorld) {
        scene.remove(oldWorld);
        disposeTree(oldWorld);
      }
    }
    scene.fog = null;
    disc.material.map = bd ? shadow : null;
    disc.material.color.set(bd ? 0xffffff : 0x0b1626);
    disc.material.opacity = bd ? 1 : 0.55;
    disc.material.needsUpdate = true;
    disc.position.y = bd ? 0.9 : -0.2; // the shadow above the sliding floor
    ctl.maxPolarAngle = Math.PI * 0.47;
    ctl.update(); // on real land the camera stays above the ground
    const startWave = () => {
      if (!goWave) return;
      wave = { old: oldWorld, oldSky, grid: !oldSky, dressed: [], at: null };
      wave.dressed.push([oldWorld, dress(oldWorld, false)], [world, dress(world, true)]);
      if (sky) sky.renderOrder = -1;
      skyFade(sky, 0);
      grid.material.uniforms.revMode.value = oldSky ? 1 : -1; /* the Studio floor is the new side (inside the ring) or the old (outside) */
      REV.t.value = 0;
      REV.r.value = 0;
      renderer.compile(scene, cam); /* the copies' shaders are built now, so the wave doesn't stutter as it starts */
    };
    if (!bd) return startWave();
    const top = new THREE.Color(bd.top),
      hor = new THREE.Color(bd.fog),
      R = 11000,
      g = new THREE.SphereGeometry(R, 48, 24),
      p = g.attributes.position,
      cols = [];
    for (let i = 0; i < p.count; i++) {
      const c = hor.clone().lerp(top, Math.pow(Math.max(0, p.getY(i) / R), 0.5));
      cols.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    sky = new THREE.Mesh(
      g,
      new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false, transparent: true })
    );
    sky.renderOrder = -2;
    scene.add(sky);
    if (built) {
      world = built;
      scene.add(world);
      world.userData.avoid = pendingRects;
      groundRects();
    }
    scene.fog = null;
    mist = null; // clear air all the way out: the mountain ring closes the horizon
    startWave();
  };
  return api;
}
let TR, tscene, tcam;
// [look-at height, half size, sideways camera offset, camera height above the target]
const FRAME = {
  head: [112, 36, -120, 40],
  face: [112, 24, -55, 12],
  ear: [114, 32, -170, 14],
  hat: [118, 34, -110, 70],
  pants: [34, 36, -110, 10],
  socks: [22, 30, -130, 8],
  shoes: [10, 22, -150, 34],
  gloves: [52, 18, -130, 12, -22],
  hips: [44, 28, -120, 20],
  top: [76, 34, -110, 30],
  legs: [30, 34, -120, 40],
  body: [64, 70, -120, 40],
  torso: [74, 36, -120, 40],
  full: [66, 76, -120, 40],
};
export function snapshot(root, frame = 'full', back = false, px = 128) {
  // a square picture of a built figure (128 px unless asked), as a data URL
  if (!TR) {
    TR = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    tscene = new THREE.Scene();
    lights(tscene);
    tcam = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2000);
  }
  const [cy, h, sx, up, tx = 0] = FRAME[frame] || FRAME.full,
    s = back ? -1 : 1;
  tcam.left = -h;
  tcam.right = h;
  tcam.top = h;
  tcam.bottom = -h;
  tcam.updateProjectionMatrix();
  tcam.position.set(sx * s + tx, cy + up, 300 * s);
  tcam.lookAt(tx, cy, 0);
  TR.setSize(px, px);
  tscene.add(root);
  TR.render(tscene, tcam);
  tscene.remove(root);
  dispose(root);
  return TR.domElement.toDataURL();
}
