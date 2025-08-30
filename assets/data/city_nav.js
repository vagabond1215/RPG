export const CITY_NAV = {
  "Wave's Break": {
    districts: {
      "Port District": {
        travelPrompt: "Walk to",
        points: [
          { name: "Harbor Guard Naval Yard", type: "building", target: "Harbor Guard Naval Yard" },
          { name: "Nobles' Quay", type: "building", target: "Nobles' Quay" },
          { name: "Merchants' Wharf", type: "building", target: "Merchants' Wharf" },
          { name: "Fisherman's Pier", type: "building", target: "Fisherman's Pier" },
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
          { name: "The High Road District", type: "district", target: "The High Road District" }
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
        interactions: []
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
        interactions: []
      },
      "Nobles' Quay": {
        travelPrompt: "Exit to",
        exits: [
          { name: "Port District", target: "Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: []
      },
      "Merchants' Wharf": {
        travelPrompt: "Exit to",
        exits: [
          { name: "Port District", target: "Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: []
      },
      "Fisherman's Pier": {
        travelPrompt: "Exit to",
        exits: [
          { name: "Port District", target: "Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to" }
        ],
        interactions: []
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
          { name: "Pearl Commons Pier", type: "building", target: "Pearl Commons Pier" },
          { name: "Military Ward", type: "district", target: "Military Ward" }
        ]
      },
      "Military Ward": {
        travelPrompt: "Walk to",
        points: [
          { name: "South Docks & Steel Docks", type: "district", target: "South Docks & Steel Docks" }
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
        interactions: []
      },
      "Coral Court Quay": {
        travelPrompt: "Exit to",
        exits: [
          { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: []
      },
      "Glassmarket Wharf": {
        travelPrompt: "Exit to",
        exits: [
          { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: []
      },
      "Pearl Commons Pier": {
        travelPrompt: "Exit to",
        exits: [
          { name: "South Docks & Steel Docks", target: "South Docks & Steel Docks" },
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to" }
        ],
        interactions: []
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
          { name: "The Riverhouse", type: "building", target: "The Riverhouse" }
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
        interactions: []
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
          { name: "The Plowman's Rest Tavern", type: "building", target: "The Plowman's Rest Tavern" }
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
          { name: "Roadside Shrine of the Forest Father", type: "building", target: "Roadside Shrine of the Forest Father" }
        ]
      }
    },
    buildings: {
      "Farmland Estates": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: []
      },
      "Cattle Yards": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: []
      },
      "The Creamery Hall": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: []
      },
      "Leatherworkers' Guildhouse": {
        travelPrompt: "Exit to",
        exits: [ { name: "Greenford", target: "Greenford" } ],
        interactions: []
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
      "The Everrise Bridge": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: []
      },
      "Fishermen's Guild": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: []
      },
      "Fishmongers' Market": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: []
      },
      "Riverside Warehouses": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: []
      },
      "Shrine of the River-Mother": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: []
      },
      "The Waterwheel Mill": {
        travelPrompt: "Exit to",
        exits: [ { name: "Everrise Bridge", target: "Everrise Bridge" } ],
        interactions: []
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
        interactions: []
      },
      "Glass Factory": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
      },
      "Glassblowers' Guild": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
      },
      "Butchers' Row": {
        travelPrompt: "Exit to",
        exits: [ { name: "Stoneknot", target: "Stoneknot" } ],
        interactions: []
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
        interactions: []
      },
      "Fruit Orchards": {
        travelPrompt: "Exit to",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: []
      },
      "Vineyards and Wineries": {
        travelPrompt: "Exit to",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: []
      },
      "Goat and Sheep Farms": {
        travelPrompt: "Exit to",
        exits: [ { name: "Surrounding Farmlands & Orchards", target: "Surrounding Farmlands & Orchards" } ],
        interactions: []
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
