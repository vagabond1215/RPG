// reactive_proficiency.ts — Evasion, Parry, Block progression (hardest to master)

/** Proficiency is tracked to 2 decimals. */
const r2 = (x: number) => Math.round(x * 100) / 100;

export type ReactiveKind = "evasion" | "parry" | "block";
export type Outcome = "success" | "partial" | "fail";

/** Tunables: deliberately stingy; adjust carefully. */
export const REACTIVE_CFG = {
  // Base scalar: MUCH lower than active skills
  g0: 0.035, // base gain unit per qualifying event (tiny)
  // In-activity requirements
  requireCombatOrSpar: true,
  requireRealWeapons: true,
  // Level disparity factor (equal-level = rare & small)
  // If Δ = enemyL - actorL:
  // Δ < 0 -> 0 gain; Δ = 0 -> small (F=0.15); Δ >= 5 -> F ≈ 1.0
  levelSlope: 0.17,
  levelFloorEqual: 0.15, // at Δ=0
  levelCap: 1.0,

  // Event weighting (how informative each reactive event is)
  // Evasion is hardest/highest info, then Parry, then Block
  eventWeight: {
    evasion: 1.00,
    parry:   0.85,
    block:   0.75,
  },

  // Outcome multipliers
  // Very small partial learning; fails usually teach nothing
  outcomeWeight: {
    success: 1.00,
    partial: 0.20,
    fail:    0.00,
  },

  // Repetition decay (anti-farm): 1 / (1 + ln(1 + N_same))
  // N_same = recent consecutive same-kind uses (e.g., blocks)
  minRepeatFactor: 0.35,

  // Variety bonus for mixing reactions (evasion+parry+block in window)
  varietyMaxBonus: 0.20, // up to +20%
  varietyWindow: 12,     // last N reactive events
  varietyTargetDistinct: 3,

  // Distance to next threshold (unlock/tier) taper:
  // as you cross a threshold, gains choke quickly
  postUnlockChoke: 0.25, // multiply when below newly unlocked tier (discourage farming old tier)
  unlockWindow: 6.0,     // points after a threshold where choke applies to lower tiers

  // Cap-gap factor: shrink when close to cap
  capSoftenerK: 0.75, // factor in ((Cap - P)/Cap)^K

  // Chance gate — very strict to make these slowest to master
  // We convert the deterministic delta into a chance to tick; tiny deltas are often 0.
  tauLow:  0.010, // ≤ 0.010 -> very small; rare
  tauHigh: 0.045, // ≥ 0.045 -> reliable
  pSmallMin: 0.08,  // floor for tiny gains
  // Partial-on-fail (VERY rare)
  pPartialOnFail: 0.05,

  // RNG: inject for determinism in tests
  rng: () => Math.random(),
};

export interface ReactiveGainInput {
  kind: ReactiveKind;          // "evasion" | "parry" | "block"
  outcome: Outcome;            // "success" | "partial" | "fail"
  P: number;                   // current proficiency (0..cap), 2-dec tracked externally
  cap: number;                 // current cap for this proficiency
  actorLevel: number;
  enemyLevel: number;
  inCombat: boolean;
  isSpar: boolean;
  realWeapons: boolean;        // true only if weapons are not padded / sim-only
  // Recent usage context:
  N_same: number;              // how many same-kind events in a row
  recentKinds: ReactiveKind[]; // last REACTIVE_CFG.varietyWindow events (most recent last)
  // Unlock thresholds for tiers (sorted ascending), e.g. [10,20,...,100]
  thresholds: number[];
}

/** Utility: compute level factor respecting "hardest to master" and equal-level rarity. */
function levelFactor(actorL: number, enemyL: number, cfg = REACTIVE_CFG): number {
  const d = enemyL - actorL;
  if (d < 0) return 0; // no gain vs weaker foes
  if (d === 0) return cfg.levelFloorEqual;
  const f = cfg.levelFloorEqual + cfg.levelSlope * d;
  return Math.min(cfg.levelCap, f);
}

/** Anti-farm repetition decay. */
function repeatFactor(N_same: number, cfg = REACTIVE_CFG): number {
  if (N_same <= 0) return 1;
  const f = 1 / (1 + Math.log(1 + N_same));
  return Math.max(cfg.minRepeatFactor, f);
}

/** Variety factor: reward mixing different reactions within a small window. */
function varietyFactor(recentKinds: ReactiveKind[], cfg = REACTIVE_CFG): number {
  if (!recentKinds || recentKinds.length === 0) return 1;
  const N = cfg.varietyWindow;
  const slice = recentKinds.slice(-N);
  const distinct = new Set(slice).size;
  const t = Math.min(1, distinct / cfg.varietyTargetDistinct);
  return 1 + cfg.varietyMaxBonus * t;
}

/** Post-unlock choke: if you are just past a threshold, choke gains from lower-tier habits. */
function thresholdChoke(P: number, thresholds: number[], cfg = REACTIVE_CFG): number {
  // If within unlockWindow above ANY threshold, apply choke (we assume the event is "lower-tierish")
  // This is a heuristic for "stop farming easy stuff after a tier-up".
  for (const t of thresholds) {
    if (P >= t && P <= t + cfg.unlockWindow) {
      return cfg.postUnlockChoke;
    }
  }
  return 1.0;
}

/** Cap-gap factor: ((cap - P)/cap)^K */
function capGapFactor(P: number, cap: number, cfg = REACTIVE_CFG): number {
  if (cap <= 0) return 0;
  const gap = Math.max(0, cap - P);
  return Math.pow(gap / cap, cfg.capSoftenerK);
}

/** Core function: compute next proficiency for Evasion/Parry/Block (2-dec). */
export function gainReactiveProficiency(input: ReactiveGainInput, cfg = REACTIVE_CFG): number {
  let {
    kind, outcome, P, cap, actorLevel, enemyLevel,
    inCombat, isSpar, realWeapons, N_same, recentKinds, thresholds
  } = input;

  // Hard gating: only in combat or spar, and with real weapons, vs equal+ level
  if (cfg.requireCombatOrSpar && !(inCombat || isSpar)) return r2(P);
  if (cfg.requireRealWeapons && !realWeapons) return r2(P);
  if (enemyLevel < actorLevel) return r2(P);

  // If outcome is fail, still allow a tiny "partial" roll
  if (outcome === "fail") {
    if (cfg.rng() < cfg.pPartialOnFail) {
      outcome = "partial";
    } else {
      return r2(P); // no gain
    }
  }

  const W_event   = cfg.eventWeight[kind];
  const F_level   = levelFactor(actorLevel, enemyLevel, cfg);
  const F_repeat  = repeatFactor(N_same, cfg);
  const F_variety = varietyFactor(recentKinds, cfg);
  const F_unlock  = thresholdChoke(P, thresholds, cfg);
  const F_cap     = capGapFactor(P, cap, cfg);
  const W_outcome = cfg.outcomeWeight[outcome];

  const raw = cfg.g0 * W_event * F_level * F_repeat * F_variety * F_unlock * F_cap * W_outcome;

  // Strict chance gate to make these the slowest to master
  const Δ = Math.min(raw, Math.max(0, cap - P)); // can't exceed cap
  if (Δ <= 0) return r2(P);

  let gain = 0;
  if (Δ >= cfg.tauHigh) {
    gain = Δ;
  } else {
    let p: number;
    if (Δ <= cfg.tauLow) {
      p = cfg.pSmallMin;
    } else {
      const t = (Δ - cfg.tauLow) / (cfg.tauHigh - cfg.tauLow);
      p = cfg.pSmallMin + t * (1 - cfg.pSmallMin);
    }
    if (cfg.rng() < p) gain = Δ;
  }

  const nextP = Math.min(cap, P + gain);
  return r2(nextP);
}

