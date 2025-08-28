// spells.js — spellbook generator with effect payloads (ES module)

import { HYBRID_RELATIONS } from "./hybrid_relations.js";

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

const ADJECTIVES = ["Greater","Grand","Supreme","Elder","Mythic"];
function expandNames(baseNames) {
  return baseNames.concat(baseNames.map((n, i) => `${ADJECTIVES[i]} ${n}`));
}

function describeSpell(spell) {
  const elem = spell.element.toLowerCase();
  const targetEnemy = spell.target === "AoE" ? "all foes" : "a single foe";
  const targetAlly = spell.target === "AoE" ? "all allies" : (spell.target === "Self" ? "the caster" : "an ally");
  switch (spell.school) {
    case "Destructive":
      return `Unleashes ${elem} energy to strike ${targetEnemy}.`;
    case "Enfeebling":
      if (spell.type === "DoT") {
        return `Afflicts ${targetEnemy} with a lingering ${elem} curse.`;
      }
      return `Uses ${elem} forces to ${spell.effect.controlType} ${targetEnemy}.`;
    case "Reinforcement":
      if (spell.effect.kind === "shield") {
        return `Envelops ${targetAlly} in a ${elem} barrier that absorbs harm.`;
      }
      return `Bolsters ${targetAlly} with ${elem}-forged resilience.`;
    case "Healing":
      if (spell.effect.kind === "heal") {
        return `Channels ${elem} vitality to restore ${targetAlly}'s wounds.`;
      }
      return `Infuses ${targetAlly} with ${elem} energy that regenerates over time.`;
    case "Summoning":
      return `Summons ${spell.name}, a ${elem} ally, to fight at your side.`;
    default:
      return `A ${elem} spell.`;
  }
}

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

function generateHybridNames(base) {
  return {
    attackST: [
      `${base} Slash`,
      `${base} Burst`,
      `${base} Lance`,
      `${base} Surge`,
      `${base} Rend`,
      `${base} Cataclysm`
    ],
    attackAoE: [`${base} Wave`, `${base} Tempest`, `${base} Maelstrom`],
    ultimate: `${base} Apothesis`,
    control: [
      `${base} Snare`,
      `${base} Bind`,
      `${base} Shackle`,
      `${base} Veil`,
      `${base} Prison`
    ],
    support: [
      `${base} Guard`,
      `${base} Aegis`,
      `${base} Blessing`,
      `${base} Bulwark`,
      `${base} Bastion`
    ],
    healing: [
      `${base} Whisper`,
      `${base} Renewal`,
      `${base} Grace`,
      `${base} Resurgence`,
      `${base} Benediction`
    ],
    summoning: [
      `${base} Sprite`,
      `${base} Spirit`,
      `${base} Elemental`,
      `${base} Avatar`,
      `${base} Colossus`
    ],
    cantrips: {
      destructive: `${base} Spark`,
      enfeebling: `${base} Snare`,
      reinforcement: `${base} Guard`,
      healing: `${base} Mending`,
      summoning: `${base} Wisp`
    }
  };
}

/** Element spell name dictionaries (per element, per family) */
const NAMES = {
  Stone: {
    attackST: ["Stone Spike","Stone Lance","Earth Breaker","Crag Spear","Stone Crusher","Bedrock Rend"],
    attackAoE: ["Rockfall","Quake","Cataclysm"],
    ultimate: "Gaia’s Judgment",
    control: ["Stone Shackles","Gravel Skin","Tremor Lock","Dust Blind","Earthen Prison"],
    support: ["Stone Skin","Bulwark","Rocky Endurance","Guardian’s Bastion","Titan’s Fortitude"],
    healing: ["Gaia's Touch","Crag Remedy","Bedrock Salve","Terra Resurgence","Lithic Renewal"],
    summoning: ["Stone Golem","Terra Guardian","Earth Elemental","Gaia Colossus","Titan of Bedrock"],
    cantrips: {
      destructive: "Pebble Burst",
      enfeebling: "Gravel Snare",
      reinforcement: "Earthen Bulwark",
      healing: "Earthen Mending",
      summoning: "Pebble Sprite"
    }
  },
  Water: {
    attackST: ["Water Jet","Water Surge","Tidal Crush","Aqua Lance","Riptide Blade","Abyss Flood"],
    attackAoE: ["Water Wave","Maelstrom","Leviathan’s Wrath"],
    ultimate: "Ocean’s End",
    control: ["Tidebind","Drowning Grip","Pressure Crush","Mist Muffle","Undertow Prison"],
    support: ["Water Veil","Aqua Armor","Flowstate","Cleansing Rain","Tidal Aegis"],
    healing: ["Soothing Current","Aqua Reprieve","Mist Restoration","Tidal Renewal","Leviathan's Grace"],
    summoning: ["Water Nymph","Tidecaller","Sea Serpent","Leviathan","Ocean Guardian"],
    cantrips: {
      destructive: "Splash Dart",
      enfeebling: "Tide Snare",
      reinforcement: "Vapor Shield",
      healing: "Droplet Mending",
      summoning: "Mist Wisp"
    }
  },
  Wind: {
    attackST: ["Gust Slash","Wind Cutter","Wind Spear","Sky Piercer","Zephyr Strike","Tempest Blade"],
    attackAoE: ["Gale Vortex","Tempest","Hurricane’s Eye"],
    ultimate: "Eternal Tempest",
    control: ["Gale Tangle","Vacuum Lock","Air Seal","Slipstream Trip","Suffocating Draft"],
    support: ["Wind Barrier","Tailwind","Featherfall","Eye of the Storm","Aeolian Aegis"],
    healing: ["Breeze of Relief","Skyward Grace","Vortex Rejuvenation","Tempest Renewal","Aerial Restoration"],
    summoning: ["Air Sylph","Sky Seraph","Gale Djinn","Tempest Avatar","Wind Titan"],
    cantrips: {
      destructive: "Breeze Dart",
      enfeebling: "Gale Snare",
      reinforcement: "Gale Guard",
      healing: "Zephyr Mending",
      summoning: "Gust Sprite"
    }
  },
  Fire: {
    attackST: ["Ember Flicker","Flame Burst","Flare Lance","Flame Reaver","Pyroclast","Sunbrand"],
    attackAoE: ["Fireball","Inferno","Meteor Swarm"],
    ultimate: "Phoenix Rebirth",
    control: ["Searing Grasp","Lava Shackles","Cinder Choke","Cindershroud","Brand of Weakness"],
    support: ["Blazing Rage","Heat Mirage","Cauterize","Flameguard","Phoenix Blessing"],
    healing: ["Flame Recovery","Cinder Restoration","Blaze Renewal","Phoenix Grace","Inferno Rebirth"],
    summoning: ["Fire Imp","Salamander","Flame Efreet","Inferno Djinn","Phoenix"],
    cantrips: {
      destructive: "Cinder Snap",
      enfeebling: "Ember Snare",
      reinforcement: "Ember Shield",
      healing: "Ember Mending",
      summoning: "Spark Sprite"
    }
  },
  Ice: {
    attackST: ["Glacier Shard","Ice Spike","Glacial Blade","Cryo Lance","Hailpiercer","Shiver Edge"],
    attackAoE: ["Ice Nova","Whiteout Maelstrom","Avalanche"],
    ultimate: "Absolute Winter",
    control: ["Ice Bind","Brittle Hex","Permafrost Field","Hoarfrost Chains","Absolute Zero"],
    support: ["Frostguard","Cold Adaptation","Crystal Skin","Mirror Ice","Arctic Recovery"],
    healing: ["Chill Renewal","Icy Restoration","Glacial Relief","Hailstone Resurgence","Winter's Grace"],
    summoning: ["Ice Golem","Frost Wraith","Glacier Giant","Hoarfrost Titan","Ymir"],
    cantrips: {
      destructive: "Shard Burst",
      enfeebling: "Rime Snare",
      reinforcement: "Frost Shield",
      healing: "Rime Mending",
      summoning: "Snow Sprite"
    }
  },
  Thunder: {
    attackST: ["Spark Bolt","Thunder Shock","Thunder Fang","Volt Breaker","Arc Lance","Voltstrike"],
    attackAoE: ["Chain Lightning","Boltfront","Heaven’s Thunder"],
    ultimate: "Divine Thunder",
    control: ["Shock Jolt","Static Cage","Magnetic Disarm","Overload","Nerve Jolt"],
    support: ["Charge Up","Capacitor Shield","Grounding Barrier","Quickening","Ion Guard"],
    healing: ["Thunder's Embrace","Volt Renewal","Thunder Rejuvenation","Magnetic Recovery","Ion Restoration"],
    summoning: ["Volt Hound","Magnetron","Thunder Roc","Lightning Elemental","Raijin"],
    cantrips: {
      destructive: "Spark Dart",
      enfeebling: "Static Snare",
      reinforcement: "Static Guard",
      healing: "Static Mending",
      summoning: "Volt Sprite"
    }
  },
  Dark: {
    attackST: ["Umbral Touch","Dark Slash","Abyssal Rend","Eclipse Fang","Night Cutter","Void Lance"],
    attackAoE: ["Dark Mist","Dark Eruption","Shadow Plague"],
    ultimate: "Oblivion",
    control: ["Shadow Grasp","Dread Shackles","Curse of Decay","Nightmare Veil","Soul Siphon"],
    support: ["Veil of Dusk","Profane Bulwark","Life Leech Blessing","Shade Step","Omen"],
    healing: ["Umbral Mend","Night Restoration","Void Renewal","Abyssal Grace","Ebon Rejuvenation"],
    summoning: ["Shadow Fiend","Nightmare Steed","Void Walker","Abyssal Wraith","Nether Lord"],
    cantrips: {
      destructive: "Shade Bolt",
      enfeebling: "Gloom Snare",
      reinforcement: "Umbral Guard",
      healing: "Shadow Mending",
      summoning: "Shade Sprite"
    }
  },
  Light: {
    attackST: ["Radiant Ray","Holy Strike","Judgment Ray","Divine Spear","Sunlance","Sacred Edge"],
    attackAoE: ["Holy Burst","Sanctified Wave","Seraphic Storm"],
    ultimate: "Ascension",
    control: ["Blinding Glow","Binding Halo","Purge Seal","Revelation","Sanctuary Lock"],
    support: ["Blessed Shield","Aegis of Dawn","Divine Rampart","Solar Guard","Luminous Bastion"],
    healing: ["Dawn's Grace","Sunlit Restoration","Halo Renewal","Seraphic Benediction","Celestial Reprieve"],
    summoning: ["Winged Cherub","Radiant Guardian","Solar Archon","Seraph","Empyreal Avatar"],
    cantrips: {
      destructive: "Glimmer Dart",
      enfeebling: "Halo Snare",
      reinforcement: "Radiant Shield",
      healing: "Radiant Mending",
      summoning: "Light Sprite"
    }
  }
};

HYBRID_RELATIONS.forEach(rel => {
  NAMES[rel.name] = generateHybridNames(rel.name);
});

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

/** Build one element's spell kit including level 1 cantrips */
function buildElement(elementName, names) {
  const baseAtk = 0.25; // quarter of tier-1 power
  const baseCtrl = 0.05;
  const baseSupp = 0.25;

  const cantrips = [
    {
      id: `${elementName}:CAN:DES`,
      name: names.cantrips.destructive,
      element: elementName,
      school: "Destructive",
      family: "attack",
      type: "Attack",
      subtype: "Single",
      proficiency: 1,
      target: "ST",
      basePower: baseAtk,
      proficiencyFactor: 1.0,
      unlockTierId: "CANTRIP",
      mpCost: 1,
      ultimate: false,
      starter: true,
    },
    {
      id: `${elementName}:CAN:ENF`,
      name: names.cantrips.enfeebling,
      element: elementName,
      school: "Enfeebling",
      family: "control",
      type: "Control",
      subtype: null,
      proficiency: 1,
      target: "ST",
      basePower: baseCtrl,
      proficiencyFactor: 1.0,
      unlockTierId: "CANTRIP",
      mpCost: 1,
      ultimate: false,
      starter: true,
      effect: buildControlEffect(names.cantrips.enfeebling, "ST", baseCtrl, 0),
    },
    {
      id: `${elementName}:CAN:REIN`,
      name: names.cantrips.reinforcement,
      element: elementName,
      school: "Reinforcement",
      family: "support",
      type: "Buff",
      subtype: "Buff",
      proficiency: 1,
      target: "ST",
      basePower: baseSupp,
      proficiencyFactor: 1.0,
      unlockTierId: "CANTRIP",
      mpCost: 1,
      ultimate: false,
      starter: true,
      effect: buildSupportEffect(elementName, names.cantrips.reinforcement, "ST", baseSupp, 0),
    },
    {
      id: `${elementName}:CAN:HEAL`,
      name: names.cantrips.healing,
      element: elementName,
      school: "Healing",
      family: "support",
      type: "Heal",
      subtype: "Heal",
      proficiency: 1,
      target: "ST",
      basePower: baseSupp,
      proficiencyFactor: 1.0,
      unlockTierId: "CANTRIP",
      mpCost: 1,
      ultimate: false,
      starter: true,
      effect: buildSupportEffect(elementName, names.cantrips.healing, "ST", baseSupp, 2),
    },
    {
      id: `${elementName}:CAN:SUM`,
      name: names.cantrips.summoning,
      element: elementName,
      school: "Summoning",
      family: "summon",
      type: "Summon",
      subtype: null,
      proficiency: 1,
      target: "Self",
      basePower: 0,
      proficiencyFactor: 1.0,
      unlockTierId: "CANTRIP",
      mpCost: 1,
      ultimate: false,
      starter: true,
      effect: { kind: "summon", summonId: `${elementName}:${names.cantrips.summoning.replace(/\s+/g, '')}` },
    },
  ];

  cantrips.forEach(s => { s.description = describeSpell(s); });

  // Families: Attack(10 tiers), Control(10), Support-Reinforce(10), Support-Heal(10), Summon(10)
  const atk = buildBasePowers(10, mpCost, 1.00);
  const ctrl = buildBasePowers(10, mpCost, 0.20);
  const supp = buildBasePowers(10, mpCost, 1.00);
  const PF_CONTROL_EXT = PF_CONTROL.concat(PF_CONTROL);
  const PF_SUPPORT_EXT = PF_SUPPORT.concat(PF_SUPPORT);

  const ctrlNames = expandNames(names.control);
  const reinfNames = expandNames(names.support);
  const healNames = expandNames(names.healing);
  const summonNames = expandNames(names.summoning);

  // Attack names over 10 tiers (6 ST + 3 AoE + 1 Ultimate)
  const attackNamesByTier = [
    names.attackST[0],
    names.attackST[1],
    names.attackAoE[0],
    names.attackST[2],
    names.attackAoE[1],
    names.attackST[3],
    names.attackAoE[2],
    names.attackST[4],
    names.attackST[5],
    names.ultimate
  ];

  const attack = attackNamesByTier.map((name, i) => {
    const tier = i + 1;
    const prof = MILESTONES[i];
    const target = ATTACK_TARGET_BY_TIER[tier];
    const ultimate = tier === 10;
    const spell = {
      id: `${elementName}:ATK:${tier}`,
      name,
      element: elementName,
      school: "Destructive",
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
    };
    spell.description = describeSpell(spell);
    return spell;
  });

  const ctrlIdxSeq = [0,1,2,3,4,0,1,2,3,4];
  const control = ctrlNames.map((name, i) => {
    const tier = i + 1;
    const prof = MILESTONES[i];
    const idx = ctrlIdxSeq[i];
    const target = (idx === 2 || idx === 3) ? "AoE" : "ST";
    const basePower = r4(ctrl.bp[i]);
    const spell = {
      id: `${elementName}:ENF:${tier}`,
      name,
      element: elementName,
      school: "Enfeebling",
      family: "control",
      type: (idx === 1 ? "DoT" : "Control"),
      subtype: null,
      proficiency: prof,
      target,
      basePower,
      proficiencyFactor: PF_CONTROL_EXT[i],
      unlockTierId: `ENF-${tier}`,
      mpCost: ctrl.mp[i],
      ultimate: false,
      starter: (prof === 10),
      effect: buildControlEffect(name, target, basePower, idx)
    };
    spell.description = describeSpell(spell);
    return spell;
  });

  const reinfIdxSeq = [0,1,3,4,0,1,3,4,0,1];
  const reinfTargetSeq = ["ST","AoE","ST","AoE","AoE","ST","AoE","ST","AoE","AoE"];
  const reinforcement = reinfNames.map((name, i) => {
    const tier = i + 1;
    const prof = MILESTONES[i];
    const idx = reinfIdxSeq[i];
    const target = reinfTargetSeq[i];
    const basePower = r4(supp.bp[i]);
    const spell = {
      id: `${elementName}:REIN:${tier}`,
      name,
      element: elementName,
      school: "Reinforcement",
      family: "support",
      type: "Buff",
      subtype: null,
      proficiency: prof,
      target,
      basePower,
      proficiencyFactor: PF_SUPPORT_EXT[i],
      unlockTierId: `REIN-${tier}`,
      mpCost: supp.mp[i],
      ultimate: false,
      starter: false,
      effect: buildSupportEffect(elementName, name, target, basePower, idx)
    };
    spell.description = describeSpell(spell);
    return spell;
  });

  const healTargetSeq = ["ST","AoE","ST","AoE","AoE","ST","AoE","ST","AoE","AoE"];
  const healing = healNames.map((name, i) => {
    const tier = i + 1;
    const prof = MILESTONES[i];
    const target = healTargetSeq[i];
    const basePower = r4(supp.bp[i]);
    const spell = {
      id: `${elementName}:HEAL:${tier}`,
      name,
      element: elementName,
      school: "Healing",
      family: "support",
      type: "Heal",
      subtype: "Heal",
      proficiency: prof,
      target,
      basePower,
      proficiencyFactor: PF_SUPPORT_EXT[i],
      unlockTierId: `HEAL-${tier}`,
      mpCost: supp.mp[i],
      ultimate: false,
      starter: false,
      effect: buildSupportEffect(elementName, name, target, basePower, 2)
    };
    spell.description = describeSpell(spell);
    return spell;
  });

  const summoning = summonNames.map((name, i) => {
    const tier = i + 1;
    const prof = MILESTONES[i];
    const spell = {
      id: `${elementName}:SUM:${tier}`,
      name,
      element: elementName,
      school: "Summoning",
      family: "summon",
      type: "Summon",
      subtype: null,
      proficiency: prof,
      target: "Self",
      basePower: 0,
      proficiencyFactor: 1.0,
      unlockTierId: `SUM-${tier}`,
      mpCost: mpCost(tier),
      ultimate: false,
      starter: false,
      effect: { kind: "summon", summonId: `${elementName}:${name.replace(/\s+/g,'')}` }
    };
    spell.description = describeSpell(spell);
    return spell;
  });

  // Merge families and return ordered by milestone (two unlocks per 10)
  const byMilestone = new Map(MILESTONES.map(m => [m, []]));
  [...attack, ...control, ...reinforcement, ...healing, ...summoning].forEach(spell => {
    byMilestone.get(spell.proficiency).push(spell);
  });
  return [...cantrips, ...MILESTONES.flatMap(m => byMilestone.get(m))];
}

/** Build the full 8-element spellbook (440 spells total) */
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

