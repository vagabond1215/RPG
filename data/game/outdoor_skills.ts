// outdoor_skills.ts — activity based progression for swimming, sailing and horseback riding

import { proficiencyCap } from "./proficiency_base.js";

const r2 = (x: number) => Math.round(x * 100) / 100;

export interface ActivityGainInput {
  P: number;       // current proficiency
  cap: number;     // proficiency cap
  duration: number; // time spent in minutes
  difficulty?: number; // 0.5 easy, 1 normal, >1 hard
}

function gainActivity(base: number, input: ActivityGainInput): number {
  const { P, cap, duration, difficulty = 1 } = input;
  const capGap = cap > 0 ? Math.pow((cap - P) / cap, 0.8) : 0;
  const raw = base * duration * difficulty * capGap;
  const next = Math.min(cap, P + raw);
  return r2(next);
}

export const gainSwimming = (input: ActivityGainInput): number =>
  gainActivity(0.06, input); // steady improvement through time in water

export const gainSailing = (input: ActivityGainInput): number =>
  gainActivity(0.05, input); // progress at the helm or managing sails

export const gainRiding = (input: ActivityGainInput): number =>
  gainActivity(0.055, input); // horseback riding progression

export const OUTDOOR_GAIN_FUNCTIONS = {
  swimming: gainSwimming,
  sailing: gainSailing,
  riding: gainRiding,
};

export interface OutdoorActivityOpts {
  duration: number;
  difficulty?: number;
}

export function performOutdoorActivity(
  character: { level: number; [k: string]: number },
  skillKey: keyof typeof OUTDOOR_GAIN_FUNCTIONS,
  opts: OutdoorActivityOpts
): number {
  const fn = OUTDOOR_GAIN_FUNCTIONS[skillKey];
  if (!fn) return character[skillKey] || 0;
  const current = character[skillKey] || 0;
  const cap = proficiencyCap(character.level);
  character[skillKey] = fn({ P: current, cap, ...opts });
  return character[skillKey];
}
