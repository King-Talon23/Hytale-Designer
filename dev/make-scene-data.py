# Writes site/app/scene-data.js: which game files the in-game backgrounds and the move set pieces are built from.
# Everything is read from the game's own definitions in Assets.zip (block textures, models, tints, tree prefabs), so the
# site draws them the way the game does. The output holds only file paths, names and colours, never game art.
# Run: python -I dev/make-scene-data.py "<path to Assets.zip>"
import json, sys, zipfile, os, re

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
Z = 'Server/World/Default/Zones/'
ZONES = {1: 'Emerald Grove', 2: 'Howling Sands', 3: 'Borea', 4: 'Devastated Lands'}
GRASS = [['Plant_Grass_Sharp_Short', 16, 1], ['Plant_Grass_Sharp', 18, 2], ['Plant_Grass_Sharp_Tall', 14], ['Plant_Grass_Sharp_Wild', 9]]


def hexc(c): return '#' + ''.join('%02x' % max(0, min(255, round(v))) for v in c)


def loose(raw):   # the world generator's files carry // and /* */ notes and trailing commas
    t = raw.decode('utf-8'); out = []; i = 0; q = False
    while i < len(t):
        c = t[i]
        if q:
            out.append(c)
            if c == '\\': out.append(t[i + 1]); i += 1
            elif c == '"': q = False
        elif c == '"': q = True; out.append(c)
        elif t.startswith('//', i):
            while i < len(t) and t[i] != '\n': i += 1
            continue
        elif t.startswith('/*', i): i = t.index('*/', i) + 2; continue
        else: out.append(c)
        i += 1
    return json.loads(re.sub(r',(\s*[}\]])', r'\1', ''.join(out)))


ENVS = {p.split('/')[-1][:-5]: p for p in names if p.startswith('Server/Environments/') and p.endswith('.json')}
WEATHERS = {p.split('/')[-1][:-5]: p for p in names if p.startswith(W) and p.endswith('.json')}
def weather(env):   # the weather an environment most often has at noon (its own forecast, or its parent's)
    d = json.loads(z.read(ENVS[env]))
    if 'WeatherForecasts' not in d: return weather(d['Parent'])
    return WEATHERS[max(d['WeatherForecasts']['12'], key=lambda w: w['Weight'])['WeatherId']]

def tint(d):   # the tile's grass colours, blended by their weights
    t = d.get('Tint') or {}; t = t.get('Default', t)
    cs = [c[-6:] for c in t.get('Colors', [])]; ws = t.get('Weights') or [1] * len(cs)
    if not cs: return None
    return hexc([sum(int(c[i:i + 2], 16) * w for c, w in zip(cs, ws)) / sum(ws) for i in (0, 2, 4)])

def size(n):   # 1 low, 2 knee-high, None tall
    if re.search(r'Tall|Wild|Reeds|Fern_Tall|Fern_Wet_Big|Bamboo|Cactus_(?!Ball)', n): return None
    if re.search(r'Short|Flower_Common|Moss_Rug|Moss_Short|_Floor|Crop_Mushroom|Cactus_Ball|^Plant_Moss_(Green|Yellow|Blue)$', n): return 1
    return 2

def plants(d, keep=9):   # the tile's plant covers, each weighted by its density; flowers and mushrooms grow in patches, so count for less
    got = {}
    for c in d.get('Covers', []):
        if c.get('OnWater'): continue
        ts = c['Type']; ws = c.get('Weight') or [1] * len(ts); tot = sum(ws) or 1
        for t, w in zip(ts, ws):
            if not isinstance(t, str) or not t.startswith('Plant_') or t not in ITEMS: continue
            if t.startswith('Plant_Crop_') and 'Mushroom' not in t: continue
            if t.startswith('Plant_Seeds') or t.startswith('Plant_Seaweed'): continue
            patchy = 0.3 if re.search(r'Flower_|Crop_Mushroom|Bush', t) else 1
            got[t] = got.get(t, 0) + (c.get('Density') or 0) * w / tot * patchy
    top = sorted(got.items(), key=lambda x: -x[1])[:keep]
    if not top: return []
    hi = top[0][1]
    return [[n, max(1, round(v / hi * 30))] + ([size(n)] if size(n) else []) for n, v in top]

def prefab(name):   # 'Trees.Birch.Stage_2.*' -> the first prefab in that folder, in the game's own numbering
    parts = name.rstrip('.*').split('.')
    for root in ('Server/Prefabs/Orbis/', 'Server/Prefabs/'):
        for p in ['/'.join(parts) + '/', '/'.join(parts) + '_']:
            found = sorted(f for f in names if f.startswith(root + p) and f.endswith('.prefab.json'))
            if found: return found[0]
    return None

def trees(d, keep=4):   # the tile's trees, grown ones first; logs and stumps only when nothing else stands there
    got = {}
    for e in d.get('Prefabs', {}).get('Entries', []):
        ps = e['Prefab']; ws = e.get('Weight') or [1] * len(ps); tot = sum(ws) or 1
        for p, w in zip(ps, ws):
            if not p.startswith('Trees.') and not p.startswith('Plants.Cacti') and not p.startswith('Plants.Mushroom_Large'): continue
            stage = re.search(r'Stage_(\d+)', p); grown = int(stage.group(1)) if stage else 2
            lying = bool(re.search(r'Logs|Stumps|Rocks', p))
            got[p] = got.get(p, 0) + w / tot * (0.2 if lying else 1) * (0.25 if grown < 1 or '_0' in p else 1)
    out = []
    for p, _ in sorted(got.items(), key=lambda x: -x[1]):
        f = prefab(p)
        if f and f not in out: out.append(f)
        if len(out) == keep: break
    return out


# Every surface biome of the game's real world generator (Server/World/Default/Zones/<Zone>_<Tier>/Tile.<Name>.json), zone by
# zone and tier by tier. From each tile: its plant covers with their weights, its trees, its grass tint and its environment's usual
# noon weather. By hand: the ground and the block under it (the tiles lay those in noise layers), how hilly, how thick the plants and
# how many trees. The keys meadow, desert, tundra and volcanic are the original backgrounds' keys, kept so a saved choice still works.
# [key, zone, tier, tile, name, ground, under, hills, density, treeCount, more]
BIOMES = [
    ['forest_birch', 1, 1, 'Zone1_Tier1/Tile.Forest_Birch', 'Birch Forest', 'Soil_Grass', 'Soil_Dirt', 2, 0.45, 40, {}],
    ['forest_flower', 1, 1, 'Zone1_Tier1/Tile.Forest_Flower', 'Flower Forest', 'Soil_Grass', 'Soil_Dirt', 2, 0.5, 34, {}],
    ['plains_birch', 1, 1, 'Zone1_Tier1/Tile.Plains_Birch', 'Birch Plains', 'Soil_Grass_Full', 'Soil_Dirt', 2, 0.45, 18, {}],
    ['meadow', 1, 1, 'Zone1_Tier1/Tile.Plains_Smooth', 'Meadow', 'Soil_Grass_Full', 'Soil_Dirt', 1, 0.45, 14, {}],
    ['forest_aspen', 1, 2, 'Zone1_Tier2/Tile.Forest_Aspen', 'Aspen Forest', 'Soil_Grass', 'Soil_Dirt', 3, 0.45, 40, {}],
    ['forest_gully', 1, 2, 'Zone1_Tier2/Tile.Forest_Gully', 'Gully Forest', 'Soil_Grass_Deep', 'Soil_Dirt', 6, 0.45, 34, {}],
    ['plains_gorge', 1, 2, 'Zone1_Tier2/Tile.Plains_Gorge', 'Gorge Plains', 'Soil_Grass', 'Rock_Chalk', 7, 0.45, 16, {}],
    ['plains_tallgrass', 1, 2, 'Zone1_Tier2/Tile.Plains_Tallgrass', 'Tallgrass Plains', 'Soil_Grass_Full', 'Soil_Dirt', 2, 0.55, 12, {}],
    ['forest_autumn', 1, 3, 'Zone1_Tier3/Tile.Forest_Autumn', 'Autumn Forest', 'Soil_Grass', 'Soil_Dirt', 3, 0.45, 40, {}],
    ['forest_azure', 1, 3, 'Zone1_Tier3/Tile.Forest_Azure', 'Azure Forest', 'Soil_Grass', 'Soil_Dirt', 3, 0.5, 34, {}],
    ['forest_moss', 1, 3, 'Zone1_Tier3/Tile.Forest_Moss', 'Moss Forest', 'Soil_Grass', 'Soil_Dirt', 2, 0.5, 36, {}],
    ['forest_swamp', 1, 3, 'Zone1_Tier3/Tile.Forest_Swamp', 'Swamp', 'Soil_Grass', 'Soil_Mud', 1, 0.45, 32,
     {'water': {'kind': 'shore', 'bed': 'Soil_Mud', 'plants': [['Plant_Reeds_Marsh', 4], ['Plant_Flower_Water_Green', 2, 1]], 'density': 0.12}}],
    ['savannah_boab', 2, 1, 'Zone2_Tier1/Tile.Savannah_Boab', 'Boab Savannah', 'Soil_Grass_Dry', 'Soil_Clay', 2, 0.35, 14, {}],
    ['savannah_forest', 2, 1, 'Zone2_Tier1/Tile.Savannah_Forest', 'Savannah Forest', 'Soil_Grass_Dry', 'Soil_Clay', 2, 0.35, 26, {}],
    ['savannah_plains', 2, 1, 'Zone2_Tier1/Tile.Savannah_Plains', 'Savannah', 'Soil_Grass_Dry', 'Soil_Clay', 1, 0.35, 10, {}],
    ['savannah_rock', 2, 1, 'Zone2_Tier1/Tile.Savannah_Rock', 'Rocky Savannah', 'Soil_Gravel_Sand_White', 'Rock_Sandstone', 5, 0.15, 16, {}],
    ['scrub_bushland', 2, 1, 'Zone2_Tier1/Tile.Scrub_Bushland', 'Bushland', 'Soil_Grass_Dry', 'Soil_Sand_Red', 2, 0.35, 18, {}],
    ['desert_oasis', 2, 2, 'Zone2_Tier2/Tile.Desert_Oasis', 'Oasis', 'Soil_Sand_White', 'Rock_Sandstone_White', 2, 0.12, 10,
     {'water': {'kind': 'shore', 'bed': 'Soil_Sand_White', 'plants': [['Plant_Reeds_Marsh', 3]], 'density': 0.06}, 'trees': ['Trees.Palm_Green.Stage_3', 'Trees.Palm_Green.Stage_2', 'Plants.Cacti.Full.Stage_1']}],
    ['desert_red', 2, 2, 'Zone2_Tier2/Tile.Desert_Red', 'Red Desert', 'Soil_Sand_Red', 'Rock_Sandstone_Red', 4, 0.1, 6,
     {'trees': ['Trees.Dry_Dead', 'Plants.Cacti.Full.Stage_2']}],
    ['desert_rock', 2, 2, 'Zone2_Tier2/Tile.Desert_Rock', 'Rocky Desert', 'Soil_Sand_White', 'Rock_Sandstone_White', 6, 0.1, 12, {}],
    ['desert_springs', 2, 2, 'Zone2_Tier2/Tile.Desert_Springs', 'Desert Springs', 'Soil_Sand_White', 'Soil_Clay', 2, 0.1, 8, {}],
    ['desert', 2, 3, 'Zone2_Tier3/Tile.Desert_Barren', 'Barren Desert', 'Soil_Sand_White', 'Soil_Dirt_Dry', 2, 0.06, 5,
     {'trees': ['Trees.Dry_Dead', 'Trees.Petrified_Dead.Stage_5']}],
    ['desert_mushroom', 2, 3, 'Zone2_Tier3/Tile.Desert_Mushroom', 'Mushroom Desert', 'Soil_Sand_White', 'Soil_Dirt_Dry', 2, 0.06, 14,
     {'trees': ['Plants.Mushroom_Large.Yellow.Stage_3', 'Plants.Mushroom_Large.Green.Stage_3', 'Plants.Mushroom_Large.Yellow.Stage_1']}],
    ['forest_fir', 3, 1, 'Zone3_Tier1/Tile.Forest_Fir', 'Fir Forest', 'Soil_Grass_Cold', 'Soil_Dirt_Cold', 3, 0.4, 40, {}],
    ['forest_redwood', 3, 1, 'Zone3_Tier1/Tile.Forest_Redwood', 'Redwood Forest', 'Soil_Needles', 'Soil_Dirt_Cold', 2, 0.35, 36, {}],
    ['forest_tundra', 3, 1, 'Zone3_Tier1/Tile.Forest_Tundra', 'Tundra Forest', 'Soil_Grass_Cold', 'Soil_Dirt_Cold', 2, 0.35, 22, {}],
    ['plains_hotsprings', 3, 1, 'Zone3_Tier1/Tile.Plains_Hotsprings', 'Hot Springs', 'Soil_Grass_Cold', 'Rock_Basalt', 2, 0.35, 14,
     {'water': {'kind': 'shore', 'bed': 'Soil_Gravel', 'plants': [['Plant_Reeds_Winter', 3]], 'density': 0.05}}],
    ['plains_shire', 3, 1, 'Zone3_Tier1/Tile.Plains_Shire', 'Shire', 'Soil_Grass', 'Soil_Dirt_Cold', 2, 0.45, 12, {}],
    ['forest_cedar', 3, 2, 'Zone3_Tier2/Tile.Forest_Cedar', 'Cedar Forest', 'Soil_Grass', 'Soil_Dirt', 3, 0.4, 36, {}],
    ['forest_cedar_mixed', 3, 2, 'Zone3_Tier2/Tile.Forest_Cedar_Mixed', 'Mixed Cedar Forest', 'Soil_Grass', 'Soil_Dirt', 3, 0.35, 32, {}],
    ['plains_frozen', 3, 2, 'Zone3_Tier2/Tile.Plains_Frozen', 'Frozen Plains', 'Soil_Snow', 'Soil_Dirt_Cold', 2, 0.2, 12, {}],
    ['plains_tundra', 3, 2, 'Zone3_Tier2/Tile.Plains_Tundra', 'Tundra', 'Soil_Grass_Cold', 'Soil_Dirt_Cold', 2, 0.4, 10, {}],
    ['glacier', 3, 2, 'Zone3_Tier2/Custom.Valley_Glacier', 'Glacier', 'Rock_Ice', 'Rock_Ice_Permafrost', 6, 0.04, 0,
     {'plants': [['Plant_Bush_Winter_Snow', 3], ['Plant_Bush_Winter_Sharp', 2, 2]], 'trees': [], 'prefer': 'Rock_Ice_Permafrost'}],
    ['tundra', 3, 3, 'Zone3_Tier3/Tile.Forest_Frozen', 'Frozen Forest', 'Soil_Snow', 'Soil_Dirt_Cold', 3, 0.2, 34, {}],
    ['forest_frozen_light', 3, 3, 'Zone3_Tier3/Tile.Forest_Frozen_Light', 'Light Frozen Forest', 'Soil_Grass_Cold', 'Soil_Dirt_Cold', 3, 0.35, 30, {}],
    ['plains_frozen_frost', 3, 3, 'Zone3_Tier3/Tile.Plains_Frozen_Frost', 'Frost Plains', 'Soil_Snow', 'Rock_Ice_Permafrost', 2, 0.15, 10, {}],
    ['volcanic', 4, 4, 'Zone4_Tier4/Tile.Desert_Dunes', 'Jungle Dunes', 'Soil_Grass_Deep', 'Soil_Ash', 4, 0.45, 30, {}],
    ['forest_ghost', 4, 4, 'Zone4_Tier4/Tile.Forest_Ghost', 'Ghost Forest', 'Soil_Grass_Burnt', 'Soil_Dirt_Burnt', 3, 0.4, 34, {}],
    ['forest_swamp_4', 4, 4, 'Zone4_Tier4/Tile.Forest_Swamp', 'Poison Swamp', 'Soil_Grass_Burnt', 'Soil_Dirt_Poisoned', 1, 0.45, 28,
     {'water': {'kind': 'shore', 'bed': 'Soil_Dirt_Poisoned', 'plants': [['Plant_Reeds_Poison', 3], ['Plant_Reeds_Water', 3]], 'density': 0.12}}],
    ['wastes_geysers', 4, 4, 'Zone4_Tier4/Tile.Wastes_Geysers', 'Geysers', 'Soil_Grass_Burnt', 'Rock_Basalt', 4, 0.3, 14, {}],
    ['wastes_grasslands', 4, 4, 'Zone4_Tier4/Tile.Wastes_Grasslands', 'Burnt Grasslands', 'Soil_Grass_Burnt', 'Soil_Dirt_Burnt', 2, 0.4, 18, {}],
    ['desert_ash', 4, 5, 'Zone4_Tier5/Tile.Desert_Ash', 'Ash Desert', 'Soil_Ash', 'Rock_Slate', 3, 0.3, 20, {}],
    ['forest_burned', 4, 5, 'Zone4_Tier5/Tile.Forest_Burned', 'Burned Forest', 'Soil_Grass_Burnt', 'Rock_Volcanic', 3, 0.4, 30, {'lava': True}],
    ['forest_roots', 4, 5, 'Zone4_Tier5/Tile.Forest_Roots', 'Root Forest', 'Soil_Grass_Burnt', 'Soil_Dirt_Burnt', 2, 0.45, 26, {}],
    ['wastes_ash', 4, 5, 'Zone4_Tier5/Tile.Wastes_Ash', 'Ash Wastes', 'Soil_Sand_Ashen', 'Rock_Slate', 3, 0.3, 18, {}],
    ['wastes_lava', 4, 5, 'Zone4_Tier5/Tile.Wastes_Lava', 'Lava Wastes', 'Rock_Volcanic', 'Rock_Volcanic', 6, 0.2, 12, {'lava': True}],
]
NAMES = set(names)
def ref(f): return 'Server/World/Default/' + f.replace('.', '/') + '.json'
def refs(node, out):   # every world generator file a part of a tile refers to, and the files those refer to
    if isinstance(node, list):
        for n in node: refs(n, out)
    elif isinstance(node, dict):
        for k, v in node.items():
            if k == 'File' and isinstance(v, str):
                p = ref(v)
                if p in NAMES and p not in out:
                    out.add(p); refs(loose(z.read(p)), out)
            else: refs(v, out)
    return out
def prefabs(name, keep=3):   # 'Trees.Birch.Stage_2.*' -> up to `keep` of the prefabs in that folder, spread over the game's numbering
    parts = name.rstrip('.*').split('.')
    for root in ('Server/Prefabs/Orbis/', 'Server/Prefabs/'):
        for p in ['/'.join(parts) + '/', '/'.join(parts) + '_']:
            found = sorted(f for f in names if f.startswith(root + p) and f.endswith('.prefab.json'))
            if found: return list(dict.fromkeys(found[round(i * (len(found) - 1) / max(1, keep - 1))] for i in range(min(keep, len(found)))))
    return []
GROWN = ('Trees.', 'Plants.Cacti', 'Plants.Mushroom_Large')
def forest(d):   # the tile's tree patterns: where its trees stand (a jittered grid, masks) and which prefabs, by weight
    out = []
    for e in d.get('Prefabs', {}).get('Entries', []):
        pat = e.get('Pattern'); ps = e['Prefab']; ws = e.get('Weight') or [1] * len(ps)
        if not isinstance(pat, dict): continue
        if 'File' in pat:   # a pattern file, or the pattern written into the tile itself
            if ref(pat['File']) not in NAMES or 'GridGenerator' not in loose(z.read(ref(pat['File']))): continue
            pat = ref(pat['File'])
        elif 'GridGenerator' not in pat: continue
        got = []
        for p, w in zip(ps, ws):
            if not p.startswith(GROWN) or re.search(r'Logs|Stumps', p): continue
            fs = prefabs(p)
            got += [[f, w / len(fs)] for f in fs]
        if got: out.append({'pattern': pat, 'prefabs': got})
    return out
def layerBlocks(d):   # the blocks a tile's surface layers, filling rock and solid water use
    L = d.get('Layers') or {}; got = {L.get('Default') or 'Rock_Stone'}
    def blk(b): return (b if isinstance(b, str) else b.get('Type') or '').split(':')[0]
    for g in L.get('Dynamic', []):
        g = loose(z.read(ref(g['File']))) if 'File' in g else g
        for e in g.get('Entries') or [g]:
            bs = e.get('Blocks', [])
            for b in ([bs] if isinstance(bs, str) else bs): got.add(blk(b))
    for e in (d.get('Water') or {}).get('Entries', []):
        if e.get('Block'): got.add(e['Block'])
    return {b for b in got if b and b in ITEMS}
SCENES = {}
for key, zone, tier, tile, name, ground, under, hills, density, count, more in BIOMES:
    d = loose(z.read(Z + tile + '.json'))
    env = (d.get('Environment', {}).get('Default') or d.get('Environment', {})).get('Names', ['Env_Zone%d' % zone])[0]
    s = {'zone': zone, 'tier': tier, 'name': name, 'weather': weather(env), 'tint': tint(d), 'ground': ground, 'under': under, 'hills': hills,
         'plants': plants(d), 'density': density,
         'trees': [prefab(t) for t in more.pop('trees')] if 'trees' in more else trees(d), 'treeCount': count,
         'tile': Z + tile + '.json', 'forest': forest(d), 'layers': sorted(layerBlocks(d))}
    s.update(more)
    if not s['trees']: s['treeCount'] = 0
    SCENES[key] = s

# Rivers and shores, and the open sea the swim moves switch to (zone 5). Their names and keys are the ones saved choices use.
def wet(key, zone, tier, name, like, kind, bed, wplants, wdens, ground, under, plants_, density, trees_, count, weather_=None):
    s = dict(SCENES[like]); s.update({'zone': zone, 'tier': tier, 'name': name, 'ground': ground, 'under': under, 'hills': 1, 'density': density,
                                       'water': {'kind': kind, 'bed': bed, 'plants': wplants, 'density': wdens}, 'treeCount': count})
    if plants_ is not None: s['plants'] = plants_
    if trees_ is not None: s['trees'] = [prefab(t) for t in trees_]
    if weather_: s['weather'] = W + weather_
    SCENES[key] = s
SEAWEED = [['Plant_Seaweed_Grass', 6, 1]]
wet('riverbank', 1, 1, 'Riverbank', 'meadow', 'river', 'Soil_Gravel', SEAWEED, 0.12, 'Soil_Grass', 'Soil_Gravel',
    GRASS + [['Plant_Reeds_Marsh', 4], ['Plant_Fern_Forest', 2, 2], ['Plant_Flower_Bushy_Green', 2, 1]], 0.5,
    ['Trees.Oak.Stage_5', 'Trees.Birch.Stage_1', 'Trees.Beech_Fallen.Stage_1'], 30, 'Zone1/Zone1_Sunny_Fireflies.json')
wet('desertriver', 2, 1, 'Dry River', 'savannah_plains', 'river', 'Soil_Gravel_Sand', [], 0, 'Soil_Gravel_Sand', 'Soil_Clay_Orange', None, 0.12,
    ['Trees.Palo.Stage_3'], 16)
wet('desertshore', 2, 2, 'Desert Shore', 'desert_springs', 'shore', 'Soil_Sand_White', [['Plant_Seaweed_Grass', 4, 1]], 0.06,
    'Soil_Sand_White', 'Rock_Sandstone', [['Plant_Grass_Arid_Short', 6, 1], ['Plant_Grass_Arid', 3, 2]], 0.05, ['Trees.Palm.Stage_2'], 8)
wet('taigariver', 3, 1, 'Cold River', 'forest_fir', 'river', 'Soil_Gravel', SEAWEED, 0.1, 'Soil_Grass_Cold', 'Soil_Gravel', None, 0.4,
    ['Trees.Fir.Stage_2', 'Trees.Fir.Stage_1', 'Trees.Cedar_Logs.Small'], 30, 'Zone3/Zone3_Rain.json')
wet('taigashore', 3, 1, 'Cold Shore', 'forest_fir', 'shore', 'Soil_Gravel_Sand', [['Plant_Seaweed_Grass', 4, 1]], 0.1, 'Soil_Gravel_Sand', 'Soil_Gravel',
    [['Plant_Grass_Sharp', 6, 2], ['Plant_Grass_Rocky', 4, 1]], 0.15, ['Trees.Fir.Stage_2', 'Trees.Cedar_Burnt.Stage_2'], 18)
wet('ashriver', 4, 4, 'Ashen River', 'wastes_grasslands', 'river', 'Soil_Sand_Ashen', [], 0, 'Soil_Sand_Ashen', 'Rock_Volcanic',
    [['Plant_Bush_Dead_Twisted', 2], ['Plant_Grass_Gnarled_Short', 3, 1]], 0.05, ['Trees.Ash_Dead.Stage_2'], 14)
wet('ashshore', 4, 4, 'Ashen Shore', 'wastes_grasslands', 'shore', 'Soil_Sand_Ashen', [], 0, 'Soil_Sand_Ashen', 'Soil_Clay_Smooth_Black',
    [['Plant_Bush_Dead_Twisted', 2]], 0.03, ['Trees.Ash_Dead.Stage_2'], 20, 'Zone4/Zone4_Storm.json')
# the sea between the zones (Env_Zone0 -> Zone1_Sunny): water to the haze, seaweed and coral on the bed. Not in the menu: the swim moves
# switch to it on their own (swim: True).
SCENES['ocean'] = {'swim': True, 'zone': 0, 'tier': 0, 'name': 'Open Sea', 'weather': W + 'Zone1/Zone1_Sunny.json', 'tintFrom': B + 'Ocean1/Oceans.json',
                   'water': {'kind': 'sea', 'bed': 'Soil_Sand', 'depth': 3, 'density': 0.22,
                             'plants': [['Plant_Seaweed_Grass', 10, 1], ['Plant_Seaweed_Grass_Tall', 6], ['Plant_Seaweed_Grass_Stack', 3],
                                        ['Plant_Coral_Bush_Pink', 2], ['Plant_Coral_Bush_Cyan', 2], ['Plant_Coral_Bush_Yellow', 1], ['Plant_Coral_Bush_Purple', 1]]},
                   'ground': 'Soil_Sand', 'under': 'Soil_Sand', 'hills': 1,
                   'plants': [], 'density': 0,
                   'trees': [], 'treeCount': 0}
# old keys from the first set of backgrounds -> the biome nearest them, so a saved choice still finds its place
ALIASES = {'hills': 'plains_tallgrass', 'gorges': 'plains_gorge', 'trork': 'forest_aspen', 'oasis': 'desert_oasis', 'rocky': 'desert_rock',
           'taiga': 'forest_fir', 'redwood': 'forest_redwood', 'hedera': 'forest_tundra', 'caldera': 'wastes_lava'}
for k, s in SCENES.items():
    if None in s['trees']: raise KeyError('no tree prefab in ' + k)

# the things the moves use, from the game's village furniture set and benches
SET_PIECES = {'chair': 'Furniture_Village_Chair', 'bed': 'Furniture_Village_Bed', 'ladder': 'Furniture_Village_Ladder', 'bench': 'Bench_WorkBench', 'wall': 'Wood_Softwood_Planks'}

blocks = {}
for s in SCENES.values():
    for b in [s['ground'], s['under']] + s.get('layers', []) + [p[0] for p in s['plants']] + ([s['water']['bed']] + [p[0] for p in s['water']['plants']] if s.get('water') else []): blocks[b] = block(b)
    for t in s['trees'] + [p[0] for f in s.get('forest', []) for p in f['prefabs']]:
        for b in {x['name'] for x in json.loads(z.read(t))['blocks']}:
            try: blocks[b] = block(b)
            except KeyError: print('no definition for', b)
for k, b in SET_PIECES.items(): blocks[b] = block(b)

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
for s in SCENES.values():   # the menu's chip: the place's noon sky over its ground
    sky = noon(json.loads(z.read(s['weather'])).get('SkyTopColors', []))
    b = blocks[s['ground']]; top = b.get('cube', {}).get('top'); top = top[0] if isinstance(top, list) else top
    tint = [int(b['tint'][i:i + 2], 16) for i in (1, 3, 5)] if str(b.get('tint', '')).startswith('#') else None
    if b.get('tintUp') and s.get('tint'): tint = [int(s['tint'][i:i + 2], 16) for i in (1, 3, 5)]
    elif b.get('tintUp') and s.get('tintFrom'):
        m = re.search(r'"Color"\s*:\s*"(#[0-9a-fA-F]{6})"', z.read(s['tintFrom']).decode('utf-8'))
        if m: tint = [int(m.group(1)[i:i + 2], 16) for i in (1, 3, 5)]
    s['chip'] = [hexc(sky), hexc(avg(top, tint)) if top else '#808080']

files = set()
for s in SCENES.values(): files |= {s['weather'], *s['trees']} | ({s['tintFrom']} if s.get('tintFrom') else set())
# the far land: each tile and the noise files its ground, water, surface layers and tree patterns are made from
for s in SCENES.values():
    if not s.get('tile'): continue
    d = loose(z.read(s['tile'])); files.add(s['tile'])
    refs([d.get('HeightmapNoise'), d.get('TerrainHeightThreshold'), d.get('Water'), (d.get('Layers') or {}).get('Dynamic')], files)
    for f in s.get('forest', []):
        files |= {*(p[0] for p in f['prefabs'])}
        pat = f['pattern']
        if isinstance(pat, str): files.add(pat); pat = loose(z.read(pat))
        refs(pat.get('NoiseMask'), files)
for b in blocks.values():
    if 'model' in b: files |= {'Common/' + b['model'], *('Common/' + t for t in b['tex'])}
    for k, v in b.get('cube', {}).items(): files |= {'Common/' + x for x in (v if isinstance(v, list) else [v])}
missing = sorted(f for f in files if f not in set(names))
if missing: print('MISSING', missing)

# where each place's level clearing goes in its tile and the block its ground takes, worked out by the site's own terrain code
# (dev/land-sites.mjs), so the page can lay the clearing at once while the land around it is still being worked out
import subprocess, tempfile
here = os.path.dirname(os.path.abspath(__file__))
work = {}
for k, s in SCENES.items():
    if not s.get('tile') or (s.get('water') or {}).get('kind') == 'sea': continue
    d = loose(z.read(s['tile']))
    need = refs([d.get('HeightmapNoise'), d.get('TerrainHeightThreshold'), d.get('Water'), (d.get('Layers') or {}).get('Dynamic')], set())
    work[k] = {'tile': z.read(s['tile']).decode('utf-8'), 'files': {p: z.read(p).decode('utf-8') for p in need}, 'ground': s['ground'], 'prefer': s.pop('prefer', None)}
with tempfile.TemporaryDirectory() as tmp:
    src, dst = os.path.join(tmp, 'in.json'), os.path.join(tmp, 'out.json')
    json.dump(work, open(src, 'w', encoding='utf-8'))
    subprocess.run(['node', os.path.join(here, 'land-sites.mjs'), src, dst], check=True)
    for k, site in json.load(open(dst, encoding='utf-8')).items():
        if site['rim'] not in blocks: blocks[site['rim']] = block(site['rim'])
        SCENES[k]['site'] = site

out = os.path.join(os.path.dirname(__file__), '..', 'site', 'app', 'scene-data.js')
with open(out, 'w', encoding='utf-8', newline='\n') as f:
    f.write('// Made by dev/make-scene-data.py from the game\'s own definitions: which of the player\'s game files the in-game backgrounds\n')
    f.write('// and the move set pieces are built from. Paths, names and colours only.\n')
    f.write('export const ZONES = ' + json.dumps(ZONES) + ';\n')
    f.write('export const SCENES = ' + json.dumps(SCENES, indent=1) + ';\n')
    f.write('export const SCENE_ALIASES = ' + json.dumps(ALIASES) + ';\n')
    f.write('export const SET_PIECES = ' + json.dumps(SET_PIECES) + ';\n')
    f.write('export const BLOCKS = ' + json.dumps(blocks, indent=1) + ';\n')
    f.write('export const SCENE_FILES = ' + json.dumps(sorted(files)) + ';\n')
print(len(blocks), 'blocks,', len(files), 'files')
