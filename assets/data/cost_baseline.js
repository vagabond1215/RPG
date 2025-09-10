import { parseCurrency, toIron, fromIron, formatCurrency, convertCurrency } from './currency.js';

/**
 * Baseline commodity and service prices expressed in the game's currency system.
 * Prices are stored as cold-iron equivalents so they can be converted to any
 * denomination (copper, silver, gold, etc.) through the currency helpers.
 */
export const BASELINE_COSTS = {
  flourSack: {
    label: 'Sack of flour (~25 lb)',
    iron: toIron(parseCurrency('6 cp')),
    rationale: '280‑lb sack historically ~60d ⇒ scaled down to 25 lb'
  },
  dozenEggs: {
    label: 'Dozen eggs',
    iron: toIron(parseCurrency('4 cp')),
    rationale: 'Recorded range 3–6d; hens common near cities'
  },
  breadLoaf: {
    label: 'Loaf of bread (~1 lb)',
    iron: toIron(parseCurrency('1 cp')),
    rationale: 'Wheaten loaf; rye/barley could be ½ cp'
  },
  waterskinFilled: {
    label: 'Waterskin, filled',
    iron: toIron(parseCurrency('8 cp')),
    rationale: 'Includes leatherwork, strap, and plug'
  },
  waterRefill: {
    label: 'Water refill (street vendor)',
    ironRange: [0, convertCurrency(0.5, 'copper', 'coldIron')],
    rationale: 'Public sources free; charge if carried/drawn'
  },
  aleTankard: {
    label: 'Tankard of ale (pint, tavern)',
    iron: toIron(parseCurrency('2 cp')),
    rationale: 'Ale 1–2d/gal; tavern markup'
  },
  beefJerky: {
    label: 'Beef jerky (meal portion)',
    iron: toIron(parseCurrency('4 cp')),
    rationale: 'Extra labor + shrinkage over fresh beef'
  },
  rawChicken: {
    label: 'Raw chicken (whole)',
    iron: toIron(parseCurrency('3 cp')),
    rationale: 'Common poultry; affordable protein'
  },
  basicClothes: {
    label: 'Basic cloth shirt & pants',
    iron: toIron(parseCurrency('18 cp')),
    rationale: 'Tunic + trousers in homespun cloth'
  },
  leatherShoes: {
    label: 'Simple leather shoes',
    iron: toIron(parseCurrency('8 cp')),
    rationale: 'Historical range 6–12d'
  },
  leatherBelt: {
    label: 'Simple leather belt',
    iron: toIron(parseCurrency('3 cp')),
    rationale: 'Low labor tanning/cutting'
  },
  rentSuite: {
    label: 'Rent (single suite, monthly)',
    iron: toIron(parseCurrency('18 cp')),
    rationale: 'Modest urban lodgings'
  },
  innNight: {
    label: 'Low-end inn, 1 night',
    iron: toIron(parseCurrency('4 cp')),
    rationale: 'Food sometimes bundled (+1–2d)'
  }
};

export const COST_SCALING_GUIDELINES = {
  everydayConsumables: '1–6 cp',
  durableGoods: '6–24 cp',
  housingAndServices: 'dozens of cp per month',
  luxuryGoods: 'silver pieces and above'
};

/**
 * Return the price of an item converted to the requested denomination.
 * @param {keyof typeof BASELINE_COSTS} key
 * @param {'coldIron'|'steel'|'copper'|'silver'|'gold'|'platinum'} denom
 * @returns {number[]|number|null} price in the chosen denomination
 */
export function priceIn(key, denom = 'copper') {
  const entry = BASELINE_COSTS[key];
  if (!entry) return null;
  if (entry.ironRange) {
    return entry.ironRange.map(iron => convertCurrency(iron, 'coldIron', denom));
  }
  return convertCurrency(entry.iron, 'coldIron', denom);
}

/**
 * Human‑readable price string for display purposes.
 * @param {keyof typeof BASELINE_COSTS} key
 * @returns {string} formatted currency string
 */
export function formattedPrice(key) {
  const entry = BASELINE_COSTS[key];
  if (!entry) return '';
  if (entry.ironRange) {
    return entry.ironRange
      .map(iron => formatCurrency(fromIron(iron)))
      .join('–');
  }
  return formatCurrency(fromIron(entry.iron));
}

