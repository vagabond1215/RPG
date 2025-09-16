import { WEAPON_SKILLS } from "./weapon_skills.js";
import { SPELLBOOK } from "./spells.js";

export interface Actor {
  level: number;
  attributes: Record<string, number>; // STR, DEX, CON, VIT, AGI, INT, WIS, CHA
  proficiencies: Record<string, number>; // weapon, magic, non-combat etc
  defense?: number; // optional flat defense
  resistances?: Record<string, number>; // element -> percent
}

export interface CombatResult {
  damage: number;
  hitChance: number;
  evasionChance: number;
  blockChance: number;
  resistMultiplier: number;
}

export interface CombatOptions {
  attackId: string; // id in WEAPON_SKILLS or SPELLBOOK
  attackType: "weapon" | "spell";
  attackerEffects?: Record<string, number>[]; // modifiers from songs/dances/instruments
  defenderEffects?: Record<string, number>[];
}

const elementProfKey: Record<string, string> = {
  Stone: "stone",
  Water: "water",
  Wind: "wind",
  Fire: "fire",
  Ice: "ice",
  Lightning: "lightning",
  Dark: "dark",
  Light: "light",
};
const schoolProfKey: Record<string, string> = {
  Destruction: "destruction",
  Healing: "healing",
  Enhancement: "enhancement",
  Enfeeblement: "enfeeblement",
  Control: "control",
  Summoning: "summoning",
};

function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(max, x));
}

function aggregateEffects(effects: Record<string, number>[] = []) {
  const mods: Record<string, number> = {};
  for (const e of effects) {
    for (const k in e) {
      if (Object.prototype.hasOwnProperty.call(e, k)) {
        mods[k] = (mods[k] || 0) + (e as any)[k];
      }
    }
  }
  return mods;
}


function proficiencyForSkill(actor: Actor, skill: any, type: "weapon" | "spell") {
  if (type === "weapon") {
    const key = skill.weapon?.toLowerCase();
    return actor.proficiencies[key] || 0;
  }
  const elemKey = elementProfKey[skill.element] || "";
  const schoolKey = schoolProfKey[skill.school] || "";
  const elemP = actor.proficiencies[elemKey] || 0;
  const schoolP = actor.proficiencies[schoolKey] || 0;
  return Math.min(elemP, schoolP);
}

function nonCombatBonus(actor: Actor, kind: "offense" | "defense" | "evasion") {
  const { singing = 0, instrument = 0, dancing = 0 } = actor.proficiencies;
  if (kind === "evasion") return 1 + dancing * 0.001;
  const sum = singing + instrument + (kind === "offense" ? dancing : 0);
  return 1 + sum * 0.001;
}

export function calculateCombat(attacker: Actor, defender: Actor, opts: CombatOptions): CombatResult {
  const skillList = opts.attackType === "weapon" ? WEAPON_SKILLS : SPELLBOOK;
  const skill = skillList.find((s: any) => s.id === opts.attackId);
  if (!skill) throw new Error("Unknown attack id");

  const atkProf = proficiencyForSkill(attacker, skill, opts.attackType);
  const defEvasion = defender.proficiencies.evasion || 0;
  const defBlock = defender.proficiencies.block || 0;

  const atkMods = aggregateEffects(opts.attackerEffects);
  const defMods = aggregateEffects(opts.defenderEffects);

  const keyAttr = skill.keyAttribute || (opts.attackType === "spell" ? "INT" : "STR");
  const secAttr = skill.secondaryAttribute;
  const keyVal = attacker.attributes[keyAttr] || 0;
  const secVal = secAttr ? attacker.attributes[secAttr] || 0 : 0;
  const attrScale = keyVal + secVal * 0.5;

  const levelFactor = clamp(1 + (attacker.level - defender.level) * 0.05, 0.5, 1.5);
  const profFactor = 1 + atkProf / 100;
  const offenseBonus = nonCombatBonus(attacker, "offense") * (1 + (atkMods.ATK_PCT || 0) / 100);
  let baseDamage = skill.basePower * attrScale * profFactor * offenseBonus * levelFactor;

  const defenseBase = defender.defense || (defender.attributes.CON + defender.attributes.VIT);
  const defenseBonus = nonCombatBonus(defender, "defense") * (1 + (defMods.DEF_PCT || 0) / 100);
  const damageAfterDefense = Math.max(0, baseDamage - defenseBase * defenseBonus);

  const isMagic = opts.attackType === "spell" || skill.family === "control" || skill.element;
  const resistAttr = isMagic ? defender.attributes.INT : (defender.attributes.CON + defender.attributes.VIT) / 2;
  const attackerAttr = isMagic ? attacker.attributes.INT : attacker.attributes.STR;
  const resistFromAttr = resistAttr / (resistAttr + attackerAttr + 1);
  const elementResist = (defender.resistances?.[skill.element] || 0) / 100;
  const dmgTakenMod = 1 + (defMods.DMG_TAKEN_PCT || 0) / 100;
  const totalResist = clamp(resistFromAttr + elementResist, 0, 0.8);
  const damageAfterResist = damageAfterDefense * (1 - totalResist) * dmgTakenMod;

  const evasionChance = clamp(
    (0.1 + (defender.attributes.AGI - attacker.attributes.DEX) * 0.005 +
      (defEvasion - atkProf) * 0.002 + (defender.level - attacker.level) * 0.01) *
      nonCombatBonus(defender, "evasion") * (1 + (defMods.EVADE_PCT || 0) / 100),
    0,
    0.95
  );

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
    damage: Math.round(finalDamage * 100) / 100,
    hitChance: Math.round((1 - evasionChance) * 1000) / 1000,
    evasionChance: Math.round(evasionChance * 1000) / 1000,
    blockChance: Math.round(blockChance * 1000) / 1000,
    resistMultiplier: Math.round((1 - totalResist) * 1000) / 1000,
  };
}
