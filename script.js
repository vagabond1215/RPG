import { SPELLBOOK } from "./assets/data/spells.js";
import { WEAPON_SKILLS } from "./assets/data/weapon_skills.js";
import { characterTemplate, gainProficiency, proficiencyCap } from "./assets/data/core.js";
import { getRaceStartingAttributes, RACE_DESCRIPTIONS } from "./assets/data/race_attrs.js";
import { maxHP, maxMP, maxStamina } from "./assets/data/resources.js";
import { DENOMINATIONS, CURRENCY_VALUES, convertCurrency, toIron, fromIron } from "./assets/data/currency.js";
import { WEAPON_SLOTS, ARMOR_SLOTS, TRINKET_SLOTS } from "./assets/data/equipment.js";
import { LOCATIONS } from "./assets/data/locations.js";

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
window.LOCATIONS = LOCATIONS;

const body = document.body;
const main = document.querySelector('main');
const backButton = document.getElementById('back-button');
const topMenu = document.querySelector('.top-menu');
const app = document.getElementById('app');

function updateLayoutSize() {
  if (!app) return;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let width = vw;
  let height = vh;
  if (body.classList.contains('layout-landscape')) {
    const aspect = 16 / 9;
    width = Math.min(vw, vh * aspect);
    height = width / aspect;
  } else if (body.classList.contains('layout-portrait')) {
    const aspect = 9 / 16;
    height = vh;
    width = Math.min(vw, vh * aspect);
  }
  app.style.width = `${width}px`;
  app.style.height = `${height}px`;
}

function updateMenuHeight() {
  if (!topMenu) return;
  const height = topMenu.offsetHeight;
  document.documentElement.style.setProperty('--menu-height', `${height}px`);
  updateLayoutSize();
}
window.addEventListener('resize', updateMenuHeight);
updateMenuHeight();

function setMainHTML(html) {
  if (main) main.innerHTML = html;
}

function isPortraitLayout() {
  return (
    body.classList.contains('layout-portrait') ||
    (body.classList.contains('layout-auto') && window.innerHeight > window.innerWidth)
  );
}

function normalizeOptionButtonWidths() {
  const grid = document.querySelector('.option-grid');
  if (!grid) return;
  const buttons = Array.from(grid.querySelectorAll('button'));
  let maxWidth = 0;
  buttons.forEach(btn => {
    btn.style.width = 'auto';
    const w = btn.getBoundingClientRect().width;
    if (w > maxWidth) maxWidth = w;
  });
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
  '#000000', '#1c1c1c', '#2c1b10', '#3a2518', '#4b2e1f',
  '#5c3a23', '#663300', '#7b481b', '#8b4513', '#a0522d',
  '#b5651d', '#c68642', '#d2b48c', '#deb887', '#e6c68a',
  '#f0d59c', '#f5deb3', '#fff5e1', '#d8b9a8', '#c04000',
  '#b22222', '#a52a2a', '#808080', '#c0c0c0', '#ffffff'
];

const elfHairColors = [
  '#000000', '#2c1b10', '#4b2e1f', '#663300', '#8b4513',
  '#a0522d', '#b5651d', '#c68642', '#d2b48c', '#deb887',
  '#e6c68a', '#f0d59c', '#f5deb3', '#fff5e1', '#c0c0c0',
  '#e0e0e0', '#ffffff', '#c8a2c8', '#b19cd9', '#87cefa',
  '#6495ed', '#98fb98', '#6b8e23', '#dda0dd', '#9370db'
];

const darkElfHairColors = [
  '#000000', '#1c1c1c', '#2f2f2f', '#4b4b4b', '#696969',
  '#808080', '#a9a9a9', '#c0c0c0', '#dcdcdc', '#ffffff',
  '#d8bfd8', '#dda0dd', '#ee82ee', '#ba55d3', '#9370db',
  '#8a2be2', '#7b68ee', '#6a5acd', '#483d8b', '#4169e1',
  '#4682b4', '#5f9ea0', '#708090', '#b0c4de', '#e6e6fa'
];

const dwarfHairColors = [
  '#2c1b10', '#3a2518', '#4b2e1f', '#5c3a23', '#663300',
  '#7b481b', '#8b4513', '#a0522d', '#b5651d', '#c68642',
  '#d2b48c', '#deb887', '#e6c68a', '#c04000', '#a52a2a',
  '#b22222', '#8b0000', '#800000', '#cd5c5c', '#d2691e',
  '#f4a460', '#808080', '#a9a9a9', '#c0c0c0', '#ffffff'
];

const caitSithHairColors = [
  '#000000', '#1c1c1c', '#2f2f2f', '#4b4b4b', '#696969',
  '#808080', '#a9a9a9', '#c0c0c0', '#dcdcdc', '#ffffff',
  '#2c1b10', '#4b2e1f', '#663300', '#8b4513', '#a0522d',
  '#b5651d', '#c68642', '#d2b48c', '#deb887', '#e6c68a',
  '#ff8c00', '#ffa500', '#ffd700', '#f4a460', '#d2691e'
];

const salamanderHairColors = [
  '#000000', '#1c1c1c', '#2c1b10', '#3b1b0b', '#4b1f0f',
  '#5c1f0f', '#6b220f', '#7b240f', '#8b250f', '#a52a2a',
  '#b22222', '#c04000', '#cd5c5c', '#d2691e', '#e25822',
  '#e9967a', '#f4a460', '#ffa500', '#ff8c00', '#ff7f00',
  '#ffd700', '#ffff00', '#ffffe0', '#808080', '#c0c0c0'
];

const gnomeHairColors = [
  '#000000', '#2c1b10', '#4b2e1f', '#663300', '#8b4513',
  '#a0522d', '#b5651d', '#c68642', '#d2b48c', '#deb887',
  '#e6c68a', '#f0d59c', '#f5deb3', '#fff5e1', '#ff69b4',
  '#ff1493', '#ffa07a', '#98fb98', '#00ced1', '#1e90ff',
  '#9932cc', '#8a2be2', '#dda0dd', '#808080', '#ffffff'
];

const halflingHairColors = humanHairColors;

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
  '#000000', '#2c1b10', '#3b3024', '#4e3826', '#5b3a21',
  '#6b4423', '#8b4513', '#a0522d', '#b8860b', '#8e7618',
  '#8b8f45', '#556b2f', '#355e3b', '#2e8b57', '#000080',
  '#0000ff', '#1e90ff', '#87cefa', '#708090', '#778899',
  '#8b0000', '#9932cc', '#8a2be2', '#daa520', '#ffbf00'
];

const elfEyeColors = [
  '#000000', '#2c1b10', '#3b3024', '#4e3826', '#5b3a21',
  '#8b4513', '#a0522d', '#b8860b', '#daa520', '#8e7618',
  '#8b8f45', '#556b2f', '#355e3b', '#2e8b57', '#0000ff',
  '#1e90ff', '#87cefa', '#6495ed', '#7fffd4', '#98fb98',
  '#dda0dd', '#9932cc', '#8a2be2', '#c0c0c0', '#ffffff'
];

const darkElfEyeColors = [
  '#000000', '#1c1c1c', '#2f2f2f', '#4b4b4b', '#696969',
  '#808080', '#a9a9a9', '#c0c0c0', '#dcdcdc', '#ffffff',
  '#8b0000', '#b22222', '#c04000', '#cd5c5c', '#800080',
  '#8b008b', '#9932cc', '#8a2be2', '#9370db', '#708090',
  '#778899', '#ba55d3', '#dda0dd', '#e6e6fa', '#ff1493'
];

const dwarfEyeColors = [
  '#000000', '#2c1b10', '#3b3024', '#4e3826', '#5b3a21',
  '#6b4423', '#8b4513', '#a0522d', '#b8860b', '#8e7618',
  '#8b8f45', '#556b2f', '#355e3b', '#2e8b57', '#2f4f4f',
  '#000080', '#0000ff', '#1e90ff', '#708090', '#778899',
  '#8b0000', '#a52a2a', '#b22222', '#c0c0c0', '#ffffff'
];

const caitSithEyeColors = [
  '#000000', '#2c1b10', '#3b3024', '#4e3826', '#5b3a21',
  '#6b4423', '#8b4513', '#a0522d', '#b8860b', '#daa520',
  '#ffd700', '#ffbf00', '#ffa500', '#adff2f', '#7fff00',
  '#7fffd4', '#00ced1', '#1e90ff', '#0000ff', '#000080',
  '#355e3b', '#2e8b57', '#556b2f', '#708090', '#ffffff'
];

const salamanderEyeColors = [
  '#000000', '#1c1c1c', '#2c1b10', '#3b1b0b', '#4b1f0f',
  '#5c1f0f', '#6b220f', '#7b240f', '#8b250f', '#a52a2a',
  '#b22222', '#c04000', '#cd5c5c', '#d2691e', '#e25822',
  '#e9967a', '#f4a460', '#ffa500', '#ff8c00', '#ff7f00',
  '#ffd700', '#ffff00', '#ffffe0', '#c0c0c0', '#ffffff'
];

const gnomeEyeColors = [
  '#000000', '#2c1b10', '#3b3024', '#4e3826', '#5b3a21',
  '#6b4423', '#8b4513', '#a0522d', '#b8860b', '#8e7618',
  '#8b8f45', '#556b2f', '#355e3b', '#2e8b57', '#00ced1',
  '#1e90ff', '#0000ff', '#8a2be2', '#9932cc', '#dda0dd',
  '#ff1493', '#ff69b4', '#708090', '#778899', '#ffffff'
];

const halflingEyeColors = humanEyeColors;

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

const skinColorOptionsByRace = {
  Human: generateColorScale('#f5cba7', '#8d5524'),
  Elf: generateColorScale('#ffdbac', '#c68642'),
  'Dark Elf': generateColorScale('#d1c4e9', '#7e57c2'),
  Dwarf: generateColorScale('#f1c27d', '#8d5524'),
  'Cait Sith': generateColorScale('#f1e0c5', '#8c5a2b'),
  Salamander: generateColorScale('#f4a460', '#8b4513'),
  Gnome: generateColorScale('#ffdead', '#d2b48c'),
  Halfling: generateColorScale('#f5cba7', '#8d5524')
};

const RACE_IMAGES = {
  Human: 'assets/images/Race%20Photos/Human%20Male%20and%20Female.png',
  Elf: 'assets/images/Race%20Photos/Elven%20Male%20and%20Female.png',
  'Dark Elf': 'assets/images/Race%20Photos/Dark%20Elf%20Male%20and%20Female.png',
  Dwarf: 'assets/images/Race%20Photos/Dwarven%20Male%20and%20Female.png',
  'Cait Sith': 'assets/images/Race%20Photos/Cait%20Sith%20Male%20and%20Female.png',
  Salamander: 'assets/images/Race%20Photos/Salamander%20Male%20and%20Female.png',
  Gnome: 'assets/images/Race%20Photos/Gnome%20Male%20and%20Female.png',
  Halfling: 'assets/images/Race%20Photos/Halfling%20Male%20and%20Female.png'
};

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
  dualWield: 0
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
  'Non Combat': ['singing', 'instrument', 'dancing']
};

const elementalProficiencyMap = {
  stone: 'stone',
  water: 'water',
  wind: 'wind',
  fire: 'fire',
  ice: 'ice',
  thunder: 'thunder',
  dark: 'dark',
  light: 'light'
};
const ELEMENTAL_MAGIC_KEYS = Object.values(elementalProficiencyMap);
const schoolProficiencyMap = {
  Destructive: 'destructive',
  Healing: 'healing',
  Reinforcement: 'reinforcement',
  Enfeebling: 'enfeebling',
  Summoning: 'summoning'
};
const SCHOOL_MAGIC_KEYS = Object.values(schoolProficiencyMap);

const elementIcons = {
  Stone: '🪨',
  Water: '💧',
  Wind: '🌬️',
  Fire: '🔥',
  Ice: '❄️',
  Thunder: '⚡',
  Dark: '🌑',
  Light: '☀️'
};

const schoolIcons = {
  Destructive: '💥',
  Enfeebling:
    '<span class="icon enfeeble"><span class="arrow">⬇</span></span>',
  Reinforcement:
    '<span class="icon reinforce"><span class="arrow">⬆</span></span>',
  Healing:
    '<span class="icon heal"><span class="arrow">+</span></span>',
  Summoning: '<span class="icon slime"></span>'
};

let spellSortModes = {};

function getProficiencySortIcon(dir) {
  const arrow = dir === 'desc' ? '↓' : '↑';
  return `#${arrow}`;
}

function getTypeSortIcon(dir) {
  const arrow = dir === 'desc' ? '↓' : '↑';
  return (
    `<span class="type-icon">` +
    `<svg viewBox="0 0 24 24">` +
    `<g class="cw"><polyline points="23 4 23 10 17 10"/><path d="M3.51 9a9 9 0 0 1 14.13-5.36L23 10"/></g>` +
    `<g class="ccw"><polyline points="1 20 1 14 7 14"/><path d="M20.49 15a9 9 0 0 1-14.13 5.36L1 14"/></g>` +
    `</svg>${arrow}</span>`
  );
}

function applySpellProficiencyGain(character, spell, params) {
  if (!character || !spell) return;
  const elemKey = elementalProficiencyMap[spell.element?.toLowerCase()];
  if (elemKey) {
    character[elemKey] = gainProficiency({
      P: character[elemKey],
      ...params,
    });
  }
  const schoolKey = schoolProficiencyMap[spell.school];
  if (schoolKey) {
    character[schoolKey] = gainProficiency({
      P: character[schoolKey],
      ...params,
    });
  }
}

const saveProfiles = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));

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

function showCharacter() {
  if (!currentCharacter) return;
  hideBackButton();
  updateCharacterButton();
  updateMapButton();
  const town = currentCharacter.location || '';
  setMainHTML(`<div class="no-character"><h1>Welcome, ${currentCharacter.name}</h1><p>You awaken in the town of ${town}.</p></div>`);
}

function showNoCharacterUI() {
  hideBackButton();
  updateCharacterButton();
  updateMapButton();
  setMainHTML(`<div class="no-character"><h1>Start your journey...</h1><button id="new-character">New Character</button></div>`);
  document.getElementById('new-character').addEventListener('click', startCharacterCreation);
  updateMenuHeight();
}

function showCharacterSelectUI() {
  showBackButton();
  updateMapButton();
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
        spellSortModes = currentCharacter.spellSort || {};
        saveProfiles();
        showMainUI();
      });
    });
  }
}

function showMainUI() {
  creationScaleOffset = 0;
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
  const portrait = `<img src="${c.image || ''}" alt="portrait" style="width:10rem;height:10rem;${c.image ? '' : 'display:none;'}">`;
  const info = `
    <div class="info-block">
      <div>Race: ${c.race}</div>
      <div>Sex: ${c.sex}</div>
      <div class="physical-group">
        <div>Skin Color: <span class="color-box" style="background:${c.skinColor}"></span></div>
        <div>Hair Color: <span class="color-box" style="background:${c.hairColor}"></span></div>
        <div>Eye Color: <span class="color-box" style="background:${c.eyeColor}"></span></div>
        <div>Height: ${formatHeight(c.height)}</div>
      </div>
    </div>
  `;
  const stats = c.attributes?.current || {};
  const statsList = ['STR','DEX','CON','VIT','AGI','INT','WIS','CHA','LCK']
    .map(attr => `<li>${attr}: ${stats[attr] ?? 0}</li>`)
    .join('');
  const statsHTML = `<h2>Current Stats</h2><ul class="stats-list">${statsList}</ul>`;
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
  setMainHTML(`
    <div class="character-profile">
      <h1>${c.name}</h1>
      <div class="profile-grid">
        <div class="portrait-section">
          <div class="portrait-wrapper">${portrait}</div>
          ${resourceBars}
        </div>
        <div>
          ${info}
          ${statsHTML}
        </div>
      </div>
      <button id="delete-character">Delete Character</button>
    </div>`);
  document.getElementById('delete-character').addEventListener('click', () => {
    delete currentProfile.characters[c.id];
    currentProfile.lastCharacter = null;
    currentCharacter = null;
    spellSortModes = {};
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
  content.innerHTML = `<h3>${spell.name}</h3><p>${desc}</p><p>Element: ${spell.element}</p><p>School: ${spell.school}</p><p>Base Power: ${spell.basePower}</p><p>MP Cost: ${spell.mpCost}</p>`;
  const close = document.createElement('button');
  close.textContent = 'Close';
  close.addEventListener('click', () => overlay.remove());
  content.appendChild(close);
  overlay.appendChild(content);
  document.body.appendChild(overlay);
}

function showSpellbookUI() {
  if (!currentCharacter) return;
  showBackButton();
  const spellsByElement = {};
  const elements = ['Stone','Water','Wind','Fire','Ice','Thunder','Dark','Light'];
  for (const spell of SPELLBOOK) {
    const profKey = elementalProficiencyMap[spell.element.toLowerCase()];
    const schoolKey = schoolProficiencyMap[spell.school];
    const elemValue = currentCharacter[profKey] ?? 0;
    const schoolValue = currentCharacter[schoolKey] ?? 0;
    if (elemValue >= spell.proficiency && schoolValue >= spell.proficiency) {
      (spellsByElement[spell.element] ||= []).push(spell);
    }
  }
  let html = '<div class="spellbook-screen"><h1>Spellbook</h1>';
  let any = false;
  elements.forEach(el => {
    const spells = spellsByElement[el];
    if (!spells || !spells.length) return;
    any = true;
    const state = spellSortModes[el] || { mode: 'prof', dir: 'asc' };
    const mode = state.mode;
    const dir = state.dir;
    const eIcon = elementIcons[el] || '';
    const profActive = mode === 'prof' ? ' active' : '';
    const typeActive = mode === 'school' ? ' active' : '';
    const profIcon = getProficiencySortIcon(mode === 'prof' ? dir : 'asc');
    const typeIcon = getTypeSortIcon(mode === 'school' ? dir : 'asc');
    html += `<section class="spellbook-element"><h2><span class="element-title"><span class="element-icon">${eIcon}</span>${el}</span><span class="sort-buttons"><button class="sort-button${profActive}" data-el="${el}" data-mode="prof" aria-label="Sort by proficiency">${profIcon}</button><button class="sort-button${typeActive}" data-el="${el}" data-mode="school" aria-label="Sort by type">${typeIcon}</button></span></h2>`;

    let grouped = {};
    if (mode === 'school') {
      spells.sort((a, b) => a.school.localeCompare(b.school) || a.proficiency - b.proficiency);
      if (dir === 'desc') spells.reverse();
      for (const spell of spells) {
        (grouped[spell.school] ||= []).push(spell);
      }
      Object.keys(grouped)
        .sort((a, b) => (dir === 'asc' ? a.localeCompare(b) : b.localeCompare(a)))
        .forEach(key => {
          const sIcon = schoolIcons[key] || '';
          html += `<h3 class="spell-subheading"><span class="school-icon">${sIcon}</span>${key}</h3><ul class="spell-list">`;
          grouped[key].forEach(spell => {
            html += `<li class="spell-item"><button class="spell-name" data-spell-id="${spell.id}">${spell.name}</button> <span class="spell-req">(P${spell.proficiency})</span></li>`;
          });
          html += '</ul>';
        });
    } else {
      spells.sort((a, b) => (dir === 'asc' ? a.proficiency - b.proficiency : b.proficiency - a.proficiency));
      for (const spell of spells) {
        (grouped[spell.proficiency] ||= []).push(spell);
      }
      Object.keys(grouped)
        .map(Number)
        .sort((a, b) => (dir === 'asc' ? a - b : b - a))
        .forEach(key => {
          html += `<h3 class="spell-subheading">P${key}</h3><ul class="spell-list">`;
          grouped[key].forEach(spell => {
            html += `<li class="spell-item"><button class="spell-name" data-spell-id="${spell.id}">${spell.name}</button> <span class="spell-req">(P${spell.proficiency})</span></li>`;
          });
          html += '</ul>';
        });
    }
    html += '</section>';
  });
  if (!any) {
    html += '<p>No spells known.</p>';
  }
  html += '</div>';
  setMainHTML(html);
  document.querySelectorAll('.spell-name').forEach(btn => {
    const id = btn.dataset.spellId;
    const spell = SPELLBOOK.find(s => s.id === id);
    btn.addEventListener('click', () => showSpellDetails(spell));
  });
  document.querySelectorAll('.sort-button').forEach(btn => {
    const el = btn.dataset.el;
    const mode = btn.dataset.mode;
    btn.addEventListener('click', () => {
      const state = spellSortModes[el] || { mode: 'prof', dir: 'asc' };
      if (state.mode === mode) {
        state.dir = state.dir === 'asc' ? 'desc' : 'asc';
      } else {
        state.mode = mode;
        state.dir = 'asc';
      }
      spellSortModes[el] = state;
      if (currentCharacter) {
        currentCharacter.spellSort = spellSortModes;
        saveProfiles();
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

const SLOT_ICONS = {
  mainHand: '<svg viewBox="0 0 24 24"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" y1="19" x2="19" y2="13" /><line x1="16" y1="16" x2="20" y2="20" /><line x1="19" y1="21" x2="21" y2="19" /></svg>',
  offHand: '<svg viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>',
  ranged: '<svg viewBox="0 0 24 24"><path d="M17 3h4v4"/><path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17"/><path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05"/><path d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"/><path d="M9.707 14.293 21 3"/></svg>',
  instrument: '<svg viewBox="0 0 24 24"><circle cx="8" cy="17" r="5"/><path d="M11 14 20 5"/><path d="M19 6v4"/><path d="M15 2h4v4"/></svg>',
  ammo: '<svg viewBox="0 0 24 24"><path d="M3 12h14"/><polyline points="3 9 6 12 3 15"/><polyline points="17 7 23 12 17 17"/></svg>',
  head: '<svg viewBox="0 0 24 24"><path d="M2 10l4-2 3 3 3-6 3 6 3-3 4 2v8H2z"/></svg>',
  body: '<svg viewBox="0 0 24 24"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M6 2l12 4v16l-6-4-6 4V2z"/></svg>',
  hands: '<svg viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>',
  waist: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="5"/><rect x="8" y="9" width="8" height="6" rx="1"/><path d="M8 12h8"/></svg>',
  legs: '<svg viewBox="0 0 24 24"><path d="M6 2h12l-2 20h-4l-2-10-2 10H8z"/></svg>',
  feet: '<svg viewBox="0 0 24 24"><path d="M5 3v6H3v7h8v-4l4-5-2-1-3 2H8V3H5z"/><g transform="translate(24,0) scale(-1,1)"><path d="M5 3v6H3v7h8v-4l4-5-2-1-3 2H8V3H5z"/></g></svg>',
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
  creationScaleOffset = 0.1;
  updateScale();
  showBackButton();
  mapButton.style.display = 'none';
  mapContainer.style.display = 'none';
  const saved = JSON.parse(localStorage.getItem(TEMP_CHARACTER_KEY) || '{}');
  const character = saved.character || {};
  const locationField = {
    key: 'location',
    label: 'Choose your starting location',
    type: 'select',
    options: Object.keys(LOCATIONS).filter(l => l !== 'Duvilia Kingdom')
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
    { key: 'skinColor', label: 'Choose your skin color', type: 'color' },
    { key: 'hairColor', label: 'Choose your hair color', type: 'color' },
    { key: 'eyeColor', label: 'Choose your eye color', type: 'color' },
    { key: 'height', label: 'Choose your height', type: 'range' }
  ];

  const stepLabels = ['Race', 'Sex', 'Skin', 'Hair', 'Eyes', 'Height', 'Name', 'Location'];

  const heightRanges = {
    Human: [150, 200],
    Elf: [150, 190],
    'Dark Elf': [150, 190],
    Dwarf: [120, 150],
    'Cait Sith': [140, 180],
    Salamander: [160, 210],
    Gnome: [100, 130],
    Halfling: [90, 120]
  };

  let step = saved.step || 0;
  renderStep();

  function renderStep() {
    const isComplete = () =>
      fields.every(f => character[f.key]) && character.name && character.location;
    const progressHTML =
      stepLabels
        .map((label, i) => {
          const hasValue =
            i < fields.length
              ? character[fields[i].key]
              : i === fields.length
              ? character.name
              : character.location;
          let cls = 'clickable';
          if (i === step) cls = 'current clickable';
          else if (hasValue) cls = 'completed clickable';
          return `<div class="progress-step ${cls}" data-step="${i}"><div class="circle"></div><span>${label}</span></div>`;
        })
        .join('') +
      `<button id="cc-complete" class="complete-button" ${isComplete() ? '' : 'disabled'}></button>` +
      '<button id="cc-cancel" title="Cancel">✖</button>';

    let field;
    if (step < fields.length) field = fields[step];
    else if (step === fields.length + 1) field = locationField;
    if (field && field.key === 'race' && !character.race) {
      character.race = field.options[0];
      localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
    }
    if (step === fields.length + 1 && !character.location) {
      character.location = locationField.options[0];
    }
    const displayData = (() => {
      if (field && field.key === 'location' && character.location) {
        const loc = LOCATIONS[character.location];
        if (!loc) return {};
        const imageHTML = `<img class="race-image" src="${loc.map}" alt="${character.location}">`;
        const descHTML = `<div class="race-description">${loc.description || ''}</div>`;
        return { imageHTML, descHTML };
      }
      if (!character.race) return {};
      const attrs = getRaceStartingAttributes(character.race);
      const resources = {
        HP: maxHP(attrs.VIT, 1),
        MP: maxMP(attrs.WIS, 1),
        ST: maxStamina(attrs.CON, 1)
      };
      const attrList = Object.entries({ ...attrs, LCK: 10 })
        .map(([k, v]) => `<li>${k}: ${v}</li>`)
        .join('');
      const resList = Object.entries(resources)
        .map(([k, v]) => `<li>${k}: ${v}</li>`)
        .join('');
      const statsHTML = `<div class="race-stats"><ul>${attrList}</ul><ul>${resList}</ul></div>`;
      const imageSrc = RACE_IMAGES[character.race];
      const imageHTML = imageSrc ? `<img class="race-image" src="${imageSrc}" alt="${character.race}">` : '';
      const descHTML = `<div class="race-description">${RACE_DESCRIPTIONS[character.race] || ''}</div>`;
      return { statsHTML, imageHTML, descHTML };
    })();
    const { statsHTML = '', imageHTML = '', descHTML = '' } = displayData;

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
          colors = skinColorOptionsByRace[character.race] || ['#f5cba7', '#d2a679', '#a5694f', '#8d5524'];
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
      } else if (field.type === 'range') {
        const [min, max] = heightRanges[character.race] || [100, 200];
        let val = character[field.key];
        if (val === undefined) {
          val = Math.round((min + max) / 2);
          character[field.key] = val;
          localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
        }
        inputHTML = `<input type="range" id="cc-input" min="${min}" max="${max}" value="${val}"><span id="cc-value">${formatHeight(
          val
        )}</span>`;
      }

      const portrait = isPortraitLayout();
      if (field.key === 'location') {
        if (portrait) {
          setMainHTML(
            `<div class="character-creation"><div class="progress-container">${progressHTML}</div><div class="cc-column"><div class="cc-top"><div class="cc-options">${inputHTML}</div></div></div><div class="cc-info">${descHTML}${imageHTML}</div></div>`
          );
        } else {
          setMainHTML(
            `<div class="character-creation"><div class="progress-container">${progressHTML}</div><div class="cc-column"><div class="cc-top"><div class="cc-options">${inputHTML}</div>${descHTML}</div>${imageHTML}</div></div>`
          );
        }
      } else {
        if (portrait) {
          setMainHTML(
            `<div class="character-creation"><div class="progress-container">${progressHTML}</div><div class="cc-column"><div class="cc-top">${statsHTML}<div class="cc-options">${inputHTML}</div></div></div><div class="cc-info">${descHTML}${imageHTML}</div></div>`
          );
        } else {
          setMainHTML(
            `<div class="character-creation"><div class="progress-container">${progressHTML}</div><div class="cc-column"><div class="cc-top">${statsHTML}<div class="cc-options">${inputHTML}</div>${descHTML}</div>${imageHTML}</div></div>`
          );
        }
      }
      normalizeOptionButtonWidths();

      const currentStepEl = document.querySelector('.progress-step.current');
      const optionsEl = document.querySelector('.cc-options');
      if (currentStepEl && optionsEl) {
        const detailEl = document.createElement('div');
        detailEl.className = 'progress-current-detail';
        currentStepEl.after(detailEl);
        detailEl.appendChild(optionsEl);
      }

      if (field.key === 'location') {
        const options = field.options;
        let index = options.indexOf(character.location);
        const change = dir => {
          index = (index + dir + options.length) % options.length;
          character.location = options[index];
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
          localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
          renderStep();
        };
        document.querySelector('.sex-arrow.left').addEventListener('click', () => change(-1));
        document.querySelector('.sex-arrow.right').addEventListener('click', () => change(1));
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
          colors = skinColorOptionsByRace[character.race] || ['#f5cba7', '#d2a679', '#a5694f', '#8d5524'];
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
      } else if (field.type === 'range') {
        const rangeInput = document.getElementById('cc-input');
        const valueSpan = document.getElementById('cc-value');
        rangeInput.addEventListener('input', () => {
          valueSpan.textContent = formatHeight(parseInt(rangeInput.value, 10));
        });
        rangeInput.addEventListener('change', () => {
          character[field.key] = parseInt(rangeInput.value, 10);
          localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
          renderStep();
        });
      }
    } else {
      const nameVal = character.name || '';
      const portrait = isPortraitLayout();
      if (portrait) {
        setMainHTML(`<div class="character-creation"><div class="progress-container">${progressHTML}</div><div class="cc-column"><div class="cc-top">${statsHTML}<div class="cc-options"><input type="text" id="name-input" value="${nameVal}" placeholder="Name"></div></div></div><div class="cc-info">${descHTML}${imageHTML}</div></div>`);
      } else {
        setMainHTML(`<div class="character-creation"><div class="progress-container">${progressHTML}</div><div class="cc-column"><div class="cc-top">${statsHTML}<div class="cc-options"><input type="text" id="name-input" value="${nameVal}" placeholder="Name"></div>${descHTML}</div>${imageHTML}</div></div>`);
      }
      normalizeOptionButtonWidths();
      const currentStepEl = document.querySelector('.progress-step.current');
      const optionsEl = document.querySelector('.cc-options');
      if (currentStepEl && optionsEl) {
        const detailEl = document.createElement('div');
        detailEl.className = 'progress-current-detail';
        currentStepEl.after(detailEl);
        detailEl.appendChild(optionsEl);
      }
      const nameInput = document.getElementById('name-input');
      const updateName = () => {
        character.name = nameInput.value.trim();
        localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
        const completeBtn = document.getElementById('cc-complete');
        const nameStepEl = document.querySelector(`.progress-step[data-step="${fields.length}"]`);
        if (character.name) {
          nameStepEl?.classList.add('completed');
        } else {
          nameStepEl?.classList.remove('completed');
        }
        if (isComplete()) completeBtn.removeAttribute('disabled');
        else completeBtn.setAttribute('disabled', '');
      };
      nameInput.addEventListener('input', updateName);
      updateName();
    }

    document.getElementById('cc-complete').addEventListener('click', () => {
      if (!isComplete()) return;
      localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
      generatePortrait(character, img => {
        character.image = img;
        finalizeCharacter(character);
      });
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
  const location = character.location || 'a small town plaza';
  const prompt = `Full body portrait of a ${character.sex.toLowerCase()} ${character.race.toLowerCase()} with ${character.skinColor} skin, ${character.hairColor} hair and ${character.eyeColor} eyes, ${formatHeight(character.height)} tall, standing in ${location}.`;
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
  const attrs = getRaceStartingAttributes(character.race);
  const attrBlock = { ...attrs, LCK: 10 };
  const resources = {
    maxHP: maxHP(attrBlock.VIT, 1),
    maxMP: maxMP(attrBlock.WIS, 1),
    maxStamina: maxStamina(attrBlock.CON, 1)
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
    id,
  });
  assignMagicAptitudes(newChar);
  currentProfile.characters[id] = newChar;
  currentProfile.lastCharacter = id;
  newChar.spellSort = {};
  currentCharacter = newChar;
  spellSortModes = newChar.spellSort;
  saveProfiles();
  creationScaleOffset = 0;
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
    spellSortModes = currentCharacter.spellSort || {};
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
  if (prefs.layout && layouts.includes(prefs.layout)) {
    currentLayoutIndex = layouts.indexOf(prefs.layout);
  }
  setTheme(currentThemeIndex);
  setLayout(currentLayoutIndex);
}

const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');
settingsButton.addEventListener('click', () => {
  settingsPanel.classList.toggle('active');
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themes = ['light', 'dark', 'sepia'];
const themeIcons = {
  light:
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  dark:
    '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sepia:
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><rect x="11" y="13" width="2" height="8"/></svg>'
};
let currentThemeIndex = themes.indexOf(
  [...body.classList].find(c => c.startsWith('theme-')).replace('theme-', '')
);
const setTheme = index => {
  body.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
  const theme = themes[index];
  body.classList.add(`theme-${theme}`);
  themeToggle.innerHTML = themeIcons[theme];
  savePreference('theme', theme);
};
themeToggle.addEventListener('click', () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  setTheme(currentThemeIndex);
});

// UI scale buttons
let uiScale = 1;
let creationScaleOffset = 0;
const updateScale = () => {
  const baseScale = body.classList.contains('layout-landscape')
    ? uiScale * 1.25
    : uiScale;
  document.documentElement.style.setProperty(
    '--ui-scale',
    baseScale + creationScaleOffset
  );
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

// Layout toggle
const layoutToggle = document.getElementById('layout-toggle');
const layouts = ['landscape', 'portrait', 'auto'];
const layoutIcons = {
  landscape:
    '<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/></svg>',
  portrait:
    '<svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2" ry="2"/></svg>',
  auto:
    '<svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2" ry="2"/><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/></svg>'
};
let currentLayoutIndex = layouts.indexOf(
  [...body.classList].find(c => c.startsWith('layout-')).replace('layout-', '')
);
const setLayout = index => {
  body.classList.remove('layout-landscape', 'layout-portrait', 'layout-auto');
  const layout = layouts[index];
  body.classList.add(`layout-${layout}`);
  layoutToggle.innerHTML = layoutIcons[layout];
  savePreference('layout', layout);
  updateScale();
  if (screen.orientation) {
    if (layout === 'landscape') {
      screen.orientation.lock('landscape').catch(() => {});
    } else if (layout === 'portrait') {
      screen.orientation.lock('portrait').catch(() => {});
    } else if (screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  }
};
layoutToggle.addEventListener('click', () => {
  currentLayoutIndex = (currentLayoutIndex + 1) % layouts.length;
  setLayout(currentLayoutIndex);
});

// Dropdown menu
const menuButton = document.getElementById('menu-button');
const characterButton = document.getElementById('character-button');
const mapButton = document.getElementById('map-button');
const dropdownMenu = document.getElementById('dropdownMenu');
const characterMenu = document.getElementById('characterMenu');
const mapContainer = document.createElement('div');
mapContainer.id = 'map-container';
body.appendChild(mapContainer);

function updateCharacterButton() {
  characterButton.style.display = currentCharacter ? 'inline-flex' : 'none';
}
function updateMapButton() {
  mapButton.style.display = currentCharacter ? 'inline-flex' : 'none';
  if (!currentCharacter) mapContainer.style.display = 'none';
}

menuButton.addEventListener('click', () => {
  dropdownMenu.classList.toggle('active');
  characterMenu.classList.remove('active');
});
characterButton.addEventListener('click', () => {
  dropdownMenu.classList.remove('active');
  characterMenu.classList.toggle('active');
});
mapButton.addEventListener('click', () => {
  if (!currentCharacter) return;
  if (mapContainer.style.display === 'flex') {
    mapContainer.style.display = 'none';
    return;
  }
  const locName = currentCharacter.location;
  const loc = LOCATIONS[locName] || LOCATIONS['Duvilia Kingdom'];
  mapContainer.innerHTML = `<img src="${loc.map}" alt="${loc.name}"><div class="map-description">${loc.description || ''}</div>`;
  mapContainer.style.display = 'flex';
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

