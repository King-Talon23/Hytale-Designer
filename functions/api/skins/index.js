// POST /api/skins {id?, name, skin}: publish a skin, or update one of your own published skins (with its id).
import { MAX_SKINS, body, cleanName, json, newId, ownedResource, recipeOf, spend, tooMany, writer } from '../../../lib/api.js';

export async function onRequestPost({ request, env }) {
  const w = await writer(request, env);
  if (w.res) return w.res;
  const me = w.me;
  const b = await body(request);
  if (!b) return json({ error: 'That skin could not be read.' }, 400);
  const name = cleanName(b.name),
    recipe = recipeOf(b.skin);
  if (!name) return json({ error: 'Give the skin a name first.' }, 400);
  if (!recipe) return json({ error: 'Only skins made of game items can be published. Custom assets stay on your computer.' }, 400);
  const now = Date.now(),
    text = JSON.stringify(recipe);
  if (b.id != null) {
    const own = await ownedResource(env, 'skins', b.id, me, 'Unknown skin.');
    if (own.res) return own.res;
    if (!(await spend(env, me.uuid))) return tooMany();
    await env.DB.prepare('UPDATE skins SET name = ?2, recipe = ?3, updated = ?4 WHERE id = ?1').bind(own.id, name, text, now).run();
    return json({ id: own.id });
  }
  const n = (await env.DB.prepare('SELECT COUNT(*) AS n FROM skins WHERE owner_uuid = ?1').bind(me.uuid).first()).n;
  if (n >= MAX_SKINS) return json({ error: `You have ${MAX_SKINS} published skins, the most there can be. Unpublish one first.` }, 409);
  if (!(await spend(env, me.uuid))) return tooMany();
  const id = newId();
  await env.DB.prepare('INSERT INTO skins (id, owner_uuid, name, recipe, created, updated) VALUES (?1, ?2, ?3, ?4, ?5, ?5)')
    .bind(id, me.uuid, name, text, now)
    .run();
  return json({ id }, 201);
}
