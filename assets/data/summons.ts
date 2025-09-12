// summons.ts — Elemental summons (amorphous / humanoid / awakened) with unlocks, scaling, and abilities

/* ========================= Types ========================= */

export type Element = "Stone"|"Water"|"Wind"|"Fire"|"Ice"|"Thunder"|"Dark"|"Light";
export type Form = "Elemental"|"Humanoid"|"Awakened";
export type Role = "Tank"|"DPS"|"Controller"|"Support"|"Hybrid";
export type Attr = "STR"|"DEX"|"CON"|"VIT"|"AGI"|"INT"|"WIS"|"CHA";

export interface UnlockCondition {
  summoningMin: number;   // threshold on Summoning proficiency
  elementMin: number;     // threshold on associated element proficiency
}

export interface Ability {
  id: string;
  name: string;
  kind: "strike"|"dot"|"regen"|"control"|"buff"|"debuff"|"aura"|"shield"|"utility";
  target: "ST"|"AoE"|"Self"|"Party";
  // payload is “engine-ready” — mirrors shapes you’ve used for spells/songs/dances
  payload: Record<string, unknown>;
  // magnitude scales at runtime; these are base hints used by resolver
  scaleHints?: { pctBase?: number; pctAtP100?: number; flatBase?: number; flatAtP100?: number };
  tags?: string[]; // routing flags (e.g., ["BURN","TAUNT","THORNS"])
}

export interface SummonDef {
  id: string;
  element: Element;
  form: Form;
  name: string;
  description: string;
  role: Role;
  keyAttributes: Attr[];    // drive scaling variance for this summon
  unlock: UnlockCondition;

  // Stat scaling coefficients (resolved vs summoner stats)
  // Base coefficients are “per point” of summoner attribute; multiplied by role/form multipliers at runtime
  statCoeffs: {
    hpPerCON?: number; hpPerWIS?: number; hpPerINT?: number;  // HP budget
    dmgPerINT?: number; dmgPerSTR?: number; dmgPerAGI?: number;
    defPerCON?: number; defPerVIT?: number; evaPerAGI?: number;
  };

  // Cost / upkeep model (runtime multiplies by form factor)
  costModel: {
    initialMPCost: number;      // upfront MP to summon
    upkeepMPper5s: number;      // upkeep MP every 5 seconds while active
    baseDurationSec?: number;   // 0 => maintained (no countdown) until dismissed or MP runs out
    durationModel?: "maintained"|"timed";
  };

  abilities: Ability[];
}

/** Runtime inputs to resolve a summon instance */
export interface SummonResolveInput {
  summonerLevel: number;
  summonerAttrs: Record<Attr, number>;
  summoningP: number;        // Summoning proficiency (0..cap)
  elementP: number;          // Associated element proficiency (0..cap)
}

/** Runtime resolved numbers */
export interface SummonResolved {
  def: SummonDef;
  unlocked: boolean;
  effectiveP: number;        // synergy gate, see calc below
  // computed stats
  hp: number;
  attack: number;
  defense: number;
  evasion: number;
  // MP cost profile
  initialMPCost: number;
  upkeepMPper5s: number;
  durationSec: number;       // 0 if maintained
  // resolved ability magnitudes (percent points or flat values)
  abilityMagnitudes: Record<string, number>;
}

/* ========================= Dials & Utility ========================= */

// Form multipliers — awakened are stronger, but also costlier
const FORM_MULT = {
  Elemental: { hp: 1.00, dmg: 1.00, def: 1.00, eva: 1.00, cost: 1.00 },
  Humanoid:  { hp: 1.20, dmg: 1.25, def: 1.15, eva: 1.10, cost: 1.30 },
  Awakened:  { hp: 1.50, dmg: 1.50, def: 1.30, eva: 1.15, cost: 1.70 },
} as const;

// Role multipliers (applied after statCoeffs * summoner Stats)
const ROLE_MULT = {
  Tank:       { hp: 1.35, dmg: 0.85, def: 1.25, eva: 0.90 },
  DPS:        { hp: 0.95, dmg: 1.35, def: 0.95, eva: 1.05 },
  Controller: { hp: 1.00, dmg: 1.05, def: 1.00, eva: 1.10 },
  Support:    { hp: 1.05, dmg: 0.95, def: 1.05, eva: 1.00 },
  Hybrid:     { hp: 1.10, dmg: 1.10, def: 1.05, eva: 1.05 },
} as const;

// Proficiency synergy: progress only as fast as the weaker of the two
// EffectiveP = geometric mean, clipped by min — smooth but gated by the lower track
function effectiveP(summoningP: number, elementP: number): number {
  const minP = Math.min(summoningP, elementP);
  if (minP <= 0) return 0;
  return Math.min(minP, Math.sqrt(Math.max(1, summoningP) * Math.max(1, elementP)));
}

// Attribute variance (mild) — similar to support sets you use
const VARIANCE_ALPHA = 0.25; // 25% swing across 6..14 range centered at 10
function applyAttrVariance(base: number, attrs: Record<Attr, number>, keys: Attr[]) {
  if (!keys.length) return base;
  const avg = keys.reduce((s,k)=>s+(attrs[k]??10),0)/keys.length;
  const factor = 1 + VARIANCE_ALPHA * ((avg - 10)/10);
  return base * factor;
}

/* ========================= The Summon List (24 entries) ========================= */

function mkUnlock(form: Form): UnlockCondition {
  if (form === "Elemental") return { summoningMin: 1,  elementMin: 1 };
  if (form === "Humanoid")  return { summoningMin: 50, elementMin: 50 };
  return                      { summoningMin: 100, elementMin: 100 };
}

function id(el:Element, form:Form) { return `${el}:${form}`; }

export const SUMMONS: SummonDef[] = [
  /* ------------------------ STONE ------------------------ */
  {
    id: id("Stone","Elemental"),
    element:"Stone", form:"Elemental",
    name:"Stone Elemental",
    description:"Amorphous rubble and dust bound by geomancy. Slow, steadfast, and hard to move.",
    role:"Tank",
    keyAttributes:["CON","VIT"],
    unlock: mkUnlock("Elemental"),
    statCoeffs:{ hpPerCON:30, defPerCON:0.8, dmgPerSTR:1.8 },
    costModel:{ initialMPCost:20, upkeepMPper5s:6, durationModel:"maintained" },
    abilities:[
      { id:"stone:slam", name:"Tectonic Slam", kind:"strike", target:"ST",
        payload:{ element:"Stone", coeff:"ATK", tags:["STAGGER"] }, scaleHints:{ pctBase:8, pctAtP100:20 } },
      { id:"stone:fort", name:"Gravel Aegis", kind:"buff", target:"Self",
        payload:{ DMG_TAKEN_PCT:-10 }, scaleHints:{ pctBase:-10, pctAtP100:-20 }, tags:["FORTIFY"] },
      { id:"stone:thorns", name:"Spite of Shale", kind:"aura", target:"Party",
        payload:{ THORNS_PCT:5 }, scaleHints:{ pctBase:5, pctAtP100:10 }, tags:["THORNS"] },
    ]
  },
  {
    id: id("Stone","Humanoid"),
    element:"Stone", form:"Humanoid",
    name:"Stonebound Guardian",
    description:"A towering warder hewn in living granite, carrying an earthen bulwark.",
    role:"Tank",
    keyAttributes:["CON","STR"],
    unlock: mkUnlock("Humanoid"),
    statCoeffs:{ hpPerCON:35, defPerCON:1.0, dmgPerSTR:2.2 },
    costModel:{ initialMPCost:35, upkeepMPper5s:9, durationModel:"maintained" },
    abilities:[
      { id:"stone:taunt", name:"Bedrock Taunt", kind:"debuff", target:"AoE",
        payload:{ TAUNT:true, ACCURACY_PCT:-5 }, scaleHints:{ pctBase:-5, pctAtP100:-10 } },
      { id:"stone:shieldwall", name:"Shieldwall", kind:"buff", target:"Party",
        payload:{ DMG_TAKEN_PCT:-8 }, scaleHints:{ pctBase:-8, pctAtP100:-16 } },
    ]
  },
  {
    id: id("Stone","Awakened"),
    element:"Stone", form:"Awakened",
    name:"Adamant Colossus",
    description:"A sentient monolith, core of pressure and tectonic will.",
    role:"Tank",
    keyAttributes:["CON","STR","VIT"],
    unlock: mkUnlock("Awakened"),
    statCoeffs:{ hpPerCON:40, defPerCON:1.2, dmgPerSTR:2.5 },
    costModel:{ initialMPCost:60, upkeepMPper5s:14, durationModel:"maintained" },
    abilities:[
      { id:"stone:quake", name:"Seismic Quake", kind:"control", target:"AoE",
        payload:{ KNOCKDOWN:true, DMG_PCT:18, element:"Stone" }, scaleHints:{ pctBase:12, pctAtP100:24 } },
      { id:"stone:ward", name:"Earthwarden", kind:"buff", target:"Party",
        payload:{ POISE_PCT:10, DMG_TAKEN_PCT:-10 }, scaleHints:{ pctBase:10, pctAtP100:18 } },
    ]
  },

  /* ------------------------ WATER ------------------------ */
  {
    id: id("Water","Elemental"),
    element:"Water", form:"Elemental",
    name:"Water Elemental",
    description:"A rolling surge of enchanted water, endlessly adaptive.",
    role:"Support",
    keyAttributes:["WIS","INT"],
    unlock: mkUnlock("Elemental"),
    statCoeffs:{ hpPerWIS:24, dmgPerINT:2.0, defPerVIT:0.6 },
    costModel:{ initialMPCost:18, upkeepMPper5s:5, durationModel:"maintained" },
    abilities:[
      { id:"water:soothe", name:"Tide Soothe", kind:"regen", target:"Party",
        payload:{ HP_REGEN_PCT_PER5S:2 }, scaleHints:{ pctBase:2, pctAtP100:5 } },
      { id:"water:slow", name:"Undercurrent", kind:"debuff", target:"AoE",
        payload:{ MOVE_SPEED_PCT:-8 }, scaleHints:{ pctBase:-8, pctAtP100:-16 }, tags:["SLOW"] },
    ]
  },
  {
    id: id("Water","Humanoid"),
    element:"Water", form:"Humanoid",
    name:"Undine Warder",
    description:"A graceful guardian sculpted from the sea’s memory.",
    role:"Support",
    keyAttributes:["WIS","INT"],
    unlock: mkUnlock("Humanoid"),
    statCoeffs:{ hpPerWIS:28, dmgPerINT:2.2, defPerVIT:0.7 },
    costModel:{ initialMPCost:30, upkeepMPper5s:8, durationModel:"maintained" },
    abilities:[
      { id:"water:cleanse", name:"Purifying Rill", kind:"utility", target:"Party",
        payload:{ CLEANSE_ONE:true, HEAL_PCT:3 }, scaleHints:{ pctBase:3, pctAtP100:6 } },
      { id:"water:surge", name:"Riptide", kind:"control", target:"AoE",
        payload:{ DISPLACE:true, DMG_PCT:10, element:"Water" }, scaleHints:{ pctBase:8, pctAtP100:16 } },
    ]
  },
  {
    id: id("Water","Awakened"),
    element:"Water", form:"Awakened",
    name:"Tide Sovereign",
    description:"Command of currents given a face; serenity and floodstorm in one.",
    role:"Support",
    keyAttributes:["WIS","INT","CHA"],
    unlock: mkUnlock("Awakened"),
    statCoeffs:{ hpPerWIS:32, dmgPerINT:2.5, defPerVIT:0.8 },
    costModel:{ initialMPCost:55, upkeepMPper5s:13, durationModel:"maintained" },
    abilities:[
      { id:"water:tsunami", name:"Tsunami Cant", kind:"control", target:"AoE",
        payload:{ KNOCKBACK:true, DMG_PCT:16 }, scaleHints:{ pctBase:12, pctAtP100:22 } },
      { id:"water:blessing", name:"Ocean’s Blessing", kind:"buff", target:"Party",
        payload:{ DMG_TAKEN_PCT:-10, CLEANSE_PERIODIC:true }, scaleHints:{ pctBase:10, pctAtP100:18 } },
    ]
  },

  /* ------------------------ WIND ------------------------ */
  {
    id: id("Wind","Elemental"),
    element:"Wind", form:"Elemental",
    name:"Wind Elemental",
    description:"A slipstream given will; hard to see, harder to hit.",
    role:"DPS",
    keyAttributes:["AGI","DEX"],
    unlock: mkUnlock("Elemental"),
    statCoeffs:{ hpPerCON:18, dmgPerAGI:2.2, evaPerAGI:0.8 },
    costModel:{ initialMPCost:16, upkeepMPper5s:5, durationModel:"maintained" },
    abilities:[
      { id:"wind:cut", name:"Air Cutter", kind:"strike", target:"ST",
        payload:{ element:"Wind", coeff:"ATK" }, scaleHints:{ pctBase:10, pctAtP100:22 } },
      { id:"wind:gale", name:"Gale Step", kind:"buff", target:"Party",
        payload:{ MOVE_SPEED_PCT:6 }, scaleHints:{ pctBase:6, pctAtP100:12 } },
    ]
  },
  {
    id: id("Wind","Humanoid"),
    element:"Wind", form:"Humanoid",
    name:"Sylph Ranger",
    description:"A swift archer of current and cloud.",
    role:"DPS",
    keyAttributes:["AGI","DEX"],
    unlock: mkUnlock("Humanoid"),
    statCoeffs:{ hpPerCON:20, dmgPerAGI:2.5, evaPerAGI:0.9 },
    costModel:{ initialMPCost:28, upkeepMPper5s:8, durationModel:"maintained" },
    abilities:[
      { id:"wind:knock", name:"Cyclone Shot", kind:"control", target:"ST",
        payload:{ KNOCKBACK:true, DMG_PCT:12 }, scaleHints:{ pctBase:9, pctAtP100:18 } },
      { id:"wind:volley", name:"Tempest Volley", kind:"strike", target:"AoE",
        payload:{ element:"Wind", coeff:"ATK_SPLIT" }, scaleHints:{ pctBase:18, pctAtP100:30 } },
    ]
  },
  {
    id: id("Wind","Awakened"),
    element:"Wind", form:"Awakened",
    name:"Zephyr Archon",
    description:"The sky’s edge in humanoid form, reigning over motion itself.",
    role:"DPS",
    keyAttributes:["AGI","DEX","INT"],
    unlock: mkUnlock("Awakened"),
    statCoeffs:{ hpPerCON:22, dmgPerAGI:2.9, evaPerAGI:1.1 },
    costModel:{ initialMPCost:50, upkeepMPper5s:12, durationModel:"maintained" },
    abilities:[
      { id:"wind:mael", name:"Maelstrom Spiral", kind:"control", target:"AoE",
        payload:{ PULL:true, DMG_PCT:20 }, scaleHints:{ pctBase:14, pctAtP100:28 } },
      { id:"wind:haste", name:"Skystride", kind:"buff", target:"Party",
        payload:{ HASTE_PCT:6 }, scaleHints:{ pctBase:6, pctAtP100:12 } },
    ]
  },

  /* ------------------------ FIRE ------------------------ */
  {
    id: id("Fire","Elemental"),
    element:"Fire", form:"Elemental",
    name:"Fire Elemental",
    description:"A living blaze with a hunger for air and foes alike.",
    role:"DPS",
    keyAttributes:["INT","STR"],
    unlock: mkUnlock("Elemental"),
    statCoeffs:{ hpPerCON:18, dmgPerINT:2.6, defPerVIT:0.5 },
    costModel:{ initialMPCost:18, upkeepMPper5s:6, durationModel:"maintained" },
    abilities:[
      { id:"fire:bolt", name:"Ember Bolt", kind:"strike", target:"ST",
        payload:{ element:"Fire", coeff:"ATK" }, scaleHints:{ pctBase:12, pctAtP100:24 } },
      { id:"fire:burn", name:"Ignite", kind:"dot", target:"ST",
        payload:{ element:"Fire", HP_DOT_PER5S_PCT:2 }, scaleHints:{ pctBase:2, pctAtP100:5 }, tags:["BURN"] },
    ]
  },
  {
    id: id("Fire","Humanoid"),
    element:"Fire", form:"Humanoid",
    name:"Flame Herald",
    description:"A cindermarked duelist channeling furnace winds.",
    role:"DPS",
    keyAttributes:["INT","STR"],
    unlock: mkUnlock("Humanoid"),
    statCoeffs:{ hpPerCON:20, dmgPerINT:2.9, defPerVIT:0.6 },
    costModel:{ initialMPCost:32, upkeepMPper5s:9, durationModel:"maintained" },
    abilities:[
      { id:"fire:eruption", name:"Eruption", kind:"strike", target:"AoE",
        payload:{ element:"Fire", DMG_PCT:18 }, scaleHints:{ pctBase:14, pctAtP100:28 } },
      { id:"fire:overheat", name:"Overheat", kind:"debuff", target:"AoE",
        payload:{ DMG_TAKEN_PCT:+8 }, scaleHints:{ pctBase:+8, pctAtP100:+16 } },
    ]
  },
  {
    id: id("Fire","Awakened"),
    element:"Fire", form:"Awakened",
    name:"Inferno Ifrit",
    description:"A crowned conflagration, walking on anvils of heat.",
    role:"DPS",
    keyAttributes:["INT","STR","CHA"],
    unlock: mkUnlock("Awakened"),
    statCoeffs:{ hpPerCON:24, dmgPerINT:3.2, defPerVIT:0.7 },
    costModel:{ initialMPCost:56, upkeepMPper5s:13, durationModel:"maintained" },
    abilities:[
      { id:"fire:supernova", name:"Supernova", kind:"control", target:"AoE",
        payload:{ STUN:true, DMG_PCT:24 }, scaleHints:{ pctBase:16, pctAtP100:32 } },
      { id:"fire:sear", name:"Searing Aura", kind:"aura", target:"Party",
        payload:{ FIRE_ADD_PCT:6 }, scaleHints:{ pctBase:6, pctAtP100:12 } },
    ]
  },

  /* ------------------------ ICE ------------------------ */
  {
    id: id("Ice","Elemental"),
    element:"Ice", form:"Elemental",
    name:"Ice Elemental",
    description:"Shardpack and rime whorls around a polar heart.",
    role:"Controller",
    keyAttributes:["INT","WIS"],
    unlock: mkUnlock("Elemental"),
    statCoeffs:{ hpPerCON:20, dmgPerINT:2.2, defPerVIT:0.7 },
    costModel:{ initialMPCost:18, upkeepMPper5s:6, durationModel:"maintained" },
    abilities:[
      { id:"ice:chill", name:"Winter’s Touch", kind:"debuff", target:"ST",
        payload:{ MOVE_SPEED_PCT:-10 }, scaleHints:{ pctBase:-10, pctAtP100:-18 } },
      { id:"ice:freeze", name:"Flash Freeze", kind:"control", target:"ST",
        payload:{ PARALYZE:true, DURATION_S:1.5 }, scaleHints:{ pctBase:0, pctAtP100:0 }, tags:["PARALYZE"] },
    ]
  },
  {
    id: id("Ice","Humanoid"),
    element:"Ice", form:"Humanoid",
    name:"Glacier Warden",
    description:"A sentinel clad in hoarfrost and judgment.",
    role:"Controller",
    keyAttributes:["INT","WIS"],
    unlock: mkUnlock("Humanoid"),
    statCoeffs:{ hpPerCON:22, dmgPerINT:2.5, defPerVIT:0.8 },
    costModel:{ initialMPCost:32, upkeepMPper5s:9, durationModel:"maintained" },
    abilities:[
      { id:"ice:shatter", name:"Shatter Field", kind:"debuff", target:"AoE",
        payload:{ BRITTLE_PCT:+10 }, scaleHints:{ pctBase:+10, pctAtP100:+18 } },
      { id:"ice:hail", name:"Hail Barrage", kind:"strike", target:"AoE",
        payload:{ element:"Ice", DMG_PCT:16 }, scaleHints:{ pctBase:12, pctAtP100:24 } },
    ]
  },
  {
    id: id("Ice","Awakened"),
    element:"Ice", form:"Awakened",
    name:"Aurora Seraph",
    description:"A prismatic arbiter of stillness and light.",
    role:"Controller",
    keyAttributes:["INT","WIS","CHA"],
    unlock: mkUnlock("Awakened"),
    statCoeffs:{ hpPerCON:24, dmgPerINT:2.8, defPerVIT:0.9 },
    costModel:{ initialMPCost:54, upkeepMPper5s:12, durationModel:"maintained" },
    abilities:[
      { id:"ice:storm", name:"Polar Storm", kind:"control", target:"AoE",
        payload:{ SLOW_PCT:-20, PARALYZE_CHANCE_PCT:20 }, scaleHints:{ pctBase:-15, pctAtP100:-25 } },
      { id:"ice:ward", name:"Crystallize", kind:"shield", target:"Party",
        payload:{ SHIELD_PCTMAX:8 }, scaleHints:{ pctBase:8, pctAtP100:14 } },
    ]
  },

  /* ------------------------ THUNDER ------------------------ */
  {
    id: id("Thunder","Elemental"),
    element:"Thunder", form:"Elemental",
    name:"Thunder Elemental",
    description:"Living arcs flicker and bite with capricious speed.",
    role:"DPS",
    keyAttributes:["INT","DEX"],
    unlock: mkUnlock("Elemental"),
    statCoeffs:{ hpPerCON:18, dmgPerINT:2.7, evaPerAGI:0.6 },
    costModel:{ initialMPCost:20, upkeepMPper5s:6, durationModel:"maintained" },
    abilities:[
      { id:"thunder:arc", name:"Chain Arc", kind:"strike", target:"AoE",
        payload:{ element:"Thunder", CHAIN:3 }, scaleHints:{ pctBase:16, pctAtP100:28 } },
      { id:"thunder:stun", name:"Static Lock", kind:"control", target:"ST",
        payload:{ STUN:true, DURATION_S:1 }, scaleHints:{ pctBase:0, pctAtP100:0 } },
    ]
  },
  {
    id: id("Thunder","Humanoid"),
    element:"Thunder", form:"Humanoid",
    name:"Storm Herald",
    description:"A thunder-borne champion who writes with lightning.",
    role:"DPS",
    keyAttributes:["INT","DEX"],
    unlock: mkUnlock("Humanoid"),
    statCoeffs:{ hpPerCON:20, dmgPerINT:3.0, evaPerAGI:0.7 },
    costModel:{ initialMPCost:34, upkeepMPper5s:9, durationModel:"maintained" },
    abilities:[
      { id:"thunder:surge", name:"Voltage Surge", kind:"strike", target:"ST",
        payload:{ element:"Thunder", DMG_PCT:22, OVERLOAD:true }, scaleHints:{ pctBase:16, pctAtP100:32 } },
      { id:"thunder:battery", name:"Capacitor Field", kind:"aura", target:"Party",
        payload:{ CRIT_TO_RESOURCE:true, MP_ON_CRIT_PCT:1, STAM_ON_CRIT_PCT:1 }, scaleHints:{ pctBase:1, pctAtP100:2 } },
    ]
  },
  {
    id: id("Thunder","Awakened"),
    element:"Thunder", form:"Awakened",
    name:"Tempest Archon",
    description:"Storm’s regard, sharpened to a spear.",
    role:"DPS",
    keyAttributes:["INT","DEX","CHA"],
    unlock: mkUnlock("Awakened"),
    statCoeffs:{ hpPerCON:22, dmgPerINT:3.3, evaPerAGI:0.8 },
    costModel:{ initialMPCost:58, upkeepMPper5s:13, durationModel:"maintained" },
    abilities:[
      { id:"thunder:stormcage", name:"Storm Cage", kind:"control", target:"AoE",
        payload:{ PARALYZE:true, DURATION_S:1.5, element:"Thunder" }, scaleHints:{ pctBase:0, pctAtP100:0 } },
      { id:"thunder:overdrive", name:"Overdrive Aura", kind:"aura", target:"Party",
        payload:{ HASTE_PCT:6, CDR_PCT:4 }, scaleHints:{ pctBase:4, pctAtP100:8 } },
    ]
  },

  /* ------------------------ DARK ------------------------ */
  {
    id: id("Dark","Elemental"),
    element:"Dark", form:"Elemental",
    name:"Dark Elemental",
    description:"A knot of night that eats warmth and courage.",
    role:"Hybrid",
    keyAttributes:["CHA","INT"],
    unlock: mkUnlock("Elemental"),
    statCoeffs:{ hpPerCON:20, dmgPerINT:2.4, defPerVIT:0.7 },
    costModel:{ initialMPCost:20, upkeepMPper5s:6, durationModel:"maintained" },
    abilities:[
      { id:"dark:leech", name:"Umbral Leech", kind:"dot", target:"ST",
        payload:{ HP_DOT_PER5S_PCT:2, LIFESTEAL_PCT:50 }, scaleHints:{ pctBase:2, pctAtP100:5 }, tags:["LEECH"] },
      { id:"dark:fear", name:"Dread Murmur", kind:"control", target:"AoE",
        payload:{ FEAR:true, DURATION_S:1 }, scaleHints:{ pctBase:0, pctAtP100:0 } },
    ]
  },
  {
    id: id("Dark","Humanoid"),
    element:"Dark", form:"Humanoid",
    name:"Shadebinder",
    description:"A dusk-cloaked spellblade who breaks resolve before bone.",
    role:"Hybrid",
    keyAttributes:["CHA","INT"],
    unlock: mkUnlock("Humanoid"),
    statCoeffs:{ hpPerCON:22, dmgPerINT:2.7, defPerVIT:0.8 },
    costModel:{ initialMPCost:36, upkeepMPper5s:9, durationModel:"maintained" },
    abilities:[
      { id:"dark:curse", name:"Waning Curse", kind:"debuff", target:"AoE",
        payload:{ ALL_STATS_PCT:-8 }, scaleHints:{ pctBase:-8, pctAtP100:-16 } },
      { id:"dark:veil", name:"Night Veil", kind:"buff", target:"Party",
        payload:{ THREAT_GEN_PCT:-12 }, scaleHints:{ pctBase:-12, pctAtP100:-20 } },
    ]
  },
  {
    id: id("Dark","Awakened"),
    element:"Dark", form:"Awakened",
    name:"Night Sovereign",
    description:"A crown of voidlight; dominion over courage and shadow.",
    role:"Hybrid",
    keyAttributes:["CHA","INT","WIS"],
    unlock: mkUnlock("Awakened"),
    statCoeffs:{ hpPerCON:24, dmgPerINT:3.0, defPerVIT:0.9 },
    costModel:{ initialMPCost:60, upkeepMPper5s:13, durationModel:"maintained" },
    abilities:[
      { id:"dark:obliterate", name:"Oblivion Wake", kind:"strike", target:"AoE",
        payload:{ element:"Dark", DMG_PCT:22, HEALING_RECEIVED_PCT:-10 }, scaleHints:{ pctBase:16, pctAtP100:30 } },
      { id:"dark:edict", name:"Edict of Silence", kind:"control", target:"AoE",
        payload:{ SILENCE:true, DURATION_S:1.5 }, scaleHints:{ pctBase:0, pctAtP100:0 } },
    ]
  },

  /* ------------------------ LIGHT ------------------------ */
  {
    id: id("Light","Elemental"),
    element:"Light", form:"Elemental",
    name:"Light Elemental",
    description:"A sunshard halo that comforts allies and lays baring foes.",
    role:"Support",
    keyAttributes:["WIS","CHA"],
    unlock: mkUnlock("Elemental"),
    statCoeffs:{ hpPerWIS:22, dmgPerINT:2.0, defPerVIT:0.7 },
    costModel:{ initialMPCost:18, upkeepMPper5s:5, durationModel:"maintained" },
    abilities:[
      { id:"light:reveal", name:"Reveal", kind:"debuff", target:"AoE",
        payload:{ REVEALED:true, ACCURACY_PCT:+6 }, scaleHints:{ pctBase:+6, pctAtP100:+12 } },
      { id:"light:mend", name:"Radiant Mend", kind:"regen", target:"Party",
        payload:{ HP_REGEN_PCT_PER5S:2 }, scaleHints:{ pctBase:2, pctAtP100:5 } },
    ]
  },
  {
    id: id("Light","Humanoid"),
    element:"Light", form:"Humanoid",
    name:"Lumen Warder",
    description:"A beacon-knight who interposes light between harm and hope.",
    role:"Support",
    keyAttributes:["WIS","CHA"],
    unlock: mkUnlock("Humanoid"),
    statCoeffs:{ hpPerWIS:26, dmgPerINT:2.2, defPerVIT:0.8 },
    costModel:{ initialMPCost:32, upkeepMPper5s:8, durationModel:"maintained" },
    abilities:[
      { id:"light:aegis", name:"Solar Aegis", kind:"shield", target:"Party",
        payload:{ SHIELD_PCTMAX:8 }, scaleHints:{ pctBase:8, pctAtP100:14 } },
      { id:"light:res", name:"Guiding Dawn", kind:"buff", target:"Party",
        payload:{ CONTROL_RESIST_PCT:+12 }, scaleHints:{ pctBase:+12, pctAtP100:+20 } },
    ]
  },
  {
    id: id("Light","Awakened"),
    element:"Light", form:"Awakened",
    name:"Solar Seraph",
    description:"A choir’s answer given form — command of clarity and courage.",
    role:"Support",
    keyAttributes:["WIS","CHA","INT"],
    unlock: mkUnlock("Awakened"),
    statCoeffs:{ hpPerWIS:30, dmgPerINT:2.6, defPerVIT:0.9 },
    costModel:{ initialMPCost:56, upkeepMPper5s:12, durationModel:"maintained" },
    abilities:[
      { id:"light:judgment", name:"Judgment Ray", kind:"strike", target:"ST",
        payload:{ element:"Light", DMG_PCT:22, VULN_TO_DARK_PCT:+8 }, scaleHints:{ pctBase:16, pctAtP100:30 } },
      { id:"light:anthem", name:"Courage Anthem", kind:"aura", target:"Party",
        payload:{ ALL_STATS_PCT:+4 }, scaleHints:{ pctBase:+4, pctAtP100:+8 } },
    ]
  },
];

/* ========================= Unlock & Resolve ========================= */

export function isUnlocked(def: SummonDef, summoningP: number, elementP: number): boolean {
  return (summoningP >= def.unlock.summoningMin) && (elementP >= def.unlock.elementMin);
}

function baseStatFromCoeffs(def: SummonDef, attrs: Record<Attr,number>) {
  const c = def.statCoeffs;
  const hp = (c.hpPerCON??0)*(attrs.CON??10) + (c.hpPerWIS??0)*(attrs.WIS??10) + (c.hpPerINT??0)*(attrs.INT??10);
  const atk= (c.dmgPerINT??0)*(attrs.INT??10) + (c.dmgPerSTR??0)*(attrs.STR??10) + (c.dmgPerAGI??0)*(attrs.AGI??10);
  const defense = (c.defPerCON??0)*(attrs.CON??10) + (c.defPerVIT??0)*(attrs.VIT??10);
  const eva= (c.evaPerAGI??0)*(attrs.AGI??10);
  return { hp, atk, def: defense, eva };
}

export function resolveSummon(def: SummonDef, input: SummonResolveInput): SummonResolved {
  const { summonerAttrs, summoningP, elementP } = input;
  const effP = effectiveP(summoningP, elementP);
  const fm = FORM_MULT[def.form];
  const rm = ROLE_MULT[def.role];

  // base stats from summoner attributes → apply variance by keyAttributes → then role & form multipliers
  const base = baseStatFromCoeffs(def, summonerAttrs);
  let hp  = applyAttrVariance(base.hp,  summonerAttrs, def.keyAttributes) * rm.hp * fm.hp;
  let atk = applyAttrVariance(base.atk, summonerAttrs, def.keyAttributes) * rm.dmg * fm.dmg;
  let df  = applyAttrVariance(base.def, summonerAttrs, def.keyAttributes) * rm.def * fm.def;
  let eva = applyAttrVariance(base.eva, summonerAttrs, def.keyAttributes) * rm.eva * fm.eva;

  // scale stats slightly with proficiency synergy (up to +20% at effP=100)
  const pStatFactor = 1 + 0.20 * (effP / 100);
  hp  *= pStatFactor; atk *= pStatFactor; df *= pStatFactor; eva *= pStatFactor;

  // costs & duration
  const costFactor = fm.cost;
  const initialMPCost = Math.round(def.costModel.initialMPCost * costFactor);
  const upkeepMPper5s = Math.round(def.costModel.upkeepMPper5s * costFactor);
  const durationSec   = def.costModel.durationModel === "timed" ? (def.costModel.baseDurationSec ?? 20) : 0;

  // resolve ability magnitudes from scale hints and effP
  const abilityMagnitudes: Record<string, number> = {};
  for (const a of def.abilities) {
    const h = a.scaleHints;
    if (!h) { abilityMagnitudes[a.id] = 0; continue; }
    // linear from unlock → 100, driven by effP
    const magPct = (h.pctBase ?? 0) + ((h.pctAtP100 ?? (h.pctBase ?? 0)) - (h.pctBase ?? 0)) * (effP/100);
    const magFlat= (h.flatBase ?? 0) + ((h.flatAtP100 ?? (h.flatBase ?? 0)) - (h.flatBase ?? 0)) * (effP/100);
    abilityMagnitudes[a.id] = Math.max(magPct, magFlat);
  }

  return {
    def, unlocked: isUnlocked(def, summoningP, elementP), effectiveP: effP,
    hp: Math.round(hp), attack: Math.round(atk), defense: Math.round(df), evasion: Math.round(eva),
    initialMPCost, upkeepMPper5s, durationSec,
    abilityMagnitudes
  };
}

/* ========================= Convenience ========================= */

const ELEMENT_PROF_KEY: Record<Element, string> = {
  Stone: "stone",
  Water: "water",
  Wind: "wind",
  Fire: "fire",
  Ice: "ice",
  Thunder: "thunder",
  Dark: "dark",
  Light: "light",
};

export function summonsForElement(el: Element): SummonDef[] {
  return SUMMONS.filter(s => s.element === el);
}

export function summonsAvailable(
  summoningP: number,
  elementP: number | Record<string, number>
): SummonDef[] {
  return SUMMONS.filter(s => {
    const p =
      typeof elementP === "number"
        ? elementP
        : elementP[ELEMENT_PROF_KEY[s.element]] || 0;
    return isUnlocked(s, summoningP, p);
  });
}

