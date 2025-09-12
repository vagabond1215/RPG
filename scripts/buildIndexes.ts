import { readFile, writeFile, mkdir } from "fs/promises";
import { Habitat, FOOD_TIERS, LUXURY_TIERS, DIET, HABITATS } from "../src/types/biomes.js";

interface Animal { id: string; habitats: Habitat[]; diet: string[]; }
interface Plant { id: string; habitats: Habitat[]; tiers?: { food_tier?: string[]; luxury_tier?: string[]; } }

async function buildAnimals() {
  const raw = await readFile("data/animals.json", "utf-8");
  const animals: Animal[] = JSON.parse(raw);
  const byHabitat: Record<string, string[]> = {};
  const byDiet: Record<string, string[]> = {};
  for (const h of HABITATS) byHabitat[h] = [];
  for (const d of DIET) byDiet[d] = [];
  for (const a of animals) {
    for (const h of a.habitats) byHabitat[h].push(a.id);
    for (const d of a.diet) byDiet[d].push(a.id);
  }
  await writeFile("dist/indexes/animals.byHabitat.json", JSON.stringify(byHabitat, null, 2));
  await writeFile("dist/indexes/animals.byDiet.json", JSON.stringify(byDiet, null, 2));
}

async function buildPlants() {
  const raw = await readFile("data/plants.json", "utf-8");
  const plants: Plant[] = JSON.parse(raw);
  const byHabitat: Record<string, string[]> = {};
  for (const h of HABITATS) byHabitat[h] = [];
  const byTier: { food: Record<string, string[]>; luxury: Record<string, string[]> } = {
    food: {},
    luxury: {}
  };
  for (const t of FOOD_TIERS) byTier.food[t] = [];
  for (const t of LUXURY_TIERS) byTier.luxury[t] = [];
  for (const p of plants) {
    for (const h of p.habitats) byHabitat[h].push(p.id);
    if (p.tiers?.food_tier) {
      for (const t of p.tiers.food_tier) byTier.food[t].push(p.id);
    }
    if (p.tiers?.luxury_tier) {
      for (const t of p.tiers.luxury_tier) byTier.luxury[t].push(p.id);
    }
  }
  await writeFile("dist/indexes/plants.byHabitat.json", JSON.stringify(byHabitat, null, 2));
  await writeFile("dist/indexes/plants.byTier.json", JSON.stringify(byTier, null, 2));
}

async function run() {
  await mkdir("dist/indexes", { recursive: true });
  await buildAnimals();
  await buildPlants();
  console.log("Indexes built");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
