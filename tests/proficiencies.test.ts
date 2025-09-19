import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  matchProficienciesInText,
  findProficiencyByLabel,
  findProficienciesByKey,
  getProficiencyByKind,
} from "../data/game/proficiencies.js";
import { LOCATIONS } from "../data/game/locations.js";
import { WAVES_BREAK_BACKSTORIES } from "../data/game/waves_break_backstories.ts";
import { CREEKSIDE_BACKSTORIES } from "../data/game/creekside_backstories.ts";
import { DRAGONS_REACH_ROAD_BACKSTORIES } from "../data/game/dragons_reach_road_backstories.ts";
import { CORNER_STONE_BACKSTORIES } from "../data/game/corner_stone_backstories.ts";
import { CORAL_KEEP_BACKSTORIES } from "../data/game/coral_keep_backstories.ts";
import { CORONA_BACKSTORIES } from "../data/game/corona_backstories.ts";
import { DANCING_PINES_BACKSTORIES } from "../data/game/dancing_pines_backstories.ts";
import { MOUNTAIN_TOP_BACKSTORIES } from "../data/game/mountain_top_backstories.ts";
import { TIMBER_GROVE_BACKSTORIES } from "../data/game/timber_grove_backstories.ts";
import { WARM_SPRINGS_BACKSTORIES } from "../data/game/warm_springs_backstories.ts";
import { WHITEHEART_BACKSTORIES } from "../data/game/whiteheart_backstories.ts";

describe("proficiency registry", () => {
  it("extracts herbalism from mixed requirement strings", () => {
    const matches = matchProficienciesInText("Herbalism proficiency 24+ or Alchemy 20+");
    const herbalism = matches.find((m) => m.id === "gathering.herbalism");
    expect(herbalism).toBeDefined();
    expect(herbalism?.minimum).toBe(24);
  });

  it("finds proficiencies for every quest requirement that references skills", () => {
    const unmatched: { location: string; quest: string; requirement: string }[] = [];

    for (const location of Object.values(LOCATIONS)) {
      for (const quest of location.quests ?? []) {
        for (const raw of quest.requirements ?? []) {
          if (typeof raw !== "string") continue;
          if (!/(proficiency|magic)/i.test(raw)) continue;
          const matches = matchProficienciesInText(raw);
          if (matches.length === 0) {
            unmatched.push({ location: location.name, quest: quest.title, requirement: raw });
          }
        }
      }
    }

    expect(unmatched).toEqual([]);
  });

  it("resolves representative skill keywords to registered proficiencies", () => {
    const samples: { text: string; expected: string[] }[] = [
      {
        text: "Brewer's or Vintner's Tools proficiency 30+",
        expected: ["crafting.brewing", "crafting.vintnersTools"],
      },
      {
        text: "Animal Handling (Bees) proficiency 25+",
        expected: ["animalHandling.bees"],
      },
      {
        text: "Perception 22+ and proficiency with light armor or defensive magic",
        expected: ["armor.lightArmor", "magic.defense"],
      },
      {
        text: "Martial weapon or Battle Magic proficiency 35+",
        expected: ["weapon.martial", "magic.battle"],
      },
      {
        text: "Rope Use or Climbing proficiency 30+",
        expected: ["tool.ropework", "outdoor.climbing"],
      },
      {
        text: "Arcana 26+ or Enchanting proficiency 24+",
        expected: ["knowledge.arcana", "crafting.enchanting"],
      },
      {
        text: "Signal Flags proficiency 25+ or Navigation 20+",
        expected: ["tool.signalFlags", "knowledge.navigation"],
      },
      {
        text: "Miller's Tools proficiency 35+ or Engineering 25+",
        expected: ["crafting.millerTools", "knowledge.engineering"],
      },
      {
        text: "Calligraphy proficiency 24+",
        expected: ["crafting.calligraphy"],
      },
      {
        text: "Sleight-of-Hand proficiency 20+",
        expected: ["knowledge.sleightOfHand"],
      },
      {
        text: "Cheesemaking proficiency 30+",
        expected: ["crafting.cheesemaking"],
      },
      {
        text: "Animal Handling (Birds) 20+ or Magic (Circle 1) for deterrent chants",
        expected: ["animalHandling.birds", "magic.arcane"],
      },
      {
        text: "Leadership 20+ and martial proficiency 24+",
        expected: ["knowledge.leadership", "weapon.martial"],
      },
      {
        text: "Perception 20+ and proficiency with nonlethal combat",
        expected: ["weapon.unarmed"],
      },
      {
        text: "Textiles (Net Weaving) proficiency 30+",
        expected: ["crafting.textiles"],
      },
      {
        text: "Water Ward Magic (Circle 1)",
        expected: ["magic.waterWard"],
      },
      {
        text: "Nature Magic (Circle 1)",
        expected: ["magic.nature"],
      },
      {
        text: "Light Magic (Circle 1)",
        expected: ["magic.light"],
      },
      {
        text: "Divine Magic proficiency",
        expected: ["magic.divine"],
      },
    ];

    for (const { text, expected } of samples) {
      const matches = matchProficienciesInText(text);
      for (const id of expected) {
        expect(matches.some((m) => m.id === id)).toBe(true);
      }
    }
  });

  it("maps backstory craft proficiencies to registered entries", () => {
    const allBackstories = [
      ...WAVES_BREAK_BACKSTORIES,
      ...CREEKSIDE_BACKSTORIES,
      ...DRAGONS_REACH_ROAD_BACKSTORIES,
      ...CORNER_STONE_BACKSTORIES,
      ...CORAL_KEEP_BACKSTORIES,
      ...CORONA_BACKSTORIES,
      ...DANCING_PINES_BACKSTORIES,
      ...MOUNTAIN_TOP_BACKSTORIES,
      ...TIMBER_GROVE_BACKSTORIES,
      ...WARM_SPRINGS_BACKSTORIES,
      ...WHITEHEART_BACKSTORIES,
    ];

    const missing: { background: string; key: string }[] = [];

    for (const backstory of allBackstories) {
      const craftProfs = backstory.craftProficiencies;
      if (!craftProfs) continue;
      for (const rawKey of Object.keys(craftProfs)) {
        const keyMatches = findProficienciesByKey(rawKey);
        const labelMatch = findProficiencyByLabel(rawKey);
        const uniqueIds = new Set<string>();
        if (labelMatch) uniqueIds.add(labelMatch.id);
        for (const def of keyMatches) uniqueIds.add(def.id);
        if (uniqueIds.size === 0) {
          missing.push({
            key: rawKey,
            background: backstory.background ?? backstory.name ?? backstory.district ?? "unknown",
          });
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it("exposes every ProficiencyKind through the registry", () => {
    const partyPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../data/game/party.ts",
    );
    const contents = readFileSync(partyPath, "utf8");
    const match = contents.match(/export type ProficiencyKind =([^;]+);/m);
    expect(match).toBeTruthy();
    const kinds = [...match![1].matchAll(/"([^"]+)"|'([^']+)'/g)].map((m) => m[1] ?? m[2]);
    const missing = kinds.filter((kind) => !getProficiencyByKind(kind as any));
    expect(missing).toEqual([]);
  });
});

