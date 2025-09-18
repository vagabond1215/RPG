export type WeaponQuality = 'Standard' | 'Fine' | 'Masterwork';
export interface WeaponEntry {
  name: string;
  region: string;
  size: 'Tiny'|'Small'|'Medium'|'Large'|'Very Large';
  hands: 1|2;
  reach: 'Very Short'|'Short'|'Short/Medium'|'Medium'|'Medium/Long'|'Long'|'Very Long';
  description: string;
  fightingStyle: string;
  attackSpeed: number;
  damage: number;
  armorPen: 'Low'|'Low-Medium'|'Medium'|'Medium-High'|'High'|'Very High';
}
export interface WeaponRecord extends WeaponEntry {
  quality: WeaponQuality;
  priceCp: number;
  priceDisplay: string;
  descriptionFull: string;
}
export const ARMORY: Record<string, WeaponRecord[]> = {
  swords: [
    { name: "Arming Sword", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "A straight double-edged steel blade (~75 cm) with a dark-iron cruciform guard, leather-wrapped grip over cord, and a rounded steel pommel engraved with simple sigils; balanced, serviceable, and kept bright with oil.", fightingStyle: "Balanced cut and thrust; commonly paired with shield", attackSpeed: 7, damage: 5, armorPen: "Medium", quality: "Standard", priceCp: 710, priceDisplay: "7si 10cp", descriptionFull: "Arming Sword. A straight double-edged steel blade (~75 cm) with a dark-iron cruciform guard, leather-wrapped grip over cord, and a rounded steel pommel engraved with simple sigils; balanced, serviceable, and kept bright with oil. Trusted from High Kingdoms, it proves dependable steel sized for medium engagements. Favoured for balanced cut and thrust; commonly paired with shield." },
    { name: "Arming Sword", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "A straight double-edged steel blade (~75 cm) with a dark-iron cruciform guard, leather-wrapped grip over cord, and a rounded steel pommel engraved with simple sigils; balanced, serviceable, and kept bright with oil.", fightingStyle: "Balanced cut and thrust; commonly paired with shield", attackSpeed: 7, damage: 5, armorPen: "Medium", quality: "Fine", priceCp: 1030, priceDisplay: "10si 30cp", descriptionFull: "Fine Arming Sword. A straight double-edged steel blade (~75 cm) with a dark-iron cruciform guard, leather-wrapped grip over cord, and a rounded steel pommel engraved with simple sigils; balanced, serviceable, and kept bright with oil. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for balanced cut and thrust; commonly paired with shield." },
    { name: "Arming Sword", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "A straight double-edged steel blade (~75 cm) with a dark-iron cruciform guard, leather-wrapped grip over cord, and a rounded steel pommel engraved with simple sigils; balanced, serviceable, and kept bright with oil.", fightingStyle: "Balanced cut and thrust; commonly paired with shield", attackSpeed: 7, damage: 5, armorPen: "Medium", quality: "Masterwork", priceCp: 1665, priceDisplay: "16si 65cp", descriptionFull: "Masterwork Arming Sword. A straight double-edged steel blade (~75 cm) with a dark-iron cruciform guard, leather-wrapped grip over cord, and a rounded steel pommel engraved with simple sigils; balanced, serviceable, and kept bright with oil. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for balanced cut and thrust; commonly paired with shield." },
    { name: "Longsword", region: "High Kingdoms", size: "Large", hands: 2, reach: "Very Long", description: "Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust.", fightingStyle: "Two-handed leverage; sweeping slashes and strong thrusts", attackSpeed: 6, damage: 6.5, armorPen: "Medium-High", quality: "Standard", priceCp: 1540, priceDisplay: "15si 40cp", descriptionFull: "Longsword. Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for two-handed leverage; sweeping slashes and strong thrusts." },
    { name: "Longsword", region: "High Kingdoms", size: "Large", hands: 2, reach: "Very Long", description: "Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust.", fightingStyle: "Two-handed leverage; sweeping slashes and strong thrusts", attackSpeed: 6, damage: 6.5, armorPen: "Medium-High", quality: "Fine", priceCp: 2230, priceDisplay: "1g 2si 30cp", descriptionFull: "Fine Longsword. Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for two-handed leverage; sweeping slashes and strong thrusts." },
    { name: "Longsword", region: "High Kingdoms", size: "Large", hands: 2, reach: "Very Long", description: "Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust.", fightingStyle: "Two-handed leverage; sweeping slashes and strong thrusts", attackSpeed: 6, damage: 6.5, armorPen: "Medium-High", quality: "Masterwork", priceCp: 3615, priceDisplay: "1g 16si 15cp", descriptionFull: "Masterwork Longsword. Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for two-handed leverage; sweeping slashes and strong thrusts." },
    { name: "Great Sword", region: "Northern Marches", size: "Very Large", hands: 2, reach: "Very Long", description: "A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks.", fightingStyle: "Power strokes, wide arcs, line-breaking presence", attackSpeed: 5.5, damage: 7, armorPen: "High", quality: "Standard", priceCp: 2240, priceDisplay: "1g 2si 40cp", descriptionFull: "Great Sword. A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks. Trusted from Northern Marches, it proves dependable steel sized for very large engagements. Favoured for power strokes, wide arcs, line-breaking presence." },
    { name: "Great Sword", region: "Northern Marches", size: "Very Large", hands: 2, reach: "Very Long", description: "A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks.", fightingStyle: "Power strokes, wide arcs, line-breaking presence", attackSpeed: 5.5, damage: 7, armorPen: "High", quality: "Fine", priceCp: 3250, priceDisplay: "1g 12si 50cp", descriptionFull: "Fine Great Sword. A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for power strokes, wide arcs, line-breaking presence." },
    { name: "Great Sword", region: "Northern Marches", size: "Very Large", hands: 2, reach: "Very Long", description: "A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks.", fightingStyle: "Power strokes, wide arcs, line-breaking presence", attackSpeed: 5.5, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 5270, priceDisplay: "2g 12si 70cp", descriptionFull: "Masterwork Great Sword. A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for power strokes, wide arcs, line-breaking presence." },
    { name: "Two-Hand Colossus", region: "Borderlands", size: "Very Large", hands: 2, reach: "Very Long", description: "Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach.", fightingStyle: "Crushing cleaves and long-reach thrusts; slow recoveries", attackSpeed: 3.5, damage: 9.5, armorPen: "High", quality: "Standard", priceCp: 2145, priceDisplay: "1g 1si 45cp", descriptionFull: "Two-Hand Colossus. Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach. Trusted from Borderlands, it proves dependable steel sized for very large engagements. Favoured for crushing cleaves and long-reach thrusts; slow recoveries." },
    { name: "Two-Hand Colossus", region: "Borderlands", size: "Very Large", hands: 2, reach: "Very Long", description: "Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach.", fightingStyle: "Crushing cleaves and long-reach thrusts; slow recoveries", attackSpeed: 3.5, damage: 9.5, armorPen: "High", quality: "Fine", priceCp: 3110, priceDisplay: "1g 11si 10cp", descriptionFull: "Fine Two-Hand Colossus. Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for crushing cleaves and long-reach thrusts; slow recoveries." },
    { name: "Two-Hand Colossus", region: "Borderlands", size: "Very Large", hands: 2, reach: "Very Long", description: "Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach.", fightingStyle: "Crushing cleaves and long-reach thrusts; slow recoveries", attackSpeed: 3.5, damage: 9.5, armorPen: "High", quality: "Masterwork", priceCp: 5040, priceDisplay: "2g 10si 40cp", descriptionFull: "Masterwork Two-Hand Colossus. Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for crushing cleaves and long-reach thrusts; slow recoveries." },
    { name: "Falchion", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor.", fightingStyle: "Heavy slashes and choppers; excels against light armor", attackSpeed: 7, damage: 5.5, armorPen: "Medium", quality: "Standard", priceCp: 730, priceDisplay: "7si 30cp", descriptionFull: "Falchion. Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor. Trusted from High Kingdoms, it proves dependable steel sized for medium engagements. Favoured for heavy slashes and choppers; excels against light armor." },
    { name: "Falchion", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor.", fightingStyle: "Heavy slashes and choppers; excels against light armor", attackSpeed: 7, damage: 5.5, armorPen: "Medium", quality: "Fine", priceCp: 1060, priceDisplay: "10si 60cp", descriptionFull: "Fine Falchion. Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for heavy slashes and choppers; excels against light armor." },
    { name: "Falchion", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor.", fightingStyle: "Heavy slashes and choppers; excels against light armor", attackSpeed: 7, damage: 5.5, armorPen: "Medium", quality: "Masterwork", priceCp: 1715, priceDisplay: "17si 15cp", descriptionFull: "Masterwork Falchion. Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for heavy slashes and choppers; excels against light armor." },
    { name: "Estoc", region: "Borderlands", size: "Medium", hands: 1, reach: "Medium", description: "Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate.", fightingStyle: "Precise stabs into armor seams; binds and windings", attackSpeed: 6.5, damage: 6, armorPen: "High", quality: "Standard", priceCp: 940, priceDisplay: "9si 40cp", descriptionFull: "Estoc. Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate. Trusted from Borderlands, it proves dependable steel sized for medium engagements. Favoured for precise stabs into armor seams; binds and windings." },
    { name: "Estoc", region: "Borderlands", size: "Medium", hands: 1, reach: "Medium", description: "Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate.", fightingStyle: "Precise stabs into armor seams; binds and windings", attackSpeed: 6.5, damage: 6, armorPen: "High", quality: "Fine", priceCp: 1360, priceDisplay: "13si 60cp", descriptionFull: "Fine Estoc. Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for precise stabs into armor seams; binds and windings." },
    { name: "Estoc", region: "Borderlands", size: "Medium", hands: 1, reach: "Medium", description: "Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate.", fightingStyle: "Precise stabs into armor seams; binds and windings", attackSpeed: 6.5, damage: 6, armorPen: "High", quality: "Masterwork", priceCp: 2205, priceDisplay: "1g 2si 5cp", descriptionFull: "Masterwork Estoc. Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for precise stabs into armor seams; binds and windings." },
    { name: "Short Guardblade", region: "Borderlands", size: "Small", hands: 1, reach: "Short", description: "Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors.", fightingStyle: "Close-in slashes and quick parries", attackSpeed: 7.5, damage: 4.5, armorPen: "Medium", quality: "Standard", priceCp: 505, priceDisplay: "5si 5cp", descriptionFull: "Short Guardblade. Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors. Trusted from Borderlands, it proves dependable steel sized for small engagements. Favoured for close-in slashes and quick parries." },
    { name: "Short Guardblade", region: "Borderlands", size: "Small", hands: 1, reach: "Short", description: "Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors.", fightingStyle: "Close-in slashes and quick parries", attackSpeed: 7.5, damage: 4.5, armorPen: "Medium", quality: "Fine", priceCp: 730, priceDisplay: "7si 30cp", descriptionFull: "Fine Short Guardblade. Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for close-in slashes and quick parries." },
    { name: "Short Guardblade", region: "Borderlands", size: "Small", hands: 1, reach: "Short", description: "Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors.", fightingStyle: "Close-in slashes and quick parries", attackSpeed: 7.5, damage: 4.5, armorPen: "Medium", quality: "Masterwork", priceCp: 1185, priceDisplay: "11si 85cp", descriptionFull: "Masterwork Short Guardblade. Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for close-in slashes and quick parries." },
    { name: "Steppe Sabre", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion.", fightingStyle: "Mounted draw-cuts and fluid passing strikes", attackSpeed: 6.8, damage: 5.8, armorPen: "Medium", quality: "Standard", priceCp: 735, priceDisplay: "7si 35cp", descriptionFull: "Steppe Sabre. Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion. Trusted from Southern Steppes, it proves dependable steel sized for medium engagements. Favoured for mounted draw-cuts and fluid passing strikes." },
    { name: "Steppe Sabre", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion.", fightingStyle: "Mounted draw-cuts and fluid passing strikes", attackSpeed: 6.8, damage: 5.8, armorPen: "Medium", quality: "Fine", priceCp: 1065, priceDisplay: "10si 65cp", descriptionFull: "Fine Steppe Sabre. Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for mounted draw-cuts and fluid passing strikes." },
    { name: "Steppe Sabre", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion.", fightingStyle: "Mounted draw-cuts and fluid passing strikes", attackSpeed: 6.8, damage: 5.8, armorPen: "Medium", quality: "Masterwork", priceCp: 1725, priceDisplay: "17si 25cp", descriptionFull: "Masterwork Steppe Sabre. Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for mounted draw-cuts and fluid passing strikes." },
    { name: "Eastern Straightblade", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short/Medium", description: "Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise.", fightingStyle: "Precision fencing, balanced cuts and thrusts", attackSpeed: 7.5, damage: 4.8, armorPen: "Medium", quality: "Standard", priceCp: 545, priceDisplay: "5si 45cp", descriptionFull: "Eastern Straightblade. Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise. Trusted from Eastern Realms, it proves dependable steel sized for small engagements. Favoured for precision fencing, balanced cuts and thrusts." },
    { name: "Eastern Straightblade", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short/Medium", description: "Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise.", fightingStyle: "Precision fencing, balanced cuts and thrusts", attackSpeed: 7.5, damage: 4.8, armorPen: "Medium", quality: "Fine", priceCp: 790, priceDisplay: "7si 90cp", descriptionFull: "Fine Eastern Straightblade. Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for precision fencing, balanced cuts and thrusts." },
    { name: "Eastern Straightblade", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short/Medium", description: "Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise.", fightingStyle: "Precision fencing, balanced cuts and thrusts", attackSpeed: 7.5, damage: 4.8, armorPen: "Medium", quality: "Masterwork", priceCp: 1275, priceDisplay: "12si 75cp", descriptionFull: "Masterwork Eastern Straightblade. Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for precision fencing, balanced cuts and thrusts." },
    { name: "Blade of the Tide", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen.", fightingStyle: "Two-handed draw-cuts and precise diagonal slashes", attackSpeed: 6.5, damage: 6.2, armorPen: "Medium-High", quality: "Standard", priceCp: 1145, priceDisplay: "11si 45cp", descriptionFull: "Blade of the Tide. Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen. Trusted from Island Clans, it proves dependable steel sized for medium engagements. Favoured for two-handed draw-cuts and precise diagonal slashes." },
    { name: "Blade of the Tide", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen.", fightingStyle: "Two-handed draw-cuts and precise diagonal slashes", attackSpeed: 6.5, damage: 6.2, armorPen: "Medium-High", quality: "Fine", priceCp: 1660, priceDisplay: "16si 60cp", descriptionFull: "Fine Blade of the Tide. Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for two-handed draw-cuts and precise diagonal slashes." },
    { name: "Blade of the Tide", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen.", fightingStyle: "Two-handed draw-cuts and precise diagonal slashes", attackSpeed: 6.5, damage: 6.2, armorPen: "Medium-High", quality: "Masterwork", priceCp: 2685, priceDisplay: "1g 6si 85cp", descriptionFull: "Masterwork Blade of the Tide. Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for two-handed draw-cuts and precise diagonal slashes." },
    { name: "Great-Edge", region: "Island Clans", size: "Very Large", hands: 2, reach: "Very Long", description: "Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight.", fightingStyle: "Sweeping, space-hungry strikes; anti-cavalry limb-cleavers", attackSpeed: 3.2, damage: 9.2, armorPen: "High", quality: "Standard", priceCp: 2070, priceDisplay: "1g 70cp", descriptionFull: "Great-Edge. Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight. Trusted from Island Clans, it proves dependable steel sized for very large engagements. Favoured for sweeping, space-hungry strikes; anti-cavalry limb-cleavers." },
    { name: "Great-Edge", region: "Island Clans", size: "Very Large", hands: 2, reach: "Very Long", description: "Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight.", fightingStyle: "Sweeping, space-hungry strikes; anti-cavalry limb-cleavers", attackSpeed: 3.2, damage: 9.2, armorPen: "High", quality: "Fine", priceCp: 3000, priceDisplay: "1g 10si", descriptionFull: "Fine Great-Edge. Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for sweeping, space-hungry strikes; anti-cavalry limb-cleavers." },
    { name: "Great-Edge", region: "Island Clans", size: "Very Large", hands: 2, reach: "Very Long", description: "Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight.", fightingStyle: "Sweeping, space-hungry strikes; anti-cavalry limb-cleavers", attackSpeed: 3.2, damage: 9.2, armorPen: "High", quality: "Masterwork", priceCp: 4860, priceDisplay: "2g 8si 60cp", descriptionFull: "Masterwork Great-Edge. Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for sweeping, space-hungry strikes; anti-cavalry limb-cleavers." },
    { name: "Companion Blade", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes.", fightingStyle: "Defensive parries, opportunistic ripostes", attackSpeed: 7.8, damage: 4.5, armorPen: "Medium", quality: "Standard", priceCp: 510, priceDisplay: "5si 10cp", descriptionFull: "Companion Blade. Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes. Trusted from Island Clans, it proves dependable steel sized for small engagements. Favoured for defensive parries, opportunistic ripostes." },
    { name: "Companion Blade", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes.", fightingStyle: "Defensive parries, opportunistic ripostes", attackSpeed: 7.8, damage: 4.5, armorPen: "Medium", quality: "Fine", priceCp: 740, priceDisplay: "7si 40cp", descriptionFull: "Fine Companion Blade. Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for defensive parries, opportunistic ripostes." },
    { name: "Companion Blade", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes.", fightingStyle: "Defensive parries, opportunistic ripostes", attackSpeed: 7.8, damage: 4.5, armorPen: "Medium", quality: "Masterwork", priceCp: 1200, priceDisplay: "12si", descriptionFull: "Masterwork Companion Blade. Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for defensive parries, opportunistic ripostes." },
    { name: "Bronze Leafblade", region: "High Kingdoms", size: "Small", hands: 1, reach: "Short/Medium", description: "Leaf-shaped bronze blade with simple crossguard, rawhide-wrapped grip, and a wood core scabbard; dependable starter steel for militia drilling.", fightingStyle: "Entry cuts and shield-line thrusts", attackSpeed: 7.2, damage: 4.4, armorPen: "Low-Medium", quality: "Standard", priceCp: 490, priceDisplay: "4si 90cp", descriptionFull: "Bronze Leafblade. Leaf-shaped bronze blade with simple crossguard, rawhide-wrapped grip, and a wood core scabbard; dependable starter steel for militia drilling. Trusted from High Kingdoms, it proves dependable steel sized for small engagements. Favoured for entry cuts and shield-line thrusts." },
    { name: "Bronze Leafblade", region: "High Kingdoms", size: "Small", hands: 1, reach: "Short/Medium", description: "Leaf-shaped bronze blade with simple crossguard, rawhide-wrapped grip, and a wood core scabbard; dependable starter steel for militia drilling.", fightingStyle: "Entry cuts and shield-line thrusts", attackSpeed: 7.2, damage: 4.4, armorPen: "Low-Medium", quality: "Fine", priceCp: 715, priceDisplay: "7si 15cp", descriptionFull: "Fine Bronze Leafblade. Leaf-shaped bronze blade with simple crossguard, rawhide-wrapped grip, and a wood core scabbard; dependable starter steel for militia drilling. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for entry cuts and shield-line thrusts." },
    { name: "Bronze Leafblade", region: "High Kingdoms", size: "Small", hands: 1, reach: "Short/Medium", description: "Leaf-shaped bronze blade with simple crossguard, rawhide-wrapped grip, and a wood core scabbard; dependable starter steel for militia drilling.", fightingStyle: "Entry cuts and shield-line thrusts", attackSpeed: 7.2, damage: 4.4, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 1155, priceDisplay: "11si 55cp", descriptionFull: "Masterwork Bronze Leafblade. Leaf-shaped bronze blade with simple crossguard, rawhide-wrapped grip, and a wood core scabbard; dependable starter steel for militia drilling. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for entry cuts and shield-line thrusts." },
    { name: "Kopis Cutter", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Forward-curved single-edged blade with thick spine and clip point; bronze backstrap and horn grip flare; meant to chop from hip or saddle.", fightingStyle: "Sweeping draw-cuts and decisive chops", attackSpeed: 6.8, damage: 5.7, armorPen: "Medium", quality: "Standard", priceCp: 820, priceDisplay: "8si 20cp", descriptionFull: "Kopis Cutter. Forward-curved single-edged blade with thick spine and clip point; bronze backstrap and horn grip flare; meant to chop from hip or saddle. Trusted from Southern Kingdoms, it proves dependable steel sized for medium engagements. Favoured for sweeping draw-cuts and decisive chops." },
    { name: "Kopis Cutter", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Forward-curved single-edged blade with thick spine and clip point; bronze backstrap and horn grip flare; meant to chop from hip or saddle.", fightingStyle: "Sweeping draw-cuts and decisive chops", attackSpeed: 6.8, damage: 5.7, armorPen: "Medium", quality: "Fine", priceCp: 1185, priceDisplay: "11si 85cp", descriptionFull: "Fine Kopis Cutter. Forward-curved single-edged blade with thick spine and clip point; bronze backstrap and horn grip flare; meant to chop from hip or saddle. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for sweeping draw-cuts and decisive chops." },
    { name: "Kopis Cutter", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Forward-curved single-edged blade with thick spine and clip point; bronze backstrap and horn grip flare; meant to chop from hip or saddle.", fightingStyle: "Sweeping draw-cuts and decisive chops", attackSpeed: 6.8, damage: 5.7, armorPen: "Medium", quality: "Masterwork", priceCp: 1925, priceDisplay: "19si 25cp", descriptionFull: "Masterwork Kopis Cutter. Forward-curved single-edged blade with thick spine and clip point; bronze backstrap and horn grip flare; meant to chop from hip or saddle. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for sweeping draw-cuts and decisive chops." },
    { name: "Tegha Broadblade", region: "Southern Steppes", size: "Large", hands: 2, reach: "Long", description: "Wide-backed steppe war blade with long ovoid grip, iron guard rings, and horsehair tassels; rides across saddles yet hews with camp-clearing weight.", fightingStyle: "Two-handed hews from saddle or line", attackSpeed: 5.8, damage: 7, armorPen: "Medium-High", quality: "Standard", priceCp: 1430, priceDisplay: "14si 30cp", descriptionFull: "Tegha Broadblade. Wide-backed steppe war blade with long ovoid grip, iron guard rings, and horsehair tassels; rides across saddles yet hews with camp-clearing weight. Trusted from Southern Steppes, it proves dependable steel sized for large engagements. Favoured for two-handed hews from saddle or line." },
    { name: "Tegha Broadblade", region: "Southern Steppes", size: "Large", hands: 2, reach: "Long", description: "Wide-backed steppe war blade with long ovoid grip, iron guard rings, and horsehair tassels; rides across saddles yet hews with camp-clearing weight.", fightingStyle: "Two-handed hews from saddle or line", attackSpeed: 5.8, damage: 7, armorPen: "Medium-High", quality: "Fine", priceCp: 2075, priceDisplay: "1g 75cp", descriptionFull: "Fine Tegha Broadblade. Wide-backed steppe war blade with long ovoid grip, iron guard rings, and horsehair tassels; rides across saddles yet hews with camp-clearing weight. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for two-handed hews from saddle or line." },
    { name: "Tegha Broadblade", region: "Southern Steppes", size: "Large", hands: 2, reach: "Long", description: "Wide-backed steppe war blade with long ovoid grip, iron guard rings, and horsehair tassels; rides across saddles yet hews with camp-clearing weight.", fightingStyle: "Two-handed hews from saddle or line", attackSpeed: 5.8, damage: 7, armorPen: "Medium-High", quality: "Masterwork", priceCp: 3365, priceDisplay: "1g 13si 65cp", descriptionFull: "Masterwork Tegha Broadblade. Wide-backed steppe war blade with long ovoid grip, iron guard rings, and horsehair tassels; rides across saddles yet hews with camp-clearing weight. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for two-handed hews from saddle or line." },
    { name: "Shashka Officer Saber", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Medium", description: "Slim, guardless saber of polished steel with subtly flared tip; lacquered wood grip capped in brass; carriage blade for lightning cavalry drills.", fightingStyle: "High-cadence slashes and ripostes", attackSpeed: 7.3, damage: 5.4, armorPen: "Medium", quality: "Standard", priceCp: 795, priceDisplay: "7si 95cp", descriptionFull: "Shashka Officer Saber. Slim, guardless saber of polished steel with subtly flared tip; lacquered wood grip capped in brass; carriage blade for lightning cavalry drills. Trusted from Eastern Realms, it proves dependable steel sized for medium engagements. Favoured for high-cadence slashes and ripostes." },
    { name: "Shashka Officer Saber", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Medium", description: "Slim, guardless saber of polished steel with subtly flared tip; lacquered wood grip capped in brass; carriage blade for lightning cavalry drills.", fightingStyle: "High-cadence slashes and ripostes", attackSpeed: 7.3, damage: 5.4, armorPen: "Medium", quality: "Fine", priceCp: 1150, priceDisplay: "11si 50cp", descriptionFull: "Fine Shashka Officer Saber. Slim, guardless saber of polished steel with subtly flared tip; lacquered wood grip capped in brass; carriage blade for lightning cavalry drills. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for high-cadence slashes and ripostes." },
    { name: "Shashka Officer Saber", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Medium", description: "Slim, guardless saber of polished steel with subtly flared tip; lacquered wood grip capped in brass; carriage blade for lightning cavalry drills.", fightingStyle: "High-cadence slashes and ripostes", attackSpeed: 7.3, damage: 5.4, armorPen: "Medium", quality: "Masterwork", priceCp: 1865, priceDisplay: "18si 65cp", descriptionFull: "Masterwork Shashka Officer Saber. Slim, guardless saber of polished steel with subtly flared tip; lacquered wood grip capped in brass; carriage blade for lightning cavalry drills. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for high-cadence slashes and ripostes." },
    { name: "Flanged Sabre", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Medium/Long", description: "Curved desert saber with reinforced flanged spine, crescent guard, and wrapped palm swell; keeps edge keen even after biting through armor seams.", fightingStyle: "Armor-splitting slashes and hooking parries", attackSpeed: 6.7, damage: 5.9, armorPen: "Medium-High", quality: "Standard", priceCp: 950, priceDisplay: "9si 50cp", descriptionFull: "Flanged Sabre. Curved desert saber with reinforced flanged spine, crescent guard, and wrapped palm swell; keeps edge keen even after biting through armor seams. Trusted from Southern Kingdoms, it proves dependable steel sized for medium engagements. Favoured for armor-splitting slashes and hooking parries." },
    { name: "Flanged Sabre", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Medium/Long", description: "Curved desert saber with reinforced flanged spine, crescent guard, and wrapped palm swell; keeps edge keen even after biting through armor seams.", fightingStyle: "Armor-splitting slashes and hooking parries", attackSpeed: 6.7, damage: 5.9, armorPen: "Medium-High", quality: "Fine", priceCp: 1380, priceDisplay: "13si 80cp", descriptionFull: "Fine Flanged Sabre. Curved desert saber with reinforced flanged spine, crescent guard, and wrapped palm swell; keeps edge keen even after biting through armor seams. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for armor-splitting slashes and hooking parries." },
    { name: "Flanged Sabre", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Medium/Long", description: "Curved desert saber with reinforced flanged spine, crescent guard, and wrapped palm swell; keeps edge keen even after biting through armor seams.", fightingStyle: "Armor-splitting slashes and hooking parries", attackSpeed: 6.7, damage: 5.9, armorPen: "Medium-High", quality: "Masterwork", priceCp: 2235, priceDisplay: "1g 2si 35cp", descriptionFull: "Masterwork Flanged Sabre. Curved desert saber with reinforced flanged spine, crescent guard, and wrapped palm swell; keeps edge keen even after biting through armor seams. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for armor-splitting slashes and hooking parries." },
    { name: "Xiphos Leaf Sword", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short/Medium", description: "Classical leaf-shaped double edge of bright steel, bronze disk guard, and linen-wrapped grip; marches with hoplite shields into close press.", fightingStyle: "Shield-line stabs and tight cuts", attackSpeed: 7.3, damage: 4.9, armorPen: "Medium", quality: "Standard", priceCp: 540, priceDisplay: "5si 40cp", descriptionFull: "Xiphos Leaf Sword. Classical leaf-shaped double edge of bright steel, bronze disk guard, and linen-wrapped grip; marches with hoplite shields into close press. Trusted from Southern Kingdoms, it proves dependable steel sized for small engagements. Favoured for shield-line stabs and tight cuts." },
    { name: "Xiphos Leaf Sword", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short/Medium", description: "Classical leaf-shaped double edge of bright steel, bronze disk guard, and linen-wrapped grip; marches with hoplite shields into close press.", fightingStyle: "Shield-line stabs and tight cuts", attackSpeed: 7.3, damage: 4.9, armorPen: "Medium", quality: "Fine", priceCp: 785, priceDisplay: "7si 85cp", descriptionFull: "Fine Xiphos Leaf Sword. Classical leaf-shaped double edge of bright steel, bronze disk guard, and linen-wrapped grip; marches with hoplite shields into close press. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for shield-line stabs and tight cuts." },
    { name: "Xiphos Leaf Sword", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short/Medium", description: "Classical leaf-shaped double edge of bright steel, bronze disk guard, and linen-wrapped grip; marches with hoplite shields into close press.", fightingStyle: "Shield-line stabs and tight cuts", attackSpeed: 7.3, damage: 4.9, armorPen: "Medium", quality: "Masterwork", priceCp: 1275, priceDisplay: "12si 75cp", descriptionFull: "Masterwork Xiphos Leaf Sword. Classical leaf-shaped double edge of bright steel, bronze disk guard, and linen-wrapped grip; marches with hoplite shields into close press. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for shield-line stabs and tight cuts." },
    { name: "Sawtooth Falx", region: "Borderlands", size: "Large", hands: 2, reach: "Medium/Long", description: "Hooked underrealm blade with serrated inner edge, dark-etched steel, and bone-capped haft; drags shields aside before rending down.", fightingStyle: "Hooking pulls and brutal overhand cleaves", attackSpeed: 4.9, damage: 7.8, armorPen: "High", quality: "Standard", priceCp: 1760, priceDisplay: "17si 60cp", descriptionFull: "Sawtooth Falx. Hooked underrealm blade with serrated inner edge, dark-etched steel, and bone-capped haft; drags shields aside before rending down. Trusted from Borderlands, it proves dependable steel sized for large engagements. Favoured for hooking pulls and brutal overhand cleaves." },
    { name: "Sawtooth Falx", region: "Borderlands", size: "Large", hands: 2, reach: "Medium/Long", description: "Hooked underrealm blade with serrated inner edge, dark-etched steel, and bone-capped haft; drags shields aside before rending down.", fightingStyle: "Hooking pulls and brutal overhand cleaves", attackSpeed: 4.9, damage: 7.8, armorPen: "High", quality: "Fine", priceCp: 2555, priceDisplay: "1g 5si 55cp", descriptionFull: "Fine Sawtooth Falx. Hooked underrealm blade with serrated inner edge, dark-etched steel, and bone-capped haft; drags shields aside before rending down. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for hooking pulls and brutal overhand cleaves." },
    { name: "Sawtooth Falx", region: "Borderlands", size: "Large", hands: 2, reach: "Medium/Long", description: "Hooked underrealm blade with serrated inner edge, dark-etched steel, and bone-capped haft; drags shields aside before rending down.", fightingStyle: "Hooking pulls and brutal overhand cleaves", attackSpeed: 4.9, damage: 7.8, armorPen: "High", quality: "Masterwork", priceCp: 4140, priceDisplay: "2g 1si 40cp", descriptionFull: "Masterwork Sawtooth Falx. Hooked underrealm blade with serrated inner edge, dark-etched steel, and bone-capped haft; drags shields aside before rending down. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for hooking pulls and brutal overhand cleaves." },
    { name: "City Gentle’s Cane", region: "High Kingdoms", size: "Small", hands: 1, reach: "Medium", description: "Polished walking cane with hidden slender blade, silver ferrule, and engraved knob; draws with a twist to surprise alley threats.", fightingStyle: "Discreet thrusts and cloak-assisted ripostes", attackSpeed: 7.6, damage: 4.2, armorPen: "Low-Medium", quality: "Standard", priceCp: 570, priceDisplay: "5si 70cp", descriptionFull: "City Gentle’s Cane. Polished walking cane with hidden slender blade, silver ferrule, and engraved knob; draws with a twist to surprise alley threats. Trusted from High Kingdoms, it proves dependable steel sized for small engagements. Favoured for discreet thrusts and cloak-assisted ripostes." },
    { name: "City Gentle’s Cane", region: "High Kingdoms", size: "Small", hands: 1, reach: "Medium", description: "Polished walking cane with hidden slender blade, silver ferrule, and engraved knob; draws with a twist to surprise alley threats.", fightingStyle: "Discreet thrusts and cloak-assisted ripostes", attackSpeed: 7.6, damage: 4.2, armorPen: "Low-Medium", quality: "Fine", priceCp: 825, priceDisplay: "8si 25cp", descriptionFull: "Fine City Gentle’s Cane. Polished walking cane with hidden slender blade, silver ferrule, and engraved knob; draws with a twist to surprise alley threats. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for discreet thrusts and cloak-assisted ripostes." },
    { name: "City Gentle’s Cane", region: "High Kingdoms", size: "Small", hands: 1, reach: "Medium", description: "Polished walking cane with hidden slender blade, silver ferrule, and engraved knob; draws with a twist to surprise alley threats.", fightingStyle: "Discreet thrusts and cloak-assisted ripostes", attackSpeed: 7.6, damage: 4.2, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 1340, priceDisplay: "13si 40cp", descriptionFull: "Masterwork City Gentle’s Cane. Polished walking cane with hidden slender blade, silver ferrule, and engraved knob; draws with a twist to surprise alley threats. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for discreet thrusts and cloak-assisted ripostes." },
    { name: "Dual Set: Wakizashi Companion + Tanto Sideblade", region: "Island Clans", size: "Medium", hands: 2, reach: "Short", description: "Matched pair of lacquered scabbards holding a wakizashi and tanto; ray-skin grips in midnight cord, iron tsuba with moon motifs; danced in alternating cuts.", fightingStyle: "Alternating twin-blade slashes and traps", attackSpeed: 8, damage: 5, armorPen: "Medium", quality: "Standard", priceCp: 940, priceDisplay: "9si 40cp", descriptionFull: "Dual Set: Wakizashi Companion + Tanto Sideblade. Matched pair of lacquered scabbards holding a wakizashi and tanto; ray-skin grips in midnight cord, iron tsuba with moon motifs; danced in alternating cuts. Trusted from Island Clans, it proves dependable steel sized for medium engagements. Favoured for alternating twin-blade slashes and traps." },
    { name: "Dual Set: Wakizashi Companion + Tanto Sideblade", region: "Island Clans", size: "Medium", hands: 2, reach: "Short", description: "Matched pair of lacquered scabbards holding a wakizashi and tanto; ray-skin grips in midnight cord, iron tsuba with moon motifs; danced in alternating cuts.", fightingStyle: "Alternating twin-blade slashes and traps", attackSpeed: 8, damage: 5, armorPen: "Medium", quality: "Fine", priceCp: 1365, priceDisplay: "13si 65cp", descriptionFull: "Fine Dual Set: Wakizashi Companion + Tanto Sideblade. Matched pair of lacquered scabbards holding a wakizashi and tanto; ray-skin grips in midnight cord, iron tsuba with moon motifs; danced in alternating cuts. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for alternating twin-blade slashes and traps." },
    { name: "Dual Set: Wakizashi Companion + Tanto Sideblade", region: "Island Clans", size: "Medium", hands: 2, reach: "Short", description: "Matched pair of lacquered scabbards holding a wakizashi and tanto; ray-skin grips in midnight cord, iron tsuba with moon motifs; danced in alternating cuts.", fightingStyle: "Alternating twin-blade slashes and traps", attackSpeed: 8, damage: 5, armorPen: "Medium", quality: "Masterwork", priceCp: 2210, priceDisplay: "1g 2si 10cp", descriptionFull: "Masterwork Dual Set: Wakizashi Companion + Tanto Sideblade. Matched pair of lacquered scabbards holding a wakizashi and tanto; ray-skin grips in midnight cord, iron tsuba with moon motifs; danced in alternating cuts. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for alternating twin-blade slashes and traps." },
  ],
  daggers: [
    { name: "Misericorde", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust.", fightingStyle: "Finishing thrusts into armor gaps", attackSpeed: 10, damage: 2, armorPen: "High", quality: "Standard", priceCp: 130, priceDisplay: "1si 30cp", descriptionFull: "Misericorde. Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust. Trusted from High Kingdoms, it proves dependable steel sized for tiny engagements. Favoured for finishing thrusts into armor gaps." },
    { name: "Misericorde", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust.", fightingStyle: "Finishing thrusts into armor gaps", attackSpeed: 10, damage: 2, armorPen: "High", quality: "Fine", priceCp: 190, priceDisplay: "1si 90cp", descriptionFull: "Fine Misericorde. Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its tiny frame. Favoured for finishing thrusts into armor gaps." },
    { name: "Misericorde", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust.", fightingStyle: "Finishing thrusts into armor gaps", attackSpeed: 10, damage: 2, armorPen: "High", quality: "Masterwork", priceCp: 310, priceDisplay: "3si 10cp", descriptionFull: "Masterwork Misericorde. Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for finishing thrusts into armor gaps." },
    { name: "Rondel", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure.", fightingStyle: "Armor-piercing thrusts, close grapples", attackSpeed: 9.5, damage: 2.3, armorPen: "High", quality: "Standard", priceCp: 135, priceDisplay: "1si 35cp", descriptionFull: "Rondel. Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure. Trusted from High Kingdoms, it proves dependable steel sized for tiny engagements. Favoured for armor-piercing thrusts, close grapples." },
    { name: "Rondel", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure.", fightingStyle: "Armor-piercing thrusts, close grapples", attackSpeed: 9.5, damage: 2.3, armorPen: "High", quality: "Fine", priceCp: 195, priceDisplay: "1si 95cp", descriptionFull: "Fine Rondel. Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its tiny frame. Favoured for armor-piercing thrusts, close grapples." },
    { name: "Rondel", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure.", fightingStyle: "Armor-piercing thrusts, close grapples", attackSpeed: 9.5, damage: 2.3, armorPen: "High", quality: "Masterwork", priceCp: 315, priceDisplay: "3si 15cp", descriptionFull: "Masterwork Rondel. Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for armor-piercing thrusts, close grapples." },
    { name: "Push-Spike", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons.", fightingStyle: "Punching stabs; breaks through layered armor", attackSpeed: 9, damage: 2.8, armorPen: "Medium-High", quality: "Standard", priceCp: 180, priceDisplay: "1si 80cp", descriptionFull: "Push-Spike. H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons. Trusted from Southern Kingdoms, it proves dependable steel sized for small engagements. Favoured for punching stabs; breaks through layered armor." },
    { name: "Push-Spike", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons.", fightingStyle: "Punching stabs; breaks through layered armor", attackSpeed: 9, damage: 2.8, armorPen: "Medium-High", quality: "Fine", priceCp: 260, priceDisplay: "2si 60cp", descriptionFull: "Fine Push-Spike. H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for punching stabs; breaks through layered armor." },
    { name: "Push-Spike", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons.", fightingStyle: "Punching stabs; breaks through layered armor", attackSpeed: 9, damage: 2.8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 425, priceDisplay: "4si 25cp", descriptionFull: "Masterwork Push-Spike. H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for punching stabs; breaks through layered armor." },
    { name: "Piercer", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints.", fightingStyle: "Silent entries, seam strikes, assassin’s work", attackSpeed: 8.5, damage: 3, armorPen: "High", quality: "Standard", priceCp: 205, priceDisplay: "2si 5cp", descriptionFull: "Piercer. Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints. Trusted from Eastern Realms, it proves dependable steel sized for small engagements. Favoured for silent entries, seam strikes, assassin’s work." },
    { name: "Piercer", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints.", fightingStyle: "Silent entries, seam strikes, assassin’s work", attackSpeed: 8.5, damage: 3, armorPen: "High", quality: "Fine", priceCp: 300, priceDisplay: "3si", descriptionFull: "Fine Piercer. Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for silent entries, seam strikes, assassin’s work." },
    { name: "Piercer", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints.", fightingStyle: "Silent entries, seam strikes, assassin’s work", attackSpeed: 8.5, damage: 3, armorPen: "High", quality: "Masterwork", priceCp: 485, priceDisplay: "4si 85cp", descriptionFull: "Masterwork Piercer. Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for silent entries, seam strikes, assassin’s work." },
    { name: "Curved Twin-Edge", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters.", fightingStyle: "Snapping slashes with opportunistic thrusts", attackSpeed: 8.5, damage: 2.6, armorPen: "Medium", quality: "Standard", priceCp: 155, priceDisplay: "1si 55cp", descriptionFull: "Curved Twin-Edge. Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters. Trusted from Southern Kingdoms, it proves dependable steel sized for small engagements. Favoured for snapping slashes with opportunistic thrusts." },
    { name: "Curved Twin-Edge", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters.", fightingStyle: "Snapping slashes with opportunistic thrusts", attackSpeed: 8.5, damage: 2.6, armorPen: "Medium", quality: "Fine", priceCp: 225, priceDisplay: "2si 25cp", descriptionFull: "Fine Curved Twin-Edge. Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for snapping slashes with opportunistic thrusts." },
    { name: "Curved Twin-Edge", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters.", fightingStyle: "Snapping slashes with opportunistic thrusts", attackSpeed: 8.5, damage: 2.6, armorPen: "Medium", quality: "Masterwork", priceCp: 365, priceDisplay: "3si 65cp", descriptionFull: "Masterwork Curved Twin-Edge. Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for snapping slashes with opportunistic thrusts." },
    { name: "Wavesong Dagger", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite.", fightingStyle: "Cutting draws and shallow pierces", attackSpeed: 8, damage: 2.7, armorPen: "Medium", quality: "Standard", priceCp: 155, priceDisplay: "1si 55cp", descriptionFull: "Wavesong Dagger. Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite. Trusted from Island Clans, it proves dependable steel sized for small engagements. Favoured for cutting draws and shallow pierces." },
    { name: "Wavesong Dagger", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite.", fightingStyle: "Cutting draws and shallow pierces", attackSpeed: 8, damage: 2.7, armorPen: "Medium", quality: "Fine", priceCp: 225, priceDisplay: "2si 25cp", descriptionFull: "Fine Wavesong Dagger. Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for cutting draws and shallow pierces." },
    { name: "Wavesong Dagger", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite.", fightingStyle: "Cutting draws and shallow pierces", attackSpeed: 8, damage: 2.7, armorPen: "Medium", quality: "Masterwork", priceCp: 360, priceDisplay: "3si 60cp", descriptionFull: "Masterwork Wavesong Dagger. Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for cutting draws and shallow pierces." },
    { name: "Cairn Dirk", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company.", fightingStyle: "Close thrusts and quick chops", attackSpeed: 8.5, damage: 3.2, armorPen: "Medium", quality: "Standard", priceCp: 165, priceDisplay: "1si 65cp", descriptionFull: "Cairn Dirk. Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company. Trusted from Northern Marches, it proves dependable steel sized for small engagements. Favoured for close thrusts and quick chops." },
    { name: "Cairn Dirk", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company.", fightingStyle: "Close thrusts and quick chops", attackSpeed: 8.5, damage: 3.2, armorPen: "Medium", quality: "Fine", priceCp: 240, priceDisplay: "2si 40cp", descriptionFull: "Fine Cairn Dirk. Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for close thrusts and quick chops." },
    { name: "Cairn Dirk", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company.", fightingStyle: "Close thrusts and quick chops", attackSpeed: 8.5, damage: 3.2, armorPen: "Medium", quality: "Masterwork", priceCp: 385, priceDisplay: "3si 85cp", descriptionFull: "Masterwork Cairn Dirk. Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for close thrusts and quick chops." },
    { name: "Tanto Sideblade", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Straight-ground side dagger with ridged spine, ray-skin wrap, and horn caps; pairs with longer blades for confined quarters.", fightingStyle: "Close-guard slashes with thrusting ripostes", attackSpeed: 8.8, damage: 2.9, armorPen: "Medium", quality: "Standard", priceCp: 160, priceDisplay: "1si 60cp", descriptionFull: "Tanto Sideblade. Straight-ground side dagger with ridged spine, ray-skin wrap, and horn caps; pairs with longer blades for confined quarters. Trusted from Island Clans, it proves dependable steel sized for small engagements. Favoured for close-guard slashes with thrusting ripostes." },
    { name: "Tanto Sideblade", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Straight-ground side dagger with ridged spine, ray-skin wrap, and horn caps; pairs with longer blades for confined quarters.", fightingStyle: "Close-guard slashes with thrusting ripostes", attackSpeed: 8.8, damage: 2.9, armorPen: "Medium", quality: "Fine", priceCp: 235, priceDisplay: "2si 35cp", descriptionFull: "Fine Tanto Sideblade. Straight-ground side dagger with ridged spine, ray-skin wrap, and horn caps; pairs with longer blades for confined quarters. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for close-guard slashes with thrusting ripostes." },
    { name: "Tanto Sideblade", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Straight-ground side dagger with ridged spine, ray-skin wrap, and horn caps; pairs with longer blades for confined quarters.", fightingStyle: "Close-guard slashes with thrusting ripostes", attackSpeed: 8.8, damage: 2.9, armorPen: "Medium", quality: "Masterwork", priceCp: 380, priceDisplay: "3si 80cp", descriptionFull: "Masterwork Tanto Sideblade. Straight-ground side dagger with ridged spine, ray-skin wrap, and horn caps; pairs with longer blades for confined quarters. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for close-guard slashes with thrusting ripostes." },
    { name: "Kris Wave Dagger", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Undulating southern island blade of layered steels, carved hardwood grip, and silver ferrules; famed for ritual duels and stealthy cuts.", fightingStyle: "Snaking draw-cuts that worry wounds", attackSpeed: 8.2, damage: 3, armorPen: "Medium", quality: "Standard", priceCp: 175, priceDisplay: "1si 75cp", descriptionFull: "Kris Wave Dagger. Undulating southern island blade of layered steels, carved hardwood grip, and silver ferrules; famed for ritual duels and stealthy cuts. Trusted from Island Clans, it proves dependable steel sized for small engagements. Favoured for snaking draw-cuts that worry wounds." },
    { name: "Kris Wave Dagger", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Undulating southern island blade of layered steels, carved hardwood grip, and silver ferrules; famed for ritual duels and stealthy cuts.", fightingStyle: "Snaking draw-cuts that worry wounds", attackSpeed: 8.2, damage: 3, armorPen: "Medium", quality: "Fine", priceCp: 255, priceDisplay: "2si 55cp", descriptionFull: "Fine Kris Wave Dagger. Undulating southern island blade of layered steels, carved hardwood grip, and silver ferrules; famed for ritual duels and stealthy cuts. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for snaking draw-cuts that worry wounds." },
    { name: "Kris Wave Dagger", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Undulating southern island blade of layered steels, carved hardwood grip, and silver ferrules; famed for ritual duels and stealthy cuts.", fightingStyle: "Snaking draw-cuts that worry wounds", attackSpeed: 8.2, damage: 3, armorPen: "Medium", quality: "Masterwork", priceCp: 415, priceDisplay: "4si 15cp", descriptionFull: "Masterwork Kris Wave Dagger. Undulating southern island blade of layered steels, carved hardwood grip, and silver ferrules; famed for ritual duels and stealthy cuts. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for snaking draw-cuts that worry wounds." },
    { name: "Karambit Claw", region: "Southern Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Curved claw dagger with finger ring, darkened steel, and cord-wrapped tang; excels at hooking tendons and wrenching grips.", fightingStyle: "Hooking slashes and control grapples", attackSpeed: 9, damage: 2.7, armorPen: "Medium", quality: "Standard", priceCp: 120, priceDisplay: "1si 20cp", descriptionFull: "Karambit Claw. Curved claw dagger with finger ring, darkened steel, and cord-wrapped tang; excels at hooking tendons and wrenching grips. Trusted from Southern Kingdoms, it proves dependable steel sized for tiny engagements. Favoured for hooking slashes and control grapples." },
    { name: "Karambit Claw", region: "Southern Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Curved claw dagger with finger ring, darkened steel, and cord-wrapped tang; excels at hooking tendons and wrenching grips.", fightingStyle: "Hooking slashes and control grapples", attackSpeed: 9, damage: 2.7, armorPen: "Medium", quality: "Fine", priceCp: 175, priceDisplay: "1si 75cp", descriptionFull: "Fine Karambit Claw. Curved claw dagger with finger ring, darkened steel, and cord-wrapped tang; excels at hooking tendons and wrenching grips. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its tiny frame. Favoured for hooking slashes and control grapples." },
    { name: "Karambit Claw", region: "Southern Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Curved claw dagger with finger ring, darkened steel, and cord-wrapped tang; excels at hooking tendons and wrenching grips.", fightingStyle: "Hooking slashes and control grapples", attackSpeed: 9, damage: 2.7, armorPen: "Medium", quality: "Masterwork", priceCp: 285, priceDisplay: "2si 85cp", descriptionFull: "Masterwork Karambit Claw. Curved claw dagger with finger ring, darkened steel, and cord-wrapped tang; excels at hooking tendons and wrenching grips. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for hooking slashes and control grapples." },
    { name: "Pesh-Kabz Tusk", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Reinforced-tang dagger with T-spine, ivory grip slabs, and tapered armor-piercing point; prized for puncturing mail and padded coats.", fightingStyle: "Thrust-focused armor breaches", attackSpeed: 8.3, damage: 3.1, armorPen: "High", quality: "Standard", priceCp: 205, priceDisplay: "2si 5cp", descriptionFull: "Pesh-Kabz Tusk. Reinforced-tang dagger with T-spine, ivory grip slabs, and tapered armor-piercing point; prized for puncturing mail and padded coats. Trusted from Eastern Realms, it proves dependable steel sized for small engagements. Favoured for thrust-focused armor breaches." },
    { name: "Pesh-Kabz Tusk", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Reinforced-tang dagger with T-spine, ivory grip slabs, and tapered armor-piercing point; prized for puncturing mail and padded coats.", fightingStyle: "Thrust-focused armor breaches", attackSpeed: 8.3, damage: 3.1, armorPen: "High", quality: "Fine", priceCp: 300, priceDisplay: "3si", descriptionFull: "Fine Pesh-Kabz Tusk. Reinforced-tang dagger with T-spine, ivory grip slabs, and tapered armor-piercing point; prized for puncturing mail and padded coats. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for thrust-focused armor breaches." },
    { name: "Pesh-Kabz Tusk", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Reinforced-tang dagger with T-spine, ivory grip slabs, and tapered armor-piercing point; prized for puncturing mail and padded coats.", fightingStyle: "Thrust-focused armor breaches", attackSpeed: 8.3, damage: 3.1, armorPen: "High", quality: "Masterwork", priceCp: 485, priceDisplay: "4si 85cp", descriptionFull: "Masterwork Pesh-Kabz Tusk. Reinforced-tang dagger with T-spine, ivory grip slabs, and tapered armor-piercing point; prized for puncturing mail and padded coats. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for thrust-focused armor breaches." },
  ],
  axes: [
    { name: "Long-Haft War Axe", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves.", fightingStyle: "Wide arcs and shield rips", attackSpeed: 4.8, damage: 7.8, armorPen: "Medium", quality: "Standard", priceCp: 1605, priceDisplay: "16si 5cp", descriptionFull: "Long-Haft War Axe. Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves. Trusted from Northern Marches, it proves dependable steel sized for large engagements. Favoured for wide arcs and shield rips." },
    { name: "Long-Haft War Axe", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves.", fightingStyle: "Wide arcs and shield rips", attackSpeed: 4.8, damage: 7.8, armorPen: "Medium", quality: "Fine", priceCp: 2330, priceDisplay: "1g 3si 30cp", descriptionFull: "Fine Long-Haft War Axe. Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for wide arcs and shield rips." },
    { name: "Long-Haft War Axe", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves.", fightingStyle: "Wide arcs and shield rips", attackSpeed: 4.8, damage: 7.8, armorPen: "Medium", quality: "Masterwork", priceCp: 3775, priceDisplay: "1g 17si 75cp", descriptionFull: "Masterwork Long-Haft War Axe. Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for wide arcs and shield rips." },
    { name: "Throwing Axe", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip.", fightingStyle: "Pre-melee volleys to disrupt formations", attackSpeed: 3, damage: 5, armorPen: "Medium", quality: "Standard", priceCp: 510, priceDisplay: "5si 10cp", descriptionFull: "Throwing Axe. Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip. Trusted from Northern Marches, it proves dependable steel sized for small engagements. Favoured for pre-melee volleys to disrupt formations." },
    { name: "Throwing Axe", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip.", fightingStyle: "Pre-melee volleys to disrupt formations", attackSpeed: 3, damage: 5, armorPen: "Medium", quality: "Fine", priceCp: 740, priceDisplay: "7si 40cp", descriptionFull: "Fine Throwing Axe. Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for pre-melee volleys to disrupt formations." },
    { name: "Throwing Axe", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip.", fightingStyle: "Pre-melee volleys to disrupt formations", attackSpeed: 3, damage: 5, armorPen: "Medium", quality: "Masterwork", priceCp: 1200, priceDisplay: "12si", descriptionFull: "Masterwork Throwing Axe. Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for pre-melee volleys to disrupt formations." },
    { name: "Long-Blade Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes.", fightingStyle: "Cleaving strikes that punish clustered foes", attackSpeed: 4.2, damage: 8.2, armorPen: "High", quality: "Standard", priceCp: 2005, priceDisplay: "1g 5cp", descriptionFull: "Long-Blade Axe. Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes. Trusted from Borderlands, it proves dependable steel sized for large engagements. Favoured for cleaving strikes that punish clustered foes." },
    { name: "Long-Blade Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes.", fightingStyle: "Cleaving strikes that punish clustered foes", attackSpeed: 4.2, damage: 8.2, armorPen: "High", quality: "Fine", priceCp: 2910, priceDisplay: "1g 9si 10cp", descriptionFull: "Fine Long-Blade Axe. Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for cleaving strikes that punish clustered foes." },
    { name: "Long-Blade Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes.", fightingStyle: "Cleaving strikes that punish clustered foes", attackSpeed: 4.2, damage: 8.2, armorPen: "High", quality: "Masterwork", priceCp: 4715, priceDisplay: "2g 7si 15cp", descriptionFull: "Masterwork Long-Blade Axe. Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for cleaving strikes that punish clustered foes." },
    { name: "Hooked War Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments.", fightingStyle: "Hook, yank, and hew; shield killers", attackSpeed: 4, damage: 8.5, armorPen: "High", quality: "Standard", priceCp: 2000, priceDisplay: "1g", descriptionFull: "Hooked War Axe. Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments. Trusted from Borderlands, it proves dependable steel sized for large engagements. Favoured for hook, yank, and hew; shield killers." },
    { name: "Hooked War Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments.", fightingStyle: "Hook, yank, and hew; shield killers", attackSpeed: 4, damage: 8.5, armorPen: "High", quality: "Fine", priceCp: 2900, priceDisplay: "1g 9si", descriptionFull: "Fine Hooked War Axe. Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for hook, yank, and hew; shield killers." },
    { name: "Hooked War Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments.", fightingStyle: "Hook, yank, and hew; shield killers", attackSpeed: 4, damage: 8.5, armorPen: "High", quality: "Masterwork", priceCp: 4695, priceDisplay: "2g 6si 95cp", descriptionFull: "Masterwork Hooked War Axe. Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for hook, yank, and hew; shield killers." },
    { name: "Bearded Axe", region: "Northern Marches", size: "Medium", hands: 1, reach: "Medium", description: "Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control.", fightingStyle: "Disarms, beard-hooks, sharp chops", attackSpeed: 6, damage: 6.5, armorPen: "Medium", quality: "Standard", priceCp: 945, priceDisplay: "9si 45cp", descriptionFull: "Bearded Axe. Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control. Trusted from Northern Marches, it proves dependable steel sized for medium engagements. Favoured for disarms, beard-hooks, sharp chops." },
    { name: "Bearded Axe", region: "Northern Marches", size: "Medium", hands: 1, reach: "Medium", description: "Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control.", fightingStyle: "Disarms, beard-hooks, sharp chops", attackSpeed: 6, damage: 6.5, armorPen: "Medium", quality: "Fine", priceCp: 1370, priceDisplay: "13si 70cp", descriptionFull: "Fine Bearded Axe. Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for disarms, beard-hooks, sharp chops." },
    { name: "Bearded Axe", region: "Northern Marches", size: "Medium", hands: 1, reach: "Medium", description: "Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control.", fightingStyle: "Disarms, beard-hooks, sharp chops", attackSpeed: 6, damage: 6.5, armorPen: "Medium", quality: "Masterwork", priceCp: 2215, priceDisplay: "1g 2si 15cp", descriptionFull: "Masterwork Bearded Axe. Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for disarms, beard-hooks, sharp chops." },
    { name: "Crescent Battleaxe", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes.", fightingStyle: "Fast cuts against unarmored or padded foes", attackSpeed: 6.8, damage: 5, armorPen: "Medium", quality: "Standard", priceCp: 860, priceDisplay: "8si 60cp", descriptionFull: "Crescent Battleaxe. Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes. Trusted from Eastern Realms, it proves dependable steel sized for medium engagements. Favoured for fast cuts against unarmored or padded foes." },
    { name: "Crescent Battleaxe", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes.", fightingStyle: "Fast cuts against unarmored or padded foes", attackSpeed: 6.8, damage: 5, armorPen: "Medium", quality: "Fine", priceCp: 1245, priceDisplay: "12si 45cp", descriptionFull: "Fine Crescent Battleaxe. Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for fast cuts against unarmored or padded foes." },
    { name: "Crescent Battleaxe", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes.", fightingStyle: "Fast cuts against unarmored or padded foes", attackSpeed: 6.8, damage: 5, armorPen: "Medium", quality: "Masterwork", priceCp: 2020, priceDisplay: "1g 20cp", descriptionFull: "Masterwork Crescent Battleaxe. Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for fast cuts against unarmored or padded foes." },
    { name: "Skeggox Hewing Axe", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Massive bearded axe with thick wedge profile, tarred ash haft, and iron hooping; winters beside hearths before marching to raid walls.", fightingStyle: "Limb-lopping cleaves and shield splits", attackSpeed: 4.4, damage: 8, armorPen: "High", quality: "Standard", priceCp: 2020, priceDisplay: "1g 20cp", descriptionFull: "Skeggox Hewing Axe. Massive bearded axe with thick wedge profile, tarred ash haft, and iron hooping; winters beside hearths before marching to raid walls. Trusted from Northern Marches, it proves dependable steel sized for large engagements. Favoured for limb-lopping cleaves and shield splits." },
    { name: "Skeggox Hewing Axe", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Massive bearded axe with thick wedge profile, tarred ash haft, and iron hooping; winters beside hearths before marching to raid walls.", fightingStyle: "Limb-lopping cleaves and shield splits", attackSpeed: 4.4, damage: 8, armorPen: "High", quality: "Fine", priceCp: 2930, priceDisplay: "1g 9si 30cp", descriptionFull: "Fine Skeggox Hewing Axe. Massive bearded axe with thick wedge profile, tarred ash haft, and iron hooping; winters beside hearths before marching to raid walls. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for limb-lopping cleaves and shield splits." },
    { name: "Skeggox Hewing Axe", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Massive bearded axe with thick wedge profile, tarred ash haft, and iron hooping; winters beside hearths before marching to raid walls.", fightingStyle: "Limb-lopping cleaves and shield splits", attackSpeed: 4.4, damage: 8, armorPen: "High", quality: "Masterwork", priceCp: 4745, priceDisplay: "2g 7si 45cp", descriptionFull: "Masterwork Skeggox Hewing Axe. Massive bearded axe with thick wedge profile, tarred ash haft, and iron hooping; winters beside hearths before marching to raid walls. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for limb-lopping cleaves and shield splits." },
    { name: "Tabargan Twinblade", region: "Southern Steppes", size: "Large", hands: 2, reach: "Long", description: "Steppe twin axe with mirrored crescent blades and counterweighted butt spike; rawhide lashes reinforce the long riding haft.", fightingStyle: "Alternating hooks and horse-felling sweeps", attackSpeed: 4.6, damage: 7.6, armorPen: "High", quality: "Standard", priceCp: 2215, priceDisplay: "1g 2si 15cp", descriptionFull: "Tabargan Twinblade. Steppe twin axe with mirrored crescent blades and counterweighted butt spike; rawhide lashes reinforce the long riding haft. Trusted from Southern Steppes, it proves dependable steel sized for large engagements. Favoured for alternating hooks and horse-felling sweeps." },
    { name: "Tabargan Twinblade", region: "Southern Steppes", size: "Large", hands: 2, reach: "Long", description: "Steppe twin axe with mirrored crescent blades and counterweighted butt spike; rawhide lashes reinforce the long riding haft.", fightingStyle: "Alternating hooks and horse-felling sweeps", attackSpeed: 4.6, damage: 7.6, armorPen: "High", quality: "Fine", priceCp: 3215, priceDisplay: "1g 12si 15cp", descriptionFull: "Fine Tabargan Twinblade. Steppe twin axe with mirrored crescent blades and counterweighted butt spike; rawhide lashes reinforce the long riding haft. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for alternating hooks and horse-felling sweeps." },
    { name: "Tabargan Twinblade", region: "Southern Steppes", size: "Large", hands: 2, reach: "Long", description: "Steppe twin axe with mirrored crescent blades and counterweighted butt spike; rawhide lashes reinforce the long riding haft.", fightingStyle: "Alternating hooks and horse-felling sweeps", attackSpeed: 4.6, damage: 7.6, armorPen: "High", quality: "Masterwork", priceCp: 5210, priceDisplay: "2g 12si 10cp", descriptionFull: "Masterwork Tabargan Twinblade. Steppe twin axe with mirrored crescent blades and counterweighted butt spike; rawhide lashes reinforce the long riding haft. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for alternating hooks and horse-felling sweeps." },
    { name: "Moon Cleaver", region: "Island Clans", size: "Very Large", hands: 2, reach: "Long", description: "Mythic crescent of moonsteel inlaid with pale opal, lacquered haft bound in midnight silk; its arc leaves shimmering trails in dusk battles.", fightingStyle: "Sweeping luminous blows that unnerve ranks", attackSpeed: 4.1, damage: 8.8, armorPen: "Very High", quality: "Standard", priceCp: 3690, priceDisplay: "1g 16si 90cp", descriptionFull: "Moon Cleaver. Mythic crescent of moonsteel inlaid with pale opal, lacquered haft bound in midnight silk; its arc leaves shimmering trails in dusk battles. Trusted from Island Clans, it proves dependable steel sized for very large engagements. Favoured for sweeping luminous blows that unnerve ranks." },
    { name: "Moon Cleaver", region: "Island Clans", size: "Very Large", hands: 2, reach: "Long", description: "Mythic crescent of moonsteel inlaid with pale opal, lacquered haft bound in midnight silk; its arc leaves shimmering trails in dusk battles.", fightingStyle: "Sweeping luminous blows that unnerve ranks", attackSpeed: 4.1, damage: 8.8, armorPen: "Very High", quality: "Fine", priceCp: 5350, priceDisplay: "2g 13si 50cp", descriptionFull: "Fine Moon Cleaver. Mythic crescent of moonsteel inlaid with pale opal, lacquered haft bound in midnight silk; its arc leaves shimmering trails in dusk battles. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for sweeping luminous blows that unnerve ranks." },
    { name: "Moon Cleaver", region: "Island Clans", size: "Very Large", hands: 2, reach: "Long", description: "Mythic crescent of moonsteel inlaid with pale opal, lacquered haft bound in midnight silk; its arc leaves shimmering trails in dusk battles.", fightingStyle: "Sweeping luminous blows that unnerve ranks", attackSpeed: 4.1, damage: 8.8, armorPen: "Very High", quality: "Masterwork", priceCp: 8665, priceDisplay: "4g 6si 65cp", descriptionFull: "Masterwork Moon Cleaver. Mythic crescent of moonsteel inlaid with pale opal, lacquered haft bound in midnight silk; its arc leaves shimmering trails in dusk battles. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for sweeping luminous blows that unnerve ranks." },
  ],
  polearms: [
    { name: "Halberd", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition.", fightingStyle: "Thrust to pin, hook to pull, axe to finish", attackSpeed: 4.5, damage: 8.8, armorPen: "High", quality: "Standard", priceCp: 1850, priceDisplay: "18si 50cp", descriptionFull: "Halberd. Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for thrust to pin, hook to pull, axe to finish." },
    { name: "Halberd", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition.", fightingStyle: "Thrust to pin, hook to pull, axe to finish", attackSpeed: 4.5, damage: 8.8, armorPen: "High", quality: "Fine", priceCp: 2680, priceDisplay: "1g 6si 80cp", descriptionFull: "Fine Halberd. Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for thrust to pin, hook to pull, axe to finish." },
    { name: "Halberd", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition.", fightingStyle: "Thrust to pin, hook to pull, axe to finish", attackSpeed: 4.5, damage: 8.8, armorPen: "High", quality: "Masterwork", priceCp: 4345, priceDisplay: "2g 3si 45cp", descriptionFull: "Masterwork Halberd. Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for thrust to pin, hook to pull, axe to finish." },
    { name: "Guisarme Hook", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Medieval polehook with inward-curving blade, rear spike, and beaked hook for unseating riders; ash shaft shod in iron for leverage.", fightingStyle: "Hook riders, drag shields, finish with thrust", attackSpeed: 4.6, damage: 8, armorPen: "High", quality: "Standard", priceCp: 2080, priceDisplay: "1g 80cp", descriptionFull: "Guisarme Hook. Medieval polehook with inward-curving blade, rear spike, and beaked hook for unseating riders; ash shaft shod in iron for leverage. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for hook riders, drag shields, finish with thrust." },
    { name: "Guisarme Hook", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Medieval polehook with inward-curving blade, rear spike, and beaked hook for unseating riders; ash shaft shod in iron for leverage.", fightingStyle: "Hook riders, drag shields, finish with thrust", attackSpeed: 4.6, damage: 8, armorPen: "High", quality: "Fine", priceCp: 3015, priceDisplay: "1g 10si 15cp", descriptionFull: "Fine Guisarme Hook. Medieval polehook with inward-curving blade, rear spike, and beaked hook for unseating riders; ash shaft shod in iron for leverage. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for hook riders, drag shields, finish with thrust." },
    { name: "Guisarme Hook", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Medieval polehook with inward-curving blade, rear spike, and beaked hook for unseating riders; ash shaft shod in iron for leverage.", fightingStyle: "Hook riders, drag shields, finish with thrust", attackSpeed: 4.6, damage: 8, armorPen: "High", quality: "Masterwork", priceCp: 4890, priceDisplay: "2g 8si 90cp", descriptionFull: "Masterwork Guisarme Hook. Medieval polehook with inward-curving blade, rear spike, and beaked hook for unseating riders; ash shaft shod in iron for leverage. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for hook riders, drag shields, finish with thrust." },
    { name: "Voulge Splitter", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Burgundian poleaxe with wide cleaver blade, reinforcing straps, and spike-tipped butt; heavy enough to split pavises and gate bars.", fightingStyle: "Downward cleaves and braced counter-charges", attackSpeed: 4.4, damage: 8.5, armorPen: "High", quality: "Standard", priceCp: 2035, priceDisplay: "1g 35cp", descriptionFull: "Voulge Splitter. Burgundian poleaxe with wide cleaver blade, reinforcing straps, and spike-tipped butt; heavy enough to split pavises and gate bars. Trusted from Northern Marches, it proves dependable steel sized for large engagements. Favoured for downward cleaves and braced counter-charges." },
    { name: "Voulge Splitter", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Burgundian poleaxe with wide cleaver blade, reinforcing straps, and spike-tipped butt; heavy enough to split pavises and gate bars.", fightingStyle: "Downward cleaves and braced counter-charges", attackSpeed: 4.4, damage: 8.5, armorPen: "High", quality: "Fine", priceCp: 2950, priceDisplay: "1g 9si 50cp", descriptionFull: "Fine Voulge Splitter. Burgundian poleaxe with wide cleaver blade, reinforcing straps, and spike-tipped butt; heavy enough to split pavises and gate bars. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for downward cleaves and braced counter-charges." },
    { name: "Voulge Splitter", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Burgundian poleaxe with wide cleaver blade, reinforcing straps, and spike-tipped butt; heavy enough to split pavises and gate bars.", fightingStyle: "Downward cleaves and braced counter-charges", attackSpeed: 4.4, damage: 8.5, armorPen: "High", quality: "Masterwork", priceCp: 4785, priceDisplay: "2g 7si 85cp", descriptionFull: "Masterwork Voulge Splitter. Burgundian poleaxe with wide cleaver blade, reinforcing straps, and spike-tipped butt; heavy enough to split pavises and gate bars. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for downward cleaves and braced counter-charges." },
    { name: "Glaive", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing.", fightingStyle: "Sweeping cuts and perimeter control", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Standard", priceCp: 1610, priceDisplay: "16si 10cp", descriptionFull: "Glaive. Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for sweeping cuts and perimeter control." },
    { name: "Glaive", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing.", fightingStyle: "Sweeping cuts and perimeter control", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Fine", priceCp: 2335, priceDisplay: "1g 3si 35cp", descriptionFull: "Fine Glaive. Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for sweeping cuts and perimeter control." },
    { name: "Glaive", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing.", fightingStyle: "Sweeping cuts and perimeter control", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 3785, priceDisplay: "1g 17si 85cp", descriptionFull: "Masterwork Glaive. Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for sweeping cuts and perimeter control." },
    { name: "Naginata Guardblade", region: "Island Clans", size: "Large", hands: 2, reach: "Long", description: "Far East guardblade with long, graceful curve, steel shoe, and silk tassel; temple guards whirl it between sweeping cuts and sliding thrusts.", fightingStyle: "Sweeping guard arcs and precision thrusts", attackSpeed: 5.2, damage: 7.5, armorPen: "Medium-High", quality: "Standard", priceCp: 1770, priceDisplay: "17si 70cp", descriptionFull: "Naginata Guardblade. Far East guardblade with long, graceful curve, steel shoe, and silk tassel; temple guards whirl it between sweeping cuts and sliding thrusts. Trusted from Island Clans, it proves dependable steel sized for large engagements. Favoured for sweeping guard arcs and precision thrusts." },
    { name: "Naginata Guardblade", region: "Island Clans", size: "Large", hands: 2, reach: "Long", description: "Far East guardblade with long, graceful curve, steel shoe, and silk tassel; temple guards whirl it between sweeping cuts and sliding thrusts.", fightingStyle: "Sweeping guard arcs and precision thrusts", attackSpeed: 5.2, damage: 7.5, armorPen: "Medium-High", quality: "Fine", priceCp: 2570, priceDisplay: "1g 5si 70cp", descriptionFull: "Fine Naginata Guardblade. Far East guardblade with long, graceful curve, steel shoe, and silk tassel; temple guards whirl it between sweeping cuts and sliding thrusts. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for sweeping guard arcs and precision thrusts." },
    { name: "Naginata Guardblade", region: "Island Clans", size: "Large", hands: 2, reach: "Long", description: "Far East guardblade with long, graceful curve, steel shoe, and silk tassel; temple guards whirl it between sweeping cuts and sliding thrusts.", fightingStyle: "Sweeping guard arcs and precision thrusts", attackSpeed: 5.2, damage: 7.5, armorPen: "Medium-High", quality: "Masterwork", priceCp: 4165, priceDisplay: "2g 1si 65cp", descriptionFull: "Masterwork Naginata Guardblade. Far East guardblade with long, graceful curve, steel shoe, and silk tassel; temple guards whirl it between sweeping cuts and sliding thrusts. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for sweeping guard arcs and precision thrusts." },
    { name: "Partisan Spear", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates.", fightingStyle: "Thrusts, blade parries, rank-fighting stability", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Standard", priceCp: 1805, priceDisplay: "18si 5cp", descriptionFull: "Partisan Spear. Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for thrusts, blade parries, rank-fighting stability." },
    { name: "Partisan Spear", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates.", fightingStyle: "Thrusts, blade parries, rank-fighting stability", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Fine", priceCp: 2615, priceDisplay: "1g 6si 15cp", descriptionFull: "Fine Partisan Spear. Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for thrusts, blade parries, rank-fighting stability." },
    { name: "Partisan Spear", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates.", fightingStyle: "Thrusts, blade parries, rank-fighting stability", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 4240, priceDisplay: "2g 2si 40cp", descriptionFull: "Masterwork Partisan Spear. Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for thrusts, blade parries, rank-fighting stability." },
    { name: "Sarissa Pike", region: "Southern Kingdoms", size: "Very Large", hands: 2, reach: "Very Long", description: "Phalanx pike of layered ash up to six meters, bronze shoe and counterweight; requires drilled ranks to wield its unstoppable reach.", fightingStyle: "Massed rank thrusts and shield-wall control", attackSpeed: 4, damage: 7.2, armorPen: "High", quality: "Standard", priceCp: 2455, priceDisplay: "1g 4si 55cp", descriptionFull: "Sarissa Pike. Phalanx pike of layered ash up to six meters, bronze shoe and counterweight; requires drilled ranks to wield its unstoppable reach. Trusted from Southern Kingdoms, it proves dependable steel sized for very large engagements. Favoured for massed rank thrusts and shield-wall control." },
    { name: "Sarissa Pike", region: "Southern Kingdoms", size: "Very Large", hands: 2, reach: "Very Long", description: "Phalanx pike of layered ash up to six meters, bronze shoe and counterweight; requires drilled ranks to wield its unstoppable reach.", fightingStyle: "Massed rank thrusts and shield-wall control", attackSpeed: 4, damage: 7.2, armorPen: "High", quality: "Fine", priceCp: 3560, priceDisplay: "1g 15si 60cp", descriptionFull: "Fine Sarissa Pike. Phalanx pike of layered ash up to six meters, bronze shoe and counterweight; requires drilled ranks to wield its unstoppable reach. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for massed rank thrusts and shield-wall control." },
    { name: "Sarissa Pike", region: "Southern Kingdoms", size: "Very Large", hands: 2, reach: "Very Long", description: "Phalanx pike of layered ash up to six meters, bronze shoe and counterweight; requires drilled ranks to wield its unstoppable reach.", fightingStyle: "Massed rank thrusts and shield-wall control", attackSpeed: 4, damage: 7.2, armorPen: "High", quality: "Masterwork", priceCp: 5770, priceDisplay: "2g 17si 70cp", descriptionFull: "Masterwork Sarissa Pike. Phalanx pike of layered ash up to six meters, bronze shoe and counterweight; requires drilled ranks to wield its unstoppable reach. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for massed rank thrusts and shield-wall control." },
    { name: "Beak-Hammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate.", fightingStyle: "Armor-breaking smashes and beak thrusts", attackSpeed: 4, damage: 9, armorPen: "Very High", quality: "Standard", priceCp: 2035, priceDisplay: "1g 35cp", descriptionFull: "Beak-Hammer. Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate. Trusted from Borderlands, it proves dependable steel sized for large engagements. Favoured for armor-breaking smashes and beak thrusts." },
    { name: "Beak-Hammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate.", fightingStyle: "Armor-breaking smashes and beak thrusts", attackSpeed: 4, damage: 9, armorPen: "Very High", quality: "Fine", priceCp: 2950, priceDisplay: "1g 9si 50cp", descriptionFull: "Fine Beak-Hammer. Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for armor-breaking smashes and beak thrusts." },
    { name: "Beak-Hammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate.", fightingStyle: "Armor-breaking smashes and beak thrusts", attackSpeed: 4, damage: 9, armorPen: "Very High", quality: "Masterwork", priceCp: 4785, priceDisplay: "2g 7si 85cp", descriptionFull: "Masterwork Beak-Hammer. Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for armor-breaking smashes and beak thrusts." },
    { name: "Lucent Warhammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor.", fightingStyle: "Brutal impacts; spikes for penetrating follow-through", attackSpeed: 3.8, damage: 9.5, armorPen: "Very High", quality: "Standard", priceCp: 2040, priceDisplay: "1g 40cp", descriptionFull: "Lucent Warhammer. Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor. Trusted from Borderlands, it proves dependable steel sized for large engagements. Favoured for brutal impacts; spikes for penetrating follow-through." },
    { name: "Lucent Warhammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor.", fightingStyle: "Brutal impacts; spikes for penetrating follow-through", attackSpeed: 3.8, damage: 9.5, armorPen: "Very High", quality: "Fine", priceCp: 2955, priceDisplay: "1g 9si 55cp", descriptionFull: "Fine Lucent Warhammer. Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for brutal impacts; spikes for penetrating follow-through." },
    { name: "Lucent Warhammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor.", fightingStyle: "Brutal impacts; spikes for penetrating follow-through", attackSpeed: 3.8, damage: 9.5, armorPen: "Very High", quality: "Masterwork", priceCp: 4790, priceDisplay: "2g 7si 90cp", descriptionFull: "Masterwork Lucent Warhammer. Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for brutal impacts; spikes for penetrating follow-through." },
    { name: "Winding Spear", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting.", fightingStyle: "Line formations, thrust fencing, choke-ups", attackSpeed: 5.8, damage: 7, armorPen: "High", quality: "Standard", priceCp: 1490, priceDisplay: "14si 90cp", descriptionFull: "Winding Spear. Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting. Trusted from Island Clans, it proves dependable steel sized for medium engagements. Favoured for line formations, thrust fencing, choke-ups." },
    { name: "Winding Spear", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting.", fightingStyle: "Line formations, thrust fencing, choke-ups", attackSpeed: 5.8, damage: 7, armorPen: "High", quality: "Fine", priceCp: 2160, priceDisplay: "1g 1si 60cp", descriptionFull: "Fine Winding Spear. Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for line formations, thrust fencing, choke-ups." },
    { name: "Winding Spear", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting.", fightingStyle: "Line formations, thrust fencing, choke-ups", attackSpeed: 5.8, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 3505, priceDisplay: "1g 15si 5cp", descriptionFull: "Masterwork Winding Spear. Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for line formations, thrust fencing, choke-ups." },
    { name: "River-Blade", region: "Island Clans", size: "Large", hands: 2, reach: "Long", description: "Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water.", fightingStyle: "Sweeping anti-cavalry slashes and flank cuts", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Standard", priceCp: 1610, priceDisplay: "16si 10cp", descriptionFull: "River-Blade. Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water. Trusted from Island Clans, it proves dependable steel sized for large engagements. Favoured for sweeping anti-cavalry slashes and flank cuts." },
    { name: "River-Blade", region: "Island Clans", size: "Large", hands: 2, reach: "Long", description: "Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water.", fightingStyle: "Sweeping anti-cavalry slashes and flank cuts", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Fine", priceCp: 2335, priceDisplay: "1g 3si 35cp", descriptionFull: "Fine River-Blade. Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for sweeping anti-cavalry slashes and flank cuts." },
    { name: "River-Blade", region: "Island Clans", size: "Large", hands: 2, reach: "Long", description: "Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water.", fightingStyle: "Sweeping anti-cavalry slashes and flank cuts", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 3785, priceDisplay: "1g 17si 85cp", descriptionFull: "Masterwork River-Blade. Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for sweeping anti-cavalry slashes and flank cuts." },
    { name: "Trident Fork", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Medium", description: "Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers.", fightingStyle: "Thrust, catch, and control; excels near shorelines", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Standard", priceCp: 1255, priceDisplay: "12si 55cp", descriptionFull: "Trident Fork. Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers. Trusted from Southern Steppes, it proves dependable steel sized for medium engagements. Favoured for thrust, catch, and control; excels near shorelines." },
    { name: "Trident Fork", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Medium", description: "Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers.", fightingStyle: "Thrust, catch, and control; excels near shorelines", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Fine", priceCp: 1820, priceDisplay: "18si 20cp", descriptionFull: "Fine Trident Fork. Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for thrust, catch, and control; excels near shorelines." },
    { name: "Trident Fork", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Medium", description: "Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers.", fightingStyle: "Thrust, catch, and control; excels near shorelines", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 2950, priceDisplay: "1g 9si 50cp", descriptionFull: "Masterwork Trident Fork. Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for thrust, catch, and control; excels near shorelines." },
    { name: "Quarterdock Trident", region: "Southern Kingdoms", size: "Medium", hands: 2, reach: "Medium/Long", description: "Harbor-issue trident with barbed prongs, rope loops for retention, and saltproof lacquer; doubles as pike or tool for corralling smugglers.", fightingStyle: "Pressing thrusts and entangling pushes on piers", attackSpeed: 5, damage: 6.8, armorPen: "Medium-High", quality: "Standard", priceCp: 1265, priceDisplay: "12si 65cp", descriptionFull: "Quarterdock Trident. Harbor-issue trident with barbed prongs, rope loops for retention, and saltproof lacquer; doubles as pike or tool for corralling smugglers. Trusted from Southern Kingdoms, it proves dependable steel sized for medium engagements. Favoured for pressing thrusts and entangling pushes on piers." },
    { name: "Quarterdock Trident", region: "Southern Kingdoms", size: "Medium", hands: 2, reach: "Medium/Long", description: "Harbor-issue trident with barbed prongs, rope loops for retention, and saltproof lacquer; doubles as pike or tool for corralling smugglers.", fightingStyle: "Pressing thrusts and entangling pushes on piers", attackSpeed: 5, damage: 6.8, armorPen: "Medium-High", quality: "Fine", priceCp: 1835, priceDisplay: "18si 35cp", descriptionFull: "Fine Quarterdock Trident. Harbor-issue trident with barbed prongs, rope loops for retention, and saltproof lacquer; doubles as pike or tool for corralling smugglers. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for pressing thrusts and entangling pushes on piers." },
    { name: "Quarterdock Trident", region: "Southern Kingdoms", size: "Medium", hands: 2, reach: "Medium/Long", description: "Harbor-issue trident with barbed prongs, rope loops for retention, and saltproof lacquer; doubles as pike or tool for corralling smugglers.", fightingStyle: "Pressing thrusts and entangling pushes on piers", attackSpeed: 5, damage: 6.8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 2970, priceDisplay: "1g 9si 70cp", descriptionFull: "Masterwork Quarterdock Trident. Harbor-issue trident with barbed prongs, rope loops for retention, and saltproof lacquer; doubles as pike or tool for corralling smugglers. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for pressing thrusts and entangling pushes on piers." },
    { name: "Axe-Knife Polearm", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe.", fightingStyle: "Close-quarters chopping and thrusting", attackSpeed: 5.5, damage: 6.8, armorPen: "Medium-High", quality: "Standard", priceCp: 920, priceDisplay: "9si 20cp", descriptionFull: "Axe-Knife Polearm. Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe. Trusted from Southern Steppes, it proves dependable steel sized for medium engagements. Favoured for close-quarters chopping and thrusting." },
    { name: "Axe-Knife Polearm", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe.", fightingStyle: "Close-quarters chopping and thrusting", attackSpeed: 5.5, damage: 6.8, armorPen: "Medium-High", quality: "Fine", priceCp: 1335, priceDisplay: "13si 35cp", descriptionFull: "Fine Axe-Knife Polearm. Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for close-quarters chopping and thrusting." },
    { name: "Axe-Knife Polearm", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe.", fightingStyle: "Close-quarters chopping and thrusting", attackSpeed: 5.5, damage: 6.8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 2165, priceDisplay: "1g 1si 65cp", descriptionFull: "Masterwork Axe-Knife Polearm. Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for close-quarters chopping and thrusting." },
  ],
  ranged: [
    { name: "Greatbow", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Tall self-bow of yew or elm; horn nocks and linen string; goose-fletched heavy arrows in ash quiver; oiled leather grip and bracer.", fightingStyle: "Massed volleys and long-range interdiction", attackSpeed: 4.5, damage: 7, armorPen: "High", quality: "Standard", priceCp: 2975, priceDisplay: "1g 9si 75cp", descriptionFull: "Greatbow. Tall self-bow of yew or elm; horn nocks and linen string; goose-fletched heavy arrows in ash quiver; oiled leather grip and bracer. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for massed volleys and long-range interdiction." },
    { name: "Greatbow", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Tall self-bow of yew or elm; horn nocks and linen string; goose-fletched heavy arrows in ash quiver; oiled leather grip and bracer.", fightingStyle: "Massed volleys and long-range interdiction", attackSpeed: 4.5, damage: 7, armorPen: "High", quality: "Fine", priceCp: 4310, priceDisplay: "2g 3si 10cp", descriptionFull: "Fine Greatbow. Tall self-bow of yew or elm; horn nocks and linen string; goose-fletched heavy arrows in ash quiver; oiled leather grip and bracer. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for massed volleys and long-range interdiction." },
    { name: "Greatbow", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Tall self-bow of yew or elm; horn nocks and linen string; goose-fletched heavy arrows in ash quiver; oiled leather grip and bracer.", fightingStyle: "Massed volleys and long-range interdiction", attackSpeed: 4.5, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 6985, priceDisplay: "3g 9si 85cp", descriptionFull: "Masterwork Greatbow. Tall self-bow of yew or elm; horn nocks and linen string; goose-fletched heavy arrows in ash quiver; oiled leather grip and bracer. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for massed volleys and long-range interdiction." },
    { name: "Composite Recurve", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium/Long", description: "Reflex-recurve bow of wood, horn, and sinew glued and wrapped under birch bark; short and powerful for saddle archery; rawhide case against rain.", fightingStyle: "Fast shooting on the move; skirmish dominance", attackSpeed: 5, damage: 6.8, armorPen: "High", quality: "Standard", priceCp: 1620, priceDisplay: "16si 20cp", descriptionFull: "Composite Recurve. Reflex-recurve bow of wood, horn, and sinew glued and wrapped under birch bark; short and powerful for saddle archery; rawhide case against rain. Trusted from Southern Steppes, it proves dependable steel sized for medium engagements. Favoured for fast shooting on the move; skirmish dominance." },
    { name: "Composite Recurve", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium/Long", description: "Reflex-recurve bow of wood, horn, and sinew glued and wrapped under birch bark; short and powerful for saddle archery; rawhide case against rain.", fightingStyle: "Fast shooting on the move; skirmish dominance", attackSpeed: 5, damage: 6.8, armorPen: "High", quality: "Fine", priceCp: 2350, priceDisplay: "1g 3si 50cp", descriptionFull: "Fine Composite Recurve. Reflex-recurve bow of wood, horn, and sinew glued and wrapped under birch bark; short and powerful for saddle archery; rawhide case against rain. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for fast shooting on the move; skirmish dominance." },
    { name: "Composite Recurve", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium/Long", description: "Reflex-recurve bow of wood, horn, and sinew glued and wrapped under birch bark; short and powerful for saddle archery; rawhide case against rain.", fightingStyle: "Fast shooting on the move; skirmish dominance", attackSpeed: 5, damage: 6.8, armorPen: "High", quality: "Masterwork", priceCp: 3805, priceDisplay: "1g 18si 5cp", descriptionFull: "Masterwork Composite Recurve. Reflex-recurve bow of wood, horn, and sinew glued and wrapped under birch bark; short and powerful for saddle archery; rawhide case against rain. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for fast shooting on the move; skirmish dominance." },
    { name: "Asymmetrical Longbow", region: "Island Clans", size: "Large", hands: 2, reach: "Very Long", description: "Long, uneven limbs of laminated hardwood; silk bowstring; lacquered grip; practiced draw from standing or kneel with ritual poise.", fightingStyle: "Deliberate long-range marksmanship and volley fire", attackSpeed: 4.2, damage: 6.5, armorPen: "High", quality: "Standard", priceCp: 2965, priceDisplay: "1g 9si 65cp", descriptionFull: "Asymmetrical Longbow. Long, uneven limbs of laminated hardwood; silk bowstring; lacquered grip; practiced draw from standing or kneel with ritual poise. Trusted from Island Clans, it proves dependable steel sized for large engagements. Favoured for deliberate long-range marksmanship and volley fire." },
    { name: "Asymmetrical Longbow", region: "Island Clans", size: "Large", hands: 2, reach: "Very Long", description: "Long, uneven limbs of laminated hardwood; silk bowstring; lacquered grip; practiced draw from standing or kneel with ritual poise.", fightingStyle: "Deliberate long-range marksmanship and volley fire", attackSpeed: 4.2, damage: 6.5, armorPen: "High", quality: "Fine", priceCp: 4300, priceDisplay: "2g 3si", descriptionFull: "Fine Asymmetrical Longbow. Long, uneven limbs of laminated hardwood; silk bowstring; lacquered grip; practiced draw from standing or kneel with ritual poise. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for deliberate long-range marksmanship and volley fire." },
    { name: "Asymmetrical Longbow", region: "Island Clans", size: "Large", hands: 2, reach: "Very Long", description: "Long, uneven limbs of laminated hardwood; silk bowstring; lacquered grip; practiced draw from standing or kneel with ritual poise.", fightingStyle: "Deliberate long-range marksmanship and volley fire", attackSpeed: 4.2, damage: 6.5, armorPen: "High", quality: "Masterwork", priceCp: 6970, priceDisplay: "3g 9si 70cp", descriptionFull: "Masterwork Asymmetrical Longbow. Long, uneven limbs of laminated hardwood; silk bowstring; lacquered grip; practiced draw from standing or kneel with ritual poise. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for deliberate long-range marksmanship and volley fire." },
    { name: "Heavy Crossbow", region: "High Kingdoms", size: "Large", hands: 2, reach: "Medium", description: "Steel prod on a stout wooden tiller; windlass or cranequin draw; quarrels with bodkin heads; trigger and stirrup in black iron.", fightingStyle: "Devastating bolts; slow to reload", attackSpeed: 1, damage: 9, armorPen: "Very High", quality: "Standard", priceCp: 2260, priceDisplay: "1g 2si 60cp", descriptionFull: "Heavy Crossbow. Steel prod on a stout wooden tiller; windlass or cranequin draw; quarrels with bodkin heads; trigger and stirrup in black iron. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for devastating bolts; slow to reload." },
    { name: "Heavy Crossbow", region: "High Kingdoms", size: "Large", hands: 2, reach: "Medium", description: "Steel prod on a stout wooden tiller; windlass or cranequin draw; quarrels with bodkin heads; trigger and stirrup in black iron.", fightingStyle: "Devastating bolts; slow to reload", attackSpeed: 1, damage: 9, armorPen: "Very High", quality: "Fine", priceCp: 3280, priceDisplay: "1g 12si 80cp", descriptionFull: "Fine Heavy Crossbow. Steel prod on a stout wooden tiller; windlass or cranequin draw; quarrels with bodkin heads; trigger and stirrup in black iron. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for devastating bolts; slow to reload." },
    { name: "Heavy Crossbow", region: "High Kingdoms", size: "Large", hands: 2, reach: "Medium", description: "Steel prod on a stout wooden tiller; windlass or cranequin draw; quarrels with bodkin heads; trigger and stirrup in black iron.", fightingStyle: "Devastating bolts; slow to reload", attackSpeed: 1, damage: 9, armorPen: "Very High", quality: "Masterwork", priceCp: 5315, priceDisplay: "2g 13si 15cp", descriptionFull: "Masterwork Heavy Crossbow. Steel prod on a stout wooden tiller; windlass or cranequin draw; quarrels with bodkin heads; trigger and stirrup in black iron. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for devastating bolts; slow to reload." },
    { name: "Hand Crossbow", region: "High Kingdoms", size: "Small", hands: 1, reach: "Short", description: "Compact wooden tiller with light steel prod; simple spanning lever; short bolts in a belt case; concealable beneath cloaks.", fightingStyle: "Ambush tool; quick shots at close range", attackSpeed: 2, damage: 4.5, armorPen: "Medium", quality: "Standard", priceCp: 550, priceDisplay: "5si 50cp", descriptionFull: "Hand Crossbow. Compact wooden tiller with light steel prod; simple spanning lever; short bolts in a belt case; concealable beneath cloaks. Trusted from High Kingdoms, it proves dependable steel sized for small engagements. Favoured for ambush tool; quick shots at close range." },
    { name: "Hand Crossbow", region: "High Kingdoms", size: "Small", hands: 1, reach: "Short", description: "Compact wooden tiller with light steel prod; simple spanning lever; short bolts in a belt case; concealable beneath cloaks.", fightingStyle: "Ambush tool; quick shots at close range", attackSpeed: 2, damage: 4.5, armorPen: "Medium", quality: "Fine", priceCp: 800, priceDisplay: "8si", descriptionFull: "Fine Hand Crossbow. Compact wooden tiller with light steel prod; simple spanning lever; short bolts in a belt case; concealable beneath cloaks. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for ambush tool; quick shots at close range." },
    { name: "Hand Crossbow", region: "High Kingdoms", size: "Small", hands: 1, reach: "Short", description: "Compact wooden tiller with light steel prod; simple spanning lever; short bolts in a belt case; concealable beneath cloaks.", fightingStyle: "Ambush tool; quick shots at close range", attackSpeed: 2, damage: 4.5, armorPen: "Medium", quality: "Masterwork", priceCp: 1295, priceDisplay: "12si 95cp", descriptionFull: "Masterwork Hand Crossbow. Compact wooden tiller with light steel prod; simple spanning lever; short bolts in a belt case; concealable beneath cloaks. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for ambush tool; quick shots at close range." },
    { name: "Repeating Crossbow", region: "Eastern Realms", size: "Medium", hands: 2, reach: "Short/Medium", description: "Magazine-fed lever crossbow of lacquered wood and iron; slim bolts drop from a top box; trades power for relentless rate.", fightingStyle: "Volume over punch; suppressive shooting", attackSpeed: 6, damage: 3, armorPen: "Low-Medium", quality: "Standard", priceCp: 915, priceDisplay: "9si 15cp", descriptionFull: "Repeating Crossbow. Magazine-fed lever crossbow of lacquered wood and iron; slim bolts drop from a top box; trades power for relentless rate. Trusted from Eastern Realms, it proves dependable steel sized for medium engagements. Favoured for volume over punch; suppressive shooting." },
    { name: "Repeating Crossbow", region: "Eastern Realms", size: "Medium", hands: 2, reach: "Short/Medium", description: "Magazine-fed lever crossbow of lacquered wood and iron; slim bolts drop from a top box; trades power for relentless rate.", fightingStyle: "Volume over punch; suppressive shooting", attackSpeed: 6, damage: 3, armorPen: "Low-Medium", quality: "Fine", priceCp: 1325, priceDisplay: "13si 25cp", descriptionFull: "Fine Repeating Crossbow. Magazine-fed lever crossbow of lacquered wood and iron; slim bolts drop from a top box; trades power for relentless rate. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for volume over punch; suppressive shooting." },
    { name: "Repeating Crossbow", region: "Eastern Realms", size: "Medium", hands: 2, reach: "Short/Medium", description: "Magazine-fed lever crossbow of lacquered wood and iron; slim bolts drop from a top box; trades power for relentless rate.", fightingStyle: "Volume over punch; suppressive shooting", attackSpeed: 6, damage: 3, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 2150, priceDisplay: "1g 1si 50cp", descriptionFull: "Masterwork Repeating Crossbow. Magazine-fed lever crossbow of lacquered wood and iron; slim bolts drop from a top box; trades power for relentless rate. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for volume over punch; suppressive shooting." },
  ],
  chains: [
    { name: "Chain Morning Star", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks.", fightingStyle: "Circular momentum strikes; wraps and sudden snaps", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Standard", priceCp: 1030, priceDisplay: "10si 30cp", descriptionFull: "Chain Morning Star. Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks. Trusted from High Kingdoms, it proves dependable steel sized for medium engagements. Favoured for circular momentum strikes; wraps and sudden snaps." },
    { name: "Chain Morning Star", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks.", fightingStyle: "Circular momentum strikes; wraps and sudden snaps", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Fine", priceCp: 1490, priceDisplay: "14si 90cp", descriptionFull: "Fine Chain Morning Star. Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for circular momentum strikes; wraps and sudden snaps." },
    { name: "Chain Morning Star", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks.", fightingStyle: "Circular momentum strikes; wraps and sudden snaps", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Masterwork", priceCp: 2420, priceDisplay: "1g 4si 20cp", descriptionFull: "Masterwork Chain Morning Star. Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for circular momentum strikes; wraps and sudden snaps." },
    { name: "Meteor Chain", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Long", description: "Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify.", fightingStyle: "Wide swings, entanglement tactics, punishing impacts", attackSpeed: 4, damage: 8, armorPen: "Medium-High", quality: "Standard", priceCp: 1225, priceDisplay: "12si 25cp", descriptionFull: "Meteor Chain. Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify. Trusted from Southern Steppes, it proves dependable steel sized for medium engagements. Favoured for wide swings, entanglement tactics, punishing impacts." },
    { name: "Meteor Chain", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Long", description: "Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify.", fightingStyle: "Wide swings, entanglement tactics, punishing impacts", attackSpeed: 4, damage: 8, armorPen: "Medium-High", quality: "Fine", priceCp: 1780, priceDisplay: "17si 80cp", descriptionFull: "Fine Meteor Chain. Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for wide swings, entanglement tactics, punishing impacts." },
    { name: "Meteor Chain", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Long", description: "Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify.", fightingStyle: "Wide swings, entanglement tactics, punishing impacts", attackSpeed: 4, damage: 8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 2885, priceDisplay: "1g 8si 85cp", descriptionFull: "Masterwork Meteor Chain. Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for wide swings, entanglement tactics, punishing impacts." },
    { name: "Duo Chain Flail", region: "High Villages", size: "Medium", hands: 2, reach: "Medium", description: "Peasant militia haft with twin chained iron weights, oak grip bound in rawhide, and ring loops for quick leverage; simple to make, vicious in crush.", fightingStyle: "Alternating chain sweeps and shield tangles", attackSpeed: 5, damage: 7, armorPen: "Medium", quality: "Standard", priceCp: 1075, priceDisplay: "10si 75cp", descriptionFull: "Duo Chain Flail. Peasant militia haft with twin chained iron weights, oak grip bound in rawhide, and ring loops for quick leverage; simple to make, vicious in crush. Trusted from High Villages, it proves dependable steel sized for medium engagements. Favoured for alternating chain sweeps and shield tangles." },
    { name: "Duo Chain Flail", region: "High Villages", size: "Medium", hands: 2, reach: "Medium", description: "Peasant militia haft with twin chained iron weights, oak grip bound in rawhide, and ring loops for quick leverage; simple to make, vicious in crush.", fightingStyle: "Alternating chain sweeps and shield tangles", attackSpeed: 5, damage: 7, armorPen: "Medium", quality: "Fine", priceCp: 1560, priceDisplay: "15si 60cp", descriptionFull: "Fine Duo Chain Flail. Peasant militia haft with twin chained iron weights, oak grip bound in rawhide, and ring loops for quick leverage; simple to make, vicious in crush. Fine finishing from High Villages dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for alternating chain sweeps and shield tangles." },
    { name: "Duo Chain Flail", region: "High Villages", size: "Medium", hands: 2, reach: "Medium", description: "Peasant militia haft with twin chained iron weights, oak grip bound in rawhide, and ring loops for quick leverage; simple to make, vicious in crush.", fightingStyle: "Alternating chain sweeps and shield tangles", attackSpeed: 5, damage: 7, armorPen: "Medium", quality: "Masterwork", priceCp: 2530, priceDisplay: "1g 5si 30cp", descriptionFull: "Masterwork Duo Chain Flail. Peasant militia haft with twin chained iron weights, oak grip bound in rawhide, and ring loops for quick leverage; simple to make, vicious in crush. Masterwork artisans from High Villages layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for alternating chain sweeps and shield tangles." },
  ],
  whips: [
    { name: "Punisher Lash", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve.", fightingStyle: "Rapid lacerations, disarms, stance disruption", attackSpeed: 9, damage: 3.5, armorPen: "Low", quality: "Standard", priceCp: 150, priceDisplay: "1si 50cp", descriptionFull: "Punisher Lash. Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve. Trusted from Eastern Realms, it proves dependable steel sized for small engagements. Favoured for rapid lacerations, disarms, stance disruption." },
    { name: "Punisher Lash", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve.", fightingStyle: "Rapid lacerations, disarms, stance disruption", attackSpeed: 9, damage: 3.5, armorPen: "Low", quality: "Fine", priceCp: 215, priceDisplay: "2si 15cp", descriptionFull: "Fine Punisher Lash. Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for rapid lacerations, disarms, stance disruption." },
    { name: "Punisher Lash", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve.", fightingStyle: "Rapid lacerations, disarms, stance disruption", attackSpeed: 9, damage: 3.5, armorPen: "Low", quality: "Masterwork", priceCp: 350, priceDisplay: "3si 50cp", descriptionFull: "Masterwork Punisher Lash. Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for rapid lacerations, disarms, stance disruption." },
    { name: "Thornvine Lash", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Jungle-plaited whip woven with hardened thorns and resin, bone-handled and oil-treated to keep its bite; wraps foes with snagging barbs.", fightingStyle: "Snaring lashes and bleeding wraps", attackSpeed: 8.5, damage: 3.8, armorPen: "Low-Medium", quality: "Standard", priceCp: 250, priceDisplay: "2si 50cp", descriptionFull: "Thornvine Lash. Jungle-plaited whip woven with hardened thorns and resin, bone-handled and oil-treated to keep its bite; wraps foes with snagging barbs. Trusted from Southern Kingdoms, it proves dependable steel sized for medium engagements. Favoured for snaring lashes and bleeding wraps." },
    { name: "Thornvine Lash", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Jungle-plaited whip woven with hardened thorns and resin, bone-handled and oil-treated to keep its bite; wraps foes with snagging barbs.", fightingStyle: "Snaring lashes and bleeding wraps", attackSpeed: 8.5, damage: 3.8, armorPen: "Low-Medium", quality: "Fine", priceCp: 365, priceDisplay: "3si 65cp", descriptionFull: "Fine Thornvine Lash. Jungle-plaited whip woven with hardened thorns and resin, bone-handled and oil-treated to keep its bite; wraps foes with snagging barbs. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for snaring lashes and bleeding wraps." },
    { name: "Thornvine Lash", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Jungle-plaited whip woven with hardened thorns and resin, bone-handled and oil-treated to keep its bite; wraps foes with snagging barbs.", fightingStyle: "Snaring lashes and bleeding wraps", attackSpeed: 8.5, damage: 3.8, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 590, priceDisplay: "5si 90cp", descriptionFull: "Masterwork Thornvine Lash. Jungle-plaited whip woven with hardened thorns and resin, bone-handled and oil-treated to keep its bite; wraps foes with snagging barbs. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for snaring lashes and bleeding wraps." },
    { name: "Scorpion Whip", region: "Southern Kingdoms", size: "Medium", hands: 2, reach: "Medium", description: "Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear.", fightingStyle: "Wraps, tears, and control; risky in close press", attackSpeed: 6.5, damage: 5.5, armorPen: "Medium", quality: "Standard", priceCp: 295, priceDisplay: "2si 95cp", descriptionFull: "Scorpion Whip. Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear. Trusted from Southern Kingdoms, it proves dependable steel sized for medium engagements. Favoured for wraps, tears, and control; risky in close press." },
    { name: "Scorpion Whip", region: "Southern Kingdoms", size: "Medium", hands: 2, reach: "Medium", description: "Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear.", fightingStyle: "Wraps, tears, and control; risky in close press", attackSpeed: 6.5, damage: 5.5, armorPen: "Medium", quality: "Fine", priceCp: 425, priceDisplay: "4si 25cp", descriptionFull: "Fine Scorpion Whip. Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for wraps, tears, and control; risky in close press." },
    { name: "Scorpion Whip", region: "Southern Kingdoms", size: "Medium", hands: 2, reach: "Medium", description: "Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear.", fightingStyle: "Wraps, tears, and control; risky in close press", attackSpeed: 6.5, damage: 5.5, armorPen: "Medium", quality: "Masterwork", priceCp: 690, priceDisplay: "6si 90cp", descriptionFull: "Masterwork Scorpion Whip. Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for wraps, tears, and control; risky in close press." },
  ],
  staves: [
    { name: "Quarterstaff", region: "High Villages", size: "Large", hands: 2, reach: "Long", description: "Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards.", fightingStyle: "Thrusts, strikes, parries; excellent reach discipline", attackSpeed: 7, damage: 4.5, armorPen: "Low-Medium", quality: "Standard", priceCp: 260, priceDisplay: "2si 60cp", descriptionFull: "Quarterstaff. Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards. Trusted from High Villages, it proves dependable steel sized for large engagements. Favoured for thrusts, strikes, parries; excellent reach discipline." },
    { name: "Quarterstaff", region: "High Villages", size: "Large", hands: 2, reach: "Long", description: "Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards.", fightingStyle: "Thrusts, strikes, parries; excellent reach discipline", attackSpeed: 7, damage: 4.5, armorPen: "Low-Medium", quality: "Fine", priceCp: 375, priceDisplay: "3si 75cp", descriptionFull: "Fine Quarterstaff. Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards. Fine finishing from High Villages dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for thrusts, strikes, parries; excellent reach discipline." },
    { name: "Quarterstaff", region: "High Villages", size: "Large", hands: 2, reach: "Long", description: "Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards.", fightingStyle: "Thrusts, strikes, parries; excellent reach discipline", attackSpeed: 7, damage: 4.5, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 605, priceDisplay: "6si 5cp", descriptionFull: "Masterwork Quarterstaff. Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards. Masterwork artisans from High Villages layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for thrusts, strikes, parries; excellent reach discipline." },
    { name: "Ironwood Staff", region: "Eastern Realms", size: "Large", hands: 2, reach: "Long", description: "Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters.", fightingStyle: "Heavy blocks and sweeping counters", attackSpeed: 7.2, damage: 4.5, armorPen: "Low-Medium", quality: "Standard", priceCp: 260, priceDisplay: "2si 60cp", descriptionFull: "Ironwood Staff. Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters. Trusted from Eastern Realms, it proves dependable steel sized for large engagements. Favoured for heavy blocks and sweeping counters." },
    { name: "Ironwood Staff", region: "Eastern Realms", size: "Large", hands: 2, reach: "Long", description: "Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters.", fightingStyle: "Heavy blocks and sweeping counters", attackSpeed: 7.2, damage: 4.5, armorPen: "Low-Medium", quality: "Fine", priceCp: 375, priceDisplay: "3si 75cp", descriptionFull: "Fine Ironwood Staff. Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for heavy blocks and sweeping counters." },
    { name: "Ironwood Staff", region: "Eastern Realms", size: "Large", hands: 2, reach: "Long", description: "Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters.", fightingStyle: "Heavy blocks and sweeping counters", attackSpeed: 7.2, damage: 4.5, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 610, priceDisplay: "6si 10cp", descriptionFull: "Masterwork Ironwood Staff. Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for heavy blocks and sweeping counters." },
    { name: "Short Staff", region: "Island Clans", size: "Medium", hands: 2, reach: "Medium", description: "Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys.", fightingStyle: "Quick transitions between strikes and traps", attackSpeed: 7.5, damage: 4, armorPen: "Low-Medium", quality: "Standard", priceCp: 175, priceDisplay: "1si 75cp", descriptionFull: "Short Staff. Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys. Trusted from Island Clans, it proves dependable steel sized for medium engagements. Favoured for quick transitions between strikes and traps." },
    { name: "Short Staff", region: "Island Clans", size: "Medium", hands: 2, reach: "Medium", description: "Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys.", fightingStyle: "Quick transitions between strikes and traps", attackSpeed: 7.5, damage: 4, armorPen: "Low-Medium", quality: "Fine", priceCp: 255, priceDisplay: "2si 55cp", descriptionFull: "Fine Short Staff. Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for quick transitions between strikes and traps." },
    { name: "Short Staff", region: "Island Clans", size: "Medium", hands: 2, reach: "Medium", description: "Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys.", fightingStyle: "Quick transitions between strikes and traps", attackSpeed: 7.5, damage: 4, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 415, priceDisplay: "4si 15cp", descriptionFull: "Masterwork Short Staff. Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for quick transitions between strikes and traps." },
    { name: "Reed Quarterstaff", region: "Southern Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Riverlands staff of river reed cores sleeved in hardwood, iron ferrules and waxed wraps keeping it light yet lively for boat decks.", fightingStyle: "Flowing deflections with darting strikes", attackSpeed: 7.4, damage: 4.3, armorPen: "Low-Medium", quality: "Standard", priceCp: 270, priceDisplay: "2si 70cp", descriptionFull: "Reed Quarterstaff. Riverlands staff of river reed cores sleeved in hardwood, iron ferrules and waxed wraps keeping it light yet lively for boat decks. Trusted from Southern Kingdoms, it proves dependable steel sized for large engagements. Favoured for flowing deflections with darting strikes." },
    { name: "Reed Quarterstaff", region: "Southern Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Riverlands staff of river reed cores sleeved in hardwood, iron ferrules and waxed wraps keeping it light yet lively for boat decks.", fightingStyle: "Flowing deflections with darting strikes", attackSpeed: 7.4, damage: 4.3, armorPen: "Low-Medium", quality: "Fine", priceCp: 395, priceDisplay: "3si 95cp", descriptionFull: "Fine Reed Quarterstaff. Riverlands staff of river reed cores sleeved in hardwood, iron ferrules and waxed wraps keeping it light yet lively for boat decks. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for flowing deflections with darting strikes." },
    { name: "Reed Quarterstaff", region: "Southern Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Riverlands staff of river reed cores sleeved in hardwood, iron ferrules and waxed wraps keeping it light yet lively for boat decks.", fightingStyle: "Flowing deflections with darting strikes", attackSpeed: 7.4, damage: 4.3, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 640, priceDisplay: "6si 40cp", descriptionFull: "Masterwork Reed Quarterstaff. Riverlands staff of river reed cores sleeved in hardwood, iron ferrules and waxed wraps keeping it light yet lively for boat decks. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for flowing deflections with darting strikes." },
    { name: "Ferruled Waystaff", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Wayfarer staff of tough ash with brass ferrules, hidden cord wraps, and travel sigils burned along the length; doubles as walking aid and defense.", fightingStyle: "Measured guards, shoulder checks, and sweeps", attackSpeed: 7.1, damage: 4.6, armorPen: "Low-Medium", quality: "Standard", priceCp: 280, priceDisplay: "2si 80cp", descriptionFull: "Ferruled Waystaff. Wayfarer staff of tough ash with brass ferrules, hidden cord wraps, and travel sigils burned along the length; doubles as walking aid and defense. Trusted from Borderlands, it proves dependable steel sized for large engagements. Favoured for measured guards, shoulder checks, and sweeps." },
    { name: "Ferruled Waystaff", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Wayfarer staff of tough ash with brass ferrules, hidden cord wraps, and travel sigils burned along the length; doubles as walking aid and defense.", fightingStyle: "Measured guards, shoulder checks, and sweeps", attackSpeed: 7.1, damage: 4.6, armorPen: "Low-Medium", quality: "Fine", priceCp: 410, priceDisplay: "4si 10cp", descriptionFull: "Fine Ferruled Waystaff. Wayfarer staff of tough ash with brass ferrules, hidden cord wraps, and travel sigils burned along the length; doubles as walking aid and defense. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for measured guards, shoulder checks, and sweeps." },
    { name: "Ferruled Waystaff", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Wayfarer staff of tough ash with brass ferrules, hidden cord wraps, and travel sigils burned along the length; doubles as walking aid and defense.", fightingStyle: "Measured guards, shoulder checks, and sweeps", attackSpeed: 7.1, damage: 4.6, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 660, priceDisplay: "6si 60cp", descriptionFull: "Masterwork Ferruled Waystaff. Wayfarer staff of tough ash with brass ferrules, hidden cord wraps, and travel sigils burned along the length; doubles as walking aid and defense. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for measured guards, shoulder checks, and sweeps." },
    { name: "Temple Ironstaff", region: "Eastern Realms", size: "Large", hands: 2, reach: "Long", description: "Monastic ironstaff with octagonal cross-section, ringed finials that chime with motion, and crimson cord grips for forms practice and patrols.", fightingStyle: "Disciplined forms with crushing counters", attackSpeed: 6.9, damage: 5, armorPen: "Medium", quality: "Standard", priceCp: 325, priceDisplay: "3si 25cp", descriptionFull: "Temple Ironstaff. Monastic ironstaff with octagonal cross-section, ringed finials that chime with motion, and crimson cord grips for forms practice and patrols. Trusted from Eastern Realms, it proves dependable steel sized for large engagements. Favoured for disciplined forms with crushing counters." },
    { name: "Temple Ironstaff", region: "Eastern Realms", size: "Large", hands: 2, reach: "Long", description: "Monastic ironstaff with octagonal cross-section, ringed finials that chime with motion, and crimson cord grips for forms practice and patrols.", fightingStyle: "Disciplined forms with crushing counters", attackSpeed: 6.9, damage: 5, armorPen: "Medium", quality: "Fine", priceCp: 470, priceDisplay: "4si 70cp", descriptionFull: "Fine Temple Ironstaff. Monastic ironstaff with octagonal cross-section, ringed finials that chime with motion, and crimson cord grips for forms practice and patrols. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for disciplined forms with crushing counters." },
    { name: "Temple Ironstaff", region: "Eastern Realms", size: "Large", hands: 2, reach: "Long", description: "Monastic ironstaff with octagonal cross-section, ringed finials that chime with motion, and crimson cord grips for forms practice and patrols.", fightingStyle: "Disciplined forms with crushing counters", attackSpeed: 6.9, damage: 5, armorPen: "Medium", quality: "Masterwork", priceCp: 760, priceDisplay: "7si 60cp", descriptionFull: "Masterwork Temple Ironstaff. Monastic ironstaff with octagonal cross-section, ringed finials that chime with motion, and crimson cord grips for forms practice and patrols. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for disciplined forms with crushing counters." },
  ],
  martial: [
    { name: "Twin Sai", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Pair of trident-shaped steel batons with square shafts; prongs for trapping and wrenching; iron-ringed hilts and lacquered grips; no edge, all control.", fightingStyle: "Parry, trap, and thrust; blade control", attackSpeed: 8.5, damage: 2.5, armorPen: "Low", quality: "Standard", priceCp: 115, priceDisplay: "1si 15cp", descriptionFull: "Twin Sai. Pair of trident-shaped steel batons with square shafts; prongs for trapping and wrenching; iron-ringed hilts and lacquered grips; no edge, all control. Trusted from Island Clans, it proves dependable steel sized for small engagements. Favoured for parry, trap, and thrust; blade control." },
    { name: "Twin Sai", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Pair of trident-shaped steel batons with square shafts; prongs for trapping and wrenching; iron-ringed hilts and lacquered grips; no edge, all control.", fightingStyle: "Parry, trap, and thrust; blade control", attackSpeed: 8.5, damage: 2.5, armorPen: "Low", quality: "Fine", priceCp: 170, priceDisplay: "1si 70cp", descriptionFull: "Fine Twin Sai. Pair of trident-shaped steel batons with square shafts; prongs for trapping and wrenching; iron-ringed hilts and lacquered grips; no edge, all control. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for parry, trap, and thrust; blade control." },
    { name: "Twin Sai", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Pair of trident-shaped steel batons with square shafts; prongs for trapping and wrenching; iron-ringed hilts and lacquered grips; no edge, all control.", fightingStyle: "Parry, trap, and thrust; blade control", attackSpeed: 8.5, damage: 2.5, armorPen: "Low", quality: "Masterwork", priceCp: 275, priceDisplay: "2si 75cp", descriptionFull: "Masterwork Twin Sai. Pair of trident-shaped steel batons with square shafts; prongs for trapping and wrenching; iron-ringed hilts and lacquered grips; no edge, all control. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for parry, trap, and thrust; blade control." },
    { name: "Tonfa Pair", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Side-handled batons of hard wood with rounded ends; leather thong lanyards; designed for rotational strikes, lever blocks, and joint pressure.", fightingStyle: "Rotational blows, locking blocks, joint pressure", attackSpeed: 8, damage: 3, armorPen: "Low-Medium", quality: "Standard", priceCp: 130, priceDisplay: "1si 30cp", descriptionFull: "Tonfa Pair. Side-handled batons of hard wood with rounded ends; leather thong lanyards; designed for rotational strikes, lever blocks, and joint pressure. Trusted from Island Clans, it proves dependable steel sized for small engagements. Favoured for rotational blows, locking blocks, joint pressure." },
    { name: "Tonfa Pair", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Side-handled batons of hard wood with rounded ends; leather thong lanyards; designed for rotational strikes, lever blocks, and joint pressure.", fightingStyle: "Rotational blows, locking blocks, joint pressure", attackSpeed: 8, damage: 3, armorPen: "Low-Medium", quality: "Fine", priceCp: 185, priceDisplay: "1si 85cp", descriptionFull: "Fine Tonfa Pair. Side-handled batons of hard wood with rounded ends; leather thong lanyards; designed for rotational strikes, lever blocks, and joint pressure. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for rotational blows, locking blocks, joint pressure." },
    { name: "Tonfa Pair", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Side-handled batons of hard wood with rounded ends; leather thong lanyards; designed for rotational strikes, lever blocks, and joint pressure.", fightingStyle: "Rotational blows, locking blocks, joint pressure", attackSpeed: 8, damage: 3, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 305, priceDisplay: "3si 5cp", descriptionFull: "Masterwork Tonfa Pair. Side-handled batons of hard wood with rounded ends; leather thong lanyards; designed for rotational strikes, lever blocks, and joint pressure. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for rotational blows, locking blocks, joint pressure." },
    { name: "Emei Rods", region: "Eastern Realms", size: "Tiny", hands: 1, reach: "Very Short", description: "Slim twin steel rods worn on the fingers or palmed; blued finish for low glare; disappear up the sleeve and reappear as quick punctures.", fightingStyle: "Rapid punctures and feints in close clinch", attackSpeed: 9.5, damage: 1.8, armorPen: "Low", quality: "Standard", priceCp: 110, priceDisplay: "1si 10cp", descriptionFull: "Emei Rods. Slim twin steel rods worn on the fingers or palmed; blued finish for low glare; disappear up the sleeve and reappear as quick punctures. Trusted from Eastern Realms, it proves dependable steel sized for tiny engagements. Favoured for rapid punctures and feints in close clinch." },
    { name: "Emei Rods", region: "Eastern Realms", size: "Tiny", hands: 1, reach: "Very Short", description: "Slim twin steel rods worn on the fingers or palmed; blued finish for low glare; disappear up the sleeve and reappear as quick punctures.", fightingStyle: "Rapid punctures and feints in close clinch", attackSpeed: 9.5, damage: 1.8, armorPen: "Low", quality: "Fine", priceCp: 160, priceDisplay: "1si 60cp", descriptionFull: "Fine Emei Rods. Slim twin steel rods worn on the fingers or palmed; blued finish for low glare; disappear up the sleeve and reappear as quick punctures. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its tiny frame. Favoured for rapid punctures and feints in close clinch." },
    { name: "Emei Rods", region: "Eastern Realms", size: "Tiny", hands: 1, reach: "Very Short", description: "Slim twin steel rods worn on the fingers or palmed; blued finish for low glare; disappear up the sleeve and reappear as quick punctures.", fightingStyle: "Rapid punctures and feints in close clinch", attackSpeed: 9.5, damage: 1.8, armorPen: "Low", quality: "Masterwork", priceCp: 260, priceDisplay: "2si 60cp", descriptionFull: "Masterwork Emei Rods. Slim twin steel rods worn on the fingers or palmed; blued finish for low glare; disappear up the sleeve and reappear as quick punctures. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for rapid punctures and feints in close clinch." },
    { name: "Tiger Claws", region: "Southern Steppes", size: "Tiny", hands: 1, reach: "Very Short", description: "Hand-worn frame of brass knuckle plates mounting four curved steel talons (~8 cm) per hand; oiled leather straps dyed deep red anchor the fit; edges slightly blued to resist rust.", fightingStyle: "Rakes and grapples; targets tendons and face", attackSpeed: 10, damage: 1.8, armorPen: "Low", quality: "Standard", priceCp: 110, priceDisplay: "1si 10cp", descriptionFull: "Tiger Claws. Hand-worn frame of brass knuckle plates mounting four curved steel talons (~8 cm) per hand; oiled leather straps dyed deep red anchor the fit; edges slightly blued to resist rust. Trusted from Southern Steppes, it proves dependable steel sized for tiny engagements. Favoured for rakes and grapples; targets tendons and face." },
    { name: "Tiger Claws", region: "Southern Steppes", size: "Tiny", hands: 1, reach: "Very Short", description: "Hand-worn frame of brass knuckle plates mounting four curved steel talons (~8 cm) per hand; oiled leather straps dyed deep red anchor the fit; edges slightly blued to resist rust.", fightingStyle: "Rakes and grapples; targets tendons and face", attackSpeed: 10, damage: 1.8, armorPen: "Low", quality: "Fine", priceCp: 160, priceDisplay: "1si 60cp", descriptionFull: "Fine Tiger Claws. Hand-worn frame of brass knuckle plates mounting four curved steel talons (~8 cm) per hand; oiled leather straps dyed deep red anchor the fit; edges slightly blued to resist rust. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its tiny frame. Favoured for rakes and grapples; targets tendons and face." },
    { name: "Tiger Claws", region: "Southern Steppes", size: "Tiny", hands: 1, reach: "Very Short", description: "Hand-worn frame of brass knuckle plates mounting four curved steel talons (~8 cm) per hand; oiled leather straps dyed deep red anchor the fit; edges slightly blued to resist rust.", fightingStyle: "Rakes and grapples; targets tendons and face", attackSpeed: 10, damage: 1.8, armorPen: "Low", quality: "Masterwork", priceCp: 260, priceDisplay: "2si 60cp", descriptionFull: "Masterwork Tiger Claws. Hand-worn frame of brass knuckle plates mounting four curved steel talons (~8 cm) per hand; oiled leather straps dyed deep red anchor the fit; edges slightly blued to resist rust. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for rakes and grapples; targets tendons and face." },
    { name: "Knuckle Gauntlet", region: "Island Clans", size: "Tiny", hands: 1, reach: "Very Short", description: "Leather glove with riveted steel knuckle plates and palm bar; some feature spike studs; a brawler’s answer to daggers in the clinch.", fightingStyle: "Close punches and clinch control", attackSpeed: 9.5, damage: 2, armorPen: "Low", quality: "Standard", priceCp: 110, priceDisplay: "1si 10cp", descriptionFull: "Knuckle Gauntlet. Leather glove with riveted steel knuckle plates and palm bar; some feature spike studs; a brawler’s answer to daggers in the clinch. Trusted from Island Clans, it proves dependable steel sized for tiny engagements. Favoured for close punches and clinch control." },
    { name: "Knuckle Gauntlet", region: "Island Clans", size: "Tiny", hands: 1, reach: "Very Short", description: "Leather glove with riveted steel knuckle plates and palm bar; some feature spike studs; a brawler’s answer to daggers in the clinch.", fightingStyle: "Close punches and clinch control", attackSpeed: 9.5, damage: 2, armorPen: "Low", quality: "Fine", priceCp: 160, priceDisplay: "1si 60cp", descriptionFull: "Fine Knuckle Gauntlet. Leather glove with riveted steel knuckle plates and palm bar; some feature spike studs; a brawler’s answer to daggers in the clinch. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its tiny frame. Favoured for close punches and clinch control." },
    { name: "Knuckle Gauntlet", region: "Island Clans", size: "Tiny", hands: 1, reach: "Very Short", description: "Leather glove with riveted steel knuckle plates and palm bar; some feature spike studs; a brawler’s answer to daggers in the clinch.", fightingStyle: "Close punches and clinch control", attackSpeed: 9.5, damage: 2, armorPen: "Low", quality: "Masterwork", priceCp: 260, priceDisplay: "2si 60cp", descriptionFull: "Masterwork Knuckle Gauntlet. Leather glove with riveted steel knuckle plates and palm bar; some feature spike studs; a brawler’s answer to daggers in the clinch. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for close punches and clinch control." },
  ],
  maces: [
    { name: "Spiked Morning Star", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Short", description: "Rigid ash haft capped with a solid steel ball bristling with pyramidal spikes; iron langets protect the wood; brutal, simple, and cheap to keep.", fightingStyle: "Overhand crashes and shield-busting blows", attackSpeed: 5.8, damage: 7, armorPen: "High", quality: "Standard", priceCp: 955, priceDisplay: "9si 55cp", descriptionFull: "Spiked Morning Star. Rigid ash haft capped with a solid steel ball bristling with pyramidal spikes; iron langets protect the wood; brutal, simple, and cheap to keep. Trusted from High Kingdoms, it proves dependable steel sized for medium engagements. Favoured for overhand crashes and shield-busting blows." },
    { name: "Spiked Morning Star", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Short", description: "Rigid ash haft capped with a solid steel ball bristling with pyramidal spikes; iron langets protect the wood; brutal, simple, and cheap to keep.", fightingStyle: "Overhand crashes and shield-busting blows", attackSpeed: 5.8, damage: 7, armorPen: "High", quality: "Fine", priceCp: 1385, priceDisplay: "13si 85cp", descriptionFull: "Fine Spiked Morning Star. Rigid ash haft capped with a solid steel ball bristling with pyramidal spikes; iron langets protect the wood; brutal, simple, and cheap to keep. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for overhand crashes and shield-busting blows." },
    { name: "Spiked Morning Star", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Short", description: "Rigid ash haft capped with a solid steel ball bristling with pyramidal spikes; iron langets protect the wood; brutal, simple, and cheap to keep.", fightingStyle: "Overhand crashes and shield-busting blows", attackSpeed: 5.8, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 2245, priceDisplay: "1g 2si 45cp", descriptionFull: "Masterwork Spiked Morning Star. Rigid ash haft capped with a solid steel ball bristling with pyramidal spikes; iron langets protect the wood; brutal, simple, and cheap to keep. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for overhand crashes and shield-busting blows." },
    { name: "Flanged Mace", region: "Borderlands", size: "Medium", hands: 1, reach: "Short", description: "Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates.", fightingStyle: "Short-range battering; targets helms and pauldrons", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Standard", priceCp: 950, priceDisplay: "9si 50cp", descriptionFull: "Flanged Mace. Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates. Trusted from Borderlands, it proves dependable steel sized for medium engagements. Favoured for short-range battering; targets helms and pauldrons." },
    { name: "Flanged Mace", region: "Borderlands", size: "Medium", hands: 1, reach: "Short", description: "Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates.", fightingStyle: "Short-range battering; targets helms and pauldrons", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Fine", priceCp: 1375, priceDisplay: "13si 75cp", descriptionFull: "Fine Flanged Mace. Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for short-range battering; targets helms and pauldrons." },
    { name: "Flanged Mace", region: "Borderlands", size: "Medium", hands: 1, reach: "Short", description: "Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates.", fightingStyle: "Short-range battering; targets helms and pauldrons", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Masterwork", priceCp: 2225, priceDisplay: "1g 2si 25cp", descriptionFull: "Masterwork Flanged Mace. Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for short-range battering; targets helms and pauldrons." },
    { name: "Estuary Pick", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Short", description: "Marshland war pick with narrow diamond spike, bronze beak counterweight, and tarred haft against damp; prized for biting through soaked gambesons.", fightingStyle: "Armor-piercing picks and braced hooks", attackSpeed: 5.6, damage: 6.8, armorPen: "Very High", quality: "Standard", priceCp: 1190, priceDisplay: "11si 90cp", descriptionFull: "Estuary Pick. Marshland war pick with narrow diamond spike, bronze beak counterweight, and tarred haft against damp; prized for biting through soaked gambesons. Trusted from Southern Kingdoms, it proves dependable steel sized for medium engagements. Favoured for armor-piercing picks and braced hooks." },
    { name: "Estuary Pick", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Short", description: "Marshland war pick with narrow diamond spike, bronze beak counterweight, and tarred haft against damp; prized for biting through soaked gambesons.", fightingStyle: "Armor-piercing picks and braced hooks", attackSpeed: 5.6, damage: 6.8, armorPen: "Very High", quality: "Fine", priceCp: 1725, priceDisplay: "17si 25cp", descriptionFull: "Fine Estuary Pick. Marshland war pick with narrow diamond spike, bronze beak counterweight, and tarred haft against damp; prized for biting through soaked gambesons. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for armor-piercing picks and braced hooks." },
    { name: "Estuary Pick", region: "Southern Kingdoms", size: "Medium", hands: 1, reach: "Short", description: "Marshland war pick with narrow diamond spike, bronze beak counterweight, and tarred haft against damp; prized for biting through soaked gambesons.", fightingStyle: "Armor-piercing picks and braced hooks", attackSpeed: 5.6, damage: 6.8, armorPen: "Very High", quality: "Masterwork", priceCp: 2790, priceDisplay: "1g 7si 90cp", descriptionFull: "Masterwork Estuary Pick. Marshland war pick with narrow diamond spike, bronze beak counterweight, and tarred haft against damp; prized for biting through soaked gambesons. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for armor-piercing picks and braced hooks." },
    { name: "Studded Cudgel", region: "High Villages", size: "Medium", hands: 1, reach: "Short", description: "Seasoned oak cudgel wrapped in rawhide with iron studs along the striking face; village constables keep it by the door.", fightingStyle: "Ringing blows and joint-breaking strikes", attackSpeed: 6.2, damage: 5.8, armorPen: "Medium", quality: "Standard", priceCp: 755, priceDisplay: "7si 55cp", descriptionFull: "Studded Cudgel. Seasoned oak cudgel wrapped in rawhide with iron studs along the striking face; village constables keep it by the door. Trusted from High Villages, it proves dependable steel sized for medium engagements. Favoured for ringing blows and joint-breaking strikes." },
    { name: "Studded Cudgel", region: "High Villages", size: "Medium", hands: 1, reach: "Short", description: "Seasoned oak cudgel wrapped in rawhide with iron studs along the striking face; village constables keep it by the door.", fightingStyle: "Ringing blows and joint-breaking strikes", attackSpeed: 6.2, damage: 5.8, armorPen: "Medium", quality: "Fine", priceCp: 1095, priceDisplay: "10si 95cp", descriptionFull: "Fine Studded Cudgel. Seasoned oak cudgel wrapped in rawhide with iron studs along the striking face; village constables keep it by the door. Fine finishing from High Villages dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for ringing blows and joint-breaking strikes." },
    { name: "Studded Cudgel", region: "High Villages", size: "Medium", hands: 1, reach: "Short", description: "Seasoned oak cudgel wrapped in rawhide with iron studs along the striking face; village constables keep it by the door.", fightingStyle: "Ringing blows and joint-breaking strikes", attackSpeed: 6.2, damage: 5.8, armorPen: "Medium", quality: "Masterwork", priceCp: 1775, priceDisplay: "17si 75cp", descriptionFull: "Masterwork Studded Cudgel. Seasoned oak cudgel wrapped in rawhide with iron studs along the striking face; village constables keep it by the door. Masterwork artisans from High Villages layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for ringing blows and joint-breaking strikes." },
    { name: "Iron-Studded Great Club", region: "Island Clans", size: "Very Large", hands: 2, reach: "Long", description: "Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear.", fightingStyle: "Crushing sweeps and pounding overhead smashes", attackSpeed: 3, damage: 9.2, armorPen: "High", quality: "Standard", priceCp: 2085, priceDisplay: "1g 85cp", descriptionFull: "Iron-Studded Great Club. Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear. Trusted from Island Clans, it proves dependable steel sized for very large engagements. Favoured for crushing sweeps and pounding overhead smashes." },
    { name: "Iron-Studded Great Club", region: "Island Clans", size: "Very Large", hands: 2, reach: "Long", description: "Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear.", fightingStyle: "Crushing sweeps and pounding overhead smashes", attackSpeed: 3, damage: 9.2, armorPen: "High", quality: "Fine", priceCp: 3025, priceDisplay: "1g 10si 25cp", descriptionFull: "Fine Iron-Studded Great Club. Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for crushing sweeps and pounding overhead smashes." },
    { name: "Iron-Studded Great Club", region: "Island Clans", size: "Very Large", hands: 2, reach: "Long", description: "Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear.", fightingStyle: "Crushing sweeps and pounding overhead smashes", attackSpeed: 3, damage: 9.2, armorPen: "High", quality: "Masterwork", priceCp: 4900, priceDisplay: "2g 9si", descriptionFull: "Masterwork Iron-Studded Great Club. Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for crushing sweeps and pounding overhead smashes." },
    { name: "Oaken Maul", region: "Borderlands", size: "Very Large", hands: 2, reach: "Long", description: "Frontier two-hand maul of iron-banded oak with lead-weighted head and hide-wrapped mid-grip; used to shatter palisades and stubborn shields.", fightingStyle: "Earthshaking smashes that stagger lines", attackSpeed: 3.2, damage: 9, armorPen: "High", quality: "Standard", priceCp: 2495, priceDisplay: "1g 4si 95cp", descriptionFull: "Oaken Maul. Frontier two-hand maul of iron-banded oak with lead-weighted head and hide-wrapped mid-grip; used to shatter palisades and stubborn shields. Trusted from Borderlands, it proves dependable steel sized for very large engagements. Favoured for earthshaking smashes that stagger lines." },
    { name: "Oaken Maul", region: "Borderlands", size: "Very Large", hands: 2, reach: "Long", description: "Frontier two-hand maul of iron-banded oak with lead-weighted head and hide-wrapped mid-grip; used to shatter palisades and stubborn shields.", fightingStyle: "Earthshaking smashes that stagger lines", attackSpeed: 3.2, damage: 9, armorPen: "High", quality: "Fine", priceCp: 3615, priceDisplay: "1g 16si 15cp", descriptionFull: "Fine Oaken Maul. Frontier two-hand maul of iron-banded oak with lead-weighted head and hide-wrapped mid-grip; used to shatter palisades and stubborn shields. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for earthshaking smashes that stagger lines." },
    { name: "Oaken Maul", region: "Borderlands", size: "Very Large", hands: 2, reach: "Long", description: "Frontier two-hand maul of iron-banded oak with lead-weighted head and hide-wrapped mid-grip; used to shatter palisades and stubborn shields.", fightingStyle: "Earthshaking smashes that stagger lines", attackSpeed: 3.2, damage: 9, armorPen: "High", quality: "Masterwork", priceCp: 5860, priceDisplay: "2g 18si 60cp", descriptionFull: "Masterwork Oaken Maul. Frontier two-hand maul of iron-banded oak with lead-weighted head and hide-wrapped mid-grip; used to shatter palisades and stubborn shields. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for earthshaking smashes that stagger lines." },
    { name: "Fang of the Star", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Short", description: "Astral morningstar with cobalt-steel flanges and a luminous quartz core set into the head; haft lacquered midnight blue with silver constellations.", fightingStyle: "Radiant crushing blows and shield rattles", attackSpeed: 5.4, damage: 7.4, armorPen: "High", quality: "Standard", priceCp: 1140, priceDisplay: "11si 40cp", descriptionFull: "Fang of the Star. Astral morningstar with cobalt-steel flanges and a luminous quartz core set into the head; haft lacquered midnight blue with silver constellations. Trusted from Eastern Realms, it proves dependable steel sized for medium engagements. Favoured for radiant crushing blows and shield rattles." },
    { name: "Fang of the Star", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Short", description: "Astral morningstar with cobalt-steel flanges and a luminous quartz core set into the head; haft lacquered midnight blue with silver constellations.", fightingStyle: "Radiant crushing blows and shield rattles", attackSpeed: 5.4, damage: 7.4, armorPen: "High", quality: "Fine", priceCp: 1655, priceDisplay: "16si 55cp", descriptionFull: "Fine Fang of the Star. Astral morningstar with cobalt-steel flanges and a luminous quartz core set into the head; haft lacquered midnight blue with silver constellations. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for radiant crushing blows and shield rattles." },
    { name: "Fang of the Star", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Short", description: "Astral morningstar with cobalt-steel flanges and a luminous quartz core set into the head; haft lacquered midnight blue with silver constellations.", fightingStyle: "Radiant crushing blows and shield rattles", attackSpeed: 5.4, damage: 7.4, armorPen: "High", quality: "Masterwork", priceCp: 2680, priceDisplay: "1g 6si 80cp", descriptionFull: "Masterwork Fang of the Star. Astral morningstar with cobalt-steel flanges and a luminous quartz core set into the head; haft lacquered midnight blue with silver constellations. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for radiant crushing blows and shield rattles." },
  ],
};

export interface WeaponUpgradeOnHitEffect {
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
}
export type WeaponUpgradeOnHitMap = Record<string, WeaponUpgradeOnHitEffect>;
export interface WeaponUpgrade {
  category: string;
  name: string;
  quality: WeaponQuality;
  ap: number;
  dmgMix: Record<'BLUNT'|'SLASH'|'PIERCE', number>;
  critChancePct: number;
  critMult: number;
  critArmorBypassPct?: number;
  onHit?: WeaponUpgradeOnHitMap;
}

export const WEAPON_UPGRADES: WeaponUpgrade[] = [
  {
    "category": "swords",
    "name": "Arming Sword",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.6,
      "PIERCE": 0.3
    },
    "critChancePct": 9,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Arming Sword",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.6,
      "PIERCE": 0.3
    },
    "critChancePct": 10,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Arming Sword",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.6,
      "PIERCE": 0.3
    },
    "critChancePct": 11,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Blade of the Tide",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Blade of the Tide",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Blade of the Tide",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 15,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Bronze Leafblade",
    "quality": "Standard",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.12,
      "SLASH": 0.48,
      "PIERCE": 0.4
    },
    "critChancePct": 9,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Bronze Leafblade",
    "quality": "Fine",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.12,
      "SLASH": 0.48,
      "PIERCE": 0.4
    },
    "critChancePct": 10,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Bronze Leafblade",
    "quality": "Masterwork",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.12,
      "SLASH": 0.48,
      "PIERCE": 0.4
    },
    "critChancePct": 11,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "City Gentle’s Cane",
    "quality": "Standard",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.3,
      "SLASH": 0.4,
      "PIERCE": 0.3
    },
    "critChancePct": 9,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "daze": {
        "chancePct": 12,
        "durationSec": 2
      }
    }
  },
  {
    "category": "swords",
    "name": "City Gentle’s Cane",
    "quality": "Fine",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.3,
      "SLASH": 0.4,
      "PIERCE": 0.3
    },
    "critChancePct": 10,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "daze": {
        "chancePct": 12,
        "durationSec": 2
      }
    }
  },
  {
    "category": "swords",
    "name": "City Gentle’s Cane",
    "quality": "Masterwork",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.3,
      "SLASH": 0.4,
      "PIERCE": 0.3
    },
    "critChancePct": 11,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "daze": {
        "chancePct": 12,
        "durationSec": 2
      }
    }
  },
  {
    "category": "swords",
    "name": "Companion Blade",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.6,
      "PIERCE": 0.35
    },
    "critChancePct": 11,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Companion Blade",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.6,
      "PIERCE": 0.35
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Companion Blade",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.6,
      "PIERCE": 0.35
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Dual Set: Wakizashi Companion + Tanto Sideblade",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.08,
      "SLASH": 0.62,
      "PIERCE": 0.3
    },
    "critChancePct": 13,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      },
      "daze": {
        "chancePct": 8,
        "durationSec": 2
      }
    }
  },
  {
    "category": "swords",
    "name": "Dual Set: Wakizashi Companion + Tanto Sideblade",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.08,
      "SLASH": 0.62,
      "PIERCE": 0.3
    },
    "critChancePct": 14,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      },
      "daze": {
        "chancePct": 8,
        "durationSec": 2
      }
    }
  },
  {
    "category": "swords",
    "name": "Dual Set: Wakizashi Companion + Tanto Sideblade",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.08,
      "SLASH": 0.62,
      "PIERCE": 0.3
    },
    "critChancePct": 15,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      },
      "daze": {
        "chancePct": 8,
        "durationSec": 2
      }
    }
  },
  {
    "category": "swords",
    "name": "Eastern Straightblade",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.55,
      "PIERCE": 0.4
    },
    "critChancePct": 11,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Eastern Straightblade",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.55,
      "PIERCE": 0.4
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Eastern Straightblade",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.55,
      "PIERCE": 0.4
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Falchion",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Falchion",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Falchion",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Flanged Sabre",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      },
      "sunder": {
        "chancePct": 18,
        "powerPct": 9,
        "durationSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Flanged Sabre",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      },
      "sunder": {
        "chancePct": 18,
        "powerPct": 9,
        "durationSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Flanged Sabre",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      },
      "sunder": {
        "chancePct": 18,
        "powerPct": 9,
        "durationSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Great Sword",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Great Sword",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 15,
    "critMult": 1.75,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Great Sword",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 16,
    "critMult": 1.8,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Great-Edge",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 9,
        "power": 1.3,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Great-Edge",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 15,
    "critMult": 1.75,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 9,
        "power": 1.3,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Great-Edge",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 16,
    "critMult": 1.8,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 9,
        "power": 1.3,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Kopis Cutter",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.75,
      "PIERCE": 0.2
    },
    "critChancePct": 12,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      },
      "rend": {
        "chancePct": 12,
        "powerPct": 16,
        "durationSec": 8
      }
    }
  },
  {
    "category": "swords",
    "name": "Kopis Cutter",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.75,
      "PIERCE": 0.2
    },
    "critChancePct": 13,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      },
      "rend": {
        "chancePct": 12,
        "powerPct": 16,
        "durationSec": 8
      }
    }
  },
  {
    "category": "swords",
    "name": "Kopis Cutter",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.75,
      "PIERCE": 0.2
    },
    "critChancePct": 14,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      },
      "rend": {
        "chancePct": 12,
        "powerPct": 16,
        "durationSec": 8
      }
    }
  },
  {
    "category": "swords",
    "name": "Longsword",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.55,
      "PIERCE": 0.35
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 8,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Longsword",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.55,
      "PIERCE": 0.35
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 8,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Longsword",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.55,
      "PIERCE": 0.35
    },
    "critChancePct": 13,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 8,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Sawtooth Falx",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 24,
        "power": 2,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      },
      "rend": {
        "chancePct": 22,
        "powerPct": 20,
        "durationSec": 10,
        "tickSec": 2
      }
    }
  },
  {
    "category": "swords",
    "name": "Sawtooth Falx",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 15,
    "critMult": 1.75,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 24,
        "power": 2,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      },
      "rend": {
        "chancePct": 22,
        "powerPct": 20,
        "durationSec": 10,
        "tickSec": 2
      }
    }
  },
  {
    "category": "swords",
    "name": "Sawtooth Falx",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 16,
    "critMult": 1.8,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 24,
        "power": 2,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      },
      "rend": {
        "chancePct": 22,
        "powerPct": 20,
        "durationSec": 10,
        "tickSec": 2
      }
    }
  },
  {
    "category": "swords",
    "name": "Shashka Officer Saber",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.04,
      "SLASH": 0.66,
      "PIERCE": 0.3
    },
    "critChancePct": 14,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.6,
        "durationSec": 7,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Shashka Officer Saber",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.04,
      "SLASH": 0.66,
      "PIERCE": 0.3
    },
    "critChancePct": 15,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.6,
        "durationSec": 7,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Shashka Officer Saber",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.04,
      "SLASH": 0.66,
      "PIERCE": 0.3
    },
    "critChancePct": 16,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.6,
        "durationSec": 7,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Short Guardblade",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.65,
      "PIERCE": 0.25
    },
    "critChancePct": 10,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Short Guardblade",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.65,
      "PIERCE": 0.25
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Short Guardblade",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.65,
      "PIERCE": 0.25
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Steppe Sabre",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Steppe Sabre",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Steppe Sabre",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.8,
      "PIERCE": 0.15
    },
    "critChancePct": 15,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "swords",
    "name": "Tegha Broadblade",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.7,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Tegha Broadblade",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.75,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Tegha Broadblade",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 15,
    "critMult": 1.8,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Two-Hand Colossus",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Two-Hand Colossus",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 15,
    "critMult": 1.75,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Two-Hand Colossus",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.15,
      "SLASH": 0.7,
      "PIERCE": 0.15
    },
    "critChancePct": 16,
    "critMult": 1.8,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.8,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 8,
        "power": 1.2,
        "cdSec": 14
      }
    }
  },
  {
    "category": "swords",
    "name": "Xiphos Leaf Sword",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.08,
      "SLASH": 0.52,
      "PIERCE": 0.4
    },
    "critChancePct": 10,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Xiphos Leaf Sword",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.08,
      "SLASH": 0.52,
      "PIERCE": 0.4
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "swords",
    "name": "Xiphos Leaf Sword",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.08,
      "SLASH": 0.52,
      "PIERCE": 0.4
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Cairn Dirk",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.45,
      "PIERCE": 0.45
    },
    "critChancePct": 12,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Cairn Dirk",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.45,
      "PIERCE": 0.45
    },
    "critChancePct": 13,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Cairn Dirk",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.45,
      "PIERCE": 0.45
    },
    "critChancePct": 14,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Curved Twin-Edge",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 11,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Curved Twin-Edge",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 12,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Curved Twin-Edge",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 13,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Karambit Claw",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.65,
      "PIERCE": 0.25
    },
    "critChancePct": 11,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      },
      "entangle": {
        "chancePct": 12,
        "durationSec": 5
      }
    }
  },
  {
    "category": "daggers",
    "name": "Karambit Claw",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.65,
      "PIERCE": 0.25
    },
    "critChancePct": 12,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      },
      "entangle": {
        "chancePct": 12,
        "durationSec": 5
      }
    }
  },
  {
    "category": "daggers",
    "name": "Karambit Claw",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.65,
      "PIERCE": 0.25
    },
    "critChancePct": 13,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      },
      "entangle": {
        "chancePct": 12,
        "durationSec": 5
      }
    }
  },
  {
    "category": "daggers",
    "name": "Kris Wave Dagger",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 11,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.3,
        "durationSec": 8,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Kris Wave Dagger",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 12,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.3,
        "durationSec": 8,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Kris Wave Dagger",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 13,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.3,
        "durationSec": 8,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Misericorde",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "critArmorBypassPct": 0.05,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Misericorde",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "critArmorBypassPct": 0.05,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Misericorde",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "critArmorBypassPct": 0.05,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Pesh-Kabz Tusk",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Pesh-Kabz Tusk",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Pesh-Kabz Tusk",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Piercer",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 13,
    "critMult": 1.6,
    "critArmorBypassPct": 0.07,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Piercer",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 14,
    "critMult": 1.65,
    "critArmorBypassPct": 0.07,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Piercer",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 15,
    "critMult": 1.7,
    "critArmorBypassPct": 0.07,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Push-Spike",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.2,
      "PIERCE": 0.75
    },
    "critChancePct": 13,
    "critMult": 1.6,
    "critArmorBypassPct": 0.06,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 6,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Push-Spike",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.2,
      "PIERCE": 0.75
    },
    "critChancePct": 14,
    "critMult": 1.65,
    "critArmorBypassPct": 0.06,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 6,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Push-Spike",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.2,
      "PIERCE": 0.75
    },
    "critChancePct": 15,
    "critMult": 1.7,
    "critArmorBypassPct": 0.06,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 6,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Rondel",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "critArmorBypassPct": 0.06,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Rondel",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "critArmorBypassPct": 0.06,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Rondel",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 13,
    "critMult": 1.7,
    "critArmorBypassPct": 0.06,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Tanto Sideblade",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 12,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Tanto Sideblade",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 13,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Tanto Sideblade",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 14,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Wavesong Dagger",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 11,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Wavesong Dagger",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 12,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "daggers",
    "name": "Wavesong Dagger",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.7,
      "PIERCE": 0.25
    },
    "critChancePct": 13,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "axes",
    "name": "Bearded Axe",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Bearded Axe",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Bearded Axe",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Crescent Battleaxe",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Crescent Battleaxe",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Crescent Battleaxe",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Hooked War Axe",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.7,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      },
      "disarm": {
        "chancePct": 8,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "axes",
    "name": "Hooked War Axe",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.7,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      },
      "disarm": {
        "chancePct": 8,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "axes",
    "name": "Hooked War Axe",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.7,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      },
      "disarm": {
        "chancePct": 8,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "axes",
    "name": "Long-Blade Axe",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.7,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Long-Blade Axe",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.7,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Long-Blade Axe",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.7,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Long-Haft War Axe",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.7,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Long-Haft War Axe",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.7,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Long-Haft War Axe",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 20,
        "power": 1.7,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Moon Cleaver",
    "quality": "Standard",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.18,
      "SLASH": 0.67,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 24,
        "power": 1.9,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "lunarBrand": {
        "chancePct": 12,
        "powerPct": 12,
        "durationSec": 10
      }
    }
  },
  {
    "category": "axes",
    "name": "Moon Cleaver",
    "quality": "Fine",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.18,
      "SLASH": 0.67,
      "PIERCE": 0.15
    },
    "critChancePct": 15,
    "critMult": 1.75,
    "onHit": {
      "bleed": {
        "chancePct": 24,
        "power": 1.9,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "lunarBrand": {
        "chancePct": 12,
        "powerPct": 12,
        "durationSec": 10
      }
    }
  },
  {
    "category": "axes",
    "name": "Moon Cleaver",
    "quality": "Masterwork",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.18,
      "SLASH": 0.67,
      "PIERCE": 0.15
    },
    "critChancePct": 16,
    "critMult": 1.8,
    "onHit": {
      "bleed": {
        "chancePct": 24,
        "power": 1.9,
        "durationSec": 9,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "lunarBrand": {
        "chancePct": 12,
        "powerPct": 12,
        "durationSec": 10
      }
    }
  },
  {
    "category": "axes",
    "name": "Skeggox Hewing Axe",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 22,
        "power": 1.8,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Skeggox Hewing Axe",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 22,
        "power": 1.8,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Skeggox Hewing Axe",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 22,
        "power": 1.8,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "axes",
    "name": "Tabargan Twinblade",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 22,
        "power": 1.8,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 9
      }
    }
  },
  {
    "category": "axes",
    "name": "Tabargan Twinblade",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 22,
        "power": 1.8,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 9
      }
    }
  },
  {
    "category": "axes",
    "name": "Tabargan Twinblade",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.65,
      "PIERCE": 0.15
    },
    "critChancePct": 14,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 22,
        "power": 1.8,
        "durationSec": 8,
        "stacksMax": 4
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "sever": {
        "chancePct": 6,
        "power": 1.1,
        "cdSec": 12
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 9
      }
    }
  },
  {
    "category": "axes",
    "name": "Throwing Axe",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.8,
      "PIERCE": 0.1
    },
    "critChancePct": 10,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "axes",
    "name": "Throwing Axe",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.8,
      "PIERCE": 0.1
    },
    "critChancePct": 11,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "axes",
    "name": "Throwing Axe",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.8,
      "PIERCE": 0.1
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "polearms",
    "name": "Axe-Knife Polearm",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Axe-Knife Polearm",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Axe-Knife Polearm",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 13,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Beak-Hammer",
    "quality": "Standard",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.7,
      "SLASH": 0.1,
      "PIERCE": 0.2
    },
    "critChancePct": 10,
    "critMult": 1.75,
    "critArmorBypassPct": 0.1,
    "onHit": {
      "sunder": {
        "chancePct": 22,
        "powerPct": 10,
        "durationSec": 12,
        "stacksMax": 5
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      }
    }
  },
  {
    "category": "polearms",
    "name": "Beak-Hammer",
    "quality": "Fine",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.7,
      "SLASH": 0.1,
      "PIERCE": 0.2
    },
    "critChancePct": 11,
    "critMult": 1.8,
    "critArmorBypassPct": 0.1,
    "onHit": {
      "sunder": {
        "chancePct": 22,
        "powerPct": 10,
        "durationSec": 12,
        "stacksMax": 5
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      }
    }
  },
  {
    "category": "polearms",
    "name": "Beak-Hammer",
    "quality": "Masterwork",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.7,
      "SLASH": 0.1,
      "PIERCE": 0.2
    },
    "critChancePct": 12,
    "critMult": 1.85,
    "critArmorBypassPct": 0.1,
    "onHit": {
      "sunder": {
        "chancePct": 22,
        "powerPct": 10,
        "durationSec": 12,
        "stacksMax": 5
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      }
    }
  },
  {
    "category": "polearms",
    "name": "Glaive",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 11,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.5,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "polearms",
    "name": "Glaive",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.5,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "polearms",
    "name": "Glaive",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.5,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "polearms",
    "name": "Guisarme Hook",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "entangle": {
        "chancePct": 12,
        "durationSec": 5
      }
    }
  },
  {
    "category": "polearms",
    "name": "Guisarme Hook",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "entangle": {
        "chancePct": 12,
        "durationSec": 5
      }
    }
  },
  {
    "category": "polearms",
    "name": "Guisarme Hook",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 13,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      },
      "entangle": {
        "chancePct": 12,
        "durationSec": 5
      }
    }
  },
  {
    "category": "polearms",
    "name": "Halberd",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Halberd",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Halberd",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 13,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 14,
        "powerPct": 7,
        "durationSec": 12,
        "stacksMax": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Lucent Warhammer",
    "quality": "Standard",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.7,
      "SLASH": 0.1,
      "PIERCE": 0.2
    },
    "critChancePct": 10,
    "critMult": 1.75,
    "critArmorBypassPct": 0.1,
    "onHit": {
      "sunder": {
        "chancePct": 22,
        "powerPct": 10,
        "durationSec": 12,
        "stacksMax": 5
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      }
    }
  },
  {
    "category": "polearms",
    "name": "Lucent Warhammer",
    "quality": "Fine",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.7,
      "SLASH": 0.1,
      "PIERCE": 0.2
    },
    "critChancePct": 11,
    "critMult": 1.8,
    "critArmorBypassPct": 0.1,
    "onHit": {
      "sunder": {
        "chancePct": 22,
        "powerPct": 10,
        "durationSec": 12,
        "stacksMax": 5
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      }
    }
  },
  {
    "category": "polearms",
    "name": "Lucent Warhammer",
    "quality": "Masterwork",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.7,
      "SLASH": 0.1,
      "PIERCE": 0.2
    },
    "critChancePct": 12,
    "critMult": 1.85,
    "critArmorBypassPct": 0.1,
    "onHit": {
      "sunder": {
        "chancePct": 22,
        "powerPct": 10,
        "durationSec": 12,
        "stacksMax": 5
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      }
    }
  },
  {
    "category": "polearms",
    "name": "Naginata Guardblade",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 11,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.5,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      },
      "entangle": {
        "chancePct": 8,
        "durationSec": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Naginata Guardblade",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.5,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      },
      "entangle": {
        "chancePct": 8,
        "durationSec": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Naginata Guardblade",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.5,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      },
      "entangle": {
        "chancePct": 8,
        "durationSec": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Partisan Spear",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 10,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Partisan Spear",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Partisan Spear",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Quarterdock Trident",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 10,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      },
      "entangle": {
        "chancePct": 10,
        "durationSec": 6
      }
    }
  },
  {
    "category": "polearms",
    "name": "Quarterdock Trident",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      },
      "entangle": {
        "chancePct": 10,
        "durationSec": 6
      }
    }
  },
  {
    "category": "polearms",
    "name": "Quarterdock Trident",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      },
      "entangle": {
        "chancePct": 10,
        "durationSec": 6
      }
    }
  },
  {
    "category": "polearms",
    "name": "River-Blade",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 11,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.5,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "polearms",
    "name": "River-Blade",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.5,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "polearms",
    "name": "River-Blade",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.75,
      "PIERCE": 0.15
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.5,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sever": {
        "chancePct": 5,
        "power": 1,
        "cdSec": 12
      }
    }
  },
  {
    "category": "polearms",
    "name": "Sarissa Pike",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.08,
      "SLASH": 0.16,
      "PIERCE": 0.76
    },
    "critChancePct": 9,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Sarissa Pike",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.08,
      "SLASH": 0.16,
      "PIERCE": 0.76
    },
    "critChancePct": 10,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Sarissa Pike",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.08,
      "SLASH": 0.16,
      "PIERCE": 0.76
    },
    "critChancePct": 11,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Trident Fork",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 10,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Trident Fork",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Trident Fork",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Voulge Splitter",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Voulge Splitter",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Voulge Splitter",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.55,
      "PIERCE": 0.25
    },
    "critChancePct": 13,
    "critMult": 1.7,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.6,
        "durationSec": 8,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      }
    }
  },
  {
    "category": "polearms",
    "name": "Winding Spear",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 10,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Winding Spear",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "polearms",
    "name": "Winding Spear",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.2,
      "PIERCE": 0.7
    },
    "critChancePct": 12,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Asymmetrical Longbow",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 9,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 8,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Asymmetrical Longbow",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 10,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 8,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Asymmetrical Longbow",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 8,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Composite Recurve",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 8,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 8,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Composite Recurve",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 9,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 8,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Composite Recurve",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 10,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 8,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Greatbow",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 8,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 8,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Greatbow",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 9,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 8,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Greatbow",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.15,
      "PIERCE": 0.8
    },
    "critChancePct": 10,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 8,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Hand Crossbow",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.1,
      "PIERCE": 0.85
    },
    "critChancePct": 8,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 7,
        "power": 0.8,
        "durationSec": 5,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Hand Crossbow",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.1,
      "PIERCE": 0.85
    },
    "critChancePct": 9,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 7,
        "power": 0.8,
        "durationSec": 5,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Hand Crossbow",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.1,
      "PIERCE": 0.85
    },
    "critChancePct": 10,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 7,
        "power": 0.8,
        "durationSec": 5,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Heavy Crossbow",
    "quality": "Standard",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.1,
      "PIERCE": 0.85
    },
    "critChancePct": 10,
    "critMult": 1.8,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Heavy Crossbow",
    "quality": "Fine",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.1,
      "PIERCE": 0.85
    },
    "critChancePct": 11,
    "critMult": 1.85,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Heavy Crossbow",
    "quality": "Masterwork",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.1,
      "PIERCE": 0.85
    },
    "critChancePct": 12,
    "critMult": 1.9,
    "critArmorBypassPct": 0.08,
    "onHit": {
      "bleed": {
        "chancePct": 10,
        "power": 1,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Repeating Crossbow",
    "quality": "Standard",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.1,
      "PIERCE": 0.85
    },
    "critChancePct": 7,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 7,
        "power": 0.8,
        "durationSec": 5,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Repeating Crossbow",
    "quality": "Fine",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.1,
      "PIERCE": 0.85
    },
    "critChancePct": 8,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 7,
        "power": 0.8,
        "durationSec": 5,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "ranged",
    "name": "Repeating Crossbow",
    "quality": "Masterwork",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.1,
      "PIERCE": 0.85
    },
    "critChancePct": 9,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 7,
        "power": 0.8,
        "durationSec": 5,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "chains",
    "name": "Chain Morning Star",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.75,
      "SLASH": 0.15,
      "PIERCE": 0.1
    },
    "critChancePct": 11,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "chains",
    "name": "Chain Morning Star",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.75,
      "SLASH": 0.15,
      "PIERCE": 0.1
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "chains",
    "name": "Chain Morning Star",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.75,
      "SLASH": 0.15,
      "PIERCE": 0.1
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "chains",
    "name": "Duo Chain Flail",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.75,
      "SLASH": 0.15,
      "PIERCE": 0.1
    },
    "critChancePct": 11,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 10
      },
      "entangle": {
        "chancePct": 14,
        "durationSec": 6
      }
    }
  },
  {
    "category": "chains",
    "name": "Duo Chain Flail",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.75,
      "SLASH": 0.15,
      "PIERCE": 0.1
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 10
      },
      "entangle": {
        "chancePct": 14,
        "durationSec": 6
      }
    }
  },
  {
    "category": "chains",
    "name": "Duo Chain Flail",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.75,
      "SLASH": 0.15,
      "PIERCE": 0.1
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 10
      },
      "entangle": {
        "chancePct": 14,
        "durationSec": 6
      }
    }
  },
  {
    "category": "chains",
    "name": "Meteor Chain",
    "quality": "Standard",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.75,
      "SLASH": 0.15,
      "PIERCE": 0.1
    },
    "critChancePct": 11,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "chains",
    "name": "Meteor Chain",
    "quality": "Fine",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.75,
      "SLASH": 0.15,
      "PIERCE": 0.1
    },
    "critChancePct": 12,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "chains",
    "name": "Meteor Chain",
    "quality": "Masterwork",
    "ap": 0.3,
    "dmgMix": {
      "BLUNT": 0.75,
      "SLASH": 0.15,
      "PIERCE": 0.1
    },
    "critChancePct": 13,
    "critMult": 1.65,
    "onHit": {
      "bleed": {
        "chancePct": 16,
        "power": 1.4,
        "durationSec": 7,
        "stacksMax": 3
      },
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "whips",
    "name": "Punisher Lash",
    "quality": "Standard",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.9,
      "PIERCE": 0.05
    },
    "critChancePct": 10,
    "critMult": 1.45,
    "onHit": {
      "bleed": {
        "chancePct": 22,
        "power": 1.1,
        "durationSec": 8,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 10,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "whips",
    "name": "Punisher Lash",
    "quality": "Fine",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.9,
      "PIERCE": 0.05
    },
    "critChancePct": 11,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 22,
        "power": 1.1,
        "durationSec": 8,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 10,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "whips",
    "name": "Punisher Lash",
    "quality": "Masterwork",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.9,
      "PIERCE": 0.05
    },
    "critChancePct": 12,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 22,
        "power": 1.1,
        "durationSec": 8,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 10,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "whips",
    "name": "Scorpion Whip",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.8,
      "PIERCE": 0.1
    },
    "critChancePct": 11,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 26,
        "power": 1.3,
        "durationSec": 8,
        "stacksMax": 5
      },
      "disarm": {
        "chancePct": 12,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "whips",
    "name": "Scorpion Whip",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.8,
      "PIERCE": 0.1
    },
    "critChancePct": 12,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 26,
        "power": 1.3,
        "durationSec": 8,
        "stacksMax": 5
      },
      "disarm": {
        "chancePct": 12,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "whips",
    "name": "Scorpion Whip",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.1,
      "SLASH": 0.8,
      "PIERCE": 0.1
    },
    "critChancePct": 13,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 26,
        "power": 1.3,
        "durationSec": 8,
        "stacksMax": 5
      },
      "disarm": {
        "chancePct": 12,
        "power": 1,
        "cdSec": 10
      }
    }
  },
  {
    "category": "whips",
    "name": "Thornvine Lash",
    "quality": "Standard",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.9,
      "PIERCE": 0.05
    },
    "critChancePct": 10,
    "critMult": 1.45,
    "onHit": {
      "bleed": {
        "chancePct": 24,
        "power": 1.2,
        "durationSec": 8,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 12,
        "power": 0.9,
        "cdSec": 8
      },
      "entangle": {
        "chancePct": 20,
        "durationSec": 6
      }
    }
  },
  {
    "category": "whips",
    "name": "Thornvine Lash",
    "quality": "Fine",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.9,
      "PIERCE": 0.05
    },
    "critChancePct": 11,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 24,
        "power": 1.2,
        "durationSec": 8,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 12,
        "power": 0.9,
        "cdSec": 8
      },
      "entangle": {
        "chancePct": 20,
        "durationSec": 6
      }
    }
  },
  {
    "category": "whips",
    "name": "Thornvine Lash",
    "quality": "Masterwork",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.05,
      "SLASH": 0.9,
      "PIERCE": 0.05
    },
    "critChancePct": 12,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 24,
        "power": 1.2,
        "durationSec": 8,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 12,
        "power": 0.9,
        "cdSec": 8
      },
      "entangle": {
        "chancePct": 20,
        "durationSec": 6
      }
    }
  },
  {
    "category": "staves",
    "name": "Ferruled Waystaff",
    "quality": "Standard",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 6,
    "critMult": 1.45,
    "onHit": {
      "sunder": {
        "chancePct": 9,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      },
      "daze": {
        "chancePct": 10,
        "durationSec": 2
      }
    }
  },
  {
    "category": "staves",
    "name": "Ferruled Waystaff",
    "quality": "Fine",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 7,
    "critMult": 1.5,
    "onHit": {
      "sunder": {
        "chancePct": 9,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      },
      "daze": {
        "chancePct": 10,
        "durationSec": 2
      }
    }
  },
  {
    "category": "staves",
    "name": "Ferruled Waystaff",
    "quality": "Masterwork",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 8,
    "critMult": 1.55,
    "onHit": {
      "sunder": {
        "chancePct": 9,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      },
      "daze": {
        "chancePct": 10,
        "durationSec": 2
      }
    }
  },
  {
    "category": "staves",
    "name": "Ironwood Staff",
    "quality": "Standard",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 6,
    "critMult": 1.45,
    "onHit": {
      "sunder": {
        "chancePct": 8,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "staves",
    "name": "Ironwood Staff",
    "quality": "Fine",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 7,
    "critMult": 1.5,
    "onHit": {
      "sunder": {
        "chancePct": 8,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "staves",
    "name": "Ironwood Staff",
    "quality": "Masterwork",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 8,
    "critMult": 1.55,
    "onHit": {
      "sunder": {
        "chancePct": 8,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "staves",
    "name": "Quarterstaff",
    "quality": "Standard",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 6,
    "critMult": 1.45,
    "onHit": {
      "sunder": {
        "chancePct": 8,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "staves",
    "name": "Quarterstaff",
    "quality": "Fine",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 7,
    "critMult": 1.5,
    "onHit": {
      "sunder": {
        "chancePct": 8,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "staves",
    "name": "Quarterstaff",
    "quality": "Masterwork",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 8,
    "critMult": 1.55,
    "onHit": {
      "sunder": {
        "chancePct": 8,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "staves",
    "name": "Reed Quarterstaff",
    "quality": "Standard",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 6,
    "critMult": 1.45,
    "onHit": {
      "sunder": {
        "chancePct": 7,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      },
      "entangle": {
        "chancePct": 10,
        "durationSec": 5
      }
    }
  },
  {
    "category": "staves",
    "name": "Reed Quarterstaff",
    "quality": "Fine",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 7,
    "critMult": 1.5,
    "onHit": {
      "sunder": {
        "chancePct": 7,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      },
      "entangle": {
        "chancePct": 10,
        "durationSec": 5
      }
    }
  },
  {
    "category": "staves",
    "name": "Reed Quarterstaff",
    "quality": "Masterwork",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 8,
    "critMult": 1.55,
    "onHit": {
      "sunder": {
        "chancePct": 7,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      },
      "entangle": {
        "chancePct": 10,
        "durationSec": 5
      }
    }
  },
  {
    "category": "staves",
    "name": "Short Staff",
    "quality": "Standard",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 6,
    "critMult": 1.45,
    "onHit": {
      "sunder": {
        "chancePct": 8,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "staves",
    "name": "Short Staff",
    "quality": "Fine",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 7,
    "critMult": 1.5,
    "onHit": {
      "sunder": {
        "chancePct": 8,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "staves",
    "name": "Short Staff",
    "quality": "Masterwork",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.85,
      "SLASH": 0.1,
      "PIERCE": 0.05
    },
    "critChancePct": 8,
    "critMult": 1.55,
    "onHit": {
      "sunder": {
        "chancePct": 8,
        "powerPct": 5,
        "durationSec": 8,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      }
    }
  },
  {
    "category": "staves",
    "name": "Temple Ironstaff",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.88,
      "SLASH": 0.07,
      "PIERCE": 0.05
    },
    "critChancePct": 7,
    "critMult": 1.45,
    "onHit": {
      "sunder": {
        "chancePct": 10,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      },
      "daze": {
        "chancePct": 12,
        "durationSec": 2
      }
    }
  },
  {
    "category": "staves",
    "name": "Temple Ironstaff",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.88,
      "SLASH": 0.07,
      "PIERCE": 0.05
    },
    "critChancePct": 8,
    "critMult": 1.5,
    "onHit": {
      "sunder": {
        "chancePct": 10,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      },
      "daze": {
        "chancePct": 12,
        "durationSec": 2
      }
    }
  },
  {
    "category": "staves",
    "name": "Temple Ironstaff",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.88,
      "SLASH": 0.07,
      "PIERCE": 0.05
    },
    "critChancePct": 9,
    "critMult": 1.55,
    "onHit": {
      "sunder": {
        "chancePct": 10,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 8
      },
      "daze": {
        "chancePct": 12,
        "durationSec": 2
      }
    }
  },
  {
    "category": "martial",
    "name": "Emei Rods",
    "quality": "Standard",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.3,
      "PIERCE": 0.5
    },
    "critChancePct": 11,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "martial",
    "name": "Emei Rods",
    "quality": "Fine",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.3,
      "PIERCE": 0.5
    },
    "critChancePct": 12,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "martial",
    "name": "Emei Rods",
    "quality": "Masterwork",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.3,
      "PIERCE": 0.5
    },
    "critChancePct": 13,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 14,
        "power": 1,
        "durationSec": 6,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "martial",
    "name": "Knuckle Gauntlet",
    "quality": "Standard",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.7,
      "SLASH": 0.25,
      "PIERCE": 0.05
    },
    "critChancePct": 9,
    "critMult": 1.5,
    "onHit": {
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "martial",
    "name": "Knuckle Gauntlet",
    "quality": "Fine",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.7,
      "SLASH": 0.25,
      "PIERCE": 0.05
    },
    "critChancePct": 10,
    "critMult": 1.55,
    "onHit": {
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "martial",
    "name": "Knuckle Gauntlet",
    "quality": "Masterwork",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.7,
      "SLASH": 0.25,
      "PIERCE": 0.05
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "disarm": {
        "chancePct": 8,
        "power": 0.8,
        "cdSec": 8
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "martial",
    "name": "Tiger Claws",
    "quality": "Standard",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.75,
      "PIERCE": 0.05
    },
    "critChancePct": 12,
    "critMult": 1.5,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.1,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "martial",
    "name": "Tiger Claws",
    "quality": "Fine",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.75,
      "PIERCE": 0.05
    },
    "critChancePct": 13,
    "critMult": 1.55,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.1,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "martial",
    "name": "Tiger Claws",
    "quality": "Masterwork",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.2,
      "SLASH": 0.75,
      "PIERCE": 0.05
    },
    "critChancePct": 14,
    "critMult": 1.6,
    "onHit": {
      "bleed": {
        "chancePct": 18,
        "power": 1.1,
        "durationSec": 7,
        "stacksMax": 3
      }
    }
  },
  {
    "category": "martial",
    "name": "Tonfa Pair",
    "quality": "Standard",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.55,
      "SLASH": 0.35,
      "PIERCE": 0.1
    },
    "critChancePct": 9,
    "critMult": 1.5,
    "onHit": {
      "disarm": {
        "chancePct": 12,
        "power": 1,
        "cdSec": 8
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "martial",
    "name": "Tonfa Pair",
    "quality": "Fine",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.55,
      "SLASH": 0.35,
      "PIERCE": 0.1
    },
    "critChancePct": 10,
    "critMult": 1.55,
    "onHit": {
      "disarm": {
        "chancePct": 12,
        "power": 1,
        "cdSec": 8
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "martial",
    "name": "Tonfa Pair",
    "quality": "Masterwork",
    "ap": 0.12,
    "dmgMix": {
      "BLUNT": 0.55,
      "SLASH": 0.35,
      "PIERCE": 0.1
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "disarm": {
        "chancePct": 12,
        "power": 1,
        "cdSec": 8
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "martial",
    "name": "Twin Sai",
    "quality": "Standard",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.4,
      "SLASH": 0.5,
      "PIERCE": 0.1
    },
    "critChancePct": 9,
    "critMult": 1.5,
    "onHit": {
      "disarm": {
        "chancePct": 12,
        "power": 1,
        "cdSec": 8
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "martial",
    "name": "Twin Sai",
    "quality": "Fine",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.4,
      "SLASH": 0.5,
      "PIERCE": 0.1
    },
    "critChancePct": 10,
    "critMult": 1.55,
    "onHit": {
      "disarm": {
        "chancePct": 12,
        "power": 1,
        "cdSec": 8
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "martial",
    "name": "Twin Sai",
    "quality": "Masterwork",
    "ap": 0.06,
    "dmgMix": {
      "BLUNT": 0.4,
      "SLASH": 0.5,
      "PIERCE": 0.1
    },
    "critChancePct": 11,
    "critMult": 1.6,
    "onHit": {
      "disarm": {
        "chancePct": 12,
        "power": 1,
        "cdSec": 8
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      }
    }
  },
  {
    "category": "maces",
    "name": "Estuary Pick",
    "quality": "Standard",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.55,
      "SLASH": 0.05,
      "PIERCE": 0.4
    },
    "critChancePct": 9,
    "critMult": 1.6,
    "onHit": {
      "sunder": {
        "chancePct": 24,
        "powerPct": 11,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 6,
        "power": 0.8,
        "cdSec": 10
      },
      "rend": {
        "chancePct": 18,
        "powerPct": 18,
        "durationSec": 8,
        "tickSec": 2
      }
    }
  },
  {
    "category": "maces",
    "name": "Estuary Pick",
    "quality": "Fine",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.55,
      "SLASH": 0.05,
      "PIERCE": 0.4
    },
    "critChancePct": 10,
    "critMult": 1.65,
    "onHit": {
      "sunder": {
        "chancePct": 24,
        "powerPct": 11,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 6,
        "power": 0.8,
        "cdSec": 10
      },
      "rend": {
        "chancePct": 18,
        "powerPct": 18,
        "durationSec": 8,
        "tickSec": 2
      }
    }
  },
  {
    "category": "maces",
    "name": "Estuary Pick",
    "quality": "Masterwork",
    "ap": 0.52,
    "dmgMix": {
      "BLUNT": 0.55,
      "SLASH": 0.05,
      "PIERCE": 0.4
    },
    "critChancePct": 11,
    "critMult": 1.7,
    "onHit": {
      "sunder": {
        "chancePct": 24,
        "powerPct": 11,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 10,
        "power": 1.1,
        "durationSec": 6,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 6,
        "power": 0.8,
        "cdSec": 10
      },
      "rend": {
        "chancePct": 18,
        "powerPct": 18,
        "durationSec": 8,
        "tickSec": 2
      }
    }
  },
  {
    "category": "maces",
    "name": "Fang of the Star",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.8,
      "SLASH": 0.1,
      "PIERCE": 0.1
    },
    "critChancePct": 9,
    "critMult": 1.6,
    "onHit": {
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 14,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      },
      "lunarBrand": {
        "chancePct": 20,
        "powerPct": 15,
        "durationSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Fang of the Star",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.8,
      "SLASH": 0.1,
      "PIERCE": 0.1
    },
    "critChancePct": 10,
    "critMult": 1.65,
    "onHit": {
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 14,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      },
      "lunarBrand": {
        "chancePct": 20,
        "powerPct": 15,
        "durationSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Fang of the Star",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.8,
      "SLASH": 0.1,
      "PIERCE": 0.1
    },
    "critChancePct": 11,
    "critMult": 1.7,
    "onHit": {
      "sunder": {
        "chancePct": 16,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 14,
        "power": 1.3,
        "durationSec": 7,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      },
      "lunarBrand": {
        "chancePct": 20,
        "powerPct": 15,
        "durationSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Flanged Mace",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.8,
      "SLASH": 0.1,
      "PIERCE": 0.1
    },
    "critChancePct": 9,
    "critMult": 1.6,
    "onHit": {
      "sunder": {
        "chancePct": 18,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Flanged Mace",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.8,
      "SLASH": 0.1,
      "PIERCE": 0.1
    },
    "critChancePct": 10,
    "critMult": 1.65,
    "onHit": {
      "sunder": {
        "chancePct": 18,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Flanged Mace",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.8,
      "SLASH": 0.1,
      "PIERCE": 0.1
    },
    "critChancePct": 11,
    "critMult": 1.7,
    "onHit": {
      "sunder": {
        "chancePct": 18,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Iron-Studded Great Club",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.9,
      "SLASH": 0.05,
      "PIERCE": 0.05
    },
    "critChancePct": 8,
    "critMult": 1.7,
    "onHit": {
      "sunder": {
        "chancePct": 20,
        "powerPct": 9,
        "durationSec": 12,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Iron-Studded Great Club",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.9,
      "SLASH": 0.05,
      "PIERCE": 0.05
    },
    "critChancePct": 9,
    "critMult": 1.75,
    "onHit": {
      "sunder": {
        "chancePct": 20,
        "powerPct": 9,
        "durationSec": 12,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Iron-Studded Great Club",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.9,
      "SLASH": 0.05,
      "PIERCE": 0.05
    },
    "critChancePct": 10,
    "critMult": 1.8,
    "onHit": {
      "sunder": {
        "chancePct": 20,
        "powerPct": 9,
        "durationSec": 12,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Oaken Maul",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.9,
      "SLASH": 0.05,
      "PIERCE": 0.05
    },
    "critChancePct": 8,
    "critMult": 1.7,
    "onHit": {
      "sunder": {
        "chancePct": 24,
        "powerPct": 10,
        "durationSec": 12,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 9
      },
      "daze": {
        "chancePct": 20,
        "durationSec": 3
      }
    }
  },
  {
    "category": "maces",
    "name": "Oaken Maul",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.9,
      "SLASH": 0.05,
      "PIERCE": 0.05
    },
    "critChancePct": 9,
    "critMult": 1.75,
    "onHit": {
      "sunder": {
        "chancePct": 24,
        "powerPct": 10,
        "durationSec": 12,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 9
      },
      "daze": {
        "chancePct": 20,
        "durationSec": 3
      }
    }
  },
  {
    "category": "maces",
    "name": "Oaken Maul",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.9,
      "SLASH": 0.05,
      "PIERCE": 0.05
    },
    "critChancePct": 10,
    "critMult": 1.8,
    "onHit": {
      "sunder": {
        "chancePct": 24,
        "powerPct": 10,
        "durationSec": 12,
        "stacksMax": 4
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 9
      },
      "daze": {
        "chancePct": 20,
        "durationSec": 3
      }
    }
  },
  {
    "category": "maces",
    "name": "Spiked Morning Star",
    "quality": "Standard",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.8,
      "SLASH": 0.1,
      "PIERCE": 0.1
    },
    "critChancePct": 9,
    "critMult": 1.6,
    "onHit": {
      "sunder": {
        "chancePct": 18,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Spiked Morning Star",
    "quality": "Fine",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.8,
      "SLASH": 0.1,
      "PIERCE": 0.1
    },
    "critChancePct": 10,
    "critMult": 1.65,
    "onHit": {
      "sunder": {
        "chancePct": 18,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Spiked Morning Star",
    "quality": "Masterwork",
    "ap": 0.42,
    "dmgMix": {
      "BLUNT": 0.8,
      "SLASH": 0.1,
      "PIERCE": 0.1
    },
    "critChancePct": 11,
    "critMult": 1.7,
    "onHit": {
      "sunder": {
        "chancePct": 18,
        "powerPct": 8,
        "durationSec": 12,
        "stacksMax": 4
      },
      "bleed": {
        "chancePct": 12,
        "power": 1.2,
        "durationSec": 7,
        "stacksMax": 3
      },
      "disarm": {
        "chancePct": 8,
        "power": 0.9,
        "cdSec": 10
      }
    }
  },
  {
    "category": "maces",
    "name": "Studded Cudgel",
    "quality": "Standard",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.95,
      "SLASH": 0.05,
      "PIERCE": 0
    },
    "critChancePct": 9,
    "critMult": 1.6,
    "onHit": {
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 9
      },
      "daze": {
        "chancePct": 16,
        "durationSec": 2
      }
    }
  },
  {
    "category": "maces",
    "name": "Studded Cudgel",
    "quality": "Fine",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.95,
      "SLASH": 0.05,
      "PIERCE": 0
    },
    "critChancePct": 10,
    "critMult": 1.65,
    "onHit": {
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 9
      },
      "daze": {
        "chancePct": 16,
        "durationSec": 2
      }
    }
  },
  {
    "category": "maces",
    "name": "Studded Cudgel",
    "quality": "Masterwork",
    "ap": 0.2,
    "dmgMix": {
      "BLUNT": 0.95,
      "SLASH": 0.05,
      "PIERCE": 0
    },
    "critChancePct": 11,
    "critMult": 1.7,
    "onHit": {
      "sunder": {
        "chancePct": 12,
        "powerPct": 6,
        "durationSec": 10,
        "stacksMax": 3
      },
      "bleed": {
        "chancePct": 10,
        "power": 0.9,
        "durationSec": 6,
        "stacksMax": 2
      },
      "disarm": {
        "chancePct": 10,
        "power": 1,
        "cdSec": 9
      },
      "daze": {
        "chancePct": 16,
        "durationSec": 2
      }
    }
  }
];

export const WEAPON_UPGRADE_RULES = {
  "id": "wur:all-archetypes",
  "note": "Rules apply to all weapons in ARMORY by category+name match. Engine should materialize per-weapon upgrades from these rules.",
  "apMap": {
    "Low": 0.06,
    "Low-Medium": 0.12,
    "Medium": 0.2,
    "Medium-High": 0.3,
    "High": 0.42,
    "Very High": 0.52
  },
  "qualityMods": {
    "Standard": {
      "critChancePct_delta": 0,
      "critMult_delta": 0
    },
    "Fine": {
      "critChancePct_delta": 1,
      "critMult_delta": 0.05
    },
    "Masterwork": {
      "critChancePct_delta": 2,
      "critMult_delta": 0.1
    }
  },
  "archetypes": [
    {
      "match": {
        "category": "swords",
        "names": [
          "Arming Sword",
          "Short Guardblade",
          "Eastern Straightblade",
          "Companion Blade",
          "Bronze Leafblade",
          "Xiphos Leaf Sword",
          "City Gentle’s Cane"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.1,
          "SLASH": 0.6,
          "PIERCE": 0.3
        },
        "critChancePct": 9,
        "critMult": 1.55,
        "critArmorBypassPct": 0,
        "hazardTags": [
          "edge",
          "point"
        ],
        "controlTags": [
          "pommel"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 12,
            "power": 1.2,
            "durationSec": 7,
            "stacksMax": 3
          }
        }
      },
      "overrides": {
        "Short Guardblade": {
          "critChancePct": 10,
          "dmgMix": {
            "BLUNT": 0.1,
            "SLASH": 0.65,
            "PIERCE": 0.25
          }
        },
        "Eastern Straightblade": {
          "critChancePct": 11,
          "dmgMix": {
            "BLUNT": 0.05,
            "SLASH": 0.55,
            "PIERCE": 0.4
          }
        },
        "Companion Blade": {
          "critChancePct": 11,
          "dmgMix": {
            "BLUNT": 0.05,
            "SLASH": 0.6,
            "PIERCE": 0.35
          }
        },
        "Bronze Leafblade": {
          "dmgMix": {
            "BLUNT": 0.12,
            "SLASH": 0.48,
            "PIERCE": 0.4
          }
        },
        "Xiphos Leaf Sword": {
          "critChancePct": 10,
          "dmgMix": {
            "BLUNT": 0.08,
            "SLASH": 0.52,
            "PIERCE": 0.4
          }
        },
        "City Gentle’s Cane": {
          "dmgMix": {
            "BLUNT": 0.3,
            "SLASH": 0.4,
            "PIERCE": 0.3
          },
          "onHit": {
            "daze": {
              "chancePct": 12,
              "durationSec": 2
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "swords",
        "names": [
          "Falchion",
          "Steppe Sabre",
          "Blade of the Tide",
          "Kopis Cutter",
          "Shashka Officer Saber",
          "Flanged Sabre"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.05,
          "SLASH": 0.8,
          "PIERCE": 0.15
        },
        "critChancePct": 12,
        "critMult": 1.5,
        "hazardTags": [
          "edge"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 18,
            "power": 1.6,
            "durationSec": 8,
            "stacksMax": 4
          },
          "sever": {
            "chancePct": 5,
            "power": 1,
            "cdSec": 12
          }
        }
      },
      "overrides": {
        "Blade of the Tide": {
          "critChancePct": 13,
          "apOverride": "Medium-High"
        },
        "Steppe Sabre": {
          "critChancePct": 13
        },
        "Kopis Cutter": {
          "dmgMix": {
            "BLUNT": 0.05,
            "SLASH": 0.75,
            "PIERCE": 0.2
          },
          "onHit": {
            "rend": {
              "chancePct": 12,
              "powerPct": 16,
              "durationSec": 8
            }
          }
        },
        "Shashka Officer Saber": {
          "critChancePct": 14,
          "dmgMix": {
            "BLUNT": 0.04,
            "SLASH": 0.66,
            "PIERCE": 0.3
          },
          "onHit": {
            "bleed": {
              "chancePct": 20,
              "durationSec": 7
            }
          }
        },
        "Flanged Sabre": {
          "onHit": {
            "sunder": {
              "chancePct": 18,
              "powerPct": 9,
              "durationSec": 12
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "swords",
        "names": [
          "Longsword"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.1,
          "SLASH": 0.55,
          "PIERCE": 0.35
        },
        "critChancePct": 11,
        "critMult": 1.6,
        "hazardTags": [
          "edge",
          "point"
        ],
        "controlTags": [
          "pommel"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 14,
            "power": 1.3,
            "durationSec": 7,
            "stacksMax": 3
          },
          "sunder": {
            "chancePct": 8,
            "powerPct": 6,
            "durationSec": 10,
            "stacksMax": 3
          }
        }
      }
    },
    {
      "match": {
        "category": "swords",
        "names": [
          "Great Sword",
          "Two-Hand Colossus",
          "Great-Edge",
          "Tegha Broadblade",
          "Sawtooth Falx"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.15,
          "SLASH": 0.7,
          "PIERCE": 0.15
        },
        "critChancePct": 14,
        "critMult": 1.7,
        "critArmorBypassPct": 0.08,
        "hazardTags": [
          "edge"
        ],
        "controlTags": [
          "pommel"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 20,
            "power": 1.8,
            "durationSec": 9,
            "stacksMax": 4
          },
          "sunder": {
            "chancePct": 12,
            "powerPct": 7,
            "durationSec": 12,
            "stacksMax": 4
          },
          "sever": {
            "chancePct": 8,
            "power": 1.2,
            "cdSec": 14
          }
        }
      },
      "overrides": {
        "Great-Edge": {
          "onHit": {
            "sever": {
              "chancePct": 9,
              "power": 1.3,
              "cdSec": 14
            }
          }
        },
        "Two-Hand Colossus": {
          "onHit": {
            "sunder": {
              "chancePct": 14,
              "powerPct": 8,
              "durationSec": 12,
              "stacksMax": 4
            }
          }
        },
        "Tegha Broadblade": {
          "critChancePct": 13,
          "onHit": {
            "sunder": {
              "chancePct": 16,
              "powerPct": 8,
              "durationSec": 12,
              "stacksMax": 4
            }
          }
        },
        "Sawtooth Falx": {
          "dmgMix": {
            "BLUNT": 0.1,
            "SLASH": 0.75,
            "PIERCE": 0.15
          },
          "onHit": {
            "bleed": {
              "chancePct": 24,
              "power": 2,
              "durationSec": 9,
              "stacksMax": 4
            },
            "rend": {
              "chancePct": 22,
              "powerPct": 20,
              "durationSec": 10,
              "tickSec": 2
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "swords",
        "names": [
          "Dual Set: Wakizashi Companion + Tanto Sideblade"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.08,
          "SLASH": 0.62,
          "PIERCE": 0.3
        },
        "critChancePct": 13,
        "critMult": 1.55,
        "hazardTags": [
          "edge",
          "point"
        ],
        "controlTags": [
          "trap"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 18,
            "power": 1.2,
            "durationSec": 6,
            "stacksMax": 3
          },
          "daze": {
            "chancePct": 8,
            "durationSec": 2
          }
        }
      }
    },
    {
      "match": {
        "category": "daggers",
        "names": [
          "Misericorde",
          "Rondel",
          "Piercer",
          "Pesh-Kabz Tusk"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.05,
          "SLASH": 0.15,
          "PIERCE": 0.8
        },
        "critChancePct": 12,
        "critMult": 1.6,
        "critArmorBypassPct": 0.05,
        "hazardTags": [
          "point"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 12,
            "power": 1.1,
            "durationSec": 6,
            "stacksMax": 3
          }
        }
      },
      "overrides": {
        "Rondel": {
          "critChancePct": 11,
          "critArmorBypassPct": 0.06
        },
        "Piercer": {
          "critChancePct": 13,
          "critArmorBypassPct": 0.07
        },
        "Pesh-Kabz Tusk": {
          "critChancePct": 12,
          "critArmorBypassPct": 0.08
        }
      }
    },
    {
      "match": {
        "category": "daggers",
        "names": [
          "Push-Spike"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.05,
          "SLASH": 0.2,
          "PIERCE": 0.75
        },
        "critChancePct": 13,
        "critMult": 1.6,
        "critArmorBypassPct": 0.06,
        "hazardTags": [
          "point"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 12,
            "power": 1.2,
            "durationSec": 6,
            "stacksMax": 3
          },
          "sunder": {
            "chancePct": 6,
            "powerPct": 5,
            "durationSec": 8,
            "stacksMax": 3
          }
        }
      }
    },
    {
      "match": {
        "category": "daggers",
        "names": [
          "Curved Twin-Edge",
          "Wavesong Dagger",
          "Cairn Dirk",
          "Tanto Sideblade",
          "Kris Wave Dagger",
          "Karambit Claw"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.05,
          "SLASH": 0.7,
          "PIERCE": 0.25
        },
        "critChancePct": 11,
        "critMult": 1.5,
        "hazardTags": [
          "edge",
          "point"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 16,
            "power": 1.3,
            "durationSec": 7,
            "stacksMax": 3
          }
        }
      },
      "overrides": {
        "Cairn Dirk": {
          "dmgMix": {
            "BLUNT": 0.1,
            "SLASH": 0.45,
            "PIERCE": 0.45
          },
          "critChancePct": 12
        },
        "Tanto Sideblade": {
          "critChancePct": 12,
          "onHit": {
            "bleed": {
              "chancePct": 18,
              "power": 1.2,
              "durationSec": 6,
              "stacksMax": 3
            }
          }
        },
        "Kris Wave Dagger": {
          "onHit": {
            "bleed": {
              "chancePct": 20,
              "power": 1.3,
              "durationSec": 8,
              "stacksMax": 3
            }
          }
        },
        "Karambit Claw": {
          "dmgMix": {
            "BLUNT": 0.1,
            "SLASH": 0.65,
            "PIERCE": 0.25
          },
          "onHit": {
            "entangle": {
              "chancePct": 12,
              "durationSec": 5
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "axes",
        "names": [
          "Bearded Axe",
          "Crescent Battleaxe"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.1,
          "SLASH": 0.75,
          "PIERCE": 0.15
        },
        "critChancePct": 12,
        "critMult": 1.5,
        "hazardTags": [
          "edge"
        ],
        "controlTags": [
          "hook"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 18,
            "power": 1.6,
            "durationSec": 8,
            "stacksMax": 4
          },
          "sever": {
            "chancePct": 5,
            "power": 1,
            "cdSec": 12
          }
        }
      }
    },
    {
      "match": {
        "category": "axes",
        "names": [
          "Long-Haft War Axe",
          "Long-Blade Axe",
          "Hooked War Axe",
          "Skeggox Hewing Axe",
          "Tabargan Twinblade"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.2,
          "SLASH": 0.65,
          "PIERCE": 0.15
        },
        "critChancePct": 12,
        "critMult": 1.6,
        "hazardTags": [
          "edge"
        ],
        "controlTags": [
          "hook"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 20,
            "power": 1.7,
            "durationSec": 8,
            "stacksMax": 4
          },
          "sunder": {
            "chancePct": 14,
            "powerPct": 7,
            "durationSec": 12,
            "stacksMax": 4
          },
          "sever": {
            "chancePct": 6,
            "power": 1.1,
            "cdSec": 12
          }
        }
      },
      "overrides": {
        "Hooked War Axe": {
          "onHit": {
            "disarm": {
              "chancePct": 8,
              "power": 1,
              "cdSec": 10
            }
          }
        },
        "Skeggox Hewing Axe": {
          "onHit": {
            "bleed": {
              "chancePct": 22,
              "power": 1.8,
              "durationSec": 8,
              "stacksMax": 4
            },
            "sunder": {
              "chancePct": 16,
              "powerPct": 8,
              "durationSec": 12,
              "stacksMax": 4
            }
          }
        },
        "Tabargan Twinblade": {
          "onHit": {
            "bleed": {
              "chancePct": 22,
              "power": 1.8,
              "durationSec": 8,
              "stacksMax": 4
            },
            "disarm": {
              "chancePct": 10,
              "power": 1,
              "cdSec": 9
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "axes",
        "names": [
          "Moon Cleaver"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.18,
          "SLASH": 0.67,
          "PIERCE": 0.15
        },
        "critChancePct": 14,
        "critMult": 1.7,
        "hazardTags": [
          "edge"
        ],
        "controlTags": [
          "hook"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 24,
            "power": 1.9,
            "durationSec": 9,
            "stacksMax": 4
          },
          "sunder": {
            "chancePct": 14,
            "powerPct": 8,
            "durationSec": 12,
            "stacksMax": 4
          },
          "lunarBrand": {
            "chancePct": 12,
            "powerPct": 12,
            "durationSec": 10
          }
        }
      }
    },
    {
      "match": {
        "category": "axes",
        "names": [
          "Throwing Axe"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.1,
          "SLASH": 0.8,
          "PIERCE": 0.1
        },
        "critChancePct": 10,
        "critMult": 1.5,
        "hazardTags": [
          "edge"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 12,
            "power": 1.2,
            "durationSec": 6,
            "stacksMax": 3
          }
        }
      }
    },
    {
      "match": {
        "category": "polearms",
        "names": [
          "Partisan Spear",
          "Winding Spear",
          "Trident Fork",
          "Sarissa Pike",
          "Quarterdock Trident"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.1,
          "SLASH": 0.2,
          "PIERCE": 0.7
        },
        "critChancePct": 10,
        "critMult": 1.55,
        "hazardTags": [
          "point"
        ],
        "controlTags": [
          "hook"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 10,
            "power": 1.1,
            "durationSec": 6,
            "stacksMax": 2
          }
        }
      },
      "overrides": {
        "Trident Fork": {
          "onHit": {
            "bleed": {
              "chancePct": 12,
              "power": 1.2,
              "durationSec": 6,
              "stacksMax": 2
            }
          }
        },
        "Sarissa Pike": {
          "critChancePct": 9,
          "dmgMix": {
            "BLUNT": 0.08,
            "SLASH": 0.16,
            "PIERCE": 0.76
          }
        },
        "Quarterdock Trident": {
          "onHit": {
            "bleed": {
              "chancePct": 14,
              "power": 1.1,
              "durationSec": 6,
              "stacksMax": 2
            },
            "entangle": {
              "chancePct": 10,
              "durationSec": 6
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "polearms",
        "names": [
          "Glaive",
          "River-Blade",
          "Naginata Guardblade"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.1,
          "SLASH": 0.75,
          "PIERCE": 0.15
        },
        "critChancePct": 11,
        "critMult": 1.55,
        "hazardTags": [
          "edge"
        ],
        "controlTags": [
          "hook"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 16,
            "power": 1.5,
            "durationSec": 7,
            "stacksMax": 3
          },
          "sever": {
            "chancePct": 5,
            "power": 1,
            "cdSec": 12
          }
        }
      },
      "overrides": {
        "Naginata Guardblade": {
          "onHit": {
            "bleed": {
              "chancePct": 18,
              "power": 1.5,
              "durationSec": 7,
              "stacksMax": 3
            },
            "entangle": {
              "chancePct": 8,
              "durationSec": 4
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "polearms",
        "names": [
          "Halberd",
          "Axe-Knife Polearm",
          "Guisarme Hook",
          "Voulge Splitter"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.2,
          "SLASH": 0.55,
          "PIERCE": 0.25
        },
        "critChancePct": 11,
        "critMult": 1.6,
        "hazardTags": [
          "edge",
          "point"
        ],
        "controlTags": [
          "hook"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 16,
            "power": 1.4,
            "durationSec": 7,
            "stacksMax": 3
          },
          "sunder": {
            "chancePct": 14,
            "powerPct": 7,
            "durationSec": 12,
            "stacksMax": 4
          }
        }
      },
      "overrides": {
        "Guisarme Hook": {
          "onHit": {
            "bleed": {
              "chancePct": 18,
              "power": 1.4,
              "durationSec": 7,
              "stacksMax": 3
            },
            "sunder": {
              "chancePct": 16,
              "powerPct": 7,
              "durationSec": 12,
              "stacksMax": 4
            },
            "entangle": {
              "chancePct": 12,
              "durationSec": 5
            }
          }
        },
        "Voulge Splitter": {
          "onHit": {
            "bleed": {
              "chancePct": 18,
              "power": 1.6,
              "durationSec": 8,
              "stacksMax": 3
            },
            "sunder": {
              "chancePct": 16,
              "powerPct": 8,
              "durationSec": 12,
              "stacksMax": 4
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "polearms",
        "names": [
          "Beak-Hammer",
          "Lucent Warhammer"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.7,
          "SLASH": 0.1,
          "PIERCE": 0.2
        },
        "critChancePct": 10,
        "critMult": 1.75,
        "critArmorBypassPct": 0.1,
        "hazardTags": [
          "spike"
        ],
        "controlTags": [
          "beak"
        ],
        "onHit": {
          "sunder": {
            "chancePct": 22,
            "powerPct": 10,
            "durationSec": 12,
            "stacksMax": 5
          },
          "disarm": {
            "chancePct": 10,
            "power": 1,
            "cdSec": 8
          }
        }
      }
    },
    {
      "match": {
        "category": "ranged",
        "names": [
          "Greatbow",
          "Composite Recurve",
          "Asymmetrical Longbow"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.05,
          "SLASH": 0.15,
          "PIERCE": 0.8
        },
        "critChancePct": 8,
        "critMult": 1.5,
        "hazardTags": [
          "point"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 8,
            "power": 0.9,
            "durationSec": 6,
            "stacksMax": 2
          }
        }
      },
      "overrides": {
        "Asymmetrical Longbow": {
          "critChancePct": 9
        }
      }
    },
    {
      "match": {
        "category": "ranged",
        "names": [
          "Heavy Crossbow"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.05,
          "SLASH": 0.1,
          "PIERCE": 0.85
        },
        "critChancePct": 10,
        "critMult": 1.8,
        "critArmorBypassPct": 0.08,
        "hazardTags": [
          "point"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 10,
            "power": 1,
            "durationSec": 6,
            "stacksMax": 2
          }
        }
      }
    },
    {
      "match": {
        "category": "ranged",
        "names": [
          "Hand Crossbow",
          "Repeating Crossbow"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.05,
          "SLASH": 0.1,
          "PIERCE": 0.85
        },
        "critChancePct": 8,
        "critMult": 1.55,
        "hazardTags": [
          "point"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 7,
            "power": 0.8,
            "durationSec": 5,
            "stacksMax": 2
          }
        }
      },
      "overrides": {
        "Repeating Crossbow": {
          "apOverride": "Low-Medium",
          "critChancePct": 7,
          "critMult": 1.5
        }
      }
    },
    {
      "match": {
        "category": "chains",
        "names": [
          "Chain Morning Star",
          "Meteor Chain",
          "Duo Chain Flail"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.75,
          "SLASH": 0.15,
          "PIERCE": 0.1
        },
        "critChancePct": 11,
        "critMult": 1.55,
        "hazardTags": [
          "spike"
        ],
        "controlTags": [
          "hook"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 16,
            "power": 1.4,
            "durationSec": 7,
            "stacksMax": 3
          },
          "sunder": {
            "chancePct": 12,
            "powerPct": 6,
            "durationSec": 10,
            "stacksMax": 3
          },
          "disarm": {
            "chancePct": 10,
            "power": 1,
            "cdSec": 10
          }
        }
      },
      "overrides": {
        "Duo Chain Flail": {
          "onHit": {
            "bleed": {
              "chancePct": 14,
              "power": 1.2,
              "durationSec": 7,
              "stacksMax": 3
            },
            "entangle": {
              "chancePct": 14,
              "durationSec": 6
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "whips",
        "names": [
          "Punisher Lash",
          "Thornvine Lash"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.05,
          "SLASH": 0.9,
          "PIERCE": 0.05
        },
        "critChancePct": 10,
        "critMult": 1.45,
        "hazardTags": [
          "edge"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 22,
            "power": 1.1,
            "durationSec": 8,
            "stacksMax": 4
          },
          "disarm": {
            "chancePct": 10,
            "power": 0.8,
            "cdSec": 8
          }
        }
      },
      "overrides": {
        "Thornvine Lash": {
          "hazardTags": [
            "edge",
            "thorn"
          ],
          "controlTags": [
            "hook"
          ],
          "onHit": {
            "bleed": {
              "chancePct": 24,
              "power": 1.2,
              "durationSec": 8,
              "stacksMax": 4
            },
            "disarm": {
              "chancePct": 12,
              "power": 0.9,
              "cdSec": 8
            },
            "entangle": {
              "chancePct": 20,
              "durationSec": 6
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "whips",
        "names": [
          "Scorpion Whip"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.1,
          "SLASH": 0.8,
          "PIERCE": 0.1
        },
        "critChancePct": 11,
        "critMult": 1.5,
        "hazardTags": [
          "edge",
          "spike"
        ],
        "controlTags": [
          "hook"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 26,
            "power": 1.3,
            "durationSec": 8,
            "stacksMax": 5
          },
          "disarm": {
            "chancePct": 12,
            "power": 1,
            "cdSec": 10
          }
        }
      }
    },
    {
      "match": {
        "category": "staves",
        "names": [
          "Quarterstaff",
          "Ironwood Staff",
          "Short Staff",
          "Reed Quarterstaff",
          "Ferruled Waystaff",
          "Temple Ironstaff"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.85,
          "SLASH": 0.1,
          "PIERCE": 0.05
        },
        "critChancePct": 6,
        "critMult": 1.45,
        "onHit": {
          "sunder": {
            "chancePct": 8,
            "powerPct": 5,
            "durationSec": 8,
            "stacksMax": 3
          },
          "disarm": {
            "chancePct": 8,
            "power": 0.8,
            "cdSec": 8
          }
        }
      },
      "overrides": {
        "Reed Quarterstaff": {
          "onHit": {
            "sunder": {
              "chancePct": 7,
              "powerPct": 5,
              "durationSec": 8,
              "stacksMax": 3
            },
            "disarm": {
              "chancePct": 8,
              "power": 0.8,
              "cdSec": 8
            },
            "entangle": {
              "chancePct": 10,
              "durationSec": 5
            }
          }
        },
        "Ferruled Waystaff": {
          "onHit": {
            "sunder": {
              "chancePct": 9,
              "powerPct": 6,
              "durationSec": 10,
              "stacksMax": 3
            },
            "disarm": {
              "chancePct": 10,
              "power": 1,
              "cdSec": 8
            },
            "daze": {
              "chancePct": 10,
              "durationSec": 2
            }
          }
        },
        "Temple Ironstaff": {
          "critChancePct": 7,
          "dmgMix": {
            "BLUNT": 0.88,
            "SLASH": 0.07,
            "PIERCE": 0.05
          },
          "onHit": {
            "sunder": {
              "chancePct": 10,
              "powerPct": 6,
              "durationSec": 10,
              "stacksMax": 3
            },
            "disarm": {
              "chancePct": 10,
              "power": 1,
              "cdSec": 8
            },
            "daze": {
              "chancePct": 12,
              "durationSec": 2
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "martial",
        "names": [
          "Twin Sai",
          "Tonfa Pair",
          "Knuckle Gauntlet"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.4,
          "SLASH": 0.5,
          "PIERCE": 0.1
        },
        "critChancePct": 9,
        "critMult": 1.5,
        "controlTags": [
          "hook"
        ],
        "hazardTags": [
          "edge"
        ],
        "onHit": {
          "disarm": {
            "chancePct": 12,
            "power": 1,
            "cdSec": 8
          },
          "bleed": {
            "chancePct": 10,
            "power": 0.9,
            "durationSec": 6,
            "stacksMax": 2
          }
        }
      },
      "overrides": {
        "Knuckle Gauntlet": {
          "dmgMix": {
            "BLUNT": 0.7,
            "SLASH": 0.25,
            "PIERCE": 0.05
          },
          "controlTags": [],
          "onHit": {
            "disarm": {
              "chancePct": 8,
              "power": 0.8,
              "cdSec": 8
            }
          }
        },
        "Tonfa Pair": {
          "dmgMix": {
            "BLUNT": 0.55,
            "SLASH": 0.35,
            "PIERCE": 0.1
          }
        }
      }
    },
    {
      "match": {
        "category": "martial",
        "names": [
          "Emei Rods",
          "Tiger Claws"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.2,
          "SLASH": 0.3,
          "PIERCE": 0.5
        },
        "critChancePct": 11,
        "critMult": 1.5,
        "hazardTags": [
          "point",
          "edge"
        ],
        "onHit": {
          "bleed": {
            "chancePct": 14,
            "power": 1,
            "durationSec": 6,
            "stacksMax": 3
          }
        }
      },
      "overrides": {
        "Tiger Claws": {
          "dmgMix": {
            "BLUNT": 0.2,
            "SLASH": 0.75,
            "PIERCE": 0.05
          },
          "critChancePct": 12,
          "onHit": {
            "bleed": {
              "chancePct": 18,
              "power": 1.1,
              "durationSec": 7,
              "stacksMax": 3
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "maces",
        "names": [
          "Spiked Morning Star",
          "Flanged Mace",
          "Estuary Pick",
          "Studded Cudgel",
          "Fang of the Star"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.8,
          "SLASH": 0.1,
          "PIERCE": 0.1
        },
        "critChancePct": 9,
        "critMult": 1.6,
        "hazardTags": [
          "spike"
        ],
        "onHit": {
          "sunder": {
            "chancePct": 18,
            "powerPct": 8,
            "durationSec": 12,
            "stacksMax": 4
          },
          "bleed": {
            "chancePct": 12,
            "power": 1.2,
            "durationSec": 7,
            "stacksMax": 3
          },
          "disarm": {
            "chancePct": 8,
            "power": 0.9,
            "cdSec": 10
          }
        }
      },
      "overrides": {
        "Estuary Pick": {
          "dmgMix": {
            "BLUNT": 0.55,
            "SLASH": 0.05,
            "PIERCE": 0.4
          },
          "hazardTags": [
            "spike",
            "point"
          ],
          "onHit": {
            "sunder": {
              "chancePct": 24,
              "powerPct": 11,
              "durationSec": 12,
              "stacksMax": 4
            },
            "bleed": {
              "chancePct": 10,
              "power": 1.1,
              "durationSec": 6,
              "stacksMax": 3
            },
            "disarm": {
              "chancePct": 6,
              "power": 0.8,
              "cdSec": 10
            },
            "rend": {
              "chancePct": 18,
              "powerPct": 18,
              "durationSec": 8,
              "tickSec": 2
            }
          }
        },
        "Studded Cudgel": {
          "dmgMix": {
            "BLUNT": 0.95,
            "SLASH": 0.05,
            "PIERCE": 0
          },
          "hazardTags": [
            "blunt"
          ],
          "onHit": {
            "sunder": {
              "chancePct": 12,
              "powerPct": 6,
              "durationSec": 10,
              "stacksMax": 3
            },
            "bleed": {
              "chancePct": 10,
              "power": 0.9,
              "durationSec": 6,
              "stacksMax": 2
            },
            "disarm": {
              "chancePct": 10,
              "power": 1,
              "cdSec": 9
            },
            "daze": {
              "chancePct": 16,
              "durationSec": 2
            }
          }
        },
        "Fang of the Star": {
          "hazardTags": [
            "spike",
            "arcane"
          ],
          "onHit": {
            "sunder": {
              "chancePct": 16,
              "powerPct": 8,
              "durationSec": 12,
              "stacksMax": 4
            },
            "bleed": {
              "chancePct": 14,
              "power": 1.3,
              "durationSec": 7,
              "stacksMax": 3
            },
            "disarm": {
              "chancePct": 8,
              "power": 0.9,
              "cdSec": 10
            },
            "lunarBrand": {
              "chancePct": 20,
              "powerPct": 15,
              "durationSec": 10
            }
          }
        }
      }
    },
    {
      "match": {
        "category": "maces",
        "names": [
          "Iron-Studded Great Club",
          "Oaken Maul"
        ]
      },
      "base": {
        "apFromData": true,
        "dmgMix": {
          "BLUNT": 0.9,
          "SLASH": 0.05,
          "PIERCE": 0.05
        },
        "critChancePct": 8,
        "critMult": 1.7,
        "hazardTags": [
          "blunt"
        ],
        "onHit": {
          "sunder": {
            "chancePct": 20,
            "powerPct": 9,
            "durationSec": 12,
            "stacksMax": 4
          },
          "disarm": {
            "chancePct": 8,
            "power": 0.9,
            "cdSec": 10
          }
        }
      },
      "overrides": {
        "Oaken Maul": {
          "onHit": {
            "sunder": {
              "chancePct": 24,
              "powerPct": 10,
              "durationSec": 12,
              "stacksMax": 4
            },
            "disarm": {
              "chancePct": 10,
              "power": 1,
              "cdSec": 9
            },
            "daze": {
              "chancePct": 20,
              "durationSec": 3
            }
          }
        }
      }
    }
  ]
} as const;
