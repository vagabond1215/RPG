import { describe, it, expect } from "vitest";
import { SPELLBOOK } from "../assets/data/spells.js";
import { elementalProficiencyMap, schoolProficiencyMap } from "../assets/data/spell_proficiency.js";

const ELEMENTS = [
  "Fire",
  "Ice",
  "Lightning",
  "Water",
  "Wind",
  "Stone",
  "Light",
  "Dark",
] as const;

const SCHOOLS = [
  "Destruction",
  "Enhancement",
  "Enfeeblement",
  "Control",
  "Healing",
] as const;

function unlockedSpells(character: Record<string, number>) {
  const unlocked = [] as typeof SPELLBOOK;
  for (const spell of SPELLBOOK) {
    const schoolKey = schoolProficiencyMap[spell.school];
    const schoolValue = character[schoolKey] ?? 0;
    const profKey = elementalProficiencyMap[spell.element.toLowerCase()];
    const elemValue = character[profKey] ?? 0;
    const req = Math.max(spell.proficiency, 1);
    if (elemValue >= req && schoolValue >= req) {
      unlocked.push(spell);
    }
  }
  return unlocked;
}

describe("spell unlocks", () => {
  it("provides a proficiency 1 spell for every element and school combination", () => {
    for (const element of ELEMENTS) {
      for (const school of SCHOOLS) {
        const match = SPELLBOOK.find(
          spell => spell.element === element && spell.school === school && spell.proficiency === 1,
        );
        expect(match).toBeTruthy();
      }
    }
  });

  it("excludes default spells when both proficiencies are zero", () => {
    const character: Record<string, number> = {};
    expect(unlockedSpells(character).length).toBe(0);
  });

  it("requires non-zero proficiency in both element and school", () => {
    const character = { fire: 20, destruction: 0 } as Record<string, number>;
    expect(unlockedSpells(character).length).toBe(0);
  });

  it("includes default spells once both proficiencies are above zero", () => {
    const target = SPELLBOOK.find(
      s => s.element === "Fire" && s.school === "Healing"
    );
    expect(target).toBeTruthy();
    const req = target?.proficiency ?? 0;
    const character = { fire: req, healing: req } as Record<string, number>;
    const spells = unlockedSpells(character).filter(s => s.id === target?.id);
    expect(spells).toHaveLength(1);
  });
});
