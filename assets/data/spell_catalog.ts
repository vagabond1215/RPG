/*
 * Spell catalog generator implementing elemental + school structure.
 * This module is responsible for producing the authoritative spell list
 * along with helpers used across the project when generating/upgrading
 * entries. It follows the design outlined in the revamped spellbook spec.
 */

export type Tier = "MINOR" | "LESSER" | "BASELINE" | "GREATER" | "MAJOR" | "MYTHIC";
export const TIERS: Tier[] = ["MINOR", "LESSER", "BASELINE", "GREATER", "MAJOR", "MYTHIC"];

export type ElementId =
  | "fire"
  | "ice"
  | "lightning"
  | "water"
  | "wind"
  | "stone"
  | "light"
  | "dark";

export type SchoolId =
  | "destruction"
  | "enhancement"
  | "enfeeblement"
  | "control"
  | "healing";

export type ElementName = Capitalize<ElementId>;
export type SchoolName = Capitalize<SchoolId>;

export const ALL_SCHOOLS: readonly SchoolId[] = [
  "destruction",
  "enhancement",
  "enfeeblement",
  "control",
  "healing",
] as const;

export type FamilyId =
  | "projectile_sphere"
  | "liquid_flow"
  | "piercing"
  | "blade"
  | "beam"
  | "burst";

export type Family = "attack" | "control" | "support";
export type ActionType = "Attack" | "Debuff" | "Buff" | "Control" | "Heal" | "Chant";
export type TargetRange = "SELF" | "SINGLE" | "PARTY" | "ENEMY" | "ENEMIES";

export interface ExtraLineage {
  isChant?: boolean;
  isDance?: boolean;
  isSummon?: boolean;
  isNinjutsu?: boolean;
}

export type StatusName =
  | "Burn"
  | "Bleed"
  | "Poison"
  | "Shock"
  | "Paralyze"
  | "Slow"
  | "Root"
  | "Stun"
  | "Silence"
  | "Blind"
  | "Weaken"
  | "Expose"
  | "Confuse"
  | "Sleep"
  | "Petrify";

export type BoonName =
  | "Haste"
  | "Blessing"
  | "Aegis"
  | "Ward"
  | "Veil"
  | "Regen"
  | "Refresh"
  | "Fortify"
  | "Frenzy";

export type OverTimeKind = "DoT" | "HoT" | "DrainMP" | "RestoreMP";

export type StatLane = "melee" | "ranged" | "magic" | "general";

export type StatKind =
  | "atk"
  | "def"
  | "acc"
  | "eva"
  | "crit"
  | "spd"
  | "resist"
  | "dmgTaken"
  | "dmgDealt";

export interface ElemResMod {
  element: ElementId;
  delta: number;
}

export interface EffectAtom {
  kind: "status" | "boon" | "overtime" | "stat" | "elemres";
  statusName?: StatusName;
  chance?: number;
  potency?: number;
  duration?: number;
  boonName?: BoonName;
  otKind?: OverTimeKind;
  otPerTick?: number;
  lane?: StatLane;
  stat?: StatKind;
  value?: number;
  elemres?: ElemResMod;
}

export interface StatusSpec {
  name: string;
  chance: number;
  potency?: number;
  duration?: number;
}

export interface SpellEntry {
  id: string;
  name: string;
  element: ElementName;
  school: SchoolName;
  family: Family;
  type: ActionType;
  target: TargetRange;
  proficiency: number;
  tier: Tier;
  mpCost: number;
  upkeep?: number;
  basePower: number;
  status?: StatusSpec;
  statusOnCrit?: StatusSpec;
  effects?: EffectAtom[];
  description: string;
  lineage?: ExtraLineage;
}

export type SpecialLine = "song" | "dance" | "summon" | "ninjutsu" | null;

const ELEMENT_KEYWORDS: Record<ElementId, string[]> = {
  fire: ["fire", "pyro", "flame", "blaze", "ember"],
  ice: ["ice", "frost", "glacier", "hail", "rime"],
  lightning: ["lightning", "thunder", "volt", "spark", "storm"],
  water: ["water", "aqua", "tidal", "wave", "current"],
  wind: ["wind", "gale", "gust", "squall", "zephyr"],
  stone: ["stone", "earth", "geo", "rock", "granite"],
  light: ["light", "holy", "sun", "radiant", "lumen"],
  dark: ["dark", "shadow", "void", "umbral", "gloom"],
};

const FAMILY_POOLS: Record<FamilyId, Record<Tier, string[]>> = {
  projectile_sphere: {
    MINOR: ["Pellet", "Bead"],
    LESSER: ["Ball", "Globelet"],
    BASELINE: ["Orb", "Sphere", "Ball"],
    GREATER: ["Globe", "Core"],
    MAJOR: ["Star", "Nova"],
    MYTHIC: ["Sun", "Singularity"],
  },
  liquid_flow: {
    MINOR: ["Drip", "Rill"],
    LESSER: ["Jet", "Trickle"],
    BASELINE: ["Stream", "Spout"],
    GREATER: ["Torrent", "Surge"],
    MAJOR: ["Flood", "Deluge"],
    MYTHIC: ["Maelstrom", "Cataclysm"],
  },
  piercing: {
    MINOR: ["Pin", "Prick", "Awl"],
    LESSER: ["Needle", "Spike"],
    BASELINE: ["Spear", "Glaive"],
    GREATER: ["Lance", "Pike"],
    MAJOR: ["Harpoon", "Javelin"],
    MYTHIC: ["Godspear", "World-Pike"],
  },
  blade: {
    MINOR: ["Shard", "Sliver"],
    LESSER: ["Knife", "Dirk"],
    BASELINE: ["Dagger", "Shortsword"],
    GREATER: ["Sword", "Saber"],
    MAJOR: ["Greatsword", "Claymore"],
    MYTHIC: ["Kingsblade", "Sunblade"],
  },
  beam: {
    MINOR: ["Spark", "Glimmer"],
    LESSER: ["Bolt", "Dart"],
    BASELINE: ["Ray", "Beam"],
    GREATER: ["Lance", "Piercer"],
    MAJOR: ["Sunbeam", "Starshot"],
    MYTHIC: ["Heavenray", "Starsear"],
  },
  burst: {
    MINOR: ["Puff", "Flare"],
    LESSER: ["Burst", "Pop"],
    BASELINE: ["Blast", "Wave"],
    GREATER: ["Storm", "Tempest"],
    MAJOR: ["Cataclysm", "Annihilation"],
    MYTHIC: ["Armageddon", "Worldfire"],
  },
};

const ELEMENT_POOLS: Record<ElementId, Record<Tier, string[]>> = {
  fire: {
    MINOR: ["Ember", "Ashen"],
    LESSER: ["Cinder", "Kindled"],
    BASELINE: ["Flame", "Fiery"],
    GREATER: ["Blaze", "Wildfire"],
    MAJOR: ["Inferno", "Hellfire"],
    MYTHIC: ["Pyroclasm", "Sunfire"],
  },
  ice: {
    MINOR: ["Rime", "Hoarfrost"],
    LESSER: ["Chill", "Icy"],
    BASELINE: ["Frost", "Ice"],
    GREATER: ["Glacial", "Permafrost"],
    MAJOR: ["Blizzard", "Hailstorm"],
    MYTHIC: ["Absolute Zero", "Ice Age"],
  },
  lightning: {
    MINOR: ["Static", "Tingle"],
    LESSER: ["Spark", "Charged"],
    BASELINE: ["Bolt", "Lightning"],
    GREATER: ["Thunder", "Thunderbolt"],
    MAJOR: ["Stormborn", "Tempestuous"],
    MYTHIC: ["Worldstorm", "Skybreaker"],
  },
  water: {
    MINOR: ["Dew", "Briny"],
    LESSER: ["Aqueous", "Tidal"],
    BASELINE: ["Water", "Wave"],
    GREATER: ["Surging", "Riptide"],
    MAJOR: ["Deluge", "Leviathan"],
    MYTHIC: ["Abyssal", "Worldsea"],
  },
  wind: {
    MINOR: ["Whiff", "Breath"],
    LESSER: ["Breeze", "Zephyr"],
    BASELINE: ["Gust", "Gale"],
    GREATER: ["Squall", "Tempest"],
    MAJOR: ["Hurricane", "Typhoon"],
    MYTHIC: ["Worldwind", "Sky Tyrant"],
  },
  stone: {
    MINOR: ["Grit", "Pebble"],
    LESSER: ["Rocky", "Stony"],
    BASELINE: ["Stone", "Earth"],
    GREATER: ["Granite", "Boulder"],
    MAJOR: ["Monolith", "Mountain"],
    MYTHIC: ["Worldpillar", "Tectonic"],
  },
  light: {
    MINOR: ["Gleam", "Faint"],
    LESSER: ["Bright", "Shining"],
    BASELINE: ["Light", "Radiant"],
    GREATER: ["Sunlit", "Dawning"],
    MAJOR: ["Solar", "Aureate"],
    MYTHIC: ["Seraphic", "Supernal"],
  },
  dark: {
    MINOR: ["Dim", "Dusky"],
    LESSER: ["Shadowed", "Umbral"],
    BASELINE: ["Dark", "Shadow"],
    GREATER: ["Deep", "Stygian"],
    MAJOR: ["Utter", "Abyssal"],
    MYTHIC: ["Null", "Eldritch"],
  },
};

const PREFIX_BY_TIER: Record<Tier, string[]> = {
  MINOR: ["Faint", "Lesser", "Pale"],
  LESSER: ["Lesser", "Dwindled", "Diminished"],
  BASELINE: ["", ""],
  GREATER: ["Greater", "Deep", "Potent"],
  MAJOR: ["Grand", "Utter", "Prime"],
  MYTHIC: ["Mythic", "Transcendent", "Absolute"],
};

const SUFFIX_BY_TIER: Record<Tier, string[]> = {
  MINOR: ["of Embers", "of Whispers"],
  LESSER: ["of Sparks", "of Chill"],
  BASELINE: ["", ""],
  GREATER: ["Ascendant", "Unbound"],
  MAJOR: ["Sovereign", "Prime"],
  MYTHIC: ["Apotheosis", "World-End"],
};

const INTENSITY_STEPS: Record<Tier, number> = {
  MINOR: -2,
  LESSER: -1,
  BASELINE: 0,
  GREATER: +1,
  MAJOR: +2,
  MYTHIC: +3,
};

const SONG_TERMS: Record<Tier, string[]> = {
  MINOR: ["Ditty", "Hum", "Air", "Ayre", "Tune"],
  LESSER: ["Hymn", "Carol", "Chant", "Psalm", "Round"],
  BASELINE: ["Madrigal", "Aria", "Ballad", "Lay", "Canticle", "Nocturne"],
  GREATER: ["Anthem", "Chorale", "Ode", "Elegy", "Motet"],
  MAJOR: ["Rhapsody", "Oratorio", "Cantata", "Threnody"],
  MYTHIC: ["Apothegm", "Sublime Chorus", "Worldsong"],
};

const DANCE_TERMS: Record<Tier, string[]> = {
  MINOR: ["Step", "Shuffle", "Hop", "Skip", "Reellet"],
  LESSER: ["Jig", "Reel", "Polka", "Fandango"],
  BASELINE: ["Waltz", "Sarabande", "Gigue", "Gavotte", "Pavana", "Allemande"],
  GREATER: ["Samba", "Tango", "Bolero", "Flamenco"],
  MAJOR: ["Tarantella", "Mazurka", "Bharatanatyam", "Kathak"],
  MYTHIC: ["Worlddance", "Eclipse Pavane", "Celestial Mudra"],
};

const ETUDE_TERMS: Record<Tier, string[]> = {
  MINOR: ["Étude I", "Practice I"],
  LESSER: ["Étude II", "Practice II"],
  BASELINE: ["Étude", "Study"],
  GREATER: ["Grand Étude", "Master Study"],
  MAJOR: ["Prime Étude", "Virtuoso Study"],
  MYTHIC: ["Transcendent Étude", "Mythic Study"],
};

const FAMILY_TOKENS: Record<FamilyId, string[]> = {
  projectile_sphere: ["ball", "orb", "sphere", "globe", "star", "sun", "nova"],
  liquid_flow: ["jet", "stream", "torrent", "flood", "deluge", "surge"],
  piercing: ["needle", "spear", "lance", "pike", "harpoon", "javelin"],
  blade: ["knife", "dagger", "sword", "greatsword", "claymore", "dirk", "saber"],
  beam: ["spark", "bolt", "ray", "beam", "lance", "piercer"],
  burst: ["puff", "burst", "blast", "wave", "storm", "tempest", "cataclysm", "annihilation"],
};

interface RNG {
  next(): number;
}

class SeededRNG implements RNG {
  private s: number;
  constructor(seed = 1234567) {
    this.s = seed >>> 0;
  }
  next() {
    let x = this.s;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.s = x >>> 0;
    return (this.s & 0xffffffff) / 0x100000000;
  }
}

function shuffle<T>(arr: T[], rng: RNG): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

class PoolState {
  private familyState: Record<string, Record<Tier, { items: string[]; idx: number }>> = {};
  private elementState: Record<string, Record<Tier, { items: string[]; idx: number }>> = {};
  private customState: Record<string, Record<Tier, { items: string[]; idx: number }>> = {};
  constructor(private rng: RNG = new SeededRNG()) {}

  private ensureFamily(family: FamilyId, tier: Tier) {
    if (!this.familyState[family]) this.familyState[family] = {} as any;
    if (!this.familyState[family][tier]) {
      this.familyState[family][tier] = {
        items: shuffle(FAMILY_POOLS[family][tier], this.rng),
        idx: 0,
      };
    }
  }

  private ensureElement(element: ElementId, tier: Tier) {
    if (!this.elementState[element]) this.elementState[element] = {} as any;
    if (!this.elementState[element][tier]) {
      this.elementState[element][tier] = {
        items: shuffle(ELEMENT_POOLS[element][tier], this.rng),
        idx: 0,
      };
    }
  }

  takeFamily(f: FamilyId, t: Tier) {
    if (!FAMILY_POOLS[f]) {
      throw new Error(`Unknown family pool ${f}`);
    }
    if (!FAMILY_POOLS[f][t]) {
      throw new Error(`Missing tier ${t} for family ${f}`);
    }
    this.ensureFamily(f, t);
    const st = this.familyState[f][t];
    if (st.idx >= st.items.length) {
      st.items = shuffle(FAMILY_POOLS[f][t], this.rng);
      st.idx = 0;
    }
    const value = st.items[st.idx++];
    return value ?? FAMILY_POOLS[f][t][0];
  }

  takeElement(e: ElementId, t: Tier) {
    if (!ELEMENT_POOLS[e]) {
      throw new Error(`Unknown element pool ${e}`);
    }
    if (!ELEMENT_POOLS[e][t]) {
      throw new Error(`Missing tier ${t} for element ${e}`);
    }
    this.ensureElement(e, t);
    const st = this.elementState[e][t];
    if (st.idx >= st.items.length) {
      st.items = shuffle(ELEMENT_POOLS[e][t], this.rng);
      st.idx = 0;
    }
    const value = st.items[st.idx++];
    return value ?? ELEMENT_POOLS[e][t][0];
  }

  takeCustom(key: string, pool: Record<Tier, string[]>, tier: Tier) {
    if (!pool[tier]) {
      throw new Error(`Missing tier ${tier} for ${key}`);
    }
    if (!this.customState[key]) this.customState[key] = {} as any;
    if (!this.customState[key][tier]) {
      this.customState[key][tier] = { items: shuffle(pool[tier], this.rng), idx: 0 };
    }
    const st = this.customState[key][tier];
    if (st.idx >= st.items.length) {
      st.items = shuffle(pool[tier], this.rng);
      st.idx = 0;
    }
    const value = st.items[st.idx++];
    return value ?? pool[tier][0];
  }

  takePrefix(t: Tier) {
    const items = PREFIX_BY_TIER[t];
    if (!items.length) return "";
    return items[Math.floor(this.rng.next() * items.length)] ?? "";
  }

  takeSuffix(t: Tier) {
    const items = SUFFIX_BY_TIER[t];
    if (!items.length) return "";
    return items[Math.floor(this.rng.next() * items.length)] ?? "";
  }

  pickOne<T>(items: T[]): T {
    if (!items.length) {
      throw new Error("Cannot pick from empty list");
    }
    const raw = this.rng.next();
    const idx = Math.floor(raw * items.length);
    return items[idx] ?? items[0];
  }
}

const detectElement = (name: string): ElementId | null => {
  const lower = name.toLowerCase();
  for (const [el, keys] of Object.entries(ELEMENT_KEYWORDS) as [ElementId, string[]][]) {
    if (keys.some(k => lower.includes(k))) return el;
  }
  return null;
};

const detectFamily = (name: string): { family: FamilyId; matched: string; tier: Tier } | null => {
  const lower = name.toLowerCase();
  for (const [family, tokens] of Object.entries(FAMILY_TOKENS) as [FamilyId, string[]][]) {
    for (const token of tokens) {
      const re = new RegExp(`\\b${token}\\b`, "i");
      if (re.test(lower)) {
        const tier: Tier =
          /^(pellet|bead|drip|rill|pin|prick|awl|shard|sliver|spark|glimmer|puff)$/i.test(token)
            ? "MINOR"
            : /^(ball|globelet|jet|trickle|needle|spike|knife|dirk|bolt|dart|burst|pop)$/i.test(token)
              ? "LESSER"
              : /^(orb|sphere|stream|spout|spear|glaive|dagger|shortsword|ray|beam|blast|wave)$/i.test(token)
                ? "BASELINE"
                : /^(globe|core|torrent|surge|lance|pike|sword|saber|lance|piercer|storm|tempest)$/i.test(token)
                  ? "GREATER"
                  : /^(star|nova|flood|deluge|harpoon|javelin|greatsword|claymore|sunbeam|starshot|cataclysm|annihilation)$/i.test(token)
                    ? "MAJOR"
                    : "MYTHIC";
        return { family, matched: token, tier };
      }
    }
  }
  return null;
};

export class SpellScaler {
  constructor(private pools = new PoolState()) {}

  scale(
    baseName: string,
    target: Tier,
    opts?: {
      allowElementAdj?: boolean;
      usePrefix?: boolean;
      useSuffix?: boolean;
      preferPrefixOverSuffix?: boolean;
    },
  ): string {
    const { allowElementAdj = true, usePrefix = true, useSuffix = false, preferPrefixOverSuffix = true } = opts || {};
    const element = detectElement(baseName);
    const fam = detectFamily(baseName);

    let name = baseName;

    if (fam) {
      const delta = INTENSITY_STEPS[target];
      const idxNow = TIERS.indexOf(fam.tier);
      const idxTarget = clamp(idxNow + delta, 0, TIERS.length - 1);
      const targetTier = TIERS[idxTarget] as Tier;
      const replacement = this.pools.takeFamily(fam.family, targetTier);
      const re = new RegExp(`\\b${fam.matched}\\b`, "i");
      name = name.replace(re, m => (m[0] === m[0].toUpperCase() ? capitalize(replacement) : replacement.toLowerCase()));
    } else if (element && allowElementAdj) {
      const replacement = this.pools.takeElement(element, target);
      const repRe = new RegExp(`\\b(${ELEMENT_KEYWORDS[element].join("|")})\\b`, "i");
      name = repRe.test(name) ? name.replace(repRe, capitalize(replacement)) : `${capitalize(replacement)} ${name}`.trim();
    }

    const prefix = usePrefix ? this.pools.takePrefix(target) : "";
    const suffix = useSuffix ? this.pools.takeSuffix(target) : "";

    if (prefix && suffix) {
      name = preferPrefixOverSuffix ? `${prefix} ${name} ${suffix}` : `${name} ${suffix} ${prefix}`;
    } else if (prefix) {
      name = `${prefix} ${name}`;
    } else if (suffix) {
      name = `${name} ${suffix}`;
    }

    return name.replace(/\s{2,}/g, " ").trim();
  }

  ladder(baseName: string, opts?: Parameters<SpellScaler["scale"]>[2]) {
    const out: Record<Tier, string> = {} as any;
    for (const t of TIERS) out[t] = this.scale(baseName, t, opts);
    return out;
  }
}

export const ELEMENT_SCHOOL_WEIGHTS: Record<ElementId, Partial<Record<SchoolId, number>>> = {
  fire: { destruction: 9, enfeeblement: 3, enhancement: 2, control: 1 },
  ice: { control: 9, destruction: 3, enfeeblement: 2, enhancement: 1 },
  lightning: { destruction: 9, enfeeblement: 3, control: 2, enhancement: 1 },
  water: { healing: 9, control: 3, destruction: 2, enhancement: 1 },
  wind: { control: 9, enfeeblement: 3, destruction: 2, enhancement: 1 },
  stone: { enhancement: 9, control: 3, destruction: 2, enfeeblement: 1 },
  light: { healing: 9, enhancement: 3, control: 2, destruction: 1 },
  dark: { enfeeblement: 9, control: 3, destruction: 2, enhancement: 1 },
};

export const familyFromSchool = (s: SchoolId): Family => {
  switch (s) {
    case "destruction":
      return "attack";
    case "healing":
      return "support";
    case "enhancement":
      return "support";
    case "enfeeblement":
      return "control";
    case "control":
    default:
      return "control";
  }
};

export const typeFromSchool = (s: SchoolId): ActionType => {
  switch (s) {
    case "destruction":
      return "Attack";
    case "healing":
      return "Heal";
    case "enhancement":
      return "Buff";
    case "enfeeblement":
      return "Debuff";
    case "control":
    default:
      return "Control";
  }
};

export const pickTarget = (s: SchoolId): TargetRange => {
  switch (s) {
    case "destruction":
      return "ENEMY";
    case "healing":
      return "SINGLE";
    case "enhancement":
      return "SELF";
    case "enfeeblement":
      return "ENEMY";
    case "control":
    default:
      return "ENEMIES";
  }
};

const TIER_MP: Record<Tier, number> = { MINOR: 5, LESSER: 8, BASELINE: 12, GREATER: 18, MAJOR: 25, MYTHIC: 36 };
const TIER_DMG: Record<Tier, number> = { MINOR: 10, LESSER: 18, BASELINE: 28, GREATER: 42, MAJOR: 60, MYTHIC: 85 };
const TIER_HEAL: Record<Tier, number> = { MINOR: 12, LESSER: 20, BASELINE: 32, GREATER: 48, MAJOR: 70, MYTHIC: 100 };

export const calcMpCost = (tier: Tier, school: SchoolId, isChant?: boolean): number => {
  const base = TIER_MP[tier];
  const mod =
    school === "destruction"
      ? 1
      : school === "control"
        ? 1.1
        : school === "enfeeblement"
          ? 1
          : school === "enhancement"
            ? 0.9
            : 1;
  const upfront = Math.round(base * mod);
  return isChant ? Math.max(1, Math.floor(upfront * 0.5)) : upfront;
};

const upkeepFromUpfront = (cost: number) => Math.max(1, Math.round(cost * 0.7));

export const calcPower = (tier: Tier, school: SchoolId): number => {
  switch (school) {
    case "destruction":
      return TIER_DMG[tier];
    case "healing":
      return TIER_HEAL[tier];
    case "enhancement":
      return 0;
    case "enfeeblement":
      return Math.round(TIER_DMG[tier] * 0.3);
    case "control":
    default:
      return Math.round(TIER_DMG[tier] * 0.2);
  }
};

const pick = <T>(arr: T[], rng: () => number): T => {
  if (!arr.length) {
    throw new Error("Cannot pick from empty array");
  }
  const raw = rng() * arr.length;
  const idx = Math.floor(Number.isNaN(raw) ? 0 : raw);
  return arr[idx >= 0 && idx < arr.length ? idx : 0];
};

const EFFECT_PALETTES: Record<SchoolId, {
  boons?: BoonName[];
  debuffs?: StatusName[];
  statUps?: { lane: StatLane; stat: StatKind }[];
  statDowns?: { lane: StatLane; stat: StatKind }[];
  overtime?: OverTimeKind[];
}> = {
  destruction: {
    debuffs: ["Burn", "Bleed", "Shock", "Weaken"],
    statDowns: [
      { lane: "general", stat: "dmgTaken" },
      { lane: "melee", stat: "def" },
      { lane: "magic", stat: "def" },
    ],
    overtime: ["DoT"],
  },
  control: {
    debuffs: ["Root", "Slow", "Stun", "Blind", "Silence", "Expose", "Confuse"],
    statDowns: [
      { lane: "general", stat: "spd" },
      { lane: "ranged", stat: "acc" },
    ],
  },
  enfeeblement: {
    debuffs: ["Blind", "Paralyze", "Poison", "Slow", "Weaken", "Expose", "Silence"],
    statDowns: [
      { lane: "melee", stat: "atk" },
      { lane: "magic", stat: "atk" },
      { lane: "general", stat: "acc" },
    ],
    overtime: ["DoT"],
  },
  enhancement: {
    boons: ["Haste", "Blessing", "Aegis", "Ward", "Veil", "Fortify", "Frenzy", "Regen", "Refresh"],
    statUps: [
      { lane: "melee", stat: "atk" },
      { lane: "ranged", stat: "acc" },
      { lane: "magic", stat: "atk" },
      { lane: "general", stat: "eva" },
      { lane: "general", stat: "crit" },
      { lane: "general", stat: "spd" },
      { lane: "general", stat: "dmgDealt" },
    ],
    overtime: ["HoT", "RestoreMP", "DoT"],
  },
  healing: {
    boons: ["Blessing", "Aegis", "Ward", "Veil", "Regen", "Refresh"],
    statUps: [{ lane: "general", stat: "dmgTaken" }],
    overtime: ["HoT", "RestoreMP"],
  },
};

const ELEM_RES_DEFAULTS: Partial<Record<SchoolId, { up: number; down: number }>> = {
  enhancement: { up: 15, down: 0 },
  healing: { up: 12, down: 0 },
  control: { up: 8, down: -8 },
  enfeeblement: { up: 0, down: -12 },
  destruction: { up: 0, down: -15 },
};

const composeEffects = (element: ElementId, school: SchoolId, tier: Tier, rng: () => number): EffectAtom[] => {
  const out: EffectAtom[] = [];
  const pal = EFFECT_PALETTES[school];
  const tierScale = { MINOR: 1, LESSER: 2, BASELINE: 3, GREATER: 4, MAJOR: 5, MYTHIC: 6 }[tier];

  if ((school === "enfeeblement" || school === "control" || school === "destruction") && pal.debuffs?.length) {
    const statusName = pick(pal.debuffs, rng);
    out.push({
      kind: "status",
      statusName,
      chance: Math.min(0.9, 0.1 + 0.05 * tierScale),
      potency: Math.ceil(tierScale / 2),
      duration: 6 + 2 * tierScale,
    });
  } else if ((school === "enhancement" || school === "healing") && pal.boons?.length) {
    const boonName = pick(pal.boons, rng);
    out.push({ kind: "boon", boonName, duration: 8 + 2 * tierScale });
  }

  if (school === "enhancement" && pal.statUps?.length) {
    const statPick = pick(pal.statUps, rng);
    const sign = statPick.stat === "dmgTaken" ? -1 : 1;
    const magnitude = 5 + 3 * tierScale;
    out.push({
      kind: "stat",
      lane: statPick.lane,
      stat: statPick.stat,
      value: sign * magnitude,
      duration: 8 + 2 * tierScale,
    });
  }

  if ((school === "enfeeblement" || school === "control") && pal.statDowns?.length) {
    const statPick = pick(pal.statDowns, rng);
    out.push({
      kind: "stat",
      lane: statPick.lane,
      stat: statPick.stat,
      value: -(5 + 3 * tierScale),
      duration: 8 + 2 * tierScale,
    });
  }

  if (pal.overtime?.length) {
    const otKind = pick(pal.overtime, rng);
    out.push({
      kind: "overtime",
      otKind,
      otPerTick: 2 + tierScale,
      duration: 6 + 2 * tierScale,
    });
  }

  const resCfg = ELEM_RES_DEFAULTS[school];
  if (resCfg && tierScale >= 3) {
    const positive = school === "enhancement" || school === "healing" ? true : rng() < 0.5;
    const delta = positive ? resCfg.up ?? 0 : resCfg.down ?? 0;
    if (delta !== 0) {
      out.push({ kind: "elemres", elemres: { element, delta } });
    }
  }

  return out;
};

const DEFAULT_BASE_FORMS: Record<SchoolId, FamilyId[]> = {
  destruction: ["projectile_sphere", "piercing", "blade", "beam", "burst"],
  control: ["liquid_flow", "burst", "beam", "piercing"],
  enfeeblement: ["beam", "burst", "liquid_flow"],
  enhancement: ["blade", "projectile_sphere", "beam"],
  healing: ["liquid_flow", "beam"],
};

const tierIndex = (tier: Tier) => TIERS.indexOf(tier);

const BASE_NAME_POOL = new PoolState(new SeededRNG(0xdecafbad));
const CHANT_POOL = new PoolState(new SeededRNG(0xabcddcba));
const CHANT_RNG = new SeededRNG(0x5eed5eed);
const EFFECT_RNG = new SeededRNG(0x2468ace0);
const SCALER = new SpellScaler(new PoolState(new SeededRNG(0xfeedf00d)));

const baseNameFrom = (element: ElementId, school: SchoolId, tier: Tier, pools: PoolState): string => {
  const families = DEFAULT_BASE_FORMS[school];
  if (!families || families.length === 0) {
    throw new Error(`No base forms defined for school ${school}`);
  }
  const family = pools.pickOne(families);
  if (!family) {
    throw new Error(`Failed to pick family for school ${school}`);
  }
  const adj = pools.takeElement(element, tier);
  const form = pools.takeFamily(family, tier);
  return `${adj} ${form}`;
};

const lineageFor = (special: SpecialLine): ExtraLineage | undefined => {
  if (!special) return undefined;
  return {
    isChant: special === "song" || special === "dance",
    isDance: special === "dance",
    isSummon: special === "summon",
    isNinjutsu: special === "ninjutsu",
  };
};

const makeChantName = (element: ElementId, tier: Tier, special?: SpecialLine): string => {
  const isDance = special === "dance";
  const pool = isDance ? DANCE_TERMS : SONG_TERMS;
  const key = isDance ? "dance" : "song";
  const term = CHANT_POOL.takeCustom(key, pool, tier);
  const elementAdj = BASE_NAME_POOL.takeElement(element, tier);
  const prefix = CHANT_POOL.takePrefix(tier);
  const base = CHANT_RNG.next() < 0.5 ? `${term} of ${elementAdj}` : `${elementAdj} ${term}`;
  const name = `${prefix ? `${prefix} ` : ""}${base}`.replace(/\s{2,}/g, " ").trim();
  return name;
};

const SCHOOL_VERBS: Record<SchoolId, string> = {
  destruction: "strikes",
  control: "binds",
  enfeeblement: "saps",
  enhancement: "bolsters",
  healing: "restores",
};

const ELEMENT_FLAVOR: Record<ElementId, string> = {
  fire: "searing heat and ravenous flame",
  ice: "biting cold and crystalline frost",
  lightning: "split-second thunder and crackling charge",
  water: "surging tides and fluid force",
  wind: "swift currents and slicing air",
  stone: "unyielding earth and grinding pressure",
  light: "radiant purity and sacred brilliance",
  dark: "devouring shadow and creeping entropy",
};

const shortDesc = (
  name: string,
  element: ElementId,
  school: SchoolId,
  target: TargetRange,
  tier: Tier,
  isChant?: boolean,
): string => {
  const action = isChant ? "suffuses" : SCHOOL_VERBS[school];
  const flavor = ELEMENT_FLAVOR[element];
  const scope =
    target === "SINGLE"
      ? "a single ally"
      : target === "ENEMY"
        ? "a single foe"
        : target === "PARTY"
          ? "the party"
          : target === "ENEMIES"
            ? "all enemies in range"
            : "the caster";
  const tierNote =
    tier === "MINOR"
      ? "faintly"
      : tier === "LESSER"
        ? "lightly"
        : tier === "BASELINE"
          ? ""
          : tier === "GREATER"
            ? "powerfully"
            : tier === "MAJOR"
              ? "overwhelmingly"
              : "with mythic force";
  return `${name} ${action} ${scope} with ${flavor}, ${tierNote}`.replace(/\s+,/g, ",");
};

let SERIAL = 1;

export interface CandidateSpec {
  element: ElementId;
  school: SchoolId;
  baseTier: Tier;
  special?: SpecialLine;
  proficiency?: number;
}

export interface PlannedSpec extends CandidateSpec {
  proficiency: number;
}

const DEFAULT_SCHOOL_PROFICIENCY = 1;
const DEFAULT_SCHOOL_TIER: Tier = "MINOR";

const createDefaultPlan = (element: ElementId): PlannedSpec[] =>
  ALL_SCHOOLS.map(school => ({
    element,
    school,
    baseTier: DEFAULT_SCHOOL_TIER,
    proficiency: DEFAULT_SCHOOL_PROFICIENCY,
  }));

export const makeSpell = (args: {
  element: ElementId;
  school: SchoolId;
  tier: Tier;
  proficiency: number;
  special?: SpecialLine;
  targetOverride?: TargetRange;
  scalerOpts?: Parameters<SpellScaler["scale"]>[2];
}): SpellEntry => {
  const isChant = args.special === "song" || args.special === "dance";
  const name = isChant
    ? makeChantName(args.element, args.tier, args.special)
    : (() => {
        const base = baseNameFrom(args.element, args.school, args.tier, BASE_NAME_POOL);
        return SCALER.scale(base, args.tier, {
          usePrefix: true,
          useSuffix: false,
          allowElementAdj: true,
          ...(args.scalerOpts || {}),
        });
      })();

  const family = familyFromSchool(args.school);
  const type = isChant ? "Chant" : typeFromSchool(args.school);
  const target = args.targetOverride ?? (isChant ? "PARTY" : pickTarget(args.school));

  const mpCost = calcMpCost(args.tier, args.school, isChant);
  const upkeep = isChant ? upkeepFromUpfront(mpCost) : undefined;
  const basePower = calcPower(args.tier, args.school);
  const effects = composeEffects(args.element, args.school, args.tier, () => EFFECT_RNG.next());
  const statusAtom = effects.find(effect => effect.kind === "status");
  const status = statusAtom
    ? {
        name: statusAtom.statusName!,
        chance: statusAtom.chance ?? 0.2,
        potency: statusAtom.potency,
        duration: statusAtom.duration,
      }
    : undefined;

  const entry: SpellEntry = {
    id: `${args.element}:${args.school}:${args.tier}:${SERIAL++}`,
    name,
    element: capitalize(args.element) as ElementName,
    school: capitalize(args.school) as SchoolName,
    family,
    type,
    target,
    proficiency: args.proficiency,
    tier: args.tier,
    mpCost,
    upkeep,
    basePower,
    status,
    effects: effects.length ? effects : undefined,
    description: shortDesc(name, args.element, args.school, target, args.tier, isChant),
    lineage: lineageFor(args.special || null),
  };
  return entry;
};

export interface BuildPlanOpts {
  startProf?: number;
  endProf?: number;
  minGap?: number;
  seed?: number;
  tierCurve?: (p: number) => Tier;
}

const DEFAULT_TIER_CURVE = (p: number): Tier => {
  if (p < 0.08) return "MINOR";
  if (p < 0.25) return "LESSER";
  if (p < 0.55) return "BASELINE";
  if (p < 0.78) return "GREATER";
  if (p < 0.92) return "MAJOR";
  return "MYTHIC";
};

function normalizeWeights<T extends string>(weights: Partial<Record<T, number>>): [T, number][] {
  const entries = Object.entries(weights).filter(([, value]) => (value ?? 0) > 0) as [T, number][];
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  return total > 0 ? entries.map(([k, value]) => [k, value / total]) : [];
}

function allocateSchoolCounts(
  count: number,
  weights: [SchoolId, number][],
  rng: RNG,
): { school: SchoolId; count: number }[] {
  const totalWeight = weights.reduce((sum, [, weight]) => sum + weight, 0);
  const quotas = weights.map(([school, weight]) => ({
    school,
    quota: totalWeight > 0 ? (weight / totalWeight) * count : count / Math.max(1, weights.length),
  }));
  const counts = quotas.map(q => Math.floor(q.quota));
  let assigned = counts.reduce((sum, value) => sum + value, 0);

  if (count >= weights.length) {
    for (let i = 0; i < counts.length; i++) {
      if (counts[i] === 0) {
        counts[i] = 1;
        assigned++;
      }
    }
  }

  const fractions = quotas.map((q, idx) => ({ idx, frac: q.quota - Math.floor(q.quota) }));

  if (assigned < count) {
    let remaining = count - assigned;
    const order = fractions
      .slice()
      .sort((a, b) => b.frac - a.frac || weights[b.idx][1] - weights[a.idx][1] || (rng.next() - 0.5));
    let cursor = 0;
    while (remaining > 0) {
      const target = order[cursor % order.length]?.idx ?? 0;
      counts[target]++;
      remaining--;
      cursor++;
    }
  } else if (assigned > count) {
    let extra = assigned - count;
    const order = fractions
      .slice()
      .sort((a, b) => a.frac - b.frac || weights[a.idx][1] - weights[b.idx][1] || (rng.next() - 0.5));
    let cursor = 0;
    while (extra > 0) {
      const target = order[cursor % order.length]?.idx ?? 0;
      if (counts[target] > 1) {
        counts[target]--;
        extra--;
      }
      cursor++;
      if (cursor > order.length * 3) break;
    }
  }

  let totalAssigned = counts.reduce((sum, value) => sum + value, 0);
  const fallbackIdx = counts.findIndex(v => v > 0) >= 0 ? counts.findIndex(v => v > 0) : 0;
  while (totalAssigned < count) {
    const idx = fallbackIdx >= 0 ? fallbackIdx : 0;
    counts[idx]++;
    totalAssigned++;
  }
  while (totalAssigned > count) {
    const idx = counts.findIndex(v => v > 1);
    if (idx === -1) break;
    counts[idx]--;
    totalAssigned--;
  }

  return counts.map((value, idx) => ({ school: weights[idx][0], count: value }));
}

function sequenceTiers(count: number, rng: RNG, curve: (p: number) => Tier): Tier[] {
  const tiers: Tier[] = [];
  for (let i = 0; i < count; i++) {
    const base = count === 1 ? 0.5 : i / Math.max(1, count - 1);
    const jitter = (rng.next() - 0.5) * 0.08;
    const clamped = Math.min(1, Math.max(0, base + jitter));
    tiers.push(curve(clamped));
  }
  return tiers;
}

function buildAssignmentOrder(
  counts: { school: SchoolId; count: number }[],
  rng: RNG,
): SchoolId[] {
  const pool = counts.map(entry => ({ ...entry }));
  const total = pool.reduce((sum, entry) => sum + entry.count, 0);
  const order: SchoolId[] = [];
  while (order.length < total) {
    const last = order[order.length - 1];
    let pickIdx = -1;
    let bestRemaining = -1;
    for (let i = 0; i < pool.length; i++) {
      const entry = pool[i];
      if (entry.count <= 0) continue;
      if (entry.school === last) continue;
      if (entry.count > bestRemaining || (entry.count === bestRemaining && rng.next() < 0.5)) {
        pickIdx = i;
        bestRemaining = entry.count;
      }
    }
    if (pickIdx === -1) {
      pickIdx = pool.findIndex(entry => entry.count > 0);
      if (pickIdx === -1) break;
    }
    order.push(pool[pickIdx].school);
    pool[pickIdx].count--;
  }
  while (order.length < total) {
    const fallback = pool.findIndex(entry => entry.count > 0);
    if (fallback === -1) break;
    order.push(pool[fallback].school);
    pool[fallback].count--;
  }
  return order;
}

export const buildWeightedPlanForElement = (
  element: ElementId,
  count: number,
  opts: BuildPlanOpts = {},
): CandidateSpec[] => {
  const {
    startProf = 0,
    endProf = 100,
    minGap,
    seed = 0x424242,
    tierCurve = DEFAULT_TIER_CURVE,
  } = opts;

  const rng = new SeededRNG(seed);
  const normalized = normalizeWeights(ELEMENT_SCHOOL_WEIGHTS[element] ?? {});
  const weightEntries = (normalized.length
    ? normalized
    : normalizeWeights<SchoolId>({ destruction: 1, control: 1, enhancement: 1, enfeeblement: 1, healing: 1 })) as [
    SchoolId,
    number
  ][];

  const counts = allocateSchoolCounts(count, weightEntries, rng);
  const assignments = buildAssignmentOrder(counts, rng);
  const tiers = sequenceTiers(assignments.length, rng, tierCurve);

  const span = endProf - startProf;
  const step = assignments.length > 1 ? span / (assignments.length - 1) : span;
  const gap = minGap ?? step;
  const profs = assignments.map((_, idx) => {
    const base = startProf + idx * step;
    const jitter = (rng.next() - 0.5) * (gap * 0.3);
    return Math.round(Math.max(startProf, Math.min(endProf, base + jitter)));
  });

  return assignments.map((school, idx) => ({
    element,
    school,
    baseTier: tiers[idx],
    proficiency: profs[idx],
  }));
};

const generatePlanForElement = (element: ElementId, total: number, rng: RNG): PlannedSpec[] => {
  if (total <= 0) return [];
  const seed = Math.floor(rng.next() * 0xffffffff);
  const plan = buildWeightedPlanForElement(element, total, {
    startProf: 10,
    endProf: 200,
    minGap: 6,
    seed,
  });
  return plan.map(spec => ({
    element,
    school: spec.school,
    baseTier: spec.baseTier,
    proficiency: spec.proficiency ?? 5,
  }));
};

const SPECIAL_RULES: Partial<Record<ElementId, { limit: number; match: (spec: CandidateSpec) => boolean; special: SpecialLine }[]>> = {
  wind: [
    {
      limit: 2,
      special: "dance",
      match: spec => spec.school === "enhancement" && tierIndex(spec.baseTier) >= tierIndex("GREATER"),
    },
  ],
  water: [
    {
      limit: 2,
      special: "song",
      match: spec => spec.school === "healing" && tierIndex(spec.baseTier) >= tierIndex("BASELINE"),
    },
  ],
  light: [
    {
      limit: 3,
      special: "song",
      match: spec => spec.school === "enhancement" && tierIndex(spec.baseTier) >= tierIndex("LESSER"),
    },
  ],
  dark: [
    {
      limit: 3,
      special: "ninjutsu",
      match: spec =>
        (spec.school === "enfeeblement" || spec.school === "destruction") && tierIndex(spec.baseTier) >= tierIndex("BASELINE"),
    },
  ],
  stone: [
    {
      limit: 1,
      special: "summon",
      match: spec => spec.school === "control" && tierIndex(spec.baseTier) >= tierIndex("MAJOR"),
    },
  ],
  fire: [
    {
      limit: 1,
      special: "ninjutsu",
      match: spec => spec.school === "destruction" && tierIndex(spec.baseTier) >= tierIndex("MAJOR"),
    },
  ],
  lightning: [
    {
      limit: 2,
      special: "ninjutsu",
      match: spec => spec.school === "control" && tierIndex(spec.baseTier) >= tierIndex("GREATER"),
    },
  ],
};

const applySpecials = (element: ElementId, plan: PlannedSpec[]): PlannedSpec[] => {
  const rules = SPECIAL_RULES[element] ?? [];
  const counters = new Map<typeof rules[number], number>();
  return plan.map(spec => {
    let special: SpecialLine | undefined;
    for (const rule of rules) {
      const used = counters.get(rule) ?? 0;
      if (rule.limit !== undefined && used >= rule.limit) continue;
      if (rule.match(spec)) {
        special = rule.special;
        counters.set(rule, used + 1);
        break;
      }
    }
    return special ? { ...spec, special } : spec;
  });
};

const STATUS_ON_CRIT: Record<ElementId, StatusSpec> = {
  stone: { name: "Stagger", chance: 1, duration: 2 },
  water: { name: "Soak", chance: 1, duration: 3 },
  wind: { name: "Wound", chance: 1, duration: 3 },
  fire: { name: "Ignite", chance: 1, duration: 4 },
  ice: { name: "Brittle", chance: 1, duration: 4 },
  lightning: { name: "Paralyze", chance: 1, duration: 2 },
  dark: { name: "Curse", chance: 1, duration: 5 },
  light: { name: "Dazzle", chance: 1, duration: 3 },
};

const postProcessSpell = (spell: SpellEntry): SpellEntry => {
  const tierRank = tierIndex(spell.tier);
  if (spell.school === "Destruction" && tierRank >= tierIndex("MAJOR")) {
    spell.target = "ENEMIES";
  }
  if (spell.school === "Healing" && tierRank >= tierIndex("MAJOR")) {
    spell.target = "PARTY";
  }
  if (spell.school === "Enhancement" && tierRank >= tierIndex("MAJOR")) {
    spell.target = "PARTY";
  }
  if (spell.basePower > 0) {
    spell.statusOnCrit = STATUS_ON_CRIT[spell.element.toLowerCase() as ElementId];
  }
  return spell;
};

const buildElementSpellbook = (element: ElementId, total = 20, rngSeed = 0x13572468): SpellEntry[] => {
  const rng = new SeededRNG(rngSeed ^ element.charCodeAt(0));
  const defaults = createDefaultPlan(element);
  const remaining = Math.max(0, total - defaults.length);
  const plan = generatePlanForElement(element, remaining, rng);
  const withSpecials = applySpecials(element, plan);
  const defaultSpells = defaults.map(spec =>
    postProcessSpell(
      makeSpell({
        element: spec.element,
        school: spec.school,
        tier: spec.baseTier,
        proficiency: spec.proficiency,
      }),
    ),
  );
  const generatedSpells = withSpecials.map(spec =>
    postProcessSpell(
      makeSpell({
        element: spec.element,
        school: spec.school,
        tier: spec.baseTier,
        proficiency: spec.proficiency,
        special: spec.special,
      }),
    ),
  );
  return [...defaultSpells, ...generatedSpells];
};

const ELEMENT_TOTALS: Record<ElementId, number> = {
  fire: 20,
  ice: 20,
  lightning: 20,
  water: 20,
  wind: 20,
  stone: 20,
  light: 20,
  dark: 20,
};

export const generateSpellbook = (): SpellEntry[] => {
  const all: SpellEntry[] = [];
  for (const element of Object.keys(ELEMENT_TOTALS) as ElementId[]) {
    all.push(...buildElementSpellbook(element, ELEMENT_TOTALS[element]));
  }
  return all;
};

export const SPELLBOOK: SpellEntry[] = generateSpellbook();

export const MILESTONES: number[] = Array.from(new Set(SPELLBOOK.map(spell => Math.max(1, Math.round(spell.proficiency)))))
  .sort((a, b) => a - b);

export const CRIT_STATUS_BY_ELEMENT = STATUS_ON_CRIT;

/* =========================================================
   ELEMENT RELATIONS (MERGED)
   ========================================================= */

export interface ElementRelation {
  strong: ElementName[];
  weak: ElementName[];
}

export const ELEMENT_RELATIONS: Record<ElementName, ElementRelation> = {
  Light: { strong: ["Dark"], weak: ["Dark"] },
  Dark: { strong: ["Light"], weak: ["Light"] },
  Stone: { strong: ["Wind"], weak: ["Ice"] },
  Wind: { strong: ["Lightning"], weak: ["Stone"] },
  Lightning: { strong: ["Water"], weak: ["Wind"] },
  Water: { strong: ["Fire"], weak: ["Lightning"] },
  Fire: { strong: ["Ice"], weak: ["Water"] },
  Ice: { strong: ["Stone"], weak: ["Fire"] },
};

export type ElementRelationOutcome = "strong" | "weak" | "neutral";

export const getElementRelation = (
  attacker: ElementName,
  defender: ElementName,
): ElementRelationOutcome => {
  const relation = ELEMENT_RELATIONS[attacker];
  if (relation.strong.includes(defender)) return "strong";
  if (relation.weak.includes(defender)) return "weak";
  return "neutral";
};

export const ELEMENTAL_MULT = {
  strong: { damage: 1.25, dot: 1.25, heal: 1.1, controlChance: 1.15, targetResist: 0.85 },
  weak: { damage: 0.75, dot: 0.75, heal: 0.9, controlChance: 0.85, targetResist: 1.15 },
  neutral: { damage: 1.0, dot: 1.0, heal: 1.0, controlChance: 1.0, targetResist: 1.0 },
} as const;

export const getElementalModifiers = (attacker: ElementName, defender: ElementName) => {
  const relation = getElementRelation(attacker, defender);
  return ELEMENTAL_MULT[relation];
};

export const applyElementalScalar = (
  base: number,
  attacker: ElementName,
  defender: ElementName,
  kind: keyof (typeof ELEMENTAL_MULT)["neutral"],
): number => {
  const modifiers = getElementalModifiers(attacker, defender);
  return base * modifiers[kind];
};

/* =========================================================
   PERFORMANCE NAME MAPS (MERGED)
   ========================================================= */

export const BASE_ELEMENTS: ElementName[] = [
  "Stone",
  "Water",
  "Wind",
  "Fire",
  "Ice",
  "Lightning",
  "Dark",
  "Light",
];

export const SONG_LEVELS = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

const SINGING_TITLES = [
  "Whisper",
  "Ballad",
  "Chant",
  "Hymn",
  "Refrain",
  "Chorus",
  "Anthem",
  "Rhapsody",
  "Cantata",
  "Symphony",
  "Apotheosis",
] as const;

const DANCE_TITLES = [
  "Step",
  "Reel",
  "Waltz",
  "Gavotte",
  "Jig",
  "Saraband",
  "Tarantella",
  "Polka",
  "Mazurka",
  "Ballet",
  "Ascendance",
] as const;

const INSTRUMENT_TITLES = [
  "Note",
  "Tune",
  "Melody",
  "Harmony",
  "Serenade",
  "Cadence",
  "March",
  "Sonata",
  "Ode",
  "Rondo",
  "Finale",
] as const;

const buildPerformanceNames = (titles: readonly string[]) => {
  const result: Record<ElementName, { level: number; name: string }[]> = Object.create(null);
  BASE_ELEMENTS.forEach(element => {
    result[element] = SONG_LEVELS.map((level, idx) => ({ level, name: `${element} ${titles[idx]}` }));
  });
  return result;
};

export const SINGING_SPELLS = buildPerformanceNames(SINGING_TITLES);
export const DANCING_SPELLS = buildPerformanceNames(DANCE_TITLES);
export const INSTRUMENT_SPELLS = buildPerformanceNames(INSTRUMENT_TITLES);

