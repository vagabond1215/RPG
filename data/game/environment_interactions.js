const ACTION_PREFIX = 'environment';

const ACTION_ORDER = ['forage', 'fish', 'hunt'];

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

  if (actionType === 'fish') {
    if (!hasAnyTag(tags, WATER_ACCESS_TAGS)) return false;
    if (hasAnyTag(tags, WATER_EXCLUSION_TAGS)) return false;
    if (context.weatherKey === 'storm') return false;
  }

  if (actionType === 'forage') {
    const hasGathering = hasAnyTag(tags, GATHERING_TAGS) || hasAnyTag(tags, WATER_ACCESS_TAGS);
    if (!hasGathering) return false;
    if (context.weatherKey === 'storm' && !tags.has('tidal')) return false;
  }

  if (actionType === 'hunt') {
    if (!hasAnyTag(tags, WILDLIFE_TAGS)) return false;
    if (context.weatherKey === 'storm') return false;
  }

  const chance = estimateActionChance(action, context);
  return chance >= MINIMUM_PRESENTABLE_CHANCE;
}

function inferActionLabel(actionType, tags) {
  if (actionType === 'forage') {
    if (tags.has('tidal') || tags.has('tidepool')) return 'Tidepooling';
    if (tags.has('beach') || tags.has('shore')) return 'Beachcombing';
    if (hasAnyTag(tags, WATER_ACCESS_TAGS)) return 'Fish & Gather';
    if (tags.has('farmland') || tags.has('prairie') || tags.has('grassland')) return 'Harvest';
    return 'Gathering';
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
      forage: {
        label: 'Forage the tidepools',
        narrative:
          'Foam-slick rock pools hide kelp fronds, tideflowers, and brine-crusted shells along the Saltwash shallows.',
        baseChance: 0.7,
        timeHours: 1,
        gatherSkill: 'foraging',
        floraHabitats: ['tidal_flats', 'wetland'],
        floraRegions: ['coastal', 'aquatic_fresh'],
        attributes: ['WIS', 'INT'],
        seasonModifiers: { Winter: -0.05, Summer: 0.05 },
        timeModifiers: { dawn: 0.05, dusk: 0.05 },
        weatherModifiers: { storm: -0.4, rain: -0.1, fog: -0.05, clear: 0.05 },
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
    const actionContext = {
      ...context,
      season: context.season || null,
      timeKey: context.timeKey || null,
      weatherKey: context.weatherKey || null,
    };
    if (!actionMakesSense(actionType, action, def, tags, actionContext)) return;
    const label = inferActionLabel(actionType, tags) || action.label || describeEnvironmentAction(actionType);
    entries.push({ type: actionType, label, narrative: action.narrative });
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
  if (actionType === 'forage') return 'Forage';
  if (actionType === 'fish') return 'Fish';
  if (actionType === 'hunt') return 'Hunt';
  return actionType;
}

export { ENVIRONMENT_NODES };
