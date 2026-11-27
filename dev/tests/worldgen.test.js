// site/app/worldgen.js: the game's terrain generator rebuilt for the backgrounds (noise maps, height thresholds, water, layers, tree
// patterns), checked with small hand-made tiles so it runs without the game files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loose, makeNoise, makeTerrain, makePattern, makeCovers, densityRange, refsOf, refPath } from '../../site/app/worldgen.js';

const NOISES = {
  simplex: { Seed: 'a', NoiseType: 'SIMPLEX', Octaves: 3, Persistence: 0.4, Scale: 0.02 },
  oldschool: {
    Seed: 'b',
    NoiseType: 'OLD_SIMPLEX',
    FractalMode: 'OLDSCHOOL',
    Octaves: 2,
    Persistence: 0.35,
    Scale: 0.01,
    Formula: 'INVERTED',
  },
  cell: { Seed: 'c', NoiseType: 'CELL', CellMode: 'DISTANCE', Formula: 'INVERTED_SQRT', Scale: 0.004, Jitter: 0.75 },
  hex: { Seed: 'd', NoiseType: 'CELL', CellType: 'HEX', CellMode: 'DISTANCE', Scale: 0.05, Jitter: 0.6 },
  distance: {
    Seed: 'e',
    NoiseType: 'DISTANCE',
    DistanceMode: 'NATURAL',
    Distance2Mode: 'DIV',
    Formula: 'INVERTED',
    Scale: 0.003,
    Jitter: 0.7,
  },
  sum: { Type: 'SUM', Noise: [{ File: 'Zones.Noise.A' }, { Seed: 'f', NoiseType: 'SIMPLEX', Scale: 0.05 }], Factors: [0.9, 0.1] },
  distorted: {
    Type: 'DISTORTED',
    Noise: { Seed: 'g', NoiseType: 'SIMPLEX', Scale: 0.01 },
    Randomizer: { Generators: [{ Seed: 'h', NoiseType: 'OLD_SIMPLEX', Scale: 0.1, Amplitude: 8 }] },
  },
  min: {
    Type: 'MIN',
    Noise: [
      { Seed: 'i', NoiseType: 'SIMPLEX', Scale: 0.02 },
      { Seed: 'j', NoiseType: 'SIMPLEX', Scale: 0.03 },
    ],
  },
};
const FILES = {
  [refPath('Zones.Noise.A')]: { Seed: 'k', NoiseType: 'OLD_SIMPLEX', FractalMode: 'OLDSCHOOL', Octaves: 3, Persistence: 0.3, Scale: 0.01 },
};

test('reads the world generator files, notes and trailing commas and all', () => {
  const j = loose('{\n  // a note\n  "A": [1, 2,], /* more */ "B": "x // not a note",\n}');
  assert.deepEqual(j, { A: [1, 2], B: 'x // not a note' });
});

test('every rebuilt noise stays between 0 and 1, gives the same value twice, and varies over the land', () => {
  const { prop } = makeNoise(FILES);
  for (const [name, n] of Object.entries(NOISES)) {
    const f = prop(n, name);
    assert.ok(f, name + ' is rebuilt');
    let lo = 1,
      hi = 0;
    for (let i = 0; i < 400; i++) {
      const x = (i * 37.3) % 900,
        z = (i * 91.7) % 900,
        v = f(0, x, z);
      assert.ok(v >= 0 && v <= 1, `${name} ${v}`);
      assert.equal(v, f(0, x, z));
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
    assert.ok(hi - lo > 0.05, name + ' varies');
  }
});

test('a kind not rebuilt drops the whole noise, unless lenient where only that part goes', () => {
  const odd = { Type: 'MAX', Noise: [{ Seed: 'a', NoiseType: 'SIMPLEX', Scale: 0.1 }, { NoiseType: 'BRANCH' }] };
  assert.equal(makeNoise({}).prop(odd, 'x'), null);
  assert.ok(makeNoise({}, true).prop(odd, 'x'));
});

test('a single-number normalize is a step, as in game (range 0)', () => {
  const { prop } = makeNoise({});
  const f = prop({ Seed: 'a', NoiseType: 'SIMPLEX', Scale: 0.05, Normalize: [0.5] }, 'x');
  for (let i = 0; i < 100; i++) assert.ok([0, 1].includes(f(0, i * 3.1, i * 7.7)));
});

test('the ground is solid where the threshold is above the noise: its top follows the noise', () => {
  const tile = {
    HeightmapNoise: NOISES.simplex,
    TerrainHeightThreshold: { Positions: [100, 120], Values: [1, 0] },
    Water: { Entries: [{ Fluid: 'Water_Source', Min: 0, Max: 108 }] },
    Layers: {
      Default: 'Rock_Stone',
      Dynamic: [{ Entries: [{ Blocks: ['Soil_Grass'] }] }, { Blocks: [{ Type: 'Soil_Dirt', Repeat: [2, 3] }] }],
    },
  };
  const T = makeTerrain(tile, {}),
    h = makeNoise({}).prop(NOISES.simplex, 'tile.HeightmapNoise');
  for (let i = 0; i < 200; i++) {
    const x = i * 13,
      z = i * 7,
      n = h(0, x, z),
      top = T.top(x, z);
    // threshold(y) = 1 - (y - 100) / 20 is above n for every y below 100 + 20 (1 - n)
    assert.ok(top >= 99 && top <= 120);
    assert.ok(1 - (top - 100) / 20 > n || top === 99, 'solid at the top');
    assert.ok(!(1 - (top + 1 - 100) / 20 > n), 'air above the top');
  }
  assert.equal(T.fluids[0].level(0, 0), 108);
  assert.deepEqual(T.layers(5, 5)[0], ['Soil_Grass', 1]);
  assert.equal(T.layers(5, 5)[1][0], 'Soil_Dirt');
  assert.ok([2, 3].includes(T.layers(5, 5)[1][1]));
  assert.equal(T.fill, 'Rock_Stone');
});

test('a noise-keyed threshold blends between its thresholds by the key noise', () => {
  const tile = {
    HeightmapNoise: { Seed: 'z', NoiseType: 'SIMPLEX', Scale: 0.00001 }, // about 0.5 everywhere
    TerrainHeightThreshold: {
      Noise: { Seed: 'k', NoiseType: 'SIMPLEX', Scale: 0.01 },
      Keys: [0, 1],
      Thresholds: [
        { Positions: [100, 110], Values: [1, 0] },
        { Positions: [130, 140], Values: [1, 0] },
      ],
    },
  };
  const T = makeTerrain(tile, {}),
    tops = Array.from({ length: 300 }, (_, i) => T.top(i * 11, i * 5));
  assert.ok(Math.min(...tops) >= 100 && Math.max(...tops) <= 140);
  assert.ok(Math.max(...tops) - Math.min(...tops) > 8, 'the key noise moves the ground');
});

test('tree patterns sharing a seed split the points by their density ranges', () => {
  const T = { top: () => 120, layers: () => [['Soil_Grass', 1]] };
  const a = makePattern({ GridGenerator: { Seed: 'S', Density: [0, 0.5], Scale: 0.1, Jitter: 0.7 } }, {}, T),
    b = makePattern({ GridGenerator: { Seed: 'S', Density: [0.5, 1], Scale: 0.1, Jitter: 0.7 } }, {}, T);
  const pa = a.points(-200, -200, 200, 200),
    pb = b.points(-200, -200, 200, 200),
    key = p => p[0] + ',' + p[1];
  assert.ok(pa.length > 100 && pb.length > 100);
  const sa = new Set(pa.map(key));
  assert.ok(pb.filter(p => sa.has(key(p))).length < pb.length * 0.05, 'hardly any point is shared');
  // about one point per cell (10 x 10 blocks) between them
  assert.ok(Math.abs(pa.length + pb.length - 1600) < 250, String(pa.length + pb.length));
});

test('a pattern keeps to its ground blocks and heights', () => {
  const T = { top: x => (x < 0 ? 110 : 125), layers: x => [[x < 50 ? 'Soil_Grass' : 'Soil_Sand', 1]] };
  const p = makePattern(
    {
      GridGenerator: { Seed: 'S', Density: 1, Scale: 0.2 },
      HeightThreshold: { Positions: [113, 114], Values: [0, 1] },
      Parent: ['Soil_Grass'],
    },
    {},
    T
  );
  for (const [x] of p.points(-100, -100, 100, 100)) assert.ok(x >= 0 && x < 50, String(x));
});

test('densities: a number is 0 up to it, a pair a range', () => {
  assert.deepEqual(densityRange(0.8), [0, 0.8]);
  assert.deepEqual(densityRange([0.2, 0.6]), [0.2, 0.6]);
  assert.deepEqual(densityRange([0.3]), [0, 0.3]);
});

test('finds every file a part of a tile names', () => {
  const r = refsOf([{ File: 'Zones.Noise.A' }, { Noise: [{ File: 'Zones.Noise.B' }] }]);
  assert.deepEqual([...r].sort(), [refPath('Zones.Noise.A'), refPath('Zones.Noise.B')]);
});

test('covers: each one by its own chance, on its own ground; a later match takes the spot', () => {
  const tile = {
    Covers: [
      { Type: ['Grass'], Density: 0.6, Parent: ['Soil_Grass'] },
      { Type: ['Flower'], Density: 0.1, Parent: ['Soil_Grass'] },
      { Type: ['Cactus'], Density: 1, Parent: ['Soil_Sand'] },
      { Type: ['Reed'], Density: 1, OnWater: true },
      { Type: ['Pebbles'], Density: 1, Offset: -1, Parent: ['Soil_Gravel'] },
      { Type: ['Rubble'], Density: 1, Parent: ['Pebbles'] },
    ],
  };
  const cover = makeCovers(tile, {}),
    count = {};
  for (let i = 0; i < 20000; i++) {
    const c = cover(i % 200, Math.floor(i / 200), 120, 'Soil_Grass');
    count[c] = (count[c] || 0) + 1;
  }
  // grass 0.6 x 0.9 (a flower takes 10% of the spots), flowers 0.1, nothing else on grass
  assert.ok(Math.abs(count.Grass / 20000 - 0.54) < 0.02, String(count.Grass));
  assert.ok(Math.abs(count.Flower / 20000 - 0.1) < 0.015, String(count.Flower));
  assert.equal(count.Cactus, undefined);
  assert.equal(count.Reed, undefined);
  assert.equal(cover(5, 5, 120, 'Soil_Sand'), 'Cactus');
  // pebbles turn the ground into pebbles, so the rubble meant for pebbles grows there
  assert.equal(cover(5, 5, 120, 'Soil_Gravel'), 'Rubble');
});
