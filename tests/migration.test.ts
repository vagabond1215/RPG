import { describe, expect, it } from "vitest";
import { migrateCharacter, migrateDraft } from "../src/character_migration.js";

describe("character migration", () => {
  it("stamps the current schema version without altering other fields", () => {
    const character = { jobId: "unknown job", schemaVersion: 0 };
    const migrated = migrateCharacter(character, { schemaVersion: 2 });
    expect(migrated.jobId).toBe("unknown job");
    expect(migrated.schemaVersion).toBe(2);
  });

  it("stamps the current draft version without altering other fields", () => {
    const draft = { jobId: "Amnesiac Ward", draftVersion: 0 };
    const migrated = migrateDraft(draft, { draftVersion: 3 });
    expect(migrated.jobId).toBe("Amnesiac Ward");
    expect(migrated.draftVersion).toBe(3);
  });
});
