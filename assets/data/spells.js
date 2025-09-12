// Simplified elemental spellbook with 15 spells per element
// Each element distributes spells across four schools:
// Destructive (attack), Enfeebling (debuff/DoT), Reinforcement (buff), Control (hindrance)

// MP cost helper retained from original implementation
const mpCost = (tier) => Math.ceil(3 * (1 + Math.log2(tier)));

// Proficiency milestones for 15 spell tiers
const MILESTONES = Array.from({ length: 15 }, (_, i) => (i + 1) * 10);

// Status effect applied when a destructive spell crits
const STATUS_ON_CRIT = {
  Stone: "stun",
  Water: "slow",
  Wind: "bleed",
  Fire: "burn",
  Ice: "slow",
  Thunder: "stun",
  Dark: "poison",
  Light: "blind",
};

// Direct enfeeblement spells with their inherent status and chance
// basePower defaults to 0 unless specified
const ENFEEBLE_DETAILS = {
  Stone: {
    "Dust Blind": { status: "blind", chance: 1 },
    "Weight Hex": { status: "slow", chance: 1 },
  },
  Water: {
    "Salt Weakness": { status: "defDown", chance: 1 },
    "Sluggish Spray": { status: "slow", chance: 1 },
  },
  Wind: {
    "Razor Wind": { basePower: 20, status: "bleed", chance: 0.5 },
    "Bleeding Gale": { basePower: 30, status: "bleed", chance: 0.65 },
    "Hemorrhage Gust": { basePower: 40, status: "bleed", chance: 0.8 },
  },
  Fire: {
    "Searing Brand": { basePower: 25, status: "burn", chance: 0.5 },
    "Ashen Grasp": { basePower: 35, status: "burn", chance: 0.65 },
    "Scorch Mark": { basePower: 45, status: "burn", chance: 0.8 },
    "Burning Curse": { basePower: 55, status: "burn", chance: 0.9 },
  },
  Ice: {
    "Chill Touch": { basePower: 20, status: "slow", chance: 0.5 },
    "Rime Curse": { basePower: 30, status: "slow", chance: 0.75 },
    "Hail Weakness": { status: "defDown", chance: 1 },
  },
  Thunder: {
    "Static Drain": { basePower: 20, status: "stun", chance: 0.3 },
    "Shock Sap": { basePower: 30, status: "stun", chance: 0.45 },
    "Paralyzing Jolt": { basePower: 40, status: "paralyze", chance: 0.6 },
    "Chaos Surge": { basePower: 50, status: "confuse", chance: 0.5 },
  },
  Light: {
    "Purging Mark": { status: "dispel", chance: 1 },
    "Blinding Halo": { status: "blind", chance: 1 },
    "Consecrated Bind": { status: "immobilize", chance: 1 },
  },
  Dark: {
    "Life Drain": { basePower: 25, status: "drain", chance: 1 },
    "Mana Siphon": { basePower: 25, status: "manaBurn", chance: 1 },
    "Shadow Rot": { basePower: 35, status: "poison", chance: 0.8 },
    "Curse of Weakness": { status: "attackDown", chance: 1 },
    "Poison Cloud": { basePower: 40, status: "poison", chance: 0.9 },
  },
};

function describeSpell(spell) {
  const elem = spell.element.toLowerCase();
  switch (spell.school) {
    case "Destructive":
      return `Unleashes ${elem} energy to strike a foe.`;
    case "Enfeebling":
      return `Afflicts a foe with weakening ${elem} magic.`;
    case "Reinforcement":
      return `Bolsters an ally with ${elem} resilience.`;
    case "Control":
      return `Restrains a target with ${elem} forces.`;
    default:
      return "";
  }
}

// Spell name themes per element
const THEMES = {
  Stone: {
    destruction: [
      "Stone Spike",
      "Rockfall",
      "Bedrock Crush",
      "Gaia Fury",
    ],
    control: [
      "Quake Lock",
      "Gravel Grasp",
      "Petrify Field",
      "Seismic Slow",
    ],
    reinforcement: [
      "Stone Skin",
      "Bulwark Shell",
      "Guardian Bastion",
      "Titan Fortify",
      "Earth Ward",
    ],
    enfeebling: [
      "Dust Blind",
      "Weight Hex",
    ],
  },
  Water: {
    destruction: [
      "Water Jet",
      "Tidal Blade",
      "Riptide Burst",
      "Leviathan Slam",
    ],
    control: [
      "Tide Bind",
      "Pressure Grip",
      "Whirlpool Trap",
      "Mist Veil",
      "Undertow Prison",
    ],
    reinforcement: [
      "Aqua Veil",
      "Healing Current",
      "Flow State",
      "Tidal Aegis",
    ],
    enfeebling: [
      "Salt Weakness",
      "Sluggish Spray",
    ],
  },
  Wind: {
    destruction: [
      "Wind Blade",
      "Tempest Slash",
      "Hurricane Edge",
      "Sky Ripper",
    ],
    reinforcement: [
      "Wind Walk",
      "Tailwind",
      "Featherfall",
      "Gale Guard",
      "Zephyr Surge",
    ],
    control: [
      "Gale Tangle",
      "Vacuum Lock",
      "Suffocating Draft",
    ],
    enfeebling: [
      "Razor Wind",
      "Bleeding Gale",
      "Hemorrhage Gust",
    ],
  },
  Fire: {
    destruction: [
      "Ember Shot",
      "Flame Burst",
      "Inferno Wave",
      "Blazing Comet",
      "Lava Lance",
      "Cinder Rain",
      "Phoenix Flare",
    ],
    enfeebling: [
      "Searing Brand",
      "Ashen Grasp",
      "Scorch Mark",
      "Burning Curse",
    ],
    control: [
      "Fire Cage",
      "Molten Shackles",
    ],
    reinforcement: [
      "Blaze Armor",
      "Heat Mirage",
    ],
  },
  Ice: {
    destruction: [
      "Ice Lance",
      "Frost Shard",
      "Blizzard Spike",
      "Glacial Crash",
    ],
    control: [
      "Frozen Bind",
      "Permafrost Field",
      "Hoarfrost Chains",
      "Glaze Trap",
      "Absolute Zero",
    ],
    reinforcement: [
      "Frost Armor",
      "Crystal Skin",
      "Winter Ward",
    ],
    enfeebling: [
      "Chill Touch",
      "Rime Curse",
      "Hail Weakness",
    ],
  },
  Thunder: {
    destruction: [
      "Spark Bolt",
      "Thunder Strike",
      "Arc Flash",
      "Volt Barrage",
      "Storm Lance",
      "Heaven Roar",
    ],
    enfeebling: [
      "Static Drain",
      "Shock Sap",
      "Paralyzing Jolt",
      "Chaos Surge",
    ],
    control: [
      "Thunder Stun",
      "Magnetic Cage",
      "Overload Lock",
    ],
    reinforcement: [
      "Charged Barrier",
      "Ion Shield",
    ],
  },
  Light: {
    reinforcement: [
      "Cure Light",
      "Healing Wave",
      "Blessing Shield",
      "Sanctuary Ward",
      "Solar Grace",
      "Divine Aegis",
    ],
    destruction: [
      "Holy Ray",
      "Radiant Burst",
      "Seraph Spear",
      "Ascension Strike",
    ],
    enfeebling: [
      "Purging Mark",
      "Blinding Halo",
      "Consecrated Bind",
    ],
    control: [
      "Revelation Seal",
      "Judgment Lock",
    ],
  },
  Dark: {
    enfeebling: [
      "Life Drain",
      "Mana Siphon",
      "Shadow Rot",
      "Curse of Weakness",
      "Poison Cloud",
    ],
    destruction: [
      "Shadow Bolt",
      "Umbral Slash",
      "Void Spike",
      "Abyssal Wave",
    ],
    control: [
      "Night Shackles",
      "Fear Gloom",
      "Sleep Mist",
      "Dark Blindfold",
    ],
    reinforcement: [
      "Shade Veil",
      "Profane Guard",
    ],
  },
};

const SCHOOL_MAP = {
  destruction: "Destructive",
  enfeebling: "Enfeebling",
  reinforcement: "Reinforcement",
  control: "Control",
};

const TYPE_MAP = {
  destruction: "Attack",
  enfeebling: "Debuff",
  reinforcement: "Buff",
  control: "Control",
};

const FAMILY_MAP = {
  destruction: "attack",
  enfeebling: "control",
  reinforcement: "support",
  control: "control",
};

function buildElement(element, lists) {
  const spells = [];
  const counters = { destruction: 0, control: 0, enfeebling: 0, reinforcement: 0 };
  for (const category of ["destruction", "control", "enfeebling", "reinforcement"]) {
    const names = lists[category] || [];
    for (const name of names) {
      const tier = spells.length + 1;
      counters[category]++;
      let basePower = 0;
      if (category === "destruction") {
        basePower = 20 + (counters[category] - 1) * 10;
      }
      const spell = {
        id: `${element}:${category.substring(0,3).toUpperCase()}:${tier}`,
        name,
        element,
        school: SCHOOL_MAP[category],
        family: FAMILY_MAP[category],
        type: TYPE_MAP[category],
        target: "ST",
        proficiency: MILESTONES[tier - 1],
        mpCost: mpCost(tier),
        basePower,
      };
      if (category === "enfeebling") {
        const detail = ENFEEBLE_DETAILS[element]?.[name];
        if (detail) {
          spell.basePower = detail.basePower || 0;
          spell.status = { name: detail.status, chance: detail.chance };
        }
      }
      if (spell.basePower > 0) {
        spell.statusOnCrit = STATUS_ON_CRIT[element];
      }
      spell.description = describeSpell(spell);
      spells.push(spell);
    }
  }
  return spells;
}

function generateSpellbook() {
  const all = [];
  for (const [element, lists] of Object.entries(THEMES)) {
    all.push(...buildElement(element, lists));
  }
  return all;
}

const SPELLBOOK = generateSpellbook();

export { mpCost, MILESTONES, STATUS_ON_CRIT, THEMES, buildElement, generateSpellbook, SPELLBOOK };

