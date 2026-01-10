import { characterBuilds } from "../data/game/character_builds.js";

const TIER_ONE_CLASS_NAMES = Array.from(
  new Set(
    Object.values(characterBuilds)
      .map(entry => entry?.primary)
      .filter(Boolean)
  )
);

const CLASS_GUILD_IDS = new Set(["adventurers_guild", "class_guild"]);

const PROFESSION_TRACK_BY_GUILD = {
  merchant_guild: "merchant",
  workers_guild: "workers",
  agricultural_guild: "agricultural",
  crafting_guild: "crafting",
};

const slugifyClassId = name =>
  String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const selectTierOneClass = () => {
  if (!TIER_ONE_CLASS_NAMES.length) return null;
  const index = Math.floor(Math.random() * TIER_ONE_CLASS_NAMES.length);
  return TIER_ONE_CLASS_NAMES[index] || null;
};

export function attemptGuildEntry(guildId, character) {
  const result = {
    ok: false,
    guildId: guildId || null,
    message: "",
    updates: {},
  };

  if (!guildId || !character) {
    result.message = "Guild entry is unavailable right now.";
    return result;
  }

  if (CLASS_GUILD_IDS.has(guildId)) {
    const existingClass = character.class || character.clazz || character.clazzName || null;
    if (existingClass) {
      result.message = `${existingClass} training is already part of your story.`;
      return result;
    }
    const selected = selectTierOneClass();
    if (!selected) {
      result.message = "No tier-one classes are available to join right now.";
      return result;
    }
    character.class = selected;
    character.classId = character.classId || slugifyClassId(selected);
    character.classTier = Math.max(Number(character.classTier) || 0, 1);
    result.ok = true;
    result.updates.class = selected;
    result.message = `You are welcomed into training as a ${selected}.`;
    return result;
  }

  const professionTrack = PROFESSION_TRACK_BY_GUILD[guildId] || null;
  if (!professionTrack) {
    result.message = "This guild has no entry track available yet.";
    return result;
  }
  if (character.professionTrack === professionTrack) {
    result.message = `You are already aligned with the ${professionTrack} track.`;
    return result;
  }
  character.professionTrack = professionTrack;
  result.ok = true;
  result.updates.professionTrack = professionTrack;
  result.message = `You sign on with the ${professionTrack} track.`;
  return result;
}
