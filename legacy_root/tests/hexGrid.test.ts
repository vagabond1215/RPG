import { describe, expect, it } from 'vitest';
import {
  KINGDOM_HEX_GRID,
  estimateTravelTime,
  locationDistance,
  sharedTravelOptions,
} from '../data/game/hexGrid.js';
import { LOCATIONS } from '../data/game/locations.js';

describe('kingdom hex grid', () => {
  it('aligns location registry entries with hex metadata', () => {
    const coronaHex = KINGDOM_HEX_GRID['Corona'];
    expect(coronaHex).toBeDefined();
    expect(coronaHex?.coordinate).toEqual({ q: 0, r: 0 });
    expect(LOCATIONS['Corona'].hex).toEqual(coronaHex);
  });

  it('computes consistent hex distances', () => {
    expect(locationDistance('Corona', 'Corner Stone')).toBe(2);
    expect(locationDistance("Wave's Break", 'Mountain Top')).toBe(1);
    expect(locationDistance("Wave's Break", 'Dancing Pines')).toBe(3);
  });

  it('exposes travel modes merged with neighbor routes', () => {
    const modes = sharedTravelOptions('Dancing Pines');
    expect(modes).toEqual(expect.arrayContaining(['trail', 'mountain_pass']));
    expect(modes).not.toContain('sea');
  });

  it('provides calibrated travel time estimates', () => {
    expect(estimateTravelTime(1, 'road')).toBe(7.1);
    const breakToMountain = KINGDOM_HEX_GRID["Wave's Break"].neighbors.find(
      (neighbor) => neighbor.to === 'Mountain Top',
    );
    expect(breakToMountain?.travelTimeDays).toBe(11);
    expect(breakToMountain?.method).toBe('wagon');
    expect(breakToMountain?.conditions).toMatchObject({
      biome: 'marsh',
      weather: 'rain',
      timeOfDay: 'day',
    });
    expect(breakToMountain?.conditions.logistics).toEqual(
      expect.arrayContaining(['maintained_road', 'supply_depots']),
    );
    const creekToCoral = KINGDOM_HEX_GRID['Creekside'].neighbors.find(
      (neighbor) => neighbor.to === 'Coral Keep',
    );
    expect(creekToCoral?.conditions.current).toBe('with_current');
  });
});
