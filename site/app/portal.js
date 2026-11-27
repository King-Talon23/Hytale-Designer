// The strip (a prototype, on local test pages with ?strip): the character walks a straight flat lane through the biome's land, the land
// moving with the walk, and at the lane's left and right edges a pair of frameless portals opens as the character comes near either
// edge. The two are one doorway: through the near one is the far edge of the lane, and across the lane the far one shows the near
// edge, with the character standing there. Through either the character sees itself, a lane's width away, as the lane really joins.
// Walking into one carries the character out of the other without a seam.
import * as THREE from '../vendor/three.module.min.js';

const ring = (a, b, t) => (t <= a ? 0 : t >= b ? 1 : ((t - a) / (b - a)) ** 2 * (3 - 2 * ((t - a) / (b - a))));

const VERT = [
  'varying vec2 vUv; varying float vFacing;',
  'void main() {',
  '  vUv = uv;',
  '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
  // how squarely the camera looks at the bubble: seen edge-on, its rim fades so it never shows as a line standing in the field
  '  vFacing = abs(dot(normalize(normalMatrix * normal), normalize(-mv.xyz)));',
  '  gl_Position = projectionMatrix * mv;',
  '}',
].join('\n');
const FRAG = [
  'uniform sampler2D map; uniform vec2 size; uniform float open; uniform float time; uniform float aspect; varying vec2 vUv; varying float vFacing;',
  'void main() {',
  // an oval bubble that opens from its middle; its rim wobbles a little, like a surface settling
  '  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;',
  '  float a = atan(p.y, p.x);',
  '  float r = length(p) / (0.5 * (aspect + 1.0));',
  '  float edge = open * (1.0 + 0.025 * sin(a * 7.0 + time * 2.3) + 0.018 * sin(a * 13.0 - time * 3.1));',
  '  if (r > edge) discard;',
  '  vec4 c = texture2D(map, gl_FragCoord.xy / size);',
  // a faint bright line just inside the rim, so the opening reads as a surface and not a hole in the picture
  '  float rim = smoothstep(edge - 0.035, edge, r) * (1.0 - smoothstep(edge - 0.008, edge, r));',
  '  gl_FragColor = vec4(mix(c.rgb, vec3(0.85, 0.9, 1.0), rim * 0.55 * smoothstep(0.2, 0.6, vFacing)), 1.0);',
  '  #include <colorspace_fragment>',
  '}',
].join('\n');

// sky: () => the sky dome (drawn whole in a portal's view); who: () => the objects that are the character (figure, its mount, its
// shadow), drawn again where the lane puts the character on the far side
export function createStrip({ scene, cam, renderer, BLOCK, width = 90, sky, who }) {
  const half = (width / 2) * BLOCK,
    span = width * BLOCK,
    OPEN_AT = 16 * BLOCK, // the portals start to open when the character or camera is this near an edge ...
    FULL_AT = 6 * BLOCK, // ... and are fully open from here
    PW = 22 * BLOCK, // the bubble: across (along the lane) and up
    PH = 16 * BLOCK;
  let px = 0,
    pz = 0,
    world = null,
    t = 0,
    camGap = Infinity; // how far the camera is from the nearer open portal
  const size = new THREE.Vector2(),
    plane = new THREE.Plane(),
    V = new THREE.Vector3(),
    // the pair: s -1 at the lane's left edge, 1 at its right. Through the one at edge s is the lane from its other edge: the land
    // moved s lanes over
    portals = [-1, 1].map(s => {
      const rt = new THREE.WebGLRenderTarget(4, 4, { samples: 4 }),
        mat = new THREE.ShaderMaterial({
          uniforms: {
            map: { value: rt.texture },
            size: { value: size },
            open: { value: 0 },
            time: { value: 0 },
            aspect: { value: PW / PH },
          },
          transparent: true,
          side: THREE.DoubleSide,
          vertexShader: VERT,
          fragmentShader: FRAG,
        }),
        mesh = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), mat);
      mesh.rotation.y = Math.PI / 2; // faces along the x axis, across the lane
      mesh.visible = false;
      mesh.frustumCulled = false;
      scene.add(mesh);
      return { s, rt, mat, mesh };
    });
  // the part of the screen a bubble covers, in pixels of the drawing buffer (null when it is off screen), so its view is drawn only there
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
      if (V.z > 1) return [0, 0, size.x, size.y]; // a corner behind the camera: the whole screen
      x0 = Math.min(x0, V.x);
      y0 = Math.min(y0, V.y);
      x1 = Math.max(x1, V.x);
      y1 = Math.max(y1, V.y);
    }
    if (x1 < -1 || x0 > 1 || y1 < -1 || y0 > 1) return null;
    const px0 = Math.max(0, Math.floor(((x0 + 1) / 2) * size.x) - 2),
      py0 = Math.max(0, Math.floor(((y0 + 1) / 2) * size.y) - 2),
      px1 = Math.min(size.x, Math.ceil(((x1 + 1) / 2) * size.x) + 2),
      py1 = Math.min(size.y, Math.ceil(((y1 + 1) / 2) * size.y) + 2);
    return [px0, py0, px1 - px0, py1 - py0];
  };
  const only = keep => {
    const shown = scene.children.map(o => o.visible);
    scene.children.forEach(o => (o.visible = keep.includes(o) && o.visible));
    return () => scene.children.forEach((o, i) => (o.visible = shown[i]));
  };

  return {
    attach(w) {
      world = w;
      px = 0;
      pz = 0;
      if (world) world.position.set(0, 0, 0);
    },
    // the walk: the land moves the other way. What crosses is the camera's view: when the camera reaches an edge, everything moves
    // across to the other edge together, so the picture never jumps (until then the character is seen walking on through the portal)
    step(dt, vx, vz) {
      t += dt;
      if (!world) return;
      px += vx * dt;
      pz += vz * dt;
      let cx = px + cam.position.x;
      if (cx < -half) px += span;
      else if (cx > half) px -= span;
      cx = px + cam.position.x;
      world.position.set(-px, 0, -pz);
      // the pair opens as far as the character or the camera is near either edge (or through it)
      const near = Math.min(half - Math.abs(cx), Math.min(px + half, half - px)),
        open = 1 - ring(FULL_AT, OPEN_AT, near);
      for (const p of portals) {
        p.mat.uniforms.open.value = open * 0.98;
        p.mat.uniforms.time.value = t;
        p.mesh.visible = open > 0.001;
        p.mesh.position.set(p.s * half - px, PH * 0.34, 0);
      }
      camGap = open > 0.001 ? half - Math.abs(cx) : Infinity;
    },
    // before the frame is drawn: the view through each open portal, drawn into a picture the bubble shows. It is the scene with the land
    // moved a lane's width over, cut at the portal so nothing on this side of it shows, and the character drawn once more where the
    // lane puts it on that side
    before() {
      if (!world || !portals[0].mesh.visible) return;
      renderer.getDrawingBufferSize(size);
      const before = renderer.getRenderTarget(),
        clip = renderer.clippingPlanes,
        auto = renderer.autoClear,
        s = sky(),
        me = who().filter(Boolean);
      scene.updateMatrixWorld();
      const boxes = portals.map(p => box(p.mesh));
      portals.forEach(p => (p.mesh.visible = false));
      renderer.autoClear = false;
      portals.forEach((p, i) => {
        const b = boxes[i];
        if (!b) return;
        if (p.rt.width !== size.x || p.rt.height !== size.y) p.rt.setSize(size.x, size.y);
        const X0 = p.mesh.position.x;
        p.s < 0 ? plane.set(new THREE.Vector3(-1, 0, 0), X0) : plane.set(new THREE.Vector3(1, 0, 0), -X0);
        renderer.setRenderTarget(p.rt);
        renderer.setScissorTest(true);
        renderer.setScissor(b[0], b[1], b[2], b[3]);
        renderer.clear();
        world.position.x += p.s * span;
        // the sky whole (it is all round, the cut would halve it), then everything else cut at the portal
        if (s) {
          const back = only([s]);
          renderer.clippingPlanes = [];
          renderer.render(scene, cam);
          back();
          s.visible = false;
        }
        renderer.clippingPlanes = [plane];
        renderer.render(scene, cam);
        if (s) s.visible = true;
        // the character a lane's width over: the one on this side of the doorway, as seen through it
        if (me.length) {
          const back = only(me);
          me.forEach(o => (o.position.x += p.s * span));
          renderer.render(scene, cam);
          me.forEach(o => (o.position.x -= p.s * span));
          back();
        }
        world.position.x -= p.s * span;
      });
      renderer.setScissorTest(false);
      renderer.clippingPlanes = clip;
      renderer.autoClear = auto;
      renderer.setRenderTarget(before);
      portals.forEach(p => (p.mesh.visible = true));
    },
    // the camera's near cut must stay closer than the portal, or the bubble is cut away just as the camera reaches it
    nearCap: () => Math.max(0.5, camGap * 0.5),
    where: () => [px / BLOCK, pz / BLOCK],
  };
}
