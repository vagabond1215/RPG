export type WeaponSlot =
  | "mainHand"
  | "offHand"
  | "ranged"
  | "instrument"
  | "ammo";

export type ArmorSlot =
  | "head"
  | "neck"
  | "body"
  | "shoulders"
  | "back"
  | "arms"
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

export type DamageType = "BLUNT" | "SLASH" | "PIERCE";

export interface CodexSchema {
  schemaVersion: string;
  ids: {
    namespace: string;
    prefixes: Record<string, string>;
  };
  enums: {
    damageTypes: DamageType[];
    armorClasses: string[];
    slotsArmor: ArmorSlot[];
    slotsWeapons: WeaponSlot[];
    slotsTrinkets: TrinketSlot[];
    quality: string[];
    regions: string[];
  };
}

export interface ArmorCatalogItem {
  id: string;
  categoryKey: string;
  internalName: string;
  displayName: string;
  baseItem: string;
  variant: string;
  qualityTier: string;
  primaryConsumer?: string;
  unit: string;
  marketValueCp: number;
  displayPrice: string;
  suggestedPriceCp: number;
  materialCostCp: number | null;
  laborCostCp: number | null;
  overheadCp: number | null;
  netProfitCp: number | null;
  dutyPct?: number;
  regions?: string[];
  perishable?: boolean;
  bulky?: boolean;
  fragile?: boolean;
  valueDense?: boolean;
  corridorFriendly?: boolean;
  defense: number;
  strReq: number;
  weightClass?: string;
  resists: Partial<Record<DamageType, number>>;
  weakness?: Partial<Record<DamageType, number>>;
  blockChanceBonusPct?: number;
  blockPowerBonus?: number;
  shieldBlockChancePct?: number;
  shieldDamageReductionPct?: number;
  shieldBashDamage?: number;
  shieldBashStunChancePct?: number;
  critDamageReductionPct?: number;
  critDefense?: number;
  slots: string[];
  setMemberships?: string[];
}

export interface ArmorSet {
  id: string;
  displayName: string;
  components: string[];
  class: string;
  signatureWeapons?: string[];
  setBonuses: Record<string, number>;
}

export interface ArmorCatalog {
  items: ArmorCatalogItem[];
  sets: ArmorSet[];
}

export interface TrinketCatalogItem {
  id: string;
  displayName: string;
  variant: string;
  qualityTier: string;
  marketValueCp: number;
  displayPrice: string;
  suggestedPriceCp: number;
  netProfitCp: number;
  slots: string[];
}

export interface TrinketCatalog {
  items: TrinketCatalogItem[];
}

export interface Equipment {
  weapons: Record<WeaponSlot, string | null>;
  armor: Record<ArmorSlot, string | null>;
  trinkets: Record<TrinketSlot, string | null>;
}

export const WEAPON_SLOTS: WeaponSlot[];
export const ARMOR_SLOTS: ArmorSlot[];
export const TRINKET_SLOTS: TrinketSlot[];

export const CODEX_SCHEMA: CodexSchema;
export const ARMOR_CATALOG: ArmorCatalog;
export const TRINKET_CATALOG: TrinketCatalog;

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
