import { gainProficiency, F_repeat } from "./proficiency_base.js";
const CONTEXT_FACTOR = {
    routine: 0.6,
    training: 0.75,
    emergency: 1.0,
};
function levelFactor(characterLevel, taskDifficulty) {
    const diff = Math.abs(taskDifficulty - characterLevel);
    return 1 / (1 + diff / 2);
}
export function gainAnimalHandling(character, animalKey, opts = {}) {
    var _a, _b, _c, _d, _e;
    const { difficulty = (_a = character.level) !== null && _a !== void 0 ? _a : 1, success = true, context = 'routine', } = opts;
    if (!character.animalHandling)
        character.animalHandling = {};
    if (!character._animalHandlingRepeat)
        character._animalHandlingRepeat = {};
    const current = (_b = character.animalHandling[animalKey]) !== null && _b !== void 0 ? _b : 0;
    const level = (_c = character.level) !== null && _c !== void 0 ? _c : 1;
    const repeatCount = (_d = character._animalHandlingRepeat[animalKey]) !== null && _d !== void 0 ? _d : 0;
    const F_repeat_factor = F_repeat(repeatCount);
    const F_context = (_e = CONTEXT_FACTOR[context]) !== null && _e !== void 0 ? _e : CONTEXT_FACTOR.routine;
    const F_level = levelFactor(level, difficulty);
    const updated = gainProficiency({
        P: current,
        L: level,
        A0: 1,
        A: 0,
        r: 1,
        F_context,
        F_level,
        F_repeat: F_repeat_factor,
        success,
    });
    character.animalHandling[animalKey] = updated;
    if (success) {
        if (character._animalHandlingLast === animalKey) {
            character._animalHandlingRepeat[animalKey] = repeatCount + 1;
        }
        else {
            character._animalHandlingRepeat[animalKey] = 1;
        }
        character._animalHandlingLast = animalKey;
    }
    else {
        character._animalHandlingRepeat[animalKey] = repeatCount;
    }
    return updated;
}
export function handleAnimal(character, animalKey, opts = {}) {
    return gainAnimalHandling(character, animalKey, opts);
}
