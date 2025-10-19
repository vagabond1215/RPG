import {
  renderBackstoryString,
  BACKSTORY_BY_ID,
  getBackstoriesByCriteria,
  getRaceCadenceTemplate,
  getPronouns,
} from "../data/game/backstories.js";
import { getAnglesForRaceClass } from "../data/game/race_class_angles.js";

const REQUIRED_BACKSTORY_INPUTS = ["name", "race", "sex", "class", "alignment", "location"];

function hasRequiredBackstoryInputs(character) {
  if (!character) return false;
  return REQUIRED_BACKSTORY_INPUTS.every(key => Boolean(character[key]));
}

function computeShortName(name) {
  if (!name) return "";
  const trimmed = name.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/);
  return parts[0] || trimmed;
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function selectVerb(pronouns, singular, plural) {
  const subject = pronouns?.subject?.toLowerCase();
  return subject === "they" ? plural : singular;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isSentenceStart(text, offset) {
  if (offset === 0) return true;
  const prior = text.slice(0, offset).trimEnd();
  if (!prior) return true;
  return /[.!?]$/.test(prior);
}

function capClassTokenUsage(paragraphs, className) {
  if (!className) return paragraphs;
  const regex = new RegExp(escapeRegex(className), "gi");
  const substitutes = ["the path", "the vocation", "the calling"];
  let count = 0;
  return paragraphs.map(paragraph =>
    paragraph.replace(regex, (match, offset, text) => {
      count += 1;
      if (count <= 2) return match;
      let replacement = substitutes[(count - 3) % substitutes.length];
      if (!replacement) return match;
      if (match[0] === match[0].toUpperCase()) replacement = capitalize(replacement);
      if (isSentenceStart(text, offset)) replacement = capitalize(replacement);
      return replacement;
    })
  );
}

function gatherNarrativeDefaults(character = {}, overrides = {}) {
  const shortName = overrides.shortName || character.shortName || computeShortName(character.name);
  const voiceTone = overrides.voiceTone || overrides.voice_tone || character.voiceTone || "steady";
  const signatureTool =
    overrides.signatureTool || overrides.signature_tool || character.signatureTool || "trusted kit";
  const virtue = overrides.virtue || character.virtue || "resolve";
  const flaw = overrides.flaw || character.flaw || "stubbornness";
  const bond = overrides.bond || character.bond || "neighbors";
  const secret = overrides.secret || character.secret || "an unspoken promise";
  const backstorySeed =
    overrides.backstorySeed ||
    overrides.backstory_seed ||
    character.backstorySeed ||
    "a weathered ledger";
  return {
    shortName,
    voiceTone,
    signatureTool,
    virtue,
    flaw,
    bond,
    secret,
    backstorySeed,
  };
}

function buildClassPhilosophy(race, className, signatureTool, pronouns, shortName) {
  const angles = getAnglesForRaceClass(race, className);
  if (!angles.length) return "";
  const focus = shortName || capitalize(pronouns?.subject || "");
  const pronounSubject = pronouns?.subject ? capitalize(pronouns.subject) : "";
  const pronounPossessive = pronouns?.possessive || "their";
  const repeatVerb = pronouns?.subject && pronouns.subject.toLowerCase() === "they" ? "repeat" : "repeats";
  const fragments = [];
  fragments.push(
    `${focus} treated ${angles[0]} like a sunrise drill, steadying ${pronounPossessive} breath before the city stirred.`
  );
  if (angles[1]) {
    fragments.push(
      `${pronounSubject} bound ${angles[1]} to ${signatureTool}, promising every apprentice that craft mattered more than spectacle.`
    );
  }
  if (angles[2]) {
    fragments.push(`${pronounSubject} still ${repeatVerb} ${angles[2]} when dusk lessons drift toward doubt.`);
  }
  return fragments.join(" ").trim();
}

const ALIGNMENT_REFLECTION_BUILDERS = {
  "Lawful Good": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} once audited guild ledgers with ${context.signatureTool}, refusing to abandon ${context.bond} when a magistrate ordered silence. ${pronounSubject} still ${selectVerb(pronouns, "believes", "believe")} ${context.virtue} only breathes when the law bends toward mercy.`;
  },
  "Neutral Good": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} diverted a shipment to feed ${context.bond} after a flood, trading ${context.signatureTool} repairs for loaves. ${pronounSubject} still ${selectVerb(pronouns, "weighs", "weigh")} that night as proof that quiet kindness outruns protocol.`;
  },
  "Chaotic Good": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} broke a curfew bell with ${context.signatureTool} so refugees could slip through the gate, laughing when fines rained down. ${pronounSubject} still ${selectVerb(pronouns, "grins", "grin")} at the scar and ${selectVerb(pronouns, "calls", "call")} it ${context.virtue} with teeth.`;
  },
  "Lawful Neutral": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} once enforced a tribunal verdict against ${context.bond}, polishing ${context.signatureTool} until the hall doors opened. ${pronounSubject} still ${selectVerb(pronouns, "studies", "study")} the paperwork, reminding ${pronouns.object} that order is only honest when questioned.`;
  },
  "True Neutral": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} weighed a smugglers' tithe against a flooded granary and split the haul, recording both debts beside ${context.signatureTool}. ${pronounSubject} still ${selectVerb(pronouns, "keeps", "keep")} the ledger open to that page in case the balance tilts again.`;
  },
  "Chaotic Neutral": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} vanished from duty to chase a rumor tied to ${context.backstorySeed}, trusting ${context.signatureTool} to talk through any fallout. ${pronounSubject} still ${selectVerb(pronouns, "shrugs", "shrug")} at the reprimand and ${selectVerb(pronouns, "calls", "call")} freedom the only honest compass.`;
  },
  "Lawful Evil": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} doctored warrants with ${context.signatureTool}, binding rivals to crushing debts in the name of stability. ${pronounSubject} still ${selectVerb(pronouns, "tallies", "tally")} the profits beside ${context.bond}, certain that dominance is just another clause.`;
  },
  "Neutral Evil": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} sold a patrol route for coin, financing personal schemes with ${context.signatureTool} tucked beneath a cloak. ${pronounSubject} still ${selectVerb(pronouns, "calls", "call")} it pragmatism and lets ${context.flaw} masquerade as foresight.`;
  },
  "Chaotic Evil": (context, pronouns, shortName) => {
    const subject = shortName || capitalize(pronouns.subject);
    const pronounSubject = capitalize(pronouns.subject);
    return `${subject} carved threats into dock pilings with ${context.signatureTool}, daring ${context.bond} to defy the new order. ${pronounSubject} still ${selectVerb(pronouns, "enjoys", "enjoy")} how fear eclipsed caution and wears ${context.flaw} like armor.`;
  },
};

function createAlignmentReflection(context, pronouns, shortName) {
  const builder = ALIGNMENT_REFLECTION_BUILDERS[context.alignment] || ((ctx, pr, sn) => {
    const subject = sn || capitalize(pr.subject);
    const pronounSubject = capitalize(pr.subject);
    return `${subject} brokered a quiet favor using ${ctx.signatureTool}, weighing ${ctx.virtue} against ${ctx.flaw}. ${pronounSubject} still ${selectVerb(pr, "replays", "replay")} the choice whenever whispers of ${ctx.backstorySeed} return.`;
  });
  return builder(context, pronouns, shortName);
}

function createLingeringRumor(context, pronouns, shortName) {
  const subject = shortName || capitalize(pronouns.subject);
  const pronounSubject = capitalize(pronouns.subject);
  return `Rumors still coil around ${context.backstorySeed}, tucked where ${subject} trusted ${pronouns.possessive} ${context.signatureTool} to hide a promise. ${pronounSubject} still ${selectVerb(pronouns, "wonders", "wonder")} if naming ${context.secret} would heal ${context.bond} or scatter ${context.virtue}.`;
}

function postProcessParagraphs(paragraphs, context) {
  if (!Array.isArray(paragraphs)) return [];
  let processed = paragraphs.slice();
  if (processed.length > 4) {
    const kept = processed.slice(0, 3);
    const merged = processed.slice(3).join(" ").trim();
    if (merged) kept.push(merged);
    processed = kept;
  }
  processed = capClassTokenUsage(processed, context.className);
  return processed.filter(Boolean);
}

function resolveRaceCadenceTemplate(backstory, character) {
  const race = character?.race;
  if (!race) return backstory?.raceCadence || "";
  const className = character?.class;
  const cadences = backstory?.raceCadences;
  if (cadences && typeof cadences === "object") {
    const directKey = race in cadences ? race : Object.keys(cadences).find(key => key.toLowerCase() === race.toLowerCase());
    const direct = directKey ? cadences[directKey] : undefined;
    if (typeof direct === "string") return direct;
    if (direct && typeof direct === "object") {
      if (className && direct[className]) return direct[className];
      if (className) {
        const classKey = Object.keys(direct).find(key => key.toLowerCase() === className.toLowerCase());
        if (classKey) return direct[classKey];
      }
      if (direct.default) return direct.default;
    }
  }
  return getRaceCadenceTemplate(race, className);
}

function resolveRaceCadence(backstory, character, overrides = {}) {
  const template = resolveRaceCadenceTemplate(backstory, character);
  if (!template) return "";
  const contextOverrides = { ...overrides };
  delete contextOverrides.raceCadence;
  return renderBackstoryTextForCharacter(template, character, contextOverrides);
}

function coalesce(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}

const CLASS_DISCIPLINE_RULES = [
  { key: "maritime", patterns: [/pirate/i, /corsair/i, /raider/i, /sailor/i, /captain/i, /navigator/i, /boatswain/i, /privateer/i, /harpoon/i] },
  { key: "scholar", patterns: [/wizard/i, /mage/i, /sorcerer/i, /sage/i, /scholar/i, /alchemist/i, /artificer/i, /engineer/i, /scribe/i, /arcanist/i, /psion/i, /loremaster/i, /occultist/i, /chronomancer/i] },
  { key: "devout", patterns: [/cleric/i, /priest/i, /acolyte/i, /oracle/i, /templar/i, /monk/i, /paladin/i, /inquisitor/i, /prophet/i, /cantor/i] },
  { key: "outdoors", patterns: [/ranger/i, /scout/i, /hunter/i, /tracker/i, /pathfinder/i, /druid/i, /forager/i, /warden/i, /nomad/i] },
  { key: "rogue", patterns: [/rogue/i, /thief/i, /assassin/i, /smuggler/i, /spy/i, /shadow/i, /cutpurse/i, /swashbuckler/i, /trickster/i, /vagabond/i, /bard/i] },
  { key: "martial", patterns: [/fighter/i, /warrior/i, /barbarian/i, /knight/i, /samurai/i, /soldier/i, /guardian/i, /mercenary/i, /legion/i, /berserker/i, /champion/i, /gladiator/i, /sentinel/i, /duelist/i, /lancer/i] },
  { key: "artisan", patterns: [/artisan/i, /smith/i, /brewer/i, /cook/i, /craft/i, /tinker/i, /wright/i, /mason/i, /herbalist/i, /apothecary/i, /alchemist/i] },
];

const BACKSTORY_HOOK_LIBRARY = {
  backstory_waves_break_tideward_1: {
    label: "Harbor Archivist",
    defaultDistrict: "Greensoul Hill",
    baseHookDetail: "keeping the watch on speaking terms with the Tidewall bells",
    baseDistrictFlair: "weathered seawalls and lantern masts rattling above the quay",
    baseExtras: [
      "Neighbors still call {shortName} the {hook} whenever a squall leans against the harbor gates.",
    ],
    disciplineFlavors: {
      maritime: {
        district: "Port District",
        hookDetail: "reading tide boards aloud for skippers whenever the sky turned iron",
        districtFlair: "lantern-strung docks where crews trade weather wagers",
        extra: [
          "Dock captains still slip {shortName} salt-stained charts, trusting the {hook} more than any brass barometer.",
        ],
      },
      scholar: {
        district: "Upper Ward",
        hookDetail: "decoding the Tidewall's ciphered ledgers faster than the vault archivists",
        districtFlair: "observatory balconies humming with brass tide instruments",
        extra: [
          "Archivists summon the {hook} whenever a navigational proof refuses tidy arithmetic.",
        ],
      },
      martial: {
        district: "Greensoul Hill",
        hookDetail: "drilling signal crews until patrols could march by the bells alone",
        districtFlair: "garrison yards and signal horns echoing over the ridge",
        replacements: [
          { pattern: /tide charts/gi, replace: "patrol rotations" },
          { pattern: /guild ledgers/gi, replace: "watch rosters" },
        ],
        extra: [
          "Sergeants still mutter that the {hook} feels a weather turn before the horns sound.",
        ],
      },
      rogue: {
        district: "Port District",
        hookDetail: "timing smugglers' lantern codes so the watch always missed the handoff",
        districtFlair: "shadowed piers trading in half-whistled passwords",
        replacements: [
          { pattern: /tide charts/gi, replace: "smugglers' lantern codes" },
          { pattern: /guild ledgers/gi, replace: "ledger margins where bribes lived" },
        ],
        extra: [
          "Fence brokers whisper that the {hook} can hear a false harbor bell a street away.",
        ],
      },
      outdoors: {
        district: "Port District",
        hookDetail: "plotting tides for marsh scouts slipping between patrol routes",
        districtFlair: "bog-sweet breezes rolling over the harbor wetlands",
        replacements: [{ pattern: /tide charts/gi, replace: "tide crossings" }],
        extra: [
          "Wardens swear the {hook} can sense a riptide before ${pronoun.subject} even sees whitecaps on the bay.",
        ],
      },
      artisan: {
        district: "Greensoul Hill",
        hookDetail: "keeping harbor scribes honest about which bells the watch should obey",
        districtFlair: "stone terraces where patrol flags snap in the saltwind",
        replacements: [
          { pattern: /tide charts/gi, replace: "watch schedules" },
          { pattern: /guild ledgers/gi, replace: "dockyard ledgers" },
        ],
      },
      default: {
        district: "Greensoul Hill",
        hookDetail: "keeping harbor scribes honest about which bells the watch should obey",
        districtFlair: "stone terraces where patrol flags snap in the saltwind",
        replacements: [
          { pattern: /tide charts/gi, replace: "watch schedules" },
          { pattern: /guild ledgers/gi, replace: "city ledgers" },
        ],
      },
    },
  },
  backstory_coral_keep_athenaeum_1: {
    label: "Athenaeum Scholar",
    defaultDistrict: "The South Docks & Steel Docks",
    baseHookDetail: "keeping the Auric stacks aligned with every edict from the crown",
    baseDistrictFlair: "crystal spires reflecting sea-light into the study halls",
    baseExtras: [
      "The Auric Athenaeum staff still defer to the {hook} when research drifts toward the forbidden stacks.",
    ],
    disciplineFlavors: {
      scholar: {
        district: "The South Docks & Steel Docks",
        hookDetail: "deciphering doctrine for battlemages stationed above the docks",
        districtFlair: "armored cloisters ringing with chimes and lecture bells",
        extra: [
          "Students race to reserve a desk when the {hook} promises to annotate a lecture.",
        ],
      },
      martial: {
        district: "The Military Ward",
        hookDetail: "translating battle diagrams into drills the garrison could actually execute",
        districtFlair: "marching courts lined with etched tactical reliefs",
        replacements: [
          { pattern: /lecture balconies/gi, replace: "drill terraces" },
          { pattern: /archivists/gi, replace: "tacticians" },
          { pattern: /Auric Athenaeum/gi, replace: "Auric war archives" },
        ],
        extra: [
          "Commanders keep the {hook} on retainer whenever campaign briefs threaten to drown in jargon.",
        ],
      },
      maritime: {
        district: "The South Docks & Steel Docks",
        hookDetail: "indexing shipwright schematics so flotillas could launch on dawn's first bell",
        districtFlair: "forge piers where hammer-sparks mingle with harbor mist",
        replacements: [
          { pattern: /lecture balconies/gi, replace: "shipwright gantries" },
          { pattern: /archivists/gi, replace: "dockmasters" },
        ],
        extra: [
          "Dock engineers still haul the {hook} to drydocks when a hull problem needs someone who can quote the archives.",
        ],
      },
      rogue: {
        district: "The South Docks & Steel Docks",
        hookDetail: "slipping embargoed treatises to information brokers before the censor could blink",
        districtFlair: "sealed basements trading in coded theses and contraband schematics",
        replacements: [
          { pattern: /archivists/gi, replace: "scribes and whisper brokers" },
        ],
        extra: [
          "Informants whisper that the {hook} can find a redacted line faster than any royal inspector.",
        ],
      },
      devout: {
        district: "The Military Ward",
        hookDetail: "balancing doctrine scrolls with field liturgies for the chaplain corps",
        districtFlair: "incense-laced chapels tucked beneath the Athenaeum's cloisters",
        replacements: [
          { pattern: /archivists/gi, replace: "chaplains" },
        ],
        extra: [
          "Procession leaders still consult the {hook} when a sermon must march in lockstep with the guard.",
        ],
      },
      outdoors: {
        district: "The South Docks & Steel Docks",
        hookDetail: "charting wind drafts so gryphon scouts could ride the thermals cleanly",
        districtFlair: "skybridges lashed with signal flags over the steelworks",
        replacements: [
          { pattern: /lecture balconies/gi, replace: "skybridges" },
        ],
      },
      artisan: {
        district: "The South Docks & Steel Docks",
        hookDetail: "calibrating furnace diagrams for armorers who never set foot in the archive",
        districtFlair: "heat-hazed halls stacked with etched steel tablets",
        replacements: [
          { pattern: /archivists/gi, replace: "guild scribes" },
        ],
      },
      default: {
        district: "The South Docks & Steel Docks",
        hookDetail: "keeping civic decrees synchronized with the Athenaeum ledgers",
        districtFlair: "crystal towers mirrored in the tidal flats",
      },
    },
  },
  backstory_warm_springs_forge_1: {
    label: "Steamward Acolyte",
    defaultDistrict: "Shrine Terrace",
    baseHookDetail: "tending the vents that keep the terraces from boiling over",
    baseDistrictFlair: "mineral clouds curling through prayer gardens",
    baseExtras: [
      "Pilgrims still trust the {hook} to judge when the springs can spare another blessing.",
    ],
    disciplineFlavors: {
      devout: {
        district: "Shrine Terrace",
        hookDetail: "leading sunrise liturgies timed to the breath of the vents",
        districtFlair: "stone basins ringing as geysers answer each hymn",
        extra: [
          "Temple elders save the most delicate rites for the {hook}'s steady cadence.",
        ],
      },
      artisan: {
        district: "Steamward Market",
        hookDetail: "channeling steamflow to keep forge hammers and bathhouses balanced",
        districtFlair: "coilwork stalls dripping with condensed heat",
        replacements: [
          { pattern: /hymns/gi, replace: "work songs" },
          { pattern: /chants/gi, replace: "hammer rhythms" },
        ],
        extra: [
          "Guild ventmasters still offer the {hook} first pick of alloy orders when pressures spike.",
        ],
      },
      martial: {
        district: "Steamward Market",
        hookDetail: "cycling the barracks baths so soldiers marched out limbered and ready",
        districtFlair: "training yards rimmed with steaming troughs",
        replacements: [
          { pattern: /chants/gi, replace: "drills" },
          { pattern: /Temple elders/gi, replace: "Watch captains" },
        ],
        extra: [
          "Captains still ask the {hook} to pace recovery shifts between long campaigns.",
        ],
      },
      scholar: {
        district: "Shrine Terrace",
        hookDetail: "noting mineral compositions so healers could prescribe the right steam",
        districtFlair: "ledgered baths catalogued by alchemical sigils",
        replacements: [
          { pattern: /chants/gi, replace: "recitations" },
        ],
        extra: [
          "Herbalists court the {hook} for data whenever a new infusion is tested.",
        ],
      },
      rogue: {
        district: "Steamward Market",
        hookDetail: "guiding clandestine meetings through fog-thick alleys without a single watcher noticing",
        districtFlair: "steam-veiled stalls where whispers travel faster than coin",
        replacements: [
          { pattern: /chants/gi, replace: "signals" },
        ],
        extra: [
          "Couriers swear the {hook} can vanish into a plume before a guard even coughs.",
        ],
      },
      outdoors: {
        district: "Shrine Terrace",
        hookDetail: "reading the terraces' mineral bloom to predict how the valley breathes",
        districtFlair: "terraced pools overflowing into fern-fed ravines",
      },
      default: {
        district: "Shrine Terrace",
        hookDetail: "keeping the geysers steady enough that merchants and pilgrims both felt welcome",
        districtFlair: "stone colonnades awash in warm mist",
      },
    },
  },
  backstory_creekside_whisper_1: {
    label: "Canal Whisper",
    defaultDistrict: "Perfumer's Row",
    baseHookDetail: "keeping shrineboats trading in favors instead of coin",
    baseDistrictFlair: "night-blooming jasmine threading every canal",
    baseExtras: [
      "Boatmen still drop their oars when the {hook} raises a hand along the quay.",
    ],
    disciplineFlavors: {
      rogue: {
        district: "Lantern Quay",
        hookDetail: "trading coded knocks that kept the canal peace stitched together",
        districtFlair: "lantern-lit barges drifting between painted shrines",
        extra: [
          "Canal wardens whisper that the {hook} can name who crossed a bridge simply from the ripples left behind.",
        ],
      },
      artisan: {
        district: "Perfumer's Row",
        hookDetail: "matching scent shipments with the river's moods so nothing spoiled",
        districtFlair: "hanging distilleries fogging the alleys with exotic notes",
        replacements: [
          { pattern: /reed flutes/gi, replace: "glass stills" },
          { pattern: /spirits who preferred wit over coin/gi, replace: "merchants who trusted craft over coin" },
        ],
        extra: [
          "Perfumers still press sealed phials into the {hook}'s hands before festival nights.",
        ],
      },
      scholar: {
        district: "Riddle-Market Canals",
        hookDetail: "mapping rumor routes through the canals faster than any courier",
        districtFlair: "question-sellers debating beside puzzle bridges",
        replacements: [
          { pattern: /reed flutes/gi, replace: "cipher wheels" },
        ],
        extra: [
          "Archivists send riddles downstream just to see how the {hook} will answer.",
        ],
      },
      devout: {
        district: "Lantern Quay",
        hookDetail: "leading vigil boats through moonlit offerings without disturbing a single ripple",
        districtFlair: "glow-shrines mirrored in the blackwater",
        replacements: [
          { pattern: /spirits who preferred wit over coin/gi, replace: "river spirits who favored humble prayers" },
        ],
        extra: [
          "Priests still ask the {hook} to set the pace whenever a procession leaves the quay.",
        ],
      },
      outdoors: {
        district: "Riddle-Market Canals",
        hookDetail: "charting reed mazes that smugglers and wardens both rely on",
        districtFlair: "fog-silk rafts gliding between willow shadows",
        extra: [
          "River scouts swear the {hook} can read the current like a book margin.",
        ],
      },
      maritime: {
        district: "Lantern Quay",
        hookDetail: "teaching barge crews which eddies will flip a keel in storm season",
        districtFlair: "mossy pilings studded with carved warding charms",
        extra: [
          "Pilots still tap the {hook}'s shoulder before dawn departures.",
        ],
      },
      default: {
        district: "Perfumer's Row",
        hookDetail: "keeping the canal's many favors ledgered in whispers instead of ink",
        districtFlair: "hushed arcades draped in festival silks",
      },
    },
  },
};

function detectCharacterDiscipline(character = {}) {
  const parts = [character.class, character.background, character.profession, character.occupation]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (!parts) return "default";
  for (const rule of CLASS_DISCIPLINE_RULES) {
    if (rule.patterns.some(pattern => pattern.test(parts))) {
      return rule.key;
    }
  }
  return "default";
}

function applyHookReplacements(paragraphs = [], replacements = []) {
  if (!Array.isArray(paragraphs) || !Array.isArray(replacements) || !replacements.length) {
    return paragraphs;
  }
  return paragraphs.map((text, index, all) => {
    let updated = text;
    for (const entry of replacements) {
      if (!entry?.pattern) continue;
      const target = entry.target || "all";
      if (target === "first" && index !== 0) continue;
      if (target === "last" && index !== all.length - 1) continue;
      updated = updated.replace(entry.pattern, entry.replace);
    }
    return updated;
  });
}

function buildHookPersonalization({
  paragraphs,
  hookConfig,
  flavor,
  character,
  overrides,
}) {
  if (!hookConfig) {
    return { paragraphs, hookDetail: undefined, districtFlair: undefined };
  }
  const applied = applyHookReplacements(paragraphs, [
    ...(hookConfig.commonReplacements || []),
    ...((flavor && flavor.replacements) || []),
  ]);

  const hookDetail = flavor?.hookDetail || hookConfig.baseHookDetail || overrides.hookDetail;
  const districtFlair = flavor?.districtFlair || hookConfig.baseDistrictFlair || overrides.districtFlair;
  const extras = [
    ...((hookConfig.baseExtras || [])),
    ...((flavor && flavor.extra) || []),
  ];
  if (extras.length) {
    const extraContext = {
      ...overrides,
      hook: flavor?.label || hookConfig.label,
      hookDetail,
      districtFlair,
    };
    const renderedExtras = extras
      .map(template => renderBackstoryTextForCharacter(template, character, extraContext))
      .filter(Boolean)
      .join(" ");
    if (renderedExtras) {
      applied[0] = `${applied[0]} ${renderedExtras}`.replace(/\s+/g, " ").trim();
    }
  }
  return { paragraphs: applied, hookDetail, districtFlair };
}

function determineIsGroupEntity(character = {}, overrides = {}) {
  if (overrides?.isGroup !== undefined) return Boolean(overrides.isGroup);
  if (overrides?.isPlural !== undefined) return Boolean(overrides.isPlural);
  if (overrides?.pluralEntity !== undefined) return Boolean(overrides.pluralEntity);
  if (character?.isGroup !== undefined) return Boolean(character.isGroup);
  if (character?.isPlural !== undefined) return Boolean(character.isPlural);
  if (character?.pluralEntity !== undefined) return Boolean(character.pluralEntity);
  if (typeof overrides?.groupSize === "number") return overrides.groupSize > 1;
  if (typeof character?.groupSize === "number") return character.groupSize > 1;
  if (typeof overrides?.partySize === "number") return overrides.partySize > 1;
  if (typeof character?.partySize === "number") return character.partySize > 1;
  if (Array.isArray(overrides?.members) && overrides.members.length > 1) return true;
  if (Array.isArray(character?.members) && character.members.length > 1) return true;
  if (Array.isArray(character?.party) && character.party.length > 1) return true;
  if (Array.isArray(character?.squad) && character.squad.length > 1) return true;
  return false;
}

export function renderBackstoryTextForCharacter(text, character, overrides = {}) {
  if (!text) return "";
  const narrative = gatherNarrativeDefaults(character, overrides);
  const homeTown =
    coalesce(
      overrides.homeTown,
      overrides.hometown,
      character?.homeTown,
      character?.hometown,
      overrides.originLocation,
      character?.originLocation
    ) || character?.location;
  const familyName = coalesce(overrides.familyName, overrides.family_name, character?.familyName);
  const mentorName = coalesce(overrides.mentorName, overrides.mentor_name, character?.mentorName);
  const profession = coalesce(
    overrides.profession,
    overrides.occupation,
    character?.profession,
    character?.occupation
  );
  const notableEvent = coalesce(
    overrides.notableEvent,
    overrides.notable_event,
    character?.notableEvent,
    character?.notable_event
  );
  const groupName = coalesce(
    overrides.groupName,
    overrides.group_name,
    character?.groupName,
    character?.group_name,
    character?.collectiveName
  );
  const hookLabel = coalesce(overrides.hook, character?.hook, character?.backstory?.hook);
  const hookDetail = coalesce(
    overrides.hookDetail,
    overrides.hook_detail,
    character?.hookDetail,
    character?.hook_detail,
    character?.backstory?.hookDetail
  );
  const districtFlair = coalesce(
    overrides.districtFlair,
    overrides.district_flair,
    character?.districtFlair,
    character?.district_flair,
    character?.backstory?.districtFlair
  );
  const disciplineTag = coalesce(
    overrides.disciplineTag,
    overrides.discipline_tag,
    character?.disciplineTag,
    character?.discipline_tag,
    character?.backstory?.disciplineTag
  );
  const isGroupEntity = determineIsGroupEntity(character, overrides);
  const context = {
    characterName: character?.name,
    name: character?.name,
    race: character?.race,
    className: character?.class,
    class: character?.class,
    alignment: character?.alignment,
    location: character?.location,
    originLocation: homeTown || character?.location,
    homeTown,
    hometown: homeTown,
    sex: character?.sex,
    gender: character?.sex,
    spawnDistrict:
      overrides.spawnDistrict || character?.spawnDistrict || character?.backstory?.spawnDistrict,
    shortName: narrative.shortName,
    short_name: narrative.shortName,
    voiceTone: narrative.voiceTone,
    signatureTool: narrative.signatureTool,
    virtue: narrative.virtue,
    flaw: narrative.flaw,
    bond: narrative.bond,
    secret: narrative.secret,
    backstorySeed: narrative.backstorySeed,
    familyName,
    family_name: familyName,
    mentorName,
    mentor_name: mentorName,
    profession,
    occupation: profession,
    notableEvent,
    notable_event: notableEvent,
    groupName,
    group_name: groupName,
    hook: hookLabel,
    hookDetail,
    hook_detail: hookDetail,
    districtFlair,
    district_flair: districtFlair,
    disciplineTag,
    discipline_tag: disciplineTag,
    isGroup: isGroupEntity,
    isPluralEntity: overrides.isPluralEntity ?? character?.isPluralEntity ?? isGroupEntity,
    groupSize: overrides.groupSize ?? character?.groupSize,
    raceCadence: overrides.raceCadence || character?.raceCadence,
    trainingPhilosophy: overrides.trainingPhilosophy || character?.trainingPhilosophy,
    alignmentReflection: overrides.alignmentReflection || character?.alignmentReflection,
    rumorEcho: overrides.rumorEcho || character?.rumorEcho,
  };
  Object.assign(context, overrides);
  return renderBackstoryString(text, context);
}

export function buildBackstoryInstance(backstory, character) {
  if (!backstory) return null;
  const hookConfig = BACKSTORY_HOOK_LIBRARY[backstory.id];
  const discipline = detectCharacterDiscipline(character);
  const flavor =
    hookConfig?.disciplineFlavors?.[discipline] ||
    hookConfig?.disciplineFlavors?.default ||
    null;
  const availableDistricts = Array.isArray(backstory?.spawnDistricts)
    ? backstory.spawnDistricts.filter(Boolean)
    : [];
  let spawnDistrict =
    flavor?.district ||
    character?.spawnDistrict ||
    availableDistricts[0] ||
    "";
  const narrativeDefaults = gatherNarrativeDefaults(character, { spawnDistrict });
  const pronouns = getPronouns(character?.sex);
  const requiredReady = hasRequiredBackstoryInputs(character);

  let hookLabel = flavor?.label || hookConfig?.label || "";
  let hookDetail = flavor?.hookDetail || hookConfig?.baseHookDetail || "";
  let districtFlair = flavor?.districtFlair || hookConfig?.baseDistrictFlair || "";
  let disciplineTag = flavor?.disciplineTag || discipline;

  const baseOverrides = {
    spawnDistrict,
    shortName: narrativeDefaults.shortName,
    voiceTone: narrativeDefaults.voiceTone,
    signatureTool: narrativeDefaults.signatureTool,
    virtue: narrativeDefaults.virtue,
    flaw: narrativeDefaults.flaw,
    bond: narrativeDefaults.bond,
    secret: narrativeDefaults.secret,
    backstorySeed: narrativeDefaults.backstorySeed,
    hook: hookLabel,
    hookDetail,
    districtFlair,
    disciplineTag,
  };

  let raceCadence = "";
  let trainingPhilosophy = "";
  let alignmentReflection = "";
  let rumorEcho = "";
  let biographyParagraphs = [];

  if (requiredReady) {
    raceCadence = resolveRaceCadence(backstory, character, baseOverrides);
    trainingPhilosophy = buildClassPhilosophy(
      character?.race,
      character?.class,
      narrativeDefaults.signatureTool,
      pronouns,
      narrativeDefaults.shortName
    );

    const alignmentContext = {
      ...narrativeDefaults,
      alignment: character?.alignment,
      spawnDistrict,
    };
    alignmentReflection = createAlignmentReflection(alignmentContext, pronouns, narrativeDefaults.shortName);
    rumorEcho = createLingeringRumor(alignmentContext, pronouns, narrativeDefaults.shortName);

    const sharedOverrides = {
      ...baseOverrides,
      raceCadence,
      trainingPhilosophy,
      alignmentReflection,
      rumorEcho,
    };

    const beats = backstory.biographyBeats || {};
    const combineBeat = (beat, ...additional) => {
      const rendered = renderBackstoryTextForCharacter(beat, character, sharedOverrides);
      return [rendered, ...additional]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    };

    biographyParagraphs = [
      combineBeat(beats.earlyLife),
      combineBeat(beats.training, raceCadence, trainingPhilosophy),
      combineBeat(beats.moralTest, alignmentReflection),
      combineBeat(beats.lingeringRumor, rumorEcho),
    ];

    const personalization = buildHookPersonalization({
      paragraphs: biographyParagraphs,
      hookConfig,
      flavor,
      character,
      overrides: sharedOverrides,
    });
    biographyParagraphs = personalization.paragraphs;
    if (personalization.hookDetail) hookDetail = personalization.hookDetail;
    if (personalization.districtFlair) districtFlair = personalization.districtFlair;
    sharedOverrides.hookDetail = hookDetail;
    sharedOverrides.districtFlair = districtFlair;
    baseOverrides.hookDetail = hookDetail;
    baseOverrides.districtFlair = districtFlair;

    biographyParagraphs = postProcessParagraphs(biographyParagraphs, {
      fullName: character?.name,
      shortName: narrativeDefaults.shortName,
      pronouns,
      className: character?.class,
    });
  } else {
    biographyParagraphs = [
      "Backstory locked: select race, sex, class, alignment, and origin location to reveal a tailored biography.",
    ];
  }

  const renderOverrides = {
    ...baseOverrides,
    raceCadence,
    trainingPhilosophy,
    alignmentReflection,
    rumorEcho,
  };

  const biography = biographyParagraphs.join("\n\n");
  return {
    id: backstory.id,
    title: renderBackstoryTextForCharacter(backstory.title, character, renderOverrides),
    characterName: renderBackstoryTextForCharacter(backstory.characterName, character, renderOverrides),
    race: renderBackstoryTextForCharacter(backstory.race, character, renderOverrides) || "",
    class: renderBackstoryTextForCharacter(backstory.class, character, renderOverrides) || "",
    alignment: renderBackstoryTextForCharacter(backstory.alignment, character, renderOverrides) || "",
    availableIn: [...(backstory.availableIn || [])],
    biography,
    biographyParagraphs,
    spawnDistrict,
    hook: hookLabel,
    hookDetail,
    districtFlair,
    disciplineTag,
    raceCadence,
    trainingPhilosophy,
    alignmentReflection,
    rumorEcho,
  };
}

export function applyBackstoryLoadout(character, backstory, options = {}) {
  if (!character || !backstory) return character;
  if (options.reset) {
    delete character.backstory;
    delete character.backstoryId;
    delete character.raceDescription;
    delete character.classAlignmentInsert;
    delete character.alignmentMemory;
    delete character.emberHook;
    delete character.classAngleSummary;
    delete character.raceCadence;
    delete character.trainingPhilosophy;
    delete character.alignmentReflection;
    delete character.rumorEcho;
  }
  const districts = Array.isArray(backstory.spawnDistricts) ? backstory.spawnDistricts.filter(Boolean) : [];
  if (districts.length) {
    const existing = character.spawnDistrict;
    const lowerExisting = existing ? existing.toLowerCase() : null;
    const matched = lowerExisting
      ? districts.find(district => district.toLowerCase() === lowerExisting)
      : null;
    if (matched) {
      character.spawnDistrict = matched;
    } else {
      const index = Math.floor(Math.random() * districts.length);
      character.spawnDistrict = districts[index];
    }
  } else if (options.reset) {
    delete character.spawnDistrict;
  }
  const instance = buildBackstoryInstance(backstory, character);
  character.backstoryId = backstory.id;
  character.backstory = instance;
  if (instance) {
    character.raceCadence = instance.raceCadence;
    character.trainingPhilosophy = instance.trainingPhilosophy;
    character.alignmentReflection = instance.alignmentReflection;
    character.rumorEcho = instance.rumorEcho;
    character.hook = instance.hook;
    character.hookDetail = instance.hookDetail;
    character.districtFlair = instance.districtFlair;
    character.disciplineTag = instance.disciplineTag;
  }
  return character;
}

export function ensureBackstoryInstance(character) {
  if (!character) return null;
  if (character.backstory && typeof character.backstory === "object" && character.backstory.id) {
    character.backstoryId = character.backstory.id;
    return character.backstory;
  }

  if (character.backstoryId) {
    const match = BACKSTORY_BY_ID[character.backstoryId];
    if (match) {
      character.backstory = buildBackstoryInstance(match, character);
      return character.backstory;
    }
  }

  return null;
}

export function resolveBackstoryById(id) {
  return BACKSTORY_BY_ID[id] || null;
}

export function resolveLegacyBackstory() {
  return null;
}

export function getBackstoriesForLocation(location, criteria = {}) {
  const primary = getBackstoriesByCriteria({
    location,
    race: criteria.race,
    className: criteria.className,
    alignment: criteria.alignment,
  });
  if (primary.length || (!criteria.race && !criteria.className && !criteria.alignment)) {
    return primary;
  }
  return getBackstoriesByCriteria({ location });
}
