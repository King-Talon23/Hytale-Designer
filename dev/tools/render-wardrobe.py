# Renders the in-game wardrobe screen's art (mod 1.4.0) from the game's own wardrobe models, doors swung open, in Blender with soft
# light on a transparent background: the wardrobe with two racks, the coat hanger a skin hangs on, and the page plaques (an arrow
# carved into a board of the wardrobe's own material, held by a bolt in each top corner; lighter while the pointer is on them).
# Lumberjack is the Designer Wardrobe's look (Wardrobe.ui, hand-kept); every other set in SETS gets its own art and a Wardrobe_<Set>.ui
# made from Wardrobe.ui with that art's numbers (the mod opens it from that vanilla wardrobe; keep SETS in step with Wardrobe.java).
# Writes name@2x.png into the mod's UI folder and prints the layout (UI units) of each set.
# python dev/tools/render-wardrobe.py [--set <Set>[,<Set>]] [--blender <blender.exe>] [--assets <Assets.zip>]
import json, os, subprocess, sys, tempfile, zipfile
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'mod', 'res', 'Common', 'UI', 'Custom', 'Pages', 'HytaleDesigner')
arg = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
BLENDER = arg('--blender', os.path.join(HERE, '..', '..', '..', 'tools', 'blender', 'blender-4.5.12-windows-x64', 'blender.exe'))
ASSETS = arg('--assets', os.path.join(os.environ.get('APPDATA', ''), 'Hytale', 'install', 'release', 'package', 'game', 'latest', 'Assets.zip'))
DOOR = 160                                           # how far the doors swing open: wide, so their insides (and the page plaques) face the player
ROW_UI, RACK_UI = 200, 470                           # one rack's row and five hangers of 94, in UI units
IN_H_UI = 402                                       # the interior's height on screen: two rows and the rails

# Each set: its interior (the inside face the skins hang in front of: x0, x1, top, bottom, face z, in model units), the doors, and texels
# picked from its own sheet: 'rail' [u, v, angle] for the rails (None: the model paints its own top rail), the plaque's 'board', 'rim'
# and 'cut' (functions of the plaque cell x, y) and 'bolt' faces. Lumberjack's numbers are the original art's.
BOLT = lambda u, v: {f: [u, v] for f in ('front', 'top', 'bottom', 'left', 'right')}   # a bolt all of one texel
LJ_BOLT = {'front': [57, 109], 'top': [51, 109], 'bottom': [51, 109], 'left': [51, 114], 'right': [51, 114]}
SETS = {
    'Lumberjack': {'interior': (-41, 8, 56.65, 18.65, 8), 'painted_rail': (53.65, 51.65), 'rail': [10, 5], 'doors': ('Door-R', 'Door-L'),
                   'door_mid': 37.5, 'door_z': 2, 'cam_lens': 133.8, 'cam_target': [-16, 36, 8], 'rack_x': 274,
                   'board': lambda x, y: (2 + x, 76 + y), 'rim': lambda x, y: (66 + x, 96 + y), 'cut': lambda x, y: (117 + x % 5, 118 + y % 4),
                   'bolt': LJ_BOLT},
    'Temple_Dark': {'interior': (-39.25, 7.25, 58.5, 25.5, 11.85), 'rail': [2, 1, 90], 'doors': ('Door-R', 'Door-L'), 'door_mid': 42, 'door_z': 2,
                    'board': lambda x, y: (64 + x, 68 + y), 'rim': lambda x, y: (1, 4), 'rim_cells': True,
                    'cut': lambda x, y: (66 + x % 5, 78 + y % 2), 'bolt': {'front': [1, 1], 'top': [1, 4], 'bottom': [1, 4], 'left': [1, 4], 'right': [1, 4]}},
    # sets whose sheet paints the top rail (Ancient, Human Ruins, Tavern, Village): the interior's top sits 3 Lumberjack units over it
    'Ancient': {'frame_w': 3200, 'interior': (-37, 5, 56.11, 23.11, 11.85), 'painted_rail': (53.51, 51.51), 'rail': [22, 10], 'doors': ('Door-R', 'Door-L'),
                'door_mid': (36.9, 43.5), 'door_z': 2, 'plaque_y': 36, 'plaque_dx': (-3, 3),
                'board': lambda x, y: (14 + x, 63 + y), 'rim': lambda x, y: (30, 10), 'rim_cells': True, 'cut': lambda x, y: (20, 20), 'bolt': BOLT(30, 10)},
    'Crude': {'interior': (-37, 4, 49.5, 17.5, 12), 'rail': [0, 112], 'doors': ('Door-R', 'Door-L'), 'door_mid': (33, 32.7), 'door_z': (2, 1.7), 'plaque_dx': (0, -7.5),
              'board': lambda x, y: (4 + x, 102 + y), 'rim': lambda x, y: (10, 112), 'rim_cells': True, 'cut': lambda x, y: (5, 32), 'bolt': BOLT(55, 88)},   # a dark plank nailed on
    'Desert': {'frame_w': 3200, 'interior': (-42.5, 9.5, 47.5, 18.5, 11), 'rail': [70, 17], 'doors': ('Door-R', 'Door-L'), 'door_mid': 32.5, 'door_z': 2,
               'board': lambda x, y: (96 + x, 14 + y), 'rim': lambda x, y: (10, 75), 'rim_cells': True, 'cut': lambda x, y: (10, 20), 'bolt': BOLT(10, 75)},
    'Feran': {'frame_w': 3200, 'interior': (-34, 2.5, 46, 17, 11), 'rail': [17, 82], 'doors': ('Door-R', 'Door-L'), 'door_mid': 32, 'door_z': 0,
              'plaque_y': 46.5,   # on the clear hide over the upper emblem
              'board': lambda x, y: (81 + (y - 1) * 5 // 8, 14 + (x - 1) * 16 // 15), 'board_cells': True,   # hide (a clean strip of the door pelt, turned)
              'rim': lambda x, y: (122, 22), 'rim_cells': True, 'cut': lambda x, y: (61, 9), 'bolt': BOLT(121, 20)},                    # in bone, the arrow burnt in
    'Frozen_Castle': {'interior': (-36.8, 5.3, 53, 20, 12), 'rail': [196, 1], 'doors': ('Door-R', 'Door-L'), 'door_mid': 31, 'door_z': 2,
                      'board': lambda x, y: (150 + x, 6 + y), 'rim': lambda x, y: (51, 20), 'rim_cells': True, 'cut': lambda x, y: (20, 20), 'bolt': BOLT(51, 20)},
    'Human_Ruins': {'frame_w': 3200, 'interior': (-41, 8, 56.84, 20.84, 12.5), 'painted_rail': (54, 52), 'rail': [22, 10], 'doors': ('Door-R', 'Door-L'), 'door_mid': 38, 'door_z': 2,
                    'board': lambda x, y: (2 + x, 68 + y), 'rim': lambda x, y: (61, 80), 'rim_cells': True, 'cut': lambda x, y: (20, 20), 'bolt': BOLT(61, 80)},
    'Jungle': {'frame_w': 3200, 'interior': (-38.5, 6, 60, 25, -14.77), 'rail': [10, 20, 90], 'doors': ('Door-R', 'Door-L'), 'door_mid': 35.51, 'door_z': 2,
               'board': lambda x, y: (89 + x, 30 + y), 'rim': lambda x, y: (10, 20), 'rim_cells': True, 'cut': lambda x, y: (58, 49), 'bolt': BOLT(10, 20)},
    'Kweebec': {'interior': (-35.5, 3.5, 43.5, 17.5, 1), 'rail': [66, 130], 'doors': ('Door-R', 'Door-L'), 'door_mid': 32.5, 'door_z': 0,
                'board': lambda x, y: (45 + x, 116 + y), 'rim': lambda x, y: (9, 10), 'rim_cells': True, 'cut': lambda x, y: (64, 57), 'bolt': BOLT(9, 10)},   # moss frame
    'Tavern': {'frame_w': 3200, 'interior': (-41, 8, 56.51, 18.51, 11.85), 'painted_rail': (53.51, 51.51), 'rail': [22, 10], 'doors': ('Door-R', 'Door-L'), 'door_mid': 33.51, 'door_z': 2,
               'board': lambda x, y: (2 + x, 64 + y), 'rim': lambda x, y: (118, 72), 'rim_cells': True, 'cut': lambda x, y: (20, 20), 'bolt': BOLT(118, 72)},
    'Temple_Emerald': {'frame_w': 3200, 'interior': (-39.25, 7.25, 55, 22, 13), 'rail': [1, 65], 'doors': ('Door-R', 'Door-L'), 'door_mid': 38.5, 'door_z': 2,
                       'board': lambda x, y: (100 + x, 20 + y), 'rim': lambda x, y: (10, 70), 'rim_cells': True, 'cut': lambda x, y: (10, 20), 'bolt': BOLT(10, 70)},
    'Temple_Light': {'frame_w': 3200, 'interior': (-38.9, 6.6, 60, 31, 10.14), 'rail': [14, 38], 'doors': ('Door-R', 'Door-L'), 'door_mid': 46.5, 'door_z': 2,
                     'board': lambda x, y: (10 + x, 40 + y), 'rim': lambda x, y: (40, 78), 'rim_cells': True, 'cut': lambda x, y: (20, 15), 'bolt': BOLT(40, 78)},
    'Village': {'frame_w': 3200, 'interior': (-41, 8, 56.18, 22.18, 12), 'painted_rail': (53.5, 51.5), 'rail': [22, 10], 'doors': ('Door-R', 'Door-L'), 'door_mid': 40.5, 'door_z': 2,
                'board': lambda x, y: (2 + x, 64 + y), 'rim': lambda x, y: (127, 80), 'rim_cells': True, 'cut': lambda x, y: (20, 20), 'bolt': BOLT(127, 80)},
    # a tall narrow wardrobe made wider (widen) so five hangers fit at a page height of about 1000
    'Royal_Magic': {'frame_w': 3200, 'interior': (-48, 12, 80, 32.7, 12), 'cam_target': [-18, 56, 12], 'doors': ('Door-R', 'Door-L'), 'door_mid': 52, 'door_z': 2,
                    'widen': {'by': 28, 'centre': -18, 'ops': {
                        **{n: {'how': 'stretch'} for n in ('Base', 'Bottom_Front_Face', 'Top_FrontFace', 'Back', 'Wardrobe#2', 'Wardrobe_Mid_Top#1')},
                        'Drawer': {'how': 'stretch', 'pieces': [[0, 3, 0], [3, 9, 1], [9, 19, 0], [19, 25, 1], [25, 28, 0]]},   # the handle keeps its size
                        'Door-L': {'how': 'grow_out', 'pieces': [[0, 4, 0], [4, 12, 1], [12, 16, 0]]},                         # gold corners kept
                        'Door-R': {'how': 'grow_out', 'pieces': [[0, 4, 0], [4, 12, 1], [12, 16, 0]]},
                        'Wardrobe_Top_Decor_L#1': {'how': 'grow_out'}, 'Wardrobe_Top_Decor_R#1': {'how': 'grow_out'}}},
                    'rail': [90, 100, 90], 'board': lambda x, y: (100 + x, 20 + y), 'rim': lambda x, y: (88, 120), 'rim_cells': True, 'cut': lambda x, y: (20, 72),
                    'bolt': BOLT(88, 120)},
    # two openings: the own rack in the small upper one ('own': x0, x1, top, face), the Locker rack in the lower one (the interior);
    # both door pairs open, the plaques go on the lower pair (the second nodes of those names)
    'Temple_Wind': {'frame_w': 3200, 'interior': (-40, 8, 25.3, 25.3 - 402 / 13.6, 13), 'own': (-35, 3, 55.3, 10), 'cam_target': [-16, 32, 12], 'rail': [92, 22],
                    'doors': ('Door-R#2', 'Door-L#2'), 'door_mid': 14, 'door_z': 2,
                    'board': lambda x, y: (100 + x, 79 + y), 'rim': lambda x, y: (93, 23), 'rim_cells': True, 'cut': lambda x, y: (20, 50), 'bolt': BOLT(93, 23)},
}
LJ = SETS['Lumberjack']['interior']
LJ_SCALE = IN_H_UI / (LJ[2] - LJ[3])                 # UI units per model unit in the Lumberjack art (the hanger and plaque sizes are set there)

def glow(name, peak, w=127, h=150):
    # soft warm light behind a hanging skin (worn: strong, pointer on it: faint), smooth like the game's own glows
    import math
    im = Image.new('RGBA', (w, h)); px = im.load()
    for y in range(h):
        for x in range(w):
            d = math.hypot((x - w / 2) / (w / 2), (y - h * 0.45) / (h * 0.475))
            px[x, y] = (255, 200, 110, int(max(0.0, 1 - d) ** 2 * peak * 255))
    im.save(os.path.join(OUT, name + '@2x.png'), optimize=True)

def star(name, size=16):
    # the mark on a starred skin's hanger: a gold five-point star, smooth, with a dark rim so it reads on any picture
    from PIL import ImageDraw
    import math
    k = 16; S = size * 2 * k; big = Image.new('RGBA', (S, S)); d = ImageDraw.Draw(big)
    pts = [(S / 2 + (S * (0.48 if i % 2 == 0 else 0.2)) * math.sin(i * math.pi / 5), S * 0.53 - (S * (0.48 if i % 2 == 0 else 0.2)) * math.cos(i * math.pi / 5)) for i in range(10)]
    d.polygon(pts, fill=(58, 36, 12, 255))
    inner = [(S / 2 + (x - S / 2) * 0.78, S * 0.53 + (y - S * 0.53) * 0.78) for x, y in pts]
    d.polygon(inner, fill=(232, 169, 59, 255))
    big.resize((size * 2, size * 2), Image.LANCZOS).save(os.path.join(OUT, name + '@2x.png'), optimize=True)

star('Star'); glow('WornGlow', 0.75, 104, 150); glow('HoverGlow', 0.25, 104, 200)
if '--glow-only' in sys.argv: sys.exit()
WHICH = arg('--set', ','.join(SETS)).split(',')
tmp = tempfile.mkdtemp()
z = zipfile.ZipFile(ASSETS)


def sheet(name):
    src = 'Common/Blocks/Decorative_Sets/' + name + '/'
    for n in ('Wardrobe.blockymodel', 'Wardrobe_Texture.png'):
        open(os.path.join(tmp, name + '_' + n), 'wb').write(z.read(src + n))
    return os.path.join(tmp, name + '_Wardrobe.blockymodel'), os.path.join(tmp, name + '_Wardrobe_Texture.png')


def widen(model, w):
    # makes a narrow wardrobe wider before it is drawn (w: 'by' model units, about world x 'centre'): what lies on one side of the
    # centre moves out by half of it; the nodes in 'ops' grow instead. 'stretch': the box grows evenly about its centre (a plain middle
    # part: back, top and bottom boards); 'grow_out': its inner edge stays and its outer edge moves out (a door from the centre to its
    # hinge, a trim bar), its children keeping their distance to the nearer edge. 'pieces' [[a, b, grow], ...] cut a box along x by
    # its texture (0..size x): only pieces with grow true stretch, so edge trims and ornaments keep their true size and shape.
    # A node is named 'Name' or 'Name#n' (its n-th occurrence in the file). Writes the model back in place.
    m = json.load(open(model, encoding='utf-8')); by, cx, ops = w['by'], w['centre'], w.get('ops', {})
    seen, ids = {}, {}

    def number(n):                                      # every node's 'Name#n', in file order
        nm = n.get('name', ''); seen[nm] = seen.get(nm, 0) + 1; ids[id(n)] = '%s#%d' % (nm, seen[nm])
        for k in n.get('children', []): number(k)
    for n in m['nodes']: number(n)

    def rot(q):
        x, y, z, s_ = q.get('x', 0), q.get('y', 0), q.get('z', 0), q.get('w', 1)
        return [[1 - 2 * (y * y + z * z), 2 * (x * y - z * s_), 2 * (x * z + y * s_)], [2 * (x * y + z * s_), 1 - 2 * (x * x + z * z), 2 * (y * z - x * s_)],
                [2 * (x * z - y * s_), 2 * (y * z + x * s_), 1 - 2 * (x * x + y * y)]]
    mul = lambda A, B: [[sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    app = lambda A, v: [sum(A[i][k] * v[k] for k in range(3)) for i in range(3)]
    xyz = lambda d: [(d or {}).get(k, 0) for k in 'xyz']

    def pieces(n, sh, cuts, Wn):
        # cut the box into child boxes along its x; each keeps its part of every face's picture (angle 0 faces only)
        size = sh['settings']['size']; sx = size['x']; st = dict(sh.get('stretch') or {'x': 1, 'y': 1, 'z': 1})
        keep = sum(b - a for a, b, g in cuts if not g); grow = sum(b - a for a, b, g in cuts if g)
        f = (Wn / abs(st['x']) - keep) / grow; cum = 0; tot = keep + grow * f; kids = []
        for a, b, g in cuts:
            wd = b - a; fw = f if g else 1; pc = (a + b) / 2 - sx / 2; xc = cum + wd * fw / 2 - tot / 2; cum += wd * fw
            lay = {}
            for face, us in (('front', 1), ('back', -1), ('top', 1), ('bottom', 1), ('left', 0), ('right', 0)):
                fl = (sh.get('textureLayout') or {}).get(face)
                if fl is None or (face == 'left' and a > 0) or (face == 'right' and b < sx): continue
                fl = json.loads(json.dumps(fl))
                if us:
                    assert int(fl.get('angle', 0)) % 360 == 0, 'widen pieces: only angle-0 faces'
                    sg = -1 if (fl.get('mirror') or {}).get('x') else 1
                    fl['offset']['x'] = fl['offset'].get('x', 0) + sg * (us * pc + sx / 2 - wd / 2)
                lay[face] = fl
            kids.append({'name': n.get('name', '') + '-piece', 'position': {'x': st['x'] * xc, 'y': 0, 'z': 0}, 'orientation': {'x': 0, 'y': 0, 'z': 0, 'w': 1},
                         'shape': {'type': 'box', 'offset': {'x': 0, 'y': 0, 'z': 0}, 'stretch': {'x': st['x'] * fw, 'y': st.get('y', 1), 'z': st.get('z', 1)},
                                   'settings': {'size': {'x': wd, 'y': size['y'], 'z': size['z']}}, 'textureLayout': lay, 'visible': True}, 'children': []})
        sh['visible'] = False; n.setdefault('children', []).extend(kids)

    def walk(n, M, T):
        R = mul(M, rot(n.get('orientation') or {})); T2 = [a + b for a, b in zip(T, app(M, xyz(n.get('position'))))]
        sh = n.get('shape') or {}; sz = (sh.get('settings') or {}).get('size')
        if not sz or sh.get('type') not in ('box', 'quad'):
            for k in n.get('children', []): walk(k, R, T2)
            return
        op = ops.get(ids[id(n)]) or (ops.get(n.get('name', '')) if ids[id(n)].endswith('#1') else None)
        c = [a + b for a, b in zip(T2, app(R, xyz(sh.get('offset'))))][0]        # the box's centre, world x
        side = 1 if c > cx else -1
        if not op:
            if abs(c - cx) > 1: n.setdefault('position', {})['x'] = n.get('position', {}).get('x', 0) + side * by / 2   # parents are not turned
            else:
                for k in n.get('children', []): walk(k, R, T2)
            return
        st = sh.setdefault('stretch', {'x': 1, 'y': 1, 'z': 1}); off = sh.setdefault('offset', {'x': 0, 'y': 0, 'z': 0})
        ax = max(range(3), key=lambda i: abs(R[0][i])); key = 'xyz'[ax]; W = sz[key] * abs(st.get(key, 1))
        if op['how'] == 'stretch':
            Wn = W + by
            if op.get('pieces'): pieces(n, sh, op['pieces'], Wn)
            else: st[key] = st.get(key, 1) * Wn / W
            dx = by / 2
        else:                                           # grow_out: unturned boxes along x only
            assert ax == 0
            Wn = W + by / 2; pos = n.setdefault('position', {}); p0 = pos.get('x', 0); bc = p0 + off.get('x', 0)
            inner = bc - side * W / 2; rel = (p0 - inner) * side / W
            pos['x'] = inner + side * rel * Wn; off['x'] = (bc + side * by / 4) - pos['x']
            if op.get('pieces'): pieces(n, sh, op['pieces'], Wn)
            else: st['x'] = st.get('x', 1) * Wn / W
            dx = by / 4
        for k in n.get('children', []):                 # children stay by their nearer edge
            if k.get('name', '').endswith('-piece'): continue
            kp = k.setdefault('position', {}); x = kp.get('x', 0)
            if abs(x) > 0.01: kp['x'] = x + (1 if x > 0 else -1) * dx
    for n in m['nodes']: walk(n, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0, 0, 0])
    json.dump(m, open(model, 'w', encoding='utf-8'))


def render(name, model, tex, cam, crop=None, same=None, **over):
    cfg = {'model': model, 'texture': tex, 'out': os.path.join(tmp, name + '.png'), 'width': 2400, 'height': 2000, 'samples': 128,
           'pose': {'Door-L': {'yaw': DOOR}, 'Door-R': {'yaw': -DOOR}}, 'lights': {'key': 3.6, 'fill': 0.6, 'rim': 1.0}, 'camera': cam}
    cfg.update(over); cj = os.path.join(tmp, name + '.json'); json.dump(cfg, open(cj, 'w'))
    subprocess.run([BLENDER, '-b', '-P', os.path.join(HERE, 'blockyblend.py'), '--', cj], check=True, capture_output=True)
    im = Image.open(cfg['out']); marks = json.load(open(cfg['out'] + '.json'))
    if crop:                                            # a piece laid over the art: cut to the art's frame, then to itself
        im = im.crop(crop); b = im.getbbox(); b = (b[0] // 2 * 2, b[1] // 2 * 2, (b[2] + 1) // 2 * 2, (b[3] + 1) // 2 * 2)
        if same: b = (same[0] * 2, same[1] * 2, (same[0] + same[2]) * 2, (same[1] + same[3]) * 2)   # a hover picture: the plain one's frame
        im.crop(b).resize(((b[2] - b[0]) // 2, (b[3] - b[1]) // 2), Image.LANCZOS).save(os.path.join(OUT, name + '@2x.png'), optimize=True)
        return [b[0] // 2, b[1] // 2, (b[2] - b[0]) // 2, (b[3] - b[1]) // 2]
    box = im.getbbox(); box = (box[0] - 4, box[1] - 4, box[2] + 4, box[3] + 4)
    im = im.crop(box)
    if im.width % 2: im = im.crop((0, 0, im.width + 1, im.height))         # whole UI units
    if im.height % 2: im = im.crop((0, 0, im.width, im.height + 1))
    render.box = (box[0], box[1], box[0] + im.width, box[1] + im.height)
    # stored at one pixel per UI unit: a full @2x picture this big came out scrambled in game (the client's UI atlas)
    im.resize((im.width // 2, im.height // 2), Image.LANCZOS).save(os.path.join(OUT, name + '@2x.png'), optimize=True)
    return im, {k: [[(p[0] - box[0]) / 2, (p[1] - box[1]) / 2] for p in v] for k, v in marks.items()}


def make(set_name, c):
    model, tex = sheet(set_name)
    if c.get('widen'): widen(model, c['widen'])
    x0, x1, top, bot, face = c['interior']
    k = IN_H_UI / (top - bot)                          # UI units per model unit: every set's interior is the same height on screen
    u = lambda ui: ui / k                              # UI units -> model units
    sfx = '' if set_name == 'Lumberjack' else '_' + set_name
    cam = {'target': c.get('cam_target', [(x0 + x1) / 2, (top + bot) / 2, face]), 'distance': 420, 'yaw': 0, 'pitch': 5,
           'lens': c.get('cam_lens', 133.8 * k / LJ_SCALE) * 2400 / c.get('frame_w', 2400)}   # a wider frame (open doors that reach past it) keeps the scale
    fw = {'width': c.get('frame_w', 2400)}
    # the racks: rails 3 Lumberjack units (31.7 UI) under the interior's top and one row lower, two units thick. Lumberjack paints the
    # top one, so only the second is added there; elsewhere each rail is laid in short lengths so it stays on its strip of the sheet.
    rt, rb = c.get('painted_rail', (top - u(3 * LJ_SCALE), top - u(5 * LJ_SCALE)))
    drops = [u(ROW_UI)] if c.get('painted_rail') else [0, u(ROW_UI)]
    own = c.get('own')                                 # a set whose own rack has an opening of its own (x0, x1, top, face): a rail in each
    spans = ([(own[0], own[1], own[2] - u(3 * LJ_SCALE), own[2] - u(5 * LJ_SCALE), own[3]), (x0, x1, rt, rb, face)] if own else
             [(x0, x1, rt - dy, rb - dy, face) for dy in drops])
    uv = c['rail']; ex = []
    for sx0, sx1, st_, sb, sf in spans:
        n = 2 if c.get('painted_rail') else max(1, round((sx1 - sx0) / 3))
        seg = (sx1 - sx0) / n
        ex += [{'position': [sx0 + seg * (i + 0.5), (st_ + sb) / 2, sf + 0.4], 'size': [seg, st_ - sb, 0.8], 'uv': {'front': uv, 'top': uv, 'bottom': uv}}
               for i in range(n)]
    mk = {'interior': [[x0, top, face], [x1, bot, face]]}
    if own: mk['own'] = [[own[0], own[2], own[3]]]
    art, m = render('Wardrobe' + sfx, model, tex, cam, **fw, extra=ex, marks=mk)
    box = render.box
    (ix0, iy0), (ix1, iy1) = m['interior']
    plaque_y = c.get('plaque_y', top - u(100 if own else 300))   # level with the middle of the Locker rack (or a set's own height on uneven doors)
    per = lambda v, i: v[i] if isinstance(v, (tuple, list)) else v   # door_mid / door_z: one for both doors, or (left, right) on the picture
    K = 0.7 * LJ_SCALE / k                             # model units per plaque cell: the same size on screen in every set

    def plaque(name, door, sign, key, same=None, i=0):
        # a board bolted to the inside of a door (swung open as in the art, so it takes the door's angle), with an arrow carved into it
        # (pointing right, or left when sign is -1) and a bolt in each top corner; rendered alone with the art's camera
        W, H, D, CUT, RIM = 18, 11, 1.2, 0.8, 0.4
        head = {10: (2, 8), 11: (3, 7), 12: (4, 6), 13: (5, 5)}
        kind = lambda x, y: ('rim' if x in (0, W - 1) or y in (0, H - 1) else
                             'cut' if (4 <= x <= 10 and 4 <= y <= 6) or (x in head and head[x][0] <= y <= head[x][1]) else 'board')
        at = {'node': door, 'at': [per(c.get('plaque_dx', 0), i), plaque_y - per(c['door_mid'], i), -per(c['door_z'], i) / 2], 'flip': True}   # from the door box's centre; its inside face
        ex = []
        for y in range(H):
            x = 0
            while x < W:
                kd = kind(x, y); xe = x
                # cut cells one by one (a small dark patch); a rim from a single texel too (a longer box would run its face across the sheet)
                while kd != 'cut' and not (kd in ('rim', 'board') and c.get(kd + '_cells')) and xe + 1 < W and kind(xe + 1, y) == kd: xe += 1
                w = xe - x + 1
                front = {'cut': D - CUT, 'board': D, 'rim': D + RIM}[kd]
                tu, tv = c[kd](x, y)
                ex.append({'position': [(x + w / 2 - W / 2) * sign * K, (H / 2 - y - 0.5) * K, front / 2 * K], 'size': [w * K, K, front * K], 'attach': at,
                           'uv': {f: [tu, tv] for f in ('front', 'top', 'bottom', 'left', 'right')}})
                x = xe + 1
        for cx in (0.6, W - 0.6):                      # a bolt in each top corner of the frame
            ex.append({'position': [(cx - W / 2) * K, (H / 2 - 0.6) * K, (D + RIM + 0.25) * K], 'size': [1.2 * K, 1.2 * K, 0.5 * K], 'attach': at,
                       'uv': c['bolt']})
        return render(name, model, tex, cam, crop=box, same=same, no_model=True, **fw, extra=ex, lights={'key': key, 'fill': 0.6, 'rim': 1.0}, marks={})

    plaques = {}
    for i, (side, door, sign) in enumerate((('Left', c['doors'][0], -1), ('Right', c['doors'][1], 1))):   # the model's Door-R swings open on the picture's left
        plaques[side] = plaque('Page' + side + sfx, door, sign, 3.6, i=i)
        plaque('Page' + side + 'Hover' + sfx, door, sign, 6.5, plaques[side], i=i)
    iw = round(ix1 - ix0)
    lay = {'art': [art.width // 2, art.height // 2], 'interior': [round(ix0), round(iy0), iw, round(iy1 - iy0)],
           'rack_x': c.get('rack_x', round(ix0 + (iw - RACK_UI) / 2)), 'plaques': plaques}
    if own: lay['own'], lay['grid'] = [lay['rack_x'], round(m['own'][0][1])], [lay['rack_x'], round(iy0)]   # else the own rack sits over the Locker rack
    if set_name != 'Lumberjack':
        write_ui(set_name, lay)
    return lay


def write_ui(set_name, lay):
    # Wardrobe_<Set>.ui: Wardrobe.ui with this art's numbers (each swap must hit exactly as often as expected, or Wardrobe.ui changed shape)
    import re
    s = open(os.path.join(OUT, 'Wardrobe.ui'), encoding='utf-8').read()
    W, H = lay['art']; ix, iy = lay['interior'][:2]; rx = lay['rack_x']; sfx = '_' + set_name
    (ox, oy), (gx, gy) = lay.get('own', [rx, iy]), lay.get('grid', [rx, iy + 201])   # the own rack and the Locker rack, each with its header
    pl = lambda p: 'Anchor: (Left: %d, Top: %d, Width: %d, Height: %d);' % tuple(p)
    head = '// Made by dev/tools/render-wardrobe.py from Wardrobe.ui for the %s wardrobe: edit Wardrobe.ui, then run the script.\n' % set_name.replace('_', ' ')
    swaps = [(r'\A(//.*\n)+', head, 1),
             (r'Anchor: \(Width: \d+, Height: \d+\);', 'Anchor: (Width: %d, Height: %d);' % (W, H + 66), 1),
             (r'Anchor: \(Left: 0, Top: 0, Width: \d+, Height: 40\);', 'Anchor: (Left: 0, Top: 0, Width: %d, Height: 40);' % W, 1),
             (r'Anchor: \(Left: 0, Top: 40, Width: \d+, Height: \d+\);', 'Anchor: (Left: 0, Top: 40, Width: %d, Height: %d);' % (W, H), 1),
             (r'"Wardrobe\.png"', '"Wardrobe%s.png"' % sfx, 1),
             (r'Anchor: \(Left: \d+, Top: \d+, Width: 300, Height: 18\);', 'Anchor: (Left: %d, Top: %d, Width: 300, Height: 18);' % (ox + 8, oy + 2), 1),
             (r'Anchor: \(Left: \d+, Top: \d+, Width: 94, Height: 200\);(\s*Group #OwnWorn)', r'Anchor: (Left: %d, Top: %d, Width: 94, Height: 200);\g<1>' % (ox, oy), 1),
             (r'Anchor: \(Left: \d+, Top: \d+, Width: 470, Height: 200\);', 'Anchor: (Left: %d, Top: %d, Width: 470, Height: 200);' % (gx, gy), 2),
             (r'Anchor: \(Left: \d+, Top: \d+, Width: 458, Height: 28\);', 'Anchor: (Left: %d, Top: %d, Width: 458, Height: 28);' % (gx + 8, gy - 6), 1),
             (r'(#PrevPage \{\s*)Anchor: \([^)]*\);', r'\g<1>' + pl(lay['plaques']['Left']), 1),
             (r'(#NextPage \{\s*)Anchor: \([^)]*\);', r'\g<1>' + pl(lay['plaques']['Right']), 1),
             (r'"(Page(?:Left|Right)(?:Hover)?)\.png"', r'"\g<1>%s.png"' % sfx, 6),
             (r'Anchor: \(Left: 0, Top: \d+, Width: \d+, Height: 22\);', 'Anchor: (Left: 0, Top: %d, Width: %d, Height: 22);' % (H + 42, W), 1)]
    for pat, rep, count in swaps:
        s, n = re.subn(pat, rep, s)
        if n != count: sys.exit('Wardrobe.ui changed shape: %r matched %d times, not %d' % (pat, n, count))
    open(os.path.join(OUT, 'Wardrobe%s.ui' % sfx), 'w', encoding='utf-8', newline='\n').write(s)


# the coat hanger (one for every set): an iron hook over the rail and down behind the skin's head to a stepped wooden shoulder bar,
# which sits on the skin's shoulders 96 UI units below the rack's top (the page grows a picked skin around that line, so it never
# leaves the hook); drawn from the Lumberjack sheet at the Lumberjack art's scale
if 'Lumberjack' in WHICH:
    model, tex = sheet('Lumberjack')
    IN_X0, IN_X1, IN_TOP, IN_BOT, FACE_Z = LJ
    RAIL_TOP = SETS['Lumberjack']['painted_rail'][0]; IRON = SETS['Lumberjack']['rail']
    SHOULDER = IN_TOP - 96 / LJ_SCALE
    STEM = [45, 5, 90]                                     # the rail's iron, turned to run down the stem
    WOOD = [4, 42]                                         # the lit edge of a plank
    hook = [{'position': [0, RAIL_TOP + 0.3, FACE_Z + 0.6], 'size': [1.2, 0.6, 1.6], 'uv': {f: IRON for f in ('front', 'top', 'left', 'right')}},
            {'position': [0, (RAIL_TOP + SHOULDER) / 2, FACE_Z + 1.15], 'size': [0.6, RAIL_TOP - SHOULDER, 0.6], 'uv': {f: STEM for f in ('front', 'top', 'left', 'right', 'bottom')}},
            {'position': [0, SHOULDER + 0.1, FACE_Z + 1.15], 'size': [1.0, 0.8, 0.8], 'uv': {f: WOOD for f in ('front', 'top', 'left', 'right', 'bottom')}}]
    for sx in (-1, 1):
        hook += [{'position': [sx * 1.3, SHOULDER - 0.15, FACE_Z + 1.15], 'size': [1.6, 0.7, 0.8], 'uv': {f: WOOD for f in ('front', 'top', 'left', 'right', 'bottom')}},
                 {'position': [sx * 2.35, SHOULDER - 0.45, FACE_Z + 1.15], 'size': [0.6, 0.6, 0.8], 'uv': {f: WOOD for f in ('front', 'top', 'left', 'right', 'bottom')}}]
    him, hm = render('Hanger', model, tex, {'target': [-16, 36, 8], 'distance': 420, 'yaw': 0, 'pitch': 5, 'lens': 133.8},
                     no_model=True, extra=hook, marks={'c': [[0, RAIL_TOP + 0.6, FACE_Z]]})
    print(json.dumps({'hanger': {'size': [him.width // 2, him.height // 2], 'center_x_in_image': round(hm['c'][0][0], 1)}}))

for name in WHICH:
    print(name, json.dumps(make(name, SETS[name])))
