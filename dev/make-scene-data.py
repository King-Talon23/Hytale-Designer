# Writes site/app/scene-data.js: which game files the in-game backgrounds and the move set pieces are built from.
# Everything is read from the game's own definitions in Assets.zip (block textures, models, tints, tree prefabs), so the
# site draws them the way the game does. The output holds only file paths, names and colours, never game art.
# Run: python -I dev/make-scene-data.py "<path to Assets.zip>"
import json, sys, zipfile, os

z = zipfile.ZipFile(sys.argv[1]); names = z.namelist()
ITEMS = {p.split('/')[-1][:-5]: p for p in names if p.startswith('Server/Item/Items/') and p.endswith('.json')}

def item(name):
    d = json.loads(z.read(ITEMS[name]))
    if d.get('Parent') and d['Parent'] in ITEMS:   # a block that copies another one and changes a few keys
        base = item(d['Parent']); bt = {**base.get('BlockType', {}), **d.get('BlockType', {})}; d = {**base, **d, 'BlockType': bt}
    return d

def block(name):
    bt = item(name).get('BlockType', {}); out = {}
    if bt.get('CustomModel'):
        tx = bt.get('CustomModelTexture') or []
        out = {'model': bt['CustomModel'], 'tex': [t['Texture'] for t in tx]}
    elif bt.get('Textures'):
        t = bt['Textures'][0]
        side = t.get('Sides') or t.get('All'); top = t.get('Up') or t.get('UpDown') or t.get('All'); bottom = t.get('Down') or t.get('UpDown') or t.get('All')
        tops = [x.get('Up') or x.get('UpDown') or x.get('All') for x in bt['Textures']]
        out = {'cube': {'side': side, 'top': sorted(set(tops)) if len(set(tops)) > 1 else top, 'bottom': bottom}}
        if bt.get('TextureSideMask'): out['cube']['sideMask'] = bt['TextureSideMask']
        if bt.get('BiomeTintUp'): out['tintUp'] = True
    if bt.get('Tint'): out['tint'] = bt['Tint'][0] if isinstance(bt['Tint'], list) else bt['Tint']
    return out

def first(prefix):   # the first prefab of a tree stage, in the game's own numbering
    for root in ('Server/Prefabs/Orbis/Trees/', 'Server/Prefabs/Trees/'):   # most trees live under Orbis, a few (Jungle) only in the older folder
        found = sorted(p for p in names if p.startswith(root + prefix) and p.endswith('.prefab.json'))
        if found: return found[0]
    raise KeyError('no tree prefab ' + prefix)

B = 'Server/HytaleGenerator/Biomes/'
W = 'Server/Weathers/'
# Every surface biome of the game's world generator (HytaleGenerator/Biomes), zone by zone, under its environment's usual weather.
# Plants and trees are the ones its Assignments place (weights from the game's own lists); size: 1 low, 2 knee-high, none tall.
# The first four keys are the original backgrounds, kept so a saved choice still finds its place.
ZONES = {1: 'Emerald Grove', 2: 'Howling Sands', 3: 'Borea', 4: 'Devastated Lands', 5: 'Ocean'}
GRASS = [['Plant_Grass_Sharp_Short', 16, 1], ['Plant_Grass_Sharp', 18, 2], ['Plant_Grass_Sharp_Tall', 14], ['Plant_Grass_Sharp_Wild', 9]]
ARID = [['Plant_Grass_Arid_Short', 10, 1], ['Plant_Grass_Arid', 6, 2], ['Plant_Bush_Arid', 3]]
SCENES = {
    # ---- Zone 1
    'meadow': {'zone': 1, 'name': 'Meadow', 'weather': W + 'Zone1/Zone1_Sunny.json', 'tintFrom': B + 'Plains1/Plains1_Oak.json',
               'ground': 'Soil_Grass', 'under': 'Soil_Dirt', 'hills': 2,
               'plants': [['Plant_Grass_Lush_Short', 30, 1], ['Plant_Grass_Sharp', 24, 2], ['Plant_Grass_Sharp_Tall', 10], ['Plant_Grass_Sharp_Wild', 4], ['Plant_Flower_Common_Red2', 2, 1], ['Plant_Flower_Common_Cyan2', 2, 1]], 'density': 0.45,
               'trees': [first('Oak/Stage_4/'), first('Oak/Stage_3/'), first('Beech/Stage_2/')]},
    'hills': {'zone': 1, 'name': 'Hills', 'weather': W + 'Zone1/Zone1_Sunny.json', 'tintFrom': B + 'Plains1/Plains1_Hills.json',
              'ground': 'Soil_Grass', 'under': 'Soil_Dirt', 'hills': 5,
              'plants': GRASS + [['Plant_Flower_Common_White', 2, 1], ['Plant_Flower_Tall_Purple', 2], ['Plant_Bush_Green', 2, 2]], 'density': 0.45,
              'trees': [first('Oak/Stage_5/'), first('Beech/Stage_3/'), first('Oak/Stage_4/')]},
    'gorges': {'zone': 1, 'name': 'Gorges', 'weather': W + 'Zone1/Zone1_Cloudy_Medium.json', 'tintFrom': B + 'Plains1/Plains1_Gorges.json',
               'ground': 'Soil_Grass_Deep', 'under': 'Rock_Stone', 'hills': 7,
               'plants': [['Plant_Grass_Lush_Short', 10, 1], ['Plant_Grass_Lush', 10, 2], ['Plant_Grass_Lush_Tall', 8], ['Plant_Bush', 4, 2], ['Plant_Bush_Green', 4, 2], ['Plant_Reeds_Marsh', 3], ['Plant_Fern_Wet_Big', 3]], 'density': 0.5,
               'trees': [first('Beech/Stage_4/'), first('Oak/Stage_3/'), first('Beech/Stage_1/')]},
    'riverbank': {'water': {'kind': 'river', 'bed': 'Soil_Gravel', 'plants': [['Plant_Seaweed_Grass', 6, 1]], 'density': 0.12}, 'zone': 1, 'name': 'Riverbank', 'weather': W + 'Zone1/Zone1_Sunny_Fireflies.json', 'tintFrom': B + 'Plains1/Plains1_River.json',
                  'ground': 'Soil_Grass', 'under': 'Soil_Gravel', 'hills': 1,
                  'plants': GRASS + [['Plant_Reeds_Marsh', 4], ['Plant_Fern_Forest', 2, 2], ['Plant_Flower_Bushy_Green', 2, 1], ['Plant_Fern_Wet_Big', 2]], 'density': 0.5,
                  'trees': [first('Oak/Stage_5/'), first('Birch/Stage_1/'), first('Beech_Fallen/Stage_1/')]},
    'trork': {'zone': 1, 'name': 'Trork Lands', 'weather': W + 'Zone1/Zone1_Autumn_Forest_Windy.json', 'tintFrom': B + 'Plains1/Plains1_Trork.json',
              'ground': 'Soil_Grass_Deep', 'under': 'Soil_Dirt_Burnt', 'hills': 3,
              'plants': [['Plant_Grass_Sharp', 12, 2], ['Plant_Bush_Dead_Tall', 6], ['Plant_Grass_Lush_Short', 10, 1], ['Plant_Bramble_Dry_Twisted', 1, 2]], 'density': 0.35,
              'trees': [first('Aspen/Stage_1/'), first('Aspen/Stage_2/'), first('Aspen_Fallen/'), first('Maple_Stumps/')]},
    # ---- Zone 2
    'desert': {'zone': 2, 'name': 'Desert', 'weather': W + 'Zone2/Zone2_Sunny.json', 'ground': 'Soil_Sand', 'under': 'Soil_Sand', 'hills': 2,
               'plants': ARID, 'density': 0.08,
               'trees': [first('Dry_Dead/Stage_2/'), first('Petrified_Dead/Stage_5')]},
    'oasis': {'zone': 2, 'name': 'Oasis', 'weather': W + 'Zone2/Zone2_Cloudy_Light.json', 'tintFrom': B + 'Desert1/Desert1_Oasis.json',
              'ground': 'Soil_Grass', 'under': 'Soil_Sand_White', 'hills': 1,
              'plants': [['Plant_Grass_Lush_Short', 14, 1], ['Plant_Grass_Lush', 8, 2], ['Plant_Fern_Tall', 3], ['Plant_Bush_Arid', 2]], 'density': 0.35,
              'trees': [first('Palm_Green/Stage_3/'), first('Palm_Green/Stage_2/'), first('Boab/Stage_1/'), first('Gum/')]},
    'rocky': {'zone': 2, 'name': 'Rocky Desert', 'weather': W + 'Zone2/Zone2_Blazing_Light.json', 'tintFrom': B + 'Desert1/Desert1_Rocky.json',
              'ground': 'Soil_Sand_White', 'under': 'Rock_Sandstone', 'hills': 6,
              'plants': ARID + [['Plant_Grass_Arid_Short', 4, 1]], 'density': 0.1,
              'trees': [first('Dry/Stage_2/'), first('Palm/Stage_2/'), first('Dry/Stage_1/')]},
    'desertriver': {'water': {'kind': 'river', 'bed': 'Soil_Gravel_Sand', 'plants': [], 'density': 0}, 'zone': 2, 'name': 'Dry River', 'weather': W + 'Zone2/Zone2_Sunny.json', 'tintFrom': B + 'Desert1/Desert1_River.json',
                    'ground': 'Soil_Gravel_Sand', 'under': 'Soil_Clay_Orange', 'hills': 1,
                    'plants': ARID, 'density': 0.12,
                    'trees': [first('Palo/Stage_3/')], 'treeCount': 16},
    'desertshore': {'water': {'kind': 'shore', 'bed': 'Soil_Sand_White', 'plants': [['Plant_Seaweed_Grass', 4, 1]], 'density': 0.06}, 'zone': 2, 'name': 'Desert Shore', 'weather': W + 'Zone2/Zone2_Desert_Haze.json', 'tintFrom': B + 'Desert1/Desert1_Shore.json',
                    'ground': 'Soil_Sand_White', 'under': 'Rock_Sandstone', 'hills': 1,
                    'plants': [['Plant_Grass_Arid_Short', 6, 1], ['Plant_Grass_Arid', 3, 2]], 'density': 0.05,
                    'trees': [first('Palm/Stage_2/')], 'treeCount': 8},
    # ---- Zone 3
    'tundra': {'zone': 3, 'name': 'Snow', 'weather': W + 'Zone3/Zone3_Cloudy_Light.json', 'ground': 'Soil_Snow', 'under': 'Soil_Snow', 'hills': 3,
               'plants': [['Plant_Bush_Winter_Snow', 4], ['Plant_Bramble_Winter', 3, 2]], 'density': 0.06,
               'trees': [first('Fir_Snow/Stage_3/'), first('Fir_Snow/Stage_1/')]},
    'glacier': {'zone': 3, 'name': 'Glacier', 'weather': W + 'Zone3/Zone3_Snow_Heavy.json', 'tintFrom': B + 'Boreal1/Boreal1_Henges.json',
                'ground': 'Rock_Ice', 'under': 'Rock_Ice_Permafrost', 'hills': 6,
                'plants': [['Plant_Bush_Winter_Snow', 3], ['Plant_Bramble_Winter', 2, 2]], 'density': 0.03,
                'trees': [], 'treeCount': 0},
    'taiga': {'zone': 3, 'name': 'Taiga', 'weather': W + 'Zone3/Zone3_Cloudy_Medium.json', 'tintFrom': B + 'Taiga1/Taiga1_Mountains.json',
              'ground': 'Soil_Grass', 'under': 'Soil_Dirt', 'hills': 6,
              'plants': GRASS + [['Plant_Flower_Hemlock', 2, 2], ['Plant_Flower_Tall_Pink', 2]], 'density': 0.4,
              'trees': [first('Cedar/Stage_1/'), first('Fir/Stage_2/'), first('Aspen/Stage_1/')]},
    'redwood': {'zone': 3, 'name': 'Redwood Forest', 'weather': W + 'Zone3/Zone3_Cloudy_Light.json', 'tintFrom': B + 'Taiga1/Taiga1_Redwood.json',
                'ground': 'Soil_Needles', 'under': 'Soil_Dirt', 'hills': 2,
                'plants': [['Plant_Grass_Sharp_Tall', 8], ['Plant_Grass_Sharp_Wild', 5], ['Plant_Bush_Lush', 3, 2], ['Plant_Fern_Winter', 4, 2]], 'density': 0.3,
                'trees': [first('Redwood/Stage_2/'), first('Redwood/Stage_1/'), first('Cedar/Stage_1/'), first('Redwood_Logs/')], 'treeCount': 40},
    'taigariver': {'water': {'kind': 'river', 'bed': 'Soil_Gravel', 'plants': [['Plant_Seaweed_Grass', 6, 1]], 'density': 0.1}, 'zone': 3, 'name': 'Cold River', 'weather': W + 'Zone3/Zone3_Rain.json', 'tintFrom': B + 'Taiga1/Taiga1_River.json',
                   'ground': 'Soil_Grass', 'under': 'Soil_Gravel', 'hills': 1,
                   'plants': GRASS + [['Plant_Reeds_Winter', 3], ['Plant_Flower_Common_Blue', 2, 1], ['Plant_Fern_Winter', 2, 2]], 'density': 0.4,
                   'trees': [first('Fir/Stage_2/'), first('Fir/Stage_1/'), first('Cedar_Logs/Small/')]},
    'taigashore': {'water': {'kind': 'shore', 'bed': 'Soil_Gravel_Sand', 'plants': [['Plant_Seaweed_Grass', 4, 1]], 'density': 0.1}, 'zone': 3, 'name': 'Cold Shore', 'weather': W + 'Zone3/Zone3_Cloudy_Light.json', 'tintFrom': B + 'Taiga1/Taiga1_Shore.json',
                   'ground': 'Soil_Gravel_Sand', 'under': 'Soil_Gravel', 'hills': 1,
                   'plants': [['Plant_Grass_Sharp', 6, 2], ['Plant_Grass_Rocky', 4, 1]], 'density': 0.15,
                   'trees': [first('Fir/Stage_2/'), first('Cedar_Burnt/Stage_2/')], 'treeCount': 18},
    'hedera': {'zone': 3, 'name': 'Hedera', 'weather': W + 'Zone3/Zone3_Hedera.json', 'tintFrom': B + 'Boreal1/Boreal1_Hedera.json',
               'ground': 'Plant_Moss_Block_Blue', 'under': 'Soil_Dirt_Cold', 'hills': 3,
               'plants': [['Plant_Moss_Short_Blue', 8, 1], ['Plant_Moss_Blue', 6, 1], ['Plant_Grass_Gnarled', 5, 2], ['Plant_Bush_Lush', 3, 2], ['Plant_Reeds_Water', 2]], 'density': 0.35,
               'trees': [first('Fir/Stage_2/'), first('Mushroom/'), first('Ash_Swamp_Dead/Stage_3/')]},
    # ---- Zone 4
    'volcanic': {'zone': 4, 'name': 'Jungle', 'weather': W + 'Zone4/Zone4_Light.json', 'tintFrom': B + 'Volcanic1/Volcanic1_Jungle.json',
                 'ground': 'Soil_Grass', 'under': 'Soil_Dirt', 'hills': 3,
                 'plants': [['Plant_Grass_Lush_Short', 20, 1], ['Plant_Grass_Sharp', 16, 2], ['Plant_Grass_Sharp_Tall', 10], ['Plant_Grass_Sharp_Wild', 6], ['Plant_Fern_Tall', 6], ['Plant_Bush_Jungle', 4], ['Plant_Bush_Dead_Twisted', 1]], 'density': 0.5,
                 'trees': [first('Banyan/Stage_3/'), first('Jungle/Stage_2/'), first('Fig_Blue/Stage_2/')]},
    'caldera': {'zone': 4, 'name': 'Caldera', 'weather': W + 'Zone4/Zone4_Lava_Fields.json', 'tintFrom': B + 'Volcanic1/Volcanic1_Caldera.json',
                'ground': 'Soil_Ash', 'under': 'Rock_Volcanic', 'hills': 6,
                'plants': [['Plant_Bush_Dead_Twisted', 2]], 'density': 0.02,
                'trees': [first('Ash_Dead/Stage_2/')], 'treeCount': 8},
    'ashriver': {'water': {'kind': 'river', 'bed': 'Soil_Sand_Ashen', 'plants': [], 'density': 0}, 'zone': 4, 'name': 'Ashen River', 'weather': W + 'Zone4/Zone4_Wastes.json', 'tintFrom': B + 'Volcanic1/Volcanic1_River.json',
                 'ground': 'Soil_Sand_Ashen', 'under': 'Rock_Volcanic', 'hills': 1,
                 'plants': [['Plant_Bush_Dead_Twisted', 2], ['Plant_Grass_Arid_Short', 3, 1]], 'density': 0.05,
                 'trees': [first('Palo/Stage_3/')], 'treeCount': 14},
    'ashshore': {'water': {'kind': 'shore', 'bed': 'Soil_Sand_Ashen', 'plants': [], 'density': 0}, 'zone': 4, 'name': 'Ashen Shore', 'weather': W + 'Zone4/Zone4_Storm.json', 'tintFrom': B + 'Volcanic1/Volcanic1_Shore.json',
                 'ground': 'Soil_Sand_Ashen', 'under': 'Soil_Clay_Smooth_Black', 'hills': 1,
                 'plants': [['Plant_Bush_Dead_Twisted', 2]], 'density': 0.03,
                 'trees': [first('Ash_Dead/Stage_2/')], 'treeCount': 20},
    # ---- the sea between the zones (Ocean1, Env_Zone0 -> Zone1_Sunny): open water round a sand island, seaweed and coral on the bed.
    # The swim moves switch to it on their own.
    'ocean': {'zone': 5, 'name': 'Open Sea', 'weather': W + 'Zone1/Zone1_Sunny.json', 'tintFrom': B + 'Ocean1/Oceans.json',
              'water': {'kind': 'sea', 'bed': 'Soil_Sand', 'depth': 3, 'density': 0.22,
                        'plants': [['Plant_Seaweed_Grass', 10, 1], ['Plant_Seaweed_Grass_Tall', 6], ['Plant_Seaweed_Grass_Stack', 3],
                                   ['Plant_Coral_Bush_Pink', 2], ['Plant_Coral_Bush_Cyan', 2], ['Plant_Coral_Bush_Yellow', 1], ['Plant_Coral_Bush_Purple', 1]]},
              'ground': 'Soil_Sand', 'under': 'Soil_Sand', 'hills': 1,
              'plants': [['Plant_Grass_Arid_Short', 4, 1]], 'density': 0.05,
              'trees': [first('Palm/Stage_2/')], 'treeCount': 10},
}
# the things the moves use, from the game's village furniture set and benches
SET_PIECES = {'chair': 'Furniture_Village_Chair', 'bed': 'Furniture_Village_Bed', 'ladder': 'Furniture_Village_Ladder', 'bench': 'Bench_WorkBench', 'wall': 'Wood_Softwood_Planks'}

blocks = {}
for s in SCENES.values():
    for b in [s['ground'], s['under']] + [p[0] for p in s['plants']] + ([s['water']['bed']] + [p[0] for p in s['water']['plants']] if s.get('water') else []): blocks[b] = block(b)
    for t in s['trees']:
        for b in {x['name'] for x in json.loads(z.read(t))['blocks']}:
            try: blocks[b] = block(b)
            except KeyError: print('no definition for', b)
for k, b in SET_PIECES.items(): blocks[b] = block(b)

import re
def noon(keys):   # a weather's colour keys at 12:00, blended between the keys either side (as the site does)
    ks = sorted((float(k['Hour']), '#' + m.group(1)) for k in keys for m in [re.search(r'#([0-9a-fA-F]{6})', str(k.get('Color', '')))] if m)
    lo = [k for k in ks if k[0] <= 12]; hi = [k for k in ks if k[0] >= 12]
    lo = lo[-1] if lo else (ks[-1][0] - 24, ks[-1][1]); hi = hi[0] if hi else (ks[0][0] + 24, ks[0][1])
    f = 0 if hi[0] == lo[0] else (12 - lo[0]) / (hi[0] - lo[0])
    A = [int(lo[1][i:i + 2], 16) for i in (1, 3, 5)]; C = [int(hi[1][i:i + 2], 16) for i in (1, 3, 5)]
    return [a + (c - a) * f for a, c in zip(A, C)]
def avg(path, tint=None):   # a texture's average colour; greyscale grass tops take the biome's colour
    from PIL import Image
    import io
    im = Image.open(io.BytesIO(z.read('Common/' + path))).convert('RGBA'); px = [q for q in im.get_flattened_data() if q[3] > 128]
    c = [sum(q[i] for q in px) / len(px) for i in range(3)]
    return [v / 255 * tv for v, tv in zip(c, tint)] if tint else c
def hexc(c): return '#' + ''.join('%02x' % max(0, min(255, round(v))) for v in c)
import re
for s in SCENES.values():   # the menu's chip: the place's noon sky over its ground
    sky = noon(json.loads(z.read(s['weather'])).get('SkyTopColors', []))
    b = blocks[s['ground']]; top = b.get('cube', {}).get('top'); top = top[0] if isinstance(top, list) else top
    tint = [int(b['tint'][i:i + 2], 16) for i in (1, 3, 5)] if str(b.get('tint', '')).startswith('#') else None
    if b.get('tintUp') and s.get('tintFrom'):
        m = re.search(r'"Color"\s*:\s*"(#[0-9a-fA-F]{6})"', z.read(s['tintFrom']).decode('utf-8'))
        if m: tint = [int(m.group(1)[i:i + 2], 16) for i in (1, 3, 5)]
    s['chip'] = [hexc(sky), hexc(avg(top, tint)) if top else '#808080']

files = set()
for s in SCENES.values(): files |= {s['weather'], *s['trees']} | ({s['tintFrom']} if s.get('tintFrom') else set())
for b in blocks.values():
    if 'model' in b: files |= {'Common/' + b['model'], *('Common/' + t for t in b['tex'])}
    for k, v in b.get('cube', {}).items(): files |= {'Common/' + x for x in (v if isinstance(v, list) else [v])}
missing = sorted(f for f in files if f not in set(names))
if missing: print('MISSING', missing)

out = os.path.join(os.path.dirname(__file__), '..', 'site', 'app', 'scene-data.js')
with open(out, 'w', encoding='utf-8', newline='\n') as f:
    f.write('// Made by dev/make-scene-data.py from the game\'s own definitions: which of the player\'s game files the in-game backgrounds\n')
    f.write('// and the move set pieces are built from. Paths, names and colours only.\n')
    f.write('export const ZONES = ' + json.dumps(ZONES) + ';\n')
    f.write('export const SCENES = ' + json.dumps(SCENES, indent=1) + ';\n')
    f.write('export const SET_PIECES = ' + json.dumps(SET_PIECES) + ';\n')
    f.write('export const BLOCKS = ' + json.dumps(blocks, indent=1) + ';\n')
    f.write('export const SCENE_FILES = ' + json.dumps(sorted(files)) + ';\n')
print(len(blocks), 'blocks,', len(files), 'files')
