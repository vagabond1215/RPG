import { trainingCraft } from "./craft_skill_tracker.js";

/**
 * Increase a character's crafting skill using standard training parameters.
 *
 * @param {Object} character - The character whose skill to train.
 * @param {string} skillKey - Property name for the crafting skill.
 * @returns {number} Updated proficiency value.
 */
export function trainCraftSkill(character, skillKey, opts = {}) {
  return trainingCraft(character, skillKey, opts);
}
