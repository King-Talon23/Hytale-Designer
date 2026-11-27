// The game's terrain generator, rebuilt for the backgrounds: a biome tile from the world generator's files in the player's
// Assets.zip (Server/World/Default/Zones/<Zone>/Tile.<Biome>.json) gives the height of the ground, the water and the surface
// blocks at any spot, worked out the way the game works them out: its noise maps (simplex, cell and distance noise, summed,
// distorted and shaped by its formulas), its height thresholds (the ground is solid where the threshold at a height is above the
// noise) and its surface layers. No three.js here, so it also runs in a worker.

// ---- the world generator's files carry // and /* */ notes and trailing commas
export function loose(text) {
  let out = '',
    q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      out += c;
      if (c === '\\') out += text[++i];
      else if (c === '"') q = false;
    } else if (c === '"') {
      q = true;
      out += c;
    } else if (c === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      out += '\n';
    } else if (c === '/' && text[i + 1] === '*') {
      const e = text.indexOf('*/', i + 2);
      i = e < 0 ? text.length : e + 1;
    } else out += c;
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, '$1'));
}
// "Zones.Noise.Zone1.Heightmaps.Plains_Birch" -> the file it names
export const refPath = f => 'Server/World/Default/' + f.replace(/\./g, '/') + '.json';

// ---- integer helpers with the game's 32-bit overflow
const imul = Math.imul;
const trunc = v => (v < 0 ? Math.ceil(v) : Math.floor(v)) | 0;
const fastFloor = f => (f >= 0 ? trunc(f) : trunc(f) - 1);
const floor = f => {
  const i = trunc(f);
  return f < i ? i - 1 : i;
};
export function strHash(s) {
  // a string's seed (the game's way: Java's String.hashCode)
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (imul(h, 31) + s.charCodeAt(i)) | 0;
  return h;
}
const limit = v => (v < 0 ? 0 : v > 1 ? 1 : v !== v ? 0 : v);

// ---- simplex noise (the game's fast 2D simplex: skew 0.5, unskew 0.25)
const G2 = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];
function hash2D(seed, x, y) {
  let h = seed ^ imul(1619, x);
  h ^= imul(31337, y);
  h = imul(imul(imul(h, h), h), 60493);
  return (h >> 13) ^ h;
}
function grad2(seed, x, y, xd, yd) {
  const g = G2[hash2D(seed, x, y) & 7];
  return xd * g[0] + yd * g[1];
}
function simplex(s, x, y) {
  let t = (x + y) * 0.5;
  const i = fastFloor(x + t),
    j = fastFloor(y + t);
  t = (i + j) * 0.25;
  const x0 = x - (i - t),
    y0 = y - (j - t);
  const i1 = x0 > y0 ? 1 : 0,
    j1 = 1 - i1;
  let n = 0;
  t = 0.5 - x0 * x0 - y0 * y0;
  if (t >= 0) {
    t *= t;
    n += t * t * grad2(s, i, j, x0, y0);
  }
  const x1 = x0 - i1 + 0.25,
    y1 = y0 - j1 + 0.25;
  t = 0.5 - x1 * x1 - y1 * y1;
  if (t >= 0) {
    t *= t;
    n += t * t * grad2(s, (i + i1) | 0, (j + j1) | 0, x1, y1);
  }
  const x2 = x0 - 0.5,
    y2 = y0 - 0.5;
  t = 0.5 - x2 * x2 - y2 * y2;
  if (t >= 0) {
    t *= t;
    n += t * t * grad2(s, (i + 1) | 0, (j + 1) | 0, x2, y2);
  }
  return 50 * n;
}

// ---- the older (open) simplex noise
const OG2 = [
  [5, 2],
  [2, 5],
  [-5, 2],
  [-2, 5],
  [5, -2],
  [2, -5],
  [-5, -2],
  [-2, -5],
];
function ext2(s, x, y, dx, dy) {
  const g = OG2[hash2D(s, x, y) & 7];
  return dx * g[0] + dy * g[1];
}
const SQ = 0.366025403784439,
  SQ2 = 0.732050807568878;
function oldSimplex(s, x, y) {
  const so = (x + y) * -0.211324865405187,
    xs = x + so,
    ys = y + so;
  let xsb = floor(xs),
    ysb = floor(ys);
  const sq = (xsb + ysb) * SQ,
    xins = xs - xsb,
    yins = ys - ysb,
    inSum = xins + yins;
  let dx0 = x - (xsb + sq),
    dy0 = y - (ysb + sq),
    v = 0;
  const dx1 = dx0 - 1 - SQ,
    dy1 = dy0 - SQ;
  let a = 2 - dx1 * dx1 - dy1 * dy1;
  if (a > 0) {
    a *= a;
    v += a * a * ext2(s, xsb + 1, ysb, dx1, dy1);
  }
  const dx2 = dx0 - SQ,
    dy2 = dy0 - 1 - SQ;
  a = 2 - dx2 * dx2 - dy2 * dy2;
  if (a > 0) {
    a *= a;
    v += a * a * ext2(s, xsb, ysb + 1, dx2, dy2);
  }
  let dxe, dye, xe, ye;
  if (inSum <= 1) {
    const zins = 1 - inSum;
    if (!(zins > xins) && !(zins > yins)) {
      xe = xsb + 1;
      ye = ysb + 1;
      dxe = dx0 - 1 - SQ2;
      dye = dy0 - 1 - SQ2;
    } else if (xins > yins) {
      xe = xsb + 1;
      ye = ysb - 1;
      dxe = dx0 - 1;
      dye = dy0 + 1;
    } else {
      xe = xsb - 1;
      ye = ysb + 1;
      dxe = dx0 + 1;
      dye = dy0 - 1;
    }
  } else {
    const zins = 2 - inSum;
    if (!(zins < xins) && !(zins < yins)) {
      dxe = dx0;
      dye = dy0;
      xe = xsb;
      ye = ysb;
    } else if (xins > yins) {
      xe = xsb + 2;
      ye = ysb;
      dxe = dx0 - 2 - SQ2;
      dye = dy0 - SQ2;
    } else {
      xe = xsb;
      ye = ysb + 2;
      dxe = dx0 - SQ2;
      dye = dy0 - 2 - SQ2;
    }
    xsb++;
    ysb++;
    dx0 = dx0 - 1 - SQ2;
    dy0 = dy0 - 1 - SQ2;
  }
  a = 2 - dx0 * dx0 - dy0 * dy0;
  if (a > 0) {
    a *= a;
    v += a * a * ext2(s, xsb, ysb, dx0, dy0);
  }
  a = 2 - dxe * dxe - dye * dye;
  if (a > 0) {
    a *= a;
    v += a * a * ext2(s, xe | 0, ye | 0, dxe, dye);
  }
  return v / 47;
}

// ---- cell noise: one point per cell (square grid or hexagons), placed by a hash of the cell
function mix(h) {
  h = imul(h ^ (h >>> 16), 0x85ebca6b);
  h = imul(h ^ (h >>> 13), 0xc2b2ae35);
  return h ^ (h >>> 16);
}
const cellHash = (s, x, y) => mix(s ^ imul(x, 0x27d4eb2d) ^ imul(y, 0x165667b1));
const rand = (h, salt) => (mix(h ^ salt) >>> 0) / 4294967295;
const HEX_S = (Math.sqrt(3) + 1.5) / 2,
  HX = Math.sqrt(3);
const DIST = {
  EUCLIDEAN: (dx, dy) => dx * dx + dy * dy,
  MANHATTAN: (dx, dy) => Math.abs(dx) + Math.abs(dy),
  NATURAL: (dx, dy) => Math.abs(dx) + Math.abs(dy) + dx * dx + dy * dy,
  MAX: (dx, dy) => Math.max(Math.abs(dx), Math.abs(dy)),
};
// the nearest and second nearest point to (x, y): { d, d2, px, py, ix, iy }
function cells(o, s, x, y, two) {
  const hex = o.hex,
    r = { d: Infinity, d2: Infinity, px: 0, py: 0, ix: 0, iy: 0 };
  if (hex) {
    x *= HEX_S;
    y *= HEX_S;
  }
  const cx = hex ? Math.round((HX / 3) * x - y / 3) : floor(x),
    cy = hex ? Math.round((2 / 3) * y) : floor(y),
    reach = hex && two ? 2 : 1;
  for (let j = -reach; j <= reach; j++)
    for (let i = -reach; i <= reach; i++) {
      if (hex && Math.abs(i) === 2 && Math.abs(j) === 2) continue;
      if (hex && !two && (Math.abs(i) > 1 || Math.abs(j) > 1)) continue;
      const gx = (cx + i) | 0,
        gy = (cy + j) | 0,
        h = cellHash(s, gx, gy);
      if (o.density && !(o.density[0] <= rand(h, 0x5bd1e995) && rand(h, 0x5bd1e995) <= o.density[1])) continue;
      let px = hex ? gx + (rand(h, 1) - 0.5) * o.jitter : gx + rand(h, 1) * o.jitter,
        py = hex ? gy + (rand(h, 2) - 0.5) * o.jitter : gy + rand(h, 2) * o.jitter;
      if (hex) {
        const hx = HX * px + (HX / 2) * py;
        py = 1.5 * py;
        px = hx;
      }
      let d = o.dist(px - x, py - y);
      if (o.range) d *= o.range[0] + (o.range[1] - o.range[0]) * rand(h, 0x1f3d5b79);
      if (d < r.d) {
        r.d2 = r.d;
        r.d = d;
        r.px = px;
        r.py = py;
        r.ix = gx;
        r.iy = gy;
      } else if (d < r.d2) r.d2 = d;
    }
  if (hex) {
    r.d /= 3;
    r.d2 /= 3;
    r.px /= HEX_S;
    r.py /= HEX_S;
  }
  return r;
}

// ---- noise trees: each node of the game's json as a function (seed, x, z) -> 0..1, or null for a kind not rebuilt here
const range = v => (Array.isArray(v) ? (v.length === 1 ? [v[0], v[0]] : [v[0], v[1]]) : typeof v === 'number' ? [v, v] : null);
// a density (the share of cells that hold a point): a number means 0 up to it, a pair is a range
export const densityRange = v =>
  typeof v === 'number'
    ? [0, v]
    : Array.isArray(v)
      ? Array.isArray(v[0])
        ? [v[0][0], v[0][1]]
        : v.length === 1
          ? [0, v[0]]
          : [v[0], v[1]]
      : null;
const FORMULA = {
  NORMAL: v => v,
  INVERTED: v => 1 - v,
  SQUARED: v => v * v,
  INVERTED_SQUARED: v => 1 - v * v,
  SQRT: v => Math.sqrt(v),
  INVERTED_SQRT: v => 1 - Math.sqrt(v),
  RIDGED: v => Math.abs(v - 0.5),
  INVERTED_RIDGED: v => 1 - Math.abs(v - 0.5),
  RIDGED_SQRT: v => Math.sqrt(Math.abs(v - 0.5)),
  INVERTED_RIDGED_SQRT: v => 1 - Math.sqrt(Math.abs(v - 0.5)),
  RIDGED_FIX: v => Math.abs(v * 2 - 1),
  INVERTED_RIDGED_FIX: v => 1 - Math.abs(v * 2 - 1),
  RIDGED_SQRT_FIX: v => Math.sqrt(Math.abs(v * 2 - 1)),
  INVERTED_RIDGED_SQRT_FIX: v => 1 - Math.sqrt(Math.abs(v * 2 - 1)),
  RIDGED_SQUARED_FIX: v => Math.abs(v * 2 - 1) ** 2,
  INVERTED_RIDGED_SQUARED_FIX: v => 1 - Math.abs(v * 2 - 1) ** 2,
};
const D2 = { ADD: (a, b) => a + b, SUB: (a, b) => b - a, MUL: (a, b) => a * b, DIV: (a, b) => a / b, MIN: a => a, MAX: (a, b) => b };

export function makeNoise(files, lenient = false) {
  // files: path -> parsed json, holding every file the trees refer to. lenient: a part of a MIN, MAX, SUM or MULTIPLY that is not
  // rebuilt here (the monument grids masks use) is left out instead of losing the whole tree
  const deref = n => {
    while (n && typeof n === 'object' && !Array.isArray(n) && typeof n.File === 'string') {
      const f = files[refPath(n.File)];
      if (!f) throw new Error('missing ' + refPath(n.File));
      n = f;
    }
    return n;
  };
  // a base noise function (s: its seed, x, y) -> -1..1
  function fn(n, key) {
    const t = n.NoiseType;
    if (t === 'SIMPLEX') return simplex;
    if (t === 'OLD_SIMPLEX') return oldSimplex;
    if (t === 'CELL' || t === 'DISTANCE') {
      const o = {
        hex: n.CellType === 'HEX',
        jitter: n.Jitter ?? 1,
        dist: DIST[n.DistanceMode || 'EUCLIDEAN'],
        density: n.Density != null ? densityRange(n.Density) : null,
        range: n.DistanceRange != null ? range(n.DistanceRange) : null,
      };
      if (!o.dist) return null;
      if (t === 'DISTANCE') {
        const f2 = D2[n.Distance2Mode || 'SUB'];
        if (!f2) return null;
        return (s, x, y) => {
          const r = cells(o, s, x, y, true);
          return limit(f2(Math.sqrt(r.d), Math.sqrt(r.d2))) * 2 - 1;
        };
      }
      const mode = n.CellMode || 'CELL_VALUE';
      if (mode === 'DISTANCE') return (s, x, y) => limit(Math.sqrt(cells(o, s, x, y, false).d)) * 2 - 1;
      if (mode === 'CELL_VALUE')
        return (s, x, y) => {
          const r = cells(o, s, x, y, false);
          return rand(cellHash(s, r.ix, r.iy), 0x68e31da4) * 2 - 1;
        };
      if (mode === 'NOISE_LOOKUP') {
        const look = prop(n.NoiseLookup, key + '.L');
        if (!look) return null;
        return (s, x, y, w) => {
          const r = cells(o, s, x, y, false);
          return limit(look(w, r.px, r.py)) * 2 - 1;
        };
      }
      return null;
    }
    return null;
  }
  // a noise property: (world seed, x, y) -> 0..1
  function prop(n, key) {
    n = deref(n);
    if (!n || typeof n !== 'object') return null;
    const kids = (list, k) => (Array.isArray(list) ? list.map((c, i) => prop(c, k + '-#' + i)) : []);
    let p = null;
    const T = n.Type;
    if (T) {
      if (T === 'MIN' || T === 'MAX' || T === 'MULTIPLY' || T === 'SUM') {
        let ks = kids(n.Noise, key);
        if (lenient) ks = ks.filter(Boolean);
        if (!ks.length || ks.some(k => !k)) return null;
        if (T === 'MIN')
          p = (w, x, y) => {
            let v = ks[0](w, x, y);
            for (let i = 1; i < ks.length && v >= 1e-5; i++) v = Math.min(v, ks[i](w, x, y));
            return v < 1e-5 ? 0 : v;
          };
        else if (T === 'MAX')
          p = (w, x, y) => {
            let v = ks[0](w, x, y);
            for (let i = 1; i < ks.length && v <= 0.999999; i++) v = Math.max(v, ks[i](w, x, y));
            return v > 0.999999 ? 1 : v;
          };
        else if (T === 'MULTIPLY')
          p = (w, x, y) => {
            let v = ks[0](w, x, y);
            for (let i = 1; i < ks.length; i++) v *= ks[i](w, x, y);
            return v;
          };
        else {
          const f = Array.isArray(n.Factors) ? n.Factors : ks.map(() => 1 / ks.length);
          p = (w, x, y) => {
            let v = 0;
            for (let i = 0; i < ks.length; i++) v += ks[i](w, x, y) * f[i];
            return limit(v);
          };
        }
      } else if (T === 'DISTORTED') {
        const inner = prop(n.Noise, key),
          rz = deref(n.Randomizer),
          gens = (axis, list) =>
            (list || []).map((g, i) => {
              const q = prop({ ...deref(g), Seed: (deref(g).Seed ?? key) + axis + i }, key + axis + i);
              return q ? [q, deref(g).Amplitude || 0] : null;
            });
        const gx = gens('.X-Noise#', rz?.Generators),
          gy = gens('.Y-Noise#', rz?.Generators);
        if (!inner || gx.some(g => !g) || gy.some(g => !g)) return null;
        p = (w, x, y) => {
          let ox = 0,
            oy = 0;
          for (const [q, a] of gx) ox += (q(w, x, y) * 2 - 1) * a;
          for (const [q, a] of gy) oy += (q(w, x, y) * 2 - 1) * a;
          return inner(w, x + ox, y + oy);
        };
      } else if (T === 'INVERT') {
        const inner = prop(n.Noise, key);
        if (!inner) return null;
        p = (w, x, y) => 1 - inner(w, x, y);
      } else if (T === 'NORMALIZE' || T === 'SCALE' || T === 'FORMULA' || T === 'OFFSET') {
        p = prop(n.Noise, key);
        if (!p) return null;
      } else return null;
    } else {
      const f = fn(n, key);
      if (!f) return null;
      const seed = strHash(typeof n.Seed === 'string' ? n.Seed : key);
      if (n.Octaves != null) {
        const oct = n.Octaves,
          lac = n.Lacunarity ?? 2,
          per = n.Persistence ?? 0.5;
        if (n.FractalMode === 'OLDSCHOOL')
          p = (w, x, y) => {
            let max = 0,
              amp = 1,
              fq = 1,
              sum = 0,
              o = (w + seed) | 0;
            for (let i = 0; i < oct; i++) {
              sum += f(o++, x * fq, y * fq, w) * amp;
              max += amp;
              amp *= per;
              fq *= 2;
            }
            return (sum / max) * 0.5 + 0.5;
          };
        else if (!n.FractalMode || n.FractalMode === 'FBM')
          p = (w, x, y) => {
            let o = (w + seed) | 0,
              sum = f(o, x, y, w),
              amp = 1;
            for (let i = 1; i < oct; i++) {
              x *= lac;
              y *= lac;
              amp *= per;
              sum += f(++o, x, y, w) * amp;
            }
            return limit(sum * 0.5 + 0.5);
          };
        else return null;
      } else p = (w, x, y) => limit(f((w + seed) | 0, x, y, w) * 0.5 + 0.5);
    }
    // the wrappers every node may carry, in the game's order
    if (T === 'FORMULA' || (T !== 'FORMULA' && n.Formula)) {
      const fm = FORMULA[n.Formula];
      if (!fm) return null;
      const q = p;
      p = (w, x, y) => fm(q(w, x, y));
    }
    if (n.Curve) return null;
    if (n.Scale != null) {
      const sc = n.Scale,
        q = p;
      p = (w, x, y) => q(w, x * sc, y * sc);
    }
    const nr = T === 'NORMALIZE' ? n.Range : n.Normalize;
    if (nr != null) {
      const r = range(nr);
      if (!r) return null;
      const mn = r[0],
        span = r[1] - r[0],
        q = p;
      p = (w, x, y) => limit((q(w, x, y) - mn) / span);
    }
    const off = n.Offset ?? 0;
    if (n.Offset != null || n.OffsetX != null || n.OffsetZ != null || n.OffsetY != null) {
      const ox = n.OffsetX ?? off,
        oy = n.OffsetY ?? off,
        q = p;
      p = (w, x, y) => q(w, x + ox, y + oy);
    }
    if (n.Pitch != null || n.Yaw != null || n.Gradient) return null;
    return p;
  }
  return { prop, deref };
}

// ---- height thresholds: at a column, how solid each height is (1 = always, 0 = never); the ground is solid where the
// threshold is above the column's height noise
function thresholds(node, noise, key) {
  node = noise.deref(node);
  if (node.Thresholds) {
    const ctx = noise.prop(node.Noise, key + '.ctx'),
      keys = node.Keys,
      subs = node.Thresholds.map((t, i) => thresholds(t, noise, key + '-' + i));
    if (!ctx || subs.some(s => !s)) return null;
    return {
      lo: Math.min(...subs.map(s => s.lo)),
      hi: Math.max(...subs.map(s => s.hi)),
      context: (w, x, z) => ctx(w, x, z),
      at(y, c) {
        if (y > this.hi) return 0;
        for (let i = 0; i < keys.length; i++)
          if (c <= keys[i]) {
            if (i === 0) return subs[0].at(y, 0);
            const t = (c - keys[i - 1]) / (keys[i] - keys[i - 1]);
            const a = subs[i - 1].at(y, 0);
            return a + (subs[i].at(y, 0) - a) * t;
          }
        return subs[subs.length - 1].at(y, 0);
      },
    };
  }
  const pos = node.Positions,
    val = node.Values,
    N = 320,
    arr = new Float32Array(N);
  for (let y = 0; y < N; y++) {
    let t = val[val.length - 1];
    for (let i = 0; i < pos.length; i++)
      if (y < pos[i]) {
        t = i === 0 ? val[0] : val[i - 1] + (val[i] - val[i - 1]) * ((y - pos[i - 1]) / (pos[i] - pos[i - 1]));
        break;
      }
    arr[y] = t;
  }
  let lo = 0;
  while (lo < N && !(arr[lo] < 1)) lo++;
  let hi = N - 1;
  while (hi >= 0 && !(arr[hi] > 0)) hi--;
  return { lo, hi, context: () => 0, at: y => (y > hi ? 0 : arr[y < 0 ? 0 : y >= N ? N - 1 : y]) };
}

// ---- one biome tile: height, water and surface blocks at any column (x, z in blocks)
export function makeTerrain(tile, files, { seed = 0 } = {}) {
  const noise = makeNoise(files),
    loose_ = makeNoise(files, true),
    tkey = 'tile';
  const height = noise.prop(tile.HeightmapNoise, tkey + '.HeightmapNoise');
  const th = thresholds(tile.TerrainHeightThreshold, noise, tkey + '.TerrainHeightThreshold');
  if (!height || !th) throw new Error('terrain noise not rebuilt');
  const W = seed;
  // the top of the ground: the highest height whose threshold is above the noise (or 1), scanning down as the game does
  const top = (x, z) => {
    const n = height(W, x, z),
      c = th.context(W, x, z);
    for (let y = th.hi; y >= th.lo; y--) {
      const t = th.at(y, c);
      if (t > n || t === 1) return y;
    }
    return th.lo - 1;
  };
  // the water: [level, fluid] where the game fills empty cells with water or lava up to a height
  const fluids = (tile.Water?.Entries || [])
    .map((e, i) => {
      const r = range(e.Max),
        mx = e.MaxNoise ? noise.prop(e.MaxNoise, tkey + '.Water' + i) : null,
        mask = e.NoiseMask ? noise.prop(e.NoiseMask, tkey + '.WaterMask' + i) : null;
      if (!r || (e.MaxNoise && !mx)) return null;
      const th2 = e.NoiseMask?.Threshold ? range(e.NoiseMask.Threshold) : null,
        rn = range(e.Min),
        mn = e.MinNoise ? noise.prop(e.MinNoise, tkey + '.WaterMin' + i) : null,
        level = (x, z) => (mx ? r[0] + (r[1] - r[0]) * mx(W, x, z) : r[0]),
        // the bottom: a fluid or block fills from here up; where it would start above its top there is none (the glacier's edge)
        floor = rn && (!e.MinNoise || mn) ? (x, z) => (mn ? rn[0] + (rn[1] - rn[0]) * mn(W, x, z) : rn[0]) : () => -Infinity,
        masked = mask && th2 ? (x, z) => inRange(mask(W, x, z), th2) : () => true;
      return {
        kind: e.Fluid === 'Lava_Source' ? 'lava' : e.Fluid ? 'water' : 'block',
        block: e.Block || null,
        level,
        ok: (x, z) => masked(x, z) && floor(x, z) <= level(x, z),
      };
    })
    .filter(Boolean);
  // the surface layers: the top block (the first entry whose mask lets it in) and the blocks under it, then the filling rock
  const L = tile.Layers || {},
    dyn = (L.Dynamic || []).map((g, gi) => {
      g = noise.deref(g);
      const entries = (g.Entries || [g]).map((e, ei) => {
        e = noise.deref(e);
        const m = e.NoiseMask ? mask(loose_, e.NoiseMask, tkey + '.L' + gi + '.' + ei) : () => true;
        const blocks = [].concat(e.Blocks || []).map((b, bi) => {
          if (typeof b === 'string') return { type: b.split(':')[0], reps: () => 1 };
          const r = range(b.Repeat) || [1, 1],
            rn = b.RepeatNoise ? noise.prop(b.RepeatNoise, tkey + '.R' + gi + '.' + bi) : null;
          return {
            type: (b.Type || '').split(':')[0],
            reps: (x, z) => (r[0] === r[1] || !rn ? r[0] : Math.min(r[1], Math.floor(r[0] + (r[1] - r[0] + 1) * rn(W, x, z)))),
          };
        });
        return { ok: m || (() => false), plain: !e.NoiseMask, blocks };
      });
      return entries;
    });
  const fill = typeof L.Default === 'string' ? L.Default : 'Rock_Stone';
  // the column's blocks from the top down: [[name, count], ...] (the filling rock below them goes on for ever)
  // far: the plain entry of each layer (the one with no mask) without working out the masks, for land deep in the haze
  const layers = (x, z, far) => {
    const out = [];
    for (const entries of dyn) {
      const e = (far && entries.find(en => en.plain)) || entries.find(en => en.ok(x, z));
      if (!e) continue;
      for (const b of e.blocks) {
        const k = b.reps(x, z);
        if (k > 0 && b.type) out.push([b.type, k]);
      }
    }
    return out;
  };
  const blockNames = new Set([fill]);
  for (const entries of dyn) for (const e of entries) for (const b of e.blocks) if (b.type) blockNames.add(b.type);
  for (const f of fluids) if (f.block) blockNames.add(f.block);
  return { top, fluids, layers, fill, blockNames: [...blockNames], lo: th.lo, hi: th.hi };
}
const inRange = (v, r) => r[0] <= v && v <= r[1];
// a noise mask: a noise and the range (Threshold) it must fall in; a kind not rebuilt here never lets anything in
function mask(noise, m, key) {
  m = noise.deref(m);
  const p = noise.prop(m, key),
    r = m.Threshold != null ? range(m.Threshold) : [0.5, 1];
  if (!p || !r) return null;
  return (x, z) => inRange(p(0, x, z), r);
}

// every file a tile refers to (for the list of game files the site copies), from its parsed json
export function refsOf(node, out = new Set()) {
  if (Array.isArray(node)) node.forEach(n => refsOf(n, out));
  else if (node && typeof node === 'object')
    for (const [k, v] of Object.entries(node)) {
      if (k === 'File' && typeof v === 'string') out.add(refPath(v));
      else refsOf(v, out);
    }
  return out;
}

// ---- tree patterns: a jittered grid of points (cells of 1/Scale blocks; a cell holds a point when its own random number falls in the
// pattern's Density, so patterns sharing a Seed share the points and split them between them), kept where the mask, the height and
// the ground block allow. Returns the points in a box as [x, z, r] (r: the point's own random number, for picking a prefab).
export function makePattern(pat, files, terrain) {
  const noise = makeNoise(files, true),
    g = pat.GridGenerator,
    sc = g.Scale || 0.1,
    jit = g.Jitter ?? 1,
    den = densityRange(g.Density ?? 1) || [0, 1],
    seed = strHash(typeof g.Seed === 'string' ? g.Seed : JSON.stringify(g)),
    m = pat.NoiseMask ? mask(noise, pat.NoiseMask, 'pattern') : null,
    ht = pat.HeightThreshold && pat.HeightThreshold.Positions ? pat.HeightThreshold : null,
    parents = Array.isArray(pat.Parent) ? new Set(pat.Parent.map(b => String(b).split(':')[0])) : null;
  const heightOk = (y, r) => {
    if (!ht) return true;
    const P = ht.Positions,
      V = ht.Values;
    let v = V[V.length - 1];
    for (let i = 0; i < P.length; i++)
      if (y < P[i]) {
        v = i === 0 ? V[0] : V[i - 1] + (V[i] - V[i - 1]) * ((y - P[i - 1]) / (P[i] - P[i - 1]));
        break;
      }
    return r < v;
  };
  return {
    points(x0, z0, x1, z1, keep) {
      const out = [];
      for (let gy = Math.floor(z0 * sc) - 1; gy <= Math.ceil(z1 * sc); gy++)
        for (let gx = Math.floor(x0 * sc) - 1; gx <= Math.ceil(x1 * sc); gx++) {
          const h = cellHash(seed, gx, gy),
            d = rand(h, 0x5bd1e995);
          if (d < den[0] || d > den[1]) continue;
          const x = Math.round((gx + rand(h, 1) * jit) / sc),
            z = Math.round((gy + rand(h, 2) * jit) / sc);
          if (x < x0 || x > x1 || z < z0 || z > z1 || (keep && !keep(x, z))) continue;
          if (m && !m(x, z)) continue;
          const top = terrain.top(x, z);
          if (!heightOk(top, rand(h, 0x2545f491))) continue;
          if (parents) {
            const l = terrain.layers(x, z);
            if (l.length && !parents.has(l[0][0])) continue;
          }
          out.push([x, z, rand(h, 0x7feb352d)]);
        }
      return out;
    },
  };
}

// ---- where a background's level clearing goes in a tile: a dry spot whose land round it lies close to one level, so the clearing
// joins it with the least change. Returns { ox, oz, S0 (the clearing's surface, in the game's heights), rim (the block most of the
// land just outside the clearing has on top: the clearing's own ground), cost }.
// prefer: a block the clearing should stand on when the tile has it (the glacier's ice)
export function findSite(T, { FIX = 45, ground, prefer } = {}) {
  const NONE = -32768,
    fluidAt = (x, z, top) => {
      let lvl = NONE,
        kind = 0;
      for (const f of T.fluids) {
        if (!f.ok(x, z)) continue;
        const l = Math.floor(f.level(x, z));
        if (l >= top && l + 1 > lvl) {
          lvl = l + 1;
          kind = f.kind === 'block' ? 3 : 1;
        }
      }
      return [lvl, kind];
    },
    groundAt = (x, z) => {
      const top = T.top(x, z),
        [wl, wk] = fluidAt(x, z, top);
      return wk === 3 ? [wl - 1, NONE, T.fluids.find(f => f.kind === 'block')?.block] : [top, wl, null];
    },
    ring = (r, n) => Array.from({ length: n }, (_, i) => [Math.cos((i / n) * Math.PI * 2) * r, Math.sin((i / n) * Math.PI * 2) * r]),
    inner = [[0, 0], ...ring(15, 8), ...ring(30, 12), ...ring(42, 16)],
    outer = [...ring(55, 20), ...ring(70, 24), ...ring(90, 28)];
  let best = null;
  for (let k = 0; k < 400; k++) {
    // a spiral of candidate spots, the first at the tile's origin
    const a = k * 2.399963,
      r = k ? 60 * Math.sqrt(k) : 0,
      ox = Math.round(Math.cos(a) * r),
      oz = Math.round(Math.sin(a) * r),
      hs = [];
    let cost = 0;
    for (const [x, z] of inner) {
      const [t, w, b] = groundAt(ox + x, oz + z);
      hs.push(t);
      if (w !== NONE) cost += 200;
      if (prefer && b !== prefer) cost += 40;
    }
    const H = [...hs].sort((p, q) => p - q)[hs.length >> 1];
    for (const t of hs) cost += Math.abs(t - H) * 3;
    for (const [x, z] of outer) {
      const [t, w] = groundAt(ox + x, oz + z);
      cost += Math.min(12, Math.abs(t - H)) * (Math.hypot(x, z) < 75 ? 1 : 0.4);
      if (w !== NONE && w > H + 1) cost += 30; // the water would stand above the clearing
    }
    if (!best || cost < best.cost) best = { cost, ox, oz, H };
    if (best.cost < 20 && k > 40) break;
  }
  // the rim block: what most dry columns just outside the clearing have on top
  const count = new Map();
  for (const [x, z] of [...ring(FIX + 2, 40), ...ring(FIX + 8, 48), ...ring(FIX + 14, 56)]) {
    const X = best.ox + Math.round(x),
      Z = best.oz + Math.round(z),
      top = T.top(X, Z),
      [, wk] = fluidAt(X, Z, top);
    if (wk === 1) continue;
    const L = wk === 3 ? [] : T.layers(X, Z),
      b = wk === 3 ? T.fluids.find(f => f.kind === 'block')?.block : L.find(l => l[0] !== 'Empty')?.[0] || ground;
    if (b) count.set(b, (count.get(b) || 0) + 1);
  }
  const rim = [...count].sort((a, b) => b[1] - a[1])[0]?.[0] || ground;
  return { ox: best.ox, oz: best.oz, S0: best.H + 1, rim, cost: best.cost };
}
