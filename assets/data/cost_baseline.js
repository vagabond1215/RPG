import { parseCurrency, toIron, fromIron, formatCurrency, convertCurrency } from './currency.js';

/**
 * Baseline commodity and service prices expressed in the game's currency system.
 * Prices are stored as cold-iron equivalents so they can be converted to any
 * denomination (copper, silver, gold, etc.) through the currency helpers.
 */
export const BASELINE_COSTS = {
  flourSack: {
    label: 'Sack of flour (~25 lb)',
    iron: toIron(parseCurrency('6 cp')),
    rationale: '280‑lb sack historically ~60d ⇒ scaled down to 25 lb'
  },
  dozenEggs: {
    label: 'Dozen eggs',
    iron: toIron(parseCurrency('4 cp')),
    rationale: 'Recorded range 3–6d; hens common near cities'
  },
  breadLoaf: {
    label: 'Loaf of bread (~1 lb)',
    iron: toIron(parseCurrency('1 cp')),
    rationale: 'Wheaten loaf; rye/barley could be ½ cp'
  },
  waterskinFilled: {
    label: 'Waterskin, filled',
    iron: toIron(parseCurrency('8 cp')),
    rationale: 'Includes leatherwork, strap, and plug'
  },
  waterRefill: {
    label: 'Water refill (street vendor)',
    ironRange: [0, convertCurrency(0.5, 'copper', 'coldIron')],
    rationale: 'Public sources free; charge if carried/drawn'
  },
  aleTankard: {
    label: 'Tankard of ale (pint, tavern)',
    iron: toIron(parseCurrency('2 cp')),
    rationale: 'Ale 1–2d/gal; tavern markup'
  },
  beefJerky: {
    label: 'Beef jerky (meal portion)',
    iron: toIron(parseCurrency('4 cp')),
    rationale: 'Extra labor + shrinkage over fresh beef'
  },
  rawChicken: {
    label: 'Raw chicken (whole)',
    iron: toIron(parseCurrency('3 cp')),
    rationale: 'Common poultry; affordable protein'
  },
  basicClothes: {
    label: 'Basic cloth shirt & pants',
    iron: toIron(parseCurrency('18 cp')),
    rationale: 'Tunic + trousers in homespun cloth'
  },
  leatherShoes: {
    label: 'Simple leather shoes',
    iron: toIron(parseCurrency('8 cp')),
    rationale: 'Historical range 6–12d'
  },
  leatherBelt: {
    label: 'Simple leather belt',
    iron: toIron(parseCurrency('3 cp')),
    rationale: 'Low labor tanning/cutting'
  },
  rentSuite: {
    label: 'Rent (single suite, monthly)',
    iron: toIron(parseCurrency('18 cp')),
    rationale: 'Modest urban lodgings'
  },
  innNight: {
    label: 'Low-end inn, 1 night',
    iron: toIron(parseCurrency('4 cp')),
    rationale: 'Food sometimes bundled (+1–2d)'
  }
};

/**
 * Expanded tabular baseline prices in raw copper pieces for ease of lookup.
 * These values can be converted to other denominations via `convertCurrency`.
 */
export const BASELINE_COST_DATA = [
  // Food & Drink
  { category: 'Food & Drink', item: 'Bread, loaf (1 lb)', price_cp: 1 },
  { category: 'Food & Drink', item: 'Rye/barley loaf (1 lb)', price_cp: 0.5 },
  { category: 'Food & Drink', item: 'Dozen eggs', price_cp: 4 },
  { category: 'Food & Drink', item: 'Whole chicken', price_cp: 3 },
  { category: 'Food & Drink', item: 'Beef, fresh per lb', price_cp: 1 },
  { category: 'Food & Drink', item: 'Beef jerky (meal portion)', price_cp: 4 },
  { category: 'Food & Drink', item: 'Cheese (per lb)', price_cp: 2 },
  { category: 'Food & Drink', item: 'Butter (per lb)', price_cp: 2 },
  { category: 'Food & Drink', item: 'Milk (quart)', price_cp: 1 },
  { category: 'Food & Drink', item: 'Ale, tankard', price_cp: 2 },
  { category: 'Food & Drink', item: 'Wine, common pitcher', price_cp: 6 },
  { category: 'Food & Drink', item: 'Wine, fine bottle', price_cp: 240 },
  { category: 'Food & Drink', item: 'Honey (per lb)', price_cp: 6 },

  { category: 'Food & Drink', item: 'Salt (1 lb)', price_cp: 3 },
  { category: 'Food & Drink', item: 'Pepper (1 oz)', price_cp: 60 },
  { category: 'Food & Drink', item: 'Cinnamon (1 oz)', price_cp: 80 },
  { category: 'Food & Drink', item: 'Vinegar (quart)', price_cp: 1 },
  { category: 'Food & Drink', item: 'Pickled vegetables (jar)', price_cp: 2 },
  { category: 'Food & Drink', item: 'Dried fruit (1 lb)', price_cp: 6 },
  { category: 'Food & Drink', item: 'Fish, smoked (1 lb)', price_cp: 3 },

  { category: 'Food & Drink', item: 'Trail rations (1 day, bread/cheese/dried meat)', price_cp: 5 },
  { category: 'Food & Drink', item: 'Trail rations (1 week, bulk pack)', price_cp: 30 },
  { category: 'Food & Drink', item: 'Waterskin refill (vendor)', price_cp: 0.5 },
  { category: 'Food & Drink', item: 'Rations, luxury (spiced, dried fruit, nuts, wine per day)', price_cp: 30 },
  { category: 'Food & Drink', item: 'Jerky strips (snack, handful)', price_cp: 1 },
  { category: 'Food & Drink', item: 'Pickled fish (jar, 2 lb)', price_cp: 8 },
  { category: 'Food & Drink', item: 'Hardtack (10 biscuits)', price_cp: 3 },
  { category: 'Food & Drink', item: 'Dried beans (per lb)', price_cp: 1 },
  { category: 'Food & Drink', item: 'Lentils (per lb)', price_cp: 1 },
  { category: 'Food & Drink', item: 'Onion (per dozen)', price_cp: 1 },
  { category: 'Food & Drink', item: 'Garlic (1 head)', price_cp: 0.2 },
  { category: 'Food & Drink', item: 'Apple (each, common)', price_cp: 0.2 },
  { category: 'Food & Drink', item: 'Apple (dozen)', price_cp: 2 },
  { category: 'Food & Drink', item: 'Pear (each)', price_cp: 0.3 },
  { category: 'Food & Drink', item: 'Nuts (per lb, hazelnut/walnut)', price_cp: 4 },
  { category: 'Food & Drink', item: 'Spice pouch (mixed, common)', price_cp: 24 },
  { category: 'Food & Drink', item: 'Candied ginger (small box)', price_cp: 12 },
  { category: 'Food & Drink', item: 'Wine skin, filled (cheap)', price_cp: 30 },
  { category: 'Food & Drink', item: 'Beer keg, small (5 gal)', price_cp: 60 },
  { category: 'Food & Drink', item: 'Mead jug (1 gal)', price_cp: 24 },

  // Tools & Household
  { category: 'Tools & Household', item: 'Wooden spoon/ladle', price_cp: 1 },
  { category: 'Tools & Household', item: 'Iron knife', price_cp: 6 },
  { category: 'Tools & Household', item: 'Cooking pot (iron)', price_cp: 12 },
  { category: 'Tools & Household', item: 'Bucket, wooden', price_cp: 4 },
  { category: 'Tools & Household', item: 'Barrel (30 gal)', price_cp: 20 },
  { category: 'Tools & Household', item: 'Table, wooden', price_cp: 10 },
  { category: 'Tools & Household', item: 'Chair, wooden', price_cp: 4 },
  { category: 'Tools & Household', item: 'Bed + straw mattress', price_cp: 18 },
  { category: 'Tools & Household', item: 'Lantern + oil', price_cp: 12 },
  { category: 'Tools & Household', item: 'Candles (dozen)', price_cp: 2 },
  { category: 'Tools & Household', item: 'Hemp rope (50 ft)', price_cp: 10 },
  { category: 'Tools & Household', item: 'Chain, iron (10 ft)', price_cp: 120 },
  { category: 'Tools & Household', item: 'Nails, iron (100 count)', price_cp: 3 },
  { category: 'Tools & Household', item: 'Hinges, iron (pair)', price_cp: 6 },
  { category: 'Tools & Household', item: 'Lock, simple', price_cp: 120 },
  { category: 'Tools & Household', item: 'Lock, strong', price_cp: 480 },
  { category: 'Tools & Household', item: 'Key blank', price_cp: 2 },
  { category: 'Tools & Household', item: 'Flint & steel', price_cp: 4 },
  { category: 'Tools & Household', item: 'Tinderbox', price_cp: 2 },
  { category: 'Tools & Household', item: 'Torches (bundle of 6)', price_cp: 2 },
  { category: 'Tools & Household', item: 'Oil lamp, clay', price_cp: 3 },
  { category: 'Tools & Household', item: 'Beeswax candles (dozen)', price_cp: 8 },
  { category: 'Tools & Household', item: 'Soap (lye bar)', price_cp: 2 },
  { category: 'Tools & Household', item: 'Net, fishing (20 ft)', price_cp: 12 },
  { category: 'Tools & Household', item: 'Hook & line set', price_cp: 2 },
  { category: 'Tools & Household', item: 'Bucket, leather', price_cp: 6 },
  { category: 'Tools & Household', item: 'Cask, small (5 gal)', price_cp: 8 },
  { category: 'Tools & Household', item: 'Sack, heavy canvas', price_cp: 1 },
  { category: 'Tools & Household', item: 'Backpack, canvas', price_cp: 6 },
  { category: 'Tools & Household', item: 'Mirror, polished bronze (small)', price_cp: 12 },
  { category: 'Tools & Household', item: 'Glass bottle (pint)', price_cp: 6 },
  { category: 'Tools & Household', item: 'Ceramic jug (1 gal)', price_cp: 4 },
  { category: 'Tools & Household', item: 'Plate, pewter', price_cp: 6 },
  { category: 'Tools & Household', item: 'Needle set (dozen)', price_cp: 2 },
  { category: 'Tools & Household', item: 'Whetstone', price_cp: 3 },
  { category: 'Tools & Household', item: 'Grindstone (shop, large)', price_cp: 480 },
  { category: 'Tools & Household', item: 'Tongs, blacksmith', price_cp: 24 },
  { category: 'Tools & Household', item: "Hammer, smith's", price_cp: 24 },
  { category: 'Tools & Household', item: 'Bellows (small)', price_cp: 120 },
  { category: 'Tools & Household', item: 'Anvil (100 lb)', price_cp: 2400 },

  { category: 'Tools & Household', item: 'Fishing hooks (dozen)', price_cp: 1 },
  { category: 'Tools & Household', item: 'Fish trap, wicker', price_cp: 10 },
  { category: 'Tools & Household', item: 'Small game snare (wire/cord)', price_cp: 2 },
  { category: 'Tools & Household', item: 'Bear trap (iron)', price_cp: 480 },
  { category: 'Tools & Household', item: 'Net trap (weighted, 10 ft)', price_cp: 60 },
  { category: 'Tools & Household', item: 'Smoke stick (alchemical, 1 use)', price_cp: 240 },
  { category: 'Tools & Household', item: 'Fire starter kit (charcoal, tinder)', price_cp: 4 },
  { category: 'Tools & Household', item: 'Oil flask (weapon-use, 1 pint)', price_cp: 4 },
  { category: 'Tools & Household', item: 'Torch, single', price_cp: 0.5 },
  { category: 'Tools & Household', item: 'Chalk (piece)', price_cp: 0.2 },
  { category: 'Tools & Household', item: 'Chalk (pack of 10)', price_cp: 2 },
  { category: 'Tools & Household', item: 'Soapstone (marking, 1 stick)', price_cp: 1 },
  { category: 'Tools & Household', item: 'Spikes, iron (set of 10)', price_cp: 5 },
  { category: 'Tools & Household', item: 'Piton (single climbing spike)', price_cp: 1 },
  { category: 'Tools & Household', item: 'Rope ladder (10 ft)', price_cp: 12 },
  { category: 'Tools & Household', item: 'Grappling hook', price_cp: 60 },
  { category: 'Tools & Household', item: 'Pouch, leather', price_cp: 4 },
  { category: 'Tools & Household', item: 'Satchel, leather', price_cp: 12 },
  { category: 'Tools & Household', item: 'Travel candles (dozen, short-burn)', price_cp: 4 },

  // Clothing & Leather
  { category: 'Clothing & Leather', item: 'Shirt + trousers', price_cp: 18 },
  { category: 'Clothing & Leather', item: 'Cloak, wool', price_cp: 12 },
  { category: 'Clothing & Leather', item: 'Leather shoes', price_cp: 8 },
  { category: 'Clothing & Leather', item: 'Leather belt', price_cp: 3 },
  { category: 'Clothing & Leather', item: 'Hat, linen/wool', price_cp: 2 },
  { category: 'Clothing & Leather', item: 'Gloves, leather', price_cp: 4 },
  { category: 'Clothing & Leather', item: 'Fine tunic', price_cp: 240 },
  { category: 'Clothing & Leather', item: 'Boots (riding)', price_cp: 150 },

  // Weapons
  { category: 'Weapons', item: 'Dagger/knife', price_cp: 240 },
  { category: 'Weapons', item: 'Short sword', price_cp: 720 },
  { category: 'Weapons', item: 'Longsword', price_cp: 1440 },
  { category: 'Weapons', item: 'Greatsword', price_cp: 2400 },
  { category: 'Weapons', item: 'Spear', price_cp: 480 },
  { category: 'Weapons', item: 'Axe (battle)', price_cp: 960 },
  { category: 'Weapons', item: 'Mace', price_cp: 720 },
  { category: 'Weapons', item: 'Bow (self)', price_cp: 1200 },
  { category: 'Weapons', item: 'Arrows (dozen)', price_cp: 2 },
  { category: 'Weapons', item: 'Crossbow', price_cp: 1920 },

  { category: 'Weapons', item: 'Arrow, single (standard)', price_cp: 0.2 },
  { category: 'Weapons', item: 'Arrows, 20 bundle', price_cp: 4 },
  { category: 'Weapons', item: 'Arrow, bodkin/armor-piercing', price_cp: 0.5 },
  { category: 'Weapons', item: 'Arrow, barbed hunting', price_cp: 0.4 },
  { category: 'Weapons', item: 'Bolt, crossbow (single)', price_cp: 0.3 },
  { category: 'Weapons', item: 'Bolts, 20 bundle', price_cp: 6 },
  { category: 'Weapons', item: 'Dart, throwing (iron tip)', price_cp: 2 },
  { category: 'Weapons', item: 'Javelin', price_cp: 8 },
  { category: 'Weapons', item: 'Sling stones (pouch of 20)', price_cp: 1 },
  { category: 'Weapons', item: 'Sling bullets, lead (20)', price_cp: 3 },

  // Armor
  { category: 'Armor', item: 'Padded gambeson', price_cp: 960 },
  { category: 'Armor', item: 'Leather armor (studded)', price_cp: 1920 },
  { category: 'Armor', item: 'Chain shirt', price_cp: 4800 },
  { category: 'Armor', item: 'Chain hauberk', price_cp: 12000 },
  { category: 'Armor', item: 'Helmet (open)', price_cp: 960 },
  { category: 'Armor', item: 'Helmet (visored)', price_cp: 1800 },
  { category: 'Armor', item: 'Shield, wooden round', price_cp: 720 },
  { category: 'Armor', item: 'Shield, iron kite', price_cp: 1440 },
  { category: 'Armor', item: 'Plate cuirass', price_cp: 9600 },
  { category: 'Armor', item: 'Full plate harness', price_cp: 24000 },

  // Raw Materials
  { category: 'Raw Materials', item: 'Lumber (oak plank)', price_cp: 4 },
  { category: 'Raw Materials', item: 'Iron (per lb)', price_cp: 2 },
  { category: 'Raw Materials', item: 'Steel (per lb)', price_cp: 6 },
  { category: 'Raw Materials', item: 'Leather (hide)', price_cp: 10 },
  { category: 'Raw Materials', item: 'Wool (per lb)', price_cp: 3 },
  { category: 'Raw Materials', item: 'Linen (yard)', price_cp: 5 },
  { category: 'Raw Materials', item: 'Brick (single)', price_cp: 0.5 },
  { category: 'Raw Materials', item: 'Stone block (1 cu ft)', price_cp: 8 },
  { category: 'Raw Materials', item: 'Lime (bushel)', price_cp: 2 },
  { category: 'Raw Materials', item: 'Thread, linen (spool)', price_cp: 1 },
  { category: 'Raw Materials', item: 'Dye packet (woad/madder)', price_cp: 6 },

  // Medicines & Misc
  { category: 'Medicines & Misc', item: 'Bandages (roll)', price_cp: 2 },
  { category: 'Medicines & Misc', item: 'Herbal poultice', price_cp: 6 },
  { category: 'Medicines & Misc', item: 'Healing draught (minor)', price_cp: 240 },
  { category: 'Medicines & Misc', item: 'Strong potion of health', price_cp: 2400 },
  { category: 'Medicines & Misc', item: 'Antidote', price_cp: 1200 },
  { category: 'Medicines & Misc', item: 'Lamp oil (pint)', price_cp: 3 },
  { category: 'Medicines & Misc', item: 'Ink (1 oz)', price_cp: 240 },
  { category: 'Medicines & Misc', item: 'Paper (sheet)', price_cp: 2 },
  { category: 'Medicines & Misc', item: 'Parchment (sheet)', price_cp: 6 },
  { category: 'Medicines & Misc', item: 'Book (hand-copied)', price_cp: 2400 },
  { category: 'Medicines & Misc', item: 'Quill & penknife set', price_cp: 4 },
  { category: 'Medicines & Misc', item: 'Ink, colored (1 oz)', price_cp: 360 },
  { category: 'Medicines & Misc', item: 'Seal wax (stick)', price_cp: 2 },
  { category: 'Medicines & Misc', item: 'Map, local town', price_cp: 24 },

  // Housing & Services
  { category: 'Housing & Services', item: 'Rent, suite (monthly)', price_cp: 18 },
  { category: 'Housing & Services', item: 'Rent, family house (monthly)', price_cp: 120 },
  { category: 'Housing & Services', item: 'Inn, low (1 night)', price_cp: 4 },
  { category: 'Housing & Services', item: 'Inn, mid (1 night+meal)', price_cp: 12 },
  { category: 'Housing & Services', item: 'Inn, high (1 night+meals)', price_cp: 60 },
  { category: 'Housing & Services', item: 'Bathhouse entry', price_cp: 2 },
  { category: 'Housing & Services', item: 'Barber/surgeon visit', price_cp: 6 },
  { category: 'Housing & Services', item: 'Doctor/alchemist consult', price_cp: 240 },
  { category: 'Housing & Services', item: 'Street prostitute', price_cp: 4 },
  { category: 'Housing & Services', item: 'Courtesan (high society)', price_cp: 240 },

  // Luxuries & Status Goods
  { category: 'Luxuries & Status Goods', item: 'Velvet (yard)', price_cp: 600 },
  { category: 'Luxuries & Status Goods', item: 'Silk (yard)', price_cp: 2400 },
  { category: 'Luxuries & Status Goods', item: 'Fur trim', price_cp: 2400 },
  { category: 'Luxuries & Status Goods', item: 'Jewelry, silver ring', price_cp: 480 },
  { category: 'Luxuries & Status Goods', item: 'Jewelry, gold ring', price_cp: 2400 },
  { category: 'Luxuries & Status Goods', item: 'Jewelry, gem-set', price_cp: 12000 },
  { category: 'Luxuries & Status Goods', item: 'Perfume vial', price_cp: 360 },
  { category: 'Luxuries & Status Goods', item: 'Signet blank (bronze)', price_cp: 120 },
  { category: 'Luxuries & Status Goods', item: "Compass (mariner's)", price_cp: 1200 },
  { category: 'Luxuries & Status Goods', item: 'Astrolabe (brass)', price_cp: 6000 },
  { category: 'Luxuries & Status Goods', item: 'Saddle (riding)', price_cp: 600 },
  { category: 'Luxuries & Status Goods', item: 'Saddlebags (pair)', price_cp: 120 },
  { category: 'Luxuries & Status Goods', item: 'Bridle & bit', price_cp: 60 },
  { category: 'Luxuries & Status Goods', item: 'Pack mule', price_cp: 2400 },
  { category: 'Luxuries & Status Goods', item: 'Fine horse', price_cp: 12000 },
  { category: 'Luxuries & Status Goods', item: 'Warhorse, destrier', price_cp: 48000 },
  { category: 'Luxuries & Status Goods', item: 'Carriage (4-wheeled)', price_cp: 24000 }
];

/**
 * Baseline daily wages for common occupations in copper pieces.
 */
export const BASELINE_INCOME_DATA = [
  // Agriculture & Food
  { category: 'Agriculture & Food', occupation: 'Farm hand (general labor)', wage_min_cp: 8, wage_max_cp: 12 },
  { category: 'Agriculture & Food', occupation: 'Orchard picker', wage_min_cp: 10, wage_max_cp: 10 },
  { category: 'Agriculture & Food', occupation: 'Shepherd', wage_min_cp: 10, wage_max_cp: 10 },
  { category: 'Agriculture & Food', occupation: 'Dairy worker', wage_min_cp: 9, wage_max_cp: 9 },
  { category: 'Agriculture & Food', occupation: 'Mill worker', wage_min_cp: 12, wage_max_cp: 12 },
  { category: 'Agriculture & Food', occupation: 'Brewery hand', wage_min_cp: 12, wage_max_cp: 15 },

  // Gathering & Resources
  { category: 'Gathering & Resources', occupation: 'Forager (berries, herbs, mushrooms)', wage_min_cp: 6, wage_max_cp: 8 },
  { category: 'Gathering & Resources', occupation: 'Resin/sap gatherer', wage_min_cp: 8, wage_max_cp: 8 },
  { category: 'Gathering & Resources', occupation: 'Charcoal burner', wage_min_cp: 10, wage_max_cp: 10 },
  { category: 'Gathering & Resources', occupation: 'Woodcutter', wage_min_cp: 8, wage_max_cp: 8 },
  { category: 'Gathering & Resources', occupation: 'Logger', wage_min_cp: 12, wage_max_cp: 14 },
  { category: 'Gathering & Resources', occupation: 'Quarryman', wage_min_cp: 12, wage_max_cp: 12 },
  { category: 'Gathering & Resources', occupation: 'Ore miner', wage_min_cp: 12, wage_max_cp: 12 },
  { category: 'Gathering & Resources', occupation: 'Coal miner', wage_min_cp: 10, wage_max_cp: 10 },

  // Fishing & Maritime
  { category: 'Fishing & Maritime', occupation: 'Fisher, river', wage_min_cp: 8, wage_max_cp: 10 },
  { category: 'Fishing & Maritime', occupation: 'Fisher, coastal crew', wage_min_cp: 12, wage_max_cp: 15 },
  { category: 'Fishing & Maritime', occupation: 'Dock laborer', wage_min_cp: 10, wage_max_cp: 12 },
  { category: 'Fishing & Maritime', occupation: 'Stevedore (cargo handler)', wage_min_cp: 15, wage_max_cp: 18 },
  { category: 'Fishing & Maritime', occupation: 'Sailor, coastal trade', wage_min_cp: 12, wage_max_cp: 15 },
  { category: 'Fishing & Maritime', occupation: 'Sailor, deep-sea trade', wage_min_cp: 18, wage_max_cp: 24 },
  { category: 'Fishing & Maritime', occupation: 'Shipwright apprentice', wage_min_cp: 12, wage_max_cp: 12 },
  { category: 'Fishing & Maritime', occupation: 'Shipwright journeyman', wage_min_cp: 24, wage_max_cp: 36 },

  // Crafts & Trades
  { category: 'Crafts & Trades', occupation: 'Apprentice craftsman', wage_min_cp: 8, wage_max_cp: 12 },
  { category: 'Crafts & Trades', occupation: 'Journeyman craftsman', wage_min_cp: 18, wage_max_cp: 30 },
  { category: 'Crafts & Trades', occupation: 'Master craftsman (guild member)', wage_min_cp: 100, wage_max_cp: 200 },
  { category: 'Crafts & Trades', occupation: 'Tanner/leatherworker', wage_min_cp: 12, wage_max_cp: 16 },
  { category: 'Crafts & Trades', occupation: 'Mason', wage_min_cp: 20, wage_max_cp: 30 },
  { category: 'Crafts & Trades', occupation: 'Carpenter', wage_min_cp: 20, wage_max_cp: 30 },
  { category: 'Crafts & Trades', occupation: 'Scribe/clerk', wage_min_cp: 18, wage_max_cp: 24 },
  { category: 'Crafts & Trades', occupation: 'Teacher/tutor', wage_min_cp: 20, wage_max_cp: 30 },

  // Animal Handling
  { category: 'Animal Handling', occupation: 'Stable hand', wage_min_cp: 8, wage_max_cp: 8 },
  { category: 'Animal Handling', occupation: 'Groom (skilled)', wage_min_cp: 12, wage_max_cp: 12 },
  { category: 'Animal Handling', occupation: 'Caravaneer/drover', wage_min_cp: 10, wage_max_cp: 14 },
  { category: 'Animal Handling', occupation: 'Falconer (noble household)', wage_min_cp: 24, wage_max_cp: 24 },

  // Guard & Bodyguard
  { category: 'Guard & Bodyguard', occupation: 'Watchman/guard (untrained)', wage_min_cp: 10, wage_max_cp: 10 },
  { category: 'Guard & Bodyguard', occupation: 'Gate guard', wage_min_cp: 12, wage_max_cp: 15 },
  { category: 'Guard & Bodyguard', occupation: 'Warehouse/caravan guard', wage_min_cp: 20, wage_max_cp: 20 },
  { category: 'Guard & Bodyguard', occupation: 'Merchant bodyguard', wage_min_cp: 30, wage_max_cp: 40 },
  { category: 'Guard & Bodyguard', occupation: 'Caravan guard (long-distance)', wage_min_cp: 40, wage_max_cp: 60 },
  { category: 'Guard & Bodyguard', occupation: "Noble's retainer (armored guard)", wage_min_cp: 100, wage_max_cp: 100 },
  { category: 'Guard & Bodyguard', occupation: 'Skilled duelist/pro bodyguard', wage_min_cp: 150, wage_max_cp: 200 },
  { category: 'Guard & Bodyguard', occupation: 'Specialist/mercenary captain', wage_min_cp: 300, wage_max_cp: 500 },

  // Urban Services
  { category: 'Urban Services', occupation: 'Porter', wage_min_cp: 8, wage_max_cp: 8 },
  { category: 'Urban Services', occupation: 'Messenger/runner', wage_min_cp: 6, wage_max_cp: 8 },
  { category: 'Urban Services', occupation: 'Night soil collector', wage_min_cp: 8, wage_max_cp: 8 },
  { category: 'Urban Services', occupation: 'Street sweeper', wage_min_cp: 6, wage_max_cp: 6 },
  { category: 'Urban Services', occupation: 'Rat catcher', wage_min_cp: 6, wage_max_cp: 6 },
  { category: 'Urban Services', occupation: 'Bathhouse attendant', wage_min_cp: 8, wage_max_cp: 8 },
  { category: 'Urban Services', occupation: 'Barber-surgeon apprentice', wage_min_cp: 10, wage_max_cp: 10 },
  { category: 'Urban Services', occupation: 'Barber-surgeon journeyman', wage_min_cp: 20, wage_max_cp: 30 },
  { category: 'Urban Services', occupation: 'Doctor/alchemist', wage_min_cp: 200, wage_max_cp: 300 }
];

export const COST_SCALING_GUIDELINES = {
  everydayConsumables: '1–6 cp',
  durableGoods: '6–24 cp',
  housingAndServices: 'dozens of cp per month',
  luxuryGoods: 'silver pieces and above'
};

/**
 * Return the price of an item converted to the requested denomination.
 * @param {keyof typeof BASELINE_COSTS} key
 * @param {'coldIron'|'steel'|'copper'|'silver'|'gold'|'platinum'} denom
 * @returns {number[]|number|null} price in the chosen denomination
 */
export function priceIn(key, denom = 'copper') {
  const entry = BASELINE_COSTS[key];
  if (!entry) return null;
  if (entry.ironRange) {
    return entry.ironRange.map(iron => convertCurrency(iron, 'coldIron', denom));
  }
  return convertCurrency(entry.iron, 'coldIron', denom);
}

/**
 * Human‑readable price string for display purposes.
 * @param {keyof typeof BASELINE_COSTS} key
 * @returns {string} formatted currency string
 */
export function formattedPrice(key) {
  const entry = BASELINE_COSTS[key];
  if (!entry) return '';
  if (entry.ironRange) {
    return entry.ironRange
      .map(iron => formatCurrency(fromIron(iron)))
      .join('–');
  }
  return formatCurrency(fromIron(entry.iron));
}

