// Core game constants, enums, templates and helper functions

// ---- Global Tunables & Tables ----
export const PROF_MILESTONES = [10,20,30,40,50,60,70,80,90,100];
export const RACIAL_START_MULTIPLIER = {};
export const CAP_LEVEL_FOR_100 = 50;
export const CAP_BASE_PROF = 1;

export function proficiencyCap(L, A0 = CAP_BASE_PROF, A = 0, r = 1) {
  return Math.round(A0 + A + r * L);
}

// Full gain function with chance gate & fail/partial outcomes
export function gainProficiency(params) {
  const {
    P,
    L,
    A0,
    A,
    r,
    g0 = 1,
    F_context = 1,
    F_level = 1,
    F_attr = 1,
    F_repeat = 1,
    F_unlock_dist = 1,
    F_post = 1,
    F_capgap = 1,
    F_variety = 1,
    isNewSpellUse = false,
    success = true,
    M_new = 1,
    p_partial_fail = 0,
    fail_partial_factor = 0,
    \u03c4_high = 1,
    \u03c4_low = 0,
    p_small_min = 0,
    rand = Math.random
  } = params;

  const Cap = proficiencyCap(L, A0, A, r);
  const dP_raw =
    g0 *
    F_context *
    F_level *
    F_attr *
    F_repeat *
    F_unlock_dist *
    F_post *
    F_capgap *
    F_variety;

  const dP_success = isNewSpellUse
    ? Math.min(dP_raw * M_new, Cap - P)
    : Math.min(dP_raw, Cap - P);

  if (!success) {
    if (rand() < p_partial_fail) {
      return Math.round(P + dP_success * fail_partial_factor, 2);
    }
    return Math.round(P, 2);
  }

  let p_gain;
  if (isNewSpellUse) {
    p_gain = 0.95;
  } else if (dP_success >= \u03c4_high) {
    p_gain = 1;
  } else if (dP_success <= \u03c4_low) {
    p_gain = p_small_min;
  } else {
    const t = (dP_success - \u03c4_low) / (\u03c4_high - \u03c4_low);
    p_gain = p_small_min + (1 - p_small_min) * t;
  }

  const dP_final = rand() < p_gain ? dP_success : 0;
  return Math.round(P + dP_final, 2);
}

// ---- Cost & Scaling ----
export function mpCost(tier) {
  return Math.ceil(3 * (1 + Math.log2(tier)));
}

export function staminaCost(tier) {
  return tier;
}

export const BASE_POWER_SCALE_FACTOR = 0.75;

export function buildBasePowers(tierCount, costFn, bpT1) {
  const cost = [];
  const bp = [];
  for (let i = 1; i <= tierCount; i++) {
    cost.push(costFn(i));
    bp.push(bpT1 * Math.pow(BASE_POWER_SCALE_FACTOR, i - 1));
  }
  return { cost, bp };
}

// ---- Effect Tuning ----
export const DISABLE_DURATION_PER_BP = 1;
export const DISABLE_AOE_FACTOR = 1;
export const DOT_TICK_COEFF_PER_BP = 1;
export const DOT_TICK_INTERVAL = 1;
export const DOT_DURATION_PER_BP = 1;
export const BUFF_DEF_PCT_PER_BP = 1;
export const RESIST_ALL_PCT_PER_BP = 1;
export const REGEN_PCTMAX_PER5S_PER_BP = 1;
export const HEAL_BASE_COEFF_PER_BP = 1;
export const SHIELD_ABSORB_PCT_PER_BP = 1;
export const LIFESTEAL_PCT_PER_BP = 1;
export const ENHANCE_PCT_PER_BP = 1;

// ---- Proficiency Formula Tunables ----
export const g0 = 1;
export const F_CONTEXT = { practice: 0.2, spar: 0.6, battle: 1.0 };
export const LEVEL_GAIN_MIN = 0.25;
export const LEVEL_GAIN_MAX = 1.75;
export const LEVEL_GAIN_SLOPE = 0.1;
export const ATTR_GAIN_MIN = 0.7;
export const ATTR_GAIN_MAX = 1.3;
export const ATTR_GAIN_SLOPE = 0.01;
export const W_unlock_window = 10;
export const POST_UNLOCK_CHOKE_K = 3;
export const VARIETY_BONUS_MAX = 0.25;
export const F_repeat = N => 1 / (1 + Math.log(1 + N));
export const τ_low = 0;
export const τ_high = 1;
export const p_small_min = 0;
export const p_partial_fail = 0;
export const fail_partial_factor = 0;
export const M_new = 1;
export const p_gain_newSpell = 0.95;

// ---- Data Catalog Placeholders ----
export const RESIST_PROFILE_DEFAULT = {};
export const ELEMENTAL_MATRIX = {};

// ---- RNG & Time ----
export const rng = seed => Math.random();
export const now = () => Date.now() / 1000;

// ---- Enums / Types ----
export const ATTR = ["STR","DEX","CON","VIT","LCK","AGI","INT","WIS","CHA"];
export const ELEMENTS = ["Stone","Water","Wind","Fire","Ice","Thunder","Dark","Light"];
export const WEAPONS = ["Sword","Greatsword","Dagger","Axe","Greataxe","Spear","Bow","Crossbow","Mace","Staff","Shield","Wand","Unarmed"];
export const CONTEXT = ["practice","spar","battle"];

// ---- Character Template ----
export const characterTemplate = {
  id: "",
  name: "",
  race: "",
  class: "",
  level: 1,
  xp: 0,
  attributes: {
    base: {
      STR: 0,
      DEX: 0,
      CON: 0,
      VIT: 0,
      LCK: 0,
      AGI: 0,
      INT: 0,
      WIS: 0,
      CHA: 0
    },
    current: {
      STR: 0,
      DEX: 0,
      CON: 0,
      VIT: 0,
      LCK: 0,
      AGI: 0,
      INT: 0,
      WIS: 0,
      CHA: 0
    }
  },
  maxHP: 0,
  hp: 0,
  maxMP: 0,
  mp: 0,
  maxStamina: 0,
  stamina: 0,
  attackPower: 0,
  rangedPower: 0,
  spellPower: 0,
  defense: 0,
  resistances: {},
  moveSpeed: 0,
  attackSpeed: 0,
  critChance: 0,
  critDamage: 0,
  proficiency: {
    elements: {},
    weapons: {},
    unlockHistory: {},
    varietyBuffer: {}
  },
  equipment: {
    mainHand: null,
    offHand: null,
    ranged: null,
    ammo: null,
    armor: null,
    trinkets: []
  },
  status: {
    activeEffects: [],
    cooldowns: {},
    tags: []
  }
};

// ---- Combat / Utility Function Stubs ----
export function computeDamage({ basePower }) {
  return basePower;
}
export function computeHeal({ baseCoeff, attribute }) {
  return baseCoeff * attribute;
}
let _effectSeq = 0;
function nextEffectId(prefix = "eff") {
  _effectSeq += 1;
  return `${prefix}:${Date.now()}:${_effectSeq}`;
}

/** Apply a temporary shield absorbing a fixed amount of damage. */
export function applyShield(target, amount, durationSec, sourceId = "system") {
  const id = nextEffectId("shield");
  const start = now();
  const end = start + durationSec;
  target.status.activeEffects.push({ id, kind: "shield", data: { amount }, start, end, sourceId });
  target.status.shield = (target.status.shield || 0) + amount;
  return id;
}

/** Apply stat modifiers as buffs. */
export function applyBuffs(target, modifiers, durationSec, sourceId = "system") {
  const id = nextEffectId("buff");
  const start = now();
  const end = start + durationSec;
  target.status.activeEffects.push({ id, kind: "buff", data: { modifiers }, start, end, sourceId });
  for (const [k, v] of Object.entries(modifiers)) {
    target[k] = (target[k] || 0) + Number(v);
  }
  return id;
}

/** Apply stat modifiers as debuffs. */
export function applyDebuffs(target, modifiers, durationSec, sourceId = "system") {
  const id = nextEffectId("debuff");
  const start = now();
  const end = start + durationSec;
  target.status.activeEffects.push({ id, kind: "debuff", data: { modifiers }, start, end, sourceId });
  for (const [k, v] of Object.entries(modifiers)) {
    target[k] = (target[k] || 0) - Number(v);
  }
  return id;
}

/** Apply a disable/control effect such as stun or silence. */
export function applyDisable(target, controlType, durationSec, sourceId = "system") {
  const id = nextEffectId("disable");
  const start = now();
  const end = start + durationSec;
  target.status.activeEffects.push({ id, kind: "control", data: { controlType }, start, end, sourceId });
  target.status.tags.push(controlType);
  return id;
}

/** Apply a DoT/HoT tick based on percent-per-5s. Positive values damage, negative heal. */
export function runDotTick(target, per5sPct, resource = "HP") {
  const poolKey = resource.toLowerCase();
  const maxKey = `max${poolKey[0].toUpperCase()}${poolKey.slice(1)}`;
  const max = target[maxKey] || 0;
  const amt = (max * per5sPct) / 5 / 100;
  const cur = target[poolKey] || 0;
  const next = per5sPct >= 0 ? Math.max(0, cur - amt) : Math.min(max, cur - amt);
  target[poolKey] = next;
  return amt;
}

/** Check if actor has sufficient resources for a cost object. */
export function hasResources(target, cost) {
  const mpOk = cost.mp ? target.mp >= cost.mp : true;
  const staminaOk = cost.stamina ? target.stamina >= cost.stamina : true;
  const hpOk = cost.hp ? target.hp >= cost.hp : true;
  return mpOk && staminaOk && hpOk;
}

/** Spend resources as specified. */
export function spendResources(target, cost) {
  if (cost.mp) target.mp = Math.max(0, target.mp - cost.mp);
  if (cost.stamina) target.stamina = Math.max(0, target.stamina - cost.stamina);
  if (cost.hp) target.hp = Math.max(0, target.hp - cost.hp);
}

/** Start a cooldown timer for an action. */
export function startCooldown(target, actionId, cdSec) {
  const end = now() + cdSec;
  target.status.cooldowns[actionId] = end;
  return end;
}

/** Check if an action is on cooldown. */
export function isOnCooldown(target, actionId) {
  const end = target.status.cooldowns[actionId] || 0;
  return end > now();
}
export function getTargetsInRadius() { return []; }
export function getTargetsInCone() { return []; }
export function lineTrace() { return []; }
export function getResistMultiplier() { return 1; }
export function resolveDisableResistance() { return 1; }
export function logAction() {}
export function recordVariety() {}

// ---- EffectInstance JSDoc ----
/**
 * @typedef {Object} EffectInstance
 * @property {string} id
 * @property {string} kind
 * @property {any} data
 * @property {number} start
 * @property {number} end
 * @property {string} sourceId
 * @property {number} [stacks]
 */
