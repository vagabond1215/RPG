import { matchProficienciesInText, type ProficiencyMatch } from "./proficiencies.js";

export interface QuestSkillRequirement {
  raw: string;
  proficiencies: ProficiencyMatch[];
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
  return quest;
}
