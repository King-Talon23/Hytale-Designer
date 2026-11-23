// The transport and frame bar under the stage.

export function createTransport(app) {
  const { $, el } = app;
  // the animation transport on the stage (Animations tab): play/pause, step a frame, scrub to any frame
  function drawTransport() {
    const stg = $('view').parentElement;
    let bar = $('transport');
    const show =
      ((app.tab === 'animations' && !app.st.anim.still) || (app.tab === 'animate' && app.ANIMATE?.active())) &&
      !app.ED &&
      !!app.st.anim.anim; /* moves get the frame bar; a still pose doesn't */
    if (!show) {
      if (bar) bar.hidden = true;
      return;
    }
    if (!bar) {
      const A = () => app.st.anim,
        frames = () => Math.max(1, Math.round(A().duration)),
        seek = f => {
          const a = A();
          a.playing = false;
          a.blend = 1;
          a.held = 0;
          a.t = Math.max(0, Math.min(frames(), f));
          a.apply();
          sync();
        };
      const play = el('button', {
        class: 'tbtn',
        'aria-label': 'Play',
        onclick: () => {
          const a = A();
          a.playing = !a.playing;
          if (a.playing && a.t >= frames() && a.anim?.holdLastKeyframe) a.t = 0;
          sync();
        },
      });
      const back = el('button', {
        class: 'tbtn',
        'aria-label': 'Previous frame',
        title: ',',
        text: '‹',
        onclick: () => seek(Math.round(A().t) - 1),
      });
      const fwd = el('button', {
        class: 'tbtn',
        'aria-label': 'Next frame',
        title: '.',
        text: '›',
        onclick: () => seek(Math.round(A().t) + 1),
      });
      const slider = el('input', { type: 'range', min: 0, step: 1, 'aria-label': 'Frame', oninput: e => seek(+e.target.value) }),
        lab = el('span', { class: 'tframe' });
      function sync() {
        const a = A(),
          n = frames();
        slider.max = n;
        if (document.activeElement !== slider || a.playing) slider.value = Math.min(n, Math.round(a.t));
        lab.textContent =
          app.tab === 'animate' && app.ANIMATE?.simple?.()
            ? `${(Math.min(n, a.t) / 60).toFixed(1)} / ${(n / 60).toFixed(1)} s`
            : `${Math.min(n, Math.round(a.t))} / ${n}`;
        /* seconds in simple mode, frames with More tools */ play.textContent = a.playing ? '❚❚' : '▶';
        play.setAttribute('aria-label', a.playing ? 'Pause' : 'Play');
      }
      bar = el('div', { id: 'transport', class: 'transport' }, back, play, fwd, slider, lab);
      bar.sync = sync;
      bar.seek = seek;
      stg.appendChild(bar);
      const tick = () => {
        if (!bar.hidden) sync();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      addEventListener('keydown', e => {
        if (
          bar.hidden ||
          e.ctrlKey ||
          e.metaKey ||
          e.altKey ||
          e.target.matches?.('input:not([type=range]),textarea,select,[contenteditable]')
        )
          return;
        if (e.key === ',' || e.key === '.') {
          e.preventDefault();
          bar.seek(Math.round(app.st.anim.t) + (e.key === '.' ? 1 : -1));
        } else if (
          e.key === ' ' &&
          (e.target.matches?.('input[type=range]') || !e.target.closest?.('button,input,select,label,[role=button]'))
        ) {
          e.preventDefault();
          play.click();
        }
      }); /* , and . step a frame, Space plays/pauses (as in video players) */
    }
    bar.hidden = false;
    bar.sync();
  }

  return { drawTransport };
}
