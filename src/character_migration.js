import { BACKSTORY_BY_ID } from "../data/game/backstories.js";
import { JOBS, getJobById } from "../data/game/jobs.js";

export const DEFAULT_JOB_ID = "fledgling-adventurer";

export const normalizeLegacyJobKey = value => String(value || "").trim().toLowerCase();

export function createLegacyJobIdMap(backstoryById = BACKSTORY_BY_ID, jobs = JOBS) {
  const map = new Map();
  if (Array.isArray(jobs)) {
    jobs.forEach(job => {
      if (!job?.id) return;
      map.set(normalizeLegacyJobKey(job.id), job.id);
      if (job.name) {
        map.set(normalizeLegacyJobKey(job.name), job.id);
      }
    });
  }
  const entries = Object.values(backstoryById || {});
  entries.forEach(entry => {
    if (!entry || !entry.id) return;
    const jobId = entry.id;
    map.set(normalizeLegacyJobKey(jobId), jobId);
    if (entry.title) {
      map.set(normalizeLegacyJobKey(entry.title), jobId);
    }
    if (typeof entry.hook === "string" && entry.hook.trim()) {
      map.set(normalizeLegacyJobKey(entry.hook), jobId);
    }
    if (Array.isArray(entry.legacyBackgrounds)) {
      entry.legacyBackgrounds.forEach(bg => {
        if (bg) map.set(normalizeLegacyJobKey(bg), jobId);
      });
    }
    if (Array.isArray(entry.hooks)) {
      entry.hooks.forEach(hook => {
        if (hook?.id) map.set(normalizeLegacyJobKey(hook.id), jobId);
        if (hook?.label) map.set(normalizeLegacyJobKey(hook.label), jobId);
      });
    }
  });
  return map;
}

export const LEGACY_JOB_ID_MAP = createLegacyJobIdMap();

export function resolveLegacyJobId(
  jobId,
  { legacyJobIdMap = LEGACY_JOB_ID_MAP, defaultJobId = DEFAULT_JOB_ID, getJobByIdFn = getJobById } = {}
) {
  const normalized = normalizeLegacyJobKey(jobId);
  if (!normalized) return null;
  const mapped = legacyJobIdMap.get(normalized);
  if (mapped) return mapped;
  if (getJobByIdFn(jobId)) return jobId;
  return defaultJobId;
}

export function migrateCharacter(
  character,
  {
    legacyJobIdMap = LEGACY_JOB_ID_MAP,
    defaultJobId = DEFAULT_JOB_ID,
    getJobByIdFn = getJobById,
    schemaVersion = 2,
    isDevBuild = false,
    warn = console.warn,
  } = {}
) {
  if (!character || typeof character !== "object") return character;
  const version = Number(character.schemaVersion ?? character.saveVersion ?? 0);
  if (version < 2) {
    delete character.class;
    character.classId = null;
    delete character.jobId;
    delete character.chosenJobId;
  }
  if (version < schemaVersion && character.jobId) {
    const resolved = resolveLegacyJobId(character.jobId, {
      legacyJobIdMap,
      defaultJobId,
      getJobByIdFn,
    });
    if (resolved && resolved !== character.jobId) {
      const normalized = normalizeLegacyJobKey(character.jobId);
      if (resolved === defaultJobId && !legacyJobIdMap.has(normalized) && isDevBuild) {
        warn(`Unknown legacy jobId "${character.jobId}" detected. Defaulting to "${defaultJobId}".`);
      }
      character.jobId = resolved;
    }
  }
  character.schemaVersion = schemaVersion;
  return character;
}

export function migrateDraft(
  draft,
  {
    legacyJobIdMap = LEGACY_JOB_ID_MAP,
    defaultJobId = DEFAULT_JOB_ID,
    getJobByIdFn = getJobById,
    draftVersion = 3,
    isDevBuild = false,
    warn = console.warn,
  } = {}
) {
  if (!draft || typeof draft !== "object") return draft;
  const version = Number(draft.draftVersion ?? draft.schemaVersion ?? 0);
  if (version < 3) {
    delete draft.class;
    draft.classId = null;
    delete draft.jobId;
    delete draft.chosenJobId;
  }
  draft.draftVersion = draftVersion;
  return draft;
}
