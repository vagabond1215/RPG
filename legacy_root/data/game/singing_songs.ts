// singing_songs.ts — Singing songs with unique elemental auras (TS/JS)

/* ========================= Types & Helpers ========================= */

export type Element =
  | "Stone" | "Water" | "Wind" | "Fire"
  | "Ice"   | "Lightning" | "Dark" | "Light";

export type Side = "ally" | "enemy" | "party";
export type Target = "ST" | "AoE";
export type Attr = "STR"|"DEX"|"CON"|"VIT"|"AGI"|"INT"|"WIS"|"CHA";

export type SongKind =
  | "buff" | "regen" | "debuff" | "dot" | "control"
  | "aura" | "ultimate" | "elementalOffense" | "elementalUtility";

export interface SongScale {
  m0: number;   // magnitude at unlock (pct points or as documented)
  m100: number; // magnitude at P=100
  cap?: number;
  unit?: string;
}

export interface Song {
  id: string;
  name: string;
  category: "control" | "buff" | "elemental" | "ultimate";
  kind: SongKind;
  element?: Element;
  unlock: number;
  target: Target;
  side: Side;
  baseDurationSec: number;
  scale: SongScale;
  tags?: string[];
  keyAttribute: Attr;
  maintenance: { maintainable: true; durationCountdown: "afterStop" };
}

/** Effect payloads (compatible with your spell/instrument shape, plus 'aura') */
export type EffectPayload =
  | { kind:"buff";     modifiers: Record<string, number>; durationModel:"post-stop" }
  | { kind:"debuff";   modifiers: Record<string, number>; durationModel:"post-stop" }
  | { kind:"dot";      per5sPct:number; resource:"HP"|"MP"|"Stamina"; durationModel:"post-stop" }
  | { kind:"regen";    per5sPct:number; resource:"HP"|"MP"|"Stamina"; durationModel:"post-stop" }
  | { kind:"control";  controlType:"silence"|"confuse"|"root"|"fear"; durationModel:"post-stop" }
  | { kind:"aura";     data: AuraSpec; durationModel:"post-stop" }
  | { kind:"ultimate"; allStatsPct:number; hastePct:number; durationModel:"post-stop" };

export interface AuraSpec {
  /** periodic pulse (AoE) — perPulsePct usually % of Attack Power or Max HP; keep as % points */
  pulse?: { periodSec:number; element?:Element; perPulsePct:number; tags?:string[] };
  /** event triggers (proc-like) */
  onEvent?: Array<{
    when: "allyHit"|"allyCrit"|"enemyHitAlly"|"allyHeal"|"allyKill";
    chancePct: number;
    apply:
      | { type:"buff";  modifiers: Record<string, number>; durationSec:number }
      | { type:"debuff";modifiers: Record<string, number>; durationSec:number }
      | { type:"dot";   element?:Element; per5sPct:number; resource:"HP"|"MP"|"Stamina"; durationSec:number }
      | { type:"control"; controlType:"stun"|"paralyze"|"slow"|"knockback"; durationSec:number }
      | { type:"heal";  healPct:number }
      | { type:"resource"; mpPct?:number; staminaPct?:number };
  }>;
}

/* ========================= Scaling, variance, duration ========================= */

const clamp01 = (x:number)=>Math.max(0,Math.min(1,x));
const rI = (x:number)=>Math.floor(x);

/** Attribute variance (same philosophy as instruments/dances) */
export const VARIANCE_ALPHA = 0.35;
/** duration = base * (1 + (P - unlock)/100); countdown starts after singer stops */
export function computeSongDurationSec(song: Song, P:number){ return rI(song.baseDurationSec * (1 + Math.max(0,(P-song.unlock))/100)); }
/** linear interpolate unlock→100 */
export function interpolateMagnitude(song: Song, P:number){
  if (song.kind==="ultimate") return Math.round(P/10); // % points
  const t = clamp01((P - song.unlock)/(100 - song.unlock || 1));
  const raw = song.scale.m0 + (song.scale.m100 - song.scale.m0)*t;
  return (song.scale.cap!=null) ? Math.min(raw, song.scale.cap) : raw;
}
export function applyVariance(basePct:number, keyAttr:number){ return basePct * (1 + VARIANCE_ALPHA * ((keyAttr - 10)/10)); }

/* ========================= Core Singing Songs ========================= */

const CONTROL_DEBUFF_DOT: Omit<Song,"id">[] = [
  { name:"Ballad of Blight",     category:"control", kind:"dot",    target:"ST",  side:"enemy", unlock:10, baseDurationSec:20, scale:{ m0:2,  m100:5,  unit:"pct" }, tags:["HP_DOT","per5s"], keyAttribute:"STR", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Canticle of Cripple",  category:"control", kind:"debuff", target:"ST",  side:"enemy", unlock:15, baseDurationSec:20, scale:{ m0:-10,m100:-20, unit:"pct" }, tags:["MOVE_SPEED_DOWN"], keyAttribute:"AGI", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Dirge of Dread",       category:"control", kind:"debuff", target:"AoE", side:"enemy", unlock:20, baseDurationSec:20, scale:{ m0:-8, m100:-16, unit:"pct" }, tags:["CRIT_CHANCE_DOWN"], keyAttribute:"CHA", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Lament of Weakness",   category:"control", kind:"debuff", target:"ST",  side:"enemy", unlock:25, baseDurationSec:20, scale:{ m0:-10,m100:-18, unit:"pct" }, tags:["ATK_DOWN"], keyAttribute:"STR", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Madrigal of Misrule",  category:"control", kind:"control",target:"AoE", side:"enemy", unlock:30, baseDurationSec:15, scale:{ m0:0,  m100:0 },             tags:["CONFUSE"], keyAttribute:"CHA", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Requiem of Ruin",      category:"control", kind:"dot",    target:"ST",  side:"enemy", unlock:40, baseDurationSec:20, scale:{ m0:2,  m100:4,  unit:"pct" }, tags:["MP_DOT","per5s"], keyAttribute:"INT", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Chant of Chains",      category:"control", kind:"control",target:"ST",  side:"enemy", unlock:50, baseDurationSec:12, scale:{ m0:0,  m100:0 },             tags:["ROOT"], keyAttribute:"AGI", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Hymn of Havoc",        category:"control", kind:"debuff", target:"AoE", side:"enemy", unlock:60, baseDurationSec:20, scale:{ m0:+10,m100:+18, unit:"pct" }, tags:["DMG_TAKEN_UP"], keyAttribute:"STR", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Nocturne of Silence",  category:"control", kind:"control",target:"ST",  side:"enemy", unlock:70, baseDurationSec:10, scale:{ m0:0,  m100:0 },             tags:["SILENCE"], keyAttribute:"CHA", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Elegy of Erosion",     category:"control", kind:"debuff", target:"AoE", side:"enemy", unlock:80, baseDurationSec:20, scale:{ m0:-10,m100:-20, unit:"pct" }, tags:["ALL_STATS_DOWN"], keyAttribute:"VIT", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
];

const BUFF_REGEN: Omit<Song,"id">[] = [
  { name:"Anthem of Valor",      category:"buff", kind:"buff",  target:"AoE", side:"ally", unlock:10, baseDurationSec:20, scale:{ m0:+5, m100:+10, unit:"pct" }, tags:["ATK_UP"], keyAttribute:"STR", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Chorus of Celerity",   category:"buff", kind:"buff",  target:"AoE", side:"ally", unlock:15, baseDurationSec:20, scale:{ m0:+5, m100:+10, unit:"pct" }, tags:["MOVE_SPEED_UP"], keyAttribute:"AGI", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Hymn of Mending",      category:"buff", kind:"regen", target:"AoE", side:"ally", unlock:20, baseDurationSec:20, scale:{ m0:+2, m100:+5,  unit:"pct" }, tags:["HP_REGEN","per5s"], keyAttribute:"VIT", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Psalm of Bulwarks",    category:"buff", kind:"buff",  target:"AoE", side:"ally", unlock:25, baseDurationSec:20, scale:{ m0:+8, m100:+16, unit:"pct" }, tags:["DEF_UP"], keyAttribute:"CON", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Litany of Aegis",      category:"buff", kind:"buff",  target:"AoE", side:"ally", unlock:30, baseDurationSec:20, scale:{ m0:-10,m100:-20, unit:"pct" }, tags:["DMG_TAKEN_DOWN"], keyAttribute:"VIT", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Refrain of Renewal",   category:"buff", kind:"regen", target:"AoE", side:"ally", unlock:40, baseDurationSec:20, scale:{ m0:+2, m100:+5,  unit:"pct" }, tags:["MP_REGEN","per5s"], keyAttribute:"WIS", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Cadence of Endurance", category:"buff", kind:"regen", target:"AoE", side:"ally", unlock:50, baseDurationSec:20, scale:{ m0:+2, m100:+5,  unit:"pct" }, tags:["STAM_REGEN","per5s"], keyAttribute:"CON", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Gloria in Armis",      category:"buff", kind:"buff",  target:"AoE", side:"ally", unlock:60, baseDurationSec:20, scale:{ m0:+5, m100:+10, unit:"pct" }, tags:["ALL_STATS_UP"], keyAttribute:"CHA", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Verse of Vigilance",   category:"buff", kind:"buff",  target:"AoE", side:"ally", unlock:70, baseDurationSec:20, scale:{ m0:+15,m100:+25, unit:"pct" }, tags:["CONTROL_RESIST_UP"], keyAttribute:"WIS", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
  { name:"Shielding Cantata",    category:"buff", kind:"buff",  target:"AoE", side:"ally", unlock:80, baseDurationSec:20, scale:{ m0:+10,m100:+18, unit:"pct" }, tags:["HP_SHIELD_PCTMAX"], keyAttribute:"CON", maintenance:{maintainable:true,durationCountdown:"afterStop"} },
];

/* ========================= Elemental Songs (unique mechanics) ========================= */
/** @33 — Elemental Overtures: periodic **pulses** with unique side effects (not resist/weakness/infusion/shield) */
const ELEMENTAL_OVERTURES_33: Omit<Song,"id">[] = [
  {
    name:"Stone Overture", category:"elemental", kind:"aura", element:"Stone",
    target:"AoE", side:"ally", unlock:33, baseDurationSec:20,
    scale:{ m0:+4, m100:+8, unit:"pct" }, // per-pulse % dmg coeff
    tags:["PULSE_STONE","STAGGER_STACK"],
    keyAttribute:"INT",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Water Overture", category:"elemental", kind:"aura", element:"Water",
    target:"AoE", side:"ally", unlock:33, baseDurationSec:20,
    scale:{ m0:+3, m100:+7, unit:"pct" },
    tags:["PULSE_WATER","SOAKED"], // soaked → future Lightning/Freeze interact more
    keyAttribute:"INT",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Wind Overture", category:"elemental", kind:"aura", element:"Wind",
    target:"AoE", side:"ally", unlock:33, baseDurationSec:20,
    scale:{ m0:+3, m100:+6, unit:"pct" },
    tags:["PULSE_WIND","PROJECTILE_VULN"], // enemies suffer -proj evade briefly
    keyAttribute:"INT",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Fire Overture", category:"elemental", kind:"aura", element:"Fire",
    target:"AoE", side:"ally", unlock:33, baseDurationSec:20,
    scale:{ m0:+3, m100:+7, unit:"pct" },
    tags:["PULSE_FIRE","IGNITE_STACK"], // small ignite stacks on pulses
    keyAttribute:"INT",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Ice Overture", category:"elemental", kind:"aura", element:"Ice",
    target:"AoE", side:"ally", unlock:33, baseDurationSec:20,
    scale:{ m0:+3, m100:+6, unit:"pct" },
    tags:["PULSE_ICE","BRITTLE"], // increases shatter damage taken
    keyAttribute:"INT",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Lightning Overture", category:"elemental", kind:"aura", element:"Lightning",
    target:"AoE", side:"ally", unlock:33, baseDurationSec:20,
    scale:{ m0:+3, m100:+7, unit:"pct" },
    tags:["PULSE_THUNDER","STATIC_CHARGE"], // chance to arc chain on pulses
    keyAttribute:"INT",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Dark Overture", category:"elemental", kind:"aura", element:"Dark",
    target:"AoE", side:"ally", unlock:33, baseDurationSec:20,
    scale:{ m0:+3, m100:+6, unit:"pct" },
    tags:["PULSE_DARK","DREAD"], // lowers enemy crit chance & healing received briefly
    keyAttribute:"INT",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Light Overture", category:"elemental", kind:"aura", element:"Light",
    target:"AoE", side:"ally", unlock:33, baseDurationSec:20,
    scale:{ m0:+3, m100:+6, unit:"pct" },
    tags:["PULSE_LIGHT","REVEAL"], // reveals stealth; allies gain +accuracy briefly
    keyAttribute:"INT",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
];

/** @66 — Elemental Anthems: unique utility auras (not shields/resist/infusion) */
const ELEMENTAL_ANTHEMS_66: Omit<Song,"id">[] = [
  {
    name:"Seismic Anthem", category:"elemental", kind:"aura", element:"Stone",
    target:"AoE", side:"ally", unlock:66, baseDurationSec:20,
    scale:{ m0:+10, m100:+18, unit:"pct" }, // drives poise/unstoppable strength
    tags:["POISE_UP","UNSTOPPABLE_WINDOWS"], keyAttribute:"CON",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Tidal Anthem", category:"elemental", kind:"aura", element:"Water",
    target:"AoE", side:"ally", unlock:66, baseDurationSec:20,
    scale:{ m0:+1, m100:+2, unit:"pct" }, // cleanse/heal cadence per pulse
    tags:["PERIODIC_CLEANSE","HEAL_PULSE"], keyAttribute:"WIS",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Gale Anthem", category:"elemental", kind:"aura", element:"Wind",
    target:"AoE", side:"ally", unlock:66, baseDurationSec:20,
    scale:{ m0:+8, m100:+15, unit:"pct" }, // projectile speed/soft homing + dodge windows
    tags:["PROJECTILE_SPEED","AUTO_DODGE_WINDOW"], keyAttribute:"AGI",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Inferno Anthem", category:"elemental", kind:"aura", element:"Fire",
    target:"AoE", side:"ally", unlock:66, baseDurationSec:20,
    scale:{ m0:+6, m100:+12, unit:"pct" }, // overkill → haste stacks
    tags:["OVERKILL_TO_HASTE"], keyAttribute:"STR",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Glacial Anthem", category:"elemental", kind:"aura", element:"Ice",
    target:"AoE", side:"ally", unlock:66, baseDurationSec:20,
    scale:{ m0:+4, m100:+8, unit:"pct" }, // global minor cooldown reduction pulses
    tags:["COOLDOWN_REDUCTION"], keyAttribute:"INT",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Storm Anthem", category:"elemental", kind:"aura", element:"Lightning",
    target:"AoE", side:"ally", unlock:66, baseDurationSec:20,
    scale:{ m0:+2, m100:+4, unit:"pct" }, // crits → MP/Stamina battery
    tags:["CRIT_RESOURCE_BATTERY"], keyAttribute:"INT",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Umbral Anthem", category:"elemental", kind:"aura", element:"Dark",
    target:"AoE", side:"ally", unlock:66, baseDurationSec:20,
    scale:{ m0:+6, m100:+12, unit:"pct" }, // threat down; on-crit weaken enemy damage
    tags:["THREAT_DOWN","ONCRIT_WEAKEN"], keyAttribute:"CHA",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
  {
    name:"Radiant Anthem", category:"elemental", kind:"aura", element:"Light",
    target:"AoE", side:"ally", unlock:66, baseDurationSec:20,
    scale:{ m0:+4, m100:+8, unit:"pct" }, // overheal → radiant echo AoE dmg + micro-shield
    tags:["OVERHEAL_TO_ECHO","MICRO_SHIELD"], keyAttribute:"WIS",
    maintenance:{maintainable:true,durationCountdown:"afterStop"}
  },
];

/* ========================= Ultimate ========================= */

const ULTIMATE: Omit<Song,"id"> = {
  name:"Grand Symphony", category:"ultimate", kind:"ultimate",
  target:"AoE", side:"ally", unlock:100, baseDurationSec:20,
  scale:{ m0:0, m100:0, unit:"pct" },
  tags:["ALL_STATS_UP","HASTE"],
  keyAttribute:"CHA",
  maintenance:{maintainable:true,durationCountdown:"afterStop"}
};

/* ========================= Build List ========================= */

function makeId(prefix:string,i:number){ return `${prefix}:${i.toString().padStart(2,"0")}`; }

export const SINGING_SONGS: Song[] = [
  ...CONTROL_DEBUFF_DOT.map((s,i)=>({ id:makeId("SING_CTRL",i+1), ...s })),
  ...BUFF_REGEN.map((s,i)=>({ id:makeId("SING_BUFF",i+1), ...s })),
  ...ELEMENTAL_OVERTURES_33.map((s,i)=>({ id:makeId("SING_ELEM33",i+1), ...s })),
  ...ELEMENTAL_ANTHEMS_66.map((s,i)=>({ id:makeId("SING_ELEM66",i+1), ...s })),
  { id:"SING_ULT:01", ...ULTIMATE }
];

/* ========================= Resolver ========================= */

export interface ResolvedEffect {
  durationSec: number;
  magnitude: number;   // main % magnitude after variance
  per5sPct?: number;
  effect: EffectPayload;
}

export function resolveSingingEffect(
  song: Song,
  proficiency: number,
  singerKeyAttrValue: number
): ResolvedEffect {
  const baseMag = interpolateMagnitude(song, proficiency);
  const mag = applyVariance(baseMag, singerKeyAttrValue);
  const durationSec = computeSongDurationSec(song, proficiency);
  const post = "post-stop" as const;

  // Ultimate: +⌈P/10⌉% all stats + +⌈P/20⌉% haste
  if (song.kind === "ultimate") {
    const allStatsPct = Math.round(proficiency/10);
    const hastePct    = Math.round(proficiency/20);
    return { durationSec, magnitude: allStatsPct, effect:{ kind:"ultimate", allStatsPct, hastePct, durationModel: post } };
  }

  // Standard conversions for core buffs/debuffs/dots/regen/control
  const modsFromTags = (sign:1|-1) => {
    const m: Record<string, number> = {};
    for (const t of song.tags||[]) {
      if (t==="ATK_UP") m.ATK_PCT = mag;
      if (t==="DEF_UP") m.DEF_PCT = mag;
      if (t==="ALL_STATS_UP") m.ALL_STATS_PCT = mag;
      if (t==="MOVE_SPEED_UP") m.MOVE_SPEED_PCT = mag;
      if (t==="CONTROL_RESIST_UP") m.CONTROL_RESIST_PCT = mag;
      if (t==="HP_SHIELD_PCTMAX") m.HP_SHIELD_PCTMAX = mag;
      if (t==="DMG_TAKEN_DOWN") m.DMG_TAKEN_PCT = -Math.abs(mag);
      if (t==="DMG_TAKEN_UP") m.DMG_TAKEN_PCT = +Math.abs(mag);
      if (t==="ATK_DOWN") m.ATK_PCT = -Math.abs(mag);
      if (t==="CRIT_CHANCE_DOWN") m.CRIT_CHANCE_PCT = -Math.abs(mag);
      if (t==="ALL_STATS_DOWN") m.ALL_STATS_PCT = -Math.abs(mag);
      if (t==="MOVE_SPEED_DOWN") m.MOVE_SPEED_PCT = -Math.abs(mag);
    }
    Object.keys(m).forEach(k=>m[k]=sign*m[k]);
    return m;
  };

  if (song.kind==="regen") {
    const res = song.tags?.includes("HP_REGEN")?"HP":song.tags?.includes("MP_REGEN")?"MP":"Stamina";
    return { durationSec, magnitude: mag, per5sPct: mag, effect:{ kind:"regen", per5sPct:mag, resource:res, durationModel: post } };
  }
  if (song.kind==="dot") {
    const res = song.tags?.includes("MP_DOT")?"MP":"HP";
    return { durationSec, magnitude: mag, per5sPct: mag, effect:{ kind:"dot", per5sPct:mag, resource:res, durationModel: post } };
  }
  if (song.kind==="control") {
    const type = song.tags?.includes("SILENCE")?"silence":song.tags?.includes("ROOT")?"root":song.tags?.includes("CONFUSE")?"confuse":"fear";
    return { durationSec, magnitude: mag, effect:{ kind:"control", controlType:type, durationModel: post } };
  }
  if (song.category==="control" && song.kind==="debuff") {
    return { durationSec, magnitude: mag, effect:{ kind:"debuff", modifiers: modsFromTags(+1), durationModel: post } };
  }
  if (song.category==="buff" && song.kind==="buff") {
    return { durationSec, magnitude: mag, effect:{ kind:"buff", modifiers: modsFromTags(+1), durationModel: post } };
  }

  // Elemental auras (unique mechanics)
  if (song.kind==="aura" || song.kind==="elementalOffense" || song.kind==="elementalUtility") {
    // Build default pulse every 5s using 'mag' as % per pulse
    const pulse = song.tags?.some(t=>t.startsWith("PULSE_"))
      ? { periodSec: 5, element: song.element, perPulsePct: mag, tags: song.tags }
      : undefined;

    const onEvent: AuraSpec["onEvent"] = [];

    // @33 overtones: attach specific mini-effects
    if (song.tags?.includes("STAGGER_STACK")) {
      onEvent.push({ when:"allyHit", chancePct: 25, apply:{ type:"debuff", modifiers:{ STAGGER_SUSCEPT_PCT: +mag }, durationSec: 5 }});
    }
    if (song.tags?.includes("SOAKED")) {
      onEvent.push({ when:"allyHit", chancePct: 25, apply:{ type:"debuff", modifiers:{ SOAKED:true as unknown as number }, durationSec: 6 }});
    }
    if (song.tags?.includes("PROJECTILE_VULN")) {
      onEvent.push({ when:"allyHit", chancePct: 25, apply:{ type:"debuff", modifiers:{ PROJECTILE_EVASION_DOWN_PCT: +mag }, durationSec: 6 }});
    }
    if (song.tags?.includes("IGNITE_STACK")) {
      onEvent.push({ when:"allyHit", chancePct: 25, apply:{ type:"dot", element:"Fire", per5sPct: mag/2, resource:"HP", durationSec: 10 }});
    }
    if (song.tags?.includes("BRITTLE")) {
      onEvent.push({ when:"allyHit", chancePct: 25, apply:{ type:"debuff", modifiers:{ SHATTER_DAMAGE_TAKEN_PCT: +mag }, durationSec: 8 }});
    }
    if (song.tags?.includes("STATIC_CHARGE")) {
      onEvent.push({ when:"allyHit", chancePct: 20, apply:{ type:"control", controlType:"stun", durationSec: 1 }});
    }
    if (song.tags?.includes("DREAD")) {
      onEvent.push({ when:"allyHit", chancePct: 25, apply:{ type:"debuff", modifiers:{ ENEMY_CRIT_CHANCE_PCT: -mag, HEALING_RECEIVED_PCT: -mag/2 }, durationSec: 6 }});
    }
    if (song.tags?.includes("REVEAL")) {
      onEvent.push({ when:"allyHit", chancePct: 35, apply:{ type:"debuff", modifiers:{ REVEALED:true as unknown as number, ACCURACY_PCT: +mag/2 }, durationSec: 8 }});
    }

    // @66 anthems: utility auras
    if (song.tags?.includes("POISE_UP")) {
      onEvent.push({ when:"enemyHitAlly", chancePct: 100, apply:{ type:"buff", modifiers:{ POISE_PCT: +mag }, durationSec: 3 }});
    }
    if (song.tags?.includes("UNSTOPPABLE_WINDOWS")) {
      onEvent.push({ when:"enemyHitAlly", chancePct: 15, apply:{ type:"buff", modifiers:{ UNSTOPPABLE:true as unknown as number }, durationSec: 1 }});
    }
    if (song.tags?.includes("PERIODIC_CLEANSE")) {
      onEvent.push({ when:"allyHeal", chancePct: 100, apply:{ type:"buff", modifiers:{ CLEANSE_ONE:true as unknown as number }, durationSec: 0 }});
    }
    if (song.tags?.includes("HEAL_PULSE")) {
      onEvent.push({ when:"allyHeal", chancePct: 100, apply:{ type:"heal", healPct: mag }});
    }
    if (song.tags?.includes("PROJECTILE_SPEED")) {
      onEvent.push({ when:"allyHit", chancePct: 100, apply:{ type:"buff", modifiers:{ PROJECTILE_SPEED_PCT: +mag }, durationSec: 6 }});
    }
    if (song.tags?.includes("AUTO_DODGE_WINDOW")) {
      onEvent.push({ when:"enemyHitAlly", chancePct: 12, apply:{ type:"control", controlType:"knockback", durationSec: 0.1 }});
    }
    if (song.tags?.includes("OVERKILL_TO_HASTE")) {
      onEvent.push({ when:"allyKill", chancePct: 100, apply:{ type:"buff", modifiers:{ HASTE_PCT: Math.max(1, Math.round(mag/2)) }, durationSec: 6 }});
    }
    if (song.tags?.includes("COOLDOWN_REDUCTION")) {
      onEvent.push({ when:"allyHit", chancePct: 100, apply:{ type:"buff", modifiers:{ CDR_PCT: +mag }, durationSec: 5 }});
    }
    if (song.tags?.includes("CRIT_RESOURCE_BATTERY")) {
      onEvent.push({ when:"allyCrit", chancePct: 100, apply:{ type:"resource", mpPct: mag/2, staminaPct: mag/2 }});
    }
    if (song.tags?.includes("THREAT_DOWN")) {
      onEvent.push({ when:"allyHit", chancePct: 100, apply:{ type:"buff", modifiers:{ THREAT_GEN_PCT: -mag }, durationSec: 6 }});
    }
    if (song.tags?.includes("ONCRIT_WEAKEN")) {
      onEvent.push({ when:"allyCrit", chancePct: 35, apply:{ type:"debuff", modifiers:{ ENEMY_DAMAGE_DONE_PCT: -mag }, durationSec: 5 }});
    }
    if (song.tags?.includes("OVERHEAL_TO_ECHO")) {
      onEvent.push({ when:"allyHeal", chancePct: 100, apply:{ type:"dot", element:"Light", per5sPct: mag/2, resource:"HP", durationSec: 6 }});
    }
    if (song.tags?.includes("MICRO_SHIELD")) {
      onEvent.push({ when:"allyHeal", chancePct: 100, apply:{ type:"buff", modifiers:{ HP_SHIELD_PCTMAX: mag/2 }, durationSec: 6 }});
    }

    const effect: EffectPayload = { kind:"aura", data:{ pulse, onEvent }, durationModel: post };
    return { durationSec, magnitude: mag, effect };
  }

  // Fallback buff/debuff route (shouldn’t hit for defined entries)
  if (song.side==="ally") return { durationSec, magnitude: mag, effect:{ kind:"buff",   modifiers: modsFromTags(+1), durationModel: post } };
  return                          { durationSec, magnitude: mag, effect:{ kind:"debuff", modifiers: modsFromTags(+1), durationModel: post } };
}

