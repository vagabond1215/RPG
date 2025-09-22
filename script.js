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
import { TidefallCalendar, dateKey, getSeasonForDate } from "./data/game/calendar.js";
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

const CITY_SLUGS = { "Wave's Break": "waves_break" };

const BACKSTORY_MAP = {
  "Wave's Break": WAVES_BREAK_BACKSTORIES,
};

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
const menuMoneyLabel = document.getElementById('menu-money');
const mapContainer = document.createElement('div');
mapContainer.id = 'map-container';
mapContainer.style.display = 'none';
if (app) {
  app.appendChild(mapContainer);
}
let mapToggleButton = null;

function updateTopMenuIndicators() {
  if (menuDateLabel) {
    const currentDate = worldCalendar.formatCurrentDate();
    menuDateLabel.textContent = currentDate;
    menuDateLabel.setAttribute('title', `Date: ${currentDate}`);
    menuDateLabel.setAttribute('aria-label', `Current date: ${currentDate}`);
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
  const vw = window.innerWidth;
  const vh = window.innerHeight;
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

function buildingWorkerEstimate(profile, timeBand, weather, building) {
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
        'Capstan crews chant as they warp a grain barge beneath the waiting cranes.',
        'Ledger-runners weave between crate stacks, relaying berth assignments to sweating dock bosses.',
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
    return 'You wait by the entrance, crossing paths with only a lone caretaker.';
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
  const verb = descriptor.plural ? 'move' : 'moves';
  return `${capitalizeFirst(descriptor.text)} ${verb} through ${locale}, keeping ${buildingName} steady.`;
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

function buildingSceneParagraphs(context) {
  const { building, buildingName, businessProfile, timeLabel, weather, workers, rng, habitat, season } = context;
  const paragraphs = [];
  const displayName = building?.name || buildingName;
  if (displayName === "Merchants' Wharf") {
    const overview = merchantsWharfOverview({ weather, season, timeLabel });
    if (overview) paragraphs.push(overview);
  } else {
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
  const workers = buildingWorkerEstimate(businessProfile, timeBand, context.weather, context.building);
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
  };
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

function buildingInteractionLabels(context) {
  const habitat = (context.habitat || '').toLowerCase();
  const name = (context.building?.name || context.buildingName || '').toLowerCase();
  if (habitat === 'farmland' || /farm|orchard|grove|pasture|meadow/i.test(name)) {
    return {
      knock: 'Knock on the homestead door',
      search: 'Walk the rows to find someone in charge',
      request: 'Ask about field postings',
    };
  }
  return {
    knock: 'Knock on the office door',
    search: 'Ask around for the supervisor',
    request: 'Ask about available work',
  };
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
  const questInfo = findAvailableQuestForBoards(context.buildingBoards || []);
  const interactions = [];
  const labels = buildingInteractionLabels(context);
  if (!state.managerFound) {
    interactions.push({ action: 'building-knock', name: labels.knock });
    interactions.push({ action: 'building-search', name: labels.search });
  } else {
    interactions.push({
      action: 'building-request-work',
      name: questInfo?.quest?.title ? `Ask about “${questInfo.quest.title}”` : labels.request,
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

function handleBuildingKnock(position) {
  const context = createBuildingEncounterContext(position);
  if (!context) return;
  const state = ensureBuildingEncounterState(context);
  state.message = null;
  state.messageType = null;
  if (state.managerFound) {
    state.narrative.push('The lead already has an eye on you—no need to knock again.');
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
    const rural = buildingInteractionLabels(context).knock.includes('homestead');
    const missLines = rural
      ? [
          'You rap on the homestead door and wait, but only distant work calls answer.',
          'No one emerges from the farmhouse—crews must be deep in the rows.',
          'You linger on the porch, yet the door stays shut as workers shout orders beyond the trees.',
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

function handleBuildingSearch(position) {
  const context = createBuildingEncounterContext(position);
  if (!context) return;
  const state = ensureBuildingEncounterState(context);
  state.message = null;
  state.messageType = null;
  if (state.managerFound) {
    state.narrative.push('The lead is already speaking with you.');
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
    const rural = buildingInteractionLabels(context).search.includes('rows');
    const missLines = rural
      ? [
          'A picker points you toward another lane, promising the steward is further upslope.',
          'You flag down a hauler, but they shrug and send you deeper among the trees.',
          'Another crew member shakes their head—they have crates to move and no authority to help.',
        ]
      : [
          'A clerk nods toward the back offices, suggesting you try again later.',
          'You stop a porter, but they are too busy to fetch a supervisor right now.',
          'Someone gestures upstairs, yet no one breaks away to meet you.',
        ];
    const miss = missLines[(state.searchAttempts - 1) % missLines.length];
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
  const createNavItem = ({ type, target, name, action, prompt, icon, disabled, extraClass }) => {
    const safeName = escapeHtml(name || '');
    const defaultIcon = NAV_ICONS[type] || '📍';
    const iconHTML = icon
      ? `<img src="${icon}" alt="" class="nav-icon">`
      : `<span class="nav-icon">${defaultIcon}</span>`;
    const attrValue = action ? escapeHtml(action) : escapeHtml(target ?? '');
    const attrs = action
      ? `data-action="${attrValue}"`
      : target != null
        ? `data-target="${attrValue}"`
        : '';
    const aria = prompt ? `${prompt} ${name}` : name;
    const ariaLabel = escapeHtml(aria || '');
    const dis = disabled ? 'disabled' : '';
    const cls = extraClass ? ` ${extraClass}` : '';
    const labelHTML =
      icon && (type !== 'interaction' || ['shop', 'sell'].includes(action))
        ? ''
        : `<span class="street-sign">${safeName}</span>`;
    return `<div class="nav-item${cls}"><button data-type="${type}" ${attrs} aria-label="${ariaLabel}" ${dis}>${iconHTML}</button>${labelHTML}</div>`;
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
          })
        );
      } else if (e.target !== pos.district) {
        const prompt = e.prompt || building.travelPrompt || 'Travel to';
        const icon = e.icon || getDistrictIcon(pos.city, e.name);
        exitButtons.push(
          createNavItem({ type: 'district', target: e.target, name: e.name, prompt, icon })
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
        createNavItem({ type: 'interaction', action: i.action, name: i.name, icon: i.icon })
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
    setMainHTML(
      `<div class="navigation">${headerHTML}${descriptionHTML}${hoursText ? `<p class="business-hours">${hoursText}</p>` : ''}<div class="option-grid">${buttons.join('')}</div></div>`
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
      });
    };

    const exitGroup = exits.map(makeButton);
    const localButtons = locals.map(makeButton);
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
    setMainHTML(
      `<div class="navigation"><h2>${pos.district}</h2><div class="option-grid">${navButtons.join('')}</div>${descHTML}${localsHTML}</div>`
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
              const prof = trainCraftSkill(currentCharacter, 'glassblowing');
              saveProfiles();
              showBackButton();
              setMainHTML(
                `<div class="no-character"><h1>You practice glassblowing.</h1><p>Proficiency: ${prof.toFixed(2)}</p></div>`
              );
              return;
            } else if (action === 'train-pearl-diving') {
              const prof = performGathering(currentCharacter, 'pearlDiving');
              saveProfiles();
              showBackButton();
              setMainHTML(
                `<div class="no-character"><h1>You practice pearl diving.</h1><p>Proficiency: ${prof.toFixed(2)}</p></div>`
              );
              return;
            } else if (action === 'train-blacksmithing') {
              const prof = trainCraftSkill(currentCharacter, 'blacksmithing');
              saveProfiles();
              showBackButton();
              setMainHTML(
                `<div class="no-character"><h1>You practice blacksmithing.</h1><p>Proficiency: ${prof.toFixed(2)}</p></div>`
              );
              return;
            } else if (action === 'train-carpentry') {
              const prof = trainCraftSkill(currentCharacter, 'carpentry');
              saveProfiles();
              showBackButton();
              setMainHTML(
                `<div class="no-character"><h1>You practice carpentry.</h1><p>Proficiency: ${prof.toFixed(2)}</p></div>`
              );
              return;
            } else if (action === 'train-tailoring') {
              const prof = trainCraftSkill(currentCharacter, 'tailoring');
              saveProfiles();
              showBackButton();
              setMainHTML(
                `<div class="no-character"><h1>You practice tailoring.</h1><p>Proficiency: ${prof.toFixed(2)}</p></div>`
              );
              return;
            } else if (action === 'train-leatherworking') {
              const prof = trainCraftSkill(currentCharacter, 'leatherworking');
              saveProfiles();
              showBackButton();
              setMainHTML(
                `<div class="no-character"><h1>You practice leatherworking.</h1><p>Proficiency: ${prof.toFixed(2)}</p></div>`
              );
              return;
            } else if (action === 'train-alchemy') {
              const prof = trainCraftSkill(currentCharacter, 'alchemy');
              saveProfiles();
              showBackButton();
              setMainHTML(
                `<div class="no-character"><h1>You practice alchemy.</h1><p>Proficiency: ${prof.toFixed(2)}</p></div>`
              );
              return;
            } else if (action === 'train-enchanting') {
              const prof = trainCraftSkill(currentCharacter, 'enchanting');
              saveProfiles();
              showBackButton();
              setMainHTML(
                `<div class="no-character"><h1>You practice enchanting.</h1><p>Proficiency: ${prof.toFixed(2)}</p></div>`
              );
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

function advanceCharacterTime(hours = 0) {
  if (!currentCharacter) {
    return { days: 0, timeOfDay: 0 };
  }
  ensureCharacterClock(currentCharacter);
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
    bodyHTML = narrativeParagraphs(lines);
    actions = [
      `<button data-action="quest-storyline-arrive">Arrive at ${escapeHtml(locationLabel)}</button>`,
    ];
  } else if (story.phase === 'briefing') {
    const lines = [];
    lines.push(`${npcName} greets you at ${locationLabel}.`);
    lines.push(`${story.npc.role || 'Overseer'}: "We need help for ${story.duration.label}. Can you spare the time?"`);
    bodyHTML = narrativeParagraphs(lines);
    actions = [
      '<button data-action="quest-storyline-accept">Accept the shift</button>',
      '<button data-action="quest-storyline-decline">Decline</button>',
    ];
  } else if (story.phase === 'approach') {
    const lines = [];
    lines.push(`${npcName} outlines the tasks for ${story.duration.label}. How will you proceed?`);
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

function showQuestLogUI() {
  updateTopMenuIndicators();
  if (!currentCharacter) return;
  showBackButton();
  const questLog = ensureQuestLog(currentCharacter);
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
  html += '</div>';
  setMainHTML(html);
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
  ensureCharacterClock(newChar);
  currentProfile.characters[id] = newChar;
  currentProfile.lastCharacter = id;
  currentCharacter = newChar;
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
    ensureCollections(currentCharacter);
    ensureQuestLog(currentCharacter);
    ensureQuestHistory(currentCharacter);
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
  const iconFile = currentCharacter.sex === 'Male'
    ? 'Character Menu Male.png'
    : 'Character Menu Female.png';
  const characterIcon = document.getElementById('character-icon');
  if (characterIcon) {
    characterIcon.src = `assets/images/icons/${iconFile}`;
  }
  characterButton.style.display = 'inline-flex';
}

if (menuButton && dropdownMenu && characterMenu) {
  menuButton.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
    characterMenu.classList.remove('active');
  });
}
if (characterButton && dropdownMenu && characterMenu) {
  characterButton.addEventListener('click', () => {
    dropdownMenu.classList.remove('active');
    characterMenu.classList.toggle('active');
  });
}

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

// Initialization
selectProfile();
loadPreferences();
loadCharacter();

