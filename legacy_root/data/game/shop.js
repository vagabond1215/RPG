import { getBusinessProfileByName } from "./buildings.js";
import { computePrice, roundMoney } from "../economy/regional_pricing.js";

let economyItemsPromise = null;

let regionPolicyPromise = null;
let armoryModulePromise = null;

async function readEconomyItemsFromFs() {
  if (typeof process === "undefined" || !process?.versions?.node) return [];
  try {
    const fs = await import("fs/promises");
    const url = new URL("../economy/items.json", import.meta.url);
    const text = await fs.readFile(url, "utf8");
    if (!text) return [];
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return looseParseEconomyItems(text);
    }
  } catch (err) {
    return [];
  }
}

async function fetchEconomyItemsViaFetch() {
  if (typeof fetch !== "function") return null;
  try {
    const res = await fetch("data/economy/items.json");
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return [];
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return looseParseEconomyItems(text);
    }
  } catch (err) {
    return null;
  }
}

function looseParseEconomyItems(text) {
  const lines = text.split(/\r?\n/);
  const items = [];
  let current = null;
  let arrayKey = null;
  let arrayBuffer = "";

  function flushArray() {
    if (arrayKey && current) {
      const raw = arrayBuffer.trim().replace(/,$/, "");
      try {
        current[arrayKey] = JSON.parse(raw);
      } catch (err) {
        current[arrayKey] = [];
      }
    }
    arrayKey = null;
    arrayBuffer = "";
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === "[" || line === "]" || line === "{" || line === "}" || line === "},") continue;

    if (arrayKey) {
      arrayBuffer += line;
      if (line.endsWith("]") || line.endsWith("],")) {
        flushArray();
      } else {
        arrayBuffer += "\n";
      }
      continue;
    }

    const match = line.match(/^"([^\"]+)":\s*(.+)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2];

    if (key === "category_key" && current && Object.keys(current).length) {
      flushArray();
      items.push(current);
      current = {};
    }

    if (!current) current = {};

    if (value.endsWith(",")) value = value.slice(0, -1).trim();

    if (value.startsWith("[") && !value.endsWith("]")) {
      arrayKey = key;
      arrayBuffer = value + "\n";
      continue;
    }

    current[key] = parseLooseValue(value);
  }

  if (arrayKey) flushArray();
  if (current && Object.keys(current).length) items.push(current);
  return items;
}

function parseLooseValue(value) {
  if (value === "null") return null;
  if (value === "true" || value === "false") return value === "true";
  if (value.startsWith("[") || value.startsWith("{")) {
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  }
  if (value.startsWith("\"") && value.endsWith("\"")) {
    try {
      return JSON.parse(value);
    } catch (err) {
      return value.slice(1, -1);
    }
  }
  const num = Number(value);
  return Number.isNaN(num) ? value : num;
}

async function loadEconomyItems() {
  if (!economyItemsPromise) {
    economyItemsPromise = (async () => {
      const viaFetch = await fetchEconomyItemsViaFetch();
      if (viaFetch !== null) return viaFetch;
      return readEconomyItemsFromFs();
    })();
  }
  return economyItemsPromise;
}

async function readRegionPolicyFromFs() {
  if (typeof process === "undefined" || !process?.versions?.node) return {};
  try {
    const fs = await import("fs/promises");
    const url = new URL("../game/region_policy.json", import.meta.url);
    const text = await fs.readFile(url, "utf8");
    if (!text) return {};
    const parsed = JSON.parse(text);
    return normalizeRegionPolicy(parsed);
  } catch (err) {
    return {};
  }
}

async function fetchRegionPolicyViaFetch() {
  if (typeof fetch !== "function") return null;
  try {
    const res = await fetch("data/game/region_policy.json");
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return {};
    const parsed = JSON.parse(text);
    return normalizeRegionPolicy(parsed);
  } catch (err) {
    return null;
  }
}

function normalizeRegionPolicy(value) {
  if (!Array.isArray(value)) return {};
  return value.reduce((map, entry) => {
    if (!entry || !entry.biome) return map;
    const key = String(entry.biome).trim().toLowerCase();
    if (!key) return map;
    map[key] = entry;
    return map;
  }, {});
}

async function loadRegionPolicy() {
  if (!regionPolicyPromise) {
    regionPolicyPromise = (async () => {
      const viaFetch = await fetchRegionPolicyViaFetch();
      if (viaFetch !== null) return viaFetch;
      return readRegionPolicyFromFs();
    })();
  }
  return regionPolicyPromise;
}

async function loadArmoryModule() {
  if (!armoryModulePromise) {
    armoryModulePromise = (async () => {
      try {
        return await import("./armory.ts");
      } catch (errTs) {
        try {
          return await import("./armory.js");
        } catch (errJs) {
          return null;
        }
      }
    })();
  }
  return armoryModulePromise;
}

const CATEGORY_ALIASES = {
  Produce: ["Produce"],
  FoodDrink: ["FoodDrink", "Dairy", "Confectionery", "Beverages", "Seafood", "WildGame", "SpicesHerbs"],
  "Food & Drink": ["FoodDrink", "Dairy", "Confectionery", "Beverages", "Seafood", "WildGame", "SpicesHerbs"],
  Beverages: ["Beverages", "FoodDrink"],
  Tools: ["Tools"],
  Weapons: ["Weapons"],
  Armor: ["Armor"],
  Clothing: ["Clothing"],
  Textiles: ["Textiles"],
  Leatherworking: ["Clothing", "Accessories"],
  Reagents: ["Reagents", "Alchemy", "Foraged", "SpicesHerbs"],
  BooksMaps: ["BooksMaps", "Stationery"],
  "Books & Maps": ["BooksMaps", "Stationery"],
  Glassware: ["CeramicsGlass", "Lighting"],
  Gems: ["Accessories"],
  Metals: ["Metals", "Building"],
  Wood: ["Building"],
  Stone: ["Building"],
  Ship: ["ShipSupplies", "Transport"],
  Livestock: ["LivestockMeat", "Animals"],
  Services: ["Services"],
  "Adventuring Gear": ["Tools", "Accessories", "Leisure", "Transport"],
  Crafts: ["Accessories", "CeramicsGlass", "Furniture"],
  "Raw Materials": ["Building", "Metals", "LivestockMeat", "Foraged", "Produce"],
  "Luxury Goods": ["Accessories", "CeramicsGlass", "Leisure", "Confectionery", "Services"]
};

const LABEL_ALIASES = {
  BooksMaps: "Books & Maps",
  FoodDrink: "Food & Drink",
  Ship: "Ship Fittings",
  Livestock: "Livestock Goods",
  Services: "Services"
};

const DEFAULT_LIMITS = {
  small: 4,
  medium: 8,
  large: 14
};

const QUALITY_BY_WEALTH = {
  modest: ["Common"],
  comfortable: ["Common", "Fine"],
  wealthy: ["Luxury", "Arcane"]
};

const STOP_WORDS = new Set([
  "the",
  "and",
  "of",
  "hall",
  "guild",
  "house",
  "store",
  "shop",
  "works",
  "workshop",
  "district",
  "plaza",
  "market",
  "trading",
  "trader",
  "company",
  "co",
  "grand",
  "great"
]);

const PRODUCE_KEYWORD_DICTIONARY = {
  apple: ["apple", "cider"],
  apricot: ["apricot", "preserve", "cordial"],
  berry: ["berry", "jam", "wine"],
  cherry: ["cherry", "cordial", "preserve"],
  grape: ["grape", "wine"],
  vine: ["wine", "grape"],
  vineyard: ["wine", "grape"],
  winery: ["wine", "grape"],
  oat: ["oat", "grain", "porridge"],
  wheat: ["wheat", "grain", "bread", "flour"],
  barley: ["barley", "ale", "malt"],
  rye: ["rye", "bread"],
  corn: ["corn", "maize"],
  cane: ["sugar", "molasses"],
  beet: ["beet", "sugar"],
  sugar: ["sugar", "syrup"],
  greens: ["greens", "leaf", "salad"],
  herb: ["herb", "tea"],
  mushroom: ["mushroom"],
  nut: ["nut", "oil"],
  grove: ["nut", "fruit"],
  orchard: ["fruit"],
  peach: ["peach", "preserve", "brandy"],
  pear: ["pear", "perry", "cider", "preserve"],
  perry: ["pear", "cider"],
  plum: ["plum", "prune", "preserve", "juice"],
  prune: ["prune", "plum"],
  damson: ["plum", "damson", "preserve", "brandy"],
  citrus: ["citrus", "juice"],
  sunmellow: ["sunmellow", "plum", "apricot", "honey", "cordial"],
  dairy: ["milk", "cheese", "butter", "cream"],
  goat: ["goat", "cheese", "milk"],
  sheep: ["sheep", "wool", "mutton", "cheese"],
  cattle: ["beef", "leather", "tallow"],
  stockyard: ["beef", "mutton", "pork", "leather"],
  pig: ["pork", "bacon", "ham", "pork ham", "pork sausage"],
  hog: ["pork", "bacon", "pork ham", "pork sausage"],
  boar: ["pork", "ham", "pork ham", "pork sausage"],
  chicken: ["chicken", "egg"],
  hen: ["chicken", "egg"],
  egg: ["egg"],
  fish: ["fish", "seafood"],
  oyster: ["oyster"],
  clam: ["clam"],
  salt: ["salt"],
  honey: ["honey", "mead"],
  mead: ["mead", "honey"],
  wine: ["wine"],
  cider: ["cider"],
  field: ["grain"],
  fields: ["grain"],
  pasture: ["wool", "milk"],
  ranch: ["beef", "leather"],
  syrup: ["syrup"],
  canepress: ["sugar", "syrup"]
};

function toWords(name) {
  return name
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z]+/)
    .filter(Boolean)
    .filter(word => !STOP_WORDS.has(word));
}

function guessScale(lower) {
  if (/(grand|great|exchange|market|emporium|bazaar|trading|warehouse|wharf|quay|pier|shipwright|naval|foundry|factory|arena|central)/.test(lower)) {
    return "large";
  }
  if (/(shop|forge|smith|lodge|works|workshop|press|atelier|gallery|guild|house|brewery|winery|tannery|mill|quarry|smokehouse|butcher|tailor|clothier|carpenter|glass|library)/.test(lower)) {
    return "medium";
  }
  return "small";
}

function guessWealth(lower) {
  if (/(upper|noble|gilded|marble|court|salon|palace|royal|governor|estate|highward|ivory|crystal|silk|platinum|golden)/.test(lower)) {
    return "wealthy";
  }
  if (/(exchange|trading|market|merchant|guild|hall|workshop|forge|shipwright|academy|press|library|warehouse|district|quay|harbor)/.test(lower)) {
    return "comfortable";
  }
  return "modest";
}

function guessBusinessType(lower) {
  if (/(market|merchant|trading|exchange|emporium|bazaar|general|stall|plaza|store|warehouse|wharf|quay|pier|harbor)/.test(lower)) {
    return "merchant";
  }
  if (/(adventurer|guild)/.test(lower)) return "guild";
  if (/(inn|tavern|brewery|winery|academy|temple|shrine)/.test(lower)) return "service";
  return "producer";
}

function buildContext(name) {
  const lower = name.toLowerCase();
  return {
    name,
    lower,
    words: Array.from(new Set(toWords(name))),
    scale: guessScale(lower),
    wealth: guessWealth(lower),
    type: guessBusinessType(lower)
  };
}

function collectKeywordStrings(value, add) {
  if (!value) return;
  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) return;
    add(normalized);
    toWords(normalized).forEach(add);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach(entry => collectKeywordStrings(entry, add));
    return;
  }
  if (typeof value === "object") {
    Object.values(value).forEach(entry => collectKeywordStrings(entry, add));
  }
}

function deriveRegionTagsFromProfile(context, profile) {
  const tags = new Set((context.regionTags || []).map(tag => String(tag).toLowerCase()).filter(Boolean));
  const addTag = tag => {
    if (!tag) return;
    const normalized = String(tag).trim().toLowerCase();
    if (normalized) tags.add(normalized);
  };
  if (Array.isArray(profile?.regionTags)) {
    profile.regionTags.forEach(addTag);
  }
  if (profile?.category === "agriculture") {
    addTag("farmland");
  }
  const text = [
    profile?.name,
    profile?.scale?.label,
    profile?.scale?.rationale,
    profile?.production?.notes,
    profile?.production?.output
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (text) {
    if (/coast|shore|sea|bay|tide|gull|spray|salt|harbor|mist|cove|reef|wave/.test(text)) addTag("coastal");
    if (/river|brook|stream|creek|ford|delta|polder|canal|estuary/.test(text)) addTag("riverlands");
    if (/marsh|bog|fen|wetland|mire|swamp/.test(text)) addTag("wetland");
    if (/hill|ridge|upland|highland|terrace|stone|cliff|bluff/.test(text)) addTag("hills");
    if (/mountain|peak|crag|summit|range/.test(text)) addTag("mountains");
    if (/forest|grove|wood|timber|glade|copse|thicket|orchard/.test(text)) addTag("forest");
    if (/grass|meadow|pasture|plain|prairie|steppe/.test(text)) addTag("grassland");
  }
  return Array.from(tags);
}

function extendContextWithProfile(baseContext, profile) {
  if (!profile) return { ...baseContext };
  const productionGoods = new Set((baseContext.productionGoods || []).map(value => String(value).toLowerCase()).filter(Boolean));
  const productKeywords = new Set((baseContext.productKeywords || []).map(value => String(value).toLowerCase()).filter(Boolean));
  const supplyProfiles = Array.isArray(profile?.supplyProfiles) ? profile.supplyProfiles : baseContext.supplyProfiles;
  const addProductKeyword = value => {
    const normalized = String(value || "").trim().toLowerCase();
    if (!normalized) return;
    productionGoods.add(normalized);
    productKeywords.add(normalized);
  };
  const addKeywordOnly = value => {
    const normalized = String(value || "").trim().toLowerCase();
    if (normalized) productKeywords.add(normalized);
  };
  collectKeywordStrings(profile.production?.goods, addProductKeyword);
  collectKeywordStrings(profile.production?.byproducts, addProductKeyword);
  collectKeywordStrings(profile.production?.focus, addProductKeyword);
  collectKeywordStrings(profile.resources?.domestic, addKeywordOnly);
  collectKeywordStrings(profile.resources?.exports, addKeywordOnly);
  collectKeywordStrings(profile.resources?.imports, addKeywordOnly);
  const yields = { ...(baseContext.yields || {}) };
  if (profile.production?.yields && typeof profile.production.yields === "object") {
    for (const [key, value] of Object.entries(profile.production.yields)) {
      const normalizedKey = String(key || "").trim();
      if (!normalizedKey) continue;
      const bucket = new Set((yields[normalizedKey] || []).map(entry => String(entry).toLowerCase()).filter(Boolean));
      collectKeywordStrings(value, entry => {
        const normalized = String(entry || "").trim().toLowerCase();
        if (!normalized) return;
        bucket.add(normalized);
        productKeywords.add(normalized);
      });
      if (bucket.size) yields[normalizedKey] = Array.from(bucket);
    }
  }
  const regionTags = deriveRegionTagsFromProfile(baseContext, profile);
  const extended = {
    ...baseContext,
    productionGoods: Array.from(productionGoods),
    productKeywords: Array.from(productKeywords),
    supplyProfiles
  };
  if (regionTags.length) extended.regionTags = regionTags;
  if (Object.keys(yields).length) extended.yields = yields;
  return extended;
}

function expandCategoryKey(key) {
  if (!key) return [];
  const normalized = key.trim();
  const compact = normalized.replace(/\s+/g, "");
  const alias =
    CATEGORY_ALIASES[normalized] ||
    CATEGORY_ALIASES[compact] ||
    CATEGORY_ALIASES[normalized.replace(/\s*&\s*/g, " & ")] ||
    CATEGORY_ALIASES[normalized.replace(/\s*&\s*/g, "&")];
  if (alias) return Array.from(new Set(alias));
  return [normalized];
}

function labelForKey(key) {
  return LABEL_ALIASES[key] || key;
}

function limitForSection(section, context) {
  if (typeof section.limit === "number") return section.limit;
  if (section.limit && typeof section.limit === "object") {
    return section.limit[context.scale] != null ? section.limit[context.scale] : DEFAULT_LIMITS[context.scale];
  }
  return DEFAULT_LIMITS[context.scale];
}

function qualityForSection(section, context) {
  if (section.quality && section.quality.length) return section.quality;
  return QUALITY_BY_WEALTH[context.wealth] || QUALITY_BY_WEALTH.modest;
}

function fallbackQualities(primary, context) {
  if (!primary || !primary.length) return QUALITY_BY_WEALTH.modest;
  if (primary.includes("Luxury") || primary.includes("Arcane")) {
    return ["Luxury", "Arcane", "Fine"];
  }
  if (primary.includes("Fine")) {
    return ["Fine", "Common"];
  }
  return QUALITY_BY_WEALTH[context.wealth] || QUALITY_BY_WEALTH.modest;
}

function deriveProduceKeywords(context) {
  const found = new Set();
  const words = new Set(context.words || []);
  const fragments = [context.lower || ""];
  const harvestKeywords = value => {
    collectKeywordStrings(value, entry => {
      const normalized = String(entry || "").trim().toLowerCase();
      if (!normalized) return;
      fragments.push(normalized);
      normalized
        .split(/[^a-z]+/)
        .filter(Boolean)
        .forEach(token => words.add(token));
    });
  };
  harvestKeywords(context.productionGoods);
  harvestKeywords(context.productKeywords);
  if (context.yields) harvestKeywords(Object.values(context.yields));
  const haystack = fragments.join(" ");
  for (const [key, synonyms] of Object.entries(PRODUCE_KEYWORD_DICTIONARY)) {
    if (haystack.includes(key) || words.has(key)) {
      synonyms.forEach(value => found.add(value));
    }
  }
  if (/orchard|grove/.test(context.lower)) {
    found.add("fruit");
  }
  if (/vineyard|winery/.test(context.lower)) {
    found.add("wine");
    found.add("grape");
  }
  if (/brewery/.test(context.lower)) {
    found.add("ale");
    found.add("brew");
  }
  if (/berry/.test(context.lower)) {
    found.add("berry");
  }
  if (/stockyard|cattle|ranch/.test(context.lower)) {
    found.add("beef");
    found.add("hide");
  }
  return Array.from(found);
}

function preserveKeywordsFromFocus(focus) {
  const extra = new Set();
  focus.forEach(keyword => {
    if (keyword.includes("apple")) extra.add("cider");
    if (keyword.includes("berry")) {
      extra.add("jam");
      extra.add("wine");
    }
    if (keyword.includes("pear") || keyword.includes("perry")) {
      extra.add("perry");
      extra.add("cider");
      extra.add("preserve");
    }
    if (keyword.includes("plum") || keyword.includes("prune") || keyword.includes("damson")) {
      extra.add("preserve");
      extra.add("juice");
      extra.add("brandy");
    }
    if (keyword.includes("apricot") || keyword.includes("peach")) {
      extra.add("preserve");
      extra.add("cordial");
      extra.add("brandy");
    }
    if (keyword.includes("cherry")) {
      extra.add("preserve");
      extra.add("cordial");
    }
    if (keyword.includes("sunmellow")) {
      extra.add("honey");
      extra.add("cordial");
      extra.add("wine");
      extra.add("preserve");
    }
    if (keyword.includes("grape") || keyword.includes("wine")) {
      extra.add("wine");
      extra.add("brandy");
    }
    if (keyword.includes("honey")) extra.add("mead");
    if (keyword.includes("milk") || keyword.includes("cheese")) {
      extra.add("cheese");
      extra.add("butter");
    }
    if (keyword.includes("grain") || keyword.includes("barley") || keyword.includes("oat") || keyword.includes("wheat")) {
      extra.add("flour");
      extra.add("bread");
      extra.add("ale");
    }
  });
  return Array.from(extra);
}

function preferBulkSort(items) {
  return items.slice().sort((a, b) => {
    const aBulk = a.bulk_discount_threshold || 0;
    const bBulk = b.bulk_discount_threshold || 0;
    if (aBulk === bBulk) {
      const aPrice = a.suggested_price_cp != null ? a.suggested_price_cp : a.market_value_cp || 0;
      const bPrice = b.suggested_price_cp != null ? b.suggested_price_cp : b.market_value_cp || 0;
      return bPrice - aPrice;
    }
    return bBulk - aBulk;
  });
}

function preferBasicsSort(items) {
  return items.slice().sort((a, b) => {
    const aPrice = a.suggested_price_cp != null ? a.suggested_price_cp : a.market_value_cp || 0;
    const bPrice = b.suggested_price_cp != null ? b.suggested_price_cp : b.market_value_cp || 0;
    if (aPrice === bPrice) {
      const nameA = (a.display_name || a.internal_name || "").toLowerCase();
      const nameB = (b.display_name || b.internal_name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    }
    return aPrice - bPrice;
  });
}

function sortByPriceDesc(items) {
  return items.slice().sort((a, b) => {
    const aPrice = a.suggested_price_cp != null ? a.suggested_price_cp : a.market_value_cp || 0;
    const bPrice = b.suggested_price_cp != null ? b.suggested_price_cp : b.market_value_cp || 0;
    if (bPrice === aPrice) {
      const nameA = (a.display_name || a.internal_name || "").toLowerCase();
      const nameB = (b.display_name || b.internal_name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    }
    return bPrice - aPrice;
  });
}

function normalizeKeywords(list) {
  return Array.from(new Set((list || []).map(keyword => keyword.toLowerCase())));
}

function filterByKeywords(items, keywords) {
  const normalized = normalizeKeywords(keywords);
  if (!normalized.length) return items;
  const filtered = items.filter(item => {
    const haystack = (
      (item.display_name || "") + " " +
      (item.base_item || "") + " " +
      (item.internal_name || "")
    ).toLowerCase();
    return normalized.some(keyword => haystack.includes(keyword));
  });
  return filtered.length ? filtered : items;
}

function filterByExclusions(items, keywords) {
  const normalized = normalizeKeywords(keywords);
  if (!normalized.length) return items;
  return items.filter(item => {
    const haystack = (
      (item.display_name || "") + " " +
      (item.base_item || "") + " " +
      (item.internal_name || "")
    ).toLowerCase();
    return !normalized.some(keyword => haystack.includes(keyword));
  });
}

function filterByRegionTags(items, tags) {
  const normalized = normalizeKeywords(tags);
  if (!normalized.length) return items;
  const filtered = items.filter(item => {
    const regions = (item.regions || []).map(region => String(region).toLowerCase());
    if (!regions.length) return true;
    return normalized.some(tag => regions.includes(tag));
  });
  return filtered.length ? filtered : items;
}

function normalizeSupplyProfiles(profiles) {
  if (!Array.isArray(profiles)) return [];
  return profiles
    .filter(profile => profile && profile.inventoryKey)
    .map(profile => ({
      inventoryKey: String(profile.inventoryKey).trim(),
      items: Array.isArray(profile.items) ? profile.items.filter(Boolean) : [],
      baseItems: Array.isArray(profile.baseItems) ? profile.baseItems.filter(Boolean) : [],
      limit: typeof profile.limit === "number" ? profile.limit : null
    }));
}

function supplyProfilesForSection(section, context) {
  const profiles = normalizeSupplyProfiles(context?.supplyProfiles);
  if (!profiles.length) return [];
  const sectionKeys = new Set([
    section.inventoryKey,
    section.key,
    ...expandCategoryKey(section.key)
  ].map(value => String(value || "").trim().toLowerCase()));
  return profiles.filter(profile => sectionKeys.has(String(profile.inventoryKey).trim().toLowerCase()));
}

function collectSupplyMatches(items, profiles, qualities) {
  if (!profiles.length) return [];
  const qualitySet = qualities && qualities.length
    ? new Set(qualities.map(value => String(value).trim().toLowerCase()))
    : null;
  const byInternal = new Map();
  const byBase = new Map();
  items.forEach(item => {
    const internal = String(item.internal_name || "").trim().toLowerCase();
    if (internal) byInternal.set(internal, item);
    const base = String(item.base_item || "").trim().toLowerCase();
    if (base) {
      if (!byBase.has(base)) byBase.set(base, []);
      byBase.get(base).push(item);
    }
  });
  const matches = [];
  const seen = new Set();
  const addItem = item => {
    if (!item) return;
    const internal = String(item.internal_name || "").trim().toLowerCase();
    if (!internal || seen.has(internal)) return;
    if (qualitySet) {
      const tier = String(item.quality_tier || "").trim().toLowerCase();
      if (!qualitySet.has(tier)) return;
    }
    seen.add(internal);
    matches.push(item);
  };
  profiles.forEach(profile => {
    const profileMatches = [];
    profile.items.forEach(name => {
      const normalized = String(name || "").trim().toLowerCase();
      if (!normalized) return;
      const item = byInternal.get(normalized);
      if (item) profileMatches.push(item);
    });
    profile.baseItems.forEach(baseItem => {
      const normalized = String(baseItem || "").trim().toLowerCase();
      if (!normalized) return;
      const list = byBase.get(normalized);
      if (list) profileMatches.push(...list);
    });
    const limited = profile.limit != null ? profileMatches.slice(0, profile.limit) : profileMatches;
    limited.forEach(addItem);
  });
  return matches;
}

const ARMORY_DEFAULT_CATEGORIES = ["swords", "daggers", "axes", "polearms"];

const ARMORY_CATEGORY_RULES = [
  {
    match: context => /(bowyer|fletcher|archer|ranger|hunts?man|trapper)/.test(context.lower),
    categories: ["ranged", "daggers"]
  },
  {
    match: context => /(enchant|arcane|mana|rune|wizard|mage)/.test(context.lower),
    categories: ["swords", "daggers", "staves", "martial"]
  },
  {
    match: context => /(temple|monastery|abbey|church|cleric|chantry)/.test(context.lower),
    categories: ["maces", "staves", "shields", "martial"]
  },
  {
    match: context => /(guard|watch|garrison|barracks|militia|patrol)/.test(context.lower),
    categories: ["swords", "polearms", "maces", "shields"]
  },
  {
    match: context => /(ship|naval|dock|wharf|corsair|privateer|sailor)/.test(context.lower),
    categories: ["swords", "axes", "ranged", "polearms"]
  },
  {
    match: context => /(arena|pit|dojo|academy|trainer|school)/.test(context.lower),
    categories: ["swords", "axes", "martial", "daggers"]
  },
  {
    match: context => /(forge|smith|armory|smithy|foundry|blacksmith)/.test(context.lower),
    categories: ["swords", "axes", "polearms", "maces", "shields"]
  },
  {
    match: context => /(adventurer|guild|outfitter|mercenary|quartermaster)/.test(context.lower),
    categories: ["swords", "daggers", "ranged", "chains", "martial", "axes"]
  },
  {
    match: () => true,
    categories: ARMORY_DEFAULT_CATEGORIES
  }
];

const ARMORY_QUALITY_TIER = {
  Standard: "Common",
  Fine: "Fine",
  Masterwork: "Luxury"
};

function armoryCategoriesForContext(context) {
  const ctx = context || {};
  const normalized = { ...ctx, lower: String(ctx.lower || "") };
  for (const rule of ARMORY_CATEGORY_RULES) {
    try {
      if (rule.match(normalized)) return rule.categories;
    } catch (err) {
      continue;
    }
  }
  return ARMORY_DEFAULT_CATEGORIES;
}

function convertArmoryRecords(records) {
  return records.map(record => {
    const display = record.quality === "Standard" ? record.name : `${record.quality} ${record.name}`;
    const baseItem = record.descriptionFull || record.description || record.name;
    const regions = record.region ? [record.region] : [];
    return {
      display_name: display,
      internal_name: record.name,
      quality_tier: ARMORY_QUALITY_TIER[record.quality] || "Common",
      suggested_price_cp: record.priceCp,
      sale_quantity: 1,
      unit: "each",
      net_profit_cp: 0,
      category_key: "Weapons",
      base_item: baseItem,
      regions,
      _armoryRecord: record
    };
  });
}

function pushUnique(list, value) {
  if (!value) return;
  const normalized = String(value).toLowerCase();
  if (!normalized) return;
  if (!list.some(entry => entry.toLowerCase() === normalized)) list.push(value);
}

function deriveSeasonalAdjustments(section, context) {
  const adjustments = {
    limitMultiplier: 1,
    quantityMultiplier: 1,
    priceMultiplier: 1,
    preferKeywords: [],
    avoidKeywords: [],
    keywordHints: []
  };
  const key = String(section.inventoryKey || section.key || "").toLowerCase();
  const season = String(context?.season || "").toLowerCase();
  const weather = context?.weather || {};
  const condition = String(weather.condition || "").toLowerCase();
  const droughtStage = String(weather.droughtStage || "").toLowerCase();
  const isDrought = droughtStage && droughtStage !== "none";
  const isRain = weather.storm || condition.includes("rain");
  const isSnow = condition.includes("snow") || condition.includes("sleet");

  if (key === "produce") {
    if (season === "winter") {
      adjustments.limitMultiplier *= 0.7;
      adjustments.quantityMultiplier *= 0.8;
      ["root", "cellar", "pickled", "preserve", "dried"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      adjustments.priceMultiplier *= 1.08;
    } else if (season === "spring") {
      adjustments.limitMultiplier *= 1.1;
      ["sprout", "green", "herb", "fresh"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
    } else if (season === "summer") {
      adjustments.limitMultiplier *= 1.05;
      ["berry", "fruit", "fresh"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
    } else if (season === "autumn" || season === "fall") {
      adjustments.limitMultiplier *= 1.15;
      ["grain", "harvest", "squash", "spice"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      adjustments.priceMultiplier *= 1.02;
    }
    if (isDrought) {
      adjustments.limitMultiplier *= 0.7;
      adjustments.quantityMultiplier *= 0.75;
      ["dried", "grain", "preserve", "smoked"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      ["berry", "juicy", "fresh"].forEach(keyword => pushUnique(adjustments.avoidKeywords, keyword));
      adjustments.priceMultiplier *= 1.12;
    }
    if (isRain) {
      ["leaf", "greens", "herb", "mushroom"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      adjustments.priceMultiplier *= 0.97;
    }
    if (isSnow) {
      adjustments.limitMultiplier *= 0.8;
      ["root", "pickled", "cellared"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      adjustments.priceMultiplier *= 1.1;
    }
  } else if (key === "fooddrink" || key === "food & drink") {
    if (season === "winter") {
      adjustments.quantityMultiplier *= 1.2;
      ["stew", "soup", "mulled", "spiced", "tea"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      adjustments.priceMultiplier *= 1.05;
    } else if (season === "summer") {
      adjustments.quantityMultiplier *= 1.1;
      ["chilled", "iced", "fruit", "cider", "ale"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      adjustments.priceMultiplier *= 0.98;
    } else if (season === "spring") {
      ["fresh", "herb", "salad"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
    } else if (season === "autumn" || season === "fall") {
      ["harvest", "preserve", "roast", "cider"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      adjustments.priceMultiplier *= 1.02;
    }
    if (isDrought) {
      adjustments.limitMultiplier *= 0.85;
      ["jerky", "ration", "dried", "pickled"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      adjustments.priceMultiplier *= 1.1;
    }
    if (isRain) {
      ["stew", "soup", "tea", "broth"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      adjustments.priceMultiplier *= 1.03;
    }
    if (isSnow) {
      adjustments.quantityMultiplier *= 1.15;
      ["stew", "cider", "mulled", "porridge"].forEach(keyword => pushUnique(adjustments.preferKeywords, keyword));
      adjustments.priceMultiplier *= 1.08;
    }
  }

  adjustments.keywordHints = [...adjustments.preferKeywords];
  adjustments.limitMultiplier = Math.max(0.5, Math.min(adjustments.limitMultiplier, 1.6));
  adjustments.quantityMultiplier = Math.max(0.5, Math.min(adjustments.quantityMultiplier, 1.6));
  adjustments.priceMultiplier = Math.max(0.6, Math.min(adjustments.priceMultiplier, 1.4));
  return adjustments;
}

function applyPreferenceOrdering(items, preferKeywords, avoidKeywords) {
  const prefer = normalizeKeywords(preferKeywords);
  const avoid = normalizeKeywords(avoidKeywords);
  if (!prefer.length && !avoid.length) return items;
  return items
    .map((item, index) => {
      const haystack = (
        (item.display_name || item.name || "") + " " +
        (item.internal_name || "") + " " +
        (item.base_item || "")
      ).toLowerCase();
      let score = 0;
      prefer.forEach(keyword => {
        if (haystack.includes(keyword)) score += 2;
      });
      avoid.forEach(keyword => {
        if (haystack.includes(keyword)) score -= 2;
      });
      return { item, index, score };
    })
    .sort((a, b) => {
      if (b.score === a.score) return a.index - b.index;
      return b.score - a.score;
    })
    .map(entry => entry.item);
}

function determineDestinationBiome(section, context) {
  const candidates = [];
  const key = String(section.inventoryKey || section.key || "").toLowerCase();
  const habitat = context?.habitat ? String(context.habitat).toLowerCase() : null;
  const tags = Array.isArray(context?.regionTags) ? context.regionTags.map(tag => String(tag).toLowerCase()) : [];
  if (key === "produce") {
    if (tags.includes("farmland")) candidates.push("farmland");
    if (tags.includes("grassland")) candidates.push("grassland");
  }
  if (habitat) candidates.push(habitat);
  candidates.push(...tags);
  const weather = context?.weather || {};
  const condition = String(weather.condition || "").toLowerCase();
  const droughtStage = String(weather.droughtStage || "").toLowerCase();
  if (droughtStage && droughtStage !== "none") candidates.push("desert");
  if (condition.includes("snow") || condition.includes("sleet")) candidates.push("tundra");
  if (condition.includes("rain")) candidates.push("riverlands");
  for (const candidate of candidates) {
    const normalized = String(candidate || "").trim().toLowerCase();
    if (normalized) return normalized;
  }
  return "urban";
}

function shouldUseArmory(section, context) {
  const key = String(section.inventoryKey || section.key || "").toLowerCase();
  if (key !== "weapons") return false;
  const categories = armoryCategoriesForContext(context || {});
  return Array.isArray(categories) && categories.length > 0;
}

function sortItemsForSection(items, section) {
  if (section.preferBulk) return preferBulkSort(items);
  if (section.preferBasics) return preferBasicsSort(items);
  if (section.sort === "desc") return sortByPriceDesc(items);
  if (section.sort === "asc") return preferBasicsSort(items);
  return alphabeticalSort(items);
}

async function finalizeInventoryItems(items, section, context, adjustments) {
  if (!items.length) return [];
  const policy = await loadRegionPolicy();
  const biome = determineDestinationBiome(section, context);
  const priceMultiplier = adjustments?.priceMultiplier ?? 1;
  const quantityMultiplier = adjustments?.quantityMultiplier ?? 1;

  return items.map(item => {
    const basePrice =
      item.suggested_price_cp != null
        ? item.suggested_price_cp
        : item.market_value_cp != null
          ? item.market_value_cp
          : item.priceCp != null
            ? item.priceCp
            : 0;
    let price = basePrice;
    if (policy && biome) {
      try {
        price = computePrice(basePrice, item, biome, policy);
      } catch (err) {
        price = basePrice;
      }
    }
    if (!Number.isFinite(price)) price = basePrice;
    price = roundMoney(price * priceMultiplier);
    if (!Number.isFinite(price)) price = roundMoney(basePrice);
    const baseQuantity =
      item.sale_quantity != null
        ? item.sale_quantity
        : item.saleQuantity != null
          ? item.saleQuantity
          : 1;
    const saleQuantity = Math.max(1, Math.round(baseQuantity * quantityMultiplier));
    const mapped = {
      name: item.display_name || item.internal_name || item.name,
      price: price,
      profit: item.net_profit_cp || item.profit || 0,
      category: section.inventoryKey,
      sale_quantity: saleQuantity,
      unit: item.unit || (item._armoryRecord ? "each" : undefined),
      base_item: item.base_item || item.internal_name || item.name,
      regions: Array.isArray(item.regions) ? item.regions : [],
      bulk_discount_threshold: item.bulk_discount_threshold || 0,
      bulk_discount_pct: item.bulk_discount_pct || 0
    };
    if (item._armoryRecord) {
      mapped.base_item = item._armoryRecord.descriptionFull || item._armoryRecord.description || mapped.base_item;
      mapped.regions = item._armoryRecord.region ? [item._armoryRecord.region] : mapped.regions;
      mapped.quality = item._armoryRecord.quality;
      mapped.source = "armory";
    }
    return mapped;
  });
}

function finalizeSection(section, context) {
  const heading = section.label || labelForKey(section.key);
  const inventoryKey = section.inventoryKey || section.key;
  const keywords = normalizeKeywords(section.keywords);
  const exclude = normalizeKeywords(section.excludeKeywords);
  return {
    ...section,
    heading,
    inventoryKey,
    keywords,
    excludeKeywords: exclude,
    limit: section.limit,
    quality: section.quality,
    allowQualityFallback: section.allowQualityFallback !== false,
    allowBulk: section.allowBulk !== false,
    preferBasics: Boolean(section.preferBasics),
    preferBulk: Boolean(section.preferBulk),
    sort: section.sort || null
  };
}

function defaultQualityForContext(context) {
  return QUALITY_BY_WEALTH[context.wealth] || QUALITY_BY_WEALTH.modest;
}

function buildMerchantPlan(context) {
  const wealthQualities = context.wealth === "wealthy" ? ["Luxury", "Arcane"] : context.wealth === "comfortable" ? ["Common", "Fine"] : ["Common"];
  const sells = [
    {
      key: "Produce",
      label: context.scale === "large" ? "Regional Produce" : "Fresh Produce",
      limit: { small: 4, medium: 8, large: 14 },
      preferBasics: context.wealth !== "wealthy"
    },
    {
      key: "FoodDrink",
      label: context.scale === "large" ? "Provisions & Preserves" : "Prepared Foods",
      limit: { small: 3, medium: 6, large: 10 },
      preferBasics: context.wealth !== "wealthy"
    },
    {
      key: "Textiles",
      label: context.scale === "large" ? "Textiles & Cloth" : "Cloth Goods",
      limit: { small: 2, medium: 4, large: 8 },
      preferBulk: context.scale === "large"
    },
    {
      key: "Tools",
      label: context.scale === "large" ? "Workshop Tools" : "Everyday Tools",
      limit: { small: 2, medium: 4, large: 8 },
      preferBulk: context.scale === "large"
    },
    {
      key: "Weapons",
      label: context.scale === "large" ? "Armaments" : "Defensive Arms",
      limit: { small: 0, medium: 3, large: 6 },
      quality: wealthQualities,
      allowQualityFallback: true,
      sort: context.wealth === "wealthy" ? "desc" : null
    },
    {
      key: "Armor",
      label: context.scale === "large" ? "Protective Gear" : "Everyday Armor",
      limit: { small: 0, medium: 3, large: 6 },
      quality: wealthQualities,
      allowQualityFallback: true,
      sort: context.wealth === "wealthy" ? "desc" : null
    },
    {
      key: "BooksMaps",
      label: "Books & Charts",
      limit: { small: 0, medium: 2, large: 4 },
      quality: defaultQualityForContext(context),
      allowQualityFallback: true
    },
    {
      key: "Reagents",
      label: "Remedies & Alchemy",
      limit: { small: 0, medium: 2, large: 4 },
      allowQualityFallback: true
    },
    {
      key: "Glassware",
      label: "Luxury Goods",
      limit: { small: 0, medium: 2, large: 4 },
      allowQualityFallback: true,
      sort: "desc"
    }
  ];
  const normalized = sells.filter(section => limitForSection(section, context) > 0).map(section => finalizeSection(section, context));
  return {
    sells: normalized,
    buys: normalized.map(section => section.inventoryKey),
    resale: true
  };
}

function buildGeneralGoodsPlan(context) {
  const sells = [
    {
      key: "Produce",
      label: "Staple Produce",
      limit: { small: 4, medium: 6, large: 8 },
      preferBasics: true
    },
    {
      key: "FoodDrink",
      label: "Prepared Provisions",
      limit: { small: 2, medium: 4, large: 6 },
      preferBasics: true
    },
    {
      key: "Tools",
      label: "Hand Tools",
      limit: { small: 2, medium: 3, large: 4 },
      preferBasics: true
    },
    {
      key: "Textiles",
      label: "Household Cloth",
      limit: { small: 1, medium: 2, large: 3 },
      preferBasics: true
    }
  ].map(section => finalizeSection(section, context));
  return {
    sells,
    buys: sells.map(section => section.inventoryKey),
    resale: context.type === "merchant"
  };
}

function producePlan(context) {
  const focus = deriveProduceKeywords(context);
  const preserve = preserveKeywordsFromFocus(focus);
  const sells = [
    {
      key: "Produce",
      label: focus.length ? "Estate Produce" : "Seasonal Produce",
      limit: { small: 5, medium: 8, large: 16 },
      keywords: focus,
      preferBasics: context.wealth !== "wealthy"
    }
  ];
  if (focus.length || /winery|brewery/.test(context.lower)) {
    sells.push({
      key: "FoodDrink",
      label: /winery|brewery/.test(context.lower) ? "Cellared Drinks" : "Preserves & Pressings",
      limit: { small: 2, medium: 4, large: 6 },
      keywords: focus.concat(preserve),
      quality: context.wealth === "wealthy" ? ["Luxury", "Arcane"] : null,
      allowQualityFallback: true
    });
  }
  if (/stockyard|cattle|goat|sheep|dairy|ranch/.test(context.lower)) {
    sells.push({
      key: "Livestock",
      label: "Animal Products",
      limit: { small: 3, medium: 4, large: 6 },
      keywords: focus,
      preferBasics: true,
      allowBulk: false
    });
  }
  const normalized = sells.map(section => finalizeSection(section, context));
  const buys = ["Produce"];
  if (/stockyard|livestock|ranch/.test(context.lower)) buys.push("Livestock");
  return { sells: normalized, buys, resale: false };
}

function forgePlan(context) {
  const wealthQualities =
    context.wealth === "wealthy"
      ? ["Luxury", "Arcane"]
      : context.wealth === "comfortable"
        ? ["Common", "Fine"]
        : ["Common"];
  const sells = [
    {
      key: "Metals",
      label: context.scale === "large" ? "Ingots & Stock" : "Smelted Metals",
      limit: { small: 2, medium: 4, large: 6 },
      preferBulk: context.scale !== "small",
      preferBasics: context.wealth !== "wealthy"
    },
    {
      key: "Weapons",
      label: context.wealth === "wealthy" ? "Commissioned Weapons" : "Forged Weapons",
      limit: { small: 3, medium: 5, large: 8 },
      quality: wealthQualities,
      allowQualityFallback: true,
      sort: context.wealth === "wealthy" ? "desc" : null
    },
    {
      key: "Armor",
      label: context.wealth === "wealthy" ? "Plate & Mail" : "Forged Armor",
      limit: { small: 2, medium: 4, large: 6 },
      quality: wealthQualities,
      allowQualityFallback: true,
      sort: context.wealth === "wealthy" ? "desc" : null
    },
    {
      key: "Tools",
      label: "Smithing Tools",
      limit: { small: 1, medium: 2, large: 3 },
      preferBasics: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Metals", "Weapons", "Armor", "Tools"];
  return { sells, buys, resale: false };
}

function tailorPlan(context) {
  const wealthQualities = context.wealth === "wealthy" ? ["Luxury", "Arcane"] : context.wealth === "comfortable" ? ["Common", "Fine"] : ["Common"];
  const sells = [
    {
      key: "Clothing",
      label: context.wealth === "wealthy" ? "Fitted Attire" : "Clothing & Accessories",
      limit: { small: 4, medium: 6, large: 10 },
      quality: wealthQualities,
      allowQualityFallback: true,
      sort: context.wealth === "wealthy" ? "desc" : null
    },
    {
      key: "Textiles",
      label: "Bolts & Materials",
      limit: { small: 3, medium: 5, large: 8 },
      preferBulk: context.scale === "large"
    },
    {
      key: "Armor",
      label: "Padded & Leather Armor",
      limit: { small: 2, medium: 3, large: 4 },
      quality: context.wealth === "wealthy" ? ["Fine", "Luxury"] : ["Common", "Fine"],
      allowQualityFallback: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Clothing", "Textiles", "Armor"];
  return { sells, buys, resale: false };
}

function tanneryPlan(context) {
  const sells = [
    {
      key: "Leatherworking",
      label: "Leather Goods",
      limit: { small: 3, medium: 5, large: 8 },
      preferBasics: context.wealth !== "wealthy"
    },
    {
      key: "Armor",
      label: "Leather Armor",
      limit: { small: 2, medium: 3, large: 4 },
      quality: context.wealth === "wealthy" ? ["Fine", "Luxury"] : ["Common", "Fine"],
      allowQualityFallback: true
    },
    {
      key: "Livestock",
      label: "Hides & Furs",
      limit: { small: 2, medium: 3, large: 5 },
      keywords: ["hide", "fur", "leather"],
      preferBasics: true,
      allowBulk: false
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Leatherworking", "Armor", "Livestock"];
  return { sells, buys, resale: false };
}

function carpenterPlan(context) {
  const sells = [
    {
      key: "Wood",
      label: "Timber & Planks",
      limit: { small: 4, medium: 6, large: 10 },
      preferBulk: context.scale === "large",
      allowBulk: context.scale !== "small"
    },
    {
      key: "Tools",
      label: "Carpentry Tools",
      limit: { small: 2, medium: 3, large: 5 },
      preferBasics: context.wealth !== "wealthy"
    },
    {
      key: "Armor",
      label: "Wooden Defenses",
      limit: { small: 1, medium: 2, large: 3 },
      quality: context.wealth === "wealthy" ? ["Fine", "Luxury"] : ["Common"],
      allowQualityFallback: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Wood", "Tools", "Armor"];
  return { sells, buys, resale: false };
}

function glassPlan(context) {
  const sells = [
    {
      key: "Glassware",
      label: context.wealth === "wealthy" ? "Art Glass" : "Glassware",
      limit: { small: 4, medium: 6, large: 10 },
      quality: context.wealth === "wealthy" ? ["Luxury", "Arcane"] : null,
      allowQualityFallback: true,
      sort: context.wealth === "wealthy" ? "desc" : null
    },
    {
      key: "Tools",
      label: "Glassmaking Tools",
      limit: { small: 2, medium: 3, large: 4 },
      preferBasics: true
    },
    {
      key: "Reagents",
      label: "Chemical Supplies",
      limit: { small: 2, medium: 3, large: 4 },
      keywords: ["acid", "salts", "sand"],
      allowQualityFallback: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Glassware", "Tools", "Reagents"];
  return { sells, buys, resale: false };
}

function alchemyPlan(context) {
  const sells = [
    {
      key: "Reagents",
      label: "Raw Reagents",
      limit: { small: 4, medium: 6, large: 8 },
      keywords: ["herb", "powder", "salts", "oil"],
      allowQualityFallback: true
    },
    {
      key: "Reagents",
      label: "Elixirs & Tinctures",
      limit: { small: 3, medium: 4, large: 6 },
      keywords: ["potion", "elixir", "tonic", "remedy"],
      allowQualityFallback: true,
      sort: context.wealth === "wealthy" ? "desc" : null
    },
    {
      key: "Tools",
      label: "Laboratory Tools",
      limit: { small: 2, medium: 3, large: 4 },
      quality: context.wealth === "wealthy" ? ["Fine", "Luxury"] : null,
      allowQualityFallback: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Reagents", "Tools"];
  return { sells, buys, resale: false };
}

function enchanterPlan(context) {
  const sells = [
    {
      key: "Reagents",
      label: "Arcane Reagents",
      limit: { small: 3, medium: 4, large: 6 },
      keywords: ["crystal", "mana", "essence", "focus"],
      quality: ["Luxury", "Arcane"],
      allowQualityFallback: true,
      sort: "desc"
    },
    {
      key: "Weapons",
      label: "Enchanted Arms",
      limit: { small: 2, medium: 3, large: 5 },
      quality: ["Luxury", "Arcane"],
      allowQualityFallback: true,
      sort: "desc"
    },
    {
      key: "Armor",
      label: "Enchanted Armor",
      limit: { small: 2, medium: 3, large: 5 },
      quality: ["Luxury", "Arcane"],
      allowQualityFallback: true,
      sort: "desc"
    },
    {
      key: "Adventuring Gear",
      label: "Foci & Charms",
      limit: { small: 2, medium: 3, large: 4 },
      keywords: ["focus", "wand", "charm", "runed"],
      quality: ["Luxury", "Arcane"],
      allowQualityFallback: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Reagents", "Weapons", "Armor", "Adventuring Gear"];
  return { sells, buys, resale: false };
}

function tavernPlan(context) {
  const sells = [
    {
      key: "FoodDrink",
      label: /brewery|winery/.test(context.lower) ? "Signature Drinks" : "House Meals & Drink",
      limit: { small: 4, medium: 6, large: 8 },
      keywords: /brewery|winery/.test(context.lower) ? ["ale", "beer", "wine", "mead"] : [],
      preferBasics: context.scale !== "large"
    },
    {
      key: "FoodDrink",
      label: "Travel Rations",
      limit: { small: 2, medium: 3, large: 4 },
      keywords: ["ration", "trail", "bread"],
      preferBasics: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["FoodDrink", "Produce"];
  return { sells, buys, resale: false };
}

function butcherPlan(context) {
  const sells = [
    {
      key: "Livestock",
      label: "Fresh Cuts",
      limit: { small: 4, medium: 6, large: 8 },
      keywords: ["cut", "steak", "roast", "loin"],
      preferBasics: true
    },
    {
      key: "FoodDrink",
      label: "Cured Goods",
      limit: { small: 3, medium: 4, large: 6 },
      keywords: ["smoked", "sausage", "pork sausage", "jerky", "bacon", "ham", "pork ham"],
      preferBasics: true
    },
    {
      key: "Produce",
      label: "Spices & Salts",
      limit: { small: 1, medium: 2, large: 3 },
      keywords: ["spice", "salt"],
      preferBasics: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Livestock", "FoodDrink", "Produce"];
  return { sells, buys, resale: false };
}

function pressPlan(context) {
  const sells = [
    {
      key: "BooksMaps",
      label: "Books & Scrolls",
      limit: { small: 4, medium: 6, large: 10 },
      quality: context.wealth === "wealthy" ? ["Luxury", "Fine"] : defaultQualityForContext(context),
      allowQualityFallback: true
    },
    {
      key: "Reagents",
      label: "Ink & Pigments",
      limit: { small: 2, medium: 3, large: 4 },
      keywords: ["ink", "pigment", "dye"],
      allowQualityFallback: true
    },
    {
      key: "Tools",
      label: "Writing Tools",
      limit: { small: 1, medium: 2, large: 3 },
      keywords: ["quill", "stylus", "seal"],
      preferBasics: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["BooksMaps", "Reagents", "Tools", "Textiles"];
  return { sells, buys, resale: false };
}

function shipwrightPlan(context) {
  const sells = [
    {
      key: "Ship",
      label: "Ship Components",
      limit: { small: 3, medium: 5, large: 8 },
      keywords: ["rigging", "mast", "sail"],
      preferBulk: true,
      allowBulk: true
    },
    {
      key: "Tools",
      label: "Maritime Tools",
      limit: { small: 2, medium: 3, large: 4 },
      keywords: ["rope", "tar", "pitch", "caulk"],
      preferBasics: true
    },
    {
      key: "Wood",
      label: "Hull Timber",
      limit: { small: 2, medium: 3, large: 5 },
      preferBulk: true,
      allowBulk: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Ship", "Tools", "Wood", "Metals"];
  return { sells, buys, resale: false };
}

function ropewalkPlan(context) {
  const sells = [
    {
      key: "Ship",
      label: "Rigging & Rope",
      limit: { small: 3, medium: 5, large: 8 },
      keywords: ["rope", "line", "rigging"],
      preferBulk: true,
      allowBulk: true
    },
    {
      key: "Tools",
      label: "Splicing Tools",
      limit: { small: 1, medium: 2, large: 3 },
      keywords: ["fid", "hook", "needle"],
      preferBasics: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Ship", "Tools", "Textiles"];
  return { sells, buys, resale: false };
}

function cooperPlan(context) {
  const sells = [
    {
      key: "Wood",
      label: "Barrels & Casks",
      limit: { small: 3, medium: 4, large: 6 },
      keywords: ["barrel", "cask", "keg"],
      preferBulk: true,
      allowBulk: true
    },
    {
      key: "Tools",
      label: "Cooper Tools",
      limit: { small: 2, medium: 3, large: 4 },
      preferBasics: true
    }
  ].map(section => finalizeSection(section, context));
  const buys = ["Wood", "Tools", "FoodDrink"];
  return { sells, buys, resale: false };
}

function workshopPlan(context) {
  const sells = [
    {
      key: "Tools",
      label: "Workshop Tools",
      limit: { small: 3, medium: 5, large: 8 },
      preferBasics: context.scale !== "large"
    },
    {
      key: "Crafts",
      label: "Workshop Materials",
      limit: { small: 2, medium: 3, large: 5 },
      preferBulk: context.scale === "large"
    }
  ];
  if (/stone|brick/.test(context.lower)) {
    sells.push({
      key: "Stone",
      label: "Stone & Masonry",
      limit: { small: 1, medium: 3, large: 5 },
      preferBulk: context.scale === "large"
    });
  }
  const normalized = sells.map(section => finalizeSection(section, context));
  const buys = normalized.map(section => section.inventoryKey);
  return { sells: normalized, buys, resale: false };
}

const INVENTORY_RULES = [
  {
    match: context => /adventurer/.test(context.lower),
    plan: context => {
      const gearQuality = context.wealth === "wealthy" ? ["Fine", "Luxury"] : ["Common"];
      const sells = [
        {
          key: "Adventuring Gear",
          label: "Field Supplies",
          limit: { small: 5, medium: 8, large: 12 },
          quality: ["Common"],
          allowQualityFallback: true,
          preferBasics: true
        },
        {
          key: "Weapons",
          label: context.wealth === "wealthy" ? "Commissioned Weapons" : "Training Weapons",
          limit: { small: 3, medium: 4, large: 6 },
          quality: gearQuality,
          allowQualityFallback: true
        },
        {
          key: "Armor",
          label: context.wealth === "wealthy" ? "Commissioned Armor" : "Field Armor",
          limit: { small: 3, medium: 4, large: 6 },
          quality: gearQuality,
          allowQualityFallback: true
        },
        {
          key: "FoodDrink",
          label: "Travel Rations",
          limit: { small: 3, medium: 4, large: 6 },
          keywords: ["ration", "trail"],
          preferBasics: true
        }
      ].map(section => finalizeSection(section, context));
      const buys = ["Adventuring Gear", "Weapons", "Armor", "Tools", "FoodDrink"];
      return { sells, buys, resale: false };
    }
  },
  {
    match: context => /(produce|orchard|farm|vineyard|winery|dairy|stockyard|pasture|apiary|grove|fields|greens|berry)/.test(context.lower),
    plan: producePlan
  },
  {
    match: context => /(forge|smith|armory|smithy|foundry)/.test(context.lower),
    plan: forgePlan
  },
  {
    match: context => /(clothier|tailor|seamstress|textile|weav)/.test(context.lower),
    plan: tailorPlan
  },
  {
    match: context => /(tannery|leather|hide)/.test(context.lower),
    plan: tanneryPlan
  },
  {
    match: context => /(carpenter|lumber|woodworks|timber)/.test(context.lower),
    plan: carpenterPlan
  },
  {
    match: context => /(glass|ceramic|kiln|pottery)/.test(context.lower),
    plan: glassPlan
  },
  {
    match: context => /(alchem|apothec|remed|herbal|remedies|perfum)/.test(context.lower),
    plan: alchemyPlan
  },
  {
    match: context => /(enchant|rune|arcane|mana)/.test(context.lower),
    plan: enchanterPlan
  },
  {
    match: context => /(brewery|tavern|inn|taproom|galley|meadery)/.test(context.lower),
    plan: tavernPlan
  },
  {
    match: context => /(butcher|smokehouse|charcuterie)/.test(context.lower),
    plan: butcherPlan
  },
  {
    match: context => /(press|library|archive|scribe|papermill|books)/.test(context.lower),
    plan: pressPlan
  },
  {
    match: context => /(shipwright|shipyard|dock|naval|sailmaker)/.test(context.lower),
    plan: shipwrightPlan
  },
  {
    match: context => /(ropewalk|rigging)/.test(context.lower),
    plan: ropewalkPlan
  },
  {
    match: context => /(cooper|barrel|cask)/.test(context.lower),
    plan: cooperPlan
  },
  {
    match: context => /(workshop|coachworks|mill|quarry|brickworks|stoneworks)/.test(context.lower),
    plan: workshopPlan
  },
  {
    match: context => /(market|trading|exchange|merchant|emporium|bazaar|general|plaza|store|warehouse|wharf|quay|pier)/.test(context.lower),
    plan: buildMerchantPlan
  }
];

function alphabeticalSort(items) {
  return items.slice().sort((a, b) => {
    const nameA = (a.display_name || a.internal_name || "").toLowerCase();
    const nameB = (b.display_name || b.internal_name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

function uniqueStrings(list) {
  return Array.from(new Set(list || []));
}

export function shopCategoriesForBuilding(name) {
  const baseContext = buildContext(name);
  const profile = getBusinessProfileByName(name);
  const context = extendContextWithProfile(baseContext, profile);
  const logisticsOnly =
    profile?.category === "logistics" || /warehouse\s*row|wharf/.test(context.lower);
  if (logisticsOnly) {
    return { sells: [], buys: [], resale: false, context: { ...context, type: "logistics" } };
  }
  let plan = null;
  for (const rule of INVENTORY_RULES) {
    try {
      if (rule.match(context)) {
        plan = typeof rule.plan === "function" ? rule.plan(context) : rule.plan;
        break;
      }
    } catch (err) {
      continue;
    }
  }
  if (!plan) {
    if (/shop|store|stall|outfitter|bazaar/.test(context.lower)) {
      plan = buildGeneralGoodsPlan(context);
    } else if (context.type === "merchant") {
      plan = buildMerchantPlan(context);
    }
  }
  if (!plan) {
    return { sells: [], buys: [], resale: false, context };
  }
  const sells = (plan.sells || []).map(section => finalizeSection(section, context));
  const buys = plan.buys ? uniqueStrings(plan.buys) : sells.map(section => section.inventoryKey);
  return {
    sells,
    buys,
    resale: plan.resale !== undefined ? plan.resale : context.type === "merchant",
    context
  };
}

export async function itemsByCategory(section, context) {
  let limit = limitForSection(section, context);
  if (limit <= 0) return [];
  const categories = expandCategoryKey(section.key);
  if (!categories.length) return [];
  const adjustments = deriveSeasonalAdjustments(section, context);
  if (limit > 0) {
    const adjustedLimit = Math.max(1, Math.round(limit * adjustments.limitMultiplier));
    limit = Math.max(1, adjustedLimit);
  }

  if (shouldUseArmory(section, context)) {
    const armoryInventory = await buildArmoryInventory(section, context, limit, adjustments);
    if (armoryInventory.length) return armoryInventory;
  }

  return buildEconomyInventory(section, context, categories, limit, adjustments);
}

async function buildEconomyInventory(section, context, categories, limit, adjustments) {
  const items = await loadEconomyItems();
  let filtered = items.filter(item => categories.includes(item.category_key));
  if (!filtered.length) return [];

  if (context.scale === "small" && !section.allowBulk) {
    filtered = filtered.filter(item => (item.bulk_discount_threshold || 0) === 0);
  }

  const supplyProfiles = supplyProfilesForSection(section, context);
  const qualities = qualityForSection(section, context);
  let supplyMatches = collectSupplyMatches(filtered, supplyProfiles, qualities);
  if (!supplyMatches.length && section.allowQualityFallback !== false) {
    const fallback = fallbackQualities(qualities, context);
    supplyMatches = collectSupplyMatches(filtered, supplyProfiles, fallback);
  }
  const supplyInternal = new Set(
    supplyMatches.map(item => String(item.internal_name || "").trim().toLowerCase()).filter(Boolean)
  );
  if (supplyInternal.size) {
    filtered = filtered.filter(item => !supplyInternal.has(String(item.internal_name || "").trim().toLowerCase()));
  }

  filtered = filtered.filter(item => qualities.includes(item.quality_tier));
  if (!filtered.length && section.allowQualityFallback !== false) {
    const fallback = fallbackQualities(qualities, context);
    filtered = items.filter(item => categories.includes(item.category_key) && fallback.includes(item.quality_tier));
  }

  if (!filtered.length) return [];

  const extraKeywords = normalizeKeywords([
    ...(context.productKeywords || []),
    ...(context.productionGoods || []),
    ...((context.yields && Object.values(context.yields).flat()) || []),
  ]);
  const seasonalKeywords = normalizeKeywords(adjustments.keywordHints);
  const combinedKeywords = Array.from(
    new Set([...(section.keywords || []), ...extraKeywords, ...seasonalKeywords])
  );
  filtered = filterByKeywords(filtered, combinedKeywords);
  filtered = filterByExclusions(filtered, section.excludeKeywords);
  filtered = filterByRegionTags(filtered, context.regionTags);

  let sorted = sortItemsForSection(filtered, section);
  sorted = applyPreferenceOrdering(sorted, adjustments.preferKeywords, adjustments.avoidKeywords);
  const remaining = Math.max(0, limit - supplyMatches.length);
  const trimmed = remaining > 0 ? sorted.slice(0, remaining) : [];
  const combined = supplyMatches.slice(0, limit).concat(trimmed);
  return finalizeInventoryItems(combined, section, context, adjustments);
}

async function buildArmoryInventory(section, context, limit, adjustments) {
  const module = await loadArmoryModule();
  if (!module || !module.ARMORY) return [];
  const categories = armoryCategoriesForContext(context || {});
  const seen = new Set();
  const pool = [];
  for (const category of categories) {
    const list = module.ARMORY[category] || [];
    for (const record of list) {
      if (!record) continue;
      const key = `${record.name}|${record.quality}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push(record);
    }
  }
  if (!pool.length) return [];
  const converted = convertArmoryRecords(pool);
  const qualities = qualityForSection(section, context);
  let filtered = converted.filter(item => qualities.includes(item.quality_tier));
  if (!filtered.length && section.allowQualityFallback !== false) {
    const fallback = fallbackQualities(qualities, context);
    filtered = converted.filter(item => fallback.includes(item.quality_tier));
  }
  if (!filtered.length) return [];

  const extraKeywords = normalizeKeywords([
    ...(context.productKeywords || []),
    ...(context.productionGoods || []),
    ...((context.yields && Object.values(context.yields).flat()) || []),
  ]);
  const seasonalKeywords = normalizeKeywords(adjustments.keywordHints);
  const combinedKeywords = Array.from(
    new Set([...(section.keywords || []), ...extraKeywords, ...seasonalKeywords])
  );
  filtered = filterByKeywords(filtered, combinedKeywords);
  filtered = filterByExclusions(filtered, section.excludeKeywords);
  filtered = filterByRegionTags(filtered, context.regionTags);

  let sorted = sortItemsForSection(filtered, section);
  sorted = applyPreferenceOrdering(sorted, adjustments.preferKeywords, adjustments.avoidKeywords);
  const trimmed = sorted.slice(0, limit);
  return finalizeInventoryItems(trimmed, section, context, adjustments);
}
