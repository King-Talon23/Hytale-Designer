// Records the promo takes on the live site: node record.mjs [take ...]   (no args = all takes)
// Each take is a folder of screencast frames in takes/<name>/ with times.json; cut.mjs makes the video.
// A drawn cursor, click ripples and captions are injected into this browser only (not part of the site).
import { launch, sleep } from './cdp.mjs';
const SITE = process.env.SITE || 'https://hytaledesigner.com/';
const only = process.argv.slice(2);
const p = await launch({ w: +process.env.VW || 1920, h: +process.env.VH || 1080 });

const RESET = `new Promise(r => { const q = indexedDB.open('skin-editor'); q.onsuccess = () => {
  const d = q.result, t = d.transaction(['meta', 'skins', 'assets'], 'readwrite');
  t.objectStore('skins').clear(); t.objectStore('assets').clear();
  const m = t.objectStore('meta'), k = m.getAllKeys();
  k.onsuccess = () => { for (const x of k.result) if (String(x) !== 'game') m.delete(x); };
  t.oncomplete = () => { d.close(); r(1); }; }; })`;

const OVERLAY = `(() => {
  if (window.__promo) return;
  const css = document.createElement('style');
  css.textContent = \`
  #pc{position:fixed;left:0;top:0;z-index:99999;pointer-events:none;width:30px;height:30px;transform:translate(-100px,-100px);filter:drop-shadow(0 2px 3px #0009)}
  .pr{position:fixed;z-index:99998;pointer-events:none;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;border:3px solid #f4c452;animation:pr .45s ease-out forwards}
  @keyframes pr{to{transform:scale(3.4);opacity:0}}
  #pcap{position:fixed;left:1290px;top:118px;z-index:99997;pointer-events:none;transform:translate(-50%,-16px);opacity:0;transition:opacity .35s,transform .35s;
    font:800 46px Lexend,'Segoe UI',sans-serif;letter-spacing:.5px;color:#fff;background:#0d1a2ee8;border:2px solid #f4c452;border-radius:14px;padding:14px 34px;white-space:nowrap;box-shadow:0 10px 40px #0008}
  #pcap.on{opacity:1;transform:translate(-50%,0)} #pcap b{color:#f4c452;font-weight:800}
  #pend{position:fixed;inset:0;z-index:99996;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;opacity:0;transition:opacity .6s;
    background:radial-gradient(ellipse at center,#132845f2,#070e1af8);pointer-events:none;font-family:Lexend,'Segoe UI',sans-serif;color:#fff}
  #pend.on{opacity:1} #pend img{width:200px;height:200px} #pend h1{margin:0;font-size:92px;font-weight:800;letter-spacing:1px}
  #pend h1 b{color:#f4c452} #pend p{margin:0;font-size:40px;font-weight:500;color:#c9d6ea}\`;
  document.head.appendChild(css);
  const c = document.createElement('div'); c.id = 'pc';
  c.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M3 2l17 11-7.5 1.4L16.8 22l-3.2 1.4-3.8-7.5L3 21z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  document.body.appendChild(c);
  const cap = document.createElement('div'); cap.id = 'pcap'; document.body.appendChild(cap);
  const end = document.createElement('div'); end.id = 'pend';
  end.innerHTML = '<img src="/img/icon.svg"><h1>hytale<b>designer</b>.com</h1><p>Free skin and animation studio for Hytale, in your browser</p>';
  document.body.appendChild(end);
  addEventListener('mousemove', e => (c.style.transform = 'translate(' + (e.clientX - 3) + 'px,' + (e.clientY - 2) + 'px)'), true);
  addEventListener('pointermove', e => (c.style.transform = 'translate(' + (e.clientX - 3) + 'px,' + (e.clientY - 2) + 'px)'), true);
  addEventListener('mousedown', e => { const r = document.createElement('div'); r.className = 'pr'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 600); }, true);
  window.__promo = {
    cap(t, x) { if (!t) { cap.classList.remove('on'); return; } cap.innerHTML = t; cap.style.left = (x || 1290) + 'px'; cap.classList.add('on'); },
    end(on) { end.classList.toggle('on', on); },
  };
})()`;

let mx = 1300,
  my = 700;
const find = t =>
  `[...document.querySelectorAll('button,[role=button],a,.tile,.card,label,li,div,span')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.y>=0&&r.y<1080&&r.x<1920&&e.textContent.trim().replace(/\\s+/g,' ').includes(${JSON.stringify(t)})}).sort((a,b)=>a.textContent.length-b.textContent.length)[0]`;
async function where(t) {
  const b = await p.box(t.startsWith('$') ? t.slice(1) : find(t));
  if (!b) throw new Error('not found: ' + t);
  return b;
}
async function move(x, y, ms = 450) {
  await p.glide(mx, my, x, y, ms);
  mx = x;
  my = y;
}
async function click(t, { ms = 450, after = 500, dx = 0, dy = 0 } = {}) {
  const b = await where(t);
  await move(b.x + dx, b.y + dy, ms);
  await sleep(90);
  await p.click(mx, my);
  await sleep(after);
}
async function drag(x0, y0, x1, y1, ms = 900) {
  await move(x0, y0, 350);
  await p.mouse('mousePressed', x0, y0);
  await p.glide(x0, y0, x1, y1, ms, true);
  await p.mouse('mouseReleased', x1, y1);
  mx = x1;
  my = y1;
}
const cap = (t, x) => p.eval(`__promo.cap(${JSON.stringify(t)}, ${x || 0})`);
const btn = t =>
  `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(t)}&&b.getBoundingClientRect().width)`;
const slot = t => `[...document.querySelectorAll('button.slot')].find(b=>b.textContent.includes(${JSON.stringify(t)}))`;
const item = t =>
  typeof t === 'number'
    ? `document.querySelectorAll('button.lcard.t0')[${t}]`
    : `document.querySelector('button.lcard[aria-label=${JSON.stringify(t)}]')`;
const titled = t =>
  `[...document.querySelectorAll('button')].find(b=>(b.title||'').startsWith(${JSON.stringify(t)})&&b.getBoundingClientRect().width)`;
const tab = t => p.eval(`document.querySelector('[data-tab=${t}]').click()`);

async function fresh() {
  await p.call('Page.setBypassCSP', { enabled: true });
  await p.go(SITE + 'privacy.html', 2500);
  await p.eval(RESET);
  await p.eval('localStorage.clear(); sessionStorage.clear()');
  await p.go(SITE, 7000);
  for (let i = 0; i < 60 && !(await p.eval("document.body.innerText.includes('Game files connected')")); i++) await sleep(500);
  await p.eval(OVERLAY);
  await p.eval(btn('New') + '.click()');
  await sleep(1500);
  await p.mouse('mouseMoved', mx, my);
  await sleep(800);
}

// the promo profile joins the Hytale Designer Sync mod (Hytale must be running with it) and shows the outfit in game
async function liveSetup() {
  await tab('wardrobe');
  await sleep(1200);
  await p.eval(btn('Connect to the mod') + '.click()');
  for (let i = 0; i < 30 && (await p.eval('document.getElementById("ingame").hidden')); i++) await sleep(500);
  if (!(await p.eval('document.getElementById("ingame").textContent.includes("on")')))
    await p.eval('document.getElementById("ingame").click()');
  await tab('editor');
  await sleep(+(process.env.LIVE_WAIT || 6000));
}

const takes = {
  // 1. dress the character from the game's own wardrobe
  async wardrobe() {
    await tab('editor');
    await sleep(1200);
    await cap('Build your <b>Hytale</b> skin');
    await sleep(700);
    await click('$' + slot('Haircut'));
    await click('$' + item('Ponytail'), { after: 600 });
    await click('$document.querySelector(".swatches button[title=Black], .swatches button:nth-child(2)")', { after: 500 });
    await click('$' + btn('‹ Wardrobe'), { after: 400 });
    await click('$' + slot('Overtop'));
    await click('$' + item('Arming Jacket'), { after: 600 });
    await click('$' + btn('‹ Wardrobe'), { after: 400 });
    await click('$' + slot('Pants'));
    await click('$' + item(2), { after: 600 });
    await click('$' + btn('‹ Wardrobe'), { after: 400 });
    await click('$' + slot('Shoes'));
    await click('$' + item(1), { after: 900 });
    await click('$' + btn('‹ Wardrobe'), { after: 500 });
    await cap('');
  },
  // 2. places + turning the character
  async places() {
    await cap('See it in the <b>world</b>');
    for (const place of ['Meadow', 'Desert']) {
      await click(
        '$document.querySelector(".bdbtn") || [...document.querySelectorAll("button")].find(b=>/^(Studio|Meadow|Snow|Desert|Jungle)/.test(b.textContent.trim()))',
        { after: 400 }
      );
      await click('$[...document.querySelectorAll(".bdopt")].find(b=>b.textContent.includes("' + place + '"))', { after: 1200 });
      if (place === 'Meadow') {
        await drag(1250, 620, 1600, 630, 1500);
        await sleep(600);
        await click('$' + btn('Front'), { after: 700 });
      }
    }
    await cap('');
  },
  // 3. every animation in the game
  async animations() {
    await click('$document.querySelector("[data-tab=animations]")', { after: 700 });
    await cap('Every <b>animation</b> in the game');
    await click('$' + btn('Emote').replace('b.textContent.trim()===', 'b.textContent.trim().startsWith('), { after: 400 }).catch(() =>
      click('Emote')
    );
    await click('Dance Boogie', { after: 2700 });
    await click('Moves', { after: 400 });
    await click('Sprint', { after: 2900 });
    await cap('');
  },
  // 4. paint your own items
  async create() {
    await click('$document.querySelector("[data-tab=creator]")', { after: 800 });
    await cap('Paint your <b>own items</b>', 1085);
    await click(
      '$[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="Edit a copy").find(b=>b.parentElement.textContent.includes("Arming"))',
      { after: 2600 }
    );
    await click('$document.querySelector("button[title=\'#f4d24a\']")', { after: 400 });
    await click('$' + btn('Symmetry'), { after: 400 });
    const r = await where('$[...document.querySelectorAll("input[type=range]")].find(i=>i.getBoundingClientRect().x>1500)');
    await move(r.x - r.w / 2 + 4, r.y, 400);
    await p.mouse('mousePressed', mx, my);
    await p.glide(mx, my, mx + r.w * 0.28, my, 400, true);
    await p.mouse('mouseReleased', mx + r.w * 0.28, my);
    mx += r.w * 0.28;
    await sleep(300);
    for (const y of [520, 600, 680, 760]) await drag(930, y, 1110, y + 30, 500);
    await sleep(1000);
    await cap('');
  },
  // 4b. combine two game items into one (a monocle + a face mask, worn as one face item)
  async combine() {
    await click('$document.querySelector("[data-tab=creator]")', { after: 800 });
    await cap('<b>Combine</b> items into new ones', 1085);
    await click('$document.querySelector(".anysearch")', { after: 200 });
    await p.type('monocle', 90);
    await sleep(700);
    await click('$[...document.querySelectorAll(".anyitem button")].find(b=>/edit a copy/i.test(b.textContent))', { after: 2600 });
    await click('$' + titled('Move'), { after: 700 });
    await click('$' + titled('Add item'), { after: 900 });
    await p.type('face mask', 90);
    await sleep(700);
    await click('$[...document.querySelectorAll(".combinegrid button")].find(b=>b.textContent.trim()==="Face Mask")', { after: 600 });
    await click('$[...document.querySelectorAll("#dlgbtns button")].find(b=>b.value==="yes")', { after: 1800 });
    await click('$' + btn('Item only'), { after: 1200 });
    await drag(1250, 650, 1450, 620, 1300);
    await sleep(1000);
    await click('$' + btn('Done'), { after: 2200 });
    await cap('');
  },
  // 4c. live in game: the site on the left, Hytale on the right (gamecap.ps1 records the game at the same time; VW=1280)
  async live() {
    await tab('editor');
    await sleep(1500);
    await click('$' + slot('Haircut'));
    await click('$' + item('Ponytail'), { after: 600 });
    await click('$document.querySelector(".swatches button[title=Black], .swatches button:nth-child(2)")', { after: 2200 });
    await click('$' + btn('‹ Wardrobe'), { after: 400 });
    await click('$' + slot('Overtop'));
    await click('$' + item('Arming Jacket'), { after: 3000 });
    await click('$' + btn('‹ Wardrobe'), { after: 400 });
    await click('$document.querySelector("[data-tab=creator]")', { after: 800 });
    await click(
      '$[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="Edit a copy").find(b=>b.parentElement.textContent.includes("Arming"))',
      { after: 2600 }
    );
    await click('$document.querySelector("button[title=\'#f4d24a\']")', { after: 400 });
    await click('$' + btn('Symmetry'), { after: 400 });
    const r = await where('$[...document.querySelectorAll("input[type=range]")].find(i=>i.getBoundingClientRect().x>900)');
    await move(r.x - r.w / 2 + 4, r.y, 400);
    await p.mouse('mousePressed', mx, my);
    await p.glide(mx, my, mx + r.w * 0.28, my, 400, true);
    await p.mouse('mouseReleased', mx + r.w * 0.28, my);
    mx += r.w * 0.28;
    await sleep(300);
    const c = await where('$document.getElementById("view")').catch(() => ({ x: 640, y: 560 }));
    for (const dy of [-40, 20, 80]) await drag(c.x - 90, c.y + dy, c.x + 90, c.y + dy + 25, 600);
    await sleep(4000);
    await click('$' + btn('Done'), { after: 4000 });
  },
  // 5. make your own animations
  async animate() {
    await click('$document.querySelector("[data-tab=animate]")', { after: 800 });
    await click('$' + btn('Front'), { after: 500 });
    await cap('Make your own <b>animations</b>');
    await click('Start from a game move', { after: 600 });
    await click('$[...document.querySelectorAll("input")].find(i=>i.placeholder==="Search"&&i.getBoundingClientRect().width)', {
      after: 200,
    });
    await p.type('wave', 110);
    await sleep(500);
    await click('$[...document.querySelectorAll("span")].find(e=>e.textContent.trim()==="Wave"&&e.getBoundingClientRect().width)', {
      after: 1500,
    });
    await click('$' + btn('Front'), { after: 900 });
    await move(1200, 560, 500);
    await p.click(1200, 560);
    await sleep(900);
    await drag(1205, 512, 1330, 400, 1000);
    await sleep(700);
    await click(
      '$[...document.querySelectorAll("button")].find(b=>/^play$/i.test(b.getAttribute("aria-label")||b.title||"")) || [...document.querySelectorAll("button")].find(b=>b.textContent.trim()==="▶")',
      { after: 2800 }
    ).catch(() => sleep(2800));
    await cap('');
  },
  // 6. randomize a few looks
  async randomize() {
    await click('$document.querySelector("[data-tab=editor]")', { after: 700 });
    await cap('Endless looks, one click');
    for (let i = 0; i < 4; i++) await click('$' + btn('Randomize'), { ms: i ? 120 : 450, after: 900 });
    await cap('');
  },
  // 7. end card
  async end() {
    await click('$document.querySelector("[data-tab=animations]")', { after: 500 });
    await move(1990, 600, 300);
    await p.eval("document.getElementById('pc').style.display = 'none'; __promo.end(true)");
    await sleep(4200);
  },
};

try {
  await fresh();
  for (const [name, fn] of Object.entries(takes)) {
    if (only.length && !only.includes(name)) continue;
    if (name === 'live') await liveSetup();
    const stop = await p.record('takes/' + name);
    await sleep(300);
    try {
      await fn();
    } catch (e) {
      console.log(name, 'FAILED:', e.message);
    }
    await sleep(300);
    const n = (await stop()).length;
    console.log(name, n, 'frames');
  }
} finally {
  p.close();
}
