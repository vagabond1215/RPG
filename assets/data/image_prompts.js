export const BASE_IMAGE_PROMPT_TEMPLATE = 'Full body portrait of a {sex} {race}{skinDesc}, {hair} hair and {eyes} eyes, {height} tall, standing in {location}';
export const ADDON_IMAGE_PROMPT_TEMPLATE = 'Picture Theme: {themeText}.';

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

export function buildImagePrompt({ sex, race, skinDesc, hair, eyes, height, location, themeText }) {
  const base = BASE_IMAGE_PROMPT_TEMPLATE
    .replace('{sex}', sex.toLowerCase())
    .replace('{race}', race.toLowerCase())
    .replace('{skinDesc}', skinDesc ? ` with ${skinDesc}` : '')
    .replace('{hair}', hair)
    .replace('{eyes}', eyes)
    .replace('{height}', height)
    .replace('{location}', location);
  const racePart = getRacePrompt(race);
  const addon = ADDON_IMAGE_PROMPT_TEMPLATE.replace('{themeText}', themeText);
  return racePart ? `${base}, ${racePart}. ${addon}` : `${base}. ${addon}`;
}
