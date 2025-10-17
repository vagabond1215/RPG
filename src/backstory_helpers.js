import { createEmptyCurrency } from "../data/economy/currency.js";
import {
  renderBackstoryString,
  BACKSTORY_BY_ID,
  LEGACY_BACKSTORY_LOOKUP,
} from "../data/game/backstories.js";

function cloneLoadout(loadout = {}) {
  const currency = loadout.currency ? { ...loadout.currency } : { copper: 0, silver: 0, gold: 0 };
  return {
    currency,
    items: [...(loadout.items || [])],
    equipment: [...(loadout.equipment || [])],
    skills: [...(loadout.skills || [])],
    craftProficiencies: { ...(loadout.craftProficiencies || {}) },
    gatheringProficiencies: { ...(loadout.gatheringProficiencies || {}) },
    combatTraining: [...(loadout.combatTraining || [])],
  };
}

export function renderBackstoryTextForCharacter(text, character) {
  if (!text) return "";
  return renderBackstoryString(text, { race: character?.race, sex: character?.sex });
}

function renderBackstoryList(values = [], character) {
  return values
    .map(value => renderBackstoryTextForCharacter(value, character))
    .filter(Boolean);
}

export function buildBackstoryInstance(backstory, character) {
  if (!backstory) return null;
  const originNotes = backstory.origin?.notes || [];
  const originObligations = backstory.origin?.obligations || [];
  const currentNotes = backstory.currentSituation?.notes || [];
  const currentObligations = backstory.currentSituation?.obligations || [];

  return {
    id: backstory.id,
    title: backstory.title,
    locations: [...(backstory.locations || [])],
    legacyBackgrounds: [...(backstory.legacyBackgrounds || [])],
    origin: {
      summary: renderBackstoryTextForCharacter(backstory.origin?.summary || "", character),
      hometown: backstory.origin?.hometown || null,
      notes: renderBackstoryList(originNotes, character),
      obligations: renderBackstoryList(originObligations, character),
    },
    currentSituation: {
      summary: renderBackstoryTextForCharacter(backstory.currentSituation?.summary || "", character),
      sceneHook: renderBackstoryTextForCharacter(backstory.currentSituation?.sceneHook || "", character),
      obligations: renderBackstoryList(currentObligations, character),
      hometown: backstory.currentSituation?.hometown || null,
      notes: renderBackstoryList(currentNotes, character),
    },
    motivation: renderBackstoryList(backstory.motivation || [], character),
    appearance: {
      summary: renderBackstoryTextForCharacter(backstory.appearance?.summary || "", character),
      details: renderBackstoryList(backstory.appearance?.details || [], character),
      motifs: [...(backstory.appearance?.motifs || [])],
    },
    themes: [...(backstory.themes || [])],
    responsibilities: renderBackstoryList(backstory.responsibilities || [], character),
    defaultClassOptions: [...(backstory.defaultClassOptions || [])],
    alignmentBias: backstory.alignmentBias ? { ...backstory.alignmentBias } : null,
    jobBranching: backstory.jobBranching
      ? {
          startingRole: backstory.jobBranching.startingRole,
          advancement: [...(backstory.jobBranching.advancement || [])],
          sidePaths: [...(backstory.jobBranching.sidePaths || [])],
        }
      : null,
    loadout: cloneLoadout(backstory.loadout || {}),
  };
}

function mergeUnique(list = [], additions = []) {
  const set = new Set(list);
  for (const item of additions) {
    if (!set.has(item)) {
      list.push(item);
      set.add(item);
    }
  }
  return list;
}

function mergeCurrency(target, source) {
  const merged = { ...target };
  for (const [denom, amount] of Object.entries(source || {})) {
    merged[denom] = (merged[denom] || 0) + amount;
  }
  return merged;
}

function assignProficiencies(character, table = {}) {
  if (!character || !table) return;
  for (const [skill, value] of Object.entries(table)) {
    if (typeof value !== "number") continue;
    if (skill in character) {
      character[skill] = Math.max(character[skill] || 0, value);
    } else {
      character[skill] = value;
    }
  }
}

export function applyBackstoryLoadout(character, backstory, options = {}) {
  if (!character || !backstory) return character;
  const { reset = false } = options;

  if (reset) {
    character.level = 1;
    character.xp = 0;
  }

  character.backstoryId = backstory.id;
  character.backstory = buildBackstoryInstance(backstory, character);

  if (reset || !Array.isArray(character.responsibilities) || character.responsibilities.length === 0) {
    character.responsibilities = [...(character.backstory?.responsibilities || [])];
  } else {
    mergeUnique(character.responsibilities, character.backstory?.responsibilities || []);
  }

  if (reset || !Array.isArray(character.defaultClassOptions)) {
    character.defaultClassOptions = [...(backstory.defaultClassOptions || [])];
  } else {
    mergeUnique(character.defaultClassOptions, backstory.defaultClassOptions || []);
  }

  const loadout = backstory.loadout || {};
  const ensureArray = (key, values) => {
    if (reset || !Array.isArray(character[key])) {
      character[key] = [...values];
    } else {
      mergeUnique(character[key], values);
    }
  };

  ensureArray("inventory", loadout.items || []);
  if (reset || !Array.isArray(character.startingSkills)) {
    character.startingSkills = [...(loadout.skills || [])];
  } else {
    mergeUnique(character.startingSkills, loadout.skills || []);
  }
  if (reset || !Array.isArray(character.startingEquipment)) {
    character.startingEquipment = [...(loadout.equipment || [])];
  } else {
    mergeUnique(character.startingEquipment, loadout.equipment || []);
  }

  const baseCurrency = character.money && typeof character.money === "object"
    ? character.money
    : createEmptyCurrency();
  character.money = reset
    ? { ...createEmptyCurrency(), ...(loadout.currency || {}) }
    : mergeCurrency(baseCurrency, loadout.currency || {});

  assignProficiencies(character, loadout.craftProficiencies);
  assignProficiencies(character, loadout.gatheringProficiencies);
  assignProficiencies(character, loadout.combatTraining);

  return character;
}

export function ensureBackstoryInstance(character) {
  if (!character) return null;
  if (character.backstory && typeof character.backstory === "object" && character.backstory.id) {
    character.backstoryId = character.backstory.id;
    return character.backstory;
  }

  const legacyName =
    typeof character.backstory === "string"
      ? character.backstory
      : character.backstory?.background || character.backstory?.title;

  if (legacyName) {
    const match = LEGACY_BACKSTORY_LOOKUP.get(legacyName);
    if (match) {
      character.backstoryId = match.id;
      character.backstory = buildBackstoryInstance(match, character);
      return character.backstory;
    }
    return null;
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

export function resolveLegacyBackstory(name) {
  return LEGACY_BACKSTORY_LOOKUP.get(name) || null;
}

export function getBackstoriesForLocation(location, idsByLocation) {
  const lists = idsByLocation || {};
  const ids = lists[location] || [];
  return ids.map(id => BACKSTORY_BY_ID[id]).filter(Boolean);
}
