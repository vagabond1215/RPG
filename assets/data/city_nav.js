export const CITY_NAV = {
  "Wave's Break": {
    districts: {
      "Port District": {
        travelPrompt: "Walk to",
        points: [
          { name: "Tideway Inn", type: "building", target: "Tideway Inn" },
          { name: "Upper Ward", type: "district", target: "Upper Ward" }
        ]
      },
      "Upper Ward": {
        travelPrompt: "Walk to",
        points: [
          { name: "Governor's Keep", type: "building", target: "Governor's Keep" },
          { name: "Port District", type: "district", target: "Port District" }
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
      }
    }
  }
};
