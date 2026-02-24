import { readFileSync } from "fs";
import { describe, it, expect } from "vitest";
import { HABITATS } from "../src/types/biomes";

const animals = JSON.parse(readFileSync("data/animals.json", "utf-8"));
const plants = JSON.parse(readFileSync("data/plants.json", "utf-8"));
const economyItems = JSON.parse(readFileSync("data/economy/items.json", "utf-8"));

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
    const productTokens = new Set([
      "meat",
      "milk",
      "egg",
      "wool",
      "hide",
      "fur",
      "feather",
      "honey",
      "oil",
      "fat",
      "bone",
      "horn",
      "antler",
      "shell",
      "silk",
      "gelatin",
      "fiber",
      "dye",
      "herb",
      "flower",
      "fruit",
      "seed",
      "bark",
      "bulb",
      "sap",
      "algae",
      "root",
      "nut",
      "vine",
      "resin",
      "leaf",
      "grain",
      "bud",
      "spice",
      "tuber",
      "mushroom",
      "venom",
      "medicine",
      "shellfish",
      "mutton",
      "pork",
      "beef",
      "venison",
      "wood",
    ]);
    const categoryTokens: Record<string, string[]> = {
      Dairy: ["milk"],
      LivestockMeat: ["meat"],
      WildGame: ["meat"],
      Seafood: ["fish", "shellfish"],
      Textiles: ["wool", "fiber"],
      Armor: ["hide", "fur", "leather"],
      Clothing: ["hide", "fur", "leather", "wool"],
      SpicesHerbs: ["herb", "spice"],
      Produce: [
        "fruit",
        "seed",
        "nut",
        "root",
        "leaf",
        "bulb",
        "tuber",
        "mushroom",
        "grain",
        "sap",
        "resin",
        "flower",
        "bark",
        "wood",
      ],
      Foraged: ["fruit", "mushroom", "nut", "root", "herb", "spice", "flower", "leaf"],
      Reagents: ["venom", "bone", "horn", "antler", "tooth", "shell", "feather"],
    };
    const meatSynonyms = new Set(["beef", "pork", "mutton", "venison"]);
    /**
     * Normalization rules:
     * - lowercase
     * - treat punctuation/parentheses as spaces
     * - collapse whitespace into tokens
     * - map known synonyms (rawhide -> hide, beef/pork/mutton/venison -> meat)
     */
    const tokenize = (value: string) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((token) => {
          if (token === "rawhide") {
            return "hide";
          }
          if (meatSynonyms.has(token)) {
            return "meat";
          }
          return token;
        });

    const economyTokenSets: Array<Set<string>> = [];
    for (const item of economyItems) {
      const tokens = new Set<string>();
      for (const label of [item.display_name, item.base_item, item.internal_name, item.variant]) {
        if (typeof label === "string" && label.trim()) {
          for (const token of tokenize(label)) {
            tokens.add(token);
          }
        }
      }
      for (const token of categoryTokens[item.category_key] ?? []) {
        tokens.add(token);
      }
      if (tokens.size > 0) {
        economyTokenSets.push(tokens);
      }
    }

    const expectedMissingByproducts = [
      "algae",
      "chicken egg",
      "duck egg",
      "dye",
      "fat",
      "goose egg",
      "horsehair",
      "medicine",
      "tooth",
    ];

    const matchesEconomy = (entry: any, type: string) => {
      const tokens = tokenize(type);
      const productOnly = tokens.filter((token) => productTokens.has(token));
      const candidates: string[][] = [];
      if (productOnly.length > 0) {
        candidates.push(productOnly);
      } else if (entry?.taxon_group === "fish") {
        candidates.push(["fish"]);
      } else if (entry?.taxon_group === "crustacean" || entry?.taxon_group === "mollusk") {
        candidates.push(["shellfish"]);
      }
      if (candidates.length === 0) {
        return false;
      }
      for (const candidate of candidates) {
        const candidateSet = new Set(candidate);
        for (const econSet of economyTokenSets) {
          let subset = true;
          for (const token of candidateSet) {
            if (!econSet.has(token)) {
              subset = false;
              break;
            }
          }
          if (subset) {
            return true;
          }
        }
      }
      return false;
    };

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
          if (!matchesEconomy(entry, type)) {
            missing.push({ source: source.label, type });
          }
        }
      }
    }

    const missingTypes = Array.from(new Set(missing.map((entry) => entry.type))).sort();
    expect(missingTypes).toEqual(expectedMissingByproducts);
  });
});
