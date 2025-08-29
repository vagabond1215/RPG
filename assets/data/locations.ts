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
  };
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
      "Port District": {
        estimate: 6000,
        notes:
          "dockworkers, fishers, chandlers, coopers, ropewalkers, shipwright families",
      },
      "Little Terns": {
        estimate: 9000,
        notes:
          "artisans: smiths, carpenters and lumber yards, tailors, potters, tanners, cobblers, mills",
      },
      "Lower Gardens": {
        estimate: 5500,
        notes:
          "market gardeners, brewers, herbalists, arena staff, service trades",
      },
      "Upper Ward": {
        estimate: 3000,
        notes:
          "administration, noble households, guards, high-end merchants",
      },
      "Greensoul Hill": {
        estimate: 3500,
        notes: "clergy, healers, scribes, arcanists, students",
      },
      "High Road District": {
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
      "Dockmaster's Hall",
      "Warehouse Row",
      "Shipwrights' Yards",
      "Harbor Guard Naval Yard",
      "Nobles' Quay",
      "Merchants' Wharf",
      "Fisherman's Pier",
      "The Ropewalk",
      "The Cooper's Yard",
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
      "The Argent Griffin Inn",
      "Guild of Smiths",
      "Carvers' and Fletchers' Hall",
      "Lumber Yard and Carpenter's Hall",
      "Threadneedle Hall",
      "Pottery Kilns",
      "Tanners' Yard",
      "Cobbler's Square",
      "Grain Mills",
      "The Emberflask Alchemist",
      "Shrine of the Craftfather",
      "The Wandering Coin Tavern",
      "Greensoul Monastery",
      "The Arcanists' Enclave",
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
      "Brewmasters' Hall",
      "Stonecutters' Guild",
      "Shrine of the Harvestmother",
      "Public Baths",
      "Flower Gardens and Orchard Walks",
      "The Sunleaf Inn",
      "Stonebridge Caravanserai",
      "Adventurers' Guildhall",
      "Iron Key Smithy",
      "Wagonwright's Yard",
      "Leatherworkers' Hall",
      "Armourer's Row",
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
    ],
    tradeRoutes: [],
    resources: {
      domestic: ["fish", "salt", "sea-goods"],
      exports: ["fish", "salt", "sea-goods"],
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
      "Military Ward": {
        estimate: 2500,
        notes:
          "governor's fortress, council hall, justice hall, sea-father temple, watchtowers",
      },
      "South Docks & Steel Docks": {
        estimate: 6500,
        notes:
          "dockworkers, divers, shipwrights, glassworkers and pearl guilds, fishmongers",
      },
      "Forge District": {
        estimate: 4000,
        notes:
          "glassmakers, smiths, masons, jewelers, tanners, potters",
      },
      "Old City": {
        estimate: 5200,
        notes:
          "markets, shrines, baths, tailors, candlewrights",
      },
      "Northern Slums": {
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
      "The Pearl Divers' Guild",
      "Shipwrights' Yard",
      "Cooper's Hall",
      "Saltworks",
      "Shrine of the Undertide",
      "Fishmongers' Row",
      "The Sailor's Flute",
      "The Gull's Wing Inn",
      "The Great Glassworks",
      "Blacksmiths' Row",
      "Stonecutters' Guild",
      "Jeweler's Hall",
      "Carpenter's Hall and Lumber Yard",
      "Tanners' Yard",
      "Potters' Kilns",
      "The Furnace Alehouse",
      "Old Market Square",
      "Shrine of the Harvestmother",
      "Shrine of the Craftfather",
      "Baths of the Dawn",
      "The Candlewrights' Hall",
      "The Silver Needle",
      "The Coral Chalice Tavern",
      "The Old Gate Inn",
      "Thieves' Market",
      "Shrine of the Forgotten",
      "The Cracked Lantern Tavern",
      "Stonebridge Caravanserai",
      "Wagonwright's Yard",
      "Leatherworkers' Hall",
      "Guard Barracks and Watchtower",
      "The Scribes' Hall",
      "The Dawnfather's Chapel",
      "Herbalist's Conservatory",
      "The Whispering Walk",
      "Fishermen's Guildhall",
      "The Wave's Kiss Tavern",
      "Shrine of the Sea-Mother",
    ],
    tradeRoutes: [],
    resources: {
      domestic: ["pearls", "sponges", "coral", "glass", "fish"],
      exports: ["pearls", "coral", "glass", "lumber", "luxury crafts"],
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
      "Butchers' Row",
      "The Iron Kettle Tavern",
      "The Traveler's Hearth Inn",
      "Sugar Cane and Beet Fields",
      "Fruit Orchards",
      "Goat and Sheep Farms",
      "Outlying Watchtowers",
      "Roadside Shrine of the Forest Father",
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
      ],
      exports: [
        "grain",
        "sugar",
        "dairy",
        "beef",
        "leather",
        "freshwater fish",
        "fruit",
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
      ],
      exports: [
        "iron",
        "gold",
        "silver",
        "semi-precious stones",
        "mineral salts and reagents",
        "rare fish and shellfish",
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
  "Mountain Top": createLocation(
    "Mountain Top",
    "Mountain Top.png",
    "Trade hub between Corona and Wave's Break growing flax and cotton while guarding the Wetlands choke point."
  ),
  "Corona": createLocation(
    "Corona",
    "Corona.png",
    "Capital producing eastern crops, cattle, dairy, and basic goods; seat of human power hosting major guilds."
  ),
  "Corner Stone": createLocation(
    "Corner Stone",
    "Corner Stone.png",
    "Premier crafting city rich in crystal, quartz, stone, and rare metals like mithril and adamantine; home to master artisans and the Commerce Guild."
  ),
  "Dragon's Reach Road": createLocation(
    "Dragon's Reach Road",
    "Dragon's Reach Road.png",
    "Northern frontier stop before the dragon plateaus, yielding fruit, game, lumber, pelts, and scarce dragon materials."
  ),
  "Whiteheart": createLocation(
    "Whiteheart",
    "Whiteheart.png",
    "Guild-founded outpost for lumber and exploration, serving as midpoint between Corona and Corner Stone to expand eastern agriculture and curb bandits."
  ),
};

