// GET /api/players/<uuid>/anims: the animations a player has published (newest first), for anyone to see and copy.
import { ensure, json, uuidOf } from '../../../../lib/api.js';

export async function onRequestGet({ params, env }) {
  const uuid = uuidOf(params.uuid);
  if (!uuid) return json({ error: 'That is not a player UUID.' }, 400);
  if (!env.DB) return json({ anims: [] }, 200, 30);
  await ensure(env.DB);
  const { results } = await env.DB.prepare(
    `SELECT a.id, a.name, a.anim, a.updated FROM anims a LEFT JOIN players p ON p.uuid = a.owner_uuid
    WHERE a.owner_uuid = ?1 AND a.hidden = 0 AND COALESCE(p.banned, 0) = 0 ORDER BY a.updated DESC LIMIT 45`
  )
    .bind(uuid)
    .all();
  return json(
    {
      anims: results
        .map(r => {
          let anim = null;
          try {
            anim = JSON.parse(r.anim);
          } catch {
            /* skip */
          }
          return { id: r.id, name: r.name, anim, updated: r.updated };
        })
        .filter(r => r.anim),
    },
    200,
    30
  );
}
