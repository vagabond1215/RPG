import { describe, expect, it } from 'vitest';

import {
  MONTHS,
  DAYS_PER_MONTH,
  DAYS_PER_YEAR,
  TidefallCalendar,
  advanceDate,
  dateKey,
  getSeasonForDate,
} from '../assets/data/calendar.js';
import {
  createDefaultWeatherGenerator,
  createDeterministicRandom,
} from '../assets/data/weather.js';
import { LOCATIONS } from '../assets/data/locations.js';
import { applyWavesBreakRegistry } from '../assets/data/waves_break_registry.js';

applyWavesBreakRegistry(LOCATIONS);

describe('calendar system', () => {
  it('tracks a 13 month, 28 day calendar year', () => {
    expect(MONTHS.length).toBe(13);
    expect(DAYS_PER_MONTH).toBe(28);
    expect(DAYS_PER_YEAR).toBe(364);
  });

  it('advances dates across year boundaries', () => {
    const calendar = new TidefallCalendar({ year: 732, monthIndex: 12, day: 27 });
    calendar.advance(5);
    expect(calendar.today()).toEqual({ year: 733, monthIndex: 0, day: 4 });
    expect(getSeasonForDate(calendar.today())).toBe('Spring');
  });
});

describe('weather generator', () => {
  it('produces deterministic daily reports with hydrology trends', () => {
    const generator = createDefaultWeatherGenerator({ year: 732, monthIndex: 0, day: 1 });
    const reports: any[] = [];
    let date = { year: 732, monthIndex: 0, day: 1 };
    for (let i = 0; i < 40; i += 1) {
      reports.push(generator.getDailyWeather('waves_break', 'farmland', date));
      date = advanceDate(date, 1);
    }
    const droughtSeen = reports.some((report) => report.droughtStage !== 'none');
    const floodSeen = reports.some((report) => report.floodRisk !== 'none');
    expect(droughtSeen || floodSeen).toBe(true);
    const repeat = generator.getDailyWeather('waves_break', 'farmland', { year: 732, monthIndex: 0, day: 10 });
    expect(repeat).toEqual(reports[9]);
  });
});

describe('quest visibility rules', () => {
  const wave = LOCATIONS["Wave's Break"];
  const farmlandBoard = wave.questBoards['North Gate Labor Postings'];
  const kilnQuest = farmlandBoard.find((quest) => quest.title === "Kiln-Keeper's Call");
  const stormQuest = farmlandBoard.find((quest) => quest.title === 'Harborface Rush Order');
  const generator = createDefaultWeatherGenerator({ year: 732, monthIndex: 0, day: 1 });

  it('keeps dry-season kiln work gated until conditions warrant', () => {
    if (!kilnQuest?.visibility) throw new Error('Expected kiln quest visibility');
    const binding = kilnQuest.visibilityBinding || { region: 'waves_break', habitat: 'farmland', business: kilnQuest.location };
    const startDate = { year: 732, monthIndex: 0, day: 1 };
    const startWeather = generator.getDailyWeather(binding.region, binding.habitat, startDate);
    const startRng = createDeterministicRandom(
      `${binding.region}:${binding.habitat}:${binding.business}:${dateKey(startDate)}:${kilnQuest.title}`,
    );
    const initialAvailability = kilnQuest.visibility({
      date: startDate,
      weather: startWeather,
      random: startRng,
      binding,
      laborCondition: kilnQuest.laborCondition,
      questTitle: kilnQuest.title,
    });
    let date = startDate;
    let maxDemand = initialAvailability.demand;
    for (let i = 0; i < 120; i += 1) {
      const weather = generator.getDailyWeather(binding.region, binding.habitat, date);
      const rng = createDeterministicRandom(
        `${binding.region}:${binding.habitat}:${binding.business}:${dateKey(date)}:${kilnQuest.title}`,
      );
      const availability = kilnQuest.visibility({
        date,
        weather,
        random: rng,
        binding,
        laborCondition: kilnQuest.laborCondition,
        questTitle: kilnQuest.title,
      });
      if (availability.demand > maxDemand) {
        maxDemand = availability.demand;
      }
      date = advanceDate(date, 1);
    }
    expect(maxDemand).toBeGreaterThan(initialAvailability.demand);
  });

  it('activates storm response quests only during surge conditions', () => {
    if (!stormQuest?.visibility) throw new Error('Expected storm quest visibility');
    const binding = stormQuest.visibilityBinding || { region: 'waves_break', habitat: 'farmland', business: stormQuest.location };
    const calmDate = { year: 732, monthIndex: 0, day: 1 };
    const calmWeather = generator.getDailyWeather(binding.region, binding.habitat, calmDate);
    const calmRng = createDeterministicRandom(
      `${binding.region}:${binding.habitat}:${binding.business}:${dateKey(calmDate)}:${stormQuest.title}`,
    );
    const calmAvailability = stormQuest.visibility({
      date: calmDate,
      weather: calmWeather,
      random: calmRng,
      binding,
      laborCondition: stormQuest.laborCondition,
      questTitle: stormQuest.title,
    });
    expect(calmAvailability.available).toBe(false);

    let date = calmDate;
    let seenStorm = false;
    for (let i = 0; i < 90; i += 1) {
      const weather = generator.getDailyWeather(binding.region, binding.habitat, date);
      if (weather.storm || weather.floodRisk !== 'none') {
        const rng = createDeterministicRandom(
          `${binding.region}:${binding.habitat}:${binding.business}:${dateKey(date)}:${stormQuest.title}`,
        );
        const availability = stormQuest.visibility({
          date,
          weather,
          random: rng,
          binding,
          laborCondition: stormQuest.laborCondition,
          questTitle: stormQuest.title,
        });
        expect(availability.available).toBe(true);
        seenStorm = true;
        break;
      }
      date = advanceDate(date, 1);
    }
    expect(seenStorm).toBe(true);
  });
});
