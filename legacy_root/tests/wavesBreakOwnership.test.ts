import { describe, expect, it } from 'vitest';

import { LOCATIONS } from '../data/game/locations.js';
import { applyWavesBreakRegistry } from '../data/game/waves_break_registry.js';

applyWavesBreakRegistry(LOCATIONS);

const wave = LOCATIONS["Wave's Break"];

describe("Wave's Break registry", () => {
  it('assigns ownership for every business', () => {
    expect(wave.ownership?.businesses).toBeDefined();
    const owners = wave.ownership?.businesses ?? {};
    wave.businesses.forEach((business) => {
      const detail = owners[business.name];
      expect(detail, `Missing owner for business ${business.name}`).toBeDefined();
      expect(detail?.owner).toBeTruthy();
    });
  });

  it('assigns ownership for every building', () => {
    expect(wave.ownership?.buildings).toBeDefined();
    const owners = wave.ownership?.buildings ?? {};
    wave.pointsOfInterest.buildings.forEach((building) => {
      const detail = owners[building];
      expect(detail, `Missing owner for building ${building}`).toBeDefined();
      expect(detail?.owner).toBeTruthy();
    });
  });

  it('routes Wave\'s Break quest postings through curated boards', () => {
    const boardNames = Object.keys(wave.questBoards);
    expect(boardNames.length).toBeGreaterThan(0);
    expect(boardNames).toContain('North Gate Labor Postings');
    expect(boardNames).toContain('South Gate Field Contracts');
    expect(boardNames).toContain('Harborwatch Quay Ledger');
    expect(boardNames).toContain('Adventurers\' Guild Contract Archive');
    expect(boardNames.every((name) => !name.endsWith('Quest Board'))).toBe(true);

    const businessNames = new Set(wave.businesses.map((b) => b.name));
    const covered = new Set<string>();
    Object.values(wave.questBoards).forEach((quests) => {
      quests.forEach((quest) => {
        if (quest.location && businessNames.has(quest.location)) {
          covered.add(quest.location);
        }
      });
    });
    businessNames.forEach((name) => {
      expect(covered.has(name), `Missing quest board coverage for ${name}`).toBe(true);
    });
  });
});
