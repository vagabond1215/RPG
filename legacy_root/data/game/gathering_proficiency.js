import {
  gainProficiency,
  ATTR_GAIN_MIN,
  ATTR_GAIN_MAX,
  ATTR_GAIN_SLOPE,
} from "./proficiency_base.js";

// Mapping of gathering skills to their primary and secondary attributes.
// Primary attribute contributes to the physical component of the task while
// secondary represents endurance or knowledge.
export const GATHERING_ATTRS = {
  // Logging trees requires strength and overall vitality to keep swinging.
  logging: { primary: "STR", secondary: "VIT" },
  // Mining stone and ore relies on strength and constitution to endure.
  mining: { primary: "STR", secondary: "CON" },
  // Foraging or gathering herbs needs deft hands and knowledge to identify.
  foraging: { primary: "DEX", secondary: "INT" },
  // Farming large plots leans on endurance and learned technique.
  farming: { primary: "VIT", secondary: "INT" },
  // Gardening smaller plots – dexterity plus botanical understanding.
  gardening: { primary: "DEX", secondary: "WIS" },
  // Herbalism/herb lore rewards keen observation and trained study.
  herbalism: { primary: "WIS", secondary: "INT" },
  // Vineyard stewardship blends botanical sense with resilience.
  viticulture: { primary: "WIS", secondary: "CON" },
  // Pearl diving blends lung capacity with agile swimming in open water.
  pearlDiving: { primary: "CON", secondary: "AGI" },
};

function attrFactor(attrs, key) {
  const mapping = GATHERING_ATTRS[key];
  if (!mapping) return 1;
  const pri = attrs[mapping.primary] || 0;
  const sec = attrs[mapping.secondary] || 0;
  const avg = (pri + sec) / 2;
  const f = ATTR_GAIN_MIN + ATTR_GAIN_SLOPE * avg;
  return Math.min(ATTR_GAIN_MAX, Math.max(ATTR_GAIN_MIN, f));
}

/**
 * Increase a character's gathering proficiency.
 *
 * @param {Object} character - The acting character.
 * @param {string} skillKey - Gathering skill key (e.g., 'mining', 'foraging').
 * @param {Object} [opts]
 * @param {boolean} [opts.success=true] - Whether the gathering attempt succeeded.
 * @returns {number} Updated proficiency value.
 */
export function gainGatherProficiency(character, skillKey, opts = {}) {
  const { success = true } = opts;
  const current = character[skillKey] || 0;
  const level = character.level || 1;
  const attrs = character.attributes?.current || {};
  const F_attr = attrFactor(attrs, skillKey);
  character[skillKey] = gainProficiency({
    P: current,
    L: level,
    A0: 1,
    A: 0,
    r: 1,
    F_attr,
    success,
  });
  return character[skillKey];
}

/**
 * Convenience helper to perform a gathering activity and apply progression.
 *
 * @param {Object} character - The acting character.
 * @param {string} skillKey - Gathering skill key.
 * @param {Object} [opts]
 * @returns {number} New proficiency value.
 */
export function performGathering(character, skillKey, opts = {}) {
  return gainGatherProficiency(character, skillKey, opts);
}
