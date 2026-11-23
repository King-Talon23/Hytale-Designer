// The API endpoints (functions/api) against an in-memory stand-in for Cloudflare D1 built on node:sqlite.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import * as api from '../../lib/api.js';
import * as skins from '../../functions/api/skins/index.js';
import * as skinOne from '../../functions/api/skins/[id].js';
import * as anims from '../../functions/api/anims/index.js';
import * as animOne from '../../functions/api/anims/[id].js';
import * as playerSkins from '../../functions/api/players/[uuid]/skins.js';
import * as playerAnims from '../../functions/api/players/[uuid]/anims.js';
import * as meApi from '../../functions/api/me.js';
import * as logout from '../../functions/api/logout.js';

// ---- D1 stand-in: prepare(sql).bind(...).first() / all() / run(), and batch()
const sq = new DatabaseSync(':memory:');
const stmt = (sql, args = []) => ({
  bind: (...a) => stmt(sql, a),
  first: async () => sq.prepare(sql).get(...args) ?? null,
  all: async () => ({ results: sq.prepare(sql).all(...args) }),
  run: async () => ({ meta: { changes: Number(sq.prepare(sql).run(...args).changes) } }),
});
const DB = {
  prepare: sql => stmt(sql),
  batch: async ss => {
    const out = [];
    for (const s of ss) out.push(await s.run());
    return out;
  },
};
const env = { DB, SESSION_KEY: 'test-key-123' };
await api.ensure(DB);

let nextUser = 1;
function player(name) {
  const uuid = `${String(nextUser++).padStart(8, '0')}-2222-3333-4444-555555555555`;
  sq.prepare('INSERT INTO players (uuid, username, updated, sess) VALUES (?, ?, ?, 0)').run(uuid, name, Date.now());
  return uuid;
}
const cookie = async uuid => (await api.sessionCookie(env, uuid, 0)).split(';')[0];
async function request(path, method, who, body, origin = api.SITE) {
  const headers = { Origin: origin, 'Content-Type': 'application/json' };
  if (who) headers.Cookie = await cookie(who);
  return new Request(api.SITE + path, {
    method,
    headers,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}
const answer = async r => [r.status, await r.json()];
const postAnim = async (who, b, origin) =>
  answer(await anims.onRequestPost({ request: await request('/api/anims', 'POST', who, b, origin), env }));
const delAnim = async (who, id) =>
  answer(await animOne.onRequestDelete({ request: await request('/api/anims/' + id, 'DELETE', who), env, params: { id } }));
const postSkin = async (who, b, origin) =>
  answer(await skins.onRequestPost({ request: await request('/api/skins', 'POST', who, b, origin), env }));
const delSkin = async (who, id) =>
  answer(await skinOne.onRequestDelete({ request: await request('/api/skins/' + id, 'DELETE', who), env, params: { id } }));
const listAnims = async uuid => answer(await playerAnims.onRequestGet({ params: { uuid }, env }));
const listSkins = async uuid => answer(await playerSkins.onRequestGet({ params: { uuid }, env }));

const anim = {
  formatVersion: 1,
  duration: 60,
  nodeAnimations: {
    Head: {
      orientation: [
        { time: 0, delta: { x: 0, y: 0, z: 0, w: 1 }, interpolationType: 'smooth' },
        { time: 30, delta: { x: 0.2, y: 0, z: 0, w: 0.98 }, interpolationType: 'linear' },
      ],
    },
  },
};
const skin = { bodyCharacteristic: 'Default.Tan', haircut: 'Bangs.Brown' };

test('writes need the site as origin and a signed-in player', async () => {
  const a = player('Ann');
  assert.deepEqual(await postAnim(null, { name: 'x', anim }), [401, { error: 'Sign in with Hytale first.' }]);
  assert.deepEqual(await postAnim(a, { name: 'x', anim }, 'https://evil.example'), [403, { error: 'Not allowed.' }]);
  assert.deepEqual(await postSkin(null, { name: 'x', skin }), [401, { error: 'Sign in with Hytale first.' }]);
  assert.deepEqual(await postSkin(a, { name: 'x', skin }, 'https://evil.example'), [403, { error: 'Not allowed.' }]);
  assert.deepEqual(await delSkin(null, 'abcdefghijkl'), [401, { error: 'Sign in with Hytale first.' }]);
  const off = { DB };
  const r = await anims.onRequestPost({ request: await request('/api/anims', 'POST', a, { name: 'x', anim }), env: off });
  assert.deepEqual(await answer(r), [503, { error: 'Publishing is not switched on yet.' }]);
});

test('publish, update and unpublish an animation; others cannot touch it', async () => {
  const a = player('Bea'),
    b = player('Cid');
  const [st, { id }] = await postAnim(a, { name: 'Wave <b>', anim });
  assert.equal(st, 201);
  assert.match(id, /^[A-Za-z0-9_-]{12}$/);
  assert.deepEqual(await postAnim(a, { name: '  ', anim }), [400, { error: 'Give the animation a name first.' }]);
  assert.deepEqual(await postAnim(a, { name: 'x', anim: { duration: 0, nodeAnimations: {} } }), [
    400,
    { error: 'That is not an animation the game can play.' },
  ]);
  assert.deepEqual(await postAnim(a, 'not json'), [400, { error: 'That animation could not be read.' }]);
  assert.deepEqual(await postAnim(a, { id, name: 'Wave 2', anim }), [200, { id }]);
  assert.deepEqual(await postAnim(b, { id, name: 'Steal', anim }), [404, { error: 'Unknown animation.' }]);
  assert.deepEqual(await postAnim(a, { id: 'short', name: 'x', anim }), [404, { error: 'Unknown animation.' }]);
  assert.deepEqual(await delAnim(b, id), [404, { error: 'Unknown animation.' }]);
  const [ls, list] = await listAnims(a);
  assert.equal(ls, 200);
  assert.deepEqual(
    list.anims.map(x => x.name),
    ['Wave 2']
  );
  assert.deepEqual(Object.keys(list.anims[0].anim.nodeAnimations.Head), [
    'position',
    'orientation',
    'shapeStretch',
    'shapeVisible',
    'shapeUvOffset',
  ]);
  assert.deepEqual(await delAnim(a, id), [200, { ok: true }]);
  assert.deepEqual(await delAnim(a, id), [404, { error: 'Unknown animation.' }]);
  assert.deepEqual(await delAnim(a, 'bad id'), [404, { error: 'Unknown animation.' }]);
});

test('publish, update and unpublish a skin; custom items never go up', async () => {
  const a = player('Dee'),
    b = player('Eve');
  const [st, { id }] = await postSkin(a, { name: 'Knight', skin });
  assert.equal(st, 201);
  assert.deepEqual(await postSkin(a, { name: 'x', skin: { ...skin, overtop: 'Custom_abc' } }), [
    400,
    { error: 'Only skins made of game items can be published. Custom assets stay on your computer.' },
  ]);
  assert.deepEqual(await postSkin(a, { name: '', skin }), [400, { error: 'Give the skin a name first.' }]);
  assert.deepEqual(await postSkin(a, { id, name: 'Knight 2', skin }), [200, { id }]);
  assert.deepEqual(await postSkin(b, { id, name: 'Mine now', skin }), [404, { error: 'Unknown skin.' }]);
  assert.deepEqual(await delSkin(b, id), [404, { error: 'Unknown skin.' }]);
  const [, list] = await listSkins(a);
  assert.deepEqual(list.skins, [{ id, name: 'Knight 2', skin, updated: list.skins[0].updated }]);
  assert.deepEqual(await delSkin(a, id), [200, { ok: true }]);
  assert.deepEqual((await listSkins(a))[1].skins, []);
});

test('player lists: a bad UUID, hidden rows and banned players', async () => {
  const a = player('Fay');
  assert.deepEqual(await listAnims('nope'), [400, { error: 'That is not a player UUID.' }]);
  assert.deepEqual(await listSkins('nope'), [400, { error: 'That is not a player UUID.' }]);
  const [, { id }] = await postAnim(a, { name: 'Hidden', anim });
  sq.prepare('UPDATE anims SET hidden = 1 WHERE id = ?').run(id);
  assert.equal((await listAnims(a))[1].anims.length, 0);
  sq.prepare('UPDATE anims SET hidden = 0 WHERE id = ?').run(id);
  assert.equal((await listAnims(a))[1].anims.length, 1);
  sq.prepare('UPDATE players SET banned = 1 WHERE uuid = ?').run(a);
  assert.equal((await listAnims(a))[1].anims.length, 0);
  assert.equal((await postAnim(a, { name: 'x', anim }))[0], 401);
});

test('at most WRITES_PER_HOUR changes an hour, and MAX_SKINS skins a player', async () => {
  const a = player('Gus');
  let n = 0;
  for (;;) {
    const [st] = await postAnim(a, { name: 'n' + n, anim });
    if (st !== 201) {
      assert.equal(st, 429);
      break;
    }
    n++;
  }
  assert.equal(n, api.WRITES_PER_HOUR);
  assert.deepEqual(await postSkin(a, { name: 'late', skin }), [429, { error: 'Too many changes for now. Try again in an hour.' }]);
  const b = player('Hal');
  const now = Date.now();
  for (let i = 0; i < api.MAX_SKINS; i++)
    sq.prepare('INSERT INTO skins (id, owner_uuid, name, recipe, created, updated) VALUES (?, ?, ?, ?, ?, ?)').run(
      'fill' + String(i).padStart(8, '0'),
      b,
      'S' + i,
      JSON.stringify(skin),
      now,
      now
    );
  assert.deepEqual(await postSkin(b, { name: 'one more', skin }), [
    409,
    { error: `You have ${api.MAX_SKINS} published skins, the most there can be. Unpublish one first.` },
  ]);
});

test('big bodies are turned down', async () => {
  const a = player('Ida');
  const big = { formatVersion: 1, duration: 6000, nodeAnimations: {} };
  for (let b = 0; b < 4; b++) {
    big.nodeAnimations['B' + b] = { orientation: [] };
    for (let t = 0; t < 5000; t++) big.nodeAnimations['B' + b].orientation.push({ time: t, delta: { x: 0.1, y: 0.2, z: 0.3, w: 0.9 } });
  }
  assert.deepEqual(await postAnim(a, { name: 'Big', anim: big }), [400, { error: 'That animation could not be read.' }]);
});

test('me, logout and deleting your data', async () => {
  const a = player('Jo');
  await postSkin(a, { name: 'Mine', skin });
  await postAnim(a, { name: 'Mine', anim });
  const me = await answer(await meApi.onRequestGet({ request: await request('/api/me', 'GET', a), env }));
  assert.equal(me[1].signedIn, true);
  assert.equal(me[1].username, 'Jo');
  assert.deepEqual(
    me[1].skins.map(s => s.name),
    ['Mine']
  );
  assert.deepEqual(await answer(await meApi.onRequestGet({ request: await request('/api/me', 'GET', null), env })), [
    200,
    { on: true, signedIn: false },
  ]);
  assert.deepEqual(await answer(await meApi.onRequestGet({ request: await request('/api/me', 'GET', a), env: { DB } })), [
    200,
    { on: false },
  ]);
  const del = await meApi.onRequestDelete({ request: await request('/api/me', 'DELETE', a), env });
  assert.equal(del.status, 200);
  assert.match(del.headers.get('Set-Cookie'), /Max-Age=0/);
  assert.equal(sq.prepare('SELECT COUNT(*) AS n FROM anims WHERE owner_uuid = ?').get(a).n, 0);
  assert.equal(sq.prepare('SELECT COUNT(*) AS n FROM skins WHERE owner_uuid = ?').get(a).n, 0);
  assert.equal(sq.prepare('SELECT COUNT(*) AS n FROM players WHERE uuid = ?').get(a).n, 0);

  const b = player('Kim');
  const c = await cookie(b);
  const out = await logout.onRequestPost({ request: await request('/api/logout', 'POST', b), env });
  assert.equal(out.status, 200);
  const old = new Request(api.SITE + '/api/anims', {
    method: 'POST',
    headers: { Origin: api.SITE, Cookie: c, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'x', anim }),
  });
  assert.equal((await anims.onRequestPost({ request: old, env })).status, 401);
});
