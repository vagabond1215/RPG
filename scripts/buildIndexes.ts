import { readFile, writeFile, mkdir } from "fs/promises";
import {
  Habitat,
  FOOD_TIERS,
  LUXURY_TIERS,
  DIET,
  HABITATS,
  type Region,
} from "../src/types/biomes.js";

interface Animal {
  id: string;
  habitats: Habitat[];
  regions: Region[];
  diet: string[];
}

interface Plant {
  id: string;
  habitats: Habitat[];
  regions: string[];
  tiers?: { food_tier?: string[]; luxury_tier?: string[]; };
}

type RegionHabitatBuckets = Record<string, Record<string, { animals: Set<string>; plants: Set<string> }>>;

function ensureBucket(
  map: RegionHabitatBuckets,
  region: string,
  habitat: Habitat,
): { animals: Set<string>; plants: Set<string> } {
  if (!map[region]) {
    map[region] = {};
  }
  if (!map[region][habitat]) {
    map[region][habitat] = { animals: new Set(), plants: new Set() };
  }
  return map[region][habitat];
}

async function buildAnimals(regionHabitat: RegionHabitatBuckets) {
  const raw = await readFile("data/animals.json", "utf-8");
  const animals: Animal[] = JSON.parse(raw);
  const byHabitat: Record<string, string[]> = {};
  const byDiet: Record<string, string[]> = {};
  for (const h of HABITATS) byHabitat[h] = [];
  for (const d of DIET) byDiet[d] = [];
  for (const a of animals) {
    for (const h of a.habitats) byHabitat[h].push(a.id);
    for (const d of a.diet) byDiet[d].push(a.id);
    for (const region of a.regions) {
      for (const habitat of a.habitats) {
        ensureBucket(regionHabitat, region, habitat).animals.add(a.id);
      }
    }
  }
  for (const h of Object.keys(byHabitat)) {
    byHabitat[h] = Array.from(new Set(byHabitat[h])).sort();
  }
  for (const d of Object.keys(byDiet)) {
    byDiet[d] = Array.from(new Set(byDiet[d])).sort();
  }
  await writeFile("dist/indexes/animals.byHabitat.json", JSON.stringify(byHabitat, null, 2));
  await writeFile("dist/indexes/animals.byDiet.json", JSON.stringify(byDiet, null, 2));
  return animals;
}

async function buildPlants(regionHabitat: RegionHabitatBuckets) {
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
      for (const tier of p.tiers.food_tier) {
        const normalized = FOOD_TIERS.find(t => t.toLowerCase() === tier.toLowerCase()) ?? tier;
        if (!byTier.food[normalized]) byTier.food[normalized] = [];
        byTier.food[normalized].push(p.id);
      }
    }
    if (p.tiers?.luxury_tier) {
      for (const tier of p.tiers.luxury_tier) {
        const normalized = LUXURY_TIERS.find(t => t.toLowerCase() === tier.toLowerCase()) ?? tier;
        if (!byTier.luxury[normalized]) byTier.luxury[normalized] = [];
        byTier.luxury[normalized].push(p.id);
      }
    }
    for (const region of p.regions) {
      for (const habitat of p.habitats) {
        ensureBucket(regionHabitat, region, habitat).plants.add(p.id);
      }
    }
  }
  for (const h of Object.keys(byHabitat)) {
    byHabitat[h] = Array.from(new Set(byHabitat[h])).sort();
  }
  for (const [tier, entries] of Object.entries(byTier.food)) {
    byTier.food[tier] = Array.from(new Set(entries)).sort();
  }
  for (const [tier, entries] of Object.entries(byTier.luxury)) {
    byTier.luxury[tier] = Array.from(new Set(entries)).sort();
  }
  await writeFile("dist/indexes/plants.byHabitat.json", JSON.stringify(byHabitat, null, 2));
  await writeFile("dist/indexes/plants.byTier.json", JSON.stringify(byTier, null, 2));
  return plants;
}

async function buildRegionHabitatIndex(regionHabitat: RegionHabitatBuckets) {
  const serialized: Record<string, Record<string, { animals: string[]; plants: string[] }>> = {};
  const regionKeys = Object.keys(regionHabitat).sort((a, b) => a.localeCompare(b));
  for (const region of regionKeys) {
    const habitatEntries = Object.entries(regionHabitat[region]).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    serialized[region] = {};
    for (const [habitat, bucket] of habitatEntries) {
      serialized[region][habitat] = {
        animals: Array.from(bucket.animals).sort(),
        plants: Array.from(bucket.plants).sort(),
      };
    }
  }
  await writeFile(
    "dist/indexes/regionHabitat.life.json",
    JSON.stringify(serialized, null, 2),
  );
}

async function run() {
  await mkdir("dist/indexes", { recursive: true });
  const regionHabitat: RegionHabitatBuckets = {};
  await buildAnimals(regionHabitat);
  await buildPlants(regionHabitat);
  await buildRegionHabitatIndex(regionHabitat);
  console.log("Indexes built");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
