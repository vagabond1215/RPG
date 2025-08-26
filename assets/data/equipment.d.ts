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

export interface EquipmentItemStats {
  damage: number;
  defense: number;
}

export interface EquipmentItem {
  id?: string;
  name?: string;
  slot: WeaponSlot | ArmorSlot | TrinketSlot | string;
  type: string;
  baseStats: EquipmentItemStats;
  abilities: string[];
  effects: string[];
  marketPrice: number;
  condition: number;
  weight: number;
  rarity?: string;
  attributes: Record<string, number>;
  meta: Record<string, any>;
}

export interface EquipmentItemParams {
  id?: string;
  name?: string;
  slot: WeaponSlot | ArmorSlot | TrinketSlot | string;
  type: string;
  damage?: number;
  defense?: number;
  abilities?: string[];
  effects?: string[];
  marketPrice?: number;
  condition?: number;
  weight?: number;
  rarity?: string;
  attributes?: Record<string, number>;
  meta?: Record<string, any>;
}

export function createEquipmentItem(params: EquipmentItemParams): EquipmentItem;
