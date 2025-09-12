export const DENOMINATIONS = [
  'coldIron',
  'steel',
  'copper',
  'silver',
  'gold',
  'platinum'
];

export const CURRENCY_VALUES = {
  coldIron: 1,
  steel: 10,
  copper: 100,
  silver: 10000,
  gold: 200000,
  platinum: 1000000,
};

const ABBR_MAP = {
  ci: 'coldIron',
  st: 'steel',
  cp: 'copper',
  sp: 'silver',
  gp: 'gold',
  pp: 'platinum',
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

export function createEmptyCurrency() {
  return Object.fromEntries(DENOMINATIONS.map(d => [d, 0]));
}

export function parseCurrency(str) {
  const result = createEmptyCurrency();
  if (!str || str.trim() === '0') return result;
  const regex = /(\d+)\s*(ci|st|cp|sp|gp|pp)/gi;
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

export function toCp({pl=0,g=0,si=0,cp=0,st=0,ci=0}={}){
  const iron = toIron({
    platinum: pl,
    gold: g,
    silver: si,
    copper: cp,
    steel: st,
    coldIron: ci,
  });
  return convertCurrency(iron, 'coldIron', 'copper');
}

export function cpToCoins(value, tidy=true){
  const iron = Math.round(convertCurrency(value, 'copper', 'coldIron'));
  const counts = fromIron(iron);
  const order = ['platinum','gold','silver','copper','steel','coldIron'];
  const abbr = {platinum:'pl', gold:'g', silver:'si', copper:'cp', steel:'st', coldIron:'ci'};
  const result = [];
  for (const denom of order){
    const count = counts[denom] || 0;
    if (count > 0 || (!tidy && result.length)){
      if (count > 0 || !tidy) result.push(`${count}${abbr[denom]}`);
    }
  }
  return result.length ? result.join(' ') : '0cp';
}
