export const DAYS_PER_MONTH = 28;
export const MONTH_COUNT = 13;
export const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTH_COUNT;

export const MONTHS = [
  {
    index: 0,
    name: 'Vernal Crown',
    shortName: 'Vernal',
    constellation: 'Vernal Crown',
    season: 'Spring',
    description:
      'A circlet of seven stars called the Vernal Crown blooms over the horizon, marking spring\'s first festivals.',
  },
  {
    index: 1,
    name: 'Grove Serpent',
    shortName: 'Grove',
    constellation: 'Grove Serpent',
    season: 'Spring',
    description:
      'The Grove Serpent winds between twin oaks, a stellar serpent said to wake the forests after winter\'s sleep.',
  },
  {
    index: 2,
    name: 'Sky Shepherd',
    shortName: 'Shepherd',
    constellation: 'Sky Shepherd',
    season: 'Spring',
    description:
      'Folktales claim the Sky Shepherd guides migrating beasts across the night, promising fertile pastures.',
  },
  {
    index: 3,
    name: 'Thunder Roc',
    shortName: 'Roc',
    constellation: 'Thunder Roc',
    season: 'Summer',
    description:
      'The Thunder Roc spreads storm-feathered wings, warning travelers of booming summer squalls.',
  },
  {
    index: 4,
    name: 'Sunforge Lion',
    shortName: 'Sunforge',
    constellation: 'Sunforge Lion',
    season: 'Summer',
    description:
      'A mane of molten light forms the Sunforge Lion, symbolizing the relentless heat of high summer.',
  },
  {
    index: 5,
    name: 'Mirage Stag',
    shortName: 'Mirage',
    constellation: 'Mirage Stag',
    season: 'Summer',
    description:
      'Shimmering antlers arch across the zenith, the Mirage Stag leading caravans through wavering heat.',
  },
  {
    index: 6,
    name: 'Harvest Crown',
    shortName: 'Harvest',
    constellation: 'Harvest Crown',
    season: 'Autumn',
    description:
      'Reapers celebrate the Harvest Crown, a halo of stars that ripens grain beneath its glow.',
  },
  {
    index: 7,
    name: 'Ashen Fox',
    shortName: 'Fox',
    constellation: 'Ashen Fox',
    season: 'Autumn',
    description:
      'Storykeepers track the Ashen Fox as it darts through falling leaves, heralding chilly winds.',
  },
  {
    index: 8,
    name: 'Twilight Loom',
    shortName: 'Loom',
    constellation: 'Twilight Loom',
    season: 'Autumn',
    description:
      'The Twilight Loom threads violet light across dusk skies, said to weave hearthward paths home.',
  },
  {
    index: 9,
    name: 'Frostbound Ram',
    shortName: 'Ram',
    constellation: 'Frostbound Ram',
    season: 'Winter',
    description:
      'The Frostbound Ram charges ahead of winter\'s first snow, its horns gleaming with frostfire.',
  },
  {
    index: 10,
    name: 'Glacier Leviathan',
    shortName: 'Glacier',
    constellation: 'Glacier Leviathan',
    season: 'Winter',
    description:
      'Legends speak of the Glacier Leviathan slumbering beneath frozen seas, stirring during the longest nights.',
  },
  {
    index: 11,
    name: 'Nocturne Compass',
    shortName: 'Nocturne',
    constellation: 'Nocturne Compass',
    season: 'Winter',
    description:
      'Navigators align by the Nocturne Compass, a four-point star that points toward hidden midwinter stars.',
  },
  {
    index: 12,
    name: 'Aurora Piper',
    shortName: 'Piper',
    constellation: 'Aurora Piper',
    season: 'Winter',
    description:
      'The Aurora Piper plays luminous notes that sweep color over the sky, beckoning spring\'s return.',
  },
];

function toAbsoluteDay(date) {
  return date.year * DAYS_PER_YEAR + date.monthIndex * DAYS_PER_MONTH + (date.day - 1);
}

function fromAbsoluteDay(dayNumber) {
  let year = Math.floor(dayNumber / DAYS_PER_YEAR);
  let dayOfYear = dayNumber % DAYS_PER_YEAR;
  if (dayOfYear < 0) {
    dayOfYear += DAYS_PER_YEAR;
    year -= 1;
  }
  const monthIndex = Math.floor(dayOfYear / DAYS_PER_MONTH);
  const day = (dayOfYear % DAYS_PER_MONTH) + 1;
  return { year, monthIndex, day };
}

export function normalizeDate(date) {
  return fromAbsoluteDay(toAbsoluteDay(date));
}

export function advanceDate(date, days) {
  return fromAbsoluteDay(toAbsoluteDay(date) + days);
}

export function compareDates(a, b) {
  const diff = toAbsoluteDay(a) - toAbsoluteDay(b);
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

export function isSameDate(a, b) {
  return compareDates(a, b) === 0;
}

export function dayOfYear(date) {
  const absolute = toAbsoluteDay(date);
  const startOfYear = date.year * DAYS_PER_YEAR;
  return absolute - startOfYear + 1;
}

export function getMonth(index) {
  return MONTHS[(index % MONTH_COUNT + MONTH_COUNT) % MONTH_COUNT];
}

export function getSeasonForDate(date) {
  return getMonth(date.monthIndex).season;
}

export function formatCalendarDate(date) {
  const month = getMonth(date.monthIndex);
  return `${date.day} ${month.name}, ${date.year}`;
}

export function dateKey(date) {
  const month = String(date.monthIndex + 1).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  return `${date.year}-${month}-${day}`;
}

export class TidefallCalendar {
  constructor(start) {
    const base = {
      year: (start === null || start === void 0 ? void 0 : start.year) ?? 732,
      monthIndex: (start === null || start === void 0 ? void 0 : start.monthIndex) ?? 0,
      day: (start === null || start === void 0 ? void 0 : start.day) ?? 1,
    };
    this.current = normalizeDate(base);
  }

  today() {
    return Object.assign({}, this.current);
  }

  season() {
    return getSeasonForDate(this.current);
  }

  advance(days = 1) {
    this.current = advanceDate(this.current, days);
    return this.today();
  }

  setDate(date) {
    this.current = normalizeDate(date);
  }

  rewind(days = 1) {
    return this.advance(-days);
  }

  formatCurrentDate() {
    return formatCalendarDate(this.current);
  }
}
