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
  Guard: { schedule: '06:00-18:00' },
  Attendant: { schedule: '09:00-17:00' },
  Craftsman: { schedule: '08:00-18:00' },
  Laborer: { schedule: 'sunrise-sunset' },
  Hunter: { quota: 5 },
  Logger: { quota: 10 },
  Gatherer: { quota: 10 },
  Miner: { quota: 8 },
  Member: { quota: 1 },
  Baker: { schedule: '04:00-12:00' },
  'Assistant Baker': { schedule: '04:00-12:00' },
  'Bakery Clerk': { schedule: '08:00-16:00' },
  Blacksmith: { schedule: '08:00-18:00' },
  'Smith Apprentice': { schedule: '08:00-18:00' },
  Armorer: { schedule: '08:00-18:00' },
  Farmer: { schedule: 'sunrise-sunset' },
  Farmhand: { schedule: 'sunrise-sunset' },
  'Ranch Hand': { schedule: 'sunrise-sunset' },
  'Orchard Keeper': { schedule: 'sunrise-sunset' },
  'Fruit Picker': { quota: 50 },
  Sailor: { schedule: 'sunrise-sunset' },
  'Dock Hand': { schedule: 'sunrise-sunset' },
  Diver: { schedule: 'sunrise-15:00' },
  Fisherman: { quota: 20 },
  Shipwright: { schedule: '08:00-18:00' },
  Harbormaster: { schedule: '08:00-18:00' }
};

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

export function getJobRolesForBuilding(name) {
  const lower = name.toLowerCase();
  const roles = new Set();
  if (lower.includes('barracks') || lower.includes('guard') || lower.includes('gate')) roles.add('Guard');
  if (lower.includes('bakery') || lower.includes('baker')) {
    roles.add('Baker');
    roles.add('Assistant Baker');
    roles.add('Bakery Clerk');
  }
  if (lower.includes('smith')) {
    roles.add('Blacksmith');
    roles.add('Smith Apprentice');
    roles.add('Armorer');
  }
  if (lower.includes('carpenter') || lower.includes('fletcher') || lower.includes('lumber')) roles.add('Craftsman');
  if (lower.includes('alchemist')) roles.add('Craftsman');
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
  if (
    lower.includes('dock') ||
    lower.includes('port') ||
    lower.includes('harbor')
  ) {
    roles.add('Sailor');
    roles.add('Dock Hand');
    roles.add('Harbormaster');
  }
  if (
    lower.includes('boat') ||
    lower.includes('ship') ||
    lower.includes('naval')
  ) {
    roles.add('Sailor');
  }
  if (lower.includes('shipyard') || lower.includes('shipwright')) roles.add('Shipwright');
  if (
    lower.includes('fish') ||
    lower.includes('fishery') ||
    lower.includes('fishing')
  ) {
    roles.add('Fisherman');
  }
  if (
    lower.includes('diver') ||
    lower.includes('diving') ||
    lower.includes('salvage')
  ) {
    roles.add('Diver');
  }
  if (
    lower.includes('hunt') ||
    lower.includes('log') ||
    lower.includes('gather') ||
    lower.includes('mine')
  ) {
    roles.add('Laborer');
  }
  return Array.from(roles);
}
