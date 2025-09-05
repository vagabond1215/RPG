export const DENOMINATIONS = [
  'coldIron',
  'steel',
  'copper',
  'silver',
  'gold',
  'platinum',
  'diamond'
];

export const CURRENCY_VALUES = {
  coldIron: 1,
  steel: 10,
  copper: 100,
  silver: 1000,
  gold: 10000,
  platinum: 100000,
  diamond: 1000000,
};

const ABBR_MAP = {
  ci: 'coldIron',
  st: 'steel',
  cp: 'copper',
  sp: 'silver',
  gp: 'gold',
  pp: 'platinum',
  d: 'diamond',
};

export function convertCurrency(amount, from, to, authorized = false) {
  if (!CURRENCY_VALUES[from] || !CURRENCY_VALUES[to]) return null;
  if ((from === 'diamond' || to === 'diamond') && !authorized) return null;
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

export function createEmptyCurrency() {
  return Object.fromEntries(DENOMINATIONS.map(d => [d, 0]));
}

export function parseCurrency(str) {
  const result = createEmptyCurrency();
  if (!str || str.trim() === '0') return result;
  const regex = /(\d+)\s*(ci|st|cp|sp|gp|pp|d)/gi;
  let match;
  while ((match = regex.exec(str))) {
    const amount = parseInt(match[1], 10);
    const denom = ABBR_MAP[match[2].toLowerCase()];
    if (denom) result[denom] += amount;
  }
  return result;
}

export function formatCurrency(obj) {
  const parts = [];
  for (let i = DENOMINATIONS.length - 1; i >= 0; i--) {
    const denom = DENOMINATIONS[i];
    const val = obj[denom];
    if (val) {
      const name = denom.replace(/([A-Z])/g, ' $1').toLowerCase();
      parts.push(`${val} ${name}`);
    }
  }
  return parts.join(' ') || '0 cold iron';
}
