// build_progression.ts — foundational build progression database

import type { ProfBlock } from "./party.ts";

/** A passive enhancement granted by race or class. */
export interface Trait {
  name: string;
  description: string;
}

/**
 * A class-specific action that affects characters or foes for the
 * ability's duration.
 */
export interface Ability {
  name: string;
  description: string;
  /** optional duration in seconds */
  durationSec?: number;
}

/**
 * Equipment-based capability unlocked at certain proficiency thresholds.
 */
export interface Skill {
  name: string;
  proficiency: string; // e.g., "Weapon_Sword"
  benchmarks: number[]; // proficiency milestones where the skill unlocks
  description: string;
}

/** Progression information for a single level. */
export interface ProgressionStep {
  level: number;
  traits?: string[];
  abilities?: string[];
  skills?: string[];
  magic?: string[];
}

/**
 * Build progression for a class line. Additional builds can extend this
 * structure over time.
 */
export interface BuildProgression {
  name: string;
  steps: ProgressionStep[];
}

// ---- Mastery Series ----

export interface MasteryTier {
  rank: number;    // 1-10
  bonus: number;   // flat bonus applied to proficiency and cap
}

/** Mastery tiers grant +2 to a proficiency's value and cap after base calc. */
export const MASTERY_SERIES: MasteryTier[] = Array.from({ length: 10 }, (_, i) => ({
  rank: i + 1,
  bonus: 2,
}));

/**
 * Apply mastery after normal proficiency calculations.
 *
 * @param block - The proficiency block after base gain/cap resolution.
 * @param masteryRank - Tier of mastery (0-10). Values outside range are clamped.
 */
export function applyMastery(block: ProfBlock, masteryRank = 0): ProfBlock {
  const rank = Math.min(Math.max(masteryRank, 0), 10);
  const bonus = rank * 2;
  return {
    value: block.value + bonus,
    cap: block.cap + bonus,
    thresholds: block.thresholds,
  };
}

// ---- Sample progression entry ----

export const buildProgressions: Record<string, BuildProgression> = {
  Knight: {
    name: "Knight",
    steps: [
      {
        level: 1,
        traits: ["Defensive Stance"],
        abilities: ["Shield Block"],
        skills: ["Sword Mastery I"],
      },
      {
        level: 2,
        traits: ["Toughness I"],
        abilities: ["Guard"],
        skills: ["Heavy Armor Training"],
      },
      {
        level: 3,
        traits: [],
        abilities: ["Shield Bash"],
        skills: ["Weapon Specialization: Longsword"],
      },
      // Additional levels will be filled in over time.
    ],
  },
};

