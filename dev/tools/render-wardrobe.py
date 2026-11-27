# Renders the in-game wardrobe screen's art (mod 1.4.0) from the game's own Lumberjack wardrobe model, doors swung open, in Blender
# with soft light on a transparent background: the wardrobe with a second rack, the coat hanger a skin hangs on, and the page
# plaques (an arrow carved into a board of the wardrobe's own planks, held by one iron nail; lighter while the pointer is on them).
# Writes name@2x.png into the mod's UI folder and prints the layout (UI units) that Wardrobe.ui / WardrobeCard.ui are built on.
# python dev/tools/render-wardrobe.py [--blender <blender.exe>] [--assets <Assets.zip>]
import json, os, subprocess, sys, tempfile, zipfile
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'mod', 'res', 'Common', 'UI', 'Custom', 'Pages', 'HytaleDesigner')
arg = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
BLENDER = arg('--blender', os.path.join(HERE, '..', '..', '..', 'tools', 'blender', 'blender-4.5.12-windows-x64', 'blender.exe'))
ASSETS = arg('--assets', os.path.join(os.environ.get('APPDATA', ''), 'Hytale', 'install', 'release', 'package', 'game', 'latest', 'Assets.zip'))
SRC = 'Common/Blocks/Decorative_Sets/Lumberjack/'

# the model's interior (the painted inside of its front face) and our pieces, in model units
IN_X0, IN_X1, IN_TOP, IN_BOT, FACE_Z = -41, 8, 56.65, 18.65, 8
RAIL_TOP, RAIL_BOT = 53.65, 51.65
IRON = [10, 5]                                      # rail texels on the model's sheet

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
tmp = tempfile.mkdtemp()
with zipfile.ZipFile(ASSETS) as z:
    for n in ('Wardrobe.blockymodel', 'Wardrobe_Texture.png'):
        open(os.path.join(tmp, n), 'wb').write(z.read(SRC + n))
model, tex = os.path.join(tmp, 'Wardrobe.blockymodel'), os.path.join(tmp, 'Wardrobe_Texture.png')
CAM = {'target': [-16, 36, 8], 'distance': 420, 'yaw': 0, 'pitch': 5, 'lens': 133.8}   # lens sets the scale: interior 520 UI units wide

def render(name, **over):
    cfg = {'model': model, 'texture': tex, 'out': os.path.join(tmp, name + '.png'), 'width': 2400, 'height': 2000, 'samples': 128,
           'pose': {'Door-L': {'yaw': 128}, 'Door-R': {'yaw': -128}}, 'lights': {'key': 3.6, 'fill': 0.6, 'rim': 1.0}, 'camera': CAM,
           'marks': {'interior': [[IN_X0, IN_TOP, FACE_Z], [IN_X1, IN_BOT, FACE_Z]]}}
    cfg.update(over); cj = os.path.join(tmp, name + '.json'); json.dump(cfg, open(cj, 'w'))
    subprocess.run([BLENDER, '-b', '-P', os.path.join(HERE, 'blockyblend.py'), '--', cj], check=True, capture_output=True)
    im = Image.open(cfg['out']); marks = json.load(open(cfg['out'] + '.json'))
    box = im.getbbox(); box = (box[0] - 4, box[1] - 4, box[2] + 4, box[3] + 4)
    im = im.crop(box)
    if im.width % 2: im = im.crop((0, 0, im.width + 1, im.height))         # whole UI units
    if im.height % 2: im = im.crop((0, 0, im.width, im.height + 1))
    # stored at one pixel per UI unit: a full @2x picture this big came out scrambled in game (the client's UI atlas)
    im.resize((im.width // 2, im.height // 2), Image.LANCZOS).save(os.path.join(OUT, name + '@2x.png'), optimize=True)
    return im, {k: [[(p[0] - box[0]) / 2, (p[1] - box[1]) / 2] for p in v] for k, v in marks.items()}

# the second rack, one row of skins (200 UI units) under the wardrobe's own rail, rendered into the picture so it always runs the
# full width
ROW = 200 / (402 / (IN_TOP - IN_BOT))                  # one row in model units
HALF = (IN_X1 - IN_X0) / 2                              # two lengths, so each stays on the sheet's iron strip
rail2 = [{'position': [IN_X0 + HALF * (i + 0.5), (RAIL_TOP + RAIL_BOT) / 2 - ROW, FACE_Z + 0.4], 'size': [HALF, RAIL_TOP - RAIL_BOT, 0.8],
          'uv': {'front': IRON, 'top': IRON, 'bottom': IRON}} for i in (0, 1)]
art, m = render('Wardrobe', extra=rail2, marks={'interior': [[IN_X0, IN_TOP, FACE_Z], [IN_X1, IN_BOT, FACE_Z]],
                                                  'rail2': [[IN_X0, RAIL_TOP - ROW, FACE_Z]]})
(ix0, iy0), (ix1, iy1) = m['interior']
v = lambda y: iy0 + (IN_TOP - y) * (iy1 - iy0) / (IN_TOP - IN_BOT)

# the coat hanger: an iron hook over the rail and down behind the skin's head to a stepped wooden shoulder bar, which sits on the
# skin's shoulders 96 UI units below the rack's top (the page grows a picked skin around that line, so it never leaves the hook)
SHOULDER = IN_TOP - 96 / (402 / (IN_TOP - IN_BOT))
STEM = [45, 5, 90]                                     # the rail's iron, turned to run down the stem
WOOD = [4, 42]                                         # the lit edge of a plank
hook = [{'position': [0, RAIL_TOP + 0.3, FACE_Z + 0.6], 'size': [1.2, 0.6, 1.6], 'uv': {f: IRON for f in ('front', 'top', 'left', 'right')}},
        {'position': [0, (RAIL_TOP + SHOULDER) / 2, FACE_Z + 1.15], 'size': [0.6, RAIL_TOP - SHOULDER, 0.6], 'uv': {f: STEM for f in ('front', 'top', 'left', 'right', 'bottom')}},
        {'position': [0, SHOULDER + 0.1, FACE_Z + 1.15], 'size': [1.0, 0.8, 0.8], 'uv': {f: WOOD for f in ('front', 'top', 'left', 'right', 'bottom')}}]
for sx in (-1, 1):
    hook += [{'position': [sx * 1.3, SHOULDER - 0.15, FACE_Z + 1.15], 'size': [1.6, 0.7, 0.8], 'uv': {f: WOOD for f in ('front', 'top', 'left', 'right', 'bottom')}},
             {'position': [sx * 2.35, SHOULDER - 0.45, FACE_Z + 1.15], 'size': [0.6, 0.6, 0.8], 'uv': {f: WOOD for f in ('front', 'top', 'left', 'right', 'bottom')}}]
him, hm = render('Hanger', no_model=True, extra=hook, marks={'c': [[0, RAIL_TOP + 0.6, FACE_Z]]})

def plaque(name, sign, key):
    # a plank board with an arrow carved into it (pointing right, or left when sign is -1) and an iron nail at the arrow's tail
    W, H, D, CUT, RIM = 24, 13, 1.6, 1.0, 0.5
    head = {14: (2, 10), 15: (3, 9), 16: (4, 8), 17: (5, 7), 18: (6, 6)}
    kind = lambda x, y: ('rim' if x in (0, W - 1) or y in (0, H - 1) else
                         'cut' if (6 <= x <= 14 and 5 <= y <= 7) or (x in head and head[x][0] <= y <= head[x][1]) else 'board')
    ex = []
    for y in range(H):
        x = 0
        while x < W:
            k = kind(x, y); x1 = x
            while k != 'cut' and x1 + 1 < W and kind(x1 + 1, y) == k: x1 += 1   # cut cells one by one (a small dark patch)
            n = x1 - x + 1
            front, back = {'cut': -CUT, 'board': 0, 'rim': RIM}[k], -D
            u, v = {'cut': (117 + x % 5, 118 + y % 4), 'board': (2 + x, 76 + y), 'rim': (66 + x, 96 + y)}[k]   # cut: the dark end grain; board: the lit logs
            ex.append({'position': [(x + n / 2 - W / 2) * sign, H / 2 - y - 0.5, (front + back) / 2], 'size': [n, 1, front - back],
                       'uv': {f: [u, v] for f in ('front', 'top', 'bottom', 'left', 'right')}})
            x = x1 + 1
    ex.append({'position': [(3 - W / 2) * sign, 0, 0.35], 'size': [1.4, 1.4, 0.7],
               'uv': {'front': [57, 109], 'top': [51, 109], 'bottom': [51, 109], 'left': [51, 114], 'right': [51, 114]}})
    im, _ = render(name, no_model=True, extra=ex, width=600, height=400, samples=96, lights={'key': key, 'fill': 0.6, 'rim': 1.0},
                   camera={'target': [0, 0, 0], 'distance': 200, 'yaw': 0, 'pitch': 0, 'ortho': 24 * 600 / 216}, marks={})
    return im
for side, sign in (('Left', -1), ('Right', 1)):
    a = plaque('Page' + side, sign, 3.6); plaque('Page' + side + 'Hover', sign, 6.5)

lay = {'art': [art.width // 2, art.height // 2],
       'interior': [round(ix0), round(iy0), round(ix1 - ix0), round(iy1 - iy0)],
       'rail_y': [round(v(RAIL_TOP) - iy0, 1), round(v(RAIL_BOT) - iy0, 1)], 'rail2_top': round(m['rail2'][0][1] - iy0, 1),
       'hanger': {'size': [him.width // 2, him.height // 2], 'top_from_rack': round(v(RAIL_TOP + 0.6) - iy0 - hm['c'][0][1], 1),
                  'center_x_in_image': round(hm['c'][0][0], 1)},
       'plaque': [a.width // 2, a.height // 2]}
print(json.dumps(lay))
