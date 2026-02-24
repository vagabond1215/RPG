// crafting_proficiency.ts — crafting proficiency progression tied to successful crafts

import { F_repeat, W_unlock_window, POST_UNLOCK_CHOKE_K } from "./proficiency_base.js";

const r2 = (x: number) => Math.round(x * 100) / 100;

export interface CraftGainInput {
  P: number;             // current proficiency (0..cap)
  cap: number;           // proficiency cap
  recipeUnlock: number;  // proficiency where this recipe unlocks
  N_same: number;        // consecutive crafts of this recipe
  success: boolean;      // craft succeeded
}

export interface CraftProgressionConfig {
  g0: number;                  // base gain per successful craft
  repeat: (n: number) => number; // diminishing returns for repetition
  unlockWindow: number;       // window for pre-unlock boost
  postUnlockChokeK: number;   // divisor for post-unlock choke
}

export const CRAFT_CFG: CraftProgressionConfig = {
  g0: 0.5,
  repeat: F_repeat,
  unlockWindow: W_unlock_window,
  postUnlockChokeK: POST_UNLOCK_CHOKE_K,
};

/**
 * Compute next proficiency value after crafting a recipe.
 * Only successful crafts increase proficiency. Repeated crafts grant less.
 * The difference between current proficiency and the recipe's unlock value
 * influences gain — crafting near your limit yields more progression.
 */
export function gainCraftProficiency(
  input: CraftGainInput,
  cfg: CraftProgressionConfig = CRAFT_CFG
): number {
  const { P, cap, recipeUnlock, N_same, success } = input;
  if (!success) return r2(P);

  // Difference between current proficiency and recipe unlock requirement
  const diff = P - recipeUnlock;
  let F_unlock: number;
  if (diff < 0) {
    // recipe is above current skill; give a boost up to the unlock window
    F_unlock = 1 + (-diff) / cfg.unlockWindow;
  } else {
    // recipe is below current skill; choke gains the further above unlock
    F_unlock = 1 / (1 + diff / cfg.postUnlockChokeK);
  }

  const F_rep = cfg.repeat(N_same);

  const raw = cfg.g0 * F_rep * F_unlock;
  const gain = Math.min(raw, Math.max(0, cap - P));
  return r2(P + gain);
}

