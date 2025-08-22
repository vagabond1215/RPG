// summoning_proficiency.ts — progression for Summoning based on effective use (TS/JS)

/* ========================= Types ========================= */

const r2 = (x: number) => Math.round(x * 100) / 100;

export type Context = "practice" | "spar" | "battle";
export type Outcome = "success" | "partial" | "fail";

export type SummonEventType = "summon_cast" | "ability_effect" | "maintenance_tick";

export interface SummoningGainInputBase {
  P: number;                 // current summoning proficiency (2-dec)
  cap: number;               // current cap (rounded elsewhere)
  actorLevel: number;
  enemyLevelAvg: number;     // avg level of opposing side (or instructor)
  context: Context;          // practice|spar|battle
  thresholds?: number[];     // optional choke windows, e.g., [1,50,100]
  rng?: () => number;        // optional deterministic RNG override
}

export interface SummonCastEvent extends SummoningGainInputBase {
  type: "summon_cast";
  outcome: Outcome;          // success → summon spawned
  // Anti-spam / variety:
  N_sameSummon: number;      // consecutive same-summon casts
  recentSummonIds: string[]; // last N summons (ids)
}

export interface AbilityEffectEvent extends SummoningGainInputBase {
  type: "ability_effect";
  abilityId: string;
  outcome: Outcome;          // success if the effect applied/landed
  element?: string;          // for variety mixing (optional)
  // Effectiveness metrics (all optional but strongly recommended):
  wasEffectful: boolean;     // true only if it produced measurable effect
  effectivenessPct?: number; // 0..100: fraction of potential realized (e.g., healedMissing/abilityMaxPotential * 100)
  targetsAffected?: number;  // count of units that received a nonzero effect
  controlLanded?: boolean;   // for stuns/roots/etc.
  damageDonePctHP?: number;  // damage as % of target max HP (sum over targets)
  healDonePctHP?: number;    // heal as % of target max HP actually restored
  // Anti-spam / variety:
  N_sameAbility: number;     // consecutive same-ability uses
  recentAbilityIds: string[];// rolling window of ability ids
}

export interface MaintenanceTickEvent extends SummoningGainInputBase {
  type: "maintenance_tick";
  // Award a tiny, diminishing return trickle for **safely maintaining** a summon in real combat.
  maintainedSec: number;     // seconds since last tick (e.g., 3..10)
  // pressure/engagement (summon actually in danger/working):
  enemiesEngaged: number;    // hostiles within threat/aggro range of the summon or party
  alliesBenefitting: number; // allies within summon auras, etc.
  // Anti-spam: keeping the same summon forever reduces ticks modestly
  N_sameSummon: number;
}

export type SummoningGainInput = SummonCastEvent | AbilityEffectEvent | MaintenanceTickEvent;

/* ========================= Config ========================= */

export interface SummoningProgressionConfig {
  // Baselines
  g0_cast: number;     // base gain unit for a successful summon
  g0_effect: number;   // base gain unit for an effective ability instance
  g0_maint: number;    // base gain unit for a maintenance tick

  // Context weighting
  contextWeight: Record<Context, number>;

  // Difficulty scaling (enemy vs actor level)
  levelFloorEqual: number;  // Δ=0
  levelSlope: number;       // per level above actor
  levelCap: number;

  // Repetition/variety controls
  minRepeatFactor: number;
  varietyMaxBonus: number;
  varietyWindow: number;
  varietyTargetDistinct: number;

  // Unlock choke near thresholds
  unlockWindow: number;     // ±window after crossing a threshold
  postUnlockChoke: number;  // multiplier inside the window

  // Cap taper
  capSoftenerK: number;

  // Outcome weights
  outcomeWeight: Record<Outcome, number>;

  // Effectiveness shaping for ability_effect events
  effFloor: number;         // minimum weight if wasEffectful=true but tiny effect
  effCurveK: number;        // curvature for effectivenessPct mapping

  // Maintenance shaping
  maintSecNorm: number;     // seconds ≈ one “unit” before diminishing returns
  maintExp: number;         // diminishing exponent
  maintPressureK: number;   // +x per engaged enemy (capped)
  maintPressureMax: number;
  maintBenefitK: number;    // +x per ally benefitting (capped)
  maintBenefitMax: number;

  // Chance gate
  tauLow: number;
  tauHigh: number;
  pSmallMin: number;
}

export const SUMMON_CFG: SummoningProgressionConfig = {
  g0_cast:   0.10,  // summoning is hard; one successful summon gives a modest bump
  g0_effect: 0.08,  // effective ability use; tuned slightly below a cast
  g0_maint:  0.03,  // tiny trickle while actively engaged, not spammable

  contextWeight: { practice: 0.20, spar: 0.70, battle: 1.00 },

  levelFloorEqual: 0.30,
  levelSlope: 0.12,
  levelCap: 1.00,

  minRepeatFactor: 0.45,
  varietyMaxBonus: 0.25, varietyWindow: 10, varietyTargetDistinct: 4,

  unlockWindow: 6.0,
  postUnlockChoke: 0.35,

  capSoftenerK: 0.90,

  outcomeWeight: { success: 1.00, partial: 0.40, fail: 0.00 },

  effFloor: 0.10,
  effCurveK: 0.75,

  maintSecNorm: 5,
  maintExp: 0.60,
  maintPressureK: 0.08,
  maintPressureMax: 1.30,
  maintBenefitK: 0.06,
  maintBenefitMax: 1.25,

  tauLow: 0.020, tauHigh: 0.060, pSmallMin: 0.12,
};

/* ========================= Internal helpers ========================= */

function rng(cfg: SummoningProgressionConfig, override?: () => number) {
  return override ?? Math.random;
}

function levelFactor(actorL: number, enemyL: number, cfg: SummoningProgressionConfig): number {
  const d = enemyL - actorL;
  if (d < -1) return 0.05;                 // trivial = basically nothing
  if (d <= 0) return cfg.levelFloorEqual;  // equal/slightly lower
  return Math.min(cfg.levelCap, cfg.levelFloorEqual + cfg.levelSlope * d);
}

function repeatFactor(n: number, cfg: SummoningProgressionConfig): number {
  if (n <= 0) return 1;
  const f = 1 / (1 + Math.log(1 + n));
  return Math.max(cfg.minRepeatFactor, f);
}

function varietyFactor(ids: string[], cfg: SummoningProgressionConfig): number {
  if (!ids?.length) return 1;
  const slice = ids.slice(-cfg.varietyWindow);
  const distinct = new Set(slice).size;
  const t = Math.min(1, distinct / cfg.varietyTargetDistinct);
  return 1 + cfg.varietyMaxBonus * t;
}

function thresholdChoke(P: number, thresholds: number[]|undefined, cfg: SummoningProgressionConfig): number {
  if (!thresholds || thresholds.length === 0) return 1;
  for (const t of thresholds) {
    if (P >= t && P <= t + cfg.unlockWindow) return cfg.postUnlockChoke;
  }
  return 1;
}

function capGapFactor(P: number, cap: number, cfg: SummoningProgressionConfig): number {
  const gap = Math.max(0, cap - P);
  if (cap <= 0) return 0;
  return Math.pow(gap / cap, cfg.capSoftenerK);
}

function effectivenessWeight(effPct: number|undefined, cfg: SummoningProgressionConfig): number {
  if (effPct == null) return 1; // if not provided but wasEffectful=true, assume full credit
  const x = Math.max(0, Math.min(100, effPct)) / 100;
  // Smooth curve with a floor so tiny-but-real effects still count a bit
  return Math.max(cfg.effFloor, Math.pow(x, cfg.effCurveK));
}

function maintenanceWeight(sec: number, enemies: number, allies: number, cfg: SummoningProgressionConfig): number {
  const time = Math.pow(Math.max(0, sec) / Math.max(1e-6, cfg.maintSecNorm), cfg.maintExp);
  const pressure = Math.min(cfg.maintPressureMax, 1 + cfg.maintPressureK * Math.max(0, enemies));
  const benefit = Math.min(cfg.maintBenefitMax, 1 + cfg.maintBenefitK * Math.max(0, allies - 1));
  return time * pressure * benefit;
}

function chanceGate(Δ: number, cfg: SummoningProgressionConfig, R: () => number): boolean {
  let p: number;
  if (Δ >= cfg.tauHigh) p = 1.0;
  else if (Δ <= cfg.tauLow) p = cfg.pSmallMin;
  else {
    const t = (Δ - cfg.tauLow) / (cfg.tauHigh - cfg.tauLow);
    p = cfg.pSmallMin + (1 - cfg.pSmallMin) * t;
  }
  return R() < p;
}

/* ========================= Main API ========================= */

export function gainSummoningProficiency(input: SummoningGainInput, cfg: SummoningProgressionConfig = SUMMON_CFG): number {
  const {
    P, cap, actorLevel, enemyLevelAvg, context, thresholds
  } = input;

  const R = rng(cfg, input.rng);
  const W_ctx = cfg.contextWeight[context];
  if (W_ctx <= 0) return r2(P);

  const F_level  = levelFactor(actorLevel, enemyLevelAvg, cfg);
  const F_unlock = thresholdChoke(P, thresholds, cfg);
  const F_cap    = capGapFactor(P, cap, cfg);

  let raw = 0;

  if (input.type === "summon_cast") {
    if (input.outcome === "fail") return r2(P);
    const F_repeat  = repeatFactor(input.N_sameSummon, cfg);
    const F_variety = varietyFactor(input.recentSummonIds, cfg);
    const W_outcome = cfg.outcomeWeight[input.outcome];

    raw = cfg.g0_cast
        * W_ctx * F_level * F_repeat * F_variety * F_unlock * F_cap * W_outcome;

  } else if (input.type === "ability_effect") {
    if (input.outcome === "fail" || !input.wasEffectful) return r2(P);

    const F_repeat  = repeatFactor(input.N_sameAbility, cfg);
    const F_variety = varietyFactor(input.recentAbilityIds, cfg);
    const W_outcome = cfg.outcomeWeight[input.outcome];

    // Build an effectiveness score from available signals
    const eBase = effectivenessWeight(input.effectivenessPct, cfg);
    const dmg   = Math.max(0, Math.min(1, (input.damageDonePctHP ?? 0) / 100));
    const heal  = Math.max(0, Math.min(1, (input.healDonePctHP   ?? 0) / 100));
    const ctrl  = input.controlLanded ? 0.5 : 0.0; // modest bump if a control actually stuck
    const targets = Math.max(1, input.targetsAffected ?? 1);

    // Multi-target helps but capped; combine signals
    const effectiveness = Math.min(2.0, eBase * (1 + 0.5 * (targets - 1)) * (1 + dmg + heal + ctrl));

    raw = cfg.g0_effect
        * W_ctx * F_level * F_repeat * F_variety * F_unlock * F_cap * W_outcome
        * effectiveness;

  } else { // maintenance_tick
    // Tiny gated trickle that only matters under pressure/benefit
    const F_repeat = repeatFactor(input.N_sameSummon, cfg);
    const maintW = maintenanceWeight(input.maintainedSec, input.enemiesEngaged, input.alliesBenefitting, cfg);

    raw = cfg.g0_maint
        * W_ctx * F_level * F_repeat * F_unlock * F_cap
        * maintW;
  }

  // Clamp to remaining headroom
  const Δ = Math.min(raw, Math.max(0, cap - P));
  if (Δ <= 0) return r2(P);

  // Probabilistic gate to keep mastery rare
  return chanceGate(Δ, cfg, R) ? r2(P + Δ) : r2(P);
}

/* ========================= Convenience helpers ========================= */

/** Call when a summon successfully spawns */
export function onSummonCast(params: Omit<SummonCastEvent, "type">): number {
  return gainSummoningProficiency({ type:"summon_cast", ...params });
}

/** Call when a summon ability resolves and had measurable impact */
export function onSummonAbilityEffect(params: Omit<AbilityEffectEvent, "type">): number {
  return gainSummoningProficiency({ type:"ability_effect", ...params });
}

/** Call periodically (e.g., every 3–6s) while the summon is maintained in combat */
export function onSummonMaintenanceTick(params: Omit<MaintenanceTickEvent, "type">): number {
  return gainSummoningProficiency({ type:"maintenance_tick", ...params });
}

/* ========================= Example usage =========================
import {
  onSummonCast, onSummonAbilityEffect, onSummonMaintenanceTick
} from "./summoning_proficiency";

// 1) Summon successfully brought out in battle vs slightly stronger enemies:
let P = 22.15, cap = 40;
P = onSummonCast({
  P, cap, actorLevel: 12, enemyLevelAvg: 13,
  context: "battle",
  outcome: "success",
  N_sameSummon: 1,
  recentSummonIds: ["Fire:Elemental"],
  thresholds: [1,50,100],
});

// 2) Ability landed and actually healed missing HP on 3 allies:
P = onSummonAbilityEffect({
  P, cap, actorLevel: 12, enemyLevelAvg: 13,
  context: "battle",
  abilityId: "water:soothe",
  outcome: "success",
  wasEffectful: true,
  effectivenessPct: 65,       // realized 65% of potential output
  healDonePctHP: 18,          // aggregate across targets
  targetsAffected: 3,
  controlLanded: false,
  N_sameAbility: 0,
  recentAbilityIds: ["water:soothe","water:surge"],
  thresholds: [1,50,100],
});

// 3) Maintenance tick while under pressure (2 enemies) benefiting 4 allies:
P = onSummonMaintenanceTick({
  P, cap, actorLevel: 12, enemyLevelAvg: 13,
  context: "battle",
  maintainedSec: 6,
  enemiesEngaged: 2,
  alliesBenefitting: 4,
  N_sameSummon: 2,
  thresholds: [1,50,100],
});
------------------------------------------------------------------- */
