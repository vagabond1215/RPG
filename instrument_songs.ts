// instrument_songs.ts — Full songbook + scaling + progression (TS/JS)

/* ========================= Types & Helpers ========================= */

export type Element =
  | "Stone" | "Water" | "Wind" | "Fire"
  | "Ice"   | "Thunder" | "Dark" | "Light";

export type Side = "ally" | "enemy" | "party";
export type Target = "ST" | "AoE";

export type SongKind =
  | "buff" | "regen" | "debuff" | "dot" | "control"
  | "resist" | "weakness" | "ultimate";

export interface SongScale {
  /** magnitude at unlock proficiency (percentage values expressed as % points) */
  m0: number;
  /** magnitude at P=100 (linear interpolation from unlock to 100) */
  m100: number;
  /** an optional cap on magnitude after interpolation */
  cap?: number;
  /** textual unit hint: "pct" | "coeff" | "flat" */
  unit?: string;
}

export interface Song {
  id: string;
  name: string;
  category: "control" | "buff" | "elemental" | "ultimate";
  kind: SongKind;
  element?: Element;
  unlock: number;              // proficiency unlock (1..100)
  target: Target;
  side: Side;                  // who it applies to
  baseDurationSec: number;     // standard duration (before P-scaling)
  scale: SongScale;            // magnitude spec (unlocked..100 linear)
  tags?: string[];             // e.g. ["HP","MP","Stamina","Silence","DoT"]
}

/** clamp helper */
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** round to 2 decimals */
const r2 = (x: number) => Math.round(x * 100) / 100;
/** attribute-based variance multiplier */
export const VARIANCE_ALPHA = 0.02;

/** Duration scaling rule (standardized across all songs):
 *  duration = base * (1 + (P - unlock) / 100)
 *  always at least baseDurationSec
 */
export function computeSongDurationSec(song: Song, P: number): number {
  const growth = 1 + Math.max(0, (P - song.unlock)) / 100;
  return Math.floor(song.baseDurationSec * growth);
}

/** Magnitude interpolation from unlock -> 100; capped if provided.
 *  For percentage effects, 'scale.m0'/'scale.m100' are % points (e.g., 5 means +5%).
 */
export function computeSongMagnitude(song: Song, P: number): number {
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
const CONTROL_DEBUFF_DOT_BASE: Omit<Song, "id">[] = [
  { name:"Dissonant Chord",   category:"control", kind:"debuff", target:"ST",  side:"enemy", unlock:10, baseDurationSec:20, scale:{ m0:-10, m100:-18, unit:"pct" }, tags:["ATK_DOWN"] },
  { name:"Crippling Melody",  category:"control", kind:"debuff", target:"ST",  side:"enemy", unlock:15, baseDurationSec:20, scale:{ m0:-10, m100:-20, unit:"pct" }, tags:["MOVE_SPEED_DOWN"] },
  { name:"Withering Tone",    category:"control", kind:"dot",    target:"ST",  side:"enemy", unlock:20, baseDurationSec:20, scale:{ m0: 2,  m100: 4,  unit:"pct" }, tags:["HP_DOT","per5s"] },  // % Max HP per 5s
  { name:"Enfeebling Dirge",  category:"control", kind:"debuff", target:"AoE", side:"enemy", unlock:25, baseDurationSec:20, scale:{ m0:-8,  m100:-16, unit:"pct" }, tags:["DEF_DOWN"] },
  { name:"Discordant Anthem", category:"control", kind:"debuff", target:"AoE", side:"enemy", unlock:30, baseDurationSec:20, scale:{ m0:+10, m100:+18, unit:"pct" }, tags:["DMG_TAKEN_UP"] },
  { name:"Maddening Hum",     category:"control", kind:"control",target:"ST",  side:"enemy", unlock:40, baseDurationSec:15, scale:{ m0: 0,  m100: 0 }, tags:["Confuse"] },
  { name:"Soul-Draining Verse",category:"control",kind:"dot",    target:"ST",  side:"enemy", unlock:50, baseDurationSec:20, scale:{ m0: 2,  m100: 4,  unit:"pct" }, tags:["MP_DOT","per5s"] },  // % Max MP per 5s
  { name:"Lethargy Hymn",     category:"control", kind:"debuff", target:"AoE", side:"enemy", unlock:60, baseDurationSec:20, scale:{ m0:-10, m100:-20, unit:"pct" }, tags:["STAM_REGEN_DOWN"] },
  { name:"Silence of Strings",category:"control", kind:"control",target:"ST",  side:"enemy", unlock:70, baseDurationSec:10, scale:{ m0: 0,  m100: 0 }, tags:["Silence"] },
  { name:"Curse of Discord",  category:"control", kind:"debuff", target:"AoE", side:"enemy", unlock:80, baseDurationSec:20, scale:{ m0:-10, m100:-20, unit:"pct" }, tags:["ALL_STATS_DOWN"] },
];

const BUFF_REGEN_BASE: Omit<Song, "id">[] = [
  { name:"Courageous March",  category:"buff", kind:"buff",  target:"AoE", side:"ally",  unlock:10, baseDurationSec:20, scale:{ m0:+5,  m100:+10, unit:"pct" }, tags:["ATK_UP"] },
  { name:"Swift Step",        category:"buff", kind:"buff",  target:"AoE", side:"ally",  unlock:15, baseDurationSec:20, scale:{ m0:+5,  m100:+10, unit:"pct" }, tags:["MOVE_SPEED_UP"] },
  { name:"Hymn of Vitality",  category:"buff", kind:"regen", target:"AoE", side:"ally",  unlock:20, baseDurationSec:20, scale:{ m0:+2,  m100:+5,  unit:"pct" }, tags:["HP_REGEN","per5s"] },      // % Max HP / 5s
  { name:"Harmonious Shield", category:"buff", kind:"buff",  target:"AoE", side:"ally",  unlock:25, baseDurationSec:20, scale:{ m0:+8,  m100:+16, unit:"pct" }, tags:["DEF_UP"] },
  { name:"Anthem of Unity",   category:"buff", kind:"buff",  target:"AoE", side:"ally",  unlock:30, baseDurationSec:20, scale:{ m0:-10, m100:-20, unit:"pct" }, tags:["DMG_TAKEN_DOWN"] },
  { name:"Refreshing Aria",   category:"buff", kind:"regen", target:"AoE", side:"ally",  unlock:40, baseDurationSec:20, scale:{ m0:+2,  m100:+5,  unit:"pct" }, tags:["MP_REGEN","per5s"] },     // % Max MP / 5s
  { name:"Enduring Rhythm",   category:"buff", kind:"regen", target:"AoE", side:"ally",  unlock:50, baseDurationSec:20, scale:{ m0:+2,  m100:+5,  unit:"pct" }, tags:["STAM_REGEN","per5s"] },   // % Max STA / 5s
  { name:"Inspiring Chorus",  category:"buff", kind:"buff",  target:"AoE", side:"ally",  unlock:60, baseDurationSec:20, scale:{ m0:+5,  m100:+10, unit:"pct" }, tags:["ALL_STATS_UP"] },
  { name:"Resilient Ballad",  category:"buff", kind:"buff",  target:"AoE", side:"ally",  unlock:70, baseDurationSec:20, scale:{ m0:+15, m100:+25, unit:"pct" }, tags:["CONTROL_RESIST_UP"] },
  { name:"Guardian’s Song",   category:"buff", kind:"buff",  target:"AoE", side:"ally",  unlock:80, baseDurationSec:20, scale:{ m0:+10, m100:+18, unit:"pct" }, tags:["HP_SHIELD_PCTMAX"] },
];
/** Elemental songs @33 (resist allies) and @66 (weakness enemies) */
const ELEMENTS: Element[] = ["Stone","Water","Wind","Fire","Ice","Thunder","Dark","Light"];

const ELEMENTAL_BASE: Omit<Song, "id">[] = [
  // Resist @33
  ...ELEMENTS.map(el => ({
    name: ({
      Stone:"Stoneguard Tune", Water:"Flowing Harmony", Wind:"Tempest Chant", Fire:"Ember Hymn",
      Ice:"Frostsong", Thunder:"Storm Resonance", Dark:"Shadow Lament", Light:"Radiant Canticle"
    } as Record<Element,string>)[el],
    category:"elemental", kind:"resist" as const, element: el,
    target:"AoE", side:"ally", unlock:33, baseDurationSec:20,
    scale:{ m0:+15, m100:+25, unit:"pct" }, tags:["ELEMENT_RESIST_UP"]
  })),
  // Weakness @66
  ...ELEMENTS.map(el => ({
    name: ({
      Stone:"Shattering Note", Water:"Drowning Dirge", Wind:"Cutting Gale Song", Fire:"Scorching Refrain",
      Ice:"Piercing Chill", Thunder:"Overload Symphony", Dark:"Umbral Chant", Light:"Blinding Hymn"
    } as Record<Element,string>)[el],
    category:"elemental", kind:"weakness" as const, element: el,
    target:"AoE", side:"enemy", unlock:66, baseDurationSec:20,
    scale:{ m0:-15, m100:-25, unit:"pct" }, tags:["ELEMENT_RESIST_DOWN"]
  })),
];

/** Ultimate @100 */
const ULTIMATE: Omit<Song,"id"> = {
  name:"Eternal Overture", category:"ultimate", kind:"ultimate",
  target:"AoE", side:"ally", unlock:100, baseDurationSec:20,
  scale:{ m0:0, m100:0, unit:"pct" }, tags:["ALL_STATS_UP_PARTY"]
};

/** Build SONGS with stable IDs */
function makeId(prefix: string, idx: number) { return `${prefix}:${idx.toString().padStart(2,"0")}`; }

export const INSTRUMENT_SONGS: Song[] = [
  ...CONTROL_DEBUFF_DOT_BASE.map((s,i)=>({ id: makeId("CTRL", i+1), ...s })),
  ...BUFF_REGEN_BASE.map((s,i)=>({ id: makeId("BUFF", i+1), ...s })),
  ...ELEMENTAL_BASE.map((s,i)=>({ id: makeId("ELEM", i+1), ...s })),
  { id:"ULT:01", ...ULTIMATE }
];
/* ===================== Runtime Effect Resolvers ===================== */

export interface EffectPayload {
  kind: SongKind;
  durationModel: "post-stop";
  element?: Element;
  modifiers?: Record<string, number>;
  percent?: number;
  tags?: string[];
}

export interface ResolvedEffect {
  /** final duration in seconds (integer) */
  durationSec: number;
  /** primary magnitude number (percent points or coeff depending on song.scale.unit) */
  magnitude: number;
  /** convenience: normalized per-5s amount for regen/dot (% of Max pool) */
  per5sPct?: number;
  /** final structured effect payload */
  effect: EffectPayload;
}

const TAG_TO_MOD: Record<string, string> = {
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
export function resolveSongEffect(song: Song, P: number, attrVal = 10): ResolvedEffect {
  const durationSec = computeSongDurationSec(song, P);
  const baseMag = computeSongMagnitude(song, P);
  const magnitude = r2(baseMag * (1 + VARIANCE_ALPHA * (attrVal - 10)));

  const effect: EffectPayload = {
    kind: song.kind,
    durationModel: "post-stop",
    element: song.element,
    tags: song.tags
  };

  let per5sPct: number | undefined;
  if (song.kind === "regen" || song.tags?.includes("HP_REGEN") || song.tags?.includes("MP_REGEN") || song.tags?.includes("STAM_REGEN")) {
    per5sPct = magnitude;
    effect.percent = Math.abs(magnitude);
  } else if (song.kind === "dot" || song.tags?.includes("HP_DOT") || song.tags?.includes("MP_DOT")) {
    per5sPct = magnitude;
    effect.percent = Math.abs(magnitude);
  } else if (song.kind === "resist" || song.kind === "weakness") {
    effect.percent = Math.abs(magnitude);
  } else if (song.kind === "ultimate") {
    effect.modifiers = { ALL_STATS_PCT: magnitude };
  } else if (song.kind === "buff" || song.kind === "debuff") {
    const tag = song.tags?.[0];
    if (tag) {
      const key = TAG_TO_MOD[tag] || tag;
      effect.modifiers = { [key]: magnitude };
    }
  }

  return { durationSec, magnitude, per5sPct, effect };
}
/* ===================== Instrument Proficiency Progression ===================== */

/** Instrument proficiency is “active support”: practice works but is weak.
 *  Spar/Battle with equal+ foes is much better. Anti-spam, unlock choke, cap taper.
 */
export type Context = "practice" | "spar" | "battle";
export type PerfOutcome = "success" | "partial" | "fail";

export interface InstrumentGainInput {
  P: number;                  // current proficiency (2-dec)
  cap: number;                // current cap
  actorLevel: number;
  enemyLevelAvg: number;      // average level of relevant enemies in the scene
  context: Context;           // practice | spar | battle
  outcome: PerfOutcome;       // did the performance complete?
  N_same: number;             // consecutive uses of the same song
  recentSongIds: string[];    // last N song ids used (for variety)
  thresholds: number[];       // e.g., [10,20,30,40,50,60,70,80,90,100]
  targetsAffected: number;    // number of allies/enemies meaningfully affected (AoE value)
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

function levelFactor(actorL: number, enemyL: number, cfg = INSTRUMENT_CFG): number {
  const d = enemyL - actorL;
  if (d < -1) return 0.05; // nearly nothing if content is much lower
  if (d <= 0) return cfg.levelFloorEqual; // equal or slightly lower
  return Math.min(cfg.levelCap, cfg.levelFloorEqual + cfg.levelSlope * d);
}
function repeatFactor(N_same: number, cfg = INSTRUMENT_CFG): number {
  if (N_same <= 0) return 1;
  const f = 1 / (1 + Math.log(1 + N_same));
  return Math.max(cfg.minRepeatFactor, f);
}
function varietyFactor(ids: string[], cfg = INSTRUMENT_CFG): number {
  if (!ids || !ids.length) return 1;
  const slice = ids.slice(-cfg.varietyWindow);
  const distinct = new Set(slice).size;
  const t = Math.min(1, distinct / cfg.varietyTargetDistinct);
  return 1 + cfg.varietyMaxBonus * t;
}
function thresholdChoke(P: number, thresholds: number[], cfg = INSTRUMENT_CFG): number {
  for (const t of thresholds) if (P >= t && P <= t + cfg.unlockWindow) return cfg.postUnlockChoke;
  return 1.0;
}
function capGapFactor(P: number, cap: number, cfg = INSTRUMENT_CFG): number {
  const gap = Math.max(0, cap - P);
  if (cap <= 0) return 0;
  return Math.pow(gap / cap, cfg.capSoftenerK);
}
function crowdFactor(n: number, cfg = INSTRUMENT_CFG): number {
  return Math.min(cfg.crowdMax, 1 + cfg.crowdK * Math.max(0, n - 1));
}

/** Main: compute next proficiency (2-dec) */
export function gainInstrumentProficiency(input: InstrumentGainInput, cfg = INSTRUMENT_CFG): number {
  const {
    P, cap, actorLevel, enemyLevelAvg, context, outcome,
    N_same, recentSongIds, thresholds, targetsAffected
  } = input;

  // Must be at least practice; battle/spar carry more weight automatically
  const W_ctx = cfg.contextWeight[context];
  if (W_ctx <= 0 || outcome === "fail") return r2(P);

  const F_level   = levelFactor(actorLevel, enemyLevelAvg, cfg);
  const F_repeat  = repeatFactor(N_same, cfg);
  const F_variety = varietyFactor(recentSongIds, cfg);
  const F_unlock  = thresholdChoke(P, thresholds, cfg);
  const F_cap     = capGapFactor(P, cap, cfg);
  const F_crowd   = crowdFactor(targetsAffected, cfg);
  const W_outcome = cfg.outcomeWeight[outcome];

  const raw = cfg.g0 * W_ctx * F_level * F_repeat * F_variety * F_unlock * F_cap * F_crowd * W_outcome;
  const Δ = Math.min(raw, Math.max(0, cap - P));
  if (Δ <= 0) return r2(P);

  // Chance gate
  let pGain: number;
  if (Δ >= cfg.tauHigh) pGain = 1.0;
  else if (Δ <= cfg.tauLow) pGain = cfg.pSmallMin;
  else {
    const t = (Δ - cfg.tauLow) / (cfg.tauHigh - cfg.tauLow);
    pGain = cfg.pSmallMin + (1 - cfg.pSmallMin) * t;
  }
  return (cfg.rng() < pGain) ? r2(P + Δ) : r2(P);
}

/* ===================== Convenience lookups ===================== */

/** Get all songs unlocked at or below proficiency P */
export function songsAvailableAt(P: number): Song[] {
  return INSTRUMENT_SONGS.filter(s => P >= s.unlock);
}

/** Filter helpers */
export const songsByKind = (k: SongKind) => INSTRUMENT_SONGS.filter(s => s.kind === k);
export const songsByElement = (el: Element) => INSTRUMENT_SONGS.filter(s => s.element === el);
