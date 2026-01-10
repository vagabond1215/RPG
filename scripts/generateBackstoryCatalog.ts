import fs from "fs";
import path from "path";
import { BACKSTORIES } from "../data/game/backstories.ts";
import { BACKSTORY_IDS_BY_LOCATION } from "../data/game/backstory_ids_by_location.ts";

const reportsDir = path.resolve("reports");
fs.mkdirSync(reportsDir, { recursive: true });

const byLocation = Object.fromEntries(
  Object.entries(BACKSTORY_IDS_BY_LOCATION).map(([location, ids]) => [location, ids.length])
);

const summary = {
  totalBackstories: BACKSTORIES.length,
  byLocation,
};

const outputPath = path.join(reportsDir, "backstory_catalog_summary.json");
fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

console.log(`Backstory catalog summary written to ${outputPath}`);
