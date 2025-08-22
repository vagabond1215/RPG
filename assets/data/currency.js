export const DENOMINATIONS = ['iron', 'copper', 'silver', 'gold', 'platinum', 'gem'];

export const CURRENCY_VALUES = {
  iron: 1,
  copper: 10,
  silver: 10 * 25, // 250 iron
  gold: 10 * 25 * 50, // 12,500 iron
  platinum: 10 * 25 * 50 * 100, // 1,250,000 iron
  gem: 10 * 25 * 50 * 100 * 100, // 125,000,000 iron
};

export function convertCurrency(amount, from, to) {
  if (!CURRENCY_VALUES[from] || !CURRENCY_VALUES[to]) return null;
  return (amount * CURRENCY_VALUES[from]) / CURRENCY_VALUES[to];
}

export function toIron(amounts) {
  return Object.entries(amounts).reduce(
    (sum, [denom, val]) => sum + (CURRENCY_VALUES[denom] || 0) * val,
    0
  );
}

export function fromIron(iron) {
  const result = {};
  let remaining = iron;
  for (let i = DENOMINATIONS.length - 1; i >= 0; i--) {
    const denom = DENOMINATIONS[i];
    const value = CURRENCY_VALUES[denom];
    const count = Math.floor(remaining / value);
    if (count > 0) {
      result[denom] = count;
      remaining -= count * value;
    }
  }
  return result;
}
