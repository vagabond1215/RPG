export type Element =
  "Light"|"Dark"|"Stone"|"Wind"|"Thunder"|"Water"|"Fire"|"Ice";

export interface ElementRelation { strong: Element[]; weak: Element[]; }

export const ELEMENT_RELATIONS: Record<Element, ElementRelation> = {
  Light:   { strong: ["Dark"],    weak: ["Dark"] },
  Dark:    { strong: ["Light"],   weak: ["Light"] },
  Stone:   { strong: ["Wind"],    weak: ["Ice"] },
  Wind:    { strong: ["Thunder"], weak: ["Stone"] },
  Thunder: { strong: ["Water"],   weak: ["Wind"] },
  Water:   { strong: ["Fire"],    weak: ["Thunder"] },
  Fire:    { strong: ["Ice"],     weak: ["Water"] },
  Ice:     { strong: ["Stone"],   weak: ["Fire"] },
};

export function getElementRelation(attacker: Element, defender: Element): "strong"|"weak"|"neutral" {
  const rel = ELEMENT_RELATIONS[attacker];
  if (rel.strong.includes(defender)) return "strong";
  if (rel.weak.includes(defender))   return "weak";
  return "neutral";
}

/** Tunable combat multipliers (balanced defaults)
 * - damage:         direct hit / AoE damage
 * - dot:            periodic damage (per tick)
 * - heal:           restorative effects (if you let element affect them)
 * - controlChance:  chance for status to land (stun, burn, slow, etc.)
 * - targetResist:   multiplier on target’s elemental resistance/mitigation
 *                   ( <1 means their resist is less effective; >1 more effective )
 */
export const ELEMENTAL_MULT = {
  strong:  { damage: 1.25, dot: 1.25, heal: 1.10, controlChance: 1.15, targetResist: 0.85 },
  weak:    { damage: 0.75, dot: 0.75, heal: 0.90, controlChance: 0.85, targetResist: 1.15 },
  neutral: { damage: 1.00, dot: 1.00, heal: 1.00, controlChance: 1.00, targetResist: 1.00 },
} as const;

/** Get the full modifier bundle for an elemental interaction. */
export function getElementalModifiers(attackerElem: Element, defenderElem: Element) {
  const rel = getElementRelation(attackerElem, defenderElem);
  return ELEMENTAL_MULT[rel];
}

/** Convenience: apply a single scalar (damage/heal/dot/controlChance). */
export function applyElementalScalar(
  base: number,
  attackerElem: Element,
  defenderElem: Element,
  kind: keyof typeof ELEMENTAL_MULT["neutral"] // "damage" | "dot" | "heal" | "controlChance" | "targetResist"
): number {
  const mods = getElementalModifiers(attackerElem, defenderElem);
  return base * (mods as any)[kind];
}

/** If you model target elemental resistance separately (e.g., finalDamage *= (1 - resistPct)),
 * you can taper that resistance by relation using targetResist.
 * Example:
 *   const relMods = getElementalModifiers(attElem, defElem);
 *   const effectiveResist = resistPct * relMods.targetResist;
 *   finalDamage = baseDamage * mods.damage * (1 - effectiveResist);
 */
