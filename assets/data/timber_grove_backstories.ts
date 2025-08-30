import type { Backstory } from "./waves_break_backstories";

export const TIMBER_GROVE_BACKSTORIES: Backstory[] = [
  {
    district: "The Lumberworks",
    background: "Log driver",
    past: "Guides felled trunks down the river, dreaming of owning his own mill.",
    items: ["peavey hook", "waterlogged boots"],
    money: "3 cp",
    skills: ["log rolling", "river sense"],
    combat: "Axe proficiency 10 (beginner)",
    startingLocation: "Riverside log jam",
    narrative: "You wake on a damp log by the Lumberworks, river mist curling around your peavey hook.",
  },
  {
    district: "The Mine",
    background: "Crystal prospector",
    past: "Scours the highland tunnel for shimmering shards worth a week's wages.",
    items: ["pickaxe", "glowstone shard"],
    money: "5 cp",
    skills: ["mining", "stone appraisal"],
    combat: "Pick proficiency 10 (beginner)",
    startingLocation: "Mine entrance camp",
    narrative: "The scent of earth greets you as you rise from your bedroll near the mine entrance.",
  },
  {
    district: "Fields & Orchards",
    background: "Sap collector",
    past: "Taps trees at dawn to harvest sweet saps prized by alchemists.",
    items: ["drill", "bucket of sap"],
    money: "2 cp",
    skills: ["tree tapping", "foraging"],
    combat: "Untrained",
    craftProficiencies: { cooking: 5 },
    startingLocation: "Orchard shed",
    narrative: "You rouse in an orchard shed, sticky with sap and the buzz of waking insects.",
  },
];

export default TIMBER_GROVE_BACKSTORIES;
