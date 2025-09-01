const MAP_BASE_PATH = "assets/images/Maps";

export interface Location {
  name: string;
  description: string;
  map: string;
  subdivisions: string[];
  position: {
    general?: string;
    relative?: string;
  };
  travel: {
    routes: string[];
    connections: string[];
  };
  pointsOfInterest: {
    buildings: string[];
    tradeRoutes: string[];
    resources: {
      domestic: string[];
      exports: string[];
      imports: string[];
    };
  };
  population?: {
    estimate: number;
    range: [number, number];
    districts: Record<string, { estimate: number; notes: string }>;
    hinterland?: { estimate: number; notes: string };
  };
  questBoards: Record<string, Quest[]>;
}

export interface Quest {
  title: string;
  description: string;
  repeatable?: boolean;
  highPriority?: boolean;
  requiresCheckIn?: boolean;
}

export function createLocation(
  name: string,
  mapFile: string,
  description = ""
): Location {
  return {
    name,
    description,
    map: `${MAP_BASE_PATH}/${mapFile}`,
    subdivisions: [],
    position: {},
    travel: { routes: [], connections: [] },
    pointsOfInterest: {
      buildings: [],
      tradeRoutes: [],
      resources: { domestic: [], exports: [], imports: [] },
    },
    population: undefined,
    questBoards: {},
  };
}

function createQuest(
  title: string,
  description: string,
  opts: Partial<Quest> = {},
): Quest {
  return { title, description, ...opts };
}

function addQuestBoards(loc: Location) {
  const boards: Record<string, Quest[]> = {};

  const banditPatrol = createQuest(
    "Patrol the main road",
    "Help the guards keep bandits away.",
    { repeatable: true, highPriority: true },
  );

  const prototypeBlade = createQuest(
    "Test prototype blade",
    "Check with Master Smith before testing.",
    { requiresCheckIn: true },
  );

  if (loc.population?.districts) {
    Object.keys(loc.population.districts).forEach((d) => {
      boards[`${d} Quest Board`] = [
        createQuest(
          `Assist ${d} locals`,
          `Handle tasks for residents of ${d}.`,
        ),
      ];
    });
  }

  boards["Town Plaza Quest Board"] = [
    createQuest(
      "Help set up market stalls",
      "Assist merchants in preparing stalls.",
    ),
    banditPatrol,
    prototypeBlade,
  ];

  boards["Church Quest Board"] = [
    createQuest(
      "Collect healing herbs",
      "Gather herbs requested by the clergy.",
    ),
  ];

  boards["City Gate Quest Board"] = [
    createQuest(
      "Escort departing caravan",
      "Guard caravan until next waypoint.",
    ),
    banditPatrol,
  ];

  loc.pointsOfInterest.buildings.forEach((b) => {
    const lower = b.toLowerCase();
    if (lower.indexOf("smith") !== -1) {
      boards[`${b} Quest Board`] = [
        createQuest("Gather iron ore", "Bring quality ore for smelting."),
        prototypeBlade,
      ];
    } else if (
      lower.indexOf("carpenter") !== -1 ||
      lower.indexOf("carver") !== -1 ||
      lower.indexOf("fletcher") !== -1
    ) {
      boards[`${b} Quest Board`] = [
        createQuest(
          "Harvest fine timber",
          "Collect seasoned wood from nearby forest.",
        ),
      ];
    } else if (lower.indexOf("alchemist") !== -1) {
      boards[`${b} Quest Board`] = [
        createQuest(
          "Collect rare herbs",
          "Fetch ingredients for experimental potion.",
        ),
      ];
    } else if (lower.indexOf("enchant") !== -1) {
      boards[`${b} Quest Board`] = [
        createQuest(
          "Gather arcane crystals",
          "Acquire crystals from old ruins.",
        ),
      ];
    } else if (lower.indexOf("guild") !== -1) {
      boards[`${b} Quest Board`] = [
        createQuest(
          `Assist ${b}`,
          `Help with tasks at ${b}.`,
        ),
      ];
    }
  });

  loc.questBoards = boards;
  loc.pointsOfInterest.buildings.push(...Object.keys(boards));
}

const WAVES_BREAK: Location = {
  ...createLocation(
    "Wave's Break",
    "Wave's Break.png",
    `The City of Wave's Break

Where Salt Meets Stone, and East Meets West

Nestled between the jagged peaks of the coastal mountains and the restless sea, Wave's Break thrives as the crossroads of land and ocean. The treacherous Wetland Pass has long been impassable, leaving the city as the primary artery of trade between the Eastern farmlands and the Western kingdoms.

The city is famed for its fish and sea-goods sent eastward, while caravans bring in grain, wine, and livestock from the fertile plains beyond. Ships from distant southern ports and inland caravans alike make Wave's Break their anchor point, ensuring the city is never quiet, never still.

Its people are diverse: salt-stained sailors, silver-tongued merchants, hammer-armed crafters, scroll-burdened sages, and faith-driven priests. The city thrives on motion—goods, people, and ideas all collide here, leaving behind a place of markets, temples, shrines, and secrets.`
  ),
  subdivisions: [
    "The Port District",
    "The Upper Ward",
    "Little Terns",
    "Greensoul Hill",
    "The Lower Gardens",
    "The High Road District (East Gate Approach)",
    "The Farmlands Beyond the Walls",
  ],
  travel: { routes: ["sea route to Coral Keep"], connections: ["Coral Keep"] },
  population: {
    estimate: 31500,
    range: [28000, 34000],
    districts: {
      "The Port District": {
        estimate: 6000,
        notes:
          "dockworkers, fishers, chandlers, coopers, ropewalkers, shipwright families",
      },
      "Little Terns": {
        estimate: 9000,
        notes:
          "artisans: smiths, carpenters and lumber yards, tailors, potters, tanners, cobblers, mills",
      },
      "The Lower Gardens": {
        estimate: 5500,
        notes:
          "market gardeners, brewers, herbalists, arena staff, service trades",
      },
      "The Upper Ward": {
        estimate: 3000,
        notes:
          "administration, noble households, guards, high-end merchants",
      },
      "Greensoul Hill": {
        estimate: 3500,
        notes: "clergy, healers, scribes, arcanists, students",
      },
      "The High Road District": {
        estimate: 4500,
        notes:
          "caravan trades, armourers, wagonwrights, leatherworkers, teamsters",
      },
    },
    hinterland: {
      estimate: 7500,
      notes:
        "farmsteads, mills, brickworks, and quarries outside the walls",
    },
  },
  pointsOfInterest: {
    buildings: [
        "Harborwatch Trading House",
      "Warehouse Row",
        "Stormkeel Shipwrights",
      "Harbor Guard Naval Yard",
      "Nobles' Quay",
      "Merchants' Wharf",
      "Fisherman's Pier",
      "The Ropewalk",
        "Brinebarrel Coopers",
      "Saltworks",
      "Fishmongers' Row",
      "Shrine of the Deep Current",
      "Statue of the Sea-Mother",
      "The Salty Gull",
      "The Tideway Inn",
      "Governor's Keep",
      "Hall of Records",
      "Mercantile Exchange",
      "Temple of the Tides",
      "Grand Library of Wave's Break",
      "Plaza of Banners",
      "Master Jeweler's Guildhall",
      "Goldleaf Atelier",
      "Engravers' Guild",
      "Glassmakers' Hall",
        "Crystal Tide Glassworks",
      "The Argent Griffin Inn",
      "Guild of Smiths",
        "Tidefire Forge",
      "Carvers' and Fletchers' Hall",
      "Lumber Yard and Carpenter's Hall",
        "Timberwave Carpenters' Guild",
      "Threadneedle Hall",
        "The Gilded Needle Clothiers",
        "Seastone Ceramics",
        "Brine & Bark Tannery",
      "Cobbler's Square",
      "Grain Mills",
      "The Emberflask Alchemist",
        "Tideglass Alchemical Atelier",
      "Shrine of the Craftfather",
      "The Wandering Coin Tavern",
      "Greensoul Monastery",
      "The Arcanists' Enclave",
        "Arc Runes Enchantery",
      "Ink and Quill Hall",
      "Candlewrights' Guild",
      "Glass Eel Glassworks",
      "Herbal Conservatory",
      "Shrine of the Dawnfather",
      "The Whispering Garden",
      "The Glass Eel Tavern",
      "The Grand Arena",
      "South Gate Market",
      "Herbalists' Quarter",
      "Apiaries and Beekeepers",
      "Oil Presses and Mills",
        "Anchor's Toast Brewery",
      "Stonecutters' Guild",
      "Shrine of the Harvestmother",
      "Public Baths",
      "Flower Gardens and Orchard Walks",
      "The Sunleaf Inn",
      "Stonebridge Caravanserai",
      "Adventurers' Guildhall",
      "Iron Key Smithy",
        "Rolling Wave Coachworks",
        "Wavehide Leather Guild",
        "Salted Hide Tannery",
        "Shield & Sail Armsmiths",
      "Shrine of the Roadwarden",
      "Caravan Square",
      "Gatewatch Barracks",
      "Wayfarer's Rest Tavern",
      "Grain Farms and Mills",
      "Vineyards and Wineries",
      "Cattle and Wool Yards",
      "Brickworks",
      "Stone Quarries",
      "Outer Watchtowers",
      "Wayside Shrines",
        "Harbor Hearth Bakery",
        "Tidehold Granary & Provisioners",
    ],
    tradeRoutes: [],
    resources: {
      domestic: ["fish", "salt", "sea-goods", "tools"],
      exports: ["fish", "salt", "sea-goods", "tools"],
      imports: ["grain", "wine", "livestock"],
    },
  },
};

const CORAL_KEEP: Location = {
  ...createLocation(
    "Coral Keep",
    "Coral Keep.png",
    `The Shining Port of the West

If Wave's Break is the beating heart of east–west commerce, Coral Keep is its gleaming face to the sea. Built upon a rocky headland reinforced by coral-white stone, the city owes its name to the reefs just offshore that teem with pearls, sponges, and rare corals prized by nobles and artisans across the kingdom. Divers, pearl-hunters, and fisherfolk ply their trades in dangerous waters, supplying luxuries found nowhere else. Its wealth has made Coral Keep a center of glassmaking, jewelcraft, and maritime trade, with its forges blazing day and night to transform sand and coral ash into stained windows, beads, and the finest blown glass in the realm.

Coral Keep is also a city of exchange. Caravans arrive from the lumber-rich highlands to the west, where massive timbers are harvested for beams, keels, and great halls. From here they are loaded onto ships bound for the eastern cities, while imported spices, silks, and gems are offloaded in return. Sister to Wave's Break, Coral Keep mirrors its counterpart's importance, but with a sharper focus on luxury goods and refined crafts. It is a city of opportunity and danger—its Northern Slums hide thieves and smugglers, while its Forge District hums with industry, and its Old City holds both forgotten shrines and the bustling markets of centuries past.`
  ),
  subdivisions: [
    "The Military Ward",
    "The South Docks & Steel Docks",
    "The Forge District",
    "The Old City",
    "The Northern Slums",
    "Greywind's Edge",
    "Starrise Shade",
    "Fairy Hook",
  ],
  travel: { routes: ["sea route to Wave's Break"], connections: ["Wave's Break"] },
  population: {
    estimate: 27000,
    range: [24000, 30000],
    districts: {
      "The Military Ward": {
        estimate: 2500,
        notes:
          "governor's fortress, council hall, justice hall, sea-father temple, watchtowers",
      },
      "The South Docks & Steel Docks": {
        estimate: 6500,
        notes:
          "dockworkers, divers, shipwrights, glassworkers and pearl guilds, fishmongers",
      },
      "The Forge District": {
        estimate: 4000,
        notes:
          "glassmakers, smiths, masons, jewelers, tanners, potters",
      },
      "The Old City": {
        estimate: 5200,
        notes:
          "markets, shrines, baths, tailors, candlewrights",
      },
      "The Northern Slums": {
        estimate: 2700,
        notes:
          "thieves, smugglers, destitute folk, night bazaars",
      },
      "Greywind's Edge": {
        estimate: 1600,
        notes:
          "warehouses, caravanserai, stables, guard outposts",
      },
      "Starrise Shade": {
        estimate: 3000,
        notes:
          "middling merchants, scholars, priests, scribes, herb gardens",
      },
      "Fairy Hook": {
        estimate: 1500,
        notes:
          "fisherfolk, sailors, wavefront shrines",
      },
    },
    hinterland: {
      estimate: 6500,
      notes:
        "farmsteads, lumber camps, and quarries; plus 600-900 overnight non-residents, 1,000-1,200 daily visitors, and festival peaks of up to 5,000 outside the walls",
    },
  },
  pointsOfInterest: {
    buildings: [
      "The Coral Citadel",
      "Council Hall",
      "Hall of Records",
      "The Hall of Justice",
      "Temple of the Sea-Father",
      "Statue of the Twin Cities",
      "Watchtowers and Walls",
      "The Pearl Crown Inn",
      "The Captain's Rest",
      "Dockmaster's Hall",
      "Steel Watch Naval Docks",
      "Coral Court Quay",
      "Glassmarket Wharf",
      "Pearl Commons Pier",
      "Warehouse Row",
      "The Glassworkers' Guildhall",
      "Glassblowing Workshop",
      "The Pearl Divers' Guild",
      "Pearl Diving Dock",
      "Shipwrights' Yard",
      "Cooper's Hall",
      "Saltworks",
      "Shrine of the Undertide",
      "Fishmongers' Row",
      "The Sailor's Flute",
      "The Gull's Wing Inn",
      "The Great Glassworks",
      "Blacksmiths' Row",
      "Smithing Forge",
      "Stonecutters' Guild",
      "Jeweler's Hall",
      "Carpenter's Hall and Lumber Yard",
      "Carpentry Lodge",
      "Tanners' Yard",
      "Potters' Kilns",
      "The Furnace Alehouse",
      "Old Market Square",
      "Shrine of the Harvestmother",
      "Shrine of the Craftfather",
      "Baths of the Dawn",
      "The Candlewrights' Hall",
      "The Silver Needle",
      "Tailoring Shop",
      "The Coral Chalice Tavern",
      "The Old Gate Inn",
      "Thieves' Market",
      "Shrine of the Forgotten",
      "The Cracked Lantern Tavern",
      "Stonebridge Caravanserai",
      "Wagonwright's Yard",
      "Leatherworkers' Hall",
      "Leatherworking Shed",
      "Guard Barracks and Watchtower",
      "The Scribes' Hall",
      "Enchanting Sanctum",
      "The Dawnfather's Chapel",
      "Herbalist's Conservatory",
      "Alchemy Lab",
      "The Whispering Walk",
      "Fishermen's Guildhall",
      "The Wave's Kiss Tavern",
      "Shrine of the Sea-Mother",
    ],
    tradeRoutes: [],
    resources: {
      domestic: ["pearls", "sponges", "coral", "glass", "fish", "tools"],
      exports: ["pearls", "coral", "glass", "lumber", "luxury crafts", "tools"],
      imports: ["timber", "spices", "silks", "gems"],
    },
  },
};

const TIMBER_GROVE: Location = {
  ...createLocation(
    "Timber Grove",
    "Timber Grove.png",
    `Timber Grove – The Mountain Lumberstead

Nestled along a bend in the mountain river, Timber Grove is a modest but vital settlement, its small wooden homes clustered beside water and forest alike. Known primarily as the chief harvester of great timbers in the western range, the town supplies the beams, masts, and keels shipped downriver to Coral Keep, fueling both construction and shipbuilding across the kingdom. The air is rich with the scent of pine and cedar, while the rhythmic thud of axes and saws blends with the chatter of the river.

Though small, Timber Grove is also known for its secondary trades. Its forests yield luxury mushrooms, nuts, and tree saps, which are carefully harvested and sold as delicacies or ingredients for medicines and enchantments. The river provides rare freshwater fish, crawfish, and amphibians valued by herbalists and alchemists. From the nearby highland mine, the town occasionally turns up raw crystal and ore, some of which are rare enough to serve as material for magical enchantments. With its small population, Timber Grove relies on outside labor—many hands come seasonally from Creekside or Coral Keep, often through contracts or adventuring guild requests. For travelers, the town also serves as a waystop on the road between Creekside and Coral Keep, where one can rest, resupply, and find work before continuing on.`
  ),
  subdivisions: [
    "Central Plaza",
    "Fishing Bridges",
    "The Lumberworks",
    "Fields & Orchards",
    "The Mine",
    "Farms & Homesteads",
  ],
  position: {
    general: "western mountain river bend",
    relative: "between Creekside and Coral Keep",
  },
  travel: {
    routes: ["road to Creekside", "river to Coral Keep"],
    connections: ["Creekside", "Coral Keep"],
  },
  population: {
    estimate: 210,
    range: [210, 400],
    districts: {
      "Town Proper": {
        estimate: 210,
        notes: "families of loggers, millers, fishermen, and farmers",
      },
      "Seasonal Camps": {
        estimate: 75,
        notes: "outside laborers from Creekside and Coral Keep",
      },
      "Waystop Travelers": {
        estimate: 45,
        notes: "daily adventurers, traders, and pilgrims",
      },
    },
    hinterland: {
      estimate: 60,
      notes: "scattered farms and homesteads around the town",
    },
  },
  pointsOfInterest: {
    buildings: [
      "Central Plaza",
      "Fishing Bridges",
      "The Lumberworks",
      "Fields & Orchards",
      "The Mine",
      "Shrine of the Forest Father",
      "Wayside Shrine of the River-Mother",
      "The Timberhall",
      "The Crystalsong Lodge",
      "The Forest Rest Inn",
      "The Logger's Flask Tavern",
      "The Riverhouse",
    ],
    tradeRoutes: ["river barge to Coral Keep", "road caravans to Creekside"],
    resources: {
      domestic: [
        "timber",
        "grain",
        "nuts",
        "mushrooms",
        "tree sap",
        "freshwater fish",
        "crystals",
      ],
      exports: ["timber", "mushrooms", "saps", "crystals", "freshwater fish"],
      imports: ["labor", "finished goods"],
    },
  },
};

const CREEKSIDE: Location = {
  ...createLocation(
    "Creekside",
    "Creekside.png",
    `Creekside – Bastion of the Basin

Creekside sits within the fertile heart of a mountain basin, a crossroads between fertile farmland, tangled river bends, and the looming danger of the Wetlands Pass. The valley's soil is some of the richest in the western kingdoms, producing grain, sugar beets, cane, and fruit orchards, while broad pastures support the largest herds of cattle in the west. Dairy, beef, and leather flow outward from Creekside in massive quantities, carried overland toward Timber Grove or downriver toward Coral Keep. Though the river links to the gulf, its narrow bends make it impassable for heavy shipping, so Creekside depends on caravans and flatboats to move its wealth outward.

The city thrives on industry, practicality, and defense. Its dense, stone-and-wood buildings rise close together, prioritizing durability over beauty. A sprawling Guildhall in the center of town hosts representatives of every major craft and adventurers' association, issuing contracts and quests in constant supply. Creekside also maintains a strong military garrison, tasked with scouting the Wetlands and holding back the monstrous threats that spill forth during floods. Patrols are constant, and adventurers find no shortage of work culling creatures or guarding farmsteads. Creekside's people are pragmatic, hardworking, and ever watchful, but the wealth generated by sugar, cattle, leather, and freshwater fisheries makes it one of the most vital western cities. Its busy taverns, quest boards, and marketplaces draw people from across the kingdom seeking coin, security, or opportunity.`
  ),
  subdivisions: [
    "Greenford",
    "Everrise Bridge",
    "Stoneknot",
    "Surrounding Farmlands & Orchards",
  ],
  position: {
    general: "fertile mountain basin",
    relative: "between Timber Grove and Coral Keep",
  },
  travel: {
    routes: ["road to Timber Grove", "river to Coral Keep"],
    connections: ["Timber Grove", "Coral Keep"],
  },
  population: {
    estimate: 16000,
    range: [16000, 20000],
    districts: {
      Greenford: {
        estimate: 4000,
        notes: "farmers, drovers, dairymen, leatherworkers",
      },
      "Everrise Bridge": {
        estimate: 5000,
        notes: "fishers, traders, warehouse hands",
      },
      Stoneknot: {
        estimate: 7000,
        notes: "guildsmen, soldiers, artisans, garrison (1,500)",
      },
    },
    hinterland: {
      estimate: 6000,
      notes: "outer farms and orchards",
    },
  },
  pointsOfInterest: {
    buildings: [
      "Farmland Estates",
      "Cattle Yards",
      "The Creamery Hall",
      "Leatherworkers' Guildhouse",
      "Shrine of the Harvestmother",
      "The Plowman's Rest Tavern",
      "The Everrise Bridge",
      "Fishermen's Guild",
      "Fishmongers' Market",
      "Riverside Warehouses",
      "Shrine of the River-Mother",
      "The Waterwheel Mill",
      "The Oaken Net Tavern",
      "The Grand Guildhall of Creekside",
      "Military Barracks and Armory",
      "The Muster Yard",
      "Shrine of the Twin Watchers",
      "Stonecutters' Guild",
      "Glass Factory",
      "Glassblowers' Guild",
      "Butchers' Row",
      "The Iron Kettle Tavern",
      "The Traveler's Hearth Inn",
      "Sugar Cane and Beet Fields",
      "Fruit Orchards",
      "Vineyards and Wineries",
      "Goat and Sheep Farms",
      "Outlying Watchtowers",
      "Roadside Shrine of the Forest Father",
      "City Bakery",
      "Central Granary",
    ],
    tradeRoutes: ["caravans to Timber Grove", "flatboats to Coral Keep"],
    resources: {
      domestic: [
        "grain",
        "sugar",
        "cattle",
        "dairy",
        "leather",
        "freshwater fish",
        "fruit",
        "wine",
        "glass",
        "glass bottles",
      ],
      exports: [
        "grain",
        "sugar",
        "dairy",
        "beef",
        "leather",
        "freshwater fish",
        "fruit",
        "wine",
        "glass ingots",
        "glass bottles",
      ],
      imports: ["tools", "luxuries"],
    },
  },
};

const WARM_SPRINGS: Location = {
  ...createLocation(
    "Warm Springs",
    "Warm Springs.png",
    `Warm Springs – The Alchemists’ Refuge

Perched high in the mountain range, Warm Springs is a quiet village of steam, stone, and secrets. Known primarily for its mines and mineral springs, the settlement exports not only iron, gold, silver, and semi-precious stones, but also rare reagents distilled from the hot mineral waters themselves. Alchemists from across the kingdom prize the sulfur, salts, and crystalline precipitates gathered here, and many of the finest practitioners of the craft maintain their homes and workshops in Warm Springs despite the town’s small size. What the settlement lacks in numbers it more than makes up for in influence: its gems, minerals, and alchemical waters are vital to the prosperity of larger cities like Coral Keep and Corona.

The town also carries a reputation for healing and quiet retreat. Many ailing nobles, merchants, or adventurers have made the difficult journey up the mountain passes to bathe in the steaming springs or to consult with the elite alchemists who call Warm Springs home. Though some rumors exaggerate the miraculous properties of the waters, there is truth to their restorative effects. The town, however, has little to offer in the way of excitement—quests are few, dangers minimal, and most contracts are low-risk tasks taken by locals or beginner adventurers. As a result, Warm Springs remains small and insulated, self-sufficient in food but reliant on Creekside for goods such as textiles, tools, and bottles. Its rare fish and shellfish, prized for their vivid colors, exquisite flavors, and alchemical uses, are yet another treasure hidden in this quiet mountain basin.`
  ),
  subdivisions: [
    "Central Plaza",
    "The Springs",
    "The Mines",
    "Craft Halls",
    "Riverfront",
    "Farms and Orchards",
  ],
  travel: { routes: ["mountain path to Creekside"], connections: ["Creekside"] },
  pointsOfInterest: {
    buildings: [
      "Central Plaza Fountain",
      "Market Stalls",
      "Terraced Hot Springs",
      "Mine Entrances",
      "Warm Springs Alchemists' Hall",
      "The Distillery",
      "Glassblowers' Cottage",
      "Herbal Gardens",
      "Shrine of the River-Mother",
      "Shrine of the Flame-Heart",
      "Stone Circle of Ancestors",
      "Copper Tankard Tavern",
      "Springrest Inn",
      "Village Storehouse",
      "Butchers' Hut and Smokehouse",
      "Three Wooden Bridges",
    ],
    tradeRoutes: [
      "mineral and reagent exports to Coral Keep",
      "mineral and reagent exports to Corona",
      "imports of textiles, tools, and bottles from Creekside",
    ],
    resources: {
      domestic: [
        "grain",
        "vegetables",
        "goat milk and meat",
        "berries and nuts",
        "mineral water",
        "fish and shellfish",
        "spices and herbs",
      ],
      exports: [
        "iron",
        "gold",
        "silver",
        "semi-precious stones",
        "mineral salts and reagents",
        "rare fish and shellfish",
        "spices and herbs",
      ],
      imports: ["textiles", "tools", "bottles"],
    },
  },
  population: {
    estimate: 200,
    range: [200, 300],
    districts: {
      "Miners' Quarter": {
        estimate: 60,
        notes: "miners and smiths",
      },
      "Springs Terrace": {
        estimate: 40,
        notes: "alchemists, healers, and bath attendants",
      },
      Farmsteads: {
        estimate: 50,
        notes: "farmers and herders",
      },
      Riverfront: {
        estimate: 30,
        notes: "fishers and bridge keepers",
      },
      "Market Row": {
        estimate: 20,
        notes: "tavern, inn, and merchants",
      },
    },
    hinterland: {
      estimate: 60,
      notes:
        "seasonal visitors, patients seeking healing, and traveling merchants",
    },
  },
};

const DANCING_PINES: Location = {
  ...createLocation(
    "Dancing Pines",
    "Dancing Pines.png",
    `Dancing Pines – The Southern Diamond Outpost

Far in the southeastern corner of the kingdom lies Dancing Pines, a frontier outpost cradled by mountain forests and swift rivers. Though small and newly established, the town has already proven invaluable: its lumberyards supply planks for fishing boats and wagons in Wave's Break, while its diamond mines make it the single greatest source of precious gemstones in the realm. Semi-precious stones, quartz, and other crystals round out its mineral wealth, ensuring steady trade caravans wind their way down the rough mountain tracks to haul riches toward the coast.

The wilderness surrounding Dancing Pines is equally bountiful. Rare pelts from mountain-dwelling beasts are prized by merchants and nobles, while the outpost's hunters also gather wild poultry unique to the region. Most famously, the settlement is home to a master leatherworker, whose fine light armor and commissioned pieces carry such prestige that nobles across the kingdom boast of owning them. Despite its prosperity, the town remains rugged: its river is too shallow for deep transport, forcing goods to be carted a day downhill to barge ports. The remoteness gives Dancing Pines a frontier charm but also a sense of isolation, though it is shielded by patrols from Corona and Wave's Break. For now, the little outpost thrives quietly, its lumber mills and gem mines humming beneath the endless canopy of whispering pines.`
  ),
  subdivisions: [
    "Central Plaza",
    "Lumberworks",
    "Diamond Mines",
    "Hunter's Quarter",
    "Shrine Row",
    "Riverfront",
    "Outlying Camps",
  ],
  position: {
    general: "southeastern mountain frontier",
    relative: "upstream from the coastal barge dock and south of Wave's Break",
  },
  travel: {
    routes: [
      "cart track to downriver barge dock",
      "mountain paths to Corona and Wave's Break",
    ],
    connections: ["Corona", "Wave's Break"],
  },
  pointsOfInterest: {
    buildings: [
      "Central Plaza Totem",
      "Sawmill and Waterwheels",
      "Timber Yards",
      "Carpenter Sheds",
      "Diamond Mine Entrances",
      "Stonecutters' Guildhouse",
      "Miners' Barracks",
      "Hunter's Lodge",
      "Leatherwright's Atelier",
      "Smokehouses",
      "Shrine of the Forest Father",
      "Riverside Shrine of the River-Mother",
      "The Pinehall",
      "Miners' Respite Tavern",
      "Dancing Lantern Inn",
      "Market Stalls",
      "River Bridges",
      "Cart Track to Foothills",
      "Barge Dock",
      "Logging Camps",
      "Hunting Grounds",
      "Scouts' Cabin",
    ],
    tradeRoutes: [
      "caravans to Wave's Break",
      "caravans to Corona",
      "cart track to coastal barge dock",
    ],
    resources: {
      domestic: [
        "lumber",
        "trout",
        "shellfish",
        "wild poultry",
        "game meat",
        "pelts",
      ],
      exports: [
        "diamonds",
        "semi-precious stones",
        "quartz and crystals",
        "lumber planks",
        "wagon frames and furniture",
        "rare pelts",
        "wild poultry",
        "fine leather armor",
      ],
      imports: ["grain", "tools", "luxuries"],
    },
  },
  population: {
    estimate: 100,
    range: [100, 200],
    districts: {
      "Timber Yards": {
        estimate: 25,
        notes: "loggers, sawyers, and carpenters",
      },
      "Miners' Barracks": {
        estimate: 30,
        notes: "diamond miners and stonecutters",
      },
      "Hunter's Row": {
        estimate: 20,
        notes: "hunters, trappers, and tannery hands",
      },
      "Market Plaza": {
        estimate: 15,
        notes: "inn, tavern, and visiting traders",
      },
      "Shrine Quarter": {
        estimate: 10,
        notes: "woodcarvers and spiritual keepers",
      },
    },
    hinterland: {
      estimate: 50,
      notes: "logging camps, hunting parties, and scouts in the surrounding mountains",
    },
  },
};

const MOUNTAIN_TOP: Location = {
  ...createLocation(
    "Mountain Top",
    "Mountain Top.png",
    `Mountain Top – The Southern Gate of the Wetlands

Built high upon a defensible plateau at the southern edge of the wetlands, Mountain Top is both fortress and market, sentinel and sanctuary. The town sits on a jutting mountain plateau with a large freshwater spring feeding a waterfall that cuts the land between the wetlands and civilized lands. As such, it guards one of only two viable gateways between the wetlands and the eastern cities, making it an indispensable stronghold and a lifeline for merchants, pilgrims, and soldiers who must pass through the frontier.

Mountain Top thrives as a trade hub between Corona and Wave's Break, dividing the 20-day caravan route into two manageable legs of 10 days each. Its role is both strategic and economic: caravans gather in the city's central plaza, adventurers are hired to scout or cull threats in the wetlands, and merchants find safe lodging and fresh supplies before pushing on. The surrounding terraces and farmlands produce rice, potatoes, and luxury teas, goods found nowhere else in the kingdom, while the large spring fed lake yields freshwater fish and shellfish. Together with small shipments of diamonds from Dancing Pines funneled through Mountain Top to Corona, these exports add prosperity to its reputation for vigilance. A garrison nearly as large as Creekside's secures the nearby lands, its beacon tower ever ready to light a warning across the horizon should the wetlands stir with greater threats.`
  ),
  subdivisions: [
    "Central Plaza",
    "Fortress Quarter",
    "Reservoir Quarter",
    "Terraces & Farms",
    "Artisan's Row",
  ],
  position: {
    general: "mountain plateau at southern edge of the wetlands",
    relative: "between Corona and Wave's Break guarding the southern gateway",
  },
  travel: {
    routes: ["road to Corona", "road to Wave's Break"],
    connections: ["Corona", "Wave's Break"],
  },
  pointsOfInterest: {
    buildings: [
      "The Grand Guildhall",
      "The Merchant's Exchange",
      "Quest Boards & Muster Posts",
      "Statue of the Twin Guardians",
      "The Breakwater Inn",
      "The Silver Lantern Tavern",
      "The Restful Cup",
      "The Southern Gatehouse",
      "Barracks of the Iron Watch",
      "The Armory & Smiths' Yard",
      "Beacon Tower",
      "The Spring Reservoir",
      "Shrine of the River-Mother",
      "Public Baths",
      "Fishers' Quay",
      "Rice Paddies",
      "Potato Fields",
      "Tea Gardens",
      "Herbal Terraces",
      "The Farmer's Market",
      "The Leatherwright's Hall",
      "Tea-Brewers' Guildhouse",
      "The Stonemason's Lodge",
      "Weavers' Hall",
    ],
    tradeRoutes: [
      "caravans to Corona",
      "caravans to Wave's Break",
      "diamond shipments from Dancing Pines to Corona",
    ],
    resources: {
      domestic: [
        "rice",
        "potatoes",
        "luxury teas",
        "freshwater fish",
        "shellfish",
        "spices and herbs",
        "tools",
      ],
      exports: [
        "rice",
        "potatoes",
        "luxury teas",
        "freshwater fish",
        "shellfish",
        "diamonds",
        "spices and herbs",
        "tools",
      ],
      imports: ["diamonds", "luxuries"],
    },
  },
  population: {
    estimate: 2500,
    range: [2500, 3000],
    districts: {
      "Central Plaza": {
        estimate: 600,
        notes: "merchants, inns, and caravan services",
      },
      "Fortress Quarter": {
        estimate: 800,
        notes: "garrison of the Iron Watch (~500 soldiers)",
      },
      "Reservoir Quarter": {
        estimate: 400,
        notes: "fishers, shrine keepers, and bath attendants",
      },
      "Terraces & Farms": {
        estimate: 500,
        notes: "rice paddies, potato fields, and tea gardens",
      },
      "Artisan's Row": {
        estimate: 200,
        notes: "leatherwrights, tea-brewers, stonemasons, and weavers",
      },
    },
    hinterland: {
      estimate: 300,
      notes:
        "weekly visitors: caravan merchants, adventurers, diamond couriers",
    },
  },
};

const CORONA: Location = {
  ...createLocation(
    "Corona",
    "Corona.png",
    `Corona – The Bastion of the East

Sprawling across fertile plains at the heart of the eastern lands, Corona is the seat of the human kingdom's power and the largest city in the realm. Its high walls, bustling streets, and endless fields of crops and textile plants make it both the breadbasket and the fortress capital of the kingdom. Every caravan heading to Mountain Top, Corner Stone, or the frontier outpost of Whiteheart passes through Corona, ensuring its markets never sleep and its plazas never stand empty. Beyond the walls stretch orderly farmlands and grazing herds, feeding not only the city itself but much of the eastern realm.

Corona is also a city of steel and stone, with a vast garrison of soldiers housed both within the city and in the Crenelated Barricade, a fortress wall sealing the Wetlands Pass to the south. Adventurers flock here in droves, for Corona serves as the primary launching point for expeditions into the wetlands. Treasure-seekers, mercenaries, and explorers alike come to prove themselves or perish in the mists. The city also serves as the headquarters for all the Main Guild Branches, making it the administrative and logistical core of the kingdom's labor and craft network. While the inner city is organized and bustling, the outer sprawl of slums, rowdy barracks, and laborer quarters reflects the grittier side of Corona: a city of opportunity and ambition, but also hardship and hunger.`
  ),
  subdivisions: [
    "The Citadel Quarter",
    "Brightshade",
    "Greatwood Gate District",
    "West Corona",
    "Western Slums",
    "Underway Village",
    "The Wetlands Wall",
  ],
  position: {
    general: "fertile plains at the heart of the eastern lands",
    relative: "central hub between Mountain Top, Corner Stone, and Whiteheart",
  },
  travel: {
    routes: [
      "road to Mountain Top",
      "road to Corner Stone",
      "road to Whiteheart",
    ],
    connections: ["Mountain Top", "Corner Stone", "Whiteheart"],
  },
  pointsOfInterest: {
    buildings: [
      "The High Citadel",
      "Hall of Governance",
      "Main Barracks of the Eastern Host",
      "Royal Treasury",
      "Shrine of the Crowned Sun",
      "The Beacon Hall",
      "The Great Market of Brightshade",
      "Dairy Hall",
      "Mulberry Orchards",
      "Shrine of the Harvestmother",
      "The Loomhouse Row",
      "Silkworks",
      "The Shepherd's Rest Inn",
      "Gate Fortress",
      "Caravanserai of the Greatwood",
      "Smiths' Yard",
      "The Steel Flagon Tavern",
      "The Artisan's Hall",
      "Shrine of the Craftfather",
      "The Glasswrights' Guildhouse",
      "The Crescent Forge",
      "The Golden Anvil Inn",
      "Shanty Markets",
      "The Rat's Tail Tavern",
      "Shrine of the Forgotten",
      "Laborer's Row",
      "Traveler's Rest Caravanserai",
      "The Wayfarer's Market",
      "Road Shrine of the River-Mother",
      "The Bastion Fort",
      "The Watchfires",
      "Mustering Grounds",
      "The Blackthorn Gate",
    ],
    tradeRoutes: [
      "caravans to Mountain Top",
      "caravans to Corner Stone",
      "caravans to Whiteheart",
    ],
    resources: {
      domestic: [
        "grain",
        "fruits",
        "livestock",
        "textiles",
        "dairy",
        "mulberries",
        "silk",
        "tools",
      ],
      exports: [
        "grain",
        "fruits",
        "livestock",
        "textiles",
        "dairy",
        "silk",
        "tools",
      ],
      imports: ["luxuries", "rare goods"],
    },
  },
  population: {
    estimate: 42000,
    range: [42000, 45000],
    districts: {
      "The Citadel Quarter": {
        estimate: 8000,
        notes: "royal family, military command, garrison",
      },
      "Brightshade": {
        estimate: 9000,
        notes: "farmers, market-goers, and weavers",
      },
      "Greatwood Gate District": {
        estimate: 7000,
        notes: "caravan traffic, guards, and smithies",
      },
      "West Corona": {
        estimate: 8000,
        notes: "artisans, smaller markets, guildhalls",
      },
      "Western Slums": {
        estimate: 10000,
        notes: "laborers, barracks overflow, and the destitute",
      },
    },
    hinterland: {
      estimate: 15000,
      notes: "Underway Village, outer farms, and the Wetlands Wall garrison",
    },
  },
};

const CORNER_STONE: Location = {
  ...createLocation(
    "Corner Stone",
    "Corner Stone.png",
    `Corner Stone – The Jewel of Craftsmanship

Rising on the banks of the kingdom's great rivers and set on the side of a mountain secluded in the north far from the wetlands, Corner Stone is the most fortified and opulent city of the human realm. Built from the very quarries and crystal veins beneath its foundations, its broad avenues, towering walls, and polished stone plazas gleam with craftsmanship unrivaled elsewhere. Here reside the master jewelers, smiths, glasswrights, and artificers of the kingdom, many descended from guild lines stretching back centuries. Unlike Corona or Wave's Break, which bustle with common labor, Corner Stone attracts the wealthy, the ambitious, and the noble, who pay dearly for apartments and workshops within its high walls.

Corner Stone is also unique in its cultural makeup: it is the only human city where dwarves dwell openly, serving as the primary surface trade partner with the hidden underground dwarven metropolis. While dwarves import much of their food from the surrounding human lands, they provide Corner Stone with steady access to mithril, adamantine, and perfected dwarven craft techniques, elevating the city's reputation as a center of artistry and innovation. The Commerce Guild—headquartered here—mints and regulates the kingdom's coinage, further cementing the city's role as the economic and symbolic heart of trade. Though living costs are high, the wealth and prestige flowing through Corner Stone make it the ultimate destination for artisans and merchants seeking fame, fortune, and refinement.`
  ),
  subdivisions: [
    "Crown District",
    "Misty Crossing",
    "Cherry Rock",
    "Stonecrest Town",
    "New Gardens",
    "Cattlebridge Quarter",
    "The Hill",
  ],
  position: {
    general: "northern river city built into a mountain",
    relative: "upstream from Corona and north of Whiteheart",
  },
  travel: {
    routes: ["road to Corona", "road to Whiteheart"],
    connections: ["Corona", "Whiteheart"],
  },
  pointsOfInterest: {
    buildings: [
      "The Guild Palace",
      "The Royal Exchange",
      "Crystal Court Plaza",
      "Luxury Apartments",
      "Shrine of the Crowned Sun",
      "The Gilded Chalice Inn",
      "The Coin & Scepter Tavern",
      "Great Stone Bridge",
      "Merchant's Guildhall",
      "Jewelers' Row",
      "Crystalwrights' Hall",
      "The Silvershade Market",
      "The Sapphire Cup",
      "The River Pearl Inn",
      "The Adamantine Forge",
      "The Mithril Hall",
      "Smiths' Guildhouse",
      "Coopers' Yard & Metalworkers' Row",
      "Brewmasters' Hall",
      "The Emberwell Foundry",
      "The Smelter's Rest Tavern",
      "The Forgemaster's Hearth Inn",
      "Artisans' Hall",
      "The Guild of Engravers & Sealwrights",
      "The Stonecutters' Guildhouse",
      "Shrine of the Craftfather",
      "The Cobbled Market",
      "The Mason's Mug",
      "The Cornerstone Rest Inn",
      "Botanical Gardens",
      "The Tea Conservatory",
      "Shrine of the Dawnfather",
      "Noble Estates",
      "Tanners' Guildhouse",
      "The River Docks",
      "Fishers' Guild",
      "Laborers' Market",
      "Shrine of the River-Mother",
      "Southern Gatehouse",
      "Caravanserai of the Hill",
      "The Hill Market",
      "The Iron Cup Tavern",
    ],
    tradeRoutes: [
      "caravans to Corona",
      "caravans to Whiteheart",
      "river trade with dwarven metropolis",
    ],
    resources: {
      domestic: [
        "jewelry",
        "mithril goods",
        "adamantine goods",
        "glassware",
        "coinage",
        "brewed ales",
        "tools",
      ],
      exports: [
        "jewelry",
        "mithril goods",
        "adamantine goods",
        "glassware",
        "coinage",
        "brewed ales",
        "tools",
      ],
      imports: ["food", "livestock", "raw gems", "timber"],
    },
  },
  population: {
    estimate: 36000,
    range: [36000, 38000],
    districts: {
      "Crown District": {
        estimate: 4000,
        notes: "nobles, guild officials, master artisans",
      },
      "Misty Crossing": {
        estimate: 6000,
        notes: "river merchants, jewelers, guildhalls",
      },
      "Cherry Rock": {
        estimate: 7000,
        notes: "smiths, metalworkers, dwarves",
      },
      "Stonecrest Town": {
        estimate: 9000,
        notes: "residences, artisans, markets",
      },
      "New Gardens": {
        estimate: 3000,
        notes: "botanical gardens and noble estates",
      },
      "Cattlebridge Quarter": {
        estimate: 4000,
        notes: "dockworkers, tanners, laborers",
      },
      "The Hill": {
        estimate: 3000,
        notes: "gate guards, caravanserai, travelers",
      },
    },
    hinterland: {
      estimate: 10000,
      notes:
        "outer farmland support villages; garrison of 2,500 and daily visitors up to 2,500",
    },
  },
};

const DRAGONS_REACH_ROAD: Location = {
  ...createLocation(
    "Dragon's Reach Road",
    "Dragon's Reach Road.png",
    `Dragon's Reach Road – The Northern Frontier Outpost

At the northern edge of the kingdom, deep within ancient forests and just before the rising plateaus where dragons still roost, lies Dragon's Reach Road. Though small, the village stands as the last human settlement before the dragonlands, a place of preparation, recovery, and rumor. Adventurers from across the kingdom travel here to test their courage against the fabled dragons that haunt the peaks, while scavengers and bold hunters sometimes return with scales, horns, or shed remnants of dragons — treasures highly coveted by the master craftsmen of Corner Stone. For many, Dragon's Reach Road is not a home but a proving ground: the last stop before stepping into legend.

Despite its danger-fueled reputation, the outpost also supports itself with quieter trades. The surrounding woodlands yield rare pelts, lumber, and game, while its orchards produce small but prized quantities of exotic fruits found nowhere else in the kingdom. The village sits around a central plaza and lakeside, with fields and paddocks just beyond the palisade wall. While its economy is modest, its role as a gathering place for adventurers, dragon scavengers, and craftsmen seeking rare materials makes Dragon's Reach Road a settlement of outsized importance compared to its population.`
  ),
  subdivisions: [
    "The Central Plaza",
    "The Lakeside Quarter",
    "The Artisan's Lane",
    "The Outskirts & Farmlands",
  ],
  position: {
    general: "northern frontier village by a lake",
    relative:
      "last settlement before the dragonlands, north of Corner Stone",
  },
  travel: {
    routes: ["road to Corner Stone", "northern road into dragonlands"],
    connections: ["Corner Stone"],
  },
  population: {
    estimate: 400,
    range: [400, 1000],
    districts: {
      "The Central Plaza": {
        estimate: 80,
        notes:
          "caravans, guild post, quest boards, and the Shrine of the Flame-Heart",
      },
      "The Lakeside Quarter": {
        estimate: 120,
        notes:
          "fishermen, scavengers, the Silver Scale Tavern, and the Drakesong Inn",
      },
      "The Artisan's Lane": {
        estimate: 100,
        notes:
          "workshops for leatherwrights, fletchers, fruit pressers, and stonewrights",
      },
      "The Outskirts & Farmlands": {
        estimate: 100,
        notes: "orchards, fields, paddocks, and hunting camps",
      },
    },
    hinterland: {
      estimate: 250,
      notes:
        "150-300 seasonal adventurers with 40-60 daily travelers; festival peaks up to 800-1,000",
    },
  },
  pointsOfInterest: {
    buildings: [
      "The Guild Post",
      "Quest Boards",
      "Shrine of the Flame-Heart",
      "The Fishermen's Docks",
      "The Scavenger's Hall",
      "The Silver Scale Tavern",
      "The Drakesong Inn",
      "The Leatherwright's Cabin",
      "The Fletcher's Hut",
      "The Exotic Fruit Press",
      "Stonewright's Shed",
      "Fruit Orchards",
      "Hunting Grounds",
      "Fields & Paddocks",
      "The Northern Road Gate",
    ],
    tradeRoutes: [
      "caravans to Corner Stone",
      "expeditions into the dragonlands",
    ],
    resources: {
      domestic: [
        "rare pelts",
        "lumber",
        "game",
        "exotic fruits",
        "dragon remnants",
      ],
      exports: ["rare pelts", "lumber", "exotic fruits", "dragon remnants"],
      imports: ["grain", "tools", "finished goods"],
    },
  },
};

const WHITEHEART: Location = {
  ...createLocation(
    "Whiteheart",
    "Whiteheart.png",
    `Whiteheart – The Eastern Frontier Outpost

Tucked deep within the forested lands between Corona and Corner Stone, Whiteheart is the newest and smallest of the kingdom’s settlements. Founded by the guilds as a frontier experiment, the outpost serves several vital roles: as a logging station for lumber, as a halfway rest for caravans traveling the forest road, and most importantly as a base of operations for scouting and quelling monsters that have begun appearing in unusual numbers from the East. Its name comes from both the pale-barked trees that dominate the forest and the symbolic role it hopes to play as a "heart of the wilderness", taming and expanding human settlement in dangerous lands.

At present, Whiteheart is little more than a guild hall, barracks, and a scattering of homes for hunters, crafters, and laborers. Still, it is expected to grow: guild leaders in Corona see the outpost as a means to relieve overcrowding in the capital by relocating laborers, farmers, and families here. Already plans are underway for farmland expansion, better road patrols, and new defenses against bandits and monsters. For adventurers, Whiteheart offers modest pay but steady work: monster culls, bandit suppression, and forest scouting. Though small, it holds great symbolic importance as the easternmost human presence and the spearpoint of civilization pushing into the deep, ancient woods.`
  ),
  subdivisions: [
    "The Central Plaza",
    "The Barracks",
    "Residences & Community",
  ],
  position: {
    general: "forest frontier outpost between Corona and Corner Stone",
    relative:
      "midpoint along the forest road and easternmost human presence",
  },
  travel: {
    routes: ["forest road to Corona", "forest road to Corner Stone"],
    connections: ["Corona", "Corner Stone"],
  },
  population: {
    estimate: 150,
    range: [150, 300],
    districts: {
      "The Central Plaza": {
        estimate: 20,
        notes: "gathering clearing with guild hall and watchtower",
      },
      "The Barracks": {
        estimate: 70,
        notes: "50-75 soldiers patrolling the road",
      },
      "Residences & Community": {
        estimate: 60,
        notes:
          "hunter cabins, crafters' hut, foragers' lodge, communal longhouse",
      },
    },
    hinterland: {
      estimate: 40,
      notes:
        "logging camps and daily caravans; peaks up to 250-300 visitors",
    },
  },
  pointsOfInterest: {
    buildings: [
      "The Central Plaza",
      "The Guild Hall",
      "The Watchtower",
      "The Muster Post",
      "The Barracks",
      "Armory Shed",
      "Training Yard",
      "Hunter Cabins",
      "Crafter's Hut",
      "Forager's Lodge",
      "Communal Longhouse",
      "Shrine of the Forest Father",
      "Wayside Shrine of the River-Mother",
      "The White Boar Inn",
      "The Timber Exchange",
      "The Roadside Market",
      "Logging Camps",
      "Cleared Farmland Patches",
      "Forest Trails",
    ],
    tradeRoutes: [
      "caravans between Corona and Corner Stone",
      "timber shipments to Corner Stone",
    ],
    resources: {
      domestic: ["timber", "game", "pelts", "herbs and mushrooms"],
      exports: ["timber", "pelts", "forest materials"],
      imports: ["grain", "tools", "supplies"],
    },
  },
};

export const LOCATIONS: Record<string, Location> = {
  "Duvilia Kingdom": createLocation(
    "Duvilia Kingdom",
    "Duvilia Kingdom.png"
  ),
  "Wave's Break": WAVES_BREAK,
  "Coral Keep": CORAL_KEEP,
  "Timber Grove": TIMBER_GROVE,
  "Creekside": CREEKSIDE,
  "Warm Springs": WARM_SPRINGS,
  "Dancing Pines": DANCING_PINES,
  "Mountain Top": MOUNTAIN_TOP,
    "Corona": CORONA,
    "Corner Stone": CORNER_STONE,
    "Dragon's Reach Road": DRAGONS_REACH_ROAD,
    "Whiteheart": WHITEHEART,
  };

Object.keys(LOCATIONS).forEach((name) => addQuestBoards(LOCATIONS[name]));

