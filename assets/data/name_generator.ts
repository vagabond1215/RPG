export type Race = 'Human' | 'Elf' | 'Dwarf' | 'Halfling';
export type Sex = 'Male' | 'Female' | 'Nonbinary';
export type Station =
  | 'commoner'
  | 'artisan'
  | 'guild'
  | 'noble'
  | 'clergy'
  | 'military'
  | 'academic';

export interface NameOptions {
  race?: Race;
  sex?: Sex;
  station?: Station;
  familyKey?: string;
  familyName?: string;
  allowReuse?: boolean;
}

export interface GeneratedNpcName {
  race: Race;
  sex: Sex;
  station: Station;
  givenName: string;
  familyName: string;
  fullName: string;
}

type StationNameSet = {
  male: string[];
  female: string[];
  nonbinary: string[];
  family: string[];
};

type RaceNameData = Record<Station | 'any', StationNameSet>;

const HUMAN_NAMES: RaceNameData = {
  commoner: {
    male: [
      'Arel',
      'Brann',
      'Dovan',
      'Elric',
      'Garen',
      'Hullen',
      'Ilyan',
      'Joran',
      'Kale',
      'Malen',
      'Torv',
      'Vel',
      'Yorsen',
    ],
    female: [
      'Brisa',
      'Deryn',
      'Helda',
      'Jessa',
      'Lileth',
      'Maera',
      'Maris',
      'Neral',
      'Nyla',
      'Riala',
      'Selka',
      'Seraphine',
      'Tarsa',
      'Varla',
    ],
    nonbinary: ['Aelis', 'Galen', 'Mave', 'Ryn', 'Sera'],
    family: [
      'Tidemold',
      'Saltbound',
      'Cliffbloom',
      'Driftfell',
      'Foamfield',
      'Gullwind',
      'Harborwind',
      'Mistflower',
      'Moorlight',
      'Seabreeze',
      'Seawisp',
      'Saltmeadow',
      'Sunmellow',
      'Tideflock',
      'Windward',
    ],
  },
  artisan: {
    male: ['Calder', 'Corin', 'Daska', 'Dorel', 'Galen', 'Korin', 'Marlen', 'Perrin'],
    female: ['Aurelia', 'Eliane', 'Ilvara', 'Marlenna', 'Selene', 'Serapha', 'Tella'],
    nonbinary: ['Aris', 'Cerin', 'Lior', 'Mira'],
    family: [
      'Anchorfast',
      'Brinebark',
      'Brinemarrow',
      'Cristalle',
      'Threadneedle',
      'Woodhand',
      'Seawind',
      'Saltroot',
      'Emberflask',
      'Leafpress',
    ],
  },
  guild: {
    male: ['Brakka', 'Darel', 'Pell', 'Storm', 'Sella', 'Tolen', 'Yarik'],
    female: ['Aelric', 'Liora', 'Maren', 'Mira', 'Neris', 'Seren', 'Ysa'],
    nonbinary: ['Corvel', 'Rellis', 'Valen'],
    family: ['Ironbent', 'Stormkeel', 'Crestshield', 'Rollingwave', 'Saltmaster', 'Calderis', 'Selkanet', 'Stonebridge'],
  },
  noble: {
    male: ['Delmar', 'Highran', 'Lysandor', 'Marlon', 'Thalen'],
    female: ['Aurena', 'Calisse', 'Lyselle', 'Serenna', 'Veleth'],
    nonbinary: ['Aurel', 'Selian'],
    family: ['Highward', 'Delmare', 'Lyrecrown', 'Marblefinch', 'Aurora', 'Goldleaf'],
  },
  clergy: {
    male: ['Callus', 'Helion', 'Maerin', 'Torlan'],
    female: ['Maela', 'Sunya', 'Tideia', 'Vara'],
    nonbinary: ['Grels', 'Lumin'],
    family: ['Tideborn', 'Tidecaller', 'Sunward', 'Greensoul', 'Harvestmother', 'Shieldmarch'],
  },
  military: {
    male: ['Arel', 'Brisa', 'Ilyan', 'Kass', 'Orven'],
    female: ['Brisa', 'Nyla', 'Selune', 'Tersa'],
    nonbinary: ['Hullen', 'Ryn', 'Yorsen'],
    family: ['Gatewatch', 'Shieldmarch', 'Tidewatcher', 'Ironwatch'],
  },
  academic: {
    male: ['Bright', 'Callis', 'Rellis', 'Thalen'],
    female: ['Ilvara', 'Mera', 'Selise', 'Varia'],
    nonbinary: ['Aeris', 'Lior', 'Quill'],
    family: ['Brightmere', 'Leafward', 'Quillion', 'Starweaver', 'Cristalle'],
  },
  any: {
    male: [],
    female: [],
    nonbinary: [],
    family: [],
  },
};

const ELF_NAMES: RaceNameData = {
  any: {
    male: ['Aelar', 'Theron', 'Fenian', 'Lethar'],
    female: ['Aelene', 'Sylvaris', 'Thalisa', 'Liarel'],
    nonbinary: ['Caelith', 'Rythian', 'Velis'],
    family: ['Moonglade', 'Silverfrond', 'Starwind', 'Riverwhisper', 'Leafglade'],
  },
  commoner: { male: [], female: [], nonbinary: [], family: [] },
  artisan: { male: [], female: [], nonbinary: [], family: [] },
  guild: { male: [], female: [], nonbinary: [], family: [] },
  noble: { male: [], female: [], nonbinary: [], family: [] },
  clergy: { male: [], female: [], nonbinary: [], family: [] },
  military: { male: [], female: [], nonbinary: [], family: [] },
  academic: { male: [], female: [], nonbinary: [], family: [] },
};

const DWARF_NAMES: RaceNameData = {
  any: {
    male: ['Borin', 'Karrin', 'Rurik', 'Thorin'],
    female: ['Dagna', 'Hildi', 'Mava', 'Sigrid'],
    nonbinary: ['Astri', 'Broden', 'Lorn'],
    family: ['Stoneforge', 'Ironvein', 'Coppervein', 'Stormhammer', 'Deepdelve'],
  },
  commoner: { male: [], female: [], nonbinary: [], family: [] },
  artisan: { male: [], female: [], nonbinary: [], family: [] },
  guild: { male: [], female: [], nonbinary: [], family: [] },
  noble: { male: [], female: [], nonbinary: [], family: [] },
  clergy: { male: [], female: [], nonbinary: [], family: [] },
  military: { male: [], female: [], nonbinary: [], family: [] },
  academic: { male: [], female: [], nonbinary: [], family: [] },
};

const HALFLING_NAMES: RaceNameData = {
  any: {
    male: ['Perrin', 'Milo', 'Thom', 'Wylan'],
    female: ['Lily', 'Tamsin', 'Briala', 'Rysa'],
    nonbinary: ['Brindle', 'Fen', 'Quince'],
    family: ['Tealeaf', 'Underbough', 'Fairbarrel', 'Goodbarrel', 'Greenbottle'],
  },
  commoner: { male: [], female: [], nonbinary: [], family: [] },
  artisan: { male: [], female: [], nonbinary: [], family: [] },
  guild: { male: [], female: [], nonbinary: [], family: [] },
  noble: { male: [], female: [], nonbinary: [], family: [] },
  clergy: { male: [], female: [], nonbinary: [], family: [] },
  military: { male: [], female: [], nonbinary: [], family: [] },
  academic: { male: [], female: [], nonbinary: [], family: [] },
};

const NAME_DATA: Record<Race, RaceNameData> = {
  Human: HUMAN_NAMES,
  Elf: ELF_NAMES,
  Dwarf: DWARF_NAMES,
  Halfling: HALFLING_NAMES,
};

const DEFAULT_RACE: Race = 'Human';
const DEFAULT_SEX: Sex = 'Female';
const DEFAULT_STATION: Station = 'commoner';

const usedGivenNames = new Map<string, Set<string>>();
const usedFamilyNames = new Map<string, Set<string>>();
const familyRegistry = new Map<string, { familyName: string; race: Race; station: Station }>();

function stationKey(race: Race, station: Station, sex: Sex) {
  return `${race}:${station}:${sex}`;
}

function familyKey(race: Race, station: Station) {
  return `${race}:${station}`;
}

function getStationData(race: Race, station: Station): StationNameSet {
  const raceData = NAME_DATA[race] || NAME_DATA[DEFAULT_RACE];
  const data = raceData[station];
  if (data && (data.male.length || data.female.length || data.nonbinary.length || data.family.length)) {
    return data;
  }
  return raceData.any;
}

function ensureSet(map: Map<string, Set<string>>, key: string) {
  let set = map.get(key);
  if (!set) {
    set = new Set();
    map.set(key, set);
  }
  return set;
}

function pickFromList(list: string[], used: Set<string>, allowReuse?: boolean): string {
  for (const value of list) {
    if (!used.has(value)) {
      used.add(value);
      return value;
    }
  }
  if (!list.length) {
    return '';
  }
  if (allowReuse) {
    const choice = list[0];
    used.clear();
    used.add(choice);
    return choice;
  }
  used.clear();
  const choice = list[0];
  used.add(choice);
  return choice;
}

function pickGivenName(
  race: Race,
  station: Station,
  sex: Sex,
  allowReuse?: boolean,
): string {
  const stationData = getStationData(race, station);
  const key = stationKey(race, station, sex);
  const used = ensureSet(usedGivenNames, key);
  let candidates: string[] = [];
  if (sex === 'Male') {
    candidates = stationData.male.length ? stationData.male : stationData.female.concat(stationData.nonbinary);
  } else if (sex === 'Female') {
    candidates = stationData.female.length ? stationData.female : stationData.male.concat(stationData.nonbinary);
  } else {
    candidates = stationData.nonbinary.length
      ? stationData.nonbinary
      : stationData.male.concat(stationData.female);
  }
  if (!candidates.length) {
    candidates = ['Adventurer'];
  }
  return pickFromList(candidates, used, allowReuse);
}

function pickFamilyName(
  race: Race,
  station: Station,
  allowReuse?: boolean,
): string {
  const stationData = getStationData(race, station);
  const key = familyKey(race, station);
  const used = ensureSet(usedFamilyNames, key);
  const candidates = stationData.family.length ? stationData.family : ['Freelancer'];
  return pickFromList(candidates, used, allowReuse);
}

export function registerFamily(
  key: string,
  familyName: string,
  opts: { race?: Race; station?: Station } = {},
) {
  const race = opts.race || DEFAULT_RACE;
  const station = opts.station || DEFAULT_STATION;
  familyRegistry.set(key, { familyName, race, station });
  const used = ensureSet(usedFamilyNames, familyKey(race, station));
  used.add(familyName);
}

export function clearNameGenerator() {
  usedGivenNames.clear();
  usedFamilyNames.clear();
  familyRegistry.clear();
}

export function generateNpcName(options: NameOptions = {}): GeneratedNpcName {
  const race = options.race || DEFAULT_RACE;
  const station = options.station || DEFAULT_STATION;
  const sex = options.sex || DEFAULT_SEX;
  const allowReuse = options.allowReuse ?? false;

  let familyName: string;
  if (options.familyKey) {
    const existing = familyRegistry.get(options.familyKey);
    if (existing) {
      familyName = existing.familyName;
    } else if (options.familyName) {
      familyName = options.familyName;
      registerFamily(options.familyKey, familyName, { race, station });
    } else {
      familyName = pickFamilyName(race, station, allowReuse);
      registerFamily(options.familyKey, familyName, { race, station });
    }
  } else if (options.familyName) {
    familyName = options.familyName;
  } else {
    familyName = pickFamilyName(race, station, allowReuse);
  }

  const givenName = pickGivenName(race, station, sex, allowReuse);
  const fullName = `${givenName} ${familyName}`.trim();

  return {
    race,
    sex,
    station,
    givenName,
    familyName,
    fullName,
  };
}
