let economyItemsPromise = null;

async function loadEconomyItems() {
  if (!economyItemsPromise) {
    economyItemsPromise = fetch('assets/economy/items.json')
      .then(res => (res.ok ? res.json() : []))
      .catch(() => []);
  }
  return economyItemsPromise;
}

const SHOP_RULES = [
  {
    pattern: /(smith|forge|armory|smithy)/i,
    sells: ['Weapons', 'Armor', 'Tools'],
    buys: ['Weapons', 'Armor', 'Tools'],
    resale: false,
  },
  {
    pattern: /(bakery|inn|tavern|galley|provision|granary|brewery|taproom|restaurant|galley)/i,
    sells: ['Food & Drink', 'Produce'],
    buys: ['Food & Drink', 'Produce'],
    resale: false,
  },
  {
    pattern: /(market|trading|exchange|plaza|merchant|wharf|pier|quay|warehouse)/i,
    sells: ['Produce', 'Food & Drink', 'Textiles', 'Tools', 'Weapons', 'Armor', 'Clothing', 'BooksMaps'],
    buys: ['Produce', 'Food & Drink', 'Textiles', 'Tools', 'Weapons', 'Armor', 'Clothing', 'BooksMaps'],
    resale: true,
  },
  {
    pattern: /(clothier|tailor|tannery|leather|sailmaker|ropewalk)/i,
    sells: ['Clothing', 'Textiles', 'Armor', 'Tools'],
    buys: ['Textiles', 'Tools'],
    resale: false,
  },
  {
    pattern: /(alchemical|remed|apothecar|herbal|enchanter|alchemy|remedies)/i,
    sells: ['Reagents', 'Tools'],
    buys: ['Reagents', 'Produce'],
    resale: false,
  },
  {
    pattern: /(press|library|academy|gallery|monastery|books|papermill)/i,
    sells: ['BooksMaps', 'Tools'],
    buys: ['BooksMaps', 'Textiles'],
    resale: false,
  },
  {
    pattern: /(butchery|smokehouse|galley|restaurant|bakery|brewery|pavilion)/i,
    sells: ['Food & Drink', 'Produce'],
    buys: ['Food & Drink', 'Produce'],
    resale: false,
  },
  {
    pattern: /(workshop|coachworks|mill|quarry|brickworks|stoneworks|co-op|guild)/i,
    sells: ['Tools'],
    buys: ['Tools'],
    resale: false,
  },
  {
    pattern: /(farm|orchard|pasture|polder|dairy|vineyard|apiary|hive|grove|meadow|stockyard)/i,
    sells: ['Produce'],
    buys: ['Produce'],
    resale: false,
  },
];

export function shopCategoriesForBuilding(name) {
  const lower = name.toLowerCase();
  for (const rule of SHOP_RULES) {
    if (rule.pattern.test(lower)) {
      return { sells: rule.sells, buys: rule.buys, resale: rule.resale };
    }
  }
  return { sells: [], buys: [], resale: false };
}

export async function itemsByCategory(category, limit = 10) {
  const items = await loadEconomyItems();
  return items
    .filter(
      item =>
        item.category_key === category &&
        (item.quality_tier === 'Common' || item.quality_tier === 'Standard')
    )
    .slice(0, limit)
    .map(item => ({
      name: item.display_name || item.internal_name,
      price: item.suggested_price_cp || item.market_value_cp,
      profit: item.net_profit_cp || 0,
      category,
      sale_quantity: item.sale_quantity,
      unit: item.unit,
      base_item: item.base_item,
      regions: item.regions,
      bulk_discount_threshold: item.bulk_discount_threshold,
      bulk_discount_pct: item.bulk_discount_pct,
    }));
}
