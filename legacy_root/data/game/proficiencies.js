import { gainGatherProficiency, performGathering } from "./gathering_proficiency.js";
import { gainCraftProficiency } from "./crafting_proficiency.js";
import { performCraft, trainingCraft, resetCraftTracking, } from "./craft_skill_tracker.js";
import { gainSwimming, gainSailing, gainRiding, gainTrapping, performOutdoorActivity } from "./outdoor_skills.js";
import { gainHuntingProficiency, performHunt } from "./hunting_proficiency.js";
import { gainInstrumentProficiency } from "./instrument_songs.js";
import { gainDanceProficiency } from "./dance_proficiency.js";
import { gainSingingProficiency } from "./singing_proficiency.js";
import { gainAnimalHandling } from "./animal_handling_proficiency.js";
import { gainSwordProficiency, gainGreatswordProficiency, gainAxeProficiency, gainGreataxeProficiency, gainSpearProficiency, gainDaggerProficiency, gainMaceProficiency, gainBowProficiency, gainCrossbowProficiency, gainStaffProficiency, gainShieldProficiency, gainWandProficiency, gainUnarmedProficiency, } from "./weapon_proficiency.js";
import { applyLightArmorProficiencyGain, applyMediumArmorProficiencyGain, applyHeavyArmorProficiencyGain, } from "./armor_proficiency.js";
import { gainReactiveProficiency } from "./reactive_proficiency.js";
import { gainElementProficiency } from "./spell_proficiency.js";
const OUTDOOR_GAINERS = {
    swimming: gainSwimming,
    sailing: gainSailing,
    riding: gainRiding,
    trapping: gainTrapping,
};
function createGatheringProgression(skill) {
    return {
        type: "gathering",
        skill,
        gain: gainGatherProficiency,
        perform: performGathering,
    };
}
function createCraftingProgression(craft) {
    return {
        type: "crafting",
        craft,
        gain: gainCraftProficiency,
        perform: performCraft,
        train: trainingCraft,
        reset: resetCraftTracking,
    };
}
function createOutdoorProgression(skill) {
    return {
        type: "outdoor",
        skill,
        gain: OUTDOOR_GAINERS[skill],
        perform: performOutdoorActivity,
    };
}
function createHuntingProgression() {
    return {
        type: "outdoor",
        skill: "hunting",
        gain: gainHuntingProficiency,
        perform: performHunt,
    };
}
function createAnimalHandlingProgression(animal) {
    return {
        type: "animalHandling",
        animal,
        gain: gainAnimalHandling,
    };
}
function createPerformanceProgression(discipline) {
    if (discipline === "instrument") {
        return { type: "performance", discipline, gain: gainInstrumentProficiency };
    }
    if (discipline === "dance") {
        return { type: "performance", discipline, gain: gainDanceProficiency };
    }
    return { type: "performance", discipline: "singing", gain: gainSingingProficiency };
}
function createWeaponProgression(weapon, gain) {
    return { type: "weapon", weapon, gain };
}
function createArmorProgression(armor, gain) {
    return { type: "armor", armor, gain };
}
function createDefenseProgression(defense) {
    return { type: "defense", defense, gain: gainReactiveProficiency };
}
function createElementalProgression(element) {
    return { type: "magic", school: "element", element, gain: gainElementProficiency };
}
function createDefinition(category, input) {
    const { id: explicitId, key, name, description, synonyms = [], tags = [], progression, kinds, } = input;
    const synonymSet = new Set();
    synonymSet.add(name.toLowerCase());
    synonymSet.add(key.toLowerCase());
    for (const label of synonyms) {
        synonymSet.add(label.toLowerCase());
    }
    const tagSet = new Set([category, ...tags]);
    return {
        id: explicitId !== null && explicitId !== void 0 ? explicitId : `${category}.${key}`,
        key,
        name,
        category,
        description,
        synonyms: [...synonymSet],
        tags: [...tagSet],
        progression,
        kinds,
    };
}
const GATHERING_PROFICIENCIES = [
    createDefinition("gathering", {
        key: "logging",
        name: "Logging",
        description: "Felling timber and preparing logs for transport.",
        synonyms: ["woodcutting", "lumbering", "timberwork", "forestry"],
        tags: ["timber", "wood"],
        progression: createGatheringProgression("logging"),
        kinds: ["Gather_Logging"],
    }),
    createDefinition("gathering", {
        key: "mining",
        name: "Mining",
        description: "Extracting ore, stone, and crystal from the earth.",
        synonyms: ["delving", "prospecting"],
        tags: ["ore", "stone"],
        progression: createGatheringProgression("mining"),
        kinds: ["Gather_Mining"],
    }),
    createDefinition("gathering", {
        key: "foraging",
        name: "Foraging",
        description: "Gathering wild herbs, mushrooms, and edible plants.",
        synonyms: ["gathering", "wildcraft", "wildcrafting"],
        tags: ["wilds", "plants"],
        progression: createGatheringProgression("foraging"),
        kinds: ["Gather_Foraging"],
    }),
    createDefinition("gathering", {
        key: "farming",
        name: "Farming",
        description: "Managing tilled fields, crop rotations, and irrigation.",
        synonyms: ["agriculture", "fieldwork", "plowing"],
        tags: ["fields"],
        progression: createGatheringProgression("farming"),
        kinds: ["Gather_Farming"],
    }),
    createDefinition("gathering", {
        key: "gardening",
        name: "Gardening",
        description: "Tending beds, trellises, and decorative plantings.",
        synonyms: ["horticulture", "market gardening"],
        tags: ["botany", "home"],
        progression: createGatheringProgression("gardening"),
        kinds: ["Gather_Gardening"],
    }),
    createDefinition("gathering", {
        key: "herbalism",
        name: "Herbalism",
        description: "Identifying, harvesting, and preparing medicinal plants.",
        synonyms: ["herb lore", "herbology", "botany"],
        tags: ["healing", "plants"],
        progression: createGatheringProgression("herbalism"),
        kinds: ["Gather_Herbalism"],
    }),
    createDefinition("gathering", {
        key: "fishing",
        name: "Fishing",
        description: "Casting lines, nets, and traps to haul in aquatic catch.",
        synonyms: ["angling", "net casting", "line fishing", "shore casting"],
        tags: ["water", "provisioning"],
        progression: createGatheringProgression("fishing"),
        kinds: ["Gather_Fishing"],
    }),
    createDefinition("gathering", {
        key: "viticulture",
        name: "Viticulture",
        description: "Cultivating grapes and stewarding healthy vineyards.",
        synonyms: ["vine-tending", "vineyard keeping", "vintner's fieldwork"],
        tags: ["grapes", "vineyard"],
        progression: createGatheringProgression("viticulture"),
    }),
    createDefinition("gathering", {
        key: "pearlDiving",
        name: "Pearl Diving",
        description: "Harvesting pearls and curios from reef shallows.",
        synonyms: ["pearl diving", "pearl-diving", "diver", "reef diving", "pearl hunter"],
        tags: ["sea", "gathering"],
        progression: createGatheringProgression("pearlDiving"),
        kinds: ["Gather_PearlDiving"],
    }),
];
const CRAFTING_PROFICIENCIES = [
    createDefinition("crafting", {
        key: "glassblowing",
        name: "Glassblowing",
        description: "Shaping molten glass into vessels, panes, and art.",
        synonyms: ["glassblowing", "glassmaking", "glass making", "glassworker", "glass"],
        tags: ["glass", "artisan"],
        progression: createCraftingProgression("glassblowing"),
    }),
    createDefinition("crafting", {
        key: "blacksmithing",
        name: "Blacksmithing",
        description: "Forging blades, fittings, and tools at the anvil.",
        synonyms: ["blacksmithing", "smithing", "smith's tools", "smiths tools", "forgework", "smith"],
        tags: ["metal", "forge"],
        progression: createCraftingProgression("blacksmithing"),
    }),
    createDefinition("crafting", {
        key: "carpentry",
        name: "Carpentry",
        description: "Cutting and joining timber for structures and goods.",
        synonyms: ["carpentry", "woodworking", "woodcraft", "timbercraft"],
        tags: ["wood", "construction"],
        progression: createCraftingProgression("carpentry"),
        kinds: ["Craft_Carpentry"],
    }),
    createDefinition("crafting", {
        key: "tailoring",
        name: "Tailoring",
        description: "Patterning and sewing garments, banners, and finery.",
        synonyms: ["tailoring", "sewing", "needlework", "clothier"],
        tags: ["cloth", "artisan"],
        progression: createCraftingProgression("tailoring"),
    }),
    createDefinition("crafting", {
        key: "leatherworking",
        name: "Leatherworking",
        description: "Tanning hides and crafting durable leather goods.",
        synonyms: ["leatherworking", "tanning", "leatherwright", "leatherwork"],
        tags: ["leather", "armor"],
        progression: createCraftingProgression("leatherworking"),
    }),
    createDefinition("crafting", {
        key: "alchemy",
        name: "Alchemy",
        description: "Distilling reagents, tonics, and volatile concoctions.",
        synonyms: ["alchemy", "alchemist", "alchemist's supplies", "potion brewing"],
        tags: ["laboratory", "craft"],
        progression: createCraftingProgression("alchemy"),
        kinds: ["Craft_Alchemy"],
    }),
    createDefinition("crafting", {
        key: "enchanting",
        name: "Enchanting",
        description: "Binding runes and planar energy into items.",
        synonyms: ["enchanting", "enchantment", "enchanter", "rune weaving"],
        tags: ["arcane", "craft"],
        progression: createCraftingProgression("enchanting"),
    }),
    createDefinition("crafting", {
        key: "masonry",
        name: "Masonry",
        description: "Shaping and setting stone for sturdy works.",
        synonyms: ["masonry", "stonework", "stonemasonry", "mason's tools", "stonecutting"],
        tags: ["stone", "construction"],
        progression: createCraftingProgression("masonry"),
    }),
    createDefinition("crafting", {
        key: "textiles",
        name: "Textiles",
        description: "Spinning fibers and weaving bolts, nets, and cloth.",
        synonyms: ["textiles", "weaving", "loomwork", "loom work", "net weaving", "net repair", "glowfiber", "rett mastery", "wool handling", "spinner"],
        tags: ["cloth", "artisan"],
        progression: createCraftingProgression("textiles"),
        kinds: ["Craft_Weaving"],
    }),
    createDefinition("crafting", {
        key: "brewing",
        name: "Brewing",
        description: "Fermenting teas, ales, and tonics with steady hands.",
        synonyms: ["brewing", "brewer", "brewer's tools", "brewers tools", "brewcraft", "cellarer brewer's"],
        tags: ["fermentation", "kitchen"],
        kinds: ["Craft_Brewing"],
    }),
    createDefinition("crafting", {
        key: "vintnersTools",
        name: "Vintner's Tools",
        description: "Tending presses, casks, and cellars for fine wines.",
        synonyms: ["vintner's tools", "vintners tools", "vintner", "wine making", "winemaking", "cellarer"],
        tags: ["fermentation", "wine"],
    }),
    createDefinition("crafting", {
        key: "calligraphy",
        name: "Calligraphy",
        description: "Inking elegant scripts and illuminated manuscripts.",
        synonyms: ["calligraphy", "calligrapher", "scribe", "writing", "script"],
        tags: ["scribe", "art"],
        kinds: ["Craft_Calligraphy"],
    }),
    createDefinition("crafting", {
        key: "cheesemaking",
        name: "Cheesemaking",
        description: "Curdling, aging, and tending wheels of cheese.",
        synonyms: ["cheesemaking", "cheese making", "cheesemonger", "dairy craft"],
        tags: ["dairy", "kitchen"],
    }),
    createDefinition("crafting", {
        key: "cooking",
        name: "Cooking",
        description: "Preparing meals, sauces, and festival fare.",
        synonyms: ["cooking", "culinary", "chef"],
        tags: ["kitchen", "provisioning"],
        kinds: ["Craft_Cooking"],
    }),
    createDefinition("crafting", {
        key: "carving",
        name: "Carving",
        description: "Etching runes and motifs into wood, bone, or stone.",
        synonyms: ["carving", "engraving", "rune carving"],
        tags: ["detail", "artisan"],
    }),
    createDefinition("crafting", {
        key: "millerTools",
        name: "Miller's Tools",
        description: "Maintaining millstones, gearing, and grain flow.",
        synonyms: ["miller's tools", "millers tools", "milling", "grain milling"],
        tags: ["grain", "mechanical"],
    }),
    createDefinition("crafting", {
        key: "fletching",
        name: "Fletching",
        description: "Cutting shafts, shaping flights, and balancing arrows.",
        synonyms: ["fletching", "arrow making", "arrow-making", "arrowcraft", "flight crafting"],
        tags: ["bows", "arrows"],
        kinds: ["Craft_Fletching"],
    }),
    createDefinition("crafting", {
        key: "rope",
        name: "Rope Making",
        description: "Twisting fibers into durable lines and netting for trade fleets.",
        synonyms: ["rope making", "rope-making", "ropewalk", "rope twining", "rope maker"],
        tags: ["fiber", "rigging"],
        kinds: ["Craft_Rope"],
    }),
    createDefinition("crafting", {
        key: "drawing",
        name: "Drawing",
        description: "Sketching plans, sigils, and scenes with steady hands.",
        synonyms: ["drawing", "sketching", "drafting", "illustration"],
        tags: ["art", "design"],
        kinds: ["Craft_Drawing"],
    }),
];
const TOOL_PROFICIENCIES = [
    createDefinition("tool", {
        key: "ropework",
        name: "Ropework",
        description: "Splicing, rigging, and maintaining load-bearing lines.",
        synonyms: ["ropework", "rope work", "rope use", "rope handling", "rope-making", "ropemaking"],
        tags: ["rigging", "harbor"],
    }),
    createDefinition("tool", {
        key: "signalFlags",
        name: "Signal Flags",
        description: "Using semaphore flags to convey naval orders.",
        synonyms: ["signal flags", "signal flag", "semaphore", "flag signaling"],
        tags: ["navigation", "harbor"],
    }),
    createDefinition("tool", {
        key: "navigatorsTools",
        name: "Navigator's Tools",
        description: "Charting courses with sextants, lodestones, and charts.",
        synonyms: ["navigator's tools", "navigators tools", "navigation tools", "astrolabe"],
        tags: ["navigation", "sea"],
    }),
    createDefinition("tool", {
        key: "jewelersTools",
        name: "Jeweler's Tools",
        description: "Setting gems and engraving intricate metalwork.",
        synonyms: ["jeweler's tools", "jewelers tools", "jewelry tools"],
        tags: ["artisan", "detail"],
    }),
];
const OUTDOOR_PROFICIENCIES = [
    createDefinition("outdoor", {
        key: "swimming",
        name: "Swimming",
        description: "Building endurance and technique in open water.",
        synonyms: ["swimming", "swim training"],
        tags: ["sea", "fitness"],
        progression: createOutdoorProgression("swimming"),
        kinds: ["Swimming"],
    }),
    createDefinition("outdoor", {
        key: "sailing",
        name: "Sailing",
        description: "Handling helm and sails through shifting winds.",
        synonyms: ["sailing", "helmsmanship"],
        tags: ["sea", "navigation"],
        progression: createOutdoorProgression("sailing"),
        kinds: ["Sailing"],
    }),
    createDefinition("outdoor", {
        key: "riding",
        name: "Riding",
        description: "Guiding mounts at speed and over rough terrain.",
        synonyms: ["riding", "horseback riding", "mounted riding"],
        tags: ["mounted", "travel"],
        progression: createOutdoorProgression("riding"),
        kinds: ["Riding"],
    }),
    createDefinition("outdoor", {
        key: "climbing",
        name: "Climbing",
        description: "Scaling cliffs and structures with ropes and gear.",
        synonyms: ["climbing", "rope climbing", "belaying"],
        tags: ["mountain", "safety"],
    }),
    createDefinition("outdoor", {
        key: "trapping",
        name: "Trapping",
        description: "Setting snares, deadfalls, and cages along wilderness paths.",
        synonyms: ["trapping", "snaring", "trap setting", "trapmaking"],
        tags: ["wilds", "survival"],
        progression: createOutdoorProgression("trapping"),
    }),
    createDefinition("outdoor", {
        key: "hunting",
        name: "Hunting",
        description: "Tracking and bringing down quarry across the wilds.",
        synonyms: ["hunting", "tracking game"],
        tags: ["wilds", "survival"],
        progression: createHuntingProgression(),
    }),
];
const ANIMAL_HANDLING_PROFICIENCIES = [
    createDefinition("animalHandling", {
        id: "animalHandling.general",
        key: "animalHandling",
        name: "Animal Handling",
        description: "Reading temperaments and calming livestock and companions.",
        synonyms: [
            "animal handling",
            "handling animals",
            "herd handling",
            "cattle or sheep handling",
        ],
        tags: ["livestock", "training"],
    }),
    createDefinition("animalHandling", {
        key: "packGoats",
        name: "Animal Handling (Pack Goat)",
        description: "Coaxing sure-footed goats to haul loads across terraces.",
        synonyms: ["animal handling (pack goat)", "animal handling pack goat", "pack goat handling"],
        tags: ["mountain", "livestock"],
        progression: createAnimalHandlingProgression("packGoats"),
    }),
    createDefinition("animalHandling", {
        key: "bees",
        name: "Animal Handling (Bees)",
        description: "Keeping hives docile while harvesting comb and honey.",
        synonyms: ["animal handling (bees)", "animal handling bees", "beekeeping", "apiary handling"],
        tags: ["apiary", "pollinators"],
        progression: createAnimalHandlingProgression("bees"),
    }),
    createDefinition("animalHandling", {
        key: "hounds",
        name: "Animal Handling (Hounds)",
        description: "Training kennel hounds for guard and tracking work.",
        synonyms: ["animal handling (hounds)", "animal handling hounds", "hound handling", "kenneling"],
        tags: ["tracking", "companions"],
        progression: createAnimalHandlingProgression("hounds"),
    }),
    createDefinition("animalHandling", {
        key: "draftBeasts",
        name: "Animal Handling (Draft Beasts)",
        description: "Driving oxen and draft teams without spooking them.",
        synonyms: ["animal handling (draft beasts)", "animal handling draft beasts", "draft beast handling", "teamster training"],
        tags: ["transport", "livestock"],
        progression: createAnimalHandlingProgression("draftBeasts"),
    }),
    createDefinition("animalHandling", {
        key: "birds",
        name: "Animal Handling (Birds)",
        description: "Guiding rooks, gulls, and hawks for deterrent flights.",
        synonyms: ["animal handling (birds)", "animal handling birds", "falconry", "aviary handling"],
        tags: ["aviary", "deterrent"],
        progression: createAnimalHandlingProgression("birds"),
    }),
    createDefinition("animalHandling", {
        key: "cattle",
        name: "Animal Handling (Cattle)",
        description: "Managing herds during drives, milking, and pasture rotations.",
        synonyms: ["animal handling (cattle)", "animal handling cattle", "cattle handling", "herding"],
        tags: ["livestock", "pasture"],
        progression: createAnimalHandlingProgression("cattle"),
    }),
    createDefinition("animalHandling", {
        key: "sheep",
        name: "Animal Handling (Sheep)",
        description: "Shepherding skittish flocks through shearing and storms.",
        synonyms: ["animal handling (sheep)", "animal handling sheep", "shepherding"],
        tags: ["livestock", "pasture"],
        progression: createAnimalHandlingProgression("sheep"),
    }),
    createDefinition("animalHandling", {
        key: "goats",
        name: "Animal Handling (Goats)",
        description: "Keeping cliff goats calm during milking and rescue.",
        synonyms: ["animal handling (goats)", "animal handling goats", "goat handling"],
        tags: ["livestock", "mountain"],
        progression: createAnimalHandlingProgression("goats"),
    }),
];
const WEAPON_PROFICIENCIES = [
    createDefinition("weapon", {
        key: "sword",
        name: "Sword",
        description: "Balanced blades from arming swords to sabers.",
        synonyms: ["sword", "longsword", "blade", "rapier", "saber", "sabre"],
        tags: ["martial", "melee"],
        progression: createWeaponProgression("sword", gainSwordProficiency),
        kinds: ["Weapon_Sword"],
    }),
    createDefinition("weapon", {
        key: "greatsword",
        name: "Greatsword",
        description: "Heavy blades that demand strength and reach.",
        synonyms: ["greatsword", "claymore", "zweihander"],
        tags: ["martial", "two-handed"],
        progression: createWeaponProgression("greatsword", gainGreatswordProficiency),
        kinds: ["Weapon_Greatsword"],
    }),
    createDefinition("weapon", {
        key: "axe",
        name: "Axe",
        description: "Single-handed axes for hewing foes and timber alike.",
        synonyms: ["axe", "hatchet", "battle axe"],
        tags: ["martial", "melee"],
        progression: createWeaponProgression("axe", gainAxeProficiency),
        kinds: ["Weapon_Axe"],
    }),
    createDefinition("weapon", {
        key: "greataxe",
        name: "Greataxe",
        description: "Two-handed axes built for sweeping, brutal arcs.",
        synonyms: ["greataxe", "great axe", "battleaxe"],
        tags: ["martial", "two-handed"],
        progression: createWeaponProgression("greataxe", gainGreataxeProficiency),
        kinds: ["Weapon_Greataxe"],
    }),
    createDefinition("weapon", {
        key: "spear",
        name: "Spear",
        description: "Polearms for thrusting from ranks or ramparts.",
        synonyms: ["spear", "polearm", "pike"],
        tags: ["martial", "reach"],
        progression: createWeaponProgression("spear", gainSpearProficiency),
        kinds: ["Weapon_Spear"],
    }),
    createDefinition("weapon", {
        key: "dagger",
        name: "Dagger",
        description: "Short blades suited to close work and precise strikes.",
        synonyms: ["dagger", "knife", "stiletto"],
        tags: ["light", "melee"],
        progression: createWeaponProgression("dagger", gainDaggerProficiency),
        kinds: ["Weapon_Dagger"],
    }),
    createDefinition("weapon", {
        key: "mace",
        name: "Mace",
        description: "Flanged and blunted weapons that crush armor.",
        synonyms: ["mace", "hammer", "warhammer"],
        tags: ["martial", "melee"],
        progression: createWeaponProgression("mace", gainMaceProficiency),
        kinds: ["Weapon_Mace"],
    }),
    createDefinition("weapon", {
        key: "bow",
        name: "Bow",
        description: "Bows from shortbows to longbows for ranged volleys.",
        synonyms: ["bow", "longbow", "shortbow", "archery"],
        tags: ["ranged", "archery"],
        progression: createWeaponProgression("bow", gainBowProficiency),
        kinds: ["Weapon_Bow"],
    }),
    createDefinition("weapon", {
        key: "crossbow",
        name: "Crossbow",
        description: "Cranked bows for precise shots under tension.",
        synonyms: ["crossbow", "arbalest"],
        tags: ["ranged", "mechanical"],
        progression: createWeaponProgression("crossbow", gainCrossbowProficiency),
        kinds: ["Weapon_Crossbow"],
    }),
    createDefinition("weapon", {
        key: "staff",
        name: "Staff",
        description: "Quarterstaves wielded for defense and sweeping blows.",
        synonyms: ["staff", "quarterstaff"],
        tags: ["martial", "defense"],
        progression: createWeaponProgression("staff", gainStaffProficiency),
        kinds: ["Weapon_Staff"],
    }),
    createDefinition("weapon", {
        key: "shield",
        name: "Shield",
        description: "Interposing shields to block blades and bolts.",
        synonyms: ["shield", "shieldwork"],
        tags: ["defense", "martial"],
        progression: createWeaponProgression("shield", gainShieldProficiency),
        kinds: ["Weapon_Shield"],
    }),
    createDefinition("weapon", {
        key: "wand",
        name: "Wand",
        description: "Foci for channelling precise arcane bolts.",
        synonyms: ["wand", "focus"],
        tags: ["arcane", "ranged"],
        progression: createWeaponProgression("wand", gainWandProficiency),
        kinds: ["Weapon_Wand"],
    }),
    createDefinition("weapon", {
        key: "unarmed",
        name: "Unarmed",
        description: "Striking and grappling without wielded weapons.",
        synonyms: ["unarmed", "brawling", "martial arts", "nonlethal combat", "non-lethal combat"],
        tags: ["martial", "light"],
        progression: createWeaponProgression("unarmed", gainUnarmedProficiency),
        kinds: ["Weapon_Unarmed"],
    }),
    createDefinition("weapon", {
        key: "martial",
        name: "Martial Weapons",
        description: "General familiarity with battlefield arms.",
        synonyms: ["martial weapon", "martial weapons", "martial proficiency", "martial weapon familiarity"],
        tags: ["martial", "generalist"],
    }),
    createDefinition("weapon", {
        key: "lightWeapons",
        name: "Light Weapons",
        description: "Swift blades and clubs meant for agile fighters.",
        synonyms: ["light weapons", "light weapon"],
        tags: ["light", "martial"],
    }),
    createDefinition("weapon", {
        key: "sling",
        name: "Sling",
        description: "Slings and sling staves for arcing projectiles.",
        synonyms: ["sling", "slinging"],
        tags: ["ranged", "simple"],
    }),
    createDefinition("weapon", {
        key: "sickle",
        name: "Sickle",
        description: "Hooked harvest blades adapted for combat.",
        synonyms: ["sickle", "harvesting blade"],
        tags: ["light", "agricultural"],
    }),
    createDefinition("weapon", {
        key: "scythe",
        name: "Scythe",
        description: "Long-handled scythes swung in sweeping cuts.",
        synonyms: ["scythe", "reaper's scythe"],
        tags: ["two-handed", "agricultural"],
    }),
];
const ARMOR_PROFICIENCIES = [
    createDefinition("armor", {
        key: "lightArmor",
        name: "Light Armor",
        description: "Leather and padded armor worn for mobility.",
        synonyms: ["light armor", "leather armor", "light-armored"],
        tags: ["defense", "martial"],
        progression: createArmorProgression("lightArmor", applyLightArmorProficiencyGain),
    }),
    createDefinition("armor", {
        key: "mediumArmor",
        name: "Medium Armor",
        description: "Layered hides and mail balancing weight and protection.",
        synonyms: ["medium armor", "mail"],
        tags: ["defense", "martial"],
        progression: createArmorProgression("mediumArmor", applyMediumArmorProficiencyGain),
    }),
    createDefinition("armor", {
        key: "heavyArmor",
        name: "Heavy Armor",
        description: "Plate and reinforced mail suited to the front line.",
        synonyms: ["heavy armor", "plate"],
        tags: ["defense", "martial"],
        progression: createArmorProgression("heavyArmor", applyHeavyArmorProficiencyGain),
    }),
];
const DEFENSE_PROFICIENCIES = [
    createDefinition("defense", {
        key: "evasion",
        name: "Evasion",
        description: "Sidestepping blows and slipping past danger.",
        synonyms: ["evasion", "dodging", "sidestep"],
        tags: ["defense", "agility"],
        progression: createDefenseProgression("evasion"),
        kinds: ["Evasion"],
    }),
    createDefinition("defense", {
        key: "parry",
        name: "Parry",
        description: "Deflecting strikes with weapon or empty hand.",
        synonyms: ["parry", "parrying"],
        tags: ["defense", "martial"],
        progression: createDefenseProgression("parry"),
        kinds: ["Parry"],
    }),
    createDefinition("defense", {
        key: "block",
        name: "Block",
        description: "Meeting blows head-on with shields and braced guards.",
        synonyms: ["block", "blocking", "shield block"],
        tags: ["defense", "martial"],
        progression: createDefenseProgression("block"),
        kinds: ["Block"],
    }),
];
const PERFORMANCE_PROFICIENCIES = [
    createDefinition("performance", {
        key: "instrument",
        name: "Instrument",
        description: "Mastering strings, winds, and percussion for bardic sets.",
        synonyms: ["instrument", "musicianship", "instrument performance"],
        tags: ["bardic", "support"],
        progression: createPerformanceProgression("instrument"),
        kinds: ["Instrument"],
    }),
    createDefinition("performance", {
        key: "dance",
        name: "Dance",
        description: "Channeling elemental dances in rhythm and motion.",
        synonyms: ["dance", "dancing", "dancecraft"],
        tags: ["bardic", "support"],
        progression: createPerformanceProgression("dance"),
        kinds: ["Dance"],
    }),
    createDefinition("performance", {
        key: "singing",
        name: "Singing",
        description: "Sustaining melodies that bolster allies and sway crowds.",
        synonyms: ["singing", "songcraft", "choral"],
        tags: ["bardic", "support"],
        progression: createPerformanceProgression("singing"),
        kinds: ["Singing"],
    }),
];
const MAGIC_PROFICIENCIES = [
    createDefinition("magic", {
        key: "arcane",
        name: "Arcane Magic",
        description: "General spellcasting circles and foundational theory.",
        synonyms: ["magic", "arcane magic", "magic (circle 1)", "magic circle 1"],
        tags: ["arcane", "general"],
    }),
    createDefinition("magic", {
        key: "battle",
        name: "Battle Magic",
        description: "Offensive spellwork wielded alongside martial allies.",
        synonyms: ["battle magic", "battle magic (circle 1)", "war magic"],
        tags: ["arcane", "combat"],
    }),
    createDefinition("magic", {
        key: "nature",
        name: "Nature Magic",
        description: "Calling on winds, roots, and spirits of the wild.",
        synonyms: ["nature magic", "druidic magic", "wild magic"],
        tags: ["nature", "arcane"],
    }),
    createDefinition("magic", {
        key: "waterWard",
        name: "Water Ward Magic",
        description: "Protective wards woven from tides and mist.",
        synonyms: ["water ward magic", "ward magic", "water wards", "warding magic"],
        tags: ["protection", "water"],
    }),
    createDefinition("magic", {
        key: "light",
        name: "Light Magic",
        description: "Radiant spells that blind foes and buoy allies.",
        synonyms: ["light magic", "radiant magic"],
        tags: ["light", "arcane"],
        progression: createElementalProgression("light"),
        kinds: ["Element_Light"],
    }),
    createDefinition("magic", {
        key: "divine",
        name: "Divine Magic",
        description: "Miracles granted through faith and liturgy.",
        synonyms: ["divine magic", "holy magic"],
        tags: ["divine", "support"],
    }),
    createDefinition("magic", {
        key: "defense",
        name: "Defensive Magic",
        description: "Protective cantrips and barriers against harm.",
        synonyms: ["defensive magic", "protective magic", "defense magic"],
        tags: ["protection", "arcane"],
    }),
    createDefinition("magic", {
        key: "summoning",
        name: "Summoning Magic",
        description: "Conjuring allies and maintaining planar bonds.",
        synonyms: ["summoning magic", "summoning"],
        tags: ["arcane", "support"],
    }),
    createDefinition("magic", {
        key: "destruction",
        name: "Destruction Magic",
        description: "Raw elemental force focused into devastating blasts.",
        synonyms: ["destruction magic", "destructive magic"],
        tags: ["arcane", "combat"],
    }),
    createDefinition("magic", {
        key: "healing",
        name: "Healing Magic",
        description: "Restoring flesh, spirit, and vitality with spellcraft.",
        synonyms: ["healing magic", "restorative magic"],
        tags: ["divine", "support"],
    }),
    createDefinition("magic", {
        key: "enhancement",
        name: "Enhancement Magic",
        description: "Empowering allies with wards, boons, and vigor.",
        synonyms: ["enhancement magic", "buff magic"],
        tags: ["support", "arcane"],
    }),
    createDefinition("magic", {
        key: "enfeeblement",
        name: "Enfeeblement Magic",
        description: "Crippling foes with hexes and weakening charms.",
        synonyms: ["enfeeblement magic", "debuff magic"],
        tags: ["control", "arcane"],
    }),
    createDefinition("magic", {
        key: "control",
        name: "Control Magic",
        description: "Manipulating minds, movement, and the battlefield.",
        synonyms: ["control magic", "control spells"],
        tags: ["control", "arcane"],
    }),
    createDefinition("magic", {
        key: "stone",
        name: "Stone Magic",
        description: "Earthshaping geomancy and bulwarks of stone.",
        synonyms: ["stone magic", "earth magic", "geomancy"],
        tags: ["elemental", "earth"],
        progression: createElementalProgression("stone"),
        kinds: ["Element_Stone"],
    }),
    createDefinition("magic", {
        key: "water",
        name: "Water Magic",
        description: "Currents, tides, and healing mists woven from water.",
        synonyms: ["water magic", "hydromancy"],
        tags: ["elemental", "water"],
        progression: createElementalProgression("water"),
        kinds: ["Element_Water"],
    }),
    createDefinition("magic", {
        key: "wind",
        name: "Wind Magic",
        description: "Calling gusts and eddies to buffet foes and sails.",
        synonyms: ["wind magic", "air magic", "aeromancy"],
        tags: ["elemental", "air"],
        progression: createElementalProgression("wind"),
        kinds: ["Element_Wind"],
    }),
    createDefinition("magic", {
        key: "fire",
        name: "Fire Magic",
        description: "Kindling sparks into blazing infernos.",
        synonyms: ["fire magic", "pyromancy"],
        tags: ["elemental", "fire"],
        progression: createElementalProgression("fire"),
        kinds: ["Element_Fire"],
    }),
    createDefinition("magic", {
        key: "ice",
        name: "Ice Magic",
        description: "Forging frost, sleet, and frozen barriers.",
        synonyms: ["ice magic", "frost magic", "cryomancy"],
        tags: ["elemental", "water"],
        progression: createElementalProgression("ice"),
        kinds: ["Element_Ice"],
    }),
    createDefinition("magic", {
        key: "lightning",
        name: "Lightning Magic",
        description: "Summoning storms and crackling bolts.",
        synonyms: ["lightning magic", "storm magic"],
        tags: ["elemental", "air"],
        progression: createElementalProgression("lightning"),
        kinds: ["Element_Lightning"],
    }),
    createDefinition("magic", {
        key: "dark",
        name: "Dark Magic",
        description: "Shadow and gloom bent toward subtlety or dread.",
        synonyms: ["dark magic", "shadow magic"],
        tags: ["elemental", "shadow"],
        progression: createElementalProgression("dark"),
        kinds: ["Element_Dark"],
    }),
];
const KNOWLEDGE_PROFICIENCIES = [
    createDefinition("knowledge", {
        key: "arcana",
        name: "Arcana",
        description: "Lore of ley lines, sigils, and planar theory.",
        synonyms: ["arcana", "arcane lore", "spell theory"],
        tags: ["arcane", "scholar"],
    }),
    createDefinition("knowledge", {
        key: "nature",
        name: "Nature",
        description: "Understanding flora, fauna, and weather patterns.",
        synonyms: ["nature", "naturalism", "natural lore"],
        tags: ["wilds", "scholar"],
    }),
    createDefinition("knowledge", {
        key: "survival",
        name: "Survival",
        description: "Navigating wilds with foraging, sheltering, and firecraft.",
        synonyms: ["survival", "wilderness survival", "bushcraft"],
        tags: ["wilds", "practical"],
    }),
    createDefinition("knowledge", {
        key: "fieldMedicine",
        name: "Field Medicine",
        description: "Stemming bleeding and stabilizing wounds with mundane care.",
        synonyms: ["field medicine", "first aid", "battlefield medicine", "physic"],
        tags: ["healing", "support"],
    }),
    createDefinition("knowledge", {
        key: "engineering",
        name: "Engineering",
        description: "Designing load-bearing works and mechanical solutions.",
        synonyms: ["engineering", "structural engineering", "mechanical engineering"],
        tags: ["construction", "scholar"],
    }),
    createDefinition("knowledge", {
        key: "navigation",
        name: "Navigation",
        description: "Reading stars, charts, and currents to stay on course.",
        synonyms: ["navigation", "charting", "wayfinding"],
        tags: ["sea", "travel"],
    }),
    createDefinition("knowledge", {
        key: "leadership",
        name: "Leadership",
        description: "Rallying crews, coordinating squads, and holding command.",
        synonyms: ["leadership", "command", "captaincy"],
        tags: ["social", "strategy"],
    }),
    createDefinition("knowledge", {
        key: "sleightOfHand",
        name: "Sleight of Hand",
        description: "Quick fingers for palming, lockwork, and delicate tasks.",
        synonyms: ["sleight-of-hand", "sleight of hand", "pickpocketing"],
        tags: ["dexterity", "urban"],
    }),
    createDefinition("knowledge", {
        key: "stealth",
        name: "Stealth",
        description: "Moving unheard and unseen through shadow and cover.",
        synonyms: ["sneaking", "camouflage", "skulking", "shadowing"],
        tags: ["dexterity", "tactics"],
    }),
    createDefinition("knowledge", {
        key: "religion",
        name: "Religion",
        description: "Doctrine of temples, rites, and divine histories.",
        synonyms: ["religion", "theology"],
        tags: ["divine", "scholar"],
    }),
];
export const PROFICIENCIES = [
    ...GATHERING_PROFICIENCIES,
    ...CRAFTING_PROFICIENCIES,
    ...TOOL_PROFICIENCIES,
    ...OUTDOOR_PROFICIENCIES,
    ...ANIMAL_HANDLING_PROFICIENCIES,
    ...WEAPON_PROFICIENCIES,
    ...ARMOR_PROFICIENCIES,
    ...DEFENSE_PROFICIENCIES,
    ...PERFORMANCE_PROFICIENCIES,
    ...MAGIC_PROFICIENCIES,
    ...KNOWLEDGE_PROFICIENCIES,
];
const PROFICIENCY_BY_ID = new Map();
const PROFICIENCY_BY_SYNONYM = new Map();
const PROFICIENCY_BY_KEY = new Map();
const PROFICIENCY_BY_KIND = new Map();
for (const prof of PROFICIENCIES) {
    PROFICIENCY_BY_ID.set(prof.id, prof);
    const keyBucket = PROFICIENCY_BY_KEY.get(prof.key.toLowerCase());
    if (keyBucket) {
        keyBucket.push(prof);
    }
    else {
        PROFICIENCY_BY_KEY.set(prof.key.toLowerCase(), [prof]);
    }
    for (const label of prof.synonyms) {
        PROFICIENCY_BY_SYNONYM.set(label.toLowerCase(), prof);
    }
    if (prof.kinds) {
        for (const kind of prof.kinds) {
            PROFICIENCY_BY_KIND.set(kind, prof);
        }
    }
}
export function getProficiencyById(id) {
    return PROFICIENCY_BY_ID.get(id);
}
export function findProficiencyByLabel(label) {
    return PROFICIENCY_BY_SYNONYM.get(label.toLowerCase());
}
export function findProficienciesByKey(key) {
    var _a;
    return (_a = PROFICIENCY_BY_KEY.get(key.toLowerCase())) !== null && _a !== void 0 ? _a : [];
}
export function getProficiencyByKind(kind) {
    return PROFICIENCY_BY_KIND.get(kind);
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function extractMinimum(text, start) {
    const slice = text.slice(start);
    const plusMatch = /([0-9]{1,3})\s*\+/i.exec(slice);
    if (plusMatch) {
        return Number.parseInt(plusMatch[1], 10);
    }
    return undefined;
}
export function matchProficienciesInText(text) {
    var _a, _b;
    if (!text)
        return [];
    const results = [];
    const byId = new Map();
    for (const prof of PROFICIENCIES) {
        for (const label of prof.synonyms) {
            const pattern = new RegExp(`\\b${escapeRegExp(label)}\\b`, "i");
            const match = pattern.exec(text);
            if (!match)
                continue;
            const id = prof.id;
            const index = (_a = match.index) !== null && _a !== void 0 ? _a : 0;
            const matchText = match[0];
            const minimum = extractMinimum(text, index + matchText.length);
            const overlapping = results.find((r) => r.index === index && r.id !== id);
            if (overlapping) {
                if (overlapping.match.length >= matchText.length) {
                    continue;
                }
                const overlapIdx = results.indexOf(overlapping);
                if (overlapIdx >= 0) {
                    results.splice(overlapIdx, 1);
                }
                byId.delete(overlapping.id);
            }
            const existing = byId.get(id);
            if (existing) {
                if (minimum !== undefined && ((_b = existing.minimum) !== null && _b !== void 0 ? _b : 0) < minimum) {
                    existing.minimum = minimum;
                }
                if (index < existing.index ||
                    (index === existing.index && matchText.length > existing.match.length)) {
                    existing.index = index;
                    existing.match = matchText;
                }
            }
            else {
                const entry = {
                    id,
                    name: prof.name,
                    definition: prof,
                    match: matchText,
                    index,
                    minimum,
                };
                results.push(entry);
                byId.set(id, entry);
            }
            break;
        }
    }
    return results.sort((a, b) => a.index - b.index);
}
