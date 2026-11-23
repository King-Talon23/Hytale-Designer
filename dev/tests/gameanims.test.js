// Every .blockyanim in the game's own Assets.zip goes through site/app/anim.js unchanged, apart from keys outside the
// animation's length, which the editor drops on purpose. Skipped when the game is not installed on this computer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as A from '../../site/app/anim.js';
import { openZip } from '../../site/app/zip.js';

// the same place dev/serve.py reads it from
const ZIP = path.join(process.env.APPDATA || '', 'Hytale', 'install', 'release', 'package', 'game', 'latest', 'Assets.zip');
const have = await fs
  .access(ZIP)
  .then(() => true)
  .catch(() => false);

// what the editor keeps of a file: every key inside 0..duration (the game's own files sometimes run a frame or two past)
function inside(o) {
  const d = Math.max(1, Math.min(A.MAX_FRAMES, Math.round(o.duration)));
  const out = structuredClone(o);
  for (const tr of Object.values(out.nodeAnimations || {}))
    for (const k of A.TRACKS) if (Array.isArray(tr[k])) tr[k] = tr[k].filter(x => x.time >= 0 && x.time <= d);
  return out;
}

test('game animations round-trip through anim.js', { skip: have ? false : 'Assets.zip not found at ' + ZIP }, async () => {
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
    const zip = await openZip(src, n => n.endsWith('.blockyanim'));
    assert.ok(zip.names.length > 1000, 'expected the game to have over a thousand animations');
    const utf8 = new TextDecoder(),
      bad = [];
    for (const n of zip.names) {
      const o = JSON.parse(utf8.decode(await zip.read(n)));
      const text = A.write(A.read(o));
      try {
        assert.deepEqual(JSON.parse(text), inside(o));
        assert.equal(A.write(A.read(JSON.parse(text))), text);
      } catch {
        bad.push(n);
      }
    }
    assert.deepEqual(bad, [], `${bad.length} of ${zip.names.length} files changed`);
  } finally {
    await fh.close();
  }
});
