import type { Backstory } from "./waves_break_backstories";

export const CREEKSIDE_BACKSTORIES: Backstory[] = [
  {
    district: "Greenford",
    background: "Cattle drover",
    past: "Raised among the largest herds, drives cattle to market with a steady hand.",
    items: ["crook", "leather satchel"],
    money: "4 cp",
    skills: ["animal handling", "whistling"],
    combat: "Staff proficiency 10 (beginner)",
    startingLocation: "Cattle Yards corral",
    narrative: "You wake leaning against a fence in the Cattle Yards while dawn fog drifts over the lowing herds. Your crook and leather satchel holding four coppers hang on the rail; the drive to market leaves at sunrise.",
  },
  {
    district: "Everrise Bridge",
    background: "Flatboat pilot",
    past: "Knows every bend of the river, ferrying goods between warehouses.",
    items: ["pole", "river charts"],
    money: "3 sp",
    skills: ["river navigation", "bartering"],
    combat: "Untrained",
    startingLocation: "Riverside Warehouses dock",
    narrative: "You roll off a coiled rope on the docks as the Everrise Bridge glows in morning light. Pole and river charts are tucked beside a pouch of three silvers; you must ferry goods across before the first bell tolls.",
  },
  {
    district: "Stoneknot",
    background: "Guild clerk",
    past: "Studies contracts in the Grand Guildhall, aspiring to post a quest of his own.",
    items: ["ink pot", "quest ledger"],
    money: "6 cp",
    skills: ["accounting", "guild law"],
    combat: "Untrained",
    craftProficiencies: { writing: 10 },
    startingLocation: "Grand Guildhall archives",
    narrative: "You blink away sleep amid stacks of parchment in the Grand Guildhall archives, lantern smoke curling in the still air. An ink pot and quest ledger sit next to six coppers in your drawer; the clerk's desk opens at sunrise to post new contracts.",
  },
  {
    district: "Surrounding Farmlands & Orchards",
    background: "Orchard picker",
    past: "Tends fruit trees outside the walls, trading baskets for coin.",
    items: ["fruit knife", "woven basket"],
    money: "5 cp",
    skills: ["harvesting", "climbing"],
    combat: "Sling proficiency 10 (beginner)",
    startingLocation: "Fruit orchard camp",
    narrative: "You wake beneath a laden apple tree, dew soaking your clothes as birds chirp in the dawn. Your fruit knife and woven basket lie nearby with five coppers tied in a cloth; the wagon to market departs at third bell.",
  },
];

export default CREEKSIDE_BACKSTORIES;
