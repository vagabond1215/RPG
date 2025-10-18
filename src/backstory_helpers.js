import {
  renderBackstoryString,
  BACKSTORY_BY_ID,
  getBackstoriesByCriteria,
  getRaceDescriptionTemplate,
  getClassAlignmentInsertTemplate,
  getPronouns,
} from "../data/game/backstories.js";
import { getAnglesForRaceClass } from "../data/game/race_class_angles.js";

const REQUIRED_BACKSTORY_INPUTS = ["name", "race", "sex", "class", "alignment", "location", "spawnDistrict"];

function hasRequiredBackstoryInputs(character) {
  if (!character) return false;
  return REQUIRED_BACKSTORY_INPUTS.every(key => Boolean(character[key]));
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isSentenceStart(text, offset) {
  if (offset === 0) return true;
  const prior = text.slice(0, offset).trimEnd();
  if (!prior) return true;
  return /[.!?]$/.test(prior);
}

function reduceNameRepetition(paragraphs, fullName, shortName, pronouns) {
  if (!fullName) return paragraphs;
  const regex = new RegExp(escapeRegex(fullName), "g");
  const alternatives = [shortName, pronouns ? capitalize(pronouns.subject) : "", pronouns ? pronouns.subject : ""]
    .filter(Boolean);
  if (!alternatives.length) return paragraphs;
  let count = 0;
  return paragraphs.map(paragraph =>
    paragraph.replace(regex, (match, offset, text) => {
      count += 1;
      if (count === 1) return match;
      const replacement = alternatives[(count - 2) % alternatives.length];
      if (!replacement) return match;
      if (isSentenceStart(text, offset)) {
        return capitalize(replacement);
      }
      return replacement;
    })
  );
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

function buildClassAngleSummary(race, className, signatureTool, pronouns, shortName) {
  const angles = getAnglesForRaceClass(race, className);
  if (!angles.length) return "";
  const focus = shortName || capitalize(pronouns?.subject || "");
  const pronounSubject = pronouns?.subject ? capitalize(pronouns.subject) : "";
  const fragments = [];
  fragments.push(`${focus} treated ${angles[0]} as a daily ritual.`);
  if (angles[1]) {
    fragments.push(`${pronounSubject} tied ${angles[1]} to ${signatureTool}, letting repetition temper instinct.`);
  }
  if (angles[2]) {
    fragments.push(`${pronounSubject} still quotes ${angles[2]} whenever apprentices ask for guidance.`);
  }
  return fragments.join(" ").trim();
}

const ALIGNMENT_MEMORY_BUILDERS = {
  "Lawful Good": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} once audited guild ledgers with ${context.signatureTool}, refusing to abandon ${context.bond} when a magistrate ordered silence. ${pronounSubject} called it ${context.virtue} in practice, and the margin notes still bear ${pronouns.possessive} steady script.`;
  },
  "Neutral Good": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} diverted a shipment to feed ${context.bond} after a flood, trading ${context.signatureTool} repairs for loaves. ${pronounSubject} accepted the reprimand because ${pronouns.subject} believed ${context.virtue} outweighed decorum.`;
  },
  "Chaotic Good": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} broke a curfew bell with ${context.signatureTool} so refugees could slip through the gate, laughing when fines rained down. ${pronounSubject} later patched the damage and swore it kept ${context.virtue} alive in the district.`;
  },
  "Lawful Neutral": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} once enforced a tribunal verdict against ${context.bond}, polishing ${context.signatureTool} until the hall doors opened. ${pronounSubject} filed the appeal anyway, convinced that order only held if every clause was tested.`;
  },
  "True Neutral": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} weighed a smugglers' tithe against a flooded granary and split the haul, recording both debts beside ${context.signatureTool}. ${pronounSubject} slept soundly because the balance, not affection, guided the choice.`;
  },
  "Chaotic Neutral": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} vanished from duty to chase a rumor tied to ${context.backstorySeed}, trusting ${context.signatureTool} to talk through any fallout. ${pronounSubject} shrugged off censure, claiming freedom kept the work honest.`;
  },
  "Lawful Evil": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} doctored warrants with ${context.signatureTool}, binding rivals to crushing debts in the name of stability. ${pronounSubject} logged every profit beside ${context.bond}, proof that dominance could masquerade as duty.`;
  },
  "Neutral Evil": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} sold a patrol route for coin, financing personal schemes with ${context.signatureTool} tucked beneath a cloak. ${pronounSubject} called it pragmatism and let ${context.flaw} grow into a habit.`;
  },
  "Chaotic Evil": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} carved threats into dock pilings with ${context.signatureTool}, daring ${context.bond} to defy the new order. ${pronounSubject} reveled when fear eclipsed caution, wearing ${context.flaw} like armor.`;
  },
};

function createAlignmentMemory(context, pronouns, shortName) {
  const builder = ALIGNMENT_MEMORY_BUILDERS[context.alignment] || ((ctx, pr, sn) => {
    const subject = sn || capitalize(pr.subject);
    const pronounSubject = capitalize(pr.subject);
    return `${subject} brokered a quiet favor using ${ctx.signatureTool}, weighing ${ctx.virtue} against ${ctx.flaw}. ${pronounSubject} still studies the choice whenever whispers of ${ctx.backstorySeed} return.`;
  });
  return builder(context, pronouns, shortName);
}

function createEmberHook(context, pronouns, shortName) {
  const subject = shortName || capitalize(pronouns.subject);
  const pronounSubject = capitalize(pronouns.subject);
  return `Rumor lingered around ${context.backstorySeed}, tucked where ${subject} believed only ${pronouns.possessive} ${context.signatureTool} would ever reach. ${pronounSubject} guarded ${context.secret} out of ${context.virtue}, even as ${pronouns.subject} feared ${context.flaw} would fracture ${context.bond}.`;
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
  processed = reduceNameRepetition(processed, context.fullName, context.shortName, context.pronouns);
  processed = capClassTokenUsage(processed, context.className);
  return processed.filter(Boolean);
}

function resolveRaceDescriptionTemplate(backstory, character) {
  const race = character?.race;
  if (!race) return backstory?.raceDescription || "";
  const className = character?.class;
  const descriptions = backstory?.raceDescriptions;
  if (descriptions && typeof descriptions === "object") {
    const directKey = race in descriptions ? race : Object.keys(descriptions).find(key => key.toLowerCase() === race.toLowerCase());
    const direct = directKey ? descriptions[directKey] : undefined;
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
  return getRaceDescriptionTemplate(race, className);
}

function resolveClassAlignmentTemplate(backstory, character) {
  const className = character?.class;
  const alignment = character?.alignment;
  if (!className || !alignment) return backstory?.classAlignmentInsert || "";
  const inserts = backstory?.classAlignmentInserts;
  if (inserts && typeof inserts === "object") {
    const classKey = className in inserts ? className : Object.keys(inserts).find(key => key.toLowerCase() === className.toLowerCase());
    const classEntry = classKey ? inserts[classKey] : undefined;
    if (typeof classEntry === "string") return classEntry;
    if (classEntry && typeof classEntry === "object") {
      if (classEntry[alignment]) return classEntry[alignment];
      const alignmentKey = Object.keys(classEntry).find(key => key.toLowerCase() === alignment.toLowerCase());
      if (alignmentKey) return classEntry[alignmentKey];
      if (classEntry.default) return classEntry.default;
    }
  }
  return getClassAlignmentInsertTemplate(className, alignment);
}

function resolveRaceDescription(backstory, character, overrides = {}) {
  const template = resolveRaceDescriptionTemplate(backstory, character);
  if (!template) return "";
  const contextOverrides = { ...overrides };
  delete contextOverrides.raceDescription;
  delete contextOverrides.classAlignmentInsert;
  return renderBackstoryTextForCharacter(template, character, contextOverrides);
}

function resolveClassAlignmentInsert(backstory, character, overrides = {}) {
  const template = resolveClassAlignmentTemplate(backstory, character);
  if (!template) return "";
  const contextOverrides = { ...overrides };
  delete contextOverrides.classAlignmentInsert;
  return renderBackstoryTextForCharacter(template, character, contextOverrides);
}

function resolveSpawnDistrict(backstory, character) {
  const existing = character?.spawnDistrict;
  if (existing) return existing;
  const districts = Array.isArray(backstory?.spawnDistricts) ? backstory.spawnDistricts : [];
  return districts[0] || "";
}

export function renderBackstoryTextForCharacter(text, character, overrides = {}) {
  if (!text) return "";
  const narrative = gatherNarrativeDefaults(character, overrides);
  const context = {
    characterName: character?.name,
    name: character?.name,
    race: character?.race,
    className: character?.class,
    class: character?.class,
    alignment: character?.alignment,
    location: character?.location,
    originLocation: character?.location,
    sex: character?.sex,
    gender: character?.sex,
    spawnDistrict: overrides.spawnDistrict || character?.spawnDistrict,
    raceDescription: overrides.raceDescription || character?.raceDescription,
    classAlignmentInsert: overrides.classAlignmentInsert || character?.classAlignmentInsert,
    shortName: narrative.shortName,
    short_name: narrative.shortName,
    voiceTone: narrative.voiceTone,
    signatureTool: narrative.signatureTool,
    virtue: narrative.virtue,
    flaw: narrative.flaw,
    bond: narrative.bond,
    secret: narrative.secret,
    backstorySeed: narrative.backstorySeed,
    classAngleSummary: overrides.classAngleSummary,
    alignmentMemory: overrides.alignmentMemory,
    emberHook: overrides.emberHook,
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

  let classAngleSummary = "";
  let raceDescription = "";
  let alignmentMemory = "";
  let classAlignmentInsert = "";
  let emberHook = "";

  let overrides = {
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

  let biographyParagraphs = [];

  if (requiredReady) {
    classAngleSummary = buildClassAngleSummary(
      character?.race,
      character?.class,
      narrativeDefaults.signatureTool,
      pronouns,
      narrativeDefaults.shortName
    );

    const raceOverrides = { ...overrides, classAngleSummary };
    raceDescription = resolveRaceDescription(backstory, character, raceOverrides);

    const alignmentContext = {
      ...narrativeDefaults,
      alignment: character?.alignment,
      spawnDistrict,
    };
    alignmentMemory = createAlignmentMemory(alignmentContext, pronouns, narrativeDefaults.shortName);

    classAlignmentInsert = resolveClassAlignmentInsert(backstory, character, {
      ...raceOverrides,
      raceDescription,
      alignmentMemory,
    });

    emberHook = createEmberHook(alignmentContext, pronouns, narrativeDefaults.shortName);

    overrides = {
      ...raceOverrides,
      raceDescription,
      classAlignmentInsert,
      alignmentMemory,
      classAngleSummary,
      emberHook,
    };

    biographyParagraphs = Array.isArray(backstory.biographyParagraphs)
      ? backstory.biographyParagraphs
          .map(paragraph => renderBackstoryTextForCharacter(paragraph, character, overrides))
          .filter(Boolean)
      : [];

    biographyParagraphs = postProcessParagraphs(biographyParagraphs, {
      fullName: character?.name,
      shortName: narrativeDefaults.shortName,
      pronouns,
      className: character?.class,
    });
  } else {
    biographyParagraphs = [
      "Backstory locked: select race, sex, class, alignment, origin location, and district to reveal a tailored biography.",
    ];
  }

  const biography = biographyParagraphs.join("\n\n");
  return {
    id: backstory.id,
    title: renderBackstoryTextForCharacter(backstory.title, character, overrides),
    characterName: renderBackstoryTextForCharacter(backstory.characterName, character, overrides),
    race: renderBackstoryTextForCharacter(backstory.race, character, overrides) || "",
    class: renderBackstoryTextForCharacter(backstory.class, character, overrides) || "",
    alignment: renderBackstoryTextForCharacter(backstory.alignment, character, overrides) || "",
    availableIn: [...(backstory.availableIn || [])],
    biography,
    biographyParagraphs,
    spawnDistrict,
    raceDescription,
    classAlignmentInsert,
    alignmentMemory,
    classAngleSummary,
    emberHook,
  };
}

export function applyBackstoryLoadout(character, backstory, options = {}) {
  if (!character || !backstory) return character;
  if (options.reset) {
    delete character.backstory;
    delete character.backstoryId;
  }
  const districts = Array.isArray(backstory.spawnDistricts) ? backstory.spawnDistricts.filter(Boolean) : [];
  if (districts.length) {
    const existing = character.spawnDistrict;
    const lowerExisting = existing ? existing.toLowerCase() : null;
    const matched = lowerExisting
      ? districts.find(district => district.toLowerCase() === lowerExisting)
      : null;
    if (matched) {
      character.spawnDistrict = matched;
    } else {
      const index = Math.floor(Math.random() * districts.length);
      character.spawnDistrict = districts[index];
    }
  } else if (options.reset) {
    delete character.spawnDistrict;
  }
  const overrides = {
    spawnDistrict: character.spawnDistrict,
    raceDescription: resolveRaceDescription(backstory, character, {
      spawnDistrict: character.spawnDistrict,
    }),
    classAlignmentInsert: resolveClassAlignmentInsert(backstory, character, {
      spawnDistrict: character.spawnDistrict,
    }),
  };
  if (overrides.raceDescription) {
    character.raceDescription = overrides.raceDescription;
  } else if (options.reset) {
    delete character.raceDescription;
  }
  if (overrides.classAlignmentInsert) {
    character.classAlignmentInsert = overrides.classAlignmentInsert;
  } else if (options.reset) {
    delete character.classAlignmentInsert;
  }
  const instance = buildBackstoryInstance(backstory, character);
  character.backstoryId = backstory.id;
  character.backstory = instance;
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
    spawnDistrict: criteria.spawnDistrict,
  });
  if (
    primary.length ||
    (!criteria.race && !criteria.className && !criteria.alignment && !criteria.spawnDistrict)
  ) {
    return primary;
  }
  return getBackstoriesByCriteria({ location });
}
