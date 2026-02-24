import { LOCATIONS } from "./locations.js";

export const ADVENTURERS_GUILD_RANKS = [
  'Cold Iron',
  'Steel',
  'Copper',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond'
];

export const JOB_ROLE_DATA = {
  Owner: { schedule: '00:00-24:00' , hours: ['00:00-24:00'] },
  Manager: { schedule: '08:00-20:00' , hours: ['08:00-20:00'] },
  Administrator: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Guard: { schedule: null, hours: ['00:00-08:00','08:00-16:00','16:00-24:00'] },
  Attendant: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Craftsman: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Laborer: { schedule: null, hours: ['00:00-24:00'] },
  Hunter: { schedule: null, hours: ['00:00-24:00'] },
  Logger: { schedule: null, hours: ['00:00-24:00'] },
  Gatherer: { schedule: null, hours: ['00:00-24:00'] },
  Miner: { schedule: null, hours: ['00:00-24:00'] },
  Member: { schedule: '00:00-24:00' , hours: ['00:00-24:00'] },
  Baker: { schedule: '04:00-12:00' , hours: ['04:00-12:00'] },
  'Assistant Baker': { schedule: '04:00-12:00' , hours: ['04:00-12:00'] },
  'Bakery Clerk': { schedule: '08:00-16:00' , hours: ['08:00-16:00'] },
  Blacksmith: { schedule: null, hours: ['06:00-14:00','14:00-22:00'] },
  'Smith Apprentice': { schedule: null, hours: ['06:00-14:00','14:00-22:00'] },
  Armorer: { schedule: null, hours: ['06:00-14:00','14:00-22:00'] },
  Farmer: { schedule: 'sunrise-sunset' , hours: ['sunrise-sunset'] },
  Farmhand: { schedule: 'sunrise-sunset' , hours: ['sunrise-sunset'] },
  'Ranch Hand': { schedule: 'sunrise-sunset' , hours: ['sunrise-sunset'] },
  'Orchard Keeper': { schedule: 'sunrise-sunset' , hours: ['sunrise-sunset'] },
  'Fruit Picker': { schedule: 'sunrise-sunset' , hours: ['sunrise-sunset'] },
  Sailor: { schedule: null, hours: ['00:00-24:00'] },
  'Dock Hand': { schedule: null, hours: ['00:00-24:00'] },
  Fisherman: { schedule: null, hours: ['00:00-24:00'] },
  Diver: { schedule: 'sunrise-15:00' , hours: ['sunrise-15:00'] },
  Shipwright: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Harbormaster: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Performer: { schedule: '18:00-24:00' , hours: ['18:00-24:00'] },
  Singer: { schedule: '18:00-24:00' , hours: ['18:00-24:00'] },
  Playwright: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Architect: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Server: { schedule: '10:00-22:00' , hours: ['10:00-22:00'] },
  Chef: { schedule: '06:00-14:00' , hours: ['06:00-14:00'] },
  Bartender: { schedule: '10:00-22:00' , hours: ['10:00-22:00'] },
  Stablehand: { schedule: 'sunrise-sunset' , hours: ['sunrise-sunset'] },
  Brewmaster: { schedule: '06:00-18:00' , hours: ['06:00-18:00'] },
  Brewer: { schedule: '06:00-18:00' , hours: ['06:00-18:00'] },
  Ropemaker: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Cooper: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Saltworker: { schedule: 'sunrise-sunset' , hours: ['sunrise-sunset'] },
  Fishmonger: { schedule: '06:00-14:00' , hours: ['06:00-14:00'] },
  Glassblower: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Carpenter: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Tailor: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Seamstress: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Tanner: { schedule: 'sunrise-sunset' , hours: ['sunrise-sunset'] },
  Alchemist: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Enchanter: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Sailmaker: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Pressman: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Typesetter: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Butcher: { schedule: '04:00-12:00' , hours: ['04:00-12:00'] },
  Smoker: { schedule: '06:00-14:00' , hours: ['06:00-14:00'] },
  Vendor: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Merchant: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Herbalist: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Healer: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Gladiator: { schedule: '10:00-22:00' , hours: ['10:00-22:00'] },
  Stagehand: { schedule: '10:00-22:00' , hours: ['10:00-22:00'] },
  Rigger: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Caulker: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Porter: { schedule: null, hours: ['00:00-08:00','08:00-16:00','16:00-24:00'] },
  Clerk: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Scribe: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Papermaker: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Priest: { schedule: '00:00-24:00' , hours: ['00:00-24:00'] },
  Monk: { schedule: '00:00-24:00' , hours: ['00:00-24:00'] },
  Gardener: { schedule: 'sunrise-sunset' , hours: ['sunrise-sunset'] },
  Teacher: { schedule: '08:00-16:00' , hours: ['08:00-16:00'] },
  Student: { schedule: '08:00-16:00' , hours: ['08:00-16:00'] },
  'Bath Attendant': { schedule: '08:00-20:00' , hours: ['08:00-20:00'] },
  Curator: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Artist: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] },
  Host: { schedule: '18:00-24:00' , hours: ['18:00-24:00'] },
  Courtesan: { schedule: '18:00-24:00' , hours: ['18:00-24:00'] },
  Miller: { schedule: 'sunrise-sunset' , hours: ['sunrise-sunset'] },
  Actor: { schedule: '18:00-24:00' , hours: ['18:00-24:00'] },
  Quartermaster: { schedule: '08:00-18:00' , hours: ['08:00-18:00'] },
  Acolyte: { schedule: '06:00-18:00' , hours: ['06:00-18:00'] },
  Librarian: { schedule: '09:00-17:00' , hours: ['09:00-17:00'] }
};

const BUSINESS_PROFILE_INDEX = (() => {
  const map = new Map();
  Object.values(LOCATIONS).forEach((location) => {
    const businesses = location?.businesses || [];
    businesses.forEach((profile) => {
      if (profile?.name) {
        map.set(profile.name, profile);
      }
    });
  });
  return map;
})();

export function getBusinessProfileByName(name) {
  if (!name) return null;
  return BUSINESS_PROFILE_INDEX.get(name) || null;
}

const CATEGORY_DEFAULT_ROLES = {
  agriculture: { unskilled: 'Farmhand', skilled: 'Farmer', specialist: 'Farmer' },
  craft: { unskilled: 'Laborer', skilled: 'Craftsman', specialist: 'Craftsman' },
  processing: { unskilled: 'Laborer', skilled: 'Craftsman', specialist: 'Craftsman' },
  logistics: { unskilled: 'Porter', skilled: 'Porter', specialist: 'Quartermaster' },
  security: { unskilled: 'Guard', skilled: 'Guard', specialist: 'Guard' },
  support: { unskilled: 'Attendant', skilled: 'Attendant', specialist: 'Administrator' },
  default: { unskilled: 'Laborer', skilled: 'Craftsman', specialist: 'Craftsman' },
};

const BAND_ROLE_RULES = [
  { match: /fruit|orchard|picker|plucker/, role: 'Fruit Picker', tiers: ['unskilled'] },
  {
    match: /grafter|orchardist|warden|trellis|graft/,
    role: 'Orchard Keeper',
    tiers: ['skilled', 'specialist'],
  },
  { match: /herbal|apothec|pest ward|antifungal/, role: 'Herbalist', tiers: ['specialist', 'skilled'] },
  { match: /hauler|loader|carrier|porter|crate|sack|barrow/, role: 'Laborer', tiers: ['unskilled'] },
  { match: /miller|millwright|gear/, role: 'Miller' },
  { match: /brewer|cider|ferment|mash/, role: 'Brewer' },
  { match: /smith|forge|anvil/, role: 'Blacksmith' },
  { match: /tailor|seamstress|cloth/, role: 'Tailor', tiers: ['skilled', 'specialist'] },
  { match: /glass|blower|kiln/, role: 'Glassblower', tiers: ['skilled', 'specialist'] },
  { match: /rope|rigging/, role: 'Ropemaker', tiers: ['skilled', 'specialist'] },
  { match: /coop|cask|barrel/, role: 'Cooper', tiers: ['skilled', 'specialist'] },
  { match: /scribe|clerk|account/, role: 'Clerk', tiers: ['skilled', 'specialist'] },
];

function mapBandToRole(name, category, band) {
  const lowerName = name.toLowerCase();
  const text = (band.roles || '').toLowerCase();
  for (const rule of BAND_ROLE_RULES) {
    if (rule.tiers && !rule.tiers.includes(band.type)) continue;
    if (rule.match.test(text)) return rule.role;
  }
  if (lowerName.includes('orchard')) {
    if (band.type === 'unskilled') return 'Fruit Picker';
    if (band.type === 'skilled') return 'Orchard Keeper';
    if (band.type === 'specialist') return text.includes('herbal') ? 'Herbalist' : 'Orchard Keeper';
  }
  if (lowerName.includes('farm')) {
    if (band.type === 'unskilled') return 'Farmhand';
    if (band.type === 'skilled') return 'Farmer';
  }
  if (lowerName.includes('mill')) {
    if (band.type !== 'unskilled') return 'Miller';
  }
  if (lowerName.includes('granary') || lowerName.includes('warehouse')) {
    if (band.type === 'unskilled') return 'Laborer';
    return 'Clerk';
  }
  const defaults = CATEGORY_DEFAULT_ROLES[category] || CATEGORY_DEFAULT_ROLES.default;
  return defaults[band.type] || CATEGORY_DEFAULT_ROLES.default[band.type];
}

function deriveWorkforceCounts(name) {
  const profile = getBusinessProfileByName(name);
  if (!profile?.workforce?.normal?.length) return null;
  const counts = {};
  let total = 0;
  profile.workforce.normal.forEach((band) => {
    const role = mapBandToRole(name, profile.category, band);
    if (!role) return;
    total += band.count;
    counts[role] = (counts[role] || 0) + band.count;
  });
  if (profile.category === 'agriculture' && total > 0) {
    const homestead = Math.max(2, Math.round(total * 0.15));
    counts.Member = Math.max(counts.Member || 0, homestead);
  }
  return counts;
}

export function getJobRolesForBuilding(name) {
  const lower = name.toLowerCase();
  const roles = new Set();
  if (lower.includes('barracks') || lower.includes('guard') || lower.includes('gate')) roles.add('Guard');
  if (lower.includes('bakery') || lower.includes('baker')) {
    roles.add('Baker');
    roles.add('Assistant Baker');
    roles.add('Bakery Clerk');
  }
  if (lower.includes('smith') || lower.includes('forge')) {
    roles.add('Blacksmith');
    roles.add('Smith Apprentice');
    roles.add('Armorer');
  }
  if (lower.includes('carpenter') || lower.includes('fletcher') || lower.includes('lumber')) roles.add('Craftsman');
  if (
    lower.includes('alchemist') ||
    lower.includes('tannery') ||
    lower.includes('ropewalk') ||
    lower.includes('coopers') ||
    lower.includes('press') ||
    lower.includes('smokehouse') ||
    lower.includes('butchery') ||
    lower.includes('glassworks') ||
    lower.includes('sailmakers') ||
    lower.includes('enchantery')
  )
    roles.add('Craftsman');
  if (lower.includes('trading house')) {
    roles.add('Merchant');
    roles.add('Clerk');
    roles.add('Porter');
  }
  if (lower.includes('warehouse')) {
    roles.add('Porter');
    roles.add('Guard');
  }
  if (lower.includes('shipwright') || lower.includes('shipyard')) {
    roles.add('Shipwright');
    roles.add('Rigger');
    roles.add('Carpenter');
    roles.add('Caulker');
    roles.add('Sailor');
  }
  if (lower.includes('naval yard')) {
    roles.add('Sailor');
    roles.add('Quartermaster');
    roles.add('Guard');
  }
  if (lower.includes('quay') || lower.includes('wharf') || lower.includes('pier')) {
    roles.add('Dock Hand');
    roles.add('Harbormaster');
    roles.add('Sailor');
  }
  if (lower.includes('ropewalk')) roles.add('Ropemaker');
  if (lower.includes('cooper')) roles.add('Cooper');
  if (lower.includes('saltworks')) roles.add('Saltworker');
  if (lower.includes('fishmonger')) roles.add('Fishmonger');
  if (lower.includes('glassworks')) roles.add('Glassblower');
  if (lower.includes('carpenters')) roles.add('Carpenter');
  if (lower.includes('clothier')) {
    roles.add('Tailor');
    roles.add('Seamstress');
  }
  if (lower.includes('tannery')) roles.add('Tanner');
  if (lower.includes('alchemical')) roles.add('Alchemist');
  if (lower.includes('enchantery')) roles.add('Enchanter');
  if (lower.includes('sailmakers')) roles.add('Sailmaker');
  if (lower.includes('press') || lower.includes('papermill')) {
    roles.add('Pressman');
    roles.add('Typesetter');
    roles.add('Papermaker');
    roles.add('Scribe');
  }
  if (lower.includes('butcher')) roles.add('Butcher');
  if (lower.includes('smokehouse')) roles.add('Smoker');
  if (lower.includes('market') || lower.includes('plaza')) {
    roles.add('Vendor');
    roles.add('Merchant');
  }
  if (lower.includes('remedies')) {
    roles.add('Herbalist');
    roles.add('Healer');
    roles.add('Clerk');
  }
  if (lower.includes('guild')) {
    roles.add('Attendant');
    roles.add('Member');
  }
  if (lower.includes('farm')) {
    roles.add('Farmer');
    roles.add('Farmhand');
    roles.add('Ranch Hand');
  }
  if (lower.includes('orchard')) {
    roles.add('Orchard Keeper');
    roles.add('Fruit Picker');
  }
  if (lower.includes('dock') || lower.includes('port') || lower.includes('harbor')) {
    roles.add('Sailor');
    roles.add('Dock Hand');
    roles.add('Harbormaster');
  }
  if (lower.includes('boat') || lower.includes('ship') || lower.includes('naval')) {
    roles.add('Sailor');
  }
  if (lower.includes('fish') || lower.includes('fishery') || lower.includes('fishing')) {
    roles.add('Fisherman');
  }
  if (lower.includes('diver') || lower.includes('diving') || lower.includes('salvage')) {
    roles.add('Diver');
  }
  if (lower.includes('hunt') || lower.includes('log') || lower.includes('gather') || lower.includes('mine')) {
    roles.add('Laborer');
  }
  if (
    lower.includes('inn') ||
    lower.includes('tavern') ||
    lower.includes('supper') ||
    lower.includes('salon') ||
    lower.includes('club') ||
    lower.includes('galley')
  ) {
    roles.add('Chef');
    roles.add('Server');
    roles.add('Performer');
    roles.add('Singer');
    roles.add('Bartender');
    roles.add('Stablehand');
  }
  if (lower.includes('brewery') || lower.includes('taproom')) {
    roles.add('Brewmaster');
    roles.add('Brewer');
    roles.add('Bartender');
    roles.add('Server');
  }
  if (lower.includes('arena')) {
    roles.add('Performer');
    roles.add('Singer');
    roles.add('Gladiator');
    roles.add('Stagehand');
  }
  if (lower.includes('monastery')) {
    roles.add('Monk');
    roles.add('Priest');
    roles.add('Singer');
  }
  if (lower.includes('temple') || lower.includes('shrine')) {
    roles.add('Priest');
    roles.add('Acolyte');
    roles.add('Singer');
  }
  if (lower.includes('garden')) roles.add('Gardener');
  if (lower.includes('academy')) {
    roles.add('Teacher');
    roles.add('Student');
  }
  if (lower.includes('library')) {
    roles.add('Librarian');
    roles.add('Scribe');
  }
  if (lower.includes('amphitheater') || lower.includes('theater')) {
    roles.add('Performer');
    roles.add('Singer');
    roles.add('Actor');
    roles.add('Stagehand');
  }
  if (lower.includes('bathhouse') || lower.includes('springs')) {
    roles.add('Bath Attendant');
    roles.add('Healer');
  }
  if (lower.includes('gallery')) {
    roles.add('Curator');
    roles.add('Artist');
  }
  if (lower.includes('granary')) {
    roles.add('Miller');
    roles.add('Clerk');
    roles.add('Laborer');
  }
  if (lower.includes('pavilion')) {
    roles.add('Performer');
    roles.add('Server');
  }
  if (lower.includes('brothel')) {
    roles.add('Host');
    roles.add('Courtesan');
    roles.add('Guard');
  }
  if (lower.includes('caravanserai')) {
    roles.add('Stablehand');
    roles.add('Guard');
    roles.add('Clerk');
    roles.add('Server');
  }
  if (lower.includes('press')) roles.add('Playwright');
  if (lower.includes('hall of records') || lower.includes('chart house') || lower.includes('architect')) roles.add('Architect');
  return Array.from(roles);
}

function staffCountsForBuilding(name) {
  const lower = name.toLowerCase();
  const counts = { Owner: 1, Manager: 1, Administrator: 1 };
  const add = (role, count = 1) => {
    counts[role] = (counts[role] || 0) + count;
  };

  if (lower.includes('barracks') || lower.includes('guard') || lower.includes('gate')) add('Guard', 5);
  if (lower.includes('bakery') || lower.includes('baker')) {
    add('Baker', 2);
    add('Assistant Baker');
    add('Bakery Clerk');
  }
  if (lower.includes('smith') || lower.includes('forge')) {
    add('Blacksmith');
    add('Smith Apprentice');
    add('Armorer');
  }
  if (lower.includes('trading house')) {
    add('Merchant');
    add('Clerk', 2);
    add('Porter', 3);
    add('Guard', 2);
  }
  if (lower.includes('warehouse')) {
    add('Porter', 5);
    add('Laborer', 5);
    add('Guard', 1);
  }
  if (lower.includes('inn') || lower.includes('tavern') || lower.includes('supper') || lower.includes('salon') || lower.includes('club') || lower.includes('galley')) {
    add('Chef');
    add('Performer');
    add('Singer');
    add('Server', 3);
    add('Bartender');
    add('Stablehand', 2);
  }
  if (lower.includes('arena')) {
    add('Performer', 2);
    add('Singer');
    add('Gladiator', 5);
    add('Stagehand', 2);
  }
  if (lower.includes('guild')) {
    add('Attendant', 2);
    add('Member');
  }
  if (lower.includes('farm')) {
    add('Farmer');
    add('Ranch Hand');
    add('Farmhand', 3);
  }
  if (lower.includes('orchard')) {
    add('Orchard Keeper');
    add('Fruit Picker', 4);
  }
  if (lower.includes('dock') || lower.includes('port') || lower.includes('harbor')) {
    add('Harbormaster');
    add('Dock Hand', 5);
    add('Sailor', 3);
  }
  if (lower.includes('shipyard') || lower.includes('shipwright')) {
    add('Shipwright', 5);
    add('Rigger', 3);
    add('Carpenter', 3);
    add('Caulker', 2);
    add('Sailor', 2);
  }
  if (lower.includes('naval yard')) {
    add('Sailor', 5);
    add('Guard', 5);
    add('Quartermaster');
  }
  if (lower.includes('quay') || lower.includes('wharf') || lower.includes('pier')) {
    add('Dock Hand', 5);
    add('Harbormaster');
    add('Sailor', 3);
  }
  if (lower.includes('fish') || lower.includes('fisher')) add('Fisherman', 6);
  if (lower.includes('fishmonger')) {
    add('Fishmonger', 5);
    add('Laborer', 3);
  }
  if (lower.includes('tannery')) {
    add('Tanner', 3);
    add('Laborer', 4);
  }
  if (lower.includes('ropewalk')) {
    add('Ropemaker', 5);
    add('Laborer', 5);
  }
  if (lower.includes('coopers')) {
    add('Cooper', 3);
    add('Laborer', 3);
  }
  if (lower.includes('glassworks')) {
    add('Glassblower', 4);
    add('Laborer', 4);
  }
  if (lower.includes('carpenters')) {
    add('Carpenter', 5);
    add('Laborer', 2);
  }
  if (lower.includes('clothier')) {
    add('Tailor', 3);
    add('Seamstress', 3);
  }
  if (lower.includes('alchemical')) {
    add('Alchemist');
    add('Laborer');
  }
  if (lower.includes('enchantery')) add('Enchanter');
  if (lower.includes('sailmakers')) {
    add('Sailmaker', 4);
    add('Laborer', 2);
  }
  if (lower.includes('press') || lower.includes('papermill')) {
    add('Pressman', 2);
    add('Typesetter', 2);
    add('Papermaker', 3);
    add('Scribe');
  }
  if (lower.includes('butchery')) {
    add('Butcher', 2);
    add('Laborer', 2);
  }
  if (lower.includes('smokehouse')) {
    add('Smoker', 2);
    add('Laborer', 2);
  }
  if (lower.includes('market')) {
    add('Vendor', 10);
    add('Guard', 2);
  }
  if (lower.includes('plaza')) {
    add('Merchant', 5);
    add('Guard', 2);
  }
  if (lower.includes('remedies')) {
    add('Herbalist');
    add('Healer');
    add('Clerk');
  }
  if (lower.includes('temple') || lower.includes('shrine')) {
    add('Priest');
    add('Acolyte', 2);
    add('Singer', 2);
  }
  if (lower.includes('monastery')) {
    add('Monk', 10);
    add('Priest', 2);
    add('Singer', 2);
  }
  if (lower.includes('garden') && lower.includes('botanical')) {
    add('Gardener', 6);
  }
  if (lower.includes('academy')) {
    add('Teacher', 5);
    add('Student', 20);
  }
  if (lower.includes('library')) {
    add('Librarian', 2);
    add('Scribe', 2);
  }
  if (lower.includes('amphitheater') || lower.includes('theater')) {
    add('Performer', 6);
    add('Singer', 2);
    add('Actor', 6);
    add('Stagehand', 3);
  }
  if (lower.includes('bathhouse') || lower.includes('springs')) {
    add('Bath Attendant', 5);
  }
  if (lower.includes('gallery')) {
    add('Curator');
    add('Artist', 4);
    add('Guard');
  }
  if (lower.includes('granary')) {
    add('Miller', 3);
    add('Clerk', 2);
    add('Laborer', 5);
  }
  if (lower.includes('brewery') || lower.includes('taproom')) {
    add('Brewmaster');
    add('Brewer', 4);
    add('Bartender', 2);
    add('Server', 4);
  }
  if (lower.includes('pavilion')) {
    add('Performer', 3);
    add('Server', 3);
  }
  if (lower.includes('brothel')) {
    add('Host');
    add('Courtesan', 6);
    add('Guard', 2);
  }
  if (lower.includes('caravanserai')) {
    add('Stablehand', 6);
    add('Guard', 3);
    add('Clerk', 2);
    add('Server', 2);
  }
  if (lower.includes('hall of records') || lower.includes('chart house') || lower.includes('architect')) add('Architect');
  if (lower.includes('press')) add('Playwright');

  // ensure at least one of each role discovered by getJobRolesForBuilding
  for (const role of getJobRolesForBuilding(name)) {
    if (!counts[role]) counts[role] = 1;
  }

  const workforceCounts = deriveWorkforceCounts(name);
  if (workforceCounts) {
    Object.entries(workforceCounts).forEach(([role, count]) => {
      counts[role] = Math.max(counts[role] || 0, count);
    });
  }

  return counts;
}

function defaultQuotaForBuilding(name, role) {
  const lower = name.toLowerCase();
  switch (role) {
    case 'Hunter':
      return { amount: 5, unit: 'game', pay: 500 };
    case 'Logger':
      return { amount: 10, unit: 'logs', pay: 300 };
    case 'Gatherer':
      return { amount: 10, unit: 'bundles', pay: 200 };
    case 'Miner':
      return { amount: 8, unit: 'ore', pay: 400 };
    case 'Fruit Picker':
      return { amount: lower.includes('orchard') ? 50 : 40, unit: 'bushels', pay: 300 };
    case 'Dock Hand':
      return { amount: lower.includes("merchants") ? 40 : 30, unit: 'crates', pay: 200 };
    case 'Fisherman':
      return { amount: lower.includes('fishmongers') ? 30 : 20, unit: 'fish', pay: 250 };
    default:
      return null;
  }
}

export function defaultEmployeesForBuilding(name) {
  const counts = staffCountsForBuilding(name);
  const employees = [];
  for (const [role, count] of Object.entries(counts)) {
    const data = JOB_ROLE_DATA[role] || {};
    const quota = defaultQuotaForBuilding(name, role);
    const hrs = data.hours || [];
    for (let i = 0; i < count; i++) {
      let schedule = null;
      if (data.schedule != null) {
        schedule = data.schedule;
      } else if (!quota && hrs.length) {
        schedule = hrs[i % hrs.length];
      }
      employees.push({
        role,
        schedule,
        hours: hrs.length ? [...hrs] : null,
        quota: quota ? { amount: quota.amount, unit: quota.unit } : null,
        pay: quota ? quota.pay : null,
        baseQuota: quota ? quota.amount : null,
        basePay: quota ? quota.pay : null,
        access:
          role === 'Owner' || role === 'Manager'
            ? ['shop', 'sell', 'manage']
            : role === 'Administrator'
            ? ['shop', 'sell', 'manage']
            : ['shop', 'sell'],
      });
    }
  }
  return employees;
}

export function determineOwnership(name) {
  const lower = name.toLowerCase();
  if (
    lower.includes('barracks') ||
    lower.includes('gate') ||
    lower.includes('keep') ||
    lower.includes('watch tower') ||
    lower.includes('naval') ||
    lower.includes('guard')
  ) {
    return 'city';
  }
  return 'private';
}
