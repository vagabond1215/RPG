import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import xlsx from 'xlsx';
import { runImport } from '../../tools/importers/import_economy_catalog.js';
import { toCp, cpToCoins } from '../../assets/economy/currency.js';
import { computePrice } from '../../assets/economy/regional_pricing.js';

function makeTmp(){
  return fs.mkdtempSync(path.join(os.tmpdir(), 'econ-'));
}

async function baseImport(tmpDir, file){
  const itemsPath = path.join(tmpDir, 'items.json');
  const policyPath = path.join(tmpDir, 'policy.json');
  const reportPath = path.join(tmpDir, 'report.json');
  const res = await runImport({file, itemsPath, policyPath, reportPath});
  return {res, itemsPath, policyPath};
}

test('importer idempotent', async () => {
  const tmp = makeTmp();
  const {res, itemsPath, policyPath} = await baseImport(tmp, 'Fantasy_Economy_Catalog_REBUILT.xlsx');
  assert.ok(res.inserted > 0);
  const res2 = await runImport({file:'Fantasy_Economy_Catalog_REBUILT.xlsx', itemsPath, policyPath, reportPath:path.join(tmp,'r2.json')});
  assert.equal(res2.inserted, 0);
  assert.equal(res2.updated, 0);
});

test('single row update', async () => {
  const tmp = makeTmp();
  const {itemsPath, policyPath} = await baseImport(tmp, 'Fantasy_Economy_Catalog_REBUILT.xlsx');
  const wb = xlsx.readFile('Fantasy_Economy_Catalog_REBUILT.xlsx');
  const items = xlsx.utils.sheet_to_json(wb.Sheets['Catalog_Flat']);
  items[0].DisplayName = String(items[0].DisplayName || '') + ' Updated';
  const wb2 = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb2, xlsx.utils.json_to_sheet(items), 'Catalog_Flat');
  const policy = xlsx.utils.sheet_to_json(wb.Sheets['RegionPolicy']);
  xlsx.utils.book_append_sheet(wb2, xlsx.utils.json_to_sheet(policy), 'RegionPolicy');
  const tempFile = path.join(tmp, 'mod.xlsx');
  xlsx.writeFile(wb2, tempFile);
  const res = await runImport({file:tempFile, itemsPath, policyPath, reportPath:path.join(tmp,'r3.json')});
  assert.equal(res.updated, 1);
});

test('region policy count', async () => {
  const tmp = makeTmp();
  const {policyPath} = await baseImport(tmp, 'Fantasy_Economy_Catalog_REBUILT.xlsx');
  const policies = JSON.parse(fs.readFileSync(policyPath));
  assert.equal(policies.length, 12);
});

test('coin round trip', () => {
  const cp = toCp({g:1, si:1, cp:45});
  assert.equal(cpToCoins(cp), '1g 1si 45cp');
});

test('regional pricing difference', () => {
  const policy = { desert: { delta_perishable:0.04, delta_bulky:0.03, delta_fragile:0 } };
  const item = { regions:['grassland'], perishable:true, bulky:false, fragile:false, regional_mult_in:1, regional_mult_out:1 };
  const inRegion = computePrice(100, item, 'grassland', policy);
  const outRegion = computePrice(100, item, 'desert', policy);
  assert.equal(inRegion, 100);
  assert.equal(outRegion, 104);
});

