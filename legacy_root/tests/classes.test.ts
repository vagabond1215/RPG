import { describe, expect, it } from "vitest";
import { CLASSES } from "../data/game/classes.ts";

describe("classes", () => {
  it("uses unique class ids", () => {
    const ids = CLASSES.map(entry => entry.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("requires tier-2 classes to reference tier-1 parents", () => {
    const classById = new Map(CLASSES.map(entry => [entry.id, entry]));
    for (const entry of CLASSES) {
      if (entry.tier !== 2) continue;
      expect(entry.parentId).toBeTruthy();
      const parent = entry.parentId ? classById.get(entry.parentId) : undefined;
      expect(parent).toBeDefined();
      if (parent) {
        expect(parent.tier).toBe(1);
      }
    }
  });

  it("has no cycles in the class tree", () => {
    const classById = new Map(CLASSES.map(entry => [entry.id, entry]));
    const visiting = new Set<string>();
    const visited = new Set<string>();

    const visit = (id: string) => {
      if (visited.has(id)) return;
      if (visiting.has(id)) {
        throw new Error(`Cycle detected at ${id}`);
      }
      visiting.add(id);
      const parentId = classById.get(id)?.parentId;
      if (parentId) {
        visit(parentId);
      }
      visiting.delete(id);
      visited.add(id);
    };

    for (const entry of CLASSES) {
      visit(entry.id);
    }
  });
});
