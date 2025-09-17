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
    narrative: "You wake at a table in the Merchant's Exchange, ink drying on last night's ledgers while dawn light spills through the plaza. Your quill and bundle of contracts are stacked beside a pouch of six coppers; merchants arrive at first bell for deals.",
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
    narrative: "You snap awake in the barracks as the morning bell calls recruits to muster. A dented helm and practice sword rest beside your bunk with two coppers in your boot; the drill yard awaits by sunrise.",
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
    narrative: "You wake on a straw mat beside the misty tea rows, dew beading on the leaves in the cool morning. Shears and a satchel of tea leaves sit within reach along with five coppers in a small pouch; the pickers must fill baskets before the sun dries the fields.",
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
    narrative: "You rub sleep from your eyes at the Leatherwright's Hall as morning light slants across half-laced packs. Awl and spool of thread lie on the bench with seven coppers in a drawer; the master expects today's work finished by second bell.",
  },
];

export default MOUNTAIN_TOP_BACKSTORIES;
