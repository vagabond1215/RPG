import type { Backstory } from "./waves_break_backstories";

export const WARM_SPRINGS_BACKSTORIES: Backstory[] = [
  {
    district: "The Springs",
    background: "Bath attendant",
    past: "Helps travelers soothe wounds in mineral pools while memorizing alchemical gossip.",
    items: ["towel bundle", "vial of spring water"],
    money: "4 cp",
    skills: ["massage", "herbal lore"],
    combat: "Untrained",
    craftProficiencies: { alchemy: 5 },
    startingLocation: "Terraced Hot Springs",
    narrative: "Steam curls around you as you rise from your pallet beside the terraced pools at daybreak. A bundle of towels and a vial of spring water wait in a chest with four coppers in your sash; the first travelers arrive with sunrise.",
  },
  {
    district: "The Mines",
    background: "Young miner",
    past: "Chipped ore since childhood, hoping to strike a vein of silver.",
    items: ["short pick", "dusty lantern"],
    money: "3 cp",
    skills: ["tunneling", "endurance"],
    combat: "Pick proficiency 10 (beginner)",
    startingLocation: "Mine entrance barrack",
    narrative: "You wake to the clatter of carts outside the mine barrack, lantern already sputtering in the pre-dawn gloom. Short pick hangs from a peg with three coppers in your pocket; the shift descends at first bell.",
  },
  {
    district: "Craft Halls",
    background: "Apprentice alchemist",
    past: "Taken in by the Warm Springs Alchemists' Hall to brew restorative salves.",
    items: ["mixing spoon", "pouch of salts"],
    money: "2 sp",
    skills: ["potion brewing", "precise measuring"],
    combat: "Untrained",
    craftProficiencies: { alchemy: 20 },
    startingLocation: "Alchemists' Hall bunk",
    narrative: "You stir amid shelves of glass as morning light filters into the Alchemists' Hall. Mixing spoon and pouch of salts sit on your bunk beside two silver pieces; the master expects restorative salves brewed before noon.",
  },
];

export default WARM_SPRINGS_BACKSTORIES;
