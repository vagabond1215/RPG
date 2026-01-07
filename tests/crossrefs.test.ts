import { readFileSync } from "fs";
import { describe, it, expect } from "vitest";
import { HABITATS } from "../src/types/biomes";

const animals = JSON.parse(readFileSync("data/animals.json", "utf-8"));
const plants = JSON.parse(readFileSync("data/plants.json", "utf-8"));
const economyItems = JSON.parse(readFileSync("data/economy/items.json", "utf-8"));

const normalizeLabel = (value: string) => {
  /**
   * Normalization rules:
   * - lowercase
   * - drop punctuation/parentheses by treating them as spaces
   * - collapse whitespace into tokens
   * - sort tokens for order-insensitive matches
   *
   * Example: "Milk (goat)" and "goat milk" normalize to "goat milk".
   */
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");
};

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

  it("byproducts have economy items", () => {
    const economyLabels = new Set<string>();
    for (const item of economyItems) {
      for (const label of [item.display_name, item.base_item, item.internal_name]) {
        if (typeof label === "string" && label.trim()) {
          economyLabels.add(normalizeLabel(label));
        }
      }
    }

    const missing: { source: string; type: string }[] = [];
    const sources = [
      { label: "animal", entries: animals },
      { label: "plant", entries: plants },
    ];

    for (const source of sources) {
      for (const entry of source.entries) {
        for (const byproduct of entry.byproducts ?? []) {
          const type = typeof byproduct === "string" ? byproduct : byproduct?.type;
          if (!type || typeof type !== "string") {
            continue;
          }
          const normalized = normalizeLabel(type);
          if (!economyLabels.has(normalized)) {
            missing.push({ source: source.label, type });
          }
        }
      }
    }

    expect(missing).toEqual([]);
  });
});
