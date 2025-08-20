const body = document.body;
const main = document.querySelector('main');
const backButton = document.getElementById('back-button');

// --- Profile and save management ---
const STORAGE_KEY = 'rpgProfiles';
const LAST_PROFILE_KEY = 'rpgLastProfile';
let profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
let currentProfileId = localStorage.getItem(LAST_PROFILE_KEY);
let currentProfile = currentProfileId ? profiles[currentProfileId] : null;
let currentCharacter = null;

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
  const portrait = currentCharacter.image
    ? `<img src="${currentCharacter.image}" alt="portrait" class="main-portrait">`
    : '';
  main.innerHTML = `<div class="no-character"><h1>Welcome, ${currentCharacter.name}</h1>${portrait}</div>`;
}

function showNoCharacterUI() {
  hideBackButton();
  main.innerHTML = `<div class="no-character"><h1>Start your journey...</h1><button id="new-character">New Character</button></div>`;
  document.getElementById('new-character').addEventListener('click', startCharacterCreation);
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
  const portrait = c.image ? `<img src="${c.image}" alt="portrait" style="width:10rem;height:10rem;">` : '';
  const info = `<p>Race: ${c.race}</p><p>Sex: ${c.sex}</p><p>Hair Color: ${c.hairColor}</p><p>Eye Color: ${c.eyeColor}</p><p>Height: ${formatHeight(c.height)}</p>`;
  main.innerHTML = `<div class="no-character"><h1>${c.name}</h1>${portrait}${info}<button id="delete-character">Delete Character</button></div>`;
  document.getElementById('delete-character').addEventListener('click', () => {
    delete currentProfile.characters[c.id];
    currentProfile.lastCharacter = null;
    currentCharacter = null;
    saveProfiles();
    showMainUI();
  });
}

function startCharacterCreation() {
  showBackButton();
  const character = {};
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
    { key: 'hairColor', label: 'Choose your hair color', type: 'color' },
    { key: 'eyeColor', label: 'Choose your eye color', type: 'color' },
    { key: 'height', label: 'Choose your height', type: 'range' }
  ];

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

  let step = 0;
  renderStep();

  function renderStep() {
    if (step < fields.length) {
      const field = fields[step];
      let inputHTML = '';
      if (field.type === 'select') {
        inputHTML = `<select id="cc-input">${field.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select>`;
      } else if (field.type === 'color') {
        inputHTML = '<input type="color" id="cc-input" value="#000000">';
      } else if (field.type === 'range') {
        const [min, max] = heightRanges[character.race] || [100, 200];
        inputHTML = `<input type="range" id="cc-input" min="${min}" max="${max}" value="${min}"><span id="cc-value">${formatHeight(min)}</span>`;
      }

      main.innerHTML = `<div class="no-character"><h1>${field.label}</h1>${inputHTML}<button id="next-step">Next</button></div>`;

      if (field.type === 'range') {
        const rangeInput = document.getElementById('cc-input');
        const valueSpan = document.getElementById('cc-value');
        rangeInput.addEventListener('input', () => {
          valueSpan.textContent = formatHeight(parseInt(rangeInput.value, 10));
        });
      }

      document.getElementById('next-step').addEventListener('click', () => {
        const input = document.getElementById('cc-input');
        const value = field.type === 'range' ? parseInt(input.value, 10) : input.value;
        character[field.key] = value;
        step++;
        renderStep();
      });
    } else {
      main.innerHTML = `<div class="no-character"><h1>Name your character...</h1><input type="text" id="name-input"><button id="create-character">Create</button></div>`;
      document.getElementById('create-character').addEventListener('click', () => {
        const name = document.getElementById('name-input').value.trim();
        if (!name) return;
        character.name = name;
        generatePortraitOptions(character);
      });
    }
  }
}

async function generatePortraitOptions(character) {
  main.innerHTML = `<div class="no-character"><h1>Generating portraits...</h1><div class="progress"><div class="progress-bar" id="portrait-progress"></div></div></div>`;

  let progress = 0;
  const progressBar = document.getElementById('portrait-progress');
  const progressInterval = setInterval(() => {
    progress = (progress + 1) % 101;
    progressBar.style.width = progress + '%';
  }, 100);

  const prompt = `Dungeons & Dragons manual style portrait of a ${character.sex.toLowerCase()} ${character.race.toLowerCase()} with ${character.hairColor} hair and ${character.eyeColor} eyes, ${formatHeight(character.height)} tall.`;
  try {
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
        n: 4,
        size: '256x256'
      })
    });
    if (!res.ok) throw new Error('Image generation failed');
    const data = await res.json();
    clearInterval(progressInterval);
    const images = data.data.map(d => d.b64_json);
    showPortraitSelection(character, images);
  } catch (err) {
    console.error(err);
    clearInterval(progressInterval);
    const placeholders = [1, 2, 3, 4].map(n => `https://placehold.co/256x256?text=${n}`);
    showPortraitSelection(character, placeholders);
  }
}

function showPortraitSelection(character, images) {
  const imgHTML = images
    .map(img => {
      const src = img.startsWith('http') ? img : `data:image/png;base64,${img}`;
      return `<img src="${src}" class="portrait-option">`;
    })
    .join('');
  main.innerHTML = `<div class="no-character"><h1>Select your portrait</h1><div class="portrait-grid">${imgHTML}</div></div>`;
  document.querySelectorAll('.portrait-option').forEach(img => {
    img.addEventListener('click', () => {
      character.image = img.src;
      finalizeCharacter(character);
    });
  });
}

function finalizeCharacter(character) {
  const id = Date.now().toString();
  const newChar = { id, ...character };
  currentProfile.characters[id] = newChar;
  currentProfile.lastCharacter = id;
  currentCharacter = newChar;
  saveProfiles();
  showCharacter();
}

function loadCharacter() {
  const charId = currentProfile?.lastCharacter;
  if (charId && currentProfile.characters && currentProfile.characters[charId]) {
    currentCharacter = currentProfile.characters[charId];
    showCharacter();
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

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themes = ['light', 'dark', 'sepia'];
const themeIcons = { light: '☀', dark: '☾', sepia: '▤' };
let currentThemeIndex = themes.indexOf(
  [...body.classList].find(c => c.startsWith('theme-')).replace('theme-', '')
);
const setTheme = index => {
  body.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
  const theme = themes[index];
  body.classList.add(`theme-${theme}`);
  themeToggle.textContent = themeIcons[theme];
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
const layoutIcons = { landscape: '▭', portrait: '▯', auto: '⟳' };
let currentLayoutIndex = layouts.indexOf(
  [...body.classList].find(c => c.startsWith('layout-')).replace('layout-', '')
);
const setLayout = index => {
  body.classList.remove('layout-landscape', 'layout-portrait', 'layout-auto');
  const layout = layouts[index];
  body.classList.add(`layout-${layout}`);
  layoutToggle.textContent = layoutIcons[layout];
  savePreference('layout', layout);
};
layoutToggle.addEventListener('click', () => {
  currentLayoutIndex = (currentLayoutIndex + 1) % layouts.length;
  setLayout(currentLayoutIndex);
});

// Dropdown menu
const menuButton = document.getElementById('menu-button');
const dropdownMenu = document.getElementById('dropdownMenu');
menuButton.addEventListener('click', () => {
  dropdownMenu.classList.toggle('active');
});

dropdownMenu.addEventListener('click', e => {
  const action = e.target.dataset.action;
  if (!action) return;
  dropdownMenu.classList.remove('active');
  if (action === 'character') {
    showCharacterUI();
  } else if (action === 'new-character') {
    startCharacterCreation();
  } else {
    showBackButton();
    main.innerHTML = `<div class="no-character"><h1>${action} not implemented</h1></div>`;
  }
});

backButton.addEventListener('click', () => {
  dropdownMenu.classList.remove('active');
  showMainUI();
});

// Initialization
selectProfile();
loadPreferences();
loadCharacter();

