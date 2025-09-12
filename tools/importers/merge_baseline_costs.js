import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { BASELINE_COST_DATA } from '../../assets/data/cost_baseline.js';
import { cpToCoins } from '../../assets/data/currency.js';

/**
 * Merge BASELINE_COST_DATA into the economy_items dataset using the new format.
 * Idempotent: existing items (by internal_name & variant) are not duplicated.
 */
export function mergeBaselineCosts({ itemsPath = 'assets/data/economy_items.json' } = {}) {
  const absPath = path.resolve(itemsPath);
  const existing = fs.existsSync(absPath)
    ? JSON.parse(fs.readFileSync(absPath, 'utf8'))
    : [];
  const keyOf = (it) => `${it.internal_name}__${it.variant || ''}`;
  const existingKeys = new Set(existing.map(keyOf));

  const newItems = [];

  for (const row of BASELINE_COST_DATA) {
    const internal_name = slugify(row.item, { lower: true, strict: true });
    const key = `${internal_name}__`;
    if (existingKeys.has(key)) continue;
    const price = row.price_cp;
    const coin = cpToCoins(price);
    newItems.push({
      category_key: row.category,
      internal_name,
      display_name: row.item,
      base_item: row.item,
      variant: '',
      quality_tier: 'Common',
      primary_consumer: 'All',
      unit: 'each',
      market_value_cp: price,
      display_price: coin,
      display_price_tidy: coin,
      suggested_price_cp: price,
      suggested_display_price: coin,
      material_cost_cp: 0,
      labor_cost_cp: 0,
      overhead_cp: 0,
      mc_eff: 0,
      lc_eff: 0,
      effective_tax_pct: 0,
      tax_amount_cp: 0,
      net_profit_cp: price,
      duty: false,
      duty_pct: 0,
      duty_free: false,
      regions: [],
      import_reliant: false,
      import_tier: 0,
      export_friendly: false,
      sourcing_notes: '',
      perishable: false,
      bulky: false,
      fragile: false,
      value_dense: false,
      corridor_friendly: false,
      regional_mult_in: 1,
      regional_mult_out: 1
    });
  }

  if (newItems.length) {
    const merged = existing.concat(newItems);
    fs.writeFileSync(absPath, JSON.stringify(merged, null, 2) + '\n');
  }

  return { inserted: newItems.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const idx = process.argv.indexOf('--items');
  const itemsPath = idx !== -1 ? process.argv[idx + 1] : 'assets/data/economy_items.json';
  const res = mergeBaselineCosts({ itemsPath });
  console.log(`Inserted ${res.inserted}`);
}

