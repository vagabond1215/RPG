/** Helpers for race-based starting attributes & cap checks */

/** Core attribute keys (Luck intentionally excluded here) */
export const ATTRS = ["STR","DEX","CON","VIT","AGI","INT","WIS","CHA"];
export const RACE_ATTRS = {
  Human:      { STR:10, DEX:10, CON:10, VIT:10, AGI:10, INT:10, WIS:10, CHA:10 },

  Elf:        { STR: 6, DEX:14, CON: 6, VIT: 6, AGI:14, INT:14, WIS:10, CHA:10 },
  "Dark Elf": { STR:10, DEX:14, CON: 6, VIT: 6, AGI:14, INT:14, WIS:10, CHA: 6 },

  Gnome:      { STR: 6, DEX:10, CON: 8, VIT:10, AGI: 8, INT:14, WIS:14, CHA:10 },
  Dwarf:      { STR:14, DEX: 6, CON:14, VIT:14, AGI: 6, INT: 6, WIS:10, CHA:10 },

  "Cait Sith":{ STR:10, DEX:14, CON: 8, VIT: 6, AGI:14, INT: 6, WIS: 8, CHA:14 },
  Salamander: { STR:14, DEX: 6, CON:14, VIT:14, AGI: 6, INT:10, WIS:10, CHA: 6 },

  Halfling:   { STR: 8, DEX:14, CON: 8, VIT: 8, AGI:14, INT: 8, WIS: 8, CHA:12 }
};

/** Get a deep copy so callers don’t mutate the table by accident */
export function getRaceStartingAttributes(race) {
  const src = RACE_ATTRS[race];
  if (!src) throw new Error(`Unknown race: ${race}`);
  return { ...src };
}

/** Verifier: checks sum==80 and bounds [6,14] for each attr; throws on failure */
export function verifyRaceTable(table = RACE_ATTRS) {
  const keys = Object.keys(table);
  for (const race of keys) {
    const a = table[race];
    if (!a) throw new Error(`Missing attr block for ${race}`);
    let sum = 0;
    for (const k of ATTRS) {
      const v = a[k];
      if (typeof v !== 'number') throw new Error(`Invalid attr ${k} for ${race}`);
      if (v < 6 || v > 14) throw new Error(`${race} ${k} out of bounds`);
      sum += v;
    }
    if (sum !== 80) throw new Error(`${race} attrs must sum to 80`);
  }
}

export const RACE_DESCRIPTIONS = {
  Human: "Balanced and adaptable, Humans thrive in nearly any role without excelling in one particular area. With steady strength, endurance, and intellect, they lack the glaring weaknesses or extreme strengths of other races. This versatility makes them reliable adventurers, capable of learning any discipline and finding success through persistence and adaptability.",
  Elf: "Graceful and wise, Elves are renowned for their natural agility and affinity with magic. Their lithe frames grant them great speed and precision, and their intellect allows them to master spells with ease. However, their fragile bodies and low resilience make them vulnerable in prolonged physical combat. Elves shine as swift archers, cunning spellcasters, or nimble scouts, but must rely on their finesse and insight rather than brute force.",
  "Dark Elf": "Mysterious and cunning, Dark Elves blend physical finesse with potent arcane power. They strike swiftly and think sharply, excelling at ambush and assassination, with natural talent for dark or destructive magic. Yet their vitality is weak, and they endure fewer hardships than sturdier races. Distrusted for their sinister aura and often lacking charm, Dark Elves rely on speed, precision, and raw arcane force rather than resilience or diplomacy.",
  Gnome: "Inventive and clever, Gnomes possess keen minds and a natural talent for magic and craft. Their small stature limits their physical strength and agility, but their resilience and wit keep them alive where brute force fails. Gnomes excel in roles that require intellect, resourcefulness, and creative problem-solving. Though not the quickest or toughest adventurers, they are often underestimated until their ingenuity and magical knowledge turn the tide.",
  Dwarf: "Stout and unyielding, Dwarves are paragons of strength and endurance. Their powerful bodies and iron will make them formidable warriors and tireless workers, able to withstand punishment that would fell other races. However, their shorter frames leave them slower and less agile, and their talent for magic is limited. Dwarves shine in close combat and defensive roles, standing as immovable walls on the battlefield, though they may struggle in fields requiring finesse or sorcery.",
  "Cait Sith": "Playful and charismatic, Cait Sith are agile tricksters blessed with feline grace and natural charm. Their speed and dexterity allow them to strike swiftly and evade danger, while their charisma makes them natural leaders or manipulators. However, their slender builds leave them physically weaker and less resilient, and their whimsical nature makes them less focused on study or wisdom. Cait Sith thrive in roles that reward speed, wit, and social cleverness, but falter in brute combat or sustained magical pursuits.",
  Salamander: "Fierce and enduring, Salamanders are warriors born of fire and stone. Their immense strength and resilience make them natural frontline fighters, capable of withstanding devastating blows and returning them with interest. Yet their size and power come at the cost of speed and grace, and their fiery tempers often clash with subtler arts such as diplomacy or advanced study. Salamanders excel as powerful tanks and brawlers, though they may lag behind in finesse or charm.",
  Halfling: "Lighthearted and quick-footed, Halflings are nimble survivors who thrive on agility and wit. Though not particularly strong or magically gifted, their dexterity, quick reactions, and affable charm make them versatile adventurers. They are surprisingly resilient for their size, relying on cunning and luck to avoid danger. Halflings excel as rogues, scouts, and diplomats, turning their speed and charisma into reliable strengths, though they struggle in raw physical or magical power."
};
