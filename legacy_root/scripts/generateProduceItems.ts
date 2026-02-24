import { readFile, writeFile } from 'fs/promises';
import slugify from 'slugify';

type Item = {
  category_key: string;
  internal_name: string;
  display_name: string;
  base_item: string;
  variant: string;
  quality_tier: string;
  primary_consumer: string;
  unit: string;
  market_value_cp: number;
  display_price: string;
  display_price_tidy: string;
  suggested_price_cp: number;
  suggested_display_price: string;
  material_cost_cp: number;
  labor_cost_cp: number;
  overhead_cp: number;
  mc_eff: number;
  lc_eff: number;
  effective_tax_pct: number;
  tax_amount_cp: number;
  net_profit_cp: number;
  duty: boolean;
  duty_pct: number;
  duty_free: boolean;
  regions: string[];
  import_reliant: boolean;
  import_tier: number;
  export_friendly: boolean;
  sourcing_notes: string;
  perishable: boolean;
  bulky: boolean;
  fragile: boolean;
  value_dense: boolean;
  corridor_friendly: boolean;
  regional_mult_in: number;
  regional_mult_out: number;
  sale_quantity: number;
  bulk_discount_threshold: number;
  bulk_discount_pct: number;
};

type Plant = {
  id: string;
  common_name: string;
  growth_form?: string;
  cultivated?: boolean;
  edible?: boolean;
  byproducts?: { type?: string | null }[];
  edible_parts?: string[];
};

type Animal = {
  id: string;
  common_name: string;
  byproducts?: { type?: string | null }[];
  edibility?: { edible?: boolean };
};

type ProduceConfig = {
  suffix?: string;
  unit: string;
  variant: string;
  pluralize?: boolean;
  nameTransform?: (name: string) => string;
};

const produceTemplate: Item = {
  category_key: 'Produce',
  internal_name: '',
  display_name: '',
  base_item: '',
  variant: '',
  quality_tier: 'Common',
  primary_consumer: 'Commoner',
  unit: 'each',
  market_value_cp: 6,
  display_price: '6cp',
  display_price_tidy: '6cp',
  suggested_price_cp: 6,
  suggested_display_price: '6cp',
  material_cost_cp: 2.8,
  labor_cost_cp: 2,
  overhead_cp: 0.24,
  mc_eff: 2.464,
  lc_eff: 1.8,
  effective_tax_pct: 0.05,
  tax_amount_cp: 0.3,
  net_profit_cp: 1.201,
  duty: false,
  duty_pct: 0,
  duty_free: false,
  regions: ['grassland', 'farmland', 'hills'],
  import_reliant: false,
  import_tier: 0,
  export_friendly: false,
  sourcing_notes: '',
  perishable: false,
  bulky: false,
  fragile: false,
  value_dense: false,
  corridor_friendly: false,
  regional_mult_in: 0.95,
  regional_mult_out: 1.06,
  sale_quantity: 1,
  bulk_discount_threshold: 10,
  bulk_discount_pct: 0.1,
};

const plantTypeConfigs: Record<string, ProduceConfig> = {
  grain: { suffix: ' Grain', unit: 'lb', variant: 'Grain' },
  seed: { suffix: ' Seeds', unit: 'lb', variant: 'Seed' },
  fruit: { suffix: '', unit: 'lb', variant: 'Fruit', pluralize: true },
  nut: { suffix: ' Nuts', unit: 'lb', variant: 'Nut' },
  root: { suffix: ' Roots', unit: 'lb', variant: 'Root' },
  tuber: { suffix: ' Tubers', unit: 'lb', variant: 'Tuber' },
  leaf: { suffix: ' Leaves', unit: 'bunch', variant: 'Leaf' },
  herb: { suffix: ' Herb', unit: 'bundle', variant: 'Herb' },
  flower: { suffix: ' Blossoms', unit: 'bundle', variant: 'Flower' },
  mushroom: { suffix: ' Mushrooms', unit: 'lb', variant: 'Mushroom' },
  bulb: { suffix: ' Bulbs', unit: 'lb', variant: 'Bulb' },
  oil: { suffix: ' Oil', unit: 'bottle', variant: 'Oil' },
  sap: { suffix: ' Sap', unit: 'bottle', variant: 'Sap' },
  spice: { suffix: ' Spice', unit: 'oz', variant: 'Spice' },
  medicine: { suffix: ' Remedy', unit: 'bundle', variant: 'Medicine' },
};

const fallbackUnitByForm: Record<string, string> = {
  herb: 'bundle',
  grass: 'lb',
  vine: 'lb',
  shrub: 'lb',
  tree: 'lb',
  cactus: 'lb',
  succulent: 'lb',
  algae: 'lb',
};

const meatOverrides: Record<string, string> = {
  cattle: 'Beef',
  pig: 'Pork',
  sheep: 'Mutton',
};

const milkOverrides: Record<string, string> = {
  cattle: 'Cow Milk',
  sheep: 'Sheep Milk',
  goat: 'Goat Milk',
  'horned-buffalo': 'Buffalo Milk',
  'dromedary-camel': 'Camel Milk',
  'xinjiang-bactrian-camel': 'Camel Milk',
  'draft-horse': 'Horse Milk',
};

const eggSuffix = ' egg';

function deepCloneTemplate(): Item {
  return JSON.parse(JSON.stringify(produceTemplate));
}

function toTitleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function pluralizeWord(word: string): string {
  if (!word) return word;
  const lower = word.toLowerCase();
  if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('z') || lower.endsWith('ch') || lower.endsWith('sh')) {
    return word + 'es';
  }
  if (lower.endsWith('y') && !/[aeiou]y$/i.test(lower)) {
    return word.slice(0, -1) + 'ies';
  }
  if (lower.endsWith('f')) {
    return word.slice(0, -1) + 'ves';
  }
  if (lower.endsWith('fe')) {
    return word.slice(0, -2) + 'ves';
  }
  return word + 's';
}

function ensurePlural(name: string): string {
  if (!name) return name;
  if (name.toLowerCase().endsWith('s')) {
    return name;
  }
  const parts = name.split(' ');
  const last = parts.pop() ?? '';
  const plural = pluralizeWord(last);
  return [...parts, plural].join(' ').trim();
}

function simplifyDomesticPrefix(name: string): string {
  return name.replace(/^Domestic\s+/i, '').replace(/^Common\s+/i, '');
}

async function main() {
  const [itemsRaw, plantsRaw, animalsRaw] = await Promise.all([
    readFile('data/economy/items.json', 'utf-8'),
    readFile('data/plants.json', 'utf-8'),
    readFile('data/animals.json', 'utf-8'),
  ]);

  const items: Item[] = JSON.parse(itemsRaw);
  const plants: Plant[] = JSON.parse(plantsRaw);
  const animals: Animal[] = JSON.parse(animalsRaw);

  const existingProduceNames = new Set(
    items
      .filter((item) => item.category_key === 'Produce')
      .map((item) => item.display_name.toLowerCase()),
  );
  const createdNames = new Set<string>();
  const newItems: Item[] = [];

  const addProduceItem = (
    displayName: string,
    options: { unit?: string; variant?: string; baseItem?: string; saleQuantity?: number } = {},
  ) => {
    const trimmed = displayName.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (existingProduceNames.has(key) || createdNames.has(key)) return;

    const item = deepCloneTemplate();
    item.internal_name = slugify(trimmed, { lower: true, strict: true });
    item.display_name = trimmed;
    item.base_item = options.baseItem ?? trimmed;
    item.variant = options.variant ?? '';
    item.unit = options.unit ?? item.unit;

    if (options.saleQuantity != null) {
      item.sale_quantity = options.saleQuantity;
      item.bulk_discount_threshold = Math.max(0, item.sale_quantity * 10);
    } else if (item.internal_name.includes('egg')) {
      item.sale_quantity = 12;
      item.bulk_discount_threshold = 120;
    }

    newItems.push(item);
    createdNames.add(key);
  };

  const plantProduceTypes = new Set(Object.keys(plantTypeConfigs));

  for (const plant of plants) {
    if (!plant.common_name || !plant.edible) continue;
    const plantName = plant.common_name.trim();
    const processedTypes = new Set<string>();

    const addFromType = (typeRaw: string | undefined | null) => {
      if (!typeRaw) return;
      const type = typeRaw.toLowerCase();
      if (!plantProduceTypes.has(type)) return;
      if (processedTypes.has(type)) return;
      processedTypes.add(type);
      const config = plantTypeConfigs[type];
      const baseName = config.pluralize ? ensurePlural(plantName) : plantName;
      const displayName = config.suffix
        ? `${baseName}${config.suffix}`
        : baseName;
      addProduceItem(displayName, {
        unit: config.unit,
        variant: config.variant,
      });
    };

    if (Array.isArray(plant.byproducts)) {
      for (const entry of plant.byproducts) {
        addFromType(entry?.type ?? undefined);
      }
    }
    if (Array.isArray(plant.edible_parts)) {
      for (const part of plant.edible_parts) {
        addFromType(part);
      }
    }

    if (processedTypes.size === 0 && plant.cultivated) {
      const form = plant.growth_form?.toLowerCase() ?? '';
      const unit = fallbackUnitByForm[form] ?? 'each';
      const displayName = ensurePlural(plantName);
      addProduceItem(displayName, { unit, variant: 'Whole' });
    }
  }

  for (const animal of animals) {
    if (!animal.common_name) continue;
    if (animal.edibility && animal.edibility.edible === false) continue;
    if (!Array.isArray(animal.byproducts)) continue;

    const baseName = simplifyDomesticPrefix(animal.common_name.trim());

    for (const byproduct of animal.byproducts) {
      const typeRaw = byproduct?.type;
      if (!typeRaw) continue;
      const type = typeRaw.toLowerCase();

      if (type === 'meat') {
        const override = meatOverrides[animal.id];
        const displayName = override ?? `${baseName} Meat`;
        addProduceItem(displayName, { unit: 'lb', variant: 'Meat' });
      } else if (type === 'milk') {
        const override = milkOverrides[animal.id];
        const displayName = override ?? `${baseName} Milk`;
        addProduceItem(displayName, { unit: 'quart', variant: 'Milk' });
      } else if (type.endsWith(eggSuffix)) {
        const displayName = toTitleCase(type);
        addProduceItem(displayName, { unit: 'each', variant: 'Egg', saleQuantity: 12 });
      }
    }
  }

  newItems.sort((a, b) => a.display_name.localeCompare(b.display_name));
  if (newItems.length > 0) {
    items.push(...newItems);
    await writeFile('data/economy/items.json', `${JSON.stringify(items, null, 2)}\n`);
  }

  console.log(`Generated ${newItems.length} new produce items.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
