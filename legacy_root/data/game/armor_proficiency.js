// armor_proficiency.ts — armor proficiency progression using evasion as reference
import { proficiencyCap } from "./proficiency_base.js";
/** Round to 2 decimals */
const r2 = (x) => Math.round(x * 100) / 100;
export const LIGHT_ARMOR_CFG = {
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
export const MEDIUM_ARMOR_CFG = Object.assign({}, LIGHT_ARMOR_CFG);
export const HEAVY_ARMOR_CFG = Object.assign({}, LIGHT_ARMOR_CFG);
function levelFactor(actorL, enemyL, cfg) {
    const d = enemyL - actorL;
    if (d < 0)
        return 0; // no gain vs weaker foes
    if (d === 0)
        return cfg.levelFloorEqual;
    const f = cfg.levelFloorEqual + cfg.levelSlope * d;
    return Math.min(cfg.levelCap, f);
}
function attrFactor(STR, DEX, AGI, cfg) {
    const avg = (STR + DEX + AGI) / 3;
    const f = cfg.attrBase + cfg.attrSlope * avg;
    return Math.min(cfg.attrMax, Math.max(cfg.attrBase, f));
}
function gainArmorProficiency(input, cfg) {
    const { P, cap, actorLevel, enemyLevel, STR, DEX, AGI, pieces, totalPieces, hasChest } = input;
    // Equipment requirement: majority of worn pieces including the chest/body
    if (!hasChest || pieces <= totalPieces / 2)
        return r2(P);
    const F_level = levelFactor(actorLevel, enemyLevel, cfg);
    if (F_level <= 0)
        return r2(P);
    const F_attr = attrFactor(STR, DEX, AGI, cfg);
    const raw = cfg.g0 * F_level * F_attr;
    const Δ = Math.min(cfg.maxGain, raw, Math.max(0, cap - P));
    if (Δ <= 0)
        return r2(P);
    let gain = 0;
    if (Δ >= cfg.tauHigh) {
        gain = Δ;
    }
    else {
        let p;
        if (Δ <= cfg.tauLow) {
            p = cfg.pSmallMin;
        }
        else {
            const t = (Δ - cfg.tauLow) / (cfg.tauHigh - cfg.tauLow);
            p = cfg.pSmallMin + t * (1 - cfg.pSmallMin);
        }
        if (cfg.rng() < p)
            gain = Δ;
    }
    const nextP = Math.min(cap, P + gain);
    return r2(nextP);
}
/** Compute next light armor proficiency (2 decimals).
 * Should be invoked once per defeated enemy while wearing light armor.
 */
export function gainLightArmorProficiency(input, cfg = LIGHT_ARMOR_CFG) {
    return gainArmorProficiency(input, cfg);
}
/** Medium armor proficiency progression */
export function gainMediumArmorProficiency(input, cfg = MEDIUM_ARMOR_CFG) {
    return gainArmorProficiency(input, cfg);
}
/** Heavy armor proficiency progression */
export function gainHeavyArmorProficiency(input, cfg = HEAVY_ARMOR_CFG) {
    return gainArmorProficiency(input, cfg);
}
const ARMOR_CFG_MAP = {
    lightArmor: LIGHT_ARMOR_CFG,
    mediumArmor: MEDIUM_ARMOR_CFG,
    heavyArmor: HEAVY_ARMOR_CFG,
};
function applyArmorProficiencyGain(character, key, params) {
    var _a, _b, _c, _d, _e, _f;
    if (!character)
        return 0;
    const { enemyLevel, pieces, totalPieces, hasChest, cap, cfg } = params;
    const attrs = ((_a = character.attributes) === null || _a === void 0 ? void 0 : _a.current) || {};
    const next = gainArmorProficiency({
        P: character[key] || 0,
        cap: cap !== null && cap !== void 0 ? cap : proficiencyCap((_b = character.level) !== null && _b !== void 0 ? _b : 1),
        actorLevel: (_c = character.level) !== null && _c !== void 0 ? _c : 1,
        enemyLevel,
        STR: (_d = attrs.STR) !== null && _d !== void 0 ? _d : 0,
        DEX: (_e = attrs.DEX) !== null && _e !== void 0 ? _e : 0,
        AGI: (_f = attrs.AGI) !== null && _f !== void 0 ? _f : 0,
        pieces,
        totalPieces,
        hasChest,
    }, cfg || ARMOR_CFG_MAP[key]);
    character[key] = next;
    return next;
}
export function applyLightArmorProficiencyGain(character, params) {
    return applyArmorProficiencyGain(character, 'lightArmor', params);
}
export function applyMediumArmorProficiencyGain(character, params) {
    return applyArmorProficiencyGain(character, 'mediumArmor', params);
}
export function applyHeavyArmorProficiencyGain(character, params) {
    return applyArmorProficiencyGain(character, 'heavyArmor', params);
}
