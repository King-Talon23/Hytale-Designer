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
// (user 2026-11-24: 'the live gameplay should be a little more zoomed out') was 900:760:510:150
const LIVE_CROP = '1100:928:410:66';
const V3 = [
  // (take of 2026-11-24 13:40) the game shows the gold pads until 12.65, drops them while the item saves, and shows the crest from 23.66
  // (one blank site frame on Bigger at 6.767 skipped)
  ['split', 'live', 'live-game', 3.0, 6.76, 2.6, LIVE_CROP],
  ['split', 'live', 'live-game', 6.775, 12.6, 2.6, LIVE_CROP],
  // (user 2026-11-24) anything where a character animation plays runs at 1.0x; only UI clicking is sped up, time comes from shorter pieces
  ['split', 'live', 'live-game', 22.6, 28.4, 1.0, LIVE_CROP],
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
  // (takes re-recorded 2026-11-24 evening against the changed site; V3's other pieces still hold the older takes' times)
  ['record', 9.55, 20.45, 2.4],
  ['record', 20.6, 24.85, 2.8],
  // Play: the recorded wave, then Keep and the keyed playback, at 1.0x
  ['record', 24.85, 31.4, 1.0],
  // the same Big Wave as an emote in Hytale (mod 1.2.1), with a caption and the live tag
  ['emote-game', 0.3, 7.6, 1.0, '...and use them in game'],
  // montage at 1.0x: horse ride, the picture, Desert ride, Fall Far, the walk
  ['montage', 13.0, 15.6, 1.0],
  ['montage', 19.4, 20.9, 1.0],
  ['montage', 24.3, 26.3, 1.0],
  ['montage', 28.6, 30.8, 1.0],
  ['montage', 35.2, 37.4, 1.0],
  ['end', 3.18, 6.88, 1],
];
// v4 (user 2026-11-24): open on what the game's own editor can't do. Hook: My skins (up to 45) and one click swapping the WHOLE
// outfit in Hytale (take liveSwap, 1:1 time, one look per piece: each starts on the shelf just before the card click; the game
// follows ~1.25 s later). The live paint split moves into the painting section, after the create take's turn. Wardrobe flip dropped
// (the in-game editor has it). Split pieces: ['split', site, game, from, to, speed, crop, caption]
const SWAP_CROP = '1230:1038:350:10', // was 1066:900:432:40 (zoomed out, user 2026-11-24)
  SWAP_CAP = 'Save up to 45 skins. Swap them in game, live.',
  PAINT_CAP = 'Updates live in Hytale';
const V4 = [
  // the shelf (16 / 45), then Pirate Captain (site 5.48, game 6.16)
  ['split', 'liveSwap', 'live-swap-game', 3.48, 7.38, 1.0, SWAP_CROP, SWAP_CAP],
  // Viking (10.60 / 11.21), Witch (15.70 / 16.30), Royal (20.77 / 21.35), Street (25.87 / 26.46); every swap is in, or the game
  // half would jump between looks at a cut
  ['split', 'liveSwap', 'live-swap-game', 10.1, 12.5, 1.0, SWAP_CROP, SWAP_CAP],
  ['split', 'liveSwap', 'live-swap-game', 15.2, 17.52, 1.0, SWAP_CROP, SWAP_CAP],
  ['split', 'liveSwap', 'live-swap-game', 20.27, 22.5, 1.0, SWAP_CROP, SWAP_CAP],
  ['split', 'liveSwap', 'live-swap-game', 25.37, 27.75, 1.0, SWAP_CROP, SWAP_CAP],
  // create: open + tools, the painting (one flowing hand), the turn; blank frames on Bigger (7.183) and Smaller (24.6) skipped;
  // it ends before Done (29.5): the split takes over from the same moment of the live take
  ['create', 3.0, 7.17, 3.2],
  ['create', 7.195, 10.55, 3.2],
  ['create', 10.55, 23.4, 2.4],
  ['create', 23.4, 24.59, 3.2],
  ['create', 24.61, 29.3, 3.2],
  // the live take: the crest on the knees in Hytale (23.36), Done (23.85), 1.0x (the site view draws a half frame and a blank
  // one after Done, 23.866 and 23.883: skipped)
  ['split', 'live', 'live-game', 22.55, 23.86, 1.0, LIVE_CROP, PAINT_CAP],
  ['split', 'live', 'live-game', 23.895, 28.37, 1.0, LIVE_CROP, PAINT_CAP],
  // (user 2026-11-24: "remove the Ride, Walk, Explore, Share section") no montage
  ...V3.slice(V3.findIndex(c => c[0] === 'combine')).filter(c => c[0] !== 'montage'),
];
// v5 (user 2026-11-24: "make your own version of my monocle with mask to show how it's done"): the combine is made on camera
// (take combineMake): Edit a copy of the Monocle, Add item... Ragged Bandana, the monocle brought just in front of the mask (Z 16.6),
// name, Done, worn. The half-drawn and the empty view right after Done (24.483, 24.5) are skipped. From Done on the character is
// shown (idle animation), so 1.0x
// (user 2026-11-24: "show the custom asset being worn live in game") after the Add, the live take (liveCombine, the same steps with
// Hytale alongside): the mask arrives on the character in game at 17.3 while the monocle is moved forward on the site; Done at 21.77,
// the game reloads the item at 23.7, then shows the finished item from the front
const COMBINE_CROP = '1230:1038:300:10',
  COMBINE_CAP = 'Combine items into new ones',
  NEW_CAP = 'Your own new item';
const COMBINE = [
  ['combineMake', 2.0, 7.82, 3.0],
  ['combineMake', 7.833, 13.64, 2.4],
  ['split', 'liveCombine', 'live-combine-game', 16.6, 19.6, 1.0, COMBINE_CROP, COMBINE_CAP],
  ['split', 'liveCombine', 'live-combine-game', 27.0, 29.5, 1.0, COMBINE_CROP, NEW_CAP],
];
// (user 2026-11-24: "a quick part where you show the changing of studio environments, there's a cool blockwave animation now") take
// backdrops: Flower Forest (menu shut 5.0, wave 5.4-6.3), Red Desert (12.85, 13.0-14.0), Glacier (20.5, 20.6-21.9), Lava Wastes
// (28.3, 28.4-29.8). The idle plays throughout, so 1.0x; the menu waits between clicks are cut out
const BIOMES = [
  ['backdrops', 4.6, 6.8, 1.0],
  ['backdrops', 12.85, 14.5, 1.0],
  ['backdrops', 20.45, 22.1, 1.0],
  ['backdrops', 28.3, 30.4, 1.0],
];
const V5 = V4.flatMap(c => (c[0] === 'combine' ? COMBINE : c[0] === 'end' ? [...BIOMES, c] : [c]));
// x15 (user 2026-11-24: "a 15 second cut for X, the first 12 seconds can be cut"): no 45-skins hook; paint -> live in game, the
// combine, animation -> emote in game, end card. UI is sped, every character animation at 1.0x
const X15 = [
  ['create', 10.55, 23.4, 5.9],
  ['split', 'live', 'live-game', 22.55, 23.86, 1.0, LIVE_CROP, PAINT_CAP],
  ['split', 'live', 'live-game', 23.895, 25.57, 1.0, LIVE_CROP, PAINT_CAP],
  ['combineMake', 6.37, 7.82, 3.0],
  ['combineMake', 7.833, 13.64, 4.5],
  ['split', 'liveCombine', 'live-combine-game', 16.9, 18.9, 1.0, COMBINE_CROP, COMBINE_CAP],
  ['split', 'liveCombine', 'live-combine-game', 27.2, 28.6, 1.0, COMBINE_CROP, NEW_CAP],
  ['record', 24.85, 25.85, 1.0],
  ['emote-game', 0.3, 2.8, 1.0, '...and use them in game'],
  // (user 2026-11-24: biome beat in the X cut too, ~18 s) two waves: Red Desert, Glacier
  ['backdrops', 12.85, 14.2, 1.0],
  ['backdrops', 20.45, 21.95, 1.0],
  ['end', 3.18, 4.58, 1],
];
const v = ['v3', 'v4', 'v5', 'x15'].includes(process.argv[2]) ? process.argv[2] : '';
const CUT = { v3: V3, v4: V4, v5: V5, x15: X15 }[v] || V2;
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
    const [, site, game, a, b, speed, crop = 'ih*1280/1080:ih:(iw-ih*1280/1080)/2:0', splitCap = SPLIT_CAP] = c;
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
        `drawtext=fontfile='${font('bold.ttf')}':text='${splitCap}':fontsize=60:fontcolor=white:x=(w-tw)/2:y=52,` +
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
console.log(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size', '-of', 'csv=p=0', OUT]).toString().trim());
