import type { Backstory } from "./waves_break_backstories";

export const DRAGONS_REACH_ROAD_BACKSTORIES: Backstory[] = [
  {
    district: "The Central Plaza",
    background: "Quest board runner",
    past: "Posts notices for incoming adventurers, secretly dreaming of joining a hunt.",
    items: ["bundle of nails", "quest parchment"],
    money: "4 cp",
    skills: ["reading", "rumor gathering"],
    combat: "Untrained",
    startingLocation: "Guild Post steps",
    narrative: "You wake on the steps of the Guild Post as dawn caravans creak into the plaza.",
  },
  {
    district: "The Lakeside Quarter",
    background: "Fisher scavenger",
    past: "Casts nets for fish and combs the shore for shed dragon scales.",
    items: ["net", "scale pouch"],
    money: "3 cp",
    skills: ["fishing", "scavenging"],
    combat: "Spear proficiency 10 (beginner)",
    startingLocation: "Fishermen's Docks",
    narrative: "You yawn beside your boat at the Fishermen's Docks, lake mist drifting over the water.",
  },
  {
    district: "The Artisan's Lane",
    background: "Exotic fruit presser",
    past: "Turns rare orchard fruit into syrups for caravans headed south.",
    items: ["wooden press", "bottle of syrup"],
    money: "2 sp",
    skills: ["pressing", "flavoring"],
    combat: "Untrained",
    craftProficiencies: { cooking: 10 },
    startingLocation: "Exotic Fruit Press",
    narrative: "You wake to sticky sweet aromas in your workshop along the Artisan's Lane.",
  },
];

export default DRAGONS_REACH_ROAD_BACKSTORIES;
