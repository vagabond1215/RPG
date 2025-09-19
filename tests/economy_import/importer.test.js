import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { runImport } from '../../tools/importers/import_economy_catalog.js';
import { toCp, cpToCoins } from '../../data/economy/currency.js';
import { computePrice } from '../../data/economy/regional_pricing.js';
import { parse } from 'csv-parse/sync';

function makeTmp(){
  return fs.mkdtempSync(path.join(os.tmpdir(), 'econ-'));
}

function readCsv(file){
  const content = fs.readFileSync(file, 'utf8');
  return parse(content, {columns:true, skip_empty_lines:true});
}

function writeCsv(file, rows){
  if (rows.length === 0) throw new Error('cannot write empty csv');
  const headers = Object.keys(rows[0]);
  const lines = [];
  lines.push(headers.join(','));
  for (const row of rows){
    lines.push(headers.map(h => escapeCsvValue(row[h] ?? '')).join(','));
  }
  fs.writeFileSync(file, lines.join('\n') + '\n');
}

function escapeCsvValue(value){
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n]/.test(str)){
    return '"' + str.replace(/"/g,'""') + '"';
  }
  return str;
}

async function baseImport(tmpDir, {catalogPath='data/economy/catalog_flat.csv', policySourcePath='data/economy/region_policy.csv'}={}){
  const itemsPath = path.join(tmpDir, 'items.json');
  const policyPath = path.join(tmpDir, 'policy.json');
  const reportPath = path.join(tmpDir, 'report.json');
  const res = await runImport({catalogPath, policySourcePath, itemsPath, policyPath, reportPath});
  return {res, itemsPath, policyPath};
}

test('importer idempotent', async () => {
  const tmp = makeTmp();
  const {res, itemsPath, policyPath} = await baseImport(tmp);
  assert.ok(res.inserted > 0);
  const res2 = await runImport({itemsPath, policyPath, reportPath:path.join(tmp,'r2.json')});
  assert.equal(res2.inserted, 0);
  assert.equal(res2.updated, 0);
});

test('single row update', async () => {
  const tmp = makeTmp();
  const {itemsPath, policyPath} = await baseImport(tmp);
  const rows = readCsv('data/economy/catalog_flat.csv');
  rows[0].DisplayName = String(rows[0].DisplayName || '') + ' Updated';
  const catalogPath = path.join(tmp, 'catalog.csv');
  writeCsv(catalogPath, rows);
  const regionPolicyPath = path.join(tmp, 'region_policy.csv');
  fs.copyFileSync('data/economy/region_policy.csv', regionPolicyPath);
  const res = await runImport({catalogPath, policySourcePath:regionPolicyPath, itemsPath, policyPath, reportPath:path.join(tmp,'r3.json')});
  assert.equal(res.updated, 1);
});

test('region policy count', async () => {
  const tmp = makeTmp();
  const {policyPath} = await baseImport(tmp);
  const policies = JSON.parse(fs.readFileSync(policyPath));
  assert.equal(policies.length, 12);
});

test('display name normalization removes common labels and adds quality prefixes', async () => {
  const tmp = makeTmp();
  const {itemsPath} = await baseImport(tmp);
  const items = JSON.parse(fs.readFileSync(itemsPath));

  const apples = items.find(item => item.internal_name === 'apples-(dozen)-(common)');
  assert.ok(apples, 'common apples present');
  assert.equal(apples.display_name, 'Apples');

  const stapleApples = items.find(item => item.internal_name === 'apples-(dozen)-(low-inn)');
  assert.ok(stapleApples, 'staple apples present');
  assert.equal(stapleApples.display_name, 'Staple Low Inn Apples');

  const luxuryBread = items.find(item => item.internal_name === 'bread-loaf-(1-lb)-(high-table)');
  assert.ok(luxuryBread, 'luxury bread present');
  assert.ok(/^Luxury\b/.test(luxuryBread.display_name));
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

