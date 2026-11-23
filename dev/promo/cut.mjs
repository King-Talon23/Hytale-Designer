// Cuts the recorded takes into the promo: node cut.mjs -> out/hytaledesigner-promo.mp4 (1920x1080, 30 fps, H.264, for X)
// Each piece: [take, from s, to s, speed]. Frames keep the real time Edge painted them (times.json), then are resampled to 30 fps.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const CUT = [
  ['wardrobe', 0.4, 24.6, 2.1],
  ['places', 1.6, 16.2, 1.7],
  ['animations', 0.6, 14.3, 1.25],
  ['create', 2.0, 19.6, 1.8],
  ['animate', 2.6, 7.6, 1.8],
  ['animate', 12.9, 23.0, 1.9],
  ['randomize', 1.6, 8.7, 1.15],
  ['end', 1.6, 7.2, 1],
];
const FPS = 30;
fs.mkdirSync('out/parts', { recursive: true });
const parts = [];
CUT.forEach(([take, a, b, speed], k) => {
  const dir = path.resolve('takes', take);
  const list = JSON.parse(fs.readFileSync(path.join(dir, 'times.json')));
  const t0 = list[0][1];
  const rows = list.filter(([, t]) => t - t0 >= a && t - t0 <= b);
  let txt = 'ffconcat version 1.0\n';
  rows.forEach(([n, t], i) => {
    const next = rows[i + 1] ? rows[i + 1][1] : t + 1 / 60;
    txt += `file '${path.join(dir, n + '.jpg').replace(/\\/g, '/')}'\nduration ${((next - t) / speed).toFixed(5)}\n`;
  });
  txt += `file '${path.join(dir, rows.at(-1)[0] + '.jpg').replace(/\\/g, '/')}'\n`;
  const cf = `out/parts/${k}.txt`,
    out = `out/parts/${k}.mp4`;
  fs.writeFileSync(cf, txt);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', cf, '-vf', `fps=${FPS},scale=1920:1080:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-r', String(FPS), out]);
  parts.push(out);
  console.log(take, rows.length, 'frames ->', ((b - a) / speed).toFixed(1) + 's');
});
fs.writeFileSync('out/parts/all.txt', parts.map(p => `file '${path.resolve(p).replace(/\\/g, '/')}'`).join('\n'));
execFileSync('ffmpeg', [
  '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'out/parts/all.txt',
  '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
  '-vf', 'fade=in:st=0:d=0.3',
  '-map', '0:v', '-map', '1:a', '-shortest',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', String(FPS),
  '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', 'out/hytaledesigner-promo.mp4',
]);
console.log(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size', '-of', 'csv=p=0', 'out/hytaledesigner-promo.mp4']).toString().trim());
