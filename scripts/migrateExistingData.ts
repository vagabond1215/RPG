import { writeFile } from "fs/promises";

// Placeholder migration script mapping legacy data to new structure

const animalVariants = [
  { animal_id: "chicken", label: "Common", notes: "" },
  { animal_id: "chicken", label: "Fine", notes: "" },
  { animal_id: "chicken", label: "Trained", notes: "Accustomed to handling" },
  { animal_id: "chicken", label: "Champion", notes: "Exceptional breeder/show" },
  { animal_id: "draft-horse", label: "Common" },
  { animal_id: "draft-horse", label: "Fine" },
  { animal_id: "draft-horse", label: "Trained", notes: "Harness trained" },
  { animal_id: "draft-horse", label: "Champion", notes: "Superior strength/endurance" }
];

const plantSKUs = [
  { plant_id: "apple-tree", sku: "Apples", units: "dozen", tiers: ["Low Inn","Common","Fine","High Table"] },
  { plant_id: "peppercorn", sku: "Peppercorns", units: "sack", luxury_tiers: ["Common","Fine","Luxury","Arcane"] },
  { plant_id: "saffron", sku: "Saffron", units: "dram", luxury_tiers: ["Common","Fine","Luxury","Arcane"] },
  { plant_id: "chanterelle", sku: "Chanterelles", units: "basket", tiers: ["Low Inn","Common","Fine","High Table"] },
  { plant_id: "cabbage", sku: "Cabbage", units: "head", tiers: ["Low Inn","Common","Fine","High Table"] }
];

async function run() {
  await writeFile("data/animalVariants.json", JSON.stringify(animalVariants, null, 2));
  await writeFile("data/plantSKUs.json", JSON.stringify(plantSKUs, null, 2));
  console.log("Migration complete");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
