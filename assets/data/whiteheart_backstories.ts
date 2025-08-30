import type { Backstory } from "./waves_break_backstories";

export const WHITEHEART_BACKSTORIES: Backstory[] = [
  {
    district: "The Barracks",
    background: "Road scout",
    past: "Trained to patrol forest trails, watching for bandits and monsters.",
    items: ["short bow", "worn boots"],
    money: "3 cp",
    skills: ["tracking", "mapping"],
    combat: "Bow proficiency 10 (beginner)",
    startingLocation: "Barracks bunk",
    narrative: "You wake on a narrow bunk in the Whiteheart barracks, gear already packed for patrol.",
  },
  {
    district: "Residences & Community",
    background: "Forager's apprentice",
    past: "Learns herbs and edible fungi from the elders in the communal longhouse.",
    items: ["foraging knife", "basket"],
    money: "2 cp",
    skills: ["herbalism", "cooking"],
    combat: "Untrained",
    craftProficiencies: { herbalism: 15 },
    startingLocation: "Forager's Lodge",
    narrative: "You rise from the Forager's Lodge, the morning forest humming with unseen life.",
  },
];

export default WHITEHEART_BACKSTORIES;
