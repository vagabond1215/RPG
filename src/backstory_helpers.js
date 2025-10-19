import {
  renderBackstoryString,
  BACKSTORY_BY_ID,
  getBackstoriesByCriteria,
  getRaceCadenceTemplate,
  getPronouns,
} from "../data/game/backstories.js";
import { getAnglesForRaceClass } from "../data/game/race_class_angles.js";

const REQUIRED_BACKSTORY_INPUTS = ["name", "race", "sex", "class", "alignment", "location"];

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

function createAlignmentReflection(context, pronouns, shortName) {
  const builder = ALIGNMENT_REFLECTION_BUILDERS[context.alignment] || ((ctx, pr, sn) => {
    const subject = sn || capitalize(pr.subject);
    const pronounSubject = capitalize(pr.subject);
    return `${subject} brokered a quiet favor using ${ctx.signatureTool}, weighing ${ctx.virtue} against ${ctx.flaw}. ${pronounSubject} still ${selectVerb(pr, "replays", "replay")} the choice whenever whispers of ${ctx.backstorySeed} return.`;
  });
  return builder(context, pronouns, shortName);
}

function createLingeringRumor(context, pronouns, shortName) {
  const subject = shortName || capitalize(pronouns.subject);
  const pronounSubject = capitalize(pronouns.subject);
  return `Rumors still coil around ${context.backstorySeed}, tucked where ${subject} trusted ${pronouns.possessive} ${context.signatureTool} to hide a promise. ${pronounSubject} still ${selectVerb(pronouns, "wonders", "wonder")} if naming ${context.secret} would heal ${context.bond} or scatter ${context.virtue}.`;
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

function resolveSpawnDistrict(backstory, character) {
  const existing = character?.spawnDistrict;
  if (existing) return existing;
  const districts = Array.isArray(backstory?.spawnDistricts) ? backstory.spawnDistricts : [];
  return districts[0] || "";
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

    const alignmentContext = {
      ...narrativeDefaults,
      alignment: character?.alignment,
      spawnDistrict,
    };
    alignmentReflection = createAlignmentReflection(alignmentContext, pronouns, narrativeDefaults.shortName);
    rumorEcho = createLingeringRumor(alignmentContext, pronouns, narrativeDefaults.shortName);

    const sharedOverrides = {
      ...baseOverrides,
      raceCadence,
      trainingPhilosophy,
      alignmentReflection,
      rumorEcho,
    };

    const beats = backstory.biographyBeats || {};
    const combineBeat = (beat, ...additional) => {
      const rendered = renderBackstoryTextForCharacter(beat, character, sharedOverrides);
      return [rendered, ...additional]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    };

    biographyParagraphs = [
      combineBeat(beats.earlyLife),
      combineBeat(beats.training, raceCadence, trainingPhilosophy),
      combineBeat(beats.moralTest, alignmentReflection),
      combineBeat(beats.lingeringRumor, rumorEcho),
    ];

    biographyParagraphs = postProcessParagraphs(biographyParagraphs, {
      fullName: character?.name,
      shortName: narrativeDefaults.shortName,
      pronouns,
      className: character?.class,
    });
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
  const instance = buildBackstoryInstance(backstory, character);
  character.backstoryId = backstory.id;
  character.backstory = instance;
  if (instance) {
    character.raceCadence = instance.raceCadence;
    character.trainingPhilosophy = instance.trainingPhilosophy;
    character.alignmentReflection = instance.alignmentReflection;
    character.rumorEcho = instance.rumorEcho;
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
