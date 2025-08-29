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
  pointsOfInterest: {
    buildings: [
      "Dockmaster's Hall",
      "Warehouse Row",
      "Shipwrights' Yards",
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

export const LOCATIONS: Record<string, Location> = {
  "Duvilia Kingdom": createLocation(
    "Duvilia Kingdom",
    "Duvilia Kingdom.png"
  ),
  "Wave's Break": WAVES_BREAK,
  "Coral Keep": createLocation(
    "Coral Keep",
    "Coral Keep.png",
    "Source of coral, pearls, and glass; western trade point exporting large lumber from Timber Grove with major guild halls."
  ),
  "Timber Grove": createLocation(
    "Timber Grove",
    "Timber Grove.png",
    "Primary harvester of large lumber, plus rare freshwater fauna, crystals, mushrooms, and orchard fruits."
  ),
  "Creekside": createLocation(
    "Creekside",
    "Creekside.png",
    "Militarized former Wetlands Pass waypoint providing freshwater catch, cattle, dairy, leather, and sugar."
  ),
  "Warm Springs": createLocation(
    "Warm Springs",
    "Warm Springs.png",
    "Mining town exporting metals, reagents, and coveted hot spring mineral water with an alchemy guild branch."
  ),
  "Dancing Pines": createLocation(
    "Dancing Pines",
    "Dancing Pines.png",
    "Supplies small timber, metals, gemstones, game, and pelts; home to a renowned light-armor leatherworker."
  ),
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

