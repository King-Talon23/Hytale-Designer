// Planning helper: run steps on the live site and save a small screenshot after each.
// node explore.mjs name "step1" "step2" ...   a step is JS, or "click:<visible text>", or "wait:<ms>"
import fs from 'fs';
import { execFileSync } from 'child_process';
import { launch, sleep } from './cdp.mjs';
const SITE = process.env.SITE || 'https://hytaledesigner.com/';
const [name, ...steps] = process.argv.slice(2);
const p = await launch({ w: +process.env.VW || 1920, h: +process.env.VH || 1080 });
const find = t =>
  `[...document.querySelectorAll('button,[role=button],a,.tile,.card,label,li,div')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.y>=0&&r.y<1080&&e.textContent.trim().replace(/\\s+/g,' ').includes(${JSON.stringify(t)})}).sort((a,b)=>a.textContent.length-b.textContent.length)[0]`;
try {
  await p.go(SITE, 6000);
  let i = 0;
  for (const s of steps) {
    if (s.startsWith('wait:')) await sleep(+s.slice(5));
    else if (s.startsWith('click:')) {
      const b = await p.box(find(s.slice(6)));
      if (!b) console.log('NOT FOUND', s);
      else {
        await p.click(b.x, b.y);
        console.log('clicked', s, Math.round(b.x), Math.round(b.y));
      }
      await sleep(1500);
    } else console.log(String(await p.eval(s)).slice(0, 2500));
    const shot = await p.call('Page.captureScreenshot', { format: 'png' });
    const f = `out/x-${name}-${i}.png`;
    fs.writeFileSync(f, Buffer.from(shot.result.data, 'base64'));
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', f, '-vf', 'scale=960:-1', f.replace('.png', '.jpg')]);
    fs.rmSync(f);
    i++;
  }
} finally {
  p.close();
}
