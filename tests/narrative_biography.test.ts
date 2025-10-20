import { describe, it, expect } from "vitest";
import { generateNarrativeBiography } from "../src/narrative_biography.js";

describe("generateNarrativeBiography", () => {
  it("creates a multi-paragraph biography that references local color", () => {
    const result = generateNarrativeBiography({
      name: "Ysoria Tidewatch",
      race: "Human",
      gender: "Female",
      class: "Ninja",
      alignment: "True Neutral",
      locationOrigin: "Wave's Break",
      spawnDistrict: "Port District",
      background: "a courier's trade",
    });

    expect(result.header).toBe("Ysoria Tidewatch");
    expect(result.paragraphs.length).toBe(4);
    expect(result.summaryHook).toMatch(/ninja from Wave's Break/i);
    result.paragraphs.forEach(paragraph => {
      expect(paragraph).toMatch(/[A-Za-z]/);
    });
    expect(result.biography).not.toContain("True Neutral");
    expect(result.biography).toMatch(/Wave's Break/);
    expect(result.biography).toMatch(/Port District/);
    expect(result.biography).toMatch(/Harborwatch Trading House/);
    expect(result.paragraphs[2]).toMatch(/tide table/i);
  });

  it("builds alignment-driven hooks without naming the alignment", () => {
    const result = generateNarrativeBiography({
      name: "Selk Corvin",
      race: "Elf",
      gender: "Male",
      class: "Fighter",
      alignment: "Chaotic Good",
      locationOrigin: "Coral Keep",
    });

    expect(result.biography).not.toContain("Chaotic Good");
    expect(result.summaryHook).toMatch(/rule-breaking savior/i);
    expect(result.paragraphs[2]).toMatch(/curfew/i);
  });
});
