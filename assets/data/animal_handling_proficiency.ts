import { gainProficiency, F_repeat } from "./proficiency_base.js";

export type HandlingContext = 'routine' | 'training' | 'emergency';

export interface AnimalHandlingOptions {
  difficulty?: number;
  success?: boolean;
  context?: HandlingContext;
}

export interface AnimalHandlingState {
  animalHandling?: Record<string, number>;
  _animalHandlingRepeat?: Record<string, number>;
  _animalHandlingLast?: string | null;
  level?: number;
}

const CONTEXT_FACTOR: Record<HandlingContext, number> = {
  routine: 0.6,
  training: 0.75,
  emergency: 1.0,
};

function levelFactor(characterLevel: number, taskDifficulty: number) {
  const diff = Math.abs(taskDifficulty - characterLevel);
  return 1 / (1 + diff / 2);
}

export function gainAnimalHandling(
  character: AnimalHandlingState,
  animalKey: string,
  opts: AnimalHandlingOptions = {},
): number {
  const {
    difficulty = character.level ?? 1,
    success = true,
    context = 'routine',
  } = opts;

  if (!character.animalHandling) character.animalHandling = {};
  if (!character._animalHandlingRepeat) character._animalHandlingRepeat = {};

  const current = character.animalHandling[animalKey] ?? 0;
  const level = character.level ?? 1;
  const repeatCount = character._animalHandlingRepeat[animalKey] ?? 0;
  const F_repeat_factor = F_repeat(repeatCount);
  const F_context = CONTEXT_FACTOR[context] ?? CONTEXT_FACTOR.routine;
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
    } else {
      character._animalHandlingRepeat[animalKey] = 1;
    }
    character._animalHandlingLast = animalKey;
  } else {
    character._animalHandlingRepeat[animalKey] = repeatCount;
  }

  return updated;
}

export function handleAnimal(
  character: AnimalHandlingState,
  animalKey: string,
  opts: AnimalHandlingOptions = {},
): number {
  return gainAnimalHandling(character, animalKey, opts);
}
