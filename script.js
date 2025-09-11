import { SPELLBOOK, MILESTONES } from "./assets/data/spells.js";
import { WEAPON_SKILLS } from "./assets/data/weapon_skills.js";
import { characterTemplate } from "./assets/data/core.js";
import { gainProficiency, proficiencyCap } from "./assets/data/proficiency_base.js";
import { getRaceStartingAttributes, RACE_DESCRIPTIONS } from "./assets/data/race_attrs.js";
import { maxHP, maxMP, maxStamina } from "./assets/data/resources.js";
import {
  DENOMINATIONS,
  CURRENCY_VALUES,
  convertCurrency,
  toIron,
  fromIron,
  parseCurrency,
  createEmptyCurrency,
  formatCurrency,
} from "./assets/data/currency.js";
import { WEAPON_SLOTS, ARMOR_SLOTS, TRINKET_SLOTS } from "./assets/data/equipment.js";
import { LOCATIONS } from "./assets/data/locations.js";
import { HYBRID_RELATIONS } from "./assets/data/hybrid_relations.js";
import { CITY_NAV } from "./assets/data/city_nav.js";
import { composeImagePrompt } from "./assets/data/image_prompts.js";
import { DEFAULT_NAMES } from "./assets/data/names.js";
import { WAVES_BREAK_BACKSTORIES } from "./assets/data/waves_break_backstories.js";
import {
  elementalProficiencyMap,
  schoolProficiencyMap,
  HYBRID_MAP,
  applySpellProficiencyGain,
} from "./assets/data/spell_proficiency.js";
import { trainCraftSkill } from "./assets/data/trainer_proficiency.js";
import { performGathering } from "./assets/data/gathering_proficiency.js";
import { performOutdoorActivity } from "./assets/data/outdoor_skills.js";
import { performHunt } from "./assets/data/hunting_proficiency.js";
import {
  ADVENTURERS_GUILD_RANKS,
  determineOwnership,
  getJobRolesForBuilding,
  JOB_ROLE_DATA,
} from "./assets/data/buildings.js";
import { characterBuilds } from "./assets/data/character_builds.js";

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
window.LOCATIONS = LOCATIONS;
window.ADVENTURERS_GUILD_RANKS = ADVENTURERS_GUILD_RANKS;
window.performHunt = performHunt;

const NAV_ICONS = {
  location: '🗺️',
  district: '🏙️',
  building: '🏠',
  exit: '🚪',
  interaction: '⚙️',
};

const CITY_SLUGS = { "Wave's Break": "waves_break" };

const BACKSTORY_MAP = {
  "Wave's Break": WAVES_BREAK_BACKSTORIES,
};

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
let showDistricts = localStorage.getItem(SHOW_DISTRICTS_KEY) === 'true';

const body = document.body;
const main = document.querySelector('main');
const backButton = document.getElementById('back-button');
const topMenu = document.querySelector('.top-menu');
const app = document.getElementById('app');

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

function setMainHTML(html) {
  if (main) main.innerHTML = html;
  if (typeof mapContainer !== "undefined") mapContainer.style.display = "none";
  if (typeof mapToggleButton !== "undefined" && mapToggleButton) {
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
let profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
let currentProfileId = localStorage.getItem(LAST_PROFILE_KEY);
let currentProfile = currentProfileId ? profiles[currentProfileId] : null;
let currentCharacter = null;

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
  thunder: 0,
  dark: 0,
  light: 0,
  destructive: 0,
  healing: 0,
  reinforcement: 0,
  enfeebling: 0,
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
  herbalism: 0,
  mining: 0,
  foraging: 0,
  logging: 0,
  brewing: 0,
  drawing: 0,
  alchemy: 0,
  enchanting: 0,
  gardening: 0,
  farming: 0,
  weaving: 0,
  fletching: 0,
  glassblowing: 0,
  hunting: 0,
  pearlDiving: 0
};

function assignMagicAptitudes(character) {
  const aptitude = character.magicAptitude || 'low';
  const intStat = character.attributes?.current?.INT ?? 0;
  const wisStat = character.attributes?.current?.WIS ?? 0;
  const avgStat = (intStat + wisStat) / 2;
  // Stats at or below 10 reduce the chance while higher stats boost it
  const statMod = Math.max(0.5, 1 + (avgStat - 10) * 0.05);
  const elemChance = (aptitude === 'high' ? 0.3 : aptitude === 'med' ? 0.2 : 0.1) * statMod;
  const elemental = [
    'stone',
    'water',
    'wind',
    'fire',
    'ice',
    'thunder',
    'dark',
    'light'
  ];
  const baseSchoolChances = {
    destructive: 0.33,
    reinforcement: 0.33,
    enfeebling: 0.33,
    healing: 0.2,
    summoning: 0.1,
  };
  const schoolChances = {};
  for (const [key, chance] of Object.entries(baseSchoolChances)) {
    schoolChances[key] = chance * statMod;
  }

  // Determine if the character already has an elemental proficiency
  let hasElement = elemental.some(k => character[k] > 0);

  // Roll for elemental proficiencies; ensure at least one is granted
  if (!hasElement) {
    for (const key of elemental) {
      if (Math.random() < elemChance) {
        character[key] = 1;
        hasElement = true;
      }
    }
    // If none were assigned by chance, grant one random element
    if (!hasElement) {
      const randKey = elemental[Math.floor(Math.random() * elemental.length)];
      character[randKey] = 1;
      hasElement = true;
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
    thunderMagic: 'thunder',
    darkMagic: 'dark',
    lightMagic: 'light',
    destructiveMagic: 'destructive',
    healingMagic: 'healing',
    reinforcementMagic: 'reinforcement',
    enfeeblingMagic: 'enfeebling',
    summoningMagic: 'summoning',
  };
  for (const [oldKey, newKey] of Object.entries(magicMap)) {
    if (oldKey in character) {
      if (!(newKey in character)) character[newKey] = character[oldKey];
      delete character[oldKey];
    }
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
    'thunder',
    'dark',
    'light'
  ],
  'Magical Schools': [
    'destructive',
    'healing',
    'reinforcement',
    'enfeebling',
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
  Thunder: '<img src="assets/images/icons/Magic/Lightning.png" alt="Thunder" />',
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
  Thunder: '#eab308',
  Dark: '#1e1b4b',
  Light: '#e5e4e2'
};

const schoolIcons = {
  Destructive: '<img src="assets/images/icons/Magic/Destruction.png" alt="Destructive" />',
  Enfeebling: '<img src="assets/images/icons/Magic/Enfeeble.png" alt="Enfeebling" />',
  Reinforcement: '<img src="assets/images/icons/Magic/Enhance.png" alt="Reinforcement" />',
  Healing: '<img src="assets/images/icons/Magic/Healing.png" alt="Healing" />',
  Summoning: '<img src="assets/images/icons/Magic/Summoning.png" alt="Summoning" />',
  Dance: '<img src="assets/images/icons/Magic/Dance.png" alt="Dance" />',
  Instrument: '<img src="assets/images/icons/Magic/Instrument.png" alt="Instrument" />',
  Voice: '<img src="assets/images/icons/Magic/Voice.png" alt="Voice" />'
};
const elementOrder = ['Stone', 'Water', 'Wind', 'Fire', 'Ice', 'Thunder', 'Light', 'Dark'];
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
    currentProfile.characters[currentCharacter.id] = currentCharacter;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

const formatHeight = cm => {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}' ${inches}"`;
};

const showBackButton = () => (backButton.style.display = 'inline-flex');
const hideBackButton = () => (backButton.style.display = 'none');

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
  localStorage.setItem(LAST_PROFILE_KEY, id);
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
    while (!currentProfile) {
      createProfile();
    }
  } else {
    let choice = '';
    while (!currentProfile) {
      choice = prompt(`Select profile (${ids.map(id => profiles[id].name).join(', ')})\nEnter a new name to create one:`);
      if (choice === null) continue;
      const existingId = ids.find(id => profiles[id].name === choice);
      if (existingId) {
        currentProfileId = existingId;
        currentProfile = profiles[existingId];
        localStorage.setItem(LAST_PROFILE_KEY, currentProfileId);
      } else if (choice) {
        createProfile(choice);
      }
    }
  }
}

function showNavigation() {
  if (!currentCharacter) return;
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
    const defaultIcon = NAV_ICONS[type] || '📍';
    const iconHTML = icon
      ? `<img src="${icon}" alt="" class="nav-icon">`
      : `<span class="nav-icon">${defaultIcon}</span>`;
    const attrs = action ? `data-action="${action}"` : `data-target="${target}"`;
    const aria = prompt ? `${prompt} ${name}` : name;
    const dis = disabled ? 'disabled' : '';
    const cls = extraClass ? ` ${extraClass}` : '';
    const labelHTML = icon ? '' : `<span class="street-sign">${name}</span>`;
    return `<div class="nav-item${cls}"><button data-type="${type}" ${attrs} aria-label="${aria}" ${dis}>${iconHTML}</button>${labelHTML}</div>`;
  };
  if (pos.building) {
    const building = cityData.buildings[pos.building];
    const buttons = [];
    building.exits.forEach(e => {
      if (e.type === 'location') {
        buttons.push(
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
        buttons.push(
          createNavItem({ type: 'district', target: e.target, name: e.name, prompt, icon })
        );
      }
    });
    if (buttons.length && (building.interactions || []).length) {
      buttons.push('<div class="group-separator"></div>');
    }
    (building.interactions || []).forEach(i => {
      buttons.push(
        createNavItem({ type: 'interaction', action: i.action, name: i.name, icon: i.icon })
      );
    });
    const hours = building.hours;
    const descText = building.description;
    const descriptionHTML = descText ? `<p class="building-description">${descText}</p>` : '';
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
    const exits = [];
    const districts = [];
    const locals = [];
    district.points.forEach(pt => {
      if (pt.type === 'location') exits.push(pt);
      else if (pt.type === 'district') districts.push(pt);
      else locals.push(pt);
    });
    const makeButton = pt => {
      const prompt = pt.type === 'district' ? 'Travel to' : district.travelPrompt || 'Walk to';
      return createNavItem({
        type: pt.type,
        target: pt.target,
        name: pt.name,
        prompt,
        icon: pt.icon,
        extraClass: pt.extraClass,
      });
    };
    const groups = [];
    const exitGroup = exits.map(makeButton);
    const hasMultipleDistricts = Object.keys(cityData.districts).length > 1;
    const buildDistrictNav = () => {
      const layout = cityData.layout;
      const allNames = Object.keys(cityData.districts);
      if (showDistricts && layout && layout.positions) {
        const accessible = new Set(districts.map(d => d.name).concat(pos.district));
        const fontSize =
          parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const isLandscape = window.innerWidth > window.innerHeight;
        const iconRem = isLandscape ? 10 : 4.5;
        // Each district icon button is iconRem rem square, so space nodes accordingly
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
            const [r1, c1] = layout.positions[a];
            const [r2, c2] = layout.positions[b];
            const x1 = c1 * size + size / 2;
            const y1 = r1 * size + size / 2;
            const x2 = c2 * size + size / 2;
            const y2 = r2 * size + size / 2;
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
          })
          .join('');
        const width = layout.cols * size;
        const height = layout.rows * size;
        return [
          `<div class="district-map" style="width:${width}px;height:${height}px;"><svg class="district-connections" width="${width}" height="${height}">${lines}</svg>${nodes.join('')}</div>`,
        ];
      }
      const neighborButtons = districts.map(d =>
        makeButton({ ...d, extraClass: 'connected-district' })
      );
      const currentButton = createNavItem({
        type: 'district',
        target: pos.district,
        name: pos.district,
        icon: getDistrictIcon(pos.city, pos.district),
        disabled: true,
        extraClass: 'current-district',
      });
      return [currentButton, ...neighborButtons];
    };
    const mapToggle = createNavItem({
      type: 'map-toggle',
      action: 'toggle-city-map',
      name: 'City Map',
      icon: getCityIcon(pos.city),
    });
    if (hasMultipleDistricts) {
      const districtToggle = createNavItem({
        type: 'district-toggle',
        action: 'toggle-districts',
        name: 'Districts',
        icon: getDistrictsEnvelope(pos.city),
      });
      const districtNav = buildDistrictNav();
      const districtGroup = [mapToggle, districtToggle];
      if (showDistricts) {
        if (exitGroup.length) {
          exitGroup.unshift(...districtGroup);
        } else {
          groups.push(districtGroup);
        }
        if (districtNav.length) groups.push(districtNav);
      } else {
        districtGroup.push(...districtNav);
        if (exitGroup.length) {
          exitGroup.unshift(...districtGroup);
        } else {
          groups.push(districtGroup);
        }
      }
    } else {
      const districtNav = buildDistrictNav();
      if (exitGroup.length) {
        exitGroup.unshift(mapToggle);
      } else {
        groups.push([mapToggle]);
      }
      if (districtNav.length) groups.push(districtNav);
    }
    if (exitGroup.length) groups.push(exitGroup);
    const navButtons = [];
    groups.forEach(g => {
      if (g.length) {
        if (navButtons.length) navButtons.push('<div class="group-separator"></div>');
        navButtons.push(...g);
      }
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
    const localsHTML = locals.length
      ? `<div class="option-grid">${locals.map(makeButton).join('')}</div>`
      : '';
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
          localStorage.setItem(SHOW_DISTRICTS_KEY, showDistricts);
          showNavigation();
          return;
        } else if (action === 'toggle-city-map') {
          toggleCityMap(btn);
          return;
        }
        const type = btn.dataset.type;
        const target = btn.dataset.target;
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
        } else if (type === 'interaction') {
            if (action === 'train-glassblowing') {
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
  setMainHTML(`<div class="no-character"><h1>Start your journey...</h1><button id="new-character">New Character</button></div>`);
  document.getElementById('new-character').addEventListener('click', startCharacterCreation);
  updateMenuHeight();
}

function showCharacterSelectUI() {
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
        const schedule = e.schedule || data.schedule;
        const quota = e.quota || data.quota;
        let extra = '';
        if (schedule) extra = `Hours: ${schedule}`;
        else if (quota != null) extra = `Quota: ${(e.progress || 0)} / ${quota}`;
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

  const unlocked = [];
  for (const spell of SPELLBOOK) {
    const relation = HYBRID_MAP[spell.element];
    const schoolKey = schoolProficiencyMap[spell.school];
    const schoolValue = currentCharacter[schoolKey] ?? 0;
    let elemValue = 0;
    let parentUnlocked = true;
    if (relation) {
      const p1Key = elementalProficiencyMap[relation.parents[0].toLowerCase()];
      const p2Key = elementalProficiencyMap[relation.parents[1].toLowerCase()];
      const p1 = currentCharacter[p1Key] ?? 0;
      const p2 = currentCharacter[p2Key] ?? 0;
      elemValue = Math.min(p1, p2);
      parentUnlocked = p1 > 0 && p2 > 0;
    } else {
      const profKey = elementalProficiencyMap[spell.element.toLowerCase()];
      elemValue = currentCharacter[profKey] ?? 0;
    }
    if (parentUnlocked && elemValue >= spell.proficiency && schoolValue >= spell.proficiency) {
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

function showQuestBoardsUI() {
  if (!currentCharacter) return;
  showBackButton();
  const loc = LOCATIONS[currentCharacter.location];
  if (!loc) {
    setMainHTML('<div class="no-character"><h1>No quest boards found.</h1></div>');
    return;
  }
  const boards = Object.keys(loc.questBoards || {});
  if (!boards.length) {
    setMainHTML(`<div class="no-character"><h1>No quest boards in ${loc.name}</h1></div>`);
    return;
  }
  const createItem = name => {
    return `<div class="nav-item"><button data-board="${name}" aria-label="${name}"><span class="nav-icon">🪧</span></button><span class="street-sign">${name}</span></div>`;
  };
  const buttons = boards.map(createItem).join('');
  setMainHTML(`<div class="navigation"><h2>Quest Boards</h2><div class="option-grid">${buttons}</div></div>`);
  normalizeOptionButtonWidths();
  updateMenuHeight();
  if (main) {
    main.querySelectorAll('.option-grid button').forEach(btn => {
      btn.addEventListener('click', () => {
        const board = btn.dataset.board;
        showQuestBoardDetails(board);
      });
    });
  }
}

function showQuestBoardDetails(boardName) {
  if (!currentCharacter) return;
  showBackButton();
  const loc = LOCATIONS[currentCharacter.location];
  const quests = loc.questBoards[boardName] || [];
  let html = `<div class="questboard-detail navigation"><h2>${boardName}</h2>`;
  if (quests.length) {
    html += '<ul class="quest-list">';
    quests.forEach(q => {
      html += `<li class="quest-item"><h3>${q.title}</h3><p>${q.description}</p>`;
      html += '<ul class="quest-meta">';
      if (q.location) html += `<li><strong>Location:</strong> ${q.location}</li>`;
      if (q.requirements) html += `<li><strong>Requirements:</strong> ${Array.isArray(q.requirements) ? q.requirements.join(', ') : q.requirements}</li>`;
      if (q.conditions) html += `<li><strong>Conditions:</strong> ${Array.isArray(q.conditions) ? q.conditions.join(', ') : q.conditions}</li>`;
      if (q.timeline) html += `<li><strong>Timeline:</strong> ${q.timeline}</li>`;
      if (q.risks) html += `<li><strong>Risks:</strong> ${Array.isArray(q.risks) ? q.risks.join(', ') : q.risks}</li>`;
      if (q.reward) html += `<li><strong>Reward:</strong> ${q.reward}</li>`;
      html += '</ul></li>';
    });
    html += '</ul>';
  } else {
    html += '<p>No quests available.</p>';
  }
  html += '<div class="option-grid"><button id="return-questboards">Back to Boards</button></div></div>';
  setMainHTML(html);
  updateMenuHeight();
  const backBtn = document.getElementById('return-questboards');
  if (backBtn) backBtn.addEventListener('click', showQuestBoardsUI);
}

const SLOT_ICONS = {
  mainHand: '<svg viewBox="0 0 24 24"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" y1="19" x2="19" y2="13" /><line x1="16" y1="16" x2="20" y2="20" /><line x1="19" y1="21" x2="21" y2="19" /></svg>',
  offHand: '<svg viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>',
  ranged: '<svg viewBox="0 0 24 24"><path d="M17 3h4v4"/><path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17"/><path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05"/><path d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"/><path d="M9.707 14.293 21 3"/></svg>',
  instrument: '<svg viewBox="0 0 24 24"><path d="M6 3c4 9 10 12 10 19H6Z"/><path d="M6 7h8"/><path d="M6 11h9"/><path d="M6 15h8"/><path d="M6 19h6"/></svg>',
  ammo: '<svg viewBox="0 0 24 24"><path d="M3 12h14"/><polyline points="3 9 6 12 3 15"/><polyline points="17 7 23 12 17 17"/></svg>',
  head: '<svg viewBox="0 0 24 24"><path d="M2 10l4-2 3 3 3-6 3 6 3-3 4 2v8H2z"/></svg>',
  body: '<svg viewBox="0 0 24 24"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M12 2c3 1 5 4 5 8v12l-5-3-5 3V10c0-4 2-7 5-8z"/></svg>',
  hands: '<svg viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>',
  waist: '<svg viewBox="0 0 24 24"><path d="M2 10h20v4H2z"/><rect x="8" y="8" width="8" height="8" rx="1"/><path d="M14 12h4"/></svg>',
  legs: '<svg viewBox="0 0 24 24"><path d="M7 2h10l1 6h-5l1 14h-4l1-14H6z"/><path d="M12 8v14"/></svg>',
  feet: '<svg viewBox="0 0 24 24"><path d="M6 3v8H4v5h9l4 4h5v-4h-3l-3-3h-5V3H6z"/></svg>',
  lEar: '<svg viewBox="0 0 24 24"><g transform="scale(-1,1) translate(-24,0)"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/></g></svg>',
  neck: '<svg viewBox="0 0 24 24"><path d="M4 5a8 8 0 0 0 16 0"/><circle cx="12" cy="13" r="2"/><path d="M12 15v4"/></svg>',
  lRing: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>',
  pouch: '<svg viewBox="0 0 24 24"><path d="M4 7h16v10a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M4 7l8-4 8 4"/><rect x="9" y="11" width="6" height="3"/><path d="M12 11v3"/></svg>'
};
SLOT_ICONS.rEar = '<svg viewBox="0 0 24 24"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/></svg>';
SLOT_ICONS.rRing = SLOT_ICONS.lRing;

function formatSlotName(slot) {
  const names = {
    mainHand: 'Main Hand',
    offHand: 'Off Hand',
    lEar: 'Left Ear',
    rEar: 'Right Ear',
    lRing: 'Left Ring',
    rRing: 'Right Ring'
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
  if (!currentCharacter) return;
  updateScale();
  showBackButton();
  const { equipment } = currentCharacter;
  const buildList = (slots, group) =>
    slots
      .map(slot => {
        const item = equipment[group][slot];
        const icon = SLOT_ICONS[slot] || '';
        const name = item ? item.name : '';
        return `<li class="equipment-slot"><span class="slot-icon">${icon}</span><span class="slot-name">${formatSlotName(slot)}</span><span class="slot-item">${name}</span></li>`;
      })
      .join('');
  const weaponList = buildList(WEAPON_SLOTS, 'weapons');
  const armorList = buildList(ARMOR_SLOTS, 'armor');
  const trinketList = buildList(TRINKET_SLOTS, 'trinkets');
  setMainHTML(`<div class="equipment-screen">${equipmentSection('Weapons', weaponList)}${equipmentSection('Armor', armorList)}${equipmentSection('Trinkets', trinketList)}</div>`);
}

function startCharacterCreation() {
  updateScale();
  showBackButton();
  mapContainer.style.display = 'none';
  const saved = JSON.parse(localStorage.getItem(TEMP_CHARACTER_KEY) || '{}');
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
      localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
    }
    if (field && field.key === 'class' && !character.class) {
      character.class = classField.options[0];
      localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
    }
    if (field && field.key === 'location' && !character.location) {
      character.location = locationField.options[0];
    }
    if (field && field.key === 'backstory') {
      const bs = BACKSTORY_MAP[character.location] || [];
      if (!character.backstory && bs.length) {
        character.backstory = bs[0].background;
        localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
      }
    }

    const stepLabels = activeFields
      .map(f => FIELD_STEP_LABELS[f.key])
      .concat(['Name', 'Location', 'Backstory']);
    const isComplete = () =>
      activeFields.every(f => character[f.key]) && character.name && character.location && character.backstory;
    const progressHTML =
      stepLabels
        .map((label, i) => {
          const hasValue =
            i < activeFields.length
              ? character[activeFields[i].key]
              : i === activeFields.length
              ? character.name
              : i === activeFields.length + 1
              ? character.location
              : character.backstory;
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
      if (field && field.key === 'backstory' && character.backstory) {
        const bs = BACKSTORY_MAP[character.location] || [];
        const entry = bs.find(b => b.background === character.backstory);
        const descHTML = entry
          ? `<div class="race-description">${replaceCharacterRefs(entry.past, character)}</div>`
          : '';
        return { descHTML };
      }
      if (field && field.key === 'class' && character.class) {
        const build = buildEntries.find(b => b.primary === character.class);
        if (!build) return {};
        const baseAttrs = { ...getRaceStartingAttributes(character.race), LCK: 10 };
        for (const [k, v] of Object.entries(build.stats)) {
          baseAttrs[k] = (baseAttrs[k] || 0) + v;
        }
        const resources = {
          HP: maxHP(baseAttrs.VIT, 1),
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
        HP: maxHP(attrs.VIT, 1),
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
          const options = (BACKSTORY_MAP[character.location] || []).map(b => b.background);
          let index = options.indexOf(character.backstory);
          if (index === -1) {
            index = 0;
            character.backstory = options[0];
          }
          inputHTML = `
            <div class="backstory-carousel wheel-selector">
              <button class="backstory-arrow left" aria-label="Previous">&#x2039;</button>
              <button class="option-button backstory-button">${character.backstory}</button>
              <button class="backstory-arrow right" aria-label="Next">&#x203A;</button>
            </div>`;
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
          localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
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
          localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
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
          localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
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
          localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
          renderStep();
        };
        document.querySelector('.class-arrow.left').addEventListener('click', () => change(-1));
        document.querySelector('.class-arrow.right').addEventListener('click', () => change(1));
      } else if (field.key === 'backstory') {
        const options = (BACKSTORY_MAP[character.location] || []).map(b => b.background);
        let index = options.indexOf(character.backstory);
        const change = dir => {
          index = (index + dir + options.length) % options.length;
          character.backstory = options[index];
          localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
          renderStep();
        };
        document.querySelector('.backstory-arrow.left').addEventListener('click', () => change(-1));
        document.querySelector('.backstory-arrow.right').addEventListener('click', () => change(1));
      } else if (field.key === 'characterImage') {
        const files =
          (CHARACTER_IMAGE_FILES[character.race] || {})[character.sex] || [];
        if (files.length) {
          let index = files.indexOf(character.characterImage);
          const change = dir => {
            index = (index + dir + files.length) % files.length;
            character.characterImage = files[index];
            ccPortraitZoom = 1;
            localStorage.setItem(
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
            localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
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
          localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
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
        localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
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
      localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
      const folder = `assets/images/Race Photos/${character.race} ${character.sex}`;
      character.image = `${folder}/${character.characterImage || ''}`;
      finalizeCharacter(character);
    });

    document.querySelectorAll('.progress-step').forEach(el => {
      const index = parseInt(el.dataset.step, 10);
      el.addEventListener('click', () => {
        step = index;
        localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
        renderStep();
      });
    });

    document.getElementById('cc-cancel').addEventListener('click', () => {
      if (confirm('Cancel character creation?')) {
        localStorage.removeItem(TEMP_CHARACTER_KEY);
        showMainUI();
      }
    });
  }
}

async function generateCharacterImage(character) {
  const prompt = composeImagePrompt(character);
  let apiKey = localStorage.getItem('openaiApiKey');
  if (!apiKey) {
    apiKey = prompt('Enter OpenAI API key:');
    if (apiKey) localStorage.setItem('openaiApiKey', apiKey);
  }
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size: '512x512',
      response_format: 'b64_json'
    })
  });
  if (!res.ok) throw new Error('Image generation failed');
  const data = await res.json();
  const img = data.data[0].b64_json;
  return img.startsWith('http') ? img : `data:image/png;base64,${img}`;
}

async function generatePortrait(character, callback) {
  setMainHTML(`<div class="no-character"><h1>Generating portrait...</h1><div class="progress"><div class="progress-bar" id="portrait-progress"></div></div></div>`);

  let progress = 0;
  const progressBar = document.getElementById('portrait-progress');
  const progressInterval = setInterval(() => {
    progress = (progress + 1) % 101;
    progressBar.style.width = progress + '%';
  }, 100);

  try {
    const src = await generateCharacterImage(character);
    clearInterval(progressInterval);
    callback(src);
  } catch (err) {
    console.error(err);
    clearInterval(progressInterval);
    callback('https://placehold.co/512x512?text=Portrait');
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
    maxHP: maxHP(attrBlock.VIT, 1),
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
        schedule: job.schedule || JOB_ROLE_DATA[job.role]?.schedule || null,
        quota: job.quota || JOB_ROLE_DATA[job.role]?.quota || null,
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
  assignMagicAptitudes(newChar);
  currentProfile.characters[id] = newChar;
  currentProfile.lastCharacter = id;
  currentCharacter = newChar;
  saveProfiles();
  updateScale();
  showCharacter();
  localStorage.removeItem(TEMP_CHARACTER_KEY);
}

function loadCharacter() {
  const charId = currentProfile?.lastCharacter;
  if (charId && currentProfile.characters && currentProfile.characters[charId]) {
    currentCharacter = migrateProficiencies({
      ...JSON.parse(JSON.stringify(characterTemplate)),
      ...defaultProficiencies,
      ...currentProfile.characters[charId]
    });
    showCharacter();
  } else if (localStorage.getItem(TEMP_CHARACTER_KEY)) {
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

const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');
settingsButton.addEventListener('click', () => {
  settingsPanel.classList.toggle('active');
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themes = ['light', 'dark', 'sepia'];
let currentThemeIndex = themes.indexOf(
  [...body.classList].find(c => c.startsWith('theme-')).replace('theme-', '')
);
const setTheme = index => {
  body.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
  const theme = themes[index];
  body.classList.add(`theme-${theme}`);
  savePreference('theme', theme);
};
themeToggle.addEventListener('click', () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  setTheme(currentThemeIndex);
});

// UI scale buttons
let uiScale = 1;
const updateScale = () => {
  document.documentElement.style.setProperty('--ui-scale', uiScale);
  savePreference('uiScale', uiScale);
  updateMenuHeight();
};
document.getElementById('scale-dec').addEventListener('click', () => {
  uiScale = Math.max(0.5, uiScale - 0.1);
  updateScale();
});
document.getElementById('scale-inc').addEventListener('click', () => {
  uiScale = Math.min(2, uiScale + 0.1);
  updateScale();
});

// Dropdown menu
const menuButton = document.getElementById('menu-button');
const characterButton = document.getElementById('character-button');
const dropdownMenu = document.getElementById('dropdownMenu');
const characterMenu = document.getElementById('characterMenu');
const mapContainer = document.createElement('div');
mapContainer.id = 'map-container';
app.appendChild(mapContainer);
let mapToggleButton = null;
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

menuButton.addEventListener('click', () => {
  dropdownMenu.classList.toggle('active');
  characterMenu.classList.remove('active');
});
characterButton.addEventListener('click', () => {
  dropdownMenu.classList.remove('active');
  characterMenu.classList.toggle('active');
});

dropdownMenu.addEventListener('click', e => {
  const action = e.target.dataset.action;
  if (!action) return;
  dropdownMenu.classList.remove('active');
  if (action === 'new-character') {
    startCharacterCreation();
  } else if (action === 'character-select') {
    showCharacterSelectUI();
  } else {
    showBackButton();
    setMainHTML(`<div class="no-character"><h1>${action} not implemented</h1></div>`);
  }
});

characterMenu.addEventListener('click', e => {
  const action = e.target.dataset.action;
  if (!action) return;
  characterMenu.classList.remove('active');
  if (action === 'profile') {
    showCharacterUI();
  } else if (action === 'equipment') {
    showEquipmentUI();
  } else if (action === 'spellbook') {
    showSpellbookUI();
  } else if (action === 'proficiencies') {
    showProficienciesUI();
  } else if (action === 'buildings') {
    showBuildingsUI();
  } else if (action === 'quests') {
    showQuestBoardsUI();
  } else {
    showBackButton();
    setMainHTML(`<div class="no-character"><h1>${action} not implemented</h1></div>`);
  }
});

backButton.addEventListener('click', () => {
  dropdownMenu.classList.remove('active');
  characterMenu.classList.remove('active');
  showMainUI();
});

// Initialization
selectProfile();
loadPreferences();
loadCharacter();

