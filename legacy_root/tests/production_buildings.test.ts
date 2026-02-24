import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { PRODUCTION_BUILDINGS } from "../data/game/production_buildings.ts";
import { LOCATIONS } from "../data/game/locations.ts";

const recipes = JSON.parse(readFileSync("data/recipes.json", "utf-8"));
const economyItems = JSON.parse(readFileSync("data/economy/items.json", "utf-8"));
const economyItemIds = new Set<string>(economyItems.map((item: any) => item.internal_name));

const MIN_STAFFING = 1;
const MAX_STAFFING = 100;

const assertStaffingBand = (band: { count: number }, context: string) => {
  expect(Number.isInteger(band.count)).toBe(true);
  expect(band.count).toBeGreaterThanOrEqual(MIN_STAFFING);
  expect(band.count).toBeLessThanOrEqual(MAX_STAFFING);
  expect(context).toBeTruthy();
};

describe("production buildings", () => {
  it("uses unique building ids", () => {
    const ids = PRODUCTION_BUILDINGS.map(entry => entry.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("uses unique recipe ids", () => {
    const ids = recipes.map((recipe: any) => recipe.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("has valid upgrade references", () => {
    const byId = new Map(PRODUCTION_BUILDINGS.map(entry => [entry.id, entry]));
    for (const building of PRODUCTION_BUILDINGS) {
      if (building.upgradesTo) {
        const target = byId.get(building.upgradesTo);
        expect(target).toBeDefined();
        if (target) {
          expect(target.upgradesFrom).toBe(building.id);
          expect(target.tier).toBeGreaterThan(building.tier);
        }
      }
      if (building.upgradesFrom) {
        const source = byId.get(building.upgradesFrom);
        expect(source).toBeDefined();
        if (source) {
          expect(source.upgradesTo).toBe(building.id);
          expect(source.tier).toBeLessThan(building.tier);
        }
      }
    }
  });

  it("keeps staffing bands within expected ranges", () => {
    for (const location of Object.values(LOCATIONS)) {
      for (const business of location.businesses ?? []) {
        for (const band of business.workforce.normal) {
          assertStaffingBand(band, `${location.name} :: ${business.name} workforce`);
        }
        for (const condition of business.laborConditions) {
          for (const band of condition.staffing) {
            assertStaffingBand(
              band,
              `${location.name} :: ${business.name} :: ${condition.trigger}`
            );
          }
        }
      }
    }
  });

  it("soft-validates production item ids", () => {
    for (const building of PRODUCTION_BUILDINGS) {
      for (const entry of [...building.inputs, ...building.outputs]) {
        if (!entry.itemId) continue;
        expect.soft(economyItemIds.has(entry.itemId)).toBe(true);
      }
    }
  });
});
