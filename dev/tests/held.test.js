// Every move that holds something (site/app/held.js) is posed from the game's own files and measured: the hand must be on
// the item (the palm within a few units of its nearest box) and nothing may sink into the ground, at every key of the move.
// Skipped when the game is not installed on this computer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from '../../site/vendor/three.module.min.js';
import { openZip } from '../../site/app/zip.js';
import { HELD } from '../../site/app/held.js';
import { PROPS } from '../../site/app/game.js';

const ZIP = path.join(process.env.APPDATA || '', 'Hytale', 'install', 'release', 'package', 'game', 'latest', 'Assets.zip');
const have = await fs
  .access(ZIP)
  .then(() => true)
  .catch(() => false);
const ANIMS = 'Common/Characters/Animations/';
const GRIP = 6; // model units between the palm and the item (a hand box is 8 across)
const GROUND = -14; // how far a tip may dip below the feet (the game's Staff pose rests the crystal about 12 into the snow)

const xyz = (v, d = 0) => [v?.x ?? d, v?.y ?? d, v?.z ?? d];
// the same node tree figure.js builds: the node turns and moves, its children hang off its shape offset
function build(n, bones, parts) {
  const g = new THREE.Group();
  g.position.set(...xyz(n.position));
  const o = n.orientation;
  if (o) g.quaternion.set(o.x ?? 0, o.y ?? 0, o.z ?? 0, o.w ?? 1);
  g.userData = { rest: { p: g.position.clone(), q: g.quaternion.clone() }, shape: n.shape };
  const kids = new THREE.Group();
  kids.position.set(...xyz(n.shape?.offset));
  g.add(kids);
  if (bones && !bones[n.name]) bones[n.name] = kids;
  if (n.name) (parts[n.name] ||= []).push(g);
  for (const c of n.children || []) kids.add(build(c, bones, parts));
  return g;
}
// a track's value at frame T (straight between keys; the site curves between them, which stays within the keys' spread)
function at(keys, T, slerp) {
  if (!keys?.length) return null;
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].time <= T) i++;
  const a = keys[i],
    b = keys[Math.min(i + 1, keys.length - 1)];
  const u = b.time > a.time ? Math.min(1, Math.max(0, (T - a.time) / (b.time - a.time))) : 0;
  return slerp(a.delta, b.delta, u);
}
const qOf = d => new THREE.Quaternion(d.x ?? 0, d.y ?? 0, d.z ?? 0, d.w ?? 1);
const vOf = d => new THREE.Vector3(d.x ?? 0, d.y ?? 0, d.z ?? 0);

test('held items sit in the hand in every move', { skip: have ? false : 'Assets.zip not found at ' + ZIP }, async () => {
  const fh = await fs.open(ZIP);
  try {
    const src = {
      size: (await fh.stat()).size,
      read: async (a, b) => {
        const buf = Buffer.alloc(b - a);
        await fh.read(buf, 0, b - a, a);
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
      },
    };
    const zip = await openZip(src, n => n.startsWith(ANIMS) || n.endsWith('.blockymodel'));
    const utf8 = new TextDecoder();
    const json = async n => JSON.parse(utf8.decode(await zip.read(n)));
    const player = await json('Common/Characters/Player.blockymodel');
    const bad = [],
      seen = [];
    for (const [group, moves] of Object.entries(HELD))
      for (const [move, list] of Object.entries(moves)) {
        const file = move === '*' ? zip.names.find(n => n.startsWith(ANIMS + group + '/')) : ANIMS + group + '/' + move + '.blockyanim';
        if (!zip.names.includes(file)) {
          bad.push(`${group}/${move}: no ${file} in the game`);
          continue;
        }
        const anim = await json(file);
        for (const [item, bone, shift, turn] of list) {
          const [model, , scale = 1] = PROPS[item] || [];
          if (!model) continue; // a block is a plain cube the site builds itself
          const bones = {},
            parts = {},
            iparts = {};
          const root = new THREE.Group();
          for (const n of player.nodes) root.add(build(n, bones, parts));
          const top = build((await json('Common/' + model)).nodes[0], null, iparts);
          top.position.set(0, 0, 0); // as in game: the item's own root sits on the hand's attachment point
          const holder = new THREE.Group();
          if (turn) holder.rotation.set(...turn.map(d => (d * Math.PI) / 180));
          holder.scale.setScalar(scale); // the item's own Scale, as figure.js buildProp
          holder.add(top);
          bones[bone].add(holder);
          const topName = Object.keys(iparts).find(k => iparts[k].includes(top));
          const held = new Set();
          for (const [k, gs] of Object.entries(iparts))
            if (k !== topName && !parts[k]) {
              parts[k] = gs;
              gs.forEach(g => held.add(g));
            }
          const times = new Set([0]);
          for (const tr of Object.values(anim.nodeAnimations || {}))
            for (const k of ['orientation', 'position']) for (const key of tr[k] || []) times.add(key.time);
          let worst = 0,
            low = Infinity;
          for (const T of times) {
            for (const [name, tr] of Object.entries(anim.nodeAnimations || {}))
              for (const g of parts[name] || []) {
                const r = g.userData.rest;
                const q = at(tr.orientation, T, (a, b, u) => qOf(a).slerp(qOf(b), u));
                const p = at(tr.position, T, (a, b, u) => vOf(a).lerp(vOf(b), u));
                g.quaternion.copy(q ? r.q.clone().multiply(q) : r.q);
                g.position.copy(p && !held.has(g) ? r.p.clone().add(p) : r.p); // as figure.js: held parts turn, never shift
              }
            root.updateMatrixWorld(true);
            if (shift) {
              const b = holder.parent,
                bq = b.getWorldQuaternion(new THREE.Quaternion()).invert(),
                bs = b.getWorldScale(new THREE.Vector3());
              holder.position.copy(vOf({ x: shift[0], y: shift[1], z: shift[2] }).applyQuaternion(bq).divide(bs));
              root.updateMatrixWorld(true);
            }
            // the palm: where the hand's attachment point rests on the posed hand
            const att = parts[bone][0],
              palm = att.parent.localToWorld(att.userData.rest.p.clone());
            let near = Infinity;
            for (const gs of Object.values(iparts))
              for (const g of gs) {
                const s = g.userData.shape;
                if (!s || s.type !== 'box' || s.visible === false) continue;
                const st = xyz(s.stretch, 1),
                  size = xyz(s.settings?.size).map((v, i) => Math.abs(v * st[i])),
                  off = xyz(s.offset);
                const min = new THREE.Vector3(...off.map((o, i) => o - size[i] / 2)),
                  max = new THREE.Vector3(...off.map((o, i) => o + size[i] / 2));
                near = Math.min(near, g.localToWorld(g.worldToLocal(palm.clone()).clamp(min, max)).distanceTo(palm));
                for (const x of [min.x, max.x])
                  for (const y of [min.y, max.y])
                    for (const z of [min.z, max.z]) low = Math.min(low, g.localToWorld(new THREE.Vector3(x, y, z)).y);
              }
            worst = Math.max(worst, near);
          }
          seen.push(`${group}/${move} ${item}: grip ${worst.toFixed(1)}, lowest ${low.toFixed(0)}`);
          if (worst > GRIP) bad.push(`${group}/${move} ${item}: the palm is ${worst.toFixed(1)} units from the item`);
          if (low < GROUND) bad.push(`${group}/${move} ${item}: reaches ${low.toFixed(0)} units into the ground`);
        }
      }
    if (process.env.HELD_SHOW) console.log(seen.join('\n'));
    assert.ok(seen.length >= 10, 'expected at least ten held items, measured: ' + seen.join('; '));
    assert.deepEqual(bad, [], bad.join('\n'));
  } finally {
    await fh.close();
  }
});
