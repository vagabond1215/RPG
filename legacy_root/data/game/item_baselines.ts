/*
 * Structured baseline definitions for weapons, armor, and apparel.
 * These tables establish the canonical models, material options, quality tiers,
 * and enchantment scaffolding used by the economy and content generators.
 * Any new equipment line should anchor to one of these baselines before layering
 * on bespoke lore or quest rewards. The helpers at the bottom expose consistent
 * price calculations so that variant records stay proportional when additional
 * materials or magical effects are introduced.
 */

export type ItemCategory = "weapon" | "armor" | "apparel";

export type WeaponFamily =
  | "sword"
  | "axe"
  | "dagger"
  | "mace"
  | "hammer"
  | "spear"
  | "polearm"
  | "staff"
  | "flail"
  | "club"
  | "bow"
  | "crossbow"
  | "thrower";

export type WeaponSize = "Tiny" | "Small" | "Medium" | "Large" | "Very Large";
export type WeaponReach =
  | "Very Short"
  | "Short"
  | "Short/Medium"
  | "Medium"
  | "Medium/Long"
  | "Long"
  | "Very Long";
export type WeaponHands = 1 | 2;

export type ArmorWeight = "Light" | "Medium" | "Heavy";

export type WeaponQuality = "Standard" | "Fine" | "Masterwork";
export type ArmorQuality = "Standard" | "Fine" | "Masterwork";
export type ApparelQuality = "Standard" | "Fine" | "Masterwork";

export type EnchantmentGrade = "Minor" | "Lesser" | "Moderate" | "Greater" | "Major";

interface QualityProfile {
  key: string;
  label: string;
  description: string;
  priceMultiplier: number;
  materialRatio: number;
  laborRatio: number;
  overheadRatio: number;
  taxPct: number;
  primaryConsumer: "Commoner" | "Military" | "Artisan" | "Noble" | "Courtly";
  valueDense: boolean;
  reliabilityModifier?: number;
  craftsmanshipNotes?: string;
}

interface MaterialProfile {
  key: string;
  label: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Legendary";
  priceMultiplier: number;
  weightModifier: number;
  durabilityModifier: number;
  notes: string;
}

interface WeaponBaseline {
  key: string;
  label: string;
  family: WeaponFamily;
  basePriceCp: number;
  defaultMaterialKey: string;
  defaultQuality: WeaponQuality;
  hands: WeaponHands;
  size: WeaponSize;
  reach: WeaponReach;
  attackSpeed: number;
  damage: number;
  armorPen: "Low" | "Low-Medium" | "Medium" | "Medium-High" | "High" | "Very High";
  focus: ("BLUNT" | "SLASH" | "PIERCE")[];
  summary: string;
  materialKeys: string[];
  qualityKeys: WeaponQuality[];
  enchantmentKeys: string[];
}

interface ArmorBaseline {
  key: string;
  label: string;
  kind: "cloth" | "leather" | "hide" | "mail" | "scale" | "plate" | "shield";
  basePriceCp: number;
  defaultMaterialKey: string;
  defaultQuality: ArmorQuality;
  weight: ArmorWeight;
  coverage: ("head" | "torso" | "legs" | "arms" | "full" | "shield")[];
  defenseScore: number;
  resistances: { BLUNT?: number; SLASH?: number; PIERCE?: number };
  summary: string;
  materialKeys: string[];
  qualityKeys: ArmorQuality[];
  enchantmentKeys: string[];
}

interface ApparelBaseline {
  key: string;
  label: string;
  piece:
    | "cloak"
    | "tunic"
    | "robe"
    | "dress"
    | "leggings"
    | "boots"
    | "gloves"
    | "hat"
    | "belt"
    | "accessory";
  basePriceCp: number;
  defaultMaterialKey: string;
  defaultQuality: ApparelQuality;
  summary: string;
  materialKeys: string[];
  qualityKeys: ApparelQuality[];
  enchantmentKeys: string[];
}

interface EnchantmentGradeProfile {
  grade: EnchantmentGrade;
  priceMultiplier: number;
  magnitudeScale: number;
  durationScale: number;
}

interface EnchantmentGradeDetail {
  priceMultiplier: number;
  chancePct?: number;
  magnitudePct?: number;
  flatBonus?: number;
  durationSec?: number;
  effectSlug: string;
}

interface EnchantmentTemplate {
  key: string;
  label: string;
  appliesTo: ItemCategory[];
  category: "Offense" | "Defense" | "Status" | "Utility" | "Support";
  description: string;
  gradeDetails: Record<EnchantmentGrade, EnchantmentGradeDetail>;
}

export const ENCHANTMENT_GRADES_ORDER: EnchantmentGrade[] = [
  "Minor",
  "Lesser",
  "Moderate",
  "Greater",
  "Major",
];

export const ENCHANTMENT_GRADE_CONFIG: Record<EnchantmentGrade, EnchantmentGradeProfile> = {
  Minor: { grade: "Minor", priceMultiplier: 1.15, magnitudeScale: 1, durationScale: 1 },
  Lesser: { grade: "Lesser", priceMultiplier: 1.3, magnitudeScale: 1.25, durationScale: 1.1 },
  Moderate: { grade: "Moderate", priceMultiplier: 1.55, magnitudeScale: 1.5, durationScale: 1.25 },
  Greater: { grade: "Greater", priceMultiplier: 1.95, magnitudeScale: 1.85, durationScale: 1.5 },
  Major: { grade: "Major", priceMultiplier: 2.4, magnitudeScale: 2.25, durationScale: 1.75 },
};

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function slugSegment(part: string | number): string {
  return `${part}`
    .trim()
    .toLowerCase()
    .replace(/%/g, "pct")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugTemplate(parts: Array<string | number | undefined>): string {
  return parts
    .map((part) => {
      if (part === undefined || part === null) return "";
      const segment = slugSegment(part);
      return segment;
    })
    .filter((segment): segment is string => Boolean(segment))
    .join("-");
}

function buildEnchantmentTemplate(options: {
  key: string;
  label: string;
  appliesTo: ItemCategory[];
  category: "Offense" | "Defense" | "Status" | "Utility" | "Support";
  description: string;
  baseStats: {
    chancePct?: number;
    magnitudePct?: number;
    flatBonus?: number;
    durationSec?: number;
  };
  priceWeight?: number;
  effectSlug: (ctx: {
    grade: EnchantmentGrade;
    chancePct?: number;
    magnitudePct?: number;
    flatBonus?: number;
    durationSec?: number;
  }) => string;
  customGradeAdjust?: Partial<
    Record<
      EnchantmentGrade,
      {
        magnitudeScale?: number;
        durationScale?: number;
        priceMultiplier?: number;
      }
    >
  >;
}): EnchantmentTemplate {
  const { baseStats, priceWeight = 1 } = options;
  const gradeDetails = {} as Record<EnchantmentGrade, EnchantmentGradeDetail>;
  for (const grade of ENCHANTMENT_GRADES_ORDER) {
    const base = ENCHANTMENT_GRADE_CONFIG[grade];
    const custom = options.customGradeAdjust?.[grade];
    const magnitudeScale = custom?.magnitudeScale ?? base.magnitudeScale;
    const durationScale = custom?.durationScale ?? base.durationScale;
    const priceMultiplier = round((custom?.priceMultiplier ?? base.priceMultiplier) * priceWeight, 3);
    const chancePct = baseStats.chancePct
      ? Math.min(100, round(baseStats.chancePct * magnitudeScale, 1))
      : undefined;
    const magnitudePct = baseStats.magnitudePct
      ? round(baseStats.magnitudePct * magnitudeScale, 1)
      : undefined;
    const flatBonus = baseStats.flatBonus ? round(baseStats.flatBonus * magnitudeScale, 2) : undefined;
    const durationSec = baseStats.durationSec
      ? Math.max(1, Math.round(baseStats.durationSec * durationScale))
      : undefined;
    gradeDetails[grade] = {
      priceMultiplier,
      chancePct,
      magnitudePct,
      flatBonus,
      durationSec,
      effectSlug: options.effectSlug({ grade, chancePct, magnitudePct, flatBonus, durationSec }),
    };
  }
  return {
    key: options.key,
    label: options.label,
    appliesTo: options.appliesTo,
    category: options.category,
    description: options.description,
    gradeDetails,
  };
}

export const WEAPON_QUALITIES: Record<WeaponQuality, QualityProfile> = {
  Standard: {
    key: "Standard",
    label: "Standard",
    description: "Serviceable workshop work with utilitarian finish.",
    priceMultiplier: 1,
    materialRatio: 0.35,
    laborRatio: 0.3,
    overheadRatio: 0.08,
    taxPct: 0.06,
    primaryConsumer: "Military",
    valueDense: false,
    reliabilityModifier: 1,
    craftsmanshipNotes: "Edges kept sharp and true through routine guild methods.",
  },
  Fine: {
    key: "Fine",
    label: "Fine",
    description: "Select materials, decorative fittings, and tuned balance.",
    priceMultiplier: 1.45,
    materialRatio: 0.4,
    laborRatio: 0.32,
    overheadRatio: 0.09,
    taxPct: 0.12,
    primaryConsumer: "Artisan",
    valueDense: false,
    reliabilityModifier: 1.1,
    craftsmanshipNotes: "Edges polished, guards chiseled, and balance matched to the wielder.",
  },
  Masterwork: {
    key: "Masterwork",
    label: "Masterwork",
    description: "Guild-master craftsmanship with heirloom appointments.",
    priceMultiplier: 2.35,
    materialRatio: 0.44,
    laborRatio: 0.34,
    overheadRatio: 0.11,
    taxPct: 0.35,
    primaryConsumer: "Noble",
    valueDense: true,
    reliabilityModifier: 1.25,
    craftsmanshipNotes: "Patterned steel, inlaid fittings, and meticulous harmonizing of edge and temper.",
  },
};

export const ARMOR_QUALITIES: Record<ArmorQuality, QualityProfile> = {
  Standard: {
    key: "Standard",
    label: "Standard",
    description: "Guild-regulation fittings suited to levy service.",
    priceMultiplier: 1,
    materialRatio: 0.38,
    laborRatio: 0.28,
    overheadRatio: 0.08,
    taxPct: 0.05,
    primaryConsumer: "Military",
    valueDense: false,
    reliabilityModifier: 1,
    craftsmanshipNotes: "Mail links closed properly and leather cured to campaign tolerances.",
  },
  Fine: {
    key: "Fine",
    label: "Fine",
    description: "Reinforced plates, decorative edging, and tailored padding.",
    priceMultiplier: 1.5,
    materialRatio: 0.42,
    laborRatio: 0.33,
    overheadRatio: 0.1,
    taxPct: 0.14,
    primaryConsumer: "Artisan",
    valueDense: false,
    reliabilityModifier: 1.12,
    craftsmanshipNotes: "Additional rivets, quilting, and buckle work tuned to the wearer.",
  },
  Masterwork: {
    key: "Masterwork",
    label: "Masterwork",
    description: "Tournament-grade harness built by sovereign armourers.",
    priceMultiplier: 2.45,
    materialRatio: 0.48,
    laborRatio: 0.36,
    overheadRatio: 0.12,
    taxPct: 0.32,
    primaryConsumer: "Noble",
    valueDense: true,
    reliabilityModifier: 1.3,
    craftsmanshipNotes: "Mirror-bright plates, articulated joints, and alchemically tempered leathers.",
  },
};

export const APPAREL_QUALITIES: Record<ApparelQuality, QualityProfile> = {
  Standard: {
    key: "Standard",
    label: "Standard",
    description: "Durable homespun or guild-issue tailoring suited to travel.",
    priceMultiplier: 1,
    materialRatio: 0.33,
    laborRatio: 0.27,
    overheadRatio: 0.07,
    taxPct: 0.04,
    primaryConsumer: "Commoner",
    valueDense: false,
    craftsmanshipNotes: "Well-stitched seams and weather-ready treatment.",
  },
  Fine: {
    key: "Fine",
    label: "Fine",
    description: "Tailored fabrics with dyed trims and tasteful embellishments.",
    priceMultiplier: 1.4,
    materialRatio: 0.38,
    laborRatio: 0.32,
    overheadRatio: 0.09,
    taxPct: 0.1,
    primaryConsumer: "Artisan",
    valueDense: false,
    reliabilityModifier: 1.08,
    craftsmanshipNotes: "Custom fitted patterns, lined collars, and discrete reinforcement.",
  },
  Masterwork: {
    key: "Masterwork",
    label: "Masterwork",
    description: "Courtly couture or ritual vestments woven with rare fibers.",
    priceMultiplier: 2.1,
    materialRatio: 0.45,
    laborRatio: 0.34,
    overheadRatio: 0.11,
    taxPct: 0.28,
    primaryConsumer: "Courtly",
    valueDense: true,
    reliabilityModifier: 1.18,
    craftsmanshipNotes: "Brocaded patterns, gemstone fasteners, and master embroideries.",
  },
};

export const WEAPON_MATERIALS: Record<string, MaterialProfile> = {
  bronze: {
    key: "bronze",
    label: "Bronze",
    rarity: "Common",
    priceMultiplier: 0.9,
    weightModifier: 1.05,
    durabilityModifier: 0.85,
    notes: "Copper-tin alloy favoured by militias; softer edge but easy to mend.",
  },
  iron: {
    key: "iron",
    label: "Wrought Iron",
    rarity: "Common",
    priceMultiplier: 0.95,
    weightModifier: 1.02,
    durabilityModifier: 0.9,
    notes: "Bloomery iron with plain temper; sturdy and affordable for rank-and-file.",
  },
  steel: {
    key: "steel",
    label: "Steel",
    rarity: "Common",
    priceMultiplier: 1,
    weightModifier: 1,
    durabilityModifier: 1,
    notes: "Standard folded-and-quenched steel balancing hardness and resilience.",
  },
  "high-carbon-steel": {
    key: "high-carbon-steel",
    label: "High-Carbon Steel",
    rarity: "Uncommon",
    priceMultiplier: 1.12,
    weightModifier: 0.98,
    durabilityModifier: 1.12,
    notes: "Tight-grained steel that holds razor edges and responds well to tempering.",
  },
  "damascus-steel": {
    key: "damascus-steel",
    label: "Pattern-Welded Steel",
    rarity: "Uncommon",
    priceMultiplier: 1.18,
    weightModifier: 0.97,
    durabilityModifier: 1.2,
    notes: "Layered billets forge-welded for springy cores and hard outer skins.",
  },
  mithril: {
    key: "mithril",
    label: "Mithril",
    rarity: "Rare",
    priceMultiplier: 1.45,
    weightModifier: 0.72,
    durabilityModifier: 1.28,
    notes: "Silvery fae metal as light as ash wood yet harder than tempered steel.",
  },
  adamantine: {
    key: "adamantine",
    label: "Adamantine",
    rarity: "Very Rare",
    priceMultiplier: 1.75,
    weightModifier: 1.04,
    durabilityModifier: 1.45,
    notes: "Smoky-black alloy resistant to shattering; often restricted to royal contracts.",
  },
  obsidian: {
    key: "obsidian",
    label: "Obsidian Glass",
    rarity: "Rare",
    priceMultiplier: 1.05,
    weightModifier: 0.9,
    durabilityModifier: 0.7,
    notes: "Volcanic glass knapped to mono-molecular edges; vicious but brittle.",
  },
  "dragonbone": {
    key: "dragonbone",
    label: "Dragonbone",
    rarity: "Very Rare",
    priceMultiplier: 1.6,
    weightModifier: 0.86,
    durabilityModifier: 1.25,
    notes: "Resonant skeletal shards channeling latent draconic heat; thrives with enchantment.",
  },
  "ash-wood": {
    key: "ash-wood",
    label: "Hardened Ash Wood",
    rarity: "Common",
    priceMultiplier: 0.78,
    weightModifier: 0.82,
    durabilityModifier: 0.76,
    notes: "Seasoned ash wands and hafts; quick in hand though prone to splintering if neglected.",
  },
  "ironwood": {
    key: "ironwood",
    label: "Ironwood",
    rarity: "Rare",
    priceMultiplier: 1.1,
    weightModifier: 1.08,
    durabilityModifier: 1.18,
    notes: "Heavy enchanted timber that rivals metal for resilience; valued for staves and clubs.",
  },
  "heartwood": {
    key: "heartwood",
    label: "Heartwood",
    rarity: "Uncommon",
    priceMultiplier: 0.9,
    weightModifier: 0.88,
    durabilityModifier: 0.9,
    notes: "Dense straight-grain wood cut from old-growth groves; balanced between strength and weight.",
  },
  "meteor-steel": {
    key: "meteor-steel",
    label: "Meteor Steel",
    rarity: "Legendary",
    priceMultiplier: 2.1,
    weightModifier: 0.95,
    durabilityModifier: 1.6,
    notes: "Star-forged iron seeded with celestial nickel that drinks enchantments greedily.",
  },
  "cold-iron": {
    key: "cold-iron",
    label: "Cold Iron",
    rarity: "Uncommon",
    priceMultiplier: 1.08,
    weightModifier: 1.03,
    durabilityModifier: 1.05,
    notes: "Quenched without fire to vex fey and spirits; edge stays cool to the touch.",
  },
};

export const ARMOR_MATERIALS: Record<string, MaterialProfile> = {
  linen: {
    key: "linen",
    label: "Quilted Linen",
    rarity: "Common",
    priceMultiplier: 0.75,
    weightModifier: 0.85,
    durabilityModifier: 0.7,
    notes: "Layered flax cloth stuffed with tow; light gambesons and arming jacks.",
  },
  wool: {
    key: "wool",
    label: "Wool Padding",
    rarity: "Common",
    priceMultiplier: 0.8,
    weightModifier: 0.92,
    durabilityModifier: 0.72,
    notes: "Dense wool batting treated with lanolin; insulates against weather and bruising.",
  },
  leather: {
    key: "leather",
    label: "Cured Leather",
    rarity: "Common",
    priceMultiplier: 0.95,
    weightModifier: 0.96,
    durabilityModifier: 0.9,
    notes: "Standard cowhide or goat hide; boiled and waxed for brigandines and jerkins.",
  },
  "studded-leather": {
    key: "studded-leather",
    label: "Studded Leather",
    rarity: "Uncommon",
    priceMultiplier: 1.15,
    weightModifier: 1,
    durabilityModifier: 1,
    notes: "Leather lamina reinforced with riveted plates; favoured by scouts.",
  },
  "boar-hide": {
    key: "boar-hide",
    label: "Boar Hide",
    rarity: "Uncommon",
    priceMultiplier: 1.1,
    weightModifier: 1.05,
    durabilityModifier: 1.08,
    notes: "Thick bristled hide resisting cuts; popular with border rangers.",
  },
  "elk-hide": {
    key: "elk-hide",
    label: "Elk Hide",
    rarity: "Uncommon",
    priceMultiplier: 1.18,
    weightModifier: 1,
    durabilityModifier: 1.12,
    notes: "Supple but dense hide trimmed from northern elk; balances comfort with defense.",
  },
  "dragonhide": {
    key: "dragonhide",
    label: "Dragonhide",
    rarity: "Very Rare",
    priceMultiplier: 1.75,
    weightModifier: 0.9,
    durabilityModifier: 1.3,
    notes: "Scaled membranes imbued with elemental wards from ancient wyrms.",
  },
  "iron-mail": {
    key: "iron-mail",
    label: "Iron Mail",
    rarity: "Common",
    priceMultiplier: 1,
    weightModifier: 1.1,
    durabilityModifier: 1,
    notes: "Butted iron rings for standard hauberks; requires regular oiling.",
  },
  "steel-mail": {
    key: "steel-mail",
    label: "Riveted Steel Mail",
    rarity: "Uncommon",
    priceMultiplier: 1.3,
    weightModifier: 1.08,
    durabilityModifier: 1.2,
    notes: "Drawn-wire rings riveted shut; resists lances and axe hooks better than iron.",
  },
  "bronze-scale": {
    key: "bronze-scale",
    label: "Bronze Scale",
    rarity: "Uncommon",
    priceMultiplier: 1.05,
    weightModifier: 1.12,
    durabilityModifier: 0.95,
    notes: "Overlapping bronze scales sewn to backing; flexible and bright for parade lines.",
  },
  "steel-scale": {
    key: "steel-scale",
    label: "Steel Scale",
    rarity: "Rare",
    priceMultiplier: 1.35,
    weightModifier: 1.15,
    durabilityModifier: 1.18,
    notes: "Small hardened plates laced in rows; strong against arrows and beast claws.",
  },
  "steel-plate": {
    key: "steel-plate",
    label: "Tempered Plate",
    rarity: "Rare",
    priceMultiplier: 1.55,
    weightModifier: 1.25,
    durabilityModifier: 1.3,
    notes: "Shaped plates over arming garments; includes cuisses, cuirass, and pauldrons.",
  },
  "adamantine-plate": {
    key: "adamantine-plate",
    label: "Adamantine Plate",
    rarity: "Legendary",
    priceMultiplier: 2.25,
    weightModifier: 1.18,
    durabilityModifier: 1.55,
    notes: "Black mirror harness seldom dented even by siege ballistae.",
  },
  "oak-wood": {
    key: "oak-wood",
    label: "Oaken Planks",
    rarity: "Common",
    priceMultiplier: 0.85,
    weightModifier: 1.1,
    durabilityModifier: 0.95,
    notes: "Seasoned oak for shields; holds paint well and handles repeated blows.",
  },
  "tower-shield-alloy": {
    key: "tower-shield-alloy",
    label: "Steel-Lined Tower Alloy",
    rarity: "Rare",
    priceMultiplier: 1.4,
    weightModifier: 1.2,
    durabilityModifier: 1.25,
    notes: "Layered ash and steel with leather edging for siege tower shields.",
  },
};

export const APPAREL_MATERIALS: Record<string, MaterialProfile> = {
  cotton: {
    key: "cotton",
    label: "Cotton Weave",
    rarity: "Common",
    priceMultiplier: 0.85,
    weightModifier: 0.9,
    durabilityModifier: 0.75,
    notes: "Soft breathable cloth ideal for warm climates and casual wear.",
  },
  linen: {
    key: "linen",
    label: "Fine Linen",
    rarity: "Common",
    priceMultiplier: 0.95,
    weightModifier: 0.88,
    durabilityModifier: 0.82,
    notes: "Smooth flax weave favoured by scholars and priests.",
  },
  leather: {
    key: "leather",
    label: "Soft Leather",
    rarity: "Common",
    priceMultiplier: 1,
    weightModifier: 1,
    durabilityModifier: 0.95,
    notes: "Supple hide treated for boots, gloves, and utility belts.",
  },
  wool: {
    key: "wool",
    label: "Wool Broadcloth",
    rarity: "Common",
    priceMultiplier: 1,
    weightModifier: 1,
    durabilityModifier: 0.92,
    notes: "Warm and water resistant when lanolin treated; travel cloaks and tunics.",
  },
  silk: {
    key: "silk",
    label: "Silk",
    rarity: "Uncommon",
    priceMultiplier: 1.35,
    weightModifier: 0.7,
    durabilityModifier: 0.85,
    notes: "Glossy drape beloved at court; takes enchantment threads elegantly.",
  },
  velvet: {
    key: "velvet",
    label: "Velvet",
    rarity: "Uncommon",
    priceMultiplier: 1.25,
    weightModifier: 1.05,
    durabilityModifier: 0.88,
    notes: "Plush pile with deep dyes; stage and nobility attire.",
  },
  fur: {
    key: "fur",
    label: "Winter Fur",
    rarity: "Uncommon",
    priceMultiplier: 1.15,
    weightModifier: 1.1,
    durabilityModifier: 1,
    notes: "Layered fox or wolf pelts trimmed for expedition gear.",
  },
  "shadowweave": {
    key: "shadowweave",
    label: "Shadowweave",
    rarity: "Rare",
    priceMultiplier: 1.6,
    weightModifier: 0.75,
    durabilityModifier: 0.95,
    notes: "Dusky cloth infused with twilight motes; muffles movement and welcomes runes.",
  },
  "sun-silk": {
    key: "sun-silk",
    label: "Sun-Silk",
    rarity: "Rare",
    priceMultiplier: 1.7,
    weightModifier: 0.65,
    durabilityModifier: 0.98,
    notes: "Iridescent silk woven from radiant moth cocoons; resists stains and heat.",
  },
  "dragon-thread": {
    key: "dragon-thread",
    label: "Dragon Thread",
    rarity: "Very Rare",
    priceMultiplier: 1.95,
    weightModifier: 0.68,
    durabilityModifier: 1.2,
    notes: "Filaments spun from wyrmling cocoons; naturally channels arcane energy.",
  },
  hemp: {
    key: "hemp",
    label: "Hemp Canvas",
    rarity: "Common",
    priceMultiplier: 0.8,
    weightModifier: 1.05,
    durabilityModifier: 0.9,
    notes: "Rugged canvas for work aprons, belts, and reinforced travel packs.",
  },
};

export const WEAPON_ENCHANTMENTS: EnchantmentTemplate[] = [
  buildEnchantmentTemplate({
    key: "venomstrike",
    label: "Venomstrike",
    appliesTo: ["weapon"],
    category: "Status",
    description: "A toxin reservoir along the blade releases venom with each telling cut.",
    baseStats: { chancePct: 8, magnitudePct: 12, durationSec: 6 },
    priceWeight: 1.08,
    effectSlug: ({ chancePct = 0, durationSec = 0, magnitudePct = 0 }) =>
      slugTemplate([
        "poison",
        "chance",
        chancePct,
        "pct",
        "duration",
        durationSec,
        "sec",
        "damage",
        magnitudePct,
        "pct",
        "over",
        "time",
      ]),
  }),
  buildEnchantmentTemplate({
    key: "bloodletter",
    label: "Bloodletter",
    appliesTo: ["weapon"],
    category: "Status",
    description: "Enchanted serrations worry flesh and armor alike, causing lingering bleeds.",
    baseStats: { chancePct: 12, magnitudePct: 14, durationSec: 7 },
    priceWeight: 1.05,
    effectSlug: ({ chancePct = 0, durationSec = 0, magnitudePct = 0 }) =>
      slugTemplate([
        "bleed",
        "chance",
        chancePct,
        "pct",
        "duration",
        durationSec,
        "sec",
        "total",
        "damage",
        magnitudePct,
        "pct",
      ]),
  }),
  buildEnchantmentTemplate({
    key: "stormlash",
    label: "Stormlash",
    appliesTo: ["weapon"],
    category: "Offense",
    description: "Crackling storm motes cling to the weapon, surging into each strike.",
    baseStats: { magnitudePct: 10 },
    priceWeight: 1.12,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["add", magnitudePct, "pct", "lightning", "damage"]),
  }),
  buildEnchantmentTemplate({
    key: "frostbrand",
    label: "Frostbrand",
    appliesTo: ["weapon"],
    category: "Status",
    description: "A biting chill follows the blade, sapping speed from struck foes.",
    baseStats: { chancePct: 9, magnitudePct: 8, durationSec: 5 },
    priceWeight: 1.1,
    effectSlug: ({ chancePct = 0, durationSec = 0, magnitudePct = 0 }) =>
      slugTemplate([
        "slow",
        "chance",
        chancePct,
        "pct",
        "slow",
        magnitudePct,
        "pct",
        "duration",
        durationSec,
        "sec",
      ]),
  }),
  buildEnchantmentTemplate({
    key: "sunfire",
    label: "Sunfire",
    appliesTo: ["weapon"],
    category: "Offense",
    description: "Golden sigils kindle searing heat, excelling against undead and beasts.",
    baseStats: { magnitudePct: 11 },
    priceWeight: 1.12,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["add", magnitudePct, "pct", "radiant", "fire", "damage"]),
  }),
  buildEnchantmentTemplate({
    key: "keen-edge",
    label: "Keen Edge",
    appliesTo: ["weapon"],
    category: "Offense",
    description: "Arcane honing stabilizes the edge, pushing lethal strikes more often.",
    baseStats: { magnitudePct: 4 },
    priceWeight: 1.06,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["critical", "chance", "bonus", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "surestrike",
    label: "Surestrike",
    appliesTo: ["weapon"],
    category: "Support",
    description: "Guiding runes adjust the wielder's stance mid-swing for precise hits.",
    baseStats: { flatBonus: 4 },
    priceWeight: 1.05,
    effectSlug: ({ flatBonus = 0 }) => slugTemplate(["accuracy", "bonus", flatBonus]),
  }),
  buildEnchantmentTemplate({
    key: "hewn-power",
    label: "Hewn Power",
    appliesTo: ["weapon"],
    category: "Offense",
    description: "Reinforces the force behind each blow, striking deeper into armor.",
    baseStats: { magnitudePct: 8 },
    priceWeight: 1.08,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["weapon", "damage", "bonus", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "spellbreaker",
    label: "Spellbreaker",
    appliesTo: ["weapon"],
    category: "Status",
    description: "Disruptive sigils shatter active wards and concentration on impact.",
    baseStats: { chancePct: 7, durationSec: 5 },
    priceWeight: 1.14,
    effectSlug: ({ chancePct = 0, durationSec = 0 }) =>
      slugTemplate(["silence", "chance", chancePct, "pct", "duration", durationSec, "sec"]),
  }),
  buildEnchantmentTemplate({
    key: "paralyzer",
    label: "Paralyzer",
    appliesTo: ["weapon"],
    category: "Status",
    description: "Runes flood foes with numbing ether, freezing them briefly in place.",
    baseStats: { chancePct: 5, durationSec: 2 },
    priceWeight: 1.2,
    customGradeAdjust: {
      Major: { priceMultiplier: 2.7 },
    },
    effectSlug: ({ chancePct = 0, durationSec = 0 }) =>
      slugTemplate(["paralyze", "chance", chancePct, "pct", "duration", durationSec, "sec"]),
  }),
  buildEnchantmentTemplate({
    key: "lifedrinker",
    label: "Lifedrinker",
    appliesTo: ["weapon"],
    category: "Support",
    description: "A sanguine siphon heals the wielder as blows land.",
    baseStats: { magnitudePct: 6 },
    priceWeight: 1.18,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["heal", magnitudePct, "pct", "damage", "dealt"]),
  }),
];

export const ARMOR_ENCHANTMENTS: EnchantmentTemplate[] = [
  buildEnchantmentTemplate({
    key: "stoneguard",
    label: "Stoneguard",
    appliesTo: ["armor"],
    category: "Defense",
    description: "Reinforces the wearer's stance, dampening blunt, slash, and pierce harm.",
    baseStats: { magnitudePct: 8 },
    priceWeight: 1.05,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["physical", "damage", "resistance", "bonus", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "flameward",
    label: "Flameward",
    appliesTo: ["armor"],
    category: "Defense",
    description: "A lattice of glyphs disperses heat and burning magics.",
    baseStats: { magnitudePct: 12 },
    priceWeight: 1.08,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["fire", "damage", "reduction", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "frostward",
    label: "Frostward",
    appliesTo: ["armor"],
    category: "Defense",
    description: "Layers of runes maintain warmth and break rime forming on armor.",
    baseStats: { magnitudePct: 12 },
    priceWeight: 1.08,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["cold", "damage", "reduction", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "stormward",
    label: "Stormward",
    appliesTo: ["armor"],
    category: "Defense",
    description: "Grounding chains route lightning away from vital organs.",
    baseStats: { magnitudePct: 12 },
    priceWeight: 1.08,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["lightning", "damage", "reduction", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "toxinward",
    label: "Toxinward",
    appliesTo: ["armor"],
    category: "Status",
    description: "Infuses leathers with herbs that neutralize venoms and spores.",
    baseStats: { magnitudePct: 10 },
    priceWeight: 1.07,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["poison", "resistance", "bonus", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "spellward",
    label: "Spellward",
    appliesTo: ["armor"],
    category: "Defense",
    description: "Arcane wards deflect hostile sorcery and curses.",
    baseStats: { magnitudePct: 9 },
    priceWeight: 1.12,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["spell", "damage", "reduction", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "thornmail",
    label: "Thornmail",
    appliesTo: ["armor"],
    category: "Offense",
    description: "Retaliatory sigils lash attackers with reflexive pain.",
    baseStats: { magnitudePct: 7 },
    priceWeight: 1.1,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["reflect", magnitudePct, "pct", "melee", "damage"]),
  }),
  buildEnchantmentTemplate({
    key: "vital-surge",
    label: "Vital Surge",
    appliesTo: ["armor"],
    category: "Support",
    description: "Heartward charms bolster stamina and blood flow during battle.",
    baseStats: { flatBonus: 18 },
    priceWeight: 1.09,
    effectSlug: ({ flatBonus = 0 }) => slugTemplate(["max", "health", "bonus", flatBonus]),
  }),
  buildEnchantmentTemplate({
    key: "steadfast",
    label: "Steadfast",
    appliesTo: ["armor"],
    category: "Status",
    description: "Grounding prayers steel the wearer against fear, charm, and stun.",
    baseStats: { magnitudePct: 10 },
    priceWeight: 1.06,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["control", "resistance", "bonus", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "featherlight",
    label: "Featherlight",
    appliesTo: ["armor"],
    category: "Utility",
    description: "Luminous threads reduce the perceived weight of the harness.",
    baseStats: { magnitudePct: 15 },
    priceWeight: 1.13,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["armor", "weight", "reduction", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "bulwark",
    label: "Bulwark",
    appliesTo: ["armor", "shield"],
    category: "Defense",
    description: "Mystic reinforcement strengthens blocking angles and guard techniques.",
    baseStats: { magnitudePct: 9 },
    priceWeight: 1.1,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["guard", "strength", "bonus", magnitudePct, "pct", "blocking"]),
  }),
];

export const APPAREL_ENCHANTMENTS: EnchantmentTemplate[] = [
  buildEnchantmentTemplate({
    key: "shadowstep",
    label: "Shadowstep",
    appliesTo: ["apparel"],
    category: "Utility",
    description: "Threads drink ambient light, masking sound and silhouette.",
    baseStats: { magnitudePct: 14 },
    priceWeight: 1.08,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["stealth", "effectiveness", "bonus", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "featherstep",
    label: "Featherstep",
    appliesTo: ["apparel"],
    category: "Utility",
    description: "Cushions every step, easing fatigue and softening landings.",
    baseStats: { magnitudePct: 12 },
    priceWeight: 1.07,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["movement", "stamina", "cost", "reduction", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "windswift",
    label: "Windswift",
    appliesTo: ["apparel"],
    category: "Utility",
    description: "Captures fair breezes, hastening travel and courier work.",
    baseStats: { magnitudePct: 10 },
    priceWeight: 1.05,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["travel", "speed", "bonus", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "merchant-charm",
    label: "Merchant's Charm",
    appliesTo: ["apparel"],
    category: "Support",
    description: "Subtle glamour enhances rapport at market stalls and courts.",
    baseStats: { magnitudePct: 9 },
    priceWeight: 1.06,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["trade", "price", "bonus", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "silver-tongue",
    label: "Silver Tongue",
    appliesTo: ["apparel"],
    category: "Support",
    description: "Runed hems bolster rhetoric, theatre, and negotiations.",
    baseStats: { flatBonus: 5 },
    priceWeight: 1.05,
    effectSlug: ({ flatBonus = 0 }) =>
      slugTemplate(["social", "influence", "bonus", flatBonus]),
  }),
  buildEnchantmentTemplate({
    key: "sage-insight",
    label: "Sage's Insight",
    appliesTo: ["apparel"],
    category: "Support",
    description: "Arcane sigils align thought, improving study and spell recall.",
    baseStats: { magnitudePct: 11 },
    priceWeight: 1.07,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["scholarly", "experience", "gain", "bonus", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "everwarm",
    label: "Everwarm",
    appliesTo: ["apparel"],
    category: "Utility",
    description: "Maintains a comfortable temperature across blizzards or desert gusts.",
    baseStats: { magnitudePct: 16 },
    priceWeight: 1.06,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["environmental", "fatigue", "reduction", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "restorative-thread",
    label: "Restorative Thread",
    appliesTo: ["apparel"],
    category: "Support",
    description: "Soothing runes mend minor wounds during rest.",
    baseStats: { magnitudePct: 8 },
    priceWeight: 1.09,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["rest", "recovery", "bonus", magnitudePct, "pct"]),
  }),
  buildEnchantmentTemplate({
    key: "trailblazer",
    label: "Trailblazer",
    appliesTo: ["apparel"],
    category: "Utility",
    description: "Keeps clothing clean, dry, and snag-free during long expeditions.",
    baseStats: { magnitudePct: 9 },
    priceWeight: 1.04,
    effectSlug: ({ magnitudePct = 0 }) =>
      slugTemplate(["travel", "upkeep", "cost", "reduction", magnitudePct, "pct"]),
  }),
];

export const WEAPON_BASELINES: WeaponBaseline[] = [
  {
    key: "short-sword",
    label: "Short Sword",
    family: "sword",
    basePriceCp: 640,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Small",
    reach: "Short",
    attackSpeed: 7.2,
    damage: 4.6,
    armorPen: "Medium",
    focus: ["SLASH", "PIERCE"],
    summary: "Compact double-edged blade suited to legion skirmishers and shield partners.",
    materialKeys: ["bronze", "iron", "steel", "high-carbon-steel", "damascus-steel", "mithril", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["venomstrike", "bloodletter", "keen-edge", "surestrike", "frostbrand", "sunfire"],
  },
  {
    key: "arming-sword",
    label: "Arming Sword",
    family: "sword",
    basePriceCp: 710,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Medium",
    attackSpeed: 7,
    damage: 5,
    armorPen: "Medium",
    focus: ["SLASH", "PIERCE"],
    summary: "Knightly sidearm balancing cut and thrust with a cruciform guard.",
    materialKeys: ["iron", "steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine", "dragonbone", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["keen-edge", "stormlash", "sunfire", "hewn-power", "spellbreaker", "lifedrinker"],
  },
  {
    key: "longsword",
    label: "Longsword",
    family: "sword",
    basePriceCp: 1545,
    defaultMaterialKey: "high-carbon-steel",
    defaultQuality: "Standard",
    hands: 2,
    size: "Large",
    reach: "Very Long",
    attackSpeed: 6,
    damage: 6.5,
    armorPen: "Medium-High",
    focus: ["SLASH", "PIERCE"],
    summary: "Versatile two-hander for winding binds, half-swording, and battlefield control.",
    materialKeys: ["steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine", "dragonbone", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["keen-edge", "stormlash", "sunfire", "hewn-power", "spellbreaker", "paralyzer", "lifedrinker"],
  },
  {
    key: "greatsword",
    label: "Greatsword",
    family: "sword",
    basePriceCp: 2250,
    defaultMaterialKey: "damascus-steel",
    defaultQuality: "Standard",
    hands: 2,
    size: "Very Large",
    reach: "Very Long",
    attackSpeed: 5.5,
    damage: 7,
    armorPen: "High",
    focus: ["SLASH", "BLUNT"],
    summary: "Broad battlefield blade that hews through ranks and shatters polearms.",
    materialKeys: ["steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine", "dragonbone", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "hewn-power", "bloodletter", "paralyzer", "lifedrinker"],
  },
  {
    key: "curved-katana",
    label: "Curved Katana",
    family: "sword",
    basePriceCp: 1610,
    defaultMaterialKey: "damascus-steel",
    defaultQuality: "Fine",
    hands: 2,
    size: "Large",
    reach: "Long",
    attackSpeed: 6.4,
    damage: 6.1,
    armorPen: "Medium-High",
    focus: ["SLASH", "PIERCE"],
    summary: "Folded-steel cutter favouring two-handed draw cuts and precision limbs strikes.",
    materialKeys: ["steel", "high-carbon-steel", "damascus-steel", "mithril", "dragonbone", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["keen-edge", "surestrike", "frostbrand", "sunfire", "venomstrike", "lifedrinker"],
  },
  {
    key: "hand-axe",
    label: "Hand Axe",
    family: "axe",
    basePriceCp: 520,
    defaultMaterialKey: "iron",
    defaultQuality: "Standard",
    hands: 1,
    size: "Small",
    reach: "Short",
    attackSpeed: 6.5,
    damage: 4.8,
    armorPen: "Medium",
    focus: ["SLASH", "BLUNT"],
    summary: "Light chopping axe balanced for belt carry and shield-side work.",
    materialKeys: ["bronze", "iron", "steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["bloodletter", "hewn-power", "stormlash", "sunfire", "venomstrike"],
  },
  {
    key: "battle-axe",
    label: "Battle Axe",
    family: "axe",
    basePriceCp: 950,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Medium",
    attackSpeed: 6,
    damage: 6,
    armorPen: "Medium-High",
    focus: ["SLASH", "BLUNT"],
    summary: "Broad single-bit axe with spike poll for armored adversaries.",
    materialKeys: ["iron", "steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["bloodletter", "hewn-power", "stormlash", "sunfire", "lifedrinker"],
  },
  {
    key: "bearded-axe",
    label: "Bearded Axe",
    family: "axe",
    basePriceCp: 945,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Medium",
    attackSpeed: 6,
    damage: 6.5,
    armorPen: "Medium",
    focus: ["SLASH", "BLUNT"],
    summary: "Hooked beard drags shields and reins before decisive chops.",
    materialKeys: ["steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["bloodletter", "hewn-power", "stormlash", "sunfire", "spellbreaker"],
  },
  {
    key: "great-axe",
    label: "Great Axe",
    family: "axe",
    basePriceCp: 2100,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 2,
    size: "Large",
    reach: "Long",
    attackSpeed: 4.8,
    damage: 8,
    armorPen: "High",
    focus: ["SLASH", "BLUNT"],
    summary: "Towering wedge that sunders pikes and cavalry alike.",
    materialKeys: ["steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine", "dragonbone", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["hewn-power", "stormlash", "sunfire", "bloodletter", "paralyzer", "lifedrinker"],
  },
  {
    key: "war-cleaver",
    label: "War Cleaver",
    family: "axe",
    basePriceCp: 1775,
    defaultMaterialKey: "damascus-steel",
    defaultQuality: "Fine",
    hands: 2,
    size: "Large",
    reach: "Long",
    attackSpeed: 5.2,
    damage: 7.4,
    armorPen: "Medium-High",
    focus: ["SLASH", "BLUNT"],
    summary: "Curved falx-like blade optimized for ripping shields and limb joints.",
    materialKeys: ["steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["bloodletter", "hewn-power", "stormlash", "sunfire", "lifedrinker"],
  },
  {
    key: "stiletto",
    label: "Stiletto",
    family: "dagger",
    basePriceCp: 340,
    defaultMaterialKey: "high-carbon-steel",
    defaultQuality: "Fine",
    hands: 1,
    size: "Tiny",
    reach: "Very Short",
    attackSpeed: 8,
    damage: 3.6,
    armorPen: "Medium-High",
    focus: ["PIERCE"],
    summary: "Slender triangular spike that slides between mail links with ease.",
    materialKeys: ["steel", "high-carbon-steel", "damascus-steel", "mithril", "cold-iron"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["venomstrike", "bloodletter", "spellbreaker", "keen-edge", "surestrike"],
  },
  {
    key: "dirk",
    label: "Dirk",
    family: "dagger",
    basePriceCp: 360,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Small",
    reach: "Short",
    attackSpeed: 7.8,
    damage: 3.8,
    armorPen: "Medium",
    focus: ["SLASH", "PIERCE"],
    summary: "Seafolk favorite with a broad clip-point suited for rope work and sudden fights.",
    materialKeys: ["iron", "steel", "high-carbon-steel", "damascus-steel", "mithril"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["venomstrike", "bloodletter", "keen-edge", "surestrike", "lifedrinker"],
  },
  {
    key: "kris-dagger",
    label: "Kris Dagger",
    family: "dagger",
    basePriceCp: 405,
    defaultMaterialKey: "damascus-steel",
    defaultQuality: "Fine",
    hands: 1,
    size: "Small",
    reach: "Short",
    attackSpeed: 7.6,
    damage: 3.9,
    armorPen: "Medium",
    focus: ["SLASH", "PIERCE"],
    summary: "Wavy blade that opens wide wounds and channels enchantment lines gracefully.",
    materialKeys: ["steel", "damascus-steel", "mithril", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["venomstrike", "bloodletter", "keen-edge", "lifedrinker", "frostbrand"],
  },
  {
    key: "spiked-mace",
    label: "Spiked Mace",
    family: "mace",
    basePriceCp: 680,
    defaultMaterialKey: "iron",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Short/Medium",
    attackSpeed: 6.2,
    damage: 5.6,
    armorPen: "Medium-High",
    focus: ["BLUNT", "PIERCE"],
    summary: "Morning patrol favorite for crushing helms and hooking gaps.",
    materialKeys: ["iron", "steel", "adamantine", "mithril", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["hewn-power", "stormlash", "spellbreaker", "paralyzer", "lifedrinker"],
  },
  {
    key: "flanged-mace",
    label: "Flanged Mace",
    family: "mace",
    basePriceCp: 740,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Short/Medium",
    attackSpeed: 6.1,
    damage: 5.8,
    armorPen: "High",
    focus: ["BLUNT"],
    summary: "Ribbed flanges bite plate harness and punch through shields.",
    materialKeys: ["steel", "adamantine", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["hewn-power", "stormlash", "spellbreaker", "paralyzer", "lifedrinker"],
  },
  {
    key: "morningstar",
    label: "Morningstar",
    family: "mace",
    basePriceCp: 810,
    defaultMaterialKey: "steel",
    defaultQuality: "Fine",
    hands: 1,
    size: "Medium",
    reach: "Medium",
    attackSpeed: 5.9,
    damage: 6.2,
    armorPen: "High",
    focus: ["BLUNT", "PIERCE"],
    summary: "Spiked ball that delivers shattering blows even through plate.",
    materialKeys: ["steel", "adamantine", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["hewn-power", "stormlash", "sunfire", "paralyzer", "lifedrinker"],
  },
  {
    key: "warhammer",
    label: "Warhammer",
    family: "hammer",
    basePriceCp: 980,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Short/Medium",
    attackSpeed: 6,
    damage: 6,
    armorPen: "High",
    focus: ["BLUNT"],
    summary: "Compact hammer with beaked poll for punching into plate seams.",
    materialKeys: ["steel", "adamantine", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["hewn-power", "stormlash", "spellbreaker", "paralyzer", "lifedrinker"],
  },
  {
    key: "maul",
    label: "Maul",
    family: "hammer",
    basePriceCp: 1620,
    defaultMaterialKey: "ironwood",
    defaultQuality: "Standard",
    hands: 2,
    size: "Large",
    reach: "Medium/Long",
    attackSpeed: 4.6,
    damage: 8.4,
    armorPen: "High",
    focus: ["BLUNT"],
    summary: "Two-handed sledge that caves shields and breaches doors.",
    materialKeys: ["ironwood", "steel", "adamantine", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["hewn-power", "stormlash", "sunfire", "paralyzer", "lifedrinker"],
  },
  {
    key: "pick-hammer",
    label: "Pick Hammer",
    family: "hammer",
    basePriceCp: 905,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Short",
    attackSpeed: 6.2,
    damage: 5.4,
    armorPen: "Very High",
    focus: ["PIERCE"],
    summary: "Needle pick that excels at puncturing heavy harness and carapaces.",
    materialKeys: ["steel", "adamantine", "cold-iron", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["spellbreaker", "paralyzer", "stormlash", "sunfire", "lifedrinker"],
  },
  {
    key: "short-spear",
    label: "Short Spear",
    family: "spear",
    basePriceCp: 480,
    defaultMaterialKey: "ash-wood",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Medium",
    attackSpeed: 6.8,
    damage: 4.8,
    armorPen: "Medium",
    focus: ["PIERCE"],
    summary: "Shield-line spear ideal for tight formations and hunting.",
    materialKeys: ["ash-wood", "heartwood", "steel", "high-carbon-steel", "mithril", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["venomstrike", "stormlash", "sunfire", "surestrike", "spellbreaker"],
  },
  {
    key: "long-spear",
    label: "Long Spear",
    family: "spear",
    basePriceCp: 620,
    defaultMaterialKey: "heartwood",
    defaultQuality: "Standard",
    hands: 2,
    size: "Large",
    reach: "Long",
    attackSpeed: 6.2,
    damage: 5.6,
    armorPen: "Medium",
    focus: ["PIERCE"],
    summary: "Two-handed spear keeping cavalry at bay while allies strike.",
    materialKeys: ["heartwood", "ironwood", "steel", "high-carbon-steel", "mithril", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "surestrike", "spellbreaker", "paralyzer"],
  },
  {
    key: "pike",
    label: "Pike",
    family: "spear",
    basePriceCp: 900,
    defaultMaterialKey: "heartwood",
    defaultQuality: "Standard",
    hands: 2,
    size: "Very Large",
    reach: "Very Long",
    attackSpeed: 5,
    damage: 6,
    armorPen: "Medium-High",
    focus: ["PIERCE"],
    summary: "Four-meter polearm for phalanx work and cavalry denial.",
    materialKeys: ["heartwood", "ironwood", "steel", "high-carbon-steel", "mithril"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "surestrike", "spellbreaker", "paralyzer"],
  },
  {
    key: "trident",
    label: "Trident",
    family: "spear",
    basePriceCp: 750,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Medium/Long",
    attackSpeed: 6,
    damage: 5.4,
    armorPen: "Medium",
    focus: ["PIERCE"],
    summary: "Three-pronged polearm for nets, naval boarding, and beast control.",
    materialKeys: ["steel", "high-carbon-steel", "mithril", "adamantine", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "venomstrike", "surestrike", "lifedrinker"],
  },
  {
    key: "halberd",
    label: "Halberd",
    family: "polearm",
    basePriceCp: 1850,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 2,
    size: "Large",
    reach: "Long",
    attackSpeed: 4.5,
    damage: 8.8,
    armorPen: "High",
    focus: ["SLASH", "PIERCE"],
    summary: "Versatile polearm combining spear thrust, axe cleave, and hook.",
    materialKeys: ["heartwood", "ironwood", "steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "hewn-power", "spellbreaker", "paralyzer"],
  },
  {
    key: "glaive",
    label: "Glaive",
    family: "polearm",
    basePriceCp: 1610,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 2,
    size: "Large",
    reach: "Long",
    attackSpeed: 5,
    damage: 7.8,
    armorPen: "Medium-High",
    focus: ["SLASH"],
    summary: "Sword-bladed polearm excelling at sweeping cuts and perimeter control.",
    materialKeys: ["heartwood", "ironwood", "steel", "high-carbon-steel", "damascus-steel", "mithril"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "bloodletter", "hewn-power", "surestrike"],
  },
  {
    key: "bardiche",
    label: "Bardiche",
    family: "polearm",
    basePriceCp: 1720,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 2,
    size: "Large",
    reach: "Medium/Long",
    attackSpeed: 4.6,
    damage: 8.1,
    armorPen: "High",
    focus: ["SLASH"],
    summary: "Long-bearded axe head on an elongated haft for cleaving through barricades.",
    materialKeys: ["heartwood", "steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "bloodletter", "hewn-power", "lifedrinker"],
  },
  {
    key: "poleaxe",
    label: "Poleaxe",
    family: "polearm",
    basePriceCp: 1680,
    defaultMaterialKey: "steel",
    defaultQuality: "Fine",
    hands: 2,
    size: "Large",
    reach: "Medium/Long",
    attackSpeed: 4.7,
    damage: 7.9,
    armorPen: "High",
    focus: ["SLASH", "PIERCE"],
    summary: "Knightly polearm marrying hammer face, axe edge, and thrusting spike.",
    materialKeys: ["heartwood", "ironwood", "steel", "high-carbon-steel", "damascus-steel", "mithril", "adamantine"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "hewn-power", "spellbreaker", "paralyzer"],
  },
  {
    key: "quarterstaff",
    label: "Quarterstaff",
    family: "staff",
    basePriceCp: 240,
    defaultMaterialKey: "ash-wood",
    defaultQuality: "Standard",
    hands: 2,
    size: "Medium",
    reach: "Medium",
    attackSpeed: 7,
    damage: 4,
    armorPen: "Low-Medium",
    focus: ["BLUNT"],
    summary: "Simple walking staff balanced for defensive spins and jabs.",
    materialKeys: ["ash-wood", "heartwood", "ironwood", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "frostbrand", "surestrike", "spellbreaker", "lifedrinker"],
  },
  {
    key: "battle-staff",
    label: "Battle Staff",
    family: "staff",
    basePriceCp: 540,
    defaultMaterialKey: "heartwood",
    defaultQuality: "Standard",
    hands: 2,
    size: "Medium",
    reach: "Medium/Long",
    attackSpeed: 6.2,
    damage: 5.2,
    armorPen: "Medium",
    focus: ["BLUNT"],
    summary: "Iron-shod staff that blends reach control with stunning strikes.",
    materialKeys: ["heartwood", "ironwood", "steel", "mithril", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "frostbrand", "surestrike", "spellbreaker", "lifedrinker"],
  },
  {
    key: "arcane-staff",
    label: "Arcane Staff",
    family: "staff",
    basePriceCp: 680,
    defaultMaterialKey: "dragonbone",
    defaultQuality: "Fine",
    hands: 2,
    size: "Medium",
    reach: "Medium/Long",
    attackSpeed: 6,
    damage: 4.5,
    armorPen: "Medium",
    focus: ["BLUNT"],
    summary: "Glyph-carved focus channeling spells while offering respectable reach.",
    materialKeys: ["heartwood", "ironwood", "dragonbone", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "frostbrand", "spellbreaker", "lifedrinker", "sunfire"],
  },
  {
    key: "chain-flail",
    label: "Chain Flail",
    family: "flail",
    basePriceCp: 780,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Medium",
    attackSpeed: 5.8,
    damage: 6.2,
    armorPen: "Medium-High",
    focus: ["BLUNT"],
    summary: "Chain-linked head that snakes around shields before impact.",
    materialKeys: ["steel", "adamantine", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "hewn-power", "spellbreaker", "paralyzer", "lifedrinker"],
  },
  {
    key: "horseman-flail",
    label: "Horseman Flail",
    family: "flail",
    basePriceCp: 960,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Medium/Long",
    attackSpeed: 5.4,
    damage: 6.6,
    armorPen: "High",
    focus: ["BLUNT"],
    summary: "Rigid handle with triple chains, built for mounted sweeps.",
    materialKeys: ["steel", "adamantine", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "hewn-power", "sunfire", "paralyzer", "lifedrinker"],
  },
  {
    key: "grand-flail",
    label: "Grand Flail",
    family: "flail",
    basePriceCp: 1420,
    defaultMaterialKey: "steel",
    defaultQuality: "Fine",
    hands: 2,
    size: "Large",
    reach: "Long",
    attackSpeed: 4.6,
    damage: 7.8,
    armorPen: "High",
    focus: ["BLUNT"],
    summary: "Pole-length flail delivering crushing arcs to break tight formations.",
    materialKeys: ["steel", "adamantine", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "hewn-power", "sunfire", "paralyzer", "lifedrinker"],
  },
  {
    key: "cudgel",
    label: "Cudgel",
    family: "club",
    basePriceCp: 180,
    defaultMaterialKey: "ash-wood",
    defaultQuality: "Standard",
    hands: 1,
    size: "Small",
    reach: "Short",
    attackSpeed: 6.5,
    damage: 3.8,
    armorPen: "Low",
    focus: ["BLUNT"],
    summary: "Reliable village baton for constables and caravan guards.",
    materialKeys: ["ash-wood", "heartwood", "ironwood", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "frostbrand", "surestrike", "spellbreaker"],
  },
  {
    key: "war-club",
    label: "War Club",
    family: "club",
    basePriceCp: 520,
    defaultMaterialKey: "ironwood",
    defaultQuality: "Standard",
    hands: 2,
    size: "Medium",
    reach: "Medium",
    attackSpeed: 5.6,
    damage: 6,
    armorPen: "Medium",
    focus: ["BLUNT"],
    summary: "Knobbed hardwood cudgel that bludgeons through hide and bone.",
    materialKeys: ["heartwood", "ironwood", "dragonbone", "mithril"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "hewn-power", "sunfire", "lifedrinker"],
  },
  {
    key: "ironwood-scepter",
    label: "Ironwood Scepter",
    family: "club",
    basePriceCp: 640,
    defaultMaterialKey: "ironwood",
    defaultQuality: "Fine",
    hands: 1,
    size: "Small",
    reach: "Short/Medium",
    attackSpeed: 6,
    damage: 4.4,
    armorPen: "Medium",
    focus: ["BLUNT"],
    summary: "Regal baton reinforced with brass for mage-wardens and judges.",
    materialKeys: ["ironwood", "dragonbone", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["spellbreaker", "surestrike", "lifedrinker", "sunfire"],
  },
  {
    key: "shortbow",
    label: "Shortbow",
    family: "bow",
    basePriceCp: 760,
    defaultMaterialKey: "heartwood",
    defaultQuality: "Standard",
    hands: 2,
    size: "Medium",
    reach: "Long",
    attackSpeed: 5.5,
    damage: 5,
    armorPen: "Medium",
    focus: ["PIERCE"],
    summary: "Compact bow for scouts requiring easy draw from horseback or cover.",
    materialKeys: ["ash-wood", "heartwood", "ironwood", "dragonbone", "mithril"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "surestrike", "frostbrand", "lifedrinker"],
  },
  {
    key: "longbow",
    label: "Longbow",
    family: "bow",
    basePriceCp: 1120,
    defaultMaterialKey: "heartwood",
    defaultQuality: "Standard",
    hands: 2,
    size: "Large",
    reach: "Very Long",
    attackSpeed: 5,
    damage: 5.8,
    armorPen: "Medium-High",
    focus: ["PIERCE"],
    summary: "Tall stave bow that rains armor-piercing shafts at long range.",
    materialKeys: ["heartwood", "ironwood", "dragonbone", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "surestrike", "spellbreaker", "lifedrinker"],
  },
  {
    key: "greatbow",
    label: "Greatbow",
    family: "bow",
    basePriceCp: 1380,
    defaultMaterialKey: "ironwood",
    defaultQuality: "Fine",
    hands: 2,
    size: "Large",
    reach: "Very Long",
    attackSpeed: 4.6,
    damage: 6.4,
    armorPen: "High",
    focus: ["PIERCE"],
    summary: "Massive draw weight launching heavy armor-cracking shafts.",
    materialKeys: ["ironwood", "dragonbone", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "surestrike", "spellbreaker", "paralyzer"],
  },
  {
    key: "recurve-bow",
    label: "Recurve Bow",
    family: "bow",
    basePriceCp: 920,
    defaultMaterialKey: "heartwood",
    defaultQuality: "Fine",
    hands: 2,
    size: "Medium",
    reach: "Long",
    attackSpeed: 5.4,
    damage: 5.4,
    armorPen: "Medium",
    focus: ["PIERCE"],
    summary: "Laminated bow of horn and wood with fast cast suited for skirmishers.",
    materialKeys: ["heartwood", "dragonbone", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "surestrike", "frostbrand", "lifedrinker"],
  },
  {
    key: "hand-crossbow",
    label: "Hand Crossbow",
    family: "crossbow",
    basePriceCp: 640,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Small",
    reach: "Medium",
    attackSpeed: 3.5,
    damage: 4.8,
    armorPen: "Medium",
    focus: ["PIERCE"],
    summary: "Compact repeater for rogues and city watch ambushes.",
    materialKeys: ["steel", "high-carbon-steel", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["venomstrike", "stormlash", "sunfire", "surestrike", "spellbreaker"],
  },
  {
    key: "light-crossbow",
    label: "Light Crossbow",
    family: "crossbow",
    basePriceCp: 920,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 2,
    size: "Medium",
    reach: "Long",
    attackSpeed: 3.8,
    damage: 5.8,
    armorPen: "Medium-High",
    focus: ["PIERCE"],
    summary: "Cranked bow with steady aim for garrisons and mercenary lines.",
    materialKeys: ["steel", "high-carbon-steel", "mithril", "adamantine", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "surestrike", "spellbreaker", "lifedrinker"],
  },
  {
    key: "heavy-crossbow",
    label: "Heavy Crossbow",
    family: "crossbow",
    basePriceCp: 1360,
    defaultMaterialKey: "steel",
    defaultQuality: "Fine",
    hands: 2,
    size: "Large",
    reach: "Long",
    attackSpeed: 3.2,
    damage: 7.2,
    armorPen: "High",
    focus: ["PIERCE"],
    summary: "Windlass-drawn arbalest for piercing plate and fortress shutters.",
    materialKeys: ["steel", "adamantine", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "surestrike", "spellbreaker", "paralyzer"],
  },
  {
    key: "arbalest",
    label: "Arbalest",
    family: "crossbow",
    basePriceCp: 1780,
    defaultMaterialKey: "adamantine",
    defaultQuality: "Fine",
    hands: 2,
    size: "Large",
    reach: "Long",
    attackSpeed: 2.8,
    damage: 8.4,
    armorPen: "Very High",
    focus: ["PIERCE"],
    summary: "Siege-crossbow firing quarrels capable of spearing shield walls.",
    materialKeys: ["steel", "adamantine", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "surestrike", "spellbreaker", "paralyzer"],
  },
  {
    key: "repeating-crossbow",
    label: "Repeating Crossbow",
    family: "crossbow",
    basePriceCp: 1500,
    defaultMaterialKey: "steel",
    defaultQuality: "Fine",
    hands: 2,
    size: "Medium",
    reach: "Long",
    attackSpeed: 4.2,
    damage: 5.6,
    armorPen: "Medium",
    focus: ["PIERCE"],
    summary: "Magazine-fed bow for sustained volleys at mid-range.",
    materialKeys: ["steel", "mithril", "meteor-steel", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "surestrike", "spellbreaker", "lifedrinker"],
  },
  {
    key: "throwing-knife",
    label: "Throwing Knife",
    family: "thrower",
    basePriceCp: 210,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Tiny",
    reach: "Very Short",
    attackSpeed: 3,
    damage: 3.2,
    armorPen: "Low-Medium",
    focus: ["PIERCE"],
    summary: "Balanced blade designed for accurate flick throws at close range.",
    materialKeys: ["steel", "high-carbon-steel", "damascus-steel", "mithril"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["venomstrike", "bloodletter", "keen-edge", "surestrike", "frostbrand"],
  },
  {
    key: "throwing-axe",
    label: "Throwing Axe",
    family: "thrower",
    basePriceCp: 510,
    defaultMaterialKey: "steel",
    defaultQuality: "Standard",
    hands: 1,
    size: "Small",
    reach: "Short",
    attackSpeed: 3,
    damage: 5,
    armorPen: "Medium",
    focus: ["SLASH", "BLUNT"],
    summary: "Weighted head that rotates cleanly for camp ambushes.",
    materialKeys: ["iron", "steel", "high-carbon-steel", "damascus-steel", "mithril"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["bloodletter", "venomstrike", "stormlash", "sunfire", "surestrike"],
  },
  {
    key: "javelin",
    label: "Javelin",
    family: "thrower",
    basePriceCp: 380,
    defaultMaterialKey: "ash-wood",
    defaultQuality: "Standard",
    hands: 1,
    size: "Medium",
    reach: "Medium",
    attackSpeed: 2.8,
    damage: 4.6,
    armorPen: "Medium",
    focus: ["PIERCE"],
    summary: "Light spear for skirmish volleys and monster hunting.",
    materialKeys: ["ash-wood", "heartwood", "steel", "high-carbon-steel", "mithril", "dragonbone"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "venomstrike", "surestrike", "spellbreaker"],
  },
  {
    key: "chakram",
    label: "Chakram",
    family: "thrower",
    basePriceCp: 450,
    defaultMaterialKey: "steel",
    defaultQuality: "Fine",
    hands: 1,
    size: "Small",
    reach: "Short",
    attackSpeed: 3.4,
    damage: 4.2,
    armorPen: "Medium",
    focus: ["SLASH"],
    summary: "Circular blade that carves arcs before returning to the wielder.",
    materialKeys: ["steel", "damascus-steel", "mithril", "meteor-steel"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stormlash", "sunfire", "frostbrand", "keen-edge", "surestrike"],
  },
];

export const ARMOR_BASELINES: ArmorBaseline[] = [
  {
    key: "padded-gambeson",
    label: "Padded Gambeson",
    kind: "cloth",
    basePriceCp: 960,
    defaultMaterialKey: "linen",
    defaultQuality: "Standard",
    weight: "Light",
    coverage: ["torso"],
    defenseScore: 28,
    resistances: { BLUNT: 6, SLASH: 12, PIERCE: 4 },
    summary: "Layered linen and wool quilting that absorbs bruising for levy infantry.",
    materialKeys: ["linen", "wool", "leather", "studded-leather", "dragonhide"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "flameward", "frostward", "stormward", "toxinward", "featherlight", "steadfast"],
  },
  {
    key: "leather-jerkin",
    label: "Leather Jerkin",
    kind: "leather",
    basePriceCp: 1240,
    defaultMaterialKey: "leather",
    defaultQuality: "Standard",
    weight: "Light",
    coverage: ["torso"],
    defenseScore: 32,
    resistances: { BLUNT: 5, SLASH: 14, PIERCE: 6 },
    summary: "Boiled leather reinforced with overlapping plates for scouts and rogues.",
    materialKeys: ["leather", "studded-leather", "boar-hide", "elk-hide", "dragonhide"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "toxinward", "featherlight", "shadowstep", "steadfast"],
  },
  {
    key: "studded-leather",
    label: "Studded Leather Coat",
    kind: "leather",
    basePriceCp: 1920,
    defaultMaterialKey: "studded-leather",
    defaultQuality: "Fine",
    weight: "Light",
    coverage: ["torso", "arms"],
    defenseScore: 34,
    resistances: { BLUNT: 6, SLASH: 16, PIERCE: 6 },
    summary: "Riveted studs over leather backing, balancing mobility with protection.",
    materialKeys: ["studded-leather", "boar-hide", "elk-hide", "dragonhide"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "toxinward", "spellward", "featherlight", "steadfast"],
  },
  {
    key: "boar-hide-coat",
    label: "Boar Hide Coat",
    kind: "hide",
    basePriceCp: 1520,
    defaultMaterialKey: "boar-hide",
    defaultQuality: "Standard",
    weight: "Medium",
    coverage: ["torso", "arms"],
    defenseScore: 36,
    resistances: { BLUNT: 8, SLASH: 15, PIERCE: 7 },
    summary: "Dense forest boar hide favoured by border rangers for rugged protection.",
    materialKeys: ["boar-hide", "elk-hide", "dragonhide"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "flameward", "frostward", "toxinward", "featherlight"],
  },
  {
    key: "chain-shirt",
    label: "Chain Shirt",
    kind: "mail",
    basePriceCp: 1680,
    defaultMaterialKey: "iron-mail",
    defaultQuality: "Standard",
    weight: "Medium",
    coverage: ["torso"],
    defenseScore: 40,
    resistances: { BLUNT: 8, SLASH: 18, PIERCE: 8 },
    summary: "Short-sleeved riveted mail to slip beneath surcoats and brigandines.",
    materialKeys: ["iron-mail", "steel-mail", "steel-scale", "dragonhide"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "flameward", "stormward", "spellward", "steadfast"],
  },
  {
    key: "chain-hauberk",
    label: "Chain Hauberk",
    kind: "mail",
    basePriceCp: 2420,
    defaultMaterialKey: "steel-mail",
    defaultQuality: "Fine",
    weight: "Medium",
    coverage: ["full"],
    defenseScore: 46,
    resistances: { BLUNT: 10, SLASH: 20, PIERCE: 9 },
    summary: "Full-length hauberk with coif offering comprehensive mail coverage.",
    materialKeys: ["iron-mail", "steel-mail", "steel-scale", "dragonhide", "adamantine-plate"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "stormward", "spellward", "vital-surge", "steadfast"],
  },
  {
    key: "scale-mail",
    label: "Scale Mail",
    kind: "scale",
    basePriceCp: 2100,
    defaultMaterialKey: "steel-scale",
    defaultQuality: "Standard",
    weight: "Medium",
    coverage: ["torso", "arms", "legs"],
    defenseScore: 45,
    resistances: { BLUNT: 9, SLASH: 21, PIERCE: 10 },
    summary: "Overlapping steel scales stitched to backing for excellent arrow defense.",
    materialKeys: ["bronze-scale", "steel-scale", "steel-mail", "dragonhide"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "flameward", "stormward", "spellward", "thornmail"],
  },
  {
    key: "brigandine",
    label: "Brigandine",
    kind: "scale",
    basePriceCp: 2280,
    defaultMaterialKey: "studded-leather",
    defaultQuality: "Fine",
    weight: "Medium",
    coverage: ["torso", "arms"],
    defenseScore: 44,
    resistances: { BLUNT: 9, SLASH: 19, PIERCE: 9 },
    summary: "Cloth coat lined with overlapping plates, prized by mercenary captains.",
    materialKeys: ["studded-leather", "steel-scale", "steel-mail", "dragonhide"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "spellward", "thornmail", "vital-surge", "featherlight"],
  },
  {
    key: "breastplate",
    label: "Steel Breastplate",
    kind: "plate",
    basePriceCp: 2640,
    defaultMaterialKey: "steel-plate",
    defaultQuality: "Fine",
    weight: "Medium",
    coverage: ["torso"],
    defenseScore: 48,
    resistances: { BLUNT: 11, SLASH: 22, PIERCE: 11 },
    summary: "Curved chest plate with fauld and tassets favoured by cavalry officers.",
    materialKeys: ["steel-plate", "adamantine-plate", "dragonhide", "steel-mail"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "flameward", "stormward", "spellward", "vital-surge", "featherlight"],
  },
  {
    key: "half-plate",
    label: "Half Plate",
    kind: "plate",
    basePriceCp: 3420,
    defaultMaterialKey: "steel-plate",
    defaultQuality: "Fine",
    weight: "Heavy",
    coverage: ["torso", "arms", "legs"],
    defenseScore: 52,
    resistances: { BLUNT: 12, SLASH: 24, PIERCE: 12 },
    summary: "Plate cuirass with articulated limbs paired with mail voiders.",
    materialKeys: ["steel-plate", "adamantine-plate", "dragonhide"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "flameward", "stormward", "spellward", "vital-surge", "featherlight", "steadfast"],
  },
  {
    key: "full-plate",
    label: "Full Plate Harness",
    kind: "plate",
    basePriceCp: 5280,
    defaultMaterialKey: "adamantine-plate",
    defaultQuality: "Masterwork",
    weight: "Heavy",
    coverage: ["full"],
    defenseScore: 58,
    resistances: { BLUNT: 14, SLASH: 28, PIERCE: 14 },
    summary: "Tournament-grade harness with greaves, gauntlets, and enclosed helm.",
    materialKeys: ["steel-plate", "adamantine-plate", "dragonhide"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "flameward", "stormward", "spellward", "vital-surge", "thornmail", "bulwark"],
  },
  {
    key: "dragonhide-carapace",
    label: "Dragonhide Carapace",
    kind: "hide",
    basePriceCp: 4120,
    defaultMaterialKey: "dragonhide",
    defaultQuality: "Fine",
    weight: "Medium",
    coverage: ["torso", "arms"],
    defenseScore: 50,
    resistances: { BLUNT: 11, SLASH: 23, PIERCE: 12 },
    summary: "Scaled wyrm hide offering innate elemental warding for elite rangers.",
    materialKeys: ["dragonhide", "steel-scale", "adamantine-plate"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["flameward", "frostward", "stormward", "spellward", "vital-surge", "featherlight"],
  },
  {
    key: "kite-shield",
    label: "Kite Shield",
    kind: "shield",
    basePriceCp: 640,
    defaultMaterialKey: "oak-wood",
    defaultQuality: "Standard",
    weight: "Medium",
    coverage: ["shield"],
    defenseScore: 20,
    resistances: { BLUNT: 8, SLASH: 10, PIERCE: 9 },
    summary: "Heater-style shield suited to cavalry, balancing coverage with control.",
    materialKeys: ["oak-wood", "tower-shield-alloy", "steel-plate", "dragonhide"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "flameward", "stormward", "spellward", "bulwark", "featherlight"],
  },
  {
    key: "tower-shield",
    label: "Tower Shield",
    kind: "shield",
    basePriceCp: 1180,
    defaultMaterialKey: "tower-shield-alloy",
    defaultQuality: "Fine",
    weight: "Heavy",
    coverage: ["shield"],
    defenseScore: 28,
    resistances: { BLUNT: 10, SLASH: 14, PIERCE: 12 },
    summary: "Massive pavise shield offering near-total cover for sieges and defensive lines.",
    materialKeys: ["oak-wood", "tower-shield-alloy", "steel-plate", "adamantine-plate"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["stoneguard", "flameward", "stormward", "spellward", "bulwark", "featherlight", "thornmail"],
  },
];

export const APPAREL_BASELINES: ApparelBaseline[] = [
  {
    key: "traveler-cloak",
    label: "Traveler's Cloak",
    piece: "cloak",
    basePriceCp: 320,
    defaultMaterialKey: "wool",
    defaultQuality: "Standard",
    summary: "Weatherproof cloak lined with waxed wool for road-weary adventurers.",
    materialKeys: ["wool", "cotton", "hemp", "fur", "leather"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["featherstep", "windswift", "everwarm", "trailblazer"],
  },
  {
    key: "shadow-cloak",
    label: "Shadow Cloak",
    piece: "cloak",
    basePriceCp: 960,
    defaultMaterialKey: "shadowweave",
    defaultQuality: "Fine",
    summary: "Twilight-dyed cloak prized by scouts and rogues for its soundless drape.",
    materialKeys: ["shadowweave", "dragon-thread", "silk"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["shadowstep", "featherstep", "windswift", "trailblazer"],
  },
  {
    key: "scholar-robe",
    label: "Scholar's Robe",
    piece: "robe",
    basePriceCp: 560,
    defaultMaterialKey: "linen",
    defaultQuality: "Standard",
    summary: "Long robe embroidered with sigils, tailored for lecture halls and libraries.",
    materialKeys: ["linen", "cotton", "silk", "sun-silk"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["sage-insight", "silver-tongue", "restorative-thread", "everwarm"],
  },
  {
    key: "noble-attire",
    label: "Noble Attire",
    piece: "dress",
    basePriceCp: 1280,
    defaultMaterialKey: "silk",
    defaultQuality: "Fine",
    summary: "Courtly ensemble with brocade trim, gemstone clasps, and sweeping sleeves.",
    materialKeys: ["silk", "velvet", "sun-silk", "dragon-thread"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["silver-tongue", "merchant-charm", "restorative-thread", "everwarm"],
  },
  {
    key: "merchant-vest",
    label: "Merchant's Vest",
    piece: "tunic",
    basePriceCp: 780,
    defaultMaterialKey: "linen",
    defaultQuality: "Fine",
    summary: "Layered vest with hidden pockets and reinforced seams for market dealings.",
    materialKeys: ["linen", "cotton", "silk", "leather"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["merchant-charm", "silver-tongue", "sage-insight", "trailblazer"],
  },
  {
    key: "artisan-apron",
    label: "Artisan's Apron",
    piece: "tunic",
    basePriceCp: 460,
    defaultMaterialKey: "hemp",
    defaultQuality: "Standard",
    summary: "Heavy canvas apron with tool loops and scorch-resistant treatment.",
    materialKeys: ["hemp", "cotton", "leather"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["featherstep", "trailblazer", "merchant-charm", "restorative-thread"],
  },
  {
    key: "riding-boots",
    label: "Riding Boots",
    piece: "boots",
    basePriceCp: 540,
    defaultMaterialKey: "leather",
    defaultQuality: "Standard",
    summary: "Knee-high leather boots with brass buckles suited for long saddle days.",
    materialKeys: ["leather", "fur", "dragon-thread"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["featherstep", "windswift", "trailblazer", "everwarm"],
  },
  {
    key: "hunter-gloves",
    label: "Hunter's Gloves",
    piece: "gloves",
    basePriceCp: 420,
    defaultMaterialKey: "leather",
    defaultQuality: "Standard",
    summary: "Soft leather gloves with finger gussets for archery and tracking.",
    materialKeys: ["leather", "fur", "dragon-thread"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["shadowstep", "featherstep", "trailblazer", "merchant-charm"],
  },
  {
    key: "wide-brim-hat",
    label: "Wide-Brim Hat",
    piece: "hat",
    basePriceCp: 260,
    defaultMaterialKey: "wool",
    defaultQuality: "Standard",
    summary: "Felted hat shielding from sun and rain, favoured by guides.",
    materialKeys: ["wool", "cotton", "leather", "sun-silk"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["everwarm", "windswift", "merchant-charm", "trailblazer"],
  },
  {
    key: "silk-sash",
    label: "Silk Sash",
    piece: "belt",
    basePriceCp: 300,
    defaultMaterialKey: "silk",
    defaultQuality: "Fine",
    summary: "Decorative sash used for court or duelling attire with hidden pockets.",
    materialKeys: ["silk", "sun-silk", "dragon-thread", "velvet"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["silver-tongue", "merchant-charm", "sage-insight", "restorative-thread"],
  },
  {
    key: "travel-leggings",
    label: "Travel Leggings",
    piece: "leggings",
    basePriceCp: 380,
    defaultMaterialKey: "hemp",
    defaultQuality: "Standard",
    summary: "Rugged leggings with reinforced knees for caravans and scouts.",
    materialKeys: ["hemp", "cotton", "leather", "fur"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["featherstep", "windswift", "trailblazer", "everwarm"],
  },
  {
    key: "scholar-pouch",
    label: "Scholar's Pouch",
    piece: "accessory",
    basePriceCp: 240,
    defaultMaterialKey: "leather",
    defaultQuality: "Standard",
    summary: "Compact belt pouch lined for inks, notes, and minor curios.",
    materialKeys: ["leather", "hemp", "dragon-thread"],
    qualityKeys: ["Standard", "Fine", "Masterwork"],
    enchantmentKeys: ["sage-insight", "merchant-charm", "restorative-thread", "trailblazer"],
  },
];

const WEAPON_BASELINE_INDEX = new Map(WEAPON_BASELINES.map((baseline) => [baseline.key, baseline]));
const ARMOR_BASELINE_INDEX = new Map(ARMOR_BASELINES.map((baseline) => [baseline.key, baseline]));
const APPAREL_BASELINE_INDEX = new Map(APPAREL_BASELINES.map((baseline) => [baseline.key, baseline]));

const WEAPON_ENCHANTMENT_INDEX = new Map(WEAPON_ENCHANTMENTS.map((entry) => [entry.key, entry]));
const ARMOR_ENCHANTMENT_INDEX = new Map(ARMOR_ENCHANTMENTS.map((entry) => [entry.key, entry]));
const APPAREL_ENCHANTMENT_INDEX = new Map(APPAREL_ENCHANTMENTS.map((entry) => [entry.key, entry]));

function resolveMaterialMultiplier(
  materials: Record<string, MaterialProfile>,
  requested: string | undefined,
  fallback: string,
): number {
  const key = requested ?? fallback;
  const profile = materials[key];
  return profile?.priceMultiplier ?? 1;
}

function resolveQualityMultiplier(
  qualities: Record<string, QualityProfile>,
  requested: string | undefined,
  fallback: string,
): number {
  const key = requested ?? fallback;
  const profile = qualities[key];
  return profile?.priceMultiplier ?? 1;
}

function resolveEnchantmentMultiplier(
  index: Map<string, EnchantmentTemplate>,
  key: string | undefined,
  grade: EnchantmentGrade = "Minor",
): number {
  if (!key) return 1;
  const template = index.get(key);
  if (!template) return 1;
  const detail = template.gradeDetails[grade] ?? template.gradeDetails["Minor"];
  return detail?.priceMultiplier ?? 1;
}

function roundToFive(value: number): number {
  return Math.max(5, Math.round(value / 5) * 5);
}

export function getWeaponBaseline(key: string): WeaponBaseline | undefined {
  return WEAPON_BASELINE_INDEX.get(key);
}

export function getArmorBaseline(key: string): ArmorBaseline | undefined {
  return ARMOR_BASELINE_INDEX.get(key);
}

export function getApparelBaseline(key: string): ApparelBaseline | undefined {
  return APPAREL_BASELINE_INDEX.get(key);
}

export function listWeaponBaselines(family?: WeaponFamily): WeaponBaseline[] {
  if (!family) return [...WEAPON_BASELINES];
  return WEAPON_BASELINES.filter((baseline) => baseline.family === family);
}

export interface WeaponVariantOptions {
  materialKey?: string;
  quality?: WeaponQuality;
  enchantmentKey?: string;
  enchantmentGrade?: EnchantmentGrade;
}

export interface ArmorVariantOptions {
  materialKey?: string;
  quality?: ArmorQuality;
  enchantmentKey?: string;
  enchantmentGrade?: EnchantmentGrade;
}

export interface ApparelVariantOptions {
  materialKey?: string;
  quality?: ApparelQuality;
  enchantmentKey?: string;
  enchantmentGrade?: EnchantmentGrade;
}

export function calculateWeaponVariantPrice(
  key: string,
  options: WeaponVariantOptions = {},
): number | undefined {
  const baseline = getWeaponBaseline(key);
  if (!baseline) return undefined;
  const materialMultiplier = resolveMaterialMultiplier(
    WEAPON_MATERIALS,
    options.materialKey,
    baseline.defaultMaterialKey,
  );
  const qualityMultiplier = resolveQualityMultiplier(
    WEAPON_QUALITIES,
    options.quality,
    baseline.defaultQuality,
  );
  const enchantMultiplier = resolveEnchantmentMultiplier(
    WEAPON_ENCHANTMENT_INDEX,
    options.enchantmentKey,
    options.enchantmentGrade,
  );
  const price = baseline.basePriceCp * materialMultiplier * qualityMultiplier * enchantMultiplier;
  return roundToFive(price);
}

export function calculateArmorVariantPrice(
  key: string,
  options: ArmorVariantOptions = {},
): number | undefined {
  const baseline = getArmorBaseline(key);
  if (!baseline) return undefined;
  const materialMultiplier = resolveMaterialMultiplier(
    ARMOR_MATERIALS,
    options.materialKey,
    baseline.defaultMaterialKey,
  );
  const qualityMultiplier = resolveQualityMultiplier(
    ARMOR_QUALITIES,
    options.quality,
    baseline.defaultQuality,
  );
  const enchantMultiplier = resolveEnchantmentMultiplier(
    ARMOR_ENCHANTMENT_INDEX,
    options.enchantmentKey,
    options.enchantmentGrade,
  );
  const price = baseline.basePriceCp * materialMultiplier * qualityMultiplier * enchantMultiplier;
  return roundToFive(price);
}

export function calculateApparelVariantPrice(
  key: string,
  options: ApparelVariantOptions = {},
): number | undefined {
  const baseline = getApparelBaseline(key);
  if (!baseline) return undefined;
  const materialMultiplier = resolveMaterialMultiplier(
    APPAREL_MATERIALS,
    options.materialKey,
    baseline.defaultMaterialKey,
  );
  const qualityMultiplier = resolveQualityMultiplier(
    APPAREL_QUALITIES,
    options.quality,
    baseline.defaultQuality,
  );
  const enchantMultiplier = resolveEnchantmentMultiplier(
    APPAREL_ENCHANTMENT_INDEX,
    options.enchantmentKey,
    options.enchantmentGrade,
  );
  const price = baseline.basePriceCp * materialMultiplier * qualityMultiplier * enchantMultiplier;
  return roundToFive(price);
}

export function getWeaponEnchantmentDetail(
  key: string,
  grade: EnchantmentGrade = "Minor",
): EnchantmentGradeDetail | undefined {
  const template = WEAPON_ENCHANTMENT_INDEX.get(key);
  return template?.gradeDetails[grade];
}

export function getArmorEnchantmentDetail(
  key: string,
  grade: EnchantmentGrade = "Minor",
): EnchantmentGradeDetail | undefined {
  const template = ARMOR_ENCHANTMENT_INDEX.get(key);
  return template?.gradeDetails[grade];
}

export function getApparelEnchantmentDetail(
  key: string,
  grade: EnchantmentGrade = "Minor",
): EnchantmentGradeDetail | undefined {
  const template = APPAREL_ENCHANTMENT_INDEX.get(key);
  return template?.gradeDetails[grade];
}

