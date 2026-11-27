// The far land of a background as meshes: the terrain worker's rings of columns (finer near the clearing, coarser further out) turned
// into one geometry per block face kind, the tile's trees as their own block models (hidden faces left out), and far trees as
// pictures of those models that turn to face the camera.
import * as THREE from '../vendor/three.module.min.js';

const BLOCK = 64;
export const LIFT = 0.004; // the land's tops sit a hair above the sliding clearing's, so the two never flicker where they overlap

let worker = null,
  seq = 0;
const waiting = new Map();
// the land's numbers, worked out in a worker
export function plan(msg) {
  if (!worker) {
    worker = new Worker(new URL('./terrain-worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = e => {
      const w = waiting.get(e.data.id);
      waiting.delete(e.data.id);
      if (w) e.data.error ? w[1](new Error(e.data.error)) : w[0](e.data);
    };
    worker.onerror = e => {
      for (const [, w] of waiting) w[1](new Error(e.message || 'terrain worker failed'));
      waiting.clear();
      worker = null;
    };
  }
  const id = ++seq;
  return new Promise((ok, no) => {
    waiting.set(id, [ok, no]);
    worker.postMessage({ ...msg, id });
  });
}

const repeat = mat => {
  for (const m of Array.isArray(mat) ? mat : [mat])
    if (m.map && m.map.wrapS !== THREE.RepeatWrapping) {
      m.map.wrapS = m.map.wrapT = THREE.RepeatWrapping;
      m.map.needsUpdate = true;
    }
  return mat;
};

// the land: the worker's faces ('Name|top|variant', 'Name|side', 'water', 'lava') as meshes on the blocks' own materials.
// parts(name) -> the block's [{ geo, mat }] (mat: [+x, -x, top, bottom, +z, -z] for a cube)
// data.copies (the strip): the faces are one lane length of land, laid again at each of these z offsets (blocks); the copies share
// the piece's geometry, each with its own column middles so the change-of-place wave still runs outward over them
export async function land(data, { parts, water, lava }) {
  const g = new THREE.Group(),
    copies = data.copies || [0];
  for (const [k, f] of Object.entries(data.faces)) {
    let mat = null;
    if (k === 'water') mat = water ? (await water())[0].mat : null;
    else if (k === 'lava') mat = lava ? (await lava())[0].mat : null;
    else {
      const [name, kind, v] = k.split('|'),
        p = await parts(name).catch(() => null);
      if (p && Array.isArray(p[0].mat)) mat = kind === 'top' ? p[+v % p.length].mat[2] : p[0].mat[0];
    }
    if (!mat) continue;
    const pos = new THREE.BufferAttribute(f.pos, 3),
      uv = new THREE.BufferAttribute(f.uv, 2),
      nor = new THREE.BufferAttribute(f.nor, 3, true);
    let sphere = null;
    for (const o of copies) {
      const geo = new THREE.BufferGeometry(),
        dz = o * BLOCK;
      let cell = f.cell;
      if (dz) {
        cell = new Float32Array(f.cell);
        for (let i = 1; i < cell.length; i += 2) cell[i] += dz;
      }
      geo.setAttribute('position', pos);
      geo.setAttribute('uv', uv);
      geo.setAttribute('normal', nor);
      geo.setAttribute('landC', new THREE.BufferAttribute(cell, 2));
      if (!sphere) geo.computeBoundingSphere(), (sphere = geo.boundingSphere);
      else geo.boundingSphere = sphere.clone();
      const m = new THREE.Mesh(geo, repeat(mat));
      m.position.z = dz;
      m.updateMatrix();
      m.matrixAutoUpdate = false;
      m.userData.ownGeo = true;
      m.userData.land = true;
      g.add(m);
    }
  }
  return g;
}

// ---- trees
const FACES = [
  // [normal, four corners (from the block's foot centre, in blocks), material slot]
  [
    [1, 0, 0],
    [
      [0.5, 0, 0.5],
      [0.5, 0, -0.5],
      [0.5, 1, -0.5],
      [0.5, 1, 0.5],
    ],
    0,
  ],
  [
    [-1, 0, 0],
    [
      [-0.5, 0, -0.5],
      [-0.5, 0, 0.5],
      [-0.5, 1, 0.5],
      [-0.5, 1, -0.5],
    ],
    1,
  ],
  [
    [0, 1, 0],
    [
      [-0.5, 1, 0.5],
      [0.5, 1, 0.5],
      [0.5, 1, -0.5],
      [-0.5, 1, -0.5],
    ],
    2,
  ],
  [
    [0, -1, 0],
    [
      [-0.5, 0, -0.5],
      [0.5, 0, -0.5],
      [0.5, 0, 0.5],
      [-0.5, 0, 0.5],
    ],
    3,
  ],
  [
    [0, 0, 1],
    [
      [-0.5, 0, 0.5],
      [0.5, 0, 0.5],
      [0.5, 1, 0.5],
      [-0.5, 1, 0.5],
    ],
    4,
  ],
  [
    [0, 0, -1],
    [
      [0.5, 0, -0.5],
      [-0.5, 0, -0.5],
      [-0.5, 1, -0.5],
      [0.5, 1, -0.5],
    ],
    5,
  ],
];
// one prefab as a single geometry with a group per material, standing on its trunk's foot; faces between two cubes left out
export async function treeModel(prefab, { parts, turnOf, known }) {
  const blocks = prefab.blocks.filter(b => known(b.name)),
    trunks = blocks.filter(b => /Trunk|Log|Stem|Wood/.test(b.name)),
    lift = trunks.length ? -Math.min(...trunks.map(b => b.y)) : -Math.min(0, ...blocks.map(b => b.y)),
    cubeAt = new Map(),
    list = await Promise.all(blocks.map(async b => ({ b, p: await parts(b.name).catch(() => null) })));
  for (const { b, p } of list) if (p && Array.isArray(p[0].mat)) cubeAt.set(b.x + ',' + (b.y + lift) + ',' + b.z, b.name);
  const byMat = new Map(),
    add = (mat, pos, nor, uv) => {
      let q = byMat.get(mat);
      if (!q) byMat.set(mat, (q = { pos: [], nor: [], uv: [] }));
      q.pos.push(...pos);
      q.nor.push(...nor);
      q.uv.push(...uv);
    },
    V = new THREE.Vector3(),
    N = new THREE.Vector3(),
    M = new THREE.Matrix4();
  let reach = 0,
    tall = 0;
  for (const { b, p } of list) {
    if (!p) continue;
    const y = b.y + lift,
      q = b.rotation ? turnOf(b.rotation) : null;
    reach = Math.max(reach, Math.hypot(b.x, b.z) + 0.5);
    tall = Math.max(tall, y + 1);
    if (Array.isArray(p[0].mat)) {
      const mats = p[0].mat;
      for (const [n, corners, slot] of FACES) {
        N.set(...n);
        if (q) N.applyQuaternion(q);
        const dx = Math.round(N.x),
          dy = Math.round(N.y),
          dz = Math.round(N.z),
          nb = cubeAt.get(b.x + dx + ',' + (y + dy) + ',' + (b.z + dz));
        if (nb) continue;
        const pos = [],
          nor = [];
        for (const c of [0, 1, 2, 0, 2, 3]) {
          V.set(corners[c][0], corners[c][1] - 0.5, corners[c][2]);
          if (q) V.applyQuaternion(q);
          pos.push((V.x + b.x) * BLOCK, (V.y + 0.5 + y) * BLOCK, (V.z + b.z) * BLOCK);
          nor.push(Math.round(N.x * 127), Math.round(N.y * 127), Math.round(N.z * 127));
        }
        add(mats[slot], pos, nor, [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]);
      }
    } else {
      // a block model: its own baked geometry, turned and moved into place
      const g = p[0].geo,
        P = g.attributes.position,
        U = g.attributes.uv,
        Nn = g.attributes.normal,
        I = g.index;
      M.makeRotationFromQuaternion(q || new THREE.Quaternion()).setPosition(b.x * BLOCK, y * BLOCK, b.z * BLOCK);
      const pos = [],
        nor = [],
        uv = [],
        count = I ? I.count : P.count;
      for (let t = 0; t < count; t++) {
        const ix = I ? I.getX(t) : t;
        V.fromBufferAttribute(P, ix).applyMatrix4(M);
        pos.push(V.x, V.y, V.z);
        N.fromBufferAttribute(Nn, ix);
        if (q) N.applyQuaternion(q);
        nor.push(Math.round(N.x * 127), Math.round(N.y * 127), Math.round(N.z * 127));
        uv.push(U.getX(ix), U.getY(ix));
      }
      add(p[0].mat, pos, nor, uv);
    }
  }
  const geo = new THREE.BufferGeometry(),
    mats = [],
    pos = [],
    nor = [],
    uv = [];
  for (const [mat, q] of byMat) {
    geo.addGroup(pos.length / 3, q.pos.length / 3, mats.length);
    mats.push(mat);
    pos.push(...q.pos);
    nor.push(...q.nor);
    uv.push(...q.uv);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Int8BufferAttribute(nor, 3, true));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return { geo, mats, reach, tall };
}

// a picture of a tree model from the side, lit as the stage is, on a see-through background
const LIGHT = (() => {
  const s = new THREE.Scene();
  s.add(new THREE.AmbientLight(0xffffff, 1.25));
  const l = new THREE.DirectionalLight(0xfff4e0, 2.9);
  l.position.set(30, 170, 140);
  s.add(l);
  return s;
})();
export function picture(renderer, model) {
  const bb = model.geo.boundingBox,
    w = 2 * Math.max(-bb.min.x, bb.max.x, -bb.min.z, bb.max.z) + BLOCK * 0.2,
    h = bb.max.y - Math.min(0, bb.min.y) + BLOCK * 0.2,
    px = 128,
    tw = Math.max(16, Math.min(256, Math.round((px * w) / h / 4) * 4)),
    rt = new THREE.WebGLRenderTarget(tw, px, { samples: 0 }),
    cam = new THREE.OrthographicCamera(-w / 2, w / 2, h, 0, 1, 40 * BLOCK),
    mesh = new THREE.Mesh(model.geo, model.mats);
  rt.texture.generateMipmaps = true;
  rt.texture.minFilter = THREE.LinearMipmapLinearFilter;
  rt.texture.magFilter = THREE.NearestFilter;
  mesh.position.set(0, -Math.min(0, bb.min.y) + BLOCK * 0.1, 0); // the trunk in the middle of the picture, as the picture turns round it
  cam.position.set(0, 0, 20 * BLOCK);
  cam.lookAt(0, 0, 0);
  LIGHT.add(mesh);
  const before = renderer.getRenderTarget(),
    clear = renderer.getClearAlpha(),
    col = renderer.getClearColor(new THREE.Color());
  renderer.setRenderTarget(rt);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  renderer.render(LIGHT, cam);
  renderer.setRenderTarget(before);
  renderer.setClearColor(col, clear);
  LIGHT.remove(mesh);
  return { rt, w, h, foot: Math.min(0, bb.min.y) - BLOCK * 0.1 };
}
// far trees: one flat picture per tree, standing on its foot and turned round the up axis to face the camera
export function billboards(pic, matrices) {
  const geo = new THREE.PlaneGeometry(pic.w, pic.h).translate(0, pic.h / 2 + pic.foot, 0),
    mat = new THREE.MeshBasicMaterial({ map: pic.rt.texture, alphaTest: 0.5, side: THREE.DoubleSide });
  mat.userData.billboard = true;
  mat.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace(
      '#include <project_vertex>',
      [
        'vec4 bbC = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);',
        'vec3 bbD = cameraPosition - bbC.xyz;',
        'bbD.y = 0.0;',
        'bbD = normalize(bbD + vec3(1e-4, 0.0, 0.0));',
        'float bbS = length(instanceMatrix[0].xyz);',
        'vec4 mvPosition = viewMatrix * vec4(bbC.xyz + vec3(bbD.z, 0.0, -bbD.x) * transformed.x * bbS + vec3(0.0, transformed.y * bbS, 0.0), 1.0);',
        'gl_Position = projectionMatrix * mvPosition;',
      ].join('\n')
    );
  };
  mat.customProgramCacheKey = () => 'billboard';
  const im = new THREE.InstancedMesh(geo, mat, matrices.length);
  matrices.forEach((m, i) => im.setMatrixAt(i, m));
  im.instanceMatrix.needsUpdate = true;
  im.frustumCulled = false;
  im.userData.own = true;
  im.userData.sharedPicture = true; // the picture itself is kept for the next time this tree is needed
  return im;
}
