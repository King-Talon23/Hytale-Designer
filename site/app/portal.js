// The strip (a prototype, on local test pages with ?strip): the character walks a straight flat lane through the biome's land, the land
// moving with the walk, and at the lane's left and right edges a frameless portal opens as the character comes near. Through it is the
// other edge of the lane, drawn for real (the scene again, from where the walk would carry on); walking into it carries the character
// across to that edge without a seam.
import * as THREE from '../vendor/three.module.min.js';

const ring = (a, b, t) => (t <= a ? 0 : t >= b ? 1 : ((t - a) / (b - a)) ** 2 * (3 - 2 * ((t - a) / (b - a))));

export function createStrip({ scene, cam, renderer, BLOCK, width = 90, sky }) {
  const half = (width / 2) * BLOCK,
    span = width * BLOCK,
    OPEN_AT = 16 * BLOCK, // the portal starts to open this far from the edge ...
    FULL_AT = 6 * BLOCK, // ... and is fully open from here
    PW = 22 * BLOCK, // the bubble: across (along the lane) and up
    PH = 16 * BLOCK;
  let px = 0,
    pz = 0,
    world = null,
    t = 0;
  const size = new THREE.Vector2(),
    rt = new THREE.WebGLRenderTarget(4, 4, { samples: 4 });
  const mat = new THREE.ShaderMaterial({
    uniforms: { map: { value: rt.texture }, size: { value: size }, open: { value: 0 }, time: { value: 0 }, aspect: { value: PW / PH } },
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: [
      'varying vec2 vUv; varying float vFacing;',
      'void main() {',
      '  vUv = uv;',
      '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
      // how squarely the camera looks at the bubble: seen edge-on, its rim fades so it never shows as a line standing in the field
      '  vFacing = abs(dot(normalize(normalMatrix * normal), normalize(-mv.xyz)));',
      '  gl_Position = projectionMatrix * mv;',
      '}',
    ].join('\n'),
    fragmentShader: [
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
    ].join('\n'),
  });
  const portal = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), mat);
  portal.rotation.y = Math.PI / 2; // faces along the x axis, across the lane
  portal.visible = false;
  portal.frustumCulled = false;
  scene.add(portal);
  const plane = new THREE.Plane();
  let side = 0, // -1: the left edge's portal is open, 1: the right's, 0: none
    camGap = Infinity; // how far the camera is from the open portal

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
      // the portal at the edge nearer the camera, open as far as the camera or the character is close to it (or through it)
      side = cx < 0 ? -1 : 1;
      const dCam = half - Math.abs(cx),
        dChar = side < 0 ? px + half : half - px,
        open = 1 - ring(FULL_AT, OPEN_AT, Math.min(dCam, dChar));
      mat.uniforms.open.value = open * 0.98;
      mat.uniforms.time.value = t;
      portal.visible = open > 0.001;
      camGap = portal.visible ? dCam : Infinity;
      portal.position.set(side * half - px, PH * 0.34, 0);
    },
    // before the frame is drawn: the view through the open portal, drawn into a picture the bubble shows. It is the scene with the
    // land moved a lane's width over (where the walk would carry on), cut at the portal so nothing on this side of it shows
    before() {
      if (!portal.visible || !world) return;
      renderer.getDrawingBufferSize(size);
      if (rt.width !== size.x || rt.height !== size.y) rt.setSize(size.x, size.y);
      const X0 = portal.position.x,
        keep = side < 0 ? plane.set(new THREE.Vector3(-1, 0, 0), X0) : plane.set(new THREE.Vector3(1, 0, 0), -X0),
        before = renderer.getRenderTarget(),
        clip = renderer.clippingPlanes,
        auto = renderer.autoClear,
        s = sky();
      world.position.x += side < 0 ? -span : span;
      portal.visible = false;
      renderer.setRenderTarget(rt);
      renderer.autoClear = false;
      renderer.clear();
      // the sky whole (it is all round, the cut would halve it), then everything else cut at the portal
      if (s) {
        const shown = scene.children.map(o => o.visible);
        scene.children.forEach(o => (o.visible = o === s));
        renderer.clippingPlanes = [];
        renderer.render(scene, cam);
        scene.children.forEach((o, i) => (o.visible = shown[i]));
        s.visible = false;
      }
      renderer.clippingPlanes = [keep];
      renderer.render(scene, cam);
      if (s) s.visible = true;
      renderer.clippingPlanes = clip;
      renderer.autoClear = auto;
      renderer.setRenderTarget(before);
      world.position.x -= side < 0 ? -span : span;
      portal.visible = true;
    },
    // the camera's near cut must stay closer than the portal, or the bubble is cut away just as the camera reaches it
    nearCap: () => Math.max(0.5, camGap * 0.5),
    where: () => [px / BLOCK, pz / BLOCK],
  };
}
