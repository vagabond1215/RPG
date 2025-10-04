import { SPELLBOOK, MILESTONES } from "./data/game/spells.js";
import { WEAPON_SKILLS } from "./data/game/weapon_skills.js";
import { characterTemplate } from "./data/game/core.js";
import { gainProficiency, proficiencyCap } from "./data/game/proficiency_base.js";
import { getRaceStartingAttributes, RACE_DESCRIPTIONS } from "./data/game/race_attrs.js";
import { maxHP, maxMP, maxStamina } from "./data/game/resources.js";
import {
  DENOMINATIONS,
  CURRENCY_VALUES,
  convertCurrency,
  toIron,
  fromIron,
  parseCurrency,
  createEmptyCurrency,
  formatCurrency,
  cpToCoins,
} from "./data/economy/currency.js";
import { WEAPON_SLOTS, ARMOR_SLOTS, TRINKET_SLOTS } from "./data/game/equipment.js";
import { LOCATIONS } from "./data/game/locations.js";
import { applyWavesBreakRegistry } from "./data/game/waves_break_registry.js";
import {
  TidefallCalendar,
  dateKey,
  getSeasonForDate,
  MONTHS,
  DAYS_PER_MONTH,
} from "./data/game/calendar.js";
import {
  createDefaultWeatherGenerator,
  createDeterministicRandom as createWeatherRandom,
} from "./data/game/weather.js";
import {
  generateNpcName,
  clearNameGenerator,
  registerFamily,
} from "./data/game/name_generator.js";
import { CITY_NAV } from "./data/game/city_nav.js";
import { composeImagePrompt } from "./data/game/image_prompts.js";
import { DEFAULT_NAMES } from "./data/game/names.js";
import { WAVES_BREAK_BACKSTORIES } from "./data/game/waves_break_backstories.js";
import {
  elementalProficiencyMap,
  schoolProficiencyMap,
  applySpellProficiencyGain,
} from "./data/game/spell_proficiency.js";
import { trainCraftSkill } from "./data/game/trainers.js";
import { performGathering } from "./data/game/gathering_proficiency.js";
import { performOutdoorActivity } from "./data/game/outdoor_skills.js";
import { performHunt } from "./data/game/hunting_proficiency.js";
import {
  listEnvironmentActions,
  getEnvironmentDefinition,
  buildEnvironmentActionId,
  parseEnvironmentActionId,
  describeEnvironmentAction,
} from "./data/game/environment_interactions.js";
import {
  ADVENTURERS_GUILD_RANKS,
  determineOwnership,
  getJobRolesForBuilding,
  JOB_ROLE_DATA,
  getBusinessProfileByName,
} from "./data/game/buildings.js";
import { characterBuilds } from "./data/game/character_builds.js";
import { shopCategoriesForBuilding, itemsByCategory } from "./data/game/shop.js";

applyWavesBreakRegistry(LOCATIONS);

const worldCalendar = new TidefallCalendar();
const weatherSystem = createDefaultWeatherGenerator(worldCalendar.today());
const appContainer = document.getElementById('app');

function totalXpForLevel(level) {
  return Math.floor((4 * Math.pow(level, 3)) / 5);
}

function xpForNextLevel(level) {
  return totalXpForLevel(level + 1) - totalXpForLevel(level);
}

window.SPELLBOOK = SPELLBOOK;
window.WEAPON_SKILLS = WEAPON_SKILLS;
window.DENOMINATIONS = DENOMINATIONS;
window.CURRENCY_VALUES = CURRENCY_VALUES;
window.convertCurrency = convertCurrency;
window.toIron = toIron;
window.fromIron = fromIron;
window.parseCurrency = parseCurrency;
window.formatCurrency = formatCurrency;
window.cpToCoins = cpToCoins;
window.LOCATIONS = LOCATIONS;
window.generateNpcName = generateNpcName;
window.registerNpcFamily = registerFamily;
window.resetNpcNameGenerator = clearNameGenerator;
window.ADVENTURERS_GUILD_RANKS = ADVENTURERS_GUILD_RANKS;
window.performHunt = performHunt;
window.WORLD_CALENDAR = worldCalendar;
window.WEATHER_SYSTEM = weatherSystem;
window.advanceWorldDay = (days = 1) => {
  worldCalendar.advance(days);
  updateTopMenuIndicators();
};
window.currentWeatherFor = (region = "waves_break", habitat = 'urban') =>
  weatherSystem.getDailyWeather(region, habitat, worldCalendar.today());
window.getLocationLogHistory = getLocationLogHistory;

const NAV_ICONS = {
  location: '🗺️',
  district: '🏙️',
  building: '🏠',
  exit: '🚪',
  interaction: '⚙️',
  quests: '🪧',
};

const QUEST_BOARD_ICON = 'assets/images/icons/Quests.png';

const ADVENTURERS_GUILD_RANK_ORDER = [
  'None',
  'Cold Iron',
  'Steel',
  'Copper',
  'Bronze',
  'Brass',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
];

const QUEST_DISTRICT_ALIASES = {
  'Harbor Ward': 'The Port District',
  'Upper Ward': 'The Upper Ward',
  'Little Terns': 'Little Terns',
  'Greensoul Hill': 'Greensoul Hill',
  'Lower Gardens': 'The Lower Gardens',
  'High Road': 'The High Road District',
  Farmlands: 'The Farmlands',
  "Wave's Break": "Wave's Break",
};

const QUEST_BOARD_BUILDINGS = new Set(['North Gate', 'South Gate']);

const MERCHANTS_WHARF_DYNAMIC_BOARD = "Merchants' Wharf Pier Leads";

const CITY_SLUGS = {
  "Wave's Break": "waves_break",
  "Coral Keep": "coral_keep",
  "Timber Grove": "timber_grove",
  Creekside: "creekside",
  "Warm Springs": "warm_springs",
  "Dancing Pines": "dancing_pines",
  "Mountain Top": "mountain_top",
  Corona: "corona",
  "Corner Stone": "corner_stone",
  "Dragon's Reach Road": "dragons_reach_road",
  Whiteheart: "whiteheart",
};

const REGION_LABELS = Object.entries(CITY_SLUGS).reduce((map, [name, slug]) => {
  map[slug] = name;
  return map;
}, {});

const BACKSTORY_MAP = {
  "Wave's Break": WAVES_BREAK_BACKSTORIES,
};

const STREET_VENDOR_ICON = 'assets/images/icons/Economy/Sell.png';
const STREET_VENDOR_SECURITY_MODIFIERS = { high: 0.25, medium: 0.75, low: 1.1 };
const STREET_VENDOR_TIME_MODIFIERS = {
  preDawn: 0.2,
  morning: 0.85,
  day: 1,
  evening: 0.6,
  night: 0.1,
};
const STREET_VENDOR_WEATHER_MODIFIERS = {
  storm: 0.05,
  snow: 0.15,
  sleet: 0.2,
  rain: 0.35,
  drizzle: 0.6,
  fog: 0.65,
  clear: 1.15,
  'partly cloudy': 1,
};

const DEFAULT_STREET_VENDOR_BASE_CHANCE = 0.3;

const STREET_VENDOR_THEMES = [
  {
    id: 'coastal-food',
    tags: ['coastal'],
    label: 'Pier Street Food',
    description:
      'Steam curls from a brazier of sizzling seafood skewers and spiced hand-pies, drawing longshoremen with the promise of a quick bite.',
    sections: [
      {
        key: 'FoodDrink',
        label: 'Hot Bites',
        keywords: ['smoke', 'skewer', 'fish', 'clam', 'roll', 'pie', 'stew'],
        maxItems: 3,
        preferBasics: true,
      },
    ],
    discount: 0.85,
    maxQuantity: 3,
    names: ['Harbor Skillet', 'Gullwing Snacks', 'Brinepan Vendor'],
  },
  {
    id: 'fresh-produce',
    tags: ['farmland', 'artisan'],
    label: 'Fresh Produce Cart',
    description:
      'Bushels of greens and berries spill over a handcart, dew still clinging to leaves from the morning harvest.',
    sections: [
      {
        key: 'Produce',
        label: 'Seasonal Harvest',
        keywords: [],
        maxItems: 4,
        preferBasics: true,
      },
    ],
    discount: 0.8,
    maxQuantity: 4,
    names: ['Morning Harvest Wagon', 'Sunrise Bushels', 'Greencrest Cart'],
  },
  {
    id: 'artisan-goods',
    tags: ['urban', 'artisan', 'festival'],
    label: 'Artisan Trinkets',
    description:
      'A folding stall gleams with hand-tooled trinkets and bright scarves, the vendor touting their makers between haggled deals.',
    sections: [
      {
        key: 'Accessories',
        label: 'Handcrafted Wares',
        keywords: ['bracelet', 'charm', 'token', 'lace', 'scarf'],
        maxItems: 3,
        allowQualityFallback: true,
      },
      {
        key: 'Textiles',
        label: 'Small Cloth Goods',
        keywords: ['scarf', 'ribbon', 'kerchief'],
        maxItems: 2,
        allowQualityFallback: true,
      },
    ],
    discount: 0.88,
    maxQuantity: 2,
    names: ['Ribbon & Ring Stall', 'Silver Thread Bracelets', 'Market Trinket Rack'],
  },
  {
    id: 'travel-supplies',
    tags: ['road', 'forest', 'urban'],
    label: "Traveler's Pack",
    description:
      'Bundles of oilskin-wrapped gear and refurbished tools hang from a makeshift awning, perfect for a quick resupply before the road.',
    sections: [
      {
        key: 'Adventuring Gear',
        label: 'Trail Gear',
        keywords: ['rope', 'kit', 'pack', 'torch', 'supply'],
        maxItems: 3,
        preferBasics: true,
      },
      {
        key: 'Tools',
        label: 'Quick Repairs',
        keywords: ['tool', 'hammer', 'saw', 'hook'],
        maxItems: 2,
      },
    ],
    discount: 0.9,
    maxQuantity: 2,
    names: ['Roadside Outfitters', 'Pack & Patch Stand', 'Wayfarer’s Tray'],
  },
  {
    id: 'herbal',
    tags: ['herbal', 'forest', 'festival'],
    label: 'Herbal Remedies',
    description:
      'Bundles of fragrant herbs and small tincture vials line the table, the vendor murmuring about soothing teas and salves.',
    sections: [
      {
        key: 'Reagents',
        label: 'Herbs & Tonics',
        keywords: ['herb', 'poultice', 'tea', 'salve'],
        maxItems: 3,
        allowQualityFallback: true,
      },
    ],
    discount: 0.87,
    maxQuantity: 3,
    names: ['Greensoul Remedies', 'Terrace Tinctures', 'Healing Herb Basket'],
  },
  {
    id: 'festival-sweets',
    tags: ['festival', 'highcourt', 'urban'],
    label: 'Festival Confections',
    description:
      'Sugared nuts and glazed pastries are artfully arranged beneath ribbons, offered only when the district celebrates.',
    sections: [
      {
        key: 'Confectionery',
        label: 'Sweet Treats',
        keywords: ['cake', 'pastry', 'candy', 'sweet'],
        maxItems: 3,
        allowQualityFallback: true,
      },
    ],
    discount: 0.9,
    maxQuantity: 3,
    eventOnly: true,
    names: ['Solstice Sweets', 'Festival Sugarworks', 'Courtly Delights'],
  },
];

const streetVendorStates = new Map();

function resolveQuestBinding(quest, boardName) {
  const source = quest?.visibilityBinding ? { ...quest.visibilityBinding } : {};
  if (!source.region) source.region = "waves_break";
  if (!source.habitat) source.habitat = 'urban';
  if (!source.business) source.business = quest?.location || boardName;
  if (!source.board) source.board = boardName;
  if (!source.location) source.location = source.business || boardName;
  if (!source.district) {
    source.district =
      source.habitat === 'farmland'
        ? 'Farmlands'
        : source.habitat === 'coastal'
          ? 'Harbor Ward'
          : "Wave's Break";
  }
  return source;
}

function evaluateQuestAvailability(quest, boardName) {
  const binding = resolveQuestBinding(quest, boardName);
  const date = worldCalendar.today();
  let weather;
  try {
    weather = weatherSystem.getDailyWeather(binding.region, binding.habitat, date);
  } catch (err) {
    weather = weatherSystem.getDailyWeather('waves_break', 'urban', date);
  }
  if (!quest.visibility) {
    return { available: true, demand: 1, reason: 'Standing posting', weather };
  }
  const seed = `${binding.region}:${binding.habitat}:${binding.business}:${dateKey(date)}:${quest.title}`;
  const rng = createWeatherRandom(seed);
  const result = quest.visibility({
    date,
    weather,
    random: rng,
    binding,
    laborCondition: quest.laborCondition,
    questTitle: quest.title,
  });
  return { ...result, weather };
}

function boardWeatherSnapshot(quests, boardName) {
  if (!quests.length) return null;
  const candidate = quests.find((quest) => quest.visibilityBinding) || quests[0];
  const binding = resolveQuestBinding(candidate, boardName);
  const weather = weatherSystem.getDailyWeather(
    binding.region,
    binding.habitat,
    worldCalendar.today(),
  );
  return { weather, binding };
}

function questKey(boardName, questTitle) {
  return `${boardName}::${questTitle}`;
}

function normalizeDistrictName(name) {
  return name ? name.replace(/^the\s+/i, '').toLowerCase() : '';
}

function boardMatchesDistrict(bindingDistrict, navDistrict) {
  if (!navDistrict) return false;
  const normalizedNav = normalizeDistrictName(navDistrict);
  if (!bindingDistrict) {
    return normalizedNav === normalizeDistrictName("Wave's Break");
  }
  const alias = QUEST_DISTRICT_ALIASES[bindingDistrict] || bindingDistrict;
  return normalizeDistrictName(alias) === normalizedNav;
}

function normalizePlaceName(name) {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .replace(/\bquest board\b$/i, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function boardMatchesBuildingName(binding, boardName, buildingSet) {
  if (!buildingSet || !buildingSet.size) return false;
  const location = normalizePlaceName(binding?.location);
  if (location && buildingSet.has(location)) return true;
  const business = normalizePlaceName(binding?.business);
  if (business && buildingSet.has(business)) return true;
  const board = normalizePlaceName(boardName);
  if (board && buildingSet.has(board)) return true;
  return false;
}

function questBoardsForDistrict(city, district, options = {}) {
  const loc = LOCATIONS[city];
  if (!loc || !loc.questBoards) return [];
  const { excludeBuildingBoards = false, buildingNames = [] } = options;
  const buildingSet = new Set(
    (buildingNames || []).map(name => normalizePlaceName(name)).filter(Boolean),
  );
  const { groups } = collectQuestBoardGroups(loc, {
    predicate: (binding, boardName) =>
      boardMatchesDistrict(binding.district, district),
  });
  const entries = [];
  groups.forEach(group => {
    const containsBuildingBoard = group.boards.some(section =>
      section.quests.some(entry =>
        boardMatchesBuildingName(entry.binding, section.name, buildingSet),
      ),
    );
    if (excludeBuildingBoards && containsBuildingBoard) {
      return;
    }
    entries.push(group);
  });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return entries;
}

function questBoardsForBuilding(city, district, building) {
  const loc = LOCATIONS[city];
  if (!loc || !loc.questBoards || !building) return [];
  const target = normalizePlaceName(building);
  if (!target) return [];
  const buildingSet = new Set([target]);
  const { groups } = collectQuestBoardGroups(loc, {
    predicate: (binding, boardName) =>
      boardMatchesDistrict(binding.district, district) &&
      boardMatchesBuildingName(binding, boardName, buildingSet),
  });
  const entries = Array.from(groups.values());
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return entries;
}

function collectQuestBoardGroups(loc, options = {}) {
  const predicate = typeof options.predicate === 'function' ? options.predicate : null;
  const interim = new Map();
  const boardIndex = new Map();
  Object.entries(loc.questBoards || {}).forEach(([boardName, quests]) => {
    if (!Array.isArray(quests) || !quests.length) return;
    const questEntries = [];
    quests.forEach(quest => {
      const binding = resolveQuestBinding(quest, boardName);
      if (predicate && !predicate(binding, boardName, quest)) return;
      questEntries.push({ quest, binding });
    });
    if (!questEntries.length) return;
    const locationLabel =
      questEntries[0].binding.location || questEntries[0].binding.board || boardName;
    const locationKey = normalizePlaceName(locationLabel || boardName);
    if (!locationKey) return;
    let group = interim.get(locationKey);
    if (!group) {
      group = {
        key: locationKey,
        name: locationLabel,
        boards: [],
        districts: new Set(),
      };
      interim.set(locationKey, group);
    }
    questEntries.forEach(entry => {
      if (entry.binding?.district) {
        group.districts.add(entry.binding.district);
      }
    });
    group.boards.push({
      name: boardName,
      quests: questEntries,
    });
    boardIndex.set(normalizePlaceName(boardName), locationKey);
  });
  const groups = new Map();
  interim.forEach(group => {
    const district = group.districts.size === 1
      ? Array.from(group.districts)[0]
      : null;
    groups.set(group.key, {
      key: group.key,
      name: group.name,
      district,
      boards: group.boards.map(section => ({
        name: section.name,
        quests: section.quests.map(entry => ({
          quest: entry.quest,
          binding: entry.binding,
        })),
      })),
    });
  });
  return { groups, boardIndex };
}

function findQuestBoardGroup(loc, identifier, options = {}) {
  if (!loc || !loc.questBoards) return null;
  const normalized = normalizePlaceName(identifier);
  if (!normalized) return null;
  const district = options.district || null;
  const building = options.building || null;
  const buildingSet = building
    ? new Set([normalizePlaceName(building)].filter(Boolean))
    : null;
  const predicate = (binding, boardName) => {
    if (district && !boardMatchesDistrict(binding.district, district)) {
      return false;
    }
    if (buildingSet && !boardMatchesBuildingName(binding, boardName, buildingSet)) {
      return false;
    }
    return true;
  };
  let { groups, boardIndex } = collectQuestBoardGroups(loc, { predicate });
  let key = boardIndex.get(normalized) || normalized;
  let group = groups.get(key) || null;
  if (!group) {
    ({ groups, boardIndex } = collectQuestBoardGroups(loc));
    key = boardIndex.get(normalized) || normalized;
    group = groups.get(key) || null;
  }
  return group;
}

function extractGuildRanks(text) {
  if (!text) return [];
  const matches = String(text).match(/Adventurers'? Guild[^.;\n]*/gi) || [];
  const found = new Set();
  matches.forEach(segment => {
    const normalized = segment.toLowerCase();
    ADVENTURERS_GUILD_RANK_ORDER.forEach(rank => {
      if (rank === 'None') return;
      if (normalized.includes(rank.toLowerCase())) {
        found.add(rank);
      }
    });
  });
  return Array.from(found);
}

function collectGuildRankRequirements(quest) {
  const sources = [];
  if (quest.guildRankRequirement) {
    sources.push(quest.guildRankRequirement);
  }
  if (quest.requirements) {
    if (Array.isArray(quest.requirements)) {
      quest.requirements.forEach(req => {
        if (typeof req === 'string') sources.push(req);
      });
    } else if (typeof quest.requirements === 'string') {
      sources.push(quest.requirements);
    }
  }
  const ranks = new Set();
  sources.forEach(text => {
    extractGuildRanks(text).forEach(rank => ranks.add(rank));
  });
  return Array.from(ranks);
}

function rankValue(rank) {
  if (!rank) return null;
  const normalized = String(rank).trim().toLowerCase();
  const index = ADVENTURERS_GUILD_RANK_ORDER.findIndex(
    name => name.toLowerCase() === normalized,
  );
  return index >= 0 ? index : null;
}

function evaluateQuestEligibility(quest) {
  if (!currentCharacter) {
    return { canAccept: false, reasons: ['No active character.'] };
  }
  const reasons = [];
  const requiredRanks = collectGuildRankRequirements(quest)
    .map(rankValue)
    .filter(value => value != null);
  if (requiredRanks.length) {
    const minRequired = Math.min(...requiredRanks);
    const playerRank = rankValue(currentCharacter.adventurersGuildRank || 'None');
    if (playerRank == null || playerRank < minRequired) {
      const label = ADVENTURERS_GUILD_RANK_ORDER[minRequired];
      reasons.push(`Requires Adventurers' Guild ${label} rank or higher.`);
    }
  }
  return { canAccept: reasons.length === 0, reasons };
}

function formatWeatherSummary(report) {
  const points = [`${report.condition} ${report.temperatureC.toFixed(1)}°C`];
  if (report.precipitationMm > 0) {
    points.push(`${report.precipitationMm.toFixed(1)} mm precip.`);
  }
  if (report.droughtStage !== 'none') {
    points.push(`Drought ${report.droughtStage}`);
  }
  if (report.floodRisk !== 'none') {
    points.push(`Flood ${report.floodRisk}`);
  }
  return `${points.join(' • ')} — ${report.narrative || 'conditions steady.'}`;
}

function matchCase(word, pattern) {
  if (pattern.toUpperCase() === pattern) return word.toUpperCase();
  if (pattern[0].toUpperCase() === pattern[0]) return word[0].toUpperCase() + word.slice(1);
  return word;
}

function swapGenderedTerms(text, sex) {
  if (!text || !sex) return text;
  if (sex === 'Male') {
    text = text.replace(/\bdaughter\b/gi, m => matchCase('son', m));
    text = text.replace(/\bgirl\b/gi, m => matchCase('boy', m));
    text = text.replace(/\bmother\b/gi, m => matchCase('father', m));
    text = text.replace(/\bsister\b/gi, m => matchCase('brother', m));
    text = text.replace(/\bniece\b/gi, m => matchCase('nephew', m));
    text = text.replace(/\baunt\b/gi, m => matchCase('uncle', m));
    text = text.replace(/\bwomen\b/gi, m => matchCase('men', m));
    text = text.replace(/\bwoman\b/gi, m => matchCase('man', m));
    text = text.replace(/\bshe\b/gi, m => matchCase('he', m));
    text = text.replace(/\bherself\b/gi, m => matchCase('himself', m));
    text = text.replace(/\bher\b(?=\s+[a-z])/gi, m => matchCase('his', m));
    text = text.replace(/\bher\b/gi, m => matchCase('him', m));
  } else {
    text = text.replace(/\bson\b/gi, m => matchCase('daughter', m));
    text = text.replace(/\bboy\b/gi, m => matchCase('girl', m));
    text = text.replace(/\bfather\b/gi, m => matchCase('mother', m));
    text = text.replace(/\bbrother\b/gi, m => matchCase('sister', m));
    text = text.replace(/\bnephew\b/gi, m => matchCase('niece', m));
    text = text.replace(/\buncle\b/gi, m => matchCase('aunt', m));
    text = text.replace(/\bmen\b/gi, m => matchCase('women', m));
    text = text.replace(/\bman\b/gi, m => matchCase('woman', m));
    text = text.replace(/\bhe\b/gi, m => matchCase('she', m));
    text = text.replace(/\bhimself\b/gi, m => matchCase('herself', m));
    text = text.replace(/\bhis\b(?=\s+[a-z])/gi, m => matchCase('her', m));
    text = text.replace(/\bhis\b/gi, m => matchCase('hers', m));
    text = text.replace(/\bhim\b/gi, m => matchCase('her', m));
  }
  return text;
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  if (value == null) return '';
  return escapeHtml(value).replace(/\r?\n/g, '&#10;');
}

function titleize(value) {
  if (value == null) return '';
  return String(value)
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function replaceCharacterRefs(text, character) {
  if (!text) return text;
  let result = text;
  if (character.race) {
    result = result.replace(/\[Race\]/g, capitalize(character.race));
    result = result.replace(/\[race\]/g, character.race.toLowerCase());
  }
  if (character.sex) {
    result = swapGenderedTerms(result, character.sex);
  }
  return result;
}

function citySlug(name) {
  return CITY_SLUGS[name] || name.toLowerCase().replace(/'s/g, 's').replace(/[^a-z0-9]+/g, '_');
}

function districtFileName(name) {
  let base = name;
  if (!base.endsWith(' District')) base += ' District';
  if (base.startsWith('The ') && base !== 'The High Road District') base = base.slice(4);
  return `${base}.png`;
}

function getDistrictIcon(city, district) {
  return `assets/images/icons/${citySlug(city)}/${districtFileName(district)}`;
}

function getBuildingIcon(city, district, building) {
  const cityData = CITY_NAV[city];
  const districtData = cityData && cityData.districts[district];
  if (!districtData) return "";
  const point = districtData.points.find(
    pt => pt.type === 'building' && (pt.target === building || pt.name === building)
  );
  return point && point.icon ? point.icon : "";
}

function districtVendorPolicy(city, district) {
  return CITY_NAV[city]?.districts?.[district]?.vendorPolicy || null;
}

function districtVendorTags(policy, city, district) {
  const tags = new Set();
  (policy?.tags || []).forEach(tag => tags.add(tag));
  const lowerCity = (city || '').toLowerCase();
  if (lowerCity.includes('port') || lowerCity.includes('harbor')) tags.add('coastal');
  const lowerDistrict = (district || '').toLowerCase();
  if (/port|harbor|dock|wharf|quay/.test(lowerDistrict)) tags.add('coastal');
  if (/garden|market|plaza|festival/.test(lowerDistrict)) tags.add('festival');
  if (/farmland|orchard|fields|farm/.test(lowerDistrict)) tags.add('farmland');
  if (/road|gate|high road/.test(lowerDistrict)) tags.add('road');
  if (/hill|grove|temple/.test(lowerDistrict)) tags.add('herbal');
  if (/upper ward|salon|keep/.test(lowerDistrict)) tags.add('highcourt');
  tags.add('urban');
  return Array.from(tags);
}

function districtHabitat(city, district) {
  const lower = (district || '').toLowerCase();
  if (/farmland|orchard|fields|pasture|meadow/.test(lower)) return 'farmland';
  if (/port|harbor|dock|wharf|quay/.test(lower)) return 'coastal';
  if (/forest|grove|wood/.test(lower)) return 'forest';
  return 'urban';
}

function streetVendorTimeBand(hour) {
  if (!Number.isFinite(hour)) return 'day';
  const h = ((hour % 24) + 24) % 24;
  if (h < 6) return 'preDawn';
  if (h < 10) return 'morning';
  if (h < 17) return 'day';
  if (h < 21) return 'evening';
  return 'night';
}

function getDistrictWeather(city, district) {
  const date = worldCalendar.today();
  const habitat = districtHabitat(city, district);
  const slug = citySlug(city);
  try {
    return weatherSystem.getDailyWeather(slug, habitat, date);
  } catch (err) {
    try {
      return weatherSystem.getDailyWeather('waves_break', habitat, date);
    } catch (err2) {
      return null;
    }
  }
}

function normalizeVendorDate(source, fallbackYear) {
  if (!source) {
    return { year: fallbackYear, monthIndex: 0, day: 1 };
  }
  const year = source.year != null ? source.year : fallbackYear;
  const monthIndex = source.monthIndex != null ? source.monthIndex : 0;
  const day = source.day != null ? source.day : 1;
  return { year, monthIndex, day };
}

function vendorDateKey(date) {
  const year = String(date.year != null ? date.year : '').padStart(4, '0');
  const month = String(date.monthIndex != null ? date.monthIndex : 0).padStart(2, '0');
  const day = String(date.day != null ? date.day : 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isStreetVendorEventActive(policy, date) {
  if (!policy || !Array.isArray(policy.eventWindows) || !policy.eventWindows.length) return false;
  const target = normalizeVendorDate(date, date.year);
  return policy.eventWindows.some(window => {
    if (!window) return false;
    const start = window.start ? normalizeVendorDate(window.start, date.year) : null;
    const end = window.end ? normalizeVendorDate(window.end, date.year) : null;
    if (start && vendorDateKey(target) < vendorDateKey(start)) return false;
    if (end && vendorDateKey(target) > vendorDateKey(end)) return false;
    return true;
  });
}

function computeStreetVendorChance(policy, weather, timeBand, eventActive) {
  if (!policy) return 0;
  const base = Number.isFinite(policy.baseChance) ? policy.baseChance : DEFAULT_STREET_VENDOR_BASE_CHANCE;
  const security = STREET_VENDOR_SECURITY_MODIFIERS[policy.security || 'medium'] || 0.75;
  const time = STREET_VENDOR_TIME_MODIFIERS[timeBand] || 1;
  const condition = weather?.condition || 'partly cloudy';
  const weatherMod = STREET_VENDOR_WEATHER_MODIFIERS[condition] || 0.9;
  let chance = base * security * time * weatherMod;
  if (eventActive) {
    const eventBoost = policy.eventBoost != null ? policy.eventBoost : 1.8;
    chance *= eventBoost;
  }
  return Math.max(0, Math.min(chance, 0.95));
}

function streetVendorThemeFor(policy, city, district, eventActive, rng) {
  const tags = districtVendorTags(policy, city, district);
  const candidates = STREET_VENDOR_THEMES.filter(theme => {
    if (theme.eventOnly && !eventActive) return false;
    if (!theme.tags || !theme.tags.length) return true;
    return theme.tags.some(tag => tags.includes(tag));
  });
  const pool = candidates.length ? candidates : STREET_VENDOR_THEMES;
  const index = Math.floor(rng() * pool.length);
  return pool[Math.max(0, Math.min(pool.length - 1, index))];
}

function vendorStateKey(city, district) {
  return `${city || ''}::${district || ''}`;
}

function getStreetVendorState(city, district) {
  const key = vendorStateKey(city, district);
  if (!streetVendorStates.has(key)) {
    streetVendorStates.set(key, { dateKey: null, timeBand: null, evaluated: false, vendor: null });
  }
  return streetVendorStates.get(key);
}

function evaluateStreetVendor(city, district) {
  if (!city || !district) return null;
  const state = getStreetVendorState(city, district);
  const today = worldCalendar.today();
  const todayKey = vendorDateKey(today);
  const timeOfDay = currentCharacter ? currentCharacter.timeOfDay : null;
  const timeBand = streetVendorTimeBand(timeOfDay);
  if (state.dateKey !== todayKey || state.timeBand !== timeBand) {
    state.dateKey = todayKey;
    state.timeBand = timeBand;
    state.evaluated = false;
    state.vendor = null;
  }
  if (state.evaluated) {
    return state.vendor;
  }
  state.evaluated = true;
  const policy = districtVendorPolicy(city, district);
  if (!policy) {
    state.vendor = null;
    return null;
  }
  const date = worldCalendar.today();
  const eventActive = isStreetVendorEventActive(policy, date);
  const vendorMode = policy.type === 'none' && eventActive && policy.eventType ? policy.eventType : policy.type;
  if (vendorMode !== 'street') {
    state.vendor = null;
    return null;
  }
  const weather = getDistrictWeather(city, district);
  const chance = computeStreetVendorChance(policy, weather, timeBand, eventActive);
  if (chance <= 0) {
    state.vendor = null;
    return null;
  }
  const rngKey = `${citySlug(city)}:${district}:${todayKey}:${timeBand}`;
  const rng = createWeatherRandom(rngKey);
  if (rng() > chance) {
    state.vendor = null;
    return null;
  }
  const theme = streetVendorThemeFor(policy, city, district, eventActive, rng);
  const namePool = theme.names || ['Street Vendor'];
  const title = namePool[Math.floor(rng() * namePool.length)] || 'Street Vendor';
  state.vendor = {
    key: rngKey,
    city,
    district,
    policy,
    theme,
    name: title,
    label: `${title}`,
    eventActive,
    weather,
    timeBand,
    timeOfDay,
    date,
    habitat: districtHabitat(city, district),
    tags: districtVendorTags(policy, city, district),
    discount: theme.discount || 0.9,
    maxQuantity: theme.maxQuantity || 2,
    goods: [],
    goodsLoaded: false,
    description: theme.description || '',
    icon: STREET_VENDOR_ICON,
    rngSeed: rngKey,
  };
  return state.vendor;
}

async function ensureStreetVendorInventory(vendor) {
  if (!vendor || vendor.goodsLoaded) return vendor;
  const rng = createWeatherRandom(`${vendor.rngSeed}:inventory`);
  const context = {
    name: vendor.name,
    lower: vendor.name.toLowerCase(),
    scale: 'small',
    wealth: 'modest',
    type: 'street',
    words: vendor.tags,
    city: vendor.city,
    district: vendor.district,
    habitat: vendor.habitat,
    weather: vendor.weather,
    date: vendor.date,
    season: vendor.date ? getSeasonForDate(vendor.date) : null,
    timeOfDay: vendor.timeOfDay ?? null,
    timeLabel: describeTimeOfDay(vendor.timeOfDay),
    regionTags: vendor.tags,
    productKeywords: [],
    yields: {},
  };
  const goods = [];
  for (const section of vendor.theme.sections || []) {
    const baseSection = {
      key: section.key,
      label: section.label,
      limit: section.limit || { small: 6, medium: 6, large: 8 },
      keywords: section.keywords || [],
      allowQualityFallback: section.allowQualityFallback !== false,
      preferBasics: Boolean(section.preferBasics),
      allowBulk: false,
    };
    const items = await itemsByCategory(baseSection, context);
    if (!items || !items.length) continue;
    const maxItems = Math.max(1, section.maxItems || 2);
    const sample = [];
    const pool = items.slice();
    while (pool.length && sample.length < maxItems) {
      const idx = Math.floor(rng() * pool.length);
      sample.push(pool.splice(idx, 1)[0]);
    }
    sample.forEach(item => {
      const basePrice = item.price;
      const price = Math.max(1, Math.round(basePrice * vendor.discount));
      const qty = Math.max(1, Math.round(rng() * vendor.maxQuantity));
      goods.push({
        item,
        basePrice,
        price,
        quantity: qty,
        maxQuantity: qty,
        sectionLabel: baseSection.label,
        inventoryKey: baseSection.key,
      });
    });
  }
  vendor.goods = goods;
  vendor.goodsLoaded = true;
  return vendor;
}

function streetVendorSoldOut(vendor) {
  if (!vendor || !vendor.goodsLoaded) return false;
  return vendor.goods.every(good => good.quantity <= 0);
}

function getDistrictsEnvelope(city) {
  return `assets/images/icons/${citySlug(city)}/Districts Envelope.png`;
}

function getCityIcon(city) {
  return `assets/images/icons/${citySlug(city)}/${city} Icon.png`;
}

const SHOW_DISTRICTS_KEY = 'rpgShowDistricts';

const safeStorage = (() => {
  if (typeof window === 'undefined') {
    return {
      isEnabled: () => false,
      getItem: () => null,
      setItem: () => false,
      removeItem: () => {},
      clear: () => {},
    };
  }
  let enabled = false;
  let store = null;
  try {
    store = window.localStorage;
    const testKey = '__rpg_storage_test__';
    store.setItem(testKey, '1');
    store.removeItem(testKey);
    enabled = true;
  } catch {
    store = null;
    enabled = false;
  }
  const guard = (action, fallback) => (...args) => {
    if (!enabled || !store) return fallback;
    try {
      return action(...args);
    } catch {
      enabled = false;
      return fallback;
    }
  };
  return {
    isEnabled: () => enabled,
    getItem: guard(key => store.getItem(key), null),
    setItem: guard((key, value) => {
      store.setItem(key, value);
      return true;
    }, false),
    removeItem: guard(key => {
      store.removeItem(key);
    }),
    clear: guard(() => {
      store.clear();
    }),
  };
})();

let showDistricts = safeStorage.getItem(SHOW_DISTRICTS_KEY) === 'true';

// Declare profile pointers up front so early UI helpers can safely reference them
let profiles = {};
let currentProfileId = null;
let currentProfile = null;
let currentCharacter = null;

const body = document.body;
const main = document.querySelector('main');
const backButton = document.getElementById('back-button');
const topMenu = document.querySelector('.top-menu');
const app = document.getElementById('app');
const menuDateLabel = document.getElementById('menu-date');
const menuCharacterNameLabel = document.getElementById('menu-character-name');
const menuMoneyLabel = document.getElementById('menu-money');
const menuTimeDisplay = document.getElementById('menu-time');
const menuTimeLabelText = menuTimeDisplay ? menuTimeDisplay.querySelector('.time-label') : null;
const menuTimeClockText = menuTimeDisplay ? menuTimeDisplay.querySelector('.time-clock') : null;
const menuTimeIcon = document.getElementById('menu-time-icon');
const menuSeasonIcon = document.getElementById('menu-season-icon');
const menuWeatherIcon = document.getElementById('menu-weather-icon');
const menuResourceBarContainer = document.querySelector('.top-menu-resource-bars');
const menuXpBar = document.getElementById('menu-xp-bar');
const menuResourceBars = {
  hp: menuResourceBarContainer
    ? menuResourceBarContainer.querySelector('[data-resource="hp"]')
    : null,
  mp: menuResourceBarContainer
    ? menuResourceBarContainer.querySelector('[data-resource="mp"]')
    : null,
  stamina: menuResourceBarContainer
    ? menuResourceBarContainer.querySelector('[data-resource="stamina"]')
    : null,
  xp: menuXpBar,
};
const TIME_BAND_CLASS_MAP = {
  night: 'time-band-night',
  preDawn: 'time-band-predawn',
  dawn: 'time-band-dawn',
  morning: 'time-band-day',
  day: 'time-band-day',
  afternoon: 'time-band-day',
  dusk: 'time-band-dusk',
};
const TIME_BAND_CLASSES = Array.from(new Set(Object.values(TIME_BAND_CLASS_MAP)));
const TIME_BAND_ICON_MAP = {
  night: '🌙',
  preDawn: '🌄',
  dawn: '🌅',
  morning: '🌤️',
  day: '☀️',
  afternoon: '🌞',
  dusk: '🌇',
};

const ACTION_STAMINA_PROFILES = {
  look: { intensity: 0.18 },
  search: { intensity: 0.32 },
  explore: { intensity: 0.55 },
  forage: { intensity: 0.6 },
  fish_gather: { intensity: 0.62 },
  fish: { intensity: 0.52 },
  hunt: { intensity: 0.85 },
  beachcomb: { intensity: 0.4 },
  tidepool: { intensity: 0.42 },
  dive: { intensity: 1.1 },
  swim: { intensity: 0.9 },
  mine: { intensity: 1.2 },
  fell_tree: { intensity: 1.15 },
  rest: { recovery: 1.15 },
};

const STAMINA_INTENSITY_RATE = 6;
const STAMINA_RECOVERY_RATE = 8;
const MIN_CONVENTIONAL_RECOVERY_MULTIPLIER = 0.12;

function updateResourceBarElement(element, current, max, label) {
  if (!element) return;
  const normalizedCurrent = Math.max(0, Number(current) || 0);
  const normalizedMax = Math.max(0, Number(max) || 0);
  const pct = normalizedMax > 0 ? Math.min(100, Math.max(0, (normalizedCurrent / normalizedMax) * 100)) : 0;
  const fill = element.querySelector('.top-resource-fill');
  if (fill) {
    fill.style.width = `${pct}%`;
  }
  element.setAttribute('aria-valuemin', '0');
  element.setAttribute('aria-valuemax', `${Math.round(normalizedMax * 10) / 10}`);
  element.setAttribute('aria-valuenow', `${Math.round(normalizedCurrent * 10) / 10}`);
  const tooltip = `${label}: ${formatResourceNumber(normalizedCurrent)} / ${formatResourceNumber(normalizedMax)}`;
  element.setAttribute('aria-valuetext', tooltip);
  element.setAttribute('data-tooltip', tooltip);
}

const TIME_BAND_METADATA = {
  night: {
    label: 'Deep night',
    startHour: 21,
    endHour: 4,
    summary: 'Quiet streets and shuttered shops cloak the city beneath the stars.',
  },
  preDawn: {
    label: 'Pre-dawn watch',
    startHour: 4,
    endHour: 6,
    summary: 'Bakers and harbor crews stir as the last watch changes over.',
  },
  dawn: {
    label: 'Dawn rise',
    startHour: 6,
    endHour: 9,
    summary: 'Sunrise paints the sky while stalls and ferries ready for the rush.',
  },
  morning: {
    label: 'Late morning bustle',
    startHour: 9,
    endHour: 12,
    summary: 'Commerce hums along the piers and markets hit full stride.',
  },
  day: {
    label: 'Early afternoon',
    startHour: 12,
    endHour: 15,
    summary: 'The sun sits high—ideal for travel and guild business.',
  },
  afternoon: {
    label: 'Late afternoon glow',
    startHour: 15,
    endHour: 18,
    summary: 'Shadows lengthen and returning ships crowd the docks.',
  },
  dusk: {
    label: 'Evening lanternlight',
    startHour: 18,
    endHour: 21,
    summary: 'Lanterns spark to life as taverns and theaters fill.',
  },
};

const SEASON_SUMMARIES = {
  Spring: 'Blooming festivals and warm rains encourage planting and travel.',
  Summer: 'High sun, humid squalls, and bustling trade define the warm months.',
  Autumn: 'Harvest bonfires and crisp winds sweep through every district.',
  Winter: 'Long nights, auroral skies, and bracing coastal storms take hold.',
};

const SEASON_TOOLTIP_DATA = MONTHS.reduce((map, month) => {
  const bucket = map[month.season] || {
    months: [],
    monthIndexes: [],
    constellations: [],
    summary: SEASON_SUMMARIES[month.season] || '',
  };
  bucket.months.push(month.name);
  bucket.monthIndexes.push(month.index);
  if (month.constellation) bucket.constellations.push(month.constellation);
  bucket.lengthDays = bucket.months.length * DAYS_PER_MONTH;
  map[month.season] = bucket;
  return map;
}, {});
const SEASON_ICON_MAP = {
  Winter: '❄️',
  Spring: '🌱',
  Summer: '🌞',
  Autumn: '🍂',
};
const mapContainer = document.createElement('div');
mapContainer.id = 'map-container';
mapContainer.style.display = 'none';
if (app) {
  app.appendChild(mapContainer);
}
let mapToggleButton = null;

const LOCATION_LOG_DISPLAY_LIMIT = 4;
const LOCATION_LOG_HISTORY_LIMIT = 50;
const ACTION_LOG_STORAGE_LIMIT = 200;
const locationActionHistory = new Map();
const locationActionDisplay = new Map();
let actionLogFilterState = { type: 'all', outcome: 'all', city: 'all' };
let questHistoryFilterState = { city: 'all', outcome: 'all', board: 'all' };

function locationPositionKey(pos) {
  if (!pos) return null;
  const city = pos.city || '';
  const district = pos.district || '';
  const building = pos.building || '';
  return `${city}:::${district}:::${building}`;
}

function pushLocationLogEntry(pos, entry) {
  const key = locationPositionKey(pos);
  if (!key || !entry) return;
  const history = locationActionHistory.get(key) || [];
  const updatedHistory = [entry, ...history].slice(0, LOCATION_LOG_HISTORY_LIMIT);
  locationActionHistory.set(key, updatedHistory);
  locationActionDisplay.set(key, updatedHistory.slice(0, LOCATION_LOG_DISPLAY_LIMIT));
  recordCharacterAction(pos, entry);
}

function getLocationLogEntries(pos) {
  const key = locationPositionKey(pos);
  if (!key) return [];
  return locationActionDisplay.get(key) || [];
}

function getLocationLogHistory(pos) {
  const key = locationPositionKey(pos);
  if (!key) return [];
  return locationActionHistory.get(key) || [];
}

function renderLocationLogEntries(pos) {
  const entries = getLocationLogEntries(pos);
  if (!entries.length) return '';
  const [latest, ...previous] = entries;
  const latestHTML = renderLocationLogEntry(latest);
  let historyHTML = '';
  if (previous.length) {
    const countLabel = previous.length === 1
      ? '1 earlier event'
      : `${previous.length} earlier events`;
    const historyEntries = previous.map(renderLocationLogEntry).join('');
    historyHTML = `
      <details class="location-log-history">
        <summary>${escapeHtml(`Event Log (${countLabel})`)}</summary>
        <div class="location-log-history-content">${historyEntries}</div>
      </details>
    `;
  }
  return `<section class="location-log" aria-live="polite">${latestHTML}${historyHTML}</section>`;
}

function renderLocationLogEntry(entry) {
  if (!entry) return '';
  if (entry.kind === 'environment') {
    return buildEnvironmentOutcomeHTML(entry.result);
  }
  if (entry.kind === 'message') {
    return buildMessageLogHTML(entry);
  }
  return '';
}

function recordCharacterAction(pos, entry) {
  if (!currentCharacter || !entry) return;
  const actionLog = ensureActionLog(currentCharacter);
  const todayLabel = typeof worldCalendar?.formatCurrentDate === 'function'
    ? worldCalendar.formatCurrentDate()
    : null;
  const seasonLabel = typeof worldCalendar?.season === 'function'
    ? worldCalendar.season()
    : null;
  const timeOfDay = ensureCharacterClock(currentCharacter);
  const timeLabel = describeTimeOfDay(timeOfDay);
  const clock = formatClockTime(timeOfDay);
  const location = pos || currentCharacter.position || {};
  const city = findCityByName(location.city || currentCharacter.location || '') || location.city || currentCharacter.location || null;
  const district = location.district || null;
  const building = location.building || null;
  const locationLabelParts = [building, district, city].filter(Boolean);
  const locationLabel = locationLabelParts.length ? locationLabelParts.join(' · ') : city;

  let title = 'Event';
  let description = '';
  let weather = null;
  let success = null;
  let partialSuccess = false;
  let tone = entry.tone || null;
  let outcomeLabel = null;

  if (entry.kind === 'environment') {
    const result = entry.result || {};
    title = result.title || 'Encounter';
    if (typeof result.narrative === 'string') {
      description = result.narrative;
    } else if (result.narrative && typeof result.narrative === 'object') {
      description = [result.narrative.scene, result.narrative.outcome].filter(Boolean).join(' ');
    }
    weather = result.weather ? describeWeatherSummary(result.weather) : null;
    if (result.success === true) {
      success = true;
      outcomeLabel = 'Success';
    } else if (result.partialSuccess) {
      partialSuccess = true;
      success = false;
      outcomeLabel = 'Partial Success';
    } else if (result.success === false) {
      success = false;
      outcomeLabel = 'Failure';
    }
  } else if (entry.kind === 'message') {
    title = entry.title || 'Notice';
    if (Array.isArray(entry.body)) {
      description = entry.body.map(text => String(text)).join(' ');
    } else if (entry.body) {
      description = String(entry.body);
    }
    if (tone === 'success') {
      success = true;
      outcomeLabel = 'Success';
    } else if (tone === 'error') {
      success = false;
      outcomeLabel = 'Failure';
    }
  }

  const logEntry = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    kind: entry.kind === 'environment' ? 'environment' : 'message',
    title,
    description,
    outcome: outcomeLabel,
    success,
    partialSuccess,
    tone: tone || null,
    date: todayLabel,
    season: seasonLabel,
    timeLabel: toTitleCase(timeLabel),
    clock,
    weather,
    city,
    district,
    building,
    locationLabel: locationLabel || null,
  };

  actionLog.unshift(logEntry);
  if (actionLog.length > ACTION_LOG_STORAGE_LIMIT) {
    actionLog.length = ACTION_LOG_STORAGE_LIMIT;
  }
  saveProfiles();
}

function resetLocationLogs() {
  locationActionHistory.clear();
  locationActionDisplay.clear();
}

function buildMessageLogHTML(entry) {
  const classes = ['location-log-entry', 'location-log-message'];
  const tone = entry?.tone;
  if (tone) {
    classes.push(`location-log-${tone}`);
  } else {
    classes.push('location-log-info');
  }
  const title = entry?.title ? escapeHtml(entry.title) : 'Notice';
  let bodyHTML = '';
  if (Array.isArray(entry?.body)) {
    bodyHTML = entry.body.map(text => `<p>${escapeHtml(text)}</p>`).join('');
  } else if (entry?.body) {
    bodyHTML = `<p>${escapeHtml(entry.body)}</p>`;
  }
  const metaHTML = Array.isArray(entry?.meta) && entry.meta.length
    ? `<p class="location-log-meta">${entry.meta.map(text => escapeHtml(text)).join(' · ')}</p>`
    : '';
  return `<article class="${classes.join(' ')}"><h3>${title}</h3>${bodyHTML}${metaHTML}</article>`;
}

const TRAINING_TRACKER_KEYS = {
  glassblowing: 'glassblowing',
  'pearl-diving': 'pearlDiving',
  blacksmithing: 'blacksmithing',
  carpentry: 'carpentry',
  tailoring: 'tailoring',
  leatherworking: 'leatherworking',
  alchemy: 'alchemy',
  enchanting: 'enchanting',
  masonry: 'masonry',
  textiles: 'textiles',
};

function craftTrackerKey(craft) {
  return TRAINING_TRACKER_KEYS[craft] || craft;
}

function handleTrainingAction(pos, craft) {
  if (!currentCharacter) return;
  const key = craftTrackerKey(craft);
  const before = Number(currentCharacter[key]) || 0;
  const after = trainCraftSkill(currentCharacter, craft);
  const delta = Math.round((after - before) * 100) / 100;
  const label = toTitleCase(craft.replace(/[-_]/g, ' '));
  const tone = delta > 0 ? 'success' : 'info';
  const metaText = `${label} ${after.toFixed(2)}${delta > 0 ? ` (+${delta.toFixed(2)})` : ' (no progress)'}`;
  pushLocationLogEntry(pos, {
    kind: 'message',
    tone,
    title: `${label} training`,
    body: `You practice ${label.toLowerCase()}.`,
    meta: [metaText],
  });
  saveProfiles();
  showNavigation();
}

function resolveWeatherForPosition(position) {
  const today = worldCalendar.today();
  let region = 'waves_break';
  let habitat = 'urban';
  let city = null;
  let district = null;
  if (position) {
    city = position.city || null;
    district = position.district || null;
    if (position.city && CITY_SLUGS[position.city]) {
      region = CITY_SLUGS[position.city];
    }
    try {
      const env = getEnvironmentDefinition(position.city, position.district, position.building);
      if (env) {
        if (env.region) region = env.region;
        habitat = env.weatherHabitat || env.habitat || habitat;
      }
    } catch {
      // ignore lookup failures and fall back to defaults
    }
  }
  try {
    const report = weatherSystem.getDailyWeather(region, habitat, today);
    if (!report) return null;
    const regionLabel = report.regionLabel || REGION_LABELS[report.region] || REGION_LABELS[region];
    const fallbackRegionLabel = regionLabel || toTitleCase(String(report.region || region).replace(/[-_]/g, ' '));
    const habitatLabel = toTitleCase(String(habitat).replace(/[-_]/g, ' '));
    return {
      ...report,
      city,
      district,
      regionLabel: fallbackRegionLabel,
      habitatLabel,
    };
  } catch {
    return null;
  }
}

function formatTimeBandRange(startHour, endHour) {
  if (!Number.isFinite(startHour) || !Number.isFinite(endHour)) return null;
  const normalize = value => ((value % 24) + 24) % 24;
  const normalizedStart = normalize(startHour);
  const normalizedEnd = normalize(endHour);
  const wraps = normalizedStart >= normalizedEnd;
  const startText = formatClockTime(normalizedStart);
  const endText = formatClockTime(normalizedEnd);
  if (!wraps && normalizedStart === normalizedEnd) {
    return startText;
  }
  return wraps ? `${startText} – ${endText} (next day)` : `${startText} – ${endText}`;
}

function buildTimeTooltip(label, clock, bandKey) {
  const parts = [];
  if (label) parts.push(`Segment: ${label}`);
  if (clock) parts.push(`Current clock: ${clock}`);
  const meta = TIME_BAND_METADATA[bandKey];
  if (meta) {
    const range = formatTimeBandRange(meta.startHour, meta.endHour);
    if (range) parts.push(`Typical window: ${range}`);
    if (meta.summary) parts.push(meta.summary);
  }
  return parts.join('\n');
}

function buildSeasonTooltip(season, dateText, today) {
  const parts = [];
  if (season) parts.push(`Season: ${season}`);
  if (dateText) parts.push(`Current date: ${dateText}`);
  const info = SEASON_TOOLTIP_DATA[season];
  if (info) {
    if (Array.isArray(info.monthIndexes) && today) {
      const monthPosition = info.monthIndexes.indexOf(today.monthIndex);
      if (monthPosition >= 0) {
        const dayOfSeason = monthPosition * DAYS_PER_MONTH + today.day;
        if (Number.isFinite(info.lengthDays)) {
          parts.push(`Day ${dayOfSeason} of ${info.lengthDays}`);
        }
      }
    }
    if (info.summary) parts.push(info.summary);
    if (info.months?.length) parts.push(`Months: ${info.months.join(', ')}`);
    if (info.constellations?.length) {
      parts.push(`Constellations: ${info.constellations.join(', ')}`);
    }
  }
  return parts.join('\n');
}

function resolveWeatherIcon(weather) {
  if (!weather) {
    return { icon: '—', label: 'Weather data unavailable' };
  }
  if (weather.storm) {
    return { icon: '⛈️', label: 'Storm' };
  }
  const condition = (weather.condition || '').toLowerCase();
  if (condition.includes('snow')) return { icon: '🌨️', label: 'Snow' };
  if (condition.includes('sleet')) return { icon: '🌨️', label: 'Sleet' };
  if (condition.includes('rain')) return { icon: '🌧️', label: 'Rain' };
  if (condition.includes('drizzle')) return { icon: '🌦️', label: 'Drizzle' };
  if (condition.includes('fog')) return { icon: '🌫️', label: 'Fog' };
  if (condition.includes('partly')) return { icon: '🌤️', label: toTitleCase(condition) };
  if (condition.includes('cloud')) return { icon: '☁️', label: 'Cloudy' };
  if (condition.includes('clear')) return { icon: '☀️', label: 'Clear' };
  const label = condition ? toTitleCase(condition) : 'Fair weather';
  return { icon: '🌤️', label };
}

function buildWeatherTooltip(weather, context = {}) {
  if (!weather) return 'Weather data unavailable.';
  const parts = [];
  const iconInfo = resolveWeatherIcon(weather);
  if (iconInfo.label) parts.push(`Condition: ${iconInfo.label}`);
  if (Number.isFinite(weather.temperatureC)) parts.push(`Temperature: ${weather.temperatureC}°C`);
  if (Number.isFinite(weather.humidity)) parts.push(`Humidity: ${weather.humidity}%`);
  if (Number.isFinite(weather.precipitationMm)) {
    parts.push(`Precipitation: ${weather.precipitationMm} mm`);
  }
  const drought = weather.droughtStage && weather.droughtStage !== 'none' ? toTitleCase(weather.droughtStage) : null;
  if (drought) parts.push(`Drought status: ${drought}`);
  const flood = weather.floodRisk && weather.floodRisk !== 'none' ? toTitleCase(weather.floodRisk) : null;
  if (flood) parts.push(`Flood risk: ${flood}`);
  const areaParts = [];
  const city = context.city || weather.city;
  if (city) areaParts.push(city);
  const district = context.district || weather.district;
  if (district) areaParts.push(district);
  const regionLabel = weather.regionLabel || REGION_LABELS[weather.region];
  if (!areaParts.length && regionLabel) {
    areaParts.push(regionLabel);
  }
  if (areaParts.length) parts.push(`Area: ${areaParts.join(' – ')}`);
  const habitatLabel =
    context.habitatLabel ||
    weather.habitatLabel ||
    (weather.habitat ? toTitleCase(String(weather.habitat).replace(/[-_]/g, ' ')) : null);
  if (habitatLabel) parts.push(`Habitat: ${habitatLabel}`);
  if (context.dateLabel) {
    const observed = context.clock ? `${context.dateLabel} at ${context.clock}` : context.dateLabel;
    parts.push(`Observation: ${observed}`);
  }
  if (weather.narrative) parts.push(weather.narrative);
  return parts.join('\n');
}

function updateTopMenuIndicators() {
  const currentDate = worldCalendar.formatCurrentDate();
  const today = worldCalendar.today();
  const season = getSeasonForDate(today);
  let clock = null;
  if (menuDateLabel) {
    menuDateLabel.textContent = currentDate;
    menuDateLabel.setAttribute('title', `Date: ${currentDate}`);
    menuDateLabel.setAttribute('aria-label', `Current date: ${currentDate}`);
  }
  if (menuCharacterNameLabel) {
    if (currentCharacter) {
      const name = (currentCharacter.name || '').trim() || 'Unnamed Adventurer';
      menuCharacterNameLabel.textContent = name;
      menuCharacterNameLabel.setAttribute('title', `Active character: ${name}`);
      menuCharacterNameLabel.setAttribute('aria-label', `Active character: ${name}`);
    } else {
      menuCharacterNameLabel.textContent = '—';
      menuCharacterNameLabel.setAttribute('title', 'Active character');
      menuCharacterNameLabel.setAttribute('aria-label', 'Active character unavailable');
    }
  }
  if (menuTimeDisplay) {
    if (currentCharacter) {
      const hours = ensureCharacterClock(currentCharacter);
      const bandKey = timeBandForHour(hours);
      const band = TIME_BAND_CLASS_MAP[bandKey];
      menuTimeDisplay.classList.remove(...TIME_BAND_CLASSES);
      if (band) {
        menuTimeDisplay.classList.add(band);
      }
      const label = toTitleCase(describeTimeOfDay(hours));
      clock = formatClockTime(hours);
      if (menuTimeLabelText) menuTimeLabelText.textContent = label || '—';
      if (menuTimeClockText) menuTimeClockText.textContent = clock;
      if (menuTimeIcon) {
        const icon = TIME_BAND_ICON_MAP[bandKey] || '🕰️';
        menuTimeIcon.textContent = icon;
        menuTimeIcon.setAttribute('data-tooltip', buildTimeTooltip(label, clock, bandKey));
        menuTimeIcon.setAttribute('aria-label', label ? `Time of day: ${label}` : 'Time of day');
      }
      menuTimeDisplay.setAttribute('title', `Time: ${label} (${clock})`);
      menuTimeDisplay.setAttribute('aria-label', `Current time: ${label} at ${clock}`);
    } else {
      menuTimeDisplay.classList.remove(...TIME_BAND_CLASSES);
      if (menuTimeLabelText) menuTimeLabelText.textContent = '—';
      if (menuTimeClockText) menuTimeClockText.textContent = '—';
      if (menuTimeIcon) {
        menuTimeIcon.textContent = '—';
        menuTimeIcon.setAttribute('data-tooltip', '');
        menuTimeIcon.setAttribute('aria-label', 'Time of day unavailable');
      }
      menuTimeDisplay.setAttribute('title', 'Current time unavailable');
      menuTimeDisplay.setAttribute('aria-label', 'Current time unavailable');
    }
  }
  if (menuSeasonIcon) {
    if (season) {
      const icon = SEASON_ICON_MAP[season] || '🗓️';
      menuSeasonIcon.textContent = icon;
      menuSeasonIcon.setAttribute('data-tooltip', buildSeasonTooltip(season, currentDate, today));
      menuSeasonIcon.setAttribute('aria-label', `Current season: ${season}`);
    } else {
      menuSeasonIcon.textContent = '—';
      menuSeasonIcon.setAttribute('data-tooltip', '');
      menuSeasonIcon.setAttribute('aria-label', 'Season information unavailable');
    }
  }
  if (menuWeatherIcon) {
    const position = currentCharacter?.position || null;
    const weather = resolveWeatherForPosition(position);
    const iconInfo = resolveWeatherIcon(weather);
    menuWeatherIcon.textContent = iconInfo.icon;
    const weatherTooltipContext = {
      city: position?.city || weather?.city || null,
      district: position?.district || weather?.district || null,
      dateLabel: currentDate,
      clock,
    };
    menuWeatherIcon.setAttribute('data-tooltip', buildWeatherTooltip(weather, weatherTooltipContext));
    menuWeatherIcon.setAttribute('aria-label', iconInfo.label || 'Weather information');
  }
  if (menuResourceBarContainer) {
    if (currentCharacter) {
      ensureResourceBounds(currentCharacter);
      if (topMenu) topMenu.classList.add('top-menu--resources-visible');
      menuResourceBarContainer.removeAttribute('hidden');
      updateResourceBarElement(menuResourceBars.hp, currentCharacter.hp, currentCharacter.maxHP, 'HP');
      updateResourceBarElement(menuResourceBars.mp, currentCharacter.mp, currentCharacter.maxMP, 'MP');
      updateResourceBarElement(
        menuResourceBars.stamina,
        currentCharacter.stamina,
        currentCharacter.maxStamina,
        'Stamina',
      );
      const level = Number(currentCharacter.level) || 1;
      const totalXp = Math.max(0, Number(currentCharacter.xp) || 0);
      const levelFloor = totalXpForLevel(level);
      const xpIntoLevel = Math.max(0, totalXp - levelFloor);
      const xpNeededRaw = xpForNextLevel(level);
      const xpNeeded = xpNeededRaw > 0 ? xpNeededRaw : Math.max(1, xpIntoLevel || 1);
      const xpCurrent = xpNeededRaw > 0 ? Math.min(xpIntoLevel, xpNeeded) : xpNeeded;
      updateResourceBarElement(menuResourceBars.xp, xpCurrent, xpNeeded, `XP (Lv ${level})`);
      const xpTooltip = xpNeededRaw > 0
        ? `XP: ${formatResourceNumber(xpIntoLevel)} / ${formatResourceNumber(xpNeededRaw)} (Total ${formatResourceNumber(totalXp)})`
        : `XP: ${formatResourceNumber(totalXp)} (Max level)`;
      if (menuResourceBars.xp) {
        menuResourceBars.xp.setAttribute('data-tooltip', xpTooltip);
        menuResourceBars.xp.setAttribute('aria-valuetext', xpTooltip);
        menuResourceBars.xp.removeAttribute('hidden');
      }
    } else {
      if (topMenu) topMenu.classList.remove('top-menu--resources-visible');
      menuResourceBarContainer.setAttribute('hidden', '');
      if (menuResourceBars.xp) {
        menuResourceBars.xp.setAttribute('hidden', '');
      }
    }
  }
  if (menuMoneyLabel) {
    if (currentCharacter) {
      const money = currentCharacter.money || createEmptyCurrency();
      const totalCopper = convertCurrency(toIron(money), 'coldIron', 'copper');
      const fundsText = formatCurrency(money);
      menuMoneyLabel.innerHTML = cpToCoins(totalCopper, true, true);
      menuMoneyLabel.setAttribute('title', `Funds: ${fundsText}`);
      menuMoneyLabel.setAttribute('aria-label', `Available funds: ${fundsText}`);
    } else {
      menuMoneyLabel.textContent = '—';
      menuMoneyLabel.setAttribute('title', 'Available funds');
      menuMoneyLabel.setAttribute('aria-label', 'Available funds: unavailable');
    }
  }
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => updateMenuHeight());
  } else {
    updateMenuHeight();
  }
}

function updateLayoutSize() {
  if (!app) return;
  const viewport = window.visualViewport;
  const vw = viewport?.width || window.innerWidth;
  const vh = viewport?.height || window.innerHeight;
  const scale = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--ui-scale')
  ) || 1;
  app.style.width = `${vw / scale}px`;
  app.style.height = `${vh / scale}px`;
}

function updateMenuHeight() {
  if (!topMenu) return;
  const scale = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--ui-scale')
  ) || 1;
  const height = topMenu.offsetHeight * scale;
  document.documentElement.style.setProperty('--menu-height', `${height}px`);
  updateLayoutSize();
}
function handleResize() {
  updateMenuHeight();
  normalizeOptionButtonWidths();
  normalizeProficiencyNameWidths();
}
window.addEventListener('resize', handleResize);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', handleResize);
  window.visualViewport.addEventListener('scroll', handleResize);
}
handleResize();
updateTopMenuIndicators();

function setMainHTML(html) {
  if (main) main.innerHTML = html;
  if (mapContainer) mapContainer.style.display = 'none';
  if (mapToggleButton) {
    mapToggleButton.classList.remove("map-toggle-floating");
    mapToggleButton = null;
  }
}

function isPortraitLayout() {
  return window.innerHeight > window.innerWidth;
}

function normalizeOptionButtonWidths() {
  const grid = document.querySelector('.option-grid');
  if (!grid) return;
  const isNav = !!grid.closest('.navigation');
  const images = Array.from(grid.querySelectorAll('img'));
  let pending = images.filter(img => !img.complete).length;
  if (pending) {
    images.forEach(img => {
      if (!img.complete) {
        img.addEventListener(
          'load',
          () => {
            pending--;
            if (pending === 0) normalizeOptionButtonWidths();
          },
          { once: true }
        );
      }
    });
    return;
  }
  const buttons = Array.from(grid.querySelectorAll('button'));
  let maxWidth = 0;
  let maxHeight = 0;
  buttons.forEach(btn => {
    btn.style.width = isNav ? '' : 'auto';
    if (isNav) btn.style.height = '';
    const rect = btn.getBoundingClientRect();
    if (rect.width > maxWidth) maxWidth = rect.width;
    if (isNav && rect.height > maxHeight) maxHeight = rect.height;
  });
  const gridWidth = grid.getBoundingClientRect().width;
  if (isNav) return;
  maxWidth = Math.min(maxWidth, gridWidth);
  buttons.forEach(btn => {
    btn.style.width = `${maxWidth}px`;
  });
}

function normalizeProficiencyNameWidths() {
  const names = Array.from(document.querySelectorAll('.proficiency-name'));
  if (!names.length) return;
  let maxWidth = 0;
  names.forEach(n => {
    n.style.width = 'auto';
    const w = n.getBoundingClientRect().width;
    if (w > maxWidth) maxWidth = w;
  });
  names.forEach(n => {
    n.style.width = `${maxWidth}px`;
  });
}

// --- Profile and save management ---
const STORAGE_KEY = 'rpgProfiles';
const LAST_PROFILE_KEY = 'rpgLastProfile';
const TEMP_CHARACTER_KEY = 'rpgTempCharacter';

const isPlainObject = value => value != null && typeof value === 'object' && !Array.isArray(value);

const currencyKeyAliases = {
  ci: 'coldIron',
  st: 'steel',
  cp: 'copper',
  sp: 'silver',
  gp: 'gold',
  pp: 'platinum',
};

function normalizeCurrencyValue(value) {
  if (isPlainObject(value)) {
    const normalized = createEmptyCurrency();
    for (const [key, rawAmount] of Object.entries(value)) {
      const denom = DENOMINATIONS.includes(key) ? key : currencyKeyAliases[key] || null;
      if (!denom) continue;
      const amount = Number(rawAmount);
      if (Number.isFinite(amount)) {
        normalized[denom] = Math.max(0, Math.floor(amount));
      }
    }
    return normalized;
  }
  if (typeof value === 'string') {
    return { ...createEmptyCurrency(), ...parseCurrency(value) };
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const iron = convertCurrency(Math.max(0, value), 'copper', 'coldIron');
    if (typeof iron === 'number' && Number.isFinite(iron)) {
      return { ...createEmptyCurrency(), ...fromIron(Math.floor(Math.max(0, iron))) };
    }
  }
  return createEmptyCurrency();
}

function findCityByName(name) {
  if (typeof name !== 'string') return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  if (CITY_NAV[trimmed]) return trimmed;
  const lower = trimmed.toLowerCase();
  return Object.keys(CITY_NAV).find(city => city.toLowerCase() === lower) || null;
}

function deriveNearestCity(source) {
  if (typeof source !== 'string') return null;
  const parts = source
    .split(/[·,;\/\-|–—]/)
    .map(part => part.trim())
    .filter(Boolean);
  for (const part of [source.trim(), ...parts]) {
    const city = findCityByName(part);
    if (city) return city;
  }
  return null;
}

function resolveCityPreference(...candidates) {
  for (const candidate of candidates) {
    const match = findCityByName(candidate);
    if (match) return match;
  }
  const cities = Object.keys(CITY_NAV);
  return cities.length ? cities[0] : null;
}

function normalizeCharacterPosition(character) {
  const raw = isPlainObject(character.position) ? character.position : {};
  const city = resolveCityPreference(raw.city, character.location, character.homeTown);
  if (!city) {
    character.position = null;
    return;
  }
  const cityData = CITY_NAV[city];
  character.location = city;
  const districtCandidates = [
    raw.district,
    isPlainObject(character.backstory) ? character.backstory.district : null,
  ];
  let district = null;
  for (const candidate of districtCandidates) {
    if (typeof candidate !== 'string') continue;
    const trimmed = candidate.trim();
    if (!trimmed) continue;
    if (cityData?.districts?.[trimmed]) {
      district = trimmed;
      break;
    }
    const normalized = Object.keys(cityData?.districts || {}).find(
      name => name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (normalized) {
      district = normalized;
      break;
    }
  }
  if (!district) {
    const districts = Object.keys(cityData?.districts || {});
    district = districts.length ? districts[0] : null;
  }
  let building = typeof raw.building === 'string' ? raw.building.trim() : null;
  if (building) {
    if (!cityData?.buildings?.[building]) {
      const normalized = Object.keys(cityData?.buildings || {}).find(
        name => name.toLowerCase() === building.toLowerCase(),
      );
      building = normalized || null;
    }
    if (building && !cityData?.buildings?.[building]) {
      building = null;
    }
  }
  character.position = {
    city,
    district,
    building,
    previousDistrict: null,
    previousBuilding: null,
  };
}

function normalizeCharacterState(character) {
  if (!isPlainObject(character)) return null;
  character.money = normalizeCurrencyValue(character.money);
  if (Array.isArray(character.buildings)) {
    character.buildings = character.buildings.map(entry => {
      if (!isPlainObject(entry)) return entry;
      return { ...entry, money: normalizeCurrencyValue(entry.money) };
    });
  } else {
    character.buildings = [];
  }
  normalizeCharacterPosition(character);
  const hours = Number(character.timeOfDay);
  if (!Number.isFinite(hours) || hours < 0) {
    character.timeOfDay = 8;
  } else if (hours >= 24) {
    character.timeOfDay = hours % 24;
  } else {
    character.timeOfDay = hours;
  }
  ensureActionLog(character);
  ensureResourceBounds(character);
  return character;
}

const sanitizeProfiles = raw => {
  if (!isPlainObject(raw)) return {};
  const sanitized = {};
  for (const [id, profile] of Object.entries(raw)) {
    if (!isPlainObject(profile)) continue;
    const sanitizedProfile = { ...profile };
    sanitizedProfile.id = typeof profile.id === 'string' ? profile.id : id;
    sanitizedProfile.name =
      typeof profile.name === 'string' && profile.name.trim() !== '' ? profile.name : 'Player';
    sanitizedProfile.preferences = isPlainObject(profile.preferences)
      ? { ...profile.preferences }
      : {};
    const characters = isPlainObject(profile.characters) ? profile.characters : {};
    const normalizedCharacters = {};
    for (const [charId, charData] of Object.entries(characters)) {
      if (!isPlainObject(charData)) continue;
      const normalized = normalizeCharacterState({ ...charData });
      if (normalized) {
        normalizedCharacters[charId] = normalized;
      }
    }
    sanitizedProfile.characters = normalizedCharacters;
    if (
      typeof sanitizedProfile.lastCharacter !== 'string' ||
      !sanitizedProfile.characters[sanitizedProfile.lastCharacter]
    ) {
      sanitizedProfile.lastCharacter = null;
    }
    sanitized[sanitizedProfile.id] = sanitizedProfile;
  }
  return sanitized;
};

profiles = {};
const storedProfilesRaw = safeStorage.getItem(STORAGE_KEY);
if (storedProfilesRaw) {
  try {
    profiles = sanitizeProfiles(JSON.parse(storedProfilesRaw));
  } catch {
    profiles = {};
  }
}
currentProfileId = safeStorage.getItem(LAST_PROFILE_KEY);
currentProfile = currentProfileId ? profiles[currentProfileId] : null;
currentCharacter = null;

const humanHairColors = [
  '#f5f0e6', '#efe6d6', '#e8dcc7', '#e2d2b9', '#dbc8ac', '#d5be9f',
  '#cfb492', '#c6a782', '#bd9a75', '#b48e69', '#ab825d', '#a17652',
  '#976a47', '#8e5e3d', '#855333', '#7b492b', '#704024', '#65381f',
  '#5b311b', '#512a17', '#472415', '#3d1f13', '#321b11', '#261610'
];

const elfHairColors = [
  '#f2efe8', '#ece8de', '#e6e2d5', '#dfdbc9', '#d9d1c0', '#d2c7b6',
  '#cbbda9', '#c4b39f', '#bea98e', '#b49f85', '#aa937b', '#a08772',
  '#967a69', '#8c6d5f', '#816152', '#765547', '#6b493d', '#5f3e35',
  '#53332d', '#482a26', '#3d221f', '#33201d', '#28201f', '#1f1b1a'
];

const darkElfHairColors = [
  '#e8e6f0', '#d7d4e6', '#c7c2d8', '#b7b0cb', '#a89fbd', '#9a8faf',
  '#8b7fa1', '#7d7193', '#6e6386', '#615679', '#564c6d', '#4c435f',
  '#423a53', '#393247', '#312b3b', '#29252f', '#221f29', '#1c1b23',
  '#19171f', '#161418', '#141215', '#120f12', '#0e0d10', '#0a090c'
];

const dwarfHairColors = [
  '#f0e8db', '#e4d7c0', '#d9c6a5', '#cfb58b', '#c6a479', '#bd9367',
  '#b48255', '#aa7246', '#a0623c', '#975332', '#8d472a', '#833d24',
  '#7a351f', '#702e1b', '#662717', '#5c2214', '#522011', '#481e10',
  '#3e1b0e', '#34170c', '#2c1610', '#24201c', '#1c1a18', '#141312'
];

const caitSithHairColors = [
  '#f8f4ea', '#f3ebdc', '#eee2ce', '#ead8bd', '#e5cfad', '#e1c69d',
  '#dcbb8d', '#d6b07d', '#d0a46e', '#c99960', '#c18d52', '#b78146',
  '#ad753b', '#a36931', '#99602a', '#8f5625', '#854d20', '#79461e',
  '#6d4020', '#613a22', '#553425', '#472f27', '#392a29', '#2c2423'
];

const salamanderHairColors = [
  '#f9e278', '#f6d75a', '#f3cb43', '#f0b83c', '#ed9f34', '#ea892d',
  '#e67426', '#e15e1f', '#d8491c', '#c83f1b', '#b7381a', '#a5301a',
  '#92301d', '#7f341f', '#6c3822', '#5a3d26', '#4c412b', '#414532',
  '#384a37', '#31403b', '#293636', '#222e2e', '#1b2627', '#141d1f'
];

const gnomeHairColors = [
  '#f7ece7', '#f2e1d6', '#edd5c5', '#e7cabb', '#e1bfae', '#dbb4a2',
  '#d5a996', '#ce9f8a', '#c7947e', '#c18a73', '#ba8069', '#b27660',
  '#aa6d58', '#a26351', '#995a4a', '#905143', '#87473d', '#7f3f37',
  '#763832', '#6d312d', '#632b28', '#592523', '#4f1f1d', '#461a1a'
];

const halflingHairColors = [
  '#f7f1e3', '#f3e8d4', '#eedcc0', '#e8d1ae', '#e2c69d', '#dbbb8d',
  '#d5af7d', '#cda470', '#c69962', '#be8d55', '#b5824a', '#ab7740',
  '#a26c37', '#99612f', '#905627', '#874c20', '#7d421b', '#743916',
  '#6a3112', '#602a0f', '#56240c', '#4c1f0a', '#421a08', '#381606'
];

const hairColorOptionsByRace = {
  Human: humanHairColors,
  Elf: elfHairColors,
  'Dark Elf': darkElfHairColors,
  Dwarf: dwarfHairColors,
  'Cait Sith': caitSithHairColors,
  Salamander: salamanderHairColors,
  Gnome: gnomeHairColors,
  Halfling: halflingHairColors
};

const humanEyeColors = [
  '#3a6ea5', // Ocean Blue
  '#577fae', // River Blue
  '#9ab7d4', // Clouded Blue
  '#6ca06f', // Forest Green
  '#8ab98e', // Meadow Green
  '#b1d1b2', // Pale Green
  '#a67c52', // Hazelwood
  '#c7a368', // Golden Hazel
  '#e1c47c', // Honey Amber
  '#c2b280', // Amberstone
  '#dbc9a6', // Pale Amber
  '#7c4a2d', // Chestnut Brown
  '#5d4638', // Walnut Brown
  '#4a3528', // Bark Brown
  '#2b2b2b', // Deep Onyx
  '#1e1d1c', // Night Black
  '#857f7a', // Mist Gray
  '#a89f9a', // Ash Gray
  '#d0c8c3', // Pale Gray
  '#5c788a', // Steel Blue
  '#364d5c', // Iron Blue
  '#7d5a49', // Autumn Brown
  '#9b7053', // Copper Hazel
  '#d79f7a'  // Soft Amber Brown
];

const elfEyeColors = [
  '#e6f7ff', // Starlit Ice
  '#a8c9ff', // Moonlight Azure
  '#7ed4c7', // Sylvan Teal
  '#4b6ea9', // Deep Skyblue
  '#c9f0a4', // Springleaf
  '#8fb28e', // Mossgreen
  '#f0e68c', // Sunspire Gold
  '#f6d88f', // Golden Lily
  '#e9c982', // Amber Dawn
  '#dda0dd', // Twilight Lilac
  '#c6a2d6', // Fey Lavender
  '#b892d2', // Orchid Bloom
  '#9f7fb8', // Arcane Violet
  '#6f5d9b', // Nightshade Purple
  '#e2d6c5', // Moon Pearl
  '#d1bfa3', // Sandwood Glow
  '#a3836a', // Elm Brown
  '#85654f', // Rootwood
  '#6b584c', // Barkshadow
  '#514440', // Duskwood
  '#393434', // Forest Night
  '#2c2b2b', // Deep Twilight
  '#1f1e1e', // Starless Shadow
  '#151515'  // Void Black
];

const darkElfEyeColors = [
  '#e0e0e0', // Pale Silver
  '#c2bbd9', // Dim Lilac
  '#b799d6', // Moonshade Lilac
  '#8e82cc', // Nether Violet
  '#5d4b99', // Umbral Indigo
  '#3f2f78', // Deep Amethyst
  '#2e2e2e', // Void Black
  '#1c1b23', // Starless Obsidian
  '#f4c542', // Ember Gold
  '#e6a832', // Smolder Gold
  '#d49526', // Dusk Amber
  '#f26b5b', // Bloodfire Red
  '#d94842', // Crimson Ash
  '#bb2d26', // Dark Flame
  '#a9d7f2', // Ghostlight Blue
  '#82bde0', // Moonlit Azure
  '#5388a6', // Abyssal Blue
  '#46687d', // Drowsteel
  '#918f8c', // Ashen Gray
  '#6f6d6a', // Stone Veil
  '#5b5350', // Obsidian Ash
  '#473f3d', // Cave Shadow
  '#322d2c', // Nether Coal
  '#1f1c1b'  // Abyss Black
];

const dwarfEyeColors = [
  '#c69c6d', // Bronzeale
  '#d8b88a', // Malt Amber
  '#e0b454', // Forgelight Gold
  '#f2d181', // Bright Ale
  '#6a7b8c', // Steel Gray-Blue
  '#8599a6', // Forge Blue
  '#aab8c1', // Pale Iron
  '#e0e5e9', // Stone Silver
  '#a35239', // Emberstone Red
  '#c36753', // Smelted Red
  '#de8a6c', // Molten Rose
  '#f2b19a', // Ash Glow
  '#8b5e3c', // Ore Brown
  '#a27454', // Quarry Oak
  '#bb8a69', // Alewood
  '#d7c99f', // Quarry Tan
  '#ede1c1', // Pale Sandstone
  '#4f4a47', // Deep Iron
  '#5d5653', // Rockshade
  '#6e6662', // Charcoal Gray
  '#3a3330', // Coalblack
  '#2e2320', // Deep Cavern
  '#201916', // Forge Shadow
  '#14100e'  // Ore Void
];

const caitSithEyeColors = [
  '#f6e07a', // Cat's Eye Gold
  '#ffeeb0', // Pale Gold
  '#d1b95a', // Wild Amber
  '#94c973', // Wild Green
  '#b9e2a4', // Meadowlight
  '#6db4d9', // Sky Pupil
  '#9ccde7', // Pale Sky
  '#c8e9f5', // Frost Blue
  '#f2994b', // Fire Amber
  '#f7b678', // Flame Orange
  '#c13f3f', // Crimson Fang
  '#d56c6c', // Rosefang
  '#e6e6e6', // Frost Silver
  '#ffffff', // Pure Light
  '#9e82c9', // Mystic Violet
  '#c1a4e6', // Fey Lilac
  '#785744', // Earth Brown
  '#9d7b60', // Burrownut
  '#bfa084', // Sandpaw Tan
  '#dac6a6', // Creamhide
  '#4b3a33', // Coal Whisker
  '#322825', // Dark Fang
  '#1a1a1a', // Panther Black
  '#0d0c0c'  // Night Pupil
];

const salamanderEyeColors = [
  '#f6a13c', // Lava Gold
  '#f7bb5a', // Firelight Amber
  '#f7dd72', // Ember Yellow
  '#ffeab0', // Sun Scaled
  '#d94b2b', // Flame Red
  '#e66749', // Blazestone
  '#f25c8c', // Magma Rose
  '#f598b3', // Firepetal
  '#c9416f', // Ash Violet
  '#a7305a', // Obsidian Rose
  '#7cc9c6', // Sulfur Teal
  '#a6e3e2', // Steam Blue
  '#c8f2f1', // Vapor Mist
  '#ffefe0', // Fireglow White
  '#e1d4c6', // Ashwhite
  '#b8a8a0', // Stone Veil
  '#927c74', // Cinder Gray
  '#6f5c54', // Smoked Brown
  '#4e403a', // Burnt Rock
  '#2d2d2d', // Obsidian Black
  '#242424', // Nightscale
  '#1c1c1c', // Deep Forge
  '#141414', // Voidscale
  '#0b0b0b'  // Abyssal Black
];

const gnomeEyeColors = [
  '#d98282', // Rosetint
  '#eaa0a0', // Bloom Rose
  '#f6c0b8', // Blushfire
  '#f2b880', // Copper Glow
  '#f7d29a', // Gold Spark
  '#f7e07e', // Goldenbright
  '#e6ed9b', // Sunpetal Green
  '#89a86e', // Leafgreen
  '#aed59f', // Meadow Glow
  '#7db5b2', // Aqua Gleam
  '#a1d5d2', // Mist Aqua
  '#c6ecea', // Soft Fey Blue
  '#9b6ea3', // Violet Spark
  '#b792bb', // Amethyst Tint
  '#d2b5d6', // Pastel Orchid
  '#543b58', // Plumshade
  '#6a4c6d', // Twilight Violet
  '#8d6f70', // Ember Rose
  '#af8a73', // Hearthwood Glow
  '#c9a98a', // Copper Oak
  '#e0c8a1', // Claygold
  '#f2e2be', // Pale Ale Cream
  '#5c514a', // Tinker's Brown
  '#382f29'  // Deep Earth
];

const halflingEyeColors = [
  '#6d8ba4', // Skyhill Blue
  '#8aaec4', // River Mist
  '#b1cddc', // Cloudbright
  '#7fa66c', // Meadow Green
  '#a2c48b', // Spring Barley
  '#c4e1b3', // Pale Oat Green
  '#cbb47b', // Wheatgold
  '#e0cc95', // Oat Amber
  '#efe3b9', // Cream Ale
  '#8d6e4f', // Hazel Nut
  '#a37e5e', // Alebrown
  '#b99678', // Honey Amber
  '#d1c6aa', // Oat Cream
  '#e6ddc5', // Hearth Cream
  '#4b3d2e', // Hearthwood
  '#614c36', // Dark Loam
  '#785f45', // Burrow Brown
  '#947b62', // Orchard Nut
  '#b38f6e', // Warm Ale
  '#d8b98f', // Caramel Cream
  '#f2d6b7', // Light Amber Ale
  '#684b34', // Pipe Oak
  '#543d2c', // Rootshadow
  '#3c2c21'  // Deep Hearthwood
];

const eyeColorOptionsByRace = {
  Human: humanEyeColors,
  Elf: elfEyeColors,
  'Dark Elf': darkElfEyeColors,
  Dwarf: dwarfEyeColors,
  'Cait Sith': caitSithEyeColors,
  Salamander: salamanderEyeColors,
  Gnome: gnomeEyeColors,
  Halfling: halflingEyeColors
};

const generateColorScale = (start, end, steps = 25) => {
  const s = start.match(/\w\w/g).map(h => parseInt(h, 16));
  const e = end.match(/\w\w/g).map(h => parseInt(h, 16));
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    const rgb = s.map((sv, idx) => Math.round(sv + (e[idx] - sv) * t));
    return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');
  });
};

const humanSkinColors = [
  '#F1E0D1', // Frosted Ivory
  '#EFD8C7', // Winter Rose
  '#EDD2C0', // Candle Cream
  '#EBCDB8', // Pale Sand
  '#E9C7AC', // Warm Dune
  '#E7C1A2', // Peach Clay
  '#E5BB98', // Golden Parchment
  '#E3B58E', // Hearthlight
  '#E1AF85', // Amber Drift
  '#DFA87B', // Desert Glow
  '#DCA272', // Earthen Clay
  '#DA9C68', // Harvest Tan
  '#D8955F', // Honeyed Bronze
  '#D48E56', // Burnt Sienna
  '#D2874E', // Clay Hearth
  '#CE8147', // Bronze Veil
  '#C77A40', // Copper Oak
  '#C1733A', // Rustic Ember
  '#B96B34', // Autumn Bronze
  '#B0642F', // Ironwood
  '#A65C29', // Deep Terracotta
  '#995425', // Ember Brown
  '#8C4C21', // Hearth Oak
  '#7F431D'  // Earthshadow
];

const elfSkinColors = [
  '#d6c8b2', // Moonlit Ivory
  '#d6ccb8', // Morning Mist
  '#d7d2c4', // Pale Starlight
  '#d8bda3', // Sandborn
  '#d9c3a8', // Sun-Kissed Dune
  '#dabfad', // Rose Ash
  '#dbcdbf', // Winter Glow
  '#dcc5a2', // Amberlight
  '#ddcab4', // Driftwood
  '#deb8a1', // Faded Terracotta
  '#dfc6b0', // Elven Rose
  '#e0cbb8', // Silver Dawn
  '#e1c1a9', // Dappled Fawn
  '#e2c7ab', // Wheatveil
  '#e3cdb3', // Dawn Ember
  '#e4c1a1', // Peachwood
  '#e5bfa5', // Warm Clay
  '#e6d0b6', // Candlelight
  '#e7c8a2', // Sandlily
  '#e8cbb5', // Blush Oak
  '#e9c9b1', // Soft Umber
  '#eac6a6', // Golden Parchment
  '#ebccb4', // Maple Silk
  '#ecd1b7'  // Autumn Glow
];
const darkElfSkinColors = [
  '#4C3D57', // Twilight Lilac
  '#52465A', // Duskmire
  '#574C63', // Moonveil
  '#5A4E54', // Umbral Rose
  '#5F4D62', // Nether Plum
  '#63525E', // Ashen Violet
  '#645760', // Duskwood
  '#67595D', // Shadow Ember
  '#695D64', // Veilstone
  '#6A5668', // Obsidian Bloom
  '#6D606E', // Fogshade
  '#70606A', // Eclipse Gray
  '#73646F', // Starless Ash
  '#766873', // Moonshadow
  '#796974', // Pale Obsidian
  '#7C6F78', // Duskwraith
  '#7F7072', // Iron Vein
  '#81697C', // Veiled Amethyst
  '#856C7A', // Blood-Tide Mauve
  '#886E77', // Ashblood
  '#8A707E', // Nightshade Bloom
  '#8D7179', // Faded Obsidian
  '#907683', // Moonlit Ash
  '#92727B'  // Shadow Orchid
];

const dwarfSkinColors = [
  '#EFE0D2', // Granite Ivory
  '#EBD7C6', // Hearthstone
  '#E7CDB8', // Pale Quarry
  '#E3C4AA', // Sandstone
  '#DFBB9D', // Copper Ash
  '#DBB290', // Amber Clay
  '#D7A984', // Tawny Stone
  '#D4A078', // Burnished Hearth
  '#D0976C', // Molten Bronze
  '#CC8E60', // Forged Copper
  '#C88555', // Ale-Tide
  '#C47C4A', // Ironbrew
  '#C07340', // Emberforge
  '#BC6A36', // Bronzebeard
  '#B6612E', // Fired Oak
  '#AF5928', // Deep Ale
  '#A75224', // Ore-Brown
  '#9F4A20', // Mountain Clay
  '#97431D', // Hearthbrick
  '#8F3D1A', // Forgestone
  '#873717', // Cavern Ember
  '#7F3114', // Smoked Oak
  '#762B11', // Ore-Burnt
  '#6D250E'  // Deep Forge
];

const caitSithSkinColors = [
  '#F7F2EA', // Moonpelt
  '#F4EDE1', // Creamwhisker
  '#F1E5D6', // Pale Fang
  '#EEDCC9', // Sandpaw
  '#EBD4BC', // Fawnshade
  '#E8CDAA', // Golden Pelt
  '#E5C399', // Hearthfur
  '#E2B987', // Tawny Fang
  '#DFA06F', // Emberstripe
  '#DC9563', // Fireclaw
  '#D88958', // Ambermane
  '#D27C4D', // Rusttail
  '#CB7143', // Foxglow
  '#C56A3C', // Flamehide
  '#B98536', // Goldwhisker
  '#A97D3B', // Oakpelt
  '#8D6E4F', // Burrowmane
  '#7F6B63', // Ashstripe
  '#72655E', // Shadowpaw
  '#665D56', // Duskfang
  '#595450', // Coalwhisker
  '#494442', // Onyx Pelt
  '#3A3635', // Nightfur
  '#2C2929'  // Voidfang
];

const salamanderSkinColors = [
  '#F6E27C', // Solar Scale
  '#F3D35E', // Molten Gold
  '#F0C646', // Sunfang
  '#EEA944', // Emberhide
  '#EC933D', // Firecrest
  '#EA7E36', // Lava Claw
  '#E8692F', // Pyre Fang
  '#E55429', // Flamehide
  '#E03F22', // Inferno Scale
  '#D83B2B', // Charblood
  '#C8372D', // Volcanic Ember
  '#B7332F', // Magma Vein
  '#A62E2D', // Ashfang
  '#95342E', // Smolderhide
  '#83442F', // Burnt Clay
  '#72512E', // Earthscale
  '#615C33', // Sulfurhide
  '#555837', // Mossback
  '#4A4E3D', // Ashen Fang
  '#403B38', // Charcoal Scale
  '#353030', // Obsidian Hide
  '#2B2728', // Nightscale
  '#221F20', // Deep Forge
  '#191617'  // Voidscale
];

const gnomeSkinColors = [
  '#F6E4DA', // Petal Ivory
  '#F4DED2', // Hearthmilk
  '#F2D7C8', // Rosewood Cream
  '#F0D1BE', // Candle Peach
  '#EDCAB3', // Dappled Dawn
  '#EBC4A9', // Clay Petal
  '#E9BE9F', // Warm Almond
  '#E6B794', // Spiced Honey
  '#E4B18A', // Tawny Hearth
  '#E1AA80', // Rustic Peach
  '#DFA276', // Copperleaf
  '#DC9C6C', // Orchard Amber
  '#DA9562', // Hearthspice
  '#D78F59', // Russet Glow
  '#D48850', // Ember Maple
  '#D18247', // Brickleaf
  '#CE7B3F', // Burnished Copper
  '#CB7537', // Chestnut Ale
  '#C86F30', // Autumn Ember
  '#C3682B', // Oakfire
  '#B96227', // Terracotta Brew
  '#AE5B23', // Ironoak
  '#A2541F', // Earthen Ale
  '#964D1B'  // Deep Rootwood
];

const halflingSkinColors = [
  '#F4E3D4', // Hearth Ivory
  '#F2DDCB', // Buttercream Glow
  '#F0D6C2', // Oatmilk Beige
  '#EED0B9', // Barley Gold
  '#ECC9AF', // Honeyed Oats
  '#EAC3A6', // Rustic Cream
  '#E8BD9D', // Apricot Toast
  '#E6B793', // Warm Chestnut
  '#E3B08A', // Mulled Amber
  '#E1AA80', // Orchard Tan
  '#DFA477', // Autumn Wheat
  '#DC9D6E', // Hearthglow
  '#DA9765', // Toasted Oats
  '#D8915C', // Honey Loaf
  '#D68A54', // Hearthbread
  '#D2834B', // Rustic Amber
  '#CF7D43', // Baked Clay
  '#CC763B', // Maple Hearth
  '#C96F34', // Golden Crust
  '#C4692E', // Spiced Earth
  '#B86329', // Roasted Chestnut
  '#AC5C25', // Ember Loaf
  '#9F5521', // Brownstone
  '#924E1D'  // Hearth Oak
];

const skinColorOptionsByRace = {
  Human: humanSkinColors,
  Elf: elfSkinColors,
  'Dark Elf': darkElfSkinColors,
  Dwarf: dwarfSkinColors,
  'Cait Sith': caitSithSkinColors,
  Salamander: salamanderSkinColors,
  Gnome: gnomeSkinColors,
  Halfling: halflingSkinColors
};

const caitSithAccentColors = [
  '#fce2f1', // Rose Mist
  '#fbdada', // Petal Fade
  '#f5e8bb', // Sun Parchment
  '#f1f0c2', // Pale Meadow
  '#e3f7c2', // Spring Green
  '#c8f4da', // Mint Gleam
  '#a6efd4', // Aqua Fern
  '#87d7f7', // Skytint
  '#71bdf5', // Clear Sky
  '#5d96db', // Deep Azure
  '#4a7eb8', // Riversteel
  '#9a8edb', // Twilight Violet
  '#c3a6f5', // Fey Amethyst
  '#e0b4f2', // Orchid Fade
  '#f5b9cc', // Wild Rose
  '#e4828f', // Blood Petal
  '#d9665e', // Crimson Mark
  '#c14b4b', // Emberclaw Red
  '#b24d7c', // Mystic Plum
  '#9d5fa9', // Arcane Violet
  '#816a9f', // Duskwisp
  '#615678', // Shadewood
  '#4b3f52', // Smokestone
  '#312a35'  // Night Violet
];

const salamanderScaleColors = [
  '#fff0c9', // Pale Emberlight
  '#f7e7a7', // Dunesun
  '#f9e494', // Solar Glow
  '#f4d87d', // Gold Ash
  '#e7f79a', // Sulfur Bloom
  '#c7f78c', // Acid Green
  '#94f79b', // Virid Flame
  '#67f5da', // Aqua Pyre
  '#4ecce0', // Crystal Flame
  '#3a9be3', // Azure Ember
  '#366ed6', // Deep Cobalt
  '#4c58b5', // Obsidian Blue
  '#6a64d6', // Arcane Indigo
  '#8c6ce6', // Magma Violet
  '#ae73f7', // Runestone Purple
  '#d181f5', // Elemental Lilac
  '#f58edc', // Magma Bloom
  '#f5a8c1', // Ember Rose
  '#d7767d', // Ashfire Red
  '#b95664', // Coal Ruby
  '#9d4e5c', // Deep Lava Rose
  '#77525f', // Ashwood Plum
  '#544253', // Cindershade
  '#352c38'  // Netherstone
];

const accentColorOptionsByRace = {
  'Cait Sith': caitSithAccentColors
};

const scaleColorOptionsByRace = {
  Salamander: salamanderScaleColors
};

const RACE_IMAGES = {
  Human: 'assets/images/Race Photos/Human Female',
  Elf: 'assets/images/Race Photos/Elf Female',
  'Dark Elf': 'assets/images/Race Photos/Dark Elf Female',
  Dwarf: 'assets/images/Race Photos/Dwarf Female',
  'Cait Sith': 'assets/images/Race Photos/Cait Sith Female',
  Salamander: 'assets/images/Race Photos/Salamander Female',
  Gnome: 'assets/images/Race Photos/Gnome Female',
  Halfling: 'assets/images/Race Photos/Halfling Female'
};

const CHARACTER_IMAGE_FILES = {};
let racePhotoManifestPromise = null;

async function loadRacePhotoManifest() {
  if (!racePhotoManifestPromise) {
    racePhotoManifestPromise = fetch('assets/images/race_photos.json')
      .then(res => (res.ok ? res.json() : {}))
      .catch(() => ({}));
  }
  return racePhotoManifestPromise;
}

async function getCharacterImages(race, sex) {
  CHARACTER_IMAGE_FILES[race] = CHARACTER_IMAGE_FILES[race] || {};
  if (CHARACTER_IMAGE_FILES[race][sex]) {
    return CHARACTER_IMAGE_FILES[race][sex];
  }
  const manifest = await loadRacePhotoManifest();
  const files = ((manifest[race] || {})[sex]) || [];
  CHARACTER_IMAGE_FILES[race][sex] = files;
  return files;
}

// Default proficiency values for new characters
const defaultProficiencies = {
  stone: 0,
  water: 0,
  wind: 0,
  fire: 0,
  ice: 0,
  lightning: 0,
  dark: 0,
  light: 0,
  destruction: 0,
  healing: 0,
  enhancement: 0,
  enfeeblement: 0,
  control: 0,
  summoning: 0,
  singing: 0,
  instrument: 0,
  dancing: 0,
  evasion: 0,
  block: 0,
  parry: 0,
  sword: 0,
  greatsword: 0,
  polearm: 0,
  axe: 0,
  greataxe: 0,
  staff: 0,
  bow: 0,
  crossbow: 0,
  martial: 0,
  wand: 0,
  dagger: 0,
  shield: 0,
  lightArmor: 0,
  mediumArmor: 0,
  heavyArmor: 0,
  dualWield: 0,
  cooking: 0,
  rope: 0,
  calligraphy: 0,
  carpentry: 0,
  blacksmithing: 0,
  tailoring: 0,
  leatherworking: 0,
  masonry: 0,
  herbalism: 0,
  mining: 0,
  foraging: 0,
  logging: 0,
  brewing: 0,
  drawing: 0,
  alchemy: 0,
  enchanting: 0,
  textiles: 0,
  gardening: 0,
  farming: 0,
  weaving: 0,
  fletching: 0,
  glassblowing: 0,
  hunting: 0,
  pearlDiving: 0
};

const CLASS_ALIAS_FIELDS = [
  'class',
  'advancedClass',
  'theme',
  'classLine',
  'primaryClass',
  'secondaryClass',
  'build',
  'buildName'
];

function getClassAliases(character) {
  const names = new Set();
  if (!character) return names;
  const addValue = value => {
    if (!value || typeof value !== 'string') return;
    String(value)
      .split(/[\/,&]+|\s+/)
      .map(part => part.trim().toLowerCase())
      .filter(Boolean)
      .forEach(name => names.add(name));
  };
  for (const key of CLASS_ALIAS_FIELDS) {
    addValue(character[key]);
  }
  return names;
}

function assignMagicAptitudes(character) {
  const intStat = character.attributes?.current?.INT ?? 0;
  const wisStat = character.attributes?.current?.WIS ?? 0;
  const avgStat = (intStat + wisStat) / 2;
  const lowAvg = 9.5;
  const highAvg = 16.5;
  const norm = Math.max(0, Math.min(1, (avgStat - lowAvg) / (highAvg - lowAvg)));
  const elemChance = 0.10 + (0.30 - 0.10) * norm;
  const classAliases = getClassAliases(character);
  const isSummoner = classAliases.has('summoner');
  const elemental = [
    'stone',
    'water',
    'wind',
    'fire',
    'ice',
    'lightning',
    'dark',
    'light'
  ];
  const lowSchoolChances = {
    destruction: 0.30,
    enhancement: 0.30,
    enfeeblement: 0.30,
    control: 0.20,
    healing: 0.15,
    summoning: isSummoner ? 0.075 : 0,
  };
  const highSchoolChances = {
    destruction: 0.60,
    enhancement: 0.60,
    enfeeblement: 0.60,
    control: 0.40,
    healing: 0.30,
    summoning: isSummoner ? 0.15 : 0,
  };
  const schoolChances = {};
  for (const key of Object.keys(lowSchoolChances)) {
    const low = lowSchoolChances[key];
    const high = highSchoolChances[key];
    schoolChances[key] = low + (high - low) * norm;
  }

  const classMap = {
    summoner: ['summoning'],
    dancer: ['dancing'],
    performer: ['dancing'],
    healer: ['healing'],
    priest: ['healing'],
    acolyte: ['healing'],
    bard: ['singing','instrument'],
    minstrel: ['singing','instrument']
  };
  for (const name of classAliases) {
    const keys = classMap[name];
    if (!keys) continue;
    for (const key of keys) {
      character[key] = Math.max(character[key] || 0, 1);
    }
  }
  if (isSummoner) {
    character.summoning = Math.max(character.summoning || 0, 1);
  } else {
    character.summoning = 0;
  }

  // Determine if the character already has an elemental proficiency
  let hasElement = elemental.some(k => character[k] > 0);

  // Roll for elemental proficiencies; ensure at least one is granted
  if (!hasElement) {
    while (!hasElement) {
      for (const key of elemental) {
        if (Math.random() < elemChance) {
          character[key] = 1;
          hasElement = true;
        }
      }
    }
  }

  // Ensure at least one school is unlocked when any element is present
  if (hasElement) {
    const schoolKeys = Object.keys(schoolChances);
    let hasSchool = schoolKeys.some(k => character[k] > 0);
    while (!hasSchool) {
      for (const key of schoolKeys) {
        if (Math.random() < schoolChances[key]) {
          character[key] = 1;
          hasSchool = true;
        }
      }
    }
  }
}

function migrateProficiencies(character) {
  if ('mage' in character && !('wand' in character)) {
    character.wand = character.mage;
    delete character.mage;
  }
  if ('marksmanship' in character && !('bow' in character)) {
    character.bow = character.marksmanship;
    delete character.marksmanship;
  }
  const magicMap = {
    stoneMagic: 'stone',
    waterMagic: 'water',
    windMagic: 'wind',
    fireMagic: 'fire',
    iceMagic: 'ice',
    thunderMagic: 'lightning',
    lightningMagic: 'lightning',
    darkMagic: 'dark',
    lightMagic: 'light',
    destructiveMagic: 'destruction',
    destructionMagic: 'destruction',
    healingMagic: 'healing',
    reinforcementMagic: 'enhancement',
    enhancementMagic: 'enhancement',
    enfeeblingMagic: 'enfeeblement',
    controlMagic: 'control',
    summoningMagic: 'summoning',
  };
  for (const [oldKey, newKey] of Object.entries(magicMap)) {
    if (oldKey in character) {
      if (!(newKey in character)) character[newKey] = character[oldKey];
      delete character[oldKey];
    }
  }
  if (!getClassAliases(character).has('summoner')) {
    character.summoning = 0;
  }
  return character;
}

const proficiencyCategories = {
  'Elemental Magic': [
    'stone',
    'water',
    'wind',
    'fire',
    'ice',
    'lightning',
    'dark',
    'light'
  ],
  'Magical Schools': [
    'destruction',
    'healing',
    'enhancement',
    'enfeeblement',
    'control',
    'summoning'
  ],
  Combat: [
    'evasion',
    'block',
    'parry',
    'sword',
    'greatsword',
    'polearm',
    'axe',
    'greataxe',
    'staff',
    'bow',
    'crossbow',
    'martial',
    'wand',
    'dagger',
    'shield',
    'lightArmor',
    'mediumArmor',
    'heavyArmor',
    'dualWield'
  ],
  'Non Combat': ['singing', 'instrument', 'dancing'],
  Outdoor: ['swimming', 'sailing', 'riding', 'hunting'],
  Crafting: [
    'alchemy',
    'brewing',
    'carpentry',
    'weaving',
    'fletching',
    'glassblowing',
    'rope',
    'calligraphy',
    'drawing',
    'cooking'
  ],
  Gathering: [
    'mining',
    'foraging',
    'logging',
    'herbalism',
    'pearlDiving',
    'gardening',
    'farming'
  ]
};


const elementIcons = {
  Stone: '<img src="assets/images/icons/Magic/Stone.png" alt="Stone" />',
  Water: '<img src="assets/images/icons/Magic/Water.png" alt="Water" />',
  Wind: '<img src="assets/images/icons/Magic/Wind.png" alt="Wind" />',
  Fire: '<img src="assets/images/icons/Magic/Fire.png" alt="Fire" />',
  Ice: '<img src="assets/images/icons/Magic/Ice.png" alt="Ice" />',
  Lightning: '<img src="assets/images/icons/Magic/Lightning.png" alt="Lightning" />',
  Dark: '<img src="assets/images/icons/Magic/Dark.png" alt="Dark" />',
  Light: '<img src="assets/images/icons/Magic/Light.png" alt="Light" />',
  Wood: '🌲',
  Magma: '🌋',
  Sand: '🏜️',
  Crystal: '🔮',
  Metal: '⚙️',
  'Radiant Earth': '🌎',
  Obsidian: '🗿',
  Steam: '♨️',
  Storm: '🌩️',
  Frost: '🧊',
  'Storm Surge': '🌊',
  'Holy Water': '💧',
  Poison: '☠️',
  Wildfire: '🔥',
  Ash: '🌫️',
  Plasma: '🧪',
  'Sacred Flame': '<span class="icon sacred-flame"></span>',
  Hellfire: '<span class="icon hellfire"></span>',
  Blizzard: '🌨️',
  Cyclone: '🌪️',
  Skyfire: '☄️',
  'Umbral Gale': '🌬️',
  Hailstorm: '🌧️',
  Prism: '🔷',
  Shadowfrost: '❄️',
  'Holy Storm': '⚡',
  Doomstorm: '⚡',
  Order: '⚖️',
  Chaos: '🌀'
};

const elementColors = {
  Stone: '#7d7c7a',
  Water: '#3b82f6',
  Wind: '#22c55e',
  Fire: '#ef4444',
  Ice: '#60a5fa',
  Lightning: '#eab308',
  Dark: '#1e1b4b',
  Light: '#e5e4e2'
};

const schoolIcons = {
  Destruction: '<img src="assets/images/icons/Magic/Destruction.png" alt="Destruction" />',
  Enfeeblement: '<img src="assets/images/icons/Magic/Enfeeble.png" alt="Enfeeblement" />',
  Enhancement: '<img src="assets/images/icons/Magic/Enhance.png" alt="Enhancement" />',
  Control: '🌀',
  Healing: '<img src="assets/images/icons/Magic/Healing.png" alt="Healing" />',
  Summoning: '<img src="assets/images/icons/Magic/Summoning.png" alt="Summoning" />',
  Dance: '<img src="assets/images/icons/Magic/Dance.png" alt="Dance" />',
  Instrument: '<img src="assets/images/icons/Magic/Instrument.png" alt="Instrument" />',
  Voice: '<img src="assets/images/icons/Magic/Voice.png" alt="Voice" />'
};
const elementOrder = ['Stone', 'Water', 'Wind', 'Fire', 'Ice', 'Lightning', 'Light', 'Dark'];
let spellFilters = {
  elements: Object.fromEntries(elementOrder.map(e => [e, true])),
  schools: Object.fromEntries(Object.keys(schoolIcons).map(s => [s, true])),
};

function handleFilterLongPress(type, key) {
  const group = spellFilters[type + 's'];
  const onlyThis = Object.entries(group).every(([k, v]) => (k === key ? v : !v));
  if (onlyThis) {
    Object.keys(group).forEach(k => (group[k] = true));
  } else {
    Object.keys(group).forEach(k => (group[k] = k === key));
  }
  showSpellbookUI();
}

function proficiencyToTierLabel(prof) {
  if (prof === 1) return 'Cantrips';
  const idx = MILESTONES.indexOf(Number(prof));
  return idx >= 0 ? `Tier ${idx + 1}` : `P${prof}`;
}


const saveProfiles = () => {
  if (currentProfile && currentCharacter) {
    if (!isPlainObject(currentProfile.characters)) {
      currentProfile.characters = {};
    }
    currentProfile.characters[currentCharacter.id] = currentCharacter;
  }
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  updateTopMenuIndicators();
};

const formatHeight = cm => {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}' ${inches}"`;
};

const showBackButton = () => {
  if (backButton) {
    backButton.style.display = 'inline-flex';
  }
};
const hideBackButton = () => {
  if (backButton) {
    backButton.style.display = 'none';
  }
};

function showItemPopup(item) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const popup = document.createElement('div');
  popup.className = 'item-popup';
  popup.innerHTML = `<button class="close-popup" aria-label="Close">×</button><h3>${item.name}</h3>` +
    (item.base_item ? `<p>${item.base_item}</p>` : '') +
    (item.regions ? `<p>Sources: ${item.regions.join(', ')}</p>` : '');
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  const closeBtn = popup.querySelector('.close-popup');
  if (closeBtn) closeBtn.addEventListener('click', () => overlay.remove());
}

function addItemToInventory(item) {
  currentCharacter.inventory = currentCharacter.inventory || [];
  const existing = currentCharacter.inventory.find(i => i.name === item.name);
  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    currentCharacter.inventory.push({ ...item, qty: item.qty || 1 });
  }
}

function removeItemFromInventory(name) {
  const inv = currentCharacter.inventory || [];
  const idx = inv.findIndex(i => i.name === name);
  if (idx >= 0) {
    if (inv[idx].qty > 1) inv[idx].qty -= 1;
    else inv.splice(idx, 1);
  }
}

function showInventoryUI() {
  showBackButton();
  const inv = currentCharacter.inventory || [];
  let html = '<div class="inventory-screen"><h1>Inventory</h1>';
  if (!inv.length) {
    html += '<p>Inventory is empty.</p>';
  } else {
    html += '<ul>';
    inv.forEach(item => {
      html += `<li>${item.name} x${item.qty}</li>`;
    });
    html += '</ul>';
  }
  html += '</div>';
  setMainHTML(html);
}

function setUniformShopNameWidth() {
  const names = Array.from(document.querySelectorAll('.shop-item .item-name'));
  if (!names.length) return;
  const max = Math.max(...names.map(el => el.getBoundingClientRect().width));
  names.forEach(el => {
    el.style.width = `${max}px`;
  });
}

const SHOP_KEYWORD_STOP_WORDS = new Set([
  'the',
  'and',
  'of',
  'orchard',
  'farm',
  'estate',
  'company',
  'guild',
  'house',
  'hall',
  'trading',
  'works',
  'workshop',
  'press',
  'mill',
  'co',
  'cooperative',
  'shop',
  'store',
  'market',
]);

function tokenizeShopKeywords(value) {
  if (!value) return [];
  return String(value)
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z]+/)
    .filter(Boolean)
    .filter(token => token.length > 2 && !SHOP_KEYWORD_STOP_WORDS.has(token));
}

function deriveProductKeywords(businessProfile, building) {
  const keywords = new Set();
  (businessProfile?.production?.goods || []).forEach(item => {
    tokenizeShopKeywords(item).forEach(word => keywords.add(word));
  });
  if (businessProfile?.production?.notes) {
    tokenizeShopKeywords(businessProfile.production.notes).forEach(word => keywords.add(word));
  }
  const produces = building?.produces || {};
  ['resources', 'commodities', 'luxuries'].forEach(key => {
    (produces[key] || []).forEach(item => {
      tokenizeShopKeywords(item).forEach(word => keywords.add(word));
    });
  });
  return Array.from(keywords);
}

function deriveRegionTags(city, district, buildingName, habitat) {
  const tags = new Set();
  if (habitat) tags.add(String(habitat).toLowerCase());
  const lowerCity = (city || '').toLowerCase();
  if (lowerCity) {
    if (/wave|break|bay|port|harbor/.test(lowerCity)) tags.add('coastal');
    if (/river|brook|creek|flood/.test(lowerCity)) tags.add('riverlands');
    if (/stone|keep|kingdom|court/.test(lowerCity)) tags.add('urban');
  }
  const lowerDistrict = (district || '').toLowerCase();
  if (lowerDistrict) {
    if (/farmland|orchard|fields|grove|meadow|pasture/.test(lowerDistrict)) tags.add('farmland');
    if (/port|dock|harbor|quay|pier/.test(lowerDistrict)) tags.add('coastal');
    if (/market|ward|district|plaza|exchange/.test(lowerDistrict)) tags.add('urban');
    if (/forest|wood|grove/.test(lowerDistrict)) tags.add('forest');
    if (/hill|ridge|cliff/.test(lowerDistrict)) tags.add('hills');
  }
  const lowerName = (buildingName || '').toLowerCase();
  if (/farm|orchard|grove|pasture|meadow/.test(lowerName)) tags.add('farmland');
  if (/mill|granary|warehouse/.test(lowerName)) tags.add('farmland');
  if (/dock|port|harbor|wharf|quay/.test(lowerName)) tags.add('coastal');
  if (/library|guild|hall|temple|shop|market|office|academy/.test(lowerName)) tags.add('urban');
  return Array.from(tags);
}

async function renderShopUI(buildingName) {
  showBackButton();
  const profile = shopCategoriesForBuilding(buildingName);
  const pos = currentCharacter?.position;
  const city = pos?.city || currentCharacter?.location || null;
  const cityData = city ? CITY_NAV[city] : null;
  const building = cityData?.buildings?.[buildingName] || {};
  const encounterContext = pos?.city
    ? createBuildingEncounterContext({ city: pos.city, district: pos.district, building: buildingName })
    : null;
  const businessProfile = getBusinessProfileByName(buildingName);
  const productKeywords = deriveProductKeywords(businessProfile, building);
  const regionTags = deriveRegionTags(pos?.city, pos?.district, buildingName, encounterContext?.habitat || building.habitat);
  const season = encounterContext?.today ? getSeasonForDate(encounterContext.today).toLowerCase() : null;
  const baseContext = {
    name: buildingName,
    lower: buildingName.toLowerCase(),
    scale: 'medium',
    wealth: 'modest',
    type: 'producer',
    words: [],
    ...(profile.context || {}),
    city: pos?.city || null,
    district: pos?.district || null,
    habitat: encounterContext?.habitat || building.habitat || null,
    weather: encounterContext?.weather || null,
    date: encounterContext?.today || null,
    season,
    timeOfDay: encounterContext?.timeOfDay ?? null,
    timeLabel: encounterContext?.timeLabel ?? null,
    regionTags,
    productKeywords,
    productionGoods: businessProfile?.production?.goods || [],
    yields: building?.produces || {},
  };
  const sections = await Promise.all(
    (profile.sells || []).map(async section => ({
      ...section,
      items: await itemsByCategory(section, baseContext)
    }))
  );
  const available = sections.filter(section => section.items.length);
  let html = `<div class="shop-screen"><h1>${buildingName} Shop</h1><p>Funds: ${formatCurrency(currentCharacter.money)}</p>`;
  if (!available.length) {
    html += '<p>No goods for sale.</p></div>';
    setMainHTML(html);
    return;
  }
  const collapsible = available.length > 1;
  available.forEach((sec, sIdx) => {
    const heading = sec.heading || sec.label || sec.key;
    if (collapsible) {
      html += `<details class="shop-category" open><summary>${heading}</summary><ul>`;
    } else {
      html += `<h2>${heading}</h2><ul>`;
    }
    sec.items.forEach((item, iIdx) => {
      const saleQty = item.sale_quantity === 1 && item.unit === 'each'
        ? ''
        : `${item.sale_quantity} ${item.unit}`;
      html += `<li class="shop-item">`
        + `<button class="item-name" data-s="${sIdx}" data-i="${iIdx}">${item.name}</button>`
        + `<span class="sale-qty">${saleQty}</span>`
        + `<span class="item-price">${cpToCoins(item.price, true, true)}</span>`
        + `<input type="number" class="qty" value="1" min="1" data-s="${sIdx}" data-i="${iIdx}">`
        + `<button class="buy-btn" data-s="${sIdx}" data-i="${iIdx}">Buy</button>`
        + `</li>`;
    });
    html += '</ul>';
    if (collapsible) html += '</details>';
  });
  html += '</div>';
  setMainHTML(html);
  available.forEach((sec, sIdx) => {
    sec.items.forEach((item, iIdx) => {
      const buyBtn = document.querySelector(`.buy-btn[data-s="${sIdx}"][data-i="${iIdx}"]`);
      const qtyInput = document.querySelector(`input.qty[data-s="${sIdx}"][data-i="${iIdx}"]`);
      const nameBtn = document.querySelector(`.item-name[data-s="${sIdx}"][data-i="${iIdx}"]`);
      if (nameBtn) {
        nameBtn.addEventListener('click', () => showItemPopup(item));
      }
      if (buyBtn) {
        buyBtn.addEventListener('click', () => {
          const qty = parseInt(qtyInput && qtyInput.value ? qtyInput.value : '1', 10) || 1;
          let total = item.price * qty;
          if (item.bulk_discount_threshold && qty >= item.bulk_discount_threshold) {
            total *= 1 - item.bulk_discount_pct;
          }
          const priceIron = convertCurrency(total, 'copper', 'coldIron');
          if (toIron(currentCharacter.money) < priceIron) {
            alert('Not enough funds');
            return;
          }
          currentCharacter.money = fromIron(toIron(currentCharacter.money) - priceIron);
          addItemToInventory({
            name: item.name,
            category: sec.inventoryKey || sec.heading || sec.key,
            price: item.price,
            profit: item.profit,
            qty
          });
          renderShopUI(buildingName).catch(console.error);
        });
      }
    });
  });
  setUniformShopNameWidth();
}

async function renderStreetVendorUI(city, district) {
  showBackButton();
  const vendor = evaluateStreetVendor(city, district);
  if (!vendor) {
    setMainHTML(
      `<div class="shop-screen street-vendor"><h1>Street Vendor</h1><p>No street vendors are set up here at the moment.</p></div>`
    );
    return;
  }
  await ensureStreetVendorInventory(vendor);
  const funds = formatCurrency(currentCharacter.money);
  const soldOut = streetVendorSoldOut(vendor);
  let html = `<div class="shop-screen street-vendor"><h1>${escapeHtml(vendor.name)}</h1>`;
  if (vendor.description) {
    html += `<p class="street-vendor-desc">${escapeHtml(vendor.description)}</p>`;
  }
  html += `<p class="street-vendor-funds">Funds: ${funds}</p>`;
  if (!vendor.goods.length || soldOut) {
    html += '<p>The vendor has sold out for now.</p></div>';
    setMainHTML(html);
    return;
  }
  html += '<ul class="street-vendor-goods">';
  vendor.goods.forEach((good, idx) => {
    if (good.quantity <= 0) return;
    const item = good.item;
    const saleQty = item.sale_quantity === 1 && item.unit === 'each'
      ? ''
      : `${item.sale_quantity} ${item.unit || ''}`.trim();
    const priceLabel = `${cpToCoins(good.price, true, true)} (market ${cpToCoins(good.basePrice, true, true)})`;
    html += `<li class="shop-item street-vendor-item">`
      + `<button class="item-name" data-i="${idx}">${escapeHtml(item.name)}</button>`
      + `<span class="sale-qty">${saleQty}</span>`
      + `<span class="vendor-stock">Qty left: ${good.quantity}</span>`
      + `<span class="item-price">${priceLabel}</span>`
      + `<input type="number" class="qty street-vendor-qty" value="1" min="1" max="${good.quantity}" data-i="${idx}">`
      + `<button class="buy-btn street-vendor-buy" data-i="${idx}">Buy</button>`
      + `</li>`;
  });
  html += '</ul></div>';
  setMainHTML(html);
  vendor.goods.forEach((good, idx) => {
    if (good.quantity <= 0) return;
    const buyBtn = document.querySelector(`.street-vendor-buy[data-i="${idx}"]`);
    const qtyInput = document.querySelector(`.street-vendor-qty[data-i="${idx}"]`);
    const nameBtn = document.querySelector(`.street-vendor-item .item-name[data-i="${idx}"]`);
    if (nameBtn) {
      nameBtn.addEventListener('click', () => showItemPopup(good.item));
    }
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        const max = good.quantity;
        const qty = Math.max(1, Math.min(Number(qtyInput?.value) || 1, max));
        const totalCopper = good.price * qty;
        const costIron = convertCurrency(totalCopper, 'copper', 'coldIron');
        if (toIron(currentCharacter.money) < costIron) {
          alert('Not enough funds');
          return;
        }
        currentCharacter.money = fromIron(toIron(currentCharacter.money) - costIron);
        addItemToInventory({
          name: good.item.name,
          category: good.inventoryKey || vendor.theme.id || 'Street Vendor',
          price: good.price,
          qty,
        });
        good.quantity -= qty;
        saveProfiles();
        renderStreetVendorUI(city, district).catch(console.error);
      });
    }
  });
}


const ENVIRONMENT_TOOL_KEYWORDS = {
  fishing: [
    /fish/i,
    /net/i,
    /line/i,
    /hook/i,
    /tackle/i,
    /harpoon/i,
  ],
  huntingWeapon: [
    /bow/i,
    /crossbow/i,
    /spear/i,
    /javelin/i,
    /sling/i,
    /blade/i,
    /sword/i,
    /axe/i,
    /mace/i,
    /hammer/i,
    /dagger/i,
    /knife/i,
    /polearm/i,
    /glaive/i,
    /halberd/i,
    /staff/i,
  ],
  woodcutting: [/axe/i, /hatchet/i, /saw/i, /logging/i, /lumber/i],
  mining: [/pick/i, /pickaxe/i, /hammer/i, /chisel/i, /mattock/i],
};

const ENVIRONMENT_RANGED_WEAPONS = [/bow/i, /crossbow/i, /sling/i, /dart/i, /arquebus/i, /gun/i];
const ENVIRONMENT_THROWN_WEAPONS = [/spear/i, /javelin/i, /harpoon/i, /throwing/i];
const ENVIRONMENT_MELEE_WEAPONS = [
  /sword/i,
  /axe/i,
  /mace/i,
  /hammer/i,
  /club/i,
  /dagger/i,
  /knife/i,
  /staff/i,
  /blade/i,
  /polearm/i,
];

const FISHING_ROD_OR_POLE_PATTERNS = [/\brods?\b/i, /\bpoles?\b/i];
const FISHING_ROD_CONTEXT_PATTERNS = [
  /fish/i,
  /angl/i,
  /reel/i,
  /cast/i,
  /bait/i,
  /hook/i,
  /lure/i,
  /fly/i,
  /troll/i,
  /surf/i,
  /river/i,
  /lake/i,
  /ocean/i,
  /sea/i,
  /shore/i,
  /tidal/i,
  /shallows?/i,
  /current/i,
  /net/i,
  /line/i,
];

const HUNT_DIFFICULTY_BY_SIZE = {
  tiny: 1,
  small: 2,
  medium: 3,
  large: 4,
  huge: 5,
};

function gatherCharacterItemNames(character) {
  const names = [];
  (character.inventory || []).forEach(item => {
    if (item?.name) names.push(String(item.name));
  });
  const weapons = character.equipment?.weapons || {};
  Object.values(weapons).forEach(entry => {
    if (!entry) return;
    if (typeof entry === 'string') {
      names.push(entry);
    } else if (entry.name) {
      names.push(entry.name);
    } else if (entry.displayName) {
      names.push(entry.displayName);
    } else if (entry.baseItem) {
      names.push(entry.baseItem);
    }
  });
  return names;
}

function hasFishingRodOrPole(names) {
  return names.some(name => {
    if (!name) return false;
    const text = String(name);
    if (!FISHING_ROD_OR_POLE_PATTERNS.some(pattern => pattern.test(text))) {
      return false;
    }
    return FISHING_ROD_CONTEXT_PATTERNS.some(pattern => pattern.test(text));
  });
}

function hasToolRequirement(requirement, character) {
  if (!requirement) return { ok: true, matched: false };
  const names = gatherCharacterItemNames(character);
  if (requirement.kind === 'fishing') {
    const matchedRodOrPole = hasFishingRodOrPole(names);
    return { ok: matchedRodOrPole, matched: matchedRodOrPole };
  }
  const patterns = ENVIRONMENT_TOOL_KEYWORDS[requirement.kind] || [];
  if (!patterns.length) return { ok: true, matched: false };
  const matched = names.some(name => patterns.some(pattern => pattern.test(name)));
  return { ok: matched, matched };
}

function detectWeaponProfile(character) {
  const names = gatherCharacterItemNames(character).map(n => String(n));
  const hasPattern = patterns => names.some(name => patterns.some(pattern => pattern.test(name)));
  return {
    ranged: hasPattern(ENVIRONMENT_RANGED_WEAPONS),
    thrown: hasPattern(ENVIRONMENT_THROWN_WEAPONS),
    melee: hasPattern(ENVIRONMENT_MELEE_WEAPONS),
  };
}

function timeBandForHour(hour) {
  if (!Number.isFinite(hour)) return 'day';
  const h = ((hour % 24) + 24) % 24;
  if (h < 4) return 'night';
  if (h < 6) return 'preDawn';
  if (h < 9) return 'dawn';
  if (h < 12) return 'morning';
  if (h < 15) return 'day';
  if (h < 18) return 'afternoon';
  if (h < 21) return 'dusk';
  return 'night';
}

function weatherModifierKey(weather) {
  if (!weather) return null;
  if (weather.storm) return 'storm';
  const condition = (weather.condition || '').toLowerCase();
  if (!condition) return null;
  if (condition.includes('snow')) return 'snow';
  if (condition.includes('sleet')) return 'sleet';
  if (condition.includes('rain')) return 'rain';
  if (condition.includes('drizzle')) return 'rain';
  if (condition.includes('fog')) return 'fog';
  if (condition.includes('clear')) return 'clear';
  if (condition.includes('cloud')) return 'cloudy';
  return condition;
}

function computeAttributeModifier(keys, character) {
  if (!Array.isArray(keys) || keys.length === 0) return { value: 0, label: null };
  const attrs = character.attributes?.current || {};
  let sum = 0;
  keys.forEach(key => {
    const base = Number(attrs[key]) || 0;
    sum += base - 10;
  });
  const avg = sum / keys.length;
  const value = clamp(avg * 0.02, -0.15, 0.15);
  return { value, label: `Attributes (${keys.join('/')})` };
}

function computeActionChance(actionDef, context, opts = {}) {
  let chance = typeof opts.baseChance === 'number'
    ? opts.baseChance
    : typeof actionDef.baseChance === 'number'
      ? actionDef.baseChance
      : 0.5;
  const modifiers = [];

  if (context.season && actionDef.seasonModifiers && actionDef.seasonModifiers[context.season] != null) {
    const value = actionDef.seasonModifiers[context.season];
    chance += value;
    modifiers.push({ label: `Season (${context.season})`, value });
  }

  if (actionDef.timeModifiers) {
    const keys = [];
    const band = context.timeBand;
    if (band) keys.push(band);
    if (band === 'afternoon') keys.push('day');
    if (band === 'morning') keys.push('day');
    if (band === 'dusk') keys.push('evening');
    if (band === 'night') keys.push('evening');
    if (band === 'preDawn') keys.push('dawn');
    keys.push('any');
    keys.forEach(key => {
      if (key && actionDef.timeModifiers[key] != null) {
        const value = actionDef.timeModifiers[key];
        chance += value;
        modifiers.push({ label: `Time (${key})`, value });
      }
    });
  }

  const weatherKey = weatherModifierKey(context.weather);
  if (weatherKey && actionDef.weatherModifiers && actionDef.weatherModifiers[weatherKey] != null) {
    const value = actionDef.weatherModifiers[weatherKey];
    chance += value;
    const conditionLabel = context.weather?.condition || weatherKey;
    modifiers.push({ label: `Weather (${conditionLabel})`, value });
  }

  const skillKey = opts.skillKey || actionDef.gatherSkill || actionDef.huntSkill;
  let skillBonus = 0;
  if (skillKey && currentCharacter) {
    const raw = Number(currentCharacter[skillKey]) || 0;
    const factor = opts.skillFactor ?? 1;
    skillBonus = clamp((raw / 200) * factor, -0.2, 0.25);
    if (skillBonus) {
      chance += skillBonus;
      modifiers.push({ label: `Skill (${toTitleCase(skillKey)})`, value: skillBonus });
    }
  }

  const attributeKeys = opts.attributes || actionDef.attributes;
  let attributeBonus = 0;
  if (attributeKeys && attributeKeys.length && currentCharacter) {
    const attr = computeAttributeModifier(attributeKeys, currentCharacter);
    const factor = opts.attributeFactor ?? 1;
    attributeBonus = clamp(attr.value * factor, -0.15, 0.15);
    if (attributeBonus) {
      chance += attributeBonus;
      modifiers.push({ label: attr.label, value: attributeBonus });
    }
  }

  chance = clamp(chance, 0.05, 0.95);
  return { chance, modifiers, skillBonus, attributeBonus };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function pickRandom(array) {
  if (!array || !array.length) return null;
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

function pickRandomUnique(array, count) {
  if (!array || !array.length) return [];
  const copy = array.slice();
  const result = [];
  const limit = Math.min(copy.length, count);
  for (let i = 0; i < limit; i += 1) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function randomInRange(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return Number.isFinite(min) ? min : Number.isFinite(max) ? max : 0;
  }
  if (max < min) return randomInRange(max, min);
  return Math.random() * (max - min) + min;
}

function determineActionTime(actionDef) {
  if (Array.isArray(actionDef?.timeRangeHours) && actionDef.timeRangeHours.length >= 2) {
    const [min, max] = actionDef.timeRangeHours;
    return Math.max(0, randomInRange(min, max));
  }
  if (Number.isFinite(actionDef?.timeHours)) {
    return actionDef.timeHours;
  }
  return 1;
}

function ensureResourceBounds(character) {
  if (!character) return;
  const pairs = [
    ['hp', 'maxHP'],
    ['mp', 'maxMP'],
    ['stamina', 'maxStamina'],
  ];
  pairs.forEach(([currentKey, maxKey]) => {
    const maxValue = Number(character[maxKey]);
    const safeMax = Number.isFinite(maxValue) ? Math.max(0, maxValue) : 0;
    character[maxKey] = Math.round(safeMax * 10) / 10;
    const currentValue = Number(character[currentKey]);
    const bounded = Number.isFinite(currentValue) ? Math.min(safeMax, Math.max(0, currentValue)) : safeMax;
    const rounded = Math.round(bounded * 10) / 10;
    character[currentKey] = rounded;
  });
  ensureHoursAwake(character);
}

function ensureHoursAwake(character) {
  if (!character) return 0;
  const value = Number(character.hoursAwake);
  const normalized = Number.isFinite(value) && value > 0 ? Math.max(0, value) : 0;
  character.hoursAwake = Math.round(normalized * 100) / 100;
  return character.hoursAwake;
}

function computeConventionalRecoveryMultiplier(hoursAwake) {
  if (!Number.isFinite(hoursAwake)) return 1;
  if (hoursAwake <= 24) return 1;
  const overtime = Math.max(0, hoursAwake - 24);
  const falloff = 1 / (1 + overtime / 3);
  return Math.max(MIN_CONVENTIONAL_RECOVERY_MULTIPLIER, Math.round(falloff * 100) / 100);
}

function resolveActionStaminaProfile(actionDef = {}, actionType) {
  const baseType = actionDef.baseAction || actionType;
  const merged = typeof actionDef.staminaProfile === 'object' ? { ...actionDef.staminaProfile } : {};
  const defaults = ACTION_STAMINA_PROFILES[actionType] || ACTION_STAMINA_PROFILES[baseType] || {};
  const intensitySource = actionDef.staminaIntensity ?? merged.intensity ?? defaults.intensity;
  const recoverySource = actionDef.staminaRecovery ?? merged.recovery ?? defaults.recovery;
  const profile = {
    intensity: Number.isFinite(intensitySource) ? Math.max(0, intensitySource) : 0,
    recovery: Number.isFinite(recoverySource) ? Math.max(0, recoverySource) : 0,
    recoveryType: actionDef.staminaRecoveryType || merged.recoveryType || defaults.recoveryType || 'conventional',
  };
  if (profile.intensity <= 0 && profile.recovery <= 0) {
    return null;
  }
  return profile;
}

function applyActionStaminaProfile(character, profile, hours = 0, options = {}) {
  if (!character || !profile) return null;
  const time = Math.max(0, Number(hours) || 0);
  if (time <= 0) return null;
  ensureResourceBounds(character);
  const max = Number(character.maxStamina) || 0;
  if (max <= 0) return null;

  const before = Number(character.stamina) || 0;
  const intensity = Math.max(0, Number(profile.intensity) || 0);
  const recovery = Math.max(0, Number(profile.recovery) || 0);
  if (intensity <= 0 && recovery <= 0) return null;

  let delta = 0;
  let intensityApplied = 0;
  let recoveryApplied = 0;
  if (intensity > 0) {
    intensityApplied = intensity * STAMINA_INTENSITY_RATE * time;
    delta -= intensityApplied;
  }
  let recoveryMultiplier = 1;
  const overrideHoursAwake =
    options.hoursAwakeOverride != null && Number.isFinite(options.hoursAwakeOverride)
      ? Math.max(0, options.hoursAwakeOverride)
      : null;
  const baselineHoursAwake = overrideHoursAwake ?? character.hoursAwake;
  if (recovery > 0) {
    if (profile.recoveryType === 'unconventional') {
      recoveryMultiplier = 1;
    } else {
      recoveryMultiplier = computeConventionalRecoveryMultiplier(baselineHoursAwake);
    }
    recoveryApplied = recovery * STAMINA_RECOVERY_RATE * time * recoveryMultiplier;
    delta += recoveryApplied;
  }

  let next = before + delta;
  next = Math.min(max, Math.max(0, next));
  const normalizedNext = Math.round(next * 10) / 10;
  const normalizedBefore = Math.round(before * 10) / 10;
  const actualDelta = Math.round((normalizedNext - normalizedBefore) * 10) / 10;
  character.stamina = normalizedNext;
  return {
    before: normalizedBefore,
    after: normalizedNext,
    delta: actualDelta,
    intensityApplied: Math.round(intensityApplied * 10) / 10,
    recoveryApplied: Math.round(recoveryApplied * 10) / 10,
    recoveryMultiplier: Math.round(recoveryMultiplier * 100) / 100,
    profile,
    hoursAwake: ensureHoursAwake(character),
    baselineHoursAwake: Math.round((baselineHoursAwake || 0) * 100) / 100,
  };
}

function handleRestAction(pos, hours = 6) {
  if (!currentCharacter) return;
  const restHours = Math.max(1, Number(hours) || 6);
  const profile =
    resolveActionStaminaProfile({ baseAction: 'rest' }, 'rest') ||
    { recovery: ACTION_STAMINA_PROFILES.rest?.recovery || 1, recoveryType: 'conventional' };
  const preRestAwake = ensureHoursAwake(currentCharacter);
  const timeResult = advanceCharacterTime(restHours, { countsAsAwake: false });
  const staminaChange = applyActionStaminaProfile(currentCharacter, profile, restHours, {
    hoursAwakeOverride: preRestAwake,
  });
  const durationText = describeHoursDuration(restHours);
  const parts = [`You rest for ${durationText}.`];
  let tone = 'info';
  if (staminaChange && staminaChange.delta > 0) {
    parts.push(
      `Stamina ${staminaChange.delta > 0 ? '+' : ''}${formatResourceNumber(staminaChange.delta)} (now ${formatResourceNumber(currentCharacter.stamina)} / ${formatResourceNumber(currentCharacter.maxStamina)}).`,
    );
  } else {
    tone = 'warning';
    parts.push('Despite your effort, your stamina barely recovers.');
  }
  pushLocationLogEntry(pos, {
    kind: 'message',
    tone,
    title: 'Rest complete',
    body: parts.join(' '),
    timeAfter: timeResult,
  });
}

function pickWeightedRandom(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  let total = 0;
  list.forEach(item => {
    total += Number.isFinite(item?.weight) ? Math.max(0, item.weight) : 1;
  });
  if (total <= 0) return list[list.length - 1];
  let roll = Math.random() * total;
  for (const item of list) {
    const weight = Number.isFinite(item?.weight) ? Math.max(0, item.weight) : 1;
    if (weight <= 0) continue;
    if (roll < weight) return item;
    roll -= weight;
  }
  return list[list.length - 1];
}

function resolveLootSpecs(specs, draws = 1) {
  if (!Array.isArray(specs) || specs.length === 0) return { loot: [], awarded: [] };
  const loot = [];
  const awarded = [];
  for (let i = 0; i < draws; i += 1) {
    const spec = pickWeightedRandom(specs);
    if (!spec) continue;
    const qtyRange = Array.isArray(spec.qtyRange) && spec.qtyRange.length >= 2 ? spec.qtyRange : null;
    const minQty = qtyRange ? qtyRange[0] : Number.isFinite(spec.qty) ? spec.qty : 1;
    const maxQty = qtyRange ? qtyRange[1] : Number.isFinite(spec.qty) ? spec.qty : minQty;
    const qty = randomInt(Math.max(1, Math.floor(minQty)), Math.max(1, Math.floor(maxQty)));
    const name = spec.name || 'Salvaged item';
    addItemToInventory({
      name,
      category: spec.category || 'Miscellaneous',
      price: spec.price || 0,
      profit: spec.profit || 0,
      qty,
      baseItem: spec.baseItem,
    });
    loot.push({ name, qty });
    awarded.push(spec);
  }
  return { loot, awarded };
}

function joinWithAnd(items) {
  const filtered = (items || []).filter(Boolean);
  if (!filtered.length) return '';
  if (filtered.length === 1) return filtered[0];
  const last = filtered[filtered.length - 1];
  return `${filtered.slice(0, -1).join(', ')} and ${last}`;
}

function toTitleCase(text) {
  if (!text) return '';
  return String(text)
    .split(/[_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function filterPlantsForAction(actionDef) {
  const plants = plantsCatalogData || [];
  return plants.filter(plant => {
    if (actionDef.floraHabitats && !actionDef.floraHabitats.some(h => plant.habitats?.includes(h))) {
      return false;
    }
    if (actionDef.floraRegions && !actionDef.floraRegions.some(r => plant.regions?.includes(r))) {
      return false;
    }
    return true;
  });
}

function filterAnimalsForAction(actionDef, extra = {}) {
  const animals = animalsCatalogData || [];
  return animals.filter(animal => {
    if (actionDef.faunaHabitats && !actionDef.faunaHabitats.some(h => animal.habitats?.includes(h))) {
      return false;
    }
    if (extra.faunaHabitats && !extra.faunaHabitats.some(h => animal.habitats?.includes(h))) {
      return false;
    }
    if (actionDef.faunaRegions && !actionDef.faunaRegions.some(r => animal.regions?.includes(r))) {
      return false;
    }
    if (extra.faunaRegions && !extra.faunaRegions.some(r => animal.regions?.includes(r))) {
      return false;
    }
    if (actionDef.taxonGroups && !actionDef.taxonGroups.some(g => animal.taxon_group === g)) {
      return false;
    }
    if (extra.taxonGroups && !extra.taxonGroups.some(g => animal.taxon_group === g)) {
      return false;
    }
    if (extra.sizeClasses) {
      if (!animal.size_class) return false;
      if (!extra.sizeClasses.some(s => animal.size_class === s)) {
        return false;
      }
    }
    if (extra.edibleOnly !== false) {
      if (animal.edibility && animal.edibility.edible === false) return false;
    }
    return true;
  });
}

function describeWeatherSummary(weather) {
  if (!weather) return 'calm skies';
  const parts = [];
  if (weather.condition) parts.push(weather.condition);
  if (Number.isFinite(weather.temperatureC)) parts.push(`${weather.temperatureC}°C`);
  if (Number.isFinite(weather.humidity)) parts.push(`${weather.humidity}% humidity`);
  return parts.join(', ');
}

async function handleEnvironmentInteraction(actionId, pos) {
  if (!currentCharacter) return;
  const parsed = parseEnvironmentActionId(actionId);
  if (!parsed) {
    pushLocationLogEntry(pos, {
      kind: 'message',
      tone: 'error',
      title: 'Interaction unavailable',
      body: 'This outdoor interaction is no longer valid.',
    });
    showNavigation();
    return;
  }
  const city = parsed.city || pos.city;
  const district = parsed.district || pos.district;
  const location = parsed.location || pos.building;
  const definition = getEnvironmentDefinition(city, district, location);
  if (!definition) {
    pushLocationLogEntry(pos, {
      kind: 'message',
      tone: 'error',
      title: 'Interaction unavailable',
      body: `No outdoor encounters are configured for ${location || 'this area'}.`,
    });
    showNavigation();
    return;
  }
  const actionDef = definition.actions?.[parsed.actionType];
  if (!actionDef) {
    pushLocationLogEntry(pos, {
      kind: 'message',
      tone: 'error',
      title: 'Interaction unavailable',
      body: `${describeEnvironmentAction(parsed.actionType)} is not available at ${definition.location}.`,
    });
    showNavigation();
    return;
  }

  const context = buildEnvironmentContext(definition, actionDef, pos);
  let result;
  try {
    result = await resolveEnvironmentAction(parsed.actionType, definition, actionDef, context);
  } catch (err) {
    console.error('Failed to resolve environment interaction', err);
    pushLocationLogEntry(pos, {
      kind: 'message',
      tone: 'error',
      title: 'Interaction error',
      body: 'Something disrupted the encounter. Try again later.',
    });
    showNavigation();
    return;
  }
  const staminaProfile = resolveActionStaminaProfile(actionDef, parsed.actionType);
  if (staminaProfile && result) {
    const staminaChange = applyActionStaminaProfile(currentCharacter, staminaProfile, result.timeSpentHours || 0);
    if (staminaChange) {
      result.staminaChange = staminaChange;
    }
  }
  updateTopMenuIndicators();
  pushLocationLogEntry(pos, { kind: 'environment', result });
  saveProfiles();
  showNavigation();
}

function buildEnvironmentContext(definition, actionDef, pos) {
  const today = worldCalendar.today();
  const season = getSeasonForDate(today);
  const timeOfDay = ensureCharacterClock(currentCharacter);
  const timeLabel = describeTimeOfDay(timeOfDay);
  const timeBand = timeBandForHour(timeOfDay);
  const habitat = actionDef.weatherHabitat || definition.weatherHabitat || definition.habitat || 'farmland';
  let weather = null;
  try {
    if (definition.region && habitat) {
      weather = weatherSystem.getDailyWeather(definition.region, habitat, today);
    }
  } catch (err) {
    weather = null;
  }
  return {
    position: pos,
    today,
    season,
    timeOfDay,
    timeLabel,
    timeBand,
    weather,
  };
}

function buildEnvironmentActionContext(pos) {
  const definition = getEnvironmentDefinition(pos.city, pos.district, pos.building);
  if (!definition) return null;
  const today = worldCalendar.today();
  const season = getSeasonForDate(today);
  const timeOfDay = currentCharacter ? ensureCharacterClock(currentCharacter) : null;
  let timeKey = null;
  if (timeOfDay != null) {
    const timeLabel = describeTimeOfDay(timeOfDay);
    timeKey = normalizeTimeKey(timeLabel);
  }
  const habitat = definition.weatherHabitat || definition.habitat || 'farmland';
  let weather = null;
  let weatherKey = null;
  if (definition.region && habitat) {
    try {
      weather = weatherSystem.getDailyWeather(definition.region, habitat, today);
      weatherKey = normalizeWeatherKey(weather);
    } catch (err) {
      weather = null;
      weatherKey = null;
    }
  }
  return {
    season,
    timeKey,
    weatherKey,
    weather,
    timeOfDay,
  };
}

async function resolveEnvironmentAction(actionType, definition, actionDef, context) {
  const baseType = actionDef?.baseAction || actionType;
  if (baseType === 'forage') {
    return resolveForage(definition, actionDef, context, actionType);
  }
  if (baseType === 'fish') {
    return resolveFish(definition, actionDef, context, actionType);
  }
  if (baseType === 'hunt') {
    return resolveHunt(definition, actionDef, context, actionType);
  }
  if (baseType === 'look' || baseType === 'explore' || baseType === 'dive' || baseType === 'swim' || baseType === 'event') {
    return resolveObservationAction(actionType, definition, actionDef, context);
  }
  if (baseType === 'search') {
    return resolveSearchAction(actionType, definition, actionDef, context);
  }
  if (baseType === 'fish_gather') {
    return resolveFishGatherAction(actionType, definition, actionDef, context);
  }
  if (baseType === 'loot' || baseType === 'mine' || baseType === 'fell_tree') {
    return resolveLootAction(actionType, definition, actionDef, context);
  }
  return {
    title: composeEnvironmentTitle(actionType, definition, actionDef || {}),
    success: false,
    narrative: { scene: `${definition.location} remains quiet.`, outcome: 'Nothing happens.' },
    timeLabel: context.timeLabel,
    season: context.season,
    weather: context.weather,
    timeSpentHours: 0,
  };
}

function composeEnvironmentTitle(actionType, definition, actionDef) {
  const location = definition?.location || 'the wilds';
  let label = (actionDef?.label || describeEnvironmentAction(actionType) || '').trim();
  if (!label) {
    return `You explore ${location}.`;
  }
  label = label.replace(/\.+$/, '');
  const phrase = label.charAt(0).toLowerCase() + label.slice(1);
  const includesLocation = phrase.toLowerCase().includes(location.toLowerCase());
  const connector = includesLocation ? '' : ` of ${location}`;
  return `You ${phrase}${connector}.`;
}

function buildDefaultOutcome(success, durationText, actionType) {
  if (success) {
    if (actionType === 'look') return `After ${durationText}, you notice a few details you had previously missed.`;
    if (actionType === 'explore') return `After ${durationText}, you uncover fresh leads in the area.`;
    return `After ${durationText}, you feel more familiar with the surroundings.`;
  }
  return `Despite your efforts, ${durationText} passes without anything noteworthy.`;
}

function combineModifiers(base = {}, extra = {}) {
  if (!base && !extra) return undefined;
  if (!base) return { ...extra };
  if (!extra) return { ...base };
  return { ...base, ...extra };
}

async function resolveObservationAction(actionType, definition, actionDef = {}, context) {
  const baseChance = Math.max(0, Math.min(1, actionDef.eventChance ?? actionDef.baseChance ?? 0.3));
  const roll = Math.random();
  const success = roll < baseChance;
  let timeSpent = determineActionTime(actionDef);
  const event = success ? pickWeightedRandom(actionDef.randomEvents || []) : null;
  if (event?.extraTimeHours) {
    timeSpent += Math.max(0, event.extraTimeHours);
  }
  const timeResult = advanceCharacterTime(timeSpent);
  const durationText = describeHoursDuration(timeSpent);
  const lootResult = event?.loot ? resolveLootSpecs(event.loot, event.lootRolls || 1) : { loot: [], awarded: [] };
  const sceneText = (event?.scene || actionDef.narrative || '').trim();
  const outcomeText = event?.outcome
    ? event.outcome
    : buildDefaultOutcome(success, durationText, actionType);
  return {
    type: actionType,
    title: composeEnvironmentTitle(actionType, definition, actionDef),
    success,
    narrative: { scene: sceneText, outcome: outcomeText },
    rollInfo: { chance: baseChance, roll, modifiers: [] },
    loot: lootResult.loot,
    skillProgress: null,
    weather: context.weather,
    season: context.season,
    timeLabel: context.timeLabel,
    timeSpentHours: timeSpent,
    timeAfter: timeResult,
  };
}

async function resolveSearchAction(actionType, definition, actionDef = {}, context) {
  const categories = Array.isArray(actionDef.categories) ? actionDef.categories.filter(Boolean) : [];
  if (!categories.length) {
    return resolveObservationAction(actionType, definition, actionDef, context);
  }
  let choice = categories[0];
  if (typeof prompt === 'function') {
    const promptLines = categories.map((cat, idx) => `${idx + 1}. ${cat.label || cat.key || 'Option'}`);
    const response = prompt(`What will you search for?\n${promptLines.join('\n')}`);
    if (response) {
      const trimmed = response.trim();
      const index = Number.parseInt(trimmed, 10);
      if (Number.isFinite(index) && index >= 1 && index <= categories.length) {
        choice = categories[index - 1];
      } else {
        const lower = trimmed.toLowerCase();
        const found = categories.find(cat => (cat.key || '').toLowerCase() === lower || (cat.label || '').toLowerCase() === lower);
        if (found) choice = found;
      }
    }
  }
  const merged = { ...actionDef, ...choice };
  delete merged.categories;
  merged.label = choice.label || merged.label;
  merged.narrative = choice.narrative || merged.narrative || actionDef.narrative;
  merged.baseAction = choice.baseAction || merged.baseAction;
  merged.baseChance = Number.isFinite(choice.baseChance) ? choice.baseChance : merged.baseChance;
  merged.timeHours = Number.isFinite(choice.timeHours) ? choice.timeHours : merged.timeHours;
  merged.timeRangeHours = Array.isArray(choice.timeRangeHours) ? choice.timeRangeHours : merged.timeRangeHours;
  merged.weatherModifiers = combineModifiers(actionDef.weatherModifiers, choice.weatherModifiers);
  const baseType = merged.baseAction || 'event';
  if (baseType === 'forage') {
    return resolveForage(definition, merged, context, actionType);
  }
  if (baseType === 'fish') {
    return resolveFish(definition, merged, context, actionType);
  }
  if (baseType === 'hunt') {
    return resolveHunt(definition, merged, context, actionType);
  }
  if (baseType === 'loot' || baseType === 'mine' || baseType === 'fell_tree') {
    return resolveLootAction(actionType, definition, merged, context);
  }
  return resolveObservationAction(actionType, definition, merged, context);
}

async function resolveFishGatherAction(actionType, definition, actionDef = {}, context) {
  const modes = Array.isArray(actionDef.modes) ? actionDef.modes.filter(Boolean) : [];
  if (!modes.length) {
    return resolveFish(definition, actionDef, context, actionType);
  }
  let mode = modes[0];
  if (typeof prompt === 'function') {
    const promptLines = modes.map((entry, idx) => `${idx + 1}. ${entry.label || entry.key || 'Option'}`);
    const response = prompt(`How will you proceed?\n${promptLines.join('\n')}`);
    if (response) {
      const trimmed = response.trim();
      const index = Number.parseInt(trimmed, 10);
      if (Number.isFinite(index) && index >= 1 && index <= modes.length) {
        mode = modes[index - 1];
      } else {
        const lower = trimmed.toLowerCase();
        const found = modes.find(entry => (entry.key || '').toLowerCase() === lower || (entry.label || '').toLowerCase() === lower);
        if (found) mode = found;
      }
    }
  }
  const merged = { ...actionDef, ...mode };
  delete merged.modes;
  merged.label = mode.label || merged.label;
  merged.narrative = mode.narrative || merged.narrative || actionDef.narrative;
  const baseChance = Number.isFinite(mode.baseChance)
    ? mode.baseChance
    : Math.max(0, Math.min(1, (actionDef.baseChance ?? 0.5) + (mode.baseChanceModifier ?? 0)));
  merged.baseChance = baseChance;
  merged.baseAction = mode.baseAction || merged.baseAction || 'fish';
  merged.weatherModifiers = combineModifiers(actionDef.weatherModifiers, mode.weatherModifiers);
  if (merged.baseAction === 'forage') {
    return resolveForage(definition, merged, context, actionType);
  }
  if (merged.baseAction === 'fish') {
    return resolveFish(definition, merged, context, actionType);
  }
  if (merged.baseAction === 'hunt') {
    return resolveHunt(definition, merged, context, actionType);
  }
  return resolveObservationAction(actionType, definition, merged, context);
}

async function resolveLootAction(actionType, definition, actionDef = {}, context) {
  const toolCheck = hasToolRequirement(actionDef.tool, currentCharacter);
  if (!toolCheck.ok && actionDef.tool) {
    const timeSpent = 0;
    return {
      type: actionType,
      title: composeEnvironmentTitle(actionType, definition, actionDef),
      success: false,
      narrative: {
        scene: (actionDef.narrative || '').trim(),
        outcome: actionDef.tool?.message || 'You lack the proper tools for this work.',
      },
      requirementMessage: actionDef.tool?.message || 'You need proper tools.',
      rollInfo: null,
      loot: [],
      skillProgress: null,
      weather: context.weather,
      season: context.season,
      timeLabel: context.timeLabel,
      timeSpentHours: timeSpent,
      timeAfter: { days: 0, timeOfDay: currentCharacter.timeOfDay },
    };
  }

  const chanceInfo = computeActionChance(actionDef, context, {});
  const roll = Math.random();
  const success = roll < chanceInfo.chance;
  const timeSpent = determineActionTime(actionDef);
  const timeResult = advanceCharacterTime(timeSpent);
  const durationText = describeHoursDuration(timeSpent);
  let loot = [];
  if (success) {
    const draws = Math.max(1, Number.isFinite(actionDef.lootRolls) ? Math.floor(actionDef.lootRolls) : 1);
    loot = resolveLootSpecs(actionDef.lootTable || [], draws).loot;
  }
  const sceneText = (actionDef.narrative || '').trim();
  const lootNames = loot.map(entry => entry.name);
  const listText = lootNames.length ? joinWithAnd(lootNames) : 'nothing tangible';
  const outcomeText = success
    ? (actionDef.successText || `After ${durationText}, you haul back ${listText}.`)
    : (actionDef.failureText || `Despite your labor, ${durationText} passes with little to show.`);
  return {
    type: actionType,
    title: composeEnvironmentTitle(actionType, definition, actionDef),
    success,
    narrative: { scene: sceneText, outcome: outcomeText },
    rollInfo: { chance: chanceInfo.chance, roll, modifiers: chanceInfo.modifiers },
    loot,
    skillProgress: null,
    weather: context.weather,
    season: context.season,
    timeLabel: context.timeLabel,
    timeSpentHours: timeSpent,
    timeAfter: timeResult,
    requirementMessage: null,
  };
}

function describeHoursDuration(hours) {
  if (!Number.isFinite(hours) || hours <= 0) return 'a short while';
  const minutes = Math.round(hours * 60);
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const numberWords = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten',
    11: 'eleven',
    12: 'twelve',
  };
  if (hrs === 0) {
    if (mins === 30) return 'half an hour';
    if (mins === 45) return 'three quarters of an hour';
    if (mins === 15) return 'fifteen minutes';
    if (mins === 1) return 'a minute';
    if (mins === 0) return 'a short while';
    return `${mins} minutes`;
  }
  if (mins === 0) {
    if (hrs === 1) return 'an hour';
    const word = numberWords[hrs] || `${hrs}`;
    return `${word} hours`;
  }
  if (mins === 30) {
    if (hrs === 1) return 'an hour and a half';
    const word = numberWords[hrs] || `${hrs}`;
    return `${word} and a half hours`;
  }
  const hourPart = hrs === 1 ? 'an hour' : `${numberWords[hrs] || `${hrs}`} hours`;
  let minutePart;
  if (mins === 15) {
    minutePart = 'fifteen minutes';
  } else if (mins === 45) {
    minutePart = 'forty-five minutes';
  } else if (mins === 1) {
    minutePart = 'a minute';
  } else {
    minutePart = `${mins} minutes`;
  }
  return `${hourPart} and ${minutePart}`;
}

function formatPercentValue(value) {
  const pct = Math.round(value * 1000) / 10;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct}%`;
}

function formatResourceNumber(value) {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

function formatRollTooltip(rollInfo) {
  if (!rollInfo) return '';
  const chancePct = Math.round(rollInfo.chance * 1000) / 10;
  const rollPct = Math.round(rollInfo.roll * 1000) / 10;
  const lines = [`Find chance ${chancePct}% — rolled ${rollPct}%.`];
  if (Array.isArray(rollInfo.modifiers)) {
    rollInfo.modifiers.forEach(mod => {
      if (!mod || mod.value == null) return;
      lines.push(`${mod.label}: ${formatPercentValue(mod.value)}`);
    });
  }
  return lines.join('\n');
}

function formatStaminaTooltip(info) {
  if (!info) return '';
  const lines = [];
  if (Number.isFinite(info.before) && Number.isFinite(info.after)) {
    lines.push(`Stamina: ${formatResourceNumber(info.before)} → ${formatResourceNumber(info.after)}`);
  }
  if (Number.isFinite(info.intensityApplied) && info.intensityApplied > 0) {
    lines.push(`Effort cost: ${formatResourceNumber(info.intensityApplied)}`);
  }
  if (Number.isFinite(info.recoveryApplied) && info.recoveryApplied > 0) {
    const recoveryLine = [`Recovery: ${formatResourceNumber(info.recoveryApplied)}`];
    if (info.profile?.recoveryType !== 'unconventional' && Number.isFinite(info.recoveryMultiplier)) {
      recoveryLine.push(`(×${info.recoveryMultiplier})`);
    }
    lines.push(recoveryLine.join(' '));
  }
  if (
    Number.isFinite(info.baselineHoursAwake) &&
    Number.isFinite(info.hoursAwake) &&
    Math.abs(info.baselineHoursAwake - info.hoursAwake) > 0.01
  ) {
    lines.push(`Hours awake before: ${formatResourceNumber(info.baselineHoursAwake)}`);
    lines.push(`Hours awake after: ${formatResourceNumber(info.hoursAwake)}`);
  } else if (Number.isFinite(info.hoursAwake)) {
    lines.push(`Hours awake: ${formatResourceNumber(info.hoursAwake)}`);
  }
  return lines.join('\n');
}

function createInfoIconMarkup(tooltip, label = 'Additional details') {
  if (!tooltip) return '';
  return `<span class="info-icon tooltip-anchor" tabindex="0" role="img" aria-label="${escapeHtml(label)}" data-tooltip="${escapeAttribute(tooltip)}">ⓘ</span>`;
}

function buildSkillNarrative(label) {
  if (!label) return 'You feel more skilled.';
  return `You feel more skilled at ${label}.`;
}

function formatSkillTooltip(progress) {
  if (!progress) return '';
  const before = Number(progress.before) || 0;
  const after = Number(progress.after) || 0;
  const delta = Number(progress.delta) || 0;
  const gain = `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}`;
  return `${progress.label}: ${before.toFixed(2)} → ${after.toFixed(2)} (${gain})`;
}

async function resolveForage(definition, actionDef, context, actionType = 'forage') {
  await loadPlantsCatalog();
  ensurePlantsCatalogIndex();
  const chanceInfo = computeActionChance(actionDef, context, {
    skillKey: actionDef.gatherSkill || 'foraging',
  });
  const roll = Math.random();
  const found = roll < chanceInfo.chance;
  const timeSpent = actionDef.timeHours ?? 1;
  const timeResult = advanceCharacterTime(timeSpent);
  const durationText = describeHoursDuration(timeSpent);

  let plants = [];
  if (found) {
    plants = filterPlantsForAction(actionDef);
    if (!plants.length) {
      plants = filterPlantsForAction({ floraHabitats: actionDef.floraHabitats || [], floraRegions: actionDef.floraRegions || [] });
    }
    if (!plants.length) {
      plants = [];
    }
  }

  let gathered = found && plants.length ? pickRandomUnique(plants, randomInt(1, Math.min(3, plants.length))) : [];
  if (found && !gathered.length) {
    const fallbackName = actionDef.fallbackFlora || 'wild greens';
    gathered = [{ common_name: fallbackName }];
  }
  const loot = [];
  gathered.forEach(entry => {
    const qty = randomInt(1, 2);
    const name = entry.common_name;
    addItemToInventory({ name, category: 'Gathered Goods', price: 0, profit: 0, qty, baseItem: entry.common_name });
    loot.push({ name, qty });
  });

  const skillKey = actionDef.gatherSkill || 'foraging';
  const before = Number(currentCharacter[skillKey]) || 0;
  const after = performGathering(currentCharacter, skillKey, { success: found });
  const delta = Math.round((after - before) * 100) / 100;

  const gatheredNames = gathered.map(entry => entry.common_name);
  const sceneText = (actionDef.narrative || '').trim();
  const gatheredList = joinWithAnd(gatheredNames.length ? gatheredNames : ['wild herbs']);
  const outcomeText = found
    ? `After ${durationText}, you gather ${gatheredList}.`
    : `Despite careful searching, ${durationText} passes before you leave empty-handed.`;

  return {
    type: actionType,
    title: composeEnvironmentTitle(actionType, definition, actionDef),
    success: found,
    narrative: { scene: sceneText, outcome: outcomeText },
    rollInfo: { chance: chanceInfo.chance, roll, modifiers: chanceInfo.modifiers },
    loot,
    skillProgress: { key: skillKey, label: toTitleCase(skillKey), before, after, delta },
    weather: context.weather,
    season: context.season,
    timeLabel: context.timeLabel,
    timeSpentHours: timeSpent,
    timeAfter: timeResult,
  };
}

async function resolveFish(definition, actionDef, context, actionType = 'fish') {
  await loadAnimalsCatalog();
  ensureAnimalsCatalogIndex();
  const toolCheck = hasToolRequirement(actionDef.tool, currentCharacter);
  const skillKey = actionDef.gatherSkill || 'fishing';

  if (!toolCheck.ok && !actionDef.handGatherable) {
    const before = Number(currentCharacter[skillKey]) || 0;
    const after = performGathering(currentCharacter, skillKey, { success: false });
    const delta = Math.round((after - before) * 100) / 100;
    const sceneText = (actionDef.narrative || '').trim();
    const outcomeText = 'Without proper tackle the fish keep their distance.';
    return {
      type: actionType,
      title: composeEnvironmentTitle(actionType, definition, actionDef),
      success: false,
      narrative: { scene: sceneText, outcome: outcomeText },
      requirementMessage: actionDef.tool?.message || 'You lack the gear to fish here.',
      rollInfo: null,
      loot: [],
      skillProgress: { key: skillKey, label: toTitleCase(skillKey), before, after, delta },
      weather: context.weather,
      season: context.season,
      timeLabel: context.timeLabel,
      timeSpentHours: 0,
      timeAfter: { days: 0, timeOfDay: currentCharacter.timeOfDay },
    };
  }

  const usingFallback = !toolCheck.ok && !!actionDef.handGatherable;
  const chanceInfo = computeActionChance(actionDef, context, {
    baseChance: usingFallback ? actionDef.handGatherable.chance ?? 0.3 : actionDef.baseChance,
    skillKey,
    skillFactor: usingFallback ? 0.5 : 1,
    attributeFactor: usingFallback ? 0.5 : 1,
  });
  const roll = Math.random();
  const success = roll < chanceInfo.chance;
  const timeSpent = actionDef.timeHours ?? 2;
  const timeResult = advanceCharacterTime(timeSpent);
  const durationText = describeHoursDuration(timeSpent);

  let fauna = [];
  if (success) {
    fauna = filterAnimalsForAction(actionDef, usingFallback ? actionDef.handGatherable : {});
    if (!fauna.length && actionDef.handGatherable) {
      fauna = filterAnimalsForAction(actionDef.handGatherable, {});
    }
  }
  let catchList = success && fauna.length
    ? pickRandomUnique(fauna, randomInt(1, Math.min(2, fauna.length)))
    : [];
  if (success && !catchList.length) {
    const fallbackName = usingFallback ? 'river mussels' : 'small fish';
    catchList = [{ common_name: fallbackName }];
  }

  const loot = [];
  catchList.forEach(entry => {
    const qty = randomInt(1, usingFallback ? 1 : 3);
    const name = entry.common_name;
    addItemToInventory({ name, category: 'Fresh Catch', price: 0, profit: 0, qty, baseItem: entry.common_name });
    loot.push({ name, qty });
  });

  const before = Number(currentCharacter[skillKey]) || 0;
  const after = performGathering(currentCharacter, skillKey, { success });
  const delta = Math.round((after - before) * 100) / 100;

  const names = catchList.map(entry => entry.common_name);
  const baseScene = usingFallback
    ? (actionDef.handGatherable?.narrative || 'You scour the shallows by hand.')
    : (actionDef.narrative || '').trim();
  let narrative;
  if (success) {
    const listText = names.length ? joinWithAnd(names) : 'a modest haul';
    narrative = usingFallback
      ? `After ${durationText}, you pry up ${listText}.`
      : `After ${durationText}, you haul in ${listText}.`;
  } else {
    narrative = usingFallback
      ? `Despite your careful work, ${durationText} passes before the shellfish slip free.`
      : `Despite your patience, ${durationText} passes before the fish ignore your efforts today.`;
  }

  return {
    type: actionType,
    title: composeEnvironmentTitle(actionType, definition, actionDef),
    success,
    partialSuccess: success && usingFallback,
    narrative: { scene: baseScene, outcome: narrative },
    rollInfo: { chance: chanceInfo.chance, roll, modifiers: chanceInfo.modifiers },
    loot,
    skillProgress: { key: skillKey, label: toTitleCase(skillKey), before, after, delta },
    weather: context.weather,
    season: context.season,
    timeLabel: context.timeLabel,
    timeSpentHours: timeSpent,
    timeAfter: timeResult,
    requirementMessage: !toolCheck.ok && actionDef.tool?.message ? actionDef.tool.message : null,
  };
}

async function resolveHunt(definition, actionDef, context, actionType = 'hunt') {
  await loadAnimalsCatalog();
  ensureAnimalsCatalogIndex();

  const toolCheck = hasToolRequirement(actionDef.tool, currentCharacter);
  const weaponProfile = detectWeaponProfile(currentCharacter);
  const skillKey = 'hunting';

  const usingFallback = !toolCheck.ok && !!actionDef.handPrey;
  const chanceInfo = computeActionChance(actionDef, context, {
    baseChance: usingFallback ? actionDef.handPrey.chance ?? 0.3 : actionDef.baseChance,
    skillKey,
    skillFactor: usingFallback ? 0.6 : 1,
    attributeFactor: usingFallback ? 0.6 : 1,
  });
  const roll = Math.random();
  const located = roll < chanceInfo.chance;
  const timeSpent = actionDef.timeHours ?? 3;
  const timeResult = advanceCharacterTime(timeSpent);
  const durationText = describeHoursDuration(timeSpent);

  if (!toolCheck.ok && !usingFallback) {
    const before = Number(currentCharacter[skillKey]) || 0;
    const after = performHunt(currentCharacter, 1, { success: false });
    const sceneText = (actionDef.narrative || '').trim();
    const outcomeText = `Without a proper hunting weapon, ${durationText} passes and the wildlife scatters before you can strike.`;
    return {
      type: actionType,
      title: composeEnvironmentTitle(actionType, definition, actionDef),
      success: false,
      narrative: { scene: sceneText, outcome: outcomeText },
      requirementMessage: actionDef.tool?.message || 'You need a suitable hunting weapon.',
      rollInfo: { chance: chanceInfo.chance, roll, modifiers: chanceInfo.modifiers },
      loot: [],
      stages: [],
      skillProgress: { key: skillKey, label: 'Hunting', before, after, delta: Math.round((after - before) * 100) / 100 },
      weather: context.weather,
      season: context.season,
      timeLabel: context.timeLabel,
      timeSpentHours: timeSpent,
      timeAfter: timeResult,
    };
  }

  let preyList = [];
  if (located) {
    preyList = filterAnimalsForAction(actionDef, usingFallback ? actionDef.handPrey : {});
  }
  if (!preyList.length && located && actionDef.handPrey) {
    preyList = filterAnimalsForAction(actionDef.handPrey, {});
  }
  const prey = located && preyList.length ? pickRandom(preyList) : null;

  const stages = [];
  let finalSuccess = false;
  let failureKind = null;
  if (!located) {
    failureKind = 'noTracks';
    stages.push({
      name: 'Search',
      chance: chanceInfo.chance,
      roll,
      success: false,
      failureText: 'You fail to find any promising tracks today.',
    });
  } else if (!prey) {
    failureKind = 'noPrey';
    stages.push({
      name: 'Search',
      chance: chanceInfo.chance,
      roll,
      success: true,
      successText: 'You trail faint tracks through the reeds.',
    });
    stages.push({
      name: 'Quarry',
      chance: null,
      roll: null,
      success: false,
      failureText: 'Every lead goes cold before a huntable creature reveals itself.',
    });
  } else if (usingFallback) {
    const before = Number(currentCharacter[skillKey]) || 0;
    const after = performHunt(currentCharacter, HUNT_DIFFICULTY_BY_SIZE[prey.size_class] || 1, { success: true });
    const delta = Math.round((after - before) * 100) / 100;
    const qty = 1;
    const name = prey.common_name;
    addItemToInventory({ name, category: 'Game Meat', price: 0, profit: 0, qty, baseItem: prey.common_name });
    const sceneText = (actionDef.handPrey?.narrative || 'You rely on quick reflexes.').trim();
    const outcomeText = `After ${durationText}, you manage to grab ${prey.common_name}.`;
    return {
      type: actionType,
      title: composeEnvironmentTitle(actionType, definition, actionDef),
      success: true,
      partialSuccess: true,
      narrative: { scene: sceneText, outcome: outcomeText },
      rollInfo: { chance: chanceInfo.chance, roll, modifiers: chanceInfo.modifiers },
      loot: [{ name, qty }],
      stages: [
        {
          name: 'Ambush',
          chance: chanceInfo.chance,
          roll,
          success: true,
          successText: `You seize the ${prey.common_name} before it slips away.`,
        },
      ],
      skillProgress: { key: skillKey, label: 'Hunting', before, after, delta },
      weather: context.weather,
      season: context.season,
      timeLabel: context.timeLabel,
      timeSpentHours: timeSpent,
      timeAfter: timeResult,
    };
  } else {
    const size = prey.size_class || 'medium';
    const difficulty = HUNT_DIFFICULTY_BY_SIZE[size] || 3;
    const weaponBonus = weaponProfile.ranged ? 0.08 : weaponProfile.thrown ? 0.05 : weaponProfile.melee ? 0.03 : 0;

    const trackChance = clamp(0.5 + chanceInfo.skillBonus + chanceInfo.attributeBonus + (chanceInfo.modifiers?.length ? 0 : 0), 0.1, 0.95);
    const trackRoll = Math.random();
    const trackSuccess = trackRoll < trackChance;
    stages.push({
      name: 'Track',
      chance: trackChance,
      roll: trackRoll,
      success: trackSuccess,
      successText: 'You follow fresh prints deeper into the wilds.',
      failureText: 'The trail vanishes beneath fallen needles.',
    });

    let approachSuccess = false;
    let strikeSuccess = false;
    const approachChance = clamp(0.52 + chanceInfo.skillBonus * 0.8 + chanceInfo.attributeBonus * 0.8 - difficulty * 0.03, 0.1, 0.9);
    const strikeChance = clamp(0.5 + chanceInfo.skillBonus + weaponBonus - difficulty * 0.05, 0.1, 0.92);
    if (trackSuccess) {
      const approachRoll = Math.random();
      approachSuccess = approachRoll < approachChance;
      stages.push({
        name: 'Stalk',
        chance: approachChance,
        roll: approachRoll,
        success: approachSuccess,
        successText: 'You creep within striking distance.',
        failureText: 'A snapped twig sends the prey bolting.',
      });
      if (approachSuccess) {
        const strikeRoll = Math.random();
        strikeSuccess = strikeRoll < strikeChance;
        stages.push({
          name: 'Strike',
          chance: strikeChance,
          roll: strikeRoll,
          success: strikeSuccess,
          successText: `Your shot drops the ${prey.common_name}.`,
          failureText: `The ${prey.common_name} twists away at the last heartbeat.`,
        });
      }
    }
    finalSuccess = trackSuccess && approachSuccess && strikeSuccess;
    const before = Number(currentCharacter[skillKey]) || 0;
    const after = performHunt(currentCharacter, difficulty, { success: finalSuccess });
    const delta = Math.round((after - before) * 100) / 100;

    let loot = [];
    if (finalSuccess) {
      const qty = randomInt(Math.max(1, difficulty - 1), difficulty + 1);
      const name = `Game meat (${prey.common_name})`;
      addItemToInventory({ name, category: 'Game Meat', price: 0, profit: 0, qty, baseItem: prey.common_name });
      loot.push({ name, qty });
    }

    const sceneText = (actionDef.narrative || '').trim();
    const preyLabel = prey?.common_name
      ? `the ${prey.common_name}`
      : failureKind === 'noPrey'
        ? 'any quarry'
        : 'your quarry';
    const outcomeText = finalSuccess
      ? `After ${durationText} of tense stalking, you fell ${preyLabel}.`
      : failureKind === 'noPrey'
        ? `You follow several trails for ${durationText}, but each fades before you can take a shot.`
        : `Despite patient stalking, ${durationText} passes before ${preyLabel} slips away.`;

    return {
      type: actionType,
      title: composeEnvironmentTitle(actionType, definition, actionDef),
      success: finalSuccess,
      narrative: { scene: sceneText, outcome: outcomeText },
      rollInfo: { chance: chanceInfo.chance, roll, modifiers: chanceInfo.modifiers },
      loot,
      stages,
      prey,
      skillProgress: { key: skillKey, label: 'Hunting', before, after, delta },
      weather: context.weather,
      season: context.season,
      timeLabel: context.timeLabel,
      timeSpentHours: timeSpent,
      timeAfter: timeResult,
      requirementMessage: !toolCheck.ok ? actionDef.tool?.message : null,
    };
  }

  const before = Number(currentCharacter[skillKey]) || 0;
  const after = performHunt(currentCharacter, 1, { success: false });
  const sceneText = (actionDef.narrative || '').trim();
  let outcomeText;
  if (failureKind === 'noPrey') {
    outcomeText = `You pick up promising sign, but ${durationText} passes before anything huntable lingers.`;
  } else {
    outcomeText = `Despite patient searching, ${durationText} passes but nothing stirs today.`;
  }
  return {
    type: actionType,
    title: composeEnvironmentTitle(actionType, definition, actionDef),
    success: false,
    narrative: { scene: sceneText, outcome: outcomeText },
    rollInfo: { chance: chanceInfo.chance, roll, modifiers: chanceInfo.modifiers },
    loot: [],
    stages,
    skillProgress: { key: skillKey, label: 'Hunting', before, after, delta: Math.round((after - before) * 100) / 100 },
    weather: context.weather,
    season: context.season,
    timeLabel: context.timeLabel,
    timeSpentHours: timeSpent,
    timeAfter: timeResult,
  };
}

function buildEnvironmentOutcomeHTML(result) {
  if (!result) return '';
  const classes = ['location-log-entry', 'environment-log'];
  if (result.success) {
    classes.push('location-log-success');
  } else if (result.partialSuccess) {
    classes.push('location-log-partial');
  } else {
    classes.push('location-log-error');
  }
  const title = result.title ? escapeHtml(result.title) : 'Outdoor encounter';
  const pieces = [`<article class="${classes.join(' ')}"><h3>${title}</h3>`];
  let sceneText = '';
  let outcomeText = '';
  if (typeof result.narrative === 'string') {
    outcomeText = result.narrative;
  } else if (result.narrative && typeof result.narrative === 'object') {
    sceneText = (result.narrative.scene || '').trim();
    outcomeText = (result.narrative.outcome || '').trim();
  }
  const rollTooltip = formatRollTooltip(result.rollInfo);
  const outcomeIcon = createInfoIconMarkup(rollTooltip, 'Outcome details');
  if (sceneText) {
    pieces.push(`<p class="environment-scene">${escapeHtml(sceneText)}</p>`);
  }
  if (outcomeText) {
    pieces.push(
      `<p class="environment-outcome">${escapeHtml(outcomeText)}${outcomeIcon ? ` ${outcomeIcon}` : ''}</p>`
    );
  } else if (outcomeIcon) {
    pieces.push(`<p class="environment-outcome">${outcomeIcon}</p>`);
  }
  if (result.requirementMessage && !result.success && !result.partialSuccess) {
    pieces.push(`<p class="environment-requirement">${escapeHtml(result.requirementMessage)}</p>`);
  }
  if (Array.isArray(result.stages) && result.stages.length) {
    const stageItems = result.stages
      .map(stage => {
        const text = stage.success ? stage.successText : stage.failureText;
        if (!text) return '';
        let rollInfo = '';
        if (Number.isFinite(stage.chance) && Number.isFinite(stage.roll)) {
          const chancePct = Math.round(stage.chance * 100);
          const rollPct = Math.round(stage.roll * 1000) / 10;
          rollInfo = ` <span class="environment-stage-roll">(${chancePct}% vs ${rollPct}%)</span>`;
        }
        return `<li><strong>${escapeHtml(stage.name)}:</strong> ${escapeHtml(text)}${rollInfo}</li>`;
      })
      .filter(Boolean)
      .join('');
    pieces.push(`<details class="environment-stages"><summary>Encounter details</summary><ol>${stageItems}</ol></details>`);
  }
  if (Array.isArray(result.loot) && result.loot.length) {
    const lootItems = result.loot
      .map(item => `<li>${escapeHtml(item.name)} x${item.qty}</li>`)
      .join('');
    pieces.push(`<ul class="environment-loot">${lootItems}</ul>`);
  }
  if (result.staminaChange && Number.isFinite(result.staminaChange.delta)) {
    const delta = result.staminaChange.delta;
    const deltaText = delta > 0 ? `+${formatResourceNumber(delta)}` : formatResourceNumber(delta);
    const tooltip = formatStaminaTooltip(result.staminaChange);
    const icon = createInfoIconMarkup(tooltip, 'Stamina change details');
    pieces.push(
      `<p class="environment-stamina">Stamina ${escapeHtml(deltaText)}${icon ? ` ${icon}` : ''}</p>`
    );
  }
  if (result.skillProgress) {
    const { label, delta } = result.skillProgress;
    if (Number.isFinite(delta) && delta > 0) {
      const skillText = buildSkillNarrative(label);
      const tooltip = formatSkillTooltip(result.skillProgress);
      const skillIcon = createInfoIconMarkup(tooltip, `${label} progress details`);
      pieces.push(
        `<p class="environment-skill">${escapeHtml(skillText)}${skillIcon ? ` ${skillIcon}` : ''}</p>`
      );
    }
  }
  pieces.push('</article>');
  return pieces.join('');
}


  function renderSellUI(buildingName) {
  showBackButton();
  const { buys: categories, resale } = shopCategoriesForBuilding(buildingName);
  const inv = currentCharacter.inventory || [];
  const items = inv.filter(i => categories.includes(i.category));
  let html = `<div class="shop-screen"><h1>Sell to ${buildingName}</h1><p>Funds: ${formatCurrency(currentCharacter.money)}</p>`;
  if (!items.length) {
    html += '<p>They are not interested in your goods.</p></div>';
    setMainHTML(html);
    return;
  }
  html += '<ul>';
  items.forEach((item, idx) => {
    const basePrice = item.price || 0;
    const profit = item.profit || 0;
    const sellPrice = resale ? Math.max(0, Math.floor(basePrice - profit)) : Math.floor(basePrice);
    html += `<li>${item.name} x${item.qty} - ${cpToCoins(sellPrice, true, true)} <button data-idx="${idx}" data-price="${sellPrice}">Sell</button></li>`;
  });
  html += '</ul></div>';
  setMainHTML(html);
  items.forEach((item, idx) => {
    const btn = document.querySelector(`button[data-idx="${idx}"]`);
    if (btn) {
      btn.addEventListener('click', () => {
        const sellPrice = parseInt(btn.getAttribute('data-price') || '0', 10);
        removeItemFromInventory(item.name);
        const priceIron = convertCurrency(sellPrice, 'copper', 'coldIron');
        currentCharacter.money = fromIron(toIron(currentCharacter.money) + priceIron);
        renderSellUI(buildingName);
      });
    }
  });
}

const savePreference = (key, value) => {
  if (!currentProfile) return;
  currentProfile.preferences = currentProfile.preferences || {};
  currentProfile.preferences[key] = value;
  saveProfiles();
};

function createProfile(name) {
  const profileName = name || prompt('Enter profile name:');
  if (!profileName) return null;
  const id = Date.now().toString();
  profiles[id] = { id, name: profileName, preferences: {}, characters: {}, lastCharacter: null };
  currentProfileId = id;
  currentProfile = profiles[id];
  safeStorage.setItem(LAST_PROFILE_KEY, id);
  saveProfiles();
  return id;
}

function selectProfile() {
  const ids = Object.keys(profiles);
  if (currentProfileId && profiles[currentProfileId]) {
    currentProfile = profiles[currentProfileId];
    return;
  }
  if (ids.length === 0) {
    // No saved profiles and prompting may be unavailable; create a default profile
    createProfile('Player');
    return;
  }
  if (typeof prompt !== 'function') {
    // Fallback to the first profile if prompts cannot be shown
    currentProfileId = ids[0];
    currentProfile = profiles[currentProfileId];
    safeStorage.setItem(LAST_PROFILE_KEY, currentProfileId);
    return;
  }
  let choice = '';
  while (!currentProfile) {
    choice = prompt(`Select profile (${ids.map(id => profiles[id].name).join(', ')})\nEnter a new name to create one:`);
    if (choice === null || choice.trim() === '') {
      // User cancelled; default to first profile so the UI can load
      currentProfileId = ids[0];
      currentProfile = profiles[currentProfileId];
      safeStorage.setItem(LAST_PROFILE_KEY, currentProfileId);
      break;
    }
    const existingId = ids.find(id => profiles[id].name === choice);
    if (existingId) {
      currentProfileId = existingId;
      currentProfile = profiles[existingId];
      safeStorage.setItem(LAST_PROFILE_KEY, currentProfileId);
    } else {
      createProfile(choice);
    }
  }
}

function canManageBuilding(city, building) {
  const owned = (currentCharacter.buildings || []).some(
    b => b.name === building && (b.ownership === 'owner' || b.ownership === 'manager'),
  );
  const employed = (currentCharacter.employment || []).some(
    j =>
      j.building === building &&
      j.location === city &&
      ['Owner', 'Manager', 'Administrator'].includes(j.role),
  );
  return owned || employed;
}

const buildingEncounterStates = {};

function getBuildingEncounterState(name) {
  if (!name) return null;
  return buildingEncounterStates[name] || null;
}

function setBuildingEncounterState(name, state) {
  if (!name) return;
  if (state == null) {
    delete buildingEncounterStates[name];
  } else {
    buildingEncounterStates[name] = state;
  }
}

function resetBuildingEncounterState(name) {
  if (!name) return;
  delete buildingEncounterStates[name];
  if (name === "Merchants' Wharf") {
    applyMerchantsWharfDynamicBoard(null);
  }
}

function createBuildingEncounterContext(position, extras = {}) {
  if (!position || !position.building) return null;
  const cityData = CITY_NAV[position.city];
  if (!cityData) return null;
  const buildingKey = position.building;
  const building = extras.building || cityData.buildings?.[buildingKey];
  if (!building) return null;
  const buildingName = extras.buildingName || building.name || buildingKey;
  let boardGroups = [];
  if (Array.isArray(extras.buildingBoards) && extras.buildingBoards.length) {
    if (Array.isArray(extras.buildingBoards[0]?.boards)) {
      boardGroups = extras.buildingBoards;
    } else {
      boardGroups = extras.buildingBoards.map(entry => {
        const entryName = entry?.name || entry?.boardName || buildingName;
        const normalized = normalizePlaceName(entryName || buildingName);
        const quests = Array.isArray(entry?.quests) ? entry.quests : [];
        return {
          key: normalized,
          name: entryName || buildingName,
          district: entry?.district || position.district || null,
          boards: [
            {
              name: entryName || buildingName,
              quests: quests.map(quest => ({
                quest,
                binding: resolveQuestBinding(quest, entryName || buildingName),
              })),
            },
          ],
        };
      });
    }
  } else {
    boardGroups = questBoardsForBuilding(position.city, position.district, buildingKey);
  }
  const buildingBoards = Array.isArray(boardGroups)
    ? boardGroups.flatMap(group =>
        group.boards.map(section => ({
          name: section.name,
          quests: section.quests.map(entry => entry.quest),
        })),
      )
    : [];
  const today = extras.today || worldCalendar.today();
  const timeOfDay =
    extras.timeOfDay != null ? extras.timeOfDay : currentCharacter ? currentCharacter.timeOfDay : null;
  const timeLabel = extras.timeLabel || describeTimeOfDay(timeOfDay);
  let habitat = extras.habitat || building.habitat;
  if (!habitat) {
    const districtName = position.district || '';
    const name = building.name || buildingKey || '';
    if (/farmland|orchard|fields|grove|meadow|pasture/i.test(districtName)) habitat = 'farmland';
    else if (/orchard|farm|grove|pasture|meadow/i.test(name)) habitat = 'farmland';
    else if (/port|harbor|dock|quay|pier/i.test(districtName)) habitat = 'coastal';
    else if (/dock|port|harbor|quay|pier/i.test(name)) habitat = 'coastal';
    else if (/forest|wood|grove/i.test(districtName)) habitat = 'forest';
    else habitat = 'urban';
  }
  let weatherReport = extras.weather || null;
  if (!weatherReport) {
    try {
      const regionKey = citySlug(position.city);
      weatherReport = weatherSystem.getDailyWeather(regionKey, habitat, today);
    } catch (err) {
      try {
        weatherReport = weatherSystem.getDailyWeather('waves_break', habitat, today);
      } catch (err2) {
        weatherReport = null;
      }
    }
  }
  const state = extras.state ?? getBuildingEncounterState(buildingKey);
  return {
    state,
    setState: newState => setBuildingEncounterState(buildingKey, newState),
    buildingBoards,
    boardGroups,
    today,
    timeOfDay,
    timeLabel,
    weather: weatherReport,
    city: position.city,
    district: position.district,
    building,
    habitat,
    buildingName,
  };
}

function renderBuildingDescription(desc, character) {
  if (!desc) return '';
  if (typeof desc === 'object' && !Array.isArray(desc)) {
    if (typeof desc.html === 'string') {
      return `<div class="building-description">${desc.html}</div>`;
    }
    if (Array.isArray(desc.paragraphs)) {
      return renderBuildingDescription(desc.paragraphs, character);
    }
    if (typeof desc.text === 'string') {
      return renderBuildingDescription(desc.text, character);
    }
  }
  const parts = Array.isArray(desc) ? desc : [desc];
  const html = parts
    .map(segment => {
      if (segment == null) return '';
      const replaced = replaceCharacterRefs(String(segment), character || {});
      const safe = escapeHtml(replaced);
      if (!safe) return '';
      const sections = safe
        .split(/(?:\r?\n){2,}/)
        .map(sec => sec.trim())
        .filter(Boolean);
      if (!sections.length) {
        return `<p>${safe.replace(/(?:\r?\n)/g, '<br>')}</p>`;
      }
      return sections
        .map(sec => `<p>${sec.replace(/(?:\r?\n)/g, '<br>')}</p>`)
        .join('');
    })
    .join('');
  return `<div class="building-description">${html}</div>`;
}

const BUILDING_PERSONA_DETAILS = {
  warm: [
    'hands dusted with work-stained calluses',
    'a welcoming nod despite the workload',
    'coat sleeves rolled back with practiced ease',
  ],
  gruff: [
    'ledger tucked beneath one arm',
    'voice already sharp from giving orders',
    'boots scuffed by long rounds through the site',
  ],
  dry: [
    'quill marks smudged along their cuffs',
    'glasses glinting as they take stock of you',
    'a tally slate balanced carefully in hand',
  ],
};

function buildingTimeBand(hour) {
  if (!Number.isFinite(hour)) return 'day';
  const h = ((hour % 24) + 24) % 24;
  if (h < 5) return 'preDawn';
  if (h < 9) return 'earlyMorning';
  if (h < 12) return 'lateMorning';
  if (h < 15) return 'earlyAfternoon';
  if (h < 18) return 'lateAfternoon';
  if (h < 21) return 'evening';
  return 'night';
}

function buildingGreetingChance(timeBand, weather, workers) {
  const baseChances = {
    preDawn: 0.1,
    earlyMorning: 0.45,
    lateMorning: 0.58,
    earlyAfternoon: 0.55,
    lateAfternoon: 0.42,
    evening: 0.3,
    night: 0.12,
    day: 0.45,
  };
  let chance = baseChances[timeBand] ?? baseChances.day;
  if (workers >= 20) chance += 0.15;
  else if (workers >= 10) chance += 0.05;
  else if (workers === 0) chance -= 0.2;
  else if (workers <= 4) chance -= 0.1;
  if (weather) {
    const condition = (weather.condition || '').toLowerCase();
    if (condition.includes('storm')) chance -= 0.2;
    else if (condition.includes('rain') || condition.includes('drizzle')) chance -= 0.1;
    else if (condition.includes('fog')) chance -= 0.05;
    else if (condition.includes('clear')) chance += 0.05;
  }
  return Math.max(0.05, Math.min(0.85, chance));
}

function buildingWorkerEstimate(profile, timeBand, weather, building, buildingName) {
  const displayName = building?.name || buildingName || profile?.name;
  if (isOutdoorSite(displayName)) {
    return 0;
  }
  const base =
    profile?.workforce?.normal?.reduce((sum, band) => sum + (band.count || 0), 0) ||
    (building?.employees ? Math.max(3, Math.round(building.employees.length * 0.75)) : 6);
  const multipliers = {
    preDawn: 0.2,
    earlyMorning: 0.6,
    lateMorning: 0.9,
    earlyAfternoon: 1,
    lateAfternoon: 0.75,
    evening: 0.45,
    night: 0.25,
    day: 0.65,
  };
  let workers = Math.round(base * (multipliers[timeBand] ?? multipliers.day));
  if (weather) {
    const condition = (weather.condition || '').toLowerCase();
    if (condition.includes('storm')) workers = Math.round(workers * 0.5);
    else if (condition.includes('rain') || condition.includes('drizzle')) workers = Math.round(workers * 0.7);
    else if (condition.includes('snow') || condition.includes('sleet')) workers = Math.round(workers * 0.6);
    else if (condition.includes('clear')) workers = Math.round(workers * 1.05);
  }
  if (workers < 0) workers = 0;
  if (base > 0 && workers === 0) workers = 1;
  return workers;
}

function buildingWeatherLocale(buildingName) {
  const name = (buildingName || '').toLowerCase();
  if (name.includes('wharf') || name.includes('dock') || name.includes('pier') || name.includes('quay')) return 'the wharf';
  if (name.includes('yard')) return 'the yard';
  if (name.includes('warehouse') || name.includes('row')) return 'the warehouse lanes';
  if (name.includes('forge') || name.includes('smith') || name.includes('foundry')) return 'the forges';
  if (name.includes('glass')) return 'the glassworks';
  if (name.includes('market') || name.includes('exchange') || name.includes('bazaar')) return 'the market stalls';
  if (name.includes('temple') || name.includes('shrine')) return 'the sanctuary';
  if (name.includes('library') || name.includes('records') || name.includes('archive')) return 'the stacks';
  if (name.includes('hall')) return 'the hall';
  if (name.includes('guild')) return 'the guildhall';
  if (name.includes('mill')) return 'the mill floor';
  if (name.includes('farm') || name.includes('orchard') || name.includes('vineyard') || name.includes('field')) return 'the rows';
  return 'the worksite';
}

function buildingWeatherSurface(buildingName) {
  const name = (buildingName || '').toLowerCase();
  if (name.includes('wharf') || name.includes('dock') || name.includes('pier') || name.includes('quay')) return 'the wharf planks';
  if (name.includes('yard')) return "the yard's packed earth";
  if (name.includes('warehouse') || name.includes('row')) return 'the warehouse roofs';
  if (name.includes('forge') || name.includes('smith') || name.includes('foundry')) return 'the forge awnings';
  if (name.includes('glass')) return 'the glasshouse vents';
  if (name.includes('market') || name.includes('exchange') || name.includes('bazaar')) return 'the market awnings';
  if (name.includes('temple') || name.includes('shrine')) return 'the sanctuary eaves';
  if (name.includes('library') || name.includes('records') || name.includes('archive')) return 'the library eaves';
  if (name.includes('hall')) return "the hall's stonework";
  if (name.includes('guild')) return 'the guildhall lintels';
  if (name.includes('mill')) return 'the mill roof';
  if (name.includes('farm') || name.includes('orchard') || name.includes('vineyard') || name.includes('field')) return 'the field rows';
  return 'the roofs overhead';
}

function buildingWorkforceNoun(buildingName) {
  const name = (buildingName || '').toLowerCase();
  if (name.includes('wharf') || name.includes('dock') || name.includes('pier') || name.includes('quay')) return 'dock crews';
  if (name.includes('warehouse') || name.includes('row')) return 'teamsters';
  if (name.includes('yard')) return 'yard hands';
  if (name.includes('forge') || name.includes('smith') || name.includes('foundry')) return 'smiths';
  if (name.includes('glass')) return 'glassworkers';
  if (name.includes('market') || name.includes('exchange') || name.includes('bazaar')) return 'marketfolk';
  if (name.includes('temple') || name.includes('shrine')) return 'acolytes';
  if (name.includes('library') || name.includes('records') || name.includes('archive')) return 'scribes';
  if (name.includes('guild')) return 'guild clerks';
  if (name.includes('mill')) return 'millhands';
  if (name.includes('farm') || name.includes('orchard') || name.includes('vineyard') || name.includes('field')) return 'farmhands';
  if (name.includes('inn') || name.includes('tavern')) return 'innkeepers';
  if (name.includes('hall')) return 'attendants';
  return 'crews';
}

function buildingWorkforceGroup(buildingName, workforceNoun) {
  if (!buildingName) return `the ${workforceNoun}`;
  if (/^The\s+/i.test(buildingName)) {
    return `the ${workforceNoun} of the ${buildingName.slice(4)}`;
  }
  return `the ${workforceNoun} of ${buildingName}`;
}

function buildingWeatherPhrase(weather, habitat, buildingName) {
  if (!weather) {
    return '';
  }
  const condition = (weather.condition || '').toLowerCase();
  if (condition.includes('storm')) {
    const locale = buildingWeatherLocale(buildingName);
    return habitat === 'coastal'
      ? 'storm gusts fling spray across the yard'
      : `storm winds rattle through ${locale}`;
  }
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return `rain patters against ${buildingWeatherSurface(buildingName)}`;
  }
  if (condition.includes('fog')) {
    return `fog muffles the bustle around ${buildingWeatherLocale(buildingName)}`;
  }
  if (condition.includes('snow') || condition.includes('sleet')) {
    return 'slush slicks every step';
  }
  if (condition.includes('clear')) {
    return 'clear skies lend the crews fresh energy';
  }
  if (condition.includes('cloud')) {
    return 'overcast light keeps the pace steady';
  }
  return `shifting weather swirls above ${buildingWeatherLocale(buildingName)}`;
}

function merchantsWharfConditionDetails(weather) {
  const condition = (weather?.condition || '').toLowerCase();
  if (condition.includes('storm')) {
    return {
      entrySetting: 'bracing against spray-lashed planks',
      pacePhrase: 'keep their footing with shouted counts over the gale',
      crateDescriptor: 'are lashed beneath weighted tarps',
      shipDetail: 'its crew double-checking storm lines while smaller cutters stand off the pier',
    };
  }
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return {
      entrySetting: 'stopping amid rain-soaked cobbles',
      pacePhrase: 'keep a redoubled pace beneath the downpour',
      crateDescriptor: 'teeter in tarpaulin-draped stacks',
      shipDetail: 'its crew rigging tarps while smaller vessels shuffle through the squall',
    };
  }
  if (condition.includes('fog')) {
    return {
      entrySetting: 'feeling your way along fog-damp boards',
      pacePhrase: 'move by shouted tallies through the haze',
      crateDescriptor: 'loom as shadowed silhouettes above the quay',
      shipDetail: 'its lamps burning steady beacons for the clustered luggers',
    };
  }
  if (condition.includes('snow') || condition.includes('sleet')) {
    return {
      entrySetting: 'finding your footing on slush-slick timbers',
      pacePhrase: 'work carefully to keep loads steady through the sleet',
      crateDescriptor: 'sit wrapped in oilcloth lashings that glisten with frost',
      shipDetail: 'its rigging rimed while harbor cogs nudge through the chop',
    };
  }
  if (condition.includes('clear')) {
    return {
      entrySetting: 'stepping onto sun-warmed planks',
      pacePhrase: 'move with a crisp, confident rhythm beneath the clear sky',
      crateDescriptor: 'form neat terraces beside the quay',
      shipDetail: 'its brightwork gleaming as cutters dart through the calm',
    };
  }
  if (condition.includes('cloud')) {
    return {
      entrySetting: 'pausing on wind-brushed planks',
      pacePhrase: 'press forward in the muted light under rolling clouds',
      crateDescriptor: 'rise in orderly stacks beneath the gray glow',
      shipDetail: 'its quarterdeck coordinating tenders lined along the pier',
    };
  }
  return {
    entrySetting: 'finding your footing on weathered planks',
    pacePhrase: 'maintain a steady flow despite the shifting tide',
    crateDescriptor: 'teeter in well-ordered tiers ready for inspection',
    shipDetail: 'its officers signalling to nimble harbor craft',
  };
}

function merchantsWharfSeasonNote(season) {
  const lower = (season || '').toLowerCase();
  if (!lower) return '';
  if (lower.includes('spring')) {
    return 'many marked with fresh blossom sigils from the inland markets';
  }
  if (lower.includes('summer')) {
    return 'their tarred ropes tacky in the heavy summer air';
  }
  if (lower.includes('autumn') || lower.includes('fall')) {
    return 'bearing ocher harvest stamps bound for distant holds';
  }
  if (lower.includes('winter')) {
    return 'their canvas covers stiff where the cold bites through the harbor';
  }
  return '';
}

function merchantsWharfShiftEvidence(timeLabel) {
  const lower = (timeLabel || '').toLowerCase();
  if (!lower) return 'evidence of crews ready to work every tide from dawn to dusk';
  if (lower.includes('deep night')) {
    return 'evidence of crews pushing through the dead of night to catch the tide';
  }
  if (lower.includes('pre-dawn')) {
    return 'evidence of crews already driving loads before first light';
  }
  if (lower.includes('early morning')) {
    return 'evidence of a shift shaking off dawn bells and building momentum';
  }
  if (lower.includes('late morning')) {
    return 'evidence of work rolling since first bell with no sign of slowing';
  }
  if (lower.includes('early afternoon')) {
    return 'evidence of crews hauling since sunup to meet the afternoon tide';
  }
  if (lower.includes('late afternoon')) {
    return 'evidence of teams racing to beat the sunset tide';
  }
  if (lower.includes('evening')) {
    return 'evidence of laborers determined to clear the decks before nightfall';
  }
  if (lower.includes('night')) {
    return 'evidence of crews grinding on under lantern light for the night tide';
  }
  if (lower.includes('day')) {
    return 'evidence of crews pressing steadily through the day';
  }
  return 'evidence of crews ready to work every tide from dawn to dusk';
}

function merchantsWharfOverview({ weather, season, timeLabel }) {
  const details = merchantsWharfConditionDetails(weather);
  const seasonNote = merchantsWharfSeasonNote(season);
  const shiftNote = merchantsWharfShiftEvidence(timeLabel);
  const entrySentence = `You weave your way through shouting stevedores, ${details.entrySetting} as you step onto the Merchants' Wharf pier.`;
  const throngSentence = `Throngs of laborers and merchants ${details.pacePhrase} between the docks and the Port District while cargo lines move on and off the ships.`;
  let crateSentence = `Stacks of crates ${details.crateDescriptor}`;
  if (seasonNote) {
    crateSentence += `, ${seasonNote}`;
  }
  crateSentence += `, ${shiftNote}.`;
  const shipSentence = `A large ocean frigate bearing the Coral Keep crest sits alongside the pier, ${details.shipDetail}.`;
  return `${entrySentence} ${throngSentence} ${crateSentence} ${shipSentence}`;
}

function normalizeSeasonKey(season) {
  const lower = (season || '').toLowerCase();
  if (!lower) return null;
  if (lower.includes('spring')) return 'spring';
  if (lower.includes('summer')) return 'summer';
  if (lower.includes('autumn') || lower.includes('fall')) return 'autumn';
  if (lower.includes('winter')) return 'winter';
  return lower;
}

function normalizeTimeKey(timeLabel) {
  const lower = (timeLabel || '').toLowerCase();
  if (!lower) return 'day';
  if (lower.includes('deep night') || lower.includes('midnight')) return 'night';
  if (lower.includes('pre-dawn') || lower.includes('predawn')) return 'predawn';
  if (lower.includes('early morning')) return 'morning';
  if (lower.includes('late morning')) return 'late-morning';
  if (lower.includes('early afternoon')) return 'afternoon';
  if (lower.includes('late afternoon')) return 'late-afternoon';
  if (lower.includes('evening')) return 'evening';
  if (lower.includes('night')) return 'night';
  if (lower.includes('afternoon')) return 'afternoon';
  if (lower.includes('morning')) return 'morning';
  return 'day';
}

function normalizeWeatherKey(weather) {
  const condition = (weather?.condition || '').toLowerCase();
  if (!condition) return null;
  if (condition.includes('storm') || condition.includes('gale') || condition.includes('squall')) return 'storm';
  if (condition.includes('rain') || condition.includes('drizzle')) return 'rain';
  if (condition.includes('fog') || condition.includes('mist')) return 'fog';
  if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice')) return 'snow';
  if (condition.includes('clear')) return 'clear';
  if (condition.includes('cloud')) return 'cloud';
  return condition.split(/[\s,]+/)[0] || condition;
}

function evaluateOverviewValue(value, fragments) {
  if (typeof value === 'function') return value(fragments);
  if (Array.isArray(value)) {
    const list = value.filter(Boolean);
    if (!list.length) return '';
    const rng = fragments.rng ?? Math.random;
    const index = Math.floor(rng() * list.length);
    const entry = list[index] ?? list[0];
    if (typeof entry === 'function') return entry(fragments);
    return entry;
  }
  return value;
}

function chooseOverviewFragment(options, fragments) {
  if (!options) return '';
  const { events = [], weatherKey, seasonKey, timeKey } = fragments;
  const order = [];
  events.forEach(event => order.push(`event:${event}`));
  if (weatherKey) order.push(`weather:${weatherKey}`);
  if (seasonKey) order.push(`season:${seasonKey}`);
  if (timeKey) order.push(`time:${timeKey}`);
  order.push('default');
  for (const key of order) {
    if (!key) continue;
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      const resolved = evaluateOverviewValue(options[key], fragments);
      if (resolved) return resolved;
    }
  }
  const values = Object.values(options);
  for (const value of values) {
    const resolved = evaluateOverviewValue(value, fragments);
    if (resolved) return resolved;
  }
  return '';
}

function outdoorEnvironmentFlags(nameLower) {
  return {
    isRiver: /river|riverbank|brook|creek|stream|shallows|ford/.test(nameLower),
    isCoast: /beach|shore|coast|dune|cliff|cove|bay|surf|tidal/.test(nameLower),
    isForest: /forest|wood|pine|grove|thicket|glade|copse/.test(nameLower),
    isGrassland: /grassland|meadow|plain|prairie|moor|heath|steppe/.test(nameLower),
    isWetland: /marsh|bog|fen|swamp|reed|mire|wetland/.test(nameLower),
    isHills: /hill|ridge|bluff|crag|rise/.test(nameLower),
  };
}

function isOutdoorSite(name) {
  if (!name) return false;
  const lower = String(name).toLowerCase();
  if (/camp|fair|tournament/.test(lower)) return true;
  const flags = outdoorEnvironmentFlags(lower);
  return Object.values(flags).some(Boolean);
}

function gatherBuildingOverviewFlags(nameLower) {
  const outdoorFlags = outdoorEnvironmentFlags(nameLower);
  return Object.assign({
    isGlass: /glass|blower|kiln|glory hole/.test(nameLower),
    isForge: /forge|smith|anvil|foundry|smelter/.test(nameLower),
    isTannery: /tann|hide|leather|skin|curing/.test(nameLower),
    isRope: /rope|rigging|cord|line|cable/.test(nameLower),
    isBrew: /brew|ale|mead|distill|spirits|wine|winery|cider|brewery/.test(nameLower),
    isBakery: /bake|oven|bread|pastry|bakery|loaf/.test(nameLower),
    isTailor: /tailor|seam|cloth|garb|loom|weave|textile|drape|haberdash/.test(nameLower),
    isCarpenter: /carpenter|wood|saw|joiner|lumber|timber/.test(nameLower),
    isPrinter: /press|printer|typeset|type|broadside/.test(nameLower),
    isMason: /mason|stone|brick|kiln/.test(nameLower),
    isTemple: /temple|shrine|sanctuary|altar|cathedral|chapel/.test(nameLower),
    isMarket: /market|bazaar|plaza|square|exchange|mart/.test(nameLower),
    isInn: /inn|tavern|alehouse|hostel|lodge|pub|cantina|taproom/.test(nameLower),
    isGarrison: /barracks|guard|watch|garrison|fort|gate/.test(nameLower),
    isHarbor: /wharf|dock|pier|quay|shipyard|slip/.test(nameLower),
    isOutdoor: isOutdoorSite(nameLower),
  }, outdoorFlags);
}

function buildingTypeKey(buildingName, businessProfile) {
  const nameLower = (buildingName || '').toLowerCase();
  const category = (businessProfile?.category || '').toLowerCase();
  if (/wharf|dock|pier|quay/.test(nameLower)) return 'port';
  if (/shipyard|drydock|slip/.test(nameLower)) return 'shipyard';
  if (/yard/.test(nameLower) && /naval|ship|dock/.test(nameLower)) return 'shipyard';
  if (/warehouse|granary|storehouse|depot|stockyard|barn/.test(nameLower)) return 'warehouse';
  if (/barracks|guard|watch|garrison|fort|gate/.test(nameLower)) return 'garrison';
  if (/temple|shrine|sanctuary|altar|cathedral|chapel/.test(nameLower)) return 'temple';
  if (/library|archive|records|athenaeum|scriptorium/.test(nameLower)) return 'archive';
  if (/academy|school|college|lyceum|seminary/.test(nameLower)) return 'academy';
  if (/guild|exchange|hall|consulate/.test(nameLower)) return 'guild';
  if (/market|bazaar|plaza|square|mart/.test(nameLower)) return 'market';
  if (/inn|tavern|alehouse|hostel|lodge|pub|cantina|taproom/.test(nameLower)) return 'inn';
  if (/mill|wheel|grinder|press/.test(nameLower)) return 'mill';
  if (/brew|distill|brewery|mead|spirits|wine|winery|cider/.test(nameLower)) return 'workshop_craft';
  if (/forge|smith|anvil|foundry|smelter/.test(nameLower)) return 'workshop_hot';
  if (/glass|kiln|blower|furnace/.test(nameLower)) return 'workshop_hot';
  if (/ropewalk|rope|rigging|loom|weave|tailor|tannery|leather|dye|cooper|sailmaker|butcher|smokehouse|bakery|oven|carpenter|woodshop|printer|press|workshop|smithy/.test(nameLower)) {
    return 'workshop_craft';
  }
  if (/farm|field|pasture|orchard|grove|meadow|polder|ranch|vineyard|stockyard|barn|apiary|dairy|paddock|stead|acre|garden/.test(nameLower)) {
    return 'farm';
  }
  if (isOutdoorSite(buildingName)) return 'wilds';
  if (/clinic|hospital|healer|apothecary|bath|spa|sanitorium|theater|opera|playhouse|amphitheater/.test(nameLower)) {
    return 'service';
  }
  switch (category) {
    case 'logistics':
      return /wharf|dock|pier|quay/.test(nameLower) ? 'port' : 'warehouse';
    case 'security':
      return 'garrison';
    case 'support':
      return 'service';
    case 'service':
      return 'service';
    case 'hospitality':
      return 'inn';
    case 'processing':
      return /forge|smelt|kiln|glass/.test(nameLower) ? 'workshop_hot' : 'workshop_craft';
    case 'craft':
      return /forge|smith|glass|kiln/.test(nameLower) ? 'workshop_hot' : 'workshop_craft';
    case 'agriculture':
      return 'farm';
    case 'education':
      return 'academy';
    case 'religion':
      return 'temple';
    default:
      break;
  }
  return 'default';
}

function gatherBuildingOverviewEvents(context, typeKey, weatherKey, seasonKey, timeKey) {
  const events = new Set();
  if (timeKey === 'night' || timeKey === 'evening' || timeKey === 'predawn') {
    events.add('night_shift');
  }
  if (weatherKey === 'storm') events.add('storm_response');
  if (weatherKey === 'rain') events.add('rainfall');
  if (weatherKey === 'fog') events.add('fogbound');
  if (weatherKey === 'snow') events.add('snowfall');
  if (typeKey === 'farm' && (seasonKey === 'summer' || seasonKey === 'autumn')) {
    events.add('harvest_rush');
  }
  if (typeKey === 'mill' && seasonKey === 'autumn') {
    events.add('harvest_rush');
  }
  if (typeKey === 'temple' && seasonKey === 'spring') {
    events.add('pilgrimage');
  }
  if (typeKey === 'market' && seasonKey === 'spring') {
    events.add('festival_buzz');
  }
  if (typeKey === 'garrison' && (timeKey === 'morning' || timeKey === 'afternoon')) {
    events.add('drill');
  }
  (context.businessProfile?.laborConditions || []).forEach(entry => {
    const trigger = (entry?.trigger || '').toLowerCase();
    const seasonText = (entry?.season || '').toLowerCase();
    const seasonMatch = !seasonText || (seasonKey && seasonText.includes(seasonKey));
    if (!seasonMatch) return;
    if (trigger.includes('harvest')) events.add('harvest_condition');
    if (trigger.includes('storm')) events.add('storm_backlog');
    if (trigger.includes('festival') || trigger.includes('holiday')) events.add('festival');
    if (trigger.includes('surge') || trigger.includes('rush')) events.add('surge');
    if (trigger.includes('inspection') || trigger.includes('audit')) events.add('inspection');
    if (trigger.includes('convoy')) events.add('convoy');
    if (trigger.includes('drill') || trigger.includes('patrol')) events.add('patrol');
  });
  return Array.from(events);
}

function sampleProductionGood(profile, rng) {
  const goods = profile?.production?.goods;
  if (Array.isArray(goods) && goods.length) {
    const index = Math.floor((rng ?? Math.random)() * goods.length);
    return goods[index] ?? goods[0];
  }
  return null;
}

function sentenceFromSlug(slug) {
  if (!slug) return '';
  let text = slug.trim();
  if (!text) return '';
  text = text.replace(/\s+/g, ' ');
  const first = text.charAt(0);
  if (first && first === first.toLowerCase()) {
    text = first.toUpperCase() + text.slice(1);
  }
  if (!/[.!?]$/.test(text)) {
    text += '.';
  }
  return text;
}

function stripTerminalPunctuation(text) {
  if (!text) return '';
  return text.replace(/[.!?]+$/, '');
}

function mergeSentencesWithConnector(primary, secondary, connector = 'while') {
  const first = stripTerminalPunctuation(primary);
  const second = stripTerminalPunctuation(secondary);
  if (!first) return sentenceFromSlug(second);
  if (!second) return sentenceFromSlug(first);
  const clause = `${first} ${connector} ${lowercaseFirst(second)}`;
  return sentenceFromSlug(clause);
}

function joinOverviewParts(...parts) {
  const filtered = parts.filter(Boolean).join(', ');
  return filtered ? sentenceFromSlug(filtered) : '';
}

const BUILDING_OVERVIEW_BLUEPRINTS = {
  wilds: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        'weather:storm': 'brace against wind-driven rain that scours the open ground',
        'weather:rain': fragments.flags.isCoast
          ? 'walk the tideline while rain stipples the sand'
          : fragments.flags.isRiver
            ? 'pick through slick reeds as rain dimples the current'
            : 'move carefully along mud-darkened trails as rain patters around you',
        'weather:fog': fragments.flags.isCoast
          ? 'listen to the surf muffled by fog as you crest the dunes'
          : 'follow muted silhouettes while fog beads on nearby brush',
        'weather:snow': fragments.flags.isForest
          ? 'follow softened steps beneath snow-weighted boughs'
          : 'crunch across frost-hardened ground beneath a pale sky',
        'weather:clear': fragments.flags.isRiver
          ? 'trace sunlit ripples along the riverbank'
          : fragments.flags.isCoast
            ? 'walk bright dunes while salt wind stings your cheeks'
            : 'breathe crisp air across open land where grasses sway',
        default: fragments.flags.isRiver
          ? 'follow the reed-lined bank beside the slow current'
          : fragments.flags.isCoast
            ? 'stroll damp sand where waves lap in steady rhythm'
            : fragments.flags.isForest
              ? 'move beneath the shade of wind-stirred boughs'
              : 'cross quiet ground where wild grasses rustle',
      },
      fragments,
    );
    const ambient = chooseOverviewFragment(
      {
        'time:predawn': 'pre-dawn hush leaves only distant water and rustling leaves to mark the hour',
        'time:morning': fragments.flags.isRiver
          ? 'first light paints the shallows while mist lifts off the current'
          : fragments.flags.isCoast
            ? 'gulls cry over the tideline as the morning tide creeps in'
            : 'sunrise warms dew from grasses and shrubs',
        'time:late-morning': 'late-morning light settles across the landscape without stirring much traffic',
        'time:afternoon': 'insects drone through the afternoon heat while the open ground lies largely undisturbed',
        'time:late-afternoon': 'lengthening shadows stretch across the terrain as evening nears',
        'time:evening': fragments.flags.isRiver
          ? 'dusk glimmers along the water while frogs ready their chorus'
          : 'crickets strike up song as twilight settles',
        'time:night': fragments.flags.isRiver
          ? 'only the river’s murmur keeps you company beneath the night sky'
          : 'moonlight silvers the landscape while distant creatures call',
        default: 'the area lies quiet aside from wind and wildlife',
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        'season:spring': fragments.flags.isRiver
          ? 'fresh shoots line the bank where minnows dart between reeds'
          : 'new growth and blossoms lend color to the wild ground',
        'season:summer': fragments.flags.isCoast
          ? 'warm salt air carries the tang of drying kelp'
          : 'summer growth thickens the brush where wildlife hides',
        'season:autumn': fragments.flags.isForest
          ? 'fallen leaves carpet the path beneath turning canopies'
          : 'autumn hues ripple through bending grasses',
        'season:winter': fragments.flags.isRiver
          ? 'ice rims the edges of the current while the main flow stays dark'
          : 'frost grips the landscape, muting scent and sound',
        default: fragments.flags.isForest
          ? 'pine resin and leaf litter scent the steady hush'
          : fragments.flags.isCoast
            ? 'the rhythmic pulse of waves marks the time between gusts'
            : 'open country stretches away, shaped by wind and weather',
      },
      fragments,
    );
    const entrySentence = entryAction ? `You ${entryAction}` : '';
    const ambientSentence = ambient || '';
    const featureSentence = feature || '';
    const sentences = [];
    const combined = mergeSentencesWithConnector(entrySentence, ambientSentence, 'while');
    if (combined) {
      sentences.push(combined);
    } else {
      if (entrySentence) sentences.push(sentenceFromSlug(entrySentence));
      if (!entrySentence && ambientSentence) sentences.push(sentenceFromSlug(ambientSentence));
    }
    const featureClean = stripTerminalPunctuation(featureSentence);
    if (featureClean) {
      sentences.push(sentenceFromSlug(featureClean));
    }
    return sentences.filter(Boolean);
  },
  port: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "event:storm_response": "brace against spray-lashed planks as gusts slam the awnings",
        "weather:rain": "sidestep puddles pooling along the rain-slick planks",
        "weather:fog": "feel your way past lantern posts wrapped in fog",
        "weather:snow": "test each slush-slick timber while the harbor wind bites",
        "weather:clear": "step over sun-warmed planks beneath a bright coastal sky",
        "weather:cloud": "move along wind-brushed planks under muted daylight",
        default: "thread between coiled hawsers and weathered bollards along the pier",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:storm_backlog": "Storm-delayed crews bark orders while crane captains juggle berths",
        "event:night_shift": "Lantern teams trade hushed counts while harbor bells mark the tide",
        "event:surge": "Extra gangs haul in double-time as manifests pile higher than usual",
        "time:predawn": "Bleary stevedores set hooks for the first tide before dawn breaks",
        "time:night": "Night crews labor under swinging lanterns to clear the holds before dawn",
        "time:morning": "Dock crews strike an early rhythm slinging cargo ashore for waiting wagons",
        "time:late-morning": "Clerks shout tallies as dock gangs rotate around the crowded berth",
        "time:afternoon": "Sun-warmed crews heave cargo toward wagon queues without breaking cadence",
        "time:late-afternoon": "Harbormasters push for one more turnover before the sunset tide",
        "time:evening": "Dusk paints the cranes as teams race to finish loads before curfew bells",
        default: "Dock crews keep cargo moving between ship holds and counting tables",
      },
      fragments,
    );
    const goodsBase = chooseOverviewFragment(
      {
        "event:harvest_condition": "Harvest wagons queue beside grain sacks stamped for inland caravans",
        "event:harvest_rush": "Harvest wagons queue beside grain sacks stamped for inland caravans",
        "event:storm_backlog": "Cargo lashed beneath heavy tarps waits for calmer seas and open berths",
        "event:storm_response": "Extra lashings bind each pallet while crews brace against the gale",
        "weather:rain": "Crates crouch beneath dripping tarpaulins while chalk tallies smear",
        "weather:fog": "Shadowed cargo towers over the quay, lantern-light tracing their outlines",
        "weather:snow": "Canvas-wrapped loads glisten with sleet along the pier edge",
        "season:spring": "Fresh-painted crates from inland markets lend the quay a blossom of color",
        "season:summer": "Citrus casks and tar-slick coils steep the air in heavy summer scents",
        "season:autumn": "Ocher harvest seals mark bales bound for distant storehouses",
        "season:winter": "Frost-stiff ropes bind salted stores awaiting hardy wagon teams",
        default: "Orderly stacks of cargo crowd the quay awaiting dispatch inland",
      },
      fragments,
    );
    const shiftNote = chooseOverviewFragment(
      {
        "time:predawn": "first-light tally clerks double-check manifests before the bells change",
        "time:morning": "fresh crews rotate in to keep the berths turning without pause",
        "time:late-morning": "midday relief crews brace for the tide swing",
        "time:afternoon": "sun-high teams pace themselves for the long haul to dusk",
        "time:late-afternoon": "tide captains push for one last turnover before sunset",
        "time:evening": "lantern orders stand ready as dusk creeps over the rigging",
        "time:night": "watch captains demand steady counts despite the hour",
        default: "shift leads shout schedules to keep the berths on time",
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:storm_backlog": "Signal bells clang while harbor cutters jockey for a safe approach",
        "event:storm_response": "Harbor pilots pace the quay, eyes on rollers crashing against moored hulls",
        "event:night_shift": "Harborwatch patrol boats idle nearby while lanterns sweep the water",
        "event:surge": "Merrow Syndicate clerks wave more wagons into place, warning crews not to stall",
        "weather:fog": "Horn calls echo as pilots trade signals with anchored luggers",
        "weather:rain": "Berth clerks hunch beneath awnings while boatmen adjust rain-swollen lines",
        "season:autumn": "Merchant syndicate flags ripple beside barges stacked with late-season grain",
        default: "A merchant frigate under charter takes on loaders while harbor pilots pace the quay",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      joinOverviewParts(goodsBase, shiftNote),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },
  shipyard: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "event:storm_response": "duck under tarped scaffolds as storm gusts rattle half-rigged masts",
        "weather:rain": "step around runnels of rainwater spilling down the slipway planks",
        "weather:fog": "follow the rasp of saws through fog-slick timbers toward the drydock",
        "weather:snow": "brush sleet from your shoulders while braziers glow against the chill",
        "weather:clear": "walk along sunlit planks while wood chips sparkle in the air",
        default: "step between stacked timbers and tar kettles lining the shipyard slip",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:storm_backlog": "Repair crews swarm storm-battered hulls, shouting measurements over the din",
        "event:night_shift": "Lantern-bearing riggers lash ratlines while caulkers tamp seams by feel",
        "time:predawn": "Shipwrights chalk lines along keels before the first whistle of the day",
        "time:night": "Night crews rivet patch plates while braziers keep the pitch pliant",
        "time:morning": "Shipwright crews plane keel planks while riggers shout for fresh bolts",
        "time:afternoon": "Sunlit scaffolds host carpenters fitting ribs into place",
        "time:late-afternoon": "Supervisors press crews to button seams before tides reclaim the slip",
        default: "Shipwright gangs coordinate sawyers, riveters, and riggers along the cradle",
      },
      fragments,
    );
    const stock = chooseOverviewFragment(
      {
        "event:storm_backlog": "Cradles brim with hulls awaiting inspection and replacement spars",
        "season:spring": "Fresh-cut timber stacks perfume the air with sap and sawdust",
        "season:summer": "Pitch kettles simmer beside neatly ranked planking bundles",
        "season:autumn": "Tarred canvas and rope coils await convoy hulls bound for autumn seas",
        "season:winter": "Frost dulls the sheen on copper sheathing stacked for winter refits",
        default: () => {
          const good = fragments.sampleGood || 'seasoned planks and tar barrels';
          return `Staging racks brim with ${good}`;
        },
      },
      fragments,
    );
    const focus = chooseOverviewFragment(
      {
        "event:storm_backlog": "A damaged brigantine tilts in its cradle while inspectors tally repairs",
        "event:night_shift": "Night foremen pace the slip, lanterns reflecting off half-finished hulls",
        "weather:fog": "Signal horns trade low notes with pilots waiting beyond the breakwater",
        default: "A half-framed hull towers above the slip while caulkers tamp oakum into the seams",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(stock),
      sentenceFromSlug(focus),
    ].filter(Boolean);
  },
  warehouse: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "slip beneath overhangs dripping steady sheets beside the loading doors",
        "weather:fog": "trace tally chalk marks through gray haze filling the warehouse lanes",
        "weather:snow": "stamp slush from your boots before stepping onto the counting floor",
        default: "step aside as wagon tongues line the counting house and loading bays",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:storm_backlog": "Porters hustle backlog pallets into rows while clerks demand fresh tallies",
        "event:harvest_condition": "Additional crews swing grain sacks onto scales for rapid certification",
        "time:predawn": "Skeleton crews sort manifests so dawn wagons can be loaded without delay",
        "time:night": "Lantern-lit porters guide handcarts between towering racks before the night tide arrives",
        "time:morning": "Porters shove handcarts between tall rack aisles while clerks chase signatures",
        "time:afternoon": "Sunlight stripes the floor as teams relay crates toward outbound wagons",
        default: "Porters and tally clerks weave around pallet stacks keeping goods accounted for",
      },
      fragments,
    );
    const goods = chooseOverviewFragment(
      {
        "event:harvest_condition": "Granaries of grain and dried goods dominate the main aisle",
        "season:spring": "Bales stamped with blossom crests wait beside jars of preserved herbs",
        "season:summer": "Salted barrels and citrus crates keep the air sharp with spice",
        "season:autumn": "Harvest-marked bins overflow with bundled textiles and grain sacks",
        "season:winter": "Crated coal and woolens pile high for cold-season caravans",
        default: () => {
          const good = fragments.sampleGood || 'crates and barrels ready for dispatch';
          return `Rows of ${good} line the reinforced shelving`;
        },
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:inspection": "Auditors stand over ledger desks comparing seals before releasing shipments",
        "event:night_shift": "Night foremen watch from the mezzanine, lanterns bobbing over the aisles",
        default: "Ledger clerks shout quotas from the mezzanine while overseers track outgoing loads",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(goods),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  workshop_hot: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "event:storm_response": fragments.flags.isGlass
          ? "shield your face from gusts that drive furnace heat across the glasshouse floor"
          : "brace against gusts that whip sparks beneath the forge awning",
        "weather:rain": fragments.flags.isGlass
          ? "wipe rain from your brow as furnace light spills across the slick floor"
          : "shake off rain as you duck beneath the forge awnings and coal smoke",
        "weather:fog": fragments.flags.isGlass
          ? "follow the glow of the glory holes through damp morning haze"
          : "navigate by the ring of hammers through fog-thickened courtyards",
        "weather:snow": fragments.flags.isGlass
          ? "stamp sleet from your boots while annealing ovens radiate welcome heat"
          : "stamp sleet from your boots as furnace heat billows out to meet you",
        default: fragments.flags.isGlass
          ? "step into shimmering heat where molten glass paints the rafters in gold"
          : "step beneath soot-dark awnings as hammer heat rolls out to meet you",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:night_shift": fragments.flags.isGlass
          ? "Night gaffers rotate through the glory holes while annealers guard the kilns"
          : "Lantern-lit smiths temper steel while quenching troughs hiss in the dark",
        "event:surge": fragments.flags.isGlass
          ? "Extra blowers twirl glowing gathers to keep pace with rush orders"
          : "Additional hammer teams trade ringing blows to fill backlog commissions",
        "time:morning": fragments.flags.isGlass
          ? "Glassblowers twirl glowing gathers while cutters call out timings"
          : "Hammer teams trade rhythmic blows as apprentices rush billets between the anvils",
        "time:afternoon": fragments.flags.isGlass
          ? "Polishers coax shimmer from cooling pieces while the kilns roar on"
          : "Sunlit anvils flash as smiths stretch and fold metal in steady cadence",
        default: fragments.flags.isGlass
          ? "Glassworkers coordinate gathers, molds, and annealing racks with practiced ease"
          : "Forge crews coordinate bellows, hammers, and quench baths to keep orders moving",
      },
      fragments,
    );
    const goods = chooseOverviewFragment(
      {
        "season:winter": fragments.flags.isGlass
          ? "Frost traces the panes stacked to cool beside the annealing ovens"
          : "Freshly forged hearth-irons and plowshares steam in the cold air",
        "season:summer": fragments.flags.isGlass
          ? "Sunlight refracts through shelves of sea-green glassware"
          : "Racks of tempered blades gleam beneath the open shutters",
        default: () => {
          const good = fragments.sampleGood || (fragments.flags.isGlass ? 'cooling glassware' : 'freshly forged work');
          return `Racks of ${good} line the staging tables`;
        },
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:inspection": fragments.flags.isGlass
          ? "Guild inspectors hold finished pieces to the light, seeking waves or trapped ash"
          : "Quartermasters weigh each forging, ensuring guild marks match the order",
        default: fragments.flags.isGlass
          ? "A master gaffer spins a final gather while apprentices stand ready with molds"
          : "The master smith checks the temper of a blade, nodding for the quench",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(goods),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  workshop_craft: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": fragments.flags.isTannery
          ? "pick your way past runoff sluicing from covered vats"
          : fragments.flags.isRope
            ? "step through the long shed while rain drums on stretched fibers"
            : "duck beneath dripping eaves crowded with drying work",
        "weather:snow": fragments.flags.isBrew
          ? "let malt steam chase the cold as you enter the brewhouse"
          : "stamp sleet from your boots while warm workroom air rolls out",
        default: fragments.flags.isTannery
          ? "skirt pungent vats where hides soak under stretched awnings"
          : fragments.flags.isRope
            ? "walk the long shed where fibers twist beneath steady tension"
            : fragments.flags.isBrew
              ? "breathe in malt steam curling from copper kettles"
              : fragments.flags.isBakery
                ? "let the scent of fresh bread and sugar wash over you from glowing ovens"
                : fragments.flags.isTailor
                  ? "step between bolt-draped tables while dyed cloth sways from rafters"
                  : fragments.flags.isCarpenter
                    ? "pass stacks of planed boards and sawdust-sprinkled benches"
                    : "step into a workshop lined with tools, molds, and workbenches",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:surge": "Journeymen double their pace to fill rush orders while apprentices fetch supplies",
        "time:predawn": fragments.flags.isBakery
          ? "Bakers knead dough under lantern light to have loaves ready by dawn"
          : "Early crews prep materials so daylight shifts can start without delay",
        "time:night": fragments.flags.isBrew
          ? "Night brewers tend slow boils while cellarmen rotate the casks"
          : "Late crews finish detailing work while supervisors close ledgers for the day",
        default: fragments.flags.isTailor
          ? "Tailors measure, cut, and stitch while runners ferry orders between tables"
          : fragments.flags.isTannery
            ? "Hide-scrapers and stretchers trade places to keep curing on schedule"
            : fragments.flags.isRope
              ? "Twisters pace the ropewalk while splicers bind lengths for shipment"
              : fragments.flags.isBakery
                ? "Bakers pull golden loaves while clerks package sweet rolls for waiting patrons"
                : fragments.flags.isBrew
                  ? "Brewers stir kettles and monitor cooling tubs as coopers ready fresh barrels"
                  : "Journeymen lean over benches, tools flashing while foremen review each stage of work",
      },
      fragments,
    );
    const goods = chooseOverviewFragment(
      {
        "season:spring": fragments.flags.isTailor
          ? "Pastel fabrics and floral trims drape along display forms"
          : fragments.flags.isBrew
            ? "Casks of fresh spring ales line the cellar doors"
            : null,
        "season:autumn": fragments.flags.isBakery
          ? "Spiced pastries and seed loaves cool beside the ovens"
          : fragments.flags.isTailor
            ? "Woolen cloaks and lined coats await the chill winds"
            : null,
        default: () => {
          const good = fragments.sampleGood || 'finished goods';
          return `Shelves of ${good} await inspection along the wall`;
        },
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:inspection": "Guild assessors check each piece against pattern cards before approving the lot",
        default: fragments.flags.isTailor
          ? "A master tailor checks drape and fit on a mannequin while assistants adjust hems"
          : fragments.flags.isBrew
            ? "The brewmaster samples a ladle from the kettle, nodding for the chill to begin"
            : fragments.flags.isBakery
              ? "The head baker scores a final loaf before sliding it into the brick oven"
              : "The workshop steward circles the floor, offering quick corrections before shipments depart",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      goods ? sentenceFromSlug(goods) : '',
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  market: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "weave beneath canvas awnings beating with rainwater",
        "weather:fog": "follow bell calls through fog-wrapped stalls",
        "weather:snow": "sidestep slush as vendors brush snow from awning ropes",
        default: "thread through vendor stalls where voices and scents collide in the narrow aisles",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:festival": "Performers and hawkers amplify the din as festival crowds flood the square",
        "event:festival_buzz": "Spring revelers compare new wares while musicians tune for the afternoon show",
        "time:predawn": "Fishmongers and bakers finish arranging displays before the first customers arrive",
        "time:night": "Lantern-lit vendors offer late deals while watch patrols keep the peace",
        "time:morning": "Traders haggle over fresh deliveries while porters shuttle crates between stalls",
        "time:afternoon": "The market hums as patrons compare prices under the height of the sun",
        default: "Merchants bargain loudly while runners dash between stalls and counting tables",
      },
      fragments,
    );
    const goods = chooseOverviewFragment(
      {
        "season:spring": "Bundles of herbs and blossom-marked crates lend bright color to the stalls",
        "season:summer": "Stacks of citrus, spices, and chilled drinks fight the heavy heat",
        "season:autumn": "Harvest bales and barrels of preserved fruits crowd the cobbles",
        "season:winter": "Braziers warm buyers inspecting woolens and preserved stores",
        default: () => {
          const good = fragments.sampleGood || 'wares from across the coast';
          return `Stalls overflow with ${good}`;
        },
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:inspection": "City weighmasters circulate with stamped scales, checking tariffs at random",
        "event:festival": "A herald announces festival contests while children chase streamers through the square",
        default: "A guild factor posts new tariffs beside a tally board while patrons crowd for a look",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(goods),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  temple: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "slip beneath rain-darkened eaves as incense curls into the damp air",
        "weather:fog": "let muted bell tones guide you through the fog toward the sanctuary",
        "weather:snow": "shake frost from your cloak as warm lamplight spills from the nave",
        default: "lower your voice as incense and candlelight meet you at the temple threshold",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:pilgrimage": "Pilgrims circle the central altar while acolytes steady the flow of offerings",
        "time:predawn": "Monks recite dawn chants that echo softly beneath the arches",
        "time:night": "Evening supplicants light vigil candles while the choir hums low hymns",
        default: "Acolytes move between altars with measured steps, guiding supplicants through their devotions",
      },
      fragments,
    );
    const offerings = chooseOverviewFragment(
      {
        "season:spring": "Offerings of blossom garlands and fresh water gleam beside the shrine",
        "season:summer": "Bowls of citrus, incense, and cooling oils sit ready for weary travelers",
        "season:autumn": "Harvest loaves and polished gourds rest among candles on the altar",
        "season:winter": "Lanterns ring offerings of spiced wine and thick cloaks for the needy",
        default: "Offering tables glitter with coin, candles, and carefully arranged tributes",
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:festival": "The high cantor leads a procession through incense haze toward the outer plaza",
        default: "The high priest confers with supplicants near the central basin, voice calm amid the hush",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(offerings),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  guild: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "step past dripping cloaks hung beside the guildhall vestibule",
        "weather:snow": "stamp off snow before entering the ledger hall warmed by coal braziers",
        default: "slip past bronze doors into a hall alive with murmured negotiations and shuffled ledgers",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:inspection": "Auditors quiz clerks over seal books while messengers dash between offices",
        "event:surge": "Charter agents juggle applicants while scribes stack forms for expedited approvals",
        "time:predawn": "Night staff collate manifests for the day shift to sign and seal",
        "time:night": "A skeleton crew monitors message tubes while wardens secure the archives",
        default: "Clerks and factors debate quotas over sprawling tables while messengers rush dispatches to every corner",
      },
      fragments,
    );
    const goods = chooseOverviewFragment(
      {
        default: () => {
          const label = context.businessProfile?.scale?.label;
          return label
            ? `Guild charts outlining ${label.toLowerCase()} dominate the briefing wall`
            : 'Guild charts and shipping routes cover the briefing wall';
        },
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:night_shift": "Lantern-bearing stewards review sealed postings before locking the cases for the night",
        default: "A senior steward confers with petitioners beside the assignment dais, stamping new orders as they arrive",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(goods),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  archive: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "ease the heavy door closed to keep damp air from the stacks",
        "weather:fog": "wipe condensation from your cloak before descending into the quiet aisles",
        default: "ease the door shut behind you so the hush of the stacks remains unbroken",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "time:predawn": "Night scribes finish indexing ledgers before sunrise clerks arrive",
        "time:night": "Lamplight pools around lone researchers flipping through guarded tomes",
        default: "Scribes shuffle folios and guide researchers whispering requests at the reference desk",
      },
      fragments,
    );
    const shelves = chooseOverviewFragment(
      {
        default: 'Shelves of vellum codices and rune-marked scroll tubes stretch into the dim',
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:inspection": "Archivists supervise a record audit, matching seals before scrolls return to storage",
        default: "The chief archivist notes each visitor in a ledger before unlocking a reading alcove",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(shelves),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  academy: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "follow echoing recitations through halls scented with damp chalk",
        "weather:snow": "shake snow from your boots in corridors warmed by rune-lit braziers",
        default: "step into vaulted halls where lecture voices mingle with the scratch of quills",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "time:predawn": "Sleepless apprentices review notes before the bell summons instructors",
        "time:night": "Late study circles debate theory under floating lanterns in the library wing",
        default: "Instructors trade notes while students hurry between lessons clutching slates and satchels",
      },
      fragments,
    );
    const halls = chooseOverviewFragment(
      {
        default: 'Lecture boards drip with fresh chalk diagrams beside tables cluttered with apparatus',
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:festival": "Demonstration circles ready elaborate displays for the next symposium night",
        default: "A dean pauses to quiz a cohort on doctrine before dismissing them to practicum labs",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(halls),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  garrison: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "avoid muddy divots kicked up along the drill yard",
        "weather:snow": "stamp slush from your boots as braziers flare beside the muster line",
        default: "step aside as squads march past the gate toward the drill yard",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:drill": "Sergeants bark cadence as formations pivot across the packed earth yard",
        "event:night_shift": "Night sentries swap posts while patrol lieutenants check kit for the graveyard shift",
        "time:predawn": "Bleary recruits jog laps to warm up before the bell",
        "time:night": "Lantern patrols form ranks while watch captains assign routes",
        default: "Guard squads drill weapon forms while quartermasters oversee armor fittings",
      },
      fragments,
    );
    const stores = chooseOverviewFragment(
      {
        "season:winter": "Wool cloaks and braziers stand ready beside the watch posts",
        default: 'Racks of spears, shields, and practice blades line the inner wall awaiting inspection',
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:patrol": "Watch captains pore over patrol maps before dispatching the next rotation",
        default: "The commandant reviews duty rosters at a trestle table while scribes tally the day's drills",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(stores),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  inn: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "shake the rain from your cloak as hearth-warmth spills from the doorway",
        "weather:snow": "let the scent of mulled cider thaw the chill as you step inside",
        default: "step into a hearth-bright common room buzzing with conversation and clinking cups",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "time:predawn": "Kitchen staff prep breakfasts while the last night-watch patrons doze over mugs",
        "time:night": "Minstrels strike up lively tunes while servers weave between late-night revelers",
        default: "Servers carry laden trays between packed tables as travelers trade stories by the hearth",
      },
      fragments,
    );
    const fare = chooseOverviewFragment(
      {
        "season:spring": "Plates of fresh greens and citrus glisten beside loaves still steaming",
        "season:autumn": "Hearty stews and roasted roots perfume the air from the kitchen pass",
        "season:winter": "Mugs of spiced cider and thick stews keep patrons lingering near the fire",
        default: () => {
          const good = fragments.sampleGood || 'hearty fare';
          return `Platters of ${good} await any table with spare seating`;
        },
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        "event:festival": "Travelers pin festival ribbons above the mantle while laughter fills the rafters",
        default: "The innkeep makes the rounds with a practiced smile, checking tabs and swapping quick gossip",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(fare),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  mill: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "follow the vibration of the millstones while rain drums on the wheelhouse roof",
        "weather:snow": "watch your footing on frost-slick stones as the wheel churns icy water",
        default: "approach the grinding hall where the wheel's steady rumble fills the air",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:harvest_rush": "Millhands race to clear full bins while drovers queue with laden carts",
        "time:predawn": "Early crews prime the stones so farmers can unload at first light",
        "time:night": "Lantern-lit grinders finish the last sacks before shutters close",
        default: "Millhands keep sacks moving while the miller monitors grind and sifts flour for impurities",
      },
      fragments,
    );
    const grain = chooseOverviewFragment(
      {
        "season:spring": "Fresh barley and rye fill the intake bins for the new planting contracts",
        "season:autumn": "Harvest wagons overflow with grain waiting their turn at the stones",
        default: () => {
          const good = fragments.sampleGood || 'grain ready for the stones';
          return `Bins overflow with ${good}`;
        },
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        default: "The waterwheel beats a steady rhythm while the miller checks flour texture by feel",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(grain),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  farm: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "scan muddy cart ruts between sodden rows for anyone flagging you down",
        "weather:fog": "look along the damp lanes while distant bells mark time over the fields",
        "weather:snow": "search across frost-hardened furrows for crews still working",
        default: "look over furrows lined with low stone walls for the field reeve or spare hands",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:harvest_rush": "Farmhands hustle full baskets toward wagons while overseers tally yields",
        "time:predawn": "Lanterns bob between rows as crews set up for the day's labor",
        "time:night": "Late crews stack covered crates while the last daylight fades over the fields",
        default: "Workers tend rows, drive teams, and maintain irrigation ditches to keep the crop steady",
      },
      fragments,
    );
    const produce = chooseOverviewFragment(
      {
        "season:spring": "Bud-laden branches and seedbeds promise a strong early crop",
        "season:summer": "Irrigation ditches glint beside lush rows heavy with growth",
        "season:autumn": "Wagons brim with harvested grain and root bundles",
        "season:winter": "Root cellars stand stacked with preserved stores while fields lie fallow",
        default: () => {
          const good = fragments.sampleGood || "produce ready for the day's dispatch";
          return `Stacked crates of ${good} wait beside the packing shed`;
        },
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        default: "The field reeve checks tallies at a ledger table while beasts stamp in the shade",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(produce),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  service: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "let warm, perfumed air chase the chill as you step through the threshold",
        "weather:snow": "leave dripping cloaks at the rack while attendants hurry forward with towels",
        default: "step into a refined hall where murmured conversation blends with soft music and steam",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:festival": "Entertainers run through cues while hosts ready the evening's special program",
        "time:predawn": "Attendants polish fixtures and prepare amenities before clientele arrive",
        "time:night": "Late patrons relax while staff circulate with refreshments and news",
        default: "Attendants glide between patrons, offering refreshments and guiding newcomers to their appointments",
      },
      fragments,
    );
    const amenities = chooseOverviewFragment(
      {
        default: 'Trays of scented oils, clean linens, and carefully prepared comforts stand ready along the wall',
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        default: "The house steward maintains a serene smile as they schedule services and settle accounts",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(amenities),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },

  default: (context, fragments) => {
    const entryAction = chooseOverviewFragment(
      {
        "weather:rain": "take in the tang of wet stone and damp wood around the busy entry",
        "weather:fog": "feel your way toward the worklights glowing through the mist",
        "weather:snow": "stamp cold from your feet before joining the bustle inside",
        default: "approach a busy worksite humming with purposeful motion",
      },
      fragments,
    );
    const bustle = chooseOverviewFragment(
      {
        "event:surge": "Crews push for overtime output while overseers call for constant checks",
        "event:night_shift": "Night crews keep essential lines moving while lanterns sway overhead",
        default: "Crews coordinate tools, materials, and ledgers to keep operations on schedule",
      },
      fragments,
    );
    const stock = chooseOverviewFragment(
      {
        default: 'Supplies and partially finished work line the walls awaiting their turn',
      },
      fragments,
    );
    const feature = chooseOverviewFragment(
      {
        default: "The steward moves between teams, solving problems before they can slow the day",
      },
      fragments,
    );
    return [
      entryAction ? sentenceFromSlug(`You ${entryAction}`) : '',
      sentenceFromSlug(bustle),
      sentenceFromSlug(stock),
      sentenceFromSlug(feature),
    ].filter(Boolean);
  },
};

function composeBuildingOverview(context) {
  const buildingName = context.building?.name || context.buildingName;
  if (!buildingName) return '';
  const typeKey = buildingTypeKey(buildingName, context.businessProfile);
  const weatherKey = normalizeWeatherKey(context.weather);
  const seasonKey = normalizeSeasonKey(context.season);
  const timeKey = normalizeTimeKey(context.timeLabel);
  const events = gatherBuildingOverviewEvents(context, typeKey, weatherKey, seasonKey, timeKey);
  const rng = context.rng ?? Math.random;
  const fragments = {
    weatherKey,
    seasonKey,
    timeKey,
    events,
    rng,
    businessProfile: context.businessProfile,
    sampleGood: sampleProductionGood(context.businessProfile, rng),
    flags: gatherBuildingOverviewFlags((buildingName || '').toLowerCase()),
  };
  const blueprint = BUILDING_OVERVIEW_BLUEPRINTS[typeKey] || BUILDING_OVERVIEW_BLUEPRINTS.default;
  const sentences = blueprint(context, fragments);
  return sentences.filter(Boolean).join(' ');
}

function merchantsWharfSeasonKey(season) {
  return normalizeSeasonKey(season);
}

function merchantsWharfTimeKey(timeLabel) {
  return normalizeTimeKey(timeLabel);
}

function merchantsWharfScaleWeight(scale, workers) {
  if (!Number.isFinite(workers)) return 1;
  if (scale === 'minor') {
    if (workers <= 8) return 1.4;
    if (workers >= 48) return 0.75;
    return 1;
  }
  if (scale === 'moderate') {
    if (workers >= 32) return 1.25;
    if (workers <= 12) return 0.85;
    return 1;
  }
  if (scale === 'major') {
    if (workers >= 36) return 1.3;
    if (workers <= 20) return 0.7;
    return 1;
  }
  return 1;
}

function merchantsWharfActiveEvents(state) {
  const events = new Set();
  const condition = (state.weather?.condition || '').toLowerCase();
  if (/storm|squall|gale/.test(condition)) {
    events.add('storm_backlog');
  }
  if (/rain|drizzle|spray/.test(condition)) {
    events.add('slick_planks');
  }
  const seasonKey = merchantsWharfSeasonKey(state.season);
  if (seasonKey === 'summer' || seasonKey === 'autumn') {
    events.add('harvest_surge');
  }
  const timeLower = (state.timeLabel || '').toLowerCase();
  if (timeLower.includes('night') || timeLower.includes('evening')) {
    events.add('night_shift');
  }
  (state.businessProfile?.laborConditions || []).forEach(entry => {
    const trigger = (entry?.trigger || '').toLowerCase();
    if (trigger.includes('storm') && events.has('storm_backlog')) {
      events.add('condition_storm_backlog');
    }
    if (trigger.includes('harvest') && events.has('harvest_surge')) {
      events.add('condition_harvest_convoy');
    }
  });
  return Array.from(events);
}

function merchantsWharfOpportunityFactors(state) {
  return {
    timeKey: merchantsWharfTimeKey(state.timeLabel),
    seasonKey: merchantsWharfSeasonKey(state.season),
    events: merchantsWharfActiveEvents(state),
    weatherCondition: (state.weather?.condition || '').toLowerCase(),
    timeLabel: state.timeLabel,
  };
}

function merchantsWharfPick(list, rng) {
  if (!Array.isArray(list) || list.length === 0) return '';
  const roll = (rng ?? Math.random)();
  const index = Math.floor(roll * list.length);
  return list[index] ?? list[0];
}

function merchantsWharfRandomInt(rng, min, max) {
  if (min > max) return min;
  const roll = (rng ?? Math.random)();
  const range = max - min + 1;
  return min + Math.floor(roll * range);
}

function formatMerchantsWharfReward(cpValue, bonus) {
  const total = Math.max(0, Math.round(cpValue));
  const sp = Math.floor(total / 100);
  const remainder = total % 100;
  const parts = [];
  if (sp) parts.push(`${sp} sp`);
  if (remainder || !parts.length) parts.push(`${remainder} cp`);
  let reward = parts.join(' ');
  if (bonus) reward += ` plus ${bonus}`;
  return reward;
}

function applyMerchantsWharfDynamicBoard(quest) {
  if (!currentCharacter) return;
  const city = currentCharacter.location;
  const loc = LOCATIONS[city];
  if (!loc) return;
  if (!loc.questBoards) loc.questBoards = {};
  if (quest) {
    loc.questBoards[MERCHANTS_WHARF_DYNAMIC_BOARD] = [quest];
  } else {
    delete loc.questBoards[MERCHANTS_WHARF_DYNAMIC_BOARD];
  }
  const allQuests = Object.values(loc.questBoards).reduce((acc, quests) => acc.concat(quests), []);
  loc.quests = allQuests;
}

const MERCHANTS_WHARF_OPPORTUNITIES = [
  {
    key: 'hookfin-catch',
    scale: 'minor',
    baseWeight: 1.6,
    station: 'commoner',
    personaRole: 'Hookfin Net Captain',
    personaStyle: 'gruff',
    timeWeights: {
      predawn: 1.6,
      morning: 1.3,
      'late-morning': 1.2,
      afternoon: 1.1,
      evening: 0.85,
      night: 0.55,
    },
    seasonWeights: { spring: 1.05, summer: 1.1, autumn: 1.0, winter: 0.85 },
    eventWeights: { storm_backlog: 1.1, harvest_surge: 0.9 },
    createQuest: ({ persona, factors, rng }) => {
      const tideMap = {
        predawn: 'pre-dawn tide',
        morning: 'morning tide',
        'late-morning': 'late morning tide',
        afternoon: 'afternoon tide',
        'late-afternoon': 'sunset tide',
        evening: 'evening tide',
        night: 'lantern-lit tide',
        day: 'day tide',
      };
      const tidePhrase = tideMap[factors.timeKey] || 'current tide';
      const eventDetail = factors.events.includes('storm_backlog')
        ? 'Storm-delayed boats disgorged twice their usual catch, and crates already crowd the planks.'
        : factors.events.includes('harvest_surge')
          ? 'Harvest barges arrived heavy with preserved fishmeal that must move inland before the sun bakes it.'
          : "Tonight's nets bulged with silvered fish, overflowing the Hookfin skiff.";
      const reward = merchantsWharfRandomInt(rng, 120, 210);
      const timeline =
        factors.timeKey === 'predawn'
          ? 'Pre-dawn tide rotation (~3 hours)'
          : factors.timeKey === 'night'
            ? 'Lantern-lit tide rotation (~3 hours)'
            : 'Single tide rotation (~3 hours)';
      const laborCondition = factors.events.includes('storm_backlog')
        ? 'Storm-delayed flotillas'
        : factors.events.includes('harvest_surge')
          ? 'Harvest convoy surge'
          : null;
      return {
        title: merchantsWharfPick(
          ['Hookfin Dawn Offload', "Netters' Overflow Haul", 'Skiff Catch Sling Team'],
          rng,
        ),
        description: `${eventDetail} ${persona.name} needs extra arms to move the gleaming catch from the Hookfin skiff to waiting wagons before the ${tidePhrase} turns.`,
        location: "Merchants' Wharf",
        requirements: [
          'Athletics 16+ or Strength 14+ to haul baskets without slowing.',
          "Guild Rank: Dockhand Crew Laborer or Adventurers' Guild Cold Iron.",
        ],
        conditions: [
          `Work the ${tidePhrase} moving baskets from skiff to market wagons in one sweep.`,
          "Keep tally slates dry and follow the net captain's cadence.",
        ],
        timeline,
        risks: [
          'Slippery planks and swinging basket loads.',
          'Spoilage fines if crates warm before reaching market.',
        ],
        reward: formatMerchantsWharfReward(reward, 'dock kitchen meal chit'),
        notes: `Find ${persona.name} by the Hookfin skiff when the ${tidePhrase} begins.`,
        issuer: `${persona.name}, Hookfin Net Captain`,
        postingStyle: 'Pier Contract Offer',
        laborCondition,
        repeatable: true,
      };
    },
    createNarrative: ({ persona, factors }) => {
      if (factors.events.includes('storm_backlog')) {
        return `Spray-lashed planks tremble beneath your boots as ${persona.name} waves you toward a skiff piled high with storm-delayed catch.`;
      }
      if (factors.timeKey === 'predawn' || factors.timeKey === 'night') {
        return `Lanternlight flickers across the tide when ${persona.name} from the Hookfin crew beckons you toward their overloaded skiff.`;
      }
      return `You shadow the rush of dockhands until ${persona.name} whistles for help beside a skiff stacked with fresh catch.`;
    },
    createQuote: ({ persona, factors }) => {
      const tideMap = {
        predawn: 'before dawn bells ring',
        night: 'before the lantern tide turns',
        morning: 'before the morning tide shifts',
        'late-morning': 'before the noon bell',
        afternoon: 'before the afternoon tide swings back out',
        'late-afternoon': 'before sunset crowds the pier',
        evening: 'before curfew bells sound',
      };
      const deadline = tideMap[factors.timeKey] || 'before this tide turns';
      return `Grab a sling and keep pace—we need this catch cleared ${deadline}.`;
    },
  },
  {
    key: 'wagon-push',
    scale: 'moderate',
    baseWeight: 1.1,
    station: 'guild',
    personaRole: 'Merrow Berth Clerk',
    personaStyle: 'dry',
    timeWeights: {
      predawn: 0.6,
      morning: 1.1,
      'late-morning': 1.25,
      afternoon: 1.35,
      'late-afternoon': 1.4,
      evening: 1.15,
      night: 0.7,
    },
    seasonWeights: { spring: 1, summer: 1.1, autumn: 1.25, winter: 0.9 },
    eventWeights: { harvest_surge: 1.4, storm_backlog: 1.15 },
    createQuest: ({ persona, factors, rng }) => {
      const queueNote = factors.events.includes('harvest_surge')
        ? 'Harvest convoy wagons clog the quay, demanding a relentless load-out.'
        : factors.events.includes('storm_backlog')
          ? 'Storm-stacked manifests overflow the berth office and the wagons must roll before tides shift again.'
          : 'Overflow consignments from inland markets are stacking higher than the scheduled crews can clear.';
      const reward = merchantsWharfRandomInt(rng, 360, 520);
      const timeline = factors.timeKey === 'evening' || factors.timeKey === 'late-afternoon'
        ? 'Extended dusk rotation (~8 hours)'
        : 'Full daylight shift (~8 hours)';
      const laborCondition = factors.events.includes('harvest_surge')
        ? 'Harvest convoy surge'
        : factors.events.includes('storm_backlog')
          ? 'Storm-delayed flotillas'
          : null;
      return {
        title: merchantsWharfPick(
          ['Grain Wagon Surge Crew', 'Berth Overflow Sling Team', 'Merrow Wagon Dispatch'],
          rng,
        ),
        description: `${queueNote} ${persona.name} needs disciplined hands to keep crane slings feeding inland wagons without pause.`,
        location: "Merchants' Wharf",
        requirements: [
          'Athletics 18+ or Vehicles (Land) proficiency 16+ to keep the queue moving.',
          "Guild Rank: Dockhand Crew Laborer or Adventurers' Guild Bronze.",
        ],
        conditions: [
          'Cycle cargo from hold to wagon until the manifest queue is cleared.',
          'Record each wagon seal with the berth clerk before it rolls inland.',
        ],
        timeline,
        risks: [
          'Runaway pallets or strained backs from relentless hauling.',
          'Dock fines if manifests go missing or wagons depart late.',
        ],
        reward: formatMerchantsWharfReward(reward, 'wagon priority chit for inland dispatch'),
        notes: `Check in with ${persona.name} at the berth office counter before taking a sling team.`,
        issuer: `${persona.name}, Merrow Berth Clerk`,
        postingStyle: 'Pier Contract Offer',
        laborCondition,
        repeatable: true,
      };
    },
    createNarrative: ({ persona, factors }) => {
      if (factors.events.includes('harvest_surge')) {
        return `${persona.name} slaps a stack of grain tallies against their palm, gesturing at wagon teams that stretch far past the pier gates.`;
      }
      return `Manifest cards fan between ${persona.name}'s fingers as they flag you toward a row of waiting wagons.`;
    },
    createQuote: ({ persona, factors }) => {
      const urgency = factors.events.includes('harvest_surge')
        ? 'These farmers have no patience—keep the convoy rolling.'
        : 'Queues are backing into the district—keep the cranes cycling and the wagons rolling.';
      return `${urgency}`;
    },
  },
  {
    key: 'frigate-offload',
    scale: 'major',
    baseWeight: 0.65,
    station: 'guild',
    personaRole: 'Syndicate Logistics Factor',
    personaStyle: 'dry',
    timeWeights: {
      predawn: 0.8,
      morning: 0.95,
      'late-morning': 1.05,
      afternoon: 1.2,
      'late-afternoon': 1.35,
      evening: 1.4,
      night: 1.25,
    },
    seasonWeights: { spring: 1, summer: 1.05, autumn: 1.15, winter: 0.9 },
    eventWeights: { storm_backlog: 1.6, harvest_surge: 1.2 },
    createQuest: ({ persona, factors, rng }) => {
      const pressure = factors.events.includes('storm_backlog')
        ? 'A Coral Keep frigate limped in behind the storm, holds packed tight with overdue cargo that must clear before the next tide closes the lane.'
        : factors.events.includes('harvest_surge')
          ? 'Harvest convoys wait offshore for berth space while a Coral Keep frigate still sits heavy with trade goods.'
          : 'The syndicate wants a Coral Keep frigate turned in record time so new charters can take the berth.';
      const reward = merchantsWharfRandomInt(rng, 1000, 1500);
      const timeline = 'Double-tide contract (~10 hours across two shifts)';
      const laborCondition = factors.events.includes('storm_backlog')
        ? 'Storm-delayed flotillas'
        : factors.events.includes('harvest_surge')
          ? 'Harvest convoy surge'
          : null;
      return {
        title: merchantsWharfPick(
          ['Coral Keep Frigate Turnaround', 'Syndicate Frigate Unload Detail', 'Frigate Double-Tide Overseer'],
          rng,
        ),
        description: `${pressure} ${persona.name} needs a steady hand to drive two full shifts of crane crews and tally clerks.`,
        location: "Merchants' Wharf",
        requirements: [
          "Leadership 20+ or Navigator's Tools proficiency 18+ to coordinate double crews.",
          "Guild Rank: Merrow Syndicate Contractor or Adventurers' Guild Silver.",
        ],
        conditions: [
          'Oversee paired crane teams unloading the frigate over two consecutive tides.',
          'File turnover reports with Harborwatch after each hold clears.',
        ],
        timeline,
        risks: [
          'Cable snaps and crowded decks during peak unload.',
          'Dockmaster penalties if tides miss their scheduled window.',
        ],
        reward: formatMerchantsWharfReward(reward, 'berth priority chit for a future charter'),
        notes: `Report to ${persona.name} in the berth office an hour before the next tide bell.`,
        issuer: `${persona.name}, Syndicate Logistics Factor`,
        postingStyle: 'Pier Contract Offer',
        laborCondition,
        repeatable: true,
      };
    },
    createNarrative: ({ persona, factors }) => {
      if (factors.events.includes('storm_backlog')) {
        return `Factor ${persona.name} strides from the berth office, coat still damp from the squall, pointing toward a frigate laden with storm-backlog cargo.`;
      }
      return `Ledger satchels thump against ${persona.name}'s hip as they outline a two-tide plan to clear the frigate at berth.`;
    },
    createQuote: ({ persona }) => {
      return 'Two tides, no excuses—keep the cranes in motion and hand me a clean turnover report.';
    },
  },
  {
    key: 'night-watch',
    scale: 'moderate',
    baseWeight: 0.9,
    station: 'military',
    personaRole: 'Harbor Guard Corporal',
    personaStyle: 'gruff',
    timeWeights: {
      predawn: 1.4,
      morning: 0.6,
      'late-morning': 0.55,
      afternoon: 0.65,
      'late-afternoon': 0.8,
      evening: 1.6,
      night: 1.9,
    },
    seasonWeights: { spring: 1, summer: 1, autumn: 1.05, winter: 1.1 },
    eventWeights: { storm_backlog: 1.2, night_shift: 2, slick_planks: 1.15 },
    createQuest: ({ persona, factors, rng }) => {
      const situation = factors.events.includes('storm_backlog')
        ? 'Storm haze and backlog crews make the night shift risky; extra eyes are needed on every crane line.'
        : factors.events.includes('slick_planks')
          ? 'Rain-slick planks and night crews risk accidents unless someone keeps watch.'
          : 'Lantern crews are stretched thin and smugglers favor this tide for slipping contraband ashore.';
      const reward = merchantsWharfRandomInt(rng, 520, 680);
      const timeline = 'Lantern-lit watch (~6 hours)';
      const laborCondition = factors.events.includes('storm_backlog')
        ? 'Storm-delayed flotillas'
        : factors.events.includes('harvest_surge')
          ? 'Harvest convoy surge'
          : null;
      return {
        title: merchantsWharfPick(
          ['Pier Lantern Vigil', 'Night Crane Oversight', 'Harborwatch Tide Patrol'],
          rng,
        ),
        description: `${situation} ${persona.name} is organizing an extra set of eyes to patrol the pier and cranes through the night tide.`,
        location: "Merchants' Wharf",
        requirements: [
          "Perception 18+ or Navigator's Tools proficiency 16+ to monitor rigging after dark.",
          "Guild Rank: Harbor Guard Corporal or Adventurers' Guild Silver.",
        ],
        conditions: [
          'Patrol the pier and crane decks through the night tide, logging incidents with Harborwatch.',
          'Coordinate with berth crews to flag unsafe rigging or contraband slips.',
        ],
        timeline,
        risks: [
          'Hidden slicks and swinging loads in low light.',
          'Guard penalties if an incident goes unreported.',
        ],
        reward: formatMerchantsWharfReward(reward, 'Harbor Guard hazard chit'),
        notes: `Check in with ${persona.name} beside the Harbor Guard brazier at shift change.`,
        issuer: `${persona.name}, Harbor Guard Corporal`,
        postingStyle: 'Pier Contract Offer',
        laborCondition,
        repeatable: true,
      };
    },
    createNarrative: ({ persona }) => {
      return `Lanterns sway in the salt breeze as Harbor Guard corporal ${persona.name} motions you closer to the watch brazier.`;
    },
    createQuote: ({ persona }) => {
      return `${persona.name.split(' ')[0] || 'Corporal'} growls, "Keep those cranes honest and file every incident before dawn."`;
    },
  },
];

function merchantsWharfOpportunityWeight(template, factors, state) {
  let weight = template.baseWeight ?? 1;
  if (template.timeWeights) {
    weight *= template.timeWeights[factors.timeKey] ?? template.timeWeights.day ?? 1;
  }
  if (template.seasonWeights && factors.seasonKey) {
    weight *= template.seasonWeights[factors.seasonKey] ?? 1;
  }
  if (template.eventWeights && Array.isArray(factors.events)) {
    factors.events.forEach(event => {
      if (template.eventWeights[event] != null) {
        weight *= template.eventWeights[event];
      }
    });
  }
  weight *= merchantsWharfScaleWeight(template.scale, state.workers);
  return Math.max(0, weight);
}

function selectMerchantsWharfOpportunity(state) {
  const factors = merchantsWharfOpportunityFactors(state);
  const weights = MERCHANTS_WHARF_OPPORTUNITIES.map(template =>
    merchantsWharfOpportunityWeight(template, factors, state),
  );
  const total = weights.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return null;
  const roll = state.random() * total;
  let cumulative = 0;
  for (let i = 0; i < MERCHANTS_WHARF_OPPORTUNITIES.length; i += 1) {
    cumulative += weights[i];
    if (roll <= cumulative) {
      return { template: MERCHANTS_WHARF_OPPORTUNITIES[i], factors };
    }
  }
  return {
    template: MERCHANTS_WHARF_OPPORTUNITIES[MERCHANTS_WHARF_OPPORTUNITIES.length - 1],
    factors,
  };
}

function generateMerchantsWharfOpportunity(state) {
  const selection = selectMerchantsWharfOpportunity(state);
  if (!selection) return null;
  const { template, factors } = selection;
  const nameDetails = generateNpcName({ station: template.station || 'guild', allowReuse: false });
  const persona = {
    name: nameDetails.fullName,
    role: template.personaRole || 'Pier Steward',
    style: template.personaStyle || 'gruff',
  };
  const quest = template.createQuest({ persona, factors, rng: state.random });
  if (!quest) return null;
  const narrative = template.createNarrative
    ? template.createNarrative({ persona, factors, rng: state.random })
    : `${persona.name} flags you down with an urgent contract along the pier.`;
  const quote = template.createQuote
    ? template.createQuote({ persona, factors, rng: state.random })
    : 'Can you take this contract before the tide turns?';
  const binding = quest.visibilityBinding ? { ...quest.visibilityBinding } : {};
  if (!binding.board) binding.board = MERCHANTS_WHARF_DYNAMIC_BOARD;
  if (!binding.business) binding.business = "Merchants' Wharf";
  if (!binding.location) binding.location = "Merchants' Wharf";
  if (!binding.district) binding.district = 'Harbor Ward';
  if (!binding.habitat) binding.habitat = 'coastal';
  if (!binding.region) binding.region = 'waves_break';
  quest.visibilityBinding = binding;
  if (!quest.location) quest.location = "Merchants' Wharf";
  if (!quest.postingStyle) quest.postingStyle = 'Pier Contract Offer';
  if (!quest.issuer) quest.issuer = `${persona.name}, ${template.personaRole}`;
  if (!quest.notes) {
    const label = factors.timeLabel ? factors.timeLabel.toLowerCase() : 'the current tide';
    quest.notes = `Meet ${persona.name} along the pier during the ${label}.`;
  }
  quest.repeatable = quest.repeatable ?? true;
  return { persona, quest, narrative, quote, factors, template };
}

function capitalizeFirst(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function workerCountDescriptor(workers) {
  if (!workers || workers <= 0) return { text: 'no crews', plural: true };
  if (workers === 1) return { text: 'a lone worker', plural: false };
  if (workers === 2) return { text: 'a pair of workers', plural: true };
  if (workers <= 4) return { text: 'a handful of workers', plural: true };
  if (workers <= 6) return { text: 'half a dozen hands', plural: true };
  if (workers <= 10) return { text: 'several crews', plural: true };
  if (workers <= 14) return { text: 'a dozen workers', plural: true };
  if (workers <= 22) return { text: 'a score of laborers', plural: true };
  if (workers <= 36) return { text: 'scores of laborers', plural: true };
  if (workers <= 60) return { text: 'dozens of crews', plural: true };
  return { text: 'a multitude of workers', plural: true };
}

function buildingLocaleDescription(buildingName) {
  const name = (buildingName || 'the site').toLowerCase();
  if (name.includes('wharf')) return 'the wharf';
  if (name.includes('pier')) return 'the pier';
  if (name.includes('dock')) return 'the docks';
  if (name.includes('quay')) return 'the quay';
  if (name.includes('yard')) return 'the yard';
  if (name.includes('forge') || name.includes('smith')) return 'the forge';
  if (name.includes('glass')) return 'the glassworks';
  if (name.includes('hall') && !name.includes('town hall')) return 'the hall';
  if (name.includes('guild')) return 'the guildhall';
  if (name.includes('temple') || name.includes('shrine')) return 'the sanctuary';
  if (name.includes('market') || name.includes('exchange')) return 'the market';
  if (name.includes('library')) return 'the stacks';
  if (name.includes('academy') || name.includes('school')) return 'the academy';
  if (name.includes('manor') || name.includes('keep')) return 'the keep';
  if (name.includes('tannery')) return 'the curing sheds';
  if (name.includes('vineyard') || name.includes('orchard')) return 'the rows';
  if (name.includes('farm')) return 'the fields';
  if (name.includes('mill')) return 'the mill floor';
  return buildingName || 'the site';
}

function buildingOperationDetail(buildingName) {
  const name = (buildingName || '').toLowerCase();
  if (name.includes('wharf') || name.includes('dock') || name.includes('pier') || name.includes('quay')) {
    return 'cargo flowing along the wharf';
  }
  if (name.includes('warehouse')) {
    return 'manifests checked and cargo sealed along the warehouse row';
  }
  if (name.includes('yard')) {
    return 'the yard drilled and ready';
  }
  if (name.includes('forge') || name.includes('smith') || name.includes('foundry')) {
    return 'the forges hammering hot metal into shape';
  }
  if (name.includes('glass')) {
    return 'molten glass spinning into new forms';
  }
  if (name.includes('temple') || name.includes('shrine')) {
    return 'rituals moving in measured cadence';
  }
  if (name.includes('market') || name.includes('exchange') || name.includes('bazaar')) {
    return 'stalls open for the next wave of customers';
  }
  if (name.includes('library') || name.includes('records') || name.includes('archive')) {
    return 'the stacks cataloged and ready for scholars';
  }
  if (name.includes('academy') || name.includes('school')) {
    return 'lessons rolling from hall to hall';
  }
  if (name.includes('tannery')) {
    return 'the curing racks tended despite the stinging brine';
  }
  if (name.includes('vineyard') || name.includes('orchard') || name.includes('farm')) {
    return 'the rows tended under practiced hands';
  }
  if (name.includes('mill')) {
    return 'the millstones grinding without pause';
  }
  if (name.includes('guild')) {
    return 'guild matters handled without delay';
  }
  const locale = buildingLocaleDescription(buildingName);
  if (locale && locale !== buildingName) {
    return `${locale} running smoothly`;
  }
  return 'the worksite running smoothly';
}

function workerOperationSentence(workers, buildingName) {
  const descriptor = workerCountDescriptor(workers);
  if (!descriptor.text) return '';
  const detail = buildingOperationDetail(buildingName);
  if (descriptor.text === 'a handful of workers' && detail === 'cargo flowing along the wharf') {
    return '';
  }
  const subject = capitalizeFirst(descriptor.text);
  const verb = descriptor.plural ? 'keep' : 'keeps';
  return `${subject} ${verb} ${detail}.`;
}

function chooseRandom(list, rng) {
  if (!list || list.length === 0) return '';
  const roll = (rng ?? Math.random)();
  const index = Math.floor(roll * list.length);
  return list[index] ?? list[0];
}

function buildingExtraSceneOverride(buildingName, rng) {
  const lower = (buildingName || '').toLowerCase();
  const patterns = [
    {
      pattern: /wharf|pier|dock|quay/,
      scenes: [
        'Ledger-runners weave between crate stacks, relaying berth assignments to sweating dock bosses. Across the pier, capstan crews chant as they haul a grain barge beneath the waiting cranes.',
        'Harbor quartermasters clap tally drums while sling gangs cinch fresh cargo into waiting nets.',
      ],
    },
    {
      pattern: /warehouse/,
      scenes: [
        'Porters hoist crates while tally clerks flick abacuses beneath the hanging lamps.',
        'Inspectors unseal cargo before scribes ink fresh manifests for the bonded stores.',
        'Cart teams reverse in tight formation as dockhands stack marked freight for delivery.',
      ],
    },
    {
      pattern: /yard/,
      scenes: [
        'Marines run boarding drills along chalked deck outlines while bosuns bark cadence.',
        'Signal flags snap overhead as quartermasters lay out inspection gear beside the parade ground.',
        'Gunnery crews practice run-out drills beside rows of polished cannon.',
      ],
    },
    {
      pattern: /forge|smith|foundry/,
      scenes: [
        'Bellows wheeze while sparks shower from anvils lined in orderly ranks.',
        'An apprentice quenches a glowing billet, steam hissing loud enough to drown conversation.',
        'Racks of finished steel await guild marks as the next heats begin.',
      ],
    },
    {
      pattern: /glass/,
      scenes: [
        'Glassblowers spin molten bulbs into spirals that cast rippling light across the workshop.',
        'Kiln doors yawn open, revealing glowing sheets cooling on padded tables.',
        'Apprentices trim hot edges with shears while masters inspect each curve for flaws.',
      ],
    },
    {
      pattern: /tannery/,
      scenes: [
        'Smoke from the curing pits hangs low as workers stretch hides across scraping beams.',
        'Buckets of brine slosh underfoot while racks of leather sway in the salted breeze.',
        'Dyers stir earthen vats, coaxing color into freshly scraped skins.',
      ],
    },
    {
      pattern: /market|exchange|bazaar/,
      scenes: [
        'Factors haggle over tally sticks while porters shuffle bolts of cloth into display.',
        'Spice merchants crack open crates, letting sharp aromas spill into the lane.',
        'Street criers announce convoy arrivals, sending buyers scrambling toward favored stalls.',
      ],
    },
    {
      pattern: /temple|shrine/,
      scenes: [
        'Tide-priests ring conch bells, calling worshippers toward moonlit basins.',
        'Devotees lay votive shells upon the altar while seawater trickles through carved channels.',
        'Choirs weave tide-chants between the pillars, harmonizing with the surf outside.',
      ],
    },
    {
      pattern: /library|records|archive/,
      scenes: [
        'Scribes trade armfuls of scrolls as indexing carts squeak between towering shelves.',
        'A senior archivist unfurls tide-maps across a slate table for consulting captains.',
        'Dust motes swirl in lamplight where scholars whisper over spread codices.',
      ],
    },
    {
      pattern: /academy|school/,
      scenes: [
        'Students trace sigils midair while an instructor paces, correcting posture with a tapping staff.',
        'Lecture bells chime, sending clusters of apprentices hustling toward their next lesson.',
        'Practice yards crackle with spellfire as wards flare and dissipate.',
      ],
    },
    {
      pattern: /vineyard|orchard|farm|field/,
      scenes: [
        'Field hands load overflowing baskets onto wagons bound for the morning markets.',
        'Irrigation channels glimmer as crews adjust sluice gates to drench the furrows.',
        'Sun hats bob between rows as harvesters sing cadence to keep the pace.',
      ],
    },
    {
      pattern: /guild/,
      scenes: [
        'Journeymen compare stamped contracts at a long oak table, trading news of fresh commissions.',
        'Masters circulate with ledgers of writs, matching crews to the day\'s assignments.',
        'Apprentices hustle between benches, ferrying tools back to their racks.',
      ],
    },
  ];
  for (const entry of patterns) {
    if (entry.pattern.test(lower)) {
      return chooseRandom(entry.scenes, rng);
    }
  }
  return null;
}

function goodsSceneDescription(goods, buildingName, rng) {
  const lowerGoods = (goods || '').toLowerCase();
  const locale = buildingLocaleDescription(buildingName);
  const bulkPattern = /grain|ore|timber|stone|fish|salt|ingot|coal|cargo|supplies|produce|textile|shipment|import|export|lumber|barrel|bale|crate|spice|cargo/;
  const intangiblePattern = /schedule|slip|ledger|contract|order|record|permit|dispatch|report|tally|charter|registry|manifest|invoice|assignment|roster|voucher/;
  const glassPattern = /glass|crystal|bottle|vial|lens|flask/;
  const smithPattern = /blade|weapon|sword|armor|mail|metal|gear|tool|anvil|steel|iron/;
  const potionPattern = /potion|elixir|remedy|draught|tonic|elixir|philter|serum/;
  const knowledgePattern = /scroll|map|chart|tome|codex|treatise|manuscript|blueprint|plan/;
  const shipPattern = /ship|hull|rigging|mast|sail|keel|rudder/;
  const brewPattern = /wine|ale|beer|mead|brew|cider/;

  if (intangiblePattern.test(lowerGoods)) {
    return chooseRandom(
      [
        `Clerks ink ${goods} and slide them across tall desks for signatures.`,
        `${capitalizeFirst(goods)} change hands as factors tally seals by lamplight.`,
        `Messengers dart between offices delivering ${goods} to waiting overseers.`,
      ],
      rng,
    );
  }
  if (bulkPattern.test(lowerGoods)) {
    return chooseRandom(
      [
        `Pallets of ${goods} crowd ${locale}, ready for the next wagon train.`,
        `${capitalizeFirst(goods)} sway from crane hooks toward waiting carts.`,
        `Porters lash ${goods} tight before the tide turns.`,
      ],
      rng,
    );
  }
  if (glassPattern.test(lowerGoods)) {
    return chooseRandom(
      [
        `${capitalizeFirst(goods)} glitter on padded shelves while apprentices polish away stray soot.`,
        `Cooling racks brim with ${goods}, each catching the furnace glow.`,
        `Glassblowers rotate ${goods} slowly, inspecting for stray bubbles.`,
      ],
      rng,
    );
  }
  if (smithPattern.test(lowerGoods)) {
    return chooseRandom(
      [
        `Racks of ${goods} line the wall as quench tubs hiss nearby.`,
        `${capitalizeFirst(goods)} lie cooling on the anvils, ready for the guild stamp.`,
        `Journeymen oil ${goods} while masters inspect the temper.`,
      ],
      rng,
    );
  }
  if (potionPattern.test(lowerGoods)) {
    return chooseRandom(
      [
        `Amber light filters through ${goods} arranged in precise rows along the bench.`,
        `Apprentices swirl ${goods}, watching for the exact shimmer that marks success.`,
        `Corked ${goods} rest beneath rune-etched clamps awaiting delivery.`,
      ],
      rng,
    );
  }
  if (knowledgePattern.test(lowerGoods)) {
    return chooseRandom(
      [
        `${capitalizeFirst(goods)} unfurl across study tables as scribes note amendments.`,
        `Assistants ferry ${goods} from stack to stack under the librarian's gaze.`,
        `Scholars consult ${goods} beside flickering lamps, murmuring discoveries.`,
      ],
      rng,
    );
  }
  if (shipPattern.test(lowerGoods)) {
    return chooseRandom(
      [
        `Tarred ${goods} stretch across the slipways as crews hammer trunnels home.`,
        `${capitalizeFirst(goods)} lie propped along trestles while caulkers seal every seam.`,
        `Loftsmen chalk measurements across ${goods} before the next set of ribs goes in.`,
      ],
      rng,
    );
  }
  if (brewPattern.test(lowerGoods)) {
    return chooseRandom(
      [
        `Oak casks of ${goods} breathe slowly in the cool shadows.`,
        `Cellar hands siphon ${goods} between vats, testing the bouquet at each stage.`,
        `${capitalizeFirst(goods)} froth in copper kettles while the air fills with sweet steam.`,
      ],
      rng,
    );
  }
  return chooseRandom(
    [
      `${capitalizeFirst(goods)} take shape across ${locale}.`,
      `${capitalizeFirst(goods)} are laid out for inspection along ${locale}.`,
      `Runners coordinate ${goods} as the shift wears on.`,
    ],
    rng,
  );
}

function buildingWaitingNarration(buildingName, workers) {
  const name = buildingName || 'the building';
  const lower = name.toLowerCase();
  if (workers <= 1) {
    if (/wharf|pier|dock|quay/.test(lower)) {
      return 'You stand at the head of the pier as only a harbor watchman patrols the quiet dock.';
    }
    if (/forge|smith|foundry/.test(lower)) {
      return 'You hover near the doorway while a lone smith tends embers in near silence.';
    }
    if (/temple|shrine/.test(lower)) {
      return 'You wait beneath the archway; a solitary acolyte drifts between tide basins.';
    }
    if (/library|records|archive/.test(lower)) {
      return 'You pause by the entry desk where only a single scribe minds the hushed stacks.';
    }
    return '';
  }
  const descriptor = workerCountDescriptor(workers);
  if (/wharf|pier|dock|quay/.test(lower)) {
    return '';
  }
  if (/forge|smith|foundry/.test(lower)) {
    const verb = descriptor.plural ? 'hammer' : 'hammers';
    return `You linger near the doorway as ${descriptor.text} ${verb} at the anvils without looking up.`;
  }
  if (/glass/.test(lower)) {
    const verb = descriptor.plural ? 'twirl' : 'twirls';
    return `You keep to the edge while ${descriptor.text} ${verb} molten glass at roaring furnaces.`;
  }
  if (/yard/.test(lower)) {
    const verb = descriptor.plural ? 'run' : 'runs';
    return `You wait beside the fence as ${descriptor.text} ${verb} drills across the parade ground.`;
  }
  if (/temple|shrine/.test(lower)) {
    const verb = descriptor.plural ? 'move' : 'moves';
    return `You remain near the entry as ${descriptor.text} ${verb} between tide basins with ritual precision.`;
  }
  if (/library|records|archive/.test(lower)) {
    const verb = descriptor.plural ? 'shuffle' : 'shuffles';
    return `You rest by the check-in desk while ${descriptor.text} ${verb} armloads of parchment through the stacks.`;
  }
  if (/market|exchange|bazaar/.test(lower)) {
    const verb = descriptor.plural ? 'thread' : 'threads';
    return `You lean against a stall post as ${descriptor.text} ${verb} through narrow aisles laden with wares.`;
  }
  if (/guild/.test(lower)) {
    const verb = descriptor.plural ? 'trade' : 'trades';
    return `You pause on the entry dais while ${descriptor.text} ${verb} assignments over the central table.`;
  }
  const stayVerb = descriptor.plural ? 'stay' : 'stays';
  return `You keep to the entry as ${descriptor.text} ${stayVerb} intent on their duties within.`;
}

function buildingActivityPhrase(workers, profile, buildingName) {
  if (!workers) {
    const locale = buildingLocaleDescription(buildingName);
    return `Only caretakers linger around ${locale}, the usual bustle briefly quiet.`;
  }
  const description = profile?.workforce?.description?.trim();
  const operationSentence = workerOperationSentence(workers, buildingName);
  if (description) {
    return operationSentence ? `${description} ${operationSentence}` : description;
  }
  if (operationSentence) return operationSentence;
  const descriptor = workerCountDescriptor(workers);
  const locale = buildingLocaleDescription(buildingName);
  const name = buildingName || 'the site';
  const isMerchantsWharf = name.toLowerCase() === "merchants' wharf";
  if (isMerchantsWharf && descriptor.text === 'a handful of workers') {
    return '';
  }
  const verb = descriptor.plural ? 'move' : 'moves';
  return `${capitalizeFirst(descriptor.text)} ${verb} through ${locale}, keeping ${name} steady.`;
}

function buildingExtraScene(profile, building, rng, buildingName, workers) {
  const notes = profile?.production?.notes;
  if (notes) return notes;
  const name = buildingName || building?.name || profile?.name || 'the site';
  const override = buildingExtraSceneOverride(name, rng);
  if (override) return override;
  const goods = new Set();
  (profile?.production?.goods || []).forEach(item => goods.add(item));
  const produces = building?.produces || {};
  ['resources', 'commodities', 'luxuries'].forEach(key => {
    (produces[key] || []).forEach(item => goods.add(item));
  });
  if (goods.size) {
    const list = Array.from(goods);
    const choice = list[Math.floor((rng ?? Math.random)() * list.length)] || list[0];
    return goodsSceneDescription(choice, name, rng);
  }
  const descriptor = workerCountDescriptor(workers);
  const locale = buildingLocaleDescription(name);
  const tempoVerb = descriptor.plural ? 'keep' : 'keeps';
  return `${capitalizeFirst(descriptor.text)} ${tempoVerb} ${locale} from falling silent.`;
}

function outdoorTimeBucket(timeLabel) {
  const key = normalizeTimeKey(timeLabel);
  switch (key) {
    case 'predawn':
      return 'predawn';
    case 'morning':
    case 'late-morning':
      return 'morning';
    case 'afternoon':
    case 'late-afternoon':
      return 'afternoon';
    case 'evening':
      return 'evening';
    case 'night':
      return 'night';
    default:
      return 'day';
  }
}

function outdoorHumanPresence(context) {
  const rng = context.rng ?? Math.random;
  const displayName = context.building?.name || context.buildingName || '';
  const flags = outdoorEnvironmentFlags(displayName.toLowerCase());
  const bucket = outdoorTimeBucket(context.timeLabel);
  const weatherKey = normalizeWeatherKey(context.weather);
  const seasonKey = normalizeSeasonKey(context.season);
  const districtLower = (context.district || '').toLowerCase();
  let chance = 0.05;

  if (/farmland|field|orchard|polder|meadow|grove|village|hamlet/.test(districtLower)) chance += 0.1;
  if (/ward|district|market|harbor|dock|port|bridge|square|road/.test(districtLower)) chance += 0.05;
  if (flags.isRiver || flags.isCoast) chance += 0.05;
  if (flags.isForest || flags.isGrassland || flags.isWetland || flags.isHills) chance += 0.02;

  switch (bucket) {
    case 'predawn':
      chance -= 0.09;
      break;
    case 'morning':
      chance += 0.08;
      break;
    case 'day':
      chance += 0.04;
      break;
    case 'afternoon':
      chance += 0.03;
      break;
    case 'evening':
      chance -= 0.02;
      break;
    case 'night':
      chance -= 0.12;
      break;
    default:
      break;
  }

  if (weatherKey === 'storm') chance = 0;
  else if (weatherKey === 'rain') chance -= 0.07;
  else if (weatherKey === 'fog') chance -= 0.04;
  else if (weatherKey === 'snow') chance -= 0.09;
  else if (weatherKey === 'clear') chance += 0.03;

  if (seasonKey === 'winter') chance -= 0.03;
  else if (seasonKey === 'summer') chance += 0.01;

  chance = Math.max(0, Math.min(0.55, chance));

  const roll = (rng ?? Math.random)();
  if (roll > chance) {
    const quietOptions = [
      'No other travelers cross your path; the landscape is quiet at this hour.',
      'You have the stretch to yourself, with only natural sounds for company.',
      'The area is empty of people, leaving the wilds hushed around you.',
    ];
    return chooseRandom(quietOptions, rng) || quietOptions[0];
  }

  const general = {
    predawn: ['a lantern-bearing scout makes a slow pass along the path'],
    morning: ['a traveler pauses to refill waterskins before pressing on'],
    day: ['a courier guides a pack-pony along the road toward the city'],
    afternoon: ['a pair of wanderers share a quiet meal while watching the horizon'],
    evening: ['a hunter cleans gear before heading home with the fading light'],
    night: ['a watchful ranger traces a patrol route under hooded light'],
  };

  const river = {
    predawn: ['a lone fisher checks eel pots in the pre-dawn hush'],
    morning: ['a fisher casts for the morning rise from a reed-wrapped perch'],
    day: ['a washerwoman rinses linens at a calm eddy'],
    afternoon: ['two youngsters gather reeds for weaving along the bank'],
    evening: ['a lantern-bearing angler waits for the dusk rise'],
    night: ['a river warden patrols the bank to guard moored boats'],
  };

  const coast = {
    predawn: ['a shell-gatherer checks tide wrack by lantern light'],
    morning: ['a beachcomber combs the wrack for drifted goods'],
    day: ['a net-mender spreads lines to dry along a driftwood frame'],
    afternoon: ['two fishers mend nets beside beached skiffs'],
    evening: ['a tide-watcher notes the swell before heading back to town'],
    night: ['a lighthouse runner makes a final inspection along the shore'],
  };

  const forest = {
    predawn: ['a trapper checks snares beneath the shadowed boughs'],
    morning: ['an herbalist clips dew-damp leaves into a satchel'],
    day: ['a woodcutter hauls a modest bundle toward the trailhead'],
    afternoon: ['two foragers compare mushroom finds near the path'],
    evening: ['a cloaked ranger marks trees with a small sigil before dusk'],
    night: ['a night watch keeps a hooded lantern low among the trunks'],
  };

  const grassland = {
    predawn: ['a shepherd counts silhouettes of the herd before sunrise'],
    morning: ['a farmhand drives a small flock toward a watering bend'],
    day: ['a messenger on horseback canters along the ridge road'],
    afternoon: ['two herders trade whistles as they gather strays'],
    evening: ['a hunter leads a pack pony laden with snares back toward the farms'],
    night: ['a lone rider trots past, lantern swinging from the saddle'],
  };

  const wetland = {
    predawn: ['a reed-cutter bundles shoots while the mist clings low'],
    morning: ['a herbalist harvests sweetflag near the marsh edge'],
    day: ['two gatherers stack cattail fluff into wicker baskets'],
    afternoon: ['a bog guide checks marker poles before the light fades'],
    evening: ['a frog catcher wades carefully with a hooded lantern'],
    night: ['a levee warden makes quiet rounds to watch the waters'],
  };

  const hills = {
    predawn: ['a lookout peers toward the city lights from the ridge'],
    morning: ['a surveyor sights along a staff atop the rise'],
    day: ['two couriers rest their mounts in the lee of a hill'],
    afternoon: ['a shepherd whistles for dogs to bring goats down from the slopes'],
    evening: ['a traveler pauses to watch sunset wash the hills'],
    night: ['a distant campfire flickers where a patrol shelters from the wind'],
  };

  const entries = [];
  const addEntries = table => {
    if (!table) return;
    const list = table[bucket] || table.day || [];
    list.forEach(item => entries.push(item));
  };

  addEntries(general);
  if (flags.isRiver) addEntries(river);
  if (flags.isCoast) addEntries(coast);
  if (flags.isForest) addEntries(forest);
  if (flags.isGrassland) addEntries(grassland);
  if (flags.isWetland) addEntries(wetland);
  if (flags.isHills) addEntries(hills);

  if (!entries.length) entries.push(...(general[bucket] || general.day || []));

  const selection = (chooseRandom(entries, rng) || entries[0] || '').trim();
  if (!selection) return '';
  const weatherClause = (() => {
    if (weatherKey === 'rain') return 'despite the drizzle';
    if (weatherKey === 'fog') return 'moving carefully through the fog';
    if (weatherKey === 'snow') return 'bundled against the cold';
    if (weatherKey === 'clear') return 'enjoying the clear weather';
    return '';
  })();
  let sentence = selection;
  if (weatherClause) sentence += `, ${weatherClause}`;
  return sentenceFromSlug(sentence);
}

function outdoorWildlifeActivity(context) {
  const rng = context.rng ?? Math.random;
  const displayName = context.building?.name || context.buildingName || '';
  const flags = outdoorEnvironmentFlags(displayName.toLowerCase());
  const weatherKey = normalizeWeatherKey(context.weather);
  const bucket = outdoorTimeBucket(context.timeLabel);
  const seasonKey = normalizeSeasonKey(context.season);
  const habitat = (context.habitat || '').toLowerCase();

  if (weatherKey === 'storm') {
    return 'Wind-driven rain batters the area, and most wildlife stays hidden.';
  }
  if (weatherKey === 'snow') {
    return 'Snow muffles the landscape so only faint tracks betray the local creatures.';
  }

  const options = [];

  if (flags.isRiver) {
    options.push('Silverfish flicker where the current curls around submerged stones.');
    options.push('Herons stalk between the reeds while frogs croak from the shallows.');
    if (bucket === 'evening' || bucket === 'night') {
      options.push('Fireflies drift above the reeds as the river murmurs through the dark.');
    }
    if (seasonKey === 'spring') {
      options.push('Migrating waterfowl settle on the eddies, paddling past fresh shoots.');
    }
  }

  if (flags.isCoast || habitat === 'coastal') {
    options.push('Gulls wheel overhead and dive for fish riding the nearby tide.');
    if (bucket === 'evening') {
      options.push('Sandpipers skitter along the retreating waves while dusk paints the foam.');
    }
    if (bucket === 'morning') {
      options.push('Crabs scuttle between tidepools, leaving tiny tracks in the damp sand.');
    }
  }

  if (flags.isForest) {
    options.push('Songbirds chatter among the branches while resin scents the air.');
    if (bucket === 'evening' || bucket === 'night') {
      options.push('Owls trade distant calls between the trees as night creatures stir.');
    }
    if (seasonKey === 'autumn') {
      options.push('Fallen leaves rustle with squirrels caching the last of the season’s nuts.');
    }
  }

  if (flags.isGrassland || habitat === 'farmland') {
    options.push('Wind bends the tall grasses, flushing startled hares across the open ground.');
    if (bucket === 'night') {
      options.push('Crickets and night insects trill in layered rhythm across the flats.');
    }
  }

  if (flags.isWetland) {
    options.push('Dragonflies stitch bright arcs above the marsh while frogs splash from the banks.');
    if (bucket === 'morning') {
      options.push('Mist beads on cattails as marsh birds pick through the shallows for breakfast.');
    }
  }

  if (flags.isHills) {
    options.push('Aurochs silhouettes crest a distant ridge before vanishing beyond the slope.');
  }

  if (!options.length) {
    options.push('Wind teases through the wild growth while unseen creatures rustle in the distance.');
    if (bucket === 'night') {
      options.push('Starlight glints off dew while nocturnal insects hum softly around you.');
    }
  }

  return sentenceFromSlug(chooseRandom(options, rng) || options[0]);
}

function mergeOutdoorDetails(presence, wildlife) {
  const presenceClean = stripTerminalPunctuation(presence || '');
  const wildlifeClean = stripTerminalPunctuation(wildlife || '');
  if (presenceClean && wildlifeClean) {
    return sentenceFromSlug(`${presenceClean}, while ${lowercaseFirst(wildlifeClean)}`);
  }
  if (presenceClean) return sentenceFromSlug(presenceClean);
  if (wildlifeClean) return sentenceFromSlug(wildlifeClean);
  return '';
}

function buildingSceneParagraphs(context) {
  const { building, buildingName, businessProfile, timeLabel, weather, workers, rng, habitat, season, district } = context;
  const paragraphs = [];
  const displayName = building?.name || buildingName;
  if (displayName && isOutdoorSite(displayName)) {
    const overview = composeBuildingOverview({
      building,
      buildingName: displayName,
      businessProfile,
      timeLabel,
      weather,
      workers,
      rng,
      habitat,
      season,
      district,
    });
    if (overview) paragraphs.push(overview);
    if (building?.description) paragraphs.push(building.description);
    const presence = outdoorHumanPresence({
      building,
      buildingName: displayName,
      timeLabel,
      weather,
      season,
      rng,
      habitat,
      district
    });
    const wildlife = outdoorWildlifeActivity({
      building,
      buildingName: displayName,
      timeLabel,
      weather,
      season,
      rng,
      habitat
    });
    const mergedDetails = mergeOutdoorDetails(presence, wildlife);
    if (mergedDetails) paragraphs.push(mergedDetails);
    return paragraphs;
  }
  if (displayName === "Merchants' Wharf") {
    const overview = merchantsWharfOverview({ weather, season, timeLabel });
    if (overview) paragraphs.push(overview);
  } else {
    const overview = composeBuildingOverview({
      building,
      buildingName: displayName,
      businessProfile,
      timeLabel,
      weather,
      workers,
      rng,
      habitat,
      season,
      district,
    });
    if (overview) paragraphs.push(overview);
    if (building?.description) paragraphs.push(building.description);
    if (displayName) {
      const workforceNoun = buildingWorkforceNoun(displayName);
      const workforceGroup = capitalizeFirst(buildingWorkforceGroup(displayName, workforceNoun));
      const operationDetail = buildingOperationDetail(displayName);
      const timeAction = timeLabel
        ? `work through the ${timeLabel.toLowerCase()}${operationDetail ? ` to keep ${operationDetail}` : ''}`
        : `keep ${operationDetail || 'the work moving'}`;
      const weatherPhrase = buildingWeatherPhrase(weather, habitat, displayName);
      const weatherClause = weatherPhrase ? ` while ${weatherPhrase}` : '';
      paragraphs.push(`${workforceGroup} ${timeAction}${weatherClause}.`);
    }
  }
  const activity = buildingActivityPhrase(workers, businessProfile, displayName || 'the site');
  if (activity) paragraphs.push(activity);
  const extra = buildingExtraScene(businessProfile, building, rng, displayName, workers);
  if (extra) paragraphs.push(extra);
  return paragraphs;
}

function inferPersonaStyle(role) {
  const lower = (role || '').toLowerCase();
  if (lower.includes('owner') || lower.includes('mistress') || lower.includes('master')) return 'warm';
  if (lower.includes('manager') || lower.includes('foreman') || lower.includes('captain')) return 'gruff';
  if (lower.includes('administrator') || lower.includes('steward') || lower.includes('scribe')) return 'dry';
  if (lower.includes('keeper')) return 'dry';
  return 'warm';
}

function defaultPersonaLabel(role) {
  const lower = (role || '').toLowerCase();
  if (!lower) return 'the steward';
  if (lower === 'owner') return 'the owner';
  if (lower === 'manager') return 'the manager';
  if (lower === 'administrator') return 'the administrator';
  if (lower === 'foreman') return 'the foreman';
  if (lower === 'steward') return 'the steward';
  return `the ${lower}`;
}

function hashString(value) {
  const text = String(value || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0; // eslint-disable-line no-bitwise
  }
  return hash >>> 0; // eslint-disable-line no-bitwise
}

const ROLE_SYNONYMS = {
  owner: ['owner', 'proprietor', 'landholder'],
  manager: ['manager', 'supervisor', 'site manager'],
  steward: ['steward', 'caretaker', 'attendant'],
  foreman: ['foreman', 'crew chief', 'work boss'],
  administrator: ['administrator', 'registrar', 'clerk'],
  keeper: ['keeper', 'custodian', 'tender'],
  warden: ['warden', 'overseer', 'watcher'],
  captain: ['captain', 'marshal', 'chief'],
  dockmaster: ['dockmaster', 'harbormaster', 'pier master'],
  master: ['master', 'mistress', 'guildmaster'],
  factor: ['factor', 'agent', 'quartermaster'],
  operator: ['operator', 'attendant', 'tender'],
  innkeeper: ['innkeeper', 'host', 'housekeeper'],
  quartermaster: ['quartermaster', 'supply chief', 'stores master'],
  leader: ['point contact', 'crew lead', 'site lead'],
};

function normalizeRoleKey(role) {
  const lower = String(role || '').toLowerCase();
  if (!lower) return 'leader';
  if (lower.includes('owner') || lower.includes('proprietor')) return 'owner';
  if (lower.includes('innkeep')) return 'innkeeper';
  if (lower.includes('manager') || lower.includes('supervisor')) return 'manager';
  if (lower.includes('foreman') || lower.includes('overseer') || lower.includes('crew chief')) return 'foreman';
  if (lower.includes('administrator') || lower.includes('registrar') || lower.includes('clerk')) return 'administrator';
  if (lower.includes('steward') || lower.includes('caretaker')) return 'steward';
  if (lower.includes('keeper')) return 'keeper';
  if (lower.includes('warden')) return 'warden';
  if (lower.includes('captain')) return 'captain';
  if (lower.includes('dockmaster') || lower.includes('harbor')) return 'dockmaster';
  if (lower.includes('master')) return 'master';
  if (lower.includes('factor')) return 'factor';
  if (lower.includes('quartermaster')) return 'quartermaster';
  if (lower.includes('operator')) return 'operator';
  return 'leader';
}

function chooseFromList(options, seed) {
  if (!options || !options.length) return '';
  const index = hashString(seed) % options.length;
  return options[index];
}

function roleNounForKey(roleKey, seed) {
  const options = ROLE_SYNONYMS[roleKey] || [roleKey];
  return chooseFromList(options, seed);
}

function roleTitleFor(role, seed, descriptor) {
  const key = normalizeRoleKey(role);
  const noun = roleNounForKey(key, `${seed}:${role}`) || 'leader';
  const trimmed = noun.startsWith('the ') ? noun.slice(4) : noun;
  let qualified = trimmed;
  if (descriptor && !trimmed.toLowerCase().includes(descriptor.toLowerCase())) {
    qualified = `${descriptor} ${trimmed}`;
  }
  return qualified.startsWith('the ') ? qualified : `the ${qualified}`;
}

const SEARCH_LABEL_PATTERNS = [
  title => `Look for ${title}`,
  title => `Ask around for ${title}`,
  title => `Seek out ${title}`,
  title => `Track down ${title}`,
];

const REQUEST_LABEL_PATTERNS = [
  title => `Ask ${title} about available work`,
  title => `Consult with ${title} about available work`,
  title => `Request an assignment from ${title}`,
  title => `Inquire with ${title} about available work`,
];

function selectSearchLabel(title, seed) {
  const pattern = chooseFromList(SEARCH_LABEL_PATTERNS, `search:${seed}`) || SEARCH_LABEL_PATTERNS[0];
  return pattern(title);
}

function selectRequestLabel(title, seed) {
  const pattern = chooseFromList(REQUEST_LABEL_PATTERNS, `request:${seed}`) || REQUEST_LABEL_PATTERNS[0];
  return pattern(title);
}

function rankPersonaRole(role) {
  const key = normalizeRoleKey(role);
  switch (key) {
    case 'owner':
      return 0;
    case 'manager':
      return 1;
    case 'foreman':
      return 2;
    case 'administrator':
      return 3;
    case 'steward':
      return 4;
    default:
      return 5;
  }
}

function primaryPersona(context, fallbackRole) {
  const personas = buildPersonaCandidates(context);
  if (!personas.length) {
    if (fallbackRole) {
      return { name: '', role: fallbackRole, style: inferPersonaStyle(fallbackRole) };
    }
    return null;
  }
  let best = personas[0];
  for (let i = 1; i < personas.length; i += 1) {
    const candidate = personas[i];
    if (rankPersonaRole(candidate.role) < rankPersonaRole(best.role)) {
      best = candidate;
    }
  }
  if (
    fallbackRole &&
    best &&
    normalizeRoleKey(best.role) === 'steward' &&
    best.name === 'the steward' &&
    normalizeRoleKey(fallbackRole) !== 'steward'
  ) {
    return { name: best.name, role: fallbackRole, style: inferPersonaStyle(fallbackRole) };
  }
  return best;
}

function buildPersonaCandidates(context) {
  const buildingName = context.building?.name || context.buildingName || '';
  const city = context.city;
  const ownership = LOCATIONS[city]?.ownership;
  const businessInfo =
    ownership?.businesses?.[buildingName] || ownership?.buildings?.[buildingName];
  const employees = context.building?.employees || [];
  const leadershipRoles = employees.filter(e =>
    ['Owner', 'Manager', 'Administrator', 'Steward', 'Foreman'].includes(e.role),
  );
  const personas = [];
  const ownerName = typeof businessInfo?.owner === 'string' ? businessInfo.owner.trim() : '';
  const cityName = typeof city === 'string' ? city.trim() : '';
  const isCivicOwner = ownerName && cityName && ownerName.toLowerCase() === cityName.toLowerCase();
  if (ownerName && !isCivicOwner) {
    const ownerRole = leadershipRoles.find(e => e.role === 'Owner');
    const role = ownerRole ? ownerRole.role : 'Owner';
    personas.push({ name: ownerName, role, style: inferPersonaStyle(role) });
  }
  const stewardRoles = leadershipRoles.filter(e => e.role !== 'Owner');
  const stewardNames = Array.isArray(businessInfo?.stewards) ? businessInfo.stewards : [];
  stewardNames.forEach((name, index) => {
    const employee = stewardRoles[index] || stewardRoles[0] || leadershipRoles[0];
    const role = employee ? employee.role : 'Steward';
    personas.push({ name, role, style: inferPersonaStyle(role) });
  });
  if (!personas.length && leadershipRoles.length) {
    const employee = leadershipRoles[0];
    personas.push({
      name: defaultPersonaLabel(employee.role),
      role: employee.role,
      style: inferPersonaStyle(employee.role),
    });
  }
  if (!personas.length) {
    personas.push({ name: 'the steward', role: 'Steward', style: 'warm' });
  }
  return personas;
}

function buildingSelectPersona(context, rng) {
  const personas = buildPersonaCandidates(context);
  if (personas.length <= 1) return personas[0];
  const weights = personas.map(persona => {
    const role = (persona.role || '').toLowerCase();
    if (role.includes('owner')) return 0.25;
    if (role.includes('manager') || role.includes('foreman')) return 0.35;
    if (role.includes('administrator')) return 0.3;
    return 0.3;
  });
  const total = weights.reduce((sum, value) => sum + value, 0) || personas.length;
  const roll = rng() * total;
  let cumulative = 0;
  for (let i = 0; i < personas.length; i += 1) {
    cumulative += weights[i] || 1;
    if (roll <= cumulative) return personas[i];
  }
  return personas[personas.length - 1];
}

function buildingComposeIntro(persona, method, context) {
  const details = BUILDING_PERSONA_DETAILS[persona.style] || [
    'hands marked by long hours',
  ];
  const detail = details[Math.floor((context.rng ?? Math.random)() * details.length)] || details[0];
  if (method === 'door') {
    return `${persona.name} answers the entrance, ${detail}, and weighs your arrival.`;
  }
  if (method === 'search') {
    return `You flag down ${persona.name} amid the bustle, ${detail}, as they pause to listen.`;
  }
  return `${persona.name} steps away from the crews, ${detail}, to hear you out.`;
}

function buildingComposeQuote(persona, context) {
  const condition = (context.weather?.condition || '').toLowerCase();
  const weatherNote = () => {
    if (!condition) return '';
    if (condition.includes('storm')) return 'before the squalls pick up again';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'while this rain keeps crews wet';
    if (condition.includes('fog')) return 'while the fog has everyone moving slow';
    if (condition.includes('snow') || condition.includes('sleet')) return 'before the chill freezes our hands';
    if (condition.includes('clear')) return 'while the sky stays kind';
    return '';
  };
  const workerNote =
    context.workers > 14
      ? 'Crews are stretched thin today.'
      : context.workers <= 3
        ? 'We are running with a skeleton crew right now.'
        : 'There is steady work if you are interested.';
  const rng = context.rng ?? Math.random;
  if (persona.style === 'gruff') {
    const lines = [
      `State your business. ${workerNote}`,
      `If you are here for work, say so ${weatherNote() || 'before I turn back to the crews'}.`,
      'Quick questions only—we are on a timetable.',
    ];
    return lines[Math.floor(rng() * lines.length)] ?? lines[0];
  }
  if (persona.style === 'dry') {
    const lines = [
      `Records first, then requests. ${workerNote}`,
      `Mind the ledgers—${weatherNote() || 'we are keeping careful tally today'}.`,
      'If you are following up on a posting, have the details ready.',
    ];
    return lines[Math.floor(rng() * lines.length)] ?? lines[0];
  }
  const lines = [
    `Welcome. ${workerNote}`,
    `Looking to help out? We could always use steady hands ${weatherNote() || 'on the floor'}.`,
    'Tell me what brings you in and we will see where to put you.',
  ];
  return lines[Math.floor(rng() * lines.length)] ?? lines[0];
}

function buildingStateSeed(context) {
  const base = dateKey(context.today);
  const hour = Number.isFinite(context.timeOfDay) ? Math.round(context.timeOfDay * 10) : 0;
  const name = currentCharacter?.name || 'traveler';
  const buildingName = context.building?.name || context.buildingName || 'building';
  return `building_encounter:${buildingName}:${base}:${hour}:${name}`;
}

function initializeBuildingState(context) {
  const seed = buildingStateSeed(context);
  const rng = createWeatherRandom(seed);
  const timeBand = buildingTimeBand(context.timeOfDay);
  const businessProfile = getBusinessProfileByName(context.building?.name || context.buildingName);
  const workers = buildingWorkerEstimate(
    businessProfile,
    timeBand,
    context.weather,
    context.building,
    context.buildingName
  );
  const season = context.today ? getSeasonForDate(context.today).toLowerCase() : null;
  const baseParagraphs = buildingSceneParagraphs({
    building: context.building,
    buildingName: context.buildingName,
    businessProfile,
    timeLabel: context.timeLabel,
    weather: context.weather,
    workers,
    rng,
    habitat: context.habitat,
    season,
    district: context.district,
  });
  const state = {
    key: seed,
    random: rng,
    timeBand,
    timeLabel: context.timeLabel,
    weather: context.weather,
    workers,
    baseParagraphs,
    narrative: [],
    dialogue: [],
    message: null,
    messageType: null,
    knockAttempts: 0,
    searchAttempts: 0,
    remainingContacts: Math.max(1, Math.round(Math.max(workers, 3) / 3)),
    managerFound: false,
    persona: null,
    entryMethod: null,
    businessProfile,
    habitat: context.habitat,
    buildingName: context.buildingName || context.building?.name || '',
    season,
    dynamicBoards: [],
    pierWalks: 0,
    lastOpportunity: null,
  };
  if ((state.buildingName || '').toLowerCase() === "merchants' wharf") {
    applyMerchantsWharfDynamicBoard(null);
  }
  const greetRoll = rng();
  if (greetRoll < buildingGreetingChance(timeBand, context.weather, workers)) {
    buildingSummonManager(state, context, 'greeted');
  } else {
    const waitNarration = buildingWaitingNarration(state.buildingName, workers);
    if (waitNarration) {
      state.narrative.push(waitNarration);
    }
  }
  return state;
}

function buildingSummonManager(state, context, method) {
  const persona = buildingSelectPersona(
    { building: context.building, buildingName: context.buildingName || context.building?.name, city: context.city },
    state.random,
  );
  state.persona = persona;
  state.managerFound = true;
  state.entryMethod = method;
  const intro = buildingComposeIntro(persona, method, { rng: state.random });
  const quote = buildingComposeQuote(persona, {
    weather: context.weather,
    workers: state.workers,
    buildingName: state.buildingName || context.building?.name || 'the site',
    rng: state.random,
  });
  if (!state.narrative.includes(intro)) {
    state.narrative.push(intro);
  }
  state.dialogue = [{ persona, quote }];
}

function ensureBuildingEncounterState(context) {
  let state = context.state;
  if (!state || state.key !== buildingStateSeed(context)) {
    state = initializeBuildingState(context);
    context.setState(state);
  }
  return state;
}

function buildingQuestStatusNote(questInfo) {
  if (!questInfo) return null;
  if (questInfo.quest && questInfo.alreadyAccepted) {
    const acceptedLabel = questInfo.acceptedOnLabel;
    return acceptedLabel
      ? `They remind you the posting is already on your log from ${acceptedLabel}.`
      : 'They remind you that you have already taken this posting.';
  }
  if (!questInfo.availability?.available) {
    const reason = questInfo.availability?.reason;
    return reason ? `No new crews are being signed right now — ${reason}.` : 'No new crews are being signed today.';
  }
  if (!questInfo.eligibility?.canAccept) {
    const note = questInfo.eligibility?.reasons?.[0];
    return note || 'You do not yet meet the requirements for this posting.';
  }
  return null;
}

function buildingDialogueHTML(dialogue) {
  if (!dialogue || !dialogue.persona) return '';
  const name = escapeHtml(dialogue.persona.name || 'The steward');
  const role = dialogue.persona.role ? escapeHtml(dialogue.persona.role) : '';
  const speech = escapeHtml(dialogue.quote || '');
  const roleLabel = role ? ` <span class="npc-role">(${role})</span>` : '';
  return `<p class="npc-line"><strong>${name}</strong>${roleLabel}: <span class="npc-dialogue">&ldquo;${speech}&rdquo;</span></p>`;
}

function buildingMessageHTML(state, questInfo) {
  const lines = [];
  if (state.message) {
    const cls = state.messageType ? ` encounter-message-${state.messageType}` : '';
    lines.push(`<p class="encounter-message${cls}">${escapeHtml(state.message)}</p>`);
  }
  const questNote = buildingQuestStatusNote(questInfo);
  if (questNote) {
    lines.push(`<p class="encounter-message encounter-message-info">${escapeHtml(questNote)}</p>`);
  }
  return lines.join('');
}

function buildingParagraphHTML(text) {
  if (!text) return '';
  const replaced = replaceCharacterRefs(String(text), currentCharacter || {});
  const safe = escapeHtml(replaced);
  if (!safe) return '';
  const normalized = safe
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  const segments = normalized
    .split(/\n{2,}/)
    .map(seg => seg.replace(/\n+/g, '<br>').trim())
    .filter(Boolean);
  if (!segments.length) {
    const single = normalized.replace(/\n+/g, '<br>').trim();
    return single ? `<p>${single}</p>` : '';
  }
  return segments
    .map(seg => `<p>${seg}</p>`)
    .join('');
}

function buildingDescriptionHTML(state, questInfo) {
  const parts = [];
  state.baseParagraphs.forEach(text => {
    parts.push(buildingParagraphHTML(text));
  });
  state.narrative.forEach(text => {
    parts.push(buildingParagraphHTML(text));
  });
  state.dialogue.forEach(line => {
    parts.push(buildingDialogueHTML(line));
  });
  const message = buildingMessageHTML(state, questInfo);
  if (message) parts.push(message);
  const html = parts.filter(Boolean).join('');
  return { html };
}

function buildingHasHomestead(context) {
  const habitat = (context.habitat || '').toLowerCase();
  const buildingName = (context.building?.name || context.buildingName || '').toLowerCase();
  const districtName = (context.district || '').toLowerCase();
  const profile = getBusinessProfileByName(context.building?.name || context.buildingName || '');
  const category = (profile?.category || '').toLowerCase();
  const homesteadPattern = /homestead|farmhouse|stead|manor|villa|hall|house|cottage|barn|lodge|quarters|cabin|estate/;
  const tags = Array.isArray(context.building?.tags)
    ? context.building.tags.map(tag => String(tag).toLowerCase())
    : [];
  if (homesteadPattern.test(buildingName)) return true;
  if (tags.some(tag => homesteadPattern.test(tag))) return true;
  if (category === 'residential') return true;
  if (habitat === 'farmland' || category === 'agriculture') {
    if (homesteadPattern.test(districtName)) return true;
  }
  return false;
}

function buildingHasRowLayout(context) {
  const buildingName = (context.building?.name || context.buildingName || '').toLowerCase();
  const districtName = (context.district || '').toLowerCase();
  const tags = Array.isArray(context.building?.tags)
    ? context.building.tags.map(tag => String(tag).toLowerCase())
    : [];
  const rowPattern = /row|terrace|arcade|lane|gallery|block|tier/;
  if (rowPattern.test(buildingName)) return true;
  if (rowPattern.test(districtName)) return true;
  if (tags.some(tag => rowPattern.test(tag))) return true;
  return false;
}

function buildingHasFieldCrews(context) {
  const buildingName = (context.building?.name || context.buildingName || '').toLowerCase();
  const districtName = (context.district || '').toLowerCase();
  const habitat = (context.habitat || '').toLowerCase();
  const tags = Array.isArray(context.building?.tags)
    ? context.building.tags.map(tag => String(tag).toLowerCase())
    : [];
  const profile = getBusinessProfileByName(context.building?.name || context.buildingName || '');
  const category = (profile?.category || '').toLowerCase();
  const ruralPattern = /\b(field|fields|orchard|orchards|vineyard|vineyards|row|rows|grove|groves|pasture|pastures|meadow|meadows|paddock|paddocks|acre|acres|grain|grains|farm|farms|farmstead|farmsteads|stead|steads|ranch|ranches|garden|gardens|grassland|grasslands|hayfield|hayfields|crop|crops|furrow|furrows)\b/;
  const isRuralHabitat = habitat === 'farmland' || ruralPattern.test(districtName) || category === 'agriculture';
  if (!isRuralHabitat) return false;
  if (ruralPattern.test(buildingName)) return true;
  if (tags.some(tag => ruralPattern.test(tag))) return true;
  return isRuralHabitat && !buildingHasHomestead(context);
}

const ENVIRONMENT_STEWARD_RULES = [
  {
    tags: ['forest', 'wood', 'grove', 'pine', 'timber'],
    tone: 'forest',
    suppressKnock: true,
    fallbackRole: 'forest warden',
    descriptor: 'forest',
  },
  {
    tags: ['coastal', 'beach', 'shore', 'tidal', 'tidepool'],
    tone: 'coastal',
    suppressKnock: true,
    fallbackRole: 'dockmaster',
    descriptor: 'pier',
  },
  {
    tags: ['river', 'rivers', 'riverbank', 'riverlands', 'stream', 'streams', 'brook', 'creek'],
    tone: 'waterside',
    suppressKnock: true,
    fallbackRole: 'river warden',
    descriptor: 'river',
  },
  {
    tags: ['wetland', 'marsh', 'bog', 'fen', 'swamp'],
    tone: 'wetland',
    suppressKnock: true,
    fallbackRole: 'marsh warden',
    descriptor: 'marsh',
  },
  {
    tags: ['grassland', 'prairie', 'meadow', 'hills', 'ridge'],
    tone: 'grassland',
    suppressKnock: true,
    fallbackRole: 'range foreman',
    descriptor: 'range',
  },
  {
    tags: ['quarry', 'mine', 'stone', 'cliff'],
    tone: 'industrial',
    suppressKnock: true,
    fallbackRole: 'quarry foreman',
    descriptor: 'quarry',
  },
  {
    tags: ['farmland', 'fields', 'crop', 'orchard', 'pasture', 'hayfield', 'paddock'],
    tone: 'rural',
    suppressKnock: true,
    fallbackRole: 'field overseer',
    descriptor: 'field',
    categories: ['agriculture'],
  },
];

function inferEnvironmentStewardInteraction(context) {
  if (!context || !context.city || !context.district || !context.building) return null;
  const buildingName = context.building?.name || context.buildingName || '';
  const definition = getEnvironmentDefinition(context.city, context.district, buildingName);
  if (!definition) return null;
  const rawTags = Array.isArray(definition.tags) ? definition.tags : [];
  const tags = new Set(rawTags.map(tag => String(tag).toLowerCase()));
  if (context.habitat) {
    tags.add(String(context.habitat).toLowerCase());
  }
  const profile = getBusinessProfileByName(buildingName);
  const category = (profile?.category || '').toLowerCase();
  for (const rule of ENVIRONMENT_STEWARD_RULES) {
    if (rule.categories && !rule.categories.includes(category)) continue;
    if (rule.tags.some(tag => tags.has(tag))) {
      return {
        tone: rule.tone,
        suppressKnock: rule.suppressKnock,
        fallbackRole: rule.fallbackRole,
        descriptor: rule.descriptor,
      };
    }
  }
  const homestead = buildingHasHomestead(context);
  return {
    tone: homestead ? 'rural' : 'urban',
    suppressKnock: false,
    fallbackRole: homestead ? 'house steward' : 'site manager',
  };
}

function buildingInteractionLabels(context) {
  const buildingName = context.building?.name || context.buildingName || '';
  const name = buildingName.toLowerCase();
  if (name === "merchants' wharf") {
    return {
      knock: { label: 'Signal the berth office', tone: 'urban' },
      search: { label: 'Walk the pier looking for job opportunities', tone: 'pier' },
      request: 'Ask about pier contracts',
    };
  }
  const hasHomestead = buildingHasHomestead(context);
  const hasFieldCrews = buildingHasFieldCrews(context);
  const hasRows = buildingHasRowLayout(context);
  const profile = getBusinessProfileByName(buildingName);
  const category = (profile?.category || '').toLowerCase();

  const environmentSteward = inferEnvironmentStewardInteraction(context) || {};
  let knock = { label: 'Knock on the office door', tone: 'urban' };
  if (environmentSteward.suppressKnock) {
    knock = null;
  }

  let tone = environmentSteward.tone || (hasHomestead ? 'rural' : 'urban');
  let descriptor = environmentSteward.descriptor || '';

  if (hasRows && !hasFieldCrews) {
    tone = 'row';
    if (!descriptor) descriptor = 'row';
  } else if (hasFieldCrews) {
    tone = 'rural';
    if (!descriptor) descriptor = 'field';
  } else if (hasHomestead) {
    tone = 'rural';
  }

  const personaInfo = primaryPersona(context, environmentSteward.fallbackRole);
  const roleSource = personaInfo?.role || environmentSteward.fallbackRole || 'leader';
  const seed = `${context.city || ''}:${context.district || ''}:${buildingName}:${roleSource}:${descriptor}`;
  const roleTitle = roleTitleFor(roleSource, seed, descriptor);
  const searchLabel = selectSearchLabel(roleTitle, seed);
  const requestLabel = selectRequestLabel(roleTitle, seed);

  const search = { label: searchLabel, tone, target: roleTitle };
  let request = requestLabel;

  if (hasRows && !hasFieldCrews) {
    request = 'Ask about warehouse assignments';
  } else if (hasFieldCrews) {
    request = 'Ask about field postings';
  }

  if (hasHomestead) {
    const suppress =
      environmentSteward && Object.prototype.hasOwnProperty.call(environmentSteward, 'suppressKnock')
        ? environmentSteward.suppressKnock
        : false;
    knock = suppress ? null : { label: 'Knock on the farmhouse door', tone: 'rural' };
  } else if (hasFieldCrews) {
    knock = null;
  }

  if (!hasFieldCrews && category === 'logistics' && !hasRows) {
    request = 'Ask about cargo contracts';
  }

  return { knock, search, request };
}

function scoreQuestCandidate(info) {
  if (!info) return -Infinity;
  let score = 0;
  if (info.availability?.available) score += 4;
  else if (info.availability) score += 1;
  if (info.eligibility?.canAccept) score += 2;
  if (info.alreadyAccepted) score += 3;
  return score;
}

function findAvailableQuestForBoards(boardEntries) {
  if (!currentCharacter) return null;
  if (!Array.isArray(boardEntries) || boardEntries.length === 0) return null;
  const questLog = ensureQuestLog(currentCharacter);
  let best = null;
  let bestScore = -Infinity;

  for (const entry of boardEntries) {
    if (!entry || typeof entry !== 'object') continue;
    const boardName = entry.name || entry.boardName;
    if (!boardName) continue;
    const quests = Array.isArray(entry.quests) ? entry.quests : [];
    for (const quest of quests) {
      if (!quest || typeof quest !== 'object') continue;
      const availability = evaluateQuestAvailability(quest, boardName);
      const eligibility = evaluateQuestEligibility(quest);
      const key = questKey(boardName, quest.title || '');
      const logEntry = questLog.find(entry => entry.key === key) || null;
      const status = (logEntry?.status || '').toLowerCase();
      const alreadyAccepted = Boolean(logEntry) && !REPEATABLE_QUEST_STATUSES.has(status);
      const info = {
        boardName,
        quest,
        availability,
        eligibility,
        alreadyAccepted,
        acceptedOnLabel: logEntry?.acceptedOnLabel || logEntry?.acceptedOn || null,
        logEntry,
      };
      info.canOffer = Boolean(availability?.available) && eligibility?.canAccept && !alreadyAccepted;
      if (info.canOffer) {
        return info;
      }
      const score = scoreQuestCandidate(info);
      if (score > bestScore) {
        best = info;
        bestScore = score;
      }
    }
  }
  return best;
}

function generateBuildingEncounter(buildingName, context) {
  const state = ensureBuildingEncounterState(context);
  const dynamicBoards = Array.isArray(state.dynamicBoards) ? state.dynamicBoards : [];
  const combinedBoards = [...(context.buildingBoards || []), ...dynamicBoards];
  const questInfo = findAvailableQuestForBoards(combinedBoards);
  const interactions = [];
  const labels = buildingInteractionLabels(context);
  const encounterBuildingName = context.building?.name || context.buildingName || '';
  const isMerchantsWharf = encounterBuildingName.toLowerCase() === "merchants' wharf";
  if (isMerchantsWharf) {
    interactions.push({ action: 'merchants-walk-pier', name: 'Walk the pier looking for job opportunities' });
    if (state.managerFound) {
      interactions.push({
        action: 'building-request-work',
        name: questInfo?.quest?.title ? `Ask about “${questInfo.quest.title}”` : labels.request,
        disabled: questInfo ? !questInfo.canOffer : false,
      });
    }
  } else if (!state.managerFound) {
    if (labels.knock) {
      interactions.push({ action: 'building-knock', name: labels.knock.label });
    }
    if (labels.search) {
      interactions.push({ action: 'building-search', name: labels.search.label });
    }
    if (!labels.knock && !labels.search) {
      interactions.push({ action: 'building-search', name: 'Look around for whoever is in charge' });
    }
  } else {
    const requestLabel = questInfo?.quest?.title
      ? `Ask about “${questInfo.quest.title}”`
      : labels.request || 'Ask about available work';
    interactions.push({
      action: 'building-request-work',
      name: requestLabel,
      disabled: questInfo ? !questInfo.canOffer : false,
    });
  }
  return {
    state,
    description: buildingDescriptionHTML(state, questInfo),
    interactions,
    questInfo,
  };
}

function handleMerchantsPierWalk(position) {
  const context = createBuildingEncounterContext(position);
  if (!context) return;
  const state = ensureBuildingEncounterState(context);
  state.message = null;
  state.messageType = null;
  state.pierWalks = (state.pierWalks || 0) + 1;
  const opportunity = generateMerchantsWharfOpportunity(state);
  if (!opportunity) {
    state.narrative.push('You walk the length of the pier, but every crew keeps their heads down with no spare contracts today.');
    state.dynamicBoards = [];
    state.dialogue = [];
    state.persona = null;
    state.managerFound = false;
    state.lastOpportunity = null;
    applyMerchantsWharfDynamicBoard(null);
    state.message = 'No fresh postings surfaced during this circuit of the pier.';
    state.messageType = 'info';
    setBuildingEncounterState(position.building, state);
    showNavigation();
    return;
  }
  const { persona, quest, narrative, quote } = opportunity;
  state.dynamicBoards = [
    {
      name: MERCHANTS_WHARF_DYNAMIC_BOARD,
      quests: [quest],
    },
  ];
  state.dialogue = [{ persona, quote }];
  state.narrative.push(narrative);
  state.persona = persona;
  state.managerFound = true;
  state.entryMethod = 'pier';
  state.lastOpportunity = quest.title || opportunity.template?.key || null;
  state.message = `A new contract is on offer: “${quest.title}”.`;
  state.messageType = 'info';
  applyMerchantsWharfDynamicBoard(quest);
  setBuildingEncounterState(position.building, state);
  showNavigation();
}

function handleBuildingKnock(position) {
  const context = createBuildingEncounterContext(position);
  if (!context) return;
  const state = ensureBuildingEncounterState(context);
  const labels = buildingInteractionLabels(context);
  state.message = null;
  state.messageType = null;
  if (state.managerFound) {
    state.narrative.push('The lead already has an eye on you—no need to knock again.');
    setBuildingEncounterState(position.building, state);
    showNavigation();
    return;
  }
  if (!labels.knock) {
    state.narrative.push('There is no door to knock on here—you will need to hail someone working nearby instead.');
    setBuildingEncounterState(position.building, state);
    showNavigation();
    return;
  }
  state.knockAttempts = (state.knockAttempts || 0) + 1;
  const base = buildingGreetingChance(state.timeBand, state.weather, state.workers);
  const chance = Math.max(0.05, base - (state.knockAttempts - 1) * 0.05);
  if (state.random() < chance) {
    const lines = [
      'After a pause, footsteps approach and the latch lifts.',
      'Persistent knocking finally draws someone from within.',
    ];
    const line = lines[(state.knockAttempts - 1) % lines.length];
    state.narrative.push(line);
    buildingSummonManager(state, context, 'door');
  } else {
    const tone = labels.knock.tone;
    const missLines = tone === 'rural'
      ? [
          'You rap on the farmhouse door and wait, but only distant work calls answer.',
          'No one emerges from the farmhouse—crews must be working the far fields.',
          'You linger on the porch, yet the door stays shut as workers shout orders beyond the hedgerows.',
        ]
      : [
          'You knock on the office door, but the bustle inside does not pause.',
          'After a polite knock, no one breaks from their ledgers to greet you.',
          'You wait by the entry, yet staff hurry past without stopping.',
        ];
    const miss = missLines[(state.knockAttempts - 1) % missLines.length];
    state.narrative.push(miss);
  }
  setBuildingEncounterState(position.building, state);
  showNavigation();
}

const SEARCH_MISS_LINES_BY_TONE = {
  rural: [
    'A picker points you toward another field, promising %ROLE% is further upslope.',
    'You flag down a hauler, but they shrug and send you deeper among the crops.',
    'Another crew member shakes their head—they have crates to move and no authority to help.',
  ],
  row: [
    'A porter waves you farther down the row, saying %ROLE% is tied up.',
    'You check a warehouse office, but %ROLE% is already escorting another crew.',
    'Someone at the next door shouts that %ROLE% is out inspecting manifests.',
  ],
  coastal: [
    'You pace the shoreline, but %ROLE% is tending nets farther along the surf.',
    'Spray stings your face as fishers wave you toward another stretch of beach.',
    'Gulls scatter as someone calls out that %ROLE% is checking tidepools down the coast.',
  ],
  waterside: [
    'You follow the riverbank, yet locals say %ROLE% is clearing a snag upstream.',
    'A fisher gestures downstream—apparently %ROLE% is inspecting eel pots there.',
    'Reeds rustle in the wind while farmers insist %ROLE% already headed toward the next bend.',
  ],
  wetland: [
    'You slog through muck but only frogs answer; %ROLE% must be at another dike.',
    'A bog worker points across the flats where %ROLE% is repairing sluice gates.',
    'Dragonflies buzz as someone tells you %ROLE% is patrolling the far reeds.',
  ],
  forest: [
    'You trail hoofprints beneath the boughs, yet %ROLE% remains out of sight.',
    'A woodcutter nods deeper into the grove, saying %ROLE% is checking snares.',
    'Birdsong is your only reply; %ROLE% must be ranging farther in.',
  ],
  grassland: [
    'Wind whips your call away while drovers shout that %ROLE% rode toward another herd.',
    'You crest a hill but only spot %ROLE% far off against the horizon.',
    'A ranch hand waves you toward distant pens where %ROLE% is tallying stock.',
  ],
  industrial: [
    'You circle the quarry terraces, but workers say %ROLE% is overseeing a cut below.',
    'Stone dust swirls as a hauler shouts that %ROLE% climbed to the upper scaffolds.',
    'Sparks spit from chisels while someone explains %ROLE% is inspecting the north face.',
  ],
  urban: [
    'A clerk nods toward the back offices, suggesting you try again later.',
    'You stop a porter, but they are too busy to fetch a supervisor right now.',
    'Someone gestures upstairs, yet no one breaks away to meet you.',
  ],
};

function handleBuildingSearch(position) {
  const context = createBuildingEncounterContext(position);
  if (!context) return;
  const state = ensureBuildingEncounterState(context);
  const labels = buildingInteractionLabels(context);
  state.message = null;
  state.messageType = null;
  if (state.managerFound) {
    state.narrative.push('The lead is already speaking with you.');
    setBuildingEncounterState(position.building, state);
    showNavigation();
    return;
  }
  if (!labels.search) {
    state.narrative.push('There is no clear path to track down a supervisor here.');
    setBuildingEncounterState(position.building, state);
    showNavigation();
    return;
  }
  state.searchAttempts = (state.searchAttempts || 0) + 1;
  const remaining = Math.max(1, state.remainingContacts || Math.max(1, Math.round(Math.max(state.workers, 3) / 3)));
  const chance = 1 / remaining;
  if (state.random() < chance || remaining <= 1) {
    const lines = [
      'You weave between workers until a supervisor waves you over.',
      'You catch the attention of someone in charge as they finish directing a crew.',
    ];
    const line = lines[(state.searchAttempts - 1) % lines.length];
    state.narrative.push(line);
    buildingSummonManager(state, context, 'search');
    state.remainingContacts = Math.max(1, remaining - 1);
  } else {
    const tone = labels.search.tone;
    const missLines = SEARCH_MISS_LINES_BY_TONE[tone] || SEARCH_MISS_LINES_BY_TONE.urban;
    const template = missLines[(state.searchAttempts - 1) % missLines.length];
    const target = labels.search.target || 'the supervisor';
    const miss = template.includes('%ROLE%') ? template.replace(/%ROLE%/g, target) : template;
    state.narrative.push(miss);
    state.remainingContacts = Math.max(1, remaining - 1);
  }
  setBuildingEncounterState(position.building, state);
  showNavigation();
}

function handleBuildingQuestRequest(position) {
  const context = createBuildingEncounterContext(position);
  if (!context) return;
  const state = ensureBuildingEncounterState(context);
  if (!state.managerFound) {
    state.narrative.push('You should find whoever is in charge before asking about postings.');
    setBuildingEncounterState(position.building, state);
    showNavigation();
    return;
  }
  const questInfo = findAvailableQuestForBoards(context.buildingBoards || []);
  if (!questInfo) {
    state.message = 'No postings are being offered here today.';
    state.messageType = 'info';
    setBuildingEncounterState(position.building, state);
    showNavigation();
    return;
  }
  if (!questInfo.canOffer) {
    state.message = buildingQuestStatusNote(questInfo) || 'No postings are being offered right now.';
    state.messageType = 'info';
    setBuildingEncounterState(position.building, state);
    showNavigation();
    return;
  }
  const questTitle = questInfo.quest?.title || '';
  const result = acceptQuest(questInfo.boardName, questTitle);
  state.message = result.message || (result.ok ? 'Quest accepted.' : 'Unable to accept quest.');
  state.messageType = result.ok ? 'success' : 'error';
  setBuildingEncounterState(position.building, state);
  if (result.ok && result.storyline) {
    const boardContext = {
      origin: 'building',
      backLabel: `Back to ${position.building}`,
      onBack: () => {
        showNavigation();
      },
    };
    startQuestStoryline(result.storyline, { boardName: questInfo.boardName, boardContext });
  } else {
    showNavigation();
  }
}
function showNavigation() {
  updateTopMenuIndicators();
  if (!currentCharacter) return;
  ensureCharacterClock(currentCharacter);
  if (!currentCharacter.position) {
    const city = currentCharacter.location;
    const cityData = CITY_NAV[city];
    currentCharacter.position = {
      city,
      district: cityData ? Object.keys(cityData.districts)[0] : null,
      building: null,
      previousDistrict: null,
      previousBuilding: null,
    };
    saveProfiles();
  }
  const pos = currentCharacter.position;
  const cityData = CITY_NAV[pos.city];
  if (!cityData) {
    setMainHTML(`<div class="no-character"><h1>Welcome, ${currentCharacter.name}</h1><p>You are in ${pos.city}.</p></div>`);
    return;
  }
  const createNavItem = ({
    type,
    target,
    name,
    action,
    prompt,
    icon,
    disabled,
    extraClass,
    tags,
  }) => {
    const safeName = escapeHtml(name || '');
    const defaultIcon = NAV_ICONS[type] || '📍';
    const usesDefaultAsset = typeof icon === 'string' && /\/Default\.png$/i.test(icon);
    const hasActionIcon = typeof icon === 'string' && /\/actions\//i.test(icon);
    const iconHTML = icon
      ? `<img src="${icon}" alt="" class="nav-icon">`
      : `<span class="nav-icon">${defaultIcon}</span>`;
    const attrValue = action ? escapeHtml(action) : escapeHtml(target ?? '');
    const aria = prompt ? `${prompt} ${name}` : name;
    const ariaLabel = escapeHtml(aria || '');
    const cls = extraClass ? ` ${extraClass}` : '';
    const hideLabel = hasActionIcon && type === 'interaction';
    const labelNeeded =
      !hideLabel && (!icon || usesDefaultAsset || (type === 'interaction' && !['shop', 'sell'].includes(action)));
    const labelHTML = labelNeeded ? `<span class="street-sign">${safeName}</span>` : '';
    const attrParts = [`data-type="${type}"`];
    if (action) {
      attrParts.push(`data-action="${attrValue}"`);
    } else if (target != null) {
      attrParts.push(`data-target="${attrValue}"`);
    }
    if (Array.isArray(tags) && tags.length) {
      attrParts.push(`data-tags="${escapeHtml(tags.join(' '))}"`);
    }
    attrParts.push(`aria-label="${ariaLabel}"`);
    if (disabled) {
      attrParts.push('disabled');
    }
    const buttonAttrs = attrParts.join(' ');
    return `<div class="nav-item${cls}"><button ${buttonAttrs}>${iconHTML}</button>${labelHTML}</div>`;
  };
  if (pos.building) {
    const building = cityData.buildings[pos.building];
    const groups = [];
    const exitButtons = [];
    building.exits.forEach(e => {
      if (e.type === 'location') {
        exitButtons.push(
          createNavItem({
            type: 'location',
            target: e.target,
            name: e.name,
            prompt: e.prompt || 'Travel to',
            icon: e.icon,
            tags: e.tags,
          })
        );
      } else if (e.target !== pos.district) {
        const prompt = e.prompt || building.travelPrompt || 'Travel to';
        const icon = e.icon || getDistrictIcon(pos.city, e.name);
        exitButtons.push(
          createNavItem({ type: 'district', target: e.target, name: e.name, prompt, icon, tags: e.tags })
        );
      }
    });
    if (exitButtons.length) groups.push(exitButtons);
    const buildingBoards = questBoardsForBuilding(pos.city, pos.district, pos.building);
    let questButtons = [];
    if (QUEST_BOARD_BUILDINGS.has(pos.building)) {
      questButtons = buildingBoards.map(board =>
        createNavItem({
          type: 'quests',
          target: board.key,
          name: board.name,
          prompt: 'Review quests at',
          icon: QUEST_BOARD_ICON,
          extraClass: 'quest-board-item',
        })
      );
    }
    if (questButtons.length) groups.push(questButtons);
    const interactionButtons = [];
    (building.interactions || []).forEach(i => {
      if (i.action === 'manage' && !canManageBuilding(pos.city, pos.building)) return;
      interactionButtons.push(
        createNavItem({ type: 'interaction', action: i.action, name: i.name, icon: i.icon, tags: i.tags })
      );
    });
    const encounterContext = createBuildingEncounterContext(pos, { building, buildingBoards });
    const encounter = encounterContext
      ? generateBuildingEncounter(pos.building, encounterContext)
      : null;
    if (encounter?.state) {
      setBuildingEncounterState(pos.building, encounter.state);
    }
    (encounter?.interactions || []).forEach(i => {
      interactionButtons.push(
        createNavItem({
          type: 'interaction',
          action: i.action,
          name: i.name,
          icon: i.icon,
          disabled: i.disabled,
          extraClass: i.extraClass,
        }),
      );
    });
    const environmentContext = buildEnvironmentActionContext(pos);
    const environmentActions = listEnvironmentActions(
      pos.city,
      pos.district,
      pos.building,
      environmentContext || undefined,
    );
    environmentActions.forEach(envAction => {
      const actionId = buildEnvironmentActionId(
        envAction.type,
        pos.city,
        pos.district,
        pos.building,
      );
      interactionButtons.push(
        createNavItem({
          type: 'interaction',
          action: actionId,
          name: envAction.label || describeEnvironmentAction(envAction.type),
          icon: envAction.icon,
          extraClass: 'environment-action',
        }),
      );
    });
    if (interactionButtons.length) groups.push(interactionButtons);
    const buttons = [];
    groups.forEach((group, index) => {
      if (group.length === 0) return;
      if (index > 0) buttons.push('<div class="group-separator"></div>');
      buttons.push(...group);
    });
    const hours = building.hours;
    const descContent = (encounter && encounter.description) || building.description;
    const descriptionHTML = descContent
      ? renderBuildingDescription(descContent, currentCharacter)
      : '';
    const hoursText = hours
      ? hours.open === '00:00' && hours.close === '24:00'
        ? 'Open 24 hours'
        : `Open ${hours.open}–${hours.close}`
      : '';
    const bIcon = getBuildingIcon(pos.city, pos.district, pos.building);
    const dIcon = getDistrictIcon(pos.city, pos.district);
    const headerHTML = `<div class="nav-header"><button data-type="district" data-target="${pos.district}" aria-label="Return to ${pos.district}"><img src="${dIcon}" alt="" class="nav-icon"></button>${
      bIcon ? `<img src="${bIcon}" alt="" class="nav-icon">` : ''
    }</div>`;
    const logHTML = renderLocationLogEntries(pos);
    setMainHTML(
      `<div class="navigation">${headerHTML}${descriptionHTML}${hoursText ? `<p class="business-hours">${hoursText}</p>` : ''}<div class="option-grid">${buttons.join('')}</div>${logHTML}</div>`
    );
  } else {
    const district = cityData.districts[pos.district];
    if (!district) {
      setMainHTML(
        `<div class="navigation"><h2>${escapeHtml(pos.city)}</h2><p class="location-description">This district is unavailable.</p></div>`
      );
      return;
    }

    const exits = [];
    const districtLinks = [];
    const locals = [];
    const buildingNames = [];

    district.points.forEach(pt => {
      const entry = { ...pt };
      if (entry.type === 'location') {
        exits.push(entry);
      } else if (entry.type === 'district') {
        districtLinks.push(entry);
      } else {
        locals.push(entry);
      }
      if (entry.type === 'building') {
        buildingNames.push(entry.target || entry.name);
      }
    });

    const questBoards = questBoardsForDistrict(pos.city, pos.district, {
      excludeBuildingBoards: true,
      buildingNames,
    });

    const makeButton = pt => {
      const prompt =
        pt.type === 'district' ? 'Travel to' : district.travelPrompt || 'Walk to';
      return createNavItem({
        type: pt.type,
        target: pt.target ?? pt.name,
        name: pt.name,
        prompt,
        icon: pt.icon,
        extraClass: pt.extraClass,
        disabled: pt.disabled,
        tags: pt.tags,
      });
    };

    const exitGroup = exits.map(makeButton);
    const localButtons = locals.map(makeButton);
    const activeVendor = evaluateStreetVendor(pos.city, pos.district);
    if (activeVendor) {
      const soldOut = streetVendorSoldOut(activeVendor);
      const vendorLabel = soldOut
        ? `${activeVendor.name} (Sold Out)`
        : `Street Vendor: ${activeVendor.name}`;
      localButtons.push(
        createNavItem({
          type: 'interaction',
          action: 'street-vendor',
          name: vendorLabel,
          icon: activeVendor.icon,
          disabled: soldOut,
          extraClass: 'street-vendor-option',
        })
      );
    }
    const hasMultipleDistricts = Object.keys(cityData.districts || {}).length > 1;

    const buildDistrictNav = () => {
      const layout = cityData.layout;
      const allNames = Object.keys(cityData.districts || {});
      if (hasMultipleDistricts && showDistricts && layout && layout.positions) {
        const accessible = new Set(
          districtLinks.map(d => d.target || d.name).concat(pos.district)
        );
        const fontSize =
          parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const isLandscape = window.innerWidth > window.innerHeight;
        const iconRem = isLandscape ? 10 : 4.5;
        const size = iconRem * fontSize;
        const nodes = allNames.map(name => {
          const coords = layout.positions[name] || [0, 0];
          const [row, col] = coords;
          const disabled = !accessible.has(name);
          const extraClass = name === pos.district ? 'current-district' : '';
          return `<div class="district-node" style="left:${col * size}px;top:${row * size}px;">${createNavItem({
            type: 'district',
            target: name,
            name,
            icon: getDistrictIcon(pos.city, name),
            disabled,
            extraClass,
          })}</div>`;
        });
        const lines = (layout.connections || [])
          .map(([a, b]) => {
            const [r1, c1] = layout.positions[a] || [0, 0];
            const [r2, c2] = layout.positions[b] || [0, 0];
            const x1 = c1 * size + size / 2;
            const y1 = r1 * size + size / 2;
            const x2 = c2 * size + size / 2;
            const y2 = r2 * size + size / 2;
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
          })
          .join('');
        const width = (layout.cols || 0) * size;
        const height = (layout.rows || 0) * size;
        return [
          `<div class="district-map" style="width:${width}px;height:${height}px;"><svg class="district-connections" width="${width}" height="${height}">${lines}</svg>${nodes.join('')}</div>`,
        ];
      }
      const neighborButtons = districtLinks.map(makeButton);
      return neighborButtons;
    };

    const mapToggle = hasMultipleDistricts
      ? createNavItem({
          type: 'district',
          action: 'toggle-city-map',
          name: 'City Map',
          prompt: 'Toggle city map',
          icon: getCityIcon(pos.city),
        })
      : null;

    const districtToggle = hasMultipleDistricts
      ? createNavItem({
          type: 'district',
          action: 'toggle-districts',
          name: showDistricts ? 'Hide Districts' : 'Show Districts',
          prompt: 'Toggle district overview',
          icon: getDistrictsEnvelope(pos.city),
        })
      : null;

    const groups = [];
    if (hasMultipleDistricts) {
      const toggleButtons = [districtToggle, mapToggle].filter(Boolean);
      if (toggleButtons.length) {
        groups.push(toggleButtons);
      }
    }

    const districtNav = buildDistrictNav();
    if (districtNav.length) {
      groups.push(districtNav);
    }

    if (exitGroup.length) {
      groups.push(exitGroup);
    }

    const navButtons = [];
    groups.forEach(group => {
      if (!group || !group.length) return;
      if (navButtons.length) {
        navButtons.push('<div class="group-separator"></div>');
      }
      navButtons.push(...group);
    });

    let description = null;
    if (pos.previousBuilding) {
      description = `Leaving ${pos.previousBuilding}, you step back into ${pos.district}.`;
      pos.previousBuilding = null;
      saveProfiles();
    } else if (
      pos.previousDistrict &&
      pos.previousDistrict !== pos.district &&
      district.descriptions
    ) {
      description = district.descriptions[pos.previousDistrict];
    }

    const questButtons = questBoards.map(board =>
      createNavItem({
        type: 'quests',
        target: board.key,
        name: board.name,
        prompt: 'Review quests at',
        icon: QUEST_BOARD_ICON,
        extraClass: 'quest-board-item',
      })
    );

    const localSections = [];
    if (questButtons.length) {
      localSections.push(
        `<div class="quest-board-section"><h3 class="quest-board-heading">Quest Boards</h3><div class="option-grid quest-board-grid">${questButtons.join('')}</div></div>`
      );
    }
    if (localButtons.length) {
      localSections.push(`<div class="option-grid">${localButtons.join('')}</div>`);
    }
    const localsHTML = localSections.join('');
    const descHTML = description
      ? `<p class="location-description">${description}</p>`
      : '';
    const logHTML = renderLocationLogEntries(pos);
    setMainHTML(
      `<div class="navigation"><h2>${pos.district}</h2><div class="option-grid">${navButtons.join('')}</div>${descHTML}${localsHTML}${logHTML}</div>`
    );
  }
  normalizeOptionButtonWidths();
  updateMenuHeight();
  if (main) {
    main
      .querySelectorAll('.option-grid button:not(:disabled), .nav-header button:not(:disabled)')
      .forEach(btn => {
        btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'toggle-districts') {
          showDistricts = !showDistricts;
          safeStorage.setItem(SHOW_DISTRICTS_KEY, showDistricts);
          showNavigation();
          return;
        } else if (action === 'toggle-city-map') {
          toggleCityMap(btn);
          return;
        }
        const type = btn.dataset.type;
        const target = btn.dataset.target;
        const prevBuilding = pos.building;
        if (type === 'building') {
          pos.previousBuilding = null;
          pos.building = target;
        } else if (type === 'district') {
          if (pos.building) pos.previousBuilding = pos.building;
          pos.previousDistrict = pos.district;
          pos.district = target;
          pos.building = null;
        } else if (type === 'exit') {
          if (pos.building) pos.previousBuilding = pos.building;
          pos.previousDistrict = pos.district;
          pos.building = null;
          pos.district = target;
        } else if (type === 'quests') {
          const board = target || '';
          if (board) {
            const locData = LOCATIONS[pos.city];
            const groupInfo = locData
              ? findQuestBoardGroup(locData, board, { district: pos.district, building: pos.building })
              : null;
            const displayName = groupInfo?.name || undefined;
            if (pos.building) {
              const buildingName = pos.building;
              showQuestBoardDetails(board, {
                origin: 'building',
                backLabel: `Back to ${buildingName}`,
                onBack: () => {
                  showNavigation();
                },
                displayName,
                district: groupInfo?.district || pos.district || undefined,
                building: buildingName,
              });
            } else {
              const districtName = pos.district;
              showQuestBoardDetails(board, {
                origin: 'district',
                backLabel: `Back to ${districtName}`,
                onBack: () => {
                  showNavigation();
                },
                displayName,
                district: groupInfo?.district || districtName || undefined,
              });
            }
          }
          return;
        } else if (type === 'location') {
          currentCharacter.location = target;
          const city = CITY_NAV[target];
          currentCharacter.position = {
            city: target,
            district: city ? Object.keys(city.districts)[0] : null,
            building: null,
            previousDistrict: null,
            previousBuilding: null,
          };
        }
        if (type !== 'interaction' && type !== 'quests') {
          if (prevBuilding && prevBuilding !== pos.building) {
            resetBuildingEncounterState(prevBuilding);
          }
        }
        if (type === 'interaction') {
            if (action === 'street-vendor') {
              renderStreetVendorUI(pos.city, pos.district).catch(console.error);
              return;
            }
            if (action === 'shop') {
              renderShopUI(pos.building).catch(console.error);
              return;
            } else if (action === 'sell') {
              renderSellUI(pos.building);
              return;
            } else if (action === 'manage') {
              const bData = cityData.buildings[pos.building] || {};
              const owned = (currentCharacter.buildings || []).find(b => b.name === pos.building);
              function renderManage() {
                const funds = formatCurrency(owned?.money || createEmptyCurrency());
                const hours = bData.hours || { open: '09:00', close: '17:00' };
                const staff = (bData.employees || [])
                  .map((e, i) => `<li><button class="employee-btn" data-idx="${i}">${e.role}</button></li>`)
                  .join('');
                showBackButton();
                setMainHTML(
                  `<div class="no-character"><h1>Manage ${pos.building}</h1><p>Funds: ${funds}</p><div class="manage-hours"><label>Open <input type="time" id="building-open" value="${hours.open}"></label><label>Close <input type="time" id="building-close" value="${hours.close}"></label><button id="save-hours">Save Hours</button></div><ul>${staff}</ul></div>`
                );
                const btn = document.getElementById('save-hours');
                if (btn) {
                  btn.addEventListener('click', () => {
                    const open = document.getElementById('building-open').value || '00:00';
                    const close = document.getElementById('building-close').value || '24:00';
                    bData.hours = { open, close };
                    renderManage();
                  });
                }
                document.querySelectorAll('.employee-btn').forEach(btn => {
                  btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.idx, 10);
                    renderEmployee(idx);
                  });
                });
              }
              function renderEmployee(idx) {
                const emp = bData.employees[idx];
                const quota = emp.quota;
                const hours = emp.hours ? emp.hours.join(', ') : '';
                showBackButton();
                setMainHTML(
                  `<div class="no-character"><h1>${emp.role}</h1><label>Schedule <input type="text" id="emp-schedule" value="${emp.schedule || ''}"></label><label>Hours <input type="text" id="emp-hours" value="${hours}"></label>${
                    quota
                      ? `<label>Quota <input type="number" id="emp-quota" min="0" value="${quota.amount}"/> ${quota.unit || ''}</label>`
                      : ''
                  }<button id="save-emp">Save</button></div>`
                );
                const btn = document.getElementById('save-emp');
                if (btn) {
                  btn.addEventListener('click', () => {
                    emp.schedule = document.getElementById('emp-schedule').value || null;
                    const hrsVal = document.getElementById('emp-hours').value.trim();
                    emp.hours = hrsVal ? hrsVal.split(',').map(s => s.trim()) : null;
                    if (quota) {
                      const amt = parseInt(document.getElementById('emp-quota').value, 10) || 0;
                      emp.quota.amount = amt;
                      if (emp.baseQuota && emp.basePay != null) {
                        emp.pay = Math.round(emp.basePay * (amt / emp.baseQuota));
                      }
                    }
                    renderManage();
                  });
                }
              }
              renderManage();
              return;
            } else if (action === 'train-glassblowing') {
              handleTrainingAction(pos, 'glassblowing');
              return;
            } else if (action === 'train-pearl-diving') {
              handleTrainingAction(pos, 'pearl-diving');
              return;
            } else if (action === 'train-blacksmithing') {
              handleTrainingAction(pos, 'blacksmithing');
              return;
            } else if (action === 'train-carpentry') {
              handleTrainingAction(pos, 'carpentry');
              return;
            } else if (action === 'train-tailoring') {
              handleTrainingAction(pos, 'tailoring');
              return;
            } else if (action === 'train-leatherworking') {
              handleTrainingAction(pos, 'leatherworking');
              return;
            } else if (action === 'train-alchemy') {
              handleTrainingAction(pos, 'alchemy');
              return;
            } else if (action === 'train-enchanting') {
              handleTrainingAction(pos, 'enchanting');
              return;
            } else if (action === 'merchants-walk-pier') {
              handleMerchantsPierWalk(pos);
              return;
            } else if (action === 'building-knock') {
              handleBuildingKnock(pos);
              return;
            } else if (action === 'building-search') {
              handleBuildingSearch(pos);
              return;
            } else if (action === 'building-request-work') {
              handleBuildingQuestRequest(pos);
              return;
            } else if (action.startsWith('environment:')) {
              handleEnvironmentInteraction(action, pos).catch(console.error);
              return;
            } else if (action === 'rest') {
              handleRestAction(pos);
            } else {
              showBackButton();
              setMainHTML(`<div class="no-character"><h1>${btn.textContent} not implemented</h1></div>`);
              return;
            }
        }
        saveProfiles();
        showNavigation();
      });
    });
  }
}

function showCharacter() {
  if (!currentCharacter) return;
  hideBackButton();
  updateCharacterButton();
  showNavigation();
}

function showNoCharacterUI() {
  hideBackButton();
  updateCharacterButton();
  updateTopMenuIndicators();
  setMainHTML(`<div class="no-character"><h1>Start your journey...</h1><button id="new-character">New Character</button></div>`);
  document.getElementById('new-character').addEventListener('click', startCharacterCreation);
  updateMenuHeight();
}

function showCharacterSelectUI() {
  updateTopMenuIndicators();
  showBackButton();
  const characters = currentProfile?.characters || {};
  const ids = Object.keys(characters);
  let html = '<div class="no-character"><h1>Select Character</h1><div class="option-grid">';
  if (ids.length === 0) {
    html += '<p>No characters available</p>';
  } else {
    ids.forEach(id => {
      const c = characters[id];
      const cls = currentCharacter && currentCharacter.id === id ? 'selected' : '';
      html += `<button data-id="${id}" class="${cls}">${c.name}</button>`;
    });
  }
  html += '</div></div>';
  setMainHTML(html);
  if (main) {
    main.querySelectorAll('.option-grid button').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        currentProfile.lastCharacter = id;
        currentCharacter = migrateProficiencies({
          ...defaultProficiencies,
          ...currentProfile.characters[id]
        });
        resetLocationLogs();
        saveProfiles();
        showMainUI();
      });
    });
  }
}

function showMainUI() {
  updateTopMenuIndicators();
  updateScale();
  if (currentCharacter) {
    showCharacter();
  } else {
    showNoCharacterUI();
  }
}

function showCharacterUI() {
  if (!currentCharacter) {
    startCharacterCreation();
    return;
  }
  updateTopMenuIndicators();
  showBackButton();
  const c = currentCharacter;
  const portrait = `<img src="${c.image || ''}" alt="portrait" class="profile-portrait"${c.image ? '' : ' style="display:none;"'}>`;
  const info = `
    <div class="info-block">
      <div>Race: ${c.race}</div>
      <div>Sex: ${c.sex}</div>
      <div class="physical-group">
        ${c.accentColor ? `<div>Accents: <span class="color-box" style="background:${c.accentColor}"></span></div>` : ''}
        ${c.scaleColor ? `<div>Scales: <span class="color-box" style="background:${c.scaleColor}"></span></div>` : ''}
      </div>
      ${c.guildRank && c.guildRank !== 'None' ? `<div>Guild Rank: ${c.guildRank}</div>` : ''}
      ${c.adventurersGuildRank && c.adventurersGuildRank !== 'None' ? `<div>Adventurer Rank: ${c.adventurersGuildRank}</div>` : ''}
      <div>Funds: ${formatCurrency(c.money || createEmptyCurrency())}</div>
    </div>
  `;
  const stats = c.attributes?.current || {};
  const statsList = ['STR','DEX','CON','VIT','AGI','INT','WIS','CHA','LCK']
    .map(attr => `<li>${attr}: ${stats[attr] ?? 0}</li>`)
    .join('');
  const resourceBars = (() => {
    const hpPct = c.maxHP ? (c.hp / c.maxHP) * 100 : 0;
    const mpPct = c.maxMP ? (c.mp / c.maxMP) * 100 : 0;
    const staPct = c.maxStamina ? (c.stamina / c.maxStamina) * 100 : 0;
    const xpNeed = xpForNextLevel(c.level);
    const hpColor = hpPct > 0 ? '#fff' : '#000';
    const mpColor = mpPct > 0 ? '#fff' : '#000';
    const stColor = staPct > 0 ? '#fff' : '#000';
    return `
      <div class="resource-bar hp"><div class="fill" style="width:${hpPct}%"></div><span class="value" style="color:${hpColor}">HP: ${c.hp} / ${c.maxHP}</span></div>
      <div class="resource-bar mp"><div class="fill" style="width:${mpPct}%"></div><span class="value" style="color:${mpColor}">MP: ${c.mp} / ${c.maxMP}</span></div>
      <div class="resource-bar stamina"><div class="fill" style="width:${staPct}%"></div><span class="value" style="color:${stColor}">ST: ${c.stamina} / ${c.maxStamina}</span></div>
      <p class="xp-display">XP: ${c.xp} / ${xpNeed}</p>
    `;
  })();
  const statsHTML = `<h2>Current Stats</h2><div class="stats-resource-grid"><ul class="stats-list">${statsList}</ul><div class="resource-column">${resourceBars}</div></div>`;
  const backstoryHTML = c.backstory
    ? `<div class="backstory-block"><h2>Backstory</h2><p><strong>${c.backstory.background}</strong> - ${c.backstory.past}</p><p>${c.backstory.narrative}</p></div>`
    : '';
  const employmentHTML = (c.employment && c.employment.length)
    ? `<div class="employment-block"><h2>Employment</h2><ul>${c.employment.map(e => {
        const data = JOB_ROLE_DATA[e.role] || {};
        const schedule = e.schedule != null ? e.schedule : data.schedule;
        const hours = e.hours || data.hours;
        const quota = e.quota || data.quota;
        let extra = '';
        if (schedule) extra = `Shift: ${schedule}`;
        else if (quota && quota.amount != null)
          extra = `Quota: ${(e.progress || 0)} / ${quota.amount} ${quota.unit || ''}`;
        else if (hours) extra = `Hours: ${hours.join(', ')}`;
        return `<li>${e.role} at ${e.building} (${e.location})${extra ? ' - ' + extra : ''}</li>`;
      }).join('')}</ul></div>`
    : '';
  setMainHTML(`
    <div class="character-profile">
      <h1>${c.name}</h1>
      <div class="profile-grid">
        <div class="portrait-section">
          <div class="portrait-wrapper">${portrait}
            <div class="portrait-zoom">
              <button id="portrait-zoom-dec" class="portrait-zoom-dec" aria-label="Zoom out">-</button>
              <button id="portrait-zoom-reset" class="portrait-zoom-reset" aria-label="Reset zoom">100%</button>
              <button id="portrait-zoom-inc" class="portrait-zoom-inc" aria-label="Zoom in">+</button>
            </div>
          </div>
        </div>
        <div>
          ${info}
          ${statsHTML}
          ${backstoryHTML}
          ${employmentHTML}
        </div>
      </div>
      <button id="delete-character">Delete Character</button>
    </div>`);

  const portraitImg = document.querySelector('.profile-portrait');
  const zoomDec = document.getElementById('portrait-zoom-dec');
  const zoomInc = document.getElementById('portrait-zoom-inc');
  const zoomReset = document.getElementById('portrait-zoom-reset');
  const zoomControls = document.querySelector('.portrait-zoom');
  let portraitZoom = 1;

  function updatePortraitZoom() {
    portraitImg.style.transform = `scale(${portraitZoom})`;
    zoomReset.textContent = `${Math.round(portraitZoom * 100)}%`;
    const offset = portraitImg.offsetHeight * (portraitZoom - 1);
    zoomControls.style.marginTop = `${offset}px`;
  }

  zoomDec.addEventListener('click', () => {
    portraitZoom = Math.max(0.1, portraitZoom - 0.1);
    updatePortraitZoom();
  });

  zoomInc.addEventListener('click', () => {
    portraitZoom += 0.1;
    updatePortraitZoom();
  });

  zoomReset.addEventListener('click', () => {
    portraitZoom = 1;
    updatePortraitZoom();
  });

  if (portraitImg.complete) updatePortraitZoom();
  else portraitImg.addEventListener('load', updatePortraitZoom);
  document.getElementById('delete-character').addEventListener('click', () => {
    delete currentProfile.characters[c.id];
    currentProfile.lastCharacter = null;
    currentCharacter = null;
    saveProfiles();
    showMainUI();
  });
}

function showSpellDetails(spell) {
  if (!spell) return;
  const overlay = document.createElement('div');
  overlay.className = 'spell-detail-modal';
  const content = document.createElement('div');
  content.className = 'spell-detail-content';
  const desc = `${spell.type} - ${spell.target}`;
  content.innerHTML = `<h3>${spell.name}</h3><p>${desc}</p><p>${spell.description}</p><p>Element: ${spell.element}</p><p>School: ${spell.school}</p><p>Base Power: ${spell.basePower}</p><p>MP Cost: ${spell.mpCost}</p>`;
  const close = document.createElement('button');
  close.textContent = 'Close';
  close.addEventListener('click', () => overlay.remove());
  content.appendChild(close);
  overlay.appendChild(content);
  document.body.appendChild(overlay);
}

function showSpellbookUI() {
  if (!currentCharacter) return;
  updateScale();
  showBackButton();

  const classAliases = getClassAliases(currentCharacter);
  const allowSummoning = classAliases.has('summoner');
  const unlocked = [];
  for (const spell of SPELLBOOK) {
    if (!allowSummoning && spell.school === 'Summoning') {
      continue;
    }
    const schoolKey = schoolProficiencyMap[spell.school];
    const schoolValue = currentCharacter[schoolKey] ?? 0;
    const profKey = elementalProficiencyMap[spell.element.toLowerCase()];
    const elemValue = currentCharacter[profKey] ?? 0;
    // Default spells have a proficiency requirement of 0. They should only
    // unlock once the character has at least some proficiency in both the
    // associated element and school. Treat 0 as requiring a minimum of 1.
    const req = Math.max(spell.proficiency, 1);
    if (elemValue >= req && schoolValue >= req) {
      unlocked.push(spell);
    }
  }

  const filtered = unlocked.filter(
    s => (spellFilters.elements[s.element] ?? true) && (spellFilters.schools[s.school] ?? true)
  );

  const unlockedElements = new Set(unlocked.map(s => s.element));
  const unlockedSchools = new Set(unlocked.map(s => s.school));

  filtered.sort((a, b) => {
    if (a.proficiency !== b.proficiency) return a.proficiency - b.proficiency;
    const ai = elementOrder.indexOf(a.element);
    const bi = elementOrder.indexOf(b.element);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  let html = '<div class="spellbook-screen">';

  const allFiltersActive =
    Object.values(spellFilters.elements).every(Boolean) &&
    Object.values(spellFilters.schools).every(Boolean);

  let filterHtml = '<div class="spellbook-filters">';
  const masterCls = allFiltersActive ? 'filter-toggle' : 'filter-toggle off';
  const masterIcon = allFiltersActive
    ? '<img src="assets/images/icons/Magic/On.png" alt="Filters On" />'
    : '<img src="assets/images/icons/Magic/Off.png" alt="Filters Off" />';
  filterHtml += `<button class="${masterCls}" data-filter-type="all" aria-label="Toggle Filters">${masterIcon}</button>`;
  if (unlockedElements.size) {
    filterHtml += '<div class="filter-group">';
    elementOrder.forEach(el => {
      if (!unlockedElements.has(el)) return;
      const eIcon = elementIcons[el] || '';
      const active = spellFilters.elements[el];
      const cls = active ? 'filter-toggle' : 'filter-toggle off';
      filterHtml += `<button class="${cls}" data-filter-type="element" data-filter="${el}" aria-label="${el}">${eIcon}</button>`;
    });
    filterHtml += '</div>';
  }
  if (unlockedSchools.size) {
    filterHtml += '<div class="filter-group">';
    Object.keys(schoolIcons).forEach(sc => {
      if (!unlockedSchools.has(sc)) return;
      const sIcon = schoolIcons[sc];
      const active = spellFilters.schools[sc];
      const cls = active ? 'filter-toggle' : 'filter-toggle off';
      filterHtml += `<button class="${cls}" data-filter-type="school" data-filter="${sc}" aria-label="${sc}">${sIcon}</button>`;
    });
    filterHtml += '</div>';
  }
  filterHtml += '</div>';

  html += filterHtml;

  html += '<div class="spellbook-list"><h1><img src="assets/images/icons/Magic/Spellbook.png" alt="Spellbook" class="spellbook-icon"></h1>';
  if (filtered.length) {
    html += '<ul class="spell-list">';
    filtered.forEach(spell => {
      const eIcon = elementIcons[spell.element] || '';
      const sIcon = schoolIcons[spell.school] || '';
      html += `<li class="spell-item"><button class="spell-name" data-spell-id="${spell.id}">${spell.name}<span class="element-icon">${eIcon}</span><span class="school-icon">${sIcon}</span></button></li>`;
    });
    html += '</ul>';
  } else {
    html += '<p>No spells known.</p>';
  }
  html += '</div></div>';

  setMainHTML(html);

  document.querySelectorAll('.spell-name').forEach(btn => {
    const id = btn.dataset.spellId;
    const spell = SPELLBOOK.find(s => s.id === id);
    btn.addEventListener('click', () => showSpellDetails(spell));
  });

  document.querySelectorAll('.filter-toggle').forEach(btn => {
    const type = btn.dataset.filterType;
    let longPress = false;
    if (type !== 'all') {
      let timer;
      let lastTap = 0;
      const start = () => {
        longPress = false;
        timer = setTimeout(() => {
          longPress = true;
          handleFilterLongPress(type, btn.dataset.filter);
        }, 500);
      };
      const cancel = () => clearTimeout(timer);
      btn.addEventListener('mousedown', start);
      btn.addEventListener('touchstart', start);
      ['mouseup', 'mouseleave', 'touchend'].forEach(ev =>
        btn.addEventListener(ev, cancel)
      );
      btn.addEventListener('dblclick', () => {
        longPress = true;
        handleFilterLongPress(type, btn.dataset.filter);
      });
      btn.addEventListener('touchend', e => {
        const now = Date.now();
        const tapLen = now - lastTap;
        if (tapLen > 0 && tapLen < 300) {
          longPress = true;
          handleFilterLongPress(type, btn.dataset.filter);
          e.preventDefault();
        }
        lastTap = now;
      });
    }
    btn.addEventListener('click', () => {
      if (longPress) return;
      if (type === 'all') {
        const allActive =
          Object.values(spellFilters.elements).every(Boolean) &&
          Object.values(spellFilters.schools).every(Boolean);
        const newState = !allActive;
        Object.keys(spellFilters.elements).forEach(
          e => (spellFilters.elements[e] = newState)
        );
        Object.keys(spellFilters.schools).forEach(
          s => (spellFilters.schools[s] = newState)
        );
      } else {
        const key = btn.dataset.filter;
        spellFilters[type + 's'][key] = !spellFilters[type + 's'][key];
      }
      showSpellbookUI();
    });
  });
}

function showProficienciesUI() {
  if (!currentCharacter) return;
  showBackButton();
  const profCap = proficiencyCap(currentCharacter.level);
  let html = '<div class="proficiencies-screen">';
  for (const [type, list] of Object.entries(proficiencyCategories)) {
    const items = list.filter(key => (currentCharacter[key] ?? 0) > 0);
    if (!items.length) continue;
    html += '<section class="proficiency-section">';
    html += `<h2>${type}</h2>`;
    html += '<ul class="proficiency-list">';
    items.forEach(key => {
      const value = currentCharacter[key] ?? 0;
      const name = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      const capped = value >= 100 ? ' capped' : '';
      html += `<li class="proficiency-item"><span class="proficiency-name">${name}</span><span class="proficiency-value${capped}" data-cap="${profCap}">${value}</span></li>`;
    });
    html += '</ul></section>';
  }
  html += '</div>';
  setMainHTML(html);
  normalizeProficiencyNameWidths();
  setupProficiencyTooltips();
}

let capTooltipEl = null;
let capTooltipTimer = null;

function setupProficiencyTooltips() {
  const values = main.querySelectorAll('.proficiency-value');
  values.forEach(v => {
    v.addEventListener('click', showCapTooltip);
    v.addEventListener('mouseenter', showCapTooltip);
    v.addEventListener('touchstart', showCapTooltip);
  });
}

function showCapTooltip(e) {
  e.stopPropagation();
  const cap = e.currentTarget.dataset.cap;
  if (!cap) return;
  removeCapTooltip();
  capTooltipEl = document.createElement('div');
  capTooltipEl.className = 'cap-tooltip';
  capTooltipEl.textContent = `Cap: ${cap}`;
  document.body.appendChild(capTooltipEl);
  const rect = e.currentTarget.getBoundingClientRect();
  capTooltipEl.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
  capTooltipEl.style.top = `${rect.top + window.scrollY}px`;
  capTooltipTimer = setTimeout(removeCapTooltip, 10000);
}

function removeCapTooltip() {
  if (capTooltipEl) {
    capTooltipEl.remove();
    capTooltipEl = null;
  }
  if (capTooltipTimer) {
    clearTimeout(capTooltipTimer);
    capTooltipTimer = null;
  }
}

document.addEventListener('click', removeCapTooltip);

let animalsCatalogPromise = null;
let animalsCatalogData = null;
let animalsCatalogFailed = false;
let animalsCatalogIndex = null;
let animalsCatalogIndexSource = null;
let plantsCatalogPromise = null;
let plantsCatalogData = null;
let plantsCatalogFailed = false;
let plantsCatalogIndex = null;
let plantsCatalogIndexSource = null;

function buildCatalogIndex(entries) {
  const map = new Map();
  if (!Array.isArray(entries)) return map;
  entries.forEach(entry => {
    if (!entry || typeof entry !== 'object') return;
    const id = entry.id;
    if (id == null) return;
    map.set(id, entry);
  });
  return map;
}

function ensureAnimalsCatalogIndex() {
  if (!animalsCatalogIndex || animalsCatalogIndexSource !== animalsCatalogData) {
    animalsCatalogIndex = buildCatalogIndex(animalsCatalogData);
    animalsCatalogIndexSource = animalsCatalogData;
  }
  return animalsCatalogIndex;
}

function ensurePlantsCatalogIndex() {
  if (!plantsCatalogIndex || plantsCatalogIndexSource !== plantsCatalogData) {
    plantsCatalogIndex = buildCatalogIndex(plantsCatalogData);
    plantsCatalogIndexSource = plantsCatalogData;
  }
  return plantsCatalogIndex;
}

function loadAnimalsCatalog() {
  if (!animalsCatalogPromise) {
    animalsCatalogFailed = false;
    animalsCatalogPromise = fetch('data/animals.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load animals catalog (${res.status})`);
        return res.json();
      })
      .then(data => {
        animalsCatalogData = Array.isArray(data) ? data : [];
        animalsCatalogIndex = buildCatalogIndex(animalsCatalogData);
        animalsCatalogIndexSource = animalsCatalogData;
        return animalsCatalogData;
      })
      .catch(err => {
        console.error('Failed to load animals catalog', err);
        animalsCatalogFailed = true;
        animalsCatalogPromise = null;
        animalsCatalogData = [];
        animalsCatalogIndex = buildCatalogIndex(animalsCatalogData);
        animalsCatalogIndexSource = animalsCatalogData;
        return animalsCatalogData;
      });
  }
  return animalsCatalogPromise;
}

function loadPlantsCatalog() {
  if (!plantsCatalogPromise) {
    plantsCatalogFailed = false;
    plantsCatalogPromise = fetch('data/plants.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load plants catalog (${res.status})`);
        return res.json();
      })
      .then(data => {
        plantsCatalogData = Array.isArray(data) ? data : [];
        plantsCatalogIndex = buildCatalogIndex(plantsCatalogData);
        plantsCatalogIndexSource = plantsCatalogData;
        return plantsCatalogData;
      })
      .catch(err => {
        console.error('Failed to load plants catalog', err);
        plantsCatalogFailed = true;
        plantsCatalogPromise = null;
        plantsCatalogData = [];
        plantsCatalogIndex = buildCatalogIndex(plantsCatalogData);
        plantsCatalogIndexSource = plantsCatalogData;
        return plantsCatalogData;
      });
  }
  return plantsCatalogPromise;
}

function normalizeCodexRecord(value, fallbackId) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = { ...value };
    if (!record.id && fallbackId) record.id = fallbackId;
    let levelSource = record.studyLevel;
    if (levelSource == null) levelSource = record.level;
    const level = Number.parseInt(levelSource, 10);
    record.studyLevel = Number.isNaN(level) ? 1 : Math.max(0, level);
    return record;
  }
  if (typeof value === 'number') {
    return { id: fallbackId, studyLevel: Math.max(0, value) };
  }
  if (typeof value === 'boolean') {
    return { id: fallbackId, studyLevel: value ? 1 : 0 };
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    return { id: fallbackId, studyLevel: Number.isNaN(parsed) ? 1 : Math.max(0, parsed) };
  }
  return { id: fallbackId, studyLevel: 1 };
}

function normalizeCodexCategory(category) {
  if (!category) return {};
  const normalized = {};
  if (Array.isArray(category)) {
    category.forEach(entry => {
      if (!entry) return;
      if (typeof entry === 'string') {
        normalized[entry] = normalizeCodexRecord(1, entry);
      } else if (typeof entry === 'object') {
        const id = entry.id || entry.name;
        if (!id) return;
        normalized[id] = normalizeCodexRecord(entry, id);
      }
    });
    return normalized;
  }
  if (typeof category === 'object') {
    Object.entries(category).forEach(([key, value]) => {
      if (!key) return;
      const id =
        value && typeof value === 'object' && !Array.isArray(value) && value.id
          ? value.id
          : key;
      normalized[key] = normalizeCodexRecord(value, id);
    });
    return normalized;
  }
  if (typeof category === 'string') {
    normalized[category] = normalizeCodexRecord(1, category);
    return normalized;
  }
  return normalized;
}

function ensureCollections(character) {
  if (!character) return { animals: {}, plants: {} };
  const existing =
    character.collections && typeof character.collections === 'object'
      ? character.collections
      : {};
  const normalized = {
    animals: normalizeCodexCategory(existing.animals),
    plants: normalizeCodexCategory(existing.plants),
  };
  character.collections = normalized;
  return normalized;
}

const REPEATABLE_QUEST_STATUSES = new Set(['abandoned', 'failed', 'expired', 'declined']);
const ACTIVE_QUEST_STATUSES = new Set(['accepted', 'in_progress']);
const COMPLETED_QUEST_STATUSES = new Set(['completed', 'failed', 'abandoned', 'expired']);

function ensureQuestLog(character) {
  if (!character) return [];
  let log = Array.isArray(character.questLog) ? character.questLog : [];
  log = log
    .filter(entry => entry && typeof entry === 'object')
    .map(entry => ({
      key: typeof entry.key === 'string' ? entry.key : questKey(entry.board || '', entry.title || ''),
      board: entry.board || null,
      title: entry.title || '',
      acceptedOn: entry.acceptedOn || null,
      acceptedOnLabel: entry.acceptedOnLabel || entry.acceptedOn || null,
      status: entry.status || 'accepted',
      location: entry.location || null,
      completedOn: entry.completedOn || null,
      completedOnLabel: entry.completedOnLabel || entry.completedOn || null,
      outcome: entry.outcome || null,
      reward: entry.reward || null,
      notes: entry.notes || null,
      npc: entry.npc || null,
      timesCompleted: Number.isFinite(entry.timesCompleted)
        ? entry.timesCompleted
        : 0,
    }));
  character.questLog = log;
  return log;
}

function ensureQuestHistory(character) {
  if (!character) return [];
  const history = Array.isArray(character.questHistory) ? character.questHistory : [];
  const normalized = history
    .filter(entry => entry && typeof entry === 'object')
    .map(entry => ({
      key: entry.key || null,
      title: entry.title || '',
      board: entry.board || null,
      location: entry.location || null,
      nearestCity: deriveNearestCity(entry.location || entry.board || ''),
      npc: entry.npc || null,
      outcome: entry.outcome || null,
      success: Boolean(entry.success),
      reward: entry.reward || null,
      narrative: entry.narrative || '',
      date: entry.date || null,
      dateLabel: entry.dateLabel || entry.date || null,
      hours: Number.isFinite(entry.hours) ? entry.hours : null,
      timeOfDay: Number.isFinite(entry.timeOfDay) ? entry.timeOfDay : null,
      daysElapsed: Number.isFinite(entry.daysElapsed) ? entry.daysElapsed : null,
    }));
  character.questHistory = normalized;
  return normalized;
}

function normalizeActionLogEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }
  const id = typeof entry.id === 'string' && entry.id.trim() ? entry.id : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const kind = entry.kind === 'environment' ? 'environment' : 'message';
  const city = findCityByName(entry.city || '') || (entry.city || null);
  const district = entry.district || null;
  const building = entry.building || null;
  const locationLabelParts = [];
  if (building) locationLabelParts.push(building);
  if (district) locationLabelParts.push(district);
  if (city) locationLabelParts.push(city);
  const locationLabel = entry.locationLabel || (locationLabelParts.length ? locationLabelParts.join(' · ') : null);
  return {
    id,
    kind,
    title: entry.title || 'Event',
    description: entry.description || '',
    outcome: entry.outcome || null,
    success: entry.success === true ? true : entry.success === false ? false : null,
    partialSuccess: Boolean(entry.partialSuccess),
    tone: entry.tone || null,
    date: entry.date || null,
    season: entry.season || null,
    timeLabel: entry.timeLabel || null,
    clock: entry.clock || null,
    weather: entry.weather || null,
    city,
    district,
    building,
    locationLabel,
  };
}

function ensureActionLog(character) {
  if (!character) return [];
  const raw = Array.isArray(character.actionLog) ? character.actionLog : [];
  const normalized = raw
    .map(normalizeActionLogEntry)
    .filter(Boolean);
  character.actionLog = normalized.slice(0, ACTION_LOG_STORAGE_LIMIT);
  return character.actionLog;
}

function ensureCharacterClock(character) {
  if (!character) return 0;
  const hours = Number(character.timeOfDay);
  if (!Number.isFinite(hours) || hours < 0) {
    character.timeOfDay = 8;
  } else if (hours >= 24) {
    character.timeOfDay = hours % 24;
  } else {
    character.timeOfDay = hours;
  }
  return character.timeOfDay;
}

function advanceCharacterTime(hours = 0, options = {}) {
  if (!currentCharacter) {
    return { days: 0, timeOfDay: 0 };
  }
  ensureCharacterClock(currentCharacter);
  ensureHoursAwake(currentCharacter);
  const increment = Number(hours);
  if (!Number.isFinite(increment) || increment <= 0) {
    return { days: 0, timeOfDay: currentCharacter.timeOfDay };
  }
  let total = currentCharacter.timeOfDay + increment;
  let days = 0;
  while (total >= 24) {
    total -= 24;
    days += 1;
  }
  currentCharacter.timeOfDay = Math.max(0, Math.min(24, Math.round(total * 100) / 100));
  const countsAsAwake = options.countsAsAwake !== false;
  if (countsAsAwake) {
    currentCharacter.hoursAwake = Math.round((currentCharacter.hoursAwake + increment) * 100) / 100;
  } else {
    currentCharacter.hoursAwake = Math.max(
      0,
      Math.round((currentCharacter.hoursAwake - increment) * 100) / 100,
    );
  }
  if (days > 0) {
    worldCalendar.advance(days);
  }
  return { days, timeOfDay: currentCharacter.timeOfDay };
}

function describeTimeOfDay(hour) {
  if (!Number.isFinite(hour)) return 'day';
  const h = ((hour % 24) + 24) % 24;
  if (h < 4) return 'deep night';
  if (h < 6) return 'pre-dawn darkness';
  if (h < 9) return 'early morning';
  if (h < 12) return 'late morning';
  if (h < 15) return 'early afternoon';
  if (h < 18) return 'late afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

function formatClockTime(hour) {
  if (!Number.isFinite(hour)) return '—';
  let normalized = ((hour % 24) + 24) % 24;
  let wholeHours = Math.floor(normalized);
  let minutes = Math.round((normalized - wholeHours) * 60);
  if (minutes === 60) {
    minutes = 0;
    wholeHours = (wholeHours + 1) % 24;
  }
  const hoursText = String(wholeHours).padStart(2, '0');
  const minutesText = String(minutes).padStart(2, '0');
  return `${hoursText}:${minutesText}`;
}

function questValueToList(value) {
  if (Array.isArray(value)) {
    return value.flatMap(item => questValueToList(item)).filter(Boolean);
  }
  if (value && typeof value === 'object') {
    const fields = ['text', 'description', 'label', 'title', 'name', 'notes', 'summary'];
    for (const field of fields) {
      if (value[field] != null) {
        const collected = questValueToList(value[field]);
        if (collected.length) return collected;
      }
    }
    return [String(value)];
  }
  if (value == null) return [];
  return [String(value)];
}

function questValueToText(value, joiner = ', ') {
  const parts = questValueToList(value);
  return parts.join(joiner);
}

function questStringsFrom(value, max = Infinity) {
  const list = questValueToList(value)
    .map(entry => (entry == null ? '' : String(entry).trim()))
    .filter(Boolean);
  return Number.isFinite(max) ? list.slice(0, max) : list;
}

function questSkillRequirementStrings(quest, max = Infinity) {
  if (!quest || !Array.isArray(quest.skillRequirements)) return [];
  const list = quest.skillRequirements
    .map(req => (req && req.raw ? String(req.raw).trim() : ''))
    .filter(Boolean);
  return Number.isFinite(max) ? list.slice(0, max) : list;
}

function joinWithConjunction(list, conjunction = 'and') {
  if (!Array.isArray(list) || list.length === 0) return '';
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} ${conjunction} ${list[1]}`;
  const head = list.slice(0, -1).join(', ');
  const tail = list[list.length - 1];
  return `${head}, ${conjunction} ${tail}`;
}

function titleCaseWords(text) {
  if (!text) return '';
  return String(text)
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function lowercaseFirst(text) {
  if (!text) return '';
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function describeQuestTravelFlavor(story) {
  const lines = [];
  if (!story) return lines;
  const destination = story.destination || {};
  const quest = story.quest || {};
  const binding = destination.binding || {};
  const region = binding.region ? titleCaseWords(binding.region) : null;
  const habitat = binding.habitat ? titleCaseWords(binding.habitat) : null;
  if (region && habitat) {
    lines.push(`The contract is registered through the ${region} offices for ${habitat.toLowerCase()} work.`);
  } else if (region) {
    lines.push(`The posting originates with the ${region} charter office.`);
  } else if (habitat) {
    lines.push(`Briefings warn that ${habitat.toLowerCase()} conditions shape the assignment.`);
  }
  const district = destination.district && destination.district !== story?.previousPosition?.district
    ? destination.district
    : null;
  if (district) {
    lines.push(`You weave through the ${district} district toward the work site.`);
  }
  const conditions = questStringsFrom(quest.conditions, 1);
  if (conditions.length) {
    lines.push(`Job notes flag ongoing conditions: ${conditions[0]}.`);
  }
  const risks = questStringsFrom(quest.risks, 1);
  if (risks.length) {
    lines.push(`Risk alerts cite ${risks[0]}.`);
  }
  const timeline = questStringsFrom(quest.timeline, 1);
  if (timeline.length) {
    lines.push(`Schedule guidance: ${timeline[0]}.`);
  }
  return lines;
}

function describeQuestBriefingFlavor(story) {
  const lines = [];
  if (!story) return lines;
  const quest = story.quest || {};
  if (quest.issuer) {
    lines.push(`They speak on behalf of ${quest.issuer}.`);
  }
  const timeline = questStringsFrom(quest.timeline, 1);
  if (timeline.length) {
    lines.push(`Timing focus: ${timeline[0]}.`);
  }
  const skillReqs = questSkillRequirementStrings(quest, 3);
  const genericReqs = questStringsFrom(quest.requirements, 3);
  const requirements = skillReqs.length ? skillReqs : genericReqs;
  if (requirements.length) {
    lines.push(`They stress ${joinWithConjunction(requirements, 'and')}.`);
  }
  const risks = questStringsFrom(quest.risks, 2);
  if (risks.length) {
    lines.push(`Known complications include ${joinWithConjunction(risks, 'and')}.`);
  }
  const notes = questStringsFrom(quest.notes, 1);
  if (notes.length) {
    lines.push(notes[0]);
  }
  return lines;
}

function describeQuestApproachFlavor(story) {
  const lines = [];
  if (!story) return lines;
  const quest = story.quest || {};
  const conditions = questStringsFrom(quest.conditions, 2);
  if (conditions.length) {
    lines.push(`Working conditions: ${joinWithConjunction(conditions, 'and')}.`);
  }
  const risks = questStringsFrom(quest.risks, 2);
  if (risks.length) {
    lines.push(`Crew warnings: ${joinWithConjunction(risks, 'and')}.`);
  }
  const skillReqs = questSkillRequirementStrings(quest, 3);
  if (skillReqs.length) {
    lines.push(`Demanded proficiencies: ${joinWithConjunction(skillReqs, 'and')}.`);
  } else {
    const genericReqs = questStringsFrom(quest.requirements, 2);
    if (genericReqs.length) {
      lines.push(`Expect to prove ${joinWithConjunction(genericReqs, 'and')}.`);
    }
  }
  if (quest.highPriority) {
    lines.push('The notice bears a crimson ribbon—guild priority work.');
  }
  if (story.duration?.overnight) {
    lines.push('Overnight rotation protocols are in effect for this posting.');
  }
  return lines;
}

function describeQuestOutcomeFlavor(story, success, choice) {
  const lines = [];
  if (!story) return lines;
  const quest = story.quest || {};
  const approach = choice?.label ? lowercaseFirst(choice.label.replace(/[.]+$/, '')) : null;
  if (approach) {
    lines.push(success
      ? `Your choice to ${approach} proves sound as the crew follows your lead.`
      : `Your plan to ${approach} struggles against the day's demands.`);
  }
  const risks = questStringsFrom(quest.risks, 2);
  if (success && risks.length) {
    lines.push(`You steer the team clear of ${joinWithConjunction(risks, 'and')}.`);
  } else if (!success && risks.length) {
    lines.push(`${capitalize(risks[0])} overtakes the effort before the shift ends.`);
  }
  const skillReqs = questSkillRequirementStrings(quest, 2);
  if (success && skillReqs.length) {
    lines.push(`Meeting expectations in ${joinWithConjunction(skillReqs, 'and')} earns nods from veterans on site.`);
  } else if (!success && skillReqs.length) {
    lines.push(`Without firmer command of ${joinWithConjunction(skillReqs, 'and')}, the job slips away from you.`);
  }
  const conditions = questStringsFrom(quest.conditions, 2);
  if (conditions.length) {
    lines.push(`Conditions reported: ${joinWithConjunction(conditions, 'and')}.`);
  }
  const notes = questStringsFrom(quest.notes, 1);
  if (notes.length) {
    lines.push(notes[0]);
  }
  if (quest.issuer) {
    lines.push(`${quest.issuer} will expect your account of the shift.`);
  }
  return lines;
}

function extractFirstSentence(text) {
  if (!text) return '';
  const normalized = String(text).replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  const match = normalized.match(/([^.!?]+[.!?])/);
  return match ? match[1].trim() : normalized;
}

function determineQuestDuration(quest) {
  const timelineText = questValueToText(quest.timeline, ' ').toLowerCase();
  const descriptionText = (quest.description || '').toLowerCase();
  const combined = `${timelineText} ${descriptionText}`;
  const duration = { hours: 6, label: 'a six-hour shift', overnight: false };
  const hourMatch = combined.match(/(\d+)\s*(?:hour|hr)/);
  if (hourMatch) {
    const parsed = parseInt(hourMatch[1], 10);
    if (Number.isFinite(parsed)) {
      duration.hours = Math.min(Math.max(parsed, 2), 16);
    }
  } else if (/half[-\s]?day/.test(combined)) {
    duration.hours = 5;
  } else if (/(full|whole|entire) day/.test(combined)) {
    duration.hours = 10;
  }
  if (/(overnight|night watch|moonlit|night shift|after dusk|until dawn)/.test(combined)) {
    duration.hours = Math.max(duration.hours, 12);
    duration.overnight = true;
  } else if (/(dawn|sunrise|morning)/.test(combined)) {
    duration.hours = Math.min(duration.hours, 4);
  } else if (/(afternoon|midday|sunset)/.test(combined)) {
    duration.hours = Math.max(duration.hours, 5);
  }
  if (!duration.label) {
    const hours = duration.hours;
    if (duration.overnight) {
      duration.label = 'an overnight vigil';
    } else if (hours <= 3) {
      duration.label = `${hours}-hour shift`;
    } else if (hours <= 6) {
      duration.label = `about ${hours} hours of work`;
    } else if (hours <= 10) {
      duration.label = `most of the day (${hours} hours)`;
    } else {
      duration.label = `a long ${hours}-hour effort`;
    }
  }
  return duration;
}

function inferQuestNpcRole(quest, destination) {
  const context = `${questValueToText(quest.timeline, ' ')} ${questValueToText(quest.description, ' ')}`.toLowerCase();
  const locationText = (destination?.label || '').toLowerCase();
  const roles = [
    { match: /(harvest|orchard|farm|field|gather)/, role: 'Harvest Steward', station: 'commoner' },
    { match: /(guard|watch|patrol|barracks|garrison)/, role: 'Watch Sergeant', station: 'military' },
    { match: /(forge|smith|anvil|workshop|craft)/, role: 'Master Artisan', station: 'artisan' },
    { match: /(temple|shrine|prayer|rite|ritual)/, role: 'Ritual Acolyte', station: 'clergy' },
    { match: /(ship|dock|sail|naval|pier)/, role: 'Dock Foreman', station: 'guild' },
    { match: /(inn|tavern|kitchen|cook)/, role: 'House Steward', station: 'commoner' },
  ];
  for (const candidate of roles) {
    if (candidate.match.test(context) || candidate.match.test(locationText)) {
      return candidate;
    }
  }
  return { role: 'Quest Overseer', station: 'guild' };
}

function findQuestDestination(quest, boardName) {
  const binding = resolveQuestBinding(quest, boardName);
  const cityName = currentCharacter?.location || Object.keys(CITY_NAV)[0] || null;
  const cityData = cityName ? CITY_NAV[cityName] : null;
  const desired = (quest.location || binding.business || binding.board || boardName || '').trim();
  const normalizedDesired = desired.toLowerCase();
  let matchedDistrict = null;
  let matchedBuilding = desired || null;
  let matchedPoint = null;
  if (cityData) {
    for (const [districtName, district] of Object.entries(cityData.districts || {})) {
      for (const point of district.points || []) {
        const target = (point.target || point.name || '').trim();
        if (!target) continue;
        const normalizedTarget = target.toLowerCase();
        if (
          normalizedDesired &&
          (normalizedTarget === normalizedDesired || normalizedDesired.includes(normalizedTarget) || normalizedTarget.includes(normalizedDesired))
        ) {
          matchedDistrict = districtName;
          matchedBuilding = target;
          matchedPoint = point;
          break;
        }
      }
      if (matchedPoint) break;
    }
  }
  if (!matchedDistrict) {
    const alias = QUEST_DISTRICT_ALIASES[binding?.district] || binding?.district || null;
    matchedDistrict = alias || currentCharacter?.position?.district || null;
  }
  return {
    city: cityName,
    district: matchedDistrict,
    building: matchedBuilding,
    label: matchedBuilding || matchedDistrict || desired || boardName,
    point: matchedPoint,
    binding,
  };
}

function calculateTravelHours(destination) {
  if (!currentCharacter || !destination) return 0.5;
  const pos = currentCharacter.position || {};
  if (pos.city && destination.city && pos.city !== destination.city) {
    return 4;
  }
  if (pos.district && destination.district && pos.district !== destination.district) {
    return 1.5;
  }
  if (pos.building && destination.building && pos.building !== destination.building) {
    return 0.75;
  }
  return 0.5;
}

function generateQuestApproachOptions(quest) {
  const context = `${questValueToText(quest.description, ' ')} ${questValueToText(quest.timeline, ' ')}`.toLowerCase();
  if (/(healer|healing|clinic|infirmary|medicine|medical|apothecary|herbal|alchemist|sick|wound|injur|triage|patients?)/.test(context)) {
    return [
      { key: 'gentle-care', label: 'Tend to patients with gentle bedside care', successMod: 0.12, narrative: 'You steady shaking hands and ease worried folk with practiced words.' },
      { key: 'triage', label: 'Drive the triage line to stabilize the worst cases', successMod: -0.04, narrative: 'You push the crew to focus on the direst wounds first, working under pressure.' },
      { key: 'brew-tonics', label: 'Brew tonics and salves to keep supplies flowing', successMod: 0.05, narrative: 'You grind herbs and decant tonics so healers never lack for remedies.' },
    ];
  }
  if (/(archive|library|records?|record-keepers?|scrib|research|survey|catalog|index|ledger|clerks?|academ|scholar)/.test(context)) {
    return [
      { key: 'methodical', label: 'Organize the archives methodically', successMod: 0.1, narrative: 'You file folios and cross-check references until the shelves gleam with order.' },
      { key: 'insight', label: 'Hunt for hidden insights between the lines', successMod: -0.03, narrative: 'You chase obscure citations and uncover stray marginalia for the scholars.' },
      { key: 'mentor', label: 'Coach junior scribes through the workflow', successMod: 0.04, narrative: 'You guide apprentices with patient instruction and spare quills.' },
    ];
  }
  if (/(cargo|shipment|warehouse|inventory|logistics|supply|manifest|caravan|freight|barge|stocktake|ledger)/.test(context)) {
    return [
      { key: 'marshal', label: 'Marshal crews to keep cargo moving', successMod: 0.08, narrative: 'You whistle signals and keep the loading lanes clear of confusion.' },
      { key: 'audit', label: 'Audit every crate and tally meticulously', successMod: 0.06, narrative: 'You double-check manifests and stamp each load with official seals.' },
      { key: 'risk-push', label: 'Rush the schedule to beat the tide or caravan', successMod: -0.05, narrative: 'You gamble on speed, stacking pallets high and urging haulers to run.' },
    ];
  }
  if (/(festival|banquet|feast|celebration|procession|hospitality|kitchen|tavern|innkeep|brewing|cook|patrons?)/.test(context)) {
    return [
      { key: 'hosting', label: 'Host guests with polished etiquette', successMod: 0.09, narrative: 'You charm patrons, anticipate needs, and keep the mood bright.' },
      { key: 'hearth', label: 'Hold the hearth together behind the scenes', successMod: 0.04, narrative: 'You juggle ovens, barrels, and supply lines to feed everyone in turn.' },
      { key: 'revel', label: 'Lean into the revelry to lift spirits', successMod: -0.04, narrative: 'You belt songs, pour strong cups, and risk letting discipline fray.' },
    ];
  }
  if (/(ritual|arcane|mage|spell|ward|occult|circle|conjure|summon|sigil|runic)/.test(context)) {
    return [
      { key: 'attune', label: 'Attune the wards with calm focus', successMod: 0.11, narrative: 'You steady the chant and trace sigils until the energies hum in unison.' },
      { key: 'experiment', label: 'Experiment with daring arcane shortcuts', successMod: -0.07, narrative: 'You weave bold variations into the pattern, courting volatile backlash.' },
      { key: 'support-ritual', label: 'Support the ritualists with grounding tasks', successMod: 0.03, narrative: 'You prepare reagents, maintain circles, and guard against stray influences.' },
    ];
  }
  if (/(negotiation|parley|council|delegation|audience|petition|diplom|mediati|envoy|court|noble|magistrate)/.test(context)) {
    return [
      { key: 'protocol', label: 'Uphold strict protocol and decorum', successMod: 0.08, narrative: 'You keep voices civil, cite precedent, and ensure every form is honored.' },
      { key: 'bargain', label: 'Press for bold concessions', successMod: -0.06, narrative: 'You push the talks toward ambitious terms, risking fragile goodwill.' },
      { key: 'whisper', label: 'Work the room with quiet whispers', successMod: 0.04, narrative: 'You share counsel in corners, bridging factions before they clash.' },
    ];
  }
  if (/(trail|scout|tracking|wilderness|forest|wilds|beast|hunt|expedition|ridge|pass|outpost|range|marsh|swamp|bog)/.test(context)) {
    return [
      { key: 'scout', label: 'Scout ahead and mark safe routes', successMod: 0.1, narrative: 'You move ahead of the party, leaving clear signposts for the others to follow.' },
      { key: 'forage', label: 'Forage for supplies to sustain the team', successMod: 0.02, narrative: 'You gather edible shoots and patch gear with wild resources.' },
      { key: 'press-on', label: 'Press deeper to chase the quarry quickly', successMod: -0.05, narrative: 'You urge a fast pace through uncertain ground, accepting higher risk.' },
    ];
  }
  if (/(harvest|gather|orchard|field|crop|garden)/.test(context)) {
    return [
      { key: 'careful', label: 'Pick carefully to protect the crop', successMod: 0.15, narrative: 'You take slow, careful cuts to protect every stem.' },
      { key: 'swift', label: 'Work swiftly to clear as many rows as possible', successMod: -0.05, narrative: 'You hustle through the rows, racing the baskets being filled.' },
      { key: 'support', label: 'Coordinate with the crew and share tips', successMod: 0.05, narrative: 'You call out steady rhythms and help load baskets for the others.' },
    ];
  }
  if (/(guard|patrol|watch|escort|barracks)/.test(context)) {
    return [
      { key: 'vigilant', label: 'Take a vigilant patrol, checking every blind spot', successMod: 0.1, narrative: 'You make extra passes and keep the crew alert at every turn.' },
      { key: 'bold', label: 'Press forward aggressively to deter threats', successMod: -0.05, narrative: 'You push the team into risky ground to flush out anything lurking.' },
      { key: 'tactical', label: 'Plan ambush points and rotate watches smartly', successMod: 0.05, narrative: 'You organize rotations and overlapping patrol routes to cover more ground.' },
    ];
  }
  if (/(forge|smith|workshop|construction|repair|craft|ship)/.test(context)) {
    return [
      { key: 'precise', label: 'Measure twice and craft with precision', successMod: 0.12, narrative: 'You double-check every measurement before hammer meets metal.' },
      { key: 'innovate', label: 'Experiment with faster techniques', successMod: -0.08, narrative: 'You try to streamline the process with risky shortcuts.' },
      { key: 'assist', label: 'Assist coworkers and keep tools ready', successMod: 0.03, narrative: 'You fetch supplies, quench tools, and keep the workflow humming.' },
    ];
  }
  return [
    { key: 'steady', label: 'Keep a steady pace and follow instructions', successMod: 0.1, narrative: 'You follow the overseer’s plan and keep momentum steady.' },
    { key: 'ambitious', label: 'Push to exceed expectations and take initiative', successMod: -0.07, narrative: 'You volunteer for the hardest tasks and try to leave a mark.' },
    { key: 'supportive', label: 'Support your fellow workers and solve problems', successMod: 0.04, narrative: 'You check on others, patching issues before they grow.' },
  ];
}

let activeQuestStoryline = null;

function buildQuestStoryline(quest, boardName, entry) {
  if (!currentCharacter) return null;
  ensureCharacterClock(currentCharacter);
  const destination = findQuestDestination(quest, boardName);
  const npcRole = inferQuestNpcRole(quest, destination);
  const npcName = generateNpcName({ station: npcRole.station, allowReuse: false });
  const duration = determineQuestDuration(quest);
  const travelHours = calculateTravelHours(destination);
  const binding = destination.binding;
  let weatherReport = null;
  try {
    weatherReport = weatherSystem.getDailyWeather(binding?.region || 'waves_break', binding?.habitat || 'urban', worldCalendar.today());
  } catch (err) {
    weatherReport = null;
  }
  return {
    quest,
    boardName,
    entry,
    destination,
    npc: { ...npcName, role: npcRole.role },
    duration,
    travelHours,
    weather: weatherReport,
    createdOn: dateKey(worldCalendar.today()),
    createdOnLabel: worldCalendar.formatCurrentDate(),
    previousPosition: currentCharacter.position ? { ...currentCharacter.position } : null,
    phase: 'travel',
    choices: generateQuestApproachOptions(quest),
    returnContext: null,
    travelTimeSpent: 0,
    resolved: false,
    success: null,
    outcome: null,
    resultLabel: null,
    narrative: [],
    rewardText: questValueToText(quest.reward) || '',
    historyLogged: false,
  };
}

function startQuestStoryline(storyline, context = {}) {
  if (!storyline) return;
  activeQuestStoryline = { ...storyline, returnContext: context.boardContext || context }; // attach context
  if (context.boardName) {
    activeQuestStoryline.boardName = context.boardName;
  }
  renderQuestStoryline();
}

function narrativeParagraphs(lines) {
  return lines
    .filter(line => line != null && String(line).trim().length)
    .map(line => `<p>${escapeHtml(String(line))}</p>`)
    .join('');
}

function renderQuestStoryline() {
  if (!activeQuestStoryline) return;
  showBackButton();
  const story = activeQuestStoryline;
  const title = story.quest?.title || 'Quest';
  const locationLabel = story.destination?.label || story.boardName || 'Quest Location';
  const npcName = story.npc?.fullName || 'the overseer';
  let bodyHTML = '';
  let actions = [];
  if (story.phase === 'travel') {
    const lines = [];
    const origin = story.previousPosition?.building || story.previousPosition?.district || story.previousPosition?.city;
    if (origin) {
      lines.push(`You depart ${origin} and make your way toward ${locationLabel}.`);
    } else {
      lines.push(`You set out toward ${locationLabel}.`);
    }
    if (story.weather) {
      const weatherSummary = story.weather.narrative || formatWeatherSummary(story.weather);
      lines.push(`The weather along the way: ${weatherSummary}`);
    }
    describeQuestTravelFlavor(story).forEach(line => lines.push(line));
    bodyHTML = narrativeParagraphs(lines);
    actions = [
      `<button data-action="quest-storyline-arrive">Arrive at ${escapeHtml(locationLabel)}</button>`,
    ];
  } else if (story.phase === 'briefing') {
    const lines = [];
    lines.push(`${npcName} greets you at ${locationLabel}.`);
    lines.push(`${story.npc.role || 'Overseer'}: "We need help for ${story.duration.label}. Can you spare the time?"`);
    describeQuestBriefingFlavor(story).forEach(line => lines.push(line));
    bodyHTML = narrativeParagraphs(lines);
    actions = [
      '<button data-action="quest-storyline-accept">Accept the shift</button>',
      '<button data-action="quest-storyline-decline">Decline</button>',
    ];
  } else if (story.phase === 'approach') {
    const lines = [];
    lines.push(`${npcName} outlines the tasks for ${story.duration.label}. How will you proceed?`);
    describeQuestApproachFlavor(story).forEach(line => lines.push(line));
    bodyHTML = narrativeParagraphs(lines);
    actions = story.choices.map(choice => `<button data-action="quest-storyline-choice" data-choice="${escapeHtml(choice.key)}">${escapeHtml(choice.label)}</button>`);
  } else if (story.phase === 'results') {
    const outcomeClass = story.success ? 'quest-storyline-outcome-success' : story.outcome === 'declined' ? 'quest-storyline-outcome-declined' : 'quest-storyline-outcome-failed';
    const outcomeLabel = story.resultLabel || (story.success ? 'Success' : 'Failure');
    const lines = [...(story.narrative || [])];
    if (story.rewardText) {
      lines.push(`Reward: ${story.rewardText}`);
    }
    if (story.daysElapsed && story.daysElapsed > 0) {
      lines.push(`Time spent: ${story.daysElapsed} day${story.daysElapsed === 1 ? '' : 's'} of work.`);
    }
    const timeNote = describeTimeOfDay(story.timeAfter);
    if (timeNote) {
      lines.push(`By the ${timeNote}, the assignment is complete.`);
    }
    bodyHTML = `
      <div class="quest-storyline-outcome ${outcomeClass}">${escapeHtml(outcomeLabel)}</div>
      ${narrativeParagraphs(lines)}
    `;
    actions = [
      '<button data-action="quest-storyline-finish">Return to the quest board</button>',
    ];
  }
  setMainHTML(`
    <div class="quest-storyline">
      <header class="quest-storyline-header">
        <h2>${escapeHtml(title)}</h2>
        <p class="quest-storyline-subtitle">${escapeHtml(locationLabel)}</p>
      </header>
      <section class="quest-storyline-body">${bodyHTML}</section>
      <footer class="quest-storyline-actions">${actions.join('')}</footer>
    </div>
  `);
  updateMenuHeight();
  if (main) {
    const arriveBtn = main.querySelector('[data-action="quest-storyline-arrive"]');
    if (arriveBtn) {
      arriveBtn.addEventListener('click', () => {
        const dest = story.destination;
        if (currentCharacter) {
          const prev = currentCharacter.position ? { ...currentCharacter.position } : null;
          const city = dest.city || currentCharacter.location;
          currentCharacter.location = city;
          currentCharacter.position = {
            city,
            district: dest.district || prev?.district || null,
            building: dest.building || null,
            previousDistrict: prev?.district || null,
            previousBuilding: prev?.building || null,
          };
          const travelResult = advanceCharacterTime(story.travelHours || 0);
          story.travelTimeSpent = travelResult.timeOfDay;
          saveProfiles();
          updateTopMenuIndicators();
        }
        story.phase = 'briefing';
        renderQuestStoryline();
      });
    }
    const acceptBtn = main.querySelector('[data-action="quest-storyline-accept"]');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        story.phase = 'approach';
        renderQuestStoryline();
      });
    }
    const declineBtn = main.querySelector('[data-action="quest-storyline-decline"]');
    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        story.success = false;
        story.outcome = 'declined';
        story.resultLabel = 'Declined';
        story.narrative = [`You politely decline the shift offered by ${npcName}.`];
        story.phase = 'results';
        story.resolved = true;
        story.timeAfter = currentCharacter ? currentCharacter.timeOfDay : 0;
        const entry = story.entry;
        if (entry) {
          entry.status = 'declined';
          entry.outcome = 'Declined';
          entry.completedOn = dateKey(worldCalendar.today());
          entry.completedOnLabel = worldCalendar.formatCurrentDate();
          entry.reward = null;
          entry.notes = 'Declined after briefing';
          entry.npc = { name: npcName, role: story.npc.role };
        }
        saveProfiles();
        renderQuestStoryline();
      });
    }
    main.querySelectorAll('[data-action="quest-storyline-choice"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.choice || '';
        resolveQuestOutcome(story, key);
        story.phase = 'results';
        renderQuestStoryline();
      });
    });
    const finishBtn = main.querySelector('[data-action="quest-storyline-finish"]');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        finalizeQuestStoryline(story);
      });
    }
  }
}

function resolveQuestOutcome(story, choiceKey) {
  if (!story || story.resolved) return story;
  const choice = (story.choices || []).find(opt => opt.key === choiceKey) || null;
  let chance = 0.6 + ((currentCharacter?.level || 1) * 0.02);
  if (story.quest?.highPriority) chance -= 0.05;
  if (Array.isArray(story.quest?.skillRequirements) && story.quest.skillRequirements.length) {
    chance -= 0.05;
  }
  if (choice?.successMod) {
    chance += choice.successMod;
  }
  chance = Math.max(0.05, Math.min(0.95, chance));
  const success = Math.random() < chance;
  const hoursWorked = (story.duration?.hours || 0) + (story.travelHours || 0);
  const timeResult = advanceCharacterTime(hoursWorked);
  const afterTime = timeResult.timeOfDay;
  const weatherNote = story.weather?.narrative || '';
  const questSummary = extractFirstSentence(story.quest?.description || '');
  const lines = [];
  if (choice?.narrative) {
    lines.push(choice.narrative);
  } else {
    lines.push(`You throw yourself into the work alongside ${story.npc.fullName}.`);
  }
  if (questSummary) {
    lines.push(questSummary);
  }
  if (weatherNote) {
    lines.push(`Conditions: ${weatherNote}`);
  }
  if (success) {
    lines.push(`The crew finishes the assignment with your help, earning nods from ${story.npc.fullName}.`);
  } else {
    lines.push(`Despite your efforts, complications force ${story.npc.fullName} to revise the plan.`);
  }
  describeQuestOutcomeFlavor(story, success, choice).forEach(line => lines.push(line));
  const rewardStrings = questValueToList(story.quest?.reward);
  let totalIron = 0;
  rewardStrings.forEach(text => {
    const parsed = parseCurrency(text);
    totalIron += toIron(parsed);
  });
  if (success && totalIron > 0 && currentCharacter) {
    const walletIron = toIron(currentCharacter.money || createEmptyCurrency());
    const newWallet = fromIron(walletIron + totalIron);
    currentCharacter.money = { ...createEmptyCurrency(), ...newWallet };
  }
  story.success = success;
  story.outcome = success ? 'completed' : 'failed';
  story.resultLabel = success ? 'Success' : 'Failure';
  story.narrative = lines;
  story.timeAfter = afterTime;
  story.daysElapsed = timeResult.days;
  story.resolved = true;
  const rewardText = questValueToText(story.quest?.reward) || '';
  story.rewardText = success ? rewardText : '';
  const entry = story.entry;
  if (entry) {
    entry.status = story.outcome;
    entry.outcome = story.resultLabel;
    entry.completedOn = dateKey(worldCalendar.today());
    entry.completedOnLabel = worldCalendar.formatCurrentDate();
    entry.reward = story.rewardText;
    entry.notes = choice?.label || null;
    entry.npc = { name: story.npc.fullName, role: story.npc.role };
    entry.location = story.destination?.label || entry.location;
    if (story.success) {
      const prevCount = Number.isFinite(entry.timesCompleted)
        ? entry.timesCompleted
        : 0;
      entry.timesCompleted = prevCount + 1;
    }
  }
  saveProfiles();
  updateTopMenuIndicators();
  return story;
}

function finalizeQuestStoryline(story) {
  if (!story) return;
  if (!story.resolved && story.phase !== 'results') {
    resolveQuestOutcome(story, story.choices?.[0]?.key || 'steady');
  }
  const history = ensureQuestHistory(currentCharacter);
  if (!story.historyLogged) {
    history.push({
      key: story.entry?.key || null,
      title: story.quest?.title || '',
      board: story.boardName || null,
      location: story.destination?.label || null,
      npc: { name: story.npc?.fullName || null, role: story.npc?.role || null },
      outcome: story.resultLabel || null,
      success: Boolean(story.success),
      reward: story.rewardText || null,
      narrative: (story.narrative || []).join('\n'),
      date: dateKey(worldCalendar.today()),
      dateLabel: worldCalendar.formatCurrentDate(),
      hours: (story.duration?.hours || 0) + (story.travelHours || 0),
      timeOfDay: story.timeAfter ?? currentCharacter?.timeOfDay ?? null,
      daysElapsed: story.daysElapsed ?? 0,
    });
    story.historyLogged = true;
  }
  saveProfiles();
  activeQuestStoryline = null;
  const success = Boolean(story.success);
  const message = story.outcome === 'declined'
    ? `You declined “${story.quest?.title || 'Quest'}”.`
    : success
      ? `Quest complete: “${story.quest?.title || 'Quest'}”.${story.rewardText ? ` Reward: ${story.rewardText}.` : ''}`
      : `Quest failed: “${story.quest?.title || 'Quest'}”.`;
  const flash = { type: success ? 'success' : story.outcome === 'declined' ? 'info' : 'error', message };
  const context = story.returnContext || {};
  const targetBoard = context.boardKey || story.boardName || (context.boardName ?? '');
  showQuestBoardDetails(targetBoard, { ...context, flash });
}

function acceptQuest(boardName, questTitle) {
  if (!currentCharacter) {
    return { ok: false, message: 'No active character.' };
  }
  ensureQuestLog(currentCharacter);
  ensureQuestHistory(currentCharacter);
  ensureCharacterClock(currentCharacter);
  const loc = LOCATIONS[currentCharacter.location];
  if (!loc || !loc.questBoards) {
    return { ok: false, message: 'No quest boards found here.' };
  }
  const quests = loc.questBoards[boardName] || [];
  const quest = quests.find(q => q.title === questTitle);
  if (!quest) {
    return { ok: false, message: 'Quest could not be found.' };
  }
  const availability = evaluateQuestAvailability(quest, boardName);
  if (!availability.available) {
    const reason = availability.reason || 'This posting is not accepting adventurers right now.';
    return { ok: false, message: reason };
  }
  const eligibility = evaluateQuestEligibility(quest);
  if (!eligibility.canAccept) {
    const message = eligibility.reasons.length
      ? eligibility.reasons.join(' ')
      : 'You do not meet the requirements.';
    return { ok: false, message };
  }
  const log = ensureQuestLog(currentCharacter);
  const key = questKey(boardName, quest.title || '');
  const existing = log.find(entry => entry.key === key);
  const today = worldCalendar.today();
  const acceptedOn = dateKey(today);
  const acceptedOnLabel = worldCalendar.formatCurrentDate();
  const questLabel = quest.title || 'this quest';
  let entry = null;
  let message = '';
  if (existing) {
    const status = (existing.status || '').toLowerCase();
    if (!REPEATABLE_QUEST_STATUSES.has(status)) {
      const acceptedLabel = existing.acceptedOnLabel || existing.acceptedOn;
      return {
        ok: false,
        message: acceptedLabel
          ? `Already accepted on ${acceptedLabel}.`
          : 'Quest already in your log.',
      };
    }
    existing.status = 'accepted';
    existing.acceptedOn = acceptedOn;
    existing.acceptedOnLabel = acceptedOnLabel;
    existing.location = quest.location || null;
    existing.completedOn = null;
    existing.completedOnLabel = null;
    existing.outcome = null;
    existing.reward = null;
    existing.notes = null;
    existing.npc = null;
    entry = existing;
    message = `“${questLabel}” added back to your quest log.`;
  } else {
    entry = {
      key,
      board: boardName,
      title: quest.title || '',
      acceptedOn,
      acceptedOnLabel,
      status: 'accepted',
      location: quest.location || null,
      completedOn: null,
      completedOnLabel: null,
      outcome: null,
      reward: null,
      notes: null,
      npc: null,
      timesCompleted: 0,
    };
    log.push(entry);
    message = `“${questLabel}” added to your quest log.`;
  }
  saveProfiles();
  const storyline = buildQuestStoryline(quest, boardName, entry);
  return { ok: true, message, entry, storyline };
}

function getStudyLevel(record) {
  if (!record) return 1;
  const level = Number.parseInt(record.studyLevel, 10);
  return Number.isNaN(level) ? 1 : Math.max(0, level);
}

function formatCodexList(items) {
  if (!Array.isArray(items) || !items.length) return '';
  return items.map(item => titleize(item)).join(', ');
}

function formatCodexDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function buildCodexNarrative(text) {
  if (!text) return '';
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => `<p>${escapeHtml(line)}</p>`)
    .join('');
}

function renderCodexScreen({
  title,
  entries,
  selectedId,
  collection,
  onSelect,
  emptyMessage,
  buildDetails,
  banner,
}) {
  if (!entries.length) {
    setMainHTML(`
      <div class="codex-screen">
        <h1>${escapeHtml(title)}</h1>
        <p class="codex-empty">${escapeHtml(emptyMessage || 'No records available.')}</p>
      </div>
    `);
    return;
  }
  const activeId = entries.some(entry => entry.id === selectedId)
    ? selectedId
    : entries[0].id;
  const listItems = entries
    .map(entry => {
      const state = collection[entry.id];
      const level = getStudyLevel(state);
      const name =
        entry.data.common_name ||
        entry.data.commonName ||
        entry.data.name ||
        titleize(entry.id);
      const cls = entry.id === activeId ? 'codex-entry selected' : 'codex-entry';
      return `
        <li class="${cls}" data-id="${escapeHtml(entry.id)}">
          <span class="codex-entry-name">${escapeHtml(name)}</span>
          <span class="codex-entry-study">Lv. ${escapeHtml(level)}</span>
        </li>
      `;
    })
    .join('');
  const selectedEntry = entries.find(entry => entry.id === activeId);
  const detailHTML = buildDetails(selectedEntry, collection[activeId]);
  setMainHTML(`
    <div class="codex-screen">
      <h1>${escapeHtml(title)}</h1>
      ${banner ? `<p class="codex-hint">${escapeHtml(banner)}</p>` : ''}
      <div class="codex-layout">
        <ul class="codex-list">${listItems}</ul>
        ${detailHTML}
      </div>
    </div>
  `);
  if (main) {
    const items = main.querySelectorAll('.codex-entry');
    items.forEach(item => {
      item.addEventListener('click', () => onSelect(item.dataset.id));
    });
  }
}

function buildAnimalDetails(entry, record) {
  const { data, id, missing } = entry;
  const name = data.common_name || data.commonName || data.name || titleize(id);
  const studyLevel = getStudyLevel(record);
  if (missing) {
    return `
      <div class="codex-details">
        <header class="codex-details-header">
          <h2>${escapeHtml(name)}</h2>
          <div class="codex-study">Study Level: ${escapeHtml(studyLevel)}</div>
        </header>
        <p class="codex-empty">Formal records for this creature have not been transcribed yet.</p>
        <p class="codex-hint">Additional insights will unlock as you continue your studies.</p>
      </div>
    `;
  }
  const meta = [];
  if (data.taxon_group) meta.push({ label: 'Classification', value: titleize(data.taxon_group) });
  const regions = formatCodexList(data.regions);
  if (regions) meta.push({ label: 'Regions', value: regions });
  const habitats = formatCodexList(data.habitats);
  if (habitats) meta.push({ label: 'Habitats', value: habitats });
  const diet = formatCodexList(data.diet);
  if (diet) meta.push({ label: 'Diet', value: diet });
  if (data.domestication) {
    const parts = [];
    if (typeof data.domestication.domesticated === 'boolean') {
      parts.push(data.domestication.domesticated ? 'Domesticated' : 'Wild');
    }
    if (data.domestication.notes) parts.push(data.domestication.notes);
    if (parts.length) meta.push({ label: 'Domestication', value: parts.join(' · ') });
  }
  if (data.behavior) {
    const parts = [];
    if (typeof data.behavior.aggressive === 'boolean') {
      parts.push(`Aggressive: ${data.behavior.aggressive ? 'Yes' : 'No'}`);
    }
    if (typeof data.behavior.territorial === 'boolean') {
      parts.push(`Territorial: ${data.behavior.territorial ? 'Yes' : 'No'}`);
    }
    if (data.behavior.risk_to_humans) {
      parts.push(`Risk to Humans: ${titleize(data.behavior.risk_to_humans)}`);
    }
    if (parts.length) meta.push({ label: 'Behavior', value: parts.join(' · ') });
  }
  if (data.edibility) {
    const parts = [];
    if (typeof data.edibility.edible === 'boolean') {
      parts.push(data.edibility.edible ? 'Edible' : 'Inedible');
    }
    const edParts = formatCodexList(data.edibility.parts);
    if (edParts) parts.push(`Parts: ${edParts}`);
    if (data.edibility.preparation_notes) parts.push(data.edibility.preparation_notes);
    if (parts.length) meta.push({ label: 'Edibility', value: parts.join(' · ') });
  }
  const byproducts = formatCodexList(data.byproducts);
  if (byproducts) meta.push({ label: 'Byproducts', value: byproducts });
  const firstEncountered = formatCodexDate(record?.firstEncountered);
  if (firstEncountered) meta.push({ label: 'First Encountered', value: firstEncountered });
  const lastObserved = formatCodexDate(record?.lastObserved);
  if (lastObserved) meta.push({ label: 'Last Observed', value: lastObserved });
  const detailRows = meta
    .map(row => `<dt>${escapeHtml(row.label)}</dt><dd>${escapeHtml(row.value)}</dd>`)
    .join('');
  const narrative = data.narrative ? buildCodexNarrative(data.narrative) : '';
  return `
    <div class="codex-details">
      <header class="codex-details-header">
        <h2>${escapeHtml(name)}</h2>
        <div class="codex-study">Study Level: ${escapeHtml(studyLevel)}</div>
      </header>
      ${detailRows ? `<dl class="codex-detail-grid">${detailRows}</dl>` : ''}
      ${narrative ? `<div class="codex-narrative">${narrative}</div>` : ''}
      <p class="codex-hint">Additional insights will unlock as you continue your studies.</p>
    </div>
  `;
}

function buildPlantDetails(entry, record) {
  const { data, id, missing } = entry;
  const name = data.common_name || data.commonName || data.name || titleize(id);
  const studyLevel = getStudyLevel(record);
  if (missing) {
    return `
      <div class="codex-details">
        <header class="codex-details-header">
          <h2>${escapeHtml(name)}</h2>
          <div class="codex-study">Study Level: ${escapeHtml(studyLevel)}</div>
        </header>
        <p class="codex-empty">Field sketches exist, but this plant's record has not been copied into the herbarium yet.</p>
        <p class="codex-hint">Additional insights will unlock as you continue your studies.</p>
      </div>
    `;
  }
  const meta = [];
  if (data.growth_form) meta.push({ label: 'Growth Form', value: titleize(data.growth_form) });
  const regions = formatCodexList(data.regions);
  if (regions) meta.push({ label: 'Regions', value: regions });
  const habitats = formatCodexList(data.habitats);
  if (habitats) meta.push({ label: 'Habitats', value: habitats });
  if (typeof data.cultivated === 'boolean') {
    meta.push({ label: 'Cultivation', value: data.cultivated ? 'Cultivated' : 'Wild' });
  }
  if (typeof data.edible === 'boolean') {
    meta.push({ label: 'Edibility', value: data.edible ? 'Edible' : 'Inedible' });
  }
  const byproducts = formatCodexList(data.byproducts);
  if (byproducts) meta.push({ label: 'Byproducts', value: byproducts });
  const firstLogged = formatCodexDate(record?.firstEncountered || record?.firstCatalogued);
  if (firstLogged) meta.push({ label: 'First Logged', value: firstLogged });
  const detailRows = meta
    .map(row => `<dt>${escapeHtml(row.label)}</dt><dd>${escapeHtml(row.value)}</dd>`)
    .join('');
  const narrative = data.narrative ? buildCodexNarrative(data.narrative) : '';
  return `
    <div class="codex-details">
      <header class="codex-details-header">
        <h2>${escapeHtml(name)}</h2>
        <div class="codex-study">Study Level: ${escapeHtml(studyLevel)}</div>
      </header>
      ${detailRows ? `<dl class="codex-detail-grid">${detailRows}</dl>` : ''}
      ${narrative ? `<div class="codex-narrative">${narrative}</div>` : ''}
      <p class="codex-hint">Additional insights will unlock as you continue your studies.</p>
    </div>
  `;
}

function showBestiaryUI(selectedId) {
  if (!currentCharacter) return;
  updateScale();
  showBackButton();
  const collections = ensureCollections(currentCharacter);
  const encountered = Object.keys(collections.animals || {});
  if (!encountered.length) {
    setMainHTML(`
      <div class="codex-screen">
        <h1>Bestiary</h1>
        <p class="codex-empty">Encounter creatures in the wild to populate your bestiary.</p>
      </div>
    `);
    return;
  }
  if (animalsCatalogData === null) {
    setMainHTML(`
      <div class="codex-screen">
        <h1>Bestiary</h1>
        <p class="codex-loading">Compiling field notes...</p>
      </div>
    `);
  }
  loadAnimalsCatalog().then(() => {
    const index = ensureAnimalsCatalogIndex();
    const entries = encountered
      .map(id => {
        const data = index.get(id);
        return {
          id,
          data: data || { id, common_name: titleize(id) },
          missing: !data,
        };
      })
      .sort((a, b) => {
        const nameA =
          a.data.common_name || a.data.commonName || a.data.name || titleize(a.id);
        const nameB =
          b.data.common_name || b.data.commonName || b.data.name || titleize(b.id);
        return nameA.localeCompare(nameB);
      });
    renderCodexScreen({
      title: 'Bestiary',
      entries,
      selectedId,
      collection: collections.animals,
      onSelect: id => showBestiaryUI(id),
      emptyMessage: 'No animal records are available yet.',
      buildDetails: (entry, record) => buildAnimalDetails(entry, record),
      banner: animalsCatalogFailed
        ? 'Catalog data could not be retrieved. Showing personal field notes instead.'
        : '',
    });
  });
}

function showHerbariumUI(selectedId) {
  if (!currentCharacter) return;
  updateScale();
  showBackButton();
  const collections = ensureCollections(currentCharacter);
  const recorded = Object.keys(collections.plants || {});
  if (!recorded.length) {
    setMainHTML(`
      <div class="codex-screen">
        <h1>Herbarium</h1>
        <p class="codex-empty">Study flora in the field to unlock entries in your herbarium.</p>
      </div>
    `);
    return;
  }
  if (plantsCatalogData === null) {
    setMainHTML(`
      <div class="codex-screen">
        <h1>Herbarium</h1>
        <p class="codex-loading">Drying specimens...</p>
      </div>
    `);
  }
  loadPlantsCatalog().then(() => {
    const index = ensurePlantsCatalogIndex();
    const entries = recorded
      .map(id => {
        const data = index.get(id);
        return {
          id,
          data: data || { id, common_name: titleize(id) },
          missing: !data,
        };
      })
      .sort((a, b) => {
        const nameA =
          a.data.common_name || a.data.commonName || a.data.name || titleize(a.id);
        const nameB =
          b.data.common_name || b.data.commonName || b.data.name || titleize(b.id);
        return nameA.localeCompare(nameB);
      });
    renderCodexScreen({
      title: 'Herbarium',
      entries,
      selectedId,
      collection: collections.plants,
      onSelect: id => showHerbariumUI(id),
      emptyMessage: 'No plant records are available yet.',
      buildDetails: (entry, record) => buildPlantDetails(entry, record),
      banner: plantsCatalogFailed
        ? 'Herbal archives are unavailable. Displaying personal notes instead.'
        : '',
    });
  });
}

function showBuildingsUI() {
  if (!currentCharacter) return;
  showBackButton();
  const list = currentCharacter.buildings || [];
  let html = '<div class="buildings-screen"><h1>Buildings</h1>';
  if (!list.length) {
    html += '<p>No owned or rented businesses.</p></div>';
  } else {
    html += '<ul>';
    list.forEach(b => {
      const funds = formatCurrency(b.money || createEmptyCurrency());
      html += `<li>${b.name} (${b.location}) - Funds: ${funds} - Cost: ${b.dailyCost} - Profit: ${b.dailyProfit}</li>`;
    });
    html += '</ul></div>';
  }
  setMainHTML(html);
}

function showActionLogUI() {
  updateTopMenuIndicators();
  if (!currentCharacter) return;
  showBackButton();
  const log = ensureActionLog(currentCharacter);
  const uniqueValues = entries => Array.from(new Set(entries.filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const cityOptions = uniqueValues(log.map(entry => entry.city || (entry.locationLabel ? entry.locationLabel.split(' · ').pop() : null)));
  if (actionLogFilterState.city !== 'all' && !cityOptions.includes(actionLogFilterState.city)) {
    actionLogFilterState = { ...actionLogFilterState, city: 'all' };
  }
  const filtered = log.filter(entry => {
    if (actionLogFilterState.type !== 'all' && entry.kind !== actionLogFilterState.type) {
      return false;
    }
    if (actionLogFilterState.outcome === 'success' && entry.success !== true) {
      return false;
    }
    if (actionLogFilterState.outcome === 'failure' && entry.success !== false) {
      return false;
    }
    if (actionLogFilterState.outcome === 'partial' && !entry.partialSuccess) {
      return false;
    }
    if (actionLogFilterState.city !== 'all') {
      const city = entry.city || null;
      if (!city || city !== actionLogFilterState.city) {
        return false;
      }
    }
    return true;
  });

  const buildOutcomeChip = entry => {
    if (entry.partialSuccess) {
      return '<span class="action-log-chip action-log-chip-partial">Partial</span>';
    }
    if (entry.success === true) {
      return '<span class="action-log-chip action-log-chip-success">Success</span>';
    }
    if (entry.success === false) {
      return '<span class="action-log-chip action-log-chip-failure">Failure</span>';
    }
    return entry.outcome
      ? `<span class="action-log-chip">${escapeHtml(entry.outcome)}</span>`
      : '';
  };

  const buildMeta = entry => {
    const parts = [];
    if (entry.date) parts.push(`<span>📅 ${escapeHtml(entry.date)}</span>`);
    if (entry.timeLabel || entry.clock) {
      const label = [entry.timeLabel, entry.clock ? `(${entry.clock})` : null]
        .filter(Boolean)
        .join(' ');
      parts.push(`<span>🕒 ${escapeHtml(label)}</span>`);
    }
    if (entry.locationLabel) parts.push(`<span>📍 ${escapeHtml(entry.locationLabel)}</span>`);
    if (entry.weather) parts.push(`<span>☁️ ${escapeHtml(entry.weather)}</span>`);
    if (entry.season) parts.push(`<span>🍂 ${escapeHtml(entry.season)}</span>`);
    return parts.length ? `<div class="action-log-meta">${parts.join('')}</div>` : '';
  };

  const buildDescription = entry => {
    if (!entry.description) return '';
    return entry.description
      .split(/\n+/)
      .filter(Boolean)
      .map(line => `<p>${escapeHtml(line)}</p>`)
      .join('');
  };

  const list = filtered
    .map(entry => `
      <li class="action-log-entry">
        <div class="action-log-entry-header">
          <h3>${escapeHtml(entry.title || 'Event')}</h3>
          <div class="action-log-chips">
            ${buildOutcomeChip(entry)}
            <span class="action-log-chip action-log-chip-kind">${entry.kind === 'environment' ? 'Environment' : 'Message'}</span>
          </div>
        </div>
        ${buildMeta(entry)}
        ${buildDescription(entry)}
      </li>
    `)
    .join('');

  const typeOptions = [
    { value: 'all', label: 'All events' },
    { value: 'environment', label: 'Environment' },
    { value: 'message', label: 'Messages' },
  ]
    .map(option => `<option value="${option.value}"${option.value === actionLogFilterState.type ? ' selected' : ''}>${escapeHtml(option.label)}</option>`)
    .join('');

  const outcomeOptions = [
    { value: 'all', label: 'All outcomes' },
    { value: 'success', label: 'Success' },
    { value: 'partial', label: 'Partial' },
    { value: 'failure', label: 'Failure' },
  ]
    .map(option => `<option value="${option.value}"${option.value === actionLogFilterState.outcome ? ' selected' : ''}>${escapeHtml(option.label)}</option>`)
    .join('');

  const citySelectOptions = ['all', ...cityOptions]
    .map(value => {
      const label = value === 'all' ? 'All cities' : value;
      const selected = value === actionLogFilterState.city ? ' selected' : '';
      return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(label)}</option>`;
    })
    .join('');

  const html = `
    <div class="action-log-screen">
      <h1>Action Log</h1>
      <div class="action-log-filters">
        <label>
          <span>Event type</span>
          <select id="action-log-filter-type">${typeOptions}</select>
        </label>
        <label>
          <span>Outcome</span>
          <select id="action-log-filter-outcome">${outcomeOptions}</select>
        </label>
        <label>
          <span>City</span>
          <select id="action-log-filter-city">${citySelectOptions}</select>
        </label>
      </div>
      ${filtered.length
        ? `<ul class="action-log-list">${list}</ul>`
        : '<p class="action-log-empty">No actions recorded yet.</p>'}
    </div>
  `;

  setMainHTML(html);
  const filterContainer = document.querySelector('.action-log-filters');
  if (filterContainer) {
    filterContainer.addEventListener('change', event => {
      const select = event.target.closest('select');
      if (!select) return;
      if (select.id === 'action-log-filter-type') {
        actionLogFilterState = { ...actionLogFilterState, type: select.value };
      } else if (select.id === 'action-log-filter-outcome') {
        actionLogFilterState = { ...actionLogFilterState, outcome: select.value };
      } else if (select.id === 'action-log-filter-city') {
        actionLogFilterState = { ...actionLogFilterState, city: select.value };
      }
      showActionLogUI();
    });
  }
  updateMenuHeight();
}

function showQuestLogUI() {
  updateTopMenuIndicators();
  if (!currentCharacter) return;
  showBackButton();
  const questLog = ensureQuestLog(currentCharacter);
  const questHistory = ensureQuestHistory(currentCharacter);
  const uniqueValues = entries => Array.from(new Set(entries.filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const normalizeStatus = status => {
    if (!status) return '';
    const normalized = String(status).toLowerCase();
    if (normalized === 'in_progress') return 'In Progress';
    return titleize(normalized.replace(/_/g, ' '));
  };
  const metaLine = (label, value) => {
    if (value == null || value === '') return '';
    return `<div class="quest-log-meta-line"><span class="quest-log-label">${escapeHtml(label)}:</span> ${escapeHtml(String(value))}</div>`;
  };
  const formatTimesCompleted = entry => {
    const count = Number.isFinite(entry.timesCompleted)
      ? entry.timesCompleted
      : 0;
    if (count <= 0) return '';
    return metaLine('Times Completed', count);
  };
  const buildEntry = entry => {
    const title = escapeHtml(entry.title || 'Quest');
    const lines = [];
    lines.push(metaLine('Board', entry.board || 'Unknown'));
    lines.push(metaLine('Status', normalizeStatus(entry.status)));
    lines.push(metaLine('Accepted', entry.acceptedOnLabel || entry.acceptedOn || ''));
    lines.push(metaLine('Completed', entry.completedOnLabel || entry.completedOn || ''));
    lines.push(metaLine('Outcome', entry.outcome || ''));
    lines.push(metaLine('Reward', entry.reward || ''));
    const repeats = formatTimesCompleted(entry);
    if (repeats) lines.push(repeats);
    const details = lines.filter(Boolean).join('');
    const locationLine = entry.location
      ? metaLine('Location', entry.location)
      : '';
    const npcLine = entry.npc && entry.npc.name
      ? metaLine('Contact', entry.npc.name)
      : '';
    const extra = [locationLine, npcLine].filter(Boolean).join('');
    const allDetails = [details, extra].filter(Boolean).join('');
    return `<li class="quest-log-entry"><h3>${title}</h3>${allDetails ? `<div class="quest-log-meta">${allDetails}</div>` : ''}</li>`;
  };
  const sortByField = (field, fallback = '') => (a, b) => {
    const aField = (a[field] || fallback);
    const bField = (b[field] || fallback);
    return String(bField).localeCompare(String(aField));
  };
  const inProgress = questLog
    .filter(entry => ACTIVE_QUEST_STATUSES.has((entry.status || '').toLowerCase()))
    .sort(sortByField('acceptedOn', ''));
  const completed = questLog
    .filter(entry => COMPLETED_QUEST_STATUSES.has((entry.status || '').toLowerCase()))
    .sort(sortByField('completedOn', ''));
  let html = '<div class="quest-log-screen"><h1>Quest Log</h1>';
  if (!inProgress.length && !completed.length) {
    html += '<p>No quests have been accepted yet.</p>';
  } else {
    html += '<section class="quest-log-section"><h2>In Progress</h2>';
    html += inProgress.length
      ? `<ul class="quest-log-list">${inProgress.map(buildEntry).join('')}</ul>`
      : '<p class="quest-log-empty">No quests in progress.</p>';
    html += '</section>';
    html += '<section class="quest-log-section"><h2>Complete</h2>';
    html += completed.length
      ? `<ul class="quest-log-list">${completed.map(buildEntry).join('')}</ul>`
      : '<p class="quest-log-empty">No completed quests yet.</p>';
    html += '</section>';
  }
  const historyCities = uniqueValues(questHistory.map(entry => entry.nearestCity || entry.location || null));
  if (questHistoryFilterState.city !== 'all' && !historyCities.includes(questHistoryFilterState.city)) {
    questHistoryFilterState = { ...questHistoryFilterState, city: 'all' };
  }
  const historyBoards = uniqueValues(questHistory.map(entry => entry.board || null));
  if (questHistoryFilterState.board !== 'all' && !historyBoards.includes(questHistoryFilterState.board)) {
    questHistoryFilterState = { ...questHistoryFilterState, board: 'all' };
  }

  const filteredHistory = questHistory.filter(entry => {
    if (questHistoryFilterState.city !== 'all') {
      const city = entry.nearestCity || null;
      if (!city || city !== questHistoryFilterState.city) return false;
    }
    if (questHistoryFilterState.board !== 'all') {
      if (!entry.board || entry.board !== questHistoryFilterState.board) return false;
    }
    if (questHistoryFilterState.outcome === 'success' && entry.success !== true) return false;
    if (questHistoryFilterState.outcome === 'failure' && entry.success !== false) return false;
    return true;
  });

  const buildHistoryOutcome = entry => {
    if (entry.success === true) return '<span class="quest-history-chip quest-history-chip-success">Success</span>';
    if (entry.success === false) return '<span class="quest-history-chip quest-history-chip-failure">Failure</span>';
    return entry.outcome
      ? `<span class="quest-history-chip">${escapeHtml(entry.outcome)}</span>`
      : '<span class="quest-history-chip quest-history-chip-unknown">Unknown</span>';
  };

  const buildHistoryMeta = entry => {
    const parts = [];
    if (entry.dateLabel) parts.push(`<span>📅 ${escapeHtml(entry.dateLabel)}</span>`);
    if (entry.location) parts.push(`<span>📍 ${escapeHtml(entry.location)}</span>`);
    if (entry.reward) parts.push(`<span>💰 ${escapeHtml(entry.reward)}</span>`);
    if (entry.npc?.name) parts.push(`<span>🧭 ${escapeHtml(entry.npc.name)}</span>`);
    return parts.length ? `<div class="quest-history-meta">${parts.join('')}</div>` : '';
  };

  const historyList = filteredHistory
    .map(entry => `
      <li class="quest-history-entry">
        <div class="quest-history-header">
          <h3>${escapeHtml(entry.title || 'Quest')}</h3>
          <div class="quest-history-chips">
            ${buildHistoryOutcome(entry)}
            ${entry.board ? `<span class="quest-history-chip quest-history-chip-board">${escapeHtml(entry.board)}</span>` : ''}
          </div>
        </div>
        ${buildHistoryMeta(entry)}
        ${entry.narrative ? `<p class="quest-history-narrative">${escapeHtml(entry.narrative)}</p>` : ''}
      </li>
    `)
    .join('');

  const cityFilterOptions = ['all', ...historyCities]
    .map(value => {
      const label = value === 'all' ? 'All cities' : value;
      const selected = value === questHistoryFilterState.city ? ' selected' : '';
      return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(label)}</option>`;
    })
    .join('');

  const outcomeFilterOptions = [
    { value: 'all', label: 'All outcomes' },
    { value: 'success', label: 'Success' },
    { value: 'failure', label: 'Failure' },
  ]
    .map(option => `<option value="${option.value}"${option.value === questHistoryFilterState.outcome ? ' selected' : ''}>${escapeHtml(option.label)}</option>`)
    .join('');

  const boardFilterOptions = ['all', ...historyBoards]
    .map(value => {
      const label = value === 'all' ? 'All boards' : value;
      const selected = value === questHistoryFilterState.board ? ' selected' : '';
      return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(label)}</option>`;
    })
    .join('');

  html += `
    <section class="quest-history-section">
      <h2>Quest History</h2>
      <div class="quest-history-filters">
        <label>
          <span>Nearest city</span>
          <select id="quest-history-filter-city">${cityFilterOptions}</select>
        </label>
        <label>
          <span>Outcome</span>
          <select id="quest-history-filter-outcome">${outcomeFilterOptions}</select>
        </label>
        <label>
          <span>Quest board</span>
          <select id="quest-history-filter-board">${boardFilterOptions}</select>
        </label>
      </div>
      ${filteredHistory.length
        ? `<ul class="quest-history-list">${historyList}</ul>`
        : '<p class="quest-history-empty">No quest history entries match the selected filters.</p>'}
    </section>
  `;

  html += '</div>';
  setMainHTML(html);
  const historyFilters = document.querySelector('.quest-history-filters');
  if (historyFilters) {
    historyFilters.addEventListener('change', event => {
      const select = event.target.closest('select');
      if (!select) return;
      if (select.id === 'quest-history-filter-city') {
        questHistoryFilterState = { ...questHistoryFilterState, city: select.value };
      } else if (select.id === 'quest-history-filter-outcome') {
        questHistoryFilterState = { ...questHistoryFilterState, outcome: select.value };
      } else if (select.id === 'quest-history-filter-board') {
        questHistoryFilterState = { ...questHistoryFilterState, board: select.value };
      }
      showQuestLogUI();
    });
  }
  updateMenuHeight();
}

function showQuestBoardsUI() {
  updateTopMenuIndicators();
  if (!currentCharacter) return;
  showBackButton();
  ensureQuestLog(currentCharacter);
  const loc = LOCATIONS[currentCharacter.location];
  if (!loc) {
    setMainHTML('<div class="no-character"><h1>No quest boards found.</h1></div>');
    return;
  }
  const { groups } = collectQuestBoardGroups(loc);
  const boardGroups = Array.from(groups.values());
  if (!boardGroups.length) {
    setMainHTML(`<div class="no-character"><h1>No quest boards in ${loc.name}</h1></div>`);
    return;
  }
  boardGroups.sort((a, b) => a.name.localeCompare(b.name));
  const createItem = group => {
    const label = group.name || 'Quest Board';
    const boardAttr = encodeURIComponent(group.key);
    const nameAttr = encodeURIComponent(label);
    const districtAttr = group.district ? ` data-district="${encodeURIComponent(group.district)}"` : '';
    const districtLabel = group.district
      ? `<span class="quest-board-district">${escapeHtml(group.district)}</span>`
      : '';
    return `<div class="nav-item quest-board-item"><button data-board="${boardAttr}" data-name="${nameAttr}"${districtAttr} aria-label="${escapeHtml(label)}"><span class="nav-icon">${NAV_ICONS.quests}</span></button><span class="street-sign">${escapeHtml(label)}${districtLabel ? `${districtLabel}` : ''}</span></div>`;
  };
  const buttons = boardGroups.map(createItem).join('');
  const today = worldCalendar.formatCurrentDate();
  setMainHTML(
    `<div class="navigation"><h2>Quest Boards</h2><p class="quest-date">Today is ${today}</p><div class="option-grid">${buttons}</div></div>`,
  );
  normalizeOptionButtonWidths();
  updateMenuHeight();
  if (main) {
    main.querySelectorAll('.option-grid button').forEach(btn => {
      btn.addEventListener('click', () => {
        const board = btn.dataset.board ? decodeURIComponent(btn.dataset.board) : '';
        if (!board) return;
        const displayName = btn.dataset.name ? decodeURIComponent(btn.dataset.name) : '';
        const district = btn.dataset.district ? decodeURIComponent(btn.dataset.district) : null;
        showQuestBoardDetails(board, {
          onBack: showQuestBoardsUI,
          displayName: displayName || undefined,
          district: district || undefined,
        });
      });
    });
  }
}

function showQuestBoardDetails(boardIdentifier, options = {}) {
  updateTopMenuIndicators();
  if (!currentCharacter) return;
  showBackButton();
  ensureQuestLog(currentCharacter);
  const loc = LOCATIONS[currentCharacter.location];
  if (!loc || !loc.questBoards) {
    setMainHTML(
      `<div class="questboard-detail navigation"><h2>${escapeHtml(boardIdentifier)}</h2><p>No quest boards are available here.</p></div>`,
    );
    updateMenuHeight();
    return;
  }
  const { flash: flashMessage = null, ...context } = options || {};
  const group = findQuestBoardGroup(loc, boardIdentifier, {
    district: context.district,
    building: context.building,
  });
  if (!group) {
    const fallback = escapeHtml(context.displayName || boardIdentifier || 'Quest Board');
    setMainHTML(
      `<div class="questboard-detail navigation"><h2>${fallback}</h2><p>No quest boards are available here.</p></div>`,
    );
    updateMenuHeight();
    return;
  }
  const displayName = context.displayName || group.name || boardIdentifier;
  const detailContext = {
    ...context,
    displayName,
    district: context.district || group.district || null,
    boardKey: group.key,
    boardName: displayName,
  };
  const questLog = ensureQuestLog(currentCharacter);
  const questEntries = [];
  group.boards.forEach(section => {
    section.quests.forEach(entry => {
      questEntries.push({
        quest: entry.quest,
        binding: entry.binding,
        boardName: section.name,
      });
    });
  });
  const evaluations = questEntries.map(entry => {
    const availability = evaluateQuestAvailability(entry.quest, entry.boardName);
    const eligibility = evaluateQuestEligibility(entry.quest);
    const key = questKey(entry.boardName, entry.quest.title || '');
    const logEntry = questLog.find(item => item.key === key) || null;
    return { ...entry, availability, eligibility, logEntry };
  });
  const active = evaluations.filter(entry => entry.availability.available);
  const inactive = evaluations.filter(entry => !entry.availability.available);
  const weatherContext = questEntries.length
    ? boardWeatherSnapshot(
        questEntries.map(entry => entry.quest),
        questEntries[0].boardName,
      )
    : null;
  const primaryBinding = questEntries.length ? questEntries[0].binding : null;

  const sanitizeText = value => {
    if (value == null) return '';
    const replaced = replaceCharacterRefs(String(value), currentCharacter);
    return escapeHtml(replaced);
  };
  const formatListValue = value => {
    if (Array.isArray(value)) {
      return value
        .map(item => formatListValue(item))
        .filter(Boolean)
        .join(', ');
    }
    if (value && typeof value === 'object') {
      const fields = ['name', 'title', 'label', 'description'];
      const text = fields.map(field => value[field]).find(Boolean);
      if (text) return sanitizeText(text);
      return sanitizeText(String(value));
    }
    return sanitizeText(value);
  };
  const formatParagraphs = text => {
    const safe = sanitizeText(text);
    if (!safe) return '';
    const segments = safe
      .split(/(?:\r?\n){2,}/)
      .map(seg => seg.trim())
      .filter(Boolean);
    if (!segments.length) {
      return `<p>${safe.replace(/(?:\r?\n)/g, '<br>')}</p>`;
    }
    return segments
      .map(seg => `<p>${seg.replace(/(?:\r?\n)/g, '<br>')}</p>`)
      .join('');
  };
  const flattenToStrings = value => {
    if (Array.isArray(value)) {
      return value.flatMap(item => flattenToStrings(item));
    }
    if (value && typeof value === 'object') {
      const fields = ['text', 'description', 'label', 'title', 'name', 'notes'];
      let collected = [];
      fields.forEach(field => {
        if (value[field] != null) {
          collected = collected.concat(flattenToStrings(value[field]));
        }
      });
      if (collected.length) return collected;
      return [String(value)];
    }
    if (value == null) return [];
    return [String(value)];
  };
  const removePromotionClauses = text => {
    if (!text) return '';
    let result = String(text);
    result = result.replace(/(?:[;—-]\s*)?promotion[^.;]*(?:\.)?/gi, '');
    result = result.replace(/(?:[;—-]\s*)?stamps?[^.;]*reset[^.;]*(?:\.)?/gi, '');
    result = result.replace(/\s{2,}/g, ' ').trim();
    return result;
  };
  const sanitizeRequirementTexts = value =>
    flattenToStrings(value)
      .map(text => removePromotionClauses(text).trim())
      .filter(Boolean);
  const sanitizeRiskTexts = value =>
    flattenToStrings(value)
      .map(text => String(text).trim())
      .filter(text => text && !/splinter/i.test(text));
  const formatListFromStrings = values =>
    values.map(item => sanitizeText(item)).filter(Boolean).join(', ');
  const uniqueValues = values => {
    const seen = new Set();
    const output = [];
    values.forEach(value => {
      if (value == null) return;
      const text = String(value).trim();
      if (!text || seen.has(text)) return;
      seen.add(text);
      output.push(text);
    });
    return output;
  };
  const computeBackLabel = ctx => {
    if (ctx.backLabel) return ctx.backLabel;
    if (ctx.origin === 'district' && currentCharacter?.position?.district) {
      return `Back to ${currentCharacter.position.district}`;
    }
    if (ctx.origin === 'building' && ctx.building) {
      return `Back to ${ctx.building}`;
    }
    return 'Back to Boards';
  };

  const heading = escapeHtml(displayName);
  const districtLabel = detailContext.district ? escapeHtml(detailContext.district) : '';
  const backLabel = escapeHtml(computeBackLabel(detailContext));
  const todayLabel = escapeHtml(worldCalendar.formatCurrentDate());

  let html = `<div class="questboard-detail navigation"><h2>${heading}`;
  if (districtLabel) {
    html += `<span class="quest-board-district-tag">${districtLabel}</span>`;
  }
  html += '</h2>';
  html += `<p class="quest-date">Today is ${todayLabel}</p>`;
  if (flashMessage && flashMessage.message) {
    const flashType = flashMessage.type === 'error' ? 'quest-flash-error' : 'quest-flash-success';
    html += `<div class="quest-flash ${flashType}">${escapeHtml(flashMessage.message)}</div>`;
  }
  if (!questEntries.length) {
    html += '<p>No quest postings found here.</p>';
  } else {
    if (weatherContext) {
      const areaLabel =
        weatherContext.binding.location ||
        weatherContext.binding.district ||
        weatherContext.binding.habitat ||
        displayName;
      const summary = formatWeatherSummary(weatherContext.weather);
      html += `<p class="quest-weather"><strong>Weather over ${escapeHtml(areaLabel)}:</strong> ${escapeHtml(summary)}</p>`;
    }
    const sourceNames = uniqueValues(
      questEntries.map(entry => entry.binding?.business).filter(Boolean),
    );
    const taskLocations = uniqueValues(
      questEntries.flatMap(entry => flattenToStrings(entry.quest.location)),
    );
    const subAreas = uniqueValues(group.boards.map(section => section.name).filter(Boolean));
    const summaryParts = [];
    if (sourceNames.length) {
      const label = sourceNames.length > 1 ? 'Posting sources' : 'Posting source';
      const details = sourceNames.map(name => sanitizeText(name)).join(', ');
      summaryParts.push(`<strong>${label}:</strong> ${details}`);
    }
    if (taskLocations.length) {
      const label = taskLocations.length > 1 ? 'Task sites' : 'Task site';
      const details = taskLocations.map(loc => sanitizeText(loc)).join(', ');
      summaryParts.push(`<strong>${label}:</strong> ${details}`);
    }
    if (subAreas.length) {
      const label = subAreas.length > 1 ? 'Sub-areas' : 'Sub-area';
      const details = subAreas.map(name => sanitizeText(name)).join(', ');
      summaryParts.push(`<strong>${label}:</strong> ${details}`);
    }
    if (summaryParts.length) {
      html += `<p class="quest-sources">${summaryParts.join(' • ')}</p>`;
    }
    const activeSections = group.boards
      .map(section => ({
        name: section.name,
        entries: active.filter(entry => entry.boardName === section.name),
      }))
      .filter(section => section.entries.length);
    const renderQuestItem = entry => {
      const { quest, availability, eligibility, logEntry, boardName } = entry;
      const status = (logEntry?.status || '').toLowerCase();
      const alreadyAccepted = Boolean(logEntry) && !REPEATABLE_QUEST_STATUSES.has(status);
      const itemClasses = ['quest-item'];
      if (alreadyAccepted) itemClasses.push('quest-item-accepted');
      let itemHTML = `<li class="${itemClasses.join(' ')}">`;
      itemHTML += `<h3>${sanitizeText(quest.title || 'Untitled Quest')}</h3>`;
      const descriptionHTML = formatParagraphs(quest.description);
      if (descriptionHTML) itemHTML += descriptionHTML;
      itemHTML += '<ul class="quest-meta">';
      const locationValue = formatListValue(quest.location);
      if (locationValue) itemHTML += `<li><strong>Location:</strong> ${locationValue}</li>`;
      const postingValue = formatListValue(entry.binding?.business);
      if (postingValue) itemHTML += `<li><strong>Posting:</strong> ${postingValue}</li>`;
      const rankRequirements = collectGuildRankRequirements(quest);
      if (rankRequirements.length) {
        itemHTML += `<li><strong>Guild Rank:</strong> ${formatListValue(rankRequirements)}</li>`;
      }
      const requirementTexts = sanitizeRequirementTexts(quest.requirements);
      if (requirementTexts.length) {
        itemHTML += `<li><strong>Requirements:</strong> ${formatListFromStrings(requirementTexts)}</li>`;
      }
      const conditionsValue = formatListValue(quest.conditions);
      if (conditionsValue) itemHTML += `<li><strong>Conditions:</strong> ${conditionsValue}</li>`;
      const timelineValue = formatListValue(quest.timeline);
      if (timelineValue) itemHTML += `<li><strong>Timeline:</strong> ${timelineValue}</li>`;
      const riskTexts = sanitizeRiskTexts(quest.risks);
      if (riskTexts.length) {
        itemHTML += `<li><strong>Risks:</strong> ${formatListFromStrings(riskTexts)}</li>`;
      }
      const rewardValue = formatListValue(quest.reward);
      if (rewardValue) itemHTML += `<li><strong>Reward:</strong> ${rewardValue}</li>`;
      if (Number.isFinite(availability.demand)) {
        itemHTML += `<li><strong>Demand:</strong> ${(availability.demand * 100).toFixed(0)}% probability</li>`;
      }
      const statusText = formatListValue(availability.reason);
      if (statusText) itemHTML += `<li><strong>Status:</strong> ${statusText}</li>`;
      const eventText = formatListValue(availability.eventTag);
      if (eventText) itemHTML += `<li><strong>Event:</strong> ${eventText}</li>`;
      if (alreadyAccepted && (logEntry?.acceptedOnLabel || logEntry?.acceptedOn)) {
        const acceptedLabel = logEntry.acceptedOnLabel || logEntry.acceptedOn;
        itemHTML += `<li><strong>Accepted:</strong> ${escapeHtml(acceptedLabel)}</li>`;
      }
      itemHTML += '</ul>';
      const boardAttr = escapeHtml(boardName);
      const questAttr = escapeHtml(quest.title || '');
      const groupAttr = escapeHtml(detailContext.boardKey || group.key);
      const disabled = alreadyAccepted || !eligibility.canAccept || !questAttr;
      const buttonLabel = alreadyAccepted ? 'Accepted' : 'Accept Quest';
      itemHTML += `<div class="quest-actions"><button class="quest-accept"${disabled ? ' disabled' : ''} data-board="${boardAttr}" data-group="${groupAttr}" data-quest="${questAttr}">${buttonLabel}</button>`;
      const notes = [];
      if (alreadyAccepted) {
        if (logEntry?.acceptedOnLabel) {
          notes.push(`Accepted on ${logEntry.acceptedOnLabel}.`);
        } else {
          notes.push('Already in your quest log.');
        }
      }
      if (!eligibility.canAccept) {
        notes.push(...eligibility.reasons);
      }
      if (notes.length) {
        itemHTML += `<p class="quest-requirement-note">${notes.map(note => sanitizeText(note)).filter(Boolean).join('<br>')}</p>`;
      }
      itemHTML += '</div></li>';
      return itemHTML;
    };
    if (activeSections.length) {
      html += '<div class="questboard-subareas">';
      activeSections.forEach(section => {
        const summaryLabel = sanitizeText(section.name || displayName);
        const countLabel = `<span class="quest-count">${section.entries.length}</span>`;
        const listHTML = section.entries.map(renderQuestItem).join('');
        html += `<details class="questboard-subarea" open><summary>${summaryLabel}${countLabel}</summary><ul class="quest-board-list">${listHTML}</ul></details>`;
      });
      html += '</div>';
    } else {
      html += '<p class="quest-empty">No quests available today.</p>';
    }
    if (inactive.length) {
      html += '<details class="questboard-hints"><summary>Inactive postings</summary><ul>';
      inactive.slice(0, 6).forEach(entry => {
        const titleText = sanitizeText(entry.quest.title || 'Posting');
        const reasonText = formatListValue(entry.availability.reason || 'No demand at present.');
        const areaLabel = sanitizeText(entry.boardName || displayName);
        html += `<li><strong>${titleText}</strong> (${areaLabel}): ${reasonText || 'No demand at present.'}</li>`;
      });
      html += '</ul></details>';
    }
  }
  html += `<div class="option-grid quest-board-actions"><button class="quest-back" data-action="quest-back">${backLabel}</button></div></div>`;
  setMainHTML(html);
  normalizeOptionButtonWidths();
  updateMenuHeight();
  if (main) {
    const backBtn = main.querySelector('.quest-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (typeof detailContext.onBack === 'function') {
          detailContext.onBack();
        } else {
          showQuestBoardsUI();
        }
      });
    }
    main.querySelectorAll('.quest-accept').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const board = btn.dataset.board || '';
        const questTitle = btn.dataset.quest || '';
        const groupKey = btn.dataset.group || detailContext.boardKey || boardIdentifier;
        if (!board || !questTitle) return;
        const result = acceptQuest(board, questTitle);
        if (result.ok && result.storyline) {
          startQuestStoryline(result.storyline, {
            boardName: board,
            boardContext: detailContext,
            boardKey: groupKey,
          });
        } else {
          const message = result.message || (result.ok ? 'Quest accepted.' : 'Unable to accept quest.');
          const flash = { type: result.ok ? 'success' : 'error', message };
          showQuestBoardDetails(groupKey, { ...detailContext, flash });
        }
      });
    });
  }
}

const SLOT_ICONS = {
  mainHand: '<svg viewBox="0 0 24 24"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" y1="19" x2="19" y2="13" /><line x1="16" y1="16" x2="20" y2="20" /><line x1="19" y1="21" x2="21" y2="19" /></svg>',
  offHand: '<svg viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>',
  ranged: '<svg viewBox="0 0 24 24"><path d="M17 3h4v4"/><path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17"/><path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05"/><path d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"/><path d="M9.707 14.293 21 3"/></svg>',
  instrument: '<svg viewBox="0 0 24 24"><path d="M6 3c4 9 10 12 10 19H6Z"/><path d="M6 7h8"/><path d="M6 11h9"/><path d="M6 15h8"/><path d="M6 19h6"/></svg>',
  ammo: '<svg viewBox="0 0 24 24"><path d="M3 12h14"/><polyline points="3 9 6 12 3 15"/><polyline points="17 7 23 12 17 17"/></svg>',
  head: '<svg viewBox="0 0 24 24"><path d="M2 10l4-2 3 3 3-6 3 6 3-3 4 2v8H2z"/></svg>',
  face: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4"/><path d="M4 20c1.2-3.2 4.6-5 8-5s6.8 1.8 8 5"/><path d="M7 9h10"/></svg>',
  body: '<svg viewBox="0 0 24 24"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg>',
  shoulders: '<svg viewBox="0 0 24 24"><path d="M4 9a8 8 0 0 1 16 0v9l-6 4-1-5h-2l-1 5-6-4z"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M12 2c3 1 5 4 5 8v12l-5-3-5 3V10c0-4 2-7 5-8z"/></svg>',
  arms: '<svg viewBox="0 0 24 24"><path d="M4 5h4l2 6 2-6h4l-3 7 3 7h-4l-2-6-2 6H4l3-7z"/></svg>',
  hands: '<svg viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>',
  waist: '<svg viewBox="0 0 24 24"><path d="M2 10h20v4H2z"/><rect x="8" y="8" width="8" height="8" rx="1"/><path d="M14 12h4"/></svg>',
  legs: '<svg viewBox="0 0 24 24"><path d="M7 2h10l1 6h-5l1 14h-4l1-14H6z"/><path d="M12 8v14"/></svg>',
  feet: '<svg viewBox="0 0 24 24"><path d="M6 3v8H4v5h9l4 4h5v-4h-3l-3-3h-5V3H6z"/></svg>',
  lEar: '<svg viewBox="0 0 24 24"><g transform="scale(-1,1) translate(-24,0)"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/></g></svg>',
  neck: '<svg viewBox="0 0 24 24"><path d="M4 5a8 8 0 0 0 16 0"/><circle cx="12" cy="13" r="2"/><path d="M12 15v4"/></svg>',
  lRing: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>',
  brooch: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 8V4"/><path d="M12 16v4"/></svg>',
  belt: '<svg viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="10" y="9" width="4" height="6" rx="0.5"/><path d="M3 12h4"/><path d="M17 12h4"/></svg>',
  pouch: '<svg viewBox="0 0 24 24"><path d="M4 7h16v10a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M4 7l8-4 8 4"/><rect x="9" y="11" width="6" height="3"/><path d="M12 11v3"/></svg>'
};
SLOT_ICONS.rEar = '<svg viewBox="0 0 24 24"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/></svg>';
SLOT_ICONS.rRing = SLOT_ICONS.lRing;

function formatSlotName(slot) {
  const names = {
    mainHand: 'Main Hand',
    offHand: 'Off Hand',
    face: 'Face',
    lEar: 'Left Ear',
    rEar: 'Right Ear',
    lRing: 'Left Ring',
    rRing: 'Right Ring',
    brooch: 'Brooch',
    belt: 'Belt',
    pouch: 'Pouch',
  };
  return (
    names[slot] ||
    slot
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
  );
}

function equipmentSection(title, items) {
  return `<section class="equipment-section"><h3 class="equipment-header">${title}</h3><ul class="equipment-list">${items}</ul></section>`;
}

function showEquipmentUI() {
  if (!currentCharacter) {
    startCharacterCreation();
    return;
  }
  updateScale();
  showBackButton();
  const { equipment } = currentCharacter;
  const buildList = (slots, group) =>
    slots
      .map(slot => {
        const item = equipment[group]?.[slot];
        const icon = SLOT_ICONS[slot] || '';
        const name = item ? item.name : '';
        return `<li class="equipment-slot"><span class="slot-icon">${icon}</span><span class="slot-name">${formatSlotName(slot)}</span><span class="slot-item">${name}</span></li>`;
      })
      .join('');
  const weaponList = buildList(WEAPON_SLOTS, 'weapons');
  const armorList = buildList(ARMOR_SLOTS, 'armor');
  const trinketList = buildList(TRINKET_SLOTS, 'trinkets');
  setMainHTML(
    `<div class="equipment-screen">${equipmentSection('Weapons', weaponList)}${equipmentSection('Armor', armorList)}${equipmentSection('Trinkets', trinketList)}</div>`
  );
}

function startCharacterCreation() {
  updateScale();
  hideBackButton();
  mapContainer.style.display = 'none';
  let saved = {};
  try {
    saved = JSON.parse(safeStorage.getItem(TEMP_CHARACTER_KEY) || '{}');
  } catch {
    saved = {};
  }
  const character = saved.character || {};
  const buildEntries = Object.values(characterBuilds);
  const classField = {
    key: 'class',
    label: 'Choose your class',
    type: 'select',
    options: buildEntries.map(b => b.primary),
  };
  const locationField = {
    key: 'location',
    label: 'Choose your starting location',
    type: 'select',
    options: Object.keys(LOCATIONS).filter(l => l !== 'Duvilia Kingdom')
  };

  const backstoryField = {
    key: 'backstory',
    label: 'Choose your backstory',
    type: 'select'
  };

  const fields = [
    {
      key: 'race',
      label: 'Choose your race',
      type: 'select',
      options: ['Human', 'Elf', 'Dark Elf', 'Dwarf', 'Cait Sith', 'Salamander', 'Gnome', 'Halfling'], // Cait Sith are humanoid felines, Salamanders are reptilian humanoids
    },
    {
      key: 'sex',
      label: 'Choose your sex',
      type: 'select',
      options: ['Male', 'Female']
    },
    classField,
    { key: 'characterImage', label: 'Choose your character', type: 'select' }
  ];

  const FIELD_STEP_LABELS = {
    race: 'Race',
    sex: 'Sex',
    class: 'Class',
    characterImage: 'Character'
  };

  let step = saved.step || 0;
  let ccPortraitZoom = 1;

  const resetCharacterCreationState = () => {
    saved = {};
    step = 0;
    ccPortraitZoom = 1;
    if (character && typeof character === 'object') {
      Object.keys(character).forEach(key => delete character[key]);
    }
    safeStorage.removeItem(TEMP_CHARACTER_KEY);
  };

  renderStep();

  async function renderStep() {
    const activeFields = fields.filter(
      f => !f.races || f.races.includes(character.race)
    );
    if (step > activeFields.length + 2) step = activeFields.length + 2;

    let field;
    if (step < activeFields.length) field = activeFields[step];
    else if (step === activeFields.length + 1) field = locationField;
    else if (step === activeFields.length + 2) field = backstoryField;
    if (field && field.key === 'race' && !character.race) {
      character.race = field.options[0];
      safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
    }
    if (field && field.key === 'class' && !character.class) {
      character.class = classField.options[0];
      safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
    }
    if (field && field.key === 'location' && !character.location) {
      character.location = locationField.options[0];
    }
    const availableBackstories = BACKSTORY_MAP[character.location] || [];
    if (field && field.key === 'backstory') {
      if (!availableBackstories.length) {
        if (character.backstory) {
          character.backstory = null;
          safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
        }
      } else if (!character.backstory) {
        character.backstory = availableBackstories[0].background;
        safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
      }
    }

    const stepLabels = activeFields
      .map(f => FIELD_STEP_LABELS[f.key])
      .concat(['Name', 'Location', 'Backstory']);
    const isFieldComplete = field => {
      if (!field) return true;
      if (field.key === 'characterImage') {
        const portraits = (CHARACTER_IMAGE_FILES[character.race] || {})[character.sex];
        if (Array.isArray(portraits)) {
          return portraits.length === 0 ? true : Boolean(character.characterImage);
        }
        return Boolean(character.characterImage);
      }
      return Boolean(character[field.key]);
    };
    const isBackstoryComplete = () =>
      availableBackstories.length === 0 ? true : Boolean(character.backstory);
    const isComplete = () =>
      activeFields.every(isFieldComplete) &&
      Boolean(character.name) &&
      Boolean(character.location) &&
      isBackstoryComplete();
    const progressHTML =
      stepLabels
        .map((label, i) => {
          const hasValue =
            i < activeFields.length
              ? isFieldComplete(activeFields[i])
              : i === activeFields.length
              ? Boolean(character.name)
              : i === activeFields.length + 1
              ? Boolean(character.location)
              : isBackstoryComplete();
          let cls = 'clickable';
          if (i === step) cls = 'current clickable';
          else if (hasValue) cls = 'completed clickable';
          return `<div class="progress-step ${cls}" data-step="${i}"><div class="circle"></div><span>${label}</span></div>`;
        })
        .join('') +
      `<button id="cc-complete" class="complete-button" ${isComplete() ? '' : 'disabled'}></button>` +
      '<button id="cc-cancel" title="Cancel">✖</button>';
    const displayData = (() => {
      if (field && field.key === 'location' && character.location) {
        const loc = LOCATIONS[character.location];
        if (!loc) return {};
        const descHTML = `<div class="race-description">${loc.description || ''}</div>`;
        return { descHTML };
      }
      if (field && field.key === 'backstory') {
        if (!availableBackstories.length) {
          const locationLabel = character.location
            ? escapeHtml(character.location)
            : 'this location';
          return {
            descHTML: `<div class="race-description"><p>No backstories are available for ${locationLabel} yet.</p></div>`
          };
        }
        if (character.backstory) {
          const entry = availableBackstories.find(b => b.background === character.backstory);
          const descHTML = entry
            ? `<div class="race-description">${replaceCharacterRefs(entry.past, character)}</div>`
            : '';
          return { descHTML };
        }
      }
      if (field && field.key === 'class' && character.class) {
        const build = buildEntries.find(b => b.primary === character.class);
        if (!build) return {};
        const baseAttrs = { ...getRaceStartingAttributes(character.race), LCK: 10 };
        for (const [k, v] of Object.entries(build.stats)) {
          baseAttrs[k] = (baseAttrs[k] || 0) + v;
        }
        const resources = {
          HP: maxHP(baseAttrs.VIT, baseAttrs.CON, 1),
          MP: maxMP(baseAttrs.WIS, 1),
          ST: maxStamina(baseAttrs.CON, 1),
        };
        const attrList = Object.entries(baseAttrs)
          .map(([k, v]) => `<li>${k}: ${v}</li>`)
          .join('');
        const resourceBars = `
          <div class="resource-bar hp"><div class="fill" style="width:100%"></div><span class="value">HP: ${resources.HP}</span></div>
          <div class="resource-bar mp"><div class="fill" style="width:100%"></div><span class="value">MP: ${resources.MP}</span></div>
          <div class="resource-bar stamina"><div class="fill" style="width:100%"></div><span class="value">ST: ${resources.ST}</span></div>
        `;
        const statsHTML = `<div class="race-stats"><h2>Starting Stats</h2><div class="stats-resource-grid"><ul class="stats-list">${attrList}</ul><div class="resource-column">${resourceBars}</div></div></div>`;
        const strengths = Object.entries(build.stats)
          .filter(([, v]) => v > 0)
          .map(([k]) => k)
          .join(', ') || 'None';
        const weaknesses = Object.entries(build.stats)
          .filter(([, v]) => v < 0)
          .map(([k]) => k)
          .join(', ') || 'None';
        const descHTML = `<div class="race-description"><p><strong>Skills & Abilities:</strong> ${build.description}</p><p><strong>Strengths:</strong> ${strengths}</p><p><strong>Weaknesses:</strong> ${weaknesses}</p><p><strong>Advancement:</strong> ${build.advanced}</p></div>`;
        return { statsHTML, descHTML };
      }
      if (!character.race) return {};
      const attrs = getRaceStartingAttributes(character.race);
      const resources = {
        HP: maxHP(attrs.VIT, attrs.CON, 1),
        MP: maxMP(attrs.WIS, 1),
        ST: maxStamina(attrs.CON, 1),
      };
      const attrList = Object.entries({ ...attrs, LCK: 10 })
        .map(([k, v]) => `<li>${k}: ${v}</li>`)
        .join('');
      const resList = Object.entries(resources)
        .map(([k, v]) => `<li>${k}: ${v}</li>`)
        .join('');
      const statsHTML = `<div class="race-stats"><ul>${attrList}</ul><ul>${resList}</ul></div>`;
      const descHTML = `<div class="race-description">${RACE_DESCRIPTIONS[character.race] || ''}</div>`;
      return { statsHTML, descHTML };
    })();
    const { statsHTML = '', descHTML = '' } = displayData;
    const statsSection =
      field && (field.key === 'race' || field.key === 'class') ? statsHTML : '';

    if (field) {
      let inputHTML = '';
      if (field.type === 'select') {
        if (field.key === 'location') {
          const options = field.options;
          let index = options.indexOf(character.location);
          if (index === -1) {
            index = 0;
            character.location = options[0];
          }
          inputHTML = `
            <div class="location-carousel wheel-selector">
              <button class="loc-arrow left" aria-label="Previous">&#x2039;</button>
              <button class="option-button location-button">${character.location}</button>
              <button class="loc-arrow right" aria-label="Next">&#x203A;</button>
            </div>`;
        } else if (field.key === 'race') {
          const options = field.options;
          let index = options.indexOf(character.race);
          if (index === -1) {
            index = 0;
            character.race = options[0];
          }
          inputHTML = `
            <div class="race-carousel wheel-selector">
              <button class="race-arrow left" aria-label="Previous">&#x2039;</button>
              <button class="option-button race-button">${character.race}</button>
              <button class="race-arrow right" aria-label="Next">&#x203A;</button>
            </div>`;
        } else if (field.key === 'sex') {
          const options = field.options;
          let index = options.indexOf(character.sex);
          if (index === -1) {
            index = 0;
            character.sex = options[0];
          }
          inputHTML = `
            <div class="sex-carousel wheel-selector">
              <button class="sex-arrow left" aria-label="Previous">&#x2039;</button>
              <button class="option-button sex-button">${character.sex}</button>
              <button class="sex-arrow right" aria-label="Next">&#x203A;</button>
            </div>`;
        } else if (field.key === 'class') {
          const options = field.options;
          let index = options.indexOf(character.class);
          if (index === -1) {
            index = 0;
            character.class = options[0];
          }
          inputHTML = `
            <div class="class-carousel wheel-selector">
              <button class="class-arrow left" aria-label="Previous">&#x2039;</button>
              <button class="option-button class-button">${character.class}</button>
              <button class="class-arrow right" aria-label="Next">&#x203A;</button>
            </div>`;
        } else if (field.key === 'backstory') {
          const options = availableBackstories.map(b => b.background);
          if (!options.length) {
            inputHTML = `<div class="cc-empty-option">No backstories are available for ${escapeHtml(
              character.location || 'this location'
            )} yet.</div>`;
          } else {
            let index = options.indexOf(character.backstory);
            if (index === -1) {
              index = 0;
              character.backstory = options[0];
            }
            inputHTML = `
              <div class="backstory-carousel wheel-selector">
                <button class="backstory-arrow left" aria-label="Previous">&#x2039;</button>
                <button class="option-button backstory-button">${escapeHtml(character.backstory)}</button>
                <button class="backstory-arrow right" aria-label="Next">&#x203A;</button>
              </div>`;
          }
        } else if (field.key === 'characterImage') {
          const files = await getCharacterImages(character.race, character.sex);
          if (files.length) {
            let index = files.indexOf(character.characterImage);
            if (index === -1) {
              index = 0;
              character.characterImage = files[0];
            }
            const folder = `assets/images/Race Photos/${character.race} ${character.sex}`;
            const src = `${folder}/${character.characterImage || ''}`;
            inputHTML = `
              <div class="character-carousel wheel-selector">
                <button class="character-arrow left" aria-label="Previous">&#x2039;</button>
                <div class="portrait-wrapper">
                  <img class="character-option" src="${src}" alt="Character">
                  <div class="portrait-zoom">
                    <button id="portrait-zoom-dec" class="portrait-zoom-dec" aria-label="Zoom out">-</button>
                    <button id="portrait-zoom-reset" class="portrait-zoom-reset" aria-label="Reset zoom">100%</button>
                    <button id="portrait-zoom-inc" class="portrait-zoom-inc" aria-label="Zoom in">+</button>
                  </div>
                </div>
                <button class="character-arrow right" aria-label="Next">&#x203A;</button>
              </div>`;
          } else {
            character.characterImage = null;
            safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
            inputHTML = `<div class="cc-empty-option">No portraits are available for this selection yet.</div>`;
          }
        } else {
          inputHTML = `<div class="option-grid">${field.options
            .map(
              o =>
                `<button class="option-button${
                  character[field.key] === o ? ' selected' : ''
                }" data-value="${o}">${o}</button>`
            )
            .join('')}</div>`;
        }
      } else if (field.type === 'color') {
        let colors = [];
        if (field.key === 'hairColor') {
          colors = hairColorOptionsByRace[character.race] || humanHairColors;
        } else if (field.key === 'eyeColor') {
          colors = eyeColorOptionsByRace[character.race] || humanEyeColors;
        } else if (field.key === 'skinColor') {
          colors = skinColorOptionsByRace[character.race] || humanSkinColors;
        }
        colors = colors.slice().sort();
        let value = character[field.key];
        if (value === undefined) {
          value = colors[0];
          character[field.key] = value;
        }
        const pickerId = `${field.key}-picker`;
        inputHTML = `
          <div class="color-carousel wheel-selector" data-field="${field.key}">
            <button class="color-arrow left" aria-label="Previous">&#x2039;</button>
            <button class="color-button" style="background:${value}" aria-label="${value}"></button>
            <button class="color-arrow right" aria-label="Next">&#x203A;</button>
            <button class="color-picker" aria-label="Pick color">🎨</button>
            <input type="color" id="${pickerId}" value="${value}" style="display:none;">
          </div>`;
      }

      setMainHTML(
        `<div class="character-creation"><div class="cc-top-row"><div class="progress-container">${progressHTML}</div><div class="cc-right"><div class="cc-options">${inputHTML}</div>${statsSection}</div></div><div class="cc-info">${descHTML}</div></div>`
      );
      normalizeOptionButtonWidths();

      if (field.key === 'location') {
        const options = field.options;
        let index = options.indexOf(character.location);
        const change = dir => {
          index = (index + dir + options.length) % options.length;
          character.location = options[index];
          delete character.backstory;
          safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
          renderStep();
        };
        document.querySelector('.loc-arrow.left').addEventListener('click', () => change(-1));
        document.querySelector('.loc-arrow.right').addEventListener('click', () => change(1));
      } else if (field.key === 'race') {
        const options = field.options;
        let index = options.indexOf(character.race);
        const change = dir => {
          index = (index + dir + options.length) % options.length;
          character.race = options[index];
          if (character.race !== 'Cait Sith') delete character.accentColor;
          if (character.race !== 'Salamander') delete character.scaleColor;
          delete character.characterImage;
          safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
          renderStep();
        };
        document.querySelector('.race-arrow.left').addEventListener('click', () => change(-1));
        document.querySelector('.race-arrow.right').addEventListener('click', () => change(1));
      } else if (field.key === 'sex') {
        const options = field.options;
        let index = options.indexOf(character.sex);
        const change = dir => {
          index = (index + dir + options.length) % options.length;
          character.sex = options[index];
          delete character.characterImage;
          safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
          renderStep();
        };
        document.querySelector('.sex-arrow.left').addEventListener('click', () => change(-1));
        document.querySelector('.sex-arrow.right').addEventListener('click', () => change(1));
      } else if (field.key === 'class') {
        const options = field.options;
        let index = options.indexOf(character.class);
        const change = dir => {
          index = (index + dir + options.length) % options.length;
          character.class = options[index];
          safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
          renderStep();
        };
        document.querySelector('.class-arrow.left').addEventListener('click', () => change(-1));
        document.querySelector('.class-arrow.right').addEventListener('click', () => change(1));
      } else if (field.key === 'backstory') {
        const options = availableBackstories.map(b => b.background);
        if (options.length) {
          let index = options.indexOf(character.backstory);
          const change = dir => {
            index = (index + dir + options.length) % options.length;
            character.backstory = options[index];
            safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
            renderStep();
          };
          document.querySelector('.backstory-arrow.left').addEventListener('click', () => change(-1));
          document.querySelector('.backstory-arrow.right').addEventListener('click', () => change(1));
        }
      } else if (field.key === 'characterImage') {
        const files =
          (CHARACTER_IMAGE_FILES[character.race] || {})[character.sex] || [];
        if (files.length) {
          let index = files.indexOf(character.characterImage);
          const change = dir => {
            index = (index + dir + files.length) % files.length;
            character.characterImage = files[index];
            ccPortraitZoom = 1;
            safeStorage.setItem(
              TEMP_CHARACTER_KEY,
              JSON.stringify({ step, character })
            );
            renderStep();
          };
          document
            .querySelector('.character-arrow.left')
            .addEventListener('click', () => change(-1));
          document
            .querySelector('.character-arrow.right')
            .addEventListener('click', () => change(1));

          const portraitImg = document.querySelector('.character-option');
          const zoomDec = document.getElementById('portrait-zoom-dec');
          const zoomInc = document.getElementById('portrait-zoom-inc');
          const zoomReset = document.getElementById('portrait-zoom-reset');
          const zoomControls = document.querySelector('.portrait-zoom');

          function updateZoom() {
            portraitImg.style.transform = `scale(${ccPortraitZoom})`;
            zoomReset.textContent = `${Math.round(ccPortraitZoom * 100)}%`;
            const offset = portraitImg.offsetHeight * (ccPortraitZoom - 1);
            zoomControls.style.marginTop = `${offset}px`;
          }

          zoomDec.addEventListener('click', () => {
            ccPortraitZoom = Math.max(0.1, ccPortraitZoom - 0.1);
            updateZoom();
          });

          zoomInc.addEventListener('click', () => {
            ccPortraitZoom += 0.1;
            updateZoom();
          });

          zoomReset.addEventListener('click', () => {
            ccPortraitZoom = 1;
            updateZoom();
          });

          if (portraitImg.complete) updateZoom();
          else portraitImg.addEventListener('load', updateZoom);
        }
      } else if (field.type === 'select') {
        document.querySelectorAll('.option-button').forEach(btn => {
          btn.addEventListener('click', () => {
            character[field.key] = btn.dataset.value;
            safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
            renderStep();
          });
        });
      } else if (field.type === 'color') {
        let colors = [];
        if (field.key === 'hairColor') {
          colors = hairColorOptionsByRace[character.race] || humanHairColors;
        } else if (field.key === 'eyeColor') {
          colors = eyeColorOptionsByRace[character.race] || humanEyeColors;
        } else if (field.key === 'skinColor') {
          colors = skinColorOptionsByRace[character.race] || humanSkinColors;
        }
        colors = colors.slice().sort();
        let index = colors.indexOf(character[field.key]);
        if (index === -1) index = 0;
        const carousel = document.querySelector(`.color-carousel[data-field="${field.key}"]`);
        const btn = carousel.querySelector('.color-button');
        const pickerInput = carousel.querySelector('input[type="color"]');
        const update = () => {
          btn.style.background = character[field.key];
          btn.setAttribute('aria-label', character[field.key]);
          pickerInput.value = character[field.key];
          safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
        };
        const change = dir => {
          index = (index + dir + colors.length) % colors.length;
          character[field.key] = colors[index];
          update();
        };
        carousel.querySelector('.color-arrow.left').addEventListener('click', () => change(-1));
        carousel.querySelector('.color-arrow.right').addEventListener('click', () => change(1));
        carousel.querySelector('.color-picker').addEventListener('click', () => pickerInput.click());
        pickerInput.addEventListener('input', () => {
          character[field.key] = pickerInput.value;
          update();
        });
      }
    } else {
      const nameVal = character.name || '';
      const nameList =
        DEFAULT_NAMES[character.race]?.[
          character.sex === 'Male' ? 'male' : 'female'
        ] || [];
      const placeholderName = nameList[0] || 'Name';
      setMainHTML(
        `<div class="character-creation"><div class="cc-top-row"><div class="progress-container">${progressHTML}</div><div class="cc-right"><div class="cc-options name-entry"><input type="text" id="name-input" value="${nameVal}" placeholder="${placeholderName}"><button id="name-random" class="dice-button" aria-label="Randomize Name">🎲</button></div>${statsSection}</div></div><div class="cc-info">${descHTML}</div></div>`
      );
      normalizeOptionButtonWidths();
      const nameInput = document.getElementById('name-input');
      const randomBtn = document.getElementById('name-random');
      const updateName = () => {
        character.name = nameInput.value.trim();
        safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
        const completeBtn = document.getElementById('cc-complete');
        const nameStepEl = document.querySelector(`.progress-step[data-step="${activeFields.length}"]`);
        if (character.name) {
          nameStepEl?.classList.add('completed');
        } else {
          nameStepEl?.classList.remove('completed');
        }
        if (isComplete()) completeBtn.removeAttribute('disabled');
        else completeBtn.setAttribute('disabled', '');
      };
      const randomizeName = () => {
        if (!nameList.length) return;
        const newName = nameList[Math.floor(Math.random() * nameList.length)];
        nameInput.value = newName;
        updateName();
      };
      randomBtn.addEventListener('click', randomizeName);
      nameInput.addEventListener('input', updateName);
      updateName();
    }

    document.getElementById('cc-complete').addEventListener('click', () => {
      if (!isComplete()) return;
      safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
      const folder = `assets/images/Race Photos/${character.race} ${character.sex}`;
      character.image = character.characterImage ? `${folder}/${character.characterImage}` : '';
      finalizeCharacter(character);
      resetCharacterCreationState();
    });

    document.querySelectorAll('.progress-step').forEach(el => {
      const index = parseInt(el.dataset.step, 10);
      el.addEventListener('click', () => {
        step = index;
        safeStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
        renderStep();
      });
    });

    document.getElementById('cc-cancel').addEventListener('click', () => {
      if (confirm('Cancel character creation?')) {
        resetCharacterCreationState();
        showMainUI();
      }
    });
  }
}

function finalizeCharacter(character) {
  const id = Date.now().toString();
  const template = JSON.parse(JSON.stringify(characterTemplate));
  const baseAttrs = getRaceStartingAttributes(character.race);
  const attrBlock = { ...baseAttrs, LCK: 10 };
  const buildEntry = Object.values(characterBuilds).find(
    b => b.primary === character.class
  );
  if (buildEntry) {
    for (const [k, v] of Object.entries(buildEntry.stats)) {
      attrBlock[k] = (attrBlock[k] || 0) + v;
    }
  }
  const resources = {
    maxHP: maxHP(attrBlock.VIT, attrBlock.CON, 1),
    maxMP: maxMP(attrBlock.WIS, 1),
    maxStamina: maxStamina(attrBlock.CON, 1),
  };
  const newChar = migrateProficiencies({
    ...template,
    ...defaultProficiencies,
    ...character,
    homeTown: character.location,
    location: character.location,
    attributes: { base: { ...attrBlock }, current: { ...attrBlock } },
    maxHP: resources.maxHP,
    hp: resources.maxHP,
    maxMP: resources.maxMP,
    mp: resources.maxMP,
    maxStamina: resources.maxStamina,
    stamina: resources.maxStamina,
    hoursAwake: 0,
    advancedClass: buildEntry?.advanced,
    id,
  });
  newChar.guildRank = 'None';
  const bsList = BACKSTORY_MAP[character.location];
  if (bsList && bsList.length) {
    const raw = bsList.find(b => b.background === character.backstory) || bsList[0];
    newChar.backstory = {
      ...raw,
      background: replaceCharacterRefs(raw.background, newChar),
      past: replaceCharacterRefs(raw.past, newChar),
      narrative: replaceCharacterRefs(raw.narrative, newChar),
    };
    newChar.money = raw.money
      ? { ...createEmptyCurrency(), ...parseCurrency(raw.money) }
      : createEmptyCurrency();
    if (raw.businesses) {
      newChar.buildings = raw.businesses.map(b => ({
        name: b.name,
        location: b.location,
        ownership: b.ownership || 'owner',
        ownershipType: determineOwnership(b.name),
        dailyCost: b.dailyCost || 0,
        dailyProfit: b.dailyProfit || 0,
        jobRoles: getJobRolesForBuilding(b.name),
        money: b.money
          ? { ...createEmptyCurrency(), ...parseCurrency(b.money) }
          : createEmptyCurrency(),
      }));
    }
    if (raw.employment) {
      newChar.employment = raw.employment.map(job => ({
        ...job,
        schedule:
          job.schedule != null
            ? job.schedule
            : JOB_ROLE_DATA[job.role]?.schedule ?? null,
        hours: job.hours || JOB_ROLE_DATA[job.role]?.hours || null,
        quota: job.quota || null,
        pay: job.pay || null,
        baseQuota: job.baseQuota || job.quota?.amount || null,
        basePay: job.basePay || job.pay || null,
        progress: job.progress || 0,
      }));
    }
    if (raw.guildRank) newChar.guildRank = raw.guildRank;
    if (raw.adventurersGuildRank) newChar.adventurersGuildRank = raw.adventurersGuildRank;
    const cityData = CITY_NAV[character.location];
    if (cityData) {
      const district = newChar.backstory.district;
      let building = null;
      if (newChar.backstory.startingLocation && cityData.buildings) {
        const startLower = newChar.backstory.startingLocation.toLowerCase();
        for (const name of Object.keys(cityData.buildings)) {
          if (startLower.includes(name.toLowerCase())) {
            building = name;
            break;
          }
        }
      }
      newChar.position = {
        city: character.location,
        district: district || (cityData ? Object.keys(cityData.districts)[0] : null),
        building,
        previousDistrict: null,
        previousBuilding: null,
      };
    }
  }
  normalizeCharacterState(newChar);
  assignMagicAptitudes(newChar);
  ensureCollections(newChar);
  ensureQuestLog(newChar);
  ensureQuestHistory(newChar);
  ensureActionLog(newChar);
  ensureCharacterClock(newChar);
  currentProfile.characters[id] = newChar;
  currentProfile.lastCharacter = id;
  currentCharacter = newChar;
  resetLocationLogs();
  saveProfiles();
  updateScale();
  showCharacter();
  safeStorage.removeItem(TEMP_CHARACTER_KEY);
}

function loadCharacter() {
  const charId = currentProfile?.lastCharacter;
  if (charId && currentProfile.characters && currentProfile.characters[charId]) {
    const loadedCharacter = migrateProficiencies({
      ...JSON.parse(JSON.stringify(characterTemplate)),
      ...defaultProficiencies,
      ...currentProfile.characters[charId]
    });
    normalizeCharacterState(loadedCharacter);
    currentCharacter = loadedCharacter;
    resetLocationLogs();
    ensureCollections(currentCharacter);
    ensureQuestLog(currentCharacter);
    ensureQuestHistory(currentCharacter);
    ensureActionLog(currentCharacter);
    ensureCharacterClock(currentCharacter);
    showCharacter();
  } else if (safeStorage.getItem(TEMP_CHARACTER_KEY)) {
    startCharacterCreation();
  } else {
    showNoCharacterUI();
  }
}

function loadPreferences() {
  const prefs = currentProfile?.preferences || {};
  if (prefs.theme && themes.includes(prefs.theme)) {
    currentThemeIndex = themes.indexOf(prefs.theme);
  }
  if (typeof prefs.uiScale === 'number') {
    uiScale = prefs.uiScale;
  }
  setTheme(currentThemeIndex);
  updateScale();
}

async function clearLocalData() {
  if (!confirm('Clear all local data? This will reload the page.')) return;
  try {
    safeStorage.clear();
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } finally {
    location.reload();
  }
}

const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');
if (settingsButton && settingsPanel) {
  settingsButton.addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
  });
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themes = ['light', 'dark', 'sepia'];
const currentThemeClass = body
  ? [...body.classList].find(c => typeof c === 'string' && c.startsWith('theme-'))
  : null;
let currentThemeIndex = currentThemeClass
  ? themes.indexOf(currentThemeClass.replace('theme-', ''))
  : -1;
if (currentThemeIndex === -1) {
  currentThemeIndex = 0;
  if (body && (!currentThemeClass || currentThemeClass !== `theme-${themes[0]}`)) {
    body.classList.add(`theme-${themes[0]}`);
  }
}
const removeThemeClasses = themes.map(theme => `theme-${theme}`);
const setTheme = index => {
  const safeIndex = Number.isInteger(index) && index >= 0 && index < themes.length ? index : 0;
  if (!body) return;
  body.classList.remove(...removeThemeClasses);
  const theme = themes[safeIndex];
  if (!theme) return;
  body.classList.add(`theme-${theme}`);
  savePreference('theme', theme);
};
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    setTheme(currentThemeIndex);
  });
}

// UI scale buttons
let uiScale = 1;
const updateScale = () => {
  document.documentElement.style.setProperty('--ui-scale', uiScale);
  savePreference('uiScale', uiScale);
  updateMenuHeight();
  repositionFloatingMenus();
};
const scaleDecButton = document.getElementById('scale-dec');
const scaleIncButton = document.getElementById('scale-inc');
if (scaleDecButton) {
  scaleDecButton.addEventListener('click', () => {
    uiScale = Math.max(0.5, uiScale - 0.1);
    updateScale();
  });
}
if (scaleIncButton) {
  scaleIncButton.addEventListener('click', () => {
    uiScale = Math.min(2, uiScale + 0.1);
    updateScale();
  });
}

// Dropdown menu
const menuButton = document.getElementById('menu-button');
const characterButton = document.getElementById('character-button');
const dropdownMenu = document.getElementById('dropdownMenu');
const characterMenu = document.getElementById('characterMenu');

function positionFloatingMenu(menuEl, triggerEl, alignment = 'left') {
  if (!menuEl || !triggerEl || !appContainer) return;
  const appRect = appContainer.getBoundingClientRect();
  const triggerRect = triggerEl.getBoundingClientRect();
  const top = Math.max(triggerRect.bottom - appRect.top, 0);

  menuEl.style.top = `${top}px`;
  menuEl.style.left = 'auto';
  menuEl.style.right = 'auto';

  if (alignment === 'right') {
    const rightOffset = Math.max(appRect.right - triggerRect.right, 0);
    menuEl.style.right = `${rightOffset}px`;
  } else {
    const leftOffset = Math.max(triggerRect.left - appRect.left, 0);
    menuEl.style.left = `${leftOffset}px`;
  }
}
function toggleCityMap(btn) {
  if (!currentCharacter) return;
  if (mapContainer.style.display === 'flex') {
    mapContainer.style.display = 'none';
    if (mapToggleButton) {
      mapToggleButton.classList.remove('map-toggle-floating');
      mapToggleButton = null;
    }
    return;
  }
  const locName = currentCharacter.location;
  const loc = LOCATIONS[locName] || LOCATIONS['Duvilia Kingdom'];
  mapContainer.innerHTML = `<img src="${loc.map}" alt="${loc.name}"><div class="map-description">${loc.description || ''}</div>`;
  mapContainer.style.display = 'flex';
  mapToggleButton = btn;
  mapToggleButton.classList.add('map-toggle-floating');
}


function updateCharacterButton() {
  if (!characterButton) return;
  if (!currentCharacter) {
    characterButton.style.display = 'none';
    mapContainer.style.display = 'none';
    return;
  }
  characterButton.style.display = 'inline-flex';
}

if (menuButton && dropdownMenu && characterMenu) {
  menuButton.addEventListener('click', () => {
    const willOpen = !dropdownMenu.classList.contains('active');
    dropdownMenu.classList.remove('active');
    characterMenu.classList.remove('active');
    if (willOpen) {
      positionFloatingMenu(dropdownMenu, menuButton, 'right');
      requestAnimationFrame(() => dropdownMenu.classList.add('active'));
    }
  });
}
if (characterButton && dropdownMenu && characterMenu) {
  characterButton.addEventListener('click', () => {
    const willOpen = !characterMenu.classList.contains('active');
    dropdownMenu.classList.remove('active');
    characterMenu.classList.remove('active');
    if (willOpen) {
      positionFloatingMenu(characterMenu, characterButton, 'left');
      requestAnimationFrame(() => characterMenu.classList.add('active'));
    }
  });
}

const repositionFloatingMenus = () => {
  if (dropdownMenu && menuButton && dropdownMenu.classList.contains('active')) {
    positionFloatingMenu(dropdownMenu, menuButton, 'right');
  }
  if (characterMenu && characterButton && characterMenu.classList.contains('active')) {
    positionFloatingMenu(characterMenu, characterButton, 'left');
  }
};

window.addEventListener('resize', repositionFloatingMenus);
window.addEventListener('scroll', repositionFloatingMenus, true);

if (dropdownMenu) {
  dropdownMenu.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button || !dropdownMenu.contains(button)) return;
    const action = button.dataset.action;
    if (!action) return;
    dropdownMenu.classList.remove('active');
    if (action === 'new-character') {
      startCharacterCreation();
    } else if (action === 'character-select') {
      showCharacterSelectUI();
    } else if (action === 'clear-data') {
      clearLocalData();
    } else {
      showBackButton();
      setMainHTML(`<div class="no-character"><h1>${action} not implemented</h1></div>`);
    }
  });
}

if (characterMenu) {
  characterMenu.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button || !characterMenu.contains(button)) return;
    const action = button.dataset.action;
    if (!action) return;
    characterMenu.classList.remove('active');
    if (action === 'profile') {
      showCharacterUI();
    } else if (action === 'equipment') {
      showEquipmentUI();
    } else if (action === 'inventory') {
      showInventoryUI();
    } else if (action === 'spellbook') {
      showSpellbookUI();
    } else if (action === 'bestiary') {
      showBestiaryUI();
    } else if (action === 'herbarium') {
      showHerbariumUI();
    } else if (action === 'proficiencies') {
      showProficienciesUI();
    } else if (action === 'buildings') {
      showBuildingsUI();
    } else if (action === 'quests') {
      showQuestLogUI();
    } else if (action === 'action-log') {
      showActionLogUI();
    } else {
      showBackButton();
      setMainHTML(`<div class="no-character"><h1>${action} not implemented</h1></div>`);
    }
  });
}

if (backButton && dropdownMenu && characterMenu) {
  backButton.addEventListener('click', () => {
    dropdownMenu.classList.remove('active');
    characterMenu.classList.remove('active');
    showMainUI();
  });
}

function enhanceTooltips() {
  const processedAnchors = new WeakSet();
  let tooltipEl = null;
  let activeAnchor = null;
  const VIEWPORT_PADDING = 8;

  const ensureTooltipElement = () => {
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'tooltip-bubble';
      tooltipEl.setAttribute('role', 'tooltip');
      tooltipEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  };

  const updateTheme = () => {
    if (!tooltipEl) return;
    const isDarkTheme = document.body.classList.contains('theme-dark');
    tooltipEl.dataset.theme = isDarkTheme ? 'dark' : 'light';
  };

  const positionTooltip = () => {
    if (!activeAnchor || !tooltipEl || !tooltipEl.classList.contains('is-visible')) {
      return;
    }

    updateTheme();

    const bubble = tooltipEl;
    const availableWidth = window.innerWidth - VIEWPORT_PADDING * 2;
    const maxWidth = availableWidth > 0 ? Math.min(288, availableWidth) : 288;
    bubble.style.maxWidth = `${maxWidth}px`;
    if (availableWidth > 0 && availableWidth < 144) {
      bubble.style.minWidth = `${availableWidth}px`;
    } else if (availableWidth <= 0) {
      bubble.style.minWidth = '0';
    } else {
      bubble.style.minWidth = '9rem';
    }

    // Reset position so measurements are not affected by previous placement.
    bubble.style.left = '0px';
    bubble.style.top = '0px';

    const anchorRect = activeAnchor.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();

    let top = anchorRect.bottom + VIEWPORT_PADDING;
    let placement = 'below';

    const bottomBoundary = window.innerHeight - VIEWPORT_PADDING;
    if (top + bubbleRect.height > bottomBoundary) {
      const aboveTop = anchorRect.top - VIEWPORT_PADDING - bubbleRect.height;
      if (aboveTop >= VIEWPORT_PADDING) {
        top = aboveTop;
        placement = 'above';
      } else {
        top = Math.max(VIEWPORT_PADDING, bottomBoundary - bubbleRect.height);
      }
    }

    let left = anchorRect.left + anchorRect.width / 2 - bubbleRect.width / 2;
    const minLeft = VIEWPORT_PADDING;
    const maxLeft = window.innerWidth - bubbleRect.width - VIEWPORT_PADDING;
    if (maxLeft < minLeft) {
      left = Math.max(minLeft, window.innerWidth / 2 - bubbleRect.width / 2);
    } else {
      left = Math.min(Math.max(left, minLeft), maxLeft);
    }

    bubble.style.left = `${Math.round(left)}px`;
    bubble.style.top = `${Math.round(top)}px`;
    bubble.dataset.placement = placement;
  };

  const hideTooltip = () => {
    if (!tooltipEl) return;
    tooltipEl.classList.remove('is-visible');
    tooltipEl.removeAttribute('data-placement');
    tooltipEl.setAttribute('aria-hidden', 'true');
    activeAnchor = null;
  };

  const showTooltip = (anchor) => {
    const text = anchor.getAttribute('data-tooltip');
    if (!text) {
      if (activeAnchor === anchor) {
        hideTooltip();
      }
      return;
    }

    activeAnchor = anchor;
    const bubble = ensureTooltipElement();
    bubble.textContent = text;
    bubble.classList.add('is-measuring');
    bubble.classList.add('is-visible');
    bubble.setAttribute('aria-hidden', 'false');
    bubble.style.visibility = 'hidden';
    positionTooltip();
    bubble.style.visibility = '';
    requestAnimationFrame(() => {
      bubble.classList.remove('is-measuring');
    });
  };

  const prepareAnchor = (anchor) => {
    if (processedAnchors.has(anchor)) return;
    processedAnchors.add(anchor);
    anchor.classList.add('tooltip-anchor--js');

    anchor.addEventListener('mouseenter', () => showTooltip(anchor));
    anchor.addEventListener('mouseleave', () => {
      if (activeAnchor === anchor) {
        hideTooltip();
      }
    });
    anchor.addEventListener('focus', () => showTooltip(anchor));
    anchor.addEventListener('blur', () => {
      if (activeAnchor === anchor) {
        hideTooltip();
      }
    });
    anchor.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && activeAnchor === anchor) {
        hideTooltip();
        anchor.blur();
      }
    });
  };

  const prepareAnchorsInTree = (root) => {
    if (root.classList && root.classList.contains('tooltip-anchor')) {
      prepareAnchor(root);
    }
    root.querySelectorAll?.('.tooltip-anchor').forEach(prepareAnchor);
  };

  prepareAnchorsInTree(document.body);

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        prepareAnchorsInTree(node);
      });

      mutation.removedNodes.forEach((node) => {
        if (
          activeAnchor &&
          node.nodeType === Node.ELEMENT_NODE &&
          (node === activeAnchor || node.contains(activeAnchor))
        ) {
          hideTooltip();
        }
      });

      if (
        mutation.type === 'attributes' &&
        mutation.target === activeAnchor &&
        mutation.attributeName === 'data-tooltip'
      ) {
        showTooltip(activeAnchor);
      }
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-tooltip'],
  });

  window.addEventListener('resize', positionTooltip);
  window.addEventListener('orientationchange', positionTooltip);
  window.addEventListener('scroll', positionTooltip, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideTooltip();
    }
  });

  const themeObserver = new MutationObserver(updateTheme);
  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
  });
}

enhanceTooltips();

// Initialization
selectProfile();
loadPreferences();
loadCharacter();

