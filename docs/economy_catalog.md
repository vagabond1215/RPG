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

## Regional Pricing

Runtime pricing uses `data/economy/regional_pricing.js`:

```js
import { computePrice } from '../data/economy/regional_pricing.js';
import policy from '../data/game/region_policy.json' assert { type: 'json' };
const item = /* item from catalog */;
const price = computePrice(item.market_value_cp, item, 'desert', policyMap);
```

Where `policyMap` maps biome keys to policy rows. In-region prices use `RegionalMult_InRegion`. Out-of-region prices start with `RegionalMult_OutOfRegion` then apply biome deltas based on transport traits. The multiplier is clamped between 0.90 and 1.40.

## Extending the Catalog

1. Add new rows to the Excel workbook.
2. Ensure `InternalName` and `Variant` combination is unique.
3. Run the importer. Existing items with matching keys are updated; new items are appended.
4. Commit the updated JSON files and report as needed.
