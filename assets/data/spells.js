// spells.js — spellbook generator with effect payloads (ES module)

/**
 * MP cost per family tier:
 * MP = ceil(3 * (1 + log2(tier)))
 */
const mpCost = (tier) => Math.ceil(3 * (1 + Math.log2(tier)));

/**
 * Base Power scaling inside a family (Attack | Control | Support):
 * BP[n] = BP[n-1] * (1 + 0.75 * ((MP[n] - MP[n-1]) / MP[n-1]))
 * Returns arrays { mp, bp } for tiers 1..N.
 */
function buildBasePowers(tierCount, mpFn, basePowerT1) {
  const mp = Array.from({ length: tierCount }, (_, i) => mpFn(i + 1));
  const bp = [Number(basePowerT1)];
  for (let i = 1; i < tierCount; i++) {
    const dPct = (mp[i] - mp[i - 1]) / mp[i - 1];
    const next = bp[i - 1] * (1 + 0.75 * dPct);
    bp.push(next);
  }
  return { mp, bp };
}

/** Rounding helpers */
const r2 = (x) => Math.round(x * 1e2) / 1e2;
const r4 = (x) => Math.round(x * 1e4) / 1e4;

/** Proficiency milestones (two unlocks per 10) */
const MILESTONES = [10,20,30,40,50,60,70,80,90,100];

/** Proficiency factors (weights for your progression formula) */
const PF_ATTACK  = [1.00,0.95,0.90,0.85,0.80,0.75,0.70,0.65,0.60,1.20]; // t1..t10
const PF_CONTROL = [1.00,0.90,0.80,0.70,0.60];                           // c1..c5
const PF_SUPPORT = [1.00,0.90,0.80,0.70,0.60];                           // s1..s5

/** Attack targets across 10 tiers: 6 ST, 3 AoE, 1 Ultimate (ST/AoE) */
const ATTACK_TARGET_BY_TIER = {
  1: "ST", 2: "ST", 3: "AoE", 4: "ST", 5: "AoE",
  6: "ST", 7: "AoE", 8: "ST", 9: "ST", 10: "ST/AoE"
};

/** === Effect Scaling Constants (tweak freely for balance) ===
 * All support/control magnitudes are derived from Base Power via these multipliers,
 * so balance is centralized and predictable.
 */
const EFFECT = {
  // CONTROL
  CONTROL_DURATION_PER_BP: 2.0,      // seconds per BasePower for ST controls
  CONTROL_AOE_DURATION_FACTOR: 0.75, // AoE controls are shorter
  // DoT
  DOT_TICK_COEFF_PER_BP: 0.25,       // tick coefficient vs INT (your engine applies the final formula)
  DOT_TICK_INTERVAL_SEC: 2,          // seconds
  DOT_DURATION_PER_BP: 4.0,          // seconds
  // SUPPORT (percentages)
  BUFF_DEF_PCT_PER_BP: 15,           // +DEF%
  BUFF_RESISTALL_PCT_PER_BP: 12,     // +All-Resist%
  REGEN_PCTMAX_PER_5S_PER_BP: 2.0,   // % Max HP per 5s
  SHIELD_ABSORB_PCT_PER_BP: 20,      // % of Max HP absorption
  HEAL_BASE_COEFF_PER_BP: 1.0        // heal scales off INT * coeff
};

/** Element spell name dictionaries (per element, per family) */
const NAMES = {
  Stone: {
    attackST: ["Stone Spike","Stone Lance","Earth Breaker","Crag Spear","Stone Crusher","Bedrock Rend"],
    attackAoE: ["Rockfall","Quake","Cataclysm"],
    ultimate: "Gaia’s Judgment",
    control: ["Stone Shackles","Gravel Skin","Tremor Lock","Dust Blind","Earthen Prison"],
    support: ["Stone Skin","Bulwark","Rocky Endurance","Guardian’s Ward","Titan’s Fortitude"]
  },
  Water: {
    attackST: ["Water Jet","Water Surge","Tidal Crush","Aqua Lance","Riptide Blade","Abyss Flood"],
    attackAoE: ["Water Wave","Maelstrom","Leviathan’s Wrath"],
    ultimate: "Ocean’s End",
    control: ["Tidebind","Drowning Grip","Pressure Crush","Mist Muffle","Undertow Prison"],
    support: ["Water Veil","Aqua Armor","Flowstate","Cleansing Rain","Tidal Aegis"]
  },
  Wind: {
    attackST: ["Gust Slash","Wind Cutter","Wind Spear","Sky Piercer","Zephyr Strike","Tempest Blade"],
    attackAoE: ["Cyclone","Tempest","Hurricane’s Eye"],
    ultimate: "Eternal Tempest",
    control: ["Gale Tangle","Vacuum Lock","Air Seal","Slipstream Trip","Suffocating Draft"],
    support: ["Wind Barrier","Tailwind","Featherfall","Eye of the Storm","Aeolian Ward"]
  },
  Fire: {
    attackST: ["Ember Flicker","Flame Burst","Flare Lance","Flame Reaver","Pyroclast","Sunbrand"],
    attackAoE: ["Fireball","Inferno","Meteor Swarm"],
    ultimate: "Phoenix Rebirth",
    control: ["Searing Grasp","Magma Chains","Ashen Choke","Cindershroud","Brand of Weakness"],
    support: ["Blazing Rage","Heat Mirage","Cauterize","Flameguard","Phoenix Blessing"]
  },
  Ice: {
    attackST: ["Frost Shard","Ice Spike","Glacial Blade","Cryo Lance","Hailpiercer","Shiver Edge"],
    attackAoE: ["Ice Nova","Blizzard Storm","Avalanche"],
    ultimate: "Absolute Winter",
    control: ["Ice Bind","Brittle Hex","Permafrost Field","Hoarfrost Chains","Absolute Zero"],
    support: ["Frozen Ward","Cold Adaptation","Crystal Skin","Mirror Ice","Arctic Recovery"]
  },
  Thunder: {
    attackST: ["Spark Bolt","Thunder Shock","Thunder Fang","Volt Breaker","Arc Lance","Stormstrike"],
    attackAoE: ["Chain Lightning","Stormfront","Heaven’s Thunder"],
    ultimate: "Divine Thunder",
    control: ["Shock Jolt","Static Cage","Magnetic Disarm","Overload","Nerve Jolt"],
    support: ["Charge Up","Capacitor Shield","Grounding Ward","Quickening","Ion Guard"]
  },
  Dark: {
    attackST: ["Umbral Touch","Dark Slash","Abyssal Rend","Eclipse Fang","Night Cutter","Void Lance"],
    attackAoE: ["Dark Mist","Dark Eruption","Shadow Plague"],
    ultimate: "Oblivion",
    control: ["Shadow Grasp","Dread Shackles","Curse of Decay","Nightmare Veil","Soul Siphon"],
    support: ["Veil of Dusk","Profane Ward","Life Leech Blessing","Shade Step","Omen"]
  },
  Light: {
    attackST: ["Radiant Ray","Holy Strike","Judgment Ray","Divine Spear","Sunlance","Sacred Edge"],
    attackAoE: ["Holy Burst","Sanctified Wave","Seraphic Storm"],
    ultimate: "Ascension",
    control: ["Blinding Glow","Binding Halo","Purge Seal","Revelation","Sanctuary Lock"],
    support: ["Healing Light","Blessed Shield","Aegis of Dawn","Divine Grace","Beacon"]
  }
};

/** Build standardized EFFECT objects for control/DoT and support/heal */
function buildControlEffect(spellName, target, basePower, idx /*0..4*/) {
  // Control indexing layout: [C1 root/bind, C2 DoT, C3 stun/silence AoE, C4 blind AoE, C5 immobilize/hard]
  const durationBase = EFFECT.CONTROL_DURATION_PER_BP * basePower;
  const duration = r2(target === "AoE"
    ? durationBase * EFFECT.CONTROL_AOE_DURATION_FACTOR
    : durationBase);

  // Decide the control type by position; you can customize per element name if desired
  if (idx === 1) {
    // DoT entry (C2)
    const tickCoeff = r4(EFFECT.DOT_TICK_COEFF_PER_BP * basePower);
    const dur = Math.max(4, Math.round(EFFECT.DOT_DURATION_PER_BP * basePower));
    return {
      kind: "dot",
      model: "attribute-scaled",             // engine: scale with INT, level, prof, resists
      attribute: "INT",
      baseTickCoeff: tickCoeff,              // damage per tick = coeff * INT * (other multipliers)
      tickIntervalSec: EFFECT.DOT_TICK_INTERVAL_SEC,
      durationSec: dur
    };
  }

  // Non-DoT control types
  const typeByIdx = ["root","dot","stun_or_silence","blind","immobilize"];
  const resolvedType = (idx === 2 ? "stun" : (idx === 3 ? "blind" : (idx === 0 ? "root" : "immobilize")));

  return {
    kind: "control",
    controlType: resolvedType,               // "root" | "stun" | "blind" | "immobilize"
    durationSec: duration,
    model: "resist-based",                   // engine: apply resist/weakness later
    notes: spellName
  };
}

function buildSupportEffect(element, spellName, target, basePower, idx /*0..4*/) {
  // Support layout: [S1 DEF buff, S2 AoE defensive (shield/armor/heal per element),
  // S3 regen/heal, S4 resist-all, S5 strong shield/aegis]
  switch (idx) {
    case 0: { // DEF buff
      const defPct = Math.round(EFFECT.BUFF_DEF_PCT_PER_BP * basePower);
      return { kind: "buff", modifiers: { DEF_PCT: defPct }, durationSec: Math.max(8, Math.round(6 * basePower)) };
    }
    case 1: { // Element-agnostic defensive: often AoE shield/armor
      const absorbPct = Math.round(EFFECT.SHIELD_ABSORB_PCT_PER_BP * basePower * (target === "AoE" ? 0.8 : 1));
      return { kind: "shield", absorbPctMaxHP: absorbPct, durationSec: Math.max(8, Math.round(6 * basePower)) };
    }
    case 2: { // Regen/Heal (single target by default here)
      // If the spell name hints at Heal, use direct heal; otherwise regen.
      if (/heal|grace|recovery|cauterize|cleansing/i.test(spellName)) {
        const coeff = r4(EFFECT.HEAL_BASE_COEFF_PER_BP * basePower);
        return { kind: "heal", attribute: "INT", baseAmountCoeff: coeff, model: "attribute-scaled" };
      } else {
        const pctPer5s = r2(EFFECT.REGEN_PCTMAX_PER_5S_PER_BP * basePower);
        return { kind: "regen", percentMaxHPPer5s: pctPer5s, durationSec: Math.max(8, Math.round(10 * basePower)) };
      }
    }
    case 3: { // Resist-All
      const resistPct = Math.round(EFFECT.BUFF_RESISTALL_PCT_PER_BP * basePower * (target === "AoE" ? 0.9 : 1));
      return { kind: "buff", modifiers: { RESIST_ALL_PCT: resistPct }, durationSec: Math.max(8, Math.round(8 * basePower)) };
    }
    case 4: { // Strong shield/aegis (late tier)
      const absorbPct = Math.round(EFFECT.SHIELD_ABSORB_PCT_PER_BP * basePower);
      return { kind: "shield", absorbPctMaxHP: absorbPct, durationSec: Math.max(10, Math.round(10 * basePower)) };
    }
    default:
      return { kind: "buff", modifiers: {}, durationSec: 0 };
  }
}

/** Build one element's 20-spell kit */
function buildElement(elementName, names) {
  // Families: Attack(10 tiers), Control(5), Support(5)
  const atk = buildBasePowers(10, mpCost, 1.00);
  const ctrl = buildBasePowers(5, mpCost, 0.20);
  const supp = buildBasePowers(5, mpCost, 1.00);

  // Attack names over 10 tiers (6 ST + 3 AoE + 1 Ultimate)
  const attackNamesByTier = [
    names.attackST[0],                 // t1 ST
    names.attackST[1],                 // t2 ST
    names.attackAoE[0],                // t3 AoE
    names.attackST[2],                 // t4 ST
    names.attackAoE[1],                // t5 AoE
    names.attackST[3],                 // t6 ST
    names.attackAoE[2],                // t7 AoE
    names.attackST[4],                 // t8 ST
    names.attackST[5],                 // t9 ST
    names.ultimate                     // t10 Ultimate (ST/AoE)
  ];

  const attack = attackNamesByTier.map((name, i) => {
    const tier = i + 1;
    const prof = MILESTONES[i];  // 10..100
    const target = ATTACK_TARGET_BY_TIER[tier];
    const ultimate = (tier === 10);
    return {
      id: `${elementName}:ATK:${tier}`,
      name,
      element: elementName,
      family: "attack",
      type: "Attack",
      subtype: ultimate ? "Ultimate" : (target === "AoE" ? "AoE" : "Single"),
      proficiency: prof,
      target,
      basePower: r4(atk.bp[i]),
      proficiencyFactor: PF_ATTACK[i],
      unlockTierId: `ATK-${tier}`,
      mpCost: atk.mp[i],
      ultimate,
      starter: (prof === 10)
      // No "effect" for attack here — damage formula uses basePower, INT, prof, resists later
    };
  });

  // Control unlocks at milestones 10,30,50,70,90 (C1..C5)
  const control = names.control.map((name, i) => {
    const tier = i + 1; // 1..5
    const prof = [10,30,50,70,90][i];
    // ST, ST(DoT), AoE, AoE, ST
    const target = (i === 2 || i === 3) ? "AoE" : "ST";
    const basePower = r4(ctrl.bp[i]);
    return {
      id: `${elementName}:CTRL:${tier}`,
      name,
      element: elementName,
      family: "control",
      type: (i === 1 ? "DoT" : "Control"),
      subtype: null,
      proficiency: prof,
      target,
      basePower,                         // potency driver for durations/magnitudes
      proficiencyFactor: PF_CONTROL[i],
      unlockTierId: `CTRL-${tier}`,
      mpCost: ctrl.mp[i],
      ultimate: false,
      starter: (prof === 10),
      effect: buildControlEffect(name, target, basePower, i)
    };
  });

  // Support unlocks at milestones 20,40,60,80,100 (S1..S5)
  const support = names.support.map((name, i) => {
    const tier = i + 1; // 1..5
    const prof = [20,40,60,80,100][i];
    // ST / AoE alternation: ST, AoE, ST, AoE, AoE
    const target = (i === 1 || i === 3 || i === 4) ? "AoE" : "ST";
    const basePower = r4(supp.bp[i]);
    // Subtype hint (optional)
    const subtypeMap = ["Buff","Shield","Regen/Heal","Resist","Shield"];
    return {
      id: `${elementName}:SUP:${tier}`,
      name,
      element: elementName,
      family: "support",
      type: (/heal|grace/i.test(name) ? "Heal" : "Buff"),
      subtype: subtypeMap[i] || null,
      proficiency: prof,
      target,
      basePower,
      proficiencyFactor: PF_SUPPORT[i],
      unlockTierId: `SUP-${tier}`,
      mpCost: supp.mp[i],
      ultimate: false,
      starter: false,
      effect: buildSupportEffect(elementName, name, target, basePower, i)
    };
  });

  // Merge families and return ordered by milestone (two unlocks per 10)
  const byMilestone = new Map(MILESTONES.map(m => [m, []]));
  [...attack, ...control, ...support].forEach(spell => {
    byMilestone.get(spell.proficiency).push(spell);
  });
  return MILESTONES.flatMap(m => byMilestone.get(m));
}

/** Build the full 8-element spellbook (160 spells total) */
function generateSpellbook() {
  const elements = Object.keys(NAMES);
  const all = [];
  for (const el of elements) {
    all.push(...buildElement(el, NAMES[el]));
  }
  return all;
}

/** Prebuilt spellbook for direct import */
const SPELLBOOK = generateSpellbook();

// Export variables for external use
export {
  mpCost,
  buildBasePowers,
  buildControlEffect,
  buildSupportEffect,
  buildElement,
  generateSpellbook,
  SPELLBOOK,
  MILESTONES,
  PF_ATTACK,
  PF_CONTROL,
  PF_SUPPORT,
  ATTACK_TARGET_BY_TIER,
  EFFECT,
  NAMES
};

// Attach to global scope for non-module consumers
if (typeof globalThis !== 'undefined') {
  Object.assign(globalThis, {
    mpCost,
    buildBasePowers,
    buildControlEffect,
    buildSupportEffect,
    buildElement,
    generateSpellbook,
    SPELLBOOK,
    MILESTONES,
    PF_ATTACK,
    PF_CONTROL,
    PF_SUPPORT,
    ATTACK_TARGET_BY_TIER,
    EFFECT,
    NAMES
  });
}

