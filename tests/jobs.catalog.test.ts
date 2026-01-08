import { describe, expect, it } from "vitest";
import { JOBS, JOB_BY_ID } from "../data/game/jobs.js";
import { BACKSTORIES } from "../data/game/backstories.js";

const JOB_ID_FORMAT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe("jobs catalog", () => {
  it("uses unique, slug-formatted job ids", () => {
    const ids = JOBS.map(job => job.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
    for (const id of ids) {
      expect(JOB_ID_FORMAT.test(id)).toBe(true);
    }
  });

  it("backs allowed/recommended job ids with catalog entries", () => {
    for (const backstory of BACKSTORIES) {
      const allowed = backstory.allowedJobIds ?? [];
      const recommended = backstory.recommendedJobIds ?? [];
      for (const id of [...allowed, ...recommended]) {
        expect(JOB_BY_ID[id]).toBeTruthy();
      }
    }
  });
});
