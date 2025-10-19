import { getPronouns } from "../data/game/backstories.js";
import { LOCATIONS } from "../data/game/locations.js";
import { getAnglesForRaceClass } from "../data/game/race_class_angles.js";

function computeShortName(name) {
  if (!name) return "";
  const trimmed = name.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/);
  return parts[0] || trimmed;
}

function capitalize(value = "") {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function sentenceCase(value = "") {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function unique(values = []) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

function normalizeDistrictKey(district) {
  return district ? district.toLowerCase() : "";
}

function findDistrictNotes(location, district) {
  if (!location || !district) return "";
  const districts = location.population?.districts;
  if (!districts) return "";
  const lower = district.toLowerCase();
  for (const [key, info] of Object.entries(districts)) {
    if (key.toLowerCase() === lower) {
      return typeof info?.notes === "string" ? info.notes : "";
    }
  }
  return "";
}

function summarizeDistrictCommunity(notes) {
  if (!notes) return "";
  const tokens = notes
    .split(/[,;&]/)
    .map(part => part.trim())
    .filter(Boolean);
  if (!tokens.length) return "";
  if (tokens.length === 1) return tokens[0];
  const [first, second] = tokens;
  if (!second) return first;
  return `${first} and ${second}`;
}

function detectLocationThemes(description = "") {
  if (!description) return [];
  const lower = description.toLowerCase();
  const themes = [];
  const checks = [
    { pattern: /(sea|harbor|harbour|port|tide|ship|fleet|coast|quay)/, phrase: "salt wind carrying work songs between piers" },
    { pattern: /(mountain|peak|ridge|cliff|slope)/, phrase: "shadow of serrated ridges pressed close" },
    { pattern: /(forest|grove|wood|pine|timber|thicket)/, phrase: "resin-sweet air rolling off the woods" },
    { pattern: /(river|canal|delta|lock|sluice|marsh|wetland|barge)/, phrase: "water traffic measuring the hours" },
    { pattern: /(desert|dune|sand|oasis)/, phrase: "wind-scoured avenues humming with grit" },
    { pattern: /(capital|crown|palace|court|royal)/, phrase: "crown heralds watching every procession" },
    { pattern: /(forge|smith|anvil|ore|mine)/, phrase: "forge-light turning faces bronze by dusk" },
    { pattern: /(library|scholar|archive|academy|lecture)/, phrase: "lectures spilling through open colonnades" },
    { pattern: /(market|trade|merchant|guild|bazaar)/, phrase: "bargaining voices weaving through market rows" },
    { pattern: /(temple|shrine|priest|altar|incense)/, phrase: "incense drifting from shrine doors" },
    { pattern: /(field|farm|pasture|grain|harvest)/, phrase: "carts of produce rumbling over the paving" },
  ];
  for (const entry of checks) {
    if (entry.pattern.test(lower)) themes.push(entry.phrase);
  }
  return themes;
}

function selectPointsOfInterest(location, district) {
  const buildings = Array.isArray(location?.pointsOfInterest?.buildings)
    ? location.pointsOfInterest.buildings
    : [];
  if (!buildings.length) return [];
  const lowerDistrict = normalizeDistrictKey(district);
  const prioritized = [];
  if (lowerDistrict) {
    const matched = buildings.find(building => building.toLowerCase().includes(lowerDistrict.split(/\s+/)[0]));
    if (matched) prioritized.push(matched);
  }
  const guild = buildings.find(building => /guild|hall|exchange|library|temple|inn|house/i.test(building));
  if (guild) prioritized.push(guild);
  prioritized.push(buildings[0]);
  return unique(prioritized);
}

function craftEarlyLifeParagraph(context) {
  const { name, shortName, locationName, district, pronouns, background } = context;
  const location = LOCATIONS[locationName];
  const description = typeof location?.description === "string" ? location.description : "";
  const themes = detectLocationThemes(description);
  const communityNotes = summarizeDistrictCommunity(findDistrictNotes(location, district));
  const points = selectPointsOfInterest(location, district);

  const sentences = [];
  const placeLabel = district ? `${district} in ${locationName}` : locationName;
  const themeFragment = themes.length ? `where ${themes[0]}` : "where daily rhythms rarely slowed";
  sentences.push(`${name} grew up in ${placeLabel}, ${themeFragment}.`);
  if (communityNotes) {
    sentences.push(`${capitalize(pronouns.subject)} shared stoops with ${communityNotes}, learning their measure of the day.`);
  }
  if (background) {
    sentences.push(`${capitalize(pronouns.subject)} carried stories of ${background}, letting them temper ${pronouns.possessive} outlook.`);
  }
  if (points.length) {
    sentences.push(`Even childhood errands wound past landmarks like ${points[0]}, sketches ${shortName} still keeps in memory.`);
  }
  return sentences.join(" ");
}

function craftAnglesSentence(angle, pronouns) {
  if (!angle) return "";
  const trimmed = angle.replace(/\.$/, "").trim();
  if (!trimmed) return "";
  return `${sentenceCase(trimmed)} became the ledger of ${pronouns.possessive} progress.`;
}

function craftTrainingParagraph(context) {
  const { shortName, pronouns, race, className, locationName } = context;
  const angles = getAnglesForRaceClass(race, className);
  const sentences = [];
  sentences.push(
    `${capitalize(pronouns.subject)} chased the work that would make ${pronouns.object} a ${className.toLowerCase()}, folding lessons from ${locationName} into each routine.`
  );
  if (angles[0]) sentences.push(craftAnglesSentence(angles[0], pronouns));
  if (angles[1]) sentences.push(`${sentenceCase(angles[1].replace(/\.$/, ""))} reminded ${pronouns.object} that technique mattered more than applause.`);
  if (angles[2]) sentences.push(`${sentenceCase(angles[2].replace(/\.$/, ""))} still guide${pronouns.subject.toLowerCase() === "they" ? "" : "s"} ${pronouns.object} when doubts gather.`);
  if (!angles.length) {
    sentences.push(`${capitalize(pronouns.subject)} stitched together drills from guild yards, turning repetition into instinct.`);
  }
  return sentences.join(" ");
}

const ALIGNMENT_MOTIFS = {
  "Lawful Good": pronouns =>
    `${capitalize(pronouns.subject)} once stood between a magistrate's decree and hungry neighbors, proving that structure can shelter kindness when someone insists on it.`,
  "Neutral Good": pronouns =>
    `${capitalize(pronouns.subject)} bartered favors and quiet help where it mattered, trusting steady generosity more than speeches about order.`,
  "Chaotic Good": pronouns =>
    `${capitalize(pronouns.subject)} broke curfew bells more than once so trapped families could flee, laughing off the fines as the price of doing what felt right.`,
  "Lawful Neutral": pronouns =>
    `${capitalize(pronouns.subject)} kept ledgers balanced even when friends grumbled, convinced that questions should test every rule without tearing it down.`,
  "True Neutral": pronouns =>
    `${capitalize(pronouns.subject)} learned to weigh each choice like a tide table, letting competing truths counterbalance rather than chasing a single banner.`,
  "Chaotic Neutral": pronouns =>
    `${capitalize(pronouns.subject)} trusts whim and gut more than any posted edict, vanishing for days when a rumor smells sharper than duty.`,
  "Lawful Evil": pronouns =>
    `${capitalize(pronouns.subject)} rewrote warrants and terms so rivals paid dearly, treating order as a weapon best wielded with a smile.` ,
  "Neutral Evil": pronouns =>
    `${capitalize(pronouns.subject)} sells secrets to the highest bidder and calls it pragmatism, never fretting over the wreckage left behind.`,
  "Chaotic Evil": pronouns =>
    `${capitalize(pronouns.subject)} delights in the fear that follows a shattered oath, carving threats to remind the city whose appetite rules the night.`,
};

function craftMoralParagraph(context) {
  const { pronouns, alignment } = context;
  const builder = ALIGNMENT_MOTIFS[alignment] || ALIGNMENT_MOTIFS["True Neutral"];
  const reflection = builder(pronouns);
  return `${reflection} ${capitalize(pronouns.subject)} keeps ${pronouns.possessive} own tally of the fallout, never letting easy answers go untested.`;
}

function craftCurrentParagraph(context) {
  const { pronouns, locationName, className, shortName } = context;
  const location = LOCATIONS[locationName];
  const points = selectPointsOfInterest(location, context.district);
  const focus = points[1] || points[0];
  const sentences = [];
  if (focus) {
    sentences.push(`${capitalize(pronouns.subject)} still circles past ${focus} on patrol, measuring the city's breath before committing to any move.`);
  } else {
    sentences.push(`${capitalize(pronouns.subject)} now moves through ${locationName} with the practiced calm of a ${className.toLowerCase()}, eyes open for the next quiet shift in fortune.`);
  }
  sentences.push(`Those who watch ${shortName} closely say ${pronouns.subject.toLowerCase() === "they" ? "they" : pronouns.subject} listen${
    pronouns.subject.toLowerCase() === "they" ? "" : "s"
  } to rumor the way others read charts, waiting for the moment action matters.`);
  return sentences.join(" ");
}

const ALIGNMENT_HOOKS = {
  "Lawful Good": "order-bound guardian with a generous streak",
  "Neutral Good": "quiet helper who trusts deed over decree",
  "Chaotic Good": "rule-breaking savior whose grin hides resolve",
  "Lawful Neutral": "scribe of order who questions every clause",
  "True Neutral": "balance-walker charting tides of consequence",
  "Chaotic Neutral": "restless wanderer who follows curiosity alone",
  "Lawful Evil": "contract-keeper who twists law into leverage",
  "Neutral Evil": "schemer who spends loyalty like coin",
  "Chaotic Evil": "stormfront of appetite with no patience for chains",
};

function buildSummaryHook(context) {
  const { className, alignment, locationName } = context;
  const hook = ALIGNMENT_HOOKS[alignment] || ALIGNMENT_HOOKS["True Neutral"];
  return `A ${className.toLowerCase()} from ${locationName} acting as a ${hook}.`;
}

export function generateNarrativeBiography(character = {}, options = {}) {
  const name = character.name || options.name || "Unknown";
  const shortName = computeShortName(name) || name;
  const race = character.race || options.race || "";
  const className = character.class || options.class || "";
  const alignment = character.alignment || options.alignment || "True Neutral";
  const locationName =
    character.locationOrigin ||
    character.originLocation ||
    character.location ||
    options.locationOrigin ||
    options.originLocation ||
    "Wave's Break";
  const district =
    character.spawnDistrict ||
    character.backstory?.spawnDistrict ||
    options.spawnDistrict ||
    character.district ||
    options.district;
  const background = character.background || options.background || "";
  const gender = character.gender || character.sex || options.gender || options.sex;
  const pronouns = getPronouns(gender);

  const context = {
    name,
    shortName,
    race,
    className,
    alignment,
    locationName,
    district,
    background,
    pronouns,
  };

  const paragraphs = [
    craftEarlyLifeParagraph(context),
    craftTrainingParagraph(context),
    craftMoralParagraph(context),
    craftCurrentParagraph(context),
  ];

  const biography = paragraphs.join("\n\n");
  const header = `${name} — ${race} ${className}, ${alignment} (${locationName})`;
  const summaryHook = buildSummaryHook(context);

  return { header, summaryHook, paragraphs, biography };
}

export default generateNarrativeBiography;
