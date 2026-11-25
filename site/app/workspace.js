// The Create workspace: shapes, the tool bar and side panels, selection, mirrored boxes and Combine.
import * as game from './game.js';
import * as fig from './figure.js';
import * as assets from './assets.js';
import { SHAPES, ONCE } from './paint.js';
import { toolIcon } from './toolicons.js';
import { cleanName, clip, parse, LABEL } from './skin.js';
import * as prefs from './prefs.js';

export function createWorkspace(app) {
  const {
    $,
    el,
    say,
    guard,
    ask,
    rebuild,
    HIDE,
    itemThumb,
    render,
    head,
    sayUndo,
    playAnim,
    nextEdN,
    itemName,
    gameNamed,
    isTmp,
    oneEach,
    registerAssets,
    newAsset,
    growWider,
    growAny,
    growTexture,
    openAsset,
    queueAssetSave,
    flushNow,
    closeAsset,
    sharersOf,
    assetThumb,
    editLocked,
    checkReplica,
    FLAG_WHY,
    anyItem,
    assetCard,
    showKeys,
    limits,
  } = app;
  // ---------------------------------------------------------------- shapes: an asset's own copy of its item's 3D model
  let CLIP = null; // copied texture area, kept across items
  fig.setShapeSource(async id => {
    if (app.ED && app.ED.asset.id === id && app.ED.model) return app.ED.model;
    const a = app.ASSETS.find(x => x.id === id);
    if (!a || !a.shape) throw new Error('that shape is gone');
    return JSON.parse(a.shape);
  });
  const boxesOf = m => {
    const out = [];
    const walk = (n, parent) => {
      const s = n.shape || {};
      if ((s.type === 'box' || s.type === 'quad') && s.visible !== false) out.push({ node: n, parent });
      for (const c of n.children || []) walk(c, n);
    };
    for (const n of m.nodes) walk(n, null);
    return out;
  };
  function uniqNames(model) {
    const seen = new Set();
    const walk = l => {
      for (const n of l || []) {
        if (seen.has(n.name)) {
          const b = String(n.name).slice(0, 56);
          let k = 2;
          while (seen.has(b + '~' + k)) k++;
          n.name = b + '~' + k;
        }
        seen.add(n.name);
        walk(n.children);
      }
    };
    walk(model.nodes);
    return model;
  } // game models repeat some part names; every part gets its own, so picking and dragging find the right one
  async function editModel() {
    if (!app.ED.model)
      app.ED.model = uniqNames(
        app.ED.asset.shape ? JSON.parse(app.ED.asset.shape) : structuredClone(await game.json(game.common(app.ED.asset.model)))
      );
    return app.ED.model;
  }
  function shapeChanged() {
    // the preview, the drawn-area guide and the saved copy follow every edit
    app.ED.shapeN = (app.ED.shapeN || 0) + 1;
    app.ED.rects = fig.usedRects(app.ED.model);
    maskFromRects();
    if (app.ED.asset.labels) {
      const have = new Set();
      const walk = l => {
        for (const n of l || []) {
          have.add(n.name);
          walk(n.children);
        }
      };
      walk(app.ED.model.nodes); /* names of parts that are gone are dropped */
      const kept = Object.fromEntries(Object.entries(app.ED.asset.labels).filter(([k]) => have.has(k)));
      if (Object.keys(kept).length !== Object.keys(app.ED.asset.labels).length) app.ED.asset = { ...app.ED.asset, labels: kept };
    }
    registerAssets();
    rebuild();
    queueAssetSave();
    render();
    clearTimeout(shapeChanged.t);
    shapeChanged.t = setTimeout(() => checkReplica(), 1200);
  }
  function maskFromRects() {
    const c = app.ED.canvas,
      m = new Uint8Array(c.width * c.height);
    for (const r of app.ED.rects)
      for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(c.height, Math.ceil(r.y + r.h)); y++)
        for (let x = Math.max(0, Math.floor(r.x)); x < Math.min(c.width, Math.ceil(r.x + r.w)); x++) m[y * c.width + x] = 1;
    app.ED.painter.mask = app.ED.rects.length ? m : null;
  }
  function outlineBox() {
    // the selected box, outlined on the model while the shape tools are open
    if (!app.st) return;
    if (app.ED) app.ED.partLit = null;
    if (!app.ED || !app.ED.shapeOpen || !app.ED.model) return app.st.highlight(null);
    const b = boxesOf(app.ED.model)[app.ED.box || 0],
      tw = app.ED.sym ? twinOf(b) : null;
    app.st.highlight(
      b
        ? o =>
            o.material?.map?.image === app.ED.canvas && (o.userData.nodeName === b.node.name || (!!tw && o.userData.nodeName === tw.name))
        : null
    );
  }
  // turning a box: its node's orientation as X/Y/Z degrees (applied X, then Y, then Z, as the 3D view does)
  const D2R = Math.PI / 180;
  function toEuler(q) {
    const { x = 0, y = 0, z = 0, w = 1 } = q || {};
    const m11 = 1 - 2 * (y * y + z * z),
      m12 = 2 * (x * y - w * z),
      m13 = 2 * (x * z + w * y),
      m22 = 1 - 2 * (x * x + z * z),
      m23 = 2 * (y * z - w * x),
      m32 = 2 * (y * z + w * x),
      m33 = 1 - 2 * (x * x + y * y);
    const far = Math.abs(m13) > 0.999998,
      ey = Math.atan2(
        m13,
        Math.hypot(m11, m12)
      ); /* Y from atan2 stays exact near ±90 (asin of a rounded value did not) */ /* stored turns are rounded to 1e-6: near Y = ±90 snap to exactly ±90 */
    const a = [far ? Math.atan2(m32, m22) : Math.atan2(-m23, m33), ey, far ? 0 : Math.atan2(-m12, m11)].map(r => r / D2R);
    const w_ = v => {
        const t = ((((v + 180) % 360) + 360) % 360) - 180;
        return Math.abs(t + 180) < 1e-6 ? 180 : t;
      },
      b = [w_(a[0] + 180), w_(180 - a[1]), w_(a[2] + 180)]; /* the same turn written the other way round */
    const cost = v => Math.abs(v[0]) + Math.abs(v[2]) + Math.abs(v[1]) * 0.5;
    return (cost(b) + 1e-6 < cost(a) ? b : a).map(r => Math.round(r * 10) / 10);
  }
  function toQuat(dx, dy, dz) {
    const [c1, c2, c3] = [dx, dy, dz].map(d => Math.cos((d * D2R) / 2)),
      [s1, s2, s3] = [dx, dy, dz].map(d => Math.sin((d * D2R) / 2)),
      r = v => Math.round(v * 1e6) / 1e6;
    return {
      x: r(s1 * c2 * c3 + c1 * s2 * s3),
      y: r(c1 * s2 * c3 - s1 * c2 * s3),
      z: r(c1 * c2 * s3 + s1 * s2 * c3),
      w: r(c1 * c2 * c3 - s1 * s2 * s3),
    };
  }
  // ---------------------------------------------------------------- the creator workspace, laid out like Blockbench
  // top: name, Paint/Shape tabs, undo, redo, Done. Left edge: tools with their shortcut keys. Left panel: the texture. Middle: the
  // model with view buttons and, in Shape mode, a gizmo. Right: colours and brush (Paint), or the outliner and box fields (Shape).
  const PAINT_TOOLS = [
    ['select', 'Select area', 'M', '⬚'],
    ['brush', 'Brush', 'B', '✎'],
    ['erase', 'Eraser', 'E', '⌫'],
    ['part', 'Whole part', 'P', '◩'],
    ['fill', 'Fill', 'F', '◧'],
    ['pick', 'Pick colour', 'I', '◉'],
    ['replace', 'Replace colour', 'H', '⇄'],
    ['line', 'Line', 'L', '╱'],
    ['box', 'Rectangle', 'U', '▢'],
    ['boxfill', 'Filled rectangle', 'Q', '■'],
    ['light', 'Lighten', 'O', '☀'],
    ['dark', 'Darken', 'D', '☾'],
    ['noise', 'Noise', 'N', '░'],
  ];
  const SHORT = {
    part: 'Whole part',
    more: 'More',
    select: 'Select',
    pick: 'Pick',
    replace: 'Replace',
    boxfill: 'Filled',
    light: 'Lighten',
    dark: 'Darken',
    dup: 'Copy',
    del: 'Delete',
  }; // names under the tool icons
  const SHAPE_TOOLS = [
    ['move', 'Move', 'G', '✥'],
    ['resize', 'Resize', 'S', '⤢'],
    ['rotate', 'Turn', 'R', '⟳'],
  ]; // click a part to pick it; these set what its handles do
  const paintsIn = e => (e.k === 'p' ? 1 : e.k === 'g' ? e.parts.reduce((n, x) => n + paintsIn(x), 0) : 0);
  const capHist = () => {
    if (app.ED.noCap) return;
    let n = app.ED.hist.reduce((a, x) => a + paintsIn(x), 0);
    while (app.ED.hist.length && (app.ED.hist.length > 90 || n > 110)) n -= paintsIn(app.ED.hist.shift());
  }; /* counts the paint steps inside groups too */ /* below the painter's own step limit, so every undo still has its paint */
  const recordPaint = () => {
    if (app.ED && !app.ED.replaying) {
      app.ED.hist.push({ k: 'p' });
      app.ED.fut = [];
      capHist();
    }
  };
  function recordShape(before, sel) {
    app.ED.hist.push({ k: 's', other: before, lab: JSON.stringify(app.ED.asset.labels || null), sel });
    app.ED.fut = [];
    capHist();
  } // sel: the part selected before the change, picked again on undo   // part names go back with the shape
  function sizeTo([w, h]) {
    const c = app.ED.canvas;
    if (c.width === w && c.height === h) return;
    app.ED.painter.grow(h, w);
    app.ED.asset = { ...app.ED.asset, w, h };
    app.ED.n = nextEdN();
    requestAnimationFrame(() => {
      if (app.ED) {
        if (!app.ED.userZoom) fitTexture();
        render();
      }
    });
  }
  function undoEntry(e, redo) {
    if (e.k === 'l') {
      const now = JSON.stringify(app.ED.asset.labels || null);
      app.ED.asset = { ...app.ED.asset, labels: JSON.parse(e.other) || undefined };
      queueAssetSave();
      return { k: 'l', other: now };
    }
    if (e.k === 'p') {
      app.ED.replaying = true;
      redo ? app.ED.painter.redo() : app.ED.painter.undo();
      app.ED.replaying = false;
      return e;
    }
    if (e.k === 'g') {
      if (e.splitWas !== undefined) {
        const v = redo ? !!e.splitNow : e.splitWas;
        app.ED.splitDone = v;
        app.ED.asset = { ...app.ED.asset, split: v };
        if (e.sz && redo) sizeTo(e.sz[1]);
        const parts = e.parts
          .slice()
          .reverse()
          .map(x => undoEntry(x, redo));
        if (e.sz && !redo) sizeTo(e.sz[0]);
        return { k: 'g', splitWas: e.splitWas, splitNow: e.splitNow, sz: e.sz, parts };
      } /* the texture shrinks back to its size before the step (and grows again on redo) */
      if (e.setup) {
        app.ED.splitDone = !!redo;
        app.ED.asset = { ...app.ED.asset, split: !!redo };
      }
      return {
        k: 'g',
        setup: e.setup,
        parts: e.parts
          .slice()
          .reverse()
          .map(x => undoEntry(x, redo)),
      };
    } /* undoing the split makes the next Shape visit split again */
    const now = JSON.stringify(app.ED.model),
      keep = (!redo && e.sel) || boxesOf(app.ED.model)[app.ED.box || 0]?.node.name,
      selNow = boxesOf(app.ED.model)[app.ED.box || 0]?.node.name;
    {
      if (e.lab !== undefined) {
        const nowLab = JSON.stringify(app.ED.asset.labels || null);
        app.ED.asset = { ...app.ED.asset, labels: JSON.parse(e.lab) || undefined };
        e = { ...e, labNow: nowLab };
      }
    }
    const namesNow = new Set(boxesOf(app.ED.model).map(x => x.node.name));
    app.ED.model = JSON.parse(e.other);
    {
      const back = boxesOf(app.ED.model).findIndex(x => !namesNow.has(x.node.name));
      if (back >= 0) {
        app.ED.box = back;
        app.ED.reshaped = true;
        return { k: 's', other: now, lab: e.labNow };
      }
    } /* a part that comes back is picked */
    {
      const bs = boxesOf(app.ED.model),
        i = bs.findIndex(x => x.node.name === keep);
      app.ED.box = i >= 0 ? i : Math.min(app.ED.box || 0, bs.length - 1);
    }
    app.ED.reshaped = true;
    return { k: 's', other: now, lab: e.labNow, sel: selNow };
  }
  function wsUndo(redo) {
    if (!app.ED) return;
    if (app.ED.adjOpen) {
      if (!redo && app.ED.adjCancel) app.ED.adjCancel();
      return;
    }
    say(''); /* inside Adjust colours, undo cancels the adjustment */
    if (app.ED.float && !redo) {
      app.ED.float = null;
      render();
      return;
    } /* the first undo only drops a paste that isn't placed yet */
    if (app.ED.float && redo) placeFloat();
    app.ED.float = null;
    const from = redo ? app.ED.fut : app.ED.hist,
      to = redo ? app.ED.hist : app.ED.fut,
      e = from.pop();
    if (!e) return;
    app.ED.reshaped = false;
    to.push(undoEntry(e, redo));
    if (app.ED.reshaped) shapeChanged();
    app.ED.palette = app.ED.painter.palette();
    render();
  }
  function shapeEdit(fn) {
    // with Symmetry on, the box's twin on the other side follows the change
    const before = JSON.stringify(app.ED.model),
      b0 = curBox(),
      tw = symTwin();
    shapeEdit.sel = b0?.node.name;
    fn();
    if (tw && b0 && b0.node !== tw && boxesOf(app.ED.model).some(x => x.node === b0.node) && boxesOf(app.ED.model).some(x => x.node === tw))
      mirrorNode(b0.node, tw);
    finishShape(before);
  }
  async function setMode(m) {
    if (app.ED.adjOpen && app.ED.adjCancel) app.ED.adjCancel();
    if (app.ED.placing) {
      app.ED.placing = false;
      say('');
    } /* leaving Paint drops an unapplied colour adjustment */
    if (app.ED.float) placeFloat();
    if (m === 'shape') app.ED.sel = null;
    say('');
    if (m === 'shape') {
      await editModel();
      app.ED.noCap = true;
      const h0 = app.ED.hist.length;
      if (boxesOf(app.ED.model).filter(b => /^Box_/.test(b.node.name) && bakeOffset(b.node)).length) shapeChanged();
      splitShared();
      if (app.ED.hist.length > h0) app.ED.hist.push({ k: 'g', setup: true, parts: app.ED.hist.splice(h0) });
      app.ED.noCap = false;
      capHist(); /* setup on entering Shape is one undo step */
      app.ED.box ||= 0;
      if (!app.ED.stool || app.ED.stool === 'select') app.ED.stool = 'move';
      app.st.cursor(null);
      app.ED.hover = app.ED.hoverM = null;
    }
    app.ED.mode = m;
    app.ED.shapeOpen = m === 'shape';
    render();
    placeGizmo();
  }
  function pickTool(id) {
    if (app.ED.placing) {
      app.ED.placing = false;
      say('');
    }
    /* changing tool cancels Add part */ if (app.ED.mode === 'shape') {
      if (app.ED.stool !== id) say('');
      app.ED.stool = id;
      app.ED.moreTools = false;
    } else {
      if (id !== 'select' && app.ED.float) placeFloat();
      app.ED.painter.tool = id;
    }
    render();
    placeGizmo();
  }
  function curBox() {
    return app.ED.model ? boxesOf(app.ED.model)[app.ED.box || 0] : null;
  }
  function placeGizmo() {
    if (!app.st) return;
    wsAnim();
    const b = app.ED && app.ED.mode === 'shape' && ['move', 'resize', 'rotate'].includes(app.ED.stool) ? curBox() : null;
    const mesh = b && app.st.findMesh(o => o.material?.map?.image === app.ED.canvas && o.userData.nodeName === b.node.name);
    if (!mesh) return app.st.gizmo(null);
    app.st.gizmo({
      mesh,
      mode: app.ED.stool,
      onEnd: ({ move, scale, turn }) =>
        shapeEdit(() => {
          const sh = b.node.shape,
            r = (v, q) => Math.round(v / q) * q;
          if (app.ED.stool === 'move') {
            const o = sh.offset || {},
              m1 = a => (Math.abs(move[a]) < 1e-4 ? (o[a] ?? 0) : r((o[a] ?? 0) + move[a], 0.5));
            sh.offset = { x: m1('x'), y: m1('y'), z: m1('z') };
          } /* only the dragged axis snaps */ else if (app.ED.stool === 'resize') {
            const z = sh.settings.size,
              f = v => Math.max(0.25, Math.min(4, v)),
              c = v => Math.max(1, Math.min(64, v));
            sh.settings.size = {
              x: z.x ? c(r(z.x * f(scale.x), 1)) : 0,
              y: z.y ? c(r(z.y * f(scale.y), 1)) : 0,
              z: z.z ? c(r(z.z * f(scale.z), 1)) : 0,
            } /* flat parts keep no depth */;
          } else {
            const k = v => Math.round(v * 1e6) / 1e6;
            b.node.orientation = { x: k(turn.x), y: k(turn.y), z: k(turn.z), w: k(turn.w) };
          }
        }),
    });
  }
  // a number you can type, or drag left and right on its letter, like Blender and Blockbench
  function scrub(label, get, set, step = 1, min = -64, max = 64, prec = step) {
    // prec: how finely a typed value is kept (turns keep 0.01)
    const clamp = v => Math.max(min, Math.min(max, Math.round(v / prec) * prec));
    const shown = () => Math.round(get() * 100) / 100;
    const inp = el('input', {
      type: 'number',
      class: 'scrubin',
      step,
      min,
      max,
      value: shown(),
      onchange: e => {
        const t = e.target.value.trim();
        if (t === '' || !Number.isFinite(Number(t))) {
          e.target.value = shown();
          return;
        }
        const v = clamp(Number(t));
        if (Math.abs(v - get()) < 1e-9) {
          e.target.value = shown();
          return;
        }
        shapeEdit(() => set(v));
      },
    }); /* no change, no step */ /* an emptied field goes back to its value */
    inp.onkeydown = e => {
      if (e.key !== 'Tab' && e.key !== 'Enter') return;
      const all = [...document.querySelectorAll('input.scrubin')],
        to = all.indexOf(inp) + (e.key === 'Tab' ? (e.shiftKey ? -1 : 1) : 0);
      if (e.key === 'Tab' && (to < 0 || to >= all.length)) return;
      e.preventDefault();
      if (String(shown()) !== inp.value.trim()) inp.dispatchEvent(new Event('change'));
      const n = [...document.querySelectorAll('input.scrubin')][to];
      if (n) {
        n.focus();
        n.select();
      }
    }; /* the panel redraws on commit: keep the caret in the fields */
    const lab = el('span', { class: 'scrub', text: label });
    lab.onpointerdown = e => {
      e.preventDefault();
      const x0 = e.clientX,
        v0 = get(),
        before = JSON.stringify(app.ED.model),
        tw = symTwin(),
        me = curBox();
      let moved = false,
        t = 0;
      lab.setPointerCapture(e.pointerId);
      lab.onpointermove = ev => {
        const v = clamp(v0 + Math.round((ev.clientX - x0) / 6) * step);
        if (v === get()) return;
        set(v);
        if (tw && me) mirrorNode(me.node, tw);
        inp.value = v;
        moved = true;
        clearTimeout(t);
        t = setTimeout(() => {
          registerAssets();
          rebuild();
        }, 60);
      };
      lab.onpointerup = () => {
        lab.onpointermove = lab.onpointerup = null;
        if (moved) finishShape(before);
      };
    };
    return el('label', { class: 'numfield' }, lab, inp);
  }
  // the whole drawn area in one colour: each pixel keeps how light or dark it was compared with the item's average
  function tintAll(hex, node) {
    // node: only that box's texture area (or several boxes, tinted together from one shared average so they match exactly)
    const nodes = node ? [].concat(node) : null;
    node = nodes ? nodes.join('|') : null;
    const lt = app.ED.lastTint;
    if (lt && lt.hex === hex && lt.node === (node || null) && lt.top === app.ED.hist[app.ED.hist.length - 1])
      return; /* the same tint again changes nothing (it used to drift lighter) */
    const P = app.ED.painter,
      c = app.ED.canvas,
      [r0, g0, b0] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)),
      lum = (d, i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    let m = P.mask;
    if (node) {
      m = new Uint8Array(c.width * c.height);
      let any = false;
      for (const r of app.ED.rects)
        if (nodes.includes(r.node)) {
          any = true;
          for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(c.height, Math.ceil(r.y + r.h)); y++)
            for (let x = Math.max(0, Math.floor(r.x)); x < Math.min(c.width, Math.ceil(r.x + r.w)); x++) m[y * c.width + x] = 1;
        }
      if (!any) return;
    }
    P.write((d, W, H) => {
      let sum = 0,
        n = 0;
      for (let p = 0; p < W * H; p++)
        if (d[p * 4 + 3] && (!m || m[p])) {
          sum += lum(d, p * 4);
          n++;
        }
      if (!n) return;
      const avg = Math.max(1, sum / n);
      for (let p = 0; p < W * H; p++) {
        const i = p * 4;
        if (!d[i + 3] || (m && !m[p])) continue;
        const k = Math.min(1.8, Math.max(0.35, lum(d, i) / avg));
        d[i] = Math.min(255, r0 * k);
        d[i + 1] = Math.min(255, g0 * k);
        d[i + 2] = Math.min(255, b0 * k);
      }
    });
    app.ED.lastTint = { hex, node: node || null, top: app.ED.hist[app.ED.hist.length - 1] };
    app.ED.palette = P.palette();
    render();
    checkReplica();
    say('');
  }
  function paintSide() {
    const P = app.ED.painter,
      adj = (app.ED.adjVals ||= { h: 0, s: 0, l: 0 }); // kept on the editor: the panel redraws (switching Paint/Shape) must not zero what you set
    const slider = (label, min, max, step, get, set, fmt) => {
      const lab = el('span', { text: `${label} ${fmt(get())}` });
      return el(
        'label',
        { class: 'wsslider' },
        lab,
        el('input', {
          type: 'range',
          min,
          max,
          step,
          value: get(),
          oninput: e => {
            set(+e.target.value);
            lab.textContent = `${label} ${fmt(get())}`;
          },
        })
      );
    };
    const adjRow = (key, label, min, max) => {
      const set = v => {
        adj[key] = Math.max(min, Math.min(max, Math.round(v) || 0));
        P.adjust(adj.h, adj.s / 100, adj.l / 100, false);
      };
      const num = el('input', {
          type: 'number',
          min,
          max,
          step: 1,
          value: adj[key],
          class: 'adjnum',
          oninput: e => {
            if (e.target.value === '' || e.target.value === '-') return;
            set(+e.target.value);
            rng.value = adj[key];
          },
          onchange: e => {
            set(+e.target.value);
            rng.value = e.target.value = adj[key];
          },
        }),
        rng = el('input', {
          type: 'range',
          min,
          max,
          step: 1,
          value: adj[key],
          oninput: e => {
            set(+e.target.value);
            num.value = adj[key];
          },
        });
      return el('label', { class: 'wsslider adj' }, el('span', { text: label }), rng, num);
    };
    const endAdjust = keep => {
      if (!keep) adj.h = adj.s = adj.l = 0;
      P.adjust(adj.h, adj.s / 100, adj.l / 100, true);
      app.ED.adjVals = null;
      app.ED.palette = P.palette();
      render();
      if (keep) checkReplica();
      if (app.ED.saveDeferred) {
        app.ED.saveDeferred = false;
        queueAssetSave();
      }
    };
    app.ED.adjCancel = () => {
      app.ED.adjOpen = false;
      endAdjust(false);
    };
    const toggle = (text, on, fn) => el('button', { class: 'chip' + (on ? ' on' : ''), text, 'aria-pressed': String(!!on), onclick: fn });
    const chip = (text, fn, key, off) =>
      el('button', {
        class: 'chip',
        text,
        title: key || '',
        disabled: !!off,
        onclick: () => {
          fn();
          render();
        },
      });
    if (app.ED.adjOpen)
      return [
        el('div', { class: 'wshead', text: 'Adjust colours' }),
        adjRow('h', 'Hue', -180, 180),
        adjRow('s', 'Saturation', -100, 100),
        adjRow('l', 'Brightness', -100, 100),
        el(
          'div',
          { class: 'row' },
          el('button', {
            class: 'btn primary',
            text: 'Apply',
            onclick: () => {
              app.ED.adjOpen = false;
              endAdjust(true);
            },
          }),
          el('button', {
            class: 'btn ghost',
            text: 'Cancel',
            onclick: () => {
              app.ED.adjOpen = false;
              endAdjust(false);
            },
          })
        ),
      ];
    return [
      el('div', { class: 'wshead', text: 'Colour' }),
      el(
        'div',
        { class: 'row' },
        el('input', {
          type: 'color',
          value: P.color,
          oninput: e => {
            P.color = e.target.value;
          },
          onchange: e => useColour(e.target.value),
        }),
        el('input', {
          type: 'text',
          class: 'hex',
          value: P.color,
          maxLength: 7,
          spellcheck: false,
          onchange: e => {
            let v = e.target.value.trim().replace(/^#?/, '#');
            if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + [...v.slice(1)].map(c => c + c).join('');
            if (/^#[0-9a-f]{6}$/i.test(v)) useColour(v.toLowerCase());
            else e.target.value = P.color;
          },
          onkeydown: e => {
            if (e.key === 'Enter') e.target.blur();
          },
        })
      ),
      el('div', { class: 'swlabel', text: 'Basic' }),
      swatchRow(BASIC),
      el('div', { class: 'swlabel', text: 'In this item' }),
      swatchRow(app.ED.palette),
      (() => {
        const r = [el('div', { class: 'swlabel', text: 'Recent' }), swatchRow(RECENT.length ? RECENT : ['#000000'])];
        if (!RECENT.length)
          r.forEach(x => {
            x.style.visibility = 'hidden';
            x.setAttribute('aria-hidden', 'true');
          });
        return r;
      })() /* the row keeps its place, so buttons below don't jump */,
      el('button', { class: 'btn ghost wide', text: 'Tint item', onclick: () => tintAll(P.color) }),
      el(
        'div',
        { class: 'options' },
        (() => {
          const t = toggle('Symmetry', app.ED.mirror, () => {
            app.ED.mirror = !app.ED.mirror;
            render();
          });
          t.disabled = ['select', 'pick', 'replace'].includes(P.tool);
          return t;
        })()
      ) /* greyed for tools it does not mirror */,
      app.ED.adjOpen
        ? [
            el('div', { class: 'wshead', text: 'Adjust colours' }),
            adjRow('h', 'Hue', -180, 180),
            adjRow('s', 'Saturation', -100, 100),
            adjRow('l', 'Brightness', -100, 100),
            el(
              'div',
              { class: 'row' },
              el('button', {
                class: 'btn primary',
                text: 'Apply',
                onclick: () => {
                  app.ED.adjOpen = false;
                  endAdjust(true);
                },
              }),
              el('button', {
                class: 'btn ghost',
                text: 'Cancel',
                onclick: () => {
                  app.ED.adjOpen = false;
                  endAdjust(false);
                },
              })
            ),
          ]
        : el('button', {
            class: 'btn ghost wide',
            text: 'Adjust colours…',
            onclick: () => {
              app.ED.adjOpen = true;
              app.ED.sel = null;
              render();
            },
          }) /* tool options come after the fixed buttons, so Symmetry and Adjust colours stay put */,
      P.tool === 'fill'
        ? [
            el('div', { class: 'swlabel', text: 'Fill' }),
            el(
              'div',
              { class: 'seg', role: 'radiogroup' },
              ...[
                ['area', 'Area', ''],
                ['side', 'Face', ''],
                ['every', 'Colour', ''],
              ].map(([m, t, why]) =>
                el('button', {
                  class: (P.fillMode || 'area') === m ? 'on' : '',
                  role: 'radio',
                  'aria-checked': String((P.fillMode || 'area') === m),
                  text: t,
                  onclick: () => {
                    P.fillMode = m;
                    render();
                    viewHint();
                  },
                })
              )
            ),
            P.fillMode !== 'side'
              ? slider(
                  'Tolerance',
                  0,
                  100,
                  4,
                  () => P.tolerance,
                  v => {
                    P.tolerance = v;
                  },
                  v => v + '%'
                )
              : null,
          ]
        : null,
      P.tool === 'select' || app.ED.sel || app.ED.float || CLIP
        ? [
            el('div', { class: 'wshead', text: 'Selection' }),
            el(
              'div',
              { class: 'options' },
              ...(app.ED.float
                ? [
                    chip('Place', placeFloat, 'Enter'),
                    chip('Flip ↔', () => flipFloat(true)),
                    chip('Flip ↕', () => flipFloat(false)),
                    chip(
                      'Cancel',
                      () => {
                        app.ED.float = null;
                        render();
                      },
                      'Esc'
                    ),
                  ]
                : [
                    chip('Copy', () => copySel(false), 'Ctrl+C', !app.ED.sel),
                    chip('Cut', () => copySel(true), 'Ctrl+X', !app.ED.sel),
                    chip('Paste', pasteClip, 'Ctrl+V', !CLIP),
                    chip('Clear', clearSel, 'Del', !app.ED.sel),
                  ])
            ),
          ]
        : null,
      ['brush', 'erase', 'light', 'dark', 'noise', 'line', 'box'].includes(P.tool)
        ? [
            el('div', { class: 'wshead', text: 'Brush' }),
            slider(
              'Size',
              1,
              8,
              1,
              () => P.size,
              v => {
                P.size = v;
              },
              v => v
            ),
            ['brush', 'line', 'box'].includes(P.tool)
              ? slider(
                  'Strength',
                  10,
                  100,
                  10,
                  () => Math.round(P.opacity * 100),
                  v => {
                    P.opacity = v / 100;
                  },
                  v => v + '%'
                )
              : null,
          ]
        : null,
    ]; /* tool options all sit below the fixed buttons: only the tool's own show */
  }
  // boxes get readable names: the player's own, else one made from the game's node name ("L-ArmCostume" -> "Left arm", new boxes -> "Box 2")
  function boxLabel(node) {
    // names come from one pass per model change (it was a name lookup per part per part: slow at 64 parts)
    const key = app.ED.model,
      lk = JSON.stringify(app.ED.asset.labels || null),
      memo = boxLabel.memo;
    if (memo && memo.model === key && memo.lk === lk && memo.n === app.ED.shapeN && memo.map.has(node)) return memo.map.get(node);
    if (app.ED.model && !(memo && memo.model === key && memo.lk === lk && memo.n === app.ED.shapeN)) {
      boxLabel.memo = { model: key, lk, n: app.ED.shapeN, map: new Map() };
      const map = boxLabel.memo.map;
      for (const b of boxesOf(app.ED.model)) map.set(b.node, boxLabel1(b.node));
      if (map.has(node)) return map.get(node);
    }
    return boxLabel1(node);
  }
  function boxLabel1(node) {
    const own = app.ED.asset.labels && app.ED.asset.labels[node.name];
    if (own) return own;
    if (/^Box_/.test(node.name)) {
      const all = boxesOf(app.ED.model).filter(b => /^Box_/.test(b.node.name));
      return 'Box ' + (all.findIndex(b => b.node === node) + 1);
    }
    const raw = n => {
      n = String(n).replace(/(~|_)\d+$/, '');
      /* merge suffixes (~2, _2) are not part of the name */ const m = /^(.*?)-+C(\d+)$/i.exec(n),
        base = (m ? m[1] : n)
          .replace(/Costume$/, '')
          .replace(/([A-Za-z])(\d+)$/, '$1 $2')
          .replace(/^L-/, 'Left ')
          .replace(/^R-/, 'Right ')
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/[-_]+/g, ' ')
          .replace(/\s+([lr])$/i, (x, c) => (c.toLowerCase() === 'l' ? ' left' : ' right'))
          .replace(/^\s*([lr])\s+/i, (x, c) => (c.toLowerCase() === 'l' ? 'Left ' : 'Right '))
          .replace(/\bbot\b/gi, 'bottom')
          .replace(/\bacc\b/gi, 'accessory')
          .replace(/\bc (\d+)\b/gi, 'part $1')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
      const t = base ? base[0].toUpperCase() + base.slice(1) : n;
      return m ? `${t}, piece ${+m[2] + 1}` : t;
    }; // "ChestPart--C1" -> "Chest part, piece 2"
    const s = raw(node.name),
      bs = app.ED.model
        ? boxLabel.bs && boxLabel.bs.model === app.ED.model && boxLabel.bs.n === app.ED.shapeN
          ? boxLabel.bs.list
          : (boxLabel.bs = { model: app.ED.model, n: app.ED.shapeN, list: boxesOf(app.ED.model) }).list
        : [],
      same = bs.filter(b => !/^Box_/.test(b.node.name) && !(app.ED.asset.labels || {})[b.node.name] && raw(b.node.name) === s);
    return same.length > 1 ? `${s} (${same.findIndex(b => b.node === node) + 1})` : s; // two parts with one name get numbers
  }
  function renameBox(btn, node) {
    const inp = el('input', { type: 'text', value: boxLabel(node), maxLength: 80, class: 'rename' });
    let ended = false;
    const done = keep => {
      if (ended) return;
      ended = true;
      inp.dataset.done = '1';
      if (keep && clip(cleanName(inp.value), 30).trim() === boxLabel(node)) keep = false;
      if (keep) {
        const want = clip(cleanName(inp.value), 30).trim(),
          taken = new Set(
            boxesOf(app.ED.model)
              .filter(b => b.node !== node)
              .map(b => boxLabel(b.node))
          );
        if (want && taken.has(want)) {
          const cut = k => clip(want, 30 - String(k).length - 1).trimEnd() + ' ' + k;
          let k = 2;
          while (taken.has(cut(k))) k++;
          inp.value = cut(k);
        }
      } /* a name another part has gets a number; the other part keeps its name */ /* unchanged: no step */
      if (keep) {
        const v = clip(cleanName(inp.value), 30).trim(),
          was = JSON.stringify(app.ED.asset.labels || null);
        app.ED.asset = { ...app.ED.asset, labels: { ...(app.ED.asset.labels || {}), [node.name]: v || undefined } };
        if (!v) delete app.ED.asset.labels[node.name];
        if (JSON.stringify(app.ED.asset.labels || null) !== was) {
          app.ED.hist.push({ k: 'l', other: was });
          app.ED.fut = [];
          capHist();
        }
        queueAssetSave();
      }
      render();
      document.querySelector('.partrow.on > button')?.focus();
    }; /* focus goes back to the part */ /* a rename is an undo step */
    inp.onkeydown = e => {
      e.stopPropagation();
      if (e.key === 'Enter') done(true);
      else if (e.key === 'Escape') done(false);
    };
    inp.onblur = () => done(true);
    btn.replaceWith(inp);
    inp.focus();
    inp.select();
  }
  // the texture view: the wheel zooms, right- or middle-drag pans; in Shape mode a click picks the box that owns that area
  function fitTexture() {
    if (!app.ED) return;
    if (!fitTexture.ro && window.ResizeObserver) {
      fitTexture.ro = new ResizeObserver(() => {
        if (app.ED && !app.ED.userZoom) {
          const z = app.ED.zoom;
          fitTexture();
          if (app.ED.zoom !== z) render();
        }
      });
      fitTexture.ro.observe($('wsleft'));
    } /* refits when the panel changes size, unless zoomed by hand */
    const pb = app.ED.box_,
      w = pb && pb.clientWidth > 60 ? pb.clientWidth - 8 : $('wsleft').clientWidth - 26,
      h = pb && pb.clientHeight > 60 ? pb.clientHeight - 8 : Infinity;
    app.ED.zoom = Math.max(ZOOMS[0], Math.min(24, Math.floor(Math.min(w / app.ED.canvas.width, h / app.ED.canvas.height) * 100) / 100));
  } /* fits width and height exactly (any zoom, not only whole steps) */
  function zoomCentre(z) {
    // the − / + buttons zoom around the middle of the view, as the wheel does around the pointer
    const pb = app.ED.box_,
      cv = () => pb?.querySelector('canvas.paint'),
      r0 = cv()?.getBoundingClientRect(),
      br = pb?.getBoundingClientRect();
    app.ED.userZoom = true;
    app.ED.zoom = z;
    render();
    if (!pb || !r0 || !br) return;
    const cx = br.left + br.width / 2,
      cy = br.top + br.height / 2,
      tx = (cx - r0.left) / r0.width,
      ty = (cy - r0.top) / r0.height,
      r1 = cv().getBoundingClientRect();
    pb.scrollLeft += r1.left + tx * r1.width - cx;
    pb.scrollTop += r1.top + ty * r1.height - cy;
  }
  const ZOOMS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24]; // zoom steps, as in image editors
  const zoomStep = (z, d) => (d > 0 ? (ZOOMS.find(v => v > z + 1e-6) ?? 24) : ([...ZOOMS].reverse().find(v => v < z - 1e-6) ?? ZOOMS[0]));
  function bindTexView(box) {
    box.addEventListener(
      'wheel',
      e => {
        if (!app.ED) return;
        e.preventDefault();
        const z = zoomStep(app.ED.zoom, e.deltaY < 0 ? 1 : -1);
        if (z === app.ED.zoom) return;
        app.ED.userZoom = true;
        const cv = () => box.querySelector('canvas'),
          r0 = cv()?.getBoundingClientRect(),
          tx = r0 ? (e.clientX - r0.left) / r0.width : 0,
          ty = r0 ? (e.clientY - r0.top) / r0.height : 0;
        app.ED.zoom = z;
        render();
        const r1 = cv()?.getBoundingClientRect();
        if (r0 && r1) {
          box.scrollLeft += r1.left + tx * r1.width - e.clientX;
          box.scrollTop += r1.top + ty * r1.height - e.clientY;
        }
      },
      { passive: false }
    ); /* the texel under the cursor stays under it */
    box.addEventListener('contextmenu', e => e.preventDefault());
    box.addEventListener('pointerdown', e => {
      if (!app.ED) return;
      if (e.button === 1 || e.button === 2) {
        e.preventDefault();
        const x0 = e.clientX,
          y0 = e.clientY,
          sx = box.scrollLeft,
          sy = box.scrollTop;
        box.setPointerCapture(e.pointerId);
        box.onpointermove = ev => {
          box.scrollLeft = sx - (ev.clientX - x0);
          box.scrollTop = sy - (ev.clientY - y0);
        };
        box.onpointerup = () => {
          box.onpointermove = box.onpointerup = null;
        };
        return;
      }
      if (e.button !== 0 || app.ED.mode !== 'shape') return;
      const c = app.ED.canvas,
        r = c.getBoundingClientRect(),
        x = ((e.clientX - r.left) / r.width) * c.width,
        y = ((e.clientY - r.top) / r.height) * c.height;
      const hit = app.ED.rects.filter(q => x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h).sort((a, b) => a.w * a.h - b.w * b.h)[0];
      if (!hit) return;
      const k = boxesOf(app.ED.model).findIndex(b => b.node.name === hit.node);
      if (k < 0) return;
      app.ED.box = k;
      if (app.ED.stool !== 'resize') {
        render();
        placeGizmo();
        return;
      }
      // Resize on the texture: drag across a part's area to make that side wider or narrower, up and down to make it taller or shorter
      const b = boxesOf(app.ED.model)[k],
        sh = b.node.shape,
        lay = sh.textureLayout || {},
        px = r.width / c.width;
      const key =
        Object.keys(lay)
          .filter(f => FACE_UV[f])
          .find(f => {
            const o = lay[f].offset || {};
            return Math.abs((o.x ?? 0) - hit.x) <= hit.w && Math.abs((o.y ?? 0) - hit.y) <= hit.h;
          }) || (sh.type === 'quad' ? 'front' : null);
      if (!key) {
        render();
        placeGizmo();
        return;
      }
      const [ua, va] = FACE_UV[sh.type === 'quad' ? 'front' : key].map(i => ['x', 'y', 'z'][i]);
      const s0 = { ...sh.settings.size },
        before = JSON.stringify(app.ED.model),
        x0 = e.clientX,
        y0 = e.clientY;
      let changed = false;
      e.preventDefault();
      box.setPointerCapture(e.pointerId);
      box.onpointermove = ev => {
        const du = Math.round((ev.clientX - x0) / px),
          dv = Math.round((ev.clientY - y0) / px),
          nu = Math.max(1, Math.min(64, (s0[ua] ?? 0) + du)),
          nv = Math.max(1, Math.min(64, (s0[va] ?? 0) + dv));
        if (nu === sh.settings.size[ua] && nv === sh.settings.size[va]) return;
        sh.settings = { ...sh.settings, size: { ...sh.settings.size, [ua]: nu, [va]: nv } };
        changed = true;
        shapeChanged();
      };
      box.onpointerup = () => {
        box.onpointermove = box.onpointerup = null;
        if (changed) finishShape(before);
        else {
          render();
          placeGizmo();
        }
      };
    });
  }

  function tour() {
    document.querySelector('.tour')?.remove();
  } // the old first-time tour is gone; this only clears a leftover
  function viewHint() {
    const h = $('viewhint');
    if (h) {
      h.hidden = true;
      h.textContent = '';
    }
  } // no tool sentences on the view
  // ---- colours: a fixed set of basics, the item's own colours and the ones used lately
  const BASIC = [
    '#ffffff',
    '#c9c9c9',
    '#808080',
    '#3d3d3d',
    '#000000',
    '#e23b3b',
    '#ef8a35',
    '#f4d24a',
    '#7cc444',
    '#2e9a58',
    '#3db7c9',
    '#3b6fe0',
    '#7a4fd6',
    '#d65ab4',
    '#8a5a32',
    '#f2c9a1',
  ];
  let RECENT = (() => {
    try {
      const r = JSON.parse(prefs.get('se_recent') || '[]');
      return Array.isArray(r) ? r.filter(h => /^#[0-9a-f]{6}$/i.test(h)).slice(0, 8) : [];
    } catch {
      return [];
    }
  })();
  function useColour(h) {
    if (!app.ED) return;
    const P = app.ED.painter;
    P.color = h;
    if (app.ED.float) placeFloat();
    /* a floating paste is placed before the tool changes, never dropped */ if (
      (!app.ED.altFrom && P.tool === 'pick') ||
      P.tool === 'erase' ||
      P.tool === 'select'
    )
      P.tool = 'brush';
    RECENT = [h, ...RECENT.filter(x => x !== h)].slice(0, 8);
    prefs.set('se_recent', JSON.stringify(RECENT));
    render();
  }
  const swatchRow = list =>
    el(
      'div',
      { class: 'swatches' },
      list.map(h => {
        const b = el('button', { title: h, class: h === app.ED.painter.color ? 'on' : '', onclick: () => useColour(h) });
        b.style.background = h;
        return b;
      })
    );
  // ---- the finish: after Done, say what happens next
  async function finishAsset(equip = false) {
    if (finishAsset.busy) return;
    finishAsset.busy = true;
    try {
      return await finishAsset0(equip);
    } finally {
      finishAsset.busy = false;
    }
  } // a second Done/Wear while one is saving is ignored
  async function finishAsset0(equip = false) {
    if (app.ED && equip) app.ED.keeping = true;
    document.body.classList.add('busy');
    try {
      return await finishAsset1(equip);
    } finally {
      document.body.classList.remove('busy');
      if (app.ED) app.ED.keeping = false;
    }
  } // busy cursor while it saves
  async function finishAsset1(equip = false) {
    const a = app.ED.asset;
    await closeAsset(false, equip);
    if (app.ED || !equip) return;
    // still open: the save failed; otherwise a short message (the old once-only dialog is gone)
    say(`Wearing ${a.name}`);
  }
  // ---- resizing keeps the paint tidy: a box that grows gets fresh room on the texture, its old paint stretched to fit
  const sizeOf = sh => ['x', 'y', 'z'].map(k => Math.ceil(Math.abs(sh.settings?.size?.[k] ?? 0)));
  function tidyResized(beforeJson) {
    if (app.ED.noTidy) return []; /* Reset puts the game's own layout back as it is */
    let before;
    try {
      before = JSON.parse(beforeJson);
    } catch {
      return [];
    }
    const old = new Map(),
      oldList = boxesOf(before),
      nowList = boxesOf(app.ED.model);
    for (const b of oldList) old.set(b.node.name, b.node.shape);
    const paints = [];
    for (const [k, b] of nowList.entries()) {
      /* parts are matched by their place in the list (game models reuse names), by name only when parts were added or removed */
      const sh = b.node.shape,
        o = oldList.length === nowList.length ? oldList[k].node.shape : old.get(b.node.name);
      if (!o || !sh.textureLayout || !o.textureLayout) continue;
      const ns = sizeOf(sh),
        os = sizeOf(o);
      if (!ns.some((v, k) => v > os[k])) continue; // only a box that grows can spill over other paint
      if (JSON.stringify(sh.textureLayout) !== JSON.stringify(o.textureLayout)) continue;
      let lay = allocLayout(sh);
      while (!lay && (app.ED.canvas.width < app.ED.canvas.height ? growWider() || growTexture() : growTexture() || growWider()))
        lay = allocLayout(sh);
      if (!lay) {
        sh.settings = { ...sh.settings, size: { ...o.settings.size } };
        say('Too big for the texture', true);
        continue;
      } /* no room even at the largest texture: the part keeps its old size, never paint off the texture */
      const src = o.textureLayout;
      sh.textureLayout = lay;
      paints.push((d, W, H) => {
        for (const [f, fu, fv] of faceDims(sh)) {
          const to = lay[f],
            from = src[f];
          if (!to || !from) continue;
          const [ua, va] = FACE_UV[f],
            ou = Math.max(1, os[ua]),
            ov = Math.max(1, os[va]);
          for (let v = 0; v < fv; v++)
            for (let u = 0; u < fu; u++) {
              const [dx, dy] = texelAt(to, u, v);
              if (dx < 0 || dy < 0 || dx >= W || dy >= H) continue;
              const [sx, sy] = texelAt(from, Math.min(ou - 1, Math.floor((u * ou) / fu)), Math.min(ov - 1, Math.floor((v * ov) / fv)));
              if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
              const i = (sy * W + sx) * 4,
                j = (dy * W + dx) * 4;
              d[j] = d[i];
              d[j + 1] = d[i + 1];
              d[j + 2] = d[i + 2];
              d[j + 3] = d[i + 3];
            }
        }
      });
      app.ED.rects = app.ED.rects.concat(fig.usedRects({ nodes: [b.node] })); // the next grown box must not take the same room
    }
    return paints;
  }
  // a box the player added turns about its own middle: any shift of it goes into its place (position), never its offset from that place
  function bakeOffset(n) {
    const o = n.shape?.offset;
    if (!o || !(o.x || o.y || o.z)) return false;
    const q = n.orientation || { x: 0, y: 0, z: 0, w: 1 },
      p = n.position || { x: 0, y: 0, z: 0 },
      r = v => Math.round(v * 100) / 100;
    const ix = q.w * o.x + q.y * o.z - q.z * o.y,
      iy = q.w * o.y + q.z * o.x - q.x * o.z,
      iz = q.w * o.z + q.x * o.y - q.y * o.x,
      iw = -q.x * o.x - q.y * o.y - q.z * o.z;
    n.position = {
      x: r(p.x + ix * q.w - iw * q.x - iy * q.z + iz * q.y),
      y: r(p.y + iy * q.w - iw * q.y - iz * q.x + ix * q.z),
      z: r(p.z + iz * q.w - iw * q.z - ix * q.y + iy * q.x),
    };
    n.shape.offset = { x: 0, y: 0, z: 0 };
    return true;
  }
  function finishShape(before) {
    for (const b of boxesOf(app.ED.model)) if (/^Box_/.test(b.node.name)) bakeOffset(b.node);
    for (const b of boxesOf(app.ED.model)) {
      const p = b.node.position;
      for (const o of [p, b.node.shape?.offset])
        if (o) for (const k of ['x', 'y', 'z']) if (typeof o[k] === 'number') o[k] = Math.max(-64, Math.min(64, o[k]));
    } /* every move path (gizmo, drag, Bring forward) keeps the same ±64 limit as the fields */
    const paints = tidyResized(before);
    recordShape(before, shapeEdit.sel);
    if (paints.length) {
      app.ED.painter.write((d, W, H) => paints.forEach(p => p(d, W, H)));
      app.ED.hist.push({ k: 'g', parts: app.ED.hist.splice(-2) });
    }
    shapeChanged();
  }

  function shapeSide() {
    const boxes = boxesOf(app.ED.model),
      i = Math.min(app.ED.box || 0, boxes.length - 1),
      b = boxes[i],
      sh = b.node.shape;
    const axisField = (lab, obj, key, ax, min, max, step = 1) =>
      scrub(
        lab,
        () => obj[key]?.[ax] ?? 0,
        v => {
          obj[key] = { x: 0, y: 0, z: 0, ...obj[key], [ax]: v };
        },
        step,
        min,
        max
      );
    const wrap = v => {
        const w = ((((v + 180) % 360) + 360) % 360) - 180;
        return w === -180 ? 180 : w;
      },
      turnNow = () => {
        const c = app.ED.turns?.get(b.node),
          q = b.node.orientation || {},
          t = c && toQuat(...c);
        return t &&
          Math.abs(Math.abs(t.x * (q.x ?? 0) + t.y * (q.y ?? 0) + t.z * (q.z ?? 0) + t.w * (q.w ?? 1)) - 1) < 1e-4 &&
          Math.max(
            ...['x', 'y', 'z', 'w'].map(k =>
              Math.min(Math.abs((t[k] ?? 0) - (q[k] ?? (k === 'w' ? 1 : 0))), Math.abs((t[k] ?? 0) + (q[k] ?? (k === 'w' ? 1 : 0))))
            )
          ) < 3e-6
          ? c
          : toEuler(b.node.orientation);
      }; /* typed values are kept only while the stored turn is exactly the typed one (as rounded) */
    const turnField = (lab, k) =>
      scrub(
        lab,
        () => turnNow()[k],
        v => {
          const d = [...turnNow()];
          d[k] = wrap(v);
          b.node.orientation = toQuat(...d);
          (app.ED.turns ||= new Map()).set(b.node, d);
        },
        1,
        -100000,
        100000,
        0.01
      );
    const xyz = (label, fields) =>
      el(
        'div',
        { class: 'wsgroup' },
        el('b', { text: label }),
        el('div', { class: 'xyzrow' }, ...fields)
      ); /* one row of axis fields, as in other editors */
    const own = /^Box_/.test(b.node.name),
      pos = own ? [b.node, 'position'] : [sh, 'offset'];
    // Position: where the box's middle is (pivot + offset), the same number for game parts and added ones; a game part moves by its offset (so what hangs from it stays put), an added one by its position
    const posField = (lab, ax) =>
      scrub(
        lab,
        () => (b.node.position?.[ax] ?? 0) + (sh.offset?.[ax] ?? 0),
        v => {
          const [o, k] = pos,
            other = own ? (sh.offset?.[ax] ?? 0) : (b.node.position?.[ax] ?? 0);
          o[k] = { x: 0, y: 0, z: 0, ...o[k], [ax]: v - other };
        },
        0.5,
        -64,
        64
      );
    const act = (t, fn, tip) => el('button', { class: 'chip', text: t, title: tip ? `${t} (${tip})` : '', onclick: fn });
    const nudgeZ = d => () => {
      let ax = 'z',
        sg = 1;
      const m = app.st.findMesh(o => o.userData.nodeName === b.node.name),
        memo = (app.ED.fwd ||= new Map()).get(b.node.name); /* forward = away from the body's middle, in the part's own axes */
      if (m && m.parent) {
        let root = m;
        while (root.parent && root.parent.type !== 'Scene') root = root.parent;
        const v = m.position.clone(),
          rp = m.position.clone();
        m.getWorldPosition(v);
        root.getWorldPosition(rp);
        const cp = app.st.camera.position.clone(),
          out = cp.sub(v);
        if (Math.hypot(out.x, out.z) > Math.abs(out.y) * 0.4) out.y = 0;
        if (out.length() < 1e-3) out.set(0, 0, 1);
        /* from above, forward is up */ void rp;
        /* forward = toward the viewer, like layers in a 2D editor */ const fr =
          pos[0] === b.node && m.parent.parent ? m.parent.parent : m.parent;
        out.normalize().applyQuaternion(fr.getWorldQuaternion(fr.quaternion.clone()).invert());
        ax = ['x', 'y', 'z'].reduce((a, c) => (Math.abs(out[c]) > Math.abs(out[a]) ? c : a), 'x');
        sg = Math.sign(out[ax]) || 1;
      }
      if (memo) ({ ax, sg } = memo);
      else
        app.ED.fwd.set(b.node.name, {
          ax,
          sg,
        }); /* the direction is fixed once per part: moving near the camera can't flip it, so Send backward undoes Bring forward */
      shapeEdit(() => {
        const [o_, k_] = pos,
          v0 = o_[k_]?.[ax] ?? 0;
        o_[k_] = {
          x: 0,
          y: 0,
          z: 0,
          ...o_[k_],
          [ax]: Math.max(-64, Math.min(64, d * sg > 0 ? Math.floor(v0 * 2 + 1e-6) / 2 + 0.5 : Math.ceil(v0 * 2 - 1e-6) / 2 - 0.5)),
        };
      });
    }; /* off-grid parts snap to the next half step, then move evenly */
    return [
      el(
        'div',
        { class: 'wshead row' },
        el('span', { class: 'grow', text: 'Parts' }),
        el('button', { class: 'iconbtn', text: '+', title: 'Add part (A)', 'aria-label': 'Add part', onclick: startPlacing }),
        el('button', { class: 'iconbtn', text: '⧉', title: 'Add item…', 'aria-label': 'Add item', onclick: guard(combinePick) })
      ),
      el(
        'div',
        { class: 'outliner' },
        boxes.map((x, k) => {
          const name = boxLabel(x.node),
            same = boxes.filter(y => boxLabel(y.node) === name),
            nth = same.length > 1 ? ' ' + (same.findIndex(y => y.node === x.node) + 1) : '';
          return el(
            'div',
            { class: 'partrow' + (k === i ? ' on' : '') },
            el('button', {
              class: k === i ? 'on' : '',
              text: name + nth,
              onclick: e => {
                const now = Date.now(),
                  again = app.ED.box === k && now - (app.ED.pickAt || 0) < 450;
                app.ED.pickAt = now;
                if (again) return renameBox(e.currentTarget, x.node);
                app.ED.box = k;
                render();
                placeGizmo();
                app.st.showMesh(app.st.findMesh(o => o.material?.map?.image === app.ED.canvas && o.userData.nodeName === x.node.name));
              },
              onmouseenter: () => app.st.highlight(o => o.material?.map?.image === app.ED.canvas && o.userData.nodeName === x.node.name),
              onmouseleave: () => outlineBox(),
            }),
            el('button', {
              class: 'partdel',
              text: '✕',
              title: 'Delete (Del)',
              'aria-label': 'Delete ' + name + nth,
              onclick: () => delBox(k),
            })
          );
        })
      ),
      el('div', { class: 'options' }, act('Reset item', resetShape)),
      el('div', { class: 'wshead', text: boxLabel(b.node) }),
      el(
        'div',
        { class: 'options' },
        act('Duplicate', () => addBox('dup'), 'Ctrl+D'),
        act('Mirror', () => addBox('mirror'), 'Shift+M'),
        el('button', {
          class: 'chip' + (app.ED.sym ? ' on' : ''),
          text: 'Symmetry',
          'aria-pressed': String(!!app.ED.sym),
          onclick: () => {
            app.ED.sym = !app.ED.sym;
            render();
          },
        })
      ),
      xyz(
        'Position',
        ['x', 'y', 'z'].map(ax => posField(ax.toUpperCase(), ax))
      ),
      el('div', { class: 'options' }, act('Bring forward', nudgeZ(0.5)), act('Send backward', nudgeZ(-0.5))),
      xyz('Size', [
        axisField('W', sh.settings, 'size', 'x', 1, 64),
        axisField('H', sh.settings, 'size', 'y', 1, 64),
        sh.type === 'quad' ? null : axisField('D', sh.settings, 'size', 'z', 1, 64),
      ]),
      xyz('Rotation', [turnField('X', 0), turnField('Y', 1), turnField('Z', 2)]),
      el(
        'div',
        { class: 'options' },
        (() => {
          const cb = curBox(),
            x = act('Separate texture', () => {
              const b = curBox();
              if (b && !sharersOf(b.node.name).length) return;
              ownArea();
            });
          x.disabled = !cb || !sharersOf(cb.node.name).length;
          return x;
        })() /* only when the part shares paint */
      ),
    ];
  }
  const dupBox = () => addBox('dup');
  function delBox(k = app.ED.box || 0) {
    const boxes = boxesOf(app.ED.model),
      i = k,
      b = boxes[i];
    if (!b) return; /* a part goes with the parts attached to it (an added hat's pieces) */
    const inside = boxesOf({ nodes: [b.node] }).length;
    if (boxes.length - inside < 1) return say(inside > 1 ? 'Every other part is attached to it' : "Can't delete the last part", true);
    const tw = app.ED.sym ? twinOf(b) : null,
      twB = tw && tw !== b.node && boxes.find(x => x.node === tw && !boxesOf({ nodes: [b.node] }).some(y => y.node === tw)),
      twIn = twB ? boxesOf({ nodes: [tw] }).length : 0,
      both = twB && boxes.length - inside - twIn >= 1; /* Symmetry: the twin goes too */
    {
      const before = JSON.stringify(app.ED.model);
      const cut = x => {
        const list = x.parent ? x.parent.children : app.ED.model.nodes;
        list.splice(list.indexOf(x.node), 1);
      };
      cut(b);
      if (both) cut(twB);
      app.ED.box = Math.max(0, Math.min(i, boxesOf(app.ED.model).length - 1));
      finishShape(before);
    }
    const gone = inside + (both ? twIn : 0);
    const keep = fig.usedRects(app.ED.model); /* the paint no part uses any more goes too, so no old blocks stay on the texture */
    app.ED.painter.write((d, W, H) => {
      const used = new Uint8Array(W * H);
      for (const r of keep)
        for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(H, Math.ceil(r.y + r.h)); y++)
          used.fill(1, y * W + Math.max(0, Math.floor(r.x)), y * W + Math.min(W, Math.ceil(r.x + r.w)));
      for (let k = 0; k < W * H; k++) if (!used[k]) d[k * 4 + 3] = 0;
    });
    app.ED.hist.push({ k: 'g', parts: app.ED.hist.splice(-2) });
    render();
    if (gone > 1) {
      const top = app.ED.hist[app.ED.hist.length - 1];
      sayUndo(`Deleted ${gone} parts`, () => {
        if (app.ED && app.ED.hist[app.ED.hist.length - 1] === top) wsUndo(false);
      });
    } else say(''); /* a part with pieces under it says how many went */
  }
  const resetShape = guard(async () => {
    // the game's own shape and paint come back (one undo step)
    say('');
    const e = app.ED,
      f = e.asset.field,
      base = app.CAT.items[f]?.find(x => x.Id === e.asset.baseId && !x.custom),
      orig = uniqNames(structuredClone(await game.json(game.common(e.asset.model))));
    let img = null;
    if (base) {
      const worn = e.before?.[f],
        val = e.asset.tone ? base.Id + '.' + e.asset.tone : worn && parse(worn).id === base.Id ? worn : app.R.partStr(base),
        sk = { ...app.cur.skin, [f]: val };
      for (const h of HIDE[f] || []) delete sk[h];
      const r = app.R.resolve(f, sk);
      if (r) img = await fig.bakedCanvas(r.tex, r.tint).catch(() => null);
    }
    if (app.ED !== e) return;
    if (img && e.model && JSON.stringify(e.model) === JSON.stringify(orig)) {
      const c = e.canvas,
        d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data,
        src = img.getContext('2d').getImageData(0, 0, img.width, img.height).data;
      let same = true;
      for (let y = 0; y < c.height && same; y++)
        for (let x = 0; x < c.width; x++) {
          const k = (y * c.width + x) * 4,
            inside = x < img.width && y < img.height,
            j = (y * img.width + x) * 4;
          if (inside ? d[k] !== src[j] || d[k + 1] !== src[j + 1] || d[k + 2] !== src[j + 2] || d[k + 3] !== src[j + 3] : d[k + 3]) {
            same = false;
            break;
          }
        }
      if (same) return;
    } /* already the game version: no step */
    e.noCap = true;
    const h0 = e.hist.length;
    if (img) {
      const c = e.canvas;
      if (img.width > c.width || img.height > c.height) {
        e.painter.grow(Math.max(c.height, img.height), Math.max(c.width, img.width));
        e.asset = { ...e.asset, w: c.width, h: c.height };
      }
      const src = img.getContext('2d').getImageData(0, 0, img.width, img.height).data;
      e.painter.write((d, W) => {
        d.fill(0);
        for (let y = 0; y < img.height; y++) d.set(src.subarray(y * img.width * 4, (y + 1) * img.width * 4), y * W * 4);
      });
    }
    const splitWas = !!e.asset.split;
    e.asset = { ...e.asset, split: false };
    e.splitDone = false; /* shared paint is shared again, as in the game */
    e.noTidy = true;
    try {
      shapeEdit(() => {
        app.ED.model = orig;
        app.ED.box = 0;
      });
    } finally {
      e.noTidy = false;
    }
    e.asset = { ...e.asset, labels: undefined };
    if (e.hist.length > h0) e.hist.push({ k: 'g', splitWas, parts: e.hist.splice(h0) });
    e.noCap = false;
    capHist();
    app.ED.palette = app.ED.painter.palette();
    requestAnimationFrame(() => {
      if (app.ED) {
        fitTexture();
        render();
      }
    });
  });
  function renderWorkspace() {
    const P = app.ED.painter,
      a = app.ED.asset,
      c = app.ED.canvas,
      mode = app.ED.mode || 'paint';
    app.ED.shapeOpen = mode === 'shape';
    $('wstop').replaceChildren(
      ...[
        el('input', {
          type: 'text',
          class: 'wsname',
          value: a.name,
          maxLength: 120,
          'aria-label': 'Name',
          onkeydown: e => {
            if (e.key === 'Enter') e.target.blur();
            else if (e.key === 'Escape') {
              e.target.value = app.ED.asset.name;
              e.target.blur();
            }
          },
          onchange: e => {
            const v = cleanName(e.target.value);
            if (v && gameNamed(v)) {
              e.target.value = app.ED.asset.name;
              return say('A game item has that name', true);
            }
            say('');
            const taken = new Set(app.ASSETS.filter(x => x.id !== app.ED.asset.id).map(x => x.name));
            let v2 = v,
              k2 = 2;
            while (v2 && taken.has(v2)) v2 = cleanName(clip(v, 36) + ' ' + k2++);
            if (v2 !== v) e.target.value = v2;
            /* two items never share a name */ app.ED.asset = { ...app.ED.asset, name: v2 || a.name };
            e.target.value = app.ED.asset.name;
            queueAssetSave();
          },
        }),
        el('span', { id: 'wssaved', class: 'wssaved', text: app.ED.saved === false ? 'Saving…' : 'Saved' }),
        el('span', { class: 'grow' }),
        a.flag
          ? el('button', { class: 'tag none', text: 'Site only', title: FLAG_WHY(a.flag), onclick: () => say(FLAG_WHY(a.flag), true) })
          : null,
        el('button', { class: 'btn icon', text: '↶', title: 'Undo (Ctrl+Z)', disabled: !app.ED.hist.length, onclick: () => wsUndo(false) }),
        el('button', { class: 'btn icon', text: '↷', title: 'Redo (Ctrl+Y)', disabled: !app.ED.fut.length, onclick: () => wsUndo(true) }),

        el('button', {
          id: 'wsdone',
          class: 'btn primary',
          text: 'Done',
          onclick: () => finishAsset(true),
        }) /* Done saves and puts the item on the character */,
      ].filter(Boolean)
    );
    const pickAny = (kind, id) =>
      guard(async () => {
        if (app.ED.mode !== kind) await setMode(kind);
        pickTool(id);
      })();
    const paintIds = ['brush', 'erase', 'fill', 'pick'],
      extra = PAINT_TOOLS.filter(t => !paintIds.includes(t[0]));
    const NAMES = { brush: 'Paint', erase: 'Erase', fill: 'Fill', pick: 'Pick', move: 'Move', resize: 'Resize', rotate: 'Turn' };
    const btn = (kind, [id, label, key, ic]) => {
      const on = app.ED.mode === kind && (kind === 'paint' ? P.tool : app.ED.stool) === id;
      return el(
        'button',
        {
          class: 'wstool' + (on ? ' on' : ''),
          title: (NAMES[id] || SHORT[id] || label) + (key ? ` (${key})` : ''),
          onclick: () => pickAny(kind, id),
        },
        el('span', {}, toolIcon(id) || ic),
        el('b', { text: NAMES[id] || SHORT[id] || label })
      );
    };
    const stg = $('view').parentElement;
    if ($('wstools').parentElement !== stg) stg.appendChild($('wstools')); // the toolbar floats in the view, under the character
    $('wstools').replaceChildren(
      el(
        'div',
        { class: 'wsgroup2' },
        ...PAINT_TOOLS.filter(t => paintIds.includes(t[0]))
          .sort((a, b) => paintIds.indexOf(a[0]) - paintIds.indexOf(b[0]))
          .map(t => btn('paint', t)),
        app.ED.moreTools ? el('div', { class: 'wsextra' }, ...extra.map(t => btn('paint', t))) : null,
        el(
          'button',
          {
            data: { fk: 'moretools' },
            class: 'wstool' + (app.ED.mode !== 'shape' && !app.ED.moreTools && extra.some(t => t[0] === app.ED.painter.tool) ? ' on' : ''),
            'aria-label': app.ED.moreTools ? 'Fewer tools' : 'More tools',
            onclick: () => {
              app.ED.moreTools = !app.ED.moreTools;
              render();
            },
          },
          el('span', {}, toolIcon(app.ED.moreTools ? 'less' : 'more')),
          el('b', { text: app.ED.moreTools ? 'Less' : 'More' })
        )
      ),
      el(
        'div',
        { class: 'wsgroup2' },
        ...SHAPE_TOOLS.map(t => btn('shape', t)),
        el(
          'button',
          {
            class: 'wstool',
            title: 'Add part (A)',
            onclick: guard(async () => {
              if (app.ED.mode !== 'shape') await setMode('shape');
              startPlacing();
            }),
          },
          el('span', {}, toolIcon('add')),
          el('b', { text: 'Add' })
        )
      )
    );
    c.style.width = c.width * app.ED.zoom + 'px';
    if (!app.ED.box_) {
      app.ED.box_ = el('div', { class: 'paintbox' });
      bindTexView(app.ED.box_);
    }
    app.ED.box_.replaceChildren(el('div', { class: 'paintwrap' }, c, limits(c), sizeOvl()));
    app.ED.box_.classList.toggle('resizing', mode === 'shape' && app.ED.stool === 'resize'); // drag a part's area on the texture to resize it
    $('wsleft').replaceChildren(
      ...[
        el(
          'div',
          { class: 'wshead row' },
          el('span', { text: 'Texture', class: 'grow' }),
          el('button', {
            class: 'chip' + (app.ED.wide ? ' on' : ''),
            text: app.ED.wide ? 'Smaller' : 'Bigger',
            onclick: e => {
              app.ED.wide = !app.ED.wide;
              app.ED.userZoom = false;
              e.currentTarget.textContent = app.ED.wide ? 'Smaller' : 'Bigger';
              e.currentTarget.classList.toggle('on', app.ED.wide);
              $('app').classList.toggle('ws-wide', app.ED.wide);
              requestAnimationFrame(() => {
                fitTexture();
                render();
              });
            },
          })
        ),
        app.ED.box_,
        el(
          'div',
          { class: 'row' },
          el('button', {
            class: 'btn icon',
            text: '−',
            title: 'Zoom out',
            disabled: app.ED.zoom <= ZOOMS[0],
            onclick: () => zoomCentre(zoomStep(app.ED.zoom, -1)),
          }),
          el('button', {
            data: { fk: 'zoompct' },
            class: 'btn ghost zoompct',
            text: Math.round(app.ED.zoom * 100) + '%',
            title: 'Fit (Ctrl+0)',
            onclick: () => {
              app.ED.userZoom = false;
              fitTexture();
              render();
            },
          }),
          el('button', {
            class: 'btn icon',
            text: '+',
            title: 'Zoom in',
            disabled: app.ED.zoom >= 24,
            onclick: () => zoomCentre(zoomStep(app.ED.zoom, 1)),
          }),
          app.ED.rects.length && app.ED.mode !== 'shape'
            ? el('button', {
                class: 'chip' + (P.inside ? '' : ' on'),
                text: 'Paint outside',
                'aria-pressed': String(!P.inside),
                onclick: () => {
                  P.inside = !P.inside;
                  render();
                },
              })
            : null
        ),
      ].filter(Boolean)
    );
    $('wsright').replaceChildren(...(mode === 'paint' ? paintSide() : shapeSide()).flat(Infinity).filter(Boolean));
    $('wsright').querySelector('.partrow.on')?.scrollIntoView({ block: 'nearest' });
    viewHint();
    $('viewbtns').replaceChildren(
      // just the item/whole-body switch: turning and zooming are drag and wheel (number keys still jump to a view)
      el('button', {
        class: app.ED.iso ? 'on' : '',
        text: 'Item only',
        'aria-pressed': String(!!app.ED.iso),
        onclick: () => {
          app.ED.iso = !app.ED.iso;
          app.st.isolate(app.ED.iso ? app.ED.canvas : null);
          render();
        },
      })
    );
  }
  // shortcuts while the workspace is open (caught before the page's own Ctrl+Z, which undoes the skin)
  addEventListener(
    'keydown',
    e => {
      if (app.ED && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && e.target?.matches?.('input, textarea')) {
        e.preventDefault();
        return;
      } /* no bookmark dialog from inside the editor's fields */
      if (app.ED && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        e.stopImmediatePropagation();
        try {
          document.activeElement?.blur?.();
        } catch {
          /* fine */
        }
        flushNow();
        if (app.ED.saved === false) queueAssetSave();
        return;
      } /* Ctrl+S saves now, from anywhere in the editor */
      if (!app.ED || e.target?.matches?.('input, textarea, select') || $('dlg').open) return;
      const k = e.key.toLowerCase(),
        ctrl = e.ctrlKey || e.metaKey;
      let done = true;
      if (ctrl && k === 'z') wsUndo(e.shiftKey);
      else if (ctrl && k === 'y') wsUndo(true);
      else if (app.ED.adjOpen) {
        if (k === 'escape' && app.ED.adjCancel) app.ED.adjCancel();
        else done = !['tab', 'shift', 'control', 'alt'].includes(k);
      } /* nothing edits the texture while colours are being adjusted */ else if (ctrl && k === 'd' && app.ED.mode === 'shape') dupBox();
      else if (k === 'f2' && app.ED.mode === 'shape' && curBox()) {
        const b = document.querySelector('.partrow.on > button');
        if (b) renameBox(b, curBox().node);
      } else if (app.ED.mode === 'shape' && !ctrl && k === 'a') startPlacing(); /* M is Select area everywhere; Mirror is Shift+M */
      else if (app.ED.mode === 'shape' && !ctrl && k === 'm' && e.shiftKey) addBox('mirror');
      else if (k === 'escape' && app.ED.placing) {
        app.ED.placing = false;
        say('');
        viewHint();
      } else if (app.ED.mode !== 'shape' && ctrl && (k === 'c' || k === 'x')) copySel(k === 'x');
      else if (app.ED.mode !== 'shape' && ctrl && k === 'v') pasteClip();
      else if (app.ED.mode !== 'shape' && ctrl && k === 'a') {
        app.ED.sel = { x: 0, y: 0, w: app.ED.canvas.width, h: app.ED.canvas.height };
        app.ED.painter.tool = 'select';
        render();
      } else if (app.ED.mode !== 'shape' && k === 'enter' && app.ED.float) {
        placeFloat();
        render();
      } else if (app.ED.mode !== 'shape' && k === 'escape' && (app.ED.float || app.ED.sel)) {
        if (app.ED.float) app.ED.float = null;
        else app.ED.sel = null;
        render();
      } else if (app.ED.mode !== 'shape' && (k === 'delete' || k === 'backspace') && app.ED.sel && !app.ED.float) clearSel();
      else if ((k === 'delete' || k === 'x') && app.ED.mode === 'shape' && !ctrl) delBox();
      else if (k === 'a' && !ctrl && !e.altKey)
        guard(async () => {
          if (app.ED.mode !== 'shape') await setMode('shape');
          startPlacing();
        })();
      else if (app.ED.float && !ctrl && k.startsWith('arrow')) {
        const d = { arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, -1], arrowdown: [0, 1] }[k],
          m = e.shiftKey ? 8 : 1;
        keepFloatOn(app.ED.float.x + d[0] * m, app.ED.float.y + d[1] * m);
        render();
      } /* arrows move a paste that isn't placed yet */ else if (
        app.ED.mode === 'shape' &&
        (k === 'arrowup' || k === 'arrowdown') &&
        e.target?.closest?.('.partrow')
      ) {
        const n = boxesOf(app.ED.model).length;
        app.ED.box = Math.max(0, Math.min(n - 1, (app.ED.box || 0) + (k === 'arrowup' ? -1 : 1)));
        render();
        placeGizmo();
        document.querySelector('.partrow.on > button')?.focus();
      } /* arrows in the parts list move the selection */ else if (ctrl && k === 's') {
        flushNow();
        if (app.ED.saved === false) queueAssetSave();
      } /* everything saves by itself; Ctrl+S just saves now */ else if (ctrl && k === 'd' && app.ED.mode !== 'shape') {
      } /* no bookmark dialog while painting */ else if (e.key === '?') showKeys();
      else if (ctrl && k === '0') {
        app.ED.userZoom = false;
        fitTexture();
        render();
      } /* Ctrl+0 fits the texture */ else if (k === 'escape' && app.ED.moreTools) {
        app.ED.moreTools = false;
        render();
      } else if (app.ED.mode === 'shape' && !ctrl && k.startsWith('arrow') && curBox()) {
        const sh = curBox().node.shape,
          d = { arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, 1], arrowdown: [0, -1] }[k];
        shapeEdit(() => {
          const o = { x: 0, y: 0, z: 0, ...sh.offset };
          if (e.shiftKey) o.z += d[1] || -d[0];
          else {
            o.x += d[0];
            o.y += d[1];
          }
          sh.offset = o;
        });
      } else if (['1', '2', '3', '7', '5'].includes(k) && !ctrl) {
        app.st.setView({ 1: 'front', 2: 'back', 3: 'side', 7: 'top', 5: 'persp' }[k]);
        app.st.frameOn(app.ED.canvas);
      } else if (
        app.ED.mode !== 'shape' &&
        !ctrl &&
        (k === '[' || k === ']') &&
        ['brush', 'erase', 'light', 'dark', 'noise', 'line', 'box'].includes(app.ED.painter.tool)
      ) {
        const P = app.ED.painter;
        P.size = Math.max(1, Math.min(8, P.size + (k === ']' ? 1 : -1)));
        render();
      } else if (app.ED.mode !== 'shape' && k === 'alt' && !e.repeat && !app.ED.float && app.ED.painter.tool !== 'pick') {
        app.ED.altFrom = app.ED.painter.tool;
        pickTool('pick');
      } else if (!ctrl && !e.altKey) {
        const same = (app.ED.mode === 'shape' ? SHAPE_TOOLS : PAINT_TOOLS).find(x => x[2] && x[2].toLowerCase() === k),
          other = (app.ED.mode === 'shape' ? PAINT_TOOLS : SHAPE_TOOLS).find(x => x[2] && x[2].toLowerCase() === k);
        if (same) pickTool(same[0]);
        else if (other)
          guard(async () => {
            await setMode(app.ED.mode === 'shape' ? 'paint' : 'shape');
            pickTool(other[0]);
          })();
        else done = false;
      } else done = false;
      if (done) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true
  );

  addEventListener(
    'keyup',
    e => {
      if (app.ED && e.key === 'Alt' && app.ED.altFrom) {
        const t = app.ED.altFrom;
        app.ED.altFrom = null;
        if (app.ED.mode !== 'shape' && !app.ED.float) pickTool(t);
        e.preventDefault();
      }
    },
    true
  ); // holding Alt picks colours, letting go goes back
  addEventListener('blur', () => {
    if (app.ED && app.ED.altFrom) {
      const t = app.ED.altFrom;
      app.ED.altFrom = null;
      if (app.ED.mode !== 'shape') pickTool(t);
    }
  });
  // ---- brush outline, area selection and copy-paste on the flat texture
  const brushSize = () => {
    const t = app.ED.painter.tool;
    return t === 'line' || t === 'box' ? app.ED.painter.size : SHAPES.has(t) || ONCE.has(t) || t === 'select' ? 1 : app.ED.painter.size;
  };
  function sizeOvl() {
    const o = app.ED.ovl,
      z = app.ED.zoom,
      c = app.ED.canvas,
      W = Math.round(c.width * z),
      H = Math.round(c.height * z);
    if (o.width !== W || o.height !== H) {
      o.width = W;
      o.height = H;
      o.style.width = W + 'px';
    }
    drawOvl();
    return o;
  }
  function drawOvl() {
    if (!app.ED || !app.ED.ovl) return;
    const o = app.ED.ovl,
      z = app.ED.zoom,
      x = o.getContext('2d');
    x.clearRect(0, 0, o.width, o.height);
    const box = (r, col, dash) => {
      for (const [c, w] of [
        ['rgba(0,0,0,.7)', 3],
        [col, 1],
      ]) {
        x.setLineDash(dash && w === 1 ? [4, 3] : []);
        x.strokeStyle = c;
        x.lineWidth = w;
        x.strokeRect(r.x * z + 0.5, r.y * z + 0.5, r.w * z - 1, r.h * z - 1);
      }
      x.setLineDash([]);
    };
    const f = app.ED.float;
    if (f) {
      if (!f.cv) {
        f.cv = el('canvas', { width: f.img.width, height: f.img.height });
        f.cv.getContext('2d').putImageData(f.img, 0, 0);
      }
      x.imageSmoothingEnabled = false;
      x.drawImage(f.cv, f.x * z, f.y * z, f.img.width * z, f.img.height * z);
      box({ x: f.x, y: f.y, w: f.img.width, h: f.img.height }, '#7fd3ff', true);
    } else if (app.ED.sel) box(app.ED.sel, '#7fd3ff', true);
    if (app.ED.mode !== 'shape') {
      const s = brushSize(),
        off = Math.floor((s - 1) / 2);
      for (const [p, col] of [
        [app.ED.hover, '#ffffff'],
        [app.ED.hoverM, '#f4c452'],
      ])
        if (p) box({ x: p.x - off, y: p.y - off, w: s, h: s }, col);
    }
  }
  function bindSelect(c, toPixel) {
    // the Select tool: drag out an area, or drag a pasted piece to move it
    let drag = null;
    c.addEventListener('pointerdown', e => {
      if (!app.ED || e.button !== 0 || app.ED.painter.tool !== 'select' || app.ED.mode === 'shape') return;
      const p = toPixel(e);
      e.preventDefault();
      try {
        c.setPointerCapture(e.pointerId);
      } catch {
        /* fine */
      }
      const f = app.ED.float;
      if (f && p.x >= f.x && p.y >= f.y && p.x < f.x + f.img.width && p.y < f.y + f.img.height)
        drag = { move: true, dx: p.x - f.x, dy: p.y - f.y };
      else {
        if (f) placeFloat();
        drag = { x: p.x, y: p.y };
        app.ED.sel = { x: p.x, y: p.y, w: 1, h: 1 };
      }
      drawOvl();
    });
    c.addEventListener('pointermove', e => {
      if (!drag || !app.ED) return;
      const p = toPixel(e);
      if (drag.move) keepFloatOn(p.x - drag.dx, p.y - drag.dy);
      else
        app.ED.sel = { x: Math.min(drag.x, p.x), y: Math.min(drag.y, p.y), w: Math.abs(p.x - drag.x) + 1, h: Math.abs(p.y - drag.y) + 1 };
      drawOvl();
    });
    const up = () => {
      if (drag) {
        drag = null;
        render();
      }
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
  }
  function copySel(cut) {
    if (!app.ED.sel) return say('Select an area first', true);
    const { x, y, w, h } = app.ED.sel;
    CLIP = app.ED.canvas.getContext('2d', { willReadFrequently: true }).getImageData(x, y, w, h);
    if (cut && CLIP.data.some((v, i) => i % 4 === 3 && v))
      app.ED.painter.write((d, W) => {
        for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) d[(j * W + i) * 4 + 3] = 0;
      });
    render();
  }
  function pasteClip() {
    if (!CLIP) return say('Nothing copied', true);
    if (app.ED.float) placeFloat();
    const W = app.ED.canvas.width,
      H = app.ED.canvas.height,
      a0 = app.ED.sel || app.ED.hover || { x: 0, y: 0 },
      at = { x: Math.max(0, Math.min(a0.x, W - CLIP.width)), y: Math.max(0, Math.min(a0.y, H - CLIP.height)) };
    app.ED.float = { img: new ImageData(new Uint8ClampedArray(CLIP.data), CLIP.width, CLIP.height), x: at.x, y: at.y };
    app.ED.painter.tool = 'select';
    render();
  }
  function keepFloatOn(x, y) {
    const f = app.ED.float,
      W = app.ED.canvas.width,
      H = app.ED.canvas.height;
    f.x = Math.max(1 - f.img.width, Math.min(W - 1, x));
    f.y = Math.max(1 - f.img.height, Math.min(H - 1, y));
  } // at least one texel of a paste stays on the texture
  function placeFloat() {
    // stamps the pasted piece where it sits (see-through texels stay as they were; Inside only still holds)
    const f = app.ED.float;
    if (!f) return;
    app.ED.float = null;
    const P = app.ED.painter,
      w = f.img.width,
      h = f.img.height,
      s = f.img.data;
    {
      const C = app.ED.canvas,
        cur_ = C.getContext('2d').getImageData(0, 0, C.width, C.height).data;
      let diff = false;
      for (let j = 0; j < h && !diff; j++)
        for (let i = 0; i < w; i++) {
          const X = f.x + i,
            Y = f.y + j,
            a = (j * w + i) * 4;
          if (X < 0 || Y < 0 || X >= C.width || Y >= C.height || !s[a + 3]) continue;
          if (P.inside && P.mask && !P.mask[Y * C.width + X]) continue;
          const k = (Y * C.width + X) * 4;
          if (cur_[k] !== s[a] || cur_[k + 1] !== s[a + 1] || cur_[k + 2] !== s[a + 2] || cur_[k + 3] !== s[a + 3]) {
            diff = true;
            break;
          }
        }
      if (!diff) {
        const x0 = Math.max(0, f.x),
          y0 = Math.max(0, f.y);
        app.ED.sel = { x: x0, y: y0, w: Math.max(1, Math.min(C.width, f.x + w) - x0), h: Math.max(1, Math.min(C.height, f.y + h) - y0) };
        return;
      }
    } /* placed where it already was: no step */
    P.write((d, W, H) => {
      for (let j = 0; j < h; j++)
        for (let i = 0; i < w; i++) {
          const X = f.x + i,
            Y = f.y + j,
            a = (j * w + i) * 4;
          if (X < 0 || Y < 0 || X >= W || Y >= H || !s[a + 3]) continue;
          const k = Y * W + X;
          if (P.inside && P.mask && !P.mask[k]) continue;
          d.set(s.subarray(a, a + 4), k * 4);
        }
    });
    {
      const W = app.ED.canvas.width,
        H = app.ED.canvas.height,
        x0 = Math.max(0, f.x),
        y0 = Math.max(0, f.y);
      app.ED.sel = { x: x0, y: y0, w: Math.max(1, Math.min(W, f.x + w) - x0), h: Math.max(1, Math.min(H, f.y + h) - y0) };
    }
  }
  function flipFloat(across) {
    const f = app.ED.float;
    if (!f) return;
    const w = f.img.width,
      h = f.img.height,
      s = f.img.data,
      out = new ImageData(w, h);
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) {
        const a = (j * w + i) * 4,
          b = ((across ? j : h - 1 - j) * w + (across ? w - 1 - i : i)) * 4;
        out.data.set(s.subarray(b, b + 4), a);
      }
    f.img = out;
    f.cv = null;
    drawOvl();
  }
  function clearSel() {
    const s = app.ED.sel;
    if (!s) return;
    {
      const d = app.ED.canvas.getContext('2d').getImageData(s.x, s.y, s.w, s.h).data;
      let any = false;
      for (let i = 3; i < d.length; i += 4)
        if (d[i]) {
          any = true;
          break;
        }
      if (!any) return;
    } /* an empty area: nothing to clear, no step */
    app.ED.painter.write((d, W) => {
      for (let j = s.y; j < s.y + s.h; j++) for (let i = s.x; i < s.x + s.w; i++) d[(j * W + i) * 4 + 3] = 0;
    });
  }

  // ---- boxes with their own room on the texture, mirrored copies and symmetry
  const FACE_UV = { front: [0, 1], back: [0, 1], right: [2, 1], left: [2, 1], top: [0, 2], bottom: [0, 2] };
  const faceDims = sh => {
    const s = ['x', 'y', 'z'].map(k => Math.ceil(Math.abs(sh.settings?.size?.[k] ?? 0)));
    return (sh.type === 'quad' ? ['front'] : Object.keys(FACE_UV))
      .map(f => [f, s[FACE_UV[f][0]], s[FACE_UV[f][1]]])
      .filter(([, w, h]) => w > 0 && h > 0);
  };
  function allocLayout(sh) {
    // free room on the texture for a box's faces: one Blockbench-style block if it fits, else face by face
    const W = app.ED.canvas.width,
      H = app.ED.canvas.height,
      occ = new Uint8Array(W * H);
    for (const r of app.ED.rects)
      for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(H, Math.ceil(r.y + r.h)); y++)
        for (let x = Math.max(0, Math.floor(r.x)); x < Math.min(W, Math.ceil(r.x + r.w)); x++) occ[y * W + x] = 1;
    const fits = (x0, y0, w, h) => {
      for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (occ[y * W + x]) return false;
      return true;
    };
    const spot = (w, h) => {
      for (let y = 0; y + h <= H; y++) for (let x = 0; x + w <= W; x++) if (fits(x, y, w, h)) return { x, y };
      return null;
    };
    const face = (x, y) => ({ offset: { x, y }, mirror: { x: false, y: false }, angle: 0 }),
      dims = faceDims(sh);
    if (!dims.length) return null;
    if (dims.length === 6) {
      const by = Object.fromEntries(dims.map(d => [d[0], d])),
        w = by.front[1],
        h = by.front[2],
        d = by.top[2],
        at = spot(2 * (w + d), d + h);
      if (at) {
        const { x, y } = at;
        return {
          top: face(x + d, y),
          bottom: face(x + d + w, y),
          right: face(x, y + d),
          front: face(x + d, y + d),
          left: face(x + d + w, y + d),
          back: face(x + 2 * d + w, y + d),
        };
      }
    }
    const out = {};
    for (const [f, w, h] of dims.sort((a, b) => b[1] * b[2] - a[1] * a[2])) {
      const at = spot(w, h);
      if (!at) return null;
      for (let y = at.y; y < at.y + h; y++) occ.fill(1, y * W + at.x, y * W + at.x + w);
      out[f] = face(at.x, at.y);
    }
    return out;
  }
  function texelAt(fl, u, v) {
    const pu = (u + 0.5) * (fl.mirror?.x ? -1 : 1),
      pv = (v + 0.5) * (fl.mirror?.y ? -1 : 1),
      ox = fl.offset?.x ?? 0,
      oy = fl.offset?.y ?? 0,
      a = (((fl.angle | 0) % 360) + 360) % 360;
    const [X, Y] = a === 90 ? [ox - pv, oy + pu] : a === 180 ? [ox - pu, oy - pv] : a === 270 ? [ox + pv, oy - pu] : [ox + pu, oy + pv];
    return [Math.floor(X), Math.floor(Y)];
  }
  // paints a box's faces in their new place: copied from the old place (flipped left to right for a mirror), or one colour
  const paintFaces = (sh, dst, src, flip, rgb) => (d, W, H) => {
    for (const [f, fu, fv] of faceDims(sh)) {
      const to = dst[f],
        from = src && src[flip ? { left: 'right', right: 'left' }[f] || f : f];
      if (!to) continue;
      for (let v = 0; v < fv; v++)
        for (let u = 0; u < fu; u++) {
          const [dx, dy] = texelAt(to, u, v);
          if (dx < 0 || dy < 0 || dx >= W || dy >= H) continue;
          const j = (dy * W + dx) * 4;
          if (rgb) {
            d[j] = rgb[0];
            d[j + 1] = rgb[1];
            d[j + 2] = rgb[2];
            d[j + 3] = 255;
            continue;
          }
          if (!from) continue;
          const [sx, sy] = texelAt(from, flip ? fu - 1 - u : u, v);
          if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
          const i = (sy * W + sx) * 4;
          d[j] = d[i];
          d[j + 1] = d[i + 1];
          d[j + 2] = d[i + 2];
          d[j + 3] = d[i + 3];
        }
    }
  };
  const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  function mirrorNode(src, dst) {
    // dst becomes src flipped across the middle (left to right)
    const s = src.shape,
      d = dst.shape,
      p = src.position || {},
      o = s.offset || {},
      q = src.orientation || {},
      neg = v => -(v ?? 0) || 0;
    d.settings = { ...d.settings, size: { ...s.settings?.size } };
    if (s.type === 'quad' && /X$/.test(s.settings?.normal || '')) d.settings.normal = (s.settings.normal[0] === '+' ? '-' : '+') + 'X';
    d.offset = { x: neg(o.x), y: o.y ?? 0, z: o.z ?? 0 };
    dst.position = { x: neg(p.x), y: p.y ?? 0, z: p.z ?? 0 };
    dst.orientation = { x: q.x ?? 0, y: neg(q.y), z: neg(q.z), w: q.w ?? 1 };
  }
  // the other side's name: L-Arm <-> R-Arm, Left_Boot <-> Right_Boot, Glove_L <-> Glove_R; null for a name with no side
  function sideSwap(name) {
    const rules = [
      [/^L-/, 'R-'],
      [/^R-/, 'L-'],
      [/Left/, 'Right'],
      [/Right/, 'Left'],
      [/left/, 'right'],
      [/right/, 'left'],
      [/([_-])L(?=$|[_-])/, '$1R'],
      [/([_-])R(?=$|[_-])/, '$1L'],
    ];
    for (const [re, to] of rules) if (re.test(name)) return name.replace(re, to);
    return null;
  }
  function nodeNamed(name) {
    let hit = null;
    const walk = (list, parent) => {
      for (const n of list || []) {
        if (hit) return;
        if (n.name === name) {
          hit = { node: n, parent };
          return;
        }
        walk(n.children, n);
      }
    };
    walk(app.ED.model.nodes, null);
    return hit;
  }
  const twinParentOf = parent => {
    const sw = parent && sideSwap(parent.name),
      t = sw && nodeNamed(sw);
    return t ? t.node : null;
  };
  function twinOf(b) {
    // the box on the other side: the part with the other side's name, else the mirrored box in the other side's parent or beside it
    if (!b) return null;
    const n = b.node,
      sh = n.shape,
      near = (a, c) => Math.abs((a ?? 0) - (c ?? 0)) < 0.01;
    const sw = sideSwap(n.name),
      byName = sw && nodeNamed(sw);
    if (byName && byName.node.shape) return byName.node;
    {
      const path = (l, t, acc = []) => {
          for (const x of l || []) {
            if (x === t) return [...acc, x];
            const p = path(x.children, t, [...acc, x]);
            if (p) return p;
          }
          return null;
        },
        chain = path(app.ED.model.nodes, n) || []; /* a part deep under L-Arm: the same place under R-Arm */
      for (let i = chain.length - 2; i >= 0; i--) {
        const s2 = sideSwap(chain[i].name),
          top = s2 && nodeNamed(s2)?.node;
        if (!top) continue;
        let at = top;
        for (let j = i + 1; j < chain.length && at; j++) {
          const k = (chain[j - 1].children || []).indexOf(chain[j]);
          at = (at.children || [])[k];
        }
        if (at && at !== n && at.shape && at.shape.type === sh.type) return at;
        break;
      }
    }
    const tp = twinParentOf(b.parent);
    if (!tp && Math.abs((n.position?.x ?? 0) + (sh.offset?.x ?? 0)) < 0.25) return null;
    return (
      (tp ? tp.children || [] : b.parent ? b.parent.children : app.ED.model.nodes).find(
        t =>
          t !== n &&
          t.shape &&
          t.shape.type === sh.type &&
          ['x', 'y', 'z'].every(k => near(t.shape.settings?.size?.[k], sh.settings?.size?.[k])) &&
          ['x', 'y', 'z'].every(a =>
            near(
              (t.position?.[a] ?? 0) + (t.shape.offset?.[a] ?? 0),
              (a === 'x' ? -1 : 1) * ((n.position?.[a] ?? 0) + (sh.offset?.[a] ?? 0))
            )
          )
      ) || null
    ); /* where the box really sits, however it is split between position and offset */
  }
  const symTwin = () => (app.ED.sym && app.ED.mode === 'shape' ? twinOf(curBox()) : null);
  function standOut(hex) {
    // the brush colour, unless it would hide the new box against the item's main colour
    const mains = (app.ED.palette || []).slice(0, 4),
      d = (a, b) => {
        const [p, q] = [hexRgb(a), hexRgb(b)];
        return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]);
      };
    const far = c => Math.min(Infinity, ...mains.map(m => d(c, m))); // how far a colour is from the nearest of the item's main colours
    if (!mains.length || far(hex) > 160) return hex;
    return ['#f4c452', '#3db7c9', '#7cc444', '#ffffff', '#7a4fd6'].reduce((a, b) => (far(b) > far(a) ? b : a));
  }
  function copyLabel(src, mirror) {
    // a copy is named after its part: "Horn copy"; a mirrored "Left glove" becomes "Right glove"
    const used = new Set(boxesOf(app.ED.model).map(b => boxLabel(b.node))),
      side = mirror && /^(Left|Right) /.test(src) ? src.replace(/^(Left|Right) /, m => (m === 'Left ' ? 'Right ' : 'Left ')) : null,
      stem = side || src.replace(/ copy( \d+)?$/, ''),
      suf = side ? '' : ' copy';
    let n = '',
      k = 1;
    do {
      const t = suf + (k > 1 ? ' ' + k : '');
      n = stem.slice(0, 30 - t.length).trimEnd() + t;
      k++;
    } while (used.has(n) && k < 1000);
    return n;
  } /* the name is cut, never the "copy N" ending, so copies stay unique */
  function nextBoxName() {
    const used = new Set(boxesOf(app.ED.model).map(b => boxLabel(b.node)));
    let k = 1;
    while (used.has('Box ' + k)) k++;
    return 'Box ' + k;
  }
  function startPlacing() {
    if (app.ED.model && boxesOf(app.ED.model).length >= assets.MAX_BOXES) return say(`Limit is ${assets.MAX_BOXES} parts`, true);
    app.ED.placing = true;
    say('Click to place · Esc to cancel');
    viewHint();
  } // the hint under the view says what to do
  function dragBox(e, mesh) {
    // the Move tool: drag the box itself
    const d = app.st.boxDrag(mesh, e.clientX, e.clientY);
    if (!d) return;
    e.stopImmediatePropagation();
    let last = null;
    const v = $('view');
    try {
      v.setPointerCapture(e.pointerId);
    } catch {
      /* fine */
    }
    const move = ev => {
      last = d.move(ev.clientX, ev.clientY) || last;
    };
    const up = () => {
      v.removeEventListener('pointermove', move);
      v.removeEventListener('pointerup', up);
      d.end();
      const b = curBox();
      if (!last || !b || last.length() < 0.25) return;
      const sh = b.node.shape,
        r = v => Math.round(v * 2) / 2;
      shapeEdit(() => {
        sh.offset = { x: r((sh.offset?.x ?? 0) + last.x), y: r((sh.offset?.y ?? 0) + last.y), z: r((sh.offset?.z ?? 0) + last.z) };
      });
    };
    v.addEventListener('pointermove', move);
    v.addEventListener('pointerup', up);
  }
  // ---- Combine: another item's parts and paint join the one being edited (worn together as one piece in this slot)
  async function combineSource(f, e) {
    // that item's model and its painted texture
    if (e.custom) {
      const a = app.ASSETS.find(x => 'Custom_' + x.id === e.Id);
      if (!a) throw new Error('That custom item is gone.');
      const bmp = await createImageBitmap(a.data),
        c = el('canvas', { width: bmp.width, height: bmp.height });
      c.getContext('2d').drawImage(bmp, 0, 0);
      return { model: a.shape ? JSON.parse(a.shape) : structuredClone(await game.json(game.common(a.model))), canvas: c };
    }
    const r = app.R.resolve(f, { ...app.cur.skin, [f]: app.R.partStr(e) });
    if (!r) throw new Error('That item could not be read.');
    const c = await fig.bakedCanvas(r.tex, r.tint).catch(() => {
      throw new Error(`${itemName(e)} is not in your game files.`);
    });
    return { model: structuredClone(await game.json(game.common(r.model))), canvas: c };
  }
  async function combineWith(f, e) {
    say('');
    const src = await combineSource(f, e);
    await editModel();
    const names = new Set(),
      seen = list => {
        for (const n of list || []) {
          names.add(n.name);
          seen(n.children);
        }
      };
    seen(app.ED.model.nodes);
    const fresh = n => {
      const b = String(n).slice(0, 56);
      let k = n,
        i = 2;
      while (names.has(k)) k = b + '_' + i++;
      names.add(k);
      return k;
    }; /* names stay under the 64-character limit */
    const renameAll = n => {
      n.name = fresh(n.name);
      for (const c of n.children || []) renameAll(c);
    };
    const holder = n => !n.shape || n.shape.type === 'none' || n.shape.visible === false; // a bone the parts hang on, not a part
    const added = []; // [box node, its layout in the other item's texture]
    const merge = (into, list) => {
      for (const n of list || []) {
        const same = into.find(x => x.name === n.name);
        if (same && holder(same) && holder(n)) {
          merge((same.children ||= []), n.children);
          continue;
        }
        renameAll(n);
        into.push(n);
        const walk = m => {
          if (m.shape && (m.shape.type === 'box' || m.shape.type === 'quad') && m.shape.visible !== false)
            added.push([m, m.shape.textureLayout || {}]);
          for (const c of m.children || []) walk(c);
        };
        walk(n);
      }
    };
    const count = boxesOf(app.ED.model).length,
      before = JSON.stringify(app.ED.model);
    const incoming = [];
    {
      const walk = m => {
        if (m.shape && (m.shape.type === 'box' || m.shape.type === 'quad') && m.shape.visible !== false) incoming.push(m);
        for (const c of m.children || []) walk(c);
      };
      src.model.nodes.forEach(walk);
    }
    if (count + incoming.length > assets.MAX_BOXES) throw new Error(`Limit is ${assets.MAX_BOXES} parts`);
    merge(app.ED.model.nodes, src.model.nodes);
    // room on this item's texture for each new box (the texture grows when it must), then their paint is copied across in one step
    let used = fig.usedRects(JSON.parse(before));
    const lays = []; // the free room counts this item's own parts and the new ones already placed (not their old spots)
    for (const [n] of added) {
      app.ED.rects = used;
      let lay = allocLayout(n.shape);
      while (!lay && (app.ED.canvas.width < app.ED.canvas.height ? growWider() || growTexture() : growTexture() || growWider())) {
        app.ED.rects = used;
        lay = allocLayout(n.shape);
      }
      if (!lay) {
        app.ED.model = JSON.parse(before);
        app.ED.rects = fig.usedRects(app.ED.model);
        throw new Error('Texture full');
      }
      lays.push(lay);
      n.shape.textureLayout = lay;
      used = used.concat(fig.usedRects({ nodes: [{ ...n, children: [] }] }));
    }
    const S = src.canvas.getContext('2d').getImageData(0, 0, src.canvas.width, src.canvas.height),
      SW = S.width,
      SH = S.height,
      sd = S.data;
    recordShape(before);
    app.ED.painter.write((d, W, H) => {
      added.forEach(([n, from], i) => {
        const to = lays[i];
        for (const [fc, fu, fv] of faceDims(n.shape)) {
          const a = to[fc],
            b = from[fc];
          if (!a || !b) continue;
          for (let v = 0; v < fv; v++)
            for (let u = 0; u < fu; u++) {
              const [dx, dy] = texelAt(a, u, v),
                [sx, sy] = texelAt(b, u, v);
              if (dx < 0 || dy < 0 || dx >= W || dy >= H || sx < 0 || sy < 0 || sx >= SW || sy >= SH) continue;
              const j = (dy * W + dx) * 4,
                k = (sy * SW + sx) * 4;
              d[j] = sd[k];
              d[j + 1] = sd[k + 1];
              d[j + 2] = sd[k + 2];
              d[j + 3] = sd[k + 3];
            }
        }
      });
    });
    app.ED.hist.push({ k: 'g', parts: app.ED.hist.splice(-2) });
    shapeChanged();
    if (added.length) {
      const k = boxesOf(app.ED.model).findIndex(b => b.node === added[0][0]);
      if (k >= 0) {
        app.ED.box = k;
        render();
        placeGizmo();
        const nm = added[0][0].name;
        setTimeout(() => {
          const m = app.ED && app.st.findMesh(o => o.userData.nodeName === nm);
          if (m) {
            app.st.showMesh(m);
            placeGizmo();
          }
        }, 200);
      }
    } /* the added item comes in picked and in view */
  }
  async function combinePick() {
    if (app.ED?.model && boxesOf(app.ED.model).length >= assets.MAX_BOXES) return say(`Limit is ${assets.MAX_BOXES} parts`, true); // types down the left (hovering one shows its items at once), item pictures on the right
    const slots = game.FIELDS.filter(f => app.CAT.items[f]?.length);
    let cur_ = slots.includes(combinePick.last)
        ? combinePick.last
        : slots.includes('faceAccessory') && app.ED?.asset.field !== 'faceAccessory'
          ? 'faceAccessory'
          : slots[0],
      chosen = null,
      hov = 0,
      shown = null;
    const find = el('input', { type: 'text', placeholder: 'Search', maxLength: 40, autocomplete: 'off' }),
      grid = el('div', { class: 'cards combinegrid' });
    const fill = (f, force) => {
      if (f === shown && !force) return;
      shown = f;
      const q = find.value.trim().toLowerCase();
      const okE = e =>
        !isTmp(e) &&
        !(!e.custom && editLocked(e)) &&
        !(app.ED && e.Id === 'Custom_' + app.ED.asset.id) &&
        (!q || itemName(e).toLowerCase().includes(q));
      const list = (q ? slots : [f])
        .flatMap(g =>
          oneEach(app.CAT.items[g])
            .filter(okE)
            .map(e => [g, e])
        )
        .slice(0, 300); /* a search looks in every type */
      grid.replaceChildren(
        ...list.map(([g, e]) => {
          const a = e.custom && app.ASSETS.find(x => 'Custom_' + x.id === e.Id);
          const card = el(
            'button',
            {
              type: 'button',
              class: 'skin' + (chosen && chosen.e === e ? ' on' : ''),
              title: itemName(e),
              onclick: () => {
                cur_ = g;
                types();
                chosen = { f: g, e };
                const add = [...$('dlgbtns').children].find(b => b.value === 'yes');
                if (add) add.disabled = false;
                for (const c of grid.children) c.classList.toggle('on', c === card);
              },
              ondblclick: () => {
                const add = [...$('dlgbtns').children].find(b => b.value === 'yes');
                if (add && chosen) add.click();
              },
              onkeydown: ev => {
                if (ev.key === 'Enter' && chosen && chosen.e === e) {
                  ev.preventDefault();
                  const add = [...$('dlgbtns').children].find(b => b.value === 'yes');
                  if (add) add.click();
                }
              },
            },
            el('div', { class: 'pic' }, a ? assetThumb(a) : itemThumb(g, e, null, null, true)),
            el('b', { text: itemName(e) })
          );
          return card;
        })
      );
      if (!list.length) grid.append(el('p', { class: 'blank', text: 'No results' }));
      grid.scrollTop = 0;
    };
    const typeList = el('div', {
      class: 'combinetypes',
      onpointerleave: () => {
        clearTimeout(hov);
        fill(cur_);
      },
    });
    const types = () =>
      typeList.replaceChildren(
        ...slots.map(f =>
          el('button', {
            type: 'button',
            class: f === cur_ ? 'on' : '',
            text: LABEL[f],
            onpointerenter: () => {
              clearTimeout(hov);
              hov = setTimeout(() => fill(f), 60);
            },
            onclick: () => {
              clearTimeout(hov);
              cur_ = f;
              types();
              fill(f);
            },
          })
        )
      );
    find.oninput = () => fill(cur_, true);
    find.onkeydown = ev => {
      if (ev.key !== 'Enter') return;
      ev.preventDefault();
      ev.stopPropagation();
      const c = chosen ? null : grid.querySelector('.skin');
      if (c) c.click();
      else if (chosen) [...$('dlgbtns').children].find(b => b.value === 'yes')?.click();
    };
    /* Enter picks the first result, Enter again adds it */ types();
    fill(cur_);
    $('dlg').classList.add('wide');
    const asked = ask(
      'Add item',
      [find, el('div', { class: 'combinebody' }, typeList, grid)],
      [
        { label: 'Cancel', value: '' },
        { label: 'Add', value: 'yes', primary: true },
      ]
    );
    {
      const add = [...$('dlgbtns').children].find(b => b.value === 'yes');
      if (add) add.disabled = true;
    }
    setTimeout(() => typeList.querySelector('button.on')?.scrollIntoView({ block: 'nearest' }), 0); /* the remembered type is in view */
    const v = await asked.finally(() => $('dlg').classList.remove('wide'));
    if (v !== 'yes' || !chosen) return;
    combinePick.last = chosen.f;
    document.body.classList.add('busy');
    try {
      await combineWith(chosen.f, chosen.e);
    } finally {
      document.body.classList.remove('busy');
    }
  }
  function onCentre(n) {
    const m = app.st.findMesh(o => o.userData.nodeName === n.name);
    if (!m) return Math.abs((n.position?.x ?? 0) + (n.shape.offset?.x ?? 0)) < 0.25;
    m.geometry.computeBoundingBox();
    const bb = m.geometry.boundingBox,
      lo = bb.min.clone(),
      hi = bb.max.clone();
    m.localToWorld(lo);
    m.localToWorld(hi);
    let root = m;
    while (root.parent && root.parent.type !== 'Scene') root = root.parent;
    const r = m.position.clone();
    root.getWorldPosition(r);
    const cx = (lo.x + hi.x) / 2 - r.x;
    return Math.abs(cx) < 0.25;
  }
  function addBox(kind = 'dup', at = null) {
    say(''); // 'dup' a copy, 'mirror' a copy on the other side, 'add' a new 4-block box; each gets its own room on the texture
    const boxes = boxesOf(app.ED.model),
      b = boxes[app.ED.box || 0];
    if (!b) return;
    if (boxes.length >= assets.MAX_BOXES) return say(`Limit is ${assets.MAX_BOXES} parts`, true);
    const n = b.node,
      sh = n.shape;
    const into = kind === 'mirror' ? twinParentOf(b.parent) : null; // a box on the left arm gets its copy on the right arm
    if (kind === 'mirror' && twinOf(b)) return say('Already mirrored', true);
    if (kind === 'mirror' && !into && onCentre(n))
      /* the copy would overlap the original (measured on the body, not in the part's own frame) */ return say(
        'Part is on the centre line',
        true
      );
    let paint = null,
      full = false;
    shapeEdit(() => {
      const label = kind === 'add' ? nextBoxName() : copyLabel(boxLabel(n), kind === 'mirror'),
        copy = structuredClone({ ...n, children: [] }),
        cs = copy.shape;
      copy.name = 'Box_' + Math.random().toString(36).slice(2, 7);
      cs.offset = { x: 0, y: 0, z: 0, ...cs.offset };
      if (kind === 'mirror') mirrorNode(n, copy);
      else if (kind === 'add' && at) {
        cs.type = 'box';
        cs.settings = { ...cs.settings, normal: undefined, size: { x: 4, y: 4, z: 4 } }; // always a solid box, even when started from a flat part
        cs.stretch = { x: 1, y: 1, z: 1 };
        const r = v => Math.round(v * 2) / 2;
        const o = { x: at.point.x + at.normal.x * 2, y: at.point.y + at.normal.y * 2, z: at.point.z + at.normal.z * 2 },
          q = n.orientation || { x: 0, y: 0, z: 0, w: 1 },
          p = n.position || { x: 0, y: 0, z: 0 };
        const ix = q.w * o.x + q.y * o.z - q.z * o.y,
          iy = q.w * o.y + q.z * o.x - q.x * o.z,
          iz = q.w * o.z + q.x * o.y - q.y * o.x,
          iw = -q.x * o.x - q.y * o.y - q.z * o.z;
        copy.position = {
          x: r(p.x + ix * q.w - iw * q.x - iy * q.z + iz * q.y),
          y: r(p.y + iy * q.w - iw * q.y - iz * q.x + ix * q.z),
          z: r(p.z + iz * q.w - iw * q.z - ix * q.y + iy * q.x),
        };
        cs.offset = { x: 0, y: 0, z: 0 };
      } else if (kind === 'add') {
        const front = (sh.offset?.z ?? 0) + (Math.abs(sh.settings?.size?.z ?? 0) / 2) * (n.shape?.stretch?.z || 1);
        cs.type = 'box';
        cs.settings = { ...cs.settings, normal: undefined, size: { x: 4, y: 4, z: 4 } };
        cs.stretch = { x: 1, y: 1, z: 1 };
        cs.offset.z = front + 2;
      } else cs.offset.x += 2;
      if (!(kind === 'add' && at)) {
        const o = cs.offset,
          q = copy.orientation || { x: 0, y: 0, z: 0, w: 1 },
          p = copy.position || { x: 0, y: 0, z: 0 },
          r = v => Math.round(v * 100) / 100; // the copy turns about its own middle, not the part it came from
        const ix = q.w * o.x + q.y * o.z - q.z * o.y,
          iy = q.w * o.y + q.z * o.x - q.x * o.z,
          iz = q.w * o.z + q.x * o.y - q.y * o.x,
          iw = -q.x * o.x - q.y * o.y - q.z * o.z;
        copy.position = {
          x: r(p.x + ix * q.w - iw * q.x - iy * q.z + iz * q.y),
          y: r(p.y + iy * q.w - iw * q.y - iz * q.x + ix * q.z),
          z: r(p.z + iz * q.w - iw * q.z - ix * q.y + iy * q.x),
        };
        cs.offset = { x: 0, y: 0, z: 0 };
      }
      if (copy.position)
        for (const a of ['x', 'y', 'z'])
          copy.position[a] = Math.max(-64, Math.min(64, copy.position[a] ?? 0)); /* copies never wander past the Place limits */
      const lay = allocLayout(cs) || (growAny() ? allocLayout(cs) : null) || (growAny() ? allocLayout(cs) : null);
      if (lay) {
        cs.textureLayout = lay;
        paint = paintFaces(cs, lay, sh.textureLayout, kind === 'mirror', kind === 'add' ? hexRgb(standOut(app.ED.painter.color)) : null);
      } else {
        full = true;
        return;
      } /* no room: no part is added */
      if (into) (into.children ||= []).push(copy);
      else (b.parent ? b.parent.children : app.ED.model.nodes).push(copy);
      app.ED.box = boxesOf(app.ED.model).findIndex(x => x.node === copy);
      app.ED.asset = { ...app.ED.asset, labels: { ...(app.ED.asset.labels || {}), [copy.name]: label } };
    });
    if (full) {
      const e = app.ED.hist.pop();
      if (e && e.k === 's') app.ED.model = JSON.parse(e.other);
      shapeChanged();
      return say('Texture full', true);
    }
    if (paint) {
      app.ED.painter.write(paint);
      app.ED.hist.push({ k: 'g', parts: app.ED.hist.splice(-2) });
      render();
    }
  }
  // parts painted from one shared spot each get their own spot (paint copied, so nothing looks different): the texture then matches the parts list
  function splitShared() {
    if (app.ED.splitDone || app.ED.asset.split) return;
    app.ED.splitDone = true;
    app.ED.asset = { ...app.ED.asset, split: true };
    const keep = app.ED.box || 0,
      seen = new Set();
    let n = 0;
    boxesOf(app.ED.model).forEach((b, k) => {
      const cells = rs =>
          rs.flatMap(r => {
            const o = [];
            for (let y = Math.floor(r.y); y < Math.ceil(r.y + r.h); y++)
              for (let x = Math.floor(r.x); x < Math.ceil(r.x + r.w); x++) o.push(x + ',' + y);
            return o;
          }),
        keys = cells(fig.usedRects({ nodes: [{ ...b.node, children: [] }] }));
      if (!keys.length) return; /* any texel another part already uses */ /* any face on a spot another part already uses */
      if (keys.some(q => seen.has(q))) {
        app.ED.box = k;
        if (ownArea(true)) {
          n++;
          cells(fig.usedRects({ nodes: [{ ...boxesOf(app.ED.model)[k].node, children: [] }] })).forEach(q => seen.add(q));
          return;
        }
      }
      keys.forEach(q => seen.add(q));
    });
    app.ED.box = keep;
    if (n) render();
  }
  function ownArea(quiet) {
    // move the selected box's paint to free room of its own, so it no longer shares texels with other boxes
    const b = curBox();
    if (!b) return false;
    const sh = b.node.shape,
      old = structuredClone(sh.textureLayout || {}),
      lay = allocLayout(sh) || (growAny() ? allocLayout(sh) : null) || (growAny() ? allocLayout(sh) : null);
    if (!lay) {
      if (!quiet) say('Texture full', true);
      return false;
    }
    {
      const fs = Object.keys(old),
        same = (p, q) =>
          p &&
          q &&
          (p.offset?.x ?? 0) === (q.offset?.x ?? 0) &&
          (p.offset?.y ?? 0) === (q.offset?.y ?? 0) &&
          (p.angle | 0) % 360 ===
            (q.angle | 0) % 360; /* faces that shared one area in the game's layout share one area again (both gloves end up alike) */
      for (let i = 0; i < fs.length; i++)
        for (let j = 0; j < i; j++) {
          const A = old[fs[j]],
            B = old[fs[i]],
            An = lay[fs[j]],
            pair = { front: 'back', back: 'front', left: 'right', right: 'left', top: 'bottom', bottom: 'top' };
          if (pair[fs[i]] !== fs[j] || !An || !lay[fs[i]] || !same(A, B)) continue; /* only opposite faces, which are the same size */
          lay[fs[i]] = {
            ...An,
            offset: { ...An.offset },
            mirror: { x: !!An.mirror?.x !== (!!A.mirror?.x !== !!B.mirror?.x), y: !!An.mirror?.y !== (!!A.mirror?.y !== !!B.mirror?.y) },
          };
          break;
        }
    }
    shapeEdit(() => {
      sh.textureLayout = lay;
    });
    app.ED.painter.write(paintFaces(sh, lay, old, false, null));
    app.ED.hist.push({ k: 'g', parts: app.ED.hist.splice(-2) });
    render();
    return true;
  }
  // ---- a move playing while you work (paused while a gizmo is out, so the handles stay on the box)
  function wsAnim() {
    if (!app.ED || !app.st) return;
    const want = app.ED.mode === 'shape' && ['move', 'resize', 'rotate'].includes(app.ED.stool) ? null : app.ED.anim || null;
    if (want === app.ED.animOn) return;
    app.ED.animOn = want;
    if (!want) {
      clearTimeout(app.onceT);
      app.st.anim.set(null);
      app.st.anim.setMove(null);
    } else {
      const [g, n] = want.split('/');
      playAnim(g, n, 1);
    }
  }
  const PAIDTIP = () => (app.ACCOUNT ? 'Your Hytale account does not own this item' : 'Connect Hytale account to verify ownership');
  function panelCreator() {
    if (!app.ED) {
      const worn = game.FIELDS.filter(f => app.cur.skin[f] && app.R.find(f, app.cur.skin[f])); /* a haircut under a hood still counts */
      const paidIn = f => {
        const it = app.R.find(f, app.cur.skin[f]),
          b = it && it.custom ? app.CAT.items[f].find(e => e.Id === it.baseId) : it;
        return b && editLocked(b);
      };
      const tile = f => {
        const it = app.R.find(f, app.cur.skin[f]),
          p = parse(app.cur.skin[f]),
          paid = paidIn(f);
        return el(
          'div',
          { class: 'skin starttile' + (paid ? ' paid' : ''), title: paid ? PAIDTIP() : null },
          el('div', { class: 'pic' }, itemThumb(f, it, p.color, p.variant)),
          el('b', { text: itemName(it) }),
          el('small', { text: LABEL[f] }),
          paid
            ? el('small', { class: 'dim', text: 'Paid' })
            : it.custom
              ? el(
                  'div',
                  { class: 'acts' },
                  el('button', {
                    class: 'mini',
                    text: 'Edit',
                    onclick: guard(() => {
                      const a = app.ASSETS.find(x => 'Custom_' + x.id === it.Id);
                      if (!a) throw new Error('That custom item is gone.');
                      return openAsset(a);
                    }),
                  }),
                  el('button', { class: 'mini', text: 'Copy', onclick: () => newAsset(f) })
                )
              : el('button', { class: 'mini', text: 'Edit a copy', onclick: () => newAsset(f) })
        );
      };
      return [
        head('Create'),
        el(
          'div',
          { class: 'pbody' },
          el('h3', { text: 'Your outfit' }),
          el('div', { class: 'cards' }, worn.map(tile)),
          anyItem(),
          el('h3', { text: `My items ${app.ASSETS.length}/${assets.MAX}` }),
          app.ASSETS.length ? el('div', { class: 'cards' }, app.ASSETS.map(assetCard)) : el('p', { class: 'blank', text: 'No items' })
        ),
      ];
    }
    return [];
  }

  return {
    boxesOf,
    editModel,
    outlineBox,
    capHist,
    recordPaint,
    setMode,
    curBox,
    placeGizmo,
    tintAll,
    boxLabel,
    fitTexture,
    tour,
    sizeOf,
    renderWorkspace,
    brushSize,
    drawOvl,
    bindSelect,
    placeFloat,
    hexRgb,
    twinOf,
    dragBox,
    combineWith,
    combinePick,
    addBox,
    splitShared,
    ownArea,
    panelCreator,
  };
}
