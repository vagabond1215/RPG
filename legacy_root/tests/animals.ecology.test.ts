import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";

const data = JSON.parse(readFileSync("data/animals.json", "utf-8"));

const nonTerrestrialBirdIds = ["albatross"];
const nonTerrestrialMammalIds = [
  "aleutian_kelp_otter",
  "amazon_river_dolphin",
  "baikal_seal_colony",
  "baltic_gray_seal",
  "beaufort_ringed_seal",
  "blue-whale",
  "dolphin",
  "haida_gwaii_humpback",
  "patagonian_fur_seal_rookery",
  "seal",
  "whale",
];

const expectsNoForestTerrestrial = (item: {
  id: string;
  regions: string[];
  habitats: string[];
}) => {
  expect(item.regions, `${item.id} should not be terrestrial`).not.toContain(
    "terrestrial",
  );
  expect(item.habitats, `${item.id} should not be forest`).not.toContain(
    "forest",
  );
};

describe("animals ecology lint", () => {
  it("flags non-terrestrial taxa with forest/terrestrial defaults", () => {
    for (const item of data) {
      if (item.taxon_group === "fish") {
        expectsNoForestTerrestrial(item);
      }
    }

    for (const id of nonTerrestrialBirdIds) {
      const item = data.find((entry: { id: string }) => entry.id === id);
      expect(item, `${id} should exist in animals.json`).toBeTruthy();
      expectsNoForestTerrestrial(item);
    }

    for (const id of nonTerrestrialMammalIds) {
      const item = data.find((entry: { id: string }) => entry.id === id);
      expect(item, `${id} should exist in animals.json`).toBeTruthy();
      expectsNoForestTerrestrial(item);
    }
  });
});
