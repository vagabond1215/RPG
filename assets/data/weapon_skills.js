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
const WEAPON_DEFS = {
  Sword: {
    keyAttribute: "STR", secondaryAttribute: "DEX", resourceType: "stamina",
    names: {
      st: ["Slash","Heavy Chop","Riposte","Piercing Lunge","Twin Strike"],
      aoe: ["Blade Sweep","Whirlwind Edge"],
      ultimate: "Excalibur’s Wrath",
      specials: ["Hamstring","Bleeding Edge"] // disable/DoT
    }
  },
  Greatsword: {
    keyAttribute: "STR", secondaryAttribute: null, resourceType: "stamina",
    names: {
      st: ["Cleave Strike","Heavy Arc","Overhead Slam","Driving Impale","Decapitator"],
      aoe: ["Wide Arc","Earthbreaker"],
      ultimate: "Cataclysmic Blade",
      specials: ["Crushing Blow","Rend Armor"]
    }
  },
  Dagger: {
    keyAttribute: "DEX", secondaryAttribute: "LCK", resourceType: "stamina",
    names: {
      st: ["Quick Stab","Dual Cut","Backstab","Fan of Blades (single)","Precision Strike"],
      aoe: ["Blade Flurry","Dance of Knives"],
      ultimate: "Assassinate",
      specials: ["Poisoned Blade","Blindstrike"]
    }
  },
  Axe: {
    keyAttribute: "STR", secondaryAttribute: null, resourceType: "stamina",
    names: {
      st: ["Chop","Heavy Swing","Crashing Blow","Hooked Strike","Splitting Edge"],
      aoe: ["Sweeping Chop","Lumberjack’s Rage"],
      ultimate: "Executioner’s Cleave",
      specials: ["Sundering Blow","Maim"]
    }
  },
  Greataxe: {
    keyAttribute: "STR", secondaryAttribute: null, resourceType: "stamina",
    names: {
      st: ["Bone Splitter","Heavy Hack","Skull Cleaver","Ravager’s Cut","Titanic Chop"],
      aoe: ["Reaper’s Swing","Mountain Splitter"],
      ultimate: "Ragnarok Slash",
      specials: ["Knockback Smash","Hemorrhage"]
    }
  },
  Spear: {
    keyAttribute: "STR", secondaryAttribute: "DEX", resourceType: "stamina",
    names: {
      st: ["Thrust","Skewer","Piercing Strike","Dragoon’s Dive","Impaling Drive"],
      aoe: ["Sweeping Spear","Pike Wall"],
      ultimate: "Dragon’s Fang",
      specials: ["Pinning Strike","Heartpiercer"]
    }
  },
  Bow: {
    keyAttribute: "DEX", secondaryAttribute: "AGI", resourceType: "stamina",
    names: {
      st: ["Quick Shot","Power Shot","Piercing Arrow","Double Nock","Sniper’s Mark"],
      aoe: ["Arrow Rain","Explosive Arrow"],
      ultimate: "Storm of Arrows",
      specials: ["Crippling Arrow","Poison Arrow"]
    }
  },
  Crossbow: {
    keyAttribute: "DEX", secondaryAttribute: "STR", resourceType: "stamina",
    names: {
      st: ["Quick Bolt","Piercer Bolt","Rapid Fire","Heavy Bolt","Sharpshot"],
      aoe: ["Scattershot","Explosive Bolt"],
      ultimate: "Ballista’s Wrath",
      specials: ["Crippling Bolt","Bolted Net"]
    }
  },
  Mace: {
    keyAttribute: "STR", secondaryAttribute: "CON", resourceType: "stamina",
    names: {
      st: ["Bash","Crushing Blow","Skullbreaker","Smite","Pulverize"],
      aoe: ["Earthshaker","Shockwave Smash"],
      ultimate: "Divine Judgment",
      specials: ["Concussive Strike","Armor Shatter"]
    }
  },
  Staff: {
    keyAttribute: "STR", secondaryAttribute: "AGI", resourceType: "stamina",
    names: {
      st: ["Staff Strike","Heavy Swing","Spinning Strike","Crushing Jab","Staff Combo"],
      aoe: ["Whirling Sweep","Quarterstaff Dance"],
      ultimate: "Sage’s Wrath",
      specials: ["Stunning Sweep","Momentum Flow"]
    }
  },
  Shield: {
    keyAttribute: "CON", secondaryAttribute: "VIT", resourceType: "stamina",
    names: {
      st: ["Shield Bash","Guard Slam","Iron Wall","Tower Slam","Retribution Strike"],
      aoe: ["Shield Wave","Bulwark Circle"],
      ultimate: "Aegis of Valor",
      specials: ["Shield of Recovery","Guardian’s Roar"]
    }
  },
  Wand: {
    keyAttribute: "INT", secondaryAttribute: "WIS", resourceType: "mana",
    names: {
      st: ["Focused Bolt","Arc Lash","Resonant Pierce","Channelled Ray","Prism Break"],
      aoe: ["Scatter Pulse","Arc Nova"],
      ultimate: "Starfall Conduit",
      specials: ["Mind Lock","Mana Siphon"]
    }
  },
  Unarmed: {
    keyAttribute: "STR", secondaryAttribute: "AGI", resourceType: "stamina",
    names: {
      st: ["Jab Cross","Elbow Smash","Rising Uppercut","Tiger Palm","Dragon Fang Kick"],
      aoe: ["Sweeping Heel","Shockwave Clap"],
      ultimate: "Heavenly Comet Fist",
      specials: ["Nerve Strike","Chi Siphon"]
    }
  }
};

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

/* ----------------------- Skill List Construction ----------------------- */

function buildWeaponSkills(weaponName, def) {
  // Damage family (8 dmg skills + 1 ultimate dmg = 8+1 = 9 damage tiers)
  // We need 5 ST + 2 AoE + 1 Ultimate (damage) = 8 damage entries + ultimate (uses tier 9).
  const dmg = buildBasePowers(9, def.resourceType === "mana" ? manaCost : staminaCost, 1.00);

  // Special family (2 tiers) start smaller (0.25) since they’re not raw DPS.
  const spc = buildBasePowers(2, def.resourceType === "mana" ? manaCost : staminaCost, 0.25);

  const unlocks = PROF_MILESTONES.slice(); // 10..100

  // Order damage names for tiers: ST1, ST2, AoE1, ST3, AoE2, ST4, ST5, (filler ST), Ultimate
  const dmgNames = [
    def.names.st[0], // t1 ST
    def.names.st[1], // t2 ST
    def.names.aoe[0],// t3 AoE
    def.names.st[2], // t4 ST
    def.names.aoe[1],// t5 AoE
    def.names.st[3], // t6 ST
    def.names.st[4], // t7 ST
    // filler to keep 8 damage before ultimate; reuse last ST nicely themed:
    (def.names.st[4] + " (Mastery)"),
    def.names.ultimate // t9 ultimate
  ];

  // Targets for damage tiers:
  const dmgTargetByTier = {
    1: "ST", 2: "ST", 3: "AoE", 4: "ST", 5: "AoE", 6: "ST", 7: "ST", 8: "ST", 9: "ST/AoE"
  };

  const resourceCostFn = def.resourceType === "mana" ? manaCost : staminaCost;

  // Build 8 damage + 1 ultimate (mapped to 9 of the 10 unlocks)
  const damageSkills = dmgNames.map((name, i) => {
    const tier = i + 1;
    const idx = i; // 0..8
    const prof = unlocks[i]; // 10..90
    const target = dmgTargetByTier[tier];
    const ultimate = (tier === 9);
    return {
      id: `${weaponName}:DMG:${tier}`,
      weapon: weaponName,
      proficiencyKind: WEAPON_PROFICIENCY_KIND[weaponName],
      name,
      family: "damage",
      type: "Attack",
      target,
      proficiency: prof,
      basePower: r4(dmg.bp[idx]),
      resourceType: def.resourceType,
      resourceCost: resourceCostFn(tier),
      keyAttribute: def.keyAttribute,
      secondaryAttribute: def.secondaryAttribute,
      ultimate,
      notes: FX.DMG_NOTE
    };
  });

  // Specials: 2 entries occupy the last unlock (100) and one earlier (likely 30)
  // We’ll place specials at prof 30 and 100 by default for gameplay rhythm.
  const specialProfs = [30, 100];
  const specials = def.names.specials.map((name, i) => {
    const tier = i + 1; // 1..2
    const basePower = r4(spc.bp[i]);
    const prof = specialProfs[i];

    // Pick effect by common patterns in the name (disable / DoT / enhance / shield)
    let effect = null;
    let type = "Special";
    let target = "ST";

    const n = name.toLowerCase();

    if (n.includes("bleed") || n.includes("hemorrhage") || n.includes("poison")) {
      effect = buildDotEffect(def.keyAttribute, basePower, { school: n.includes("poison") ? "poison" : "bleed" });
      type = "DoT";
    } else if (n.includes("hamstring") || n.includes("nerve") || n.includes("stun") || n.includes("lock") || n.includes("paralyze") || n.includes("blind") || n.includes("net") || n.includes("pin") || n.includes("crushing blow") || n.includes("concussive")) {
      const kind =
        n.includes("hamstring") ? "slow" :
        n.includes("nerve") ? "paralyze" :
        n.includes("stun") || n.includes("concussive") || n.includes("crushing blow") ? "stun" :
        n.includes("blind") ? "blind" :
        n.includes("net") || n.includes("pin") || n.includes("lock") ? "immobilize" :
        "disable";
      effect = buildDisableEffect(kind, "ST", basePower);
      type = "Control";
    } else if (n.includes("rend") || n.includes("sunder") || n.includes("armor")) {
      // Defense debuff
      effect = {
        kind: "debuff",
        modifiers: { DEF_PCT_DOWN: Math.round(FX.ENHANCE_PCT_PER_BP * basePower) },
        durationSec: Math.max(8, Math.round(6 * basePower)),
        model: "resist-based"
      };
      type = "Debuff";
    } else if (n.includes("lifesteal") || n.includes("siphon")) {
      effect = buildLifestealEffect(basePower);
      type = "Enhance";
    } else if (weaponName === "Shield" && (n.includes("recovery") || n.includes("aegis") || n.includes("roar"))) {
      // Defensive shield or party guard
      if (n.includes("recovery")) {
        // Self-heal scaling with CON/VIT through basePower
        effect = {
          kind: "heal",
          attribute: "CON",
          baseAmountCoeff: r4(0.8 * basePower), // engine: heal = coeff * CON (× other multipliers)
          model: "attribute-scaled"
        };
        type = "Heal";
      } else {
        effect = buildBuffEffect({ DMG_REDUCTION_PCT: (bp) => FX.ENHANCE_PCT_PER_BP * bp }, basePower, "AoE");
        type = "Buff";
        target = "AoE";
      }
    } else {
      // Generic enhancement (attack speed / move speed)
      effect = buildMomentumEffect(basePower);
      type = "Enhance";
    }

    return {
      id: `${weaponName}:SPC:${tier}`,
      weapon: weaponName,
      proficiencyKind: WEAPON_PROFICIENCY_KIND[weaponName],
      name,
      family: "special",
      type,
      target,
      proficiency: prof,
      basePower,
      resourceType: def.resourceType,
      resourceCost: resourceCostFn(tier), // special tiers use the same cost curve
      keyAttribute: def.keyAttribute,
      secondaryAttribute: def.secondaryAttribute,
      effect
    };
  });

  // Merge: fill in the remaining milestone (40/50/60/70/80/90) with damage tiers we already placed.
  // Our damage skills already occupy 10..90; specials at 30 and 100 overlay 30 (coexist) and 100 (final).
  // To keep "one skill per milestone" strict, you can shift specialProfs to 25 & 95. Here we allow coexistence.

  // Return combined list sorted by proficiency then by family/type
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
