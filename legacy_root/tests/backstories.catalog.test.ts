import { describe, expect, it } from "vitest";
import { BACKSTORIES } from "../data/game/backstories.js";

const FORBIDDEN_KEYS = new Set(["jobid", "job_id", "jobs", "classes"]);

const findForbiddenKeys = (value: unknown, path = ""): string[] => {
  const violations: string[] = [];
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      violations.push(...findForbiddenKeys(entry, `${path}[${index}]`));
    });
    return violations;
  }
  if (value && typeof value === "object") {
    for (const [rawKey, entry] of Object.entries(value)) {
      const key = rawKey.toLowerCase();
      const nextPath = path ? `${path}.${rawKey}` : rawKey;
      if (FORBIDDEN_KEYS.has(key)) {
        violations.push(nextPath);
      }
      violations.push(...findForbiddenKeys(entry, nextPath));
    }
  }
  return violations;
};

describe("backstory catalog integrity", () => {
  it("avoids embedded job definitions or legacy job keys", () => {
    for (const backstory of BACKSTORIES) {
      const violations = findForbiddenKeys(backstory);
      expect(violations, `Forbidden keys in ${backstory.id}: ${violations.join(", ")}`).toHaveLength(
        0
      );
    }
  });
});
