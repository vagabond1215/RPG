#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'assets', 'images', 'Race Photos');
const manifestPath = path.join(__dirname, '..', 'assets', 'images', 'race_photos.json');

const races = {};
for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const [sex, ...rest] = entry.name.split(' ').reverse();
  const race = rest.reverse().join(' ');
  const files = fs
    .readdirSync(path.join(baseDir, entry.name))
    .filter(f => /\.(png|webp)$/i.test(f))
    .sort();
  races[race] = races[race] || { Male: [], Female: [] };
  races[race][sex] = files;
}
const ordered = Object.keys(races)
  .sort()
  .reduce((obj, key) => ({ ...obj, [key]: races[key] }), {});
fs.writeFileSync(manifestPath, JSON.stringify(ordered, null, 2));
console.log(`Wrote ${manifestPath}`);
