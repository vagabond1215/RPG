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
    narrative: "You wake to the hum of waterwheels and scent of fresh-cut pine in the Sawmill bunkhouse just before dawn. Your earplugs and sawblade rest atop your bedroll with three coppers in a pouch; the mill whistle will sound soon to start the day's cutting.",
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
    narrative: "You shake off sleep at the mine mouth, morning chill seeping through the rock as you spark your hooded lantern. Chalk line slips behind your ear and five coppers jingle in your pocket; miners wait for your signal before they descend.",
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
    narrative: "You rise from a cot in the Hunter's Lodge while the smell of smoked meat mingles with the crisp dawn air. Snare wire and a fur-lined cloak hang from a peg, four coppers tucked inside; you must set your lines before the sun climbs.",
  },
];

export default DANCING_PINES_BACKSTORIES;
