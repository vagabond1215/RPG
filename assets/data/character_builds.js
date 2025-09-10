export const characterBuilds = {
  "Knight / Paladin": {
    primary: "Knight",
    advanced: "Paladin",
    description: "heavy armor, sword & shield, holy magic",
    stats: { STR: 2, VIT: 2, WIS: 1, DEX: -2, LCK: -2, INT: -1 },
  },
  "Fighter / Warrior": {
    primary: "Fighter",
    advanced: "Warrior",
    description: "heavy armor, versatile weapons, melee focus",
    stats: { STR: 2, CON: 2, VIT: 1, INT: -2, CHA: -2, WIS: -1 },
  },
  "Barbarian / Berserker": {
    primary: "Barbarian",
    advanced: "Berserker",
    description: "medium-to-heavy armor, large axes or clubs, rage-based abilities",
    stats: { STR: 3, CON: 2, VIT: 1, WIS: -2, INT: -2, CHA: -2 },
  },
  "Ronin / Samurai": {
    primary: "Ronin",
    advanced: "Samurai",
    description: "medium armor, katanas, disciplined combat arts",
    stats: { DEX: 2, WIS: 2, STR: 1, LCK: -2, CON: -2, CHA: -1 },
  },
  "Raider / Viking": {
    primary: "Raider",
    advanced: "Viking",
    description: "heavy furs and mail, axes or spears, sea-raider flavor",
    stats: { STR: 2, CON: 2, LCK: 1, WIS: -2, CHA: -2, INT: -1 },
  },
  "Pirate / Corsair": {
    primary: "Pirate",
    advanced: "Corsair",
    description: "light-to-medium armor, cutlasses, pistols or hand crossbows",
    stats: { DEX: 2, CHA: 2, LCK: 1, WIS: -2, VIT: -2, STR: -1 },
  },
  "Scout / Ranger": {
    primary: "Scout",
    advanced: "Ranger",
    description: "light armor, bows or dual blades, tracking and survival skills",
    stats: { WIS: 2, DEX: 2, AGI: 1, CHA: -2, CON: -2, STR: -1 },
  },
  "Archer / Marksman": {
    primary: "Archer",
    advanced: "Marksman",
    description: "light armor, bows, ranged precision attacks",
    stats: { DEX: 3, WIS: 2, AGI: 1, STR: -2, CHA: -2, CON: -2 },
  },
  "Musketeer / Gunslinger": {
    primary: "Musketeer",
    advanced: "Gunslinger",
    description: "light armor, firearms or hand crossbows",
    stats: { DEX: 3, LCK: 2, CHA: 1, WIS: -2, STR: -2, CON: -2 },
  },
  "Ninja / Assassin": {
    primary: "Ninja",
    advanced: "Assassin",
    description: "light armor, daggers or shuriken, stealth and mobility",
    stats: { DEX: 2, AGI: 2, CHA: 1, CON: -2, LCK: -2, STR: -1 },
  },
  "Martial Artist / Monk": {
    primary: "Martial Artist",
    advanced: "Monk",
    description: "unarmored or cloth, bare-handed or staves, chi-based techniques",
    stats: { WIS: 2, AGI: 2, STR: 1, CHA: -2, LCK: -2, CON: -1 },
  },
  "Swashbuckler / Duelist": {
    primary: "Swashbuckler",
    advanced: "Duelist",
    description: "light armor, rapiers or sabers, agile fencing",
    stats: { DEX: 2, CHA: 2, STR: 1, INT: -2, WIS: -2, LCK: -1 },
  },
  "Mage / Wizard": {
    primary: "Mage",
    advanced: "Wizard",
    description: "robes, staves or wands, arcane spellcasting",
    stats: { INT: 3, WIS: 2, LCK: 1, STR: -2, CON: -2, VIT: -2 },
  },
  "Sorcerer / Sage": {
    primary: "Sorcerer",
    advanced: "Sage",
    description: "robes, innate or arcane magic, ranged spells",
    stats: { CHA: 3, INT: 2, WIS: 1, STR: -2, CON: -2, VIT: -2 },
  },
  "Acolyte / Priest": {
    primary: "Acolyte",
    advanced: "Priest",
    description: "medium armor, maces or staves, healing and divine spells (Priestess for females)",
    stats: { WIS: 3, CON: 2, CHA: 1, STR: -2, AGI: -2, LCK: -2 },
  },
  "Druid / Shaman": {
    primary: "Druid",
    advanced: "Shaman",
    description: "light armor, staves or scimitars, nature magic and shapeshifting",
    stats: { WIS: 3, CON: 2, INT: 1, STR: -2, CHA: -2, LCK: -2 },
  },
  "Necromancer / Death Mage": {
    primary: "Necromancer",
    advanced: "Death Mage",
    description: "robes, staves, dark magic and undead control",
    stats: { INT: 3, WIS: 2, LCK: 1, STR: -2, CHA: -2, VIT: -2 },
  },
  "Minstrel / Bard": {
    primary: "Minstrel",
    advanced: "Bard",
    description: "light armor, instruments or rapiers, support and charm spells",
    stats: { CHA: 3, LCK: 2, DEX: 1, STR: -2, CON: -2, WIS: -2 },
  },
  "Performer / Dancer": {
    primary: "Performer",
    advanced: "Dancer",
    description: "light clothes, fans or daggers, evasive style with buffs/debuffs",
    stats: { AGI: 3, CHA: 2, STR: 1, CON: -2, VIT: -2, WIS: -2 },
  },
  "Engineer / Alchemist": {
    primary: "Engineer",
    advanced: "Alchemist",
    description: "light armor, gadgets or bombs, chemical concoctions",
    stats: { INT: 3, DEX: 2, WIS: 1, STR: -2, CHA: -2, CON: -2 },
  },
  "Tamer / Beastmaster": {
    primary: "Tamer",
    advanced: "Beastmaster",
    description: "light armor, whips or bows, combat with pet companions",
    stats: { WIS: 2, CON: 2, STR: 1, CHA: -2, INT: -2, LCK: -1 },
  },
  "Conjurer / Summoner": {
    primary: "Conjurer",
    advanced: "Summoner",
    description: "robes, staves, summons elemental or mythical allies",
    stats: { INT: 3, CHA: 2, WIS: 1, STR: -2, CON: -2, VIT: -2 },
  },
  "Templar / Inquisitor": {
    primary: "Templar",
    advanced: "Inquisitor",
    description: "heavy armor, polearms or greatswords, holy zeal",
    stats: { WIS: 3, STR: 2, CON: 1, DEX: -2, LCK: -2, CHA: -2 },
  },
  "Dark Knight / Death Knight": {
    primary: "Dark Knight",
    advanced: "Death Knight",
    description: "heavy armor, cursed blades, shadow magic",
    stats: { STR: 3, VIT: 2, CON: 1, WIS: -2, CHA: -2, LCK: -2 },
  },
};

export function getBuildDescription(name) {
  return characterBuilds[name]?.description || "";
}

export function getBuildStats(name) {
  return characterBuilds[name]?.stats || {};
}

// Backwards compatibility with older theme-based functions
export { getBuildDescription as getThemeDescription };

