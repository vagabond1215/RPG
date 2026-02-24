export const themeColors = [
  { index: 1, name: "Knight / Paladin", colors: ["royal blue", "silver", "ivory"] },
  { index: 2, name: "Fighter / Warrior", colors: ["cobalt blue", "emerald green", "charcoal gray"] },
  { index: 3, name: "Barbarian / Berserker", colors: ["crimson", "bronze", "obsidian"] },
  { index: 4, name: "Ronin / Samurai", colors: ["scarlet", "black", "snow white"] },
  { index: 5, name: "Raider / Viking", colors: ["navy", "maroon", "steel gray"] },
  { index: 6, name: "Pirate / Corsair", colors: ["teal", "sandy brown", "gold"] },
  { index: 7, name: "Scout / Ranger", colors: ["forest green", "earth brown", "olive"] },
  { index: 8, name: "Archer / Marksman", colors: ["hunter green", "tan", "mahogany"] },
  { index: 9, name: "Musketeer / Gunslinger", colors: ["saddle brown", "dusty blue", "cream"] },
  { index: 10, name: "Ninja / Assassin", colors: ["black", "slate gray", "crimson"] },
  { index: 11, name: "Martial Artist / Monk", colors: ["saffron", "white", "amber"] },
  { index: 12, name: "Swashbuckler / Duelist", colors: ["wine red", "charcoal", "silver"] },
  { index: 13, name: "Mage / Wizard", colors: ["indigo", "violet", "white"] },
  { index: 14, name: "Sorcerer / Sage", colors: ["purple", "black", "magenta"] },
  { index: 15, name: "Acolyte / Priest", colors: ["white", "gold", "sky blue"] },
  { index: 16, name: "Druid / Shaman", colors: ["sage", "moss green", "earth brown"] },
  { index: 17, name: "Necromancer / Death Mage", colors: ["black", "violet", "bone white"] },
  { index: 18, name: "Minstrel / Bard", colors: ["ruby", "gold", "turquoise"] },
  { index: 19, name: "Performer / Dancer", colors: ["fuchsia", "gold", "white"] },
  { index: 20, name: "Engineer / Alchemist", colors: ["bronze", "olive", "smoke gray"] },
  { index: 21, name: "Tamer / Beastmaster", colors: ["olive green", "rust", "sand"] },
  { index: 22, name: "Conjurer / Summoner", colors: ["cerulean", "lavender", "silver"] },
  { index: 23, name: "Templar / Inquisitor", colors: ["crimson", "white", "black"] },
  { index: 24, name: "Dark Knight / Death Knight", colors: ["black", "violet", "blood red"] }
];

export function getThemeColors(index) {
  const entry = themeColors.find(t => t.index === index);
  return entry ? entry.colors : ["beige", "gray", "white"];
}
