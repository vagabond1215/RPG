import { BACKSTORIES } from "../data/game/backstories.ts";
import fs from "fs";
import path from "path";

const helpers = `export function getPronouns(sex) {
  const normalized = sex ? sex.toLowerCase() : undefined;
  if (normalized === 'male' || normalized === 'm') {
    return { subject: 'he', object: 'him', possessive: 'his', possessivePronoun: 'his', reflexive: 'himself' };
  }
  if (normalized === 'female' || normalized === 'f') {
    return { subject: 'she', object: 'her', possessive: 'her', possessivePronoun: 'hers', reflexive: 'herself' };
  }
  return { subject: 'they', object: 'them', possessive: 'their', possessivePronoun: 'theirs', reflexive: 'themself' };
}

export function applyPronouns(template, sex) {
  const pronouns = getPronouns(sex);
  return template
    .replace(/\\$\\{pronoun\\.subject\\}/g, pronouns.subject)
    .replace(/\\$\\{pronoun\\.object\\}/g, pronouns.object)
    .replace(/\\$\\{pronoun\\.possessive\\}/g, pronouns.possessive)
    .replace(/\\$\\{pronoun\\.possessivePronoun\\}/g, pronouns.possessivePronoun)
    .replace(/\\$\\{pronoun\\.reflexive\\}/g, pronouns.reflexive);
}

export function renderBackstoryString(template, context = {}) {
  if (!template) return '';
  let value = template;
  if (context.race) {
    value = value.replace(/\\$\\{race\\}/g, context.race);
  }
  if (context.sex) {
    value = value.replace(/\\$\\{sex\\}/g, context.sex);
  }
  return applyPronouns(value, context.sex || 'unknown');
}

export function parseCurrency(value) {
  if (value && typeof value === 'object' && 'copper' in value) {
    return value;
  }
  if (typeof value === 'number') {
    return { copper: value, silver: 0, gold: 0 };
  }
  const parts = (value || '').toString().trim();
  const result = { copper: 0, silver: 0, gold: 0 };
  if (!parts || parts === '0') return result;
  const tokens = parts.split(/\\s+/);
  for (let i = 0; i < tokens.length; i += 2) {
    const amount = Number(tokens[i]);
    const unit = (tokens[i + 1] || '').toLowerCase();
    if (Number.isNaN(amount)) continue;
    if (unit.startsWith('cp')) result.copper += amount;
    else if (unit.startsWith('sp') || unit.startsWith('st')) result.silver += amount;
    else if (unit.startsWith('gp')) result.gold += amount;
  }
  return result;
}

export function currencyToCopper(value) {
  return value.copper + value.silver * 10 + value.gold * 100;
}

export function addCurrency(a, b) {
  return { copper: a.copper + b.copper, silver: a.silver + b.silver, gold: a.gold + b.gold };
}
`;

const sanitizedBackstories = BACKSTORIES;
const json = JSON.stringify(sanitizedBackstories, null, 2);
const body = `${helpers}\nexport const BACKSTORIES = ${json};\n\nexport const BACKSTORY_BY_ID = Object.fromEntries(BACKSTORIES.map(backstory => [backstory.id, backstory]));\n\nexport const LEGACY_BACKSTORY_LOOKUP = new Map(\n  BACKSTORIES.flatMap(backstory => backstory.legacyBackgrounds.map(name => [name, backstory]))\n);\n`;

const output = "// Auto-generated backstory catalog\n" + body;
fs.writeFileSync(path.resolve("data/game/backstories.js"), output);
