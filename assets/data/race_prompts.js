export const RACIAL_PROMPTS = {
  "Cait Sith": "Cait Sith are feline Humanoids similar to miqo'te and Mithra from traditional fantasy RPGs.",
  Salamander: "Salamander are reptilian Humanoids similar to Au'Ra and other Humanoid reptiles from traditional fantasy RPGs."
};

export const RACE_PROPORTIONS = {
  Human: "7.5 heads tall",
  Elf: "7.5 heads tall",
  "Dark Elf": "7.5 heads tall",
  Dwarf: "4.5 heads tall",
  Gnome: "3 heads tall",
  Halfling: "4 heads tall",
  "Cait Sith": "7 heads tall",
  Salamander: "7 heads tall"
};

export function getRacialPrompt(race) {
  return RACIAL_PROMPTS[race] || "";
}

export function getRaceProportion(race) {
  return RACE_PROPORTIONS[race] || "7.5 heads tall";
}
