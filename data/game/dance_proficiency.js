// dance_proficiency.ts — proficiency gains for Dances (TS/JS compatible)
const r2 = (x) => Math.round(x * 100) / 100;
export const DANCE_CFG = {
    g0: 0.075,
    contextWeight: { practice: 0.25, spar: 0.75, battle: 1.0 },
    levelFloorEqual: 0.30,
    levelSlope: 0.11,
    levelCap: 1.0,
    secNorm: 4, // every ~4s of real maintained dancing ≈ one learning unit
    uptimeK: 0.6, // diminishing returns exponent on uptime factor
    crowdK: 0.08, crowdMax: 1.30,
    pressureK: 0.10, pressureMax: 1.35,
    minRepeatFactor: 0.45,
    varietyMaxBonus: 0.25, varietyWindow: 10, varietyTargetDistinct: 4,
    postUnlockChoke: 0.35, unlockWindow: 8.0,
    capSoftenerK: 0.9,
    outcomeWeight: { success: 1.0, partial: 0.35, fail: 0.0 },
    stopBonus: 0.12, // small extra nudge when the dancer ends a sequence cleanly
    tauLow: 0.018, tauHigh: 0.055, pSmallMin: 0.12,
    rng: () => Math.random(),
};
/* ========================= Internal helpers ========================= */
function levelFactor(actorL, enemyL, cfg) {
    const d = enemyL - actorL;
    if (d < -1)
        return 0.05; // trivial content
    if (d <= 0)
        return cfg.levelFloorEqual;
    return Math.min(cfg.levelCap, cfg.levelFloorEqual + cfg.levelSlope * d);
}
function repeatFactor(N_same, cfg) {
    if (N_same <= 0)
        return 1;
    const f = 1 / (1 + Math.log(1 + N_same));
    return Math.max(cfg.minRepeatFactor, f);
}
function varietyFactor(ids, cfg) {
    if (!(ids === null || ids === void 0 ? void 0 : ids.length))
        return 1;
    const slice = ids.slice(-cfg.varietyWindow);
    const distinct = new Set(slice).size;
    const t = Math.min(1, distinct / cfg.varietyTargetDistinct);
    return 1 + cfg.varietyMaxBonus * t;
}
function thresholdChoke(P, thresholds, cfg) {
    for (const t of thresholds)
        if (P >= t && P <= t + cfg.unlockWindow)
            return cfg.postUnlockChoke;
    return 1.0;
}
function capGapFactor(P, cap, cfg) {
    if (cap <= 0)
        return 0;
    const gap = Math.max(0, cap - P);
    return Math.pow(gap / cap, cfg.capSoftenerK);
}
function crowdFactor(nAllies, cfg) {
    return Math.min(cfg.crowdMax, 1 + cfg.crowdK * Math.max(0, nAllies - 1));
}
function pressureFactor(nEnemies, cfg) {
    return Math.min(cfg.pressureMax, 1 + cfg.pressureK * Math.max(0, nEnemies - 0));
}
/** Convert uptime seconds into a normalized factor with diminishing returns. */
function uptimeFactor(maintainedSec, cfg) {
    if (maintainedSec <= 0)
        return 1; // instant pulse dances still give a tiny signal
    const units = maintainedSec / cfg.secNorm; // how many “ticks” worth of practice
    return Math.pow(units, cfg.uptimeK); // diminishing returns for very long holds
}
/* ========================= Main progression ========================= */
/** Compute next Dance proficiency (2 decimals).
 *  Call this:
 *   - once per active “tick” while the dancer maintains (e.g., every 3–5s), OR
 *   - once when they stop (isStopEvent=true) to apply a small consolidation bonus.
 */
export function gainDanceProficiency(input, cfg = DANCE_CFG) {
    const { P, cap, actorLevel, enemyLevelAvg, context, outcome, maintainedSec, isStopEvent, N_same, recentDanceIds, alliesAffected, enemiesPressuring, thresholds } = input;
    // Basic eligibility & outcome
    const W_ctx = cfg.contextWeight[context];
    if (W_ctx <= 0 || outcome === "fail")
        return r2(P);
    // Build multipliers
    const F_level = levelFactor(actorLevel, enemyLevelAvg, cfg);
    const F_repeat = repeatFactor(N_same, cfg);
    const F_variety = varietyFactor(recentDanceIds, cfg);
    const F_unlock = thresholdChoke(P, thresholds, cfg);
    const F_cap = capGapFactor(P, cap, cfg);
    const F_crowd = crowdFactor(alliesAffected, cfg);
    const F_pressure = pressureFactor(enemiesPressuring, cfg);
    const F_uptime = uptimeFactor(maintainedSec, cfg);
    const W_outcome = cfg.outcomeWeight[outcome];
    // Raw deterministic delta (pre-gate)
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
        * W_outcome;
    // End-of-dance consolidation (very small nudge)
    if (isStopEvent)
        raw *= (1 + cfg.stopBonus);
    const Δ = Math.min(raw, Math.max(0, cap - P));
    if (Δ <= 0)
        return r2(P);
    // Strict chance gate — keeps progression slow & eventful
    let pGain;
    if (Δ >= cfg.tauHigh)
        pGain = 1.0;
    else if (Δ <= cfg.tauLow)
        pGain = cfg.pSmallMin;
    else {
        const t = (Δ - cfg.tauLow) / (cfg.tauHigh - cfg.tauLow);
        pGain = cfg.pSmallMin + (1 - cfg.pSmallMin) * t;
    }
    return (cfg.rng() < pGain) ? r2(P + Δ) : r2(P);
}
/* ========================= Example usage =========================
import { gainDanceProficiency } from "./dance_proficiency";

// Maintain a dance for ~6s during battle vs slightly higher-level enemies:
let P = 24.17, cap = 54;
P = gainDanceProficiency({
  P, cap,
  actorLevel: 12, enemyLevelAvg: 13,
  context: "battle", outcome: "success",
  maintainedSec: 6, isStopEvent: false,
  N_same: 1, recentDanceIds: ["BUFF_DN:02","CTRL_DN:03"],
  alliesAffected: 4, enemiesPressuring: 2,
  thresholds: [10,20,30,40,50,60,70,80,90,100]
});

// When the dancer stops, call once more with a stop-event:
P = gainDanceProficiency({
  P, cap,
  actorLevel: 12, enemyLevelAvg: 13,
  context: "battle", outcome: "success",
  maintainedSec: 0, isStopEvent: true,
  N_same: 1, recentDanceIds: ["BUFF_DN:02","CTRL_DN:03"],
  alliesAffected: 4, enemiesPressuring: 2,
  thresholds: [10,20,30,40,50,60,70,80,90,100]
});
------------------------------------------------------------------- */
