const ACTION_PREFIX = 'environment';

const ACTION_ORDER = [
  'look',
  'search',
  'explore',
  'forage',
  'beachcomb',
  'tidepool',
  'fish_gather',
  'fish',
  'hunt',
  'dive',
  'swim',
  'mine',
  'fell_tree',
];

const ACTION_METADATA = {
  look: {
    label: 'Look Around',
    icon: 'assets/images/icons/actions/Look Around 1.png',
  },
  explore: {
    label: 'Explore',
    icon: 'assets/images/icons/actions/Explore 1.png',
  },
  search: {
    label: 'Search',
    icon: 'assets/images/icons/actions/Search 1.png',
  },
  forage: {
    label: 'Gather',
    icon: 'assets/images/icons/actions/Gathering.png',
  },
  fish_gather: {
    label: 'Fish & Gather',
    icon: 'assets/images/icons/actions/Fish and Gather.png',
  },
  fish: {
    label: 'Fish',
    icon: 'assets/images/icons/actions/Fish and Gather.png',
  },
  hunt: {
    label: 'Hunt',
    icon: 'assets/images/icons/actions/hunt.png',
  },
  beachcomb: {
    label: 'Beachcombing',
    icon: 'assets/images/icons/actions/Beach Combing.png',
  },
  tidepool: {
    label: 'Tidepooling',
    icon: 'assets/images/icons/actions/Tidepooling.png',
  },
};

const WATER_ACCESS_TAGS = new Set([
  'coastal',
  'tidal',
  'river',
  'rivers',
  'riverbank',
  'riverlands',
  'stream',
  'streams',
  'brook',
  'creek',
  'wetland',
  'marsh',
  'bog',
  'fen',
  'swamp',
  'pond',
  'lake',
  'lagoon',
  'estuary',
  'harbor',
  'shallows',
]);

const WATER_EXCLUSION_TAGS = new Set([
  'hotspring',
  'hot_spring',
  'sulfur_spring',
  'thermal',
  'cistern',
  'well',
]);

const GATHERING_TAGS = new Set([
  'tidal',
  'beach',
  'coastal',
  'wetland',
  'river',
  'rivers',
  'riverlands',
  'forest',
  'wood',
  'pine',
  'edge',
  'grassland',
  'prairie',
  'farmland',
  'meadow',
  'hills',
]);

const WILDLIFE_TAGS = new Set([
  'tidal',
  'beach',
  'coastal',
  'wetland',
  'river',
  'rivers',
  'riverlands',
  'forest',
  'wood',
  'edge',
  'grassland',
  'prairie',
  'farmland',
  'meadow',
  'hills',
  'mountain',
  'ridge',
]);

const BEACH_TAGS = new Set(['beach', 'shore', 'tidal', 'tidepool', 'coastal']);
const TIDEPOOL_TAGS = new Set(['tidal', 'tidepool', 'rockpool']);
const FOREST_TAGS = new Set(['forest', 'wood', 'grove', 'pine', 'timber']);
const MINING_TAGS = new Set(['mine', 'quarry', 'stone', 'ore', 'mountain', 'cliff']);

const MINIMUM_PRESENTABLE_CHANCE = 0.15;

function toTitleCase(text) {
  if (!text) return '';
  return String(text)
    .split(/[\s_-]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function hasAnyTag(tags, testSet) {
  for (const tag of tags) {
    if (testSet.has(tag)) return true;
  }
  return false;
}

function expandTimeKeys(timeKey) {
  if (!timeKey) return [];
  const lower = timeKey.toLowerCase();
  const keys = [lower];
  if (lower.includes('morning') && lower !== 'morning') keys.push('morning');
  if (lower.includes('afternoon') && lower !== 'afternoon') keys.push('afternoon');
  if (lower.includes('evening') && lower !== 'evening') keys.push('evening');
  if (lower.includes('dawn') && lower !== 'dawn') keys.push('dawn');
  if (lower.includes('dusk') && lower !== 'dusk') keys.push('dusk');
  if (lower === 'predawn') {
    keys.push('dawn');
    keys.push('night');
  }
  if (lower === 'night') keys.push('evening');
  if (lower === 'day') {
    keys.push('afternoon');
    keys.push('morning');
  }
  keys.push('default');
  return keys;
}

function expandWeatherKeys(weatherKey) {
  if (!weatherKey) return [];
  const lower = weatherKey.toLowerCase();
  const keys = [lower];
  if (lower === 'snow' || lower === 'sleet' || lower === 'ice') keys.push('storm');
  if (lower === 'cloud') keys.push('rain');
  keys.push('default');
  return keys;
}

function modifierForKey(map, keys) {
  if (!map || !keys || !keys.length) return 0;
  for (const key of keys) {
    if (key && Object.prototype.hasOwnProperty.call(map, key)) {
      return map[key] ?? 0;
    }
  }
  return 0;
}

function estimateActionChance(action, context = {}) {
  let chance = typeof action.baseChance === 'number' ? action.baseChance : 0;
  if (context.season && action.seasonModifiers) {
    chance += action.seasonModifiers[context.season] ?? 0;
  }
  if (action.timeModifiers) {
    const timeKeys = expandTimeKeys(context.timeKey);
    chance += modifierForKey(action.timeModifiers, timeKeys);
  }
  if (action.weatherModifiers) {
    const weatherKeys = expandWeatherKeys(context.weatherKey);
    chance += modifierForKey(action.weatherModifiers, weatherKeys);
  }
  if (chance < 0) return 0;
  if (chance > 1) return 1;
  return chance;
}

function actionMakesSense(actionType, action, def, tags, context = {}) {
  if (!action) return false;

  if (actionType === 'fish' || actionType === 'fish_gather' || actionType === 'dive' || actionType === 'swim') {
    if (!hasAnyTag(tags, WATER_ACCESS_TAGS)) return false;
    if (hasAnyTag(tags, WATER_EXCLUSION_TAGS)) return false;
    if (context.weatherKey === 'storm') return false;
  }

  if (actionType === 'forage' || actionType === 'beachcomb' || actionType === 'tidepool') {
    const hasGathering = hasAnyTag(tags, GATHERING_TAGS) || hasAnyTag(tags, WATER_ACCESS_TAGS);
    if (!hasGathering) return false;
    if (context.weatherKey === 'storm' && !tags.has('tidal')) return false;
  }

  if (actionType === 'hunt') {
    if (!hasAnyTag(tags, WILDLIFE_TAGS)) return false;
    if (context.weatherKey === 'storm') return false;
  }

  if (actionType === 'beachcomb') {
    if (!hasAnyTag(tags, BEACH_TAGS)) return false;
  }

  if (actionType === 'tidepool') {
    if (!hasAnyTag(tags, TIDEPOOL_TAGS) && !tags.has('tidal')) return false;
  }

  if (actionType === 'mine') {
    if (!hasAnyTag(tags, MINING_TAGS)) return false;
  }

  if (actionType === 'fell_tree') {
    if (!hasAnyTag(tags, FOREST_TAGS)) return false;
  }

  const chance = estimateActionChance(action, context);
  return chance >= MINIMUM_PRESENTABLE_CHANCE;
}

function inferActionLabel(actionType, tags) {
  if (actionType === 'look') {
    return 'Look Around';
  }
  if (actionType === 'explore') {
    return 'Explore';
  }
  if (actionType === 'search') {
    return 'Search the Area';
  }
  if (actionType === 'forage') {
    if (tags.has('tidal') || tags.has('tidepool')) return 'Tidepooling';
    if (tags.has('beach') || tags.has('shore')) return 'Beachcombing';
    if (hasAnyTag(tags, WATER_ACCESS_TAGS)) return 'Fish & Gather';
    if (tags.has('farmland') || tags.has('prairie') || tags.has('grassland')) return 'Harvest';
    return 'Gathering';
  }
  if (actionType === 'beachcomb') {
    return 'Beachcombing';
  }
  if (actionType === 'tidepool') {
    return 'Tidepooling';
  }
  if (actionType === 'fish_gather') {
    if (tags.has('tidal') || tags.has('coastal')) return 'Fish & Gather';
    if (tags.has('river') || tags.has('stream') || tags.has('creek')) return 'Creekside Fish & Gather';
    return 'Fish & Gather';
  }
  if (actionType === 'fish') {
    if (tags.has('tidal') || tags.has('coastal')) return 'Surf Fishing';
    if (tags.has('harbor') || tags.has('estuary') || tags.has('lagoon')) return 'Harbor Fishing';
    if (tags.has('river') || tags.has('rivers') || tags.has('riverlands') || tags.has('stream') || tags.has('creek')) {
      return 'River Fishing';
    }
    if (tags.has('pond') || tags.has('lake')) return 'Stillwater Fishing';
    return 'Fishing';
  }
  if (actionType === 'hunt') {
    if (tags.has('tidal') || tags.has('beach')) return 'Shore Hunt';
    if (tags.has('coastal') && tags.has('forest')) return 'Coastal Hunt';
    if (tags.has('grassland') || tags.has('prairie') || tags.has('farmland')) return 'Open-Range Hunt';
    if (tags.has('forest') || tags.has('wood')) return 'Woodland Hunt';
    if (tags.has('hills') || tags.has('ridge') || tags.has('mountain')) return 'Highland Hunt';
    return 'Hunt';
  }
  if (actionType === 'dive') {
    return 'Dive';
  }
  if (actionType === 'swim') {
    return 'Swim';
  }
  if (actionType === 'mine') {
    return 'Mine Resources';
  }
  if (actionType === 'fell_tree') {
    return 'Fell Trees';
  }
  return toTitleCase(actionType);
}

const ENVIRONMENT_NODES = [
  {
    city: "Wave's Break",
    district: "The Farmlands",
    location: "Saltwash Beach",
    region: 'waves_break',
    weatherHabitat: 'coastal',
    tags: ['coastal', 'tidal', 'beach'],
    actions: {
      look: {
        baseAction: 'look',
        label: 'Look along the surf',
        narrative:
          'Foam hisses over the sand as you pause, scanning for anything obvious the tide has delivered.',
        baseChance: 0.35,
        timeRangeHours: [0.05, 0.12],
        eventChance: 0.35,
        randomEvents: [
          {
            weight: 3,
            scene: 'Your gaze drifts across the wrack line where gulls squabble over scraps.',
            outcome: 'A splash of green glass glints in the sun—sea glass perfect for trade.',
            loot: [
              { name: 'Salt-sheened Sea Glass', category: 'Curios', qtyRange: [1, 2], baseItem: 'Sea Glass' },
            ],
          },
          {
            weight: 2,
            scene: 'Out beyond the breakers a pod of sleek-backed dolphins arcs in tandem.',
            outcome: 'Sailors nearby cheer the omen, and a deckhand offers you a lucky charm.',
            loot: [
              { name: 'Dolphin Tooth Charm', category: 'Curios', qtyRange: [1, 1], baseItem: 'Lucky Charm' },
            ],
          },
          {
            weight: 1,
            scene: 'Dark clouds gather on the horizon and the wind stiffens.',
            outcome: 'A harbor runner warns you that storms make the surf treacherous today.',
          },
        ],
      },
      explore: {
        baseAction: 'explore',
        label: 'Explore the dunes',
        narrative:
          'You range along the salt dunes and tidal hollows, covering ground the waves have reshaped overnight.',
        baseChance: 0.72,
        timeRangeHours: [1.5, 3.5],
        eventChance: 0.75,
        randomEvents: [
          {
            weight: 3,
            scene: 'Footprints weave between dune grass and toppled driftwood.',
            outcome:
              'You catch a wounded courier struggling with a stuck cart—together you free the wheel and receive a small pouch of coin.',
            loot: [
              { name: "Courier's Gratitude Coin", category: 'Coin Pouch', qtyRange: [1, 1], baseItem: 'Coin Pouch' },
            ],
          },
          {
            weight: 2,
            scene: 'A cluster of gulls wheels above a beached log slick with kelp.',
            outcome: 'Beneath the log you scare up a tide of sand crabs—perfect bait for later fishing.',
            loot: [
              { name: 'Sand Crab Bait', category: 'Fishing Bait', qtyRange: [2, 4], baseItem: 'Sand Crab' },
            ],
          },
          {
            weight: 1,
            scene: 'You range farther than planned and stumble into a territorial reef drake.',
            outcome:
              'After a tense standoff you retreat unharmed, losing extra time but gaining a tale for the tavern.',
            extraTimeHours: 0.5,
          },
          {
            weight: 1,
            scene: 'The tide recedes to reveal a narrow cavern mouth in the cliff.',
            outcome: 'Inside you find a glimmering pearl lodged between rocks.',
            loot: [
              { name: 'Tidecave Pearl', category: 'Gemstones', qtyRange: [1, 1], baseItem: 'Pearl' },
            ],
          },
        ],
      },
      search: {
        baseAction: 'search',
        label: 'Search Saltwash Beach',
        narrative:
          'Plan a deliberate search of the tidal flats, deciding which prize to pursue first.',
        baseChance: 0.55,
        timeRangeHours: [0.5, 2],
        categories: [
          {
            key: 'shellfish',
            label: 'Search for shellfish and tidal fare',
            baseAction: 'fish',
            baseChance: 0.6,
            timeHours: 1.4,
            faunaHabitats: ['tidal_flats'],
            faunaRegions: ['coastal', 'aquatic'],
            taxonGroups: ['mollusk', 'other'],
            narrative: 'You pry at barnacled rocks and sift through shallow pools for anything edible.',
            handGatherable: {
              chance: 0.45,
              faunaHabitats: ['tidal_flats'],
              faunaRegions: ['coastal', 'aquatic'],
              taxonGroups: ['mollusk', 'other'],
              sizeClasses: ['tiny', 'small'],
              narrative: 'Bare-handed you tease limpets, mussels, and crabs free from the tide-slick stones.',
            },
          },
          {
            key: 'driftwood',
            label: 'Search for driftwood and salvage',
            baseAction: 'beachcomb',
            baseChance: 0.65,
            timeHours: 0.9,
            lootTable: [
              { name: 'Salt-scoured Driftwood', category: 'Salvage', qtyRange: [1, 2], weight: 3 },
              { name: 'Knotted Rope Coil', category: 'Salvage', qtyRange: [1, 1], weight: 1 },
              { name: 'Barnacled Trinket', category: 'Curios', qtyRange: [1, 1], weight: 1 },
            ],
            narrative: 'The wrack line hides tangled nets, broken spars, and anything the tide could not keep.',
          },
          {
            key: 'wildlife',
            label: 'Search for shoreline prey',
            baseAction: 'hunt',
            baseChance: 0.48,
            timeHours: 2.1,
            faunaHabitats: ['tidal_flats', 'wetland', 'coastal'],
            faunaRegions: ['coastal', 'terrestrial'],
            taxonGroups: ['bird', 'mammal', 'reptile'],
            narrative: 'You track gull prints and lizard trails along the dune grass.',
            handPrey: {
              chance: 0.32,
              faunaHabitats: ['tidal_flats', 'wetland'],
              faunaRegions: ['coastal', 'aquatic'],
              taxonGroups: ['bird', 'other'],
              sizeClasses: ['tiny', 'small'],
              narrative: 'Quick reflexes might nab a crab or unwary tern before it takes wing.',
            },
          },
          {
            key: 'people',
            label: 'Search for travelers or work',
            baseAction: 'event',
            baseChance: 0.4,
            timeHours: 1.2,
            narrative: 'You canvas the shoreline for stranded sailors, merchants, or anyone needing aid.',
            randomEvents: [
              {
                weight: 2,
                scene: 'A merchant waves frantically beside an overloaded cart half-buried in wet sand.',
                outcome:
                  'With leverage and sweat you free the wheels, earning a pouch of salted jerky and a few coins.',
                loot: [
                  { name: "Merchant's Jerky Ration", category: 'Provisions', qtyRange: [1, 2], baseItem: 'Jerky' },
                  { name: 'Tide-bitten Coin', category: 'Coin Pouch', qtyRange: [1, 1], baseItem: 'Coin Pouch' },
                ],
              },
              {
                weight: 1,
                scene: 'A fisher lost her ring somewhere along the pebbled strand.',
                outcome:
                  'After a careful crawl you find the gleam between two stones, earning heartfelt thanks and a promise of future bargains.',
              },
              {
                weight: 1,
                scene: 'No one needs help today, but you pick up rumors of smugglers using the southern caves.',
                outcome: 'Perhaps the Adventurers’ Guild would pay for a quiet look.',
              },
            ],
          },
        ],
        randomEvents: [
          {
            weight: 1,
            scene: 'Half-buried near the tide line lies a chipped spyglass.',
            outcome: 'It still focuses well enough to fetch a few coins in town.',
            loot: [
              { name: 'Weathered Spyglass', category: 'Curios', qtyRange: [1, 1], baseItem: 'Spyglass' },
            ],
          },
        ],
      },
      tidepool: {
        baseAction: 'forage',
        label: 'Forage the tidepools',
        narrative:
          'Foam-slick rock pools hide kelp fronds, tideflowers, and brine-crusted shells along the Saltwash shallows.',
        baseChance: 0.7,
        timeHours: 1,
        gatherSkill: 'foraging',
        floraHabitats: ['tidal_flats', 'wetland'],
        floraRegions: ['coastal', 'aquatic_fresh'],
        attributes: ['WIS', 'INT'],
        fallbackFlora: 'tidepool greens',
        seasonModifiers: { Winter: -0.05, Summer: 0.05 },
        timeModifiers: { dawn: 0.05, dusk: 0.05 },
        weatherModifiers: { storm: -0.4, rain: -0.1, fog: -0.05, clear: 0.05 },
      },
      beachcomb: {
        baseAction: 'loot',
        label: 'Beachcomb the wrack line',
        narrative: 'You sift through the wrack of the latest tide, hunting for anything of value.',
        baseChance: 0.66,
        timeHours: 0.8,
        lootTable: [
          { name: 'Salt-scoured Driftwood', category: 'Salvage', qtyRange: [1, 2], weight: 4 },
          { name: 'Tide-smoothed Shells', category: 'Curios', qtyRange: [1, 3], weight: 3 },
          { name: 'Waterlogged Crate Slat', category: 'Salvage', qtyRange: [1, 1], weight: 1 },
          { name: "Lost Sailor's Token", category: 'Curios', qtyRange: [1, 1], weight: 1 },
        ],
      },
      fish_gather: {
        baseAction: 'fish_gather',
        label: 'Fish & gather the surf',
        narrative: 'Decide how to work the tide—casting lines, checking pools, or wading for shellfish.',
        baseChance: 0.6,
        timeRangeHours: [1, 2.5],
        modes: [
          {
            key: 'open-water',
            label: 'Cast into open water',
            baseAction: 'fish',
            baseChanceModifier: 0.05,
            timeHours: 2.2,
            narrative: 'You wade in waist deep and cast beyond the breakers.',
            weatherModifiers: { storm: -0.45, rain: -0.12, fog: -0.05, clear: 0.05 },
          },
          {
            key: 'reedline',
            label: 'Fish beside the reed clumps',
            baseAction: 'fish',
            baseChanceModifier: 0.1,
            timeHours: 1.8,
            narrative: 'You pick the edges where reeds meet surf, watching for sheltered bait fish.',
            faunaHabitats: ['tidal_flats', 'wetland'],
          },
          {
            key: 'driftwood',
            label: 'Work the driftwood pools',
            baseAction: 'forage',
            baseChanceModifier: 0.12,
            timeHours: 1.4,
            narrative: 'You pry shellfish from barnacled logs and pocket small tidal creatures.',
            floraHabitats: ['tidal_flats'],
            faunaHabitats: ['tidal_flats'],
            faunaRegions: ['coastal', 'aquatic'],
            taxonGroups: ['mollusk', 'other'],
            gatherSkill: 'foraging',
            fallbackFlora: 'tidal mussels',
          },
        ],
      },
      fish: {
        label: 'Fish the surf break',
        narrative:
          'Casting into the brackish surf draws shoals that ride the incoming tide beneath wheeling gulls.',
        baseChance: 0.55,
        timeHours: 2,
        gatherSkill: 'fishing',
        faunaHabitats: ['tidal_flats', 'open_ocean'],
        faunaRegions: ['coastal', 'aquatic'],
        taxonGroups: ['fish', 'mollusk'],
        attributes: ['WIS', 'DEX'],
        tool: {
          kind: 'fishing',
          message: 'You need a fishing rod, hand line, or net to work the surf effectively.',
        },
        handGatherable: {
          chance: 0.35,
          faunaHabitats: ['tidal_flats'],
          faunaRegions: ['coastal', 'aquatic'],
          taxonGroups: ['mollusk', 'other'],
          sizeClasses: ['tiny', 'small'],
          narrative: 'You can still pry shellfish from tidepools with bare hands, though it is slow work.',
        },
        seasonModifiers: { Winter: -0.05, Autumn: 0.05 },
        timeModifiers: { dawn: 0.1, dusk: 0.1, night: -0.15 },
        weatherModifiers: { storm: -0.45, rain: -0.12, fog: -0.05, clear: 0.05 },
      },
      hunt: {
        label: 'Hunt shoreline game',
        narrative:
          'Dune grass and driftwood hide shorebirds and dusk-feeding brine lizards along the beach fringe.',
        baseChance: 0.5,
        timeHours: 3,
        huntSkill: 'hunting',
        faunaHabitats: ['tidal_flats', 'wetland', 'coastal'],
        faunaRegions: ['coastal', 'terrestrial'],
        taxonGroups: ['bird', 'mammal', 'reptile', 'other'],
        attributes: ['WIS', 'DEX', 'AGI'],
        tool: {
          kind: 'huntingWeapon',
          message: 'You need a bow, spear, or similar hunting weapon to take shoreline game.',
        },
        handPrey: {
          chance: 0.35,
          faunaHabitats: ['tidal_flats', 'wetland'],
          faunaRegions: ['coastal', 'aquatic'],
          taxonGroups: ['bird', 'other'],
          sizeClasses: ['tiny', 'small'],
          narrative: 'With quick hands you might snatch crabs or gulls, but larger quarry slips away.',
        },
        seasonModifiers: { Winter: -0.1, Spring: 0.05 },
        timeModifiers: { dawn: 0.1, dusk: 0.1, day: -0.05 },
        weatherModifiers: { storm: -0.35, rain: -0.15, fog: -0.05 },
      },
      dive: {
        baseAction: 'dive',
        label: 'Dive the shallows',
        narrative: 'You tighten straps and prepare to slip beneath the waves for hidden prizes.',
        baseChance: 0.5,
        timeRangeHours: [1.2, 2.5],
        eventChance: 0.6,
        randomEvents: [
          {
            weight: 2,
            scene: 'Cool currents swirl around you as you pry oysters from a submerged piling.',
            outcome: 'A fat oyster reveals a briny pearl within.',
            loot: [
              { name: 'Brine Pearl', category: 'Gemstones', qtyRange: [1, 1], baseItem: 'Pearl' },
            ],
          },
          {
            weight: 2,
            scene: 'Among waving kelp you spot a glint wedged between rocks.',
            outcome: 'It is a lost diving knife—still sharp and serviceable.',
            loot: [
              { name: 'Recovered Diving Knife', category: 'Weapons', qtyRange: [1, 1], baseItem: 'Diving Knife' },
            ],
          },
          {
            weight: 1,
            scene: 'A shadow looms in the murk as a reef shark circles curiously.',
            outcome: 'You beat a careful retreat, losing extra time but avoiding blood in the water.',
            extraTimeHours: 0.4,
          },
        ],
      },
      swim: {
        baseAction: 'swim',
        label: 'Swim the breakers',
        narrative: 'You take a brisk swim to clear your head and watch the tides.',
        baseChance: 0.45,
        timeRangeHours: [0.4, 1],
        eventChance: 0.4,
        randomEvents: [
          {
            weight: 2,
            scene: 'Warm sun and cool water steady your breathing.',
            outcome: 'You feel invigorated and ready for whatever comes next.',
          },
          {
            weight: 1,
            scene: 'A rip current tugs unexpectedly at your legs.',
            outcome: 'You fight free, losing a little time but gaining respect for the sea's pull.',
            extraTimeHours: 0.2,
          },
        ],
      },
    },
  },
  {
    city: "Wave's Break",
    district: "The Farmlands",
    location: "Tidebreak Riverbank",
    region: 'waves_break',
    weatherHabitat: 'farmland',
    tags: ['river', 'wetland'],
    actions: {
      look: {
        baseAction: 'look',
        label: 'Look along the reeds',
        narrative: 'You scan the reedbeds and eddies for anything obvious.',
        baseChance: 0.32,
        timeRangeHours: [0.05, 0.1],
        eventChance: 0.3,
        randomEvents: [
          {
            weight: 2,
            scene: 'Dragonflies dance over the water.',
            outcome: 'You spot a patch of glowcap mushrooms clinging to a nearby log.',
            loot: [
              { name: 'Glowcap Cluster', category: 'Gathered Goods', qtyRange: [1, 2], baseItem: 'Glowcap' },
            ],
          },
          {
            weight: 1,
            scene: 'Fresh hoofprints lead down the bank and back into the brush.',
            outcome: 'Something large watered here recently—good to note if you plan to hunt.',
          },
        ],
      },
      explore: {
        baseAction: 'explore',
        label: 'Explore the riverbank',
        narrative: 'You follow the winding river, noting fresh debris and new channels.',
        baseChance: 0.6,
        timeRangeHours: [1.2, 2.5],
        eventChance: 0.6,
        randomEvents: [
          {
            weight: 2,
            scene: 'An angler shares rumors of silver trout schooling near a fallen oak upstream.',
            outcome: 'You mark the spot for future fishing expeditions.',
          },
          {
            weight: 2,
            scene: 'A beaver dam chokes a side channel, flooding a farmer’s irrigation ditch.',
            outcome: 'You help clear the jam and receive a bundle of dried herbs.',
            loot: [
              { name: 'Farmer’s Herb Bundle', category: 'Provisions', qtyRange: [1, 1], baseItem: 'Herb Bundle' },
            ],
          },
          {
            weight: 1,
            scene: 'Rusting snares hang hidden in the brush.',
            outcome: 'You disarm them and keep the sturdy wire for yourself.',
            loot: [
              { name: 'Salvaged Snare Wire', category: 'Salvage', qtyRange: [1, 2], baseItem: 'Wire' },
            ],
          },
        ],
      },
      search: {
        baseAction: 'search',
        label: 'Search the riverbank',
        narrative: 'Choose a focus for your careful search along the Tidebreak.',
        baseChance: 0.52,
        timeRangeHours: [0.4, 1.6],
        categories: [
          {
            key: 'plants',
            label: 'Search for edible shoots and herbs',
            baseAction: 'forage',
            baseChance: 0.64,
            timeHours: 1.1,
            floraHabitats: ['wetland', 'riverlands'],
            floraRegions: ['aquatic_fresh', 'wetlands_transitional', 'terrestrial'],
            fallbackFlora: 'sweetflag shoots',
          },
          {
            key: 'river-life',
            label: 'Search for river life and shellfish',
            baseAction: 'fish',
            baseChance: 0.58,
            timeHours: 1.5,
            faunaHabitats: ['rivers'],
            faunaRegions: ['aquatic'],
            taxonGroups: ['fish', 'mollusk'],
            narrative: 'You overturn stones and check quiet pools for clams, crayfish, or flashing minnows.',
            handGatherable: {
              chance: 0.42,
              faunaHabitats: ['rivers'],
              faunaRegions: ['aquatic'],
              taxonGroups: ['mollusk', 'other'],
              sizeClasses: ['tiny', 'small'],
              narrative: 'Kneeling in the shallows, you sift mud for mussels and snails.',
            },
          },
          {
            key: 'game',
            label: 'Search for game trails',
            baseAction: 'hunt',
            baseChance: 0.46,
            timeHours: 1.8,
            faunaHabitats: ['wetland', 'riverlands'],
            faunaRegions: ['terrestrial'],
            taxonGroups: ['mammal', 'bird'],
            handPrey: {
              chance: 0.28,
              faunaHabitats: ['wetland'],
              faunaRegions: ['terrestrial'],
              taxonGroups: ['bird'],
              sizeClasses: ['tiny', 'small'],
              narrative: 'You creep toward watering holes hoping to surprise waterfowl.',
            },
          },
          {
            key: 'people',
            label: 'Search for other travelers',
            baseAction: 'event',
            baseChance: 0.38,
            timeHours: 1,
            randomEvents: [
              {
                weight: 2,
                scene: 'You meet a pair of millers searching for sacks swept downstream.',
                outcome: 'Together you recover them from a snag and are rewarded with a fresh loaf.',
                loot: [
                  { name: 'Warm Mill Loaf', category: 'Provisions', qtyRange: [1, 1], baseItem: 'Bread' },
                ],
              },
              {
                weight: 1,
                scene: 'A hunter shares tanning tips in exchange for word of any stag sign.',
                outcome: 'You swap knowledge and gain a new contact in the area.',
              },
            ],
          },
        ],
      },
      forage: {
        label: 'Forage along the reeds',
        narrative:
          'Reedbeds and willow shade the Tidebreak where medicinal shoots and sweetflag cluster in the damp soil.',
        baseChance: 0.68,
        timeHours: 1.25,
        gatherSkill: 'foraging',
        floraHabitats: ['wetland', 'riverlands'],
        floraRegions: ['aquatic_fresh', 'wetlands_transitional', 'terrestrial'],
        attributes: ['WIS', 'INT'],
        seasonModifiers: { Winter: -0.1, Spring: 0.08, Summer: 0.04 },
        timeModifiers: { dawn: 0.05, dusk: 0.05 },
        weatherModifiers: { storm: -0.35, rain: -0.05, fog: -0.03 },
      },
      fish_gather: {
        baseAction: 'fish_gather',
        label: 'Work the shallows',
        narrative: 'Blend casting, netting, and bank gathering to maximize your time.',
        baseChance: 0.58,
        timeRangeHours: [0.8, 2],
        modes: [
          {
            key: 'deep-channel',
            label: 'Cast into the deep channel',
            baseAction: 'fish',
            baseChanceModifier: 0.08,
            timeHours: 1.8,
            narrative: 'You cast toward the darker water where catfish lurk beneath the current.',
          },
          {
            key: 'eddy-net',
            label: 'Net the slow eddies',
            baseAction: 'fish',
            baseChanceModifier: 0.1,
            timeHours: 1.3,
            narrative: 'You work a weighted net through slack current, scooping minnows and prawns.',
            handGatherable: {
              chance: 0.5,
              faunaHabitats: ['rivers'],
              faunaRegions: ['aquatic'],
              taxonGroups: ['mollusk', 'other'],
              sizeClasses: ['tiny', 'small'],
            },
          },
          {
            key: 'bankline',
            label: 'Gather the bankline',
            baseAction: 'forage',
            baseChanceModifier: 0.12,
            timeHours: 1,
            narrative: 'You snip medicinal shoots and gather damp kindling along the shore.',
            floraHabitats: ['wetland', 'riverlands'],
            fallbackFlora: 'river reeds',
          },
        ],
      },
      fish: {
        label: 'Fish the river shallows',
        narrative:
          'Silverfish cruise the slow eddies while river eels slip beneath the reeds when the current slackens.',
        baseChance: 0.6,
        timeHours: 2,
        gatherSkill: 'fishing',
        faunaHabitats: ['rivers'],
        faunaRegions: ['aquatic'],
        taxonGroups: ['fish'],
        attributes: ['WIS', 'DEX'],
        tool: {
          kind: 'fishing',
          message: 'A rod, hand line, or net is needed to fish the river properly.',
        },
        handGatherable: {
          chance: 0.4,
          faunaHabitats: ['rivers'],
          faunaRegions: ['aquatic'],
          taxonGroups: ['mollusk', 'other'],
          sizeClasses: ['tiny', 'small'],
          narrative: 'Bare hands can still pry mussels and crayfish from the slick banks.',
        },
        seasonModifiers: { Winter: -0.1, Autumn: 0.05 },
        timeModifiers: { dawn: 0.08, dusk: 0.08, night: -0.2 },
        weatherModifiers: { storm: -0.3, rain: -0.05, clear: 0.03 },
      },
      swim: {
        baseAction: 'swim',
        label: 'Wade the shallows',
        narrative: 'You let the current wash around you, clearing your thoughts.',
        baseChance: 0.4,
        timeRangeHours: [0.3, 0.8],
        eventChance: 0.35,
        randomEvents: [
          {
            weight: 2,
            scene: 'Tiny fish nibble at your calves as you stretch in the gentle current.',
            outcome: 'You feel refreshed and alert.',
          },
          {
            weight: 1,
            scene: 'A sudden chill hints at deeper water ahead.',
            outcome: 'You retreat carefully, unwilling to risk the undertow today.',
          },
        ],
      },
      hunt: {
        label: 'Hunt riverbank game',
        narrative:
          'Otter slides and waterfowl prints criss-cross the mud, tempting hunters who stalk the shallows at dawn.',
        baseChance: 0.55,
        timeHours: 2.5,
        huntSkill: 'hunting',
        faunaHabitats: ['wetland', 'riverlands', 'forest'],
        faunaRegions: ['terrestrial', 'wetlands_transitional', 'aquatic'],
        taxonGroups: ['bird', 'mammal', 'amphibian', 'other'],
        attributes: ['WIS', 'DEX', 'AGI'],
        tool: {
          kind: 'huntingWeapon',
          message: 'Bring a bow, spear, or similar hunting weapon to track riverbank prey.',
        },
        handPrey: {
          chance: 0.4,
          faunaHabitats: ['riverlands', 'wetland'],
          faunaRegions: ['wetlands_transitional', 'aquatic'],
          taxonGroups: ['amphibian', 'other', 'bird'],
          sizeClasses: ['tiny', 'small'],
          narrative: 'You might still catch crayfish or startle a duckling by hand, but larger quarry flees.',
        },
        seasonModifiers: { Winter: -0.1, Spring: 0.05 },
        timeModifiers: { dawn: 0.1, dusk: 0.1, day: -0.05 },
        weatherModifiers: { storm: -0.25, rain: -0.1, fog: -0.05 },
      },
    },
  },
  {
    city: "Wave's Break",
    district: "The Farmlands",
    location: "Copperbrook Creek",
    region: 'waves_break',
    weatherHabitat: 'farmland',
    tags: ['creek', 'forest', 'wetland'],
    actions: {
      forage: {
        label: 'Harvest creekside herbs',
        narrative:
          'Shadowed bends shelter luminous moss, sweetwater cress, and copper-tinged herbs along the creek.',
        baseChance: 0.72,
        timeHours: 1.2,
        gatherSkill: 'herbalism',
        floraHabitats: ['wetland', 'forest', 'riverlands'],
        floraRegions: ['aquatic_fresh', 'terrestrial'],
        attributes: ['WIS', 'INT'],
        seasonModifiers: { Winter: -0.08, Spring: 0.08, Summer: 0.04 },
        timeModifiers: { dawn: 0.04, dusk: 0.04 },
        weatherModifiers: { storm: -0.35, rain: -0.08, fog: -0.04 },
      },
      fish: {
        label: 'Set lines in the creek',
        narrative:
          'Cold clear water hides crayfish and brook fish that dart between copper-streaked stones.',
        baseChance: 0.58,
        timeHours: 1.8,
        gatherSkill: 'fishing',
        faunaHabitats: ['rivers', 'streams'],
        faunaRegions: ['aquatic'],
        taxonGroups: ['fish', 'mollusk'],
        attributes: ['WIS', 'DEX'],
        tool: {
          kind: 'fishing',
          message: 'A light rod, snare line, or net is needed to fish the creek efficiently.',
        },
        handGatherable: {
          chance: 0.45,
          faunaHabitats: ['streams', 'rivers'],
          faunaRegions: ['aquatic'],
          taxonGroups: ['mollusk', 'other'],
          sizeClasses: ['tiny', 'small'],
          narrative: 'You can scoop crayfish and freshwater mussels by hand from shaded pools.',
        },
        seasonModifiers: { Winter: -0.12, Autumn: 0.04 },
        timeModifiers: { dawn: 0.06, dusk: 0.08, night: -0.18 },
        weatherModifiers: { storm: -0.28, rain: -0.06, clear: 0.03 },
      },
      hunt: {
        label: 'Hunt creekside game',
        narrative:
          'Songbirds, river otters, and quick-footed hares leave tracks along the loamy banks.',
        baseChance: 0.57,
        timeHours: 2.25,
        huntSkill: 'hunting',
        faunaHabitats: ['forest', 'wetland', 'riverlands'],
        faunaRegions: ['terrestrial', 'wetlands_transitional'],
        taxonGroups: ['bird', 'mammal', 'amphibian'],
        attributes: ['WIS', 'DEX', 'AGI'],
        tool: {
          kind: 'huntingWeapon',
          message: 'Carry a bow, sling, or spear to take quarry along the creek.',
        },
        handPrey: {
          chance: 0.42,
          faunaHabitats: ['riverlands', 'wetland'],
          faunaRegions: ['aquatic', 'wetlands_transitional'],
          taxonGroups: ['other', 'amphibian'],
          sizeClasses: ['tiny', 'small'],
          narrative: 'Quick reflexes might nab a crayfish or startled frog even without weapons.',
        },
        seasonModifiers: { Winter: -0.08, Spring: 0.05 },
        timeModifiers: { dawn: 0.1, dusk: 0.08, day: -0.04 },
        weatherModifiers: { storm: -0.25, rain: -0.1, fog: -0.05 },
      },
    },
  },
  {
    city: "Wave's Break",
    district: "The Farmlands",
    location: "Sunset Grasslands",
    region: 'waves_break',
    weatherHabitat: 'farmland',
    tags: ['grassland', 'prairie'],
    actions: {
      forage: {
        label: 'Gather prairie herbs',
        narrative:
          'Gold grasses sway around pockets of prairie sage, sweetroot, and wind-dried seed heads.',
        baseChance: 0.6,
        timeHours: 1.2,
        gatherSkill: 'foraging',
        floraHabitats: ['grassland', 'farmland'],
        floraRegions: ['terrestrial'],
        attributes: ['WIS', 'INT'],
        seasonModifiers: { Winter: -0.2, Spring: 0.1, Autumn: 0.05 },
        timeModifiers: { morning: 0.05, evening: 0.03 },
        weatherModifiers: { storm: -0.3, rain: -0.08, clear: 0.04 },
      },
      hunt: {
        label: 'Hunt open-range game',
        narrative:
          'Aurochs herds and tusked boar graze among the rippling grasses, wary of riders cresting the hills.',
        baseChance: 0.48,
        timeHours: 3,
        huntSkill: 'hunting',
        faunaHabitats: ['grassland', 'farmland'],
        faunaRegions: ['terrestrial'],
        taxonGroups: ['mammal', 'bird'],
        attributes: ['WIS', 'DEX', 'AGI'],
        tool: {
          kind: 'huntingWeapon',
          message: 'Ranged weapons or javelins are needed to bring down swift grassland game.',
        },
        handPrey: {
          chance: 0.25,
          faunaHabitats: ['grassland'],
          faunaRegions: ['terrestrial'],
          taxonGroups: ['bird'],
          sizeClasses: ['tiny', 'small'],
          narrative: 'You might tackle a wayward prairie chicken, but most beasts outrun empty hands.',
        },
        seasonModifiers: { Winter: -0.15, Spring: 0.06, Autumn: 0.05 },
        timeModifiers: { dawn: 0.08, dusk: 0.08, day: -0.04 },
        weatherModifiers: { storm: -0.3, rain: -0.12, clear: 0.05 },
      },
    },
  },
  {
    city: "Wave's Break",
    district: "The Farmlands",
    location: "Forest Edge",
    region: 'waves_break',
    weatherHabitat: 'farmland',
    tags: ['forest', 'edge'],
    actions: {
      look: {
        baseAction: 'look',
        label: 'Look across the edge',
        narrative: 'You scan the tree line where field meets wood for anything obvious.',
        baseChance: 0.3,
        timeRangeHours: [0.05, 0.1],
        eventChance: 0.28,
        randomEvents: [
          {
            weight: 2,
            scene: 'Songbirds burst from the brush as something rustles deeper in the wood.',
            outcome: 'You spot a clump of ripe berries you somehow missed before.',
            loot: [
              { name: 'Edge-Berries', category: 'Gathered Goods', qtyRange: [1, 2], baseItem: 'Forest Berries' },
            ],
          },
          {
            weight: 1,
            scene: 'Smoke curls lazily from a distant campfire.',
            outcome: 'Someone else is nearby—worth keeping in mind.',
          },
        ],
      },
      explore: {
        baseAction: 'explore',
        label: 'Explore the hedgerows',
        narrative: 'You follow game trails and fencelines where farmland gives way to shade.',
        baseChance: 0.58,
        timeRangeHours: [1, 2.5],
        eventChance: 0.6,
        randomEvents: [
          {
            weight: 2,
            scene: 'You find a farmer repairing a broken fence.',
            outcome: 'Helping reset the posts earns you a basket of apples.',
            loot: [
              { name: 'Basket of Edge Apples', category: 'Provisions', qtyRange: [1, 1], baseItem: 'Apples' },
            ],
          },
          {
            weight: 1,
            scene: 'A hidden snare line threatens to maim wildlife.',
            outcome: 'You dismantle it and pocket the wire for future use.',
            loot: [
              { name: 'Recovered Snare Wire', category: 'Salvage', qtyRange: [1, 2], baseItem: 'Wire' },
            ],
          },
          {
            weight: 1,
            scene: 'A wounded doe limps toward you before vanishing back into the trees.',
            outcome: 'You mark the direction, noting a potential hunt later.',
          },
        ],
      },
      search: {
        baseAction: 'search',
        label: 'Search the forest edge',
        narrative: 'Decide what to focus on among the hedgerows and pine shadows.',
        baseChance: 0.5,
        timeRangeHours: [0.4, 1.8],
        categories: [
          {
            key: 'berries',
            label: 'Search for berries and herbs',
            baseAction: 'forage',
            baseChance: 0.62,
            timeHours: 1.1,
            floraHabitats: ['forest', 'farmland'],
            floraRegions: ['terrestrial'],
            fallbackFlora: 'hedgerow berries',
          },
          {
            key: 'firewood',
            label: 'Search for firewood and resin',
            baseAction: 'loot',
            baseChance: 0.55,
            timeHours: 0.8,
            lootTable: [
              { name: 'Bundle of Kindling', category: 'Resources', qtyRange: [1, 2], weight: 3 },
              { name: 'Resin Scrapings', category: 'Resources', qtyRange: [1, 1], weight: 2 },
              { name: 'Sturdy Branch', category: 'Resources', qtyRange: [1, 1], weight: 1 },
            ],
          },
          {
            key: 'tracks',
            label: 'Search for tracks',
            baseAction: 'hunt',
            baseChance: 0.48,
            timeHours: 1.6,
            faunaHabitats: ['forest', 'farmland'],
            faunaRegions: ['terrestrial'],
            taxonGroups: ['mammal', 'bird'],
            handPrey: {
              chance: 0.26,
              faunaHabitats: ['forest'],
              faunaRegions: ['terrestrial'],
              taxonGroups: ['bird', 'mammal'],
              sizeClasses: ['tiny', 'small'],
              narrative: 'You try to flush rabbits from the hedgerow with quick reflexes.',
            },
          },
          {
            key: 'people',
            label: 'Search for other folk',
            baseAction: 'event',
            baseChance: 0.36,
            timeHours: 1,
            randomEvents: [
              {
                weight: 2,
                scene: 'You find a woodcutter wrestling with a stuck cart.',
                outcome: 'A push frees the wheels and earns you a wedge of cheese.',
                loot: [
                  { name: 'Woodcutter’s Cheese', category: 'Provisions', qtyRange: [1, 1], baseItem: 'Cheese' },
                ],
              },
              {
                weight: 1,
                scene: 'Children from the farmstead search for a lost goat.',
                outcome: 'You help guide the animal home, boosting goodwill.',
              },
            ],
          },
        ],
      },
      forage: {
        label: 'Collect edge-forest growth',
        narrative:
          'Mushrooms, berries, and resin cling to the pine-shadowed boundary where field meets wood.',
        baseChance: 0.65,
        timeHours: 1.1,
        gatherSkill: 'foraging',
        floraHabitats: ['forest', 'farmland'],
        floraRegions: ['terrestrial'],
        attributes: ['WIS', 'INT'],
        seasonModifiers: { Winter: -0.1, Spring: 0.07, Autumn: 0.05 },
        timeModifiers: { morning: 0.04, dusk: 0.04 },
        weatherModifiers: { storm: -0.3, rain: -0.08, fog: -0.04 },
      },
      hunt: {
        label: 'Hunt small woodland game',
        narrative:
          'Tracks of foxes, hares, and prowling wolves weave between the last fencelines and the shadowed pines.',
        baseChance: 0.52,
        timeHours: 2.5,
        huntSkill: 'hunting',
        faunaHabitats: ['forest', 'farmland'],
        faunaRegions: ['terrestrial'],
        taxonGroups: ['mammal', 'bird'],
        attributes: ['WIS', 'DEX', 'AGI'],
        tool: {
          kind: 'huntingWeapon',
          message: 'A bow, crossbow, or spear is needed to take woodland prey.',
        },
        handPrey: {
          chance: 0.3,
          faunaHabitats: ['forest'],
          faunaRegions: ['terrestrial'],
          taxonGroups: ['bird', 'mammal'],
          sizeClasses: ['tiny', 'small'],
          narrative: 'You might grab a startled hare near the hedgerows, but wolves will not be snared bare-handed.',
        },
        seasonModifiers: { Winter: -0.12, Spring: 0.05, Autumn: 0.05 },
        timeModifiers: { dawn: 0.08, dusk: 0.08, night: -0.06 },
        weatherModifiers: { storm: -0.3, rain: -0.12, fog: -0.05 },
      },
      fell_tree: {
        baseAction: 'fell_tree',
        label: 'Fell a tree',
        narrative: 'You mark a straight trunk and prepare to bring it down.',
        baseChance: 0.55,
        timeHours: 2.2,
        tool: {
          kind: 'woodcutting',
          message: 'You need a woodsman’s axe, hatchet, or saw to fell trees efficiently.',
        },
        lootTable: [
          { name: 'Stack of Green Logs', category: 'Resources', qtyRange: [1, 2], weight: 3 },
          { name: 'Pitch Resin Clump', category: 'Resources', qtyRange: [1, 1], weight: 2 },
          { name: 'Burl Wood Chunk', category: 'Resources', qtyRange: [1, 1], weight: 1 },
        ],
      },
    },
  },
  {
    city: "Wave's Break",
    district: "The Farmlands",
    location: "Coastal Pinewood",
    region: 'waves_break',
    weatherHabitat: 'coastal',
    tags: ['forest', 'coastal'],
    actions: {
      look: {
        baseAction: 'look',
        label: 'Look through the pines',
        narrative: 'Salt mist drifts through the trunks as you check for obvious movement or resources.',
        baseChance: 0.32,
        timeRangeHours: [0.05, 0.1],
        eventChance: 0.3,
        randomEvents: [
          {
            weight: 2,
            scene: 'You notice resin beading on a wind-scoured pine.',
            outcome: 'A quick scrape yields a palm of fragrant pitch.',
            loot: [
              { name: 'Pine Pitch Resin', category: 'Resources', qtyRange: [1, 1], baseItem: 'Resin' },
            ],
          },
          {
            weight: 1,
            scene: 'Far off, breakers crash against the cliffs.',
            outcome: 'Nothing urgent reveals itself, but the air smells of storms.',
          },
        ],
      },
      explore: {
        baseAction: 'explore',
        label: 'Explore the coastal wood',
        narrative: 'You weave between salt-twisted trunks and mossy hollows to map the wood’s secrets.',
        baseChance: 0.6,
        timeRangeHours: [1.2, 2.7],
        eventChance: 0.62,
        randomEvents: [
          {
            weight: 2,
            scene: 'A forager camp struggles with soggy firewood.',
            outcome: 'You share some dry kindling and receive smoked fish in return.',
            loot: [
              { name: 'Smoked River Fish', category: 'Provisions', qtyRange: [1, 2], baseItem: 'Smoked Fish' },
            ],
          },
          {
            weight: 1,
            scene: 'You discover wind-felled timber already drying.',
            outcome: 'Marking the spot will make future harvesting easier.',
          },
          {
            weight: 1,
            scene: 'A hidden shrine of driftwood to the Sea-Mother sits tucked between roots.',
            outcome: 'You leave a token and feel a subtle blessing.',
          },
        ],
      },
      search: {
        baseAction: 'search',
        label: 'Search the pinewood',
        narrative: 'Focus on what you most need from the misty pines.',
        baseChance: 0.52,
        timeRangeHours: [0.4, 1.9],
        categories: [
          {
            key: 'mushrooms',
            label: 'Search for mushrooms and herbs',
            baseAction: 'forage',
            baseChance: 0.6,
            timeHours: 1.2,
            floraHabitats: ['forest'],
            floraRegions: ['terrestrial'],
            fallbackFlora: 'pinewood mushrooms',
          },
          {
            key: 'firewood',
            label: 'Search for driftwood and resin',
            baseAction: 'loot',
            baseChance: 0.57,
            timeHours: 0.9,
            lootTable: [
              { name: 'Salt-dried Driftwood', category: 'Resources', qtyRange: [1, 2], weight: 3 },
              { name: 'Coastal Pine Cones', category: 'Resources', qtyRange: [1, 3], weight: 2 },
              { name: 'Amber Sap Globule', category: 'Resources', qtyRange: [1, 1], weight: 1 },
            ],
          },
          {
            key: 'tracks',
            label: 'Search for animal sign',
            baseAction: 'hunt',
            baseChance: 0.5,
            timeHours: 1.7,
            faunaHabitats: ['forest'],
            faunaRegions: ['terrestrial'],
            taxonGroups: ['mammal', 'bird'],
            handPrey: {
              chance: 0.24,
              faunaHabitats: ['forest'],
              faunaRegions: ['terrestrial'],
              taxonGroups: ['bird'],
              sizeClasses: ['tiny', 'small'],
              narrative: 'You listen for squirrels chattering overhead.',
            },
          },
          {
            key: 'people',
            label: 'Search for other travelers',
            baseAction: 'event',
            baseChance: 0.34,
            timeHours: 1,
            randomEvents: [
              {
                weight: 2,
                scene: 'A pair of carpenters gather cedar boughs for boat caulking.',
                outcome: 'You lend muscle and gain a promise of discounted repairs.',
              },
              {
                weight: 1,
                scene: 'You hear chants from a druid circle blessing the forest.',
                outcome: 'They nod to you, acknowledging your respect for the grove.',
              },
            ],
          },
        ],
      },
      forage: {
        label: 'Gather pinewood finds',
        narrative:
          'Resin, shelf mushrooms, and briny pine nuts cling to the mist-soaked trunks of the coastal wood.',
        baseChance: 0.62,
        timeHours: 1.3,
        gatherSkill: 'foraging',
        floraHabitats: ['forest'],
        floraRegions: ['terrestrial'],
        attributes: ['WIS', 'INT'],
        seasonModifiers: { Winter: -0.08, Autumn: 0.06 },
        timeModifiers: { morning: 0.05, dusk: 0.04 },
        weatherModifiers: { storm: -0.35, rain: -0.1, fog: -0.05 },
      },
      hunt: {
        label: 'Stalk deep-wood game',
        narrative:
          'Boar, stag, and elusive forest spirits stalk the dim hollows beneath resin-scented boughs.',
        baseChance: 0.46,
        timeHours: 3.2,
        huntSkill: 'hunting',
        faunaHabitats: ['forest'],
        faunaRegions: ['terrestrial'],
        taxonGroups: ['mammal', 'bird'],
        attributes: ['WIS', 'DEX', 'AGI'],
        tool: {
          kind: 'huntingWeapon',
          message: 'Strong bows or heavy spears are required to hunt in the pinewood.',
        },
        handPrey: {
          chance: 0.22,
          faunaHabitats: ['forest'],
          faunaRegions: ['terrestrial'],
          taxonGroups: ['bird'],
          sizeClasses: ['tiny', 'small'],
          narrative: 'Only the smallest creatures—squirrels or grouse—might be taken without weapons.',
        },
        seasonModifiers: { Winter: -0.15, Autumn: 0.06 },
        timeModifiers: { dawn: 0.08, dusk: 0.08, night: -0.08 },
        weatherModifiers: { storm: -0.35, rain: -0.12, fog: -0.05 },
      },
      fell_tree: {
        baseAction: 'fell_tree',
        label: 'Harvest coastal timber',
        narrative: 'You brace against the wind and swing carefully at a salt-twisted pine.',
        baseChance: 0.5,
        timeHours: 2.5,
        tool: {
          kind: 'woodcutting',
          message: 'A sturdy axe or saw is needed to bring down these wind-toughened trees.',
        },
        lootTable: [
          { name: 'Coastal Timber Log', category: 'Resources', qtyRange: [1, 2], weight: 3 },
          { name: 'Pine Resin Bundle', category: 'Resources', qtyRange: [1, 1], weight: 2 },
          { name: 'Salt-Kissed Kindling', category: 'Resources', qtyRange: [1, 2], weight: 2 },
        ],
      },
    },
  },
  {
    city: "Wave's Break",
    district: "The Farmlands",
    location: 'Cliffbreak Quarry',
    region: 'waves_break',
    weatherHabitat: 'coastal',
    tags: ['quarry', 'stone', 'cliff', 'mine'],
    actions: {
      look: {
        baseAction: 'look',
        label: 'Survey the quarry',
        narrative: 'You scan the stone terraces for loose rock, workers, or lurking danger.',
        baseChance: 0.33,
        timeRangeHours: [0.05, 0.12],
        eventChance: 0.32,
        randomEvents: [
          {
            weight: 2,
            scene: 'Sunlight glints off a seam of quartz left exposed by the last cut.',
            outcome: 'You chip away a handful of shining shards.',
            loot: [
              { name: 'Quartz Shards', category: 'Resources', qtyRange: [1, 2], baseItem: 'Quartz' },
            ],
          },
          {
            weight: 1,
            scene: 'Loose scree shifts beneath a cart wheel.',
            outcome: 'You warn the crew in time to prevent a spill.',
          },
        ],
      },
      explore: {
        baseAction: 'explore',
        label: 'Explore the quarry paths',
        narrative: 'You walk the switchbacks and chutes, checking spoil piles and side tunnels.',
        baseChance: 0.55,
        timeRangeHours: [1, 2.2],
        eventChance: 0.55,
        randomEvents: [
          {
            weight: 2,
            scene: 'A foreman needs help resetting a jammed pulley.',
            outcome: 'After lending muscle, you receive a chisel as thanks.',
            loot: [
              { name: 'Quarryman’s Chisel', category: 'Tools', qtyRange: [1, 1], baseItem: 'Chisel' },
            ],
          },
          {
            weight: 1,
            scene: 'You find a weathered fossil embedded in a chunk of limestone.',
            outcome: 'Carefully extracting it may fetch a good price with scholars.',
            loot: [
              { name: 'Limestone Fossil', category: 'Curios', qtyRange: [1, 1], baseItem: 'Fossil' },
            ],
          },
        ],
      },
      search: {
        baseAction: 'search',
        label: 'Search the spoil heaps',
        narrative: 'Decide what to sift for among the broken stone and rubble.',
        baseChance: 0.48,
        timeRangeHours: [0.5, 1.8],
        categories: [
          {
            key: 'ore',
            label: 'Search for ore-bearing rock',
            baseAction: 'mine',
            baseChance: 0.45,
            timeHours: 1.6,
            lootTable: [
              { name: 'Veined Iron Chunk', category: 'Resources', qtyRange: [1, 1], weight: 2 },
              { name: 'Copper-Flecked Stone', category: 'Resources', qtyRange: [1, 1], weight: 2 },
            ],
          },
          {
            key: 'stone',
            label: 'Search for workable stone blocks',
            baseAction: 'loot',
            baseChance: 0.55,
            timeHours: 1.2,
            lootTable: [
              { name: 'Cut Stone Slab', category: 'Resources', qtyRange: [1, 2], weight: 3 },
              { name: 'Crushed Gravel Sack', category: 'Resources', qtyRange: [1, 1], weight: 2 },
            ],
          },
          {
            key: 'people',
            label: 'Search for workers needing aid',
            baseAction: 'event',
            baseChance: 0.36,
            timeHours: 1,
            randomEvents: [
              {
                weight: 2,
                scene: 'A laborer twists an ankle hauling stone.',
                outcome: 'You help splint the injury and gain a favor owed.',
              },
              {
                weight: 1,
                scene: 'Surveyors ask for another set of eyes on their new cut.',
                outcome: 'You spot a potential fault and prevent a collapse.',
              },
            ],
          },
        ],
      },
      mine: {
        baseAction: 'mine',
        label: 'Delve for ore',
        narrative: 'You select a promising seam and ready your tools.',
        baseChance: 0.5,
        timeHours: 2.4,
        tool: {
          kind: 'mining',
          message: 'A pickaxe or heavy hammer is required to break quarry stone.',
        },
        lootTable: [
          { name: 'Iron Ore Chunk', category: 'Resources', qtyRange: [1, 2], weight: 3 },
          { name: 'Copper Ore Nodules', category: 'Resources', qtyRange: [1, 2], weight: 2 },
          { name: 'Stone Rubble', category: 'Resources', qtyRange: [1, 2], weight: 1 },
        ],
      },
    },
  },
];

function encodeSegment(value) {
  return encodeURIComponent(value ?? '');
}

function decodeSegment(value) {
  try {
    return decodeURIComponent(value ?? '');
  } catch (err) {
    return value ?? '';
  }
}

function environmentKey(city, district, location) {
  return [city || '', district || '', location || ''].join('\u241F');
}

const ENVIRONMENT_INDEX = new Map(
  ENVIRONMENT_NODES.map(node => [environmentKey(node.city, node.district, node.location), node]),
);

export function getEnvironmentDefinition(city, district, location) {
  return ENVIRONMENT_INDEX.get(environmentKey(city, district, location)) || null;
}

export function listEnvironmentActions(city, district, location, context = {}) {
  const def = getEnvironmentDefinition(city, district, location);
  if (!def) return [];
  const tags = new Set((def.tags || []).map(tag => String(tag).toLowerCase()));
  const entries = [];
  ACTION_ORDER.forEach(actionType => {
    const action = def.actions?.[actionType];
    if (!action) return;
    const baseType = action.baseAction || actionType;
    const actionContext = {
      ...context,
      season: context.season || null,
      timeKey: context.timeKey || null,
      weatherKey: context.weatherKey || null,
    };
    if (!actionMakesSense(baseType, action, def, tags, actionContext)) return;
    const label =
      action.label || inferActionLabel(actionType, tags) || describeEnvironmentAction(actionType) || describeEnvironmentAction(baseType);
    const icon = action.icon || ACTION_METADATA[actionType]?.icon || ACTION_METADATA[baseType]?.icon || null;
    entries.push({ type: actionType, label, narrative: action.narrative, icon });
  });
  return entries;
}

export function buildEnvironmentActionId(actionType, city, district, location) {
  return [
    ACTION_PREFIX,
    encodeSegment(actionType),
    encodeSegment(city),
    encodeSegment(district || ''),
    encodeSegment(location || ''),
  ].join(':');
}

export function parseEnvironmentActionId(actionId) {
  if (!actionId || typeof actionId !== 'string') return null;
  const parts = actionId.split(':');
  if (parts.length < 5 || parts[0] !== ACTION_PREFIX) return null;
  const [_, type, city, district, location] = parts;
  return {
    actionType: decodeSegment(type),
    city: decodeSegment(city),
    district: decodeSegment(district),
    location: decodeSegment(location),
  };
}

export function describeEnvironmentAction(actionType) {
  const meta = ACTION_METADATA[actionType];
  if (meta?.label) return meta.label;
  if (actionType === 'search') return 'Search';
  if (actionType === 'explore') return 'Explore';
  if (actionType === 'look') return 'Look Around';
  if (actionType === 'beachcomb') return 'Beachcombing';
  if (actionType === 'tidepool') return 'Tidepooling';
  if (actionType === 'fish_gather') return 'Fish & Gather';
  if (actionType === 'forage') return 'Gather';
  if (actionType === 'fish') return 'Fish';
  if (actionType === 'hunt') return 'Hunt';
  if (actionType === 'dive') return 'Dive';
  if (actionType === 'swim') return 'Swim';
  if (actionType === 'mine') return 'Mine';
  if (actionType === 'fell_tree') return 'Fell Trees';
  return toTitleCase(actionType);
}

export { ENVIRONMENT_NODES };
