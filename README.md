# Text RPG

This repository hosts a simple web-based text RPG prototype intended for deployment via [GitHub Pages](https://pages.github.com/).

## Setup

1. Run `npm install` to install all dependencies.
2. Use the maintenance scripts whenever you touch the shared data sets:
   - `npm run validate` checks the fauna and flora catalogs against their JSON schemas so broken entries never reach version control.
   - `npm run build:indexes` regenerates the derived Codex lookups under `dist/indexes/` after you edit animals or plants.
   - `npm run build:spellbook` rebuilds the compiled spellbook if you change `data/game/spell_catalog.ts`.

### Codex catalogs and indexes

`data/animals.json` and `data/plants.json` feed the Codex Bestiary and Herbarium. Running `npm run build:indexes` executes `scripts/buildIndexes.ts`, which writes updated habitat, diet, and trade-tier maps to `dist/indexes/*.json`. Those precomputed tables ship with the site so the Codex can group entries without recalculating relationships at runtime; regenerate and commit them whenever you add or modify catalog records.

### Catalog validation

`npm run validate` invokes `scripts/validateData.ts`, applying the schemas in `schemas/` to every animal and plant. Run the validator before committing catalog edits so the automated tests—and the Codex UI—only see structurally valid records.

### Spellbook data

If you update spell definitions or milestones in `data/game/spell_catalog.ts`, run `npm run build:spellbook`. The generator rewrites `data/game/spells.js` with the derived spellbook bundle, keeping the runtime spell UI in sync with the source catalog.

### Recommended tests

`npm test` runs the Vitest suite in `tests/`, covering schema checks, cross references, importer rules, and world integration logic. Execute it before submitting changes that touch shared data or systems.

## Running

No build steps are required. After publishing the repository with GitHub Pages, visit the generated site or open `index.html` directly in a browser.

## Data maintenance guidelines

### Animals and plants catalogs

Maintain fauna entries in `data/animals.json` and flora entries in `data/plants.json`. Each record should include a stable `id`, the relevant `habitats`, and any optional `diet`, tier, or narrative metadata required by the Codex. Allowed habitats, diet classifications, and tier labels live in `src/types/biomes.ts`; update those lists before introducing a brand-new key. Schema files under `schemas/` and tests in `tests/animals.schema.test.ts`, `tests/plants.schema.test.ts`, and `tests/crossrefs.test.ts` enforce structure, uniqueness, and biome alignment, so keep changes consistent with their expectations.

### Economy and items

The economy data in `data/economy/` underpins item pricing, wages, and trade modifiers. Prefer refreshing `data/economy/items.json` and `data/game/region_policy.json` through `tools/importers/import_economy_catalog.js`, which ingests `Fantasy_Economy_Catalog_REBUILT.xlsx`, normalizes slugs, and validates pricing math. Currency helpers in `data/economy/currency.js` keep display strings consistent, while `data/economy/regional_pricing.js` applies biome-specific multipliers at runtime. The Vitest cases in `tests/economy_import/` cover importer invariants, sale quantities, and profitability; rerun them after adjusting catalog logic or workbook formulas.

### Locations and quest boards

City and region definitions reside in `data/game/locations.ts` (and the generated `locations.js`). Use `createLocation`, `questHelper`, and the supporting types to structure new settlements, businesses, and quest boards. When adding businesses or ownership data, keep the curated registries—such as `data/game/waves_break_registry.ts`—in sync so automated checks like `tests/wavesBreakOwnership.test.ts` continue to pass. The helper routines automatically seed quest boards for buildings and districts, so reuse them instead of hand-rolling UI strings.

### Character prompts and imagery

Portrait prompts are composed by `data/game/image_prompts.js`, which stitches together race, theme, and palette data from `data/game/theme_colors.js`, `data/game/character_builds.js`, and `data/game/race_colors.js`. When introducing new races or outfit themes, provide matching color swatches and descriptors so `composeImagePrompt` can generate complete, on-brand art directions.

### Variable defaults and assumptions

The UI sanitizes partially specified saves and Codex entries through helpers such as `normalizeCodexRecord`, `normalizeCodexCategory`, `ensureCollections`, and `ensureQuestLog` inside `script.js`. They coerce missing study levels to 1, ensure encountered lists are objects keyed by id, and populate quest logs with minimal fields. Supplying well-formed data prevents those fallbacks from masking mistakes, so prefer explicit numeric levels, booleans, and identifiers when touching serialized state.

### Additional resources

`docs/economy_catalog.md` documents the Excel importer fields in depth, and the `tests/` folder illustrates the invariants we expect across data sets. Browsing those files before large edits will save time chasing validation or test failures.

## Structure

- `index.html` – entry point for the game UI
- `style.css` – basic styles and themes
- `script.js` – behaviour for the menu and layout controls; progression helpers live in dedicated modules under `data/game`
- `dist/indexes/` – precomputed Codex lookup tables regenerated by `npm run build:indexes`
- `data/animals.json` / `data/plants.json` – core Codex catalogs that drive the Bestiary and Herbarium
- `data/economy/` – coin denominations, trade goods, and pricing helpers
- `Fantasy_Economy_Catalog_REBUILT.xlsx` – source workbook for the economy importer
- `tools/importers/import_economy_catalog.js` – script that refreshes the economy catalog and region policy JSON
- `docs/economy_catalog.md` – reference guide for importer columns and workflow
- `assets/images/Race Photos/` – race reference images
- `assets/images/Maps/` – map images
- `assets/images/race_photos.json` – manifest of available character portraits (run `node scripts/updateRacePhotoManifest.js` after adding images)
- `data/game/` – data assets such as `weapon_skills.js`, `spells.js`, `race_attrs.js`, and supporting systems
  - `data/game/resources.js` – dynamic HP/MP/Stamina calculations based on stats
  - `data/game/combat.ts` – single function to resolve combat, accounting for level, attributes, proficiencies, and active skill effects
  - `data/game/party.ts` – party structs, resources, effects, and NPC proficiency policy
  - `data/game/locations.ts` – city and region definitions with map references

Additional functionality will be added over time.

### Trainers

Crafting is now learned from tiered trainers rather than academies. Trainers range from *initiate* through *master* and may only instruct characters of lower rank. Each craft has exactly one master trainer located in the city most renowned for that discipline, while lower tier trainers appear in cities based on resources and opportunity.

### Outdoor Skills

New activity skills – **Swimming**, **Sailing** and **Horseback Riding** – progress through time spent performing their respective activities. Progression helpers for these skills live in `data/game/outdoor_skills.ts`.

### Gathering

Resource collection skills such as **Mining**, **Foraging**, **Logging**, **Herbalism**, **Pearl Diving**, **Gardening**, and **Farming** now belong to a dedicated Gathering category.

### Magical Proficiencies

Characters now track separate proficiencies for Stone, Water, Wind, Fire, Ice, Lightning, Dark, Light, Destruction, Healing, Enhancement, Enfeeblement, Control and Summoning. The `applySpellProficiencyGain` helper in `data/game/spell_proficiency.js` calculates how these values increase when spells are cast. The spellbook requires a character to meet the proficiency threshold in both a spell's element and its school before it can be used.
Elemental gains pass through a `gainElementProficiency` wrapper, enabling per-element tuning before calling the base `gainProficiency` utility.

### Weapon Skills

Weapon attacks and specials are defined in `data/game/weapon_skills.js`. Each weapon line contains single-target, area, ultimate and special abilities with structured effect payloads so the game engine can compute damage, disables and enhancements consistently.
