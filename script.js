const body = document.body;

// Theme buttons
const themeButtons = {
  light: document.getElementById('theme-light'),
  sepia: document.getElementById('theme-sepia'),
  dark: document.getElementById('theme-dark')
};

Object.entries(themeButtons).forEach(([theme, btn]) => {
  btn.addEventListener('click', () => {
    body.classList.remove('theme-light', 'theme-sepia', 'theme-dark');
    body.classList.add(`theme-${theme}`);
  });
});

// UI scale buttons
let uiScale = 1;
const updateScale = () => {
  document.documentElement.style.setProperty('--ui-scale', uiScale);
};
document.getElementById('scale-dec').addEventListener('click', () => {
  uiScale = Math.max(0.5, uiScale - 0.1);
  updateScale();
});
document.getElementById('scale-inc').addEventListener('click', () => {
  uiScale = Math.min(2, uiScale + 0.1);
  updateScale();
});

// Layout buttons
const layoutButtons = {
  landscape: document.getElementById('layout-landscape'),
  portrait: document.getElementById('layout-portrait'),
  auto: document.getElementById('layout-auto')
};
Object.entries(layoutButtons).forEach(([layout, btn]) => {
  btn.addEventListener('click', () => {
    body.classList.remove('layout-landscape', 'layout-portrait', 'layout-auto');
    body.classList.add(`layout-${layout}`);
  });
});

// Dropdown menu
const menuButton = document.getElementById('menu-button');
const dropdownMenu = document.getElementById('dropdownMenu');
menuButton.addEventListener('click', () => {
  dropdownMenu.classList.toggle('active');
});
