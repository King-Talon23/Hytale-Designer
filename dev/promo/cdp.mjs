// A small driver for a hidden Edge through the DevTools protocol: for recording the site's promo shots.
// The profile lives in dev/promo/profile (git-ignored) so the connected game files stay between runs.
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
export const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function launch({ port = 9340, w = 1920, h = 1080, headless = true } = {}) {
  const dir = path.join(here, 'profile');
  fs.mkdirSync(dir, { recursive: true });
  const args = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${dir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--enable-gpu',
    '--ignore-gpu-blocklist',
    '--use-angle=d3d11',
    `--window-size=${w},${h}`,
    // the live takes reach the mod on 127.0.0.1 from https://hytaledesigner.com: a person allows that in a prompt, headless can't
    '--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessRespectPreflightResults,BlockInsecurePrivateNetworkRequests',
    ...(headless ? ['--headless=new'] : []),
    'about:blank',
  ];
  const proc = spawn(EDGE, args, { stdio: 'ignore' });
  let ver;
  for (let i = 0; i < 100 && !ver; i++) {
    try {
      ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    } catch {
      await sleep(150);
    }
  }
  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise(r => (ws.onopen = r));
  let id = 0;
  const waits = new Map(),
    handlers = [];
  ws.onmessage = m => {
    const d = JSON.parse(m.data);
    if (d.id && waits.has(d.id)) {
      waits.get(d.id)(d);
      waits.delete(d.id);
    } else for (const f of handlers) f(d);
  };
  const send = (method, params = {}, sessionId) =>
    new Promise(r => {
      const i = ++id;
      waits.set(i, r);
      ws.send(JSON.stringify({ id: i, method, params, sessionId }));
    });
  const { result } = await send('Target.createTarget', { url: 'about:blank' });
  const s = (await send('Target.attachToTarget', { targetId: result.targetId, flatten: true })).result.sessionId;
  const call = (m, p) => send(m, p, s);
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  const page = {
    call,
    on: f => handlers.push(f),
    async eval(expr) {
      const r = await call('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true });
      if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'eval failed');
      return r.result?.result?.value;
    },
    async go(url, wait = 4000) {
      await call('Page.navigate', { url });
      await sleep(wait);
    },
    // a real mouse: moves in small steps so hover effects and drags behave as for a person
    async mouse(type, x, y, extra = {}) {
      await call('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: type === 'mouseMoved' ? 0 : 1, ...extra });
    },
    async glide(x0, y0, x1, y1, ms = 400, held = false) {
      const n = Math.max(2, Math.round(ms / 16));
      for (let i = 1; i <= n; i++) {
        const u = i / n,
          e = u * u * (3 - 2 * u);
        await page.mouse('mouseMoved', x0 + (x1 - x0) * e, y0 + (y1 - y0) * e, held ? { buttons: 1 } : {});
        await sleep(ms / n);
      }
    },
    async click(x, y) {
      await page.mouse('mousePressed', x, y);
      await sleep(60);
      await page.mouse('mouseReleased', x, y);
    },
    async box(sel) {
      return page.eval(
        `(() => { const e = ${sel}; if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height }; })()`
      );
    },
    async type(text, ms = 70) {
      for (const ch of text) {
        await call('Input.dispatchKeyEvent', { type: 'keyDown', text: ch });
        await call('Input.dispatchKeyEvent', { type: 'keyUp', text: ch });
        await sleep(ms);
      }
    },
  };
  // screencast: every frame Edge paints, with its time, written as JPEGs into a folder
  page.record = async folder => {
    fs.rmSync(folder, { recursive: true, force: true });
    fs.mkdirSync(folder, { recursive: true });
    const list = [];
    const on = d => {
      if (d.method !== 'Page.screencastFrame' || d.sessionId !== s) return;
      const n = String(list.length).padStart(6, '0');
      fs.writeFileSync(path.join(folder, n + '.jpg'), Buffer.from(d.params.data, 'base64'));
      list.push([n, d.params.metadata.timestamp]);
      call('Page.screencastFrameAck', { sessionId: d.params.sessionId });
    };
    handlers.push(on);
    await call('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: w, maxHeight: h, everyNthFrame: 1 });
    return async () => {
      await call('Page.stopScreencast');
      handlers.splice(handlers.indexOf(on), 1);
      fs.writeFileSync(path.join(folder, 'times.json'), JSON.stringify(list));
      return list;
    };
  };
  page.close = () => {
    try {
      ws.send(JSON.stringify({ id: ++id, method: 'Browser.close' })); /* the whole browser, not just the launcher process */
    } catch {
      /* gone */
    }
    try {
      ws.close();
    } catch {
      /* gone */
    }
    proc.kill();
  };
  return page;
}
