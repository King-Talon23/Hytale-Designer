// Made by dev/make-scene-data.py from the game's own definitions: which of the player's game files the in-game backgrounds
// and the move set pieces are built from. Paths, names and colours only.
export const ZONES = {"1": "Emerald Grove", "2": "Howling Sands", "3": "Borea", "4": "Devastated Lands", "5": "Ocean"};
export const SCENES = {
 "meadow": {
  "zone": 1,
  "name": "Meadow",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Plains1/Plains1_Oak.json",
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
    "Plant_Grass_Sharp",
    24,
    2
   ],
   [
    "Plant_Grass_Sharp_Tall",
    10
   ],
   [
    "Plant_Grass_Sharp_Wild",
    4
   ],
   [
    "Plant_Flower_Common_Red2",
    2,
    1
   ],
   [
    "Plant_Flower_Common_Cyan2",
    2,
    1
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_001.prefab.json"
  ],
  "chip": [
   "#077ad9",
   "#629625"
  ]
 },
 "hills": {
  "zone": 1,
  "name": "Hills",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Plains1/Plains1_Hills.json",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 5,
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
    "Plant_Flower_Common_White",
    2,
    1
   ],
   [
    "Plant_Flower_Tall_Purple",
    2
   ],
   [
    "Plant_Bush_Green",
    2,
    2
   ]
  ],
  "density": 0.45,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json"
  ],
  "chip": [
   "#077ad9",
   "#629625"
  ]
 },
 "gorges": {
  "zone": 1,
  "name": "Gorges",
  "weather": "Server/Weathers/Zone1/Zone1_Cloudy_Medium.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Plains1/Plains1_Gorges.json",
  "ground": "Soil_Grass_Deep",
  "under": "Rock_Stone",
  "hills": 7,
  "plants": [
   [
    "Plant_Grass_Lush_Short",
    10,
    1
   ],
   [
    "Plant_Grass_Lush",
    10,
    2
   ],
   [
    "Plant_Grass_Lush_Tall",
    8
   ],
   [
    "Plant_Bush",
    4,
    2
   ],
   [
    "Plant_Bush_Green",
    4,
    2
   ],
   [
    "Plant_Reeds_Marsh",
    3
   ],
   [
    "Plant_Fern_Wet_Big",
    3
   ]
  ],
  "density": 0.5,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Beech/Stage_1/Beech_Stage1_001.prefab.json"
  ],
  "chip": [
   "#1983d9",
   "#4d8622"
  ]
 },
 "riverbank": {
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
  "zone": 1,
  "name": "Riverbank",
  "weather": "Server/Weathers/Zone1/Zone1_Sunny_Fireflies.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Plains1/Plains1_River.json",
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
   ],
   [
    "Plant_Fern_Wet_Big",
    2
   ]
  ],
  "density": 0.5,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Beech_Fallen/Stage_1/Beech_Fallen_Stage1_003.prefab.json"
  ],
  "chip": [
   "#1983d9",
   "#71972a"
  ]
 },
 "trork": {
  "zone": 1,
  "name": "Trork Lands",
  "weather": "Server/Weathers/Zone1/Zone1_Autumn_Forest_Windy.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Plains1/Plains1_Trork.json",
  "ground": "Soil_Grass_Deep",
  "under": "Soil_Dirt_Burnt",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Sharp",
    12,
    2
   ],
   [
    "Plant_Bush_Dead_Tall",
    6
   ],
   [
    "Plant_Grass_Lush_Short",
    10,
    1
   ],
   [
    "Plant_Bramble_Dry_Twisted",
    1,
    2
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Aspen_Fallen/Trees_Aspen_Fallen_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Maple_Stumps/Maple_Stumps_001.prefab.json"
  ],
  "chip": [
   "#077ddd",
   "#588721"
  ]
 },
 "desert": {
  "zone": 2,
  "name": "Desert",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "ground": "Soil_Sand",
  "under": "Soil_Sand",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Arid_Short",
    10,
    1
   ],
   [
    "Plant_Grass_Arid",
    6,
    2
   ],
   [
    "Plant_Bush_Arid",
    3
   ]
  ],
  "density": 0.08,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_2/Dry_Dead_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_5/Petrified_Dead_Stage5_001.prefab.json"
  ],
  "chip": [
   "#0081b2",
   "#cfa644"
  ]
 },
 "oasis": {
  "zone": 2,
  "name": "Oasis",
  "weather": "Server/Weathers/Zone2/Zone2_Cloudy_Light.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Desert1/Desert1_Oasis.json",
  "ground": "Soil_Grass",
  "under": "Soil_Sand_White",
  "hills": 1,
  "plants": [
   [
    "Plant_Grass_Lush_Short",
    14,
    1
   ],
   [
    "Plant_Grass_Lush",
    8,
    2
   ],
   [
    "Plant_Fern_Tall",
    3
   ],
   [
    "Plant_Bush_Arid",
    2
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Palm_Green/Stage_3/Palm_Green_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Palm_Green/Stage_2/Palm_Green_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Boab/Stage_1/Boab_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Gum/Stage_0/Gum_Stage0_001.prefab.json"
  ],
  "chip": [
   "#659099",
   "#758c2d"
  ]
 },
 "rocky": {
  "zone": 2,
  "name": "Rocky Desert",
  "weather": "Server/Weathers/Zone2/Zone2_Blazing_Light.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Desert1/Desert1_Rocky.json",
  "ground": "Soil_Sand_White",
  "under": "Rock_Sandstone",
  "hills": 6,
  "plants": [
   [
    "Plant_Grass_Arid_Short",
    10,
    1
   ],
   [
    "Plant_Grass_Arid",
    6,
    2
   ],
   [
    "Plant_Bush_Arid",
    3
   ],
   [
    "Plant_Grass_Arid_Short",
    4,
    1
   ]
  ],
  "density": 0.1,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Palm/Stage_2/Palm_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_001.prefab.json"
  ],
  "chip": [
   "#30aaeb",
   "#e0c569"
  ]
 },
 "desertriver": {
  "water": {
   "kind": "river",
   "bed": "Soil_Gravel_Sand",
   "plants": [],
   "density": 0
  },
  "zone": 2,
  "name": "Dry River",
  "weather": "Server/Weathers/Zone2/Zone2_Sunny.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Desert1/Desert1_River.json",
  "ground": "Soil_Gravel_Sand",
  "under": "Soil_Clay_Orange",
  "hills": 1,
  "plants": [
   [
    "Plant_Grass_Arid_Short",
    10,
    1
   ],
   [
    "Plant_Grass_Arid",
    6,
    2
   ],
   [
    "Plant_Bush_Arid",
    3
   ]
  ],
  "density": 0.12,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Palo/Stage_3/Palo_Stage3_001.prefab.json"
  ],
  "treeCount": 16,
  "chip": [
   "#0081b2",
   "#c39b48"
  ]
 },
 "desertshore": {
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
  "zone": 2,
  "name": "Desert Shore",
  "weather": "Server/Weathers/Zone2/Zone2_Desert_Haze.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Desert1/Desert1_Shore.json",
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
  "chip": [
   "#6fa6d0",
   "#e0c569"
  ]
 },
 "tundra": {
  "zone": 3,
  "name": "Snow",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Light.json",
  "ground": "Soil_Snow",
  "under": "Soil_Snow",
  "hills": 3,
  "plants": [
   [
    "Plant_Bush_Winter_Snow",
    4
   ],
   [
    "Plant_Bramble_Winter",
    3,
    2
   ]
  ],
  "density": 0.06,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_1/Fir_Snow_Stage1_001.prefab.json"
  ],
  "chip": [
   "#699bd4",
   "#dbf0f5"
  ]
 },
 "glacier": {
  "zone": 3,
  "name": "Glacier",
  "weather": "Server/Weathers/Zone3/Zone3_Snow_Heavy.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Boreal1/Boreal1_Henges.json",
  "ground": "Rock_Ice",
  "under": "Rock_Ice_Permafrost",
  "hills": 6,
  "plants": [
   [
    "Plant_Bush_Winter_Snow",
    3
   ],
   [
    "Plant_Bramble_Winter",
    2,
    2
   ]
  ],
  "density": 0.03,
  "trees": [],
  "treeCount": 0,
  "chip": [
   "#dde9f0",
   "#ceeaf9"
  ]
 },
 "taiga": {
  "zone": 3,
  "name": "Taiga",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Taiga1/Taiga1_Mountains.json",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 6,
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
    "Plant_Flower_Hemlock",
    2,
    2
   ],
   [
    "Plant_Flower_Tall_Pink",
    2
   ]
  ],
  "density": 0.4,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Cedar/Stage_1/Cedar_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_001.prefab.json"
  ],
  "chip": [
   "#2f4a86",
   "#bd9c4e"
  ]
 },
 "redwood": {
  "zone": 3,
  "name": "Redwood Forest",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Light.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Taiga1/Taiga1_Redwood.json",
  "ground": "Soil_Needles",
  "under": "Soil_Dirt",
  "hills": 2,
  "plants": [
   [
    "Plant_Grass_Sharp_Tall",
    8
   ],
   [
    "Plant_Grass_Sharp_Wild",
    5
   ],
   [
    "Plant_Bush_Lush",
    3,
    2
   ],
   [
    "Plant_Fern_Winter",
    4,
    2
   ]
  ],
  "density": 0.3,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Redwood/Stage_2/Redwood_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Redwood/Stage_1/Redwood_Stage1_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Cedar/Stage_1/Cedar_Stage1_001.prefab.json",
   "Server/Prefabs/Trees/Redwood_Logs/Redwood_Logs_001.prefab.json"
  ],
  "treeCount": 40,
  "chip": [
   "#699bd4",
   "#603b25"
  ]
 },
 "taigariver": {
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
  "zone": 3,
  "name": "Cold River",
  "weather": "Server/Weathers/Zone3/Zone3_Rain.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Taiga1/Taiga1_River.json",
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
    "Plant_Reeds_Winter",
    3
   ],
   [
    "Plant_Flower_Common_Blue",
    2,
    1
   ],
   [
    "Plant_Fern_Winter",
    2,
    2
   ]
  ],
  "density": 0.4,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json",
   "Server/Prefabs/Trees/Cedar_Logs/Small/Cedar_Logs_001.prefab.json"
  ],
  "chip": [
   "#cedbdb",
   "#bd9c4e"
  ]
 },
 "taigashore": {
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
  "zone": 3,
  "name": "Cold Shore",
  "weather": "Server/Weathers/Zone3/Zone3_Cloudy_Light.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Taiga1/Taiga1_Shore.json",
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
  "chip": [
   "#699bd4",
   "#c39b48"
  ]
 },
 "hedera": {
  "zone": 3,
  "name": "Hedera",
  "weather": "Server/Weathers/Zone3/Zone3_Hedera.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Boreal1/Boreal1_Hedera.json",
  "ground": "Plant_Moss_Block_Blue",
  "under": "Soil_Dirt_Cold",
  "hills": 3,
  "plants": [
   [
    "Plant_Moss_Short_Blue",
    8,
    1
   ],
   [
    "Plant_Moss_Blue",
    6,
    1
   ],
   [
    "Plant_Grass_Gnarled",
    5,
    2
   ],
   [
    "Plant_Bush_Lush",
    3,
    2
   ],
   [
    "Plant_Reeds_Water",
    2
   ]
  ],
  "density": 0.35,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Mushroom/Mushroom_007.prefab.json",
   "Server/Prefabs/Orbis/Trees/Ash_Swamp_Dead/Stage_3/Ash_Swamp_Dead_Stage3_001.prefab.json"
  ],
  "chip": [
   "#aad5e0",
   "#0e6847"
  ]
 },
 "volcanic": {
  "zone": 4,
  "name": "Jungle",
  "weather": "Server/Weathers/Zone4/Zone4_Light.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Volcanic1/Volcanic1_Jungle.json",
  "ground": "Soil_Grass",
  "under": "Soil_Dirt",
  "hills": 3,
  "plants": [
   [
    "Plant_Grass_Lush_Short",
    20,
    1
   ],
   [
    "Plant_Grass_Sharp",
    16,
    2
   ],
   [
    "Plant_Grass_Sharp_Tall",
    10
   ],
   [
    "Plant_Grass_Sharp_Wild",
    6
   ],
   [
    "Plant_Fern_Tall",
    6
   ],
   [
    "Plant_Bush_Jungle",
    4
   ],
   [
    "Plant_Bush_Dead_Twisted",
    1
   ]
  ],
  "density": 0.5,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Banyan/Stage_3/Banyan_Stage3_001.prefab.json",
   "Server/Prefabs/Trees/Jungle/Stage_2/Jungle_Stage_2_001.prefab.json",
   "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_2/Fig_Blue_Stage2_001.prefab.json"
  ],
  "chip": [
   "#67352c",
   "#4b8227"
  ]
 },
 "caldera": {
  "zone": 4,
  "name": "Caldera",
  "weather": "Server/Weathers/Zone4/Zone4_Lava_Fields.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Volcanic1/Volcanic1_Caldera.json",
  "ground": "Soil_Ash",
  "under": "Rock_Volcanic",
  "hills": 6,
  "plants": [
   [
    "Plant_Bush_Dead_Twisted",
    2
   ]
  ],
  "density": 0.02,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_001.prefab.json"
  ],
  "treeCount": 8,
  "chip": [
   "#cd875c",
   "#373838"
  ]
 },
 "ashriver": {
  "water": {
   "kind": "river",
   "bed": "Soil_Sand_Ashen",
   "plants": [],
   "density": 0
  },
  "zone": 4,
  "name": "Ashen River",
  "weather": "Server/Weathers/Zone4/Zone4_Wastes.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Volcanic1/Volcanic1_River.json",
  "ground": "Soil_Sand_Ashen",
  "under": "Rock_Volcanic",
  "hills": 1,
  "plants": [
   [
    "Plant_Bush_Dead_Twisted",
    2
   ],
   [
    "Plant_Grass_Arid_Short",
    3,
    1
   ]
  ],
  "density": 0.05,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Palo/Stage_3/Palo_Stage3_001.prefab.json"
  ],
  "treeCount": 14,
  "chip": [
   "#a6adcb",
   "#9b9b8e"
  ]
 },
 "ashshore": {
  "water": {
   "kind": "shore",
   "bed": "Soil_Sand_Ashen",
   "plants": [],
   "density": 0
  },
  "zone": 4,
  "name": "Ashen Shore",
  "weather": "Server/Weathers/Zone4/Zone4_Storm.json",
  "tintFrom": "Server/HytaleGenerator/Biomes/Volcanic1/Volcanic1_Shore.json",
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
  "chip": [
   "#9ea8a8",
   "#9b9b8e"
  ]
 },
 "ocean": {
  "zone": 5,
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
  "plants": [
   [
    "Plant_Grass_Arid_Short",
    4,
    1
   ]
  ],
  "density": 0.05,
  "trees": [
   "Server/Prefabs/Orbis/Trees/Palm/Stage_2/Palm_Stage2_001.prefab.json"
  ],
  "treeCount": 10,
  "chip": [
   "#077ad9",
   "#cfa644"
  ]
 }
};
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
 "Plant_Grass_Sharp_Wild": {
  "model": "Blocks/Foliage/Grass/Dense_VeryTall_4Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_VeryTall_4Rows_Sharp.png"
  ],
  "tint": "#67b62d"
 },
 "Plant_Flower_Common_Red2": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Red.png"
  ]
 },
 "Plant_Flower_Common_Cyan2": {
  "model": "Blocks/Foliage/Flowers/Flower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Flower_Textures/Cyan.png"
  ]
 },
 "Wood_Oak_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Oak_Side.png",
   "top": "BlockTextures/Wood_Trunk_Oak_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Oak_Full.png"
  }
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
 "Wood_Oak_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Oak.png"
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
 "Wood_Oak_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Oak.png"
  ]
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
 "Wood_Beech_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Beech_Side.png",
   "top": "BlockTextures/Wood_Trunk_Beech_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Beech_Full.png"
  }
 },
 "Wood_Beech_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Beech.png"
  ]
 },
 "Wood_Beech_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Beech_Side.png",
   "top": "BlockTextures/Wood_Trunk_Beech_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Beech_Top.png"
  }
 },
 "Plant_Grass_Sharp_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Sharp_Short_GS.png"
  ],
  "tint": "#67b62d"
 },
 "Plant_Flower_Common_White": {
  "model": "Blocks/Foliage/Flowers/Hydrangea.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Hydrangea_White.png"
  ]
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
 "Plant_Grass_Lush": {
  "model": "Blocks/Foliage/Plants/Cross_17px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_17px_Textures/Grassplant_Lush_GS.png"
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
 "Plant_Bush": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Green.png"
  ]
 },
 "Plant_Reeds_Marsh": {
  "model": "Blocks/Foliage/Plants/Reeds.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Reeds_Textures/Reeds_Marsh.png"
  ]
 },
 "Plant_Fern_Wet_Big": {
  "model": "Blocks/Foliage/Plants/Fern_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Big_Textures/Wet.png"
  ],
  "tint": "#C6C6C6"
 },
 "Soil_Gravel": {
  "cube": {
   "side": "BlockTextures/Soil_Gravel.png",
   "top": "BlockTextures/Soil_Gravel.png",
   "bottom": "BlockTextures/Soil_Gravel.png"
  }
 },
 "Plant_Fern_Forest": {
  "model": "Blocks/Foliage/Plants/Fern_Small.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Small_GS.png"
  ],
  "tint": "#686868"
 },
 "Plant_Flower_Bushy_Green": {
  "model": "Blocks/Foliage/Plants/Nettle.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Nettle_Textures/default.png"
  ]
 },
 "Plant_Seaweed_Grass": {
  "model": "Blocks/Foliage/Grass/Dense_Small_4Rows.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/Seaweeds_GS.png"
  ],
  "tint": "#37ae8f"
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
 "Soil_Dirt_Burnt": {
  "cube": {
   "side": "BlockTextures/Soil_Dirt_Burnt.png",
   "top": "BlockTextures/Soil_Dirt_Burnt.png",
   "bottom": "BlockTextures/Soil_Dirt_Burnt.png"
  }
 },
 "Plant_Bush_Dead_Tall": {
  "model": "Blocks/Foliage/Plants/Shrub.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Shrub_Winter.png"
  ]
 },
 "Plant_Bramble_Dry_Twisted": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Brambles.png"
  ]
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
 "Wood_Aspen_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Aspen.png"
  ]
 },
 "Wood_Aspen_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Aspen_Side.png",
   "top": "BlockTextures/Wood_Trunk_Aspen_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Aspen_Full.png"
  }
 },
 "Wood_Aspen_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Aspen_Side.png",
   "top": "BlockTextures/Wood_Trunk_Aspen_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Aspen_Top.png"
  }
 },
 "Wood_Aspen_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Aspen.png"
  ]
 },
 "Plant_Crop_Mushroom_Block_Yellow": {
  "cube": {
   "side": "BlockTextures/Mushroom_Block_Yellow.png",
   "top": "BlockTextures/Mushroom_Block_Top_Yellow.png",
   "bottom": "BlockTextures/Mushroom_Block_Top_Yellow.png"
  }
 },
 "Plant_Crop_Mushroom_Shelve_Yellow": {
  "model": "Blocks/Foliage/Plants/Mushroom_Medium.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Medium_Textures/Yellow.png"
  ]
 },
 "Plant_Crop_Mushroom_Common_Brown": {
  "model": "Blocks/Foliage/Plants/Mushroom.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Textures/Brown.png"
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
 "Soil_Sand": {
  "cube": {
   "side": "BlockTextures/Soil_Sand.png",
   "top": "BlockTextures/Soil_Sand.png",
   "bottom": "BlockTextures/Soil_Sand.png"
  }
 },
 "Plant_Grass_Arid_Short": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Grassplant_Dry_Short_GS.png"
  ],
  "tint": "#e4c945"
 },
 "Plant_Grass_Arid": {
  "model": "Blocks/Foliage/Plants/Cross_25px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Textures/Grassplant_Dry_GS.png"
  ],
  "tint": "#e4c945"
 },
 "Plant_Bush_Arid": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Arid.png"
  ]
 },
 "Wood_Dry_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Dry.png"
  ]
 },
 "Wood_Dry_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Dry.png",
   "top": "BlockTextures/Wood_Trunk_Dry_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Dry_Full.png"
  }
 },
 "Wood_Dry_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
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
 "Wood_Dry_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Dry.png"
  ]
 },
 "Wood_Dry_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Dry.png"
  ]
 },
 "Wood_Petrified_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Petrified_Side.png",
   "top": "BlockTextures/Wood_Trunk_Petrified_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Petrified_Full.png"
  }
 },
 "Soil_Sand_White": {
  "cube": {
   "side": "BlockTextures/Soil_Sand_White.png",
   "top": "BlockTextures/Soil_Sand_White.png",
   "bottom": "BlockTextures/Soil_Sand_White.png"
  }
 },
 "Plant_Fern_Tall": {
  "model": "Blocks/Foliage/Grass/Fern.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/Fern_Texture.png"
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
 "Wood_Gumboab_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Gumboab_Side.png",
   "top": "BlockTextures/Wood_Trunk_Gumboab_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Gumboab_Full.png"
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
 "Wood_Bottletree_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Bottle.png"
  ]
 },
 "Rock_Sandstone": {
  "cube": {
   "side": "BlockTextures/Rock_Sandstone_Side.png",
   "top": "BlockTextures/Rock_Sandstone_Top.png",
   "bottom": "BlockTextures/Rock_Sandstone_Top.png"
  }
 },
 "Plant_Leaves_Dry": {
  "model": "Blocks/Foliage/Leaves/DownShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/DownShape_Textures/Dry.png"
  ]
 },
 "Plant_Leaves_Palm_Arid": {
  "model": "Blocks/Foliage/Plants/Palm_Giant.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Palm_Giant_default.png"
  ]
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
 "Wood_Palo_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Palo.png",
   "top": "BlockTextures/Wood_Trunk_Palo_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Palo_Top.png"
  }
 },
 "Plant_Leaves_Palo": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Palo.png"
  ]
 },
 "Soil_Snow": {
  "cube": {
   "side": "BlockTextures/Soil_Snow.png",
   "top": "BlockTextures/Soil_Snow.png",
   "bottom": "BlockTextures/Soil_Snow.png"
  }
 },
 "Plant_Bush_Winter_Snow": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Snow.png"
  ]
 },
 "Plant_Bramble_Winter": {
  "model": "Blocks/Foliage/Plants/Cross.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Textures/Bramble_Winter.png"
  ]
 },
 "Wood_Fir_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Spruce.png"
  ]
 },
 "Wood_Fir_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Spruce.png"
  ]
 },
 "Wood_Fir_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Fir_Trunk_Side.png",
   "top": "BlockTextures/Wood_Fir_Trunk_Full.png",
   "bottom": "BlockTextures/Wood_Fir_Trunk_Full.png"
  }
 },
 "Plant_Leaves_Fir_Snow": {
  "model": "Blocks/Foliage/Leaves/PineShape_NSEW.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine_Snowy.png"
  ]
 },
 "Wood_Fir_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Fir_Trunk_Side.png",
   "top": "BlockTextures/Wood_Fir_Trunk_Top.png",
   "bottom": "BlockTextures/Wood_Fir_Trunk_Top.png"
  }
 },
 "Plant_Leaves_Fir_Tip_Snow": {
  "model": "Blocks/Foliage/Leaves/PineShape_Tip.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine_Snowy.png"
  ]
 },
 "Wood_Fir_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Spruce.png"
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
 "Plant_Flower_Hemlock": {
  "model": "Blocks/Foliage/Plants/Hemlock.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Hemlock_Texture.png"
  ]
 },
 "Plant_Flower_Tall_Pink": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Arid_Magnolia.png"
  ]
 },
 "Plant_Leaves_Cedar": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar.png",
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar2.png"
  ]
 },
 "Wood_Cedar_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
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
 "Plant_Leaves_Fir_Tip": {
  "model": "Blocks/Foliage/Leaves/PineShape_Tip.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine.png"
  ]
 },
 "Plant_Leaves_Fir": {
  "model": "Blocks/Foliage/Leaves/PineShape_NSEW.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine.png"
  ]
 },
 "Soil_Needles": {
  "cube": {
   "side": "BlockTextures/Soil_Needles.png",
   "top": "BlockTextures/Soil_Needles.png",
   "bottom": "BlockTextures/Soil_Needles.png"
  }
 },
 "Plant_Bush_Lush": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Green_Dark.png"
  ]
 },
 "Plant_Fern_Winter": {
  "model": "Blocks/Foliage/Plants/Fern_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Fern_Big_Textures/GS.png"
  ],
  "tint": "#686868"
 },
 "Wood_Redwood_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_RedWood.png",
   "top": "BlockTextures/Wood_Trunk_RedWood_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_RedWood_Top.png"
  }
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
 "Wood_Redwood_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Redwood.png"
  ]
 },
 "Wood_Redwood_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Redwood.png"
  ]
 },
 "Plant_Reeds_Winter": {
  "model": "Blocks/Foliage/Plants/ReedWinter.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/ReedWinter_Texture.png"
  ]
 },
 "Plant_Flower_Common_Blue": {
  "model": "Blocks/Foliage/Flowers/Flower.blockymodel",
  "tex": [
   "Blocks/Foliage/Flowers/Flower_Textures/Blue.png"
  ]
 },
 "Plant_Grass_Rocky": {
  "model": "Blocks/Foliage/Plants/Cross_17px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_17px_Textures/Rocky_GS.png"
  ],
  "tint": "#dcb86d"
 },
 "Wood_Burnt_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Burnt.png"
  ]
 },
 "Wood_Cedar_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Cedar.png"
  ]
 },
 "Wood_Burnt_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Burnt.png",
   "top": "BlockTextures/Wood_Trunk_Burnt_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Burnt_Top.png"
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
 "Soil_Dirt_Cold": {
  "cube": {
   "side": "BlockTextures/Soil_Dirt_Cold.png",
   "top": "BlockTextures/Soil_Dirt_Cold.png",
   "bottom": "BlockTextures/Soil_Dirt_Cold.png"
  }
 },
 "Plant_Moss_Short_Blue": {
  "model": "Blocks/Foliage/Plants/Cross_10px.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_10px_Textures/Moss_GS.png"
  ],
  "tint": "#159a6a"
 },
 "Plant_Moss_Blue": {
  "model": "Blocks/Foliage/Plants/Cross_Full.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_Full_Textures/Moss_GS.png"
  ],
  "tint": "#159a6a"
 },
 "Plant_Grass_Gnarled": {
  "model": "Blocks/Foliage/Plants/Cross.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Cross_25px_Textures/Gnarled.png"
  ],
  "tint": "#7f8a38"
 },
 "Plant_Reeds_Water": {
  "model": "Blocks/Foliage/Grass/VeryTall.blockymodel",
  "tex": [
   "Blocks/Foliage/Grass/VeryTall_Textures/Water_GS.png"
  ],
  "tint": "#698a38"
 },
 "Plant_Crop_Mushroom_Block_Brown_Mycelium": {
  "model": "Blocks/Foliage/Plants/Mycelium_Short.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mycelium_Short_Texture.png"
  ]
 },
 "Plant_Crop_Mushroom_Block_Brown": {
  "cube": {
   "side": "BlockTextures/Mushroom_Block_Brown.png",
   "top": "BlockTextures/Mushroom_Block_Top_Brown.png",
   "bottom": "BlockTextures/Mushroom_Block_Brown_Trunk_Top.png"
  }
 },
 "Plant_Crop_Mushroom_Shelve_Green": {
  "model": "Blocks/Foliage/Plants/Mushroom_Medium.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Mushroom_Medium_Textures/Green.png"
  ]
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
 "Wood_Ash_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Ash.png"
  ]
 },
 "Plant_Vine_Hanging": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Hanging_Lianas.png"
  ]
 },
 "Plant_Vine_Wall": {
  "model": "Blocks/Foliage/Plants/Ivy.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Ivy_Textures/default.png"
  ]
 },
 "Plant_Bush_Jungle": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Jungle_Green.png"
  ]
 },
 "Plant_Bush_Dead_Twisted": {
  "model": "Blocks/Foliage/Plants/Bush_Big.blockymodel",
  "tex": [
   "Blocks/Foliage/Plants/Bush_Big_Textures/Dead.png",
   "Blocks/Foliage/Plants/Bush_Big_Textures/Dead_Stem.png"
  ]
 },
 "Wood_Banyan_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_trunk_Banyan_Side.png",
   "top": "BlockTextures/Wood_trunk_Banyan_Full.png",
   "bottom": "BlockTextures/Wood_trunk_Banyan_Full.png"
  }
 },
 "Plant_Leaves_Banyan": {
  "model": "Blocks/Foliage/Leaves/DownShape.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/DownShape_Textures/Banyan.png"
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
 "Wood_Banyan_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Banyan.png"
  ]
 },
 "Wood_Jungle_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Jungle.png"
  ]
 },
 "Wood_Jungle_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Jungle.png"
  ]
 },
 "Wood_Jungle_Roots": {
  "model": "Blocks/Foliage/Tree/Roots.blockymodel",
  "tex": [
   "Blocks/Foliage/Tree/Roots_Textures/Jungle.png"
  ]
 },
 "Wood_Jungle_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Jungle_Side.png",
   "top": "BlockTextures/Wood_Trunk_Jungle_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Jungle_Full.png"
  }
 },
 "Wood_Jungle_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Jungle_Side.png",
   "top": "BlockTextures/Wood_Trunk_Jungle_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Jungle_Top.png"
  }
 },
 "Plant_Leaves_Jungle": {
  "model": "Blocks/Foliage/Leaves/Tropical.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Tropical_Wide.png"
  ]
 },
 "Wood_Fig_Blue_Trunk": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Fig_Blue_Side.png",
   "top": "BlockTextures/Wood_Trunk_Fig_Blue_Top.png",
   "bottom": "BlockTextures/Wood_Trunk_Fig_Blue_Top.png"
  }
 },
 "Wood_Fig_Blue_Branch_Long": {
  "model": "Blocks/Structures/Tubes/Long.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Fig_Blue.png"
  ]
 },
 "Wood_Fig_Blue_Branch_Corner": {
  "model": "Blocks/Structures/Tubes/Corner.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Fig_Blue.png"
  ]
 },
 "Plant_Leaves_Fig_Blue": {
  "model": "Blocks/Foliage/Leaves/Ball.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/Ball_Textures/Fig_Blue.png"
  ]
 },
 "Wood_Fig_Blue_Trunk_Full": {
  "cube": {
   "side": "BlockTextures/Wood_Trunk_Fig_Blue_Side.png",
   "top": "BlockTextures/Wood_Trunk_Fig_Blue_Full.png",
   "bottom": "BlockTextures/Wood_Trunk_Fig_Blue_Full.png"
  }
 },
 "Soil_Ash": {
  "cube": {
   "side": "BlockTextures/Soil_Ashes.png",
   "top": "BlockTextures/Soil_Ashes.png",
   "bottom": "BlockTextures/Soil_Ashes.png"
  }
 },
 "Rock_Volcanic": {
  "cube": {
   "side": "BlockTextures/Rock_Volcanic.png",
   "top": "BlockTextures/Rock_Volcanic.png",
   "bottom": "BlockTextures/Rock_Volcanic.png"
  }
 },
 "Wood_Ash_Branch_Short": {
  "model": "Blocks/Structures/Tubes/Short.blockymodel",
  "tex": [
   "Blocks/Structures/Tubes/Corner_Textures/Ash.png"
  ]
 },
 "Plant_Leaves_Dead": {
  "model": "Blocks/Foliage/Leaves/UpShapeSoft.blockymodel",
  "tex": [
   "Blocks/Foliage/Leaves/UpShapeSoft_Textures/Dead.png"
  ]
 },
 "Soil_Sand_Ashen": {
  "cube": {
   "side": "BlockTextures/Soil_Sand_Ashen.png",
   "top": "BlockTextures/Soil_Sand_Ashen.png",
   "bottom": "BlockTextures/Soil_Sand_Ashen.png"
  }
 },
 "Soil_Clay_Smooth_Black": {
  "cube": {
   "side": "BlockTextures/Clay_Smooth_Black.png",
   "top": "BlockTextures/Clay_Smooth_Black.png",
   "bottom": "BlockTextures/Clay_Smooth_Black.png"
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
export const SCENE_FILES = ["Common/BlockTextures/Clay_Orange.png", "Common/BlockTextures/Clay_Smooth_Black.png", "Common/BlockTextures/Moss_Block_GS.png", "Common/BlockTextures/Moss_Block_GS_Top.png", "Common/BlockTextures/Mushroom_Block_Brown.png", "Common/BlockTextures/Mushroom_Block_Brown_Trunk_Top.png", "Common/BlockTextures/Mushroom_Block_Top_Brown.png", "Common/BlockTextures/Mushroom_Block_Top_Yellow.png", "Common/BlockTextures/Mushroom_Block_Yellow.png", "Common/BlockTextures/Rock_Ice.png", "Common/BlockTextures/Rock_Ice_Blue.png", "Common/BlockTextures/Rock_Sandstone_Side.png", "Common/BlockTextures/Rock_Sandstone_Top.png", "Common/BlockTextures/Rock_Stone.png", "Common/BlockTextures/Rock_Stone_2.png", "Common/BlockTextures/Rock_Stone_3.png", "Common/BlockTextures/Rock_Volcanic.png", "Common/BlockTextures/Soil_Ashes.png", "Common/BlockTextures/Soil_Dirt.png", "Common/BlockTextures/Soil_Dirt_Burnt.png", "Common/BlockTextures/Soil_Dirt_Cold.png", "Common/BlockTextures/Soil_Dirt_Lush.png", "Common/BlockTextures/Soil_Grass_GS.png", "Common/BlockTextures/Soil_Grass_GS_02.png", "Common/BlockTextures/Soil_Grass_Lush_GS.png", "Common/BlockTextures/Soil_Grass_Lush_Side.png", "Common/BlockTextures/Soil_Grass_Lush_Top_GS.png", "Common/BlockTextures/Soil_Grass_Side.png", "Common/BlockTextures/Soil_Gravel.png", "Common/BlockTextures/Soil_Gravel_Sand.png", "Common/BlockTextures/Soil_Needles.png", "Common/BlockTextures/Soil_Sand.png", "Common/BlockTextures/Soil_Sand_Ashen.png", "Common/BlockTextures/Soil_Sand_White.png", "Common/BlockTextures/Soil_Snow.png", "Common/BlockTextures/Soil_grass_Side_Mask_GS.png", "Common/BlockTextures/Wood_Fir_Trunk_Full.png", "Common/BlockTextures/Wood_Fir_Trunk_Side.png", "Common/BlockTextures/Wood_Fir_Trunk_Top.png", "Common/BlockTextures/Wood_Softwood_Planks_02.png", "Common/BlockTextures/Wood_Softwood_Planks_03.png", "Common/BlockTextures/Wood_Softwood_Planks_Side.png", "Common/BlockTextures/Wood_Softwood_Planks_Top.png", "Common/BlockTextures/Wood_Trunk_Ash_Full.png", "Common/BlockTextures/Wood_Trunk_Ash_Side.png", "Common/BlockTextures/Wood_Trunk_Ash_Top.png", "Common/BlockTextures/Wood_Trunk_Aspen_Full.png", "Common/BlockTextures/Wood_Trunk_Aspen_Side.png", "Common/BlockTextures/Wood_Trunk_Aspen_Top.png", "Common/BlockTextures/Wood_Trunk_Beech_Full.png", "Common/BlockTextures/Wood_Trunk_Beech_Side.png", "Common/BlockTextures/Wood_Trunk_Beech_Top.png", "Common/BlockTextures/Wood_Trunk_Burnt.png", "Common/BlockTextures/Wood_Trunk_Burnt_Top.png", "Common/BlockTextures/Wood_Trunk_Cedar.png", "Common/BlockTextures/Wood_Trunk_Cedar_Top.png", "Common/BlockTextures/Wood_Trunk_CrimsonMaple_Full.png", "Common/BlockTextures/Wood_Trunk_CrimsonMaple_Side.png", "Common/BlockTextures/Wood_Trunk_CrimsonMaple_Top.png", "Common/BlockTextures/Wood_Trunk_Dry.png", "Common/BlockTextures/Wood_Trunk_Dry_Full.png", "Common/BlockTextures/Wood_Trunk_Dry_Top.png", "Common/BlockTextures/Wood_Trunk_Fig_Blue_Full.png", "Common/BlockTextures/Wood_Trunk_Fig_Blue_Side.png", "Common/BlockTextures/Wood_Trunk_Fig_Blue_Top.png", "Common/BlockTextures/Wood_Trunk_Gumboab_Full.png", "Common/BlockTextures/Wood_Trunk_Gumboab_Side.png", "Common/BlockTextures/Wood_Trunk_Gumboab_Top.png", "Common/BlockTextures/Wood_Trunk_Jungle_Full.png", "Common/BlockTextures/Wood_Trunk_Jungle_Side.png", "Common/BlockTextures/Wood_Trunk_Jungle_Top.png", "Common/BlockTextures/Wood_Trunk_Oak_Full.png", "Common/BlockTextures/Wood_Trunk_Oak_Side.png", "Common/BlockTextures/Wood_Trunk_Oak_Top.png", "Common/BlockTextures/Wood_Trunk_Palo.png", "Common/BlockTextures/Wood_Trunk_Palo_Full.png", "Common/BlockTextures/Wood_Trunk_Palo_Top.png", "Common/BlockTextures/Wood_Trunk_Petrified_Full.png", "Common/BlockTextures/Wood_Trunk_Petrified_Side.png", "Common/BlockTextures/Wood_Trunk_RedWood.png", "Common/BlockTextures/Wood_Trunk_RedWood_Full.png", "Common/BlockTextures/Wood_Trunk_RedWood_Top.png", "Common/BlockTextures/Wood_trunk_Banyan_Full.png", "Common/BlockTextures/Wood_trunk_Banyan_Side.png", "Common/BlockTextures/Wood_trunk_Banyan_Top.png", "Common/Blocks/Benches/Workbench.blockymodel", "Common/Blocks/Benches/Workbench_Texture.png", "Common/Blocks/Decorative_Sets/Village/Bed.blockymodel", "Common/Blocks/Decorative_Sets/Village/Bed_Texture.png", "Common/Blocks/Decorative_Sets/Village/Chair.blockymodel", "Common/Blocks/Decorative_Sets/Village/Chair_Texture.png", "Common/Blocks/Decorative_Sets/Village/Ladder.blockymodel", "Common/Blocks/Decorative_Sets/Village/Ladder_Texture.png", "Common/Blocks/Foliage/Flowers/Flower.blockymodel", "Common/Blocks/Foliage/Flowers/Flower_Textures/Blue.png", "Common/Blocks/Foliage/Flowers/Flower_Textures/Cyan.png", "Common/Blocks/Foliage/Flowers/Hydrangea.blockymodel", "Common/Blocks/Foliage/Flowers/Hydrangea_White.png", "Common/Blocks/Foliage/Grass/Bushy.blockymodel", "Common/Blocks/Foliage/Grass/Bushy_Grassplant_Lush_Tall_GS.png", "Common/Blocks/Foliage/Grass/Dense_Small_3Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/Seaweeds_GS.png", "Common/Blocks/Foliage/Grass/Dense_Small_4Rows_Textures/default.png", "Common/Blocks/Foliage/Grass/Dense_Tall_3Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_Tall_4Rows_Texture.png", "Common/Blocks/Foliage/Grass/Dense_VeryTall_4Rows.blockymodel", "Common/Blocks/Foliage/Grass/Dense_VeryTall_4Rows_Sharp.png", "Common/Blocks/Foliage/Grass/Fern.blockymodel", "Common/Blocks/Foliage/Grass/Fern_Texture.png", "Common/Blocks/Foliage/Grass/VeryTall.blockymodel", "Common/Blocks/Foliage/Grass/VeryTall_Textures/Seaweed_Tall_GS.png", "Common/Blocks/Foliage/Grass/VeryTall_Textures/Water_GS.png", "Common/Blocks/Foliage/Leaves/Ball.blockymodel", "Common/Blocks/Foliage/Leaves/Ball_Textures/Aspen.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Beech.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Birch.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Fig_Blue.png", "Common/Blocks/Foliage/Leaves/Ball_Textures/Oak.png", "Common/Blocks/Foliage/Leaves/DownShape.blockymodel", "Common/Blocks/Foliage/Leaves/DownShape_Textures/Banyan.png", "Common/Blocks/Foliage/Leaves/DownShape_Textures/Dry.png", "Common/Blocks/Foliage/Leaves/PineShape_NSEW.blockymodel", "Common/Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine.png", "Common/Blocks/Foliage/Leaves/PineShape_NSEW_Textures/Pine_Snowy.png", "Common/Blocks/Foliage/Leaves/PineShape_Tip.blockymodel", "Common/Blocks/Foliage/Leaves/Tropical.blockymodel", "Common/Blocks/Foliage/Leaves/Tropical_Wide.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft.blockymodel", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Bottle.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Cedar2.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Dead.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Palo.png", "Common/Blocks/Foliage/Leaves/UpShapeSoft_Textures/Redwood.png", "Common/Blocks/Foliage/Plants/Bush_Berry.blockymodel", "Common/Blocks/Foliage/Plants/Bush_Berry_Texture.png", "Common/Blocks/Foliage/Plants/Bush_Big.blockymodel", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Arid.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Arid_Magnolia.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Brambles.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Dead.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Dead_Stem.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Green.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Green_Dark.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Jungle_Green.png", "Common/Blocks/Foliage/Plants/Bush_Big_Textures/Winter_Snow.png", "Common/Blocks/Foliage/Plants/Cross.blockymodel", "Common/Blocks/Foliage/Plants/Cross_10px.blockymodel", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Sharp_Short_GS.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grass_Small.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Grassplant_Dry_Short_GS.png", "Common/Blocks/Foliage/Plants/Cross_10px_Textures/Moss_GS.png", "Common/Blocks/Foliage/Plants/Cross_17px.blockymodel", "Common/Blocks/Foliage/Plants/Cross_17px_Textures/Grassplant_Lush_GS.png", "Common/Blocks/Foliage/Plants/Cross_17px_Textures/Rocky_GS.png", "Common/Blocks/Foliage/Plants/Cross_25px.blockymodel", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Flower_Red.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Gnarled.png", "Common/Blocks/Foliage/Plants/Cross_25px_Textures/Grassplant_Dry_GS.png", "Common/Blocks/Foliage/Plants/Cross_Full.blockymodel", "Common/Blocks/Foliage/Plants/Cross_Full_Textures/Moss_GS.png", "Common/Blocks/Foliage/Plants/Cross_Textures/Bramble_Winter.png", "Common/Blocks/Foliage/Plants/Cross_Textures/Seaweed_Stackable.png", "Common/Blocks/Foliage/Plants/Dense_Tall.blockymodel", "Common/Blocks/Foliage/Plants/Dense_Tall_Textures/Lavender.png", "Common/Blocks/Foliage/Plants/Fern_Big.blockymodel", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/GS.png", "Common/Blocks/Foliage/Plants/Fern_Big_Textures/Wet.png", "Common/Blocks/Foliage/Plants/Fern_Small.blockymodel", "Common/Blocks/Foliage/Plants/Fern_Small_GS.png", "Common/Blocks/Foliage/Plants/Hemlock.blockymodel", "Common/Blocks/Foliage/Plants/Hemlock_Texture.png", "Common/Blocks/Foliage/Plants/Ivy.blockymodel", "Common/Blocks/Foliage/Plants/Ivy_Textures/default.png", "Common/Blocks/Foliage/Plants/Mushroom.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Medium.blockymodel", "Common/Blocks/Foliage/Plants/Mushroom_Medium_Textures/Green.png", "Common/Blocks/Foliage/Plants/Mushroom_Medium_Textures/Yellow.png", "Common/Blocks/Foliage/Plants/Mushroom_Textures/Brown.png", "Common/Blocks/Foliage/Plants/Mycelium_Short.blockymodel", "Common/Blocks/Foliage/Plants/Mycelium_Short_Texture.png", "Common/Blocks/Foliage/Plants/Nettle.blockymodel", "Common/Blocks/Foliage/Plants/Nettle_Textures/default.png", "Common/Blocks/Foliage/Plants/Palm_Giant.blockymodel", "Common/Blocks/Foliage/Plants/Palm_Giant_Dark.png", "Common/Blocks/Foliage/Plants/Palm_Giant_default.png", "Common/Blocks/Foliage/Plants/ReedWinter.blockymodel", "Common/Blocks/Foliage/Plants/ReedWinter_Texture.png", "Common/Blocks/Foliage/Plants/Reeds.blockymodel", "Common/Blocks/Foliage/Plants/Reeds_Textures/Reeds_Marsh.png", "Common/Blocks/Foliage/Plants/Shrub.blockymodel", "Common/Blocks/Foliage/Plants/Shrub_Winter.png", "Common/Blocks/Foliage/Tree/Roots.blockymodel", "Common/Blocks/Foliage/Tree/Roots_Textures/Ash.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Burnt.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Cedar.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Dry.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Hanging_Lianas.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Jungle.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Oak.png", "Common/Blocks/Foliage/Tree/Roots_Textures/Spruce.png", "Common/Blocks/Foliage/Water/Coral_Bush.blockymodel", "Common/Blocks/Foliage/Water/Coral_Bush_Small.blockymodel", "Common/Blocks/Foliage/Water/Coral_Bush_Small_Purple.png", "Common/Blocks/Foliage/Water/Coral_Bush_Textures/Cyan.png", "Common/Blocks/Foliage/Water/Coral_Bush_Textures/Pink.png", "Common/Blocks/Foliage/Water/Coral_Bush_Textures/Yellow.png", "Common/Blocks/Structures/Tubes/Corner.blockymodel", "Common/Blocks/Structures/Tubes/Corner_Textures/Ash.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Aspen.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Banyan.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Beech.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Birch.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Bottle.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Cedar.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Dry.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Fig_Blue.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Gumboab.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Jungle.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Oak.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Palm.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Palo.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Redwood.png", "Common/Blocks/Structures/Tubes/Corner_Textures/Spruce.png", "Common/Blocks/Structures/Tubes/Long.blockymodel", "Common/Blocks/Structures/Tubes/Short.blockymodel", "Common/Resources/Ingredients/Coconut.blockymodel", "Common/Resources/Ingredients/Coconut_Texture.png", "Server/HytaleGenerator/Biomes/Boreal1/Boreal1_Hedera.json", "Server/HytaleGenerator/Biomes/Boreal1/Boreal1_Henges.json", "Server/HytaleGenerator/Biomes/Desert1/Desert1_Oasis.json", "Server/HytaleGenerator/Biomes/Desert1/Desert1_River.json", "Server/HytaleGenerator/Biomes/Desert1/Desert1_Rocky.json", "Server/HytaleGenerator/Biomes/Desert1/Desert1_Shore.json", "Server/HytaleGenerator/Biomes/Ocean1/Oceans.json", "Server/HytaleGenerator/Biomes/Plains1/Plains1_Gorges.json", "Server/HytaleGenerator/Biomes/Plains1/Plains1_Hills.json", "Server/HytaleGenerator/Biomes/Plains1/Plains1_Oak.json", "Server/HytaleGenerator/Biomes/Plains1/Plains1_River.json", "Server/HytaleGenerator/Biomes/Plains1/Plains1_Trork.json", "Server/HytaleGenerator/Biomes/Taiga1/Taiga1_Mountains.json", "Server/HytaleGenerator/Biomes/Taiga1/Taiga1_Redwood.json", "Server/HytaleGenerator/Biomes/Taiga1/Taiga1_River.json", "Server/HytaleGenerator/Biomes/Taiga1/Taiga1_Shore.json", "Server/HytaleGenerator/Biomes/Volcanic1/Volcanic1_Caldera.json", "Server/HytaleGenerator/Biomes/Volcanic1/Volcanic1_Jungle.json", "Server/HytaleGenerator/Biomes/Volcanic1/Volcanic1_River.json", "Server/HytaleGenerator/Biomes/Volcanic1/Volcanic1_Shore.json", "Server/Prefabs/Orbis/Trees/Ash_Dead/Stage_2/Ash_Dead_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Ash_Swamp_Dead/Stage_3/Ash_Swamp_Dead_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_1/Aspen_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen/Stage_2/Aspen_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Aspen_Fallen/Trees_Aspen_Fallen_001.prefab.json", "Server/Prefabs/Orbis/Trees/Banyan/Stage_3/Banyan_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_1/Beech_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_2/Beech_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_3/Beech_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech/Stage_4/Beech_Stage4_001.prefab.json", "Server/Prefabs/Orbis/Trees/Beech_Fallen/Stage_1/Beech_Fallen_Stage1_003.prefab.json", "Server/Prefabs/Orbis/Trees/Birch/Stage_1/Birch_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Boab/Stage_1/Boab_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Cedar/Stage_1/Cedar_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Cedar_Burnt/Stage_2/Cedar_Burnt_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_1/Dry_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry/Stage_2/Dry_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Dry_Dead/Stage_2/Dry_Dead_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fig_Blue/Stage_2/Fig_Blue_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_1/Fir_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir/Stage_2/Fir_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_1/Fir_Snow_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Fir_Snow/Stage_3/Fir_Snow_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Gum/Stage_0/Gum_Stage0_001.prefab.json", "Server/Prefabs/Orbis/Trees/Maple_Stumps/Maple_Stumps_001.prefab.json", "Server/Prefabs/Orbis/Trees/Mushroom/Mushroom_007.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_3/Oak_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_4/Oak_Stage4_001.prefab.json", "Server/Prefabs/Orbis/Trees/Oak/Stage_5/Oak_Stage5_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palm/Stage_2/Palm_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palm_Green/Stage_2/Palm_Green_Stage2_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palm_Green/Stage_3/Palm_Green_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Palo/Stage_3/Palo_Stage3_001.prefab.json", "Server/Prefabs/Orbis/Trees/Petrified_Dead/Stage_5/Petrified_Dead_Stage5_001.prefab.json", "Server/Prefabs/Orbis/Trees/Redwood/Stage_1/Redwood_Stage1_001.prefab.json", "Server/Prefabs/Orbis/Trees/Redwood/Stage_2/Redwood_Stage2_001.prefab.json", "Server/Prefabs/Trees/Cedar_Logs/Small/Cedar_Logs_001.prefab.json", "Server/Prefabs/Trees/Jungle/Stage_2/Jungle_Stage_2_001.prefab.json", "Server/Prefabs/Trees/Redwood_Logs/Redwood_Logs_001.prefab.json", "Server/Weathers/Zone1/Zone1_Autumn_Forest_Windy.json", "Server/Weathers/Zone1/Zone1_Cloudy_Medium.json", "Server/Weathers/Zone1/Zone1_Sunny.json", "Server/Weathers/Zone1/Zone1_Sunny_Fireflies.json", "Server/Weathers/Zone2/Zone2_Blazing_Light.json", "Server/Weathers/Zone2/Zone2_Cloudy_Light.json", "Server/Weathers/Zone2/Zone2_Desert_Haze.json", "Server/Weathers/Zone2/Zone2_Sunny.json", "Server/Weathers/Zone3/Zone3_Cloudy_Light.json", "Server/Weathers/Zone3/Zone3_Cloudy_Medium.json", "Server/Weathers/Zone3/Zone3_Hedera.json", "Server/Weathers/Zone3/Zone3_Rain.json", "Server/Weathers/Zone3/Zone3_Snow_Heavy.json", "Server/Weathers/Zone4/Zone4_Lava_Fields.json", "Server/Weathers/Zone4/Zone4_Light.json", "Server/Weathers/Zone4/Zone4_Storm.json", "Server/Weathers/Zone4/Zone4_Wastes.json"];
