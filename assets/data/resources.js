/**
 * Dynamic resource calculation based on attributes and level (TS/JS compatible).
 *
 * Core attributes (Luck excluded for resources)
 * @typedef {"STR"|"DEX"|"CON"|"VIT"|"AGI"|"INT"|"WIS"|"CHA"} Attr
 * @typedef {Record<Attr, number>} AttrBlock
 *
 * @typedef {Object} RaceGrowth
 * @property {number} a - automatic points per level
 * @property {number} c - choice points per level
 */

/** Dials */
export const LV_MAX = 50;
/** @type {RaceGrowth} */
export const HUMAN_GROWTH = { a: 1, c: 2 };
/** @type {RaceGrowth} */
export const OTHER_GROWTH = { a: 2, c: 1 };

/** Resource formulas (updated factors) */
export const maxMP      = (WIS, L) => 5 * WIS + 2 * (L - 1);
export const maxHP      = (VIT, CON, L) => 2.5 * (VIT + CON) + 5 * (L - 1);
export const maxStamina = (CON, L) => 5 * CON + 4 * (L - 1);

/**
 * Optional per-level choice allocation plan.
 * Map level -> list of attributes to increment by 1 each (must not exceed c at that level).
 * Example: { 2:["WIS"], 3:["WIS","WIS"], 5:["VIT"] }
 * @typedef {Record<number, Attr[]>} ChoicePlan
 */

/**
 * Compute attributes at level L from racial A0 using:
 *  - auto progression (proportional to starting weights, fractional carry, whole-points only)
 *  - optional player choice allocations (integers only), via ChoicePlan
 *
 * @param {AttrBlock} A0 starting attributes
 * @param {number} L target level
 * @param {boolean} isHuman whether the character is human
 * @param {ChoicePlan} [choicePlan] optional per-level choices
 * @returns {AttrBlock} attributes at level L
 */
export function attributesAtLevel(A0, L, isHuman, choicePlan) {
  const { a } = isHuman ? HUMAN_GROWTH : OTHER_GROWTH;

  // starting totals
  const attrs = { ...A0 };
  const acc = { STR:0,DEX:0,CON:0,VIT:0,AGI:0,INT:0,WIS:0,CHA:0 };

  // proportional auto rates (constant per level)
  const sum0 = Object.values(A0).reduce((s,v)=>s+v,0);
  const rate = { STR:0,DEX:0,CON:0,VIT:0,AGI:0,INT:0,WIS:0,CHA:0 };
  Object.keys(A0).forEach(k => { rate[k] = a * (A0[k] / sum0); });

  // simulate levels 2..L
  for (let lvl = 2; lvl <= L; lvl++) {
    // 1) auto (with fractional carry; grant only whole points)
    Object.keys(rate).forEach(k => {
      acc[k] += rate[k];
      if (acc[k] >= 1.0) {
        const whole = Math.floor(acc[k]);
        attrs[k] += whole;
        acc[k] -= whole; // keep remainder (no truncation error)
      }
    });

    // 2) optional player choices for this level (must be integer adds)
    const picks = choicePlan?.[lvl];
    if (picks && picks.length) {
      for (const aName of picks) attrs[aName] += 1;
    }
  }

  return attrs;
}

/**
 * One-call convenience: returns all three resources given racial A0, level, race, and an optional choice plan.
 *
 * @param {AttrBlock} A0 starting attributes
 * @param {number} L level
 * @param {boolean} isHuman whether the character is human
 * @param {ChoicePlan} [choicePlan]
 * @returns {{ HP: number, MP: number, Stamina: number, attrs: AttrBlock }}
 */
export function computeResources(A0, L, isHuman, choicePlan) {
  const at = attributesAtLevel(A0, L, isHuman, choicePlan);
  return {
    HP:      maxHP(at.VIT, at.CON, L),
    MP:      maxMP(at.WIS, L),
    Stamina: maxStamina(at.CON, L),
    attrs:   at
  };
}

/* ---------------------------- Examples ----------------------------

const LOW  = 6, HIGH = 14;

// Example A: Non-human, LOW key stats (auto only), Level 1 vs 50
const A0_lowWIS = { STR:10,DEX:10,CON:10,VIT:10,AGI:10,INT:10,WIS:LOW,CHA:10 };
console.log(computeResources(A0_lowWIS, 1,  false)); // MP=5*6+0=30, HP=5*10+0=50, STA=5*10+0=50
console.log(computeResources(A0_lowWIS, 50, false)); // uses auto growth for WIS/VIT/CON, then formulas

// Example B: Non-human, HIGH key stats (auto only), Level 1 vs 50
const A0_highWIS = { STR:10,DEX:10,CON:10,VIT:10,AGI:10,INT:10,WIS:HIGH,CHA:10 };
console.log(computeResources(A0_highWIS, 1,  false));
console.log(computeResources(A0_highWIS, 50, false));

// Example C: Human with a choice plan dumping WIS every level
const humanA0 = { STR:10,DEX:10,CON:10,VIT:10,AGI:10,INT:10,WIS:10,CHA:10 };
const plan = Object.fromEntries(Array.from({length:49}, (_,i)=>[i+2, ["WIS","WIS"]])); // 2 pts/level to WIS
console.log(computeResources(humanA0, 50, true, plan));

------------------------------------------------------------------- */

