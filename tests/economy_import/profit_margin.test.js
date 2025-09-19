import test from 'node:test';
import assert from 'node:assert';
import data from '../../data/economy/items.json' assert { type: 'json' };

test('profit margin stays within expected window', () => {
  for (const item of data) {
    const { market_value_cp: price, net_profit_cp: profit } = item;
    if (!price) continue;
    const margin = profit / price;
    assert.ok(
      margin >= 0.045,
      `${item.internal_name} ${item.variant || ''} margin ${margin.toFixed(4)} below 4.5% floor`
    );
    assert.ok(
      margin <= 0.35,
      `${item.internal_name} ${item.variant || ''} margin ${margin.toFixed(4)} above 35% ceiling`
    );
  }
});
