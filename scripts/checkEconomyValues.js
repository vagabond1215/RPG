import items from '../assets/data/economy_items.json' assert { type: 'json' };
const bad = items.filter(i =>
  i.market_value_cp == null ||
  i.net_profit_cp == null ||
  i.market_value_cp <= 0 ||
  i.net_profit_cp <= 0 ||
  i.net_profit_cp >= i.market_value_cp
);
if (bad.length) {
  console.log(`Found ${bad.length} items with invalid economic data.`);
  bad.slice(0, 20).forEach(i => {
    console.log(`- ${i.internal_name}: mv ${i.market_value_cp}, net ${i.net_profit_cp}`);
  });
  if (bad.length > 20) {
    console.log(`...and ${bad.length - 20} more`);
  }
} else {
  console.log('No invalid economic data found.');
}
