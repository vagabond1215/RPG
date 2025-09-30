import { questHelper, type QuestSkillRequirement } from "./questHelper.js";
import type { CalendarDate } from './calendar.js';
import type { Habitat, WeatherReport } from './weather.js';
const MAP_BASE_PATH = "assets/images/Maps";

export type VendorType = 'none' | 'street' | 'shop';

export interface OwnershipDetail {
  owner: string;
  stewards?: string[];
  notes?: string;
}

export interface LocationOwnership {
  buildings?: Record<string, OwnershipDetail>;
  businesses?: Record<string, OwnershipDetail>;
}

export interface QuestAvailability {
  available: boolean;
  demand: number;
  reason?: string;
  eventTag?: string;
}

export interface QuestVisibilityBinding {
  region: string;
  habitat: Habitat;
  district?: string;
  board?: string;
  business?: string;
  location?: string;
}

export interface QuestVisibilityContext {
  date: CalendarDate;
  weather: WeatherReport;
  random: () => number;
  binding: QuestVisibilityBinding;
  laborCondition?: LaborCondition;
  questTitle?: string;
}

export type QuestVisibilityRule = (
  context: QuestVisibilityContext,
) => QuestAvailability;

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
  quests: Quest[];
  questBoards: Record<string, Quest[]>;
  businesses?: BusinessProfile[];
  ownership?: LocationOwnership;
  vendorType?: VendorType;
}

export interface Quest {
  title: string;
  description: string;
  location: string | null;
  requirements: string[] | null;
  conditions: string[] | null;
  timeline: string | null;
  risks: string[] | null;
  reward: string | null;
  skillRequirements?: QuestSkillRequirement[];
  repeatable?: boolean;
  highPriority?: boolean;
  requiresCheckIn?: boolean;
  postingStyle?: string;
  issuer?: string;
  guildRankRequirement?: string;
  reputationRequirement?: string;
  rewardNotes?: string;
  replacementFor?: string;
  notes?: string;
  visibility?: QuestVisibilityRule;
  visibilityBinding?: QuestVisibilityBinding;
  laborCondition?: LaborCondition;
}

export type LaborTier = 'unskilled' | 'skilled' | 'specialist';

export interface WorkforceBand {
  type: LaborTier;
  count: number;
  roles: string;
  notes?: string;
}

export interface WorkforceProfile {
  description: string;
  normal: WorkforceBand[];
}

export interface LaborCondition {
  trigger: string;
  season: string;
  description: string;
  staffing: WorkforceBand[];
}

export interface BusinessScale {
  tier: 'cottage' | 'hamlet' | 'village' | 'township' | 'regional' | 'strategic';
  label: string;
  rationale: string;
  output: string;
}

export interface BusinessProfile {
  name: string;
  category: 'agriculture' | 'craft' | 'processing' | 'security' | 'logistics' | 'support';
  scale: BusinessScale;
  production: { goods: string[]; notes: string };
  workforce: WorkforceProfile;
  laborConditions: LaborCondition[];
  quests: Quest[];
  ownership?: OwnershipDetail;
  vendorType?: VendorType;
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
    quests: [],
    questBoards: {},
    ownership: undefined,
  };
}

function createQuest(
  title: string,
  description: string,
  opts: Partial<Quest> = {},
): Quest {
  return questHelper({ title, description, ...opts }) as Quest;
}

function addQuestBoards(loc: Location) {
  const boards: Record<string, Quest[]> = { ...loc.questBoards };

  const ensureBoard = (name: string, quests: Quest[]) => {
    if (boards[name]) {
      boards[name].push(...quests);
    } else {
      boards[name] = quests;
    }
  };

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
      const boardName = `${d} Quest Board`;
      ensureBoard(
        boardName,
        [
          createQuest(
            `Assist ${d} locals`,
            `Handle tasks for residents of ${d}.`,
          ),
        ],
      );
    });
  }

  ensureBoard(
    "Town Plaza Quest Board",
    [
      createQuest(
        "Help set up market stalls",
        "Assist merchants in preparing stalls.",
      ),
      banditPatrol,
      prototypeBlade,
    ],
  );

  ensureBoard(
    "Church Quest Board",
    [
      createQuest(
        "Collect healing herbs",
        "Gather herbs requested by the clergy.",
      ),
    ],
  );

  ensureBoard(
    "City Gate Quest Board",
    [
      createQuest(
        "Escort departing caravan",
        "Guard caravan until next waypoint.",
      ),
      banditPatrol,
    ],
  );

  loc.pointsOfInterest.buildings.forEach((b) => {
    const lower = b.toLowerCase();
    const boardName = `${b} Quest Board`;
    if (boards[boardName]) {
      return;
    }
    if (lower.indexOf("smith") !== -1) {
      ensureBoard(
        boardName,
        [
          createQuest("Gather iron ore", "Bring quality ore for smelting."),
          prototypeBlade,
        ],
      );
    } else if (
      lower.indexOf("carpenter") !== -1 ||
      lower.indexOf("carver") !== -1 ||
      lower.indexOf("fletcher") !== -1
    ) {
      ensureBoard(
        boardName,
        [
          createQuest(
            "Harvest fine timber",
            "Collect seasoned wood from nearby forest.",
          ),
        ],
      );
    } else if (lower.indexOf("alchemist") !== -1) {
      ensureBoard(
        boardName,
        [
          createQuest(
            "Collect rare herbs",
            "Fetch ingredients for experimental potion.",
          ),
        ],
      );
    } else if (lower.indexOf("enchant") !== -1) {
      ensureBoard(
        boardName,
        [
          createQuest(
            "Gather arcane crystals",
            "Acquire crystals from old ruins.",
          ),
        ],
      );
    } else if (lower.indexOf("guild") !== -1) {
      ensureBoard(
        boardName,
        [
          createQuest(
            `Assist ${b}`,
            `Help with tasks at ${b}.`,
          ),
        ],
      );
    }
  });

  loc.questBoards = boards;
  const allQuests: Quest[] = Object.values(boards).reduce(
    (arr: Quest[], q) => arr.concat(q),
    [] as Quest[],
  );
  loc.quests.push(...allQuests);
}

const BUSINESS_STREET_ONLY = /market|plaza|square|row|arcade|promenade|roadside|boardwalk|bazaar|stalls?/i;
const BUSINESS_NO_VENDOR = /wharf|warehouse|yard|naval|barracks|guard|temple|shrine|monastery|academy|keep|hall|exchange|office|arena|court/i;

function defaultVendorTypeForBusiness(business: BusinessProfile): VendorType {
  if (business.vendorType) return business.vendorType;
  const name = business.name || '';
  if (BUSINESS_STREET_ONLY.test(name)) return 'street';
  if (BUSINESS_NO_VENDOR.test(name)) return 'none';
  if (business.category === 'logistics' || business.category === 'security') return 'none';
  return 'shop';
}

const LOCATION_HIGH_SECURITY = /keep|citadel|fort|barracks|naval|guard|temple|shrine|monastery|academy/i;

function defaultVendorTypeForLocation(location: Location): VendorType {
  if (location.vendorType) return location.vendorType;
  const name = location.name || '';
  if (LOCATION_HIGH_SECURITY.test(name)) return 'none';
  if (/market|plaza|ward|district|farmland|docks|harbor|port|road/i.test(name)) return 'street';
  return 'street';
}

function applyVendorDefaults(locations: Record<string, Location>) {
  Object.values(locations).forEach((location) => {
    if (!location) return;
    location.vendorType = defaultVendorTypeForLocation(location);
    if (Array.isArray(location.businesses)) {
      location.businesses.forEach((business) => {
        business.vendorType = defaultVendorTypeForBusiness(business);
      });
    }
  });
}

const makeBand = (
  type: LaborTier,
  count: number,
  roles: string,
  notes?: string,
): WorkforceBand => ({ type, count, roles, notes });

const unskilled = (count: number, roles: string, notes?: string): WorkforceBand =>
  makeBand('unskilled', count, roles, notes);

const skilled = (count: number, roles: string, notes?: string): WorkforceBand =>
  makeBand('skilled', count, roles, notes);

const specialist = (
  count: number,
  roles: string,
  notes?: string,
): WorkforceBand => makeBand('specialist', count, roles, notes);

const buildQuestBoardMap = (
  businesses: BusinessProfile[],
): Record<string, Quest[]> => {
  const boards: Record<string, Quest[]> = {};
  businesses.forEach((business) => {
    boards[`${business.name} Quest Board`] = business.quests;
  });
  return boards;
};

const WAVES_BREAK_FARMLAND_BUSINESSES: BusinessProfile[] = [
  {
    name: "Bayside Brickworks",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "Regional Kiln Complex (Large)",
      rationale:
        "Largest brick yard on the coast supports Wave's Break, Creekside contracts, and lighthouse maintenance.",
      output:
        "Cycles six down-draft kilns per tenday (~18,000 bricks) plus roof tiles for urgent repairs.",
    },
    production: {
      goods: ["fired brick", "roof tiles", "pavers"],
      notes:
        "Contracts prioritize harbor walls, city housing, and outpost beacons; tile runs scheduled between major brick burns.",
    },
    workforce: {
      description:
        "Continuous kiln operation demands crews for clay extraction, mold filling, firing watches, and sorting.",
      normal: [
        unskilled(18, "clay diggers, barrow haulers, drying-rack turners"),
        skilled(6, "kiln wardens, clay molders, mortar mixers"),
        specialist(2, "draft masters gauging vents and fuel quartermasters"),
      ],
    },
    laborConditions: [
      {
        trigger: "Dry-season kiln trains",
        season: "Late spring to early autumn",
        description:
          "Stable winds and low humidity allow all kilns to fire simultaneously, demanding extra diggers and relief wardens.",
        staffing: [
          unskilled(10, "temporary clay diggers and rack turners for night shifts"),
          skilled(2, "journeyman kiln tenders to relieve masters during midnight cycles"),
        ],
      },
      {
        trigger: "Storm damage rebuild orders",
        season: "Immediately after severe coastal storms",
        description:
          "Harborworks rushes structural-grade brick orders to rebuild seawalls and tower stairs with strict tolerances.",
        staffing: [
          unskilled(6, "haulers to load barges and carts on shortened curing windows"),
          skilled(4, "masonry finishers to chamfer, stamp, and inspect batches"),
          specialist(1, "quality assessor to certify structural lots"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Kiln-Keeper's Call",
        "Master Varla Tidemold calls for extra crews to keep every kiln burning through the dry-season run.",
        {
          location: "Bayside Brickworks",
          requirements: [
            "Strength to haul clay barrows for ten-hour watches",
            "Masonry or Smith's Tools proficiency 30+ for kiln-warden applicants",
            "Endurance gear issued; workers must tolerate kilnside heat and ash",
          ],
          conditions: [
            "Six-day contract with rotating 6-hour watches (two shifts per day)",
            "Mandatory draft-control briefing before first shift",
          ],
          timeline: "Dry-season kiln run (late spring to early autumn) — 10-day posting",
          risks: [
            "Heat exhaustion or burns if vents are mishandled",
            "Clay pits slick with fog; slips cause sprains or broken limbs",
          ],
          reward: "1 sp per day for laborers; 2 sp plus kiln bonus for wardens",
          rewardNotes:
            "Replaces the standard day-labor docket for the burn window with a 25% premium to draw extra crews.",
          postingStyle: "Guild Muster Broadside",
          issuer: "Master Kilner Varla Tidemold",
          replacementFor: "Standard kiln labor docket",
        },
      ),
      createQuest(
        "Stormwall Rebuild Muster",
        "Harborworks levies emergency crews to turn structural-grade bricks for storm-damaged walls and stairs.",
        {
          location: "Bayside Brickworks",
          requirements: [
            "Masonry proficiency 40+ or Intelligence 12+ with Mason's Tools training",
            "Ability to read harbor wall specifications and stamp compliance marks",
            "Builders' Guild Journeyman rank or Wave's Break Guard Engineer Corps badge",
          ],
          conditions: [
            "Work begins within six hours of beacon alarm after a major storm",
            "Night shifts mandatory until Harborworks steward signs off on quotas",
          ],
          timeline: "Emergency levy — active for three days after severe coastal storms",
          risks: [
            "Rushed curing may crack; negligence fined by Harborworks inspectors",
            "Storm debris in clay pits introduces hazards and contaminants",
          ],
          reward: "3 sp per shift plus Harborworks hazard stipend",
          rewardNotes:
            "Supersedes routine maintenance contracts until storm rebuilding quotas are met.",
          postingStyle: "Emergency Masonry Levy",
          issuer: "Harborworks Foreman Torgan Slate",
          guildRankRequirement: "Builders' Guild Journeyman or Guard Engineer",
          replacementFor: "Standard harbor brick orders",
        },
      ),
    ],
  },
  {
    name: "Brackenshore Croft",
    category: "agriculture",
    scale: {
      tier: 'village',
      label: "Terraced Grain Croft (Medium)",
      rationale:
        "Supplements city granaries with hardy salt-wind barley while feeding Gate garrisons and caravans.",
      output: "Turns out 120 acres equivalent of grain annually with terrace rotation and seed trials.",
    },
    production: {
      goods: ["barley", "grain bundles", "seed stock"],
      notes:
        "Irrigated terraces supply both Wave's Break granaries and contract deliveries to the East Road caravans.",
    },
    workforce: {
      description: "Steep terraces demand sure-footed crews for sowing, stone wall upkeep, and harvest bundling.",
      normal: [
        unskilled(16, "planters, weeders, bundlers working the terraces"),
        skilled(5, "field-reeves, irrigation tenders, terrace masons"),
      ],
    },
    laborConditions: [
      {
        trigger: "Saltwind planting rush",
        season: "Early spring after last frost",
        description:
          "Seeds must be set before equinox squalls arrive, requiring every terrace to be planted within six days.",
        staffing: [
          unskilled(12, "planters and seed pressers working double shifts"),
          skilled(2, "irrigation reeves to monitor sluice gates during wind gusts"),
        ],
      },
      {
        trigger: "Pre-gale harvest",
        season: "Late summer through early autumn ahead of sea gales",
        description:
          "Ripened grain must be bound and tarped before equinox storms flatten the terraces.",
        staffing: [
          unskilled(14, "reapers and bundle porters"),
          skilled(3, "terrace wardens to inspect retaining walls and tarps"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Saltwind Planters' Levy",
        "Field-reeve Maera calls for hands to seed the terraces before equinox squalls lash the hillside.",
        {
          location: "Brackenshore Croft",
          requirements: [
            "Farming proficiency 20+ or Survival 18+ for hillside planting",
            "Balance to work wet stone ledges; climbing checks enforced",
            "Willingness to share bunkhouse quarters for six days",
          ],
          conditions: [
            "Dawn-to-dusk planting with two short meal bells",
            "Stonewall inspection each dusk to brace for incoming gusts",
          ],
          timeline: "Early spring (six-day sowing window)",
          risks: [
            "High winds may shove workers from terraces",
            "Irrigation sluices can flood lower rows if unattended",
          ],
          reward: "7 cp per day plus seed bonus meal chit",
          rewardNotes:
            "Posting replaces the usual day-hire planting notice with increased pay to lure extra crofters.",
          postingStyle: "Agrarian Levy Notice",
          issuer: "Field-reeve Maera Saltbound",
          replacementFor: "Routine sowing roster",
        },
      ),
      createQuest(
        "Saltwind Reapers' Bounty",
        "Reapers are needed to bind the crop before gale warnings close the terraces.",
        {
          location: "Brackenshore Croft",
          requirements: [
            "Sickle or Scythe proficiency 25+",
            "Ability to tarp grain stacks in driving wind",
            "Teams must include at least one member with Animal Handling (Pack Goat) 15+ to manage terrace packbeasts",
          ],
          conditions: [
            "Night tarp detail rotates among teams to guard against storm squalls",
            "All crews muster at dawn for weather briefing from the reeve",
          ],
          timeline: "Late summer harvest (five-day emergency contract)",
          risks: [
            "Slippery terraces risk falls when sudden squalls hit",
            "Wet grain mildews if tarp duty is neglected",
          ],
          reward: "1 sp per day plus share of preserved grain",
          rewardNotes:
            "Higher bounty replaces ordinary harvest postings to draw hands from neighboring farms.",
          postingStyle: "Harvest Bounty Broadside",
          issuer: "Brackenshore Croft Council",
          replacementFor: "Standard harvest hire",
        },
      ),
    ],
  },
  {
    name: "Cliffblossom Hives",
    category: "agriculture",
    scale: {
      tier: 'hamlet',
      label: "Cliffside Apiary Cluster (Specialty)",
      rationale:
        "Supplements Mistflower Apiary with cliff-foraged nectar prized by Greensoul alchemists and nobles.",
      output: "Harvests 40 comb crates per season with steep-cliff access crews.",
    },
    production: {
      goods: ["cliff honey", "wax blocks", "royal jelly"],
      notes:
        "Honey flows to city apothecaries and temple offerings; wax supplied to Candlewrights' Guild.",
    },
    workforce: {
      description:
        "Cliff hives need rope crews below and bee-masters above to move combs without angering swarms.",
      normal: [
        unskilled(8, "ground runners, smoker tenders, crate haulers"),
        skilled(4, "climber-beekeepers managing comb harvest"),
        specialist(1, "senior apiarist tracking queen health"),
      ],
    },
    laborConditions: [
      {
        trigger: "Spring comb lift",
        season: "Late spring during calm mornings",
        description:
          "First nectar flow yields delicate combs that must be lifted before wind or gulls ruin them.",
        staffing: [
          unskilled(6, "rope tenders and crate runners for the lift"),
          skilled(3, "climber apiarists with calm hands"),
        ],
      },
      {
        trigger: "Stormbound hive rescue",
        season: "Whenever sea squalls dislodge hive boxes",
        description:
          "Boxes shaken loose along the cliff need urgent retrieval to prevent colony loss.",
        staffing: [
          unskilled(4, "anchor crew managing winches"),
          skilled(3, "rescue climbers"),
          specialist(1, "healer or herbalist to salve stings and smoke bees"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Cliff Nectar Levy",
        "Honeywardens commission sure-handed climbers to lift the spring combs before gulls strip them bare.",
        {
          location: "Cliffblossom Hives",
          requirements: [
            "Animal Handling (Bees) proficiency 25+",
            "Rope Use or Climbing proficiency 30+ with safety harness",
            "Herbalism 15+ or apiarist training to brew calming smoke",
          ],
          conditions: [
            "Crews descend at dawn when winds are light",
            "Smoker discipline enforced; no open flames on the ledges",
          ],
          timeline: "Late-spring nectar flow (four-morning contract)",
          risks: [
            "Bee swarms may break lines if calm is lost",
            "Loose shale along the cliff face can shear ropes",
          ],
          reward: "9 cp per morning plus comb share",
          postingStyle: "Apiary Levy Posting",
          issuer: "Honeywarden Sera Cliffbloom",
        },
      ),
      createQuest(
        "Stormbound Hive Rescue",
        "Wind-torn hive boxes dangle over the surf and must be winched up before colonies scatter.",
        {
          location: "Cliffblossom Hives",
          requirements: [
            "Animal Handling (Bees) 30+ or Wisdom 13+ with beekeeper's tools",
            "Climbing proficiency 35+ and familiarity with belay knots",
            "First Circle nature magic or Herbalism 25+ to tend stings on site",
          ],
          conditions: [
            "Activated by Watchtower gale warnings; crews muster within two hours",
            "Requires Adventurers' Guild Bronze rank or Apiarists' Guild Journeyman badge for liability",
          ],
          timeline: "Emergency deployment during storm season",
          risks: [
            "Falling debris from cliff overhangs",
            "Angered bees swarm rescuers if smoke fails",
          ],
          reward: "2 sp per rescued hive plus guild hazard bonus",
          rewardNotes: "Temporarily replaces routine wax rendering shifts to focus on colony survival.",
          postingStyle: "Emergency Hive Writ",
          issuer: "Apiarists' Guild Relay",
          guildRankRequirement: "Adventurers' Guild Bronze or Apiarists' Journeyman",
        },
      ),
    ],
  },
  {
    name: "Cliffbreak Quarry",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "Sea Cliff Quarry (Large)",
      rationale:
        "Provides cut stone for Wave's Break fortifications, Tidewatcher Lighthouse, and export blocks to Coral Keep.",
      output: "Cuts 24 dressed blocks per day under normal operation, plus rubble aggregate.",
    },
    production: {
      goods: ["cut stone", "aggregate", "lintels"],
      notes:
        "Stone shipments support harbor seawalls, noble villas, and road paving beyond the city.",
    },
    workforce: {
      description: "Split crews manage wedge setting, block dressing, haul teams, and crane winches over the surf.",
      normal: [
        unskilled(20, "rubble haulers, wedge hammerers, winch operators"),
        skilled(6, "quarrymen setting seams, block dressers, sawyers"),
        specialist(2, "surveyors mapping seams and checking stability"),
      ],
    },
    laborConditions: [
      {
        trigger: "Dry-week extraction surge",
        season: "During dry weeks with minimal spray",
        description:
          "Orders stack up when the cliff face is safe, requiring additional hammer crews and survey oversight.",
        staffing: [
          unskilled(12, "extra hammer teams and sled pullers"),
          skilled(4, "journeyman stonecutters for face dressing"),
          specialist(1, "stability surveyor to watch for fissures"),
        ],
      },
      {
        trigger: "Harbor wall rush orders",
        season: "After major storms",
        description:
          "Replacement blocks for seawalls and breakwaters demand precision cuts with immediate shipping.",
        staffing: [
          unskilled(8, "load crews for barges working overnight"),
          skilled(5, "mason-finishers to bevel and number blocks"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Quarry Wedge Charter",
        "Foreman Brann seeks hammer crews and a master quarryman to free fresh blocks before the next barge.",
        {
          location: "Cliffbreak Quarry",
          requirements: [
            "Strength to swing sledges for extended shifts",
            "Masonry proficiency 35+ or Wisdom 12+ with Mason's Tools to read seam lines",
            "Safety training certificate from the Stonecutters' Guild",
          ],
          conditions: [
            "Twelve-hour shifts split by tide schedule",
            "Mandatory rest cycle every third day to prevent fatigue accidents",
          ],
          timeline: "Dry-week extraction surge (eight-day charter)",
          risks: [
            "Falling stone from undercut seams",
            "Sudden squalls drench faces; slips on algae-covered rock",
          ],
          reward: "1 sp 5 cp per shift plus bonus per flawless block",
          postingStyle: "Stonecutters' Charter",
          issuer: "Foreman Brann Cliffbreak",
        },
      ),
      createQuest(
        "Harborface Rush Order",
        "Storm battered the seawall—precision blocks must be cut, numbered, and loaded overnight.",
        {
          location: "Cliffbreak Quarry",
          requirements: [
            "Masonry proficiency 45+ or Intelligence 13+ with Stonecutters' Guild certification",
            "Ability to operate tidal cranes safely in low light",
            "Guild Rank: Stonecutters' Guild Senior Hand or Adventurers' Guild Brass",
          ],
          conditions: [
            "Two back-to-back night shifts following a storm warning",
            "Quotas signed off by Harborworks engineer before dismissal",
          ],
          timeline: "Activated within 24 hours after major storms",
          risks: [
            "Overnight spray and low visibility increase crane hazards",
            "Improper numbering delays harbor repair, incurring guild fines",
          ],
          reward: "4 sp per shift plus Harborworks hazard pay",
          rewardNotes: "Supersedes regular export block work until rush orders conclude.",
          postingStyle: "Emergency Stone Order",
          issuer: "Harborworks Engineer Liaison",
          guildRankRequirement: "Stonecutters' Guild Senior Hand or Adventurers' Guild Brass",
          replacementFor: "Regular export block contracts",
        },
      ),
    ],
  },
  {
    name: "Coast Road Watchtower",
    category: "security",
    scale: {
      tier: 'strategic',
      label: "Gatewatch Outpost (Strategic)",
      rationale:
        "Signals caravans and fleets, coordinating guard patrols between Wave's Break and the East Road.",
      output: "Maintains round-the-clock watch rotations and signal readiness for road and sea.",
    },
    production: {
      goods: ["warning beacons", "dispatch reports"],
      notes:
        "Acts as early-warning hub; dispatch logs feed Gatewatch command and Adventurers' Guild escorts.",
    },
    workforce: {
      description: "Regular guard complement handles signal fire, lens polishing, and messenger relays.",
      normal: [
        skilled(8, "tower watchers, signal archers, lens keepers"),
        specialist(2, "captain-level coordinators and weather readers"),
      ],
    },
    laborConditions: [
      {
        trigger: "Spring fog cycle",
        season: "Late spring when fog banks roll from the sea",
        description:
          "Fog obscures the coast road; additional runners and veteran watchers ensure caravans depart safely.",
        staffing: [
          skilled(4, "extra watch sentries and torch bearers"),
          specialist(1, "weather-wise lieutenant to coordinate signals"),
        ],
      },
      {
        trigger: "Storm beacon alert",
        season: "Autumn storm season",
        description:
          "Beacon must stay lit through squalls while dispatch runners guide coastal villagers to shelter.",
        staffing: [
          skilled(3, "anchor guards for beacon platform"),
          specialist(1, "battle-mage or siege archer to deter raiders"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Beacon Runner Rotation",
        "The Gatewatch captain seeks vetted runners and watchers to hold the tower through the spring fog.",
        {
          location: "Coast Road Watchtower",
          requirements: [
            "Wave's Break Guard rank: Shieldbearer or Adventurers' Guild Bronze",
            "Perception or Scout training 30+ to read lantern codes in heavy fog",
            "Endurance to sprint messenger relays along the coast road",
          ],
          conditions: [
            "Six-night rotation, double pay for midnight relays",
            "Beacon drills every dusk; failure results in reprimand",
          ],
          timeline: "Late-spring fog cycle (six-night assignment)",
          risks: [
            "Fog conceals bandits probing the road",
            "Slippery tower steps during dew-heavy nights",
          ],
          reward: "2 sp per night plus Guard ration chits",
          postingStyle: "Gatewatch Duty Order",
          issuer: "Captain Helvar of the Gatewatch",
          guildRankRequirement: "Guard Shieldbearer or Adventurers' Guild Bronze",
          reputationRequirement: "Gatewatch Standing: Trusted",
        },
      ),
      createQuest(
        "Stormsignal Captaincy",
        "Autumn squalls demand a veteran watch-captain to keep the beacon lit and coordinate evacuations.",
        {
          location: "Coast Road Watchtower",
          requirements: [
            "Guard rank: Lieutenant or Adventurers' Guild Brass",
            "Martial weapon or Battle Magic proficiency 35+",
            "Leadership check by Gatewatch commander; preference for those with Weather Sense",
          ],
          conditions: [
            "Activated upon first red-flag storm warning; duration three nights",
            "Must remain on site; failure to hold beacon triggers court-martial",
          ],
          timeline: "Autumn storm season (as needed)",
          risks: [
            "Beacon tower buffeted by gale-force winds",
            "Potential raider sightings during low visibility",
          ],
          reward: "5 sp per night plus command commendation and hazard stipend",
          rewardNotes:
            "Supplants routine guard duty roster; only ranked members may accept to avoid subversion risks.",
          postingStyle: "Command Duty Writ",
          issuer: "Gatewatch Command Council",
          guildRankRequirement: "Guard Lieutenant or Adventurers' Guild Brass",
          reputationRequirement: "Gatewatch Standing: Esteemed",
        },
      ),
    ],
  },
  {
    name: "Copperbrook Forge",
    category: "craft",
    scale: {
      tier: 'township',
      label: "Agrarian Forge (Medium)",
      rationale:
        "Primary smithy for the Farmlands refitting plowgear and wagon fittings for Wave's Break and caravan lines.",
      output: "Refits forty plowshares and sixty shoe sets per tenday with capacity for emergency weapon work.",
    },
    production: {
      goods: ["plowshares", "sickle regrinds", "horseshoes", "wagon fittings"],
      notes:
        "Contracts cover farmsteads, Gatewatch patrols, and caravans heading along the East Road.",
    },
    workforce: {
      description:
        "Apprentices keep bellows and fuel moving while journeymen grind edges and the master balances alloy batches.",
      normal: [
        unskilled(4, "bellows hands, ore haulers, quench tub tenders"),
        skilled(3, "journeyman smiths setting shoes, regrinding harvest blades"),
        specialist(1, "master smith supervising heat and alloy quality"),
      ],
    },
    laborConditions: [
      {
        trigger: "Pre-sowing refit",
        season: "Late winter before planting",
        description:
          "Farmsteads flood the forge with dulled plowshares and harrow teeth that must be sharpened before sowing.",
        staffing: [
          unskilled(4, "bellows crews and quench tenders for continuous fires"),
          skilled(2, "journeymen to grind plowshares and reset rivets"),
          specialist(1, "fuel quartermaster rationing charcoal and ore"),
        ],
      },
      {
        trigger: "Harvest regrind nights",
        season: "Late summer and early autumn",
        description:
          "As harvest sickles dull nightly, the forge runs after dusk to re-edge tools and replace broken fittings.",
        staffing: [
          unskilled(3, "night haulers ferrying tools and water"),
          skilled(3, "edge grinders, riveters, shoe setters"),
          specialist(1, "master smith triaging urgent repairs"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Forge Bellows Compact",
        "Smith Barun seeks stout bellows hands and journeymen to refit the Farmlands' tools before sowing.",
        {
          location: "Copperbrook Forge",
          requirements: [
            "Strength to work bellows or carry ore for twelve-hour shifts",
            "Smithing or Blacksmithing proficiency 30+ for journeyman posts",
            "Constitution 12+ or heat warding gear to endure forge temperatures",
          ],
          conditions: [
            "Eight-day contract split into two 12-hour crews",
            "Forge lodging provided; curfew enforced to prevent fatigue mishaps",
          ],
          timeline: "Late winter refit cycle (eight-day contract)",
          risks: [
            "Cinder burns and smoke inhalation in crowded forges",
            "Falling asleep at the anvil risks serious injury",
          ],
          reward: "1 sp per day for bellows crews; 2 sp 5 cp for journeymen plus scrap share",
          rewardNotes:
            "Supersedes the routine sharpening roster with premium pay to draw extra smiths from city guilds.",
          postingStyle: "Guild Contract Posting",
          issuer: "Smith Barun Copperbrook",
          replacementFor: "Routine tool sharpening queue",
        },
      ),
      createQuest(
        "Nightfall Edge Vigil",
        "Harvest storms demand overnight crews to keep sickles and wagon fittings battle-ready.",
        {
          location: "Copperbrook Forge",
          requirements: [
            "Smithing proficiency 40+ or Battle Magic (Circle 1) to harden edges quickly",
            "Guild of Smiths Journeyman badge or Adventurers' Guild Brass (artisan track)",
            "Ability to coordinate with drovers for tool pickup each dawn",
          ],
          conditions: [
            "Activated when harvest backlog exceeds eighty tools per night",
            "Four-night rotation with mandatory third-night rest block",
          ],
          timeline: "Late summer harvest (on-call overnight shifts)",
          risks: [
            "Charcoal shortages during storms require rationing",
            "Sleep deprivation near open forges increases accident risk",
          ],
          reward: "3 sp per night plus harvest hazard stipend",
          rewardNotes: "Replaces standard after-hours repair work until the harvest backlog clears.",
          postingStyle: "Emergency Forge Writ",
          issuer: "Guild of Smiths Liaison",
          guildRankRequirement: "Guild of Smiths Journeyman or Adventurers' Guild Brass",
        },
      ),
    ],
  },
  {
    name: "Driftfell Meadow",
    category: "agriculture",
    scale: {
      tier: 'village',
      label: "Pastoral Meadowland (Medium)",
      rationale:
        "Feeds Wave's Break with lamb, wool, and pasture dairy while supplying luminous fiber to city weavers.",
      output: "Turns out three hundred head of sheep and forty dairy cattle annually with specialty night-glow fleece.",
    },
    production: {
      goods: ["spring lamb", "wool clip", "pasture cheese"],
      notes:
        "Luminous fleeces contract to Netmaker's Co-op and textile guilds; surplus lamb sold at Tideflock Stockyards.",
    },
    workforce: {
      description:
        "Shepherd youths mind day rotations while seasoned drovers manage lambing, shearing, and predator patrols.",
      normal: [
        unskilled(12, "shepherd tenders, muckers, fence walkers"),
        skilled(4, "drovers, shear masters, lambing midwives"),
        specialist(1, "herd steward tracking bloodlines and pasture shifts"),
      ],
    },
    laborConditions: [
      {
        trigger: "Lambing vigil",
        season: "Late winter through early spring",
        description:
          "Night watches ensure safe births and guard against marsh wolves drawn by blood scent.",
        staffing: [
          unskilled(10, "stall watchers, muck crews, lamp bearers"),
          skilled(3, "lambing midwives and drovers to turn ewes"),
          specialist(1, "herbalist or druid to tend complications"),
        ],
      },
      {
        trigger: "Spring shear",
        season: "Early spring once coats thicken",
        description:
          "Fleece must be clipped under luminous tides, requiring veteran shearers and careful bundling.",
        staffing: [
          unskilled(8, "fleece bundlers, pen cleaners, tarp crews"),
          skilled(4, "shearers and wool graders"),
          specialist(1, "wool factor to grade luminous fiber quality"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Meadow Drovers' Round",
        "Steward Elwin needs seasoned drovers and shear teams for the luminous spring clip.",
        {
          location: "Driftfell Meadow",
          requirements: [
            "Animal Handling (Sheep) proficiency 30+",
            "Textiles (Wool Handling) proficiency 20+ or Shearing Tools certification",
            "Willingness to bivouac in pasture under luminous tides",
          ],
          conditions: [
            "Seven-day rotation with night shearing under lamplight",
            "Daily fleece weigh-in and inspection at dawn",
          ],
          timeline: "Early spring shearing window (seven-day contract)",
          risks: [
            "Night chill and damp cause sickness if bedrolls are neglected",
            "Poor shearing technique lowers fleece grade and forfeits bonus",
          ],
          reward: "9 cp per day plus wool token redeemable at Netmaker's Co-op",
          rewardNotes:
            "Takes the place of the normal shearer roster with premium rates to secure expert crews.",
          postingStyle: "Pasture Levy Notice",
          issuer: "Steward Elwin Driftfell",
          replacementFor: "Routine shearing roster",
        },
      ),
      createQuest(
        "Nightfall Predator Watch",
        "Marsh wolves stalk the lambing pens—watch parties must deter them without spooking the flocks.",
        {
          location: "Driftfell Meadow",
          requirements: [
            "Adventurers' Guild Cold Iron rank or Gatewatch Scout stripe",
            "One of: Spear proficiency 25+, Bow proficiency 25+, or Nature Magic (Circle 1)",
            "Animal Handling (Hounds) 20+ for at least one party member",
          ],
          conditions: [
            "Two-night watch with relief bell at midnight",
            "Submit predator sign reports to Gatewatch liaison after each shift",
          ],
          timeline: "Activated during lambing season or upon confirmed predator sightings",
          risks: [
            "Wolf packs may circle through marsh fog",
            "Hidden bog holes near pasture edges",
          ],
          reward: "2 sp per night plus bounty for confirmed predator drives",
          postingStyle: "Predator Watch Writ",
          issuer: "Gatewatch Pasture Liaison",
          guildRankRequirement: "Adventurers' Guild Cold Iron or Gatewatch Scout",
          reputationRequirement: "Driftfell Stewardry: Trusted",
        },
      ),
    ],
  },
  {
    name: "East Road to Mountain Top",
    category: "logistics",
    scale: {
      tier: 'strategic',
      label: "King's Road Logistics Chain (Strategic)",
      rationale:
        "Main overland artery linking Wave's Break to Mountain Top, vital for grain, ore, and caravan security.",
      output: "Dispatches three to five escorted convoys per tenday and maintains road surface after storms.",
    },
    production: {
      goods: ["escort manifests", "road maintenance reports", "caravan toll records"],
      notes:
        "Supports city granary shipments and return caravans carrying ore, silk, and mountain goods.",
    },
    workforce: {
      description:
        "Teamsters load and drive wagons while outriders scout threats and surveyors monitor road conditions.",
      normal: [
        unskilled(14, "wagon loaders, rut fillers, camp tenders"),
        skilled(6, "teamsters, outriders, quartermasters"),
        specialist(2, "road surveyors and signal riders"),
      ],
    },
    laborConditions: [
      {
        trigger: "Dry-season caravan surge",
        season: "Late spring through early autumn",
        description:
          "Grain convoys depart weekly, requiring extra outriders and loaders to keep schedules tight.",
        staffing: [
          unskilled(10, "grain loaders, camp cooks, tarpers"),
          skilled(4, "outriders and formation sergeants"),
          specialist(1, "road warden to coordinate with watchtower"),
        ],
      },
      {
        trigger: "Post-storm road repair",
        season: "Immediately after heavy rains or rockfalls",
        description:
          "Ruts, washouts, and downed trees must be cleared before caravans can safely depart.",
        staffing: [
          unskilled(12, "ditch crews, gravel spreaders, sawyers"),
          skilled(3, "wheelwrights and bridge carpenters"),
          specialist(1, "surveyor to chart damage and update maps"),
        ],
      },
    ],
    quests: [
      createQuest(
        "East Road Caravan Writ",
        "Merchants' Exchange charters vetted escorts to see grain wagons safely to Mountain Top.",
        {
          location: "East Road to Mountain Top",
          requirements: [
            "Adventurers' Guild Bronze rank or Merchant Escort Corps Sergeant commission",
            "At least one member with Martial Weapon proficiency 30+ or Battle Magic (Circle 1)",
            "Animal Handling (Draft Beasts) 25+ for lead teamster",
            "Reputation: Merchants' Exchange Standing 'Trusted' or better",
          ],
          conditions: [
            "Escort four wagons over a three-day outbound journey with watchtower check-ins",
            "Night camps at Coast Watch outpost and mid-road shrine; final report filed on return",
          ],
          timeline: "Dry-season convoy cycle (weekly departures)",
          risks: [
            "Recent bandit sightings near the cliff pass",
            "Storm washouts may force detours into marshland",
          ],
          reward: "8 sp per guard plus 2% share of caravan toll receipts",
          rewardNotes:
            "Supplants the general escort board during convoy weeks to ensure vetted crews are prioritized.",
          postingStyle: "Escort Writ",
          issuer: "Factor Lysa of the Merchants' Exchange",
          guildRankRequirement: "Adventurers' Guild Bronze or Merchant Escort Corps Sergeant",
          reputationRequirement: "Merchants' Exchange: Trusted",
        },
      ),
      createQuest(
        "Road-Rut Repair Levy",
        "Road Warden Arel calls for labor crews to mend washouts and fell debris after the last squall.",
        {
          location: "East Road to Mountain Top",
          requirements: [
            "Strength to swing mattocks and haul gravel",
            "Masonry or Carpentry proficiency 25+ to set drainage boards",
            "Registration with the Wave's Break Laborers' Ledger",
          ],
          conditions: [
            "Two-day levy immediately after storm warnings, sunrise-to-sunset shifts",
            "Crews work under road warden supervision; fines for unsupervised departures",
          ],
          timeline: "Post-storm recovery (two-day levy)",
          risks: [
            "Mudslides along the cliff shelf",
            "Passing caravans reopen lanes while repairs underway",
          ],
          reward: "6 cp per day plus hearty camp stew and tarpaulin shelter",
          rewardNotes: "Replaces the standing road patch roster until repairs complete.",
          postingStyle: "Road Levy Notice",
          issuer: "Road Warden Arel",
          replacementFor: "Standard road patch roster",
        },
      ),
    ],
  },
  {
    name: "Foamfield Flax Farm",
    category: "agriculture",
    scale: {
      tier: 'village',
      label: "Coastal Flax Estate (Medium)",
      rationale:
        "Only flax fields along the coast feed the Netmaker's Co-op and Threadneedle Hall with linen fiber.",
      output: "Harvests ninety flax bales per season with staggered retting pools.",
    },
    production: {
      goods: ["flax stalks", "retted linen fiber", "flax seeds"],
      notes:
        "Fiber goes to Netmaker's Co-op and local sailmakers; seeds sold to Harborwind Dairy for feed mixes.",
    },
    workforce: {
      description:
        "Pullers work barefoot in sandy soil while retting masters tend ponds and combers grade fibers.",
      normal: [
        unskilled(14, "flax pullers, spreaders, weeders"),
        skilled(5, "retting masters, flaxdressers, combers"),
        specialist(1, "quality dresser selecting fiber lots for guild orders"),
      ],
    },
    laborConditions: [
      {
        trigger: "Blue-blossom pulling",
        season: "Early summer during dry, breezy weeks",
        description:
          "Stalks must be pulled and rippled in a four-day window before coastal rains flatten blooms.",
        staffing: [
          unskilled(12, "pullers, ripple-comb tenders, field spreaders"),
          skilled(3, "flaxdressers to lay and turn drying lines"),
        ],
      },
      {
        trigger: "Retting guard rotation",
        season: "After coastal rains or king tides",
        description:
          "Retted bundles require constant turning and watch against theft or rot while fermentation runs.",
        staffing: [
          unskilled(6, "pond turners, watchwalkers"),
          skilled(2, "retting masters monitoring pH and timing"),
          specialist(1, "textile assessor to judge fiber readiness"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Foamfield Pullers' Call",
        "Farmholder Deryn seeks nimble crews to pull flax before the sea breeze shifts and ruins the bloom.",
        {
          location: "Foamfield Flax Farm",
          requirements: [
            "Textiles (Linen) proficiency 20+ or Farming proficiency 20+",
            "Stamina for crouched work in sandy furrows",
            "Willingness to work barefoot to avoid crushing stalks",
          ],
          conditions: [
            "Four-day contract with sunrise starts and midday rest under awnings",
            "Evening bundling to move fiber under cover each night",
          ],
          timeline: "Early summer dry week (four-day levy)",
          risks: [
            "Blowing sand irritates eyes and lungs",
            "Sudden sea mists can mildew stalks if bundles are delayed",
          ],
          reward: "8 cp per day plus linen scrap credit redeemable at Netmaker's Co-op",
          rewardNotes: "Overrides the ordinary field-hand posting to attract skilled flaxdressers.",
          postingStyle: "Flax Harvest Levy",
          issuer: "Farmholder Deryn Foamfield",
          replacementFor: "Routine field-hand roster",
        },
      ),
      createQuest(
        "Sea Mist Retting Guard",
        "Rains have filled the retting ponds—experienced tenders must guard and turn the bundles through the night.",
        {
          location: "Foamfield Flax Farm",
          requirements: [
            "Textiles (Rett Mastery) proficiency 30+ or Wisdom 12+ with Alchemist's Supplies",
            "Comfort working night rotations beside open ponds",
            "Guild Rank: Textile Cooperative Journeyman or Adventurers' Guild Bronze",
          ],
          conditions: [
            "Three consecutive night watches turning bundles every two hours",
            "Must log fiber readiness and report any contamination to the guild factor",
          ],
          timeline: "Triggered after heavy rains or king tides",
          risks: [
            "Rot fumes cause sickness without mask discipline",
            "Thieves target premium fiber during night watches",
          ],
          reward: "2 sp per night plus bonus if fermentation stays within guild tolerances",
          rewardNotes: "Temporarily replaces weaving-room shifts so trained retting crews can respond.",
          postingStyle: "Retting Guard Writ",
          issuer: "Netmaker's Co-op Factor Selka",
          guildRankRequirement: "Textile Cooperative Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "Greenridge Polder",
    category: "agriculture",
    scale: {
      tier: 'township',
      label: "Levee Vegetable Polder (Large)",
      rationale:
        "Feeds the city with fresh greens while defending against tides; also supplies pickled stores to garrisons.",
      output: "Yields two market wagons of vegetables daily and maintains three kilometers of levee.",
    },
    production: {
      goods: ["leafy greens", "root vegetables", "herbs", "levee clay blocks"],
      notes:
        "Vegetables supply the Greens Market; levee clay ships to Harborworks for patching coastal defenses.",
    },
    workforce: {
      description:
        "Weeders, ditch diggers, and levee crews keep water flowing while dike-masters monitor tides.",
      normal: [
        unskilled(18, "weeders, pickers, ditch crews"),
        skilled(6, "dike-keepers, sluice carpenters, levee masons"),
        specialist(2, "tide marshals and surveyors tracking water tables"),
      ],
    },
    laborConditions: [
      {
        trigger: "Moon tide reinforcement",
        season: "New and full moon high tides",
        description:
          "Sandbagging and clay patches fortify levees before spring tides threaten breaches.",
        staffing: [
          unskilled(12, "sandbag crews, torch-bearing night watch"),
          skilled(4, "levee carpenters and clay patchers"),
          specialist(1, "tide marshal reading charts and directing relief sluices"),
        ],
      },
      {
        trigger: "Spring flood watch",
        season: "Spring thaw and heavy rainfalls",
        description:
          "Floodgates and drains require round-the-clock monitoring to prevent fields from drowning.",
        staffing: [
          unskilled(10, "ditch clearers and pump crews"),
          skilled(3, "sluice masters and carpenters"),
          specialist(1, "engineer to gauge water levels and adjust gates"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Dike Wardens' Levy",
        "Reeve Galen summons levee crews to brace the polder against the coming moon tide.",
        {
          location: "Greenridge Polder",
          requirements: [
            "Masonry or Carpentry proficiency 30+ for levee patching",
            "Strength to haul sandbags along the dike",
            "Guild Rank: Polder Wardens' Guild Senior Hand or Guard Engineer Corps",
          ],
          conditions: [
            "Five-night rotation covering high tide hours",
            "Midnight sluice inspections logged with tide marshal",
          ],
          timeline: "High tide week (five-night levy)",
          risks: [
            "Unexpected surges overtop levees during storms",
            "Night labor in mud increases slip and drowning hazards",
          ],
          reward: "1 sp 2 cp per night plus ration scrip redeemable at Tidehold Granary",
          rewardNotes: "Replaces the standard levee maintenance roster during the moon tide.",
          postingStyle: "Levee Levy Writ",
          issuer: "Reeve Galen Tidebinder",
          guildRankRequirement: "Polder Wardens' Senior Hand or Guard Engineer",
        },
      ),
      createQuest(
        "Floodgate Sentinel Call",
        "Spring rains swell the ditches—sentinels must keep gates clear and sound alarms for breaches.",
        {
          location: "Greenridge Polder",
          requirements: [
            "Adventurers' Guild Bronze rank or Gatewatch River Patrol badge",
            "One of: Spear proficiency 25+, Shield proficiency 25+, or Water Ward Magic (Circle 1)",
            "Ability to operate hand pumps and signal horns",
          ],
          conditions: [
            "Three-night watch with alternating pump and patrol duties",
            "Immediate reporting of breaches to the Gatewatch via messenger runner",
          ],
          timeline: "Spring flood season (as needed)",
          risks: [
            "Sudden levee slips can drag watchers into the canal",
            "Sabotage attempts by smugglers seeking covert routes",
          ],
          reward: "2 sp per night plus hazard bonus for breach responses",
          rewardNotes: "Overrides the standard night watch roster when flood warnings post.",
          postingStyle: "Flood Sentinel Posting",
          issuer: "Greenridge Polder Council",
          guildRankRequirement: "Adventurers' Guild Bronze or Gatewatch River Patrol",
          reputationRequirement: "Greenridge Council: Trusted",
        },
      ),
    ],
  },
  {
    name: "Gulls' Orchard",
    category: "agriculture",
    scale: {
      tier: 'village',
      label: "Coastal Orchard (Medium)",
      rationale:
        "Produces sea-sweetened apples and pears feeding city markets and vintners.",
      output: "Harvests one hundred twenty orchard crates per season with staggered ripening.",
    },
    production: {
      goods: ["apples", "pears", "orchard preserves"],
      notes:
        "Fruit supplies the Quayside Greens Market and Sunmellow Grove; bruised fruit fermented into cider.",
    },
    workforce: {
      description:
        "Pickers climb trees while wardens manage grafting, pruning, and bird deterrents.",
      normal: [
        unskilled(20, "fruit pickers, crate haulers, bird scarers"),
        skilled(5, "orchardists, grafters, pest wardens"),
        specialist(1, "graftmaster selecting new stock"),
      ],
    },
    laborConditions: [
      {
        trigger: "Ripening harvest sweep",
        season: "Late summer to early autumn",
        description:
          "Fruit ripens quickly in sea mists, requiring swift picking and careful sorting.",
        staffing: [
          unskilled(16, "pickers, ladder holders, crate runners"),
          skilled(3, "graft wardens to inspect branches"),
        ],
      },
      {
        trigger: "Storm pest patrol",
        season: "After coastal storms",
        description:
          "High winds invite pests and rot; wardens need teams to cull blight and reset scare-lines.",
        staffing: [
          unskilled(8, "scarehand teams with slings"),
          skilled(3, "orchardists applying pest wards"),
          specialist(1, "herbalist brewing antifungal washes"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Orchard Scarehand Notice",
        "Orchard mistress Riala hires sling-armed youths and wardens to gather fruit before gulls strip the boughs.",
        {
          location: "Gulls' Orchard",
          requirements: [
            "Climbing proficiency 20+ with soft-soled boots",
            "Sling or Shortbow proficiency 20+ to drive off gulls humanely",
            "Careful handling to avoid bruising; Dexterity 11+ recommended",
          ],
          conditions: [
            "Five-day harvest push from dawn mist until midday bell",
            "Evening pest sweep to collect fallen fruit before rot sets in",
          ],
          timeline: "Peak ripening (five-day harvest levy)",
          risks: [
            "Slick branches coated in sea mist",
            "Aggressive gull flocks dive toward bright cloth",
          ],
          reward: "7 cp per day plus cider ration",
          rewardNotes:
            "Posting replaces the standing orchard day-labor call with higher pay for skilled pickers.",
          postingStyle: "Harvest Levy Posting",
          issuer: "Orchard Mistress Riala Seafeather",
          replacementFor: "Standard orchard labor roster",
        },
      ),
      createQuest(
        "Storm-Brushed Graft Patrol",
        "Post-storm winds leave branches torn and pests prowling—wardens need skilled crews to salvage the crop.",
        {
          location: "Gulls' Orchard",
          requirements: [
            "Nature or Herbalism proficiency 25+ to spot blight",
            "Animal Handling (Birds) 15+ or Magic (Circle 1) to reset scare wards",
            "Guild Rank: Orchardists' Guild Journeyman or Adventurers' Guild Bronze",
          ],
          conditions: [
            "Activated within twelve hours of a storm warning",
            "Night patrol to reset warding bells and inspect grafts",
          ],
          timeline: "As needed after storms",
          risks: [
            "Fungal rot spreads fast in lingering mist",
            "Wind-shaken branches may break under climbers",
          ],
          reward: "2 sp per patrol plus bonus for grafts saved",
          rewardNotes: "Temporarily replaces pruning rotations so crews focus on recovery.",
          postingStyle: "Emergency Orchard Writ",
          issuer: "Gulls' Orchard Ward Council",
          guildRankRequirement: "Orchardists' Guild Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "Gullwind Mill",
    category: "processing",
    scale: {
      tier: 'township',
      label: "Windmill Complex (Large)",
      rationale:
        "Grinds grain for the city and exports flour to Tidehold Granary and outbound caravans.",
      output: "Turns out one hundred twenty sacks of flour per tenday under steady winds.",
    },
    production: {
      goods: ["flour", "bran", "milled feed"],
      notes:
        "Mills grain from Seabreeze Farm, Brackenshore Croft, and caravan consignments before shipping to the city.",
    },
    workforce: {
      description:
        "Carriers feed the stones while millers adjust sail cloth and balance gears against sea gusts.",
      normal: [
        unskilled(10, "sack haulers, grain scoopers, gear greasers"),
        skilled(4, "miller journeymen timing the stones and sails"),
        specialist(1, "master miller overseeing grain grades"),
      ],
    },
    laborConditions: [
      {
        trigger: "Harvest rush",
        season: "Late summer through harvest",
        description:
          "Grain wagons queue nonstop, requiring extra carriers and millwrights to prevent bottlenecks.",
        staffing: [
          unskilled(12, "sack loaders, chute sweepers"),
          skilled(3, "millwrights to adjust sails and stones"),
        ],
      },
      {
        trigger: "Storm-lull backlog",
        season: "After multi-day calms",
        description:
          "When wind returns after a calm, mills must run double pace to catch up before grain spoils.",
        staffing: [
          unskilled(6, "night carriers moving dried grain"),
          skilled(2, "gearwrights checking for stress cracks"),
          specialist(1, "engineer to monitor tidal wheel tie-in"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Millstone Rotation Contract",
        "Miller Joran calls for back-strong carriers and a master to keep the sails turning through the harvest rush.",
        {
          location: "Gullwind Mill",
          requirements: [
            "Strength to hoist forty-stone sacks repeatedly",
            "Miller's Tools proficiency 25+ for sail tenders",
            "Knowledge of grain grading to prevent spoilage",
          ],
          conditions: [
            "Seven-day harvest contract with rotating night shifts",
            "Mandatory gear inspection every third day",
          ],
          timeline: "Harvest rush (seven-day contract)",
          risks: [
            "Gear teeth shear under constant load if not greased",
            "Sail cloth snaps can fling spars during gusts",
          ],
          reward: "1 sp per day for carriers; 2 sp for millwrights plus grain ration",
          rewardNotes: "Overrides the base milling roster with hazard pay to clear backlog.",
          postingStyle: "Mill Levy Posting",
          issuer: "Master Miller Joran Gullwind",
          replacementFor: "Routine milling shifts",
        },
      ),
      createQuest(
        "Windlash Emergency Grind",
        "After three calm days, wind is back—overnight crews must clear the grain backlog before it sours.",
        {
          location: "Gullwind Mill",
          requirements: [
            "Miller's Tools proficiency 35+ or Intelligence 12+ for gear timing",
            "Ability to work midnight-to-dawn under lantern light",
            "Guild Rank: Miller's Guild Journeyman or Adventurers' Guild Bronze",
          ],
          conditions: [
            "Three consecutive night shifts tied to returning winds",
            "Coordinate with Tidewheel Watermill to split loads",
          ],
          timeline: "Immediately after prolonged calms (three-night blitz)",
          risks: [
            "Exhaustion causes misaligned stones and fires",
            "High winds can over-speed sails if not feathered",
          ],
          reward: "3 sp per night plus spoilage bonus",
          rewardNotes: "Temporarily replaces the normal night watch; failure fines the crew.",
          postingStyle: "Emergency Grind Writ",
          issuer: "Millers' Guild Recorder",
          guildRankRequirement: "Miller's Guild Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "Harborwind Dairy",
    category: "agriculture",
    scale: {
      tier: 'village',
      label: "Salty-Grass Dairy (Medium)",
      rationale:
        "Supplies Wave's Break with fresh milk, butter, and soft cheeses while exporting salted wheels inland.",
      output: "Milks sixty head twice daily and turns out thirty wheels of salt-washed cheese per tenday.",
    },
    production: {
      goods: ["fresh milk", "butter", "salt-washed cheese", "cultured cream"],
      notes:
        "Fresh product sold in city markets; aged cheeses shipped to Sunmellow Grove vintners and caravanserai.",
    },
    workforce: {
      description:
        "Unskilled milkers and stablehands work dawn shifts while skilled dairymaids churn, culture, and cure cheeses.",
      normal: [
        unskilled(14, "milkers, stable muckers, fodder haulers"),
        skilled(6, "dairymaids, cheese curers, churn tenders"),
        specialist(1, "cheesemaker overseeing brine cellars"),
      ],
    },
    laborConditions: [
      {
        trigger: "Spring calving",
        season: "Early spring",
        description:
          "New calves and heavy milk flows require extra hands and watchers through cold dawns.",
        staffing: [
          unskilled(10, "night milkers, calf feeders"),
          skilled(3, "midwives, curd masters balancing batches"),
        ],
      },
      {
        trigger: "Salt fog cellar watch",
        season: "Autumn fog season",
        description:
          "Cheese cellars need vigilant ventilation to prevent mold while salt fog seeps inland.",
        staffing: [
          unskilled(6, "cellar sweepers, salt scrub crews"),
          skilled(3, "cheese curers testing brine levels"),
          specialist(1, "alchemist or healer to monitor air quality"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Dairy Dawn Accord",
        "Matron Helda offers wages to early-rising milkers and a cheesemaker to keep churns clattering through calving.",
        {
          location: "Harborwind Dairy",
          requirements: [
            "Animal Handling (Cattle) proficiency 30+",
            "Cooking or Cheesemaking proficiency 25+ for curd tenders",
            "Ability to withstand cold dawn winds; winter gear provided",
          ],
          conditions: [
            "Ten-day rotation with 3 a.m. muster",
            "Cud-chew monitoring logs submitted nightly",
          ],
          timeline: "Spring calving (ten-day contract)",
          risks: [
            "Frostbite risk before sunrise",
            "Stamping cows can injure inattentive milkers",
          ],
          reward: "1 sp per day plus butter ration; cheesemakers earn 2 sp",
          rewardNotes: "Replaces the base milking rota to secure extra skilled hands during calving.",
          postingStyle: "Dairy Muster Notice",
          issuer: "Matron Helda Harborwind",
          replacementFor: "Standard milking rota",
        },
      ),
      createQuest(
        "Saltfog Cellar Vigil",
        "Thick fog threatens the curing caves—trusted crews must guard the cheeses from spoilage and thieves.",
        {
          location: "Harborwind Dairy",
          requirements: [
            "Cheesemaking proficiency 30+ or Herbalism 25+ for mold control",
            "Guild Rank: Dairy Guild Journeyman or Adventurers' Guild Bronze",
            "One member with Perception 25+ to spot cellar intruders",
          ],
          conditions: [
            "Four-night watch with hourly ventilation cycles",
            "Record brine temperatures and report anomalies at dawn",
          ],
          timeline: "Autumn fog season (four-night guard)",
          risks: [
            "Salt fog irritates lungs; respirators provided",
            "Smugglers target aged wheels stored in brine",
          ],
          reward: "2 sp per night plus aged cheese wedge",
          rewardNotes: "Overrides routine cellar rotation until fog season ends.",
          postingStyle: "Cellar Guard Writ",
          issuer: "Harborwind Dairy Council",
          guildRankRequirement: "Dairy Guild Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "Mistflower Apiary",
    category: "agriculture",
    scale: {
      tier: 'hamlet',
      label: "Meadow Apiary (Specialty)",
      rationale:
        "Produces mist-kissed honey for Greensoul alchemists and temple offerings.",
      output: "Maintains eighty hives yielding fifty casks of honey per season.",
    },
    production: {
      goods: ["honey", "wax", "pollen tinctures"],
      notes:
        "Honey reserved for temple and apothecary contracts; wax sent to Candlewrights' Guild.",
    },
    workforce: {
      description:
        "Assistants tend smokers and filters while apiarists manage hives amid dew-laden mornings.",
      normal: [
        unskilled(10, "smoker tenders, strainers, cask rollers"),
        skilled(5, "apiarists managing hives and splits"),
        specialist(1, "queen breeder tracking lineage"),
      ],
    },
    laborConditions: [
      {
        trigger: "Mistflower bloom harvest",
        season: "Early morning during spring blooms",
        description:
          "Honey must be pulled at dawn before sun burns off the mist that gives it flavor.",
        staffing: [
          unskilled(8, "smoker carriers, cask haulers"),
          skilled(3, "apiarists lifting combs"),
        ],
      },
      {
        trigger: "Swarm prevention patrol",
        season: "High summer nectar flow",
        description:
          "Warm nights cause swarms; teams split colonies and capture stray queens.",
        staffing: [
          unskilled(6, "frame runners, box carriers"),
          skilled(3, "apiarists managing splits"),
          specialist(1, "seer or druid to calm agitated bees"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Mistbee Stewards' Call",
        "Keeper Lileth seeks gentle-handed apprentices and a master beekeeper to harvest honey without riling the hives.",
        {
          location: "Mistflower Apiary",
          requirements: [
            "Animal Handling (Bees) proficiency 25+",
            "Herbalism 20+ to mix calming smoke",
            "Veil discipline; Wisdom 11+ recommended",
          ],
          conditions: [
            "Five dawn shifts ending by third bell",
            "Honey filtered on site; cleanliness inspections each morning",
          ],
          timeline: "Spring bloom (five-morning contract)",
          risks: [
            "Bees agitate if smoke mishandled",
            "Damp grass hides footing hazards",
          ],
          reward: "8 cp per morning plus wax allotment",
          postingStyle: "Apiary Harvest Notice",
          issuer: "Keeper Lileth Mistflower",
          replacementFor: "Routine honey pull roster",
        },
      ),
      createQuest(
        "Swarm-Split Muster",
        "Summer heat swells the hives—experienced crews must split colonies before they swarm across the fields.",
        {
          location: "Mistflower Apiary",
          requirements: [
            "Animal Handling (Bees) 35+ or Nature Magic (Circle 1)",
            "Apiarists' Guild Journeyman badge or Adventurers' Guild Bronze",
            "Ability to climb ladder stands safely in humid conditions",
          ],
          conditions: [
            "Two-week rotation with checks every other evening",
            "All swarms reported to Gatewatch to update maps",
          ],
          timeline: "High summer nectar flow (two-week rotation)",
          risks: [
            "Multiple swarms may overwhelm crews",
            "Night predators drawn by honey scent",
          ],
          reward: "2 sp per evening plus honeycomb bonus per successful split",
          postingStyle: "Swarm Control Writ",
          issuer: "Apiarists' Guild Dispatch",
          guildRankRequirement: "Apiarists' Guild Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "Moorlight Flats",
    category: "agriculture",
    scale: {
      tier: 'hamlet',
      label: "Shoreline Fiber Pasture (Specialty)",
      rationale:
        "Raises phosphorescent goats and wool-fowl whose fibers supply luxury textiles.",
      output: "Clips seventy glowing fleece bundles per season and maintains a two-hundred-head herd.",
    },
    production: {
      goods: ["phosphor goat fiber", "glow-feather down", "goat milk"],
      notes:
        "Glow fiber sold to Threadneedle Hall; surplus goats traded through Tideflock Stockyards.",
    },
    workforce: {
      description:
        "Night shepherds rotate with fiber collectors who clip glowing coats under moonlight.",
      normal: [
        unskilled(10, "herd watchers, pen cleaners, feed haulers"),
        skilled(4, "fiber collectors, goat midwives"),
        specialist(1, "spinner overseeing glowfiber curing"),
      ],
    },
    laborConditions: [
      {
        trigger: "Glowclip harvest",
        season: "During luminous tides and full moons",
        description:
          "Fleece glows brightest during specific tides, requiring night crews to shear quickly.",
        staffing: [
          unskilled(8, "pen handlers, fleece bundlers"),
          skilled(3, "shearers trained in glowfiber handling"),
          specialist(1, "spinner to set fiber in brine vats"),
        ],
      },
      {
        trigger: "Predator ward patrol",
        season: "Autumn when marsh cats prowl",
        description:
          "Glow attracts predators; night patrols keep herds calm and safe.",
        staffing: [
          unskilled(6, "torch bearers, alarm runners"),
          skilled(2, "goatherds skilled with slings or staffs"),
          specialist(1, "warden adept with light wards"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Phosphor Herding Scrip",
        "Herdmaster Vel calls for night watchmen and a spinner to guard and clip the glowing flocks.",
        {
          location: "Moorlight Flats",
          requirements: [
            "Animal Handling (Goats) proficiency 28+",
            "Textiles (Glowfiber) proficiency 25+ for the spinner role",
            "Comfort working overnight in tidal flats; waders provided",
          ],
          conditions: [
            "Four-night contract aligned with luminous tides",
            "Shearing begins two hours after moonrise and ends before dawn",
          ],
          timeline: "Luminous tide window (four-night contract)",
          risks: [
            "Incoming tides can trap crews on shoals",
            "Glowfiber bruises easily, lowering value",
          ],
          reward: "2 sp per night plus glowfiber credit",
          postingStyle: "Glowclip Levy",
          issuer: "Herdmaster Vel Moorlight",
          replacementFor: "Routine pasture rotation",
        },
      ),
      createQuest(
        "Moorlight Ward Patrol",
        "Reports of marsh cats demand rotating patrols to keep the glowing herds safe.",
        {
          location: "Moorlight Flats",
          requirements: [
            "Adventurers' Guild Cold Iron rank or Guard Scout stripe",
            "One of: Staff proficiency 25+, Sling proficiency 25+, or Light Magic (Circle 1)",
            "Animal Handling (Goats) 20+ to calm startled herds",
          ],
          conditions: [
            "Three-night patrol with bell checks every hour",
            "Coordinate with Tidewatcher Lighthouse for warning signals",
          ],
          timeline: "Autumn predator season (three-night patrol)",
          risks: [
            "Predators blend with marsh shadows",
            "High tides may cut off retreat paths",
          ],
          reward: "2 sp per night plus bounty for confirmed predator drives",
          postingStyle: "Pasture Guard Posting",
          issuer: "Moorlight Herd Council",
          guildRankRequirement: "Adventurers' Guild Cold Iron or Guard Scout",
        },
      ),
    ],
  },
  {
    name: "Netmaker's Co-op",
    category: "craft",
    scale: {
      tier: 'township',
      label: "Weaving Hall (Large)",
      rationale:
        "Supplies Wave's Break fleet with nets and rope, fulfilling standing orders from the harbor.",
      output: "Turns out fifty ship nets and two hundred line coils per tenday during peak season.",
    },
    production: {
      goods: ["fishing nets", "hemp rope", "twine"],
      notes:
        "Net patterns tailored for Wave's Break fleets; exports specialty nets to Coral Keep.",
    },
    workforce: {
      description:
        "Twine combers prep flax while journeymen weave nets on massive frames under guild oversight.",
      normal: [
        unskilled(12, "twine combers, spool tenders, frame lacing crews"),
        skilled(8, "net weavers, knot masters, pattern scribes"),
        specialist(2, "quality inspectors and foremen"),
      ],
    },
    laborConditions: [
      {
        trigger: "Pre-season fleet outfitting",
        season: "Late winter to early spring",
        description:
          "Fleet captains submit orders before sailing season; co-op hires extra hands to meet quotas.",
        staffing: [
          unskilled(10, "fiber combers, frame stretchers"),
          skilled(6, "net weavers for deepwater patterns"),
          specialist(1, "guild inspector signing acceptance marks"),
        ],
      },
      {
        trigger: "Storm damage replacement",
        season: "Whenever storms shred fleet nets",
        description:
          "Lost nets must be replaced within days; crews work nights to reweave torn sets.",
        staffing: [
          unskilled(6, "twine runners, drying line keepers"),
          skilled(6, "repair weavers handling complex patterns"),
          specialist(1, "supply sergeant tracking deliveries"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Netwinder Guild Notice",
        "The co-op offers coin to twine-spinners and a master ropemaker to replace torn nets within seven days.",
        {
          location: "Netmaker's Co-op",
          requirements: [
            "Textiles (Net Weaving) proficiency 30+ for frame leads",
            "Dexterity 12+ for rapid knotwork",
            "Guild Rank: Textile Cooperative Journeyman or Apprenticeship papers",
          ],
          conditions: [
            "Seven-day contract with double shifts permitted",
            "Daily inspection by Harborworks quartermaster",
          ],
          timeline: "Late winter fleet outfitting (seven-day contract)",
          risks: [
            "Rope burns from heavy hemp lines",
            "Guild fines for miscounted mesh widths",
          ],
          reward: "1 sp per day for spinners; 3 sp per completed deepwater net",
          rewardNotes: "Replaces the standard weaving queue to meet fleet deadlines.",
          postingStyle: "Guild Muster Notice",
          issuer: "Netmaker's Co-op Council",
          guildRankRequirement: "Textile Cooperative Journeyman",
        },
      ),
      createQuest(
        "Storm-Rent Net Rush",
        "After the gale, half the fleet returned with shredded nets—night crews must reweave replacements immediately.",
        {
          location: "Netmaker's Co-op",
          requirements: [
            "Textiles (Net Repair) proficiency 35+",
            "Ability to work overnight on elevated frames",
            "Adventurers' Guild Bronze rank or Harbor Guard warrant for security clearance",
          ],
          conditions: [
            "Three-night emergency rotation; minimum of two nets per crew per night",
            "Harbor Guard escorts the completed nets at dawn",
          ],
          timeline: "Triggered within 24 hours after major storms",
          risks: [
            "Fatigue leads to pattern errors that waste materials",
            "Taut frames can snap back if knots slip",
          ],
          reward: "4 sp per night plus bonus per rush order met",
          rewardNotes: "Suspends normal co-op apprenticeships until fleet orders satisfied.",
          postingStyle: "Emergency Weaving Writ",
          issuer: "Harborworks Supply Office",
          guildRankRequirement: "Textile Cooperative Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "North Gate",
    category: "security",
    scale: {
      tier: 'strategic',
      label: "City Gatehouse (Strategic)",
      rationale:
        "Primary overland gate controlling Farmlands traffic and caravan flow.",
      output: "Maintains round-the-clock guard rotations, inspections, and portcullis readiness.",
    },
    production: {
      goods: ["inspection logs", "toll tallies", "gate maintenance"],
      notes:
        "Serves as checkpoint for incoming goods and muster point for field patrols.",
    },
    workforce: {
      description:
        "Porters operate winches while guards inspect wagons and manage tolls.",
      normal: [
        unskilled(8, "gate grinders, winch crews, torch bearers"),
        skilled(10, "guards, inspectors, toll scribes"),
        specialist(2, "portcullis engineers and gate lieutenants"),
      ],
    },
    laborConditions: [
      {
        trigger: "Caravan week",
        season: "During major trade departures",
        description:
          "Traffic spikes require additional guards and ledger clerks to process caravans.",
        staffing: [
          unskilled(6, "winch crews for extended hours"),
          skilled(6, "inspectors and toll scribes"),
          specialist(1, "lieutenant to coordinate muster yard"),
        ],
      },
      {
        trigger: "Alert status",
        season: "Whenever bandit or war threats rise",
        description:
          "Gate shifts move to high alert; veteran guards man murder holes and archery slits.",
        staffing: [
          skilled(6, "archers, shield guards"),
          specialist(1, "siege engineer supervising portcullis drills"),
        ],
      },
    ],
    quests: [
      createQuest(
        "North Gate Roster",
        "Captain Brisa spreads a grease-striped roster atop the North Gate winch dais, seeking grinders to oil the counterweight chains and a veteran to pace the torch-lit portcullis drums through caravan week.",
        {
          location: "North Gate winch dais and toll ledgers",
          requirements: [
            "Wave's Break Guard rank: Gatehand or Adventurers' Guild Bronze",
            "Strength to work portcullis winches for extended periods",
            "Ledger literacy for toll recording",
          ],
          conditions: [
            "Eight-day roster covering caravan departures at dawn and dusk",
            "Random spot checks by Gatewatch auditors",
          ],
          timeline: "Caravan week (eight-day roster)",
          risks: [
            "Crushed fingers in winch gears",
            "Smugglers attempt bribes during rush",
          ],
          reward: "2 sp per day plus Gatewatch commendation mark",
          rewardNotes: "Supersedes regular guard rotations to ensure trusted crews on duty.",
          postingStyle: "Gate Muster Order",
          issuer: "Captain Brisa Gatewatch",
          guildRankRequirement: "Wave's Break Guard Gatehand or Adventurers' Guild Bronze",
          reputationRequirement: "Gatewatch Standing: Reliable",
        },
      ),
      createQuest(
        "Portcullis Siege Drill",
        "Raid whispers send gongs ringing along the parapet—the winch towers need archers at the murder holes, engineers tending tar cauldrons, and shield guards bracing the gatehouse doors for a midnight siege drill.",
        {
          location: "North Gate battlements and murder-hole galleries",
          requirements: [
            "Guard rank: Sergeant or Adventurers' Guild Brass",
            "Martial Weapon proficiency 35+ with polearm or crossbow",
            "Attendance at siege lecture prior to drill",
          ],
          conditions: [
            "One-night drill including live-fire exercise",
            "Portcullis raise/drop timed under engineer supervision",
          ],
          timeline: "Whenever Gatewatch issues an alert status",
          risks: [
            "Portcullis drops can sever ropes if mishandled",
            "Live bolts create real injury risk",
          ],
          reward: "5 sp for drill completion plus hazard bonus",
          rewardNotes: "Replaces regular patrol duties during the alert window.",
          postingStyle: "Siege Drill Writ",
          issuer: "Gatewatch Command",
          guildRankRequirement: "Guard Sergeant or Adventurers' Guild Brass",
          reputationRequirement: "Gatewatch Standing: Esteemed",
        },
      ),
    ],
  },
  {
    name: "Saltcrest Vineyard & Winery",
    category: "agriculture",
    scale: {
      tier: 'township',
      label: "Sea-Mist Vineyard (Large)",
      rationale:
        "Produces signature coastal wine exported across the kingdom and supplies noble cellars.",
      output: "Harvests ninety acres of vines and presses two hundred barrels per season.",
    },
    production: {
      goods: ["grapes", "white wine", "grape must", "pomace"],
      notes:
        "Wines aged for Greensoul salons and exported via Harborwatch; pomace used in Harborwind Dairy feed.",
    },
    workforce: {
      description:
        "Pickers gather sea-misted grapes while vintners manage pressing, fermentation, and cellar aging.",
      normal: [
        unskilled(18, "pickers, cask rollers, trellis crews"),
        skilled(8, "vintners, cellar keepers, coopers"),
        specialist(2, "master vintner and cellar alchemist"),
      ],
    },
    laborConditions: [
      {
        trigger: "Harvest tide",
        season: "Late summer during morning mists",
        description:
          "Grapes must be cut quickly before fog lifts; pressing crews run all day.",
        staffing: [
          unskilled(16, "pickers, crate haulers, stomp crews"),
          skilled(6, "press operators, ferment monitors"),
        ],
      },
      {
        trigger: "Fogguard cellar watch",
        season: "Autumn fog spells",
        description:
          "Cellars risk mildew; trusted staff needed to monitor barrels and ventilation.",
        staffing: [
          unskilled(6, "vent tenders, torch bearers"),
          skilled(4, "cellarmen testing gravity and acidity"),
          specialist(1, "vintner to adjust blends"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Saltcrest Crushing Rite",
        "Vintner Aelric seeks harvest hands and a cellarer to press grapes before the coastal fog sets in.",
        {
          location: "Saltcrest Vineyard & Winery",
          requirements: [
            "Farming or Viticulture proficiency 25+",
            "Strength to haul full harvest crates",
            "Cellarer role requires Brewer's or Vintner's Tools proficiency 30+",
          ],
          conditions: [
            "Six-day harvest contract beginning before dawn",
            "Night ferment checks every four hours",
          ],
          timeline: "Harvest tide (six-day levy)",
          risks: [
            "Fog-slick planks cause slips around press",
            "Ferment vats overflow if left unchecked",
          ],
          reward: "1 sp per day plus cask share for cellarer",
          rewardNotes: "Replaces the routine harvest crew roster with premium pay.",
          postingStyle: "Vintner's Harvest Posting",
          issuer: "Master Vintner Aelric Saltcrest",
          replacementFor: "Standard harvest roster",
        },
      ),
      createQuest(
        "Fogguard Cellar Watch",
        "Persistent fog threatens the barrels—trusted guild members must guard against mildew and theft.",
        {
          location: "Saltcrest Vineyard & Winery",
          requirements: [
            "Vintner's Tools proficiency 30+ or Alchemy 25+",
            "Guild Rank: Vintners' Guild Journeyman or Adventurers' Guild Bronze",
            "Perception 22+ to notice barrel seepage",
          ],
          conditions: [
            "Three-night watch rotating between cellars",
            "Daily reports to the Guild of Vintners",
          ],
          timeline: "Autumn fog spells (three-night watch)",
          risks: [
            "Spoiled barrels cost the guild dearly",
            "Smugglers target high-value vintages",
          ],
          reward: "2 sp per night plus bottle of reserve wine",
          postingStyle: "Cellar Watch Writ",
          issuer: "Vintners' Guild Prefect",
          guildRankRequirement: "Vintners' Guild Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "Saltmarsh Granary",
    category: "processing",
    scale: {
      tier: 'township',
      label: "Raised Granary (Large)",
      rationale:
        "Stores grain from Farmlands and caravans, feeding Wave's Break and provisioning fleets.",
      output: "Holds fifteen thousand bushels and cycles shipments daily.",
    },
    production: {
      goods: ["stored grain", "ledger tallies", "grain loans"],
      notes:
        "Granary maintains emergency reserves and manages grain loans to Harbor Hearth Bakery and the army.",
    },
    workforce: {
      description:
        "Stackers haul sacks up stilts while stewards track moisture, pests, and inventory.",
      normal: [
        unskilled(14, "sack stackers, lift crews, sweepers"),
        skilled(6, "granary stewards, ledger clerks"),
        specialist(2, "moisture wardens and fumigators"),
      ],
    },
    laborConditions: [
      {
        trigger: "Harvest intake",
        season: "Late summer and autumn",
        description:
          "Wagons queue to unload; extra crews needed to stack and record grain quickly.",
        staffing: [
          unskilled(12, "sack haulers, hoist operators"),
          skilled(4, "ledger clerks, moisture testers"),
        ],
      },
      {
        trigger: "High tide watch",
        season: "When storm tides threaten",
        description:
          "Raised stilts must be braced and sandbagged; night watches guard against flood seepage.",
        staffing: [
          unskilled(8, "sandbag crews, torch patrols"),
          skilled(3, "stewards monitoring seepage"),
          specialist(1, "warder applying anti-mold sigils"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Granary Stack Oath",
        "Granary keeper Torv hires ladder-climbing bearers and a grain warden to guard stores against creeping tides.",
        {
          location: "Saltmarsh Granary",
          requirements: [
            "Strength to carry grain sacks up narrow ladders",
            "Ledger literacy for intake clerks",
            "Moisture Warden requires Alchemy or Herbalism 25+",
          ],
          conditions: [
            "Ten-day harvest rotation with dusk inventory checks",
            "No fires permitted; compliance inspected daily",
          ],
          timeline: "Harvest intake (ten-day rotation)",
          risks: [
            "Falls from loft ladders",
            "Moisture pockets spark mold outbreaks",
          ],
          reward: "1 sp per day plus grain ration script",
          postingStyle: "Granary Muster Notice",
          issuer: "Keeper Torv Saltmarsh",
          replacementFor: "Routine stacking roster",
        },
      ),
      createQuest(
        "High Tide Vigil",
        "Storm tides threaten the granary stilts—night crews must brace supports and monitor seepage.",
        {
          location: "Saltmarsh Granary",
          requirements: [
            "Guard or Adventurers' Guild Bronze rank for access keys",
            "Carpentry or Masonry proficiency 25+ to brace stilts",
            "Ability to maintain anti-mold wards (Herbalism 20+ or Magic Circle 1)",
          ],
          conditions: [
            "Three-night watch whenever storm surge warnings rise",
            "Sandbagging rotations every two hours",
          ],
          timeline: "Storm tide season (as needed)",
          risks: [
            "Rising water may undercut stilts",
            "Night labor with heavy sacks risks injury",
          ],
          reward: "2 sp per night plus hazard bonus if flooding averted",
          rewardNotes: "Supersedes day shift operations until tide threat passes.",
          postingStyle: "Flood Watch Writ",
          issuer: "Saltmarsh Granary Council",
          guildRankRequirement: "Adventurers' Guild Bronze or Guard Quartermaster",
        },
      ),
    ],
  },
  {
    name: "Saltmeadow Potato Farm",
    category: "agriculture",
    scale: {
      tier: 'village',
      label: "Coastal Potato Fields (Medium)",
      rationale:
        "Supplies Wave's Break with starchy staples and exports salted potatoes to caravanserai.",
      output: "Harvests one hundred fifty wagon loads of potatoes per season.",
    },
    production: {
      goods: ["potatoes", "seed tubers", "gull deterrent paste"],
      notes:
        "Potatoes feed harbor kitchens; gull deterrent paste sold to neighboring farms.",
    },
    workforce: {
      description:
        "Diggers lift tubers while skilled wardens manage storage pits and gull deterrents.",
      normal: [
        unskilled(18, "diggers, sack haulers, ridge weeders"),
        skilled(5, "storage wardens, gull watchers"),
        specialist(1, "soil alchemist balancing saline levels"),
      ],
    },
    laborConditions: [
      {
        trigger: "Harvest dig",
        season: "Late summer to early autumn",
        description:
          "Tubers must be lifted quickly before gull migrations strip the fields.",
        staffing: [
          unskilled(16, "spade teams, sack runners"),
          skilled(3, "storage wardens prepping pits"),
        ],
      },
      {
        trigger: "Gull migration watch",
        season: "During major gull flights",
        description:
          "Extra crews needed to patrol fields, set wards, and protect stored sacks.",
        staffing: [
          unskilled(10, "scare lines, sling crews"),
          skilled(3, "wardens applying deterrent paste"),
          specialist(1, "mage or herbalist crafting repellents"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Potato Spade Levy",
        "Farmer Ina calls for hardy spade-hands and a field warden to keep gulls at bay while lifting the crop.",
        {
          location: "Saltmeadow Potato Farm",
          requirements: [
            "Strength for continuous bending labor",
            "Farming or Survival proficiency 20+",
            "Field warden requires Nature 25+ or Magic (Circle 1) for deterrent wards",
          ],
          conditions: [
            "Six-day harvest levy with midday gull patrol rotation",
            "Sacks hauled to elevated storage each dusk",
          ],
          timeline: "Harvest dig (six-day levy)",
          risks: [
            "Gulls scratch and bite inattentive workers",
            "Waterlogged furrows cause sprains",
          ],
          reward: "8 cp per day plus potato ration bundle",
          rewardNotes: "Replaces standard digging roster with hazard pay to deter gulls.",
          postingStyle: "Field Levy Notice",
          issuer: "Farmer Ina Saltmeadow",
          replacementFor: "Routine digging roster",
        },
      ),
      createQuest(
        "Gull Migration Watch",
        "The autumn migration begins—trusted crews must patrol fields and guard storage pits day and night.",
        {
          location: "Saltmeadow Potato Farm",
          requirements: [
            "Adventurers' Guild Cold Iron rank or Guard Scout stripe",
            "Sling or Shortbow proficiency 25+",
            "Animal Handling (Birds) 20+ or Magic (Circle 1) for deterrent chants",
          ],
          conditions: [
            "Four-night patrol with rotating watch posts",
            "Wardens log bird counts and report to Gatewatch",
          ],
          timeline: "During gull migration peaks (four-night patrol)",
          risks: [
            "Large flocks overwhelm standard deterrents",
            "Night fog reduces visibility around storage pits",
          ],
          reward: "2 sp per night plus bounty per flock driven off",
          postingStyle: "Migration Guard Posting",
          issuer: "Saltmeadow Farm Council",
          guildRankRequirement: "Adventurers' Guild Cold Iron or Guard Scout",
        },
      ),
    ],
  },
  {
    name: "Seabreeze Oat Farm",
    category: "agriculture",
    scale: {
      tier: 'village',
      label: "Coastal Oat Fields (Medium)",
      rationale:
        "Provides hardy oats for city stables and caravan beasts; surplus milled at Gullwind Mill.",
      output: "Harvests one hundred ten acres equivalent of oats annually.",
    },
    production: {
      goods: ["oat sheaves", "straw", "seed grain"],
      notes:
        "Oats delivered to Gullwind Mill and Tideflock Stockyards; straw sold as bedding.",
    },
    workforce: {
      description:
        "Reapers cut swaying oats while fieldmasters track weather and schedule threshing.",
      normal: [
        unskilled(18, "reapers, bundle tiers, tarp crews"),
        skilled(4, "fieldmasters, thresh supervisors"),
      ],
    },
    laborConditions: [
      {
        trigger: "Pre-gale reaping",
        season: "Late summer before storms",
        description:
          "Oats must be cut and stooked before sea gales flatten the crop.",
        staffing: [
          unskilled(16, "scythe crews, bundle haulers"),
          skilled(3, "foremen reading wind and tarping sheaves"),
        ],
      },
      {
        trigger: "Storm lash tarp duty",
        season: "During storm warnings",
        description:
          "Tarp crews guard stooks overnight and rotate watch to prevent losses.",
        staffing: [
          unskilled(10, "tarp teams, rope tenders"),
          skilled(2, "weatherwise foremen scheduling rotations"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Seabreeze Reaping Bill",
        "Steward Loran seeks scythe-men and a weatherwise foreman to cut and stook oats ahead of the next gale.",
        {
          location: "Seabreeze Oat Farm",
          requirements: [
            "Scythe proficiency 25+",
            "Survival or Nature proficiency 22+ to read wind shifts",
            "Teams must supply their own canvas gloves",
          ],
          conditions: [
            "Five-day contract working sunrise to dusk",
            "Evening tarp checks assigned to each crew",
          ],
          timeline: "Pre-gale harvest window (five-day contract)",
          risks: [
            "Gusts can throw scythe arcs off balance",
            "Night damp spoils un-tarped sheaves",
          ],
          reward: "1 sp per day plus oat ration for mounts",
          rewardNotes: "Replaces regular reaping roster to attract skilled crews before storms.",
          postingStyle: "Harvest Bill",
          issuer: "Steward Loran Seabreeze",
          replacementFor: "Standard reaping roster",
        },
      ),
      createQuest(
        "Storm Lash Tarp Crew",
        "Storm bells ring—oat stacks need tarps held fast through the night to save the crop.",
        {
          location: "Seabreeze Oat Farm",
          requirements: [
            "Adventurers' Guild Cold Iron rank or Guard Auxiliary pass",
            "Ropework proficiency 20+ or Sail Handling experience",
            "Endurance to stay on watch in driving rain",
          ],
          conditions: [
            "Night-long vigil during gale warnings",
            "Rotate between tarp lines every two hours",
          ],
          timeline: "Any storm warning during harvest season",
          risks: [
            "Lightning and gusts create fall hazards",
            "Tarps act like sails; improper knots can cause collapse",
          ],
          reward: "2 sp per night plus hazard ration chits",
          postingStyle: "Storm Vigil Notice",
          issuer: "Seabreeze Field Council",
          guildRankRequirement: "Adventurers' Guild Cold Iron or Guard Auxiliary",
        },
      ),
    ],
  },
  {
    name: "Seawisp Plum Orchard",
    category: "agriculture",
    scale: {
      tier: 'hamlet',
      label: "Mist Plum Orchard (Specialty)",
      rationale:
        "Produces tart plums prized for preserves and medicinal syrups.",
      output: "Harvests eighty baskets per season with mist-dependent ripening.",
    },
    production: {
      goods: ["plums", "preserves", "plum wine base"],
      notes:
        "Fruit sold to apothecaries and Sunmellow Grove; pits used for oil extraction.",
    },
    workforce: {
      description:
        "Gatherers work in damp dawns while pruners manage tree health to prevent mildew.",
      normal: [
        unskilled(12, "pickers, basket carriers, mist ward tenders"),
        skilled(3, "pruners, mildew wardens"),
        specialist(1, "herbalist brewing anti-rot wash"),
      ],
    },
    laborConditions: [
      {
        trigger: "Mist harvest",
        season: "Damp dawns during late summer",
        description:
          "Plums must be clipped gently while mist still clings; surfaces slick.",
        staffing: [
          unskilled(10, "pickers, ladder holders"),
          skilled(2, "pruners to remove diseased limbs"),
        ],
      },
      {
        trigger: "Mildew patrol",
        season: "After prolonged rains",
        description:
          "Crews apply herbal washes and clear fungus to save fruit and wood.",
        staffing: [
          unskilled(6, "wash crews, brush burners"),
          skilled(3, "herbal wardens mixing solutions"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Seawisp Fruit Compact",
        "Orchard keeper Hima calls for light-footed gatherers and a pruner to clip branches amid the sea-mist.",
        {
          location: "Seawisp Plum Orchard",
          requirements: [
            "Climbing proficiency 18+ with soft shoes",
            "Herbalism or Nature proficiency 20+ to detect mildew",
            "Willingness to work in persistent damp; warm cloaks issued",
          ],
          conditions: [
            "Four-morning contract beginning before sunrise",
            "Fruit sorted under canopy immediately after picking",
          ],
          timeline: "Late summer mist harvest (four-morning levy)",
          risks: [
            "Slippery bark and ladders",
            "Delicate fruit bruises easily, voiding bonus",
          ],
          reward: "6 cp per morning plus plum preserve jar",
          rewardNotes: "Replaces routine picking rota with incentives for careful handling.",
          postingStyle: "Mist Harvest Notice",
          issuer: "Keeper Hima Seawisp",
          replacementFor: "Standard orchard rota",
        },
      ),
      createQuest(
        "Mildew Ward Sweep",
        "Prolonged rains demand mildew patrols—apply herbal washes and prune diseased wood before rot spreads.",
        {
          location: "Seawisp Plum Orchard",
          requirements: [
            "Herbalism proficiency 25+ or Alchemy 20+",
            "Protective mask discipline; Constitution 11+ advised",
            "Guild Rank: Orchardists' Guild Journeyman or Adventurers' Guild Bronze",
          ],
          conditions: [
            "Two-day sweep with midday drying periods",
            "Burn infected branches at designated pits",
          ],
          timeline: "After three or more consecutive rain days",
          risks: [
            "Mildew spores irritate lungs",
            "Burn pits near mist can flare unexpectedly",
          ],
          reward: "1 sp 5 cp per day plus bonus for zero-spread certification",
          postingStyle: "Mildew Patrol Writ",
          issuer: "Seawisp Orchard Council",
          guildRankRequirement: "Orchardists' Guild Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "South Gate",
    category: "security",
    scale: {
      tier: 'strategic',
      label: "Farmland Gatehouse (Strategic)",
      rationale:
        "Regulates outbound farm traffic and routes patrols toward the coastal road.",
      output:
        "Maintains round-the-clock inspections, patrol musters, and toll records for the southern road.",
    },
    production: {
      goods: ["travel permits", "inspection reports", "toll scripts"],
      notes:
        "Coordinates with Coast Road Watchtower and caravanserai; houses muster for farmland patrols.",
    },
    workforce: {
      description:
        "Gate aides manage travelers while guards direct wagons and operate the portcullis.",
      normal: [
        unskilled(6, "marshal aides, signal flaggers, torch bearers"),
        skilled(9, "guards, inspectors, toll clerks"),
        specialist(2, "sergeants commanding patrol detachments"),
      ],
    },
    laborConditions: [
      {
        trigger: "Harvest outbound surge",
        season: "Late summer and autumn",
        description:
          "Hundreds of wagons depart daily; gate requires extra guards to keep order and prevent smuggling.",
        staffing: [
          unskilled(4, "queue marshals directing wagons"),
          skilled(6, "inspectors and toll scribes"),
          specialist(1, "sergeant coordinating with caravan masters"),
        ],
      },
      {
        trigger: "Threat muster",
        season: "Whenever bandit warnings or beast incursions rise",
        description:
          "Gate enters lockdown drills requiring veteran squads to muster and escort patrols.",
        staffing: [
          skilled(6, "armed guards for escort columns"),
          specialist(1, "battle mage or engineer to secure gatehouse"),
        ],
      },
    ],
    quests: [
      createQuest(
        "South Gate Writ",
        "Captain Relwen nails a sun-faded writ beneath the South Gate canopy, calling for queue marshals to chalk wagon numbers, steady torch-bearers amid spice carts, and a steady sergeant to stamp toll ledgers before the harvest caravans roll out.",
        {
          location: "South Gate marshal's canopy and outbound queue lanes",
          requirements: [
            "Wave's Break Guard rank: Gatehand or Adventurers' Guild Bronze",
            "Perception 24+ to spot contraband",
            "Ability to maintain traveler ledgers accurately",
          ],
          conditions: [
            "Seven-day rotation covering dawn and dusk surges",
            "Caravan captains sign off with the assigned sergeant each departure",
          ],
          timeline: "Harvest outbound surge (seven-day roster)",
          risks: [
            "Crowded queues risk stampedes",
            "Smugglers attempt to bribe marshals",
          ],
          reward: "2 sp per day plus Gatewatch ration chits",
          postingStyle: "Gate Muster Writ",
          issuer: "Captain Relwen Southgate",
          guildRankRequirement: "Wave's Break Guard Gatehand or Adventurers' Guild Bronze",
          reputationRequirement: "Gatewatch Standing: Reliable",
        },
      ),
      createQuest(
        "Outbound Patrol Escort",
        "Gatewatch runners need a seasoned escort to marshal salt-caked supply wagons, haul storm tarps, and carry brass signal horns from the South Gate muster yard to the Brackenshore and Coast Road watchposts as bandit whispers flare.",
        {
          location: "South Gate muster yard and coastal road watchposts",
          requirements: [
            "Guard rank: Sergeant or Adventurers' Guild Brass",
            "Martial Weapon proficiency 30+ or Battle Magic (Circle 1)",
            "Reputation: Gatewatch Standing 'Trusted' or better",
          ],
          conditions: [
            "Three-day patrol loop covering Brackenshore and Coast Road watchposts",
            "Daily situation reports filed upon return",
          ],
          timeline: "As declared during threat muster",
          risks: [
            "Bandit ambush along hedgerows",
            "Weather may bog wagons in coastal mud",
          ],
          reward: "6 sp per day plus hazard stipend and commendation",
          postingStyle: "Escort Duty Order",
          issuer: "Gatewatch Command Council",
          guildRankRequirement: "Guard Sergeant or Adventurers' Guild Brass",
          reputationRequirement: "Gatewatch Standing: Trusted",
        },
      ),
    ],
  },
  {
    name: "Sunmellow Grove",
    category: "agriculture",
    scale: {
      tier: 'village',
      label: "Stone-Terrace Grove (Medium)",
      rationale:
        "Produces stone-warmed fruits and honeyed wine famed in Wave's Break.",
      output:
        "Harvests seventy terraces of apricots and plums and ferments honeyed wine batches each season.",
    },
    production: {
      goods: ["sunmellow plums", "apricots", "honeyed wine", "fruit cordials"],
      notes:
        "Honeyed wine sold to Greensoul salons; cordials used by healers and inns.",
    },
    workforce: {
      description:
        "Pickers handle delicate fruits while vintners monitor fermenting vats in sun-warmed cellars.",
      normal: [
        unskilled(14, "fruit pluckers, crate carriers, shade cloth tenders"),
        skilled(6, "vintners, ferment keepers, honey mixers"),
        specialist(1, "grove master tracking stone heat and humidity"),
      ],
    },
    laborConditions: [
      {
        trigger: "Sunstone harvest",
        season: "Late summer afternoons",
        description:
          "Fruits ripen under stone terraces; picking must avoid overheating and bruising.",
        staffing: [
          unskilled(12, "gentle pickers, shade cloth crews"),
          skilled(3, "vintners prepping crush"),
        ],
      },
      {
        trigger: "Ferment heat watch",
        season: "During hottest weeks",
        description:
          "Honeyed wine ferments can overheat; crews rotate to stir and cool vats.",
        staffing: [
          unskilled(6, "water haulers, cooling cloth tenders"),
          skilled(3, "ferment monitors measuring temperature"),
          specialist(1, "alchemist to adjust honey infusion"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Sunmellow Vintage Bid",
        "Grove mistress Lysa hires fruit-pluckers and a vintner to ferment honeyed wine before the sweetness fades.",
        {
          location: "Sunmellow Grove",
          requirements: [
            "Delicate touch; Dexterity 12+ or Sleight-of-Hand proficiency",
            "Brewer's or Vintner's Tools proficiency 28+ for ferment lead",
            "Endurance to work in radiant stone heat",
          ],
          conditions: [
            "Five-afternoon harvest with evening crush",
            "Cooling breaks every hour to prevent heatstroke",
          ],
          timeline: "Sunstone harvest (five-afternoon contract)",
          risks: [
            "Overheated fruit spoils quickly",
            "Honey attracts bees if vats left uncovered",
          ],
          reward: "1 sp per afternoon plus bottle of table wine",
          rewardNotes: "Replaces the regular picking crew to secure expert vintners.",
          postingStyle: "Vintage Bid Posting",
          issuer: "Mistress Lysa Sunmellow",
          replacementFor: "Routine grove roster",
        },
      ),
      createQuest(
        "Stone Heat Shade Crew",
        "Heat waves threaten the vats—trusted crews must rig shadecloth and cool fermenters through the hottest nights.",
        {
          location: "Sunmellow Grove",
          requirements: [
            "Brewer's or Vintner's Tools proficiency 30+",
            "Herbalism 18+ to mix cooling infusions",
            "Guild Rank: Vintners' Guild Journeyman or Adventurers' Guild Bronze",
          ],
          conditions: [
            "Three-night rotation with hourly temperature logs",
            "Coordinate with Mistflower Apiary for honey deliveries",
          ],
          timeline: "During heat wave advisories",
          risks: [
            "Heatstroke risk within stone cellar",
            "Spoiled batches ruin entire season profits",
          ],
          reward: "2 sp per night plus share of reserve honeyed wine",
          postingStyle: "Heat Watch Writ",
          issuer: "Sunmellow Grove Council",
          guildRankRequirement: "Vintners' Guild Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "Tideflock Stockyards",
    category: "agriculture",
    scale: {
      tier: 'township',
      label: "Livestock Exchange (Large)",
      rationale:
        "Markets cattle and sheep for Wave's Break and exports to Creekside and Coral Keep.",
      output: "Processes five hundred head weekly with auctions and drives.",
    },
    production: {
      goods: ["livestock sales", "ledger tallies", "wool bales"],
      notes:
        "Handles drover contracts and quarantine pens; coordinates with Driftfell Meadow and Moorlight Flats.",
    },
    workforce: {
      description:
        "Muckers clean pens while drovers manage auctions, quarantine, and shipment counts.",
      normal: [
        unskilled(16, "muck crews, pen hands, gate operators"),
        skilled(8, "drovers, auction callers, tally clerks"),
        specialist(2, "veterinary stewards and inspectors"),
      ],
    },
    laborConditions: [
      {
        trigger: "Market week",
        season: "Weekly auctions",
        description:
          "Large consignments require extra pen hands and drovers to manage bidding and shipments.",
        staffing: [
          unskilled(14, "pen crews, muck teams, gate handlers"),
          skilled(6, "drovers to move lots and tally animals"),
          specialist(1, "vet steward performing health checks"),
        ],
      },
      {
        trigger: "Storm relocation",
        season: "When storms threaten low pens",
        description:
          "Herds must be moved to higher ground quickly; requires experienced drovers and handlers.",
        staffing: [
          unskilled(10, "rope teams, barricade crews"),
          skilled(6, "drovers coordinating herds"),
          specialist(1, "animal healer for stressed stock"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Stockyard Muster",
        "Drovers' guild seeks yard hands and a tallyman to manage incoming herds this market week.",
        {
          location: "Tideflock Stockyards",
          requirements: [
            "Animal Handling (Cattle or Sheep) proficiency 30+",
            "Strength to haul gates and muck carts",
            "Ledger skills for tallyman role",
          ],
          conditions: [
            "Eight-day market cycle with dawn auctions",
            "Health inspections logged for each lot",
          ],
          timeline: "Market week (eight-day roster)",
          risks: [
            "Spooked herds can trample workers",
            "Muck pits pose disease risk without precautions",
          ],
          reward: "1 sp per day plus meal vouchers",
          rewardNotes: "Replaces routine yard roster with guild-backed pay.",
          postingStyle: "Drovers' Guild Notice",
          issuer: "Drovers' Guild Steward Mara",
          replacementFor: "Routine yard roster",
        },
      ),
      createQuest(
        "Storm Herd Relocation",
        "Storm surge threatens the low pens—experienced drovers must move herds to high shelter overnight.",
        {
          location: "Tideflock Stockyards",
          requirements: [
            "Adventurers' Guild Bronze rank or Drovers' Guild Journeyman",
            "Animal Handling (Cattle) 35+ or Nature Magic (Circle 1)",
            "Teams must include one member with Ropework proficiency 20+",
          ],
          conditions: [
            "Two-night emergency relocation during storm warnings",
            "Coordinate with Coast Road Watchtower for evacuation routes",
          ],
          timeline: "During storm surge alerts",
          risks: [
            "Panicked livestock break fences",
            "Lightning and floodwater hazards in pens",
          ],
          reward: "3 sp per night plus bonus per herd secured",
          postingStyle: "Emergency Drover Writ",
          issuer: "Drovers' Guild Council",
          guildRankRequirement: "Drovers' Guild Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "Tidewatcher Lighthouse",
    category: "security",
    scale: {
      tier: 'strategic',
      label: "Coastal Lighthouse (Strategic)",
      rationale:
        "Guides ships, warns of storms, and coordinates coastal evacuations.",
      output: "Maintains beacon, lens polishing, and dispatch watch at all hours.",
    },
    production: {
      goods: ["beacon light", "weather reports", "dispatches"],
      notes:
        "Signals Harborworks, Coast Road Watchtower, and shoreline hamlets; houses the storm bells.",
    },
    workforce: {
      description:
        "Assistants haul oil and polish lenses while watchmen observe sea lanes and signal towers.",
      normal: [
        unskilled(6, "oil haulers, stair runners, lens polishers"),
        skilled(5, "watchmen, navigators, signalers"),
        specialist(2, "keeper and storm mage"),
      ],
    },
    laborConditions: [
      {
        trigger: "Storm watch",
        season: "Autumn and winter storms",
        description:
          "Beacon must stay lit through gale-force winds; extra crews secure ropes and sound bells.",
        staffing: [
          unskilled(4, "oil haulers, rope tenders"),
          skilled(3, "watchmen with navigation charts"),
          specialist(1, "storm mage or seasoned keeper"),
        ],
      },
      {
        trigger: "Fog line drill",
        season: "Spring fog season",
        description:
          "Practice evacuation signals and foghorn relays for villages along the coast.",
        staffing: [
          unskilled(3, "horn carriers, lantern runners"),
          skilled(2, "signalers coordinating with Coast Road Watchtower"),
          specialist(1, "keeper overseeing drill timing"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Tidewatch Beacon Order",
        "Keeper Malen seeks oil-haulers and a veteran watcher to keep vigil through brewing storms.",
        {
          location: "Tidewatcher Lighthouse",
          requirements: [
            "Adventurers' Guild Bronze rank or Harbor Guard warrant",
            "Perception 28+ to spot ships in driving rain",
            "Strength to haul oil casks up two hundred steps",
          ],
          conditions: [
            "Storm warning shifts lasting two nights",
            "Beacon inspections every hour; logs submitted to Harborworks",
          ],
          timeline: "Storm season (two-night assignments)",
          risks: [
            "High winds threaten to hurl watchers from parapet",
            "Lightning strikes and salt spray reduce visibility",
          ],
          reward: "3 sp per night plus hazard stipend",
          postingStyle: "Lighthouse Duty Writ",
          issuer: "Keeper Malen Tidewatcher",
          guildRankRequirement: "Adventurers' Guild Bronze or Harbor Guard",
        },
      ),
      createQuest(
        "Fogline Evacuation Drill",
        "Spring fog demands a full drill—signal crews must coordinate lighthouse, watchtower, and coastal hamlets.",
        {
          location: "Tidewatcher Lighthouse",
          requirements: [
            "Signal Flags proficiency 25+ or Navigation 20+",
            "Guild Rank: Guard Signal Corps or Adventurers' Guild Bronze",
            "Ability to run stairwells quickly (Athletics 20+)",
          ],
          conditions: [
            "Single-day drill with dawn muster and midday evaluation",
            "Success requires contacting all three coastal hamlets",
          ],
          timeline: "Spring fog cycle (scheduled drills)",
          risks: [
            "Slippery stairs cause falls",
            "Failure to signal hamlets triggers remedial duty",
          ],
          reward: "2 sp for drill plus commendation if all signals verified",
          postingStyle: "Signal Drill Posting",
          issuer: "Harbor Guard Command",
          guildRankRequirement: "Guard Signal Corps or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "Tidewheel Watermill",
    category: "processing",
    scale: {
      tier: 'village',
      label: "Tidal Mill (Medium)",
      rationale:
        "Harnesses tidal surges to grind grain when windmills stall.",
      output: "Grinds eighty sacks per tide cycle and supplements Gullwind Mill production.",
    },
    production: {
      goods: ["flour", "bran", "coarse meal"],
      notes:
        "Handles wet grain shipments after storms; requires precise timing with tides.",
    },
    workforce: {
      description:
        "Carriers load grain onto tidal platforms while millers align gears to incoming waves.",
      normal: [
        unskilled(8, "grain porters, sluice scrapers"),
        skilled(4, "tide-savvy millers, gearwrights"),
        specialist(1, "millwright tracking tide tables"),
      ],
    },
    laborConditions: [
      {
        trigger: "Spring runoff surge",
        season: "Spring tides",
        description:
          "High tides provide extra power; crews extend hours to mill backlog.",
        staffing: [
          unskilled(6, "porters moving wet grain"),
          skilled(3, "millers timing gates"),
        ],
      },
      {
        trigger: "Storm surge gear lock",
        season: "After major storms",
        description:
          "Gears need inspection and cleaning to remove debris; requires skilled millwrights.",
        staffing: [
          unskilled(4, "debris crews, pump operators"),
          skilled(3, "gearwrights, millwrights"),
          specialist(1, "engineer to recalibrate timing cams"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Tidewheel Miller's Bond",
        "Millwright Jessa hires grain porters and a tide-savvy miller to grind through the spring run-off.",
        {
          location: "Tidewheel Watermill",
          requirements: [
            "Strength to haul wet grain sacks",
            "Miller's Tools proficiency 25+",
            "Ability to read tide tables (Navigation 20+)",
          ],
          conditions: [
            "Six-tide contract (three days) with shifts aligned to high tide",
            "Between tides crews clean sluices and dry grain",
          ],
          timeline: "Spring runoff surge (three-day contract)",
          risks: [
            "Slippery platforms during high tide",
            "Mis-timed gate release floods gearhouse",
          ],
          reward: "1 sp per tide plus grain credit",
          postingStyle: "Millwright Contract",
          issuer: "Millwright Jessa Tidewheel",
          replacementFor: "Routine tide roster",
        },
      ),
      createQuest(
        "Storm Surge Gear Lock",
        "Storm debris jammed the gears—skilled crews must disassemble, clean, and reset before the next tide.",
        {
          location: "Tidewheel Watermill",
          requirements: [
            "Miller's Tools proficiency 35+ or Engineering 25+",
            "Comfort working chest-deep in tidal water with harness",
            "Guild Rank: Miller's Guild Journeyman or Adventurers' Guild Bronze",
          ],
          conditions: [
            "Twelve-hour repair window between tides",
            "Coordinate with Harborworks for debris disposal",
          ],
          timeline: "Immediately after major storms",
          risks: [
            "Incoming tide can trap workers if timing off",
            "Heavy gears may crush limbs if supports fail",
          ],
          reward: "3 sp per shift plus Harborworks hazard bonus",
          postingStyle: "Emergency Mill Writ",
          issuer: "Harborworks Engineer Liaison",
          guildRankRequirement: "Miller's Guild Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
  {
    name: "Wavecut Stoneworks",
    category: "craft",
    scale: {
      tier: 'township',
      label: "Stone Finishing Yard (Large)",
      rationale:
        "Finishes stone blocks from Cliffbreak Quarry for city projects and noble commissions.",
      output: "Polishes forty architectural stones per tenday and carves bespoke pieces.",
    },
    production: {
      goods: ["finished stone", "carvings", "ornamental panels"],
      notes:
        "Supplies Governor's Keep, harbor balustrades, and exports carved fascia to Coral Keep.",
    },
    workforce: {
      description:
        "Apprentices sand blocks while master masons chisel ornamental faces.",
      normal: [
        unskilled(12, "block turners, sanding crews, slurry cleaners"),
        skilled(7, "journeyman masons, chisellers, polishers"),
        specialist(2, "master mason and design drafter"),
      ],
    },
    laborConditions: [
      {
        trigger: "Governor's commission",
        season: "When major civic projects commence",
        description:
          "Large commissions require extra apprentices and masters to meet deadlines.",
        staffing: [
          unskilled(8, "turners, sanders"),
          skilled(5, "detail masons"),
          specialist(1, "architect liaison"),
        ],
      },
      {
        trigger: "Storm damage repair",
        season: "After coastal storms",
        description:
          "Damaged harbor facades need replacements; stoneworks run extended shifts.",
        staffing: [
          unskilled(6, "sanding crews"),
          skilled(4, "mason carvers"),
          specialist(1, "quality inspector checking alignment"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Stoneworks Apprentice Call",
        "Guild seeks block-turners and a master mason to finish the governor's commission.",
        {
          location: "Wavecut Stoneworks",
          requirements: [
            "Strength to rotate half-ton blocks",
            "Masonry proficiency 30+ for journeymen",
            "Architectural drafting familiarity preferred (Intelligence 12+)",
          ],
          conditions: [
            "Ten-day contract with daylight shifts",
            "Dust masks required; guild provides tools",
          ],
          timeline: "During major civic commission (ten-day contract)",
          risks: [
            "Stone dust inhalation",
            "Chisel slips injure hands",
          ],
          reward: "1 sp per day for apprentices; 4 sp per piece for master mason",
          rewardNotes: "Overrides normal apprentice rota to meet civic deadline.",
          postingStyle: "Masons' Guild Posting",
          issuer: "Master Mason Corin Wavecut",
          replacementFor: "Routine finishing roster",
        },
      ),
      createQuest(
        "Harbor Facade Rush",
        "Storm damage requires intricate stone replacements—only vetted masons may carve replacements overnight.",
        {
          location: "Wavecut Stoneworks",
          requirements: [
            "Masonry proficiency 45+",
            "Guild Rank: Masons' Guild Journeyman or Adventurers' Guild Brass (artisan)",
            "Ability to follow Harborworks blueprints precisely",
          ],
          conditions: [
            "Three-night rush with Harborworks inspector on site",
            "Pieces delivered at dawn to harbor cranes",
          ],
          timeline: "Immediately after harbor storms",
          risks: [
            "Fine carving under time pressure leads to chip fractures",
            "Overnight slurry freezing cracks stone",
          ],
          reward: "5 sp per night plus Harborworks completion bonus",
          postingStyle: "Emergency Masonry Writ",
          issuer: "Harborworks Stone Liaison",
          guildRankRequirement: "Masons' Guild Journeyman or Adventurers' Guild Brass",
        },
      ),
    ],
  },
  {
    name: "Windward Berry Vineyard & Winery",
    category: "agriculture",
    scale: {
      tier: 'village',
      label: "Hillside Berry Vineyard (Medium)",
      rationale:
        "Produces berry wines for export and local festivals; hillside requires sure-footed crews.",
      output: "Harvests sixty berry terraces and ferments sparkling berry wine batches.",
    },
    production: {
      goods: ["berries", "berry wine", "cordials"],
      notes:
        "Exports sparkling berry wine to nobles; leftover berries sold fresh in markets.",
    },
    workforce: {
      description:
        "Pickers navigate steep slopes while vintners manage fermenting vats susceptible to hill gusts.",
      normal: [
        unskilled(12, "pickers, basket carriers, rope handlers"),
        skilled(5, "vintners, ferment tenders, barrel rollers"),
        specialist(1, "wind reader coordinating harvest windows"),
      ],
    },
    laborConditions: [
      {
        trigger: "Hillside harvest",
        season: "Late summer breezes",
        description:
          "Berries must be picked before winds bruise them; crews need safety ropes.",
        staffing: [
          unskilled(10, "pickers with harnesses, rope anchors"),
          skilled(3, "vintners prepping presses"),
        ],
      },
      {
        trigger: "Gustborn ferment guard",
        season: "During stormy weeks",
        description:
          "Gusts cool vats unevenly; crews stir and warm fermentation to keep flavor consistent.",
        staffing: [
          unskilled(6, "coal braziers, tarp tenders"),
          skilled(3, "ferment watchers adjusting caps"),
          specialist(1, "alchemist blending stabilizing herbs"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Windward Wine Writ",
        "Vintner Soren invites berry-pickers and a fermenter to keep vats singing despite the hill's gusts.",
        {
          location: "Windward Berry Vineyard & Winery",
          requirements: [
            "Sure-footedness; Acrobatics 18+ or Climbing proficiency 20+",
            "Brewer's or Vintner's Tools proficiency 25+ for fermenters",
            "Use of safety harness provided by the guild",
          ],
          conditions: [
            "Four-day hillside harvest with morning and evening shifts",
            "Pressing performed under canopy immediately after picking",
          ],
          timeline: "Hillside harvest (four-day contract)",
          risks: [
            "Loose stones cause slides",
            "High gusts topple baskets if left unsecured",
          ],
          reward: "1 sp per day plus sparkling berry wine ration",
          rewardNotes: "Takes precedence over routine picking rota during gusty weeks.",
          postingStyle: "Harvest Writ",
          issuer: "Vintner Soren Windward",
          replacementFor: "Standard harvest roster",
        },
      ),
      createQuest(
        "Gustborn Ferment Guard",
        "Storm gusts chill the vats—skilled crews must stabilize fermentation through the night.",
        {
          location: "Windward Berry Vineyard & Winery",
          requirements: [
            "Brewer's or Vintner's Tools proficiency 32+",
            "Knowledge of Herbalism 20+ for warming infusions",
            "Guild Rank: Vintners' Guild Journeyman or Adventurers' Guild Bronze",
          ],
          conditions: [
            "Three-night guard with temperature logs every hour",
            "Coordinate with Sunmellow Grove for shared honey infusions",
          ],
          timeline: "Stormy weeks during fermentation",
          risks: [
            "Ferments can sour if left unattended",
            "Braziers pose fire risk in wooden press hall",
          ],
          reward: "2 sp per night plus bonus if batches remain within flavor profile",
          postingStyle: "Ferment Guard Posting",
          issuer: "Windward Vineyard Council",
          guildRankRequirement: "Vintners' Guild Journeyman or Adventurers' Guild Bronze",
        },
      ),
    ],
  },
];

const WAVES_BREAK_FARMLAND_QUEST_BOARDS = buildQuestBoardMap(
  WAVES_BREAK_FARMLAND_BUSINESSES,
);

const WAVES_BREAK_PORT_BUSINESSES: BusinessProfile[] = [
  {
    name: "Harborwatch Trading House",
    category: "logistics",
    scale: {
      tier: 'strategic',
      label: "Harbor Exchange (Strategic)",
      rationale:
        "Bonded warehouses and city customs rely on Harborwatch to clear every cargo that reaches the quay.",
      output:
        "Stamped manifests, customs seals, bonded vault space, and routed wagons to inland buyers.",
    },
    production: {
      goods: ["bonded manifests", "customs seals", "vault allocations"],
      notes:
        "Handles high-value cargo for nobles and merchants; smaller houses rent counter space for oversight.",
    },
    workforce: {
      description:
        "Ledger halls, bonded vaults, and the seal court require runners, clerks, and auditors around the clock.",
      normal: [
        unskilled(22, "ledger runners, stevedore spotters, seal carriers"),
        skilled(10, "bond clerks, tally scribes, shift foremen"),
        specialist(3, "customs factors verifying coin-weight and contraband reports"),
      ],
    },
    laborConditions: [
      {
        trigger: "Festival convoys and foreign flotillas",
        season: "Late spring and autumn equinox fairs",
        description:
          "Merchants flood the counters after the tidal festivals, demanding more clerks and vault oversight.",
        staffing: [
          skilled(6, "temporary tally clerks and oath-bond notaries"),
          specialist(
            2,
            "bond auditors to inspect gem coffers and spice chests",
            "Paid directly by the magistrate for accuracy.",
          ),
        ],
      },
      {
        trigger: "Storm-delayed flotillas arriving at once",
        season: "Any storm season emergency",
        description:
          "Backlogged ships arrive in a single tide, requiring night crews to clear perishable cargo.",
        staffing: [
          unskilled(12, "lantern runners and cargo marshals for overtime shifts"),
          skilled(4, "night ledger keepers ensuring no cargo slips through unchecked"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Harborwatch Ledger Levy",
        "Factor Merina seeks trustworthy hands to balance manifests while convoys queue in the tidefog.",
        {
          location: "Harborwatch Trading House",
          requirements: [
            "Literacy and numeracy sufficient to copy bonded manifests without error",
            "Guild Rank: Merchants' League Junior Clerk or Adventurers' Guild Bronze",
            "Present Bronze token stamped with 1 star (stamps reset upon promotion).",
          ],
          conditions: [
            "Ten-hour ledger shifts amid crowded counters",
            "All discrepancies reported to the seal court within one bell",
          ],
          timeline: "Convoy season (three-day rotation)",
          risks: [
            "Smugglers offer bribes to misplace invoices",
            "Seal court fines for ledgers submitted late",
          ],
          reward: "2 sp per long day plus furnished bunk in the counting loft",
          rewardNotes: "Pay docked for ledgers that fail double-audit.",
          postingStyle: "Ledger Writ",
          issuer: "Factor Merina of Harborwatch",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token stamped with 1 star for dependable tallies",
        },
      ),
      createQuest(
        "Seal Court Contraband Sweep",
        "The magistrate commands a midnight audit of suspicious cargo holds rumored to hide smuggled aetherglass.",
        {
          location: "Harborwatch Trading House",
          requirements: [
            "Investigation 24+ or Insight 20+ to spot forged seals",
            "Guild Rank: Harbor Guard Lieutenant or Adventurers' Guild Silver",
            "Present Silver token stamped with 2 stars; stamps void once you rise in rank.",
          ],
          conditions: [
            "Nighttime vault sweeps accompanied by harbor guards",
            "All confiscated contraband logged and sealed before dawn bell",
          ],
          timeline: "Declared within a single tide (one-night operation)",
          risks: [
            "Cornered smugglers may flee into the alleys",
            "Failure to document seizures results in fines or censure",
          ],
          reward: "15 sp hazard pay plus 10% share of assessed fines",
          postingStyle: "Seal Court Edict",
          issuer: "Harbor Magistrate's Seal Court",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token bearing 2 stars or Guard lieutenant writ",
        },
      ),
    ],
  },
  {
    name: "Stormkeel Shipwrights",
    category: "craft",
    scale: {
      tier: 'strategic',
      label: "Royal Slipway Consortium (Strategic)",
      rationale:
        "Stormkeel manages the largest slipways on the coast, repairing the fleet and laying keels for royal commissions.",
      output:
        "Ocean-going hulls, mast assemblies, and deep-keel retrofits for naval cutters and merchant carracks.",
    },
    production: {
      goods: ["repaired hull sections", "fresh masts", "tarred decking"],
      notes:
        "Maintains three drydocks simultaneously while apprentices craft fittings and spars in adjoining sheds.",
    },
    workforce: {
      description:
        "Massive slipways demand haulers for timber, journeymen to true ribs, and masters to sign off on keels.",
      normal: [
        unskilled(28, "timber haulers, pitch runners, rivet strikers"),
        skilled(14, "journeyman ship carpenters, loftsmen, caulkers"),
        specialist(4, "master framewrights and rigging architects"),
      ],
    },
    laborConditions: [
      {
        trigger: "Nor'easter hull damage",
        season: "Late winter through early spring squalls",
        description:
          "The fleet limps home with sprung planks, calling for extra patch crews to strip and recaulk overnight.",
        staffing: [
          unskilled(18, "yard muckers to pump bilges and strip tar"),
          skilled(8, "carpenters to lay temporary sister ribs"),
        ],
      },
      {
        trigger: "Royal keel-laying commission",
        season: "Declared by Admiralty any season",
        description:
          "When the crown orders a new deepwater keel, extra masters supervise round-the-clock lofting.",
        staffing: [
          skilled(10, "journeymen trusted to cut scarf joints"),
          specialist(3, "master carpenters to sign the Admiralty bond"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Stormwake Hull Patch Crew",
        "Stormkeel calls for steady saw-hands to strip tarred planks and sister ribs before the fleet sails again.",
        {
          location: "Stormkeel Shipwrights",
          requirements: [
            "Carpentry proficiency 18+ or Sailor background with rigging experience",
            "Guild Rank: Shipwrights' Guild Apprentice or Adventurers' Guild Bronze",
            "Bronze token accepted with 0- or 1-star stamp; stamps reset upon promotion.",
          ],
          conditions: [
            "Overnight shifts in tarred slips amid stormwater",
            "Master carpenter signs off each repair before dawn tide",
          ],
          timeline: "Stormbreak week (four consecutive nights)",
          risks: [
            "Slippery planks and loose spars",
            "Failure to meet tide results in forfeited bonus",
          ],
          reward: "3 sp per night plus hot meal from the yard galley",
          postingStyle: "Shipwright's Muster",
          issuer: "Foreman Daska Stormkeel",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token on record at the Shipwrights' ledger",
        },
      ),
      createQuest(
        "Deep Keel Reliability Bond",
        "The Admiralty requires trusted artisans to oversee a deep-keel commission bound for royal waters.",
        {
          location: "Stormkeel Shipwrights",
          requirements: [
            "Carpentry proficiency 30+ or Smithing proficiency 28+ for iron fittings",
            "Guild Rank: Shipwrights' Guild Journeyman or Adventurers' Guild Silver",
            "Silver token stamped with 2 stars—note that all stars vanish when you advance in rank.",
          ],
          conditions: [
            "Sunrise-to-moonrise oversight of keel assembly",
            "Daily reports delivered to Admiralty agent at Nobles' Quay",
          ],
          timeline: "Keel commission (seven-day contract)",
          risks: [
            "Penalty clauses if the keel warps",
            "Sabotage attempts from rival yards",
          ],
          reward: "25 sp for the commission plus bonus upon Admiralty acceptance",
          postingStyle: "Royal Slipway Writ",
          issuer: "Admiralty Quartermaster in residence",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star stamp or Admiralty writ",
        },
      ),
    ],
  },
  {
    name: "Harbor Guard Naval Yard",
    category: "security",
    scale: {
      tier: 'strategic',
      label: "Naval Patrol Bastion (Strategic)",
      rationale:
        "The naval yard arms the cutters guarding the coast and drills marines that protect the sea lanes.",
      output:
        "Ready patrol crews, armed cutters, and signal coverage for the bay.",
    },
    production: {
      goods: ["armed patrols", "signal lantern coverage", "ready powder stores"],
      notes:
        "Maintains three ready cutters and rotates marines for convoy escort and lighthouse relief duties.",
    },
    workforce: {
      description:
        "Sail lofts, powder magazines, and signal towers rely on porters, marines, and mage-wardens.",
      normal: [
        unskilled(24, "dock riggers, powder porters, oil haulers"),
        skilled(18, "marines, bosuns, armorer-smiths"),
        specialist(5, "signal officers and tide mages"),
      ],
    },
    laborConditions: [
      {
        trigger: "Fog-dense nights",
        season: "Autumn and spring fog seasons",
        description:
          "Signals blur in heavy fog; extra watchers and runners keep beacons lit and cutters alert.",
        staffing: [
          unskilled(12, "lantern tenders for the watch towers"),
          skilled(6, "experienced lookouts to track bell codes"),
        ],
      },
      {
        trigger: "Pirate or corsair sightings",
        season: "Any declared naval alert",
        description:
          "When corsair flags are reported, the yard doubles readiness and calls for trusted auxiliaries.",
        staffing: [
          skilled(10, "reserve marines for boarding parties"),
          specialist(4, "battle-sigil casters to anchor wards"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Fog Ward Night Patrol",
        "Captain Yorsen needs vigilant eyes to keep the beacon line unbroken through the harbor fog.",
        {
          location: "Harbor Guard Naval Yard",
          requirements: [
            "Perception 20+ or proficiency with Navigator's Tools",
            "Guild Rank: Harbor Guard Corporal or Adventurers' Guild Bronze with 2-star token",
          ],
          conditions: [
            "Four-night rotation riding cutters and watchtowers",
            "Signal drills every bell to confirm readiness",
          ],
          timeline: "Fog advisory (four-night watch)",
          risks: [
            "Slippery rigging and sudden squalls",
            "Disciplinary lash if a signal is missed",
          ],
          reward: "4 sp per watch night plus Guard rations",
          postingStyle: "Guard Patrol Order",
          issuer: "Captain Yorsen of the Harbor Guard",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token stamped with 2 stars or Guard corporal stripe",
        },
      ),
      createQuest(
        "Corsair Response Drill",
        "Admiral's orders call for veteran blades to drill boarding actions against suspected corsairs.",
        {
          location: "Harbor Guard Naval Yard",
          requirements: [
            "Martial weapon proficiency 30+ or Battle Magic 25+",
            "Guild Rank: Harbor Guard Lieutenant or Adventurers' Guild Silver",
            "Silver token showing 2 stars—reset required upon promotion.",
          ],
          conditions: [
            "Day-long drills culminating in mock boarding at dusk",
            "Live powder blanks used; safety harness required",
          ],
          timeline: "Declared drill (two-day order)",
          risks: [
            "Explosive mishaps in powder magazine",
            "Injury from live steel if formation falters",
          ],
          reward: "18 sp plus commendation toward Guard promotion",
          postingStyle: "Admiralty Drill Bill",
          issuer: "Harbor Guard Admiralty Office",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2 stars or Guard lieutenant writ",
        },
      ),
    ],
  },
  {
    name: "Merchants' Wharf",
    category: "logistics",
    scale: {
      tier: 'strategic',
      label: "Bulk Cargo Wharf (Strategic)",
      rationale:
        "Limited berths demand nonstop crane crews to keep merchant hulls turning with the tide.",
      output:
        "Berth rotations, cargo tallies, and wagon dispatches feeding inland trade routes.",
    },
    production: {
      goods: ["bulk cargo transfers", "berth schedules", "overland dispatch slips"],
      notes:
        "Timber cranes, capstan winches, and wagon queues move grain, ore, and textiles ashore before the tide shifts again.",
    },
    workforce: {
      description:
        "Stevedore gangs, crane captains, tally clerks, and wagon marshals labor in tight rotations along the quay.",
      normal: [
        unskilled(54, "dock laborers, sling teams, wagon loaders"),
        skilled(20, "crane captains, tally clerks, rigging supervisors"),
        specialist(5, "dockmasters coordinating berths and manifests"),
      ],
    },
    laborConditions: [
      {
        trigger: "Storm-delayed flotillas",
        season: "Any storm season emergency",
        description:
          "Backlogged hulls arrive on the same tide; extra shifts must clear cargo before the harbormaster closes the lane.",
        staffing: [
          unskilled(30, "night crane gangs and rope tenders"),
          skilled(8, "relief tally clerks and riggers"),
          specialist(2, "assistant dockmasters to juggle berth rotations"),
        ],
      },
      {
        trigger: "Harvest convoy surge",
        season: "Late summer through early autumn",
        description:
          "Grain barges and timber caravans crowd the piers, demanding overflow crews to keep wagons rolling inland.",
        staffing: [
          unskilled(24, "sunrise wagon loaders and sack carriers"),
          skilled(6, "scale inspectors certifying cargo weight"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Sunrise Cargo Rotation",
        "Dockmaster Alis needs reliable muscle to clear holds before the tide turns.",
        {
          location: "Merchants' Wharf",
          requirements: [
            "Athletics 18+ or Strength 16+ to haul sling loads without slowing",
            "Guild Rank: Dockhand Crew Laborer or Adventurers' Guild Bronze",
            "Bronze token stamped with 1 star accepted; stamp resets when promoted.",
          ],
          conditions: [
            "Sunrise-to-sunset shift moving bulk cargo from holds to waiting wagons",
            "Obey crane captains' calls and report tally discrepancies immediately",
          ],
          timeline: "Single-day contract (sunrise rotation)",
          risks: [
            "Swinging pallets and runaway wagons",
            "Fines for damaged cargo or missed tide",
          ],
          reward: "2 sp 6 cp plus hot meal chit at the quay kitchens",
          postingStyle: "Dockmaster's Bill",
          issuer: "Factor Alis Merrow",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token stamped with 1 star for dock service",
        },
      ),
      createQuest(
        "Evening Crane Watch",
        "The Merrow Syndicate requires sharp oversight as dusk shipments berth under crowded quotas.",
        {
          location: "Merchants' Wharf",
          requirements: [
            "Perception 20+ or Navigator's Tools proficiency 18+ to spot unsafe rigging",
            "Guild Rank: Harbor Guard Corporal or Adventurers' Guild Silver",
            "Silver token stamped with 1 star; stamp clears upon promotion.",
          ],
          conditions: [
            "Supervise crane teams through sunset arrivals and log incidents with Harborwatch",
            "File berth turnover reports before the curfew bell",
          ],
          timeline: "Two-evening oversight during storm backlog",
          risks: [
            "Cable snaps over crowded decks",
            "Dockmaster fines if cargo schedules slip",
          ],
          reward: "12 sp plus berth priority chit for a chartered vessel",
          postingStyle: "Syndicate Crane Order",
          issuer: "Merrow Syndicate Berth Office",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token stamped with 1 star for harbor oversight",
        },
      ),
    ],
  },
  {
    name: "Saltworks",
    category: "processing",
    scale: {
      tier: 'regional',
      label: "Coastal Evaporation Pans (Regional)",
      rationale:
        "The salt pans of Wave's Break supply the fleet, markets, and inland caravans with preserved sea-salt.",
      output:
        "Coarse sea salt, fine finishing salt, and concentrated brine for pickling.",
    },
    production: {
      goods: ["coarse salt", "fine salt", "brine concentrate"],
      notes:
        "Brine channels feed tiered pans; kiln sheds refine the finest crystals for noble tables.",
    },
    workforce: {
      description:
        "Evaporation pans rely on scrapers, kiln keepers, and testers to keep shipments pure.",
      normal: [
        unskilled(30, "pan scrapers, brine haulers, barrel rollers"),
        skilled(12, "salt masters, kiln keepers, brine measurers"),
        specialist(2, "alchemical testers certifying crystal purity"),
      ],
    },
    laborConditions: [
      {
        trigger: "High evaporation weeks",
        season: "Peak summer heat",
        description:
          "Brine dries swiftly, demanding extra crews to rake crystals before winds scatter them.",
        staffing: [
          unskilled(16, "sun-shift scrapers to clear pans"),
          skilled(6, "kiln keepers to manage drying sheds"),
        ],
      },
      {
        trigger: "Storm surge contamination",
        season: "Autumn storm season",
        description:
          "Brine fouled by storm debris requires testers and barrel crews to salvage usable stock.",
        staffing: [
          skilled(5, "wash crews to salvage brine"),
          specialist(2, "alchemists checking purity for high-end buyers"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Tide-Salt Harvest Hands",
        "Saltmaster Rinna hires hardy scrapers to clear drying pans before the noon gusts scatter the crystals.",
        {
          location: "Saltworks",
          requirements: [
            "Endurance to labor under blazing sun",
            "Guild Rank: Panners' League Hand or Adventurers' Guild Copper with star mark",
            "Bronze token with 0 or 1 star acceptable; stars reset if you advance.",
          ],
          conditions: [
            "Six-bell shifts with mandated brine breaks",
            "Work halts when overseer rings heat bell",
          ],
          timeline: "Heat wave (two-day contract)",
          risks: [
            "Heatstroke and brine burns",
            "Cracked barrels if salt left piled",
          ],
          reward: "1 sp per bell plus ration of salt pork",
          postingStyle: "Saltmaster's Bill",
          issuer: "Saltmaster Rinna",
          guildRankRequirement: "Adventurers' Guild Copper or Bronze",
          reputationRequirement: "Any token bearing at least 0-star mark in current rank",
        },
      ),
      createQuest(
        "Crystal Purity Inquest",
        "Noble tables demand flawless crystals; trusted tasters must certify each batch after the storm surge.",
        {
          location: "Saltworks",
          requirements: [
            "Alchemy or Brewing proficiency 20+ to judge impurities",
            "Guild Rank: Saltmaster's Circle Journeyman or Adventurers' Guild Silver",
            "Silver token stamped with 1 star (stamps purge upon promotion).",
          ],
          conditions: [
            "Night testing in the kiln sheds",
            "Reports sealed and delivered to the Highward kitchens",
          ],
          timeline: "Two-night audit following coastal storm",
          risks: [
            "Tainted salt may sicken nobility, drawing fines",
            "Boiling brine and kiln fumes",
          ],
          reward: "10 sp per night plus crate of fine salt",
          postingStyle: "Purity Inspection Notice",
          issuer: "Saltmaster Rinna",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 1-star seal of service",
        },
      ),
    ],
  },
  {
    name: "Fishmongers' Row",
    category: "support",
    scale: {
      tier: 'regional',
      label: "Harbor Fish Exchange (Regional)",
      rationale:
        "Fishmongers' Row handles the city's daily catch and supplies inland caravans with preserved stock.",
      output:
        "Iced fish crates, smoked delicacies, and salted cuts bound for markets.",
    },
    production: {
      goods: ["fresh fish", "smoked fish", "salted fillets"],
      notes:
        "Cooling sheds, smoking pits, and auction stages keep the catch moving before it spoils.",
    },
    workforce: {
      description:
        "Gut lines, auction blocks, and smokehouses demand tireless haulers, careful graders, and master tasters.",
      normal: [
        unskilled(36, "gutters, ice spreaders, crate haulers"),
        skilled(15, "graders, auction callers, salters"),
        specialist(3, "smokehouse masters and tasting stewards"),
      ],
    },
    laborConditions: [
      {
        trigger: "Spring herring run",
        season: "Spring thaw",
        description:
          "Boats return overloaded, requiring extra gutting crews before sunrise markets.",
        staffing: [
          unskilled(20, "extra gutters and haulers for dawn shift"),
          skilled(6, "graders to sort the glut for smoke or sale"),
        ],
      },
      {
        trigger: "Noble banquets or military provisioning",
        season: "Called at need",
        description:
          "Highborn feasts and warships demand impeccable cuts and secure delivery.",
        staffing: [
          skilled(8, "auction stewards and sealers for noble orders"),
          specialist(2, "tasters certifying rare catches"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Dawn Gutting Line",
        "The dockmasters need quick hands before the sun spoils the herring glut.",
        {
          location: "Fishmongers' Row",
          requirements: [
            "Strong stomach and steady knife",
            "Guild Rank: Fishmongers' Guild Porter or Adventurers' Guild Bronze",
            "Bronze token with 0-star stamp accepted; stamp clears when rank advances.",
          ],
          conditions: [
            "Pre-dawn gutting shift ending at first bell",
            "All knives inspected by overseer before payout",
          ],
          timeline: "Spring run (single dawn)",
          risks: [
            "Slippery floors",
            "Loss docked for spoiled fish",
          ],
          reward: "1 sp plus share of offal for bait",
          postingStyle: "Fishmongers' Bill",
          issuer: "Dockmaster Selune",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with recorded dawn shifts",
        },
      ),
      createQuest(
        "Rare Catch Auction Steward",
        "A leviathan tuna must be divided and escorted to the Upper Ward without scandal.",
        {
          location: "Fishmongers' Row",
          requirements: [
            "Persuasion 20+ or Market Lore 18+ to quiet bidders",
            "Guild Rank: Fishmongers' Guild Journeyman or Adventurers' Guild Silver",
            "Silver token stamped with 1 star; stamp forfeits when you take promotion.",
          ],
          conditions: [
            "Midday auction oversight followed by guarded delivery",
            "Account to the Hall of Records upon completion",
          ],
          timeline: "High market day (single afternoon)",
          risks: [
            "Thieves or jealous bidders",
            "Fine levied if portions arrive late or tainted",
          ],
          reward: "9 sp plus gratuity from noble purchaser",
          postingStyle: "Auction Steward Posting",
          issuer: "Fishmongers' Council",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 1-star steward mark",
        },
      ),
    ],
  },
  {
    name: "The Ropewalk",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "Naval Rope Foundry (Regional)",
      rationale:
        "The Ropewalk spins hemp for every ship in Wave's Break and exports towlines along the coast.",
      output:
        "Hemp rope coils, tarred towing lines, and mooring cables sized to navy spec.",
    },
    production: {
      goods: ["hemp rope", "tarred towlines", "naval mooring cables"],
      notes:
        "Hemp is combed, spun, and tarred along a hundred-yard hall under watchful gauge masters.",
    },
    workforce: {
      description:
        "Long halls of spinning hemp rely on twisters, tar stirrers, and gauge masters to meet naval contracts.",
      normal: [
        unskilled(26, "fiber carders, twist runners, tar stirrers"),
        skilled(12, "rope spinners, lay foremen, splice hands"),
        specialist(3, "naval gauge masters and hemp testers"),
      ],
    },
    laborConditions: [
      {
        trigger: "Storm season line replacements",
        season: "Autumn squalls and spring gales",
        description:
          "Fleet captains demand fresh towlines before storms, stretching crews thin.",
        staffing: [
          unskilled(14, "twist runners for overtime shifts"),
          skilled(6, "splice hands to finish orders"),
        ],
      },
      {
        trigger: "Admiralty inspections",
        season: "Declared quarterly",
        description:
          "Royal inspectors require masters to certify gauge, forcing extra proofing crews to work the line.",
        staffing: [
          skilled(4, "proofing crews to stress-test cables"),
          specialist(2, "gauge masters to certify Admiralty lots"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Storm Towline Rush",
        "Rope-master Galen seeks deft hands to spin storm towlines before the fleet departs.",
        {
          location: "The Ropewalk",
          requirements: [
            "Weaving or Textiles proficiency 18+",
            "Guild Rank: Ropemakers' Cooperative Hand or Adventurers' Guild Bronze",
            "Bronze token marked with 1 star; mark purged when promoted.",
          ],
          conditions: [
            "Twelve-hour spinning shifts with tar kettles",
            "Gauge master inspects every coil before payout",
          ],
          timeline: "Storm warning (two-day rush)",
          risks: [
            "Tar burns",
            "Lines snapped if tension mishandled",
          ],
          reward: "2 sp per shift plus choice of standard line coil",
          postingStyle: "Ropewalk Rush Bill",
          issuer: "Rope-master Galen",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star rope seal",
        },
      ),
      createQuest(
        "Admiralty Cable Commission",
        "Royal inspectors demand flawless mooring cables for a flagship refit.",
        {
          location: "The Ropewalk",
          requirements: [
            "Weaving or Textiles proficiency 28+",
            "Guild Rank: Ropemakers' Cooperative Senior Hand or Adventurers' Guild Silver",
            "Silver token stamped with 2 stars—new rank wipes the stamp clean.",
          ],
          conditions: [
            "Continuous proofing of cable lots with Admiralty gauge",
            "Reports delivered nightly to Nobles' Quay inspector",
          ],
          timeline: "Five-day Admiralty inspection",
          risks: [
            "Fines for cables that fail stress test",
            "Political fallout if delivery slips",
          ],
          reward: "20 sp plus Admiralty letter of commendation",
          postingStyle: "Admiralty Proofing Order",
          issuer: "Rope-master Galen",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star Admiralty mark",
        },
      ),
    ],
  },
];

const WAVES_BREAK_PORT_QUEST_BOARDS = buildQuestBoardMap(
  WAVES_BREAK_PORT_BUSINESSES,
);

const WAVES_BREAK_UPPER_WARD_BUSINESSES: BusinessProfile[] = [
  {
    name: "Governor's Keep",
    category: "security",
    scale: {
      tier: 'strategic',
      label: "Civic Bastion (Strategic)",
      rationale:
        "Governor's Keep houses the council, treasury vaults, and elite guard command that safeguard the city.",
      output:
        "Council edicts, secured vault inventories, and strategic directives for guard deployments.",
    },
    production: {
      goods: ["sealed decrees", "treasury oversight", "guard rotations"],
      notes:
        "Vault stewards, heralds, and spymasters coordinate from the keep; trusted auxiliaries are rare.",
    },
    workforce: {
      description:
        "Pages, scribes, bodyguards, and ward-mages labor side-by-side to protect the keep's secrets.",
      normal: [
        unskilled(12, "pages, herald runners, scullions"),
        skilled(18, "record scribes, quartermasters, sworn guards"),
        specialist(6, "spymasters, ward-mages, vault provosts"),
      ],
    },
    laborConditions: [
      {
        trigger: "High council conclaves",
        season: "Once each season or during crises",
        description:
          "The council convenes to set taxes or war policy, demanding additional escorts and scribes to record decrees.",
        staffing: [
          skilled(8, "scribe clerks to capture proceedings"),
          specialist(3, "trusted guards to watch the council chamber"),
        ],
      },
      {
        trigger: "Foreign envoys and royal inspectors",
        season: "Announced at irregular intervals",
        description:
          "When envoys arrive, the keep requires cultural interpreters and discreet escorts through the Upper Ward.",
        staffing: [
          skilled(6, "polyglot ushers and etiquette stewards"),
          specialist(2, "arcane warders to sweep guest quarters"),
        ],
      },
    ],
    quests: [
      createQuest(
        "State Courier Escort",
        "The governor seeks discreet blades to carry sealed dispatches through the Upper Ward and out along the royal road.",
        {
          location: "Governor's Keep",
          requirements: [
            "Diplomacy or Intimidation 24+ to represent the city with poise",
            "Guild Rank: City Guard Captain or Adventurers' Guild Silver",
            "Present Silver token bearing 2 stars; note that stamps clear when promoted.",
          ],
          conditions: [
            "Escort dispatch riders by day and keep watch at noble inns by night",
            "Report to the Hall of Records after each waypoint",
          ],
          timeline: "Five-day overland run to Coral Keep and return",
          risks: [
            "Bandit ambushes seeking royal seals",
            "Political reprisal if dispatch is delayed",
          ],
          reward: "40 sp plus writ of thanks from the governor",
          postingStyle: "Governor's Charge",
          issuer: "Chamberlain Veleth",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token stamped with 2 stars for proven discretion",
        },
      ),
      createQuest(
        "Vault Seal Audit",
        "Treasury provosts require impartial witnesses to confirm the warding of the governor's vaults after an attempted breach.",
        {
          location: "Governor's Keep",
          requirements: [
            "Investigation 28+ or Arcana 25+ to test runic seals",
            "Guild Rank: Treasury Comptroller or Adventurers' Guild Silver",
            "Silver token stamped with 3 stars—stamps purge upon advancement.",
          ],
          conditions: [
            "Two-night vigil inside the vault ring",
            "All ledgers countersigned at dawn by three witnesses",
          ],
          timeline: "Emergency audit (two nights)",
          risks: [
            "Arcane backlash if wards are mishandled",
            "Charges of negligence if discrepancies go unreported",
          ],
          reward: "32 sp plus vault commendation suitable for noble introductions",
          postingStyle: "Treasury Notice",
          issuer: "Provost Malenne",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 3-star audit stamp",
        },
      ),
    ],
  },
  {
    name: "Hall of Records",
    category: "support",
    scale: {
      tier: 'strategic',
      label: "Royal Archive (Strategic)",
      rationale:
        "The Hall of Records maintains deeds, taxes, and treaties for the city and the crown.",
      output:
        "Certified ledgers, archival copies, and scholarly access to historic writs.",
    },
    production: {
      goods: ["archival transcripts", "tax tallies", "sealed deeds"],
      notes:
        "Scribes and archivists file every transaction; only trusted hands touch noble ledgers.",
    },
    workforce: {
      description:
        "The archive operates on precise schedules with scribes, catalogers, and preservationists.",
      normal: [
        unskilled(10, "ink runners, shelf stewards"),
        skilled(22, "copyists, catalogers, tax clerks"),
        specialist(4, "magister-archivists and preservation mages"),
      ],
    },
    laborConditions: [
      {
        trigger: "Tax season influx",
        season: "Late winter",
        description:
          "Tax rolls arrive from every district, requiring additional clerks and night readers.",
        staffing: [
          skilled(10, "ledger balancers for the tithe rolls"),
          specialist(2, "auditors verifying noble exemptions"),
        ],
      },
      {
        trigger: "Disaster record reconciliations",
        season: "Post-storm or fire",
        description:
          "Property losses must be logged swiftly to release relief funds, demanding trusted scribes.",
        staffing: [
          skilled(6, "relief clerks to certify claims"),
          specialist(1, "senior archivist to ratify emergency decrees"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Archive Sifting Vigil",
        "Chief Archivist Rellis requests discreet assistants to index noble ledgers delivered after dusk.",
        {
          location: "Hall of Records",
          requirements: [
            "History or Investigation 18+ with impeccable literacy",
            "Guild Rank: Scribes' Guild Journeyman or Adventurers' Guild Bronze",
            "Bronze token stamped with 2 stars; stars reset on promotion.",
          ],
          conditions: [
            "Overnight sifting of ledgers in sealed reading rooms",
            "No copies may leave the hall; all notes surrendered at dawn",
          ],
          timeline: "Three-night ledger vigil",
          risks: [
            "Forgery charges if ink is spilled",
            "Censure if noble privacy is breached",
          ],
          reward: "3 sp per night and access chit to the reading room",
          postingStyle: "Archivist's Notice",
          issuer: "Chief Archivist Rellis",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 2-star archivist stamp",
        },
      ),
      createQuest(
        "Edict Copyist Circle",
        "Royal writs must be copied overnight for the Dawn Court; only steady calligraphers need apply.",
        {
          location: "Hall of Records",
          requirements: [
            "Calligraphy proficiency 24+ or Dexterity 16+ with steady hand",
            "Guild Rank: Scribes' Guild Senior or Adventurers' Guild Silver",
            "Silver token bearing 1 star—stamps expire on promotion.",
          ],
          conditions: [
            "Circle of five scribes copies forty writs before sunrise",
            "Mistakes must be scraped and redone immediately",
          ],
          timeline: "Single-night edict cycle",
          risks: [
            "Spoiled parchments docked from wages",
            "Censure for leaked edicts",
          ],
          reward: "12 sp for the cycle plus vellum ration",
          postingStyle: "Royal Copyist Writ",
          issuer: "Chronicler's Office",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 1-star copyist mark",
        },
      ),
    ],
  },
  {
    name: "Mercantile Exchange",
    category: "logistics",
    scale: {
      tier: 'strategic',
      label: "Trade Exchange (Strategic)",
      rationale:
        "The exchange clears letters of credit, specie transfers, and bulk commodity contracts for nobles and guilds.",
      output:
        "Certified letters of credit, guarded bullion transfers, and market intelligence bulletins.",
    },
    production: {
      goods: ["letters of credit", "bullion vaulting", "market reports"],
      notes:
        "Factors, guards, and auditors handle fortunes each day; missteps ruin reputations instantly.",
    },
    workforce: {
      description:
        "The exchange relies on runner-pages, floor clerks, bullion guards, and senior factors.",
      normal: [
        unskilled(14, "runner-pages, doorwardens"),
        skilled(20, "floor clerks, contract brokers, bullion guards"),
        specialist(5, "senior factors and crown auditors"),
      ],
    },
    laborConditions: [
      {
        trigger: "Harvest speculation surge",
        season: "Late autumn",
        description:
          "Grain contracts flood the exchange, requiring additional brokers and guard escorts for specie wagons.",
        staffing: [
          skilled(8, "contract clerks to vet grain bonds"),
          specialist(3, "bullion auditors to weigh silver"),
        ],
      },
      {
        trigger: "Guild tribunal investigations",
        season: "Called as needed",
        description:
          "When fraud is suspected, the exchange assembles trusted investigators to trail suspects discreetly.",
        staffing: [
          skilled(5, "ledger hounds to follow paper trails"),
          specialist(2, "tribunal barristers to record testimony"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Specie Transfer Escort",
        "High Factors require steel to move a vault of silver through the Upper Ward at midnight.",
        {
          location: "Mercantile Exchange",
          requirements: [
            "Martial or Shield proficiency 26+",
            "Guild Rank: Mercantile Guard Sergeant or Adventurers' Guild Silver",
            "Silver token with 2 stars; marks wiped when you ascend in rank.",
          ],
          conditions: [
            "Silent midnight march from exchange vault to governor's treasury",
            "No lanterns save shielded guard lamps",
          ],
          timeline: "Single-night transfer",
          risks: [
            "Assassin guild interest",
            "Severe penalties for misplaced coin",
          ],
          reward: "22 sp plus share of guard gratuity",
          postingStyle: "Exchange Bulletin",
          issuer: "High Factor Dorel",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token carrying 2-star exchange stamp",
        },
      ),
      createQuest(
        "Market Manipulator Sting",
        "Exchange tribunes suspect a noble syndicate of fixing salt prices and request covert proof.",
        {
          location: "Mercantile Exchange",
          requirements: [
            "Investigation 26+ or Insight 24+",
            "Guild Rank: Exchange Tribune Agent or Adventurers' Guild Silver",
            "Silver token with 3 stars—stamps cleared on promotion.",
          ],
          conditions: [
            "Pose as brokers for three market bells to gather evidence",
            "Report findings to tribunal chamber before dusk",
          ],
          timeline: "Two-day covert assignment",
          risks: [
            "Powerful nobles may retaliate",
            "False evidence results in tribunal fines",
          ],
          reward: "35 sp and tribunal favor for future contracts",
          postingStyle: "Tribunal Mandate",
          issuer: "Exchange Tribunal",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 3-star tribunal seal",
        },
      ),
    ],
  },
  {
    name: "Master Jeweler's Guildhall",
    category: "craft",
    scale: {
      tier: 'strategic',
      label: "Royal Gem Atelier (Strategic)",
      rationale:
        "The guildhall cuts noble gems, fashions regalia, and certifies jewels traded across the kingdom.",
      output:
        "Cut gemstones, gilded regalia, and certification seals recognized by the crown.",
    },
    production: {
      goods: ["cut gems", "ornate regalia", "gem certificates"],
      notes:
        "Lapidarists, engravers, and enchant-smiths work in sealed ateliers under constant guard.",
    },
    workforce: {
      description:
        "The guild employs apprentices for polishing, journeymen for settings, and masters for royal commissions.",
      normal: [
        unskilled(8, "lapidary apprentices, polishing runners"),
        skilled(18, "journeyman gemcutters, engravers, setters"),
        specialist(7, "master lapidarists, goldsmiths, arcane appraisers"),
      ],
    },
    laborConditions: [
      {
        trigger: "Royal regalia commissions",
        season: "Declared during court season",
        description:
          "When the crown demands regalia, the guild operates day and night with master oversight.",
        staffing: [
          skilled(10, "journeymen trusted with precious stones"),
          specialist(3, "master appraisers to certify each cut"),
        ],
      },
      {
        trigger: "Vault audit after attempted theft",
        season: "At need",
        description:
          "If thieves strike, the hall calls for trusted guards and gemwrights to verify no stones were switched.",
        staffing: [
          skilled(6, "appraisers to compare ledgers"),
          specialist(2, "enchanters to sense tampering"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Gemcutting Vigil",
        "Master Jeweler Serapha requires deft hands to polish fire opals while guildmasters certify each facet.",
        {
          location: "Master Jeweler's Guildhall",
          requirements: [
            "Dexterity 16+ with proficiency in jeweler's tools or smithing 24+",
            "Guild Rank: Jeweler Journeyman or Adventurers' Guild Silver",
            "Silver token marked with 2 stars (marks expunged when advancing).",
          ],
          conditions: [
            "Eight-bell shifts under jewel-ward lamps",
            "Masters inspect every stone before setting",
          ],
          timeline: "Four-day vigil",
          risks: [
            "Cutting errors destroy costly stones",
            "Guild fines if schedule slips",
          ],
          reward: "28 sp plus workshop favor for future commissions",
          postingStyle: "Guild Atelier Posting",
          issuer: "Master Jeweler Serapha",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star jeweler sigil",
        },
      ),
      createQuest(
        "Vaulted Regalia Escort",
        "A coronation diadem must reach the Governor's Keep under heavy guard.",
        {
          location: "Master Jeweler's Guildhall",
          requirements: [
            "Perception 24+ and proficiency with heavy armor or defensive magic",
            "Guild Rank: Jeweler Master Guard or Adventurers' Guild Silver",
            "Silver token bearing 3 stars—stars cleared upon promotion.",
          ],
          conditions: [
            "Two bells of silent march through Upper Ward",
            "No stops allowed; guildmaster accompanies convoy",
          ],
          timeline: "Single-evening escort",
          risks: [
            "Assassins or thieves coveting the diadem",
            "Political scandal if gem arrives late",
          ],
          reward: "36 sp and personal note from the guildmaster",
          postingStyle: "Guild Guard Writ",
          issuer: "Guildmaster Corvel",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 3-star guild guard seal",
        },
      ),
    ],
  },
  {
    name: "Highward Vintners' Salon",
    category: "support",
    scale: {
      tier: 'regional',
      label: "Noble Vintage Salon (Regional)",
      rationale:
        "The salon curates vintages for the noble terraces and arranges expeditions for rare coastal grapes.",
      output:
        "Curated vintages, pairing banquets, and noble wine contracts.",
    },
    production: {
      goods: ["reserve vintages", "pairing menus", "wine contracts"],
      notes:
        "Sommeliers and stewards maintain cellars, while contracted adventurers secure rare harvests.",
    },
    workforce: {
      description:
        "Cellar hands, sommeliers, and banquet stewards labor to satisfy noble palates.",
      normal: [
        unskilled(9, "cellar hands, cask rollers"),
        skilled(14, "sommeliers, banquet stewards, tasters"),
        specialist(3, "vintner-mages who stabilize rare vintages"),
      ],
    },
    laborConditions: [
      {
        trigger: "Noble wedding feasts",
        season: "High summer",
        description:
          "Grand banquets require extra stewards and tasters to guard against spoilage or poison.",
        staffing: [
          skilled(8, "banquet stewards for silver service"),
          specialist(2, "tasters to test each cask"),
        ],
      },
      {
        trigger: "Rare grape expeditions",
        season: "Late autumn coastal bloom",
        description:
          "Sea cliffs produce rare grapes under moonlight; the salon hires trusted crews to harvest before gulls arrive.",
        staffing: [
          skilled(6, "cliff harvesters familiar with rope work"),
          specialist(1, "vintner-mage to stabilize grapes on site"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Reserve Vintage Steward",
        "The salon requires quiet attendants to manage a noble tasting without alerting rival houses.",
        {
          location: "Highward Vintners' Salon",
          requirements: [
            "Etiquette and Persuasion 18+",
            "Guild Rank: Sommeliers' Circle Steward or Adventurers' Guild Bronze",
            "Bronze token with 2-star hospitality stamp; promotion clears the mark.",
          ],
          conditions: [
            "Six-course tasting over two bells",
            "Guests monitored for tampering and intoxication",
          ],
          timeline: "Single evening",
          risks: [
            "Poison attempts by rivals",
            "Noble displeasure if pairings falter",
          ],
          reward: "5 sp plus bottle of reserve vintage",
          postingStyle: "Salon Steward Notice",
          issuer: "Sommelier Liora",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 2-star hospitality stamp",
        },
      ),
      createQuest(
        "Moonlit Cloudberry Expedition",
        "A rare cloudberry patch ripens atop cliffside terraces; the salon funds a guarded harvest.",
        {
          location: "Highward Vintners' Salon",
          requirements: [
            "Survival or Athletics 22+ for cliff work",
            "Guild Rank: Vintners' Guild Journeyman or Adventurers' Guild Silver",
            "Silver token marked with 2 stars—marks reset upon promotion.",
          ],
          conditions: [
            "Night harvest under rope belays",
            "Casks escorted back before dawn to prevent spoilage",
          ],
          timeline: "Single night",
          risks: [
            "Falling hazards on slick cliffs",
            "Raiders seeking to ransom the harvest",
          ],
          reward: "18 sp plus future tasting invitation",
          postingStyle: "Vintner's Expedition Bill",
          issuer: "Sommelier Liora",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star vintner seal",
        },
      ),
    ],
  },
  {
    name: "Aurelian Apothecarium & Perfumery",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "Upper Ward Atelier (Regional)",
      rationale:
        "The apothecarium distills rare essences for nobles and supplies refined alchemical reagents to the court.",
      output:
        "Distilled perfumes, restorative draughts, and alchemical essences for the governor's table.",
    },
    production: {
      goods: ["perfumed essences", "restorative draughts", "alchemical distillates"],
      notes:
        "Perfumiers and alchemists share kiln rooms; mishaps can sour entire cellars.",
    },
    workforce: {
      description:
        "Still-wardens, essence blenders, and alchemical scribes coordinate delicate distillations.",
      normal: [
        unskilled(6, "glass polishers, vial runners"),
        skilled(16, "essence blenders, recipe scribes"),
        specialist(5, "master alchemists and scentmancers"),
      ],
    },
    laborConditions: [
      {
        trigger: "Perfume festival orders",
        season: "Early summer",
        description:
          "Nobles demand bespoke scents, requiring overtime distillations and trusted testers.",
        staffing: [
          skilled(8, "distillers to tend copper alembics"),
          specialist(2, "scentmancers to balance volatile essences"),
        ],
      },
      {
        trigger: "Plague scare or noble illness",
        season: "Emergency",
        description:
          "Restorative draughts must be brewed under quarantine protocols; only vetted alchemists admitted.",
        staffing: [
          skilled(6, "draught brewers for long vigils"),
          specialist(2, "master alchemists overseeing purity"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Essence Distillation Vigil",
        "Mistress Aurelia invites patient assistants to tend midnight distillations while the salon prepares festival orders.",
        {
          location: "Aurelian Apothecarium & Perfumery",
          requirements: [
            "Alchemy proficiency 24+ or Herbalism 22+",
            "Guild Rank: Apothecaries' Circle Journeyman or Adventurers' Guild Bronze",
            "Bronze token with 2 stars; stars clear when you rise in rank.",
          ],
          conditions: [
            "Tend alembics across two midnight bells",
            "Log every dram in goldleaf ledger",
          ],
          timeline: "Three-night vigil",
          risks: [
            "Burns from volatile essences",
            "Fines for spillage",
          ],
          reward: "6 sp per night plus vial of calming essence",
          postingStyle: "Apothecary's Posting",
          issuer: "Mistress Aurelia",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 2-star apothecary stamp",
        },
      ),
      createQuest(
        "Dreamblossom Procurement",
        "A noble heir requires dreamblossom petals harvested from mist-clad terraces beyond the Upper Ward.",
        {
          location: "Aurelian Apothecarium & Perfumery",
          requirements: [
            "Nature or Survival 24+",
            "Guild Rank: Apothecaries' Circle Senior or Adventurers' Guild Silver",
            "Silver token marked with 2 stars—marks erased upon promotion.",
          ],
          conditions: [
            "Harvest petals before dawn and transport them in chilled cases",
            "Deliver directly to the apothecarium without detour",
          ],
          timeline: "Single predawn excursion",
          risks: [
            "Poisonous thorns and rival apothecaries",
            "Spoilage if petals warm",
          ],
          reward: "16 sp plus vial of dreamblossom tonic",
          postingStyle: "Guild Procurement Bill",
          issuer: "Mistress Aurelia",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star apothecary seal",
        },
      ),
    ],
  },
];

const WAVES_BREAK_UPPER_WARD_QUEST_BOARDS = buildQuestBoardMap(
  WAVES_BREAK_UPPER_WARD_BUSINESSES,
);

const WAVES_BREAK_LITTLE_TERNS_BUSINESSES: BusinessProfile[] = [
  {
    name: "Guild of Smiths",
    category: "craft",
    scale: {
      tier: 'strategic',
      label: "Master Forge Complex (Strategic)",
      rationale:
        "The Guild of Smiths supplies arms, tools, and city infrastructure with mastercrafted metalwork.",
      output:
        "Weapons, armor, agricultural tools, and architectural fittings for Wave's Break and beyond.",
    },
    production: {
      goods: ["weapons", "armor", "tools"],
      notes:
        "Forge halls run around the clock; apprentices pump bellows while masters temper contracts for nobles and the guard.",
    },
    workforce: {
      description:
        "Bellows crews, journeyman smiths, and master temperers toil in heat and sparks throughout Little Terns.",
      normal: [
        unskilled(24, "bellows hands, coal shovelers, quench carriers"),
        skilled(20, "journeyman bladesmiths, armorers, toolwrights"),
        specialist(8, "master temperers, alloy savants, inspection provosts"),
      ],
    },
    laborConditions: [
      {
        trigger: "Guard refit orders",
        season: "Late winter",
        description:
          "The guard refits arms before spring patrols, requiring overtime temper lines and hafting crews.",
        staffing: [
          unskilled(12, "coal runners for continuous fires"),
          skilled(10, "journeymen to set rivets and sharpen edges"),
        ],
      },
      {
        trigger: "High ward festival commissions",
        season: "Autumn court season",
        description:
          "Nobles demand ceremonial armor and filigreed steel, calling for master temperers and engravers.",
        staffing: [
          skilled(8, "engravers to etch heraldry"),
          specialist(3, "masters to temper rare alloys"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Forge Coal Rush",
        "The guild needs sturdy backs to keep the furnaces hot while new guard spears are drawn.",
        {
          location: "Guild of Smiths",
          requirements: [
            "Endurance to haul coal sacks",
            "Guild Rank: Smiths' Guild Laborer or Adventurers' Guild Bronze",
            "Bronze token with 1-star labor stamp; promotion clears the mark.",
          ],
          conditions: [
            "Twelve-bell shifts shoveling coal and pumping bellows",
            "Heat breaks required every two bells",
          ],
          timeline: "Four-day refit rush",
          risks: [
            "Burns from cinders",
            "Wages docked for unbanked fires",
          ],
          reward: "2 sp per shift plus forge meal",
          postingStyle: "Guild Furnace Bill",
          issuer: "Forge Captain Brakka",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star labor stamp",
        },
      ),
      createQuest(
        "Masterwork Temper Vigil",
        "Master Hadrin calls for proven artisans to oversee tempering of a ceremonial blade for the Upper Ward.",
        {
          location: "Guild of Smiths",
          requirements: [
            "Blacksmithing proficiency 30+ or Smith's Tools mastery",
            "Guild Rank: Smiths' Guild Journeyman or Adventurers' Guild Silver",
            "Silver token marked with 2 stars—marks wiped when advanced.",
          ],
          conditions: [
            "Overnight tempering sequence under master supervision",
            "Daily report to the Hall of Records on alloy expenditure",
          ],
          timeline: "Three-night vigil",
          risks: [
            "Warped blade forfeits payment",
            "Sabotage attempts from jealous rivals",
          ],
          reward: "26 sp plus future commission priority",
          postingStyle: "Guild Masterwork Notice",
          issuer: "Master Hadrin",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star smithing seal",
        },
      ),
    ],
  },
  {
    name: "Timberwave Carpenters' Guild",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "Guild Carpentry Yards (Regional)",
      rationale:
        "The carpenters frame homes, wagons, and ship interiors for Wave's Break and inland caravans.",
      output:
        "Framed structures, wagon bodies, and custom cabinetry for trade ships.",
    },
    production: {
      goods: ["timber frames", "wagons", "cabinetry"],
      notes:
        "Sawyers, joiners, and finishers keep the yards humming as guild masters bid on major contracts.",
    },
    workforce: {
      description:
        "Fresh timbers arrive daily; crews plane beams, set joints, and finish cabinetry for the city's demands.",
      normal: [
        unskilled(20, "sawyers, lumber haulers, pitch sweepers"),
        skilled(18, "joiners, finish carpenters, wagonwrights"),
        specialist(5, "master framers and patternmakers"),
      ],
    },
    laborConditions: [
      {
        trigger: "Spring housing expansions",
        season: "Spring",
        description:
          "New families settle near the walls, requiring extra framing crews and scaffolders.",
        staffing: [
          unskilled(10, "scaffold teams and timber haulers"),
          skilled(8, "framers to raise beams"),
        ],
      },
      {
        trigger: "Adventurer wagon commissions",
        season: "Late summer",
        description:
          "Caravaners order reinforced wagons for the autumn push, requiring trusted carpenters and wheelwrights.",
        staffing: [
          skilled(6, "wagonwrights to fit axles"),
          specialist(2, "patternmakers to sign off on reinforced joints"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Rafter Loft Assembly",
        "Guildmistress Tella seeks agile carpenters to loft rafters for a new guildhouse wing.",
        {
          location: "Timberwave Carpenters' Guild",
          requirements: [
            "Carpentry proficiency 20+",
            "Guild Rank: Carpenters' Guild Apprentice or Adventurers' Guild Bronze",
            "Bronze token with 1-star builder stamp; promotion purges stamps.",
          ],
          conditions: [
            "Daylight shifts atop scaffolds",
            "Storm tarps deployed each dusk",
          ],
          timeline: "Five-day build",
          risks: [
            "Falls from scaffold",
            "Guild fines for warped beams",
          ],
          reward: "3 sp per day plus timber voucher",
          postingStyle: "Carpenter's Call",
          issuer: "Guildmistress Tella",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star builder stamp",
        },
      ),
      createQuest(
        "Royal Coach Commission",
        "The governor ordered a gilded coach; the guild needs veterans to oversee joinery and finish.",
        {
          location: "Timberwave Carpenters' Guild",
          requirements: [
            "Carpentry proficiency 32+ or Vehicles (land) 25+",
            "Guild Rank: Carpenters' Guild Journeyman or Adventurers' Guild Silver",
            "Silver token stamped with 2 stars—stamps clear upon promotion.",
          ],
          conditions: [
            "Two-week project with nightly security",
            "Inspection each dawn by Upper Ward steward",
          ],
          timeline: "Fourteen-day commission",
          risks: [
            "Delays incur penalty clauses",
            "Sabotage from rival workshops",
          ],
          reward: "45 sp upon delivery and coach insignia pin",
          postingStyle: "Guild Commission Posting",
          issuer: "Guildmistress Tella",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star carpenter seal",
        },
      ),
    ],
  },
  {
    name: "Carvers' and Fletchers' Hall",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "Bowyer Collective (Regional)",
      rationale:
        "The hall fashions bows, arrows, and carved works for hunters, guards, and nobles.",
      output:
        "Longbows, crossbow stocks, hunting arrows, and carved ornaments.",
    },
    production: {
      goods: ["bows", "arrows", "carved ornamentation"],
      notes:
        "Seasoned yew and hardwoods are cured in special lofts; fletchers work in shifts to meet guard quotas.",
    },
    workforce: {
      description:
        "Woodcarvers, fletchers, and finishing artists share the hall, each bound by strict guild quotas.",
      normal: [
        unskilled(12, "shaft sanders, feather sorters"),
        skilled(22, "bowyers, fletchers, carvers"),
        specialist(4, "master bow engineers and rune-etchers"),
      ],
    },
    laborConditions: [
      {
        trigger: "Guard requisition",
        season: "Late spring",
        description:
          "City guard demands arrow stockpiles before the caravan season, requiring double shifts.",
        staffing: [
          unskilled(8, "shaft sanders for night shift"),
          skilled(10, "fletchers to finish flights"),
        ],
      },
      {
        trigger: "Noble hunting season",
        season: "Autumn",
        description:
          "Nobles order fine bows and carved gifts, calling for master artisans and discreet security.",
        staffing: [
          skilled(7, "bowyers for custom draws"),
          specialist(2, "rune-etchers to personalize gifts"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Arrow Rush Muster",
        "Fletcher foremen hire rapid hands to finish a guard arrow requisition before the caravan muster.",
        {
          location: "Carvers' and Fletchers' Hall",
          requirements: [
            "Weaving or Textiles proficiency 16+ for fletching",
            "Guild Rank: Fletchers' Guild Novice or Adventurers' Guild Bronze",
            "Bronze token with 1-star fletching stamp; promotion resets stamp.",
          ],
          conditions: [
            "Eight-bell shifts gluing and binding flights",
            "Quality inspector checks every bundle",
          ],
          timeline: "Three-day rush",
          risks: [
            "Glue fumes",
            "Docked pay for misaligned flights",
          ],
          reward: "2 sp per shift plus bundle of practice shafts",
          postingStyle: "Fletcher's Muster",
          issuer: "Foreman Kale",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star fletching stamp",
        },
      ),
      createQuest(
        "Starlit Bow Commission",
        "A noble house requests a rune-etched bow; the hall needs trusted artisans to oversee the work.",
        {
          location: "Carvers' and Fletchers' Hall",
          requirements: [
            "Carving proficiency 28+ or Arcana 24+ for rune seats",
            "Guild Rank: Bowyers' Guild Journeyman or Adventurers' Guild Silver",
            "Silver token with 2 stars—stars clear on promotion.",
          ],
          conditions: [
            "Work completed in sealed atelier",
            "Client inspection each dusk",
          ],
          timeline: "Seven-day commission",
          risks: [
            "Runes misaligned ruin the bow",
            "Noble displeasure results in forfeited pay",
          ],
          reward: "30 sp plus invitation to the noble hunt",
          postingStyle: "Bowyer Commission Bill",
          issuer: "Guildmaster Eliane",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star bowyer seal",
        },
      ),
    ],
  },
  {
    name: "The Gilded Needle Clothiers",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "High Fashion Atelier (Regional)",
      rationale:
        "The Gilded Needle outfits nobles and affluent merchants, employing dozens of seamstresses and tailors.",
      output:
        "Custom garments, courtly attire, and ceremonial robes.",
    },
    production: {
      goods: ["formalwear", "court robes", "tailored uniforms"],
      notes:
        "Tailors work by appointment; cloth from across the world flows through the atelier.",
    },
    workforce: {
      description:
        "Pattern cutters, stitchers, and embroiderers craft garments to precise noble specifications.",
      normal: [
        unskilled(14, "pressers, runners, thread tenders"),
        skilled(24, "tailors, embroiderers, pattern cutters"),
        specialist(5, "master designers and fabric mages"),
      ],
    },
    laborConditions: [
      {
        trigger: "Court season wardrobe changes",
        season: "Autumn",
        description:
          "Nobles reorder entire wardrobes ahead of court openings, requiring overnight fitting circles.",
        staffing: [
          skilled(12, "tailors to run late fittings"),
          specialist(2, "designers to approve patterns"),
        ],
      },
      {
        trigger: "Festival pageantry",
        season: "Spring",
        description:
          "Parades and pageants demand elaborate costumes, calling for textile masters and dye mages.",
        staffing: [
          skilled(10, "costumers and dyers"),
          specialist(3, "fabric mages to weave illusions"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Festival Wardrobe Hands",
        "Mistress Seraphine requires nimble fingers to finish festival wardrobes before the banners are unfurled.",
        {
          location: "The Gilded Needle Clothiers",
          requirements: [
            "Tailoring or Textiles proficiency 20+",
            "Guild Rank: Clothiers' Guild Apprentice or Adventurers' Guild Bronze",
            "Bronze token with 2-star tailor stamp—stamps void on promotion.",
          ],
          conditions: [
            "Late-night stitching circles",
            "Needlework inspected hourly",
          ],
          timeline: "One tenday",
          risks: [
            "Finger pricks and eye strain",
            "Deductions for missewn seams",
          ],
          reward: "3 sp per night plus offcut silk",
          postingStyle: "Tailor's Rush Bill",
          issuer: "Mistress Seraphine",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 2-star tailor stamp",
        },
      ),
      createQuest(
        "Silk Wardens",
        "A royal envoy demands secure transport of rare silks from the docks to the atelier.",
        {
          location: "The Gilded Needle Clothiers",
          requirements: [
            "Perception 22+ and proficiency with light armor or defensive magic",
            "Guild Rank: Clothiers' Guild Senior Steward or Adventurers' Guild Silver",
            "Silver token with 2 stars—marks reset when promoted.",
          ],
          conditions: [
            "Escort bolt wagons through Little Terns at dawn",
            "Report to the Hall of Records upon delivery",
          ],
          timeline: "Single dawn escort",
          risks: [
            "Cutpurses targeting the silks",
            "Damaged bolts docked from pay",
          ],
          reward: "14 sp plus tailoring credit",
          postingStyle: "Clothier's Escort Notice",
          issuer: "Mistress Seraphine",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star clothier seal",
        },
      ),
    ],
  },
  {
    name: "Brine & Bark Tannery",
    category: "processing",
    scale: {
      tier: 'regional',
      label: "Leatherworks Consortium (Regional)",
      rationale:
        "The tannery processes hides for armorers, saddlers, and sailmakers across Wave's Break.",
      output:
        "Tanned leather, oiled hides, and specialty treated pelts.",
    },
    production: {
      goods: ["tanned leather", "saddlery hides", "treated pelts"],
      notes:
        "Soaking pits, bark barrels, and drying lofts operate in careful sequence to avoid spoilage.",
    },
    workforce: {
      description:
        "Pit workers, curriers, and finishers labor amid pungent fumes to deliver high-grade leather.",
      normal: [
        unskilled(26, "pit stirrers, lime slakers, hide turners"),
        skilled(16, "curriers, stretchers, oilers"),
        specialist(4, "master leatherwrights and quality inspectors"),
      ],
    },
    laborConditions: [
      {
        trigger: "Storm-soaked hide influx",
        season: "Autumn storms",
        description:
          "Wet markets flood the tannery with raw hides that must be processed quickly to avoid rot.",
        staffing: [
          unskilled(14, "pit crews for continuous stirring"),
          skilled(6, "curriers to stretch hides"),
        ],
      },
      {
        trigger: "Upper Ward commission",
        season: "At need",
        description:
          "Nobles order supple leathers for finery, requiring master finishers and secure storage.",
        staffing: [
          skilled(5, "finishers to burnish hides"),
          specialist(2, "quality masters to stamp seals"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Hide Soak Rotation",
        "Tannery steward Pell hires hardy hands to keep pits stirred during a surge of storm-wet hides.",
        {
          location: "Brine & Bark Tannery",
          requirements: [
            "Tolerance for fumes and strength to turn hides",
            "Guild Rank: Tanners' Guild Laborer or Adventurers' Guild Bronze",
            "Bronze token with 1-star tannery stamp; stamp clears on promotion.",
          ],
          conditions: [
            "Six-bell shifts stirring pits",
            "Protective salves applied before each shift",
          ],
          timeline: "Storm week",
          risks: [
            "Chemical burns",
            "Spoiled hides docked from pay",
          ],
          reward: "2 sp per shift plus cured leather scraps",
          postingStyle: "Tannery Bill",
          issuer: "Steward Pell",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star tannery stamp",
        },
      ),
      createQuest(
        "Royal Leather Curation",
        "The governor's household requests supple leather; the tannery needs trusted curriers to finish and guard the shipment.",
        {
          location: "Brine & Bark Tannery",
          requirements: [
            "Leatherworking proficiency 26+",
            "Guild Rank: Tanners' Guild Journeyman or Adventurers' Guild Silver",
            "Silver token with 2 stars—stars expunged on promotion.",
          ],
          conditions: [
            "Three nights of finishing and sealing hides",
            "Escort sealed crates to the Upper Ward each dawn",
          ],
          timeline: "Three-night commission",
          risks: [
            "Spoilage if humidity control fails",
            "Theft attempts en route",
          ],
          reward: "24 sp plus stamped leather allowance",
          postingStyle: "Tannery Commission",
          issuer: "Steward Pell",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star tannery seal",
        },
      ),
    ],
  },
  {
    name: "Seawind Sailmakers' Hall",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "Sailmaker Cooperative (Regional)",
      rationale:
        "The hall weaves and stitches sails for the harbor fleet, merchant ships, and naval contracts.",
      output:
        "Square sails, storm canvas, and custom pennants sized for the fleet.",
    },
    production: {
      goods: ["sails", "storm canvas", "naval pennants"],
      notes:
        "Lofts stretch cloth across long tables; crews work in shifts to meet tidal launch schedules.",
    },
    workforce: {
      description:
        "Sailcloth carders, stitchers, and rigging testers labor in the cooperative to keep the fleet supplied.",
      normal: [
        unskilled(18, "cloth beaters, loom tenders, tar pot carriers"),
        skilled(20, "sail stitchers, pattern cutters, ropemakers"),
        specialist(5, "naval gauge masters and wind mages"),
      ],
    },
    laborConditions: [
      {
        trigger: "Storm damage replacements",
        season: "Autumn storms",
        description:
          "Damaged sails pour in after gales, demanding overtime stitching and tar sealing.",
        staffing: [
          unskilled(10, "tar pot carriers for night shifts"),
          skilled(12, "stitchers to patch tears"),
        ],
      },
      {
        trigger: "Admiralty inspection",
        season: "Quarterly",
        description:
          "Royal inspectors demand precise gauge; gauge masters and testers must certify each sail.",
        staffing: [
          skilled(6, "pattern cutters to meet specification"),
          specialist(3, "gauge masters to certify cloth"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Storm Sail Menders",
        "The cooperative calls for deft stitchers to mend storm-torn sails before the fleet departs again.",
        {
          location: "Seawind Sailmakers' Hall",
          requirements: [
            "Weaving or Textiles proficiency 22+",
            "Guild Rank: Sailmakers' Cooperative Hand or Adventurers' Guild Bronze",
            "Bronze token with 2-star sailmaker stamp; promotion clears stamp.",
          ],
          conditions: [
            "Ten-bell shifts in tar-scented lofts",
            "Gauge master reviews each patch",
          ],
          timeline: "Four-day rush",
          risks: [
            "Needle injuries",
            "Loss docked for missed deadlines",
          ],
          reward: "3 sp per shift plus spool of sail thread",
          postingStyle: "Sailmaker's Rush",
          issuer: "Forewoman Maris",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 2-star sailmaker stamp",
        },
      ),
      createQuest(
        "Admiralty Canvas Commission",
        "Royal contracts demand flawless storm canvas; the cooperative seeks veteran artisans to oversee quality.",
        {
          location: "Seawind Sailmakers' Hall",
          requirements: [
            "Weaving or Textiles proficiency 30+",
            "Guild Rank: Sailmakers' Cooperative Senior or Adventurers' Guild Silver",
            "Silver token bearing 2 stars—stars erase upon promotion.",
          ],
          conditions: [
            "Seven-day inspection cycle with Admiralty gauge",
            "Daily logs delivered to the Harbor Guard naval yard",
          ],
          timeline: "Seven-day commission",
          risks: [
            "Fines for improper gauge",
            "Political pressure from rival sail lofts",
          ],
          reward: "28 sp plus cooperative dividend",
          postingStyle: "Admiralty Cloth Order",
          issuer: "Forewoman Maris",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star sailmaker seal",
        },
      ),
    ],
  },
];

const WAVES_BREAK_LITTLE_TERNS_QUEST_BOARDS = buildQuestBoardMap(
  WAVES_BREAK_LITTLE_TERNS_BUSINESSES,
);

const WAVES_BREAK_GREENSOUL_HILL_BUSINESSES: BusinessProfile[] = [
  {
    name: "Grand Library of Wave's Break",
    category: "support",
    scale: {
      tier: 'strategic',
      label: "Scholars' Bastion (Strategic)",
      rationale:
        "The Grand Library collects tomes from across the realm, training sages and preserving lore for the crown.",
      output:
        "Curated archives, research assistance, and scholarly treatises for the city and visiting mages.",
    },
    production: {
      goods: ["archived tomes", "research notes", "cataloged scrolls"],
      notes:
        "Copyists, lorekeepers, and custodians maintain the stacks; rare collections require constant vigilance.",
    },
    workforce: {
      description:
        "Scribes, loremasters, and preservationists care for fragile tomes while guiding scholars through the stacks.",
      normal: [
        unskilled(10, "stack runners, lantern tenders"),
        skilled(24, "copyists, lorekeepers, reference scribes"),
        specialist(6, "archivist-mages, curators of restricted stacks"),
      ],
    },
    laborConditions: [
      {
        trigger: "Festival influx of scholars",
        season: "Summer academic season",
        description:
          "Visiting scholars flood the stacks, requiring extra guides and preservationists to protect fragile works.",
        staffing: [
          skilled(10, "reference scribes to guide visitors"),
          specialist(2, "archivists supervising restricted access"),
        ],
      },
      {
        trigger: "Storm-damaged manuscripts",
        season: "Autumn storms",
        description:
          "Water-damaged books need drying and restoration under the eye of master preservers.",
        staffing: [
          skilled(6, "restoration clerks"),
          specialist(2, "preservation mages"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Restricted Stack Vigil",
        "Head Archivist Ilvara requests quiet guardians to monitor scholars within the sealed stacks.",
        {
          location: "Grand Library of Wave's Break",
          requirements: [
            "History or Arcana 20+",
            "Guild Rank: Librarians' Circle Adept or Adventurers' Guild Bronze",
            "Bronze token with 2-star scholar stamp; promotion clears stamp.",
          ],
          conditions: [
            "Six-hour shifts monitoring restricted carrels",
            "Confiscate forbidden copying implements",
          ],
          timeline: "Five-day academic convocation",
          risks: [
            "Scholars bribing for extra time",
            "Censure if tomes are damaged",
          ],
          reward: "4 sp per shift plus research chit",
          postingStyle: "Archivist's Vigil",
          issuer: "Head Archivist Ilvara",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 2-star scholar stamp",
        },
      ),
      createQuest(
        "Lost Tome Retrieval",
        "An ancient ledger vanished into the catacombs beneath the stacks; trusted explorers must recover it.",
        {
          location: "Grand Library of Wave's Break",
          requirements: [
            "Investigation 24+ or Arcana 22+",
            "Guild Rank: Librarians' Circle Master or Adventurers' Guild Silver",
            "Silver token with 2 stars—stamps reset upon promotion.",
          ],
          conditions: [
            "Navigate sealed passageways beneath the library",
            "Return the tome before the next dawn bell",
          ],
          timeline: "Single-night delve",
          risks: [
            "Arcane traps and dust wraiths",
            "Loss of the tome results in heavy fines",
          ],
          reward: "20 sp plus restricted reading access",
          postingStyle: "Library Retrieval Order",
          issuer: "Head Archivist Ilvara",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star scholar seal",
        },
      ),
    ],
  },
  {
    name: "Arcanists' Enclave",
    category: "support",
    scale: {
      tier: 'strategic',
      label: "Mage Collegium (Strategic)",
      rationale:
        "The enclave trains battle-mages, researches wards, and supports the city's magical defenses.",
      output:
        "Spell research, defensive wards, and trained arcanists for the governor and guilds.",
    },
    production: {
      goods: ["spell diagrams", "protective wards", "magical treatises"],
      notes:
        "Circle masters oversee apprentices in rune halls; any miscast can threaten the district.",
    },
    workforce: {
      description:
        "Apprentices, journeyman mages, and circle masters collaborate on rituals and magical research.",
      normal: [
        unskilled(6, "golem attendants, reagent porters"),
        skilled(20, "journeyman mages, ritual scribes"),
        specialist(8, "circle masters, ward architects"),
      ],
    },
    laborConditions: [
      {
        trigger: "Leyline fluctuation",
        season: "Spring equinox",
        description:
          "Shifting leylines demand extra warders and watchers to stabilize protective spells.",
        staffing: [
          skilled(10, "ritual scribes for constant sigil checks"),
          specialist(3, "ward architects to recalibrate circles"),
        ],
      },
      {
        trigger: "Summoning symposia",
        season: "Summer conclave",
        description:
          "Visiting mages attempt experimental summons, requiring containment specialists and scribes.",
        staffing: [
          skilled(8, "containment warders"),
          specialist(4, "circle masters to arbitrate"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Sigil Stabilization Circle",
        "Archmage Selene needs deft casters to reinforce a faltering ward before the next ley surge.",
        {
          location: "Arcanists' Enclave",
          requirements: [
            "Arcana 26+ or Enchanting proficiency 24+",
            "Guild Rank: Arcanists' Circle Adept or Adventurers' Guild Silver",
            "Silver token with 2 stars—stamps wiped on promotion.",
          ],
          conditions: [
            "Stand vigil within the ward for three bells",
            "Recite stabilization mantra each half bell",
          ],
          timeline: "Single-night ritual",
          risks: [
            "Arcane backlash",
            "Sanctions if ritual fails",
          ],
          reward: "22 sp plus enclave favor",
          postingStyle: "Circle Reinforcement Writ",
          issuer: "Archmage Selene",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star arcanist seal",
        },
      ),
      createQuest(
        "Ley Survey Expedition",
        "Surveyors must chart new ley currents beyond the city; the enclave seeks mages with steady nerves.",
        {
          location: "Arcanists' Enclave",
          requirements: [
            "Arcana 24+ and Survival 18+",
            "Guild Rank: Arcanists' Circle Senior or Adventurers' Guild Silver",
            "Silver token with 3 stars—marks clear when rank rises.",
          ],
          conditions: [
            "Three-day trek through ley-scarred wilds",
            "Report nightly via sending stone",
          ],
          timeline: "Three-day expedition",
          risks: [
            "Ley storms",
            "Hostile spirits",
          ],
          reward: "35 sp plus access to enclave spell vault",
          postingStyle: "Ley Survey Charter",
          issuer: "Archmage Selene",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 3-star arcanist survey stamp",
        },
      ),
    ],
  },
  {
    name: "Herbal Conservatory",
    category: "support",
    scale: {
      tier: 'regional',
      label: "Sacred Garden Conservatory (Regional)",
      rationale:
        "The conservatory cultivates rare herbs for healers, alchemists, and temple rites.",
      output:
        "Medicinal herbs, ritual components, and botanical research.",
    },
    production: {
      goods: ["healing herbs", "ritual flowers", "botanical studies"],
      notes:
        "Glasshouse keepers regulate humidity and light; plague scares require disciplined staff.",
    },
    workforce: {
      description:
        "Gardeners, herbalists, and druidic wardens tend delicate plants and safeguard sacred seeds.",
      normal: [
        unskilled(12, "soil tenders, watering crews"),
        skilled(18, "herbalists, greenhouse keepers"),
        specialist(4, "druid wardens, botanical sages"),
      ],
    },
    laborConditions: [
      {
        trigger: "Heatwave dehydration",
        season: "High summer",
        description:
          "Glasshouses overheat, demanding extra water crews and shade wardens.",
        staffing: [
          unskilled(10, "watering crews on rotation"),
          skilled(6, "herbalists monitoring wilt"),
        ],
      },
      {
        trigger: "Moonblossom bloom",
        season: "Early autumn",
        description:
          "Moonblossoms bloom for one night, requiring trusted harvesters and druid wardens.",
        staffing: [
          skilled(8, "harvesters trained in delicate cuts"),
          specialist(2, "druid wardens to guide moonlight"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Greenhouse Steward Watch",
        "Conservator Mera seeks patient gardeners to rotate damp cloths and shade frames during the heatwave.",
        {
          location: "Herbal Conservatory",
          requirements: [
            "Herbalism proficiency 18+ or Nature 16+",
            "Guild Rank: Herbalists' Circle Novice or Adventurers' Guild Bronze",
            "Bronze token with 1-star herbal stamp; promotion clears stamp.",
          ],
          conditions: [
            "Four-hour rotations in glasshouses",
            "Humidity logs submitted each bell",
          ],
          timeline: "Five-day heatwave",
          risks: [
            "Heat exhaustion",
            "Crop loss if schedules slip",
          ],
          reward: "2 sp per rotation plus bundle of common herbs",
          postingStyle: "Conservatory Steward Bill",
          issuer: "Conservator Mera",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star herbal stamp",
        },
      ),
      createQuest(
        "Moonblossom Harvest",
        "The druids need calm hands to harvest moonblossoms for temple rites before dawn.",
        {
          location: "Herbal Conservatory",
          requirements: [
            "Herbalism proficiency 24+",
            "Guild Rank: Herbalists' Circle Journeyman or Adventurers' Guild Silver",
            "Silver token with 2 stars—marks reset upon promotion.",
          ],
          conditions: [
            "Night harvest guided by druid wardens",
            "Deliver petals to the Temple of the Tides before dawn",
          ],
          timeline: "Single night",
          risks: [
            "Delicate blooms bruise easily",
            "Moon predators drawn to scent",
          ],
          reward: "16 sp plus vial of moonblossom tonic",
          postingStyle: "Moonblossom Gathering Writ",
          issuer: "Conservator Mera",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star herbal seal",
        },
      ),
    ],
  },
  {
    name: "Skyline Academy",
    category: "support",
    scale: {
      tier: 'regional',
      label: "Scholastic Academy (Regional)",
      rationale:
        "Skyline trains scribes, diplomats, and fledgling mages who serve the city's bureaucracy and trade houses.",
      output:
        "Educated graduates, public lectures, and civic examinations.",
    },
    production: {
      goods: ["tutoring", "public lectures", "examination certificates"],
      notes:
        "Professors hold classes from dawn to dusk; exam weeks require extra proctors and hall monitors.",
    },
    workforce: {
      description:
        "Professors, tutors, and administrators shepherd cohorts of students from across the realm.",
      normal: [
        unskilled(8, "hall monitors, copy runners"),
        skilled(20, "professors, tutors, exam proctors"),
        specialist(4, "deans, exam arbiters"),
      ],
    },
    laborConditions: [
      {
        trigger: "Examination week",
        season: "Late spring",
        description:
          "Hundreds sit for civic exams, requiring proctors and scribes to prevent cheating.",
        staffing: [
          skilled(10, "exam proctors"),
          specialist(2, "deans to arbitrate disputes"),
        ],
      },
      {
        trigger: "Winter lecture series",
        season: "Midwinter",
        description:
          "Traveling sages host lectures, requiring ushers and note-takers to capture knowledge.",
        staffing: [
          unskilled(6, "ushers"),
          skilled(6, "scribes to record lectures"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Exam Hall Proctors",
        "Dean Callus hires impartial wardens to oversee civic examinations and stamp candidate scrolls.",
        {
          location: "Skyline Academy",
          requirements: [
            "Insight 18+",
            "Guild Rank: Academy Associate or Adventurers' Guild Bronze",
            "Bronze token with 1-star academy stamp; promotion clears stamp.",
          ],
          conditions: [
            "Two-day exam rotation",
            "Report any cheating attempts immediately",
          ],
          timeline: "Two-day exam period",
          risks: [
            "Candidate bribery attempts",
            "Fines if scoring sheets misplaced",
          ],
          reward: "4 sp per day plus recommendation scroll",
          postingStyle: "Academy Proctor Notice",
          issuer: "Dean Callus",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star academy stamp",
        },
      ),
      createQuest(
        "Scholars' Escort",
        "Foreign lecturers require discreet escort between Skyline Academy and Greensoul hostels.",
        {
          location: "Skyline Academy",
          requirements: [
            "Persuasion 20+ or History 18+",
            "Guild Rank: Academy Fellow or Adventurers' Guild Silver",
            "Silver token with 2 stars—stamps reset on promotion.",
          ],
          conditions: [
            "Evening escorts after lecture series",
            "Maintain decorum and manage crowds",
          ],
          timeline: "Three-night lecture series",
          risks: [
            "Political agitators",
            "Embarrassment if lecturers harassed",
          ],
          reward: "18 sp plus invitation to private symposium",
          postingStyle: "Academy Escort Posting",
          issuer: "Dean Callus",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star academy seal",
        },
      ),
    ],
  },
  {
    name: "Temple of the Tides",
    category: "support",
    scale: {
      tier: 'strategic',
      label: "Great Temple (Strategic)",
      rationale:
        "The Temple of the Tides tends to sailors, blesses fleets, and safeguards sacred relics for the city.",
      output:
        "Religious services, tidal blessings, and sanctuary for the faithful.",
    },
    production: {
      goods: ["blessings", "healing rites", "tidal relic care"],
      notes:
        "Clergy conduct dawn and dusk rites; reliquaries require trusted guardians.",
    },
    workforce: {
      description:
        "Acolytes, choristers, and clerics manage rituals while temple guards protect the sanctum.",
      normal: [
        unskilled(14, "acolytes, lantern tenders"),
        skilled(18, "choristers, ritual clerics"),
        specialist(5, "high priests, relic wardens"),
      ],
    },
    laborConditions: [
      {
        trigger: "Sea blessing processions",
        season: "Spring tide",
        description:
          "Crowds gather for blessings, requiring extra stewards and guards to manage offerings.",
        staffing: [
          unskilled(10, "acolyte stewards"),
          skilled(6, "clerics to lead chants"),
        ],
      },
      {
        trigger: "Relic translation",
        season: "At need",
        description:
          "Sacred relics move between sanctums, demanding trusted escorts and relic wardens.",
        staffing: [
          skilled(6, "relic bearers"),
          specialist(2, "high priests to seal relic cases"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Procession Wardens",
        "High Priestess Maela seeks calm guardians to marshal tideblessing crowds and guard donation chests.",
        {
          location: "Temple of the Tides",
          requirements: [
            "Religion or Insight 18+",
            "Guild Rank: Temple Ward Acolyte or Adventurers' Guild Bronze",
            "Bronze token with 2-star temple stamp; promotion clears stamp.",
          ],
          conditions: [
            "Procession oversight during dawn and dusk rites",
            "Report suspicious offerings to high priestess",
          ],
          timeline: "Five-day tide festival",
          risks: [
            "Pickpockets",
            "Irreverent visitors",
          ],
          reward: "3 sp per day plus blessed charm",
          postingStyle: "Temple Warden Posting",
          issuer: "High Priestess Maela",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 2-star temple stamp",
        },
      ),
      createQuest(
        "Relic Vigil",
        "A relic must be moved to the Upper Ward; the temple requires stalwart escorts under solemn oath.",
        {
          location: "Temple of the Tides",
          requirements: [
            "Religion 20+ or Divine Magic proficiency",
            "Guild Rank: Temple Ward Captain or Adventurers' Guild Silver",
            "Silver token with 3 stars—stamps reset when promoted.",
          ],
          conditions: [
            "Nighttime vigil within sanctum",
            "Escort relic at dawn to Governor's Keep",
          ],
          timeline: "Two-night vigil",
          risks: [
            "Cults seeking the relic",
            "Spiritual backlash if oath broken",
          ],
          reward: "25 sp plus temple blessing",
          postingStyle: "Relic Guard Writ",
          issuer: "High Priestess Maela",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 3-star temple seal",
        },
      ),
    ],
  },
  {
    name: "Candlewrights' Guild",
    category: "support",
    scale: {
      tier: 'regional',
      label: "Illumination Guild (Regional)",
      rationale:
        "The guild crafts candles for temples, nobles, and arcane rituals, blending waxcraft with alchemical dyes.",
      output:
        "Temple candles, arcane tapers, and perfumed lights for the city.",
    },
    production: {
      goods: ["ritual candles", "perfumed tapers", "lantern wax"],
      notes:
        "Wax kettles and dye vats run day and night; precision ensures no ritual misfires.",
    },
    workforce: {
      description:
        "Wax stirrers, mold setters, and dye specialists work in shifts to keep the city's lights burning.",
      normal: [
        unskilled(18, "wax stirrers, mold cleaners"),
        skilled(14, "candle casters, dye specialists"),
        specialist(4, "ritual candlewrights"),
      ],
    },
    laborConditions: [
      {
        trigger: "Festival of Lights",
        season: "Midwinter",
        description:
          "Every household orders candles, demanding overtime casters and dye workers.",
        staffing: [
          unskilled(12, "wax stirrers for night vats"),
          skilled(6, "casters to pour molds"),
        ],
      },
      {
        trigger: "Arcane contract",
        season: "At need",
        description:
          "Arcanists require precise tapers for rituals, needing specialist oversight and warded storage.",
        staffing: [
          skilled(5, "dye specialists"),
          specialist(2, "ritual candlewrights to bind glyphs"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Festival Candle Run",
        "Guildmaster Oren needs trustworthy runners to monitor vats and deliver festival batches on time.",
        {
          location: "Candlewrights' Guild",
          requirements: [
            "Endurance to haul wax crates",
            "Guild Rank: Candlewrights' Apprentice or Adventurers' Guild Bronze",
            "Bronze token with 1-star candle stamp; promotion clears stamp.",
          ],
          conditions: [
            "Ten-bell shifts swapping molds and rushing deliveries",
            "Log each delivery in guild ledger",
          ],
          timeline: "Seven-day festival run",
          risks: [
            "Hot wax burns",
            "Late deliveries dock pay",
          ],
          reward: "2 sp per shift plus bundle of scented candles",
          postingStyle: "Candlewright Rush Bill",
          issuer: "Guildmaster Oren",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star candle stamp",
        },
      ),
      createQuest(
        "Arcane Taper Oversight",
        "Arcanists commissioned glyph-bound tapers; the guild needs veteran candlewrights to oversee casting.",
        {
          location: "Candlewrights' Guild",
          requirements: [
            "Alchemy or Enchanting proficiency 22+",
            "Guild Rank: Candlewrights' Senior or Adventurers' Guild Silver",
            "Silver token with 2 stars—marks reset upon promotion.",
          ],
          conditions: [
            "Night casting with rune inspection",
            "Deliver tapers to Arcanists' Enclave before dawn",
          ],
          timeline: "Two-night commission",
          risks: [
            "Glyph misfires",
            "Theft en route to enclave",
          ],
          reward: "18 sp plus arcane wax allotment",
          postingStyle: "Ritual Casting Order",
          issuer: "Guildmaster Oren",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star candle seal",
        },
      ),
    ],
  },
];

const WAVES_BREAK_GREENSOUL_HILL_QUEST_BOARDS = buildQuestBoardMap(
  WAVES_BREAK_GREENSOUL_HILL_BUSINESSES,
);

const WAVES_BREAK_LOWER_GARDENS_BUSINESSES: BusinessProfile[] = [
  {
    name: "Quayside Greens Market",
    category: "support",
    scale: {
      tier: 'regional',
      label: "Open-Air Produce Market (Regional)",
      rationale:
        "Quayside Greens supplies fresh produce to the city and passing caravans, coordinating dozens of stalls.",
      output:
        "Fresh vegetables, herbs, and daily market stalls for locals and travelers.",
    },
    production: {
      goods: ["fresh produce", "market services", "stall rentals"],
      notes:
        "Market stewards balance stall assignments, security, and sanitation amid daily crowds.",
    },
    workforce: {
      description:
        "Porters, hawkers, and stewards keep the market orderly while vendors rotate goods at dawn.",
      normal: [
        unskilled(22, "porters, cleaners, hawker runners"),
        skilled(12, "stall stewards, weighers, tally clerks"),
        specialist(3, "market wardens managing permits"),
      ],
    },
    laborConditions: [
      {
        trigger: "Harvest surges",
        season: "Late summer and autumn",
        description:
          "Farm carts overflow with produce, requiring extra porters and tally clerks to prevent spoilage.",
        staffing: [
          unskilled(12, "extra porters"),
          skilled(6, "tally clerks to manage stall rotation"),
        ],
      },
      {
        trigger: "Festival crowds",
        season: "Spring and fall festivals",
        description:
          "Crowds pack the market; security and trash crews must double shifts to keep order.",
        staffing: [
          unskilled(10, "cleanup crews"),
          specialist(2, "market wardens to manage disputes"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Market Dawn Porters",
        "Steward Jessa hires reliable porters to unload dawn carts and keep the aisles clear.",
        {
          location: "Quayside Greens Market",
          requirements: [
            "Strength to haul crates",
            "Guild Rank: Market Ward Helper or Adventurers' Guild Copper",
            "Copper or Bronze token with 0-1 star mark; promotion clears stamp.",
          ],
          conditions: [
            "Pre-dawn unload for four bells",
            "Return empty crates to warehouses",
          ],
          timeline: "Three-morning contract",
          risks: [
            "Sprained backs",
            "Stall fines if produce bruised",
          ],
          reward: "1 sp per bell plus bundle of day-old produce",
          postingStyle: "Market Porter Call",
          issuer: "Steward Jessa",
          guildRankRequirement: "Adventurers' Guild Copper or Bronze",
          reputationRequirement: "Token marked for punctual portering",
        },
      ),
      createQuest(
        "Festival Stall Marshals",
        "Festival crowds demand extra marshals to keep lanes open and settle disputes.",
        {
          location: "Quayside Greens Market",
          requirements: [
            "Persuasion or Intimidation 18+",
            "Guild Rank: Market Warden or Adventurers' Guild Bronze",
            "Bronze token with 1-star market stamp; promotion clears stamp.",
          ],
          conditions: [
            "Two-day festival watch",
            "Report nightly to the Hall of Records with tally",
          ],
          timeline: "Festival weekend",
          risks: [
            "Pickpockets",
            "Vendor disputes",
          ],
          reward: "4 sp per day plus stall favor",
          postingStyle: "Market Marshal Notice",
          issuer: "Steward Jessa",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star market stamp",
        },
      ),
    ],
  },
  {
    name: "South Gate Market",
    category: "support",
    scale: {
      tier: 'regional',
      label: "Gate Bazaar (Regional)",
      rationale:
        "South Gate Market serves caravans heading inland, blending warehousing with street trade.",
      output:
        "Travel provisions, caravan contracts, and warehousing services.",
    },
    production: {
      goods: ["provisions", "contract brokerage", "warehouse slots"],
      notes:
        "Porters, brokers, and guards coordinate caravans leaving the city each day.",
    },
    workforce: {
      description:
        "Caravan brokers, porters, and gate guards coordinate schedules to keep caravans moving.",
      normal: [
        unskilled(20, "pack loaders, stable hands"),
        skilled(14, "contract brokers, inspectors"),
        specialist(4, "gate sergeants, customs officers"),
      ],
    },
    laborConditions: [
      {
        trigger: "Caravan booms",
        season: "Late summer",
        description:
          "Long trade columns depart, requiring extra loaders and manifest inspectors.",
        staffing: [
          unskilled(12, "extra loaders"),
          skilled(6, "manifest clerks"),
        ],
      },
      {
        trigger: "Gate alarms",
        season: "Whenever bandit threats rise",
        description:
          "Gate security doubles shifts, calling for trusted guards to vet travelers.",
        staffing: [
          skilled(8, "gate watchers"),
          specialist(2, "sergeants to lead inspections"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Caravan Loader Levy",
        "Sergeant Hullen waves crews toward the South Gate loading yard, pressing bale hooks, crate sledges, and fresh tarpaulins into ready hands so wagons are stacked before the noon bells scorch the cobbles.",
        {
          location: "South Gate Market loading yards and tack sheds",
          requirements: [
            "Strength and stamina",
            "Guild Rank: Caravan Laborer or Adventurers' Guild Bronze",
            "Bronze token with 0 or 1 star accepted; promotion clears mark.",
          ],
          conditions: [
            "Load wagons for six bells",
            "Check harnesses before departure",
          ],
          timeline: "Two-day caravan muster",
          risks: [
            "Crushed toes",
            "Delayed wagons dock pay",
          ],
          reward: "2 sp per bell plus travel rations",
          postingStyle: "Gate Loader Bill",
          issuer: "Gate Sergeant Hullen",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token marked for caravan service",
        },
      ),
      createQuest(
        "Manifest Inspection Patrol",
        "With contraband whispers rising, Hullen needs quiet inspectors walking the dusk-lit caravan queue, lanterns angled over brass-sealed manifests and spice-stained crates to spot false seals before the wagons roll.",
        {
          location: "South Gate Market caravan queue and ledger tents",
          requirements: [
            "Investigation 20+",
            "Guild Rank: Gate Inspector or Adventurers' Guild Silver",
            "Silver token with 1-star gate stamp; promotion clears stamp.",
          ],
          conditions: [
            "Patrol caravan queue at dusk",
            "Report contraband to Gatewatch barracks",
          ],
          timeline: "Three-evening patrol",
          risks: [
            "Smuggler reprisals",
            "Fines if manifests misread",
          ],
          reward: "12 sp per evening plus bounty share",
          postingStyle: "Gate Inspection Order",
          issuer: "Gate Sergeant Hullen",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 1-star gate stamp",
        },
      ),
    ],
  },
  {
    name: "Seastone Arena",
    category: "support",
    scale: {
      tier: 'regional',
      label: "Public Arena (Regional)",
      rationale:
        "The arena hosts contests, gladiatorial exhibitions, and festivals requiring extensive staff and security.",
      output:
        "Spectator events, gladiator bouts, and festival spectacles.",
    },
    production: {
      goods: ["entertainment", "security", "vendor space"],
      notes:
        "Arena crews manage crowds, schedule performers, and pay gladiators.",
    },
    workforce: {
      description:
        "Stagehands, healers, and guards keep the arena safe while spectacles unfold.",
      normal: [
        unskilled(16, "stagehands, cleanup crews"),
        skilled(14, "ushers, healers, announcers"),
        specialist(5, "arena masters, champion handlers"),
      ],
    },
    laborConditions: [
      {
        trigger: "Tournament weeks",
        season: "Spring and autumn",
        description:
          "Tournament crowds fill the stands, demanding extra ushers and medics.",
        staffing: [
          unskilled(10, "ushers"),
          skilled(6, "arena healers"),
        ],
      },
      {
        trigger: "High-risk exhibition",
        season: "At need",
        description:
          "Exotic beasts and mages require specialist handlers and security.",
        staffing: [
          skilled(6, "beast handlers"),
          specialist(2, "arena masters to oversee wards"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Arena Crowd Marshals",
        "Arena master Garen needs marshals to keep crowds orderly during champion bouts.",
        {
          location: "Seastone Arena",
          requirements: [
            "Intimidation or Performance 18+",
            "Guild Rank: Arena Marshal or Adventurers' Guild Bronze",
            "Bronze token with 1-star arena stamp; promotion clears stamp.",
          ],
          conditions: [
            "Four bells of crowd control",
            "Break up fights quickly",
          ],
          timeline: "Tournament day",
          risks: [
            "Rowdy gamblers",
            "Fines if injuries occur",
          ],
          reward: "3 sp per bell plus arena voucher",
          postingStyle: "Arena Marshal Bill",
          issuer: "Arena Master Garen",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star arena stamp",
        },
      ),
      createQuest(
        "Champion Escort",
        "The arena hires trusted blades to escort visiting champions through festival crowds.",
        {
          location: "Seastone Arena",
          requirements: [
            "Martial weapon proficiency 24+ or Shield proficiency 20+",
            "Guild Rank: Arena Champion's Guard or Adventurers' Guild Silver",
            "Silver token with 1-star arena seal; promotion resets stamp.",
          ],
          conditions: [
            "Escort champions between barracks and arena",
            "Stand guard during wagers",
          ],
          timeline: "Two-night contract",
          risks: [
            "Gambling syndicate interference",
            "Attack from rival champions' crews",
          ],
          reward: "18 sp per night plus champion favor",
          postingStyle: "Arena Guard Writ",
          issuer: "Arena Master Garen",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 1-star arena seal",
        },
      ),
    ],
  },
  {
    name: "Wisteria Pavilion",
    category: "support",
    scale: {
      tier: 'regional',
      label: "Performance Pavilion (Regional)",
      rationale:
        "The pavilion hosts concerts, plays, and noble gatherings requiring staff skilled in etiquette and staging.",
      output:
        "Performances, receptions, and cultural galas for Wave's Break.",
    },
    production: {
      goods: ["performances", "receptions", "noble hospitality"],
      notes:
        "Musicians, stage crew, and stewards coordinate to impress visiting nobles and patrons.",
    },
    workforce: {
      description:
        "Performers, stagehands, and stewards ensure events run smoothly for discerning audiences.",
      normal: [
        unskilled(12, "stagehands, candle tenders"),
        skilled(16, "musicians, actors, stewards"),
        specialist(4, "maestros, event directors"),
      ],
    },
    laborConditions: [
      {
        trigger: "Royal performances",
        season: "Court season",
        description:
          "High-profile events require extra rehearsals and security.",
        staffing: [
          skilled(8, "musicians"),
          specialist(2, "event directors"),
        ],
      },
      {
        trigger: "Festival evenings",
        season: "Summer",
        description:
          "Crowded galas need additional stewards and servers to manage noble guests.",
        staffing: [
          skilled(10, "stewards"),
          specialist(1, "master of ceremonies"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Evening Attendance Marshal",
        "Maestro Neral hires poised attendants to usher nobles and manage seating charts.",
        {
          location: "Wisteria Pavilion",
          requirements: [
            "Performance or Persuasion 20+",
            "Guild Rank: Performers' Guild Journeyman or Adventurers' Guild Bronze",
            "Bronze token with 2-star pavilion stamp; promotion clears stamp.",
          ],
          conditions: [
            "Four-bell evening performance",
            "Maintain etiquette and discrete service",
          ],
          timeline: "Single evening",
          risks: [
            "Offending nobles",
            "Crowded aisles",
          ],
          reward: "5 sp plus gratuity",
          postingStyle: "Pavilion Steward Notice",
          issuer: "Maestro Neral",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 2-star pavilion stamp",
        },
      ),
      createQuest(
        "Noble Gala Wardens",
        "The pavilion seeks discreet guards to manage private salons during a noble gala.",
        {
          location: "Wisteria Pavilion",
          requirements: [
            "Perception 20+ and proficiency with light weapons",
            "Guild Rank: Pavilion Warden or Adventurers' Guild Silver",
            "Silver token with 2 stars—marks reset when promoted.",
          ],
          conditions: [
            "Stand post in private suites",
            "Escort patrons between salons",
          ],
          timeline: "Two-night gala",
          risks: [
            "Intrigue and bribery",
            "Offending nobles jeopardizes reputation",
          ],
          reward: "16 sp per night plus invitation to closing feast",
          postingStyle: "Pavilion Guard Mandate",
          issuer: "Maestro Neral",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star pavilion seal",
        },
      ),
    ],
  },
  {
    name: "Anchor's Toast Brewery",
    category: "processing",
    scale: {
      tier: 'regional',
      label: "Brewery & Taproom (Regional)",
      rationale:
        "The brewery supplies ale to the Lower Gardens and noble terraces, experimenting with unique coastal flavors.",
      output:
        "Cask ales, festival brews, and specialty taproom service.",
    },
    production: {
      goods: ["ales", "festival brews", "taproom service"],
      notes:
        "Brewmasters oversee fermentation while coopers manage cask cellars.",
    },
    workforce: {
      description:
        "Mash stirrers, coopers, and taproom staff keep ale flowing for revelers and festivals.",
      normal: [
        unskilled(14, "mash stirrers, barrel rollers"),
        skilled(12, "brewers, coopers, tap masters"),
        specialist(3, "brewmasters, cellar alchemists"),
      ],
    },
    laborConditions: [
      {
        trigger: "Festival brewing",
        season: "Summer and autumn",
        description:
          "Festivals demand seasonal brews, requiring extra mash crews and cooperages.",
        staffing: [
          unskilled(10, "mash crews"),
          skilled(6, "coopers and tap masters"),
        ],
      },
      {
        trigger: "Rare ingredient run",
        season: "At need",
        description:
          "Brewmasters dispatch trusted adventurers to fetch rare herbs or yeasts from the marsh.",
        staffing: [
          skilled(4, "brew scouts"),
          specialist(1, "cellar alchemist"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Brew House Night Shift",
        "Brewmaster Tolen hires assistants to tend mash tuns and keep temperatures steady through the night.",
        {
          location: "Anchor's Toast Brewery",
          requirements: [
            "Brewing or Alchemy proficiency 18+",
            "Guild Rank: Brewers' Guild Hand or Adventurers' Guild Bronze",
            "Bronze token with 1-star brewery stamp; promotion clears stamp.",
          ],
          conditions: [
            "Night shift stirring mash",
            "Record temperature every half bell",
          ],
          timeline: "Three-night brew",
          risks: [
            "Scalding wort",
            "Spoiled batch docked from pay",
          ],
          reward: "3 sp per night plus keg of festival ale",
          postingStyle: "Brewery Night Bill",
          issuer: "Brewmaster Tolen",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star brewery stamp",
        },
      ),
      createQuest(
        "Rare Malt Procurement",
        "The brewery seeks seasoned adventurers to retrieve brine-malt from misty marsh mounds.",
        {
          location: "Anchor's Toast Brewery",
          requirements: [
            "Survival 20+ or Nature 18+",
            "Guild Rank: Brewers' Guild Journeyman or Adventurers' Guild Silver",
            "Silver token with 2-star brewery seal; promotion resets stamp.",
          ],
          conditions: [
            "Predawn trek to coastal marsh",
            "Return with malt sacks before midday",
          ],
          timeline: "Single predawn excursion",
          risks: [
            "Marsh hazards",
            "Spoilage if sacks soaked",
          ],
          reward: "17 sp plus cask of reserve ale",
          postingStyle: "Brewery Procurement Writ",
          issuer: "Brewmaster Tolen",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star brewery seal",
        },
      ),
    ],
  },
  {
    name: "Sunleaf Inn",
    category: "support",
    scale: {
      tier: 'regional',
      label: "Garden District Inn (Regional)",
      rationale:
        "The Sunleaf Inn hosts travelers, merchants, and festival performers, offering refined hospitality.",
      output:
        "Lodging, banquets, and concierge services for affluent guests.",
    },
    production: {
      goods: ["lodging", "banquets", "concierge services"],
      notes:
        "Innkeepers coordinate kitchens, performers, and security for visiting dignitaries.",
    },
    workforce: {
      description:
        "Hosts, servers, and security staff keep guests comfortable and protected.",
      normal: [
        unskilled(16, "housekeepers, porters"),
        skilled(14, "servers, concierges, cooks"),
        specialist(3, "innkeeper, master chef, night captain"),
      ],
    },
    laborConditions: [
      {
        trigger: "Festival lodging",
        season: "Summer festivals",
        description:
          "Full bookings require extra staff for cleaning and banquets.",
        staffing: [
          unskilled(10, "housekeepers"),
          skilled(6, "servers and cooks"),
        ],
      },
      {
        trigger: "Noble delegations",
        season: "Court season",
        description:
          "High-ranked guests demand dedicated attendants and security.",
        staffing: [
          skilled(6, "concierges"),
          specialist(2, "night captain and security"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Guest Suite Stewards",
        "Innkeeper Lysa seeks discrete attendants to manage noble suites during festival season.",
        {
          location: "Sunleaf Inn",
          requirements: [
            "Performance or Persuasion 18+",
            "Guild Rank: Innkeepers' Guild Journeyman or Adventurers' Guild Bronze",
            "Bronze token with 2-star hospitality stamp; promotion clears stamp.",
          ],
          conditions: [
            "Attend suites for two evenings",
            "Deliver nightly reports to innkeeper",
          ],
          timeline: "Two-night contract",
          risks: [
            "Guest impropriety",
            "Losses billed to steward",
          ],
          reward: "6 sp per night plus gratuities",
          postingStyle: "Inn Steward Posting",
          issuer: "Innkeeper Lysa",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 2-star hospitality stamp",
        },
      ),
      createQuest(
        "Night Terrace Wardens",
        "The inn hires trusted guards to patrol the terrace suites housing foreign envoys.",
        {
          location: "Sunleaf Inn",
          requirements: [
            "Perception 20+ and proficiency with nonlethal combat",
            "Guild Rank: Innkeepers' Guild Captain or Adventurers' Guild Silver",
            "Silver token with 2 stars—marks reset upon promotion.",
          ],
          conditions: [
            "Patrol terrace from dusk to dawn",
            "Coordinate with Temple wardens for guest rites",
          ],
          timeline: "Three-night assignment",
          risks: [
            "Spy activity",
            "Diplomatic incidents if guests feel harassed",
          ],
          reward: "18 sp per night plus future lodging credit",
          postingStyle: "Inn Guard Mandate",
          issuer: "Innkeeper Lysa",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star hospitality seal",
        },
      ),
    ],
  },
];

const WAVES_BREAK_LOWER_GARDENS_QUEST_BOARDS = buildQuestBoardMap(
  WAVES_BREAK_LOWER_GARDENS_BUSINESSES,
);

const WAVES_BREAK_HIGH_ROAD_BUSINESSES: BusinessProfile[] = [
  {
    name: "Adventurers' Guildhall",
    category: "support",
    scale: {
      tier: 'strategic',
      label: "Guild Headquarters (Strategic)",
      rationale:
        "The guildhall coordinates contracts, training, and dispatches for adventurers across the region.",
      output:
        "Contract postings, guild services, and training oversight for members.",
    },
    production: {
      goods: ["contracts", "training", "guild arbitration"],
      notes:
        "Clerks process tokens and ranks; instructors brief parties before departures.",
    },
    workforce: {
      description:
        "Scribes, quartermasters, and officers coordinate guild operations and maintain dormitories for members.",
      normal: [
        unskilled(12, "porters, dorm stewards"),
        skilled(18, "contract clerks, quartermasters, instructors"),
        specialist(6, "guild officers, adjudicators"),
      ],
    },
    laborConditions: [
      {
        trigger: "Spring contract rush",
        season: "Spring",
        description:
          "Contracts flood in after winter, requiring extra clerks and training officers to process parties.",
        staffing: [
          skilled(8, "contract clerks"),
          specialist(3, "training officers"),
        ],
      },
      {
        trigger: "Crisis mobilization",
        season: "At need",
        description:
          "When emergencies strike, the guild needs marshals to coordinate rapid deployments.",
        staffing: [
          skilled(6, "dispatchers"),
          specialist(2, "guild officers"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Guild Gate Stewards",
        "Guildmaster Ryn requests trusted members to monitor the token desk and verify returning parties.",
        {
          location: "Adventurers' Guildhall",
          requirements: [
            "Insight 18+",
            "Guild Rank: Adventurers' Guild Bronze",
            "Bronze token with 1-star steward stamp; promotion clears stamp.",
          ],
          conditions: [
            "Four-bell rotation at token desk",
            "Log party reports and cross-check contracts",
          ],
          timeline: "Five-day rotation",
          risks: [
            "Fraudulent tokens",
            "Overdue parties causing dispute",
          ],
          reward: "4 sp per rotation plus guild favor",
          postingStyle: "Guild Steward Posting",
          issuer: "Guildmaster Ryn",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star steward stamp",
        },
      ),
      createQuest(
        "Emergency Dispatch Marshal",
        "The guildhall seeks veteran members to coordinate response teams during crises.",
        {
          location: "Adventurers' Guildhall",
          requirements: [
            "Leadership or Persuasion 22+",
            "Guild Rank: Adventurers' Guild Silver",
            "Silver token with 2 stars—stamps reset when promoted.",
          ],
          conditions: [
            "Remain on call for two nights",
            "Coordinate with Gatewatch and guild officers",
          ],
          timeline: "Two-night emergency stand-by",
          risks: [
            "High stress",
            "Liability if dispatch mismanaged",
          ],
          reward: "22 sp plus commendation toward next rank",
          postingStyle: "Guild Marshal Mandate",
          issuer: "Guildmaster Ryn",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star marshal stamp",
        },
      ),
    ],
  },
  {
    name: "Rolling Wave Coachworks",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "Coach and Wagon Works (Regional)",
      rationale:
        "Coachworks construct and repair carriages for merchants and nobility preparing for road journeys.",
      output:
        "Coaches, wagon refits, and wheel repairs for caravans.",
    },
    production: {
      goods: ["coaches", "wagons", "wheel assemblies"],
      notes:
        "Wheelwrights and harness makers share the yard; guild contracts demand precise workmanship.",
    },
    workforce: {
      description:
        "Wheelwrights, harness makers, and carpenters outfit caravans departing the High Road District.",
      normal: [
        unskilled(16, "wheel scrubbers, harness polishers"),
        skilled(18, "wheelwrights, carriage carpenters"),
        specialist(4, "coach designers, master harness makers"),
      ],
    },
    laborConditions: [
      {
        trigger: "Caravan season rush",
        season: "Spring and autumn",
        description:
          "Caravans refit wagons before long journeys, requiring extra wheelwrights and harness makers.",
        staffing: [
          unskilled(8, "wheel scrubbers"),
          skilled(10, "wheelwrights and leatherworkers"),
        ],
      },
      {
        trigger: "Royal commission",
        season: "At need",
        description:
          "Noble orders for luxury coaches demand master oversight and night security.",
        staffing: [
          skilled(6, "coach carpenters"),
          specialist(2, "master designers"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Wheelwright Night Shift",
        "Foreman Darel seeks steady hands to true wheels overnight before caravans depart.",
        {
          location: "Rolling Wave Coachworks",
          requirements: [
            "Carpentry or Leatherworking proficiency 18+",
            "Guild Rank: Coachworks Apprentice or Adventurers' Guild Bronze",
            "Bronze token with 1-star coach stamp; promotion clears stamp.",
          ],
          conditions: [
            "Night shift truing wheels",
            "Log spoke adjustments for morning inspection",
          ],
          timeline: "Three-night rush",
          risks: [
            "Splinter injuries",
            "Penalty if wheels wobble",
          ],
          reward: "3 sp per night plus wagon maintenance credit",
          postingStyle: "Coachworks Rush Bill",
          issuer: "Foreman Darel",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star coach stamp",
        },
      ),
      createQuest(
        "Royal Coach Escort",
        "A newly built coach must be delivered to the Upper Ward; the yard needs trusted escorts.",
        {
          location: "Rolling Wave Coachworks",
          requirements: [
            "Perception 20+ and proficiency with martial weapons",
            "Guild Rank: Coachworks Master Guard or Adventurers' Guild Silver",
            "Silver token with 2 stars—marks reset when promoted.",
          ],
          conditions: [
            "Escort coach across city",
            "Report delivery to Hall of Records",
          ],
          timeline: "Single afternoon",
          risks: [
            "Street thieves",
            "Damage to coach docked from pay",
          ],
          reward: "15 sp plus gilded coach insignia",
          postingStyle: "Coach Escort Writ",
          issuer: "Foreman Darel",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star coach seal",
        },
      ),
    ],
  },
  {
    name: "Wavehide Leather Guild",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "Leather Guild Complex (Regional)",
      rationale:
        "The guild crafts harnesses, saddles, and armor pieces for caravans and city guard units.",
      output:
        "Harness sets, saddles, leather armor, and travel gear.",
    },
    production: {
      goods: ["harnesses", "saddles", "leather armor"],
      notes:
        "Curriers, stitchers, and armorers share the guild hall, processing hides from the Tannery.",
    },
    workforce: {
      description:
        "Leatherworkers cut, stitch, and oil harnesses while armorers craft travel-ready gear for guild contracts.",
      normal: [
        unskilled(14, "hide cutters, oilers"),
        skilled(16, "stitchers, saddlers, armorers"),
        specialist(4, "master leatherwrights"),
      ],
    },
    laborConditions: [
      {
        trigger: "Caravan outfitting",
        season: "Spring",
        description:
          "Caravans order harness replacements before long routes, requiring overtime stitchers.",
        staffing: [
          unskilled(8, "hide cutters"),
          skilled(8, "stitchers"),
        ],
      },
      {
        trigger: "Guard armor refit",
        season: "Autumn",
        description:
          "City guard orders new leathers, demanding master armorers and quality inspectors.",
        staffing: [
          skilled(6, "armorers"),
          specialist(2, "quality masters"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Harness Stitch Rotation",
        "Guildmaster Pell requests quick stitchers to finish caravan harness orders overnight.",
        {
          location: "Wavehide Leather Guild",
          requirements: [
            "Leatherworking proficiency 20+",
            "Guild Rank: Leather Guild Apprentice or Adventurers' Guild Bronze",
            "Bronze token with 1-star leather stamp; promotion clears stamp.",
          ],
          conditions: [
            "Eight-bell overnight stitching",
            "Oil and inspect harnesses before dawn",
          ],
          timeline: "Four-night rotation",
          risks: [
            "Hand cramps",
            "Rework docked from pay",
          ],
          reward: "3 sp per night plus leather scrap allotment",
          postingStyle: "Leather Guild Rush",
          issuer: "Guildmaster Pell",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star leather stamp",
        },
      ),
      createQuest(
        "Guard Leathers Inspection",
        "The guard contracts require trusted artisans to inspect and certify new armor batches.",
        {
          location: "Wavehide Leather Guild",
          requirements: [
            "Leatherworking proficiency 26+",
            "Guild Rank: Leather Guild Journeyman or Adventurers' Guild Silver",
            "Silver token with 2 stars—marks reset upon promotion.",
          ],
          conditions: [
            "Inspect armor sets over two days",
            "Deliver reports to Gatewatch barracks",
          ],
          timeline: "Two-day inspection",
          risks: [
            "Liability for failed gear",
            "Guard penalties for inaccurate reports",
          ],
          reward: "18 sp per day plus guard referral",
          postingStyle: "Leather Inspection Order",
          issuer: "Guildmaster Pell",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star leather seal",
        },
      ),
    ],
  },
  {
    name: "Shield & Sail Armsmiths",
    category: "craft",
    scale: {
      tier: 'regional',
      label: "Armsmith Cooperative (Regional)",
      rationale:
        "Armsmiths in the High Road District forge weapons and shields for caravans and mercenary companies.",
      output:
        "Polearms, shields, and caravan weapon refits.",
    },
    production: {
      goods: ["spearheads", "shields", "maintenance kits"],
      notes:
        "The cooperative focuses on field-ready arms, coordinating with the Guild of Smiths for supply.",
    },
    workforce: {
      description:
        "Forge crews harden spearheads, assemble shields, and prepare maintenance kits for road use.",
      normal: [
        unskilled(12, "forge carriers, quench handlers"),
        skilled(16, "armsmiths, shield carpenters"),
        specialist(4, "master smiths"),
      ],
    },
    laborConditions: [
      {
        trigger: "Caravan guard contracts",
        season: "Spring and autumn",
        description:
          "Caravan guards demand fresh arms, requiring extended forging shifts.",
        staffing: [
          unskilled(8, "coal carriers"),
          skilled(8, "armsmiths"),
        ],
      },
      {
        trigger: "Bandit threat alerts",
        season: "At need",
        description:
          "When bandit raids spike, the cooperative produces emergency batches of shields and spearheads.",
        staffing: [
          skilled(10, "armsmiths"),
          specialist(2, "master smiths"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Shield Press Assistants",
        "Shieldwrights need extra press hands to rivet shield rims before caravans depart.",
        {
          location: "Shield & Sail Armsmiths",
          requirements: [
            "Blacksmithing or Carpentry proficiency 18+",
            "Guild Rank: Armsmith Apprentice or Adventurers' Guild Bronze",
            "Bronze token with 1-star arms stamp; promotion clears stamp.",
          ],
          conditions: [
            "Twelve-bell pressing shift",
            "Inspect rivets with master smith",
          ],
          timeline: "Two-day rush",
          risks: [
            "Hammer strikes",
            "Warped shield faces",
          ],
          reward: "3 sp per shift plus maintenance kit",
          postingStyle: "Shieldwright Rush Bill",
          issuer: "Master Armorer Sella",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star arms stamp",
        },
      ),
      createQuest(
        "Emergency Arms Drill",
        "Master Sella drills volunteer smiths to forge emergency spearheads during bandit alerts.",
        {
          location: "Shield & Sail Armsmiths",
          requirements: [
            "Martial weapon familiarity or Smithing proficiency 22+",
            "Guild Rank: Armsmith Journeyman or Adventurers' Guild Silver",
            "Silver token with 2 stars—stamps reset upon promotion.",
          ],
          conditions: [
            "Overnight forging drill",
            "Deliver crate of spearheads to Gatewatch barracks",
          ],
          timeline: "Single-night drill",
          risks: [
            "Fatigue and burns",
            "Liability for flawed arms",
          ],
          reward: "20 sp plus guard commendation",
          postingStyle: "Arms Emergency Order",
          issuer: "Master Armorer Sella",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star arms seal",
        },
      ),
    ],
  },
  {
    name: "Gatewatch Barracks",
    category: "security",
    scale: {
      tier: 'regional',
      label: "Gatewatch Command (Regional)",
      rationale:
        "The barracks house the Gatewatch who protect caravans, inspect travelers, and respond to countryside threats.",
      output:
        "Guard patrols, gate security, and caravan escorts.",
    },
    production: {
      goods: ["guard patrols", "inspection services", "escort details"],
      notes:
        "Sentries rotate through watchtowers while officers coordinate patrol routes with the Adventurers' Guild.",
    },
    workforce: {
      description:
        "Guards, trackers, and signal officers maintain readiness along the High Road.",
      normal: [
        unskilled(18, "stable hands, mess stewards"),
        skilled(20, "guards, trackers, signalers"),
        specialist(5, "captains, mage-scouts"),
      ],
    },
    laborConditions: [
      {
        trigger: "Bandit sightings",
        season: "At need",
        description:
          "Bandit reports increase patrols, requiring extra guards and trackers.",
        staffing: [
          skilled(12, "guards"),
          specialist(3, "captains"),
        ],
      },
      {
        trigger: "Caravan escort rotation",
        season: "Spring",
        description:
          "Large caravans require additional escorts beyond the city walls.",
        staffing: [
          skilled(10, "escort guards"),
          specialist(2, "signal officers"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Gatewatch Patrol Muster",
        "Captain Ilyan calls for reliable blades to ride night patrols along the High Road.",
        {
          location: "Gatewatch Barracks",
          requirements: [
            "Martial weapon proficiency 22+",
            "Guild Rank: Gatewatch Corporal or Adventurers' Guild Bronze",
            "Bronze token with 2-star patrol stamp; promotion clears stamp.",
          ],
          conditions: [
            "Night patrol with signal drills",
            "Report findings to the barracks",
          ],
          timeline: "Three-night patrol",
          risks: [
            "Bandit ambush",
            "Misreported signals",
          ],
          reward: "5 sp per night plus Gatewatch commendation",
          postingStyle: "Gatewatch Patrol Bill",
          issuer: "Captain Ilyan",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 2-star patrol stamp",
        },
      ),
      createQuest(
        "Escort Captain Detail",
        "Gatewatch seeks veteran adventurers to lead caravan escort detachments during the busy season.",
        {
          location: "Gatewatch Barracks",
          requirements: [
            "Leadership 20+ and martial proficiency 24+",
            "Guild Rank: Gatewatch Lieutenant or Adventurers' Guild Silver",
            "Silver token with 2 stars—stamps reset when promoted.",
          ],
          conditions: [
            "Escort caravan to first relay post",
            "File after-action report with the guildhall",
          ],
          timeline: "Two-day escort mission",
          risks: [
            "Bandit ambush",
            "Loss of goods penalizes captain",
          ],
          reward: "32 sp plus caravan gratuity",
          postingStyle: "Gatewatch Escort Order",
          issuer: "Captain Ilyan",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star escort stamp",
        },
      ),
    ],
  },
  {
    name: "Stonebridge Caravanserai",
    category: "logistics",
    scale: {
      tier: 'regional',
      label: "Caravanserai Hub (Regional)",
      rationale:
        "The caravanserai houses merchants, beasts, and guards preparing for long journeys.",
      output:
        "Lodging for caravans, stockyards, and maintenance services.",
    },
    production: {
      goods: ["caravan lodging", "beast care", "caravan provisioning"],
      notes:
        "Stablemasters, cooks, and scribes coordinate dozens of caravans each tenday.",
    },
    workforce: {
      description:
        "Stable hands tend beasts while stewards manage contracts and quartermasters supply caravans.",
      normal: [
        unskilled(22, "stable hands, muck crews"),
        skilled(16, "quartermasters, scribes, cooks"),
        specialist(4, "caravan factors"),
      ],
    },
    laborConditions: [
      {
        trigger: "Caravan convergences",
        season: "Late summer",
        description:
          "Multiple caravans overlap, requiring extra hands to feed beasts and prepare barracks.",
        staffing: [
          unskilled(12, "stable hands"),
          skilled(8, "quartermasters"),
        ],
      },
      {
        trigger: "Outbreak precautions",
        season: "At need",
        description:
          "Illness among beasts demands specialized handlers and healers.",
        staffing: [
          skilled(6, "beast handlers"),
          specialist(2, "beast healers"),
        ],
      },
    ],
    quests: [
      createQuest(
        "Stable Night Rotation",
        "Caravanserai steward Nyla hires night crews to feed and calm restless caravan beasts.",
        {
          location: "Stonebridge Caravanserai",
          requirements: [
            "Animal Handling proficiency 18+",
            "Guild Rank: Caravanserai Hand or Adventurers' Guild Bronze",
            "Bronze token with 1-star caravanserai stamp; promotion clears stamp.",
          ],
          conditions: [
            "Night rotation feeding and mucking stables",
            "Log each beast's condition",
          ],
          timeline: "Five-night rotation",
          risks: [
            "Kicks and bites",
            "Caravan fines if beasts injured",
          ],
          reward: "2 sp per night plus ration of trail feed",
          postingStyle: "Caravanserai Stable Bill",
          issuer: "Steward Nyla",
          guildRankRequirement: "Adventurers' Guild Bronze",
          reputationRequirement: "Bronze token with 1-star caravanserai stamp",
        },
      ),
      createQuest(
        "Caravan Factor Escort",
        "A wealthy factor needs discreet escort to deliver contracts to the Adventurers' Guild and Gatewatch.",
        {
          location: "Stonebridge Caravanserai",
          requirements: [
            "Persuasion or Intimidation 20+",
            "Guild Rank: Caravanserai Factor or Adventurers' Guild Silver",
            "Silver token with 2 stars—marks reset upon promotion.",
          ],
          conditions: [
            "Escort factor through High Road District",
            "Ensure contracts filed and stamped",
          ],
          timeline: "Single-day escort",
          risks: [
            "Pickpockets",
            "Rival factors seeking sabotage",
          ],
          reward: "16 sp plus caravan lodging credit",
          postingStyle: "Factor Escort Notice",
          issuer: "Steward Nyla",
          guildRankRequirement: "Adventurers' Guild Silver",
          reputationRequirement: "Silver token with 2-star factor stamp",
        },
      ),
    ],
  },
];

const WAVES_BREAK_HIGH_ROAD_QUEST_BOARDS = buildQuestBoardMap(
  WAVES_BREAK_HIGH_ROAD_BUSINESSES,
);

const WAVES_BREAK_DISTRICT_BUSINESSES: Record<string, BusinessProfile[]> = {
  "The Port District": WAVES_BREAK_PORT_BUSINESSES,
  "The Upper Ward": WAVES_BREAK_UPPER_WARD_BUSINESSES,
  "Little Terns": WAVES_BREAK_LITTLE_TERNS_BUSINESSES,
  "Greensoul Hill": WAVES_BREAK_GREENSOUL_HILL_BUSINESSES,
  "The Lower Gardens": WAVES_BREAK_LOWER_GARDENS_BUSINESSES,
  "The High Road District": WAVES_BREAK_HIGH_ROAD_BUSINESSES,
  "The Farmlands": WAVES_BREAK_FARMLAND_BUSINESSES,
};

const WAVES_BREAK_DISTRICT_QUEST_BOARDS: Record<string, Quest[]> = {
  ...WAVES_BREAK_PORT_QUEST_BOARDS,
  ...WAVES_BREAK_UPPER_WARD_QUEST_BOARDS,
  ...WAVES_BREAK_LITTLE_TERNS_QUEST_BOARDS,
  ...WAVES_BREAK_GREENSOUL_HILL_QUEST_BOARDS,
  ...WAVES_BREAK_LOWER_GARDENS_QUEST_BOARDS,
  ...WAVES_BREAK_HIGH_ROAD_QUEST_BOARDS,
  ...WAVES_BREAK_FARMLAND_QUEST_BOARDS,
};

const WAVES_BREAK_BUSINESSES: BusinessProfile[] = Object.values(
  WAVES_BREAK_DISTRICT_BUSINESSES,
).reduce((acc, list) => acc.concat(list), [] as BusinessProfile[]);

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
    "The High Road District",
    "The Farmlands",
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
      "Navigator's Trust & Chart House",
      "Highward Vintners' Salon",
      "Marble Finch Supper Club",
      "Aurelian Apothecarium & Perfumery",
      "Highward Terraces",
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
      "Seawind Sailmakers' Hall",
      "Brinemarrow Press",
      "Tern Hook Butchery",
      "Driftwood Smokehouse",
      "Gull's Galley",
      "Quayside Greens Market",
      "Dockside Exchange Plaza",
      "Saltroot Remedies",
      "Seastone Arena",
      "Tern Harbor Commons",
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
      "Greensoul Press & Papermill",
      "Candlewrights' Guild",
      "Glass Eel Glassworks",
      "Herbal Conservatory",
      "Shrine of the Dawnfather",
      "The Whispering Garden",
      "Royal Botanical Gardens",
      "Skyline Academy",
      "Greensoul Amphitheater",
      "Sunleaf Terrace",
      "Celestine Bathhouse & Springs",
      "Aurora Amphitheater",
      "Gilded Lyre Gallery",
      "The Glass Eel Tavern",
      "The Grand Arena",
      "South Gate Market",
      "Herbalists' Quarter",
      "Apiaries and Beekeepers",
      "Oil Presses and Mills",
        "Anchor's Toast Brewery",
      "Garden Gate Brewery & Taproom",
      "Wisteria Pavilion",
      "Stonecutters' Guild",
      "Shrine of the Harvestmother",
      "Public Baths",
      "Flower Gardens and Orchard Walks",
      "Bloomstage Theater",
      "The Velvet Petal Brothel",
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
      "North Gate",
      "South Gate",
      "Wayfarer's Rest Tavern",
      "Seabreeze Oat Farm",
      "Saltcrest Vineyard & Winery",
      "Windward Berry Vineyard & Winery",
      "Tideflock Stockyards",
      "Bayside Brickworks",
      "Cliffbreak Quarry",
      "Wavecut Stoneworks",
      "Coast Road Watchtower",
        "Harbor Hearth Bakery",
        "Tidehold Granary & Provisioners",
      "Brackenshore Croft",
      "Greenridge Polder",
      "Harborwind Dairy",
      "Saltmeadow Potato Farm",
      "Foamfield Flax Farm",
      "Mistflower Apiary",
      "Cliffblossom Hives",
      "Gulls' Orchard",
      "Sunmellow Grove",
      "Seawisp Plum Orchard",
      "Driftfell Meadow",
      "Moorlight Flats",
      "Gullwind Mill",
      "Tidewheel Watermill",
      "Saltmarsh Granary",
      "Copperbrook Forge",
      "Tidewatcher Lighthouse",
      "Netmaker's Co-op",
    ],
    tradeRoutes: [],
    resources: {
      domestic: [
        "fish",
        "salt",
        "rope and sailcloth",
        "ship fittings",
        "market greens",
        "crafted tools",
      ],
      exports: [
        "salted fish",
        "preserved sea-goods",
        "rope and sailcloth",
        "ship fittings",
        "glass trinkets",
      ],
      imports: ["grain", "wine", "hardwood timber", "luxuries"],
    },
  },
  businesses: WAVES_BREAK_BUSINESSES,
  questBoards: { ...WAVES_BREAK_DISTRICT_QUEST_BOARDS },
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
      domestic: [
        "pearls",
        "coral",
        "sponges",
        "glassware",
        "reef fish",
        "salt crystals",
      ],
      exports: [
        "pearls",
        "coral jewelry",
        "blown glass",
        "luxury salts",
        "nautical instruments",
      ],
      imports: ["highland timber", "grain", "spices", "precious metals"],
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
        "lumber logs",
        "resin and pitch",
        "forest mushrooms",
        "tree sap",
        "freshwater fish",
        "mountain crystals",
      ],
      exports: [
        "timber beams",
        "seasoned planks",
        "sap resins",
        "rare mushrooms",
        "raw crystals",
      ],
      imports: ["grain", "salt", "forged tools"],
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
        "sugar beets",
        "cattle",
        "dairy",
        "leather",
        "freshwater fish",
        "orchard fruit",
        "glassware",
        "brandy",
      ],
      exports: [
        "grain caravans",
        "refined sugar",
        "beef",
        "cured leather",
        "freshwater fish",
        "orchard fruit",
        "glass bottles",
        "brandy",
      ],
      imports: ["salt", "timber", "luxury crafts", "spices"],
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
        "terrace vegetables",
        "goat dairy",
        "mountain herbs",
        "mineral water",
        "precious ores",
        "spring fish and shellfish",
      ],
      exports: [
        "refined metals",
        "mineral reagents",
        "spices and herbs",
        "hot spring salts",
        "rare aquatic produce",
      ],
      imports: ["grain", "textiles", "tools", "glassware"],
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
        "resin timber",
        "trout",
        "wild poultry",
        "game meat",
        "rare pelts",
        "raw crystals",
      ],
      exports: [
        "diamonds",
        "semi-precious stones",
        "seasoned lumber",
        "wagon frames",
        "rare pelts",
        "smoked trout",
        "fine leather armor",
      ],
      imports: ["grain", "salt", "forged tools"],
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
        notes: "hunters, trappers with Trapping proficiency, and tannery hands",
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
        "wetland herbs",
        "spiced preserves",
      ],
      exports: [
        "luxury teas",
        "rice",
        "preserved fish",
        "shellfish",
        "wetland herbs",
        "spiced preserves",
      ],
      imports: ["lumber", "diamonds", "textiles", "ironware"],
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
        "silk",
        "dairy",
        "mulberries",
        "brewed ales",
      ],
      exports: [
        "grain caravans",
        "fruit preserves",
        "livestock",
        "woven textiles",
        "silk bolts",
        "brewed ales",
        "armory steel",
      ],
      imports: ["tea", "gems", "salt", "luxury crafts"],
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
        "mithril works",
        "adamantine fittings",
        "fine jewelry",
        "engraved glassware",
        "coinage",
        "brewmasters' ales",
        "precision tools",
      ],
      exports: [
        "mithril arms",
        "adamantine fittings",
        "fine jewelry",
        "engraved glassware",
        "coin mints",
        "brewmasters' ales",
        "precision tools",
      ],
      imports: ["grain", "livestock", "timber", "raw gems", "luxury foodstuffs"],
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
        "game meat",
        "exotic fruits",
        "lake fish",
        "dragon remnants",
      ],
      exports: [
        "rare pelts",
        "arctic lumber",
        "exotic fruit preserves",
        "dragon remnants",
        "smoked lake fish",
      ],
      imports: ["grain", "salt", "tools", "textiles"],
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
      domestic: [
        "timber",
        "hardwood logs",
        "game meat",
        "rare pelts",
        "medicinal herbs",
        "mushrooms",
      ],
      exports: [
        "hardwood timber",
        "treated lumber",
        "medicinal herbs",
        "leather goods",
        "mushroom preserves",
      ],
      imports: ["grain", "salt", "tools", "textiles"],
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

applyVendorDefaults(LOCATIONS);

Object.keys(LOCATIONS).forEach((name) => addQuestBoards(LOCATIONS[name]));

