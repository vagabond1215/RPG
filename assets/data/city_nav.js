import { LOCATIONS } from "./locations.js";

export const CITY_NAV = {
  "Wave's Break": {
    districts: {
      "The Port District": {
        travelPrompt: "Walk to",
        points: [
          {
            name: "Harbor Guard Naval Yard",
            type: "building",
            target: "Harbor Guard Naval Yard",
            icon: "assets/images/icons/waves_break/Harbor Guard Naval Yard.png",
          },
          {
            name: "Nobles' Quay",
            type: "building",
            target: "Nobles' Quay",
            icon: "assets/images/icons/waves_break/Noble's Quay.png",
          },
          {
            name: "Merchants' Wharf",
            type: "building",
            target: "Merchants' Wharf",
            icon: "assets/images/icons/waves_break/Merchant's Wharf.png",
          },
          {
            name: "Fisherman's Pier",
            type: "building",
            target: "Fisherman's Pier",
            icon: "assets/images/icons/waves_break/Fisherman's Pier.png",
          },
          { name: "Tideway Inn", type: "building", target: "Tideway Inn", icon: "assets/images/icons/waves_break/Tideway Inn.png" },
          { name: "The Upper Ward", type: "district", target: "The Upper Ward", icon: "assets/images/icons/waves_break/Upper Ward District.png" },
          { name: "Little Terns", type: "district", target: "Little Terns", icon: "assets/images/icons/waves_break/Little Terns District.png" }
          ]
        },
        "The Upper Ward": {
          travelPrompt: "Walk to",
          points: [
            { name: "Governor's Keep", type: "building", target: "Governor's Keep", icon: "assets/images/icons/waves_break/Governor's Keep.png" },
            { name: "Crafting Quarter", type: "building", target: "Crafting Quarter", icon: "assets/images/icons/waves_break/Crafting Quarter.png" },
            { name: "Mercantile Exchange", type: "building", target: "Mercantile Exchange", icon: "assets/images/icons/waves_break/Mercantile Exchange.png" },
            { name: "Temple of the Tides", type: "building", target: "Temple of the Tides", icon: "assets/images/icons/waves_break/Temple of the Tides.png" },
            { name: "Hall of Records", type: "building", target: "Hall of Records", icon: "assets/images/icons/waves_break/Hall of Records.png" },
            { name: "The Port District", type: "district", target: "The Port District", icon: "assets/images/icons/waves_break/Port District.png" },
            { name: "Greensoul Hill", type: "district", target: "Greensoul Hill", icon: "assets/images/icons/waves_break/Greensoul Hill District.png" }
          ]
        },
        "Little Terns": {
          travelPrompt: "Walk to",
          points: [
            { name: "Crystal Tide Glassworks", type: "building", target: "Crystal Tide Glassworks", icon: "assets/images/icons/waves_break/Crystal Tide Glassworks.png" },
            { name: "Tidefire Forge", type: "building", target: "Tidefire Forge", icon: "assets/images/icons/waves_break/Tidefire Forge.png" },
            { name: "Timberwave Carpenters' Guild", type: "building", target: "Timberwave Carpenters' Guild", icon: "assets/images/icons/waves_break/Timberwave Carpenters' Guild.png" },
            { name: "The Gilded Needle Clothiers", type: "building", target: "The Gilded Needle Clothiers", icon: "assets/images/icons/waves_break/The Gilded Needle Clothiers.png" },
            { name: "Salted Hide Tannery", type: "building", target: "Salted Hide Tannery", icon: "assets/images/icons/waves_break/Salted Hide Tannery.png" },
            { name: "Tideglass Alchemical Atelier", type: "building", target: "Tideglass Alchemical Atelier", icon: "assets/images/icons/waves_break/Tideglass Alchemical Atelier.png" },
            { name: "Arc Runes Enchantery", type: "building", target: "Arc Runes Enchantery", icon: "assets/images/icons/waves_break/Arc Runes Enchantery.png" },
              { name: "The Port District", type: "district", target: "The Port District", icon: "assets/images/icons/waves_break/Port District.png" },
              { name: "Greensoul Hill", type: "district", target: "Greensoul Hill", icon: "assets/images/icons/waves_break/Greensoul Hill District.png" }
          ]
        },
        "Greensoul Hill": {
          travelPrompt: "Walk to",
          points: [
              { name: "The Upper Ward", type: "district", target: "The Upper Ward", icon: "assets/images/icons/waves_break/Upper Ward District.png" },
            { name: "Little Terns", type: "district", target: "Little Terns", icon: "assets/images/icons/waves_break/Little Terns District.png" },
            { name: "The Lower Gardens", type: "district", target: "The Lower Gardens", icon: "assets/images/icons/waves_break/Lower Gardens District.png" }
          ]
        },
        "The Lower Gardens": {
          travelPrompt: "Walk to",
          points: [
            { name: "Harbor Hearth Bakery", type: "building", target: "Harbor Hearth Bakery", icon: "assets/images/icons/waves_break/Harbor Hearth Bakery.png" },
            { name: "Tidehold Granary & Provisioners", type: "building", target: "Tidehold Granary & Provisioners", icon: "assets/images/icons/waves_break/Tidehold Granary and Provisioners.png" },
              { name: "Greensoul Hill", type: "district", target: "Greensoul Hill", icon: "assets/images/icons/waves_break/Greensoul Hill District.png" },
            { name: "The High Road District", type: "district", target: "The High Road District", icon: "assets/images/icons/waves_break/The High Road District.png" }
          ]
        },
        "The High Road District": {
          travelPrompt: "Walk to",
          points: [
            { name: "The Lower Gardens", type: "district", target: "The Lower Gardens", icon: "assets/images/icons/waves_break/Lower Gardens District.png" },
            { name: "The Farmlands Beyond the Walls", type: "district", target: "The Farmlands Beyond the Walls", icon: "assets/images/icons/waves_break/The Farmlands.png" }
          ]
        },
        "The Farmlands Beyond the Walls": {
          travelPrompt: "Walk to",
          points: [
            { name: "The High Road District", type: "district", target: "The High Road District", icon: "assets/images/icons/waves_break/The High Road District.png" },
            { name: "East Road to Mountain Top", type: "location", target: "Mountain Top" }
          ]
        }
      },
    buildings: {
      "Tideway Inn": {
        travelPrompt: "Exit to",
        description: "Warm lantern light and the murmur of sailors greet you.",
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "Governor's Keep": {
        travelPrompt: "Exit to",
        description: "Banners hang above polished stone halls bustling with officials.",
        exits: [ { name: "The Upper Ward", target: "The Upper Ward" } ],
        interactions: []
      },
      "Crafting Quarter": {
        travelPrompt: "Exit to",
        description: "Workbenches overflow with tools while artisans hammer and sew.",
        exits: [ { name: "The Upper Ward", target: "The Upper Ward" } ],
        interactions: []
      },
      "Mercantile Exchange": {
        travelPrompt: "Exit to",
        description: "Traders haggle beneath high arches stacked with crates and ledgers.",
        exits: [ { name: "The Upper Ward", target: "The Upper Ward" } ],
        interactions: [],
        produces: { resources: [], commodities: ["trade contracts"], luxuries: [] },
        consumes: { resources: [], commodities: ["market goods"], luxuries: ["rare items"] }
      },
      "Temple of the Tides": {
        travelPrompt: "Exit to",
        description: "Salt-scented incense drifts around statues carved from sea stone.",
        exits: [ { name: "The Upper Ward", target: "The Upper Ward" } ],
        interactions: []
      },
      "Hall of Records": {
        travelPrompt: "Exit to",
        description: "Tall shelves of scrolls rise in orderly rows under hushed silence.",
        exits: [ { name: "The Upper Ward", target: "The Upper Ward" } ],
        interactions: []
      },
      "Harbor Guard Naval Yard": {
        travelPrompt: "Exit to",
        description: "Ship hulls and disciplined marines line the busy dockside yard.",
        exits: [
          { name: "The Port District", target: "The Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: ["ships"], luxuries: [] },
        consumes: { resources: ["timber", "iron"], commodities: [], luxuries: [] }
      },
      "Nobles' Quay": {
        travelPrompt: "Exit to",
        description: "Gilded barges bob beside polished piers watched by cloaked attendants.",
        exits: [
          { name: "The Port District", target: "The Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: ["imported finery"] },
        consumes: { resources: [], commodities: [], luxuries: ["luxury goods"] }
      },
      "Merchants' Wharf": {
        travelPrompt: "Exit to",
        description: "Crates and shouting dockworkers crowd the bustling commercial pier.",
        exits: [
          { name: "The Port District", target: "The Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: ["trade shipments"], luxuries: [] },
        consumes: { resources: [], commodities: ["imports"], luxuries: [] }
      },
      "Crystal Tide Glassworks": {
        travelPrompt: "Exit to",
        description: "Furnaces roar as molten glass twists into shimmering shapes.",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Glassblowing (Master)", action: "train-glassblowing", tier: "master" } ],
        produces: { resources: [], commodities: ["glassware"], luxuries: ["art glass"] },
        consumes: { resources: ["sand", "fuel"], commodities: [], luxuries: [] }
      },
      "Tidefire Forge": {
        travelPrompt: "Exit to",
        description: "Anvils ring amid showers of sparks and the smell of hot iron.",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Blacksmithing (Journeyman)", action: "train-blacksmithing", tier: "journeyman" } ],
        produces: { resources: [], commodities: ["metal goods"], luxuries: [] },
        consumes: { resources: ["ore", "coal"], commodities: [], luxuries: [] }
      },
      "Timberwave Carpenters' Guild": {
        travelPrompt: "Exit to",
        description: "Stacks of timber and the scent of fresh sawdust fill the hall.",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Carpentry (Journeyman)", action: "train-carpentry", tier: "journeyman" } ],
        produces: { resources: [], commodities: ["woodcraft"], luxuries: [] },
        consumes: { resources: ["timber"], commodities: [], luxuries: [] }
      },
      "The Gilded Needle Clothiers": {
        travelPrompt: "Exit to",
        description: "Bolts of cloth and neatly labeled threads await deft hands.",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Tailoring (Apprentice)", action: "train-tailoring", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["garments"], luxuries: [] },
        consumes: { resources: [], commodities: ["cloth"], luxuries: [] }
      },
      "Salted Hide Tannery": {
        travelPrompt: "Exit to",
        description: "Hides hang from beams while craftsmen stitch sturdy gear.",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Leatherworking (Apprentice)", action: "train-leatherworking", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["leather goods"], luxuries: [] },
        consumes: { resources: ["hides"], commodities: [], luxuries: [] }
      },
      "Tideglass Alchemical Atelier": {
        travelPrompt: "Exit to",
        description: "Bubbling flasks and acrid fumes swirl among cluttered tables.",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Alchemy (Journeyman)", action: "train-alchemy", tier: "journeyman" } ],
        produces: { resources: [], commodities: ["potions"], luxuries: ["elixirs"] },
        consumes: { resources: ["herbs", "reagents"], commodities: [], luxuries: [] }
      },
      "Arc Runes Enchantery": {
        travelPrompt: "Exit to",
        description: "Runed crystals glow softly over circles etched in the floor.",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Enchanting (Initiate)", action: "train-enchanting", tier: "initiate" } ],
        produces: { resources: [], commodities: [], luxuries: ["enchanted items"] },
        consumes: { resources: ["mana crystals"], commodities: [], luxuries: [] }
      },
      "Fisherman's Pier": {
        travelPrompt: "Exit to",
        description: "Nets dry on posts as gulls cry over baskets of fish.",
        exits: [
          { name: "The Port District", target: "The Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: ["fish"], commodities: [], luxuries: [] },
        consumes: { resources: ["nets", "boats"], commodities: [], luxuries: [] }
      },
      "Harbor Hearth Bakery": {
        travelPrompt: "Exit to",
        description: "Ovens radiate warmth while fresh loaves cool on wide shelves.",
        exits: [ { name: "The Lower Gardens", target: "The Lower Gardens" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["bread"], luxuries: [] },
        consumes: { resources: ["grain"], commodities: [], luxuries: [] }
      },
      "Tidehold Granary & Provisioners": {
        travelPrompt: "Exit to",
        description: "Massive bins overflow with grain guarded by stoic stewards.",
        exits: [ { name: "The Lower Gardens", target: "The Lower Gardens" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: [], luxuries: [] },
        consumes: { resources: ["grain"], commodities: [], luxuries: [] }
      }
    }
  },
  "Coral Keep": {
    districts: {
        "The South Docks & Steel Docks": {
        travelPrompt: "Walk to",
        points: [
          { name: "Steel Watch Naval Docks", type: "building", target: "Steel Watch Naval Docks" },
          { name: "Coral Court Quay", type: "building", target: "Coral Court Quay" },
          { name: "Glassmarket Wharf", type: "building", target: "Glassmarket Wharf" },
          { name: "Glassblowing Workshop", type: "building", target: "Glassblowing Workshop" },
          { name: "Pearl Commons Pier", type: "building", target: "Pearl Commons Pier" },
          { name: "Pearl Diving Dock", type: "building", target: "Pearl Diving Dock" },
          { name: "Smithing Forge", type: "building", target: "Smithing Forge" },
          { name: "Carpentry Lodge", type: "building", target: "Carpentry Lodge" },
          { name: "Tailoring Shop", type: "building", target: "Tailoring Shop" },
          { name: "Leatherworking Shed", type: "building", target: "Leatherworking Shed" },
          { name: "Alchemy Lab", type: "building", target: "Alchemy Lab" },
          { name: "Enchanting Sanctum", type: "building", target: "Enchanting Sanctum" },
            { name: "The Military Ward", type: "district", target: "The Military Ward", icon: "assets/images/icons/waves_break/Military Ward District.png" }
        ]
      },
        "The Military Ward": {
        travelPrompt: "Walk to",
        points: [
            { name: "The South Docks & Steel Docks", type: "district", target: "The South Docks & Steel Docks" },
          { name: "Greywind's Edge", type: "district", target: "Greywind's Edge" }
        ]
      },
      "Greywind's Edge": {
        travelPrompt: "Walk to",
        points: [
            { name: "The Military Ward", type: "district", target: "The Military Ward", icon: "assets/images/icons/waves_break/Military Ward District.png" },
          { name: "West Road to Timber Grove", type: "location", target: "Timber Grove" }
        ]
      }
    },
    buildings: {
      "Steel Watch Naval Docks": {
        travelPrompt: "Exit to",
        description: "Warships rest in ordered rows while crews drill with precision.",
        exits: [
          { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: ["ships"], luxuries: [] },
        consumes: { resources: ["timber", "iron"], commodities: [], luxuries: [] }
      },
      "Coral Court Quay": {
        travelPrompt: "Exit to",
        description: "Bright coral inlays gleam along piers reserved for the nobility.",
        exits: [
          { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: ["coral goods"] },
        consumes: { resources: [], commodities: [], luxuries: ["luxury trade"] }
      },
      "Glassmarket Wharf": {
        travelPrompt: "Exit to",
        description: "Casks of gleaming glassware sparkle in the sun between traders.",
        exits: [
          { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: ["glass trade"], luxuries: [] },
        consumes: { resources: [], commodities: ["glassware"], luxuries: [] }
      },
      "Pearl Commons Pier": {
        travelPrompt: "Exit to",
        description: "Divers unload shell baskets beside market stalls glittering with pearls.",
        exits: [
          { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: ["pearls"] },
        consumes: { resources: ["diving gear"], commodities: [], luxuries: [] }
      },
      "Glassblowing Workshop": {
        travelPrompt: "Exit to",
        description: "Furnaces roar as molten glass twists into shimmering shapes.",
        exits: [ { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Glassblowing (Apprentice)", action: "train-glassblowing", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["glassware"], luxuries: ["art glass"] },
        consumes: { resources: ["sand", "fuel"], commodities: [], luxuries: [] }
      },
      "Pearl Diving Dock": {
        travelPrompt: "Exit to",
        description: "Ropes and air pumps clutter the pier where divers ready themselves.",
        exits: [ { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Pearl Diving (Journeyman)", action: "train-pearl-diving", tier: "journeyman" } ],
        produces: { resources: [], commodities: [], luxuries: ["pearls"] },
        consumes: { resources: ["diving gear"], commodities: [], luxuries: [] }
      },
      "Smithing Forge": {
        travelPrompt: "Exit to",
        description: "Anvils ring amid showers of sparks and the smell of hot iron.",
        exits: [ { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Blacksmithing (Apprentice)", action: "train-blacksmithing", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["metal goods"], luxuries: [] },
        consumes: { resources: ["ore", "coal"], commodities: [], luxuries: [] }
      },
      "Carpentry Lodge": {
        travelPrompt: "Exit to",
        description: "Stacks of timber and the scent of fresh sawdust fill the hall.",
        exits: [ { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Carpentry (Apprentice)", action: "train-carpentry", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["woodcraft"], luxuries: [] },
        consumes: { resources: ["timber"], commodities: [], luxuries: [] }
      },
      "Tailoring Shop": {
        travelPrompt: "Exit to",
        description: "Bolts of cloth and neatly labeled threads await deft hands.",
        exits: [ { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Tailoring (Apprentice)", action: "train-tailoring", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["garments"], luxuries: [] },
        consumes: { resources: [], commodities: ["cloth"], luxuries: [] }
      },
      "Leatherworking Shed": {
        travelPrompt: "Exit to",
        description: "Hides hang from beams while craftsmen stitch sturdy gear.",
        exits: [ { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Leatherworking (Initiate)", action: "train-leatherworking", tier: "initiate" } ],
        produces: { resources: [], commodities: ["leather goods"], luxuries: [] },
        consumes: { resources: ["hides"], commodities: [], luxuries: [] }
      },
      "Alchemy Lab": {
        travelPrompt: "Exit to",
        description: "Bubbling flasks and acrid fumes swirl among cluttered tables.",
        exits: [ { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Alchemy (Apprentice)", action: "train-alchemy", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["potions"], luxuries: ["elixirs"] },
        consumes: { resources: ["herbs", "reagents"], commodities: [], luxuries: [] }
      },
      "Enchanting Sanctum": {
        travelPrompt: "Exit to",
        description: "Runed crystals glow softly over circles etched in the floor.",
        exits: [ { name: "The South Docks & Steel Docks", target: "The South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Enchanting (Initiate)", action: "train-enchanting", tier: "initiate" } ],
        produces: { resources: [], commodities: [], luxuries: ["enchanted items"] },
        consumes: { resources: ["mana crystals"], commodities: [], luxuries: [] }
      }
    }
  },
  "Timber Grove": {
    districts: {
      "Central Plaza": {
        travelPrompt: "Walk to",
        points: [
          { name: "Fishing Bridges", type: "district", target: "Fishing Bridges" },
          { name: "The Lumberworks", type: "district", target: "The Lumberworks" },
          { name: "Fields & Orchards", type: "district", target: "Fields & Orchards" },
          { name: "Shrine of the Forest Father", type: "building", target: "Shrine of the Forest Father" },
          { name: "The Timberhall", type: "building", target: "The Timberhall" },
          { name: "Forest Rest Inn", type: "building", target: "Forest Rest Inn" },
          { name: "The Riverhouse", type: "building", target: "The Riverhouse" },
          { name: "Town Gates", type: "district", target: "Town Gates" }
        ]
      },
      "Fishing Bridges": {
        travelPrompt: "Walk to",
        points: [
          { name: "Central Plaza", type: "district", target: "Central Plaza" },
          { name: "The Mine", type: "district", target: "The Mine" },
          { name: "Wayside Shrine of the River-Mother", type: "building", target: "Wayside Shrine of the River-Mother" }
        ]
      },
      "The Lumberworks": {
        travelPrompt: "Walk to",
        points: [
          { name: "Central Plaza", type: "district", target: "Central Plaza" },
          { name: "Fields & Orchards", type: "district", target: "Fields & Orchards" },
          { name: "Logger's Flask Tavern", type: "building", target: "Logger's Flask Tavern" }
        ]
      },
      "Fields & Orchards": {
        travelPrompt: "Walk to",
        points: [
          { name: "The Lumberworks", type: "district", target: "The Lumberworks" },
          { name: "The Mine", type: "district", target: "The Mine" }
        ]
      },
      "The Mine": {
        travelPrompt: "Walk to",
        points: [
          { name: "Fields & Orchards", type: "district", target: "Fields & Orchards" },
          { name: "Fishing Bridges", type: "district", target: "Fishing Bridges" },
          { name: "Crystalsong Lodge", type: "building", target: "Crystalsong Lodge" }
        ]
      },
      "Town Gates": {
        travelPrompt: "Walk to",
        points: [
          { name: "Central Plaza", type: "district", target: "Central Plaza" },
          { name: "West Road to Creekside", type: "location", target: "Creekside" },
          { name: "River Barge to Coral Keep", type: "location", target: "Coral Keep" }
        ]
      }
    },
    buildings: {
      "Shrine of the Forest Father": {
        travelPrompt: "Exit to",
        description: "Moss-covered stones ring a serene altar beneath towering pines.",
        exits: [ { name: "Central Plaza", target: "Central Plaza" } ],
        interactions: []
      },
      "The Timberhall": {
        travelPrompt: "Exit to",
        description: "Rough-hewn beams frame a bustling hall rich with resin scent.",
        exits: [ { name: "Central Plaza", target: "Central Plaza" } ],
        interactions: []
      },
      "Forest Rest Inn": {
        travelPrompt: "Exit to",
        description: "A crackling hearth and sturdy wooden beds offer weary lumberjacks respite.",
        exits: [ { name: "Central Plaza", target: "Central Plaza" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "The Riverhouse": {
        travelPrompt: "Exit to",
        description: "Water laps softly beneath the stilts of this tranquil riverside house.",
        exits: [ { name: "Central Plaza", target: "Central Plaza" } ],
        interactions: []
      },
      "Wayside Shrine of the River-Mother": {
        travelPrompt: "Exit to",
        description: "Offerings drift in bowls beside a gentle stream-fed shrine.",
        exits: [ { name: "Fishing Bridges", target: "Fishing Bridges" } ],
        interactions: []
      },
      "Logger's Flask Tavern": {
        travelPrompt: "Exit to",
        description: "Loud laughter mingles with the aroma of pine ale and smoke.",
        exits: [ { name: "The Lumberworks", target: "The Lumberworks" } ],
        interactions: []
      },
      "Crystalsong Lodge": {
        travelPrompt: "Exit to",
        description: "Glittering crystals line the walls, casting prismatic light over miners.",
        exits: [ { name: "The Mine", target: "The Mine" } ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: ["crystals"] },
        consumes: { resources: ["ore"], commodities: [], luxuries: [] }
      }
    }
  },
  "Creekside": {
    districts: {
      "Greenford": {
        travelPrompt: "Walk to",
        points: [
          { name: "Everrise Bridge", type: "district", target: "Everrise Bridge" },
          { name: "Stoneknot", type: "district", target: "Stoneknot" },
          { name: "Farmland Estates", type: "building", target: "Farmland Estates" },
          { name: "Cattle Yards", type: "building", target: "Cattle Yards" },
          { name: "The Creamery Hall", type: "building", target: "The Creamery Hall" },
          { name: "Leatherworkers' Guildhouse", type: "building", target: "Leatherworkers' Guildhouse" },
          { name: "Shrine of the Harvestmother", type: "building", target: "Shrine of the Harvestmother" },
          { name: "The Plowman's Rest Tavern", type: "building", target: "The Plowman's Rest Tavern" },
          { name: "City Bakery", type: "building", target: "City Bakery" },
          { name: "Central Granary", type: "building", target: "Central Granary" }
        ]
      },
      "Everrise Bridge": {
        travelPrompt: "Walk to",
        points: [
          { name: "Greenford", type: "district", target: "Greenford" },
          { name: "Stoneknot", type: "district", target: "Stoneknot" },
          { name: "The Everrise Bridge", type: "building", target: "The Everrise Bridge" },
          { name: "Fishermen's Guild", type: "building", target: "Fishermen's Guild" },
          { name: "Fishmongers' Market", type: "building", target: "Fishmongers' Market" },
          { name: "Riverside Warehouses", type: "building", target: "Riverside Warehouses" },
          { name: "Shrine of the River-Mother", type: "building", target: "Shrine of the River-Mother" },
          { name: "The Waterwheel Mill", type: "building", target: "The Waterwheel Mill" },
          { name: "The Oaken Net Tavern", type: "building", target: "The Oaken Net Tavern" }
        ]
      },
      "Stoneknot": {
        travelPrompt: "Walk to",
        points: [
          { name: "Greenford", type: "district", target: "Greenford" },
          { name: "Everrise Bridge", type: "district", target: "Everrise Bridge" },
          { name: "The Grand Guildhall of Creekside", type: "building", target: "The Grand Guildhall of Creekside" },
          { name: "Military Barracks and Armory", type: "building", target: "Military Barracks and Armory" },
          { name: "The Muster Yard", type: "building", target: "The Muster Yard" },
          { name: "Shrine of the Twin Watchers", type: "building", target: "Shrine of the Twin Watchers" },
          { name: "Stonecutters' Guild", type: "building", target: "Stonecutters' Guild" },
          { name: "Glass Factory", type: "building", target: "Glass Factory" },
          { name: "Glassblowers' Guild", type: "building", target: "Glassblowers' Guild" },
          { name: "Butchers' Row", type: "building", target: "Butchers' Row" },
          { name: "The Iron Kettle Tavern", type: "building", target: "The Iron Kettle Tavern" },
          { name: "The Traveler's Hearth Inn", type: "building", target: "The Traveler's Hearth Inn" }
        ]
      },
      "Surrounding Farmlands & Orchards": {
        travelPrompt: "Walk to",
        points: [
          { name: "Greenford", type: "district", target: "Greenford" },
          { name: "Sugar Cane and Beet Fields", type: "building", target: "Sugar Cane and Beet Fields" },
          { name: "Fruit Orchards", type: "building", target: "Fruit Orchards" },
          { name: "Vineyards and Wineries", type: "building", target: "Vineyards and Wineries" },
          { name: "Goat and Sheep Farms", type: "building", target: "Goat and Sheep Farms" },
          { name: "Outlying Watchtowers", type: "building", target: "Outlying Watchtowers" },
          { name: "Roadside Shrine of the Forest Father", type: "building", target: "Roadside Shrine of the Forest Father" },
          { name: "Road to Timber Grove", type: "location", target: "Timber Grove" },
          { name: "River to Coral Keep", type: "location", target: "Coral Keep" }
        ]
      }
    },
    buildings: {
      "Farmland Estates": {
        travelPrompt: "Exit to",
        description: "Rolling fields stretch outside windows while workers tend waving crops.",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [],
        produces: { resources: ["grain"], commodities: [], luxuries: [] },
        consumes: { resources: ["seeds"], commodities: [], luxuries: [] }
      },
      "Cattle Yards": {
        travelPrompt: "Exit to",
        description: "Lowing herds shuffle between sturdy pens and feed troughs.",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [],
        produces: { resources: ["livestock"], commodities: ["meat"], luxuries: [] },
        consumes: { resources: ["feed"], commodities: [], luxuries: [] }
      },
      "The Creamery Hall": {
        travelPrompt: "Exit to",
        description: "Churns clatter rhythmically amid the sweet scent of fresh dairy.",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [],
        produces: { resources: [], commodities: ["cheese", "butter"], luxuries: [] },
        consumes: { resources: ["milk"], commodities: [], luxuries: [] }
      },
      "Leatherworkers' Guildhouse": {
        travelPrompt: "Exit to",
        description: "Tanned hides and finished saddles line walls in neat rows.",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [],
        produces: { resources: [], commodities: ["leather goods"], luxuries: [] },
        consumes: { resources: ["hides"], commodities: [], luxuries: [] }
      },
      "Shrine of the Harvestmother": {
        travelPrompt: "Exit to",
        description: "Painted reliefs celebrate bountiful harvests within the humble shrine.",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: []
      },
      "The Plowman's Rest Tavern": {
        travelPrompt: "Exit to",
        description: "Mud-spattered boots crowd around tables laden with hearty stew.",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "City Bakery": {
        travelPrompt: "Exit to",
        description: "Ovens radiate warmth while fresh loaves cool on wide shelves.",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["bread"], luxuries: [] },
        consumes: { resources: ["grain"], commodities: [], luxuries: [] }
      },
      "Central Granary": {
        travelPrompt: "Exit to",
        description: "Massive bins overflow with grain guarded by stoic stewards.",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: [], luxuries: [] },
        consumes: { resources: ["grain"], commodities: [], luxuries: [] }
      },
      "The Everrise Bridge": {
        travelPrompt: "Exit to",
        description: "Stone arches span the river, offering a sweeping view of both banks.",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: []
      },
      "Fishermen's Guild": {
        travelPrompt: "Exit to",
        description: "Nets and river charts cover the walls where captains share tales.",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: [],
        produces: { resources: ["fish"], commodities: [], luxuries: [] },
        consumes: { resources: ["nets", "boats"], commodities: [], luxuries: [] }
      },
      "Fishmongers' Market": {
        travelPrompt: "Exit to",
        description: "Stalls overflow with fresh catch, scales flashing in the light.",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: [],
        produces: { resources: [], commodities: ["processed fish"], luxuries: [] },
        consumes: { resources: ["fish"], commodities: [], luxuries: [] }
      },
      "Riverside Warehouses": {
        travelPrompt: "Exit to",
        description: "Crates stack high beneath rafters where merchants tally inventory.",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: [] },
        consumes: { resources: [], commodities: ["stored goods"], luxuries: [] }
      },
      "Shrine of the River-Mother": {
        travelPrompt: "Exit to",
        description: "Cool mist drifts around the waterside altar adorned with river shells.",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: []
      },
      "The Waterwheel Mill": {
        travelPrompt: "Exit to",
        description: "A great wheel groans, turning gears that grind grain to flour.",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: [],
        produces: { resources: [], commodities: ["flour"], luxuries: [] },
        consumes: { resources: ["grain"], commodities: [], luxuries: [] }
      },
      "The Oaken Net Tavern": {
        travelPrompt: "Exit to",
        description: "Rough-hewn tables sit beneath nets strung from the rafters.",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "The Grand Guildhall of Creekside": {
        travelPrompt: "Exit to",
        description: "Guild banners flutter above marble floors buzzing with negotiation.",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
      },
      "Military Barracks and Armory": {
        travelPrompt: "Exit to",
        description: "Racks of polished weapons flank disciplined rows of bunks.",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
      },
      "The Muster Yard": {
        travelPrompt: "Exit to",
        description: "Wide packed earth hosts squads drilling in crisp formation.",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
      },
      "Shrine of the Twin Watchers": {
        travelPrompt: "Exit to",
        description: "Twin statues gaze outward, their eyes set with vigilant gems.",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
      },
      "Stonecutters' Guild": {
        travelPrompt: "Exit to",
        description: "Blocks of stone and chiseled dust fill the workshop's open yard.",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [],
        produces: { resources: [], commodities: ["cut stone"], luxuries: [] },
        consumes: { resources: ["stone"], commodities: [], luxuries: [] }
      },
      "Glass Factory": {
        travelPrompt: "Exit to",
        description: "Kilns blaze while molten sheets slide along careful rollers.",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [],
        produces: { resources: [], commodities: ["glass"], luxuries: [] },
        consumes: { resources: ["sand", "fuel"], commodities: [], luxuries: [] }
      },
      "Glassblowers' Guild": {
        travelPrompt: "Exit to",
        description: "Finished vases and panes glimmer on displays under vaulted ceilings.",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [],
        produces: { resources: [], commodities: ["glassware"], luxuries: ["art glass"] },
        consumes: { resources: [], commodities: ["glass"], luxuries: [] }
      },
      "Butchers' Row": {
        travelPrompt: "Exit to",
        description: "Hooks laden with fresh cuts hang above sawdust-covered floors.",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [],
        produces: { resources: [], commodities: ["meat cuts"], luxuries: [] },
        consumes: { resources: ["livestock"], commodities: [], luxuries: [] }
      },
      "The Iron Kettle Tavern": {
        travelPrompt: "Exit to",
        description: "Heavy iron pots simmer stews that scent the loud common room.",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "The Traveler's Hearth Inn": {
        travelPrompt: "Exit to",
        description: "Maps and travel gear adorn walls welcoming road-weary guests.",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "Sugar Cane and Beet Fields": {
        travelPrompt: "Exit to",
        description: "Tall cane and beet rows sway under the watch of farmhands.",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: [],
        produces: { resources: ["sugar cane", "beets"], commodities: ["sugar"], luxuries: [] },
        consumes: { resources: ["seeds"], commodities: [], luxuries: [] }
      },
      "Fruit Orchards": {
        travelPrompt: "Exit to",
        description: "Trees heavy with fruit form shaded lanes buzzing with bees.",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: [],
        produces: { resources: ["fruit"], commodities: [], luxuries: [] },
        consumes: { resources: ["saplings"], commodities: [], luxuries: [] }
      },
      "Vineyards and Wineries": {
        travelPrompt: "Exit to",
        description: "Barrels line cool cellars where fermenting grapes perfume the air.",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: [],
        produces: { resources: [], commodities: ["wine"], luxuries: ["vintage wines"] },
        consumes: { resources: ["grapes"], commodities: [], luxuries: [] }
      },
      "Goat and Sheep Farms": {
        travelPrompt: "Exit to",
        description: "Bleating flocks wander past sheds stacked with fresh hay.",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: [],
        produces: { resources: ["wool", "milk"], commodities: ["cheese"], luxuries: [] },
        consumes: { resources: ["feed"], commodities: [], luxuries: [] }
      },
      "Outlying Watchtowers": {
        travelPrompt: "Exit to",
        description: "Lonely towers rise over fields, their beacon fires ready.",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: []
      },
      "Roadside Shrine of the Forest Father": {
        travelPrompt: "Exit to",
        description: "A weathered carving watches travelers offering simple twig charms.",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: []
      }
    }
  }
};

function defaultBusinessHours(cityName, buildingName) {
  const population = LOCATIONS[cityName]?.population?.estimate || 0;
  const name = buildingName.toLowerCase();
  if (/(inn|tavern)/.test(name)) {
    return population >= 15000
      ? { open: "00:00", close: "24:00" }
      : { open: "06:00", close: "24:00" };
  }
  if (/(temple|shrine|church|monastery)/.test(name)) {
    return { open: "06:00", close: "22:00" };
  }
  if (/(shop|market|exchange|wharf|pier|yard|bakery|granary)/.test(name)) {
    return { open: "06:00", close: "18:00" };
  }
  if (/(forge|workshop|lodge|shed|lab|sanctum|guild|hall|keep)/.test(name)) {
    return { open: "08:00", close: "20:00" };
  }
  return { open: "09:00", close: "17:00" };
}

function applyBusinessHours(nav) {
  Object.entries(nav).forEach(([cityName, city]) => {
    Object.entries(city.buildings).forEach(([buildingName, building]) => {
      if (!building.hours) {
        building.hours = defaultBusinessHours(cityName, buildingName);
      }
    });
  });
}

applyBusinessHours(CITY_NAV);
