import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { mergeBaselineCosts } from '../../tools/importers/merge_baseline_costs.js';

function tmpFile(){
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'base-')), 'items.json');
}

test('baseline merge idempotent', () => {
  const itemsPath = tmpFile();
  fs.writeFileSync(itemsPath, '[]');
  const first = mergeBaselineCosts({ itemsPath });
  assert.ok(first.inserted > 0);
  const second = mergeBaselineCosts({ itemsPath });
  assert.equal(second.inserted, 0);
  const data = JSON.parse(fs.readFileSync(itemsPath));
  assert.ok(data.find(d => d.internal_name === 'bread-loaf-1-lb'));
});

