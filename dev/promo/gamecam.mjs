// Holds the in-game camera on KingTalon23's front for the live-sync take: a slow push-in (a camera_sequence must move to take).
// Run from .code/live-tools' sibling folder under the game lock: node gamecam.mjs <seconds> [from=4.2] [to=3.2] [side=0.6]
import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
const tools = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../live-tools');
const call = a => execFileSync('node', ['call.mjs', JSON.stringify(a)], { cwd: tools, env: process.env }).toString();
const [secs = 40, from = 4.2, to = 3.2, side = 0.6] = process.argv.slice(2).map(Number);
const pos = JSON.parse(/\{"name".*\}/.exec(call([['get_player_position', { player: 'KingTalon23' }]]))[0]).position;
const { x, y, z } = pos;
const yaw = process.env.YAW !== undefined ? +process.env.YAW : pos.yaw;
const at = (d, s) => ({
  x: x - Math.sin(yaw) * d + Math.cos(yaw) * s,
  y: y + +(process.env.CAMY || 1.7),
  z: z - Math.cos(yaw) * d - Math.sin(yaw) * s,
  lookAt: { x, y: y + +(process.env.LOOKY || 1.0), z },
  fov: +(process.env.FOV || 45),
  roll: 0.01,
});
const keys = [
  { ...at(from, side), duration: 0 },
  { ...at(to, -side), duration: secs, easing: 'SineInOut' },
];
console.log(
  call([['camera_sequence', { player: 'KingTalon23', keyframes: keys, release: 'true' }]])
    .trim()
    .split('\n')
    .pop()
);
