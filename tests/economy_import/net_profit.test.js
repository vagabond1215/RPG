import test from 'node:test';
import assert from 'node:assert';
import data from '../../assets/data/economy_items.json' assert { type: 'json' };

test('net profit matches cost formula', () => {
  for (const item of data) {
    const expected = +(item.market_value_cp - (item.mc_eff + item.lc_eff + item.overhead_cp) - item.tax_amount_cp).toFixed(3);
    assert.ok(Math.abs(expected - item.net_profit_cp) <= 0.01, `${item.internal_name} ${item.variant} net_profit_cp ${item.net_profit_cp} expected ${expected}`);
    assert.ok(item.net_profit_cp >= 0, `${item.internal_name} ${item.variant} negative net profit`);
    assert.ok(item.net_profit_cp <= item.market_value_cp, `${item.internal_name} ${item.variant} net profit exceeds market value`);
  }
});
