import { SPELLBOOK } from "./spells.js";
import { WEAPON_SKILLS } from "./weapon_skills.js";
import { characterTemplate, gainProficiency } from "./core.js";
import { getRaceStartingAttributes, RACE_DESCRIPTIONS } from "./race_attrs.js";
import { maxHP, maxMP, maxStamina } from "./resources.js";

window.SPELLBOOK = SPELLBOOK;
window.WEAPON_SKILLS = WEAPON_SKILLS;

const body = document.body;
const main = document.querySelector('main');
const backButton = document.getElementById('back-button');

// --- Profile and save management ---
const STORAGE_KEY = 'rpgProfiles';
const LAST_PROFILE_KEY = 'rpgLastProfile';
const TEMP_CHARACTER_KEY = 'rpgTempCharacter';
let profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
let currentProfileId = localStorage.getItem(LAST_PROFILE_KEY);
let currentProfile = currentProfileId ? profiles[currentProfileId] : null;
let currentCharacter = null;

const regenerateIcon = '<svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.13 3.36L1 14"/></svg>';
const pictureIcon = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';

const hairColorOptions = [
  '#000000', '#2c1b10', '#4b2e1f', '#663300', '#8b4513', '#a0522d',
  '#b5651d', '#c68642', '#d2b48c', '#deb887', '#e6bea0', '#f5deb3',
  '#fff5e1', '#800000', '#b22222', '#ffffff'
];

const eyeColorOptions = [
  '#000000', '#2b2c30', '#3b3024', '#5b3a21', '#6b4423', '#8b4513',
  '#a0522d', '#8e7618', '#8b8f45', '#355e3b', '#2f4f4f', '#0000ff',
  '#1e90ff', '#708090', '#9932cc', '#ffbf00'
];

const generateColorScale = (start, end, steps = 16) => {
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

// Default proficiency values for new characters
const defaultProficiencies = {
  stoneMagic: 0,
  waterMagic: 0,
  windMagic: 0,
  fireMagic: 0,
  iceMagic: 0,
  thunderMagic: 0,
  darkMagic: 0,
  lightMagic: 0,
  destructiveMagic: 0,
  healingMagic: 0,
  reinforcementMagic: 0,
  enfeeblingMagic: 0,
  summoningMagic: 0,
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

function migrateProficiencies(character) {
  if ('mage' in character && !('wand' in character)) {
    character.wand = character.mage;
    delete character.mage;
  }
  if ('marksmanship' in character && !('bow' in character)) {
    character.bow = character.marksmanship;
    delete character.marksmanship;
  }
  return character;
}

const proficiencyCategories = {
  Magical: [
    'stoneMagic',
    'waterMagic',
    'windMagic',
    'fireMagic',
    'iceMagic',
    'thunderMagic',
    'darkMagic',
    'lightMagic',
    'destructiveMagic',
    'healingMagic',
    'reinforcementMagic',
    'enfeeblingMagic',
    'summoningMagic'
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
  stone: 'stoneMagic',
  water: 'waterMagic',
  wind: 'windMagic',
  fire: 'fireMagic',
  ice: 'iceMagic',
  thunder: 'thunderMagic',
  dark: 'darkMagic',
  light: 'lightMagic'
};

function applySpellProficiencyGain(character, spell, params) {
  if (!character || !spell) return;
  const elemKey = elementalProficiencyMap[spell.element?.toLowerCase()];
  if (elemKey) {
    character[elemKey] = gainProficiency({
      P: character[elemKey],
      ...params,
    });
  }

  if (spell.isDamage) {
    character.destructiveMagic = gainProficiency({
      P: character.destructiveMagic,
      ...params,
    });
  }
  if (spell.isBuff) {
    character.reinforcementMagic = gainProficiency({
      P: character.reinforcementMagic,
      ...params,
    });
  }
  if (spell.isHeal) {
    character.healingMagic = gainProficiency({
      P: character.healingMagic,
      ...params,
    });
  }
  if (spell.isControl) {
    character.enfeeblingMagic = gainProficiency({
      P: character.enfeeblingMagic,
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
  const portrait = currentCharacter.image
    ? `<img src="${currentCharacter.image}" alt="portrait" class="main-portrait">`
    : '';
  main.innerHTML = `<div class="no-character"><h1>Welcome, ${currentCharacter.name}</h1>${portrait}</div>`;
}

function showNoCharacterUI() {
  hideBackButton();
  updateCharacterButton();
  main.innerHTML = `<div class="no-character"><h1>Start your journey...</h1><button id="new-character">New Character</button></div>`;
  document.getElementById('new-character').addEventListener('click', startCharacterCreation);
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
  main.innerHTML = html;
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

function showMainUI() {
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
  const info = `<p>Race: ${c.race}</p><p>Sex: ${c.sex}</p><p>Skin Color: <span class=\"color-box\" style=\"background:${c.skinColor}\"></span></p><p>Hair Color: <span class=\"color-box\" style=\"background:${c.hairColor}\"></span></p><p>Eye Color: <span class=\"color-box\" style=\"background:${c.eyeColor}\"></span></p><p>Height: ${formatHeight(c.height)}</p>`;
  const stats = c.attributes?.current || {};
  const statsList = ['STR','DEX','CON','VIT','AGI','INT','WIS','CHA','LCK']
    .map(attr => `<li>${attr}: ${stats[attr] ?? 0}</li>`)
    .join('');
  const statsHTML = `<h2>Current Stats</h2><ul class="stats-list">${statsList}</ul>`;
  const regenerateBtn = `<button id="regenerate-portrait" class="icon-button" title="Regenerate portrait">${regenerateIcon}</button>`;
  const resourceBars = (() => {
    const hpPct = c.maxHP ? (c.hp / c.maxHP) * 100 : 0;
    const mpPct = c.maxMP ? (c.mp / c.maxMP) * 100 : 0;
    const staPct = c.maxStamina ? (c.stamina / c.maxStamina) * 100 : 0;
    return `
      <div class="resource-bar hp"><div class="fill" style="width:${hpPct}%"><span>${c.hp} / ${c.maxHP}</span></div></div>
      <div class="resource-bar mp"><div class="fill" style="width:${mpPct}%"><span>${c.mp} / ${c.maxMP}</span></div></div>
      <div class="resource-bar stamina"><div class="fill" style="width:${staPct}%"><span>${c.stamina} / ${c.maxStamina}</span></div></div>
    `;
  })();
  main.innerHTML = `<div class="no-character"><h1>${c.name}</h1><div class="portrait-wrapper">${portrait}${regenerateBtn}</div>${resourceBars}${info}${statsHTML}<button id="delete-character">Delete Character</button></div>`;
  document.getElementById('delete-character').addEventListener('click', () => {
    delete currentProfile.characters[c.id];
    currentProfile.lastCharacter = null;
    currentCharacter = null;
    saveProfiles();
    showMainUI();
  });
  const regenButton = document.getElementById('regenerate-portrait');
  regenButton.addEventListener('click', async function handleGenerate() {
    regenButton.disabled = true;
    try {
      const img = await generateCharacterImage(currentCharacter);
      const imgEl = document.querySelector('.portrait-wrapper img');
      if (imgEl) {
        imgEl.src = img;
        imgEl.style.display = 'block';
      }
      regenButton.disabled = false;
      regenButton.innerHTML = pictureIcon;
      regenButton.removeEventListener('click', handleGenerate);
      regenButton.addEventListener('click', function handleApply() {
        downloadImage(img, `${currentCharacter.name || 'portrait'}.png`);
        currentCharacter.image = img;
        saveProfiles();
        showCharacterUI();
      }, { once: true });
    } catch (e) {
      console.error(e);
      regenButton.disabled = false;
    }
  });
}

function showProficienciesUI() {
  if (!currentCharacter) return;
  showBackButton();
  let html = '<div class="proficiencies-screen"><h1>Proficiencies</h1>';
  for (const [type, list] of Object.entries(proficiencyCategories)) {
    html += `<h2>${type}</h2><div class="proficiency-grid">`;
    list.forEach(key => {
      const value = currentCharacter[key] ?? 0;
      const name = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      const capped = value >= 100 ? ' capped' : '';
      html += `<div class="proficiency-item"><span class="proficiency-name">${name}</span><span class="proficiency-value${capped}">${value}</span></div>`;
    });
    html += '</div>';
  }
  html += '</div>';
  main.innerHTML = html;
}

function startCharacterCreation() {
  showBackButton();
  const saved = JSON.parse(localStorage.getItem(TEMP_CHARACTER_KEY) || '{}');
  const character = saved.character || {};
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
      options: ['Male', 'Female', 'Androgynous']
    },
    { key: 'skinColor', label: 'Choose your skin color', type: 'color' },
    { key: 'hairColor', label: 'Choose your hair color', type: 'color' },
    { key: 'eyeColor', label: 'Choose your eye color', type: 'color' },
    { key: 'height', label: 'Choose your height', type: 'range' }
  ];

  const stepLabels = ['Race', 'Sex', 'Skin', 'Hair', 'Eyes', 'Height', 'Name'];

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
      fields.every(f => character[f.key]) && character.name;
    const progressHTML =
      stepLabels
        .map((label, i) => {
          const hasValue = i < fields.length ? character[fields[i].key] : character.name;
          let cls = 'clickable';
          if (i === step) cls = 'current clickable';
          else if (hasValue) cls = 'completed clickable';
          return `<div class="progress-step ${cls}" data-step="${i}"><div class="circle"></div><span>${label}</span></div>`;
        })
        .join('') +
      `<button id="cc-complete" class="complete-button" ${isComplete() ? '' : 'disabled'}></button>` +
      '<button id="cc-cancel" title="Cancel">✖</button>';

    const raceInfoHTML = (() => {
      if (!character.race) return '';
      const attrs = getRaceStartingAttributes(character.race);
      const resources = {
        HP: maxHP(attrs.VIT, 1),
        MP: maxMP(attrs.WIS, 1),
        Stamina: maxStamina(attrs.CON, 1)
      };
      const statsList = Object.entries({ ...attrs, LCK: 10, ...resources })
        .map(([k, v]) => `<li>${k}: ${v}</li>`)
        .join('');
      const desc = RACE_DESCRIPTIONS[character.race] || '';
      return `<div class="race-info"><p>${desc}</p><h3>Starting Stats</h3><ul>${statsList}</ul></div>`;
    })();

    if (step < fields.length) {
      const field = fields[step];
      let inputHTML = '';
      if (field.type === 'select') {
        inputHTML = `<div class="option-grid">${field.options
          .map(
            o =>
              `<button class="option-button${
                character[field.key] === o ? ' selected' : ''
              }" data-value="${o}">${o}</button>`
          )
          .join('')}</div>`;
      } else if (field.type === 'color') {
        let colors = [];
        if (field.key === 'hairColor') {
          colors = hairColorOptions;
        } else if (field.key === 'eyeColor') {
          colors = eyeColorOptions;
        } else if (field.key === 'skinColor') {
          colors = skinColorOptionsByRace[character.race] || ['#f5cba7', '#d2a679', '#a5694f', '#8d5524'];
        }
        const datalistId = `${field.key}-list`;
        const value = character[field.key] || colors[0];
        inputHTML = `<input type="color" id="cc-input" list="${datalistId}" value="${value}"><datalist id="${datalistId}">${colors
          .map(c => `<option value="${c}"></option>`)
          .join('')}</datalist>`;
      } else if (field.type === 'range') {
        const [min, max] = heightRanges[character.race] || [100, 200];
        const val = character[field.key] || min;
        inputHTML = `<input type="range" id="cc-input" min="${min}" max="${max}" value="${val}"><span id="cc-value">${formatHeight(
          val
        )}</span>`;
      }

      main.innerHTML = `<div class="character-creation"><div class="progress-container">${progressHTML}</div><div class="cc-column">${inputHTML}${raceInfoHTML}</div></div>`;

      if (field.type === 'select') {
        document.querySelectorAll('.option-button').forEach(btn => {
          btn.addEventListener('click', () => {
            character[field.key] = btn.dataset.value;
            localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
            renderStep();
          });
        });
      } else if (field.type === 'color') {
        const input = document.getElementById('cc-input');
        input.addEventListener('change', () => {
          character[field.key] = input.value;
          localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
          renderStep();
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
      main.innerHTML = `<div class="character-creation"><div class="progress-container">${progressHTML}</div><div class="cc-column"><input type="text" id="name-input" value="${nameVal}" placeholder="Name">${raceInfoHTML}</div></div>`;
      const nameInput = document.getElementById('name-input');
      const updateName = () => {
        character.name = nameInput.value.trim();
        localStorage.setItem(TEMP_CHARACTER_KEY, JSON.stringify({ step, character }));
        const completeBtn = document.getElementById('cc-complete');
        const lastStep = document.querySelector('.progress-step:last-child');
        if (character.name) {
          completeBtn.removeAttribute('disabled');
          lastStep?.classList.add('completed');
        } else {
          completeBtn.setAttribute('disabled', '');
          lastStep?.classList.remove('completed');
        }
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

function downloadImage(src, filename) {
  const link = document.createElement('a');
  link.href = src;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function generatePortrait(character, callback) {
  main.innerHTML = `<div class="no-character"><h1>Generating portrait...</h1><div class="progress"><div class="progress-bar" id="portrait-progress"></div></div></div>`;

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
    attributes: { base: { ...attrBlock }, current: { ...attrBlock } },
    maxHP: resources.maxHP,
    hp: resources.maxHP,
    maxMP: resources.maxMP,
    mp: resources.maxMP,
    maxStamina: resources.maxStamina,
    stamina: resources.maxStamina,
    id,
  });
  currentProfile.characters[id] = newChar;
  currentProfile.lastCharacter = id;
  currentCharacter = newChar;
  saveProfiles();
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
  if (prefs.layout && layouts.includes(prefs.layout)) {
    currentLayoutIndex = layouts.indexOf(prefs.layout);
  }
  setTheme(currentThemeIndex);
  updateScale();
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
const updateScale = () => {
  document.documentElement.style.setProperty('--ui-scale', uiScale);
  savePreference('uiScale', uiScale);
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
};
layoutToggle.addEventListener('click', () => {
  currentLayoutIndex = (currentLayoutIndex + 1) % layouts.length;
  setLayout(currentLayoutIndex);
});

// Dropdown menu
const menuButton = document.getElementById('menu-button');
const characterButton = document.getElementById('character-button');
const dropdownMenu = document.getElementById('dropdownMenu');
const characterMenu = document.getElementById('characterMenu');

function updateCharacterButton() {
  characterButton.style.display = currentCharacter ? 'inline-flex' : 'none';
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
    main.innerHTML = `<div class="no-character"><h1>${action} not implemented</h1></div>`;
  }
});

characterMenu.addEventListener('click', e => {
  const action = e.target.dataset.action;
  if (!action) return;
  characterMenu.classList.remove('active');
  if (action === 'profile') {
    showCharacterUI();
  } else if (action === 'proficiencies') {
    showProficienciesUI();
  } else {
    showBackButton();
    main.innerHTML = `<div class="no-character"><h1>${action} not implemented</h1></div>`;
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

