// Made by dev/make-scene-data.py from the game's own definitions: which of the player's game files the in-game backgrounds
// and the move set pieces are built from. Paths, names and colours only.
export const ZONES = {"1": "Emerald Grove", "2": "Howling Sands", "3": "Borea", "4": "Devastated Lands"};
export const SCENES = {
 "forest_birch": {
  "zone": 1,
  "tier": 1,
  "name": "Birch Forest",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tint": "#729915",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Lush_Short",
    30,
    1
   ],
   [
    "Plant_Flower_Tall_Purple",
    19
   ],
   [
    "Plant_Bush_Green",
    15,
    2
   ],
   [
    "Plant_Grass_Lush",
    13,
    2
   ],
   [
    "Plant_Flower_Common_Yellow",
    10,
    1
   ],
   [
    "Plant_Flower_Common_Cyan2",
    10,
    1
   ],
   [
    "Plant_Flower_Common_Violet",
    8,
    1
   ],
   [
    "Plant_Grass_Lush_Tall",
    4
   ],
   [
    "Plant_Crop_Mushroom_Cap_Brown",
    3,
    1
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json"
  ],
  "treeCount": 40,
  "chip": [
   "#077ad9",
   "#6b9014"
  ]
 },
 "forest_flower": {
  "zone": 1,
  "tier": 1,
  "name": "Flower Forest",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tint": "#468c2c",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Sharp",
    30,
    2
   ],
   [
    "Plant_Grass_Lush",
    13,
    2
   ],
   [
    "Plant_Grass_Lush_Tall",
    8
   ],
   [
    "Plant_Grass_Lush_Short",
    8,
    1
   ],
   [
    "Plant_Flower_Common_Cyan2",
    2,
    1
   ],
   [
    "Plant_Flower_Common_Red2",
    2,
    1
   ],
   [
    "Plant_Bush",
    2,
    2
   ],
   [
    "Plant_Flower_Common_Yellow",
    2,
    1
   ],
   [
    "Plant_Flower_Flax_Blue",
    2,
    2
   ]
  ],
  "density": 0.5,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Birch/Stage_4/Birch_Stage4_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_001.prefab.json"
  ],
  "treeCount": 34,
  "chip": [
   "#077ad9",
   "#428429"
  ]
 },
 "plains_birch": {
  "zone": 1,
  "tier": 1,
  "name": "Birch Plains",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tint": "#69a128",
  "ground": "Soil_Grass_Full",
  "under": "Soil_Dirt",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Sharp",
    30,
    2
   ],
   [
    "Plant_Grass_Sharp_Tall",
    7
   ],
   [
    "Plant_Grass_Lush_Short",
    6,
    1
   ],
   [
    "Plant_Flower_Tall_Purple",
    4
   ],
   [
    "Plant_Bush_Green",
    3,
    2
   ],
   [
    "Plant_Grass_Sharp_Short",
    3,
    1
   ],
   [
    "Plant_Crop_Mushroom_Cap_Brown",
    1,
    1
   ],
   [
    "Plant_Crop_Mushroom_Cap_White",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Violet",
    1,
    1
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Beech/Stage_1/Beech_Stage1_001.prefab.json",
   "Server/Prefabs/Trees/Logs/Birch/Moss/Logs_Birch_Moss_001.prefab.json"
  ],
  "treeCount": 18,
  "chip": [
   "#077ad9",
   "#639726"
  ]
 },
 "meadow": {
  "zone": 1,
  "tier": 1,
  "name": "Meadow",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tint": "#53932b",
  "ground": "Soil_Grass_Full",
  "under": "Soil_Dirt",
  "hills": 1,
  "plants": [
   [
    "Plant_Grass_Sharp",
    30,
    2
   ],
   [
    "Plant_Grass_Sharp_Tall",
    12
   ],
   [
    "Plant_Bush",
    10,
    2
   ],
   [
    "Plant_Grass_Sharp_Wild",
    9
   ],
   [
    "Plant_Grass_Lush_Short",
    7,
    1
   ],
   [
    "Plant_Bush_Green",
    5,
    2
   ],
   [
    "Plant_Grass_Sharp_Short",
    4,
    1
   ],
   [
    "Plant_Flower_Common_Red2",
    3,
    1
   ],
   [
    "Plant_Flower_Common_White2",
    3,
    1
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json"
  ],
  "treeCount": 14,
  "chip": [
   "#077ad9",
   "#4e8a28"
  ]
 },
 "forest_aspen": {
  "zone": 1,
  "tier": 2,
  "name": "Aspen Forest",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tint": "#7f8c20",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 3,
  "plants": [
   [
    "Plant_Moss_Green",
    30,
    1
   ],
   [
    "Plant_Grass_Lush_Short",
    18,
    1
   ],
   [
    "Plant_Bush_Green",
    8,
    2
   ],
   [
    "Plant_Grass_Lush",
    7,
    2
   ],
   [
    "Plant_Fern_Winter",
    3,
    2
   ],
   [
    "Plant_Flower_Common_White2",
    2,
    1
   ],
   [
    "Plant_Grass_Lush_Tall",
    2
   ],
   [
    "Plant_Flower_Common_Yellow",
    2,
    1
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    2,
    1
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_001.prefab.json"
  ],
  "treeCount": 40,
  "chip": [
   "#077ad9",
   "#77841e"
  ]
 },
 "forest_gully": {
  "zone": 1,
  "tier": 2,
  "name": "Gully Forest",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tint": "#468c2c",
  "ground": "Soil_Grass_Deep",
  "under": "Soil_Dirt",
  "hills": 6,
  "plants": [
   [
    "Plant_Grass_Sharp",
    30,
    2
   ],
   [
    "Plant_Fern_Winter",
    5,
    2
   ],
   [
    "Plant_Grass_Lush_Short",
    4,
    1
   ],
   [
    "Plant_Grass_Lush",
    3,
    2
   ],
   [
    "Plant_Bush_Green",
    3,
    2
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    2,
    1
   ],
   [
    "Plant_Grass_Sharp_Short",
    1,
    1
   ],
   [
    "Plant_Grass_Lush_Tall",
    1
   ],
   [
    "Plant_Flower_Flax_Blue",
    1,
    2
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_001.prefab.json"
  ],
  "treeCount": 34,
  "chip": [
   "#077ad9",
   "#3b7725"
  ]
 },
 "plains_gorge": {
  "zone": 1,
  "tier": 2,
  "name": "Gorge Plains",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tint": "#6ca228",
  "ground": "Soil_Grass",
  "under": "Rock_Chalk",
  "hills": 7,
  "plants": [
   [
    "Plant_Grass_Sharp",
    30,
    2
   ],
   [
    "Plant_Grass_Sharp_Tall",
    10
   ],
   [
    "Plant_Grass_Sharp_Wild",
    7
   ],
   [
    "Plant_Grass_Lush_Short",
    6,
    1
   ],
   [
    "Plant_Flower_Tall_Yellow",
    4
   ],
   [
    "Plant_Bush_Green",
    4,
    2
   ],
   [
    "Plant_Grass_Sharp_Short",
    3,
    1
   ],
   [
    "Plant_Crop_Mushroom_Cap_Brown",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Violet",
    1,
    1
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json"
  ],
  "treeCount": 16,
  "chip": [
   "#077ad9",
   "#659826"
  ]
 },
 "plains_tallgrass": {
  "zone": 1,
  "tier": 2,
  "name": "Tallgrass Plains",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tint": "#69a128",
  "ground": "Soil_Grass_Full",
  "under": "Soil_Dirt",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Sharp_Wild",
    30
   ],
   [
    "Plant_Grass_Sharp_Tall",
    30
   ],
   [
    "Plant_Grass_Sharp",
    26,
    2
   ],
   [
    "Plant_Bush_Green",
    14,
    2
   ],
   [
    "Plant_Grass_Lush_Short",
    4,
    1
   ],
   [
    "Plant_Flower_Tall_Yellow",
    4
   ],
   [
    "Plant_Crop_Mushroom_Cap_Brown",
    1,
    1
   ],
   [
    "Plant_Flower_Flax_Blue",
    1,
    2
   ],
   [
    "Plant_Flower_Common_Yellow2",
    1,
    1
   ]
  ],
  "density": 0.55,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Birch/Stage_0/Birch_Stage0_001.prefab.json"
  ],
  "treeCount": 12,
  "chip": [
   "#077ad9",
   "#639726"
  ]
 },
 "forest_autumn": {
  "zone": 1,
  "tier": 3,
  "name": "Autumn Forest",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tint": "#b2692b",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 3,
  "plants": [
   [
    "Plant_Leaves_Autumn_Floor",
    30,
    1
   ],
   [
    "Plant_Grass_Sharp",
    24,
    2
   ],
   [
    "Plant_Fern_Winter",
    18,
    2
   ],
   [
    "Plant_Reeds_Marsh",
    14
   ],
   [
    "Plant_Fern_Forest",
    12,
    2
   ],
   [
    "Plant_Bush_Dead_Twisted",
    3,
    2
   ],
   [
    "Plant_Bush_Lush",
    2,
    2
   ],
   [
    "Plant_Crop_Mushroom_Cap_Red",
    2,
    1
   ],
   [
    "Plant_Grass_Lush_Short",
    1,
    1
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Autumn/Stage_2/Autumn_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Maple/Stage_2/Maple_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json"
  ],
  "treeCount": 40,
  "chip": [
   "#077ad9",
   "#a76328"
  ]
 },
 "forest_azure": {
  "zone": 1,
  "tier": 3,
  "name": "Azure Forest",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tint": "#2f828a",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 3,
  "plants": [
   [
    "Plant_Moss_Rug_Blue",
    30,
    1
   ],
   [
    "Plant_Grass_Lush",
    25,
    2
   ],
   [
    "Plant_Grass_Sharp_Tall",
    19
   ],
   [
    "Plant_Flower_Bushy_Blue",
    6,
    2
   ],
   [
    "Plant_Grass_Sharp",
    5,
    2
   ],
   [
    "Plant_Crop_Mushroom_Common_Blue",
    4,
    1
   ],
   [
    "Plant_Crop_Mushroom_Glowing_Violet",
    3,
    1
   ],
   [
    "Plant_Grass_Lush_Short",
    2,
    1
   ],
   [
    "Plant_Crop_Mushroom_Glowing_Blue",
    1,
    1
   ]
  ],
  "density": 0.5,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Azure/Stage_2/Azure_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Azure/Stage_3/Azure_Stage3_001.prefab.json"
  ],
  "treeCount": 34,
  "chip": [
   "#077ad9",
   "#2c7a82"
  ]
 },
 "forest_moss": {
  "zone": 1,
  "tier": 3,
  "name": "Moss Forest",
  "weather": "Server/Weathers/Zone1/Zone1_Swamp.json",
  "tint": "#65750d",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 2,
  "plants": [
   [
    "Plant_Moss_Rug_Yellow",
    30,
    1
   ],
   [
    "Plant_Moss_Short_Green",
    13,
    1
   ],
   [
    "Plant_Moss_Short_Yellow",
    13,
    1
   ],
   [
    "Plant_Grass_Lush",
    10,
    2
   ],
   [
    "Plant_Grass_Lush_Tall",
    10
   ],
   [
    "Plant_Flower_Tall_Purple",
    5
   ],
   [
    "Plant_Fern_Winter",
    4,
    2
   ],
   [
    "Plant_Grass_Lush_Short",
    3,
    1
   ],
   [
    "Plant_Moss_Green",
    3,
    1
   ]
  ],
  "density": 0.5,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
   "Server/Prefabs/Trees/Oak_Moss/Stage_4/Oak_Moss_Stage4_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash_Moss/Stage_3/Ash_Moss_Stage3_001.prefab.json"
  ],
  "treeCount": 36,
  "chip": [
   "#6ecbdf",
   "#5f6e0c"
  ]
 },
 "forest_swamp": {
  "zone": 1,
  "tier": 3,
  "name": "Swamp",
  "weather": "Server/Weathers/Zone1/Zone1_Swamp.json",
  "tint": "#446014",
  "ground": "Soil_Grass",
  "under": "Soil_Mud",
  "hills": 1,
  "plants": [
   [
    "Plant_Grass_Lush_Short",
    30,
    1
   ],
   [
    "Plant_Reeds_Marsh",
    25
   ],
   [
    "Plant_Grass_Lush",
    12,
    2
   ],
   [
    "Plant_Crop_Mushroom_Flatcap_Green",
    7,
    1
   ],
   [
    "Plant_Crop_Mushroom_Cap_Red",
    7,
    1
   ],
   [
    "Plant_Fern_Winter",
    5,
    2
   ],
   [
    "Plant_Grass_Lush_Tall",
    4
   ],
   [
    "Plant_Grass_Sharp",
    3,
    2
   ],
   [
    "Plant_Flower_Flax_Blue",
    1,
    2
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
   "Server/Prefabs/Trees/Ash_swamp/Stage_4/Ash_swamp_Stage4_001.prefab.json",
   "Server/Prefabs/Trees/Ash_swamp/Stage_2/Ash_swamp_Stage2_001.prefab.json",
   "Server/Prefabs/Trees/Ash_swamp/Stage_3/Ash_swamp_Stage3_001.prefab.json"
  ],
  "treeCount": 32,
  "water": {
   "kind": "shore",
   "bed": "Soil_Mud",
   "plants": [
    [
     "Plant_Reeds_Marsh",
     4
    ],
    [
     "Plant_Flower_Water_Green",
     2,
     1
    ]
   ],
   "density": 0.12
  },
  "chip": [
   "#6ecbdf",
   "#405a13"
  ]
 },
 "savannah_boab": {
  "zone": 2,
  "tier": 1,
  "name": "Boab Savannah",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#d6aa45",
  "ground": "Soil_Grass_Dry",
  "under": "Soil_Clay",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Arid",
    30,
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    26,
    1
   ],
   [
    "Plant_Grass_Dry_Tall",
    13
   ],
   [
    "Plant_Grass_Arid_Tall",
    8
   ],
   [
    "Plant_Grass_Dry",
    6,
    2
   ],
   [
    "Plant_Cactus_Ball_1",
    3,
    1
   ],
   [
    "Plant_Flower_Bushy_Yellow",
    1,
    2
   ],
   [
    "Plant_Flower_Common_Purple",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Blue",
    1,
    1
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Boab/Stage_1/Boab_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json"
  ],
  "treeCount": 14,
  "chip": [
   "#0081b2",
   "#ce993b"
  ]
 },
 "savannah_forest": {
  "zone": 2,
  "tier": 1,
  "name": "Savannah Forest",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#bbb22c",
  "ground": "Soil_Grass_Dry",
  "under": "Soil_Clay",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Arid",
    30,
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    26,
    1
   ],
   [
    "Plant_Grass_Dry_Tall",
    13
   ],
   [
    "Plant_Grass_Arid_Tall",
    8
   ],
   [
    "Plant_Grass_Dry",
    6,
    2
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Blue",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Purple",
    1,
    1
   ],
   [
    "Plant_Flower_Common_White",
    1,
    1
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json"
  ],
  "treeCount": 26,
  "chip": [
   "#0081b2",
   "#b4a026"
  ]
 },
 "savannah_plains": {
  "zone": 2,
  "tier": 1,
  "name": "Savannah",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#dec13c",
  "ground": "Soil_Grass_Dry",
  "under": "Soil_Clay",
  "hills": 1,
  "plants": [
   [
    "Plant_Grass_Arid",
    30,
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    26,
    1
   ],
   [
    "Plant_Grass_Dry_Tall",
    13
   ],
   [
    "Plant_Grass_Arid_Tall",
    8
   ],
   [
    "Plant_Grass_Dry",
    6,
    2
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Blue",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Purple",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Cyan",
    1,
    1
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Boab/Stage_1/Boab_Stage1_001.prefab.json"
  ],
  "treeCount": 10,
  "chip": [
   "#0081b2",
   "#d6ae34"
  ]
 },
 "savannah_rock": {
  "zone": 2,
  "tier": 1,
  "name": "Rocky Savannah",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#dfca6d",
  "ground": "Soil_Gravel_Sand_White",
  "under": "Rock_Sandstone",
  "hills": 5,
  "plants": [
   [
    "Plant_Bramble_Dry_Twisted",
    30,
    2
   ],
   [
    "Plant_Bush_Arid",
    9,
    2
   ],
   [
    "Plant_Grass_Arid_Tall",
    4
   ],
   [
    "Plant_Grass_Dry_Tall",
    2
   ],
   [
    "Plant_Grass_Arid",
    1,
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Blue2",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Lime2",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Poisoned",
    1,
    1
   ]
  ],
  "density": 0.15,
  "trees": [
   "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json",
   "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_001.prefab.json",
   "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_001.prefab.json",
   "Server/Prefabs/Plants/Cacti/Flat/Stage_1/Cacti_Flat_Stage_1_001.prefab.json"
  ],
  "treeCount": 16,
  "chip": [
   "#0081b2",
   "#caaf67"
  ]
 },
 "scrub_bushland": {
  "zone": 2,
  "tier": 1,
  "name": "Bushland",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#d79437",
  "ground": "Soil_Grass_Dry",
  "under": "Soil_Sand_Red",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Arid",
    30,
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    19,
    1
   ],
   [
    "Plant_Grass_Dry_Tall",
    10
   ],
   [
    "Plant_Grass_Arid_Tall",
    6
   ],
   [
    "Plant_Bramble_Dry_Sandthorn",
    5,
    2
   ],
   [
    "Plant_Grass_Dry",
    4,
    2
   ],
   [
    "Plant_Flower_Flax_Orange",
    2,
    2
   ],
   [
    "Plant_Flower_Common_White",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Blue",
    1,
    1
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Gum/Stage_1/Gum_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Gum/Stage_4/Gum_Stage4_001.prefab.json"
  ],
  "treeCount": 18,
  "chip": [
   "#0081b2",
   "#cf852f"
  ]
 },
 "desert_oasis": {
  "zone": 2,
  "tier": 2,
  "name": "Oasis",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#a7b728",
  "ground": "Soil_Sand_White",
  "under": "Rock_Sandstone_White",
  "hills": 2,
  "plants": [
   [
    "Plant_Bramble_Dry_Twisted",
    30,
    2
   ],
   [
    "Plant_Leaves_Bramble",
    3,
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    3,
    1
   ],
   [
    "Plant_Grass_Arid",
    2,
    2
   ],
   [
    "Plant_Flower_Common_Blue2",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Lime2",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Poisoned",
    1,
    1
   ]
  ],
  "density": 0.12,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Palm_Green/Stage_3/Palm_Green_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Palm_Green/Stage_2/Palm_Green_Stage2_001.prefab.json",
   "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json"
  ],
  "treeCount": 10,
  "water": {
   "kind": "shore",
   "bed": "Soil_Sand_White",
   "plants": [
    [
     "Plant_Reeds_Marsh",
     3
    ]
   ],
   "density": 0.06
  },
  "chip": [
   "#0081b2",
   "#e0c569"
  ]
 },
 "desert_red": {
  "zone": 2,
  "tier": 2,
  "name": "Red Desert",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#d79437",
  "ground": "Soil_Sand_Red",
  "under": "Rock_Sandstone_Red",
  "hills": 4,
  "plants": [
   [
    "Plant_Bramble_Dry_Sandthorn",
    30,
    2
   ],
   [
    "Plant_Grass_Arid_Tall",
    30
   ],
   [
    "Plant_Grass_Arid",
    20,
    2
   ],
   [
    "Plant_Flower_Common_Blue2",
    3,
    1
   ]
  ],
  "density": 0.1,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_2/Dry_Dead_Stage2_001.prefab.json",
   "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_001.prefab.json"
  ],
  "treeCount": 6,
  "chip": [
   "#0081b2",
   "#b2743a"
  ]
 },
 "desert_rock": {
  "zone": 2,
  "tier": 2,
  "name": "Rocky Desert",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#d2ba6d",
  "ground": "Soil_Sand_White",
  "under": "Rock_Sandstone_White",
  "hills": 6,
  "plants": [
   [
    "Plant_Bramble_Dry_Twisted",
    30,
    2
   ],
   [
    "Plant_Leaves_Bramble",
    2,
    2
   ],
   [
    "Plant_Bush_Arid",
    2,
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    2,
    1
   ],
   [
    "Plant_Grass_Arid",
    1,
    2
   ],
   [
    "Plant_Flower_Common_Blue2",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Lime2",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Grey2",
    1,
    1
   ],
   [
    "Plant_Flower_Bushy_Red",
    1,
    2
   ]
  ],
  "density": 0.1,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Palo/Stage_3/Palo_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_2/Dry_Dead_Stage2_001.prefab.json",
   "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json",
   "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_001.prefab.json"
  ],
  "treeCount": 12,
  "chip": [
   "#0081b2",
   "#e0c569"
  ]
 },
 "desert_springs": {
  "zone": 2,
  "tier": 2,
  "name": "Desert Springs",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#d2ba6d",
  "ground": "Soil_Sand_White",
  "under": "Soil_Clay",
  "hills": 2,
  "plants": [
   [
    "Plant_Bush_Arid_Sharp",
    30,
    2
   ],
   [
    "Plant_Bush_Arid",
    20,
    2
   ],
   [
    "Plant_Flower_Common_Blue2",
    2,
    1
   ],
   [
    "Plant_Flower_Common_Lime2",
    2,
    1
   ],
   [
    "Plant_Flower_Common_Poisoned",
    1,
    1
   ],
   [
    "Plant_Flower_Flax_Orange",
    1,
    2
   ]
  ],
  "density": 0.1,
  "trees": [
   "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json",
   "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_001.prefab.json"
  ],
  "treeCount": 8,
  "chip": [
   "#0081b2",
   "#e0c569"
  ]
 },
 "desert": {
  "zone": 2,
  "tier": 3,
  "name": "Barren Desert",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#d2ba6d",
  "ground": "Soil_Sand_White",
  "under": "Soil_Dirt_Dry",
  "hills": 2,
  "plants": [
   [
    "Plant_Bramble_Dry_Twisted",
    30,
    2
   ],
   [
    "Plant_Leaves_Bramble",
    3,
    2
   ],
   [
    "Plant_Grass_Arid",
    3,
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    2,
    1
   ],
   [
    "Plant_Flower_Bushy_Red",
    1,
    2
   ],
   [
    "Plant_Flower_Common_Blue2",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Poisoned",
    1,
    1
   ]
  ],
  "density": 0.06,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_2/Dry_Dead_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_5/Petrified_Dead_Stage5_001.prefab.json"
  ],
  "treeCount": 5,
  "chip": [
   "#0081b2",
   "#e0c569"
  ]
 },
 "desert_mushroom": {
  "zone": 2,
  "tier": 3,
  "name": "Mushroom Desert",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#d2ba6d",
  "ground": "Soil_Sand_White",
  "under": "Soil_Dirt_Dry",
  "hills": 2,
  "plants": [
   [
    "Plant_Bramble_Dry_Twisted",
    30,
    2
   ],
   [
    "Plant_Leaves_Bramble",
    3,
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    3,
    1
   ],
   [
    "Plant_Grass_Arid",
    2,
    2
   ],
   [
    "Plant_Flower_Bushy_Red",
    1,
    2
   ],
   [
    "Plant_Flower_Common_Poisoned",
    1,
    1
   ]
  ],
  "density": 0.06,
  "trees": [
   "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_3/Mushroom_Large_Yellow_Stage_3_004.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_3/Mushroom_Large_Green_Stage_3_004.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_001.prefab.json"
  ],
  "treeCount": 14,
  "chip": [
   "#0081b2",
   "#e0c569"
  ]
 },
 "forest_fir": {
  "zone": 3,
  "tier": 1,
  "name": "Fir Forest",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json",
  "tint": "#3f7a44",
  "ground": "Soil_Grass_Cold",
  "under": "Soil_Dirt_Cold",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Winter_Tall",
    30
   ],
   [
    "Plant_Grass_Winter",
    27,
    2
   ],
   [
    "Plant_Bush_Winter_Snow",
    3,
    2
   ],
   [
    "Plant_Bush_Lush",
    3,
    2
   ],
   [
    "Plant_Flower_Flax_Blue",
    2,
    2
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    1,
    1
   ],
   [
    "Plant_Crop_Mushroom_Cap_Brown",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Violet",
    1,
    1
   ],
   [
    "Plant_Flower_Common_White2",
    1,
    1
   ]
  ],
  "density": 0.4,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json"
  ],
  "treeCount": 40,
  "chip": [
   "#2f4a86",
   "#397341"
  ]
 },
 "forest_redwood": {
  "zone": 3,
  "tier": 1,
  "name": "Redwood Forest",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json",
  "tint": "#446223",
  "ground": "Soil_Needles",
  "under": "Soil_Dirt_Cold",
  "hills": 2,
  "plants": [
   [
    "Plant_Moss_Rug_Lime",
    30,
    1
   ],
   [
    "Plant_Fern_Winter",
    19,
    2
   ],
   [
    "Plant_Grass_Sharp",
    18,
    2
   ],
   [
    "Plant_Fern_Forest",
    16,
    2
   ],
   [
    "Plant_Grass_Sharp_Tall",
    12
   ],
   [
    "Plant_Flower_Flax_Blue",
    4,
    2
   ],
   [
    "Plant_Flower_Common_White",
    4,
    1
   ],
   [
    "Plant_Bush_Lush",
    4,
    2
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    4,
    1
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Redwood/Stage_2/Redwood_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Redwood/Stage_3/Redwood_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Cedar/Stage_3/Cedar_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Redwood/Stage_1/Redwood_Stage1_001.prefab.json"
  ],
  "treeCount": 36,
  "chip": [
   "#2f4a86",
   "#603b25"
  ]
 },
 "forest_tundra": {
  "zone": 3,
  "tier": 1,
  "name": "Tundra Forest",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json",
  "tint": "#8d7c40",
  "ground": "Soil_Grass_Cold",
  "under": "Soil_Dirt_Cold",
  "hills": 2,
  "plants": [
   [
    "Plant_Moss_Rug_Green",
    30,
    1
   ],
   [
    "Plant_Grass_Winter_Tall",
    27
   ],
   [
    "Plant_Grass_Winter",
    24,
    2
   ],
   [
    "Plant_Crop_Mushroom_Cap_Green",
    5,
    1
   ],
   [
    "Plant_Flower_Bushy_Green",
    5,
    2
   ],
   [
    "Plant_Flower_Tall_Purple",
    3
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Redwood/Stage_1/Redwood_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Redwood/Stage_0/Redwood_Stage0_001.prefab.json"
  ],
  "treeCount": 22,
  "chip": [
   "#2f4a86",
   "#80753d"
  ]
 },
 "plains_hotsprings": {
  "zone": 3,
  "tier": 1,
  "name": "Hot Springs",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json",
  "tint": "#4c6229",
  "ground": "Soil_Grass_Cold",
  "under": "Rock_Basalt",
  "hills": 2,
  "plants": [
   [
    "Plant_Reeds_Winter",
    30
   ],
   [
    "Plant_Grass_Winter_Tall",
    15
   ],
   [
    "Plant_Grass_Winter",
    13,
    2
   ],
   [
    "Plant_Flower_Tall_Purple",
    9
   ],
   [
    "Plant_Bush_Lush",
    4,
    2
   ],
   [
    "Plant_Flower_Common_Blue",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Violet",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Cyan2",
    1,
    1
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_001.prefab.json"
  ],
  "treeCount": 14,
  "water": {
   "kind": "shore",
   "bed": "Soil_Gravel",
   "plants": [
    [
     "Plant_Reeds_Winter",
     3
    ]
   ],
   "density": 0.05
  },
  "chip": [
   "#2f4a86",
   "#455d27"
  ]
 },
 "plains_shire": {
  "zone": 3,
  "tier": 1,
  "name": "Shire",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json",
  "tint": "#a09023",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt_Cold",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Winter_Tall",
    30
   ],
   [
    "Plant_Grass_Winter",
    15,
    2
   ],
   [
    "Plant_Grass_Cave_Short",
    8,
    1
   ],
   [
    "Plant_Moss_Rug_Yellow",
    7,
    1
   ],
   [
    "Plant_Moss_Short_Yellow",
    5,
    1
   ],
   [
    "Plant_Flower_Common_White",
    2,
    1
   ],
   [
    "Plant_Flower_Common_Orange",
    2,
    1
   ],
   [
    "Plant_Flower_Common_Yellow",
    2,
    1
   ],
   [
    "Plant_Bush_Winter_Red",
    2,
    2
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Trees/Fir_red/Stage_1/Fir_red_Stage1_001.prefab.json",
   "Server/Prefabs/Trees/Fir_red/Stage_0/Fir_red_Stage0_001.prefab.json"
  ],
  "treeCount": 12,
  "chip": [
   "#2f4a86",
   "#968721"
  ]
 },
 "forest_cedar": {
  "zone": 3,
  "tier": 2,
  "name": "Cedar Forest",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json",
  "tint": "#88703a",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Sharp_Tall",
    30
   ],
   [
    "Plant_Fern_Forest",
    27,
    2
   ],
   [
    "Plant_Bramble_Dry_Twisted",
    20,
    2
   ],
   [
    "Plant_Fern_Winter",
    14,
    2
   ],
   [
    "Plant_Grass_Sharp",
    13,
    2
   ],
   [
    "Plant_Flower_Common_White",
    10,
    1
   ],
   [
    "Plant_Bush_Winter",
    7,
    2
   ],
   [
    "Plant_Crop_Mushroom_Flatcap_Blue",
    6,
    1
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    4,
    1
   ]
  ],
  "density": 0.4,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Cedar/Stage_2/Cedar_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Cedar/Stage_3/Cedar_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Cedar/Stage_1/Cedar_Stage1_001.prefab.json"
  ],
  "treeCount": 36,
  "chip": [
   "#2f4a86",
   "#806936"
  ]
 },
 "forest_cedar_mixed": {
  "zone": 3,
  "tier": 2,
  "name": "Mixed Cedar Forest",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json",
  "tint": "#88703a",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Sharp_Tall",
    30
   ],
   [
    "Plant_Bramble_Dry_Twisted",
    20,
    2
   ],
   [
    "Plant_Fern_Winter",
    14,
    2
   ],
   [
    "Plant_Grass_Sharp",
    13,
    2
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    4,
    1
   ],
   [
    "Plant_Crop_Mushroom_Cap_Brown",
    4,
    1
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Cedar/Stage_1/Cedar_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Cedar/Stage_2/Cedar_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json"
  ],
  "treeCount": 32,
  "chip": [
   "#2f4a86",
   "#806936"
  ]
 },
 "plains_frozen": {
  "zone": 3,
  "tier": 2,
  "name": "Frozen Plains",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Boreal.json",
  "tint": "#3f7a44",
  "ground": "Soil_Snow",
  "under": "Soil_Dirt_Cold",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Winter_Tall",
    30
   ],
   [
    "Plant_Grass_Winter",
    27,
    2
   ],
   [
    "Plant_Flower_Common_Violet",
    1,
    1
   ],
   [
    "Plant_Flower_Common_White2",
    1,
    1
   ],
   [
    "Plant_Bush_Winter_Sharp",
    1,
    2
   ],
   [
    "Plant_Bush_Winter_Snow",
    1,
    2
   ]
  ],
  "density": 0.2,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json"
  ],
  "treeCount": 12,
  "chip": [
   "#033e88",
   "#dbf0f5"
  ]
 },
 "plains_tundra": {
  "zone": 3,
  "tier": 2,
  "name": "Tundra",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json",
  "tint": "#4c6229",
  "ground": "Soil_Grass_Cold",
  "under": "Soil_Dirt_Cold",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Winter",
    30,
    2
   ],
   [
    "Plant_Grass_Winter_Tall",
    13
   ],
   [
    "Plant_Flower_Tall_Purple",
    5
   ],
   [
    "Plant_Bush_Winter_Red",
    2,
    2
   ]
  ],
  "density": 0.4,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_001.prefab.json"
  ],
  "treeCount": 10,
  "chip": [
   "#2f4a86",
   "#455d27"
  ]
 },
 "glacier": {
  "zone": 3,
  "tier": 2,
  "name": "Glacier",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Boreal.json",
  "tint": "#3f7a44",
  "ground": "Rock_Ice",
  "under": "Rock_Ice_Permafrost",
  "hills": 6,
  "plants": [
   [
    "Plant_Bush_Winter_Snow",
    3
   ],
   [
    "Plant_Bush_Winter_Sharp",
    2,
    2
   ]
  ],
  "density": 0.04,
  "trees": [],
  "treeCount": 0,
  "chip": [
   "#033e88",
   "#ceeaf9"
  ]
 },
 "tundra": {
  "zone": 3,
  "tier": 3,
  "name": "Frozen Forest",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Boreal.json",
  "tint": "#699587",
  "ground": "Soil_Snow",
  "under": "Soil_Dirt_Cold",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Snowy",
    30,
    2
   ],
   [
    "Plant_Grass_Snowy_Short",
    20,
    1
   ],
   [
    "Plant_Grass_Winter",
    20,
    2
   ],
   [
    "Plant_Grass_Winter_Tall",
    20
   ],
   [
    "Plant_Bush_Winter_Sharp",
    15,
    2
   ],
   [
    "Plant_Bush_Winter_Snow",
    12,
    2
   ],
   [
    "Plant_Flower_Bushy_White",
    11,
    2
   ],
   [
    "Plant_Grass_Winter_Short",
    10,
    1
   ],
   [
    "Plant_Flower_Flax_Blue",
    10,
    2
   ]
  ],
  "density": 0.2,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_001.prefab.json"
  ],
  "treeCount": 34,
  "chip": [
   "#033e88",
   "#dbf0f5"
  ]
 },
 "forest_frozen_light": {
  "zone": 3,
  "tier": 3,
  "name": "Light Frozen Forest",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Boreal.json",
  "tint": "#3f7a44",
  "ground": "Soil_Grass_Cold",
  "under": "Soil_Dirt_Cold",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Winter_Tall",
    30
   ],
   [
    "Plant_Grass_Winter",
    27,
    2
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    3,
    1
   ],
   [
    "Plant_Crop_Mushroom_Cap_Brown",
    3,
    1
   ],
   [
    "Plant_Flower_Common_Violet",
    1,
    1
   ],
   [
    "Plant_Flower_Common_White2",
    1,
    1
   ],
   [
    "Plant_Bush_Winter_Sharp",
    1,
    2
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json"
  ],
  "treeCount": 30,
  "chip": [
   "#033e88",
   "#397341"
  ]
 },
 "plains_frozen_frost": {
  "zone": 3,
  "tier": 3,
  "name": "Frost Plains",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Boreal.json",
  "tint": "#699587",
  "ground": "Soil_Snow",
  "under": "Rock_Ice_Permafrost",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Winter_Tall",
    30
   ],
   [
    "Plant_Grass_Winter",
    27,
    2
   ],
   [
    "Plant_Flower_Common_Violet",
    1,
    1
   ],
   [
    "Plant_Flower_Common_White2",
    1,
    1
   ],
   [
    "Plant_Bush_Winter_Sharp",
    1,
    2
   ],
   [
    "Plant_Bush_Winter_Snow",
    1,
    2
   ]
  ],
  "density": 0.15,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_001.prefab.json"
  ],
  "treeCount": 10,
  "chip": [
   "#033e88",
   "#dbf0f5"
  ]
 },
 "volcanic": {
  "zone": 4,
  "tier": 4,
  "name": "Jungle Dunes",
  "weather": "Server/Weathers/Zone4/Zone4_Light.json",
  "tint": "#a39e56",
  "ground": "Soil_Grass_Deep",
  "under": "Soil_Ash",
  "hills": 4,
  "plants": [
   [
    "Plant_Moss_Rug_Lime",
    30,
    1
   ],
   [
    "Plant_Grass_Jungle",
    23,
    2
   ],
   [
    "Plant_Grass_Jungle_Short",
    18,
    1
   ],
   [
    "Plant_Leaves_Jungle_Floor",
    17,
    1
   ],
   [
    "Plant_Grass_Jungle_Tall",
    9
   ],
   [
    "Plant_Bush_Jungle",
    8,
    2
   ],
   [
    "Plant_Bush_Arid_Palm",
    5,
    2
   ],
   [
    "Plant_Crop_Mushroom_Flatcap_Green",
    5,
    1
   ],
   [
    "Plant_Bush_Dead",
    4,
    2
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Bamboo/Stage_3/Bamboo_Stage3_001.prefab.json"
  ],
  "treeCount": 30,
  "chip": [
   "#67352c",
   "#8a8649"
  ]
 },
 "forest_ghost": {
  "zone": 4,
  "tier": 4,
  "name": "Ghost Forest",
  "weather": "Server/Weathers/Zone4/Zone4_Lava_Fields.json",
  "tint": "#5e606c",
  "ground": "Soil_Grass_Burnt",
  "under": "Soil_Dirt_Burnt",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Gnarled",
    30,
    2
   ],
   [
    "Plant_Grass_Gnarled_Short",
    26,
    1
   ],
   [
    "Plant_Leaves_Autumn_Floor",
    23,
    1
   ],
   [
    "Plant_Grass_Gnarled_Tall",
    8
   ],
   [
    "Plant_Bush_Dead",
    5,
    2
   ],
   [
    "Plant_Crop_Mushroom_Glowing_Violet",
    3,
    1
   ]
  ],
  "density": 0.4,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Petrified/Stage_1/Petrified_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Petrified/Stage_2/Petrified_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_2/Petrified_Dead_Stage2_001.prefab.json"
  ],
  "treeCount": 34,
  "chip": [
   "#cd875c",
   "#585a65"
  ]
 },
 "forest_swamp_4": {
  "zone": 4,
  "tier": 4,
  "name": "Poison Swamp",
  "weather": "Server/Weathers/Zone4/Zone4_Swamp_Storm.json",
  "tint": "#706f3e",
  "ground": "Soil_Grass_Burnt",
  "under": "Soil_Dirt_Poisoned",
  "hills": 1,
  "plants": [
   [
    "Plant_Reeds_Water",
    30
   ],
   [
    "Plant_Grass_Gnarled",
    21,
    2
   ],
   [
    "Plant_Grass_Gnarled_Short",
    12,
    1
   ],
   [
    "Plant_Reeds_Poison",
    8
   ],
   [
    "Plant_Flower_Bushy_Poisoned",
    4,
    2
   ],
   [
    "Plant_Crop_Mushroom_Cap_Green",
    3,
    1
   ],
   [
    "Plant_Crop_Mushroom_Glowing_Red",
    2,
    1
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_3/Ash_Dead_Stage3_001.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_001.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_001.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_3/Mushroom_Large_Green_Stage_3_004.prefab.json"
  ],
  "treeCount": 28,
  "water": {
   "kind": "shore",
   "bed": "Soil_Dirt_Poisoned",
   "plants": [
    [
     "Plant_Reeds_Poison",
     3
    ],
    [
     "Plant_Reeds_Water",
     3
    ]
   ],
   "density": 0.12
  },
  "chip": [
   "#8c9196",
   "#69683a"
  ]
 },
 "wastes_geysers": {
  "zone": 4,
  "tier": 4,
  "name": "Geysers",
  "weather": "Server/Weathers/Zone4/Zone4_Light.json",
  "tint": "#776433",
  "ground": "Soil_Grass_Burnt",
  "under": "Rock_Basalt",
  "hills": 4,
  "plants": [
   [
    "Plant_Grass_Gnarled",
    30,
    2
   ],
   [
    "Plant_Grass_Gnarled_Tall",
    26
   ],
   [
    "Plant_Moss_Rug_Green",
    22,
    1
   ],
   [
    "Plant_Bramble_Moss_Twisted",
    14,
    2
   ],
   [
    "Plant_Bush_Dead_Twisted",
    8,
    2
   ],
   [
    "Plant_Grass_Gnarled_Short",
    4,
    1
   ],
   [
    "Plant_Crop_Mushroom_Glowing_Red",
    2,
    1
   ],
   [
    "Plant_Crop_Mushroom_Cap_Green",
    1,
    1
   ],
   [
    "Plant_Bush_Dead_Tall",
    1
   ]
  ],
  "density": 0.3,
  "trees": [
   "Server/Prefabs/Trees/Ash_twisted_Large/Ash_twisted_Large_001.prefab.json",
   "Server/Prefabs/Trees/Ash_twisted_Giant/Ash_twisted_Giant_001.prefab.json"
  ],
  "treeCount": 14,
  "chip": [
   "#67352c",
   "#705e30"
  ]
 },
 "wastes_grasslands": {
  "zone": 4,
  "tier": 4,
  "name": "Burnt Grasslands",
  "weather": "Server/Weathers/Zone4/Zone4_Light.json",
  "tint": "#776433",
  "ground": "Soil_Grass_Burnt",
  "under": "Soil_Dirt_Burnt",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Gnarled",
    30,
    2
   ],
   [
    "Plant_Grass_Gnarled_Tall",
    26
   ],
   [
    "Plant_Bush_Dead_Twisted",
    14,
    2
   ],
   [
    "Plant_Grass_Gnarled_Short",
    4,
    1
   ],
   [
    "Plant_Flower_Orchid_Orange",
    3,
    2
   ],
   [
    "Plant_Bush_Dead_Tall",
    2
   ]
  ],
  "density": 0.4,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Burnt/Stage_1/Burnt_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Sallow/Stage_1/Sallow_Stage1_001.prefab.json"
  ],
  "treeCount": 18,
  "chip": [
   "#67352c",
   "#705e30"
  ]
 },
 "desert_ash": {
  "zone": 4,
  "tier": 5,
  "name": "Ash Desert",
  "weather": "Server/Weathers/Zone4/Zone4_Light.json",
  "tint": "#a39e56",
  "ground": "Soil_Ash",
  "under": "Rock_Slate",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Jungle",
    30,
    2
   ],
   [
    "Plant_Moss_Rug_Yellow",
    24,
    1
   ],
   [
    "Plant_Grass_Jungle_Short",
    10,
    1
   ],
   [
    "Plant_Bush_Crystal",
    6,
    2
   ],
   [
    "Plant_Flower_Tall_Purple",
    3
   ],
   [
    "Plant_Bush_Jungle",
    3,
    2
   ],
   [
    "Plant_Bush_Dead",
    2,
    2
   ],
   [
    "Plant_Bush_Dead_Twisted",
    1,
    2
   ],
   [
    "Plant_Crop_Mushroom_Glowing_Red",
    1,
    1
   ]
  ],
  "density": 0.3,
  "trees": [
   "Server/Prefabs/Trees/Burnt_dead/Stage_1/Burnt_dead_Stage1_001.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_001.prefab.json",
   "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_001.prefab.json"
  ],
  "treeCount": 20,
  "chip": [
   "#67352c",
   "#373838"
  ]
 },
 "forest_burned": {
  "zone": 4,
  "tier": 5,
  "name": "Burned Forest",
  "weather": "Server/Weathers/Zone4/Zone4_Lava_Fields.json",
  "tint": "#522d2d",
  "ground": "Soil_Grass_Burnt",
  "under": "Rock_Volcanic",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Gnarled",
    30,
    2
   ],
   [
    "Plant_Grass_Gnarled_Tall",
    26
   ],
   [
    "Plant_Grass_Jungle",
    17,
    2
   ],
   [
    "Plant_Grass_Jungle_Short",
    12,
    1
   ],
   [
    "Plant_Crop_Mushroom_Glowing_Red",
    9,
    1
   ],
   [
    "Plant_Fern_Winter",
    9,
    2
   ],
   [
    "Plant_Bush_Dead_Twisted",
    5,
    2
   ],
   [
    "Plant_Bramble_Dead_Lavathorn",
    4,
    2
   ],
   [
    "Plant_Grass_Jungle_Tall",
    4
   ]
  ],
  "density": 0.4,
  "trees": [
   "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fire_Burning/Stage_1/Fire_Burning_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fire_Burning/Stage_3/Fire_Burning_Stage3_001.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json"
  ],
  "treeCount": 30,
  "lava": true,
  "chip": [
   "#cd875c",
   "#4d2a2a"
  ]
 },
 "forest_roots": {
  "zone": 4,
  "tier": 5,
  "name": "Root Forest",
  "weather": "Server/Weathers/Zone4/Zone4_Lava_Fields.json",
  "tint": "#424242",
  "ground": "Soil_Grass_Burnt",
  "under": "Soil_Dirt_Burnt",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Jungle",
    30,
    2
   ],
   [
    "Plant_Moss_Rug_Yellow",
    24,
    1
   ],
   [
    "Plant_Grass_Gnarled",
    14,
    2
   ],
   [
    "Plant_Grass_Jungle_Short",
    10,
    1
   ],
   [
    "Plant_Reeds_Water",
    10
   ],
   [
    "Plant_Bramble_Dead_Lavathorn",
    9,
    2
   ],
   [
    "Plant_Grass_Gnarled_Short",
    8,
    1
   ],
   [
    "Plant_Bush_Dead_Twisted",
    4,
    2
   ],
   [
    "Plant_Flower_Tall_Purple",
    3
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Trees/Burnt_Roots/Normal/Stage_3/Burnt_Roots_Normal_001.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_001.prefab.json",
   "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_001.prefab.json"
  ],
  "treeCount": 26,
  "chip": [
   "#cd875c",
   "#3e3e3e"
  ]
 },
 "wastes_ash": {
  "zone": 4,
  "tier": 5,
  "name": "Ash Wastes",
  "weather": "Server/Weathers/Zone4/Zone4_Light.json",
  "tint": "#69a128",
  "ground": "Soil_Sand_Ashen",
  "under": "Rock_Slate",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Jungle",
    30,
    2
   ],
   [
    "Plant_Grass_Gnarled",
    27,
    2
   ],
   [
    "Plant_Grass_Gnarled_Tall",
    23
   ],
   [
    "Plant_Grass_Jungle_Short",
    21,
    1
   ],
   [
    "Plant_Crop_Mushroom_Glowing_Red",
    16,
    1
   ],
   [
    "Plant_Fern_Winter",
    16,
    2
   ],
   [
    "Plant_Grass_Cave_Short",
    10,
    1
   ],
   [
    "Plant_Bush_Dead_Twisted",
    8,
    2
   ],
   [
    "Plant_Bush_Crystal",
    8,
    2
   ]
  ],
  "density": 0.3,
  "trees": [
   "Server/Prefabs/Trees/Burnt_dead/Stage_1/Burnt_dead_Stage1_001.prefab.json",
   "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_001.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json",
   "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_001.prefab.json"
  ],
  "treeCount": 18,
  "chip": [
   "#67352c",
   "#9b9b8e"
  ]
 },
 "wastes_lava": {
  "zone": 4,
  "tier": 5,
  "name": "Lava Wastes",
  "weather": "Server/Weathers/Zone4/Zone4_Light.json",
  "tint": "#468c2c",
  "ground": "Rock_Volcanic",
  "under": "Rock_Volcanic",
  "hills": 6,
  "plants": [
   [
    "Plant_Grass_Jungle",
    30,
    2
   ],
   [
    "Plant_Grass_Jungle_Short",
    21,
    1
   ],
   [
    "Plant_Fern_Winter",
    16,
    2
   ],
   [
    "Plant_Bush_Dead_Twisted",
    10,
    2
   ],
   [
    "Plant_Bramble_Dead_Lavathorn",
    8,
    2
   ],
   [
    "Plant_Grass_Jungle_Tall",
    7
   ],
   [
    "Plant_Grass_Lush_Tall",
    7
   ],
   [
    "Plant_Flower_Tall_Cyan",
    4
   ],
   [
    "Plant_Crop_Mushroom_Glowing_Green",
    4,
    1
   ]
  ],
  "density": 0.2,
  "trees": [
   "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_001.prefab.json",
   "Server/Prefabs/Trees/Burnt_dead/Stage_1/Burnt_dead_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_2/Fig_Blue_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_3/Fig_Blue_Stage3_001.prefab.json"
  ],
  "treeCount": 12,
  "lava": true,
  "chip": [
   "#67352c",
   "#322929"
  ]
 },
 "riverbank": {
  "zone": 1,
  "tier": 1,
  "name": "Riverbank",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny_Fireflies.json",
  "tint": "#53932b",
  "ground": "Soil_Grass",
  "under": "Soil_Gravel",
  "hills": 1,
  "plants": [
   [
    "Plant_Grass_Sharp_Short",
    16,
    1
   ],
   [
    "Plant_Grass_Sharp",
    18,
    2
   ],
   [
    "Plant_Grass_Sharp_Tall",
    14
   ],
   [
    "Plant_Grass_Sharp_Wild",
    9
   ],
   [
    "Plant_Reeds_Marsh",
    4
   ],
   [
    "Plant_Fern_Forest",
    2,
    2
   ],
   [
    "Plant_Flower_Bushy_Green",
    2,
    1
   ]
  ],
  "density": 0.5,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Beech_Fallen/Stage_1/Beech_Fallen_Stage1_003.prefab.json"
  ],
  "treeCount": 30,
  "water": {
   "kind": "river",
   "bed": "Soil_Gravel",
   "plants": [
    [
     "Plant_Seaweed_Grass",
     6,
     1
    ]
   ],
   "density": 0.12
  },
  "chip": [
   "#1983d9",
   "#4e8a28"
  ]
 },
 "desertriver": {
  "zone": 2,
  "tier": 1,
  "name": "Dry River",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#dec13c",
  "ground": "Soil_Gravel_Sand",
  "under": "Soil_Clay_Orange",
  "hills": 1,
  "plants": [
   [
    "Plant_Grass_Arid",
    30,
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    26,
    1
   ],
   [
    "Plant_Grass_Dry_Tall",
    13
   ],
   [
    "Plant_Grass_Arid_Tall",
    8
   ],
   [
    "Plant_Grass_Dry",
    6,
    2
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Blue",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Purple",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Cyan",
    1,
    1
   ]
  ],
  "density": 0.12,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Palo/Stage_3/Palo_Stage3_001.prefab.json"
  ],
  "treeCount": 16,
  "water": {
   "kind": "river",
   "bed": "Soil_Gravel_Sand",
   "plants": [],
   "density": 0
  },
  "chip": [
   "#0081b2",
   "#c39b48"
  ]
 },
 "desertshore": {
  "zone": 2,
  "tier": 2,
  "name": "Desert Shore",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tint": "#d2ba6d",
  "ground": "Soil_Sand_White",
  "under": "Rock_Sandstone",
  "hills": 1,
  "plants": [
   [
    "Plant_Grass_Arid_Short",
    6,
    1
   ],
   [
    "Plant_Grass_Arid",
    3,
    2
   ]
  ],
  "density": 0.05,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Palm/Stage_2/Palm_Stage2_001.prefab.json"
  ],
  "treeCount": 8,
  "water": {
   "kind": "shore",
   "bed": "Soil_Sand_White",
   "plants": [
    [
     "Plant_Seaweed_Grass",
     4,
     1
    ]
   ],
   "density": 0.06
  },
  "chip": [
   "#0081b2",
   "#e0c569"
  ]
 },
 "taigariver": {
  "zone": 3,
  "tier": 1,
  "name": "Cold River",
  "weather": "Server/Weathers/Zone3/Zone3_Rain.json",
  "tint": "#3f7a44",
  "ground": "Soil_Grass_Cold",
  "under": "Soil_Gravel",
  "hills": 1,
  "plants": [
   [
    "Plant_Grass_Winter_Tall",
    30
   ],
   [
    "Plant_Grass_Winter",
    27,
    2
   ],
   [
    "Plant_Bush_Winter_Snow",
    3,
    2
   ],
   [
    "Plant_Bush_Lush",
    3,
    2
   ],
   [
    "Plant_Flower_Flax_Blue",
    2,
    2
   ],
   [
    "Plant_Crop_Mushroom_Common_Brown",
    1,
    1
   ],
   [
    "Plant_Crop_Mushroom_Cap_Brown",
    1,
    1
   ],
   [
    "Plant_Flower_Common_Violet",
    1,
    1
   ],
   [
    "Plant_Flower_Common_White2",
    1,
    1
   ]
  ],
  "density": 0.4,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
   "Server/Prefabs/Trees/Cedar_Logs/Small/Cedar_Logs_001.prefab.json"
  ],
  "treeCount": 30,
  "water": {
   "kind": "river",
   "bed": "Soil_Gravel",
   "plants": [
    [
     "Plant_Seaweed_Grass",
     6,
     1
    ]
   ],
   "density": 0.1
  },
  "chip": [
   "#cedbdb",
   "#397341"
  ]
 },
 "taigashore": {
  "zone": 3,
  "tier": 1,
  "name": "Cold Shore",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json",
  "tint": "#3f7a44",
  "ground": "Soil_Gravel_Sand",
  "under": "Soil_Gravel",
  "hills": 1,
  "plants": [
   [
    "Plant_Grass_Sharp",
    6,
    2
   ],
   [
    "Plant_Grass_Rocky",
    4,
    1
   ]
  ],
  "density": 0.15,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Cedar_Burnt/Stage_2/Cedar_Burnt_Stage2_001.prefab.json"
  ],
  "treeCount": 18,
  "water": {
   "kind": "shore",
   "bed": "Soil_Gravel_Sand",
   "plants": [
    [
     "Plant_Seaweed_Grass",
     4,
     1
    ]
   ],
   "density": 0.1
  },
  "chip": [
   "#2f4a86",
   "#c39b48"
  ]
 },
 "ashriver": {
  "zone": 4,
  "tier": 4,
  "name": "Ashen River",
  "weather": "Server/Weathers/Zone4/Zone4_Light.json",
  "tint": "#776433",
  "ground": "Soil_Sand_Ashen",
  "under": "Rock_Volcanic",
  "hills": 1,
  "plants": [
   [
    "Plant_Bush_Dead_Twisted",
    2
   ],
   [
    "Plant_Grass_Gnarled_Short",
    3,
    1
   ]
  ],
  "density": 0.05,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_001.prefab.json"
  ],
  "treeCount": 14,
  "water": {
   "kind": "river",
   "bed": "Soil_Sand_Ashen",
   "plants": [],
   "density": 0
  },
  "chip": [
   "#67352c",
   "#9b9b8e"
  ]
 },
 "ashshore": {
  "zone": 4,
  "tier": 4,
  "name": "Ashen Shore",
  "weather": "Server/Weathers/Zone4/Zone4_Storm.json",
  "tint": "#776433",
  "ground": "Soil_Sand_Ashen",
  "under": "Soil_Clay_Smooth_Black",
  "hills": 1,
  "plants": [
   [
    "Plant_Bush_Dead_Twisted",
    2
   ]
  ],
  "density": 0.03,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_001.prefab.json"
  ],
  "treeCount": 20,
  "water": {
   "kind": "shore",
   "bed": "Soil_Sand_Ashen",
   "plants": [],
   "density": 0
  },
  "chip": [
   "#9ea8a8",
   "#9b9b8e"
  ]
 },
 "ocean": {
  "swim": true,
  "zone": 0,
  "tier": 0,
  "name": "Open Sea",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Ocean1/Oceans.json",
  "water": {
   "kind": "sea",
   "bed": "Soil_Sand",
   "depth": 3,
   "density": 0.22,
   "plants": [
    [
     "Plant_Seaweed_Grass",
     10,
     1
    ],
    [
     "Plant_Seaweed_Grass_Tall",
     6
    ],
    [
     "Plant_Seaweed_Grass_Stack",
     3
    ],
    [
     "Plant_Coral_Bush_Pink",
     2
    ],
    [
     "Plant_Coral_Bush_Cyan",
     2
    ],
    [
     "Plant_Coral_Bush_Yellow",
     1
    ],
    [
     "Plant_Coral_Bush_Purple",
     1
    ]
   ]
  },
  "ground": "Soil_Sand",
  "under": "Soil_Sand",
  "hills": 1,
  "plants": [],
  "density": 0,
  "trees": [],
  "treeCount": 0,
  "chip": [
   "#077ad9",
   "#cfa644"
  ]
 }
};
export const SCENE_ALIASES = {"hills": "plains_tallgrass", "gorges": "plains_gorge", "trork": "forest_aspen", "oasis": "desert_oasis", "rocky": "desert_rock", "taiga": "forest_fir", "redwood": "forest_redwood", "hedera": "forest_tundra", "caldera": "wastes_lava"};
export const SET_PIECES = {"chair": "Furniture_Village_Chair", "bed": "Furniture_Village_Bed", "ladder": "Furniture_Village_Ladder", "bench": "Bench_WorkBench", "wall": "Wood_Softwood_Planks"};
export const BLOCKS = {
 "Soil_Grass": {
  "cube": {
   "side": "BlockTextures/Soil_Grass_Side.png",
   "top": [
    "BlockTextures/Soil_Grass_GS.png",
    "BlockTextures/Soil_Grass_GS_02.png"
   ],
   "bottom": "BlockTextures/Soil_Dirt.png",
   "sideMask": "BlockTextures/Soil_grass_Side_Mask_GS.png"
  },
  "tintUp": true
 },
 "Soil_Dirt": {
  "cube": {
   "side": "BlockTextures/Soil_Dirt.png",
   "top": "BlockTextures/Soil_Dirt.png",
   "bottom": "BlockTextures/Soil_Dirt.png"
  }
 },
 "Plant_Grass_Lush_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small.png"
  ],
  "tint": "#297430"
 },
 "Plant_Flower_Tall_Purple": {
  "model": "Blocks/Foliage/Plants/Dense_Tall.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Dense_Tall_Textures/Lavender.png"
  ]
 },
 "Plant_Bush_Green": {
  "model": "Blocks/Foliage/Plants/Bush_Berry.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Berry_Texture.png"
  ]
 },
 "Plant_Grass_Lush": {
  "model": "Blocks/Foliage/Plants/Cross_17px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_17px_Textures/Grassplant_Lush_GS.png"
  ],
  "tint": "#297430"
 },
 "Plant_Flower_Common_Yellow": {
  "model": "Blocks/Foliage/Flowers/Flower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Flower_Textures/Yellow.png"
  ]
 },
 "Plant_Flower_Common_Cyan2": {
  "model": "Blocks/Foliage/Flowers/Flower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Flower_Textures/Cyan.png"
  ]
 },
 "Plant_Flower_Common_Violet": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Violet.png"
  ]
 },
 "Plant_Grass_Lush_Tall": {
  "model": "Blocks/Foliage/Grass/Bushy.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Bushy_Grassplant_Lush_Tall_GS.png"
  ],
  "tint": "#297430"
 },
 "Plant_Crop_Mushroom_Cap_Brown": {
  "model": "Blocks/Foliage/Plants/Mushroom_Fox.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Fox_Brown.png"
  ]
 },
 "Wood_Oak_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Oak_Side.png",
   "top": "BlockTextures/Wood_Trunk_Oak_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Oak_Full.png"
  }
 },
 "Wood_Oak_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Oak.png"
  ]
 },
 "Wood_Oak_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Oak_Side.png",
   "top": "BlockTextures/Wood_Trunk_Oak_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Oak_Top.png"
  }
 },
 "Wood_Oak_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Oak.png"
  ]
 },
 "Wood_Oak_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Oak.png"
  ]
 },
 "Plant_Leaves_Oak": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Oak.png"
  ]
 },
 "Wood_Beech_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Beech_Side.png",
   "top": "BlockTextures/Wood_Trunk_Beech_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Beech_Full.png"
  }
 },
 "Plant_Leaves_Beech": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Beech.png"
  ]
 },
 "Wood_Beech_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Beech_Side.png",
   "top": "BlockTextures/Wood_Trunk_Beech_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Beech_Top.png"
  }
 },
 "Wood_Beech_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Beech.png"
  ]
 },
 "Wood_Beech_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Beech.png"
  ]
 },
 "Wood_Birch_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Birch.png"
  ]
 },
 "Plant_Leaves_Birch": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Birch.png"
  ]
 },
 "Wood_Birch_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Birch.png"
  ]
 },
 "Wood_Birch_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Birch_Side.png",
   "top": "BlockTextures/Wood_Trunk_Birch_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Birch_Full.png"
  }
 },
 "Wood_Birch_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Birch_Side.png",
   "top": "BlockTextures/Wood_Trunk_Birch_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Birch_Top.png"
  }
 },
 "Plant_Grass_Sharp": {
  "model": "Blocks/Foliage/Grass/Dense_Small_3Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/default.png"
  ],
  "tint": "#67b62d"
 },
 "Plant_Flower_Common_Red2": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Red.png"
  ]
 },
 "Plant_Bush": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Green.png"
  ]
 },
 "Plant_Flower_Flax_Blue": {
  "model": "Blocks/Foliage/Plants/Flax.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Flax_Textures/Blue.png"
  ]
 },
 "Wood_Oak_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Oak.png"
  ]
 },
 "Soil_Grass_Full": {
  "cube": {
   "side": "BlockTextures/Soil_Grass_Side_Full_GS.png",
   "top": "BlockTextures/Soil_Grass_GS.png",
   "bottom": "BlockTextures/Soil_Dirt.png"
  },
  "tintUp": true,
  "tint": "#67b62d"
 },
 "Plant_Grass_Sharp_Tall": {
  "model": "Blocks/Foliage/Grass/Dense_Tall_3Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_Tall_4Rows_Texture.png"
  ],
  "tint": "#67b62d"
 },
 "Plant_Grass_Sharp_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Sharp_Short_GS.png"
  ],
  "tint": "#67b62d"
 },
 "Plant_Crop_Mushroom_Cap_White": {
  "model": "Blocks/Foliage/Plants/Mushroom_Tall.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Tall_White.png"
  ]
 },
 "Wood_Birch_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Birch.png"
  ]
 },
 "Plant_Moss_Rug_Green": {
  "model": "Blocks/Foliage/Plants/Moss_Rug.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS.png",
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_2.png",
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_3.png"
  ],
  "tint": "#84b338"
 },
 "Plant_Grass_Sharp_Wild": {
  "model": "Blocks/Foliage/Grass/Dense_VeryTall_4Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_VeryTall_4Rows_Sharp.png"
  ],
  "tint": "#67b62d"
 },
 "Plant_Flower_Common_White2": {
  "model": "Blocks/Foliage/Plants/Cross.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Textures/Flower_White.png"
  ]
 },
 "Wood_Ash_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Ash_Side.png",
   "top": "BlockTextures/Wood_Trunk_Ash_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Ash_Top.png"
  }
 },
 "Plant_Leaves_Ash": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Ash.png"
  ]
 },
 "Wood_Ash_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Ash.png"
  ]
 },
 "Wood_Ash_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Ash.png"
  ]
 },
 "Wood_Ash_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Ash.png"
  ]
 },
 "Wood_Ash_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Ash_Side.png",
   "top": "BlockTextures/Wood_Trunk_Ash_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Ash_Full.png"
  }
 },
 "Plant_Moss_Green": {
  "model": "Blocks/Foliage/Plants/Cross_Full.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Full_Textures/Moss_GS.png"
  ],
  "tint": "#84b338"
 },
 "Plant_Fern_Winter": {
  "model": "Blocks/Foliage/Plants/Fern_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Big_Textures/GS.png"
  ],
  "tint": "#686868"
 },
 "Plant_Crop_Mushroom_Common_Brown": {
  "model": "Blocks/Foliage/Plants/Mushroom.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Textures/Brown.png"
  ]
 },
 "Wood_Aspen_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Aspen.png"
  ]
 },
 "Plant_Leaves_Aspen": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Aspen.png"
  ]
 },
 "Soil_Grass_Deep": {
  "cube": {
   "side": "BlockTextures/Soil_Grass_Lush_Side.png",
   "top": "BlockTextures/Soil_Grass_Lush_Top_GS.png",
   "bottom": "BlockTextures/Soil_Dirt_Lush.png",
   "sideMask": "BlockTextures/Soil_Grass_Lush_GS.png"
  },
  "tintUp": true,
  "tint": "#32941f"
 },
 "Rock_Chalk": {
  "cube": {
   "side": "BlockTextures/Chalk.png",
   "top": "BlockTextures/Chalk.png",
   "bottom": "BlockTextures/Chalk.png"
  }
 },
 "Plant_Flower_Tall_Yellow": {
  "model": "Blocks/Foliage/Flowers/Sunflower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Sunflower_Texture.png"
  ]
 },
 "Plant_Flower_Common_Yellow2": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Yellow.png"
  ]
 },
 "Plant_Leaves_Autumn_Floor": {
  "model": "Blocks/Foliage/Plants/Leaves_Floor.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Leaves_Floor_Textures/default.png"
  ],
  "tint": "#a57c2a"
 },
 "Plant_Reeds_Marsh": {
  "model": "Blocks/Foliage/Plants/Reeds.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Reeds_Textures/Reeds_Marsh.png"
  ]
 },
 "Plant_Fern_Forest": {
  "model": "Blocks/Foliage/Plants/Fern_Small.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Small_GS.png"
  ],
  "tint": "#686868"
 },
 "Plant_Bush_Dead_Twisted": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Dead.png",
   "Blocks/Foliage/Plants/Bush_Big_Textures/Dead_Stem.png"
  ]
 },
 "Plant_Bush_Lush": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Green_Dark.png"
  ]
 },
 "Plant_Crop_Mushroom_Cap_Red": {
  "model": "Blocks/Foliage/Plants/Mushroom_Poison.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Poison_White.png"
  ]
 },
 "Plant_Leaves_Autumn": {
  "model": "Blocks/Foliage/Leaves/DownShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/DownShape_Textures/Autumn.png"
  ]
 },
 "Wood_Maple_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/CrimsonMaple.png"
  ]
 },
 "Wood_Maple_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/CrimsonMaple.png"
  ]
 },
 "Wood_Maple_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/CrimsonMaple.png"
  ]
 },
 "Wood_Maple_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_CrimsonMaple_Side.png",
   "top": "BlockTextures/Wood_Trunk_CrimsonMaple_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_CrimsonMaple_Full.png"
  }
 },
 "Plant_Leaves_Maple": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/CrimsonMaple.png"
  ]
 },
 "Wood_Maple_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_CrimsonMaple_Side.png",
   "top": "BlockTextures/Wood_Trunk_CrimsonMaple_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_CrimsonMaple_Top.png"
  }
 },
 "Wood_Aspen_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Aspen_Side.png",
   "top": "BlockTextures/Wood_Trunk_Aspen_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Aspen_Top.png"
  }
 },
 "Wood_Aspen_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Aspen_Side.png",
   "top": "BlockTextures/Wood_Trunk_Aspen_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Aspen_Full.png"
  }
 },
 "Wood_Aspen_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Aspen.png"
  ]
 },
 "Wood_Aspen_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Aspen.png"
  ]
 },
 "Plant_Moss_Rug_Blue": {
  "model": "Blocks/Foliage/Plants/Moss_Rug.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS.png",
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_2.png",
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_3.png"
  ],
  "tint": "#159a6a"
 },
 "Plant_Flower_Bushy_Blue": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/Blue.png"
  ]
 },
 "Plant_Crop_Mushroom_Common_Blue": {
  "model": "Blocks/Foliage/Plants/Mushroom.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Textures/Blue.png"
  ]
 },
 "Plant_Crop_Mushroom_Glowing_Violet": {
  "model": "Blocks/Foliage/Plants/Mushroom_Thin.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Thin_Textures/Purple.png"
  ]
 },
 "Plant_Crop_Mushroom_Glowing_Blue": {
  "model": "Blocks/Foliage/Plants/Mushroom_Thin.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Thin_Textures/Blue.png"
  ]
 },
 "Plant_Moss_Wall_Blue": {
  "model": "Blocks/Foliage/Plants/Moss_Wall.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS.png",
   "Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS2.png",
   "Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS3.png"
  ],
  "tint": "#159a6a"
 },
 "Plant_Fruit_Azure": {
  "model": "Resources/Ingredients/Azure_Fruit.blockymodel",
  "tex": [
   "Resources/Ingredients/Azure_Fruit_Texture.png"
  ]
 },
 "Wood_Azure_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Azure.png"
  ]
 },
 "Plant_Leaves_Azure": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Azure.png"
  ]
 },
 "Wood_Azure_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Azure_Side.png",
   "top": "BlockTextures/Wood_Trunk_Azure_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Azure_Full.png"
  }
 },
 "Wood_Azure_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Azure.png"
  ]
 },
 "Wood_Azure_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Azure_Side.png",
   "top": "BlockTextures/Wood_Trunk_Azure_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Azure_Top.png"
  }
 },
 "Wood_Azure_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Azure.png"
  ]
 },
 "Plant_Moss_Rug_Yellow": {
  "model": "Blocks/Foliage/Plants/Moss_Rug.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS.png",
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_2.png",
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_3.png"
  ],
  "tint": "#c0bb2e"
 },
 "Plant_Moss_Short_Green": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Moss_GS.png"
  ],
  "tint": "#84b338"
 },
 "Plant_Moss_Short_Yellow": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Moss_GS.png"
  ],
  "tint": "#c0bb2e"
 },
 "Plant_Crop_Mushroom_Shelve_Brown": {
  "model": "Blocks/Foliage/Plants/Mushroom_Medium.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Medium_Textures/Brown.png"
  ]
 },
 "Plant_Moss_Cave_Green": {
  "model": "Blocks/Foliage/Plants/HangingMoss.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/HangingMoss_Textures/Moss_GS_01.png",
   "Blocks/Foliage/Plants/HangingMoss_Textures/Moss_GS_02.png"
  ],
  "tint": "#84b338"
 },
 "Wood_Ash_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Ash.png"
  ]
 },
 "Plant_Moss_Wall_Green": {
  "model": "Blocks/Foliage/Plants/Moss_Wall.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS.png",
   "Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS2.png",
   "Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS3.png"
  ],
  "tint": "#84b338"
 },
 "Soil_Mud": {
  "cube": {
   "side": "BlockTextures/Soil_Mud.png",
   "top": "BlockTextures/Soil_Mud.png",
   "bottom": "BlockTextures/Soil_Mud.png"
  }
 },
 "Plant_Crop_Mushroom_Flatcap_Green": {
  "model": "Blocks/Foliage/Plants/Mushroom_Flat.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Flat_White.png"
  ]
 },
 "Plant_Flower_Water_Green": {
  "model": "Blocks/Foliage/Water/Waterlily.blockymodel",
  "tex": [
   "Blocks/Foliage/Water/Waterlily_Textures/01.png",
   "Blocks/Foliage/Water/Waterlily_Textures/02.png",
   "Blocks/Foliage/Water/Waterlily_Textures/03.png"
  ]
 },
 "Plant_Vine_Wall": {
  "model": "Blocks/Foliage/Plants/Ivy.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Ivy_Textures/default.png"
  ]
 },
 "Plant_Crop_Mushroom_Shelve_Green": {
  "model": "Blocks/Foliage/Plants/Mushroom_Medium.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Medium_Textures/Green.png"
  ]
 },
 "Plant_Vine_Hanging": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Hanging_Lianas.png"
  ]
 },
 "Plant_Vine_Liana": {
  "model": "Blocks/Foliage/Plants/Liana.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Liana_Textures/Green_01.png",
   "Blocks/Foliage/Plants/Liana_Textures/Green_02.png",
   "Blocks/Foliage/Plants/Liana_Textures/Green_03.png"
  ]
 },
 "Soil_Grass_Dry": {
  "cube": {
   "side": "BlockTextures/Soil_Grass_Dry_Side.png",
   "top": "BlockTextures/Soil_Grass_Dry_Top_GS.png",
   "bottom": "BlockTextures/Soil_Dirt_Dry.png",
   "sideMask": "BlockTextures/Soil_Grass_Dry_Side_GS.png"
  },
  "tintUp": true,
  "tint": "#f3d97c"
 },
 "Soil_Clay": {
  "cube": {
   "side": "BlockTextures/Soil_Clay.png",
   "top": "BlockTextures/Soil_Clay.png",
   "bottom": "BlockTextures/Soil_Clay.png"
  }
 },
 "Plant_Grass_Arid": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Textures/Grassplant_Dry_GS.png"
  ],
  "tint": "#e4c945"
 },
 "Plant_Grass_Arid_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grassplant_Dry_Short_GS.png"
  ],
  "tint": "#e4c945"
 },
 "Plant_Grass_Dry_Tall": {
  "model": "Blocks/Foliage/Grass/VeryTall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/VeryTall_Textures/Savannah.png"
  ],
  "tint": "#e4c945"
 },
 "Plant_Grass_Arid_Tall": {
  "model": "Blocks/Foliage/Grass/Savannah.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Savannah_Texture.png"
  ],
  "tint": "#e4c945"
 },
 "Plant_Grass_Dry": {
  "model": "Blocks/Foliage/Grass/Tall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Tall_Textures/Dry.png"
  ],
  "tint": "#e4c945"
 },
 "Plant_Cactus_Ball_1": {
  "model": "Blocks/Foliage/Plants/Cactus_Ball01.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cactus_Ball01_Texture.png"
  ]
 },
 "Plant_Flower_Bushy_Yellow": {
  "model": "Blocks/Foliage/Plants/Bramble_Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bramble_Ball_Texture.png"
  ]
 },
 "Plant_Flower_Common_Purple": {
  "model": "Blocks/Foliage/Flowers/FlowerSmall.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/FlowerSmall_Textures/Arid_Purple.png"
  ]
 },
 "Plant_Flower_Common_Blue": {
  "model": "Blocks/Foliage/Flowers/Flower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Flower_Textures/Blue.png"
  ]
 },
 "Plant_Leaves_Bottle": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Bottle.png"
  ]
 },
 "Wood_Gumboab_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Gumboab_Side.png",
   "top": "BlockTextures/Wood_Trunk_Gumboab_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Gumboab_Full.png"
  }
 },
 "Wood_Gumboab_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Gumboab_Side.png",
   "top": "BlockTextures/Wood_Trunk_Gumboab_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Gumboab_Top.png"
  }
 },
 "Wood_Gumboab_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Gumboab.png"
  ]
 },
 "Wood_Gumboab_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Gumboab.png"
  ]
 },
 "Wood_Gumboab_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Gumboab.png"
  ]
 },
 "Wood_Dry_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Dry.png"
  ]
 },
 "Wood_Dry_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Dry.png"
  ]
 },
 "Plant_Leaves_Dry": {
  "model": "Blocks/Foliage/Leaves/DownShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/DownShape_Textures/Dry.png"
  ]
 },
 "Wood_Dry_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Dry.png",
   "top": "BlockTextures/Wood_Trunk_Dry_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Dry_Top.png"
  }
 },
 "Wood_Dry_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Dry.png",
   "top": "BlockTextures/Wood_Trunk_Dry_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Dry_Full.png"
  }
 },
 "Plant_Flower_Common_White": {
  "model": "Blocks/Foliage/Flowers/Hydrangea.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Hydrangea_White.png"
  ]
 },
 "Plant_Vine_Wall_Dry": {
  "model": "Blocks/Foliage/Plants/Vine.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Vine_Dry.png"
  ]
 },
 "Wood_Bottletree_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Bottle_Side.png",
   "top": "BlockTextures/Wood_Trunk_Bottle_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Bottle_Full.png"
  }
 },
 "Wood_Bottletree_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Bottle.png"
  ]
 },
 "Wood_Bottletree_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Bottle_Side.png",
   "top": "BlockTextures/Wood_Trunk_Bottle_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Bottle_Top.png"
  }
 },
 "Wood_Bottletree_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Bottle.png"
  ]
 },
 "Plant_Flower_Common_Cyan": {
  "model": "Blocks/Foliage/Flowers/FlowerSmall.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/FlowerSmall_Textures/Arid_Cyan.png"
  ]
 },
 "Soil_Gravel_Sand_White": {
  "cube": {
   "side": "BlockTextures/Soil_Sandstone_Gravel.png",
   "top": "BlockTextures/Soil_Sandstone_Gravel.png",
   "bottom": "BlockTextures/Soil_Sandstone_Gravel.png"
  }
 },
 "Rock_Sandstone": {
  "cube": {
   "side": "BlockTextures/Rock_Sandstone_Side.png",
   "top": "BlockTextures/Rock_Sandstone_Top.png",
   "bottom": "BlockTextures/Rock_Sandstone_Top.png"
  }
 },
 "Plant_Bramble_Dry_Twisted": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Brambles.png"
  ]
 },
 "Plant_Bush_Arid": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Arid.png"
  ]
 },
 "Plant_Flower_Common_Blue2": {
  "model": "Blocks/Foliage/Plants/Aloe.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Aloe_Texture.png"
  ]
 },
 "Plant_Flower_Common_Lime2": {
  "model": "Blocks/Foliage/Plants/Succulent.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Succulent_Texture.png"
  ]
 },
 "Plant_Flower_Common_Poisoned": {
  "model": "Blocks/Foliage/Plants/Parched_Thorn.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Parched_Thorn_Texture.png"
  ]
 },
 "Plant_Cactus_1": {
  "model": "Blocks/Foliage/Plants/Cactus1.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cactus1_Texture.png"
  ]
 },
 "Plant_Cactus_2": {
  "model": "Blocks/Foliage/Plants/Cactus2.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cactus1_Texture.png"
  ]
 },
 "Plant_Cactus_3": {
  "model": "Blocks/Foliage/Plants/Cactus3.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cactus1_Texture.png"
  ]
 },
 "Plant_Cactus_Flat_1": {
  "model": "Blocks/Foliage/Plants/CactusFlat1.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/CactusFlat1_Texture.png"
  ]
 },
 "Soil_Sand_Red": {
  "cube": {
   "side": "BlockTextures/Soil_Sand_Red.png",
   "top": "BlockTextures/Soil_Sand_Red.png",
   "bottom": "BlockTextures/Soil_Sand_Red.png"
  }
 },
 "Plant_Bramble_Dry_Sandthorn": {
  "model": "Blocks/Foliage/Plants/Alien.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Alien_Textures/Orange.png"
  ]
 },
 "Plant_Flower_Flax_Orange": {
  "model": "Blocks/Foliage/Plants/Fern_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Big_Textures/Flower_Fire.png"
  ]
 },
 "Soil_Sand_White": {
  "cube": {
   "side": "BlockTextures/Soil_Sand_White.png",
   "top": "BlockTextures/Soil_Sand_White.png",
   "bottom": "BlockTextures/Soil_Sand_White.png"
  }
 },
 "Rock_Sandstone_White": {
  "cube": {
   "side": "BlockTextures/Rock_Sandstone_White_Side.png",
   "top": "BlockTextures/Rock_Sandstone_White_Top.png",
   "bottom": "BlockTextures/Rock_Sandstone_White_Top.png"
  }
 },
 "Plant_Leaves_Bramble": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Gramble.png"
  ]
 },
 "Wood_Palm_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Palm.png"
  ]
 },
 "Plant_Fruit_Coconut": {
  "model": "Resources/Ingredients/Coconut.blockymodel",
  "tex": [
   "Resources/Ingredients/Coconut_Texture.png"
  ]
 },
 "Plant_Leaves_Palm_Oasis": {
  "model": "Blocks/Foliage/Plants/Palm_Giant.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Palm_Giant_Dark.png"
  ]
 },
 "Rock_Sandstone_Red": {
  "cube": {
   "side": "BlockTextures/Rock_Sandstone_Red.png",
   "top": "BlockTextures/Rock_Sandstone_Red_Top.png",
   "bottom": "BlockTextures/Rock_Sandstone_Red_Top.png"
  }
 },
 "Wood_Dry_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Dry.png"
  ]
 },
 "Wood_Dry_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Dry.png"
  ]
 },
 "Plant_Flower_Common_Grey2": {
  "model": "Blocks/Foliage/Plants/Rocky_Flower.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Rocky_Flower_Texture.png"
  ]
 },
 "Plant_Flower_Bushy_Red": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/Red.png"
  ]
 },
 "Wood_Palo_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Palo.png"
  ]
 },
 "Wood_Palo_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Palo.png",
   "top": "BlockTextures/Wood_Trunk_Palo_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Palo_Full.png"
  }
 },
 "Plant_Leaves_Palo": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Palo.png"
  ]
 },
 "Wood_Palo_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Palo.png",
   "top": "BlockTextures/Wood_Trunk_Palo_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Palo_Top.png"
  }
 },
 "Plant_Bush_Arid_Sharp": {
  "model": "Blocks/Foliage/Plants/Fern_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Big_Textures/Grass_Dry.png"
  ]
 },
 "Soil_Dirt_Dry": {
  "cube": {
   "side": "BlockTextures/Soil_Dirt_Dry.png",
   "top": "BlockTextures/Soil_Dirt_Dry.png",
   "bottom": "BlockTextures/Soil_Dirt_Dry.png"
  }
 },
 "Wood_Petrified_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Petrified_Side.png",
   "top": "BlockTextures/Wood_Trunk_Petrified_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Petrified_Full.png"
  }
 },
 "Rock_Crystal_Yellow_Block": {
  "cube": {
   "side": "BlockTextures/Rock_Crystal_Yellow.png",
   "top": "BlockTextures/Rock_Crystal_Yellow_Top.png",
   "bottom": "BlockTextures/Rock_Crystal_Yellow_Top.png"
  }
 },
 "Wood_Fir_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Fir_Trunk_Side.png",
   "top": "BlockTextures/Wood_Fir_Trunk_Full.png",
   "bottom": "BlockTextures/Wood_Fir_Trunk_Full.png"
  }
 },
 "Plant_Crop_Mushroom_Block_Yellow": {
  "cube": {
   "side": "BlockTextures/Mushroom_Block_Yellow.png",
   "top": "BlockTextures/Mushroom_Block_Top_Yellow.png",
   "bottom": "BlockTextures/Mushroom_Block_Top_Yellow.png"
  }
 },
 "Plant_Crop_Mushroom_Block_Green": {
  "cube": {
   "side": "BlockTextures/Mushroom_Block_Green.png",
   "top": "BlockTextures/Mushroom_Block_Top_Green.png",
   "bottom": "BlockTextures/Mushroom_Block_Green_Trunk_Top.png"
  }
 },
 "Rock_Crystal_Green_Block": {
  "cube": {
   "side": "BlockTextures/Rock_Crystal_Green.png",
   "top": "BlockTextures/Rock_Crystal_Green_Top.png",
   "bottom": "BlockTextures/Rock_Crystal_Green_Top.png"
  }
 },
 "Soil_Grass_Cold": {
  "cube": {
   "side": "BlockTextures/Soil_Grass_Cold_Side.png",
   "top": "BlockTextures/Soil_Grass_Cold_Top.png",
   "bottom": "BlockTextures/Soil_Dirt_Cold.png",
   "sideMask": "BlockTextures/Soil_Grass_Cold_Side_GS.png"
  },
  "tintUp": true
 },
 "Soil_Dirt_Cold": {
  "cube": {
   "side": "BlockTextures/Soil_Dirt_Cold.png",
   "top": "BlockTextures/Soil_Dirt_Cold.png",
   "bottom": "BlockTextures/Soil_Dirt_Cold.png"
  }
 },
 "Plant_Grass_Winter_Tall": {
  "model": "Blocks/Foliage/Grass/Tall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Tall_Textures/Winter.png"
  ],
  "tint": "#2db668"
 },
 "Plant_Grass_Winter": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Grass_Winter.png"
  ],
  "tint": "#2db668"
 },
 "Plant_Bush_Winter_Snow": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Snow.png"
  ]
 },
 "Wood_Fir_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Spruce.png"
  ]
 },
 "Plant_Leaves_Fir": {
  "model": "Blocks/Foliage/Leaves/PineShape_NSEW.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine.png"
  ]
 },
 "Plant_Leaves_Fir_Tip": {
  "model": "Blocks/Foliage/Leaves/PineShape_Tip.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine.png"
  ]
 },
 "Wood_Fir_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Spruce.png"
  ]
 },
 "Wood_Fir_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Fir_Trunk_Side.png",
   "top": "BlockTextures/Wood_Fir_Trunk_Top.png",
   "bottom": "BlockTextures/Wood_Fir_Trunk_Top.png"
  }
 },
 "Soil_Needles": {
  "cube": {
   "side": "BlockTextures/Soil_Needles.png",
   "top": "BlockTextures/Soil_Needles.png",
   "bottom": "BlockTextures/Soil_Needles.png"
  }
 },
 "Plant_Moss_Rug_Lime": {
  "model": "Blocks/Foliage/Plants/Sorrel_Rug.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Sorrel_Rug_Texture.png"
  ]
 },
 "Wood_Redwood_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_RedWood.png",
   "top": "BlockTextures/Wood_Trunk_RedWood_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_RedWood_Top.png"
  }
 },
 "Wood_Redwood_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Redwood.png"
  ]
 },
 "Wood_Redwood_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_RedWood.png",
   "top": "BlockTextures/Wood_Trunk_RedWood_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_RedWood_Full.png"
  }
 },
 "Plant_Leaves_Redwood": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Redwood.png"
  ]
 },
 "Wood_Cedar_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Cedar.png"
  ]
 },
 "Wood_Cedar_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Cedar.png",
   "top": "BlockTextures/Wood_Trunk_Cedar_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Cedar_Top.png"
  }
 },
 "Wood_Cedar_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Cedar.png"
  ]
 },
 "Plant_Leaves_Cedar": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar.png",
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar2.png"
  ]
 },
 "Wood_Cedar_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Cedar.png",
   "top": "BlockTextures/Wood_Trunk_Cedar_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Cedar_Full.png"
  }
 },
 "Wood_Cedar_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Cedar.png"
  ]
 },
 "Plant_Crop_Mushroom_Cap_Green": {
  "model": "Blocks/Foliage/Plants/Mushroom_Fox.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Fox_Green.png"
  ]
 },
 "Plant_Flower_Bushy_Green": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/default.png"
  ]
 },
 "Plant_Leaves_Dead": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Dead.png"
  ]
 },
 "Wood_Fir_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Spruce.png"
  ]
 },
 "Rock_Basalt": {
  "cube": {
   "side": "BlockTextures/Rock_Basalt.png",
   "top": "BlockTextures/Rock_Basalt.png",
   "bottom": "BlockTextures/Rock_Basalt.png"
  }
 },
 "Plant_Reeds_Winter": {
  "model": "Blocks/Foliage/Plants/ReedWinter.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/ReedWinter_Texture.png"
  ]
 },
 "Soil_Gravel": {
  "cube": {
   "side": "BlockTextures/Soil_Gravel.png",
   "top": "BlockTextures/Soil_Gravel.png",
   "bottom": "BlockTextures/Soil_Gravel.png"
  }
 },
 "Plant_Grass_Cave_Short": {
  "model": "Blocks/Foliage/Plants/Cross.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Textures/Cave_Short.png"
  ]
 },
 "Plant_Flower_Common_Orange": {
  "model": "Blocks/Foliage/Flowers/Chrysanthemum.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Chrysanthemum_Texture.png"
  ]
 },
 "Plant_Bush_Winter_Red": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Red.png"
  ]
 },
 "Plant_Leaves_Fir_Red": {
  "model": "Blocks/Foliage/Leaves/PineShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_Textures/RedPine.png"
  ]
 },
 "Plant_Bush_Winter": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Frozen.png"
  ]
 },
 "Plant_Crop_Mushroom_Flatcap_Blue": {
  "model": "Blocks/Foliage/Plants/Mushroom_Flat.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Flat_Blue.png"
  ]
 },
 "Soil_Snow": {
  "cube": {
   "side": "BlockTextures/Soil_Snow.png",
   "top": "BlockTextures/Soil_Snow.png",
   "bottom": "BlockTextures/Soil_Snow.png"
  }
 },
 "Plant_Bush_Winter_Sharp": {
  "model": "Blocks/Foliage/Plants/Fern_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Big_Textures/Winter.png"
  ]
 },
 "Rock_Ice": {
  "cube": {
   "side": "BlockTextures/Rock_Ice.png",
   "top": "BlockTextures/Rock_Ice.png",
   "bottom": "BlockTextures/Rock_Ice.png"
  }
 },
 "Rock_Ice_Permafrost": {
  "cube": {
   "side": "BlockTextures/Rock_Ice_Blue.png",
   "top": "BlockTextures/Rock_Ice_Blue.png",
   "bottom": "BlockTextures/Rock_Ice_Blue.png"
  }
 },
 "Plant_Grass_Snowy": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Grass_Winter.png"
  ]
 },
 "Plant_Grass_Snowy_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small_Snow.png"
  ]
 },
 "Plant_Flower_Bushy_White": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/White.png"
  ]
 },
 "Plant_Grass_Winter_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grassplant_Winter_Short_GS.png"
  ],
  "tint": "#2db668"
 },
 "Plant_Leaves_Fir_Snow": {
  "model": "Blocks/Foliage/Leaves/PineShape_NSEW.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine_Snowy.png"
  ]
 },
 "Plant_Leaves_Fir_Tip_Snow": {
  "model": "Blocks/Foliage/Leaves/PineShape_Tip.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine_Snowy.png"
  ]
 },
 "Soil_Ash": {
  "cube": {
   "side": "BlockTextures/Soil_Ashes.png",
   "top": "BlockTextures/Soil_Ashes.png",
   "bottom": "BlockTextures/Soil_Ashes.png"
  }
 },
 "Plant_Grass_Jungle": {
  "model": "Blocks/Foliage/Grass/Dense_Small_4Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/Jungle.png"
  ],
  "tint": "#5ca12d"
 },
 "Plant_Grass_Jungle_Short": {
  "model": "Blocks/Foliage/Plants/Cross_17px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_17px_Textures/Jungle_GS.png"
  ],
  "tint": "#5ca12d"
 },
 "Plant_Leaves_Jungle_Floor": {
  "model": "Blocks/Foliage/Plants/Leaves_Floor.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Leaves_Floor_Textures/Jungle.png"
  ]
 },
 "Plant_Grass_Jungle_Tall": {
  "model": "Blocks/Foliage/Grass/Dense_Tall_Jungle.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_Tall_Jungle_default.png"
  ],
  "tint": "#5ca12d"
 },
 "Plant_Bush_Jungle": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Jungle_Green.png"
  ]
 },
 "Plant_Bush_Arid_Palm": {
  "model": "Blocks/Foliage/Plants/Fern_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Big_Textures/Arid_Palm.png"
  ]
 },
 "Plant_Bush_Dead": {
  "model": "Blocks/Foliage/Plants/Bush_Dead.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Dead_Texture.png"
  ]
 },
 "Wood_Camphor_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Camphor.png"
  ]
 },
 "Rock_Crystal_Red_Medium": {
  "model": "Resources/Crystals/Crystal_Medium.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Red.png"
  ]
 },
 "Wood_Camphor_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Camphor.png",
   "top": "BlockTextures/Wood_Trunk_Camphor_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Camphor_Full.png"
  }
 },
 "Wood_Camphor_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Camphor.png",
   "top": "BlockTextures/Wood_Trunk_Camphor_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Camphor_Top.png"
  }
 },
 "Wood_Camphor_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Camphor.png"
  ]
 },
 "Plant_Leaves_Camphor": {
  "model": "Blocks/Foliage/Leaves/Hanging.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Hanging_Textures/Camphor.png"
  ]
 },
 "Wood_Bamboo_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long_Simple_UV.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Long_Simple_UV_Textures/Bamboo.png"
  ]
 },
 "Plant_Leaves_Bamboo": {
  "model": "Blocks/Foliage/Leaves/DownShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/DownShape_Textures/Bamboo.png"
  ]
 },
 "Soil_Grass_Burnt": {
  "cube": {
   "side": "BlockTextures/Soil_Grass_Burnt_Side.png",
   "top": "BlockTextures/Soil_Grass_Burnt_Top_GS.png",
   "bottom": "BlockTextures/Soil_Dirt_Burnt.png",
   "sideMask": "BlockTextures/Soil_Grass_Burnt_Side_GS.png"
  },
  "tintUp": true
 },
 "Soil_Dirt_Burnt": {
  "cube": {
   "side": "BlockTextures/Soil_Dirt_Burnt.png",
   "top": "BlockTextures/Soil_Dirt_Burnt.png",
   "bottom": "BlockTextures/Soil_Dirt_Burnt.png"
  }
 },
 "Plant_Grass_Gnarled": {
  "model": "Blocks/Foliage/Plants/Cross.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Textures/Gnarled.png"
  ],
  "tint": "#7f8a38"
 },
 "Plant_Grass_Gnarled_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small_Gnarled.png"
  ],
  "tint": "#7f8a38"
 },
 "Plant_Grass_Gnarled_Tall": {
  "model": "Blocks/Foliage/Grass/Tall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Tall_Textures/Gnarled_Tall_GS.png"
  ],
  "tint": "#7f8a38"
 },
 "Plant_Leaves_Petrified": {
  "model": "Blocks/Foliage/Leaves/PineShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_Textures/Petrified.png"
  ]
 },
 "Wood_Petrified_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Petrified.png"
  ]
 },
 "Wood_Petrified_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Petrified.png"
  ]
 },
 "Wood_Petrified_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Petrified_Side.png",
   "top": "BlockTextures/Wood_Trunk_Petrified_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Petrified_Top.png"
  }
 },
 "Wood_Burnt_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Burnt.png",
   "top": "BlockTextures/Wood_Trunk_Burnt_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Burnt_Top.png"
  }
 },
 "Plant_Leaves_Burnt": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Burnt.png"
  ]
 },
 "Wood_Petrified_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Petrified.png"
  ]
 },
 "Soil_Dirt_Poisoned": {
  "cube": {
   "side": "BlockTextures/Soil_Dirt_Poisonned.png",
   "top": "BlockTextures/Soil_Dirt_Poisonned.png",
   "bottom": "BlockTextures/Soil_Dirt_Poisonned.png"
  }
 },
 "Plant_Reeds_Water": {
  "model": "Blocks/Foliage/Grass/VeryTall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/VeryTall_Textures/Water_GS.png"
  ],
  "tint": "#698a38"
 },
 "Plant_Reeds_Poison": {
  "model": "Blocks/Foliage/Plants/Reeds.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Reeds_Textures/Reeds_Poison.png"
  ]
 },
 "Plant_Flower_Bushy_Poisoned": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/Poisoned.png"
  ]
 },
 "Plant_Crop_Mushroom_Glowing_Red": {
  "model": "Blocks/Foliage/Plants/Mushroom_Thin.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Thin_Textures/Yellow.png"
  ]
 },
 "Plant_Bramble_Moss_Twisted": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Brambles_Green.png"
  ]
 },
 "Plant_Bush_Dead_Tall": {
  "model": "Blocks/Foliage/Plants/Shrub.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Shrub_Winter.png"
  ]
 },
 "Plant_Moss_Rug_Green_Dark": {
  "model": "Blocks/Foliage/Plants/Moss_Rug.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS.png",
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_2.png",
   "Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_3.png"
  ],
  "tint": "#75883c"
 },
 "Plant_Flower_Orchid_Orange": {
  "model": "Blocks/Foliage/Flowers/RareFlower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/RareFlower_Textures/Orange.png"
  ]
 },
 "Wood_Sallow_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Sallow.png"
  ]
 },
 "Wood_Sallow_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_trunk_Sallow_Side.png",
   "top": "BlockTextures/Wood_trunk_Sallow_Full.png",
   "bottom": "BlockTextures/Wood_trunk_Sallow_Full.png"
  }
 },
 "Plant_Leaves_Sallow": {
  "model": "Blocks/Foliage/Leaves/Hanging.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Hanging_Textures/Sallow.png"
  ]
 },
 "Wood_Sallow_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Sallow.png"
  ]
 },
 "Wood_Sallow_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_trunk_Sallow_Side.png",
   "top": "BlockTextures/Wood_trunk_Sallow_Top.png",
   "bottom": "BlockTextures/Wood_trunk_Sallow_Top.png"
  }
 },
 "Wood_Burnt_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Burnt.png"
  ]
 },
 "Wood_Burnt_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Burnt.png"
  ]
 },
 "Wood_Burnt_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Burnt.png",
   "top": "BlockTextures/Wood_Trunk_Burnt_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Burnt_Full.png"
  }
 },
 "Wood_Burnt_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Burnt.png"
  ]
 },
 "Rock_Slate": {
  "cube": {
   "side": "BlockTextures/Rock_Slate_Side.png",
   "top": "BlockTextures/Rock_Slate.png",
   "bottom": "BlockTextures/Rock_Slate.png"
  }
 },
 "Plant_Bush_Crystal": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Crystal_Red.png"
  ]
 },
 "Rock_Crystal_Yellow_Small": {
  "model": "Resources/Crystals/Crystal_Small.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Yellow.png"
  ]
 },
 "Rock_Crystal_Yellow_Medium": {
  "model": "Resources/Crystals/Crystal_Medium.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Yellow.png"
  ]
 },
 "Rock_Crystal_Yellow_Large": {
  "model": "Resources/Crystals/Crystal_Big.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Yellow.png"
  ]
 },
 "Rock_Crystal_Green_Small": {
  "model": "Resources/Crystals/Crystal_Small.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Green.png"
  ]
 },
 "Rock_Crystal_Green_Large": {
  "model": "Resources/Crystals/Crystal_Big.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Green.png"
  ]
 },
 "Rock_Crystal_Green_Medium": {
  "model": "Resources/Crystals/Crystal_Medium.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Green.png"
  ]
 },
 "Wood_Crystal_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Crystal.png"
  ]
 },
 "Rock_Crystal_Pink_Small": {
  "model": "Resources/Crystals/Crystal_Small.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Pink.png"
  ]
 },
 "Rock_Crystal_Pink_Large": {
  "model": "Resources/Crystals/Crystal_Big.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Pink.png"
  ]
 },
 "Plant_Leaves_Crystal": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Crystal.png"
  ]
 },
 "Plant_Flower_Common_Poisoned2": {
  "model": "Blocks/Foliage/Flowers/Jungle_Orange.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Jungle_Orange_Pink.png"
  ]
 },
 "Wood_Crystal_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Crystal.png",
   "top": "BlockTextures/Wood_Trunk_Crystal_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Crystal_Top.png"
  }
 },
 "Rock_Crystal_Pink_Medium": {
  "model": "Resources/Crystals/Crystal_Medium.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Pink.png"
  ]
 },
 "Rock_Crystal_Pink_Block": {
  "cube": {
   "side": "BlockTextures/Rock_Crystal_Pink.png",
   "top": "BlockTextures/Rock_Crystal_Pink_Top.png",
   "bottom": "BlockTextures/Rock_Crystal_Pink_Top.png"
  }
 },
 "Wood_Crystal_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Crystal.png"
  ]
 },
 "Wood_Crystal_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Crystal.png",
   "top": "BlockTextures/Wood_Trunk_Crystal_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Crystal_Full.png"
  }
 },
 "Plant_Fruit_Pinkberry": {
  "model": "Resources/Ingredients/Pink_Fruit.blockymodel",
  "tex": [
   "Resources/Ingredients/Pink_Fruit_Texture.png"
  ]
 },
 "Wood_Crystal_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Crystal.png"
  ]
 },
 "Rock_Volcanic": {
  "cube": {
   "side": "BlockTextures/Rock_Volcanic.png",
   "top": "BlockTextures/Rock_Volcanic.png",
   "bottom": "BlockTextures/Rock_Volcanic.png"
  }
 },
 "Plant_Bramble_Dead_Lavathorn": {
  "model": "Blocks/Foliage/Plants/Alien.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Alien_Textures/Blue.png"
  ]
 },
 "Plant_Fern_Jungle": {
  "model": "Blocks/Foliage/Plants/Fern_Giant.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Giant_Jungle.png"
  ]
 },
 "Plant_Fern_Jungle_Trunk": {
  "model": "Blocks/Foliage/Plants/Fern_Giant_Trunk.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Giant_Trunk_Texture.png"
  ]
 },
 "Wood_Fire_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Fire.png"
  ]
 },
 "Wood_Fire_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Fire.png"
  ]
 },
 "Deco_Fire": {
  "model": "Items/Projectiles/Projectile.blockymodel",
  "tex": [
   "Items/Projectiles/Tornado_Texture.png"
  ]
 },
 "Plant_Leaves_Fire": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Fire.png"
  ]
 },
 "Wood_Fire_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Fire.png",
   "top": "BlockTextures/Wood_Trunk_Fire_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Fire_Full.png"
  }
 },
 "Wood_Fire_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Fire.png",
   "top": "BlockTextures/Wood_Trunk_Fire_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Fire_Top.png"
  }
 },
 "Wood_Burnt_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Burnt.png"
  ]
 },
 "Soil_Sand_Ashen": {
  "cube": {
   "side": "BlockTextures/Soil_Sand_Ashen.png",
   "top": "BlockTextures/Soil_Sand_Ashen.png",
   "bottom": "BlockTextures/Soil_Sand_Ashen.png"
  }
 },
 "Plant_Flower_Tall_Cyan": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Jungle_Blue.png"
  ]
 },
 "Plant_Crop_Mushroom_Glowing_Green": {
  "model": "Blocks/Foliage/Plants/Mushroom_Thin.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Thin_Textures/Green.png"
  ]
 },
 "Wood_Fig_Blue_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Fig_Blue_Side.png",
   "top": "BlockTextures/Wood_Trunk_Fig_Blue_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Fig_Blue_Top.png"
  }
 },
 "Plant_Leaves_Fig_Blue": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Fig_Blue.png"
  ]
 },
 "Wood_Fig_Blue_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Fig_Blue.png"
  ]
 },
 "Wood_Fig_Blue_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Fig_Blue.png"
  ]
 },
 "Wood_Fig_Blue_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Fig_Blue_Side.png",
   "top": "BlockTextures/Wood_Trunk_Fig_Blue_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Fig_Blue_Full.png"
  }
 },
 "Plant_Seaweed_Grass": {
  "model": "Blocks/Foliage/Grass/Dense_Small_4Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/Seaweeds_GS.png"
  ],
  "tint": "#37ae8f"
 },
 "Soil_Gravel_Sand": {
  "cube": {
   "side": "BlockTextures/Soil_Gravel_Sand.png",
   "top": "BlockTextures/Soil_Gravel_Sand.png",
   "bottom": "BlockTextures/Soil_Gravel_Sand.png"
  }
 },
 "Soil_Clay_Orange": {
  "cube": {
   "side": "BlockTextures/Clay_Orange.png",
   "top": "BlockTextures/Clay_Orange.png",
   "bottom": "BlockTextures/Clay_Orange.png"
  }
 },
 "Plant_Leaves_Palm_Arid": {
  "model": "Blocks/Foliage/Plants/Palm_Giant.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Palm_Giant_default.png"
  ]
 },
 "Plant_Grass_Rocky": {
  "model": "Blocks/Foliage/Plants/Cross_17px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_17px_Textures/Rocky_GS.png"
  ],
  "tint": "#dcb86d"
 },
 "Soil_Clay_Smooth_Black": {
  "cube": {
   "side": "BlockTextures/Clay_Smooth_Black.png",
   "top": "BlockTextures/Clay_Smooth_Black.png",
   "bottom": "BlockTextures/Clay_Smooth_Black.png"
  }
 },
 "Soil_Sand": {
  "cube": {
   "side": "BlockTextures/Soil_Sand.png",
   "top": "BlockTextures/Soil_Sand.png",
   "bottom": "BlockTextures/Soil_Sand.png"
  }
 },
 "Plant_Seaweed_Grass_Tall": {
  "model": "Blocks/Foliage/Grass/VeryTall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/VeryTall_Textures/Seaweed_Tall_GS.png"
  ],
  "tint": "#37ae8f"
 },
 "Plant_Seaweed_Grass_Stack": {
  "model": "Blocks/Foliage/Plants/Cross.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Textures/Seaweed_Stackable.png"
  ]
 },
 "Plant_Coral_Bush_Pink": {
  "model": "Blocks/Foliage/Water/Coral_Bush.blockymodel",
  "tex": [
   "Blocks/Foliage/Water/Coral_Bush_Textures/Pink.png"
  ]
 },
 "Plant_Coral_Bush_Cyan": {
  "model": "Blocks/Foliage/Water/Coral_Bush.blockymodel",
  "tex": [
   "Blocks/Foliage/Water/Coral_Bush_Textures/Cyan.png"
  ]
 },
 "Plant_Coral_Bush_Yellow": {
  "model": "Blocks/Foliage/Water/Coral_Bush.blockymodel",
  "tex": [
   "Blocks/Foliage/Water/Coral_Bush_Textures/Yellow.png"
  ]
 },
 "Plant_Coral_Bush_Purple": {
  "model": "Blocks/Foliage/Water/Coral_Bush_Small.blockymodel",
  "tex": [
   "Blocks/Foliage/Water/Coral_Bush_Small_Purple.png"
  ]
 },
 "Furniture_Village_Chair": {
  "model": "Blocks/Decorative_Sets/Village/Chair.blockymodel",
  "tex": [
   "Blocks/Decorative_Sets/Village/Chair_Texture.png"
  ]
 },
 "Furniture_Village_Bed": {
  "model": "Blocks/Decorative_Sets/Village/Bed.blockymodel",
  "tex": [
   "Blocks/Decorative_Sets/Village/Bed_Texture.png"
  ]
 },
 "Furniture_Village_Ladder": {
  "model": "Blocks/Decorative_Sets/Village/Ladder.blockymodel",
  "tex": [
   "Blocks/Decorative_Sets/Village/Ladder_Texture.png"
  ]
 },
 "Bench_WorkBench": {
  "model": "Blocks/Benches/Workbench.blockymodel",
  "tex": [
   "Blocks/Benches/Workbench_Texture.png"
  ]
 },
 "Wood_Softwood_Planks": {
  "cube": {
   "side": "BlockTextures/Wood_Softwood_Planks_Side.png",
   "top": [
    "BlockTextures/Wood_Softwood_Planks_02.png",
    "BlockTextures/Wood_Softwood_Planks_03.png",
    "BlockTextures/Wood_Softwood_Planks_Top.png"
   ],
   "bottom": "BlockTextures/Wood_Softwood_Planks_Top.png"
  }
 }
};
export const SCENE_FILES = ["Common/BlockTextures/Chalk.png", "Common/BlockTextures/Clay_Orange.png", "Common/BlockTextures/Clay_Smooth_Black.png", "Common/BlockTextures/Mushroom_Block_Green.png", "Common/BlockTextures/Mushroom_Block_Green_Trunk_Top.png", "Common/BlockTextures/Mushroom_Block_Top_Green.png", "Common/BlockTextures/Mushroom_Block_Top_Yellow.png", "Common/BlockTextures/Mushroom_Block_Yellow.png", "Common/BlockTextures/Rock_Basalt.png", "Common/BlockTextures/Rock_Crystal_Green.png", "Common/BlockTextures/Rock_Crystal_Green_Top.png", "Common/BlockTextures/Rock_Crystal_Pink.png", "Common/BlockTextures/Rock_Crystal_Pink_Top.png", "Common/BlockTextures/Rock_Crystal_Yellow.png", "Common/BlockTextures/Rock_Crystal_Yellow_Top.png", "Common/BlockTextures/Rock_Ice.png", "Common/BlockTextures/Rock_Ice_Blue.png", "Common/BlockTextures/Rock_Sandstone_Red.png", "Common/BlockTextures/Rock_Sandstone_Red_Top.png", "Common/BlockTextures/Rock_Sandstone_Side.png", "Common/BlockTextures/Rock_Sandstone_Top.png", "Common/BlockTextures/Rock_Sandstone_White_Side.png", "Common/BlockTextures/Rock_Sandstone_White_Top.png", "Common/BlockTextures/Rock_Slate.png", "Common/BlockTextures/Rock_Slate_Side.png", "Common/BlockTextures/Rock_Volcanic.png", "Common/BlockTextures/Soil_Ashes.png", "Common/BlockTextures/Soil_Clay.png", "Common/BlockTextures/Soil_Dirt.png", "Common/BlockTextures/Soil_Dirt_Burnt.png", "Common/BlockTextures/Soil_Dirt_Cold.png", "Common/BlockTextures/Soil_Dirt_Dry.png", "Common/BlockTextures/Soil_Dirt_Lush.png", "Common/BlockTextures/Soil_Dirt_Poisonned.png", "Common/BlockTextures/Soil_Grass_Burnt_Side.png", "Common/BlockTextures/Soil_Grass_Burnt_Side_GS.png", "Common/BlockTextures/Soil_Grass_Burnt_Top_GS.png", "Common/BlockTextures/Soil_Grass_Cold_Side.png", "Common/BlockTextures/Soil_Grass_Cold_Side_GS.png", "Common/BlockTextures/Soil_Grass_Cold_Top.png", "Common/BlockTextures/Soil_Grass_Dry_Side.png", "Common/BlockTextures/Soil_Grass_Dry_Side_GS.png", "Common/BlockTextures/Soil_Grass_Dry_Top_GS.png", "Common/BlockTextures/Soil_Grass_GS.png", "Common/BlockTextures/Soil_Grass_GS_02.png", "Common/BlockTextures/Soil_Grass_Lush_GS.png", "Common/BlockTextures/Soil_Grass_Lush_Side.png", "Common/BlockTextures/Soil_Grass_Lush_Top_GS.png", "Common/BlockTextures/Soil_Grass_Side.png", "Common/BlockTextures/Soil_Grass_Side_Full_GS.png", "Common/BlockTextures/Soil_Gravel.png", "Common/BlockTextures/Soil_Gravel_Sand.png", "Common/BlockTextures/Soil_Mud.png", "Common/BlockTextures/Soil_Needles.png", "Common/BlockTextures/Soil_Sand.png", "Common/BlockTextures/Soil_Sand_Ashen.png", "Common/BlockTextures/Soil_Sand_Red.png", "Common/BlockTextures/Soil_Sand_White.png", "Common/BlockTextures/Soil_Sandstone_Gravel.png", "Common/BlockTextures/Soil_Snow.png", "Common/BlockTextures/Soil_grass_Side_Mask_GS.png", "Common/BlockTextures/Wood_Fir_Trunk_Full.png", "Common/BlockTextures/Wood_Fir_Trunk_Side.png", "Common/BlockTextures/Wood_Fir_Trunk_Top.png", "Common/BlockTextures/Wood_Softwood_Planks_02.png", "Common/BlockTextures/Wood_Softwood_Planks_03.png", "Common/BlockTextures/Wood_Softwood_Planks_Side.png", "Common/BlockTextures/Wood_Softwood_Planks_Top.png", "Common/BlockTextures/Wood_Trunk_Ash_Full.png", "Common/BlockTextures/Wood_Trunk_Ash_Side.png", "Common/BlockTextures/Wood_Trunk_Ash_Top.png", "Common/BlockTextures/Wood_Trunk_Aspen_Full.png", "Common/BlockTextures/Wood_Trunk_Aspen_Side.png", "Common/BlockTextures/Wood_Trunk_Aspen_Top.png", "Common/BlockTextures/Wood_Trunk_Azure_Full.png", "Common/BlockTextures/Wood_Trunk_Azure_Side.png", "Common/BlockTextures/Wood_Trunk_Azure_Top.png", "Common/BlockTextures/Wood_Trunk_Beech_Full.png", "Common/BlockTextures/Wood_Trunk_Beech_Side.png", "Common/BlockTextures/Wood_Trunk_Beech_Top.png", "Common/BlockTextures/Wood_Trunk_Birch_Full.png", "Common/BlockTextures/Wood_Trunk_Birch_Side.png", "Common/BlockTextures/Wood_Trunk_Birch_Top.png", "Common/BlockTextures/Wood_Trunk_Bottle_Full.png", "Common/BlockTextures/Wood_Trunk_Bottle_Side.png", "Common/BlockTextures/Wood_Trunk_Bottle_Top.png", "Common/BlockTextures/Wood_Trunk_Burnt.png", "Common/BlockTextures/Wood_Trunk_Burnt_Full.png", "Common/BlockTextures/Wood_Trunk_Burnt_Top.png", "Common/BlockTextures/Wood_Trunk_Camphor.png", "Common/BlockTextures/Wood_Trunk_Camphor_Full.png", "Common/BlockTextures/Wood_Trunk_Camphor_Top.png", "Common/BlockTextures/Wood_Trunk_Cedar.png", "Common/BlockTextures/Wood_Trunk_Cedar_Full.png", "Common/BlockTextures/Wood_Trunk_Cedar_Top.png", "Common/BlockTextures/Wood_Trunk_CrimsonMaple_Full.png", "Common/BlockTextures/Wood_Trunk_CrimsonMaple_Side.png", "Common/BlockTextures/Wood_Trunk_CrimsonMaple_Top.png", "Common/BlockTextures/Wood_Trunk_Crystal.png", "Common/BlockTextures/Wood_Trunk_Crystal_Full.png", "Common/BlockTextures/Wood_Trunk_Crystal_Top.png", "Common/BlockTextures/Wood_Trunk_Dry.png", "Common/BlockTextures/Wood_Trunk_Dry_Full.png", "Common/BlockTextures/Wood_Trunk_Dry_Top.png", "Common/BlockTextures/Wood_Trunk_Fig_Blue_Full.png", "Common/BlockTextures/Wood_Trunk_Fig_Blue_Side.png", "Common/BlockTextures/Wood_Trunk_Fig_Blue_Top.png", "Common/BlockTextures/Wood_Trunk_Fire.png", "Common/BlockTextures/Wood_Trunk_Fire_Full.png", "Common/BlockTextures/Wood_Trunk_Fire_Top.png", "Common/BlockTextures/Wood_Trunk_Gumboab_Full.png", "Common/BlockTextures/Wood_Trunk_Gumboab_Side.png", "Common/BlockTextures/Wood_Trunk_Gumboab_Top.png", "Common/BlockTextures/Wood_Trunk_Oak_Full.png", "Common/BlockTextures/Wood_Trunk_Oak_Side.png", "Common/BlockTextures/Wood_Trunk_Oak_Top.png", "Common/BlockTextures/Wood_Trunk_Palo.png", "Common/BlockTextures/Wood_Trunk_Palo_Full.png", "Common/BlockTextures/Wood_Trunk_Palo_Top.png", "Common/BlockTextures/Wood_Trunk_Petrified_Full.png", "Common/BlockTextures/Wood_Trunk_Petrified_Side.png", "Common/BlockTextures/Wood_Trunk_Petrified_Top.png", "Common/BlockTextures/Wood_Trunk_RedWood.png", "Common/BlockTextures/Wood_Trunk_RedWood_Full.png", "Common/BlockTextures/Wood_Trunk_RedWood_Top.png", "Common/BlockTextures/Wood_trunk_Sallow_Full.png", "Common/BlockTextures/Wood_trunk_Sallow_Side.png", "Common/BlockTextures/Wood_trunk_Sallow_Top.png", "Common/Blocks/Benches/Workbench.blockymodel", "Common/Blocks/Benches/Workbench_Texture.png", "Common/Blocks/Decorative_Sets/Village/Bed.blockymodel", "Common/Blocks/Decorative_Sets/Village/Bed_Texture.png", "Common/Blocks/Decorative_Sets/Village/Chair.blockymodel", "Common/Blocks/Decorative_Sets/Village/Chair_Texture.png", "Common/Blocks/Decorative_Sets/Village/Ladder.blockymodel", "Common/Blocks/Decorative_Sets/Village/Ladder_Texture.png", "Common/Blocks/Foliage/Flowers/Chrysanthemum.blockymodel", "Common/Blocks/Foliage/Flowers/Chrysanthemum_Texture.png", "Common/Blocks/Foliage/Flowers/Flower.blockymodel", "Common/Blocks/Foliage/Flowers/FlowerSmall.blockymodel", "Common/Blocks/Foliage/Flowers/FlowerSmall_Textures/Arid_Cyan.png", "Common/Blocks/Foliage/Flowers/FlowerSmall_Textures/Arid_Purple.png", "Common/Blocks/Foliage/Flowers/Flower_Textures/Blue.png", "Common/Blocks/Foliage/Flowers/Flower_Textures/Cyan.png", "Common/Blocks/Foliage/Flowers/Flower_Textures/Yellow.png", "Common/Blocks/Foliage/Flowers/Hydrangea.blockymodel", "Common/Blocks/Foliage/Flowers/Hydrangea_White.png", "Common/Blocks/Foliage/Flowers/Jungle_Orange.blockymodel", "Common/Blocks/Foliage/Flowers/Jungle_Orange_Pink.png", "Common/Blocks/Foliage/Flowers/RareFlower.blockymodel", "Common/Blocks/Foliage/Flowers/RareFlower_Textures/Orange.png", "Common/Blocks/Foliage/Flowers/Sunflower.blockymodel", "Common/Blocks/Foliage/Flowers/Sunflower_Texture.png", "Common/Blocks/Foliage/Grass/Bushy.blockymodel", "Common/Blocks/Foliage/Grass/Bushy_Grassplant_Lush_Tall_GS.png", "Common/Blocks/Foliage/Grass/Dense_Small_3Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/Jungle.png", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/Seaweeds_GS.png", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/default.png", "Common/Blocks/Foliage/Grass/Dense_Tall_3Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Tall_4Rows_Texture.png", "Common/Blocks/Foliage/Grass/Dense_Tall_Jungle.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Tall_Jungle_default.png", "Common/Blocks/Foliage/Grass/Dense_VeryTall_4Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_VeryTall_4Rows_Sharp.png", "Common/Blocks/Foliage/Grass/Savannah.blockymodel", "Common/Blocks/Foliage/Grass/Savannah_Texture.png", "Common/Blocks/Foliage/Grass/Tall.blockymodel", "Common/Blocks/Foliage/Grass/Tall_Textures/Dry.png", "Common/Blocks/Foliage/Grass/Tall_Textures/Gnarled_Tall_GS.png", "Common/Blocks/Foliage/Grass/Tall_Textures/Winter.png", "Common/Blocks/Foliage/Grass/VeryTall.blockymodel", "Common/Blocks/Foliage/Grass/VeryTall_Textures/Savannah.png", "Common/Blocks/Foliage/Grass/VeryTall_Textures/Seaweed_Tall_GS.png", "Common/Blocks/Foliage/Grass/VeryTall_Textures/Water_GS.png", "Common/Blocks/Foliage/Leaves/Ball.blockymodel", "Common/Blocks/Foliage/Leaves/Ball_Textures/Ash.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Aspen.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Azure.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Beech.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Birch.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/CrimsonMaple.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Fig_Blue.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Oak.png", "Common/Blocks/Foliage/Leaves/DownShape.blockymodel", "Common/Blocks/Foliage/Leaves/DownShape_Textures/Autumn.png", "Common/Blocks/Foliage/Leaves/DownShape_Textures/Bamboo.png", "Common/Blocks/Foliage/Leaves/DownShape_Textures/Dry.png", "Common/Blocks/Foliage/Leaves/Hanging.blockymodel", "Common/Blocks/Foliage/Leaves/Hanging_Textures/Camphor.png", "Common/Blocks/Foliage/Leaves/Hanging_Textures/Sallow.png", "Common/Blocks/Foliage/Leaves/PineShape.blockymodel", "Common/Blocks/Foliage/Leaves/PineShape_NSEW.blockymodel", "Common/Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine.png", "Common/Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine_Snowy.png", "Common/Blocks/Foliage/Leaves/PineShape_Textures/Petrified.png", "Common/Blocks/Foliage/Leaves/PineShape_Textures/RedPine.png", "Common/Blocks/Foliage/Leaves/PineShape_Tip.blockymodel", "Common/Blocks/Foliage/Leaves/UpShapeSoft.blockymodel", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Bottle.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Burnt.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar2.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Crystal.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Dead.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Fire.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Gramble.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Palo.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Redwood.png", "Common/Blocks/Foliage/Plants/Alien.blockymodel", "Common/Blocks/Foliage/Plants/Alien_Textures/Blue.png", "Common/Blocks/Foliage/Plants/Alien_Textures/Orange.png", "Common/Blocks/Foliage/Plants/Aloe.blockymodel", "Common/Blocks/Foliage/Plants/Aloe_Texture.png", "Common/Blocks/Foliage/Plants/Bramble_Ball.blockymodel", "Common/Blocks/Foliage/Plants/Bramble_Ball_Texture.png", "Common/Blocks/Foliage/Plants/Bush_Berry.blockymodel", "Common/Blocks/Foliage/Plants/Bush_Berry_Texture.png", "Common/Blocks/Foliage/Plants/Bush_Big.blockymodel", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Arid.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Brambles.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Brambles_Green.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Crystal_Red.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Dead.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Dead_Stem.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Green.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Green_Dark.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Jungle_Blue.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Jungle_Green.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Frozen.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Red.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Snow.png", "Common/Blocks/Foliage/Plants/Bush_Dead.blockymodel", "Common/Blocks/Foliage/Plants/Bush_Dead_Texture.png", "Common/Blocks/Foliage/Plants/Cactus1.blockymodel", "Common/Blocks/Foliage/Plants/Cactus1_Texture.png", "Common/Blocks/Foliage/Plants/Cactus2.blockymodel", "Common/Blocks/Foliage/Plants/Cactus3.blockymodel", "Common/Blocks/Foliage/Plants/CactusFlat1.blockymodel", "Common/Blocks/Foliage/Plants/CactusFlat1_Texture.png", "Common/Blocks/Foliage/Plants/Cactus_Ball01.blockymodel", "Common/Blocks/Foliage/Plants/Cactus_Ball01_Texture.png", "Common/Blocks/Foliage/Plants/Cross.blockymodel", "Common/Blocks/Foliage/Plants/Cross_10px.blockymodel", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Sharp_Short_GS.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small_Gnarled.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small_Snow.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grassplant_Dry_Short_GS.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grassplant_Winter_Short_GS.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Moss_GS.png", "Common/Blocks/Foliage/Plants/Cross_17px.blockymodel", "Common/Blocks/Foliage/Plants/Cross_17px_Textures/Grassplant_Lush_GS.png", "Common/Blocks/Foliage/Plants/Cross_17px_Textures/Jungle_GS.png", "Common/Blocks/Foliage/Plants/Cross_17px_Textures/Rocky_GS.png", "Common/Blocks/Foliage/Plants/Cross_25px.blockymodel", "Common/Blocks/Foliage/Plants/Cross_25px_Grass_Winter.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Red.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Violet.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Yellow.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Gnarled.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Grassplant_Dry_GS.png", "Common/Blocks/Foliage/Plants/Cross_Full.blockymodel", "Common/Blocks/Foliage/Plants/Cross_Full_Textures/Moss_GS.png", "Common/Blocks/Foliage/Plants/Cross_Textures/Cave_Short.png", "Common/Blocks/Foliage/Plants/Cross_Textures/Flower_White.png", "Common/Blocks/Foliage/Plants/Cross_Textures/Seaweed_Stackable.png", "Common/Blocks/Foliage/Plants/Dense_Tall.blockymodel", "Common/Blocks/Foliage/Plants/Dense_Tall_Textures/Lavender.png", "Common/Blocks/Foliage/Plants/Fern_Big.blockymodel", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/Arid_Palm.png", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/Flower_Fire.png", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/GS.png", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/Grass_Dry.png", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/Winter.png", "Common/Blocks/Foliage/Plants/Fern_Giant.blockymodel", "Common/Blocks/Foliage/Plants/Fern_Giant_Jungle.png", "Common/Blocks/Foliage/Plants/Fern_Giant_Trunk.blockymodel", "Common/Blocks/Foliage/Plants/Fern_Giant_Trunk_Texture.png", "Common/Blocks/Foliage/Plants/Fern_Small.blockymodel", "Common/Blocks/Foliage/Plants/Fern_Small_GS.png", "Common/Blocks/Foliage/Plants/Flax.blockymodel", "Common/Blocks/Foliage/Plants/Flax_Textures/Blue.png", "Common/Blocks/Foliage/Plants/HangingMoss.blockymodel", "Common/Blocks/Foliage/Plants/HangingMoss_Textures/Moss_GS_01.png", "Common/Blocks/Foliage/Plants/HangingMoss_Textures/Moss_GS_02.png", "Common/Blocks/Foliage/Plants/Ivy.blockymodel", "Common/Blocks/Foliage/Plants/Ivy_Textures/default.png", "Common/Blocks/Foliage/Plants/Leaves_Floor.blockymodel", "Common/Blocks/Foliage/Plants/Leaves_Floor_Textures/Jungle.png", "Common/Blocks/Foliage/Plants/Leaves_Floor_Textures/default.png", "Common/Blocks/Foliage/Plants/Liana.blockymodel", "Common/Blocks/Foliage/Plants/Liana_Textures/Green_01.png", "Common/Blocks/Foliage/Plants/Liana_Textures/Green_02.png", "Common/Blocks/Foliage/Plants/Liana_Textures/Green_03.png", "Common/Blocks/Foliage/Plants/Moss_Rug.blockymodel", "Common/Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS.png", "Common/Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_2.png", "Common/Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_3.png", "Common/Blocks/Foliage/Plants/Moss_Wall.blockymodel", "Common/Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS.png", "Common/Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS2.png", "Common/Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS3.png", "Common/Blocks/Foliage/Plants/Mushroom.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Flat.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Flat_Blue.png", "Common/Blocks/Foliage/Plants/Mushroom_Flat_White.png", "Common/Blocks/Foliage/Plants/Mushroom_Fox.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Fox_Brown.png", "Common/Blocks/Foliage/Plants/Mushroom_Fox_Green.png", "Common/Blocks/Foliage/Plants/Mushroom_Medium.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Medium_Textures/Brown.png", "Common/Blocks/Foliage/Plants/Mushroom_Medium_Textures/Green.png", "Common/Blocks/Foliage/Plants/Mushroom_Poison.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Poison_White.png", "Common/Blocks/Foliage/Plants/Mushroom_Tall.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Tall_White.png", "Common/Blocks/Foliage/Plants/Mushroom_Textures/Blue.png", "Common/Blocks/Foliage/Plants/Mushroom_Textures/Brown.png", "Common/Blocks/Foliage/Plants/Mushroom_Thin.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Thin_Textures/Blue.png", "Common/Blocks/Foliage/Plants/Mushroom_Thin_Textures/Green.png", "Common/Blocks/Foliage/Plants/Mushroom_Thin_Textures/Purple.png", "Common/Blocks/Foliage/Plants/Mushroom_Thin_Textures/Yellow.png", "Common/Blocks/Foliage/Plants/Nettle.blockymodel", "Common/Blocks/Foliage/Plants/Nettle_Textures/Blue.png", "Common/Blocks/Foliage/Plants/Nettle_Textures/Poisoned.png", "Common/Blocks/Foliage/Plants/Nettle_Textures/Red.png", "Common/Blocks/Foliage/Plants/Nettle_Textures/White.png", "Common/Blocks/Foliage/Plants/Nettle_Textures/default.png", "Common/Blocks/Foliage/Plants/Palm_Giant.blockymodel", "Common/Blocks/Foliage/Plants/Palm_Giant_Dark.png", "Common/Blocks/Foliage/Plants/Palm_Giant_default.png", "Common/Blocks/Foliage/Plants/Parched_Thorn.blockymodel", "Common/Blocks/Foliage/Plants/Parched_Thorn_Texture.png", "Common/Blocks/Foliage/Plants/ReedWinter.blockymodel", "Common/Blocks/Foliage/Plants/ReedWinter_Texture.png", "Common/Blocks/Foliage/Plants/Reeds.blockymodel", "Common/Blocks/Foliage/Plants/Reeds_Textures/Reeds_Marsh.png", "Common/Blocks/Foliage/Plants/Reeds_Textures/Reeds_Poison.png", "Common/Blocks/Foliage/Plants/Rocky_Flower.blockymodel", "Common/Blocks/Foliage/Plants/Rocky_Flower_Texture.png", "Common/Blocks/Foliage/Plants/Shrub.blockymodel", "Common/Blocks/Foliage/Plants/Shrub_Winter.png", "Common/Blocks/Foliage/Plants/Sorrel_Rug.blockymodel", "Common/Blocks/Foliage/Plants/Sorrel_Rug_Texture.png", "Common/Blocks/Foliage/Plants/Succulent.blockymodel", "Common/Blocks/Foliage/Plants/Succulent_Texture.png", "Common/Blocks/Foliage/Plants/Vine.blockymodel", "Common/Blocks/Foliage/Plants/Vine_Dry.png", "Common/Blocks/Foliage/Tree/Roots.blockymodel", "Common/Blocks/Foliage/Tree/Roots_Textures/Ash.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Azure.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Burnt.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Cedar.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Crystal.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Dry.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Gumboab.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Hanging_Lianas.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Oak.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Petrified.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Spruce.png", "Common/Blocks/Foliage/Water/Coral_Bush.blockymodel", "Common/Blocks/Foliage/Water/Coral_Bush_Small.blockymodel", "Common/Blocks/Foliage/Water/Coral_Bush_Small_Purple.png", "Common/Blocks/Foliage/Water/Coral_Bush_Textures/Cyan.png", "Common/Blocks/Foliage/Water/Coral_Bush_Textures/Pink.png", "Common/Blocks/Foliage/Water/Coral_Bush_Textures/Yellow.png", "Common/Blocks/Foliage/Water/Waterlily.blockymodel", "Common/Blocks/Foliage/Water/Waterlily_Textures/01.png", "Common/Blocks/Foliage/Water/Waterlily_Textures/02.png", "Common/Blocks/Foliage/Water/Waterlily_Textures/03.png", "Common/Blocks/Structures/Tubes/Corner.blockymodel", "Common/Blocks/Structures/Tubes/Corner_Textures/Ash.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Aspen.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Azure.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Beech.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Birch.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Bottle.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Burnt.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Camphor.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Cedar.png", "Common/Blocks/Structures/Tubes/Corner_Textures/CrimsonMaple.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Crystal.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Dry.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Fig_Blue.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Fire.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Gumboab.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Oak.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Palm.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Palo.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Petrified.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Redwood.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Sallow.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Spruce.png", "Common/Blocks/Structures/Tubes/Long.blockymodel", "Common/Blocks/Structures/Tubes/Long_Simple_UV.blockymodel", "Common/Blocks/Structures/Tubes/Long_Simple_UV_Textures/Bamboo.png", "Common/Blocks/Structures/Tubes/Short.blockymodel", "Common/Items/Projectiles/Projectile.blockymodel", "Common/Items/Projectiles/Tornado_Texture.png", "Common/Resources/Crystals/Crystal_Big.blockymodel", "Common/Resources/Crystals/Crystal_Big_Textures/Green.png", "Common/Resources/Crystals/Crystal_Big_Textures/Pink.png", "Common/Resources/Crystals/Crystal_Big_Textures/Red.png", "Common/Resources/Crystals/Crystal_Big_Textures/Yellow.png", "Common/Resources/Crystals/Crystal_Medium.blockymodel", "Common/Resources/Crystals/Crystal_Small.blockymodel", "Common/Resources/Ingredients/Azure_Fruit.blockymodel", "Common/Resources/Ingredients/Azure_Fruit_Texture.png", "Common/Resources/Ingredients/Coconut.blockymodel", "Common/Resources/Ingredients/Coconut_Texture.png", "Common/Resources/Ingredients/Pink_Fruit.blockymodel", "Common/Resources/Ingredients/Pink_Fruit_Texture.png", "Server/HytaleGenerator/Biomes/Ocean1/Oceans.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_3/Ash_Dead_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Moss/Stage_3/Ash_Moss_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Autumn/Stage_2/Autumn_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Azure/Stage_2/Azure_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Azure/Stage_3/Azure_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_3/Bamboo_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_1/Beech_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech_Fallen/Stage_1/Beech_Fallen_Stage1_003.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_0/Birch_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_4/Birch_Stage4_001.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_1/Boab_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Burnt/Stage_1/Burnt_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Cedar/Stage_1/Cedar_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Cedar/Stage_2/Cedar_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Cedar/Stage_3/Cedar_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Cedar_Burnt/Stage_2/Cedar_Burnt_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_2/Dry_Dead_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_2/Fig_Blue_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_3/Fig_Blue_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fire_Burning/Stage_1/Fire_Burning_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fire_Burning/Stage_3/Fire_Burning_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_1/Gum_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_4/Gum_Stage4_001.prefab.json", "Server/Prefabs/Orbis/Trees/Maple/Stage_2/Maple_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palm/Stage_2/Palm_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palm_Green/Stage_2/Palm_Green_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palm_Green/Stage_3/Palm_Green_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palo/Stage_3/Palo_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified/Stage_1/Petrified_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified/Stage_2/Petrified_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_2/Petrified_Dead_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_5/Petrified_Dead_Stage5_001.prefab.json", "Server/Prefabs/Orbis/Trees/Redwood/Stage_0/Redwood_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Redwood/Stage_1/Redwood_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Redwood/Stage_2/Redwood_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Redwood/Stage_3/Redwood_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Sallow/Stage_1/Sallow_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_001.prefab.json", "Server/Prefabs/Plants/Cacti/Flat/Stage_1/Cacti_Flat_Stage_1_001.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_001.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_001.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_001.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_001.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_3/Mushroom_Large_Green_Stage_3_004.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_001.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_001.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_3/Mushroom_Large_Yellow_Stage_3_004.prefab.json", "Server/Prefabs/Trees/Ash_swamp/Stage_2/Ash_swamp_Stage2_001.prefab.json", "Server/Prefabs/Trees/Ash_swamp/Stage_3/Ash_swamp_Stage3_001.prefab.json", "Server/Prefabs/Trees/Ash_swamp/Stage_4/Ash_swamp_Stage4_001.prefab.json", "Server/Prefabs/Trees/Ash_twisted_Giant/Ash_twisted_Giant_001.prefab.json", "Server/Prefabs/Trees/Ash_twisted_Large/Ash_twisted_Large_001.prefab.json", "Server/Prefabs/Trees/Burnt_Roots/Normal/Stage_3/Burnt_Roots_Normal_001.prefab.json", "Server/Prefabs/Trees/Burnt_dead/Stage_1/Burnt_dead_Stage1_001.prefab.json", "Server/Prefabs/Trees/Cedar_Logs/Small/Cedar_Logs_001.prefab.json", "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_001.prefab.json", "Server/Prefabs/Trees/Fir_red/Stage_0/Fir_red_Stage0_001.prefab.json", "Server/Prefabs/Trees/Fir_red/Stage_1/Fir_red_Stage1_001.prefab.json", "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_001.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_001.prefab.json", "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_001.prefab.json", "Server/Prefabs/Trees/Logs/Birch/Moss/Logs_Birch_Moss_001.prefab.json", "Server/Prefabs/Trees/Oak_Moss/Stage_4/Oak_Moss_Stage4_001.prefab.json", "Server/Weathers/Zone1/Zone1_Sunny.json", "Server/Weathers/Zone1/Zone1_Sunny_Fireflies.json", "Server/Weathers/Zone1/Zone1_Swamp.json", "Server/Weathers/Zone2/Zone2_Sunny.json", "Server/Weathers/Zone3/Zone3_Cloudy_Boreal.json", "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json", "Server/Weathers/Zone3/Zone3_Rain.json", "Server/Weathers/Zone4/Zone4_Lava_Fields.json", "Server/Weathers/Zone4/Zone4_Light.json", "Server/Weathers/Zone4/Zone4_Storm.json", "Server/Weathers/Zone4/Zone4_Swamp_Storm.json"];
