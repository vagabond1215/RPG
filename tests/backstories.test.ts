import { describe, it, expect } from "vitest";
import { characterTemplate } from "../data/game/core.js";
import { createEmptyCurrency } from "../data/economy/currency.js";
import {
  BACKSTORY_BY_ID,
  parseCurrency,
  renderBackstoryString,
} from "../data/game/backstories.js";
import { BACKSTORY_IDS_BY_LOCATION } from "../data/game/backstory_ids_by_location.js";
import {
  applyBackstoryLoadout,
  ensureBackstoryInstance,
  getBackstoriesForLocation,
} from "../src/backstory_helpers.js";
import { composeImagePrompt } from "../data/game/image_prompts.js";

describe("backstory helpers", () => {
  it("substitutes race and pronoun placeholders", () => {
    const template = "${pronoun.subject} guards the ${race} archives with ${pronoun.possessive} oath.";
    const rendered = renderBackstoryString(template, { race: "Elf", sex: "Female" });
    expect(rendered).toContain("she guards");
    expect(rendered).toContain("her oath");
    expect(rendered).toContain("Elf archives");
  });

  it("parses simple currency expressions", () => {
    const parsed = parseCurrency("7 gp 15 sp 22 cp");
    expect(parsed.gold).toBe(7);
    expect(parsed.silver).toBe(15);
    expect(parsed.copper).toBe(22);
  });

  it("applies a backstory loadout with reset semantics", () => {
    const backstory = BACKSTORY_BY_ID["apprentice-alchemist"];
    if (!backstory) throw new Error("missing test backstory");
    const character = JSON.parse(JSON.stringify(characterTemplate));
    character.race = "Human";
    character.sex = "Female";
    character.inventory = [];
    character.money = createEmptyCurrency();

    applyBackstoryLoadout(character, backstory, { reset: true });

    expect(character.level).toBe(1);
    expect(character.xp).toBe(0);
    expect(character.backstoryId).toBe("apprentice-alchemist");
    expect(character.inventory).toEqual(backstory.loadout.items);
    expect(character.startingSkills).toEqual(backstory.loadout.skills);
    expect(character.money.silver).toBe(backstory.loadout.currency.silver);

    character.inventory.push("existing charm");
    applyBackstoryLoadout(character, backstory);
    expect(character.inventory.filter(item => item === "existing charm")).toHaveLength(1);
    expect(character.inventory.filter(item => item === "stained gloves")).toHaveLength(1);
  });

  it("migrates legacy background strings", () => {
    const character = {
      ...JSON.parse(JSON.stringify(characterTemplate)),
      backstory: "Apprentice alchemist",
      race: "Elf",
      sex: "Female",
    };
    ensureBackstoryInstance(character);
    expect(character.backstoryId).toBe("apprentice-alchemist");
    expect(character.backstory?.motivation?.some(line => line.includes("herself"))).toBe(true);
  });

  it("returns backstories for a given location", () => {
    const location = "Wave's Break";
    const results = getBackstoriesForLocation(location, BACKSTORY_IDS_BY_LOCATION);
    expect(results.length).toBeGreaterThan(0);
    for (const entry of results) {
      expect(entry.locations).toContain(location);
    }
  });

  it("injects appearance details into image prompts", () => {
    const prompt = composeImagePrompt(
      {
        sex: "Female",
        race: "Elf",
        theme: "Knight / Paladin",
        hairColor: "black",
        skinColor: "pale",
        eyeColor: "green",
        useAltColors: false,
      },
      {
        summary: "A ceremonial tabard with silver embroidery.",
        details: ["tabard", "chain belt"],
        motifs: ["silver filigree", "holy sigil"],
      }
    );
    expect(prompt).toMatch(/Wardrobe highlights: tabard, chain belt\./);
    expect(prompt).toMatch(/Subtle motifs referencing silver filigree, holy sigil\./);
    expect(prompt).toMatch(/ceremonial tabard with silver embroidery/i);
  });
});
