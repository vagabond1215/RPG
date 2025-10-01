import type { Habitat } from './weather.js';

export type HexTravelMode =
  | 'road'
  | 'river'
  | 'sea'
  | 'trail'
  | 'mountain_pass'
  | 'portage';

export type TravelMethod = 'walk' | 'wagon' | 'horse' | 'ship' | 'river_barge';

export type TravelBiome =
  | 'grassland'
  | 'forest'
  | 'marsh'
  | 'mountain'
  | 'urban'
  | 'coastal_waters'
  | 'open_sea'
  | 'river';

export type TravelWeather = 'clear' | 'rain' | 'storm' | 'fog' | 'snow';

export type TravelTimeOfDay = 'day' | 'night' | 'dawn' | 'dusk';

export type TravelWind = 'calm' | 'headwind' | 'tailwind' | 'crosswind';

export type TravelCurrent = 'still' | 'with_current' | 'against_current' | 'tidal_aid';

export type LogisticsImprovement =
  | 'paved_road'
  | 'maintained_road'
  | 'packed_trail'
  | 'stone_switchbacks'
  | 'waystations'
  | 'signal_beacons'
  | 'river_locks'
  | 'harbor_pilots'
  | 'supply_depots'
  | 'ferry_slips';

export interface TravelConditions {
  biome?: TravelBiome;
  weather?: TravelWeather;
  timeOfDay?: TravelTimeOfDay;
  wind?: TravelWind;
  current?: TravelCurrent;
  logistics?: LogisticsImprovement[];
}

export interface AppliedTravelConditions {
  biome: TravelBiome;
  weather: TravelWeather;
  timeOfDay: TravelTimeOfDay;
  wind: TravelWind;
  current: TravelCurrent;
  logistics: LogisticsImprovement[];
}

export interface HexCoordinate {
  q: number;
  r: number;
}

export interface CubeCoordinate {
  x: number;
  y: number;
  z: number;
}

export interface HexNeighbor {
  to: string;
  via: HexTravelMode;
  method: TravelMethod;
  distance: number;
  travelTimeDays: number;
  notes?: string;
  conditions: AppliedTravelConditions;
}

export interface HexLocation {
  name: string;
  coordinate: HexCoordinate;
  habitat: Habitat;
  terrain: string;
  elevation: 'sea-level' | 'lowland' | 'upland' | 'highland';
  travelModes: HexTravelMode[];
  features: string[];
  neighbors: HexNeighbor[];
}

interface HexNeighborInput
  extends Partial<Pick<HexNeighbor, 'distance' | 'travelTimeDays' | 'method'>> {
  to: string;
  via: HexTravelMode;
  notes?: string;
  conditions?: TravelConditions;
}

interface HexLocationInput {
  coordinate: HexCoordinate;
  habitat: Habitat;
  terrain: string;
  elevation: HexLocation['elevation'];
  travelModes: HexTravelMode[];
  features: string[];
  neighbors: HexNeighborInput[];
}

export const TRAVEL_METHOD_DAYS_PER_HEX: Record<TravelMethod, number> = {
  walk: 12,
  wagon: 9,
  horse: 6,
  ship: 4,
  river_barge: 5,
};

export const DEFAULT_METHOD_FOR_MODE: Record<HexTravelMode, TravelMethod> = {
  road: 'wagon',
  river: 'river_barge',
  sea: 'ship',
  trail: 'walk',
  mountain_pass: 'horse',
  portage: 'walk',
};

export const TRAVEL_MODE_DAYS_PER_HEX: Record<HexTravelMode, number> = {
  road: TRAVEL_METHOD_DAYS_PER_HEX[DEFAULT_METHOD_FOR_MODE.road],
  river: TRAVEL_METHOD_DAYS_PER_HEX[DEFAULT_METHOD_FOR_MODE.river],
  sea: TRAVEL_METHOD_DAYS_PER_HEX[DEFAULT_METHOD_FOR_MODE.sea],
  trail: TRAVEL_METHOD_DAYS_PER_HEX[DEFAULT_METHOD_FOR_MODE.trail],
  mountain_pass: TRAVEL_METHOD_DAYS_PER_HEX[DEFAULT_METHOD_FOR_MODE.mountain_pass],
  portage: TRAVEL_METHOD_DAYS_PER_HEX[DEFAULT_METHOD_FOR_MODE.portage],
};

const HABITAT_BIOME_DEFAULTS: Partial<Record<Habitat, TravelBiome>> = {
  coastal: 'coastal_waters',
  farmland: 'grassland',
  urban: 'urban',
  woodland: 'forest',
  mountain: 'mountain',
  river: 'river',
};

const MODE_LOGISTICS_DEFAULTS: Record<HexTravelMode, LogisticsImprovement[]> = {
  road: ['maintained_road', 'waystations'],
  river: ['river_locks', 'ferry_slips'],
  sea: ['signal_beacons', 'harbor_pilots'],
  trail: ['packed_trail'],
  mountain_pass: ['stone_switchbacks', 'supply_depots'],
  portage: ['packed_trail', 'supply_depots'],
};

const BIOME_MODIFIERS: Record<TravelBiome, number> = {
  grassland: 0.95,
  forest: 1.15,
  marsh: 1.35,
  mountain: 1.4,
  urban: 1.1,
  coastal_waters: 1,
  open_sea: 0.9,
  river: 0.95,
};

const WEATHER_MODIFIERS: Record<TravelWeather, number> = {
  clear: 1,
  rain: 1.15,
  storm: 1.5,
  fog: 1.1,
  snow: 1.45,
};

const TIME_OF_DAY_MODIFIERS: Record<TravelTimeOfDay, number> = {
  day: 1,
  night: 1.25,
  dawn: 1.1,
  dusk: 1.1,
};

const WIND_MODIFIERS: Record<TravelWind, number> = {
  calm: 1,
  headwind: 1.3,
  tailwind: 0.85,
  crosswind: 1.1,
};

const CURRENT_MODIFIERS: Record<TravelCurrent, number> = {
  still: 1,
  with_current: 0.9,
  against_current: 1.25,
  tidal_aid: 0.95,
};

const LOGISTICS_MODIFIERS: Record<LogisticsImprovement, number> = {
  paved_road: 0.8,
  maintained_road: 0.9,
  packed_trail: 0.95,
  stone_switchbacks: 1.1,
  waystations: 0.92,
  signal_beacons: 0.93,
  river_locks: 0.92,
  harbor_pilots: 0.9,
  supply_depots: 0.95,
  ferry_slips: 0.94,
};

function pickBiome(
  via: HexTravelMode,
  origin: HexLocationInput | undefined,
  target: HexLocationInput | undefined,
  requested?: TravelBiome,
): TravelBiome {
  if (requested) {
    return requested;
  }
  if (via === 'sea') {
    return 'open_sea';
  }
  if (via === 'river') {
    return 'river';
  }
  if (via === 'portage') {
    return 'marsh';
  }
  if (via === 'mountain_pass') {
    return 'mountain';
  }
  if (via === 'trail') {
    if (origin?.habitat === 'woodland' || target?.habitat === 'woodland') {
      return 'forest';
    }
    if (origin?.habitat === 'mountain' || target?.habitat === 'mountain') {
      return 'mountain';
    }
  }
  const habitats: (Habitat | undefined)[] = [origin?.habitat, target?.habitat];
  for (const habitat of habitats) {
    if (!habitat) continue;
    let mapped = HABITAT_BIOME_DEFAULTS[habitat];
    if (mapped === 'coastal_waters') {
      mapped = 'marsh';
    }
    if (mapped) {
      return mapped;
    }
  }
  return 'grassland';
}

function resolveTravelConditions(
  via: HexTravelMode,
  method: TravelMethod,
  conditions: TravelConditions | undefined,
  origin: HexLocationInput | undefined,
  target: HexLocationInput | undefined,
): AppliedTravelConditions {
  const logistics = new Set<LogisticsImprovement>(MODE_LOGISTICS_DEFAULTS[via] ?? []);
  if (conditions?.logistics) {
    conditions.logistics.forEach((entry) => logistics.add(entry));
  }
  const biome = pickBiome(via, origin, target, conditions?.biome);
  const weather = conditions?.weather ?? 'clear';
  const timeOfDay = conditions?.timeOfDay ?? 'day';
  const waterRoute = via === 'river' || via === 'sea';
  const wind = conditions?.wind ?? (waterRoute ? 'calm' : 'calm');
  let current: TravelCurrent;
  if (conditions?.current) {
    current = conditions.current;
  } else if (via === 'river') {
    current = method === 'river_barge' ? 'with_current' : 'still';
  } else if (via === 'sea') {
    current = 'tidal_aid';
  } else {
    current = 'still';
  }
  return {
    biome,
    weather,
    timeOfDay,
    wind,
    current,
    logistics: Array.from(logistics),
  };
}

export function computeTravelTime(
  distance: number,
  method: TravelMethod,
  conditions: AppliedTravelConditions,
): number {
  const baseDays = distance * (TRAVEL_METHOD_DAYS_PER_HEX[method] ?? TRAVEL_METHOD_DAYS_PER_HEX.walk);
  const logisticsModifier = conditions.logistics.reduce<number>(
    (modifier, entry) => modifier * (LOGISTICS_MODIFIERS[entry] ?? 1),
    1,
  );
  const adjusted =
    baseDays *
    (BIOME_MODIFIERS[conditions.biome] ?? 1) *
    (WEATHER_MODIFIERS[conditions.weather] ?? 1) *
    (TIME_OF_DAY_MODIFIERS[conditions.timeOfDay] ?? 1) *
    (WIND_MODIFIERS[conditions.wind] ?? 1) *
    (CURRENT_MODIFIERS[conditions.current] ?? 1) *
    logisticsModifier;
  return Number(adjusted.toFixed(1));
}

export function axialToCube({ q, r }: HexCoordinate): CubeCoordinate {
  const x = q;
  const z = r;
  const y = -x - z;
  return { x, y, z };
}

export function cubeDistance(a: CubeCoordinate, b: CubeCoordinate): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
}

export function hexDistance(a: HexCoordinate, b: HexCoordinate): number {
  return cubeDistance(axialToCube(a), axialToCube(b));
}

export function estimateTravelTime(
  distance: number,
  mode: HexTravelMode,
  method?: TravelMethod,
  conditions?: TravelConditions,
): number {
  const resolvedMethod = method ?? DEFAULT_METHOD_FOR_MODE[mode];
  const applied = resolveTravelConditions(mode, resolvedMethod, conditions, undefined, undefined);
  return computeTravelTime(distance, resolvedMethod, applied);
}

const RAW_HEX_GRID: Record<string, HexLocationInput> = {
  'Duvilia Kingdom': {
    coordinate: { q: 0, r: 0 },
    habitat: 'farmland',
    terrain: 'realm-spanning heartlands centered on the royal demesne',
    elevation: 'lowland',
    travelModes: ['road', 'river', 'sea'],
    features: [
      'royal chartered guild routes',
      'coastal, riverine, and overland trade integration',
      'crown-administered border forts',
    ],
    neighbors: [
      {
        to: 'Corona',
        via: 'road',
        method: 'wagon',
        distance: 1,
        notes: 'Corona anchors the kingdom road network and guild administration',
        conditions: {
          biome: 'grassland',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['paved_road', 'waystations'],
        },
      },
      {
        to: "Wave's Break",
        via: 'sea',
        method: 'ship',
        distance: 3,
        notes: 'Western sea lanes through the gulf tie the capital to the sister ports',
        conditions: {
          biome: 'open_sea',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'tailwind',
          current: 'with_current',
          logistics: ['signal_beacons', 'harbor_pilots'],
        },
      },
      {
        to: 'Corner Stone',
        via: 'road',
        method: 'wagon',
        distance: 2,
        notes: 'Northern royal road follows the great river into the artisan citadel',
        conditions: {
          biome: 'grassland',
          weather: 'fog',
          timeOfDay: 'dawn',
          wind: 'calm',
          current: 'still',
          logistics: ['paved_road', 'waystations'],
        },
      },
    ],
  },
  "Wave's Break": {
    coordinate: { q: -1, r: 1 },
    habitat: 'coastal',
    terrain: 'storm-battered coast and harbor delta',
    elevation: 'sea-level',
    travelModes: ['sea', 'road', 'trail'],
    features: [
      'western sea gate of the kingdom',
      'primary deep-water docks',
      'guild quarter bridging caravans and fleets',
    ],
    neighbors: [
      {
        to: 'Mountain Top',
        via: 'road',
        notes: 'Southern caravan leg skirting the wetlands edge',
        method: 'wagon',
        conditions: {
          biome: 'marsh',
          weather: 'rain',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'supply_depots'],
        },
      },
      {
        to: 'Coral Keep',
        via: 'sea',
        notes: 'Fast coastal run between the sister ports',
        method: 'ship',
        conditions: {
          biome: 'coastal_waters',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'tailwind',
          current: 'tidal_aid',
          logistics: ['signal_beacons', 'harbor_pilots'],
        },
      },
      {
        to: 'Dancing Pines',
        via: 'trail',
        notes: 'Mountain tracks threading the pine frontier to the diamond camps',
        method: 'horse',
        conditions: {
          biome: 'forest',
          weather: 'fog',
          timeOfDay: 'dawn',
          wind: 'calm',
          current: 'still',
          logistics: ['packed_trail', 'supply_depots'],
        },
      },
      {
        to: 'Duvilia Kingdom',
        via: 'sea',
        notes: 'Royal convoys sail eastward before fanning inland',
        method: 'ship',
        distance: 3,
        conditions: {
          biome: 'open_sea',
          weather: 'storm',
          timeOfDay: 'night',
          wind: 'headwind',
          current: 'against_current',
          logistics: ['harbor_pilots'],
        },
      },
    ],
  },
  'Coral Keep': {
    coordinate: { q: -2, r: 1 },
    habitat: 'coastal',
    terrain: 'reef-bound peninsula and fortified harbor',
    elevation: 'sea-level',
    travelModes: ['sea', 'river', 'road'],
    features: [
      'luxury glassworks and pearl dives',
      'stone breakwaters crowned with keeps',
      'caravan link to basin hinterlands',
    ],
    neighbors: [
      {
        to: "Wave's Break",
        via: 'sea',
        notes: 'Shared patrols safeguard the twin ports',
        method: 'ship',
        conditions: {
          biome: 'coastal_waters',
          weather: 'fog',
          timeOfDay: 'dusk',
          wind: 'crosswind',
          current: 'tidal_aid',
          logistics: ['signal_beacons', 'harbor_pilots'],
        },
      },
      {
        to: 'Timber Grove',
        via: 'road',
        notes: 'Forest road hugging the mountain river to the lumberstead',
        method: 'wagon',
        conditions: {
          biome: 'forest',
          weather: 'rain',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'supply_depots'],
        },
      },
      {
        to: 'Creekside',
        via: 'river',
        notes: 'Flatboats drift downstream with sugar and grain',
        method: 'river_barge',
        conditions: {
          biome: 'river',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'with_current',
          logistics: ['river_locks', 'ferry_slips'],
        },
      },
    ],
  },
  'Timber Grove': {
    coordinate: { q: -2, r: 0 },
    habitat: 'woodland',
    terrain: 'mountain river bend surrounded by high forests',
    elevation: 'upland',
    travelModes: ['road', 'river'],
    features: [
      'primary hardwood logging camps',
      'riverside mills and seasonal camps',
      'waystation between basin farms and coast',
    ],
    neighbors: [
      {
        to: 'Coral Keep',
        via: 'river',
        notes: 'Rafts carry timber down to the coastal forges',
        method: 'river_barge',
        conditions: {
          biome: 'river',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'with_current',
          logistics: ['river_locks', 'ferry_slips'],
        },
      },
      {
        to: 'Creekside',
        via: 'road',
        notes: 'Packed earth road through guarded clearings',
        method: 'wagon',
        conditions: {
          biome: 'forest',
          weather: 'rain',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road'],
        },
      },
    ],
  },
  Creekside: {
    coordinate: { q: -1, r: 0 },
    habitat: 'farmland',
    terrain: 'fertile basin of rivers, levees, and pastureland',
    elevation: 'lowland',
    travelModes: ['road', 'river', 'mountain_pass'],
    features: [
      'breadbasket farms and sugar refineries',
      'guild stronghold for western patrols',
      'flatboat depots linking to the gulf',
    ],
    neighbors: [
      {
        to: 'Timber Grove',
        via: 'road',
        notes: 'Short haul carrying tools uphill and lumber back',
        method: 'wagon',
        conditions: {
          biome: 'forest',
          weather: 'rain',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road'],
        },
      },
      {
        to: 'Coral Keep',
        via: 'river',
        notes: 'Sugar barges and cattle ferries drift to the gulf',
        method: 'river_barge',
        conditions: {
          biome: 'river',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'with_current',
          logistics: ['river_locks', 'ferry_slips'],
        },
      },
      {
        to: 'Warm Springs',
        via: 'mountain_pass',
        notes: 'Switchback trail into the alchemists’ refuge',
        method: 'horse',
        conditions: {
          biome: 'mountain',
          weather: 'snow',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['stone_switchbacks', 'supply_depots'],
        },
      },
      {
        to: 'Corona',
        via: 'road',
        notes: 'Trade caravans cross the plains to the capital markets',
        method: 'wagon',
        conditions: {
          biome: 'grassland',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'waystations'],
        },
      },
    ],
  },
  'Warm Springs': {
    coordinate: { q: -1, r: -1 },
    habitat: 'mountain',
    terrain: 'steep terraces dotted with geothermal vents',
    elevation: 'highland',
    travelModes: ['mountain_pass', 'road'],
    features: [
      'alchemical baths and condensers',
      'veins of precious ore',
      'healer cloisters overlooking the valley',
    ],
    neighbors: [
      {
        to: 'Creekside',
        via: 'mountain_pass',
        notes: 'Pack trains ferry reagents down the guarded switchbacks',
        method: 'horse',
        conditions: {
          biome: 'mountain',
          weather: 'snow',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['stone_switchbacks', 'supply_depots'],
        },
      },
      {
        to: 'Corona',
        via: 'road',
        notes: 'Caravans descend into the basin before turning east toward the capital',
        method: 'wagon',
        conditions: {
          biome: 'mountain',
          weather: 'fog',
          timeOfDay: 'dawn',
          wind: 'calm',
          current: 'still',
          logistics: ['stone_switchbacks', 'maintained_road'],
        },
      },
    ],
  },
  'Dancing Pines': {
    coordinate: { q: 1, r: 2 },
    habitat: 'woodland',
    terrain: 'pine-clad foothills with diamond-bearing streams',
    elevation: 'upland',
    travelModes: ['trail', 'mountain_pass'],
    features: [
      'diamond and crystal mines',
      'frontier hunting lodges',
      'artisan leather ateliers',
    ],
    neighbors: [
      {
        to: "Wave's Break",
        via: 'trail',
        notes: 'Rugged frontier trail linking the frontier camps to the port',
        method: 'horse',
        conditions: {
          biome: 'forest',
          weather: 'fog',
          timeOfDay: 'night',
          wind: 'calm',
          current: 'still',
          logistics: ['packed_trail', 'supply_depots'],
        },
      },
      {
        to: 'Corona',
        via: 'mountain_pass',
        notes: 'Guarded mountain pass descending toward the capital hinterlands',
        method: 'horse',
        conditions: {
          biome: 'mountain',
          weather: 'snow',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['stone_switchbacks', 'supply_depots'],
        },
      },
      {
        to: 'Mountain Top',
        via: 'trail',
        notes: 'Shared patrol route that keeps wetlands threats in check',
        method: 'walk',
        conditions: {
          biome: 'forest',
          weather: 'rain',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['packed_trail'],
        },
      },
    ],
  },
  'Mountain Top': {
    coordinate: { q: 0, r: 1 },
    habitat: 'mountain',
    terrain: 'plateau fortress overlooking wetlands frontier',
    elevation: 'upland',
    travelModes: ['road', 'trail'],
    features: [
      'beacon tower guarding the wetlands pass',
      'terraced farms fed by a spring reservoir',
      'major caravanserai splitting east-west journeys',
    ],
    neighbors: [
      {
        to: 'Corona',
        via: 'road',
        notes: 'Royal road keeps caravans supplied between the capital and gate',
        method: 'wagon',
        conditions: {
          biome: 'grassland',
          weather: 'rain',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'waystations'],
        },
      },
      {
        to: "Wave's Break",
        via: 'road',
        notes: 'Road crews maintain the only safe southern approach to the coast',
        method: 'wagon',
        conditions: {
          biome: 'marsh',
          weather: 'storm',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'supply_depots'],
        },
      },
      {
        to: 'Dancing Pines',
        via: 'trail',
        notes: 'Scout patrols follow this route to secure the pine frontier',
        method: 'horse',
        conditions: {
          biome: 'forest',
          weather: 'fog',
          timeOfDay: 'dawn',
          wind: 'calm',
          current: 'still',
          logistics: ['packed_trail'],
        },
      },
    ],
  },
  Corona: {
    coordinate: { q: 0, r: 0 },
    habitat: 'urban',
    terrain: 'fortified capital amid irrigated plains',
    elevation: 'lowland',
    travelModes: ['road', 'river', 'mountain_pass'],
    features: [
      'royal citadel and guild headquarters',
      'grain plains feeding the realm',
      'launch point for wetlands expeditions',
    ],
    neighbors: [
      {
        to: 'Mountain Top',
        via: 'road',
        notes: 'Primary staging route for wetlands patrols',
        method: 'wagon',
        conditions: {
          biome: 'marsh',
          weather: 'rain',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'supply_depots'],
        },
      },
      {
        to: 'Creekside',
        via: 'road',
        notes: 'Farmland road delivering western grain and cattle',
        method: 'wagon',
        conditions: {
          biome: 'grassland',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'waystations'],
        },
      },
      {
        to: 'Whiteheart',
        via: 'road',
        notes: 'Forest road under constant patrol',
        method: 'wagon',
        conditions: {
          biome: 'forest',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'waystations'],
        },
      },
      {
        to: 'Corner Stone',
        via: 'road',
        notes: 'Northern royal road tracing the great river upstream',
        method: 'wagon',
        conditions: {
          biome: 'river',
          weather: 'fog',
          timeOfDay: 'dawn',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'river_locks'],
        },
      },
      {
        to: 'Warm Springs',
        via: 'road',
        notes: 'Mountain caravans carry alchemical goods to the capital',
        method: 'wagon',
        conditions: {
          biome: 'mountain',
          weather: 'snow',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['stone_switchbacks', 'maintained_road'],
        },
      },
      {
        to: 'Dancing Pines',
        via: 'mountain_pass',
        notes: 'Escorted runs delivering diamonds to the royal vaults',
        method: 'horse',
        conditions: {
          biome: 'mountain',
          weather: 'snow',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['stone_switchbacks', 'supply_depots'],
        },
      },
      {
        to: 'Duvilia Kingdom',
        via: 'road',
        distance: 1,
        notes: 'Corona embodies the heart of the broader kingdom map',
        method: 'wagon',
        conditions: {
          biome: 'grassland',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['paved_road', 'waystations'],
        },
      },
    ],
  },
  Whiteheart: {
    coordinate: { q: 0, r: -1 },
    habitat: 'woodland',
    terrain: 'newly cleared frontier amid pale-barked forests',
    elevation: 'upland',
    travelModes: ['road', 'trail'],
    features: [
      'guild barracks and scouting lodges',
      'logging clearings expanding eastward',
      'monster suppression patrol routes',
    ],
    neighbors: [
      {
        to: 'Corona',
        via: 'road',
        notes: 'Halfway rest for caravans between capital and northern artisans',
        method: 'wagon',
        conditions: {
          biome: 'forest',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'waystations'],
        },
      },
      {
        to: 'Corner Stone',
        via: 'road',
        notes: 'Forest road hugging river bluffs toward the artisan citadel',
        method: 'wagon',
        conditions: {
          biome: 'forest',
          weather: 'rain',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road'],
        },
      },
    ],
  },
  'Corner Stone': {
    coordinate: { q: 0, r: -2 },
    habitat: 'urban',
    terrain: 'mountain river terraces carved with guild halls',
    elevation: 'upland',
    travelModes: ['road', 'river', 'trail'],
    features: [
      'mithril and adamantine trade from dwarven allies',
      'royal mint and guild courts',
      'granite walls crowning the river gorge',
    ],
    neighbors: [
      {
        to: 'Corona',
        via: 'road',
        notes: 'Northern royal road lines the river between capital and citadel',
        method: 'wagon',
        conditions: {
          biome: 'river',
          weather: 'fog',
          timeOfDay: 'dawn',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road', 'river_locks'],
        },
      },
      {
        to: 'Whiteheart',
        via: 'road',
        notes: 'Forest patrol route guarding caravans and lumber trains',
        method: 'wagon',
        conditions: {
          biome: 'forest',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['maintained_road'],
        },
      },
      {
        to: "Dragon's Reach Road",
        via: 'trail',
        notes: 'Frontier ascent toward the dragonlands and high plateaus',
        method: 'horse',
        conditions: {
          biome: 'mountain',
          weather: 'snow',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['stone_switchbacks', 'packed_trail'],
        },
      },
      {
        to: 'Duvilia Kingdom',
        via: 'road',
        distance: 2,
        notes: 'Corner Stone anchors the northern arc of the kingdom map',
        method: 'wagon',
        conditions: {
          biome: 'mountain',
          weather: 'clear',
          timeOfDay: 'day',
          wind: 'calm',
          current: 'still',
          logistics: ['paved_road', 'waystations'],
        },
      },
    ],
  },
  "Dragon's Reach Road": {
    coordinate: { q: 0, r: -3 },
    habitat: 'woodland',
    terrain: 'subalpine lake and dragon-haunted ridgelines',
    elevation: 'highland',
    travelModes: ['trail'],
    features: [
      'last outpost before the dragonlands',
      'orchards and hunting camps in cold forests',
      'quest staging ground for high-tier adventurers',
    ],
    neighbors: [
      {
        to: 'Corner Stone',
        via: 'trail',
        notes: 'Supply trains wind through steep switchbacks to the artisan citadel',
        method: 'horse',
        conditions: {
          biome: 'mountain',
          weather: 'snow',
          timeOfDay: 'night',
          wind: 'calm',
          current: 'still',
          logistics: ['stone_switchbacks'],
        },
      },
    ],
  },
};

function finalizeHexGrid(
  raw: Record<string, HexLocationInput>,
): Record<string, HexLocation> {
  const grid: Record<string, HexLocation> = {};
  for (const [name, location] of Object.entries(raw)) {
    const neighbors: HexNeighbor[] = location.neighbors.map((neighbor) => {
      const target = raw[neighbor.to];
      if (!target) {
        throw new Error(`Hex grid reference for ${neighbor.to} is missing (referenced by ${name}).`);
      }
      const distance =
        neighbor.distance ?? hexDistance(location.coordinate, target.coordinate);
      const method = neighbor.method ?? DEFAULT_METHOD_FOR_MODE[neighbor.via];
      const appliedConditions = resolveTravelConditions(
        neighbor.via,
        method,
        neighbor.conditions,
        location,
        target,
      );
      const travelTimeDays =
        neighbor.travelTimeDays ?? computeTravelTime(distance, method, appliedConditions);
      return {
        to: neighbor.to,
        via: neighbor.via,
        method,
        distance,
        travelTimeDays,
        notes: neighbor.notes,
        conditions: appliedConditions,
      };
    });
    grid[name] = {
      name,
      coordinate: location.coordinate,
      habitat: location.habitat,
      terrain: location.terrain,
      elevation: location.elevation,
      travelModes: location.travelModes,
      features: location.features,
      neighbors,
    };
  }
  return grid;
}

export const KINGDOM_HEX_GRID: Record<string, HexLocation> = finalizeHexGrid(
  RAW_HEX_GRID,
);

export function getHexLocation(name: string): HexLocation | undefined {
  return KINGDOM_HEX_GRID[name];
}

export function locationDistance(from: string, to: string): number | undefined {
  const origin = KINGDOM_HEX_GRID[from];
  const destination = KINGDOM_HEX_GRID[to];
  if (!origin || !destination) {
    return undefined;
  }
  return hexDistance(origin.coordinate, destination.coordinate);
}

export function sharedTravelOptions(name: string): HexTravelMode[] {
  const origin = KINGDOM_HEX_GRID[name];
  if (!origin) {
    return [];
  }
  const modes = new Set<HexTravelMode>(origin.travelModes);
  origin.neighbors.forEach((neighbor) => modes.add(neighbor.via));
  return Array.from(modes);
}
