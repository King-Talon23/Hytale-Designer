// lib/api.js: what the server accepts from a player before anything reaches the database.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { animOf, cleanName, recipeOf, uuidOf } from '../../lib/api.js';

test('uuidOf accepts a UUID with or without dashes, in any case, and nothing else', () => {
  assert.equal(uuidOf('11111111-2222-3333-4444-555555555555'), '11111111-2222-3333-4444-555555555555');
  assert.equal(uuidOf('AABBCCDD11112222333344445555FFFF'), 'aabbccdd-1111-2222-3333-44445555ffff');
  for (const bad of [
    '',
    null,
    undefined,
    'nope',
    '11111111-2222-3333-4444-55555555555',
    '11111111-2222-3333-4444-5555555555555',
    'g1111111-2222-3333-4444-555555555555',
  ])
    assert.equal(uuidOf(bad), null, String(bad));
});

test('cleanName strips control characters and angle brackets, trims and cuts at 40', () => {
  assert.equal(cleanName('  Wave <b>\u0000\u007f  '), 'Wave b');
  assert.equal(cleanName(null), '');
  assert.equal(cleanName(12), '12');
  assert.equal(cleanName('x'.repeat(50)).length, 40);
});

test('recipeOf takes game part names only, and needs a body', () => {
  assert.deepEqual(recipeOf({ bodyCharacteristic: 'Default.Tan', haircut: 'Bangs.Brown', cape: null }), {
    bodyCharacteristic: 'Default.Tan',
    haircut: 'Bangs.Brown',
  });
  assert.equal(recipeOf({ haircut: 'Bangs' }), null);
  assert.equal(recipeOf({ bodyCharacteristic: 'Default', wings: 'Big' }), null);
  assert.equal(recipeOf({ bodyCharacteristic: 'Default', overtop: 'Custom_abc' }), null);
  assert.equal(recipeOf({ bodyCharacteristic: 'Default', overtop: '<script>' }), null);
  assert.equal(recipeOf({ bodyCharacteristic: 'Default', overtop: 5 }), null);
  assert.equal(recipeOf({ bodyCharacteristic: 'a.b.c.d' }), null);
  for (const bad of [null, 'x', [], [1]]) assert.equal(recipeOf(bad), null);
});

const good = () => ({
  formatVersion: 1,
  duration: 60,
  nodeAnimations: {
    Head: {
      orientation: [
        { time: 0, delta: { x: 0, y: 0, z: 0, w: 1 }, interpolationType: 'smooth' },
        { time: 30, delta: { x: 0.2, y: 0, z: 0, w: 0.98 }, interpolationType: 'linear' },
      ],
      shapeVisible: [{ time: 0, delta: true }],
    },
  },
});

test('animOf rebuilds a playable animation and nothing else', () => {
  const src = good();
  src.evil = '<script>';
  src.nodeAnimations.Head.junk = [1];
  src.nodeAnimations.Head.orientation[0].extra = 'x';
  src.nodeAnimations.Head.orientation[1].interpolationType = 'bounce';
  const out = JSON.parse(animOf(src));
  assert.deepEqual(Object.keys(out), ['formatVersion', 'duration', 'holdLastKeyframe', 'nodeAnimations']);
  assert.deepEqual(Object.keys(out.nodeAnimations.Head), ['position', 'orientation', 'shapeStretch', 'shapeVisible', 'shapeUvOffset']);
  assert.deepEqual(out.nodeAnimations.Head.orientation[0], { time: 0, delta: { x: 0, y: 0, z: 0, w: 1 }, interpolationType: 'smooth' });
  assert.equal(out.nodeAnimations.Head.orientation[1].interpolationType, 'smooth');
  assert.equal(out.holdLastKeyframe, false);
});

test('animOf turns down anything the game could not play', () => {
  const tweak = f => {
    const a = good();
    f(a);
    return animOf(a);
  };
  assert.equal(animOf(null), null);
  assert.equal(animOf([]), null);
  assert.equal(animOf({ duration: 60 }), null);
  assert.equal(
    tweak(a => (a.duration = 0)),
    null
  );
  assert.equal(
    tweak(a => (a.duration = 6001)),
    null
  );
  assert.equal(
    tweak(a => (a.nodeAnimations.Head.orientation[1].time = 61)),
    null
  );
  assert.equal(
    tweak(a => (a.nodeAnimations.Head.orientation[1].delta.w = NaN)),
    null
  );
  assert.equal(
    tweak(a => (a.nodeAnimations.Head.orientation[1].delta.x = 1e6)),
    null
  );
  assert.equal(
    tweak(a => (a.nodeAnimations.Head.shapeVisible[0].delta = 'yes')),
    null
  );
  assert.equal(
    tweak(a => (a.nodeAnimations['Bad"Bone'] = { position: [] })),
    null
  );
  assert.equal(
    tweak(a => {
      for (let i = 0; i < 201; i++) a.nodeAnimations['B' + i] = {};
    }),
    null
  );
  assert.equal(
    tweak(a => {
      a.duration = 6000;
      a.nodeAnimations.Head.position = Array.from({ length: 20001 }, (_, t) => ({ time: t % 6000, delta: { x: 0, y: 0, z: 0 } }));
    }),
    null
  );
  assert.notEqual(
    tweak(a => (a.duration = 6000)),
    null
  );
});
