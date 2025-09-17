import fs from 'fs';

const FILE = 'data/economy/items.json';
const HIGH_CONSUMPTION = new Set([
  'Food & Drink', 'FoodDrink', 'Produce', 'Dairy', 'LivestockMeat',
  'Beverages', 'Confectionery', 'SpicesHerbs', 'Raw Materials',
  'Crafting Materials', 'Reagents', 'Ores & Raw Metals',
  'Ingots & Metal Bars', 'Smelting & Forge Inputs', 'Wood & Carpentry',
  'Stone & Masonry', 'Textiles', 'Textiles & Tailoring', 'Leatherworking',
  'Pigments & Dyes', 'Oils, Saps & Adhesives', 'Adventuring Consumables'
]);

const items = JSON.parse(fs.readFileSync(FILE, 'utf8'));

for (const item of items) {
  if (item.sale_quantity == null) {
    if (item.internal_name && item.internal_name.includes('egg')) {
      item.sale_quantity = 12;
    } else {
      item.sale_quantity = 1;
    }
  }
  if (item.net_profit_cp <= 0 || item.net_profit_cp >= item.market_value_cp) {
    const overhead = +(item.market_value_cp * 0.1).toFixed(3);
    item.overhead_cp = overhead;
    item.net_profit_cp = +(item.market_value_cp - overhead).toFixed(3);
  }
  if (HIGH_CONSUMPTION.has(item.category_key)) {
    item.bulk_discount_threshold = item.sale_quantity * 10;
    const defaultDiscount = 0.1;
    const maxDiscount = Math.max(0, Math.min(defaultDiscount, (item.net_profit_cp / item.market_value_cp) - 0.01));
    item.bulk_discount_pct = +maxDiscount.toFixed(2);
  } else {
    item.bulk_discount_threshold = 0;
    item.bulk_discount_pct = 0;
  }
}

fs.writeFileSync(FILE, JSON.stringify(items, null, 2));
console.log(`Updated ${items.length} items with sale quantities and bulk pricing.`);
