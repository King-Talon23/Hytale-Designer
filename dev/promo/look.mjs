// Screenshots of the site's tabs at 1920x1080 in the promo profile, for planning shots: node look.mjs <tab> [js to run first]
import fs from 'fs';
import { launch, sleep } from './cdp.mjs';
const SITE = process.env.SITE || 'http://localhost:8766/';
const [tab = 'editor', js = ''] = process.argv.slice(2);
const p = await launch();
try {
  await p.go(SITE, 5000);
  await p.eval(`document.querySelector('[data-tab=${tab}]')?.click()`);
  await sleep(2500);
  if (js) {
    await p.eval(js);
    await sleep(2500);
  }
  const shot = await p.call('Page.captureScreenshot', { format: 'png' });
  fs.mkdirSync('dev/promo/out', { recursive: true });
  fs.writeFileSync(`dev/promo/out/look-${tab}.png`, Buffer.from(shot.result.data, 'base64'));
  console.log(await p.eval(`JSON.stringify([...document.querySelectorAll('button, [role=button], .tile, select')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.y < 1080 && r.y > 0; }).map(e => { const r = e.getBoundingClientRect(); return (e.textContent.trim().slice(0, 22) || e.getAttribute('aria-label') || e.className.slice(0, 20)) + '@' + Math.round(r.x + r.width / 2) + ',' + Math.round(r.y + r.height / 2); }).slice(0, 120))`));
} finally {
  p.close();
}
