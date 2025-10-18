import rawData from "../backstories_data.js";

const rawBackstories = Array.isArray(rawData?.backstories) ? rawData.backstories : [];
const rawRaceCadences = rawData?.raceCadences || {};

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

export function applyPronouns(template = "", sex) {
  const source = typeof template === "string" ? template : String(template ?? "");
  if (!source) return "";
  const pronouns = getPronouns(sex);
  const replacements = {
    subject: pronouns.subject,
    object: pronouns.object,
    possessive: pronouns.possessive,
    possessivePronoun: pronouns.possessivePronoun,
    reflexive: pronouns.reflexive,
  };

  let result = source;
  for (const [token, value] of Object.entries(replacements)) {
    const pattern = new RegExp(`\\$?\\{pronoun\\.${token}\\}`, "g");
    result = result.replace(pattern, value);
  }
  return result;
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
    "{raceDescription}": context.raceDescription || context.raceCadence || "",
    "{spawnDistrict}": context.spawnDistrict || "",
    "{district}": context.spawnDistrict || "",
    "{voiceTone}": context.voiceTone || context.voice_tone || "",
    "{signatureTool}": context.signatureTool || context.signature_tool || "",
    "{virtue}": context.virtue || "",
    "{flaw}": context.flaw || "",
    "{bond}": context.bond || "",
    "{secret}": context.secret || "",
    "{backstorySeed}": context.backstorySeed || context.backstory_seed || "",
    "{classAngleSummary}": context.classAngleSummary || context.trainingPhilosophy || "",
    "{alignmentMemory}": context.alignmentMemory || context.alignmentReflection || "",
    "{emberHook}": context.emberHook || context.rumorEcho || "",
    "{raceCadence}": context.raceCadence || "",
    "{trainingPhilosophy}": context.trainingPhilosophy || "",
    "{alignmentReflection}": context.alignmentReflection || "",
    "{rumorEcho}": context.rumorEcho || "",
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

function normalizeRaceCadences(source = {}) {
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
function normalizeBiographyBeats(entry = {}) {
  const beats = entry?.biographyBeats;
  if (!beats || typeof beats !== "object") return {};
  const normalized = {};
  for (const [key, value] of Object.entries(beats)) {
    if (typeof value === "string" && value.trim()) {
      normalized[key] = normalizeWhitespace(value);
    }
  }
  return normalized;
}

export const RACE_CADENCE_REPOSITORY = normalizeRaceCadences(rawRaceCadences);

export const BACKSTORIES = rawBackstories.map(entry => {
  const biographyParagraphs = normalizeBiographyParagraphs(entry);
  const biography = biographyParagraphs.join("\n\n");
  return {
    ...entry,
    biography,
    biographyParagraphs,
    spawnDistricts: normalizeSpawnDistricts(entry),
    biographyBeats: normalizeBiographyBeats(entry),
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

export function getRaceCadenceTemplate(race, className) {
  if (!race) return "";
  const raceEntry = lookupCaseInsensitive(RACE_CADENCE_REPOSITORY, race) || {};
  if (className) {
    const classTemplate = lookupCaseInsensitive(raceEntry, className);
    if (classTemplate) return classTemplate;
  }
  return lookupCaseInsensitive(raceEntry, "default") || "";
}

