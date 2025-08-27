// armor_proficiency.ts — light armor proficiency progression using evasion as reference

/** Round to 2 decimals */
const r2 = (x: number) => Math.round(x * 100) / 100;

export interface LightArmorGainInput {
  P: number;              // current proficiency (0..cap)
  cap: number;            // proficiency cap
  actorLevel: number;     // character level
  enemyLevel: number;     // defeated enemy level
  STR: number;            // actor strength
  DEX: number;            // actor dexterity
  AGI: number;            // actor agility
  lightPieces: number;    // number of equipped light armor pieces
  hasChest: boolean;      // true if chest/body piece is light armor
}

export interface LightArmorProgressionConfig {
  g0: number;                   // base gain per qualifying defeat
  levelFloorEqual: number;      // factor at equal level
  levelSlope: number;           // scale from level difference
  levelCap: number;             // max level factor
  attrBase: number;             // base attribute factor
  attrSlope: number;            // attribute scaling
  attrMax: number;              // cap on attribute factor
  maxGain: number;              // absolute cap on gain per check
  tauLow: number;               // lower threshold for chance gate
  tauHigh: number;              // upper threshold for chance gate
  pSmallMin: number;            // floor chance for tiny gains
  rng: () => number;            // RNG
}

export const LIGHT_ARMOR_CFG: LightArmorProgressionConfig = {
  g0: 0.04,
  levelFloorEqual: 0.2,
  levelSlope: 0.15,
  levelCap: 1.0,
  attrBase: 0.7,
  attrSlope: 0.01,
  attrMax: 1.3,
  maxGain: 0.5,
  tauLow: 0.015,
  tauHigh: 0.05,
  pSmallMin: 0.1,
  rng: () => Math.random(),
};

function levelFactor(actorL: number, enemyL: number, cfg: LightArmorProgressionConfig): number {
  const d = enemyL - actorL;
  if (d < 0) return 0; // no gain vs weaker foes
  if (d === 0) return cfg.levelFloorEqual;
  const f = cfg.levelFloorEqual + cfg.levelSlope * d;
  return Math.min(cfg.levelCap, f);
}

function attrFactor(STR: number, DEX: number, AGI: number, cfg: LightArmorProgressionConfig): number {
  const avg = (STR + DEX + AGI) / 3;
  const f = cfg.attrBase + cfg.attrSlope * avg;
  return Math.min(cfg.attrMax, Math.max(cfg.attrBase, f));
}

/** Compute next light armor proficiency (2 decimals).
 * Should be invoked once per defeated enemy while wearing light armor.
 */
export function gainLightArmorProficiency(
  input: LightArmorGainInput,
  cfg: LightArmorProgressionConfig = LIGHT_ARMOR_CFG
): number {
  const { P, cap, actorLevel, enemyLevel, STR, DEX, AGI, lightPieces, hasChest } = input;

  // Equipment requirement: at least four light pieces including chest/body
  if (lightPieces < 4 || !hasChest) return r2(P);

  const F_level = levelFactor(actorLevel, enemyLevel, cfg);
  if (F_level <= 0) return r2(P);

  const F_attr = attrFactor(STR, DEX, AGI, cfg);
  const raw = cfg.g0 * F_level * F_attr;
  const Δ = Math.min(cfg.maxGain, raw, Math.max(0, cap - P));
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

