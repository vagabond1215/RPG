import rawData from "../backstories.json" assert { type: "json" };

const rawBackstories = Array.isArray(rawData?.backstories) ? rawData.backstories : [];
const rawRaceDescriptions = rawData?.raceDescriptions || {};
const rawClassAlignmentInserts = rawData?.classAlignmentInserts || {};

function normalizeWhitespace(text = "") {
  return text.replace(/\r\n/g, "\n").trim();
}

function splitParagraphs(text = "") {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return [];
  return normalized
    .split(/\n\s*\n/g)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getPronouns(sex) {
  const normalized = sex ? sex.toLowerCase() : undefined;
  if (normalized === "male" || normalized === "m") {
    return { subject: "he", object: "him", possessive: "his", possessivePronoun: "his", reflexive: "himself" };
  }
  if (normalized === "female" || normalized === "f") {
    return { subject: "she", object: "her", possessive: "her", possessivePronoun: "hers", reflexive: "herself" };
  }
  return { subject: "they", object: "them", possessive: "their", possessivePronoun: "theirs", reflexive: "themself" };
}

export function applyPronouns(template, sex) {
  const pronouns = getPronouns(sex);
  return template
    .replace(/\$\{pronoun\.subject\}/g, pronouns.subject)
    .replace(/\$\{pronoun\.object\}/g, pronouns.object)
    .replace(/\$\{pronoun\.possessive\}/g, pronouns.possessive)
    .replace(/\$\{pronoun\.possessivePronoun\}/g, pronouns.possessivePronoun)
    .replace(/\$\{pronoun\.reflexive\}/g, pronouns.reflexive);
}

export function renderBackstoryString(template, context = {}) {
  if (!template) return "";
  let result = template;
  const replacements = {
    "{characterName}": context.characterName || context.name || "",
    "{race}": context.race || "",
    "{class}": context.className || context.class || "",
    "{classLower}": (context.className || context.class || "").toLowerCase(),
    "{alignment}": context.alignment || "",
    "{location}": context.location || context.homeTown || "",
    "{originLocation}": context.originLocation || context.location || context.homeTown || "",
    "{origin_location}": context.originLocation || context.location || context.homeTown || "",
    "{shortName}": context.shortName || context.short_name || "",
    "{short_name}": context.shortName || context.short_name || "",
    "{raceDescription}": context.raceDescription || "",
    "{spawnDistrict}": context.spawnDistrict || "",
    "{district}": context.spawnDistrict || "",
    "{voiceTone}": context.voiceTone || context.voice_tone || "",
    "{signatureTool}": context.signatureTool || context.signature_tool || "",
    "{virtue}": context.virtue || "",
    "{flaw}": context.flaw || "",
    "{bond}": context.bond || "",
    "{secret}": context.secret || "",
    "{backstorySeed}": context.backstorySeed || context.backstory_seed || "",
    "{classAngleSummary}": context.classAngleSummary || "",
    "{alignmentMemory}": context.alignmentMemory || "",
    "{emberHook}": context.emberHook || "",
  };
  for (const [token, value] of Object.entries(replacements)) {
    const safeToken = escapeRegex(token);
    result = result.replace(new RegExp(safeToken, "g"), value);
  }
  if (context.sex || context.gender) {
    result = applyPronouns(result, context.sex || context.gender);
  }
  return result;
}

export function parseCurrency(value) {
  if (value && typeof value === "object" && "copper" in value) {
    return value;
  }
  if (typeof value === "number") {
    return { copper: value, silver: 0, gold: 0 };
  }
  const parts = (value || "").toString().trim();
  const result = { copper: 0, silver: 0, gold: 0 };
  if (!parts || parts === "0") return result;
  const tokens = parts.split(/\s+/);
  for (let i = 0; i < tokens.length; i += 2) {
    const amount = Number(tokens[i]);
    const unit = (tokens[i + 1] || "").toLowerCase();
    if (Number.isNaN(amount)) continue;
    if (unit.startsWith("cp")) result.copper += amount;
    else if (unit.startsWith("sp") || unit.startsWith("st")) result.silver += amount;
    else if (unit.startsWith("gp")) result.gold += amount;
  }
  return result;
}

export function currencyToCopper(value) {
  return (value.copper || 0) + (value.silver || 0) * 10 + (value.gold || 0) * 100;
}

function normalizeSpawnDistricts(entry = {}) {
  if (!entry || !Array.isArray(entry.spawnDistricts)) return [];
  return entry.spawnDistricts.filter(Boolean);
}

function normalizeBiographyParagraphs(entry = {}) {
  if (Array.isArray(entry.biographyParagraphs)) {
    return entry.biographyParagraphs.map(paragraph => normalizeWhitespace(paragraph)).filter(Boolean);
  }
  const biography = normalizeWhitespace(entry.biography || "");
  return splitParagraphs(biography);
}

function lookupCaseInsensitive(map = {}, key) {
  if (!key) return undefined;
  if (key in map) return map[key];
  const lower = key.toLowerCase();
  const matchKey = Object.keys(map).find(current => current.toLowerCase() === lower);
  if (!matchKey) return undefined;
  return map[matchKey];
}

function normalizeRaceDescriptions(source = {}) {
  const result = {};
  for (const [race, classMap] of Object.entries(source)) {
    const normalizedClassMap = {};
    if (classMap && typeof classMap === "object") {
      for (const [className, template] of Object.entries(classMap)) {
        if (typeof template === "string" && template.trim()) {
          normalizedClassMap[className] = normalizeWhitespace(template);
        }
      }
    }
    result[race] = normalizedClassMap;
  }
  return result;
}

function normalizeClassAlignmentInserts(source = {}) {
  const result = {};
  for (const [className, alignmentMap] of Object.entries(source)) {
    const normalizedAlignmentMap = {};
    if (alignmentMap && typeof alignmentMap === "object") {
      for (const [alignment, template] of Object.entries(alignmentMap)) {
        if (typeof template === "string" && template.trim()) {
          normalizedAlignmentMap[alignment] = normalizeWhitespace(template);
        }
      }
    }
    result[className] = normalizedAlignmentMap;
  }
  return result;
}

export const RACE_DESCRIPTION_REPOSITORY = normalizeRaceDescriptions(rawRaceDescriptions);
export const CLASS_ALIGNMENT_INSERT_REPOSITORY = normalizeClassAlignmentInserts(rawClassAlignmentInserts);

export const BACKSTORIES = rawBackstories.map(entry => {
  const biographyParagraphs = normalizeBiographyParagraphs(entry);
  const biography = biographyParagraphs.join("\n\n");
  return {
    ...entry,
    biography,
    biographyParagraphs,
    spawnDistricts: normalizeSpawnDistricts(entry),
  };
});

export const BACKSTORY_BY_ID = Object.fromEntries(
  BACKSTORIES.map(entry => [entry.id, entry])
);

export const LEGACY_BACKSTORY_LOOKUP = new Map();

export function getBackstoriesByCriteria(criteria = {}) {
  const { location, spawnDistrict } = criteria;
  return BACKSTORIES.filter(entry => {
    if (location && !entry.availableIn.includes(location)) return false;
    if (spawnDistrict) {
      const districts = Array.isArray(entry.spawnDistricts) ? entry.spawnDistricts : [];
      const lower = spawnDistrict.toLowerCase();
      if (
        districts.length &&
        !districts.some(district => typeof district === "string" && district.toLowerCase() === lower)
      ) {
        return false;
      }
    }
    return true;
  });
}

export function getRaceDescriptionTemplate(race, className) {
  if (!race) return "";
  const raceEntry = lookupCaseInsensitive(RACE_DESCRIPTION_REPOSITORY, race) || {};
  if (className) {
    const classTemplate = lookupCaseInsensitive(raceEntry, className);
    if (classTemplate) return classTemplate;
  }
  return lookupCaseInsensitive(raceEntry, "default") || "";
}

export function getClassAlignmentInsertTemplate(className, alignment) {
  if (!className || !alignment) return "";
  const classEntry = lookupCaseInsensitive(CLASS_ALIGNMENT_INSERT_REPOSITORY, className) || {};
  const template = lookupCaseInsensitive(classEntry, alignment);
  if (template) return template;
  return lookupCaseInsensitive(classEntry, "default") || "";
}

