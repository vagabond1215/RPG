# Fantasy Economy Catalog

This repository stores item, wage, and region policy data imported from the `Fantasy_Economy_Catalog_REBUILT.xlsx` workbook.

## Sheets

### `Catalog_Flat`
Key columns used by the importer:

| Column | Description |
| --- | --- |
| `CategoryKey` | Category or trade group key |
| `DisplayName` | User facing name |
| `InternalName` | Stable slug used as natural key |
| `Variant` | Item variant (e.g. Low Inn, Fine) |
| `QualityTier` | Staple/Common/Fine/Luxury/Arcane |
| `PrimaryConsumer` | Commoner/Artisan/Military/Merchant/Temple/Noble/All |
| `Unit` | Unit of measure |
| `MarketValue_cp` | Base market value in copper pieces |
| `MaterialCost_cp`, `LaborCost_cp`, `Overhead_cp` | Cost inputs |
| `MC_eff`, `LC_eff` | Cost efficiencies |
| `EffectiveTaxPct`, `TaxAmount_cp` | Tax fields |
| `NetProfit_cp` | Profit after tax |
| `Regions` | Semicolon or comma separated list of biomes |
| `Duty`, `DutyPct`, `DutyFree` | Duty flags |
| `ImportReliant`, `ImportTier`, `ExportFriendly` | Sourcing flags |
| `Perishable`, `Bulky`, `Fragile` | Transport traits |
| `RegionalMult_InRegion`, `RegionalMult_OutOfRegion` | Preview regional multipliers |

Natural key: `slugify(InternalName)` + `Variant`. This ensures idempotent upserts without duplicates.

### `RegionPolicy`
Defines biome adjustments applied when pricing items out of their home regions.

| Column | Description |
| --- | --- |
| `Biome` | One of the twelve supported biomes |
| `Delta_Perishable` | Multiplier delta for perishable goods |
| `Delta_Bulky` | Multiplier delta for bulky goods |
| `Delta_Fragile` | Multiplier delta for fragile goods |
| `Notes` | Freeform notes |

## Importer

Run the importer to refresh data:

```bash
# Dry run
node tools/importers/import_economy_catalog.js --file Fantasy_Economy_Catalog_REBUILT.xlsx --dry-run

# Real run
node tools/importers/import_economy_catalog.js --file Fantasy_Economy_Catalog_REBUILT.xlsx
```

A report is written to `reports/import_economy_catalog_<timestamp>.json` summarising inserts, updates, skips and validation errors.

## Currency Helpers

Coin arithmetic and formatting reuse the existing utilities in `data/economy/currency.js` to avoid duplicate currency logic.

### Base value and historical parity

All catalog pricing is anchored to the staple **Coarse Hearth Bread** loaf, which the workbook values at `0.679cp` before taxes and profit.【F:data/economy/items.json†L2-L45】 With the campaign assumption that `1cp ≈ £1` in medieval sterling, this baseline equates to roughly 13–14 shillings for a hearty one-pound loaf—close to the going rate for quality wheat bread in periods of abundance. Every other listed good derives from that anchor through workbook cost ratios and quality multipliers, so validating new entries starts with asking how they compare against the bread baseline.

When pricing new goods, convert between denominations with the helpers in `data/economy/currency.js`:

```js
import { toCp, cpToCoins } from '../data/economy/currency.js';

const priceInCp = toCp({ cp: 1, st: 5 });
const display = cpToCoins(priceInCp);
```

The importer and accompanying checks expect all pricing math to round-trip through these utilities, so prefer them over ad-hoc conversions.【F:data/economy/currency.js†L1-L104】

## Regional Pricing

Runtime pricing uses `data/economy/regional_pricing.js`:

```js
import { computePrice } from '../data/economy/regional_pricing.js';
import policy from '../data/game/region_policy.json' assert { type: 'json' };
const item = /* item from catalog */;
const price = computePrice(item.market_value_cp, item, 'desert', policyMap);
```

Where `policyMap` maps biome keys to policy rows. In-region prices use `RegionalMult_InRegion`. Out-of-region prices start with `RegionalMult_OutOfRegion` then apply biome deltas based on transport traits. The multiplier is clamped between 0.90 and 1.40.

## Validating economy balance

Two automated checks keep the catalog in a believable range:

1. The Excel importer refuses to ingest rows whose computed `net_profit_cp` differs from the workbook formula, ensuring that material, labour, overhead, and tax inputs reconcile to the stored profit.【F:tools/importers/import_economy_catalog.js†L35-L92】
2. The `net_profit.test.js` suite replays the same calculation and asserts profits remain non-negative and never exceed their item’s `market_value_cp`, preserving the 5–35 % profit window established in the source sheet.【F:tests/economy_import/net_profit.test.js†L1-L13】
3. `profit_margin.test.js` enforces the same window explicitly, flagging entries whose margins fall below 4.5 % or climb above 35 % so luxury markups never explode and staples still return a sustainable profit.【F:tests/economy_import/profit_margin.test.js†L1-L18】

Regenerate the JSON with `node tools/importers/import_economy_catalog.js --file Fantasy_Economy_Catalog_REBUILT.xlsx` and rerun the Node test (`node --test tests/economy_import/net_profit.test.js`) after tuning workbook rows. This guarantees every price, wage, or quest reward derived from the catalog remains proportional to the bread baseline and within the repository’s expected margins.【F:reports/import_economy_catalog_2025-09-19T00-14-05-153Z.json†L1-L6】【7c63fc†L1-L12】

## Extending the Catalog

1. Add new rows to the Excel workbook.
2. Ensure `InternalName` and `Variant` combination is unique.
3. Run the importer. Existing items with matching keys are updated; new items are appended.
4. Commit the updated JSON files and report as needed.
