import { LOCATIONS } from "./locations.js";

export const CITY_NAV = {
  "Wave's Break": {
    districts: {
      "The Port District": {
        travelPrompt: "Walk to",
        descriptions: {
          "The Upper Ward": "You descend from the regal calm of the Upper Ward, where marble balustrades and watchful guards keep the world in line. Ahead, the Port District erupts in salty spray and shouting dockhands, its tangle of masts and warehouses swallowing you in sea-soaked hustle.",
          "Little Terns": "The clang of hammers and scent of sawdust from Little Terns fade as you follow the cobbles downhill. The air grows briny and gulls wheel overhead while the Port District's boardwalks and shipyards spread out before you in a chaos of ropes and sails."
        },
        points: [
          {
            name: "Harborwatch Trading House",
            type: "building",
            target: "Harborwatch Trading House",
            icon: "assets/images/icons/waves_break/Harborwatch Trading House.png",
          },
          {
            name: "Warehouse Row",
            type: "building",
            target: "Warehouse Row",
            icon: "assets/images/icons/waves_break/Warehouse Row.png",
          },
          {
            name: "Stormkeel Shipwrights",
            type: "building",
            target: "Stormkeel Shipwrights",
            icon: "assets/images/icons/waves_break/Stormkeel Shipwrights.png",
          },
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
          {
            name: "The Ropewalk",
            type: "building",
            target: "The Ropewalk",
            icon: "assets/images/icons/waves_break/The Ropewalk.png",
          },
          {
            name: "Brinebarrel Coopers",
            type: "building",
            target: "Brinebarrel Coopers",
            icon: "assets/images/icons/waves_break/Brinebarrel Coopers.png",
          },
          {
            name: "Saltworks",
            type: "building",
            target: "Saltworks",
            icon: "assets/images/icons/waves_break/The Saltworks.png",
          },
          {
            name: "Fishmongers' Row",
            type: "building",
            target: "Fishmongers' Row",
            icon: "assets/images/icons/waves_break/Fishmonger's Row.png",
          },
          {
            name: "Shrine of the Deep Current",
            type: "building",
            target: "Shrine of the Deep Current",
            icon: "assets/images/icons/waves_break/Shrine of the Deep Current.png",
          },
          {
            name: "Statue of the Sea-Mother",
            type: "building",
            target: "Statue of the Sea-Mother",
            icon: "assets/images/icons/waves_break/Statue of the Sea-Mother.png",
          },
          {
            name: "The Salty Gull",
            type: "building",
            target: "The Salty Gull",
            icon: "assets/images/icons/waves_break/The Salty Gull.png",
          },
          { name: "The Tideway Inn", type: "building", target: "The Tideway Inn", icon: "assets/images/icons/waves_break/The Tideway Inn.png" },
          { name: "The Upper Ward", type: "district", target: "The Upper Ward", icon: "assets/images/icons/waves_break/Upper Ward District.png" },
          { name: "Little Terns", type: "district", target: "Little Terns", icon: "assets/images/icons/waves_break/Little Terns District.png" }
          ]
        },
        "The Upper Ward": {
          travelPrompt: "Walk to",
          descriptions: {
            "The Port District": "You leave behind the smell of tar and fish in the Port District as you climb the stair to the hills. The noise of gulls fades and the polished stone avenues of the Upper Ward stretch before you, lined with stately halls and well-armed guards.",
            "Greensoul Hill": "Leaving the incense-laden cloisters of Greensoul Hill, you descend toward the city's heart. The spiritual hush gives way to the ordered bustle of the Upper Ward, where merchants bow to magistrates beneath banners snapping in the breeze.",
            "The High Road District": "Dusty caravan squares and hammering armorers of the High Road District recede as you pass beneath a stone arch. The Upper Ward opens in stately terraces, home to nobles and archivists who watch the city from their high balconies."
          },
          points: [
            { name: "Governor's Keep", type: "building", target: "Governor's Keep", icon: "assets/images/icons/waves_break/Governor's Keep.png" },
            { name: "Crafting Quarter", type: "building", target: "Crafting Quarter", icon: "assets/images/icons/waves_break/Crafting Quarter.png" },
            { name: "Mercantile Exchange", type: "building", target: "Mercantile Exchange", icon: "assets/images/icons/waves_break/Mercantile Exchange.png" },
            { name: "Temple of the Tides", type: "building", target: "Temple of the Tides", icon: "assets/images/icons/waves_break/Temple of the Tides.png" },
            { name: "Hall of Records", type: "building", target: "Hall of Records", icon: "assets/images/icons/waves_break/Hall of Records.png" },
            { name: "The Port District", type: "district", target: "The Port District", icon: "assets/images/icons/waves_break/Port District.png" },
            { name: "Greensoul Hill", type: "district", target: "Greensoul Hill", icon: "assets/images/icons/waves_break/Greensoul Hill District.png" },
            { name: "The High Road District", type: "district", target: "The High Road District", icon: "assets/images/icons/waves_break/The High Road District.png" }
          ]
        },
        "Little Terns": {
          travelPrompt: "Walk to",
          descriptions: {
            "The Port District": "You leave the salty spray and crowded piers of the Port District, trudging up a cobbled rise. Under a wrought-iron arch proclaiming Little Terns, the scent shifts to sawdust and dye as workshops and guild halls cluster along the street.",
            "The Lower Gardens": "Leaving the perfumed alleys and orchard walks of the Lower Gardens, you cross a narrow bridge. Little Terns rises ahead in a patchwork of smoke-streaked chimneys and stacked timber, its people bent over workbenches instead of flower beds.",
            "The High Road District": "The rumble of caravans and the call of teamsters from the High Road District fade behind you. Little Terns narrows into lanes lined with forges and looms, the air warm with metal and dye as artisans labor over wares."
          },
          points: [
            { name: "Crystal Tide Glassworks", type: "building", target: "Crystal Tide Glassworks", icon: "assets/images/icons/waves_break/Crystal Tide Glassworks.png" },
            { name: "Tidefire Forge", type: "building", target: "Tidefire Forge", icon: "assets/images/icons/waves_break/Tidefire Forge.png" },
            { name: "Timberwave Carpenters' Guild", type: "building", target: "Timberwave Carpenters' Guild", icon: "assets/images/icons/waves_break/Timberwave Carpenters' Guild.png" },
            { name: "The Gilded Needle Clothiers", type: "building", target: "The Gilded Needle Clothiers", icon: "assets/images/icons/waves_break/The Gilded Needle Clothiers.png" },
            { name: "Salted Hide Tannery", type: "building", target: "Salted Hide Tannery", icon: "assets/images/icons/waves_break/Salted Hide Tannery.png" },
            { name: "Tideglass Alchemical Atelier", type: "building", target: "Tideglass Alchemical Atelier", icon: "assets/images/icons/waves_break/Tideglass Alchemical Atelier.png" },
            { name: "Arc Runes Enchantery", type: "building", target: "Arc Runes Enchantery", icon: "assets/images/icons/waves_break/Arc Runes Enchantery.png" },
              { name: "The Port District", type: "district", target: "The Port District", icon: "assets/images/icons/waves_break/Port District.png" },
              { name: "The Lower Gardens", type: "district", target: "The Lower Gardens", icon: "assets/images/icons/waves_break/Lower Gardens District.png" },
              { name: "The High Road District", type: "district", target: "The High Road District", icon: "assets/images/icons/waves_break/The High Road District.png" }
          ]
        },
        "Greensoul Hill": {
          travelPrompt: "Walk to",
          descriptions: {
            "The Upper Ward": "You depart the orderly boulevards of the Upper Ward, following a path lined with cypress. Greensoul Hill rises serene and green ahead, its cloisters and libraries inviting quiet reflection above the city's din."
          },
          points: [
              { name: "Greensoul Monastery", type: "building", target: "Greensoul Monastery", icon: "assets/images/icons/waves_break/Greensoul Monastery.png" },
              { name: "Royal Botanical Gardens", type: "building", target: "Royal Botanical Gardens", icon: "assets/images/icons/waves_break/Royal Botanical Gardens.png" },
              { name: "Skyline Academy", type: "building", target: "Skyline Academy", icon: "assets/images/icons/waves_break/Skyline Academy.png" },
              { name: "Greensoul Amphitheater", type: "building", target: "Greensoul Amphitheater", icon: "assets/images/icons/waves_break/Greensoul Amphitheater.png" },
            { name: "The Upper Ward", type: "district", target: "The Upper Ward", icon: "assets/images/icons/waves_break/Upper Ward District.png" }
          ]
        },
        "The Lower Gardens": {
          travelPrompt: "Walk to",
          descriptions: {
            "Little Terns": "The clang of hammers in Little Terns softens as you follow a brook-swept path. Soon, the Lower Gardens surround you with verdant plots and the heady smell of fermenting hops and freshly plucked petals."
          },
          points: [
            { name: "Harbor Hearth Bakery", type: "building", target: "Harbor Hearth Bakery", icon: "assets/images/icons/waves_break/Harbor Hearth Bakery.png" },
            { name: "Tidehold Granary & Provisioners", type: "building", target: "Tidehold Granary & Provisioners", icon: "assets/images/icons/waves_break/Tidehold Granary and Provisioners.png" },
              { name: "Bloomstage Theater", type: "building", target: "Bloomstage Theater", icon: "assets/images/icons/waves_break/Blooomstage Theater.png" },
              { name: "The Velvet Petal Brothel", type: "building", target: "The Velvet Petal Brothel", icon: "assets/images/icons/waves_break/The Velvet Petal Brothel.png" },
              { name: "Little Terns", type: "district", target: "Little Terns", icon: "assets/images/icons/waves_break/Little Terns District.png" }
          ]
        },
        "The High Road District": {
          travelPrompt: "Walk to",
          descriptions: {
            "The Upper Ward": "Leaving the Upper Ward's polished serenity, you descend toward grittier streets. The High Road District greets you with clangs of armor, horses stamping near the gates, and traders hawking goods to passing caravans.",
            "Little Terns": "The smoke from Little Terns' forges trails behind as you take a broader thoroughfare. Soon the High Road District envelops you in wagon ruts and the smell of oiled leather, its inns bustling with travelers.",
            "The Farmlands": "Returning from the wide Farmlands, you approach the sturdy city walls and slip through the gate. The High Road District stands ready with its caravan yards and bustling market, the hum of urban life replacing the whisper of grain."
          },
          points: [
            { name: "The Sunleaf Inn", type: "building", target: "The Sunleaf Inn", icon: "assets/images/icons/waves_break/The Sunleaf Inn.png" },
            { name: "Stonebridge Caravanserai", type: "building", target: "Stonebridge Caravanserai", icon: "assets/images/icons/waves_break/Stonebridge Caravanserai.png" },
            { name: "Adventurers' Guildhall", type: "building", target: "Adventurers' Guildhall", icon: "assets/images/icons/waves_break/Adventurer's Guild.png" },
            { name: "Iron Key Smithy", type: "building", target: "Iron Key Smithy", icon: "assets/images/icons/waves_break/Iron Key Smithy.png" },
            { name: "Rolling Wave Coachworks", type: "building", target: "Rolling Wave Coachworks", icon: "assets/images/icons/waves_break/Rolling Wave Coachworks.png" },
            { name: "Wavehide Leather Guild", type: "building", target: "Wavehide Leather Guild", icon: "assets/images/icons/waves_break/Wavehide Leather Guild.png" },
            { name: "Shield & Sail Armsmiths", type: "building", target: "Shield & Sail Armsmiths", icon: "assets/images/icons/waves_break/Shield and Sail Armsmiths.png" },
            { name: "Shrine of the Roadwarden", type: "building", target: "Shrine of the Roadwarden", icon: "assets/images/icons/waves_break/Shrine of the Roadwarden.png" },
            { name: "Caravan Square", type: "building", target: "Caravan Square", icon: "assets/images/icons/waves_break/Caravan Square.png" },
            { name: "Gatewatch Barracks", type: "building", target: "Gatewatch Barracks", icon: "assets/images/icons/waves_break/Gatewatch Barracks.png" },
              { name: "North Gate", type: "location", target: "North Gate", icon: "assets/images/icons/waves_break/North Gate.png" },
              { name: "South Gate", type: "location", target: "South Gate", icon: "assets/images/icons/waves_break/South Gate.png" },
              { name: "Wayfarer's Rest Tavern", type: "building", target: "Wayfarer's Rest Tavern", icon: "assets/images/icons/waves_break/Wayfarer's Rest Tavern.png" },
            { name: "The Farmlands", type: "district", target: "The Farmlands", icon: "assets/images/icons/waves_break/Farmlands District.png" },
            { name: "Little Terns", type: "district", target: "Little Terns", icon: "assets/images/icons/waves_break/Little Terns District.png" },
            { name: "The Upper Ward", type: "district", target: "The Upper Ward", icon: "assets/images/icons/waves_break/Upper Ward District.png" }
          ]
        },
        "The Farmlands": {
          travelPrompt: "Walk to",
          descriptions: {
            "The High Road District": "You slip out of the High Road District's gatehouses, leaving behind the clatter of wheels and barked orders. Immediately the Farmlands envelop you in open sky, buzzing insects, and the rhythmic creak of distant watermills."
          },
          points: [
              { name: "Brackenshore Croft", type: "building", target: "Brackenshore Croft", icon: "assets/images/icons/waves_break/Brackenshore Croft.png" },
              { name: "Greenridge Polder", type: "building", target: "Greenridge Polder", icon: "assets/images/icons/waves_break/Greenridge Polder.png" },
              { name: "Harborwind Dairy", type: "building", target: "Harborwind Dairy", icon: "assets/images/icons/waves_break/Harborwind Dairy.png" },
              { name: "Saltmeadow Potato Farm", type: "building", target: "Saltmeadow Potato Farm", icon: "assets/images/icons/waves_break/Saltmeadow Potato Farm.png" },
              { name: "Foamfield Flax Farm", type: "building", target: "Foamfield Flax Farm", icon: "assets/images/icons/waves_break/Foamfield Flax Farm.png" },
              { name: "Mistflower Apiary", type: "building", target: "Mistflower Apiary", icon: "assets/images/icons/waves_break/Mistflower Apiary.png" },
              { name: "Cliffblossom Hives", type: "building", target: "Cliffblossom Hives", icon: "assets/images/icons/waves_break/Cliffblossom Hives.png" },
              { name: "Gulls' Orchard", type: "building", target: "Gulls' Orchard", icon: "assets/images/icons/waves_break/Gulls' Orchard.png" },
              { name: "Sunmellow Grove", type: "building", target: "Sunmellow Grove", icon: "assets/images/icons/waves_break/Sunmellow Grove.png" },
              { name: "Seawisp Plum Orchard", type: "building", target: "Seawisp Plum Orchard", icon: "assets/images/icons/waves_break/Seawisp Plum Orchard.png" },
              { name: "Driftfell Meadow", type: "building", target: "Driftfell Meadow", icon: "assets/images/icons/waves_break/Driftfell Meadow.png" },
              { name: "Moorlight Flats", type: "building", target: "Moorlight Flats", icon: "assets/images/icons/waves_break/Moorlight Flats.png" },
              { name: "Gullwind Mill", type: "building", target: "Gullwind Mill", icon: "assets/images/icons/waves_break/Gullwind Mill.png" },
              { name: "Tidewheel Watermill", type: "building", target: "Tidewheel Watermill", icon: "assets/images/icons/waves_break/Tidewheel Watermill.png" },
              { name: "Saltmarsh Granary", type: "building", target: "Saltmarsh Granary", icon: "assets/images/icons/waves_break/Saltmarsh Granary.png" },
              { name: "Copperbrook Forge", type: "building", target: "Copperbrook Forge", icon: "assets/images/icons/waves_break/Copperbrook Forge.png" },
              { name: "Tidewatcher Lighthouse", type: "building", target: "Tidewatcher Lighthouse", icon: "assets/images/icons/waves_break/Tidewatcher Lighthouse.png" },
              { name: "Netmaker's Co-op", type: "building", target: "Netmaker's Co-op", icon: "assets/images/icons/waves_break/Netmaker's Co-op.png" },
              { name: "Seabreeze Oat Farm", type: "building", target: "Seabreeze Oat Farm", icon: "assets/images/icons/waves_break/Seabreeze Oat Farm.png" },
              { name: "Saltcrest Vineyard & Winery", type: "building", target: "Saltcrest Vineyard & Winery", icon: "assets/images/icons/waves_break/Saltcrest Vineyard & Winery.png" },
              { name: "Windward Berry Vineyard & Winery", type: "building", target: "Windward Berry Vineyard & Winery", icon: "assets/images/icons/waves_break/Windward Berry Vineyard & Winery.png" },
              { name: "Tideflock Stockyards", type: "building", target: "Tideflock Stockyards", icon: "assets/images/icons/waves_break/Tideflock Stockyards.png" },
              { name: "Bayside Brickworks", type: "building", target: "Bayside Brickworks", icon: "assets/images/icons/waves_break/Bayside Brickworks.png" },
              { name: "Cliffbreak Quarry", type: "building", target: "Cliffbreak Quarry", icon: "assets/images/icons/waves_break/Cliffbreak Quarry.png" },
              { name: "Wavecut Stoneworks", type: "building", target: "Wavecut Stoneworks", icon: "assets/images/icons/waves_break/Wavecut Stoneworks.png" },
              { name: "Coast Road Watchtower", type: "building", target: "Coast Road Watchtower", icon: "assets/images/icons/waves_break/Coast Road Watchtower.png" },
              { name: "North Gate", type: "location", target: "North Gate", icon: "assets/images/icons/waves_break/North Gate.png" },
              { name: "South Gate", type: "location", target: "South Gate", icon: "assets/images/icons/waves_break/South Gate.png" },
              { name: "East Road to Mountain Top", type: "location", target: "Mountain Top", icon: "assets/images/icons/waves_break/The East Road to Mountain Top.png" }
          ]
        }
      },
    layout: {
      rows: 4,
      cols: 4,
      positions: {
        "The Port District": [1, 0],
        "Greensoul Hill": [0, 1],
        "The Upper Ward": [1, 1],
        "Little Terns": [2, 1],
        "The Lower Gardens": [3, 1],
        "The High Road District": [2, 2],
        "The Farmlands": [2, 3],
      },
      connections: [
        ["The Port District", "The Upper Ward"],
        ["The Port District", "Little Terns"],
        ["The Upper Ward", "The High Road District"],
        ["The Upper Ward", "Greensoul Hill"],
        ["Little Terns", "The High Road District"],
        ["Little Terns", "The Lower Gardens"],
        ["The High Road District", "The Farmlands"],
      ],
    },
    buildings: {
      "Harborwatch Trading House": {
        travelPrompt: "Exit to",
        description: `As you enter the Harborwatch Trading House, the din of haggling merchants crashes over you like a breaking wave.
Ledger-scribbling clerks dart between crates piled high, and the salt tang mingles with exotic spices.`,
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Warehouse Row": {
        travelPrompt: "Exit to",
        description: `Shouldering past a laden cart, you slip into Warehouse Row.
Rows of doors stretch like the ribs of a sleeping beast, each hiding cargo bound for distant ports.
Rats scurry between crates, wary of your tread.`,
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Stormkeel Shipwrights": {
        travelPrompt: "Exit to",
        description: `Duck under a half-sawn beam to enter Stormkeel Shipwrights.
Fresh-cut timbers perfume the air while mallets ring in steady rhythm.
Half-built hulls loom above like skeletons waiting for the tide.`,
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "The Ropewalk": {
        travelPrompt: "Exit to",
        description: `Walking the long hall of the Ropewalk, you feel the floor hum beneath workers twisting fibers.
Length after length of hemp stretches into the distance, smelling of tar and seawater.`,
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Brinebarrel Coopers": {
        travelPrompt: "Exit to",
        description: `As the door swings open at Brinebarrel Coopers, the scent of wet wood and salt hits your nose.
Coopers hammer iron hoops onto staves, their rhythmic blows echoing through rows of barrels.`,
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Saltworks": {
        travelPrompt: "Exit to",
        description: `Cracking open the gate to the Saltworks, you step into glare off shallow pans.
Evaporating seawater leaves glittering crusts while workers rake crystals into mounds.`,
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Fishmongers' Row": {
        travelPrompt: "Exit to",
        description: `Threading through the crowd, you arrive at Fishmongers' Row.
Slabs of fresh catch gleam on ice, and gulls shriek for scraps as vendors holler prices.`,
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Shrine of the Deep Current": {
        travelPrompt: "Exit to",
        description: `Kneeling at the Shrine of the Deep Current, you hear seawater bubbling within a stone basin.
The air carries a chill, as if the unseen tide itself waits for your offering.`,
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: []
      },
      "Statue of the Sea-Mother": {
        travelPrompt: "Exit to",
        description: `Approaching the Statue of the Sea-Mother, you brush barnacles from the stone plinth.
Her weathered gaze watches the harbor, and a calm settles over you like mist.`,
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: []
      },
      "The Salty Gull": {
        travelPrompt: "Exit to",
        description: `Pushing open the warped door of the Salty Gull, you are met with laughter and thick ale-fumes.
Sailors clap you on the back as sea shanties rise above the crackle of the hearth.`,
        exits: [ { name: "The Port District", target: "The Port District" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "The Tideway Inn": {
        travelPrompt: "Exit to",
        description: `Sliding out of the drizzle into the Tideway Inn, you find lantern light pooling on worn floorboards.
The murmur of tired sailors and the promise of a warm bed wrap around you like a blanket.`,
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
        description: `Marching past a row of polished spears, you enter the Harbor Guard Naval Yard.
Ship hulls rise on their stocks while disciplined marines drill between coils of rope and cannon.`,
        exits: [
          { name: "The Port District", target: "The Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to", icon: "assets/images/icons/waves_break/Sail to Coral Keep.png" }
        ],
        interactions: [],
        produces: { resources: [], commodities: ["ships"], luxuries: [] },
        consumes: { resources: ["timber", "iron"], commodities: [], luxuries: [] }
      },
      "Nobles' Quay": {
        travelPrompt: "Exit to",
        description: `Gliding down the marble steps onto Nobles' Quay, you catch reflections of gilded barges in the water.
Cloaked attendants whisper greetings as perfumed breezes mingle with salt spray.`,
        exits: [
          { name: "The Port District", target: "The Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to", icon: "assets/images/icons/waves_break/Sail to Coral Keep.png" }
        ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: ["imported finery"] },
        consumes: { resources: [], commodities: [], luxuries: ["luxury goods"] }
      },
      "Merchants' Wharf": {
        travelPrompt: "Exit to",
        description: `Weaving through shouting stevedores, you step onto Merchants' Wharf.
Crates teeter in precarious stacks and the air buzzes with deals sealed over the creak of mooring lines.`,
        exits: [
          { name: "The Port District", target: "The Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to", icon: "assets/images/icons/waves_break/Sail to Coral Keep.png" }
        ],
        interactions: [],
        produces: { resources: [], commodities: ["trade shipments"], luxuries: [] },
        consumes: { resources: [], commodities: ["imports"], luxuries: [] }
      },
      "Crystal Tide Glassworks": {
        travelPrompt: "Exit to",
        description: `Sliding through a heat-hazed doorway, you step into the Crystal Tide Glassworks.
Furnaces roar as molten glass winds along pipes in dazzling streams.
Heat prickles your skin while artisans spin glowing vessels to life.`,
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Glassblowing (Master)", action: "train-glassblowing", tier: "master" } ],
        produces: { resources: [], commodities: ["glassware"], luxuries: ["art glass"] },
        consumes: { resources: ["sand", "fuel"], commodities: [], luxuries: [] }
      },
      "Tidefire Forge": {
        travelPrompt: "Exit to",
        description: `Shouldering aside a curtain of chain, you enter Tidefire Forge.
Anvils ring amid showers of sparks and the smell of hot iron.
Sweat-streaked smiths shape blades that glow like captured suns.`,
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Blacksmithing (Journeyman)", action: "train-blacksmithing", tier: "journeyman" } ],
        produces: { resources: [], commodities: ["metal goods"], luxuries: [] },
        consumes: { resources: ["ore", "coal"], commodities: [], luxuries: [] }
      },
      "Timberwave Carpenters' Guild": {
        travelPrompt: "Exit to",
        description: `Pushing through the workshop doors, you arrive at the Timberwave Carpenters' Guild.
Stacks of timber tower overhead while saws sing through grain.
Sawdust drifts around you as carpenters chisel beams into form.`,
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Carpentry (Journeyman)", action: "train-carpentry", tier: "journeyman" } ],
        produces: { resources: [], commodities: ["woodcraft"], luxuries: [] },
        consumes: { resources: ["timber"], commodities: [], luxuries: [] }
      },
      "The Gilded Needle Clothiers": {
        travelPrompt: "Exit to",
        description: `Brushing past hanging tapestries, you slip into The Gilded Needle Clothiers.
Bolts of fabric bloom across tables under lamplight.
Seamstresses murmur measurements as needles flash and thread gleams.`,
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Tailoring (Apprentice)", action: "train-tailoring", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["garments"], luxuries: [] },
        consumes: { resources: [], commodities: ["cloth"], luxuries: [] }
      },
      "Salted Hide Tannery": {
        travelPrompt: "Exit to",
        description: `Covering your nose, you edge into the Salted Hide Tannery.
Racks of curing leather line damp walls, heavy with brine.
Workers scrape hides smooth, knives rasping in steady rhythm.`,
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Leatherworking (Apprentice)", action: "train-leatherworking", tier: "apprentice" } ],
        produces: { resources: [], commodities: ["leather goods"], luxuries: [] },
        consumes: { resources: ["hides"], commodities: [], luxuries: [] }
      },
      "Tideglass Alchemical Atelier": {
        travelPrompt: "Exit to",
        description: `Tapping on a stained oak door, you ease into the Tideglass Alchemical Atelier.
Glassware burbles and colored vapors curl above cluttered benches.
Alchemists mutter formulas while stirring shimmering concoctions.`,
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Alchemy (Journeyman)", action: "train-alchemy", tier: "journeyman" } ],
        produces: { resources: [], commodities: ["potions"], luxuries: ["elixirs"] },
        consumes: { resources: ["herbs", "reagents"], commodities: [], luxuries: [] }
      },
      "Arc Runes Enchantery": {
        travelPrompt: "Exit to",
        description: `Tracing a finger along carved sigils, you pass into Arc Runes Enchantery.
Crystals hum atop etched circles, bathing the room in pale light.
Enchanters chant softly as glyphs flare to life around you.`,
        exits: [ { name: "Little Terns", target: "Little Terns" } ],
        interactions: [ { name: "Train Enchanting (Initiate)", action: "train-enchanting", tier: "initiate" } ],
        produces: { resources: [], commodities: [], luxuries: ["enchanted items"] },
        consumes: { resources: ["mana crystals"], commodities: [], luxuries: [] }
      },
      "Greensoul Monastery": {
        travelPrompt: "Exit to",
        description: "Quiet cloisters overlook the city from this serene retreat.",
        exits: [ { name: "Greensoul Hill", target: "Greensoul Hill" } ],
        interactions: []
      },
      "Royal Botanical Gardens": {
        travelPrompt: "Exit to",
        description: "Manicured beds showcase rare flora tended for noble study.",
        exits: [ { name: "Greensoul Hill", target: "Greensoul Hill" } ],
        interactions: []
      },
      "Skyline Academy": {
        travelPrompt: "Exit to",
        description: "Scholars debate philosophy in sunlit lecture courts.",
        exits: [ { name: "Greensoul Hill", target: "Greensoul Hill" } ],
        interactions: []
      },
      "Greensoul Amphitheater": {
        travelPrompt: "Exit to",
        description: "Open-air performances entertain Wave's Break's elite.",
        exits: [ { name: "Greensoul Hill", target: "Greensoul Hill" } ],
        interactions: []
      },
      "Fisherman's Pier": {
        travelPrompt: "Exit to",
        description: `With a careful stride you tread onto Fisherman's Pier.
Nets hang drying from every post, and the slap of waves mixes with the clatter of baskets brimming with today's catch.`,
        exits: [
          { name: "The Port District", target: "The Port District" },
          { name: "Coral Keep", target: "Coral Keep", type: "location", prompt: "Sail to", icon: "assets/images/icons/waves_break/Sail to Coral Keep.png" }
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
      },
      "Bloomstage Theater": {
        travelPrompt: "Exit to",
        description: "A simple stage hosts lively performances for common folk.",
        exits: [ { name: "The Lower Gardens", target: "The Lower Gardens" } ],
        interactions: []
      },
      "The Velvet Petal Brothel": {
        travelPrompt: "Exit to",
        description: "Lantern-lit rooms offer discreet companionship and drink.",
        exits: [ { name: "The Lower Gardens", target: "The Lower Gardens" } ],
        interactions: []
      },
      "Brackenshore Croft": {
        travelPrompt: "Exit to",
        description: "Terraced grain fields carved into the tidal bluff.",
        exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["grain"], luxuries: [] },
        consumes: { resources: [], commodities: [], luxuries: [] }
      },
      "Greenridge Polder": {
        travelPrompt: "Exit to",
        description: "Marsh-drained vegetable fields held by sturdy dikes.",
        exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["vegetables"], luxuries: [] },
        consumes: { resources: [], commodities: [], luxuries: [] }
      },
        "Harborwind Dairy": {
          travelPrompt: "Exit to",
          description: "Coastal pastures yield sea-salt-sweetened milk.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ],
          produces: { resources: [], commodities: ["dairy"], luxuries: [] },
          consumes: { resources: [], commodities: [], luxuries: [] }
        },
        "Saltmeadow Potato Farm": {
          travelPrompt: "Exit to",
          description: "Salt-kissed plots yield hearty potatoes.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ],
          produces: { resources: [], commodities: ["potatoes"], luxuries: [] },
          consumes: { resources: [], commodities: [], luxuries: [] }
        },
        "Foamfield Flax Farm": {
          travelPrompt: "Exit to",
          description: "Wind-swept rows of flax ripple toward the shore.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ],
          produces: { resources: ["flax"], commodities: [], luxuries: [] },
          consumes: { resources: [], commodities: [], luxuries: [] }
        },
        "Mistflower Apiary": {
          travelPrompt: "Exit to",
          description: "Hives nestled among herb gardens heavy with morning fog.",
        exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["honey"], luxuries: [] },
        consumes: { resources: [], commodities: [], luxuries: [] }
      },
      "Cliffblossom Hives": {
        travelPrompt: "Exit to",
        description: "Bee boxes cling to sea cliffs blooming with rare flowers.",
        exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["honey"], luxuries: [] },
        consumes: { resources: [], commodities: [], luxuries: [] }
      },
      "Gulls' Orchard": {
        travelPrompt: "Exit to",
        description: "Creekside rows of apples and pears beneath circling seabirds.",
        exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["fruit"], luxuries: [] },
        consumes: { resources: [], commodities: [], luxuries: [] }
      },
        "Sunmellow Grove": {
          travelPrompt: "Exit to",
          description: "Stone-warmed plums and apricots pressed into honeyed wine.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ],
          produces: { resources: [], commodities: ["fruit"], luxuries: ["honeyed wine"] },
          consumes: { resources: [], commodities: [], luxuries: [] }
        },
        "Seawisp Plum Orchard": {
          travelPrompt: "Exit to",
          description: "Mist-shrouded plum trees yield tart coastal fruit.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ],
          produces: { resources: [], commodities: ["fruit"], luxuries: [] },
          consumes: { resources: [], commodities: [], luxuries: [] }
        },
        "Driftfell Meadow": {
          travelPrompt: "Exit to",
          description: "Breezy downs where cattle and sheep graze in rotation.",
        exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["wool", "meat"], luxuries: [] },
        consumes: { resources: [], commodities: [], luxuries: [] }
      },
      "Moorlight Flats": {
        travelPrompt: "Exit to",
        description: "Goat and wool-fowl fields lit by shoreline phosphorescence.",
        exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["milk", "fiber"], luxuries: [] },
        consumes: { resources: [], commodities: [], luxuries: [] }
      },
        "Gullwind Mill": {
          travelPrompt: "Exit to",
          description: "Wind-driven sails grind grain for nearby farms.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ],
          produces: { resources: [], commodities: ["flour"], luxuries: [] },
          consumes: { resources: [], commodities: ["grain"], luxuries: [] }
        },
        "Tidewheel Watermill": {
          travelPrompt: "Exit to",
          description: "A tidal waterwheel grinds grain into flour.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ],
          produces: { resources: [], commodities: ["flour"], luxuries: [] },
          consumes: { resources: [], commodities: ["grain"], luxuries: [] }
        },
        "Saltmarsh Granary": {
          travelPrompt: "Exit to",
          description: "Stilted storehouse keeping harvest dry above marshy ground.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [],
          produces: { resources: [], commodities: [], luxuries: [] },
          consumes: { resources: [], commodities: ["grain"], luxuries: [] }
        },
      "Copperbrook Forge": {
        travelPrompt: "Exit to",
        description: "Small smithy by the brook repairing tools and shoeing beasts.",
        exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["tools"], luxuries: [] },
        consumes: { resources: ["ore", "fuel"], commodities: [], luxuries: [] }
      },
      "Tidewatcher Lighthouse": {
        travelPrompt: "Exit to",
        description: "Decommissioned beacon repurposed as a coastal watchtower.",
        exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
        interactions: [],
        produces: { resources: [], commodities: [], luxuries: [] },
        consumes: { resources: [], commodities: [], luxuries: [] }
      },
      "Netmaker's Co-op": {
        travelPrompt: "Exit to",
        description: "Workshop weaving flax into ropes and fishing nets.",
        exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
        interactions: [ { name: "Trade", action: "trade" } ],
        produces: { resources: [], commodities: ["nets"], luxuries: [] },
        consumes: { resources: ["flax"], commodities: [], luxuries: [] }
      },
      "The Sunleaf Inn": {
        travelPrompt: "Exit to",
        description: "Sunlit common rooms welcome weary travelers by the gate.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
      "Stonebridge Caravanserai": {
        travelPrompt: "Exit to",
        description: "Caravan yards and stables ring a fortified lodging house.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Adventurers' Guildhall": {
        travelPrompt: "Exit to",
        description: "Trophy-lined walls and quest boards beckon bold souls.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: []
      },
      "Iron Key Smithy": {
        travelPrompt: "Exit to",
        description: "Hard-won steel clinks beneath the smith's watchful eye.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Rolling Wave Coachworks": {
        travelPrompt: "Exit to",
        description: "Carriages and wagons stand ready for long road journeys.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Wavehide Leather Guild": {
        travelPrompt: "Exit to",
        description: "Cured hides and fine saddles fill the bustling guildhouse.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Shield & Sail Armsmiths": {
        travelPrompt: "Exit to",
        description: "Rows of gleaming gear equip guards and sailors alike.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Shrine of the Roadwarden": {
        travelPrompt: "Exit to",
        description: "Travelers leave coins and prayers for safe passage ahead.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: []
      },
      "Caravan Square": {
        travelPrompt: "Exit to",
        description: "Wagons crowd a lively market of goods and gossip.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: [ { name: "Trade", action: "trade" } ]
      },
      "Gatewatch Barracks": {
        travelPrompt: "Exit to",
        description: "Drilled soldiers guard the city’s massive eastern gate.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: []
      },
      "North Gate": {
        travelPrompt: "Exit to",
        description: "Sturdy gatehouse opening to the northern farmlands.",
        exits: [
          { name: "The High Road District", target: "The High Road District" },
          { name: "The Farmlands", target: "The Farmlands" }
        ],
        interactions: []
      },
      "South Gate": {
        travelPrompt: "Exit to",
        description: "Weathered gates lead toward fields south of the city.",
        exits: [
          { name: "The High Road District", target: "The High Road District" },
          { name: "The Farmlands", target: "The Farmlands" }
        ],
        interactions: []
      },
      "Wayfarer's Rest Tavern": {
        travelPrompt: "Exit to",
        description: "Hearty stews and road tales fill this rustic tavern.",
        exits: [ { name: "The High Road District", target: "The High Road District" } ],
        interactions: [ { name: "Rest", action: "rest" } ]
      },
        "Seabreeze Oat Farm": {
          travelPrompt: "Exit to",
          description: "Sea-breezed oat fields rustle outside the city walls.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ]
        },
        "Saltcrest Vineyard & Winery": {
          travelPrompt: "Exit to",
          description: "Salt-kissed grapes ferment into crisp coastal wine.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ]
        },
        "Windward Berry Vineyard & Winery": {
          travelPrompt: "Exit to",
          description: "Hillside berries are pressed into rich, dark wines.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ]
        },
        "Tideflock Stockyards": {
          travelPrompt: "Exit to",
          description: "Pens bustle with cattle and sheep awaiting drovers.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ]
        },
        "Bayside Brickworks": {
          travelPrompt: "Exit to",
          description: "Smoky bayside kilns bake clay into hardy bricks.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ]
        },
        "Cliffbreak Quarry": {
          travelPrompt: "Exit to",
          description: "Workers hew stone from the seaside cliffs.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ]
        },
        "Wavecut Stoneworks": {
          travelPrompt: "Exit to",
          description: "Masons carve cliffstone into sturdy blocks.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: [ { name: "Trade", action: "trade" } ]
        },
        "Coast Road Watchtower": {
          travelPrompt: "Exit to",
          description: "A lone tower keeps vigil along the coastal road.",
          exits: [ { name: "The Farmlands", target: "The Farmlands" } ],
          interactions: []
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
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to", icon: "assets/images/icons/waves_break/Wave's Break.png" }
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
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to", icon: "assets/images/icons/waves_break/Wave's Break.png" }
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
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to", icon: "assets/images/icons/waves_break/Wave's Break.png" }
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
          { name: "Wave's Break", target: "Wave's Break", type: "location", prompt: "Sail to", icon: "assets/images/icons/waves_break/Wave's Break.png" }
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
