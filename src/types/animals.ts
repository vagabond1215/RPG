import { Habitat, Region, Diet, Risk } from "./biomes";

export interface AnimalByproduct {
  type: "egg"|"milk"|"wool"|"honey"|"labor"|"hide"|"fur"|"feather"|"meat"|"bone"|"horn"|"antler"|"shell"|"oil"|"silk"|"fat"|"gelatin"|"other";
  notes?: string;
  yield_unit?: string;
  avg_yield?: number;
  harvest_method?: "domesticated"|"wild"|"either";
}

export interface GenderedNames {
  male?: string;
  female?: string;
  juvenile?: string;
  collective?: string;
}

export interface Animal {
  id: string;
  common_name: string;
  alt_names?: string[];
  taxon_group: "mammal"|"bird"|"fish"|"reptile"|"amphibian"|"insect"|"arachnid"|"mollusk"|"crustacean"|"annelid"|"other";
  regions: Region[];
  habitats: Habitat[];
  diet: Diet[];
  food_sources?: string[];
  domestication: {
    domesticated: boolean;
    trainable?: boolean;
    draft_or_mount?: boolean;
    notes?: string;
  };
  behavior: {
    aggressive: boolean;
    territorial: boolean;
    risk_to_humans: Risk;
    nocturnal?: boolean;
    migratory?: boolean;
  };
  edibility: {
    edible: boolean;
    parts?: string[];
    preparation_notes?: string;
    taboo_or_restricted?: boolean;
  };
  disease_risks?: string[];
  byproducts: AnimalByproduct[];
  gendered: GenderedNames;
  size_class?: "tiny"|"small"|"medium"|"large"|"huge";
  narrative: string;
}
