import { readFile, writeFile } from 'fs/promises';
import slugify from 'slugify';

const animalsList = [
  // missing animals
  { name: 'Cattle', taxon: 'mammal', habitat: 'farmland', domesticated: true, diet: 'herbivore' },
  { name: 'Sheep', taxon: 'mammal', habitat: 'farmland', domesticated: true, diet: 'herbivore' },
  { name: 'Goat', taxon: 'mammal', habitat: 'farmland', domesticated: true, diet: 'herbivore' },
  { name: 'Pig', taxon: 'mammal', habitat: 'farmland', domesticated: true, diet: 'omnivore' },
  { name: 'Duck', taxon: 'bird', habitat: 'farmland', domesticated: true, diet: 'omnivore' },
  { name: 'Goose', taxon: 'bird', habitat: 'farmland', domesticated: true, diet: 'omnivore' },
  { name: 'Donkey', taxon: 'mammal', habitat: 'farmland', domesticated: true, diet: 'herbivore' },
  { name: 'Dog', taxon: 'mammal', habitat: 'urban', domesticated: true, diet: 'omnivore' },
  { name: 'Cat', taxon: 'mammal', habitat: 'urban', domesticated: true, diet: 'carnivore' },
  { name: 'Honeybee', taxon: 'insect', habitat: 'farmland', domesticated: true, diet: 'herbivore' },
  { name: 'Deer', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'herbivore' },
  { name: 'Rabbit', taxon: 'mammal', habitat: 'farmland', domesticated: true, diet: 'herbivore' },
  { name: 'Horse', taxon: 'mammal', habitat: 'farmland', domesticated: true, diet: 'herbivore' },
  { name: 'Mule', taxon: 'mammal', habitat: 'farmland', domesticated: true, diet: 'herbivore' },
  { name: 'Falcon', taxon: 'bird', habitat: 'forest', domesticated: false, diet: 'carnivore' },
  { name: 'Pigeon', taxon: 'bird', habitat: 'urban', domesticated: true, diet: 'herbivore' },
  { name: 'Dove', taxon: 'bird', habitat: 'forest', domesticated: false, diet: 'herbivore' },
  { name: 'Boar', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'omnivore' },
  { name: 'Hare', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'herbivore' },
  { name: 'Bear', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'omnivore' },
  { name: 'Wolf', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'carnivore' },
  { name: 'Fox', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'carnivore' },
  { name: 'Carp', taxon: 'fish', habitat: 'lakes', domesticated: false, diet: 'omnivore' },
  { name: 'Trout', taxon: 'fish', habitat: 'rivers', domesticated: false, diet: 'carnivore' },
  { name: 'Herring', taxon: 'fish', habitat: 'open_ocean', domesticated: false, diet: 'omnivore' },
  { name: 'Cod', taxon: 'fish', habitat: 'open_ocean', domesticated: false, diet: 'carnivore' },
  { name: 'Eel', taxon: 'fish', habitat: 'rivers', domesticated: false, diet: 'carnivore' },
  { name: 'Swan', taxon: 'bird', habitat: 'lakes', domesticated: false, diet: 'herbivore' },
  { name: 'Rat', taxon: 'mammal', habitat: 'urban', domesticated: false, diet: 'omnivore' },
  { name: 'Mouse', taxon: 'mammal', habitat: 'urban', domesticated: false, diet: 'omnivore' },
  { name: 'Hedgehog', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'insectivore' },
  { name: 'Badger', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'omnivore' },
  { name: 'Lynx', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'carnivore' },
  { name: 'Wildcat', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'carnivore' },
  { name: 'Squirrel', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'herbivore' },
  { name: 'Elk', taxon: 'mammal', habitat: 'forest', domesticated: false, diet: 'herbivore' },
  { name: 'Bison', taxon: 'mammal', habitat: 'grassland', domesticated: false, diet: 'herbivore' },
  { name: 'Camel', taxon: 'mammal', habitat: 'hot_desert', domesticated: true, diet: 'herbivore' },
  { name: 'Peafowl', taxon: 'bird', habitat: 'farmland', domesticated: true, diet: 'omnivore' },
  { name: 'Crane', taxon: 'bird', habitat: 'marshes', domesticated: false, diet: 'omnivore' },
  { name: 'Owl', taxon: 'bird', habitat: 'forest', domesticated: false, diet: 'carnivore' },
  { name: 'Hawk', taxon: 'bird', habitat: 'forest', domesticated: false, diet: 'carnivore' },
  { name: 'Eagle', taxon: 'bird', habitat: 'cliffs', domesticated: false, diet: 'carnivore' },
  { name: 'Snake', taxon: 'reptile', habitat: 'forest', domesticated: false, diet: 'carnivore' },
  { name: 'Frog', taxon: 'amphibian', habitat: 'marshes', domesticated: false, diet: 'insectivore' },
  { name: 'Toad', taxon: 'amphibian', habitat: 'marshes', domesticated: false, diet: 'insectivore' },
  { name: 'Snail', taxon: 'mollusk', habitat: 'forest', domesticated: false, diet: 'herbivore' },
  { name: 'Earthworm', taxon: 'annelid', habitat: 'farmland', domesticated: false, diet: 'detritivore' },
  { name: 'Ant', taxon: 'insect', habitat: 'forest', domesticated: false, diet: 'omnivore' },
];

const plantNames = [
  'Wheat','Barley','Rye','Oats','Spelt','Millet','Buckwheat',
  'Peas','Lentils','Broad beans','Chickpeas','Onions','Garlic','Leeks','Shallots','Turnips','Carrots','Parsnips','Beets','Radishes','Pears','Plums','Cherries','Quinces','Grapes','Figs','Olives','Mulberries','Strawberries','Raspberries','Blackberries','Hazelnuts','Walnuts','Chestnuts','Flax','Hemp','Mustard','Poppy','Sage','Rosemary','Thyme','Mint','Lavender','Rue','Yarrow','Chamomile','Angelica','St. John\'s Wort'];

const grasses = new Set(['Wheat','Barley','Rye','Oats','Spelt','Millet','Buckwheat']);
const vines = new Set(['Grapes']);
const shrubs = new Set(['Strawberries','Raspberries','Blackberries']);
const trees = new Set(['Pears','Plums','Cherries','Quinces','Figs','Olives','Mulberries','Hazelnuts','Walnuts','Chestnuts']);

(async () => {
  const animalData = JSON.parse(await readFile('data/animals.json','utf-8'));
  const animalIds = new Set(animalData.map(a => a.id));
  for (const a of animalsList) {
    const id = slugify(a.name, { lower: true, strict: true });
    if (animalIds.has(id)) continue;
    animalData.push({
      id,
      common_name: a.name,
      taxon_group: a.taxon,
      regions: a.taxon === 'fish' ? ['aquatic'] : ['terrestrial'],
      habitats: [a.habitat],
      diet: [a.diet],
      domestication: { domesticated: a.domesticated },
      behavior: { aggressive: false, territorial: false, risk_to_humans: a.domesticated ? 'low' : 'moderate' },
      edibility: { edible: true, parts: ['meat'] },
      byproducts: [{ type: 'other' }],
      gendered: {},
      narrative: ''
    });
    animalIds.add(id);
  }
  animalData.sort((x,y)=>x.id.localeCompare(y.id));
  await writeFile('data/animals.json', JSON.stringify(animalData, null, 2));

  const plantData = JSON.parse(await readFile('data/plants.json','utf-8'));
  const plantIds = new Set(plantData.map(p => p.id));
  for (const name of plantNames) {
    const id = slugify(name, { lower: true, strict: true });
    if (plantIds.has(id)) continue;
    let growth_form = 'herb';
    if (grasses.has(name)) growth_form = 'grass';
    else if (vines.has(name)) growth_form = 'vine';
    else if (shrubs.has(name)) growth_form = 'shrub';
    else if (trees.has(name)) growth_form = 'tree';
    plantData.push({
      id,
      common_name: name,
      growth_form,
      regions: ['terrestrial'],
      habitats: ['farmland'],
      cultivated: true,
      edible: true,
      byproducts: [{ type: 'other' }],
      narrative: ''
    });
    plantIds.add(id);
  }
  plantData.sort((x,y)=>x.id.localeCompare(y.id));
  await writeFile('data/plants.json', JSON.stringify(plantData, null, 2));
})();

