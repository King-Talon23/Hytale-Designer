# Renders the in-game wardrobe screen's art (mod 1.4.0) from the game's own Lumberjack wardrobe model, doors swung open, in Blender
# with soft light on a transparent background: the wardrobe, the rail for each further row of skins, and the hook a skin hangs on.
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
POST_X0, POST_X1 = -29.3, -27.9                     # the post between "your skin" and the Locker's skins
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

glow('WornGlow', 0.75); glow('HoverGlow', 0.25, 127, 200)
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

post = {'position': [(POST_X0 + POST_X1) / 2, (RAIL_BOT + IN_BOT) / 2, FACE_Z + 0.8], 'size': [POST_X1 - POST_X0, RAIL_BOT - IN_BOT, 1.6],
        'uv': {'front': [100, 2], 'right': [100, 2], 'left': [100, 2], 'top': [100, 2]}}
art, m = render('Wardrobe', extra=[post])
(ix0, iy0), (ix1, iy1) = m['interior']
u = lambda x: ix0 + (x - IN_X0) * (ix1 - ix0) / (IN_X1 - IN_X0)       # model x -> UI x on the art
v = lambda y: iy0 + (IN_TOP - y) * (iy1 - iy0) / (IN_TOP - IN_BOT)

# a rail for each further row of skins, the length of the Locker side
rail = {'position': [(POST_X1 + IN_X1) / 2, (RAIL_TOP + RAIL_BOT) / 2, FACE_Z + 0.05], 'size': [IN_X1 - POST_X1, RAIL_TOP - RAIL_BOT, 0.1],
        'uv': {'front': IRON, 'top': IRON}}
rim, rm = render('Rail', no_model=True, extra=[rail], marks={'r': [[POST_X1, RAIL_TOP, FACE_Z], [IN_X1, RAIL_BOT, FACE_Z]]})
# the hook: a bar over the rail and a drop in front of it, iron like the rail
hook = [{'position': [0, RAIL_TOP + 0.3, FACE_Z + 0.6], 'size': [1.2, 0.6, 1.6], 'uv': {f: IRON for f in ('front', 'top', 'left', 'right')}},
        {'position': [0, RAIL_BOT - 0.4, FACE_Z + 1.15], 'size': [0.6, 3.0, 0.6], 'uv': {f: IRON for f in ('front', 'top', 'left', 'right', 'bottom')}}]
him, hm = render('Hook', no_model=True, extra=hook, marks={'c': [[0, RAIL_TOP + 0.6, FACE_Z]]})

lay = {'art': [art.width // 2, art.height // 2],
       'interior': [round(ix0), round(iy0), round(ix1 - ix0), round(iy1 - iy0)],
       'own': [round(ix0), round(u(POST_X0) - ix0)], 'locker': [round(u(POST_X1)), round(ix1 - u(POST_X1))],
       'rail_y': [round(v(RAIL_TOP) - iy0, 1), round(v(RAIL_BOT) - iy0, 1)],
       'hook': {'size': [him.width // 2, him.height // 2], 'top_from_interior': round(v(RAIL_TOP + 0.6) - iy0 - hm['c'][0][1], 1),
                'center_x_in_image': round(hm['c'][0][0], 1)},
       'rail_png': {'size': [rim.width // 2, rim.height // 2], 'rail_top_in_image': round(rm['r'][0][1], 1)}}
# one card's length of rail from the middle of the long one (no end caps), so each card carries its own and the rows scroll
card = 120                                          # three to a row with room for the scrollbar
mid = rim.width // 2; rim.crop((mid - card, 0, mid + card, rim.height)).resize((card, rim.height // 2), Image.LANCZOS).save(os.path.join(OUT, 'RailPiece@2x.png'), optimize=True)
os.remove(os.path.join(OUT, 'Rail@2x.png'))
lay['card_w'] = card
print(json.dumps(lay))
