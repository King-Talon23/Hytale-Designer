// POST /api/anims {id?, name, anim}: publish an animation made on the site, or update one of your own (with its id).
import { MAX_ANIMS, animOf, body, cleanName, ensure, json, newId, sameSite, spend, switchedOn, whoIs } from '../../../lib/api.js';

export async function onRequestPost({ request, env }) {
  if (!sameSite(request)) return json({ error: 'Not allowed.' }, 403);
  if (!switchedOn(env)) return json({ error: 'Publishing is not switched on yet.' }, 503);
  const me = await whoIs(request, env); if (!me) return json({ error: 'Sign in with Hytale first.' }, 401);
  const b = await body(request, 700000); if (!b) return json({ error: 'That animation could not be read.' }, 400);
  const name = cleanName(b.name), text = animOf(b.anim);
  if (!name) return json({ error: 'Give the animation a name first.' }, 400);
  if (!text) return json({ error: 'That is not an animation the game can play.' }, 400);
  await ensure(env.DB); const now = Date.now();
  if (b.id != null) {
    const id = String(b.id); if (!/^[A-Za-z0-9_-]{12}$/.test(id)) return json({ error: 'Unknown animation.' }, 404);
    const row = await env.DB.prepare('SELECT owner_uuid FROM anims WHERE id = ?1').bind(id).first();
    if (!row || row.owner_uuid !== me.uuid) return json({ error: 'Unknown animation.' }, 404);
    if (!await spend(env, me.uuid)) return json({ error: 'Too many changes for now. Try again in an hour.' }, 429);
    await env.DB.prepare('UPDATE anims SET name = ?2, anim = ?3, updated = ?4 WHERE id = ?1').bind(id, name, text, now).run();
    return json({ id });
  }
  const n = (await env.DB.prepare('SELECT COUNT(*) AS n FROM anims WHERE owner_uuid = ?1').bind(me.uuid).first()).n;
  if (n >= MAX_ANIMS) return json({ error: `You have ${MAX_ANIMS} published animations, the most there can be. Unpublish one first.` }, 409);
  if (!await spend(env, me.uuid)) return json({ error: 'Too many changes for now. Try again in an hour.' }, 429);
  const id = newId();
  await env.DB.prepare('INSERT INTO anims (id, owner_uuid, name, anim, created, updated) VALUES (?1, ?2, ?3, ?4, ?5, ?5)').bind(id, me.uuid, name, text, now).run();
  return json({ id }, 201);
}
