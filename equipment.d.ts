export type WeaponSlot =
  | "mainHand"
  | "offHand"
  | "ranged"
  | "instrument"
  | "ammo";

export type ArmorSlot =
  | "head"
  | "body"
  | "back"
  | "hands"
  | "waist"
  | "legs"
  | "feet";

export type TrinketSlot =
  | "lEar"
  | "rEar"
  | "neck"
  | "lRing"
  | "rRing"
  | "pouch";

export interface Equipment {
  weapons: Record<WeaponSlot, string | null>;
  armor: Record<ArmorSlot, string | null>;
  trinkets: Record<TrinketSlot, string | null>;
}

export const WEAPON_SLOTS: WeaponSlot[];
export const ARMOR_SLOTS: ArmorSlot[];
export const TRINKET_SLOTS: TrinketSlot[];

export function createEmptyEquipment(): Equipment;
