// Core game constants, enums, templates and helper functions

import { createEmptyEquipment } from "./equipment.js";
import { createEmptyCurrency } from "./currency.js";

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
  sex: "",
  class: "",
  theme: "",
  homeTown: "",
  location: "",
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
  equipment: createEmptyEquipment(),
  status: {
    activeEffects: [],
    cooldowns: {},
    tags: []
  },
  money: createEmptyCurrency(),
  inventory: [],
  buildings: [],
  employment: [],
  guildRank: 'None',
  adventurersGuildRank: 'None',
  backstory: null,
  position: null
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
