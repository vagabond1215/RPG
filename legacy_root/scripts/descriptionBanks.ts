export const REGIONS = [
  "aquatic",
  "aquatic_fresh",
  "aquatic_salt",
  "coastal",
  "terrestrial",
  "wetlands_transitional",
] as const;
export type Region = (typeof REGIONS)[number];

export const HABITATS = [
  "alpine_tundra",
  "arctic_tundra",
  "cliffs",
  "coastal",
  "coral_reefs",
  "desert",
  "farmland",
  "forest",
  "grassland",
  "hills",
  "hot_desert",
  "lake",
  "lakes",
  "limestone_caves",
  "marshes",
  "ocean_shores",
  "open_ocean",
  "ponds",
  "rivers",
  "semi_arid_scrublands",
  "swamps",
  "tidal_flats",
  "tundra",
  "urban",
  "wetland",
  // plant-focused aggregates that appear in data or schemas
  "riverlands",
  "mountains",
] as const;
export type Habitat = (typeof HABITATS)[number];

export type PhraseLayer = Partial<Record<string, string[]>>;

export interface CoreBank extends PhraseLayer {
  openers: string[];
  realms: string[];
  moods: string[];
  sparkles: string[];
  appositives: string[];
  linkers?: string[];
  closers: string[];
}

export interface CategoryBank extends PhraseLayer {
  closers: string[];
}

export const BASE: CoreBank = {
  openers: [
    // Fallback generics (used only if theme-driven openers somehow empty)
    "In the far reaches",
    "Across the broad lands",
    "Within the quiet places",
    "Under a wide-borne sky",
    "Between mist and sun",
  ],
  realms: [
    "where the maps are inked with patience and rumor",
    "among dominions trod by pilgrims and storms alike",
    "within provinces that remember the first dawn",
    "through stretches of earth patient as stone altars",
    "across frontiers measured in starlight and footfall",
    "amid reaches that bend like old bows to the wind",
    "within marches paced by seasons and quiet watchers",
    "where hill and hollow still trade the same old songs",
  ],
  moods: [
    "held in quiet poise",
    "wreathed in ancestral calm",
    "cast in purposeful repose",
    "alive with workmanlike grace",
    "kept in the hush of enduring might",
    "settled with the patience of old oaths",
  ],
  sparkles: [
    "glimmering with tales older than recorded lore",
    "murmuring of covenants between wild and watchful",
    "braiding rumor with the sigh of wind and feather",
    "stirring lantern-faint wonders for any who attend",
    "promising hidden craft to the careful seeker",
    "offering small miracles to those who linger",
  ],
  appositives: [
    "a presence of the old world",
    "a keeper of covenant and craft",
    "a warden set between need and plenty",
    "a companion to the patient-hearted",
    "a testament to the land’s remembered vows",
    "a steward of quiet industries",
  ],
  linkers: [
    "Thus",
    "So",
    "And so",
    "Therefore",
    "In this wise",
    "Accordingly",
  ],
  closers: [
    "Chroniclers note its passage as surely as they mark eclipses.",
    "Villagers leave a token at its last haunt, grateful for the steadied balance.",
    "Its story is pressed between the leaves of every local almanac.",
    "Those who travel by star or stream measure their journeys by its sign.",
    "It remains a quiet oath binding people and wild in patient accord.",
    "In every telling, it stands as proof that the world yet keeps its bargains.",
  ],
};

export const CAT: Record<string, CategoryBank> = {
  animal: {
    closers: [
      "Hunters give it due courtesy, for it keeps the wild folk honest.",
      "To shepherds it is both neighbor and necessary challenge.",
      "Stories of it are traded beside campfires like coin of trust.",
      "Many a patrol has marched safer for knowing its habits.",
      "Children learn caution and courage alike from its trail.",
      "So long as it prowls, the ledger between hunger and plenty stays balanced.",
    ],
  },
  fish: {
    closers: [
      "Net-menders speak of it with salt on their tongues and respect in their hands.",
      "Lighthouses mark its currents in their ledgers of night.",
      "Where it swims, the shoals arrange themselves like devout congregations.",
      "Its passing leaves rings on the tide read by every fisher’s eye.",
      "Even the moon-road of the sea bends a fraction to its choosing.",
      "It is counted among the silent governors of the deeps.",
    ],
  },
  plant: {
    closers: [
      "Farmwives bless its shade before the first furrow is drawn.",
      "Herbalists tuck a sprig of it into their journals for luck.",
      "It seasons the tales told over winter hearths.",
      "Fields that host it seem to breathe a little easier come summer.",
      "Market-stalls brighten when its bounty arrives.",
      "So long as it roots, the folk feel the land remembers them.",
    ],
  },
};

export const REGION_OVERLAY: Record<Region, PhraseLayer> = {
  aquatic: {
    realms: ["through tide-ruled dominions whispered over by sails"],
    sparkles: ["salt-bright with drifting lantern schools"],
    appositives: ["a companion to sailors and storm-readers"],
    closers: ["The sea’s ledger keeps its name inked between storms."],
  },
  aquatic_fresh: {
    realms: ["along river-stitched lowlands and spray"],
    sparkles: ["ringed by eddies that murmur like bells"],
    appositives: ["a friend to ferrymen and reed-watchers"],
    closers: ["Riverfolk nod to it as they pole the shallows."],
  },
  aquatic_salt: {
    realms: ["where brine kingdoms trade tidings with the moon"],
    sparkles: ["alive with tides that polish stone to silver"],
    appositives: ["a magistrate of surf and swell"],
    closers: ["Its memory lingers in knots of rope and salt-stained ledgers."],
  },
  coastal: {
    realms: ["on littorals where salt and silt share custody"],
    sparkles: ["woven with gull-cry and tide-silver gifts"],
    appositives: ["a herald of harbors and dune-fast towns"],
    closers: ["Harbor ledgers keep tally of its tides."],
  },
  terrestrial: {
    realms: ["across the backbones of field and forest"],
    sparkles: ["carrying the spice of soil and leaf"],
    appositives: ["a witness to plough-song and root-speech"],
    closers: ["Its path is known to drovers and menders of hedges."],
  },
  wetlands_transitional: {
    realms: ["where water hesitates between mirror and marsh"],
    sparkles: ["draped in fog-thin mystery and reedlight"],
    appositives: ["a mediator between river oath and root pledge"],
    closers: ["Bog-keepers speak of it with lanterns hooded."],
  },
};

export const HAB_OVERLAY: Record<Habitat, PhraseLayer> = {
  alpine_tundra: {
    sparkles: ["where frost etches runes upon stubborn stone"],
    closers: ["Mountaineers toast it with thawed spirits."],
  },
  arctic_tundra: {
    sparkles: ["under auroras that stitch the sky"],
    closers: ["The north wind itself seems to honor its watch."],
  },
  cliffs: {
    sparkles: ["with updrafts that carry falcon prayers"],
    closers: ["Cliff-dwellers carve its sigil beside rope ladders."],
  },
  coastal: {
    sparkles: ["smelling of kelp smoke and wet stone"],
    closers: ["Dockhands mutter blessings when it passes."],
  },
  coral_reefs: {
    sparkles: ["with coral towers singing in color"],
    closers: ["Divers tell of it in whispers between breaths."],
  },
  desert: {
    sparkles: ["beneath suns that hammer truth from stone"],
    closers: ["Caravans pace themselves by its rare sightings."],
  },
  farmland: {
    sparkles: ["along furrows straight as hymns"],
    closers: ["Every harvest tally leaves a column for its aid."],
  },
  forest: {
    sparkles: ["in cathedral shade roofed with emerald vaults"],
    closers: ["Foresters whisper its name between axe strokes."],
  },
  grassland: {
    sparkles: ["over prairies that applaud with a million blades"],
    closers: ["Rangers follow its wake as if it were a compass."],
  },
  hills: {
    sparkles: ["across shoulders of land rolled soft as kine"],
    closers: ["Hillfolk raise a cup to it each equinox."],
  },
  hot_desert: {
    sparkles: ["where mirage and heat weave uneasy truces"],
    closers: ["Oasis-keepers track its arrival like rain."],
  },
  lake: {
    sparkles: ["beside bowls of still water that mirror the moon"],
    closers: ["Boatmen strike their poles twice in respect."],
  },
  lakes: {
    sparkles: ["at chains of lakes strung like polished coins"],
    closers: ["Fisherfolk map its circuit with weathered twine."],
  },
  limestone_caves: {
    sparkles: ["among chambers where dripstone ticks like clocks"],
    closers: ["Spelunkers chalk a rune of it before descent."],
  },
  marshes: {
    sparkles: ["through reed halls heavy with lantern flies"],
    closers: ["Marshwardens keep a seat for it at council."],
  },
  ocean_shores: {
    sparkles: ["where foam writes brief scriptures on sand"],
    closers: ["Beachcombers measure their luck by its trace."],
  },
  open_ocean: {
    sparkles: ["beneath horizons rimmed in glass-blue metal"],
    closers: ["Helmsmen adjust their sails to its rumor."],
  },
  ponds: {
    sparkles: ["with dragonflies stitching tiny sermons"],
    closers: ["Children skip stones in the hope of catching sight of it."],
  },
  rivers: {
    sparkles: ["along current-roads lined with willow fingers"],
    closers: ["Ferrymen leave a coin for it at each landing."],
  },
  semi_arid_scrublands: {
    sparkles: ["where sage and thorn trade whispers"],
    closers: ["Goatherds tip their hats when it crests a ridge."],
  },
  swamps: {
    sparkles: ["under moss-curtained branches steeped in dusk"],
    closers: ["Swamp guides swear it keeps lost lanterns lit."],
  },
  tidal_flats: {
    sparkles: ["on flats that glimmer like hammered pewter"],
    closers: ["Harvesters of salt read its path like tides."],
  },
  tundra: {
    sparkles: ["where the ground hums with buried frost"],
    closers: ["Nomads fold its tale into every winter song."],
  },
  urban: {
    sparkles: ["between guttersong and rooftop gardens"],
    closers: ["Night watchmen mark their rounds by its passing."],
  },
  wetland: {
    sparkles: ["over peat that keeps the footprints of clouds"],
    closers: ["Heron-tamers nod solemnly when it alights."],
  },
  riverlands: {
    sparkles: ["across braid-plains stitched with silver loops"],
    closers: ["Barge captains reckon their fortunes by its seasons."],
  },
  mountains: {
    sparkles: ["where ridgelines write fierce signatures"],
    closers: ["Summiteers leave a cairn stone in its honor."],
  },
};

export const OPENER_THEMES: Record<string, string[]> = {
  deep: [
    "Far below where daylight fails",
    "In the hush of the long descent",
    "Where pressure writes its stern scripture",
    "Beneath leagues of untroubled dark",
    "Down in the blue that borders black",
    "Among trenches that keep the world’s oldest secrets",
  ],
  cold: [
    "Under the long watch of chill",
    "Where frost keeps counsel with stone",
    "In air that bites and brightens alike",
    "Where the sun is a thin coin and the wind an old judge",
    "Amid snows that remember other ages",
    "Where ice sings in the marrow of things",
  ],
  coastal: [
    "Where brine combs the stones and gulls write in air",
    "By the weir and the tidegate’s patient hinge",
    "Where waves measure the day in silver",
    "On shores that trade with moon and wind",
    "Where kelp gardens bow and rise",
    "At the seam where land and salt argue kindly",
  ],
  river: [
    "Along the road that water remembers",
    "Where eddy and riffle speak in turns",
    "Under willows that braid the banks",
    "Between gravel rosaries and oxbow mirrors",
    "Where ferry and heron share a path",
    "Where the current keeps true even in sleep",
  ],
  lake: [
    "At the still bowls that hold the sky",
    "Where shelves of water step down into hush",
    "By spring-fed basins cool as coin",
    "Where shore and reflection strike a bargain",
    "On margins the wind teaches to whisper",
    "In kettle-lakes deep as old stories",
  ],
  pond: [
    "By quiet pans of sky-water",
    "Where dragonflies write brief scriptures",
    "At banks tufted with sedge and patience",
    "Where ripples carry gossip from leaf to leaf",
    "Where frogs count the night in slow numbers",
    "At edges that teach children to look closely",
  ],
  reef: [
    "In gardens where stone breathes color",
    "Among buttresses busy with small kingdoms",
    "Where light breaks into a thousand harvests",
    "Along ridges patrolled by curious eyes",
    "Where the tide keeps a polychrome calendar",
    "In cities of coral raised grain by grain",
  ],
  cave: [
    "Under earth where drip is scripture",
    "In dark that keeps its own weather",
    "Where stone remembers the sea it once drank",
    "Beyond the daylight’s last polite bow",
    "Where echo and footstep are kin",
    "Among chambers sealed with ancient hush",
  ],
  desert: [
    "Where stones burn by day and sing by night",
    "Under a sky spare of clouds and mercy",
    "Where distance is a kind of tide",
    "On roads drawn in wind and salt",
    "Among wadis veined with memory",
    "Where shade is a coin well spent",
  ],
  scrub: [
    "Where thorn and wind keep small courts",
    "On benches of bitterbrush and patience",
    "Where rains are brief but well-remembered",
    "Among shrubs that carry their own shadows",
    "Where the earth speaks in low syllables",
    "On slopes that hoard their moisture like lore",
  ],
  grass: [
    "Where grass runs like water beneath the sky",
    "In countries measured in horizons",
    "Where wind braids seed and rumor",
    "Across leagues that change by color more than wall",
    "Where the earth wears a green thought",
    "In prairies that applaud the weather",
  ],
  forest: [
    "In green shade where birds keep counsel",
    "Where leaf and loam remember kindly",
    "Under oak-law and ash-counsel",
    "In aisles roofed by patient branches",
    "Where sun pools like coin on moss",
    "Among trunks that count the years inward",
  ],
  hill: [
    "Over fold and shoulder of kindly ground",
    "Where paths prefer the ridgeline",
    "Among humps the weather tends like sheep",
    "Where vistas arrive by honest labor",
    "Between gullies cut by yesterday’s rain",
    "On slopes that teach feet their craft",
  ],
  farmland: [
    "Among ridge-and-furrow kept true",
    "Where plough and season hold a pact",
    "In fields that trade sweat for bread",
    "Where hedges tally the year in birds",
    "At barns that breathe warm patience",
    "Where soil keeps score in seeds",
  ],
  wetland: [
    "Where fog makes a second ground",
    "In reed-halls roofed with heron wing",
    "Among black soils that drink the sky",
    "Where every path remembers being water",
    "At margins that barter root for silt",
    "Where the air walks barefoot",
  ],
  swamp: [
    "Where cypress knees count the years",
    "In tea-dark waters that keep secrets",
    "Among hammocks stitched by roots",
    "Where the ground thinks slowly",
    "Where light arrives in cautious coins",
    "In hollows where sound moves like syrup",
  ],
  tundra: [
    "Under the long republic of cold",
    "Where the dwarf willows bow like monks",
    "On mosslands that keep a quiet fire",
    "Where wind edits what the earth would say",
    "Among stones arranged by patience",
    "Where summer is a postcard and winter the letter",
  ],
  urban: [
    "Within walls and way-stones",
    "Where gutter and garden share a fence",
    "Among markets that change by bell and rumor",
    "In alleys where cats keep the peace",
    "Beneath roofs that gossip in rain",
    "Where people are a season of their own",
  ],
  cliff: [
    "Where cliffs keep their thunder",
    "On shelves where nests outnumber paths",
    "Above echoes that arrive before their owners",
    "Along faces that teach wind its manners",
    "At edges the sea is still negotiating",
    "Where shadow is a ladder for wings",
  ],
  shore: [
    "At the lip where land drinks salt",
    "On flats that remember the moon by smell",
    "Where foam writes fast letters",
    "Among wrack-lines that catalog storms",
    "Where sand keeps a ledger of feet",
    "Where the sea leaves small gifts and takes larger",
  ],
  fresh: [
    "Where water runs with the taste of stone",
    "Along banks that smell of willow and silt",
    "Where riffles speak in silver syllables",
    "In reaches that trade shade for minnows",
    "Where springs keep their promises cold",
    "Under kingfisher arcs and alder gossip",
  ],
  salt: [
    "Where brine writes its law on wind and lip",
    "Under gull-cry and weather-scraped sky",
    "Where kelp combs the long swell",
    "At the seam where foam edits the shore",
    "Where salt keeps old accounts with rock",
    "Among wrack lines that catalog storms",
  ],
  brackish: [
    "Where river and tide shake hands without trust",
    "In waters that answer to two masters",
    "Where reeds taste of both field and foam",
    "Among inlets that change their minds by hour",
    "Where silt and salt split the bill",
    "At mouths that pronounce both freshwater and sea",
  ],
  transitional: [
    "Where paths remember being water",
    "In margins that barter root for silt",
    "Where fog makes a second ground",
    "Among tussocks that pass as islands",
    "Where depth is guessed by boot and bird",
    "At edges that practice compromise",
  ],
  upland: [
    "Above the easy country, where wind keeps court",
    "On shoulders that teach feet their craft",
    "Where granite shelves hold small republics",
    "Among ridgelines that prefer straight talk",
    "Where weather rehearses on the stones",
    "In air thinned by honesty",
  ],
  human_edge: [
    "Where hedges tally the year in birds",
    "Between barn-breath and field-sweat",
    "Where paths are written in use, not ink",
    "Among walls that learned their stones by hand",
    "Where bells and roosters share the morning",
    "At gates that complain in good humor",
  ],
};

export const REGION_TO_THEMES: Record<(typeof REGIONS)[number], string[]> = {
  aquatic: ["deep", "shore", "river", "lake", "brackish"],
  aquatic_fresh: ["fresh", "river", "lake", "pond", "wetland"],
  aquatic_salt: ["salt", "deep", "reef", "shore", "coastal"],
  coastal: ["coastal", "shore", "reef", "salt"],
  terrestrial: ["forest", "hill", "grass", "upland", "farmland", "scrub"],
  wetlands_transitional: ["transitional", "wetland", "swamp", "river", "brackish"],
};

export const HABITAT_TO_THEMES: Record<(typeof HABITATS)[number], string[]> = {
  alpine_tundra: ["tundra", "hill", "cold"],
  arctic_tundra: ["tundra", "cold"],
  cliffs: ["cliff", "hill", "coastal"],
  coastal: ["coastal", "shore", "reef"],
  coral_reefs: ["reef", "shore", "deep"],
  desert: ["desert", "scrub"],
  farmland: ["farmland", "grass"],
  forest: ["forest", "hill"],
  grassland: ["grass", "hill"],
  hills: ["hill", "grass"],
  hot_desert: ["desert", "scrub"],
  lake: ["lake", "wetland"],
  lakes: ["lake", "wetland"],
  limestone_caves: ["cave", "hill"],
  marshes: ["wetland", "swamp", "river"],
  ocean_shores: ["shore", "coastal"],
  open_ocean: ["deep", "reef", "shore"],
  ponds: ["pond", "wetland"],
  rivers: ["river", "wetland", "shore"],
  semi_arid_scrublands: ["scrub", "desert", "grass"],
  swamps: ["swamp", "wetland"],
  tidal_flats: ["shore", "coastal", "wetland"],
  tundra: ["tundra", "cold"],
  urban: ["urban", "farmland"],
  wetland: ["wetland", "river", "swamp"],
  riverlands: ["river", "wetland"],
  mountains: ["hill", "tundra", "cold"],
};

// --- MICRO THEMES: openers specific to ANIMAL taxon groups and PLANT growth forms ---
// Ensure each array has >=3 openers (we provide 5–6 for variety)

export const OPENER_THEMES_ANIMAL: Record<string, string[]> = {
  bird: [
    "Where the air keeps a road for quick wings",
    "Along drafts that carry feather and fortune",
    "Above hedgerow and hollow where songs argue kindly",
  ],
  reptile: [
    "Where stones remember noon and scales keep counsel",
    "On banks that drink the sun by inches",
    "Among warm flats where shadow is a narrow thing",
  ],
  amphibian: [
    "At the seam of water and weed where skins stay listening",
    "Where banks are soft and dusk arrives on wet feet",
    "Among reeds that count the night by croak and hush",
  ],
  fish: [
    "Where light breaks into coins and depth keeps the change",
    "In channels that pronounce the cold in careful syllables",
    "Between shelf and shadow where fins write their errands",
  ],
  mammal: [
    "Where fur keeps faith with weather and road",
    "Along runs the hedge remembers",
    "On paths stamped into memory by hoof and hunger",
  ],
  insect: [
    "Where small industry makes daylight hum",
    "In places mapped by nectar and intention",
    "Among stems that host a parliament of wings",
  ],
  crustacean: [
    "Under stones that tick with tide-logic",
    "Where crevices tally the moon’s accounts",
    "Along the scuttle-roads between foam and kelp",
  ],
  mollusk: [
    "Where patience wears a shell and leaves a silver sentence",
    "On stones that read slow scripts at night",
    "In tide pools that hoard mirrors",
  ],
  annelid: [
    "Under leaf-letters turned by rain",
    "Where soil breathes in slow paragraphs",
    "In seams that stitch root to loam",
  ],
  other: [
    "Where the map leaves the margin to rumor",
    "In corners the seasons overlook",
    "Between custom and curiosity",
  ],
};

export const OPENER_THEMES_PLANT: Record<string, string[]> = {
  tree: [
    "In aisles roofed by patient boughs",
    "Where rings count sermons in wood-grain",
    "At roots that drink from old rumors",
  ],
  shrub: [
    "Along hedges that keep both road and secret",
    "Where thorn conducts a small diplomacy",
    "Among thickets that file the wind into ribbons",
  ],
  herb: [
    "Where small greens keep a bright kitchen of sun",
    "Among beds that trade scent for bee and bell",
    "In plots that measure generosity by handfuls",
  ],
  vine: [
    "Along trellises where patience climbs in spirals",
    "Between stake and sky with quiet knots",
    "Where tendrils write cursive on air",
  ],
  grass: [
    "Where green is written in strokes and swells",
    "Across swards that applaud the weather",
    "On meadows that keep a soft ledger of steps",
  ],
  fungus: [
    "Under leaf-lids where shadow ferments",
    "Where rot turns scribe and writes the soil anew",
    "In the damp alphabet between root and stone",
  ],
  mushroom: [
    "At the hour when dew chooses its crowns",
    "Among caps that coin the morning",
    "Where gills whisper recipes to loam",
  ],
  lichen: [
    "On stones that wear slow constellations",
    "Where bark hosts maps of patient continents",
    "In pale cartographies that ignore the clock",
  ],
  algae: [
    "Where green smoke wanders the shallows",
    "In films that let sunlight spend its pocket change",
    "Among drifts that turn water into meadow",
  ],
  seaweed: [
    "In the sway-houses of kelp and current",
    "Where fronds keep time with moon and fathom",
    "Along drowned gardens that harvest light in ribbons",
  ],
  // fallback for 'shrub','tree','vine','herb','grass','fungus','mushroom','lichen','algae','seaweed' already covered
};

// --- MAP taxon groups / growth forms to their micro-themes (keys match your repo enums) ---
export const TAXON_TO_THEMES: Record<string, string[]> = {
  amphibian: ["amphibian"],
  annelid: ["annelid"],
  bird: ["bird"],
  crustacean: ["crustacean"],
  fish: ["fish"],
  insect: ["insect"],
  mammal: ["mammal"],
  mollusk: ["mollusk"],
  other: ["other"],
  reptile: ["reptile"],
};

export const GROWTH_TO_THEMES: Record<string, string[]> = {
  tree: ["tree"],
  shrub: ["shrub"],
  herb: ["herb"],
  vine: ["vine"],
  grass: ["grass"],
  fungus: ["fungus"],
  mushroom: ["mushroom"],
  lichen: ["lichen"],
  algae: ["algae"],
  seaweed: ["seaweed"],
};

// ---------------- ANIMAL DIET MICRO BANKS ----------------
// Feeding styles are inferred from diet + food_sources keywords.
export const ANIMAL_FEEDING_STYLES: Record<string, {
  verbs: string[];
  phrases: string[];
}> = {
  raptor: {
    verbs: ["stoops upon", "takes on the wing", "strikes true at", "harriers after", "sweeps down upon"],
    phrases: ["with keen eye and sharper silence", "guided by wind-law and patience", "under a covenant of claw and air"],
  },
  piscivore: {
    verbs: ["snatches", "spears", "runs down", "gulps", "chases in the glitter"],
    phrases: ["where scales write brief lightning", "in the hush below the chop", "as fins betray the shallows"],
  },
  insectivore: {
    verbs: ["gleans", "picks", "snaps up", "hawkes", "works patiently among"],
    phrases: ["following the small industry of wings", "where stems keep a busy court", "by the arithmetic of buzzing things"],
  },
  granivore: {
    verbs: ["pecks", "husks", "cracks", "gathers", "forages among"],
    phrases: ["counting seeds like coins", "where stubble keeps its secrets", "with a tidy appetite for plenty"],
  },
  nectarivore: {
    verbs: ["sips", "tastes", "hovers at", "samples", "threads from flower to flower for"],
    phrases: ["trading brightness for sweetness", "as bells of scent are rung", "with a debt to bloom and weather"],
  },
  grazer: {
    verbs: ["crops", "grazes", "mouths", "pastures upon", "strips"],
    phrases: ["moving like weather across the green", "under the steady metronome of jaw and step", "with rumen and road for tutors"],
  },
  browser: {
    verbs: ["browses", "nips", "clips", "takes the tender ends of", "selects among"],
    phrases: ["choosing leaf and twig by quiet art", "along hedges and understory", "with a map of shrubs in mind"],
  },
  scavenger: {
    verbs: ["finds", "works at", "strips", "cleans", "tends to what is left of"],
    phrases: ["putting waste back to order", "answering the ledger of loss", "under the old law of nothing wasted"],
  },
  omnivore: {
    verbs: ["takes what providence grants in", "makes meal of", "is content with", "forages broadly among", "seizes when chance offers"],
    phrases: ["neither proud nor picky", "according to place and hour", "as the season writes the menu"],
  },
  carnivore: {
    verbs: ["hunts", "harriers", "runs down", "takes quietly", "stalks"],
    phrases: ["with a low arithmetic of breath", "by spoor and shadow", "as hunger gives its lessons"],
  },
  herbivore: {
    verbs: ["grazes", "gleans", "harvests", "mouths", "feeds upon"],
    phrases: ["under the steady contract with grass and leaf", "by daylight’s honest measure", "as cud and patience decree"],
  },
};

// Keyword hints → feeding style tags (priority order matters)
export const FEEDING_HINTS: { tag: string; keywords: string[] }[] = [
  { tag: "raptor", keywords: ["rodent", "vole", "rabbit", "hare", "bird", "pigeon", "dove"] },
  { tag: "piscivore", keywords: ["fish", "salmon", "trout", "herring", "smelt", "eel", "minnow", "roe"] },
  { tag: "insectivore", keywords: ["insect", "beetle", "ant", "termite", "fly", "midge", "larva", "grub", "caterpillar"] },
  { tag: "granivore", keywords: ["seed", "grain", "acorn", "nut", "barley", "wheat", "oat", "millet"] },
  { tag: "nectarivore", keywords: ["nectar", "flower", "blossom", "pollen", "honey"] },
  { tag: "grazer", keywords: ["grass", "sedge", "pasture", "hay", "clover"] },
  { tag: "browser", keywords: ["leaf", "twig", "shrub", "browse", "bark", "shoot"] },
  { tag: "scavenger", keywords: ["carrion", "offal", "scrap", "garbage", "remains"] },
];

// Map diet field → fallback style
export const DIET_FALLBACK: Record<string, string> = {
  carnivore: "carnivore",
  herbivore: "herbivore",
  omnivore: "omnivore",
};

// ---------------- BYPRODUCT MICRO BANKS ----------------
export const ANIMAL_BYPRODUCT_MICRO: Record<string, string[]> = {
  bird: ["down for bedding", "feathers for fletching and rite", "shell for lime"],
  mammal: ["hide for leather", "tallow for candle and soap", "milk where kind allows", "bone for awl and needle"],
  reptile: ["skin for scaled leather", "oil in small count", "bone and plate for charm and tool"],
  fish: ["oil for lamp and salve", "roe in season", "skin for glue-pot and drumhead"],
  insect: ["wax for seal and taper", "honey where hives are kept", "silk from diligent worms"],
  crustacean: ["shell and chitin for dye and polish", "meat with a salt’s own sweetness"],
  mollusk: ["shell for button and inlay", "mother-of-pearl in careful hands"],
  amphibian: ["skin in scant use", "oil in old recipes little trusted"],
  annelid: ["bait for hook and fowl", "castings to sweeten soil"],
  other: ["parts to whim and wit of craft"],
};

export const PLANT_BYPRODUCT_MICRO: Record<string, string[]> = {
  tree: ["timber for beam and keel", "resin for pitch and incense", "bark for dye and cord"],
  shrub: ["bark and twig for dye-pot", "berries for color and cordial", "switches for fence"],
  herb: ["leaf and flower for tisane", "oils for salve and scent"],
  vine: ["fiber for cordage", "sap for syrup where kindly", "fruit for press and feast"],
  grass: ["straw for thatch and bedding", "chaff to fowl", "reed for pen and pipe"],
  fungus: ["spent beds to feed the midden", "spores that travel like news"],
  mushroom: ["caps for pan when kindly", "stems to stock where safe"],
  lichen: ["lichen for dye and lye", "scrap for tinder"],
  algae: ["green ash for fields", "gel for thickening in craft"],
  seaweed: ["ash for glass and soap", "iodine-scent for apothecary", "agar for kitchen’s cleverness"],
};

// ---------------- MID-PARAGRAPH MICRO BANKS (ANIMALS) ----------------
// p1: habitat/motion color; p3: lifecycle/physiology color
export const TAXON_MIDLINES: Record<string, { p1: string[]; p3: string[] }> = {
  bird: {
    p1: [
      "Wings read the country like a learned map.",
      "Feather and hollow-bone make light of long miles.",
      "It keeps a ledger with the wind and pays in feather.",
    ],
    p3: [
      "Brood and clutch are counted by weather and worm.",
      "Molt redraws its coat as seasons argue their case.",
      "Pin-feathers and song-books mark the year’s curriculum.",
    ],
  },
  reptile: {
    p1: [
      "Stone gives it counsel; sun gives it coin.",
      "It hoards warmth like a miser of noon.",
      "Stillness is its ambush and arithmetic.",
    ],
    p3: [
      "The day is shared between bask and browse of shade.",
      "Egg and sand keep their quiet treaty.",
      "Cold decides its haste; heat, its patience.",
    ],
  },
  amphibian: {
    p1: [
      "Skin drinks weather as much as water.",
      "It wears the marsh like a second house.",
      "Its step is a wet syllable between shore and pool.",
    ],
    p3: [
      "Spawn beads the margins like a rosary.",
      "Metamorphosis is its catechism, learned by mud and moon.",
      "Gills traded for lungs is an old bargain renewed yearly.",
    ],
  },
  fish: {
    p1: [
      "Fins write errands where light turns to ledger.",
      "Depth measures its speech; current edits it.",
      "It keeps to the grammar of ripple and run.",
    ],
    p3: [
      "Spawn runs by a calendar salted with moon.",
      "Scales tell the history a ring at a time.",
      "Upstream is a vow it remembers when the hour comes.",
    ],
  },
  mammal: {
    p1: [
      "Warm blood spends freely and earns by forage.",
      "Scent is its scripture; track its commentary.",
      "It keeps counsel with fur and stride.",
    ],
    p3: [
      "Young are weaned to the road by gentle degrees.",
      "Rut and milk divide the year’s labors.",
      "Dens and runs are inherited like surnames.",
    ],
  },
  insect: {
    p1: [
      "Small industry makes daylight hum around it.",
      "It keeps a city in a thimble of space.",
      "Flight and hinge share the work between them.",
    ],
    p3: [
      "Brood and instar ring like coins in a purse.",
      "Chrysalis is a door it knows how to open.",
      "Wings are the diploma of its patient schooling.",
    ],
  },
  crustacean: {
    p1: [
      "It reads the tide by fingertip and whisker.",
      "Shell is its tent and testament.",
      "Creevices keep its census.",
    ],
    p3: [
      "A molt pays for growth in quiet coin.",
      "It keeps the moon’s appointments more faithfully than priests.",
      "Eggs are carried like a secret under apron.",
    ],
  },
  mollusk: {
    p1: [
      "It wears patience as armor and quill.",
      "Its pace is a sermon on enough.",
      "Trail is a signature that dries to silence.",
    ],
    p3: [
      "Spiral houses grow by quiet margins.",
      "Spawn clouds write brief weathers under water.",
      "Pearl is the story it tells of grit and time.",
    ],
  },
  annelid: {
    p1: [
      "It stitches soil to root with unshowy thread.",
      "The earth turns and it turns with her.",
      "It edits loam in patient drafts.",
    ],
    p3: [
      "Casting by casting it buys good harvests.",
      "It wears rain like a festival.",
      "A simple body writes complex blessings in soil.",
    ],
  },
  other: {
    p1: [
      "It lives where definitions wear thin.",
      "Edges and exceptions are its parish.",
      "It keeps uncommon hours in unclaimed rooms.",
    ],
    p3: [
      "Its young inherit a knack for side doors.",
      "Life is a crooked lane that suits it fine.",
      "Its seasons are counted by rumor more than bell.",
    ],
  },
};

// ---------------- MID-PARAGRAPH MICRO BANKS (PLANTS) ----------------
export const GROWTH_MIDLINES: Record<string, { p1: string[]; p3: string[] }> = {
  tree: {
    p1: [
      "Root and crown hold parliament through the trunk.",
      "Canopy is a quiet city of light.",
      "Heartwood keeps oaths darker than wine.",
    ],
    p3: [
      "Rings add their thin coin year by year.",
      "Mast and shade are tithes paid in season.",
      "Pruning teaches it better grammar.",
    ],
  },
  shrub: {
    p1: [
      "Thicket diplomacy is written in thorn.",
      "It hems fields as a seamstress hems a cloak.",
      "Small birds pay rent in song.",
    ],
    p3: [
      "Coppice turns youth into a renewable custom.",
      "Cutting back is a kind of blessing it understands.",
      "Berries bargain with beak for seed’s safe travel.",
    ],
  },
  herb: {
    p1: [
      "Low stature, high charity.",
      "It carries kitchens in its leaves.",
      "Beds and borders are its little kingdoms.",
    ],
    p3: [
      "Bolting is its brief ambition to write cloudwards.",
      "Seed-time is a tidy ledger of promises.",
      "Spent stems still tutor the soil.",
    ],
  },
  vine: {
    p1: [
      "Tendrils write cursive on air.",
      "It climbs by patience and small agreements.",
      "Posts and trees are its kindly ladders.",
    ],
    p3: [
      "Pruning sets the year’s arithmetic of fruit.",
      "Green turns to sugar by slow debate with sun.",
      "Graft and spur are dialects it speaks.",
    ],
  },
  grass: {
    p1: [
      "Wind is its metronome.",
      "It writes plains in strokes the sky can read.",
      "Swards keep applause for the weather.",
    ],
    p3: [
      "Tillers multiply like good rumors.",
      "Hay-time is summer folded for winter.",
      "After the scythe, it returns as if remembering.",
    ],
  },
  fungus: {
    p1: [
      "It is the guildmaster of rot.",
      "Under leaf-lids it keeps its workshops.",
      "Threads make treaties the eye can’t see.",
    ],
    p3: [
      "Spore is its courier service.",
      "Deadwood is a treasury it audits.",
      "What falls, it translates for roots.",
    ],
  },
  mushroom: {
    p1: [
      "Caps coin the dawn.",
      "Gills whisper recipes to loam.",
      "It raises brief architecture from damp grammar.",
    ],
    p3: [
      "Spawn runs like ink through old paper.",
      "A ring of fruit is a festival in small.",
      "It spends itself quickly and wisely.",
    ],
  },
  lichen: {
    p1: [
      "It maps patience on bark and stone.",
      "Two partners share one slow name.",
      "It paints continents in miniature.",
    ],
    p3: [
      "Scales widen their territories without marching.",
      "Dry or wet, it remembers how to be both.",
      "Old roofs honor it as first tenant.",
    ],
  },
  algae: {
    p1: [
      "It green-tints the water’s thought.",
      "Sunlight spends pocket change upon it.",
      "Meadows drift where roots are not invited.",
    ],
    p3: [
      "Blooms are banners that sometimes overstep.",
      "It feeds small cattle invisible to most.",
      "When it dies, the whole ditch sighs and fattens.",
    ],
  },
  seaweed: {
    p1: [
      "Fronds keep time with moon and fathom.",
      "It gardens in the sway-houses of current.",
      "It combs the coast with patient hair.",
    ],
    p3: [
      "Storms harvest what knives need not.",
      "Ash and agar are its afterlives.",
      "It braids shelter for fish and small kings.",
    ],
  },
};

// ====================================================================
// DIET-SPECIFIC MIDLINES (ANIMALS) — complements ANIMAL_FEEDING_STYLES
// These are short, evocative clauses/sentences to insert in the diet para.
// ====================================================================
export const DIET_MIDLINES: Record<string, string[]> = {
  raptor: [
    "Hunger signs its name in circling quills.",
    "A shadow writes the last line before the strike.",
    "The wind is ledger and witness.",
  ],
  piscivore: [
    "Silver schools break like coins on an unseen anvil.",
    "The surface stutters; the story ends below.",
    "Depth grants audience in brief flashes.",
  ],
  insectivore: [
    "The day hums with small industry and it keeps the tune.",
    "Stems host a parliament; it knows the rules.",
    "Wings are counted rather than heard.",
  ],
  granivore: [
    "Stubble is a pantry; patience, the key.",
    "It measures the field by kernels, not strides.",
    "Every hedge hoards a meal for the polite.",
  ],
  nectarivore: [
    "Bells of scent ring their invitations.",
    "It reads the calendar in bloom and color.",
    "Sugar is a road only careful travelers find.",
  ],
  grazer: [
    "Jaw and hoof turn hours into bread.",
    "Grass is a sea; it sails slow and certain.",
    "The belly keeps pace with the horizon.",
  ],
  browser: [
    "Leaf and twig are chosen by quiet art.",
    "Hedges keep a map only mouths can read.",
    "It edits shrubs into better manners.",
  ],
  scavenger: [
    "What is left is not wasted while it walks.",
    "It tidies loss into order.",
    "The ledger closes cleanly in its presence.",
  ],
  omnivore: [
    "Seasons write the menu; it signs without complaint.",
    "Pride yields to practicality at table.",
    "It keeps company with chance and cupboard both.",
  ],
  carnivore: [
    "Breath shortens to a blade before the leap.",
    "Shadow and spoor are tutors enough.",
    "Silence pays the toll at the last step.",
  ],
  herbivore: [
    "Leaf by leaf, day by day, it prospers.",
    "Green grammar teaches contentment.",
    "Its road is long but its pace exact.",
  ],
};

// ====================================================================
// HABITAT + TAXON MIDLINES — flavor lines keyed to your repo habitats.
// Each habitat has an 'any' fallback and optional per-taxon variants.
// Add more as you like; these are compact but evocative.
// ====================================================================
export const HABITAT_TAXON_MIDLINES: Record<string, Record<string, string[]>> = {
  // WATER / COAST
  open_ocean: {
    any: [
      "Horizons have no fence here.",
      "The color of thought is blue and deep.",
    ],
    fish: [
      "Migratory roads are drawn in current rather than stone.",
      "Pressure keeps old secrets and it speaks them softly.",
    ],
    bird: [
      "Wings bargain with fetch and foam.",
      "Rest is a raft of kelp or luck.",
    ],
    mammal: [
      "Breath is a coin spent dearly, then hoarded again.",
      "Slick backs write brief commas on the swell.",
    ],
  },
  coral_reefs: {
    any: [
      "Stone gardens think in color.",
      "Light fractures into a thousand harvests.",
    ],
    fish: [
      "Territories are measured in ledges and cleaning stations.",
      "Fins flick polite etiquette between corals.",
    ],
    crustacean: [
      "Crevices count their citizens by feelers.",
      "Molt schedules are written by the moon.",
    ],
  },
  ocean_shores: {
    any: [
      "The tide erases and rewrites agreements twice daily.",
      "Wrack-lines catalog storms better than scribes.",
    ],
    bird: [
      "Steps tally sand fleas like tithes.",
      "It keeps company with foam and rumor.",
    ],
    mollusk: [
      "Shells answer questions slowly but with polish.",
      "The hinge is a modest miracle.",
    ],
  },
  tidal_flats: {
    any: [
      "Mud is a mirror for the moon.",
      "Here, patience stands shin-deep.",
    ],
    bird: [
      "Bills probe syllables the mud will not give to the ear.",
      "The flock reads braille written by clams.",
    ],
  },
  rivers: {
    any: [
      "Riffle and pool share a careful treaty.",
      "Gravel rosaries keep count of the floods.",
    ],
    fish: [
      "Upstream is a promise; downstream, a price.",
      "Eddy and seam are its classrooms.",
    ],
    amphibian: [
      "Banks are rooms that change their walls by weather.",
      "Every bend keeps a wet whisper.",
    ],
  },
  lakes: {
    any: [
      "Still water keeps a second sky secret.",
      "Shelf and sudden drop alternate like thought and dream.",
    ],
    fish: [
      "Thermoclines write invisible borders.",
      "The deep answers with small coins of light.",
    ],
  },
  lake: {
    any: ["Bowls of water hold a patient hush."],
    fish: ["Inlets and outlets are its pilgrim roads."],
  },
  ponds: {
    any: [
      "Edges teach children to look closely.",
      "Lily leaves are green rafts in a small republic.",
    ],
    insect: [
      "The air stitches itself with wings and intention.",
      "Darters patrol with needle-minds.",
    ],
  },
  wetlands: { any: ["Roots speak fluent water."] },
  wetland: {
    any: [
      "Every path remembers being water.",
      "Fog makes a second ground.",
    ],
    insect: [
      "Mosquitoes mint their miserable coins here.",
      "Dragonflies audit the accounts.",
    ],
  },
  marshes: {
    any: [
      "Sedge draws green script the wind reads aloud.",
      "Peat keeps history in its pockets.",
    ],
    amphibian: [
      "Chorus begins at dusk and ends when stars get bored.",
      "Egg-strings necklace the shallows.",
    ],
  },
  swamps: {
    any: [
      "Tea-dark water tells slow stories.",
      "Cypress knees count the years without boasting.",
    ],
    reptile: [
      "Heat is banked like a fire under scales.",
      "Surface and shadow trade favors.",
    ],
  },
  tidal_flats_same: {},

  // DRY / LAND
  desert: {
    any: [
      "Distance behaves like a tide.",
      "Shade is a coin well spent.",
    ],
    reptile: [
      "Noon is a teacher; stone the desk.",
      "Speed is saved for when it counts.",
    ],
    mammal: [
      "Water is a rumor to be chased then hoarded.",
      "Nights are kind accountants.",
    ],
  },
  hot_desert: {
    any: [
      "Stones burn by day and sing by night.",
      "Wadis keep old rain receipts.",
    ],
  },
  semi_arid_scrublands: {
    any: [
      "Thorn and wind keep small courts.",
      "Rain is brief but well-remembered.",
    ],
    mammal: [
      "Muzzle and hoof map bitterbrush diplomacies.",
      "Burrows are a second country.",
    ],
  },
  grassland: {
    any: [
      "The earth writes itself in strokes of green.",
      "Horizons travel faster than feet.",
    ],
    mammal: [
      "Grazing turns noon into bread.",
      "Calves learn the grammar of herd and hail.",
    ],
  },
  forest: {
    any: [
      "Leaf and loam remember kindly.",
      "Sun pools like coin on moss.",
    ],
    bird: [
      "Songs argue their cases at dawn.",
      "Wings thread aisles roofed by patience.",
    ],
    insect: [
      "Columns of ants move like punctuation.",
      "Beetles edit the dead into soil.",
    ],
  },
  hills: {
    any: [
      "Paths prefer the ridgeline.",
      "Gullies repeat yesterday’s rain.",
    ],
    mammal: [
      "Sure feet write neat lines on bad angles.",
      "Kids learn the art of slope before names.",
    ],
  },
  cliffs: {
    any: [
      "Edges negotiate with sky and nerve.",
      "Echoes arrive before their owners.",
    ],
    bird: [
      "Nests number more than paths.",
      "Updrafts are ladders the foot cannot climb.",
    ],
  },
  limestone_caves: {
    any: [
      "Drip is scripture here.",
      "Dark keeps a weather of its own.",
    ],
    fish: [
      "Sight is optional; hunger is not.",
      "The map is made of touch and flow.",
    ],
    other: [
      "Pale citizens keep hours the sun can’t guess.",
      "Silence is a common tongue.",
    ],
  },
  tundra: {
    any: [
      "Wind edits what the earth would say.",
      "Summer is a postcard; winter, the letter.",
    ],
    mammal: [
      "Fur bargains boldly with the long cold.",
      "Hooves keep counsel with frozen ground.",
    ],
  },
  arctic_tundra: {
    any: [
      "The sun is a thin coin; the night, a long account.",
      "Stones are arranged by patience alone.",
    ],
  },
  alpine_tundra: {
    any: [
      "Above the tree’s last whisper the weather keeps court.",
      "Granite makes small shelves for life to balance on.",
    ],
  },

  // HUMAN / EDGE
  farmland: {
    any: [
      "Plough and season hold a pact here.",
      "Hedges tally the year in birds.",
    ],
    bird: [
      "Stubble writes invitations in seed.",
      "Flocks move like edits across the field.",
    ],
  },
  urban: {
    any: [
      "Walls and way-stones make their own climate.",
      "Gutters and gardens share a fence.",
    ],
    bird: [
      "Eaves are cliffs in brick’s dialect.",
      "Dawns are rung by bell and sparrow both.",
    ],
    insect: [
      "Light is a second sun with worse manners.",
      "Crumbs breed quick economies.",
    ],
  },

  // COAST / GENERIC COASTAL MAP
  coastal: {
    any: [
      "The land and salt argue kindly at the seam.",
      "Gulls write marginalia over every page.",
    ],
  },
};

// ====================================================================
// REGION + TAXON/GROWTH MIDLINES — compact, evocative lines per Region.
// Each region has an 'any' fallback and optional per-taxon/per-growth lists.
// ====================================================================
export const REGION_TAXON_MIDLINES: Record<string, Record<string, string[]>> = {
  aquatic: {
    any: [
      "Water is road and roof alike.",
      "Depth and distance trade places here.",
    ],
    fish: [
      "Scales speak softly where currents argue.",
      "Gills count the miles better than feet.",
    ],
    bird: [
      "Wings keep counsel with fetch and foam.",
      "Rest is a raft of luck and kelp.",
    ],
    mammal: [
      "Breath is hoarded and spent like coin.",
      "Slick backs punctuate the swell.",
    ],
  },
  aquatic_fresh: {
    any: [
      "Banks and eddies are neighbors in old dispute.",
      "Mornings smell of silt and willow.",
    ],
    fish: [
      "Riffles teach, pools remember.",
      "Gravel keeps a quiet alphabet of eggs.",
    ],
    amphibian: [
      "Skin and water shake hands at every step.",
      "Spawn beads the margins like prayer.",
    ],
    insect: [
      "Caddis and midge set the table.",
      "Mayflies write brief invitations.",
    ],
  },
  aquatic_salt: {
    any: [
      "Brine writes its law in salt and weather.",
      "Tides file their petitions twice each day.",
    ],
    crustacean: [
      "Crevices tally citizens by feeler and shell.",
      "The moon keeps the molt-calendar.",
    ],
    mollusk: [
      "Hinges answer questions slowly and with polish.",
      "Shell is a diary kept in spirals.",
    ],
    fish: [
      "Fins negotiate shelf and blue-water by instinct.",
      "Schools are cities that travel.",
    ],
  },
  coastal: {
    any: [
      "Land and sea argue kindly at the seam.",
      "Gulls annotate every page of sky.",
    ],
    bird: [
      "Cliffs in this dialect are called eaves.",
      "Feeding is a margin-note in foam.",
    ],
    plant: [
      "Salt trims leaf and habit.",
      "Roots bargain with wind as much as soil.",
    ],
  },
  terrestrial: {
    any: [
      "Soil is scripture, read by hoof and root.",
      "Horizons are fenced by labor, not tide.",
    ],
    mammal: [
      "Track and scent are the morning’s newspaper.",
      "Burrow and den are surnames.",
    ],
    bird: [
      "Hedgerows host courts at dawn.",
      "Fields applaud in grain and wing.",
    ],
    plant: [
      "Seasons are tools; growth is the craft.",
      "Shade and furrow keep old treaties.",
    ],
  },
  wetlands_transitional: {
    any: [
      "Every path remembers being water.",
      "Fog makes a second ground for travelers.",
    ],
    amphibian: [
      "The choir begins at dusk and ends by star-count.",
      "Gills and lungs write alternating verses.",
    ],
    insect: [
      "Dragonflies audit the accounts mosquitoes open.",
      "Wings stitch the damp into lace.",
    ],
    plant: [
      "Root speaks fluent water; stem translates to sun.",
      "Tussocks are small islands with long pedigrees.",
    ],
  },
};
