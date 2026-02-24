import { matchProficienciesInText, type ProficiencyMatch } from "./proficiencies.js";

export interface QuestSkillRequirement {
  raw: string;
  proficiencies: ProficiencyMatch[];
}

export type QuestChoiceOutcomeType = 'success' | 'failure' | 'complication';

export interface QuestChoiceOutcome {
  type: QuestChoiceOutcomeType;
  narrative: string;
  rewardNote?: string;
  consequence?: string;
}

export interface QuestChoiceModifier {
  label: string;
  modifier: number;
  proficiencies?: string[];
  minimum?: number;
  condition?: string;
}

export interface QuestChoice {
  key: string;
  label: string;
  description?: string;
  baseChance: number;
  chanceModifiers?: QuestChoiceModifier[];
  outcomes: QuestChoiceOutcome[];
  proficiencies?: string[];
  helperMatches?: ProficiencyMatch[];
}

export type QuestField =
  | 'title'
  | 'description'
  | 'location'
  | 'requirements'
  | 'conditions'
  | 'timeline'
  | 'risks'
  | 'reward';

export function questHelper(details: Record<string, any>) {
  const required: QuestField[] = ['title','description','location','requirements','conditions','timeline','risks','reward'];
  const quest: Record<string, any> = { ...details };
  required.forEach(field => {
    if (quest[field] === undefined) {
      console.warn(`Quest missing ${field}`);
      quest[field] = null;
    }
  });
  if (Array.isArray(quest.requirements)) {
    const skillRequirements = quest.requirements
      .filter((req: unknown): req is string => typeof req === 'string')
      .map((raw: string) => {
        const proficiencies = matchProficienciesInText(raw);
        return proficiencies.length
          ? ({ raw, proficiencies } as QuestSkillRequirement)
          : null;
      })
      .filter((entry): entry is QuestSkillRequirement => entry !== null);
    if (skillRequirements.length > 0) {
      quest.skillRequirements = skillRequirements;
    }
  }
  if (Array.isArray(quest.choices)) {
    quest.choices = annotateQuestChoices(quest.choices);
  }
  return quest;
}

export function annotateQuestChoices(choices: QuestChoice[]): QuestChoice[] {
  if (!Array.isArray(choices)) return [];
  const seen = new Set<string>();
  return choices
    .map((choice) => normalizeQuestChoice(choice))
    .filter((choice): choice is QuestChoice => {
      if (!choice) return false;
      if (seen.has(choice.key)) return false;
      seen.add(choice.key);
      return true;
    });
}

function normalizeQuestChoice(choice: QuestChoice): QuestChoice | null {
  if (!choice || typeof choice !== 'object') return null;
  const key = String(choice.key || choice.label || 'approach')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'approach';
  const label = typeof choice.label === 'string' && choice.label.trim().length
    ? choice.label.trim()
    : 'Approach';
  const baseChance = clampProbability(
    typeof choice.baseChance === 'number' && Number.isFinite(choice.baseChance)
      ? choice.baseChance
      : 0.5,
  );
  const description = typeof choice.description === 'string'
    ? choice.description.trim()
    : undefined;
  const proficiencies = Array.isArray(choice.proficiencies)
    ? choice.proficiencies
        .map((value) => (typeof value === 'string' ? value.trim() : ''))
        .filter((value) => value.length > 0)
    : undefined;
  const chanceModifiers = Array.isArray(choice.chanceModifiers)
    ? choice.chanceModifiers
        .map((modifier) => normalizeChanceModifier(modifier))
        .filter((modifier): modifier is QuestChoiceModifier => modifier !== null)
    : undefined;
  const outcomes = normalizeOutcomes(choice.outcomes);
  const helperMatches = matchProficienciesInText(
    [label, description, ...(proficiencies || [])].filter(Boolean).join(' '),
  );
  return {
    key,
    label,
    description,
    baseChance,
    chanceModifiers,
    outcomes,
    proficiencies,
    helperMatches: helperMatches.length ? helperMatches : undefined,
  };
}

function normalizeChanceModifier(modifier: QuestChoiceModifier): QuestChoiceModifier | null {
  if (!modifier || typeof modifier !== 'object') return null;
  const label = typeof modifier.label === 'string' && modifier.label.trim().length
    ? modifier.label.trim()
    : null;
  if (!label) return null;
  const value = typeof modifier.modifier === 'number' && Number.isFinite(modifier.modifier)
    ? modifier.modifier
    : 0;
  const proficiencies = Array.isArray(modifier.proficiencies)
    ? modifier.proficiencies
        .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
        .filter((entry) => entry.length > 0)
    : undefined;
  const minimum = typeof modifier.minimum === 'number' && Number.isFinite(modifier.minimum)
    ? modifier.minimum
    : undefined;
  const condition = typeof modifier.condition === 'string'
    ? modifier.condition.trim()
    : undefined;
  return {
    label,
    modifier: clampProbability(value, -0.95, 0.95),
    proficiencies,
    minimum,
    condition,
  };
}

function normalizeOutcomes(outcomes: QuestChoiceOutcome[] | undefined): QuestChoiceOutcome[] {
  if (!Array.isArray(outcomes) || outcomes.length === 0) {
    return [
      { type: 'success', narrative: 'You complete the assignment without incident.' },
      { type: 'complication', narrative: 'You scrape by, but the overseer notes some concerns.' },
      { type: 'failure', narrative: 'Setbacks force you to abandon the attempt.' },
    ];
  }
  const allowed: QuestChoiceOutcomeType[] = ['success', 'failure', 'complication'];
  return outcomes
    .map((outcome, index) => {
      if (!outcome || typeof outcome !== 'object') return null;
      const type = allowed.includes(outcome.type)
        ? outcome.type
        : index === 0
          ? 'success'
          : index === outcomes.length - 1
            ? 'failure'
            : 'complication';
      const narrative = typeof outcome.narrative === 'string' && outcome.narrative.trim().length
        ? outcome.narrative.trim()
        : type === 'success'
          ? 'The effort pays off handsomely.'
          : type === 'failure'
            ? 'Everything unravels before the work is finished.'
            : 'Mixed results leave the crew uncertain.';
      const rewardNote = typeof outcome.rewardNote === 'string' && outcome.rewardNote.trim().length
        ? outcome.rewardNote.trim()
        : undefined;
      const consequence = typeof outcome.consequence === 'string' && outcome.consequence.trim().length
        ? outcome.consequence.trim()
        : undefined;
      return { type, narrative, rewardNote, consequence };
    })
    .filter((entry): entry is QuestChoiceOutcome => entry !== null);
}

function clampProbability(value: number, min = 0, max = 1): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
