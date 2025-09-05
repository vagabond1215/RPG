import { gainProficiency } from "./proficiency_base.js";
import { HYBRID_RELATIONS } from "./hybrid_relations.js";

export const elementalProficiencyMap = {
  stone: "stone",
  water: "water",
  wind: "wind",
  fire: "fire",
  ice: "ice",
  thunder: "thunder",
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
  Destructive: "destructive",
  Healing: "healing",
  Reinforcement: "reinforcement",
  Enfeebling: "enfeebling",
  Summoning: "summoning",
};

export const SCHOOL_MAGIC_KEYS = Object.values(schoolProficiencyMap);

export const HYBRID_MAP = Object.fromEntries(
  HYBRID_RELATIONS.map(r => [r.name, r])
);

export function applySpellProficiencyGain(character, spell, params) {
  if (!character || !spell) return;
  if (!HYBRID_MAP[spell.element]) {
    const elemKey = elementalProficiencyMap[spell.element?.toLowerCase()];
    if (elemKey) {
      character[elemKey] = gainElementProficiency(elemKey, {
        P: character[elemKey],
        ...params,
      });
    }
  }
  const schoolKey = schoolProficiencyMap[spell.school];
  if (schoolKey) {
    character[schoolKey] = gainProficiency({
      P: character[schoolKey],
      ...params,
    });
  }
}
