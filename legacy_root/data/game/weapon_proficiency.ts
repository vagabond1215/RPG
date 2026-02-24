// weapon_proficiency.ts — generic weapon proficiency progression

import { gainProficiency, proficiencyCap, PROF_MILESTONES } from "./proficiency_base.js";
import type { Member, ProficiencyKind } from "./party.ts";

/** Options for gainWeaponProficiency */
export interface WeaponProficiencyOpts {
  /** Whether the weapon action succeeded (hit/kill). Defaults to true. */
  success?: boolean;
}

/**
 * Increase a member's weapon proficiency.
 *
 * The member must have a `proficiencies` map following the {@link ProfBlock}
 * shape from {@link party.ts}. If the block for the given kind does not
 * exist it will be initialised with default cap and thresholds.
 */
export function gainWeaponProficiency(
  member: Member,
  kind: ProficiencyKind,
  opts: WeaponProficiencyOpts = {}
): number {
  const { success = true } = opts;

  if (!member.proficiencies[kind]) {
    member.proficiencies[kind] = {
      value: 0,
      cap: proficiencyCap(member.level),
      thresholds: [...PROF_MILESTONES],
    };
  }

  const block = member.proficiencies[kind]!;

  // refresh cap for current level
  block.cap = proficiencyCap(member.level);

  block.value = gainProficiency({
    P: block.value,
    L: member.level,
    A0: 1,
    A: 0,
    r: 1,
    success,
  });

  return block.value;
}

// Convenience wrappers for specific weapons
export const gainSwordProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Sword", opts);
export const gainGreatswordProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Greatsword", opts);
export const gainAxeProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Axe", opts);
export const gainGreataxeProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Greataxe", opts);
export const gainSpearProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Spear", opts);
export const gainDaggerProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Dagger", opts);
export const gainMaceProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Mace", opts);
export const gainBowProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Bow", opts);
export const gainCrossbowProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Crossbow", opts);
export const gainStaffProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Staff", opts);
export const gainShieldProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Shield", opts);
export const gainWandProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Wand", opts);
export const gainUnarmedProficiency = (m: Member, opts?: WeaponProficiencyOpts) =>
  gainWeaponProficiency(m, "Weapon_Unarmed", opts);

