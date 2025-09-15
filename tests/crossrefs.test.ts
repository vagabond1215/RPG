import { readFileSync } from "fs";
import { describe, it, expect } from "vitest";
import { HABITATS } from "../src/types/biomes";

const animals = JSON.parse(readFileSync("data/animals.json", "utf-8"));
const plants = JSON.parse(readFileSync("data/plants.json", "utf-8"));

describe("cross references", () => {
  it("animals have valid habitats", () => {
    const set = new Set(HABITATS);
    for (const a of animals) {
      for (const h of a.habitats) {
        expect(set.has(h)).toBe(true);
      }
    }
  });

  it("plants have valid habitats", () => {
    const set = new Set(HABITATS);
    for (const p of plants) {
      for (const h of p.habitats) {
        expect(set.has(h)).toBe(true);
      }
    }
  });

  it("no duplicate animal ids", () => {
    const ids = animals.map((a: any) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("no duplicate plant ids", () => {
    const ids = plants.map((p: any) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
