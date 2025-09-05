import { gainProficiency } from "./proficiency_base.js";

/**
 * Increase a character's gathering proficiency.
 *
 * @param {Object} character - The acting character.
 * @param {string} skillKey - Gathering skill key (e.g., 'mining', 'foraging').
 * @param {Object} [opts]
 * @param {boolean} [opts.success=true] - Whether the gathering attempt succeeded.
 * @returns {number} Updated proficiency value.
 */
export function gainGatherProficiency(character, skillKey, opts = {}) {
  const { success = true } = opts;
  const current = character[skillKey] || 0;
  const level = character.level || 1;
  character[skillKey] = gainProficiency({
    P: current,
    L: level,
    A0: 1,
    A: 0,
    r: 1,
    success,
  });
  return character[skillKey];
}

/**
 * Convenience helper to perform a gathering activity and apply progression.
 *
 * @param {Object} character - The acting character.
 * @param {string} skillKey - Gathering skill key.
 * @param {Object} [opts]
 * @returns {number} New proficiency value.
 */
export function performGathering(character, skillKey, opts = {}) {
  return gainGatherProficiency(character, skillKey, opts);
}
