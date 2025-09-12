export const HABITATS = [
  "coastal","riverlands","lake","wetland","grassland",
  "farmland","forest","hills","mountains","desert","tundra","urban",
] as const;
export type Habitat = typeof HABITATS[number];

export const REGIONS = [
  "terrestrial","aquatic_fresh","aquatic_salt","coastal","wetlands_transitional",
  "highland","arid","cold","urban",
] as const;
export type Region = typeof REGIONS[number];

export const DIET = ["herbivore","carnivore","omnivore","insectivore","detritivore","filter_feeder"] as const;
export type Diet = typeof DIET[number];

export const RISK = ["none","low","moderate","high","extreme"] as const;
export type Risk = typeof RISK[number];

export const FOOD_TIERS = ["Low Inn","Common","Fine","High Table"] as const;
export type FoodTier = typeof FOOD_TIERS[number];

export const LUXURY_TIERS = ["Common","Fine","Luxury","Arcane"] as const;
export type LuxuryTier = typeof LUXURY_TIERS[number];
