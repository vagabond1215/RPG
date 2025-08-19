const body = document.body;
const main = document.querySelector('main');

// --- Profile and save management ---
const STORAGE_KEY = 'rpgProfiles';
const LAST_PROFILE_KEY = 'rpgLastProfile';
let profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
let currentProfileId = localStorage.getItem(LAST_PROFILE_KEY);
let currentProfile = currentProfileId ? profiles[currentProfileId] : null;
let currentCharacter = null;

const saveProfiles = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));

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
  main.innerHTML = `<h1>Welcome, ${currentCharacter.name}</h1>`;
}

function showNoCharacterUI() {
  main.innerHTML = `<div class="no-character"><h1>Start your journey...</h1><button id="new-character">New Character</button></div>`;
  document.getElementById('new-character').addEventListener('click', () => {
    const name = prompt('Enter character name:');
    if (!name) return;
    const id = Date.now().toString();
    currentProfile.characters[id] = { id, name };
    currentProfile.lastCharacter = id;
    currentCharacter = currentProfile.characters[id];
    saveProfiles();
    showCharacter();
  });
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

// Initialization
selectProfile();
loadPreferences();
loadCharacter();

