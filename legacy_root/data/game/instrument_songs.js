// instrument_songs.ts — Full songbook + scaling + progression (TS/JS)
/** clamp helper */
const clamp01 = (x) => Math.max(0, Math.min(1, x));
/** round to 2 decimals */
const r2 = (x) => Math.round(x * 100) / 100;
/** attribute-based variance multiplier */
export const VARIANCE_ALPHA = 0.02;
/** Duration scaling rule (standardized across all songs):
 *  duration = base * (1 + (P - unlock) / 100)
 *  always at least baseDurationSec
 */
export function computeSongDurationSec(song, P) {
    const growth = 1 + Math.max(0, (P - song.unlock)) / 100;
    return Math.floor(song.baseDurationSec * growth);
}
/** Magnitude interpolation from unlock -> 100; capped if provided.
 *  For percentage effects, 'scale.m0'/'scale.m100' are % points (e.g., 5 means +5%).
 */
export function computeSongMagnitude(song, P) {
    if (song.kind === "ultimate") {
        // Ultimate: +1% ALL STATS per 10 proficiency (rounded properly)
        return Math.round(P / 10); // returns % points
    }
    const t = clamp01((P - song.unlock) / (100 - song.unlock || 1));
    const raw = song.scale.m0 + (song.scale.m100 - song.scale.m0) * t;
    return song.scale.cap != null ? Math.min(raw, song.scale.cap) : raw;
}
/* ========================= Core Songbook ========================= */
/** Base 20 control/debuff/DoT & buff/regen; elemental & ultimate appended below */
const CONTROL_DEBUFF_DOT_BASE = [
    { name: "Dissonant Chord", category: "control", kind: "debuff", target: "ST", side: "enemy", unlock: 10, baseDurationSec: 20, scale: { m0: -10, m100: -18, unit: "pct" }, tags: ["ATK_DOWN"] },
    { name: "Crippling Melody", category: "control", kind: "debuff", target: "ST", side: "enemy", unlock: 15, baseDurationSec: 20, scale: { m0: -10, m100: -20, unit: "pct" }, tags: ["MOVE_SPEED_DOWN"] },
    { name: "Withering Tone", category: "control", kind: "dot", target: "ST", side: "enemy", unlock: 20, baseDurationSec: 20, scale: { m0: 2, m100: 4, unit: "pct" }, tags: ["HP_DOT", "per5s"] }, // % Max HP per 5s
    { name: "Enfeebling Dirge", category: "control", kind: "debuff", target: "AoE", side: "enemy", unlock: 25, baseDurationSec: 20, scale: { m0: -8, m100: -16, unit: "pct" }, tags: ["DEF_DOWN"] },
    { name: "Discordant Anthem", category: "control", kind: "debuff", target: "AoE", side: "enemy", unlock: 30, baseDurationSec: 20, scale: { m0: +10, m100: +18, unit: "pct" }, tags: ["DMG_TAKEN_UP"] },
    { name: "Maddening Hum", category: "control", kind: "control", target: "ST", side: "enemy", unlock: 40, baseDurationSec: 15, scale: { m0: 0, m100: 0 }, tags: ["Confuse"] },
    { name: "Soul-Draining Verse", category: "control", kind: "dot", target: "ST", side: "enemy", unlock: 50, baseDurationSec: 20, scale: { m0: 2, m100: 4, unit: "pct" }, tags: ["MP_DOT", "per5s"] }, // % Max MP per 5s
    { name: "Lethargy Hymn", category: "control", kind: "debuff", target: "AoE", side: "enemy", unlock: 60, baseDurationSec: 20, scale: { m0: -10, m100: -20, unit: "pct" }, tags: ["STAM_REGEN_DOWN"] },
    { name: "Silence of Strings", category: "control", kind: "control", target: "ST", side: "enemy", unlock: 70, baseDurationSec: 10, scale: { m0: 0, m100: 0 }, tags: ["Silence"] },
    { name: "Curse of Discord", category: "control", kind: "debuff", target: "AoE", side: "enemy", unlock: 80, baseDurationSec: 20, scale: { m0: -10, m100: -20, unit: "pct" }, tags: ["ALL_STATS_DOWN"] },
];
const BUFF_REGEN_BASE = [
    { name: "Courageous March", category: "buff", kind: "buff", target: "AoE", side: "ally", unlock: 10, baseDurationSec: 20, scale: { m0: +5, m100: +10, unit: "pct" }, tags: ["ATK_UP"] },
    { name: "Swift Step", category: "buff", kind: "buff", target: "AoE", side: "ally", unlock: 15, baseDurationSec: 20, scale: { m0: +5, m100: +10, unit: "pct" }, tags: ["MOVE_SPEED_UP"] },
    { name: "Hymn of Vitality", category: "buff", kind: "regen", target: "AoE", side: "ally", unlock: 20, baseDurationSec: 20, scale: { m0: +2, m100: +5, unit: "pct" }, tags: ["HP_REGEN", "per5s"] }, // % Max HP / 5s
    { name: "Harmonious Shield", category: "buff", kind: "buff", target: "AoE", side: "ally", unlock: 25, baseDurationSec: 20, scale: { m0: +8, m100: +16, unit: "pct" }, tags: ["DEF_UP"] },
    { name: "Anthem of Unity", category: "buff", kind: "buff", target: "AoE", side: "ally", unlock: 30, baseDurationSec: 20, scale: { m0: -10, m100: -20, unit: "pct" }, tags: ["DMG_TAKEN_DOWN"] },
    { name: "Refreshing Aria", category: "buff", kind: "regen", target: "AoE", side: "ally", unlock: 40, baseDurationSec: 20, scale: { m0: +2, m100: +5, unit: "pct" }, tags: ["MP_REGEN", "per5s"] }, // % Max MP / 5s
    { name: "Enduring Rhythm", category: "buff", kind: "regen", target: "AoE", side: "ally", unlock: 50, baseDurationSec: 20, scale: { m0: +2, m100: +5, unit: "pct" }, tags: ["STAM_REGEN", "per5s"] }, // % Max STA / 5s
    { name: "Inspiring Chorus", category: "buff", kind: "buff", target: "AoE", side: "ally", unlock: 60, baseDurationSec: 20, scale: { m0: +5, m100: +10, unit: "pct" }, tags: ["ALL_STATS_UP"] },
    { name: "Resilient Ballad", category: "buff", kind: "buff", target: "AoE", side: "ally", unlock: 70, baseDurationSec: 20, scale: { m0: +15, m100: +25, unit: "pct" }, tags: ["CONTROL_RESIST_UP"] },
    { name: "Guardian’s Song", category: "buff", kind: "buff", target: "AoE", side: "ally", unlock: 80, baseDurationSec: 20, scale: { m0: +10, m100: +18, unit: "pct" }, tags: ["HP_SHIELD_PCTMAX"] },
];
/** Elemental songs @33 (resist allies) and @66 (weakness enemies) */
const ELEMENTS = ["Stone", "Water", "Wind", "Fire", "Ice", "Lightning", "Dark", "Light"];
const ELEMENTAL_BASE = [
    // Resist @33
    ...ELEMENTS.map(el => ({
        name: {
            Stone: "Stoneguard Tune", Water: "Flowing Harmony", Wind: "Tempest Chant", Fire: "Ember Hymn",
            Ice: "Frostsong", Lightning: "Storm Resonance", Dark: "Shadow Lament", Light: "Radiant Canticle"
        }[el],
        category: "elemental", kind: "resist", element: el,
        target: "AoE", side: "ally", unlock: 33, baseDurationSec: 20,
        scale: { m0: +15, m100: +25, unit: "pct" }, tags: ["ELEMENT_RESIST_UP"]
    })),
    // Weakness @66
    ...ELEMENTS.map(el => ({
        name: {
            Stone: "Shattering Note", Water: "Drowning Dirge", Wind: "Cutting Gale Song", Fire: "Scorching Refrain",
            Ice: "Piercing Chill", Lightning: "Overload Symphony", Dark: "Umbral Chant", Light: "Blinding Hymn"
        }[el],
        category: "elemental", kind: "weakness", element: el,
        target: "AoE", side: "enemy", unlock: 66, baseDurationSec: 20,
        scale: { m0: -15, m100: -25, unit: "pct" }, tags: ["ELEMENT_RESIST_DOWN"]
    })),
];
/** Ultimate @100 */
const ULTIMATE = {
    name: "Eternal Overture", category: "ultimate", kind: "ultimate",
    target: "AoE", side: "ally", unlock: 100, baseDurationSec: 20,
    scale: { m0: 0, m100: 0, unit: "pct" }, tags: ["ALL_STATS_UP_PARTY"]
};
/** Build SONGS with stable IDs */
function makeId(prefix, idx) { return `${prefix}:${idx.toString().padStart(2, "0")}`; }
export const INSTRUMENT_SONGS = [
    ...CONTROL_DEBUFF_DOT_BASE.map((s, i) => (Object.assign({ id: makeId("CTRL", i + 1) }, s))),
    ...BUFF_REGEN_BASE.map((s, i) => (Object.assign({ id: makeId("BUFF", i + 1) }, s))),
    ...ELEMENTAL_BASE.map((s, i) => (Object.assign({ id: makeId("ELEM", i + 1) }, s))),
    Object.assign({ id: "ULT:01" }, ULTIMATE)
];
const TAG_TO_MOD = {
    ATK_UP: "ATK_PCT",
    ATK_DOWN: "ATK_PCT",
    MOVE_SPEED_UP: "MOVE_SPEED_PCT",
    MOVE_SPEED_DOWN: "MOVE_SPEED_PCT",
    DEF_UP: "DEF_PCT",
    DEF_DOWN: "DEF_PCT",
    DMG_TAKEN_UP: "DMG_TAKEN_PCT",
    DMG_TAKEN_DOWN: "DMG_TAKEN_PCT",
    ALL_STATS_UP: "ALL_STATS_PCT",
    ALL_STATS_DOWN: "ALL_STATS_PCT",
    CONTROL_RESIST_UP: "CONTROL_RESIST_PCT",
    HP_SHIELD_PCTMAX: "HP_SHIELD_PCTMAX"
};
/** Resolve a song at proficiency P and attribute value into numbers your engine can apply */
export function resolveSongEffect(song, P, attrVal = 10) {
    var _a, _b, _c, _d, _e, _f;
    const durationSec = computeSongDurationSec(song, P);
    const baseMag = computeSongMagnitude(song, P);
    const magnitude = r2(baseMag * (1 + VARIANCE_ALPHA * (attrVal - 10)));
    const effect = {
        kind: song.kind,
        durationModel: "post-stop",
        element: song.element,
        tags: song.tags
    };
    let per5sPct;
    if (song.kind === "regen" || ((_a = song.tags) === null || _a === void 0 ? void 0 : _a.includes("HP_REGEN")) || ((_b = song.tags) === null || _b === void 0 ? void 0 : _b.includes("MP_REGEN")) || ((_c = song.tags) === null || _c === void 0 ? void 0 : _c.includes("STAM_REGEN"))) {
        per5sPct = magnitude;
        effect.percent = Math.abs(magnitude);
    }
    else if (song.kind === "dot" || ((_d = song.tags) === null || _d === void 0 ? void 0 : _d.includes("HP_DOT")) || ((_e = song.tags) === null || _e === void 0 ? void 0 : _e.includes("MP_DOT"))) {
        per5sPct = magnitude;
        effect.percent = Math.abs(magnitude);
    }
    else if (song.kind === "resist" || song.kind === "weakness") {
        effect.percent = Math.abs(magnitude);
    }
    else if (song.kind === "ultimate") {
        effect.modifiers = { ALL_STATS_PCT: magnitude };
    }
    else if (song.kind === "buff" || song.kind === "debuff") {
        const tag = (_f = song.tags) === null || _f === void 0 ? void 0 : _f[0];
        if (tag) {
            const key = TAG_TO_MOD[tag] || tag;
            effect.modifiers = { [key]: magnitude };
        }
    }
    return { durationSec, magnitude, per5sPct, effect };
}
export const INSTRUMENT_CFG = {
    g0: 0.065, // base gain unit (lower than active spells; you’re buffing from safety)
    contextWeight: { practice: 0.20, spar: 0.65, battle: 1.0 },
    // Level factor: equal-level gives some gains; higher-level improves quickly; lower-level yields almost none
    levelFloorEqual: 0.35, levelSlope: 0.12, levelCap: 1.0,
    // Crowd factor (more targets affected gives more “learning signal”)
    crowdK: 0.08, crowdMax: 1.30, // factor = 1 + min(crowdMax-1, crowdK*(targets-1))
    // Repetition & variety
    minRepeatFactor: 0.45,
    varietyMaxBonus: 0.25, varietyWindow: 10, varietyTargetDistinct: 4,
    // Unlock choke & cap taper
    postUnlockChoke: 0.35, unlockWindow: 8.0,
    capSoftenerK: 0.9,
    // Outcome weights
    outcomeWeight: { success: 1.0, partial: 0.25, fail: 0.0 },
    // Chance gating (to keep it slow past mid tiers)
    tauLow: 0.020, tauHigh: 0.060, pSmallMin: 0.12,
    rng: () => Math.random()
};
function levelFactor(actorL, enemyL, cfg = INSTRUMENT_CFG) {
    const d = enemyL - actorL;
    if (d < -1)
        return 0.05; // nearly nothing if content is much lower
    if (d <= 0)
        return cfg.levelFloorEqual; // equal or slightly lower
    return Math.min(cfg.levelCap, cfg.levelFloorEqual + cfg.levelSlope * d);
}
function repeatFactor(N_same, cfg = INSTRUMENT_CFG) {
    if (N_same <= 0)
        return 1;
    const f = 1 / (1 + Math.log(1 + N_same));
    return Math.max(cfg.minRepeatFactor, f);
}
function varietyFactor(ids, cfg = INSTRUMENT_CFG) {
    if (!ids || !ids.length)
        return 1;
    const slice = ids.slice(-cfg.varietyWindow);
    const distinct = new Set(slice).size;
    const t = Math.min(1, distinct / cfg.varietyTargetDistinct);
    return 1 + cfg.varietyMaxBonus * t;
}
function thresholdChoke(P, thresholds, cfg = INSTRUMENT_CFG) {
    for (const t of thresholds)
        if (P >= t && P <= t + cfg.unlockWindow)
            return cfg.postUnlockChoke;
    return 1.0;
}
function capGapFactor(P, cap, cfg = INSTRUMENT_CFG) {
    const gap = Math.max(0, cap - P);
    if (cap <= 0)
        return 0;
    return Math.pow(gap / cap, cfg.capSoftenerK);
}
function crowdFactor(n, cfg = INSTRUMENT_CFG) {
    return Math.min(cfg.crowdMax, 1 + cfg.crowdK * Math.max(0, n - 1));
}
/** Main: compute next proficiency (2-dec) */
export function gainInstrumentProficiency(input, cfg = INSTRUMENT_CFG) {
    const { P, cap, actorLevel, enemyLevelAvg, context, outcome, N_same, recentSongIds, thresholds, targetsAffected } = input;
    // Must be at least practice; battle/spar carry more weight automatically
    const W_ctx = cfg.contextWeight[context];
    if (W_ctx <= 0 || outcome === "fail")
        return r2(P);
    const F_level = levelFactor(actorLevel, enemyLevelAvg, cfg);
    const F_repeat = repeatFactor(N_same, cfg);
    const F_variety = varietyFactor(recentSongIds, cfg);
    const F_unlock = thresholdChoke(P, thresholds, cfg);
    const F_cap = capGapFactor(P, cap, cfg);
    const F_crowd = crowdFactor(targetsAffected, cfg);
    const W_outcome = cfg.outcomeWeight[outcome];
    const raw = cfg.g0 * W_ctx * F_level * F_repeat * F_variety * F_unlock * F_cap * F_crowd * W_outcome;
    const Δ = Math.min(raw, Math.max(0, cap - P));
    if (Δ <= 0)
        return r2(P);
    // Chance gate
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
/* ===================== Convenience lookups ===================== */
/** Get all songs unlocked at or below proficiency P */
export function songsAvailableAt(P) {
    return INSTRUMENT_SONGS.filter(s => P >= s.unlock);
}
/** Filter helpers */
export const songsByKind = (k) => INSTRUMENT_SONGS.filter(s => s.kind === k);
export const songsByElement = (el) => INSTRUMENT_SONGS.filter(s => s.element === el);
