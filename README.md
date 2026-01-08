# Text RPG

This repository hosts a simple web-based text RPG prototype intended for deployment via [GitHub Pages](https://pages.github.com/).

## Setup

1. Run `npm install` to install all dependencies.
   - If you rely on an HTTP proxy, configure npm with the underscore-style environment variables (`npm_config_http_proxy` / `npm_config_https_proxy`) or add matching entries to `~/.npmrc`. The legacy dash-form names (`npm_config_http-proxy`) trigger warnings in npm 11 and will stop working in a future release.
   - When adopting this repository in a new environment, upgrade npm itself with `npm install -g npm@latest` so the bundled CLI matches the current release.
2. Use the maintenance scripts whenever you touch the shared data sets:
   - `npm run validate` checks the fauna and flora catalogs against their JSON schemas so broken entries never reach version control.
   - `npm run build:indexes` regenerates the derived Codex lookups under `dist/indexes/` after you edit animals or plants.
   - `npm run build:spellbook` rebuilds the compiled spellbook if you change `data/game/spell_catalog.ts`.

### Codex catalogs and indexes

`data/animals.json` and `data/plants.json` feed the Codex Bestiary and Herbarium. Running `npm run build:indexes` executes `scripts/buildIndexes.ts`, which writes updated habitat, diet, trade-tier, and region-habitat life maps to `dist/indexes/*.json`. Those precomputed tables ship with the site so the Codex can group entries without recalculating relationships at runtime; regenerate and commit them whenever you add or modify catalog records.

### Catalog validation

`npm run validate` invokes `scripts/validateData.ts`, applying the schemas in `schemas/` to every animal and plant. Run the validator before committing catalog edits so the automated tests—and the Codex UI—only see structurally valid records.

`tests/crossrefs.test.ts` also validates that animal/plant byproducts can be reconciled with economy items using normalized token matching (punctuation-stripped, lowercased, with a few synonym rules) and category hints. When you add new byproducts or expand the economy catalog, update the byproduct cross-reference expectations in that test so gaps stay intentional and visible.

### Dependency maintenance

Run `npm outdated` after large batches of work to identify ecosystem updates. When bumping packages, follow up with the validation and build scripts (`npm run validate`, `npm run build:indexes`, `npm run build:spellbook`) and the complete test suite to confirm the data pipelines still behave as expected.

### Spellbook data

If you update spell definitions or milestones in `data/game/spell_catalog.ts`, run `npm run build:spellbook`. The generator rewrites `data/game/spells.js` with the derived spellbook bundle, keeping the runtime spell UI in sync with the source catalog.

### Recommended tests

`npm test` runs the Vitest suite in `tests/`, covering schema checks, cross references, importer rules, and world integration logic. Execute it before submitting changes that touch shared data or systems.

## Running

No build steps are required. After publishing the repository with GitHub Pages, visit the generated site or open `index.html` directly in a browser.

### Character Creator

Use the **New Character** menu entry to open the character creation wizard UI. The wizard persists draft progress in local storage under the `rpg.charCreator.draft` key, and you can clear it with the reset controls inside the wizard. Summary fields update live as you move through the steps, and the flow will call `window.createCharacter` if it is provided. See `index.html` for the wizard markup and `script.js` for the controller logic.

## Data maintenance guidelines

### Animals and plants catalogs

Maintain fauna entries in `data/animals.json` and flora entries in `data/plants.json`. Each record should include a stable `id`, the relevant `habitats`, and any optional `diet`, tier, or narrative metadata required by the Codex. Allowed habitats, diet classifications, and tier labels live in `src/types/biomes.ts`; update those lists before introducing a brand-new key. Schema files under `schemas/` and tests in `tests/animals.schema.test.ts`, `tests/plants.schema.test.ts`, and `tests/crossrefs.test.ts` enforce structure, uniqueness, and biome alignment, so keep changes consistent with their expectations.

### Economy and items

The economy data in `data/economy/` underpins item pricing, wages, and trade modifiers. Prefer refreshing `data/economy/items.json` and `data/game/region_policy.json` through `tools/importers/import_economy_catalog.js`, which ingests `data/economy/catalog_flat.csv` and `data/economy/region_policy.csv`, normalizes slugs, and validates pricing math. Currency helpers in `data/economy/currency.js` keep display strings consistent, while `data/economy/regional_pricing.js` applies biome-specific multipliers at runtime. The Vitest cases in `tests/economy_import/` cover importer invariants, sale quantities, and profitability; rerun them after adjusting catalog logic or CSV rows.

### Locations, quest boards, and the kingdom hex grid

City and region definitions reside in `data/game/locations.ts` (and the generated `locations.js`). Use `createLocation`, `questHelper`, and the supporting types to structure new settlements, businesses, and quest boards. Every settlement must now provide a crafted narrative description—`createLocation` no longer synthesizes placeholder copy—so author lore-grounded summaries as you expand the setting.

Map entries are anchored to the axial hex grid encoded in `data/game/hexGrid.ts`. Before registering a new city, add its hex definition—coordinates, habitat, key features, and travel links—to the `KINGDOM_HEX_GRID` export. The helper enforces this linkage at runtime, ensuring each location exposes consistent travel data, travel methods, environmental conditions, and neighboring waypoints. When adjusting the grid, keep travel-time assumptions aligned with the shared calculator (`TRAVEL_METHOD_DAYS_PER_HEX`, route-specific logistics, and the new `conditions` metadata) and update downstream references or tests.

When adding businesses or ownership data, keep the curated registries—such as `data/game/waves_break_registry.ts`—in sync so automated checks like `tests/wavesBreakOwnership.test.ts` continue to pass. The helper routines automatically seed quest boards for buildings and districts, so reuse them instead of hand-rolling UI strings.

### Character prompts and imagery

Portrait prompts are composed by `data/game/image_prompts.js`, which stitches together race, theme, and palette data from `data/game/theme_colors.js`, `data/game/character_builds.js`, and `data/game/race_colors.js`. When introducing new races or outfit themes, provide matching color swatches and descriptors so `composeImagePrompt` can generate complete, on-brand art directions.

### Backstories and character origins

Narrative origins now live in the unified catalogue at `data/game/backstories.ts`. Each entry implements the `RichBackstory` interface with a stable, slug-style `id`, a `title`, `legacyBackgrounds`, location coverage (`locations`), narrative beats (`origin`, `currentSituation`, `motivation`), appearance cues, responsibilities, and alignment biases. Optional `allowedJobIds` / `recommendedJobIds` lists reference the canonical job loadouts in `data/game/jobs.ts`, where every job uses a stable slug `id` for cross-references.

Character creation persists both the chosen `backstoryId` and `jobId` so saves can rehydrate narrative context and loadouts independently. Versioned migration in `script.js` maps legacy job labels, hooks, and `legacyBackgrounds` to the current job ids; unknown legacy values fall back to the default job id to keep older saves safe. Preserve prior display strings by adding them to `legacyBackgrounds` so migration can resolve them.

When you add or edit a backstory:

- Update the location registries (for example, `data/game/waves_break_backstories.ts`) with the new backstory `id` wherever it should appear. Locations accept multiple overlapping origins, so reuse existing entries instead of duplicating similar lore.
- Run `tsx scripts/buildBackstoriesJs.ts` to regenerate the runtime catalogue (`data/game/backstories.js`) and `tsx scripts/generateBackstoryCatalog.ts` if you need a refreshed `reports/backstory_catalog_summary.json` snapshot for documentation.
- Execute `npm test` to rerun `tests/backstories.test.ts`, which verifies that loadouts, currency parsing, location filters, and legacy mappings remain consistent.

Utility helpers exposed by the catalogue—such as pronoun substitution and currency parsing—can be reused in new systems. Use `applyPronouns` when authoring narrative copy with `${pronoun.*}` placeholders and `parseCurrency` / `currencyToCopper` when converting loadout strings into structured coin totals.

### Variable defaults and assumptions

The UI sanitizes partially specified saves and Codex entries through helpers such as `normalizeCodexRecord`, `normalizeCodexCategory`, `ensureCollections`, and `ensureQuestLog` inside `script.js`. They coerce missing study levels to 1, ensure encountered lists are objects keyed by id, and populate quest logs with minimal fields. Supplying well-formed data prevents those fallbacks from masking mistakes, so prefer explicit numeric levels, booleans, and identifiers when touching serialized state.

### Additional resources

`docs/economy_catalog.md` documents the CSV importer fields in depth, `docs/hex_grid.md` captures the hex coordinate workflow, and the `tests/` folder illustrates the invariants we expect across data sets. Browsing those files before large edits will save time chasing validation or test failures.

### Stamina intensity system and menu indicators

Outdoor actions now drain or replenish stamina according to intensity and recovery factors defined in `script.js`. Conventional recovery tapers off once a character has been awake for more than 24 hours unless aided by unconventional means, so plan long expeditions around magical support or crafted elixirs. The top navigation menu renders hanging HP, MP, stamina, and XP bars with hover tooltips that reflect these realtime changes, keeping vital statistics visible while exploring.

## Structure

- `index.html` – entry point for the game UI
- `style.css` – basic styles and themes
- `script.js` – behaviour for the menu and layout controls; progression helpers live in dedicated modules under `data/game`
- `dist/indexes/` – precomputed Codex lookup tables regenerated by `npm run build:indexes`
  - `dist/indexes/regionHabitat.life.json` – links each region-habitat pairing to available animals and plants for location-aware systems
- `data/animals.json` / `data/plants.json` – core Codex catalogs that drive the Bestiary and Herbarium
- `data/economy/` – coin denominations, trade goods, and pricing helpers
- `data/economy/catalog_flat.csv` / `data/economy/region_policy.csv` – source CSVs for the economy importer
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

### Referencing image assets

When a UI feature depends on an image that is not yet available, keep the code pointed at the final path so the asset loads automatically once it is added. Commit an empty placeholder named for the missing file (for example, `rest.png.gitkeep`) so Git tracks the exact asset location without requiring temporary artwork.

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
