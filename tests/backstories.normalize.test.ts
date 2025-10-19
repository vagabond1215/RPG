import { describe, expect, it } from "vitest";
import { BACKSTORIES, chooseBiographyBeatOption } from "../data/game/backstories.js";

describe("normalizeBiographyBeats", () => {
  it("preserves additional option metadata while normalizing tags", () => {
    const beat = [
      { text: "  First option  ", tags: ["alpha", " ", null], weight: 3 },
      { text: "Second option" },
    ];
    const contextTags = new Set(["alpha"]);
    const selected = chooseBiographyBeatOption(beat, contextTags);
    expect(selected).toMatchObject({
      text: "First option",
      tags: ["alpha"],
      weight: 3,
    });
  });

  it("coerces string beats into text objects for downstream rendering", () => {
    const beat = ["  Simple option  "];
    const selected = chooseBiographyBeatOption(beat);
    expect(selected).toEqual({ text: "Simple option" });
  });
});

describe("BACKSTORIES", () => {
  it("exposes hook metadata and beat option arrays", () => {
    const entry = BACKSTORIES.find(item => item.id === "backstory_waves_break_tideward_1");
    expect(entry?.hook).toBe("tidevault initiate");
    const beatOptions = entry?.biographyBeats?.earlyLife;
    expect(Array.isArray(beatOptions)).toBe(true);
    expect(beatOptions?.[0]).toHaveProperty("text");
  });
});
