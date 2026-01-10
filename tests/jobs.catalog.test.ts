import { describe, expect, it } from "vitest";
import { JOBS } from "../data/game/jobs.js";

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
});
