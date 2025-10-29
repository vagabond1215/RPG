import {
  renderBackstoryString,
  BACKSTORY_BY_ID,
  getBackstoriesByCriteria,
  getRaceCadenceTemplate,
  getPronouns,
  createBiographyBeatContext,
  registerBiographyBeatTags,
} from "../data/game/backstories.js";
import {
  createEmptyCurrency,
  DENOMINATIONS,
  convertCurrency,
  fromIron,
  parseCurrency,
} from "../data/economy/currency.js";
import { getAnglesForRaceClass } from "../data/game/race_class_angles.js";

const REQUIRED_BACKSTORY_INPUTS = ["name", "race", "sex", "class", "alignment", "location"];

function hasRequiredBackstoryInputs(character) {
  if (!character) return false;
  return REQUIRED_BACKSTORY_INPUTS.every(key => Boolean(character[key]));
}

function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function computeShortName(name) {
  if (!name) return "";
  const trimmed = name.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/);
  return parts[0] || trimmed;
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function selectVerb(pronouns, singular, plural) {
  const subject = pronouns?.subject?.toLowerCase();
  return subject === "they" ? plural : singular;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isSentenceStart(text, offset) {
  if (offset === 0) return true;
  const prior = text.slice(0, offset).trimEnd();
  if (!prior) return true;
  return /[.!?]$/.test(prior);
}

function capClassTokenUsage(paragraphs, className) {
  if (!className) return paragraphs;
  const regex = new RegExp(escapeRegex(className), "gi");
  const substitutes = ["the path", "the vocation", "the calling"];
  let count = 0;
  return paragraphs.map(paragraph =>
    paragraph.replace(regex, (match, offset, text) => {
      count += 1;
      if (count <= 2) return match;
      let replacement = substitutes[(count - 3) % substitutes.length];
      if (!replacement) return match;
      if (match[0] === match[0].toUpperCase()) replacement = capitalize(replacement);
      if (isSentenceStart(text, offset)) replacement = capitalize(replacement);
      return replacement;
    })
  );
}

const CURRENCY_KEY_ALIASES = {
  ci: "coldIron",
  st: "steel",
  cp: "copper",
  sp: "silver",
  gp: "gold",
  pp: "platinum",
};

function sanitizeCurrencyRecord(value) {
  if (!isPlainObject(value)) {
    return createEmptyCurrency();
  }
  const sanitized = createEmptyCurrency();
  for (const denom of DENOMINATIONS) {
    const amount = Number(value[denom]);
    sanitized[denom] = Number.isFinite(amount) && amount > 0 ? Math.floor(amount) : 0;
  }
  return sanitized;
}

function normalizeCurrencyValue(value) {
  if (isPlainObject(value)) {
    const normalized = createEmptyCurrency();
    for (const [key, rawAmount] of Object.entries(value)) {
      const denom = DENOMINATIONS.includes(key) ? key : CURRENCY_KEY_ALIASES[key] || null;
      if (!denom) continue;
      const amount = Number(rawAmount);
      if (!Number.isFinite(amount)) continue;
      normalized[denom] = Math.max(0, Math.floor(amount));
    }
    return normalized;
  }
  if (typeof value === "string") {
    const parsed = parseCurrency(value);
    return { ...createEmptyCurrency(), ...parsed };
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    const iron = convertCurrency(Math.max(0, value), "copper", "coldIron");
    if (typeof iron === "number" && Number.isFinite(iron)) {
      return { ...createEmptyCurrency(), ...fromIron(Math.floor(Math.max(0, iron))) };
    }
  }
  return createEmptyCurrency();
}

function mergeStringList(existing, additions) {
  const result = [];
  const seen = new Set();
  const append = value => {
    if (typeof value !== "string") return;
    const trimmed = value.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push(trimmed);
  };
  if (Array.isArray(existing)) {
    existing.forEach(append);
  }
  if (Array.isArray(additions)) {
    additions.forEach(append);
  }
  return result;
}

function mergeNumericTable(existing, updates) {
  const result = {};
  if (isPlainObject(existing)) {
    for (const [rawKey, rawValue] of Object.entries(existing)) {
      if (typeof rawKey !== "string") continue;
      const key = rawKey.trim();
      if (!key) continue;
      const numeric = Number(rawValue);
      if (!Number.isFinite(numeric)) continue;
      result[key] = Math.max(0, Math.floor(numeric));
    }
  }
  if (isPlainObject(updates)) {
    for (const [rawKey, rawValue] of Object.entries(updates)) {
      if (typeof rawKey !== "string") continue;
      const key = rawKey.trim();
      if (!key) continue;
      const numeric = Number(rawValue);
      if (!Number.isFinite(numeric)) continue;
      const coerced = Math.max(0, Math.floor(numeric));
      result[key] = result[key] ? Math.max(result[key], coerced) : coerced;
    }
  }
  return result;
}

function applyLoadoutToCharacter(character, loadout = {}, options = {}) {
  if (!character || !isPlainObject(loadout)) {
    return;
  }

  character.money = sanitizeCurrencyRecord(character.money);
  if (loadout.currency) {
    const grant = normalizeCurrencyValue(loadout.currency);
    if (options.reset) {
      character.money = { ...grant };
    } else {
      for (const denom of DENOMINATIONS) {
        character.money[denom] += grant[denom] || 0;
      }
    }
  }

  const inventory = Array.isArray(character.inventory) ? [...character.inventory] : [];
  const inventorySet = new Set(
    inventory
      .filter(item => typeof item === "string")
      .map(item => item.trim().toLowerCase())
      .filter(Boolean)
  );

  if (options.reset) {
    const deduped = [];
    const dedupSet = new Set();
    for (const entry of inventory) {
      if (typeof entry === "string") {
        const trimmed = entry.trim();
        if (!trimmed) continue;
        const key = trimmed.toLowerCase();
        if (dedupSet.has(key)) continue;
        dedupSet.add(key);
        deduped.push(trimmed);
      } else {
        deduped.push(entry);
      }
    }
    inventory.length = 0;
    inventory.push(...deduped);
    inventorySet.clear();
    deduped
      .filter(item => typeof item === "string")
      .forEach(item => inventorySet.add(item.toLowerCase()));
  }

  const loadoutItems = [];
  if (Array.isArray(loadout.items)) loadout.items.forEach(item => loadoutItems.push(item));
  if (Array.isArray(loadout.equipment)) loadout.equipment.forEach(item => loadoutItems.push(item));

  for (const entry of loadoutItems) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (inventorySet.has(key)) continue;
    inventory.push(trimmed);
    inventorySet.add(key);
  }

  character.inventory = inventory;

  character.skills = mergeStringList(character.skills, loadout.skills);
  character.combatTraining = mergeStringList(character.combatTraining, loadout.combatTraining);
  character.craftProficiencies = mergeNumericTable(character.craftProficiencies, loadout.craftProficiencies);
  character.gatheringProficiencies = mergeNumericTable(
    character.gatheringProficiencies,
    loadout.gatheringProficiencies
  );
}

function gatherNarrativeDefaults(character = {}, overrides = {}) {
  const shortName = overrides.shortName || character.shortName || computeShortName(character.name);
  const voiceTone = overrides.voiceTone || overrides.voice_tone || character.voiceTone || "steady";
  const signatureTool =
    overrides.signatureTool || overrides.signature_tool || character.signatureTool || "trusted kit";
  const virtue = overrides.virtue || character.virtue || "resolve";
  const flaw = overrides.flaw || character.flaw || "stubbornness";
  const bond = overrides.bond || character.bond || "neighbors";
  const secret = overrides.secret || character.secret || "an unspoken promise";
  const backstorySeed =
    overrides.backstorySeed ||
    overrides.backstory_seed ||
    character.backstorySeed ||
    "a weathered ledger";
  return {
    shortName,
    voiceTone,
    signatureTool,
    virtue,
    flaw,
    bond,
    secret,
    backstorySeed,
  };
}

function buildClassPhilosophy(race, className, signatureTool, pronouns, shortName) {
  const angles = getAnglesForRaceClass(race, className);
  if (!angles.length) return "";
  const focus = shortName || capitalize(pronouns?.subject || "");
  const pronounSubject = pronouns?.subject ? capitalize(pronouns.subject) : "";
  const pronounPossessive = pronouns?.possessive || "their";
  const repeatVerb = pronouns?.subject && pronouns.subject.toLowerCase() === "they" ? "repeat" : "repeats";
  const fragments = [];
  fragments.push(
    `${focus} treated ${angles[0]} like a sunrise drill, steadying ${pronounPossessive} breath before the city stirred.`
  );
  if (angles[1]) {
    fragments.push(
      `${pronounSubject} bound ${angles[1]} to ${signatureTool}, promising every apprentice that craft mattered more than spectacle.`
    );
  }
  if (angles[2]) {
    fragments.push(`${pronounSubject} still ${repeatVerb} ${angles[2]} when dusk lessons drift toward doubt.`);
  }
  return fragments.join(" ").trim();
}

const ALIGNMENT_REFLECTION_BUILDERS = {
  "Lawful Good": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} once audited guild ledgers with ${context.signatureTool}, refusing to abandon ${context.bond} when a magistrate ordered silence. ${pronounSubject} still ${selectVerb(pronouns, "believes", "believe")} ${context.virtue} only breathes when the law bends toward mercy.`;
  },
  "Neutral Good": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} diverted a shipment to feed ${context.bond} after a flood, trading ${context.signatureTool} repairs for loaves. ${pronounSubject} still ${selectVerb(pronouns, "weighs", "weigh")} that night as proof that quiet kindness outruns protocol.`;
  },
  "Chaotic Good": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} broke a curfew bell with ${context.signatureTool} so refugees could slip through the gate, laughing when fines rained down. ${pronounSubject} still ${selectVerb(pronouns, "grins", "grin")} at the scar and ${selectVerb(pronouns, "calls", "call")} it ${context.virtue} with teeth.`;
  },
  "Lawful Neutral": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} once enforced a tribunal verdict against ${context.bond}, polishing ${context.signatureTool} until the hall doors opened. ${pronounSubject} still ${selectVerb(pronouns, "studies", "study")} the paperwork, reminding ${pronouns.object} that order is only honest when questioned.`;
  },
  "True Neutral": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} weighed a smugglers' tithe against a flooded granary and split the haul, recording both debts beside ${context.signatureTool}. ${pronounSubject} still ${selectVerb(pronouns, "keeps", "keep")} the ledger open to that page in case the balance tilts again.`;
  },
  "Chaotic Neutral": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} vanished from duty to chase a rumor tied to ${context.backstorySeed}, trusting ${context.signatureTool} to talk through any fallout. ${pronounSubject} still ${selectVerb(pronouns, "shrugs", "shrug")} at the reprimand and ${selectVerb(pronouns, "calls", "call")} freedom the only honest compass.`;
  },
  "Lawful Evil": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} doctored warrants with ${context.signatureTool}, binding rivals to crushing debts in the name of stability. ${pronounSubject} still ${selectVerb(pronouns, "tallies", "tally")} the profits beside ${context.bond}, certain that dominance is just another clause.`;
  },
  "Neutral Evil": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} sold a patrol route for coin, financing personal schemes with ${context.signatureTool} tucked beneath a cloak. ${pronounSubject} still ${selectVerb(pronouns, "calls", "call")} it pragmatism and lets ${context.flaw} masquerade as foresight.`;
  },
  "Chaotic Evil": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} carved threats into dock pilings with ${context.signatureTool}, daring ${context.bond} to defy the new order. ${pronounSubject} still ${selectVerb(pronouns, "enjoys", "enjoy")} how fear eclipsed caution and wears ${context.flaw} like armor.`;
  },
};

function createAlignmentReflection(context, pronouns, shortName, selectedBeatText) {
  const builder = ALIGNMENT_REFLECTION_BUILDERS[context.alignment] || ((ctx, pr, sn) => {
    const subject = sn || capitalize(pr.subject);
    const pronounSubject = capitalize(pr.subject);
    return `${subject} brokered a quiet favor using ${ctx.signatureTool}, weighing ${ctx.virtue} against ${ctx.flaw}. ${pronounSubject} still ${selectVerb(pr, "replays", "replay")} the choice whenever whispers of ${ctx.backstorySeed} return.`;
  });
  const reflection = builder(context, pronouns, shortName);
  if (!selectedBeatText) {
    return reflection;
  }
  const combined = `${selectedBeatText} ${reflection}`.replace(/\s+/g, " ").trim();
  return combined || reflection;
}

function createLingeringRumor(context, pronouns, shortName, selectedBeatText) {
  const subject = shortName || capitalize(pronouns.subject);
  const pronounSubject = capitalize(pronouns.subject);
  const rumor = `Rumors still coil around ${context.backstorySeed}, tucked where ${subject} trusted ${pronouns.possessive} ${context.signatureTool} to hide a promise. ${pronounSubject} still ${selectVerb(pronouns, "wonders", "wonder")} if naming ${context.secret} would heal ${context.bond} or scatter ${context.virtue}.`;
  if (!selectedBeatText) {
    return rumor;
  }
  const combined = `${selectedBeatText} ${rumor}`.replace(/\s+/g, " ").trim();
  return combined || rumor;
}

function normalizeBeatGroups(beat) {
  if (!beat) return [];
  if (Array.isArray(beat)) {
    const containsNested = beat.some(entry => Array.isArray(entry));
    if (containsNested) {
      return beat.flatMap(entry => normalizeBeatGroups(entry)).filter(group => group.length);
    }
    return [beat.filter(Boolean)];
  }
  return [[beat]].filter(group => group.length && group[0]);
}

function getSelectionStore(character) {
  if (!character || typeof character !== "object") return {};
  const existing = character.backstorySelectionIndices || character.backstorySelections;
  if (existing && typeof existing === "object") {
    return { ...existing };
  }
  const nested = character.backstory && typeof character.backstory === "object" ? character.backstory.selectedBeatIndices : null;
  if (nested && typeof nested === "object") {
    return { ...nested };
  }
  return {};
}

function normalizeSelectionValue(value) {
  if (Array.isArray(value)) {
    return value.map(entry => (typeof entry === "number" && Number.isInteger(entry) ? entry : null));
  }
  if (typeof value === "number" && Number.isInteger(value)) {
    return [value];
  }
  return [];
}

function updateSelectionStore(store, key, indices) {
  if (!store) return;
  if (!Array.isArray(indices)) {
    store[key] = [];
    return;
  }
  store[key] = indices.map(index => (typeof index === "number" && Number.isInteger(index) ? index : null));
}

function registerContextTags(beatContextTags, ...sources) {
  sources.flat().filter(Boolean).forEach(tag => {
    registerBiographyBeatTags(beatContextTags, [tag]);
  });
}

function evaluateBeatGroup(options, contextTags) {
  if (!Array.isArray(options) || !options.length) return [];
  return options.map((option, index) => {
    const normalizedTags = Array.isArray(option?.tags)
      ? option.tags
          .map(tag => (typeof tag === "string" || typeof tag === "number" ? String(tag).trim() : ""))
          .filter(Boolean)
      : [];
    const matches = normalizedTags.some(tag => contextTags?.has(tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")));
    return {
      index,
      option,
      matches,
      tags: normalizedTags,
    };
  });
}

function renderBeatOption(option, character, overrides) {
  if (!option) return "";
  return renderBackstoryTextForCharacter(option.text, character, overrides);
}

function postProcessParagraphs(paragraphs, context) {
  if (!Array.isArray(paragraphs)) return [];
  let processed = paragraphs.slice();
  if (processed.length > 4) {
    const kept = processed.slice(0, 3);
    const merged = processed.slice(3).join(" ").trim();
    if (merged) kept.push(merged);
    processed = kept;
  }
  processed = capClassTokenUsage(processed, context.className);
  return processed.filter(Boolean);
}

function resolveRaceCadenceTemplate(backstory, character) {
  const race = character?.race;
  if (!race) return backstory?.raceCadence || "";
  const className = character?.class;
  const cadences = backstory?.raceCadences;
  if (cadences && typeof cadences === "object") {
    const directKey = race in cadences ? race : Object.keys(cadences).find(key => key.toLowerCase() === race.toLowerCase());
    const direct = directKey ? cadences[directKey] : undefined;
    if (typeof direct === "string") return direct;
    if (direct && typeof direct === "object") {
      if (className && direct[className]) return direct[className];
      if (className) {
        const classKey = Object.keys(direct).find(key => key.toLowerCase() === className.toLowerCase());
        if (classKey) return direct[classKey];
      }
      if (direct.default) return direct.default;
    }
  }
  return getRaceCadenceTemplate(race, className);
}

function resolveRaceCadence(backstory, character, overrides = {}) {
  const template = resolveRaceCadenceTemplate(backstory, character);
  if (!template) return "";
  const contextOverrides = { ...overrides };
  delete contextOverrides.raceCadence;
  return renderBackstoryTextForCharacter(template, character, contextOverrides);
}

function pickSpawnDistrict(backstory, cityDefault = "") {
  const allowed = Array.isArray(backstory?.allowedDistricts)
    ? backstory.allowedDistricts.filter(Boolean)
    : [];
  const fallback = Array.isArray(backstory?.spawnDistricts)
    ? backstory.spawnDistricts.filter(Boolean)
    : [];
  const pool = allowed.length ? allowed : fallback.length ? fallback : cityDefault ? [cityDefault] : [];
  if (!pool.length) return "";
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

function resolveSpawnDistrict(backstory, character) {
  const existing = character?.spawnDistrict;
  if (existing) return existing;
  return pickSpawnDistrict(backstory, "Upper Ward");
}

function coalesce(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}

function determineIsGroupEntity(character = {}, overrides = {}) {
  if (overrides?.isGroup !== undefined) return Boolean(overrides.isGroup);
  if (overrides?.isPlural !== undefined) return Boolean(overrides.isPlural);
  if (overrides?.pluralEntity !== undefined) return Boolean(overrides.pluralEntity);
  if (character?.isGroup !== undefined) return Boolean(character.isGroup);
  if (character?.isPlural !== undefined) return Boolean(character.isPlural);
  if (character?.pluralEntity !== undefined) return Boolean(character.pluralEntity);
  if (typeof overrides?.groupSize === "number") return overrides.groupSize > 1;
  if (typeof character?.groupSize === "number") return character.groupSize > 1;
  if (typeof overrides?.partySize === "number") return overrides.partySize > 1;
  if (typeof character?.partySize === "number") return character.partySize > 1;
  if (Array.isArray(overrides?.members) && overrides.members.length > 1) return true;
  if (Array.isArray(character?.members) && character.members.length > 1) return true;
  if (Array.isArray(character?.party) && character.party.length > 1) return true;
  if (Array.isArray(character?.squad) && character.squad.length > 1) return true;
  return false;
}

export function renderBackstoryTextForCharacter(text, character, overrides = {}) {
  if (!text) return "";
  const narrative = gatherNarrativeDefaults(character, overrides);
  const homeTown =
    coalesce(
      overrides.homeTown,
      overrides.hometown,
      character?.homeTown,
      character?.hometown,
      overrides.originLocation,
      character?.originLocation
    ) || character?.location;
  const familyName = coalesce(overrides.familyName, overrides.family_name, character?.familyName);
  const mentorName = coalesce(overrides.mentorName, overrides.mentor_name, character?.mentorName);
  const profession = coalesce(
    overrides.profession,
    overrides.occupation,
    character?.profession,
    character?.occupation
  );
  const notableEvent = coalesce(
    overrides.notableEvent,
    overrides.notable_event,
    character?.notableEvent,
    character?.notable_event
  );
  const groupName = coalesce(
    overrides.groupName,
    overrides.group_name,
    character?.groupName,
    character?.group_name,
    character?.collectiveName
  );
  const isGroupEntity = determineIsGroupEntity(character, overrides);
  const context = {
    characterName: character?.name,
    name: character?.name,
    race: character?.race,
    className: character?.class,
    class: character?.class,
    alignment: character?.alignment,
    location: character?.location,
    originLocation: homeTown || character?.location,
    homeTown,
    hometown: homeTown,
    sex: character?.sex,
    gender: character?.sex,
    spawnDistrict:
      overrides.spawnDistrict || character?.spawnDistrict || character?.backstory?.spawnDistrict,
    shortName: narrative.shortName,
    short_name: narrative.shortName,
    voiceTone: narrative.voiceTone,
    signatureTool: narrative.signatureTool,
    virtue: narrative.virtue,
    flaw: narrative.flaw,
    bond: narrative.bond,
    secret: narrative.secret,
    backstorySeed: narrative.backstorySeed,
    familyName,
    family_name: familyName,
    mentorName,
    mentor_name: mentorName,
    profession,
    occupation: profession,
    notableEvent,
    notable_event: notableEvent,
    groupName,
    group_name: groupName,
    isGroup: isGroupEntity,
    isPluralEntity: overrides.isPluralEntity ?? character?.isPluralEntity ?? isGroupEntity,
    groupSize: overrides.groupSize ?? character?.groupSize,
    raceCadence: overrides.raceCadence || character?.raceCadence,
    trainingPhilosophy: overrides.trainingPhilosophy || character?.trainingPhilosophy,
    alignmentReflection: overrides.alignmentReflection || character?.alignmentReflection,
    rumorEcho: overrides.rumorEcho || character?.rumorEcho,
  };
  Object.assign(context, overrides);
  return renderBackstoryString(text, context);
}

export function buildBackstoryInstance(backstory, character) {
  if (!backstory) return null;
  const spawnDistrict = character?.spawnDistrict || resolveSpawnDistrict(backstory, character);
  const narrativeDefaults = gatherNarrativeDefaults(character, { spawnDistrict });
  const pronouns = getPronouns(character?.sex);
  const requiredReady = hasRequiredBackstoryInputs(character);

  const baseOverrides = {
    spawnDistrict,
    shortName: narrativeDefaults.shortName,
    voiceTone: narrativeDefaults.voiceTone,
    signatureTool: narrativeDefaults.signatureTool,
    virtue: narrativeDefaults.virtue,
    flaw: narrativeDefaults.flaw,
    bond: narrativeDefaults.bond,
    secret: narrativeDefaults.secret,
    backstorySeed: narrativeDefaults.backstorySeed,
  };

  let raceCadence = "";
  let trainingPhilosophy = "";
  let alignmentReflection = "";
  let rumorEcho = "";
  let biographyParagraphs = [];

  if (requiredReady) {
    raceCadence = resolveRaceCadence(backstory, character, baseOverrides);
    trainingPhilosophy = buildClassPhilosophy(
      character?.race,
      character?.class,
      narrativeDefaults.signatureTool,
      pronouns,
      narrativeDefaults.shortName
    );

    const sharedOverrides = {
      ...baseOverrides,
      raceCadence,
      trainingPhilosophy,
    };

    const beats = backstory.biographyBeats || {};
    const beatContextTags = createBiographyBeatContext(backstory, character, sharedOverrides);
    registerContextTags(
      beatContextTags,
      backstory?.hook,
      backstory?.availableIn,
      character?.class,
      character?.race,
      character?.alignment,
      character?.sex
    );

    const selectionStore = getSelectionStore(character);
    const beatChoices = {};
    const selectedBeatIndices = {};

    const selectBeatGroup = (key, beat) => {
      const groups = normalizeBeatGroups(beat);
      if (!groups.length) {
        beatChoices[key] = { groups: [], selectedIndices: [] };
        selectedBeatIndices[key] = [];
        return [];
      }

      const storedSelections = normalizeSelectionValue(selectionStore[key]);
      const renderedGroups = [];
      const indices = [];
      const metadataGroups = [];

      groups.forEach((options, groupIndex) => {
        if (!Array.isArray(options) || !options.length) {
          indices[groupIndex] = null;
          metadataGroups.push({ options: [], selectedIndex: null });
          return;
        }

        const evaluated = evaluateBeatGroup(options, beatContextTags);
        if (!evaluated.length) {
          indices[groupIndex] = null;
          metadataGroups.push({ options: [], selectedIndex: null });
          return;
        }

        const matching = evaluated.filter(entry => entry.matches);
        const candidatePool = matching.length ? matching : evaluated;

        let storedIndex = storedSelections[groupIndex];
        if (storedIndex != null && (!Number.isInteger(storedIndex) || storedIndex < 0 || storedIndex >= evaluated.length)) {
          storedIndex = null;
        }

        let selected = storedIndex != null ? evaluated.find(entry => entry.index === storedIndex) : null;
        if (!selected && storedIndex != null) {
          selected = evaluated[storedIndex] ? evaluated[storedIndex] : null;
        }
        if (!selected) {
          selected = candidatePool[0] || evaluated[0];
        }

        const selectedIndex = selected ? selected.index : null;
        indices[groupIndex] = selectedIndex;

        if (selected?.option?.tags) {
          registerBiographyBeatTags(beatContextTags, selected.option.tags);
        }

        const renderedText = selected ? renderBeatOption(selected.option, character, sharedOverrides) : "";
        if (renderedText) {
          renderedGroups.push(renderedText);
        }

        const renderedCandidates = candidatePool.map(entry => ({
          index: entry.index,
          matches: entry.matches,
          tags: entry.tags.slice(),
          text: renderBeatOption(entry.option, character, sharedOverrides),
        }));

        metadataGroups.push({ options: renderedCandidates, selectedIndex });
      });

      updateSelectionStore(selectionStore, key, indices);
      beatChoices[key] = { groups: metadataGroups, selectedIndices: indices.slice() };
      selectedBeatIndices[key] = indices.slice();
      return renderedGroups;
    };

    const earlyLifeTexts = selectBeatGroup("earlyLife", beats.earlyLife);
    const trainingTexts = selectBeatGroup("training", beats.training);
    const moralTestTexts = selectBeatGroup("moralTest", beats.moralTest);
    const lingeringRumorTexts = selectBeatGroup("lingeringRumor", beats.lingeringRumor);

    const alignmentContext = {
      ...narrativeDefaults,
      alignment: character?.alignment,
      spawnDistrict,
    };

    const selectedMoralText = moralTestTexts.join(" ").trim();
    alignmentReflection = createAlignmentReflection(
      alignmentContext,
      pronouns,
      narrativeDefaults.shortName,
      selectedMoralText
    );

    const selectedRumorText = lingeringRumorTexts.join(" ").trim();
    rumorEcho = createLingeringRumor(alignmentContext, pronouns, narrativeDefaults.shortName, selectedRumorText);

    biographyParagraphs = [
      earlyLifeTexts.join(" ").trim(),
      [trainingTexts.join(" ").trim(), raceCadence, trainingPhilosophy]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
      alignmentReflection,
      rumorEcho,
    ];

    biographyParagraphs = postProcessParagraphs(biographyParagraphs, {
      fullName: character?.name,
      shortName: narrativeDefaults.shortName,
      pronouns,
      className: character?.class,
    });

    if (character && typeof character === "object") {
      character.backstorySelectionIndices = selectionStore;
      character.backstorySelections = selectionStore;
    }

    baseOverrides.selectedBeatIndices = selectedBeatIndices;
    baseOverrides.beatChoices = beatChoices;
  } else {
    biographyParagraphs = [
      "Backstory locked: select race, sex, class, alignment, and origin location to reveal a tailored biography.",
    ];
  }

  const renderOverrides = {
    ...baseOverrides,
    raceCadence,
    trainingPhilosophy,
    alignmentReflection,
    rumorEcho,
  };

  const biography = biographyParagraphs.join("\n\n");
  return {
    id: backstory.id,
    title: renderBackstoryTextForCharacter(backstory.title, character, renderOverrides),
    characterName: renderBackstoryTextForCharacter(backstory.characterName, character, renderOverrides),
    race: renderBackstoryTextForCharacter(backstory.race, character, renderOverrides) || "",
    class: renderBackstoryTextForCharacter(backstory.class, character, renderOverrides) || "",
    alignment: renderBackstoryTextForCharacter(backstory.alignment, character, renderOverrides) || "",
    availableIn: [...(backstory.availableIn || [])],
    biography,
    biographyParagraphs,
    spawnDistrict,
    raceCadence,
    trainingPhilosophy,
    alignmentReflection,
    rumorEcho,
    selectedBeatIndices: renderOverrides.selectedBeatIndices || {},
    beatChoices: renderOverrides.beatChoices || null,
    hooks: Array.isArray(backstory.hooks) ? backstory.hooks.map(hook => ({ ...hook })) : [],
  };
}

export function applyBackstoryLoadout(character, backstory, options = {}) {
  if (!character || !backstory) return character;
  if (options.reset) {
    delete character.backstory;
    delete character.backstoryId;
    delete character.raceDescription;
    delete character.classAlignmentInsert;
    delete character.alignmentMemory;
    delete character.emberHook;
    delete character.classAngleSummary;
    delete character.raceCadence;
    delete character.trainingPhilosophy;
    delete character.alignmentReflection;
    delete character.rumorEcho;
    delete character.backstoryHookIndex;
  }
  const districtsSource = Array.isArray(backstory.allowedDistricts) && backstory.allowedDistricts.length
    ? backstory.allowedDistricts
    : backstory.spawnDistricts;
  const districts = Array.isArray(districtsSource) ? districtsSource.filter(Boolean) : [];
  if (districts.length) {
    const existing = character.spawnDistrict;
    const lowerExisting = existing ? existing.toLowerCase() : null;
    const matched = lowerExisting
      ? districts.find(district => district.toLowerCase() === lowerExisting)
      : null;
    if (matched) {
      character.spawnDistrict = matched;
    } else {
      character.spawnDistrict = pickSpawnDistrict({ allowedDistricts: districts });
    }
  } else if (options.reset) {
    delete character.spawnDistrict;
  }
  const instance = buildBackstoryInstance(backstory, character);
  character.backstoryId = backstory.id;
  character.backstory = instance;
  if (instance) {
    character.raceCadence = instance.raceCadence;
    character.trainingPhilosophy = instance.trainingPhilosophy;
    character.alignmentReflection = instance.alignmentReflection;
    character.rumorEcho = instance.rumorEcho;
  }
  if (backstory.loadout) {
    applyLoadoutToCharacter(character, backstory.loadout, options);
  }
  return character;
}

export function ensureBackstoryInstance(character) {
  if (!character) return null;
  if (character.backstory && typeof character.backstory === "object" && character.backstory.id) {
    character.backstoryId = character.backstory.id;
    return character.backstory;
  }

  if (character.backstoryId) {
    const match = BACKSTORY_BY_ID[character.backstoryId];
    if (match) {
      character.backstory = buildBackstoryInstance(match, character);
      return character.backstory;
    }
  }

  return null;
}

export function resolveBackstoryById(id) {
  return BACKSTORY_BY_ID[id] || null;
}

export function resolveLegacyBackstory() {
  return null;
}

export function getBackstoriesForLocation(location, criteria = {}) {
  const primary = getBackstoriesByCriteria({
    location,
    race: criteria.race,
    className: criteria.className,
    alignment: criteria.alignment,
  });
  if (primary.length || (!criteria.race && !criteria.className && !criteria.alignment)) {
    return primary;
  }
  return getBackstoriesByCriteria({ location });
}
