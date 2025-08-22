// timing_engine.ts — unified clock, scheduler, cooldowns, channels, periodic effects, upkeep drains.

/* ========================= Imports & Reuses =========================
   These are optional imports from your earlier modules. If you use plain JS,
   copy the needed types/guards or remove the imports and adapt signatures.
*/
// import { Party, Member, TimedEffect, startChannel, stopChannel, recomputeResources } from "./party";
// import { resolveSummon, SummonDef, SummonResolved } from "./summons";

/* ========================= Core Types ========================= */

export type Ms = number;
export type Id = string;

export type Faction = "playerParty" | "enemy" | "neutral";
export type DurationModel = "post-stop" | "normal";

export interface TimedEffect {
  id: Id;
  sourceMemberId: Id;
  kind: "buff"|"debuff"|"dot"|"regen"|"control"|"resist"|"weakness"|"shield"|"aura"|"ultimate";
  element?: string;
  payload: Record<string, unknown>;
  durationModel: DurationModel; // "post-stop" effects don't tick while channel up
  remainingSec: number;
  countingDown: boolean;        // if false, time is frozen (e.g., during channel)
  startedAtMs: Ms;
  // Optional periodic pulse spec (e.g., DoT/regens per 5s, singing elemental pulses)
  periodic?: { periodMs: Ms; accumMs?: Ms; tag?: string };
}

export interface MaintainedChannel {
  id: Id;                         // "song:Swift Step", "dance:Stone Ward", "summon:Stone"
  sourceMemberId: Id;
  effectIds: Id[];                // effects frozen by this channel
  active: boolean;                // true while maintaining (no countdown for post-stop)
  upkeep?: { mpPer5s?: number; staminaPer5s?: number; hpPer5s?: number; accumMs?: Ms };
}

export interface CooldownEntry {
  actionId: Id;                   // skill/spell id
  endsAtMs: Ms;
}

export interface CastState {
  casting: boolean;
  actionId?: Id;
  casterId?: Id;
  targetIds?: Id[];
  castTimeMs?: Ms;
  startedAtMs?: Ms;
  // For channels: if action becomes a channel, we open a MaintainedChannel on completion
  willOpenChannelId?: Id;
}

export interface ActorState {
  id: Id;                         // Member id
  faction: Faction;
  alive: boolean;
  // Cooldowns & GCD
  gcdEndsAtMs: Ms;
  cds: Record<Id, CooldownEntry>;
  // Channels the actor is maintaining
  channels: Record<Id, MaintainedChannel>;
  // Active cast (if any)
  cast: CastState;
  // Effects currently on the actor (buffs/debuffs, etc.)
  effects: Record<Id, TimedEffect>;
}

export interface PartyLike {
  id: string;
  name: string;
  members: { id: Id; faction: Faction; alive: boolean; resources: {
    HP: number; MP: number; Stamina: number; HPMax: number; MPMax: number; StaminaMax: number;
  }}[];
  // Optional: if you have recomputeResources, you can call it on max changes
}

export type ContextEvent =
  | { type:"tick"; dtMs: Ms }
  | { type:"castComplete"; casterId:Id; actionId:Id; targetIds:Id[] }
  | { type:"channelStart"; sourceId:Id; channelId:Id }
  | { type:"channelStop"; sourceId:Id; channelId:Id }
  | { type:"effectPulse"; ownerId:Id; effectId:Id; tag?:string }
  | { type:"allyHit"; sourceId:Id; targetId:Id; isCrit?:boolean }
  | { type:"allyCrit"; sourceId:Id; targetId:Id }
  | { type:"enemyHitAlly"; sourceId:Id; targetId:Id }
  | { type:"allyHeal"; sourceId:Id; targetId:Id; amountPct:number }
  | { type:"allyKill"; sourceId:Id; targetId:Id };

/* ========================= Clock & Scheduler ========================= */

export class CombatClock {
  now: Ms = 0;
  advance(dtMs: Ms) { this.now += dtMs; }
}

type TimerCb = () => void;
interface Timer { id: Id; atMs: Ms; cb: TimerCb; }

export class Timeline {
  private timers: Timer[] = [];
  schedule(id: Id, atMs: Ms, cb: TimerCb) {
    this.timers.push({ id, atMs, cb }); this.timers.sort((a,b)=>a.atMs-b.atMs);
  }
  cancel(id: Id) { this.timers = this.timers.filter(t=>t.id!==id); }
  flush(now: Ms) {
    while (this.timers.length && this.timers[0].atMs <= now) {
      const t = this.timers.shift()!; t.cb();
    }
  }
}

/* ========================= Event Bus ========================= */

type Listener = (e: ContextEvent) => void;
export class EventBus {
  private listeners: Listener[] = [];
  on(l: Listener){ this.listeners.push(l); }
  emit(e: ContextEvent){ for(const l of this.listeners) l(e); }
}

/* ========================= Engine ========================= */

export interface EngineConfig {
  gcdMs: Ms;                       // global cooldown length for instant skills
  dotRegenPeriodMs: Ms;            // standard DoT/Regen pulse (e.g., 5000)
  auraPulseDefaultMs: Ms;          // default singing/dance aura pulse interval
  upkeepTickMs: Ms;                // MP/Stamina/HP upkeep drain pulse
}

export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  gcdMs: 1000,
  dotRegenPeriodMs: 5000,
  auraPulseDefaultMs: 5000,
  upkeepTickMs: 5000,
};

export class TimingEngine {
  readonly clock = new CombatClock();
  readonly timeline = new Timeline();
  readonly bus = new EventBus();
  readonly cfg: EngineConfig;

  // Actor registry
  private actors: Record<Id, ActorState> = {};

  constructor(cfg: Partial<EngineConfig> = {}) {
    this.cfg = { ...DEFAULT_ENGINE_CONFIG, ...cfg };
  }

  /* ---------- Actor lifecycle ---------- */

  upsertActor(a: ActorState) { this.actors[a.id] = a; }
  getActor(id: Id) { return this.actors[id]; }
  allActors() { return Object.values(this.actors); }

  /* ---------- Cooldowns & Casting ---------- */

  isOnCooldown(actorId: Id, actionId: Id) {
    const a = this.getActor(actorId); if (!a) return false;
    const cd = a.cds[actionId]; return !!cd && cd.endsAtMs > this.clock.now;
  }

  startCast(actorId: Id, actionId: Id, targetIds: Id[], castTimeMs: Ms, gcd?: Ms, willOpenChannelId?: Id): boolean {
    const a = this.getActor(actorId); if (!a || !a.alive) return false;
    if (this.clock.now < a.gcdEndsAtMs) return false; // still in GCD
    if (a.cast.casting) return false;
    a.cast = { casting: true, actionId, casterId: actorId, targetIds, castTimeMs, startedAtMs: this.clock.now, willOpenChannelId };
    // Reserve GCD immediately for instant casts; for longer casts, GCD begins on completion
    if (castTimeMs <= 0) a.gcdEndsAtMs = this.clock.now + (gcd ?? this.cfg.gcdMs);
    // schedule completion
    const doneAt = this.clock.now + Math.max(0, castTimeMs);
    const timerId = `cast:${actorId}:${actionId}:${doneAt}`;
    this.timeline.schedule(timerId, doneAt, () => this.completeCast(actorId));
    return true;
  }

  cancelCast(actorId: Id) {
    const a = this.getActor(actorId); if (!a) return;
    a.cast = { casting:false };
  }

  private completeCast(actorId: Id) {
    const a = this.getActor(actorId); if (!a || !a.cast.casting) return;
    const { actionId, targetIds = [], willOpenChannelId } = a.cast;
    // Apply GCD on completion for non-instant casts
    if ((a.cast.castTimeMs ?? 0) > 0) a.gcdEndsAtMs = this.clock.now + this.cfg.gcdMs;
    a.cast = { casting:false };
    this.bus.emit({ type:"castComplete", casterId:actorId, actionId: actionId!, targetIds });
    if (willOpenChannelId) this.startChannel(actorId, willOpenChannelId);
  }

  setCooldown(actorId: Id, actionId: Id, cdMs: Ms) {
    const a = this.getActor(actorId); if (!a) return;
    a.cds[actionId] = { actionId, endsAtMs: this.clock.now + cdMs };
  }

  /* ---------- Channels & Post-Stop Effects ---------- */

  startChannel(sourceId: Id, channelId: Id, upkeep?: { mpPer5s?: number; staminaPer5s?: number; hpPer5s?: number }) {
    const a = this.getActor(sourceId); if (!a) return;
    let ch = a.channels[channelId];
    if (!ch) ch = a.channels[channelId] = { id: channelId, sourceMemberId: sourceId, effectIds: [], active:true, upkeep: { ...upkeep, accumMs:0 } };
    ch.active = true;
    // Freeze any linked "post-stop" effects
    for (const effId of ch.effectIds) {
      const ef = a.effects[effId]; if (ef && ef.durationModel === "post-stop") ef.countingDown = false;
    }
    this.bus.emit({ type:"channelStart", sourceId, channelId });
  }

  linkEffectToChannel(sourceId: Id, channelId: Id, effectId: Id) {
    const a = this.getActor(sourceId); if (!a) return;
    const ch = a.channels[channelId]; if (!ch) return;
    if (!ch.effectIds.includes(effectId)) ch.effectIds.push(effectId);
    // Freeze new effect immediately if channel is active and effect is post-stop
    const ef = a.effects[effectId];
    if (ef && ef.durationModel === "post-stop" && ch.active) ef.countingDown = false;
  }

  stopChannel(sourceId: Id, channelId: Id) {
    const a = this.getActor(sourceId); if (!a) return;
    const ch = a.channels[channelId]; if (!ch) return;
    ch.active = false;
    // Unfreeze linked "post-stop" effects
    for (const effId of ch.effectIds) {
      const ef = a.effects[effId]; if (ef && ef.durationModel === "post-stop") {
        ef.countingDown = true;
        ef.startedAtMs = this.clock.now; // reset timing reference
      }
    }
    this.bus.emit({ type:"channelStop", sourceId, channelId });
  }

  /* ---------- Effects: add/remove & periodic ---------- */

  addEffect(ownerId: Id, effect: TimedEffect, channelIdToLink?: Id) {
    const a = this.getActor(ownerId); if (!a) return;
    // init periodic accum
    if (effect.periodic && effect.periodic.periodMs && effect.periodic.periodMs > 0) {
      effect.periodic.accumMs = 0;
    }
    a.effects[effect.id] = effect;
    // if linked to active channel, freeze countdown
    if (channelIdToLink) {
      this.linkEffectToChannel(ownerId, channelIdToLink, effect.id);
    }
  }

  removeEffect(ownerId: Id, effectId: Id) {
    const a = this.getActor(ownerId); if (!a) return;
    delete a.effects[effectId];
    // also unlink from channels
    for (const ch of Object.values(a.channels)) {
      ch.effectIds = ch.effectIds.filter(id => id !== effectId);
    }
  }

  /* ---------- Resource Upkeep (channels, summons, auras) ---------- */

  private tryUpkeepDrain(ch: MaintainedChannel, owner: ActorState, dtMs: Ms, getMember?: (id:Id)=>{ resources:{MP:number;Stamina:number;HP:number;MPMax:number;StaminaMax:number;HPMax:number}}|undefined) {
    if (!ch.upkeep || !ch.active) return;
    ch.upkeep.accumMs = (ch.upkeep.accumMs ?? 0) + dtMs;
    if (ch.upkeep.accumMs < this.cfg.upkeepTickMs) return;
    ch.upkeep.accumMs -= this.cfg.upkeepTickMs;

    if (!getMember) return; // if you didn't wire resource access, skip drains
    const m = getMember(owner.id); if (!m) return;

    const mp = ch.upkeep.mpPer5s ?? 0;
    const sp = ch.upkeep.staminaPer5s ?? 0;
    const hp = ch.upkeep.hpPer5s ?? 0;
    m.resources.MP = Math.max(0, m.resources.MP - mp);
    m.resources.Stamina = Math.max(0, m.resources.Stamina - sp);
    m.resources.HP = Math.max(0, m.resources.HP - hp);

    // Optional: auto-stop channel if MP depleted
    if ((mp > 0 && m.resources.MP <= 0) || (sp > 0 && m.resources.Stamina <= 0) || (hp > 0 && m.resources.HP <= 0)) {
      this.stopChannel(owner.id, ch.id);
    }
  }

  /* ---------- Per-tick advance ---------- */

  /** Advance engine time and tick cooldowns, effects, channels, periodic pulses, and upkeep. */
  advance(dtMs: Ms, getMember?: (id:Id)=>{ resources:{HP:number;MP:number;Stamina:number;HPMax:number;MPMax:number;StaminaMax:number}}|undefined) {
    if (dtMs <= 0) return;

    const prev = this.clock.now;
    this.clock.advance(dtMs);

    // Flush any scheduled completions
    this.timeline.flush(this.clock.now);

    // Tick each actor
    for (const a of this.allActors()) {
      if (!a.alive) continue;

      // Channels: upkeep drains
      for (const ch of Object.values(a.channels)) {
        this.tryUpkeepDrain(ch, a, dtMs, getMember);
      }

      // Effects: countdown timers & periodic pulses
      for (const ef of Object.values(a.effects)) {
        // Periodic accumulators (work even while frozen—only if you want pulses to depend on countdown, move inside "if countingDown")
        if (ef.periodic) {
          ef.periodic.accumMs = (ef.periodic.accumMs ?? 0) + dtMs;
          while (ef.periodic.accumMs >= ef.periodic.periodMs) {
            ef.periodic.accumMs -= ef.periodic.periodMs;
            this.bus.emit({ type:"effectPulse", ownerId: a.id, effectId: ef.id, tag: ef.periodic.tag });
          }
        }

        // Countdown remaining time (only if allowed)
        if (ef.countingDown) {
          ef.remainingSec = Math.max(0, ef.remainingSec - dtMs / 1000);
          if (ef.remainingSec <= 0) {
            // Remove expired
            this.removeEffect(a.id, ef.id);
          }
        }
      }
    }

    // Emit a tick event (useful for external consumers)
    this.bus.emit({ type:"tick", dtMs });
  }
}

/* ========================= Glue Helpers (optional) ========================= */

/** 
 * Attach an aura/DoT/regen "pulse per X ms" to an effect.
 * Example: for DoTs/Regens at 5s: addPeriodic(effect, engine.cfg.dotRegenPeriodMs, "DOT_TICK")
 */
export function addPeriodic(effect: TimedEffect, periodMs: Ms, tag?: string) {
  effect.periodic = { periodMs, accumMs: 0, tag };
}

/** Create a standard post-stop effect with periodic pulses (e.g., singing/dance) */
export function makeMaintainedEffect(params: {
  id: Id; sourceId: Id; kind: TimedEffect["kind"]; payload: Record<string,unknown>;
  durationSec: number; pulseEveryMs?: Ms; pulseTag?: string; element?: string;
}): TimedEffect {
  const e: TimedEffect = {
    id: params.id,
    sourceMemberId: params.sourceId,
    kind: params.kind,
    element: params.element,
    payload: params.payload,
    durationModel: "post-stop",
    remainingSec: params.durationSec,
    countingDown: false, // frozen until channel stops
    startedAtMs: 0
  };
  if (params.pulseEveryMs && params.pulseEveryMs > 0) {
    addPeriodic(e, params.pulseEveryMs, params.pulseTag);
  }
  return e;
}

/** Standard normal-duration effect (ticks immediately) */
export function makeTimedEffect(params: {
  id: Id; sourceId: Id; kind: TimedEffect["kind"]; payload: Record<string,unknown>;
  durationSec: number; element?: string; pulseEveryMs?: Ms; pulseTag?: string;
}): TimedEffect {
  const e: TimedEffect = {
    id: params.id,
    sourceMemberId: params.sourceId,
    kind: params.kind,
    element: params.element,
    payload: params.payload,
    durationModel: "normal",
    remainingSec: params.durationSec,
    countingDown: true,
    startedAtMs: 0
  };
  if (params.pulseEveryMs && params.pulseEveryMs > 0) {
    addPeriodic(e, params.pulseEveryMs, params.pulseTag);
  }
  return e;
}

/* ========================= Example Wiring =========================
   This section shows how to hook TimingEngine to your existing systems.
   Trim or adapt to your codebase.
------------------------------------------------------------------- */

// Example actor bootstrap (convert your Party members into ActorState)
export function actorFromMember(m: {
  id:string; faction:Faction; alive:boolean;
}): ActorState {
  return {
    id: m.id, faction: m.faction, alive: m.alive,
    gcdEndsAtMs: 0, cds: {}, channels: {}, cast: { casting:false }, effects: {}
  };
}

/** Example: Start a singing song as a maintained channel with a post-stop effect */
export function startMaintainedSong(
  engine: TimingEngine,
  singerId: Id,
  channelId: Id,
  effectId: Id,
  durationSec: number,
  payload: Record<string,unknown>,
  pulseEveryMs = engine.cfg.auraPulseDefaultMs,
  pulseTag = "AURA_PULSE",
  upkeepMpPer5s = 0
) {
  // open/refresh channel
  engine.startChannel(singerId, channelId, { mpPer5s: upkeepMpPer5s });

  // create a post-stop effect that’s frozen while channel is up
  const eff = makeMaintainedEffect({
    id: effectId, sourceId: singerId, kind:"aura", payload, durationSec, pulseEveryMs, pulseTag
  });
  // add and link
  engine.addEffect(singerId, eff, channelId);
}

/** Example: Stop a maintained song/dance/singing */
export function stopMaintained(engine: TimingEngine, sourceId: Id, channelId: Id) {
  engine.stopChannel(sourceId, channelId);
}

/** Example: Spawn a summon as a channel with MP upkeep + attached aura/buffs */
export function spawnSummonAsChannel(engine: TimingEngine, summonerId: Id, summonId: Id, upkeepMpPer5s: number, attachedEffects: TimedEffect[]) {
  const channelId = `summon:${summonId}`;
  engine.startChannel(summonerId, channelId, { mpPer5s: upkeepMpPer5s });
  // link each effect so countdown is frozen while summon maintained; 
  for (const ef of attachedEffects) {
    engine.addEffect(summonerId, ef, channelId);
  }
}

/** Example: Per-frame or per-tick update from your game loop */
export function updateCombat(engine: TimingEngine, dtMs: Ms, getMember?: (id:Id)=>{ resources:{HP:number;MP:number;Stamina:number;HPMax:number;MPMax:number;StaminaMax:number}}|undefined) {
  engine.advance(dtMs, getMember);
}

/* ========================= Notes =========================
- One clock to rule them all: cast times, cooldowns, channels, effect durations, and periodic pulses are driven off the same `TimingEngine.clock`.
- “Post-stop” model: effects linked to a channel stay frozen until you call `stopChannel()`. Then their `remainingSec` starts decrementing.
- Periodic pulses: attach `effect.periodic` via `addPeriodic` or use `makeMaintainedEffect(...pulseEveryMs)`. The engine emits `effectPulse` on schedule; you handle damage/heal/resource tick in a subscriber.
- Upkeep drains: channels can specify MP/Stamina/HP upkeep per 5s; the engine ticks drains on `upkeepTickMs`. If the resource hits zero, the channel is auto-stopped.
- Cast → Channel: call `startCast(..., willOpenChannelId="song:XYZ")`. On completion, the engine emits `castComplete` and opens the channel.
- Cooldowns: call `setCooldown(actorId, actionId, cdMs)` when an action is executed.
- Events bus: subscribe to `engine.bus.on(e => { ... })` to implement on-hit/on-crit auras, elemental pulses, DoT damage application, etc.
- Determinism: all timers are driven by `Timeline.flush(now)`. Keep all mutations in event handlers or after `advance()` for tidy frames.
*/

