import { themeColors, getThemeColors } from "./theme_colors.js";
import { getThemeDescription } from "./theme_descriptions.js";
import { getRaceColors } from "./race_colors.js";

export const BASE_IMAGE_PROMPT_TEMPLATE =
  "A hyper-detailed fantasy Anime-style full-body portrait of a handsome {sex} {race} dressed in tantalizing, tasteful garb in front of a neutral gray background. Reference facial features from the most attractive {sexPlural}. Human proportionality for height is about 7.5 heads tall. Hair: {hair}. Skin: {skin} with light freckles. Eyes: {eyes}. Clothing is vibrant, complementary colors contrasting hair and skin tones with accents, trim, and accessories. Dynamic composition, ultra high definition, delicate details. No hat. No weapon.";
export const ADDON_IMAGE_PROMPT_TEMPLATE =
  "Picture Theme: {themeName} — {themeDesc} — {colors}.";

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

export function buildImagePrompt({ sex, sexPlural, race, hair, skin, eyes, themeName, themeDesc, colors }) {
  const base = BASE_IMAGE_PROMPT_TEMPLATE
    .replace('{sex}', sex.toLowerCase())
    .replace('{race}', race.toLowerCase())
    .replace('{sexPlural}', sexPlural.toLowerCase())
    .replace('{hair}', hair)
    .replace('{skin}', skin)
    .replace('{eyes}', eyes);
  const racePart = getRacePrompt(race);
  const addon = ADDON_IMAGE_PROMPT_TEMPLATE
    .replace('{themeName}', themeName)
    .replace('{themeDesc}', themeDesc)
    .replace('{colors}', colors);
  return racePart ? `${base} ${racePart}. ${addon}` : `${base} ${addon}`;
}

export function composeImagePrompt(character) {
  const themeIndex = themeColors.find(t => t.name === character.theme)?.index;
  const pictureTheme = getThemeColors(themeIndex);
  const descriptor = getThemeDescription(character.theme);
  const raceCombo = themeIndex ? getRaceColors(character.race, themeIndex) : null;

  const skinColor = character.skinColor || raceCombo?.skin;
  const skin = skinColor || '';
  const hair = character.hairColor || raceCombo?.hair || 'brown';
  const eyes = character.eyeColor || raceCombo?.eyes || 'brown';
  const sexPlural = character.sex === 'Male' ? 'men' : 'women';
  const themeName = character.theme || '';
  const themeDesc = descriptor || '';
  const colors = pictureTheme.join(', ');

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
  });
}
