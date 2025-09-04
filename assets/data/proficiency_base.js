// Shared proficiency utilities and tunables

// ---- Global Tunables & Tables ----
export const PROF_MILESTONES = [10,20,30,40,50,60,70,80,90,100];
export const RACIAL_START_MULTIPLIER = {};
export const CAP_LEVEL_FOR_100 = 50;
export const CAP_BASE_PROF = 1;

export function proficiencyCap(L, A0 = CAP_BASE_PROF, A = 0, r = 1) {
  return Math.round(A0 + A + r * L);
}

// Full gain function with chance gate & fail/partial outcomes
export function gainProficiency(params) {
  const {
    P,
    L,
    A0,
    A,
    r,
    g0 = 1,
    F_context = 1,
    F_level = 1,
    F_attr = 1,
    F_repeat = 1,
    F_unlock_dist = 1,
    F_post = 1,
    F_capgap = 1,
    F_variety = 1,
    isNewSpellUse = false,
    success = true,
    M_new = 1,
    p_partial_fail = 0,
    fail_partial_factor = 0,
    \u03c4_high = 1,
    \u03c4_low = 0,
    p_small_min = 0,
    rand = Math.random
  } = params;

  const Cap = proficiencyCap(L, A0, A, r);
  const dP_raw =
    g0 *
    F_context *
    F_level *
    F_attr *
    F_repeat *
    F_unlock_dist *
    F_post *
    F_capgap *
    F_variety;

  const dP_success = isNewSpellUse
    ? Math.min(dP_raw * M_new, Cap - P)
    : Math.min(dP_raw, Cap - P);

  if (!success) {
    if (rand() < p_partial_fail) {
      return Math.round(P + dP_success * fail_partial_factor, 2);
    }
    return Math.round(P, 2);
  }

  let p_gain;
  if (isNewSpellUse) {
    p_gain = 0.95;
  } else if (dP_success >= \u03c4_high) {
    p_gain = 1;
  } else if (dP_success <= \u03c4_low) {
    p_gain = p_small_min;
  } else {
    const t = (dP_success - \u03c4_low) / (\u03c4_high - \u03c4_low);
    p_gain = p_small_min + (1 - p_small_min) * t;
  }

  const dP_final = rand() < p_gain ? dP_success : 0;
  return Math.round(P + dP_final, 2);
}

// ---- Proficiency Formula Tunables ----
export const g0 = 1;
export const F_CONTEXT = { practice: 0.2, spar: 0.6, battle: 1.0 };
export const LEVEL_GAIN_MIN = 0.25;
export const LEVEL_GAIN_MAX = 1.75;
export const LEVEL_GAIN_SLOPE = 0.1;
export const ATTR_GAIN_MIN = 0.7;
export const ATTR_GAIN_MAX = 1.3;
export const ATTR_GAIN_SLOPE = 0.01;
export const W_unlock_window = 10;
export const POST_UNLOCK_CHOKE_K = 3;
export const VARIETY_BONUS_MAX = 0.25;
export const F_repeat = N => 1 / (1 + Math.log(1 + N));
export const \u03c4_low = 0;
export const \u03c4_high = 1;
export const p_small_min = 0;
export const p_partial_fail = 0;
export const fail_partial_factor = 0;
export const M_new = 1;
export const p_gain_newSpell = 0.95;

