import { readFileSync } from "fs";
import { describe, it, expect } from "vitest";
import type { Habitat, Region } from "../src/types/biomes";

const animals: Array<{ id: string; regions: Region[]; habitats: Habitat[] }> = JSON.parse(
  readFileSync("data/animals.json", "utf-8"),
);
const plants: Array<{ id: string; regions: string[]; habitats: Habitat[] }> = JSON.parse(
  readFileSync("data/plants.json", "utf-8"),
);
const regionHabitatIndex: Record<string, Record<string, { animals: string[]; plants: string[] }>> = JSON.parse(
  readFileSync("dist/indexes/regionHabitat.life.json", "utf-8"),
);

describe("region habitat life index", () => {
  function getBucket(region: Region, habitat: Habitat) {
    return regionHabitatIndex[region]?.[habitat];
  }

  it("includes every animal in its region-habitat buckets", () => {
    for (const animal of animals) {
      for (const region of animal.regions) {
        for (const habitat of animal.habitats) {
          const bucket = getBucket(region, habitat);
          expect(bucket, `Missing bucket for ${region}/${habitat}`).toBeDefined();
          expect(bucket?.animals).toContain(animal.id);
        }
      }
    }
  });

  it("includes every plant in its region-habitat buckets", () => {
    for (const plant of plants) {
      for (const region of plant.regions) {
        for (const habitat of plant.habitats) {
          const bucket = getBucket(region, habitat);
          expect(bucket, `Missing bucket for ${region}/${habitat}`).toBeDefined();
          expect(bucket?.plants).toContain(plant.id);
        }
      }
    }
  });
});
