// POST /api/anims {id?, name, anim}: publish an animation made on the site, or update one of your own (with its id).
import { MAX_ANIMS, animOf, body, cleanName, ensure, json, newId, ownedResource, spend, tooMany, writer } from '../../../lib/api.js';

export async function onRequestPost({ request, env }) {
  const w = await writer(request, env);
  if (w.res) return w.res;
  const me = w.me;
  const b = await body(request, 700000);
  if (!b) return json({ error: 'That animation could not be read.' }, 400);
  const name = cleanName(b.name),
    text = animOf(b.anim);
  if (!name) return json({ error: 'Give the animation a name first.' }, 400);
  if (!text) return json({ error: 'That is not an animation the game can play.' }, 400);
  await ensure(env.DB);
  const now = Date.now();
  if (b.id != null) {
    const own = await ownedResource(env, 'anims', b.id, me, 'Unknown animation.');
    if (own.res) return own.res;
    if (!(await spend(env, me.uuid))) return tooMany();
    await env.DB.prepare('UPDATE anims SET name = ?2, anim = ?3, updated = ?4 WHERE id = ?1').bind(own.id, name, text, now).run();
    return json({ id: own.id });
  }
  const n = (await env.DB.prepare('SELECT COUNT(*) AS n FROM anims WHERE owner_uuid = ?1').bind(me.uuid).first()).n;
  if (n >= MAX_ANIMS)
    return json({ error: `You have ${MAX_ANIMS} published animations, the most there can be. Unpublish one first.` }, 409);
  if (!(await spend(env, me.uuid))) return tooMany();
  const id = newId();
  await env.DB.prepare('INSERT INTO anims (id, owner_uuid, name, anim, created, updated) VALUES (?1, ?2, ?3, ?4, ?5, ?5)')
    .bind(id, me.uuid, name, text, now)
    .run();
  return json({ id }, 201);
}
