import { BACKSTORY_BY_ID } from "../data/game/backstories.ts";
import { BACKSTORY_IDS_BY_LOCATION } from "../data/game/backstory_ids_by_location.ts";

const sources = Object.fromEntries(
  Object.entries(BACKSTORY_IDS_BY_LOCATION).map(([location, ids]) => [
    location,
    ids.map(id => BACKSTORY_BY_ID[id]).filter(Boolean),
  ])
);

console.log(JSON.stringify(sources, null, 2));
