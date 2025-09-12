import { readFileSync } from "fs";
import Ajv from "ajv";
import { describe, it, expect } from "vitest";

const schema = JSON.parse(readFileSync("schemas/plant.schema.json", "utf-8"));
const data = JSON.parse(readFileSync("data/plants.json", "utf-8"));

const ajv = new Ajv();
const validate = ajv.compile(schema);

describe("plants schema", () => {
  it("validates plants.json", () => {
    for (const item of data) {
      const valid = validate(item);
      if (!valid) console.error(validate.errors);
      expect(valid).toBe(true);
    }
  });
});
