import { describe, it, expect } from "vitest";
import { characterTemplate } from "../data/game/core.js";
import {
  BACKSTORY_BY_ID,
  parseCurrency,
  renderBackstoryString,
} from "../data/game/backstories.js";
import {
  applyBackstoryLoadout,
  ensureBackstoryInstance,
  getBackstoriesForLocation,
  buildBackstoryInstance,
} from "../src/backstory_helpers.js";
import { composeImagePrompt } from "../data/game/image_prompts.js";

describe("backstory helpers", () => {
  it("substitutes character metadata placeholders", () => {
    const template =
      "{characterName} carried a {race} banner for the {classLower} while stationed in {spawnDistrict}. {shortName} kept a {voiceTone} cadence beside {signatureTool}. {raceDescription} Alignment: {alignment}. {alignmentMemory} {emberHook}";
    const rendered = renderBackstoryString(template, {
      characterName: "Elira",
      race: "Elf",
      class: "Mage",
      sex: "Female",
      spawnDistrict: "Amberlight Annex",
      raceDescription: "Elira catalogued moonlit vellums.",
      alignment: "Lawful Neutral",
      classAlignmentInsert: "Elira balanced curiosity with caution.",
      classLower: "mage",
      shortName: "Elira",
      voiceTone: "measured",
      signatureTool: "vellum folio",
      alignmentMemory: "Elira audited ledgers in secret.",
      emberHook: "Rumor lingered around a ledger."
    });
    expect(rendered).toContain("Elira carried a Elf banner");
    expect(rendered).toContain("mage");
    expect(rendered).toContain("Amberlight Annex");
    expect(rendered).toContain("Elira catalogued moonlit vellums.");
    expect(rendered).toContain("Lawful Neutral");
    expect(rendered).toContain("Elira audited ledgers in secret.");
    expect(rendered).toContain("Rumor lingered around a ledger.");
  });

  it("parses simple currency expressions", () => {
    const parsed = parseCurrency("7 gp 15 sp 22 cp");
    expect(parsed.gold).toBe(7);
    expect(parsed.silver).toBe(15);
    expect(parsed.copper).toBe(22);
  });

  it("applies a backstory, selecting a spawn district and rendering biography paragraphs", () => {
    const backstory = BACKSTORY_BY_ID["backstory_waves_break_tideward_1"];
    if (!backstory) throw new Error("missing test backstory");
    const character = {
      ...JSON.parse(JSON.stringify(characterTemplate)),
      name: "Marin",
      race: "Human",
      class: "Fighter",
      alignment: "Neutral Good",
      sex: "Female",
      location: "Wave's Break",
      voiceTone: "steady",
      signatureTool: "harbor shield",
      virtue: "resolve",
      flaw: "stubbornness",
      bond: "dockworkers",
      secret: "an uncashed letter",
      backstorySeed: "a tidewall ledger",
    };

    const originalRandom = Math.random;
    Math.random = () => 0.4;
    try {
      applyBackstoryLoadout(character, backstory);
    } finally {
      Math.random = originalRandom;
    }

    expect(character.backstoryId).toBe("backstory_waves_break_tideward_1");
    expect(character.backstory?.biographyParagraphs?.length).toBe(4);
    expect(character.backstory?.biographyParagraphs?.[0]).toContain("Marin");
    expect(character.spawnDistrict).toBe("Greensoul Hill");
    expect(character.backstory?.spawnDistrict).toBe("Greensoul Hill");
    expect(character.backstory?.biography).toContain("Greensoul Hill");
    expect(character.backstory?.raceDescription).toBeTruthy();
    expect(character.backstory?.classAlignmentInsert).toBeTruthy();
    expect(character.backstory?.alignmentMemory).toMatch(/Marin/);
    expect(character.backstory?.classAngleSummary).toMatch(/treated/);
    expect(character.backstory?.biography).not.toContain("{pronoun.");
  });

  it("ensures an instance can be rebuilt from an id", () => {
    const character = {
      ...JSON.parse(JSON.stringify(characterTemplate)),
      name: "Sariel",
      race: "Elf",
      class: "Mage",
      alignment: "Lawful Neutral",
      backstoryId: "backstory_coral_keep_athenaeum_1",
      sex: "Female",
      location: "Coral Keep",
      spawnDistrict: "The South Docks & Steel Docks",
    };
    ensureBackstoryInstance(character);
    expect(character.backstoryId).toBe("backstory_coral_keep_athenaeum_1");
    expect(character.backstory?.biography).toMatch(/Coral Keep/);
    expect(character.backstory?.spawnDistrict).toBe("The South Docks & Steel Docks");
  });

  it("returns backstories filtered by criteria with fallback", () => {
    const strictMatches = getBackstoriesForLocation("Wave's Break", {
      race: "Human",
      className: "Fighter",
      alignment: "Neutral Good",
      spawnDistrict: "Harbor Ward",
    });
    expect(strictMatches.length).toBeGreaterThan(0);
    expect(strictMatches[0].id).toBe("backstory_waves_break_tideward_1");

    const fallbackMatches = getBackstoriesForLocation("Wave's Break", {
      race: "Gnome",
      className: "Mage",
      alignment: "Lawful Evil",
    });
    expect(fallbackMatches.length).toBeGreaterThan(0);
    expect(fallbackMatches.some(entry => entry.id === "backstory_waves_break_tideward_1")).toBe(true);
  });

  it("returns a placeholder when required inputs are missing", () => {
    const backstory = BACKSTORY_BY_ID["backstory_coral_keep_athenaeum_1"];
    if (!backstory) throw new Error("missing test backstory");
    const partialCharacter = {
      name: "Serel",
      race: "Dark Elf",
      class: "Mage",
      alignment: "Neutral Good",
      sex: "Male",
      location: "Coral Keep",
    };
    const instance = buildBackstoryInstance(backstory, partialCharacter);
    expect(instance?.biographyParagraphs).toEqual([
      "Backstory locked: select race, sex, class, alignment, origin location, and district to reveal a tailored biography.",
    ]);
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
