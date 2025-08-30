// outdoor_skills.ts — activity based progression for swimming, sailing and horseback riding
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
