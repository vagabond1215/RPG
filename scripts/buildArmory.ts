import { readFile, writeFile } from "fs/promises";
import slugify from "slugify";
import { cpToCoins } from "../data/economy/currency.js";
import { generateWeaponDescription } from "./descriptionGenerator";

type WeaponQuality = "Standard" | "Fine" | "Masterwork";

type ArmorPen = "Low" | "Low-Medium" | "Medium" | "Medium-High" | "High" | "Very High";

type Reach = "Very Short" | "Short" | "Short/Medium" | "Medium" | "Medium/Long" | "Long" | "Very Long";

type WeaponSize = "Tiny" | "Small" | "Medium" | "Large" | "Very Large";

interface WeaponEntry {
  name: string;
  region: string;
  size: WeaponSize;
  hands: 1 | 2;
  reach: Reach;
  description: string;
  fightingStyle: string;
  attackSpeed: number;
  damage: number;
  armorPen: ArmorPen;
}

const ARMORY_SOURCE: Record<string, WeaponEntry[]> = {
  swords: [
    {
      name: "Arming Sword",
      region: "High Kingdoms",
      size: "Medium",
      hands: 1,
      reach: "Medium",
      description:
        "A straight double-edged steel blade (~75 cm) with a dark-iron cruciform guard, leather-wrapped grip over cord, and a rounded steel pommel engraved with simple sigils; balanced, serviceable, and kept bright with oil.",
      fightingStyle: "Balanced cut and thrust; commonly paired with shield",
      attackSpeed: 7.0,
      damage: 5.0,
      armorPen: "Medium",
    },
    {
      name: "Longsword",
      region: "High Kingdoms",
      size: "Large",
      hands: 2,
      reach: "Very Long",
      description:
        "Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust.",
      fightingStyle: "Two-handed leverage; sweeping slashes and strong thrusts",
      attackSpeed: 6.0,
      damage: 6.5,
      armorPen: "Medium-High",
    },
    {
      name: "Great Sword",
      region: "Northern Marches",
      size: "Very Large",
      hands: 2,
      reach: "Very Long",
      description:
        "A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks.",
      fightingStyle: "Power strokes, wide arcs, line-breaking presence",
      attackSpeed: 5.5,
      damage: 7.0,
      armorPen: "High",
    },
    {
      name: "Two-Hand Colossus",
      region: "Borderlands",
      size: "Very Large",
      hands: 2,
      reach: "Very Long",
      description:
        "Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach.",
      fightingStyle: "Crushing cleaves and long-reach thrusts; slow recoveries",
      attackSpeed: 3.5,
      damage: 9.5,
      armorPen: "High",
    },
    {
      name: "Falchion",
      region: "High Kingdoms",
      size: "Medium",
      hands: 1,
      reach: "Medium",
      description:
        "Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor.",
      fightingStyle: "Heavy slashes and choppers; excels against light armor",
      attackSpeed: 7.0,
      damage: 5.5,
      armorPen: "Medium",
    },
    {
      name: "Estoc",
      region: "Borderlands",
      size: "Medium",
      hands: 1,
      reach: "Medium",
      description:
        "Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate.",
      fightingStyle: "Precise stabs into armor seams; binds and windings",
      attackSpeed: 6.5,
      damage: 6.0,
      armorPen: "High",
    },
    {
      name: "Short Guardblade",
      region: "Borderlands",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors.",
      fightingStyle: "Close-in slashes and quick parries",
      attackSpeed: 7.5,
      damage: 4.5,
      armorPen: "Medium",
    },
    {
      name: "Steppe Sabre",
      region: "Southern Steppes",
      size: "Medium",
      hands: 1,
      reach: "Medium",
      description:
        "Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion.",
      fightingStyle: "Mounted draw-cuts and fluid passing strikes",
      attackSpeed: 6.8,
      damage: 5.8,
      armorPen: "Medium",
    },
    {
      name: "Eastern Straightblade",
      region: "Eastern Realms",
      size: "Small",
      hands: 1,
      reach: "Short/Medium",
      description:
        "Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise.",
      fightingStyle: "Precision fencing, balanced cuts and thrusts",
      attackSpeed: 7.5,
      damage: 4.8,
      armorPen: "Medium",
    },
    {
      name: "Blade of the Tide",
      region: "Island Clans",
      size: "Medium",
      hands: 2,
      reach: "Long",
      description:
        "Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen.",
      fightingStyle: "Two-handed draw-cuts and precise diagonal slashes",
      attackSpeed: 6.5,
      damage: 6.2,
      armorPen: "Medium-High",
    },
    {
      name: "Great-Edge",
      region: "Island Clans",
      size: "Very Large",
      hands: 2,
      reach: "Very Long",
      description:
        "Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight.",
      fightingStyle: "Sweeping, space-hungry strikes; anti-cavalry limb-cleavers",
      attackSpeed: 3.2,
      damage: 9.2,
      armorPen: "High",
    },
    {
      name: "Companion Blade",
      region: "Island Clans",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes.",
      fightingStyle: "Defensive parries, opportunistic ripostes",
      attackSpeed: 7.8,
      damage: 4.5,
      armorPen: "Medium",
    },
  ],
  daggers: [
    {
      name: "Misericorde",
      region: "High Kingdoms",
      size: "Tiny",
      hands: 1,
      reach: "Very Short",
      description:
        "Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust.",
      fightingStyle: "Finishing thrusts into armor gaps",
      attackSpeed: 10.0,
      damage: 2.0,
      armorPen: "High",
    },
    {
      name: "Rondel",
      region: "High Kingdoms",
      size: "Tiny",
      hands: 1,
      reach: "Very Short",
      description:
        "Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure.",
      fightingStyle: "Armor-piercing thrusts, close grapples",
      attackSpeed: 9.5,
      damage: 2.3,
      armorPen: "High",
    },
    {
      name: "Push-Spike",
      region: "Southern Kingdoms",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons.",
      fightingStyle: "Punching stabs; breaks through layered armor",
      attackSpeed: 9.0,
      damage: 2.8,
      armorPen: "Medium-High",
    },
    {
      name: "Piercer",
      region: "Eastern Realms",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints.",
      fightingStyle: "Silent entries, seam strikes, assassin’s work",
      attackSpeed: 8.5,
      damage: 3.0,
      armorPen: "High",
    },
    {
      name: "Curved Twin-Edge",
      region: "Southern Kingdoms",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters.",
      fightingStyle: "Snapping slashes with opportunistic thrusts",
      attackSpeed: 8.5,
      damage: 2.6,
      armorPen: "Medium",
    },
    {
      name: "Wavesong Dagger",
      region: "Island Clans",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite.",
      fightingStyle: "Cutting draws and shallow pierces",
      attackSpeed: 8.0,
      damage: 2.7,
      armorPen: "Medium",
    },
    {
      name: "Cairn Dirk",
      region: "Northern Marches",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company.",
      fightingStyle: "Close thrusts and quick chops",
      attackSpeed: 8.5,
      damage: 3.2,
      armorPen: "Medium",
    },
  ],
  axes: [
    {
      name: "Long-Haft War Axe",
      region: "Northern Marches",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves.",
      fightingStyle: "Wide arcs and shield rips",
      attackSpeed: 4.8,
      damage: 7.8,
      armorPen: "Medium",
    },
    {
      name: "Throwing Axe",
      region: "Northern Marches",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip.",
      fightingStyle: "Pre-melee volleys to disrupt formations",
      attackSpeed: 3.0,
      damage: 5.0,
      armorPen: "Medium",
    },
    {
      name: "Long-Blade Axe",
      region: "Borderlands",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes.",
      fightingStyle: "Cleaving strikes that punish clustered foes",
      attackSpeed: 4.2,
      damage: 8.2,
      armorPen: "High",
    },
    {
      name: "Hooked War Axe",
      region: "Borderlands",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments.",
      fightingStyle: "Hook, yank, and hew; shield killers",
      attackSpeed: 4.0,
      damage: 8.5,
      armorPen: "High",
    },
    {
      name: "Bearded Axe",
      region: "Northern Marches",
      size: "Medium",
      hands: 1,
      reach: "Medium",
      description:
        "Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control.",
      fightingStyle: "Disarms, beard-hooks, sharp chops",
      attackSpeed: 6.0,
      damage: 6.5,
      armorPen: "Medium",
    },
    {
      name: "Crescent Battleaxe",
      region: "Eastern Realms",
      size: "Medium",
      hands: 1,
      reach: "Short/Medium",
      description:
        "Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes.",
      fightingStyle: "Fast cuts against unarmored or padded foes",
      attackSpeed: 6.8,
      damage: 5.0,
      armorPen: "Medium",
    },
  ],
  polearms: [
    {
      name: "Halberd",
      region: "High Kingdoms",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition.",
      fightingStyle: "Thrust to pin, hook to pull, axe to finish",
      attackSpeed: 4.5,
      damage: 8.8,
      armorPen: "High",
    },
    {
      name: "Glaive",
      region: "High Kingdoms",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing.",
      fightingStyle: "Sweeping cuts and perimeter control",
      attackSpeed: 5.0,
      damage: 7.8,
      armorPen: "Medium-High",
    },
    {
      name: "Partisan Spear",
      region: "High Kingdoms",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates.",
      fightingStyle: "Thrusts, blade parries, rank-fighting stability",
      attackSpeed: 5.2,
      damage: 7.0,
      armorPen: "High",
    },
    {
      name: "Beak-Hammer",
      region: "Borderlands",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate.",
      fightingStyle: "Armor-breaking smashes and beak thrusts",
      attackSpeed: 4.0,
      damage: 9.0,
      armorPen: "Very High",
    },
    {
      name: "Lucent Warhammer",
      region: "Borderlands",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor.",
      fightingStyle: "Brutal impacts; spikes for penetrating follow-through",
      attackSpeed: 3.8,
      damage: 9.5,
      armorPen: "Very High",
    },
    {
      name: "Winding Spear",
      region: "Island Clans",
      size: "Medium",
      hands: 2,
      reach: "Long",
      description:
        "Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting.",
      fightingStyle: "Line formations, thrust fencing, choke-ups",
      attackSpeed: 5.8,
      damage: 7.0,
      armorPen: "High",
    },
    {
      name: "River-Blade",
      region: "Island Clans",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water.",
      fightingStyle: "Sweeping anti-cavalry slashes and flank cuts",
      attackSpeed: 5.0,
      damage: 7.8,
      armorPen: "Medium-High",
    },
    {
      name: "Trident Fork",
      region: "Southern Steppes",
      size: "Medium",
      hands: 2,
      reach: "Medium",
      description:
        "Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers.",
      fightingStyle: "Thrust, catch, and control; excels near shorelines",
      attackSpeed: 5.2,
      damage: 7.0,
      armorPen: "High",
    },
    {
      name: "Axe-Knife Polearm",
      region: "Southern Steppes",
      size: "Medium",
      hands: 1,
      reach: "Medium",
      description:
        "Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe.",
      fightingStyle: "Close-quarters chopping and thrusting",
      attackSpeed: 5.5,
      damage: 6.8,
      armorPen: "Medium-High",
    },
  ],
  ranged: [
    {
      name: "Greatbow",
      region: "High Kingdoms",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Tall self-bow of yew or elm; horn nocks and linen string; goose-fletched heavy arrows in ash quiver; oiled leather grip and bracer.",
      fightingStyle: "Massed volleys and long-range interdiction",
      attackSpeed: 4.5,
      damage: 7.0,
      armorPen: "High",
    },
    {
      name: "Composite Recurve",
      region: "Southern Steppes",
      size: "Medium",
      hands: 1,
      reach: "Medium/Long",
      description:
        "Reflex-recurve bow of wood, horn, and sinew glued and wrapped under birch bark; short and powerful for saddle archery; rawhide case against rain.",
      fightingStyle: "Fast shooting on the move; skirmish dominance",
      attackSpeed: 5.0,
      damage: 6.8,
      armorPen: "High",
    },
    {
      name: "Asymmetrical Longbow",
      region: "Island Clans",
      size: "Large",
      hands: 2,
      reach: "Very Long",
      description:
        "Long, uneven limbs of laminated hardwood; silk bowstring; lacquered grip; practiced draw from standing or kneel with ritual poise.",
      fightingStyle: "Deliberate long-range marksmanship and volley fire",
      attackSpeed: 4.2,
      damage: 6.5,
      armorPen: "High",
    },
    {
      name: "Heavy Crossbow",
      region: "High Kingdoms",
      size: "Large",
      hands: 2,
      reach: "Medium",
      description:
        "Steel prod on a stout wooden tiller; windlass or cranequin draw; quarrels with bodkin heads; trigger and stirrup in black iron.",
      fightingStyle: "Devastating bolts; slow to reload",
      attackSpeed: 1.0,
      damage: 9.0,
      armorPen: "Very High",
    },
    {
      name: "Hand Crossbow",
      region: "High Kingdoms",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Compact wooden tiller with light steel prod; simple spanning lever; short bolts in a belt case; concealable beneath cloaks.",
      fightingStyle: "Ambush tool; quick shots at close range",
      attackSpeed: 2.0,
      damage: 4.5,
      armorPen: "Medium",
    },
    {
      name: "Repeating Crossbow",
      region: "Eastern Realms",
      size: "Medium",
      hands: 2,
      reach: "Short/Medium",
      description:
        "Magazine-fed lever crossbow of lacquered wood and iron; slim bolts drop from a top box; trades power for relentless rate.",
      fightingStyle: "Volume over punch; suppressive shooting",
      attackSpeed: 6.0,
      damage: 3.0,
      armorPen: "Low-Medium",
    },
  ],
  chains: [
    {
      name: "Chain Morning Star",
      region: "High Kingdoms",
      size: "Medium",
      hands: 1,
      reach: "Short/Medium",
      description:
        "Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks.",
      fightingStyle: "Circular momentum strikes; wraps and sudden snaps",
      attackSpeed: 5.5,
      damage: 7.2,
      armorPen: "High",
    },
    {
      name: "Meteor Chain",
      region: "Southern Steppes",
      size: "Medium",
      hands: 2,
      reach: "Long",
      description:
        "Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify.",
      fightingStyle: "Wide swings, entanglement tactics, punishing impacts",
      attackSpeed: 4.0,
      damage: 8.0,
      armorPen: "Medium-High",
    },
  ],
  whips: [
    {
      name: "Punisher Lash",
      region: "Eastern Realms",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve.",
      fightingStyle: "Rapid lacerations, disarms, stance disruption",
      attackSpeed: 9.0,
      damage: 3.5,
      armorPen: "Low",
    },
    {
      name: "Scorpion Whip",
      region: "Southern Kingdoms",
      size: "Medium",
      hands: 2,
      reach: "Medium",
      description:
        "Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear.",
      fightingStyle: "Wraps, tears, and control; risky in close press",
      attackSpeed: 6.5,
      damage: 5.5,
      armorPen: "Medium",
    },
  ],
  staves: [
    {
      name: "Quarterstaff",
      region: "High Villages",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards.",
      fightingStyle: "Thrusts, strikes, parries; excellent reach discipline",
      attackSpeed: 7.0,
      damage: 4.5,
      armorPen: "Low-Medium",
    },
    {
      name: "Ironwood Staff",
      region: "Eastern Realms",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters.",
      fightingStyle: "Heavy blocks and sweeping counters",
      attackSpeed: 7.2,
      damage: 4.5,
      armorPen: "Low-Medium",
    },
    {
      name: "Short Staff",
      region: "Island Clans",
      size: "Medium",
      hands: 2,
      reach: "Medium",
      description:
        "Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys.",
      fightingStyle: "Quick transitions between strikes and traps",
      attackSpeed: 7.5,
      damage: 4.0,
      armorPen: "Low-Medium",
    },
  ],
  martial: [
    {
      name: "Twin Sai",
      region: "Island Clans",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Pair of trident-shaped steel batons with square shafts; prongs for trapping and wrenching; iron-ringed hilts and lacquered grips; no edge, all control.",
      fightingStyle: "Parry, trap, and thrust; blade control",
      attackSpeed: 8.5,
      damage: 2.5,
      armorPen: "Low",
    },
    {
      name: "Tonfa Pair",
      region: "Island Clans",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Side-handled batons of hard wood with rounded ends; leather thong lanyards; designed for rotational strikes, lever blocks, and joint pressure.",
      fightingStyle: "Rotational blows, locking blocks, joint pressure",
      attackSpeed: 8.0,
      damage: 3.0,
      armorPen: "Low-Medium",
    },
    {
      name: "Emei Rods",
      region: "Eastern Realms",
      size: "Tiny",
      hands: 1,
      reach: "Very Short",
      description:
        "Slim twin steel rods worn on the fingers or palmed; blued finish for low glare; disappear up the sleeve and reappear as quick punctures.",
      fightingStyle: "Rapid punctures and feints in close clinch",
      attackSpeed: 9.5,
      damage: 1.8,
      armorPen: "Low",
    },
    {
      name: "Tiger Claws",
      region: "Southern Steppes",
      size: "Tiny",
      hands: 1,
      reach: "Very Short",
      description:
        "Hand-worn frame of brass knuckle plates mounting four curved steel talons (~8 cm) per hand; oiled leather straps dyed deep red anchor the fit; edges slightly blued to resist rust.",
      fightingStyle: "Rakes and grapples; targets tendons and face",
      attackSpeed: 10.0,
      damage: 1.8,
      armorPen: "Low",
    },
    {
      name: "Knuckle Gauntlet",
      region: "Island Clans",
      size: "Tiny",
      hands: 1,
      reach: "Very Short",
      description:
        "Leather glove with riveted steel knuckle plates and palm bar; some feature spike studs; a brawler’s answer to daggers in the clinch.",
      fightingStyle: "Close punches and clinch control",
      attackSpeed: 9.5,
      damage: 2.0,
      armorPen: "Low",
    },
  ],
  maces: [
    {
      name: "Spiked Morning Star",
      region: "High Kingdoms",
      size: "Medium",
      hands: 1,
      reach: "Short",
      description:
        "Rigid ash haft capped with a solid steel ball bristling with pyramidal spikes; iron langets protect the wood; brutal, simple, and cheap to keep.",
      fightingStyle: "Overhand crashes and shield-busting blows",
      attackSpeed: 5.8,
      damage: 7.0,
      armorPen: "High",
    },
    {
      name: "Flanged Mace",
      region: "Borderlands",
      size: "Medium",
      hands: 1,
      reach: "Short",
      description:
        "Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates.",
      fightingStyle: "Short-range battering; targets helms and pauldrons",
      attackSpeed: 5.5,
      damage: 7.2,
      armorPen: "High",
    },
    {
      name: "Iron-Studded Great Club",
      region: "Island Clans",
      size: "Very Large",
      hands: 2,
      reach: "Long",
      description:
        "Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear.",
      fightingStyle: "Crushing sweeps and pounding overhead smashes",
      attackSpeed: 3.0,
      damage: 9.2,
      armorPen: "High",
    },
  ],
};

const CATEGORY_BASE_PRICE: Record<string, number> = {
  swords: 720,
  daggers: 220,
  axes: 900,
  polearms: 820,
  ranged: 1000,
  chains: 780,
  whips: 240,
  staves: 160,
  martial: 180,
  maces: 760,
};

const SIZE_MULTIPLIERS: Record<WeaponSize, number> = {
  Tiny: 0.6,
  Small: 0.8,
  Medium: 1,
  Large: 1.25,
  "Very Large": 1.6,
};

const HAND_MULTIPLIERS: Record<1 | 2, number> = {
  1: 1,
  2: 1.2,
};

const REACH_MULTIPLIERS: Record<Reach, number> = {
  "Very Short": 0.82,
  Short: 0.9,
  "Short/Medium": 0.95,
  Medium: 1,
  "Medium/Long": 1.05,
  Long: 1.15,
  "Very Long": 1.25,
};

const ARMOR_PEN_MULTIPLIERS: Record<ArmorPen, number> = {
  Low: 0.88,
  "Low-Medium": 0.94,
  Medium: 1,
  "Medium-High": 1.12,
  High: 1.28,
  "Very High": 1.45,
};

const QUALITY_CONFIG: Record<WeaponQuality, {
  qualityTier: "Common" | "Fine" | "Luxury";
  priceMultiplier: number;
  materialRatio: number;
  laborRatio: number;
  overheadRatio: number;
  taxPct: number;
  primaryConsumer: "Military" | "Artisan" | "Noble";
  valueDense: boolean;
}> = {
  Standard: {
    qualityTier: "Common",
    priceMultiplier: 1,
    materialRatio: 0.35,
    laborRatio: 0.3,
    overheadRatio: 0.08,
    taxPct: 0.06,
    primaryConsumer: "Military",
    valueDense: false,
  },
  Fine: {
    qualityTier: "Fine",
    priceMultiplier: 1.45,
    materialRatio: 0.4,
    laborRatio: 0.32,
    overheadRatio: 0.09,
    taxPct: 0.12,
    primaryConsumer: "Artisan",
    valueDense: false,
  },
  Masterwork: {
    qualityTier: "Luxury",
    priceMultiplier: 2.35,
    materialRatio: 0.44,
    laborRatio: 0.34,
    overheadRatio: 0.11,
    taxPct: 0.35,
    primaryConsumer: "Noble",
    valueDense: true,
  },
};

function round(value: number, digits = 3): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function computeCategoryAverages(): Record<string, number> {
  const averages: Record<string, number> = {};
  for (const [category, entries] of Object.entries(ARMORY_SOURCE)) {
    const sum = entries.reduce((total, weapon) => total + weapon.damage * weapon.attackSpeed, 0);
    averages[category] = entries.length ? sum / entries.length : 1;
  }
  return averages;
}

const CATEGORY_PERFORMANCE_AVG = computeCategoryAverages();

function performanceFactor(category: string, weapon: WeaponEntry): number {
  const baseline = CATEGORY_PERFORMANCE_AVG[category] || 1;
  const perf = weapon.damage * weapon.attackSpeed;
  const ratio = perf / baseline;
  return Math.pow(ratio, 0.3);
}

function rangedAdjust(name: string): number {
  if (/crossbow/i.test(name)) {
    if (/hand/i.test(name)) return 0.85;
    if (/repeating/i.test(name)) return 0.9;
    return 1.35;
  }
  if (/greatbow/i.test(name)) return 1.2;
  if (/longbow/i.test(name)) return 1.15;
  if (/recurve/i.test(name)) return 1.05;
  return 1;
}

function computeBasePrice(category: string, weapon: WeaponEntry): number {
  const base = CATEGORY_BASE_PRICE[category] || 500;
  const size = SIZE_MULTIPLIERS[weapon.size] ?? 1;
  const hand = HAND_MULTIPLIERS[weapon.hands] ?? 1;
  const reach = REACH_MULTIPLIERS[weapon.reach] ?? 1;
  const armor = ARMOR_PEN_MULTIPLIERS[weapon.armorPen] ?? 1;
  const perf = performanceFactor(category, weapon);
  let price = base * size * hand * reach * armor * perf;
  if (category === "ranged") {
    price *= rangedAdjust(weapon.name);
  }
  if (category === "chains" || category === "maces") {
    price *= 1.05;
  }
  if (category === "staves") {
    price = Math.max(price, 90);
  }
  if (category === "martial") {
    price = Math.max(price, 110);
  }
  const floor = base * 0.55;
  return Math.max(price, floor);
}

function computeQualityPrice(basePrice: number, quality: WeaponQuality): number {
  const cfg = QUALITY_CONFIG[quality];
  const raw = basePrice * cfg.priceMultiplier;
  return Math.max( Math.round(raw / 5) * 5, 5);
}

type WeaponVariant = WeaponEntry & {
  quality: WeaponQuality;
  priceCp: number;
  priceDisplay: string;
  descriptionFull: string;
};

async function buildArmory(): Promise<WeaponVariant[]> {
  const variants: WeaponVariant[] = [];
  for (const [category, entries] of Object.entries(ARMORY_SOURCE)) {
    for (const weapon of entries) {
      const basePrice = computeBasePrice(category, weapon);
      for (const quality of ["Standard", "Fine", "Masterwork"] as const) {
        const priceCp = computeQualityPrice(basePrice, quality);
        const descriptionFull = generateWeaponDescription(weapon, quality);
        variants.push({
          ...weapon,
          quality,
          priceCp,
          priceDisplay: cpToCoins(priceCp),
          descriptionFull,
        });
      }
    }
  }
  return variants;
}

function qualityDisplayName(weapon: WeaponEntry, quality: WeaponQuality): string {
  return quality === "Standard" ? weapon.name : `${quality} ${weapon.name}`;
}

function computeItemRecord(
  weapon: WeaponEntry,
  quality: WeaponQuality,
  priceCp: number,
  description: string,
) {
  const cfg = QUALITY_CONFIG[quality];
  const slugBase = slugify(weapon.name, { lower: true, strict: true });
  const suffix = quality === "Standard" ? "" : `-${quality.toLowerCase()}`;
  const internal_name = suffix ? `${slugBase}${suffix}` : slugBase;
  const material_cost_cp = round(priceCp * cfg.materialRatio, 3);
  const labor_cost_cp = round(priceCp * cfg.laborRatio, 3);
  const overhead_cp = round(priceCp * cfg.overheadRatio, 3);
  const tax_amount_cp = round(priceCp * cfg.taxPct, 3);
  const net_profit_cp = round(
    priceCp - material_cost_cp - labor_cost_cp - overhead_cp - tax_amount_cp,
    3,
  );
  const priceDisplay = cpToCoins(priceCp);
  return {
    category_key: "Weapons",
    internal_name,
    display_name: qualityDisplayName(weapon, quality),
    base_item: weapon.name,
    variant: quality,
    quality_tier: cfg.qualityTier,
    primary_consumer: cfg.primaryConsumer,
    unit: "each",
    market_value_cp: priceCp,
    display_price: priceDisplay,
    display_price_tidy: priceDisplay,
    suggested_price_cp: priceCp,
    suggested_display_price: priceDisplay,
    material_cost_cp,
    labor_cost_cp,
    overhead_cp,
    mc_eff: round(material_cost_cp * 0.88, 3),
    lc_eff: round(labor_cost_cp * 0.9, 3),
    effective_tax_pct: cfg.taxPct,
    tax_amount_cp,
    net_profit_cp,
    duty: false,
    duty_pct: 0,
    duty_free: false,
    regions: [weapon.region],
    import_reliant: false,
    import_tier: 0,
    export_friendly: false,
    sourcing_notes: "",
    perishable: false,
    bulky: weapon.size === "Large" || weapon.size === "Very Large",
    fragile: false,
    value_dense: cfg.valueDense,
    corridor_friendly: weapon.reach === "Short" || weapon.reach === "Very Short",
    regional_mult_in: 1,
    regional_mult_out: 1,
    sale_quantity: 1,
    bulk_discount_threshold: 0,
    bulk_discount_pct: 0,
    description,
  };
}

function keepWeaponItem(item: any): boolean {
  if (item.category_key !== "Weapons") return true;
  const base = (item.base_item || "").toLowerCase();
  const display = (item.display_name || "").toLowerCase();
  if (/arrow|bolt|javelin|dart|sling/.test(base) || /arrow|bolt|javelin|dart|sling/.test(display)) {
    return true;
  }
  if (/bow/.test(base) && /bundle/.test(display)) return true;
  return false;
}

async function updateItemsFile(records: ReturnType<typeof computeItemRecord>[]) {
  const path = "data/economy/items.json";
  const raw = await readFile(path, "utf-8");
  const data = JSON.parse(raw);
  const retained = data.filter(keepWeaponItem);
  const weapons = retained.filter((item: any) => item.category_key === "Weapons");
  const nonWeapons = retained.filter((item: any) => item.category_key !== "Weapons");
  const mergedWeapons = [...weapons, ...records];
  mergedWeapons.sort((a, b) => a.display_name.localeCompare(b.display_name));
  const updated = [...nonWeapons, ...mergedWeapons];
  await writeFile(path, JSON.stringify(updated, null, 2) + "\n");
}

async function writeArmoryData(variants: WeaponVariant[]) {
  const lines: string[] = [];
  lines.push("export type WeaponQuality = 'Standard' | 'Fine' | 'Masterwork';");
  lines.push("export interface WeaponEntry {\n  name: string;\n  region: string;\n  size: 'Tiny'|'Small'|'Medium'|'Large'|'Very Large';\n  hands: 1|2;\n  reach: 'Very Short'|'Short'|'Short/Medium'|'Medium'|'Medium/Long'|'Long'|'Very Long';\n  description: string;\n  fightingStyle: string;\n  attackSpeed: number;\n  damage: number;\n  armorPen: 'Low'|'Low-Medium'|'Medium'|'Medium-High'|'High'|'Very High';\n}");
  lines.push("export interface WeaponRecord extends WeaponEntry {\n  quality: WeaponQuality;\n  priceCp: number;\n  priceDisplay: string;\n  descriptionFull: string;\n}");
  const grouped: Record<string, WeaponVariant[]> = {};
  for (const variant of variants) {
    const category = Object.entries(ARMORY_SOURCE).find(([, entries]) => entries.some((entry) => entry.name === variant.name && entry.region === variant.region))?.[0];
    const key = category || "misc";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(variant);
  }
  lines.push("export const ARMORY: Record<string, WeaponRecord[]> = {");
  for (const [category, items] of Object.entries(grouped)) {
    lines.push(`  ${category}: [`);
    for (const item of items) {
      lines.push("    {" +
        ` name: ${JSON.stringify(item.name)},` +
        ` region: ${JSON.stringify(item.region)},` +
        ` size: ${JSON.stringify(item.size)},` +
        ` hands: ${item.hands},` +
        ` reach: ${JSON.stringify(item.reach)},` +
        ` description: ${JSON.stringify(item.description)},` +
        ` fightingStyle: ${JSON.stringify(item.fightingStyle)},` +
        ` attackSpeed: ${item.attackSpeed},` +
        ` damage: ${item.damage},` +
        ` armorPen: ${JSON.stringify(item.armorPen)},` +
        ` quality: ${JSON.stringify(item.quality)},` +
        ` priceCp: ${item.priceCp},` +
        ` priceDisplay: ${JSON.stringify(item.priceDisplay)},` +
        ` descriptionFull: ${JSON.stringify(item.descriptionFull)}` +
        " },");
    }
    lines.push("  ],");
  }
  lines.push("};");
  lines.push("");
  await writeFile("data/game/armory.ts", lines.join("\n"));
}

async function main() {
  const variants = await buildArmory();
  await writeArmoryData(variants);
  const records = variants.map((variant) =>
    computeItemRecord(variant, variant.quality, variant.priceCp, variant.descriptionFull),
  );
  await updateItemsFile(records);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
