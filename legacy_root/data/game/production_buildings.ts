import economyItems from "../economy/items.json";

export type ProductionBuildingTier = 1 | 2;

export interface ProductionIO {
  concept: string;
  quantity?: number;
  itemId?: string | null;
}

export interface ProductionBuildingDefinition {
  id: string;
  name: string;
  description: string;
  tier: ProductionBuildingTier;
  inputs: ProductionIO[];
  outputs: ProductionIO[];
  upgradesTo?: string;
  upgradesFrom?: string;
}

interface EconomyItem {
  internal_name: string;
  display_name?: string;
  base_item?: string;
}

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const ITEM_ID_BY_CONCEPT = new Map<string, string>();

for (const item of economyItems as EconomyItem[]) {
  const internalKey = normalizeKey(item.internal_name);
  ITEM_ID_BY_CONCEPT.set(internalKey, item.internal_name);

  if (item.display_name) {
    ITEM_ID_BY_CONCEPT.set(normalizeKey(item.display_name), item.internal_name);
  }

  if (item.base_item) {
    ITEM_ID_BY_CONCEPT.set(normalizeKey(item.base_item), item.internal_name);
  }
}

const WARNED_CONCEPTS = new Set<string>();

export const resolveConceptToItemId = (concept: string): string | null => {
  const key = normalizeKey(concept);
  const resolved = ITEM_ID_BY_CONCEPT.get(key) ?? null;
  if (!resolved && !WARNED_CONCEPTS.has(key)) {
    WARNED_CONCEPTS.add(key);
    console.warn(`production_buildings: missing item mapping for concept "${concept}"`);
  }
  return resolved;
};

const resolveIO = (entries: ProductionIO[]): ProductionIO[] =>
  entries.map(entry => ({
    ...entry,
    itemId: entry.itemId ?? resolveConceptToItemId(entry.concept),
  }));

const PRODUCTION_BUILDING_SEEDS: ProductionBuildingDefinition[] = [
  {
    id: "charcoal_pit",
    name: "Charcoal Pit",
    description: "Earthen pit for slow-burning timber into charcoal.",
    tier: 1,
    inputs: [{ concept: "wood" }],
    outputs: [{ concept: "charcoal" }],
    upgradesTo: "charcoal_kiln",
  },
  {
    id: "charcoal_kiln",
    name: "Charcoal Kiln",
    description: "Masonry kiln for higher-yield charcoal firing.",
    tier: 2,
    inputs: [{ concept: "wood" }],
    outputs: [{ concept: "charcoal" }],
    upgradesFrom: "charcoal_pit",
  },
  {
    id: "clay_pit",
    name: "Clay Pit",
    description: "Excavation pit extracting workable clay.",
    tier: 1,
    inputs: [],
    outputs: [{ concept: "clay" }],
    upgradesTo: "brick_kiln",
  },
  {
    id: "brick_kiln",
    name: "Brick Kiln",
    description: "Firing kiln that hardens clay into bricks.",
    tier: 2,
    inputs: [{ concept: "clay" }],
    outputs: [{ concept: "brick" }],
    upgradesFrom: "clay_pit",
  },
  {
    id: "bloomery",
    name: "Bloomery",
    description: "Small-scale furnace for smelting ore into iron blooms.",
    tier: 1,
    inputs: [{ concept: "iron ore" }, { concept: "charcoal" }],
    outputs: [{ concept: "iron bloom" }],
    upgradesTo: "smelter",
  },
  {
    id: "smelter",
    name: "Smelter",
    description: "Refined furnace turning ore into usable ingots.",
    tier: 2,
    inputs: [{ concept: "iron ore" }, { concept: "charcoal" }],
    outputs: [{ concept: "iron ingot" }],
    upgradesFrom: "bloomery",
  },
  {
    id: "lumber_camp",
    name: "Lumber Camp",
    description: "Logging camp that rough-cuts timber from felled trees.",
    tier: 1,
    inputs: [{ concept: "logs" }],
    outputs: [{ concept: "timber" }],
    upgradesTo: "sawmill",
  },
  {
    id: "sawmill",
    name: "Sawmill",
    description: "Powered mill that turns logs into planks.",
    tier: 2,
    inputs: [{ concept: "logs" }],
    outputs: [{ concept: "planks" }],
    upgradesFrom: "lumber_camp",
  },
  {
    id: "grain_mill",
    name: "Grain Mill",
    description: "Stone mill for grinding grain into flour.",
    tier: 1,
    inputs: [{ concept: "grain" }],
    outputs: [{ concept: "flour" }],
    upgradesTo: "watermill",
  },
  {
    id: "watermill",
    name: "Watermill",
    description: "Water-powered mill with higher throughput for flour.",
    tier: 2,
    inputs: [{ concept: "grain" }],
    outputs: [{ concept: "flour" }],
    upgradesFrom: "grain_mill",
  },
  {
    id: "tannery_pits",
    name: "Tannery Pits",
    description: "Soaking pits that cure hides into rough leather.",
    tier: 1,
    inputs: [{ concept: "raw hides" }],
    outputs: [{ concept: "tanned leather" }],
    upgradesTo: "tannery",
  },
  {
    id: "tannery",
    name: "Tannery Works",
    description: "Dedicated works for finishing hides into usable leather.",
    tier: 2,
    inputs: [{ concept: "raw hides" }],
    outputs: [{ concept: "tanned leather" }],
    upgradesFrom: "tannery_pits",
  },
];

export const PRODUCTION_BUILDINGS: ProductionBuildingDefinition[] =
  PRODUCTION_BUILDING_SEEDS.map(building => ({
    ...building,
    inputs: resolveIO(building.inputs),
    outputs: resolveIO(building.outputs),
  }));

export type ProductionBuildingId = (typeof PRODUCTION_BUILDINGS)[number]["id"];

export const PRODUCTION_BUILDING_BY_ID = Object.fromEntries(
  PRODUCTION_BUILDINGS.map(entry => [entry.id, entry]),
) as Record<ProductionBuildingId, ProductionBuildingDefinition>;
