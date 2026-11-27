// Works out a background's land away from the page, so a change of place never stalls the stage: from the biome tile, the height,
// surface blocks and water of the land round the character's level clearing in rings that get coarser further out, the land's faces
// ready to draw (one set of arrays per block face), and where the tile's trees stand. The last few places are kept, so going back
// to one is instant.
import { loose, makeTerrain, makePattern, findSite, makeCovers } from './worldgen.js';
import { BLOCKS } from './scene-data.js';

const NONE = -32768,
  BLOCK = 64,
  SKIRT = 12, // a ring's outer columns hang this many blocks of side down, so no crack shows where it meets the next ring
  LIFT = 0.004, // the land's tops sit a hair above the sliding clearing's, so the two never flicker where they overlap
  KEEP = 6; // places kept
const smooth = t => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const kept = new Map();

self.onmessage = e => {
  const { id, key } = e.data;
  try {
    // plain patches are kept by the page, so only the land is kept here
    const keep = key && e.data.type !== 'plain';
    let out = keep && kept.get(key);
    if (out) {
      kept.delete(key);
      kept.set(key, out);
    } else {
      out = e.data.type === 'plain' ? plainPatch(e.data) : build(e.data);
      if (keep) {
        kept.set(key, out);
        while (kept.size > KEEP) kept.delete(kept.keys().next().value);
      }
    }
    self.postMessage({ ...out, id }); // a copy: the kept one stays here
  } catch (err) {
    self.postMessage({ id, error: String(err?.message || err) });
  }
};

// faces gathered per material: 'Name|top|variant', 'Name|side', 'water', 'lava'
class Faces {
  constructor() {
    this.m = new Map();
  }
  quad(k, a, b, c, d, n, us, vs, cell) {
    let q = this.m.get(k);
    if (!q) this.m.set(k, (q = { pos: [], uv: [], nor: [], cell: [] }));
    q.pos.push(...a, ...b, ...c, ...a, ...c, ...d);
    q.uv.push(0, 0, us, 0, us, vs, 0, 0, us, vs, 0, vs);
    for (let i = 0; i < 6; i++) q.nor.push(n[0] * 127, n[1] * 127, n[2] * 127), q.cell.push(cell[0], cell[1]);
  }
  out() {
    const o = {};
    for (const [k, q] of this.m)
      o[k] = { pos: new Float32Array(q.pos), uv: new Float32Array(q.uv), nor: new Int8Array(q.nor), cell: new Float32Array(q.cell) };
    return o;
  }
}
const tops = n => {
  const c = BLOCKS[n]?.cube;
  return !c ? 0 : Array.isArray(c.top) ? c.top.length : 1;
};

// a tile's parsed files and terrain, kept for the few places in use (the plain patch and the land both need them)
const parsed = new Map();
// passing: a look-in for the page's background work, which must not push out the places in use
function terrainOf(tile, texts, passing) {
  let p = parsed.get(tile);
  if (!p) {
    const files = {};
    for (const [k, t] of Object.entries(texts)) files[k] = loose(t);
    const tileJ = loose(tile);
    p = { files, tileJ, T: makeTerrain(tileJ, files), covers: makeCovers(tileJ, files, { known: n => !!BLOCKS[n] }) };
    if (passing) return p;
    parsed.set(tile, p);
    while (parsed.size > KEEP) parsed.delete(parsed.keys().next().value);
  }
  return p;
}
// the top block a column shows: the first of its layers that is a cube block
const topOf = (L, fallback) => L.find(l => l[0] !== 'Empty' && tops(l[0]))?.[0] || fallback;

// the plain: its 128 x 128 repeating patch laid round the spot, each column with the game's own top block and the plant (cover) on it
function plainPatch({ tile, files: texts, opt, warm }) {
  const { T, covers } = terrainOf(tile, texts, warm),
    { ox, oz, S0, rim } = opt.site,
    ground = tops(rim) ? rim : opt.ground,
    P = 128,
    sym = v => (v >= P / 2 ? v - P : v),
    names = [ground],
    idx = new Map([[ground, 0]]),
    id = n => (idx.has(n) ? idx.get(n) : (idx.set(n, names.length), names.push(n), names.length - 1)),
    G = new Uint8Array(P * P),
    C = new Uint8Array(P * P);
  for (let pz = 0; pz < P; pz++)
    for (let px = 0; px < P; px++) {
      const x = ox + sym(px),
        z = oz + sym(pz),
        top = topOf(T.layers(x, z), ground),
        c = covers(x, z, S0, top);
      G[pz * P + px] = id(top);
      if (c) C[pz * P + px] = id(c) + 1;
    }
  return { names, ground: G, covers: C };
}

function build({ tile, files: texts, patterns, opt }) {
  const t0 = performance.now();
  const { files, T, covers } = terrainOf(tile, texts);
  const { FIX, BL, levels, treeR, ground, under, fallback, strip, period } = opt;
  // the strip's land repeats along the lane every period blocks (its end portals loop it): z folded into one period, and the
  // last stretch before its end eased into the land at its start, so the two meet without a seam
  const PER = period || 0,
    fold = z => (PER ? ((((z + PER / 2) % PER) + PER) % PER) - PER / 2 : z),
    SEAM = 24;
  // how far a column is from the level ground: from the clearing's middle, or (the strip) from the lane's middle line
  const away = (lx, lz) => (strip ? Math.abs(lx) : Math.hypot(lx, lz));
  const fluidAt = (x, z, top) => {
    let lvl = NONE,
      kind = 0,
      block = null;
    for (const f of T.fluids) {
      if (!f.ok(x, z)) continue;
      const l = Math.floor(f.level(x, z));
      if (l >= top && l + 1 > lvl) {
        lvl = l + 1;
        kind = f.kind === 'lava' ? 2 : f.kind === 'block' ? 3 : 1;
        block = f.block;
      }
    }
    return [lvl, kind, block];
  };
  const site = opt.site || findSite(T, { FIX, ground }),
    { ox, oz, S0 } = site;
  const names = [],
    idx = new Map(),
    nameId = n => (idx.has(n) ? idx.get(n) : (idx.set(n, names.length), names.push(n), names.length - 1));
  nameId(tops(site.rim) ? site.rim : ground);
  nameId(under);
  nameId(T.fill);
  // one column of land, in the clearing's terms (heights from its surface), eased into the clearing's level near it.
  // far: deep in the haze, where each layer's plain block stands in for the patches its masks would make
  const column = (lx, lz, far) => {
    if (!PER) return column0(lx, lz, far);
    const u = fold(lz),
      w = smooth((u - (PER / 2 - SEAM)) / SEAM);
    if (w <= 0) return column0(lx, u, far);
    const a = column0(lx, u, far),
      b = column0(lx, u - PER, far),
      c = (w < 0.5 ? a : b).slice();
    c[0] = Math.round(a[0] * (1 - w) + b[0] * w);
    if (c[4] !== NONE) c[4] = Math.max(c[0], c[4]);
    return c;
  };
  const column0 = (lx, lz, far) => {
    const x = ox + lx,
      z = oz + lz,
      top = T.top(x, z),
      d = away(lx, lz),
      k = smooth((d - FIX) / BL);
    let [wl, wk, wb] = fluidAt(x, z, top);
    let h = top + 1 - S0,
      L = T.layers(x, z, far);
    if (wk === 3) {
      // a solid "water" (glacier ice, cooled magma) is just ground of that block
      h = wl - S0;
      L = [[wb, 1]];
      wl = NONE;
      wk = 0;
    }
    h = Math.round(h * k);
    if (strip && d < FIX) wl = NONE; // the lane stays dry
    const first = L.find(l => l[0] !== 'Empty' && tops(l[0])),
      topB = first ? first[0] : names[0],
      rest = L.filter(l => l !== first && l[0] !== 'Empty' && tops(l[0])),
      underB = rest.length ? rest[0][0] : first && first[1] > 1 ? first[0] : under,
      underN = rest.length
        ? Math.min(
            12,
            rest.reduce((t, l) => t + l[1], 0)
          )
        : 3;
    return [h, nameId(topB), nameId(underB), underN, wl === NONE ? NONE : Math.max(h, wl - S0), wk];
  };
  const grids = [];
  let prevE = 0,
    prevEZ = 0;
  // a ring: [cell size, half its size across, half along (the strip's rings are long bands down the lane; others square). On the
  // strip only one lane length of each is worked out: the land repeats, so the page lays that piece end to end down the band
  const ZL = PER ? levels[levels.length - 1][2] || treeR : 0;
  for (const [s, E, EZ0 = E] of levels) {
    const EZ = PER ? PER / 2 : EZ0;
    const last = E === levels[levels.length - 1][1],
      nx = (2 * E) / s,
      nz = (2 * EZ) / s,
      H = new Int16Array(nx * nz).fill(NONE),
      TOP = new Uint8Array(nx * nz),
      UND = new Uint8Array(nx * nz),
      UN = new Uint8Array(nx * nz),
      WL = new Int16Array(nx * nz).fill(NONE),
      WK = new Uint8Array(nx * nz);
    for (let j = 0; j < nz; j++)
      for (let i = 0; i < nx; i++) {
        const x0 = -E + i * s,
          z0 = -EZ + j * s;
        if (prevE && x0 >= -prevE && x0 + s - 1 <= prevE - 1 && z0 >= -prevEZ && z0 + s - 1 <= prevEZ - 1) continue; // the finer ring has it
        const cx = x0 + (s - 1) / 2,
          cz = z0 + (s - 1) / 2;
        if (!prevE && !strip && Math.hypot(cx, cz) < FIX - 0.5) continue; // the clearing (the strip's lane is land of its own)
        if (last && !PER && Math.hypot(cx, cz) > E + s) continue; // the outermost ring is round: past it is the haze
        const c = column(Math.round(cx), Math.round(cz), s >= 4),
          k = j * nx + i;
        H[k] = c[0];
        TOP[k] = c[1];
        UND[k] = c[2];
        UN[k] = c[3];
        WL[k] = c[4];
        WK[k] = c[5];
      }
    grids.push({ s, E, EZ, nx, nz, H, TOP, UND, UN, WL, WK });
    prevE = E;
    prevEZ = EZ;
  }
  // the faces: a column's top, and its sides where a neighbour is lower (its top block's side, the blocks under it, then rock);
  // every face carries the middle of its column, so a change of place lifts each column whole
  const F = new Faces(),
    FILL = 2;
  for (const L of grids) {
    const { s, E, EZ, nx, nz, H, TOP, UND, UN, WL, WK } = L,
      at = (i, j) => {
        if (PER) j = ((j % nz) + nz) % nz; // the piece repeats along the lane: past one end is its other end
        return i < 0 || j < 0 || i >= nx || j >= nz ? NONE : H[j * nx + i];
      };
    for (let j = 0; j < nz; j++) {
      const z0 = -EZ + j * s - 0.5,
        z1 = z0 + s;
      for (let i = 0; i < nx; ) {
        const k = j * nx + i,
          h = H[k];
        if (h === NONE) {
          i++;
          continue;
        }
        const top = names[TOP[k]],
          v = s === 1 ? ((i * 7 + j * 13) & 0xff) % tops(top) : 0;
        // out past the change-of-place wave (cells of 8) a run of cells at one height, block and water is one quad; nearer, one per cell
        let r = 1;
        while (s >= 8 && i + r < nx && H[k + r] === h && TOP[k + r] === TOP[k] && WL[k + r] === WL[k]) r++;
        const x0 = -E + i * s - 0.5,
          x1 = x0 + r * s,
          y = (h + LIFT) * BLOCK,
          mid = [((x0 + x1) / 2) * BLOCK, ((z0 + z1) / 2) * BLOCK];
        F.quad(
          top + '|top|' + v,
          [x0 * BLOCK, y, z1 * BLOCK],
          [x1 * BLOCK, y, z1 * BLOCK],
          [x1 * BLOCK, y, z0 * BLOCK],
          [x0 * BLOCK, y, z0 * BLOCK],
          [0, 1, 0],
          r * s,
          s,
          mid
        );
        if (WL[k] !== NONE && WL[k] > h) {
          const wy = (WL[k] - 0.15) * BLOCK;
          F.quad(
            WK[k] === 2 ? 'lava' : 'water',
            [x0 * BLOCK, wy, z1 * BLOCK],
            [x1 * BLOCK, wy, z1 * BLOCK],
            [x1 * BLOCK, wy, z0 * BLOCK],
            [x0 * BLOCK, wy, z0 * BLOCK],
            [0, 1, 0],
            r * s,
            s,
            mid
          );
        }
        for (let q = 0; q < r; q++) {
          const ii = i + q,
            kk = k + q,
            cx0 = -E + ii * s - 0.5,
            cx1 = cx0 + s,
            own = r === 1 ? mid : [(cx0 + s / 2) * BLOCK, ((z0 + z1) / 2) * BLOCK];
          for (const [di, dj, a, b, nrm] of [
            [1, 0, [cx1, z1], [cx1, z0], [1, 0, 0]],
            [-1, 0, [cx0, z0], [cx0, z1], [-1, 0, 0]],
            [0, 1, [cx0, z1], [cx1, z1], [0, 0, 1]],
            [0, -1, [cx1, z0], [cx0, z0], [0, 0, -1]],
          ]) {
            let hn = at(ii + di, j + dj);
            if (hn === NONE) hn = s === 1 && ii + di >= 0 && j + dj >= 0 && ii + di < nx && j + dj < nz ? 0 : h - SKIRT; // the clearing, or the next ring
            if (hn >= h) continue;
            for (const [lo0, hi0, blk] of [
              [h - 1, h, TOP[kk]],
              [h - 1 - UN[kk], h - 1, UND[kk]],
              [hn, h - 1 - UN[kk], FILL],
            ]) {
              const lo = Math.max(lo0, hn),
                hi = Math.min(hi0, h);
              if (hi <= lo) continue;
              F.quad(
                names[blk] + '|side',
                [a[0] * BLOCK, lo * BLOCK, a[1] * BLOCK],
                [b[0] * BLOCK, lo * BLOCK, b[1] * BLOCK],
                [b[0] * BLOCK, hi * BLOCK, b[1] * BLOCK],
                [a[0] * BLOCK, hi * BLOCK, a[1] * BLOCK],
                nrm,
                s,
                hi - lo,
                own
              );
            }
          }
        }
        i += r;
      }
    }
  }
  // trees: every pattern's points round the clearing, each a prefab picked by the point's own number, standing on the land
  const trees = [],
    plant = (lx, lz, pick, r) => {
      // on the strip a tree in the first period stands again a period on and back, all along the lane
      const M = PER ? Math.ceil(ZL / PER) : 0;
      for (let m = -M; m <= M; m++) {
        const z = lz + m * PER,
          d = PER ? Math.max(Math.abs(lx), 0) : Math.hypot(lx, z);
        if (d > treeR || Math.abs(z) > (PER ? ZL : Infinity) || away(lx, z) < FIX + pick.reach + 2) continue;
        const c = column(lx, z, d > 192);
        if (c[4] !== NONE) continue; // no trees standing in water
        trees.push(lx, z, c[0], pick.i, Math.floor(((r * 7919) % 1) * 4));
      }
    };
  patterns.forEach(p => {
    const pat = makePattern(typeof p.json === 'string' ? loose(p.json) : p.json, files, T),
      tot = p.prefabs.reduce((t, q) => t + q.w, 0);
    const zr = PER ? PER / 2 : treeR;
    for (const [x, z, r] of pat.points(ox - treeR, oz - zr, ox + treeR, oz + zr)) {
      const lx = x - ox,
        lz = z - oz;
      if (PER && (lz < -PER / 2 || lz >= PER / 2)) continue;
      let u = r * tot,
        pick = p.prefabs[p.prefabs.length - 1];
      for (const q of p.prefabs)
        if ((u -= q.w) <= 0) {
          pick = q;
          break;
        }
      plant(lx, lz, pick, r);
    }
  });
  // a place whose tile grows no trees on its surface keeps the hand-picked ones, spread as thickly as the old ring had them
  if (!trees.length && fallback?.prefabs.length && fallback.count) {
    const cell = 1 / Math.sqrt(fallback.count / 9300);
    for (let gz = PER ? -PER / 2 : -treeR; gz < (PER ? PER / 2 : treeR + 1e-9); gz += cell)
      for (let gx = -treeR; gx <= treeR; gx += cell) {
        const hh = Math.sin(gx * 12.9898 + gz * 78.233) * 43758.5453,
          r = hh - Math.floor(hh),
          lx = Math.round(gx + (r - 0.5) * cell * 0.8),
          lz = Math.round(gz + (((r * 97) % 1) - 0.5) * cell * 0.8),
          pick = fallback.prefabs[Math.floor(((r * 31) % 1) * fallback.prefabs.length)];
        plant(lx, lz, pick, r);
      }
  }
  // the plants on the land near the plain, the game's way (see makeCovers)
  const L0 = grids[0],
    land = [],
    // where the page lays the strip's piece: every lane length out to the band's ends (just the one piece elsewhere)
    K = PER ? Math.ceil((ZL - PER / 2) / PER) : 0,
    copies = Array.from({ length: 2 * K + 1 }, (_, i) => (i - K) * PER);
  for (let j = 0; j < L0.nz; j++)
    for (let i = 0; i < L0.nx; i++) {
      const k = j * L0.nx + i,
        x = -L0.E + i,
        z = -L0.EZ + j,
        d = Math.hypot(x, z);
      if (L0.H[k] === NONE || L0.WL[k] !== NONE || (strip ? Math.abs(x) > opt.coverR : d < FIX || d > opt.coverR)) continue;
      const c = covers(ox + x, oz + fold(z), L0.H[k] + S0, names[L0.TOP[k]]); // (the strip's plants repeat with its land)
      if (c) for (const o of copies) land.push(x, z + o, L0.H[k], nameId(c));
    }
  return {
    ox,
    oz,
    S0,
    rim: names[0],
    names,
    covers: new Int16Array(land),
    faces: F.out(),
    trees: new Float32Array(trees),
    copies: PER ? copies : null,
    ms: performance.now() - t0,
  };
}
