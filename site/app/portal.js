// The strip (a prototype, on local test pages with ?strip): the character walks a straight flat lane through the biome's land, the land
// moving with the walk. At the lane's left and right edges a pair of portals opens when the character comes near either edge.
// Along the lane there is no portal to see: its land repeats every lane length, so walking on past its end simply carries on at its
// start, and the character shows again a lane ahead and a lane behind, as it would down a lane that goes round.
// The pair is one doorway: through the near one is the far edge of the lane. They are drawn with the game's own portal art (its blue portal ring, a swirl and a ripple map, read
// from the player's game files), open with a flicker and a swirl, and close again when the character walks away.
// Going through: only the camera passing through a bubble carries the view across. A camera swung past an edge anywhere else is
// behind that portal, and through its back it sees the land beyond the other edge, as a real doorway would show.
import * as THREE from '../vendor/three.module.min.js';

const VERT = [
  'varying vec2 vUv; varying float vFacing;',
  'void main() {',
  '  vUv = uv;',
  '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
  // how squarely the camera looks at the bubble: seen edge-on, its ring fades so it never shows as a line standing in the field
  '  vFacing = abs(dot(normalize(normalMatrix * normal), normalize(-mv.xyz)));',
  '  gl_Position = projectionMatrix * mv;',
  '}',
].join('\n');
const FRAG = [
  'uniform sampler2D map; uniform sampler2D ring; uniform sampler2D swirl; uniform sampler2D warp;',
  'uniform vec2 size; uniform float open; uniform float swirlA; uniform float time; uniform float aspect;',
  'varying vec2 vUv; varying float vFacing;',
  'vec2 turn(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }',
  'void main() {',
  '  vec2 p = (vUv - 0.5) * 2.0;', // the oval fills the quad: 1 where it meets the quad's sides
  '  float a = atan(p.y, p.x * aspect);',
  '  float r = length(p);',
  '  float R = max(0.001, 0.62 * open * (1.0 + 0.02 * sin(a * 7.0 + time * 2.3)));',
  '  float face = smoothstep(0.12, 0.5, vFacing);',
  // the game's portal ring, its band centred on the bubble's edge, turning slowly
  '  vec4 rc = texture2D(ring, 0.5 + turn(p, time * 0.35) / R * 0.3);', // the ring's band just inside to well outside the edge
  // the seam, always drawn: a bright line on the edge in a soft blue glow, flickering a little along the rim as the game's portals do
  '  float e = abs(r - R);',
  '  float flick = 0.8 + 0.2 * sin(a * 13.0 - time * 5.0) * sin(a * 5.0 + time * 2.0);',
  '  float line = exp(-e * 90.0) * flick, glow = exp(-e * 16.0) * 0.55 * flick;',
  '  vec3 seamC = vec3(0.85, 0.97, 1.0) * line + vec3(0.35, 0.7, 1.0) * glow;',
  '  float seamA = clamp(line + glow, 0.0, 1.0) * face * min(1.0, open * 3.0);',
  '  vec3 ringC = rc.rgb * rc.a * face + seamC * face;',
  '  if (r > R) {',
  '    float aOut = max(rc.a * face * min(1.0, open * 3.0), seamA);',
  '    if (aOut < 0.02) discard;',
  '    gl_FragColor = vec4(rc.rgb * rc.a * 1.2 + seamC, aOut);',
  '    #include <colorspace_fragment>',
  '    return;',
  '  }',
  // inside: the far side, rippling with the game's distortion map toward the rim, a swirl while it opens, and the ring over it
  '  vec2 w = texture2D(warp, vUv * 1.3 + vec2(time * 0.02, time * 0.013)).rg - 0.5;',
  '  vec2 q = gl_FragCoord.xy + w * size.y * 0.035 * smoothstep(R * 0.45, R, r);',
  '  vec3 c = texture2D(map, q / size).rgb;',
  '  vec4 sw = texture2D(swirl, 0.5 + turn(p / R, -time * 2.5) * 0.5);',
  '  c = mix(c, vec3(0.55, 0.8, 1.0), clamp(sw.a * dot(sw.rgb, vec3(0.333)) * swirlA * 1.6, 0.0, 1.0));',
  '  gl_FragColor = vec4(c + ringC, smoothstep(0.04, 0.22, vFacing));', // edge-on it fades, never a streak of the far side
  '  #include <colorspace_fragment>',
  '}',
].join('\n');

const backOut = k => 1 + 2.2 * (k - 1) ** 3 + 1.2 * (k - 1) ** 2; // eases in with a little overshoot

// sky: () => the sky dome; who: () => the objects that are the character (figure, mount, shadow); art: path -> Promise<texture>
export function createStrip({ scene, cam, renderer, BLOCK, width = 90, length = 120, sky, who, art }) {
  const OPEN_D = 10 * BLOCK, // a pair opens when the character or the camera comes this near its edges ...
    CLOSE_D = 14 * BLOCK, // ... and closes once both are this far away again
    PW = 28 * BLOCK, // the bubble's quad (room round the bubble for the ring's glow): across and up
    PH = 20 * BLOCK,
    MID = PH * 0.3, // the bubble's middle above the ground (its bottom just reaches the ground)
    AX = ['x', 'z'];
  const P = [0, 0]; // the character's place on the lane: across (x) and along (z), in scene units
  let world = null,
    t = 0,
    camGap = Infinity,
    lastY = 0; // how high the camera was last frame
  const size = new THREE.Vector2(),
    plane = new THREE.Plane(),
    plane2 = new THREE.Plane(),
    V = new THREE.Vector3(),
    N = new THREE.Vector3(),
    tex = (bytes, w = 1) => {
      const d = new THREE.DataTexture(new Uint8Array(bytes), w, 1);
      d.needsUpdate = true;
      return d;
    },
    uniforms = { ring: { value: tex([0, 0, 0, 0]) }, swirl: { value: tex([0, 0, 0, 0]) }, warp: { value: tex([128, 128, 128, 255]) } };
  // the game's own portal art, from the player's files (the bubble works without it, plainer)
  for (const [k, path] of [
    ['ring', 'Particles/Textures/Circles/Portal_Blue.png'],
    ['swirl', 'Particles/Textures/Circles/Portal_Wind_Hollow.png'],
    ['warp', 'Particles/Textures/Circles/Portal_Round_Distortion.png'],
  ])
    art(path)
      .then(tx => {
        tx.wrapS = tx.wrapT = k === 'warp' ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
        tx.colorSpace = k === 'warp' ? THREE.NoColorSpace : THREE.SRGBColorSpace;
        tx.needsUpdate = true;
        uniforms[k].value = tx;
      })
      .catch(() => {});
  const shader = map =>
    new THREE.ShaderMaterial({
      uniforms: {
        ...uniforms,
        map: { value: map },
        size: { value: size },
        open: { value: 0 },
        swirlA: { value: 0 },
        time: { value: 0 },
        aspect: { value: PW / PH },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      vertexShader: VERT,
      fragmentShader: FRAG,
    });
  const geo = new THREE.PlaneGeometry(PW, PH);
  // one portal of a pair: axis i (0: the lane's left (s -1) and right (s 1) edges; 1: its back and front ends). Through the one at
  // side s is the land moved s lane-widths (or lane-lengths) over. Its bubble stands where the character is along the edge.
  const portal = (i, s) => {
    const rt = new THREE.WebGLRenderTarget(4, 4, { samples: 4 }),
      mat = shader(rt.texture),
      mesh = new THREE.Mesh(geo, mat);
    const place = m => {
      m.rotation.y = i ? 0 : Math.PI / 2; // facing across its edge
      m.visible = false;
      m.frustumCulled = false;
      scene.add(m);
      return m;
    };
    place(mesh).renderOrder = 5;
    // the doorway seen again through itself: a bubble a lane further on showing the view two lanes over (rt2), and inside that one a
    // last bubble a lane further still, which shows only its seam over the deeper picture (the repeat stops there)
    const rt2 = new THREE.WebGLRenderTarget(4, 4, { samples: 4 }),
      nest = [rt2, rt].map(r => place(new THREE.Mesh(geo, shader(r.texture))));
    return { i, s, rt, rt2, mat, mesh, nest, want: false, o: 0, shownR: 0 };
  };
  // each pair: its half size and lane span, whether it is wanted open and how far open, and the camera's crossing state
  const LEN = length * BLOCK;
  const axes = [width].map((w, i) => ({
    i,
    half: (w / 2) * BLOCK,
    span: w * BLOCK,
    behind: 0, // -1 / 1: the camera went past that edge without going through, and is behind its portal
    through: 0, // -1 / 1: the character has gone through that edge's portal (the camera, following, will too)
    last: 0, // where on this axis the camera was last frame ...
    lastU: 0, // ... and where along the edge, relative to the character
    pair: [-1, 1].map(s => portal(i, s)),
  }));
  const all = axes.flatMap(a => a.pair);
  // the part of the screen a bubble covers, in pixels of the drawing buffer (null when off screen), so its view is drawn only there
  const box = mesh => {
    let x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;
    for (const [u, v] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      V.set(u * PW * 0.5, v * PH * 0.5, 0)
        .applyMatrix4(mesh.matrixWorld)
        .project(cam);
      if (V.z > 1) return [0, 0, size.x, size.y];
      x0 = Math.min(x0, V.x);
      y0 = Math.min(y0, V.y);
      x1 = Math.max(x1, V.x);
      y1 = Math.max(y1, V.y);
    }
    if (x1 < -1 || x0 > 1 || y1 < -1 || y0 > 1) return null;
    const a = Math.max(0, Math.floor(((x0 + 1) / 2) * size.x) - 2),
      b = Math.max(0, Math.floor(((y0 + 1) / 2) * size.y) - 2);
    return [
      a,
      b,
      Math.min(size.x, Math.ceil(((x1 + 1) / 2) * size.x) + 2) - a,
      Math.min(size.y, Math.ceil(((y1 + 1) / 2) * size.y) + 2) - b,
    ];
  };
  const only = keep => {
    const shown = scene.children.map(c => c.visible);
    scene.children.forEach(c => (c.visible = !!((keep.includes(c) || c.isLight) && c.visible))); // lights stay, or what is drawn is black
    return () => scene.children.forEach((c, i) => (c.visible = shown[i]));
  };
  // is a point (scene units; u along the edge from the bubble's middle) inside the open bubble, as seen square on?
  const inBubble = (y, u, r) => Math.hypot(u / (PW / 2), (y - MID) / (PH / 2)) < r * 0.95;
  const camAt = () => [cam.position.x, cam.position.z]; // the camera, relative to the character

  return {
    attach(w) {
      world = w;
      P[0] = P[1] = 0;
      const c = camAt();
      for (const a of axes) Object.assign(a, { behind: 0, through: 0, last: c[a.i], lastU: c[1 - a.i] });
      for (const p of all) Object.assign(p, { want: false, o: 0, shownR: 0 });
      lastY = cam.position.y;
      if (world) world.position.set(0, 0, 0);
    },
    step(dt, vx, vz) {
      t += dt;
      if (!world) return;
      P[0] += vx * dt;
      P[1] += vz * dt;
      // along the lane: past its end the character is at its start (the land there is the same, so nothing shows)
      if (Math.abs(P[1]) > LEN / 2) P[1] -= Math.sign(P[1]) * LEN;
      const c = camAt();
      camGap = Infinity;
      for (const a of axes) {
        const i = a.i,
          was = a.last,
          side = s => a.pair[s < 0 ? 0 : 1];
        // going across at edge s: everything moves a lane over, and the portal the character comes out of is as open as the one it
        // went into (they are one doorway)
        const across = s => {
          P[i] -= s * a.span;
          const from = side(s),
            to = side(-s);
          to.o = Math.max(to.o, from.o);
          to.want = true;
        };
        let ca = P[i] + c[i];
        // the camera past an edge: following the character, or through the open bubble, it carries everything across; anywhere else
        // it is only behind that portal
        for (const s of [-1, 1]) {
          const past = s * ca > a.half,
            wasPast = s * was > a.half,
            charPast = s * P[i] > a.half;
          if (charPast && !a.through && a.behind !== s)
            a.through = s; // the character has stepped through
          else if (!charPast && a.through === s) a.through = 0; // ... and back
          if (a.behind === s) {
            if (!past) a.behind = 0; // back in front of it
          } else if (a.behind === 0 && past && a.through === s) {
            across(s); // following the character through
            a.through = 0;
          } else if (a.behind === 0 && past) {
            // where on its way the camera met the edge's line: through the bubble, or beside it
            const f = wasPast ? 1 : (s * a.half - was) / (ca - was || 1),
              y = lastY + (cam.position.y - lastY) * f,
              u = a.lastU + (c[1 - i] - a.lastU) * f,
              p = side(s);
            if (!wasPast && !(p.o > 0.6 && inBubble(y, u, p.shownR))) a.behind = s;
            else across(s);
          }
        }
        ca = P[i] + c[i];
        a.last = ca;
        a.lastU = c[1 - i];
        for (const p of a.pair) {
          // each portal opens when the character or camera comes near its own edge, and shuts once both are well away from it (never
          // half open by distance; the one across the lane stays shut, so no far ring hangs over the land)
          const near = Math.min(a.half - p.s * ca, a.half - p.s * P[i]);
          if (near < OPEN_D || a.behind === p.s) p.want = true;
          else if (near > CLOSE_D) p.want = false;
          p.o = Math.max(0, Math.min(1, p.o + (p.want ? dt / 0.75 : -dt / 0.4)));
          // a moment's flicker, then a swirl as it opens from the middle with a little overshoot
          const k = Math.max(0, (p.o - 0.15) / 0.85),
            open = p.o <= 0 ? 0 : p.o < 0.15 ? 0.05 + 0.04 * Math.sin(t * 55) : backOut(k);
          p.shownR = 0.62 * open;
          const u = p.mat.uniforms;
          u.open.value = open;
          u.swirlA.value = p.o > 0 ? 1 - Math.min(1, Math.max(0, (p.o - 0.35) / 0.55)) : 0;
          u.time.value = t;
          p.mesh.visible = p.o > 0;
          p.mesh.position.set(0, MID, 0);
          p.mesh.position[AX[i]] = p.s * a.half - P[i];
          for (const m of p.nest) for (const key of ['open', 'swirlA', 'time']) m.material.uniforms[key].value = u[key].value;
          if (p.o > 0) camGap = Math.min(camGap, a.half - p.s * ca);
        }
      }
      lastY = cam.position.y;
      world.position.set(-P[0], 0, -P[1]);
    },
    // before the frame is drawn: the view through each open portal, drawn into a picture the bubble shows. It is the scene with the land
    // moved a lane over, cut at the portal so only what lies beyond it shows. From in front (the lane side) the character shows there
    // too, where the lane puts it; from behind, the bubble shows the land beyond the other edge and hides what stands behind it
    before() {
      const shown = all.filter(p => p.mesh.visible);
      if (!world || !shown.length) return;
      renderer.getDrawingBufferSize(size);
      const before = renderer.getRenderTarget(),
        clip = renderer.clippingPlanes,
        auto = renderer.autoClear,
        s = sky(),
        me = who().filter(Boolean);
      scene.updateMatrixWorld();
      const boxes = shown.map(p => box(p.mesh));
      shown.forEach(p => (p.mesh.visible = false));
      renderer.autoClear = false;
      // the view k lanes over through the portal at X (scene units on its axis), into rt within the box b: the sky whole, then the land
      // and the characters (from in front: the one crossing over and its repeats a lane apart) cut at the portal
      const view = (p, k, X, rt, b, front) => {
        const ax = AX[p.i],
          ci = p.i ? 2 : 0,
          step = p.s * axes[p.i].span,
          camSide = Math.sign(cam.position[ax] - X) || 1;
        plane.set(N.set(0, 0, 0).setComponent(ci, -camSide), camSide * X);
        renderer.setRenderTarget(rt);
        renderer.setScissor(b[0], b[1], b[2], b[3]);
        renderer.clear();
        world.position[ax] += k * step;
        if (s) {
          const back = only([s]);
          renderer.clippingPlanes = [];
          renderer.render(scene, cam);
          back();
        }
        const hide = only(scene.children.filter(c => c !== s && !me.includes(c)));
        renderer.clippingPlanes = [plane];
        renderer.render(scene, cam);
        hide();
        if (front && me.length) {
          // each repeat of the character shows only between this portal and the next one on (beyond that it is the next view's)
          plane2.set(N.set(0, 0, 0).setComponent(ci, camSide), -camSide * (X + step));
          renderer.clippingPlanes = [plane, plane2];
          const back = only(me);
          for (let j = 0; j <= k; j++) {
            me.forEach(c => (c.position[ax] += j * step));
            renderer.render(scene, cam);
            me.forEach(c => (c.position[ax] -= j * step));
          }
          back();
        }
        world.position[ax] -= k * step;
      };
      // a nested bubble drawn into rt over what is there, hidden behind whatever stands in front of it
      const overlay = (m, rt) => {
        renderer.setRenderTarget(rt);
        renderer.clippingPlanes = [];
        m.visible = true;
        const back = only([m]);
        renderer.render(scene, cam);
        back();
        m.visible = false;
      };
      renderer.setScissorTest(true);
      shown.forEach((p, n) => {
        const b = boxes[n];
        if (!b) return;
        for (const r of [p.rt, p.rt2]) if (r.width !== size.x || r.height !== size.y) r.setSize(size.x, size.y);
        const ax = AX[p.i],
          X0 = p.mesh.position[ax],
          front = (Math.sign(cam.position[ax] - X0) || 1) === -p.s; // the camera is on the lane's side of this portal
        view(p, 1, X0, p.rt, b, front);
        if (!front) return;
        // the doorway again, a lane further on, with the view two lanes over in it; and a lane further still, its seam only
        const [n2, n3] = p.nest;
        for (const [m, d] of [
          [n2, 1],
          [n3, 2],
        ]) {
          m.position.copy(p.mesh.position);
          m.position[ax] += d * p.s * axes[p.i].span;
          m.updateMatrixWorld();
        }
        const b2 = box(n2);
        if (!b2) return;
        view(p, 2, n2.position[ax], p.rt2, b2, true);
        overlay(n3, p.rt2);
        renderer.setScissor(b2[0], b2[1], b2[2], b2[3]);
        overlay(n2, p.rt);
      });
      renderer.setScissorTest(false);
      renderer.clippingPlanes = clip;
      renderer.autoClear = auto;
      renderer.setRenderTarget(before);
      shown.forEach(p => (p.mesh.visible = true));
    },
    // after the frame: the character again a lane ahead and a lane behind (and two), standing in the frame's own depth
    after() {
      const me = world ? who().filter(Boolean) : [];
      if (!me.length) return;
      const auto = renderer.autoClear,
        shadows = renderer.shadowMap.autoUpdate,
        back = only(me);
      renderer.autoClear = false;
      renderer.shadowMap.autoUpdate = false;
      for (const k of [-2, -1, 1, 2]) {
        me.forEach(c => (c.position.z += k * LEN));
        renderer.render(scene, cam);
        me.forEach(c => (c.position.z -= k * LEN));
      }
      back();
      renderer.autoClear = auto;
      renderer.shadowMap.autoUpdate = shadows;
    },
    // the camera's near cut must stay closer than the portal, or the bubble is cut away just as the camera reaches it
    nearCap: () => Math.max(0.5, camGap * 0.5),
    where: () => [P[0] / BLOCK, P[1] / BLOCK],
    state: () => ({
      behind: axes[0].behind,
      open: axes[0].pair.map(p => +p.o.toFixed(2)),
    }),
  };
}
