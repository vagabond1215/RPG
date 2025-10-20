import type { Party } from "./party";
import {
  totalXpForLevel as totalXpForLevelImpl,
  xpForNextLevel as xpForNextLevelImpl,
  experienceFromKill as experienceFromKillImpl,
  encounterExperience as encounterExperienceImpl,
} from "./experience.js";

export const totalXpForLevel = (level: number): number => totalXpForLevelImpl(level);

export const xpForNextLevel = (level: number): number => xpForNextLevelImpl(level);

export const experienceFromKill = (attackerLevel: number, enemyLevel: number): number =>
  experienceFromKillImpl(attackerLevel, enemyLevel);

export const encounterExperience = (
  party: Party,
  enemyLevel: number,
): Record<string, { gained: number; nextLevel: number; }> => encounterExperienceImpl(party, enemyLevel);

