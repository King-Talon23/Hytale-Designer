// Records the promo takes on the live site: node record.mjs [take ...]   (no args = all takes; +take runs one unrecorded)
// Each take is a folder of screencast frames in takes/<name>/ with times.json; cut.mjs makes the video.
// A drawn cursor, click ripples and captions are injected into this browser only (not part of the site).
import fs from 'fs';
import path from 'path';
import { launch, sleep } from './cdp.mjs';
const SITE = process.env.SITE || 'https://hytaledesigner.com/';
const only = process.argv.slice(2);
const p = await launch({ w: +process.env.VW || 1920, h: +process.env.VH || 1080 });

// every take starts from the user's own Hytale skin (their in-game look, from Hytale's skin cache, user 2026-11-23): one place to swap it
const USER_SKIN = {
  name: 'KingTalon23',
  skin: {
    bodyCharacteristic: 'Muscular.30',
    underwear: 'Boxer.Blue',
    face: 'Face_Aged',
    ears: 'Elf_Ears',
    mouth: 'Mouth_Orc',
    haircut: 'SuperSlickback.Brown',
    facialHair: 'Beard_Anchor.Brown',
    eyebrows: 'Large.Brown',
    eyes: 'Plain_Eyes.White',
    pants: 'Voidbearer_Pants.Brown',
    overpants: 'KneePads.Gold_Red',
    undertop: 'Voidbearer_CursedArm.Purple',
    overtop: 'Voidbearer_Top.Red',
    shoes: 'Sneakers_Wasteland_Marauder.Black',
    headAccessory: 'ExplorerGoggles.Red',
    faceAccessory: 'Glasses_Monocle.Red',
    gloves: 'Gloves_Wasteland_Marauder.Brown',
    cape: 'Cape_Blazen_Wizard.Red.Neck_Piece',
  },
};

// the user's own custom assets (user 2026-11-23: their "Monocle with mask"), as the site imports them from a skins folder. Copied by
// hand from Documents\Hytale Skins\Custom assets into takes/user-assets; the promo never connects or writes that folder
const USER_ASSETS = 'takes/user-assets';
const userAssets = (fs.existsSync(USER_ASSETS) ? fs.readdirSync(USER_ASSETS) : [])
  .filter(f => f.endsWith('.json'))
  .map(f => {
    const m = JSON.parse(fs.readFileSync(path.join(USER_ASSETS, f), 'utf8')),
      shape = path.join(USER_ASSETS, f.replace(/\.json$/, '.blockymodel'));
    return {
      id: m.id,
      name: m.name,
      field: m.field,
      baseId: m.baseId,
      model: m.model,
      w: m.w,
      h: m.h,
      split: !!m.split,
      labels: m.labels,
      shape: fs.existsSync(shape) ? fs.readFileSync(shape, 'utf8') : undefined,
      png: fs.readFileSync(path.join(USER_ASSETS, f.replace(/\.json$/, '.png'))).toString('base64'),
    };
  });

// (v4) saved looks for the My skins shelf and the live swap: whole outfits of free game items (checked with the site's fit())
const PRESETS = JSON.parse(fs.readFileSync('presets.json', 'utf8'));

// clears the promo profile's site data (keeps the connected game files), puts the user's skin in My skins, worn, the PRESETS after
// it, and their assets in
const RESET = `new Promise(r => { const q = indexedDB.open('skin-editor'); q.onsuccess = () => {
  const d = q.result, t = d.transaction(['meta', 'skins', 'assets'], 'readwrite');
  t.objectStore('skins').clear(); t.objectStore('assets').clear();
  for (const { png, ...a } of ${JSON.stringify(userAssets)})
    t.objectStore('assets').put({ ...a, data: new Blob([Uint8Array.from(atob(png), c => c.charCodeAt(0))], { type: 'image/png' }), updated: Date.now() }, a.id);
  const m = t.objectStore('meta'), k = m.getAllKeys(), u = ${JSON.stringify(USER_SKIN)}, now = Date.now();
  k.onsuccess = () => {
    for (const x of k.result) if (String(x) !== 'game') m.delete(x);
    t.objectStore('skins').put({ id: 'promo-user', kind: 'custom', name: u.name, skin: u.skin, updated: now }, 'promo-user');
    // stamped ahead of the skins the connected folder brings in, so the shelf starts with them
    ${JSON.stringify(PRESETS)}.forEach((l, i) => t.objectStore('skins').put({ id: 'promo-' + i, kind: 'custom', name: l.name, skin: l.skin, updated: now + 864e5 - 1000 * i }, 'promo-' + i));
    m.put({ id: 'promo-user', kind: 'custom', slot: null, name: u.name, skin: u.skin, auto: false, random: false, t: now }, 'draft');
  };
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
    cap(t, x, y) { if (!t) { cap.classList.remove('on'); return; } cap.innerHTML = t; cap.style.left = (x || 1290) + 'px'; cap.style.top = (y || 118) + 'px'; cap.classList.add('on'); },
    end(on) { end.classList.toggle('on', on); },
    pic(src) {
      document.getElementById('ppic')?.remove();
      if (!src) return;
      const d = document.createElement('div');
      d.id = 'ppic';
      d.style.cssText = 'position:fixed;right:70px;top:190px;z-index:99997;pointer-events:none;width:380px;height:380px;border:2px solid #f4c452;border-radius:14px;box-shadow:0 10px 40px #0008;opacity:0;transform:scale(.9);transition:opacity .3s,transform .3s;background:#fff url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27%3E%3Crect width=%2712%27 height=%2712%27 fill=%27%23ccc%27/%3E%3Crect x=%2712%27 y=%2712%27 width=%2712%27 height=%2712%27 fill=%27%23ccc%27/%3E%3C/svg%3E");background-size:24px';
      d.innerHTML = '<img src="' + src + '" style="width:100%;height:100%;object-fit:contain">';
      document.body.appendChild(d);
      requestAnimationFrame(() => requestAnimationFrame(() => { d.style.opacity = 1; d.style.transform = 'none'; }));
    },
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
// a held drag through points in turn, ms per leg (a gizmo ring turns by how far the mouse goes along the ring's tangent at the grab point)
async function heldPath(pts, ms = 450) {
  await move(pts[0][0], pts[0][1], 350);
  await sleep(120);
  await p.mouse('mousePressed', mx, my);
  for (let i = 1; i < pts.length; i++) await p.glide(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], ms, true);
  [mx, my] = pts.at(-1);
  await p.mouse('mouseReleased', mx, my);
}
const KEYS = { w: 87, a: 65, s: 83, d: 68, ' ': 32, ArrowUp: 38 };
const keyEv = (type, k) =>
  p.call('Input.dispatchKeyEvent', {
    type,
    key: k,
    code: k === ' ' ? 'Space' : k.length === 1 ? 'Key' + k.toUpperCase() : k,
    windowsVirtualKeyCode: KEYS[k],
    ...(type === 'keyDown' && k.length === 1 ? { text: k } : {}),
  });
async function hold(keys, ms) {
  for (const k of keys) await keyEv(k.length === 1 ? 'keyDown' : 'rawKeyDown', k);
  await sleep(ms);
  for (const k of keys) await keyEv('keyUp', k);
}
// captions over the whole character go LOW: the top spot covers the head
const LOW = 880,
  BAR = 935; // under the play bar of the Animations and Animate tabs, between Front and Save as
const cap = (t, x, y) => p.eval(`__promo.cap(${JSON.stringify(t)}, ${x || 0}, ${y || 0})`);
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
  // the live site's /app files come with max-age=14400 (Cloudflare), so a fresh deploy would not reach this profile for hours
  await p.call('Network.clearBrowserCache').catch(() => {});
  await p.go(SITE + 'privacy.html', 2500);
  await p.eval(RESET);
  await p.eval('localStorage.clear(); sessionStorage.clear()');
  await p.go(SITE, 7000);
  for (let i = 0; i < 60 && !(await p.eval("document.body.innerText.includes('Game files connected')")); i++) await sleep(500);
  await p.eval(OVERLAY);
  await sleep(1500);
  await p.mouse('mouseMoved', mx, my);
  await sleep(800);
}

// the promo profile joins the Hytale Designer Sync mod (Hytale must be running with it) and shows the outfit in game
let joined = false;
async function liveSetup() {
  if (joined) return;
  joined = true;
  await tab('wardrobe');
  await sleep(1200);
  await p.eval(btn('Connect to the mod') + '.click()');
  for (let i = 0; i < 30 && (await p.eval('document.getElementById("ingame").hidden')); i++) await sleep(500);
  if (!(await p.eval('document.getElementById("ingame").textContent.includes("on")')))
    await p.eval('document.getElementById("ingame").click()');
  await tab('editor');
  await sleep(+(process.env.LIVE_WAIT || 6000));
}

// a crest on the Kneepads' knee block front, painted on the big texture view (both knees share it): dark base, gold border, a red
// diamond outlined in gold. The front is texture pixels x 18-28, y 14-23 (11 x 10); px(c, r) is a pixel of it on screen.
// Needs the Kneepads copy open in the Creator; leaves the texture view big and the Fill tool on
async function crest() {
  await click('$' + btn('Bigger'), { after: 700 });
  const T = await where('$[...document.querySelectorAll("canvas")].find(c=>c.width===32&&c.getBoundingClientRect().width)');
  const s = T.w / 32,
    px = (c, r) => [T.x - T.w / 2 + (18 + c + 0.5) * s, T.y - T.h / 2 + (14 + r + 0.5) * s];
  // one flowing hand (user 2026-11-24: no pauses): glide time follows the distance, a click is a quick tap with no wait after,
  // and the strokes are chained (each starts where the last ended, the button only lifts and presses again)
  const glideTo = (x, y) => move(x, y, Math.round(Math.min(420, Math.max(160, Math.hypot(x - mx, y - my) * 0.5))));
  const tap = async sel => {
    const b = await where('$' + sel);
    await glideTo(b.x, b.y);
    await p.mouse('mousePressed', mx, my);
    await sleep(40);
    await p.mouse('mouseReleased', mx, my);
    await sleep(40);
  };
  const colour = c => tap(`document.querySelector("button[title='${c}']")`);
  const strokes = async (pts, ms = 260) => {
    await glideTo(...px(...pts[0]));
    for (let i = 1; i < pts.length; i++) {
      await p.mouse('mousePressed', mx, my);
      await p.glide(mx, my, ...px(...pts[i]), ms, true);
      [mx, my] = px(...pts[i]);
      await p.mouse('mouseReleased', mx, my);
      await sleep(30);
    }
  };
  await tap(btn('More'));
  await tap(titled('Filled'));
  await colour('#502002');
  await strokes(
    [
      [0, 0],
      [10, 9],
    ],
    480
  );
  await tap(titled('Rectangle'));
  await colour('#f4cc17');
  await strokes(
    [
      [0, 0],
      [10, 9],
    ],
    480
  );
  await tap(titled('Line'));
  await strokes([
    [5, 2],
    [8, 5],
    [5, 8],
    [2, 5],
    [5, 2],
  ]);
  await tap(titled('Fill'));
  await colour('#e23b3b');
  await glideTo(...px(5, 5));
  await p.click(mx, my);
  await sleep(900);
}

const takes = {
  // 1. dress the character from the game's own wardrobe
  async wardrobe() {
    await tab('editor');
    await sleep(1200);
    await cap('Build your <b>Hytale</b> skin', 0, LOW);
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
    await cap('See it in the <b>world</b>', 0, LOW);
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
  // 4. paint a crest on one of the user's own items, their Kneepads (v3; their Voidbearer top is a paid item, which can't be copied),
  // turn it, then Done shows it on the character (user 2026-11-24: paint something that looks nice; the Shape part was dropped)
  async create() {
    await click('$document.querySelector("[data-tab=creator]")', { after: 800 });
    await cap('Paint your own <b>designs</b>', 1085);
    await click(
      '$[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="Edit a copy").find(b=>b.parentElement.textContent.includes("Kneepads"))',
      { after: 2400 }
    );
    await crest();
    await click('$' + btn('Smaller'), { after: 700 });
    // turn the view with the right button (the left one paints while a paint tool is on)
    await move(1250, 640, 350);
    await p.mouse('mousePressed', mx, my, { button: 'right' });
    for (let i = 1; i <= 40; i++) {
      const e = 0.5 - Math.cos((Math.PI * i) / 40) / 2;
      await p.mouse('mouseMoved', 1250 + 170 * e, 640 - 10 * e, { button: 'right', buttons: 2 });
      await sleep(26);
    }
    await p.mouse('mouseReleased', 1420, 630, { button: 'right' });
    mx = 1420;
    my = 630;
    await sleep(500);
    // Done: the new pads on the character, one notch closer (the caption goes first: it would sit on the head)
    await cap('');
    await click('$' + btn('Done'), { after: 700 });
    await click('$' + btn('Front'), { after: 700 });
    await move(1290, 560, 350);
    await p.call('Input.dispatchMouseEvent', { type: 'mouseWheel', x: mx, y: my, deltaX: 0, deltaY: -120 });
    await sleep(2200);
    await cap('');
  },
  // 4b. combine (v3, user 2026-11-23/24): the Ragged Bandana alone (the mask in their asset), the Monocle alone, then the user's own combined "Monocle with mask"
  // (their asset, seeded from USER_ASSETS), close on the face. Hovering a card previews it on the character, so the items are found
  // with Search (each lands in the first card) and the cursor goes round under the row to their asset
  async combine() {
    const search = async text => {
      await click('$[...document.querySelectorAll("input")].find(i=>i.placeholder==="Search"&&i.getBoundingClientRect().width)', {
        after: 150,
      });
      await p.eval('document.activeElement.select()');
      await p.type(text, 85);
      await sleep(600);
    };
    await tab('editor');
    await sleep(900);
    await move(1260, 330, 450);
    for (let i = 0; i < 2; i++) {
      await p.call('Input.dispatchMouseEvent', { type: 'mouseWheel', x: mx, y: my, deltaX: 0, deltaY: -120 });
      await sleep(160);
    }
    await sleep(300);
    await cap('<b>Combine</b> items into new ones', 0, LOW);
    await click('$' + slot('Face Accessory'), { after: 150 });
    await search('ragged');
    await click('$' + item('Ragged Bandana'), { after: 1500 });
    await search('monocle');
    await click('$' + item('Monocle'), { after: 1500 });
    const own = await where('$' + item('Monocle with mask'));
    await move(mx, own.y + own.h / 2 + 28, 250);
    await move(own.x, own.y + own.h / 2 + 28, 450);
    await click('$' + item('Monocle with mask'), { ms: 250, after: 2000 });
    await drag(1180, 560, 1290, 556, 1100);
    await sleep(900);
    await cap('');
  },
  // 4b'. combine made on camera (v5, user 2026-11-24: "make your own version of my monocle with mask to show how it's done"): Edit a
  // copy of their Monocle, Move tool, Add item... Ragged Bandana (the mask in their asset; both free), name it, Done, then worn and
  // close on the face with a small orbit
  async combineMake() {
    await click('$document.querySelector("[data-tab=creator]")', { after: 800 });
    await cap('<b>Combine</b> items into new ones', 1085);
    await click(
      '$[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="Edit a copy").find(b=>b.parentElement.textContent.includes("Monocle"))',
      { after: 1600 }
    );
    await click('$' + titled('Move'), { after: 500 });
    await click('$document.querySelector("button[aria-label=\'Add item\']")', { after: 700 });
    await click('$document.querySelector("#dlg input[placeholder=Search]")', { after: 150 });
    await p.type('ragged', 85);
    await sleep(500);
    await click('$[...document.querySelectorAll("#dlg .skin")].find(b=>b.textContent.trim()==="Ragged Bandana")', { after: 400 });
    await click('$[...document.querySelectorAll("#dlgbtns button")].find(b=>b.value==="yes")', { after: 2200 });
    // (user 2026-11-24) the monocle sits just in front of the mask: Glasses front from Z 15.1 to 16.6 (the mask's top edge covered
    // its lower rim)
    await click('$[...document.querySelectorAll(".partrow")].find(r=>r.textContent.includes("Glasses front")).querySelector("button")', {
      after: 600,
    });
    await click(
      '$[...document.querySelectorAll("input")].find(x=>{const r=x.getBoundingClientRect();return r.width&&r.x>1780&&r.x<1840&&r.y>480&&r.y<540})',
      { after: 150 }
    );
    await p.eval('document.activeElement.select()');
    await p.type('16.6', 110);
    await p.eval('document.activeElement.blur()');
    await sleep(1000);
    await click('$document.querySelector("input[aria-label=Name], input[placeholder=Name]")', { after: 150 });
    await p.eval('document.activeElement.select()');
    // (their own "Monocle with mask" is in the profile too, so the same name would come out as "... 2")
    await p.type('Masked Monocle', 70);
    await p.eval('document.activeElement.blur()');
    await sleep(500);
    await cap('');
    // Done flies the view out from the face to the whole character; then four notches in (more puts the head out of frame)
    await click('$' + btn('Done'), { after: 1800 });
    await move(1280, 250, 450);
    for (let i = 0; i < 4; i++) {
      await p.call('Input.dispatchMouseEvent', { type: 'mouseWheel', x: mx, y: my, deltaX: 0, deltaY: -120 });
      await sleep(300);
    }
    await cap('Your own <b>new item</b>', 0, LOW);
    await sleep(900);
    await drag(1180, 560, 1290, 556, 1100);
    await sleep(1200);
    await cap('');
  },
  // 4c. live in game: the site on the left, Hytale on the right (gamecap.ps1 records the game at the same time; VW=1280)
  // joins the mod and does nothing else: node record.mjs +liveJoin +record saves "Big Wave" into the skins folder through the mod
  async liveJoin() {},
  // run unrecorded first (node record.mjs +livePrep live): makes the Kneepads copy and sends it to the game. While a brand-new copy
  // is open, the game's outfit points at an item it doesn't have yet and the legs show bare until Done (mod-side, 2026-11-24)
  async livePrep() {
    await click('$document.querySelector("[data-tab=creator]")', { after: 800 });
    await click(
      '$[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="Edit a copy").find(b=>b.parentElement.textContent.includes("Kneepads"))',
      { after: 2400 }
    );
    await click('$' + btn('Done'), { after: 9000 });
  },
  // (v3) the same crest as the create take, painted on the user's Kneepads copy while the game shows their knees; Done sends it in
  async live() {
    await click('$document.querySelector("[data-tab=creator]")', { after: 800 });
    await click(
      '$[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="Edit"&&b.getBoundingClientRect().width).find(b=>b.parentElement.parentElement.textContent.includes("Kneepads"))',
      { after: 2400 }
    );
    await crest();
    await click('$' + btn('Smaller'), { after: 600 });
    await click('$' + btn('Done'), { after: 9000 });
  },
  // (v4 hook, user 2026-11-24: "up to 45 presets + the live swap of complete skins") the Locker's My skins shelf (the PRESETS), then
  // one click per saved look: the whole outfit changes on the site and in Hytale. A card opens the look in the Wardrobe tab, so the
  // Locker tab is clicked again before the next one. Ends back in the user's own skin.
  // VW=1280 node record.mjs liveSwap, with gamecap.ps1 live-swap-game alongside
  async liveSwap() {
    const card = id => `document.querySelector('.shelf.custom .skin[data-rid="${id}"]')`;
    await sleep(1200);
    await click('$document.querySelector("[data-tab=wardrobe]")', { after: 1600 });
    for (const id of ['promo-0', 'promo-3', 'promo-1', 'promo-7', 'promo-4', 'promo-user']) {
      await click('$' + card(id), { after: id === 'promo-user' ? 3000 : 2600 });
      if (id !== 'promo-user') await click('$document.querySelector("[data-tab=wardrobe]")', { ms: 350, after: 500 });
    }
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
  // 5b. Record (v3): a blank animation named "Big Wave", the right arm raised and waved with its ring while the clock runs,
  // Stop, Smooth in Trim, Play, Keep. The animation is saved in this profile and its .blockyanim kept in takes/record/
  async record() {
    await click('$document.querySelector("[data-tab=animate]")', { after: 800 });
    await cap('Make your own <b>animations</b>', 1395, BAR);
    await click('$' + btn('Blank'), { after: 900 });
    if (await p.eval(btn('Skip') + '!=null')) await click('$' + btn('Skip'), { after: 400 });
    await click('$document.querySelector("input[aria-label=Name], input[placeholder=Name]")', { after: 150 });
    await p.eval('document.activeElement.select()');
    await p.type('Big Wave', 80);
    await p.eval('document.activeElement.blur()');
    await sleep(300);
    await move(1190, 425, 500);
    await p.click(mx, my);
    await sleep(700);
    await click('$' + btn('Record'), { after: 400 });
    // the outer (view) ring around the shoulder turns by angle: grabbed down-left, round to raise the arm, then three waves
    const ring = (...angles) => {
      const pts = [];
      for (let i = 1; i < angles.length; i++)
        for (let k = i === 1 ? 0 : 1; k <= 6; k++) {
          const a = ((angles[i - 1] + ((angles[i] - angles[i - 1]) * k) / 6) * Math.PI) / 180;
          pts.push([1215 + 97 * Math.cos(a), 405 + 97 * Math.sin(a)]);
        }
      return pts;
    };
    await heldPath(ring(135, 275, 245, 285, 245, 285, 260), 75);
    await sleep(500);
    await click('$' + btn('Stop'), { after: 700 });
    const s = await where('$document.querySelector("input[aria-label=Smooth]")');
    await move(s.x - s.w / 2 + (s.w * 1.5) / 8, s.y, 450);
    await p.mouse('mousePressed', mx, my);
    await p.glide(mx, my, mx + s.w * 0.3, my, 500, true);
    await p.mouse('mouseReleased', mx + s.w * 0.3, my);
    mx += s.w * 0.3;
    await sleep(300);
    await click('$' + btn('Play'), { after: 2600 });
    await click('$' + btn('Keep'), { after: 600 });
    await click('$[...document.querySelectorAll("button")].find(b=>b.textContent.trim()==="▶"&&b.getBoundingClientRect().width)', {
      after: 2800,
    });
    await cap('');
    await sleep(800); // the save is queued
    const anim = await p.eval(`new Promise(r => { const q = indexedDB.open('skin-editor'); q.onsuccess = () => {
      const g = q.result.transaction('meta').objectStore('meta').getAll(); g.onsuccess = () => r(JSON.stringify(g.result.filter(x => x && x.name === 'Big Wave'))); }; })`);
    fs.writeFileSync('takes/record/big-wave.json', anim);
    console.log('saved animations named Big Wave:', JSON.parse(anim).length);
  },
  // 8. montage (v3): ride the horse in the Meadow, Save picture as a transparent PNG (shown on a checkerboard), ride on in the
  // Desert, the Fall shaft there, then a WASD walk and jump in the Meadow (walking turns the view behind the character, so the
  // picture comes first). After a wardrobe pass: node record.mjs +wardrobe montage
  async montage() {
    const dl = path.resolve('takes/montage-dl');
    fs.rmSync(dl, { recursive: true, force: true });
    await p.call('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dl });
    const place = async name => {
      await click(
        '$[...document.querySelectorAll(".stbtn,button")].find(b=>/^(Studio|Meadow|Snow|Desert|Jungle)/.test(b.textContent.trim()))',
        {
          after: 350,
        }
      );
      await click('$[...document.querySelectorAll(".bdopt")].find(b=>b.textContent.trim()==="' + name + '")', { after: 900 });
    };
    await click('$document.querySelector("[data-tab=animations]")', { after: 700 });
    await cap('Ride, walk, <b>explore</b>, share', 1395, BAR);
    await place('Meadow');
    await click('$[...document.querySelectorAll("button")].find(b=>/^Mount[0-9]/.test(b.textContent.trim()))', { after: 400 });
    await click('$[...document.querySelectorAll("button")].find(b=>b.textContent.trim()==="Horse")', { after: 500 });
    await click('$[...document.querySelectorAll("button")].find(b=>/^Mount Run☆?★?$/.test(b.textContent.trim()))', { after: 1400 });
    await drag(1250, 620, 1400, 615, 800);
    await sleep(300);
    await click('$document.querySelector("button[aria-label=\'Save picture\']")', { after: 400 });
    await click('$[...document.querySelectorAll(".shotmenu .bdopt")].find(b=>b.textContent.trim()==="Transparent")', { after: 300 });
    let png;
    for (let i = 0; i < 20 && !png; i++) {
      await sleep(150);
      png = fs.existsSync(dl) && fs.readdirSync(dl).find(f => f.endsWith('.png'));
    }
    if (png) await p.eval(`__promo.pic('data:image/png;base64,${fs.readFileSync(path.join(dl, png)).toString('base64')}')`);
    else console.log('montage: no picture downloaded');
    await sleep(1600);
    await p.eval('__promo.pic(null)');
    await place('Desert');
    await sleep(600);
    await click('$[...document.querySelectorAll("button")].find(b=>/^Moves[0-9]/.test(b.textContent.trim()))', { after: 400 });
    await click('$[...document.querySelectorAll("button")].find(b=>/^Fall Far/.test(b.textContent.trim()))', { after: 1900 });
    await place('Meadow');
    await move(1500, 760, 400);
    await hold(['w'], 700);
    await hold(['w', ' '], 150);
    await hold(['w'], 600);
    await sleep(800);
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
  // takes run in the order given; a +name runs that take unrecorded (setup only, e.g. +wardrobe to dress the character first)
  for (const arg of only.length ? only : Object.keys(takes)) {
    const name = arg.replace(/^\+/, ''),
      fn = takes[name];
    if (!fn) throw new Error('no take ' + name);
    if (name.startsWith('live')) await liveSetup();
    if (arg.startsWith('+')) {
      await fn();
      continue;
    }
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
