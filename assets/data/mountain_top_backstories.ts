import type { Backstory } from "./waves_break_backstories";

export const MOUNTAIN_TOP_BACKSTORIES: Backstory[] = [
  {
    district: "Central Plaza",
    background: "Caravan scribe",
    past: "Documents trade deals for traveling merchants, hoping to fund his own journey.",
    items: ["quill", "bundle of contracts"],
    money: "6 cp",
    skills: ["record keeping", "bargaining"],
    combat: "Untrained",
    startingLocation: "Merchant's Exchange stall",
    narrative: "You wake at a table in the Merchant's Exchange, ink drying on last night's ledgers.",
  },
  {
    district: "Fortress Quarter",
    background: "Iron Watch recruit",
    past: "Left a farm to join the fortress garrison guarding the Wetlands road.",
    items: ["dented helm", "practice sword"],
    money: "2 cp",
    skills: ["drill formation", "spotting"],
    combat: "Sword proficiency 10 (beginner)",
    startingLocation: "Barracks of the Iron Watch",
    narrative: "You snap awake in the barracks as the morning bell calls recruits to muster.",
  },
  {
    district: "Terraces & Farms",
    background: "Tea picker",
    past: "Tends terraced gardens, dreaming of selling a rare blend in Corona.",
    items: ["shears", "satchel of tea leaves"],
    money: "5 cp",
    skills: ["pruning", "tea tasting"],
    combat: "Untrained",
    craftProficiencies: { gardening: 10 },
    startingLocation: "Tea Gardens shack",
    narrative: "You wake on a straw mat beside the tea rows, mist beading on the leaves.",
  },
  {
    district: "Artisan's Row",
    background: "Leatherwright's journeyman",
    past: "Learns to craft sturdy packs for caravans crossing the wetlands.",
    items: ["awl", "spool of thread"],
    money: "7 cp",
    skills: ["stitching", "design"],
    combat: "Dagger proficiency 10 (beginner)",
    craftProficiencies: { leatherwork: 15 },
    startingLocation: "Leatherwright's Hall workbench",
    narrative: "You rub sleep from your eyes at the Leatherwright's Hall, yesterday's project still half-laced.",
  },
];

export default MOUNTAIN_TOP_BACKSTORIES;
