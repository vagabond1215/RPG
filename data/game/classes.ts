export type ClassTier = 1 | 2;

export interface ClassDefinition {
  id: string;
  name: string;
  tier: ClassTier;
  parentId?: string;
  description?: string;
}

export const CLASSES = [
  { id: "knight", name: "Knight", tier: 1 },
  { id: "fighter", name: "Fighter", tier: 1 },
  { id: "barbarian", name: "Barbarian", tier: 1 },
  { id: "ronin", name: "Ronin", tier: 1 },
  { id: "raider", name: "Raider", tier: 1 },
  { id: "pirate", name: "Pirate", tier: 1 },
  { id: "scout", name: "Scout", tier: 1 },
  { id: "archer", name: "Archer", tier: 1 },
  { id: "musketeer", name: "Musketeer", tier: 1 },
  { id: "ninja", name: "Ninja", tier: 1 },
  { id: "martial_artist", name: "Martial Artist", tier: 1 },
  { id: "swashbuckler", name: "Swashbuckler", tier: 1 },
  { id: "mage", name: "Mage", tier: 1 },
  { id: "sorcerer", name: "Sorcerer", tier: 1 },
  { id: "acolyte", name: "Acolyte", tier: 1 },
  { id: "druid", name: "Druid", tier: 1 },
  { id: "necromancer", name: "Necromancer", tier: 1 },
  { id: "minstrel", name: "Minstrel", tier: 1 },
  { id: "performer", name: "Performer", tier: 1 },
  { id: "engineer", name: "Engineer", tier: 1 },
  { id: "tamer", name: "Tamer", tier: 1 },
  { id: "conjurer", name: "Conjurer", tier: 1 },
  { id: "templar", name: "Templar", tier: 1 },
  { id: "dark_knight", name: "Dark Knight", tier: 1 },
  { id: "paladin", name: "Paladin", tier: 2, parentId: "knight" },
  { id: "warrior", name: "Warrior", tier: 2, parentId: "fighter" },
  { id: "berserker", name: "Berserker", tier: 2, parentId: "barbarian" },
  { id: "samurai", name: "Samurai", tier: 2, parentId: "ronin" },
  { id: "viking", name: "Viking", tier: 2, parentId: "raider" },
  { id: "corsair", name: "Corsair", tier: 2, parentId: "pirate" },
  { id: "ranger", name: "Ranger", tier: 2, parentId: "scout" },
  { id: "marksman", name: "Marksman", tier: 2, parentId: "archer" },
  { id: "gunslinger", name: "Gunslinger", tier: 2, parentId: "musketeer" },
  { id: "assassin", name: "Assassin", tier: 2, parentId: "ninja" },
  { id: "monk", name: "Monk", tier: 2, parentId: "martial_artist" },
  { id: "duelist", name: "Duelist", tier: 2, parentId: "swashbuckler" },
  { id: "wizard", name: "Wizard", tier: 2, parentId: "mage" },
  { id: "sage", name: "Sage", tier: 2, parentId: "sorcerer" },
  { id: "priest", name: "Priest", tier: 2, parentId: "acolyte" },
  { id: "shaman", name: "Shaman", tier: 2, parentId: "druid" },
  { id: "death_mage", name: "Death Mage", tier: 2, parentId: "necromancer" },
  { id: "bard", name: "Bard", tier: 2, parentId: "minstrel" },
  { id: "dancer", name: "Dancer", tier: 2, parentId: "performer" },
  { id: "alchemist", name: "Alchemist", tier: 2, parentId: "engineer" },
  { id: "beastmaster", name: "Beastmaster", tier: 2, parentId: "tamer" },
  { id: "summoner", name: "Summoner", tier: 2, parentId: "conjurer" },
  { id: "inquisitor", name: "Inquisitor", tier: 2, parentId: "templar" },
  { id: "death_knight", name: "Death Knight", tier: 2, parentId: "dark_knight" },
] as const satisfies ClassDefinition[];

export type ClassId = (typeof CLASSES)[number]["id"];

const ensureClassTreeIsValid = (classes: ClassDefinition[]) => {
  const ids = new Set<string>();
  for (const entry of classes) {
    if (ids.has(entry.id)) {
      throw new Error(`Duplicate class id detected: ${entry.id}`);
    }
    ids.add(entry.id);
  }

  for (const entry of classes) {
    if (entry.parentId && !ids.has(entry.parentId)) {
      throw new Error(`Missing parentId ${entry.parentId} for class ${entry.id}`);
    }
  }

  const classById = new Map(classes.map(entry => [entry.id, entry]));
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (id: string) => {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      throw new Error(`Cycle detected in class tree at ${id}`);
    }
    visiting.add(id);
    const parentId = classById.get(id)?.parentId;
    if (parentId) {
      visit(parentId);
    }
    visiting.delete(id);
    visited.add(id);
  };

  for (const entry of classes) {
    visit(entry.id);
  }
};

ensureClassTreeIsValid(CLASSES);

export const CLASS_BY_ID = Object.fromEntries(
  CLASSES.map(entry => [entry.id, entry]),
) as Record<ClassId, ClassDefinition>;
