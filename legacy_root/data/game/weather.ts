import {
  advanceDate,
  compareDates,
  dateKey,
  dayOfYear,
  getSeasonForDate,
  normalizeDate,
} from './calendar.js';
import type { CalendarDate, CalendarSeason } from './calendar.js';

export type Habitat = 'coastal' | 'farmland' | 'urban' | 'woodland' | 'mountain' | 'river';
export type WeatherCondition =
  | 'clear'
  | 'partly cloudy'
  | 'overcast'
  | 'drizzle'
  | 'rain'
  | 'storm'
  | 'fog'
  | 'snow'
  | 'sleet';

interface TemperatureProfile {
  min: number;
  max: number;
  variability: number;
}

interface PrecipitationProfile {
  chance: number;
  stormChance: number;
  minMm: number;
  maxMm: number;
  fogChance?: number;
  drizzleChance?: number;
}

interface HabitatSoilProfile {
  baseMoisture: number;
  infiltration: number;
  retention: number;
  droughtThreshold: number;
  floodThreshold: number;
}

interface HabitatClimate {
  temperature: Record<CalendarSeason, TemperatureProfile>;
  precipitation: Record<CalendarSeason, PrecipitationProfile>;
  humidity: Record<CalendarSeason, number>;
  evaporation: Record<CalendarSeason, number>;
  soil: HabitatSoilProfile;
}

export interface RegionClimateProfile {
  key: string;
  label: string;
  habitats: Partial<Record<Habitat, HabitatClimate>>;
  prevailingWinds?: string;
  notes?: string;
}

interface WeatherState {
  soilMoisture: number;
  dryStreak: number;
  wetStreak: number;
  lastStormDay: number | null;
  lastSimulated: CalendarDate | null;
  lastReport: WeatherReport | null;
}

export interface WeatherTrend {
  drySpellDays: number;
  wetSpellDays: number;
  lastStormDaysAgo: number | null;
}

export interface WeatherOutlook {
  stormLikely: boolean;
  drySpellLikely: boolean;
  floodLikely: boolean;
  expectedCondition: WeatherCondition;
  demandModifier: number;
}

export interface WeatherReport {
  region: string;
  habitat: Habitat;
  date: CalendarDate;
  season: CalendarSeason;
  temperatureC: number;
  humidity: number;
  precipitationMm: number;
  condition: WeatherCondition;
  soilMoisture: number;
  droughtStage: 'none' | 'watch' | 'warning';
  floodRisk: 'none' | 'watch' | 'warning';
  storm: boolean;
  trend: WeatherTrend;
  outlook: WeatherOutlook;
  narrative: string;
}

const CLAMP = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createDeterministicRandom(key: string): () => number {
  let state = hashString(key) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return (state >>> 0) / 4294967296;
  };
}

export function deterministicRandom(key: string): number {
  return createDeterministicRandom(key)();
}

function cloneDate(date: CalendarDate): CalendarDate {
  return { year: date.year, monthIndex: date.monthIndex, day: date.day };
}

function createInitialState(soil: HabitatSoilProfile): WeatherState {
  return {
    soilMoisture: soil.baseMoisture,
    dryStreak: 0,
    wetStreak: 0,
    lastStormDay: null,
    lastSimulated: null,
    lastReport: null,
  };
}

function pickCondition(
  temperature: number,
  precipitationMm: number,
  isStorm: boolean,
  hasDrizzle: boolean,
  foggy: boolean,
): WeatherCondition {
  if (isStorm) return temperature <= 0 ? 'snow' : 'storm';
  if (temperature <= -1 && precipitationMm > 0) return 'snow';
  if (temperature <= 1 && precipitationMm > 0) return 'sleet';
  if (precipitationMm > 3) return 'rain';
  if (hasDrizzle) return 'drizzle';
  if (foggy) return 'fog';
  if (precipitationMm > 0) return 'partly cloudy';
  return temperature > 25 ? 'clear' : 'partly cloudy';
}

function buildNarrative(
  condition: WeatherCondition,
  habitat: Habitat,
  droughtStage: 'none' | 'watch' | 'warning',
  floodRisk: 'none' | 'watch' | 'warning',
  storm: boolean,
): string {
  const parts: string[] = [];
  if (storm) {
    parts.push('Squalls batter the coastline, sending crews scrambling.');
  } else if (condition === 'rain' || condition === 'drizzle') {
    parts.push('Steady precipitation keeps laborers working under tarps.');
  } else if (condition === 'snow') {
    parts.push('Wet snow weighs on rooftops and harbor ropes.');
  } else if (condition === 'fog') {
    parts.push('Fog settles in low, muting lantern light.');
  } else if (condition === 'clear') {
    parts.push('Bright skies give crews a full day of travel.');
  }
  if (droughtStage === 'warning') {
    parts.push('Fields crack under the ongoing dry spell.');
  } else if (droughtStage === 'watch') {
    parts.push('Soil moisture is thinning across the ' + habitat + '.');
  }
  if (floodRisk === 'warning') {
    parts.push('Ditches overflow and low alleys pool with water.');
  } else if (floodRisk === 'watch') {
    parts.push('Drainage crews keep an eye on runoff channels.');
  }
  return parts.join(' ');
}

function computeOutlook(
  rng: () => number,
  precipitation: PrecipitationProfile,
  soil: HabitatSoilProfile,
  season: CalendarSeason,
  storm: boolean,
  soilMoisture: number,
  trend: WeatherTrend,
  temperature: number,
): WeatherOutlook {
  const baseStormChance = precipitation.stormChance * (precipitation.chance + trend.wetSpellDays * 0.05);
  const stormLikely = rng() < CLAMP(baseStormChance + (storm ? 0.2 : 0), 0, 0.95);
  const droughtGap = CLAMP(soil.droughtThreshold - soilMoisture, -1, 1);
  const drySpellLikely = rng() < CLAMP(0.15 + Math.max(0, droughtGap) * 0.8, 0, 0.95);
  const floodLikely = rng() < CLAMP(Math.max(0, soilMoisture - soil.floodThreshold) * 1.2, 0, 0.9);
  let expectedCondition: WeatherCondition = 'partly cloudy';
  if (stormLikely) {
    expectedCondition = temperature <= 0 ? 'snow' : 'storm';
  } else if (drySpellLikely) {
    expectedCondition = 'clear';
  } else if (floodLikely) {
    expectedCondition = 'rain';
  }
  const demandModifier = CLAMP(
    (storm ? 0.15 : 0) +
      (drySpellLikely ? 0.1 : 0) +
      (floodLikely ? 0.1 : 0) +
      (season === 'Autumn' ? 0.05 : 0),
    -0.25,
    0.4,
  );
  return { stormLikely, drySpellLikely, floodLikely, expectedCondition, demandModifier };
}

function updateSoil(
  state: WeatherState,
  soil: HabitatSoilProfile,
  precipitationMm: number,
  evaporationRate: number,
  temperature: number,
  isStorm: boolean,
  currentDay: number,
) {
  if (precipitationMm > 0) {
    const absorption = CLAMP((precipitationMm / 25) * soil.infiltration, 0, 1);
    state.soilMoisture = CLAMP(
      state.soilMoisture * soil.retention + absorption,
      0,
      1,
    );
    state.dryStreak = 0;
    state.wetStreak += 1;
    if (isStorm || precipitationMm > 12) {
      state.lastStormDay = currentDay;
    }
  } else {
    const heatFactor = temperature > 20 ? 1 + (temperature - 20) / 40 : 1;
    state.soilMoisture = CLAMP(
      state.soilMoisture * soil.retention - evaporationRate * heatFactor,
      0,
      1,
    );
    state.dryStreak += 1;
    state.wetStreak = 0;
  }
}

function computeHydrologyFlags(
  state: WeatherState,
  soil: HabitatSoilProfile,
): { droughtStage: 'none' | 'watch' | 'warning'; floodRisk: 'none' | 'watch' | 'warning' } {
  let droughtStage: 'none' | 'watch' | 'warning' = 'none';
  let floodRisk: 'none' | 'watch' | 'warning' = 'none';

  if (state.soilMoisture <= soil.droughtThreshold) {
    droughtStage = state.dryStreak >= 4 ? 'warning' : 'watch';
  }

  if (state.soilMoisture >= soil.floodThreshold) {
    floodRisk = state.wetStreak >= 3 ? 'warning' : 'watch';
  }

  return { droughtStage, floodRisk };
}

export class RegionalWeatherGenerator {
  private readonly climates: Record<string, RegionClimateProfile>;
  private readonly states = new Map<string, WeatherState>();
  private readonly startDate: CalendarDate;

  constructor(
    profiles: RegionClimateProfile[] | Record<string, RegionClimateProfile>,
    startDate?: CalendarDate,
  ) {
    if (Array.isArray(profiles)) {
      this.climates = Object.fromEntries(profiles.map((profile) => [profile.key, profile]));
    } else {
      this.climates = { ...profiles };
    }
    this.startDate = startDate ? normalizeDate(startDate) : { year: 732, monthIndex: 0, day: 1 };
  }

  reset(regionKey?: string, habitat?: Habitat): void {
    if (regionKey && habitat) {
      this.states.delete(this.stateKey(regionKey, habitat));
      return;
    }
    if (regionKey) {
      Array.from(this.states.keys()).forEach((key) => {
        if (key.startsWith(`${regionKey}:`)) {
          this.states.delete(key);
        }
      });
      return;
    }
    this.states.clear();
  }

  getDailyWeather(regionKey: string, habitat: Habitat, date: CalendarDate): WeatherReport {
    const climate = this.climates[regionKey];
    if (!climate) {
      throw new Error(`Unknown climate region: ${regionKey}`);
    }
    const habitatClimate = climate.habitats[habitat];
    if (!habitatClimate) {
      throw new Error(`No climate profile for habitat ${habitat} in ${regionKey}`);
    }

    const key = this.stateKey(regionKey, habitat);
    let state = this.states.get(key);
    if (!state) {
      state = createInitialState(habitatClimate.soil);
      this.states.set(key, state);
    }

    const targetDate = normalizeDate(date);

    if (!state.lastSimulated) {
      state.lastSimulated = advanceDate(this.startDate, -1);
      state.lastReport = null;
    }

    if (compareDates(targetDate, state.lastSimulated) < 0) {
      state = createInitialState(habitatClimate.soil);
      state.lastSimulated = advanceDate(this.startDate, -1);
      state.lastReport = null;
      this.states.set(key, state);
    }

    while (compareDates(state.lastSimulated, targetDate) < 0) {
      const nextDate = advanceDate(state.lastSimulated, 1);
      const report = this.simulateDay(regionKey, habitat, habitatClimate, state, nextDate);
      state.lastSimulated = cloneDate(nextDate);
      state.lastReport = report;
    }

    if (!state.lastReport) {
      state.lastReport = this.simulateDay(regionKey, habitat, habitatClimate, state, targetDate);
      state.lastSimulated = cloneDate(targetDate);
    }

    return state.lastReport;
  }

  private stateKey(regionKey: string, habitat: Habitat): string {
    return `${regionKey}:${habitat}`;
  }

  private simulateDay(
    regionKey: string,
    habitat: Habitat,
    climate: HabitatClimate,
    state: WeatherState,
    date: CalendarDate,
  ): WeatherReport {
    const season = getSeasonForDate(date);
    const rng = createDeterministicRandom(`${regionKey}:${habitat}:${dateKey(date)}`);

    const tempProfile = climate.temperature[season];
    const baseTemp = tempProfile.min + (tempProfile.max - tempProfile.min) * rng();
    const temperatureC = baseTemp + (rng() - 0.5) * tempProfile.variability;

    const humidityBase = climate.humidity[season];
    const humidity = CLAMP(humidityBase + (rng() - 0.5) * 10, 35, 100);

    const precipProfile = climate.precipitation[season];
    const precipRoll = rng();
    let precipitationMm = 0;
    let isStorm = false;
    let hasDrizzle = false;
    let foggy = false;

    if (precipRoll < precipProfile.chance) {
      const intensity = precipProfile.minMm + (precipProfile.maxMm - precipProfile.minMm) * rng();
      precipitationMm = Math.max(0, intensity);
      isStorm = rng() < precipProfile.stormChance;
      if (!isStorm && precipProfile.drizzleChance) {
        hasDrizzle = rng() < precipProfile.drizzleChance;
      }
    } else if (precipProfile.fogChance && rng() < precipProfile.fogChance) {
      foggy = true;
    }

    const condition = pickCondition(temperatureC, precipitationMm, isStorm, hasDrizzle, foggy);

    updateSoil(
      state,
      climate.soil,
      precipitationMm,
      climate.evaporation[season],
      temperatureC,
      isStorm,
      dayOfYear(date),
    );

    const { droughtStage, floodRisk } = computeHydrologyFlags(state, climate.soil);

    const trend: WeatherTrend = {
      drySpellDays: state.dryStreak,
      wetSpellDays: state.wetStreak,
      lastStormDaysAgo:
        state.lastStormDay != null ? dayOfYear(date) - state.lastStormDay : null,
    };

    const outlook = computeOutlook(
      rng,
      precipProfile,
      climate.soil,
      season,
      isStorm,
      state.soilMoisture,
      trend,
      temperatureC,
    );

    const narrative = buildNarrative(condition, habitat, droughtStage, floodRisk, isStorm);

    return {
      region: regionKey,
      habitat,
      date: cloneDate(date),
      season,
      temperatureC: Math.round(temperatureC * 10) / 10,
      humidity: Math.round(humidity),
      precipitationMm: Math.round(precipitationMm * 10) / 10,
      condition,
      soilMoisture: Math.round(state.soilMoisture * 100) / 100,
      droughtStage,
      floodRisk,
      storm: isStorm,
      trend,
      outlook,
      narrative,
    };
  }
}

const SPRING: TemperatureProfile = { min: 6, max: 14, variability: 4 };
const SUMMER: TemperatureProfile = { min: 12, max: 22, variability: 5 };
const AUTUMN: TemperatureProfile = { min: 8, max: 16, variability: 4 };
const WINTER: TemperatureProfile = { min: 1, max: 9, variability: 5 };

const FARMLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: SPRING,
    Summer: { min: 14, max: 24, variability: 5 },
    Autumn: AUTUMN,
    Winter: { min: -1, max: 7, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.5, stormChance: 0.18, minMm: 2, maxMm: 18, drizzleChance: 0.2 },
    Summer: { chance: 0.35, stormChance: 0.22, minMm: 1, maxMm: 20, drizzleChance: 0.1 },
    Autumn: { chance: 0.55, stormChance: 0.25, minMm: 3, maxMm: 22, drizzleChance: 0.2 },
    Winter: { chance: 0.45, stormChance: 0.2, minMm: 1, maxMm: 15, fogChance: 0.2 },
  },
  humidity: {
    Spring: 74,
    Summer: 70,
    Autumn: 78,
    Winter: 80,
  },
  evaporation: {
    Spring: 0.02,
    Summer: 0.035,
    Autumn: 0.025,
    Winter: 0.015,
  },
  soil: {
    baseMoisture: 0.58,
    infiltration: 0.7,
    retention: 0.82,
    droughtThreshold: 0.28,
    floodThreshold: 0.82,
  },
};

const COASTAL_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: SPRING,
    Summer: SUMMER,
    Autumn: AUTUMN,
    Winter: WINTER,
  },
  precipitation: {
    Spring: { chance: 0.48, stormChance: 0.22, minMm: 2, maxMm: 20, fogChance: 0.18 },
    Summer: { chance: 0.4, stormChance: 0.28, minMm: 1, maxMm: 24, drizzleChance: 0.12 },
    Autumn: { chance: 0.6, stormChance: 0.3, minMm: 3, maxMm: 26, drizzleChance: 0.18 },
    Winter: { chance: 0.5, stormChance: 0.24, minMm: 1, maxMm: 18, fogChance: 0.25 },
  },
  humidity: {
    Spring: 82,
    Summer: 78,
    Autumn: 84,
    Winter: 86,
  },
  evaporation: {
    Spring: 0.018,
    Summer: 0.03,
    Autumn: 0.02,
    Winter: 0.014,
  },
  soil: {
    baseMoisture: 0.62,
    infiltration: 0.55,
    retention: 0.78,
    droughtThreshold: 0.32,
    floodThreshold: 0.8,
  },
};

const URBAN_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: SPRING,
    Summer: { min: 14, max: 25, variability: 5 },
    Autumn: AUTUMN,
    Winter: { min: 2, max: 8, variability: 4 },
  },
  precipitation: {
    Spring: { chance: 0.46, stormChance: 0.18, minMm: 1, maxMm: 16, fogChance: 0.15 },
    Summer: { chance: 0.33, stormChance: 0.2, minMm: 1, maxMm: 18, drizzleChance: 0.12 },
    Autumn: { chance: 0.5, stormChance: 0.24, minMm: 2, maxMm: 20, drizzleChance: 0.15 },
    Winter: { chance: 0.42, stormChance: 0.18, minMm: 1, maxMm: 14, fogChance: 0.22 },
  },
  humidity: {
    Spring: 72,
    Summer: 68,
    Autumn: 75,
    Winter: 78,
  },
  evaporation: {
    Spring: 0.018,
    Summer: 0.03,
    Autumn: 0.02,
    Winter: 0.012,
  },
  soil: {
    baseMoisture: 0.48,
    infiltration: 0.42,
    retention: 0.7,
    droughtThreshold: 0.24,
    floodThreshold: 0.72,
  },
};

const WARM_MARITIME_COASTAL: HabitatClimate = {
  temperature: {
    Spring: { min: 12, max: 20, variability: 4 },
    Summer: { min: 18, max: 29, variability: 5 },
    Autumn: { min: 14, max: 22, variability: 4 },
    Winter: { min: 8, max: 16, variability: 4 },
  },
  precipitation: {
    Spring: { chance: 0.52, stormChance: 0.24, minMm: 2, maxMm: 22, fogChance: 0.22 },
    Summer: { chance: 0.45, stormChance: 0.32, minMm: 2, maxMm: 26, drizzleChance: 0.18 },
    Autumn: { chance: 0.58, stormChance: 0.28, minMm: 2, maxMm: 24, drizzleChance: 0.2 },
    Winter: { chance: 0.5, stormChance: 0.22, minMm: 1, maxMm: 18, fogChance: 0.3 },
  },
  humidity: {
    Spring: 84,
    Summer: 86,
    Autumn: 88,
    Winter: 90,
  },
  evaporation: {
    Spring: 0.02,
    Summer: 0.036,
    Autumn: 0.024,
    Winter: 0.016,
  },
  soil: {
    baseMoisture: 0.66,
    infiltration: 0.52,
    retention: 0.82,
    droughtThreshold: 0.34,
    floodThreshold: 0.84,
  },
};

const WARM_MARITIME_URBAN: HabitatClimate = {
  temperature: {
    Spring: { min: 14, max: 22, variability: 4 },
    Summer: { min: 20, max: 31, variability: 5 },
    Autumn: { min: 16, max: 24, variability: 4 },
    Winter: { min: 10, max: 17, variability: 4 },
  },
  precipitation: {
    Spring: { chance: 0.48, stormChance: 0.22, minMm: 2, maxMm: 18, fogChance: 0.18 },
    Summer: { chance: 0.42, stormChance: 0.3, minMm: 2, maxMm: 22, drizzleChance: 0.16 },
    Autumn: { chance: 0.55, stormChance: 0.26, minMm: 2, maxMm: 22, drizzleChance: 0.18 },
    Winter: { chance: 0.46, stormChance: 0.2, minMm: 1, maxMm: 16, fogChance: 0.26 },
  },
  humidity: {
    Spring: 78,
    Summer: 80,
    Autumn: 82,
    Winter: 84,
  },
  evaporation: {
    Spring: 0.02,
    Summer: 0.034,
    Autumn: 0.022,
    Winter: 0.015,
  },
  soil: {
    baseMoisture: 0.58,
    infiltration: 0.48,
    retention: 0.76,
    droughtThreshold: 0.28,
    floodThreshold: 0.78,
  },
};

const HIGHLAND_WOODLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 2, max: 12, variability: 5 },
    Summer: { min: 10, max: 20, variability: 4 },
    Autumn: { min: 4, max: 14, variability: 4 },
    Winter: { min: -10, max: 0, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.56, stormChance: 0.2, minMm: 2, maxMm: 20, fogChance: 0.18 },
    Summer: { chance: 0.58, stormChance: 0.24, minMm: 2, maxMm: 24, drizzleChance: 0.14 },
    Autumn: { chance: 0.6, stormChance: 0.22, minMm: 3, maxMm: 22, drizzleChance: 0.16 },
    Winter: { chance: 0.5, stormChance: 0.18, minMm: 2, maxMm: 18, fogChance: 0.26 },
  },
  humidity: {
    Spring: 76,
    Summer: 74,
    Autumn: 80,
    Winter: 82,
  },
  evaporation: {
    Spring: 0.018,
    Summer: 0.026,
    Autumn: 0.02,
    Winter: 0.012,
  },
  soil: {
    baseMoisture: 0.62,
    infiltration: 0.64,
    retention: 0.78,
    droughtThreshold: 0.3,
    floodThreshold: 0.82,
  },
};

const HIGHLAND_RIVER_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 3, max: 13, variability: 5 },
    Summer: { min: 11, max: 21, variability: 4 },
    Autumn: { min: 5, max: 15, variability: 4 },
    Winter: { min: -9, max: 1, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.6, stormChance: 0.22, minMm: 3, maxMm: 22, fogChance: 0.2 },
    Summer: { chance: 0.62, stormChance: 0.28, minMm: 3, maxMm: 26, drizzleChance: 0.18 },
    Autumn: { chance: 0.64, stormChance: 0.26, minMm: 3, maxMm: 24, drizzleChance: 0.18 },
    Winter: { chance: 0.54, stormChance: 0.2, minMm: 2, maxMm: 20, fogChance: 0.28 },
  },
  humidity: {
    Spring: 80,
    Summer: 82,
    Autumn: 84,
    Winter: 86,
  },
  evaporation: {
    Spring: 0.018,
    Summer: 0.024,
    Autumn: 0.018,
    Winter: 0.01,
  },
  soil: {
    baseMoisture: 0.68,
    infiltration: 0.6,
    retention: 0.86,
    droughtThreshold: 0.32,
    floodThreshold: 0.88,
  },
};

const BASIN_FARMLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 8, max: 18, variability: 5 },
    Summer: { min: 22, max: 32, variability: 6 },
    Autumn: { min: 10, max: 20, variability: 5 },
    Winter: { min: -10, max: 0, variability: 6 },
  },
  precipitation: {
    Spring: { chance: 0.58, stormChance: 0.26, minMm: 3, maxMm: 26, drizzleChance: 0.18 },
    Summer: { chance: 0.46, stormChance: 0.34, minMm: 2, maxMm: 30, drizzleChance: 0.12 },
    Autumn: { chance: 0.5, stormChance: 0.28, minMm: 2, maxMm: 24, drizzleChance: 0.16 },
    Winter: { chance: 0.42, stormChance: 0.22, minMm: 1, maxMm: 16, fogChance: 0.18 },
  },
  humidity: {
    Spring: 72,
    Summer: 78,
    Autumn: 74,
    Winter: 70,
  },
  evaporation: {
    Spring: 0.024,
    Summer: 0.04,
    Autumn: 0.028,
    Winter: 0.016,
  },
  soil: {
    baseMoisture: 0.6,
    infiltration: 0.72,
    retention: 0.8,
    droughtThreshold: 0.26,
    floodThreshold: 0.86,
  },
};

const BASIN_RIVER_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 9, max: 17, variability: 5 },
    Summer: { min: 20, max: 30, variability: 5 },
    Autumn: { min: 11, max: 19, variability: 4 },
    Winter: { min: -9, max: 1, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.62, stormChance: 0.3, minMm: 4, maxMm: 28, drizzleChance: 0.2 },
    Summer: { chance: 0.5, stormChance: 0.36, minMm: 3, maxMm: 32, drizzleChance: 0.14 },
    Autumn: { chance: 0.54, stormChance: 0.3, minMm: 3, maxMm: 26, drizzleChance: 0.18 },
    Winter: { chance: 0.46, stormChance: 0.24, minMm: 2, maxMm: 18, fogChance: 0.22 },
  },
  humidity: {
    Spring: 78,
    Summer: 82,
    Autumn: 80,
    Winter: 76,
  },
  evaporation: {
    Spring: 0.022,
    Summer: 0.036,
    Autumn: 0.024,
    Winter: 0.014,
  },
  soil: {
    baseMoisture: 0.66,
    infiltration: 0.68,
    retention: 0.88,
    droughtThreshold: 0.32,
    floodThreshold: 0.9,
  },
};

const BASIN_URBAN_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 10, max: 19, variability: 5 },
    Summer: { min: 24, max: 34, variability: 6 },
    Autumn: { min: 12, max: 21, variability: 5 },
    Winter: { min: -8, max: 2, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.52, stormChance: 0.28, minMm: 2, maxMm: 24, drizzleChance: 0.16 },
    Summer: { chance: 0.44, stormChance: 0.32, minMm: 2, maxMm: 28, drizzleChance: 0.12 },
    Autumn: { chance: 0.48, stormChance: 0.26, minMm: 2, maxMm: 22, drizzleChance: 0.14 },
    Winter: { chance: 0.4, stormChance: 0.2, minMm: 1, maxMm: 14, fogChance: 0.16 },
  },
  humidity: {
    Spring: 68,
    Summer: 74,
    Autumn: 70,
    Winter: 66,
  },
  evaporation: {
    Spring: 0.024,
    Summer: 0.042,
    Autumn: 0.028,
    Winter: 0.018,
  },
  soil: {
    baseMoisture: 0.52,
    infiltration: 0.46,
    retention: 0.74,
    droughtThreshold: 0.24,
    floodThreshold: 0.76,
  },
};

const GEOTHERMAL_MOUNTAIN_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 0, max: 10, variability: 5 },
    Summer: { min: 5, max: 17, variability: 4 },
    Autumn: { min: -1, max: 9, variability: 4 },
    Winter: { min: -12, max: -2, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.5, stormChance: 0.18, minMm: 2, maxMm: 16, fogChance: 0.28 },
    Summer: { chance: 0.44, stormChance: 0.2, minMm: 2, maxMm: 18, drizzleChance: 0.16 },
    Autumn: { chance: 0.46, stormChance: 0.2, minMm: 2, maxMm: 18, drizzleChance: 0.14 },
    Winter: { chance: 0.48, stormChance: 0.16, minMm: 2, maxMm: 16, fogChance: 0.32 },
  },
  humidity: {
    Spring: 74,
    Summer: 70,
    Autumn: 76,
    Winter: 78,
  },
  evaporation: {
    Spring: 0.014,
    Summer: 0.02,
    Autumn: 0.016,
    Winter: 0.01,
  },
  soil: {
    baseMoisture: 0.58,
    infiltration: 0.5,
    retention: 0.82,
    droughtThreshold: 0.3,
    floodThreshold: 0.84,
  },
};

const GEOTHERMAL_FARMLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 4, max: 14, variability: 4 },
    Summer: { min: 10, max: 20, variability: 4 },
    Autumn: { min: 5, max: 15, variability: 4 },
    Winter: { min: -6, max: 4, variability: 4 },
  },
  precipitation: {
    Spring: { chance: 0.52, stormChance: 0.18, minMm: 2, maxMm: 18, fogChance: 0.22 },
    Summer: { chance: 0.46, stormChance: 0.2, minMm: 2, maxMm: 20, drizzleChance: 0.16 },
    Autumn: { chance: 0.5, stormChance: 0.22, minMm: 2, maxMm: 18, drizzleChance: 0.18 },
    Winter: { chance: 0.48, stormChance: 0.18, minMm: 1, maxMm: 16, fogChance: 0.26 },
  },
  humidity: {
    Spring: 72,
    Summer: 70,
    Autumn: 74,
    Winter: 76,
  },
  evaporation: {
    Spring: 0.018,
    Summer: 0.024,
    Autumn: 0.02,
    Winter: 0.014,
  },
  soil: {
    baseMoisture: 0.6,
    infiltration: 0.62,
    retention: 0.84,
    droughtThreshold: 0.3,
    floodThreshold: 0.86,
  },
};

const GEOTHERMAL_RIVER_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 3, max: 13, variability: 4 },
    Summer: { min: 9, max: 19, variability: 4 },
    Autumn: { min: 4, max: 14, variability: 4 },
    Winter: { min: -7, max: 3, variability: 4 },
  },
  precipitation: {
    Spring: { chance: 0.54, stormChance: 0.2, minMm: 2, maxMm: 18, fogChance: 0.26 },
    Summer: { chance: 0.48, stormChance: 0.22, minMm: 2, maxMm: 20, drizzleChance: 0.18 },
    Autumn: { chance: 0.52, stormChance: 0.24, minMm: 2, maxMm: 20, drizzleChance: 0.18 },
    Winter: { chance: 0.5, stormChance: 0.2, minMm: 2, maxMm: 18, fogChance: 0.3 },
  },
  humidity: {
    Spring: 78,
    Summer: 76,
    Autumn: 80,
    Winter: 82,
  },
  evaporation: {
    Spring: 0.016,
    Summer: 0.022,
    Autumn: 0.018,
    Winter: 0.012,
  },
  soil: {
    baseMoisture: 0.64,
    infiltration: 0.58,
    retention: 0.86,
    droughtThreshold: 0.32,
    floodThreshold: 0.88,
  },
};

const SUBALPINE_WOODLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: -4, max: 8, variability: 5 },
    Summer: { min: 8, max: 18, variability: 4 },
    Autumn: { min: -2, max: 10, variability: 4 },
    Winter: { min: -18, max: -4, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.5, stormChance: 0.18, minMm: 2, maxMm: 16, fogChance: 0.24 },
    Summer: { chance: 0.48, stormChance: 0.2, minMm: 2, maxMm: 18, drizzleChance: 0.16 },
    Autumn: { chance: 0.52, stormChance: 0.22, minMm: 2, maxMm: 18, drizzleChance: 0.18 },
    Winter: { chance: 0.56, stormChance: 0.24, minMm: 2, maxMm: 20, fogChance: 0.28 },
  },
  humidity: {
    Spring: 72,
    Summer: 70,
    Autumn: 74,
    Winter: 78,
  },
  evaporation: {
    Spring: 0.014,
    Summer: 0.02,
    Autumn: 0.016,
    Winter: 0.01,
  },
  soil: {
    baseMoisture: 0.6,
    infiltration: 0.54,
    retention: 0.82,
    droughtThreshold: 0.32,
    floodThreshold: 0.84,
  },
};

const SUBALPINE_MOUNTAIN_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: -6, max: 6, variability: 5 },
    Summer: { min: 5, max: 15, variability: 4 },
    Autumn: { min: -4, max: 8, variability: 4 },
    Winter: { min: -20, max: -6, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.48, stormChance: 0.16, minMm: 2, maxMm: 14, fogChance: 0.22 },
    Summer: { chance: 0.46, stormChance: 0.18, minMm: 2, maxMm: 16, drizzleChance: 0.14 },
    Autumn: { chance: 0.5, stormChance: 0.2, minMm: 2, maxMm: 16, drizzleChance: 0.16 },
    Winter: { chance: 0.58, stormChance: 0.26, minMm: 2, maxMm: 20, fogChance: 0.3 },
  },
  humidity: {
    Spring: 68,
    Summer: 66,
    Autumn: 70,
    Winter: 74,
  },
  evaporation: {
    Spring: 0.012,
    Summer: 0.018,
    Autumn: 0.014,
    Winter: 0.008,
  },
  soil: {
    baseMoisture: 0.54,
    infiltration: 0.48,
    retention: 0.8,
    droughtThreshold: 0.3,
    floodThreshold: 0.82,
  },
};

const SUBALPINE_RIVER_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: -3, max: 9, variability: 4 },
    Summer: { min: 8, max: 18, variability: 4 },
    Autumn: { min: -1, max: 9, variability: 4 },
    Winter: { min: -17, max: -5, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.54, stormChance: 0.2, minMm: 2, maxMm: 18, fogChance: 0.26 },
    Summer: { chance: 0.5, stormChance: 0.22, minMm: 2, maxMm: 20, drizzleChance: 0.16 },
    Autumn: { chance: 0.54, stormChance: 0.24, minMm: 2, maxMm: 20, drizzleChance: 0.18 },
    Winter: { chance: 0.6, stormChance: 0.28, minMm: 2, maxMm: 22, fogChance: 0.32 },
  },
  humidity: {
    Spring: 76,
    Summer: 74,
    Autumn: 78,
    Winter: 82,
  },
  evaporation: {
    Spring: 0.014,
    Summer: 0.02,
    Autumn: 0.016,
    Winter: 0.01,
  },
  soil: {
    baseMoisture: 0.64,
    infiltration: 0.52,
    retention: 0.86,
    droughtThreshold: 0.34,
    floodThreshold: 0.88,
  },
};

const PLATEAU_MOUNTAIN_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 6, max: 16, variability: 4 },
    Summer: { min: 16, max: 24, variability: 4 },
    Autumn: { min: 8, max: 18, variability: 4 },
    Winter: { min: -4, max: 6, variability: 4 },
  },
  precipitation: {
    Spring: { chance: 0.6, stormChance: 0.26, minMm: 3, maxMm: 22, fogChance: 0.22 },
    Summer: { chance: 0.48, stormChance: 0.28, minMm: 2, maxMm: 24, drizzleChance: 0.16 },
    Autumn: { chance: 0.52, stormChance: 0.24, minMm: 2, maxMm: 20, drizzleChance: 0.18 },
    Winter: { chance: 0.44, stormChance: 0.18, minMm: 1, maxMm: 16, fogChance: 0.2 },
  },
  humidity: {
    Spring: 78,
    Summer: 76,
    Autumn: 80,
    Winter: 74,
  },
  evaporation: {
    Spring: 0.02,
    Summer: 0.028,
    Autumn: 0.022,
    Winter: 0.014,
  },
  soil: {
    baseMoisture: 0.6,
    infiltration: 0.58,
    retention: 0.84,
    droughtThreshold: 0.3,
    floodThreshold: 0.86,
  },
};

const PLATEAU_FARMLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 8, max: 18, variability: 4 },
    Summer: { min: 18, max: 26, variability: 4 },
    Autumn: { min: 10, max: 20, variability: 4 },
    Winter: { min: -2, max: 8, variability: 4 },
  },
  precipitation: {
    Spring: { chance: 0.62, stormChance: 0.28, minMm: 3, maxMm: 24, drizzleChance: 0.2 },
    Summer: { chance: 0.5, stormChance: 0.3, minMm: 2, maxMm: 26, drizzleChance: 0.18 },
    Autumn: { chance: 0.54, stormChance: 0.26, minMm: 2, maxMm: 22, drizzleChance: 0.2 },
    Winter: { chance: 0.46, stormChance: 0.2, minMm: 1, maxMm: 16, fogChance: 0.22 },
  },
  humidity: {
    Spring: 80,
    Summer: 78,
    Autumn: 82,
    Winter: 76,
  },
  evaporation: {
    Spring: 0.022,
    Summer: 0.032,
    Autumn: 0.024,
    Winter: 0.016,
  },
  soil: {
    baseMoisture: 0.62,
    infiltration: 0.64,
    retention: 0.84,
    droughtThreshold: 0.28,
    floodThreshold: 0.88,
  },
};

const PLATEAU_URBAN_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 9, max: 19, variability: 4 },
    Summer: { min: 19, max: 27, variability: 4 },
    Autumn: { min: 11, max: 21, variability: 4 },
    Winter: { min: -1, max: 9, variability: 4 },
  },
  precipitation: {
    Spring: { chance: 0.54, stormChance: 0.26, minMm: 2, maxMm: 22, drizzleChance: 0.18 },
    Summer: { chance: 0.46, stormChance: 0.28, minMm: 2, maxMm: 24, drizzleChance: 0.16 },
    Autumn: { chance: 0.5, stormChance: 0.24, minMm: 2, maxMm: 20, drizzleChance: 0.18 },
    Winter: { chance: 0.42, stormChance: 0.18, minMm: 1, maxMm: 14, fogChance: 0.2 },
  },
  humidity: {
    Spring: 74,
    Summer: 72,
    Autumn: 76,
    Winter: 70,
  },
  evaporation: {
    Spring: 0.02,
    Summer: 0.03,
    Autumn: 0.022,
    Winter: 0.014,
  },
  soil: {
    baseMoisture: 0.56,
    infiltration: 0.48,
    retention: 0.78,
    droughtThreshold: 0.26,
    floodThreshold: 0.8,
  },
};

const HEARTLAND_FARMLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 10, max: 20, variability: 5 },
    Summer: { min: 24, max: 34, variability: 6 },
    Autumn: { min: 12, max: 22, variability: 5 },
    Winter: { min: -12, max: -2, variability: 6 },
  },
  precipitation: {
    Spring: { chance: 0.56, stormChance: 0.3, minMm: 3, maxMm: 28, drizzleChance: 0.18 },
    Summer: { chance: 0.48, stormChance: 0.38, minMm: 3, maxMm: 32, drizzleChance: 0.12 },
    Autumn: { chance: 0.5, stormChance: 0.3, minMm: 3, maxMm: 26, drizzleChance: 0.16 },
    Winter: { chance: 0.46, stormChance: 0.24, minMm: 2, maxMm: 18, fogChance: 0.16 },
  },
  humidity: {
    Spring: 70,
    Summer: 76,
    Autumn: 72,
    Winter: 68,
  },
  evaporation: {
    Spring: 0.024,
    Summer: 0.042,
    Autumn: 0.03,
    Winter: 0.018,
  },
  soil: {
    baseMoisture: 0.58,
    infiltration: 0.68,
    retention: 0.82,
    droughtThreshold: 0.26,
    floodThreshold: 0.84,
  },
};

const HEARTLAND_URBAN_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 12, max: 22, variability: 5 },
    Summer: { min: 26, max: 36, variability: 6 },
    Autumn: { min: 14, max: 24, variability: 5 },
    Winter: { min: -10, max: 0, variability: 6 },
  },
  precipitation: {
    Spring: { chance: 0.5, stormChance: 0.28, minMm: 2, maxMm: 24, drizzleChance: 0.16 },
    Summer: { chance: 0.44, stormChance: 0.34, minMm: 2, maxMm: 28, drizzleChance: 0.12 },
    Autumn: { chance: 0.46, stormChance: 0.26, minMm: 2, maxMm: 22, drizzleChance: 0.14 },
    Winter: { chance: 0.42, stormChance: 0.22, minMm: 1, maxMm: 16, fogChance: 0.16 },
  },
  humidity: {
    Spring: 66,
    Summer: 72,
    Autumn: 68,
    Winter: 64,
  },
  evaporation: {
    Spring: 0.026,
    Summer: 0.044,
    Autumn: 0.03,
    Winter: 0.02,
  },
  soil: {
    baseMoisture: 0.5,
    infiltration: 0.46,
    retention: 0.72,
    droughtThreshold: 0.24,
    floodThreshold: 0.76,
  },
};

const ALPINE_MOUNTAIN_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: -5, max: 9, variability: 5 },
    Summer: { min: 7, max: 19, variability: 4 },
    Autumn: { min: -3, max: 11, variability: 4 },
    Winter: { min: -18, max: -4, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.54, stormChance: 0.2, minMm: 2, maxMm: 18, fogChance: 0.2 },
    Summer: { chance: 0.5, stormChance: 0.24, minMm: 2, maxMm: 20, drizzleChance: 0.14 },
    Autumn: { chance: 0.56, stormChance: 0.22, minMm: 2, maxMm: 18, drizzleChance: 0.16 },
    Winter: { chance: 0.6, stormChance: 0.26, minMm: 2, maxMm: 22, fogChance: 0.28 },
  },
  humidity: {
    Spring: 72,
    Summer: 70,
    Autumn: 74,
    Winter: 78,
  },
  evaporation: {
    Spring: 0.016,
    Summer: 0.024,
    Autumn: 0.018,
    Winter: 0.012,
  },
  soil: {
    baseMoisture: 0.58,
    infiltration: 0.52,
    retention: 0.82,
    droughtThreshold: 0.3,
    floodThreshold: 0.84,
  },
};

const ALPINE_RIVER_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: -3, max: 11, variability: 5 },
    Summer: { min: 9, max: 21, variability: 4 },
    Autumn: { min: -1, max: 13, variability: 4 },
    Winter: { min: -16, max: -2, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.58, stormChance: 0.22, minMm: 3, maxMm: 20, fogChance: 0.24 },
    Summer: { chance: 0.54, stormChance: 0.26, minMm: 3, maxMm: 22, drizzleChance: 0.16 },
    Autumn: { chance: 0.6, stormChance: 0.24, minMm: 3, maxMm: 22, drizzleChance: 0.18 },
    Winter: { chance: 0.64, stormChance: 0.28, minMm: 3, maxMm: 24, fogChance: 0.3 },
  },
  humidity: {
    Spring: 76,
    Summer: 74,
    Autumn: 78,
    Winter: 82,
  },
  evaporation: {
    Spring: 0.016,
    Summer: 0.022,
    Autumn: 0.018,
    Winter: 0.012,
  },
  soil: {
    baseMoisture: 0.64,
    infiltration: 0.56,
    retention: 0.86,
    droughtThreshold: 0.32,
    floodThreshold: 0.88,
  },
};

const ALPINE_URBAN_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: -1, max: 13, variability: 5 },
    Summer: { min: 11, max: 23, variability: 4 },
    Autumn: { min: 1, max: 15, variability: 4 },
    Winter: { min: -14, max: 0, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.5, stormChance: 0.2, minMm: 2, maxMm: 18, fogChance: 0.2 },
    Summer: { chance: 0.48, stormChance: 0.24, minMm: 2, maxMm: 20, drizzleChance: 0.14 },
    Autumn: { chance: 0.54, stormChance: 0.22, minMm: 2, maxMm: 18, drizzleChance: 0.16 },
    Winter: { chance: 0.58, stormChance: 0.26, minMm: 2, maxMm: 22, fogChance: 0.26 },
  },
  humidity: {
    Spring: 70,
    Summer: 68,
    Autumn: 72,
    Winter: 76,
  },
  evaporation: {
    Spring: 0.018,
    Summer: 0.026,
    Autumn: 0.02,
    Winter: 0.012,
  },
  soil: {
    baseMoisture: 0.54,
    infiltration: 0.46,
    retention: 0.78,
    droughtThreshold: 0.26,
    floodThreshold: 0.82,
  },
};

const BOREAL_WOODLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: -6, max: 8, variability: 5 },
    Summer: { min: 6, max: 18, variability: 4 },
    Autumn: { min: -4, max: 10, variability: 4 },
    Winter: { min: -25, max: -8, variability: 6 },
  },
  precipitation: {
    Spring: { chance: 0.46, stormChance: 0.16, minMm: 2, maxMm: 14, fogChance: 0.24 },
    Summer: { chance: 0.44, stormChance: 0.18, minMm: 2, maxMm: 16, drizzleChance: 0.16 },
    Autumn: { chance: 0.48, stormChance: 0.2, minMm: 2, maxMm: 16, drizzleChance: 0.18 },
    Winter: { chance: 0.5, stormChance: 0.22, minMm: 2, maxMm: 18, fogChance: 0.32 },
  },
  humidity: {
    Spring: 72,
    Summer: 70,
    Autumn: 74,
    Winter: 80,
  },
  evaporation: {
    Spring: 0.012,
    Summer: 0.018,
    Autumn: 0.014,
    Winter: 0.008,
  },
  soil: {
    baseMoisture: 0.58,
    infiltration: 0.48,
    retention: 0.82,
    droughtThreshold: 0.3,
    floodThreshold: 0.84,
  },
};

const BOREAL_RIVER_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: -5, max: 9, variability: 5 },
    Summer: { min: 7, max: 19, variability: 4 },
    Autumn: { min: -3, max: 11, variability: 4 },
    Winter: { min: -24, max: -7, variability: 6 },
  },
  precipitation: {
    Spring: { chance: 0.5, stormChance: 0.18, minMm: 2, maxMm: 16, fogChance: 0.28 },
    Summer: { chance: 0.48, stormChance: 0.2, minMm: 2, maxMm: 18, drizzleChance: 0.18 },
    Autumn: { chance: 0.52, stormChance: 0.22, minMm: 2, maxMm: 18, drizzleChance: 0.2 },
    Winter: { chance: 0.54, stormChance: 0.24, minMm: 2, maxMm: 20, fogChance: 0.34 },
  },
  humidity: {
    Spring: 76,
    Summer: 74,
    Autumn: 78,
    Winter: 84,
  },
  evaporation: {
    Spring: 0.012,
    Summer: 0.018,
    Autumn: 0.014,
    Winter: 0.008,
  },
  soil: {
    baseMoisture: 0.64,
    infiltration: 0.5,
    retention: 0.86,
    droughtThreshold: 0.32,
    floodThreshold: 0.88,
  },
};

const BOREAL_FARMLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: -3, max: 11, variability: 5 },
    Summer: { min: 8, max: 20, variability: 4 },
    Autumn: { min: -1, max: 12, variability: 4 },
    Winter: { min: -22, max: -6, variability: 6 },
  },
  precipitation: {
    Spring: { chance: 0.48, stormChance: 0.18, minMm: 2, maxMm: 16, fogChance: 0.24 },
    Summer: { chance: 0.46, stormChance: 0.2, minMm: 2, maxMm: 18, drizzleChance: 0.16 },
    Autumn: { chance: 0.5, stormChance: 0.22, minMm: 2, maxMm: 18, drizzleChance: 0.18 },
    Winter: { chance: 0.52, stormChance: 0.24, minMm: 2, maxMm: 18, fogChance: 0.3 },
  },
  humidity: {
    Spring: 70,
    Summer: 68,
    Autumn: 72,
    Winter: 78,
  },
  evaporation: {
    Spring: 0.014,
    Summer: 0.02,
    Autumn: 0.016,
    Winter: 0.01,
  },
  soil: {
    baseMoisture: 0.6,
    infiltration: 0.56,
    retention: 0.84,
    droughtThreshold: 0.32,
    floodThreshold: 0.86,
  },
};

const FRONTIER_WOODLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 4, max: 16, variability: 4 },
    Summer: { min: 18, max: 26, variability: 4 },
    Autumn: { min: 6, max: 18, variability: 4 },
    Winter: { min: -14, max: -3, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.56, stormChance: 0.22, minMm: 3, maxMm: 22, fogChance: 0.2 },
    Summer: { chance: 0.5, stormChance: 0.24, minMm: 2, maxMm: 22, drizzleChance: 0.18 },
    Autumn: { chance: 0.58, stormChance: 0.26, minMm: 3, maxMm: 24, drizzleChance: 0.2 },
    Winter: { chance: 0.52, stormChance: 0.22, minMm: 2, maxMm: 18, fogChance: 0.26 },
  },
  humidity: {
    Spring: 74,
    Summer: 72,
    Autumn: 78,
    Winter: 80,
  },
  evaporation: {
    Spring: 0.018,
    Summer: 0.026,
    Autumn: 0.02,
    Winter: 0.012,
  },
  soil: {
    baseMoisture: 0.62,
    infiltration: 0.6,
    retention: 0.84,
    droughtThreshold: 0.3,
    floodThreshold: 0.86,
  },
};

const FRONTIER_FARMLAND_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 6, max: 18, variability: 4 },
    Summer: { min: 20, max: 28, variability: 4 },
    Autumn: { min: 8, max: 20, variability: 4 },
    Winter: { min: -12, max: -2, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.54, stormChance: 0.24, minMm: 3, maxMm: 22, drizzleChance: 0.18 },
    Summer: { chance: 0.48, stormChance: 0.26, minMm: 2, maxMm: 24, drizzleChance: 0.16 },
    Autumn: { chance: 0.56, stormChance: 0.26, minMm: 3, maxMm: 24, drizzleChance: 0.18 },
    Winter: { chance: 0.5, stormChance: 0.22, minMm: 2, maxMm: 18, fogChance: 0.24 },
  },
  humidity: {
    Spring: 70,
    Summer: 72,
    Autumn: 76,
    Winter: 78,
  },
  evaporation: {
    Spring: 0.02,
    Summer: 0.028,
    Autumn: 0.022,
    Winter: 0.014,
  },
  soil: {
    baseMoisture: 0.6,
    infiltration: 0.66,
    retention: 0.82,
    droughtThreshold: 0.28,
    floodThreshold: 0.84,
  },
};

const FRONTIER_URBAN_CLIMATE: HabitatClimate = {
  temperature: {
    Spring: { min: 8, max: 18, variability: 4 },
    Summer: { min: 21, max: 29, variability: 4 },
    Autumn: { min: 10, max: 20, variability: 4 },
    Winter: { min: -10, max: 0, variability: 5 },
  },
  precipitation: {
    Spring: { chance: 0.5, stormChance: 0.22, minMm: 2, maxMm: 20, drizzleChance: 0.16 },
    Summer: { chance: 0.46, stormChance: 0.24, minMm: 2, maxMm: 22, drizzleChance: 0.14 },
    Autumn: { chance: 0.52, stormChance: 0.24, minMm: 2, maxMm: 22, drizzleChance: 0.18 },
    Winter: { chance: 0.48, stormChance: 0.22, minMm: 2, maxMm: 18, fogChance: 0.24 },
  },
  humidity: {
    Spring: 68,
    Summer: 70,
    Autumn: 74,
    Winter: 76,
  },
  evaporation: {
    Spring: 0.02,
    Summer: 0.03,
    Autumn: 0.022,
    Winter: 0.014,
  },
  soil: {
    baseMoisture: 0.54,
    infiltration: 0.48,
    retention: 0.78,
    droughtThreshold: 0.26,
    floodThreshold: 0.8,
  },
};

export const WAVES_BREAK_REGION_CLIMATE: RegionClimateProfile = {
  key: 'waves_break',
  label: "Wave's Break Littoral",
  habitats: {
    coastal: COASTAL_CLIMATE,
    farmland: FARMLAND_CLIMATE,
    urban: URBAN_CLIMATE,
  },
  prevailingWinds: 'Southerly sea breezes in spring, stiff western gales in autumn',
  notes:
    'Climate blends maritime spray with reclaimed lowlands; soil moisture swings govern city labor more than temperature extremes.',
};

export const CORAL_KEEP_REGION_CLIMATE: RegionClimateProfile = {
  key: 'coral_keep',
  label: 'Coral Keep Warm Maritime',
  habitats: {
    coastal: WARM_MARITIME_COASTAL,
    urban: WARM_MARITIME_URBAN,
  },
  prevailingWinds: 'Sea breezes and reef eddies funnel humid air through the harbor year-round',
  notes:
    'Warm currents and glassworks heat keep winters gentle; late summer squalls and sea fog dictate diving and shipping schedules.',
};

export const TIMBER_GROVE_REGION_CLIMATE: RegionClimateProfile = {
  key: 'timber_grove',
  label: 'Timber Grove Highland Riverine',
  habitats: {
    woodland: HIGHLAND_WOODLAND_CLIMATE,
    river: HIGHLAND_RIVER_CLIMATE,
  },
  prevailingWinds: 'Afternoon downslope gusts meet river valley mist to fuel daily showers',
  notes:
    'Cool montane air and saturated soils feed steady regrowth cycles for logging camps and riparian farms.',
};

export const CREEKSIDE_REGION_CLIMATE: RegionClimateProfile = {
  key: 'creekside',
  label: 'Creekside Basin Continental',
  habitats: {
    farmland: BASIN_FARMLAND_CLIMATE,
    river: BASIN_RIVER_CLIMATE,
    urban: BASIN_URBAN_CLIMATE,
  },
  prevailingWinds: 'Storm tracks sweep through the basin from the wetlands before spilling east',
  notes:
    'Hot, humid summers ripen sugar beets while cold snaps and spring floods shape levy maintenance and cattle drives.',
};

export const WARM_SPRINGS_REGION_CLIMATE: RegionClimateProfile = {
  key: 'warm_springs',
  label: 'Warm Springs Geothermal Alpine',
  habitats: {
    mountain: GEOTHERMAL_MOUNTAIN_CLIMATE,
    farmland: GEOTHERMAL_FARMLAND_CLIMATE,
    river: GEOTHERMAL_RIVER_CLIMATE,
  },
  prevailingWinds: 'Mountain eddies curl steam into terraces before spilling into the valley at dusk',
  notes:
    'Geothermal vents blunt alpine freezes, letting terraced farms and mineral baths persist amid surrounding snowfields.',
};

export const DANCING_PINES_REGION_CLIMATE: RegionClimateProfile = {
  key: 'dancing_pines',
  label: "Dancing Pines Subalpine Conifer",
  habitats: {
    woodland: SUBALPINE_WOODLAND_CLIMATE,
    mountain: SUBALPINE_MOUNTAIN_CLIMATE,
    river: SUBALPINE_RIVER_CLIMATE,
  },
  prevailingWinds: 'Snow-laden north winds tumble through the diamond crags all winter long',
  notes:
    'Long winters and thunder-snow storms test caravans, while short, bright summers swell rivers for log drives.',
};

export const MOUNTAIN_TOP_REGION_CLIMATE: RegionClimateProfile = {
  key: 'mountain_top',
  label: 'Mountain Top Wetland Gate Plateau',
  habitats: {
    mountain: PLATEAU_MOUNTAIN_CLIMATE,
    farmland: PLATEAU_FARMLAND_CLIMATE,
    urban: PLATEAU_URBAN_CLIMATE,
  },
  prevailingWinds: 'Wetland mists rise to the plateau before westerlies clear the terraces',
  notes:
    'Humid springs and beacon-rousing storms balance against crisp harvest seasons ideal for tea and rice curing.',
};

export const CORONA_REGION_CLIMATE: RegionClimateProfile = {
  key: 'corona',
  label: 'Corona Heartland Humid Continental',
  habitats: {
    farmland: HEARTLAND_FARMLAND_CLIMATE,
    urban: HEARTLAND_URBAN_CLIMATE,
  },
  prevailingWinds: 'Prairie winds sweep summer heat north while polar blasts drive winter blizzards',
  notes:
    'Expansive plains deliver bumper harvests between thunderstorm fronts and snowbound sieges along the Wetlands Wall.',
};

export const CORNER_STONE_REGION_CLIMATE: RegionClimateProfile = {
  key: 'corner_stone',
  label: 'Corner Stone Alpine River Valley',
  habitats: {
    mountain: ALPINE_MOUNTAIN_CLIMATE,
    river: ALPINE_RIVER_CLIMATE,
    urban: ALPINE_URBAN_CLIMATE,
  },
  prevailingWinds: 'Katabatic gusts spill from quarries by night while river fog clings to dawn markets',
  notes:
    'Deep snowpack feeds jewelers’ waterwheels and spring melt caravans despite bitter cold snaps.',
};

export const DRAGONS_REACH_ROAD_REGION_CLIMATE: RegionClimateProfile = {
  key: 'dragons_reach_road',
  label: "Dragon's Reach Boreal Frontier",
  habitats: {
    woodland: BOREAL_WOODLAND_CLIMATE,
    river: BOREAL_RIVER_CLIMATE,
    farmland: BOREAL_FARMLAND_CLIMATE,
  },
  prevailingWinds: 'Aurora-swept northerlies clash with rare chinook bursts from the dragonlands',
  notes:
    'Lake-moderated winters and short growing seasons frame the frontier orchards and fur trade.',
};

export const WHITEHEART_REGION_CLIMATE: RegionClimateProfile = {
  key: 'whiteheart',
  label: 'Whiteheart Temperate Forest Frontier',
  habitats: {
    woodland: FRONTIER_WOODLAND_CLIMATE,
    farmland: FRONTIER_FARMLAND_CLIMATE,
    urban: FRONTIER_URBAN_CLIMATE,
  },
  prevailingWinds: 'Moist southwesterlies funnel storms along the forest corridor each autumn',
  notes:
    'Snowy patrol seasons and mushroom-rich springs define the logging camps and garrison life.',
};

export const DEFAULT_REGIONAL_CLIMATES: Record<string, RegionClimateProfile> = {
  [WAVES_BREAK_REGION_CLIMATE.key]: WAVES_BREAK_REGION_CLIMATE,
  [CORAL_KEEP_REGION_CLIMATE.key]: CORAL_KEEP_REGION_CLIMATE,
  [TIMBER_GROVE_REGION_CLIMATE.key]: TIMBER_GROVE_REGION_CLIMATE,
  [CREEKSIDE_REGION_CLIMATE.key]: CREEKSIDE_REGION_CLIMATE,
  [WARM_SPRINGS_REGION_CLIMATE.key]: WARM_SPRINGS_REGION_CLIMATE,
  [DANCING_PINES_REGION_CLIMATE.key]: DANCING_PINES_REGION_CLIMATE,
  [MOUNTAIN_TOP_REGION_CLIMATE.key]: MOUNTAIN_TOP_REGION_CLIMATE,
  [CORONA_REGION_CLIMATE.key]: CORONA_REGION_CLIMATE,
  [CORNER_STONE_REGION_CLIMATE.key]: CORNER_STONE_REGION_CLIMATE,
  [DRAGONS_REACH_ROAD_REGION_CLIMATE.key]: DRAGONS_REACH_ROAD_REGION_CLIMATE,
  [WHITEHEART_REGION_CLIMATE.key]: WHITEHEART_REGION_CLIMATE,
};

export function createDefaultWeatherGenerator(startDate?: CalendarDate) {
  return new RegionalWeatherGenerator(DEFAULT_REGIONAL_CLIMATES, startDate);
}
