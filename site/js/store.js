// The wardrobe. Two shelves that never mix:
//   game   - 5 slots that mirror the presets inside Hytale (ids game-0 .. game-4)
//   custom - up to 45 skins that exist only on this site
import * as db from './db.js';
import { sanitize, cleanName } from './skin.js';

export const GAME_SLOTS = 5, CUSTOM_MAX = 45;
const gameId = i => 'game-' + i;

export async function list() {
  const rows = (await db.all('skins')).filter(r => r && sanitize(r.skin));
  const game = Array.from({ length: GAME_SLOTS }, (_, i) => rows.find(r => r.id === gameId(i)) || null);
  const custom = rows.filter(r => r.kind === 'custom').sort((a, b) => b.updated - a.updated);
  return { game, custom };
}
function record(id, kind, name, skin, slot) { return { id, kind, slot: kind === 'game' ? slot : undefined, name: cleanName(name) || 'Unnamed', skin: sanitize(skin), updated: Date.now() }; }
async function write(r) { if (!r.skin) throw new Error('That is not a skin.'); await db.put('skins', r.id, r); return r; }

export async function saveCustom(name, skin, id) {
  if (!id && (await list()).custom.length >= CUSTOM_MAX) throw new Error(`Your wardrobe is full (${CUSTOM_MAX} skins). Delete one first.`);
  return write(record(id || crypto.randomUUID(), 'custom', name, skin));
}
export const saveGame = (slot, name, skin) => write(record(gameId(slot), 'game', name, skin, slot));
export const remove = id => db.del('skins', id);

// Put a custom skin into an in-game slot. Whatever was in the slot takes the custom skin's place, so nothing is lost.
export async function swap(customId, slot) {
  const { game, custom } = await list(), c = custom.find(r => r.id === customId); if (!c) throw new Error('That skin is gone.');
  const old = game[slot];
  await saveGame(slot, c.name, c.skin);
  if (old) await write(record(c.id, 'custom', old.name, old.skin)); else await remove(c.id);
}

export async function exportAll() { const { game, custom } = await list();
  return { format: 'skin-editor-backup', version: 1, game: game.map(r => r && { name: r.name, skin: r.skin }), custom: custom.map(r => ({ name: r.name, skin: r.skin })) }; }
export async function importAll(data) {   // adds to what is there; never overwrites a filled in-game slot
  if (!data || data.format !== 'skin-editor-backup' || !Array.isArray(data.custom)) throw new Error('That file is not a Skin Editor backup.');
  const cur = await list(); let added = 0, skipped = 0, room = CUSTOM_MAX - cur.custom.length;
  for (const r of data.custom.slice(0, 500)) { const s = sanitize(r?.skin); if (!s) continue; if (room <= 0) { skipped++; continue; } await saveCustom(r.name, s); room--; added++; }
  for (let i = 0; i < GAME_SLOTS; i++) { const r = data.game?.[i], s = sanitize(r?.skin); if (s && !cur.game[i]) { await saveGame(i, r.name, s); added++; } }
  return { added, skipped };
}
