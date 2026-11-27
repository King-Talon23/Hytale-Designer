// Walking the character around with the keyboard.

export function createWalk(app) {
  const { render } = app;
  // ---- walking the character around: W A S D run (Shift sprints, C crouches), Space jumps; 1-6 play the pinned emotes, 0 stops.
  // Not in the Creator or the Animate tab (their letters are tool keys and the figure must stand still there), never while typing.
  const walk = { keys: new Set(), on: false, kind: '', keepYaw: false, yaw: 0, prevYaw: 0, at: 0 };
  function walkStop() {
    walk.keys.clear();
    const was = walk.on || walk.crouched;
    walk.crouched = false;
    if (!was) return;
    walk.on = false;
    walk.kind = '';
    if (app.tab === 'animate' || app.tab === 'creator' || app.ED) {
      app.st.face(0, true);
      return;
    }
    walk.keepYaw = true;
    app.playAnim('Default', 'Idle', 0.5);
  } // let go anywhere: the walk ends
  const walkAllowed = () =>
    !app.ED && app.tab !== 'creator' && app.tab !== 'animate' && app.R && app.st && !document.querySelector('dialog[open]');
  const typing = t => t?.matches?.('input:not([type=range]):not([type=checkbox]),textarea,select,[contenteditable]');
  function walkUpdate() {
    const k = walk.keys,
      x = (k.has('d') ? 1 : 0) - (k.has('a') ? 1 : 0),
      z = (k.has('w') ? 1 : 0) - (k.has('s') ? 1 : 0);
    if (!x && !z) {
      const crouch = k.has('c');
      if (walk.on || crouch !== !!walk.crouched) {
        walk.on = false;
        walk.kind = '';
        walk.keepYaw = true;
        if (performance.now() - walk.at < 150) app.st.face(walk.prevYaw);
        walk.crouched = crouch;
        app.playAnim('Default', crouch ? 'Crouch' : 'Idle', 0.5);
      }
      return;
    } // C alone crouches in place   // let go: idle, still facing the way it walked (two keys let go together keep the diagonal)
    const c = app.st.camera.position,
      t = app.st.target ? app.st.target() : { x: 0, z: 0 },
      f = { x: (t.x ?? 0) - c.x, z: (t.z ?? 0) - c.z },
      L = Math.hypot(f.x, f.z) || 1;
    f.x /= L;
    f.z /= L;
    const m = { x: f.x * z - f.z * x, z: f.z * z + f.x * x },
      yaw = Math.atan2(m.x, m.z); // W away from the camera, D to its right
    // as in game: the keys run, Shift sprints, C crouches
    const kind = walk.keys.has('c') ? 'Crouch_Walk' : walk.keys.has('shift') ? 'Sprint' : 'Run';
    if (!walk.on || walk.kind !== kind) {
      walk.on = true;
      walk.kind = kind;
      app.playAnim('Default', kind);
    }
    if (Math.abs(yaw - walk.yaw) > 1e-3) {
      walk.prevYaw = walk.yaw;
      walk.yaw = yaw;
      walk.at = performance.now();
    }
    app.st.face(yaw);
  }
  addEventListener('keydown', e => {
    if (typing(e.target) || e.altKey || e.metaKey) return;
    const key = e.key.toLowerCase();
    if (!walkAllowed()) {
      if (walk.on) walkStop();
      return;
    }
    if (['w', 'a', 's', 'd'].includes(key) && !e.ctrlKey) {
      e.preventDefault();
      walk.keys.add(key);
      walkUpdate();
      return;
    }
    if (key === 'shift' || (key === 'c' && !e.ctrlKey)) {
      walk.keys.add(key);
      if (walk.on || key === 'c') walkUpdate();
      if (key === 'c' && walk.on) e.preventDefault();
      return;
    } /* C crouches (Ctrl belongs to the browser: Ctrl+W closes the tab) */
    if (e.ctrlKey) return;
    if (key === ' ' && app.tab !== 'animations' && !e.target.closest?.('button,a,summary,label,input,select,[role=button],[tabindex]')) {
      e.preventDefault();
      if (!walk.on && !e.repeat) app.playAnim('Default', 'Jump', 1, true);
      return;
    } // Space jumps (in Animations it plays and pauses)
    if (/^[0-6]$/.test(key) && !e.repeat && app.EMOTES) {
      const i = +key - 1,
        k = app.EMOTES[i];
      if (key !== '0' && !k) return;
      /* an empty pin changes nothing, a walk goes on */ for (const d of ['w', 'a', 's', 'd']) walk.keys.delete(d);
      walk.on = false;
      walk.kind = '';
      walk.crouched = false;
      const keepFocus = e.target.closest?.('.animlist button')?.querySelector('span')?.textContent;
      if (keepFocus)
        setTimeout(
          () => [...document.querySelectorAll('.animlist button')].find(b => b.querySelector('span')?.textContent === keepFocus)?.focus(),
          80
        );
      if (key === '0') {
        app.playAnim('Default', 'Idle', 0.5);
        return;
      }
      const [g, n] = k.split('/');
      if (app.playing.group === g && app.playing.name === n) app.playAnim('Default', 'Idle', 0.5);
      else app.playAnim(g, n);
      render();
    } // the same number again stops it
  });
  addEventListener('keyup', e => {
    const key = e.key.toLowerCase();
    if (!walk.keys.has(key)) return;
    walk.keys.delete(key);
    if (walkAllowed() && (walk.on || key === 'c' || walk.crouched)) walkUpdate();
    else if (!['w', 'a', 's', 'd'].some(k => walk.keys.has(k))) walkStop();
  }); // let go while walking is off (a dialog): the walk still ends
  addEventListener('blur', () => {
    if (walk.keys.size) {
      walk.keys.clear();
      if (walkAllowed()) walkUpdate();
    }
  }); // keys let go while the window was away

  return { walk, walkStop };
}
