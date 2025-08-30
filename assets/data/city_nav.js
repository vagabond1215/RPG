import { LOCATIONS } from "./locations.js";

export const CITY_NAV = {
  "Wave's Break": {
    districts: {
      "Port District": {
        travelPrompt: "Walk to",
        points: [
          { name: "Harbor Guard Naval Yard", type: "building", target: "Harbor Guard Naval Yard" },
          { name: "Nobles' Quay", type: "building", target: "Nobles' Quay" },
          { name: "Merchants' Wharf", type: "building", target: "Merchants' Wharf" },
          { name: "Fisherman's Pier", type: "building", target: "Fisherman's Pier", icon: "assets/images/icons/pier.svg" },
          { name: "Tideway Inn", type: "building", target: "Tideway Inn" },
          { name: "Upper Ward", type: "district", target: "Upper Ward" },
          { name: "Little Terns", type: "district", target: "Little Terns" }
        ]
      },
      "Upper Ward": {
        travelPrompt: "Walk to",
        points: [
          { name: "Governor's Keep", type: "building", target: "Governor's Keep" },
          { name: "Crafting Quarter", type: "building", target: "Crafting Quarter" },
          { name: "Mercantile Exchange", type: "building", target: "Mercantile Exchange" },
          { name: "Temple of the Tides", type: "building", target: "Temple of the Tides" },
          { name: "Hall of Records", type: "building", target: "Hall of Records" },
          { name: "Port District", type: "district", target: "Port District" },
          { name: "Greensoul Hill", type: "district", target: "Greensoul Hill" }
        ]
      },
      "Little Terns": {
        travelPrompt: "Walk to",
        points: [
          { name: "Glassblowing Trainer's Workshop", type: "building", target: "Glassblowing Trainer's Workshop" },
          { name: "Smithing Trainer's Forge", type: "building", target: "Smithing Trainer's Forge", icon: "assets/images/icons/blacksmith.svg" },
          { name: "Carpentry Trainer's Lodge", type: "building", target: "Carpentry Trainer's Lodge" },
          { name: "Tailoring Trainer's Shop", type: "building", target: "Tailoring Trainer's Shop" },
          { name: "Leatherworking Trainer's Shed", type: "building", target: "Leatherworking Trainer's Shed" },
          { name: "Alchemy Trainer's Lab", type: "building", target: "Alchemy Trainer's Lab" },
          { name: "Enchanting Trainer's Sanctum", type: "building", target: "Enchanting Trainer's Sanctum" },
          { name: "Port District", type: "district", target: "Port District" },
          { name: "Greensoul Hill", type: "district", target: "Greensoul Hill" }
        ]
      },
      "Greensoul Hill": {
        travelPrompt: "Walk to",
        points: [
          { name: "Upper Ward", type: "district", target: "Upper Ward" },
          { name: "Little Terns", type: "district", target: "Little Terns" },
          { name: "The Lower Gardens", type: "district", target: "The Lower Gardens" }
        ]
      },
      "The Lower Gardens": {
        travelPrompt: "Walk to",
        points: [
          { name: "City Bakery", type: "building", target: "City Bakery" },
          { name: "Central Granary", type: "building", target: "Central Granary" },
          { name: "Greensoul Hill", type: "district", target: "Greensoul Hill" },
          { name: "The High Road District", type: "district", target: "The High Road District" }
        ]
      },
      "The High Road District": {
        travelPrompt: "Walk to",
        points: [
          { name: "The Lower Gardens", type: "district", target: "The Lower Gardens" },
          { name: "The Farmlands Beyond the Walls", type: "district", target: "The Farmlands Beyond the Walls" }
        ]
      },
      "The Farmlands Beyond the Walls": {
        travelPrompt: "Walk to",
        points: [
          { name: "The High Road District", type: "district", target: "The High Road District" },
          { name: "East Road to Mountain Top", type: "location", target: "Mountain Top" }
        ]
      }
    },
    buildings: {
      "Tideway Inn": {
        travelPrompt: "Exit to",
        exits: [ { name: "Port District", target: "Port District" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "Governor's Keep": {
        travelPrompt: "Exit to",
        exits: [ { name: "Upper Ward", target: "Upper Ward" } ],
        interactions: []
      },
      "Crafting Quarter": {
        travelPrompt: "Exit to",
        exits: [ { name: "Upper Ward", target: "Upper Ward" } ],
        interactions: []
      },
      "Mercantile Exchange": {
        travelPrompt: "Exit to",
        exits: [ { name: "Upper Ward", target: "Upper Ward" } ],
        interactions: [],
        produces: { resources: [], commodities: ["trade contracts"], luxuries: [] },
        consumes: { resources: [], commodities: ["market goods"], luxuries: ["rare items"] }
      },
      "Temple of the Tides": {
        travelPrompt: "Exit to",
        exits: [ { name: "Upper Ward", target: "Upper Ward" } ],
        interactions: []
      },
      "Hall of Records": {
        travelPrompt: "Exit to",
        exits: [ { name: "Upper Ward", target: "Upper Ward" } ],
        interactions: []
      },
      "Harbor Guard Naval Yard": {
        travelPrompt: "Exit to",
        exits: [
          { name: "Port District", target: "Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: ["ships"], luxuries: [] },
        consumes: { resources: ["timber", "iron"], commodities: [], luxuries: [] }
      },
      "Nobles' Quay": {
        travelPrompt: "Exit to",
        exits: [
          { name: "Port District", target: "Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: ["imported finery"] },
        consumes: { resources: [], commodities: [], luxuries: ["luxury goods"] }
      },
      "Merchants' Wharf": {
        travelPrompt: "Exit to",
        exits: [
          { name: "Port District", target: "Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: ["trade shipments"], luxuries: [] },
        consumes: { resources: [], commodities: ["imports"], luxuries: [] }
      },
      "Glassblowing Trainer's Workshop": {
        travelPrompt: "Exit to",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Glassblowing (Master)", action: "train-glassblowing", tier: "master" } ],
        produces: { resources: [], commodities: ["glassware"], luxuries: ["art glass"] },
        consumes: { resources: ["sand", "fuel"], commodities: [], luxuries: [] }
      },
      "Smithing Trainer's Forge": {
        travelPrompt: "Exit to",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Blacksmithing (Journeyman)", action: "train-blacksmithing", tier: "journeyman" } ],
        produces: { resources: [], commodities: ["metal goods"], luxuries: [] },
        consumes: { resources: ["ore", "coal"], commodities: [], luxuries: [] }
      },
      "Carpentry Trainer's Lodge": {
        travelPrompt: "Exit to",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Carpentry (Journeyman)", action: "train-carpentry", tier: "journeyman" } ],
        produces: { resources: [], commodities: ["woodcraft"], luxuries: [] },
        consumes: { resources: ["timber"], commodities: [], luxuries: [] }
      },
      "Tailoring Trainer's Shop": {
        travelPrompt: "Exit to",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Tailoring (Apprentice)", action: "train-tailoring", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["garments"], luxuries: [] },
        consumes: { resources: [], commodities: ["cloth"], luxuries: [] }
      },
      "Leatherworking Trainer's Shed": {
        travelPrompt: "Exit to",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Leatherworking (Apprentice)", action: "train-leatherworking", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["leather goods"], luxuries: [] },
        consumes: { resources: ["hides"], commodities: [], luxuries: [] }
      },
      "Alchemy Trainer's Lab": {
        travelPrompt: "Exit to",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Alchemy (Journeyman)", action: "train-alchemy", tier: "journeyman" } ],
        produces: { resources: [], commodities: ["potions"], luxuries: ["elixirs"] },
        consumes: { resources: ["herbs", "reagents"], commodities: [], luxuries: [] }
      },
      "Enchanting Trainer's Sanctum": {
        travelPrompt: "Exit to",
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Enchanting (Initiate)", action: "train-enchanting", tier: "initiate" } ],
        produces: { resources: [], commodities: [], luxuries: ["enchanted items"] },
        consumes: { resources: ["mana crystals"], commodities: [], luxuries: [] }
      },
      "Fisherman's Pier": {
        travelPrompt: "Exit to",
        exits: [
          { name: "Port District", target: "Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: ["fish"], commodities: [], luxuries: [] },
        consumes: { resources: ["nets", "boats"], commodities: [], luxuries: [] }
      },
      "City Bakery": {
        travelPrompt: "Exit to",
        exits: [ { name: "The Lower Gardens", target: "The Lower Gardens" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["bread"], luxuries: [] },
        consumes: { resources: ["grain"], commodities: [], luxuries: [] }
      },
      "Central Granary": {
        travelPrompt: "Exit to",
        exits: [ { name: "The Lower Gardens", target: "The Lower Gardens" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: [], luxuries: [] },
        consumes: { resources: ["grain"], commodities: [], luxuries: [] }
      }
    }
  },
  "Coral Keep": {
    districts: {
      "South Docks & Steel Docks": {
        travelPrompt: "Walk to",
        points: [
          { name: "Steel Watch Naval Docks", type: "building", target: "Steel Watch Naval Docks" },
          { name: "Coral Court Quay", type: "building", target: "Coral Court Quay" },
          { name: "Glassmarket Wharf", type: "building", target: "Glassmarket Wharf" },
          { name: "Glassblowing Trainer's Workshop", type: "building", target: "Glassblowing Trainer's Workshop" },
          { name: "Pearl Commons Pier", type: "building", target: "Pearl Commons Pier" },
          { name: "Pearl Diving Trainer's Dock", type: "building", target: "Pearl Diving Trainer's Dock" },
          { name: "Smithing Trainer's Forge", type: "building", target: "Smithing Trainer's Forge" },
          { name: "Carpentry Trainer's Lodge", type: "building", target: "Carpentry Trainer's Lodge" },
          { name: "Tailoring Trainer's Shop", type: "building", target: "Tailoring Trainer's Shop" },
          { name: "Leatherworking Trainer's Shed", type: "building", target: "Leatherworking Trainer's Shed" },
          { name: "Alchemy Trainer's Lab", type: "building", target: "Alchemy Trainer's Lab" },
          { name: "Enchanting Trainer's Sanctum", type: "building", target: "Enchanting Trainer's Sanctum" },
          { name: "Military Ward", type: "district", target: "Military Ward" }
        ]
      },
      "Military Ward": {
        travelPrompt: "Walk to",
        points: [
          { name: "South Docks & Steel Docks", type: "district", target: "South Docks & Steel Docks" },
          { name: "Greywind's Edge", type: "district", target: "Greywind's Edge" }
        ]
      },
      "Greywind's Edge": {
        travelPrompt: "Walk to",
        points: [
          { name: "Military Ward", type: "district", target: "Military Ward" },
          { name: "West Road to Timber Grove", type: "location", target: "Timber Grove" }
        ]
      }
    },
    buildings: {
      "Steel Watch Naval Docks": {
        travelPrompt: "Exit to",
        exits: [
          { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: ["ships"], luxuries: [] },
        consumes: { resources: ["timber", "iron"], commodities: [], luxuries: [] }
      },
      "Coral Court Quay": {
        travelPrompt: "Exit to",
        exits: [
          { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: ["coral goods"] },
        consumes: { resources: [], commodities: [], luxuries: ["luxury trade"] }
      },
      "Glassmarket Wharf": {
        travelPrompt: "Exit to",
        exits: [
          { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: ["glass trade"], luxuries: [] },
        consumes: { resources: [], commodities: ["glassware"], luxuries: [] }
      },
      "Pearl Commons Pier": {
        travelPrompt: "Exit to",
        exits: [
          { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: ["pearls"] },
        consumes: { resources: ["diving gear"], commodities: [], luxuries: [] }
      },
      "Glassblowing Trainer's Workshop": {
        travelPrompt: "Exit to",
        exits: [ { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Glassblowing (Apprentice)", action: "train-glassblowing", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["glassware"], luxuries: ["art glass"] },
        consumes: { resources: ["sand", "fuel"], commodities: [], luxuries: [] }
      },
      "Pearl Diving Trainer's Dock": {
        travelPrompt: "Exit to",
        exits: [ { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Pearl Diving (Journeyman)", action: "train-pearl-diving", tier: "journeyman" } ],
        produces: { resources: [], commodities: [], luxuries: ["pearls"] },
        consumes: { resources: ["diving gear"], commodities: [], luxuries: [] }
      },
      "Smithing Trainer's Forge": {
        travelPrompt: "Exit to",
        exits: [ { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Blacksmithing (Apprentice)", action: "train-blacksmithing", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["metal goods"], luxuries: [] },
        consumes: { resources: ["ore", "coal"], commodities: [], luxuries: [] }
      },
      "Carpentry Trainer's Lodge": {
        travelPrompt: "Exit to",
        exits: [ { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Carpentry (Apprentice)", action: "train-carpentry", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["woodcraft"], luxuries: [] },
        consumes: { resources: ["timber"], commodities: [], luxuries: [] }
      },
      "Tailoring Trainer's Shop": {
        travelPrompt: "Exit to",
        exits: [ { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Tailoring (Apprentice)", action: "train-tailoring", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["garments"], luxuries: [] },
        consumes: { resources: [], commodities: ["cloth"], luxuries: [] }
      },
      "Leatherworking Trainer's Shed": {
        travelPrompt: "Exit to",
        exits: [ { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Leatherworking (Initiate)", action: "train-leatherworking", tier: "initiate" } ],
        produces: { resources: [], commodities: ["leather goods"], luxuries: [] },
        consumes: { resources: ["hides"], commodities: [], luxuries: [] }
      },
      "Alchemy Trainer's Lab": {
        travelPrompt: "Exit to",
        exits: [ { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" } ],
        interactions: [ { name: "Train Alchemy (Apprentice)", action: "train-alchemy", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["potions"], luxuries: ["elixirs"] },
        consumes: { resources: ["herbs", "reagents"], commodities: [], luxuries: [] }
      },
      "Enchanting Trainer's Sanctum": {
        travelPrompt: "Exit to",
        exits: [ { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" } ],
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
        exits: [ { name: "Central Plaza", target: "Central Plaza" } ],
        interactions: []
      },
      "The Timberhall": {
        travelPrompt: "Exit to",
        exits: [ { name: "Central Plaza", target: "Central Plaza" } ],
        interactions: []
      },
      "Forest Rest Inn": {
        travelPrompt: "Exit to",
        exits: [ { name: "Central Plaza", target: "Central Plaza" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "The Riverhouse": {
        travelPrompt: "Exit to",
        exits: [ { name: "Central Plaza", target: "Central Plaza" } ],
        interactions: []
      },
      "Wayside Shrine of the River-Mother": {
        travelPrompt: "Exit to",
        exits: [ { name: "Fishing Bridges", target: "Fishing Bridges" } ],
        interactions: []
      },
      "Logger's Flask Tavern": {
        travelPrompt: "Exit to",
        exits: [ { name: "The Lumberworks", target: "The Lumberworks" } ],
        interactions: []
      },
      "Crystalsong Lodge": {
        travelPrompt: "Exit to",
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
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [],
        produces: { resources: ["grain"], commodities: [], luxuries: [] },
        consumes: { resources: ["seeds"], commodities: [], luxuries: [] }
      },
      "Cattle Yards": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [],
        produces: { resources: ["livestock"], commodities: ["meat"], luxuries: [] },
        consumes: { resources: ["feed"], commodities: [], luxuries: [] }
      },
      "The Creamery Hall": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [],
        produces: { resources: [], commodities: ["cheese", "butter"], luxuries: [] },
        consumes: { resources: ["milk"], commodities: [], luxuries: [] }
      },
      "Leatherworkers' Guildhouse": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [],
        produces: { resources: [], commodities: ["leather goods"], luxuries: [] },
        consumes: { resources: ["hides"], commodities: [], luxuries: [] }
      },
      "Shrine of the Harvestmother": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: []
      },
      "The Plowman's Rest Tavern": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "City Bakery": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["bread"], luxuries: [] },
        consumes: { resources: ["grain"], commodities: [], luxuries: [] }
      },
      "Central Granary": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: [], luxuries: [] },
        consumes: { resources: ["grain"], commodities: [], luxuries: [] }
      },
      "The Everrise Bridge": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: []
      },
      "Fishermen's Guild": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: [],
        produces: { resources: ["fish"], commodities: [], luxuries: [] },
        consumes: { resources: ["nets", "boats"], commodities: [], luxuries: [] }
      },
      "Fishmongers' Market": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: [],
        produces: { resources: [], commodities: ["processed fish"], luxuries: [] },
        consumes: { resources: ["fish"], commodities: [], luxuries: [] }
      },
      "Riverside Warehouses": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: [] },
        consumes: { resources: [], commodities: ["stored goods"], luxuries: [] }
      },
      "Shrine of the River-Mother": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: []
      },
      "The Waterwheel Mill": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: [],
        produces: { resources: [], commodities: ["flour"], luxuries: [] },
        consumes: { resources: ["grain"], commodities: [], luxuries: [] }
      },
      "The Oaken Net Tavern": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "The Grand Guildhall of Creekside": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
      },
      "Military Barracks and Armory": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
      },
      "The Muster Yard": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
      },
      "Shrine of the Twin Watchers": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
      },
      "Stonecutters' Guild": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [],
        produces: { resources: [], commodities: ["cut stone"], luxuries: [] },
        consumes: { resources: ["stone"], commodities: [], luxuries: [] }
      },
      "Glass Factory": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [],
        produces: { resources: [], commodities: ["glass"], luxuries: [] },
        consumes: { resources: ["sand", "fuel"], commodities: [], luxuries: [] }
      },
      "Glassblowers' Guild": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [],
        produces: { resources: [], commodities: ["glassware"], luxuries: ["art glass"] },
        consumes: { resources: [], commodities: ["glass"], luxuries: [] }
      },
      "Butchers' Row": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [],
        produces: { resources: [], commodities: ["meat cuts"], luxuries: [] },
        consumes: { resources: ["livestock"], commodities: [], luxuries: [] }
      },
      "The Iron Kettle Tavern": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "The Traveler's Hearth Inn": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "Sugar Cane and Beet Fields": {
        travelPrompt: "Exit to",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: [],
        produces: { resources: ["sugar cane", "beets"], commodities: ["sugar"], luxuries: [] },
        consumes: { resources: ["seeds"], commodities: [], luxuries: [] }
      },
      "Fruit Orchards": {
        travelPrompt: "Exit to",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: [],
        produces: { resources: ["fruit"], commodities: [], luxuries: [] },
        consumes: { resources: ["saplings"], commodities: [], luxuries: [] }
      },
      "Vineyards and Wineries": {
        travelPrompt: "Exit to",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: [],
        produces: { resources: [], commodities: ["wine"], luxuries: ["vintage wines"] },
        consumes: { resources: ["grapes"], commodities: [], luxuries: [] }
      },
      "Goat and Sheep Farms": {
        travelPrompt: "Exit to",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: [],
        produces: { resources: ["wool", "milk"], commodities: ["cheese"], luxuries: [] },
        consumes: { resources: ["feed"], commodities: [], luxuries: [] }
      },
      "Outlying Watchtowers": {
        travelPrompt: "Exit to",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: []
      },
      "Roadside Shrine of the Forest Father": {
        travelPrompt: "Exit to",
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
