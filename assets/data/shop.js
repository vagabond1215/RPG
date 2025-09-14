import ECONOMY_ITEMS from './economy_items.json' assert { type: 'json' };

const SHOP_RULES = [
  { pattern: /(smith|forge|armory|smithy)/i, sells: ['Weapons', 'Armor', 'Tools'], buys: ['Weapons', 'Armor', 'Tools'] },
  { pattern: /(bakery|inn|tavern|galley|provision|granary|brewery|taproom|restaurant|galley)/i, sells: ['Food & Drink', 'Produce'], buys: ['Food & Drink', 'Produce'] },
  { pattern: /(market|trading|exchange|plaza|merchant|wharf|pier|quay|warehouse)/i, sells: ['Produce', 'Food & Drink', 'Textiles', 'Tools', 'Weapons', 'Armor', 'Clothing', 'BooksMaps'], buys: ['Produce', 'Food & Drink', 'Textiles', 'Tools', 'Weapons', 'Armor', 'Clothing', 'BooksMaps'] },
  { pattern: /(clothier|tailor|tannery|leather|sailmaker|ropewalk)/i, sells: ['Clothing', 'Textiles', 'Armor', 'Tools'], buys: ['Textiles', 'Tools'] },
  { pattern: /(alchemical|remed|apothecar|herbal|enchanter|alchemy|remedies)/i, sells: ['Reagents', 'Tools'], buys: ['Reagents', 'Produce'] },
  { pattern: /(press|library|academy|gallery|monastery|books|papermill)/i, sells: ['BooksMaps', 'Tools'], buys: ['BooksMaps', 'Textiles'] },
  { pattern: /(butchery|smokehouse|galley|restaurant|bakery|brewery|pavilion)/i, sells: ['Food & Drink', 'Produce'], buys: ['Food & Drink', 'Produce'] }
];

export function shopCategoriesForBuilding(name) {
  const lower = name.toLowerCase();
  for (const rule of SHOP_RULES) {
    if (rule.pattern.test(lower)) {
      return { sells: rule.sells, buys: rule.buys };
    }
  }
  return { sells: [], buys: [] };
}

export function itemsByCategory(category, limit = 10) {
  return ECONOMY_ITEMS.filter(item => item.category_key === category && (item.quality_tier === 'Common' || item.quality_tier === 'Standard'))
    .slice(0, limit)
    .map(item => ({
      name: item.display_name || item.internal_name,
      price: item.suggested_price_cp || item.market_value_cp,
      category,
      sale_quantity: item.sale_quantity,
      bulk_discount_threshold: item.bulk_discount_threshold,
      bulk_discount_pct: item.bulk_discount_pct
    }));
}
