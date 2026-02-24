import test from 'node:test';
import assert from 'node:assert';
import data from '../../data/economy/items.json' assert { type: 'json' };

test('items have sale quantities and valid bulk pricing', () => {
  for (const item of data) {
    assert.ok(item.sale_quantity > 0, `${item.internal_name} missing sale_quantity`);
    if (item.bulk_discount_threshold > 0) {
      assert.ok(item.bulk_discount_pct > 0, `${item.internal_name} missing bulk discount pct`);
      const cost = item.market_value_cp - item.net_profit_cp;
      const discounted = item.market_value_cp * (1 - item.bulk_discount_pct);
      assert.ok(discounted - cost > 0, `${item.internal_name} bulk discount makes negative profit`);
    }
  }
});

test('eggs sold by the dozen', () => {
  const eggs = data.filter(i => i.internal_name.includes('egg'));
  for (const egg of eggs) {
    assert.ok(egg.sale_quantity >= 12, `${egg.internal_name} should have sale_quantity >= 12`);
  }
});
