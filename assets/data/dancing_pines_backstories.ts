import type { Backstory } from "./waves_break_backstories";

export const DANCING_PINES_BACKSTORIES: Backstory[] = [
  {
    district: "Lumberworks",
    background: "Sawyer",
    past: "Works the waterwheels cutting pine trunks for distant shipyards.",
    items: ["sawblade", "earplugs"],
    money: "3 cp",
    skills: ["timber cutting", "balance"],
    combat: "Axe proficiency 10 (beginner)",
    startingLocation: "Sawmill bunkhouse",
    narrative: "You wake to the hum of waterwheels and scent of fresh-cut pine in the Sawmill bunkhouse.",
  },
  {
    district: "Diamond Mines",
    background: "Tunnel scout",
    past: "Crawls ahead of the miners, marking safe seams and stray glittering veins.",
    items: ["chalk line", "hooded lantern"],
    money: "5 cp",
    skills: ["scouting", "stone sense"],
    combat: "Dagger proficiency 10 (beginner)",
    startingLocation: "Diamond Mine entrance",
    narrative: "You shake off sleep at the mine mouth, chalk tucked behind your ear and lantern in hand.",
  },
  {
    district: "Hunter's Quarter",
    background: "Trapper",
    past: "Sets snares for wild poultry and pelts, selling them to the Pinehall.",
    items: ["snare wire", "fur-lined cloak"],
    money: "4 cp",
    skills: ["tracking", "skinning"],
    combat: "Bow proficiency 10 (beginner)",
    craftProficiencies: { tanning: 10 },
    startingLocation: "Hunter's Lodge bunk",
    narrative: "You rise from a cot in the Hunter's Lodge, the smell of smoked meat lingering in the air.",
  },
];

export default DANCING_PINES_BACKSTORIES;
