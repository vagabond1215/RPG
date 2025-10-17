import { themeColors, getThemeColors } from "./theme_colors.js";
import { getBuildDescription } from "./character_builds.js";
import { getRaceColors } from "./race_colors.js";

export const BASE_IMAGE_PROMPT_TEMPLATE =
  "A hyper-detailed fantasy anime-style full-body portrait of a beautiful {sex} {race} dressed in tantalizing, tasteful {theme} garb in front of a neutral gray background. Reference facial features from the most attractive {sexPlural}. Typical {race} proportionality for height is about {heads} heads tall. Hair: {hair}. Skin: {skin} with light freckles. Eyes: {eyes}. Clothing is vibrant in complementary colors with accents, trim, and accessories matching theme colors only. Dynamic composition, ultra high definition, delicate details. No bulky or high coverage hats or helms.";
export const ADDON_IMAGE_PROMPT_TEMPLATE =
  "Picture Theme: {themeName} {colors}.";

export function getRacePrompt(race) {
  switch (race) {
    case 'Elf':
      return 'with slender build and pointed ears';
    case 'Dark Elf':
      return 'with slender build, dark aura, and pointed ears';
    case 'Dwarf':
      return 'with a stocky build and a braided beard';
    case 'Cait Sith':
      return 'with feline ears, whiskers, and a tail';
    case 'Salamander':
      return 'with a reptilian tail, horns, and sturdy build';
    case 'Gnome':
      return 'with a small frame and inquisitive eyes';
    case 'Halfling':
      return 'with short, nimble stature and curly hair';
    default:
      return '';
  }
}

export function buildImagePrompt({
  sex,
  sexPlural,
  race,
  hair,
  skin,
  eyes,
  themeName,
  themeDesc,
  colors,
  heads,
  appearanceNotes = '',
}) {
  const base = BASE_IMAGE_PROMPT_TEMPLATE
    .replace(/\{sex\}/g, sex.toLowerCase())
    .replace(/\{race\}/g, race.toLowerCase())
    .replace(/\{sexPlural\}/g, sexPlural.toLowerCase())
    .replace(/\{hair\}/g, hair)
    .replace(/\{skin\}/g, skin)
    .replace(/\{eyes\}/g, eyes)
    .replace(/\{theme\}/g, (themeName || '').toLowerCase())
    .replace(/\{heads\}/g, heads);
  const racePart = getRacePrompt(race);
  const addon = ADDON_IMAGE_PROMPT_TEMPLATE
    .replace('{themeName}', themeName)
    .replace('{themeDesc}', themeDesc)
    .replace('{colors}', colors);
  const appearance = appearanceNotes ? ` ${appearanceNotes.trim()}` : '';
  return racePart ? `${base} ${racePart}. ${addon}${appearance}` : `${base} ${addon}${appearance}`;
}

export function composeImagePrompt(character, backstoryAppearance) {
  const themeIndex = themeColors.find(t => t.name === character.theme)?.index;
  const pictureTheme = getThemeColors(themeIndex);
  const descriptor = getBuildDescription(character.theme);
  const raceCombo = themeIndex
    ? getRaceColors(character.race, themeIndex, character.useAltColors)
    : null;

  const skinColor = character.skinColor || raceCombo?.skin;
  const skin = skinColor || '';
  const hair = character.hairColor || raceCombo?.hair || 'brown';
  const eyes = character.eyeColor || raceCombo?.eyes || 'brown';
  const sexPlural = character.sex === 'Male' ? 'men' : 'women';
  const themeName = character.theme || '';
  const themeDesc = descriptor || '';
  const colors = pictureTheme.join(', ');
  const heads = '7.5';
  let appearanceNotes = '';

  if (backstoryAppearance) {
    const fragments = [];
    if (backstoryAppearance.summary) {
      fragments.push(backstoryAppearance.summary);
    }
    if (Array.isArray(backstoryAppearance.details) && backstoryAppearance.details.length) {
      fragments.push(`Wardrobe highlights: ${backstoryAppearance.details.join(', ')}.`);
    }
    if (Array.isArray(backstoryAppearance.motifs) && backstoryAppearance.motifs.length) {
      fragments.push(`Subtle motifs referencing ${backstoryAppearance.motifs.join(', ')}.`);
    }
    appearanceNotes = fragments.join(' ').trim();
  }

  return buildImagePrompt({
    sex: character.sex,
    sexPlural,
    race: character.race,
    hair,
    skin,
    eyes,
    themeName,
    themeDesc,
    colors,
    heads,
    appearanceNotes,
  });
}
