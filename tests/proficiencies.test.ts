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
import { BACKSTORIES, BACKSTORY_BY_ID } from "../data/game/backstories.js";
import { BACKSTORY_IDS_BY_LOCATION } from "../data/game/backstory_ids_by_location.js";
import { JOBS } from "../data/game/jobs.js";

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
        text: "Angling proficiency 24+ or Pearl Diving 20+",
        expected: ["gathering.fishing", "gathering.pearlDiving"],
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
      {
        text: "First Aid proficiency 18+",
        expected: ["knowledge.fieldMedicine"],
      },
      {
        text: "Stealth proficiency 20+ or Sleight of Hand 18+",
        expected: ["knowledge.stealth", "knowledge.sleightOfHand"],
      },
      {
        text: "Snaring proficiency 22+",
        expected: ["outdoor.trapping"],
      },
    ];

    for (const { text, expected } of samples) {
      const matches = matchProficienciesInText(text);
      for (const id of expected) {
        expect(matches.some((m) => m.id === id)).toBe(true);
      }
    }
  });

  it("maps job crafting and gathering proficiencies to registered entries", () => {
    const missing: { id: string; key: string }[] = [];

    for (const job of JOBS) {
      const loadout = job.loadout || {};
      const tables = [
        loadout.craftProficiencies || {},
        loadout.gatheringProficiencies || {},
      ];
      for (const table of tables) {
        for (const rawKey of Object.keys(table)) {
          const keyMatches = findProficienciesByKey(rawKey);
          const labelMatch = findProficiencyByLabel(rawKey);
          const uniqueIds = new Set<string>();
          if (labelMatch) uniqueIds.add(labelMatch.id);
          for (const def of keyMatches) uniqueIds.add(def.id);
          if (uniqueIds.size === 0) {
            missing.push({ id: job.id, key: rawKey });
          }
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it("exposes valid backstories for every settlement", () => {
    const invalid: { location: string; id: string }[] = [];
    for (const [location, ids] of Object.entries(BACKSTORY_IDS_BY_LOCATION)) {
      for (const id of ids) {
        if (!BACKSTORY_BY_ID[id]) {
          invalid.push({ location, id });
        }
      }
    }
    expect(invalid).toEqual([]);
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
