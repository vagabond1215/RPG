export const AQUATIC_HABITATS = [
  "deep_sea","open_ocean","coral_reefs","kelp_forests","continental_shelves",
  "estuaries","ocean_shores","rivers","streams","lakes","ponds","springs",
] as const;

export const WETLANDS_TRANSITIONAL_HABITATS = [
  "swamps","marshes","bogs","fens","floodplains","mangroves",
  "brackish_marshlands","tidal_flats",
] as const;

export const TERRESTRIAL_HABITATS = [
  "tropical_rainforest","temperate_rainforest","deciduous_forest","boreal_forest","dry_forest",
  "savanna","prairie","steppe","pampas","meadow",
  "hot_desert","cold_desert","semi_arid_scrublands","alpine_tundra","montane_forest",
  "cliffs","scree_slopes","arctic_tundra","subarctic_tundra","permafrost_zones",
] as const;

export const COASTAL_HABITATS = [
  "beaches","coastal_dunes","lagoons","barrier_islands",
] as const;

export const SUBTERRANEAN_HABITATS = [
  "limestone_caves","lava_tubes","underground_rivers","underground_lakes","karst_systems",
] as const;

export const POLAR_ICE_HABITATS = [
  "pack_ice","ice_shelves","glaciers","snowfields","polar_deserts",
] as const;

export const EXTREME_HABITATS = [
  "volcanic_regions","geothermal_springs","high_altitude_plateaus","hyper_arid_salt_basins",
] as const;

export const HABITATS = [
  ...AQUATIC_HABITATS,
  ...WETLANDS_TRANSITIONAL_HABITATS,
  ...TERRESTRIAL_HABITATS,
  ...COASTAL_HABITATS,
  ...SUBTERRANEAN_HABITATS,
  ...POLAR_ICE_HABITATS,
  ...EXTREME_HABITATS,
  // Anthropogenic or legacy categories
  "farmland","forest","grassland","hills","urban",
  // General habitat groupings for plants
  "coastal","riverlands","lake","wetland","mountains","desert","tundra",
] as const;
export type Habitat = typeof HABITATS[number];

export const REGIONS = [
  "aquatic","wetlands_transitional","terrestrial","coastal",
  "subterranean","polar_ice","extreme","urban",
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
