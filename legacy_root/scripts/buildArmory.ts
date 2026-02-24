import { readFile, writeFile } from "fs/promises";
import slugify from "slugify";
import { cpToCoins } from "../data/economy/currency.js";
import { WEAPON_QUALITIES, type WeaponQuality } from "../data/game/item_baselines";
import { generateWeaponDescription } from "./descriptionGenerator";

type ArmorPen = "Low" | "Low-Medium" | "Medium" | "Medium-High" | "High" | "Very High";

type Reach = "Very Short" | "Short" | "Short/Medium" | "Medium" | "Medium/Long" | "Long" | "Very Long";

type WeaponSize = "Tiny" | "Small" | "Medium" | "Large" | "Very Large";

type DamageComponent = "BLUNT" | "SLASH" | "PIERCE";

type OnHitEffect = {
  chancePct: number;
  power?: number;
  durationSec?: number;
  stacksMax?: number;
  powerPct?: number;
  cdSec?: number;
  tickSec?: number;
  scalesWith?: string;
  range?: string;
  description?: string;
  tags?: string[];
};

type OnHitMap = Record<string, OnHitEffect>;

interface WeaponUpgrade {
  category: string;
  name: string;
  quality: WeaponQuality;
  ap: number;
  dmgMix: Record<DamageComponent, number>;
  critChancePct: number;
  critMult: number;
  critArmorBypassPct?: number;
  onHit?: OnHitMap;
}

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
  specialEffect?: string;
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
    {
      name: "Bronze Leafblade",
      region: "High Kingdoms",
      size: "Small",
      hands: 1,
      reach: "Short/Medium",
      description:
        "Leaf-shaped bronze blade with simple crossguard, rawhide-wrapped grip, and a wood core scabbard; dependable starter steel for militia drilling.",
      fightingStyle: "Entry cuts and shield-line thrusts",
      attackSpeed: 7.2,
      damage: 4.4,
      armorPen: "Low-Medium",
    },
    {
      name: "Kopis Cutter",
      region: "Southern Kingdoms",
      size: "Medium",
      hands: 1,
      reach: "Medium",
      description:
        "Forward-curved single-edged blade with thick spine and clip point; bronze backstrap and horn grip flare; meant to chop from hip or saddle.",
      fightingStyle: "Sweeping draw-cuts and decisive chops",
      attackSpeed: 6.8,
      damage: 5.7,
      armorPen: "Medium",
    },
    {
      name: "Tegha Broadblade",
      region: "Southern Steppes",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Wide-backed steppe war blade with long ovoid grip, iron guard rings, and horsehair tassels; rides across saddles yet hews with camp-clearing weight.",
      fightingStyle: "Two-handed hews from saddle or line",
      attackSpeed: 5.8,
      damage: 7.0,
      armorPen: "Medium-High",
    },
    {
      name: "Shashka Officer Saber",
      region: "Eastern Realms",
      size: "Medium",
      hands: 1,
      reach: "Medium",
      description:
        "Slim, guardless saber of polished steel with subtly flared tip; lacquered wood grip capped in brass; carriage blade for lightning cavalry drills.",
      fightingStyle: "High-cadence slashes and ripostes",
      attackSpeed: 7.3,
      damage: 5.4,
      armorPen: "Medium",
    },
    {
      name: "Flanged Sabre",
      region: "Southern Kingdoms",
      size: "Medium",
      hands: 1,
      reach: "Medium/Long",
      description:
        "Curved desert saber with reinforced flanged spine, crescent guard, and wrapped palm swell; keeps edge keen even after biting through armor seams.",
      fightingStyle: "Armor-splitting slashes and hooking parries",
      attackSpeed: 6.7,
      damage: 5.9,
      armorPen: "Medium-High",
    },
    {
      name: "Xiphos Leaf Sword",
      region: "Southern Kingdoms",
      size: "Small",
      hands: 1,
      reach: "Short/Medium",
      description:
        "Classical leaf-shaped double edge of bright steel, bronze disk guard, and linen-wrapped grip; marches with hoplite shields into close press.",
      fightingStyle: "Shield-line stabs and tight cuts",
      attackSpeed: 7.3,
      damage: 4.9,
      armorPen: "Medium",
    },
    {
      name: "Sawtooth Falx",
      region: "Borderlands",
      size: "Large",
      hands: 2,
      reach: "Medium/Long",
      description:
        "Hooked underrealm blade with serrated inner edge, dark-etched steel, and bone-capped haft; drags shields aside before rending down.",
      fightingStyle: "Hooking pulls and brutal overhand cleaves",
      attackSpeed: 4.9,
      damage: 7.8,
      armorPen: "High",
    },
    {
      name: "City Gentle’s Cane",
      region: "High Kingdoms",
      size: "Small",
      hands: 1,
      reach: "Medium",
      description:
        "Polished walking cane with hidden slender blade, silver ferrule, and engraved knob; draws with a twist to surprise alley threats.",
      fightingStyle: "Discreet thrusts and cloak-assisted ripostes",
      attackSpeed: 7.6,
      damage: 4.2,
      armorPen: "Low-Medium",
    },
    {
      name: "Dual Set: Wakizashi Companion + Tanto Sideblade",
      region: "Island Clans",
      size: "Medium",
      hands: 2,
      reach: "Short",
      description:
        "Matched pair of lacquered scabbards holding a wakizashi and tanto; ray-skin grips in midnight cord, iron tsuba with moon motifs; danced in alternating cuts.",
      fightingStyle: "Alternating twin-blade slashes and traps",
      attackSpeed: 8.0,
      damage: 5.0,
      armorPen: "Medium",
    },
    {
      name: "Dual Set: Bronze Leafblade + Rondache Buckler",
      region: "Southern Kingdoms",
      size: "Medium",
      hands: 2,
      reach: "Short/Medium",
      description:
        "Bronze leafblade paired with a scalloped rondache buckler of layered linden and bossed steel; shield straps cinch tight for quick cover while the short sword darts between openings.",
      fightingStyle: "Shield-line feints, short jabs, and buckler shoves",
      attackSpeed: 6.6,
      damage: 4.8,
      armorPen: "Medium",
    },
    {
      name: "Dual Set: Kopis Cutter + Madu Horn Shield",
      region: "Southern Kingdoms",
      size: "Medium",
      hands: 2,
      reach: "Medium",
      description:
        "Forward-weighted kopis balanced against a paired-horn madu shield of lacquered hide; the off-hand horn spikes catch and punish while the kopis hacks from the hip.",
      fightingStyle: "Hooking horn parries into decisive chopping ripostes",
      attackSpeed: 6.1,
      damage: 5.5,
      armorPen: "Medium",
    },
    {
      name: "Dual Set: Tegha Broadblade + Sun-Kite Shield",
      region: "Southern Steppes",
      size: "Large",
      hands: 2,
      reach: "Medium/Long",
      description:
        "Heavy tegha warblade partnered with a sun-emblazoned kite shield of reinforced spruce; riders brace behind radiant lacquer before hewing outward with sweeping steel.",
      fightingStyle: "Shield-braced advance with wide cleaving counters",
      attackSpeed: 5.2,
      damage: 6.6,
      armorPen: "Medium-High",
    },
    {
      name: "Dual Set: Flanged Sabre + Buckram Round",
      region: "Southern Kingdoms",
      size: "Large",
      hands: 2,
      reach: "Medium/Long",
      description:
        "Armor-notched flanged sabre mated to a buckram-bound round shield rimmed in iron; cavalry officers wheel behind the disc to punch through armor seams then drive the saber home.",
      fightingStyle: "Shield hooks to pry guard gaps followed by flanged slashes",
      attackSpeed: 5.7,
      damage: 6.1,
      armorPen: "Medium-High",
    },
    {
      name: "Dual Set: Sawtooth Falx + Steel Tower",
      region: "Borderlands",
      size: "Very Large",
      hands: 2,
      reach: "Long",
      description:
        "Serpentine falx with serrated belly carried alongside a towering wall shield of riveted steel; assault vanguards weather volleys then hook shields aside for brutal finishing arcs.",
      fightingStyle: "Tower-covered advance with hooking cleaves that ruin lines",
      attackSpeed: 4.6,
      damage: 7.6,
      armorPen: "High",
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
    {
      name: "Tanto Sideblade",
      region: "Island Clans",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Straight-ground side dagger with ridged spine, ray-skin wrap, and horn caps; pairs with longer blades for confined quarters.",
      fightingStyle: "Close-guard slashes with thrusting ripostes",
      attackSpeed: 8.8,
      damage: 2.9,
      armorPen: "Medium",
    },
    {
      name: "Kris Wave Dagger",
      region: "Island Clans",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Undulating southern island blade of layered steels, carved hardwood grip, and silver ferrules; famed for ritual duels and stealthy cuts.",
      fightingStyle: "Snaking draw-cuts that worry wounds",
      attackSpeed: 8.2,
      damage: 3.0,
      armorPen: "Medium",
    },
    {
      name: "Karambit Claw",
      region: "Southern Kingdoms",
      size: "Tiny",
      hands: 1,
      reach: "Very Short",
      description:
        "Curved claw dagger with finger ring, darkened steel, and cord-wrapped tang; excels at hooking tendons and wrenching grips.",
      fightingStyle: "Hooking slashes and control grapples",
      attackSpeed: 9.0,
      damage: 2.7,
      armorPen: "Medium",
    },
    {
      name: "Pesh-Kabz Tusk",
      region: "Eastern Realms",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Reinforced-tang dagger with T-spine, ivory grip slabs, and tapered armor-piercing point; prized for puncturing mail and padded coats.",
      fightingStyle: "Thrust-focused armor breaches",
      attackSpeed: 8.3,
      damage: 3.1,
      armorPen: "High",
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
    {
      name: "Skeggox Hewing Axe",
      region: "Northern Marches",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Massive bearded axe with thick wedge profile, tarred ash haft, and iron hooping; winters beside hearths before marching to raid walls.",
      fightingStyle: "Limb-lopping cleaves and shield splits",
      attackSpeed: 4.4,
      damage: 8.0,
      armorPen: "High",
    },
    {
      name: "Tabargan Twinblade",
      region: "Southern Steppes",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Steppe twin axe with mirrored crescent blades and counterweighted butt spike; rawhide lashes reinforce the long riding haft.",
      fightingStyle: "Alternating hooks and horse-felling sweeps",
      attackSpeed: 4.6,
      damage: 7.6,
      armorPen: "High",
    },
    {
      name: "Moon Cleaver",
      region: "Island Clans",
      size: "Very Large",
      hands: 2,
      reach: "Long",
      description:
        "Mythic crescent of moonsteel inlaid with pale opal, lacquered haft bound in midnight silk; its arc leaves shimmering trails in dusk battles.",
      fightingStyle: "Sweeping luminous blows that unnerve ranks",
      attackSpeed: 4.1,
      damage: 8.8,
      armorPen: "Very High",
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
      name: "Guisarme Hook",
      region: "High Kingdoms",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Medieval polehook with inward-curving blade, rear spike, and beaked hook for unseating riders; ash shaft shod in iron for leverage.",
      fightingStyle: "Hook riders, drag shields, finish with thrust",
      attackSpeed: 4.6,
      damage: 8.0,
      armorPen: "High",
    },
    {
      name: "Voulge Splitter",
      region: "Northern Marches",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Burgundian poleaxe with wide cleaver blade, reinforcing straps, and spike-tipped butt; heavy enough to split pavises and gate bars.",
      fightingStyle: "Downward cleaves and braced counter-charges",
      attackSpeed: 4.4,
      damage: 8.5,
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
      name: "Naginata Guardblade",
      region: "Island Clans",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Far East guardblade with long, graceful curve, steel shoe, and silk tassel; temple guards whirl it between sweeping cuts and sliding thrusts.",
      fightingStyle: "Sweeping guard arcs and precision thrusts",
      attackSpeed: 5.2,
      damage: 7.5,
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
      name: "Sarissa Pike",
      region: "Southern Kingdoms",
      size: "Very Large",
      hands: 2,
      reach: "Very Long",
      description:
        "Phalanx pike of layered ash up to six meters, bronze shoe and counterweight; requires drilled ranks to wield its unstoppable reach.",
      fightingStyle: "Massed rank thrusts and shield-wall control",
      attackSpeed: 4.0,
      damage: 7.2,
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
      name: "Quarterdock Trident",
      region: "Southern Kingdoms",
      size: "Medium",
      hands: 2,
      reach: "Medium/Long",
      description:
        "Harbor-issue trident with barbed prongs, rope loops for retention, and saltproof lacquer; doubles as pike or tool for corralling smugglers.",
      fightingStyle: "Pressing thrusts and entangling pushes on piers",
      attackSpeed: 5.0,
      damage: 6.8,
      armorPen: "Medium-High",
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
    {
      name: "Elm Flatbow",
      region: "High Villages",
      size: "Medium",
      hands: 2,
      reach: "Long",
      description:
        "Self bow of resilient elm with bark-backing and flax string; leather grip darkened by rain cloaks; woodland sentries rely on its quiet cast and forgiving draw.",
      fightingStyle: "Stalking volleys and opportunistic woodland shots",
      attackSpeed: 5.2,
      damage: 6.0,
      armorPen: "Medium",
    },
    {
      name: "Horn Composite",
      region: "Southern Steppes",
      size: "Medium",
      hands: 1,
      reach: "Medium/Long",
      description:
        "Short reflex composite of horn, sinew, and wood sealed beneath painted birch bark; brass string bridges reinforce the siyahs for brutal saddle draws.",
      fightingStyle: "Galloping precision shots and cutback harassing fire",
      attackSpeed: 4.8,
      damage: 6.6,
      armorPen: "High",
    },
    {
      name: "Windlass Crossbow",
      region: "High Kingdoms",
      size: "Large",
      hands: 2,
      reach: "Medium",
      description:
        "Steel prod locked into an oak tiller with reinforced nut and spanning cranequin; windlass crank ratchets the string for plate-breaking quarrels.",
      fightingStyle: "Siege-ready shots that shatter armor at deliberate pace",
      attackSpeed: 0.8,
      damage: 9.5,
      armorPen: "Very High",
    },
    {
      name: "Leadshot Sling",
      region: "High Villages",
      size: "Small",
      hands: 2,
      reach: "Medium/Long",
      description:
        "Braided wool sling with leather cradle and pouch of molded lead glandes; shepherds whirl it above their head before letting fly with bone-cracking force.",
      fightingStyle: "Wide arcing throws and harrying skirmish stones",
      attackSpeed: 6.5,
      damage: 3.8,
      armorPen: "Low-Medium",
    },
    {
      name: "Aklys Tetherclub",
      region: "Southern Kingdoms",
      size: "Small",
      hands: 1,
      reach: "Short/Medium",
      description:
        "Notched hardwood club drilled for a rawhide tether and lead-weighted knob; guards cast the club to stun then yank foes back off balance.",
      fightingStyle: "Snaring throws and return strikes in tight alleys",
      attackSpeed: 6.0,
      damage: 4.3,
      armorPen: "Low-Medium",
    },
    {
      name: "Ghadziya Darts",
      region: "Southern Kingdoms",
      size: "Tiny",
      hands: 1,
      reach: "Medium",
      description:
        "Bundle of leaf-bladed throwing darts balanced with bone tails and silk streamers; desert outriders flick them from between fingers for flickering kills.",
      fightingStyle: "Palm-fanned bursts that pick joints and exposed throats",
      attackSpeed: 7.5,
      damage: 3.4,
      armorPen: "Medium",
    },
    {
      name: "Chakram Razorwheel",
      region: "Eastern Realms",
      size: "Small",
      hands: 1,
      reach: "Medium/Long",
      description:
        "Polished steel throwing ring with sharpened rim and etched mantra around the hub; twirls from the index finger before slashing through ranks.",
      fightingStyle: "Circular release arcs and ricochet slices",
      attackSpeed: 6.7,
      damage: 4.6,
      armorPen: "Medium-High",
    },
    {
      name: "Whaler’s Harpoon",
      region: "Island Clans",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Barbed iron harpoon lashed to coiled hemp line, ash shaft tarred against spray; crews brace the butt against gunwales before hurling to pin quarry.",
      fightingStyle: "Tethered strikes that drag targets off footing",
      attackSpeed: 3.8,
      damage: 7.3,
      armorPen: "Medium-High",
    },
    {
      name: "Earthen Firepot",
      region: "Borderlands",
      size: "Small",
      hands: 1,
      reach: "Short/Medium",
      description:
        "Pitch-lined clay grenade packed with oil and resin shards, sealed by wax and fuse; siege crews light and lob to burst in sheets of flame.",
      fightingStyle: "Arc-thrown incendiaries that scatter shield walls",
      attackSpeed: 2.5,
      damage: 8.4,
      armorPen: "Medium",
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
    {
      name: "Duo Chain Flail",
      region: "High Villages",
      size: "Medium",
      hands: 2,
      reach: "Medium",
      description:
        "Peasant militia haft with twin chained iron weights, oak grip bound in rawhide, and ring loops for quick leverage; simple to make, vicious in crush.",
      fightingStyle: "Alternating chain sweeps and shield tangles",
      attackSpeed: 5.0,
      damage: 7.0,
      armorPen: "Medium",
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
      name: "Thornvine Lash",
      region: "Southern Kingdoms",
      size: "Medium",
      hands: 1,
      reach: "Medium",
      description:
        "Jungle-plaited whip woven with hardened thorns and resin, bone-handled and oil-treated to keep its bite; wraps foes with snagging barbs.",
      fightingStyle: "Snaring lashes and bleeding wraps",
      attackSpeed: 8.5,
      damage: 3.8,
      armorPen: "Low-Medium",
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
    {
      name: "Reed Quarterstaff",
      region: "Southern Kingdoms",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Riverlands staff of river reed cores sleeved in hardwood, iron ferrules and waxed wraps keeping it light yet lively for boat decks.",
      fightingStyle: "Flowing deflections with darting strikes",
      attackSpeed: 7.4,
      damage: 4.3,
      armorPen: "Low-Medium",
    },
    {
      name: "Ferruled Waystaff",
      region: "Borderlands",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Wayfarer staff of tough ash with brass ferrules, hidden cord wraps, and travel sigils burned along the length; doubles as walking aid and defense.",
      fightingStyle: "Measured guards, shoulder checks, and sweeps",
      attackSpeed: 7.1,
      damage: 4.6,
      armorPen: "Low-Medium",
    },
    {
      name: "Temple Ironstaff",
      region: "Eastern Realms",
      size: "Large",
      hands: 2,
      reach: "Long",
      description:
        "Monastic ironstaff with octagonal cross-section, ringed finials that chime with motion, and crimson cord grips for forms practice and patrols.",
      fightingStyle: "Disciplined forms with crushing counters",
      attackSpeed: 6.9,
      damage: 5.0,
      armorPen: "Medium",
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
  shields: [
    {
      name: "Madu Horn Shield",
      region: "Eastern Realms",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Paired antelope horns riveted to a hide-disk buckler, edges bound in brass and palm grip corded tight; darts forward with spiked ripostes while still catching blows.",
      fightingStyle: "Horned parries that gore and deflect in equal measure",
      attackSpeed: 6.2,
      damage: 4.2,
      armorPen: "Low-Medium",
    },
    {
      name: "Rondache Buckler",
      region: "Southern Kingdoms",
      size: "Small",
      hands: 1,
      reach: "Short",
      description:
        "Convex linden buckler faced in rawhide with central steel boss and scalloped rim; light arm loops keep it nimble for street duels and list melees alike.",
      fightingStyle: "Whipping cover beats and knuckle-cracking ripostes",
      attackSpeed: 6.8,
      damage: 3.5,
      armorPen: "Low",
    },
    {
      name: "Sun-Kite Shield",
      region: "High Kingdoms",
      size: "Large",
      hands: 1,
      reach: "Short",
      description:
        "Tall kite shield of layered spruce, bronze rim, and radiant sun emblazoned across gilded gesso; a padded guige lets crusader lines lock together under the blazing motif.",
      fightingStyle: "Wall-forming guard with punishing shield-bash counters",
      attackSpeed: 5.0,
      damage: 4.8,
      armorPen: "Low-Medium",
    },
    {
      name: "Weighted Net",
      region: "Southern Kingdoms",
      size: "Medium",
      hands: 1,
      reach: "Medium",
      description:
        "Arena net woven from tarred cord with lead weights at each knot and a wrist-loop recall line; casts wide to smother blades before being ripped tight.",
      fightingStyle: "Snaring tosses that trip and bind for follow-up strikes",
      attackSpeed: 4.2,
      damage: 2.5,
      armorPen: "Low",
    },
    {
      name: "Buckram Round",
      region: "High Kingdoms",
      size: "Medium",
      hands: 1,
      reach: "Short",
      description:
        "Buckram-laminated round shield backed with elm ribs and heavy enarmes; the iron boss is fluted to catch and wrench opposing steel.",
      fightingStyle: "Rotational guards and boss punches that unseat foes",
      attackSpeed: 5.8,
      damage: 4.0,
      armorPen: "Low-Medium",
    },
    {
      name: "Steel Tower",
      region: "High Kingdoms",
      size: "Very Large",
      hands: 1,
      reach: "Short",
      description:
        "Full-length tower shield of riveted steel plates over oak, vision slit shuttered with leather; pavise bearers lean in to weather volleys then drive forward.",
      fightingStyle: "Bastion advance with crushing edge checks",
      attackSpeed: 4.0,
      damage: 4.8,
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
      name: "Estuary Pick",
      region: "Southern Kingdoms",
      size: "Medium",
      hands: 1,
      reach: "Short",
      description:
        "Marshland war pick with narrow diamond spike, bronze beak counterweight, and tarred haft against damp; prized for biting through soaked gambesons.",
      fightingStyle: "Armor-piercing picks and braced hooks",
      attackSpeed: 5.6,
      damage: 6.8,
      armorPen: "Very High",
    },
    {
      name: "Studded Cudgel",
      region: "High Villages",
      size: "Medium",
      hands: 1,
      reach: "Short",
      description:
        "Seasoned oak cudgel wrapped in rawhide with iron studs along the striking face; village constables keep it by the door.",
      fightingStyle: "Ringing blows and joint-breaking strikes",
      attackSpeed: 6.2,
      damage: 5.8,
      armorPen: "Medium",
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
    {
      name: "Oaken Maul",
      region: "Borderlands",
      size: "Very Large",
      hands: 2,
      reach: "Long",
      description:
        "Frontier two-hand maul of iron-banded oak with lead-weighted head and hide-wrapped mid-grip; used to shatter palisades and stubborn shields.",
      fightingStyle: "Earthshaking smashes that stagger lines",
      attackSpeed: 3.2,
      damage: 9.0,
      armorPen: "High",
    },
    {
      name: "Fang of the Star",
      region: "Eastern Realms",
      size: "Medium",
      hands: 1,
      reach: "Short",
      description:
        "Astral morningstar with cobalt-steel flanges and a luminous quartz core set into the head; haft lacquered midnight blue with silver constellations.",
      fightingStyle: "Radiant crushing blows and shield rattles",
      attackSpeed: 5.4,
      damage: 7.4,
      armorPen: "High",
    },
  ],
};

const CATEGORY_SORT_ORDER = Object.keys(ARMORY_SOURCE).reduce<Record<string, number>>((acc, category, index) => {
  acc[category] = index;
  return acc;
}, {});

const WEAPON_UPGRADE_RULES_DATA = {
  id: "wur:all-archetypes",
  note:
    "Rules apply to all weapons in ARMORY by category+name match. Engine should materialize per-weapon upgrades from these rules.",
  apMap: {
    Low: 0.06,
    "Low-Medium": 0.12,
    Medium: 0.2,
    "Medium-High": 0.3,
    High: 0.42,
    "Very High": 0.52,
  },
  qualityMods: {
    Standard: { critChancePct_delta: 0, critMult_delta: 0 },
    Fine: { critChancePct_delta: 1, critMult_delta: 0.05 },
    Masterwork: { critChancePct_delta: 2, critMult_delta: 0.1 },
  },
  archetypes: [
    {
      match: {
        category: "swords",
        names: [
          "Arming Sword",
          "Short Guardblade",
          "Eastern Straightblade",
          "Companion Blade",
          "Bronze Leafblade",
          "Xiphos Leaf Sword",
          "City Gentle’s Cane",
        ],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.1, SLASH: 0.6, PIERCE: 0.3 },
        critChancePct: 9,
        critMult: 1.55,
        critArmorBypassPct: 0,
        hazardTags: ["edge", "point"],
        controlTags: ["pommel"],
        onHit: {
          bleed: { chancePct: 12, power: 1.2, durationSec: 7, stacksMax: 3 },
        },
      },
      overrides: {
        "Short Guardblade": {
          critChancePct: 10,
          dmgMix: { BLUNT: 0.1, SLASH: 0.65, PIERCE: 0.25 },
        },
        "Eastern Straightblade": {
          critChancePct: 11,
          dmgMix: { BLUNT: 0.05, SLASH: 0.55, PIERCE: 0.4 },
        },
        "Companion Blade": {
          critChancePct: 11,
          dmgMix: { BLUNT: 0.05, SLASH: 0.6, PIERCE: 0.35 },
        },
        "Bronze Leafblade": {
          dmgMix: { BLUNT: 0.12, SLASH: 0.48, PIERCE: 0.4 },
        },
        "Xiphos Leaf Sword": {
          critChancePct: 10,
          dmgMix: { BLUNT: 0.08, SLASH: 0.52, PIERCE: 0.4 },
        },
        "City Gentle’s Cane": {
          dmgMix: { BLUNT: 0.3, SLASH: 0.4, PIERCE: 0.3 },
          onHit: { daze: { chancePct: 12, durationSec: 2 } },
        },
      },
    },
    {
      match: {
        category: "swords",
        names: [
          "Falchion",
          "Steppe Sabre",
          "Blade of the Tide",
          "Kopis Cutter",
          "Shashka Officer Saber",
          "Flanged Sabre",
        ],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.05, SLASH: 0.8, PIERCE: 0.15 },
        critChancePct: 12,
        critMult: 1.5,
        hazardTags: ["edge"],
        onHit: {
          bleed: { chancePct: 18, power: 1.6, durationSec: 8, stacksMax: 4 },
          sever: { chancePct: 5, power: 1, cdSec: 12 },
        },
      },
      overrides: {
        "Blade of the Tide": { critChancePct: 13, apOverride: "Medium-High" },
        "Steppe Sabre": { critChancePct: 13 },
        "Kopis Cutter": {
          dmgMix: { BLUNT: 0.05, SLASH: 0.75, PIERCE: 0.2 },
          onHit: { rend: { chancePct: 12, powerPct: 16, durationSec: 8 } },
        },
        "Shashka Officer Saber": {
          critChancePct: 14,
          dmgMix: { BLUNT: 0.04, SLASH: 0.66, PIERCE: 0.3 },
          onHit: { bleed: { chancePct: 20, durationSec: 7 } },
        },
        "Flanged Sabre": {
          onHit: { sunder: { chancePct: 18, powerPct: 9, durationSec: 12 } },
        },
      },
    },
    {
      match: { category: "swords", names: ["Longsword"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.1, SLASH: 0.55, PIERCE: 0.35 },
        critChancePct: 11,
        critMult: 1.6,
        hazardTags: ["edge", "point"],
        controlTags: ["pommel"],
        onHit: {
          bleed: { chancePct: 14, power: 1.3, durationSec: 7, stacksMax: 3 },
          sunder: { chancePct: 8, powerPct: 6, durationSec: 10, stacksMax: 3 },
        },
      },
    },
    {
      match: {
        category: "swords",
        names: [
          "Great Sword",
          "Two-Hand Colossus",
          "Great-Edge",
          "Tegha Broadblade",
          "Sawtooth Falx",
        ],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.15, SLASH: 0.7, PIERCE: 0.15 },
        critChancePct: 14,
        critMult: 1.7,
        critArmorBypassPct: 0.08,
        hazardTags: ["edge"],
        controlTags: ["pommel"],
        onHit: {
          bleed: { chancePct: 20, power: 1.8, durationSec: 9, stacksMax: 4 },
          sunder: { chancePct: 12, powerPct: 7, durationSec: 12, stacksMax: 4 },
          sever: { chancePct: 8, power: 1.2, cdSec: 14 },
        },
      },
      overrides: {
        "Great-Edge": {
          onHit: { sever: { chancePct: 9, power: 1.3, cdSec: 14 } },
        },
        "Two-Hand Colossus": {
          onHit: { sunder: { chancePct: 14, powerPct: 8, durationSec: 12, stacksMax: 4 } },
        },
        "Tegha Broadblade": {
          critChancePct: 13,
          onHit: { sunder: { chancePct: 16, powerPct: 8, durationSec: 12, stacksMax: 4 } },
        },
        "Sawtooth Falx": {
          dmgMix: { BLUNT: 0.1, SLASH: 0.75, PIERCE: 0.15 },
          onHit: {
            bleed: { chancePct: 24, power: 2.0, durationSec: 9, stacksMax: 4 },
            rend: { chancePct: 22, powerPct: 20, durationSec: 10, tickSec: 2 },
          },
        },
      },
    },
    {
      match: { category: "swords", names: ["Dual Set: Wakizashi Companion + Tanto Sideblade"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.08, SLASH: 0.62, PIERCE: 0.3 },
        critChancePct: 13,
        critMult: 1.55,
        hazardTags: ["edge", "point"],
        controlTags: ["trap"],
        onHit: {
          bleed: { chancePct: 18, power: 1.2, durationSec: 6, stacksMax: 3 },
          daze: { chancePct: 8, durationSec: 2 },
        },
      },
    },
    {
      match: { category: "daggers", names: ["Misericorde", "Rondel", "Piercer", "Pesh-Kabz Tusk"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.05, SLASH: 0.15, PIERCE: 0.8 },
        critChancePct: 12,
        critMult: 1.6,
        critArmorBypassPct: 0.05,
        hazardTags: ["point"],
        onHit: { bleed: { chancePct: 12, power: 1.1, durationSec: 6, stacksMax: 3 } },
      },
      overrides: {
        Rondel: { critChancePct: 11, critArmorBypassPct: 0.06 },
        Piercer: { critChancePct: 13, critArmorBypassPct: 0.07 },
        "Pesh-Kabz Tusk": { critChancePct: 12, critArmorBypassPct: 0.08 },
      },
    },
    {
      match: { category: "daggers", names: ["Push-Spike"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.05, SLASH: 0.2, PIERCE: 0.75 },
        critChancePct: 13,
        critMult: 1.6,
        critArmorBypassPct: 0.06,
        hazardTags: ["point"],
        onHit: {
          bleed: { chancePct: 12, power: 1.2, durationSec: 6, stacksMax: 3 },
          sunder: { chancePct: 6, powerPct: 5, durationSec: 8, stacksMax: 3 },
        },
      },
    },
    {
      match: {
        category: "daggers",
        names: [
          "Curved Twin-Edge",
          "Wavesong Dagger",
          "Cairn Dirk",
          "Tanto Sideblade",
          "Kris Wave Dagger",
          "Karambit Claw",
        ],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.05, SLASH: 0.7, PIERCE: 0.25 },
        critChancePct: 11,
        critMult: 1.5,
        hazardTags: ["edge", "point"],
        onHit: { bleed: { chancePct: 16, power: 1.3, durationSec: 7, stacksMax: 3 } },
      },
      overrides: {
        "Cairn Dirk": {
          dmgMix: { BLUNT: 0.1, SLASH: 0.45, PIERCE: 0.45 },
          critChancePct: 12,
        },
        "Tanto Sideblade": {
          critChancePct: 12,
          onHit: { bleed: { chancePct: 18, power: 1.2, durationSec: 6, stacksMax: 3 } },
        },
        "Kris Wave Dagger": {
          onHit: { bleed: { chancePct: 20, power: 1.3, durationSec: 8, stacksMax: 3 } },
        },
        "Karambit Claw": {
          dmgMix: { BLUNT: 0.1, SLASH: 0.65, PIERCE: 0.25 },
          onHit: { entangle: { chancePct: 12, durationSec: 5 } },
        },
      },
    },
    {
      match: { category: "axes", names: ["Bearded Axe", "Crescent Battleaxe"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.1, SLASH: 0.75, PIERCE: 0.15 },
        critChancePct: 12,
        critMult: 1.5,
        hazardTags: ["edge"],
        controlTags: ["hook"],
        onHit: {
          bleed: { chancePct: 18, power: 1.6, durationSec: 8, stacksMax: 4 },
          sever: { chancePct: 5, power: 1, cdSec: 12 },
        },
      },
    },
    {
      match: {
        category: "axes",
        names: [
          "Long-Haft War Axe",
          "Long-Blade Axe",
          "Hooked War Axe",
          "Skeggox Hewing Axe",
          "Tabargan Twinblade",
        ],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.2, SLASH: 0.65, PIERCE: 0.15 },
        critChancePct: 12,
        critMult: 1.6,
        hazardTags: ["edge"],
        controlTags: ["hook"],
        onHit: {
          bleed: { chancePct: 20, power: 1.7, durationSec: 8, stacksMax: 4 },
          sunder: { chancePct: 14, powerPct: 7, durationSec: 12, stacksMax: 4 },
          sever: { chancePct: 6, power: 1.1, cdSec: 12 },
        },
      },
      overrides: {
        "Hooked War Axe": {
          onHit: { disarm: { chancePct: 8, power: 1, cdSec: 10 } },
        },
        "Skeggox Hewing Axe": {
          onHit: {
            bleed: { chancePct: 22, power: 1.8, durationSec: 8, stacksMax: 4 },
            sunder: { chancePct: 16, powerPct: 8, durationSec: 12, stacksMax: 4 },
          },
        },
        "Tabargan Twinblade": {
          onHit: {
            bleed: { chancePct: 22, power: 1.8, durationSec: 8, stacksMax: 4 },
            disarm: { chancePct: 10, power: 1, cdSec: 9 },
          },
        },
      },
    },
    {
      match: { category: "axes", names: ["Moon Cleaver"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.18, SLASH: 0.67, PIERCE: 0.15 },
        critChancePct: 14,
        critMult: 1.7,
        hazardTags: ["edge"],
        controlTags: ["hook"],
        onHit: {
          bleed: { chancePct: 24, power: 1.9, durationSec: 9, stacksMax: 4 },
          sunder: { chancePct: 14, powerPct: 8, durationSec: 12, stacksMax: 4 },
          lunarBrand: { chancePct: 12, powerPct: 12, durationSec: 10 },
        },
      },
    },
    {
      match: { category: "axes", names: ["Throwing Axe"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.1, SLASH: 0.8, PIERCE: 0.1 },
        critChancePct: 10,
        critMult: 1.5,
        hazardTags: ["edge"],
        onHit: { bleed: { chancePct: 12, power: 1.2, durationSec: 6, stacksMax: 3 } },
      },
    },
    {
      match: {
        category: "polearms",
        names: ["Partisan Spear", "Winding Spear", "Trident Fork", "Sarissa Pike", "Quarterdock Trident"],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.1, SLASH: 0.2, PIERCE: 0.7 },
        critChancePct: 10,
        critMult: 1.55,
        hazardTags: ["point"],
        controlTags: ["hook"],
        onHit: { bleed: { chancePct: 10, power: 1.1, durationSec: 6, stacksMax: 2 } },
      },
      overrides: {
        "Trident Fork": {
          onHit: { bleed: { chancePct: 12, power: 1.2, durationSec: 6, stacksMax: 2 } },
        },
        "Sarissa Pike": {
          critChancePct: 9,
          dmgMix: { BLUNT: 0.08, SLASH: 0.16, PIERCE: 0.76 },
        },
        "Quarterdock Trident": {
          onHit: {
            bleed: { chancePct: 14, power: 1.1, durationSec: 6, stacksMax: 2 },
            entangle: { chancePct: 10, durationSec: 6 },
          },
        },
      },
    },
    {
      match: { category: "polearms", names: ["Glaive", "River-Blade", "Naginata Guardblade"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.1, SLASH: 0.75, PIERCE: 0.15 },
        critChancePct: 11,
        critMult: 1.55,
        hazardTags: ["edge"],
        controlTags: ["hook"],
        onHit: {
          bleed: { chancePct: 16, power: 1.5, durationSec: 7, stacksMax: 3 },
          sever: { chancePct: 5, power: 1, cdSec: 12 },
        },
      },
      overrides: {
        "Naginata Guardblade": {
          onHit: { bleed: { chancePct: 18, power: 1.5, durationSec: 7, stacksMax: 3 }, entangle: { chancePct: 8, durationSec: 4 } },
        },
      },
    },
    {
      match: {
        category: "polearms",
        names: ["Halberd", "Axe-Knife Polearm", "Guisarme Hook", "Voulge Splitter"],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.2, SLASH: 0.55, PIERCE: 0.25 },
        critChancePct: 11,
        critMult: 1.6,
        hazardTags: ["edge", "point"],
        controlTags: ["hook"],
        onHit: {
          bleed: { chancePct: 16, power: 1.4, durationSec: 7, stacksMax: 3 },
          sunder: { chancePct: 14, powerPct: 7, durationSec: 12, stacksMax: 4 },
        },
      },
      overrides: {
        "Guisarme Hook": {
          onHit: {
            bleed: { chancePct: 18, power: 1.4, durationSec: 7, stacksMax: 3 },
            sunder: { chancePct: 16, powerPct: 7, durationSec: 12, stacksMax: 4 },
            entangle: { chancePct: 12, durationSec: 5 },
          },
        },
        "Voulge Splitter": {
          onHit: {
            bleed: { chancePct: 18, power: 1.6, durationSec: 8, stacksMax: 3 },
            sunder: { chancePct: 16, powerPct: 8, durationSec: 12, stacksMax: 4 },
          },
        },
      },
    },
    {
      match: { category: "polearms", names: ["Beak-Hammer", "Lucent Warhammer"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.7, SLASH: 0.1, PIERCE: 0.2 },
        critChancePct: 10,
        critMult: 1.75,
        critArmorBypassPct: 0.1,
        hazardTags: ["spike"],
        controlTags: ["beak"],
        onHit: {
          sunder: { chancePct: 22, powerPct: 10, durationSec: 12, stacksMax: 5 },
          disarm: { chancePct: 10, power: 1, cdSec: 8 },
        },
      },
    },
    {
      match: {
        category: "ranged",
        names: ["Greatbow", "Composite Recurve", "Asymmetrical Longbow", "Elm Flatbow", "Horn Composite"],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.05, SLASH: 0.15, PIERCE: 0.8 },
        critChancePct: 8,
        critMult: 1.5,
        hazardTags: ["point"],
        onHit: { bleed: { chancePct: 8, power: 0.9, durationSec: 6, stacksMax: 2 } },
      },
      overrides: {
        "Asymmetrical Longbow": { critChancePct: 9 },
        "Elm Flatbow": { critChancePct: 8, dmgMix: { BLUNT: 0.06, SLASH: 0.18, PIERCE: 0.76 } },
        "Horn Composite": { critChancePct: 9, dmgMix: { BLUNT: 0.04, SLASH: 0.14, PIERCE: 0.82 } },
      },
    },
    {
      match: { category: "ranged", names: ["Heavy Crossbow", "Windlass Crossbow"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.05, SLASH: 0.1, PIERCE: 0.85 },
        critChancePct: 10,
        critMult: 1.8,
        critArmorBypassPct: 0.08,
        hazardTags: ["point"],
        onHit: { bleed: { chancePct: 10, power: 1, durationSec: 6, stacksMax: 2 } },
      },
      overrides: {
        "Windlass Crossbow": { critChancePct: 9, critMult: 1.85 },
      },
    },
    {
      match: { category: "ranged", names: ["Hand Crossbow", "Repeating Crossbow"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.05, SLASH: 0.1, PIERCE: 0.85 },
        critChancePct: 8,
        critMult: 1.55,
        hazardTags: ["point"],
        onHit: { bleed: { chancePct: 7, power: 0.8, durationSec: 5, stacksMax: 2 } },
      },
      overrides: {
        "Repeating Crossbow": {
          apOverride: "Low-Medium",
          critChancePct: 7,
          critMult: 1.5,
        },
      },
    },
    {
      match: { category: "ranged", names: ["Leadshot Sling"] },
      base: {
        apOverride: "Low-Medium",
        dmgMix: { BLUNT: 0.7, SLASH: 0.05, PIERCE: 0.25 },
        critChancePct: 7,
        critMult: 1.45,
        hazardTags: ["blunt"],
        onHit: { daze: { chancePct: 14, durationSec: 3 } },
      },
    },
    {
      match: { category: "ranged", names: ["Aklys Tetherclub"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.6, SLASH: 0.1, PIERCE: 0.3 },
        critChancePct: 8,
        critMult: 1.5,
        hazardTags: ["blunt"],
        controlTags: ["hook"],
        onHit: {
          daze: { chancePct: 18, durationSec: 3 },
          entangle: { chancePct: 16, durationSec: 4 },
        },
      },
    },
    {
      match: { category: "ranged", names: ["Ghadziya Darts"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.05, SLASH: 0.15, PIERCE: 0.8 },
        critChancePct: 10,
        critMult: 1.55,
        hazardTags: ["point"],
        onHit: { bleed: { chancePct: 16, power: 1.1, durationSec: 6, stacksMax: 3 } },
      },
    },
    {
      match: { category: "ranged", names: ["Chakram Razorwheel"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.1, SLASH: 0.7, PIERCE: 0.2 },
        critChancePct: 9,
        critMult: 1.6,
        hazardTags: ["edge"],
        onHit: { bleed: { chancePct: 20, power: 1.2, durationSec: 6, stacksMax: 3 } },
      },
    },
    {
      match: { category: "ranged", names: ["Whaler’s Harpoon"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.1, SLASH: 0.1, PIERCE: 0.8 },
        critChancePct: 9,
        critMult: 1.6,
        hazardTags: ["point"],
        controlTags: ["hook"],
        onHit: {
          entangle: { chancePct: 24, durationSec: 5 },
          drag: { chancePct: 12, powerPct: 12, durationSec: 4 },
        },
      },
    },
    {
      match: { category: "ranged", names: ["Earthen Firepot"] },
      base: {
        apOverride: "Medium",
        dmgMix: { BLUNT: 0.5, SLASH: 0.1, PIERCE: 0.4 },
        critChancePct: 6,
        critMult: 1.45,
        hazardTags: ["fire"],
        onHit: {
          burn: { chancePct: 85, powerPct: 18, durationSec: 8, tickSec: 2 },
          shatter: { chancePct: 20, powerPct: 10, durationSec: 6 },
        },
      },
    },
    {
      match: { category: "chains", names: ["Chain Morning Star", "Meteor Chain", "Duo Chain Flail"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.75, SLASH: 0.15, PIERCE: 0.1 },
        critChancePct: 11,
        critMult: 1.55,
        hazardTags: ["spike"],
        controlTags: ["hook"],
        onHit: {
          bleed: { chancePct: 16, power: 1.4, durationSec: 7, stacksMax: 3 },
          sunder: { chancePct: 12, powerPct: 6, durationSec: 10, stacksMax: 3 },
          disarm: { chancePct: 10, power: 1, cdSec: 10 },
        },
      },
      overrides: {
        "Duo Chain Flail": {
          onHit: {
            bleed: { chancePct: 14, power: 1.2, durationSec: 7, stacksMax: 3 },
            entangle: { chancePct: 14, durationSec: 6 },
          },
        },
      },
    },
    {
      match: { category: "whips", names: ["Punisher Lash", "Thornvine Lash"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.05, SLASH: 0.9, PIERCE: 0.05 },
        critChancePct: 10,
        critMult: 1.45,
        hazardTags: ["edge"],
        onHit: {
          bleed: { chancePct: 22, power: 1.1, durationSec: 8, stacksMax: 4 },
          disarm: { chancePct: 10, power: 0.8, cdSec: 8 },
        },
      },
      overrides: {
        "Thornvine Lash": {
          hazardTags: ["edge", "thorn"],
          controlTags: ["hook"],
          onHit: {
            bleed: { chancePct: 24, power: 1.2, durationSec: 8, stacksMax: 4 },
            disarm: { chancePct: 12, power: 0.9, cdSec: 8 },
            entangle: { chancePct: 20, durationSec: 6 },
          },
        },
      },
    },
    {
      match: { category: "whips", names: ["Scorpion Whip"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.1, SLASH: 0.8, PIERCE: 0.1 },
        critChancePct: 11,
        critMult: 1.5,
        hazardTags: ["edge", "spike"],
        controlTags: ["hook"],
        onHit: {
          bleed: { chancePct: 26, power: 1.3, durationSec: 8, stacksMax: 5 },
          disarm: { chancePct: 12, power: 1, cdSec: 10 },
        },
      },
    },
    {
      match: {
        category: "staves",
        names: [
          "Quarterstaff",
          "Ironwood Staff",
          "Short Staff",
          "Reed Quarterstaff",
          "Ferruled Waystaff",
          "Temple Ironstaff",
        ],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.85, SLASH: 0.1, PIERCE: 0.05 },
        critChancePct: 6,
        critMult: 1.45,
        onHit: {
          sunder: { chancePct: 8, powerPct: 5, durationSec: 8, stacksMax: 3 },
          disarm: { chancePct: 8, power: 0.8, cdSec: 8 },
        },
      },
      overrides: {
        "Reed Quarterstaff": {
          onHit: {
            sunder: { chancePct: 7, powerPct: 5, durationSec: 8, stacksMax: 3 },
            disarm: { chancePct: 8, power: 0.8, cdSec: 8 },
            entangle: { chancePct: 10, durationSec: 5 },
          },
        },
        "Ferruled Waystaff": {
          onHit: {
            sunder: { chancePct: 9, powerPct: 6, durationSec: 10, stacksMax: 3 },
            disarm: { chancePct: 10, power: 1, cdSec: 8 },
            daze: { chancePct: 10, durationSec: 2 },
          },
        },
        "Temple Ironstaff": {
          critChancePct: 7,
          dmgMix: { BLUNT: 0.88, SLASH: 0.07, PIERCE: 0.05 },
          onHit: {
            sunder: { chancePct: 10, powerPct: 6, durationSec: 10, stacksMax: 3 },
            disarm: { chancePct: 10, power: 1, cdSec: 8 },
            daze: { chancePct: 12, durationSec: 2 },
          },
        },
      },
    },
    {
      match: { category: "martial", names: ["Twin Sai", "Tonfa Pair", "Knuckle Gauntlet"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.4, SLASH: 0.5, PIERCE: 0.1 },
        critChancePct: 9,
        critMult: 1.5,
        controlTags: ["hook"],
        hazardTags: ["edge"],
        onHit: {
          disarm: { chancePct: 12, power: 1, cdSec: 8 },
          bleed: { chancePct: 10, power: 0.9, durationSec: 6, stacksMax: 2 },
        },
      },
      overrides: {
        "Knuckle Gauntlet": {
          dmgMix: { BLUNT: 0.7, SLASH: 0.25, PIERCE: 0.05 },
          controlTags: [],
          onHit: { disarm: { chancePct: 8, power: 0.8, cdSec: 8 } },
        },
        "Tonfa Pair": {
          dmgMix: { BLUNT: 0.55, SLASH: 0.35, PIERCE: 0.1 },
        },
      },
    },
    {
      match: { category: "martial", names: ["Emei Rods", "Tiger Claws"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.2, SLASH: 0.3, PIERCE: 0.5 },
        critChancePct: 11,
        critMult: 1.5,
        hazardTags: ["point", "edge"],
        onHit: { bleed: { chancePct: 14, power: 1, durationSec: 6, stacksMax: 3 } },
      },
      overrides: {
        "Tiger Claws": {
          dmgMix: { BLUNT: 0.2, SLASH: 0.75, PIERCE: 0.05 },
          critChancePct: 12,
          onHit: { bleed: { chancePct: 18, power: 1.1, durationSec: 7, stacksMax: 3 } },
        },
      },
    },
    {
      match: {
        category: "shields",
        names: [
          "Madu Horn Shield",
          "Rondache Buckler",
          "Sun-Kite Shield",
          "Weighted Net",
          "Buckram Round",
          "Steel Tower",
        ],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.6, SLASH: 0.15, PIERCE: 0.25 },
        critChancePct: 7,
        critMult: 1.45,
        hazardTags: ["blunt"],
        controlTags: ["bash"],
        onHit: { daze: { chancePct: 16, durationSec: 3 } },
      },
      overrides: {
        "Madu Horn Shield": {
          apOverride: "Low-Medium",
          dmgMix: { BLUNT: 0.45, SLASH: 0.15, PIERCE: 0.4 },
          critChancePct: 8,
          hazardTags: ["blunt", "spike"],
          controlTags: ["bash", "hook"],
          onHit: {
            daze: { chancePct: 18, durationSec: 3 },
            bleed: { chancePct: 14, power: 1, durationSec: 5 },
          },
        },
        "Rondache Buckler": {
          critChancePct: 9,
          dmgMix: { BLUNT: 0.55, SLASH: 0.25, PIERCE: 0.2 },
        },
        "Sun-Kite Shield": {
          onHit: {
            daze: { chancePct: 18, durationSec: 3 },
            sunder: { chancePct: 14, powerPct: 6, durationSec: 8 },
          },
        },
        "Weighted Net": {
          apOverride: "Low",
          dmgMix: { BLUNT: 0.2, SLASH: 0.25, PIERCE: 0.55 },
          critChancePct: 6,
          controlTags: ["trap"],
          onHit: {
            entangle: { chancePct: 32, durationSec: 5 },
            daze: { chancePct: 10, durationSec: 2 },
          },
        },
        "Buckram Round": {
          critChancePct: 8,
          dmgMix: { BLUNT: 0.62, SLASH: 0.18, PIERCE: 0.2 },
          hazardTags: ["blunt", "edge"],
        },
        "Steel Tower": {
          critChancePct: 6,
          dmgMix: { BLUNT: 0.65, SLASH: 0.15, PIERCE: 0.2 },
          hazardTags: ["blunt"],
          onHit: {
            daze: { chancePct: 20, durationSec: 3 },
            sunder: { chancePct: 12, powerPct: 6, durationSec: 8 },
          },
        },
      },
    },
    {
      match: {
        category: "maces",
        names: [
          "Spiked Morning Star",
          "Flanged Mace",
          "Estuary Pick",
          "Studded Cudgel",
          "Fang of the Star",
        ],
      },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.8, SLASH: 0.1, PIERCE: 0.1 },
        critChancePct: 9,
        critMult: 1.6,
        hazardTags: ["spike"],
        onHit: {
          sunder: { chancePct: 18, powerPct: 8, durationSec: 12, stacksMax: 4 },
          bleed: { chancePct: 12, power: 1.2, durationSec: 7, stacksMax: 3 },
          disarm: { chancePct: 8, power: 0.9, cdSec: 10 },
        },
      },
      overrides: {
        "Estuary Pick": {
          dmgMix: { BLUNT: 0.55, SLASH: 0.05, PIERCE: 0.4 },
          hazardTags: ["spike", "point"],
          onHit: {
            sunder: { chancePct: 24, powerPct: 11, durationSec: 12, stacksMax: 4 },
            bleed: { chancePct: 10, power: 1.1, durationSec: 6, stacksMax: 3 },
            disarm: { chancePct: 6, power: 0.8, cdSec: 10 },
            rend: { chancePct: 18, powerPct: 18, durationSec: 8, tickSec: 2 },
          },
        },
        "Studded Cudgel": {
          dmgMix: { BLUNT: 0.95, SLASH: 0.05, PIERCE: 0 },
          hazardTags: ["blunt"],
          onHit: {
            sunder: { chancePct: 12, powerPct: 6, durationSec: 10, stacksMax: 3 },
            bleed: { chancePct: 10, power: 0.9, durationSec: 6, stacksMax: 2 },
            disarm: { chancePct: 10, power: 1, cdSec: 9 },
            daze: { chancePct: 16, durationSec: 2 },
          },
        },
        "Fang of the Star": {
          hazardTags: ["spike", "arcane"],
          onHit: {
            sunder: { chancePct: 16, powerPct: 8, durationSec: 12, stacksMax: 4 },
            bleed: { chancePct: 14, power: 1.3, durationSec: 7, stacksMax: 3 },
            disarm: { chancePct: 8, power: 0.9, cdSec: 10 },
            lunarBrand: { chancePct: 20, powerPct: 15, durationSec: 10 },
          },
        },
      },
    },
    {
      match: { category: "maces", names: ["Iron-Studded Great Club", "Oaken Maul"] },
      base: {
        apFromData: true,
        dmgMix: { BLUNT: 0.9, SLASH: 0.05, PIERCE: 0.05 },
        critChancePct: 8,
        critMult: 1.7,
        hazardTags: ["blunt"],
        onHit: {
          sunder: { chancePct: 20, powerPct: 9, durationSec: 12, stacksMax: 4 },
          disarm: { chancePct: 8, power: 0.9, cdSec: 10 },
        },
      },
      overrides: {
        "Oaken Maul": {
          onHit: {
            sunder: { chancePct: 24, powerPct: 10, durationSec: 12, stacksMax: 4 },
            disarm: { chancePct: 10, power: 1, cdSec: 9 },
            daze: { chancePct: 20, durationSec: 3 },
          },
        },
      },
    },
  ],
} as const;

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
  shields: 620,
  maces: 760,
};

const SPECIAL_EFFECT_PRICE_MULTIPLIERS: Record<string, number> = {
  "City Gentle’s Cane": 1.1,
  "Dual Set: Wakizashi Companion + Tanto Sideblade": 1.18,
  "Kopis Cutter": 1.12,
  "Sawtooth Falx": 1.2,
  "Shashka Officer Saber": 1.08,
  "Flanged Sabre": 1.1,
  "Dual Set: Bronze Leafblade + Rondache Buckler": 1.16,
  "Dual Set: Kopis Cutter + Madu Horn Shield": 1.18,
  "Dual Set: Tegha Broadblade + Sun-Kite Shield": 1.2,
  "Dual Set: Flanged Sabre + Buckram Round": 1.22,
  "Dual Set: Sawtooth Falx + Steel Tower": 1.25,
  "Kris Wave Dagger": 1.1,
  "Karambit Claw": 1.12,
  "Tabargan Twinblade": 1.1,
  "Moon Cleaver": 1.25,
  "Estuary Pick": 1.12,
  "Studded Cudgel": 1.05,
  "Fang of the Star": 1.2,
  "Oaken Maul": 1.18,
  "Sarissa Pike": 1.05,
  "Naginata Guardblade": 1.1,
  "Guisarme Hook": 1.15,
  "Voulge Splitter": 1.12,
  "Quarterdock Trident": 1.12,
  "Duo Chain Flail": 1.1,
  "Thornvine Lash": 1.12,
  "Reed Quarterstaff": 1.05,
  "Ferruled Waystaff": 1.08,
  "Temple Ironstaff": 1.15,
  "Madu Horn Shield": 1.14,
  "Rondache Buckler": 1.1,
  "Sun-Kite Shield": 1.16,
  "Weighted Net": 1.18,
  "Buckram Round": 1.14,
  "Steel Tower": 1.22,
  "Horn Composite": 1.08,
  "Windlass Crossbow": 1.22,
  "Aklys Tetherclub": 1.12,
  "Ghadziya Darts": 1.1,
  "Chakram Razorwheel": 1.15,
  "Whaler’s Harpoon": 1.18,
  "Earthen Firepot": 1.3,
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

const QUALITY_CONFIG = WEAPON_QUALITIES;

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
  const specialMultiplier = SPECIAL_EFFECT_PRICE_MULTIPLIERS[weapon.name] ?? 1;
  price *= specialMultiplier;
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
  category: string;
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
          category,
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
  let data: any[];
  try {
    data = JSON.parse(raw);
  } catch {
    return;
  }
  if (!Array.isArray(data)) return;
  const retained = data.filter(keepWeaponItem);
  const weapons = retained.filter((item: any) => item.category_key === "Weapons");
  const nonWeapons = retained.filter((item: any) => item.category_key !== "Weapons");
  const mergedWeapons = [...weapons, ...records];
  mergedWeapons.sort((a, b) => a.display_name.localeCompare(b.display_name));
  const updated = [...nonWeapons, ...mergedWeapons];
  await writeFile(path, JSON.stringify(updated, null, 2) + "\n");
}

function cloneOnHitMap(source?: OnHitMap): OnHitMap | undefined {
  if (!source) return undefined;
  const copy: OnHitMap = {};
  for (const [key, value] of Object.entries(source)) {
    copy[key] = { ...value };
  }
  return copy;
}

function mergeOnHitMaps(base?: OnHitMap, override?: OnHitMap): OnHitMap | undefined {
  const initial = cloneOnHitMap(base);
  if (!override) return initial;
  const target = initial ?? {};
  for (const [key, value] of Object.entries(override)) {
    target[key] = { ...(target[key] || {}), ...value };
  }
  return target;
}

function generateWeaponUpgrades(variants: WeaponVariant[]): WeaponUpgrade[] {
  const upgrades: WeaponUpgrade[] = [];
  const { apMap, qualityMods, archetypes } = WEAPON_UPGRADE_RULES_DATA;
  for (const variant of variants) {
    const archetype = archetypes.find(
      (entry) => entry.match.category === variant.category && entry.match.names.includes(variant.name),
    );
    if (!archetype) continue;
    const override = archetype.overrides?.[variant.name];
    const dmgMix = { ...archetype.base.dmgMix, ...(override?.dmgMix ?? {}) } as Record<DamageComponent, number>;
    const onHit = mergeOnHitMaps(
      archetype.base.onHit as OnHitMap | undefined,
      override?.onHit as OnHitMap | undefined,
    );
    const apOverride = override?.apOverride ?? archetype.base.apOverride;
    const apFromData = override?.apFromData ?? archetype.base.apFromData;
    const directAp = override?.ap ?? archetype.base.ap;
    let apValue: number;
    if (typeof directAp === "number") {
      apValue = directAp;
    } else if (apOverride) {
      apValue = apMap[apOverride as keyof typeof apMap] ?? 0;
    } else if (apFromData) {
      apValue = apMap[variant.armorPen as keyof typeof apMap] ?? 0;
    } else {
      apValue = 0;
    }
    const baseCritChance = override?.critChancePct ?? archetype.base.critChancePct;
    const baseCritMult = override?.critMult ?? archetype.base.critMult;
    const baseCritArmorBypass = override?.critArmorBypassPct ?? archetype.base.critArmorBypassPct;
    const qualityMod = qualityMods[variant.quality as keyof typeof qualityMods];
    const critChancePct = Math.round(baseCritChance + (qualityMod?.critChancePct_delta ?? 0));
    const critMult = round(baseCritMult + (qualityMod?.critMult_delta ?? 0), 2);
    const upgrade: WeaponUpgrade = {
      category: variant.category,
      name: variant.name,
      quality: variant.quality,
      ap: round(apValue, 2),
      dmgMix: {
        BLUNT: round(dmgMix.BLUNT ?? 0, 2),
        SLASH: round(dmgMix.SLASH ?? 0, 2),
        PIERCE: round(dmgMix.PIERCE ?? 0, 2),
      },
      critChancePct,
      critMult,
    };
    if (baseCritArmorBypass && baseCritArmorBypass > 0) {
      upgrade.critArmorBypassPct = round(baseCritArmorBypass, 2);
    }
    if (onHit && Object.keys(onHit).length) {
      upgrade.onHit = onHit;
    }
    upgrades.push(upgrade);
  }
  const qualityOrder: Record<WeaponQuality, number> = { Standard: 0, Fine: 1, Masterwork: 2 };
  upgrades.sort((a, b) => {
    const categoryCmp = (CATEGORY_SORT_ORDER[a.category] ?? Number.MAX_SAFE_INTEGER) -
      (CATEGORY_SORT_ORDER[b.category] ?? Number.MAX_SAFE_INTEGER);
    if (categoryCmp) return categoryCmp;
    const nameCmp = a.name.localeCompare(b.name);
    if (nameCmp) return nameCmp;
    return qualityOrder[a.quality] - qualityOrder[b.quality];
  });
  return upgrades;
}

async function writeArmoryData(variants: WeaponVariant[]) {
  const lines: string[] = [];
  const upgrades = generateWeaponUpgrades(variants);
  lines.push("export type WeaponQuality = 'Standard' | 'Fine' | 'Masterwork';");
  lines.push("export interface WeaponEntry {\n  name: string;\n  region: string;\n  size: 'Tiny'|'Small'|'Medium'|'Large'|'Very Large';\n  hands: 1|2;\n  reach: 'Very Short'|'Short'|'Short/Medium'|'Medium'|'Medium/Long'|'Long'|'Very Long';\n  description: string;\n  fightingStyle: string;\n  attackSpeed: number;\n  damage: number;\n  armorPen: 'Low'|'Low-Medium'|'Medium'|'Medium-High'|'High'|'Very High';\n  specialEffect?: string;\n}");
  lines.push("export interface WeaponRecord extends WeaponEntry {\n  quality: WeaponQuality;\n  priceCp: number;\n  priceDisplay: string;\n  descriptionFull: string;\n}");
  const grouped: Record<string, WeaponVariant[]> = {};
  for (const variant of variants) {
    if (!grouped[variant.category]) grouped[variant.category] = [];
    grouped[variant.category].push(variant);
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
  lines.push(
    [
      "export interface WeaponUpgradeOnHitEffect {",
      "  chancePct: number;",
      "  power?: number;",
      "  durationSec?: number;",
      "  stacksMax?: number;",
      "  powerPct?: number;",
      "  cdSec?: number;",
      "  tickSec?: number;",
      "  scalesWith?: string;",
      "  range?: string;",
      "  description?: string;",
      "  tags?: string[];",
      "}",
    ].join("\n"),
  );
  lines.push("export type WeaponUpgradeOnHitMap = Record<string, WeaponUpgradeOnHitEffect>;");
  lines.push("export interface WeaponUpgrade {\n  category: string;\n  name: string;\n  quality: WeaponQuality;\n  ap: number;\n  dmgMix: Record<'BLUNT'|'SLASH'|'PIERCE', number>;\n  critChancePct: number;\n  critMult: number;\n  critArmorBypassPct?: number;\n  onHit?: WeaponUpgradeOnHitMap;\n}");
  lines.push("");
  const upgradesLines = JSON.stringify(upgrades, null, 2).split("\n");
  if (upgradesLines.length) {
    upgradesLines[0] = `export const WEAPON_UPGRADES: WeaponUpgrade[] = ${upgradesLines[0]}`;
    upgradesLines[upgradesLines.length - 1] = `${upgradesLines[upgradesLines.length - 1]};`;
    lines.push(...upgradesLines);
    lines.push("");
  }
  const upgradeLines = JSON.stringify(WEAPON_UPGRADE_RULES_DATA, null, 2).split("\n");
  if (upgradeLines.length) {
    upgradeLines[0] = `export const WEAPON_UPGRADE_RULES = ${upgradeLines[0]}`;
    upgradeLines[upgradeLines.length - 1] = `${upgradeLines[upgradeLines.length - 1]} as const;`;
    lines.push(...upgradeLines);
    lines.push("");
  }
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
