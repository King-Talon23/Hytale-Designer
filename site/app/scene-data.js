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
  "tile": "Server/World/Default/Zones/Zone1_Tier1/Tile.Forest_Birch.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Mixed_Birch.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
      24.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_005.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_010.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_005.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_010.prefab.json",
      3.3333333333333335
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Mixed_Beech.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_005.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_010.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_007.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_012.prefab.json",
      3.3333333333333335
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Mixed_Oak.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_006.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_011.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Mixed_Misc.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Rocks/Birch/Rocks_Birch_Birch_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Trees/Rocks/Birch/Rocks_Birch_Birch_003.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Trees/Rocks/Birch/Rocks_Birch_Birch_006.prefab.json",
      0.09999999999999999
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Birch_Young.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_0/Birch_Stage0_001.prefab.json",
      90.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
      10.0
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Green",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Crop_Mushroom_Cap_White",
   "Plant_Flower_Common_Cyan2",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_Yellow",
   "Plant_Flower_Flax_Blue",
   "Plant_Flower_Tall_Purple",
   "Plant_Grass_Lush",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Lush_Tall",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass",
   "Soil_Grass_Sunny",
   "Soil_Gravel",
   "Soil_Leaves",
   "Soil_Pathway",
   "Soil_Pebbles",
   "Wood_Sticks"
  ],
  "chip": [
   "#077ad9",
   "#6b9014"
  ],
  "site": {
   "ox": 995,
   "oz": -513,
   "S0": 121,
   "rim": "Soil_Grass"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier1/Tile.Forest_Flower.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Kweebec_Mixed_Birch.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_4/Birch_Stage4_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_4/Birch_Stage4_007.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_4/Birch_Stage4_012.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Kweebec_Mixed_Beech.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_007.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_012.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Kweebec_Mixed_Oak.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Oak/Stage_00/Oak_Stage00_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Trees/Oak/Stage_00/Oak_Stage00_006.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Trees/Oak/Stage_00/Oak_Stage00_011.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_001.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_006.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_011.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_006.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_011.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_001.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_006.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_011.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
      14.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_003.prefab.json",
      14.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_006.prefab.json",
      14.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
      6.833333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_003.prefab.json",
      6.833333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_006.prefab.json",
      6.833333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_003.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_006.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_003.prefab.json",
      0.3333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush",
   "Plant_Crop_Health1",
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Flower_Common_Cyan2",
   "Plant_Flower_Common_Red2",
   "Plant_Flower_Common_Yellow",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Lush",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Lush_Tall",
   "Plant_Grass_Sharp",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass",
   "Soil_Grass_Deep",
   "Soil_Gravel_Sand_White",
   "Soil_Leaves",
   "Soil_Pathway",
   "Wood_Sticks"
  ],
  "chip": [
   "#077ad9",
   "#428429"
  ],
  "site": {
   "ox": 444,
   "oz": -557,
   "S0": 117,
   "rim": "Soil_Grass"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier1/Tile.Plains_Birch.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Birch.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
      25.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
      49.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json",
      4.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_005.prefab.json",
      4.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_010.prefab.json",
      4.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Birch_Ponds.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_1/Beech_Stage1_001.prefab.json",
      70.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_005.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_010.prefab.json",
      10.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Birch_Young.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_007.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_012.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_003.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_006.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_001.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_005.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_010.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_005.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_010.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
      35.0
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Green",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Crop_Mushroom_Cap_White",
   "Plant_Flower_Common_Cyan2",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_Yellow",
   "Plant_Flower_Tall_Purple",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Short",
   "Plant_Grass_Sharp_Tall",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass_Deep",
   "Soil_Grass_Full",
   "Soil_Gravel",
   "Soil_Leaves",
   "Soil_Pathway",
   "Soil_Pebbles",
   "Wood_Sticks"
  ],
  "chip": [
   "#077ad9",
   "#639726"
  ],
  "site": {
   "ox": 336,
   "oz": -940,
   "S0": 118,
   "rim": "Soil_Grass_Full"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier1/Tile.Plains_Smooth.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Smooth_Ash.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      1.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Smooth_Oak.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
      11.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_003.prefab.json",
      11.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_006.prefab.json",
      11.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_003.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_006.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_001.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_002.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_003.prefab.json",
      0.6666666666666666
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Smooth_Grove.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_006.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_006.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_006.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      0.03333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush",
   "Plant_Bush_Green",
   "Plant_Crop_Health1",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Flower_Common_Red2",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Common_Yellow2",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Short",
   "Plant_Grass_Sharp_Tall",
   "Plant_Grass_Sharp_Wild",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass_Deep",
   "Soil_Grass_Full",
   "Soil_Gravel",
   "Soil_Leaves",
   "Soil_Pathway",
   "Wood_Sticks"
  ],
  "chip": [
   "#077ad9",
   "#4e8a28"
  ],
  "site": {
   "ox": 982,
   "oz": -408,
   "S0": 122,
   "rim": "Soil_Grass_Full"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier2/Tile.Forest_Aspen.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Forest_Aspen_Birch.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_010.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Forest_Aspen_Beech.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_001.prefab.json",
      4.166666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_005.prefab.json",
      4.166666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_010.prefab.json",
      4.166666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_007.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_012.prefab.json",
      5.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Forest_Aspen.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_001.prefab.json",
      10.833333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_003.prefab.json",
      10.833333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_004.prefab.json",
      10.833333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_001.prefab.json",
      4.333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_005.prefab.json",
      4.333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_010.prefab.json",
      4.333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_3/Aspen_Stage3_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_3/Aspen_Stage3_007.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_3/Aspen_Stage3_012.prefab.json",
      3.3333333333333335
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Plains_Birch_Young.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_0/Aspen_Stage0_001.prefab.json",
      90.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_003.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_004.prefab.json",
      3.3333333333333335
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Green",
   "Plant_Crop_Mushroom_Cap_White",
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Fern_Winter",
   "Plant_Flower_Bushy_Green",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Common_Yellow",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Lush",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Lush_Tall",
   "Plant_Moss_Green",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass",
   "Soil_Gravel",
   "Soil_Gravel_Sand_White",
   "Soil_Leaves",
   "Soil_Pathway"
  ],
  "chip": [
   "#077ad9",
   "#77841e"
  ],
  "site": {
   "ox": 352,
   "oz": -1093,
   "S0": 117,
   "rim": "Soil_Grass"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier2/Tile.Forest_Gully.json",
  "forest": [
   {
    "pattern": {
     "GridGenerator": {
      "Seed": "GrasslandsGullyTrees",
      "Density": [
       0.35,
       0.5
      ],
      "Scale": 0.15,
      "Jitter": 1
     },
     "NoiseMask": {
      "Seed": "GrasslandsGullyTrees",
      "NoiseType": "SIMPLEX",
      "Formula": "NORMAL",
      "Octaves": 3,
      "Persistence": 0.6,
      "Scale": 0.07,
      "Threshold": [
       0,
       0.6
      ]
     },
     "HeightThreshold": {
      "Positions": [
       100,
       130
      ],
      "Values": [
       0,
       1
      ]
     },
     "Mask": {
      "File": "Zones.Masks.Shared.Trees"
     },
     "Parent": [
      "Soil_Grass_Full",
      "Soil_Grass",
      "Soil_Grass_Deep",
      "Soil_Leaves"
     ]
    },
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_001.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_003.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_004.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_003.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_004.prefab.json",
      5.0
     ]
    ]
   },
   {
    "pattern": {
     "GridGenerator": {
      "Seed": "GrasslandsGullyTrees",
      "Density": [
       0,
       0.35
      ],
      "Scale": 0.15,
      "Jitter": 1
     },
     "NoiseMask": {
      "Seed": "GrasslandsGullyTrees",
      "NoiseType": "SIMPLEX",
      "Formula": "NORMAL",
      "Octaves": 3,
      "Persistence": 0.6,
      "Scale": 0.07,
      "Threshold": [
       0,
       0.6
      ]
     },
     "HeightThreshold": {
      "Positions": [
       100,
       130
      ],
      "Values": [
       0,
       1
      ]
     },
     "Mask": {
      "File": "Zones.Masks.Shared.Trees"
     },
     "Parent": [
      "Soil_Grass_Full",
      "Soil_Grass",
      "Soil_Grass_Deep",
      "Soil_Leaves"
     ]
    },
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_006.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_011.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_003.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_006.prefab.json",
      6.666666666666667
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Green",
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Fern_Winter",
   "Plant_Flower_Common_Red2",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Common_Yellow",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Lush",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Lush_Tall",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Short",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass",
   "Soil_Grass_Deep",
   "Soil_Gravel",
   "Soil_Leaves",
   "Soil_Mud",
   "Soil_Pathway"
  ],
  "chip": [
   "#077ad9",
   "#3b7725"
  ],
  "site": {
   "ox": -447,
   "oz": 278,
   "S0": 120,
   "rim": "Soil_Grass"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier2/Tile.Plains_Gorge.json",
  "forest": [
   {
    "pattern": {
     "GridGenerator": {
      "Seed": "GrasslandsGullyTrees",
      "Density": [
       0,
       0.25
      ],
      "Scale": 0.1,
      "Jitter": 1
     },
     "NoiseMask": {
      "Type": "MAX",
      "Noise": [
       {
        "Type": "MIN",
        "Noise": [
         {
          "File": "Zones.Noise.Shared.Grids.Monuments_Encounter"
         }
        ],
        "Density": [
         0,
         1
        ]
       },
       {
        "Type": "DISTORTED",
        "Noise": {
         "Seed": "GrasslandsPlateau",
         "NoiseType": "CELL",
         "CellType": "HEX",
         "CellMode": "DISTANCE",
         "Jitter": 0.5,
         "Scale": 0.0085,
         "DistanceRange": [
          1.0,
          3.0
         ]
        },
        "Randomizer": {
         "Generators": [
          {
           "Seed": "GrasslandsDistory",
           "NoiseType": "SIMPLEX",
           "Formula": "NORMAL",
           "Octaves": 4,
           "Persistence": 1,
           "Scale": 0.005,
           "Amplitude": 10
          }
         ]
        },
        "Normalize": [
         0.45,
         0.5
        ]
       }
      ],
      "Threshold": [
       0.4,
       0.9
      ]
     },
     "HeightThreshold": {
      "Positions": [
       125,
       150
      ],
      "Values": [
       0,
       1
      ]
     },
     "Mask": {
      "File": "Zones.Masks.Shared.Trees"
     },
     "Parent": [
      "Soil_Grass_Full",
      "Soil_Grass",
      "Soil_Grass_Deep",
      "Soil_Leaves"
     ]
    },
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json",
      12.166666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_003.prefab.json",
      12.166666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_004.prefab.json",
      12.166666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      1.0
     ]
    ]
   },
   {
    "pattern": {
     "GridGenerator": {
      "Seed": "GrasslandsGullyTrees",
      "Density": [
       0.25,
       0.5
      ],
      "Scale": 0.1,
      "Jitter": 1
     },
     "NoiseMask": {
      "Type": "MAX",
      "Noise": [
       {
        "Type": "MIN",
        "Noise": [
         {
          "File": "Zones.Noise.Shared.Grids.Monuments_Encounter"
         }
        ],
        "Density": [
         0,
         1
        ]
       },
       {
        "Type": "DISTORTED",
        "Noise": {
         "Seed": "GrasslandsPlateau",
         "NoiseType": "CELL",
         "CellType": "HEX",
         "CellMode": "DISTANCE",
         "Jitter": 0.5,
         "Scale": 0.0085,
         "DistanceRange": [
          1.0,
          3.0
         ]
        },
        "Randomizer": {
         "Generators": [
          {
           "Seed": "GrasslandsDistory",
           "NoiseType": "SIMPLEX",
           "Formula": "NORMAL",
           "Octaves": 4,
           "Persistence": 1,
           "Scale": 0.005,
           "Amplitude": 10
          }
         ]
        },
        "Normalize": [
         0.45,
         0.5
        ]
       }
      ],
      "Threshold": [
       0.4,
       0.9
      ]
     },
     "HeightThreshold": {
      "Positions": [
       125,
       150
      ],
      "Values": [
       0,
       1
      ]
     },
     "Mask": {
      "File": "Zones.Masks.Shared.Trees"
     },
     "Parent": [
      "Soil_Grass_Full",
      "Soil_Grass",
      "Soil_Grass_Deep",
      "Soil_Leaves"
     ]
    },
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_003.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_006.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_003.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_006.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_003.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_006.prefab.json",
      0.6666666666666666
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Plains_Gorge_Chalk_Ash.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      11.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      11.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      11.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      6.166666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      6.166666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      6.166666666666667
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Plains_Gorge_Chalk_Oak.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
      9.166666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_003.prefab.json",
      9.166666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_006.prefab.json",
      9.166666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_001.prefab.json",
      6.166666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_002.prefab.json",
      6.166666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_003.prefab.json",
      6.166666666666667
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Green",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Flower_Common_Red2",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Flax_Blue",
   "Plant_Flower_Tall_Yellow",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Short",
   "Plant_Grass_Sharp_Tall",
   "Plant_Grass_Sharp_Wild",
   "Rock_Chalk",
   "Rock_Marble",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass",
   "Soil_Grass_Full",
   "Soil_Gravel",
   "Soil_Pebbles"
  ],
  "chip": [
   "#077ad9",
   "#659826"
  ],
  "site": {
   "ox": 369,
   "oz": 345,
   "S0": 120,
   "rim": "Soil_Grass_Full"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier2/Tile.Plains_Tallgrass.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Plains_Tallgrass_Ash.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_0/Birch_Stage0_001.prefab.json",
      20.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
      2.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_005.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_010.prefab.json",
      6.666666666666667
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Plains_Tallgrass_Oak.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_001.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_006.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_011.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_001.prefab.json",
      6.3999999999999995
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_006.prefab.json",
      6.3999999999999995
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_011.prefab.json",
      6.3999999999999995
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_001.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_006.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_011.prefab.json",
      0.6666666666666666
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Green",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Flower_Common_Red2",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Common_Yellow",
   "Plant_Flower_Common_Yellow2",
   "Plant_Flower_Flax_Blue",
   "Plant_Flower_Tall_Yellow",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Tall",
   "Plant_Grass_Sharp_Wild",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass_Deep",
   "Soil_Grass_Full",
   "Soil_Grass_Sunny",
   "Soil_Leaves",
   "Soil_Pathway",
   "Soil_Pebbles"
  ],
  "chip": [
   "#077ad9",
   "#639726"
  ],
  "site": {
   "ox": -438,
   "oz": -820,
   "S0": 121,
   "rim": "Soil_Grass_Full"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier3/Tile.Forest_Autumn.json",
  "forest": [
   {
    "pattern": {
     "GridGenerator": {
      "Seed": "Grasslands-Autumn-Trees",
      "CellType": "HEX",
      "Density": [
       0.2,
       0.4
      ],
      "Scale": 0.055,
      "Jitter": 0.5
     },
     "NoiseMask": {
      "Type": "MIN",
      "Noise": [
       {
        "File": "Zones.Noise.Shared.Grids.Monuments_Encounter"
       }
      ],
      "Density": [
       0,
       1
      ],
      "Normalize": [
       0.5999,
       0.6
      ],
      "Threshold": [
       0,
       0.1
      ]
     },
     "HeightThreshold": {
      "Positions": [
       114,
       115
      ],
      "Values": [
       0,
       1
      ]
     },
     "Mask": {
      "File": "Zones.Masks.Shared.Trees"
     },
     "Parent": [
      "Soil_Grass",
      "Soil_Grass_Full",
      "Soil_Grass_Deep",
      "Soil_Leaves",
      "Soil_Pathway",
      "Soil_Mud",
      "Soil_Mud_Dry"
     ]
    },
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Autumn/Stage_3/Autumn_Stage3_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Autumn/Stage_3/Autumn_Stage3_003.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Autumn/Stage_3/Autumn_Stage3_004.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Autumn/Stage_2/Autumn_Stage2_001.prefab.json",
      35.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Autumn/Stage_1/Autumn_Stage1_001.prefab.json",
      5.0
     ]
    ]
   },
   {
    "pattern": {
     "GridGenerator": {
      "Seed": "Grasslands-Autumn-Trees",
      "CellType": "HEX",
      "Density": [
       0.4,
       0.8
      ],
      "Scale": 0.055,
      "Jitter": 0.5
     },
     "NoiseMask": {
      "Type": "MIN",
      "Noise": [
       {
        "File": "Zones.Noise.Shared.Grids.Monuments_Encounter"
       }
      ],
      "Normalize": [
       0.5999,
       0.6
      ],
      "Threshold": [
       0,
       0.1
      ]
     },
     "HeightThreshold": {
      "Positions": [
       114,
       115
      ],
      "Values": [
       0,
       1
      ]
     },
     "Mask": {
      "File": "Zones.Masks.Shared.Trees"
     },
     "Parent": [
      "Soil_Grass",
      "Soil_Grass_Full",
      "Soil_Grass_Deep",
      "Soil_Leaves",
      "Soil_Pathway",
      "Soil_Mud",
      "Soil_Mud_Dry"
     ]
    },
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Maple/Stage_3/Maple_Stage3_001.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Maple/Stage_2/Maple_Stage2_001.prefab.json",
      35.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Maple/Stage_1/Maple_Stage1_001.prefab.json",
      5.0
     ]
    ]
   },
   {
    "pattern": {
     "GridGenerator": {
      "Seed": "Grasslands-Autumn-Trees",
      "CellType": "HEX",
      "Density": [
       0.4,
       1
      ],
      "Scale": 0.1,
      "Jitter": 0.5
     },
     "NoiseMask": {
      "Type": "MAX",
      "Noise": [
       {
        "Type": "MIN",
        "Noise": [
         {
          "File": "Zones.Noise.Shared.Grids.Monuments_Encounter"
         }
        ],
        "Density": [
         0,
         1
        ],
        "Normalize": [
         0.5999,
         0.6
        ]
       },
       {
        "Seed": "Grasslands-Autumn-Trees",
        "NoiseType": "CELL",
        "CellType": "HEX",
        "CellMode": "DISTANCE",
        "Formula": "INVERTED",
        "Scale": 0.055,
        "Jitter": 0.5,
        "Normalize": [
         0.5,
         0.51
        ]
       }
      ],
      "Threshold": [
       0,
       0.1
      ]
     },
     "HeightThreshold": {
      "Positions": [
       114,
       115
      ],
      "Values": [
       0,
       1
      ]
     },
     "Mask": {
      "File": "Zones.Masks.Shared.Trees"
     },
     "Parent": [
      "Soil_Grass",
      "Soil_Grass_Full",
      "Soil_Grass_Deep",
      "Soil_Leaves",
      "Soil_Pathway",
      "Soil_Mud",
      "Soil_Mud_Dry"
     ]
    },
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_3/Aspen_Stage3_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_3/Aspen_Stage3_007.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_3/Aspen_Stage3_012.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_001.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_005.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_010.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_001.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_003.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_004.prefab.json",
      1.6666666666666667
     ]
    ]
   },
   {
    "pattern": {
     "GridGenerator": {
      "Seed": "Grasslands-Autumn-Trees",
      "CellType": "HEX",
      "Density": [
       0.2,
       0.3
      ],
      "Scale": 0.1,
      "Jitter": 0.5
     },
     "NoiseMask": {
      "Type": "MAX",
      "Noise": [
       {
        "Type": "MIN",
        "Noise": [
         {
          "File": "Zones.Noise.Shared.Grids.Monuments_Encounter"
         }
        ],
        "Density": [
         0,
         1
        ],
        "Normalize": [
         0.5999,
         0.6
        ]
       },
       {
        "Seed": "Grasslands-Autumn-Trees",
        "NoiseType": "CELL",
        "CellType": "HEX",
        "CellMode": "DISTANCE",
        "Formula": "INVERTED",
        "Scale": 0.055,
        "Jitter": 0.5,
        "Normalize": [
         0.5,
         0.51
        ]
       }
      ],
      "Threshold": [
       0,
       0.1
      ]
     },
     "HeightThreshold": {
      "Positions": [
       114,
       115
      ],
      "Values": [
       0,
       1
      ]
     },
     "Mask": {
      "File": "Zones.Masks.Shared.Trees"
     },
     "Parent": [
      "Soil_Grass",
      "Soil_Grass_Full",
      "Soil_Grass_Deep",
      "Soil_Leaves",
      "Soil_Pathway",
      "Soil_Mud",
      "Soil_Mud_Dry"
     ]
    },
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_005.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_010.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_005.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_010.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
      5.0
     ]
    ]
   },
   {
    "pattern": {
     "GridGenerator": {
      "Seed": "Grasslands-Autumn-Trees",
      "CellType": "HEX",
      "Density": [
       0,
       0.05
      ],
      "Scale": 0.1,
      "Jitter": 0.5
     },
     "NoiseMask": {
      "Type": "MAX",
      "Noise": [
       {
        "Type": "MIN",
        "Noise": [
         {
          "File": "Zones.Noise.Shared.Grids.Monuments_Encounter"
         }
        ],
        "Density": [
         0,
         1
        ],
        "Normalize": [
         0.5999,
         0.6
        ]
       },
       {
        "Seed": "Grasslands-Autumn-Trees",
        "NoiseType": "CELL",
        "CellType": "HEX",
        "CellMode": "DISTANCE",
        "Formula": "INVERTED",
        "Scale": 0.055,
        "Jitter": 0.5,
        "Normalize": [
         0.5,
         0.51
        ]
       }
      ],
      "Threshold": [
       0,
       0.1
      ]
     },
     "HeightThreshold": {
      "Positions": [
       114,
       115
      ],
      "Values": [
       0,
       1
      ]
     },
     "Mask": {
      "File": "Zones.Masks.Shared.Trees"
     },
     "Parent": [
      "Soil_Grass",
      "Soil_Grass_Full",
      "Soil_Grass_Deep",
      "Soil_Leaves",
      "Soil_Pathway",
      "Soil_Mud",
      "Soil_Mud_Dry"
     ]
    },
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      11.666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_003.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_004.prefab.json",
      1.6666666666666667
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Dead_Tall",
   "Plant_Bush_Dead_Twisted",
   "Plant_Bush_Lush",
   "Plant_Crop_Health2",
   "Plant_Crop_Mushroom_Cap_Red",
   "Plant_Crop_Mushroom_Glowing_Orange",
   "Plant_Fern_Forest",
   "Plant_Fern_Winter",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Flax_Blue",
   "Plant_Flower_Orchid_Poisoned",
   "Plant_Grass_Lush",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Lush_Tall",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Short",
   "Plant_Grass_Sharp_Tall",
   "Plant_Leaves_Autumn_Floor",
   "Plant_Reeds_Marsh",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass",
   "Soil_Leaves",
   "Soil_Mud_Dry"
  ],
  "chip": [
   "#077ad9",
   "#a76328"
  ],
  "site": {
   "ox": 972,
   "oz": 628,
   "S0": 119,
   "rim": "Soil_Mud_Dry"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier3/Tile.Forest_Azure.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Azure.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Azure/Stage_3/Azure_Stage3_001.prefab.json",
      15.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Azure/Stage_2/Azure_Stage2_001.prefab.json",
      35.0
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Crop_Mana3",
   "Plant_Crop_Mushroom_Common_Blue",
   "Plant_Crop_Mushroom_Glowing_Blue",
   "Plant_Crop_Mushroom_Glowing_Violet",
   "Plant_Flower_Bushy_Blue",
   "Plant_Flower_Common_Red2",
   "Plant_Flower_Common_Yellow",
   "Plant_Grass_Lush",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Lush_Tall",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Tall",
   "Plant_Moss_Rug_Blue",
   "Plant_Seaweed_Grass_Tall",
   "Rock_Crystal_Cyan_Medium",
   "Rock_Crystal_Cyan_Small",
   "Rock_Stone",
   "Soil_Dirt",
   "Soil_Grass",
   "Soil_Grass_Full",
   "Soil_Gravel",
   "Soil_Leaves"
  ],
  "chip": [
   "#077ad9",
   "#2c7a82"
  ],
  "site": {
   "ox": -537,
   "oz": -389,
   "S0": 121,
   "rim": "Soil_Grass"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier3/Tile.Forest_Moss.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Moss_Oak_Young.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_006.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_011.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Moss_Oak_Young.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_004.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Moss_Oak.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_006.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_011.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_003.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_006.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Trees/Oak_Moss/Stage_4/Oak_Moss_Stage4_001.prefab.json",
      15.0
     ],
     [
      "Server/Prefabs/Trees/Oak_Moss/Stage_4/Oak_Moss_Stage4_003.prefab.json",
      15.0
     ],
     [
      "Server/Prefabs/Trees/Oak_Moss/Stage_4/Oak_Moss_Stage4_005.prefab.json",
      15.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Moss_Ash.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash_Moss/Stage_3/Ash_Moss_Stage3_001.prefab.json",
      5.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Moss_Oak_Small.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
      23.333333333333332
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_003.prefab.json",
      23.333333333333332
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_006.prefab.json",
      23.333333333333332
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Fern_Winter",
   "Plant_Flower_Bushy_Green",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Flax_Blue",
   "Plant_Flower_Tall_Purple",
   "Plant_Grass_Lush",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Lush_Tall",
   "Plant_Moss_Block_Green",
   "Plant_Moss_Block_Yellow",
   "Plant_Moss_Green",
   "Plant_Moss_Rug_Yellow",
   "Plant_Moss_Short_Green",
   "Plant_Moss_Short_Yellow",
   "Plant_Moss_Yellow",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass",
   "Soil_Gravel",
   "Soil_Mud_Dry"
  ],
  "chip": [
   "#6ecbdf",
   "#5f6e0c"
  ],
  "site": {
   "ox": 349,
   "oz": -29,
   "S0": 116,
   "rim": "Soil_Grass"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier3/Tile.Forest_Swamp.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Swamp_Ash_Young.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_004.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Swamp_Oak.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_006.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Swamp_Ash.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Ash_swamp/Stage_4/Ash_swamp_Stage4_001.prefab.json",
      1.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Swamp_Ash_Small.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Ash_swamp/Stage_2/Ash_swamp_Stage2_001.prefab.json",
      30.0
     ],
     [
      "Server/Prefabs/Trees/Ash_swamp/Stage_3/Ash_swamp_Stage3_001.prefab.json",
      25.0
     ],
     [
      "Server/Prefabs/Trees/Ash_swamp_dead/Stage_3/Ash_swamp_dead_Stage3_001.prefab.json",
      15.0
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Crop_Mushroom_Cap_Red",
   "Plant_Crop_Mushroom_Flatcap_Green",
   "Plant_Fern_Winter",
   "Plant_Flower_Common_Red2",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Lush",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Lush_Tall",
   "Plant_Grass_Sharp",
   "Plant_Reeds_Marsh",
   "Rock_Stone",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Rubble_Stone_Mossy",
   "Rubble_Stone_Mossy_Medium",
   "Soil_Clay",
   "Soil_Dirt",
   "Soil_Grass",
   "Soil_Gravel",
   "Soil_Leaves",
   "Soil_Mud",
   "Soil_Mud_Dry",
   "Soil_Pathway"
  ],
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
  ],
  "site": {
   "ox": -223,
   "oz": -982,
   "S0": 117,
   "rim": "Soil_Grass"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier1/Tile.Savannah_Boab.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Boab_Trees_Dry.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_0/Dry_Stage0_001.prefab.json",
      40.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_003.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_005.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_004.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_005.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_004.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_008.prefab.json",
      6.666666666666667
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Boab_Forest.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_0/Boab_Stage0_001.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_1/Boab_Stage1_001.prefab.json",
      50.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_001.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_008.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_015.prefab.json",
      10.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_3/Boab_Stage3_001.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_3/Boab_Stage3_007.prefab.json",
      3.3333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_3/Boab_Stage3_012.prefab.json",
      3.3333333333333335
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Cactus_Ball_1",
   "Plant_Flower_Bushy_Yellow",
   "Plant_Flower_Common_Blue",
   "Plant_Flower_Common_Cyan",
   "Plant_Flower_Common_Poisoned",
   "Plant_Flower_Common_Purple",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Short",
   "Plant_Grass_Arid_Tall",
   "Plant_Grass_Dry",
   "Plant_Grass_Dry_Tall",
   "Rock_Sandstone",
   "Rubble_Sandstone",
   "Rubble_Sandstone_Medium",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Grass_Dry",
   "Soil_Gravel_Sand"
  ],
  "chip": [
   "#0081b2",
   "#ce993b"
  ],
  "site": {
   "ox": 737,
   "oz": -147,
   "S0": 117,
   "rim": "Soil_Grass_Dry"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier1/Tile.Savannah_Forest.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Trees_Forest_Dry.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_0/Dry_Stage0_001.prefab.json",
      25.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json",
      8.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_004.prefab.json",
      8.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_005.prefab.json",
      8.333333333333334
     ],
     [
      "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_001.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_007.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_014.prefab.json",
      16.666666666666668
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Trees_Forest_Gum.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_001.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_005.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_010.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_001.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_005.prefab.json",
      1.6666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_010.prefab.json",
      1.6666666666666667
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Flower_Common_Blue",
   "Plant_Flower_Common_Poisoned",
   "Plant_Flower_Common_Purple",
   "Plant_Flower_Common_White",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Short",
   "Plant_Grass_Arid_Tall",
   "Plant_Grass_Dry",
   "Plant_Grass_Dry_Tall",
   "Rock_Sandstone",
   "Rubble_Sandstone",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Grass_Dry",
   "Soil_Gravel_Sand",
   "Soil_Leaves"
  ],
  "chip": [
   "#0081b2",
   "#b4a026"
  ],
  "site": {
   "ox": -44,
   "oz": 41,
   "S0": 117,
   "rim": "Soil_Grass_Dry"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier1/Tile.Savannah_Plains.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Trees_Dry.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_0/Dry_Stage0_001.prefab.json",
      60.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_004.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_005.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_004.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_008.prefab.json",
      6.666666666666667
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Trees_Boab.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_0/Boab_Stage0_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_1/Boab_Stage1_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_008.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_015.prefab.json",
      6.666666666666667
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Flower_Common_Blue",
   "Plant_Flower_Common_Cyan",
   "Plant_Flower_Common_Poisoned",
   "Plant_Flower_Common_Purple",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Short",
   "Plant_Grass_Arid_Tall",
   "Plant_Grass_Dry",
   "Plant_Grass_Dry_Tall",
   "Rock_Sandstone",
   "Rubble_Sandstone",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Grass_Dry",
   "Soil_Gravel_Sand",
   "Soil_Leaves"
  ],
  "chip": [
   "#0081b2",
   "#d6ae34"
  ],
  "site": {
   "ox": 159,
   "oz": 58,
   "S0": 117,
   "rim": "Soil_Grass_Dry"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier1/Tile.Savannah_Rock.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Rock_Cactus.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_006.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_008.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_015.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_001.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_007.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_012.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_001.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_004.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_007.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Plants/Cacti/Flat/Stage_0/Cacti_Flat_Stage_0_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Flat/Stage_0/Cacti_Flat_Stage_0_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Flat/Stage_0/Cacti_Flat_Stage_0_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Flat/Stage_1/Cacti_Flat_Stage_1_001.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Plants/Cacti/Flat/Stage_1/Cacti_Flat_Stage_1_005.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Plants/Cacti/Flat/Stage_1/Cacti_Flat_Stage_1_009.prefab.json",
      0.6666666666666666
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bramble_Dry_Twisted",
   "Plant_Bush_Arid",
   "Plant_Flower_Common_Blue2",
   "Plant_Flower_Common_Lime2",
   "Plant_Flower_Common_Poisoned",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Short",
   "Plant_Grass_Arid_Tall",
   "Plant_Grass_Dry_Tall",
   "Rock_Sandstone",
   "Rock_Sandstone_White",
   "Rubble_Sandstone",
   "Rubble_Sandstone_Medium",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Grass_Dry",
   "Soil_Gravel_Sand",
   "Soil_Gravel_Sand_White"
  ],
  "chip": [
   "#0081b2",
   "#caaf67"
  ],
  "site": {
   "ox": -44,
   "oz": 41,
   "S0": 117,
   "rim": "Soil_Gravel_Sand_White"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier1/Tile.Scrub_Bushland.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Scrub_Trees_Gum.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_1/Gum_Stage1_001.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_010.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_010.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_4/Gum_Stage4_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_4/Gum_Stage4_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Gum/Stage_4/Gum_Stage4_010.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Scrub_Trees.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_0/Dry_Stage0_001.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Dry/Stage_1_Dead/Dry_Dead_Stage1_001.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_004.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_004.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_008.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_007.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_014.prefab.json",
      0.3333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bramble_Dry_Sandthorn",
   "Plant_Flower_Common_Blue",
   "Plant_Flower_Common_Poisoned",
   "Plant_Flower_Common_Purple",
   "Plant_Flower_Common_White",
   "Plant_Flower_Flax_Orange",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Short",
   "Plant_Grass_Arid_Tall",
   "Plant_Grass_Dry",
   "Plant_Grass_Dry_Tall",
   "Rock_Sandstone",
   "Rubble_Sandstone",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Grass_Dry",
   "Soil_Gravel_Sand",
   "Soil_Gravel_Sand_Red",
   "Soil_Sand_Red"
  ],
  "chip": [
   "#0081b2",
   "#cf852f"
  ],
  "site": {
   "ox": -44,
   "oz": 41,
   "S0": 117,
   "rim": "Soil_Sand_Red"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier2/Tile.Desert_Oasis.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Desert_Cactus.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_006.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_008.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_015.prefab.json",
      0.3333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bramble_Dry_Twisted",
   "Plant_Flower_Common_Blue2",
   "Plant_Flower_Common_Lime2",
   "Plant_Flower_Common_Poisoned",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Short",
   "Plant_Leaves_Bramble",
   "Rock_Sandstone",
   "Rock_Sandstone_White",
   "Rubble_Sandstone_White",
   "Rubble_Sandstone_White_Medium",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Sand_White"
  ],
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
  ],
  "site": {
   "ox": -985,
   "oz": -79,
   "S0": 117,
   "rim": "Soil_Sand_White"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier2/Tile.Desert_Red.json",
  "forest": [],
  "layers": [
   "Plant_Bramble_Dry_Sandthorn",
   "Plant_Flower_Common_Blue2",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Tall",
   "Rock_Sandstone_Red",
   "Rubble_Sandstone_Red",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Grass_Dry",
   "Soil_Gravel_Sand_Red",
   "Soil_Sand_Red"
  ],
  "chip": [
   "#0081b2",
   "#b2743a"
  ],
  "site": {
   "ox": 830,
   "oz": 575,
   "S0": 117,
   "rim": "Soil_Sand_Red"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier2/Tile.Desert_Rock.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Desert_Rock_Palo.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Palo/Stage_3/Palo_Stage3_001.prefab.json",
      100.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Desert_Rock_Cactus.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_008.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_015.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_007.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_012.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_004.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_007.prefab.json",
      6.666666666666667
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Desert_Rock_Dry_Dead.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_2/Dry_Dead_Stage2_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_3/Dry_Dead_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_3/Dry_Dead_004.prefab.json",
      0.3333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bramble_Dry_Twisted",
   "Plant_Bush_Arid",
   "Plant_Flower_Bushy_Red",
   "Plant_Flower_Common_Blue2",
   "Plant_Flower_Common_Grey2",
   "Plant_Flower_Common_Lime2",
   "Plant_Flower_Common_Poisoned",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Short",
   "Plant_Leaves_Bramble",
   "Rock_Sandstone",
   "Rock_Sandstone_White",
   "Rubble_Sandstone_White",
   "Rubble_Sandstone_White_Medium",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Sand_White"
  ],
  "chip": [
   "#0081b2",
   "#e0c569"
  ],
  "site": {
   "ox": 197,
   "oz": -1097,
   "S0": 119,
   "rim": "Soil_Sand_White"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier2/Tile.Desert_Springs.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Savannah_Rock_Cactus.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_001.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_003.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_006.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_008.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_015.prefab.json",
      16.666666666666668
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Arid",
   "Plant_Bush_Arid_Sharp",
   "Plant_Flower_Common_Blue2",
   "Plant_Flower_Common_Lime2",
   "Plant_Flower_Common_Poisoned",
   "Plant_Flower_Flax_Orange",
   "Rock_Sandstone",
   "Rubble_Sandstone_White",
   "Rubble_Sandstone_White_Medium",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Sand_White"
  ],
  "chip": [
   "#0081b2",
   "#e0c569"
  ],
  "site": {
   "ox": 830,
   "oz": 575,
   "S0": 117,
   "rim": "Soil_Sand_White"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier3/Tile.Desert_Barren.json",
  "forest": [],
  "layers": [
   "Plant_Bramble_Dry_Twisted",
   "Plant_Flower_Bushy_Red",
   "Plant_Flower_Common_Blue2",
   "Plant_Flower_Common_Poisoned",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Short",
   "Plant_Leaves_Bramble",
   "Rock_Sandstone",
   "Rock_Sandstone_White",
   "Rubble_Sandstone_White",
   "Rubble_Sandstone_White_Medium",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Sand_White"
  ],
  "chip": [
   "#0081b2",
   "#e0c569"
  ],
  "site": {
   "ox": 830,
   "oz": 575,
   "S0": 117,
   "rim": "Soil_Sand_White"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier3/Tile.Desert_Mushroom.json",
  "forest": [],
  "layers": [
   "Plant_Bramble_Dry_Twisted",
   "Plant_Flower_Bushy_Red",
   "Plant_Flower_Common_Poisoned",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Short",
   "Plant_Leaves_Bramble",
   "Rock_Sandstone",
   "Rock_Sandstone_White",
   "Rubble_Sandstone_White",
   "Rubble_Sandstone_White_Medium",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Sand_White"
  ],
  "chip": [
   "#0081b2",
   "#e0c569"
  ],
  "site": {
   "ox": 830,
   "oz": 575,
   "S0": 117,
   "rim": "Soil_Sand_White"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier1/Tile.Forest_Fir.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Fir.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json",
      0.013333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_003.prefab.json",
      0.013333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_004.prefab.json",
      0.013333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      0.0033333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      0.0033333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      0.0033333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
      0.06
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_005.prefab.json",
      0.06
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_009.prefab.json",
      0.06
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
      0.07333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json",
      0.07333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json",
      0.07333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json",
      0.049999999999999996
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_005.prefab.json",
      0.049999999999999996
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_009.prefab.json",
      0.049999999999999996
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Lush",
   "Plant_Bush_Winter_Sharp",
   "Plant_Bush_Winter_Snow",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Flower_Common_Cyan2",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Common_Yellow",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Tall",
   "Plant_Seeds_Pine",
   "Rock_Marble",
   "Rock_Shale",
   "Rubble_Shale",
   "Rubble_Shale_Medium",
   "Soil_Dirt_Cold",
   "Soil_Grass_Cold",
   "Soil_Pebbles_Frozen",
   "Soil_Snow"
  ],
  "chip": [
   "#2f4a86",
   "#397341"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Grass_Cold"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier1/Tile.Forest_Redwood.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Redwood_Thin.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Cedar/Stage_3/Cedar_Stage3_001.prefab.json",
      0.15
     ],
     [
      "Server/Prefabs/Orbis/Trees/Redwood/Stage_0/Redwood_Stage0_001.prefab.json",
      0.15
     ],
     [
      "Server/Prefabs/Orbis/Trees/Redwood/Stage_1/Redwood_Stage1_001.prefab.json",
      0.1
     ],
     [
      "Server/Prefabs/Orbis/Trees/Redwood/Stage_2/Redwood_Stage2_001.prefab.json",
      0.35
     ],
     [
      "Server/Prefabs/Orbis/Trees/Redwood/Stage_3/Redwood_Stage3_001.prefab.json",
      0.2
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Redwood_Thick.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Cedar/Stage_3/Cedar_Stage3_001.prefab.json",
      0.2
     ],
     [
      "Server/Prefabs/Orbis/Trees/Redwood/Stage_1/Redwood_Stage1_001.prefab.json",
      0.25
     ],
     [
      "Server/Prefabs/Orbis/Trees/Redwood/Stage_2/Redwood_Stage2_001.prefab.json",
      0.3
     ],
     [
      "Server/Prefabs/Orbis/Trees/Redwood/Stage_3/Redwood_Stage3_001.prefab.json",
      0.2
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Lush",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Fern_Forest",
   "Plant_Fern_Winter",
   "Plant_Flower_Common_White",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Tall",
   "Plant_Moss_Rug_Lime",
   "Plant_Seeds_Pine",
   "Rock_Shale",
   "Rubble_Basalt",
   "Rubble_Basalt_Medium",
   "Soil_Dirt",
   "Soil_Dirt_Cold",
   "Soil_Grass",
   "Soil_Leaves",
   "Soil_Needles",
   "Soil_Pathway"
  ],
  "chip": [
   "#2f4a86",
   "#603b25"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Needles"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier1/Tile.Forest_Tundra.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Tundra.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_001.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_005.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_010.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Redwood/Stage_1/Redwood_Stage1_001.prefab.json",
      0.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Redwood/Stage_0/Redwood_Stage0_001.prefab.json",
      0.3
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Crop_Mushroom_Cap_Green",
   "Plant_Flower_Bushy_Green",
   "Plant_Flower_Tall_Purple",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Tall",
   "Plant_Moss_Rug_Green",
   "Rock_Shale",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Soil_Dirt_Cold",
   "Soil_Grass_Cold",
   "Soil_Gravel",
   "Soil_Gravel_Mossy",
   "Soil_Pebbles",
   "Soil_Snow"
  ],
  "chip": [
   "#2f4a86",
   "#80753d"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Grass_Cold"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier1/Tile.Plains_Hotsprings.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Fir_Valley.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_6/Ash_Stage6_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_005.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_009.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
      0.11666666666666665
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json",
      0.11666666666666665
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json",
      0.11666666666666665
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json",
      0.08333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_005.prefab.json",
      0.08333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_009.prefab.json",
      0.08333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Lush",
   "Plant_Flower_Common_Blue",
   "Plant_Flower_Common_Cyan2",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Tall_Purple",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Tall",
   "Plant_Reeds_Winter",
   "Rock_Basalt",
   "Rock_Shale",
   "Rubble_Basalt",
   "Rubble_Basalt_Medium",
   "Rubble_Stone_Mossy",
   "Rubble_Stone_Mossy_Medium",
   "Soil_Dirt_Cold",
   "Soil_Grass_Cold",
   "Soil_Gravel",
   "Soil_Pathway"
  ],
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
  ],
  "site": {
   "ox": 227,
   "oz": -427,
   "S0": 139,
   "rim": "Soil_Grass_Cold"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier1/Tile.Plains_Shire.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Plains_Shire.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Fir_red/Stage_1/Fir_red_Stage1_001.prefab.json",
      0.21666666666666667
     ],
     [
      "Server/Prefabs/Trees/Fir_red/Stage_1/Fir_red_Stage1_005.prefab.json",
      0.21666666666666667
     ],
     [
      "Server/Prefabs/Trees/Fir_red/Stage_1/Fir_red_Stage1_010.prefab.json",
      0.21666666666666667
     ],
     [
      "Server/Prefabs/Trees/Fir_red/Stage_0/Fir_red_Stage0_001.prefab.json",
      0.15
     ],
     [
      "Server/Prefabs/Trees/Fir_red/Stage_0/Fir_red_Stage0_003.prefab.json",
      0.15
     ],
     [
      "Server/Prefabs/Trees/Fir_red/Stage_0/Fir_red_Stage0_004.prefab.json",
      0.15
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Winter_Red",
   "Plant_Crop_Health1",
   "Plant_Flower_Common_Orange",
   "Plant_Flower_Common_White",
   "Plant_Flower_Common_Yellow",
   "Plant_Grass_Cave_Short",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Tall",
   "Plant_Moss_Rug_Yellow",
   "Plant_Moss_Short_Yellow",
   "Rock_Shale",
   "Rubble_Basalt",
   "Rubble_Basalt_Medium",
   "Rubble_Shale",
   "Rubble_Shale_Medium",
   "Soil_Dirt",
   "Soil_Dirt_Cold",
   "Soil_Grass",
   "Soil_Grass_Cold",
   "Soil_Gravel",
   "Soil_Pebbles_Frozen"
  ],
  "chip": [
   "#2f4a86",
   "#968721"
  ],
  "site": {
   "ox": -334,
   "oz": 509,
   "S0": 140,
   "rim": "Soil_Grass"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier2/Tile.Forest_Cedar.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier2/PrefabPatterns/Forest_Cedar_Thick.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Cedar/Stage_2/Cedar_Stage2_001.prefab.json",
      0.38
     ],
     [
      "Server/Prefabs/Orbis/Trees/Cedar/Stage_3/Cedar_Stage3_001.prefab.json",
      0.62
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier2/PrefabPatterns/Forest_Cedar_Thin.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Cedar/Stage_2/Cedar_Stage2_001.prefab.json",
      0.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Cedar/Stage_1/Cedar_Stage1_001.prefab.json",
      0.5
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bramble_Dry_Twisted",
   "Plant_Bush_Winter",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Crop_Mushroom_Flatcap_Blue",
   "Plant_Fern_Forest",
   "Plant_Fern_Winter",
   "Plant_Flower_Common_White",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Tall",
   "Plant_Seeds_Pine",
   "Rock_Shale",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Dirt_Cold",
   "Soil_Grass",
   "Soil_Gravel",
   "Soil_Pebbles",
   "Soil_Snow"
  ],
  "chip": [
   "#2f4a86",
   "#806936"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Dirt"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier2/Tile.Forest_Cedar_Mixed.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier2/PrefabPatterns/Forest_Cedar_Thick.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Cedar/Stage_1/Cedar_Stage1_001.prefab.json",
      0.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Cedar/Stage_2/Cedar_Stage2_001.prefab.json",
      0.34
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
      0.02666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_005.prefab.json",
      0.02666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_009.prefab.json",
      0.02666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
      0.02666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json",
      0.02666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json",
      0.02666666666666667
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier2/PrefabPatterns/Forest_Cedar_Thin.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Cedar/Stage_1/Cedar_Stage1_001.prefab.json",
      0.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Cedar/Stage_2/Cedar_Stage2_001.prefab.json",
      0.34
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
      0.02666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_005.prefab.json",
      0.02666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_009.prefab.json",
      0.02666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
      0.02666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json",
      0.02666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json",
      0.02666666666666667
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bramble_Dry_Twisted",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Fern_Winter",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Tall",
   "Plant_Seeds_Pine",
   "Rock_Shale",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Dirt_Cold",
   "Soil_Grass",
   "Soil_Gravel",
   "Soil_Snow"
  ],
  "chip": [
   "#2f4a86",
   "#806936"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Dirt"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier2/Tile.Plains_Frozen.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier2/PrefabPatterns/Forest_Fir.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_003.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_004.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_003.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_004.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_005.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_009.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
      0.19999999999999998
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json",
      0.19999999999999998
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json",
      0.19999999999999998
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Winter_Sharp",
   "Plant_Bush_Winter_Snow",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Tall",
   "Rock_Marble",
   "Rock_Shale",
   "Soil_Dirt_Cold",
   "Soil_Grass_Cold",
   "Soil_Gravel",
   "Soil_Snow"
  ],
  "chip": [
   "#033e88",
   "#dbf0f5"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Snow"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier2/Tile.Plains_Tundra.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier2/PrefabPatterns/Forest_Fir_Valley.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_6/Ash_Stage6_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_005.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_009.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_005.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_009.prefab.json",
      0.09999999999999999
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Winter_Red",
   "Plant_Flower_Tall_Purple",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Tall",
   "Rock_Shale",
   "Soil_Dirt_Cold",
   "Soil_Grass_Cold",
   "Soil_Gravel",
   "Soil_Mud_Dry",
   "Soil_Pathway",
   "Soil_Snow"
  ],
  "chip": [
   "#2f4a86",
   "#455d27"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Grass_Cold"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier2/Custom.Valley_Glacier.json",
  "forest": [],
  "layers": [
   "Plant_Coral_Model_Blue",
   "Plant_Coral_Model_Cyan",
   "Plant_Crop_Mana2",
   "Plant_Flower_Bushy_Blue",
   "Plant_Seaweed_Grass",
   "Plant_Seaweed_Grass_Short",
   "Plant_Seaweed_Winter_Blue",
   "Plant_Seaweed_Winter_Short",
   "Rock_Ice",
   "Rock_Ice_Permafrost",
   "Rock_Shale",
   "Soil_Gravel",
   "Soil_Pebbles"
  ],
  "chip": [
   "#033e88",
   "#ceeaf9"
  ],
  "site": {
   "ox": 77,
   "oz": -721,
   "S0": 144,
   "rim": "Rock_Ice_Permafrost"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier3/Tile.Forest_Frozen.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier3/PrefabPatterns/Forest_Fir_Frozen.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_001.prefab.json",
      0.16666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_006.prefab.json",
      0.16666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_011.prefab.json",
      0.16666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_001.prefab.json",
      0.14333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_005.prefab.json",
      0.14333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_009.prefab.json",
      0.14333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_001.prefab.json",
      0.023333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_2/Fir_Dead_Stage2_005.prefab.json",
      0.023333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_3/Fir_Dead_Stage3_010.prefab.json",
      0.023333333333333334
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Winter_Sharp",
   "Plant_Bush_Winter_Snow",
   "Plant_Flower_Bushy_White",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Snowy",
   "Plant_Grass_Snowy_Short",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Short",
   "Plant_Grass_Winter_Tall",
   "Rock_Crystal_Blue_Medium",
   "Rock_Crystal_Blue_Small",
   "Rock_Ice",
   "Rock_Marble",
   "Rock_Shale",
   "Rubble_Ice",
   "Rubble_Ice_Medium",
   "Soil_Dirt_Cold",
   "Soil_Grass_Cold",
   "Soil_Snow"
  ],
  "chip": [
   "#033e88",
   "#dbf0f5"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Snow"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier3/Tile.Forest_Frozen_Light.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier3/PrefabPatterns/Forest_Fir_Frozen_Light.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_001.prefab.json",
      0.14333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_006.prefab.json",
      0.14333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_011.prefab.json",
      0.14333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_001.prefab.json",
      0.16666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_005.prefab.json",
      0.16666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_009.prefab.json",
      0.16666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_001.prefab.json",
      0.023333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_2/Fir_Dead_Stage2_005.prefab.json",
      0.023333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_3/Fir_Dead_Stage3_010.prefab.json",
      0.023333333333333334
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier3/PrefabPatterns/Forest_Fir.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_005.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_009.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_005.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_009.prefab.json",
      0.09999999999999999
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Winter_Sharp",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Tall",
   "Plant_Seeds_Pine",
   "Rock_Ice",
   "Rock_Marble",
   "Rock_Shale",
   "Soil_Dirt_Cold",
   "Soil_Grass_Cold",
   "Soil_Snow"
  ],
  "chip": [
   "#033e88",
   "#397341"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Snow"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier3/Tile.Plains_Frozen_Frost.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier3/PrefabPatterns/Forest_Fir_Frozen_Frost.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_001.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_006.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_011.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_001.prefab.json",
      0.19999999999999998
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_005.prefab.json",
      0.19999999999999998
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_009.prefab.json",
      0.19999999999999998
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Winter_Sharp",
   "Plant_Bush_Winter_Snow",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Tall",
   "Rock_Ice",
   "Rock_Marble",
   "Rock_Shale",
   "Soil_Dirt_Cold",
   "Soil_Grass_Cold",
   "Soil_Snow"
  ],
  "chip": [
   "#033e88",
   "#dbf0f5"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Snow"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier4/Tile.Desert_Dunes.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Forest_Bamboo.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_003.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Bamboo.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_005.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_008.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_001.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_005.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_008.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_3/Bamboo_Stage3_001.prefab.json",
      0.15
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_3/Bamboo_Stage3_005.prefab.json",
      0.15
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_3/Bamboo_Stage3_008.prefab.json",
      0.15
     ],
     [
      "Server/Prefabs/Trees/Bamboo/Giant/Bamboo_Giant_001.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Bamboo/Giant/Bamboo_Giant_005.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Bamboo/Giant/Bamboo_Giant_008.prefab.json",
      0.024999999999999998
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Bamboo_Young.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_0/Bamboo_Stage0_001.prefab.json",
      0.2
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_001.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_005.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_008.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_001.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_005.prefab.json",
      0.13333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_008.prefab.json",
      0.13333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Ingredient_Charcoal",
   "Plant_Bush_Arid_Palm",
   "Plant_Bush_Dead",
   "Plant_Bush_Dead_Tall",
   "Plant_Bush_Dead_Twisted",
   "Plant_Bush_Jungle",
   "Plant_Crop_Mushroom_Flatcap_Green",
   "Plant_Crop_Mushroom_Glowing_Orange",
   "Plant_Flower_Bushy_Cyan",
   "Plant_Flower_Bushy_Grey",
   "Plant_Flower_Common_Pink",
   "Plant_Flower_Tall_Cyan2",
   "Plant_Grass_Jungle",
   "Plant_Grass_Jungle_Short",
   "Plant_Grass_Jungle_Tall",
   "Plant_Leaves_Jungle_Floor",
   "Plant_Moss_Rug_Lime",
   "Rock_Crystal_Red_Medium",
   "Rock_Crystal_Red_Small",
   "Rock_Crystal_Yellow_Medium",
   "Rock_Crystal_Yellow_Small",
   "Rock_Slate",
   "Rubble_Slate",
   "Rubble_Slate_Medium",
   "Soil_Ash",
   "Soil_Grass_Deep"
  ],
  "chip": [
   "#67352c",
   "#8a8649"
  ],
  "site": {
   "ox": -107,
   "oz": -299,
   "S0": 134,
   "rim": "Soil_Grass_Deep"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier4/Tile.Forest_Ghost.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Ghost_Trees_Dense.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Petrified/Stage_1/Petrified_Stage1_001.prefab.json",
      0.25
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified/Stage_2/Petrified_Stage2_001.prefab.json",
      0.11666666666666665
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified/Stage_2/Petrified_Stage2_003.prefab.json",
      0.11666666666666665
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified/Stage_2/Petrified_Stage2_005.prefab.json",
      0.11666666666666665
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified/Stage_3/Petrified_Stage3_001.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified/Stage_3/Petrified_Stage3_003.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified/Stage_3/Petrified_Stage3_004.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_005.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_2/Petrified_Dead_Stage2_001.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_2/Petrified_Dead_Stage2_003.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_2/Petrified_Dead_Stage2_004.prefab.json",
      0.06666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_3/Petrified_Dead_Stage3_001.prefab.json",
      0.01
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Ghost_Trees_Sparse.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Petrified/Stage_1/Petrified_Stage1_001.prefab.json",
      0.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_003.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_005.prefab.json",
      0.09999999999999999
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Dead",
   "Plant_Crop_Mushroom_Glowing_Violet",
   "Plant_Grass_Gnarled",
   "Plant_Grass_Gnarled_Short",
   "Plant_Grass_Gnarled_Tall",
   "Plant_Leaves_Autumn_Floor",
   "Rock_Slate",
   "Rubble_Slate",
   "Rubble_Slate_Medium",
   "Soil_Ash",
   "Soil_Dirt_Burnt",
   "Soil_Grass_Burnt",
   "Soil_Leaves"
  ],
  "chip": [
   "#cd875c",
   "#585a65"
  ],
  "site": {
   "ox": -103,
   "oz": 880,
   "S0": 137,
   "rim": "Soil_Grass_Burnt"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier4/Tile.Forest_Swamp.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Swamp_Trees_Dense.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_001.prefab.json",
      0.011666666666666667
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_002.prefab.json",
      0.011666666666666667
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_003.prefab.json",
      0.011666666666666667
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_3/Mushroom_Large_Yellow_Stage_3_004.prefab.json",
      0.015
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_001.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_002.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_003.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_3/Mushroom_Large_Green_Stage_3_004.prefab.json",
      0.025
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_3/Ash_Dead_Stage3_001.prefab.json",
      0.2733333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_3/Ash_Dead_Stage3_006.prefab.json",
      0.2733333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_3/Ash_Dead_Stage3_011.prefab.json",
      0.2733333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Swamp_Bramble.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_001.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_002.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_003.prefab.json",
      0.016666666666666666
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_001.prefab.json",
      0.049999999999999996
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_002.prefab.json",
      0.049999999999999996
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_003.prefab.json",
      0.049999999999999996
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Crop_Mushroom_Cap_Green",
   "Plant_Crop_Mushroom_Glowing_Red",
   "Plant_Flower_Bushy_Poisoned",
   "Plant_Grass_Gnarled",
   "Plant_Grass_Gnarled_Short",
   "Plant_Reeds_Poison",
   "Plant_Reeds_Water",
   "Rock_Basalt",
   "Rubble_Basalt",
   "Rubble_Basalt_Medium",
   "Soil_Dirt_Burnt",
   "Soil_Dirt_Poisoned",
   "Soil_Grass_Burnt"
  ],
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
  ],
  "site": {
   "ox": 381,
   "oz": -343,
   "S0": 133,
   "rim": "Soil_Grass_Burnt"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier4/Tile.Wastes_Geysers.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Wastes_Geysers_Stumps.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Ash_twisted_Large/Ash_twisted_Large_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Trees/Ash_twisted_Large/Ash_twisted_Large_003.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Trees/Ash_twisted_Large/Ash_twisted_Large_004.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Trees/Ash_twisted_Giant/Ash_twisted_Giant_001.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Trees/Ash_twisted_Giant/Ash_twisted_Giant_002.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Trees/Ash_twisted_Giant/Ash_twisted_Giant_003.prefab.json",
      0.006666666666666667
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bramble_Moss_Twisted",
   "Plant_Bush_Dead_Tall",
   "Plant_Bush_Dead_Twisted",
   "Plant_Crop_Mushroom_Cap_Green",
   "Plant_Crop_Mushroom_Glowing_Red",
   "Plant_Grass_Gnarled",
   "Plant_Grass_Gnarled_Short",
   "Plant_Grass_Gnarled_Tall",
   "Plant_Moss_Block_Green_Dark",
   "Plant_Moss_Rug_Green",
   "Rock_Basalt",
   "Rock_Crystal_Green_Medium",
   "Rock_Crystal_Green_Small",
   "Rubble_Basalt",
   "Rubble_Basalt_Medium",
   "Soil_Dirt_Burnt",
   "Soil_Mud_Dry"
  ],
  "chip": [
   "#67352c",
   "#705e30"
  ],
  "site": {
   "ox": -51,
   "oz": -876,
   "S0": 154,
   "rim": "Rock_Basalt"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier4/Tile.Wastes_Grasslands.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Grasslands_Trees_Forest.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_001.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_003.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_006.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_001.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_007.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_012.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_001.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_003.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_006.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_1/Burnt_Stage1_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_2/Burnt_Stage2_004.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_3/Burnt_Stage3_008.prefab.json",
      0.09999999999999999
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Grasslands_Trees_Plains.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_1/Sallow_Stage1_001.prefab.json",
      0.25
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_001.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_003.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_004.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_3/Sallow_Stage3_001.prefab.json",
      0.2
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Dead_Tall",
   "Plant_Bush_Dead_Twisted",
   "Plant_Crop_Wheat_Stage_4_Burnt",
   "Plant_Flower_Orchid_Orange",
   "Plant_Grass_Gnarled",
   "Plant_Grass_Gnarled_Short",
   "Plant_Grass_Gnarled_Tall",
   "Rock_Basalt",
   "Rubble_Basalt",
   "Rubble_Basalt_Medium",
   "Soil_Ash",
   "Soil_Dirt_Burnt",
   "Soil_Grass_Burnt"
  ],
  "chip": [
   "#67352c",
   "#705e30"
  ],
  "site": {
   "ox": -103,
   "oz": 880,
   "S0": 137,
   "rim": "Soil_Grass_Burnt"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier5/Tile.Desert_Ash.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Wastes_Ash_Stumps.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_1/Burnt_dead_Stage1_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_006.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_2/Jungle_Crystal_Stage2_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_2/Jungle_Crystal_Stage2_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_2/Jungle_Crystal_Stage2_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_1/Jungle_Crystal_Stage1_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_1/Jungle_Crystal_Stage1_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_1/Jungle_Crystal_Stage1_005.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Mushroom_Walls.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_003.prefab.json",
      0.3333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Ingredient_Charcoal",
   "Plant_Bush_Crystal",
   "Plant_Bush_Dead",
   "Plant_Bush_Dead_Tall",
   "Plant_Bush_Dead_Twisted",
   "Plant_Bush_Jungle",
   "Plant_Crop_Mushroom_Glowing_Red",
   "Plant_Flower_Bushy_Grey",
   "Plant_Flower_Bushy_Red",
   "Plant_Flower_Common_Pink",
   "Plant_Flower_Tall_Pink",
   "Plant_Flower_Tall_Purple",
   "Plant_Flower_Tall_Red",
   "Plant_Grass_Jungle",
   "Plant_Grass_Jungle_Short",
   "Plant_Moss_Rug_Yellow",
   "Rock_Crystal_Red_Large",
   "Rock_Crystal_Red_Medium",
   "Rock_Crystal_Red_Small",
   "Rock_Slate",
   "Rubble_Slate",
   "Rubble_Slate_Medium",
   "Soil_Ash",
   "Soil_Grass_Deep",
   "Soil_Mud_Dry"
  ],
  "chip": [
   "#67352c",
   "#373838"
  ],
  "site": {
   "ox": -621,
   "oz": -501,
   "S0": 136,
   "rim": "Soil_Ash"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier5/Tile.Forest_Burned.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Forest_Burned_Trees_Sparse.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_1/Burnt_dead_Stage1_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_003.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_006.prefab.json",
      0.09999999999999999
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Forest_Burned_Trees_Dense.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Fire_Burning/Stage_1/Fire_Burning_Stage1_001.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fire_Burning/Stage_3/Fire_Burning_Stage3_001.prefab.json",
      1.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest_Young.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_003.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest_Small.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_2/Fig_Blue_Stage2_001.prefab.json",
      33.0
     ],
     [
      "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_001.prefab.json",
      8.333333333333334
     ],
     [
      "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_002.prefab.json",
      8.333333333333334
     ],
     [
      "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_003.prefab.json",
      8.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_3/Fig_Blue_Stage3_001.prefab.json",
      8.0
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal_Red/Stage_03/Jungle_Crystal_Red_Stage03_001.prefab.json",
      11.0
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal_Red/Stage_03/Jungle_Crystal_Red_Stage03_004.prefab.json",
      11.0
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal_Red/Stage_03/Jungle_Crystal_Red_Stage03_007.prefab.json",
      11.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Jungle2/Boulder_Red/Jungle2_Boulder_Red_001.prefab.json",
      12.5
     ],
     [
      "Server/Prefabs/Trees/Jungle2/Boulder_Red/Jungle2_Boulder_Red_003.prefab.json",
      12.5
     ],
     [
      "Server/Prefabs/Trees/Jungle2/Boulder_Red/Jungle2_Boulder_Red_004.prefab.json",
      12.5
     ],
     [
      "Server/Prefabs/Trees/Jungle/Stage_2/Jungle_Stage_2_001.prefab.json",
      52.5
     ],
     [
      "Server/Prefabs/Trees/Jungle1/Stage_3_Crystal_Red/Jungle1_Stage3_Crystal_Red_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Trees/Jungle1/Stage_3_Crystal_Red/Jungle1_Stage3_Crystal_Red_002.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Trees/Jungle1/Stage_3_Crystal_Red/Jungle1_Stage3_Crystal_Red_003.prefab.json",
      5.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Mushroom_Walls.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_003.prefab.json",
      0.3333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Deco_Fire",
   "Ingredient_Charcoal",
   "Plant_Bramble_Dead_Lavathorn",
   "Plant_Bush_Dead_Tall",
   "Plant_Bush_Dead_Twisted",
   "Plant_Crop_Health1",
   "Plant_Crop_Mushroom_Glowing_Red",
   "Plant_Fern_Forest",
   "Plant_Fern_Winter",
   "Plant_Flower_Bushy_Orange",
   "Plant_Flower_Bushy_Red",
   "Plant_Flower_Flax_Orange",
   "Plant_Flower_Tall_Red",
   "Plant_Grass_Gnarled",
   "Plant_Grass_Gnarled_Short",
   "Plant_Grass_Gnarled_Tall",
   "Plant_Grass_Jungle",
   "Plant_Grass_Jungle_Short",
   "Plant_Grass_Jungle_Tall",
   "Plant_Grass_Lush_Tall",
   "Rock_Crystal_Red_Medium",
   "Rock_Crystal_Red_Small",
   "Rock_Volcanic",
   "Rock_Volcanic_Cracked_Lava",
   "Rubble_Volcanic",
   "Rubble_Volcanic_Medium",
   "Soil_Ash",
   "Soil_Dirt_Burnt",
   "Soil_Grass",
   "Soil_Grass_Burnt",
   "Soil_Grass_Deep",
   "Soil_Mud_Dry"
  ],
  "lava": true,
  "chip": [
   "#cd875c",
   "#4d2a2a"
  ],
  "site": {
   "ox": 575,
   "oz": -288,
   "S0": 131,
   "rim": "Soil_Grass_Burnt"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier5/Tile.Forest_Roots.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Forest_Roots_Trees_Dense.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Burnt_Roots/Normal/Stage_3/Burnt_Roots_Normal_001.prefab.json",
      0.85
     ],
     [
      "Server/Prefabs/Trees/Burnt_Roots/Normal/Mushroom/Burnt_Roots_Normal_001.prefab.json",
      0.05
     ],
     [
      "Server/Prefabs/Trees/Burnt_Roots/Spider/Stage_3/Burnt_Roots_Spider_002.prefab.json",
      0.08
     ],
     [
      "Server/Prefabs/Trees/Burnt_Roots/Spider/Mushroom/Burnt_Roots_Spider_001.prefab.json",
      0.02
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_2/Jungle_Crystal_Stage2_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_2/Jungle_Crystal_Stage2_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_2/Jungle_Crystal_Stage2_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_1/Jungle_Crystal_Stage1_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_1/Jungle_Crystal_Stage1_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal/Stage_1/Jungle_Crystal_Stage1_005.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Mushroom_Walls.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_003.prefab.json",
      0.3333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bramble_Dead_Lavathorn",
   "Plant_Bush_Dead_Twisted",
   "Plant_Bush_Jungle",
   "Plant_Crop_Mushroom_Glowing_Blue",
   "Plant_Crop_Mushroom_Glowing_Red",
   "Plant_Flower_Bushy_Blue",
   "Plant_Flower_Bushy_Poisoned",
   "Plant_Flower_Common_Pink",
   "Plant_Flower_Tall_Pink",
   "Plant_Flower_Tall_Purple",
   "Plant_Flower_Tall_Red",
   "Plant_Grass_Gnarled",
   "Plant_Grass_Gnarled_Short",
   "Plant_Grass_Jungle",
   "Plant_Grass_Jungle_Short",
   "Plant_Moss_Rug_Yellow",
   "Plant_Reeds_Water",
   "Rock_Crystal_Green_Medium",
   "Rock_Crystal_Green_Small",
   "Rock_Slate",
   "Rubble_Slate",
   "Rubble_Slate_Medium",
   "Soil_Grass_Burnt",
   "Soil_Grass_Deep",
   "Soil_Mud_Dry"
  ],
  "chip": [
   "#cd875c",
   "#3e3e3e"
  ],
  "site": {
   "ox": 575,
   "oz": -288,
   "S0": 130,
   "rim": "Soil_Grass_Burnt"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier5/Tile.Wastes_Ash.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Wastes_Ash_Stumps.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_1/Burnt_dead_Stage1_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_006.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest_Young.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_003.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest_Small.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_2/Fig_Blue_Stage2_001.prefab.json",
      33.0
     ],
     [
      "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_001.prefab.json",
      8.333333333333334
     ],
     [
      "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_002.prefab.json",
      8.333333333333334
     ],
     [
      "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_003.prefab.json",
      8.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_3/Fig_Blue_Stage3_001.prefab.json",
      8.0
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal_Red/Stage_03/Jungle_Crystal_Red_Stage03_001.prefab.json",
      11.0
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal_Red/Stage_03/Jungle_Crystal_Red_Stage03_004.prefab.json",
      11.0
     ],
     [
      "Server/Prefabs/Trees/Jungle_Crystal_Red/Stage_03/Jungle_Crystal_Red_Stage03_007.prefab.json",
      11.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Jungle2/Boulder_Red/Jungle2_Boulder_Red_001.prefab.json",
      12.5
     ],
     [
      "Server/Prefabs/Trees/Jungle2/Boulder_Red/Jungle2_Boulder_Red_003.prefab.json",
      12.5
     ],
     [
      "Server/Prefabs/Trees/Jungle2/Boulder_Red/Jungle2_Boulder_Red_004.prefab.json",
      12.5
     ],
     [
      "Server/Prefabs/Trees/Jungle/Stage_2/Jungle_Stage_2_001.prefab.json",
      52.5
     ],
     [
      "Server/Prefabs/Trees/Jungle1/Stage_3_Crystal_Red/Jungle1_Stage3_Crystal_Red_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Trees/Jungle1/Stage_3_Crystal_Red/Jungle1_Stage3_Crystal_Red_002.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Trees/Jungle1/Stage_3_Crystal_Red/Jungle1_Stage3_Crystal_Red_003.prefab.json",
      5.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Mushroom_Walls.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_003.prefab.json",
      0.3333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Crystal",
   "Plant_Bush_Dead",
   "Plant_Bush_Dead_Tall",
   "Plant_Bush_Dead_Twisted",
   "Plant_Crop_Mushroom_Glowing_Red",
   "Plant_Fern_Forest",
   "Plant_Fern_Winter",
   "Plant_Flower_Bushy_Orange",
   "Plant_Flower_Bushy_Poisoned",
   "Plant_Flower_Bushy_Red",
   "Plant_Flower_Flax_Orange",
   "Plant_Flower_Tall_Red",
   "Plant_Grass_Cave_Short",
   "Plant_Grass_Gnarled",
   "Plant_Grass_Gnarled_Short",
   "Plant_Grass_Gnarled_Tall",
   "Plant_Grass_Jungle",
   "Plant_Grass_Jungle_Short",
   "Plant_Grass_Jungle_Tall",
   "Plant_Grass_Lush_Tall",
   "Rock_Crystal_Red_Medium",
   "Rock_Crystal_Red_Small",
   "Rock_Slate",
   "Rubble_Slate",
   "Rubble_Slate_Medium",
   "Soil_Grass",
   "Soil_Grass_Deep",
   "Soil_Mud_Dry",
   "Soil_Sand_Ashen"
  ],
  "chip": [
   "#67352c",
   "#9b9b8e"
  ],
  "site": {
   "ox": 994,
   "oz": -622,
   "S0": 151,
   "rim": "Soil_Sand_Ashen"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier5/Tile.Wastes_Lava.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Lava_Fields_Stumps.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_1/Burnt_dead_Stage1_001.prefab.json",
      0.3
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_003.prefab.json",
      0.3
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_006.prefab.json",
      0.3
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_1/Burnt_Stage1_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_2/Burnt_Stage2_004.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_3/Burnt_Stage3_008.prefab.json",
      0.03333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest_Young.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_003.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest_Small.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_2/Fig_Blue_Stage2_001.prefab.json",
      50.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_3/Fig_Blue_Stage3_001.prefab.json",
      50.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest.json",
    "prefabs": [
     [
      "Server/Prefabs/Trees/Jungle2/Boulder/Jungle2_Boulder_Stage0_001.prefab.json",
      12.5
     ],
     [
      "Server/Prefabs/Trees/Jungle2/Boulder/Jungle2_Boulder_Stage1_002.prefab.json",
      12.5
     ],
     [
      "Server/Prefabs/Trees/Jungle2/Boulder/Jungle2_Boulder_Stage2_001.prefab.json",
      12.5
     ],
     [
      "Server/Prefabs/Trees/Jungle/Stage_2/Jungle_Stage_2_001.prefab.json",
      52.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Banyan/Stage_3/Banyan_Stage3_001.prefab.json",
      15.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest_Bamboo.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_0/Bamboo_Stage0_001.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_008.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_008.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Bamboo/Giant/Bamboo_Giant_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Bamboo/Giant/Bamboo_Giant_005.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Trees/Bamboo/Giant/Bamboo_Giant_008.prefab.json",
      0.3333333333333333
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Mushroom_Walls.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_003.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_001.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_002.prefab.json",
      0.3333333333333333
     ],
     [
      "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_003.prefab.json",
      0.3333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bramble_Dead_Lavathorn",
   "Plant_Bush_Dead_Tall",
   "Plant_Bush_Dead_Twisted",
   "Plant_Crop_Mushroom_Glowing_Green",
   "Plant_Crop_Mushroom_Glowing_Violet",
   "Plant_Fern_Forest",
   "Plant_Fern_Winter",
   "Plant_Flower_Bushy_Red",
   "Plant_Flower_Tall_Cyan",
   "Plant_Flower_Tall_Cyan2",
   "Plant_Grass_Jungle",
   "Plant_Grass_Jungle_Short",
   "Plant_Grass_Jungle_Tall",
   "Plant_Grass_Lush_Tall",
   "Rock_Crystal_Red_Large",
   "Rock_Crystal_Red_Medium",
   "Rock_Crystal_Red_Small",
   "Rock_Crystal_Yellow_Medium",
   "Rock_Crystal_Yellow_Small",
   "Rock_Magma_Cooled",
   "Rock_Volcanic",
   "Rubble_Volcanic",
   "Rubble_Volcanic_Medium",
   "Soil_Grass",
   "Soil_Grass_Deep",
   "Soil_Mud_Dry"
  ],
  "lava": true,
  "chip": [
   "#67352c",
   "#322929"
  ],
  "site": {
   "ox": -180,
   "oz": -104,
   "S0": 130,
   "rim": "Rock_Volcanic"
  }
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
  "tile": "Server/World/Default/Zones/Zone1_Tier1/Tile.Plains_Smooth.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Smooth_Ash.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      13.333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      1.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      1.0
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Smooth_Oak.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
      11.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_003.prefab.json",
      11.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_006.prefab.json",
      11.5
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_003.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_006.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_001.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_002.prefab.json",
      0.6666666666666666
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_003.prefab.json",
      0.6666666666666666
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Smooth_Grove.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_006.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_006.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_006.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      0.03333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      0.03333333333333333
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush",
   "Plant_Bush_Green",
   "Plant_Crop_Health1",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Flower_Common_Red2",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Common_Yellow2",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Lush_Short",
   "Plant_Grass_Sharp",
   "Plant_Grass_Sharp_Short",
   "Plant_Grass_Sharp_Tall",
   "Plant_Grass_Sharp_Wild",
   "Rock_Stone",
   "Rubble_Marble",
   "Rubble_Marble_Medium",
   "Rubble_Stone",
   "Rubble_Stone_Medium",
   "Soil_Dirt",
   "Soil_Grass_Deep",
   "Soil_Grass_Full",
   "Soil_Gravel",
   "Soil_Leaves",
   "Soil_Pathway",
   "Wood_Sticks"
  ],
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
  "bank": true,
  "chip": [
   "#1983d9",
   "#4e8a28"
  ],
  "site": {
   "ox": 982,
   "oz": -408,
   "S0": 122,
   "rim": "Soil_Grass_Full"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier1/Tile.Savannah_Plains.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Trees_Dry.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_0/Dry_Stage0_001.prefab.json",
      60.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_004.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_005.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_004.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_008.prefab.json",
      6.666666666666667
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Trees_Boab.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_0/Boab_Stage0_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_1/Boab_Stage1_001.prefab.json",
      5.0
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_001.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_008.prefab.json",
      6.666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_015.prefab.json",
      6.666666666666667
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Flower_Common_Blue",
   "Plant_Flower_Common_Cyan",
   "Plant_Flower_Common_Poisoned",
   "Plant_Flower_Common_Purple",
   "Plant_Grass_Arid",
   "Plant_Grass_Arid_Short",
   "Plant_Grass_Arid_Tall",
   "Plant_Grass_Dry",
   "Plant_Grass_Dry_Tall",
   "Rock_Sandstone",
   "Rubble_Sandstone",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Grass_Dry",
   "Soil_Gravel_Sand",
   "Soil_Leaves"
  ],
  "water": {
   "kind": "river",
   "bed": "Soil_Gravel_Sand",
   "plants": [],
   "density": 0
  },
  "bank": true,
  "chip": [
   "#0081b2",
   "#c39b48"
  ],
  "site": {
   "ox": 159,
   "oz": 58,
   "S0": 117,
   "rim": "Soil_Grass_Dry"
  }
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
  "tile": "Server/World/Default/Zones/Zone2_Tier2/Tile.Desert_Springs.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Savannah_Rock_Cactus.json",
    "prefabs": [
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_001.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_003.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_006.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_008.prefab.json",
      16.666666666666668
     ],
     [
      "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_015.prefab.json",
      16.666666666666668
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Arid",
   "Plant_Bush_Arid_Sharp",
   "Plant_Flower_Common_Blue2",
   "Plant_Flower_Common_Lime2",
   "Plant_Flower_Common_Poisoned",
   "Plant_Flower_Flax_Orange",
   "Rock_Sandstone",
   "Rubble_Sandstone_White",
   "Rubble_Sandstone_White_Medium",
   "Soil_Clay",
   "Soil_Dirt_Dry",
   "Soil_Sand_White"
  ],
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
  "bank": true,
  "chip": [
   "#0081b2",
   "#e0c569"
  ],
  "site": {
   "ox": 830,
   "oz": 575,
   "S0": 117,
   "rim": "Soil_Sand_White"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier1/Tile.Forest_Fir.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Fir.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json",
      0.013333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_003.prefab.json",
      0.013333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_004.prefab.json",
      0.013333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      0.0033333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      0.0033333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      0.0033333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
      0.06
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_005.prefab.json",
      0.06
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_009.prefab.json",
      0.06
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
      0.07333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json",
      0.07333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json",
      0.07333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json",
      0.049999999999999996
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_005.prefab.json",
      0.049999999999999996
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_009.prefab.json",
      0.049999999999999996
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Lush",
   "Plant_Bush_Winter_Sharp",
   "Plant_Bush_Winter_Snow",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Flower_Common_Cyan2",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Common_Yellow",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Tall",
   "Plant_Seeds_Pine",
   "Rock_Marble",
   "Rock_Shale",
   "Rubble_Shale",
   "Rubble_Shale_Medium",
   "Soil_Dirt_Cold",
   "Soil_Grass_Cold",
   "Soil_Pebbles_Frozen",
   "Soil_Snow"
  ],
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
  "bank": true,
  "chip": [
   "#cedbdb",
   "#397341"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Grass_Cold"
  }
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
  "tile": "Server/World/Default/Zones/Zone3_Tier1/Tile.Forest_Fir.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Fir.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json",
      0.013333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_003.prefab.json",
      0.013333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_004.prefab.json",
      0.013333333333333334
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json",
      0.006666666666666667
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json",
      0.0033333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json",
      0.0033333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json",
      0.0033333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
      0.06
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_005.prefab.json",
      0.06
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_009.prefab.json",
      0.06
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
      0.07333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json",
      0.07333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json",
      0.07333333333333333
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json",
      0.049999999999999996
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_005.prefab.json",
      0.049999999999999996
     ],
     [
      "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_009.prefab.json",
      0.049999999999999996
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Lush",
   "Plant_Bush_Winter_Sharp",
   "Plant_Bush_Winter_Snow",
   "Plant_Crop_Mushroom_Cap_Brown",
   "Plant_Crop_Mushroom_Common_Brown",
   "Plant_Flower_Common_Cyan2",
   "Plant_Flower_Common_Violet",
   "Plant_Flower_Common_White2",
   "Plant_Flower_Common_Yellow",
   "Plant_Flower_Flax_Blue",
   "Plant_Grass_Winter",
   "Plant_Grass_Winter_Tall",
   "Plant_Seeds_Pine",
   "Rock_Marble",
   "Rock_Shale",
   "Rubble_Shale",
   "Rubble_Shale_Medium",
   "Soil_Dirt_Cold",
   "Soil_Grass_Cold",
   "Soil_Pebbles_Frozen",
   "Soil_Snow"
  ],
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
  "bank": true,
  "chip": [
   "#2f4a86",
   "#c39b48"
  ],
  "site": {
   "ox": -38,
   "oz": 142,
   "S0": 138,
   "rim": "Soil_Grass_Cold"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier4/Tile.Wastes_Grasslands.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Grasslands_Trees_Forest.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_001.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_003.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_006.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_001.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_007.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_012.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_001.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_003.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_006.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_1/Burnt_Stage1_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_2/Burnt_Stage2_004.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_3/Burnt_Stage3_008.prefab.json",
      0.09999999999999999
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Grasslands_Trees_Plains.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_1/Sallow_Stage1_001.prefab.json",
      0.25
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_001.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_003.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_004.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_3/Sallow_Stage3_001.prefab.json",
      0.2
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Dead_Tall",
   "Plant_Bush_Dead_Twisted",
   "Plant_Crop_Wheat_Stage_4_Burnt",
   "Plant_Flower_Orchid_Orange",
   "Plant_Grass_Gnarled",
   "Plant_Grass_Gnarled_Short",
   "Plant_Grass_Gnarled_Tall",
   "Rock_Basalt",
   "Rubble_Basalt",
   "Rubble_Basalt_Medium",
   "Soil_Ash",
   "Soil_Dirt_Burnt",
   "Soil_Grass_Burnt"
  ],
  "water": {
   "kind": "river",
   "bed": "Soil_Sand_Ashen",
   "plants": [],
   "density": 0
  },
  "bank": true,
  "chip": [
   "#67352c",
   "#9b9b8e"
  ],
  "site": {
   "ox": -103,
   "oz": 880,
   "S0": 137,
   "rim": "Soil_Grass_Burnt"
  }
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
  "tile": "Server/World/Default/Zones/Zone4_Tier4/Tile.Wastes_Grasslands.json",
  "forest": [
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Grasslands_Trees_Forest.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_001.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_003.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_006.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_001.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_007.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_012.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_001.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_003.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_006.prefab.json",
      0.024999999999999998
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_1/Burnt_Stage1_001.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_2/Burnt_Stage2_004.prefab.json",
      0.09999999999999999
     ],
     [
      "Server/Prefabs/Orbis/Trees/Burnt/Stage_3/Burnt_Stage3_008.prefab.json",
      0.09999999999999999
     ]
    ]
   },
   {
    "pattern": "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Grasslands_Trees_Plains.json",
    "prefabs": [
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_1/Sallow_Stage1_001.prefab.json",
      0.25
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_001.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_003.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_004.prefab.json",
      0.18333333333333335
     ],
     [
      "Server/Prefabs/Orbis/Trees/Sallow/Stage_3/Sallow_Stage3_001.prefab.json",
      0.2
     ]
    ]
   }
  ],
  "layers": [
   "Plant_Bush_Dead_Tall",
   "Plant_Bush_Dead_Twisted",
   "Plant_Crop_Wheat_Stage_4_Burnt",
   "Plant_Flower_Orchid_Orange",
   "Plant_Grass_Gnarled",
   "Plant_Grass_Gnarled_Short",
   "Plant_Grass_Gnarled_Tall",
   "Rock_Basalt",
   "Rubble_Basalt",
   "Rubble_Basalt_Medium",
   "Soil_Ash",
   "Soil_Dirt_Burnt",
   "Soil_Grass_Burnt"
  ],
  "water": {
   "kind": "shore",
   "bed": "Soil_Sand_Ashen",
   "plants": [],
   "density": 0
  },
  "bank": true,
  "chip": [
   "#9ea8a8",
   "#9b9b8e"
  ],
  "site": {
   "ox": -103,
   "oz": 880,
   "S0": 137,
   "rim": "Soil_Grass_Burnt"
  }
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
 "Plant_Bush_Green": {
  "model": "Blocks/Foliage/Plants/Bush_Berry.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Berry_Texture.png"
  ]
 },
 "Plant_Crop_Mushroom_Cap_Brown": {
  "model": "Blocks/Foliage/Plants/Mushroom_Fox.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Fox_Brown.png"
  ]
 },
 "Plant_Crop_Mushroom_Cap_White": {
  "model": "Blocks/Foliage/Plants/Mushroom_Tall.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Tall_White.png"
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
 "Plant_Flower_Common_Yellow": {
  "model": "Blocks/Foliage/Flowers/Flower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Flower_Textures/Yellow.png"
  ]
 },
 "Plant_Flower_Flax_Blue": {
  "model": "Blocks/Foliage/Plants/Flax.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Flax_Textures/Blue.png"
  ]
 },
 "Plant_Flower_Tall_Purple": {
  "model": "Blocks/Foliage/Plants/Dense_Tall.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Dense_Tall_Textures/Lavender.png"
  ]
 },
 "Plant_Grass_Lush": {
  "model": "Blocks/Foliage/Plants/Cross_17px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_17px_Textures/Grassplant_Lush_GS.png"
  ],
  "tint": "#297430"
 },
 "Plant_Grass_Lush_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small.png"
  ],
  "tint": "#297430"
 },
 "Plant_Grass_Lush_Tall": {
  "model": "Blocks/Foliage/Grass/Bushy.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Bushy_Grassplant_Lush_Tall_GS.png"
  ],
  "tint": "#297430"
 },
 "Rock_Stone": {
  "cube": {
   "side": "BlockTextures/Rock_Stone.png",
   "top": [
    "BlockTextures/Rock_Stone.png",
    "BlockTextures/Rock_Stone_2.png",
    "BlockTextures/Rock_Stone_3.png"
   ],
   "bottom": "BlockTextures/Rock_Stone.png"
  }
 },
 "Rubble_Marble": {
  "model": "Blocks/Stone/Rubble_Small.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Marble.png"
  ]
 },
 "Rubble_Marble_Medium": {
  "model": "Blocks/Stone/Rubble_Medium.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Marble.png"
  ]
 },
 "Rubble_Stone": {
  "model": "Blocks/Stone/Rubble_Small.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Stone.png"
  ]
 },
 "Rubble_Stone_Medium": {
  "model": "Blocks/Stone/Rubble_Medium.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Stone.png"
  ]
 },
 "Soil_Grass_Sunny": {
  "cube": {
   "side": "BlockTextures/Soil_Grass_Sunny_Side.png",
   "top": "BlockTextures/Soil_Grass_Sunny.png",
   "bottom": "BlockTextures/Soil_Dirt.png"
  }
 },
 "Soil_Gravel": {
  "cube": {
   "side": "BlockTextures/Soil_Gravel.png",
   "top": "BlockTextures/Soil_Gravel.png",
   "bottom": "BlockTextures/Soil_Gravel.png"
  }
 },
 "Soil_Leaves": {
  "cube": {
   "side": "BlockTextures/Soil_Leaves_Side.png",
   "top": "BlockTextures/Soil_Leaves_Top_GS.png",
   "bottom": "BlockTextures/Soil_Dirt.png",
   "sideMask": "BlockTextures/Soil_Leaves_Side_GS.png"
  },
  "tintUp": true
 },
 "Soil_Pathway": {
  "cube": {
   "side": "BlockTextures/Soil_Pathway.png",
   "top": [
    "BlockTextures/Soil_Pathway.png",
    "BlockTextures/Soil_Pathway_02.png",
    "BlockTextures/Soil_Pathway_03.png"
   ],
   "bottom": "BlockTextures/Soil_Pathway.png"
  }
 },
 "Soil_Pebbles": {
  "cube": {
   "side": "BlockTextures/Soil_Pebbles.png",
   "top": "BlockTextures/Soil_Pebbles.png",
   "bottom": "BlockTextures/Soil_Pebbles.png"
  }
 },
 "Wood_Sticks": {
  "model": "Blocks/Farming/Stick_Pile.blockymodel",
  "tex": [
   "Blocks/Farming/Sticks_Pile_Texture.png"
  ]
 },
 "Wood_Oak_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
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
 "Plant_Leaves_Oak": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Oak.png"
  ]
 },
 "Wood_Oak_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Oak.png"
  ]
 },
 "Wood_Oak_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Oak_Side.png",
   "top": "BlockTextures/Wood_Trunk_Oak_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Oak_Full.png"
  }
 },
 "Wood_Oak_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Oak.png"
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
 "Wood_Beech_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Beech_Side.png",
   "top": "BlockTextures/Wood_Trunk_Beech_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Beech_Full.png"
  }
 },
 "Wood_Beech_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Beech.png"
  ]
 },
 "Plant_Leaves_Beech": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Beech.png"
  ]
 },
 "Plant_Leaves_Birch": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Birch.png"
  ]
 },
 "Wood_Birch_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
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
 "Wood_Birch_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Birch.png"
  ]
 },
 "Deco_Nest": {
  "model": "Blocks/Miscellaneous/Nest.blockymodel",
  "tex": [
   "Blocks/Miscellaneous/Nest_Texture.png"
  ]
 },
 "Prefab_Spawner_Block": {
  "model": "Items/Block_Spawner_Block.blockymodel",
  "tex": [
   "Items/Block_Spawner_Block_Texture.png"
  ]
 },
 "Plant_Grass_Sharp": {
  "model": "Blocks/Foliage/Grass/Dense_Small_3Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/default.png"
  ],
  "tint": "#67b62d"
 },
 "Plant_Grass_Sharp_Tall": {
  "model": "Blocks/Foliage/Grass/Dense_Tall_3Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_Tall_4Rows_Texture.png"
  ],
  "tint": "#67b62d"
 },
 "Rock_Marble": {
  "cube": {
   "side": "BlockTextures/Rock_Marble.png",
   "top": "BlockTextures/Rock_Marble.png",
   "bottom": "BlockTextures/Rock_Marble.png"
  }
 },
 "Plant_Bush": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Green.png"
  ]
 },
 "Plant_Crop_Health1": {
  "model": "Blocks/Foliage/Flowers/Health_T1_Blood_Rose/Blood_Rose.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Health_T1_Blood_Rose/Blood_Rose_Texture.png"
  ]
 },
 "Plant_Crop_Mushroom_Common_Brown": {
  "model": "Blocks/Foliage/Plants/Mushroom.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Textures/Brown.png"
  ]
 },
 "Plant_Flower_Common_Red2": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Red.png"
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
 "Soil_Gravel_Sand_White": {
  "cube": {
   "side": "BlockTextures/Soil_Sandstone_Gravel.png",
   "top": "BlockTextures/Soil_Sandstone_Gravel.png",
   "bottom": "BlockTextures/Soil_Sandstone_Gravel.png"
  }
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
 "Plant_Grass_Sharp_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Sharp_Short_GS.png"
  ],
  "tint": "#67b62d"
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
 "Wood_Birch_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Birch.png"
  ]
 },
 "Plant_Flower_Common_White2": {
  "model": "Blocks/Foliage/Plants/Cross.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Textures/Flower_White.png"
  ]
 },
 "Plant_Flower_Common_Yellow2": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Yellow.png"
  ]
 },
 "Plant_Grass_Sharp_Wild": {
  "model": "Blocks/Foliage/Grass/Dense_VeryTall_4Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_VeryTall_4Rows_Sharp.png"
  ],
  "tint": "#67b62d"
 },
 "Wood_Ash_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Ash.png"
  ]
 },
 "Wood_Ash_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Ash_Side.png",
   "top": "BlockTextures/Wood_Trunk_Ash_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Ash_Top.png"
  }
 },
 "Wood_Ash_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
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
 "Plant_Leaves_Ash": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Ash.png"
  ]
 },
 "Wood_Ash_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Ash.png"
  ]
 },
 "Plant_Fern_Winter": {
  "model": "Blocks/Foliage/Plants/Fern_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Big_Textures/GS.png"
  ],
  "tint": "#686868"
 },
 "Plant_Flower_Bushy_Green": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/default.png"
  ]
 },
 "Plant_Moss_Green": {
  "model": "Blocks/Foliage/Plants/Cross_Full.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Full_Textures/Moss_GS.png"
  ],
  "tint": "#84b338"
 },
 "Plant_Leaves_Aspen": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Aspen.png"
  ]
 },
 "Wood_Aspen_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Aspen.png"
  ]
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
 "Wood_Aspen_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Aspen.png"
  ]
 },
 "Wood_Aspen_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Aspen.png"
  ]
 },
 "Soil_Mud": {
  "cube": {
   "side": "BlockTextures/Soil_Mud.png",
   "top": "BlockTextures/Soil_Mud.png",
   "bottom": "BlockTextures/Soil_Mud.png"
  }
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
 "Plant_Bush_Dead_Tall": {
  "model": "Blocks/Foliage/Plants/Shrub.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Shrub_Winter.png"
  ]
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
 "Plant_Crop_Health2": {
  "model": "Blocks/Foliage/Plants/Health_T2_Blood_Cap/Blood_Cap.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Health_T2_Blood_Cap/Blood_Cap_Texture.png"
  ]
 },
 "Plant_Crop_Mushroom_Cap_Red": {
  "model": "Blocks/Foliage/Plants/Mushroom_Poison.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Poison_White.png"
  ]
 },
 "Plant_Crop_Mushroom_Glowing_Orange": {
  "model": "Blocks/Foliage/Plants/Mushroom_Balls.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Balls_default.png"
  ]
 },
 "Plant_Fern_Forest": {
  "model": "Blocks/Foliage/Plants/Fern_Small.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Small_GS.png"
  ],
  "tint": "#686868"
 },
 "Plant_Flower_Orchid_Poisoned": {
  "model": "Blocks/Foliage/Flowers/RareFlower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/RareFlower_Textures/Black.png"
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
 "Soil_Mud_Dry": {
  "cube": {
   "side": "BlockTextures/Soil_Mud_Dry.png",
   "top": "BlockTextures/Soil_Mud_Dry.png",
   "bottom": "BlockTextures/Soil_Mud_Dry.png"
  }
 },
 "Plant_Leaves_Autumn": {
  "model": "Blocks/Foliage/Leaves/DownShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/DownShape_Textures/Autumn.png"
  ]
 },
 "Wood_Maple_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/CrimsonMaple.png"
  ]
 },
 "Plant_Leaves_Maple": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/CrimsonMaple.png"
  ]
 },
 "Wood_Maple_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_CrimsonMaple_Side.png",
   "top": "BlockTextures/Wood_Trunk_CrimsonMaple_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_CrimsonMaple_Full.png"
  }
 },
 "Wood_Maple_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_CrimsonMaple_Side.png",
   "top": "BlockTextures/Wood_Trunk_CrimsonMaple_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_CrimsonMaple_Top.png"
  }
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
 "Plant_Crop_Mushroom_Shelve_Brown": {
  "model": "Blocks/Foliage/Plants/Mushroom_Medium.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Medium_Textures/Brown.png"
  ]
 },
 "Plant_Crop_Mushroom_Block_Brown": {
  "cube": {
   "side": "BlockTextures/Mushroom_Block_Brown.png",
   "top": "BlockTextures/Mushroom_Block_Top_Brown.png",
   "bottom": "BlockTextures/Mushroom_Block_Brown_Trunk_Top.png"
  }
 },
 "Plant_Crop_Mana3": {
  "model": "Blocks/Foliage/Water/Mana_T3_Azure_Kelp/Azure_Kelp.blockymodel",
  "tex": [
   "Blocks/Foliage/Water/Mana_T3_Azure_Kelp/Azure_Kelp_Texture.png"
  ]
 },
 "Plant_Crop_Mushroom_Common_Blue": {
  "model": "Blocks/Foliage/Plants/Mushroom.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Textures/Blue.png"
  ]
 },
 "Plant_Crop_Mushroom_Glowing_Blue": {
  "model": "Blocks/Foliage/Plants/Mushroom_Thin.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Thin_Textures/Blue.png"
  ]
 },
 "Plant_Crop_Mushroom_Glowing_Violet": {
  "model": "Blocks/Foliage/Plants/Mushroom_Thin.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Thin_Textures/Purple.png"
  ]
 },
 "Plant_Flower_Bushy_Blue": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/Blue.png"
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
 "Plant_Seaweed_Grass_Tall": {
  "model": "Blocks/Foliage/Grass/VeryTall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/VeryTall_Textures/Seaweed_Tall_GS.png"
  ],
  "tint": "#37ae8f"
 },
 "Rock_Crystal_Cyan_Medium": {
  "model": "Resources/Crystals/Crystal_Medium.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Blue.png"
  ]
 },
 "Rock_Crystal_Cyan_Small": {
  "model": "Resources/Crystals/Crystal_Small.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Blue.png"
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
 "Wood_Azure_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Azure.png"
  ]
 },
 "Plant_Fruit_Azure": {
  "model": "Resources/Ingredients/Azure_Fruit.blockymodel",
  "tex": [
   "Resources/Ingredients/Azure_Fruit_Texture.png"
  ]
 },
 "Plant_Leaves_Azure": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Azure.png"
  ]
 },
 "Wood_Azure_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Azure.png"
  ]
 },
 "Wood_Azure_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Azure_Side.png",
   "top": "BlockTextures/Wood_Trunk_Azure_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Azure_Full.png"
  }
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
 "Plant_Moss_Block_Green": {
  "cube": {
   "side": "BlockTextures/Moss_Block_GS.png",
   "top": "BlockTextures/Moss_Block_GS_Top.png",
   "bottom": "BlockTextures/Moss_Block_GS_Top.png"
  },
  "tint": "#84b338"
 },
 "Plant_Moss_Block_Yellow": {
  "cube": {
   "side": "BlockTextures/Moss_Block_GS_Top.png",
   "top": "BlockTextures/Moss_Block_GS.png",
   "bottom": "BlockTextures/Moss_Block_GS.png"
  },
  "tint": "#c0bb2e"
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
 "Plant_Moss_Yellow": {
  "model": "Blocks/Foliage/Plants/Cross_Full.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Full_Textures/Moss_GS.png"
  ],
  "tint": "#c0bb2e"
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
 "Plant_Moss_Cave_Green": {
  "model": "Blocks/Foliage/Plants/HangingMoss.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/HangingMoss_Textures/Moss_GS_01.png",
   "Blocks/Foliage/Plants/HangingMoss_Textures/Moss_GS_02.png"
  ],
  "tint": "#84b338"
 },
 "Plant_Crop_Mushroom_Flatcap_Green": {
  "model": "Blocks/Foliage/Plants/Mushroom_Flat.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Flat_White.png"
  ]
 },
 "Rubble_Stone_Mossy": {
  "model": "Blocks/Stone/Rubble_Small.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Stone_Mossy.png"
  ]
 },
 "Rubble_Stone_Mossy_Medium": {
  "model": "Blocks/Stone/Rubble_Medium.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Stone_Mossy.png"
  ]
 },
 "Soil_Clay": {
  "cube": {
   "side": "BlockTextures/Soil_Clay.png",
   "top": "BlockTextures/Soil_Clay.png",
   "bottom": "BlockTextures/Soil_Clay.png"
  }
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
 "Plant_Vine_Hanging": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Hanging_Lianas.png"
  ]
 },
 "Plant_Crop_Mushroom_Shelve_Green": {
  "model": "Blocks/Foliage/Plants/Mushroom_Medium.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Medium_Textures/Green.png"
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
 "Plant_Flower_Common_Blue": {
  "model": "Blocks/Foliage/Flowers/Flower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Flower_Textures/Blue.png"
  ]
 },
 "Plant_Flower_Common_Cyan": {
  "model": "Blocks/Foliage/Flowers/FlowerSmall.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/FlowerSmall_Textures/Arid_Cyan.png"
  ]
 },
 "Plant_Flower_Common_Poisoned": {
  "model": "Blocks/Foliage/Plants/Parched_Thorn.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Parched_Thorn_Texture.png"
  ]
 },
 "Plant_Flower_Common_Purple": {
  "model": "Blocks/Foliage/Flowers/FlowerSmall.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/FlowerSmall_Textures/Arid_Purple.png"
  ]
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
 "Plant_Grass_Dry_Tall": {
  "model": "Blocks/Foliage/Grass/VeryTall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/VeryTall_Textures/Savannah.png"
  ],
  "tint": "#e4c945"
 },
 "Rock_Sandstone": {
  "cube": {
   "side": "BlockTextures/Rock_Sandstone_Side.png",
   "top": "BlockTextures/Rock_Sandstone_Top.png",
   "bottom": "BlockTextures/Rock_Sandstone_Top.png"
  }
 },
 "Rubble_Sandstone": {
  "model": "Blocks/Stone/Rubble_Small.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Sandstone.png"
  ]
 },
 "Rubble_Sandstone_Medium": {
  "model": "Blocks/Stone/Rubble_Medium.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Sandstone.png"
  ]
 },
 "Soil_Dirt_Dry": {
  "cube": {
   "side": "BlockTextures/Soil_Dirt_Dry.png",
   "top": "BlockTextures/Soil_Dirt_Dry.png",
   "bottom": "BlockTextures/Soil_Dirt_Dry.png"
  }
 },
 "Soil_Gravel_Sand": {
  "cube": {
   "side": "BlockTextures/Soil_Gravel_Sand.png",
   "top": "BlockTextures/Soil_Gravel_Sand.png",
   "bottom": "BlockTextures/Soil_Gravel_Sand.png"
  }
 },
 "Wood_Gumboab_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Gumboab_Side.png",
   "top": "BlockTextures/Wood_Trunk_Gumboab_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Gumboab_Full.png"
  }
 },
 "Wood_Gumboab_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Gumboab.png"
  ]
 },
 "Wood_Gumboab_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Gumboab.png"
  ]
 },
 "Wood_Gumboab_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Gumboab_Side.png",
   "top": "BlockTextures/Wood_Trunk_Gumboab_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Gumboab_Top.png"
  }
 },
 "Plant_Leaves_Bottle": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Bottle.png"
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
 "Plant_Leaves_Dry": {
  "model": "Blocks/Foliage/Leaves/DownShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/DownShape_Textures/Dry.png"
  ]
 },
 "Wood_Dry_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Dry.png"
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
 "Wood_Dry_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Dry.png"
  ]
 },
 "Plant_Vine_Wall_Dry": {
  "model": "Blocks/Foliage/Plants/Vine.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Vine_Dry.png"
  ]
 },
 "Wood_Gumboab_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Gumboab.png"
  ]
 },
 "Plant_Flower_Common_White": {
  "model": "Blocks/Foliage/Flowers/Hydrangea.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Hydrangea_White.png"
  ]
 },
 "Wood_Bottletree_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Bottle_Side.png",
   "top": "BlockTextures/Wood_Trunk_Bottle_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Bottle_Top.png"
  }
 },
 "Wood_Bottletree_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Bottle.png"
  ]
 },
 "Wood_Bottletree_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Bottle_Side.png",
   "top": "BlockTextures/Wood_Trunk_Bottle_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Bottle_Full.png"
  }
 },
 "Wood_Bottletree_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Bottle.png"
  ]
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
 "Rock_Sandstone_White": {
  "cube": {
   "side": "BlockTextures/Rock_Sandstone_White_Side.png",
   "top": "BlockTextures/Rock_Sandstone_White_Top.png",
   "bottom": "BlockTextures/Rock_Sandstone_White_Top.png"
  }
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
 "Plant_Cactus_Flower": {
  "model": "Blocks/Foliage/Flowers/Cactus.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Cactus_Texture.png"
  ]
 },
 "Plant_Cactus_Flat_2": {
  "model": "Blocks/Foliage/Plants/CactusFlat2.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/CactusFlat1_Texture.png"
  ]
 },
 "Plant_Cactus_Flat_3": {
  "model": "Blocks/Foliage/Plants/CactusFlat3.blockymodel",
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
 "Soil_Gravel_Sand_Red": {
  "cube": {
   "side": "BlockTextures/Soil_Gravel_Sand_Red.png",
   "top": "BlockTextures/Soil_Gravel_Sand_Red.png",
   "bottom": "BlockTextures/Soil_Gravel_Sand_Red.png"
  }
 },
 "Wood_Dry_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Dry.png"
  ]
 },
 "Soil_Sand_White": {
  "cube": {
   "side": "BlockTextures/Soil_Sand_White.png",
   "top": "BlockTextures/Soil_Sand_White.png",
   "bottom": "BlockTextures/Soil_Sand_White.png"
  }
 },
 "Plant_Leaves_Bramble": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Gramble.png"
  ]
 },
 "Rubble_Sandstone_White": {
  "model": "Blocks/Stone/Rubble_Small.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Sandstone_White.png"
  ]
 },
 "Rubble_Sandstone_White_Medium": {
  "model": "Blocks/Stone/Rubble_Medium.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Sandstone_White.png"
  ]
 },
 "Plant_Fruit_Coconut": {
  "model": "Resources/Ingredients/Coconut.blockymodel",
  "tex": [
   "Resources/Ingredients/Coconut_Texture.png"
  ]
 },
 "Wood_Palm_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Palm.png"
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
 "Rubble_Sandstone_Red": {
  "model": "Blocks/Stone/Rubble_Small.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Sandstone_Red.png"
  ]
 },
 "Plant_Flower_Bushy_Red": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/Red.png"
  ]
 },
 "Plant_Flower_Common_Grey2": {
  "model": "Blocks/Foliage/Plants/Rocky_Flower.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Rocky_Flower_Texture.png"
  ]
 },
 "Wood_Palo_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Palo.png",
   "top": "BlockTextures/Wood_Trunk_Palo_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Palo_Top.png"
  }
 },
 "Wood_Palo_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Palo.png",
   "top": "BlockTextures/Wood_Trunk_Palo_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Palo_Full.png"
  }
 },
 "Wood_Palo_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Palo.png"
  ]
 },
 "Plant_Leaves_Palo": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Palo.png"
  ]
 },
 "Plant_Bush_Arid_Sharp": {
  "model": "Blocks/Foliage/Plants/Fern_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Big_Textures/Grass_Dry.png"
  ]
 },
 "Wood_Petrified_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Petrified_Side.png",
   "top": "BlockTextures/Wood_Trunk_Petrified_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Petrified_Full.png"
  }
 },
 "Plant_Crop_Mushroom_Block_Yellow": {
  "cube": {
   "side": "BlockTextures/Mushroom_Block_Yellow.png",
   "top": "BlockTextures/Mushroom_Block_Top_Yellow.png",
   "bottom": "BlockTextures/Mushroom_Block_Top_Yellow.png"
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
 "Plant_Bush_Winter_Sharp": {
  "model": "Blocks/Foliage/Plants/Fern_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Big_Textures/Winter.png"
  ]
 },
 "Plant_Bush_Winter_Snow": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Snow.png"
  ]
 },
 "Plant_Grass_Winter": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Grass_Winter.png"
  ],
  "tint": "#2db668"
 },
 "Plant_Grass_Winter_Tall": {
  "model": "Blocks/Foliage/Grass/Tall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Tall_Textures/Winter.png"
  ],
  "tint": "#2db668"
 },
 "Plant_Seeds_Pine": {
  "model": "Resources/Ingredients/Cone.blockymodel",
  "tex": [
   "Resources/Ingredients/Cone_Texture.png"
  ]
 },
 "Rock_Shale": {
  "cube": {
   "side": "BlockTextures/Rock_Shale.png",
   "top": "BlockTextures/Rock_Shale.png",
   "bottom": "BlockTextures/Rock_Shale.png"
  }
 },
 "Rubble_Shale": {
  "model": "Blocks/Stone/Rubble_Small.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Shale.png"
  ]
 },
 "Rubble_Shale_Medium": {
  "model": "Blocks/Stone/Rubble_Medium.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Shale.png"
  ]
 },
 "Soil_Pebbles_Frozen": {
  "cube": {
   "side": "BlockTextures/Soil_Pebbles_Cold.png",
   "top": "BlockTextures/Soil_Pebbles_Cold.png",
   "bottom": "BlockTextures/Soil_Pebbles_Cold.png"
  }
 },
 "Soil_Snow": {
  "cube": {
   "side": "BlockTextures/Soil_Snow.png",
   "top": "BlockTextures/Soil_Snow.png",
   "bottom": "BlockTextures/Soil_Snow.png"
  }
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
 "Wood_Fir_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
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
 "Wood_Fir_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Spruce.png"
  ]
 },
 "Wood_Fir_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Spruce.png"
  ]
 },
 "Wood_Fir_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Spruce.png"
  ]
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
 "Rubble_Basalt": {
  "model": "Blocks/Stone/Rubble_Small.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Basalt.png"
  ]
 },
 "Rubble_Basalt_Medium": {
  "model": "Blocks/Stone/Rubble_Medium.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Basalt.png"
  ]
 },
 "Plant_Leaves_Redwood": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Redwood.png"
  ]
 },
 "Wood_Redwood_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_RedWood.png",
   "top": "BlockTextures/Wood_Trunk_RedWood_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_RedWood_Full.png"
  }
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
 "Wood_Cedar_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Cedar.png"
  ]
 },
 "Wood_Cedar_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Cedar.png"
  ]
 },
 "Wood_Cedar_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Cedar.png",
   "top": "BlockTextures/Wood_Trunk_Cedar_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Cedar_Top.png"
  }
 },
 "Plant_Leaves_Cedar": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar.png",
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar2.png"
  ]
 },
 "Wood_Cedar_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Cedar.png"
  ]
 },
 "Wood_Cedar_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Cedar.png",
   "top": "BlockTextures/Wood_Trunk_Cedar_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Cedar_Full.png"
  }
 },
 "Plant_Crop_Mushroom_Cap_Green": {
  "model": "Blocks/Foliage/Plants/Mushroom_Fox.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Fox_Green.png"
  ]
 },
 "Soil_Gravel_Mossy": {
  "cube": {
   "side": "BlockTextures/Soil_Gravel_Mossy.png",
   "top": "BlockTextures/Soil_Gravel_Mossy.png",
   "bottom": "BlockTextures/Soil_Gravel_Mossy.png"
  }
 },
 "Plant_Leaves_Dead": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Dead.png"
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
 "Plant_Bush_Winter_Red": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Red.png"
  ]
 },
 "Plant_Flower_Common_Orange": {
  "model": "Blocks/Foliage/Flowers/Chrysanthemum.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Chrysanthemum_Texture.png"
  ]
 },
 "Plant_Grass_Cave_Short": {
  "model": "Blocks/Foliage/Plants/Cross.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Textures/Cave_Short.png"
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
 "Plant_Coral_Model_Blue": {
  "model": "Blocks/Foliage/Water/Coral_Sponge_Blue.blockymodel",
  "tex": [
   "Blocks/Foliage/Water/Coral_Sponge_Blue_Texture.png"
  ]
 },
 "Plant_Coral_Model_Cyan": {
  "model": "Blocks/Foliage/Water/Coral_Sponge_Cyan.blockymodel",
  "tex": [
   "Blocks/Foliage/Water/Coral_Sponge_Cyan_Texture.png"
  ]
 },
 "Plant_Crop_Mana2": {
  "model": "Blocks/Foliage/Plants/Mana_T2_Azure_Cap/Azure_Cap.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mana_T2_Azure_Cap/Azure_Cap_Texture.png"
  ]
 },
 "Plant_Seaweed_Grass": {
  "model": "Blocks/Foliage/Grass/Dense_Small_4Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/Seaweeds_GS.png"
  ],
  "tint": "#37ae8f"
 },
 "Plant_Seaweed_Grass_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Seaweed_Shot_GS.png"
  ],
  "tint": "#37ae8f"
 },
 "Plant_Seaweed_Winter_Blue": {
  "model": "Blocks/Foliage/Grass/VeryTall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/VeryTall_Textures/Winter_Unique2.png"
  ]
 },
 "Plant_Seaweed_Winter_Short": {
  "model": "Blocks/Foliage/Plants/Cross.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Textures/Seaweed_Winter_Small.png"
  ]
 },
 "Plant_Flower_Bushy_White": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/White.png"
  ]
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
 "Plant_Grass_Winter_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grassplant_Winter_Short_GS.png"
  ],
  "tint": "#2db668"
 },
 "Rock_Crystal_Blue_Medium": {
  "model": "Resources/Crystals/Crystal_Medium.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Water.png"
  ]
 },
 "Rock_Crystal_Blue_Small": {
  "model": "Resources/Crystals/Crystal_Small.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Water.png"
  ]
 },
 "Rubble_Ice": {
  "model": "Blocks/Stone/Rubble_Small.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Ice.png"
  ]
 },
 "Rubble_Ice_Medium": {
  "model": "Blocks/Stone/Rubble_Medium.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Ice.png"
  ]
 },
 "Plant_Leaves_Fir_Tip_Snow": {
  "model": "Blocks/Foliage/Leaves/PineShape_Tip.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine_Snowy.png"
  ]
 },
 "Plant_Leaves_Fir_Snow": {
  "model": "Blocks/Foliage/Leaves/PineShape_NSEW.blockymodel",
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
 "Ingredient_Charcoal": {
  "model": "Blocks/Stone/Rubble_Charcoal.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Charcoal.png"
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
 "Plant_Bush_Jungle": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Jungle_Green.png"
  ]
 },
 "Plant_Flower_Bushy_Cyan": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/Cyan.png"
  ]
 },
 "Plant_Flower_Bushy_Grey": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/Ash.png"
  ]
 },
 "Plant_Flower_Common_Pink": {
  "model": "Blocks/Foliage/Flowers/Jungle_Pink_Giant.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Jungle_Pink_Giant_Jungle.png"
  ]
 },
 "Plant_Flower_Tall_Cyan2": {
  "model": "Blocks/Foliage/Flowers/Jungle_Cyan_Giant.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Jungle_Cyan_Giant_Jungle.png"
  ]
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
 "Plant_Grass_Jungle_Tall": {
  "model": "Blocks/Foliage/Grass/Dense_Tall_Jungle.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_Tall_Jungle_default.png"
  ],
  "tint": "#5ca12d"
 },
 "Plant_Leaves_Jungle_Floor": {
  "model": "Blocks/Foliage/Plants/Leaves_Floor.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Leaves_Floor_Textures/Jungle.png"
  ]
 },
 "Rock_Crystal_Red_Medium": {
  "model": "Resources/Crystals/Crystal_Medium.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Red.png"
  ]
 },
 "Rock_Crystal_Red_Small": {
  "model": "Resources/Crystals/Crystal_Small.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Red.png"
  ]
 },
 "Rock_Crystal_Yellow_Medium": {
  "model": "Resources/Crystals/Crystal_Medium.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Yellow.png"
  ]
 },
 "Rock_Crystal_Yellow_Small": {
  "model": "Resources/Crystals/Crystal_Small.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Yellow.png"
  ]
 },
 "Rock_Slate": {
  "cube": {
   "side": "BlockTextures/Rock_Slate_Side.png",
   "top": "BlockTextures/Rock_Slate.png",
   "bottom": "BlockTextures/Rock_Slate.png"
  }
 },
 "Rubble_Slate": {
  "model": "Blocks/Stone/Rubble_Small_02.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Slate.png"
  ]
 },
 "Rubble_Slate_Medium": {
  "model": "Blocks/Stone/Rubble_Medium_02.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Slate.png"
  ]
 },
 "Wood_Camphor_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Camphor.png",
   "top": "BlockTextures/Wood_Trunk_Camphor_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Camphor_Top.png"
  }
 },
 "Wood_Camphor_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Camphor.png"
  ]
 },
 "Wood_Camphor_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Camphor.png"
  ]
 },
 "Wood_Camphor_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Camphor.png",
   "top": "BlockTextures/Wood_Trunk_Camphor_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Camphor_Full.png"
  }
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
 "Plant_Flower_Common_Orange2": {
  "model": "Blocks/Foliage/Flowers/Jungle_Orange.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Jungle_Orange_default.png"
  ]
 },
 "Wood_Bamboo_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Bamboo.png",
   "top": "BlockTextures/Wood_Trunk_Bamboo_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Bamboo_Top.png"
  }
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
 "Wood_Petrified_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Petrified_Side.png",
   "top": "BlockTextures/Wood_Trunk_Petrified_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Petrified_Top.png"
  }
 },
 "Plant_Leaves_Petrified": {
  "model": "Blocks/Foliage/Leaves/PineShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_Textures/Petrified.png"
  ]
 },
 "Wood_Petrified_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Petrified.png"
  ]
 },
 "Wood_Petrified_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Petrified.png"
  ]
 },
 "Plant_Leaves_Burnt": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Burnt.png"
  ]
 },
 "Wood_Burnt_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Burnt.png",
   "top": "BlockTextures/Wood_Trunk_Burnt_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Burnt_Top.png"
  }
 },
 "Wood_Petrified_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Petrified.png"
  ]
 },
 "Wood_Poisoned_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Poison.png"
  ]
 },
 "Wood_Burnt_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Burnt.png"
  ]
 },
 "Wood_Burnt_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Burnt.png"
  ]
 },
 "Wood_Burnt_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Burnt.png"
  ]
 },
 "Soil_Dirt_Poisoned": {
  "cube": {
   "side": "BlockTextures/Soil_Dirt_Poisonned.png",
   "top": "BlockTextures/Soil_Dirt_Poisonned.png",
   "bottom": "BlockTextures/Soil_Dirt_Poisonned.png"
  }
 },
 "Plant_Crop_Mushroom_Glowing_Red": {
  "model": "Blocks/Foliage/Plants/Mushroom_Thin.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Thin_Textures/Yellow.png"
  ]
 },
 "Plant_Flower_Bushy_Poisoned": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/Poisoned.png"
  ]
 },
 "Plant_Reeds_Poison": {
  "model": "Blocks/Foliage/Plants/Reeds.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Reeds_Textures/Reeds_Poison.png"
  ]
 },
 "Plant_Reeds_Water": {
  "model": "Blocks/Foliage/Grass/VeryTall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/VeryTall_Textures/Water_GS.png"
  ],
  "tint": "#698a38"
 },
 "Plant_Bramble_Moss_Twisted": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Brambles_Green.png"
  ]
 },
 "Plant_Moss_Block_Green_Dark": {
  "cube": {
   "side": "BlockTextures/Moss_Block_GS.png",
   "top": "BlockTextures/Moss_Block_GS_Top.png",
   "bottom": "BlockTextures/Moss_Block_GS_Top.png"
  },
  "tint": "#75883c"
 },
 "Rock_Crystal_Green_Medium": {
  "model": "Resources/Crystals/Crystal_Medium.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Green.png"
  ]
 },
 "Rock_Crystal_Green_Small": {
  "model": "Resources/Crystals/Crystal_Small.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Green.png"
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
 "Plant_Crop_Wheat_Stage_4_Burnt": {
  "model": "Blocks/Foliage/Plants/Dense_Tall.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Dense_Tall_Textures/Wheat_Burn.png"
  ]
 },
 "Plant_Flower_Orchid_Orange": {
  "model": "Blocks/Foliage/Flowers/RareFlower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/RareFlower_Textures/Orange.png"
  ]
 },
 "Wood_Sallow_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_trunk_Sallow_Side.png",
   "top": "BlockTextures/Wood_trunk_Sallow_Top.png",
   "bottom": "BlockTextures/Wood_trunk_Sallow_Top.png"
  }
 },
 "Wood_Sallow_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Sallow.png"
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
 "Wood_Burnt_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Burnt.png",
   "top": "BlockTextures/Wood_Trunk_Burnt_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Burnt_Full.png"
  }
 },
 "Wood_Burnt_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Burnt.png"
  ]
 },
 "Wood_Sallow_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Sallow.png"
  ]
 },
 "Plant_Bush_Crystal": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Crystal_Red.png"
  ]
 },
 "Plant_Flower_Tall_Pink": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Arid_Magnolia.png"
  ]
 },
 "Plant_Flower_Tall_Red": {
  "model": "Blocks/Foliage/Flowers/Giant_Raflesia_Jungle/Raflesia.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Giant_Raflesia_Jungle/Raflesia_Texture.png"
  ]
 },
 "Rock_Crystal_Red_Large": {
  "model": "Resources/Crystals/Crystal_Big.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Red.png"
  ]
 },
 "Rock_Crystal_Yellow_Large": {
  "model": "Resources/Crystals/Crystal_Big.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Yellow.png"
  ]
 },
 "Rock_Crystal_Green_Large": {
  "model": "Resources/Crystals/Crystal_Big.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Green.png"
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
 "Rock_Crystal_Pink_Large": {
  "model": "Resources/Crystals/Crystal_Big.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Pink.png"
  ]
 },
 "Plant_Flower_Common_Poisoned2": {
  "model": "Blocks/Foliage/Flowers/Jungle_Orange.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Jungle_Orange_Pink.png"
  ]
 },
 "Plant_Leaves_Crystal": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Crystal.png"
  ]
 },
 "Wood_Crystal_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Crystal.png",
   "top": "BlockTextures/Wood_Trunk_Crystal_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Crystal_Full.png"
  }
 },
 "Wood_Crystal_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Crystal.png"
  ]
 },
 "Wood_Crystal_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Crystal.png"
  ]
 },
 "Rock_Crystal_Pink_Small": {
  "model": "Resources/Crystals/Crystal_Small.blockymodel",
  "tex": [
   "Resources/Crystals/Crystal_Big_Textures/Pink.png"
  ]
 },
 "Wood_Crystal_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Crystal.png"
  ]
 },
 "Rock_Crystal_Pink_Block": {
  "cube": {
   "side": "BlockTextures/Rock_Crystal_Pink.png",
   "top": "BlockTextures/Rock_Crystal_Pink_Top.png",
   "bottom": "BlockTextures/Rock_Crystal_Pink_Top.png"
  }
 },
 "Plant_Fruit_Pinkberry": {
  "model": "Resources/Ingredients/Pink_Fruit.blockymodel",
  "tex": [
   "Resources/Ingredients/Pink_Fruit_Texture.png"
  ]
 },
 "Wood_Crystal_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
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
 "Deco_Fire": {
  "model": "Items/Projectiles/Projectile.blockymodel",
  "tex": [
   "Items/Projectiles/Tornado_Texture.png"
  ]
 },
 "Plant_Bramble_Dead_Lavathorn": {
  "model": "Blocks/Foliage/Plants/Alien.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Alien_Textures/Blue.png"
  ]
 },
 "Plant_Flower_Bushy_Orange": {
  "model": "Blocks/Foliage/Plants/Jungle_Bush_Giant.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Jungle_Bush_Giant_Jungle.png"
  ]
 },
 "Rock_Volcanic_Cracked_Lava": {
  "model": "Blocks/Structures/Base_Shapes/Cube_Overlay.blockymodel",
  "tex": [
   "Blocks/Structures/Base_Shapes/Lava_Cracks.png"
  ]
 },
 "Rubble_Volcanic": {
  "model": "Blocks/Stone/Rubble_Small.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Volcanic.png"
  ]
 },
 "Rubble_Volcanic_Medium": {
  "model": "Blocks/Stone/Rubble_Medium.blockymodel",
  "tex": [
   "Items/Rubble/Rubble_Textures/Volcanic.png"
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
 "Wood_Fire_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Fire.png"
  ]
 },
 "Wood_Fire_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Fire.png"
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
 "Plant_Leaves_Fig_Blue": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Fig_Blue.png"
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
 "Wood_Fig_Blue_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Fig_Blue_Side.png",
   "top": "BlockTextures/Wood_Trunk_Fig_Blue_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Fig_Blue_Top.png"
  }
 },
 "Wood_Fig_Blue_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Fig_Blue.png"
  ]
 },
 "Wood_Banyan_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_trunk_Banyan_Side.png",
   "top": "BlockTextures/Wood_trunk_Banyan_Full.png",
   "bottom": "BlockTextures/Wood_trunk_Banyan_Full.png"
  }
 },
 "Wood_Banyan_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Banyan.png"
  ]
 },
 "Wood_Banyan_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Banyan.png"
  ]
 },
 "Wood_Banyan_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_trunk_Banyan_Side.png",
   "top": "BlockTextures/Wood_trunk_Banyan_Top.png",
   "bottom": "BlockTextures/Wood_trunk_Banyan_Top.png"
  }
 },
 "Wood_Banyan_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Banyan.png"
  ]
 },
 "Plant_Leaves_Banyan": {
  "model": "Blocks/Foliage/Leaves/DownShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/DownShape_Textures/Banyan.png"
  ]
 },
 "Plant_Crop_Mushroom_Block_Red": {
  "cube": {
   "side": "BlockTextures/Plant_Mushroom_Block_Red_Top.png",
   "top": [
    "BlockTextures/Plant_Mushroom_Block_Red_Top.png",
    "BlockTextures/Plant_Mushroom_Block_Red_Top_2.png",
    "BlockTextures/Plant_Mushroom_Block_Red_Top_3.png"
   ],
   "bottom": "BlockTextures/Plant_Mushroom_Block_Red_Bot.png"
  }
 },
 "Plant_Fruit_Mango": {
  "model": "Resources/Ingredients/Mango_Magic.blockymodel",
  "tex": [
   "Resources/Ingredients/Mango_Magic_Red.png"
  ]
 },
 "Plant_Leaves_Jungle": {
  "model": "Blocks/Foliage/Leaves/Tropical.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Tropical_Wide.png"
  ]
 },
 "Wood_Jungle_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Jungle.png"
  ]
 },
 "Wood_Jungle_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Jungle_Side.png",
   "top": "BlockTextures/Wood_Trunk_Jungle_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Jungle_Full.png"
  }
 },
 "Wood_Jungle_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Jungle.png"
  ]
 },
 "Wood_Jungle_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Jungle_Side.png",
   "top": "BlockTextures/Wood_Trunk_Jungle_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Jungle_Top.png"
  }
 },
 "Wood_Jungle_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Jungle.png"
  ]
 },
 "Deco_Spider_Cocoon": {
  "model": "Blocks/Dungeons/Spider_Cocoon.blockymodel",
  "tex": [
   "Blocks/Dungeons/Spider_Cocoon_Texture.png"
  ]
 },
 "Deco_SpiderWeb_Full": {
  "model": "Blocks/Dungeons/SpiderWeb_Full.blockymodel",
  "tex": [
   "Blocks/Dungeons/SpiderWeb_Texture.png"
  ]
 },
 "Deco_SpiderWeb": {
  "model": "Blocks/Dungeons/SpiderWeb.blockymodel",
  "tex": [
   "Blocks/Dungeons/SpiderWeb_Texture.png"
  ]
 },
 "Soil_Sand_Ashen": {
  "cube": {
   "side": "BlockTextures/Soil_Sand_Ashen.png",
   "top": "BlockTextures/Soil_Sand_Ashen.png",
   "bottom": "BlockTextures/Soil_Sand_Ashen.png"
  }
 },
 "Plant_Crop_Mushroom_Glowing_Green": {
  "model": "Blocks/Foliage/Plants/Mushroom_Thin.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Thin_Textures/Green.png"
  ]
 },
 "Plant_Flower_Tall_Cyan": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Jungle_Blue.png"
  ]
 },
 "Rock_Magma_Cooled": {
  "cube": {
   "side": "BlockTextures/Rock_Magma_Cooled_Side.png",
   "top": "BlockTextures/Rock_Magma_Cooled.png",
   "bottom": "BlockTextures/Rock_Magma_Cooled.png"
  }
 },
 "Plant_Moss_Block_Blue": {
  "cube": {
   "side": "BlockTextures/Moss_Block_GS.png",
   "top": "BlockTextures/Moss_Block_GS_Top.png",
   "bottom": "BlockTextures/Moss_Block_GS_Top.png"
  },
  "tint": "#159a6a"
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
export const SCENE_FILES = ["Common/BlockTextures/Chalk.png", "Common/BlockTextures/Clay_Orange.png", "Common/BlockTextures/Clay_Smooth_Black.png", "Common/BlockTextures/Moss_Block_GS.png", "Common/BlockTextures/Moss_Block_GS_Top.png", "Common/BlockTextures/Mushroom_Block_Brown.png", "Common/BlockTextures/Mushroom_Block_Brown_Trunk_Top.png", "Common/BlockTextures/Mushroom_Block_Green.png", "Common/BlockTextures/Mushroom_Block_Green_Trunk_Top.png", "Common/BlockTextures/Mushroom_Block_Top_Brown.png", "Common/BlockTextures/Mushroom_Block_Top_Green.png", "Common/BlockTextures/Mushroom_Block_Top_Yellow.png", "Common/BlockTextures/Mushroom_Block_Yellow.png", "Common/BlockTextures/Plant_Mushroom_Block_Red_Bot.png", "Common/BlockTextures/Plant_Mushroom_Block_Red_Top.png", "Common/BlockTextures/Plant_Mushroom_Block_Red_Top_2.png", "Common/BlockTextures/Plant_Mushroom_Block_Red_Top_3.png", "Common/BlockTextures/Rock_Basalt.png", "Common/BlockTextures/Rock_Crystal_Green.png", "Common/BlockTextures/Rock_Crystal_Green_Top.png", "Common/BlockTextures/Rock_Crystal_Pink.png", "Common/BlockTextures/Rock_Crystal_Pink_Top.png", "Common/BlockTextures/Rock_Crystal_Yellow.png", "Common/BlockTextures/Rock_Crystal_Yellow_Top.png", "Common/BlockTextures/Rock_Ice.png", "Common/BlockTextures/Rock_Ice_Blue.png", "Common/BlockTextures/Rock_Magma_Cooled.png", "Common/BlockTextures/Rock_Magma_Cooled_Side.png", "Common/BlockTextures/Rock_Marble.png", "Common/BlockTextures/Rock_Sandstone_Red.png", "Common/BlockTextures/Rock_Sandstone_Red_Top.png", "Common/BlockTextures/Rock_Sandstone_Side.png", "Common/BlockTextures/Rock_Sandstone_Top.png", "Common/BlockTextures/Rock_Sandstone_White_Side.png", "Common/BlockTextures/Rock_Sandstone_White_Top.png", "Common/BlockTextures/Rock_Shale.png", "Common/BlockTextures/Rock_Slate.png", "Common/BlockTextures/Rock_Slate_Side.png", "Common/BlockTextures/Rock_Stone.png", "Common/BlockTextures/Rock_Stone_2.png", "Common/BlockTextures/Rock_Stone_3.png", "Common/BlockTextures/Rock_Volcanic.png", "Common/BlockTextures/Soil_Ashes.png", "Common/BlockTextures/Soil_Clay.png", "Common/BlockTextures/Soil_Dirt.png", "Common/BlockTextures/Soil_Dirt_Burnt.png", "Common/BlockTextures/Soil_Dirt_Cold.png", "Common/BlockTextures/Soil_Dirt_Dry.png", "Common/BlockTextures/Soil_Dirt_Lush.png", "Common/BlockTextures/Soil_Dirt_Poisonned.png", "Common/BlockTextures/Soil_Grass_Burnt_Side.png", "Common/BlockTextures/Soil_Grass_Burnt_Side_GS.png", "Common/BlockTextures/Soil_Grass_Burnt_Top_GS.png", "Common/BlockTextures/Soil_Grass_Cold_Side.png", "Common/BlockTextures/Soil_Grass_Cold_Side_GS.png", "Common/BlockTextures/Soil_Grass_Cold_Top.png", "Common/BlockTextures/Soil_Grass_Dry_Side.png", "Common/BlockTextures/Soil_Grass_Dry_Side_GS.png", "Common/BlockTextures/Soil_Grass_Dry_Top_GS.png", "Common/BlockTextures/Soil_Grass_GS.png", "Common/BlockTextures/Soil_Grass_GS_02.png", "Common/BlockTextures/Soil_Grass_Lush_GS.png", "Common/BlockTextures/Soil_Grass_Lush_Side.png", "Common/BlockTextures/Soil_Grass_Lush_Top_GS.png", "Common/BlockTextures/Soil_Grass_Side.png", "Common/BlockTextures/Soil_Grass_Side_Full_GS.png", "Common/BlockTextures/Soil_Grass_Sunny.png", "Common/BlockTextures/Soil_Grass_Sunny_Side.png", "Common/BlockTextures/Soil_Gravel.png", "Common/BlockTextures/Soil_Gravel_Mossy.png", "Common/BlockTextures/Soil_Gravel_Sand.png", "Common/BlockTextures/Soil_Gravel_Sand_Red.png", "Common/BlockTextures/Soil_Leaves_Side.png", "Common/BlockTextures/Soil_Leaves_Side_GS.png", "Common/BlockTextures/Soil_Leaves_Top_GS.png", "Common/BlockTextures/Soil_Mud.png", "Common/BlockTextures/Soil_Mud_Dry.png", "Common/BlockTextures/Soil_Needles.png", "Common/BlockTextures/Soil_Pathway.png", "Common/BlockTextures/Soil_Pathway_02.png", "Common/BlockTextures/Soil_Pathway_03.png", "Common/BlockTextures/Soil_Pebbles.png", "Common/BlockTextures/Soil_Pebbles_Cold.png", "Common/BlockTextures/Soil_Sand.png", "Common/BlockTextures/Soil_Sand_Ashen.png", "Common/BlockTextures/Soil_Sand_Red.png", "Common/BlockTextures/Soil_Sand_White.png", "Common/BlockTextures/Soil_Sandstone_Gravel.png", "Common/BlockTextures/Soil_Snow.png", "Common/BlockTextures/Soil_grass_Side_Mask_GS.png", "Common/BlockTextures/Wood_Fir_Trunk_Full.png", "Common/BlockTextures/Wood_Fir_Trunk_Side.png", "Common/BlockTextures/Wood_Fir_Trunk_Top.png", "Common/BlockTextures/Wood_Softwood_Planks_02.png", "Common/BlockTextures/Wood_Softwood_Planks_03.png", "Common/BlockTextures/Wood_Softwood_Planks_Side.png", "Common/BlockTextures/Wood_Softwood_Planks_Top.png", "Common/BlockTextures/Wood_Trunk_Ash_Full.png", "Common/BlockTextures/Wood_Trunk_Ash_Side.png", "Common/BlockTextures/Wood_Trunk_Ash_Top.png", "Common/BlockTextures/Wood_Trunk_Aspen_Full.png", "Common/BlockTextures/Wood_Trunk_Aspen_Side.png", "Common/BlockTextures/Wood_Trunk_Aspen_Top.png", "Common/BlockTextures/Wood_Trunk_Azure_Full.png", "Common/BlockTextures/Wood_Trunk_Azure_Side.png", "Common/BlockTextures/Wood_Trunk_Azure_Top.png", "Common/BlockTextures/Wood_Trunk_Bamboo.png", "Common/BlockTextures/Wood_Trunk_Bamboo_Top.png", "Common/BlockTextures/Wood_Trunk_Beech_Full.png", "Common/BlockTextures/Wood_Trunk_Beech_Side.png", "Common/BlockTextures/Wood_Trunk_Beech_Top.png", "Common/BlockTextures/Wood_Trunk_Birch_Full.png", "Common/BlockTextures/Wood_Trunk_Birch_Side.png", "Common/BlockTextures/Wood_Trunk_Birch_Top.png", "Common/BlockTextures/Wood_Trunk_Bottle_Full.png", "Common/BlockTextures/Wood_Trunk_Bottle_Side.png", "Common/BlockTextures/Wood_Trunk_Bottle_Top.png", "Common/BlockTextures/Wood_Trunk_Burnt.png", "Common/BlockTextures/Wood_Trunk_Burnt_Full.png", "Common/BlockTextures/Wood_Trunk_Burnt_Top.png", "Common/BlockTextures/Wood_Trunk_Camphor.png", "Common/BlockTextures/Wood_Trunk_Camphor_Full.png", "Common/BlockTextures/Wood_Trunk_Camphor_Top.png", "Common/BlockTextures/Wood_Trunk_Cedar.png", "Common/BlockTextures/Wood_Trunk_Cedar_Full.png", "Common/BlockTextures/Wood_Trunk_Cedar_Top.png", "Common/BlockTextures/Wood_Trunk_CrimsonMaple_Full.png", "Common/BlockTextures/Wood_Trunk_CrimsonMaple_Side.png", "Common/BlockTextures/Wood_Trunk_CrimsonMaple_Top.png", "Common/BlockTextures/Wood_Trunk_Crystal.png", "Common/BlockTextures/Wood_Trunk_Crystal_Full.png", "Common/BlockTextures/Wood_Trunk_Crystal_Top.png", "Common/BlockTextures/Wood_Trunk_Dry.png", "Common/BlockTextures/Wood_Trunk_Dry_Full.png", "Common/BlockTextures/Wood_Trunk_Dry_Top.png", "Common/BlockTextures/Wood_Trunk_Fig_Blue_Full.png", "Common/BlockTextures/Wood_Trunk_Fig_Blue_Side.png", "Common/BlockTextures/Wood_Trunk_Fig_Blue_Top.png", "Common/BlockTextures/Wood_Trunk_Fire.png", "Common/BlockTextures/Wood_Trunk_Fire_Full.png", "Common/BlockTextures/Wood_Trunk_Fire_Top.png", "Common/BlockTextures/Wood_Trunk_Gumboab_Full.png", "Common/BlockTextures/Wood_Trunk_Gumboab_Side.png", "Common/BlockTextures/Wood_Trunk_Gumboab_Top.png", "Common/BlockTextures/Wood_Trunk_Jungle_Full.png", "Common/BlockTextures/Wood_Trunk_Jungle_Side.png", "Common/BlockTextures/Wood_Trunk_Jungle_Top.png", "Common/BlockTextures/Wood_Trunk_Oak_Full.png", "Common/BlockTextures/Wood_Trunk_Oak_Side.png", "Common/BlockTextures/Wood_Trunk_Oak_Top.png", "Common/BlockTextures/Wood_Trunk_Palo.png", "Common/BlockTextures/Wood_Trunk_Palo_Full.png", "Common/BlockTextures/Wood_Trunk_Palo_Top.png", "Common/BlockTextures/Wood_Trunk_Petrified_Full.png", "Common/BlockTextures/Wood_Trunk_Petrified_Side.png", "Common/BlockTextures/Wood_Trunk_Petrified_Top.png", "Common/BlockTextures/Wood_Trunk_RedWood.png", "Common/BlockTextures/Wood_Trunk_RedWood_Full.png", "Common/BlockTextures/Wood_Trunk_RedWood_Top.png", "Common/BlockTextures/Wood_trunk_Banyan_Full.png", "Common/BlockTextures/Wood_trunk_Banyan_Side.png", "Common/BlockTextures/Wood_trunk_Banyan_Top.png", "Common/BlockTextures/Wood_trunk_Sallow_Full.png", "Common/BlockTextures/Wood_trunk_Sallow_Side.png", "Common/BlockTextures/Wood_trunk_Sallow_Top.png", "Common/Blocks/Benches/Workbench.blockymodel", "Common/Blocks/Benches/Workbench_Texture.png", "Common/Blocks/Decorative_Sets/Village/Bed.blockymodel", "Common/Blocks/Decorative_Sets/Village/Bed_Texture.png", "Common/Blocks/Decorative_Sets/Village/Chair.blockymodel", "Common/Blocks/Decorative_Sets/Village/Chair_Texture.png", "Common/Blocks/Decorative_Sets/Village/Ladder.blockymodel", "Common/Blocks/Decorative_Sets/Village/Ladder_Texture.png", "Common/Blocks/Dungeons/SpiderWeb.blockymodel", "Common/Blocks/Dungeons/SpiderWeb_Full.blockymodel", "Common/Blocks/Dungeons/SpiderWeb_Texture.png", "Common/Blocks/Dungeons/Spider_Cocoon.blockymodel", "Common/Blocks/Dungeons/Spider_Cocoon_Texture.png", "Common/Blocks/Farming/Stick_Pile.blockymodel", "Common/Blocks/Farming/Sticks_Pile_Texture.png", "Common/Blocks/Foliage/Flowers/Cactus.blockymodel", "Common/Blocks/Foliage/Flowers/Cactus_Texture.png", "Common/Blocks/Foliage/Flowers/Chrysanthemum.blockymodel", "Common/Blocks/Foliage/Flowers/Chrysanthemum_Texture.png", "Common/Blocks/Foliage/Flowers/Flower.blockymodel", "Common/Blocks/Foliage/Flowers/FlowerSmall.blockymodel", "Common/Blocks/Foliage/Flowers/FlowerSmall_Textures/Arid_Cyan.png", "Common/Blocks/Foliage/Flowers/FlowerSmall_Textures/Arid_Purple.png", "Common/Blocks/Foliage/Flowers/Flower_Textures/Blue.png", "Common/Blocks/Foliage/Flowers/Flower_Textures/Cyan.png", "Common/Blocks/Foliage/Flowers/Flower_Textures/Yellow.png", "Common/Blocks/Foliage/Flowers/Giant_Raflesia_Jungle/Raflesia.blockymodel", "Common/Blocks/Foliage/Flowers/Giant_Raflesia_Jungle/Raflesia_Texture.png", "Common/Blocks/Foliage/Flowers/Health_T1_Blood_Rose/Blood_Rose.blockymodel", "Common/Blocks/Foliage/Flowers/Health_T1_Blood_Rose/Blood_Rose_Texture.png", "Common/Blocks/Foliage/Flowers/Hydrangea.blockymodel", "Common/Blocks/Foliage/Flowers/Hydrangea_White.png", "Common/Blocks/Foliage/Flowers/Jungle_Cyan_Giant.blockymodel", "Common/Blocks/Foliage/Flowers/Jungle_Cyan_Giant_Jungle.png", "Common/Blocks/Foliage/Flowers/Jungle_Orange.blockymodel", "Common/Blocks/Foliage/Flowers/Jungle_Orange_Pink.png", "Common/Blocks/Foliage/Flowers/Jungle_Orange_default.png", "Common/Blocks/Foliage/Flowers/Jungle_Pink_Giant.blockymodel", "Common/Blocks/Foliage/Flowers/Jungle_Pink_Giant_Jungle.png", "Common/Blocks/Foliage/Flowers/RareFlower.blockymodel", "Common/Blocks/Foliage/Flowers/RareFlower_Textures/Black.png", "Common/Blocks/Foliage/Flowers/RareFlower_Textures/Orange.png", "Common/Blocks/Foliage/Flowers/Sunflower.blockymodel", "Common/Blocks/Foliage/Flowers/Sunflower_Texture.png", "Common/Blocks/Foliage/Grass/Bushy.blockymodel", "Common/Blocks/Foliage/Grass/Bushy_Grassplant_Lush_Tall_GS.png", "Common/Blocks/Foliage/Grass/Dense_Small_3Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/Jungle.png", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/Seaweeds_GS.png", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/default.png", "Common/Blocks/Foliage/Grass/Dense_Tall_3Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Tall_4Rows_Texture.png", "Common/Blocks/Foliage/Grass/Dense_Tall_Jungle.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Tall_Jungle_default.png", "Common/Blocks/Foliage/Grass/Dense_VeryTall_4Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_VeryTall_4Rows_Sharp.png", "Common/Blocks/Foliage/Grass/Savannah.blockymodel", "Common/Blocks/Foliage/Grass/Savannah_Texture.png", "Common/Blocks/Foliage/Grass/Tall.blockymodel", "Common/Blocks/Foliage/Grass/Tall_Textures/Dry.png", "Common/Blocks/Foliage/Grass/Tall_Textures/Gnarled_Tall_GS.png", "Common/Blocks/Foliage/Grass/Tall_Textures/Winter.png", "Common/Blocks/Foliage/Grass/VeryTall.blockymodel", "Common/Blocks/Foliage/Grass/VeryTall_Textures/Savannah.png", "Common/Blocks/Foliage/Grass/VeryTall_Textures/Seaweed_Tall_GS.png", "Common/Blocks/Foliage/Grass/VeryTall_Textures/Water_GS.png", "Common/Blocks/Foliage/Grass/VeryTall_Textures/Winter_Unique2.png", "Common/Blocks/Foliage/Leaves/Ball.blockymodel", "Common/Blocks/Foliage/Leaves/Ball_Textures/Ash.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Aspen.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Azure.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Beech.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Birch.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/CrimsonMaple.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Fig_Blue.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Oak.png", "Common/Blocks/Foliage/Leaves/DownShape.blockymodel", "Common/Blocks/Foliage/Leaves/DownShape_Textures/Autumn.png", "Common/Blocks/Foliage/Leaves/DownShape_Textures/Bamboo.png", "Common/Blocks/Foliage/Leaves/DownShape_Textures/Banyan.png", "Common/Blocks/Foliage/Leaves/DownShape_Textures/Dry.png", "Common/Blocks/Foliage/Leaves/Hanging.blockymodel", "Common/Blocks/Foliage/Leaves/Hanging_Textures/Camphor.png", "Common/Blocks/Foliage/Leaves/Hanging_Textures/Sallow.png", "Common/Blocks/Foliage/Leaves/PineShape.blockymodel", "Common/Blocks/Foliage/Leaves/PineShape_NSEW.blockymodel", "Common/Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine.png", "Common/Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine_Snowy.png", "Common/Blocks/Foliage/Leaves/PineShape_Textures/Petrified.png", "Common/Blocks/Foliage/Leaves/PineShape_Textures/RedPine.png", "Common/Blocks/Foliage/Leaves/PineShape_Tip.blockymodel", "Common/Blocks/Foliage/Leaves/Tropical.blockymodel", "Common/Blocks/Foliage/Leaves/Tropical_Wide.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft.blockymodel", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Bottle.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Burnt.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar2.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Crystal.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Dead.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Fire.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Gramble.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Palo.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Redwood.png", "Common/Blocks/Foliage/Plants/Alien.blockymodel", "Common/Blocks/Foliage/Plants/Alien_Textures/Blue.png", "Common/Blocks/Foliage/Plants/Alien_Textures/Orange.png", "Common/Blocks/Foliage/Plants/Aloe.blockymodel", "Common/Blocks/Foliage/Plants/Aloe_Texture.png", "Common/Blocks/Foliage/Plants/Bramble_Ball.blockymodel", "Common/Blocks/Foliage/Plants/Bramble_Ball_Texture.png", "Common/Blocks/Foliage/Plants/Bush_Berry.blockymodel", "Common/Blocks/Foliage/Plants/Bush_Berry_Texture.png", "Common/Blocks/Foliage/Plants/Bush_Big.blockymodel", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Arid.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Arid_Magnolia.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Brambles.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Brambles_Green.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Crystal_Red.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Dead.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Dead_Stem.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Green.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Green_Dark.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Jungle_Blue.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Jungle_Green.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Frozen.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Red.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Snow.png", "Common/Blocks/Foliage/Plants/Bush_Dead.blockymodel", "Common/Blocks/Foliage/Plants/Bush_Dead_Texture.png", "Common/Blocks/Foliage/Plants/Cactus1.blockymodel", "Common/Blocks/Foliage/Plants/Cactus1_Texture.png", "Common/Blocks/Foliage/Plants/Cactus2.blockymodel", "Common/Blocks/Foliage/Plants/Cactus3.blockymodel", "Common/Blocks/Foliage/Plants/CactusFlat1.blockymodel", "Common/Blocks/Foliage/Plants/CactusFlat1_Texture.png", "Common/Blocks/Foliage/Plants/CactusFlat2.blockymodel", "Common/Blocks/Foliage/Plants/CactusFlat3.blockymodel", "Common/Blocks/Foliage/Plants/Cactus_Ball01.blockymodel", "Common/Blocks/Foliage/Plants/Cactus_Ball01_Texture.png", "Common/Blocks/Foliage/Plants/Cross.blockymodel", "Common/Blocks/Foliage/Plants/Cross_10px.blockymodel", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Sharp_Short_GS.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small_Gnarled.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small_Snow.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grassplant_Dry_Short_GS.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grassplant_Winter_Short_GS.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Moss_GS.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Seaweed_Shot_GS.png", "Common/Blocks/Foliage/Plants/Cross_17px.blockymodel", "Common/Blocks/Foliage/Plants/Cross_17px_Textures/Grassplant_Lush_GS.png", "Common/Blocks/Foliage/Plants/Cross_17px_Textures/Jungle_GS.png", "Common/Blocks/Foliage/Plants/Cross_17px_Textures/Rocky_GS.png", "Common/Blocks/Foliage/Plants/Cross_25px.blockymodel", "Common/Blocks/Foliage/Plants/Cross_25px_Grass_Winter.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Red.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Violet.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Yellow.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Gnarled.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Grassplant_Dry_GS.png", "Common/Blocks/Foliage/Plants/Cross_Full.blockymodel", "Common/Blocks/Foliage/Plants/Cross_Full_Textures/Moss_GS.png", "Common/Blocks/Foliage/Plants/Cross_Textures/Cave_Short.png", "Common/Blocks/Foliage/Plants/Cross_Textures/Flower_White.png", "Common/Blocks/Foliage/Plants/Cross_Textures/Seaweed_Stackable.png", "Common/Blocks/Foliage/Plants/Cross_Textures/Seaweed_Winter_Small.png", "Common/Blocks/Foliage/Plants/Dense_Tall.blockymodel", "Common/Blocks/Foliage/Plants/Dense_Tall_Textures/Lavender.png", "Common/Blocks/Foliage/Plants/Dense_Tall_Textures/Wheat_Burn.png", "Common/Blocks/Foliage/Plants/Fern_Big.blockymodel", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/Arid_Palm.png", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/Flower_Fire.png", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/GS.png", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/Grass_Dry.png", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/Winter.png", "Common/Blocks/Foliage/Plants/Fern_Giant.blockymodel", "Common/Blocks/Foliage/Plants/Fern_Giant_Jungle.png", "Common/Blocks/Foliage/Plants/Fern_Giant_Trunk.blockymodel", "Common/Blocks/Foliage/Plants/Fern_Giant_Trunk_Texture.png", "Common/Blocks/Foliage/Plants/Fern_Small.blockymodel", "Common/Blocks/Foliage/Plants/Fern_Small_GS.png", "Common/Blocks/Foliage/Plants/Flax.blockymodel", "Common/Blocks/Foliage/Plants/Flax_Textures/Blue.png", "Common/Blocks/Foliage/Plants/HangingMoss.blockymodel", "Common/Blocks/Foliage/Plants/HangingMoss_Textures/Moss_GS_01.png", "Common/Blocks/Foliage/Plants/HangingMoss_Textures/Moss_GS_02.png", "Common/Blocks/Foliage/Plants/Health_T2_Blood_Cap/Blood_Cap.blockymodel", "Common/Blocks/Foliage/Plants/Health_T2_Blood_Cap/Blood_Cap_Texture.png", "Common/Blocks/Foliage/Plants/Ivy.blockymodel", "Common/Blocks/Foliage/Plants/Ivy_Textures/default.png", "Common/Blocks/Foliage/Plants/Jungle_Bush_Giant.blockymodel", "Common/Blocks/Foliage/Plants/Jungle_Bush_Giant_Jungle.png", "Common/Blocks/Foliage/Plants/Leaves_Floor.blockymodel", "Common/Blocks/Foliage/Plants/Leaves_Floor_Textures/Jungle.png", "Common/Blocks/Foliage/Plants/Leaves_Floor_Textures/default.png", "Common/Blocks/Foliage/Plants/Liana.blockymodel", "Common/Blocks/Foliage/Plants/Liana_Textures/Green_01.png", "Common/Blocks/Foliage/Plants/Liana_Textures/Green_02.png", "Common/Blocks/Foliage/Plants/Liana_Textures/Green_03.png", "Common/Blocks/Foliage/Plants/Mana_T2_Azure_Cap/Azure_Cap.blockymodel", "Common/Blocks/Foliage/Plants/Mana_T2_Azure_Cap/Azure_Cap_Texture.png", "Common/Blocks/Foliage/Plants/Moss_Rug.blockymodel", "Common/Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS.png", "Common/Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_2.png", "Common/Blocks/Foliage/Plants/Moss_Rug_Textures/Moss_Rug_GS_3.png", "Common/Blocks/Foliage/Plants/Moss_Wall.blockymodel", "Common/Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS.png", "Common/Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS2.png", "Common/Blocks/Foliage/Plants/Moss_Wall_Textures/Moss_GS3.png", "Common/Blocks/Foliage/Plants/Mushroom.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Balls.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Balls_default.png", "Common/Blocks/Foliage/Plants/Mushroom_Flat.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Flat_Blue.png", "Common/Blocks/Foliage/Plants/Mushroom_Flat_White.png", "Common/Blocks/Foliage/Plants/Mushroom_Fox.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Fox_Brown.png", "Common/Blocks/Foliage/Plants/Mushroom_Fox_Green.png", "Common/Blocks/Foliage/Plants/Mushroom_Medium.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Medium_Textures/Brown.png", "Common/Blocks/Foliage/Plants/Mushroom_Medium_Textures/Green.png", "Common/Blocks/Foliage/Plants/Mushroom_Poison.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Poison_White.png", "Common/Blocks/Foliage/Plants/Mushroom_Tall.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Tall_White.png", "Common/Blocks/Foliage/Plants/Mushroom_Textures/Blue.png", "Common/Blocks/Foliage/Plants/Mushroom_Textures/Brown.png", "Common/Blocks/Foliage/Plants/Mushroom_Thin.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Thin_Textures/Blue.png", "Common/Blocks/Foliage/Plants/Mushroom_Thin_Textures/Green.png", "Common/Blocks/Foliage/Plants/Mushroom_Thin_Textures/Purple.png", "Common/Blocks/Foliage/Plants/Mushroom_Thin_Textures/Yellow.png", "Common/Blocks/Foliage/Plants/Nettle.blockymodel", "Common/Blocks/Foliage/Plants/Nettle_Textures/Ash.png", "Common/Blocks/Foliage/Plants/Nettle_Textures/Blue.png", "Common/Blocks/Foliage/Plants/Nettle_Textures/Cyan.png", "Common/Blocks/Foliage/Plants/Nettle_Textures/Poisoned.png", "Common/Blocks/Foliage/Plants/Nettle_Textures/Red.png", "Common/Blocks/Foliage/Plants/Nettle_Textures/White.png", "Common/Blocks/Foliage/Plants/Nettle_Textures/default.png", "Common/Blocks/Foliage/Plants/Palm_Giant.blockymodel", "Common/Blocks/Foliage/Plants/Palm_Giant_Dark.png", "Common/Blocks/Foliage/Plants/Palm_Giant_default.png", "Common/Blocks/Foliage/Plants/Parched_Thorn.blockymodel", "Common/Blocks/Foliage/Plants/Parched_Thorn_Texture.png", "Common/Blocks/Foliage/Plants/ReedWinter.blockymodel", "Common/Blocks/Foliage/Plants/ReedWinter_Texture.png", "Common/Blocks/Foliage/Plants/Reeds.blockymodel", "Common/Blocks/Foliage/Plants/Reeds_Textures/Reeds_Marsh.png", "Common/Blocks/Foliage/Plants/Reeds_Textures/Reeds_Poison.png", "Common/Blocks/Foliage/Plants/Rocky_Flower.blockymodel", "Common/Blocks/Foliage/Plants/Rocky_Flower_Texture.png", "Common/Blocks/Foliage/Plants/Shrub.blockymodel", "Common/Blocks/Foliage/Plants/Shrub_Winter.png", "Common/Blocks/Foliage/Plants/Sorrel_Rug.blockymodel", "Common/Blocks/Foliage/Plants/Sorrel_Rug_Texture.png", "Common/Blocks/Foliage/Plants/Succulent.blockymodel", "Common/Blocks/Foliage/Plants/Succulent_Texture.png", "Common/Blocks/Foliage/Plants/Vine.blockymodel", "Common/Blocks/Foliage/Plants/Vine_Dry.png", "Common/Blocks/Foliage/Tree/Roots.blockymodel", "Common/Blocks/Foliage/Tree/Roots_Textures/Ash.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Azure.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Banyan.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Burnt.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Cedar.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Crystal.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Dry.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Gumboab.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Hanging_Lianas.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Jungle.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Oak.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Petrified.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Spruce.png", "Common/Blocks/Foliage/Water/Coral_Bush.blockymodel", "Common/Blocks/Foliage/Water/Coral_Bush_Small.blockymodel", "Common/Blocks/Foliage/Water/Coral_Bush_Small_Purple.png", "Common/Blocks/Foliage/Water/Coral_Bush_Textures/Cyan.png", "Common/Blocks/Foliage/Water/Coral_Bush_Textures/Pink.png", "Common/Blocks/Foliage/Water/Coral_Bush_Textures/Yellow.png", "Common/Blocks/Foliage/Water/Coral_Sponge_Blue.blockymodel", "Common/Blocks/Foliage/Water/Coral_Sponge_Blue_Texture.png", "Common/Blocks/Foliage/Water/Coral_Sponge_Cyan.blockymodel", "Common/Blocks/Foliage/Water/Coral_Sponge_Cyan_Texture.png", "Common/Blocks/Foliage/Water/Mana_T3_Azure_Kelp/Azure_Kelp.blockymodel", "Common/Blocks/Foliage/Water/Mana_T3_Azure_Kelp/Azure_Kelp_Texture.png", "Common/Blocks/Foliage/Water/Waterlily.blockymodel", "Common/Blocks/Foliage/Water/Waterlily_Textures/01.png", "Common/Blocks/Foliage/Water/Waterlily_Textures/02.png", "Common/Blocks/Foliage/Water/Waterlily_Textures/03.png", "Common/Blocks/Miscellaneous/Nest.blockymodel", "Common/Blocks/Miscellaneous/Nest_Texture.png", "Common/Blocks/Stone/Rubble_Charcoal.blockymodel", "Common/Blocks/Stone/Rubble_Medium.blockymodel", "Common/Blocks/Stone/Rubble_Medium_02.blockymodel", "Common/Blocks/Stone/Rubble_Small.blockymodel", "Common/Blocks/Stone/Rubble_Small_02.blockymodel", "Common/Blocks/Structures/Base_Shapes/Cube_Overlay.blockymodel", "Common/Blocks/Structures/Base_Shapes/Lava_Cracks.png", "Common/Blocks/Structures/Tubes/Corner.blockymodel", "Common/Blocks/Structures/Tubes/Corner_Textures/Ash.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Aspen.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Azure.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Banyan.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Beech.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Birch.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Bottle.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Burnt.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Camphor.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Cedar.png", "Common/Blocks/Structures/Tubes/Corner_Textures/CrimsonMaple.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Crystal.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Dry.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Fig_Blue.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Fire.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Gumboab.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Jungle.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Oak.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Palm.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Palo.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Petrified.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Poison.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Redwood.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Sallow.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Spruce.png", "Common/Blocks/Structures/Tubes/Long.blockymodel", "Common/Blocks/Structures/Tubes/Long_Simple_UV.blockymodel", "Common/Blocks/Structures/Tubes/Long_Simple_UV_Textures/Bamboo.png", "Common/Blocks/Structures/Tubes/Short.blockymodel", "Common/Items/Block_Spawner_Block.blockymodel", "Common/Items/Block_Spawner_Block_Texture.png", "Common/Items/Projectiles/Projectile.blockymodel", "Common/Items/Projectiles/Tornado_Texture.png", "Common/Items/Rubble/Rubble_Textures/Basalt.png", "Common/Items/Rubble/Rubble_Textures/Charcoal.png", "Common/Items/Rubble/Rubble_Textures/Ice.png", "Common/Items/Rubble/Rubble_Textures/Marble.png", "Common/Items/Rubble/Rubble_Textures/Sandstone.png", "Common/Items/Rubble/Rubble_Textures/Sandstone_Red.png", "Common/Items/Rubble/Rubble_Textures/Sandstone_White.png", "Common/Items/Rubble/Rubble_Textures/Shale.png", "Common/Items/Rubble/Rubble_Textures/Slate.png", "Common/Items/Rubble/Rubble_Textures/Stone.png", "Common/Items/Rubble/Rubble_Textures/Stone_Mossy.png", "Common/Items/Rubble/Rubble_Textures/Volcanic.png", "Common/Resources/Crystals/Crystal_Big.blockymodel", "Common/Resources/Crystals/Crystal_Big_Textures/Blue.png", "Common/Resources/Crystals/Crystal_Big_Textures/Green.png", "Common/Resources/Crystals/Crystal_Big_Textures/Pink.png", "Common/Resources/Crystals/Crystal_Big_Textures/Red.png", "Common/Resources/Crystals/Crystal_Big_Textures/Water.png", "Common/Resources/Crystals/Crystal_Big_Textures/Yellow.png", "Common/Resources/Crystals/Crystal_Medium.blockymodel", "Common/Resources/Crystals/Crystal_Small.blockymodel", "Common/Resources/Ingredients/Azure_Fruit.blockymodel", "Common/Resources/Ingredients/Azure_Fruit_Texture.png", "Common/Resources/Ingredients/Coconut.blockymodel", "Common/Resources/Ingredients/Coconut_Texture.png", "Common/Resources/Ingredients/Cone.blockymodel", "Common/Resources/Ingredients/Cone_Texture.png", "Common/Resources/Ingredients/Mango_Magic.blockymodel", "Common/Resources/Ingredients/Mango_Magic_Red.png", "Common/Resources/Ingredients/Pink_Fruit.blockymodel", "Common/Resources/Ingredients/Pink_Fruit_Texture.png", "Server/HytaleGenerator/Biomes/Ocean1/Oceans.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_003.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_0/Ash_Stage0_004.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_003.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_1/Ash_Stage1_004.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_003.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_2/Ash_Stage2_004.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_003.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_3/Ash_Stage3_005.prefab.json", "Server/Prefabs/Orbis/Trees/Ash/Stage_6/Ash_Stage6_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_003.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_006.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_3/Ash_Dead_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_3/Ash_Dead_Stage3_006.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_3/Ash_Dead_Stage3_011.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Moss/Stage_3/Ash_Moss_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_0/Aspen_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_003.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_004.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_005.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_010.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_3/Aspen_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_3/Aspen_Stage3_007.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_3/Aspen_Stage3_012.prefab.json", "Server/Prefabs/Orbis/Trees/Autumn/Stage_1/Autumn_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Autumn/Stage_2/Autumn_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Autumn/Stage_3/Autumn_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Autumn/Stage_3/Autumn_Stage3_003.prefab.json", "Server/Prefabs/Orbis/Trees/Autumn/Stage_3/Autumn_Stage3_004.prefab.json", "Server/Prefabs/Orbis/Trees/Azure/Stage_2/Azure_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Azure/Stage_3/Azure_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_0/Bamboo_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_005.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_1/Bamboo_Stage1_008.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_005.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_2/Bamboo_Stage2_008.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_3/Bamboo_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_3/Bamboo_Stage3_005.prefab.json", "Server/Prefabs/Orbis/Trees/Bamboo/Stage_3/Bamboo_Stage3_008.prefab.json", "Server/Prefabs/Orbis/Trees/Banyan/Stage_3/Banyan_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_1/Beech_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_005.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_010.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_007.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_012.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_007.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_012.prefab.json", "Server/Prefabs/Orbis/Trees/Beech_Fallen/Stage_1/Beech_Fallen_Stage1_003.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_0/Birch_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_005.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_2/Birch_Stage2_010.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_005.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_3/Birch_Stage3_010.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_4/Birch_Stage4_001.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_4/Birch_Stage4_007.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_4/Birch_Stage4_012.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_0/Boab_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_1/Boab_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_008.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_2/Boab_Stage2_015.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_3/Boab_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_3/Boab_Stage3_007.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_3/Boab_Stage3_012.prefab.json", "Server/Prefabs/Orbis/Trees/Burnt/Stage_1/Burnt_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Burnt/Stage_2/Burnt_Stage2_004.prefab.json", "Server/Prefabs/Orbis/Trees/Burnt/Stage_3/Burnt_Stage3_008.prefab.json", "Server/Prefabs/Orbis/Trees/Cedar/Stage_1/Cedar_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Cedar/Stage_2/Cedar_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Cedar/Stage_3/Cedar_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Cedar_Burnt/Stage_2/Cedar_Burnt_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_0/Dry_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_003.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_005.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_004.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_005.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_004.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_3/Dry_Stage3_008.prefab.json", "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_2/Dry_Dead_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_3/Dry_Dead_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_3/Dry_Dead_004.prefab.json", "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_2/Fig_Blue_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_3/Fig_Blue_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_005.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_009.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_006.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_011.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_005.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_3/Fir_Stage3_009.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_005.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_1/Fir_Dead_Stage1_010.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_2/Fir_Dead_Stage2_005.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Dead/Stage_3/Fir_Dead_Stage3_010.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_006.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_2/Fir_Snow_Stage2_011.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_005.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_009.prefab.json", "Server/Prefabs/Orbis/Trees/Fire_Burning/Stage_1/Fire_Burning_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fire_Burning/Stage_3/Fire_Burning_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_1/Gum_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_005.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_2/Gum_Stage2_010.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_005.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_3/Gum_Stage3_010.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_4/Gum_Stage4_001.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_4/Gum_Stage4_005.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_4/Gum_Stage4_010.prefab.json", "Server/Prefabs/Orbis/Trees/Maple/Stage_1/Maple_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Maple/Stage_2/Maple_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Maple/Stage_3/Maple_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_006.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_0/Oak_Stage0_011.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_006.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_1/Oak_Stage1_011.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_006.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_2/Oak_Stage2_011.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_003.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_006.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_003.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_006.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_003.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_006.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_002.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_6/Oak_Stage6_003.prefab.json", "Server/Prefabs/Orbis/Trees/Palm/Stage_2/Palm_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palm_Green/Stage_2/Palm_Green_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palm_Green/Stage_3/Palm_Green_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palo/Stage_3/Palo_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified/Stage_1/Petrified_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified/Stage_2/Petrified_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified/Stage_2/Petrified_Stage2_003.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified/Stage_2/Petrified_Stage2_005.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified/Stage_3/Petrified_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified/Stage_3/Petrified_Stage3_003.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified/Stage_3/Petrified_Stage3_004.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_003.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_1/Petrified_Dead_Stage1_005.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_2/Petrified_Dead_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_2/Petrified_Dead_Stage2_003.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_2/Petrified_Dead_Stage2_004.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_3/Petrified_Dead_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_5/Petrified_Dead_Stage5_001.prefab.json", "Server/Prefabs/Orbis/Trees/Redwood/Stage_0/Redwood_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Redwood/Stage_1/Redwood_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Redwood/Stage_2/Redwood_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Redwood/Stage_3/Redwood_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Sallow/Stage_1/Sallow_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_003.prefab.json", "Server/Prefabs/Orbis/Trees/Sallow/Stage_2/Sallow_Stage2_004.prefab.json", "Server/Prefabs/Orbis/Trees/Sallow/Stage_3/Sallow_Stage3_001.prefab.json", "Server/Prefabs/Plants/Cacti/Flat/Stage_0/Cacti_Flat_Stage_0_001.prefab.json", "Server/Prefabs/Plants/Cacti/Flat/Stage_0/Cacti_Flat_Stage_0_002.prefab.json", "Server/Prefabs/Plants/Cacti/Flat/Stage_0/Cacti_Flat_Stage_0_003.prefab.json", "Server/Prefabs/Plants/Cacti/Flat/Stage_1/Cacti_Flat_Stage_1_001.prefab.json", "Server/Prefabs/Plants/Cacti/Flat/Stage_1/Cacti_Flat_Stage_1_005.prefab.json", "Server/Prefabs/Plants/Cacti/Flat/Stage_1/Cacti_Flat_Stage_1_009.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_001.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_003.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_0/Cacti_Full_Stage_0_006.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_001.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_008.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_1/Cacti_Full_Stage_1_015.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_001.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_007.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_2/Cacti_Full_Stage_2_012.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_001.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_004.prefab.json", "Server/Prefabs/Plants/Cacti/Full/Stage_3/Cacti_Full_Stage_3_007.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_001.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_002.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_1/Mushroom_Large_Green_Stage_1_003.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Green/Stage_3/Mushroom_Large_Green_Stage_3_004.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_001.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_002.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Wall/Green/Mushroom_Large_Wall_Green_003.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_001.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_002.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Wall/Yellow/Mushroom_Large_Wall_Yellow_003.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_001.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_002.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_1/Mushroom_Large_Yellow_Stage_1_003.prefab.json", "Server/Prefabs/Plants/Mushroom_Large/Yellow/Stage_3/Mushroom_Large_Yellow_Stage_3_004.prefab.json", "Server/Prefabs/Trees/Ash_swamp/Stage_2/Ash_swamp_Stage2_001.prefab.json", "Server/Prefabs/Trees/Ash_swamp/Stage_3/Ash_swamp_Stage3_001.prefab.json", "Server/Prefabs/Trees/Ash_swamp/Stage_4/Ash_swamp_Stage4_001.prefab.json", "Server/Prefabs/Trees/Ash_swamp_dead/Stage_3/Ash_swamp_dead_Stage3_001.prefab.json", "Server/Prefabs/Trees/Ash_twisted_Giant/Ash_twisted_Giant_001.prefab.json", "Server/Prefabs/Trees/Ash_twisted_Giant/Ash_twisted_Giant_002.prefab.json", "Server/Prefabs/Trees/Ash_twisted_Giant/Ash_twisted_Giant_003.prefab.json", "Server/Prefabs/Trees/Ash_twisted_Large/Ash_twisted_Large_001.prefab.json", "Server/Prefabs/Trees/Ash_twisted_Large/Ash_twisted_Large_003.prefab.json", "Server/Prefabs/Trees/Ash_twisted_Large/Ash_twisted_Large_004.prefab.json", "Server/Prefabs/Trees/Bamboo/Giant/Bamboo_Giant_001.prefab.json", "Server/Prefabs/Trees/Bamboo/Giant/Bamboo_Giant_005.prefab.json", "Server/Prefabs/Trees/Bamboo/Giant/Bamboo_Giant_008.prefab.json", "Server/Prefabs/Trees/Burnt_Roots/Normal/Mushroom/Burnt_Roots_Normal_001.prefab.json", "Server/Prefabs/Trees/Burnt_Roots/Normal/Stage_3/Burnt_Roots_Normal_001.prefab.json", "Server/Prefabs/Trees/Burnt_Roots/Spider/Mushroom/Burnt_Roots_Spider_001.prefab.json", "Server/Prefabs/Trees/Burnt_Roots/Spider/Stage_3/Burnt_Roots_Spider_002.prefab.json", "Server/Prefabs/Trees/Burnt_dead/Stage_1/Burnt_dead_Stage1_001.prefab.json", "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_001.prefab.json", "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_003.prefab.json", "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_007.prefab.json", "Server/Prefabs/Trees/Burnt_dead/Stage_2/Burnt_dead_Stage2_012.prefab.json", "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_001.prefab.json", "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_003.prefab.json", "Server/Prefabs/Trees/Burnt_dead/Stage_3/Burnt_dead_Stage3_006.prefab.json", "Server/Prefabs/Trees/Cedar_Logs/Small/Cedar_Logs_001.prefab.json", "Server/Prefabs/Trees/Dry/Stage_1_Dead/Dry_Dead_Stage1_001.prefab.json", "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_001.prefab.json", "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_007.prefab.json", "Server/Prefabs/Trees/Dry/Stage_3_Vines/Dry_Stage3_Vines_014.prefab.json", "Server/Prefabs/Trees/Fir_red/Stage_0/Fir_red_Stage0_001.prefab.json", "Server/Prefabs/Trees/Fir_red/Stage_0/Fir_red_Stage0_003.prefab.json", "Server/Prefabs/Trees/Fir_red/Stage_0/Fir_red_Stage0_004.prefab.json", "Server/Prefabs/Trees/Fir_red/Stage_1/Fir_red_Stage1_001.prefab.json", "Server/Prefabs/Trees/Fir_red/Stage_1/Fir_red_Stage1_005.prefab.json", "Server/Prefabs/Trees/Fir_red/Stage_1/Fir_red_Stage1_010.prefab.json", "Server/Prefabs/Trees/Jungle/Stage_2/Jungle_Stage_2_001.prefab.json", "Server/Prefabs/Trees/Jungle1/Stage_3_Crystal_Red/Jungle1_Stage3_Crystal_Red_001.prefab.json", "Server/Prefabs/Trees/Jungle1/Stage_3_Crystal_Red/Jungle1_Stage3_Crystal_Red_002.prefab.json", "Server/Prefabs/Trees/Jungle1/Stage_3_Crystal_Red/Jungle1_Stage3_Crystal_Red_003.prefab.json", "Server/Prefabs/Trees/Jungle2/Boulder/Jungle2_Boulder_Stage0_001.prefab.json", "Server/Prefabs/Trees/Jungle2/Boulder/Jungle2_Boulder_Stage1_002.prefab.json", "Server/Prefabs/Trees/Jungle2/Boulder/Jungle2_Boulder_Stage2_001.prefab.json", "Server/Prefabs/Trees/Jungle2/Boulder_Red/Jungle2_Boulder_Red_001.prefab.json", "Server/Prefabs/Trees/Jungle2/Boulder_Red/Jungle2_Boulder_Red_003.prefab.json", "Server/Prefabs/Trees/Jungle2/Boulder_Red/Jungle2_Boulder_Red_004.prefab.json", "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_001.prefab.json", "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_002.prefab.json", "Server/Prefabs/Trees/Jungle3/Stage_3_Crystal_Red/Jungle3_Stage3_Crystal_Red_003.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal/Stage_1/Jungle_Crystal_Stage1_001.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal/Stage_1/Jungle_Crystal_Stage1_003.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal/Stage_1/Jungle_Crystal_Stage1_005.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal/Stage_2/Jungle_Crystal_Stage2_001.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal/Stage_2/Jungle_Crystal_Stage2_003.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal/Stage_2/Jungle_Crystal_Stage2_005.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_001.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_003.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal/Stage_3/Jungle_Crystal_Stage3_005.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal_Red/Stage_03/Jungle_Crystal_Red_Stage03_001.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal_Red/Stage_03/Jungle_Crystal_Red_Stage03_004.prefab.json", "Server/Prefabs/Trees/Jungle_Crystal_Red/Stage_03/Jungle_Crystal_Red_Stage03_007.prefab.json", "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_001.prefab.json", "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_002.prefab.json", "Server/Prefabs/Trees/Jungle_Ferns/Jungle_Ferns_003.prefab.json", "Server/Prefabs/Trees/Logs/Birch/Moss/Logs_Birch_Moss_001.prefab.json", "Server/Prefabs/Trees/Oak/Stage_00/Oak_Stage00_001.prefab.json", "Server/Prefabs/Trees/Oak/Stage_00/Oak_Stage00_006.prefab.json", "Server/Prefabs/Trees/Oak/Stage_00/Oak_Stage00_011.prefab.json", "Server/Prefabs/Trees/Oak_Moss/Stage_4/Oak_Moss_Stage4_001.prefab.json", "Server/Prefabs/Trees/Oak_Moss/Stage_4/Oak_Moss_Stage4_003.prefab.json", "Server/Prefabs/Trees/Oak_Moss/Stage_4/Oak_Moss_Stage4_005.prefab.json", "Server/Prefabs/Trees/Rocks/Birch/Rocks_Birch_Birch_001.prefab.json", "Server/Prefabs/Trees/Rocks/Birch/Rocks_Birch_Birch_003.prefab.json", "Server/Prefabs/Trees/Rocks/Birch/Rocks_Birch_Birch_006.prefab.json", "Server/Weathers/Zone1/Zone1_Sunny.json", "Server/Weathers/Zone1/Zone1_Sunny_Fireflies.json", "Server/Weathers/Zone1/Zone1_Swamp.json", "Server/Weathers/Zone2/Zone2_Sunny.json", "Server/Weathers/Zone3/Zone3_Cloudy_Boreal.json", "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json", "Server/Weathers/Zone3/Zone3_Rain.json", "Server/Weathers/Zone4/Zone4_Lava_Fields.json", "Server/Weathers/Zone4/Zone4_Light.json", "Server/Weathers/Zone4/Zone4_Storm.json", "Server/Weathers/Zone4/Zone4_Swamp_Storm.json", "Server/World/Default/Zones/Noise/Oceans/Covers/Fern/Island_Ferns.json", "Server/World/Default/Zones/Noise/Oceans/Covers/Grass/Island_Grass_Lush.json", "Server/World/Default/Zones/Noise/Shared/Grids/Monuments_Encounter.json", "Server/World/Default/Zones/Noise/Shared/Grids/Monuments_Encounter_Mask.json", "Server/World/Default/Zones/Noise/Shared/Grids/Monuments_Temple_Entrances.json", "Server/World/Default/Zones/Noise/Shared/Heightmaps/Base.json", "Server/World/Default/Zones/Noise/Shared/Heightmaps/River.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Bush/Bush_Green_Dense.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Bush/Bush_Green_Gorge.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Bush/Bush_Green_Plains.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Bush/Bush_Green_River.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Bush/Bush_Mixed.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Crops/Mushroom_Autumn.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Crops/Mushroom_Brown.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Crops/Mushroom_Glowing.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Crops/Mushroom_Mixed.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Crops/Pumpkin_Dense.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Crops/Pumpkin_Medium.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Crops/Wheat_Carrot_Patches.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Fern/Fern_Winter.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Flax_Blue_Sparse.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Flowers_Birch_Forest.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Flowers_Common_Dense.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Flowers_Common_Medium.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Flowers_Lake.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Flowers_Moss_Swamp.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Flowers_Plains_Smooth.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Flowers_River.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Flowers_Tallgrass.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Flowers_Yellow_Pink.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Sunflowers.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Wildflowers_Autumn.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Wildflowers_Bushy.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Wildflowers_Forest.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Wildflowers_Gorge.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Wildflowers_Mixed.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Wildflowers_Plains.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Wildflowers_Smooth.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Flowers/Wildflowers_Violet_Yellow.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Grass/Grass_Dry_Tall.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Grass/Grass_Lush_Forest.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Grass/Grass_Lush_Plains.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Grass/Grass_Mixed_Dense.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Grass/Grass_Sharp.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Grass/Grass_Short_Tallgrass.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Grass/Grass_Tint_Plains.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Ground/Pebbles_White_Sand.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Moss/Moss_Grass_Tall.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Moss/Moss_Green.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Moss/Moss_Rug_Pink.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Moss/Moss_Rug_Yellow.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Moss/Moss_Short_Brown.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Moss/Moss_Short_Green.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Rubble/Stone_Mossy_Lake.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Rubble/Stone_River.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Rubble/Stone_Rough.json", "Server/World/Default/Zones/Noise/Zone1/Covers/Soil/Dirt_Tallgrass.json", "Server/World/Default/Zones/Noise/Zone1/Heightmaps/Gorges.json", "Server/World/Default/Zones/Noise/Zone1/Heightmaps/Gorges_Grid.json", "Server/World/Default/Zones/Noise/Zone1/Heightmaps/Gorges_Plateau.json", "Server/World/Default/Zones/Noise/Zone1/Heightmaps/Plains_Birch.json", "Server/World/Default/Zones/Noise/Zone1/NoiseMasks/Dungeons.json", "Server/World/Default/Zones/Noise/Zone1/NoiseMasks/Faction_Undead.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Bramble/Bramble_Arid.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Cacti/Cacti_Ball_Patches.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Crops/Sandstone_Beach.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Flowers/Flax_Orange_Plateau.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Flowers/Flowers_Desert_Bones.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Flowers/Flowers_Poisoned_Savannah.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Flowers/Flowers_Poisoned_Tar.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Flowers/Shells_Seaweed.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Rubble/Rubble_Bedrock.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Rubble/Sandstone_Plateau.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Rubble/Sandstone_Red_Desert.json", "Server/World/Default/Zones/Noise/Zone2/Covers/Rubble/Sandstone_White_Sparse.json", "Server/World/Default/Zones/Noise/Zone2/Layers/Rock/Bedrock_Desert.json", "Server/World/Default/Zones/Noise/Zone2/Layers/Soil/Gravel_Red_Desert.json", "Server/World/Default/Zones/Noise/Zone2/Layers/Soil/Layer_Cave_Deep.json", "Server/World/Default/Zones/Noise/Zone2/Layers/Soil/Layer_Cave_Upper.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Bramble/Bramble_Bedrock.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Bush/Bush_Bedrock_Sparse.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Bush/Bush_Cliffs_Dense.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Bush/Bush_Cliffs_Medium.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Bush/Bush_Cliffs_Rocky.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Bush/Bush_Cliffs_Sparse.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Bush/Bush_Redwood.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Bush/Bush_Wasabi_River.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Bush/Bush_Winterberry.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Crops/Mushroom_Cedar.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Crops/Mushroom_Forest.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Fern/Fern_Bedrock.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Fern/Fern_Cave.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Fern/Fern_Cedar_Dense.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Fern/Fern_Cedar_Sparse.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Flowers/Flowers_Bedrock.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Flowers/Flowers_Cave.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Flowers/Flowers_Common.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Flowers/Flowers_Lake.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Flowers/Wildflowers_Cliffs.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Grass/Grass_Bedrock_Dense.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Grass/Grass_Bedrock_Light.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Grass/Grass_Bedrock_Minimal.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Grass/Grass_Cave_Dense.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Grass/Grass_Cave_Medium.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Grass/Grass_Lush_Forest.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Grass/Grass_Redwood.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Grass/Grass_Sharp_Forest.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Ice/Ice_Lake_Deep.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Ice/Ice_Lake_Surface.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Moss/Moss_Brown_Tundra.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Rubble/Quartzite_River.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Rubble/Stone_Cave.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Rubble/Stone_Cliffs_Rocky.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Rubble/Stone_Quartzite_Village.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Rubble/Stone_Redwood.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Seaweed/Seaweed_Lake.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Seeds/Seeds_Grass.json", "Server/World/Default/Zones/Noise/Zone3/Covers/Seeds/Seeds_Wildflower.json", "Server/World/Default/Zones/Noise/Zone3/Layers/Soil/Layer_Bedrock_Light_10.json", "Server/World/Default/Zones/Noise/Zone3/Layers/Soil/Layer_Bedrock_Light_12.json", "Server/World/Default/Zones/Noise/Zone3/Layers/Soil/Layer_Bedrock_Light_13.json", "Server/World/Default/Zones/Noise/Zone3/Layers/Soil/Layer_Bedrock_Light_16.json", "Server/World/Default/Zones/Noise/Zone3/Layers/Soil/Layer_Bedrock_Light_17.json", "Server/World/Default/Zones/Noise/Zone3/Layers/Soil/Layer_Bedrock_Light_8.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Bush/Bush_Bedrock_Dense.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Bush/Bush_Bedrock_Medium.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Bush/Bush_Cave.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Bush/Bush_Ghost_Forest.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Bush/Bush_Swamp.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Bush/Bush_Wastes.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Crops/Mushroom_Cave.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Crops/Mushroom_Clover.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Crops/Mushroom_Ghost.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Crops/Mushroom_Swamp.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Crops/Mushroom_Wastes.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Flowers/Flowers_Cave_Dense.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Flowers/Flowers_Cave_Medium.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Flowers/Flowers_Cave_Sparse.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Flowers/Flowers_Desert.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Flowers/Flowers_Wastes.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Flowers/Wildflowers_Ghost.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Flowers/Wildflowers_Sparse.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Flowers/Wildflowers_Swamp.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Arid_Wastes.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Bedrock_Dense.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Bedrock_Light.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Bedrock_Medium.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Cave_Light.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Desert.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Dry_Wastes.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Ghost_Forest.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Lush_Swamp.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Sharp_Swamp.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Grass/Grass_Sharp_Wastes.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Ground/Pebbles_Bedrock.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Leaves/Leaves_Dead_Forest.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Moss/Moss_Brown_Wastes.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Rubble/Stone_Bedrock_Dense.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Rubble/Stone_Bedrock_Medium.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Rubble/Stone_Cave.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Rubble/Stone_Lava.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Soil/Dirt_Bedrock.json", "Server/World/Default/Zones/Noise/Zone4/Covers/Soil/Dirt_Desert_Dunes.json", "Server/World/Default/Zones/Noise/Zone4/Grids/Monuments_Tier4_Cities.json", "Server/World/Default/Zones/Noise/Zone4/Grids/Monuments_Tier5_Cities.json", "Server/World/Default/Zones/Noise/Zone4/Grids/Monuments_Tier5_Dungeon_Challenge.json", "Server/World/Default/Zones/Noise/Zone4/Layers/Soil/Layer_Bedrock_Light_1.json", "Server/World/Default/Zones/Noise/Zone4/Layers/Soil/Layer_Bedrock_Light_2.json", "Server/World/Default/Zones/Noise/Zone4/Layers/Soil/Layer_Bedrock_Light_3.json", "Server/World/Default/Zones/Noise/Zone4/Layers/Soil/Layer_Bedrock_Medium_1.json", "Server/World/Default/Zones/Noise/Zone4/Layers/Soil/Layer_Bedrock_Medium_2.json", "Server/World/Default/Zones/Noise/Zone4/NoiseMasks/Monuments_Zone4_Tier4_Mask.json", "Server/World/Default/Zones/Noise/Zone4/NoiseMasks/Monuments_Zone4_Tier4_Mask_DungeonOnly.json", "Server/World/Default/Zones/Noise/Zone4/NoiseMasks/Monuments_Zone4_Tier5_Mask.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Kweebec_Mixed_Beech.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Kweebec_Mixed_Birch.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Kweebec_Mixed_Oak.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Mixed_Beech.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Mixed_Birch.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Mixed_Misc.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Forest_Mixed_Oak.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Birch.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Birch_Ponds.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Birch_Young.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Smooth_Ash.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Smooth_Grove.json", "Server/World/Default/Zones/Zone1_Tier1/PrefabPatterns/Plains_Smooth_Oak.json", "Server/World/Default/Zones/Zone1_Tier1/Tile.Forest_Birch.json", "Server/World/Default/Zones/Zone1_Tier1/Tile.Forest_Flower.json", "Server/World/Default/Zones/Zone1_Tier1/Tile.Plains_Birch.json", "Server/World/Default/Zones/Zone1_Tier1/Tile.Plains_Smooth.json", "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Forest_Aspen.json", "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Forest_Aspen_Beech.json", "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Forest_Aspen_Birch.json", "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Plains_Birch_Young.json", "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Plains_Tallgrass_Ash.json", "Server/World/Default/Zones/Zone1_Tier2/PrefabPatterns/Plains_Tallgrass_Oak.json", "Server/World/Default/Zones/Zone1_Tier2/Tile.Forest_Aspen.json", "Server/World/Default/Zones/Zone1_Tier2/Tile.Forest_Gully.json", "Server/World/Default/Zones/Zone1_Tier2/Tile.Plains_Gorge.json", "Server/World/Default/Zones/Zone1_Tier2/Tile.Plains_Tallgrass.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Azure.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Moss_Ash.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Moss_Oak.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Moss_Oak_Small.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Moss_Oak_Young.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Swamp_Ash.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Swamp_Ash_Small.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Swamp_Ash_Young.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Forest_Swamp_Oak.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Plains_Gorge_Chalk_Ash.json", "Server/World/Default/Zones/Zone1_Tier3/PrefabPatterns/Plains_Gorge_Chalk_Oak.json", "Server/World/Default/Zones/Zone1_Tier3/Tile.Forest_Autumn.json", "Server/World/Default/Zones/Zone1_Tier3/Tile.Forest_Azure.json", "Server/World/Default/Zones/Zone1_Tier3/Tile.Forest_Moss.json", "Server/World/Default/Zones/Zone1_Tier3/Tile.Forest_Swamp.json", "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Boab_Forest.json", "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Boab_Trees_Dry.json", "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Rock_Cactus.json", "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Trees_Boab.json", "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Trees_Dry.json", "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Trees_Forest_Dry.json", "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Savannah_Trees_Forest_Gum.json", "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Scrub_Trees.json", "Server/World/Default/Zones/Zone2_Tier1/PrefabPatterns/Scrub_Trees_Gum.json", "Server/World/Default/Zones/Zone2_Tier1/Tile.Savannah_Boab.json", "Server/World/Default/Zones/Zone2_Tier1/Tile.Savannah_Forest.json", "Server/World/Default/Zones/Zone2_Tier1/Tile.Savannah_Plains.json", "Server/World/Default/Zones/Zone2_Tier1/Tile.Savannah_Rock.json", "Server/World/Default/Zones/Zone2_Tier1/Tile.Scrub_Bushland.json", "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Desert_Cactus.json", "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Desert_Rock_Cactus.json", "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Desert_Rock_Dry_Dead.json", "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Desert_Rock_Palo.json", "Server/World/Default/Zones/Zone2_Tier2/PrefabPatterns/Savannah_Rock_Cactus.json", "Server/World/Default/Zones/Zone2_Tier2/Tile.Desert_Oasis.json", "Server/World/Default/Zones/Zone2_Tier2/Tile.Desert_Red.json", "Server/World/Default/Zones/Zone2_Tier2/Tile.Desert_Rock.json", "Server/World/Default/Zones/Zone2_Tier2/Tile.Desert_Springs.json", "Server/World/Default/Zones/Zone2_Tier3/Tile.Desert_Barren.json", "Server/World/Default/Zones/Zone2_Tier3/Tile.Desert_Mushroom.json", "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Fir.json", "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Fir_Valley.json", "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Plains_Shire.json", "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Redwood_Thick.json", "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Redwood_Thin.json", "Server/World/Default/Zones/Zone3_Tier1/PrefabPatterns/Forest_Tundra.json", "Server/World/Default/Zones/Zone3_Tier1/Tile.Forest_Fir.json", "Server/World/Default/Zones/Zone3_Tier1/Tile.Forest_Redwood.json", "Server/World/Default/Zones/Zone3_Tier1/Tile.Forest_Tundra.json", "Server/World/Default/Zones/Zone3_Tier1/Tile.Plains_Hotsprings.json", "Server/World/Default/Zones/Zone3_Tier1/Tile.Plains_Shire.json", "Server/World/Default/Zones/Zone3_Tier2/Custom.Valley_Glacier.json", "Server/World/Default/Zones/Zone3_Tier2/PrefabPatterns/Forest_Cedar_Thick.json", "Server/World/Default/Zones/Zone3_Tier2/PrefabPatterns/Forest_Cedar_Thin.json", "Server/World/Default/Zones/Zone3_Tier2/PrefabPatterns/Forest_Fir.json", "Server/World/Default/Zones/Zone3_Tier2/PrefabPatterns/Forest_Fir_Valley.json", "Server/World/Default/Zones/Zone3_Tier2/Tile.Forest_Cedar.json", "Server/World/Default/Zones/Zone3_Tier2/Tile.Forest_Cedar_Mixed.json", "Server/World/Default/Zones/Zone3_Tier2/Tile.Plains_Frozen.json", "Server/World/Default/Zones/Zone3_Tier2/Tile.Plains_Tundra.json", "Server/World/Default/Zones/Zone3_Tier3/PrefabPatterns/Forest_Fir.json", "Server/World/Default/Zones/Zone3_Tier3/PrefabPatterns/Forest_Fir_Frozen.json", "Server/World/Default/Zones/Zone3_Tier3/PrefabPatterns/Forest_Fir_Frozen_Frost.json", "Server/World/Default/Zones/Zone3_Tier3/PrefabPatterns/Forest_Fir_Frozen_Light.json", "Server/World/Default/Zones/Zone3_Tier3/Tile.Forest_Frozen.json", "Server/World/Default/Zones/Zone3_Tier3/Tile.Forest_Frozen_Light.json", "Server/World/Default/Zones/Zone3_Tier3/Tile.Plains_Frozen_Frost.json", "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Ghost_Trees_Dense.json", "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Ghost_Trees_Sparse.json", "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Grasslands_Trees_Forest.json", "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Grasslands_Trees_Plains.json", "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Swamp_Bramble.json", "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Forest_Swamp_Trees_Dense.json", "Server/World/Default/Zones/Zone4_Tier4/PrefabPatterns/Wastes_Geysers_Stumps.json", "Server/World/Default/Zones/Zone4_Tier4/Tile.Desert_Dunes.json", "Server/World/Default/Zones/Zone4_Tier4/Tile.Forest_Ghost.json", "Server/World/Default/Zones/Zone4_Tier4/Tile.Forest_Swamp.json", "Server/World/Default/Zones/Zone4_Tier4/Tile.Wastes_Geysers.json", "Server/World/Default/Zones/Zone4_Tier4/Tile.Wastes_Grasslands.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Forest_Burned_Trees_Dense.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Forest_Burned_Trees_Sparse.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Forest_Roots_Trees_Dense.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Bamboo.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Bamboo_Young.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest_Bamboo.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest_Small.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Dense_Forest_Young.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Forest_Bamboo.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Jungle_Mushroom_Walls.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Lava_Fields_Stumps.json", "Server/World/Default/Zones/Zone4_Tier5/PrefabPatterns/Wastes_Ash_Stumps.json", "Server/World/Default/Zones/Zone4_Tier5/Tile.Desert_Ash.json", "Server/World/Default/Zones/Zone4_Tier5/Tile.Forest_Burned.json", "Server/World/Default/Zones/Zone4_Tier5/Tile.Forest_Roots.json", "Server/World/Default/Zones/Zone4_Tier5/Tile.Wastes_Ash.json", "Server/World/Default/Zones/Zone4_Tier5/Tile.Wastes_Lava.json"];
