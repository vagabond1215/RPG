// trainers.ts — tiered trainer system for crafts

export type Craft =
  | 'glassblowing'
  | 'blacksmithing'
  | 'carpentry'
  | 'tailoring'
  | 'leatherworking'
  | 'alchemy'
  | 'enchanting'
  | 'pearl-diving'
  | 'masonry'
  | 'textiles';

export type TrainerTier =
  | 'initiate'
  | 'apprentice'
  | 'journeyman'
  | 'master';

export interface Trainer {
  craft: Craft;           // craft specialization
  tier: TrainerTier;      // trainer's tier
  name: string;           // trainer's name
  city: string;           // city where found
  location: string;       // specific building or landmark
}

export const TRAINER_TIERS: TrainerTier[] = [
  'initiate',
  'apprentice',
  'journeyman',
  'master'
];

/** Determine if a trainer of tier A can teach someone of tier B */
export function canTrain(trainer: TrainerTier, learner: TrainerTier): boolean {
  return TRAINER_TIERS.indexOf(trainer) > TRAINER_TIERS.indexOf(learner);
}

/**
 * Listing of known trainers in the kingdom.
 * Each craft has a single master located in the city famed for that craft.
 */
export const TRAINERS: Trainer[] = [
  { craft: 'glassblowing', tier: 'master', name: 'Mera of the Molten', city: "Wave's Break", location: 'Glassmakers\' Hall' },
  { craft: 'blacksmithing', tier: 'master', name: 'Thorin Forgehand', city: 'Corner Stone', location: 'Guild of Smiths' },
  { craft: 'carpentry', tier: 'master', name: 'Elda Timberwright', city: 'Timber Grove', location: 'The Timberhall' },
  { craft: 'tailoring', tier: 'master', name: 'Lady Seraphina', city: 'Corona', location: 'Threadneedle Hall' },
  { craft: 'leatherworking', tier: 'master', name: 'Rook the Tanner', city: "Dragon's Reach Road", location: "Tanners' Yard" },
  { craft: 'alchemy', tier: 'master', name: 'Sage Aurellius', city: 'Warm Springs', location: 'Emberflask Lab' },
  { craft: 'enchanting', tier: 'master', name: 'Archmage Selene', city: 'Mountain Top', location: "Arcanists' Enclave" },
  { craft: 'masonry', tier: 'master', name: 'Corin Wavecut', city: "Wave's Break", location: "Wavecut Stoneworks" },
  { craft: 'textiles', tier: 'master', name: 'Matron Selka', city: "Wave's Break", location: "Netmaker's Co-op" },

  // Journeyman and apprentice examples in populated cities
  { craft: 'glassblowing', tier: 'journeyman', name: 'Jorin Sandshaper', city: 'Coral Keep', location: "Glassblowing Workshop" },
  { craft: 'blacksmithing', tier: 'journeyman', name: 'Brakka Ironbent', city: "Wave's Break", location: "Tidefire Forge" },
  { craft: 'carpentry', tier: 'journeyman', name: 'Tella Woodhand', city: "Wave's Break", location: "Timberwave Carpenters' Guild" },
  { craft: 'tailoring', tier: 'apprentice', name: 'Nimble Nia', city: "Wave's Break", location: "The Gilded Needle Clothiers" },
  { craft: 'leatherworking', tier: 'apprentice', name: 'Pell the Tanner', city: "Wave's Break", location: "Salted Hide Tannery" },
  { craft: 'alchemy', tier: 'journeyman', name: 'Iris Flaskbinder', city: "Wave's Break", location: "Tideglass Alchemical Atelier" },
  { craft: 'enchanting', tier: 'initiate', name: 'Sira Glowtouch', city: "Wave's Break", location: "Arc Runes Enchantery" },
  { craft: 'pearl-diving', tier: 'journeyman', name: 'Doran Deepbreath', city: 'Coral Keep', location: "Pearl Diving Dock" },
  { craft: 'masonry', tier: 'journeyman', name: 'Lysa Quarryborn', city: "Wave's Break", location: "Cliffbreak Quarry" },
  { craft: 'textiles', tier: 'journeyman', name: 'Tarin Twinehand', city: "Wave's Break", location: "Netmaker's Co-op" },
];

/** Utility to fetch trainers able to teach a given learner tier */
export function trainersFor(craft: Craft, learner: TrainerTier, city?: string): Trainer[] {
  return TRAINERS.filter(t => t.craft === craft && canTrain(t.tier, learner) && (!city || t.city === city));
}
