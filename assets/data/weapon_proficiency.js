import { gainProficiency, LEVEL_GAIN_MIN, LEVEL_GAIN_MAX, LEVEL_GAIN_SLOPE, ATTR_GAIN_MIN, ATTR_GAIN_MAX, ATTR_GAIN_SLOPE } from "./proficiency_base.js";

const clamp = (x, min, max) => Math.max(min, Math.min(max, x));

function levelFactor(actorLevel, enemyLevel) {
  const diff = enemyLevel - actorLevel;
  const factor = 1 + diff * LEVEL_GAIN_SLOPE;
  return clamp(factor, LEVEL_GAIN_MIN, LEVEL_GAIN_MAX);
}

function attrFactor(actorAttr, enemyAttr) {
  const diff = enemyAttr - actorAttr;
  const factor = 1 + diff * ATTR_GAIN_SLOPE;
  return clamp(factor, ATTR_GAIN_MIN, ATTR_GAIN_MAX);
}

function gainWeaponProficiency(character, key, opts = {}) {
  const {
    enemyLevel = character.level || 1,
    enemyAttr,
    keyAttribute = "STR",
    success = true,
  } = opts;
  if (!character.proficiencies) character.proficiencies = {};
  const current = character.proficiencies[key] || 0;
  const actorLevel = character.level || 1;
  const actorAttr = character.attributes?.[keyAttribute] || 0;
  const oppAttr = enemyAttr ?? actorAttr;
  const F_level = levelFactor(actorLevel, enemyLevel);
  const F_attr = attrFactor(actorAttr, oppAttr);
  const updated = gainProficiency({
    P: current,
    L: actorLevel,
    A0: 1,
    A: 0,
    r: 1,
    F_level,
    F_attr,
    success,
  });
  character.proficiencies[key] = updated;
  return updated;
}

function gainArmorProficiency(character, key, opts = {}) {
  const {
    enemyLevel = character.level || 1,
    enemyAttr,
    keyAttribute = "STR",
    success = true,
  } = opts;
  if (!character.proficiencies) character.proficiencies = {};
  const current = character.proficiencies[key] || 0;
  const actorLevel = character.level || 1;
  const actorAttr = character.attributes?.[keyAttribute] || 0;
  const oppAttr = enemyAttr ?? actorAttr;
  const F_level = levelFactor(actorLevel, enemyLevel);
  const F_attr = attrFactor(actorAttr, oppAttr);
  const updated = gainProficiency({
    P: current,
    L: actorLevel,
    A0: 1,
    A: 0,
    r: 1,
    F_level,
    F_attr,
    success,
  });
  character.proficiencies[key] = updated;
  return updated;
}

export const gainSwordProficiency = (c, opts={}) => gainWeaponProficiency(c, "sword", { ...opts, keyAttribute: "STR" });
export const gainGreatswordProficiency = (c, opts={}) => gainWeaponProficiency(c, "greatsword", { ...opts, keyAttribute: "STR" });
export const gainPolearmProficiency = (c, opts={}) => gainWeaponProficiency(c, "polearm", { ...opts, keyAttribute: "STR" });
export const gainAxeProficiency = (c, opts={}) => gainWeaponProficiency(c, "axe", { ...opts, keyAttribute: "STR" });
export const gainGreataxeProficiency = (c, opts={}) => gainWeaponProficiency(c, "greataxe", { ...opts, keyAttribute: "STR" });
export const gainStaffProficiency = (c, opts={}) => gainWeaponProficiency(c, "staff", { ...opts, keyAttribute: "STR" });
export const gainBowProficiency = (c, opts={}) => gainWeaponProficiency(c, "bow", { ...opts, keyAttribute: "DEX" });
export const gainCrossbowProficiency = (c, opts={}) => gainWeaponProficiency(c, "crossbow", { ...opts, keyAttribute: "DEX" });
export const gainMartialProficiency = (c, opts={}) => gainWeaponProficiency(c, "martial", { ...opts, keyAttribute: "STR" });
export const gainWandProficiency = (c, opts={}) => gainWeaponProficiency(c, "wand", { ...opts, keyAttribute: "INT" });
export const gainDaggerProficiency = (c, opts={}) => gainWeaponProficiency(c, "dagger", { ...opts, keyAttribute: "DEX" });
export const gainShieldProficiency = (c, opts={}) => gainArmorProficiency(c, "shield", { ...opts, keyAttribute: "CON" });
export const gainLightArmorProficiency = (c, opts={}) => gainArmorProficiency(c, "lightArmor", { ...opts, keyAttribute: "AGI" });
export const gainMediumArmorProficiency = (c, opts={}) => gainArmorProficiency(c, "mediumArmor", { ...opts, keyAttribute: "DEX" });
export const gainHeavyArmorProficiency = (c, opts={}) => gainArmorProficiency(c, "heavyArmor", { ...opts, keyAttribute: "STR" });

export function gainDualWieldProficiency(character, mainWeapon, offWeapon, opts = {}) {
  if (!character.proficiencies) character.proficiencies = {};
  const current = character.proficiencies["dualWield"] || 0;
  const mainHands = mainWeapon?.meta?.hands ?? mainWeapon?.hands ?? 1;
  const offHands = offWeapon?.meta?.hands ?? offWeapon?.hands ?? 1;
  if (mainHands !== 1 || offHands !== 1) {
    return current;
  }
  const sameType = mainWeapon?.type && mainWeapon.type === offWeapon?.type;
  const g0 = sameType ? 1.5 : 1;
  const actorLevel = character.level || 1;
  const {
    enemyLevel = actorLevel,
    enemyAttr,
    keyAttribute = "DEX",
    success = true,
  } = opts;
  const actorAttr = character.attributes?.[keyAttribute] || 0;
  const oppAttr = enemyAttr ?? actorAttr;
  const F_level = levelFactor(actorLevel, enemyLevel);
  const F_attr = attrFactor(actorAttr, oppAttr);
  const updated = gainProficiency({
    P: current,
    L: actorLevel,
    A0: 1,
    A: 0,
    r: 1,
    g0,
    F_level,
    F_attr,
    success,
  });
  character.proficiencies["dualWield"] = updated;
  return updated;
}

export { gainWeaponProficiency, gainArmorProficiency };

