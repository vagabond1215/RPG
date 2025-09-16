# Text RPG

This repository hosts a simple web-based text RPG prototype intended for deployment via [GitHub Pages](https://pages.github.com/).

## Running

No build steps are required. After publishing the repository with GitHub Pages, visit the generated site or open `index.html` directly in a browser.

## Structure

- `index.html` – entry point for the game UI
- `style.css` – basic styles and themes
- `script.js` – behaviour for the menu and layout controls;
  progression helpers live in dedicated modules under `assets/data`
- `assets/data/resources.js` – dynamic HP/MP/Stamina calculations based on stats
- `assets/data/combat.ts` – single function to resolve combat, accounting for level, attributes, proficiencies and active skill effects
- `assets/data/party.ts` – party structs, resources, effects, and NPC proficiency policy
- `assets/images/Race Photos/` – race reference images
- `assets/images/Maps/` – map images
- `assets/images/race_photos.json` – manifest of available character portraits (run `node scripts/updateRacePhotoManifest.js` after adding images)
- `assets/data/` – data assets such as `weapon_skills.js`, `spells.js`, and `race_attrs.js`
  - `assets/economy/items.json` – unified item pricing and wage data
- `assets/data/locations.ts` – city and region definitions with map references

Additional functionality will be added over time.

### Trainers

Crafting is now learned from tiered trainers rather than academies. Trainers range from *initiate* through *master* and may only instruct characters of lower rank. Each craft has exactly one master trainer located in the city most renowned for that discipline, while lower tier trainers appear in cities based on resources and opportunity.

### Outdoor Skills

New activity skills – **Swimming**, **Sailing** and **Horseback Riding** – progress through time spent performing their respective activities. Progression helpers for these skills live in `assets/data/outdoor_skills.ts`.

### Gathering

Resource collection skills such as **Mining**, **Foraging**, **Logging**, **Herbalism**, **Pearl Diving**, **Gardening**, and **Farming** now belong to a dedicated Gathering category.

### Magical Proficiencies

Characters now track separate proficiencies for Stone, Water, Wind, Fire, Ice, Lightning, Dark, Light, Destruction, Healing, Enhancement, Enfeeblement, Control and Summoning. The `applySpellProficiencyGain` helper in `assets/data/spell_proficiency.js` calculates how these values increase when spells are cast. The spellbook requires a character to meet the proficiency threshold in both a spell's element and its school before it can be used.
Elemental gains pass through a `gainElementProficiency` wrapper, enabling per-element tuning before calling the base `gainProficiency` utility.

### Weapon Skills

Weapon attacks and specials are defined in `assets/data/weapon_skills.js`. Each weapon line contains single-target, area, ultimate and special abilities with structured effect payloads so the game engine can compute damage, disables and enhancements consistently.
