export function migrateCharacter(
  character,
  { schemaVersion = 2 } = {}
) {
  if (!character || typeof character !== "object") return character;
  character.schemaVersion = schemaVersion;
  return character;
}

export function migrateDraft(
  draft,
  { draftVersion = 3 } = {}
) {
  if (!draft || typeof draft !== "object") return draft;
  draft.draftVersion = draftVersion;
  return draft;
}
