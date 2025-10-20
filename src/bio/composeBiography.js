import { buildBackstoryInstance } from "../backstory_helpers.js";

/**
 * @typedef {Object} BioCharacter
 * @property {string} name
 * @property {string} race
 * @property {"male"|"female"|"nonbinary"|string} sex
 * @property {string} clazz
 * @property {string} alignment
 */

/**
 * @typedef {Object} BioContext
 * @property {"waves_break"} cityId
 * @property {string} districtId
 * @property {BioCharacter} character
 * @property {Object} backstory
 * @property {Object} hook
 */

function sanitizeHook(hook, backstory) {
  if (hook && typeof hook === "object" && hook.label) {
    return hook;
  }
  const hooks = Array.isArray(backstory?.hooks) ? backstory.hooks : [];
  if (hooks.length) return hooks[0];
  const fallbackLabel = typeof backstory?.hook === "string" ? backstory.hook.trim() : "";
  return fallbackLabel
    ? { id: fallbackLabel.replace(/\s+/g, "-").toLowerCase(), label: fallbackLabel }
    : { id: "default", label: "" };
}

function normalizeCharacter(ctx) {
  const character = ctx?.character || {};
  const resolved = {
    name: character.name || "",
    race: character.race || "",
    sex: character.sex || character.gender || "",
    class: character.class || character.clazz || character.clazzName || "",
    clazz: character.clazz || character.class || "",
    alignment: character.alignment || "",
  };
  if (!resolved.name && character.fullName) {
    resolved.name = character.fullName;
  }
  return resolved;
}

export function composeBiography(ctx) {
  if (!ctx || !ctx.backstory) return "";
  const hook = sanitizeHook(ctx.hook, ctx.backstory);
  const character = normalizeCharacter(ctx);
  const workingCharacter = {
    name: character.name,
    race: character.race,
    sex: character.sex,
    class: character.clazz || character.class,
    alignment: character.alignment,
    location: ctx.backstory?.availableIn?.[0] || "Wave's Break",
    spawnDistrict: ctx.districtId || "",
    backstoryId: ctx.backstory.id,
    backstory: ctx.backstory,
    backstoryHookId: hook?.id || null,
  };

  if (Array.isArray(ctx.backstory?.allowedDistricts) && ctx.backstory.allowedDistricts.length && !workingCharacter.spawnDistrict) {
    workingCharacter.spawnDistrict = ctx.backstory.allowedDistricts[0];
  }

  const instance = buildBackstoryInstance(ctx.backstory, workingCharacter);
  if (!instance) return "";

  const paragraphs = Array.isArray(instance.biographyParagraphs)
    ? instance.biographyParagraphs
    : typeof instance.biography === "string"
    ? instance.biography.split(/\n\s*\n/)
    : [];

  return paragraphs.filter(Boolean).join("\n\n");
}

export default composeBiography;
