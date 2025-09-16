import {
  ANIMAL_BYPRODUCT_MICRO,
  ANIMAL_FEEDING_STYLES,
  BASE,
  CAT,
  DIET_FALLBACK,
  DIET_MIDLINES,
  FEEDING_HINTS,
  GROWTH_MIDLINES,
  GROWTH_TO_THEMES,
  HABITAT_TAXON_MIDLINES,
  HABITAT_TO_THEMES,
  HAB_OVERLAY,
  OPENER_THEMES,
  OPENER_THEMES_ANIMAL,
  OPENER_THEMES_PLANT,
  PhraseLayer,
  PLANT_BYPRODUCT_MICRO,
  REGION_OVERLAY,
  REGION_TAXON_MIDLINES,
  REGION_TO_THEMES,
  TAXON_MIDLINES,
  TAXON_TO_THEMES,
} from "./descriptionBanks";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = Math.imul(31, hash) + str.charCodeAt(i);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  return function mulberry() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickDistinct(options: string[] = [], rnd: () => number, used: Set<string>): string {
  const filtered = options.filter((opt) => opt && !used.has(opt));
  const pool = filtered.length ? filtered : options;
  if (!pool.length) return "";
  const choice = pool[Math.floor(rnd() * pool.length)] ?? "";
  used.add(choice);
  return choice;
}

type AnyBank = Record<string, string[]>;

function mergeBanks<T extends AnyBank>(base: T, layers: Array<PhraseLayer | undefined>): T & AnyBank {
  const result: AnyBank = {};
  const keys = new Set<string>(Object.keys(base));
  for (const layer of layers) {
    if (!layer) continue;
    for (const key of Object.keys(layer)) {
      keys.add(key);
    }
  }
  for (const key of keys) {
    const combined: string[] = [];
    const seen = new Set<string>();
    const baseValues = (base as AnyBank)[key] ?? [];
    for (const value of baseValues) {
      if (!seen.has(value)) {
        combined.push(value);
        seen.add(value);
      }
    }
    for (const layer of layers) {
      if (!layer) continue;
      const additions = layer[key];
      if (!additions) continue;
      for (const item of additions) {
        if (!seen.has(item)) {
          combined.push(item);
          seen.add(item);
        }
      }
    }
    result[key] = combined;
  }
  return result as T & AnyBank;
}

function collectOpenersByContext(
  regions: string[] = [],
  habitats: string[] = [],
  taxonGroup?: string,
  growthForm?: string,
): string[] {
  const themes = new Set<string>();
  for (const region of regions) {
    (REGION_TO_THEMES[region as keyof typeof REGION_TO_THEMES] || []).forEach((theme) => themes.add(theme));
  }
  for (const habitat of habitats) {
    (HABITAT_TO_THEMES[habitat as keyof typeof HABITAT_TO_THEMES] || []).forEach((theme) => themes.add(theme));
  }

  const pool: string[] = [];
  for (const theme of themes) {
    const arr = OPENER_THEMES[theme];
    if (arr && arr.length) {
      pool.push(...arr);
    }
  }

  const tg = taxonGroup?.toLowerCase();
  if (tg) {
    const tgThemes = TAXON_TO_THEMES[tg] || [];
    for (const theme of tgThemes) {
      const arr = OPENER_THEMES_ANIMAL[theme];
      if (arr && arr.length) {
        pool.push(...arr);
      }
    }
  }

  const gf = growthForm?.toLowerCase();
  if (gf) {
    const gfThemes = GROWTH_TO_THEMES[gf] || [];
    for (const theme of gfThemes) {
      const arr = OPENER_THEMES_PLANT[theme];
      if (arr && arr.length) {
        pool.push(...arr);
      }
    }
  }

  return pool.length ? pool : BASE.openers;
}

function buildIntro(subject: string, rnd: () => number, used: Set<string>, B: typeof BASE, openerPool: string[]): string {
  const opener = pickDistinct(openerPool, rnd, used);
  const realm = pickDistinct(B.realms, rnd, used);
  const mood = pickDistinct(B.moods, rnd, used);
  const sparkle = pickDistinct(B.sparkles, rnd, used);
  const appo = pickDistinct(B.appositives, rnd, used);

  return `${opener}, ${realm}, there is found ${appo}—${subject}—${pickDistinct(
    [
      `set ${mood} and ${sparkle} to the knowing eye`,
      `standing ${mood}, ${sparkle} to those who attend`,
      `kept ${mood}, ${sparkle} where few think to look`,
    ],
    rnd,
    used,
  )}.`;
}

function randomChoice<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)] ?? arr[0];
}

function pick<T>(arr: T[], rnd: () => number): T {
  return randomChoice(arr, rnd);
}

function humanize(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/_/g, " ");
}

function cap(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatList(list: string[]): string {
  const items = list.map((item) => item.trim()).filter(Boolean);
  if (!items.length) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function joinAnd(list: string[]): string {
  return formatList(list);
}

function describeList(values: string[] | undefined, singular: string, plural: string): string {
  if (!values || !values.length) return `the known ${plural}`;
  const formatted = formatList(values.map((value) => humanize(value)));
  const label = values.length === 1 ? singular : plural;
  return `the ${formatted} ${label}`;
}

function ensurePeriod(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function combineSentences(lines: string[]): string {
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map(ensurePeriod)
    .join(" ")
    .replace(/\s+/g, " ");
}

type WeaponQuality = "Standard" | "Fine" | "Masterwork";

interface WeaponLike {
  name: string;
  description: string;
  region?: string;
  fightingStyle?: string;
  size?: string;
}

function describeWeaponQuality(weapon: WeaponLike, quality: WeaponQuality): string {
  const region = weapon.region ? `from ${weapon.region}` : "from renowned smiths";
  const sizeNote = weapon.size ? weapon.size.toLowerCase() : "balanced";
  switch (quality) {
    case "Fine":
      return `Fine finishing ${region} dresses every fitting and coaxes a livelier balance out of its ${sizeNote} frame.`;
    case "Masterwork":
      return `Masterwork artisans ${region} layer select steels, enrich the fittings, and tune the balance to heirloom precision.`;
    default:
      return `Trusted ${region}, it proves dependable steel sized for ${sizeNote} engagements.`;
  }
}

export function generateWeaponDescription(weapon: WeaponLike, quality: WeaponQuality): string {
  const displayName = quality === "Standard" ? weapon.name : `${quality} ${weapon.name}`;
  const baseLine = weapon.description ? ensurePeriod(weapon.description) : "";
  const qualityLine = describeWeaponQuality(weapon, quality);
  const styleLine = weapon.fightingStyle
    ? `Favoured for ${weapon.fightingStyle.toLowerCase()}.`
    : "";
  return combineSentences([`${displayName}.`, baseLine, qualityLine, styleLine]);
}

function animalMicroFlavor(taxonGroup?: string): string {
  switch ((taxonGroup || "").toLowerCase()) {
    case "bird":
      return "Feather and hollow-bone make it debtor to the wind.";
    case "reptile":
      return "Scale and stillness are its teachers, and sun its steward.";
    case "amphibian":
      return "A double citizenship of water and land keeps its counsel damp.";
    case "fish":
      return "Fins write its errands where light turns to ledger.";
    case "mammal":
      return "Warm blood bargains boldly with the weather.";
    case "insect":
      return "Industry is its liturgy, brief but devout.";
    case "crustacean":
      return "A shell is its grammar; tide the patient schoolmaster.";
    case "mollusk":
      return "It wears patience as armor and leaves script upon stone.";
    case "annelid":
      return "It stitches soil to root with unshowy thread.";
    default:
      return "";
  }
}

function plantMicroFlavor(growthForm?: string): string {
  switch ((growthForm || "").toLowerCase()) {
    case "tree":
      return "It keeps time in rings and shadows.";
    case "shrub":
      return "It speaks hedge-law in thorn and leaf.";
    case "herb":
      return "Its stature is small, its charity considerable.";
    case "vine":
      return "Climbing is its argument with gravity.";
    case "grass":
      return "It writes plains in strokes the wind can read.";
    case "fungus":
    case "mushroom":
      return "It edits the fallen into food for rising things.";
    case "lichen":
      return "Stone and bark are its slow partnerships.";
    case "algae":
      return "Thin as breath, it green-tints the water’s thought.";
    case "seaweed":
      return "It keeps a calendar by moon and fathom.";
    default:
      return "";
  }
}

function pickMidlineAnimal(taxon?: string, rnd?: () => number, which: "p1" | "p3" = "p1"): string {
  const key = (taxon || "").toLowerCase();
  const bank = (TAXON_MIDLINES as Record<string, { p1: string[]; p3: string[] } | undefined>)[key];
  if (!bank) return "";
  const arr = bank[which] || [];
  if (!arr.length) return "";
  const picker = rnd || Math.random;
  return arr[Math.floor(picker() * arr.length)] ?? "";
}

function pickMidlinePlant(form?: string, rnd?: () => number, which: "p1" | "p3" = "p1"): string {
  const key = (form || "").toLowerCase();
  const bank = (GROWTH_MIDLINES as Record<string, { p1: string[]; p3: string[] } | undefined>)[key];
  if (!bank) return "";
  const arr = bank[which] || [];
  if (!arr.length) return "";
  const picker = rnd || Math.random;
  return arr[Math.floor(picker() * arr.length)] ?? "";
}

function pickDietMidline(style: string, rnd: () => number): string {
  const arr = DIET_MIDLINES[style] || [];
  if (!arr.length) return "";
  return arr[Math.floor(rnd() * arr.length)] ?? "";
}

function pickHabitatMidline(habitats: string[] = [], taxonOrForm?: string, rnd?: () => number): string {
  const key = (taxonOrForm || "").toLowerCase();
  const pool: string[] = [];
  for (const habitat of habitats) {
    const bank = HABITAT_TAXON_MIDLINES[habitat];
    if (!bank) continue;
    if (key && bank[key]) {
      pool.push(...bank[key]);
    }
    if (bank.any) {
      pool.push(...bank.any);
    }
  }
  if (!pool.length) return "";
  const picker = rnd || Math.random;
  return pool[Math.floor(picker() * pool.length)] ?? "";
}

function pickRegionMidline(
  regions: string[] = [],
  taxonOrForms?: string | Array<string | undefined>,
  rnd?: () => number,
): string {
  const keys = Array.isArray(taxonOrForms)
    ? taxonOrForms
    : typeof taxonOrForms === "string"
    ? [taxonOrForms]
    : [];
  const normalized = keys
    .map((value) => (value || "").toLowerCase())
    .filter((value) => Boolean(value));

  const pool: string[] = [];
  for (const region of regions) {
    const bank = REGION_TAXON_MIDLINES[region];
    if (!bank) continue;
    for (const key of normalized) {
      const lines = bank[key];
      if (lines && lines.length) {
        pool.push(...lines);
      }
    }
    if (bank.any) {
      pool.push(...bank.any);
    }
  }

  if (!pool.length) return "";
  const picker = rnd || Math.random;
  return pool[Math.floor(picker() * pool.length)] ?? "";
}

function classifyFeedingStyle(diet: string[] = [], foodSources: string[] = []): string {
  const fs = foodSources.join(" ").toLowerCase();
  for (const hint of FEEDING_HINTS) {
    if (hint.keywords.some((keyword) => fs.includes(keyword))) {
      return hint.tag;
    }
  }
  const d = (diet[0] || "").toLowerCase();
  return DIET_FALLBACK[d] || "omnivore";
}

function gatherNames(...sources: unknown[]): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const source of sources) {
    if (Array.isArray(source)) {
      for (const value of source) {
        if (typeof value === "string") {
          const trimmed = value.trim();
          if (trimmed && !seen.has(trimmed)) {
            seen.add(trimmed);
            names.push(trimmed);
          }
        }
      }
    } else if (typeof source === "string") {
      const trimmed = source.trim();
      if (trimmed && !seen.has(trimmed)) {
        seen.add(trimmed);
        names.push(trimmed);
      }
    }
  }
  return names;
}

function animalAltNamesLine(animal: any): string {
  const names = gatherNames(animal?.alternate_names, animal?.alt_names);
  if (!names.length) return "";
  return `Among far-flung folk it is hailed as ${formatList(names)}.`;
}

function plantAltNamesLine(plant: any): string {
  const names = gatherNames(plant?.alt_names, plant?.alternate_names);
  if (!names.length) return "";
  return `In different tongues it is known as ${formatList(names)}.`;
}

function dietLine(
  diet: string[] = [],
  foodSources: string[] = [],
  rnd: () => number,
  used: Set<string>,
  B = BASE,
  taxonGroup?: string,
): string {
  if (!diet.length && !foodSources.length) return "";

  const style = classifyFeedingStyle(diet, foodSources);
  const micro = ANIMAL_FEEDING_STYLES[style] || ANIMAL_FEEDING_STYLES.omnivore;
  const mid = pickDietMidline(style, rnd);

  const verb = pickDistinct(micro.verbs, rnd, used) || randomChoice(micro.verbs, rnd);
  const linkerPool = (B.linkers && B.linkers.length ? B.linkers : BASE.linkers) || ["Thus"];
  const linker = pickDistinct(linkerPool, rnd, used) || linkerPool[0];
  const flourish = pickDistinct(micro.phrases, rnd, used) || randomChoice(micro.phrases, rnd);

  const cleanedSources = foodSources
    .filter((src) => typeof src === "string" && src.trim().length > 0)
    .map((src) => humanize(src));
  const sources = cleanedSources.length
    ? joinAnd(cleanedSources.slice(0, 6))
    : pick(
        [
          "small creatures and what the season spills",
          "greens, grains, and the odd creeping thing",
          "fish, fowl, and field-crumb alike",
        ],
        rnd,
      );

  const d = diet.map((entry) => entry.toLowerCase());
  const gloss = d.includes("carnivore")
    ? "a taker of flesh by old warrant"
    : d.includes("herbivore")
    ? "a grazer and gleaner by steady habit"
    : "a chartered opportunist of field and fen";

  const tail = mid ? ` ${mid}` : "";
  return `${cap(verb)} ${sources}; ${linker.toLowerCase()} it is ${gloss}, ${flourish}.${tail}`;
}

const RISK_PHRASES: Record<string, string> = {
  none: "yet offers little peril to the heedful",
  low: "yet seldom more than a mild peril to the unwary",
  moderate: "and can prove a stern lesson to the careless",
  high: "and stands a grave peril to those who trespass its patience",
  extreme: "and spells mortal danger for any who misstep",
};

function lowercaseFirst(text: string | undefined): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

function tidyPreparation(note: string | undefined): string {
  if (!note) return "";
  let value = note.trim().replace(/\.$/, "");
  value = value.replace(/^must be\s+/i, "");
  value = value.replace(/^should be\s+/i, "");
  value = value.replace(/^to be\s+/i, "");
  value = value.replace(/^be\s+/i, "");
  if (!value) return "handled with care";
  return lowercaseFirst(value);
}

function describeAnimalRange(regions: string[] | undefined, habitats: string[] | undefined, rnd: () => number): string {
  const regionText = describeList(regions, "realm", "realms");
  const habitatText = describeList(habitats, "haunt", "haunts");
  const templates = [
    `It ranges through ${regionText}, finding kinship in ${habitatText}.`,
    `Its wandering years are spent across ${regionText}, where ${habitatText} answer its call.`,
    `Within ${regionText} it keeps its courts, most at ease amid ${habitatText}.`,
  ];
  return randomChoice(templates, rnd);
}

function describeDomestication(animal: any, rnd: () => number): string {
  const dom = animal.domestication || {};
  if (dom.domesticated) {
    const traits: string[] = [];
    if (dom.trainable) traits.push("answering to word and whistle");
    if (dom.draft_or_mount) traits.push("lending its back to harness or saddle");
    if (dom.notes) traits.push(lowercaseFirst(dom.notes.replace(/\.$/, "")));
    if (traits.length) {
      const traitText = formatList(traits);
      const templates = [
        `Long has it stood beside hearth and field, ${traitText}.`,
        `It suffers the company of folk, ${traitText} as seasons demand.`,
      ];
      return randomChoice(templates, rnd);
    }
    const templates = [
      "Long has it stood beside hearth and field, content under careful hands.",
      "It abides the stewardship of folk, finding work beside their fires.",
    ];
    return randomChoice(templates, rnd);
  }
  const templates = [
    "No halter claims it; it keeps its own counsel beneath open sky.",
    "It bends to no yoke, thriving on the liberties of the untamed.",
    "Wild-born and willful, it prospers without the promises of the hearth.",
  ];
  return randomChoice(templates, rnd);
}

function describeBehavior(animal: any, rnd: () => number): string {
  const behavior = animal.behavior || {};
  const temper = behavior.aggressive
    ? randomChoice(["quick to wrath when pressed", "prone to fury if crossed", "swift to bare its defiance"], rnd)
    : randomChoice(["gentle of temper", "mild in its daily rounds", "content to move with quiet tread"], rnd);
  const domain = behavior.territorial
    ? randomChoice(["guarding the bounds it marks", "staunch in the defense of chosen ground", "keeping a strict watch over its demesne"], rnd)
    : randomChoice(["wandering without sworn demesne", "ranging wide without strict claim", "content to roam unbound"], rnd);
  const risk = RISK_PHRASES[behavior.risk_to_humans as keyof typeof RISK_PHRASES] ||
    "and keeps its own counsel toward those who trespass";
  const extras: string[] = [];
  if (behavior.nocturnal) extras.push("most wakeful beneath the stars");
  if (behavior.migratory) extras.push("given to follow the great seasonal roads");
  let sentence = `Temper-wise it is ${temper}, ${domain}, ${risk}.`;
  if (extras.length) {
    sentence += ` It is ${formatList(extras)}.`;
  }
  return sentence;
}

function describeEdibility(animal: any, rnd: () => number): string {
  const edibility = animal.edibility || {};
  if (edibility.edible) {
    const parts = Array.isArray(edibility.parts) && edibility.parts.length
      ? formatList(edibility.parts.map((part: string) => humanize(part)))
      : "select portions";
    const prep = tidyPreparation(edibility.preparation_notes);
    const templates = [
      `For those who dare the harvest, the ${parts} are taken, mindful they must be ${prep}.`,
      `Its ${parts} may grace the table, provided they are ${prep}.`,
      `Cooks of steady hand prepare its ${parts}, ensuring they are ${prep}.`,
    ];
    const base = randomChoice(templates, rnd);
    const taboo = edibility.taboo_or_restricted
      ? " In some circles its flesh remains bound by taboo, offered only in extremity."
      : "";
    return base + taboo;
  }
  const templates = [
    "Its flesh finds no place at the table, and folk leave it to the cycles of the wild.",
    "None seek it for feasting; its flesh is shunned save by desperate hunger.",
    "It is counted unfit for the pot, better admired than tasted.",
  ];
  return randomChoice(templates, rnd);
}

function byproductLine(
  byproducts: any[] | undefined,
  rnd: () => number,
  used: Set<string>,
  taxonGroup?: string,
  growthForm?: string,
): string {
  const listed = (byproducts || [])
    .filter((bp) => bp && typeof bp.type === "string" && bp.type.trim().length > 0)
    .map((bp) => humanize(bp.type));

  let micro: string[] = [];
  if (taxonGroup && ANIMAL_BYPRODUCT_MICRO[taxonGroup.toLowerCase()]) {
    micro = ANIMAL_BYPRODUCT_MICRO[taxonGroup.toLowerCase()];
  }
  if (growthForm && PLANT_BYPRODUCT_MICRO[growthForm.toLowerCase()]) {
    micro = PLANT_BYPRODUCT_MICRO[growthForm.toLowerCase()];
  }

  const items = listed.length ? listed : micro;
  if (!items.length) return "";

  const note = !listed.length && micro.length ? `—${joinAnd(seededSample(micro, rnd, 2))}—` : "";

  return `From it are taken ${joinAnd(items.slice(0, 6))}${note}, set to use by prudent hands.`;
}

function seededSample<T>(arr: T[], rnd: () => number, k = 2): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.max(0, Math.min(k, copy.length)));
}

function describeDisease(animal: any, rnd: () => number): string {
  if (!Array.isArray(animal.disease_risks) || !animal.disease_risks.length) return "";
  const list = formatList(animal.disease_risks.map((risk: string) => humanize(risk)));
  const templates = [
    `Wise keepers mind the threat of ${list}, watching for the slightest sign.`,
    `Old hands warn of ${list}, keeping remedies close at hand.`,
  ];
  return randomChoice(templates, rnd);
}

function toLowerPhrase(value: string | undefined): string {
  return value ? value.trim().toLowerCase() : "";
}

function describePlantRange(regions: string[] | undefined, habitats: string[] | undefined, rnd: () => number): string {
  const regionText = describeList(regions, "realm", "realms");
  const habitatText = describeList(habitats, "niche", "niches");
  const templates = [
    `It roots within ${habitatText}, throughout ${regionText}.`,
    `Across ${regionText} it settles into ${habitatText}, steady as the turning year.`,
    `In ${regionText} it finds footing, favouring ${habitatText}.`,
  ];
  return randomChoice(templates, rnd);
}

function describeCultivation(plant: any, rnd: () => number): string {
  const form = humanize(plant.growth_form) || "plant";
  if (plant.cultivated) {
    const templates = [
      `Tilled rows welcome this ${form}, for it yields kindly under patient tools.`,
      `Gardens and fields alike prize this ${form}, which answers well to steady hands.`,
      `It suffers pruning and tether, a ${form} that thrives beneath careful stewardship.`,
    ];
    return randomChoice(templates, rnd);
  }
  const templates = [
    `It springs up of its own accord, a ${form} owing little to human bidding.`,
    `In the wild it finds its footing, a ${form} that answers only to season and rain.`,
    `Untamed by plough or trellis, this ${form} keeps to the rhythms of the open land.`,
  ];
  return randomChoice(templates, rnd);
}

function describePlantEdibility(plant: any, rnd: () => number): string {
  if (plant.edible) {
    const parts = Array.isArray(plant.edible_parts) && plant.edible_parts.length
      ? formatList(plant.edible_parts.map((part: string) => humanize(part)))
      : "select parts";
    const uses = Array.isArray(plant.culinary_uses) && plant.culinary_uses.length
      ? formatList(plant.culinary_uses.map((use: string) => humanize(use).toLowerCase()))
      : "simple fare for pot or oven";
    const templates = [
      `Its ${parts} nourish the folk, turning them toward ${uses}.`,
      `Cooks take its ${parts}, setting them to ${uses} when stores run thin.`,
      `It lends its ${parts} to the table, weaving ${uses} through the common pot.`,
    ];
    return randomChoice(templates, rnd);
  }
  const templates = [
    "Though fair to behold, it lends nothing to the table save ornament.",
    "It is kept more for lore than for larder, its tissues unfit for dining.",
    "The cautious leave it untouched at supper, letting it serve the wild alone.",
  ];
  return randomChoice(templates, rnd);
}

function describeMedicinal(plant: any, rnd: () => number): string {
  const medicinalParts = Array.isArray(plant.byproducts)
    ? plant.byproducts.filter((bp: any) => bp.type === "medicine")
    : [];
  const detail = medicinalParts.length
    ? formatList(medicinalParts.map((bp: any) => {
        const type = humanize(bp.type);
        const note = bp.notes ? ` (${bp.notes.trim().replace(/\.$/, "")})` : "";
        return `${type}${note}`;
      }))
    : "remedies enough to stock a humble infirmary";
  const templates = [
    `Apothecaries keep it close, drawing ${detail} from its keeping.`,
    `Physickers make note of it, for ${detail} serve in their cupboards.`,
  ];
  return randomChoice(templates, rnd);
}

function describeToxicity(plant: any, rnd: () => number): string {
  const note = plant.toxicity_notes ? lowercaseFirst(plant.toxicity_notes.replace(/\.$/, "")) : "";
  const templates = [
    `Yet there is peril in mishandling it${note ? `; folk remember that ${note}` : ""}.`,
    `Still, wise folk treat it with respect${note ? `, knowing ${note}` : ""}.`,
  ];
  return randomChoice(templates, rnd);
}

function describePlantSeasonality(plant: any, rnd: () => number): string {
  const notes: string[] = [];
  if (plant.seasonality) notes.push(`it wakens in ${toLowerPhrase(plant.seasonality)}`);
  if (plant.sowing_season) notes.push(`seed goes to ground in ${toLowerPhrase(plant.sowing_season)}`);
  if (plant.harvest_season) notes.push(`harvest comes in ${toLowerPhrase(plant.harvest_season)}`);
  if (plant.growth_duration) notes.push(`full growth arrives ${toLowerPhrase(plant.growth_duration)}`);
  if (!notes.length) return "";
  const templates = [
    `Farm ledgers attest that ${formatList(notes)}.`,
    `Those who mind the seasons note that ${formatList(notes)}.`,
  ];
  return randomChoice(templates, rnd);
}

function describeCompanions(plant: any, rnd: () => number): string {
  if (!Array.isArray(plant.companion_crops) || !plant.companion_crops.length) return "";
  const list = formatList(plant.companion_crops.map((crop: string) => humanize(crop)));
  const templates = [
    `It keeps good company with ${list}, each lending strength to the other.`,
    `Gardeners sow it beside ${list}, trusting in the harmony it brings.`,
  ];
  return randomChoice(templates, rnd);
}

function describeRotation(plant: any, rnd: () => number): string {
  const notes: string[] = [];
  if (plant.rotation_relationships) notes.push(lowercaseFirst(plant.rotation_relationships.replace(/\.$/, "")));
  if (plant.fallow_notes) notes.push(lowercaseFirst(plant.fallow_notes.replace(/\.$/, "")));
  if (!notes.length) return "";
  const templates = [
    `Stewards plan their rotations with this in mind, knowing ${formatList(notes)}.`,
    `Field-wardens counsel that ${formatList(notes)}, so the soil keeps its vigor.`,
  ];
  return randomChoice(templates, rnd);
}

function describeForaging(plant: any, rnd: () => number): string {
  if (!plant.foraging_notes) return "";
  const note = lowercaseFirst(plant.foraging_notes.replace(/\.$/, ""));
  const templates = [
    `Foragers whisper reminders that ${note}.`,
    `Wanderers note that ${note}, lest they misstep.`,
  ];
  return randomChoice(templates, rnd);
}

export function generateAnimalNarrative(animal: any, seed = Date.now()): string {
  const subject = animal.common_name || "This creature";
  const rnd = mulberry32((seed ^ hashString(subject) ^ 0xa11a) >>> 0);
  const used = new Set<string>();

  const regionLayers = (animal.regions || [])
    .map((region: string) => REGION_OVERLAY[region as keyof typeof REGION_OVERLAY])
    .filter(Boolean);
  const habitatLayers = (animal.habitats || [])
    .map((habitat: string) => HAB_OVERLAY[habitat as keyof typeof HAB_OVERLAY])
    .filter(Boolean);

  const B = mergeBanks(BASE, [...regionLayers, ...habitatLayers]);
  const A = mergeBanks({ ...CAT.animal, ...CAT.fish }, [...regionLayers, ...habitatLayers]);
  const openerPool = collectOpenersByContext(animal.regions, animal.habitats, animal.taxon_group);
  const intro = buildIntro(subject, rnd, used, B, openerPool);

  const lines: string[] = [intro];
  const midP1 = pickMidlineAnimal(animal.taxon_group, rnd, "p1");
  const midRegP1 = pickRegionMidline(animal.regions, animal.taxon_group, rnd);
  const midHabP1 = pickHabitatMidline(animal.habitats, animal.taxon_group, rnd);
  const firstParagraph = combineSentences([
    describeAnimalRange(animal.regions, animal.habitats, rnd),
    animalMicroFlavor(animal.taxon_group),
    midP1,
    midRegP1,
    midHabP1,
    animalAltNamesLine(animal),
  ]);
  if (firstParagraph) {
    lines.push(firstParagraph);
  }

  const diet = dietLine(animal.diet, animal.food_sources, rnd, used, B, animal.taxon_group);
  if (diet) {
    lines.push(diet);
  }

  const dom = describeDomestication(animal, rnd);
  const behavior = describeBehavior(animal, rnd);
  const midP3 = pickMidlineAnimal(animal.taxon_group, rnd, "p3");
  const edibility = describeEdibility(animal, rnd);
  const thirdParagraph = combineSentences([dom, behavior, midP3, edibility]);
  if (thirdParagraph) {
    lines.push(thirdParagraph);
  }
  const byproducts = byproductLine(animal.byproducts, rnd, used, animal.taxon_group, undefined);
  if (byproducts) lines.push(byproducts);
  const disease = describeDisease(animal, rnd);
  if (disease) {
    lines.push(disease);
  }

  const closers = (A.closers?.length ? A.closers : B.closers) ?? [];
  if (closers.length) {
    lines.push(pickDistinct(closers, rnd, used));
  }

  return combineSentences(lines);
}

export function generatePlantNarrative(plant: any, seed = Date.now()): string {
  const subject = plant.common_name || "This plant";
  const rnd = mulberry32((seed ^ hashString(subject) ^ 0xb10c) >>> 0);
  const used = new Set<string>();

  const regionLayers = (plant.regions || [])
    .map((region: string) => REGION_OVERLAY[region as keyof typeof REGION_OVERLAY])
    .filter(Boolean);
  const habitatLayers = (plant.habitats || [])
    .map((habitat: string) => HAB_OVERLAY[habitat as keyof typeof HAB_OVERLAY])
    .filter(Boolean);

  const B = mergeBanks(BASE, [...regionLayers, ...habitatLayers]);
  const P = mergeBanks(CAT.plant, [...regionLayers, ...habitatLayers]);
  const openerPool = collectOpenersByContext(plant.regions, plant.habitats, undefined, plant.growth_form);
  const intro = buildIntro(subject, rnd, used, B, openerPool);

  const lines: string[] = [intro];
  const midP1 = pickMidlinePlant(plant.growth_form, rnd, "p1");
  const midRegP1 = pickRegionMidline(plant.regions, [plant.growth_form, "plant"], rnd);
  const midHabP1 = pickHabitatMidline(plant.habitats, plant.growth_form, rnd);
  const firstParagraph = combineSentences([
    describePlantRange(plant.regions, plant.habitats, rnd),
    plantMicroFlavor(plant.growth_form),
    midP1,
    midRegP1,
    midHabP1,
    plantAltNamesLine(plant),
  ]);
  if (firstParagraph) {
    lines.push(firstParagraph);
  }

  const cultivation = describeCultivation(plant, rnd);
  const edibility = describePlantEdibility(plant, rnd);
  const medicinal = plant.medicinal ? describeMedicinal(plant, rnd) : "";
  const toxicity = plant.toxic ? describeToxicity(plant, rnd) : "";
  const secondParagraph = combineSentences([cultivation, edibility, medicinal, toxicity]);
  if (secondParagraph) {
    lines.push(secondParagraph);
  }

  const byproducts = byproductLine(plant.byproducts, rnd, used, undefined, plant.growth_form);
  if (byproducts) {
    lines.push(byproducts);
  }

  const seasonality = describePlantSeasonality(plant, rnd);
  const companions = describeCompanions(plant, rnd);
  const rotation = describeRotation(plant, rnd);
  const foraging = describeForaging(plant, rnd);
  const midP3 = pickMidlinePlant(plant.growth_form, rnd, "p3");
  const thirdParagraph = combineSentences([seasonality, midP3, companions, rotation, foraging]);
  if (thirdParagraph) {
    lines.push(thirdParagraph);
  }

  const closers = (P.closers?.length ? P.closers : B.closers) ?? [];
  if (closers.length) {
    lines.push(pickDistinct(closers, rnd, used));
  }

  return combineSentences(lines);
}

