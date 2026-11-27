// For dev/make-scene-data.py: where each background's level clearing goes in its biome tile, and the block its ground takes,
// worked out once here so the page has them before the land is ready.
// Run: node dev/land-sites.mjs <in.json> <out.json>   in: { key: { tile, files: { path: text }, ground } }   out: { key: site }
import fs from 'fs';
import { loose, makeTerrain, findSite } from '../site/app/worldgen.js';

const [, , inPath, outPath] = process.argv;
const all = JSON.parse(fs.readFileSync(inPath, 'utf8')),
  out = {};
for (const [key, { tile, files, ground, prefer }] of Object.entries(all)) {
  const parsed = {};
  for (const [p, t] of Object.entries(files)) parsed[p] = loose(t);
  const s = findSite(makeTerrain(loose(tile), parsed), { FIX: 45, ground, prefer });
  out[key] = { ox: s.ox, oz: s.oz, S0: s.S0, rim: s.rim };
}
fs.writeFileSync(outPath, JSON.stringify(out));
