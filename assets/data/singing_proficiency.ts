// singing_proficiency.ts — proficiency gains for Singing (TS/JS compatible)

const r2 = (x: number) => Math.round(x * 100) / 100;

export type Context = "practice" | "spar" | "battle";
export type PerfOutcome = "success" | "partial" | "fail";

/** One call per “singing tick” (e.g., every 3–5s of maintained singing) or once when the singer stops. */
export interface SingingGainInput {
  P: number;                 // current proficiency (2-dec)
  cap: number;               // current cap (rounded int elsewhere)
  actorLevel: number;
  enemyLevelAvg: number;     // avg enemy/instructor level in scene
  context: Context;          // practice | spar | battle
  outcome: PerfOutcome;      // success|partial|fail for this tick or end event

  // Maintenance / uptime:
  maintainedSec: number;     // seconds actively sung during this event (e.g., 3..10)
  isStopEvent: boolean;      // true only on the frame the singer stops; grants small consolidation bonus

  // Anti-spam / variety:
  N_same: number;            // consecutive uses of the same singing song id
  recentSongIds: string[];   // last N song ids used (most recent last)

  // Coverage & pressure:
  alliesAffected: number;    // meaningful allies actually affected
  enemiesPressuring: number; // # of hostiles threatening/targeting the singer

  // Acoustic/ensemble quality (optional, 0..1; default 0.0 if not used):
  acousticQuality?: number;  // room acoustics/echo clarity (0..1)
  ensembleSynergy?: number;  // multiple singers/musicians timing (0..1)

  // Unlock tiers for choke near thresholds:
  thresholds: number[];      // e.g., [10,20,30,40,50,60,70,80,90,100]
}

export interface SingingProgressionConfig {
  // Base scalar (singing: in-between instrument and dance)
  g0: number;

  // Context weights
  contextWeight: Record<Context, number>;

  // Level factor (equal-level small; higher-level ramps; trivial content ~none)
  levelFloorEqual: number;
  levelSlope: number;
  levelCap: number;

  // Maintenance / uptime scaling
  secNorm: number;     // seconds ≈ one normalized learning “tick”
  uptimeK: number;     // diminishing returns exponent on long holds

  // Crowd/pressure factors
  crowdK: number;
  crowdMax: number;
  pressureK: number;
  pressureMax: number;

  // Acoustics / ensemble (soft multipliers around 1.0)
  acousticK: number;    // scales 1 + acousticK * acousticQuality
  ensembleK: number;    // scales 1 + ensembleK * ensembleSynergy
  acousticMax: number;
  ensembleMax: number;

  // Repetition & variety
  minRepeatFactor: number;
  varietyMaxBonus: number;
  varietyWindow: number;
  varietyTargetDistinct: number;

  // Unlock choke & cap taper
  postUnlockChoke: number;
  unlockWindow: number;
  capSoftenerK: number;

  // Outcome weights
  outcomeWeight: Record<PerfOutcome, number>;

  // Stop-event consolidation bonus
  stopBonus: number;

  // Chance gate
  tauLow: number;
  tauHigh: number;
  pSmallMin: number;

  // RNG
  rng: () => number;
}

export const SINGING_CFG: SingingProgressionConfig = {
  g0: 0.072, // base gain per normalized tick (stingy)
  contextWeight: { practice: 0.28, spar: 0.72, battle: 1.0 },

  levelFloorEqual: 0.32,
  levelSlope: 0.11,
  levelCap: 1.0,

  secNorm: 4,     // ~4s sustained ≈ one learning unit
  uptimeK: 0.6,   // diminishing returns

  crowdK: 0.08, crowdMax: 1.30,
  pressureK: 0.09, pressureMax: 1.30,

  acousticK: 0.10, ensembleK: 0.12,
  acousticMax: 1.15, ensembleMax: 1.18,

  minRepeatFactor: 0.45,
  varietyMaxBonus: 0.25, varietyWindow: 10, varietyTargetDistinct: 4,

  postUnlockChoke: 0.35, unlockWindow: 8.0,
  capSoftenerK: 0.9,

  outcomeWeight: { success: 1.0, partial: 0.30, fail: 0.0 },

  stopBonus: 0.12,

  tauLow: 0.018, tauHigh: 0.055, pSmallMin: 0.12,
  rng: () => Math.random(),
};

/* ========================= Internal helpers ========================= */

function levelFactor(actorL: number, enemyL: number, cfg: SingingProgressionConfig): number {
  const d = enemyL - actorL;
  if (d < -1) return 0.05; // trivial content gives almost nothing
  if (d <= 0) return cfg.levelFloorEqual; // equal/slightly lower
  return Math.min(cfg.levelCap, cfg.levelFloorEqual + cfg.levelSlope * d);
}

function repeatFactor(N_same: number, cfg: SingingProgressionConfig): number {
  if (N_same <= 0) return 1;
  const f = 1 / (1 + Math.log(1 + N_same));
  return Math.max(cfg.minRepeatFactor, f);
}

function varietyFactor(ids: string[], cfg: SingingProgressionConfig): number {
  if (!ids?.length) return 1;
  const slice = ids.slice(-cfg.varietyWindow);
  const distinct = new Set(slice).size;
  const t = Math.min(1, distinct / cfg.varietyTargetDistinct);
  return 1 + cfg.varietyMaxBonus * t;
}

function thresholdChoke(P: number, thresholds: number[], cfg: SingingProgressionConfig): number {
  for (const t of thresholds) if (P >= t && P <= t + cfg.unlockWindow) return cfg.postUnlockChoke;
  return 1.0;
}

function capGapFactor(P: number, cap: number, cfg: SingingProgressionConfig): number {
  const gap = Math.max(0, cap - P);
  if (cap <= 0) return 0;
  return Math.pow(gap / cap, cfg.capSoftenerK);
}

function crowdFactor(nAllies: number, cfg: SingingProgressionConfig): number {
  return Math.min(cfg.crowdMax, 1 + cfg.crowdK * Math.max(0, nAllies - 1));
}

function pressureFactor(nEnemies: number, cfg: SingingProgressionConfig): number {
  return Math.min(cfg.pressureMax, 1 + cfg.pressureK * Math.max(0, nEnemies));
}

function uptimeFactor(maintainedSec: number, cfg: SingingProgressionConfig): number {
  if (maintainedSec <= 0) return 1;         // instant pulse songs still give tiny signal
  const units = maintainedSec / cfg.secNorm; // normalized “ticks”
  return Math.pow(units, cfg.uptimeK);       // diminishing returns on very long sustain
}

function acousticFactor(q = 0, cfg: SingingProgressionConfig): number {
  const f = 1 + cfg.acousticK * Math.max(0, Math.min(1, q));
  return Math.min(cfg.acousticMax, f);
}

function ensembleFactor(s = 0, cfg: SingingProgressionConfig): number {
  const f = 1 + cfg.ensembleK * Math.max(0, Math.min(1, s));
  return Math.min(cfg.ensembleMax, f);
}

/* ========================= Main progression ========================= */

/** Compute next Singing proficiency (2 decimals).
 * Call per maintained “tick” (e.g., every 3–5s) and once more with isStopEvent=true when stopping.
 */
export function gainSingingProficiency(input: SingingGainInput, cfg: SingingProgressionConfig = SINGING_CFG): number {
  const {
    P, cap, actorLevel, enemyLevelAvg, context, outcome,
    maintainedSec, isStopEvent, N_same, recentSongIds,
    alliesAffected, enemiesPressuring, thresholds,
    acousticQuality = 0, ensembleSynergy = 0
  } = input;

  const W_ctx = cfg.contextWeight[context];
  if (W_ctx <= 0 || outcome === "fail") return r2(P);

  const F_level    = levelFactor(actorLevel, enemyLevelAvg, cfg);
  const F_repeat   = repeatFactor(N_same, cfg);
  const F_variety  = varietyFactor(recentSongIds, cfg);
  const F_unlock   = thresholdChoke(P, thresholds, cfg);
  const F_cap      = capGapFactor(P, cap, cfg);
  const F_crowd    = crowdFactor(alliesAffected, cfg);
  const F_pressure = pressureFactor(enemiesPressuring, cfg);
  const F_uptime   = uptimeFactor(maintainedSec, cfg);
  const F_acoustic = acousticFactor(acousticQuality, cfg);
  const F_ensemble = ensembleFactor(ensembleSynergy, cfg);
  const W_outcome  = cfg.outcomeWeight[outcome];

  let raw = cfg.g0
          * W_ctx
          * F_level
          * F_repeat
          * F_variety
          * F_unlock
          * F_cap
          * F_crowd
          * F_pressure
          * F_uptime
          * F_acoustic
          * F_ensemble
          * W_outcome;

  if (isStopEvent) raw *= (1 + cfg.stopBonus);

  const Δ = Math.min(raw, Math.max(0, cap - P));
  if (Δ <= 0) return r2(P);

  // Chance gate (keeps mastery slow and eventful)
  let pGain: number;
  if (Δ >= cfg.tauHigh) pGain = 1.0;
  else if (Δ <= cfg.tauLow) pGain = cfg.pSmallMin;
  else {
    const t = (Δ - cfg.tauLow) / (cfg.tauHigh - cfg.tauLow);
    pGain = cfg.pSmallMin + (1 - cfg.pSmallMin) * t;
  }

  return (cfg.rng() < pGain) ? r2(P + Δ) : r2(P);
}

/* ========================= Example usage =========================
import { gainSingingProficiency } from "./assets/data/singing_proficiency";

// Maintain a chorus for ~5s during battle vs slightly higher-level enemies:
let P = 37.42, cap = 68;
P = gainSingingProficiency({
  P, cap,
  actorLevel: 20, enemyLevelAvg: 21,
  context: "battle", outcome: "success",
  maintainedSec: 5, isStopEvent: false,
  N_same: 2, recentSongIds: ["SING_BUFF:02","SING_CTRL:03","SING_BUFF:08"],
  alliesAffected: 5, enemiesPressuring: 2,
  acousticQuality: 0.7, ensembleSynergy: 0.5,
  thresholds: [10,20,30,40,50,60,70,80,90,100]
});

// On stop, apply small consolidation:
P = gainSingingProficiency({
  P, cap,
  actorLevel: 20, enemyLevelAvg: 21,
  context: "battle", outcome: "success",
  maintainedSec: 0, isStopEvent: true,
  N_same: 0, recentSongIds: ["SING_BUFF:02","SING_CTRL:03","SING_BUFF:08"],
  alliesAffected: 5, enemiesPressuring: 2,
  acousticQuality: 0.7, ensembleSynergy: 0.5,
  thresholds: [10,20,30,40,50,60,70,80,90,100]
});
------------------------------------------------------------------- */
