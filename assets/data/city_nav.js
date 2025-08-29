export const CITY_NAV = {
  "Wave's Break": {
    districts: {
      "Port District": {
        travelPrompt: "Walk to",
        points: [
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
      }
    }
  }
};
