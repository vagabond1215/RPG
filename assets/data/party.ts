// party.ts — party structs (up to 8), resources, effects, and NPC proficiency policy

import { initGrowth, onLevelUp } from "./attr_growth.js";
import type { Equipment } from "./equipment.js";
import { createEmptyEquipment } from "./equipment.js";

/* ========================= Core Types ========================= */

export type Attr = "STR"|"DEX"|"CON"|"VIT"|"AGI"|"INT"|"WIS"|"CHA";
export type Element = "Stone"|"Water"|"Wind"|"Fire"|"Ice"|"Lightning"|"Dark"|"Light";

export type ProficiencyKind =
  | "Element_Stone"|"Element_Water"|"Element_Wind"|"Element_Fire"
  | "Element_Ice"|"Element_Lightning"|"Element_Dark"|"Element_Light"
  | "Weapon_Sword"|"Weapon_Greatsword"|"Weapon_Axe"|"Weapon_Greataxe"|"Weapon_Spear"|"Weapon_Dagger"|"Weapon_Mace"|"Weapon_Bow"|"Weapon_Crossbow"|"Weapon_Staff"|"Weapon_Shield"|"Weapon_Wand"|"Weapon_Unarmed"
  | "Instrument"|"Dance"|"Singing"
  | "Craft_Alchemy"|"Craft_Brewing"|"Craft_Carpentry"|"Craft_Weaving"|"Craft_Fletching"|"Craft_Rope"|"Craft_Calligraphy"|"Craft_Drawing"|"Craft_Cooking"
  | "Gather_Mining"|"Gather_Foraging"|"Gather_Logging"|"Gather_Herbalism"|"Gather_Gardening"|"Gather_Farming"|"Gather_PearlDiving"
  | "Swimming"|"Sailing"|"Riding"
  | "Evasion"|"Parry"|"Block";

export interface ProfBlock {
  /** raw, 2-dec tracked for players; NPCs can ignore this */
  value: number;
  /** per-kind current cap (rounded int outside if you prefer) */
  cap: number;
  /** unlock thresholds for taper/tiers (optional, used by your progression funcs) */
  thresholds?: number[];
}

export type Proficiencies = Partial<Record<ProficiencyKind, ProfBlock>>;

export interface AttrBlock { STR:number; DEX:number; CON:number; VIT:number; AGI:number; INT:number; WIS:number; CHA:number; }

export interface Resources {
  HP: number; MP: number; Stamina: number;
  HPMax: number; MPMax: number; StaminaMax: number;
}

export type Faction = "playerParty" | "enemy" | "neutral";

export interface GrowthState {
  attrs: AttrBlock;
  acc: AttrBlock;
  choicePool: number;
}

export interface GrowthData {
  state: GrowthState;
  rates: AttrBlock;
  choicePerLevel: number;
}

/* ===== Status, Effects, and Maintenance (songs/dances/singing) ===== */

export type DurationModel = "post-stop" | "normal"; // we mainly use "post-stop"

export interface TimedEffect {
  id: string;                        // stable id
  sourceMemberId: string;            // who applied it
  kind: "buff"|"debuff"|"dot"|"regen"|"control"|"resist"|"weakness"|"shield"|"aura"|"ultimate";
  element?: Element;
  // effect payload is app-specific; put your resolved modifiers here
  payload: Record<string, unknown>;
  durationModel: DurationModel;      // "post-stop" for maintained effects created while channeling
  remainingSec: number;              // counts down only when countingDown=true
  countingDown: boolean;             // false while source maintains channel
  startedAtMs: number;
}

export interface MaintainedChannel {
  /** e.g., "song:Swift Step", "dance:Earthen Shield Dance", "sing:Fire Overture" */
  id: string;
  sourceMemberId: string;
  /** list of TimedEffect ids being held up by this channel */
  effectIds: string[];
  /** true while the performer is actively maintaining */
  active: boolean;
}

export interface Member {
  id: string;
  name: string;
  level: number;
  race?: string;
  faction: Faction;                  // allies use "playerParty"
  isPlayer: boolean;                 // the controllable player character
  isNPC: boolean;                    // true for non-player allies & enemies
  controllable: boolean;             // allies you can drive (true for player; optional for companions)

  attributes: AttrBlock;             // current integer attributes (after auto + manual)
  startingAttributes: AttrBlock;     // their level-1 racial baseline (used by cap resolvers etc.)
  manualPool?: number;               // unspent manual attribute points (for ally assignment)
  growth?: GrowthData;               // automatic attribute progression state
  resources: Resources;

  proficiencies: Proficiencies;      // see NPC policy below
  equipment?: Equipment;

  // Combat state
  alive: boolean;
  initiative?: number;               // for turn systems
  status: TimedEffect[];             // buffs/debuffs on this member
  channels: MaintainedChannel[];     // active maintained songs/dances/singing

  // Optional: AI role tags, threat, etc.
  role?: "Tank"|"DPS"|"Healer"|"Support"|"Hybrid";
  threat?: number;
}

/* ========================= Party Container ========================= */

export const PARTY_MAX = 8;

export interface Party {
  id: string;
  name: string;
  members: Member[];           // length 1..8, includes the player
  leaderIndex: number;         // index of player (or party leader)
  encounterTimeMs: number;     // incremented by your combat loop
  // Party-wide toggles (formations, auras, etc.)
  formation?: string;
}

/* ========================= Resource Math (your latest dials) ========================= */
// MP = 5*WIS + 2*(L-1)
// HP = 2.5*(VIT + CON) + 5*(L-1)
// Stamina = 5*CON + 4*(L-1)

export const LV_MAX = 50;

export function maxMP(WIS:number, L:number){ return 5*WIS + 2*(L-1); }
export function maxHP(VIT:number, CON:number, L:number){ return 2.5*(VIT + CON) + 5*(L-1); }
export function maxStamina(CON:number, L:number){ return 5*CON + 4*(L-1); }

/** Recalculate maxes & clamp current values */
export function recomputeResources(m: Member): void {
  m.resources.HPMax = maxHP(m.attributes.VIT, m.attributes.CON, m.level);
  m.resources.MPMax = maxMP(m.attributes.WIS, m.level);
  m.resources.StaminaMax = maxStamina(m.attributes.CON, m.level);
  m.resources.HP = Math.min(m.resources.HP, m.resources.HPMax);
  m.resources.MP = Math.min(m.resources.MP, m.resources.MPMax);
  m.resources.Stamina = Math.min(m.resources.Stamina, m.resources.StaminaMax);
}

/** Level up a member and apply automatic attribute growth. */
export function levelUpMember(member: Member, levels = 1): void {
  if (!member.growth) {
    const g = initGrowth(member.startingAttributes, member.race?.toLowerCase() === "human");
    g.state.attrs = { ...member.attributes };
    g.state.choicePool = member.manualPool ?? 0;
    member.growth = { state: g.state, rates: g.perLevel.rates, choicePerLevel: g.perLevel.choicePerLevel };
  }
  for (let i = 0; i < levels; i++) {
    onLevelUp(member.growth.state, member.growth.rates, member.growth.choicePerLevel);
    member.level += 1;
  }
  member.attributes = { ...member.growth.state.attrs };
  member.manualPool = member.growth.state.choicePool;
  recomputeResources(member);
}

/* ========================= NPC proficiency policy ========================= */
/**
 * NPC allies do NOT progress proficiency. For any proficiency with value > 0,
 * they operate at the CAP for their level. This resolver is pluggable so you
 * can swap in your full cap math. A simple default is provided.
 */

export type CapResolver = (kind: ProficiencyKind, member: Member) => number;

/** Default cap: linear to 100 at LV_MAX (ignores stat-specific scaling). */
export const linearCapResolver: CapResolver = (_kind, member) => {
  // Level 1 → ~2, Level 50 → 100 (rounded)
  const cap = Math.round((member.level - 1) * (100 / (LV_MAX - 1)));
  return Math.max(1, Math.min(100, cap));
};

/** Apply NPC policy: set effective proficiency to cap if value>0. */
export function getEffectiveProficiency(
  member: Member,
  kind: ProficiencyKind,
  capResolver: CapResolver = linearCapResolver
): number {
  const block = member.proficiencies[kind];
  if (!block) return 0;
  const cap = capResolver(kind, member);
  if (member.isNPC) {
    return block.value > 0 ? cap : 0;
  }
  // Player: clamp to current cap, keep 2-dec value
  return Math.min(cap, Math.round(block.value * 100) / 100);
}

/* ========================= Manual Attribute Assignment (allies) ========================= */

export function allocateAllyAttributes(member: Member, spend: Partial<AttrBlock>): boolean {
  if (member.isPlayer) return false;        // player uses normal level-up flow elsewhere
  if (!member.controllable) return false;   // must be a controllable ally
  let needed = 0;
  (Object.keys(spend) as Attr[]).forEach(k => { needed += (spend[k] ?? 0); });
  if ((member.manualPool ?? 0) < needed) return false;

  (Object.keys(spend) as Attr[]).forEach(k => {
    const add = spend[k] ?? 0;
    if (add > 0) member.attributes[k] += add;
  });
  member.manualPool = (member.manualPool ?? 0) - needed;
  recomputeResources(member);
  return true;
}

/* ========================= Channels & Effects (post-stop model) ========================= */

/** Start or refresh a maintained channel (song/dance/singing). */
export function startChannel(
  party: Party,
  sourceId: string,
  channelId: string,
  createdEffects: TimedEffect[]
): void {
  const src = party.members.find(m => m.id === sourceId);
  if (!src) return;

  // mark effects as NOT counting down yet
  for (const e of createdEffects) {
    e.countingDown = (e.durationModel === "normal") ? true : false;
    e.startedAtMs = party.encounterTimeMs;
    src.status.push(e);
  }

  // upsert channel
  let ch = src.channels.find(c => c.id === channelId);
  if (!ch) {
    ch = { id: channelId, sourceMemberId: sourceId, effectIds: createdEffects.map(e=>e.id), active: true };
    src.channels.push(ch);
  } else {
    ch.active = true;
    // merge new effects
    for (const e of createdEffects) if (!ch.effectIds.includes(e.id)) ch.effectIds.push(e.id);
  }
}

/** Stop maintaining: switch linked effects to countdown mode. */
export function stopChannel(party: Party, sourceId: string, channelId: string): void {
  const src = party.members.find(m => m.id === sourceId);
  if (!src) return;
  const ch = src.channels.find(c => c.id === channelId);
  if (!ch) return;

  ch.active = false;
  // enable countdown for all linked effects with "post-stop"
  for (const effId of ch.effectIds) {
    const ef = src.status.find(s => s.id === effId);
    if (ef && ef.durationModel === "post-stop") {
      ef.countingDown = true;
      // reset start so remainingSec is authoritative going forward
      ef.startedAtMs = party.encounterTimeMs;
    }
  }
}

/** Advance encounter time and tick all effects. */
export function tickParty(party: Party, deltaMs: number): void {
  party.encounterTimeMs += deltaMs;
  const deltaSec = deltaMs / 1000;

  for (const m of party.members) {
    // Any channels still active? Their effects stay “frozen” (no countdown).
    const lockedIds = new Set<string>();
    for (const ch of m.channels) {
      if (ch.active) for (const id of ch.effectIds) lockedIds.add(id);
    }

    // Tick timed effects
    for (const eff of m.status) {
      if (!eff.countingDown || lockedIds.has(eff.id)) continue;
      eff.remainingSec = Math.max(0, eff.remainingSec - deltaSec);
    }

    // Auto-remove expired
    m.status = m.status.filter(e => e.remainingSec > 0);
  }
}

/* ========================= Party Helpers ========================= */

export function createParty(id: string, name: string, leader: Member): Party {
  if (!leader) throw new Error("Leader (player) required");
  return { id, name, members: [leader], leaderIndex: 0, encounterTimeMs: 0 };
}

export function addMember(party: Party, member: Member): boolean {
  if (party.members.length >= PARTY_MAX) return false;
  party.members.push(member);
  return true;
}

export function removeMember(party: Party, memberId: string): boolean {
  const idx = party.members.findIndex(m => m.id === memberId);
  if (idx < 0) return false;
  party.members.splice(idx, 1);
  if (party.leaderIndex >= party.members.length) party.leaderIndex = 0;
  return true;
}

/* ========================= Minimal Member Factory ========================= */

export function makeMember(params: {
  id: string; name: string; level: number; race?: string;
  isPlayer?: boolean; isNPC?: boolean; controllable?: boolean;
  startingAttributes: AttrBlock; currentAttributes?: Partial<AttrBlock>;
  proficiencies?: Proficiencies; manualPool?: number; equipment?: Equipment;
  role?: Member["role"];
}): Member {
  const isPlayer = !!params.isPlayer;
  const isNPC = params.isNPC ?? !isPlayer;
  const controllable = params.controllable ?? isPlayer;

  const base = params.startingAttributes;
  const cur: AttrBlock = { ...base, ...params.currentAttributes };

  const growthInit = initGrowth(base, params.race?.toLowerCase() === "human");
  growthInit.state.attrs = { ...cur };
  growthInit.state.choicePool = params.manualPool ?? 0;

  const member: Member = {
    id: params.id, name: params.name, level: params.level, race: params.race,
    faction: "playerParty", isPlayer, isNPC, controllable,
    attributes: cur, startingAttributes: base, manualPool: params.manualPool ?? 0,
    growth: { state: growthInit.state, rates: growthInit.perLevel.rates, choicePerLevel: growthInit.perLevel.choicePerLevel },
    resources: { HP:0, MP:0, Stamina:0, HPMax:0, MPMax:0, StaminaMax:0 },
    proficiencies: params.proficiencies ?? {},
    equipment: params.equipment ?? createEmptyEquipment(),
    alive: true,
    status: [],
    channels: [],
    role: params.role,
    threat: 0
  };
  // initialize resources to full
  recomputeResources(member);
  member.resources.HP = member.resources.HPMax;
  member.resources.MP = member.resources.MPMax;
  member.resources.Stamina = member.resources.StaminaMax;
  return member;
}

/* ========================= Example Usage =========================
import { createParty, makeMember, addMember, getEffectiveProficiency } from "./party";

// 1) Create player
const human10s: AttrBlock = { STR:10,DEX:10,CON:10,VIT:10,AGI:10,INT:10,WIS:10,CHA:10 };
const player = makeMember({
  id:"P1", name:"Player", level:10, race:"Human",
  isPlayer:true, isNPC:false,
  startingAttributes: human10s,
  proficiencies: { Instrument:{ value:22.5, cap:35 }, Element_Fire:{ value:18.2, cap:30 } },
  role:"Support"
});

// 2) Create an ally NPC (no progression; capped in combat if >0)
const elfStart: AttrBlock = { STR:6,DEX:14,CON:6,VIT:6,AGI:14,INT:14,WIS:10,CHA:10 };
const ally = makeMember({
  id:"A1", name:"Lyra", level:12, race:"Elf",
  isNPC:true, controllable:true,
  startingAttributes: elfStart,
  currentAttributes:{ WIS:12, AGI:15 },  // manual allocations applied later too
  proficiencies: { Singing:{ value:1, cap:0 }, Dance:{ value:1, cap:0 }, Element_Wind:{ value:1, cap:0 } },
  manualPool: 5,
  role:"Support"
});

// 3) Party and add ally
const party = createParty("PT1", "Alpha Squad", player);
addMember(party, ally);

// 4) NPC effective proficiency (linear cap by default)
const eff = getEffectiveProficiency(ally, "Singing"); // returns cap for level since value>0

// 5) Start & stop a maintained channel (song/dance/singing):
// startChannel(party, player.id, "song:SwiftStep", [ { ...TimedEffect } ]);
// stopChannel(party, player.id, "song:SwiftStep");
------------------------------------------------------------------- */
