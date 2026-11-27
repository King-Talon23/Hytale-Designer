# blockyblend.py: render a Hytale .blockymodel in Blender with soft light on a transparent background, the way the game's and good
# mods' UI art shows models (Memories portraits, item renders). Same box/UV rules as blockyrender.py (face offsets, mirror, angle).
# Run: blender -b -P blockyblend.py -- <config.json>   (copied from HyCreator live-tools; renders the wardrobe screen's art)
# config: {"model": path, "texture": path, "out": png, "width": px, "height": px, "pose": {"<node name>": {"yaw": deg}},
#          "extra": [{"name", "position":[x,y,z], "size":[x,y,z], "uv":{"<face>":[x,y]}}],   (more boxes, textured from the same sheet)
#          "camera": {"target":[x,y,z], "distance": u, "yaw": deg, "pitch": deg, "lens": mm, "ortho": units or 0},
#          "marks": {"name": [[x,y,z], ...]}, "samples": n, "no_model": true to draw only the extra boxes}
# Writes the picture and <out>.json with each mark projected to picture pixels (for laying UI over the render).
import bpy, sys, json, math
import numpy as np
from mathutils import Vector, Matrix, Quaternion

cfg = json.load(open(sys.argv[sys.argv.index('--') + 1], encoding='utf-8'))
S = 1 / 32                                          # 32 units = 1 block = 1 m

FACES = {'front': (2, 1, 0, 1, 1, -1), 'back': (2, -1, 0, -1, 1, -1), 'right': (0, 1, 2, -1, 1, -1),
         'left': (0, -1, 2, 1, 1, -1), 'top': (1, 1, 0, 1, 2, -1), 'bottom': (1, -1, 0, 1, 2, 1)}

def qmat(q):
    x, y, z, w = q.get('x', 0), q.get('y', 0), q.get('z', 0), q.get('w', 1)
    return np.array([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
                     [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
                     [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]])

def yawm(deg):
    a = math.radians(deg); c, s = math.cos(a), math.sin(a)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])

for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
img = bpy.data.images.load(cfg['texture']); TW, TH = img.size
mat = bpy.data.materials.new('tex'); mat.use_nodes = True
nt = mat.node_tree; bsdf = nt.nodes['Principled BSDF']; ti = nt.nodes.new('ShaderNodeTexImage'); ti.image = img; ti.interpolation = 'Closest'
nt.links.new(ti.outputs['Color'], bsdf.inputs['Base Color']); nt.links.new(ti.outputs['Alpha'], bsdf.inputs['Alpha'])
bsdf.inputs['Roughness'].default_value = 0.85
try: bsdf.inputs['Specular IOR Level'].default_value = 0.2
except KeyError: pass

verts, faces, uvs = [], [], []

def add_face(corners, uv4):
    i = len(verts); verts.extend(corners); faces.append((i, i + 1, i + 2, i + 3)); uvs.extend(uv4)

def box(size, stretch, off, lay, M, T, quad_normal=None):
    half = size / 2
    fs = FACES if quad_normal is None else {'front': FACES['front']}
    for fname, (na, ns, ua, us, va, vs) in fs.items():
        fl = lay.get(fname)
        if fl is None: continue
        fu, fv = size[ua], size[va]
        if fu <= 0 or fv <= 0: continue
        o = fl.get('offset', {}); ox, oy = o.get('x', 0), o.get('y', 0); mir = fl.get('mirror', {}); a = int(fl.get('angle', 0)) % 360
        cs, us4 = [], []
        for su, sv in ((0, 1), (1, 1), (1, 0), (0, 0)):         # counter-clockwise seen from outside
            g = np.zeros(3); g[na] = ns * half[na] if quad_normal is None else 0
            g[ua] = us * (su - 0.5) * size[ua]; g[va] = vs * (sv - 0.5) * size[va]
            if quad_normal is not None: g = quad_normal @ g
            g = g * stretch + off
            p = M @ g + T; cs.append((p[0] * S, -p[2] * S, p[1] * S))        # Hytale y up, z front -> Blender z up, -y front
            pu = su * fu * (-1 if mir.get('x') else 1); pv = sv * fv * (-1 if mir.get('y') else 1)
            X, Y = {0: (ox + pu, oy + pv), 90: (ox - pv, oy + pu), 180: (ox - pu, oy - pv), 270: (ox + pv, oy - pu)}[a]
            us4.append((X / TW, 1 - Y / TH))
        # a negative stretch turns the face inside out: keep it facing out
        if np.prod(np.sign(stretch)) < 0: cs.reverse(); us4.reverse()
        add_face(cs, us4)

marks_world = {}
def walk(n, M, T):
    p = n.get('position', {}); pos = np.array([p.get('x', 0), p.get('y', 0), p.get('z', 0)], float)
    R = qmat(n.get('orientation', {}))
    pose = cfg.get('pose', {}).get(n.get('name'), {})
    if 'yaw' in pose: R = R @ yawm(pose['yaw'])
    M2 = M @ R; T2 = T + M @ pos
    sh = n.get('shape') or {}
    if sh.get('visible', True) and sh.get('type') in ('box', 'quad'):
        sz = sh.get('settings', {}).get('size', {}); st = sh.get('stretch', {}); of = sh.get('offset', {})
        size = np.array([sz.get('x', 0), sz.get('y', 0), sz.get('z', 0)], float)
        stretch = np.array([st.get('x', 1), st.get('y', 1), st.get('z', 1)], float)
        off = np.array([of.get('x', 0), of.get('y', 0), of.get('z', 0)], float)
        lay = sh.get('textureLayout') or {}
        qn = None
        if sh['type'] == 'quad':
            size[2] = 0
            qn = {'+Z': np.eye(3), '-Z': qmat({'y': 1, 'w': 0}), '+Y': qmat({'x': -0.7071068, 'w': 0.7071068}), '-Y': qmat({'x': 0.7071068, 'w': 0.7071068}),
                  '+X': qmat({'y': 0.7071068, 'w': 0.7071068}), '-X': qmat({'y': -0.7071068, 'w': 0.7071068})}.get(sh.get('settings', {}).get('normal', '+Z'), np.eye(3))
        box(size, stretch, off, lay, M2, T2, qn)
    so = sh.get('offset', {}) or {}
    TC = T2 + M2 @ np.array([so.get('x', 0), so.get('y', 0), so.get('z', 0)], float)
    for k in n.get('children', []): walk(k, M2, TC)

m = json.load(open(cfg['model'], encoding='utf-8'))
if not cfg.get('no_model'):
    for n in m['nodes']: walk(n, np.eye(3), np.zeros(3))
for e in cfg.get('extra', []):
    lay = {f: {'offset': {'x': v[0], 'y': v[1]}, 'angle': v[2] if len(v) > 2 else 0} for f, v in e['uv'].items()}   # [x, y(, angle)]
    box(np.array(e['size'], float), np.ones(3), np.zeros(3), lay, np.eye(3), np.array(e['position'], float))

me = bpy.data.meshes.new('model'); me.from_pydata(verts, [], faces); me.update()
uvl = me.uv_layers.new()
for li, loop in enumerate(me.loops): uvl.data[li].uv = uvs[loop.vertex_index]
ob = bpy.data.objects.new('model', me); ob.data.materials.append(mat); bpy.context.scene.collection.objects.link(ob)

sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = cfg.get('samples', 96); sc.cycles.use_denoising = True; sc.cycles.device = 'CPU'
sc.render.film_transparent = True; sc.render.resolution_x = cfg['width']; sc.render.resolution_y = cfg['height']; sc.render.resolution_percentage = 100
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.55, 0.62, 0.78, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.55

def light(name, kind, energy, loc, rot, size, color):
    ld = bpy.data.lights.new(name, kind); ld.energy = energy; ld.color = color
    if kind == 'AREA': ld.size = size
    else: ld.angle = math.radians(size)
    lo = bpy.data.objects.new(name, ld); lo.location = loc; lo.rotation_euler = [math.radians(r) for r in rot]; sc.collection.objects.link(lo)
L = cfg.get('lights', {})
light('key', 'SUN', L.get('key', 3.2), (0, 0, 0), (52, 0, -28), 12, (1.0, 0.94, 0.84))
light('fill', 'SUN', L.get('fill', 0.9), (0, 0, 0), (70, 0, 40), 30, (0.75, 0.82, 1.0))
light('rim', 'SUN', L.get('rim', 1.2), (0, 0, 0), (120, 0, 180), 8, (1.0, 0.95, 0.9))

c = cfg['camera']; tgt = Vector((c['target'][0] * S, -c['target'][2] * S, c['target'][1] * S))
yaw, pitch = math.radians(c.get('yaw', 0)), math.radians(c.get('pitch', 0)); d = c['distance'] * S
camd = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', camd); sc.collection.objects.link(cam); sc.camera = cam
cam.location = tgt + Vector((d * math.sin(yaw) * math.cos(pitch), -d * math.cos(yaw) * math.cos(pitch), d * math.sin(pitch)))
cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
if c.get('ortho'): camd.type = 'ORTHO'; camd.ortho_scale = c['ortho'] * S
else: camd.lens = c.get('lens', 50)
bpy.context.view_layer.update()

from bpy_extras.object_utils import world_to_camera_view
proj = {}
for k, pts in cfg.get('marks', {}).items():
    proj[k] = []
    for p in pts:
        v = world_to_camera_view(sc, cam, Vector((p[0] * S, -p[2] * S, p[1] * S)))
        proj[k].append([round(v.x * cfg['width'], 1), round((1 - v.y) * cfg['height'], 1)])
json.dump(proj, open(cfg['out'] + '.json', 'w'), indent=1)
sc.render.filepath = cfg['out']; bpy.ops.render.render(write_still=True)
print('rendered', cfg['out'])
