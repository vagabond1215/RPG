export const themeDescriptions = {
  "Knight / Paladin": "heavy armor, sword & shield, holy magic",
  "Warrior / Fighter": "heavy armor, versatile weapons, melee focus",
  "Berserker / Barbarian": "medium-to-heavy armor, large axes or clubs, rage-based abilities",
  "Samurai / Ronin": "medium armor, katanas, disciplined combat arts",
  "Viking / Raider": "heavy furs and mail, axes or spears, sea-raider flavor",
  "Pirate / Corsair": "light-to-medium armor, cutlasses, pistols or hand crossbows",
  "Ranger / Scout": "light armor, bows or dual blades, tracking and survival skills",
  "Archer / Marksman": "light armor, bows, ranged precision attacks",
  "Gunslinger / Musketeer": "light armor, firearms or hand crossbows",
  "Ninja / Assassin": "light armor, daggers or shuriken, stealth and mobility",
  "Monk / Martial Artist": "unarmored or cloth, bare-handed or staves, chi-based techniques",
  "Duelist / Swashbuckler": "light armor, rapiers or sabers, agile fencing",
  "Mage / Wizard": "robes, staves or wands, arcane spellcasting",
  "Sorcerer / Warlock": "robes, innate or pact magic, ranged spells",
  "Cleric / Priest": "medium armor, maces or staves, healing and divine spells",
  "Druid / Shaman": "light armor, staves or scimitars, nature magic and shapeshifting",
  "Necromancer / Death Mage": "robes, staves, dark magic and undead control",
  "Bard / Minstrel": "light armor, instruments or rapiers, support and charm spells",
  "Dancer / Performer": "light clothes, fans or daggers, evasive style with buffs/debuffs",
  "Alchemist / Engineer": "light armor, bombs or gadgets, chemical concoctions",
  "Mechanist / Artificer": "medium armor, crossbows or mechanical constructs",
  "Beastmaster / Tamer": "light armor, whips or bows, combat with pet companions",
  "Summoner / Conjurer": "robes, staves, summons elemental or mythical allies",
  "Templar / Inquisitor": "heavy armor, polearms or greatswords, holy zeal",
  "Dark Knight / Anti-Paladin": "heavy armor, cursed blades, shadow magic"
};

export function getThemeDescription(name) {
  return themeDescriptions[name] || "";
}
