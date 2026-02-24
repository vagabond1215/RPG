import { WEAPON_SKILLS } from "./weapon_skills.js";
import { SPELLBOOK } from "./spells.js";

export type DamageType = "BLUNT" | "SLASH" | "PIERCE";

export interface Actor {
  level: number;
  attributes: Record<string, number>;
  proficiencies: Record<string, number>;
  defense?: number;
  resists?: Record<string, number>;
  critDamageReductionPct?: number;
  critDefense?: number;
}

export interface WeaponOnHitConfig {
  chancePct: number;
  power?: number;
  powerPct?: number;
  durationSec?: number;
  stacksMax?: number;
  cdSec?: number;
  scalesWith?: string;
  tickSec?: number;
  range?: string;
  description?: string;
  tags?: string[];
  [key: string]: any;
}

export interface WeaponCombatStats {
  ap?: number;
  armorPenBand?: keyof typeof AP_BAND_VALUE;
  dmgMix?: Partial<Record<DamageType, number>>;
  critChancePct?: number;
  critMult?: number;
  critArmorBypassPct?: number;
  onHit?: Record<string, WeaponOnHitConfig>;
}

export interface OnHitResult {
  effect: string;
  triggered: boolean;
  chance: number;
  roll: number;
  config: WeaponOnHitConfig;
  scaledPower?: number;
}

export interface CombatResult {
  damage: number;
  expectedDamage: number;
  didHit: boolean;
  critOccurred: boolean;
  critChance: number;
  critMultiplier: number;
  hitChance: number;
  evasionChance: number;
  blockChance: number;
  resistMultiplier: number;
  typedResistPct: number;
  totalResistPct: number;
  apBypassPct: number;
  onHitResults: OnHitResult[];
}

export interface CombatOptions {
  attackId: string;
  attackType: "weapon" | "spell";
  attackerEffects?: Record<string, number>[];
  defenderEffects?: Record<string, number>[];
  weaponStats?: WeaponCombatStats;
  rng?: () => number;
}

export type StatusEffectDiscipline =
  | "damage"
  | "control"
  | "utility"
  | "armorTrait"
  | "accessoryTrait";

export interface StatusEffectEntry {
  name: string;
  aliases?: string[];
  summary: string;
  delivery: string;
  duration: string;
  tacticalNotes: string;
}

export interface StatusEffectCategory {
  id: string;
  title: string;
  discipline: StatusEffectDiscipline;
  description: string;
  entries: StatusEffectEntry[];
}

export const STATUS_EFFECT_GLOSSARY: StatusEffectCategory[] = [
  {
    id: "damage-types",
    title: "Damage Types",
    discipline: "damage",
    description:
      "Primary damage channels that describe how martial or elemental attacks interact with defenses and resistances.",
    entries: [
      {
        name: "Slashing",
        summary: "Shearing strikes that excel at cutting exposed targets.",
        delivery: "Melee weapon arcs",
        duration: "Instant",
        tacticalNotes:
          "Edge alignment and follow-through reward precise form, making slashing ideal against lightly armored foes or enemies already suffering defense breaks.",
      },
      {
        name: "Piercing",
        summary: "Focused thrusts that punch through armor gaps.",
        delivery: "Melee thrust or thrown point",
        duration: "Instant",
        tacticalNotes:
          "Reliable against plated opponents; accuracy and timing let the attacker bypass shields or interlocking mail by targeting seams and joints.",
      },
      {
        name: "Blunt",
        aliases: ["Breaker", "Sunder"],
        summary: "Concussive blows that transfer force through armor.",
        delivery: "Melee bludgeon",
        duration: "Instant",
        tacticalNotes:
          "Excellent for shattering shields and staggering heavily armored enemies, often pairing with control effects that exploit the resulting imbalance.",
      },
      {
        name: "Bleed",
        aliases: ["Rend"],
        summary: "Persistent wounds that drain vitality over time.",
        delivery: "Melee precision cuts",
        duration: "Timed 2–4 turns",
        tacticalNotes:
          "Stacks with other sustained pressure; best applied early in an encounter so follow-up attacks capitalize on the attrition.",
      },
      {
        name: "Burn",
        summary: "Lingering flames that continue to scorch the target area.",
        delivery: "Area ignition or explosive burst",
        duration: "Timed 2–3 turns",
        tacticalNotes:
          "Spreads pressure across clustered enemies, denies zones, and punishes foes who remain in chokepoints or tight formations.",
      },
    ],
  },
  {
    id: "control-effects",
    title: "Control Effects",
    discipline: "control",
    description:
      "Disabling maneuvers that limit an opponent's options, movement, or access to gear for a tactical window.",
    entries: [
      {
        name: "Hook",
        aliases: ["Trip", "Disarm"],
        summary: "Jolts the enemy off balance or strips their weapon.",
        delivery: "Close-quarters grapple",
        duration: "Instant to 1 turn",
        tacticalNotes:
          "Perfect opener for setting up allies; forcing a weapon drop or knockdown exposes gaps that coordinated parties can exploit immediately.",
      },
      {
        name: "Stun",
        aliases: ["Daze"],
        summary: "Completely halts the target's next action.",
        delivery: "Heavy melee impact",
        duration: "1 turn",
        tacticalNotes:
          "Timing matters—use to interrupt casts or momentum attacks. Many elite foes resist chain stuns, so alternate with other disables.",
      },
      {
        name: "Snare",
        aliases: ["Entangle"],
        summary: "Restricts movement with binding lines or growth.",
        delivery: "Short-range control",
        duration: "1–2 turns",
        tacticalNotes:
          "Buys time for ranged parties and prevents escapes. Works well when layered with terrain hazards that punish forced immobility.",
      },
      {
        name: "Ignore-shield",
        summary: "Bypasses active shield blocks and cover bonuses.",
        delivery: "Focused melee strike",
        duration: "Sustained while stance holds",
        tacticalNotes:
          "Adopted as a stance or weapon state; lets precision fighters stay lethal even against disciplined defenders relying on tower shields.",
      },
    ],
  },
  {
    id: "utility-effects",
    title: "Utility Effects",
    discipline: "utility",
    description:
      "Supportive maneuvers and stances that expand battlefield options beyond raw damage or control.",
    entries: [
      {
        name: "Parry",
        summary: "Counters melee strikes with a riposte window.",
        delivery: "Reactive melee guard",
        duration: "Triggered response",
        tacticalNotes:
          "Successful parries open instant counterattacks. High skill builds can chain parry states to bait predictable opponents.",
      },
      {
        name: "Return",
        aliases: ["Return-cord"],
        summary: "Ensures a thrown weapon snaps back to hand.",
        delivery: "Short-range tether",
        duration: "Instant",
        tacticalNotes:
          "Lets combatants cycle ranged gambits without dropping their primary weapon—great for boomerangs, axes, or harpoons.",
      },
      {
        name: "Cleave",
        summary: "Sweeps through multiple adjacent foes.",
        delivery: "Melee arc",
        duration: "Instant",
        tacticalNotes:
          "Maintains pressure on clustered enemies and chips away at minions while focusing a main target.",
      },
      {
        name: "Mounted",
        aliases: ["Cavalry"],
        summary: "Harnesses the momentum and height of a mount.",
        delivery: "Melee reach from mount",
        duration: "Sustained",
        tacticalNotes:
          "Adds charge damage, mobility, and battlefield dominance. Requires space and mount training to avoid penalties in tight quarters.",
      },
      {
        name: "Duelist",
        aliases: ["Pairing"],
        summary: "Excels in single combat or paired weapon play.",
        delivery: "Focused stance",
        duration: "Sustained",
        tacticalNotes:
          "Rewards isolating opponents. Bonuses often scale with limiting adjacent foes, encouraging positioning plays and flanking allies.",
      },
      {
        name: "Phalanx",
        summary: "Bolsters allies fighting in formation.",
        delivery: "Group reach",
        duration: "Sustained",
        tacticalNotes:
          "Increases stability, guard coverage, and combined damage when ranks stay locked shoulder-to-shoulder.",
      },
    ],
  },
  {
    id: "armor-traits",
    title: "Armor & Clothing Traits",
    discipline: "armorTrait",
    description:
      "Persistent properties granted by armor sets, uniforms, or crafted garments.",
    entries: [
      {
        name: "Light Armor",
        aliases: ["Medium Armor", "Heavy Armor", "Max-Protect"],
        summary: "Defines the weight-to-defense curve of armor tiers.",
        delivery: "Equipped attire",
        duration: "Sustained",
        tacticalNotes:
          "Light favors agility and stealth, medium balances coverage with mobility, heavy prioritizes soak at stamina cost, and max-protect builds near-impenetrable bulwarks for siege scenarios.",
      },
      {
        name: "Flexible",
        aliases: ["Articulated", "Hidden-Plates"],
        summary: "Maintains mobility while keeping key vitals protected.",
        delivery: "Crafted joint work",
        duration: "Sustained",
        tacticalNotes:
          "Segmented lamellae, chain underlays, or hidden plating let wearers dodge, climb, and disguise protection without losing defensive ratings.",
      },
      {
        name: "Weatherproofing",
        aliases: ["Warm", "Cooling"],
        summary: "Buffers the wearer against harsh climates.",
        delivery: "Environmental lining",
        duration: "Sustained",
        tacticalNotes:
          "Layered cloaks, insulated furs, or heat-dispersing mesh prevent fatigue from extreme cold or heat, enabling long operations outdoors.",
      },
      {
        name: "Prestige Tailoring",
        aliases: ["Intimidate", "Noble", "Fashion"],
        summary: "Projects status, authority, or cultural messaging.",
        delivery: "Social presence",
        duration: "Sustained",
        tacticalNotes:
          "Ideal for court intrigue and diplomacy; grants social leverage, morale bumps, or crowd control through sheer presentation.",
      },
      {
        name: "Blessed Ward",
        aliases: ["Radiant", "Ward", "Mystic"],
        summary: "Infuses garments with protective magic.",
        delivery: "Self/party aura",
        duration: "Sustained",
        tacticalNotes:
          "Reduces curse potency, repels hexes, and can anchor ritual protections for the whole party when keyed to shared crests.",
      },
    ],
  },
  {
    id: "accessory-traits",
    title: "Accessories & Trinkets",
    discipline: "accessoryTrait",
    description:
      "Charms, kits, and insignia that convey passive bonuses or narrative authority.",
    entries: [
      {
        name: "Luck Charm",
        aliases: ["Omen", "Fortune"],
        summary: "Nudges probability in the wearer's favor.",
        delivery: "Global passive",
        duration: "Sustained",
        tacticalNotes:
          "Boosts crit chance, loot quality, or random event tables—best equipped by leaders who influence party-wide rolls.",
      },
      {
        name: "Focus Token",
        aliases: ["Arcane", "Scholar"],
        summary: "Stabilizes concentration for spellwork and lore checks.",
        delivery: "Self focus",
        duration: "Sustained",
        tacticalNotes:
          "Offers bonus mana regen, spell accuracy, or knowledge recall, keeping casters sharp during extended delves.",
      },
      {
        name: "Utility Rig",
        aliases: ["Carry", "Kit"],
        summary: "Adds tool slots and load-bearing options.",
        delivery: "Equipment harness",
        duration: "Sustained",
        tacticalNotes:
          "Increases inventory limits, quick-access tools, and mission-specific modules like climbing gear or alchemy pouches.",
      },
      {
        name: "Authority Badge",
        aliases: ["Signal"],
        summary: "Signals rank and grants command recognition.",
        delivery: "Social presence",
        duration: "Sustained",
        tacticalNotes:
          "Unlocks restricted areas, compels obedience from trained troops, and smooths negotiations with allied factions.",
      },
    ],
  },
];

export interface StatusEffectLookupResult {
  categoryId: string;
  categoryTitle: string;
  entry: StatusEffectEntry;
}

export const STATUS_EFFECT_LOOKUP: Record<string, StatusEffectLookupResult> = (() => {
  const index: Record<string, StatusEffectLookupResult> = {};
  for (const category of STATUS_EFFECT_GLOSSARY) {
    for (const entry of category.entries) {
      const value: StatusEffectLookupResult = {
        categoryId: category.id,
        categoryTitle: category.title,
        entry,
      };
      index[entry.name.toLowerCase()] = value;
      for (const alias of entry.aliases ?? []) {
        index[alias.toLowerCase()] = value;
      }
    }
  }
  return index;
})();

export function getStatusEffect(name: string): StatusEffectLookupResult | null {
  return STATUS_EFFECT_LOOKUP[name.toLowerCase()] ?? null;
}

export const getSpecialEffect = getStatusEffect;

export const MELEE_FORMULA = {
  description:
    "Upgraded melee model with crits, resist typing, AP, on-hit effects, sunder/disarm/sever hooks, and armor crit-defense.",
  coefficients: {
    attrSecondaryWeight: 0.5,
    levelSlope: 0.05,
    levelClampMin: 0.5,
    levelClampMax: 1.5,
    profScalar: 0.01,
    nonCombatScalar: 0.001,
    blockMitigationPerChance: 0.5,
    resistClampMinPct: 0,
    resistClampMaxPct: 80,
    apDefenseBypassPctCap: 70,
  },
  calcOrder: [
    "attrScale = (skill.keyAttribute || 'STR') + coeff.attrSecondaryWeight * (skill.secondaryAttribute ? attacker[skill.secondaryAttribute] : 0)",
    "levelFactor = clamp(1 + coeff.levelSlope * (attacker.level - defender.level), coeff.levelClampMin, coeff.levelClampMax)",
    "profFactor = 1 + attacker.weaponProficiency * coeff.profScalar",
    "nonCombat = 1 + (attacker.nonCombat.singing + attacker.nonCombat.instrument + attacker.nonCombat.dancing) * coeff.nonCombatScalar",
    "offenseBonus = nonCombat * (1 + attacker.effects.ATK_PCT/100)",
    "baseDamage = skill.basePower * attrScale * profFactor * offenseBonus * levelFactor",
    "defenseBase = defender.DEF != null ? defender.DEF : (defender.CON + defender.VIT)",
    "apBypassPct = clamp(weapon.ap * 100, 0, coeff.apDefenseBypassPctCap)",
    "defenseBonus = (1 + defender.effects.DEF_PCT/100) * (1 - apBypassPct/100)",
    "damageAfterDefense = max(0, baseDamage - defenseBase * defenseBonus)",
    "attrResist = clamp(((defender.CON + defender.VIT)/2 - attacker.STR) / 200, -0.2, 0.6)",
    "typedResistPct = sumOverTypes(weapon.dmgMix[type] * defender.resists[type])",
    "totalResistPct = clamp(typedResistPct + (skill.elementalResistPct || 0) + max(0, attrResist*100), coeff.resistClampMinPct, coeff.resistClampMaxPct)",
    "dmgTakenMod = 1 + (defender.effects.DMG_TAKEN_PCT || 0)/100",
    "damageAfterResist = damageAfterDefense * (1 - totalResistPct/100) * dmgTakenMod",
    "evasionChance = clamp( baseEvasion(attacker, defender) * (1 + defender.effects.EVADE_PCT/100), 0, 0.60 )",
    "hitChance = 1 - evasionChance",
    "blockChance = clamp( baseBlock(attacker, defender), 0, 0.75 )",
    "postBlock = damageAfterResist * (1 - blockChance * coeff.blockMitigationPerChance)",
    "critChance = clamp( (weapon.critChancePct/100) * critVsDefenseModifier(attacker, defender), 0, 0.50 )",
    "critRoll = RNG() < critChance",
    "critDR = 1 - (defender.critDamageReductionPct || 0)/100",
    "critBypass = (weapon.critArmorBypassPct || 0)",
    "postBlockCritReady = postBlock * (critRoll ? weapon.critMult * critDR : 1)",
    "finalDamage = postBlockCritReady * (1 - (defender.critDefense || 0)/100)",
    "applyOnHit(finalDamage, weapon.onHit, defender)",
  ],
  helpers: {
    baseEvasion: "uses AGI vs DEX, proficiency gaps, level difference (same as your current model)",
    baseBlock: "uses defender block proficiency, CON+VIT vs attacker STR, level difference",
    critVsDefenseModifier: "scales up if attacker DEX>defender AGI and attacker level>defender; scales down otherwise",
    applyOnHit:
      "roll bleed/sunder/disarm/sever using their chancePct. sunder stacks reduce DEF by powerPct per stack. disarm applies short attack penalty or offHand disable for cdSec. sever applies heavy bleed + limb impairment checks per GM rules.",
  },
} as const;

export const ON_HIT_DEFAULTS = {
  bleed: {
    description: "Applies a stacking bleed that deals physical damage over time based on the final damage dealt.",
    range: "Contact",
    durationSec: 6,
    maxStacks: 5,
    tickSec: 2,
    scalesWith: "finalDamage",
    tags: ["damage", "over-time", "physical"],
    glossaryKey: "bleed",
  },
  sunder: {
    description: "Reduces the target's armor and defense values per stack.",
    range: "Contact",
    durationSec: 12,
    maxStacks: 5,
    tags: ["debuff", "armor"],
    glossaryKey: "sunder",
  },
  disarm: {
    description: "Forces the target to lose grip on their weapon, reducing their offensive options temporarily.",
    range: "Contact",
    durationSec: 4,
    cdSec: 8,
    tags: ["control", "crowd"],
    glossaryKey: "disarm",
  },
  sever: {
    description: "Inflicts a grievous wound with a chance to maim or cripple the target.",
    range: "Contact",
    cdSec: 14,
    tags: ["damage", "maim"],
  },
  daze: {
    description: "Briefly staggers the target, reducing their accuracy and evasion.",
    range: "Contact",
    durationSec: 2,
    tags: ["control", "crowd"],
    glossaryKey: "daze",
  },
  rend: {
    description: "Tears through armor and flesh, causing bleed-like damage and reducing defenses.",
    range: "Contact",
    durationSec: 8,
    tickSec: 2,
    scalesWith: "finalDamage",
    tags: ["damage", "over-time", "armor"],
    glossaryKey: "rend",
  },
  entangle: {
    description: "Restricts the target's movement, lowering evasion and making repositioning difficult.",
    range: "Reach",
    durationSec: 6,
    tags: ["control", "crowd"],
    glossaryKey: "entangle",
  },
  lunarBrand: {
    description: "Brands the target in pale light, increasing the damage they take from follow-up attacks.",
    range: "Contact",
    durationSec: 10,
    tags: ["debuff", "magic", "mark"],
  },
} as const;

const COEFF = MELEE_FORMULA.coefficients;
const DAMAGE_TYPES: DamageType[] = ["BLUNT", "SLASH", "PIERCE"];
const AP_BAND_VALUE: Record<string, number> = {
  Low: 0.06,
  "Low-Medium": 0.12,
  Medium: 0.2,
  "Medium-High": 0.3,
  High: 0.42,
  "Very High": 0.52,
};

function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(max, x));
}

function aggregateEffects(effects: Record<string, number>[] = []) {
  const mods: Record<string, number> = {};
  for (const e of effects) {
    for (const [key, value] of Object.entries(e)) {
      mods[key] = (mods[key] || 0) + (value as number);
    }
  }
  return mods;
}

function proficiencyForSkill(actor: Actor, skill: any, type: "weapon" | "spell") {
  if (type === "weapon") {
    const key = skill.weapon?.toLowerCase();
    return actor.proficiencies[key] || 0;
  }
  const elementKey = skill.element?.toLowerCase();
  const schoolKey = skill.school?.toLowerCase();
  const elemProf = elementKey ? actor.proficiencies[elementKey] || 0 : 0;
  const schoolProf = schoolKey ? actor.proficiencies[schoolKey] || 0 : 0;
  return Math.min(elemProf, schoolProf);
}

function nonCombatScalar(actor: Actor, includeDancing = true) {
  const { singing = 0, instrument = 0, dancing = 0 } = actor.proficiencies;
  const sum = singing + instrument + (includeDancing ? dancing : 0);
  return 1 + sum * COEFF.nonCombatScalar;
}

function baseEvasionChance(attacker: Actor, defender: Actor, atkProf: number) {
  const agi = defender.attributes.AGI || 0;
  const dex = attacker.attributes.DEX || 0;
  const defEvasion = defender.proficiencies.evasion || 0;
  const levelGap = defender.level - attacker.level;
  const raw =
    0.1 +
    (agi - dex) * 0.005 +
    (defEvasion - atkProf) * 0.002 +
    levelGap * 0.01;
  return Math.max(0, raw * nonCombatScalar(defender));
}

function baseBlockChance(attacker: Actor, defender: Actor) {
  const defBlock = defender.proficiencies.block || 0;
  const conVit = (defender.attributes.CON || 0) + (defender.attributes.VIT || 0);
  const str = attacker.attributes.STR || 0;
  const levelGap = defender.level - attacker.level;
  return 0.05 + defBlock * 0.002 + (conVit - str) * 0.002 + levelGap * 0.01;
}

function critVsDefenseModifier(attacker: Actor, defender: Actor) {
  const dex = attacker.attributes.DEX || 0;
  const agi = defender.attributes.AGI || 0;
  const levelDiff = attacker.level - defender.level;
  let modifier = 1 + (dex - agi) * 0.01 + levelDiff * 0.02;
  return clamp(modifier, 0.5, 1.5);
}

interface ResolvedWeaponStats {
  ap: number;
  dmgMix: Record<DamageType, number>;
  critChancePct: number;
  critMult: number;
  critArmorBypassPct: number;
  onHit: Record<string, WeaponOnHitConfig>;
}

function normalizeDamageMix(mix?: Partial<Record<DamageType, number>>): Record<DamageType, number> {
  const base: Record<DamageType, number> = { BLUNT: 0, SLASH: 0, PIERCE: 0 };
  if (mix) {
    for (const type of DAMAGE_TYPES) {
      base[type] = mix[type] ?? 0;
    }
  }
  const total = DAMAGE_TYPES.reduce((sum, type) => sum + base[type], 0);
  if (total <= 0) {
    return { BLUNT: 0.34, SLASH: 0.33, PIERCE: 0.33 };
  }
  return {
    BLUNT: base.BLUNT / total,
    SLASH: base.SLASH / total,
    PIERCE: base.PIERCE / total,
  };
}

function resolveWeaponStats(stats?: WeaponCombatStats): ResolvedWeaponStats {
  let ap = 0;
  if (stats) {
    if (typeof stats.ap === "number") {
      ap = stats.ap;
    } else if (stats.armorPenBand && AP_BAND_VALUE[stats.armorPenBand] != null) {
      ap = AP_BAND_VALUE[stats.armorPenBand];
    }
  }
  return {
    ap,
    dmgMix: normalizeDamageMix(stats?.dmgMix),
    critChancePct: stats?.critChancePct ?? 0,
    critMult: stats?.critMult ?? 1.5,
    critArmorBypassPct: stats?.critArmorBypassPct ?? 0,
    onHit: stats?.onHit ?? {},
  };
}

function applyOnHit(finalDamage: number, config: Record<string, WeaponOnHitConfig>, rng: () => number): OnHitResult[] {
  const results: OnHitResult[] = [];
  if (!config) return results;
  for (const [effect, raw] of Object.entries(config)) {
    const defaults = (ON_HIT_DEFAULTS as Record<string, Partial<WeaponOnHitConfig>>)[effect] || {};
    const merged: WeaponOnHitConfig = { ...defaults, ...raw } as WeaponOnHitConfig;
    const chance = (merged.chancePct ?? 0) / 100;
    const roll = rng();
    const triggered = roll < chance;
    const result: OnHitResult = {
      effect,
      triggered,
      chance,
      roll,
      config: merged,
    };
    if (triggered) {
      if (merged.scalesWith === "finalDamage") {
        result.scaledPower = (merged.power ?? 1) * finalDamage;
      } else if (typeof merged.powerPct === "number") {
        result.scaledPower = (merged.powerPct / 100) * finalDamage;
      } else if (typeof merged.power === "number") {
        result.scaledPower = merged.power;
      }
    }
    results.push(result);
  }
  return results;
}

export function calculateCombat(attacker: Actor, defender: Actor, opts: CombatOptions): CombatResult {
  const rng = opts.rng ?? Math.random;
  const skillList = opts.attackType === "weapon" ? WEAPON_SKILLS : SPELLBOOK;
  const skill = skillList.find((s: any) => s.id === opts.attackId);
  if (!skill) {
    throw new Error("Unknown attack id");
  }

  const atkMods = aggregateEffects(opts.attackerEffects);
  const defMods = aggregateEffects(opts.defenderEffects);

  if (opts.attackType === "weapon") {
    const weaponProf = proficiencyForSkill(attacker, skill, "weapon");
    const resolved = resolveWeaponStats(opts.weaponStats);

    const keyAttr = skill.keyAttribute || "STR";
    const secondaryAttr = skill.secondaryAttribute as string | undefined;
    const keyValue = attacker.attributes[keyAttr] || 0;
    const secondaryValue = secondaryAttr ? attacker.attributes[secondaryAttr] || 0 : 0;
    const attrScale = keyValue + COEFF.attrSecondaryWeight * secondaryValue;

    const levelFactor = clamp(
      1 + COEFF.levelSlope * (attacker.level - defender.level),
      COEFF.levelClampMin,
      COEFF.levelClampMax
    );
    const profFactor = 1 + weaponProf * COEFF.profScalar;
    const offenseBonus = nonCombatScalar(attacker) * (1 + (atkMods.ATK_PCT || 0) / 100);

    const baseDamage = skill.basePower * attrScale * profFactor * offenseBonus * levelFactor;

    const defenseBase =
      defender.defense != null
        ? defender.defense
        : (defender.attributes.CON || 0) + (defender.attributes.VIT || 0);

    const apBypassPct = clamp(resolved.ap * 100, 0, COEFF.apDefenseBypassPctCap);
    const defenseBonus = (1 + (defMods.DEF_PCT || 0) / 100) * (1 - apBypassPct / 100);
    const damageAfterDefense = Math.max(0, baseDamage - defenseBase * defenseBonus);

    const attrResist = clamp(
      (((defender.attributes.CON || 0) + (defender.attributes.VIT || 0)) / 2 - (attacker.attributes.STR || 0)) /
        200,
      -0.2,
      0.6
    );

    let typedResistPct = 0;
    for (const type of DAMAGE_TYPES) {
      const share = resolved.dmgMix[type] || 0;
      const resist = defender.resists?.[type] || 0;
      typedResistPct += share * resist;
    }

    const totalResistPct = clamp(
      typedResistPct + (skill.elementalResistPct || 0) + Math.max(0, attrResist * 100),
      COEFF.resistClampMinPct,
      COEFF.resistClampMaxPct
    );
    const resistMultiplier = 1 - totalResistPct / 100;

    const dmgTakenMod = 1 + (defMods.DMG_TAKEN_PCT || 0) / 100;
    const damageAfterResist = damageAfterDefense * resistMultiplier * dmgTakenMod;

    const baseEvade = baseEvasionChance(attacker, defender, weaponProf);
    const evasionChance = clamp(baseEvade * (1 + (defMods.EVADE_PCT || 0) / 100), 0, 0.6);
    const hitChance = clamp(1 - evasionChance, 0, 1);

    const blockChance = clamp(baseBlockChance(attacker, defender), 0, 0.75);
    const postBlock = damageAfterResist * (1 - blockChance * COEFF.blockMitigationPerChance);

    const critModifier = critVsDefenseModifier(attacker, defender);
    const critChance = clamp((resolved.critChancePct / 100) * critModifier, 0, 0.5);

    const critApPct = clamp(apBypassPct + resolved.critArmorBypassPct * 100, 0, COEFF.apDefenseBypassPctCap);
    const defenseBonusCrit = (1 + (defMods.DEF_PCT || 0) / 100) * (1 - critApPct / 100);
    const damageAfterDefenseCrit = Math.max(0, baseDamage - defenseBase * defenseBonusCrit);
    const damageAfterResistCrit = damageAfterDefenseCrit * resistMultiplier * dmgTakenMod;
    const postBlockCrit = damageAfterResistCrit * (1 - blockChance * COEFF.blockMitigationPerChance);

    const critDR = 1 - ((defender.critDamageReductionPct ?? defMods.CRIT_DMG_REDUCTION_PCT) || 0) / 100;
    const critDefense = (defender.critDefense ?? defMods.CRIT_DEFENSE) || 0;

    const nonCritDamage = postBlock * (1 - critDefense / 100);
    const critDamage = postBlockCrit * (resolved.critMult || 1) * critDR * (1 - critDefense / 100);

    const expectedDamage = (critChance * critDamage + (1 - critChance) * nonCritDamage) * hitChance;

    const didHit = rng() < hitChance;
    const critOccurred = didHit && rng() < critChance;
    const appliedDamage = didHit ? (critOccurred ? critDamage : nonCritDamage) : 0;
    const onHitResults = didHit ? applyOnHit(appliedDamage, resolved.onHit, rng) : [];

    return {
      damage: appliedDamage,
      expectedDamage,
      didHit,
      critOccurred,
      critChance,
      critMultiplier: critOccurred ? resolved.critMult || 1 : 1,
      hitChance,
      evasionChance,
      blockChance,
      resistMultiplier,
      typedResistPct,
      totalResistPct,
      apBypassPct,
      onHitResults,
    };
  }

  // Spell / default branch retains the previous deterministic model
  const atkProf = proficiencyForSkill(attacker, skill, "spell");
  const defEvasion = defender.proficiencies.evasion || 0;
  const defBlock = defender.proficiencies.block || 0;

  const keyAttr = skill.keyAttribute || "INT";
  const secondaryAttr = skill.secondaryAttribute as string | undefined;
  const keyValue = attacker.attributes[keyAttr] || 0;
  const secondaryValue = secondaryAttr ? attacker.attributes[secondaryAttr] || 0 : 0;
  const attrScale = keyValue + secondaryValue * 0.5;

  const levelFactor = clamp(1 + (attacker.level - defender.level) * 0.05, 0.5, 1.5);
  const profFactor = 1 + atkProf / 100;
  const offenseBonus = nonCombatScalar(attacker) * (1 + (atkMods.ATK_PCT || 0) / 100);
  const baseDamage = skill.basePower * attrScale * profFactor * offenseBonus * levelFactor;

  const defenseBase = defender.defense || (defender.attributes.CON + defender.attributes.VIT);
  const defenseBonus = nonCombatScalar(defender, false) * (1 + (defMods.DEF_PCT || 0) / 100);
  const damageAfterDefense = Math.max(0, baseDamage - defenseBase * defenseBonus);

  const resistAttr = (defender.attributes.INT || 0) /
    ((defender.attributes.INT || 0) + (attacker.attributes.INT || 0) + 1);
  const elementResist = (defender.resists?.[skill.element] || 0) / 100;
  const dmgTakenMod = 1 + (defMods.DMG_TAKEN_PCT || 0) / 100;
  const totalResist = clamp(resistAttr + elementResist, 0, 0.8);
  const damageAfterResist = damageAfterDefense * (1 - totalResist) * dmgTakenMod;

  const evasionChance = clamp(
    (0.1 + (defender.attributes.AGI - attacker.attributes.DEX) * 0.005 +
      (defEvasion - atkProf) * 0.002 + (defender.level - attacker.level) * 0.01) *
      nonCombatScalar(defender) * (1 + (defMods.EVADE_PCT || 0) / 100),
    0,
    0.95
  );
  const hitChance = clamp(1 - evasionChance, 0, 1);

  const blockChance = clamp(
    0.05 +
      defBlock * 0.002 +
      (defender.attributes.CON + defender.attributes.VIT - attacker.attributes.STR) * 0.002 +
      (defender.level - attacker.level) * 0.01,
    0,
    0.8
  );

  const finalDamage = damageAfterResist * (1 - blockChance * 0.5);

  return {
    damage: finalDamage,
    expectedDamage: finalDamage * hitChance,
    didHit: true,
    critOccurred: false,
    critChance: 0,
    critMultiplier: 1,
    hitChance,
    evasionChance,
    blockChance,
    resistMultiplier: 1 - totalResist,
    typedResistPct: 0,
    totalResistPct: totalResist * 100,
    apBypassPct: 0,
    onHitResults: [],
  };
}
