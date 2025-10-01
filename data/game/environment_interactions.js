const ACTION_PREFIX = 'environment';

const ACTION_ORDER = ['forage', 'fish', 'hunt'];

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

export function listEnvironmentActions(city, district, location) {
  const def = getEnvironmentDefinition(city, district, location);
  if (!def) return [];
  const entries = [];
  ACTION_ORDER.forEach(actionType => {
    if (def.actions && def.actions[actionType]) {
      const action = def.actions[actionType];
      entries.push({ type: actionType, label: action.label, narrative: action.narrative });
    }
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
