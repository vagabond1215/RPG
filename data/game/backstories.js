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

function isPluralEntity(context = {}) {
  if (!context || typeof context !== "object") return false;
  if (context.isPluralEntity !== undefined) return Boolean(context.isPluralEntity);
  if (context.isGroup !== undefined) return Boolean(context.isGroup);
  if (context.isPlural !== undefined) return Boolean(context.isPlural);
  if (context.pluralEntity !== undefined) return Boolean(context.pluralEntity);
  if (typeof context.groupSize === "number") return context.groupSize > 1;
  if (typeof context.partySize === "number") return context.partySize > 1;
  if (Array.isArray(context.members) && context.members.length > 1) return true;
  if (Array.isArray(context.party) && context.party.length > 1) return true;
  if (Array.isArray(context.squad) && context.squad.length > 1) return true;
  return false;
}

export function renderBackstoryString(template, context = {}) {
  if (!template) return "";
  let result = template;
  const plural = isPluralEntity(context);
  const replacements = {
    "{characterName}": context.characterName || context.name || "",
    "{race}": context.race || "",
    "{class}": context.className || context.class || "",
    "{classLower}": (context.className || context.class || "").toLowerCase(),
    "{alignment}": context.alignment || "",
    "{location}": context.location || context.homeTown || "",
    "{originLocation}": context.originLocation || context.location || context.homeTown || "",
    "{origin_location}": context.originLocation || context.location || context.homeTown || "",
    "{homeTown}": context.homeTown || context.hometown || "",
    "{hometown}": context.hometown || context.homeTown || "",
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
    "{familyName}": context.familyName || context.family_name || "",
    "{family_name}": context.family_name || context.familyName || "",
    "{mentorName}": context.mentorName || context.mentor_name || "",
    "{mentor_name}": context.mentor_name || context.mentorName || "",
    "{profession}": context.profession || context.occupation || "",
    "{occupation}": context.occupation || context.profession || "",
    "{notableEvent}": context.notableEvent || context.notable_event || "",
    "{notable_event}": context.notable_event || context.notableEvent || "",
    "{groupName}": context.groupName || context.group_name || "",
    "{group_name}": context.group_name || context.groupName || "",
    "{classAngleSummary}": context.classAngleSummary || context.trainingPhilosophy || "",
    "{alignmentMemory}": context.alignmentMemory || context.alignmentReflection || "",
    "{emberHook}": context.emberHook || context.rumorEcho || "",
    "{raceCadence}": context.raceCadence || "",
    "{trainingPhilosophy}": context.trainingPhilosophy || "",
    "{alignmentReflection}": context.alignmentReflection || "",
    "{rumorEcho}": context.rumorEcho || "",
    "{is_are}": plural ? "are" : "is",
    "{Is_are}": plural ? "Are" : "Is",
    "{has_have}": plural ? "have" : "has",
    "{Has_have}": plural ? "Have" : "Has",
    "{does_do}": plural ? "do" : "does",
    "{Does_do}": plural ? "Do" : "Does",
    "{was_were}": plural ? "were" : "was",
    "{Was_were}": plural ? "Were" : "Was",
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

function normalizeBeatTagValue(value) {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  if (!text) return undefined;
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function addBeatContextTag(target, value) {
  if (!target || !value) return;
  if (Array.isArray(value)) {
    value.forEach(entry => addBeatContextTag(target, entry));
    return;
  }
  const normalized = normalizeBeatTagValue(value);
  if (normalized) target.add(normalized);
}

function coerceBeatOption(option) {
  if (!option) return null;
  if (typeof option === "string") {
    const text = normalizeWhitespace(option);
    if (!text) return null;
    return { text };
  }
  if (typeof option === "object") {
    const rawText = option.text || option.summary;
    if (typeof rawText !== "string") return null;
    const text = normalizeWhitespace(rawText);
    if (!text) return null;
    const tags = Array.isArray(option.tags)
      ? option.tags
          .map(tag => (typeof tag === "string" || typeof tag === "number" ? String(tag).trim() : ""))
          .filter(Boolean)
      : undefined;
    return tags && tags.length ? { text, tags } : { text };
  }
  return null;
}

function normalizeBeatOptions(value) {
  if (Array.isArray(value)) {
    return value.map(option => coerceBeatOption(option)).filter(Boolean);
  }
  const option = coerceBeatOption(value);
  return option ? [option] : [];
}

function normalizeBiographyBeats(entry = {}) {
  const beats = entry?.biographyBeats;
  if (!beats || typeof beats !== "object") return {};
  const normalized = {};
  for (const [key, value] of Object.entries(beats)) {
    const options = normalizeBeatOptions(value);
    if (options.length) {
      normalized[key] = options;
    }
  }
  return normalized;
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

function gatherBeatContextTags(backstory = {}, character = {}, overrides = {}) {
  const tags = new Set();
  addBeatContextTag(tags, backstory.hook);
  addBeatContextTag(tags, backstory.availableIn);
  addBeatContextTag(tags, backstory.spawnDistricts);
  addBeatContextTag(tags, character?.location);
  addBeatContextTag(tags, character?.originLocation);
  addBeatContextTag(tags, character?.homeTown || character?.hometown);
  addBeatContextTag(tags, character?.spawnDistrict);
  addBeatContextTag(tags, overrides?.location);
  addBeatContextTag(tags, overrides?.originLocation);
  addBeatContextTag(tags, overrides?.homeTown || overrides?.hometown);
  addBeatContextTag(tags, overrides?.spawnDistrict);
  return tags;
}

function selectBeatOption(beat, contextTags) {
  if (!beat) return null;
  const options = normalizeBeatOptions(beat);
  if (!options.length) return null;
  if (contextTags && contextTags.size) {
    const prioritized = options.find(option =>
      Array.isArray(option.tags)
        ? option.tags.some(tag => contextTags.has(normalizeBeatTagValue(tag)))
        : false
    );
    if (prioritized) return prioritized;
  }
  return options[0];
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
  const { location } = criteria;
  return BACKSTORIES.filter(entry => {
    if (location && !entry.availableIn.includes(location)) return false;
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

export function createBiographyBeatContext(backstory, character, overrides = {}) {
  return gatherBeatContextTags(backstory, character, overrides);
}

export function chooseBiographyBeatOption(beat, contextTags) {
  return selectBeatOption(beat, contextTags);
}

export function registerBiographyBeatTags(contextTags, tags) {
  if (!contextTags || !Array.isArray(tags)) return;
  for (const tag of tags) {
    const normalized = normalizeBeatTagValue(tag);
    if (normalized) contextTags.add(normalized);
  }
}

