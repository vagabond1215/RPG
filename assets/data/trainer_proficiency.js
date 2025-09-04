import { gainProficiency } from "./proficiency_base.js";

/**
 * Increase a character's crafting skill using standard training parameters.
 *
 * @param {Object} character - The character whose skill to train.
 * @param {string} skillKey - Property name for the crafting skill.
 * @returns {number} Updated proficiency value.
 */
export function trainCraftSkill(character, skillKey) {
  const current = character[skillKey] || 0;
  const level = character.level;
  character[skillKey] = gainProficiency({
    P: current,
    L: level,
    A0: 1,
    A: 0,
    r: 1,
  });
  return character[skillKey];
}
