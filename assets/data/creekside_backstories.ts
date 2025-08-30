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
    narrative: "You wake leaning against a fence in the Cattle Yards, dawn fog drifting over lowing herds.",
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
    narrative: "You roll off a coiled rope on the docks as the Everrise Bridge glows in morning light.",
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
    narrative: "You blink away sleep amid stacks of parchment in the Guildhall archives.",
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
    narrative: "You wake beneath a laden apple tree, basket already half-filled for market.",
  },
];

export default CREEKSIDE_BACKSTORIES;
