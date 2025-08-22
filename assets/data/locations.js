const MAP_BASE_PATH = "assets/images/Maps";

function createLocation(name, mapFile, description = "") {
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

export const LOCATIONS = {
  "Duvilia Kingdom": createLocation(
    "Duvilia Kingdom",
    "Duvilia Kingdom.png"
  ),
  "Wave's Break": createLocation(
    "Wave's Break",
    "Wave's Break.png",
    "Main hub for trade between east and west; major supplier of fish, ocean goods, and western-bound produce."
  ),
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

