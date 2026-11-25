// The buttons on the stage: background, picture, clean view, and the pinned emotes.
import * as game from './game.js';
import * as db from './db.js';
import { toolIcon } from './toolicons.js';
import { cleanName } from './skin.js';
import * as prefs from './prefs.js';

export function createStage(app) {
  const { $, el, say, animThumb, viewInset } = app;
  const BACKDROPS = [
    ['dark', 'Studio'],
    ...Object.entries(game.SCENES)
      .filter(([, b]) => !b.swim)
      .map(([k, b]) => [k, b.name]),
  ]; /* the open sea is not in the list: the swim moves bring it */
  // a place's chip: its noon sky over its ground (Studio keeps the plain dark one)
  const chip = k => {
    const c = el('span', { class: 'bdchip' }),
      s = game.SCENES[k]?.chip;
    if (s) c.style.background = `linear-gradient(${s[0]} 50%, ${s[1]} 50%)`;
    return c;
  };
  const hexIn = v => {
    const m = /#([0-9a-f]{6})/i.exec(String(v || ''));
    return m ? '#' + m[1].toLowerCase() : null;
  };
  function atNoon(keys) {
    // a weather's colour keys [{Hour, Color}] at 12:00, blended between the keys either side (round midnight if need be)
    const ks = (Array.isArray(keys) ? keys : [])
      .map(k => ({ h: +k.Hour, c: hexIn(k.Color) }))
      .filter(k => k.c && Number.isFinite(k.h))
      .sort((x, y) => x.h - y.h);
    if (!ks.length) return null;
    const lo = ks.filter(k => k.h <= 12).pop() || { ...ks[ks.length - 1], h: ks[ks.length - 1].h - 24 },
      hi = ks.find(k => k.h >= 12) || { ...ks[0], h: ks[0].h + 24 };
    if (hi.h === lo.h) return lo.c;
    const t = (12 - lo.h) / (hi.h - lo.h),
      A = app.hexRgb(lo.c),
      B = app.hexRgb(hi.c);
    return (
      '#' +
      A.map((v, i) =>
        Math.round(v + (B[i] - v) * t)
          .toString(16)
          .padStart(2, '0')
      ).join('')
    );
  }
  const BD_MADE = new Map();
  async function backdropSpec(key) {
    // the sky and fog colours of the zone's weather at noon, and the biome colour its grass takes
    if (BD_MADE.has(key)) return BD_MADE.get(key);
    const sc = game.SCENES[key],
      w = await game.json(sc.weather);
    const top = atNoon(w.SkyTopColors),
      fog = atNoon(w.FogColors) || top;
    if (!top) throw new Error('no sky colours in ' + sc.weather);
    const tint = sc.tint
      ? hexIn(sc.tint)
      : sc.tintFrom
        ? hexIn((/"Color"\s*:\s*"(#[0-9a-fA-F]{6})"/.exec(JSON.stringify(await game.json(sc.tintFrom))) || [])[1])
        : null;
    const spec = { sky: { top, fog }, sc, tint };
    BD_MADE.set(key, spec);
    return spec;
  }
  let bdShown = null;
  const setBdShown = v => (bdShown = v);
  async function showBackdrop(key) {
    if (!app.st || key === bdShown) return;
    const wave = bdShown != null; /* a change while the stage is up spreads out from the character; the first one just appears */
    bdShown = key;
    if (key === 'dark') return app.st.setBackdrop(null, null, null, wave);
    const stg = $('view').parentElement,
      slow = setTimeout(() => stg.classList.add('loading'), 250); // a place that takes a moment to build says so
    try {
      const spec = await backdropSpec(key);
      if (bdShown === key) await app.st.setBackdrop(spec.sky, spec.sc, spec.tint, wave);
    } catch (e) {
      console.warn('backdrop', e);
      bdShown = 'dark';
      app.st.setBackdrop(null);
      prefs.set('se_backdrop', 'dark');
      drawStageBtns();
      say('Missing game files for this background', true);
    } finally {
      clearTimeout(slow);
      stg.classList.remove('loading');
    }
  }
  async function savePicture(transparent) {
    // a PNG of the stage: the scene as shown, or the character on transparency
    const shot = app.st.capture(transparent);
    let url = shot.url;
    if (!transparent && !shot.sky) {
      const img = new Image();
      img.src = url;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const x = c.getContext('2d');
      const g = x.createRadialGradient(c.width * 0.5, c.height * 0.4, 0, c.width * 0.5, c.height * 0.4, Math.max(c.width, c.height) * 0.75);
      g.addColorStop(0, '#1d3a3a');
      g.addColorStop(1, '#0a1220');
      x.fillStyle = g;
      x.fillRect(0, 0, c.width, c.height);
      x.drawImage(img, 0, 0);
      url = c.toDataURL('image/png');
    } /* Studio is drawn by the page behind the stage: put it in the picture */
    const a = el('a', {
      href: url,
      download: `${cleanName(app.cur.name || 'skin').replace(/[\/:*?"<>|]/g, '') || 'skin'}${transparent ? ' (transparent)' : ''}.png`,
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  // a background a move brings with it (the sea for swimming), shown without changing the saved choice; null goes back to that
  let tempBd = null;
  function tempBackdrop(k) {
    if (tempBd === (k || null)) return;
    tempBd = k || null;
    drawStageBtns();
  }
  function drawStageBtns() {
    const box = $('stagebtns'),
      stg = $('view').parentElement;
    if (!box) return;
    if (!box._menu) {
      box._menu = true;
      addEventListener(
        'pointerdown',
        e => {
          if ((box._open || box._shot) && !box.contains(e.target)) {
            box._open = false;
            box._shot = false;
            drawStageBtns();
          }
        },
        true
      );
      addEventListener('keydown', e => {
        if (e.key === 'Escape' && box._open) {
          box._open = false;
          box._focus = 'btn';
          drawStageBtns();
        }
      });
    }
    if (!box._ro) {
      box._ro = new ResizeObserver(() => {
        const vb = $('viewbtns');
        if (vb) vb.style.paddingLeft = box.offsetWidth ? box.offsetWidth + 10 + 'px' : '';
      });
      box._ro.observe(box);
    } // the Creator's view buttons keep clear of the background button
    let bd = tempBd || prefs.get('se_backdrop');
    bd = game.SCENE_ALIASES[bd] || bd;
    if (!(bd === tempBd && game.SCENES[bd]) && !BACKDROPS.some(b => b[0] === bd)) bd = 'dark';
    showBackdrop(bd);
    const name = game.SCENES[bd]?.name || 'Studio',
      clean = stg.classList.contains('clean');
    box.replaceChildren(
      ...[
        el(
          'button',
          {
            class: 'stbtn',
            title: null,
            'aria-label': 'Background: ' + name,
            'aria-haspopup': 'listbox',
            'aria-expanded': String(!!box._open),
            onclick: e => {
              e.stopPropagation();
              box._open = !box._open;
              box._zone = null;
              box._focus = box._open ? 'menu' : 'btn';
              drawStageBtns();
            },
          },
          chip(bd),
          el('b', { text: name }),
          el('span', { class: 'caret', text: '▾' })
        ),
        box._open
          ? el(
              'div',
              {
                class: 'bdmenu',
                role: 'listbox',
                'aria-label': 'Backgrounds',
                onkeydown: e => {
                  if (e.key === 'Tab') {
                    box._open = false;
                    drawStageBtns();
                    return;
                  }
                  if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
                  e.preventDefault();
                  const os = [...e.currentTarget.querySelectorAll('.bdopt, .bdzhead')],
                    i = os.indexOf(document.activeElement),
                    n = os.length;
                  os[
                    e.key === 'Home'
                      ? 0
                      : e.key === 'End'
                        ? n - 1
                        : (i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + n) % n
                  ]?.focus();
                },
              },
              /* arrows move through the backgrounds; the places are grouped by the game's zones (one open at a time) and their tiers */ (() => {
                const opt = (k, n) =>
                  el(
                    'button',
                    {
                      class: 'bdopt' + (k === bd ? ' on' : ''),
                      role: 'option',
                      'aria-selected': String(k === bd),
                      onclick: e => {
                        e.stopPropagation();
                        box._open = false;
                        box._focus = 'btn';
                        tempBd = null;
                        prefs.set('se_backdrop', k);
                        drawStageBtns();
                      },
                    },
                    chip(k),
                    el('b', { text: n })
                  );
                if (box._zone == null) box._zone = String(game.SCENES[bd]?.zone || 1);
                const zone = (z, zn) => {
                  const all = Object.entries(game.SCENES).filter(([, s]) => String(s.zone) === z && !s.swim);
                  const open = box._zone === z,
                    tiers = [...new Set(all.map(([, s]) => s.tier))].sort((a, b) => a - b);
                  return el(
                    'div',
                    { class: 'bdzone', role: 'group', 'aria-label': zn },
                    el(
                      'button',
                      {
                        class: 'bdzhead' + (all.some(([k]) => k === bd) ? ' has' : ''),
                        'aria-expanded': String(open),
                        'data-zone': z,
                        onclick: e => {
                          e.stopPropagation();
                          box._zone = open ? '' : z;
                          box._focus = 'zone:' + z;
                          drawStageBtns();
                        },
                      },
                      el('span', { class: 'caret', text: open ? '▾' : '▸' }),
                      el('span', { text: zn }),
                      el('span', { class: 'bdcount', text: String(all.length) })
                    ),
                    open
                      ? tiers.map(t =>
                          el(
                            'div',
                            { class: 'bdtier', role: 'group', 'aria-label': 'Tier ' + t },
                            el('div', { class: 'bdthead', text: 'Tier ' + t }),
                            el(
                              'div',
                              { class: 'bdgrid' },
                              all.filter(([, s]) => s.tier === t).map(([k, s]) => opt(k, s.name))
                            )
                          )
                        )
                      : null
                  );
                };
                return [opt('dark', 'Studio'), ...Object.entries(game.ZONES).map(([z, zn]) => zone(z, zn))];
              })()
            )
          : null,
        app.ED
          ? null
          : el(
              'div',
              { class: 'shotwrap' },
              el(
                'button',
                {
                  class: 'stbtn',
                  'aria-label': 'Save picture',
                  title: 'Save picture',
                  'aria-haspopup': 'menu',
                  'aria-expanded': String(!!box._shot),
                  onclick: e => {
                    e.stopPropagation();
                    box._shot = !box._shot;
                    box._open = false;
                    drawStageBtns();
                  },
                },
                toolIcon('camera')
              ),
              box._shot
                ? el(
                    'div',
                    { class: 'bdmenu shotmenu', role: 'menu' },
                    [
                      ['scene', 'With background'],
                      ['clear', 'Transparent'],
                    ].map(([k, n]) =>
                      el('button', {
                        class: 'bdopt',
                        role: 'menuitem',
                        text: n,
                        onclick: e => {
                          e.stopPropagation();
                          box._shot = false;
                          drawStageBtns();
                          savePicture(k === 'clear');
                        },
                      })
                    )
                  )
                : null
            ),
        app.ED
          ? null
          : el(
              'button',
              {
                class: 'stbtn',
                title: clean ? 'Show buttons (Esc)' : 'Clean view',
                'aria-label': clean ? 'Show buttons' : 'Clean view',
                onclick: () => {
                  stg.classList.toggle('clean');
                  drawStageBtns();
                  viewInset();
                },
              },
              el('span', { text: clean ? '\u25c9' : '\u25ce' }),
              el('b', { text: clean ? 'Show buttons' : 'Clean view' })
            ),
      ].filter(Boolean)
    );
    {
      const m = box.querySelector('.bdmenu:not(.shotmenu)');
      if (m) m.style.maxHeight = Math.max(160, stg.getBoundingClientRect().bottom - m.getBoundingClientRect().top - 12) + 'px';
    } /* the list scrolls inside the stage rather than running off its bottom */
    if (box._focus) {
      const f = box._focus;
      box._focus = null;
      (f.startsWith('zone:')
        ? box.querySelector(`.bdzhead[data-zone="${f.slice(5)}"]`)
        : f === 'menu'
          ? box.querySelector('.bdopt.on') || box.querySelector('.bdopt')
          : box.querySelector('.stbtn')
      )?.focus();
    } // keyboard focus follows the menu
  }
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !app.ED) {
      const stg = $('view')?.parentElement;
      if (stg?.classList.contains('clean')) {
        stg.classList.remove('clean');
        drawStageBtns();
        viewInset();
      }
    }
  });
  // six favourite moves under the character, one click to play
  let EMOTES = null;
  const EMOTE_DEFAULT = ['Wave', 'Clap', 'Dance_Boogie', 'Shrug', 'Salute_Chest', 'Laugh_Strong'];
  async function loadEmotes() {
    const m = await db.get('meta', 'emotes').catch(() => null),
      have = new Set(app.CAT.anims.Emote || []);
    EMOTES = (Array.isArray(m) ? m : EMOTE_DEFAULT.map(n => 'Emote/' + n))
      .filter(k => {
        const [g, n] = k.split('/');
        return (app.CAT.anims[g] || []).includes(n);
      })
      .slice(0, 6);
    if (!EMOTES.length) EMOTES = [...have].slice(0, 6).map(n => 'Emote/' + n);
  }
  function toggleEmote(g, n) {
    const k = g + '/' + n,
      i = EMOTES.indexOf(k);
    if (i >= 0) EMOTES.splice(i, 1);
    else {
      EMOTES.push(k);
      if (EMOTES.length > 6) EMOTES.shift();
    }
    db.put('meta', 'emotes', EMOTES).catch(() => {});
    drawEmotes();
  }
  function drawEmotes() {
    const box = $('emotes');
    if (!box || !EMOTES) return;
    box.hidden = !!app.ED || app.tab === 'animate'; /* the Animate tab owns the figure's moves */
    box.replaceChildren(
      ...EMOTES.map(k => {
        const [g, n] = k.split('/');
        return el(
          'button',
          {
            class: 'emote' + (app.st.anim.anim && app.playing.group === g && app.playing.name === n ? ' on' : ''),
            title: app.animLabel(g, n),
            'aria-pressed': String(!!(app.st.anim.anim && app.playing.group === g && app.playing.name === n)),
            onclick: () => (app.playing.group === g && app.playing.name === n ? app.playAnim('Default', 'Idle', 0.5) : app.playAnim(g, n)),
          },
          animThumb(g, n)
        );
      })
    );
  } // plays on a loop until clicked again

  return {
    BD_MADE,
    setBdShown,
    drawStageBtns,
    tempBackdrop,
    get EMOTES() {
      return EMOTES;
    },
    loadEmotes,
    toggleEmote,
    drawEmotes,
  };
}
