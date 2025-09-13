import { Habitat, Region, Risk, FoodTier, LuxuryTier } from "./biomes";

export interface PlantByproduct {
  type: "fruit"|"nut"|"seed"|"grain"|"leaf"|"root"|"tuber"|"bulb"|"flower"|"sap"|"resin"|"fiber"|"wood"|"bark"|"oil"|"spice"|"herb"|"dye"|"medicine"|"mushroom"|"algae"|"other";
  notes?: string;
  yield_unit?: string;
  avg_yield?: number;
  harvest_season?: string;
}

export interface Plant {
  id: string;
  common_name: string;
  alt_names?: string[];
  growth_form: "tree"|"shrub"|"herb"|"grass"|"vine"|"bamboo"|"mushroom"|"fungus"|"algae"|"seaweed"|"lichen";
  regions: Region[];
  habitats: Habitat[];
  cultivated: boolean;
  edible: boolean;
  edible_parts?: string[];
  medicinal?: boolean;
  toxic?: boolean;
  toxicity_notes?: string;
  culinary_uses?: string[];
  foraging_notes?: string;
  byproducts: PlantByproduct[];
  seasonality?: string;
  sowing_season?: string;
  harvest_season?: string;
  growth_duration?: string;
  companion_crops?: string[];
  rotation_relationships?: string;
  fallow_notes?: string;
  narrative: string;
  tiers?: {
    food_tier?: FoodTier[];
    luxury_tier?: LuxuryTier[];
  };
}
