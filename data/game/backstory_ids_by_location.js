import { WAVES_BREAK_BACKSTORY_IDS } from "./waves_break_backstories.js";
import { CORAL_KEEP_BACKSTORY_IDS } from "./coral_keep_backstories.js";
import { CREEKSIDE_BACKSTORY_IDS } from "./creekside_backstories.js";
import { DANCING_PINES_BACKSTORY_IDS } from "./dancing_pines_backstories.js";
import { DRAGONS_REACH_ROAD_BACKSTORY_IDS } from "./dragons_reach_road_backstories.js";
import { WARM_SPRINGS_BACKSTORY_IDS } from "./warm_springs_backstories.js";
import { TIMBER_GROVE_BACKSTORY_IDS } from "./timber_grove_backstories.js";
import { CORONA_BACKSTORY_IDS } from "./corona_backstories.js";
import { CORNER_STONE_BACKSTORY_IDS } from "./corner_stone_backstories.js";
import { MOUNTAIN_TOP_BACKSTORY_IDS } from "./mountain_top_backstories.js";
import { WHITEHEART_BACKSTORY_IDS } from "./whiteheart_backstories.js";

export const BACKSTORY_IDS_BY_LOCATION = {
  "Wave's Break": WAVES_BREAK_BACKSTORY_IDS,
  "Coral Keep": CORAL_KEEP_BACKSTORY_IDS,
  Creekside: CREEKSIDE_BACKSTORY_IDS,
  "Dancing Pines": DANCING_PINES_BACKSTORY_IDS,
  "Dragon's Reach Road": DRAGONS_REACH_ROAD_BACKSTORY_IDS,
  "Warm Springs": WARM_SPRINGS_BACKSTORY_IDS,
  "Timber Grove": TIMBER_GROVE_BACKSTORY_IDS,
  Corona: CORONA_BACKSTORY_IDS,
  "Corner Stone": CORNER_STONE_BACKSTORY_IDS,
  "Mountain Top": MOUNTAIN_TOP_BACKSTORY_IDS,
  Whiteheart: WHITEHEART_BACKSTORY_IDS,
};

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
