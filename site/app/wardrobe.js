// The Wardrobe tab (data-tab "editor"): every slot at a glance, and a picker per slot.
import * as game from './game.js';
import * as db from './db.js';
import { pickList } from './picklist.js';
import { parse, nice, LABEL, GROUPS, NO_NONE } from './skin.js';

export function createWardrobe(app) {
  const { el, say, guard, setSlot, open, setSkin, peek, setScrolledAt, hover, itemThumb, portrait, render, head } = app;
  // ---------------------------------------------------------------- the locker: every slot at a glance, and a picker per slot
  const HEX = /^#[0-9a-fA-F]{3,8}$/;
  let filter = '';
  // our own small symbols for the category rail (drawn here, not taken from the game)
  const ICON = {
    Head: 'M6 3h12v13H6zM9 8v3h2V8zM13 8v3h2V8zM9 17h6v4H9z',
    Body: 'M9 2h6v6H9zM7 9h10v8H7zM3 9h3v8H3zM18 9h3v8h-3zM8 18h3v4H8zM13 18h3v4h-3z',
    Torso: 'M8 3l4 2 4-2 5 3-2 4-2-1v12H7V9l-2 1-2-4z',
    Legs: 'M6 3h12l1 18h-5l-2-11-2 11H5z',
    Capes: 'M8 3h8l4 18-4-2-4 2-4-2-4 2z',
  };
  const SLOT_ICON = {
    haircut: 'M5 13V8l2-4 3 2 2-3 2 3 3-2 2 4v5h-3V9H8v4z',
    eyebrows: 'M3 11l7-3 1 2-7 3zM21 11l-7-3-1 2 7 3z',
    eyes: 'M3 8h8v8H3zM13 8h8v8h-8zM6 11v3h3v-3zM15 11v3h3v-3z',
    facialHair: 'M5 5h3v6h8V5h3v10l-4 5H9l-4-5z',
    headAccessory: 'M7 6h10v8h5v3H2v-3h5z',
    faceAccessory: 'M2 9h9v6H2zM13 9h9v6h-9zM4 11v2h5v-2zM15 11v2h5v-2z',
    earAccessory: 'M11 2h2v5h-2zM7 13a5 5 0 1 0 10 0a5 5 0 1 0-10 0zM10 13a2 2 0 1 1 4 0a2 2 0 1 1-4 0z',
    bodyCharacteristic: ICON.Body,
    face: 'M5 4h14v16H5zM8 9v3h2V9zM14 9v3h2V9zM9 15v2h6v-2z',
    mouth: 'M3 9h18v3l-3 5H6l-3-5zM6 12v1h12v-1z',
    ears: 'M8 20V9l10-6-3 9v8z',
    skinFeature: 'M5 6h3v3H5zM14 4h3v3h-3zM10 11h3v3h-3zM17 12h3v3h-3zM5 15h3v3H5zM13 18h3v3h-3z',
    underwear: 'M4 6h16v6l-6 6h-4l-6-6z',
    undertop: ICON.Torso,
    overtop: 'M8 3l4 3 4-3 5 3-2 4-2-1v12h-4V8l-1 1-1-1v13H7V9l-2 1-2-4z',
    gloves: 'M7 21v-8L5 9l2-1 2 3V4h2v6h1V3h2v7h1V5h2v9l-2 7z',
    pants: ICON.Legs,
    overpants: 'M9 3h7v10l4 4v4H9z',
    shoes: 'M6 4h7v9l7 3v5H6z',
    cape: ICON.Capes,
  };
  function icon(d) {
    const NS = 'http://www.w3.org/2000/svg',
      s = document.createElementNS(NS, 'svg'),
      p = document.createElementNS(NS, 'path');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    p.setAttribute('d', d);
    p.setAttribute('fill-rule', 'evenodd');
    s.append(p);
    return s;
  }
  const TIERS = ['Standard', 'Base', 'Supporter', 'Cursebreaker', 'Event'];
  function tierOf(e) {
    // from how the game unlocks the item (its entitlements), standing in for rarity
    if (!e || e.custom) return 0;
    const t = Array.isArray(e.Entitlements) ? e.Entitlements : [];
    if (!t.length) return 0;
    if (t.some(x => !String(x).startsWith('game.'))) return 4;
    if (t.includes('game.base')) return 1;
    if (t.includes('game.deluxe')) return 2;
    return 3;
  }
  const tierClass = e => (e && e.custom ? 'mine' : 't' + tierOf(e));
  let LOCK = { favs: new Set(), seen: null, recent: {} },
    picking = false,
    slotScroll = 0,
    seenSlot = null,
    lockFilter = 'all',
    lockSort = 'up';
  const favKey = (f, e) => f + '|' + e.Id,
    isNew = (f, e) => !e.custom && LOCK.seen && !LOCK.seen.has(favKey(f, e));
  const saveLock = () => db.put('meta', 'locker', { favs: [...LOCK.favs], seen: [...LOCK.seen], recent: LOCK.recent }).catch(() => {});
  // the last items worn in each slot, newest first, for the picker's Recent filter
  const noteWorn = (f, e) => {
    if (!e) return;
    const l = (LOCK.recent[f] || []).filter(id => id !== e.Id);
    l.unshift(e.Id);
    LOCK.recent[f] = l.slice(0, 12);
    saveLock();
  };
  async function loadLock() {
    const m = await db.get('meta', 'locker').catch(() => null),
      all = game.FIELDS.flatMap(f => app.R.ITEMS[f].filter(e => !e.custom).map(e => favKey(f, e)));
    LOCK.favs = new Set(m?.favs || []);
    LOCK.recent = m && m.recent && typeof m.recent === 'object' ? m.recent : {};
    LOCK.seen = m ? new Set(m.seen || []) : new Set(all);
    if (!m) saveLock(); // on a first visit nothing counts as new
  }
  function leavePicker() {
    if (peek.part !== undefined) peek();
    /* a hover preview never outlives the picker (leaving by keyboard sends no pointerleave) */ if (seenSlot) {
      for (const e of app.R.ITEMS[seenSlot]) if (!e.custom) LOCK.seen.add(favKey(seenSlot, e));
      saveLock();
      seenSlot = null;
    }
    picking = false;
  }
  function variantName(it, v) {
    const nk = it?.Variants?.[v]?.NameKey;
    return (nk && app.CAT.names[nk]) || nice(v);
  }
  function lookCard(r, kind) {
    return el(
      'button',
      { class: 'look ' + kind + (app.cur.id === r.id ? ' on' : ''), title: r.name, onclick: () => open(r) },
      portrait(r.skin)
    );
  }
  function panelEditor() {
    return picking ? panelPicker() : panelLocker();
  }
  function panelLocker() {
    const tile = f => {
      const it = app.R.find(f, app.cur.skin[f]),
        { color, variant } = parse(app.cur.skin[f]);
      return el(
        'button',
        {
          class: 'slot ' + (it ? tierClass(it) : 'none'),
          title: LABEL[f],
          onclick: () => {
            setScrolledAt(performance.now());
            slotScroll = document.querySelector('.panel .pbody')?.scrollTop || 0;
            setSlot(f);
            picking = true;
            seenSlot = f;
            filter = '';
            lockFilter = 'all';
            render();
            for (const p of document.querySelectorAll('.pbody')) p.scrollTop = 0;
          },
        },
        it ? itemThumb(f, it, color, variant) : el('span', { class: 'nothing', text: '—' }),
        el('i', {}, icon(SLOT_ICON[f]), el('span', { text: LABEL[f] })),
        el('b', { text: it ? app.itemName(it) : 'None' })
      );
    };
    const looks = [...app.WARD.game.filter(Boolean).map(r => lookCard(r, 'game')), ...app.WARD.custom.map(r => lookCard(r, 'custom'))];
    return [
      head('Wardrobe'),
      el(
        'div',
        { class: 'pbody locker' },
        GROUPS.map(([g, fs]) => {
          const fields = fs.filter(f => app.R.ITEMS[f].length);
          return fields.length ? [el('h3', { text: g }), el('div', { class: 'slots' }, fields.map(tile))] : null;
        }),
        el('h3', { text: 'Saved looks' }),
        el('div', { class: 'looks' }, looks, el('button', { class: 'look add', title: 'Save look', text: '+', onclick: app.saveAs }))
      ),
    ];
  }
  function panelPicker() {
    const f = app.slot,
      it = app.R.find(f, app.cur.skin[f]),
      { color, variant } = parse(app.cur.skin[f]);
    const change = (item, c, v) => {
      if (item !== it) noteWorn(f, it);
      noteWorn(f, item);
      setSkin({ ...app.cur.skin, [f]: app.R.partStr(item, c, v) });
    };
    const all = app
        .oneEach(app.R.ITEMS[f].filter(e => e === it || !app.isTmp(e)))
        .concat(it && !it.custom && !app.oneEach(app.R.ITEMS[f]).includes(it) ? [it] : []),
      tiersHere = [...new Set(all.filter(e => !e.custom).map(tierOf))].sort();
    const recentIds = (LOCK.recent[f] || []).filter(id => all.some(e => e.Id === id));
    const counts = {
      recent: recentIds.length,
      fav: all.filter(e => LOCK.favs.has(favKey(f, e))).length,
      new: all.filter(e => isNew(f, e)).length,
      mine: all.filter(e => e.custom).length,
    };
    if ((lockFilter === 'mine' && !counts.mine) || (lockFilter === 'new' && !counts.new))
      lockFilter = 'all'; /* a filter that emptied goes back to All */
    const chip = (id, label) =>
      el('button', {
        class: 'chip' + (lockFilter === id ? ' on' : ''),
        text: label,
        onclick: () => {
          lockFilter = id;
          sortBox.hidden = id !== 'all';
          drawCards();
          for (const c of bar.querySelectorAll('.chip[data-f]')) c.classList.toggle('on', c.dataset.f === id);
        },
        data: { f: id },
      });
    let sortKeep = lockSort;
    const sortBox = pickList(el, {
      label: 'Order',
      value: lockSort,
      items: [
        { value: 'up', text: 'Standard first' },
        { value: 'down', text: 'Rarest first' },
      ] /* the cards re-sort under the pointer */,
      onPreview: v => {
        lockSort = v === null ? sortKeep : v;
        drawCards();
      },
      onChoose: v => {
        lockSort = sortKeep = v;
        drawCards();
      },
    });
    sortBox.classList.add('sort');
    sortBox.hidden = lockFilter !== 'all';
    const bar = el(
      'div',
      { class: 'options lockbar' },
      chip('all', 'All'),
      chip('fav', counts.fav ? `★ Favourites ${counts.fav}` : '☆ Favourites'),
      counts.recent > 1 ? chip('recent', 'Recent') : null,
      counts.new ? chip('new', `New ${counts.new}`) : null,
      tiersHere.length > 1 ? tiersHere.map(t => chip('t' + t, TIERS[t])) : null,
      counts.mine ? chip('mine', 'Custom') : null,
      sortBox
    );
    const detail = el('div', { class: 'detail' }),
      showDetail = (e, trying) => {
        const t = e ? (e.custom ? 'Site only' : TIERS[tierOf(e)]) : '';
        detail.classList.toggle('trying', !!trying);
        detail.replaceChildren(
          el('span', { class: 'dim', text: trying ? 'Trying on: ' : 'Wearing: ' }),
          el('b', { text: e ? app.itemName(e) : 'None' }),
          el('span', { text: ' · ' + LABEL[f] }),
          el('em', { class: e ? tierClass(e) : '', text: t })
        );
      };
    const cardsBox = el('div', { class: 'cards lcards' });
    function drawCards() {
      const q = filter.toLowerCase();
      let items = all.filter(e => app.itemName(e).toLowerCase().includes(q));
      if (lockFilter === 'fav') items = items.filter(e => LOCK.favs.has(favKey(f, e)));
      else if (lockFilter === 'recent') items = recentIds.map(id => items.find(e => e.Id === id)).filter(Boolean);
      else if (lockFilter === 'new') items = items.filter(e => isNew(f, e));
      else if (lockFilter === 'mine') items = items.filter(e => e.custom);
      else if (/^t\d$/.test(lockFilter)) items = items.filter(e => !e.custom && 't' + tierOf(e) === lockFilter);
      const dir = lockFilter === 'all' && lockSort === 'down' ? -1 : 1,
        rank = e => (e.custom ? 5 : tierOf(e)); // the game's order inside each tier; custom assets last
      const pin = e => (lockFilter === 'all' && LOCK.favs.has(favKey(f, e)) ? 0 : 1); // starred items sit at the top of All
      if (lockFilter !== 'recent')
        items = items
          .map((e, i) => [e, i])
          .sort((a, b) => pin(a[0]) - pin(b[0]) || (rank(a[0]) - rank(b[0])) * dir || a[1] - b[1])
          .map(x => x[0]);
      const card = e => {
        const part = e ? app.R.partStr(e, color, variant) : null,
          hv = hover(part),
          k = e && favKey(f, e),
          fav = e && LOCK.favs.has(k);
        const star = e
          ? el('span', {
              class: 'star' + (fav ? ' on' : ''),
              role: 'button',
              title: fav ? 'Remove from favourites' : 'Add to favourites',
              text: fav ? '★' : '☆',
              onclick: ev => {
                ev.stopPropagation();
                LOCK.favs.has(k) ? LOCK.favs.delete(k) : LOCK.favs.add(k);
                saveLock();
                render();
              },
            })
          : null;
        const a = e?.custom && app.ASSETS.find(x => 'Custom_' + x.id === e.Id);
        const bin = a
          ? el('span', {
              class: 'bin' + (fav ? ' off' : ''),
              role: 'button',
              title: fav ? 'Unstar to delete' : 'Delete',
              text: '🗑',
              onclick: ev => {
                ev.stopPropagation();
                if (fav) {
                  say('Unstar to delete', true);
                  return;
                }
                guard(() => app.deleteAsset(a))();
              },
            })
          : null; /* deletes at once; the status bar offers Undo */
        return el(
          'button',
          {
            class: 'lcard ' + (e ? tierClass(e) : 'none') + ((e?.Id ?? null) === (it?.Id ?? null) ? ' on' : ''),
            'aria-label': e ? app.itemName(e) + (fav ? ', favourite' : '') : 'None',
            'aria-keyshortcuts': star ? 'F' + (bin ? ' Delete' : '') : null,
            onclick: () => change(e, color, variant),
            onkeydown: ev => {
              if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
              if (star && (ev.key === 'f' || ev.key === 'F')) {
                ev.preventDefault();
                const nm = app.itemName(e);
                star.click();
                setTimeout(
                  () =>
                    [...document.querySelectorAll('button.lcard')]
                      .find(b => (b.getAttribute('aria-label') || '').replace(/, favourite$/, '') === nm)
                      ?.focus(),
                  80
                );
              } else if (bin && ev.key === 'Delete') {
                ev.preventDefault();
                bin.click();
              }
            } /* keyboard: F stars, Delete deletes (the icons inside the card can't take focus) */,
            onpointerenter: ev => {
              hv.onpointerenter(ev);
              if (peek.part === part) showDetail(e, e !== it);
            },
            onpointermove: ev => {
              if (peek.part === part) return;
              hv.onpointermove(ev);
              if (peek.part === part) showDetail(e, e !== it);
            },
            onpointerleave: ev => {
              hv.onpointerleave(ev);
              showDetail(it);
            },
          },
          e ? itemThumb(f, e, color, variant) : el('span', { class: 'nothing', text: '✕' }),
          star,
          bin,
          e && isNew(f, e) ? el('span', { class: 'new', text: 'NEW' }) : null,
          el('b', { text: e ? app.itemName(e) : 'None' })
        );
      };
      cardsBox.replaceChildren(...(NO_NONE.has(f) || lockFilter !== 'all' ? [] : [card(null)]), ...items.map(card));
      if (!items.length)
        cardsBox.append(
          el('p', { class: 'blank', text: filter.trim() ? 'No results' : lockFilter === 'fav' ? 'No favourites' : 'Nothing here.' })
        );
    }
    drawCards();
    showDetail(it);
    const search = el('input', {
      type: 'search',
      placeholder: 'Search',
      value: filter,
      maxLength: 40,
      oninput: e => {
        filter = e.target.value;
        if (peek.part !== undefined) {
          peek();
          showDetail(it);
        }
        drawCards();
      },
    });
    const cols = it ? app.R.colorsOf(it, variant) : [],
      vs = it?.Variants ? Object.keys(it.Variants) : [];
    const swatches = el(
      'div',
      { class: 'swatches' },
      cols.map(([k, base]) => {
        const b = el('button', {
          title: nice(k),
          class: k === color ? 'on' : '',
          onclick: () => change(it, k, variant),
          ...hover(app.R.partStr(it, k, variant)),
        });
        const ok = (Array.isArray(base) ? base : [base]).filter(c => HEX.test(c));
        b.style.background = ok.length > 1 ? `linear-gradient(135deg, ${ok.join(',')})` : ok[0] || '#888';
        return b;
      })
    );
    const options = el(
      'div',
      { class: 'options' },
      vs.map(v =>
        el('button', {
          class: 'chip' + (v === (variant || vs[0]) ? ' on' : ''),
          text: variantName(it, v),
          onclick: () => change(it, color, v),
          ...hover(app.R.partStr(it, color, v)),
        })
      )
    );
    return [
      head('Wardrobe'),
      el(
        'div',
        { class: 'pbody' },
        el(
          'div',
          { class: 'pickhead' },
          el('button', {
            class: 'btn ghost',
            text: '‹ Wardrobe',
            onclick: () => {
              leavePicker();
              render();
              const pb = document.querySelector('.panel .pbody');
              if (pb) pb.scrollTop = slotScroll;
            },
          }),
          icon(SLOT_ICON[f]),
          el('b', { text: LABEL[f] })
        ),
        el('div', { class: 'row' }, search, app.locked('Owned only', 'the owned cosmetics filter', 'chip')),
        bar,
        cardsBox,
        el(
          'div',
          { class: 'pickfoot' },
          detail,
          it?.custom
            ? (() => {
                const a = app.ASSETS.find(x => 'Custom_' + x.id === it.Id);
                return a
                  ? [
                      el('h3', { text: 'Colour' }),
                      el('button', { class: 'btn ghost small', text: 'Edit in Create', onclick: guard(() => app.openAsset(a)) }),
                    ]
                  : null;
              })()
            : cols.length
              ? [el('h3', { text: 'Colour' }), swatches]
              : null,
          vs.length > 1 ? [el('h3', { text: 'Option' }), options] : null
        )
      ),
    ];
  }
  // top-left of the stage: the background behind the character, and a clean view with the controls hidden (for a good look or a screenshot).
  // Studio is the site's own; the others are built from the player's game files, so they look the way those places look in the game at noon.

  return {
    TIERS,
    tierOf,
    LOCK,
    get picking() {
      return picking;
    },
    saveLock,
    loadLock,
    leavePicker,
    panelEditor,
  };
}
