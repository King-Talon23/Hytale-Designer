// The Help tab.
import * as game from './game.js';
import * as db from './db.js';
import * as fig from './figure.js';
import * as store from './store.js';
import { MOD_URL } from './config.js';

export function createHelp(app) {
  const {
    modLink,
    el,
    say,
    guard,
    confirmBox,
    download,
    readJsonFile,
    showConnect,
    reconnect,
    setR,
    pics,
    head,
    LOCK,
    saveLock,
    refreshWard,
  } = app;
  function panelHelp() {
    const sec = (t, ...ps) => [
      el('h3', { text: t }),
      ...ps.filter(p => p !== '').map(p => (typeof p === 'string' ? el('p', { text: p }) : p)),
    ];
    const backupFile = el('input', {
      type: 'file',
      accept: '.json,application/json',
      hidden: true,
      onchange: guard(async e => {
        const f = e.target.files[0];
        e.target.value = '';
        if (!f) return;
        const data = await readJsonFile(f, 400_000_000),
          r = await store.importAll(data);
        {
          let more = 0;
          if (Array.isArray(data.favourites))
            for (const k of data.favourites.slice(0, 2000))
              if (typeof k === 'string' && k.length <= 200 && !LOCK.favs.has(k)) {
                LOCK.favs.add(k);
                more++;
              }
          if (more) saveLock(); /* favourites and pinned animations come back too */
          if (Array.isArray(data.emotes) && app.EMOTES) {
            for (const k of data.emotes.slice(0, 6)) {
              if (app.EMOTES.length >= 6) break;
              const [g, n] = typeof k === 'string' ? k.split('/') : [];
              if (g && n && (app.CAT.anims[g] || []).includes(n) && !app.EMOTES.includes(k)) {
                app.EMOTES.push(k);
                more++;
              }
            }
            db.put('meta', 'emotes', app.EMOTES).catch(() => {});
          } /* only real animations, only into free places: the player's own pins stay */
          if (Array.isArray(data.animations)) {
            const have = new Set(
              (await db.keys('meta')).filter(k => String(k).startsWith('anim:'))
            ); /* animations: new ones added, ones already here left alone */
            const used = new Set((await Promise.all([...have].map(k => db.get('meta', k)))).map(x => String(x?.name || '').toLowerCase()));
            for (const x of data.animations.slice(0, 500)) {
              try {
                if (
                  !x ||
                  typeof x.id !== 'string' ||
                  !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x.id) ||
                  have.has('anim:' + x.id) ||
                  !x.a ||
                  typeof x.a.nodeAnimations !== 'object' ||
                  !x.a.nodeAnimations
                )
                  continue;
                const base = app.ANIMATE.cleanName(x.name) || 'My animation';
                let nm = base,
                  k = 2;
                while (used.has(nm.toLowerCase())) nm = `${base.slice(0, 56)} ${k++}`;
                used.add(nm.toLowerCase());
                await db.put('meta', 'anim:' + x.id, {
                  id: x.id,
                  name: nm,
                  a: app.ANIMATE.cleanImport(x.a),
                  updated: Number.isFinite(x.updated) ? x.updated : Date.now(),
                });
                have.add('anim:' + x.id);
                r.anims = (r.anims || 0) + 1;
              } catch {
                /* a broken one is skipped */
              }
            }
            await app.ANIMATE.reload();
            store.syncFolder().catch(() => {});
          } /* the Animate library shows them at once */
          r.extras = more;
        }
        await app.reloadAssets();
        await refreshWard();
        if (!r.added && !r.items && !r.skipped && !r.itemsSkipped && !r.extras && !r.anims)
          return say('Everything in that backup is already here');
        if (!r.added && !r.items && r.anims) return say(`Restored ${r.anims} animation${r.anims === 1 ? '' : 's'}`);
        say(
          `Restored ${r.added} skin${r.added === 1 ? '' : 's'}` +
            (r.items ? `, ${r.items} item${r.items === 1 ? '' : 's'}` : '') +
            (r.skipped || r.itemsSkipped ? `; ${r.skipped + r.itemsSkipped} skipped (full)` : ''),
          !!(r.skipped || r.itemsSkipped)
        );
      }),
    });
    return [
      head('Help'),
      el(
        'div',
        { class: 'pbody prose' },

        sec(
          'Game files',
          app.META ? `${app.META.name} · ${app.META.files} files · ${new Date(app.META.at).toLocaleDateString()}` : 'Not connected yet.',
          el(
            'div',
            { class: 'row' },
            el('button', { class: 'btn ghost', text: 'Connect again', onclick: reconnect }),
            el('button', {
              class: 'btn danger',
              text: 'Forget game files',
              onclick: guard(async () => {
                if (
                  !(await confirmBox(
                    'Forget game files',
                    'Removes the copy of your game files from this browser. Your saved skins stay.',
                    'Forget',
                    true
                  ))
                )
                  return;
                await game.forget();
                setR(null);
                pics.clear();
                fig.clearCache();
                showConnect();
              }),
            })
          )
        ),
        sec(
          'Used the old address?',
          'Skins and items you made on hytale-skin-editor.com are still saved in this browser under that address.',
          el('div', { class: 'row' }, el('a', { class: 'btn ghost', href: 'https://hytale-skin-editor.com/move', text: 'Bring them over' }))
        ),
        MOD_URL ? sec('Hytale Designer Sync', '', el('div', { class: 'row' }, modLink('primary'))) : null,
        sec(
          'Backup',
          '',
          el(
            'div',
            { class: 'row' },
            el('button', {
              class: 'btn ghost',
              text: 'Download backup',
              onclick: guard(async () =>
                download('hytale-designer-backup.json', {
                  ...(await store.exportAll()),
                  favourites: [...LOCK.favs],
                  emotes: app.EMOTES || undefined,
                  animations: await Promise.all(
                    (await db.keys('meta')).filter(k => String(k).startsWith('anim:')).map(k => db.get('meta', k))
                  ),
                })
              ),
            }),
            el(
              'label',
              {
                class: 'btn ghost',
                tabIndex: 0,
                role: 'button',
                onkeydown: e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.querySelector('input')?.click();
                  }
                },
              },
              'Restore backup',
              backupFile
            )
          )
        )
      ),
    ];
  }

  return { panelHelp };
}
