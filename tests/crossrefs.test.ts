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
    const qualityTokens = new Set([
      "low",
      "inn",
      "high",
      "table",
      "common",
      "fine",
      "luxury",
      "staple",
      "standard",
      "courtly",
      "masterwork",
      "parade",
      "arcane",
      "tailored",
      "simple",
      "ornate",
      "reserve",
      "estate",
      "grand",
      "small",
      "large",
      "medium",
      "dozen",
      "gallon",
      "gal",
      "lb",
      "pound",
      "gram",
      "yard",
      "bottle",
      "tankard",
      "plate",
      "loaf",
      "each",
      "set",
      "pair",
      "links",
      "whole",
      "oz",
    ]);
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
    ]);
    const tokenize = (value: string) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((token) => (token === "rawhide" ? "hide" : token))
        .filter((token) => !qualityTokens.has(token));

    const economyLabels = new Set<string>();
    const economyTokenSets: Array<Set<string>> = [];
    for (const item of economyItems) {
      for (const label of [
        item.display_name,
        item.base_item,
        item.internal_name,
        item.variant,
      ]) {
        if (typeof label === "string" && label.trim()) {
          economyLabels.add(normalizeLabel(label));
          const tokens = tokenize(label);
          if (tokens.length > 0) {
            economyTokenSets.push(new Set(tokens));
          }
        }
      }
    }

    const expectedMissingByproducts = [
      "algae",
      "allis shad",
      "antler",
      "arctic char",
      "aurochs meat",
      "barbel",
      "bark",
      "beef",
      "bezoar goat meat",
      "bleak",
      "brill",
      "bulb",
      "camel meat",
      "common swift meat",
      "conger eel",
      "congo tigerfish",
      "curlew meat",
      "dab",
      "danube backwater pike",
      "duck egg",
      "duck meat",
      "dye",
      "east greenland musk ox meat",
      "eastern freshwater cod",
      "elysian tidepool octopus",
      "eurasian jay meat",
      "fat",
      "feather",
      "fiber",
      "fieldfare meat",
      "finnmark arctic char",
      "flower",
      "freshwater crayfish",
      "fur",
      "garfish",
      "goat meat",
      "golden plover meat",
      "goose barnacle",
      "goose egg",
      "goose meat",
      "grain",
      "grey mullet",
      "gudgeon",
      "haida gwaii humpback whale meat",
      "hake",
      "herb",
      "horn",
      "horsehair",
      "huanghe chinese sturgeon",
      "ide (orfe)",
      "island deep spring shrimp",
      "jeju volcanic crab",
      "juruena armored catfish",
      "kinabatangan plain catfish",
      "kingfisher meat",
      "lagoon spotted ray meat",
      "lapwing meat",
      "leaf",
      "limpet",
      "ling",
      "lower mekong giant barb",
      "mahi-mahi",
      "mangrove saltwater crocodile meat",
      "marsh capybara meat",
      "medicine",
      "monkfish",
      "monsoon basin crocodile meat",
      "mouflon meat",
      "murex snail meat",
      "mushroom",
      "musk ox meat",
      "mutton",
      "nam song rice paddy eel",
      "north sea cod",
      "nut",
      "periwinkle",
      "plaice",
      "pollock",
      "pork",
      "queensland lungfish",
      "rabbit meat",
      "razor clam",
      "resin",
      "ruaha squeaker catfish",
      "sap",
      "seed",
      "shell",
      "snipe meat",
      "song thrush meat",
      "spice",
      "spider crab",
      "spiny dogfish",
      "sprat",
      "thornback ray",
      "tooth",
      "tropical reef shark meat",
      "tuber",
      "twaite shad",
      "venom",
      "whelk",
      "whiting",
      "white bream",
      "white-eye",
      "wolf meat",
    ];

    const matchesEconomy = (type: string) => {
      const normalized = normalizeLabel(type);
      if (economyLabels.has(normalized)) {
        return true;
      }
      const tokens = tokenize(type);
      if (tokens.length === 0) {
        return false;
      }
      const candidates = [tokens];
      const productOnly = tokens.filter((token) => productTokens.has(token));
      if (productOnly.length > 0 && productOnly.length !== tokens.length) {
        candidates.push(productOnly);
      }
      const withoutProduct = tokens.filter((token) => !productTokens.has(token));
      if (withoutProduct.length > 0 && withoutProduct.length !== tokens.length) {
        candidates.push(withoutProduct);
      }
      for (const candidate of candidates) {
        const candidateSet = new Set(candidate);
        for (const econSet of economyTokenSets) {
          let econSubset = true;
          for (const token of econSet) {
            if (!candidateSet.has(token)) {
              econSubset = false;
              break;
            }
          }
          if (econSubset) {
            return true;
          }
          let candidateSubset = true;
          for (const token of candidateSet) {
            if (!econSet.has(token)) {
              candidateSubset = false;
              break;
            }
          }
          if (candidateSubset) {
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
          if (!matchesEconomy(type)) {
            missing.push({ source: source.label, type });
          }
        }
      }
    }

    const missingTypes = Array.from(new Set(missing.map((entry) => entry.type))).sort();
    expect(missingTypes).toEqual(expectedMissingByproducts);
  });
});
