import { WEAPON_SKILLS } from "./weapon_skills.js";
import { SPELLBOOK } from "./spells.js";

const DAMAGE_TYPES = ["SLASH", "PIERCE", "BLUNT"];

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function findSkill(attackType, attackId) {
  if (!attackId) return null;
  const list = attackType === "spell" ? SPELLBOOK : WEAPON_SKILLS;
  if (!Array.isArray(list)) return null;
  return list.find(entry => entry && (entry.id === attackId || entry.name === attackId)) || null;
}

function fallbackSkill(attackType) {
  if (attackType === "spell") {
    return {
      id: "fallback-spell",
      name: "Arcane Pulse",
      basePower: 18,
      keyAttribute: "INT",
      secondaryAttribute: "WIS",
      critChancePct: 8,
      critMultiplier: 1.6,
    };
  }
  return {
    id: "fallback-strike",
    name: "Measured Strike",
    basePower: 16,
    keyAttribute: "STR",
    secondaryAttribute: "DEX",
    critChancePct: 6,
    critMultiplier: 1.5,
  };
}

function resolveSkill(attackType, attackId) {
  const skill = findSkill(attackType, attackId);
  if (!skill) return fallbackSkill(attackType);
  const keyAttribute = skill.keyAttribute || (attackType === "spell" ? "INT" : "STR");
  const secondaryAttribute = skill.secondaryAttribute || (attackType === "spell" ? "WIS" : "DEX");
  const basePower = Number(skill.basePower) || (attackType === "spell" ? 18 : 16);
  const critChancePct = Number(skill.critChancePct) || (attackType === "spell" ? 8 : 6);
  const critMultiplier = Number(skill.critMult || skill.critMultiplier) || (attackType === "spell" ? 1.6 : 1.5);
  return {
    id: skill.id,
    name: skill.name || skill.id,
    basePower,
    keyAttribute,
    secondaryAttribute,
    critChancePct,
    critMultiplier,
  };
}

function aggregateResists(resists) {
  if (!resists || typeof resists !== "object") return {};
  const out = {};
  for (const key of Object.keys(resists)) {
    const norm = key.toUpperCase();
    out[norm] = Number(resists[key]) || 0;
  }
  return out;
}

function buildActorProfile(actor) {
  if (!actor) {
    return {
      level: 1,
      attributes: {},
      proficiencies: {},
      defense: 0,
      resists: {},
    };
  }
  const attributes = actor.attributes && typeof actor.attributes === "object"
    ? { ...actor.attributes }
    : {};
  const proficiencies = actor.proficiencies && typeof actor.proficiencies === "object"
    ? { ...actor.proficiencies }
    : {};
  const defense = Number(actor.defense);
  return {
    level: Number.isFinite(actor.level) ? actor.level : 1,
    attributes,
    proficiencies,
    defense: Number.isFinite(defense) ? defense : 0,
    resists: aggregateResists(actor.resists),
    critDefense: Number(actor.critDefense) || 0,
    critDamageReductionPct: Number(actor.critDamageReductionPct) || 0,
  };
}

function resolveWeaponStats(stats = {}) {
  const critChancePct = Number(stats.critChancePct);
  const critMult = Number(stats.critMult);
  const dmgMix = {};
  if (stats.dmgMix && typeof stats.dmgMix === "object") {
    for (const type of DAMAGE_TYPES) {
      const value = Number(stats.dmgMix[type]);
      if (Number.isFinite(value)) {
        dmgMix[type] = clamp(value, 0, 1);
      }
    }
  }
  return {
    ap: Number(stats.ap) || 0,
    critChancePct: Number.isFinite(critChancePct) ? critChancePct : undefined,
    critMult: Number.isFinite(critMult) ? critMult : undefined,
    dmgMix,
  };
}

function effectiveProficiency(attacker, attackType, skill) {
  const key = attackType === "spell" ? `Element_${skill.element || "Arcane"}` : `Weapon_${skill.weaponType || "Sword"}`;
  const value = attacker.proficiencies[key];
  if (!Number.isFinite(value)) return 0;
  return clamp(value / 100, 0, 1.5);
}

function baseOffenseScore(actor, keyAttr, secondaryAttr) {
  const primary = Number(actor.attributes[keyAttr]) || 0;
  const secondary = Number(actor.attributes[secondaryAttr]) || 0;
  const agility = Number(actor.attributes.AGI) || 0;
  return primary * 1.2 + secondary * 0.6 + agility * 0.3;
}

function baseDefenseScore(defender) {
  const con = Number(defender.attributes.CON) || 0;
  const vit = Number(defender.attributes.VIT) || 0;
  const agi = Number(defender.attributes.AGI) || 0;
  const base = con * 0.9 + vit * 1.1 + agi * 0.35;
  return base + (Number(defender.defense) || 0);
}

function resolveResistMultiplier(defender, attackType, weaponStats) {
  const typedMix = weaponStats.dmgMix || {};
  let resistPct = 0;
  let totalWeight = 0;
  for (const type of Object.keys(typedMix)) {
    const share = typedMix[type];
    if (!Number.isFinite(share) || share <= 0) continue;
    totalWeight += share;
    resistPct += share * ((defender.resists[type] || 0) / 100);
  }
  if (totalWeight <= 0) {
    if (attackType === "spell") {
      const average = (defender.resists.ARCANE || defender.resists.MAGIC || 0) / 100;
      resistPct += average;
    } else {
      const avgPhysical = (defender.resists.SLASH || defender.resists.PIERCE || defender.resists.BLUNT || 0) / 100;
      resistPct += avgPhysical;
    }
  }
  return clamp(1 - resistPct, 0.5, 1.2);
}

export function calculateCombat(rawAttacker, rawDefender, opts = {}) {
  const attackType = opts.attackType === "spell" ? "spell" : "weapon";
  const rng = typeof opts.rng === "function" ? opts.rng : Math.random;
  const attacker = buildActorProfile(rawAttacker);
  const defender = buildActorProfile(rawDefender);
  const skill = resolveSkill(attackType, opts.attackId);
  const weaponStats = resolveWeaponStats(opts.weaponStats || {});

  const offense = baseOffenseScore(attacker, skill.keyAttribute, skill.secondaryAttribute);
  const defenseScore = baseDefenseScore(defender);
  const levelDelta = clamp(attacker.level - defender.level, -10, 15);
  const profFactor = 1 + effectiveProficiency(attacker, attackType, skill) * 0.6;
  const levelFactor = 1 + levelDelta * 0.04;
  const basePower = skill.basePower * profFactor * levelFactor;
  const mitigation = clamp(1 - defenseScore / (defenseScore + 120), 0.25, 0.95);
  const damageAfterDefense = basePower * mitigation;
  const resistMultiplier = resolveResistMultiplier(defender, attackType, weaponStats);
  const damage = damageAfterDefense * resistMultiplier * (1 + offense / 250);

  const agilityGap = (Number(attacker.attributes.AGI) || 0) - (Number(defender.attributes.AGI) || 0);
  const perception = Number(attacker.attributes.PER) || Number(attacker.attributes.WIS) || 0;
  const defenderAlert = Number(defender.attributes.PER) || Number(defender.attributes.WIS) || 0;
  const baseHit = 0.72 + agilityGap * 0.004 + (perception - defenderAlert) * 0.003;
  const hitChance = clamp(baseHit, 0.35, 0.96);
  const evasionChance = clamp(1 - hitChance, 0.02, 0.65);

  const blockChance = clamp((Number(defender.attributes.STR) || 0) * 0.0025 + (defender.defense || 0) * 0.0015, 0, 0.35);

  const critChanceBase = skill.critChancePct / 100 + (weaponStats.critChancePct || 0) / 100;
  const critChance = clamp(critChanceBase + (Number(attacker.attributes.LCK) || 0) * 0.002, 0.02, 0.55);
  const critMult = weaponStats.critMult || skill.critMultiplier || 1.5;

  const expectedDamage = hitChance * (damage * (1 - critChance) + damage * critMult * critChance);
  const didHit = rng() < hitChance;
  const critOccurred = didHit && rng() < critChance;
  const appliedDamage = didHit ? damage * (critOccurred ? critMult : 1) : 0;

  return {
    damage: appliedDamage,
    expectedDamage,
    didHit,
    critOccurred,
    critChance,
    critMultiplier: critOccurred ? critMult : 1,
    hitChance,
    evasionChance,
    blockChance,
    resistMultiplier,
    typedResistPct: (1 - resistMultiplier) * 100,
    totalResistPct: (1 - resistMultiplier) * 100,
    apBypassPct: clamp((weaponStats.ap || 0) * 100, 0, 50),
    onHitResults: [],
  };
}

export function describeCombatSkill(attackType, attackId) {
  const skill = resolveSkill(attackType, attackId);
  return skill ? skill.name || attackId : attackId;
}
