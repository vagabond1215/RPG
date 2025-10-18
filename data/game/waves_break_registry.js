const GROUP_BINDINGS = {
  farmland: { region: "waves_break", habitat: 'farmland', district: 'High Road' },
    port: { region: "waves_break", habitat: 'coastal', district: 'Port District' },
    upper: { region: "waves_break", habitat: 'urban', district: 'Upper Ward' },
    terns: { region: "waves_break", habitat: 'urban', district: 'Little Terns' },
    greensoul: { region: "waves_break", habitat: 'urban', district: 'Greensoul Hill' },
    gardens: { region: "waves_break", habitat: 'urban', district: 'Lower Gardens' },
    highroad: { region: "waves_break", habitat: 'urban', district: 'High Road' },
};
const DEFAULT_GROUP_BINDING = { region: "waves_break", habitat: 'urban', district: "Wave's Break" };
const CLAMP_VALUE = (value, min, max) => Math.min(max, Math.max(min, value));
function getGroupBinding(group) {
    const base = GROUP_BINDINGS[group];
    if (!base)
        return Object.assign({}, DEFAULT_GROUP_BINDING);
    return Object.assign({}, base);
}
function extractSeasons(text) {
    const seasons = new Set();
    if (/spring/.test(text))
        seasons.add('Spring');
    if (/(summer|midsummer)/.test(text))
        seasons.add('Summer');
    if (/(autumn|fall|harvest)/.test(text))
        seasons.add('Autumn');
    if (/(winter|frost|snow)/.test(text))
        seasons.add('Winter');
    if (/(dry-season|dry season)/.test(text)) {
        seasons.add('Summer');
        seasons.add('Autumn');
    }
    if (/(monsoon|rainy|wet season)/.test(text)) {
        seasons.add('Spring');
        seasons.add('Autumn');
    }
    return Array.from(seasons);
}
function detectUrgency(text) {
    if (/(emergency|immediate|urgent|rush|levy|alarm)/.test(text))
        return 'emergency';
    if (/(surge|reinforce|supplement|muster|shortfall|boost)/.test(text))
        return 'elevated';
    return 'routine';
}
function parseLaborConditionForVisibility(condition, business) {
    const raw = [condition === null || condition === void 0 ? void 0 : condition.season, condition === null || condition === void 0 ? void 0 : condition.trigger, condition === null || condition === void 0 ? void 0 : condition.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    const seasons = extractSeasons(raw);
    const requiresStorm = /(storm|gale|squall|tempest|hurricane|deluge|seawall|breach|surge)/.test(raw);
    const requiresFlood = /(flood|overflow|washout|inundated|breach|spillway)/.test(raw);
    const requiresDry = /(dry|drought|kiln|low humidity|sun-baked|parched|dust)/.test(raw) && !requiresFlood;
    const requiresHarvest = /(harvest|vintage|press|picking|shear|gather|reap|trawl)/.test(raw);
    const requiresFestival = /(festival|faire|games|regatta|tournament|celebration|market day|pageant)/.test(raw);
    const requiresCold = /(winter|frost|ice|snow|blizzard|cold snap)/.test(raw);
    const requiresHeat = requiresDry || /(summer|heat|scorch|kiln|dry-season)/.test(raw);
    const urgency = detectUrgency(raw);
    let baseDemand = 0.35;
    if (business.category === 'security' || business.category === 'logistics')
        baseDemand += 0.05;
    if (business.category === 'support')
        baseDemand -= 0.05;
    if (urgency === 'elevated')
        baseDemand += 0.2;
    if (urgency === 'emergency')
        baseDemand += 0.4;
    if (requiresStorm || requiresFlood)
        baseDemand += 0.2;
    if (requiresDry)
        baseDemand += 0.12;
    if (requiresHarvest)
        baseDemand += 0.15;
    if (requiresFestival)
        baseDemand += 0.1;
    const eventTag = requiresStorm
        ? 'storm_response'
        : requiresFlood
            ? 'flood_relief'
            : requiresDry
                ? 'dry_spell'
                : requiresHarvest
                    ? 'harvest'
                    : requiresFestival
                        ? 'festival'
                        : undefined;
    return {
        seasons,
        requiresStorm,
        requiresDry,
        requiresFlood,
        requiresHarvest,
        requiresFestival,
        requiresCold,
        requiresHeat,
        urgency,
        baseDemand,
        eventTag,
    };
}
function shouldAllowSeason(seasons, currentSeason) {
    if (!seasons.length)
        return true;
    return seasons.includes(currentSeason);
}
function applyQuestVisibilityToBusiness(business, binding) {
    var _a;
    const quests = business.quests || [];
    quests.forEach((quest, index) => {
        const laborCondition = (_a = business.laborConditions) === null || _a === void 0 ? void 0 : _a[index];
        quest.laborCondition = laborCondition;
        const baseBinding = Object.assign({ region: binding.region, habitat: binding.habitat, district: binding.district, business: business.name, location: business.name });
        quest.visibilityBinding = quest.visibilityBinding
            ? Object.assign(Object.assign({}, quest.visibilityBinding), baseBinding) : baseBinding;
        if (!quest.visibility) {
            quest.visibility = createQuestVisibilityRule(business, laborCondition);
        }
    });
}
function createQuestVisibilityRule(business, condition) {
    const parsed = parseLaborConditionForVisibility(condition, business);
    const trigger = condition === null || condition === void 0 ? void 0 : condition.trigger;
    return (context) => {
        const { weather, random, binding } = context;
        if (!shouldAllowSeason(parsed.seasons, weather.season)) {
            return {
                available: false,
                demand: 0.05,
                reason: `Work resumes in ${parsed.seasons.join(', ') || 'the proper season'}.`,
                eventTag: parsed.eventTag,
            };
        }
        if (parsed.requiresStorm) {
            const eventActive = weather.storm || weather.floodRisk !== 'none' || weather.outlook.stormLikely;
            if (!eventActive) {
                return {
                    available: false,
                    demand: 0.1,
                    reason: 'Awaiting storm or surge conditions.',
                    eventTag: parsed.eventTag,
                };
            }
        }
        if (parsed.requiresFlood) {
            const floodActive = weather.floodRisk !== 'none' || weather.trend.wetSpellDays >= 4 || weather.outlook.floodLikely;
            if (!floodActive) {
                return {
                    available: false,
                    demand: 0.12,
                    reason: 'Flood controls currently holding.',
                    eventTag: parsed.eventTag,
                };
            }
        }
        if (parsed.requiresDry) {
            const dryActive = weather.droughtStage !== 'none' || weather.trend.drySpellDays >= 3 || weather.outlook.drySpellLikely;
            if (!dryActive) {
                return {
                    available: false,
                    demand: 0.12,
                    reason: 'Moisture levels sufficient; dry-run not yet needed.',
                    eventTag: parsed.eventTag,
                };
            }
        }
        if (parsed.requiresHarvest) {
            const harvestSeason = weather.season === 'Autumn' || weather.season === 'Summer';
            if (!harvestSeason) {
                return {
                    available: false,
                    demand: 0.08,
                    reason: 'Harvest crews wait for fields to ripen.',
                    eventTag: parsed.eventTag,
                };
            }
        }
        if (parsed.requiresFestival) {
            const festivalWindow = weather.season === 'Summer' || weather.season === 'Spring' || random() < 0.2;
            if (!festivalWindow) {
                return {
                    available: false,
                    demand: 0.08,
                    reason: 'No festival preparations scheduled.',
                    eventTag: parsed.eventTag,
                };
            }
        }
        if (parsed.requiresCold && weather.temperatureC > 6) {
            return {
                available: false,
                demand: 0.06,
                reason: 'Conditions are too mild for winter tasks.',
                eventTag: parsed.eventTag,
            };
        }
        if (parsed.requiresHeat && weather.temperatureC < 10 && weather.season !== 'Summer') {
            return {
                available: false,
                demand: 0.06,
                reason: 'Heat-dependent work paused until warmer days.',
                eventTag: parsed.eventTag,
            };
        }
        let demand = parsed.baseDemand;
        demand += weather.outlook.demandModifier;
        if (parsed.requiresDry && weather.droughtStage === 'warning')
            demand += 0.25;
        if (parsed.requiresStorm && weather.storm)
            demand += 0.2;
        if (parsed.requiresFlood && weather.floodRisk === 'warning')
            demand += 0.25;
        if (parsed.requiresHarvest && weather.season === 'Autumn')
            demand += 0.2;
        if (parsed.urgency === 'routine' && weather.trend.drySpellDays > 5)
            demand += 0.08;
        if (binding.habitat === 'farmland' && weather.droughtStage !== 'none')
            demand += 0.05;
        if (binding.habitat === 'coastal' && weather.storm)
            demand += 0.05;
        demand = CLAMP_VALUE(demand, 0.05, 0.95);
        const available = random() < demand;
        return {
            available,
            demand,
            reason: available
                ? trigger || 'Work crews are being mustered.'
                : 'Quotas already filled for this rotation.',
            eventTag: parsed.eventTag,
        };
    };
}
const FARMLAND_BUSINESSES = [
    "Bayside Brickworks",
    "Brackenshore Croft",
    "Cliffblossom Hives",
    "Cliffbreak Quarry",
    "Coast Road Watchtower",
    "Copperbrook Forge",
    "Driftfell Meadow",
    "East Road to Mountain Top",
    "Foamfield Flax Farm",
    "Greenridge Polder",
    "Gulls' Orchard",
    "Gullwind Mill",
    "Harborwind Dairy",
    "Mistflower Apiary",
    "Moorlight Flats",
    "Netmaker's Co-op",
    "North Gate",
    "Saltcrest Vineyard & Winery",
    "Saltmarsh Granary",
    "Saltmeadow Potato Farm",
    "Seabreeze Oat Farm",
    "Seawisp Plum Orchard",
    "South Gate",
    "Sunmellow Grove",
    "Tideflock Stockyards",
    "Tidewatcher Lighthouse",
    "Tidewheel Watermill",
    "Wavecut Stoneworks",
    "Windward Berry Vineyard & Winery",
];
const PORT_BUSINESSES = [
    "Harborwatch Trading House",
    "Stormkeel Shipwrights",
    "Harbor Guard Naval Yard",
    "Saltworks",
    "Fishmongers' Row",
    "The Ropewalk",
];
const UPPER_WARD_BUSINESSES = [
    "Governor's Keep",
    "Hall of Records",
    "Mercantile Exchange",
    "Master Jeweler's Guildhall",
    "Highward Vintners' Salon",
    "Aurelian Apothecarium & Perfumery",
];
const LITTLE_TERNS_BUSINESSES = [
    "Guild of Smiths",
    "Timberwave Carpenters' Guild",
    "Carvers' and Fletchers' Hall",
    "The Gilded Needle Clothiers",
    "Brine & Bark Tannery",
    "Seawind Sailmakers' Hall",
];
const GREENSOUL_HILL_BUSINESSES = [
    "Grand Library of Wave's Break",
    "Arcanists' Enclave",
    "Herbal Conservatory",
    "Skyline Academy",
    "Temple of the Tides",
    "Candlewrights' Guild",
];
const LOWER_GARDENS_BUSINESSES = [
    "Quayside Greens Market",
    "South Gate Market",
    "Seastone Arena",
    "Wisteria Pavilion",
    "Anchor's Toast Brewery",
    "Sunleaf Inn",
];
const HIGH_ROAD_BUSINESSES = [
    "Adventurers' Guildhall",
    "Rolling Wave Coachworks",
    "Wavehide Leather Guild",
    "Shield & Sail Armsmiths",
    "Gatewatch Barracks",
    "Stonebridge Caravanserai",
];
const FARMLAND_BOARD_PLAN = {
    "North Gate Labor Postings": {
        location: "North Gate",
        businesses: [
            "Bayside Brickworks",
            "Cliffbreak Quarry",
            "Coast Road Watchtower",
            "Copperbrook Forge",
            "East Road to Mountain Top",
            "Greenridge Polder",
            "Mistflower Apiary",
            "Netmaker's Co-op",
            "North Gate",
            "Tidewatcher Lighthouse",
            "Tidewheel Watermill",
            "Wavecut Stoneworks",
        ],
    },
    "South Gate Field Contracts": {
        location: "South Gate",
        businesses: [
            "Brackenshore Croft",
            "Cliffblossom Hives",
            "Driftfell Meadow",
            "Foamfield Flax Farm",
            "Gulls' Orchard",
            "Gullwind Mill",
            "Harborwind Dairy",
            "Moorlight Flats",
            "Saltcrest Vineyard & Winery",
            "Saltmarsh Granary",
            "Saltmeadow Potato Farm",
            "Seabreeze Oat Farm",
            "Seawisp Plum Orchard",
            "South Gate",
            "Sunmellow Grove",
            "Tideflock Stockyards",
            "Windward Berry Vineyard & Winery",
        ],
    },
};
const PORT_BOARD_PLAN = {
    "Harborwatch Quay Ledger": {
        location: "The Port District",
        businesses: ["Harborwatch Trading House"],
    },
    "Stormkeel Slipway Mast": {
        location: "Stormkeel Shipwrights",
        businesses: ["Stormkeel Shipwrights"],
    },
    "Naval Yard Muster Wall": {
        location: "Harbor Guard Naval Yard",
        businesses: ["Harbor Guard Naval Yard"],
    },
    "Saltworks Evaporation Gate": {
        location: "Saltworks",
        businesses: ["Saltworks"],
    },
    "Fishmongers' Stall Hooks": {
        location: "Fishmongers' Row",
        businesses: ["Fishmongers' Row"],
    },
    "Ropewalk Entry Plaques": {
        location: "The Ropewalk",
        businesses: ["The Ropewalk"],
    },
};
const UPPER_WARD_BOARD_PLAN = {
    "Governor's Keep Gatehouse Registry": {
        location: "Governor's Keep",
        businesses: ["Governor's Keep", "Hall of Records"],
    },
    "Highward Mercantile Ledger": {
        location: "Mercantile Exchange",
        businesses: ["Mercantile Exchange", "Highward Vintners' Salon"],
    },
    "Adventurers' Guild Liaison Counter": {
        location: "Master Jeweler's Guildhall",
        businesses: [
            "Master Jeweler's Guildhall",
            "Aurelian Apothecarium & Perfumery",
        ],
    },
};
const LITTLE_TERNS_BOARD_PLAN = {
    "Little Terns Mastercraft Posting Wall": {
        location: "Guild of Smiths",
        businesses: [
            "Guild of Smiths",
            "Timberwave Carpenters' Guild",
            "Carvers' and Fletchers' Hall",
            "The Gilded Needle Clothiers",
            "Brine & Bark Tannery",
            "Seawind Sailmakers' Hall",
        ],
    },
};
const GREENSOUL_HILL_BOARD_PLAN = {
    "Grand Library Request Desk": {
        location: "Grand Library of Wave's Break",
        businesses: ["Grand Library of Wave's Break"],
    },
    "Arcanists' Gatehouse Wards": {
        location: "Arcanists' Enclave",
        businesses: ["Arcanists' Enclave"],
    },
    "Herbal Conservatory Loggia": {
        location: "Herbal Conservatory",
        businesses: ["Herbal Conservatory"],
    },
    "Skyline Academy Posting Column": {
        location: "Skyline Academy",
        businesses: ["Skyline Academy"],
    },
    "Temple of the Tides Ledger": {
        location: "Temple of the Tides",
        businesses: ["Temple of the Tides"],
    },
    "Candlewrights' Guild Lantern Wall": {
        location: "Candlewrights' Guild",
        businesses: ["Candlewrights' Guild"],
    },
};
const LOWER_GARDENS_BOARD_PLAN = {
    "South Gate Market Posting Wall": {
        location: "South Gate Market",
        businesses: [
            "South Gate Market",
            "Quayside Greens Market",
            "Anchor's Toast Brewery",
        ],
    },
    "Arena Promenade Notices": {
        location: "Seastone Arena",
        businesses: ["Seastone Arena", "Wisteria Pavilion", "Sunleaf Inn"],
    },
};
const HIGH_ROAD_BOARD_PLAN = {
    "Adventurers' Guild Contract Archive": {
        location: "Adventurers' Guildhall",
        businesses: ["Adventurers' Guildhall"],
    },
    "Caravan Square Contract Wall": {
        location: "Caravan Square",
        businesses: [
            "Rolling Wave Coachworks",
            "Wavehide Leather Guild",
            "Shield & Sail Armsmiths",
            "Stonebridge Caravanserai",
        ],
    },
    "Gatewatch Muster Board": {
        location: "Gatewatch Barracks",
        businesses: ["Gatewatch Barracks"],
    },
};
const ALL_BUSINESS_GROUPS = new Map([
    ["farmland", FARMLAND_BUSINESSES],
    ["port", PORT_BUSINESSES],
    ["upper", UPPER_WARD_BUSINESSES],
    ["terns", LITTLE_TERNS_BUSINESSES],
    ["greensoul", GREENSOUL_HILL_BUSINESSES],
    ["gardens", LOWER_GARDENS_BUSINESSES],
    ["highroad", HIGH_ROAD_BUSINESSES],
]);
const ALL_BOARD_PLANS = [
    FARMLAND_BOARD_PLAN,
    PORT_BOARD_PLAN,
    UPPER_WARD_BOARD_PLAN,
    LITTLE_TERNS_BOARD_PLAN,
    GREENSOUL_HILL_BOARD_PLAN,
    LOWER_GARDENS_BOARD_PLAN,
    HIGH_ROAD_BOARD_PLAN,
];
function cloneQuestForBoard(quest, boardName, businessName, binding, boardLocation) {
    const visibilityBinding = Object.assign(Object.assign({}, binding), { board: boardName, business: businessName });
    if (boardLocation) {
        visibilityBinding.location = boardLocation;
    }
    const notes = quest.notes
        ? `${quest.notes} Posted on the ${boardName}; report to ${businessName}.`
        : `Posted on the ${boardName}; report to ${businessName}.`;
    return Object.assign(Object.assign({}, quest), { notes, visibilityBinding: quest.visibilityBinding
            ? Object.assign(Object.assign({}, quest.visibilityBinding), visibilityBinding) : visibilityBinding });
}
function filterBusinesses(businesses, names) {
    if (!(businesses === null || businesses === void 0 ? void 0 : businesses.length))
        return [];
    const allowed = new Set(names);
    return businesses.filter((business) => allowed.has(business.name));
}
function collectBoardQuests(businesses, plan, binding) {
    if (!(businesses === null || businesses === void 0 ? void 0 : businesses.length))
        return {};
    const index = new Map(businesses.map((b) => [b.name, b]));
    const boards = {};
    Object.entries(plan).forEach(([boardName, details]) => {
        const board = details !== null && details !== void 0 ? details : { businesses: [] };
        const businessNames = board.businesses || [];
        const quests = [];
        businessNames.forEach((name) => {
            const business = index.get(name);
            if (!business)
                return;
            business.quests.forEach((quest) => {
                quests.push(cloneQuestForBoard(quest, boardName, business.name, binding, board.location));
            });
        });
        if (quests.length) {
            boards[boardName] = quests;
        }
    });
    return boards;
}
const WAVES_BREAK_BUSINESS_OWNERS = {
    // Farmlands and hinterland holdings
    "Bayside Brickworks": {
        owner: "Tidemold Kiln-Family",
        stewards: ["Master Kilner Varla Tidemold"],
        notes: "Harborworks charters the Tidemolds to keep coastal brick supplies moving.",
    },
    "Brackenshore Croft": {
        owner: "Saltbound Terrace Estate",
        stewards: ["Field-reeve Maera Saltbound"],
        notes: "Stone-terraced barley fields leased from the Saltbound family to trusted reeves.",
    },
    "Cliffblossom Hives": {
        owner: "Cliffbloom Apiarists",
        stewards: ["Honeywarden Sera Cliffbloom"],
        notes: "Cliffbloom cousins rotate stewardship of the cliffside apiaries each season.",
    },
    "Cliffbreak Quarry": {
        owner: "Cliffbreak Stone Consortium",
        stewards: ["Foreman Brann Cliffbreak"],
        notes: "Stone blocks cut under Cliffbreak contracts for harbor walls and export orders.",
    },
    "Coast Road Watchtower": {
        owner: "Wave's Break",
        stewards: ["Gatewatch Command Council"],
        notes: "City watch captains rotate garrison command on coastal beacons.",
    },
    "Copperbrook Forge": {
        owner: "Copperbrook Forgehold",
        stewards: ["Smith Barun Copperbrook"],
        notes: "Forgehold turns out hinges, plowshares, and tool repairs for the northern farms.",
    },
    "Driftfell Meadow": {
        owner: "Driftfell Pastoral Estate",
        stewards: ["Steward Elwin Driftfell"],
        notes: "Estate leases meadow grazing to drover families supporting Gatewatch mounts.",
    },
    "East Road to Mountain Top": {
        owner: "Wave's Break",
        stewards: ["Road Warden Arel"],
        notes: "Municipal wardens patrol the vital overland artery toward Mountain Top caravans.",
    },
    "Foamfield Flax Farm": {
        owner: "Foamfield Kinstead",
        stewards: ["Farmholder Deryn Foamfield"],
        notes: "Foamfield kin spin flax for sailcloth and canvas bound for the harbor.",
    },
    "Greenridge Polder": {
        owner: "Tidebinder Family Trust",
        stewards: ["Reeve Galen Tidebinder"],
        notes: "Levees and sluices carved by the Tidebinder trust keep reclaimed marshland fertile.",
    },
    "Gulls' Orchard": {
        owner: "Seafeather Orchard Family",
        stewards: ["Orchard Mistress Riala Seafeather"],
        notes: "Seafeather ciders fill Greensoul cellars and South Gate presses.",
    },
    "Gullwind Mill": {
        owner: "Gullwind Milling House",
        stewards: ["Master Miller Joran Gullwind"],
        notes: "Millstones grind grain for Saltmarsh granaries and caravan flour rations.",
    },
    "Harborwind Dairy": {
        owner: "Harborwind Dairy Clan",
        stewards: ["Matron Helda Harborwind"],
        notes: "Butter and soft cheeses travel daily to the South Gate markets.",
    },
    "Mistflower Apiary": {
        owner: "Mistflower Apiarists",
        stewards: ["Keeper Lileth Mistflower"],
        notes: "Perfumed honeys bound for Greensoul apothecaries are bottled here.",
    },
    "Moorlight Flats": {
        owner: "Moorlight Drovers' Estate",
        stewards: ["Herdmaster Vel Moorlight"],
        notes: "Moorlight family contracts pasture to drovers fattening caravans' draft herds.",
    },
    "Netmaker's Co-op": {
        owner: "Selkanet Cooperative",
        stewards: ["Factor Selka Tideknot"],
        notes: "Selkanet knotters lease looms along the riverbank under Harborworks quotas.",
    },
    "Saltwash Beach": {
        owner: "Wave's Break",
        stewards: ["Beachwarden Lysa Hookfin"],
        notes: "Harborworks wardens tend tidal nets and shellfish leases along the public strand.",
    },
    "Tidebreak Riverbank": {
        owner: "Wave's Break",
        stewards: ["Riverwarden Galen Tidebinder"],
        notes: "Tidebinder reeves maintain eel pots and drainage dikes on the brackish river split.",
    },
    "Copperbrook Creek": {
        owner: "Greensoul Herbal Circle",
        stewards: ["Herbalist Ina Copperbrook"],
        notes: "Creekside herb plots are tended by Greensoul healers collecting luminous moss and sweetwater cress.",
    },
    "Sunset Grasslands": {
        owner: "Wave's Break",
        stewards: ["Ranger Captain Vel Moorlight"],
        notes: "City rangers rotate grazing rights and patrol bandit paths across the open prairie hills.",
    },
    "Forest Edge": {
        owner: "Wave's Break",
        stewards: ["Edgewarden Neris Thorn"],
        notes: "Gatewatch scouts manage snares and sap taps where farm fence meets coastal pine fringe.",
    },
    "Coastal Pinewood": {
        owner: "Wave's Break",
        stewards: ["Pinewarden Elira Greensong"],
        notes: "Forestry wardens fell resin pines cautiously while watching for spirits in the misted wood.",
    },
    "North Gate": {
        owner: "Wave's Break",
        stewards: ["Gate Sergeant Hullen"],
        notes: "City gate operations fall under the Gatewatch barracks commander's remit.",
    },
    "Saltcrest Vineyard & Winery": {
        owner: "Saltcrest Vintner Estate",
        stewards: ["Master Vintner Aelric Saltcrest"],
        notes: "Saltcrest casks age in cliffside vaults before shipping inland.",
    },
    "Saltmarsh Granary": {
        owner: "Wave's Break",
        stewards: ["Keeper Torv Saltmarsh"],
        notes: "City granary holds gate tithe grain and fleet provisions under civic contract.",
    },
    "Saltmeadow Potato Farm": {
        owner: "Saltmeadow Family Holding",
        stewards: ["Farmer Ina Saltmeadow"],
        notes: "Saltmeadow rows keep the city supplied with tubers during winter.",
    },
    "Seabreeze Oat Farm": {
        owner: "Seabreeze Grainstead",
        stewards: ["Steward Neris Seabreeze"],
        notes: "Oat harvests feed caravan teams bound for the East Road.",
    },
    "Seawisp Plum Orchard": {
        owner: "Seawisp Orchard Collective",
        stewards: ["Harvestkeeper Lora Seawisp"],
        notes: "Orchard families share tenancy while the Seawisp matriarch controls exports.",
    },
    "South Gate": {
        owner: "Wave's Break",
        stewards: ["Captain Brisa Gatewatch"],
        notes: "Southern gate patrols muster under Gatewatch command.",
    },
    "Sunmellow Grove": {
        owner: "Dawnbloom Estate",
        stewards: ["Sunmellow Grove Council"],
        notes: "The Dawnbloom line leases plots to grove tenders producing aromatic fruits.",
    },
    "Tideflock Stockyards": {
        owner: "Tideflock Drover Family",
        stewards: ["Steward Mara Tideflock"],
        notes: "Drover clans stage livestock bound for harbor barges and caravans.",
    },
    "Tidewatcher Lighthouse": {
        owner: "Wave's Break",
        stewards: ["Keeper Malen Tidewatcher"],
        notes: "Guard engineers maintain the beacon and its sea-ward wards.",
    },
    "Tidewheel Watermill": {
        owner: "Wave's Break",
        stewards: ["Millwright Jessa Tidewheel"],
        notes: "Municipal leases keep grain grinding for Saltmarsh stores even in flood season.",
    },
    "Wavecut Stoneworks": {
        owner: "Wavecut Masonry Family",
        stewards: ["Master Mason Corin Wavecut"],
        notes: "Wavecut blocks supply Greensoul projects and harbor stairs.",
    },
    "Windward Berry Vineyard & Winery": {
        owner: "Windward Vineyard Estate",
        stewards: ["Vintner Soren Windward"],
        notes: "Windward vintners bottle berry wine prized by Highward salons.",
    },
    // Port district consortiums
    "Harborwatch Trading House": {
        owner: "Calderis Ledger-Family",
        stewards: ["Factor Merina Calderis"],
        notes: "Calderis auditors hold the bonded keys for noble cargoes.",
    },
    "Stormkeel Shipwrights": {
        owner: "Stormkeel Dockwright Dynasty",
        stewards: ["Foreman Daska Stormkeel"],
        notes: "Stormkeel slips lay keels for royal cutters and merchant carracks alike.",
    },
    "Harbor Guard Naval Yard": {
        owner: "Wave's Break",
        stewards: ["Captain Yorsen of the Harbor Guard"],
        notes: "Fleet tenders answer to the harbor admiralty office.",
    },
    "Saltworks": {
        owner: "Saltmaster Family Cooperative",
        stewards: ["Saltmaster Rinna"],
        notes: "The Saltmaster kin boil brine for fleet rations under city quotas.",
    },
    "Fishmongers' Row": {
        owner: "Selune-Osprey Fishmongers",
        stewards: ["Dockmaster Selune Osprey"],
        notes: "Pier stalls are rotated among Osprey cousins per tide schedule.",
    },
    "The Ropewalk": {
        owner: "Strandbinder Cooperative",
        stewards: ["Rope-master Galen Strandbinder"],
        notes: "Longhouse spinners fulfill navy towline orders and harbor moorings.",
    },
    // Upper Ward charters
    "Governor's Keep": {
        owner: "Wave's Break",
        stewards: ["Chamberlain Veleth"],
        notes: "Civic bastion housing council chambers and vaults.",
    },
    "Hall of Records": {
        owner: "Wave's Break",
        stewards: ["Provost Malenne"],
        notes: "Archive clerks maintain civic ledgers and deeds.",
    },
    "Mercantile Exchange": {
        owner: "Dorel Mercantile Charter",
        stewards: ["High Factor Dorel"],
        notes: "Exchange tribunal brokers high-value contracts for noble investors.",
    },
    "Master Jeweler's Guildhall": {
        owner: "Vain Jewelcraft Charter",
        stewards: ["Master Jeweler Serapha Vain"],
        notes: "Gemcutters and setters hold guild courts within the hall.",
    },
    "Highward Vintners' Salon": {
        owner: "Highward Estate",
        stewards: ["Sommelier Liora Highward"],
        notes: "Private tasting rooms for noble vintages imported through Nobles' Quay.",
    },
    "Aurelian Apothecarium & Perfumery": {
        owner: "Aurelian Lysenne Atelier",
        stewards: ["Mistress Aurelia Lysenne"],
        notes: "Perfumed tinctures crafted for Highward patrons and Greensoul healers.",
    },
    // Little Terns craft guilds
    "Guild of Smiths": {
        owner: "Ironbent Forgeclan",
        stewards: ["Forge Captain Brakka Ironbent"],
        notes: "Forge captaincy rotates through Ironbent lineages by guild vote.",
    },
    "Timberwave Carpenters' Guild": {
        owner: "Woodhand Timber Charter",
        stewards: ["Guildmistress Tella Woodhand"],
        notes: "Woodhand families lease lumberyards and oversee apprentice crews.",
    },
    "Carvers' and Fletchers' Hall": {
        owner: "Thornwright Carving Family",
        stewards: ["Foreman Kale Thornwright"],
        notes: "Thornwright foremen keep arrow and carving orders moving.",
    },
    "The Gilded Needle Clothiers": {
        owner: "Threadneedle Atelier",
        stewards: ["Mistress Seraphine Threadneedle"],
        notes: "Threadneedle couturiers fit nobles and caravan masters alike.",
    },
    "Brine & Bark Tannery": {
        owner: "Brinebark Tanning Family",
        stewards: ["Steward Pell Brinebark"],
        notes: "Hide curing yards that feed Wavehide leatherworks.",
    },
    "Seawind Sailmakers' Hall": {
        owner: "Seawind Rigging Family",
        stewards: ["Forewoman Maris Seawind"],
        notes: "Sail looms stretch canvas for harbor barques and river luggers.",
    },
    // Greensoul Hill orders
    "Grand Library of Wave's Break": {
        owner: "Wave's Break",
        stewards: ["Chief Archivist Rellis"],
        notes: "Civic library chartered to preserve guild records and histories.",
    },
    "Arcanists' Enclave": {
        owner: "Starweaver Arcanum Trust",
        stewards: ["Archmage Selene Starweaver"],
        notes: "Magister council licenses rituals and research.",
    },
    "Herbal Conservatory": {
        owner: "Leafward Conservatory Estate",
        stewards: ["Conservator Mera Leafward"],
        notes: "Leafward apothecaries cultivate rare specimens for healers.",
    },
    "Skyline Academy": {
        owner: "Brightmere Scholastic Charter",
        stewards: ["Dean Callus Brightmere"],
        notes: "Scholars train navigators, engineers, and court scribes.",
    },
    "Temple of the Tides": {
        owner: "Tideborn Clerical House",
        stewards: ["High Priestess Maela Tideborn"],
        notes: "Temple guardians oversee coastal rites and pilgrim offerings.",
    },
    "Candlewrights' Guild": {
        owner: "Candlewright Artisan Line",
        stewards: ["Guildmaster Oren Candlewright"],
        notes: "Waxmasters contract festival illuminations and civic beacons.",
    },
    // Lower Gardens and cultural quarter
    "Quayside Greens Market": {
        owner: "Greenside Market Council",
        stewards: ["Steward Jessa Greenside"],
        notes: "Greenside council allocates stalls to herb growers and foragers.",
    },
    "South Gate Market": {
        owner: "Wave's Break",
        stewards: ["Marketwarden Tarsa Hollow"],
        notes: "South Gate market ground maintained by civic wardens.",
    },
    "Seastone Arena": {
        owner: "Wave's Break",
        stewards: ["Arena Master Garen Seastone"],
        notes: "Arena master reports to the governor for games and levy musters.",
    },
    "Wisteria Pavilion": {
        owner: "Neral Wisterian Estate",
        stewards: ["Maestro Neral Wisterian"],
        notes: "Recital hall hosting guild salons and noble performances.",
    },
    "Anchor's Toast Brewery": {
        owner: "Anchorfast Brewing Family",
        stewards: ["Brewmaster Tolen Anchorfast"],
        notes: "Brew kettles feed the market taverns and caravan casks.",
    },
    "Sunleaf Inn": {
        owner: "Sunleaf Hospitality Family",
        stewards: ["Innkeeper Lysa Sunleaf"],
        notes: "Garden court inn favored by scholars and visiting merchants.",
    },
    // High Road district contracts
    "Adventurers' Guildhall": {
        owner: "Crestshield Guild Charter",
        stewards: ["Guildmaster Ryn Crestshield"],
        notes: "Guild charter authorized by the crown and city governor.",
    },
    "Rolling Wave Coachworks": {
        owner: "Rollingwave Coach Consortium",
        stewards: ["Foreman Darel Rollingwave"],
        notes: "Coachwright crews refit wagons before departure on the High Road.",
    },
    "Wavehide Leather Guild": {
        owner: "Pell Leatherwright Family",
        stewards: ["Guildmaster Pell"],
        notes: "Leatherwright line oversees harness and armor commissions.",
    },
    "Shield & Sail Armsmiths": {
        owner: "Sella Shieldwright Family",
        stewards: ["Master Armorer Sella"],
        notes: "Armsmith cooperative allied with Gatewatch contracts.",
    },
    "Gatewatch Barracks": {
        owner: "Wave's Break",
        stewards: ["Captain Ilyan Gatewatch"],
        notes: "Barracks houses the Shieldbearer cadre and gate patrols.",
    },
    "Stonebridge Caravanserai": {
        owner: "Nyla Stonebridge Trust",
        stewards: ["Steward Nyla Stonebridge"],
        notes: "Stonebridge trust rents bays to caravans staging in the High Road district.",
    },
};
const WAVES_BREAK_BUILDING_OWNERS = {
    // Port promenades
    "Warehouse Row": {
        owner: "Wave's Break",
        stewards: ["Harborworks Quartermaster Lysa Tallis"],
        notes: "Municipal bonded storage watched by harbor inspectors.",
    },
    "Nobles' Quay": {
        owner: "House Delmare Quaywrights",
        stewards: ["Harbormaster Vell Delmare"],
        notes: "Reserved slips leased to highborn fleets through Delmare factors.",
    },
    "Merchants' Wharf": {
        owner: "Merrow Syndicate",
        stewards: ["Factor Alis Merrow"],
        notes: "Syndicate factors rotate berths for merchant caravels.",
    },
    "Fisherman's Pier": {
        owner: "Hookfin Netters",
        stewards: ["Mistress Daila Hookfin"],
        notes: "Pier space apportioned among Hookfin and Osprey fishing crews.",
    },
    "Brinebarrel Coopers": {
        owner: "Brinebarrel Cooperage Family",
        stewards: ["Cooper Hest Brinebarrel"],
        notes: "Barrelwrights supply kegs for salters and breweries alike.",
    },
    "Shrine of the Deep Current": {
        owner: "Tidecaller Priesthood",
        stewards: ["Oracle Maerin Tidecaller"],
        notes: "Dockside sailors leave offerings before each voyage.",
    },
    "Statue of the Sea-Mother": {
        owner: "Wave's Break",
        notes: "Civic monument maintained by harbor masons.",
    },
    "The Salty Gull": {
        owner: "Gullring Hospitality",
        stewards: ["Proprietor Edda Gullring"],
        notes: "Favored tavern of fisher crews and visiting traders.",
    },
    "The Tideway Inn": {
        owner: "Tideway Innkeep Family",
        stewards: ["Innkeeper Dovan Tideway"],
        notes: "Quayside inn welcoming caravan quartermasters waiting on cargo.",
    },
    "Navigator's Trust & Chart House": {
        owner: "Chartwright Collegium",
        stewards: ["Chartmaster Rhyl Chartwright"],
        notes: "Map rooms track every convoy and tide across the gulf.",
    },
    // Upper Ward salons
    "Marble Finch Supper Club": {
        owner: "Marblefinch Gastronomy House",
        stewards: ["Chef Aurel Marblefinch"],
        notes: "Invitation-only suppers for the governor's council and visiting nobles.",
    },
    "Highward Terraces": {
        owner: "Highward Estate",
        stewards: ["Sommelier Liora Highward"],
        notes: "Tiered gardens connecting the salon to Noble rowhouses.",
    },
    "Plaza of Banners": {
        owner: "Wave's Break",
        notes: "Ceremonial plaza displaying guild and caravan colors.",
    },
    "Goldleaf Atelier": {
        owner: "Goldleaf Artisan Estate",
        stewards: ["Master Crafter Irelle Goldleaf"],
        notes: "Commission studio for noble regalia and ceremony gifts.",
    },
    "Engravers' Guild": {
        owner: "Etchline Guild Family",
        stewards: ["Guildmaster Corvel Etchline"],
        notes: "Seal presses and insignia plates for civic offices.",
    },
    "Glassmakers' Hall": {
        owner: "Cristalle Glasswright Circle",
        stewards: ["Mistress Aurelia Cristalle"],
        notes: "Master glassblowers share furnaces for noble commissions.",
    },
    "Crystal Tide Glassworks": {
        owner: "Cristalle Glasswright Circle",
        stewards: ["Journeyman Lysa Cristalle"],
        notes: "Cooling galleries for stained panes exported to Coral Keep.",
    },
    "The Argent Griffin Inn": {
        owner: "Argentgriff Hostelry",
        stewards: ["Innkeeper Orel Argentgriff"],
        notes: "Luxurious suites for dignitaries and guildmasters.",
    },
    // Craft ward extensions
    "Tidefire Forge": {
        owner: "Ironbent Forgeclan",
        stewards: ["Forge Captain Brakka Ironbent"],
        notes: "Guild forge dedicated to masterwork commissions.",
    },
    "Lumber Yard and Carpenter's Hall": {
        owner: "Woodhand Timber Charter",
        stewards: ["Guildmistress Tella Woodhand"],
        notes: "Shared yard supplying beams to shipwrights and builders.",
    },
    "Threadneedle Hall": {
        owner: "Threadneedle Atelier",
        stewards: ["Mistress Seraphine Threadneedle"],
        notes: "Pattern vault and journeyman dormitory for clothiers.",
    },
    "Seastone Ceramics": {
        owner: "Seastone Kiln Family",
        stewards: ["Potter Neris Seastone"],
        notes: "Glazed tableware favored in Highward salons.",
    },
    "Brinemarrow Press": {
        owner: "Brinemarrow Print Family",
        stewards: ["Printer Hallen Brinemarrow"],
        notes: "Broadside press handling guild notices and tavern playbills.",
    },
    "Tern Hook Butchery": {
        owner: "Hooke & Tern Family",
        stewards: ["Butcher Mara Hooke"],
        notes: "Harbor butchers preparing catches for market stalls.",
    },
    "Driftwood Smokehouse": {
        owner: "Driftwood Smoker Family",
        stewards: ["Smokemaster Pell Driftwood"],
        notes: "Cured fish destined for caravans and the Gatewatch mess.",
    },
    "Gull's Galley": {
        owner: "Gullwharf Family",
        stewards: ["Chef Ilven Gullwharf"],
        notes: "Dockside eatery known for gull-egg pies and chowders.",
    },
    "Dockside Exchange Plaza": {
        owner: "Wave's Break",
        notes: "Open plaza where caravan factors meet arriving captains.",
    },
    "Saltroot Remedies": {
        owner: "Saltroot Apothecaries",
        stewards: ["Herbalist Vela Saltroot"],
        notes: "Remedy counter for sailors and laborers nursing injuries.",
    },
    "Tern Harbor Commons": {
        owner: "Wave's Break",
        notes: "Common green hosting fisher markets and coastal festivals.",
    },
    "Cobbler's Square": {
        owner: "Wave's Break",
        stewards: ["Cobblers' Guild Matron Edda Pebblestep"],
        notes: "Shared courtyard for bootmakers and leather patchers.",
    },
    "Grain Mills": {
        owner: "Wave's Break",
        stewards: ["Miller Council of Saltmarsh"],
        notes: "City-controlled mills grinding tithe grain for gate markets.",
    },
    "The Emberflask Alchemist": {
        owner: "Emberflask Family",
        stewards: ["Alchemist Joral Emberflask"],
        notes: "Streetfront atelier distilling tonics for caravan guards.",
    },
    "Tideglass Alchemical Atelier": {
        owner: "Tideglass Distillers",
        stewards: ["Mistress Helene Tideglass"],
        notes: "Refined essences bound for Greensoul laboratories.",
    },
    "Shrine of the Craftfather": {
        owner: "Craftfather Devotional Guild",
        stewards: ["Forge Chaplain Dovan Brassmantle"],
        notes: "Guild artisans seek blessings before major commissions.",
    },
    "The Wandering Coin Tavern": {
        owner: "Coinstep Hospitality",
        stewards: ["Keeper Jossa Coinstep"],
        notes: "High Road watering hole for caravan guards and factors.",
    },
    // Greensoul Hill landmarks
    "Greensoul Monastery": {
        owner: "Greensoul Monastic Order",
        stewards: ["Prior Selvan Greensoul"],
        notes: "Scholars and healers study within the monastery cloisters.",
    },
    "The Arcanists' Enclave": {
        owner: "Starweaver Arcanum Trust",
        stewards: ["Archmage Selene Starweaver"],
        notes: "Public receiving hall for the enclave's lectures and petitions.",
    },
    "Arc Runes Enchantery": {
        owner: "Runeveil Enchanters",
        stewards: ["Runesmith Sira Runeveil"],
        notes: "Vaulted studios for inscription and spellwork commissions.",
    },
    "Ink and Quill Hall": {
        owner: "Quillion Scribes' Circle",
        stewards: ["Archscribe Mel Quillion"],
        notes: "Scriptorium copying charters and illuminated histories.",
    },
    "Greensoul Press & Papermill": {
        owner: "Leafpress Papermakers",
        stewards: ["Master Miller Soren Leafpress"],
        notes: "Papermill supplying codices for the library and guild halls.",
    },
    "Glass Eel Glassworks": {
        owner: "Glass Eel Cooperative",
        stewards: ["Journeyman Ryn Glass Eel"],
        notes: "Specialty rods and vials for arcanists and apothecaries.",
    },
    "Shrine of the Dawnfather": {
        owner: "Sunward Clergy",
        stewards: ["Lightkeeper Vara Sunward"],
        notes: "Morning devotions for scholars and guard captains.",
    },
    "The Whispering Garden": {
        owner: "Wave's Break",
        stewards: ["Garden Keeper Siala Whisper"],
        notes: "Public meditation garden tended by monastery novices.",
    },
    "Royal Botanical Gardens": {
        owner: "Wave's Break",
        stewards: ["Curator Elian Thistlebright"],
        notes: "Crown-funded conservatory cataloguing rare specimens.",
    },
    "Greensoul Amphitheater": {
        owner: "Wave's Break",
        notes: "Stone amphitheater for civic addresses and guild performances.",
    },
    "Sunleaf Terrace": {
        owner: "Sunleaf Hospitality Family",
        stewards: ["Innkeeper Lysa Sunleaf"],
        notes: "Rooftop tea terrace adjoining the Sunleaf Inn.",
    },
    "Celestine Bathhouse & Springs": {
        owner: "Celestine Bathhouse Guild",
        stewards: ["Mistress Ravia Celestine"],
        notes: "Mineral springs and steam rooms chartered to the Celestine family.",
    },
    "Aurora Amphitheater": {
        owner: "Aurora Performance Trust",
        stewards: ["Producer Valen Aurora"],
        notes: "Indoor hall for bardic contests and magical displays.",
    },
    "Gilded Lyre Gallery": {
        owner: "Lyrecrown Curators",
        stewards: ["Curator Selise Lyrecrown"],
        notes: "Gallery hosting sculpture and illuminated manuscripts.",
    },
    "The Glass Eel Tavern": {
        owner: "Glass Eel Cooperative",
        stewards: ["Innkeep Mara Glass Eel"],
        notes: "Scholars' tavern tucked beside the arcanists' quarter.",
    },
    "The Grand Arena": {
        owner: "Wave's Break",
        notes: "Festival arena backing the Seastone complex for public spectacles.",
    },
    // Lower Gardens promenades
    "Herbalists' Quarter": {
        owner: "Herbalists' Guild",
        stewards: ["Mistress Danel Greenroot"],
        notes: "Cluster of stalls for rare herbs and tinctures.",
    },
    "Apiaries and Beekeepers": {
        owner: "Apiarist Families Council",
        stewards: ["Honeywarden Sera Cliffbloom"],
        notes: "Urban hives maintained by Cliffbloom and Mistflower lines.",
    },
    "Oil Presses and Mills": {
        owner: "Presswright Cooperative",
        stewards: ["Master Presser Olun Presswright"],
        notes: "Olive and nut presses run by Presswright and Foamfield crews.",
    },
    "Garden Gate Brewery & Taproom": {
        owner: "Garden Gate Brewfamily",
        stewards: ["Brewmistress Kelda Garden"],
        notes: "Taproom sourcing honeyed ales from Anchor's Toast barrels.",
    },
    "Stonecutters' Guild": {
        owner: "Stonehewer Guild",
        stewards: ["Guildmaster Torin Stonehewer"],
        notes: "Guild hall managing quarry quotas and mason apprentices.",
    },
    "Shrine of the Harvestmother": {
        owner: "Harvestmother Matrons",
        stewards: ["Matron Sela Harvestmother"],
        notes: "Blessing hall for farmers and market gardeners.",
    },
    "Public Baths": {
        owner: "Wave's Break",
        notes: "Civic bathhouse drawing heated water from subterranean pipes.",
    },
    "Flower Gardens and Orchard Walks": {
        owner: "Wave's Break",
        stewards: ["Gardener Lira Bloom"],
        notes: "Public promenades linking the botanical quarter to South Gate.",
    },
    "Bloomstage Theater": {
        owner: "Bloomstage Troupe",
        stewards: ["Director Falor Bloomstage"],
        notes: "Playhouse famed for satirical dramas and festival operettas.",
    },
    "The Sunleaf Inn": {
        owner: "Sunleaf Hospitality Family",
        stewards: ["Innkeeper Lysa Sunleaf"],
        notes: "Streetfront entrance and guest ledger wing of the Sunleaf Inn complex.",
    },
    "The Velvet Petal Brothel": {
        owner: "Silkensong Matrons",
        stewards: ["Madam Ysera Silkensong"],
        notes: "Discrete establishment catering to visiting nobles and captains.",
    },
    // High Road service yards
    "Iron Key Smithy": {
        owner: "Ironkey Forge Family",
        stewards: ["Smith Joral Ironkey"],
        notes: "Forge crafting locksets and wagon hardware for caravans.",
    },
    "Salted Hide Tannery": {
        owner: "Salted Hide Curriers",
        stewards: ["Currier Mave Saltedhide"],
        notes: "Tannery adjoining the Wavehide guild for raw hide processing.",
    },
    "Shrine of the Roadwarden": {
        owner: "Roadwarden Order",
        stewards: ["Marshal Theon Shieldmarch"],
        notes: "Shrine where caravan guards swear oaths before departure.",
    },
    "Caravan Square": {
        owner: "Wave's Break",
        notes: "Staging plaza for caravan musters and pack-train inspections.",
    },
    "Wayfarer's Rest Tavern": {
        owner: "Wayfarer Hearth Family",
        stewards: ["Innkeep Dela Wayfarer"],
        notes: "Roadhouse serving trail stews and quiet bunks.",
    },
    // Farmland support structures
    "Harbor Hearth Bakery": {
        owner: "Hearthoven Bakers",
        stewards: ["Baker Thera Hearthoven"],
        notes: "Bakery distributing loaves to gate barracks and caravans.",
    },
    "Tidehold Granary & Provisioners": {
        owner: "Wave's Break",
        stewards: ["Quartermaster Rel Tidehold"],
        notes: "Provision yard stockpiling grain and tack for emergency levies.",
    },
};
export function applyWavesBreakRegistry(locations) {
    const wave = locations["Wave's Break"];
    if (!wave)
        return;
    const businessGroups = new Map(Array.from(ALL_BUSINESS_GROUPS.entries()).map(([key, names]) => [
        key,
        filterBusinesses(wave.businesses, names),
    ]));
    const customBoards = {};
    const boardPlans = [
        ["farmland", FARMLAND_BOARD_PLAN],
        ["port", PORT_BOARD_PLAN],
        ["upper", UPPER_WARD_BOARD_PLAN],
        ["terns", LITTLE_TERNS_BOARD_PLAN],
        ["greensoul", GREENSOUL_HILL_BOARD_PLAN],
        ["gardens", LOWER_GARDENS_BOARD_PLAN],
        ["highroad", HIGH_ROAD_BOARD_PLAN],
    ];
    boardPlans.forEach(([key, plan]) => {
        const businesses = businessGroups.get(key) || [];
        const binding = getGroupBinding(key);
        businesses.forEach((business) => applyQuestVisibilityToBusiness(business, binding));
        const boards = collectBoardQuests(businesses, plan, binding);
        Object.assign(customBoards, boards);
    });
    wave.questBoards = customBoards;
    wave.quests = Object.values(customBoards).reduce((acc, quests) => acc.concat(quests), []);
    wave.ownership = {
        businesses: WAVES_BREAK_BUSINESS_OWNERS,
        buildings: {
            ...WAVES_BREAK_BUSINESS_OWNERS,
            ...WAVES_BREAK_BUILDING_OWNERS,
        },
    };
}
export const WAVES_BREAK_REGISTRY = {
    businessOwners: WAVES_BREAK_BUSINESS_OWNERS,
    buildingOwners: {
        ...WAVES_BREAK_BUSINESS_OWNERS,
        ...WAVES_BREAK_BUILDING_OWNERS,
    },
    boardPlans: ALL_BOARD_PLANS,
};
