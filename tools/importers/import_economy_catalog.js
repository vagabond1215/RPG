import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import slugify from 'slugify';
import { cpToCoins } from '../../assets/data/currency.js';

const ALLOWED_BIOMES = [
  'coastal','riverlands','lake','wetland','grassland','farmland',
  'forest','hills','mountains','desert','tundra','urban'
];

function parseBool(val){
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return val.trim().toLowerCase() === 'true';
  return !!val;
}

export async function runImport({file, dryRun=false, itemsPath='assets/data/economy_items.json', policyPath='assets/data/region_policy.json', reportPath}){
  const wb = xlsx.readFile(file);
  const itemsSheet = xlsx.utils.sheet_to_json(wb.Sheets['Catalog_Flat'], {defval:null});
  const policySheet = xlsx.utils.sheet_to_json(wb.Sheets['RegionPolicy'], {defval:null});

  const existingItems = fs.existsSync(itemsPath) ? JSON.parse(fs.readFileSync(itemsPath,'utf8')) : [];
  const existingMap = new Map(existingItems.map(it=>[`${it.internal_name}__${it.variant}`, it]));

  const report = {inserted:0, updated:0, skipped:0, errors:[]};
  const resultItems = [...existingItems];

  for (const row of itemsSheet){
    const internal = row.InternalName ? slugify(row.InternalName, {lower:true}) : slugify(row.DisplayName || '', {lower:true});
    const variant = row.Variant || '';
    const key = `${internal}__${variant}`;

    const item = {
      category_key: row.CategoryKey || null,
      internal_name: internal,
      display_name: row.DisplayName || null,
      base_item: row.BaseItem || null,
      variant: variant,
      quality_tier: row.QualityTier || null,
      primary_consumer: row.PrimaryConsumer || null,
      unit: row.Unit || null,
      market_value_cp: Number(row.MarketValue_cp)||0,
      display_price: row.DisplayPrice || null,
      display_price_tidy: row.DisplayPrice_Tidy || null,
      suggested_price_cp: Number(row.SuggestedPrice_cp)||0,
      suggested_display_price: row.SuggestedDisplayPrice || null,
      material_cost_cp: Number(row.MaterialCost_cp)||0,
      labor_cost_cp: Number(row.LaborCost_cp)||0,
      overhead_cp: Number(row.Overhead_cp)||0,
      mc_eff: Number(row.MC_eff)||0,
      lc_eff: Number(row.LC_eff)||0,
      effective_tax_pct: Number(row.EffectiveTaxPct)||0,
      tax_amount_cp: Number(row.TaxAmount_cp)||0,
      net_profit_cp: Number(row.NetProfit_cp)||0,
      duty: parseBool(row.Duty),
      duty_pct: Number(row.DutyPct)||0,
      duty_free: parseBool(row.DutyFree),
      regions: row.Regions ? row.Regions.split(/[;,]/).map(r=>r.trim()).filter(r=>r) : [],
      import_reliant: parseBool(row.ImportReliant),
      import_tier: Number(row.ImportTier)||0,
      export_friendly: parseBool(row.ExportFriendly),
      sourcing_notes: row.SourcingNotes || '',
      perishable: parseBool(row.Perishable),
      bulky: parseBool(row.Bulky),
      fragile: parseBool(row.Fragile),
      value_dense: parseBool(row.ValueDense),
      corridor_friendly: parseBool(row.CorridorFriendly),
      regional_mult_in: Number(row.RegionalMult_InRegion)||1,
      regional_mult_out: Number(row.RegionalMult_OutOfRegion)||1,
    };

    // validations
    if (item.market_value_cp < 0){
      report.errors.push({key, error:'negative market value'}); continue;
    }
    const regionsValid = item.regions.every(b=>ALLOWED_BIOMES.includes(b));
    if (!regionsValid){
      report.errors.push({key, error:'invalid region'}); continue;
    }
    const calcNet = item.market_value_cp - (item.mc_eff + item.lc_eff + item.overhead_cp) - item.tax_amount_cp;
    if (Math.abs(calcNet - item.net_profit_cp) > 0.01){
      report.errors.push({key, error:'net profit mismatch'}); continue;
    }
    if (!item.display_price){
      item.display_price = cpToCoins(item.market_value_cp, false);
    }
    if (!item.display_price_tidy){
      item.display_price_tidy = cpToCoins(item.market_value_cp, true);
    }

    const existing = existingMap.get(key);
    if (existing){
      const changed = JSON.stringify(existing) !== JSON.stringify(item);
      if (changed){
        const idx = resultItems.indexOf(existing);
        resultItems[idx] = item;
        existingMap.set(key, item);
        report.updated++;
      } else {
        report.skipped++;
      }
    } else {
      resultItems.push(item);
      existingMap.set(key, item);
      report.inserted++;
    }
  }

  const regionPolicies = policySheet.map(r=>({
    biome: r.Biome,
    delta_perishable: Number(r.Delta_Perishable)||0,
    delta_bulky: Number(r.Delta_Bulky)||0,
    delta_fragile: Number(r.Delta_Fragile)||0,
    notes: r.Notes || ''
  }));

  if (!dryRun){
    fs.writeFileSync(itemsPath, JSON.stringify(resultItems, null, 2));
    fs.writeFileSync(policyPath, JSON.stringify(regionPolicies, null, 2));
  }

  if (!reportPath){
    const ts = new Date().toISOString().replace(/[:.]/g,'-');
    reportPath = path.join('reports', `import_economy_catalog_${ts}.json`);
  }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

function parseArgs(){
  const args = process.argv.slice(2);
  const opts = {dryRun:false};
  for (let i=0;i<args.length;i++){
    const a = args[i];
    if (a === '--file') opts.file = args[++i];
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--items-output') opts.itemsPath = args[++i];
    else if (a === '--policy-output') opts.policyPath = args[++i];
    else if (a === '--report') opts.reportPath = args[++i];
  }
  return opts;
}

if (import.meta.url === `file://${process.argv[1]}`){
  const opts = parseArgs();
  if (!opts.file){
    console.error('Usage: node tools/importers/import_economy_catalog.js --file <xlsx> [--dry-run]');
    process.exit(1);
  }
  runImport(opts).then(r=>{
    console.log(JSON.stringify(r, null, 2));
  }).catch(e=>{
    console.error(e);
    process.exit(1);
  });
}
