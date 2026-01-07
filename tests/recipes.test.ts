import { readFileSync } from "fs";
import { describe, it, expect } from "vitest";

const recipes = JSON.parse(readFileSync("data/recipes.json", "utf-8"));
const animals = JSON.parse(readFileSync("data/animals.json", "utf-8"));
const plants = JSON.parse(readFileSync("data/plants.json", "utf-8"));
const economyItems = JSON.parse(readFileSync("data/economy/items.json", "utf-8"));

const economyItemIds = new Set<string>(economyItems.map((item: any) => item.internal_name));
const animalIds = new Set<string>(animals.map((animal: any) => animal.id));
const plantIds = new Set<string>(plants.map((plant: any) => plant.id));

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

const matchesEconomyByproduct = (type: string) => {
  const tokens = tokenize(type);
  const productOnly = tokens.filter((token) => productTokens.has(token));
  const candidates: string[][] = [];
  if (productOnly.length > 0) {
    candidates.push(productOnly);
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

const byproductExistsForSource = (type: string, source: { type: string; id: string }) => {
  const list = source.type === "animal" ? animals : plants;
  const entry = list.find((item: any) => item.id === source.id);
  if (!entry) {
    return false;
  }
  for (const byproduct of entry.byproducts ?? []) {
    const byproductType = typeof byproduct === "string" ? byproduct : byproduct?.type;
    if (byproductType === type) {
      return true;
    }
  }
  return false;
};

describe("recipes", () => {
  it("use valid economy items and optional sources", () => {
    for (const recipe of recipes) {
      expect(typeof recipe.id).toBe("string");
      expect(typeof recipe.name).toBe("string");
      expect(Array.isArray(recipe.ingredients)).toBe(true);
      expect(Array.isArray(recipe.outputs)).toBe(true);

      for (const ingredient of recipe.ingredients) {
        if (ingredient.economy_item) {
          expect(economyItemIds.has(ingredient.economy_item)).toBe(true);
        }
        if (ingredient.byproduct) {
          expect(matchesEconomyByproduct(ingredient.byproduct)).toBe(true);
          if (ingredient.source) {
            if (ingredient.source.type === "animal") {
              expect(animalIds.has(ingredient.source.id)).toBe(true);
            }
            if (ingredient.source.type === "plant") {
              expect(plantIds.has(ingredient.source.id)).toBe(true);
            }
            expect(byproductExistsForSource(ingredient.byproduct, ingredient.source)).toBe(true);
          }
        }
        expect(ingredient.economy_item || ingredient.byproduct).toBeTruthy();
      }

      for (const output of recipe.outputs) {
        expect(output.economy_item).toBeDefined();
        expect(economyItemIds.has(output.economy_item)).toBe(true);
      }
    }
  });
});
