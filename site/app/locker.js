// The Locker tab (data-tab "wardrobe"): saved skins, the game slots, the folder, publishing and saving.
import * as db from './db.js';
import * as store from './store.js';
import * as auth from './auth.js';
import { pickList } from './picklist.js';
import { cleanName, clip, parse, nice, LABEL, GROUPS } from './skin.js';

export function createLocker(app) {
  const {
    modLink,
    $,
    el,
    say,
    guard,
    ask,
    confirmBox,
    setDirty,
    setWard,
    setFolder,
    setAccount,
    open,
    pushWearing,
    autosave,
    flush,
    GONE,
    keepDraft,
    plate,
    portrait,
    setTab,
    render,
    head,
  } = app;
  // ---- publishing: skins made of game items can be shared under the player's name (needs Sign in with Hytale)
  let PUB = { on: false, signedIn: false },
    PUBMAP = {}; // PUBMAP: local skin id -> published id
  const api = async (path, method = 'GET', data) => {
    const r = await fetch('/api' + path, {
      method,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: data ? { 'Content-Type': 'application/json' } : {},
      body: data ? JSON.stringify(data) : undefined,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'The skin server did not answer. Try again.');
    return j;
  };
  async function loadPub() {
    PUBMAP = (await db.get('meta', 'published').catch(() => null)) || {};
    try {
      PUB = await api('/me');
    } catch {
      PUB = { on: false, signedIn: false };
    }
    if (PUB.signedIn) {
      const live = new Set(PUB.skins.map(s => s.id));
      for (const k of Object.keys(PUBMAP)) if (!live.has(PUBMAP[k])) delete PUBMAP[k];
      await savePubMap();
    }
  }
  const savePubMap = () => db.put('meta', 'published', PUBMAP).catch(() => {});
  const canPublish = () => auth.enabled && PUB.on && PUB.signedIn;
  const publish = guard(async (rec, quiet) => {
    if (app.hasCustom(rec.skin))
      throw new Error('Skins with custom assets can only be shared as files. Custom assets stay on your computer.');
    const r = await api('/skins', 'POST', { id: PUBMAP[rec.id] || null, name: rec.name, skin: rec.skin });
    PUBMAP[rec.id] = r.id;
    await savePubMap();
    if (!quiet) {
      say(`Published "${rec.name}"`);
      render();
    }
  });
  const unpublish = guard(async (rec, quiet) => {
    const id = PUBMAP[rec.id];
    if (!id) return;
    await api('/skins/' + id, 'DELETE').catch(e => {
      if (!/Unknown skin/.test(e.message)) throw e;
    });
    delete PUBMAP[rec.id];
    await savePubMap();
    if (!quiet) {
      say(`Unpublished "${rec.name}"`);
      render();
    }
  });
  // two records trade places (a slot and a skin, or two slots): their published copies trade with them
  const swapPub = async (a, b) => {
    const x = PUBMAP[a],
      y = PUBMAP[b];
    if (!x && !y) return;
    if (y) PUBMAP[a] = y;
    else delete PUBMAP[a];
    if (x) PUBMAP[b] = x;
    else delete PUBMAP[b];
    await savePubMap();
  };
  const movePub = async (from, to) => {
    if (PUBMAP[from] && to) {
      PUBMAP[to] = PUBMAP[from];
      delete PUBMAP[from];
      await savePubMap();
    }
  };
  const pubButton = rec =>
    !canPublish()
      ? locked('Publish', 'publishing', 'mini')
      : el('button', {
          class: 'mini' + (PUBMAP[rec.id] ? ' on' : ''),
          text: PUBMAP[rec.id] ? 'Unpublish' : 'Publish',
          title: PUBMAP[rec.id]
            ? 'Published: anyone who looks you up sees it. Saving updates it.'
            : 'Let anyone who looks you up see this skin',
          onclick: e => {
            e.stopPropagation();
            (PUBMAP[rec.id] ? unpublish : publish)(rec);
          },
        });
  const forgetMe = guard(async () => {
    if (
      !(await confirmBox(
        'Delete my published data',
        'Remove every skin you published and your profile from this site’s server? Skins on your computer stay.',
        'Delete',
        true
      ))
    )
      return;
    await api('/me', 'DELETE');
    PUBMAP = {};
    await savePubMap();
    await auth.signOut();
    setAccount(null);
    PUB = { on: PUB.on, signedIn: false };
    say('Your published data was deleted');
    render();
  });

  // ---- drag and drop between the in-game slots and My skins
  let DRAG = null; // { kind: 'game' | 'custom', rec }
  const dropOk = (kind, i) => !!DRAG && kind === 'game' && !(DRAG.kind === 'game' && DRAG.rec.slot === i);
  const dragFrom = (rec, kind) =>
    (kind === 'game' || (kind === 'custom' && !app.hasCustom(rec.skin))) && {
      draggable: true,
      title: kind === 'game' ? 'Drag to My skins or another slot' : 'Drag onto an in-game slot',
      ondragstart: e => {
        DRAG = { kind, rec };
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', rec.name);
        e.currentTarget.classList.add('dragging');
        document.querySelector('.shelf.custom')?.classList.toggle('dropzone', kind === 'game');
      },
      ondragend: e => {
        DRAG = null;
        e.currentTarget.classList.remove('dragging');
        document.querySelectorAll('.drop, .dropzone').forEach(x => x.classList.remove('drop', 'dropzone'));
      },
    };
  // a slot takes a skin dropped on it: one from My skins swaps in, another slot's trades places
  const dropOn = (kind, i) =>
    kind === 'game' && {
      ondragover: e => {
        if (!dropOk(kind, i)) return;
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('drop');
      },
      ondragleave: e => e.currentTarget.classList.remove('drop'),
      ondrop: e => {
        e.currentTarget.classList.remove('drop');
        if (!dropOk(kind, i)) return;
        e.preventDefault();
        e.stopPropagation();
        const d = DRAG;
        DRAG = null;
        if (d.kind === 'custom') sendToSlot(d.rec, i);
        else moveSlot(d.rec.slot, i);
      },
    };
  // My skins takes an in-game skin dropped anywhere on it
  const shelfDrop = {
    ondragover: e => {
      if (DRAG?.kind !== 'game') return;
      e.preventDefault();
      e.currentTarget.classList.add('drop');
    },
    ondragleave: e => {
      if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.classList.remove('drop');
    },
    ondrop: e => {
      e.currentTarget.classList.remove('drop');
      if (DRAG?.kind !== 'game') return;
      e.preventDefault();
      const d = DRAG;
      DRAG = null;
      moveOut(d.rec);
    },
  };

  function card(rec, kind, i) {
    if (!rec)
      return el(
        'div',
        {
          ...dropOn(kind, i),
          class: 'skin empty ' + kind,
          role: 'button',
          tabIndex: 0,
          'aria-label': `Save to slot ${i + 1}`,
          onclick: () => saveAs(i),
          onkeydown: e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              saveAs(i);
            }
          },
        },
        el('div', { class: 'pic' }, el('span', { text: '+' })),
        el('b', { text: 'Slot ' + (i + 1) }),
        el('small', { text: 'Empty' })
      ); // the + saves the look you have on into this slot
    const act = (label, fn, cls) =>
      el('button', {
        class: 'mini ' + (cls || ''),
        text: label,
        onclick: e => {
          e.stopPropagation();
          fn();
        },
      });
    const acts =
      kind === 'game'
        ? [
            act('Set in game', () => checklist(rec)),
            act('Rename', () => renameSkin(rec)),
            act('Move out', () => moveOut(rec)),
            pubButton(rec),
          ]
        : kind === 'custom'
          ? [
              app.hasCustom(rec.skin) ? null : act('Send to game', () => toGame(rec)),
              act('Rename', () => renameSkin(rec)),
              act('Copy', () => duplicate(rec)),
              pubButton(rec),
              act(
                'Export',
                guard(() => app.exportSkin(rec))
              ),
              act('Delete', () => removeSkin(rec), 'danger'),
            ]
          : [
              act('Save', () => {
                open(rec, true);
                saveAs();
              }),
            ];
    const menu =
      acts.filter(Boolean).length > 1 ? app.cardMenu(acts.filter(Boolean)) : null; /* card actions live in a ⋯ menu, as in file browsers */
    return el(
      'div',
      {
        ...dragFrom(rec, kind),
        ...dropOn(kind, kind === 'game' ? rec.slot : null),
        class: 'skin ' + kind + (app.cur.id && app.cur.id === rec.id ? ' on' : ''),
        tabIndex: 0,
        data: { rid: String(rec.id) },
        onclick: () => {
          if (kind === 'pub') {
            open(rec, true, true);
            return render();
          }
          open(rec, kind === 'found');
          setTab('editor');
        },
        onkeydown: e => {
          if (e.key === 'Enter' && e.target === e.currentTarget) e.currentTarget.click();
        },
      },
      el('div', { class: 'pic' }, portrait(rec.skin)),
      el('b', { text: rec.name }),
      kind === 'game' ? el('small', { text: 'Slot ' + (rec.slot + 1) }) : null,
      menu || el('div', { class: 'acts' }, acts)
    );
  }
  // Features that need a Hytale account. Sign in with Hytale is not available to this site yet, so they are shown greyed out.
  const NEED = f =>
    app.ACCOUNT
      ? `Hytale does not offer ${f} to other apps yet`
      : !auth.enabled
        ? "Coming soon: waiting on Hytale's 3rd party site approval"
        : `Connect your Hytale account to enable ${f}`;
  // while Sign in with Hytale waits on Hytale's approval these are shown darkened, and read WIP under the pointer
  const wip = (label, cls, onclick) =>
    el(
      'button',
      { class: cls + ' locked wip', 'aria-disabled': 'true', 'aria-label': label + ' (WIP)', onclick },
      el('span', { class: 'lbl', text: label })
    );
  const locked = (label, feature, cls = 'btn ghost') =>
    !auth.enabled
      ? wip(label, cls, e => {
          e.stopPropagation();
          say(NEED(feature));
        })
      : el('button', {
          class: cls + ' locked',
          'aria-disabled': 'true',
          title: NEED(feature),
          text: label,
          onclick: e => {
            e.stopPropagation();
            say(NEED(feature));
          },
        }); // not disabled: a click says why it can't be used yet
  // the connect button lives in the top bar; once signed in the Locker shows who and has sign out
  function accountRow() {
    if (!auth.enabled || !app.ACCOUNT) return null;
    return el(
      'div',
      { class: 'folder account on' },
      el('div', {}, el('b', { text: 'Signed in as ' + app.ACCOUNT.username })),
      el('button', {
        class: 'btn ghost',
        text: 'Show my skin',
        onclick: () => {
          setTab('lookup');
          app.lookup(app.ACCOUNT.username);
        },
      }),
      el('button', {
        class: 'btn ghost',
        text: 'Sign out',
        onclick: guard(async () => {
          await auth.signOut();
          setAccount(null);
          PUB = { on: PUB.on, signedIn: false };
          render();
        }),
      }),
      PUB.signedIn ? el('button', { class: 'btn ghost danger', text: 'Delete my published data', onclick: forgetMe }) : null
    );
  }
  function folderRow() {
    if (app.FOLDER.state === 'none') return null; // the numbered steps above cover choosing one
    const after = async r => {
      setFolder(await store.folderState());
      await app.reloadAssets();
      await refreshWard();
      pushWearing();
      if (r) say(r.imported ? `Folder connected, ${r.imported} skin${r.imported > 1 ? 's' : ''} brought in` : 'Folder connected');
    };
    const btn = (t, fn, c = 'ghost') => el('button', { class: 'btn ' + c, text: t, onclick: guard(fn) });
    if (app.FOLDER.via === 'mod')
      return el(
        'div',
        { class: 'folder ' + (app.FOLDER.state === 'on' ? 'on' : 'ask') },
        el(
          'div',
          {},
          el('b', {
            text:
              app.FOLDER.state === 'on'
                ? 'Saving through the mod to Documents\\Hytale Skins'
                : 'Waiting for Hytale: saves go across when the game runs',
          })
        ),
        store.folderSupported ? btn('Use a folder instead', async () => after(await store.chooseFolder())) : null,
        btn('Stop', async () => {
          await store.forgetFolder();
          await after();
        })
      );
    const title =
      app.FOLDER.state === 'on'
        ? 'Saving to folder: ' + app.FOLDER.name
        : app.FOLDER.state === 'ask'
          ? 'Folder paused: ' + app.FOLDER.name
          : 'Save skins to a folder';
    return el(
      'div',
      { class: 'folder ' + app.FOLDER.state },
      el('div', {}, el('b', { text: title })),
      app.FOLDER.state === 'none'
        ? btn('Choose folder', async () => after(await store.chooseFolder()), 'primary')
        : [
            app.FOLDER.state === 'ask'
              ? btn('Reconnect', async () => after(await store.resumeFolder(true)), 'primary')
              : btn('Change', async () => after(await store.chooseFolder())),
            btn('Stop', async () => {
              await store.forgetFolder();
              await after();
            }),
          ]
    );
  }
  function gameSteps() {
    // the path to wearing your skins in Hytale, in order
    const linked = app.FOLDER.state === 'on' || app.FOLDER.state === 'wait',
      all = app.FOLDER.state === 'on' && app.SHOWGAME && !!app.FOLDER.mod;
    const row = (n, done, title, text, action) =>
      el(
        'li',
        { class: done ? 'done' : '' },
        el('span', { class: 'num', text: done ? '✓' : n }),
        el('b', { text: title }),
        done ? null : action
      );
    return el(
      'details',
      { class: 'gamesteps', open: !all },
      el('summary', { text: all ? 'In game: ready' : 'Play in Hytale' }),
      el(
        'ol',
        {},
        row(1, !!app.FOLDER.mod, 'Hytale Designer Sync mod', '', modLink('ghost')),
        row(
          2,
          linked,
          'Skins folder',
          '',
          linked
            ? null
            : el(
                'span',
                { class: 'row' },
                el('button', {
                  class: 'btn primary',
                  text: 'Connect to the mod',
                  title: 'Needs Hytale open',
                  onclick: guard(async () => {
                    const r = await store.connectMod();
                    setFolder(await store.folderState());
                    await app.reloadAssets();
                    await refreshWard();
                    pushWearing();
                    say(
                      r && r.imported
                        ? 'Connected, ' + r.imported + ' skin' + (r.imported > 1 ? 's' : '') + ' brought in'
                        : 'Connected to the mod'
                    );
                  }),
                }),
                store.folderSupported
                  ? el('button', {
                      class: app.FOLDER.state === 'ask' ? 'btn ghost' : 'linkbtn',
                      text: app.FOLDER.state === 'ask' ? 'Reconnect folder' : 'or pick a folder',
                      title: 'Works with the game closed',
                      onclick: guard(async () => {
                        app.FOLDER.state === 'ask' ? await store.resumeFolder(true) : await store.chooseFolder();
                        setFolder(await store.folderState());
                        await app.reloadAssets();
                        await refreshWard();
                        pushWearing();
                      }),
                    })
                  : null
              )
        ),
        row(
          3,
          linked && app.SHOWGAME,
          'In game',
          '',
          el('button', {
            class: 'btn ghost',
            text: 'Turn on',
            disabled: !linked,
            onclick: () => {
              if (!app.SHOWGAME) $('ingame').onclick();
            },
          })
        )
      )
    );
  }
  function panelWardrobe() {
    return [
      head('Locker'),
      el(
        'div',
        { class: 'pbody' },
        gameSteps(),
        folderRow(),
        accountRow(),
        el(
          'div',
          { class: 'shelf game' },
          el(
            'h3',
            {},
            el('span', { text: 'In-game slots' }),
            el('em', { text: `${app.WARD.game.filter(Boolean).length} / ${store.GAME_SLOTS}` })
          ),
          // once connected these 5 slots are the account's in-game presets: they load on their own and every change is written back
          el('div', { class: 'row' }, locked('Game sync', 'syncing these slots with your in-game presets', 'chip')),
          el(
            'div',
            { class: 'cards' },
            app.WARD.game.map((r, i) => card(r, 'game', i))
          )
        ),
        el(
          'div',
          { class: 'shelf custom', ...shelfDrop },
          el('h3', {}, el('span', { text: 'My skins' }), el('em', { text: `${app.WARD.custom.length} / ${store.CUSTOM_MAX}` })),
          app.WARD.custom.length
            ? el(
                'div',
                { class: 'cards' },
                app.WARD.custom.map(r => card(r, 'custom'))
              )
            : el('p', { class: 'blank', text: 'No skins' })
        )
      ),
    ];
  }
  async function refreshWard() {
    setWard(await store.list());
    if (app.cur.id && ![...app.WARD.game, ...app.WARD.custom].some(r => r && r.id === app.cur.id)) {
      app.cur.id = null;
      app.cur.kind = null;
      app.cur.slot = null;
    }
    render();
  }
  const slotButtons = () => app.WARD.game.map((r, i) => ({ label: `Slot ${i + 1}${r ? ': ' + r.name : ' (empty)'}`, value: String(i) }));
  const toGame = guard(async rec => {
    rec = liveRec(rec);
    if (app.hasCustom(rec.skin)) throw new Error("Custom items can't go in game slots");
    const v = await ask('Send to game', app.WARD.game.some(Boolean) ? el('p', { text: 'The skin in that slot moves to My skins.' }) : [], [
      ...slotButtons(),
      { label: 'Cancel', value: '' },
    ]);
    if (v === '') return;
    await sendToSlot(rec, +v);
  });
  // a skin from My skins into a slot; what the slot held moves to My skins (under the sent skin's id)
  const sendToSlot = guard(async (rec, v) => {
    rec = liveRec(rec);
    if (app.hasCustom(rec.skin)) throw new Error("Custom items can't go in game slots");
    await store.swap(rec.id, v);
    await swapPub(rec.id, 'game-' + v);
    if (app.cur.id === rec.id) {
      app.cur.id = 'game-' + v;
      app.cur.kind = 'game';
      app.cur.slot = +v;
      app.cur.random = false;
      keepDraft();
    } else if (app.cur.id === 'game-' + v) {
      const mv = (await store.list()).custom.find(r => r.id === rec.id);
      Object.assign(app.cur, { id: rec.id, kind: 'custom', slot: null, name: mv ? mv.name : app.cur.name, random: false });
      keepDraft();
    }
    /* the skin that was in the slot moved to My skins under the sent skin's id: the open look follows it */ await refreshWard();
    say('Moved to in-game slot ' + (+v + 1));
  });
  const moveOut = guard(async rec => {
    rec = liveRec(rec);
    const used = new Set(app.WARD.custom.map(r => r.name));
    let nm = rec.name,
      k = 2;
    while (used.has(nm)) nm = cleanName(clip(rec.name, 37) + ' ' + k++);
    const n = await store.saveCustom(nm, rec.skin);
    await movePub(rec.id, n && n.id);
    await store.remove(rec.id);
    if (n && app.cur.id === rec.id) {
      Object.assign(app.cur, { id: n.id, kind: 'custom', slot: null, name: n.name });
      keepDraft();
    }
    await refreshWard();
    plate();
    say('Moved to My skins');
  }); /* the open skin follows its record */
  // one in-game slot onto another: they trade skins
  const moveSlot = guard(async (from, to) => {
    if (from === to) return;
    await store.swapSlots(from, to);
    await swapPub('game-' + from, 'game-' + to);
    if (app.cur.id === 'game-' + from || app.cur.id === 'game-' + to) {
      const now = app.cur.id === 'game-' + from ? to : from;
      Object.assign(app.cur, { id: 'game-' + now, kind: 'game', slot: now });
      keepDraft();
    }
    await refreshWard();
    say(`Swapped slots ${from + 1} and ${to + 1}`);
  });
  const liveRec = rec => {
    const w = [...app.WARD.game, ...app.WARD.custom].find(r => r && r.id === rec.id) || rec;
    return app.cur && app.cur.id === rec.id ? { ...w, skin: app.cur.skin } : w;
  }; // the skin as it is now, not as the card was drawn
  const renameSkin = guard(async rec => {
    rec = liveRec(rec);
    const name = el('input', { type: 'text', value: rec.name || '', maxLength: 120, placeholder: 'Skin name', autofocus: true });
    const asked = ask(
      'Rename skin',
      [el('label', { text: 'Name' }), name],
      [
        { label: 'Cancel', value: '' },
        { label: 'Rename', value: 'yes', primary: true },
      ]
    );
    requestAnimationFrame(() => {
      name.focus();
      name.select();
    });
    if ((await asked) !== 'yes') return;
    const n = cleanName(name.value);
    if (!n || n === rec.name) return;
    const fresh = rec.kind === 'game' ? (await store.list()).game[rec.slot] : null,
      r =
        rec.kind === 'game'
          ? fresh
            ? await store.saveGame(rec.slot, n, fresh.skin)
            : rec
          : await store.saveCustom(
              await store.uniqueName(n, rec.id),
              rec.skin,
              rec.id
            ); /* a game slot is renamed with what it holds now; a taken name gets a number */
    if (app.cur.id === rec.id) {
      app.cur.name = r.name;
      app.cur.auto = false;
      app.cur.random = false;
      keepDraft();
    } /* a renamed skin is kept: Randomize starts a new one */
    await refreshWard();
    if (PUBMAP[r.id] && canPublish() && !app.hasCustom(r.skin)) publish(r, true);
  });
  const duplicate = guard(async rec => {
    rec = liveRec(rec);
    const used = new Set(app.WARD.custom.map(r => r.name)),
      stem = String(rec.name).replace(/ copy( \d+)?$/, '');
    let n = '';
    for (let k = 1; k < 1000; k++) {
      const suf = ' copy' + (k > 1 ? ' ' + k : '');
      n = cleanName(clip(stem, 40 - suf.length) + suf);
      /* never cuts an emoji, even multi-part ones */ if (!used.has(n)) break;
    }
    await store.saveCustom(n, rec.skin);
    await refreshWard();
  }); /* the number always fits in 40 characters */
  const removeSkin = guard(async rec => {
    if (PUBMAP[rec.id] && canPublish()) await unpublish(rec, true);
    const wasOpen = app.cur.id === rec.id;
    GONE.add(rec.id);
    if (flush.stuck && !wasOpen) {
      flush.stuck = false;
      setTimeout(() => {
        if (app.dirty) autosave();
      }, 0);
    }
    /* a freed place lets a stuck look save */ if (wasOpen) {
      clearTimeout(autosave.t);
      setDirty(false);
    }
    await store.remove(rec.id);
    /* a pending autosave can't bring it back */ await refreshWard();
    if (wasOpen) {
      Object.assign(app.cur, { id: null, kind: null, slot: null, name: '', auto: false });
      keepDraft();
      plate();
    } /* the look on screen is no longer that skin */ /* deleted at once, with Undo, instead of asking first */
    sayUndo(
      `Deleted "${rec.name}"`,
      guard(async () => {
        if (rec.kind !== 'game' && app.WARD.custom.length >= store.CUSTOM_MAX) throw new Error(`My skins is full (${store.CUSTOM_MAX})`);
        GONE.delete(rec.id);
        const back = await store.saveCustom(await store.uniqueName(rec.name, rec.id), rec.skin, rec.id);
        await refreshWard();
        if (!app.cur.id && JSON.stringify(app.cur.skin) === JSON.stringify(app.R.fit(rec.skin))) {
          Object.assign(app.cur, { id: rec.id, kind: 'custom', slot: null, name: back.name });
          keepDraft();
          plate();
        }
      })
    ); /* with the name it came back under */
  }); /* the look on screen is that skin again */
  function sayUndo(text, undo) {
    const s = $('status');
    say(text);
    s.append(
      ' ',
      el('button', {
        class: 'linkbtn',
        text: 'Undo',
        onclick: () => {
          say('');
          undo();
        },
      })
    );
    clearTimeout(say.t);
    say.t = setTimeout(() => (s.textContent = ''), 8000);
  }
  function checklist(rec) {
    rec = liveRec(rec);
    const rows = GROUPS.flatMap(([g, fs]) =>
      fs
        .filter(f => rec.skin[f])
        .map(f => {
          const p = parse(rec.skin[f]),
            item = app.R.find(f, rec.skin[f]);
          return el(
            'tr',
            {},
            el('td', { text: g + ' ▸ ' + LABEL[f] }),
            el('td', { text: item ? app.itemName(item) : nice(p.id) }),
            el('td', { text: [p.color && nice(p.color), p.variant && nice(p.variant)].filter(Boolean).join(', ') })
          );
        })
    );
    ask(
      `Set "${rec.name}" in game`,
      [
        el('p', { text: `In Hytale, open My Avatar, choose preset ${rec.slot + 1} and pick these parts:` }),
        el('table', { class: 'parts' }, el('tbody', {}, rows)),
      ],
      [{ label: 'Done', value: '', primary: true }]
    );
  }
  async function save() {
    app.cur.random = false;
    if (!app.cur.id) return saveAs();
    await guard(async () => {
      const r =
        app.cur.kind === 'game'
          ? await store.saveGame(app.cur.slot, app.cur.name, app.cur.skin)
          : await store.saveCustom(app.cur.name, app.cur.skin, app.cur.id);
      setDirty(false);
      const moved = r.kind !== app.cur.kind;
      if (moved) {
        Object.assign(app.cur, { id: r.id, kind: r.kind, slot: null, name: r.name, auto: false });
        keepDraft();
      }
      await refreshWard();
      plate();
      say(moved ? "Custom items can't go in game slots: saved to My skins" : `Saved "${r.name}"`);
      if (PUBMAP[r.id] && canPublish() && !app.hasCustom(r.skin)) publish(r, true);
    })();
  }
  async function saveAs(slot) {
    app.cur.random = false;
    if (typeof slot !== 'number') slot = null;
    const name = el('input', { type: 'text', value: app.cur.name || '', maxLength: 120, placeholder: 'Skin name', autofocus: true });
    const where = pickList(el, {
      label: 'Save to',
      value: slot === null ? 'custom' : String(slot),
      items: [
        { value: 'custom', text: `My skins (${app.WARD.custom.length} / ${store.CUSTOM_MAX})`, icon: () => portrait(app.cur.skin) },
        ...app.WARD.game.map((r, i) => ({
          value: String(i),
          text: `In-game slot ${i + 1}${r ? ', replaces "' + r.name + '"' : ' (empty)'}`,
          icon: r ? () => portrait(r.skin) : null,
        })),
      ],
    }); /* each slot shows the skin in it now */
    const v = await ask(
      'Save skin',
      [el('label', { text: 'Name' }), name, el('label', { text: 'Save to' }), where],
      [
        { label: 'Cancel', value: '' },
        { label: 'Save', value: 'yes', primary: true },
      ]
    );
    if (v !== 'yes') return;
    let n = cleanName(name.value) || app.cur.name || 'My skin'; /* a blank name keeps the current one */
    if (where.value === 'custom') {
      const autoId = app.cur.auto && app.cur.kind === 'custom' ? app.cur.id : null,
        used = new Set(app.WARD.custom.filter(r => r.id !== autoId).map(r => r.name));
      if (used.has(n)) {
        const stem = n;
        let k = 2;
        while (used.has(cleanName(clip(stem, 37) + ' ' + k))) k++;
        n = cleanName(clip(stem, 37) + ' ' + k);
      }
    } /* Save as never makes two skins with one name */
    if (where.value !== 'custom' && app.hasCustom(app.cur.skin)) return say("Custom items can't go in game slots", true);
    await guard(async () => {
      const auto = app.cur.auto && app.cur.kind === 'custom' && app.cur.id,
        r =
          where.value === 'custom'
            ? await store.saveCustom(n, app.cur.skin, auto || undefined)
            : await store.saveGame(+where.value, n, app.cur.skin);
      if (auto && where.value !== 'custom') await store.remove(auto);
      app.cur.auto = false;
      app.cur.id = r.id;
      app.cur.kind = r.kind;
      app.cur.slot = r.slot ?? null;
      app.cur.name = r.name;
      setDirty(false);
      keepDraft();
      await refreshWard();
      say(`Saved "${r.name}"`);
    })();
  }

  return { loadPub, canPublish, card, locked, panelWardrobe, refreshWard, liveRec, sayUndo, save, saveAs };
}
