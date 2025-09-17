import { gainCraftProficiency } from "./crafting_proficiency.js";
import { proficiencyCap } from "./proficiency_base.js";

function ensureCraftStorage(character, craft) {
    character._craftRepeats = character._craftRepeats || {};
    character._craftRepeats[craft] = character._craftRepeats[craft] || {};
    character._craftLastRecipe = character._craftLastRecipe || {};
    if (character._craftLastRecipe[craft] === undefined) {
        character._craftLastRecipe[craft] = null;
    }
}
export function performCraft(character, craft, options) {
    const { recipeKey, recipeUnlock, success = true, cap } = options;
    ensureCraftStorage(character, craft);
    const repeats = character._craftRepeats[craft];
    const lastRecipe = character._craftLastRecipe[craft];
    const current = typeof character[craft] === 'number' ? character[craft] : 0;
    const level = character.level ?? 1;
    const craftCap = cap ?? proficiencyCap(level, 1, 0, 1);
    const prevRepeat = repeats[recipeKey] ?? 0;
    const N_same = lastRecipe === recipeKey ? prevRepeat + 1 : 0;
    const updated = gainCraftProficiency({
        P: current,
        cap: craftCap,
        recipeUnlock,
        N_same,
        success,
    });
    character[craft] = updated;
    if (success) {
        repeats[recipeKey] = N_same;
        Object.keys(repeats).forEach((key) => {
            if (key !== recipeKey)
                repeats[key] = 0;
        });
        character._craftLastRecipe[craft] = recipeKey;
    }
    else {
        repeats[recipeKey] = prevRepeat;
    }
    return updated;
}
export function trainingCraft(character, craft, options = {}) {
    const current = typeof character[craft] === 'number' ? character[craft] : 0;
    const level = character.level ?? 1;
    const cap = proficiencyCap(level, 1, 0, 1);
    const recipeKey = options.recipeKey ?? 'training-session';
    const defaultUnlock = Math.min(cap, current + 5);
    const recipeUnlock = options.recipeUnlock ?? defaultUnlock;
    return performCraft(character, craft, {
        recipeKey,
        recipeUnlock,
        success: options.success ?? true,
        cap,
    });
}
export function resetCraftTracking(character, craft) {
    if (!character._craftRepeats)
        return;
    if (craft) {
        delete character._craftRepeats[craft];
        if (character._craftLastRecipe)
            delete character._craftLastRecipe[craft];
        return;
    }
    character._craftRepeats = {};
    character._craftLastRecipe = {};
}
