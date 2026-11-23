// site/app/foldersync.js: one subfolder of the skins folder kept in step, on a pretend folder (no browser needed).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mirrorDir } from '../../site/app/foldersync.js';

// a folder handle stand-in: files by name, and a log of what was written and removed
function folder(files = {}) {
  const f = { files: { ...files }, log: [] };
  f.getFileHandle = async name => ({
    createWritable: async () => {
      let text = '';
      return {
        write: async d => {
          text += d;
        },
        close: async () => {
          f.files[name] = text;
          f.log.push('write ' + name);
        },
      };
    },
  });
  f.removeEntry = async name => {
    if (!(name in f.files)) throw new DOMException('Not found', 'NotFoundError');
    delete f.files[name];
    f.log.push('remove ' + name);
  };
  return f;
}

test('writes new files once and only rewrites what changed', async () => {
  const d = folder(),
    sync = { written: new Map(), known: new Set() };
  await mirrorDir(
    d,
    'My skins',
    [
      ['A.json', 'a1'],
      ['B.json', 'b1'],
    ],
    sync
  );
  assert.deepEqual(d.files, { 'A.json': 'a1', 'B.json': 'b1' });
  d.log.length = 0;
  await mirrorDir(
    d,
    'My skins',
    [
      ['A.json', 'a1'],
      ['B.json', 'b2'],
    ],
    sync
  );
  assert.deepEqual(d.log, ['write B.json']);
  assert.equal(sync.written.get('My skins/B.json'), 'b2');
});

test('a mark stands in for the body when there is one (pictures)', async () => {
  const d = folder(),
    sync = { written: new Map(), known: new Set() };
  await mirrorDir(d, 'Custom assets', [['x.png', 'PNG-1', 'id@1']], sync);
  d.log.length = 0;
  await mirrorDir(d, 'Custom assets', [['x.png', 'PNG-other-bytes', 'id@1']], sync);
  assert.deepEqual(d.log, []);
  await mirrorDir(d, 'Custom assets', [['x.png', 'PNG-2', 'id@2']], sync);
  assert.deepEqual(d.log, ['write x.png']);
});

test('files the site wrote that are gone are deleted; files it never wrote are left alone', async () => {
  const d = folder({ 'Theirs.json': 'keep me' }),
    sync = { written: new Map(), known: new Set() };
  await mirrorDir(
    d,
    'My skins',
    [
      ['A.json', 'a'],
      ['B.json', 'b'],
    ],
    sync
  );
  await mirrorDir(d, 'My skins', [['A.json', 'a']], sync);
  assert.deepEqual(d.files, { 'Theirs.json': 'keep me', 'A.json': 'a' });
  assert.equal(sync.known.has('My skins/B.json'), false);
  assert.equal(sync.written.has('My skins/B.json'), false);
});

test('each subfolder only looks after its own files', async () => {
  const skins = folder(),
    slots = folder(),
    sync = { written: new Map(), known: new Set() };
  await mirrorDir(skins, 'My skins', [['A.json', 'a']], sync);
  await mirrorDir(slots, 'In-game slots', [['Slot 1 - A.json', 'a']], sync);
  await mirrorDir(slots, 'In-game slots', [], sync);
  assert.deepEqual(skins.files, { 'A.json': 'a' });
  assert.deepEqual(slots.files, {});
});

test('a file already gone is fine, and is forgotten', async () => {
  const d = folder(),
    sync = { written: new Map(), known: new Set(['My skins/Old.json']) };
  await mirrorDir(d, 'My skins', [], sync);
  assert.equal(sync.known.size, 0);
});

test('caseless: a rename that only changed case is the same file and is not deleted', async () => {
  const d = folder(),
    sync = { written: new Map(), known: new Set() };
  await mirrorDir(d, 'Animations', [['wave (1).blockyanim', 'w']], { ...sync, caseless: true });
  await mirrorDir(d, 'Animations', [['Wave (1).blockyanim', 'w']], { ...sync, caseless: true });
  assert.deepEqual(d.log, ['write wave (1).blockyanim', 'write Wave (1).blockyanim']);
  assert.equal(sync.known.has('Animations/wave (1).blockyanim'), false);
  assert.equal(sync.known.has('Animations/Wave (1).blockyanim'), true);
});
