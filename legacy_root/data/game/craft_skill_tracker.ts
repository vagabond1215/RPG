import { gainCraftProficiency } from "./crafting_proficiency.js";
import { proficiencyCap } from "./proficiency_base.js";

export type CraftKey =
  | 'glassblowing'
  | 'blacksmithing'
  | 'carpentry'
  | 'tailoring'
  | 'leatherworking'
  | 'alchemy'
  | 'enchanting'
  | 'pearlDiving'
  | 'masonry'
  | 'textiles';

interface CraftingRepeats {
  [recipeKey: string]: number;
}

export interface CraftingState {
  level?: number;
  [key: string]: any;
  _craftRepeats?: Partial<Record<CraftKey, CraftingRepeats>>;
  _craftLastRecipe?: Partial<Record<CraftKey, string | null>>;
}

export interface CraftActionOptions {
  recipeKey: string;
  recipeUnlock: number;
  success?: boolean;
  cap?: number;
}

export interface CraftTrainingOptions {
  recipeKey?: string;
  recipeUnlock?: number;
  success?: boolean;
}

function ensureCraftStorage(character: CraftingState, craft: CraftKey) {
  if (!character._craftRepeats) character._craftRepeats = {};
  if (!character._craftRepeats[craft]) character._craftRepeats[craft] = {};
  if (!character._craftLastRecipe) character._craftLastRecipe = {};
  if (character._craftLastRecipe[craft] === undefined) {
    character._craftLastRecipe[craft] = null;
  }
}

export function performCraft(
  character: CraftingState,
  craft: CraftKey,
  options: CraftActionOptions,
): number {
  const { recipeKey, recipeUnlock, success = true, cap } = options;
  ensureCraftStorage(character, craft);

  const repeats = character._craftRepeats![craft]!;
  const lastRecipe = character._craftLastRecipe![craft];
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
      if (key !== recipeKey) repeats[key] = 0;
    });
    character._craftLastRecipe![craft] = recipeKey;
  } else {
    repeats[recipeKey] = prevRepeat;
  }

  return updated;
}

export function trainingCraft(
  character: CraftingState,
  craft: CraftKey,
  options: CraftTrainingOptions = {},
): number {
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

export function resetCraftTracking(character: CraftingState, craft?: CraftKey) {
  if (!character._craftRepeats) return;
  if (craft) {
    delete character._craftRepeats[craft];
    if (character._craftLastRecipe) delete character._craftLastRecipe[craft];
    return;
  }
  character._craftRepeats = {};
  character._craftLastRecipe = {};
}
