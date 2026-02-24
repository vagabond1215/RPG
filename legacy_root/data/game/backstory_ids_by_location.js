import { BACKSTORIES } from "./backstories.js";

export const BACKSTORY_IDS_BY_LOCATION = BACKSTORIES.reduce((map, entry) => {
  for (const location of entry.availableIn || []) {
    if (!map[location]) map[location] = [];
    map[location].push(entry.id);
  }
  return map;
}, {});

export function getBackstoryIdsForLocation(location) {
  return [...(BACKSTORY_IDS_BY_LOCATION[location] || [])];
}

export function getAllBackstoryIds() {
  const ids = new Set();
  for (const list of Object.values(BACKSTORY_IDS_BY_LOCATION)) {
    list.forEach(id => ids.add(id));
  }
  return [...ids];
}
