// Connects the player's Assets.zip once in the promo profile (the site keeps it in IndexedDB), then checks the 3D frame rate.
import { launch, sleep } from './cdp.mjs';
const SITE = process.env.SITE || 'http://localhost:8766/';
const ZIP = process.argv[2];
const p = await launch();
try {
  await p.go(SITE, 5000);
  const connected = await p.eval("document.body.innerText.includes('Game files connected')");
  if (!connected) {
    const doc = await p.call('DOM.getDocument', { depth: 1 });
    const q = await p.call('DOM.querySelector', { nodeId: doc.result.root.nodeId, selector: '#zipfile' });
    await p.call('DOM.setFileInputFiles', { nodeId: q.result.nodeId, files: [ZIP] });
    for (let i = 0; i < 240; i++) {
      await sleep(1000);
      if (await p.eval("document.body.innerText.includes('Game files connected')")) break;
    }
  }
  console.log('connected:', await p.eval("document.body.innerText.includes('Game files connected')"));
  const fps = await p.eval(`new Promise(r => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else r(n / 2); }; requestAnimationFrame(f); })`);
  console.log('fps:', fps, 'gpu:', await p.eval("(() => { const c = document.createElement('canvas').getContext('webgl2'); const d = c && c.getExtension('WEBGL_debug_renderer_info'); return d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'unknown'; })()"));
} finally {
  p.close();
}
