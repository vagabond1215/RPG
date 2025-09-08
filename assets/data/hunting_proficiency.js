import { gainProficiency } from "./proficiency_base.js";

function levelFactor(charLevel, huntLevel) {
  const diff = Math.abs((huntLevel ?? charLevel) - charLevel);
  return 1 / (1 + diff);
}

/**
 * Increase a character's hunting proficiency.
 *
 * @param {Object} character - The acting character.
 * @param {number} huntLevel - Difficulty or monster level of the hunt.
 * @param {Object} [opts]
 * @param {boolean} [opts.success=true] - Whether the hunt succeeded.
 * @returns {number} Updated proficiency value.
 */
export function gainHuntingProficiency(character, huntLevel, opts = {}) {
  const { success = true } = opts;
  const current = character.hunting || 0;
  const level = character.level || 1;
  const F_level = levelFactor(level, huntLevel);
  character.hunting = gainProficiency({
    P: current,
    L: level,
    A0: 1,
    A: 0,
    r: 1,
    F_level,
    success,
  });
  return character.hunting;
}

/**
 * Convenience helper to apply hunting progression after a hunt.
 *
 * @param {Object} character
 * @param {number} huntLevel
 * @param {Object} [opts]
 * @returns {number} New proficiency value.
 */
export function performHunt(character, huntLevel, opts = {}) {
  return gainHuntingProficiency(character, huntLevel, opts);
}
