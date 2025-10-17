// Auto-generated backstory catalog
export interface CurrencyValue {
  copper: number;
  silver: number;
  gold: number;
}

export interface PronounSet {
  subject: string;
  object: string;
  possessive: string;
  possessivePronoun: string;
  reflexive: string;
}

export interface NarrativeBeat {
  summary: string;
  sceneHook?: string;
  obligations?: string[];
  hometown?: string;
  notes?: string[];
}

export interface AppearanceDescriptor {
  summary: string;
  details: string[];
  motifs: string[];
}

export interface LoadoutDescriptor {
  currency: CurrencyValue;
  items: string[];
  equipment: string[];
  skills: string[];
  craftProficiencies?: Record<string, number>;
  gatheringProficiencies?: Record<string, number>;
  combatTraining?: string[];
}

export interface AlignmentBias {
  lawVsChaos: "lawful" | "neutral" | "chaotic";
  goodVsEvil: "good" | "neutral" | "evil";
  notes: string;
}

export interface JobBranching {
  startingRole: string;
  advancement: string[];
  sidePaths: string[];
}

export interface RichBackstory {
  id: string;
  title: string;
  legacyBackgrounds: string[];
  locations: string[];
  origin: NarrativeBeat;
  currentSituation: NarrativeBeat & { sceneHook: string };
  motivation: string[];
  appearance: AppearanceDescriptor;
  themes: string[];
  loadout: LoadoutDescriptor;
  responsibilities: string[];
  defaultClassOptions: string[];
  alignmentBias: AlignmentBias;
  jobBranching: JobBranching;
}

export function getPronouns(sex: string): PronounSet {
  const normalized = sex?.toLowerCase();
  if (normalized === "male" || normalized === "m") {
    return { subject: "he", object: "him", possessive: "his", possessivePronoun: "his", reflexive: "himself" };
  }
  if (normalized === "female" || normalized === "f") {
    return { subject: "she", object: "her", possessive: "her", possessivePronoun: "hers", reflexive: "herself" };
  }
  return { subject: "they", object: "them", possessive: "their", possessivePronoun: "theirs", reflexive: "themself" };
}

export function applyPronouns(template: string, sex: string): string {
  const pronouns = getPronouns(sex);
  return template
    .replace(/\$\{pronoun\.subject\}/g, pronouns.subject)
    .replace(/\$\{pronoun\.object\}/g, pronouns.object)
    .replace(/\$\{pronoun\.possessive\}/g, pronouns.possessive)
    .replace(/\$\{pronoun\.possessivePronoun\}/g, pronouns.possessivePronoun)
    .replace(/\$\{pronoun\.reflexive\}/g, pronouns.reflexive);
}

export function renderBackstoryString(template: string, context: { race?: string; sex?: string }): string {
  if (!template) return "";
  let value = template;
  if (context.race) {
    value = value.replace(/\$\{race\}/g, context.race);
  }
  if (context.sex) {
    value = value.replace(/\$\{sex\}/g, context.sex);
  }
  return applyPronouns(value, context.sex || "unknown");
}

export function parseCurrency(value: string | number | CurrencyValue): CurrencyValue {
  if (typeof value === "object" && value !== null && "copper" in value) {
    return value as CurrencyValue;
  }
  if (typeof value === "number") {
    return { copper: value, silver: 0, gold: 0 };
  }
  const parts = (value || "").toString().trim();
  const result: CurrencyValue = { copper: 0, silver: 0, gold: 0 };
  if (!parts || parts === "0") return result;
  const tokens = parts.split(/\s+/);
  for (let i = 0; i < tokens.length; i += 2) {
    const amount = Number(tokens[i]);
    const unit = tokens[i + 1]?.toLowerCase() || "";
    if (Number.isNaN(amount)) continue;
    if (unit.startsWith("cp")) result.copper += amount;
    else if (unit.startsWith("sp") || unit.startsWith("st")) result.silver += amount;
    else if (unit.startsWith("gp")) result.gold += amount;
  }
  return result;
}

export function currencyToCopper(value: CurrencyValue): number {
  return value.copper + value.silver * 10 + value.gold * 100;
}

export function addCurrency(a: CurrencyValue, b: CurrencyValue): CurrencyValue {
  return { copper: a.copper + b.copper, silver: a.silver + b.silver, gold: a.gold + b.gold };
}

export const BACKSTORIES: RichBackstory[] = [
  {
    "id": "amnesiac-ward",
    "title": "Amnesiac Ward",
    "legacyBackgrounds": [
      "Amnesiac ward"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Awoke in the monastery's healing ward with a scorched pendant and no recollection.",
      "hometown": "Greensoul Hill",
      "notes": []
    },
    "currentSituation": {
      "summary": "You awake in the monastery's healing ward, sunlight warming the shutters while the scent of herbs drifts in. The scorched pendant on your chest is your only belonging, and the monks will ask again at midday if any memories return.",
      "sceneHook": "You awake in the monastery's healing ward, sunlight warming the shutters while the scent of herbs drifts in.",
      "obligations": [
        "Report to Monastery healing ward when dawn bells ring.",
        "Uphold expectations within Greensoul Hill."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn sketching into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Greensoul Hill."
    ],
    "appearance": {
      "summary": "Keeps scorched pendant close as a personal token.",
      "details": [
        "Notable belonging: scorched pendant."
      ],
      "motifs": [
        "scorched pendant"
      ]
    },
    "themes": [
      "sketching",
      "greensoul hill",
      "amnesiac ward"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "scorched pendant"
      ],
      "equipment": [],
      "skills": [
        "sketching"
      ],
      "craftProficiencies": {
        "drawing": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Monastery healing ward when dawn bells ring.",
      "Uphold expectations within Greensoul Hill."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Greensoul Hill"
    },
    "jobBranching": {
      "startingRole": "Amnesiac Ward",
      "advancement": [
        "Amnesiac Ward Veteran",
        "Noted Amnesiac Ward"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "apprentice-alchemist",
    "title": "Apprentice Alchemist",
    "legacyBackgrounds": [
      "Apprentice alchemist"
    ],
    "locations": [
      "Wave's Break",
      "Warm Springs"
    ],
    "origin": {
      "summary": "Taken in by the Emberflask Alchemist, mixes reagents with careful precision.",
      "hometown": "The Lower Gardens",
      "notes": [
        "Taken in by the Warm Springs Alchemists' Hall to brew restorative salves."
      ]
    },
    "currentSituation": {
      "summary": "You wake amid clinking glass on a cot in the Emberflask workshop, fumes from last night's mixtures stinging your nose. A mixing kit and stained gloves lie beside a purse with three silvers; the master demands the morning tonic brewed before the third bell.",
      "sceneHook": "You wake amid clinking glass on a cot in the Emberflask workshop, fumes from last night's mixtures stinging your nose.",
      "obligations": [
        "Report to Emberflask workshop cot when dawn bells ring.",
        "Report to Alchemists' Hall bunk when dawn bells ring.",
        "Uphold expectations within The Lower Gardens, Craft Halls."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn potion brewing into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Lower Gardens, Craft Halls."
    ],
    "appearance": {
      "summary": "Often seen wearing stained gloves.",
      "details": [
        "Favorite garment: stained gloves.",
        "Notable belonging: mixing kit.",
        "Notable belonging: mixing spoon.",
        "Notable belonging: pouch of salts."
      ],
      "motifs": [
        "stained gloves"
      ]
    },
    "themes": [
      "potion brewing",
      "measuring",
      "precise measuring",
      "the lower gardens",
      "craft halls",
      "apprentice alchemist"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 3,
        "gold": 0
      },
      "items": [
        "stained gloves",
        "mixing kit",
        "mixing spoon",
        "pouch of salts"
      ],
      "equipment": [],
      "skills": [
        "potion brewing",
        "measuring",
        "precise measuring"
      ],
      "craftProficiencies": {
        "alchemy": 20
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Emberflask workshop cot when dawn bells ring.",
      "Report to Alchemists' Hall bunk when dawn bells ring.",
      "Uphold expectations within The Lower Gardens, Craft Halls."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "good",
      "notes": "Community roots in The Lower Gardens, Craft Halls"
    },
    "jobBranching": {
      "startingRole": "Apprentice Alchemist",
      "advancement": [
        "Journeyman Alchemist",
        "Master Alchemist"
      ],
      "sidePaths": [
        "Guild Instructor"
      ]
    }
  },
  {
    "id": "apprentice-rope-maker",
    "title": "Apprentice Rope Maker",
    "legacyBackgrounds": [
      "Apprentice rope maker"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Works the Ropewalk repairing nets while dreaming of building his own vessel.",
      "hometown": "The Port District",
      "notes": []
    },
    "currentSituation": {
      "summary": "You stretch awake in the drafty loft above the Ropewalk while rain taps the long roof at daybreak. A bone needle and spool of twine lie at your side with two coppers in your pocket; the foreman expects nets mended by the six o'clock whistle.",
      "sceneHook": "You stretch awake in the drafty loft above the Ropewalk while rain taps the long roof at daybreak.",
      "obligations": [
        "Report to Ropewalk loft when dawn bells ring.",
        "Uphold expectations within The Port District."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn knot tying into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Port District."
    ],
    "appearance": {
      "summary": "Keeps bone needle close as a personal token.",
      "details": [
        "Notable belonging: bone needle.",
        "Notable belonging: spool of twine."
      ],
      "motifs": [
        "bone needle",
        "spool of twine"
      ]
    },
    "themes": [
      "knot tying",
      "net repair",
      "the port district",
      "apprentice rope maker"
    ],
    "loadout": {
      "currency": {
        "copper": 2,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "bone needle",
        "spool of twine"
      ],
      "equipment": [],
      "skills": [
        "knot tying",
        "net repair"
      ],
      "craftProficiencies": {
        "rope": 20
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "No real experience"
      ]
    },
    "responsibilities": [
      "Report to Ropewalk loft when dawn bells ring.",
      "Uphold expectations within The Port District."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "good",
      "notes": "Community roots in The Port District"
    },
    "jobBranching": {
      "startingRole": "Apprentice Rope Maker",
      "advancement": [
        "Journeyman Rope Maker",
        "Master Rope Maker"
      ],
      "sidePaths": [
        "Guild Instructor"
      ]
    }
  },
  {
    "id": "bath-attendant",
    "title": "Bath Attendant",
    "legacyBackgrounds": [
      "Bath attendant"
    ],
    "locations": [
      "Warm Springs"
    ],
    "origin": {
      "summary": "Helps travelers soothe wounds in mineral pools while memorizing alchemical gossip.",
      "hometown": "The Springs",
      "notes": []
    },
    "currentSituation": {
      "summary": "Steam curls around you as you rise from your pallet beside the terraced pools at daybreak. A bundle of towels and a vial of spring water wait in a chest with four coppers in your sash; the first travelers arrive with sunrise.",
      "sceneHook": "Steam curls around you as you rise from your pallet beside the terraced pools at daybreak.",
      "obligations": [
        "Report to Terraced Hot Springs when dawn bells ring.",
        "Uphold expectations within The Springs."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Warm Springs.",
      "Turn massage into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Springs."
    ],
    "appearance": {
      "summary": "Keeps towel bundle close as a personal token.",
      "details": [
        "Notable belonging: towel bundle.",
        "Notable belonging: vial of spring water."
      ],
      "motifs": [
        "towel bundle",
        "vial of spring water"
      ]
    },
    "themes": [
      "massage",
      "herbal lore",
      "the springs",
      "bath attendant"
    ],
    "loadout": {
      "currency": {
        "copper": 4,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "towel bundle",
        "vial of spring water"
      ],
      "equipment": [],
      "skills": [
        "massage",
        "herbal lore"
      ],
      "craftProficiencies": {
        "alchemy": 5
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Terraced Hot Springs when dawn bells ring.",
      "Uphold expectations within The Springs."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Springs"
    },
    "jobBranching": {
      "startingRole": "Bath Attendant",
      "advancement": [
        "Bath Attendant Veteran",
        "Noted Bath Attendant"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "caravan-guard",
    "title": "Caravan Guard",
    "legacyBackgrounds": [
      "Caravan guard"
    ],
    "locations": [
      "Corner Stone"
    ],
    "origin": {
      "summary": "Hired blade protecting merchant trains that rest at the Hill market.",
      "hometown": "The Hill",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake on a cot in the Hill's caravanserai, hand already seeking your short sword and travel cloak as dawn cools the stone hall. Eight coppers jingle in your belt pouch; the merchant train musters at sunrise and you rush to join your post.",
      "sceneHook": "You wake on a cot in the Hill's caravanserai, hand already seeking your short sword and travel cloak as dawn cools the stone hall.",
      "obligations": [
        "Report to Caravanserai of the Hill bunk when dawn bells ring.",
        "Uphold expectations within The Hill."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corner Stone.",
      "Turn guarding into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Hill."
    ],
    "appearance": {
      "summary": "Often seen wearing travel cloak.",
      "details": [
        "Favorite garment: travel cloak.",
        "Wields short sword when needed."
      ],
      "motifs": [
        "travel cloak"
      ]
    },
    "themes": [
      "guarding",
      "intimidation",
      "the hill",
      "caravan guard"
    ],
    "loadout": {
      "currency": {
        "copper": 8,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "travel cloak",
        "short sword"
      ],
      "equipment": [
        "short sword"
      ],
      "skills": [
        "guarding",
        "intimidation"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Sword proficiency 20 (novice)"
      ]
    },
    "responsibilities": [
      "Report to Caravanserai of the Hill bunk when dawn bells ring.",
      "Uphold expectations within The Hill."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "lawful",
      "goodVsEvil": "good",
      "notes": "Community roots in The Hill"
    },
    "jobBranching": {
      "startingRole": "Caravan Guard",
      "advancement": [
        "Watch Sergeant",
        "City Captain"
      ],
      "sidePaths": [
        "Investigator"
      ]
    }
  },
  {
    "id": "caravan-merchant",
    "title": "Caravan Merchant",
    "legacyBackgrounds": [
      "Caravan merchant"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Runs a trinket stall in Caravan Square, trading in curiosities from distant roads.",
      "hometown": "The High Road District",
      "notes": []
    },
    "currentSituation": {
      "summary": "You flip open the awning of your Caravan Square stall as sunlight creeps over the High Road District. A merchant's ledger lies beside a locked box holding one silver and ten coppers; haggling begins at eighth bell so you arrange trinkets in neat rows.",
      "sceneHook": "You flip open the awning of your Caravan Square stall as sunlight creeps over the High Road District.",
      "obligations": [
        "Report to Caravan Square stall when dawn bells ring.",
        "Uphold expectations within The High Road District."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn appraisal into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The High Road District."
    ],
    "appearance": {
      "summary": "Keeps merchant's ledger close as a personal token.",
      "details": [
        "Notable belonging: merchant's ledger.",
        "Notable belonging: lockbox."
      ],
      "motifs": [
        "merchant's ledger",
        "lockbox"
      ]
    },
    "themes": [
      "appraisal",
      "negotiation",
      "the high road district",
      "caravan merchant"
    ],
    "loadout": {
      "currency": {
        "copper": 10,
        "silver": 1,
        "gold": 0
      },
      "items": [
        "merchant's ledger",
        "lockbox"
      ],
      "equipment": [],
      "skills": [
        "appraisal",
        "negotiation"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Beginner"
      ]
    },
    "responsibilities": [
      "Report to Caravan Square stall when dawn bells ring.",
      "Uphold expectations within The High Road District."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "good",
      "notes": "Community roots in The High Road District"
    },
    "jobBranching": {
      "startingRole": "Caravan Merchant",
      "advancement": [
        "Caravan Lead",
        "Guild Factor"
      ],
      "sidePaths": [
        "Quartermaster"
      ]
    }
  },
  {
    "id": "caravan-scribe",
    "title": "Caravan Scribe",
    "legacyBackgrounds": [
      "Caravan scribe"
    ],
    "locations": [
      "Mountain Top"
    ],
    "origin": {
      "summary": "Documents trade deals for traveling merchants, hoping to fund his own journey.",
      "hometown": "Central Plaza",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake at a table in the Merchant's Exchange, ink drying on last night's ledgers while dawn light spills through the plaza. Your quill and bundle of contracts are stacked beside a pouch of six coppers; merchants arrive at first bell for deals.",
      "sceneHook": "You wake at a table in the Merchant's Exchange, ink drying on last night's ledgers while dawn light spills through the plaza.",
      "obligations": [
        "Report to Merchant's Exchange stall when dawn bells ring.",
        "Uphold expectations within Central Plaza."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Mountain Top.",
      "Turn record keeping into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Central Plaza."
    ],
    "appearance": {
      "summary": "Keeps quill close as a personal token.",
      "details": [
        "Notable belonging: quill.",
        "Notable belonging: bundle of contracts."
      ],
      "motifs": [
        "quill",
        "bundle of contracts"
      ]
    },
    "themes": [
      "record keeping",
      "bargaining",
      "central plaza",
      "caravan scribe"
    ],
    "loadout": {
      "currency": {
        "copper": 6,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "quill",
        "bundle of contracts"
      ],
      "equipment": [],
      "skills": [
        "record keeping",
        "bargaining"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Merchant's Exchange stall when dawn bells ring.",
      "Uphold expectations within Central Plaza."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "lawful",
      "goodVsEvil": "good",
      "notes": "Community roots in Central Plaza"
    },
    "jobBranching": {
      "startingRole": "Caravan Scribe",
      "advancement": [
        "Caravan Scribe Veteran",
        "Noted Caravan Scribe"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "cattle-drover",
    "title": "Cattle Drover",
    "legacyBackgrounds": [
      "Cattle drover"
    ],
    "locations": [
      "Creekside"
    ],
    "origin": {
      "summary": "Raised among the largest herds, drives cattle to market with a steady hand.",
      "hometown": "Greenford",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake leaning against a fence in the Cattle Yards while dawn fog drifts over the lowing herds. Your crook and leather satchel holding four coppers hang on the rail; the drive to market leaves at sunrise.",
      "sceneHook": "You wake leaning against a fence in the Cattle Yards while dawn fog drifts over the lowing herds.",
      "obligations": [
        "Report to Cattle Yards corral when dawn bells ring.",
        "Uphold expectations within Greenford."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Creekside.",
      "Turn animal handling into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Greenford."
    ],
    "appearance": {
      "summary": "Keeps crook close as a personal token.",
      "details": [
        "Notable belonging: crook.",
        "Notable belonging: leather satchel."
      ],
      "motifs": [
        "crook",
        "leather satchel"
      ]
    },
    "themes": [
      "animal handling",
      "whistling",
      "greenford",
      "cattle drover"
    ],
    "loadout": {
      "currency": {
        "copper": 4,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "crook",
        "leather satchel"
      ],
      "equipment": [],
      "skills": [
        "animal handling",
        "whistling"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Staff proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Cattle Yards corral when dawn bells ring.",
      "Uphold expectations within Greenford."
    ],
    "defaultClassOptions": [
      "Martial Artist / Monk",
      "Acolyte / Priest"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Greenford"
    },
    "jobBranching": {
      "startingRole": "Cattle Drover",
      "advancement": [
        "Cattle Drover Veteran",
        "Noted Cattle Drover"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "city-guard-recruit",
    "title": "City Guard Recruit",
    "legacyBackgrounds": [
      "City guard recruit"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Farm boy turned watchman, eager to prove himself at the Gatewatch Barracks.",
      "hometown": "The Upper Ward",
      "notes": []
    },
    "currentSituation": {
      "summary": "You jerk awake on a straw pallet in the Gatewatch Barracks as the morning horn blares for drill. Your dented shield leans against the bunk, short spear across your knees, and three coppers jingle in your belt pouch as you scramble for muster.",
      "sceneHook": "You jerk awake on a straw pallet in the Gatewatch Barracks as the morning horn blares for drill.",
      "obligations": [
        "Report to Gatewatch Barracks bunk when dawn bells ring.",
        "Uphold expectations within The Upper Ward."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn spear drills into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Upper Ward."
    ],
    "appearance": {
      "summary": "Keeps dented shield ready for unexpected trouble.",
      "details": [
        "Wields dented shield when needed.",
        "Wields short spear when needed."
      ],
      "motifs": [
        "dented shield",
        "short spear"
      ]
    },
    "themes": [
      "spear drills",
      "watchfulness",
      "the upper ward",
      "city guard recruit"
    ],
    "loadout": {
      "currency": {
        "copper": 3,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "dented shield",
        "short spear"
      ],
      "equipment": [
        "dented shield",
        "short spear"
      ],
      "skills": [
        "spear drills",
        "watchfulness"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Spear proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Gatewatch Barracks bunk when dawn bells ring.",
      "Uphold expectations within The Upper Ward."
    ],
    "defaultClassOptions": [
      "Knight / Paladin",
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "lawful",
      "goodVsEvil": "good",
      "notes": "Community roots in The Upper Ward"
    },
    "jobBranching": {
      "startingRole": "City Guard Recruit",
      "advancement": [
        "Watch Sergeant",
        "City Captain"
      ],
      "sidePaths": [
        "Investigator"
      ]
    }
  },
  {
    "id": "coin-engravers-child",
    "title": "Coin Engraver'S Child",
    "legacyBackgrounds": [
      "Coin engraver's child"
    ],
    "locations": [
      "Corner Stone"
    ],
    "origin": {
      "summary": "Learns delicate designs in the Guild Palace mint.",
      "hometown": "Crown District",
      "notes": []
    },
    "currentSituation": {
      "summary": "You rub your eyes beside the mint's presses as a faint grey dawn filters through the high windows. Oil-slicked gears stand silent while your engraving chisel and wax tablet rest near a pouch holding one silver; the master engraver arrives at sunrise to review the dies.",
      "sceneHook": "You rub your eyes beside the mint's presses as a faint grey dawn filters through the high windows.",
      "obligations": [
        "Report to Guild Palace workshop when dawn bells ring.",
        "Uphold expectations within Crown District."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corner Stone.",
      "Turn engraving into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Crown District."
    ],
    "appearance": {
      "summary": "Keeps engraving chisel close as a personal token.",
      "details": [
        "Notable belonging: engraving chisel.",
        "Notable belonging: wax tablet."
      ],
      "motifs": [
        "engraving chisel",
        "wax tablet"
      ]
    },
    "themes": [
      "engraving",
      "design",
      "crown district",
      "coin engraver's child"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 1,
        "gold": 0
      },
      "items": [
        "engraving chisel",
        "wax tablet"
      ],
      "equipment": [],
      "skills": [
        "engraving",
        "design"
      ],
      "craftProficiencies": {
        "engraving": 15
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Guild Palace workshop when dawn bells ring.",
      "Uphold expectations within Crown District."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Crown District"
    },
    "jobBranching": {
      "startingRole": "Coin Engraver'S Child",
      "advancement": [
        "Coin Engraver'S Child Veteran",
        "Noted Coin Engraver'S Child"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "coopers-yard-laborer",
    "title": "Cooper'S Yard Laborer",
    "legacyBackgrounds": [
      "Cooper's yard laborer"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Hauls hoops and staves, hoping to join the coopers' guild one day.",
      "hometown": "Little Terns",
      "notes": []
    },
    "currentSituation": {
      "summary": "You rise among stacked staves in the Cooper's Yard shed as the morning fog curls over Little Terns. Hammer and barrel-hoop belt hang ready with six coppers tucked in your pocket; the bell will toll soon to start loading barrels.",
      "sceneHook": "You rise among stacked staves in the Cooper's Yard shed as the morning fog curls over Little Terns.",
      "obligations": [
        "Report to Cooper's Yard shed when dawn bells ring.",
        "Uphold expectations within Little Terns."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn heavy lifting into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Little Terns."
    ],
    "appearance": {
      "summary": "Often seen wearing barrel hoop belt.",
      "details": [
        "Favorite garment: barrel hoop belt.",
        "Wields hammer when needed."
      ],
      "motifs": [
        "barrel hoop belt"
      ]
    },
    "themes": [
      "heavy lifting",
      "basic carpentry",
      "little terns",
      "cooper's yard laborer"
    ],
    "loadout": {
      "currency": {
        "copper": 6,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "barrel hoop belt",
        "hammer"
      ],
      "equipment": [
        "hammer"
      ],
      "skills": [
        "heavy lifting",
        "basic carpentry"
      ],
      "craftProficiencies": {
        "carpentry": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Hammer proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Cooper's Yard shed when dawn bells ring.",
      "Uphold expectations within Little Terns."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior",
      "Templar / Inquisitor"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Little Terns"
    },
    "jobBranching": {
      "startingRole": "Cooper'S Yard Laborer",
      "advancement": [
        "Cooper'S Yard Laborer Veteran",
        "Noted Cooper'S Yard Laborer"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "crystal-prospector",
    "title": "Crystal Prospector",
    "legacyBackgrounds": [
      "Crystal prospector"
    ],
    "locations": [
      "Timber Grove"
    ],
    "origin": {
      "summary": "Scours the highland tunnel for shimmering shards worth a week's wages.",
      "hometown": "The Mine",
      "notes": []
    },
    "currentSituation": {
      "summary": "The scent of earth greets you as you rise from your bedroll near the mine entrance, dawn chill nipping your nose. Pickaxe and glowstone shard fit into your pack with five coppers in a pocket; the tunneling crew assembles at first light.",
      "sceneHook": "The scent of earth greets you as you rise from your bedroll near the mine entrance, dawn chill nipping your nose.",
      "obligations": [
        "Report to Mine entrance camp when dawn bells ring.",
        "Uphold expectations within The Mine."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Timber Grove.",
      "Turn mining into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Mine."
    ],
    "appearance": {
      "summary": "Keeps pickaxe ready for unexpected trouble.",
      "details": [
        "Wields pickaxe when needed.",
        "Notable belonging: glowstone shard."
      ],
      "motifs": [
        "pickaxe"
      ]
    },
    "themes": [
      "mining",
      "stone appraisal",
      "the mine",
      "crystal prospector"
    ],
    "loadout": {
      "currency": {
        "copper": 5,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "pickaxe",
        "glowstone shard"
      ],
      "equipment": [
        "pickaxe"
      ],
      "skills": [
        "mining",
        "stone appraisal"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Pick proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Mine entrance camp when dawn bells ring.",
      "Uphold expectations within The Mine."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Mine"
    },
    "jobBranching": {
      "startingRole": "Crystal Prospector",
      "advancement": [
        "Crystal Prospector Veteran",
        "Noted Crystal Prospector"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "dwarven-smiths-apprentice",
    "title": "Dwarven Smith'S Apprentice",
    "legacyBackgrounds": [
      "Dwarven smith's apprentice"
    ],
    "locations": [
      "Corner Stone"
    ],
    "origin": {
      "summary": "Serves a dwarven master, hammering exotic metals into fine blades.",
      "hometown": "Cherry Rock",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake to the glow of the Mithril Hall forge, your dwarven master's anvil already ringing as dawn light seeps down the chimney. Tongs and a fragment of mithril lie on your workbench with seven coppers in your apron; the day's hammering begins at sunrise.",
      "sceneHook": "You wake to the glow of the Mithril Hall forge, your dwarven master's anvil already ringing as dawn light seeps down the chimney.",
      "obligations": [
        "Report to Mithril Hall forge when dawn bells ring.",
        "Uphold expectations within Cherry Rock."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corner Stone.",
      "Turn smithing into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Cherry Rock."
    ],
    "appearance": {
      "summary": "Keeps tongs close as a personal token.",
      "details": [
        "Notable belonging: tongs.",
        "Notable belonging: mithril scrap."
      ],
      "motifs": [
        "tongs",
        "mithril scrap"
      ]
    },
    "themes": [
      "smithing",
      "metal lore",
      "cherry rock",
      "dwarven smith's apprentice"
    ],
    "loadout": {
      "currency": {
        "copper": 7,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "tongs",
        "mithril scrap"
      ],
      "equipment": [],
      "skills": [
        "smithing",
        "metal lore"
      ],
      "craftProficiencies": {
        "smithing": 20
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Hammer proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Mithril Hall forge when dawn bells ring.",
      "Uphold expectations within Cherry Rock."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior",
      "Templar / Inquisitor"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "good",
      "notes": "Community roots in Cherry Rock"
    },
    "jobBranching": {
      "startingRole": "Dwarven Smith'S Apprentice",
      "advancement": [
        "Journeyman Dwarven Smith'S",
        "Master Dwarven Smith'S"
      ],
      "sidePaths": [
        "Guild Instructor"
      ]
    }
  },
  {
    "id": "exotic-fruit-presser",
    "title": "Exotic Fruit Presser",
    "legacyBackgrounds": [
      "Exotic fruit presser"
    ],
    "locations": [
      "Dragon's Reach Road"
    ],
    "origin": {
      "summary": "Turns rare orchard fruit into syrups for caravans headed south.",
      "hometown": "The Artisan's Lane",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake to sticky sweet aromas in your workshop along the Artisan's Lane as sunlight filters through slatted shutters. A wooden press and bottle of syrup sit on the table with two silvers locked in a drawer; a caravan arrives by midday for the next batch.",
      "sceneHook": "You wake to sticky sweet aromas in your workshop along the Artisan's Lane as sunlight filters through slatted shutters.",
      "obligations": [
        "Report to Exotic Fruit Press when dawn bells ring.",
        "Uphold expectations within The Artisan's Lane."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Dragon's Reach Road.",
      "Turn pressing into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Artisan's Lane."
    ],
    "appearance": {
      "summary": "Keeps wooden press close as a personal token.",
      "details": [
        "Notable belonging: wooden press.",
        "Notable belonging: bottle of syrup."
      ],
      "motifs": [
        "wooden press",
        "bottle of syrup"
      ]
    },
    "themes": [
      "pressing",
      "flavoring",
      "the artisan's lane",
      "exotic fruit presser"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 2,
        "gold": 0
      },
      "items": [
        "wooden press",
        "bottle of syrup"
      ],
      "equipment": [],
      "skills": [
        "pressing",
        "flavoring"
      ],
      "craftProficiencies": {
        "cooking": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Exotic Fruit Press when dawn bells ring.",
      "Uphold expectations within The Artisan's Lane."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Artisan's Lane"
    },
    "jobBranching": {
      "startingRole": "Exotic Fruit Presser",
      "advancement": [
        "Exotic Fruit Presser Veteran",
        "Noted Exotic Fruit Presser"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "fisher-scavenger",
    "title": "Fisher Scavenger",
    "legacyBackgrounds": [
      "Fisher scavenger"
    ],
    "locations": [
      "Dragon's Reach Road"
    ],
    "origin": {
      "summary": "Casts nets for fish and combs the shore for shed dragon scales.",
      "hometown": "The Lakeside Quarter",
      "notes": []
    },
    "currentSituation": {
      "summary": "You yawn beside your boat at the Fishermen's Docks, lake mist drifting over the water in the early light. Net and scale pouch rest at your feet with three coppers tied in a cord; you must cast off before the sun burns away the fog.",
      "sceneHook": "You yawn beside your boat at the Fishermen's Docks, lake mist drifting over the water in the early light.",
      "obligations": [
        "Report to Fishermen's Docks when dawn bells ring.",
        "Uphold expectations within The Lakeside Quarter."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Dragon's Reach Road.",
      "Turn net casting into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Lakeside Quarter."
    ],
    "appearance": {
      "summary": "Keeps net close as a personal token.",
      "details": [
        "Notable belonging: net.",
        "Notable belonging: scale pouch."
      ],
      "motifs": [
        "net",
        "scale pouch"
      ]
    },
    "themes": [
      "net casting",
      "scavenging",
      "the lakeside quarter",
      "fisher scavenger"
    ],
    "loadout": {
      "currency": {
        "copper": 3,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "net",
        "scale pouch"
      ],
      "equipment": [],
      "skills": [
        "net casting",
        "scavenging"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {
        "fishing": 10
      },
      "combatTraining": [
        "Spear proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Fishermen's Docks when dawn bells ring.",
      "Uphold expectations within The Lakeside Quarter."
    ],
    "defaultClassOptions": [
      "Knight / Paladin",
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Lakeside Quarter"
    },
    "jobBranching": {
      "startingRole": "Fisher Scavenger",
      "advancement": [
        "Fisher Scavenger Veteran",
        "Noted Fisher Scavenger"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "fishmongers-assistant",
    "title": "Fishmonger'S Hand",
    "legacyBackgrounds": [
      "Fishmonger's assistant"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "${race} daughter of seasoned sailors, grew up gutting and selling catch on Fishmongers' Row.",
      "hometown": "The Port District",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake before dawn on a damp crate in Fishmongers' Row as gulls cry over the foggy harbor. Your scale-stained apron and gutting knife lie folded beside a pouch holding five coppers; the stall must be readied before the first boats dock.",
      "sceneHook": "You wake before dawn on a damp crate in Fishmongers' Row as gulls cry over the foggy harbor.",
      "obligations": [
        "Report to Fishmongers' Row stall when dawn bells ring.",
        "Uphold expectations within The Port District."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn filleting into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Port District."
    ],
    "appearance": {
      "summary": "Often seen wearing scale-stained apron.",
      "details": [
        "Favorite garment: scale-stained apron.",
        "Notable belonging: gutting knife."
      ],
      "motifs": [
        "scale-stained apron"
      ]
    },
    "themes": [
      "filleting",
      "haggling",
      "the port district",
      "fishmonger's assistant"
    ],
    "loadout": {
      "currency": {
        "copper": 5,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "scale-stained apron",
        "gutting knife"
      ],
      "equipment": [],
      "skills": [
        "filleting",
        "haggling"
      ],
      "craftProficiencies": {
        "cooking": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Knife proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Fishmongers' Row stall when dawn bells ring.",
      "Uphold expectations within The Port District."
    ],
    "defaultClassOptions": [
      "Ninja / Assassin",
      "Swashbuckler / Duelist"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Port District"
    },
    "jobBranching": {
      "startingRole": "Fishmonger'S Assistant",
      "advancement": [
        "Fishmonger'S Assistant Veteran",
        "Noted Fishmonger'S Assistant"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "flatboat-pilot",
    "title": "Flatboat Pilot",
    "legacyBackgrounds": [
      "Flatboat pilot"
    ],
    "locations": [
      "Creekside"
    ],
    "origin": {
      "summary": "Knows every bend of the river, ferrying goods between warehouses.",
      "hometown": "Everrise Bridge",
      "notes": []
    },
    "currentSituation": {
      "summary": "You roll off a coiled rope on the docks as the Everrise Bridge glows in morning light. Pole and river charts are tucked beside a pouch of three silvers; you must ferry goods across before the first bell tolls.",
      "sceneHook": "You roll off a coiled rope on the docks as the Everrise Bridge glows in morning light.",
      "obligations": [
        "Report to Riverside Warehouses dock when dawn bells ring.",
        "Uphold expectations within Everrise Bridge."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Creekside.",
      "Turn river navigation into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Everrise Bridge."
    ],
    "appearance": {
      "summary": "Keeps pole close as a personal token.",
      "details": [
        "Notable belonging: pole.",
        "Notable belonging: river charts."
      ],
      "motifs": [
        "pole",
        "river charts"
      ]
    },
    "themes": [
      "river navigation",
      "bartering",
      "everrise bridge",
      "flatboat pilot"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 3,
        "gold": 0
      },
      "items": [
        "pole",
        "river charts"
      ],
      "equipment": [],
      "skills": [
        "river navigation",
        "bartering"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Riverside Warehouses dock when dawn bells ring.",
      "Uphold expectations within Everrise Bridge."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Everrise Bridge"
    },
    "jobBranching": {
      "startingRole": "Flatboat Pilot",
      "advancement": [
        "Flatboat Pilot Veteran",
        "Noted Flatboat Pilot"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "fledgling-adventurer",
    "title": "Fledgling Adventurer",
    "legacyBackgrounds": [
      "Fledgling adventurer"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Orphaned street urchin who saved for a dull dagger and dreams of treasure.",
      "hometown": "Little Terns",
      "notes": [
        "Left her family's dairy to seek the Adventurers' Guild, hoping for grand quests."
      ]
    },
    "currentSituation": {
      "summary": "You awaken on a rooftop hideout, the city breeze ruffling your patched cloak while dawn paints the sky. A worn dagger rests under your hand with four copper coins in a tin; the alley gang expects you at first light to scout for treasure.",
      "sceneHook": "You awaken on a rooftop hideout, the city breeze ruffling your patched cloak while dawn paints the sky.",
      "obligations": [
        "Report to Rooftop hideout in Little Terns when dawn bells ring.",
        "Report to Roadside camp near the city when dawn bells ring.",
        "Uphold expectations within Little Terns, The Farmlands."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn climbing into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Little Terns, The Farmlands."
    ],
    "appearance": {
      "summary": "Often seen wearing patched cloak.",
      "details": [
        "Favorite garment: patched cloak.",
        "Wields worn dagger when needed.",
        "Wields short bow when needed.",
        "Notable belonging: small pack."
      ],
      "motifs": [
        "patched cloak"
      ]
    },
    "themes": [
      "climbing",
      "sneaking",
      "tracking",
      "fletching",
      "little terns",
      "the farmlands",
      "fledgling adventurer"
    ],
    "loadout": {
      "currency": {
        "copper": 4,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "patched cloak",
        "worn dagger",
        "short bow",
        "small pack"
      ],
      "equipment": [
        "worn dagger",
        "short bow"
      ],
      "skills": [
        "climbing",
        "sneaking",
        "tracking",
        "fletching"
      ],
      "craftProficiencies": {
        "fletching": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Dagger proficiency 10 (beginner)",
        "Bow proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Rooftop hideout in Little Terns when dawn bells ring.",
      "Report to Roadside camp near the city when dawn bells ring.",
      "Uphold expectations within Little Terns, The Farmlands."
    ],
    "defaultClassOptions": [
      "Scout / Ranger",
      "Archer / Marksman",
      "Ninja / Assassin",
      "Swashbuckler / Duelist"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Little Terns, The Farmlands"
    },
    "jobBranching": {
      "startingRole": "Fledgling Adventurer",
      "advancement": [
        "Fledgling Adventurer Veteran",
        "Noted Fledgling Adventurer"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "foragers-apprentice",
    "title": "Forager'S Apprentice",
    "legacyBackgrounds": [
      "Forager's apprentice"
    ],
    "locations": [
      "Whiteheart"
    ],
    "origin": {
      "summary": "Learns herbs and edible fungi from the elders in the communal longhouse.",
      "hometown": "Residences & Community",
      "notes": []
    },
    "currentSituation": {
      "summary": "You rise from the Forager's Lodge, the morning forest humming with unseen life. Foraging knife and basket hang by the door with two coppers tied in a cloth; the elders await you in the grove before sunrise.",
      "sceneHook": "You rise from the Forager's Lodge, the morning forest humming with unseen life.",
      "obligations": [
        "Report to Forager's Lodge when dawn bells ring.",
        "Uphold expectations within Residences & Community."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Whiteheart.",
      "Turn herbalism into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Residences & Community."
    ],
    "appearance": {
      "summary": "Keeps foraging knife close as a personal token.",
      "details": [
        "Notable belonging: foraging knife.",
        "Notable belonging: basket."
      ],
      "motifs": [
        "foraging knife",
        "basket"
      ]
    },
    "themes": [
      "herbalism",
      "cooking",
      "residences & community",
      "forager's apprentice"
    ],
    "loadout": {
      "currency": {
        "copper": 2,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "foraging knife",
        "basket"
      ],
      "equipment": [],
      "skills": [
        "herbalism",
        "cooking"
      ],
      "craftProficiencies": {
        "herbalism": 15
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Forager's Lodge when dawn bells ring.",
      "Uphold expectations within Residences & Community."
    ],
    "defaultClassOptions": [
      "Ninja / Assassin",
      "Swashbuckler / Duelist"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "good",
      "notes": "Community roots in Residences & Community"
    },
    "jobBranching": {
      "startingRole": "Forager'S Apprentice",
      "advancement": [
        "Journeyman Forager'S",
        "Master Forager'S"
      ],
      "sidePaths": [
        "Guild Instructor"
      ]
    }
  },
  {
    "id": "gardener-laborer",
    "title": "Gardener Laborer",
    "legacyBackgrounds": [
      "Gardener laborer"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Tends the flower beds and orchard walks, strong yet gentle with plants.",
      "hometown": "The Lower Gardens",
      "notes": []
    },
    "currentSituation": {
      "summary": "You stretch within the gardeners' tool shed as dawn light spills across beds awaiting your care. Spade and straw hat lean against the wall with five coppers in a small tin box; the head gardener expects irrigation to begin by sunrise.",
      "sceneHook": "You stretch within the gardeners' tool shed as dawn light spills across beds awaiting your care.",
      "obligations": [
        "Report to Gardener's tool shed when dawn bells ring.",
        "Uphold expectations within The Lower Gardens."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn pruning into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Lower Gardens."
    ],
    "appearance": {
      "summary": "Often seen wearing straw hat.",
      "details": [
        "Favorite garment: straw hat.",
        "Notable belonging: spade."
      ],
      "motifs": [
        "straw hat"
      ]
    },
    "themes": [
      "pruning",
      "irrigation",
      "the lower gardens",
      "gardener laborer"
    ],
    "loadout": {
      "currency": {
        "copper": 5,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "straw hat",
        "spade"
      ],
      "equipment": [],
      "skills": [
        "pruning",
        "irrigation"
      ],
      "craftProficiencies": {
        "gardening": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Beginner"
      ]
    },
    "responsibilities": [
      "Report to Gardener's tool shed when dawn bells ring.",
      "Uphold expectations within The Lower Gardens."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Lower Gardens"
    },
    "jobBranching": {
      "startingRole": "Gardener Laborer",
      "advancement": [
        "Gardener Laborer Veteran",
        "Noted Gardener Laborer"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "gate-guard",
    "title": "Gate Guard",
    "legacyBackgrounds": [
      "Gate guard"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Son of a veteran mason, joined the watch to protect the east gate.",
      "hometown": "The High Road District",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake at the east gate watchtower, dawn patrol handing you a steaming mug while the sky pales. Iron cap and short sword rest on a rack with two coppers in your pouch; your watch begins at sunrise as travelers queue outside.",
      "sceneHook": "You wake at the east gate watchtower, dawn patrol handing you a steaming mug while the sky pales.",
      "obligations": [
        "Report to East Gate watchtower when dawn bells ring.",
        "Uphold expectations within The High Road District."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn sword drills into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The High Road District."
    ],
    "appearance": {
      "summary": "Keeps short sword ready for unexpected trouble.",
      "details": [
        "Wields short sword when needed.",
        "Notable belonging: iron cap."
      ],
      "motifs": [
        "short sword"
      ]
    },
    "themes": [
      "sword drills",
      "gate protocols",
      "the high road district",
      "gate guard"
    ],
    "loadout": {
      "currency": {
        "copper": 2,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "short sword",
        "iron cap"
      ],
      "equipment": [
        "short sword"
      ],
      "skills": [
        "sword drills",
        "gate protocols"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Sword proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to East Gate watchtower when dawn bells ring.",
      "Uphold expectations within The High Road District."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "lawful",
      "goodVsEvil": "good",
      "notes": "Community roots in The High Road District"
    },
    "jobBranching": {
      "startingRole": "Gate Guard",
      "advancement": [
        "Watch Sergeant",
        "City Captain"
      ],
      "sidePaths": [
        "Investigator"
      ]
    }
  },
  {
    "id": "gate-smith",
    "title": "Gate Smith",
    "legacyBackgrounds": [
      "Gate smith"
    ],
    "locations": [
      "Corona"
    ],
    "origin": {
      "summary": "Forges hinges and spearheads for caravans entering the western road.",
      "hometown": "Greatwood Gate District",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake beside the warm coals of the Smiths' Yard forge while a crisp dawn breeze slips under the door. Smith's hammer and bundle of nails lie ready with eight coppers in your belt; caravans arrive by midmorning expecting new hinges and spearheads.",
      "sceneHook": "You wake beside the warm coals of the Smiths' Yard forge while a crisp dawn breeze slips under the door.",
      "obligations": [
        "Report to Smiths' Yard forge when dawn bells ring.",
        "Uphold expectations within Greatwood Gate District."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corona.",
      "Turn smithing into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Greatwood Gate District."
    ],
    "appearance": {
      "summary": "Keeps smith's hammer ready for unexpected trouble.",
      "details": [
        "Wields smith's hammer when needed.",
        "Notable belonging: bundle of nails."
      ],
      "motifs": [
        "smith's hammer"
      ]
    },
    "themes": [
      "smithing",
      "metal appraisal",
      "greatwood gate district",
      "gate smith"
    ],
    "loadout": {
      "currency": {
        "copper": 8,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "smith's hammer",
        "bundle of nails"
      ],
      "equipment": [
        "smith's hammer"
      ],
      "skills": [
        "smithing",
        "metal appraisal"
      ],
      "craftProficiencies": {
        "smithing": 20
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Hammer proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Smiths' Yard forge when dawn bells ring.",
      "Uphold expectations within Greatwood Gate District."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior",
      "Templar / Inquisitor"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Greatwood Gate District"
    },
    "jobBranching": {
      "startingRole": "Gate Smith",
      "advancement": [
        "Gate Smith Veteran",
        "Noted Gate Smith"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "glassblowers-apprentice",
    "title": "Glassblower'S Apprentice",
    "legacyBackgrounds": [
      "Glassblower's apprentice"
    ],
    "locations": [
      "Coral Keep"
    ],
    "origin": {
      "summary": "Sweeps floors at the Great Glassworks dreaming of shaping molten art.",
      "hometown": "The Forge District",
      "notes": []
    },
    "currentSituation": {
      "summary": "Heat from the furnaces seeps into the Great Glassworks dormitory where you wake before sunrise. Embers glow below as you pull on leather gloves, take up your blowpipe, and pocket six coppers; the foreman rings the bell soon to begin shaping glass.",
      "sceneHook": "Heat from the furnaces seeps into the Great Glassworks dormitory where you wake before sunrise.",
      "obligations": [
        "Report to Great Glassworks dormitory when dawn bells ring.",
        "Uphold expectations within The Forge District."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Coral Keep.",
      "Turn glass blowing into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Forge District."
    ],
    "appearance": {
      "summary": "Often seen wearing leather gloves.",
      "details": [
        "Favorite garment: leather gloves.",
        "Notable belonging: blowpipe."
      ],
      "motifs": [
        "leather gloves"
      ]
    },
    "themes": [
      "glass blowing",
      "kiln tending",
      "the forge district",
      "glassblower's apprentice"
    ],
    "loadout": {
      "currency": {
        "copper": 6,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "leather gloves",
        "blowpipe"
      ],
      "equipment": [],
      "skills": [
        "glass blowing",
        "kiln tending"
      ],
      "craftProficiencies": {
        "glass": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Great Glassworks dormitory when dawn bells ring.",
      "Uphold expectations within The Forge District."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "good",
      "notes": "Community roots in The Forge District"
    },
    "jobBranching": {
      "startingRole": "Glassblower'S Apprentice",
      "advancement": [
        "Journeyman Glassblower'S",
        "Master Glassblower'S"
      ],
      "sidePaths": [
        "Guild Instructor"
      ]
    }
  },
  {
    "id": "glasswright-apprentice",
    "title": "Glasswright Apprentice",
    "legacyBackgrounds": [
      "Glasswright apprentice"
    ],
    "locations": [
      "Corona"
    ],
    "origin": {
      "summary": "Mixes sand and ash under the guidance of masters at the Glasswrights' Guildhouse.",
      "hometown": "West Corona",
      "notes": []
    },
    "currentSituation": {
      "summary": "You awaken in the Guildhouse dormitory, furnace heat seeping through the floorboards as pale light filters through shutters. Your blowpipe and goggles hang nearby with four coppers in a pouch; the glassblowers begin work at sunrise and you hurry to join them.",
      "sceneHook": "You awaken in the Guildhouse dormitory, furnace heat seeping through the floorboards as pale light filters through shutters.",
      "obligations": [
        "Report to Glasswrights' Guildhouse dormitory when dawn bells ring.",
        "Uphold expectations within West Corona."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corona.",
      "Turn glass shaping into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in West Corona."
    ],
    "appearance": {
      "summary": "Keeps blowpipe close as a personal token.",
      "details": [
        "Notable belonging: blowpipe.",
        "Notable belonging: goggles."
      ],
      "motifs": [
        "blowpipe",
        "goggles"
      ]
    },
    "themes": [
      "glass shaping",
      "furnace tending",
      "west corona",
      "glasswright apprentice"
    ],
    "loadout": {
      "currency": {
        "copper": 4,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "blowpipe",
        "goggles"
      ],
      "equipment": [],
      "skills": [
        "glass shaping",
        "furnace tending"
      ],
      "craftProficiencies": {
        "glass": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Glasswrights' Guildhouse dormitory when dawn bells ring.",
      "Uphold expectations within West Corona."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "good",
      "notes": "Community roots in West Corona"
    },
    "jobBranching": {
      "startingRole": "Glasswright Apprentice",
      "advancement": [
        "Journeyman Glasswright",
        "Master Glasswright"
      ],
      "sidePaths": [
        "Guild Instructor"
      ]
    }
  },
  {
    "id": "guild-clerk",
    "title": "Guild Clerk",
    "legacyBackgrounds": [
      "Guild clerk"
    ],
    "locations": [
      "Creekside"
    ],
    "origin": {
      "summary": "Studies contracts in the Grand Guildhall, aspiring to post a quest of his own.",
      "hometown": "Stoneknot",
      "notes": []
    },
    "currentSituation": {
      "summary": "You blink away sleep amid stacks of parchment in the Grand Guildhall archives, lantern smoke curling in the still air. An ink pot and quest ledger sit next to six coppers in your drawer; the clerk's desk opens at sunrise to post new contracts.",
      "sceneHook": "You blink away sleep amid stacks of parchment in the Grand Guildhall archives, lantern smoke curling in the still air.",
      "obligations": [
        "Report to Grand Guildhall archives when dawn bells ring.",
        "Uphold expectations within Stoneknot."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Creekside.",
      "Turn accounting into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Stoneknot."
    ],
    "appearance": {
      "summary": "Keeps ink pot close as a personal token.",
      "details": [
        "Notable belonging: ink pot.",
        "Notable belonging: quest ledger."
      ],
      "motifs": [
        "ink pot",
        "quest ledger"
      ]
    },
    "themes": [
      "accounting",
      "guild law",
      "stoneknot",
      "guild clerk"
    ],
    "loadout": {
      "currency": {
        "copper": 6,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "ink pot",
        "quest ledger"
      ],
      "equipment": [],
      "skills": [
        "accounting",
        "guild law"
      ],
      "craftProficiencies": {
        "writing": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Grand Guildhall archives when dawn bells ring.",
      "Uphold expectations within Stoneknot."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Stoneknot"
    },
    "jobBranching": {
      "startingRole": "Guild Clerk",
      "advancement": [
        "Guild Clerk Veteran",
        "Noted Guild Clerk"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "gutter-orphan",
    "title": "Gutter Orphan",
    "legacyBackgrounds": [
      "Gutter orphan"
    ],
    "locations": [
      "Corona"
    ],
    "origin": {
      "summary": "Survives by scavenging and running errands for the Rat's Tail Tavern.",
      "hometown": "Western Slums",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake curled beneath a tarp in the Shanty Markets with a light drizzle tapping the canvas. Patched cloak and rusty knife are clutched close with two coppers hidden in a heel; the Rat's Tail Tavern runner expects you before the streets grow busy.",
      "sceneHook": "You wake curled beneath a tarp in the Shanty Markets with a light drizzle tapping the canvas.",
      "obligations": [
        "Report to Shanty Markets alley when dawn bells ring.",
        "Uphold expectations within Western Slums."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corona.",
      "Turn sneaking into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Western Slums."
    ],
    "appearance": {
      "summary": "Often seen wearing patched cloak.",
      "details": [
        "Favorite garment: patched cloak.",
        "Notable belonging: rusty knife."
      ],
      "motifs": [
        "patched cloak"
      ]
    },
    "themes": [
      "sneaking",
      "streetwise",
      "western slums",
      "gutter orphan"
    ],
    "loadout": {
      "currency": {
        "copper": 2,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "patched cloak",
        "rusty knife"
      ],
      "equipment": [],
      "skills": [
        "sneaking",
        "streetwise"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Knife proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Shanty Markets alley when dawn bells ring.",
      "Uphold expectations within Western Slums."
    ],
    "defaultClassOptions": [
      "Ninja / Assassin",
      "Swashbuckler / Duelist"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Western Slums"
    },
    "jobBranching": {
      "startingRole": "Gutter Orphan",
      "advancement": [
        "Gutter Orphan Veteran",
        "Noted Gutter Orphan"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "herbal-gatherer",
    "title": "Herbal Gatherer",
    "legacyBackgrounds": [
      "Herbal gatherer"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Raised by a local apothecary, harvests rare herbs from the surrounding hills.",
      "hometown": "Greensoul Hill",
      "notes": []
    },
    "currentSituation": {
      "summary": "You greet the sunrise in a dew-laden clearing on Greensoul Hill, birdsong mingling with distant city bells. Your herb satchel and small knife lie ready with two coppers tucked inside; the apothecary expects fresh sprigs before the market opens.",
      "sceneHook": "You greet the sunrise in a dew-laden clearing on Greensoul Hill, birdsong mingling with distant city bells.",
      "obligations": [
        "Report to Greensoul Hill herb clearing when dawn bells ring.",
        "Uphold expectations within Greensoul Hill."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn herb lore into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Greensoul Hill."
    ],
    "appearance": {
      "summary": "Keeps herb satchel close as a personal token.",
      "details": [
        "Notable belonging: herb satchel.",
        "Notable belonging: small knife."
      ],
      "motifs": [
        "herb satchel",
        "small knife"
      ]
    },
    "themes": [
      "herb lore",
      "tea brewing",
      "greensoul hill",
      "herbal gatherer"
    ],
    "loadout": {
      "currency": {
        "copper": 2,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "herb satchel",
        "small knife"
      ],
      "equipment": [],
      "skills": [
        "herb lore",
        "tea brewing"
      ],
      "craftProficiencies": {
        "herbalism": 10,
        "brewing": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Knife proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Greensoul Hill herb clearing when dawn bells ring.",
      "Uphold expectations within Greensoul Hill."
    ],
    "defaultClassOptions": [
      "Ninja / Assassin",
      "Swashbuckler / Duelist",
      "Druid / Shaman"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Greensoul Hill"
    },
    "jobBranching": {
      "startingRole": "Herbal Gatherer",
      "advancement": [
        "Herbal Gatherer Veteran",
        "Noted Herbal Gatherer"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "iron-watch-recruit",
    "title": "Iron Watch Recruit",
    "legacyBackgrounds": [
      "Iron Watch recruit"
    ],
    "locations": [
      "Mountain Top"
    ],
    "origin": {
      "summary": "Left a farm to join the fortress garrison guarding the Wetlands road.",
      "hometown": "Fortress Quarter",
      "notes": []
    },
    "currentSituation": {
      "summary": "You snap awake in the barracks as the morning bell calls recruits to muster. A dented helm and practice sword rest beside your bunk with two coppers in your boot; the drill yard awaits by sunrise.",
      "sceneHook": "You snap awake in the barracks as the morning bell calls recruits to muster.",
      "obligations": [
        "Report to Barracks of the Iron Watch when dawn bells ring.",
        "Uphold expectations within Fortress Quarter."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Mountain Top.",
      "Turn drill formation into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Fortress Quarter."
    ],
    "appearance": {
      "summary": "Often seen wearing dented helm.",
      "details": [
        "Favorite garment: dented helm.",
        "Wields practice sword when needed."
      ],
      "motifs": [
        "dented helm"
      ]
    },
    "themes": [
      "drill formation",
      "spotting",
      "fortress quarter",
      "iron watch recruit"
    ],
    "loadout": {
      "currency": {
        "copper": 2,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "dented helm",
        "practice sword"
      ],
      "equipment": [
        "practice sword"
      ],
      "skills": [
        "drill formation",
        "spotting"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Sword proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Barracks of the Iron Watch when dawn bells ring.",
      "Uphold expectations within Fortress Quarter."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "lawful",
      "goodVsEvil": "good",
      "notes": "Community roots in Fortress Quarter"
    },
    "jobBranching": {
      "startingRole": "Iron Watch Recruit",
      "advancement": [
        "Watch Sergeant",
        "City Captain"
      ],
      "sidePaths": [
        "Investigator"
      ]
    }
  },
  {
    "id": "junior-quartermaster",
    "title": "Junior Quartermaster",
    "legacyBackgrounds": [
      "Junior quartermaster"
    ],
    "locations": [
      "Coral Keep"
    ],
    "origin": {
      "summary": "Grew up in the shadow of the Coral Citadel counting crates and polishing armor.",
      "hometown": "The Military Ward",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake atop a stack of crates in the supply depot loft as pre-dawn horns echo against the coral-white walls. Damp sea air drifts through the slats while you scoop up your ledger and stub of chalk beside a pouch of five coppers; quartermaster muster begins at first bell.",
      "sceneHook": "You wake atop a stack of crates in the supply depot loft as pre-dawn horns echo against the coral-white walls.",
      "obligations": [
        "Report to Supply depot loft when dawn bells ring.",
        "Uphold expectations within The Military Ward."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Coral Keep.",
      "Turn inventory into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Military Ward."
    ],
    "appearance": {
      "summary": "Keeps ledger close as a personal token.",
      "details": [
        "Notable belonging: ledger.",
        "Notable belonging: stub of chalk."
      ],
      "motifs": [
        "ledger",
        "stub of chalk"
      ]
    },
    "themes": [
      "inventory",
      "marching drills",
      "the military ward",
      "junior quartermaster"
    ],
    "loadout": {
      "currency": {
        "copper": 5,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "ledger",
        "stub of chalk"
      ],
      "equipment": [],
      "skills": [
        "inventory",
        "marching drills"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Spear proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Supply depot loft when dawn bells ring.",
      "Uphold expectations within The Military Ward."
    ],
    "defaultClassOptions": [
      "Knight / Paladin",
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Military Ward"
    },
    "jobBranching": {
      "startingRole": "Junior Quartermaster",
      "advancement": [
        "Junior Quartermaster Veteran",
        "Noted Junior Quartermaster"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "leatherwrights-journeyman",
    "title": "Leatherwright'S Journeyman",
    "legacyBackgrounds": [
      "Leatherwright's journeyman"
    ],
    "locations": [
      "Mountain Top"
    ],
    "origin": {
      "summary": "Learns to craft sturdy packs for caravans crossing the wetlands.",
      "hometown": "Artisan's Row",
      "notes": []
    },
    "currentSituation": {
      "summary": "You rub sleep from your eyes at the Leatherwright's Hall as morning light slants across half-laced packs. Awl and spool of thread lie on the bench with seven coppers in a drawer; the master expects today's work finished by second bell.",
      "sceneHook": "You rub sleep from your eyes at the Leatherwright's Hall as morning light slants across half-laced packs.",
      "obligations": [
        "Report to Leatherwright's Hall workbench when dawn bells ring.",
        "Uphold expectations within Artisan's Row."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Mountain Top.",
      "Turn stitching into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Artisan's Row."
    ],
    "appearance": {
      "summary": "Keeps awl close as a personal token.",
      "details": [
        "Notable belonging: awl.",
        "Notable belonging: spool of thread."
      ],
      "motifs": [
        "awl",
        "spool of thread"
      ]
    },
    "themes": [
      "stitching",
      "design",
      "artisan's row",
      "leatherwright's journeyman"
    ],
    "loadout": {
      "currency": {
        "copper": 7,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "awl",
        "spool of thread"
      ],
      "equipment": [],
      "skills": [
        "stitching",
        "design"
      ],
      "craftProficiencies": {
        "leatherwork": 15
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Dagger proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Leatherwright's Hall workbench when dawn bells ring.",
      "Uphold expectations within Artisan's Row."
    ],
    "defaultClassOptions": [
      "Ninja / Assassin",
      "Swashbuckler / Duelist"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Artisan's Row"
    },
    "jobBranching": {
      "startingRole": "Leatherwright'S Journeyman",
      "advancement": [
        "Leatherwright'S Journeyman Veteran",
        "Noted Leatherwright'S Journeyman"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "log-driver",
    "title": "Log Driver",
    "legacyBackgrounds": [
      "Log driver"
    ],
    "locations": [
      "Timber Grove"
    ],
    "origin": {
      "summary": "Guides felled trunks down the river, dreaming of owning his own mill.",
      "hometown": "The Lumberworks",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake on a damp log by the Lumberworks while river mist curls around your peavey hook. Waterlogged boots drip beside a pouch of three coppers; the jam must be cleared before the sun climbs.",
      "sceneHook": "You wake on a damp log by the Lumberworks while river mist curls around your peavey hook.",
      "obligations": [
        "Report to Riverside log jam when dawn bells ring.",
        "Uphold expectations within The Lumberworks."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Timber Grove.",
      "Turn log rolling into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Lumberworks."
    ],
    "appearance": {
      "summary": "Often seen wearing waterlogged boots.",
      "details": [
        "Favorite garment: waterlogged boots.",
        "Notable belonging: peavey hook."
      ],
      "motifs": [
        "waterlogged boots"
      ]
    },
    "themes": [
      "log rolling",
      "river sense",
      "the lumberworks",
      "log driver"
    ],
    "loadout": {
      "currency": {
        "copper": 3,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "waterlogged boots",
        "peavey hook"
      ],
      "equipment": [],
      "skills": [
        "log rolling",
        "river sense"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Axe proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Riverside log jam when dawn bells ring.",
      "Uphold expectations within The Lumberworks."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Lumberworks"
    },
    "jobBranching": {
      "startingRole": "Log Driver",
      "advancement": [
        "Log Driver Veteran",
        "Noted Log Driver"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "market-gardener",
    "title": "Market Gardener",
    "legacyBackgrounds": [
      "Market gardener"
    ],
    "locations": [
      "Corona"
    ],
    "origin": {
      "summary": "Raises vegetables outside the walls, carting them to the Great Market at dawn.",
      "hometown": "Brightshade",
      "notes": []
    },
    "currentSituation": {
      "summary": "Sunlight filters through awnings as you arrange fresh greens on your Brightshade market stall at the cool break of day. A hand rake rests against the cart, bundled produce and six coppers tucked in your apron; opening at six each morning has become routine.",
      "sceneHook": "Sunlight filters through awnings as you arrange fresh greens on your Brightshade market stall at the cool break of day.",
      "obligations": [
        "Report to Great Market stall when dawn bells ring.",
        "Uphold expectations within Brightshade."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corona.",
      "Turn horticulture into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Brightshade."
    ],
    "appearance": {
      "summary": "Keeps hand rake close as a personal token.",
      "details": [
        "Notable belonging: hand rake.",
        "Notable belonging: bundled greens."
      ],
      "motifs": [
        "hand rake",
        "bundled greens"
      ]
    },
    "themes": [
      "horticulture",
      "haggling",
      "brightshade",
      "market gardener"
    ],
    "loadout": {
      "currency": {
        "copper": 6,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "hand rake",
        "bundled greens"
      ],
      "equipment": [],
      "skills": [
        "horticulture",
        "haggling"
      ],
      "craftProficiencies": {
        "gardening": 15
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Great Market stall when dawn bells ring.",
      "Uphold expectations within Brightshade."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Brightshade"
    },
    "jobBranching": {
      "startingRole": "Market Gardener",
      "advancement": [
        "Market Gardener Veteran",
        "Noted Market Gardener"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "messenger-page",
    "title": "Messenger Page",
    "legacyBackgrounds": [
      "Messenger page"
    ],
    "locations": [
      "Corona"
    ],
    "origin": {
      "summary": "Runs sealed notes between commanders within the High Citadel.",
      "hometown": "The Citadel Quarter",
      "notes": []
    },
    "currentSituation": {
      "summary": "You jerk awake on a bench in the Hall of Governance as first light glints off polished floors. Your satchel and signet token lie across your lap with five coppers in a pocket; the commanders expect their sealed notes delivered before the second bell.",
      "sceneHook": "You jerk awake on a bench in the Hall of Governance as first light glints off polished floors.",
      "obligations": [
        "Report to Hall of Governance corridor when dawn bells ring.",
        "Uphold expectations within The Citadel Quarter."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corona.",
      "Turn swift running into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Citadel Quarter."
    ],
    "appearance": {
      "summary": "Keeps satchel close as a personal token.",
      "details": [
        "Notable belonging: satchel.",
        "Notable belonging: signet token."
      ],
      "motifs": [
        "satchel",
        "signet token"
      ]
    },
    "themes": [
      "swift running",
      "protocol",
      "the citadel quarter",
      "messenger page"
    ],
    "loadout": {
      "currency": {
        "copper": 5,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "satchel",
        "signet token"
      ],
      "equipment": [],
      "skills": [
        "swift running",
        "protocol"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Hall of Governance corridor when dawn bells ring.",
      "Uphold expectations within The Citadel Quarter."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Citadel Quarter"
    },
    "jobBranching": {
      "startingRole": "Messenger Page",
      "advancement": [
        "Messenger Page Veteran",
        "Noted Messenger Page"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "monk-in-training",
    "title": "Monk-In-Training",
    "legacyBackgrounds": [
      "Monk-in-training"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Former militia runner who sought peace within the Greensoul Monastery.",
      "hometown": "Greensoul Hill",
      "notes": []
    },
    "currentSituation": {
      "summary": "You rise from a simple cot in Greensoul Monastery as bells toll the call to meditation. Prayer beads loop around your neck and a walking staff stands nearby; with no coin to your name you join the line for first light prayers.",
      "sceneHook": "You rise from a simple cot in Greensoul Monastery as bells toll the call to meditation.",
      "obligations": [
        "Report to Greensoul Monastery cell when dawn bells ring.",
        "Uphold expectations within Greensoul Hill."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn meditation into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Greensoul Hill."
    ],
    "appearance": {
      "summary": "Keeps walking staff ready for unexpected trouble.",
      "details": [
        "Wields walking staff when needed.",
        "Notable belonging: prayer beads."
      ],
      "motifs": [
        "walking staff"
      ]
    },
    "themes": [
      "meditation",
      "brewing",
      "greensoul hill",
      "monk-in-training"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "walking staff",
        "prayer beads"
      ],
      "equipment": [
        "walking staff"
      ],
      "skills": [
        "meditation",
        "brewing"
      ],
      "craftProficiencies": {
        "brewing": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Staff proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Greensoul Monastery cell when dawn bells ring.",
      "Uphold expectations within Greensoul Hill."
    ],
    "defaultClassOptions": [
      "Martial Artist / Monk",
      "Acolyte / Priest"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Greensoul Hill"
    },
    "jobBranching": {
      "startingRole": "Monk-In-Training",
      "advancement": [
        "Senior Acolyte",
        "Temple Steward"
      ],
      "sidePaths": [
        "Hermit Scholar"
      ]
    }
  },
  {
    "id": "orchard-picker",
    "title": "Orchard Picker",
    "legacyBackgrounds": [
      "Orchard picker"
    ],
    "locations": [
      "Creekside"
    ],
    "origin": {
      "summary": "Tends fruit trees outside the walls, trading baskets for coin.",
      "hometown": "Surrounding Farmlands & Orchards",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake beneath a laden apple tree, dew soaking your clothes as birds chirp in the dawn. Your fruit knife and woven basket lie nearby with five coppers tied in a cloth; the wagon to market departs at third bell.",
      "sceneHook": "You wake beneath a laden apple tree, dew soaking your clothes as birds chirp in the dawn.",
      "obligations": [
        "Report to Fruit orchard camp when dawn bells ring.",
        "Uphold expectations within Surrounding Farmlands & Orchards."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Creekside.",
      "Turn harvesting into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Surrounding Farmlands & Orchards."
    ],
    "appearance": {
      "summary": "Keeps fruit knife close as a personal token.",
      "details": [
        "Notable belonging: fruit knife.",
        "Notable belonging: woven basket."
      ],
      "motifs": [
        "fruit knife",
        "woven basket"
      ]
    },
    "themes": [
      "harvesting",
      "climbing",
      "surrounding farmlands & orchards",
      "orchard picker"
    ],
    "loadout": {
      "currency": {
        "copper": 5,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "fruit knife",
        "woven basket"
      ],
      "equipment": [],
      "skills": [
        "harvesting",
        "climbing"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Sling proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Fruit orchard camp when dawn bells ring.",
      "Uphold expectations within Surrounding Farmlands & Orchards."
    ],
    "defaultClassOptions": [
      "Ninja / Assassin",
      "Swashbuckler / Duelist"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Surrounding Farmlands & Orchards"
    },
    "jobBranching": {
      "startingRole": "Orchard Picker",
      "advancement": [
        "Orchard Picker Veteran",
        "Noted Orchard Picker"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "ostracized-noble",
    "title": "Ostracized Noble",
    "legacyBackgrounds": [
      "Ostracized noble"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Cast out for defying his family's plans, survives on etiquette lessons and a fading signet ring.",
      "hometown": "The Upper Ward",
      "notes": []
    },
    "currentSituation": {
      "summary": "You rouse in a cramped attic overlooking manicured streets as the sun climbs over the Upper Ward. Your tarnished signet ring and travel cloak sit atop a chest beside a lone silver coin; today you are due at the etiquette tutor's door by ninth bell to beg for work.",
      "sceneHook": "You rouse in a cramped attic overlooking manicured streets as the sun climbs over the Upper Ward.",
      "obligations": [
        "Report to Rented attic in the Upper Ward when dawn bells ring.",
        "Uphold expectations within The Upper Ward."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn etiquette into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Upper Ward."
    ],
    "appearance": {
      "summary": "Often seen wearing travel cloak.",
      "details": [
        "Favorite garment: travel cloak.",
        "Notable belonging: tarnished signet ring."
      ],
      "motifs": [
        "travel cloak"
      ]
    },
    "themes": [
      "etiquette",
      "calligraphy",
      "the upper ward",
      "ostracized noble"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 1,
        "gold": 0
      },
      "items": [
        "travel cloak",
        "tarnished signet ring"
      ],
      "equipment": [],
      "skills": [
        "etiquette",
        "calligraphy"
      ],
      "craftProficiencies": {
        "calligraphy": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Rapier proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Rented attic in the Upper Ward when dawn bells ring.",
      "Uphold expectations within The Upper Ward."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Upper Ward"
    },
    "jobBranching": {
      "startingRole": "Ostracized Noble",
      "advancement": [
        "Ostracized Noble Veteran",
        "Noted Ostracized Noble"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "pearl-diver",
    "title": "Pearl Diver",
    "legacyBackgrounds": [
      "Pearl diver"
    ],
    "locations": [
      "Coral Keep"
    ],
    "origin": {
      "summary": "Descended from a line of shellfishers, you scour reefs for luminous pearls.",
      "hometown": "The South Docks & Steel Docks",
      "notes": []
    },
    "currentSituation": {
      "summary": "Salt spray stings your face as you rouse on a coil of rope beside the Steel Watch Docks. The grey dawn promises calm seas while your diving knife and string of shells hang from your belt with two silvers in a pocket; you must catch the tide before the patrol ship departs.",
      "sceneHook": "Salt spray stings your face as you rouse on a coil of rope beside the Steel Watch Docks.",
      "obligations": [
        "Report to Steel Watch Naval Docks bunk when dawn bells ring.",
        "Uphold expectations within The South Docks & Steel Docks."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Coral Keep.",
      "Turn free diving into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The South Docks & Steel Docks."
    ],
    "appearance": {
      "summary": "Keeps diving knife close as a personal token.",
      "details": [
        "Notable belonging: diving knife.",
        "Notable belonging: string of shells."
      ],
      "motifs": [
        "diving knife",
        "string of shells"
      ]
    },
    "themes": [
      "free diving",
      "reef navigation",
      "the south docks & steel docks",
      "pearl diver"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 2,
        "gold": 0
      },
      "items": [
        "diving knife",
        "string of shells"
      ],
      "equipment": [],
      "skills": [
        "free diving",
        "reef navigation"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Knife proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Steel Watch Naval Docks bunk when dawn bells ring.",
      "Uphold expectations within The South Docks & Steel Docks."
    ],
    "defaultClassOptions": [
      "Ninja / Assassin",
      "Swashbuckler / Duelist"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The South Docks & Steel Docks"
    },
    "jobBranching": {
      "startingRole": "Pearl Diver",
      "advancement": [
        "Pearl Diver Veteran",
        "Noted Pearl Diver"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "quest-board-runner",
    "title": "Quest Board Runner",
    "legacyBackgrounds": [
      "Quest board runner"
    ],
    "locations": [
      "Dragon's Reach Road"
    ],
    "origin": {
      "summary": "Posts notices for incoming adventurers, secretly dreaming of joining a hunt.",
      "hometown": "The Central Plaza",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake on the steps of the Guild Post as dawn caravans creak into the plaza, the chill air filled with hoofbeats. A bundle of nails and quest parchment lie in your lap with four coppers in a pouch; notices must be posted before the guild opens.",
      "sceneHook": "You wake on the steps of the Guild Post as dawn caravans creak into the plaza, the chill air filled with hoofbeats.",
      "obligations": [
        "Report to Guild Post steps when dawn bells ring.",
        "Uphold expectations within The Central Plaza."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Dragon's Reach Road.",
      "Turn reading into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Central Plaza."
    ],
    "appearance": {
      "summary": "Keeps bundle of nails close as a personal token.",
      "details": [
        "Notable belonging: bundle of nails.",
        "Notable belonging: quest parchment."
      ],
      "motifs": [
        "bundle of nails",
        "quest parchment"
      ]
    },
    "themes": [
      "reading",
      "rumor gathering",
      "the central plaza",
      "quest board runner"
    ],
    "loadout": {
      "currency": {
        "copper": 4,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "bundle of nails",
        "quest parchment"
      ],
      "equipment": [],
      "skills": [
        "reading",
        "rumor gathering"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Guild Post steps when dawn bells ring.",
      "Uphold expectations within The Central Plaza."
    ],
    "defaultClassOptions": [
      "Scout / Ranger",
      "Archer / Marksman"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Central Plaza"
    },
    "jobBranching": {
      "startingRole": "Quest Board Runner",
      "advancement": [
        "Quest Board Runner Veteran",
        "Noted Quest Board Runner"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "reed-gatherer",
    "title": "Reed Gatherer",
    "legacyBackgrounds": [
      "Reed gatherer"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Collects river reeds for weaving baskets sold within Wave’s Break.",
      "hometown": "The Farmlands",
      "notes": []
    },
    "currentSituation": {
      "summary": "You crawl from your riverbank lean-to as reeds sway in the early breeze, the water whispering toward Wave’s Break. A bundle of reeds and small knife are at hand with three coppers wrapped in cloth; the barge leaves at second bell so you hurry to harvest more.",
      "sceneHook": "You crawl from your riverbank lean-to as reeds sway in the early breeze, the water whispering toward Wave’s Break.",
      "obligations": [
        "Report to Riverbank lean-to when dawn bells ring.",
        "Uphold expectations within The Farmlands."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn basket weaving into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Farmlands."
    ],
    "appearance": {
      "summary": "Keeps bundle of reeds close as a personal token.",
      "details": [
        "Notable belonging: bundle of reeds.",
        "Notable belonging: small knife."
      ],
      "motifs": [
        "bundle of reeds",
        "small knife"
      ]
    },
    "themes": [
      "basket weaving",
      "river navigation",
      "the farmlands",
      "reed gatherer"
    ],
    "loadout": {
      "currency": {
        "copper": 3,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "bundle of reeds",
        "small knife"
      ],
      "equipment": [],
      "skills": [
        "basket weaving",
        "river navigation"
      ],
      "craftProficiencies": {
        "weaving": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Knife proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Riverbank lean-to when dawn bells ring.",
      "Uphold expectations within The Farmlands."
    ],
    "defaultClassOptions": [
      "Ninja / Assassin",
      "Swashbuckler / Duelist"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Farmlands"
    },
    "jobBranching": {
      "startingRole": "Reed Gatherer",
      "advancement": [
        "Reed Gatherer Veteran",
        "Noted Reed Gatherer"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "river-trader",
    "title": "River Trader",
    "legacyBackgrounds": [
      "River trader"
    ],
    "locations": [
      "Corner Stone"
    ],
    "origin": {
      "summary": "Ferries gems and glass across the mist-shrouded bridge for eager buyers.",
      "hometown": "Misty Crossing",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake on your barge tied beneath the Great Stone Bridge, river mist beading on your clothes in the early morning chill. Gripping your pole and tucking the ledger beside three silvers into a chest, you must shove off before first bell to catch the market rush.",
      "sceneHook": "You wake on your barge tied beneath the Great Stone Bridge, river mist beading on your clothes in the early morning chill.",
      "obligations": [
        "Report to Great Stone Bridge dock when dawn bells ring.",
        "Uphold expectations within Misty Crossing."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corner Stone.",
      "Turn negotiation into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Misty Crossing."
    ],
    "appearance": {
      "summary": "Keeps pole close as a personal token.",
      "details": [
        "Notable belonging: pole.",
        "Notable belonging: ledger."
      ],
      "motifs": [
        "pole",
        "ledger"
      ]
    },
    "themes": [
      "negotiation",
      "river navigation",
      "misty crossing",
      "river trader"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 3,
        "gold": 0
      },
      "items": [
        "pole",
        "ledger"
      ],
      "equipment": [],
      "skills": [
        "negotiation",
        "river navigation"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Great Stone Bridge dock when dawn bells ring.",
      "Uphold expectations within Misty Crossing."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Misty Crossing"
    },
    "jobBranching": {
      "startingRole": "River Trader",
      "advancement": [
        "Caravan Lead",
        "Guild Factor"
      ],
      "sidePaths": [
        "Quartermaster"
      ]
    }
  },
  {
    "id": "road-scout",
    "title": "Road Scout",
    "legacyBackgrounds": [
      "Road scout"
    ],
    "locations": [
      "Whiteheart"
    ],
    "origin": {
      "summary": "Trained to patrol forest trails, watching for bandits and monsters.",
      "hometown": "The Barracks",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake on a narrow bunk in the Whiteheart barracks as dawn seeps through the shutters. Short bow and worn boots are already packed with three coppers in your pouch; patrol sets out at first light.",
      "sceneHook": "You wake on a narrow bunk in the Whiteheart barracks as dawn seeps through the shutters.",
      "obligations": [
        "Report to Barracks bunk when dawn bells ring.",
        "Uphold expectations within The Barracks."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Whiteheart.",
      "Turn tracking into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Barracks."
    ],
    "appearance": {
      "summary": "Often seen wearing worn boots.",
      "details": [
        "Favorite garment: worn boots.",
        "Wields short bow when needed."
      ],
      "motifs": [
        "worn boots"
      ]
    },
    "themes": [
      "tracking",
      "mapping",
      "the barracks",
      "road scout"
    ],
    "loadout": {
      "currency": {
        "copper": 3,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "worn boots",
        "short bow"
      ],
      "equipment": [
        "short bow"
      ],
      "skills": [
        "tracking",
        "mapping"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Bow proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Barracks bunk when dawn bells ring.",
      "Uphold expectations within The Barracks."
    ],
    "defaultClassOptions": [
      "Scout / Ranger",
      "Archer / Marksman"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Barracks"
    },
    "jobBranching": {
      "startingRole": "Road Scout",
      "advancement": [
        "Road Scout Veteran",
        "Noted Road Scout"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "sap-collector",
    "title": "Sap Collector",
    "legacyBackgrounds": [
      "Sap collector"
    ],
    "locations": [
      "Timber Grove"
    ],
    "origin": {
      "summary": "Taps trees at dawn to harvest sweet saps prized by alchemists.",
      "hometown": "Fields & Orchards",
      "notes": []
    },
    "currentSituation": {
      "summary": "You rouse in an orchard shed, sticky with sap as buzzing insects herald the warm morning. A drill and bucket of sap stand ready with two coppers in your belt; trees must be tapped before the day heats.",
      "sceneHook": "You rouse in an orchard shed, sticky with sap as buzzing insects herald the warm morning.",
      "obligations": [
        "Report to Orchard shed when dawn bells ring.",
        "Uphold expectations within Fields & Orchards."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Timber Grove.",
      "Turn tree tapping into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Fields & Orchards."
    ],
    "appearance": {
      "summary": "Keeps drill close as a personal token.",
      "details": [
        "Notable belonging: drill.",
        "Notable belonging: bucket of sap."
      ],
      "motifs": [
        "drill",
        "bucket of sap"
      ]
    },
    "themes": [
      "tree tapping",
      "foraging",
      "fields & orchards",
      "sap collector"
    ],
    "loadout": {
      "currency": {
        "copper": 2,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "drill",
        "bucket of sap"
      ],
      "equipment": [],
      "skills": [
        "tree tapping",
        "foraging"
      ],
      "craftProficiencies": {
        "cooking": 5
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Orchard shed when dawn bells ring.",
      "Uphold expectations within Fields & Orchards."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Fields & Orchards"
    },
    "jobBranching": {
      "startingRole": "Sap Collector",
      "advancement": [
        "Sap Collector Veteran",
        "Noted Sap Collector"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "sawyer",
    "title": "Sawyer",
    "legacyBackgrounds": [
      "Sawyer"
    ],
    "locations": [
      "Dancing Pines"
    ],
    "origin": {
      "summary": "Works the waterwheels cutting pine trunks for distant shipyards.",
      "hometown": "Lumberworks",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake to the hum of waterwheels and scent of fresh-cut pine in the Sawmill bunkhouse just before dawn. Your earplugs and sawblade rest atop your bedroll with three coppers in a pouch; the mill whistle will sound soon to start the day's cutting.",
      "sceneHook": "You wake to the hum of waterwheels and scent of fresh-cut pine in the Sawmill bunkhouse just before dawn.",
      "obligations": [
        "Report to Sawmill bunkhouse when dawn bells ring.",
        "Uphold expectations within Lumberworks."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Dancing Pines.",
      "Turn timber cutting into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Lumberworks."
    ],
    "appearance": {
      "summary": "Keeps sawblade close as a personal token.",
      "details": [
        "Notable belonging: sawblade.",
        "Notable belonging: earplugs."
      ],
      "motifs": [
        "sawblade",
        "earplugs"
      ]
    },
    "themes": [
      "timber cutting",
      "balance",
      "lumberworks",
      "sawyer"
    ],
    "loadout": {
      "currency": {
        "copper": 3,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "sawblade",
        "earplugs"
      ],
      "equipment": [],
      "skills": [
        "timber cutting",
        "balance"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Axe proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Sawmill bunkhouse when dawn bells ring.",
      "Uphold expectations within Lumberworks."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Lumberworks"
    },
    "jobBranching": {
      "startingRole": "Sawyer",
      "advancement": [
        "Sawyer Veteran",
        "Noted Sawyer"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "scribes-apprentice",
    "title": "Scribe'S Apprentice",
    "legacyBackgrounds": [
      "Scribe's apprentice"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Fresh from the academy, copies ledgers in the Hall of Records.",
      "hometown": "The Upper Ward",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake slumped over a ledger in the Hall of Records, dawn light slanting through tall windows. Ink-stained gloves cling to your quill set and a single silver piece rests in your purse; the head scribe's bell for copying duty will ring within the hour.",
      "sceneHook": "You wake slumped over a ledger in the Hall of Records, dawn light slanting through tall windows.",
      "obligations": [
        "Report to Hall of Records scriptorium when dawn bells ring.",
        "Uphold expectations within The Upper Ward."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn record keeping into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Upper Ward."
    ],
    "appearance": {
      "summary": "Often seen wearing ink-stained gloves.",
      "details": [
        "Favorite garment: ink-stained gloves.",
        "Notable belonging: quill set."
      ],
      "motifs": [
        "ink-stained gloves"
      ]
    },
    "themes": [
      "record keeping",
      "languages",
      "the upper ward",
      "scribe's apprentice"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 1,
        "gold": 0
      },
      "items": [
        "ink-stained gloves",
        "quill set"
      ],
      "equipment": [],
      "skills": [
        "record keeping",
        "languages"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Beginner"
      ]
    },
    "responsibilities": [
      "Report to Hall of Records scriptorium when dawn bells ring.",
      "Uphold expectations within The Upper Ward."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "lawful",
      "goodVsEvil": "good",
      "notes": "Community roots in The Upper Ward"
    },
    "jobBranching": {
      "startingRole": "Scribe'S Apprentice",
      "advancement": [
        "Journeyman Scribe'S",
        "Master Scribe'S"
      ],
      "sidePaths": [
        "Guild Instructor"
      ]
    }
  },
  {
    "id": "smugglers-runner",
    "title": "Smuggler'S Runner",
    "legacyBackgrounds": [
      "Smuggler's runner"
    ],
    "locations": [
      "Coral Keep"
    ],
    "origin": {
      "summary": "Carries contraband through night bazaars for a cut of the take.",
      "hometown": "The Northern Slums",
      "notes": []
    },
    "currentSituation": {
      "summary": "You stir in a damp shanty behind the Thieves' Market, clutching the hidden satchel that holds contraband and three coppers. A chill breeze slips through the boards while you pull on your cheap cloak; the contact expects the delivery before sunrise.",
      "sceneHook": "You stir in a damp shanty behind the Thieves' Market, clutching the hidden satchel that holds contraband and three coppers.",
      "obligations": [
        "Report to Thieves' Market shanty when dawn bells ring.",
        "Uphold expectations within The Northern Slums."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Coral Keep.",
      "Turn sneaking into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Northern Slums."
    ],
    "appearance": {
      "summary": "Often seen wearing cheap cloak.",
      "details": [
        "Favorite garment: cheap cloak.",
        "Notable belonging: hidden satchel."
      ],
      "motifs": [
        "cheap cloak"
      ]
    },
    "themes": [
      "sneaking",
      "streetwise",
      "the northern slums",
      "smuggler's runner"
    ],
    "loadout": {
      "currency": {
        "copper": 3,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "cheap cloak",
        "hidden satchel"
      ],
      "equipment": [],
      "skills": [
        "sneaking",
        "streetwise"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Club proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Thieves' Market shanty when dawn bells ring.",
      "Uphold expectations within The Northern Slums."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "chaotic",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Northern Slums"
    },
    "jobBranching": {
      "startingRole": "Smuggler'S Runner",
      "advancement": [
        "Smuggler'S Runner Veteran",
        "Noted Smuggler'S Runner"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "street-artist",
    "title": "Street Artist",
    "legacyBackgrounds": [
      "Street artist"
    ],
    "locations": [
      "Corner Stone"
    ],
    "origin": {
      "summary": "Chalks portraits for tourists while seeking patronage for larger works.",
      "hometown": "Stonecrest Town",
      "notes": []
    },
    "currentSituation": {
      "summary": "You stretch beside your easel in Crystal Court Plaza while morning shoppers drift past under a clear sky. Charcoal sticks, a folded easel, and five coppers wait in your bag; you must sketch quickly to entice a patron before the plaza grows crowded.",
      "sceneHook": "You stretch beside your easel in Crystal Court Plaza while morning shoppers drift past under a clear sky.",
      "obligations": [
        "Report to Crystal Court Plaza when dawn bells ring.",
        "Uphold expectations within Stonecrest Town."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corner Stone.",
      "Turn sketching into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Stonecrest Town."
    ],
    "appearance": {
      "summary": "Keeps charcoal sticks close as a personal token.",
      "details": [
        "Notable belonging: charcoal sticks.",
        "Notable belonging: folded easel."
      ],
      "motifs": [
        "charcoal sticks",
        "folded easel"
      ]
    },
    "themes": [
      "sketching",
      "persuasion",
      "stonecrest town",
      "street artist"
    ],
    "loadout": {
      "currency": {
        "copper": 5,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "charcoal sticks",
        "folded easel"
      ],
      "equipment": [],
      "skills": [
        "sketching",
        "persuasion"
      ],
      "craftProficiencies": {
        "drawing": 15
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Crystal Court Plaza when dawn bells ring.",
      "Uphold expectations within Stonecrest Town."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Stonecrest Town"
    },
    "jobBranching": {
      "startingRole": "Street Artist",
      "advancement": [
        "Street Artist Veteran",
        "Noted Street Artist"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "street-performer",
    "title": "Street Performer",
    "legacyBackgrounds": [
      "Street performer"
    ],
    "locations": [
      "Coral Keep"
    ],
    "origin": {
      "summary": "Played lute for market crowds until debts pushed you to filching purses.",
      "hometown": "The Old City",
      "notes": []
    },
    "currentSituation": {
      "summary": "You blink awake beneath your stall in Old Market Square as merchants raise awnings in the cool dawn. Your lute and pouch of copper rings sit beside four coppers and threadbare clothes; crowds gather soon and you must tune before the square fills.",
      "sceneHook": "You blink awake beneath your stall in Old Market Square as merchants raise awnings in the cool dawn.",
      "obligations": [
        "Report to Old Market Square stall when dawn bells ring.",
        "Uphold expectations within The Old City."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Coral Keep.",
      "Turn busking into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Old City."
    ],
    "appearance": {
      "summary": "Keeps lute close as a personal token.",
      "details": [
        "Notable belonging: lute.",
        "Notable belonging: pouch of copper rings."
      ],
      "motifs": [
        "lute",
        "pouch of copper rings"
      ]
    },
    "themes": [
      "busking",
      "pickpocketing",
      "the old city",
      "street performer"
    ],
    "loadout": {
      "currency": {
        "copper": 4,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "lute",
        "pouch of copper rings"
      ],
      "equipment": [],
      "skills": [
        "busking",
        "pickpocketing"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Dagger proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Old Market Square stall when dawn bells ring.",
      "Uphold expectations within The Old City."
    ],
    "defaultClassOptions": [
      "Ninja / Assassin",
      "Swashbuckler / Duelist"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Old City"
    },
    "jobBranching": {
      "startingRole": "Street Performer",
      "advancement": [
        "Street Performer Veteran",
        "Noted Street Performer"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "tea-picker",
    "title": "Tea Picker",
    "legacyBackgrounds": [
      "Tea picker"
    ],
    "locations": [
      "Mountain Top"
    ],
    "origin": {
      "summary": "Tends terraced gardens, dreaming of selling a rare blend in Corona.",
      "hometown": "Terraces & Farms",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake on a straw mat beside the misty tea rows, dew beading on the leaves in the cool morning. Shears and a satchel of tea leaves sit within reach along with five coppers in a small pouch; the pickers must fill baskets before the sun dries the fields.",
      "sceneHook": "You wake on a straw mat beside the misty tea rows, dew beading on the leaves in the cool morning.",
      "obligations": [
        "Report to Tea Gardens shack when dawn bells ring.",
        "Uphold expectations within Terraces & Farms."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Mountain Top.",
      "Turn pruning into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Terraces & Farms."
    ],
    "appearance": {
      "summary": "Keeps shears close as a personal token.",
      "details": [
        "Notable belonging: shears.",
        "Notable belonging: satchel of tea leaves."
      ],
      "motifs": [
        "shears",
        "satchel of tea leaves"
      ]
    },
    "themes": [
      "pruning",
      "tea tasting",
      "terraces & farms",
      "tea picker"
    ],
    "loadout": {
      "currency": {
        "copper": 5,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "shears",
        "satchel of tea leaves"
      ],
      "equipment": [],
      "skills": [
        "pruning",
        "tea tasting"
      ],
      "craftProficiencies": {
        "gardening": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Tea Gardens shack when dawn bells ring.",
      "Uphold expectations within Terraces & Farms."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Terraces & Farms"
    },
    "jobBranching": {
      "startingRole": "Tea Picker",
      "advancement": [
        "Tea Picker Veteran",
        "Noted Tea Picker"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "tea-stall-owner",
    "title": "Tea Stall Owner",
    "legacyBackgrounds": [
      "Tea stall owner"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Orchard-keeper's daughter who opened her own stall near the Sunleaf Inn.",
      "hometown": "The Lower Gardens",
      "notes": []
    },
    "currentSituation": {
      "summary": "You unroll the shutters of your tea stall beside the Sunleaf Inn just as a golden dawn breaks over the Lower Gardens. Tea tins and ledger sit arranged on the counter and an eight-silver cache rests in a lockbox beneath; opening at six each morning has become routine.",
      "sceneHook": "You unroll the shutters of your tea stall beside the Sunleaf Inn just as a golden dawn breaks over the Lower Gardens.",
      "obligations": [
        "Report to Tea stall by the Sunleaf Inn when dawn bells ring.",
        "Uphold expectations within The Lower Gardens."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn tea brewing into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Lower Gardens."
    ],
    "appearance": {
      "summary": "Keeps tea tins close as a personal token.",
      "details": [
        "Notable belonging: tea tins.",
        "Notable belonging: ledger."
      ],
      "motifs": [
        "tea tins",
        "ledger"
      ]
    },
    "themes": [
      "tea brewing",
      "haggling",
      "the lower gardens",
      "tea stall owner"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 8,
        "gold": 0
      },
      "items": [
        "tea tins",
        "ledger"
      ],
      "equipment": [],
      "skills": [
        "tea brewing",
        "haggling"
      ],
      "craftProficiencies": {
        "brewing": 20
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Beginner"
      ]
    },
    "responsibilities": [
      "Report to Tea stall by the Sunleaf Inn when dawn bells ring.",
      "Uphold expectations within The Lower Gardens."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Lower Gardens"
    },
    "jobBranching": {
      "startingRole": "Tea Stall Owner",
      "advancement": [
        "Tea Stall Owner Veteran",
        "Noted Tea Stall Owner"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "trapper",
    "title": "Trapper",
    "legacyBackgrounds": [
      "Trapper"
    ],
    "locations": [
      "Dancing Pines"
    ],
    "origin": {
      "summary": "Sets snares for wild poultry and pelts, selling them to the Pinehall.",
      "hometown": "Hunter's Quarter",
      "notes": []
    },
    "currentSituation": {
      "summary": "You rise from a cot in the Hunter's Lodge while the smell of smoked meat mingles with the crisp dawn air. Snare wire and a fur-lined cloak hang from a peg, four coppers tucked inside; you must set your lines before the sun climbs.",
      "sceneHook": "You rise from a cot in the Hunter's Lodge while the smell of smoked meat mingles with the crisp dawn air.",
      "obligations": [
        "Report to Hunter's Lodge bunk when dawn bells ring.",
        "Uphold expectations within Hunter's Quarter."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Dancing Pines.",
      "Turn tracking into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Hunter's Quarter."
    ],
    "appearance": {
      "summary": "Often seen wearing fur-lined cloak.",
      "details": [
        "Favorite garment: fur-lined cloak.",
        "Notable belonging: snare wire."
      ],
      "motifs": [
        "fur-lined cloak"
      ]
    },
    "themes": [
      "tracking",
      "skinning",
      "hunter's quarter",
      "trapper"
    ],
    "loadout": {
      "currency": {
        "copper": 4,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "fur-lined cloak",
        "snare wire"
      ],
      "equipment": [],
      "skills": [
        "tracking",
        "skinning"
      ],
      "craftProficiencies": {
        "tanning": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Bow proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Hunter's Lodge bunk when dawn bells ring.",
      "Uphold expectations within Hunter's Quarter."
    ],
    "defaultClassOptions": [
      "Scout / Ranger",
      "Archer / Marksman"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Hunter's Quarter"
    },
    "jobBranching": {
      "startingRole": "Trapper",
      "advancement": [
        "Trapper Veteran",
        "Noted Trapper"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "tunnel-scout",
    "title": "Tunnel Scout",
    "legacyBackgrounds": [
      "Tunnel scout"
    ],
    "locations": [
      "Dancing Pines"
    ],
    "origin": {
      "summary": "Crawls ahead of the miners, marking safe seams and stray glittering veins.",
      "hometown": "Diamond Mines",
      "notes": []
    },
    "currentSituation": {
      "summary": "You shake off sleep at the mine mouth, morning chill seeping through the rock as you spark your hooded lantern. Chalk line slips behind your ear and five coppers jingle in your pocket; miners wait for your signal before they descend.",
      "sceneHook": "You shake off sleep at the mine mouth, morning chill seeping through the rock as you spark your hooded lantern.",
      "obligations": [
        "Report to Diamond Mine entrance when dawn bells ring.",
        "Uphold expectations within Diamond Mines."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Dancing Pines.",
      "Turn scouting into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Diamond Mines."
    ],
    "appearance": {
      "summary": "Often seen wearing hooded lantern.",
      "details": [
        "Favorite garment: hooded lantern.",
        "Notable belonging: chalk line."
      ],
      "motifs": [
        "hooded lantern"
      ]
    },
    "themes": [
      "scouting",
      "stone sense",
      "diamond mines",
      "tunnel scout"
    ],
    "loadout": {
      "currency": {
        "copper": 5,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "hooded lantern",
        "chalk line"
      ],
      "equipment": [],
      "skills": [
        "scouting",
        "stone sense"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Dagger proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Diamond Mine entrance when dawn bells ring.",
      "Uphold expectations within Diamond Mines."
    ],
    "defaultClassOptions": [
      "Ninja / Assassin",
      "Swashbuckler / Duelist"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Diamond Mines"
    },
    "jobBranching": {
      "startingRole": "Tunnel Scout",
      "advancement": [
        "Tunnel Scout Veteran",
        "Noted Tunnel Scout"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "unemployed-vagrant",
    "title": "Unemployed Vagrant",
    "legacyBackgrounds": [
      "Unemployed vagrant"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Found washed ashore with no memory; nursed at the Shrine of the Deep Current.",
      "hometown": "The Port District",
      "notes": []
    },
    "currentSituation": {
      "summary": "You blink up at the carved ceiling of the Shrine of the Deep Current, incense smoke drifting through the dawn stillness. Clutching the weathered locket—the only thing you own—you hear the distant surf and know the priests will send you out once prayers end.",
      "sceneHook": "You blink up at the carved ceiling of the Shrine of the Deep Current, incense smoke drifting through the dawn stillness.",
      "obligations": [
        "Report to Shrine of the Deep Current when dawn bells ring.",
        "Uphold expectations within The Port District."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn swimming into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Port District."
    ],
    "appearance": {
      "summary": "Keeps weathered locket close as a personal token.",
      "details": [
        "Notable belonging: weathered locket."
      ],
      "motifs": [
        "weathered locket"
      ]
    },
    "themes": [
      "swimming",
      "sea songs",
      "the port district",
      "unemployed vagrant"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "weathered locket"
      ],
      "equipment": [],
      "skills": [
        "swimming",
        "sea songs"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Shrine of the Deep Current when dawn bells ring.",
      "Uphold expectations within The Port District."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "chaotic",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Port District"
    },
    "jobBranching": {
      "startingRole": "Unemployed Vagrant",
      "advancement": [
        "Unemployed Vagrant Veteran",
        "Noted Unemployed Vagrant"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "veteran-watchman",
    "title": "Veteran Watchman",
    "legacyBackgrounds": [
      "Veteran watchman"
    ],
    "locations": [
      "Corona"
    ],
    "origin": {
      "summary": "Spent decades patrolling the wall that holds back the misty frontier.",
      "hometown": "The Wetlands Wall",
      "notes": []
    },
    "currentSituation": {
      "summary": "You stand from your post on the Bastion Fort as dawn burns away the wetlands fog below. Long spear in hand and weathered cloak about your shoulders, one silver rests in your purse; the next patrol begins at seventh bell.",
      "sceneHook": "You stand from your post on the Bastion Fort as dawn burns away the wetlands fog below.",
      "obligations": [
        "Report to Bastion Fort ramparts when dawn bells ring.",
        "Uphold expectations within The Wetlands Wall."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Corona.",
      "Turn tracking into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Wetlands Wall."
    ],
    "appearance": {
      "summary": "Often seen wearing weathered cloak.",
      "details": [
        "Favorite garment: weathered cloak.",
        "Wields long spear when needed."
      ],
      "motifs": [
        "weathered cloak"
      ]
    },
    "themes": [
      "tracking",
      "endurance",
      "the wetlands wall",
      "veteran watchman"
    ],
    "loadout": {
      "currency": {
        "copper": 0,
        "silver": 1,
        "gold": 0
      },
      "items": [
        "weathered cloak",
        "long spear"
      ],
      "equipment": [
        "long spear"
      ],
      "skills": [
        "tracking",
        "endurance"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Spear proficiency 30 (adept)"
      ]
    },
    "responsibilities": [
      "Report to Bastion Fort ramparts when dawn bells ring.",
      "Uphold expectations within The Wetlands Wall."
    ],
    "defaultClassOptions": [
      "Knight / Paladin",
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "lawful",
      "goodVsEvil": "good",
      "notes": "Community roots in The Wetlands Wall"
    },
    "jobBranching": {
      "startingRole": "Veteran Watchman",
      "advancement": [
        "Watch Sergeant",
        "City Captain"
      ],
      "sidePaths": [
        "Investigator"
      ]
    }
  },
  {
    "id": "wagoneer",
    "title": "Wagoneer",
    "legacyBackgrounds": [
      "Wagoneer"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Teamster who guides caravans through the gate while searching for his missing father.",
      "hometown": "The High Road District",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake atop a wagon in the caravan yard, horses stamping nearby while a cool pre-dawn breeze carries dust. Sturdy gloves and a horse brush sit on the seat next to a pouch with seven copper coins; the caravan forms up at first light and you ready the reins.",
      "sceneHook": "You wake atop a wagon in the caravan yard, horses stamping nearby while a cool pre-dawn breeze carries dust.",
      "obligations": [
        "Report to Caravan staging yard wagon when dawn bells ring.",
        "Uphold expectations within The High Road District."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn animal handling into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The High Road District."
    ],
    "appearance": {
      "summary": "Often seen wearing sturdy gloves.",
      "details": [
        "Favorite garment: sturdy gloves.",
        "Notable belonging: horse brush."
      ],
      "motifs": [
        "sturdy gloves"
      ]
    },
    "themes": [
      "animal handling",
      "driving wagons",
      "the high road district",
      "wagoneer"
    ],
    "loadout": {
      "currency": {
        "copper": 7,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "sturdy gloves",
        "horse brush"
      ],
      "equipment": [],
      "skills": [
        "animal handling",
        "driving wagons"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Beginner"
      ]
    },
    "responsibilities": [
      "Report to Caravan staging yard wagon when dawn bells ring.",
      "Uphold expectations within The High Road District."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The High Road District"
    },
    "jobBranching": {
      "startingRole": "Wagoneer",
      "advancement": [
        "Wagoneer Veteran",
        "Noted Wagoneer"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "young-farmhand",
    "title": "Young Farmhand",
    "legacyBackgrounds": [
      "Young farmhand"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Fresh from basic schooling, works the family plot while dreaming of city life.",
      "hometown": "The Farmlands",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake on your family's farmstead beyond the walls, rooster crows echoing through the misty fields. Hoe and seed pouch sit beside your single copper piece; morning chores must be finished before you can head toward the city.",
      "sceneHook": "You wake on your family's farmstead beyond the walls, rooster crows echoing through the misty fields.",
      "obligations": [
        "Report to Family farmstead when dawn bells ring.",
        "Uphold expectations within The Farmlands."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn crop rotation into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Farmlands."
    ],
    "appearance": {
      "summary": "Keeps hoe close as a personal token.",
      "details": [
        "Notable belonging: hoe.",
        "Notable belonging: seed pouch."
      ],
      "motifs": [
        "hoe",
        "seed pouch"
      ]
    },
    "themes": [
      "crop rotation",
      "animal care",
      "the farmlands",
      "young farmhand"
    ],
    "loadout": {
      "currency": {
        "copper": 1,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "hoe",
        "seed pouch"
      ],
      "equipment": [],
      "skills": [
        "crop rotation",
        "animal care"
      ],
      "craftProficiencies": {
        "farming": 10
      },
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Family farmstead when dawn bells ring.",
      "Uphold expectations within The Farmlands."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Farmlands"
    },
    "jobBranching": {
      "startingRole": "Young Farmhand",
      "advancement": [
        "Young Farmhand Veteran",
        "Noted Young Farmhand"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "young-miner",
    "title": "Young Miner",
    "legacyBackgrounds": [
      "Young miner"
    ],
    "locations": [
      "Warm Springs"
    ],
    "origin": {
      "summary": "Chipped ore since childhood, hoping to strike a vein of silver.",
      "hometown": "The Mines",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake to the clatter of carts outside the mine barrack, lantern already sputtering in the pre-dawn gloom. Short pick hangs from a peg with three coppers in your pocket; the shift descends at first bell.",
      "sceneHook": "You wake to the clatter of carts outside the mine barrack, lantern already sputtering in the pre-dawn gloom.",
      "obligations": [
        "Report to Mine entrance barrack when dawn bells ring.",
        "Uphold expectations within The Mines."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Warm Springs.",
      "Turn tunneling into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in The Mines."
    ],
    "appearance": {
      "summary": "Keeps short pick ready for unexpected trouble.",
      "details": [
        "Wields short pick when needed.",
        "Notable belonging: dusty lantern."
      ],
      "motifs": [
        "short pick"
      ]
    },
    "themes": [
      "tunneling",
      "endurance",
      "the mines",
      "young miner"
    ],
    "loadout": {
      "currency": {
        "copper": 3,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "short pick",
        "dusty lantern"
      ],
      "equipment": [
        "short pick"
      ],
      "skills": [
        "tunneling",
        "endurance"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Pick proficiency 10 (beginner)"
      ]
    },
    "responsibilities": [
      "Report to Mine entrance barrack when dawn bells ring.",
      "Uphold expectations within The Mines."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in The Mines"
    },
    "jobBranching": {
      "startingRole": "Young Miner",
      "advancement": [
        "Young Miner Veteran",
        "Noted Young Miner"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  },
  {
    "id": "young-tutor",
    "title": "Young Tutor",
    "legacyBackgrounds": [
      "Young tutor"
    ],
    "locations": [
      "Wave's Break"
    ],
    "origin": {
      "summary": "Just out of the city school, she teaches alley children in exchange for meals.",
      "hometown": "Little Terns",
      "notes": []
    },
    "currentSituation": {
      "summary": "You wake on a bench in your improvised alley classroom, yesterday's sums still chalked across the stone wall. Chalk and primer book sit beside your lone copper piece as the dawn chill creeps in; the children will arrive by sunrise for lessons.",
      "sceneHook": "You wake on a bench in your improvised alley classroom, yesterday's sums still chalked across the stone wall.",
      "obligations": [
        "Report to Alleyway classroom when dawn bells ring.",
        "Uphold expectations within Little Terns."
      ]
    },
    "motivation": [
      "Prove ${pronoun.reflexive} worthy beyond Wave's Break.",
      "Turn teaching into a renowned talent across the realm.",
      "Protect ${pronoun.possessive} community ties in Little Terns."
    ],
    "appearance": {
      "summary": "Keeps chalk close as a personal token.",
      "details": [
        "Notable belonging: chalk.",
        "Notable belonging: primer book."
      ],
      "motifs": [
        "chalk",
        "primer book"
      ]
    },
    "themes": [
      "teaching",
      "arithmetic",
      "little terns",
      "young tutor"
    ],
    "loadout": {
      "currency": {
        "copper": 1,
        "silver": 0,
        "gold": 0
      },
      "items": [
        "chalk",
        "primer book"
      ],
      "equipment": [],
      "skills": [
        "teaching",
        "arithmetic"
      ],
      "craftProficiencies": {},
      "gatheringProficiencies": {},
      "combatTraining": [
        "Untrained"
      ]
    },
    "responsibilities": [
      "Report to Alleyway classroom when dawn bells ring.",
      "Uphold expectations within Little Terns."
    ],
    "defaultClassOptions": [
      "Fighter / Warrior"
    ],
    "alignmentBias": {
      "lawVsChaos": "neutral",
      "goodVsEvil": "neutral",
      "notes": "Community roots in Little Terns"
    },
    "jobBranching": {
      "startingRole": "Young Tutor",
      "advancement": [
        "Young Tutor Veteran",
        "Noted Young Tutor"
      ],
      "sidePaths": [
        "Freelancer"
      ]
    }
  }
];

export const BACKSTORY_BY_ID = Object.fromEntries(BACKSTORIES.map(backstory => [backstory.id, backstory] as const));

export const LEGACY_BACKSTORY_LOOKUP = new Map<string, RichBackstory>(
  BACKSTORIES.flatMap(backstory => backstory.legacyBackgrounds.map(name => [name, backstory] as const))
);
