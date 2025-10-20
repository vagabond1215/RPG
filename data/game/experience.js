// Shared experience progression helpers used by both the browser UI and
// TypeScript utilities. Keeping the numeric formulas in a single module
// prevents subtle drift between implementations.

/**
 * Total experience required to reach a given level using the low-moderate
 * growth curve that mirrors classic RPG systems (0.8 * L^3).
 * @param {number} level
 * @returns {number}
 */
export function totalXpForLevel(level) {
  return Math.floor((4 * Math.pow(level, 3)) / 5);
}

/**
 * Experience needed to advance from the current level to the next one.
 * @param {number} level
 * @returns {number}
 */
export function xpForNextLevel(level) {
  return totalXpForLevel(level + 1) - totalXpForLevel(level);
}

/**
 * Compute the experience reward for defeating an enemy while scaling based on
 * the level difference between the attacker and the target.
 * @param {number} attackerLevel
 * @param {number} enemyLevel
 * @returns {number}
 */
export function experienceFromKill(attackerLevel, enemyLevel) {
  const base = xpForNextLevel(enemyLevel) / 5; // 20% of their next-level requirement
  const diff = enemyLevel - attackerLevel;
  if (diff >= 0) {
    return Math.floor(base * (1 + diff * 0.5));
  }
  const penalty = Math.pow(0.2, Math.abs(diff));
  return Math.floor(base * penalty);
}

/**
 * Distribute experience gains across a party when a single enemy is defeated.
 * @param {{ members: Array<{ id: string; level: number; }> }} party
 * @param {number} enemyLevel
 * @returns {Record<string, { gained: number; nextLevel: number; }>}
 */
export function encounterExperience(party, enemyLevel) {
  const result = {};
  if (!party || !Array.isArray(party.members)) {
    return result;
  }
  for (const member of party.members) {
    if (!member || typeof member.id !== 'string') continue;
    const gained = experienceFromKill(member.level, enemyLevel);
    result[member.id] = {
      gained,
      nextLevel: xpForNextLevel(member.level),
    };
  }
  return result;
}

export default {
  totalXpForLevel,
  xpForNextLevel,
  experienceFromKill,
  encounterExperience,
};
