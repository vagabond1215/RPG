import { matchProficienciesInText } from "./proficiencies.js";
export function questHelper(details) {
    const required = ['title', 'description', 'location', 'requirements', 'conditions', 'timeline', 'risks', 'reward'];
    const quest = Object.assign({}, details);
    required.forEach(field => {
        if (quest[field] === undefined) {
            console.warn(`Quest missing ${field}`);
            quest[field] = null;
        }
    });
    if (Array.isArray(quest.requirements)) {
        const skillRequirements = quest.requirements
            .filter((req) => typeof req === 'string')
            .map((raw) => {
            const proficiencies = matchProficienciesInText(raw);
            return proficiencies.length
                ? { raw, proficiencies }
                : null;
        })
            .filter((entry) => entry !== null);
        if (skillRequirements.length > 0) {
            quest.skillRequirements = skillRequirements;
        }
    }
    return quest;
}
