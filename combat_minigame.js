import { calculateCombat, describeCombatSkill } from "./data/game/combat_runtime.js";

const BACK_BUTTON_CLASS = "top-menu-main--back-visible";
const DEFAULT_PANEL = "weapons";

const ENCOUNTER_TEMPLATES = [
  {
    id: "urban-bandits-night",
    title: "Street Ambush",
    summary: "Cutpurses surge from the shadows with knives drawn.",
    foreshadow: "You notice footfalls slipping out of sync with your own.",
    tags: ["urban", "slum", "alley", "night"],
    archetype: "bandit",
    difficulty: 0.35,
  },
  {
    id: "urban-docks-thugs",
    title: "Dockyard Ruffians",
    summary: "Harbor toughs fan out with clubs and tar-lined nets.",
    foreshadow: "Muted shouts drift from behind a stack of crates.",
    tags: ["urban", "dock", "night"],
    archetype: "dockhand",
    difficulty: 0.32,
  },
  {
    id: "forest-predators-day",
    title: "Wolf Pack",
    summary: "Lean wolves circle with ears flat and fangs bare.",
    foreshadow: "Birdsong halts; the brush ahead ripples in unison.",
    tags: ["forest", "wilds", "road"],
    archetype: "wolf",
    difficulty: 0.4,
  },
  {
    id: "forest-undead-night",
    title: "Cemetery Stir",
    summary: "Grave-cold hands claw free of rain-soaked earth.",
    foreshadow: "The air tastes like iron as mist crawls over the stones.",
    tags: ["cemetery", "night", "forest"],
    archetype: "undead",
    difficulty: 0.45,
  },
  {
    id: "road-brigands",
    title: "Roadside Brigands",
    summary: "Ragged brigands spring the trap from brush and ditch.",
    foreshadow: "A snapped twig echoes louder than it should.",
    tags: ["road", "farmland", "day"],
    archetype: "bandit",
    difficulty: 0.3,
  },
  {
    id: "coast-sirens",
    title: "Pier Sirens",
    summary: "River-slick raiders chant a luring chorus before striking.",
    foreshadow: "A chord of voices hums beneath the crash of waves.",
    tags: ["coast", "dock", "night", "water"],
    archetype: "raider",
    difficulty: 0.38,
  },
  {
    id: "swamp-leeches",
    title: "Fen Lurkers",
    summary: "Leech-backed horrors heave from the mire to drag you under.",
    foreshadow: "The peat bubbles and the gnats fall silent mid-flight.",
    tags: ["swamp", "wetland", "night"],
    archetype: "ooze",
    difficulty: 0.42,
  },
  {
    id: "mountain-predator",
    title: "Ridge Stalker",
    summary: "A scaled ridgecat pounces with talons extended.",
    foreshadow: "Pebbles tumble downslope as something keeps pace above.",
    tags: ["mountain", "remote", "day"],
    archetype: "predator",
    difficulty: 0.36,
  },
];

const ENEMY_ARCHETYPES = {
  bandit: {
    name: "Cutthroat",
    attributes: { STR: 12, DEX: 13, CON: 10, VIT: 9, AGI: 12, INT: 8, WIS: 9, CHA: 7, PER: 10, LCK: 9 },
    defense: 8,
    resists: { SLASH: 5 },
    proficiencies: { Weapon_Dagger: 45 },
    hpBase: 60,
    hpPerLevel: 9,
    mpBase: 12,
    mpPerLevel: 2,
    staminaBase: 42,
    staminaPerLevel: 5,
    actions: [
      {
        id: "bandit-quick-stab",
        label: "Quick Stab",
        attackType: "weapon",
        summary: "Fast jab aimed at exposed joints.",
        cost: { stamina: 8 },
        weaponStats: { critChancePct: 8, critMult: 1.6 },
      },
      {
        id: "bandit-gouge",
        label: "Hamstring Slash",
        attackType: "weapon",
        summary: "Vicious cut to slow the foe.",
        cost: { stamina: 12 },
        weaponStats: { critChancePct: 12, critMult: 1.75 },
      },
    ],
  },
  dockhand: {
    name: "Dock Ruffian",
    attributes: { STR: 14, DEX: 11, CON: 12, VIT: 10, AGI: 10, INT: 7, WIS: 8, CHA: 6, PER: 9, LCK: 8 },
    defense: 10,
    resists: { BLUNT: 5 },
    proficiencies: { Weapon_Mace: 40 },
    hpBase: 70,
    hpPerLevel: 10,
    mpBase: 8,
    mpPerLevel: 1,
    staminaBase: 48,
    staminaPerLevel: 6,
    actions: [
      {
        id: "dockhand-club",
        label: "Weighted Swing",
        attackType: "weapon",
        summary: "Heavy club swing meant to stagger.",
        cost: { stamina: 14 },
        weaponStats: { critChancePct: 6, critMult: 1.55 },
      },
      {
        id: "dockhand-net",
        label: "Tar Net Toss",
        attackType: "weapon",
        summary: "Tar-slick net hampers movement.",
        cost: { stamina: 10 },
        weaponStats: { critChancePct: 4, critMult: 1.4 },
      },
    ],
  },
  wolf: {
    name: "Dire Wolf",
    attributes: { STR: 13, DEX: 12, CON: 11, VIT: 10, AGI: 14, INT: 6, WIS: 11, CHA: 5, PER: 12, LCK: 9 },
    defense: 6,
    resists: { PIERCE: 5 },
    proficiencies: { Weapon_Unarmed: 50 },
    hpBase: 58,
    hpPerLevel: 8,
    mpBase: 0,
    mpPerLevel: 0,
    staminaBase: 50,
    staminaPerLevel: 7,
    actions: [
      {
        id: "wolf-rend",
        label: "Rending Bite",
        attackType: "weapon",
        summary: "Fanged bite worrying the target.",
        cost: { stamina: 9 },
        weaponStats: { critChancePct: 9, critMult: 1.7 },
      },
      {
        id: "wolf-pounce",
        label: "Pouncing Lunge",
        attackType: "weapon",
        summary: "Leaping strike to topple prey.",
        cost: { stamina: 12 },
        weaponStats: { critChancePct: 11, critMult: 1.6 },
      },
    ],
  },
  undead: {
    name: "Grave Wight",
    attributes: { STR: 11, DEX: 9, CON: 14, VIT: 14, AGI: 8, INT: 7, WIS: 10, CHA: 4, PER: 10, LCK: 6 },
    defense: 12,
    resists: { SLASH: 10, PIERCE: 10, BLUNT: 5 },
    proficiencies: { Weapon_Mace: 35, Element_Dark: 30 },
    hpBase: 80,
    hpPerLevel: 11,
    mpBase: 18,
    mpPerLevel: 4,
    staminaBase: 36,
    staminaPerLevel: 4,
    actions: [
      {
        id: "wight-blight",
        label: "Rotting Touch",
        attackType: "spell",
        summary: "Necrotic grip that leeches vigor.",
        cost: { mp: 12 },
        weaponStats: { critChancePct: 7, critMult: 1.6 },
      },
      {
        id: "wight-maul",
        label: "Grave Maul",
        attackType: "weapon",
        summary: "Heavy two-handed slam.",
        cost: { stamina: 15 },
        weaponStats: { critChancePct: 5, critMult: 1.6 },
      },
    ],
  },
  raider: {
    name: "Tidecaller",
    attributes: { STR: 11, DEX: 13, CON: 10, VIT: 9, AGI: 13, INT: 12, WIS: 11, CHA: 10, PER: 11, LCK: 10 },
    defense: 9,
    resists: { WATER: 10, SLASH: 5 },
    proficiencies: { Weapon_Spear: 40, Element_Water: 35 },
    hpBase: 62,
    hpPerLevel: 8,
    mpBase: 22,
    mpPerLevel: 5,
    staminaBase: 40,
    staminaPerLevel: 5,
    actions: [
      {
        id: "raider-surge",
        label: "Tidal Surge",
        attackType: "spell",
        summary: "Water whip crashes into the foe.",
        cost: { mp: 14 },
        weaponStats: { critChancePct: 10, critMult: 1.65 },
      },
      {
        id: "raider-spear",
        label: "Harpoon Thrust",
        attackType: "weapon",
        summary: "Piercing spear thrust aimed to pin.",
        cost: { stamina: 12 },
        weaponStats: { critChancePct: 9, critMult: 1.7 },
      },
    ],
  },
  ooze: {
    name: "Fen Horror",
    attributes: { STR: 14, DEX: 6, CON: 16, VIT: 15, AGI: 6, INT: 4, WIS: 6, CHA: 3, PER: 8, LCK: 4 },
    defense: 8,
    resists: { BLUNT: 15, SLASH: -10 },
    proficiencies: { Weapon_Unarmed: 30, Element_Water: 20 },
    hpBase: 95,
    hpPerLevel: 13,
    mpBase: 12,
    mpPerLevel: 3,
    staminaBase: 30,
    staminaPerLevel: 4,
    actions: [
      {
        id: "ooze-crush",
        label: "Crushing Embrace",
        attackType: "weapon",
        summary: "Ooze engulfs and squeezes prey.",
        cost: { stamina: 10 },
        weaponStats: { critChancePct: 4, critMult: 1.5 },
      },
      {
        id: "ooze-acid",
        label: "Acidic Jet",
        attackType: "spell",
        summary: "Spray of caustic sludge.",
        cost: { mp: 10 },
        weaponStats: { critChancePct: 6, critMult: 1.55 },
      },
    ],
  },
  predator: {
    name: "Ridgecat",
    attributes: { STR: 13, DEX: 14, CON: 11, VIT: 10, AGI: 15, INT: 8, WIS: 10, CHA: 6, PER: 12, LCK: 10 },
    defense: 7,
    resists: { PIERCE: 8, ICE: -5 },
    proficiencies: { Weapon_Unarmed: 45 },
    hpBase: 64,
    hpPerLevel: 9,
    mpBase: 6,
    mpPerLevel: 1,
    staminaBase: 46,
    staminaPerLevel: 6,
    actions: [
      {
        id: "predator-claw",
        label: "Claw Flurry",
        attackType: "weapon",
        summary: "A flurry of slashing claws.",
        cost: { stamina: 11 },
        weaponStats: { critChancePct: 12, critMult: 1.65 },
      },
      {
        id: "predator-tail",
        label: "Tail Sweep",
        attackType: "weapon",
        summary: "Sweeping blow to stagger prey.",
        cost: { stamina: 9 },
        weaponStats: { critChancePct: 8, critMult: 1.55 },
      },
    ],
  },
};

const DEFAULT_WEAPON_ACTIONS = [
  {
    id: "player-basic-strike",
    label: "Basic Strike",
    attackType: "weapon",
    summary: "A reliable weapon attack.",
    cost: { stamina: 10 },
    weaponStats: { critChancePct: 6, critMult: 1.6 },
  },
  {
    id: "player-heavy-swing",
    label: "Heavy Swing",
    attackType: "weapon",
    summary: "A slower strike that hits harder when it lands.",
    cost: { stamina: 16 },
    weaponStats: { critChancePct: 10, critMult: 1.75 },
  },
];

const DEFAULT_SPELL_ACTIONS = [
  {
    id: "player-arcane-bolt",
    label: "Arcane Bolt",
    attackType: "spell",
    summary: "A focused bolt of force.",
    cost: { mp: 12 },
    weaponStats: { critChancePct: 10, critMult: 1.6 },
  },
  {
    id: "player-warding-flare",
    label: "Warding Flare",
    attackType: "spell",
    summary: "Flare of light that sears foes.",
    cost: { mp: 16 },
    weaponStats: { critChancePct: 12, critMult: 1.7 },
  },
];
function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function shallowClone(value) {
  if (!value || typeof value !== "object") return value;
  return Array.isArray(value) ? value.map(entry => shallowClone(entry)) : { ...value };
}

function pickRandom(list, rng = Math.random) {
  if (!Array.isArray(list) || !list.length) return null;
  const index = Math.floor(rng() * list.length);
  return list[clamp(index, 0, list.length - 1)];
}

function getMainElement() {
  return document.querySelector("main");
}

function setMainContent(html) {
  if (typeof window.__rpgSetMainHTML === "function") {
    window.__rpgSetMainHTML(html);
    return;
  }
  const main = getMainElement();
  if (main) main.innerHTML = html;
  const mapContainer = document.querySelector(".map-container");
  if (mapContainer) mapContainer.style.display = "none";
}

function hideBackControl() {
  if (typeof window.__rpgHideBackButton === "function") {
    window.__rpgHideBackButton();
    return;
  }
  const backBtn = document.getElementById("back-button");
  if (backBtn) backBtn.style.display = "none";
  const topMenuMain = document.querySelector(".top-menu-main");
  if (topMenuMain) topMenuMain.classList.remove(BACK_BUTTON_CLASS);
}

function showBackControl() {
  if (typeof window.__rpgShowBackButton === "function") {
    window.__rpgShowBackButton();
    return;
  }
  const backBtn = document.getElementById("back-button");
  if (backBtn) backBtn.style.display = "inline-flex";
  const topMenuMain = document.querySelector(".top-menu-main");
  if (topMenuMain) topMenuMain.classList.add(BACK_BUTTON_CLASS);
}

function updateMenuSizing() {
  if (typeof window.__rpgUpdateMenuHeight === "function") {
    window.__rpgUpdateMenuHeight();
    return;
  }
  const topMenu = document.querySelector(".top-menu");
  if (!topMenu) return;
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--ui-scale")) || 1;
  const height = topMenu.offsetHeight * scale;
  document.documentElement.style.setProperty("--menu-height", `${height}px`);
}

function toResourceBlock(member) {
  const hpMax = Math.max(1, Number(member.maxHP ?? member.resources?.HPMax ?? member.resources?.hpMax ?? member.resources?.maxHP) || 60);
  const hp = clamp(Number(member.hp ?? member.resources?.HP ?? member.resources?.hp), 0, hpMax);
  const mpMax = Math.max(0, Number(member.maxMP ?? member.resources?.MPMax ?? member.resources?.mpMax ?? member.resources?.maxMP) || 0);
  const mp = clamp(Number(member.mp ?? member.resources?.MP ?? member.resources?.mp), 0, mpMax);
  const staminaMax = Math.max(0, Number(member.maxStamina ?? member.resources?.StaminaMax ?? member.resources?.staminaMax ?? member.resources?.maxStamina) || 40);
  const stamina = clamp(Number(member.stamina ?? member.resources?.Stamina ?? member.resources?.stamina), 0, staminaMax);
  return {
    hp,
    hpMax,
    mp,
    mpMax,
    stamina,
    staminaMax,
  };
}

function normalizeAttributes(source = {}) {
  const attrs = { STR: 0, DEX: 0, CON: 0, VIT: 0, AGI: 0, INT: 0, WIS: 0, CHA: 0, PER: 0, LCK: 0 };
  if (!source) return attrs;
  const map = Array.isArray(source)
    ? Object.fromEntries(source)
    : typeof source === "object"
    ? source
    : {};
  const currentBlock = map.current || map.base || map;
  for (const key of Object.keys(attrs)) {
    const value = Number(currentBlock[key]) || 0;
    attrs[key] = value;
  }
  if (Number.isFinite(map.LCK)) attrs.LCK = Number(map.LCK);
  if (Number.isFinite(map.PER)) attrs.PER = Number(map.PER);
  if (Number.isFinite(map.AGI)) attrs.AGI = Number(map.AGI);
  return attrs;
}

function normalizeProficiencies(character = {}) {
  const profs = {};
  const src = character.proficiency || character.proficiencies || {};
  const weaponBlock = src.weapons || src.weapon || {};
  Object.entries(weaponBlock).forEach(([key, value]) => {
    if (!key) return;
    const resolved = typeof value === "object" ? Number(value.value) : Number(value);
    if (!Number.isFinite(resolved)) return;
    profs[`Weapon_${key}`] = resolved;
  });
  const elementBlock = src.elements || src.element || {};
  Object.entries(elementBlock).forEach(([key, value]) => {
    if (!key) return;
    const resolved = typeof value === "object" ? Number(value.value) : Number(value);
    if (!Number.isFinite(resolved)) return;
    const normalizedKey = key[0].toUpperCase() + key.slice(1);
    profs[`Element_${normalizedKey}`] = resolved;
  });
  return profs;
}

function buildMemberFromCharacter(character, overrides = {}) {
  const name = character?.name || overrides.name || "Adventurer";
  const id = character?.id || overrides.id || `pc-${Math.random().toString(36).slice(2, 8)}`;
  const level = Number(character?.level ?? overrides.level) || 1;
  const attributes = normalizeAttributes(character?.attributes || overrides.attributes);
  const proficiencies = { ...normalizeProficiencies(character), ...(overrides.proficiencies || {}) };
  const resists = { ...(character?.resistances || {}), ...(overrides.resists || {}) };
  const defense = Number(character?.defense ?? overrides.defense) || 0;
  const resources = toResourceBlock({ ...character, ...overrides });
  return {
    id,
    name,
    level,
    attributes,
    proficiencies,
    resists,
    defense,
    resources,
    isPlayer: overrides.isPlayer ?? true,
    controllable: overrides.controllable ?? true,
    role: overrides.role || character?.role || null,
    inventory: Array.isArray(character?.inventory) ? character.inventory.map(item => ({ ...item })) : [],
  };
}

function buildPartyMembers(character) {
  const members = [];
  if (character) {
    members.push(buildMemberFromCharacter(character, { isPlayer: true }));
  }
  const pools = [];
  if (Array.isArray(character?.partyMembers)) pools.push(character.partyMembers);
  if (Array.isArray(character?.companions)) pools.push(character.companions);
  if (character?.party && Array.isArray(character.party.members)) pools.push(character.party.members);
  pools.forEach(pool => {
    pool.forEach(raw => {
      if (!raw || typeof raw !== "object") return;
      const member = buildMemberFromCharacter(raw, { isPlayer: false, controllable: Boolean(raw.controllable) });
      members.push(member);
    });
  });
  return members;
}

function renderResourceBar(type, current, max) {
  const pct = max > 0 ? clamp((current / max) * 100, 0, 100) : 0;
  const label = type === "hp" ? "HP" : type === "mp" ? "MP" : "Stamina";
  return `
    <div class="combat-minigame-bar combat-minigame-bar--${type}">
      <div class="combat-minigame-bar-label">${label}</div>
      <div class="combat-minigame-bar-track"><div class="combat-minigame-bar-fill" style="width:${pct}%"></div></div>
      <div class="combat-minigame-bar-value">${Math.round(current)} / ${Math.round(max)}</div>
    </div>
  `;
}

function renderCombatant(member, options = {}) {
  const { active = false, side = "party" } = options;
  const resources = member.resources || { hp: 0, hpMax: 1, mp: 0, mpMax: 1, stamina: 0, staminaMax: 1 };
  const downed = resources.hp <= 0;
  const classes = ["combat-minigame-combatant", `combat-minigame-combatant--${side}`];
  if (active) classes.push("is-active");
  if (downed) classes.push("is-downed");
  return `
    <article class="${classes.join(" ")}" data-id="${escapeHtml(member.id)}">
      <header class="combat-minigame-combatant-header">
        <span class="combat-minigame-combatant-name">${escapeHtml(member.name)}</span>
        <span class="combat-minigame-combatant-meta">Lv ${member.level}</span>
      </header>
      <div class="combat-minigame-bars">
        ${renderResourceBar("hp", resources.hp, resources.hpMax)}
        ${resources.mpMax > 0 ? renderResourceBar("mp", resources.mp, resources.mpMax) : ""}
        ${renderResourceBar("stamina", resources.stamina, resources.staminaMax)}
      </div>
    </article>
  `;
}

function renderCombatMinigameHTML(state) {
  const partyHTML = state.party
    .map((member, index) => renderCombatant(member, { active: index === state.activePartyIndex, side: "party" }))
    .join("");
  const enemyHTML = state.enemies
    .map((member, index) => renderCombatant(member, { active: index === state.activeEnemyIndex, side: "enemy" }))
    .join("");
  return `
    <div class="quest-storyline combat-minigame">
      <header class="quest-storyline-header">
        <h2>${escapeHtml(state.title || "Combat Encounter")}</h2>
        <p class="quest-storyline-subtitle">${escapeHtml(state.subtitle || "Hold your ground.")}</p>
      </header>
      <section class="quest-storyline-body combat-minigame-body">
        <div class="combat-minigame-status">
          <section class="combat-minigame-side combat-minigame-side--party">${partyHTML}</section>
          <section class="combat-minigame-side combat-minigame-side--enemy">${enemyHTML}</section>
        </div>
        <div class="combat-minigame-log" aria-live="polite"></div>
      </section>
      <footer class="quest-storyline-actions combat-minigame-actions">
        <div class="combat-minigame-tabs" role="tablist">
          <button type="button" class="combat-minigame-tab is-active" data-panel="weapons">Weapons</button>
          <button type="button" class="combat-minigame-tab" data-panel="spells">Spells</button>
          <button type="button" class="combat-minigame-tab" data-panel="items">Items</button>
          <button type="button" class="combat-minigame-tab" data-panel="swap">Party</button>
          <button type="button" class="combat-minigame-tab combat-minigame-tab--flee" data-panel="flee">Flee</button>
        </div>
        <div class="combat-minigame-panels">
          <div class="combat-minigame-panel" data-panel="weapons"></div>
          <div class="combat-minigame-panel" data-panel="spells" hidden></div>
          <div class="combat-minigame-panel" data-panel="items" hidden></div>
          <div class="combat-minigame-panel" data-panel="swap" hidden></div>
          <div class="combat-minigame-panel" data-panel="flee" hidden></div>
        </div>
        <div class="combat-minigame-footer-controls">
          <button type="button" class="combat-minigame-cancel">Retreat</button>
        </div>
      </footer>
    </div>
  `;
}
function buildWeaponActions(member) {
  const actions = DEFAULT_WEAPON_ACTIONS.map(action => ({ ...action }));
  if (!member || !member.proficiencies) return actions;
  const profEntries = Object.entries(member.proficiencies).filter(([key, value]) => key.startsWith("Weapon_") && Number(value) > 0);
  profEntries.slice(0, 3).forEach(([key, value], idx) => {
    const weaponType = key.replace("Weapon_", "");
    actions.push({
      id: `player-${weaponType.toLowerCase()}-tech-${idx}`,
      label: `${weaponType} Technique`,
      attackType: "weapon",
      summary: `Technique leveraging ${weaponType.toLowerCase()} proficiency (${Math.round(value)}).`,
      cost: { stamina: 12 + idx * 4 },
      weaponStats: { critChancePct: 6 + idx * 2, critMult: 1.6 + idx * 0.1 },
    });
  });
  return actions;
}

function buildSpellActions(member) {
  const actions = DEFAULT_SPELL_ACTIONS.map(action => ({ ...action }));
  const profEntries = Object.entries(member?.proficiencies || {}).filter(([key, value]) => key.startsWith("Element_") && Number(value) > 0);
  profEntries.slice(0, 3).forEach(([key, value], idx) => {
    const element = key.replace("Element_", "");
    actions.push({
      id: `player-${element.toLowerCase()}-spell-${idx}`,
      label: `${element} Burst`,
      attackType: "spell",
      summary: `Spell channeling ${element.toLowerCase()} attunement (${Math.round(value)}).`,
      cost: { mp: 12 + idx * 4 },
      weaponStats: { critChancePct: 10 + idx * 2, critMult: 1.65 + idx * 0.05 },
    });
  });
  return actions;
}

function buildItemActions(member, inventory = []) {
  if (!Array.isArray(inventory) || !inventory.length) return [];
  const actions = [];
  inventory.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const name = item.name || item.label;
    if (!name) return;
    const qty = Number(item.qty) || 1;
    if (qty <= 0) return;
    const lower = name.toLowerCase();
    if (/(potion|tonic|elixir|draught|remedy)/.test(lower)) {
      actions.push({
        id: `item-${index}`,
        label: name,
        attackType: "item",
        summary: item.description || "Restore a measure of vitality.",
        effect: "heal",
        potency: item.potency || 0.3,
        inventoryIndex: index,
        qty,
      });
      return;
    }
    if (/(ether|mana|focus)/.test(lower)) {
      actions.push({
        id: `item-${index}`,
        label: name,
        attackType: "item",
        summary: item.description || "Restore a measure of mana.",
        effect: "mana",
        potency: item.potency || 0.3,
        inventoryIndex: index,
        qty,
      });
      return;
    }
    if (/(stamina|ration|snack)/.test(lower)) {
      actions.push({
        id: `item-${index}`,
        label: name,
        attackType: "item",
        summary: item.description || "Restore some stamina.",
        effect: "stamina",
        potency: item.potency || 0.35,
        inventoryIndex: index,
        qty,
      });
    }
  });
  return actions;
}

function buildSwapActions(state) {
  const actions = [];
  state.party.forEach((member, index) => {
    actions.push({
      id: `swap-${member.id}`,
      label: index === state.activePartyIndex ? `${member.name} (active)` : member.name,
      attackType: "swap",
      summary: index === state.activePartyIndex ? "Already leading the party." : "Bring this member to the front.",
      targetIndex: index,
      disabled: member.resources.hp <= 0,
    });
  });
  return actions;
}

function renderActions(panel, actions) {
  if (!actions.length) {
    return '<p class="combat-minigame-panel-empty">Nothing available.</p>';
  }
  return `
    <div class="combat-action-grid">
      ${actions
        .map(action => {
          const disabled = action.disabled ? " disabled" : "";
          const metaParts = [];
          if (action.cost?.stamina) metaParts.push(`Stamina ${action.cost.stamina}`);
          if (action.cost?.mp) metaParts.push(`MP ${action.cost.mp}`);
          if (action.qty != null) metaParts.push(`Qty ${action.qty}`);
          return `
            <button type="button" class="combat-action" data-panel="${panel}" data-action-id="${escapeHtml(action.id)}"${disabled}>
              <span class="combat-action-title">${escapeHtml(action.label || "Action")}</span>
              ${action.summary ? `<span class="combat-action-detail">${escapeHtml(action.summary)}</span>` : ""}
              ${metaParts.length ? `<span class="combat-action-meta">${escapeHtml(metaParts.join(" • "))}</span>` : ""}
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function ensurePanel(main, panelName) {
  const panels = main.querySelectorAll(".combat-minigame-panel");
  panels.forEach(panel => {
    const match = panel.dataset.panel === panelName;
    panel.hidden = !match;
  });
  main.querySelectorAll(".combat-minigame-tab").forEach(tab => {
    if (tab.dataset.panel === panelName) {
      tab.classList.add("is-active");
    } else {
      tab.classList.remove("is-active");
    }
  });
}

function appendLog(state, text, tone = "info") {
  state.log.push({ text, tone });
  if (state.log.length > 40) state.log.shift();
  const main = getMainElement();
  if (!main) return;
  const logContainer = main.querySelector(".combat-minigame-log");
  if (!logContainer) return;
  logContainer.innerHTML = state.log
    .map(entry => `<p class="combat-log-line combat-log-line--${escapeHtml(entry.tone)}">${escapeHtml(entry.text)}</p>`)
    .join("");
  logContainer.scrollTop = logContainer.scrollHeight;
}

function updateStatusUI(state) {
  const main = getMainElement();
  if (!main) return;
  const partyContainer = main.querySelector(".combat-minigame-side--party");
  const enemyContainer = main.querySelector(".combat-minigame-side--enemy");
  if (partyContainer) {
    partyContainer.innerHTML = state.party
      .map((member, index) => renderCombatant(member, { active: index === state.activePartyIndex, side: "party" }))
      .join("");
  }
  if (enemyContainer) {
    enemyContainer.innerHTML = state.enemies
      .map((member, index) => renderCombatant(member, { active: index === state.activeEnemyIndex, side: "enemy" }))
      .join("");
  }
}

function updateActionPanels(state) {
  const main = getMainElement();
  if (!main) return;
  const activeMember = state.party[state.activePartyIndex];
  const weaponPanel = main.querySelector('.combat-minigame-panel[data-panel="weapons"]');
  const spellPanel = main.querySelector('.combat-minigame-panel[data-panel="spells"]');
  const itemPanel = main.querySelector('.combat-minigame-panel[data-panel="items"]');
  const swapPanel = main.querySelector('.combat-minigame-panel[data-panel="swap"]');
  const fleePanel = main.querySelector('.combat-minigame-panel[data-panel="flee"]');
  state.actions.weapons = buildWeaponActions(activeMember);
  state.actions.spells = buildSpellActions(activeMember);
  state.actions.items = buildItemActions(activeMember, state.inventoryCopy);
  state.actions.swap = buildSwapActions(state);
  state.actions.flee = [
    {
      id: "flee-now",
      label: "Attempt to flee",
      attackType: "flee",
      summary: "Retreat from the encounter. Success depends on your awareness.",
    },
  ];
  if (weaponPanel) weaponPanel.innerHTML = renderActions("weapons", state.actions.weapons);
  if (spellPanel) spellPanel.innerHTML = renderActions("spells", state.actions.spells);
  if (itemPanel) itemPanel.innerHTML = renderActions("items", state.actions.items);
  if (swapPanel) swapPanel.innerHTML = renderActions("swap", state.actions.swap);
  if (fleePanel) fleePanel.innerHTML = renderActions("flee", state.actions.flee);
}
function buildEncounterTags(definition = {}) {
  const tags = new Set();
  const habitat = (definition.habitat || "").toLowerCase();
  const location = (definition.location || "").toLowerCase();
  const district = (definition.district || "").toLowerCase();
  const region = (definition.region || "").toLowerCase();
  const descriptors = [habitat, location, district, region];
  const addTag = tag => {
    if (tag) tags.add(tag);
  };
  descriptors.forEach(text => {
    if (!text) return;
    if (/forest|grove|wood|copse/.test(text)) addTag("forest");
    if (/cemeter|grave|crypt|mausoleum/.test(text)) addTag("cemetery");
    if (/slum|lower|shambles|gutter|alley|sump/.test(text)) addTag("slum");
    if (/inn|tavern|house|hall/.test(text)) addTag("inn");
    if (/dock|wharf|pier|port|harbor/.test(text)) addTag("dock");
    if (/coast|sea|shore|bay|river/.test(text)) addTag("coast");
    if (/swamp|marsh|fen|bog|mire|wetland/.test(text)) addTag("swamp");
    if (/mountain|ridge|peak|crag/.test(text)) addTag("mountain");
    if (/road|trail|path|pass/.test(text)) addTag("road");
    if (/farmland|field|farm|pasture/.test(text)) addTag("farmland");
    if (/market|ward|high road|upper|gilded|manor/.test(text)) addTag("high-society");
    if (/guard|garrison|barracks|patrol|watch/.test(text)) addTag("patrolled");
    if (/ruin|wild|outer|deep|frontier|waste/.test(text)) addTag("remote");
    if (/forest|swamp|mountain|coast|farmland/.test(text)) addTag("wilderness");
    if (/urban|ward|district|market|square/.test(text)) addTag("urban");
    if (/inn|tavern/.test(text)) addTag("nightlife");
  });
  if (!tags.has("urban") && !tags.has("wilderness")) {
    if (/urban/.test(habitat)) addTag("urban");
    if (/rural|wild/.test(habitat)) addTag("wilderness");
  }
  return tags;
}

function evaluateEncounterChance(params) {
  const { tags, context, baseChance = 0 } = params;
  let chance = baseChance;
  const hour = Number(context?.timeOfDay);
  const isNight = Number.isFinite(hour) ? hour < 6 || hour >= 20 : false;
  const weather = context?.weather || {};
  const severeWeather = Boolean(weather?.storm || weather?.gale || weather?.danger);

  if (tags.has("high-society")) {
    chance += isNight ? 0.02 : 0.005;
  }
  if (tags.has("slum")) {
    chance += isNight ? 0.22 : 0.12;
  }
  if (tags.has("inn") || tags.has("nightlife")) {
    chance += isNight ? 0.12 : 0.04;
  }
  if (tags.has("dock")) {
    chance += isNight ? 0.16 : 0.08;
  }
  if (tags.has("patrolled")) {
    chance *= isNight ? 0.5 : 0.35;
  }
  if (tags.has("road")) {
    chance += isNight ? 0.18 : 0.08;
    if (tags.has("remote")) chance += 0.08;
    if (tags.has("patrolled")) chance -= 0.06;
  }
  if (tags.has("farmland")) {
    chance += isNight ? 0.14 : 0.05;
  }
  if (tags.has("forest")) {
    chance += isNight ? 0.28 : 0.14;
  }
  if (tags.has("swamp")) {
    chance += isNight ? 0.3 : 0.18;
  }
  if (tags.has("mountain")) {
    chance += isNight ? 0.22 : 0.12;
  }
  if (tags.has("coast")) {
    chance += isNight ? 0.2 : 0.1;
  }
  if (tags.has("cemetery")) {
    chance += isNight ? 0.32 : 0.12;
  }
  if (tags.has("remote")) {
    chance += 0.12;
  }
  if (tags.has("urban") && !tags.has("slum") && !tags.has("nightlife")) {
    chance += isNight ? 0.06 : 0.02;
  }
  if (tags.has("wilderness") && !tags.has("forest") && !tags.has("swamp") && !tags.has("mountain")) {
    chance += isNight ? 0.18 : 0.1;
  }
  if (severeWeather) {
    chance *= isNight ? 1.1 : 0.85;
  }
  return clamp(chance, 0, 0.95);
}

function matchEncounterTemplate(tags, context) {
  const isNight = context?.timeOfDay != null ? (context.timeOfDay < 6 || context.timeOfDay >= 20) : false;
  const weighted = ENCOUNTER_TEMPLATES.map(template => {
    let weight = template.difficulty || 0.3;
    template.tags.forEach(tag => {
      if (tags.has(tag)) weight += 0.2;
      if (!tags.has(tag)) weight -= 0.05;
      if (tag === "night" && isNight) weight += 0.2;
      if (tag === "night" && !isNight) weight -= 0.1;
      if (tag === "day" && !isNight) weight += 0.1;
    });
    return { template, weight: Math.max(weight, 0.05) };
  });
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.template;
  }
  return weighted[weighted.length - 1]?.template || ENCOUNTER_TEMPLATES[0];
}

function spawnEnemies(template, character, context) {
  const archetype = ENEMY_ARCHETYPES[template.archetype] || ENEMY_ARCHETYPES.bandit;
  const playerLevel = Number(character?.level) || 1;
  const difficulty = template.difficulty || 0.3;
  const count = clamp(Math.round(1 + difficulty * 3), 1, 3);
  const enemies = [];
  for (let i = 0; i < count; i += 1) {
    const levelOffset = (i === 0 ? 0 : i - 0.5) + difficulty * 2;
    const level = clamp(Math.round(playerLevel + levelOffset), 1, playerLevel + 6);
    const baseAttrs = archetype.attributes || {};
    const attributes = { ...baseAttrs };
    attributes.STR += Math.round(level * 0.4);
    attributes.DEX += Math.round(level * 0.3);
    attributes.CON += Math.round(level * 0.4);
    attributes.VIT += Math.round(level * 0.4);
    attributes.AGI += Math.round(level * 0.35);
    attributes.INT += Math.round(level * 0.2);
    attributes.WIS += Math.round(level * 0.2);
    const hpMax = Math.round(archetype.hpBase + archetype.hpPerLevel * level);
    const mpMax = Math.round(archetype.mpBase + archetype.mpPerLevel * level);
    const staminaMax = Math.round(archetype.staminaBase + archetype.staminaPerLevel * level);
    enemies.push({
      id: `${template.id}-enemy-${i}`,
      name: count > 1 ? `${archetype.name} ${i + 1}` : archetype.name,
      level,
      attributes,
      proficiencies: shallowClone(archetype.proficiencies || {}),
      resists: shallowClone(archetype.resists || {}),
      defense: Number(archetype.defense) || 0,
      actions: shallowClone(archetype.actions || []),
      resources: {
        hp: hpMax,
        hpMax,
        mp: mpMax,
        mpMax,
        stamina: staminaMax,
        staminaMax,
      },
      controllable: false,
      isPlayer: false,
      role: "Enemy",
    });
  }
  return enemies;
}
function computeBaseEncounterChance(actionType) {
  if (!actionType) return 0;
  if (actionType === "look") return 0.05;
  if (actionType === "explore") return 0.12;
  if (actionType === "search") return 0.1;
  if (actionType === "event") return 0.08;
  if (actionType === "hunt") return 0.16;
  if (actionType === "quest") return 0.18;
  return 0.03;
}

function maybeTriggerCombatEncounter({ actionType, definition, context, character, rng = Math.random, force = false }) {
  const normalizedType = actionType || definition?.baseAction;
  if (!normalizedType) return null;
  if (!["look", "explore", "search", "event", "hunt", "quest"].includes(normalizedType)) {
    return null;
  }
  const tags = buildEncounterTags(definition);
  const baseChance = computeBaseEncounterChance(normalizedType);
  const chance = evaluateEncounterChance({ tags, context, baseChance });
  const roll = force ? 0 : rng();
  if (!force && roll >= chance) return null;
  const template = matchEncounterTemplate(tags, context || {});
  const enemies = spawnEnemies(template, character, context || {});
  const summary = template.summary || "An unexpected threat emerges.";
  const foreshadow = template.foreshadow || "Something feels wrong about this place.";
  return {
    id: template.id,
    title: template.title || "Unexpected Encounter",
    summary,
    foreshadow,
    enemies,
    chance,
    roll,
    difficulty: template.difficulty || 0.3,
    environmentTags: Array.from(tags),
    template,
  };
}

function performResourceCosts(member, cost = {}) {
  if (!member || !member.resources) return;
  if (Number.isFinite(cost.stamina)) {
    member.resources.stamina = clamp(member.resources.stamina - cost.stamina, 0, member.resources.staminaMax);
  }
  if (Number.isFinite(cost.mp)) {
    member.resources.mp = clamp(member.resources.mp - cost.mp, 0, member.resources.mpMax);
  }
}

function applyDamage(target, amount) {
  if (!target || !target.resources) return;
  const damage = Math.max(0, Math.round(amount));
  target.resources.hp = clamp(target.resources.hp - damage, 0, target.resources.hpMax);
}

function calculateActionOutcome(attacker, defender, action) {
  const attackId = action.id || action.attackId || "fallback";
  const attackType = action.attackType === "spell" ? "spell" : "weapon";
  const result = calculateCombat(
    {
      level: attacker.level,
      attributes: attacker.attributes,
      proficiencies: attacker.proficiencies,
      defense: attacker.defense,
      resists: attacker.resists,
    },
    {
      level: defender.level,
      attributes: defender.attributes,
      proficiencies: defender.proficiencies,
      defense: defender.defense,
      resists: defender.resists,
    },
    { attackId, attackType, weaponStats: action.weaponStats }
  );
  return result;
}

function describeOutcome(attacker, defender, action, outcome) {
  const skillName = describeCombatSkill(action.attackType || "weapon", action.id || action.attackId || "fallback");
  const hitPct = Math.round(outcome.hitChance * 100);
  const critPct = Math.round(outcome.critChance * 100);
  if (!outcome.didHit) {
    return `${attacker.name} uses ${skillName}: miss (${hitPct}% hit chance).`;
  }
  const critText = outcome.critOccurred ? " Critical hit!" : "";
  const damage = Math.round(outcome.damage);
  return `${attacker.name} uses ${skillName} on ${defender.name}: ${damage} damage (${hitPct}% hit, ${critPct}% crit).${critText}`;
}

function collectEncounterRewards(encounter, state) {
  const rewards = encounter?.rewards ? shallowClone(encounter.rewards) : {};
  if (!rewards.loot) rewards.loot = [];
  if (!rewards.xp) {
    const base = Math.round((encounter?.difficulty || 0.3) * 50);
    rewards.xp = base;
  }
  if (!rewards.currency) {
    rewards.currency = Math.round((encounter?.difficulty || 0.3) * 12 + state.party[0]?.level * 2);
  }
  return rewards;
}

function summarizeInjuries(state) {
  const injuries = [];
  state.party.forEach((member, index) => {
    const start = state.startingResources[index];
    if (!start) return;
    const diffHp = Math.max(0, Math.round(start.hp - member.resources.hp));
    const diffMp = Math.max(0, Math.round(start.mp - member.resources.mp));
    const diffStamina = Math.max(0, Math.round(start.stamina - member.resources.stamina));
    if (diffHp > 0 || diffMp > 0 || diffStamina > 0 || member.resources.hp <= 0) {
      injuries.push({
        id: member.id,
        name: member.name,
        hpLost: diffHp,
        mpLost: diffMp,
        staminaLost: diffStamina,
        downed: member.resources.hp <= 0,
      });
    }
  });
  return injuries;
}

function finalizeEncounter(state, resolve) {
  if (state.resolved) return;
  state.resolved = true;
  if (typeof state.cleanup === "function") {
    try {
      state.cleanup();
    } catch (err) {
      console.error("Failed to clean up combat encounter", err);
    }
  }
  showBackControl();
  const outcome = {
    success: state.victory,
    fled: state.fled,
    defeat: state.defeat,
    summary: state.victory ? "Victory" : state.defeat ? "Defeated" : state.fled ? "Retreated" : "Resolved",
    narrative: {
      scene: state.encounter.summary,
      outcome: state.victory
        ? "You overcome the threat and steady your breathing."
        : state.fled
        ? "You break away from the melee and put distance between you and danger."
        : "The encounter overwhelms you, forcing a desperate retreat.",
    },
    log: state.log.slice(),
    injuries: summarizeInjuries(state),
    rewards: state.victory ? collectEncounterRewards(state.encounter, state) : null,
    partyState: {
      members: state.party.map(member => ({
        id: member.id,
        name: member.name,
        resources: { ...member.resources },
        role: member.role,
        isPlayer: member.isPlayer,
      })),
    },
    inventory: state.inventoryCopy,
  };
  resolve(outcome);
}
function enemyChooseAction(enemy, target) {
  const viable = Array.isArray(enemy.actions) && enemy.actions.length ? enemy.actions : DEFAULT_WEAPON_ACTIONS;
  return pickRandom(viable);
}

function isPartyDefeated(state) {
  return state.party.every(member => member.resources.hp <= 0);
}

function areEnemiesDefeated(state) {
  return state.enemies.every(enemy => enemy.resources.hp <= 0);
}

function handleItemUse(state, action) {
  const active = state.party[state.activePartyIndex];
  if (!active) return "No one to receive the item.";
  const potency = Number(action.potency) || 0.25;
  let message = `${active.name} uses ${action.label}.`;
  if (action.effect === "heal") {
    const amount = Math.round(active.resources.hpMax * potency);
    active.resources.hp = clamp(active.resources.hp + amount, 0, active.resources.hpMax);
    message += ` Restored ${amount} HP.`;
  } else if (action.effect === "mana") {
    const amount = Math.round(active.resources.mpMax * potency);
    active.resources.mp = clamp(active.resources.mp + amount, 0, active.resources.mpMax);
    message += ` Restored ${amount} MP.`;
  } else if (action.effect === "stamina") {
    const amount = Math.round(active.resources.staminaMax * potency);
    active.resources.stamina = clamp(active.resources.stamina + amount, 0, active.resources.staminaMax);
    message += ` Recovered ${amount} stamina.`;
  }
  const idx = action.inventoryIndex;
  if (Number.isInteger(idx) && state.inventoryCopy[idx]) {
    const entry = state.inventoryCopy[idx];
    entry.qty = Math.max(0, (Number(entry.qty) || 1) - 1);
    if (entry.qty === 0) {
      state.inventoryCopy.splice(idx, 1);
    }
  }
  return message;
}

function attemptFlee(state) {
  const active = state.party[state.activePartyIndex];
  const speed = active ? active.attributes.AGI + active.attributes.PER : 10;
  const enemyAlert = state.enemies.reduce((sum, enemy) => sum + (enemy.attributes.PER || 8), 0) / Math.max(1, state.enemies.length);
  const fleeChance = clamp(0.35 + (speed - enemyAlert) * 0.01, 0.15, 0.9);
  const roll = Math.random();
  const success = roll < fleeChance;
  appendLog(state, success ? "You slip free of the engagement!" : "You fail to break away.", success ? "success" : "warning");
  return success;
}

function presentCombatEncounter({ character, encounter, context }) {
  return new Promise(resolve => {
    const party = buildPartyMembers(character);
    if (!party.length) {
      resolve(null);
      return;
    }
    const state = {
      encounter,
      context,
      party,
      enemies: (encounter?.enemies || []).map(enemy => ({ ...enemy, resources: { ...enemy.resources } })),
      activePartyIndex: 0,
      activeEnemyIndex: 0,
      log: [],
      actions: { weapons: [], spells: [], items: [], swap: [], flee: [] },
      inventoryCopy: Array.isArray(party[0]?.inventory) ? party[0].inventory.map(item => ({ ...item })) : [],
      startingResources: party.map(member => ({ ...member.resources })),
      victory: false,
      defeat: false,
      fled: false,
      resolved: false,
      title: encounter?.title || "Combat Encounter",
      subtitle: encounter?.foreshadow || "The air hums with tension.",
    };
    if (!state.enemies.length) {
      state.enemies = spawnEnemies({ archetype: "bandit", difficulty: 0.3, id: "fallback", title: "Skirmish" }, character, context);
    }
    hideBackControl();
    setMainContent(renderCombatMinigameHTML(state));
    updateMenuSizing();
    updateStatusUI(state);
    updateActionPanels(state);
    appendLog(state, encounter?.foreshadow || "You brace for trouble.", "info");

    const main = getMainElement();
    if (!main) {
      finalizeEncounter(state, resolve);
      return;
    }

    ensurePanel(main, DEFAULT_PANEL);

    const handleTabClick = event => {
      const panelName = event.currentTarget?.dataset.panel;
      if (!panelName) return;
      ensurePanel(main, panelName);
    };
    main.querySelectorAll(".combat-minigame-tab").forEach(tab => {
      tab.addEventListener("click", handleTabClick);
    });

    const handleActionClick = event => {
      const button = event.target.closest(".combat-action");
      if (!button) return;
      const panelName = button.dataset.panel || DEFAULT_PANEL;
      const actionId = button.dataset.actionId;
      const actionList = state.actions[panelName] || [];
      const action = actionList.find(entry => entry.id === actionId);
      if (!action || state.turnLocked) return;
      if (action.disabled) return;
      state.turnLocked = true;
      if (panelName === "items") {
        const message = handleItemUse(state, action);
        appendLog(state, message, "info");
        updateStatusUI(state);
        updateActionPanels(state);
        state.turnLocked = false;
        return;
      }
      if (panelName === "swap") {
        if (action.targetIndex != null && action.targetIndex !== state.activePartyIndex) {
          state.activePartyIndex = action.targetIndex;
          appendLog(state, `${state.party[state.activePartyIndex].name} takes the front line.`, "info");
          updateStatusUI(state);
          updateActionPanels(state);
        }
        state.turnLocked = false;
        return;
      }
      if (panelName === "flee") {
        const escaped = attemptFlee(state);
        if (escaped) {
          state.fled = true;
          finalizeEncounter(state, resolve);
          return;
        }
        state.turnLocked = false;
        updateActionPanels(state);
        return;
      }
      executeCombatRound(state, action, resolve);
    };

    main.addEventListener("click", handleActionClick);

    const cancelBtn = main.querySelector(".combat-minigame-cancel");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        state.fled = true;
        appendLog(state, "You disengage from the encounter.", "warning");
        finalizeEncounter(state, resolve);
      });
    }

    const handleKeydown = event => {
      if (event.key === "Escape") {
        event.preventDefault();
        state.fled = true;
        appendLog(state, "You call for a retreat!", "warning");
        finalizeEncounter(state, resolve);
      }
    };
    document.addEventListener("keydown", handleKeydown, true);

    state.cleanup = () => {
      document.removeEventListener("keydown", handleKeydown, true);
      if (main) main.removeEventListener("click", handleActionClick);
    };
  });
}

function executeCombatRound(state, action, resolve) {
  const attacker = state.party[state.activePartyIndex];
  const defender = state.enemies.find(enemy => enemy.resources.hp > 0) || state.enemies[state.activeEnemyIndex];
  if (!attacker || !defender) {
    finalizeEncounter(state, resolve);
    return;
  }
  performResourceCosts(attacker, action.cost);
  const outcome = calculateActionOutcome(attacker, defender, action);
  applyDamage(defender, outcome.damage);
  appendLog(state, describeOutcome(attacker, defender, action, outcome), outcome.didHit ? "success" : "warning");
  updateStatusUI(state);
  if (areEnemiesDefeated(state)) {
    state.victory = true;
    appendLog(state, "The enemies fall silent.", "success");
    finalizeEncounter(state, resolve);
    return;
  }
  enemyTurn(state, resolve);
}

function enemyTurn(state, resolve) {
  const enemy = state.enemies.find(e => e.resources.hp > 0);
  if (!enemy) {
    state.victory = true;
    finalizeEncounter(state, resolve);
    return;
  }
  state.activeEnemyIndex = state.enemies.indexOf(enemy);
  const target = state.party.find(member => member.resources.hp > 0);
  if (!target) {
    state.defeat = true;
    finalizeEncounter(state, resolve);
    return;
  }
  const action = enemyChooseAction(enemy, target);
  performResourceCosts(enemy, action.cost);
  const outcome = calculateActionOutcome(enemy, target, action);
  applyDamage(target, outcome.damage);
  appendLog(state, describeOutcome(enemy, target, action, outcome), outcome.didHit ? "danger" : "info");
  updateStatusUI(state);
  if (isPartyDefeated(state)) {
    state.defeat = true;
    appendLog(state, "Your party collapses under the assault.", "danger");
    finalizeEncounter(state, resolve);
    return;
  }
  updateActionPanels(state);
  state.turnLocked = false;
}

export { presentCombatEncounter, maybeTriggerCombatEncounter };
