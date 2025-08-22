import type { Party } from "./party";

/**
 * Total experience required to reach a given level using a common
 * "low-moderate" growth curve. This curve mirrors classic RPGs where
 * total XP grows proportionally to 0.8 * L^3 (fast growth group in
 * some systems).
 */
export function totalXpForLevel(level: number): number {
  return Math.floor((4 * Math.pow(level, 3)) / 5); // 0.8 * L^3
}

/**
 * Experience needed to advance from the current level to the next.
 */
export function xpForNextLevel(level: number): number {
  return totalXpForLevel(level + 1) - totalXpForLevel(level);
}

/**
 * Experience gained for defeating a single enemy.
 *
 * The reward is based on the enemy's level and sharply penalizes
 * fights against weaker foes. When fighting higher level enemies the
 * reward scales up by 50% per level difference. When fighting lower
 * level enemies the reward is multiplied by 0.2 for each level the
 * enemy is below the attacker, quickly tapering off to near-zero.
 */
export function experienceFromKill(attackerLevel: number, enemyLevel: number): number {
  const base = xpForNextLevel(enemyLevel) / 5; // 20% of their next-level requirement
  const diff = enemyLevel - attackerLevel;
  if (diff >= 0) {
    return Math.floor(base * (1 + diff * 0.5));
  }
  const penalty = Math.pow(0.2, Math.abs(diff));
  return Math.floor(base * penalty);
}

/**
 * Compute XP gain for each member of a party when a single enemy is
 * defeated. Returns a mapping from member id to the XP gained and the
 * amount needed for their next level.
 */
export function encounterExperience(party: Party, enemyLevel: number): Record<string, { gained: number; nextLevel: number; }> {
  const result: Record<string, { gained: number; nextLevel: number; }> = {};
  for (const m of party.members) {
    const gained = experienceFromKill(m.level, enemyLevel);
    result[m.id] = {
      gained,
      nextLevel: xpForNextLevel(m.level)
    };
  }
  return result;
}

