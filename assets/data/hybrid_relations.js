export const HYBRID_RELATIONS = [
  { name:"Wood", parents:["Stone","Water"], strong:["Stone"], weak:["Fire"] },
  { name:"Magma", parents:["Stone","Fire"], strong:["Ice"], weak:["Water"] },
  { name:"Sand", parents:["Stone","Wind"], strong:["Water"], weak:["Fire"] },
  { name:"Crystal", parents:["Stone","Ice"], strong:["Dark"], weak:["Thunder"] },
  { name:"Metal", parents:["Stone","Thunder"], strong:["Wind"], weak:["Fire"] },
  { name:"Radiant Earth", parents:["Stone","Light"], strong:["Dark"], weak:["Water"] },
  { name:"Obsidian", parents:["Stone","Dark"], strong:["Light"], weak:["Thunder"] },

  { name:"Steam", parents:["Water","Fire"], strong:["Fire"], weak:["Wind"] },
  { name:"Storm", parents:["Water","Wind"], strong:["Fire"], weak:["Stone"] },
  { name:"Frost", parents:["Water","Ice"], strong:["Fire"], weak:["Thunder"] },
  { name:"Storm Surge", parents:["Water","Thunder"], strong:["Stone"], weak:["Ice"] },
  { name:"Holy Water", parents:["Water","Light"], strong:["Dark"], weak:["Fire"] },
  { name:"Poison", parents:["Water","Dark"], strong:["Light"], weak:["Wind"] },

  { name:"Wildfire", parents:["Fire","Wind"], strong:["Wood"], weak:["Water"] },
  { name:"Ash", parents:["Fire","Ice"], strong:["Light"], weak:["Wind"] },
  { name:"Plasma", parents:["Fire","Thunder"], strong:["Metal"], weak:["Water"] },
  { name:"Sacred Flame", parents:["Fire","Light"], strong:["Dark"], weak:["Water"] },
  { name:"Hellfire", parents:["Fire","Dark"], strong:["Light"], weak:["Ice"] },

  { name:"Blizzard", parents:["Wind","Ice"], strong:["Fire"], weak:["Stone"] },
  { name:"Cyclone", parents:["Wind","Thunder"], strong:["Poison"], weak:["Stone"] },
  { name:"Skyfire", parents:["Wind","Light"], strong:["Dark"], weak:["Ice"] },
  { name:"Umbral Gale", parents:["Wind","Dark"], strong:["Light"], weak:["Fire"] },

  { name:"Hailstorm", parents:["Ice","Thunder"], strong:["Stone"], weak:["Fire"] },
  { name:"Prism", parents:["Ice","Light"], strong:["Dark"], weak:["Thunder"] },
  { name:"Shadowfrost", parents:["Ice","Dark"], strong:["Light"], weak:["Fire"] },

  { name:"Holy Storm", parents:["Thunder","Light"], strong:["Dark"], weak:["Stone"] },
  { name:"Doomstorm", parents:["Thunder","Dark"], strong:["Light"], weak:["Ice"] },

  { name:"Order", parents:["Light","Dark"], strong:["Chaos"], weak:["Chaos"], special:true },
  { name:"Chaos", parents:["Light","Dark"], strong:["Order"], weak:["Order"], special:true },
];
