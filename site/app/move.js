// The moving page. On the old address it opens this same page on the new address in a new tab (a tab of its own, so it can
// save there) and posts it a copy of what this browser keeps here; the new tab adds what it lacks, says so and closes.
import { onOld, gather, worthMoving, receive, NEW_ORIGIN, OLD_ORIGINS } from './moving.js';

const $ = id => document.getElementById(id);
const say = t => ($('mv-text').textContent = t);
const markMoved = () => {
  try {
    localStorage.setItem('hd_moved', '1');
  } catch {
    /* no storage */
  }
};
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

async function sender() {
  const g = await gather();
  if (!worthMoving(g)) {
    markMoved();
    location.replace(NEW_ORIGIN + '/');
    return;
  }
  $('mv-skip').href = NEW_ORIGIN + '/';
  $('mv-skip').onclick = markMoved;
  let tab = null;
  addEventListener('message', e => {
    if (e.origin !== NEW_ORIGIN || !tab || e.source !== tab) return;
    if (e.data?.hd === 'ready') tab.postMessage({ hd: 'data', g }, NEW_ORIGIN);
    if (e.data?.hd === 'done') {
      markMoved();
      const { skins = 0, items = 0 } = e.data;
      say(`Done: ${plural(skins, 'skin')} and ${plural(items, 'item')} are on hytaledesigner.com. Taking you there now.`);
      setTimeout(() => location.replace(NEW_ORIGIN + '/'), 1800);
    }
    if (e.data?.hd === 'failed')
      say('That did not work: ' + (e.data.why || 'the new site could not save') + '. Try once more, or go without them.');
  });
  $('mv-go').onclick = () => {
    tab = window.open(NEW_ORIGIN + '/move#receive', 'hd_move');
    if (!tab) say('Your browser blocked the new tab. Allow pop-ups for this site and press the button again.');
    else say('Bringing your things over…');
  };
}

function receiver() {
  $('mv-buttons').hidden = true;
  $('mv-note').hidden = true;
  if (!window.opener) {
    say('Open the old address (hytale-skin-editor.com) and press "Bring my stuff over" there.');
    return;
  }
  document.querySelector('#move h1').textContent = 'Moving your things';
  say('Taking your skins and items…');
  addEventListener('message', async e => {
    if (!OLD_ORIGINS.includes(e.origin) || e.source !== window.opener || e.data?.hd !== 'data') return;
    try {
      const r = await receive(e.data.g);
      e.source.postMessage({ hd: 'done', ...r }, e.origin);
      say('Done. This tab closes by itself.');
      setTimeout(() => window.close(), 600);
    } catch (err) {
      e.source.postMessage({ hd: 'failed', why: String(err?.message || err) }, e.origin);
      say('Could not save here: ' + (err?.message || err));
    }
  });
  // the old address only answers to this site, so "ready" may go to any address: it carries nothing
  window.opener.postMessage({ hd: 'ready' }, '*');
}

if (location.hash === '#receive') receiver();
else if (onOld()) sender();
else location.replace('/');
