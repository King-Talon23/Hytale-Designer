// site/app/anim.js: reading and writing .blockyanim files, and the key edits the Animate tab makes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as A from '../../site/app/anim.js';

const sample = () => ({
  formatVersion: 1,
  duration: 60,
  holdLastKeyframe: true,
  nodeAnimations: {
    Head: {
      position: [],
      orientation: [
        { time: 0, delta: { x: 0, y: 0, z: 0, w: 1 }, interpolationType: 'smooth' },
        { time: 30, delta: { x: 0.2, y: 0.1, z: 0, w: 0.9747 }, interpolationType: 'linear' },
      ],
      shapeStretch: [],
      shapeVisible: [],
      shapeUvOffset: [],
    },
    'L-Arm': {
      position: [{ time: 10, delta: { x: 2, y: 1, z: 0 }, interpolationType: 'smooth' }],
      orientation: [{ time: 10, delta: { x: 0, y: 0.6, z: 0.8, w: 0 }, interpolationType: 'smooth' }],
      shapeStretch: [],
      shapeVisible: [],
      shapeUvOffset: [],
    },
  },
});

test('read then write gives the same file back', () => {
  const src = sample(),
    text = A.write(A.read(src));
  assert.deepEqual(JSON.parse(text), src);
  assert.equal(A.write(A.read(JSON.parse(text))), text);
});

test('a file without formatVersion stays without one; a new one has it', () => {
  const src = sample();
  delete src.formatVersion;
  assert.equal('formatVersion' in JSON.parse(A.write(A.read(src))), false);
  assert.equal(A.blank().formatVersion, 1);
});

test('read drops what the game would not play and keeps keys inside the length', () => {
  const a = A.read({
    duration: 20,
    junk: '<script>',
    nodeAnimations: {
      Head: {
        orientation: [
          { time: 25, delta: { x: 0, y: 0, z: 0, w: 1 } },
          { time: 5, delta: { x: 0, y: 0, z: 0, w: 2 }, interpolationType: 'weird' },
          { time: -1, delta: { x: 0, y: 0, z: 0, w: 1 } },
        ],
        shapeVisible: [{ time: 0, delta: 'yes' }],
        bogus: [{ time: 0, delta: 1 }],
      },
      'Bad\u0001Bone': { position: [{ time: 0, delta: { x: 1, y: 1, z: 1 } }] },
      Empty: { position: [] },
    },
  });
  assert.deepEqual(Object.keys(a.nodeAnimations), ['Head']);
  assert.equal('junk' in a, false);
  const ks = a.nodeAnimations.Head.orientation;
  assert.equal(ks.length, 1);
  assert.equal(ks[0].time, 5);
  assert.equal(ks[0].interpolationType, 'smooth');
  assert.deepEqual(ks[0].delta, { x: 0, y: 0, z: 0, w: 1 });
  assert.deepEqual(a.nodeAnimations.Head.shapeVisible, []);
  assert.throws(() => A.read(null));
  assert.throws(() => A.read([]));
});

test('setKey adds a key in time order, replaces a key on the same frame and clamps the frame', () => {
  const a = A.read(sample());
  A.setKey(a, 'Head', 'orientation', 15, { x: 0, y: 0, z: 0, w: 1 }, 'linear');
  assert.deepEqual(
    a.nodeAnimations.Head.orientation.map(k => k.time),
    [0, 15, 30]
  );
  A.setKey(a, 'Head', 'orientation', 15, { x: 1, y: 0, z: 0, w: 0 });
  const k = A.keyAt(a, 'Head', 'orientation', 15);
  assert.deepEqual(k.delta, { x: 1, y: 0, z: 0, w: 0 });
  assert.equal(k.interpolationType, 'smooth');
  A.setKey(a, 'Neck', 'position', 999.4, { x: 1, y: 2, z: 3 });
  assert.equal(a.nodeAnimations.Neck.position[0].time, 60);
  A.setKey(a, 'Neck', 'shapeVisible', 0, 'not a boolean');
  assert.deepEqual(a.nodeAnimations.Neck.shapeVisible, []);
});

test('deleteKey removes every key on that frame and drops a bone left with none', () => {
  const a = A.read(sample());
  A.deleteKey(a, 'L-Arm', 'position', 10);
  assert.ok(a.nodeAnimations['L-Arm']);
  A.deleteKey(a, 'L-Arm', 'orientation', 10);
  assert.equal('L-Arm' in a.nodeAnimations, false);
  A.deleteKey(a, 'Nobody', 'position', 0);
});

test('moveKeys moves a frame on the given bones and replaces what was there', () => {
  const a = A.read(sample());
  A.moveKeys(a, ['Head', 'L-Arm'], 30, 10);
  assert.deepEqual(
    a.nodeAnimations.Head.orientation.map(k => k.time),
    [0, 10]
  );
  assert.equal(a.nodeAnimations['L-Arm'].orientation.length, 1);
  A.moveKeys(a, ['Head'], 10, 500);
  assert.deepEqual(
    a.nodeAnimations.Head.orientation.map(k => k.time),
    [0, 60]
  );
});

test('setDuration cuts keys past the new end', () => {
  const a = A.read(sample());
  A.setDuration(a, 20);
  assert.equal(a.duration, 20);
  assert.deepEqual(
    a.nodeAnimations.Head.orientation.map(k => k.time),
    [0]
  );
  A.setDuration(a, 0);
  assert.equal(a.duration, 1);
});

test('mirror swaps left and right bones and flips the turn and x moves', () => {
  const m = A.mirror(A.read(sample()));
  assert.deepEqual(Object.keys(m.nodeAnimations).sort(), ['Head', 'R-Arm']);
  assert.deepEqual(m.nodeAnimations['R-Arm'].position[0].delta, { x: -2, y: 1, z: 0 });
  assert.deepEqual(m.nodeAnimations['R-Arm'].orientation[0].delta, { x: 0, y: -0.6, z: -0.8, w: 0 });
  assert.deepEqual(m.nodeAnimations.Head.orientation[1].delta, { x: 0.2, y: -0.1, z: -0, w: 0.9747 });
  // a bone without a partner on the model stays itself, mirrored in place
  const own = A.mirror(A.read(sample()), b => b !== 'R-Arm');
  assert.deepEqual(Object.keys(own.nodeAnimations).sort(), ['Head', 'L-Arm']);
  assert.equal(A.sideSwap('R_Leg'), 'L_Leg');
  assert.equal(A.sideSwap('Pelvis'), 'Pelvis');
});

test('keyTimes lists every keyed frame once', () => {
  const a = A.read(sample());
  assert.deepEqual(A.keyTimes(a), [0, 10, 30]);
  assert.deepEqual(A.keyTimes(a, 'L-Arm'), [10]);
});

test('sameDelta agrees with comparing the JSON text', () => {
  const pairs = [
    [
      { x: 1, y: 2, z: 3 },
      { x: 1, y: 2, z: 3 },
    ],
    [
      { x: 1, y: 2, z: 3 },
      { x: 1, y: 2, z: 4 },
    ],
    [
      { x: 0, y: 0, z: 0, w: 1 },
      { x: -0, y: 0, z: 0, w: 1 },
    ],
    [true, true],
    [true, false],
    [
      { x: 1, y: 2 },
      { x: 1, y: 2, z: 0 },
    ],
    [{ x: 1 }, null],
    [undefined, undefined],
  ];
  for (const [p, q] of pairs) assert.equal(A.sameDelta(p, q), JSON.stringify(p) === JSON.stringify(q), JSON.stringify([p, q]));
});
