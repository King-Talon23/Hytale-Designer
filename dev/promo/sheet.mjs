// Contact sheet of a take: node sheet.mjs <take> [count=12] -> out/sheet-<take>.jpg (frame number + time on each)
import fs from 'fs';
import { execFileSync } from 'child_process';
const [take, count = 12] = process.argv.slice(2);
const dir = `takes/${take}`;
const list = JSON.parse(fs.readFileSync(`${dir}/times.json`));
const t0 = list[0][1];
const pick = Array.from({ length: +count }, (_, i) => list[Math.round((i * (list.length - 1)) / (count - 1))]);
const args = ['-loglevel', 'error', '-y'];
for (const [n] of pick) args.push('-i', `${dir}/${n}.jpg`);
const cols = 4;
const f = pick
  .map(([n, t], i) => `[${i}]scale=480:-1,drawtext=fontfile=out/arial.ttf:text='${n} ${(t - t0).toFixed(1)}s':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.6[v${i}]`)
  .join(';');
const lay = pick.map((_, i) => `${(i % cols) * 480}_${Math.floor(i / cols) * 270}`).join('|');
args.push('-filter_complex', `${f};${pick.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${pick.length}:layout=${lay}`, `out/sheet-${take}.jpg`);
execFileSync('ffmpeg', args);
console.log(`out/sheet-${take}.jpg`, list.length, 'frames', (list.at(-1)[1] - t0).toFixed(1) + 's');
