import { gainProficiency } from "./proficiency_base.js";

export const elementalProficiencyMap = {
  stone: "stone",
  water: "water",
  wind: "wind",
  fire: "fire",
  ice: "ice",
  lightning: "lightning",
  dark: "dark",
  light: "light",
};

export const ELEMENTAL_MAGIC_KEYS = Object.values(elementalProficiencyMap);

const DEFAULT_ELEMENT_GAIN_FN = params => gainProficiency(params);
export const ELEMENT_GAIN_FUNCTIONS = ELEMENTAL_MAGIC_KEYS.reduce(
  (acc, key) => {
    acc[key] = DEFAULT_ELEMENT_GAIN_FN;
    return acc;
  },
  {}
);

export function gainElementProficiency(element, params) {
  const fn = ELEMENT_GAIN_FUNCTIONS[element] || DEFAULT_ELEMENT_GAIN_FN;
  return fn(params);
}

export const schoolProficiencyMap = {
  Destruction: "destruction",
  Healing: "healing",
  Enhancement: "enhancement",
  Enfeeblement: "enfeeblement",
  Control: "control",
  Summoning: "summoning",
};

export const SCHOOL_MAGIC_KEYS = Object.values(schoolProficiencyMap);

const CLASS_ALIAS_FIELDS = [
  "class",
  "advancedClass",
  "theme",
  "classLine",
  "primaryClass",
  "secondaryClass",
  "build",
  "buildName",
];

function collectClassAliases(character) {
  const names = new Set();
  if (!character) return names;
  const addValue = value => {
    if (!value || typeof value !== "string") return;
    String(value)
      .split(/[\/,&]+|\s+/)
      .map(part => part.trim().toLowerCase())
      .filter(Boolean)
      .forEach(name => names.add(name));
  };
  for (const key of CLASS_ALIAS_FIELDS) {
    addValue(character[key]);
  }
  return names;
}

function hasSummonerAccess(character) {
  return collectClassAliases(character).has("summoner");
}

export function applySpellProficiencyGain(character, spell, params) {
  if (!character || !spell) return;
  const elemKey = elementalProficiencyMap[spell.element?.toLowerCase()];
  if (elemKey) {
    character[elemKey] = gainElementProficiency(elemKey, {
      P: character[elemKey],
      ...params,
    });
  }
  const schoolKey = schoolProficiencyMap[spell.school];
  if (schoolKey) {
    if (schoolKey === "summoning" && !hasSummonerAccess(character)) {
      character[schoolKey] = 0;
    } else {
      character[schoolKey] = gainProficiency({
        P: character[schoolKey],
        ...params,
      });
    }
  }
}
