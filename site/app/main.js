// the old address forwards to hytaledesigner.com before anything else runs
import './fwd.js';
import './bug.js';
import { OrbitControls } from '../vendor/OrbitControls.js';
import * as game from './game.js';
import * as db from './db.js';
import * as fig from './figure.js';
import * as store from './store.js';
import * as auth from './auth.js';
import * as assets from './assets.js';
import { createAnimate } from './animate.js';
import { SUPPORT_URL, MOD_URL } from './config.js';
import { rules, sanitize, cleanName, clip, nice } from './skin.js';
import { createWardrobe } from './wardrobe.js';
import { createStage } from './stage.js';
import { createWalk } from './walk.js';
import { createTransport } from './transport.js';
import { createLocker } from './locker.js';
import { createAnimations } from './animations.js';
import { createPlayers } from './players.js';
import { createHelp } from './help.js';
import { createCreator } from './creator.js';
import { createWorkspace } from './workspace.js';
import * as prefs from './prefs.js';
const modLink = cls =>
  /^https:\/\/(www\.)?curseforge\.com\/hytale\/[a-z-]+\/[a-z0-9-]{2,80}$/.test(MOD_URL)
    ? el('button', {
        class: 'btn ' + cls,
        text: 'Get the mod',
        onclick: () => {
          store.wantMod().catch(() => {});
          getModHelp();
        },
      })
    : null; // from now on the site connects to the mod by itself once Hytale runs
function getModHelp() {
  // the in-game mod browser first (no web link can open it), CurseForge as the other way
  ask(
    'Get the Hytale Designer Sync mod',
    [
      el(
        'ol',
        { class: 'modhow' },
        el('li', { text: 'In Hytale, open Mods from the main menu.' }),
        el('li', { text: 'Go to Browse and search "Hytale Designer Sync".' }),
        el('li', { text: 'Install it, then start your world.' })
      ),
      el(
        'p',
        { class: 'dim', text: 'This page connects to it by itself once the game is running. ' },
        el('a', { href: MOD_URL, target: '_blank', rel: 'noopener noreferrer', text: 'Or download it from CurseForge' })
      ),
    ],
    [{ label: 'OK', value: '', primary: true }]
  );
}
// the footer's support link: only a Ko-fi page, and only when one is set
if (/^https:\/\/ko-fi\.com\/[A-Za-z0-9_]{2,60}$/.test(SUPPORT_URL)) {
  const a = document.getElementById('support');
  if (a) {
    a.href = SUPPORT_URL;
    a.hidden = false;
    document.getElementById('supportdot').hidden = false;
  }
}

const $ = id => document.getElementById(id);
// Every element is made here with textContent and properties: no HTML strings anywhere, so nothing typed, imported or looked up can inject markup.
function el(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k === 'data') Object.assign(e.dataset, v);
    else if (k.includes('-') || k === 'role') e.setAttribute(k, v);
    else e[k] = v;
  } // aria-*, data-* and role are attributes, not properties
  e.append(...kids.flat(Infinity).filter(k => k != null && k !== false));
  if (e.title && e.textContent.trim().toLowerCase().includes(e.title.trim().toLowerCase()))
    e.removeAttribute('title'); /* a tooltip that only repeats what is written is dropped */
  return e;
}
const say = (t, bad) => {
  const s = $('status');
  s.textContent = t || '';
  s.classList.toggle('bad', !!bad);
  clearTimeout(say.t);
  if (t) say.t = setTimeout(() => (s.textContent = ''), bad ? 8000 : 4000);
};

function guard(fn) {
  return async (...a) => {
    try {
      await fn(...a);
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      if (!/is full|Limit is|Texture full|can't go in game/.test(e?.message || '')) console.error(e);
      /* expected refusals are messages, not errors */ say(e.message || 'That did not work.', true);
    }
  };
}
// ---------------------------------------------------------------- dialogs
function ask(title, body, buttons) {
  const d = $('dlg');
  $('dlgtitle').textContent = title;
  $('dlgbody').replaceChildren(...[].concat(body));
  $('dlgbtns').replaceChildren(
    ...buttons.map(b =>
      el('button', { class: 'btn ' + (b.primary ? 'primary' : b.danger ? 'danger' : 'ghost'), value: b.value, text: b.label })
    )
  );
  const main = buttons.find(b => b.primary) || buttons.find(b => b.danger);
  let enter = null;
  d.onkeydown = e => {
    if (e.key === 'Enter' && main && e.target.matches?.('input:not([type=checkbox]):not([type=radio])')) {
      e.preventDefault();
      d.close(main.value);
      enter && enter(main.value);
    }
  }; // Enter in a text box presses the main button, not Cancel
  let opener = document.activeElement;
  {
    const ca = opener?.closest?.('.cardacts');
    if (ca && ca.previousElementSibling) opener = ca.previousElementSibling;
  }
  const rid =
    opener?.closest?.('[data-rid]')?.dataset.rid; /* from a card menu: back to its ⋯ (found again by id if the list was redrawn) */
  return new Promise(ok => {
    let done = false;
    const end = v => {
      if (done) return;
      done = true;
      ok(v);
      setTimeout(() => {
        const ae = document.activeElement;
        if (!ae || ae === document.body || ae.closest?.('.cardacts')?.hidden) {
          if (opener?.isConnected) opener.focus();
          else if (rid) setTimeout(() => document.querySelector(`[data-rid="${CSS.escape(rid)}"] .cardmenu`)?.focus(), 300);
        }
      }, 0);
    };
    enter =
      end; /* focus goes back to what opened the dialog */ /* Enter answers at once too (a close event can come late) */ /* a button answers at once; closing (Esc) answers too */
    for (const b of $('dlgbtns').children)
      b.addEventListener('click', e => {
        e.preventDefault();
        d.close(b.value);
        end(b.value);
      });
    d.onclose = () => end(d.returnValue || '');
    d.returnValue = '';
    d.showModal();
    const fi = $('dlgbody').querySelector('input[type=text]');
    if (fi) {
      fi.focus();
      fi.select();
    }
  }); /* a name field opens selected, so typing replaces it */
}
const confirmBox = (title, text, yes, danger) =>
  ask(title, el('p', { text }), [
    { label: 'Cancel', value: '' },
    { label: yes, value: 'yes', primary: !danger, danger },
  ]).then(v => v === 'yes');
function download(name, data) {
  const a = el('a', { href: URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })), download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
async function readJsonFile(file, max = 2_000_000) {
  if (file.size > max) throw new Error('That file is too large.');
  return JSON.parse(await file.text());
}

// ---------------------------------------------------------------- connect screen
const PATHS = {
  win: '%APPDATA%\\Hytale\\install\\release\\package\\game\\latest',
  mac: '~/Library/Application Support/Hytale/install/release/package/game/latest',
  linux: '~/.local/share/Hytale/install/release/package/game/latest',
};
function showConnect() {
  const had = R && META;
  $('app').hidden = true;
  $('connect').hidden = false;
  $('connback')?.remove();
  if (had)
    $('connect').prepend(
      el('button', {
        id: 'connback',
        class: 'btn ghost',
        text: 'Back',
        onclick: () => {
          $('connback')?.remove();
          $('connect').hidden = true;
          $('app').hidden = false;
        },
      })
    ); /* already connected: the files are still here, so Back returns to the app */
  const os = /Mac/i.test(navigator.platform) ? 'mac' : /Linux/i.test(navigator.platform) ? 'linux' : 'win';
  const pick = o => {
    $('path').textContent = PATHS[o];
    for (const b of $('os').children) b.classList.toggle('on', b.dataset.os === o);
  };
  for (const b of $('os').children) b.onclick = () => pick(b.dataset.os);
  pick(os);
  $('copypath').onclick = async () => {
    try {
      await navigator.clipboard.writeText($('path').textContent);
      $('copypath').textContent = 'Copied';
    } catch {
      $('copypath').textContent = 'Select and copy it';
    }
    setTimeout(() => ($('copypath').textContent = 'Copy path'), 1800);
  };
  $('zipfile').onchange = e => {
    const f = e.target.files[0];
    e.target.value = '';
    if (f) doConnect(() => game.connect(f, progress));
  };
  // Chrome and Edge: pick through the file-system picker so the site can remember this Assets.zip and re-read it after a game update
  if (typeof self.showOpenFilePicker === 'function')
    $('zipfile').parentElement.onclick = async e => {
      e.preventDefault();
      if (connecting) return;
      let h;
      try {
        [h] = await showOpenFilePicker({
          id: 'hytale-assets',
          types: [{ description: 'Hytale Assets.zip', accept: { 'application/zip': ['.zip'] } }],
        });
      } catch {
        return;
      } // cancelled
      connectHandle(h);
    };
  game.zipHandle().then(h => {
    const b = $('samezip');
    if (b) b.remove();
    if (!h) return;
    $('zipfile').parentElement.after(
      el('button', { id: 'samezip', class: 'btn ghost', text: 'Use the same Assets.zip again', onclick: () => connectHandle(h, true) })
    );
  });
}
// read Assets.zip from a remembered file handle; ask=true asks the browser for permission (needs a click)
async function connectHandle(h, ask) {
  if (ask && (await h.queryPermission({ mode: 'read' })) !== 'granted' && (await h.requestPermission({ mode: 'read' })) !== 'granted')
    return;
  doConnect(async () => {
    const f = await h.getFile();
    await game.connect(f, progress);
    await game.rememberZip(h);
  });
}
// on every visit: if the remembered Assets.zip changed (a game update) and the browser still allows reading it, refresh quietly
async function checkGameUpdate(force) {
  const h = await game.zipHandle().catch(() => null);
  if (!h || !META) return;
  try {
    if ((await h.queryPermission({ mode: 'read' })) !== 'granted') return;
    const f = await h.getFile();
    if (!force && f.size === META.size && f.lastModified === META.modified && (META.v || 1) >= game.FILES_V) return; // same file, and read with today's list of files
    say(
      force
        ? 'Reading your game files again…'
        : (META.v || 1) < game.FILES_V && f.size === META.size
          ? 'Reading a few more of your game files…'
          : 'Hytale updated, reading the new game files…'
    );
    BD_MADE.clear();
    setBdShown(null);
    await game.connect(f, () => {});
    fig.clearCache();
    pics.clear();
    META = await game.status();
    CAT = await game.catalog();
    R = rules(CAT);
    registerAssets();
    rebuild();
    render();
    say('Game files updated.');
  } catch (e) {
    console.warn('game update check', e);
    say('Could not read the updated game files', true);
  }
}
// the browser forgets the read permission between visits: the first click of a visit asks for it once (Chrome then offers "Allow on every
// visit"), so a game update is picked up without the player connecting again
async function askZipOnce() {
  askZipOnce.done = true;
  const h = await game.zipHandle().catch(() => null);
  if (!h || !META) return;
  try {
    if ((await h.queryPermission({ mode: 'read' })) === 'prompt' && (await h.requestPermission({ mode: 'read' })) === 'granted')
      checkGameUpdate();
  } catch {
    /* not allowed now */
  }
}
addEventListener(
  'pointerdown',
  () => {
    if (!askZipOnce.done) askZipOnce();
  },
  { capture: true }
);
// Connect again: the remembered Assets.zip is read straight away (one click); only without one does the file picker come up
async function reconnect() {
  const h = await game.zipHandle().catch(() => null);
  if (!h) return showConnect();
  try {
    if ((await h.queryPermission({ mode: 'read' })) !== 'granted' && (await h.requestPermission({ mode: 'read' })) !== 'granted')
      return showConnect();
    await h.getFile();
  } catch {
    return showConnect();
  }
  checkGameUpdate(true);
}
function progress(p) {
  const b = $('progress');
  b.hidden = false;
  b.firstElementChild.style.width = Math.round(p * 100) + '%';
  b.lastElementChild.textContent = p < 1 ? `Reading your game files… ${Math.round(p * 100)}%` : 'Done';
}
let connecting = false;
async function doConnect(run) {
  if (connecting) return;
  connecting = true;
  $('connerr').textContent = '';
  $('app').hidden = true;
  $('connect').hidden = false;
  progress(0);
  try {
    await run();
    fig.clearCache();
    await startApp();
  } catch (e) {
    console.error(e);
    $('progress').hidden = true;
    $('connerr').textContent = (e && e.message) || 'Could not read that file.';
  }
  connecting = false;
}
addEventListener('dragover', e => {
  if ([...e.dataTransfer.types].includes('Files')) {
    e.preventDefault();
    $('drop').hidden = false;
  }
});
addEventListener('dragleave', e => {
  if (!e.relatedTarget) $('drop').hidden = true;
});
addEventListener('drop', e => {
  e.preventDefault();
  $('drop').hidden = true;
  const fs = [...e.dataTransfer.files];
  if (!fs.length) return;
  const zi = [...e.dataTransfer.items].findIndex(i => i.kind === 'file' && /\.zip$/i.test(i.getAsFile()?.name || '')),
    hp = zi >= 0 && e.dataTransfer.items[zi].getAsFileSystemHandle ? e.dataTransfer.items[zi].getAsFileSystemHandle() : null;
  const zip = fs.find(f => /\.zip$/i.test(f.name));
  if (zip)
    return doConnect(async () => {
      await game.connect(zip, progress);
      const h = await hp?.catch(() => null);
      if (h && h.kind === 'file') await game.rememberZip(h);
    });
  if (R) importSkinFiles(fs);
});
// top bar: the Hytale account (connect, or who is signed in; the Locker has sign out)
function drawAcct() {
  const box = $('acct');
  if (!box) return;
  box.replaceChildren(
    !auth.enabled
      ? el(
          'button',
          {
            class: 'conn locked wip',
            'aria-disabled': 'true',
            'aria-label': 'Connect Hytale account (WIP)',
            onclick: () => say("Coming soon: waiting on Hytale's 3rd party site approval"),
          },
          el('span', { class: 'lbl', text: 'Connect Hytale account' })
        )
      : !ACCOUNT
        ? el('button', { class: 'conn', text: 'Connect Hytale account', onclick: guard(() => auth.start()) })
        : el('button', { class: 'conn ok', text: ACCOUNT.username, onclick: () => setTab('wardrobe') })
  );
}

// ---------------------------------------------------------------- app state
let CAT,
  R,
  st,
  META,
  tab = 'editor',
  slot = 'haircut';
let cur = { id: null, kind: null, slot: null, name: '', skin: null },
  hist = [],
  hpos = -1,
  dirty = false,
  WARD = { game: [], custom: [] };
let FOLDER = { state: 'none' },
  ACCOUNT = null,
  SHOWGAME = false,
  EDITWEAR = null; // while the Creator has an item open: the outfit to wear in game (the editor takes off what covers the item)
// the tab modules change the shared state through these
const setR = v => (R = v),
  setTabValue = v => (tab = v),
  setSlot = v => (slot = v),
  setHist = v => (hist = v),
  setHpos = v => (hpos = v),
  setDirty = v => (dirty = v),
  setWard = v => (WARD = v),
  setFolder = v => (FOLDER = v),
  setAccount = v => {
    ACCOUNT = v;
    drawAcct();
  },
  setShowGame = v => (SHOWGAME = v);

async function startApp() {
  META = await game.status();
  CAT = await game.catalog();
  R = rules(CAT);
  setAssets(await assets.list().catch(() => []));
  registerAssets();
  await applyRescue().catch(e => console.warn(e));
  await loadLock();
  await loadEmotes();
  SHOWGAME = !!(await db.get('meta', 'showInGame').catch(() => false));
  $('connect').hidden = true;
  $('app').hidden = false;
  if (!st) {
    st = fig.stage($('view'), OrbitControls);
    ANIMATE = createAnimate({
      el,
      st,
      render,
      say,
      ask,
      head,
      cat: () => CAT,
      nice,
      label: (g, n) => animLabel(g, n),
      idle: () => playAnim('Default', 'Idle', 0.5),
      play: (g, n) => playAnim(g, n, 1),
      thumb: (g, n) => animThumb(g, n),
      poseShot: (a, t) => poseShot(a, t),
      tab: () => tab,
      canPublish: () => canPublish(),
      lockedPublish: () => locked('Publish', 'publishing', 'mini'),
      props: Object.keys(game.PROPS).filter(k => k !== 'glider'),
      hold: async (k, hand) => {
        const my = (holdSeq = (holdSeq || 0) + 1);
        setPropsKey(null);
        if (!k) return st.props([]);
        try {
          const root = await fig.buildProp(k);
          if (my !== holdSeq) return;
          st.props([{ root, bone: hand === 'L' ? 'L-Attachment' : 'R-Attachment' }]);
        } catch (e) {
          say(e.message, true);
        }
      },
    });
    /* held-item preview for the Animate tab */ if (location.hostname.endsWith('localhost')) window.__an = ANIMATE; // the Animate tab
    $('view').addEventListener('pointerdown', e => {
      if (tab !== 'animate' || !ANIMATE.active() || e.button !== 0 || st.gizmoBusy(e.clientX, e.clientY)) return;
      ANIMATE.pickAt(e.clientX, e.clientY);
    });
    if (location.hostname.endsWith('localhost')) {
      window.__st = st;
      window.__dbg = {
        combineWith: (...a) => combineWith(...a),
        combinePick: () => combinePick(),
        cat: () => CAT,
        ed: () => creatorTab.ED,
        sizeOf: sh => sizeOf(sh),
        colourPart: n => colourPart(n),
        geoTwin: n => geoTwin(n),
        boxes: () => boxesOf(creatorTab.ED.model).map(b => b.node.name),
      };
    } // local tests only
    st.onMissing = () => say('Missing game files for this move', true);
    st.onFacing(f => {
      const t = $('facing') || $('view').parentElement.appendChild(el('div', { id: 'facing', class: 'facing' }));
      t.textContent = 'Facing you: ' + f;
    });
    bindPaint(
      $('view'),
      e =>
        creatorTab.ED && !creatorTab.ED.shapeOpen && creatorTab.ED.painter.tool !== 'select'
          ? st.pick(e.clientX, e.clientY, creatorTab.ED.canvas, creatorTab.ED.mirror)
          : null,
      10,
      true
    );
    $('view').addEventListener('pointermove', e => {
      if (!creatorTab.ED) return;
      partHover(e);
      const p =
        creatorTab.ED.shapeOpen || creatorTab.ED.painter.tool === 'select'
          ? st.cursor(null)
          : st.cursor(e.clientX, e.clientY, creatorTab.ED.canvas, brushSize(), creatorTab.ED.mirror);
      creatorTab.ED.hover = p;
      creatorTab.ED.hoverM = p?.m || null;
      drawOvl();
    });
    $('view').addEventListener('pointerleave', () => {
      if (!creatorTab.ED) return;
      st.cursor(null);
      creatorTab.ED.hover = creatorTab.ED.hoverM = null;
      drawOvl();
    });
    st.afterShow = () => {
      outlineBox();
      placeGizmo();
      if (creatorTab.ED && creatorTab.ED.frame) {
        creatorTab.ED.frame = false;
        st.frameOn(creatorTab.ED.canvas);
      }
    };
    $('view').addEventListener(
      'pointerdown',
      e => {
        if (!creatorTab.ED || !creatorTab.ED.shapeOpen || e.button !== 0 || (!creatorTab.ED.placing && st.gizmoBusy(e.clientX, e.clientY)))
          return;
        const mine = o => o.material?.map?.image === creatorTab.ED.canvas;
        if (creatorTab.ED.placing) {
          const h = st.pickHit(e.clientX, e.clientY, mine);
          if (!h) {
            say('Missed the item', true);
            return;
          }
          e.stopImmediatePropagation();
          creatorTab.ED.placing = false;
          say('');
          const k = boxesOf(creatorTab.ED.model).findIndex(b => b.node.name === h.mesh.userData.nodeName);
          if (k >= 0) {
            creatorTab.ED.box = k;
            addBox('add', h);
          }
          return;
        }
        const hit = st.pickMesh(e.clientX, e.clientY, mine);
        if (!hit) return;
        const k = boxesOf(creatorTab.ED.model).findIndex(b => b.node.name === hit.userData.nodeName);
        if (k >= 0 && k !== creatorTab.ED.box) {
          creatorTab.ED.box = k;
          render();
          placeGizmo();
          return;
        }
        if (k >= 0 && creatorTab.ED.stool === 'move') dragBox(e, hit);
      },
      true
    );
  }
  try {
    if (await store.resumeFolder(false)) await reloadAssets();
  } catch (e) {
    console.warn(e);
  }
  FOLDER = await store.folderState();
  WARD = await store.list();
  ACCOUNT = await auth.account().catch(() => null);
  drawAcct();
  await loadPub();
  const movedOut = {};
  for (const g of WARD.game)
    if (g && hasCustom(g.skin)) {
      try {
        const r = await store.saveGame(g.slot, g.name, g.skin);
        if (r.kind === 'custom') {
          await store.remove(g.id);
          movedOut[g.id] = r;
        }
      } catch (e) {
        console.warn(e);
      }
    } /* older data: an in-game slot holding custom items moves to My skins */
  if (Object.keys(movedOut).length) WARD = await store.list();
  let draft = await db.get('meta', 'draft');
  try {
    const q = prefs.getJson('se_draft');
    prefs.del('se_draft');
    if (q && sanitize(q.skin) && (!draft || (q.t || 0) > (draft.t || 0))) {
      draft = q;
      db.put('meta', 'draft', q).catch(() => {});
    }
  } catch {
    /* none */
  } /* and the stored draft catches up */ /* the outfit written at the last unload wins if newer */
  const ds = sanitize(draft?.skin);
  cur = ds
    ? {
        id: draft.id || null,
        kind: draft.kind || null,
        slot: draft.slot ?? null,
        name: cleanName(draft.name),
        skin: R.fit(ds),
        auto: !!draft.auto,
        random: !!draft.random,
      }
    : { id: null, kind: null, slot: null, name: '', skin: R.blank() };
  if (cur.id && movedOut[cur.id]) {
    Object.assign(cur, { id: movedOut[cur.id].id, kind: 'custom', slot: null, name: movedOut[cur.id].name });
    keepDraft();
  }
  if (cur.id && ![...WARD.game, ...WARD.custom].some(r => r && r.id === cur.id)) {
    cur.id = null;
    cur.kind = null;
  }
  hist = [JSON.stringify(cur.skin)];
  hpos = 0;
  dirty = false;
  {
    const rec = cur.id && [...WARD.game, ...WARD.custom].find(r => r && r.id === cur.id);
    if (
      (rec && (draft?.t || 0) > (rec.updated || 0) && JSON.stringify(R.fit(rec.skin)) !== JSON.stringify(cur.skin)) ||
      (!cur.id && draft?.dirty)
    ) {
      dirty = true;
      autosave();
    } else if (rec && JSON.stringify(R.fit(rec.skin)) !== JSON.stringify(cur.skin)) {
      cur.skin = R.fit(rec.skin);
      hist = [JSON.stringify(cur.skin)];
      keepDraft();
    }
  } /* only a newer draft wins over the saved skin; an older one gives way */ /* an unsaved look from before a reload still gets saved */ /* the draft is ahead of the saved skin: save it */
  playAnim('Default', 'Idle', 0.5);
  render();
  rebuild();
  pushWearing();
  READY = true;
}
function open(rec, asNew, look) {
  // put a skin on the stage: a wardrobe record, or a found skin (asNew); look = just looking (not sent to the game)
  if (flush.stuck && dirty) {
    ask('Not saved', el('p', { text: `My skins is full (${store.CUSTOM_MAX}), so this look isn't saved.` }), [
      { label: 'Cancel', value: '' },
      { label: 'Discard', value: 'yes', danger: true },
    ]).then(v => {
      if (v === 'yes') {
        flush.stuck = false;
        dirty = false;
        open(rec, asNew, look);
      }
    });
    return;
  } /* never drops an unsaved look without asking */
  flush();
  cur = asNew
    ? { id: null, kind: null, slot: null, name: cleanName(rec.name), skin: R.fit(rec.skin) }
    : { id: rec.id, kind: rec.kind, slot: rec.slot ?? null, name: rec.name, skin: R.fit(rec.skin) };
  hist = [JSON.stringify(cur.skin)];
  hpos = 0;
  dirty = !!asNew && !look;
  keepDraft();
  /* just looking at someone's skin is not a change to save */ rebuild();
  plate();
  if (!look) pushWearing();
}
function setSkin(s, random = false) {
  cur.random = random;
  cur.skin = s;
  autosave();
  pushWearing();
  hist = hist.slice(0, hpos + 1);
  hist.push(JSON.stringify(s));
  if (hist.length > 200) hist.shift();
  hpos = hist.length - 1;
  dirty = true;
  keepDraft();
  rebuild();
  render();
}
function step(d) {
  const p = hpos + d;
  if (p < 0 || p >= hist.length) return;
  hpos = p;
  {
    const h = JSON.parse(hist[p]),
      f2 = R.fit(h);
    for (const k of Object.keys(h))
      if (typeof h[k] === 'string' && h[k].startsWith('Custom_') && !f2[k] && cur.skin[k]) f2[k] = cur.skin[k];
    cur.skin = f2;
  }
  dirty = true;
  /* a deleted item's slot keeps what is worn now, never empty */ /* a deleted item never comes back through undo */ autosave();
  pushWearing();
  keepDraft();
  rebuild();
  render();
}
// the companion mod dresses you in game from "<skins folder>/Wearing.json"
self.addEventListener('skinsfolder', async e => {
  if (e.detail?.auto)
    say(
      e.detail.imported
        ? `Connected to the mod, ${e.detail.imported} skin${e.detail.imported > 1 ? 's' : ''} brought in`
        : 'Connected to the mod: your skins now save to Documents\\Hytale Skins'
    );
  FOLDER = await store.folderState();
  await reloadAssets().catch(() => {});
  await refreshWard().catch(() => {});
  pushWearing();
  render();
}); // the game started or stopped (mod connection)
function pushWearing() {
  clearTimeout(pushWearing.t);
  pushWearing.t = setTimeout(async () => {
    if (FOLDER.state !== 'on') return;
    const skin = EDITWEAR || cur.skin;
    try {
      await store.writeWearing(SHOWGAME ? { on: true, name: cur.name || 'New skin', keepOwn: store.keepOwnOf(skin), skin } : { on: false });
    } catch (e) {
      console.warn(e);
    }
  }, 400);
}
function drawGameSwitch() {
  const b = $('ingame');
  if (!b) return;
  b.hidden = FOLDER.state !== 'on';
  b.classList.toggle('primary', SHOWGAME);
  b.classList.toggle('ghost', !SHOWGAME);
  b.textContent = SHOWGAME ? 'In game: on' : 'In game: off';
  b.title = 'Hytale Designer Sync mod';
}
const persist = c => (c.kind === 'game' ? store.saveGame(c.slot, c.name, c.skin) : store.saveCustom(c.name, c.skin, c.id));
function autosave() {
  flush.stuck = false;
  clearTimeout(autosave.t);
  autosave.t = setTimeout(flush, 700);
} // every change saves itself; a new skin becomes "My skin N" in My skins on its first change
function restoreFrom(s, before, fs) {
  const o = { ...s };
  for (const f of fs) {
    if (before[f] == null) delete o[f];
    else o[f] = before[f];
  }
  return o;
}
function keptSkin() {
  const s = cur.skin;
  if (!creatorTab.ED || !creatorTab.ED.before || !creatorTab.ED.asset) return s;
  const f = creatorTab.ED.asset.field;
  if (creatorTab.ED.keeping) return restoreFrom(s, creatorTab.ED.before, HIDE[f] || []);
  /* Wear was pressed: the item stays on */ return restoreFrom(s, creatorTab.ED.before, [f, ...(HIDE[f] || [])]);
} // an item worn only for editing is not saved into the skin
async function flush() {
  clearTimeout(autosave.t);
  if (ASIDE || !dirty) return flush.p;
  const was = cur,
    c = { ...cur, skin: keptSkin() }; /* saves queue up in order: a change made while one is writing is never dropped */
  flush.p = (flush.p || Promise.resolve()).then(() => saveSnap(was, c));
  return flush.p;
}
const GONE = new Set(); // skins deleted this session: a save already queued for one is dropped
async function saveSnap(was, c) {
  if (GONE.has(c.id) || (!c.id && GONE.has(was.id))) return;
  flush.busy = true;
  if (!c.id && was.id) c.id = was.id; /* an earlier save in the queue already made the skin */
  try {
    if (c.kind === 'game' && hasCustom(c.skin)) {
      if (WARD.custom.length >= store.CUSTOM_MAX) {
        flush.stuck = true;
        plate();
        say(`My skins is full (${store.CUSTOM_MAX})`, true);
        return;
      } /* stops retrying until the next change */ /* an in-game slot can't hold custom items: the look is kept in My skins */
      const used = new Set(WARD.custom.map(r => r.name));
      let n = c.name || 'My skin',
        k = 2;
      while (used.has(n)) n = cleanName(clip(c.name || 'My skin', 37) + ' ' + k++);
      const r = await store.saveCustom(n, c.skin);
      if (cur === was) Object.assign(cur, { id: r.id, kind: 'custom', slot: null, name: r.name, auto: false });
      keepDraft();
      WARD = await store.list();
      if (cur === was && JSON.stringify(keptSkin()) === JSON.stringify(c.skin)) dirty = false;
      plate();
      say("Custom items can't go in game slots: saved to My skins");
      return;
    }
    if (!c.id) {
      if (WARD.custom.length >= store.CUSTOM_MAX) {
        flush.stuck = true;
        if (!flush.full) {
          flush.full = true;
          say(`My skins is full (${store.CUSTOM_MAX})`, true);
        }
        return;
      }
      const used = new Set([...WARD.custom, ...WARD.game.filter(Boolean)].map(r => r.name));
      let k = 1,
        n;
      while (used.has((n = 'My skin ' + k))) k++; /* the first free number, never a name an in-game slot already shows */
      const r = await store.saveCustom(n, c.skin);
      if (cur === was && !cur.id) Object.assign(cur, { id: r.id, kind: r.kind, slot: null, name: r.name, auto: true });
      c.id = r.id;
      keepDraft();
    } else await persist(c);
    WARD = await store.list();
    if (cur.id === c.id && JSON.stringify(keptSkin()) === JSON.stringify(c.skin)) dirty = false;
    plate();
  } catch (e) {
    console.error(e);
    say(e.message || 'Could not save.', true);
  } finally {
    flush.busy = false;
    if (dirty && cur.id && !flush.stuck) {
      clearTimeout(autosave.t);
      autosave.t = setTimeout(flush, 700);
    }
  }
}
function keepDraft() {
  clearTimeout(keepDraft.t);
  keepDraft.t = setTimeout(
    () =>
      !ASIDE &&
      db
        .put('meta', 'draft', {
          id: cur.id,
          kind: cur.kind,
          slot: cur.slot,
          name: cur.name,
          skin: keptSkin(),
          auto: !!cur.auto,
          random: !!cur.random,
          t: Date.now(),
        })
        .catch(() => {}),
    300
  );
}
let building = 0;
async function rebuild() {
  const my = ++building,
    stg = $('view').parentElement,
    slow = setTimeout(() => stg.classList.add('loading'), 300); // a slow build says so instead of an empty stage
  try {
    const root = await fig.build(cur.skin, R);
    if (my !== building) return fig.dispose(root);
    st.show(root);
  } catch (e) {
    console.error(e);
    if (my === building) say('Could not build this skin: ' + e.message, true);
  } finally {
    clearTimeout(slow);
    if (my === building) stg.classList.remove('loading');
  }
}
let peekT;
function peek(part) {
  peek.part = part;
  clearTimeout(peekT);
  peekT = setTimeout(
    async () => {
      const my = ++building;
      try {
        const root = await fig.build(part === undefined ? cur.skin : { ...cur.skin, [slot]: part }, R);
        if (my !== building) return fig.dispose(root);
        st.show(root);
      } catch (e) {
        console.warn(e);
      }
    },
    part === undefined ? 140 : 120
  );
}
let scrolledAt = 0;
const setScrolledAt = v => (scrolledAt = v);
addEventListener(
  'wheel',
  () => {
    scrolledAt = performance.now();
  },
  { passive: true, capture: true }
);
addEventListener(
  'scroll',
  () => {
    scrolledAt = performance.now();
  },
  { passive: true, capture: true }
); // cards sliding under a resting pointer while scrolling don't count as hovering
const hover = part => ({
  onpointerenter: e => {
    if (e.pointerType === 'mouse' && performance.now() - scrolledAt > 300) peek(part);
  },
  onpointermove: e => {
    if (e.pointerType === 'mouse' && performance.now() - scrolledAt > 300 && peek.part !== part) peek(part);
  },
  onpointerleave: e => {
    if (e.pointerType === 'mouse') peek();
  },
});
function plate() {
  const tag =
    cur.kind === 'game'
      ? ['In-game slot ' + (cur.slot + 1), 'game']
      : cur.kind === 'custom'
        ? ['My skin', 'custom']
        : ['Not saved', 'none'];
  $('nameplate').replaceChildren(
    el('b', { text: cur.name || 'New skin' }),
    el('span', { class: 'tag ' + tag[1], text: tag[0] }),
    ...(cur.id ? [el('span', { class: 'tag none', text: dirty ? (flush.stuck ? 'Not saved' : 'Saving…') : 'Saved' })] : [])
  );
  $('undo').disabled = hpos <= 0;
  $('redo').disabled = hpos >= hist.length - 1;
}

// ---------------------------------------------------------------- pictures: one at a time, only for tiles on screen
let jobGen = 0;
const pics = new Map();
let chain = Promise.resolve();
const HEADF = new Set([
    'face',
    'eyes',
    'eyebrows',
    'mouth',
    'ears',
    'haircut',
    'facialHair',
    'headAccessory',
    'faceAccessory',
    'earAccessory',
  ]),
  LEGF = new Set(['pants', 'overpants', 'shoes', 'underwear']);
// pictures of game items are also kept in this browser (per game version), so the next visit shows them at once instead of drawing each again;
// a custom piece in the picture is named with the time it was last changed, so a repaint makes a new picture
const THUMB_V = 2,
  keepKey = key => {
    if (!META) return null;
    let gone = false;
    const k = key.replace(/Custom_([A-Za-z0-9_-]+)/g, (m, id) => {
      const a = creatorTab.ASSETS.find(x => x.id === id);
      if (!a || !a.updated) gone = true;
      return m + '@' + (a && a.updated);
    });
    return gone ? null : THUMB_V + '|' + META.size + '|' + META.modified + '|' + k;
  };
function picture(key, make) {
  if (pics.has(key)) return Promise.resolve(pics.get(key));
  const gen = jobGen,
    kk = keepKey(key);
  return (kk ? db.get('thumbs', kk).catch(() => null) : Promise.resolve(null)).then(saved => {
    if (saved) {
      pics.set(key, saved);
      return saved;
    }
    return (chain = chain.then(async () => {
      if (gen !== jobGen) return undefined;
      if (pics.has(key)) return pics.get(key);
      try {
        const u = await make();
        pics.set(key, u);
        if (pics.size > 1500) pics.delete(pics.keys().next().value);
        if (kk) db.put('thumbs', kk, u).catch(() => {});
        await new Promise(r => setTimeout(r));
        return u;
      } catch (e) {
        console.warn(e);
        return null;
      }
    }));
  });
}
// the kept pictures are dropped when the game files change, or when there are a lot of them
async function trimThumbs() {
  try {
    const ks = await db.keys('thumbs'),
      pre = keepKey('');
    if (ks.length > 3000 || ks.some(k => !k.startsWith(pre))) await db.clear('thumbs');
  } catch {
    /* no store yet */
  }
}
const lazy = new IntersectionObserver(
  es => {
    for (const e of es)
      if (e.isIntersecting) {
        lazy.unobserve(e.target);
        e.target._load?.();
      }
  },
  { rootMargin: '200px' }
);
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // a picture that could not be drawn stops pulsing
const lastPic = new Map(); // the previous picture of a tile stays up until its new one is drawn
function lazyImg(key, make, prev) {
  const img = el('img', { alt: '', draggable: false });
  if (pics.has(key)) {
    img.src = pics.get(key);
    if (prev) lastPic.set(prev, img.src);
  } else {
    if (prev && lastPic.has(prev)) img.src = lastPic.get(prev);
    img._load = async () => {
      const u = await picture(key, make);
      if (u) {
        img.src = u;
        if (prev) lastPic.set(prev, u);
      } else if (u === null && !img.src) img.src = BLANK;
    };
    lazy.observe(img);
  }
  return img;
}
// in a picture of one face item, the things that would cover it come off (a hood hides hair, a beard hides the mouth ...)
const HIDE = {
  haircut: ['headAccessory'],
  face: ['headAccessory', 'faceAccessory', 'facialHair', 'haircut'],
  eyes: ['headAccessory', 'faceAccessory', 'haircut'],
  eyebrows: ['headAccessory', 'faceAccessory', 'haircut'],
  mouth: ['headAccessory', 'faceAccessory', 'facialHair'],
  facialHair: ['headAccessory', 'faceAccessory'],
  skinFeature: ['headAccessory', 'faceAccessory', 'facialHair'],
  ears: ['headAccessory', 'haircut', 'earAccessory', 'faceAccessory', 'facialHair'],
  earAccessory: ['headAccessory', 'haircut', 'faceAccessory', 'facialHair'],
  faceAccessory: ['headAccessory'],
  gloves: ['overtop', 'cape'],
  overpants: ['shoes', 'pants'],
  underwear: ['pants', 'overpants', 'undertop', 'overtop', 'cape', 'shoes'],
  undertop: ['overtop', 'cape'],
  pants: ['cape', 'shoes', 'overpants'],
  shoes: ['cape'],
};
const FACE_FRAME = {
  face: 'face',
  eyes: 'face',
  eyebrows: 'face',
  mouth: 'face',
  facialHair: 'face',
  faceAccessory: 'face',
  ears: 'ear',
  earAccessory: 'ear',
  headAccessory: 'hat',
  haircut: 'head',
  pants: 'pants',
  overpants: 'socks',
  shoes: 'shoes',
  gloves: 'gloves',
  underwear: 'hips',
  undertop: 'top',
  overtop: 'top',
};
// pieces that hide the one in the picture: a coat over the gloves, boots over the socks, trousers over underwear
function bareSkin(f, part) {
  // the character stripped to the body, its face and boxers, plus one part in slot f (null for none)
  const keep = new Set(['bodyCharacteristic', 'face', 'eyes', 'mouth', 'ears']),
    boxer = R.ITEMS.underwear.find(e => e.Id === 'Boxer');
  const s = Object.fromEntries(Object.entries(cur.skin).map(([k, v]) => [k, keep.has(k) ? v : null]));
  s.underwear = boxer ? R.partStr(boxer) : cur.skin.underwear;
  if (f && (part || (!keep.has(f) && f !== 'underwear'))) s[f] = part;
  return s;
}
function itemThumb(f, it, color, variant, bare) {
  // the current character, wearing this option (bare: in boxers with only this option)
  let s = { ...cur.skin, [f]: it ? R.partStr(it, color, variant) : null };
  for (const k of HIDE[f] || []) s[k] = null;
  if (bare || f === 'bodyCharacteristic') s = bareSkin(f, s[f]); // a body is always shown bare
  const frame =
    FACE_FRAME[f] || (HEADF.has(f) ? 'head' : LEGF.has(f) ? 'legs' : f === 'bodyCharacteristic' || f === 'skinFeature' ? 'body' : 'torso');
  return lazyImg(
    'i|' + f + '|' + JSON.stringify(s),
    async () => fig.snapshot(await fig.build(s, R), frame, f === 'cape'),
    f + '|' + (it ? it.Id : 'none') + (bare ? '|bare' : '')
  );
}
// an animation's picture: the current skin caught part-way through the move
function animThumb(g, n) {
  const s = R.fit(cur.skin);
  return lazyImg(
    'a|' + g + '|' + n + '|' + JSON.stringify(s),
    async () => {
      const [root, a] = await Promise.all([fig.build(s, R), fig.loadAnim(g, n)]);
      const an = new fig.Animator();
      an.setFigure(root);
      an.set(a, 1, true);
      an.t = an.duration * 0.45;
      an.apply();
      return fig.snapshot(root, g === 'Expressions' ? 'head' : 'full');
    },
    'anim|' + g + '|' + n
  );
} // faces are pictured close, so they can be told apart
let poseRig = null; // the current skin, built once, for the Animate pose strip's pictures
async function poseShot(a, t) {
  const s = R.fit(cur.skin),
    key = JSON.stringify(s);
  if (!poseRig || poseRig.key !== key) poseRig = { key, root: await fig.build(s, R), an: new fig.Animator() };
  const { root, an } = poseRig;
  an.setFigure(root);
  an.set(a, 1, true);
  an.t = t;
  an.apply();
  return fig.snapshot(root, 'full', false, 96);
}
const portrait = skin => {
  const s = R.fit(skin);
  return lazyImg('p|' + JSON.stringify(s), async () => fig.snapshot(await fig.build(s, R), 'full'));
};

// ---------------------------------------------------------------- panels
let ANIMATE = null,
  holdSeq = 0;
function setTab(t) {
  if (t !== 'editor' && wardrobeTab.picking) leavePicker();
  if (t !== tab && (walk.on || walk.crouched || walk.keys.size)) walkStop();
  if (t === 'animate' || t === 'creator') st?.face(0, true); /* posing and editing face the front */
  if (t !== tab && tab === 'animate' && ANIMATE) {
    ANIMATE.leave();
    if (R) playAnim('Default', 'Idle', 0.5);
  } // leaving Animate saves and puts the idle back
  // opening or leaving the Animations tab stops whatever move is playing (and drops what it holds)
  if (
    t !== tab &&
    (t === 'animations' || tab === 'animations') &&
    R &&
    !(animationsTab.playing.group === 'Default' && animationsTab.playing.name === 'Idle')
  )
    playAnim('Default', 'Idle', 0.5);
  if (t !== tab && (t === 'animations' || tab === 'animations') && st)
    st.unclose(); /* in and out of Animations the view returns to the front framing (a move's own camera stays behind) */ // moves are watched whole, from the front, not from a Wardrobe close-up
  if (creatorTab.ED && t !== 'creator')
    closeAsset(true).then(() => {
      playAnim('Default', 'Idle', 0.5);
      rebuild();
      render();
    }); // render again once the piece is closed, or the editor (and its tool tip) stays up under the new tab
  tab = t;
  for (const b of $('tabs').querySelectorAll('button[data-tab]')) b.classList.toggle('on', b.dataset.tab === t);
  const on = $('tabs').querySelector('.on'),
    nav = on?.parentElement; // on a phone the tab row scrolls sideways: keep the open tab in view
  if (nav && nav.scrollWidth > nav.clientWidth)
    nav.scrollTo({
      left: nav.scrollLeft + on.getBoundingClientRect().left - nav.getBoundingClientRect().left - (nav.clientWidth - on.offsetWidth) / 2,
      behavior: 'smooth',
    });
  if (R) render();
}
let pressing = false,
  renderLater = false;
const setPressing = v => (pressing = v);
const flushRender = () => {
  pressing = false;
  if (renderLater) {
    renderLater = false;
    render();
  }
};
addEventListener(
  'pointerdown',
  e => {
    if (e.target.closest?.('button, a, summary, label, select, .skin')) {
      pressing = true;
      setTimeout(flushRender, 1500);
    }
  },
  true
);
for (const ev of ['pointerup', 'pointercancel'])
  addEventListener(
    ev,
    () => {
      if (pressing) setTimeout(flushRender, 0);
    },
    true
  );
function viewInset() {
  // the character is centred above the buttons at the bottom of the view, not behind them
  const stg = $('view')?.parentElement,
    bar = stg?.querySelector('.bar');
  if (!st || !stg) return;
  if (stg.classList.contains('clean')) return; // Clean view keeps the same picture centre as with the buttons
  const on = bar && bar.offsetParent && !stg.classList.contains('clean') && !$('app').classList.contains('ws');
  const em = stg.querySelector('.emotes'),
    sr = stg.getBoundingClientRect(),
    emOn = on && em && em.offsetParent && em.getBoundingClientRect().height > 0;
  const bh = on ? sr.bottom - bar.getBoundingClientRect().top : 0;
  stg.style.setProperty('--bar', bh + 'px');
  st.inset(bh, emOn ? sr.right - em.getBoundingClientRect().left + 4 : 0);
  if (!viewInset.ro) {
    viewInset.ro = new ResizeObserver(() => viewInset());
    viewInset.ro.observe(stg);
  }
}
function render() {
  if (pressing) {
    renderLater = true;
    return;
  }
  jobGen++;
  plate();
  drawEmotes();
  drawTransport();
  drawStageBtns();
  drawGameSwitch();
  outlineBox();
  viewInset();
  if (!!creatorTab.ED !== $('app').classList.contains('ws')) scrollTo(0, 0); // opening or closing the Creator workspace starts at the top of the page
  $('app').classList.toggle('ws', !!creatorTab.ED);
  $('app').classList.toggle('ws-tex', !!creatorTab.ED);
  /* the texture panel is always there in the Creator */ if (creatorTab.ED && document.querySelector('input.rename:not([data-done])'))
    return; /* a part being renamed: the redraw waits (the click that opened it redraws a moment later) */
  if (creatorTab.ED) {
    const fa = document.activeElement,
      fk =
        fa && fa !== document.body && fa.closest?.('#app')
          ? fa.dataset?.fk || [fa.tagName, fa.textContent, fa.title || fa.getAttribute('aria-label') || ''].join('|')
          : null,
      pb_ = creatorTab.ED.box_,
      sl = pb_?.scrollLeft,
      stp = pb_?.scrollTop;
    const r_ = renderWorkspace();
    if (pb_ && creatorTab.ED.box_ === pb_) {
      pb_.scrollLeft = sl;
      pb_.scrollTop = stp;
    }
    /* the zoomed texture view stays where it was */ if (fk && !document.activeElement?.closest?.('#app')) {
      const m = [...document.querySelectorAll('#app button, #app input, #app select')].find(
        x => (x.dataset?.fk || [x.tagName, x.textContent, x.title || x.getAttribute('aria-label') || ''].join('|')) === fk
      );
      m?.focus();
    }
    return r_;
  }
  /* keyboard focus stays on the control after the panel redraws */ const p = $('panel'),
    was = p.className,
    top = p.querySelector('.pbody')?.scrollTop || 0;
  p.className = 'panel tab-' + tab;
  const fa = tab === 'animate' ? document.activeElement : null,
    fk =
      fa && p.contains(fa)
        ? [fa.tagName, fa.getAttribute('aria-label') || '', fa.textContent.slice(0, 40), fa.title || ''].join('|')
        : null,
    keepScroll = [...p.querySelectorAll('.bonelist, .tlwrap')].map(x => x.scrollTop); // the Animate panel keeps focus and its inner scroll through a redraw
  p.replaceChildren(
    ...{
      editor: panelEditor,
      wardrobe: panelWardrobe,
      animations: panelAnimations,
      animate: () => ANIMATE.panel(),
      lookup: panelLookup,
      creator: panelCreator,
      help: panelHelp,
    }[tab]()
  );
  if (was === p.className && top) {
    const b = p.querySelector('.pbody');
    if (b) b.scrollTop = top;
  }
  if (tab === 'animate') {
    [...p.querySelectorAll('.bonelist, .tlwrap')].forEach((x, i) => {
      if (keepScroll[i]) x.scrollTop = keepScroll[i];
    });
    if (fk)
      [...p.querySelectorAll('button, input, select, canvas')]
        .find(x => [x.tagName, x.getAttribute('aria-label') || '', x.textContent.slice(0, 40), x.title || ''].join('|') === fk)
        ?.focus({ preventScroll: true });
  }
}
const head = (title, right) => el('div', { class: 'phead' }, el('h2', { text: title }), right);

// What the tab modules read from here: fixed helpers as they are, changing state through getters. Each module's own
// exports join app once it is made (share), so the modules reach each other through app and never import main.
const app = {
  $,
  FACE_FRAME,
  GONE,
  HEADF,
  HIDE,
  LEGF,
  animThumb,
  ask,
  autosave,
  bareSkin,
  confirmBox,
  download,
  el,
  flush,
  guard,
  head,
  hover,
  itemThumb,
  keepDraft,
  keptSkin,
  lazyImg,
  modLink,
  open,
  peek,
  pics,
  plate,
  portrait,
  pushWearing,
  setEditWear(s) {
    EDITWEAR = s;
    pushWearing();
  },
  readJsonFile,
  rebuild,
  reconnect,
  render,
  restoreFrom,
  say,
  setAccount,
  setDirty,
  setFolder,
  setHist,
  setHpos,
  setPressing,
  setR,
  setScrolledAt,
  setShowGame,
  setSkin,
  setSlot,
  setTab,
  setTabValue,
  setWard,
  showConnect,
  viewInset,
  get ACCOUNT() {
    return ACCOUNT;
  },
  get ANIMATE() {
    return ANIMATE;
  },
  get ASIDE() {
    return ASIDE;
  },
  get CAT() {
    return CAT;
  },
  get FOLDER() {
    return FOLDER;
  },
  get META() {
    return META;
  },
  get R() {
    return R;
  },
  get READY() {
    return READY;
  },
  get SHOWGAME() {
    return SHOWGAME;
  },
  get WARD() {
    return WARD;
  },
  get cur() {
    return cur;
  },
  get dirty() {
    return dirty;
  },
  get hist() {
    return hist;
  },
  get hpos() {
    return hpos;
  },
  get slot() {
    return slot;
  },
  get st() {
    return st;
  },
  get tab() {
    return tab;
  },
};
const share = part => (Object.defineProperties(app, Object.getOwnPropertyDescriptors(part)), part);
const wardrobeTab = share(createWardrobe(app));
const { loadLock, leavePicker, panelEditor } = wardrobeTab;
const stageUi = share(createStage(app));
const { BD_MADE, setBdShown, drawStageBtns, loadEmotes, drawEmotes } = stageUi;
const walking = share(createWalk(app));
const { walk, walkStop } = walking;
const transportBar = share(createTransport(app));
const { drawTransport } = transportBar;
const lockerTab = share(createLocker(app));
const { loadPub, canPublish, locked, panelWardrobe, refreshWard, save, saveAs } = lockerTab;
const animationsTab = share(createAnimations(app));
const { setPropsKey, playAnim, animLabel, panelAnimations } = animationsTab;
const playersTab = share(createPlayers(app));
const { importSkinFiles, panelLookup } = playersTab;
const helpTab = share(createHelp(app));
const { panelHelp } = helpTab;
const creatorTab = share(createCreator(app));
const {
  setAssets,
  isTmp,
  hasCustom,
  reloadAssets,
  registerAssets,
  queueAssetSave,
  rescue,
  applyRescue,
  flushAsset,
  closeAsset,
  geoTwin,
  colourPart,
  partHover,
  bindPaint,
} = creatorTab;
const workspaceUi = share(createWorkspace(app));
const {
  boxesOf,
  outlineBox,
  placeGizmo,
  sizeOf,
  renderWorkspace,
  brushSize,
  drawOvl,
  dragBox,
  combineWith,
  combinePick,
  addBox,
  panelCreator,
} = workspaceUi;
// ---------------------------------------------------------------- wiring
for (const b of $('tabs').querySelectorAll('button[data-tab]')) b.onclick = () => setTab(b.dataset.tab);
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-tab]');
  if (a) {
    e.preventDefault();
    if (R) setTab(a.dataset.tab);
    else
      ask(
        'How this works',
        el('p', {
          text: 'The editor reads the character files from your own Assets.zip and keeps them in this browser only. Nothing is uploaded, and this site hosts no Hytale files.',
        }),
        [{ label: 'OK', value: '', primary: true }]
      );
  }
});
$('undo').onclick = () => step(-1);
$('redo').onclick = () => step(1);
const unsavedOk = go => {
  if (!(flush.stuck && dirty)) return go();
  ask('Not saved', el('p', { text: `My skins is full (${store.CUSTOM_MAX}), so this look isn't saved.` }), [
    { label: 'Cancel', value: '' },
    { label: 'Discard', value: 'yes', danger: true },
  ]).then(v => {
    if (v === 'yes') {
      flush.stuck = false;
      dirty = false;
      go();
    }
  });
}; // New and Randomize ask first too
$('random').onclick = () => unsavedOk(randomNow);
function randomNow() {
  if (cur.id && !cur.random) {
    // another roll right after one replaces that look in place (no pile of saved skins)
    flush();
    cur = { id: null, kind: null, slot: null, name: '', skin: cur.skin };
    hist = [JSON.stringify(cur.skin)];
    hpos = 0;
    dirty = false;
  } // never overwrites a saved look
  setSkin(
    R.random(e => !e.custom && !isTmp(e)),
    true
  );
}
$('new').onclick = () =>
  unsavedOk(() => {
    flush();
    cur = { id: null, kind: null, slot: null, name: '', skin: R.blank() };
    hist = [JSON.stringify(cur.skin)];
    hpos = 0;
    dirty = false;
    keepDraft();
    rebuild();
    render();
  });
$('front').onclick = () => st.view(true);
$('ingame').onclick = async () => {
  SHOWGAME = !SHOWGAME;
  await db.put('meta', 'showInGame', SHOWGAME).catch(() => {});
  drawGameSwitch();
  pushWearing();
  say(SHOWGAME ? 'Showing in game' : 'Your own skin is back in game');
};
$('save').onclick = save;
$('saveas').onclick = saveAs;
addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && !creatorTab.ED) {
    e.preventDefault();
    flush();
    return;
  } /* Ctrl+S saves now instead of saving the web page */
  if (!R || e.target?.matches?.('input, textarea, select') || $('dlg').open) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    step(e.shiftKey ? 1 : -1);
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
    e.preventDefault();
    step(1);
  }
});

// one tab at a time: a newly opened tab asks the others to save and step aside, so two tabs never write over each other
let ASIDE = false;
const TAB_ID = Math.random().toString(36).slice(2),
  TABS = 'BroadcastChannel' in self ? new BroadcastChannel('skin-editor-tabs') : null;
let READY = false,
  HANDING = false;
const BORN = Date.now();
for (const ev of ['keydown', 'pointerdown', 'wheel'])
  addEventListener(
    ev,
    e => {
      if (ASIDE || HANDING) {
        e.stopImmediatePropagation();
        if (ev !== 'wheel') e.preventDefault();
      }
    },
    { capture: true, passive: false }
  ); /* a tab handing off or stepped aside takes no edits */
const stepAside = () => {
  ASIDE = true;
  HANDING = false;
  try {
    if ($('dlg').open) $('dlg').close('');
  } catch {
    /* no dialog */
  }
  if (document.querySelector('.elsewhere')) return;
  document.body.append(
    el(
      'div',
      { class: 'elsewhere' },
      el(
        'div',
        { class: 'elsebox' },
        el('b', { text: 'Open in another tab' }),
        el('button', { class: 'btn primary', text: 'Use here', onclick: () => location.reload() })
      )
    )
  );
};
if (TABS)
  TABS.onmessage = async e => {
    const m = e.data || {};
    if (!m.hi || m.hi === TAB_ID || ASIDE || HANDING) return;
    if (!READY) {
      if ((m.t || 0) > BORN) stepAside();
      return;
    } /* still starting: nothing loaded to save; the older starter wins */
    HANDING = true;
    TABS.postMessage({ wait: m.hi });
    try {
      document.activeElement?.blur?.();
    } catch {
      /* typed names commit on blur */
    }
    clearTimeout(queueAssetSave.t);
    clearTimeout(autosave.t);
    try {
      if (creatorTab.ED) await flushAsset();
      if (creatorTab.ED && creatorTab.ED.before) cur.skin = keptSkin();
      dirty = dirty || !!creatorTab.ED;
      await flush();
      await db.put('meta', 'draft', {
        id: cur.id,
        kind: cur.kind,
        slot: cur.slot,
        name: cur.name,
        skin: cur.skin,
        auto: !!cur.auto,
        random: !!cur.random,
        t: Date.now(),
      });
    } catch (err) {
      console.error(err);
    }
    if (creatorTab.ED && creatorTab.ED.saved === false) rescue(); /* a save that failed still leaves a rescue copy */
    stepAside();
    TABS.postMessage({ bye: m.hi });
  };
const claimTab = () =>
  !TABS
    ? Promise.resolve()
    : new Promise(ok => {
        let t = setTimeout(done, 120);
        function done() {
          clearTimeout(t);
          TABS.removeEventListener('message', on);
          ok();
        }
        function on(e) {
          if (e.data?.wait === TAB_ID) {
            clearTimeout(t);
            t = setTimeout(done, 15000);
          }
          if (e.data?.bye === TAB_ID) done();
        }
        TABS.addEventListener('message', on);
        TABS.postMessage({ hi: TAB_ID, t: BORN });
      }); /* another tab answers 'wait' at once, then 'bye' once saved */
(async function boot() {
  drawAcct();
  try {
    await claimTab();
    // Local development only: read the developer's own Assets.zip through the dev server (dev/ is never deployed).
    if (
      (['localhost', '127.0.0.1'].includes(location.hostname) || location.hostname.endsWith('.localhost')) &&
      new URLSearchParams(location.search).has('devzip') &&
      ((await game.status())?.v || 0) < game.FILES_V
    ) {
      // dev: read again whenever the file list grows
      const { devSource } = await import('../dev/devsource.js');
      showConnect();
      return doConnect(async () => game.importFrom(await devSource(), { name: 'Assets.zip (dev)', size: 0, modified: 0 }, progress));
    }
    if (await game.status()) {
      await startApp();
      checkGameUpdate().then(trimThumbs);
    } else showConnect();
  } catch (e) {
    console.error(e);
    showConnect();
    $('connerr').textContent = 'This browser blocked local storage, which the editor needs. Try a normal (not private) window.';
  }
})();
