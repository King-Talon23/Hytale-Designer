// The Players tab (data-tab "lookup"): look players up, and skin files in and out.
import * as db from './db.js';
import * as store from './store.js';
import { sanitize, cleanName } from './skin.js';

export function createPlayers(app) {
  const { el, say, guard, download, readJsonFile, setTabValue, open, keepDraft, rebuild, setTab, render, head, card, liveRec } = app;
  let found = []; // skins brought in this session by a lookup or from files; not saved until the player saves them
  let lookupMsg = '',
    lookupQ = '',
    shown = null; // shown: the last player found, with the skins they published on this site
  const lookup = guard(async name => {
    name = name.trim();
    lookupQ = name;
    if (!/^[A-Za-z0-9_-]{2,36}$/.test(name)) {
      lookupMsg = 'Enter a username';
      return render();
    }
    lookupMsg = 'Looking…';
    render();
    try {
      const r = await fetch('https://playerdb.co/api/player/hytale/' + encodeURIComponent(name), {
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      const j = r.ok ? await r.json() : null,
        p = j?.data?.player,
        s = sanitize(p?.skin);
      if (!s) lookupMsg = r.status === 429 ? 'Too many lookups for now. Try again in a minute.' : 'No player found';
      else {
        const nm = cleanName(p.username) || name;
        found = [{ name: nm, skin: s }, ...found.filter(f => f.name !== nm)].slice(0, 60);
        lookupMsg = '';
        open(found[0], true, true);
        loadPublished(nm, p.id);
      }
    } catch {
      lookupMsg = 'The lookup service could not be reached.';
    }
    render();
  });
  async function loadPublished(name, id) {
    if (!/^[0-9a-f-]{32,36}$/i.test(id || '')) {
      shown = null;
      return;
    }
    const me = (shown = { name, uuid: id, skins: null });
    render();
    try {
      const r = await fetch('/api/players/' + encodeURIComponent(id) + '/skins', { credentials: 'omit', cache: 'no-store' }),
        j = r.ok ? await r.json() : null;
      if (!r.ok && r.status !== 404) me.failed = true;
      if (r.status === 404 && !j) me.failed = true; /* the skins service missing is not 'no skins' */
      fetch('/api/players/' + encodeURIComponent(id) + '/anims', { credentials: 'omit', cache: 'no-store' })
        .then(x => (x.ok ? x.json() : null))
        .then(k => {
          me.anims = (Array.isArray(k?.anims) ? k.anims : [])
            .filter(
              x =>
                x &&
                x.anim &&
                x.anim.nodeAnimations &&
                typeof x.anim.nodeAnimations === 'object' &&
                !Array.isArray(x.anim.nodeAnimations) &&
                Number.isFinite(+x.anim.duration) &&
                +x.anim.duration >= 1 &&
                +x.anim.duration <= 6000
            )
            .map(x => ({ name: cleanName(x.name) || 'Animation', anim: x.anim }))
            .slice(0, 45);
          if (shown === me) render();
        })
        .catch(() => {});
      me.skins = (Array.isArray(j?.skins) ? j.skins : [])
        .map(k => ({ id: 'pub_' + String(k.id).slice(0, 24), name: cleanName(k.name) || 'Skin', skin: sanitize(k.skin) }))
        .filter(k => k.skin)
        .slice(0, 45);
    } catch {
      me.skins = [];
      me.failed = true;
    }
    if (shown === me) render();
  }
  async function exportSkin(rec) {
    rec = liveRec(rec); // the skin plus the items of yours it wears, so it opens the same on another computer
    const ids = new Set(
        Object.values(rec.skin || {})
          .map(v => (String(v).match(/^Custom_([\w-]+)/) || [])[1])
          .filter(Boolean)
      ),
      mine = [];
    for (const a of app.ASSETS) if (ids.has(a.id)) mine.push(await store.packAsset(a));
    say('Exported');
    download(
      (rec.name.replace(/[\\/:*?"<>|]/g, '').trim() || 'skin') + '.skin.json',
      mine.length ? { name: rec.name, skin: rec.skin, assets: mine } : { name: rec.name, skin: rec.skin }
    );
  }
  async function importSkinFiles(files) {
    let n = 0,
      items = 0,
      offered = 0;
    for (const f of [...files].slice(0, 200)) {
      try {
        const j = await readJsonFile(f, 8_000_000);
        if (Array.isArray(j?.assets)) offered += j.assets.filter(m => m && !app.ASSETS.some(a => a.id === m.id)).length;
        if (Array.isArray(j?.assets))
          items += await store.unpackAssets(j.assets, m => !!app.CAT.items[m.field]?.some(e => !e.custom && e.Id === m.baseId));
        const s = sanitize(j?.skin || j);
        if (s) {
          found.unshift({
            name: cleanName(j?.name || f.name.replace(/(_portrait\.png)?(\.(skin|json))+$/i, '')).slice(0, 40) || 'Imported',
            skin: s,
          });
          n++;
        }
      } catch {
        /* not a skin file */
      }
    }
    if (items) {
      await app.reloadAssets();
      const d = await db.get('meta', 'draft').catch(() => null),
        ds = sanitize(d?.skin),
        have = new Set(app.ASSETS.map(x => 'Custom_' + x.id));
      if (ds && (d.id || null) === (app.cur.id || null)) {
        const s2 = { ...app.cur.skin };
        let n2 = 0;
        for (const f of Object.keys(ds)) {
          const v = ds[f],
            id = typeof v === 'string' && v.split('.')[0];
          if (
            id &&
            id.startsWith('Custom_') &&
            have.has(id) &&
            !app.cur.skin[f]?.startsWith?.('Custom_') &&
            (app.cur.skin[f] || null) !== v
          ) {
            s2[f] = v;
            n2++;
          }
        }
        if (n2) {
          app.cur.skin = app.R.fit(s2);
          keepDraft();
          rebuild();
          render();
        }
      }
    }
    /* only slots that wore a just-imported item go back; nothing else changes */ /* items that just arrived go back on the outfit that wore them */ found =
      found.slice(0, 200);
    say(
      n
        ? `Imported ${n} skin${n > 1 ? 's' : ''}` +
            (items ? ` and ${items} item${items > 1 ? 's' : ''}` : '') +
            (offered > items ? `; ${offered - items} item${offered - items > 1 ? 's' : ''} skipped` : '')
        : 'No skins in those files',
      !n || offered > items
    );
    setTabValue('lookup');
    setTab('lookup');
  }
  // opens in your skins folder when one is connected, else in Documents (no picker id: a remembered id folder would beat Documents); browsers without the picker fall back to the plain file box
  async function pickSkinFiles(fallback) {
    if (typeof self.showOpenFilePicker !== 'function') return fallback.click();
    try {
      const start = await store.skinsFolder('My skins'),
        hs = await showOpenFilePicker({
          multiple: true,
          startIn: start || 'documents',
          types: [{ description: 'Skin files', accept: { 'application/json': ['.json', '.skin'] } }],
        });
      importSkinFiles(await Promise.all(hs.map(h => h.getFile())));
    } catch (e) {
      if (e.name !== 'AbortError') say(e.message, true);
    }
  }
  function panelLookup() {
    const input = el('input', {
      type: 'text',
      placeholder: 'Username or UUID',
      maxLength: 36,
      autocomplete: 'off',
      spellcheck: false,
      value: lookupQ,
      oninput: e => {
        lookupQ = e.target.value;
      },
    }); // the name you looked up stays in the box
    const form = el(
      'form',
      {
        class: 'row',
        onsubmit: e => {
          e.preventDefault();
          lookup(input.value);
        },
      },
      input,
      el('button', { class: 'btn primary', text: 'Find' })
    );
    const file = el('input', {
      type: 'file',
      accept: '.json,.skin,application/json',
      multiple: true,
      hidden: true,
      onchange: e => {
        importSkinFiles(e.target.files);
        e.target.value = '';
      },
    });
    return [
      head('Players'),
      el(
        'div',
        { class: 'pbody' },
        el('h3', { text: 'Find a player' }),
        form,
        el('p', { class: 'err', text: lookupMsg }),
        shown
          ? [
              el('h3', {}, 'Published by ' + shown.name, null),
              shown.skins === null
                ? el('p', { class: 'need', text: 'Looking…' })
                : shown.skins.length
                  ? el(
                      'div',
                      { class: 'cards' },
                      shown.skins.map(r => card(r, 'pub'))
                    )
                  : el('p', { class: 'need', text: shown.failed ? 'Could not load skins' : 'No skins' }),
              shown.anims && shown.anims.length
                ? [
                    el('h3', { text: 'Animations' }),
                    el(
                      'div',
                      { class: 'animlib' },
                      shown.anims.map(x =>
                        el(
                          'div',
                          { class: 'animrow' },
                          el(
                            'span',
                            { class: 'animopen' },
                            el('b', { text: x.name }),
                            el('small', { text: `${(Math.max(1, Math.min(6000, Math.round(+x.anim.duration) || 60)) / 60).toFixed(2)} s` })
                          ),
                          el('button', {
                            class: 'mini',
                            text: 'Copy',
                            onclick: () => {
                              setTab('animate');
                              app.ANIMATE.importAnim(x.anim, x.name);
                            },
                          })
                        )
                      )
                    ),
                  ]
                : null,
            ]
          : null /* a copy goes into your own Animate library */,
        el('h3', { text: 'Open skin files' }),
        el('button', { class: 'btn ghost', text: 'Choose skin files', onclick: () => pickSkinFiles(file) }),
        file,
        found.length
          ? [
              el('h3', { text: 'Found this session' }),
              el(
                'div',
                { class: 'cards' },
                found.map(r => card(r, 'found'))
              ),
            ]
          : null
      ),
    ];
  }

  return { lookup, exportSkin, importSkinFiles, panelLookup };
}
