/**
 * Attribute progression and growth helpers.
 *
 * @typedef {'STR'|'DEX'|'CON'|'VIT'|'AGI'|'INT'|'WIS'|'CHA'} Attr
 * @typedef {Record<Attr, number>} AttrMap
 *
 * @typedef {Object} GrowthState
 * @property {AttrMap} attrs - current integer attributes
 * @property {AttrMap} acc - fractional accumulators
 * @property {number} choicePool - unspent player points
 */

/**
 * Initialize growth state and per-level rates.
 * Humans receive two choice points per level; others receive one.
 *
 * @param {AttrMap} raceA0 starting attributes for the race
 * @param {boolean} isHuman whether the character is human
 * @param {number} [LV_MAX=50] unused maximum level parameter
 * @param {number} [k=3] base growth constant
 * @returns {{state: GrowthState, perLevel: {rates: AttrMap, choicePerLevel: number}}}
 */
export function initGrowth(raceA0, isHuman, LV_MAX = 50, k = 3) {
  const c = isHuman ? 2 : 1;
  const a = k - c; // Humans 1, others 2 (with k=3)
  const sum0 = Object.values(raceA0).reduce((s, v) => s + v, 0);

  /** @type {AttrMap} */
  const rates = {};
  Object.keys(raceA0).forEach(key => {
    const w = raceA0[key] / sum0;
    rates[key] = a * w; // constant linear rate per level
  });

  /** @type {AttrMap} */
  const accInit = { STR:0,DEX:0,CON:0,VIT:0,AGI:0,INT:0,WIS:0,CHA:0 };

  /** @type {GrowthState} */
  const state = {
    attrs: { ...raceA0 },
    acc: accInit,
    choicePool: 0
  };

  return { state, perLevel: { rates, choicePerLevel: c } };
}

/**
 * Apply automatic attribute growth and grant choice points for a level up.
 *
 * @param {GrowthState} state mutable growth state
 * @param {AttrMap} rates per-level fractional rates
 * @param {number} choicePerLevel number of choice points awarded
 */
export function onLevelUp(state, rates, choicePerLevel) {
  // grant choice points
  state.choicePool += choicePerLevel;

  // apply linear auto growth with fractional carry
  Object.keys(rates).forEach(key => {
    state.acc[key] += rates[key];
    while (state.acc[key] >= 1.0) {
      state.attrs[key] += 1;
      state.acc[key] -= 1.0;
    }
  });
}

/**
 * Spend a choice point to raise an attribute by one.
 *
 * @param {GrowthState} state
 * @param {Attr} attr attribute to increase
 * @returns {boolean} true if the point was spent, false otherwise
 */
export function spendChoicePoint(state, attr) {
  if (state.choicePool <= 0) return false;
  state.choicePool -= 1;
  state.attrs[attr] += 1;
  return true;
}

