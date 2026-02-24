// weapon_skills.js — full weapon skill list (ES module)

/**
 * Core rules:
 * - Each weapon has 10 skills:
 *   5 Single-Target (damage), 2 AoE (damage), 1 Ultimate (ST or AoE), 2 Specials (disable/DoT/enhance).
 * - Unlocks: one skill every 10 proficiency: 10,20,...,100
 * - Cost scaling (resource):
 *   Stamina skills:    STAM = ceil(3 * (1 + log2(tier)))
 *   Mana skills (Wand): MANA = ceil(3 * (1 + log2(tier)))
 * - Base Power scaling per family (Damage vs Special):
 *   BP[n] = BP[n-1] * (1 + 0.75 * ((Cost[n] - Cost[n-1]) / Cost[n-1]))
 *   Families:
 *     - Damage family: all ST, AoE, Ultimate damage skills
 *     - Special family: the 2 specials (disable / DoT / enhancement)
 * - Effects are fully structured so your engine can parse & compute.
 */

import { WEAPON_SKILL_CATALOG } from "./weapon_skill_catalog.js";

/* ----------------------------- Helpers ----------------------------- */

const r2 = (x) => Math.round(x * 1e2) / 1e2;
const r4 = (x) => Math.round(x * 1e4) / 1e4;

const PROF_MILESTONES = [10,20,30,40,50,60,70,80,90,100];

const staminaCost = (tier) => Math.ceil(3 * (1 + Math.log2(tier))); // 3,5,6,8,9,10,11,12,13,14
const manaCost    = (tier) => Math.ceil(3 * (1 + Math.log2(tier))); // identical curve for Wands

function buildBasePowers(tierCount, costFn, basePowerT1) {
  const cost = Array.from({ length: tierCount }, (_, i) => costFn(i + 1));
  const bp = [Number(basePowerT1)];
  for (let i = 1; i < tierCount; i++) {
    const dPct = (cost[i] - cost[i - 1]) / cost[i - 1];
    bp.push(bp[i - 1] * (1 + 0.75 * dPct));
  }
  return { cost, bp };
}

/* === Effect tuning (global) === */
const FX = {
  DISABLE_DURATION_PER_BP: 1.5,   // seconds per basePower
  DISABLE_AOE_FACTOR: 0.75,       // AoE disables shorter duration
  DOT_TICK_COEFF_PER_BP: 0.22,    // DoT tick coeff vs key attribute
  DOT_TICK_INTERVAL: 2,           // sec
  DOT_DURATION_PER_BP: 4.0,       // seconds
  ENHANCE_PCT_PER_BP: 12,         // % buff per basePower (generic)
  LIFESTEAL_PCT_PER_BP: 6,        // % of damage returned as HP
  SHIELD_ABSORB_PCT_PER_BP: 18,   // % of Max HP absorption
  DMG_NOTE: "Damage computed by engine from basePower × key attributes × proficiency × resistances.",
};

/* -------------------- Weapon Families & Attributes -------------------- */
/** keyAttribute is used by your engine as the primary scaler.
 *  secondaryAttribute is optional (some weapons benefit from finesse/speed).
 */
const WEAPON_DEFS = WEAPON_SKILL_CATALOG;

// Mapping weapon names to their corresponding ProficiencyKind entries
const WEAPON_PROFICIENCY_KIND = {
  Sword: "Weapon_Sword",
  Greatsword: "Weapon_Greatsword",
  Dagger: "Weapon_Dagger",
  Axe: "Weapon_Axe",
  Greataxe: "Weapon_Greataxe",
  Spear: "Weapon_Spear",
  Bow: "Weapon_Bow",
  Crossbow: "Weapon_Crossbow",
  Mace: "Weapon_Mace",
  Staff: "Weapon_Staff",
  Shield: "Weapon_Shield",
  Wand: "Weapon_Wand",
  Unarmed: "Weapon_Unarmed",
};

/* --------------------------- Effect Builders --------------------------- */

function buildDisableEffect(kind, target, basePower, extra = {}) {
  const durBase = FX.DISABLE_DURATION_PER_BP * basePower;
  const durationSec = r2(target === "AoE" ? durBase * FX.DISABLE_AOE_FACTOR : durBase);
  return { kind: "disable", type: kind, durationSec, model: "resist-based", ...extra };
}

function buildDotEffect(attribute, basePower, extra = {}) {
  const tickCoeff = r4(FX.DOT_TICK_COEFF_PER_BP * basePower);
  const durationSec = Math.max(4, Math.round(FX.DOT_DURATION_PER_BP * basePower));
  return {
    kind: "dot",
    attribute,
    baseTickCoeff: tickCoeff,
    tickIntervalSec: FX.DOT_TICK_INTERVAL,
    durationSec,
    model: "attribute-scaled",
    ...extra
  };
}

function buildBuffEffect(mods, basePower, target = "ST", extra = {}) {
  // Mods are percentage-based unless otherwise indicated.
  const scaledMods = {};
  for (const [k, perBP] of Object.entries(mods)) {
    // perBP is a function that returns pct from basePower
    scaledMods[k] = Math.round(perBP(basePower));
  }
  const durationSec = Math.max(8, Math.round(6 * basePower));
  return { kind: "buff", modifiers: scaledMods, durationSec, ...extra };
}

function buildShieldEffect(basePower, target = "ST", extra = {}) {
  const pct = Math.round(FX.SHIELD_ABSORB_PCT_PER_BP * basePower * (target === "AoE" ? 0.85 : 1));
  const durationSec = Math.max(8, Math.round(8 * basePower));
  return { kind: "shield", absorbPctMaxHP: pct, durationSec, ...extra };
}

function buildLifestealEffect(basePower, extra = {}) {
  const pct = Math.round(FX.LIFESTEAL_PCT_PER_BP * basePower);
  const durationSec = Math.max(6, Math.round(6 * basePower));
  return { kind: "enhance", onHit: { lifestealPct: pct }, durationSec, ...extra };
}

function buildMomentumEffect(basePower, extra = {}) {
  const atkSpd = Math.round(FX.ENHANCE_PCT_PER_BP * basePower);
  const moveSpd = Math.round((FX.ENHANCE_PCT_PER_BP * 0.6) * basePower);
  const durationSec = Math.max(6, Math.round(6 * basePower));
  return { kind: "enhance", modifiers: { ATTACK_SPEED_PCT: atkSpd, MOVE_SPEED_PCT: moveSpd }, durationSec, ...extra };
}

function resolveSpecialEffect(info, basePower, def, fallbackTarget) {
  const hint = info.effect;
  if (!hint) return null;
  const target = hint.target || fallbackTarget;
  switch (hint.template) {
    case "disable":
      return buildDisableEffect(hint.variant || "disable", target, basePower, hint.extra);
    case "dot":
      return buildDotEffect(hint.attribute || def.keyAttribute, basePower, { school: hint.school, ...hint.extra });
    case "buff": {
      const modFns = {};
      for (const [modKey, spec] of Object.entries(hint.mods || {})) {
        if (typeof spec === "number") {
          modFns[modKey] = () => spec;
        } else if (spec === "enhance") {
          modFns[modKey] = (bp) => FX.ENHANCE_PCT_PER_BP * bp;
        }
      }
      return buildBuffEffect(modFns, basePower, target, hint.extra);
    }
    case "shield":
      return buildShieldEffect(basePower, target, hint.extra);
    case "lifesteal":
      return buildLifestealEffect(basePower, hint.extra);
    case "momentum":
      return buildMomentumEffect(basePower, hint.extra);
    case "heal":
      return {
        kind: "heal",
        attribute: hint.attribute || def.keyAttribute,
        baseAmountCoeff: r4((hint.coeffMultiplier ?? 0.8) * basePower),
        model: hint.model || "attribute-scaled",
        ...hint.extra
      };
    case "debuff": {
      const modifiers = {};
      for (const mod of hint.modifiers || []) {
        const scale = mod.scale ?? "enhance";
        if (typeof scale === "number") {
          modifiers[mod.stat] = scale;
        } else if (scale === "enhance") {
          modifiers[mod.stat] = Math.round(FX.ENHANCE_PCT_PER_BP * basePower);
        }
      }
      const durationSec = Math.max(hint.minDuration ?? 8, Math.round((hint.durationScale ?? 6) * basePower));
      return { kind: "debuff", modifiers, durationSec, model: hint.model || "resist-based", ...hint.extra };
    }
    default:
      return null;
  }
}

/* ----------------------- Skill List Construction ----------------------- */

function buildWeaponSkills(weaponName, def) {
  const dmg = buildBasePowers(9, def.resourceType === "mana" ? manaCost : staminaCost, 1.00);
  const spc = buildBasePowers(2, def.resourceType === "mana" ? manaCost : staminaCost, 0.25);

  const unlocks = PROF_MILESTONES.slice();
  const resourceCostFn = def.resourceType === "mana" ? manaCost : staminaCost;

  const skillDefs = def.skills || {};
  const stSkills = skillDefs.st || [];
  const aoeSkills = skillDefs.aoe || [];
  const specialInfos = skillDefs.specials || [];

  if (stSkills.length < 5) {
    throw new Error(`Weapon ${weaponName} requires five single-target skills.`);
  }
  if (aoeSkills.length < 2) {
    throw new Error(`Weapon ${weaponName} requires two area skills.`);
  }
  if (!skillDefs.ultimate) {
    throw new Error(`Weapon ${weaponName} is missing an ultimate skill definition.`);
  }
  if (specialInfos.length < 2) {
    throw new Error(`Weapon ${weaponName} requires two special skills.`);
  }

  const baseMasterySource = stSkills[stSkills.length - 1];
  const masteryEntry = skillDefs.mastery
    ? { info: skillDefs.mastery, slot: skillDefs.mastery.slot || "mastery" }
    : {
        info: {
          ...baseMasterySource,
          name: `${baseMasterySource.name} (Mastery)`,
          target: baseMasterySource.target || "ST",
          description: baseMasterySource.description || "",
          combatNotes: `${baseMasterySource.combatNotes || ""} Mastery variant pushes the technique to its limit.`,
          keywords: [...(baseMasterySource.keywords || []), "Mastery"]
        },
        slot: "mastery"
      };

  const damageSources = [
    { info: stSkills[0], slot: "st" },
    { info: stSkills[1], slot: "st" },
    { info: aoeSkills[0], slot: "aoe" },
    { info: stSkills[2], slot: "st" },
    { info: aoeSkills[1], slot: "aoe" },
    { info: stSkills[3], slot: "st" },
    { info: stSkills[4], slot: "st" },
    masteryEntry,
    { info: skillDefs.ultimate, slot: "ultimate" }
  ];

  const damageSkills = damageSources.map((entry, i) => {
    if (!entry.info) {
      throw new Error(`Missing damage skill data for ${weaponName} at tier ${i + 1}`);
    }
    const tier = i + 1;
    const prof = unlocks[i];
    const ultimate = entry.slot === "ultimate";
    let target = entry.info.target;
    if (!target) {
      if (entry.slot === "aoe") {
        target = "AoE";
      } else if (ultimate) {
        target = "ST/AoE";
      } else {
        target = "ST";
      }
    }
    return {
      id: `${weaponName}:DMG:${tier}`,
      weapon: weaponName,
      proficiencyKind: WEAPON_PROFICIENCY_KIND[weaponName],
      name: entry.info.name,
      family: "damage",
      type: "Attack",
      slot: entry.slot,
      target,
      proficiency: prof,
      basePower: r4(dmg.bp[i]),
      resourceType: def.resourceType,
      resourceCost: resourceCostFn(tier),
      keyAttribute: def.keyAttribute,
      secondaryAttribute: def.secondaryAttribute,
      ultimate,
      notes: FX.DMG_NOTE,
      description: entry.info.description || "",
      combatNotes: entry.info.combatNotes || "",
      keywords: entry.info.keywords || []
    };
  });

  const specialProfs = [30, 100];
  const specials = specialInfos.map((info, i) => {
    const tier = i + 1;
    const basePower = r4(spc.bp[i]);
    const prof = specialProfs[i] ?? specialProfs[specialProfs.length - 1];
    let target = info.target || "ST";
    let effect = resolveSpecialEffect(info, basePower, def, target);
    if (info.effect?.target) {
      target = info.effect.target;
    }
    let heuristicType = info.type || "Special";

    if (!effect) {
      const n = info.name.toLowerCase();
      if (n.includes("bleed") || n.includes("hemorrhage") || n.includes("poison")) {
        effect = buildDotEffect(def.keyAttribute, basePower, { school: n.includes("poison") ? "poison" : "bleed" });
        if (!info.type) heuristicType = "DoT";
      } else if (
        n.includes("hamstring") || n.includes("nerve") || n.includes("stun") || n.includes("lock") ||
        n.includes("paralyze") || n.includes("blind") || n.includes("net") || n.includes("pin") ||
        n.includes("crushing blow") || n.includes("concussive")
      ) {
        const kind =
          n.includes("hamstring") ? "slow" :
          n.includes("nerve") ? "paralyze" :
          n.includes("stun") || n.includes("concussive") || n.includes("crushing blow") ? "stun" :
          n.includes("blind") ? "blind" :
          (n.includes("net") || n.includes("pin") || n.includes("lock")) ? "immobilize" :
          "disable";
        effect = buildDisableEffect(kind, target, basePower);
        if (!info.type) heuristicType = "Control";
      } else if (n.includes("rend") || n.includes("sunder") || n.includes("armor")) {
        effect = {
          kind: "debuff",
          modifiers: { DEF_PCT_DOWN: Math.round(FX.ENHANCE_PCT_PER_BP * basePower) },
          durationSec: Math.max(8, Math.round(6 * basePower)),
          model: "resist-based"
        };
        if (!info.type) heuristicType = "Debuff";
      } else if (n.includes("lifesteal") || n.includes("siphon")) {
        effect = buildLifestealEffect(basePower);
        if (!info.type) heuristicType = "Enhance";
      } else if (weaponName === "Shield" && (n.includes("recovery") || n.includes("aegis") || n.includes("roar"))) {
        if (n.includes("recovery")) {
          effect = {
            kind: "heal",
            attribute: "CON",
            baseAmountCoeff: r4(0.8 * basePower),
            model: "attribute-scaled"
          };
          if (!info.type) heuristicType = "Heal";
        } else {
          target = "AoE";
          effect = buildBuffEffect({ DMG_REDUCTION_PCT: (bp) => FX.ENHANCE_PCT_PER_BP * bp }, basePower, "AoE");
          if (!info.type) heuristicType = "Buff";
        }
      } else {
        effect = buildMomentumEffect(basePower);
        if (!info.type) heuristicType = "Enhance";
      }
    }

    if (!effect) {
      effect = buildMomentumEffect(basePower);
    }

    const finalType = info.type || heuristicType;

    return {
      id: `${weaponName}:SPC:${tier}`,
      weapon: weaponName,
      proficiencyKind: WEAPON_PROFICIENCY_KIND[weaponName],
      name: info.name,
      family: "special",
      type: finalType,
      slot: "special",
      target,
      proficiency: prof,
      basePower,
      resourceType: def.resourceType,
      resourceCost: resourceCostFn(tier),
      keyAttribute: def.keyAttribute,
      secondaryAttribute: def.secondaryAttribute,
      effect,
      description: info.description || "",
      combatNotes: info.combatNotes || "",
      keywords: info.keywords || []
    };
  });

  return [...damageSkills, ...specials].sort((a, b) =>
    a.proficiency === b.proficiency
      ? (a.family > b.family ? 1 : -1)
      : a.proficiency - b.proficiency
  );
}

/* -------------------------- Build All Weapons -------------------------- */

export function generateWeaponSkills() {
  const all = [];
  for (const [weapon, def] of Object.entries(WEAPON_DEFS)) {
    all.push(...buildWeaponSkills(weapon, def));
  }
  return all;
}

export const WEAPON_SKILLS = generateWeaponSkills();

/* ------------------------------- Usage ---------------------------------
import { WEAPON_SKILLS } from "./weapon_skills.js";

// Example: list all Dagger specials with their effects
const daggerSpecials = WEAPON_SKILLS.filter(s => s.weapon==="Dagger" && s.family==="special");

// Example: compute damage for a Sword ST at prof 40 (engine-side):
// dmg = basePower * f(STR, DEX) * g(proficiency) * resistMultipliers

// Example: apply a disable from "Hamstring":
// effect: { kind:"disable", type:"slow", durationSec: X, model:"resist-based" }

// Example: print JSON:
console.log(JSON.stringify(WEAPON_SKILLS, null, 2));
------------------------------------------------------------------------- */

// Design Notes (how to consume this cleanly)

// keyAttribute & secondaryAttribute: Your combat formula can weight them, e.g.
// meleeScale = STR + 0.4*DEX for Swords; rangedScale = DEX + 0.3*AGI for Bows; etc.

// resourceType/resourceCost: Most weapons use stamina; Wands use mana (edit to taste).
// Cost curve matches your magic (log base with base 3).

// basePower: Already scaled by the 75% of relative cost increase per family (Damage vs Special).
// You can keep all balancing centralized by tweaking the cost curve or the FX constants.

// effects:

// disable: { type:"stun|slow|paralyze|immobilize|blind", durationSec, model:"resist-based" }

// dot: { attribute:<key>, baseTickCoeff, tickIntervalSec, durationSec } (your engine multiplies by attribute, prof, and future resist/weakness)

// buff/debuff: { modifiers: { STAT_PCT: N }, durationSec }

// shield: { absorbPctMaxHP, durationSec }

// enhance (lifesteal/momentum): onHit.lifestealPct or modifiers.ATTACK_SPEED_PCT / MOVE_SPEED_PCT

// heal: { attribute, baseAmountCoeff } for shield recovery and similar.

// Ultimate: flagged via ultimate: true on the 9th damage tier (proficiency 90). If you prefer it at 100, set the last damage skill’s proficiency to 100 and move the second special earlier (e.g., to 50 or 60).
