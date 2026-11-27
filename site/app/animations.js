// The Animations tab: the game's moves on the current skin, with mounts, props and scenery.
import * as game from './game.js';
import * as fig from './figure.js';
import { icon as catIcon } from './icons.js';
import { nice } from './skin.js';
import { heldBy } from './held.js';

export function createAnimations(app) {
  const { el, say, showConnect, animThumb, render, head, toggleEmote, drawEmotes, walk } = app;
  // animations
  let playing = { group: 'Default', name: 'Idle' };
  let onceT;
  // ---- Mount moves: the player rides the animal the game lets them ride (tamed horse, camel, ram), with its own matching move.
  // Checked against a ridden horse in game 2026-11-20 (side, front, back, high views): seat height and place match; no saddle;
  // mane and tail are black or grey at random (black shown).
  const MOUNT_PATH = 'NPC/Livestock/',
    BLOCK = 64; // model units per block
  const MOUNTS = {
    Horse: {
      model: MOUNT_PATH + 'Horse/Models/Model.blockymodel',
      tex: MOUNT_PATH + 'Horse/Models/Texture.png',
      seat: [0, 1.6, 0],
      anims: MOUNT_PATH + 'Horse/Animations/Default/',
      atts: [
        { model: MOUNT_PATH + 'Horse/Models/Attachments/Mane.blockymodel', tex: MOUNT_PATH + 'Horse/Models/Attachments/Mane_Black.png' },
      ],
    }, // the ridden (Tamed_Horse) role uses the plain horse: no saddle; mane and tail black or grey at random
    Camel: {
      model: MOUNT_PATH + 'Camel/Models/Model.blockymodel',
      tex: MOUNT_PATH + 'Camel/Models/Texture.png',
      seat: [0, 2.25, 0.2],
      anims: MOUNT_PATH + 'Camel/Animations/Default/',
      atts: [
        {
          model: MOUNT_PATH + 'Camel/Models/Attachments/Shell.blockymodel',
          tex: MOUNT_PATH + 'Camel/Models/Attachments/Shell_Textures/Green.png',
        },
      ],
    },
    Ram: {
      model: MOUNT_PATH + 'Ram/Models/Model.blockymodel',
      tex: MOUNT_PATH + 'Ram/Models/Texture.png',
      seat: [0, 1.3, 0],
      anims: MOUNT_PATH + 'Ram/Animations/Default/',
      atts: [],
    },
  };
  const MOUNT_MOVE = {
    Mount_Idle: ['Idle', 1],
    Mount_Walk: ['Walk', 1],
    Mount_Walk_Backward: ['Walk_Backward', 1],
    Mount_Run: ['Run', 1],
    Mount_Run_Backward: ['Walk_Backward', 1],
    Mount_Sprint: ['Run', 1],
  }; // the game's animals have only Idle/Walk/WalkBackward/Run, all at speed 1 (Server/Models/Livestock/*.json)
  let mountKind = 'Horse',
    mountOn = null,
    mountMsg = '';
  async function setMount(kind, move) {
    if (!app.st) return;
    if (!kind) {
      if (mountOn) {
        app.st.mount(null);
        mountOn = null;
      }
      return;
    }
    const M = MOUNTS[kind];
    try {
      if (mountOn !== kind) {
        const root = await fig.buildCreature(M);
        app.st.mount(
          root,
          M.seat.map(v => v * BLOCK)
        );
        mountOn = kind;
      }
      const [n, sp] = MOUNT_MOVE[move] || ['Idle', 1];
      app.st.mountAnim.set(await game.json(game.common(M.anims + n + '.blockyanim')), sp);
      mountMsg = '';
    } catch (e) {
      console.warn(e);
      app.st.mount(null);
      mountOn = null;
      mountMsg = 'Your saved copy of the game files is from before animals were added. Refresh it once to see them (your skins are kept).';
    }
  }
  // scenery for the moves that use something in the world, in model units (a block is 64; the figure faces +z, its pelvis rests at 51)
  const W = game.SCENERY_TEX;
  // the game's own furniture (its village set and workbench, see scene-data.js), placed where the moves use them
  // where the game puts a sitter or sleeper: the block's Seats/Beds offset from the cell centre (Furniture_Village_Chair: 0.2 forward;
  // Furniture_Village_Bed: 0.4 across, 1 along), checked 2026-11-23 on an actor seated by the game's own seat logic
  const CHAIR = [{ block: game.SET_PIECES.chair, at: [0, 0, -12.8], turn: 0 }];
  const BED = [{ block: game.SET_PIECES.bed, at: [-25.6, 0, -64], turn: 0 }]; // lengthwise along z, pillow end at -z
  const BENCH = [{ block: game.SET_PIECES.bench, at: [-32, 0, 84], turn: 180 }]; // something to work at, centred in front of the hands (it is two blocks wide: x -64..64)
  const LADDERS = cols => [{ ladder: [cols, 7], at: [0, 0, -8] }]; // climbing faces +z: the rungs just in front of the hands, planks behind them
  const DEEP = 192; // how far above the lake bed a swimmer floats (3 blocks)
  const WATER = (y, under) => [
    { plane: [6400, 6400], at: [0, y, 0], tex: W.water, repeat: [56, 56], color: 0x7fb2e6, opacity: 0.55, flow: true },
    ...(under ? [{ box: [6400, y, 6400], at: [0, y / 2, 0], color: 0x1d5ca8, opacity: 0.62, volume: true }] : []),
  ]; // a lake to the hills, drifting with the land while swimming
  function sceneryFor(g, n) {
    if (g === 'Flavor' && /^Sit2?$/.test(n)) return [CHAIR, 32]; // as in game: the sitter half a block above the floor
    if (g === 'Flavor' && /^Sleep/.test(n)) return [BED, 54.4]; // as in game: the sleeper 0.85 block above the floor, on top of the blanket
    if (g === 'Climb') return [LADDERS(/_(Left|Right)$/.test(n) ? 3 : 1), 0]; // one ladder up and down, a few side by side to climb across
    if (g === 'Default' && n === 'Interact') return [BENCH, 0];
    if (g === 'Swim') return [WATER(DEEP + (/Dive|Sink/.test(n) ? 150 : 92), true), 0]; // deep water: the swimmer floats DEEP above the lake bed
    // pulling up: the move starts about two blocks below and ends on top, so the figure stands that much higher on a stone block it climbs onto
    if (g === 'Mantle' && /^Mantle_Up/.test(n)) return [[{ box: [160, 126, 128], at: [0, 63, 26], tex: W.stone, repeat: [2.5, 2] }], 126];
    if (g === 'Mantle') return [[{ box: [160, 84, 64], at: [0, 42, 50], tex: W.stone, repeat: [2.5, 1.2] }], 0]; // hands resting on a chest-high ledge in front
    return [null, 0];
  }
  // moves done facing something (a ladder, a workbench) are watched from behind, as in the game
  const facesAway = (g, n) => g === 'Climb' || g === 'Mantle' || (g === 'Default' && n === 'Interact');
  let propsKey = ''; // the props in the hands now: a move that uses the same ones keeps them (the glider never blinks out between glide moves)
  const setPropsKey = v => (propsKey = v);
  async function setProps(g, n) {
    const want = heldBy(g, n),
      key = JSON.stringify(want);
    if (key === propsKey) return;
    propsKey = key;
    const built = await Promise.all(
      want.map(async ([k, bone, shift, turn]) => {
        try {
          return { root: await fig.buildProp(k), bone, shift, turn };
        } catch (e) {
          console.warn(k, e.message);
          return null;
        }
      })
    );
    app.st.props(built.filter(Boolean));
    if (built.some(b => !b)) say('Held items need fresh game files: refresh them in the Locker', true);
  }
  // st.lift: tall moves aim the view higher, moves near the floor aim lower so they clear the buttons under the view
  // the speed each move plays at in game (Server/Models/Human/Player.json, AnimationSets); everything else plays at 1
  const GAME_SPEED = {
    'Default/Idle': 0.3,
    'Default/Run': 0.6,
    'Default/Run_Backward': 0.6,
    'Default/Sprint': 0.6,
    'Default/Crouch': 0.5,
    'Default/Crouch_Walk': 0.8,
    'Default/Crouch_Walk_Backward': 0.8,
    'Default/Walk': 0.6,
    'Default/Walk_Backward': 0.6,
    'Default/Jump': 0.8,
    'Default/Jump_Far': 0.8,
    'Default/Jump_Far2': 0.8,
    'Default/Step_Run': 1.1,
    'Default/Step_Run2': 1.1,
    'Default/Step_Sprint': 1.2,
    'Default/Step_Sprint2': 1.2,
    'Default/Step_Crouch_Walk': 1.1,
    'Default/Step_Crouch_Walk2': 1.1,
    'Roll/Roll': 2,
    'Roll/Roll_Backward': 2,
    'Roll/Roll_Left': 2,
    'Roll/Roll_Right': 2,
    'Swim/Swim': 0.6,
    'Swim/Swim_Fast': 0.6,
    'Swim/Swim_Jump': 0.8,
    'Swim/Swim_Dive': 0.6,
    'Swim/Swim_Dive_Fast': 0.6,
    'Swim/Swim_Dive_Fast2': 0.6,
    'Climb/Climb_Idle': 0.5,
    'Mantle/Mantle_Idle': 0.5,
    'Flavor/Sit': 0.5,
    'Flavor/Sit2': 0.5,
    'Flavor/Sit_Ground': 0.5,
  };
  let playSeq = 0; // a newer move cancels one still loading, so two never mix (one's camera with the other's height)
  async function playAnim(g, n, speed = 1, once = false) {
    clearTimeout(onceT);
    if (!walk.on) app.st.face(walk.keepYaw ? app.st.facing() : 0);
    walk.keepYaw = false;
    /* anything but walking faces the front again */ const my = ++playSeq;
    try {
      await setMount(g === 'Mount' ? mountKind : null, n);
      if (my !== playSeq) return;
      await setProps(g, n);
      if (my !== playSeq) return;
      const faceUp = /^Expressions/.test(g) || (g === 'Flavor' && /^(Blink|Eye)/.test(n));
      app.st.lift(
        faceUp
          ? 98
          : g === 'Glide'
            ? 210
            : g === 'Fly' || (g === 'Flavor' && /^Fly_/.test(n))
              ? 106
              : g === 'Climb'
                ? 86
                : g === 'Taunt' && /Staff_Helicopter/.test(n)
                  ? 100
                  : g === 'Default' && n === 'Interact'
                    ? 70
                    : g === 'Mantle'
                      ? /^Mantle_Up/.test(n)
                        ? 150
                        : 110
                      : g === 'Swim'
                        ? 62 + DEEP
                        : g === 'Flavor' && /^(Sit_Ground|Sleep)/.test(n)
                          ? 34
                          : g === 'Flavor' && /^Sit2?$/.test(n)
                            ? 58
                            : 0,
        g === 'Flavor' && /^Sleep/.test(n) ? 0.9 : g === 'Default' && n === 'Interact' ? 1.1 : 0,
        g === 'Glide' ? 470 : faceUp ? -200 : g === 'Flavor' && /^Sit2?$/.test(n) ? 440 : 360,
        g === 'Flavor' && /^Sleep/.test(n) ? -24 : 0
      );
      app.st.scenery(...sceneryFor(g, n));
      app.tempBackdrop?.(
        g === 'Swim' ? 'ocean' : null
      ); /* swimming takes the character out to sea; any other move brings back the chosen place */
      app.st.plantClear(g === 'Swim' ? 99 : (g === 'Flavor' && /^(Sit_Ground|Sleep|Lay|Lie)/.test(n)) || /Crawl|Prone/.test(n) ? 1.9 : 0);
      if (facesAway(g, n) && !facesAway(playing.group, playing.name)) app.st.behind();
      else if (!facesAway(g, n) && facesAway(playing.group, playing.name)) app.st.toFront();
      app.st.keepBehind(facesAway(g, n));
      app.st.wall(
        g === 'Climb'
          ? /_Up$/.test(n)
            ? [0, 55]
            : /_Down$/.test(n)
              ? [0, -55]
              : /_Left$/.test(n)
                ? [45, 0]
                : /_Right$/.test(n)
                  ? [-45, 0]
                  : [0, 0]
          : null
      );
      let a = await fig.loadAnim(g, n);
      if (my !== playSeq) return;
      {
        const m = g === 'Flavor' && /^(Crouch(?:_Walk)?|Fly)_Look_Around/.exec(n);
        if (m) {
          const base = await (m[1] === 'Fly' ? fig.loadAnim('Fly', 'Fly_Idle') : fig.loadAnim('Default', m[1])).catch(() => null);
          if (my !== playSeq) return;
          if (base) a = { ...a, nodeAnimations: { ...base.nodeAnimations, ...a.nodeAnimations } };
        }
      }
      app.st.pitch(g === 'Swim' && /^Swim(_Fast|_Dive|_Dive_Fast2?)?$/.test(n) ? 65 : 0);
      app.st.shadow(g !== 'Swim');
      app.st.jump?.(g === 'Default' && /^Jump/.test(n) ? (n === 'Jump_Crouch' ? 22 : /Far/.test(n) ? 30 : 36) : 0);
      app.st.fall?.(g === 'Default' && /^Fall/.test(n));
      /* jumps leave the ground, falls drop through it */ app.st.hover(
        g === 'Fly' || (g === 'Flavor' && /^Fly_/.test(n)) ? 44 : g === 'Glide' ? 150 : g === 'Swim' ? DEEP : 0,
        g === 'Swim'
      );
      /* a swimmer is in the water at once, not floating up from the lake bed */ playing = { group: g, name: n };
      const gs = GAME_SPEED[g + '/' + n];
      app.st.anim.set(a, gs ?? speed);
      if (once) {
        const still = fig.motionOf(g, n) && app.st.anim.still,
          ms = still ? 1700 : (Math.max(1, a.duration || 60) / 60 / speed) * 1000 + (a.holdLastKeyframe ? 700 : 0) + 250;
        onceT = setTimeout(() => {
          if (playing.group === g && playing.name === n) playAnim('Default', 'Idle', 0.5);
        }, ms);
      }
      // walking, running, sprinting and crouching move the ground at the game's own speeds (motionOf), whatever rate the body plays at;
      // the other moves' speeds were judged with their playback rate in, so they keep it
      const own = g === 'Default' && /^(Run|Sprint|Walk|Crouch_Walk)/.test(n),
        rate = own ? 1 : (GAME_SPEED[g + '/' + n] ?? 1);
      app.st.anim.setMove(fig.motionOf(g, n)?.map(v => v * rate) || null);
      app.st.anim.playing = true;
      drawEmotes();
    } catch (e) {
      say('That animation could not be loaded.', true);
    }
    if (app.tab === 'animations') render();
  }
  let animGroup = 'Emote';
  // the move groups as locker tiles: the game's 16 folders folded into a few, each tile showing its signature move
  // a group can be split with "Group:part": Sit and Sleep live in Flavor in the game files but players look for them under Poses
  const REST = /^(Sit|Sleep)/,
    PART = { rest: n => REST.test(n), idle: n => !REST.test(n) },
    PARTNAME = { rest: 'Sit and lie' };
  const animsOf = spec => {
    if (spec[0] === '@') return app.CAT[spec.slice(1)] || [];
    const [g, part] = spec.split(':'),
      all = app.CAT.anims[g] || [];
    return part ? all.filter(PART[part]) : all;
  }; // '@wheel' / '@faces': the game's own lists (entries with g, n, name)
  const animLabel = (g, n) =>
    ([...(app.CAT.wheel || []), ...(app.CAT.faces || [])].find(e => e.g === g && e.n === n) || {}).name || nice(n); // the name the game shows for it
  const CATS = [
    ['Emote', ['@wheel']],
    ['Moves', ['Default']],
    ['Poses', ['Poses', 'Flavor:rest']],
    ['Taunt', ['Taunt']],
    ['Idle extras', ['Flavor:idle']],
    ['Faces', ['@faces']],
    ['Travel', ['Fly', 'Glide', 'Dash', 'Roll', 'Slide', 'Swim', 'Climb', 'Mantle']],
    ['Mount', ['Mount']],
  ];
  function animCats() {
    const have = g => animsOf(g).length,
      out = CATS.map(([k, gs]) => [k, gs.filter(have)]).filter(([, gs]) => gs.length);
    const used = new Set(['Emote', 'Expressions', ...out.flatMap(c => c[1].map(g => g.split(':')[0]))]);
    /* the game's lists stand for those folders */ for (const g of Object.keys(app.CAT.anims))
      if (!used.has(g) && have(g)) out.push([nice(g), [g]]);
    return out;
  }
  function panelAnimations() {
    const cats = animCats();
    if (!cats.some(c => c[0] === animGroup)) animGroup = cats[0][0];
    const gs = cats.find(c => c[0] === animGroup)[1],
      A = app.st.anim,
      count = list => list.reduce((t, g) => t + animsOf(g).length, 0);
    const item = (g, n, label = animLabel(g, n)) => {
      const k = g + '/' + n,
        pinned = app.EMOTES && app.EMOTES.includes(k);
      return el(
        'button',
        {
          class: A.anim && playing.group === g && playing.name === n ? 'on' : '',
          title: label,
          'aria-keyshortcuts': 'F',
          'aria-pressed': A.anim && playing.group === g && playing.name === n ? String(!!app.st.anim.playing) : null,
          onclick: () => {
            if (playing.group === g && playing.name === n) {
              app.st.anim.playing = !app.st.anim.playing;
              render();
            } else playAnim(g, n);
          },
          /* the playing card pauses and resumes */ onkeydown: ev => {
            if (!ev.ctrlKey && !ev.metaKey && !ev.altKey && (ev.key === 'f' || ev.key === 'F')) {
              ev.preventDefault();
              toggleEmote(g, n);
              render();
              setTimeout(
                () =>
                  [...document.querySelectorAll('.animlist button')]
                    .find(b => b.querySelector('span')?.textContent === animLabel(g, n))
                    ?.focus(),
                80
              );
            }
          },
        },
        animThumb(g, n),
        el('span', { text: label }),
        el('i', {
          class: 'star' + (pinned ? ' on' : ''),
          'aria-label': pinned ? 'Unfavourite' : 'Favourite',
          title: pinned ? 'Unfavourite' : 'Favourite',
          text: pinned ? '★' : '☆',
          onclick: e => {
            e.stopPropagation();
            toggleEmote(g, n);
            render();
          },
        })
      );
    };
    return [
      head('Animations'),
      el(
        'div',
        { class: 'pbody' },
        el(
          'div',
          { class: 'cattiles' },
          cats.map(([k, list]) =>
            el(
              'button',
              {
                class: 'cattile' + (k === animGroup ? ' on' : ''),
                onclick: () => {
                  const changed = animGroup !== k;
                  animGroup = k;
                  render();
                  if (changed) {
                    const pb = document.querySelector('.panel .pbody');
                    if (pb) pb.scrollTop = 0;
                  }
                },
              },
              catIcon(k),
              el('b', { text: k }),
              el('small', { text: String(count(list)) })
            )
          )
        ),
        animGroup === 'Mount'
          ? el(
              'div',
              { class: 'options' },
              el('b', { class: 'dim', text: 'Ride:' }),
              Object.keys(MOUNTS).map(k =>
                el('button', {
                  class: 'chip' + (k === mountKind ? ' on' : ''),
                  text: k,
                  onclick: () => {
                    mountKind = k;
                    if (playing.group === 'Mount' && A.anim) playAnim('Mount', playing.name);
                    else render();
                  },
                })
              )
            )
          : null,
        animGroup === 'Mount' && mountMsg
          ? el(
              'div',
              { class: 'row' },
              el('p', { class: 'need', text: mountMsg }),
              el('button', { class: 'btn ghost', text: 'Refresh game files', onclick: () => showConnect() })
            )
          : null,
        gs.length > 1
          ? gs.map(spec => {
              const [g, part] = spec.split(':');
              return [
                el('h3', { class: 'animhead', text: PARTNAME[part] || nice(g) }),
                el(
                  'div',
                  { class: 'animlist' },
                  animsOf(spec).map(n => (typeof n === 'object' ? item(n.g, n.n, n.name) : item(g, n)))
                ),
              ];
            })
          : el(
              'div',
              { class: 'animlist' },
              animsOf(gs[0]).map(n => (typeof n === 'object' ? item(n.g, n.n, n.name) : item(gs[0].split(':')[0], n)))
            )
      ),
    ];
  }

  // other players' skins

  return {
    sceneryFor,
    facesAway,
    get playing() {
      return playing;
    },
    get onceT() {
      return onceT;
    },
    setMount,
    setPropsKey,
    playAnim,
    animLabel,
    panelAnimations,
  };
}
