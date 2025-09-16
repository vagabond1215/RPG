import { describe, it, expect } from "vitest";
import { applySpellProficiencyGain } from "../assets/data/spell_proficiency.js";

const BASE_PARAMS = { L: 1, A0: 1, A: 0, r: 1, rand: () => 0 } as const;

describe("summoning exclusivity", () => {
  it("does not grant summoning proficiency to non-summoner builds", () => {
    const character = {
      class: "Mage",
      advancedClass: "Wizard",
      summoning: 5,
      fire: 0,
    } as Record<string, any>;

    applySpellProficiencyGain(
      character,
      { element: "Fire", school: "Summoning" },
      { ...BASE_PARAMS }
    );

    expect(character.summoning).toBe(0);
  });

  it("allows summoner builds to gain summoning proficiency", () => {
    const character = {
      class: "Conjurer",
      advancedClass: "Summoner",
      summoning: 0,
      fire: 0,
    } as Record<string, any>;

    applySpellProficiencyGain(
      character,
      { element: "Fire", school: "Summoning" },
      { ...BASE_PARAMS }
    );

    expect(character.summoning).toBeGreaterThan(0);
  });
});
