import { F_repeat, W_unlock_window, POST_UNLOCK_CHOKE_K } from "./proficiency_base.js";

const r2 = (x) => Math.round(x * 100) / 100;

export const CRAFT_CFG = {
  g0: 0.5,
  repeat: F_repeat,
  unlockWindow: W_unlock_window,
  postUnlockChokeK: POST_UNLOCK_CHOKE_K,
};

export function gainCraftProficiency(input, cfg = CRAFT_CFG) {
  const { P, cap, recipeUnlock, N_same, success } = input;
  if (!success) return r2(P);

  const diff = P - recipeUnlock;
  let F_unlock;
  if (diff < 0) {
    F_unlock = 1 + (-diff) / cfg.unlockWindow;
  } else {
    F_unlock = 1 / (1 + diff / cfg.postUnlockChokeK);
  }

  const F_rep = cfg.repeat(N_same);
  const raw = cfg.g0 * F_rep * F_unlock;
  const gain = Math.min(raw, Math.max(0, cap - P));
  return r2(P + gain);
}
