# Text RPG

This repository hosts a simple web-based text RPG prototype intended for deployment via [GitHub Pages](https://pages.github.com/).

## Running

No build steps are required. After publishing the repository with GitHub Pages, visit the generated site or open `index.html` directly in a browser.

## Structure

- `index.html` – entry point for the game UI
- `style.css` – basic styles and themes
- `script.js` – behaviour for the menu and layout controls
  and core mechanics such as proficiency gain
- `weapon_skills.js` – weapon skill data and effects
- `assets/images/` – image assets
- `assets/data/` – data assets

Additional functionality will be added over time.

### Magical Proficiencies

Characters now track separate proficiencies for Stone, Water, Wind, Fire, Ice, Thunder, Dark, Light, Destructive, Healing, Reinforcement, Enfeebling and Summoning magic. The `gainProficiencyWithChance` function in `script.js` calculates how these values increase when spells are cast.

### Weapon Skills

Weapon attacks and specials are defined in `weapon_skills.js`. Each weapon line contains single-target, area, ultimate and special abilities with structured effect payloads so the game engine can compute damage, disables and enhancements consistently.
