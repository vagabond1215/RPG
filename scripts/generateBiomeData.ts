import { writeFileSync } from 'fs';

function randomHex(len: number = 6) {
  const hex = '0123456789abcdef';
  let out = '';
  for (let i = 0; i < len; i++) out += hex[Math.floor(Math.random() * hex.length)];
  return out;
}

function kebab(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const regions = ["Tropical","Temperate","Boreal","Arctic","Subarctic","Polar","Coastal","Oceanic","Freshwater","Desert","Steppe","Alpine"];

const habitats = [
  "Deep sea","Open ocean","Coral reefs","Kelp forests","Continental shelves","Estuaries","Ocean shores (rocky)","Ocean shores (sandy)","Ocean shores (muddy)","Rivers","Streams","Lakes","Ponds","Springs",
  "Swamps","Marshes","Bogs","Fens","Floodplains","Mangroves","Brackish marshlands","Tidal flats",
  "Tropical rainforest","Temperate rainforest","Deciduous forest","Boreal forest (taiga)","Dry forest","Savanna","Prairie","Steppe","Pampas","Meadow","Hot desert (sand dune)","Hot desert (rocky desert)","Hot desert (salt flats)","Cold desert","Semi-arid scrublands","Alpine tundra","Montane forest","Cliffs","Scree slopes","Arctic tundra","Subarctic tundra","Permafrost zones",
  "Beaches (sandy)","Beaches (pebbly)","Beaches (rocky)","Coastal dunes","Lagoons","Barrier islands",
  "Limestone caves","Lava tubes","Underground rivers","Underground lakes","Karst systems",
  "Pack ice","Ice shelves","Glaciers","Snowfields","Polar deserts",
  "Volcanic regions (lava flows)","Volcanic regions (ash plains)","Geothermal springs","High-altitude plateaus","Hyper-arid salt basins"
];

const dietOpts = ["herbivore","grazer","browser","carnivore","insectivore","omnivore","scavenger","piscivore","detritivore"];
const foodSources = ["grass","leaves","seeds","berries","fish","insects","small mammals","carrion","algae","plankton"];
const diseaseList = ["rabies","mites","worms","pox","rot"];
const byproductTypes = ["hide","fur","feather","bone","antler","horn","tooth","fat","meat","milk","egg","venom","shell"];
const harvestMethods = ["wild","domesticated"];
const sizeClasses = ["tiny","small","medium","large","huge"];
const seasons = ["spring","summer","autumn","winter"];
const hooksAnimal = [
  "Its parts fetch dear coin in distant fairs",
  "Poachers brave stocks and rope for its prize",
  "Guild charter grants monopoly over its trade",
  "Village law shields it during sacred weeks",
  "Legends claim its cry foretells war"
];

const adjectivesAnimal = ["Crimson","Silver","Shadow","Giant"];

const animalBases = [
  {name: "Deer", group: "mammal"},
  {name: "Boar", group: "mammal"},
  {name: "Goat", group: "mammal"},
  {name: "Sheep", group: "mammal"},
  {name: "Ox", group: "mammal"},
  {name: "Wolf", group: "mammal"},
  {name: "Bear", group: "mammal"},
  {name: "Hare", group: "mammal"},
  {name: "Horse", group: "mammal"},
  {name: "Camel", group: "mammal"},
  {name: "Hawk", group: "bird"},
  {name: "Duck", group: "bird"},
  {name: "Goose", group: "bird"},
  {name: "Crow", group: "bird"},
  {name: "Swan", group: "bird"},
  {name: "Snake", group: "reptile"},
  {name: "Lizard", group: "reptile"},
  {name: "Turtle", group: "reptile"},
  {name: "Frog", group: "amphibian"},
  {name: "Toad", group: "amphibian"},
  {name: "Salmon", group: "fish"},
  {name: "Trout", group: "fish"},
  {name: "Carp", group: "fish"},
  {name: "Spider", group: "invertebrate"},
  {name: "Bee", group: "invertebrate"}
];

const genderedByGroup: Record<string, {male:string,female:string,juvenile:string,collective:string}> = {
  mammal: {male:"buck",female:"doe",juvenile:"young",collective:"herd"},
  bird: {male:"cock",female:"hen",juvenile:"chick",collective:"flock"},
  reptile: {male:"male",female:"female",juvenile:"hatchling",collective:"clutch"},
  amphibian: {male:"male",female:"female",juvenile:"tadpole",collective:"knot"},
  fish: {male:"male",female:"female",juvenile:"fry",collective:"school"},
  invertebrate: {male:"male",female:"female",juvenile:"larva",collective:"swarm"}
};

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)]; }
function pickN<T>(arr: T[], n: number): T[] { const a = [...arr]; const out: T[] = []; for(let i=0;i<n && a.length;i++){ const idx=Math.floor(Math.random()*a.length); out.push(a.splice(idx,1)[0]); } return out; }

function makeAnimal(common: string, group: string){
  const regionsChoice = pickN(regions, Math.ceil(Math.random()*3));
  const habitatsChoice = pickN(habitats, 1+Math.floor(Math.random()*3));
  const dietChoice = pickN(dietOpts, 1+Math.floor(Math.random()*2));
  const foods = pickN(foodSources, 2);
  const domesticated = Math.random() < 0.3;
  const behavior = {
    aggressive: Math.random()<0.3,
    territorial: Math.random()<0.4,
    risk_to_humans: pick(["none","low","moderate","high"]),
    nocturnal: Math.random()<0.5,
    migratory: Math.random()<0.3
  };
  const edibility = {
    edible: true,
    parts: ["meat"],
    preparation_notes: "roast or stew",
    taboo_or_restricted: false
  };
  if(["bird","reptile","amphibian","fish","invertebrate"].includes(group)){
    edibility.parts.push("egg");
  }
  const diseases = pickN(diseaseList, Math.floor(Math.random()*2));
  const byproducts = [
    {type:"meat",notes:"fresh cuts",yield_unit:"kg",avg_yield: Math.round(Math.random()*40+5),harvest_method:domesticated?"domesticated":"wild"}
  ];
  if(group==="mammal"){
    byproducts.push({type:"hide",notes:"tanned leather",yield_unit:"kg",avg_yield:Math.round(Math.random()*10+5),harvest_method:domesticated?"domesticated":"wild"});
    if(Math.random()<0.5) byproducts.push({type:"milk",notes:"rich flavor",yield_unit:"L",avg_yield:Math.round(Math.random()*20+5),harvest_method:domesticated?"domesticated":"wild"});
  }
  if(group==="bird"){
    byproducts.push({type:"feather",notes:"fletching",yield_unit:"count",avg_yield:Math.round(Math.random()*20+5),harvest_method:domesticated?"domesticated":"wild"});
  }
  const gendered = genderedByGroup[group];
  const size_class = pick(sizeClasses);
  const mating_season = pick(seasons);
  const gestation_period = group==="mammal"? `${Math.round(Math.random()*180+60)} days` : "";
  const incubation_period = group!=="mammal"? `${Math.round(Math.random()*40+10)} days` : "";
  const reproduction_notes = group==="mammal"?"litters of 1-3" : "clutches of many";
  const production_cycles = {
    egg_laying_frequency: group!=="mammal"?"weekly": "",
    milk_production_duration: group==="mammal"?"3 months":"",
    wool_shearing_cycle: ""
  };
  const butchering_age = group==="mammal"?"2 years":"1 year";
  const hook = pick(hooksAnimal);
  const narrative = `The ${common} wanders the ${habitatsChoice[0]} of the ${regionsChoice[0]} reaches, feeding on ${foods[0]} and ${foods[1]}. ${domesticated?`Farmers keep small stocks for ${byproducts[0].type} and watch pens each dusk.`:`Few have tamed the beast; it roams where it wills.`} ${(behavior.aggressive?"Hunters step wary":"Children watch it calmly")}, for risk to folk is ${behavior.risk_to_humans}. ${hook}. Travel guilds levy coin on its byproducts, and wardens fine poachers without charter. Tales whisper that its season of ${mating_season} draws traders and cutpurses alike, while elders read its tracks for omens of planting.`;
  return {
    type:"animal",
    id: `${kebab(common)}-${randomHex()}`,
    common_name: common,
    alt_names: [],
    taxon_group: group,
    regions: regionsChoice,
    habitats: habitatsChoice,
    diet: dietChoice,
    food_sources: foods,
    domestication: {
      domesticated,
      trainable: domesticated && Math.random()<0.5,
      draft_or_mount: domesticated && group==="mammal" && Math.random()<0.3,
      notes: domesticated?"kept in pens":""
    },
    behavior,
    edibility,
    disease_risks: diseases,
    byproducts,
    gendered,
    size_class,
    mating_season,
    gestation_period,
    incubation_period,
    reproduction_notes,
    production_cycles,
    butchering_age,
    narrative
  };
}

const plantAdjectives = ["Scarlet","Silver","Golden","Dwarf","Wild"];
const growthForms = ["tree","shrub","vine","herb","forb","grass","rush","sedge","fern","moss","fungus"];
const plantBases = [
  {name:"Oak", form:"tree"},
  {name:"Pine", form:"tree"},
  {name:"Birch", form:"tree"},
  {name:"Willow", form:"tree"},
  {name:"Cedar", form:"tree"},
  {name:"Rose", form:"shrub"},
  {name:"Juniper", form:"shrub"},
  {name:"Holly", form:"shrub"},
  {name:"Bramble", form:"shrub"},
  {name:"Grape", form:"vine"},
  {name:"Ivy", form:"vine"},
  {name:"Hops", form:"vine"},
  {name:"Sage", form:"herb"},
  {name:"Thyme", form:"herb"},
  {name:"Mint", form:"herb"},
  {name:"Lavender", form:"herb"},
  {name:"Barley", form:"grass"},
  {name:"Rye", form:"grass"},
  {name:"Oat", form:"grass"},
  {name:"Mushroom", form:"fungus"}
];

const edibleParts = ["leaf","flower","fruit","seed","root","rhizome","bulb","bark","sap","shoot","fruiting body"];
const culinaryUses = ["stews","breads","ale","porridge","tea","salads"];
const plantByproducts = ["fiber","dye","oil","resin","incense","timber","wicker","thatched reed","fodder"];
const yieldUnits = ["kg","g","L","bundle","skein","m² thatch"];
const hookPlant = [
  "Guild gardeners guard its seed rights",
  "Priests demand tithes of its rare sap",
  "Folk healers trade quietly in its leaves",
  "A royal edict bans export of its timber",
  "Poachers steal into fields by moonlight"
];
const companionList = ["beans","peas","lentils","flax","turnips","wheat"];
const tierFood = ["common","fine","high table","luxury","arcane"];

function makePlant(common: string, form: string){
  const regionsChoice = pickN(regions, Math.ceil(Math.random()*3));
  const habitatsChoice = pickN(habitats, 1+Math.floor(Math.random()*3));
  const cultivated = Math.random()<0.5;
  const edible = Math.random()<0.6;
  const parts = edible ? pickN(edibleParts,1+Math.floor(Math.random()*2)) : [];
  const medicinal = Math.random()<0.3;
  const toxic = Math.random()<0.3;
  const toxicity_notes = toxic?"causes stomach cramps":"";
  const culinary = edible ? pickN(culinaryUses,1+Math.floor(Math.random()*2)) : [];
  const byprods = Math.random()<0.7 ? [{type: pick(plantByproducts), notes:"", yield_unit: pick(yieldUnits), avg_yield: Math.round(Math.random()*50+5), harvest_season: pick(seasons)}] : [];
  const seasonality = pick(["spring blooms","summer fruit","autumn harvest","evergreen"]);
  const sowing_season = pick(seasons);
  const harvest_season = pick(seasons);
  const growth_duration = `${Math.round(Math.random()*180+60)} days`;
  const companions = pickN(companionList,1+Math.floor(Math.random()*2));
  const rotation = pick(["follows legumes","precedes root crops","improves soil","depletes soil"]);
  const fallow_notes = "fields rest after two cycles";
  const hook = pick(hookPlant);
  const narrative = `The ${common} favors ${habitatsChoice[0]} within ${regionsChoice[0]} realms and shows ${seasonality}. Farmers sow in ${sowing_season} and harvest in ${harvest_season}, needing about ${growth_duration}. ${edible?`Its ${parts.join(" and ")} season dishes like ${culinary.join(" and ")}, traded in village fairs.`:"Though rarely eaten, it holds a place in hedge lore."} ${medicinal?"Apothecaries prize its virtues and store dried bundles in oak chests." :""} ${toxic?`Careless hands risk ${toxicity_notes}; guild laws demand marked baskets.`:""} ${hook}. Stewards plant it beside ${companions.join(" and ")} to keep soils hearty, allowing rotations that ${rotation}, and fields left fallow after two cycles regain rich loam. Travelers mark its sprouting as a sign of safe roads, and smugglers watch for its wilt to know patrols pass.`;
  const tiers = {food_tier: edible? [pick(tierFood)] : [], luxury_tier: Math.random()<0.2 ? [pick(tierFood)] : []};
  return {
    type:"plant",
    id:`${kebab(common)}-${randomHex()}`,
    common_name: common,
    alt_names: [],
    growth_form: form,
    regions: regionsChoice,
    habitats: habitatsChoice,
    cultivated,
    edible,
    edible_parts: parts,
    medicinal,
    toxic,
    toxicity_notes,
    culinary_uses: culinary,
    foraging_notes:"",
    byproducts: byprods,
    seasonality,
    sowing_season,
    harvest_season,
    growth_duration,
    companion_crops: companions,
    rotation_relationships: rotation,
    fallow_notes,
    narrative,
    tiers
  };
}

const animals:any[]=[];
for(const base of animalBases){
  for(const adj of adjectivesAnimal){
    const name = `${adj} ${base.name}`;
    animals.push(makeAnimal(name, base.group));
  }
}

const plants:any[]=[];
for(const base of plantBases){
  for(const adj of plantAdjectives){
    if(plants.length>=100) break;
    const name = `${adj} ${base.name}`;
    plants.push(makePlant(name, base.form));
  }
}

const all = [...animals, ...plants];
const lines = all.map(obj=>JSON.stringify(obj));
  writeFileSync('data/biome_entries.jsonl', lines.join('\n') + '\n');
  console.log('generated', animals.length, 'animals and', plants.length, 'plants');
