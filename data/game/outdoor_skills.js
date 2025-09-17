// outdoor_skills.ts — activity based progression for swimming, sailing and horseback riding
import { proficiencyCap } from "./proficiency_base.js";
const r2 = (x) => Math.round(x * 100) / 100;
function gainActivity(base, input) {
    const { P, cap, duration, difficulty = 1 } = input;
    const capGap = cap > 0 ? Math.pow((cap - P) / cap, 0.8) : 0;
    const raw = base * duration * difficulty * capGap;
    const next = Math.min(cap, P + raw);
    return r2(next);
}
export const gainSwimming = (input) => gainActivity(0.06, input); // steady improvement through time in water
export const gainSailing = (input) => gainActivity(0.05, input); // progress at the helm or managing sails
export const gainRiding = (input) => gainActivity(0.055, input); // horseback riding progression

export const OUTDOOR_GAIN_FUNCTIONS = {
    swimming: gainSwimming,
    sailing: gainSailing,
    riding: gainRiding,
};

export function performOutdoorActivity(character, skillKey, opts) {
    const fn = OUTDOOR_GAIN_FUNCTIONS[skillKey];
    if (!fn)
        return character[skillKey] || 0;
    const current = character[skillKey] || 0;
    const cap = proficiencyCap(character.level);
    character[skillKey] = fn({ P: current, cap, ...opts });
    return character[skillKey];
}
