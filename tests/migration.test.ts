import { describe, expect, it } from "vitest";
import {
  DEFAULT_JOB_ID,
  LEGACY_JOB_ID_MAP,
  migrateCharacter,
  migrateDraft,
  resolveLegacyJobId,
} from "../src/character_migration.js";

const silentWarn = () => {};

describe("legacy jobId migration", () => {
  it("maps legacy backstory labels to job ids", () => {
    const resolved = resolveLegacyJobId("Amnesiac ward", { legacyJobIdMap: LEGACY_JOB_ID_MAP });
    expect(resolved).toBe("amnesiac-ward");
  });

  it("falls back to safe defaults for unknown job ids", () => {
    const character = { jobId: "unknown job", schemaVersion: 0 };
    const migrated = migrateCharacter(character, { isDevBuild: false, warn: silentWarn });
    expect(migrated.jobId).toBe(DEFAULT_JOB_ID);
    expect(migrated.schemaVersion).toBe(1);
  });

  it("migrates draft job ids into chosenJobId", () => {
    const draft = { jobId: "Amnesiac Ward" };
    const migrated = migrateDraft(draft, { isDevBuild: false, warn: silentWarn });
    expect(migrated.chosenJobId).toBe("amnesiac-ward");
    expect(migrated.draftVersion).toBe(2);
  });
});
