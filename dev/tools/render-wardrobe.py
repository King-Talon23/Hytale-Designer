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
LJ_BOLT = {'front': [57, 109], 'top': [51, 109], 'bottom': [51, 109], 'left': [51, 114], 'right': [51, 114]}
SETS = {
    'Lumberjack': {'interior': (-41, 8, 56.65, 18.65, 8), 'painted_rail': (53.65, 51.65), 'rail': [10, 5], 'doors': ('Door-R', 'Door-L'),
                   'door_mid': 37.5, 'door_z': 2, 'cam_lens': 133.8, 'cam_target': [-16, 36, 8], 'rack_x': 274,
                   'board': lambda x, y: (2 + x, 76 + y), 'rim': lambda x, y: (66 + x, 96 + y), 'cut': lambda x, y: (117 + x % 5, 118 + y % 4),
                   'bolt': LJ_BOLT},
    'Temple_Dark': {'interior': (-39.25, 7.25, 58.5, 25.5, 11.85), 'rail': [2, 1, 90], 'doors': ('Door-R', 'Door-L'), 'door_mid': 42, 'door_z': 2,
                    'board': lambda x, y: (63 + x, 65 + y), 'rim': lambda x, y: (1 + (x + y) % 2, 1 + (x + y) % 9),
                    'cut': lambda x, y: (66 + x % 5, 78 + y % 2), 'bolt': {'front': [100, 86], 'top': [101, 87], 'bottom': [101, 87], 'left': [101, 87], 'right': [101, 87]}},
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
    x0, x1, top, bot, face = c['interior']
    k = IN_H_UI / (top - bot)                          # UI units per model unit: every set's interior is the same height on screen
    u = lambda ui: ui / k                              # UI units -> model units
    sfx = '' if set_name == 'Lumberjack' else '_' + set_name
    cam = {'target': c.get('cam_target', [(x0 + x1) / 2, (top + bot) / 2, face]), 'distance': 420, 'yaw': 0, 'pitch': 5,
           'lens': c.get('cam_lens', 133.8 * k / LJ_SCALE)}
    # the racks: rails 3 Lumberjack units (31.7 UI) under the interior's top and one row lower, two units thick. Lumberjack paints the
    # top one, so only the second is added there; elsewhere each rail is laid in short lengths so it stays on its strip of the sheet.
    rt, rb = c.get('painted_rail', (top - u(3 * LJ_SCALE), top - u(5 * LJ_SCALE)))
    drops = [u(ROW_UI)] if c.get('painted_rail') else [0, u(ROW_UI)]
    n = 2 if c.get('painted_rail') else max(1, round((x1 - x0) / 3))
    seg = (x1 - x0) / n
    uv = c['rail']
    ex = [{'position': [x0 + seg * (i + 0.5), (rt + rb) / 2 - dy, face + 0.4], 'size': [seg, rt - rb, 0.8], 'uv': {'front': uv, 'top': uv, 'bottom': uv}}
          for dy in drops for i in range(n)]
    art, m = render('Wardrobe' + sfx, model, tex, cam, extra=ex, marks={'interior': [[x0, top, face], [x1, bot, face]]})
    box = render.box
    (ix0, iy0), (ix1, iy1) = m['interior']
    plaque_y = top - u(300)                            # level with the middle of the bottom rack
    K = 0.7 * LJ_SCALE / k                             # model units per plaque cell: the same size on screen in every set

    def plaque(name, door, sign, key, same=None):
        # a board bolted to the inside of a door (swung open as in the art, so it takes the door's angle), with an arrow carved into it
        # (pointing right, or left when sign is -1) and a bolt in each top corner; rendered alone with the art's camera
        W, H, D, CUT, RIM = 18, 11, 1.2, 0.8, 0.4
        head = {10: (2, 8), 11: (3, 7), 12: (4, 6), 13: (5, 5)}
        kind = lambda x, y: ('rim' if x in (0, W - 1) or y in (0, H - 1) else
                             'cut' if (4 <= x <= 10 and 4 <= y <= 6) or (x in head and head[x][0] <= y <= head[x][1]) else 'board')
        at = {'node': door, 'at': [0, plaque_y - c['door_mid'], -c['door_z'] / 2], 'flip': True}   # from the door box's centre; its inside face
        ex = []
        for y in range(H):
            x = 0
            while x < W:
                kd = kind(x, y); xe = x
                while kd != 'cut' and xe + 1 < W and kind(xe + 1, y) == kd: xe += 1   # cut cells one by one (a small dark patch)
                w = xe - x + 1
                front = {'cut': D - CUT, 'board': D, 'rim': D + RIM}[kd]
                tu, tv = c[kd](x, y)
                ex.append({'position': [(x + w / 2 - W / 2) * sign * K, (H / 2 - y - 0.5) * K, front / 2 * K], 'size': [w * K, K, front * K], 'attach': at,
                           'uv': {f: [tu, tv] for f in ('front', 'top', 'bottom', 'left', 'right')}})
                x = xe + 1
        for cx in (0.6, W - 0.6):                      # a bolt in each top corner of the frame
            ex.append({'position': [(cx - W / 2) * K, (H / 2 - 0.6) * K, (D + RIM + 0.25) * K], 'size': [1.2 * K, 1.2 * K, 0.5 * K], 'attach': at,
                       'uv': c['bolt']})
        return render(name, model, tex, cam, crop=box, same=same, no_model=True, extra=ex, lights={'key': key, 'fill': 0.6, 'rim': 1.0}, marks={})

    plaques = {}
    for side, door, sign in (('Left', c['doors'][0], -1), ('Right', c['doors'][1], 1)):   # the model's Door-R swings open on the picture's left
        plaques[side] = plaque('Page' + side + sfx, door, sign, 3.6)
        plaque('Page' + side + 'Hover' + sfx, door, sign, 6.5, plaques[side])
    iw = round(ix1 - ix0)
    lay = {'art': [art.width // 2, art.height // 2], 'interior': [round(ix0), round(iy0), iw, round(iy1 - iy0)],
           'rack_x': c.get('rack_x', round(ix0 + (iw - RACK_UI) / 2)), 'plaques': plaques}
    if set_name != 'Lumberjack':
        write_ui(set_name, lay)
    return lay


def write_ui(set_name, lay):
    # Wardrobe_<Set>.ui: Wardrobe.ui with this art's numbers (each swap must hit exactly as often as expected, or Wardrobe.ui changed shape)
    import re
    s = open(os.path.join(OUT, 'Wardrobe.ui'), encoding='utf-8').read()
    W, H = lay['art']; ix, iy = lay['interior'][:2]; rx = lay['rack_x']; sfx = '_' + set_name
    pl = lambda p: 'Anchor: (Left: %d, Top: %d, Width: %d, Height: %d);' % tuple(p)
    head = '// Made by dev/tools/render-wardrobe.py from Wardrobe.ui for the %s wardrobe: edit Wardrobe.ui, then run the script.\n' % set_name.replace('_', ' ')
    swaps = [(r'\A(//.*\n)+', head, 1),
             (r'Anchor: \(Width: \d+, Height: \d+\);', 'Anchor: (Width: %d, Height: %d);' % (W, H + 66), 1),
             (r'Anchor: \(Left: 0, Top: 0, Width: \d+, Height: 40\);', 'Anchor: (Left: 0, Top: 0, Width: %d, Height: 40);' % W, 1),
             (r'Anchor: \(Left: 0, Top: 40, Width: \d+, Height: \d+\);', 'Anchor: (Left: 0, Top: 40, Width: %d, Height: %d);' % (W, H), 1),
             (r'"Wardrobe\.png"', '"Wardrobe%s.png"' % sfx, 1),
             (r'Anchor: \(Left: \d+, Top: \d+, Width: 300, Height: 18\);', 'Anchor: (Left: %d, Top: %d, Width: 300, Height: 18);' % (rx + 8, iy + 2), 1),
             (r'Anchor: \(Left: \d+, Top: \d+, Width: 94, Height: 200\);(\s*Group #OwnWorn)', r'Anchor: (Left: %d, Top: %d, Width: 94, Height: 200);\g<1>' % (rx, iy), 1),
             (r'Anchor: \(Left: \d+, Top: \d+, Width: 470, Height: 200\);', 'Anchor: (Left: %d, Top: %d, Width: 470, Height: 200);' % (rx, iy + 201), 2),
             (r'Anchor: \(Left: \d+, Top: \d+, Width: 458, Height: 28\);', 'Anchor: (Left: %d, Top: %d, Width: 458, Height: 28);' % (rx + 8, iy + 195), 1),
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
