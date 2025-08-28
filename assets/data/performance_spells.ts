import { HYBRID_RELATIONS } from "./hybrid_relations.js";

// Base elements represented across the RPG
export const BASE_ELEMENTS = [
  "Stone","Water","Wind","Fire",
  "Ice","Thunder","Dark","Light"
] as const;

// Hybrid element names derived from HYBRID_RELATIONS
export const HYBRID_ELEMENTS = HYBRID_RELATIONS.map(h => h.name);

export const ALL_ELEMENTS = [...BASE_ELEMENTS, ...HYBRID_ELEMENTS];

// Levels that require representation – every 10th level plus level 1
export const SONG_LEVELS = [1,10,20,30,40,50,60,70,80,90,100] as const;

// Naming vocabularies chosen to mirror existing thoughtful conventions
const SINGING_TITLES = [
  "Whisper","Ballad","Chant","Hymn","Refrain",
  "Chorus","Anthem","Rhapsody","Cantata","Symphony","Apotheosis"
] as const;

const DANCE_TITLES = [
  "Step","Reel","Waltz","Gavotte","Jig",
  "Saraband","Tarantella","Polka","Mazurka","Ballet","Ascendance"
] as const;

const INSTRUMENT_TITLES = [
  "Note","Tune","Melody","Harmony","Serenade",
  "Cadence","March","Sonata","Ode","Rondo","Finale"
] as const;

// Utility to build spell name maps for each performance discipline
function buildNames(titles: readonly string[]) {
  const result: Record<string, { level: number; name: string }[]> = {};
  ALL_ELEMENTS.forEach(el => {
    result[el] = SONG_LEVELS.map((lvl, idx) => ({ level: lvl, name: `${el} ${titles[idx]}` }));
  });
  return result;
}

export const SINGING_SPELLS = buildNames(SINGING_TITLES);
export const DANCING_SPELLS = buildNames(DANCE_TITLES);
export const INSTRUMENT_SPELLS = buildNames(INSTRUMENT_TITLES);

