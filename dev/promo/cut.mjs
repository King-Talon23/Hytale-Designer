// Cuts the recorded takes into the promo: node cut.mjs [v3] -> out/hytaledesigner-promo[-v3].mp4 (1920x1080, 30 fps, H.264, for X)
// Each piece: [take, from s, to s, speed]. Frames keep the real time they were painted (times.json), then are resampled to 30 fps.
// A split piece ['split', siteTake, gameTake, from, to, speed] puts the site (left) beside Hytale (right) at the same moments:
// both takes' times.json hold wall-clock seconds, so the game frames are picked by the site take's own clock.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const SPLIT_CAP = process.argv[2] === 'v3' ? 'Edit on the web. See it in Hytale, live.' : 'Every change shows up in game, live';
const V2 = [
  ['wardrobe', 0.4, 24.6, 3.0],
  ['places', 1.6, 16.2, 2.3],
  ['animations', 0.6, 14.3, 1.8],
  ['combine', 2.0, 17.5, 3.2],
  ['combine', 17.5, 27.5, 1.8],
  ['split', 'live', 'live-game', 1.5, 13.0, 2.4],
  ['split', 'live', 'live-game', 13.0, 22.2, 3.5],
  ['split', 'live', 'live-game', 22.2, 41.5, 2.5],
  ['animate', 2.6, 7.2, 2.2],
  ['animate', 12.9, 23.0, 2.2],
  ['end', 1.6, 6.2, 1],
];
// v3 (2026-11-24): every take in the user's own skin. Site takes only so far; the live split hook and the in-game emote shot go in
// when they are recorded (promo-plan-v3.md)
// the live split (v3 hook): painting starts with the gold pads in game; then the last fill, Done, and the crest in game. The game
// half is a 900x760 crop around the character (the take's camera stands back)
const LIVE_CROP = '900:760:510:150';
const V3 = [
  ['split', 'live', 'live-game', 3.0, 14.0, 2.6, LIVE_CROP],
  // (user 2026-11-24) anything where a character animation plays runs at 1.0x; only UI clicking is sped up, time comes from shorter pieces
  ['split', 'live', 'live-game', 32.8, 38.0, 1.0, LIVE_CROP],
  ['wardrobe', 2.0, 25.0, 2.6],
  // create: open + tools, the painting (one flowing hand), turn + Done, then the pads on the character at 1.0x
  // (the view draws one blank frame on Bigger at 7.033 and on Smaller at 22.7: both skipped)
  ['create', 3.0, 7.02, 3.2],
  ['create', 7.045, 10.4, 3.2],
  ['create', 10.4, 21.3, 2.4],
  ['create', 21.3, 22.69, 3.2],
  ['create', 22.71, 27.7, 3.2],
  ['create', 27.7, 31.6, 1.0],
  ['combine', 7.6, 22.4, 1.6],
  ['record', 9.7, 20.6, 2.4],
  ['record', 20.8, 25.0, 2.8],
  // Play: the recorded wave, then Keep and the keyed playback, at 1.0x
  ['record', 25.0, 31.6, 1.0],
  // the same Big Wave as an emote in Hytale (mod 1.2.1), with a caption and the live tag
  ['emote-game', 0.3, 7.6, 1.0, '...and use them in game'],
  // montage at 1.0x: horse ride, the picture, Desert ride, Fall Far, the walk
  ['montage', 13.0, 15.6, 1.0],
  ['montage', 19.4, 20.9, 1.0],
  ['montage', 24.3, 26.3, 1.0],
  ['montage', 28.6, 30.8, 1.0],
  ['montage', 35.2, 37.4, 1.0],
  ['end', 3.1, 6.8, 1],
];
const v = process.argv[2] === 'v3' ? 'v3' : '';
const CUT = v ? V3 : V2;
const OUT = 'out/hytaledesigner-promo' + (v ? '-' + v : '') + '.mp4';
const FPS = 30;
const ff = args => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args]);
const times = take => JSON.parse(fs.readFileSync(path.resolve('takes', take, 'times.json')));
fs.mkdirSync('out/parts', { recursive: true });

// frames of a take between absolute times t1..t2 -> an mp4 at 30 fps (each frame held until the next one, sped up)
function piece(take, t1, t2, speed, out, vf) {
  const dir = path.resolve('takes', take);
  const rows = times(take).filter(([, t]) => t >= t1 && t <= t2);
  let txt = 'ffconcat version 1.0\n';
  rows.forEach(([n, t], i) => {
    const next = rows[i + 1] ? rows[i + 1][1] : t2;
    txt += `file '${path.join(dir, n + '.jpg').replace(/\\/g, '/')}'\nduration ${(Math.max(next - t, 1 / 240) / speed).toFixed(5)}\n`;
  });
  txt += `file '${path.join(dir, rows.at(-1)[0] + '.jpg').replace(/\\/g, '/')}'\n`;
  fs.writeFileSync(out + '.txt', txt);
  ff([
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    out + '.txt',
    '-vf',
    `fps=${FPS},${vf},format=yuv420p`,
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '14',
    '-r',
    String(FPS),
    out,
  ]);
  return rows.length;
}

const parts = [];
CUT.forEach((c, k) => {
  const out = `out/parts/${k}.mp4`;
  if (c[0] !== 'split') {
    const [take, a, b, speed, caption] = c;
    const t0 = times(take)[0][1];
    const f = p => path.resolve('out', p).replace(/\\/g, '/').replace(':', '\\:');
    // a game take with a caption: the site-style caption box low, and the LIVE GAMEPLAY tag top left
    const capVf = caption
      ? `,drawbox=x=(iw-760)/2:y=880:w=760:h=96:color=0x0d1a2e@0.91:t=fill,drawbox=x=(iw-760)/2:y=880:w=760:h=96:color=0xf4c452:t=3,` +
        `drawtext=fontfile='${f('bold.ttf')}':text='${caption}':fontsize=50:fontcolor=white:x=(w-tw)/2:y=903,` +
        `drawbox=x=40:y=40:w=318:h=58:color=0xd92b2b@0.95:t=fill,drawbox=x=60:y=61:w=16:h=16:color=white:t=fill,` +
        `drawtext=fontfile='${f('bold.ttf')}':text='LIVE GAMEPLAY':fontsize=34:fontcolor=white:x=90:y=52`
      : '';
    const n = piece(take, t0 + a, t0 + b, speed, out, 'scale=1920:1080:flags=lanczos' + capVf);
    console.log(take, n, 'frames ->', ((b - a) / speed).toFixed(1) + 's');
  } else {
    const [, site, game, a, b, speed, crop = 'ih*1280/1080:ih:(iw-ih*1280/1080)/2:0'] = c;
    const t0 = times(site)[0][1];
    // both halves 960x810: the site's 1280x1080 window, and a 1280:1080 crop of the game window around the character
    const s = piece(site, t0 + a, t0 + b, speed, `out/parts/${k}s.mp4`, 'scale=960:810:flags=lanczos');
    const g = piece(game, t0 + a, t0 + b, speed, `out/parts/${k}g.mp4`, `crop=${crop},scale=960:810:flags=lanczos`);
    const font = f => path.resolve('out', f).replace(/\\/g, '/').replace(':', '\\:');
    const label = (t, x) => `drawtext=fontfile='${font('regular.ttf')}':text='${t}':fontsize=34:fontcolor=0xc9d6ea:x=${x}-tw/2:y=1012`;
    ff([
      '-i',
      `out/parts/${k}s.mp4`,
      '-i',
      `out/parts/${k}g.mp4`,
      '-filter_complex',
      `color=c=0x0b1526:s=1920x1080:r=${FPS}[bg];[bg][0]overlay=0:168:shortest=1[a];[a][1]overlay=960:168:shortest=1,` +
        `drawbox=x=958:y=168:w=4:h=810:color=0xf4c452:t=fill,` +
        // a "LIVE GAMEPLAY" tag on the game half (user 2026-11-24): red badge, white dot and text
        `drawbox=x=990:y=192:w=318:h=58:color=0xd92b2b@0.95:t=fill,` +
        `drawbox=x=1010:y=213:w=16:h=16:color=white:t=fill,` +
        `drawtext=fontfile='${font('bold.ttf')}':text='LIVE GAMEPLAY':fontsize=34:fontcolor=white:x=1040:y=204,` +
        `drawtext=fontfile='${font('bold.ttf')}':text='${SPLIT_CAP}':fontsize=60:fontcolor=white:x=(w-tw)/2:y=52,` +
        `drawbox=x=(1920-520)/2:y=136:w=520:h=5:color=0xf4c452:t=fill,` +
        `${label('hytaledesigner.com', 480)},${label('Hytale with the Hytale Designer Sync mod', 1440)},format=yuv420p`,
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '14',
      '-r',
      String(FPS),
      out,
    ]);
    console.log('split', s, '+', g, 'frames ->', ((b - a) / speed).toFixed(1) + 's');
  }
  parts.push(out);
});
fs.writeFileSync('out/parts/all.txt', parts.map(p => `file '${path.resolve(p).replace(/\\/g, '/')}'`).join('\n'));
ff([
  '-f',
  'concat',
  '-safe',
  '0',
  '-i',
  'out/parts/all.txt',
  '-f',
  'lavfi',
  '-i',
  'anullsrc=r=48000:cl=stereo',
  '-vf',
  'fade=in:st=0:d=0.3',
  '-map',
  '0:v',
  '-map',
  '1:a',
  '-shortest',
  '-c:v',
  'libx264',
  '-preset',
  'slow',
  '-crf',
  '18',
  '-profile:v',
  'high',
  '-pix_fmt',
  'yuv420p',
  '-r',
  String(FPS),
  '-c:a',
  'aac',
  '-b:a',
  '128k',
  '-movflags',
  '+faststart',
  OUT,
]);
console.log(
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size', '-of', 'csv=p=0', OUT])
    .toString()
    .trim()
);
