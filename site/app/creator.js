// The Create tab: custom items (assets), opening and saving them, painting, pictures and the paid-item checks.
import * as game from './game.js';
import * as db from './db.js';
import * as fig from './figure.js';
import * as store from './store.js';
import * as assets from './assets.js';
import { pickList } from './picklist.js';
import { createPainter, SHAPES, ONCE } from './paint.js';
import { cleanName, clip, parse, nice, LABEL } from './skin.js';
import * as prefs from './prefs.js';

export function createCreator(app) {
  const {
    $,
    el,
    say,
    guard,
    ask,
    setTabValue,
    setHist,
    setHpos,
    setDirty,
    setWard,
    setShowGame,
    setSkin,
    pushWearing,
    autosave,
    restoreFrom,
    keptSkin,
    flush,
    keepDraft,
    rebuild,
    pics,
    HEADF,
    LEGF,
    lazyImg,
    HIDE,
    FACE_FRAME,
    bareSkin,
    itemThumb,
    setPressing,
    viewInset,
    render,
    TIERS,
    tierOf,
    loadLock,
    loadEmotes,
    sayUndo,
    setMount,
    playAnim,
  } = app;
  // ---------------------------------------------------------------- asset creator
  let ASSETS = [],
    ED = null,
    edN = 0;
  const nextEdN = () => ++edN;
  const setAssets = v => (ASSETS = v);
  const itemName = e =>
    e && e.custom
      ? e.Name
      : String((e && app.CAT.names && app.CAT.names[e.Name]) || nice(e ? e.Id : '')).replace(
          /^\[[A-Z]+\]\s*/,
          ''
        ); /* the game's own work tags ([TMP]) are not part of the name */
  // names the game already uses (its items and moves): custom pieces may not take them, and items sharing one show once
  function gameNamed(n) {
    const k = String(n).trim().toLowerCase();
    if (!gameNamed.set || gameNamed.cat !== app.CAT) {
      gameNamed.cat = app.CAT;
      gameNamed.set = new Set([
        ...Object.values(app.CAT.items)
          .flat()
          .filter(e => !e.custom)
          .map(e => itemName(e).toLowerCase()),
        ...Object.values(app.CAT.anims || {})
          .flat()
          .map(a => nice(a).toLowerCase()),
      ]);
    }
    return gameNamed.set.has(k);
  }
  const isTmp = e =>
    !e.custom && (/^\s*\[?tmp\]?/i.test(itemName(e)) || /\bW\.?I\.?P\b/i.test(itemName(e)) || /(^|_)(tmp|wip)(_|$)/i.test(e.Id)); // the game's unfinished placeholder items
  const oneEach = items => {
    const seen = new Set();
    return items.filter(e => {
      if (e.custom) return true;
      const k = itemName(e).toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };
  const hasCustom = skin => Object.values(skin).some(v => typeof v === 'string' && v.startsWith('Custom_'));
  async function reloadAssets() {
    ASSETS = await assets.list().catch(() => []);
    registerAssets();
    await loadLock();
    await loadEmotes();
    setShowGame(!!(await db.get('meta', 'showInGame').catch(() => false)));
    app.cur.skin = app.R.fit(app.cur.skin);
  }
  const syncFolder = () => store.sync().catch(e => say(e.message, true));
  function registerAssets() {
    // custom assets join the catalogue as extra items in their slot, so the editor treats them like any other
    for (const f of game.FIELDS) {
      const arr = app.CAT.items[f];
      for (let i = arr.length - 1; i >= 0; i--) if (arr[i].custom) arr.splice(i, 1);
    }
    for (const a of ASSETS) {
      const base = app.CAT.items[a.field].find(e => e.Id === a.baseId) || {};
      app.CAT.items[a.field].push({
        ...base,
        Id: 'Custom_' + a.id,
        custom: true,
        baseId: a.baseId,
        Name: a.name,
        Tone: a.tone,
        Model: (ED && ED.asset.id === a.id ? ED.model : a.shape)
          ? `shape:${a.id}@${ED && ED.asset.id === a.id ? 'e' + ED.n + '.' + (ED.shapeN || 0) : a.updated}`
          : a.model,
        Variants: undefined,
        GradientSet: undefined,
        GreyscaleTexture: undefined,
        IsDefaultAsset: false,
        Textures: { Mine: { Texture: `custom:${a.id}@${ED && ED.asset.id === a.id ? 'live' + ED.n : a.updated}`, BaseColor: ['#f4c452'] } },
      });
    }
  }
  fig.setCustomSource(async id => {
    if (ED && ED.asset.id === id) return ED.canvas;
    const a = ASSETS.find(x => x.id === id);
    if (!a) throw new Error('that custom asset is gone');
    const bmp = await createImageBitmap(a.data),
      c = document.createElement('canvas');
    c.width = bmp.width;
    c.height = bmp.height;
    c.getContext('2d').drawImage(bmp, 0, 0);
    return c;
  });
  const newAsset = guard(async (f, val) => {
    if (newAsset.busy) return;
    newAsset.busy = true; /* a double click makes one copy */
    document.body.classList.add('busy');
    try {
      await makeAsset(f, val);
    } finally {
      document.body.classList.remove('busy');
      newAsset.busy = false;
    }
  });
  async function makeAsset(f, val) {
    if (ASSETS.length + MAKING >= assets.MAX) throw new Error(`My items is full (${assets.MAX})`);
    MAKING++;
    try {
      return await makeAsset1(f, val);
    } finally {
      MAKING--;
    }
  }
  async function makeAsset1(f, val) {
    if (val && app.cur.skin[f] && parse(app.cur.skin[f]).id === parse(val).id)
      val = app.cur.skin[f]; /* the worn item keeps its worn colour */
    const skin = val ? { ...app.cur.skin, [f]: val } : { ...app.cur.skin };
    for (const h of HIDE[f] || []) delete skin[h];
    const r = app.R.resolve(f, skin),
      it = app.R.find(f, skin[f]);
    if (!r || !it) throw new Error('Pick an item');
    const paidBase = it.custom ? app.CAT.items[f].find(e => e.Id === it.baseId) : it;
    if (paidBase && paidLocked(paidBase))
      throw new Error(
        `${itemName(paidBase)} is a ${TIERS[tierOf(paidBase)]} item. Paid items can only be edited by an account that owns them.`
      );
    const src = it.custom ? ASSETS.find(x => 'Custom_' + x.id === it.Id) : null;
    if (it.custom && !src) throw new Error('That custom item is gone. Pick another one.');
    let a;
    if (src) a = await assets.save({ ...src, id: assets.newId(), name: copyName(src.name), flag: undefined });
    else {
      const c = await fig.bakedCanvas(r.tex, r.tint).catch(() => {
          throw new Error(`${itemName(it)} is not in your game files, so it can't be edited here.`);
        }),
        data = await new Promise(ok => c.toBlob(ok, 'image/png'));
      a = await assets.save({
        id: assets.newId(),
        name: (() => {
          const used = new Set(ASSETS.map(x => x.name)),
            b = itemName(it) + ' (mine)';
          let n = b,
            k = 2;
          while (used.has(n)) n = cleanName(clip(itemName(it), 30) + ' (mine) ' + k++);
          return n;
        })(),
        field: f,
        baseId: it.Id,
        model: r.model,
        w: c.width,
        h: c.height,
        data,
        tone: f === 'bodyCharacteristic' ? parse(skin[f]).color || undefined : undefined,
      });
    }
    ASSETS = await assets.list();
    registerAssets();
    beforeEdit = app.cur.skin;
    editMark ||= { at: app.hpos, dirty: app.dirty };
    setSkin({ ...app.cur.skin, [f]: 'Custom_' + a.id + '.Mine' });
    setDirty(editMark.dirty);
    await openAsset(a);
  }
  const makePainter = (c, a) =>
    createPainter(
      c,
      final => {
        fig.refreshCustom(a.id);
        if (final) {
          queueAssetSave();
          app.recordPaint();
          if (ED && !ED.replaying) render();
        }
      },
      () => render()
    );
  // a texture with no free room grows downwards (twice as tall, up to 256): the old paint stays where it was, the new rows are empty
  function growWider() {
    const c = ED.canvas;
    if (c.width >= 256) return false;
    ED.painter.grow(c.height, Math.min(256, c.width * 2));
    /* up to 256, also from sizes that are not powers of two */ ED.asset = { ...ED.asset, w: c.width };
    ED.n = ++edN;
    requestAnimationFrame(() => {
      if (ED) {
        if (!ED.userZoom) app.fitTexture();
        render();
      }
    });
    return true;
  }
  function growAny() {
    const c = ED.canvas;
    return c.width < c.height ? growWider() || growTexture() : growTexture() || growWider();
  } // grows the shorter side first
  function growTexture() {
    const c = ED.canvas;
    if (c.height >= 256) return false;
    ED.painter.grow(Math.min(256, c.height * 2));
    ED.asset = { ...ED.asset, h: c.height };
    ED.n = ++edN;
    requestAnimationFrame(() => {
      if (ED) {
        if (!ED.userZoom) app.fitTexture();
        render();
      }
    });
    return true;
  }
  async function openAsset(a) {
    say('');
    if (ED) await closeAsset(true);
    const bmp = await createImageBitmap(a.data),
      c = el('canvas', { width: bmp.width, height: bmp.height, className: 'paint' });
    c.getContext('2d', { willReadFrequently: true }).drawImage(bmp, 0, 0);
    ED = {
      frame: true,
      asset: a,
      canvas: c,
      n: ++edN,
      zoom: Math.max(2, Math.min(8, Math.floor(280 / bmp.width))),
      rects: [],
      mode: 'paint',
      stool: 'move',
      hist: [],
      fut: [],
    };
    if (a.shape) ED.model = JSON.parse(a.shape);
    try {
      ED.rects = fig.usedRects(ED.model || (await game.json(game.common(a.model))));
    } catch (e) {
      console.warn('no drawn area for', a.model, e);
    }
    ED.painter = makePainter(c, a);
    Object.assign(ED.painter, BRUSH);
    ED.painter.faceRect = (x, y) =>
      ED.rects.filter(q => x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h).sort((p_, q) => p_.w * p_.h - q.w * q.h)[0] || null; // the texture face a fill starts on
    {
      const k = STEPS.get(a.id);
      if (k && ED.painter.takeSteps(k.paint)) {
        ED.hist = k.hist;
        ED.fut = k.fut;
        ED.asset = { ...ED.asset, w: c.width, h: c.height };
      }
      if (k && k.mode === 'shape') ED.reopenShape = true;
    }
    ED.painter.twinAt = (x, y) => (app.st ? app.st.twinTexel(ED.canvas, x, y) : null);
    ED.painter.symOn = () => !!(ED && ED.mirror && app.st && !ONCE.has(ED.painter.tool)); // Symmetry: the painter maps every texel it paints to its twin
    ED.painter.faceAt = (x, y) => ED && ED.rects.find(r => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h); // Fill > Whole side: which side was clicked
    if (ED.rects.length) {
      const m = new Uint8Array(c.width * c.height);
      for (const r of ED.rects)
        for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(c.height, Math.ceil(r.y + r.h)); y++)
          for (let x = Math.max(0, Math.floor(r.x)); x < Math.min(c.width, Math.ceil(r.x + r.w)); x++) m[y * c.width + x] = 1;
      ED.painter.mask = m;
    }
    ED.palette = ED.painter.palette();
    ED.ovl = el('canvas', { className: 'limits' });
    requestAnimationFrame(() => {
      app.fitTexture();
      render();
    });
    setTimeout(() => {
      if (ED && !ED.userZoom) {
        const z = ED.zoom;
        app.fitTexture();
        if (ED.zoom !== z) render();
      }
    }, 150);
    /* also when no frame comes (background tab) */ if (ED.reopenShape) {
      ED.reopenShape = false;
      app.setMode('shape').catch(e => console.warn(e));
    }
    const flatPx = e => {
      const r = c.getBoundingClientRect();
      return {
        x: Math.min(c.width - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * c.width))),
        y: Math.min(c.height - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * c.height))),
      };
    };
    const flatPxM = e => {
      const p = flatPx(e);
      if (ED && ED.mirror && app.st) {
        const m = app.st.twinTexel(ED.canvas, p.x, p.y);
        if (m && (m.x !== p.x || m.y !== p.y)) p.m = m;
      }
      return p;
    }; /* Symmetry on the flat texture: the matching texel on the other side */
    bindPaint(c, flatPxM, 1e9);
    app.bindSelect(c, flatPx);
    c.addEventListener('pointermove', e => {
      if (!ED) return;
      ED.hover = flatPx(e);
      ED.hoverM = null;
      app.drawOvl();
    });
    c.addEventListener('pointerleave', () => {
      if (!ED) return;
      ED.hover = null;
      app.drawOvl();
    });
    registerAssets();
    ED.before = beforeEdit || app.cur.skin;
    beforeEdit = null;
    {
      const s = { ...app.cur.skin, [a.field]: 'Custom_' + a.id + '.Mine' },
        cov = (HIDE[a.field] || []).filter(f => s[f]);
      for (const f of cov) delete s[f];
      if (cov.length || !(app.cur.skin[a.field] || '').startsWith('Custom_' + a.id)) {
        editMark ||= { at: app.hpos, dirty: app.dirty };
        setSkin(s);
        setDirty(editMark.dirty);
      }
    } /* what covers the item comes off while editing */
    setMount(null);
    ED.iso = true;
    app.st.isolate(c);
    app.st.anim.set(null);
    app.st.paintMode(true);
    setTabValue('creator');
    for (const b of $('tabs').querySelectorAll('button[data-tab]')) b.classList.toggle('on', b.dataset.tab === 'creator');
    render();
    rebuild();
  }
  const BRUSH = (() => {
    try {
      const b = JSON.parse(prefs.get('se_brush') || '{}'),
        o = {};
      if (/^#[0-9a-f]{6}$/i.test(b.color)) o.color = b.color;
      if (b.size >= 1 && b.size <= 8) o.size = Math.round(b.size);
      if (b.opacity > 0 && b.opacity <= 1) o.opacity = b.opacity;
      if (['area', 'side', 'every'].includes(b.fillMode)) o.fillMode = b.fillMode;
      if (['brush', 'erase', 'part', 'fill', 'pick', 'replace', 'line', 'box', 'boxfill', 'light', 'dark', 'noise'].includes(b.tool))
        o.tool = b.tool;
      return o;
    } catch {
      return {};
    }
  })();
  const keepBrush = () => {
    if (!ED) return;
    const P = ED.painter;
    Object.assign(BRUSH, {
      color: P.color,
      size: P.size,
      opacity: P.opacity,
      fillMode: P.fillMode,
      tool: P.tool === 'select' ? 'brush' : P.tool,
    });
    prefs.set('se_brush', JSON.stringify(BRUSH));
  };
  const markSaved = ok => {
    if (!ED) return;
    ED.saved = ok;
    const s = $('wssaved');
    if (s) {
      s.textContent = ok ? 'Saved' : 'Saving…';
      s.classList.toggle('busy', !ok);
    }
  };
  function queueAssetSave() {
    markSaved(false);
    clearTimeout(queueAssetSave.t);
    queueAssetSave.pending = true;
    queueAssetSave.t = setTimeout(() => {
      queueAssetSave.pending = false;
      flushAsset().catch(e => {
        console.warn(e);
        say('Could not save', true);
      });
    }, 400);
  }
  // leaving or hiding the page saves a waiting edit at once; if one is still waiting on reload or close, the browser asks first, so no edit is lost
  // a reload can cut the async save short: the unsaved item is also kept in localStorage at once, and put back on the next start
  const rescue = () => {
    try {
      if (document.activeElement?.matches?.('.wsname')) document.activeElement.blur();
    } catch {
      /* fine */
    }
    try {
      if (ED?.adjOpen && ED.adjCancel) ED.adjCancel();
    } catch {
      /* fine */
    }
    /* the rescue copy never holds a colour preview */ if (!ED || app.ASIDE || !(queueAssetSave.pending || ED.saved === false)) return;
    try {
      const out = trimmedCanvas(ED);
      prefs.set(
        'se_rescue',
        JSON.stringify({
          id: ED.asset.id,
          t: Date.now(),
          name: ED.asset.name,
          png: out.toDataURL('image/png'),
          w: out.width,
          h: out.height,
          shape: ED.model && ED.shapeN ? JSON.stringify(ED.model) : null,
          labels: ED.asset.labels || null,
          split: !!ED.asset.split,
        })
      );
    } catch {
      /* storage full or blocked */
    }
  };
  async function applyRescue() {
    const r = prefs.getJson('se_rescue');
    prefs.del('se_rescue');
    if (!r || typeof r.png !== 'string') return;
    const a = ASSETS.find(x => x.id === r.id);
    if (!a || (a.updated || 0) >= r.t) return;
    const bin = atob(r.png.split(',')[1] || ''),
      u8 = Uint8Array.from(bin, c => c.charCodeAt(0));
    await assets.save({
      ...a,
      data: new Blob([u8], { type: 'image/png' }),
      w: r.w,
      h: r.h,
      name: r.name || a.name,
      shape: r.shape || a.shape,
      labels: r.labels || a.labels,
      split: !!r.split,
    });
    ASSETS = await assets.list();
    registerAssets();
  }
  const flushNow = () => {
    if (queueAssetSave.pending) {
      queueAssetSave.pending = false;
      flushAsset().catch(() => {});
    }
  };
  addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushNow();
  });
  addEventListener('pageshow', e => {
    if (e.persisted) location.reload();
  }); // back/forward cache: start fresh, the pagehide below already saved
  addEventListener('pagehide', () => {
    rescue();
    flushNow();
    if (app.dirty && !app.ASIDE && app.READY) {
      clearTimeout(keepDraft.t);
      try {
        db.put('meta', 'draft', {
          id: app.cur.id,
          kind: app.cur.kind,
          slot: app.cur.slot,
          name: app.cur.name,
          skin: keptSkin(),
          auto: !!app.cur.auto,
          random: !!app.cur.random,
          t: Date.now(),
        }).catch(() => {});
      } catch {
        /* closing */
      }
      flush();
    }
    /* the outfit starts saving at once, not after its timer */ if (!app.ASIDE && app.READY && app.cur)
      try {
        prefs.set(
          'se_draft',
          JSON.stringify({
            id: app.cur.id,
            kind: app.cur.kind,
            slot: app.cur.slot,
            name: app.cur.name,
            skin: ED ? keptSkin() : app.cur.skin,
            auto: !!app.cur.auto,
            random: !!app.cur.random,
            dirty: !!app.dirty,
            t: Date.now(),
          })
        );
      } catch {
        /* blocked */
      }
    /* the outfit survives a quick reload */ if (!app.ASIDE && ED && (ED.before || beforeEdit)) {
      app.cur.skin = ED.before ? keptSkin() : beforeEdit;
      db.put('meta', 'draft', {
        id: app.cur.id,
        kind: app.cur.kind,
        slot: app.cur.slot,
        name: app.cur.name,
        skin: app.cur.skin,
        auto: !!app.cur.auto,
        t: Date.now(),
      }).catch(() => {});
    }
  });
  addEventListener('beforeunload', e => {
    if (app.dirty && !app.ASIDE && app.READY && (autosave.t || keepDraft.t)) {
      flush();
    } /* a change still on its save timer starts saving now */
    if (queueAssetSave.pending || (ED && ED.saved === false)) {
      rescue();
      flushNow();
      e.preventDefault();
      e.returnValue = '';
    }
  });
  // the saved picture is only as big as what is drawn and used (a texture that grew for parts since removed shrinks back), in powers of two
  function trimmedCanvas(e) {
    const c = e.canvas,
      W = c.width,
      H = c.height;
    let mx = 0,
      my = 0;
    for (const r of e.rects || []) {
      mx = Math.max(mx, Math.ceil(r.x + r.w));
      my = Math.max(my, Math.ceil(r.y + r.h));
    }
    const d = c.getContext('2d').getImageData(0, 0, W, H).data;
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++)
        if (d[(y * W + x) * 4 + 3]) {
          if (x + 1 > mx) mx = x + 1;
          if (y + 1 > my) my = y + 1;
        }
    const up = v => {
        let k = 16;
        while (k < v) k *= 2;
        return k;
      },
      w = Math.min(W, up(mx)),
      h = Math.min(H, up(my));
    if (w === W && h === H) return c;
    const t = document.createElement('canvas');
    t.width = w;
    t.height = h;
    t.getContext('2d').drawImage(c, 0, 0);
    return t;
  }
  async function flushAsset() {
    clearTimeout(queueAssetSave.t);
    if (!ED || app.ASIDE) return;
    if (ED.adjOpen) {
      ED.saveDeferred = true;
      markSaved(false);
      return;
    }
    /* never save a colour preview; it saves once Adjust closes */ const e = ED,
      out = trimmedCanvas(e),
      data = await new Promise(ok => out.toBlob(ok, 'image/png'));
    const sent = e.asset,
      n0 = e.shapeN;
    let ok = false,
      threw = true;
    try {
      const saved = await assets.save({
        ...sent,
        data,
        w: out.width,
        h: out.height,
        shape: e.model && e.shapeN ? JSON.stringify(e.model) : sent.shape,
      });
      e.asset =
        e.asset === sent
          ? saved
          : {
              ...e.asset,
              w: saved.w,
              h: saved.h,
              updated: saved.updated,
              shape: saved.shape,
            }; /* a rename or new labels made during the save are kept */
      threw = false;
      ok = e.asset === saved && e.shapeN === n0;
      ASSETS = await assets.list();
      syncFolder();
    } finally {
      if (ED === e) {
        if (ok) markSaved(true);
        else {
          markSaved(false);
          e.fails = threw ? (e.fails || 0) + 1 : 0;
          if (!queueAssetSave.pending && e.fails < 3) queueAssetSave();
          if (e.fails >= 3 && $('wssaved')) $('wssaved').textContent = 'Not saved';
        }
      }
    }
  } /* a failed or overtaken save stays unsaved and tries again */
  let editMark = null; // the outfit history point and save state before an item went on for editing: Done goes back to it with no trace
  let beforeEdit = null; // the outfit before an item went on for editing: Done puts it back, Equip keeps the item on
  const STEPS = new Map(); // undo history per custom item, kept for this visit so reopening an item can still undo
  function closeAsset(quiet, keep = false) {
    return (closeAsset.last = closeAsset1(quiet, keep));
  } // the last close is kept, so a delete can wait for its save
  async function closeAsset1(quiet, keep = false) {
    if (!ED) return;
    $('app').classList.remove('ws-wide');
    /* the panel width goes back with the editor */ if (ED.adjOpen && ED.adjCancel) ED.adjCancel();
    /* Done with Adjust open drops the preview first */ const before = ED.before,
      fld = ED.asset.field,
      edited = ED.asset.id;
    keepBrush();
    if (ED.float) app.placeFloat();
    STEPS.delete(ED.asset.id);
    STEPS.set(ED.asset.id, { hist: ED.hist, fut: ED.fut, paint: ED.painter.keepSteps(), mode: ED.mode });
    while (STEPS.size > 4) STEPS.delete(STEPS.keys().next().value);
    /* undo history is kept for the last few items only (each can hold tens of MB) */ app.tour(99);
    if ($('viewhint')) $('viewhint').hidden = true;
    app.st.cursor(null);
    await checkReplica();
    if (queueAssetSave.pending || ED.saved === false) await flushAsset().catch(() => {});
    else clearTimeout(queueAssetSave.t);
    if (ED && ED.saved === false && ED.fails) {
      rescue();
      say('Could not save', true);
      return;
    } /* a failing save keeps the editor open (and a rescue copy) instead of dropping the work */
    ED = null;
    /* nothing changed: nothing is re-saved */ if ($('viewhint')) $('viewhint').hidden = true;
    registerAssets();
    const mark = editMark;
    editMark = null;
    if (before) {
      const fs = [...(keep ? [] : [fld]), ...(HIDE[fld] || [])],
        s = restoreFrom(app.cur.skin, before, fs);
      if (!keep && mark && app.hist[mark.at] && JSON.stringify(app.R.fit(JSON.parse(app.hist[mark.at]))) === JSON.stringify(app.R.fit(s))) {
        const s0 = app.R.fit(JSON.parse(app.hist[mark.at]));
        setHist(app.hist.slice(0, mark.at + 1));
        setHpos(mark.at);
        app.cur.skin = s0;
        setDirty(mark.dirty);
        pushWearing();
        keepDraft();
        rebuild();
        render();
      } /* Done without Wear: the outfit and its history are as before */ else if (JSON.stringify(s) !== JSON.stringify(app.cur.skin))
        setSkin(s);
      else if (keep) {
        setDirty(true);
        autosave();
        keepDraft();
      }
    }
    app.st.highlight(null);
    app.st.isolate(null);
    app.st.paintMode(false);
    app.st.gizmo(null);
    setTimeout(() => {
      viewInset();
      app.st.unclose();
    }, 60);
    for (const k of [...pics.keys()]) if (k.includes(edited)) pics.delete(k);
    if (!quiet) {
      playAnim('Default', 'Idle', 0.5);
      rebuild();
      render();
    }
  }
  // painting: the same strokes whether the pointer is on the flat texture or on the 3D model
  function geoTwin(node) {
    // the part on the other side found on the model itself (parts nested under unnamed halves, like a pigtail's Side under Top~2)
    const votes = new Map();
    for (const r of ED.rects.filter(x => x.node === node))
      for (const [fx, fy] of [
        [0.5, 0.5],
        [0.25, 0.25],
        [0.75, 0.75],
      ]) {
        const t = app.st.twinTexel(ED.canvas, Math.floor(r.x + r.w * fx), Math.floor(r.y + r.h * fy));
        if (!t) continue;
        for (const o of ED.rects)
          if (o.node !== node && t.x >= o.x && t.x < o.x + o.w && t.y >= o.y && t.y < o.y + o.h)
            votes.set(o.node, (votes.get(o.node) || 0) + 1);
      }
    const best = [...votes].sort((a, b) => b[1] - a[1])[0];
    return best ? best[0] : null;
  } /* a name: look it up after the model is rebuilt */
  const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  function sharersOf(node) {
    const mine = ED.rects.filter(r => r.node === node);
    return [...new Set(ED.rects.filter(r => r.node !== node && mine.some(m => overlaps(m, r))).map(r => r.node))];
  }
  async function colourPart(node) {
    ED.noCap = true;
    const h0 = ED.hist.length,
      splitWas = !!ED.asset.split,
      sz0 = [ED.canvas.width, ED.canvas.height];
    await app.editModel();
    app.splitShared(); /* every part (cuffs and other attached pieces too) gets its own paint first, so the colour never leaks to a twin */
    const others = sharersOf(node);
    if (others.length) {
      await app.editModel();
      const k = app.boxesOf(ED.model).findIndex(b => b.node.name === node);
      if (k >= 0) {
        ED.box = k;
        if (!app.ownArea(true)) {
          if (ED.hist.length > h0)
            ED.hist.push({
              k: 'g',
              splitWas,
              splitNow: !!ED.asset.split,
              sz: [sz0, [ED.canvas.width, ED.canvas.height]],
              parts: ED.hist.splice(h0),
            });
          ED.noCap = false;
          app.capHist();
          return say('Texture full', true);
        }
      }
    }
    let tw = null;
    if (ED.mirror) {
      const bb = app.boxesOf(ED.model).find(x => x.node.name === node);
      tw = bb && app.twinOf(bb);
      if (tw && tw.name === node) tw = null;
      if (!tw) {
        const m = /^(.*)~(\d+)$/.exec(node),
          other = m ? (m[2] === '2' ? m[1] : null) : node + '~2';
        tw = (other && app.boxesOf(ED.model).find(b => b.node.name === other)?.node) || null;
      }
    } /* a shared mirrored part the split copied (Side under Top, Side~2 under Top~2) */
    if (tw && sharersOf(tw.name).some(n => n !== node)) {
      await app.editModel();
      const k = app.boxesOf(ED.model).findIndex(b => b.node.name === tw.name);
      if (k >= 0) {
        const was = ED.box;
        ED.box = k;
        if (!app.ownArea(true)) tw = null;
        ED.box = was;
      }
    } /* the twin's paint must not leak to the parts it shares texture with either */
    app.tintAll(ED.painter.color, tw ? [node, tw.name] : node); /* Symmetry: both sides in one pass, one shared shade, one step */
    if (ED.hist.length > h0)
      ED.hist.push({
        k: 'g',
        splitWas,
        splitNow: !!ED.asset.split,
        sz: [sz0, [ED.canvas.width, ED.canvas.height]],
        parts: ED.hist.splice(h0),
      });
    if (ED.lastTint) ED.lastTint.top = ED.hist[ED.hist.length - 1];
    ED.noCap = false;
    app.capHist(); /* one click, one undo (the cap waits, so it can't shift the start) */
  }
  const partName = n => {
    const b = ED.model && app.boxesOf(ED.model).find(x => x.node.name === n);
    return b ? app.boxLabel(b.node) : /^Box_/.test(n) ? 'New box' : app.boxLabel({ name: n });
  }; // same names in Paint as in Shape's outliner
  function partHover(e) {
    if (ED.mode === 'shape' || ED.painter.tool !== 'part') return;
    const m = app.st.pickMesh(e.clientX, e.clientY, o => o.material?.map?.image === ED.canvas),
      n = m ? m.userData.nodeName : null;
    if (n === ED.partLit) return;
    ED.partLit = n;
    app.st.highlight(n ? o => o.material?.map?.image === ED.canvas && o.userData.nodeName === n : null);
  }
  function partAt(e, onModel, toPixel) {
    // the box under the pointer: on the model by its mesh, on the texture by the area it owns
    if (onModel) {
      const m = app.st.pickMesh(e.clientX, e.clientY, o => o.material?.map?.image === ED.canvas);
      return m ? m.userData.nodeName : null;
    }
    const p = toPixel(e);
    if (!p) return null;
    const hit = ED.rects
      .filter(q => p.x >= q.x && p.x < q.x + q.w && p.y >= q.y && p.y < q.y + q.h)
      .sort((a, b) => a.w * a.h - b.w * b.h)[0];
    return hit ? hit.node : null;
  }
  function turnDrag(e) {
    // drag on empty space or another body part: the model turns, like right-drag
    const v = $('view');
    let x = e.clientX,
      y = e.clientY;
    try {
      v.setPointerCapture(e.pointerId);
    } catch {
      /* fine */
    }
    const move = ev => {
      app.st.orbit(ev.clientX - x, ev.clientY - y);
      x = ev.clientX;
      y = ev.clientY;
    };
    const up = () => {
      v.removeEventListener('pointermove', move);
      v.removeEventListener('pointerup', up);
      v.removeEventListener('pointercancel', up);
    };
    v.addEventListener('pointermove', move);
    v.addEventListener('pointerup', up);
    v.addEventListener('pointercancel', up);
  }
  function bindPaint(target, toPixel, reach, onModel) {
    let down = false,
      last = null;
    let lastC = null,
      startC = null;
    const at = (x, y) => toPixel({ clientX: x, clientY: y });
    const along = (a, b, step = 2) => {
      const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / step)),
        out = [];
      for (let i = 1; i <= n; i++) out.push({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n });
      return out;
    };
    const outline = (a, b) => {
      const c = [a, { x: b.x, y: a.y }, b, { x: a.x, y: b.y }, a];
      const pts = [a];
      for (let i = 0; i < 4; i++) pts.push(...along(c[i], c[i + 1]), null);
      return pts;
    };
    const shapeOnModel = (cur, final) => {
      const t = ED.painter.tool,
        a = startC;
      let pts;
      if (t === 'line') pts = [a, ...along(a, cur)];
      else if (t === 'boxfill' && final) {
        pts = [];
        const x0 = Math.min(a.x, cur.x),
          x1 = Math.max(a.x, cur.x),
          y0 = Math.min(a.y, cur.y),
          y1 = Math.max(a.y, cur.y);
        for (let y = y0; y <= y1; y += 2) {
          for (let x = x0; x <= x1; x += 2) pts.push({ x, y });
          pts.push(null);
        }
      } else pts = outline(a, cur);
      ED.painter.trace(
        pts.map(q => q && at(q.x, q.y)),
        reach
      );
    };
    target.addEventListener('pointerdown', e => {
      if (!ED || e.button !== 0 || (!onModel && (ED.painter.tool === 'select' || ED.mode === 'shape'))) return;
      if (ED.adjOpen) {
        if (onModel) turnDrag(e);
        return;
      } /* no painting while colours are being adjusted: Cancel must put everything back */
      if (ED.painter.tool === 'part' && ED.mode !== 'shape') {
        const node = partAt(e, onModel, toPixel);
        if (node) {
          e.preventDefault();
          colourPart(node).catch(err => say(err.message, true));
          return;
        }
        if (!onModel) return;
      }
      const p = onModel && (ED.painter.tool === 'select' || ED.painter.tool === 'part') ? null : toPixel(e);
      if (!p) {
        if (
          onModel &&
          !app.st.gizmoBusy(e.clientX, e.clientY) &&
          !(ED.mode === 'shape' && app.st.pickMesh(e.clientX, e.clientY, o => o.material?.map?.image === ED.canvas))
        )
          turnDrag(e);
        return;
      }
      e.preventDefault();
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        /* fine */
      }
      down = true;
      last = p;
      lastC = startC = { x: e.clientX, y: e.clientY };
      ED.painter.begin();
      if (onModel && SHAPES.has(ED.painter.tool)) shapeOnModel(startC, false);
      else {
        ED.painter.stroke(p, p);
        if (ED.mirror && (p.m || ED.painter.fillMode !== 'side')) ED.painter.fillAlso(p.m || p);
      }
    });
    const paintTo = p => {
      if (!p) {
        last = null;
        return;
      }
      const from = last && Math.abs(last.x - p.x) + Math.abs(last.y - p.y) <= reach ? last : p;
      ED.painter.stroke(from, p);
      last = p;
    };
    target.addEventListener('pointermove', e => {
      if (!down || !ED) return;
      const cur = { x: e.clientX, y: e.clientY };
      if (!onModel) {
        const p = toPixel(e);
        if (p) {
          ED.painter.stroke(
            last && !SHAPES.has(ED.painter.tool) && Math.abs(last.x - p.x) + Math.abs(last.y - p.y) > reach ? p : last || p,
            p
          );
          last = p;
        }
        return;
      }
      if (SHAPES.has(ED.painter.tool)) {
        shapeOnModel(cur, false);
        lastC = cur;
        return;
      }
      for (const q of along(lastC, cur)) paintTo(at(q.x, q.y)); // a fast drag is filled in between pointer positions, so it never breaks into dots
      lastC = cur;
    });
    const up = e => {
      if (!down) return;
      down = false;
      if (ED && onModel && SHAPES.has(ED.painter.tool) && ED.painter.tool === 'boxfill' && e && e.clientX != null)
        shapeOnModel({ x: e.clientX, y: e.clientY }, true);
      ED && ED.painter.end();
    };
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  }
  const urls = new Map();
  function assetThumb(a) {
    // the piece as it looks worn, on the bare character (falls back to the flat texture)
    const it = app.R?.ITEMS[a.field]?.find(e => e.Id === 'Custom_' + a.id);
    if (!it) return assetPicture(a);
    const s = bareSkin(a.field, app.R.partStr(it)),
      frame =
        FACE_FRAME[a.field] ||
        (HEADF.has(a.field)
          ? 'head'
          : LEGF.has(a.field)
            ? 'legs'
            : a.field === 'bodyCharacteristic' || a.field === 'skinFeature'
              ? 'body'
              : 'torso');
    return lazyImg(
      'a|' + a.id + '@' + a.updated,
      async () => fig.snapshot(await fig.build(s, app.R), frame, a.field === 'cape'),
      'a|' + a.id
    );
  }
  function assetPicture(a) {
    const k = a.id + '@' + a.updated;
    if (!urls.has(k)) {
      for (const [o, u] of urls)
        if (o.startsWith(a.id + '@')) {
          URL.revokeObjectURL(u);
          urls.delete(o);
        }
      urls.set(k, URL.createObjectURL(a.data));
    }
    return el('img', { alt: '', src: urls.get(k), draggable: false });
  }
  // Paid (edition and reward) items: open to edit only for an account that owns them. Hytale's sign-in tells us what an account
  // owns (its entitlements, the same names the game files list under each item); until then every paid item stays locked.
  const owns = e => {
    const need = Array.isArray(e?.Entitlements) ? e.Entitlements : [],
      have = app.ACCOUNT && Array.isArray(app.ACCOUNT.entitlements) ? app.ACCOUNT.entitlements : null;
    return !!have && need.length > 0 && need.every(x => have.includes(x));
  };
  const paidLocked = e => tierOf(e) > 0 && !owns(e);
  const lockedBase = a => {
    const it = app.CAT.items[a.field].find(e => e.Id === a.baseId);
    return it && paidLocked(it) ? tierOf(it) : 0;
  };
  const modReady = a => lockedBase(a) === 0 && !a.flag;
  store.setLockedOf(a => !modReady(a));
  store.setKeepOwnOf(skin =>
    app.R
      ? game.FIELDS.filter(f => {
          const it = app.R.find(f, skin[f]);
          if (!it) return false;
          if (!it.custom) return paidLocked(it);
          const a = ASSETS.find(x => 'Custom_' + x.id === it.Id);
          return !a || !modReady(a);
        })
      : []
  );
  // ---- paid items stay paid: no repaints of edition or reward items, and no repaints that copy one
  // A custom asset keeps its base item's 3D shape, so it can only pass for a paid item that uses the same model. Its texture is
  // compared, on the drawn area only, with every paid texture for that model: pixel colours (a straight copy) and the light and
  // dark pattern around the average (a recolour). It is flagged when it matches a paid item closely and matches that item clearly
  // better than its own free base.
  const imgCache = new Map();
  async function imageData(path) {
    // { d, w, h } of a game texture
    if (imgCache.has(path)) return imgCache.get(path);
    let out = null;
    try {
      const b = await game.bitmap(game.common(path)),
        c = el('canvas', { width: b.width, height: b.height }),
        x = c.getContext('2d', { willReadFrequently: true });
      x.drawImage(b, 0, 0);
      out = { d: x.getImageData(0, 0, b.width, b.height).data, w: b.width, h: b.height };
    } catch {
      /* not readable */
    }
    imgCache.set(path, out);
    return out;
  }
  function cropTo(data, mask, W, w, h) {
    // the top-left w x h of a W-wide picture and its mask
    const d = new Uint8ClampedArray(w * h * 4),
      m = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      d.set(data.subarray(y * W * 4, (y * W + w) * 4), y * w * 4);
      m.set(mask.subarray(y * W, y * W + w), y * w);
    }
    return [d, m];
  }
  function texturesFor(item, model) {
    // [path, coloured?] for every look of an item on this model
    const out = [],
      take = s => {
        if (!s || s.Model !== model) return;
        if (s.Textures) for (const t of Object.values(s.Textures)) if (t.Texture) out.push([t.Texture, true]);
        if (s.GreyscaleTexture) out.push([s.GreyscaleTexture, false]);
      };
    take(item);
    for (const v of Object.values(item.Variants || {})) take({ ...item, ...v, Model: v.Model || item.Model });
    return out;
  }
  function likeness(mine, other, mask, coloured) {
    let n = 0,
      sa = 0,
      sb = 0;
    for (let k = 0; k < mask.length; k++) {
      const i = k * 4;
      if (!mask[k] || !mine[i + 3] || !other[i + 3]) continue;
      n++;
      sa += mine[i] + mine[i + 1] + mine[i + 2];
      sb += other[i] + other[i + 1] + other[i + 2];
    }
    if (n < 24) return 0;
    const ma = sa / n / 3,
      mb = sb / n / 3;
    let same = 0,
      shape = 0;
    for (let k = 0; k < mask.length; k++) {
      const i = k * 4;
      if (!mask[k] || !mine[i + 3] || !other[i + 3]) continue;
      if (coloured && Math.abs(mine[i] - other[i]) + Math.abs(mine[i + 1] - other[i + 1]) + Math.abs(mine[i + 2] - other[i + 2]) <= 36)
        same++;
      if (Math.abs((mine[i] + mine[i + 1] + mine[i + 2]) / 3 - ma - ((other[i] + other[i + 1] + other[i + 2]) / 3 - mb)) <= 10) shape++;
    }
    return Math.max(same, shape) / n;
  }
  async function replicaOf(a, canvas, mask) {
    const items = app.CAT.items[a.field].filter(e => !e.custom),
      paid = items.filter(e => tierOf(e) > 0 && texturesFor(e, a.model).length);
    if (!paid.length) return null;
    const w = canvas.width,
      h = canvas.height,
      mine = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    const m = mask || new Uint8Array(w * h).fill(1),
      crops = new Map(),
      best = async e => {
        let s = 0;
        for (const [p, col] of texturesFor(e, a.model)) {
          const img = await imageData(p);
          if (!img || img.w > w || img.h > h) continue;
          const k = img.w + 'x' + img.h;
          if (!crops.has(k)) crops.set(k, img.w === w && img.h === h ? [mine, m] : cropTo(mine, m, w, img.w, img.h));
          const [mm, mk] = crops.get(k);
          s = Math.max(s, likeness(mm, img.d, mk, col));
        }
        return s;
      };
    const base = items.find(e => e.Id === a.baseId),
      own = base ? await best(base) : 0;
    let hit = null,
      top = 0;
    for (const e of paid) {
      const s = await best(e);
      if (s > top) {
        top = s;
        hit = e;
      }
    }
    return top >= 0.85 && top >= own + 0.1 ? itemName(hit) : null;
  }
  // ---- shapes: a reshaped item may not copy a paid item's shape either. Each model becomes its list of boxes (centre and sorted
  // sizes, with every node's position, turn and offset applied); two shapes match when most boxes of each have a twin in the
  // other (centre and sizes within a tolerance that grows with the box). Flagged like a texture copy: the shape matches a paid item closely
  // and clearly better than the free item it was made from does.
  function qmul(a, b) {
    return {
      x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
      y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
      z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
      w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    };
  }
  function qrot(q, v) {
    const p = qmul(qmul(q, { x: v[0], y: v[1], z: v[2], w: 0 }), { x: -q.x, y: -q.y, z: -q.z, w: q.w });
    return [p.x, p.y, p.z];
  }
  function boxList(model) {
    const out = [],
      v = o => [o?.x ?? 0, o?.y ?? 0, o?.z ?? 0];
    const walk = (n, R, t) => {
      const q = { x: n.orientation?.x ?? 0, y: n.orientation?.y ?? 0, z: n.orientation?.z ?? 0, w: n.orientation?.w ?? 1 };
      const p = qrot(R, v(n.position)),
        R2 = qmul(R, q),
        t2 = [t[0] + p[0], t[1] + p[1], t[2] + p[2]],
        sh = n.shape || {},
        o = qrot(R2, v(sh.offset)),
        c = [t2[0] + o[0], t2[1] + o[1], t2[2] + o[2]];
      if ((sh.type === 'box' || sh.type === 'quad') && sh.visible !== false) {
        const st = v(sh.stretch).map(x => x || 1),
          sz = v(sh.settings?.size)
            .map((x, k) => Math.abs(x * st[k]))
            .sort((a, b) => a - b);
        out.push({ c, s: sz });
      }
      for (const ch of n.children || []) walk(ch, R2, c);
    };
    for (const n of model.nodes || []) walk(n, { x: 0, y: 0, z: 0, w: 1 }, [0, 0, 0]);
    return out;
  }
  function shapeLikeness(A, B) {
    if (!A.length || !B.length) return 0;
    // tolerances grow with the box, so small shifts and stretches of a copied shape still count as the same box
    const twin = (b, list) =>
      list.some(
        a =>
          Math.hypot(a.c[0] - b.c[0], a.c[1] - b.c[1], a.c[2] - b.c[2]) <= Math.max(2.5, 0.3 * b.s[2]) &&
          a.s.every((x, k) => Math.abs(x - b.s[k]) <= Math.max(2, 0.25 * b.s[k]))
      );
    return Math.min(B.filter(b => twin(b, A)).length / B.length, A.filter(a => twin(a, B)).length / A.length);
  }
  async function shapeReplicaOf(a, model) {
    const items = app.CAT.items[a.field].filter(e => !e.custom),
      models = e => [...new Set([e.Model, ...Object.values(e.Variants || {}).map(v => v.Model)].filter(Boolean))];
    const mine = boxList(model),
      load = async p => {
        try {
          return boxList(await game.json(game.common(p)));
        } catch {
          return [];
        }
      };
    const base = items.find(e => e.Id === a.baseId);
    let own = 0;
    let hit = null,
      top = 0;
    for (const e of items.filter(e => tierOf(e) > 0))
      for (const m of models(e)) {
        const s = shapeLikeness(mine, await load(m));
        if (s > top) {
          top = s;
          hit = e;
          if (base) for (const bm of models(base)) own = Math.max(own, shapeLikeness(await load(bm), await load(m)));
        }
      }
    return top >= 0.8 && top >= own + 0.15 ? itemName(hit) : null;
  }
  async function checkReplica() {
    // after an import, a recolour, a shape change or leaving the editor
    if (!ED) return;
    const e = ED;
    let flag = await replicaOf(e.asset, e.canvas, e.painter.mask).catch(() => null);
    if (!flag && e.model && (e.shapeN || e.asset.shape)) {
      flag = await shapeReplicaOf(e.asset, e.model).catch(() => null);
    }
    if ((flag || undefined) === e.asset.flag) return;
    e.asset = { ...e.asset, flag: flag || undefined };
    queueAssetSave();
    if (flag) say(`Too close to ${flag} (paid): site only`, true);
    render();
  }

  const FLAG_WHY = n => `Too close to ${n} (paid): site only until it differs more`;
  function copyName(n) {
    const stem = n.replace(/ \(mine\)$/, '').replace(/ copy( \d+)?$/, ''),
      used = new Set(ASSETS.map(x => x.name));
    for (let k = 1; k < 1000; k++) {
      const suf = ' copy' + (k > 1 ? ' ' + k : ''),
        out = cleanName(clip(stem, 40 - suf.length) + suf);
      if (!used.has(out)) return out;
    }
    return cleanName(clip(stem, 34) + ' copy');
  } /* the suffix always fits the 40-character limit */
  let MAKING = 0; // copies being written: quick repeat clicks can't pass the item limit
  async function copyAsset(a) {
    if (copyAsset.busy) return;
    copyAsset.busy = true;
    try {
      return await copyAsset1(a);
    } finally {
      copyAsset.busy = false;
    }
  } /* a double click makes one copy */
  async function copyAsset1(a) {
    if (ASSETS.length + MAKING >= assets.MAX) throw new Error(`My items is full (${assets.MAX})`);
    MAKING++;
    try {
      await assets.save({ ...a, id: assets.newId(), name: copyName(a.name), flag: undefined });
      ASSETS = await assets.list();
    } finally {
      MAKING--;
    }
    registerAssets();
    syncFolder();
    render();
  }
  const keepAny = () => prefs.set('se_anyitem', JSON.stringify({ picks: anyItem.picks || {}, slot: anyItem.slot })); // the picker's slot and item, remembered between visits
  function anyItem() {
    // or start from any free item in the game, worn or not
    if (!anyItem.loaded) {
      anyItem.loaded = true;
      try {
        const k = JSON.parse(prefs.get('se_anyitem') || '{}');
        anyItem.picks = k.picks || {};
        anyItem.slot = k.slot;
      } catch {
        /* fresh */
      }
    }
    const slots = game.FIELDS.filter(f => app.CAT.items[f].some(e => !e.custom && !paidLocked(e))),
      slot = el(
        'select',
        { title: 'Slot' },
        slots.map(f => el('option', { value: f, text: LABEL[f] }))
      );
    const ok = e => !e.custom && !paidLocked(e) && !/^\s*\[?tmp\]?/i.test(itemName(e)) && !/(^|_)tmp(_|$)/i.test(e.Id);
    const edit = el('button', {
      class: 'btn primary',
      text: 'Edit a copy',
      onclick: () => {
        const [f, e] = pick();
        if (e) newAsset(f, app.R.partStr(e));
      },
    });
    const find_ = el('input', { type: 'search', placeholder: 'Search', class: 'anysearch' }),
      pic = el('div', { class: 'pic anypic' });
    let list = [],
      at = -1;
    const pick = () => {
      const r = list[at];
      return r ? [r[1], r[2]] : [];
    };
    const draw = i => {
      const r = list[i];
      setPic(itemThumb(r ? r[1] : slot.value, r ? r[2] : null, undefined, undefined, true));
    };
    const setPic = img => {
      if (img.src || !pic.firstChild) {
        pic.replaceChildren(img);
        return;
      } // ready now: swap at once; otherwise keep the old picture until the new one is drawn
      img.classList.add('next');
      img.addEventListener(
        'load',
        () => {
          if (img.isConnected) {
            img.classList.remove('next');
            pic.replaceChildren(img);
          }
        },
        { once: true }
      );
      [...pic.querySelectorAll('img.next')].forEach(x => x.remove());
      pic.append(img);
    };
    const label = () => {
      edit.disabled = !list[at]?.[2];
    };
    const choose = i => {
      at = i;
      if (list[i] && list[i][2]) {
        (anyItem.picks ||= {})[list[i][1]] = list[i][2].Id;
        anyItem.slot = list[i][1];
        if (slot.value !== list[i][1]) {
          slot.value = list[i][1];
          slotBtn.value = slot.value;
        }
      }
      keepAny();
      label();
      draw(at);
    };
    // the item list previews in the picture: the item under the pointer or the arrow keys, and the chosen one again after
    const item = pickList(el, {
      label: 'Item',
      placeholder: () => (list.length ? 'Choose an item' : 'Nothing found'),
      minWidth: 0,
      maxHeight: 320,
      markChosen: false,
      onPreview: v => draw(v === null ? at : v),
      onChoose: choose,
    });
    const fill = () => {
      const q = find_.value.trim().toLowerCase(),
        from = q ? slots : [slot.value]; // a search looks in every slot
      const rank = r => {
        if (!q || !r[2]) return 0;
        const nm = itemName(r[2]).toLowerCase(),
          w = nm.split(/\s+/);
        return nm === q
          ? 0
          : nm.startsWith(q)
            ? 1
            : w[0] === q || (w.includes(q) && w.indexOf(q) === 0)
              ? 1
              : nm.split(/\s+/).some(x => x === q)
                ? 2
                : 3;
      };
      const paidOk = e =>
        !e.custom &&
        paidLocked(e) &&
        !isTmp(e) &&
        !/^\s*\[?tmp\]?/i.test(itemName(e)); /* paid items are listed, greyed: they can't be copied */
      list = from
        .flatMap(f =>
          oneEach(app.CAT.items[f])
            .filter(e => (ok(e) || paidOk(e)) && !isTmp(e) && (!q || itemName(e).toLowerCase().includes(q)))
            .map(e => [itemName(e) + (q ? ` (${LABEL[f]})` : ''), f, e, paidLocked(e)])
        )
        .sort((a, b) => a[3] - b[3] || rank(a) - rank(b) || a[0].localeCompare(b[0])); // a search puts exact names first, then names that start with it
      // None: the picture shows the slot empty; wearing nothing there starts on a random item
      const worn = !q && parse(app.cur.skin[slot.value]).id,
        kept = (anyItem.picks ||= {})[slot.value],
        at0 = id => list.findIndex(r => r[2] && !r[3] && r[2].Id === id),
        free = list.findIndex(r => !r[3]);
      at = q ? free : kept ? at0(kept) : -1;
      if (!q && at < 0) at = at0(worn); // the item shown last time stays, so the picker doesn't jump around between visits
      if (!q && at < 0 && (anyItem.rand ||= {})[slot.value]) at = at0(anyItem.rand[slot.value]);
      if (!q && at < 0 && free >= 0) {
        const frees = list.map((r, i) => (r[3] ? -1 : i)).filter(i => i >= 0);
        at = frees[Math.floor(Math.random() * frees.length)];
        anyItem.rand[slot.value] = list[at][2].Id;
      }
      if (!q && at >= 0 && list[at][2]) anyItem.picks[slot.value] = list[at][2].Id; // whatever is shown first stays shown (wearing something new doesn't swap it)
      item.setItems(
        list.map(([n, , , paid], i) => ({ value: i, text: n, disabled: paid, note: paid ? 'Paid' : null, cls: paid ? 'paid' : null })),
        at
      );
      label();
      item.disabled = !list.length;
      item.close();
      draw(at);
    };
    slot.value = slots.includes(anyItem.slot) ? anyItem.slot : slots.includes('overtop') ? 'overtop' : slots[0];
    fill();
    slot.onchange = () => {
      anyItem.slot = slot.value;
      keepAny();
      find_.value = '';
      fill();
      slotBtn.value = slot.value;
    };
    find_.oninput = fill;
    const slotItem = f => {
      const items = oneEach(app.CAT.items[f]).filter(ok),
        want = (anyItem.picks || {})[f] || parse(app.cur.skin[f]).id;
      return items.find(e => e.Id === want) || items[0] || null;
    };
    const showSlot = f => setPic(itemThumb(f, slotItem(f), undefined, undefined, true));
    // the slot list previews too: the picture shows the slot's item under the pointer
    const slotBtn = pickList(el, {
      label: 'Item type',
      items: slots.map(f => ({ value: f, text: LABEL[f] })),
      value: slot.value,
      minWidth: 180,
      maxHeight: 420,
      markChosen: false,
      onPreview: f => (f === null ? draw(at) : showSlot(f)),
      onChoose: f => {
        slot.value = f;
        slot.onchange();
      },
    });
    find_.onkeydown = ev => {
      if (ev.key === 'ArrowDown' && list.length) {
        ev.preventDefault();
        item.focus();
        item.onkeydown(ev);
      }
    };
    return [
      el('h3', { text: 'Any item' }),
      el(
        'div',
        { class: 'row anyitem' },
        pic,
        el(
          'div',
          { class: 'anycol' },
          el('div', { class: 'row' }, el('div', { class: 'anywrap' }, slotBtn), find_),
          el('div', { class: 'anywrap' }, item)
        ),
        edit
      ),
    ];
  }
  function assetCard(a) {
    const act = (label, fn, cls) =>
      el('button', {
        class: 'mini ' + (cls || ''),
        text: label,
        onclick: e => {
          e.stopPropagation();
          fn();
        },
      });
    const worn = app.cur.skin[a.field] && app.cur.skin[a.field].startsWith('Custom_' + a.id);
    return el(
      'div',
      {
        class: 'skin asset' + (worn ? ' on' : ''),
        tabIndex: 0,
        data: { rid: 'a' + a.id },
        onclick: guard(() => openAsset(a)),
        onkeydown: e => {
          if (e.key === 'Enter' && e.target === e.currentTarget) e.currentTarget.click();
        },
      },
      el('div', { class: 'pic' }, assetThumb(a)),
      el('b', { text: a.name }),
      el('small', {
        text: modReady(a) ? LABEL[a.field] : a.flag ? 'Site only' : 'Paid item: site only',
        title: a.flag ? FLAG_WHY(a.flag) : '',
      }),
      worn ? el('span', { class: 'worntick', text: '✓', 'aria-label': 'Worn' }) : null,
      cardMenu([
        act(
          'Edit',
          guard(() => openAsset(a))
        ),
        act(
          'Copy',
          guard(() => copyAsset(a))
        ),
        worn
          ? null
          : act('Wear', () => {
              const v = 'Custom_' + a.id + '.Mine';
              if (app.cur.skin[a.field] !== v) setSkin({ ...app.cur.skin, [a.field]: v });
            }),

        act(
          'Delete',
          guard(async () => {
            setPressing(false);
            await deleteAsset(a);
          }),
          'danger'
        ),
      ])
    );
  }
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open_ = [...document.querySelectorAll('.cardacts')].filter(x => !x.hidden);
    if (!open_.length) return;
    open_.forEach(x => (x.hidden = true));
    document.querySelectorAll('.cardmenu').forEach(x => x.setAttribute('aria-expanded', 'false'));
    e.stopPropagation();
  }); // Escape closes an open card menu wherever focus is
  function showKeys() {
    // the shortcut list (?), as in other editors
    const groups = [
      [
        'Paint',
        [
          ['B', 'Paint'],
          ['E', 'Erase'],
          ['F', 'Fill'],
          ['P', 'Whole part'],
          ['I / hold Alt', 'Pick'],
          ['H', 'Replace'],
          ['L / U / Q', 'Line / Rectangle / Filled'],
          ['O / D / N', 'Lighten / Darken / Noise'],
          ['[ ]', 'Brush size'],
          ['M', 'Select'],
          ['Ctrl+A', 'Select all'],
          ['Ctrl+C / X / V', 'Copy / Cut / Paste'],
          ['Arrows, Shift+arrows', 'Move a paste'],
          ['Enter', 'Place a paste'],
          ['Delete', 'Clear selection'],
        ],
      ],
      [
        'Shape',
        [
          ['G / S / R', 'Move / Resize / Turn'],
          ['A', 'Add'],
          ['Ctrl+D', 'Duplicate'],
          ['Shift+M', 'Mirror'],
          ['Delete / X', 'Delete part'],
          ['F2', 'Rename part'],
          ['Arrows, Shift+arrows', 'Nudge'],
        ],
      ],
      [
        'General',
        [
          ['Ctrl+Z / Y', 'Undo / Redo'],
          ['Ctrl+S', 'Save now'],
          ['1 2 3 5 7', 'Views'],
          ['Ctrl+0', 'Fit texture'],
          ['Esc', 'Cancel'],
          ['?', 'Shortcuts'],
        ],
      ],
    ];
    const t = el(
      'table',
      { class: 'keys' },
      groups.flatMap(([g, rows]) => [
        el('tr', {}, el('th', { colSpan: 2, text: g })),
        ...rows.map(([k, v]) => el('tr', {}, el('td', {}, el('kbd', { text: k })), el('td', { text: v }))),
      ])
    );
    ask('Shortcuts', t, [{ label: 'Close', value: 'ok', primary: true }]).then(() => {
      try {
        document.activeElement?.blur?.();
      } catch {
        /* fine */
      }
    });
  }
  function cardMenu(acts) {
    // a card's actions in a ⋯ menu, as in file browsers
    for (const a of acts) a?.setAttribute?.('role', 'menuitem');
    const m = el(
      'div',
      {
        class: 'cardacts',
        role: 'menu',
        hidden: true,
        onkeydown: e => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
            e.preventDefault();
            e.stopPropagation();
            const bs = [...m.querySelectorAll('button:not(:disabled)')],
              i = bs.indexOf(document.activeElement),
              n = bs.length;
            const j = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + n) % n;
            bs[j]?.focus();
            return;
          } /* arrows move through the menu */
          if (e.key === 'Escape') {
            e.stopPropagation();
            m.hidden = true;
            b.setAttribute('aria-expanded', 'false');
            b.focus();
          }
        },
      },
      acts
    );
    m.addEventListener(
      'click',
      e => {
        if (e.target.closest('button')) {
          m.hidden = true;
          b.setAttribute('aria-expanded', 'false');
        }
      },
      true
    ); /* capture: actions stop their own clicks */ // picking an action closes the menu
    m.addEventListener('focusout', e => {
      if (!m.contains(e.relatedTarget) && e.relatedTarget !== b) {
        m.hidden = true;
        b.setAttribute('aria-expanded', 'false');
      }
    });
    const b = el('button', {
      class: 'cardmenu',
      text: '⋯',
      'aria-label': 'More',
      'aria-haspopup': 'menu',
      'aria-expanded': 'false',
      onclick: e => {
        e.stopPropagation();
        const open_ = m.hidden;
        document.querySelectorAll('.cardacts').forEach(x => (x.hidden = true));
        document.querySelectorAll('.cardmenu').forEach(x => x.setAttribute('aria-expanded', 'false'));
        m.hidden = !open_;
        b.setAttribute('aria-expanded', String(open_));
        if (open_) {
          m.classList.remove('up');
          const r = m.getBoundingClientRect(),
            box = m.closest('.pbody, .panel')?.getBoundingClientRect();
          if (r.bottom > Math.min(innerHeight, box ? box.bottom : innerHeight) - 4) m.classList.add('up');
        }
        /* opens upward when it would go off the panel */ if (open_) m.querySelector('button')?.focus();
        if (open_) {
          const close = ev => {
            if (!m.contains(ev.target) && ev.target !== b) {
              m.hidden = true;
              removeEventListener('pointerdown', close, true);
            }
          };
          addEventListener('pointerdown', close, true);
        }
      },
    });
    return [b, m];
  }
  async function deleteAsset(a) {
    // skins wearing it go back to the game item it was copied from (or the slot's usual item)
    await closeAsset.last?.catch(() => {}); /* a close still saving would write the item back */
    if (!ASSETS.some(x => x.id === a.id)) return; /* already gone (a double click) */
    const mine = v => typeof v === 'string' && v.startsWith('Custom_' + a.id),
      base = app.R.ITEMS[a.field]?.find(e => e.Id === a.baseId && !e.custom),
      back = base ? (a.tone ? base.Id + '.' + a.tone : app.R.partStr(base)) : null; /* a copied body hands back its own tone */
    const swap = sk => (mine(sk[a.field]) ? { ...sk, [a.field]: back } : sk),
      worn = mine(app.cur.skin[a.field]);
    const full = (await assets.list()).find(x => x.id === a.id) || a,
      was = app.cur.skin,
      wasCur = app.cur,
      hit = [...app.WARD.custom, ...app.WARD.game].filter(r => r && mine(r.skin?.[a.field]));
    const put = (rec, sk) =>
      (rec.kind === 'game' ? store.saveGame(rec.slot, rec.name, sk) : store.saveCustom(rec.name, sk, rec.id)).catch(e => console.warn(e));
    for (const rec of hit) // saved skins too, so none is left missing a part
      await (
        rec.kind === 'game' ? store.saveGame(rec.slot, rec.name, swap(rec.skin)) : store.saveCustom(rec.name, swap(rec.skin), rec.id)
      ).catch(e => console.warn(e));
    await assets.remove(a.id);
    ASSETS = await assets.list();
    syncFolder();
    registerAssets();
    setWard(await store.list());
    if (worn) setSkin(app.R.fit(swap(app.cur.skin)));
    else app.cur.skin = app.R.fit(app.cur.skin);
    pics.clear();
    rebuild();
    render();
    const back1 = async () => {
        if ((await assets.list()).length >= assets.MAX) throw new Error(`My items is full (${assets.MAX})`);
        await assets.save(full);
        ASSETS = await assets.list();
        registerAssets();
        const now = await store.list(),
          live = id => [...now.game, ...now.custom].find(r => r && r.id === id);
        const fb = v => (v || null) === (back || null); /* only a slot still on the fallback goes back; a later choice stays */
        for (const rec of hit) {
          const l = live(rec.id) || rec;
          if (fb(l.skin?.[a.field])) await put(l, { ...l.skin, [a.field]: rec.skin[a.field] });
        }
        if (worn && (app.cur === wasCur || (app.cur.id && app.cur.id === wasCur.id)) && fb(app.cur.skin[a.field]))
          setSkin(app.R.fit({ ...app.cur.skin, [a.field]: was[a.field] }));
      } /* only that slot goes back; later changes stay */ /* the item is known again before the outfit is put back */ /* the look on screen only changes back if it is still the same skin */,
      prev = deleteAsset.undo && Date.now() - deleteAsset.at < 8000 ? deleteAsset.undo : null,
      all = async () => {
        await back1();
        if (prev) await prev();
      };
    deleteAsset.undo = all;
    deleteAsset.at = Date.now();
    deleteAsset.n = prev ? (deleteAsset.n || 1) + 1 : 1;
    sayUndo(
      prev ? `Deleted ${deleteAsset.n} items` : `Deleted "${a.name}"`,
      guard(async () => {
        deleteAsset.undo = null;
        await all();
        ASSETS = await assets.list();
        syncFolder();
        registerAssets();
        setWard(await store.list());
        pics.clear();
        rebuild();
        render();
      })
    );
  }
  // the drawn area over the flat texture: everything outside it is dimmed and each drawn face is outlined
  function limits(c) {
    const z = ED.zoom,
      o = el('canvas', { className: 'limits', width: c.width * z, height: c.height * z }),
      x = o.getContext('2d');
    o.style.width = c.width * z + 'px';
    if (!ED.rects.length) return o;
    x.fillStyle = 'rgba(8, 14, 24, 0.72)';
    x.fillRect(0, 0, o.width, o.height);
    for (const r of ED.rects) x.clearRect(r.x * z, r.y * z, r.w * z, r.h * z);
    x.strokeStyle = 'rgba(244, 196, 82, 0.9)';
    x.lineWidth = 1;
    for (const r of ED.rects) x.strokeRect(r.x * z + 0.5, r.y * z + 0.5, r.w * z - 1, r.h * z - 1);
    const sel = ED.mode === 'shape' && app.curBox() ? app.curBox().node.name : null; // Shape mode: the selected box's faces, lit blue
    if (sel) {
      x.fillStyle = 'rgba(127, 211, 255, 0.28)';
      x.strokeStyle = '#7fd3ff';
      x.lineWidth = 2;
      for (const r of ED.rects)
        if (r.node === sel) {
          x.fillRect(r.x * z, r.y * z, r.w * z, r.h * z);
          x.strokeRect(r.x * z + 1, r.y * z + 1, r.w * z - 2, r.h * z - 2);
        }
      x.lineWidth = 1;
    }
    if (z >= 4) {
      x.fillStyle = 'rgba(244, 196, 82, 0.95)';
      x.font = '700 10px Lexend, sans-serif';
      const many = new Set(ED.rects.map(r => r.node)).size > 1; // several parts: say which part as well as which side
      const spots = new Map();
      for (const r of ED.rects) {
        const k = r.x + ',' + r.y;
        (spots.get(k) || spots.set(k, []).get(k)).push(r);
      } // faces sharing one spot (left and right glasses painted alike) get one label
      for (const rs of spots.values()) {
        const r = rs[0];
        if (!(r.w * z > 34 && r.h * z > 14)) continue;
        const uniq = a => [...new Set(a)];
        const parts = uniq(rs.map(q => partName(q.node))),
          faces = uniq(rs.map(q => q.face)).join('/');
        const opts =
          parts.length > 1
            ? [parts.join(' + '), parts[0] + ' +' + (parts.length - 1)]
            : ED.rects.filter(q => q.node === r.node).length === 1
              ? [parts[0], faces]
              : [many ? parts[0] + ' · ' + faces : faces, faces]; /* parts painted alike: name them once and say so, no repeated sides */
        const t = opts.find(v => x.measureText(v).width <= r.w * z - 6);
        if (t) {
          const fs = x.fillStyle,
            tw = x.measureText(t).width;
          x.fillStyle = 'rgba(8, 14, 24, 0.78)';
          x.fillRect(r.x * z + 1, r.y * z + 1, tw + 4, 13);
          x.fillStyle = fs;
          x.fillText(t, r.x * z + 3, r.y * z + 11);
        } /* a dark pill keeps labels readable on light paint */
      }
    }
    return o;
  }

  return {
    get ASSETS() {
      return ASSETS;
    },
    get ED() {
      return ED;
    },
    nextEdN,
    setAssets,
    itemName,
    gameNamed,
    isTmp,
    oneEach,
    hasCustom,
    reloadAssets,
    registerAssets,
    newAsset,
    growWider,
    growAny,
    growTexture,
    openAsset,
    queueAssetSave,
    rescue,
    applyRescue,
    flushNow,
    flushAsset,
    closeAsset,
    geoTwin,
    sharersOf,
    colourPart,
    partHover,
    bindPaint,
    assetThumb,
    paidLocked,
    checkReplica,
    FLAG_WHY,
    anyItem,
    assetCard,
    showKeys,
    cardMenu,
    deleteAsset,
    limits,
  };
}
