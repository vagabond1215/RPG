export const themeColors = [
  { index: 1, name: "Knight / Paladin", colors: ["royal blue", "silver", "ivory"] },
  { index: 2, name: "Warrior / Fighter", colors: ["cobalt blue", "emerald green", "charcoal gray"] },
  { index: 3, name: "Berserker / Barbarian", colors: ["crimson", "bronze", "obsidian"] },
  { index: 4, name: "Samurai / Ronin", colors: ["scarlet", "black", "snow white"] },
  { index: 5, name: "Viking / Raider", colors: ["navy", "maroon", "steel gray"] },
  { index: 6, name: "Pirate / Corsair", colors: ["teal", "sandy brown", "gold"] },
  { index: 7, name: "Ranger / Scout", colors: ["forest green", "earth brown", "olive"] },
  { index: 8, name: "Archer / Marksman", colors: ["hunter green", "tan", "mahogany"] },
  { index: 9, name: "Gunslinger / Musketeer", colors: ["saddle brown", "dusty blue", "cream"] },
  { index: 10, name: "Ninja / Assassin", colors: ["black", "slate gray", "crimson"] },
  { index: 11, name: "Monk / Martial Artist", colors: ["saffron", "white", "amber"] },
  { index: 12, name: "Duelist / Swashbuckler", colors: ["wine red", "charcoal", "silver"] },
  { index: 13, name: "Mage / Wizard", colors: ["indigo", "violet", "white"] },
  { index: 14, name: "Sorcerer / Warlock", colors: ["purple", "black", "magenta"] },
  { index: 15, name: "Cleric / Priest", colors: ["white", "gold", "sky blue"] },
  { index: 16, name: "Druid / Shaman", colors: ["sage", "moss green", "earth brown"] },
  { index: 17, name: "Necromancer / Death Mage", colors: ["black", "violet", "bone white"] },
  { index: 18, name: "Bard / Minstrel", colors: ["ruby", "gold", "turquoise"] },
  { index: 19, name: "Dancer / Performer", colors: ["fuchsia", "gold", "white"] },
  { index: 20, name: "Alchemist / Engineer", colors: ["bronze", "olive", "smoke gray"] },
  { index: 21, name: "Beastmaster / Tamer", colors: ["olive green", "rust", "sand"] },
  { index: 22, name: "Summoner / Conjurer", colors: ["cerulean", "lavender", "silver"] },
  { index: 23, name: "Templar / Inquisitor", colors: ["crimson", "white", "black"] },
  { index: 24, name: "Dark Knight / Anti-Paladin", colors: ["black", "violet", "blood red"] }
];

export function getThemeColors(index) {
  const entry = themeColors.find(t => t.index === index);
  return entry ? entry.colors : ["beige", "gray", "white"];
}
