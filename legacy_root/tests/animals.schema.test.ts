import { readFileSync } from "fs";
import Ajv from "ajv";
import { describe, it, expect } from "vitest";

const schema = JSON.parse(readFileSync("schemas/animal.schema.json", "utf-8"));
const data = JSON.parse(readFileSync("data/animals.json", "utf-8"));

const ajv = new Ajv();
const validate = ajv.compile(schema);

describe("animals schema", () => {
  it("validates animals.json", () => {
    for (const item of data) {
      const valid = validate(item);
      if (!valid) console.error(validate.errors);
      expect(valid).toBe(true);
    }
  });
});
