// A drop-down that previews: the pointer or the arrow keys over a choice show it (the figure plays the move, holds the item, the cards
// re-sort...), and closing without choosing puts back what was there. A plain <select> can't do this: it never says what is under the pointer.
//   pickList(el, { items: [{ value, text, group?, icon? }], value, placeholder, label, search, onPreview(value | null), onChoose(value) })
// onPreview(null) means "show the chosen one again". The returned button has .value and .setItems(items, value).
export function pickList(el, o) {
  let items = o.items || [], value = o.value ?? null, rows = [], act = -1, hov = 0, previewing = false;
  const btn = el('button', { type: 'button', class: 'anypick picklist', 'aria-label': o.label || '' }), menu = el('div', { class: 'anymenu', role: 'listbox', hidden: true });
  btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
  const find = o.search ? el('input', { type: 'search', class: 'anysearch', placeholder: 'Search', 'aria-label': 'Search ' + (o.label || '') }) : null;
  const list = el('div', { class: 'picklist-rows' });
  const text = v => items.find(x => x.value === v)?.text;
  const show = () => { const it = items.find(x => x.value === value); btn.replaceChildren(...(it?.icon ? [iconOf(it.icon)] : []), el('span', { text: it ? it.text : (o.placeholder || 'Choose…') })); btn.title = it ? it.text : ''; };
  const iconOf = ic => { if (typeof ic === 'function') return el('span', { class: 'pickicon pic' }, ic()); if (typeof ic === 'string') { const s = el('span', { class: 'pickicon' }); s.innerHTML = ic; return s; } return ic.cloneNode ? ic.cloneNode(true) : ic; };
  const preview = v => { clearTimeout(hov); hov = setTimeout(() => { previewing = v !== null; o.onPreview?.(v); }, v === null ? 0 : 70); };
  const build = () => { const q = (find?.value || '').trim().toLowerCase(); rows = []; const kids = []; let lastG = null;
    for (const it of items) { if (q && !(it.text + ' ' + (it.group || '')).toLowerCase().includes(q)) continue;
      if (it.group && it.group !== lastG) { lastG = it.group; kids.push(el('div', { class: 'anygroup', text: it.group })); }
      const i = rows.length; rows.push(it); const r = el('div', { class: 'anyopt' + (it.group ? ' ingroup' : ''), role: 'option', data: { i: String(i) } }, ...(it.icon ? [iconOf(it.icon)] : []), el('span', { text: it.text }));
      r.setAttribute('aria-selected', 'false'); if (it.value === value) r.classList.add('chosen'); kids.push(r); }
    if (!rows.length) kids.push(el('div', { class: 'anyopt dim', text: 'Nothing found' }));
    list.replaceChildren(...kids); act = -1; };
  const opts = () => [...list.querySelectorAll('[role=option]')];
  const mark = i => { act = i; for (const x of opts()) x.setAttribute('aria-selected', String(+x.dataset.i === i)); const r = opts().find(x => +x.dataset.i === i); r?.scrollIntoView({ block: 'nearest' }); };
  const edge = () => Math.min(innerHeight, btn.closest('.panel, dialog')?.getBoundingClientRect().bottom || innerHeight);
  const place = () => { const r = btn.getBoundingClientRect(), below = edge() - r.bottom - 8, above = r.top - 8, up = below < 220 && above > below, h = Math.min(380, up ? above : below);
    Object.assign(menu.style, { left: r.left + 'px', width: Math.max(r.width, 220) + 'px', maxHeight: Math.max(120, h) + 'px', top: up ? '' : r.bottom + 2 + 'px', bottom: up ? innerHeight - r.top + 2 + 'px' : '' }); };
  const away = ev => { if (!menu.contains(ev.target) && !btn.contains(ev.target)) close(); };
  const drift = ev => { if (!menu.contains(ev.target)) close(); };
  const host = () => btn.closest('dialog') || document.body;   // inside a dialog the list must live in the dialog (the top layer)
  function open() { if (!menu.hidden) return; document.querySelectorAll('.anymenu').forEach(x => { if (x !== menu) x.hidden = true; }); if (find) find.value = ''; build(); const inDlg = !!btn.closest('dialog'); menu.classList.toggle('inline', inDlg); if (inDlg) btn.after(menu); else { host().append(menu); place(); } menu.hidden = false;   /* in a dialog the list opens in place, under the button */
    btn.setAttribute('aria-expanded', 'true'); const i = rows.findIndex(x => x.value === value); mark(i); if (find) find.focus();
    document.addEventListener('pointerdown', away, true); addEventListener('scroll', drift, true); addEventListener('resize', close); }
  function close(chosen) { if (menu.hidden) return; menu.hidden = true; menu.remove(); btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', away, true); removeEventListener('scroll', drift, true); removeEventListener('resize', close);
    if (!chosen && previewing) preview(null); else clearTimeout(hov); previewing = false; if (document.activeElement === find || !document.activeElement || document.activeElement === document.body) btn.focus(); }
  const choose = i => { const it = rows[i]; if (!it) return; value = it.value; show(); previewing = false; clearTimeout(hov); close(true); o.onChoose?.(value); };
  const keys = ev => { const k = ev.key, n = rows.length;
    if (k === 'ArrowDown' || k === 'ArrowUp') { ev.preventDefault(); if (menu.hidden) { open(); return; } if (!n) return; const i = Math.max(0, Math.min(n - 1, act + (k === 'ArrowDown' ? 1 : -1))); mark(i); preview(rows[i].value); }
    else if ((k === 'Home' || k === 'End') && !menu.hidden && n && ev.target !== find) { ev.preventDefault(); const i = k === 'Home' ? 0 : n - 1; mark(i); preview(rows[i].value); }
    else if (k === 'Enter' && !menu.hidden) { ev.preventDefault(); if (act >= 0) choose(act); else if (n === 1) choose(0); }
    else if (k === ' ' && !menu.hidden && ev.target !== find) { ev.preventDefault(); if (act >= 0) choose(act); }
    else if (k === 'Escape' && !menu.hidden) { ev.preventDefault(); ev.stopPropagation(); close(); } else if (k === 'Tab' && !menu.hidden) close(); };
  btn.onclick = () => menu.hidden ? open() : close(); btn.onkeydown = keys;
  if (find) { find.onkeydown = keys; find.oninput = () => { build(); if (rows.length) { mark(0); preview(rows[0].value); } }; menu.append(find); }
  menu.append(list);
  list.onpointerover = ev => { const r = ev.target.closest('[role=option]'); if (r && +r.dataset.i !== act) { const i = +r.dataset.i; mark(i); preview(rows[i].value); } };
  list.onpointerleave = () => { if (previewing) { mark(-1); preview(null); } };
  list.onclick = ev => { const r = ev.target.closest('[role=option]'); if (r) choose(+r.dataset.i); };
  Object.defineProperty(btn, 'value', { get: () => value, set: v => { value = v; show(); } });
  btn.setItems = (its, v) => { items = its; if (v !== undefined) value = v; show(); if (!menu.hidden) build(); };
  btn.textOf = text; show(); return btn;
}
