// dance_moves.ts — Elemental dances and helpers (TS/JS)

type Element =
  | "Stone" | "Water" | "Wind" | "Fire"
  | "Ice" | "Thunder" | "Dark" | "Light";

export type Side = "ally" | "enemy" | "party";
export type Target = "ST" | "AoE";

export type DanceKind = "elementalOffense" | "elementalDefense";

export interface DanceScale {
  m0: number;
  m100: number;
  cap?: number;
  unit?: string;
}

export interface DanceMaintenance {
  maintainable: boolean;
  durationCountdown: "afterStop" | "during";
}

export interface Dance {
  id: string;
  name: string;
  category: "elemental";
  kind: DanceKind;
  element: Element;
  target: Target;
  side: Side;
  unlock: number;
  baseDurationSec: number;
  scale: DanceScale;
  tags?: string[];
  keyAttribute: string;
  maintenance?: DanceMaintenance;
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const r2 = (x: number) => Math.round(x * 100) / 100;
export const VARIANCE_ALPHA = 0.02;

const ELEMENTS: Element[] = [
  "Stone","Water","Wind","Fire",
  "Ice","Thunder","Dark","Light"
];

export const ELEMENTAL_DANCES: Omit<Dance, "id">[] = [
  // Offense @33: Infuse party attacks with elemental damage
  ...ELEMENTS.map(el => ({
    name: el + " Infusion Dance",
    category: "elemental", kind: "elementalOffense" as const, element: el,
    target: "AoE", side: "ally", unlock: 33, baseDurationSec: 20,
    scale: { m0: +10, m100: +20, unit: "pct" }, tags: ["ELEMENT_ATTACK_UP"],
    keyAttribute: "INT",
    maintenance: { maintainable: true, durationCountdown: "afterStop" }
  } as Omit<Dance, "id">)),

  // Shields @66: varying defensive/reactive effects
  {
    name: "Stone Ward Dance", category: "elemental", kind: "elementalDefense", element: "Stone",
    target: "AoE", side: "ally", unlock: 66, baseDurationSec: 20,
    scale: { m0: +12, m100: +22, unit: "pct" },
    tags: ["DMG_REDUCTION","THORNS"],
    keyAttribute: "CON", maintenance: { maintainable: true, durationCountdown: "afterStop" }
  } as Omit<Dance, "id">,
  {
    name: "Water Ward Dance", category: "elemental", kind: "elementalDefense", element: "Water",
    target: "AoE", side: "ally", unlock: 66, baseDurationSec: 20,
    scale: { m0: +12, m100: +22, unit: "pct" },
    tags: ["DMG_REDUCTION","SLOW_ON_HIT"],
    keyAttribute: "WIS", maintenance: { maintainable: true, durationCountdown: "afterStop" }
  } as Omit<Dance, "id">,
  {
    name: "Wind Ward Dance", category: "elemental", kind: "elementalDefense", element: "Wind",
    target: "AoE", side: "ally", unlock: 66, baseDurationSec: 20,
    scale: { m0: +12, m100: +22, unit: "pct" },
    tags: ["EVADE_UP","KNOCKBACK"],
    keyAttribute: "AGI", maintenance: { maintainable: true, durationCountdown: "afterStop" }
  } as Omit<Dance, "id">,
  {
    name: "Fire Ward Dance", category: "elemental", kind: "elementalDefense", element: "Fire",
    target: "AoE", side: "ally", unlock: 66, baseDurationSec: 20,
    scale: { m0: +12, m100: +22, unit: "pct" },
    tags: ["DMG_REDUCTION","BURN_REFLECT"],
    keyAttribute: "STR", maintenance: { maintainable: true, durationCountdown: "afterStop" }
  } as Omit<Dance, "id">,
  {
    name: "Ice Ward Dance", category: "elemental", kind: "elementalDefense", element: "Ice",
    target: "AoE", side: "ally", unlock: 66, baseDurationSec: 20,
    scale: { m0: +12, m100: +22, unit: "pct" },
    tags: ["DMG_ABSORB","PARALYZE_ON_HIT"],
    keyAttribute: "INT", maintenance: { maintainable: true, durationCountdown: "afterStop" }
  } as Omit<Dance, "id">,
  {
    name: "Thunder Ward Dance", category: "elemental", kind: "elementalDefense", element: "Thunder",
    target: "AoE", side: "ally", unlock: 66, baseDurationSec: 20,
    scale: { m0: +12, m100: +22, unit: "pct" },
    tags: ["DMG_ABSORB","STUN_ON_HIT"],
    keyAttribute: "INT", maintenance: { maintainable: true, durationCountdown: "afterStop" }
  } as Omit<Dance, "id">,
  {
    name: "Dark Ward Dance", category: "elemental", kind: "elementalDefense", element: "Dark",
    target: "AoE", side: "ally", unlock: 66, baseDurationSec: 20,
    scale: { m0: +12, m100: +22, unit: "pct" },
    tags: ["DMG_REDUCTION","LIFESTEAL_ON_HIT"],
    keyAttribute: "CHA", maintenance: { maintainable: true, durationCountdown: "afterStop" }
  } as Omit<Dance, "id">,
  {
    name: "Light Ward Dance", category: "elemental", kind: "elementalDefense", element: "Light",
    target: "AoE", side: "ally", unlock: 66, baseDurationSec: 20,
    scale: { m0: +12, m100: +22, unit: "pct" },
    tags: ["DMG_REDUCTION","ALLY_HEAL_ON_HIT"],
    keyAttribute: "WIS", maintenance: { maintainable: true, durationCountdown: "afterStop" }
  } as Omit<Dance, "id">
];

// Build dances with stable IDs
function makeId(idx: number) { return `ELEM:${idx.toString().padStart(2,"0")}`; }
export const DANCES: Dance[] = ELEMENTAL_DANCES.map((d, i) => ({ id: makeId(i + 1), ...d }));

/* ------------------------ Scaling utilities ------------------------ */

export function computeDanceDurationSec(d: Dance, P: number): number {
  const growth = 1 + Math.max(0, (P - d.unlock)) / 100;
  return Math.floor(d.baseDurationSec * growth);
}

export function computeDanceMagnitude(d: Dance, P: number): number {
  const t = clamp01((P - d.unlock) / (100 - d.unlock || 1));
  const raw = d.scale.m0 + (d.scale.m100 - d.scale.m0) * t;
  return d.scale.cap != null ? Math.min(raw, d.scale.cap) : raw;
}

/* ----------------------- Effect resolution ----------------------- */

export interface DanceEffect {
  kind: DanceKind;
  durationModel: "post-stop";
  element: Element;
  tags?: string[];
  maintenance?: DanceMaintenance;
  modifiers?: Record<string, number>;
  percent?: number;
}

export interface ResolvedDanceEffect {
  durationSec: number;
  magnitude: number;
  effect: DanceEffect;
}

const TAG_TO_MOD: Record<string, string> = {
  ELEMENT_ATTACK_UP: "ELEMENT_ATTACK_PCT",
  DMG_REDUCTION: "DMG_REDUCTION_PCT",
  EVADE_UP: "EVADE_PCT",
  DMG_ABSORB: "DMG_ABSORB_PCT"
};

export function resolveDanceEffect(d: Dance, P: number, attrVal = 10): ResolvedDanceEffect {
  const durationSec = computeDanceDurationSec(d, P);
  const baseMag = computeDanceMagnitude(d, P);
  const magnitude = r2(baseMag * (1 + VARIANCE_ALPHA * (attrVal - 10)));

  const effect: DanceEffect = {
    kind: d.kind,
    durationModel: "post-stop",
    element: d.element,
    tags: d.tags,
    maintenance: d.maintenance
  };

  const tag = d.tags?.[0];
  if (tag) {
    const key = TAG_TO_MOD[tag];
    if (key) effect.modifiers = { [key]: magnitude };
    else effect.percent = Math.abs(magnitude);
  }

  return { durationSec, magnitude, effect };
}

/* ----------------------- Convenience lookups ---------------------- */

export function dancesAvailableAt(P: number): Dance[] {
  return DANCES.filter(d => P >= d.unlock);
}

export const dancesByKind = (k: DanceKind) => DANCES.filter(d => d.kind === k);
export const dancesByElement = (el: Element) => DANCES.filter(d => d.element === el);

