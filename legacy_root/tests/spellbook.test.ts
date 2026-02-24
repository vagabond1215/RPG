import { describe, it, expect } from "vitest";
import { SPELLBOOK } from "../data/game/spells.js";
import { elementalProficiencyMap, schoolProficiencyMap } from "../data/game/spell_proficiency.js";

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
