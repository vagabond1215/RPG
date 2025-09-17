export const WEAPON_SLOTS = [
  "mainHand",
  "offHand",
  "ranged",
  "instrument",
  "ammo"
];

export const ARMOR_SLOTS = [
  "head",
  "body",
  "back",
  "hands",
  "waist",
  "legs",
  "feet"
];

export const TRINKET_SLOTS = [
  "lEar",
  "rEar",
  "neck",
  "lRing",
  "rRing",
  "pouch"
];

export function createEmptyEquipment() {
  return {
    weapons: {
      mainHand: null,
      offHand: null,
      ranged: null,
      instrument: null,
      ammo: null
    },
    armor: {
      head: null,
      body: null,
      back: null,
      hands: null,
      waist: null,
      legs: null,
      feet: null
    },
    trinkets: {
      lEar: null,
      rEar: null,
      neck: null,
      lRing: null,
      rRing: null,
      pouch: null
    }
  };
}

export function createEquipmentItem({
  id = "",
  name = "",
  slot,
  type,
  damage = 0,
  defense = 0,
  abilities = [],
  effects = [],
  marketPrice = 0,
  condition = 100,
  weight = 0,
  rarity = "common",
  attributes = {},
  meta = {},
} = {}) {
  return {
    id,
    name,
    slot,
    type,
    baseStats: { damage, defense },
    abilities,
    effects,
    marketPrice,
    condition,
    weight,
    rarity,
    attributes,
    meta,
  };
}
