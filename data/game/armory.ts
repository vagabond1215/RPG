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
    { name: "Arming Sword", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "A straight double-edged steel blade (~75 cm) with a dark-iron cruciform guard, leather-wrapped grip over cord, and a rounded steel pommel engraved with simple sigils; balanced, serviceable, and kept bright with oil.", fightingStyle: "Balanced cut and thrust; commonly paired with shield", attackSpeed: 7, damage: 5, armorPen: "Medium", quality: "Masterwork", priceCp: 1670, priceDisplay: "16si 70cp", descriptionFull: "Masterwork Arming Sword. A straight double-edged steel blade (~75 cm) with a dark-iron cruciform guard, leather-wrapped grip over cord, and a rounded steel pommel engraved with simple sigils; balanced, serviceable, and kept bright with oil. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for balanced cut and thrust; commonly paired with shield." },
    { name: "Longsword", region: "High Kingdoms", size: "Large", hands: 2, reach: "Very Long", description: "Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust.", fightingStyle: "Two-handed leverage; sweeping slashes and strong thrusts", attackSpeed: 6, damage: 6.5, armorPen: "Medium-High", quality: "Standard", priceCp: 1545, priceDisplay: "15si 45cp", descriptionFull: "Longsword. Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for two-handed leverage; sweeping slashes and strong thrusts." },
    { name: "Longsword", region: "High Kingdoms", size: "Large", hands: 2, reach: "Very Long", description: "Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust.", fightingStyle: "Two-handed leverage; sweeping slashes and strong thrusts", attackSpeed: 6, damage: 6.5, armorPen: "Medium-High", quality: "Fine", priceCp: 2240, priceDisplay: "1g 2si 40cp", descriptionFull: "Fine Longsword. Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for two-handed leverage; sweeping slashes and strong thrusts." },
    { name: "Longsword", region: "High Kingdoms", size: "Large", hands: 2, reach: "Very Long", description: "Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust.", fightingStyle: "Two-handed leverage; sweeping slashes and strong thrusts", attackSpeed: 6, damage: 6.5, armorPen: "Medium-High", quality: "Masterwork", priceCp: 3625, priceDisplay: "1g 16si 25cp", descriptionFull: "Masterwork Longsword. Slender straight steel blade with a long ricasso and extended grip for two hands; iron crossguard with scent-stopper pommel; leather over wood core scabbard; quick in the bind yet authoritative on the thrust. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for two-handed leverage; sweeping slashes and strong thrusts." },
    { name: "Great Sword", region: "Northern Marches", size: "Very Large", hands: 2, reach: "Very Long", description: "A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks.", fightingStyle: "Power strokes, wide arcs, line-breaking presence", attackSpeed: 5.5, damage: 7, armorPen: "High", quality: "Standard", priceCp: 2250, priceDisplay: "1g 2si 50cp", descriptionFull: "Great Sword. A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks. Trusted from Northern Marches, it proves dependable steel sized for very large engagements. Favoured for power strokes, wide arcs, line-breaking presence." },
    { name: "Great Sword", region: "Northern Marches", size: "Very Large", hands: 2, reach: "Very Long", description: "A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks.", fightingStyle: "Power strokes, wide arcs, line-breaking presence", attackSpeed: 5.5, damage: 7, armorPen: "High", quality: "Fine", priceCp: 3260, priceDisplay: "1g 12si 60cp", descriptionFull: "Fine Great Sword. A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for power strokes, wide arcs, line-breaking presence." },
    { name: "Great Sword", region: "Northern Marches", size: "Very Large", hands: 2, reach: "Very Long", description: "A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks.", fightingStyle: "Power strokes, wide arcs, line-breaking presence", attackSpeed: 5.5, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 5285, priceDisplay: "2g 12si 85cp", descriptionFull: "Masterwork Great Sword. A broad, elongated battlefield blade of tempered steel, oversized crossguard and heavy wheel pommel; grip wrapped in oiled leather over cord; meant for shoulder-carry and shock charges against dense ranks. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for power strokes, wide arcs, line-breaking presence." },
    { name: "Two-Hand Colossus", region: "Borderlands", size: "Very Large", hands: 2, reach: "Very Long", description: "Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach.", fightingStyle: "Crushing cleaves and long-reach thrusts; slow recoveries", attackSpeed: 3.5, damage: 9.5, armorPen: "High", quality: "Standard", priceCp: 2150, priceDisplay: "1g 1si 50cp", descriptionFull: "Two-Hand Colossus. Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach. Trusted from Borderlands, it proves dependable steel sized for very large engagements. Favoured for crushing cleaves and long-reach thrusts; slow recoveries." },
    { name: "Two-Hand Colossus", region: "Borderlands", size: "Very Large", hands: 2, reach: "Very Long", description: "Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach.", fightingStyle: "Crushing cleaves and long-reach thrusts; slow recoveries", attackSpeed: 3.5, damage: 9.5, armorPen: "High", quality: "Fine", priceCp: 3120, priceDisplay: "1g 11si 20cp", descriptionFull: "Fine Two-Hand Colossus. Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for crushing cleaves and long-reach thrusts; slow recoveries." },
    { name: "Two-Hand Colossus", region: "Borderlands", size: "Very Large", hands: 2, reach: "Very Long", description: "Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach.", fightingStyle: "Crushing cleaves and long-reach thrusts; slow recoveries", attackSpeed: 3.5, damage: 9.5, armorPen: "High", quality: "Masterwork", priceCp: 5055, priceDisplay: "2g 10si 55cp", descriptionFull: "Masterwork Two-Hand Colossus. Massive steel blade with side lugs at the forte and a long waisted grip; iron fittings dark-blued against weather; requires measured cadence to harness its cutting mass and thrusting reach. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for crushing cleaves and long-reach thrusts; slow recoveries." },
    { name: "Falchion", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor.", fightingStyle: "Heavy slashes and choppers; excels against light armor", attackSpeed: 7, damage: 5.5, armorPen: "Medium", quality: "Standard", priceCp: 730, priceDisplay: "7si 30cp", descriptionFull: "Falchion. Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor. Trusted from High Kingdoms, it proves dependable steel sized for medium engagements. Favoured for heavy slashes and choppers; excels against light armor." },
    { name: "Falchion", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor.", fightingStyle: "Heavy slashes and choppers; excels against light armor", attackSpeed: 7, damage: 5.5, armorPen: "Medium", quality: "Fine", priceCp: 1060, priceDisplay: "10si 60cp", descriptionFull: "Fine Falchion. Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for heavy slashes and choppers; excels against light armor." },
    { name: "Falchion", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Medium", description: "Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor.", fightingStyle: "Heavy slashes and choppers; excels against light armor", attackSpeed: 7, damage: 5.5, armorPen: "Medium", quality: "Masterwork", priceCp: 1720, priceDisplay: "17si 20cp", descriptionFull: "Masterwork Falchion. Single-edged, forward-weighted steel blade with slight curve; brass or iron guard, simple leather grip; edge polished bright for chopping power against cloth, flesh, and light armor. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for heavy slashes and choppers; excels against light armor." },
    { name: "Estoc", region: "Borderlands", size: "Medium", hands: 1, reach: "Medium", description: "Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate.", fightingStyle: "Precise stabs into armor seams; binds and windings", attackSpeed: 6.5, damage: 6, armorPen: "High", quality: "Standard", priceCp: 940, priceDisplay: "9si 40cp", descriptionFull: "Estoc. Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate. Trusted from Borderlands, it proves dependable steel sized for medium engagements. Favoured for precise stabs into armor seams; binds and windings." },
    { name: "Estoc", region: "Borderlands", size: "Medium", hands: 1, reach: "Medium", description: "Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate.", fightingStyle: "Precise stabs into armor seams; binds and windings", attackSpeed: 6.5, damage: 6, armorPen: "High", quality: "Fine", priceCp: 1365, priceDisplay: "13si 65cp", descriptionFull: "Fine Estoc. Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for precise stabs into armor seams; binds and windings." },
    { name: "Estoc", region: "Borderlands", size: "Medium", hands: 1, reach: "Medium", description: "Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate.", fightingStyle: "Precise stabs into armor seams; binds and windings", attackSpeed: 6.5, damage: 6, armorPen: "High", quality: "Masterwork", priceCp: 2210, priceDisplay: "1g 2si 10cp", descriptionFull: "Masterwork Estoc. Rigid, triangular-section steel blade with minimal edge and acute point; stout iron crossguard and ring; built to survive hard binds and drive into seams of mail and plate. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for precise stabs into armor seams; binds and windings." },
    { name: "Short Guardblade", region: "Borderlands", size: "Small", hands: 1, reach: "Short", description: "Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors.", fightingStyle: "Close-in slashes and quick parries", attackSpeed: 7.5, damage: 4.5, armorPen: "Medium", quality: "Standard", priceCp: 505, priceDisplay: "5si 5cp", descriptionFull: "Short Guardblade. Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors. Trusted from Borderlands, it proves dependable steel sized for small engagements. Favoured for close-in slashes and quick parries." },
    { name: "Short Guardblade", region: "Borderlands", size: "Small", hands: 1, reach: "Short", description: "Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors.", fightingStyle: "Close-in slashes and quick parries", attackSpeed: 7.5, damage: 4.5, armorPen: "Medium", quality: "Fine", priceCp: 735, priceDisplay: "7si 35cp", descriptionFull: "Fine Short Guardblade. Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for close-in slashes and quick parries." },
    { name: "Short Guardblade", region: "Borderlands", size: "Small", hands: 1, reach: "Short", description: "Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors.", fightingStyle: "Close-in slashes and quick parries", attackSpeed: 7.5, damage: 4.5, armorPen: "Medium", quality: "Masterwork", priceCp: 1190, priceDisplay: "11si 90cp", descriptionFull: "Masterwork Short Guardblade. Compact, broad steel blade with protective side rings; wooden core grip in black leather; city-guard issue for press-fighting in alleys and tight interiors. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for close-in slashes and quick parries." },
    { name: "Steppe Sabre", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion.", fightingStyle: "Mounted draw-cuts and fluid passing strikes", attackSpeed: 6.8, damage: 5.8, armorPen: "Medium", quality: "Standard", priceCp: 735, priceDisplay: "7si 35cp", descriptionFull: "Steppe Sabre. Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion. Trusted from Southern Steppes, it proves dependable steel sized for medium engagements. Favoured for mounted draw-cuts and fluid passing strikes." },
    { name: "Steppe Sabre", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion.", fightingStyle: "Mounted draw-cuts and fluid passing strikes", attackSpeed: 6.8, damage: 5.8, armorPen: "Medium", quality: "Fine", priceCp: 1070, priceDisplay: "10si 70cp", descriptionFull: "Fine Steppe Sabre. Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for mounted draw-cuts and fluid passing strikes." },
    { name: "Steppe Sabre", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion.", fightingStyle: "Mounted draw-cuts and fluid passing strikes", attackSpeed: 6.8, damage: 5.8, armorPen: "Medium", quality: "Masterwork", priceCp: 1735, priceDisplay: "17si 35cp", descriptionFull: "Masterwork Steppe Sabre. Deeply curved single-edged steel blade with a flared tip; brass backstrap and knuckle bow; scabbard in rawhide or lacquer; optimized for mounted draw-cuts and flowing motion. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for mounted draw-cuts and fluid passing strikes." },
    { name: "Eastern Straightblade", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short/Medium", description: "Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise.", fightingStyle: "Precision fencing, balanced cuts and thrusts", attackSpeed: 7.5, damage: 4.8, armorPen: "Medium", quality: "Standard", priceCp: 545, priceDisplay: "5si 45cp", descriptionFull: "Eastern Straightblade. Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise. Trusted from Eastern Realms, it proves dependable steel sized for small engagements. Favoured for precision fencing, balanced cuts and thrusts." },
    { name: "Eastern Straightblade", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short/Medium", description: "Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise.", fightingStyle: "Precision fencing, balanced cuts and thrusts", attackSpeed: 7.5, damage: 4.8, armorPen: "Medium", quality: "Fine", priceCp: 790, priceDisplay: "7si 90cp", descriptionFull: "Fine Eastern Straightblade. Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for precision fencing, balanced cuts and thrusts." },
    { name: "Eastern Straightblade", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short/Medium", description: "Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise.", fightingStyle: "Precision fencing, balanced cuts and thrusts", attackSpeed: 7.5, damage: 4.8, armorPen: "Medium", quality: "Masterwork", priceCp: 1280, priceDisplay: "12si 80cp", descriptionFull: "Masterwork Eastern Straightblade. Elegant straight, double-edged steel blade with a narrow fuller; oval guard and ring pommel; lacquered scabbard with understated motifs; prized for balance and poise. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for precision fencing, balanced cuts and thrusts." },
    { name: "Blade of the Tide", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen.", fightingStyle: "Two-handed draw-cuts and precise diagonal slashes", attackSpeed: 6.5, damage: 6.2, armorPen: "Medium-High", quality: "Standard", priceCp: 1145, priceDisplay: "11si 45cp", descriptionFull: "Blade of the Tide. Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen. Trusted from Island Clans, it proves dependable steel sized for medium engagements. Favoured for two-handed draw-cuts and precise diagonal slashes." },
    { name: "Blade of the Tide", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen.", fightingStyle: "Two-handed draw-cuts and precise diagonal slashes", attackSpeed: 6.5, damage: 6.2, armorPen: "Medium-High", quality: "Fine", priceCp: 1665, priceDisplay: "16si 65cp", descriptionFull: "Fine Blade of the Tide. Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for two-handed draw-cuts and precise diagonal slashes." },
    { name: "Blade of the Tide", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen.", fightingStyle: "Two-handed draw-cuts and precise diagonal slashes", attackSpeed: 6.5, damage: 6.2, armorPen: "Medium-High", quality: "Masterwork", priceCp: 2695, priceDisplay: "1g 6si 95cp", descriptionFull: "Masterwork Blade of the Tide. Folded-steel curved blade with a distinct hardened edge line; ray-skin handle bound in dark silk; indigo lacquered scabbard with silver clan inlays; a prestigious cutter with ocean-blue sheen. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for two-handed draw-cuts and precise diagonal slashes." },
    { name: "Great-Edge", region: "Island Clans", size: "Very Large", hands: 2, reach: "Very Long", description: "Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight.", fightingStyle: "Sweeping, space-hungry strikes; anti-cavalry limb-cleavers", attackSpeed: 3.2, damage: 9.2, armorPen: "High", quality: "Standard", priceCp: 2075, priceDisplay: "1g 75cp", descriptionFull: "Great-Edge. Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight. Trusted from Island Clans, it proves dependable steel sized for very large engagements. Favoured for sweeping, space-hungry strikes; anti-cavalry limb-cleavers." },
    { name: "Great-Edge", region: "Island Clans", size: "Very Large", hands: 2, reach: "Very Long", description: "Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight.", fightingStyle: "Sweeping, space-hungry strikes; anti-cavalry limb-cleavers", attackSpeed: 3.2, damage: 9.2, armorPen: "High", quality: "Fine", priceCp: 3010, priceDisplay: "1g 10si 10cp", descriptionFull: "Fine Great-Edge. Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for sweeping, space-hungry strikes; anti-cavalry limb-cleavers." },
    { name: "Great-Edge", region: "Island Clans", size: "Very Large", hands: 2, reach: "Very Long", description: "Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight.", fightingStyle: "Sweeping, space-hungry strikes; anti-cavalry limb-cleavers", attackSpeed: 3.2, damage: 9.2, armorPen: "High", quality: "Masterwork", priceCp: 4875, priceDisplay: "2g 8si 75cp", descriptionFull: "Masterwork Great-Edge. Oversized curved battlefield sword of tempered steel, long o-kissaki-like tip and extended two-hand grip; blackened iron fittings; carried across the back; terrifying reach and limb-shearing weight. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for sweeping, space-hungry strikes; anti-cavalry limb-cleavers." },
    { name: "Companion Blade", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes.", fightingStyle: "Defensive parries, opportunistic ripostes", attackSpeed: 7.8, damage: 4.5, armorPen: "Medium", quality: "Standard", priceCp: 515, priceDisplay: "5si 15cp", descriptionFull: "Companion Blade. Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes. Trusted from Island Clans, it proves dependable steel sized for small engagements. Favoured for defensive parries, opportunistic ripostes." },
    { name: "Companion Blade", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes.", fightingStyle: "Defensive parries, opportunistic ripostes", attackSpeed: 7.8, damage: 4.5, armorPen: "Medium", quality: "Fine", priceCp: 745, priceDisplay: "7si 45cp", descriptionFull: "Fine Companion Blade. Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for defensive parries, opportunistic ripostes." },
    { name: "Companion Blade", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes.", fightingStyle: "Defensive parries, opportunistic ripostes", attackSpeed: 7.8, damage: 4.5, armorPen: "Medium", quality: "Masterwork", priceCp: 1205, priceDisplay: "12si 5cp", descriptionFull: "Masterwork Companion Blade. Short, razor-keen side sword with folded-steel blade; ray-skin and cord-wrapped grip; paired to longer blades for indoor defense and sudden ripostes. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for defensive parries, opportunistic ripostes." },
  ],
  daggers: [
    { name: "Misericorde", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust.", fightingStyle: "Finishing thrusts into armor gaps", attackSpeed: 10, damage: 2, armorPen: "High", quality: "Standard", priceCp: 130, priceDisplay: "1si 30cp", descriptionFull: "Misericorde. Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust. Trusted from High Kingdoms, it proves dependable steel sized for tiny engagements. Favoured for finishing thrusts into armor gaps." },
    { name: "Misericorde", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust.", fightingStyle: "Finishing thrusts into armor gaps", attackSpeed: 10, damage: 2, armorPen: "High", quality: "Fine", priceCp: 190, priceDisplay: "1si 90cp", descriptionFull: "Fine Misericorde. Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its tiny frame. Favoured for finishing thrusts into armor gaps." },
    { name: "Misericorde", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust.", fightingStyle: "Finishing thrusts into armor gaps", attackSpeed: 10, damage: 2, armorPen: "High", quality: "Masterwork", priceCp: 310, priceDisplay: "3si 10cp", descriptionFull: "Masterwork Misericorde. Thin, spike-like dagger of hardened steel with a triangular section; small iron guard and rounded pommel; rough leather grip; stained dark from oil and use—built for the final thrust. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for finishing thrusts into armor gaps." },
    { name: "Rondel", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure.", fightingStyle: "Armor-piercing thrusts, close grapples", attackSpeed: 9.5, damage: 2.3, armorPen: "High", quality: "Standard", priceCp: 135, priceDisplay: "1si 35cp", descriptionFull: "Rondel. Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure. Trusted from High Kingdoms, it proves dependable steel sized for tiny engagements. Favoured for armor-piercing thrusts, close grapples." },
    { name: "Rondel", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure.", fightingStyle: "Armor-piercing thrusts, close grapples", attackSpeed: 9.5, damage: 2.3, armorPen: "High", quality: "Fine", priceCp: 195, priceDisplay: "1si 95cp", descriptionFull: "Fine Rondel. Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its tiny frame. Favoured for armor-piercing thrusts, close grapples." },
    { name: "Rondel", region: "High Kingdoms", size: "Tiny", hands: 1, reach: "Very Short", description: "Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure.", fightingStyle: "Armor-piercing thrusts, close grapples", attackSpeed: 9.5, damage: 2.3, armorPen: "High", quality: "Masterwork", priceCp: 320, priceDisplay: "3si 20cp", descriptionFull: "Masterwork Rondel. Rigid, tapered steel blade with round guard and pommel disks; stout tang and wooden grip core; excels in twisting binds and puncturing under pressure. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for armor-piercing thrusts, close grapples." },
    { name: "Push-Spike", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons.", fightingStyle: "Punching stabs; breaks through layered armor", attackSpeed: 9, damage: 2.8, armorPen: "Medium-High", quality: "Standard", priceCp: 180, priceDisplay: "1si 80cp", descriptionFull: "Push-Spike. H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons. Trusted from Southern Kingdoms, it proves dependable steel sized for small engagements. Favoured for punching stabs; breaks through layered armor." },
    { name: "Push-Spike", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons.", fightingStyle: "Punching stabs; breaks through layered armor", attackSpeed: 9, damage: 2.8, armorPen: "Medium-High", quality: "Fine", priceCp: 265, priceDisplay: "2si 65cp", descriptionFull: "Fine Push-Spike. H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for punching stabs; breaks through layered armor." },
    { name: "Push-Spike", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons.", fightingStyle: "Punching stabs; breaks through layered armor", attackSpeed: 9, damage: 2.8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 425, priceDisplay: "4si 25cp", descriptionFull: "Masterwork Push-Spike. H-grip thrusting dagger with a wide triangular steel blade; side bars protect the hand; brass frame and leather pads; designed to punch through mail and layered gambesons. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for punching stabs; breaks through layered armor." },
    { name: "Piercer", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints.", fightingStyle: "Silent entries, seam strikes, assassin’s work", attackSpeed: 8.5, damage: 3, armorPen: "High", quality: "Standard", priceCp: 210, priceDisplay: "2si 10cp", descriptionFull: "Piercer. Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints. Trusted from Eastern Realms, it proves dependable steel sized for small engagements. Favoured for silent entries, seam strikes, assassin’s work." },
    { name: "Piercer", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints.", fightingStyle: "Silent entries, seam strikes, assassin’s work", attackSpeed: 8.5, damage: 3, armorPen: "High", quality: "Fine", priceCp: 300, priceDisplay: "3si", descriptionFull: "Fine Piercer. Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for silent entries, seam strikes, assassin’s work." },
    { name: "Piercer", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints.", fightingStyle: "Silent entries, seam strikes, assassin’s work", attackSpeed: 8.5, damage: 3, armorPen: "High", quality: "Masterwork", priceCp: 490, priceDisplay: "4si 90cp", descriptionFull: "Masterwork Piercer. Reinforced spine dagger with a thick, tapered steel point; subtle octagonal grip; matte-blued fittings; a quiet killer for seams and weak joints. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for silent entries, seam strikes, assassin’s work." },
    { name: "Curved Twin-Edge", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters.", fightingStyle: "Snapping slashes with opportunistic thrusts", attackSpeed: 8.5, damage: 2.6, armorPen: "Medium", quality: "Standard", priceCp: 155, priceDisplay: "1si 55cp", descriptionFull: "Curved Twin-Edge. Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters. Trusted from Southern Kingdoms, it proves dependable steel sized for small engagements. Favoured for snapping slashes with opportunistic thrusts." },
    { name: "Curved Twin-Edge", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters.", fightingStyle: "Snapping slashes with opportunistic thrusts", attackSpeed: 8.5, damage: 2.6, armorPen: "Medium", quality: "Fine", priceCp: 225, priceDisplay: "2si 25cp", descriptionFull: "Fine Curved Twin-Edge. Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for snapping slashes with opportunistic thrusts." },
    { name: "Curved Twin-Edge", region: "Southern Kingdoms", size: "Small", hands: 1, reach: "Short", description: "Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters.", fightingStyle: "Snapping slashes with opportunistic thrusts", attackSpeed: 8.5, damage: 2.6, armorPen: "Medium", quality: "Masterwork", priceCp: 365, priceDisplay: "3si 65cp", descriptionFull: "Masterwork Curved Twin-Edge. Slightly curved, double-edged steel dagger with a shallow fuller; brass bolster and horn scales; a nimble cutter for close quarters. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for snapping slashes with opportunistic thrusts." },
    { name: "Wavesong Dagger", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite.", fightingStyle: "Cutting draws and shallow pierces", attackSpeed: 8, damage: 2.7, armorPen: "Medium", quality: "Standard", priceCp: 155, priceDisplay: "1si 55cp", descriptionFull: "Wavesong Dagger. Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite. Trusted from Island Clans, it proves dependable steel sized for small engagements. Favoured for cutting draws and shallow pierces." },
    { name: "Wavesong Dagger", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite.", fightingStyle: "Cutting draws and shallow pierces", attackSpeed: 8, damage: 2.7, armorPen: "Medium", quality: "Fine", priceCp: 225, priceDisplay: "2si 25cp", descriptionFull: "Fine Wavesong Dagger. Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for cutting draws and shallow pierces." },
    { name: "Wavesong Dagger", region: "Island Clans", size: "Small", hands: 1, reach: "Short", description: "Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite.", fightingStyle: "Cutting draws and shallow pierces", attackSpeed: 8, damage: 2.7, armorPen: "Medium", quality: "Masterwork", priceCp: 365, priceDisplay: "3si 65cp", descriptionFull: "Masterwork Wavesong Dagger. Undulating, wavy steel blade with decorative grooves; lacquered wooden scabbard; fittings in dark bronze; ritual grace with practical bite. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for cutting draws and shallow pierces." },
    { name: "Cairn Dirk", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company.", fightingStyle: "Close thrusts and quick chops", attackSpeed: 8.5, damage: 3.2, armorPen: "Medium", quality: "Standard", priceCp: 165, priceDisplay: "1si 65cp", descriptionFull: "Cairn Dirk. Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company. Trusted from Northern Marches, it proves dependable steel sized for small engagements. Favoured for close thrusts and quick chops." },
    { name: "Cairn Dirk", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company.", fightingStyle: "Close thrusts and quick chops", attackSpeed: 8.5, damage: 3.2, armorPen: "Medium", quality: "Fine", priceCp: 240, priceDisplay: "2si 40cp", descriptionFull: "Fine Cairn Dirk. Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for close thrusts and quick chops." },
    { name: "Cairn Dirk", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company.", fightingStyle: "Close thrusts and quick chops", attackSpeed: 8.5, damage: 3.2, armorPen: "Medium", quality: "Masterwork", priceCp: 390, priceDisplay: "3si 90cp", descriptionFull: "Masterwork Cairn Dirk. Long, narrow steel dagger with a heavy iron pommel and ridged spine; oak grip in tarred leather; reliable in hard weather and hard company. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for close thrusts and quick chops." },
  ],
  axes: [
    { name: "Long-Haft War Axe", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves.", fightingStyle: "Wide arcs and shield rips", attackSpeed: 4.8, damage: 7.8, armorPen: "Medium", quality: "Standard", priceCp: 1625, priceDisplay: "16si 25cp", descriptionFull: "Long-Haft War Axe. Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves. Trusted from Northern Marches, it proves dependable steel sized for large engagements. Favoured for wide arcs and shield rips." },
    { name: "Long-Haft War Axe", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves.", fightingStyle: "Wide arcs and shield rips", attackSpeed: 4.8, damage: 7.8, armorPen: "Medium", quality: "Fine", priceCp: 2355, priceDisplay: "1g 3si 55cp", descriptionFull: "Fine Long-Haft War Axe. Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for wide arcs and shield rips." },
    { name: "Long-Haft War Axe", region: "Northern Marches", size: "Large", hands: 2, reach: "Long", description: "Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves.", fightingStyle: "Wide arcs and shield rips", attackSpeed: 4.8, damage: 7.8, armorPen: "Medium", quality: "Masterwork", priceCp: 3815, priceDisplay: "1g 18si 15cp", descriptionFull: "Masterwork Long-Haft War Axe. Ash-wood haft near 1.3 m topped with a thin, biting steel blade; leather chokes beneath the head for grip; edge kept mirror-bright for fearsome cleaves. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for wide arcs and shield rips." },
    { name: "Throwing Axe", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip.", fightingStyle: "Pre-melee volleys to disrupt formations", attackSpeed: 3, damage: 5, armorPen: "Medium", quality: "Standard", priceCp: 515, priceDisplay: "5si 15cp", descriptionFull: "Throwing Axe. Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip. Trusted from Northern Marches, it proves dependable steel sized for small engagements. Favoured for pre-melee volleys to disrupt formations." },
    { name: "Throwing Axe", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip.", fightingStyle: "Pre-melee volleys to disrupt formations", attackSpeed: 3, damage: 5, armorPen: "Medium", quality: "Fine", priceCp: 745, priceDisplay: "7si 45cp", descriptionFull: "Fine Throwing Axe. Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for pre-melee volleys to disrupt formations." },
    { name: "Throwing Axe", region: "Northern Marches", size: "Small", hands: 1, reach: "Short", description: "Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip.", fightingStyle: "Pre-melee volleys to disrupt formations", attackSpeed: 3, damage: 5, armorPen: "Medium", quality: "Masterwork", priceCp: 1210, priceDisplay: "12si 10cp", descriptionFull: "Masterwork Throwing Axe. Balanced steel head on a short hickory haft; slightly flared edge and tapered beard for reliable rotation; waxed wood for dry grip. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for pre-melee volleys to disrupt formations." },
    { name: "Long-Blade Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes.", fightingStyle: "Cleaving strikes that punish clustered foes", attackSpeed: 4.2, damage: 8.2, armorPen: "High", quality: "Standard", priceCp: 2025, priceDisplay: "1g 25cp", descriptionFull: "Long-Blade Axe. Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes. Trusted from Borderlands, it proves dependable steel sized for large engagements. Favoured for cleaving strikes that punish clustered foes." },
    { name: "Long-Blade Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes.", fightingStyle: "Cleaving strikes that punish clustered foes", attackSpeed: 4.2, damage: 8.2, armorPen: "High", quality: "Fine", priceCp: 2935, priceDisplay: "1g 9si 35cp", descriptionFull: "Fine Long-Blade Axe. Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for cleaving strikes that punish clustered foes." },
    { name: "Long-Blade Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes.", fightingStyle: "Cleaving strikes that punish clustered foes", attackSpeed: 4.2, damage: 8.2, armorPen: "High", quality: "Masterwork", priceCp: 4760, priceDisplay: "2g 7si 60cp", descriptionFull: "Masterwork Long-Blade Axe. Extended crescent steel blade riveted to a stout pole; iron langets protect the shaft; meant to hew through poles, palings, and clustered foes. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for cleaving strikes that punish clustered foes." },
    { name: "Hooked War Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments.", fightingStyle: "Hook, yank, and hew; shield killers", attackSpeed: 4, damage: 8.5, armorPen: "High", quality: "Standard", priceCp: 2020, priceDisplay: "1g 20cp", descriptionFull: "Hooked War Axe. Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments. Trusted from Borderlands, it proves dependable steel sized for large engagements. Favoured for hook, yank, and hew; shield killers." },
    { name: "Hooked War Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments.", fightingStyle: "Hook, yank, and hew; shield killers", attackSpeed: 4, damage: 8.5, armorPen: "High", quality: "Fine", priceCp: 2925, priceDisplay: "1g 9si 25cp", descriptionFull: "Fine Hooked War Axe. Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for hook, yank, and hew; shield killers." },
    { name: "Hooked War Axe", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments.", fightingStyle: "Hook, yank, and hew; shield killers", attackSpeed: 4, damage: 8.5, armorPen: "High", quality: "Masterwork", priceCp: 4740, priceDisplay: "2g 7si 40cp", descriptionFull: "Masterwork Hooked War Axe. Steel axe head paired with a rearward hook; oak haft with iron shoes; the hook drags shields and reins; the edge ends arguments. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for hook, yank, and hew; shield killers." },
    { name: "Bearded Axe", region: "Northern Marches", size: "Medium", hands: 1, reach: "Medium", description: "Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control.", fightingStyle: "Disarms, beard-hooks, sharp chops", attackSpeed: 6, damage: 6.5, armorPen: "Medium", quality: "Standard", priceCp: 950, priceDisplay: "9si 50cp", descriptionFull: "Bearded Axe. Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control. Trusted from Northern Marches, it proves dependable steel sized for medium engagements. Favoured for disarms, beard-hooks, sharp chops." },
    { name: "Bearded Axe", region: "Northern Marches", size: "Medium", hands: 1, reach: "Medium", description: "Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control.", fightingStyle: "Disarms, beard-hooks, sharp chops", attackSpeed: 6, damage: 6.5, armorPen: "Medium", quality: "Fine", priceCp: 1380, priceDisplay: "13si 80cp", descriptionFull: "Fine Bearded Axe. Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control. Fine finishing from Northern Marches dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for disarms, beard-hooks, sharp chops." },
    { name: "Bearded Axe", region: "Northern Marches", size: "Medium", hands: 1, reach: "Medium", description: "Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control.", fightingStyle: "Disarms, beard-hooks, sharp chops", attackSpeed: 6, damage: 6.5, armorPen: "Medium", quality: "Masterwork", priceCp: 2240, priceDisplay: "1g 2si 40cp", descriptionFull: "Masterwork Bearded Axe. Short ash haft with a steel head whose lower edge extends into a hooking beard; leather wrap near the socket for hand-up control. Masterwork artisans from Northern Marches layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for disarms, beard-hooks, sharp chops." },
    { name: "Crescent Battleaxe", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes.", fightingStyle: "Fast cuts against unarmored or padded foes", attackSpeed: 6.8, damage: 5, armorPen: "Medium", quality: "Standard", priceCp: 870, priceDisplay: "8si 70cp", descriptionFull: "Crescent Battleaxe. Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes. Trusted from Eastern Realms, it proves dependable steel sized for medium engagements. Favoured for fast cuts against unarmored or padded foes." },
    { name: "Crescent Battleaxe", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes.", fightingStyle: "Fast cuts against unarmored or padded foes", attackSpeed: 6.8, damage: 5, armorPen: "Medium", quality: "Fine", priceCp: 1260, priceDisplay: "12si 60cp", descriptionFull: "Fine Crescent Battleaxe. Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for fast cuts against unarmored or padded foes." },
    { name: "Crescent Battleaxe", region: "Eastern Realms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes.", fightingStyle: "Fast cuts against unarmored or padded foes", attackSpeed: 6.8, damage: 5, armorPen: "Medium", quality: "Masterwork", priceCp: 2040, priceDisplay: "1g 40cp", descriptionFull: "Masterwork Crescent Battleaxe. Compact crescent steel head on a 60–70 cm haft; brass wedge and iron pins lock the eye; a nimble cutter for fast skirmishes. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for fast cuts against unarmored or padded foes." },
  ],
  polearms: [
    { name: "Halberd", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition.", fightingStyle: "Thrust to pin, hook to pull, axe to finish", attackSpeed: 4.5, damage: 8.8, armorPen: "High", quality: "Standard", priceCp: 1835, priceDisplay: "18si 35cp", descriptionFull: "Halberd. Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for thrust to pin, hook to pull, axe to finish." },
    { name: "Halberd", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition.", fightingStyle: "Thrust to pin, hook to pull, axe to finish", attackSpeed: 4.5, damage: 8.8, armorPen: "High", quality: "Fine", priceCp: 2660, priceDisplay: "1g 6si 60cp", descriptionFull: "Fine Halberd. Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for thrust to pin, hook to pull, axe to finish." },
    { name: "Halberd", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition.", fightingStyle: "Thrust to pin, hook to pull, axe to finish", attackSpeed: 4.5, damage: 8.8, armorPen: "High", quality: "Masterwork", priceCp: 4315, priceDisplay: "2g 3si 15cp", descriptionFull: "Masterwork Halberd. Two-meter oak pole, iron-shod at the base, topped with a broad steel axe blade, thrusting spike, and rear hook; often painted in unit colors for field recognition. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for thrust to pin, hook to pull, axe to finish." },
    { name: "Glaive", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing.", fightingStyle: "Sweeping cuts and perimeter control", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Standard", priceCp: 1600, priceDisplay: "16si", descriptionFull: "Glaive. Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for sweeping cuts and perimeter control." },
    { name: "Glaive", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing.", fightingStyle: "Sweeping cuts and perimeter control", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Fine", priceCp: 2320, priceDisplay: "1g 3si 20cp", descriptionFull: "Fine Glaive. Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for sweeping cuts and perimeter control." },
    { name: "Glaive", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing.", fightingStyle: "Sweeping cuts and perimeter control", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 3755, priceDisplay: "1g 17si 55cp", descriptionFull: "Masterwork Glaive. Single-edged steel blade of sword length mounted to a long staff; some variants add a back spike; ferruled base for bracing. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for sweeping cuts and perimeter control." },
    { name: "Partisan Spear", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates.", fightingStyle: "Thrusts, blade parries, rank-fighting stability", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Standard", priceCp: 1790, priceDisplay: "17si 90cp", descriptionFull: "Partisan Spear. Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates. Trusted from High Kingdoms, it proves dependable steel sized for large engagements. Favoured for thrusts, blade parries, rank-fighting stability." },
    { name: "Partisan Spear", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates.", fightingStyle: "Thrusts, blade parries, rank-fighting stability", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Fine", priceCp: 2595, priceDisplay: "1g 5si 95cp", descriptionFull: "Fine Partisan Spear. Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for thrusts, blade parries, rank-fighting stability." },
    { name: "Partisan Spear", region: "High Kingdoms", size: "Large", hands: 2, reach: "Long", description: "Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates.", fightingStyle: "Thrusts, blade parries, rank-fighting stability", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 4205, priceDisplay: "2g 2si 5cp", descriptionFull: "Masterwork Partisan Spear. Broad steel spearhead with side flanges to parry and catch; ash shaft bound with iron rings; steady in ranks and stoic at gates. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for thrusts, blade parries, rank-fighting stability." },
    { name: "Beak-Hammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate.", fightingStyle: "Armor-breaking smashes and beak thrusts", attackSpeed: 4, damage: 9, armorPen: "Very High", quality: "Standard", priceCp: 2020, priceDisplay: "1g 20cp", descriptionFull: "Beak-Hammer. Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate. Trusted from Borderlands, it proves dependable steel sized for large engagements. Favoured for armor-breaking smashes and beak thrusts." },
    { name: "Beak-Hammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate.", fightingStyle: "Armor-breaking smashes and beak thrusts", attackSpeed: 4, damage: 9, armorPen: "Very High", quality: "Fine", priceCp: 2930, priceDisplay: "1g 9si 30cp", descriptionFull: "Fine Beak-Hammer. Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for armor-breaking smashes and beak thrusts." },
    { name: "Beak-Hammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate.", fightingStyle: "Armor-breaking smashes and beak thrusts", attackSpeed: 4, damage: 9, armorPen: "Very High", quality: "Masterwork", priceCp: 4750, priceDisplay: "2g 7si 50cp", descriptionFull: "Masterwork Beak-Hammer. Steel hammer-face paired with a piercing beak and top spike on a reinforced haft; iron langets along the wood; born to bruise and break plate. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for armor-breaking smashes and beak thrusts." },
    { name: "Lucent Warhammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor.", fightingStyle: "Brutal impacts; spikes for penetrating follow-through", attackSpeed: 3.8, damage: 9.5, armorPen: "Very High", quality: "Standard", priceCp: 2020, priceDisplay: "1g 20cp", descriptionFull: "Lucent Warhammer. Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor. Trusted from Borderlands, it proves dependable steel sized for large engagements. Favoured for brutal impacts; spikes for penetrating follow-through." },
    { name: "Lucent Warhammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor.", fightingStyle: "Brutal impacts; spikes for penetrating follow-through", attackSpeed: 3.8, damage: 9.5, armorPen: "Very High", quality: "Fine", priceCp: 2930, priceDisplay: "1g 9si 30cp", descriptionFull: "Fine Lucent Warhammer. Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for brutal impacts; spikes for penetrating follow-through." },
    { name: "Lucent Warhammer", region: "Borderlands", size: "Large", hands: 2, reach: "Long", description: "Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor.", fightingStyle: "Brutal impacts; spikes for penetrating follow-through", attackSpeed: 3.8, damage: 9.5, armorPen: "Very High", quality: "Masterwork", priceCp: 4755, priceDisplay: "2g 7si 55cp", descriptionFull: "Masterwork Lucent Warhammer. Complex hammerhead of hardened steel with multiple striking faces and spikes; long ash shaft bound in rawhide; every angle a hazard to armor. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for brutal impacts; spikes for penetrating follow-through." },
    { name: "Winding Spear", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting.", fightingStyle: "Line formations, thrust fencing, choke-ups", attackSpeed: 5.8, damage: 7, armorPen: "High", quality: "Standard", priceCp: 1480, priceDisplay: "14si 80cp", descriptionFull: "Winding Spear. Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting. Trusted from Island Clans, it proves dependable steel sized for medium engagements. Favoured for line formations, thrust fencing, choke-ups." },
    { name: "Winding Spear", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting.", fightingStyle: "Line formations, thrust fencing, choke-ups", attackSpeed: 5.8, damage: 7, armorPen: "High", quality: "Fine", priceCp: 2145, priceDisplay: "1g 1si 45cp", descriptionFull: "Fine Winding Spear. Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for line formations, thrust fencing, choke-ups." },
    { name: "Winding Spear", region: "Island Clans", size: "Medium", hands: 2, reach: "Long", description: "Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting.", fightingStyle: "Line formations, thrust fencing, choke-ups", attackSpeed: 5.8, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 3475, priceDisplay: "1g 14si 75cp", descriptionFull: "Masterwork Winding Spear. Straight, leaf-shaped steel head on a long lacquered shaft; some carry a cross-bar or side forks; silk tassel for water-wicking and sighting. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for line formations, thrust fencing, choke-ups." },
    { name: "River-Blade", region: "Island Clans", size: "Large", hands: 2, reach: "Long", description: "Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water.", fightingStyle: "Sweeping anti-cavalry slashes and flank cuts", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Standard", priceCp: 1600, priceDisplay: "16si", descriptionFull: "River-Blade. Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water. Trusted from Island Clans, it proves dependable steel sized for large engagements. Favoured for sweeping anti-cavalry slashes and flank cuts." },
    { name: "River-Blade", region: "Island Clans", size: "Large", hands: 2, reach: "Long", description: "Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water.", fightingStyle: "Sweeping anti-cavalry slashes and flank cuts", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Fine", priceCp: 2320, priceDisplay: "1g 3si 20cp", descriptionFull: "Fine River-Blade. Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for sweeping anti-cavalry slashes and flank cuts." },
    { name: "River-Blade", region: "Island Clans", size: "Large", hands: 2, reach: "Long", description: "Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water.", fightingStyle: "Sweeping anti-cavalry slashes and flank cuts", attackSpeed: 5, damage: 7.8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 3755, priceDisplay: "1g 17si 55cp", descriptionFull: "Masterwork River-Blade. Curved steel blade fixed to a sturdy pole, iron shoe at the base; fittings lacquered in deep green; arcs like flowing water. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for sweeping anti-cavalry slashes and flank cuts." },
    { name: "Trident Fork", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Medium", description: "Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers.", fightingStyle: "Thrust, catch, and control; excels near shorelines", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Standard", priceCp: 1245, priceDisplay: "12si 45cp", descriptionFull: "Trident Fork. Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers. Trusted from Southern Steppes, it proves dependable steel sized for medium engagements. Favoured for thrust, catch, and control; excels near shorelines." },
    { name: "Trident Fork", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Medium", description: "Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers.", fightingStyle: "Thrust, catch, and control; excels near shorelines", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Fine", priceCp: 1805, priceDisplay: "18si 5cp", descriptionFull: "Fine Trident Fork. Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for thrust, catch, and control; excels near shorelines." },
    { name: "Trident Fork", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Medium", description: "Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers.", fightingStyle: "Thrust, catch, and control; excels near shorelines", attackSpeed: 5.2, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 2925, priceDisplay: "1g 9si 25cp", descriptionFull: "Masterwork Trident Fork. Three-tined steel head on a waxed ash shaft; cord wraps for wet grip; equally at home in boathouses and breakers. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for thrust, catch, and control; excels near shorelines." },
    { name: "Axe-Knife Polearm", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe.", fightingStyle: "Close-quarters chopping and thrusting", attackSpeed: 5.5, damage: 6.8, armorPen: "Medium-High", quality: "Standard", priceCp: 915, priceDisplay: "9si 15cp", descriptionFull: "Axe-Knife Polearm. Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe. Trusted from Southern Steppes, it proves dependable steel sized for medium engagements. Favoured for close-quarters chopping and thrusting." },
    { name: "Axe-Knife Polearm", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe.", fightingStyle: "Close-quarters chopping and thrusting", attackSpeed: 5.5, damage: 6.8, armorPen: "Medium-High", quality: "Fine", priceCp: 1325, priceDisplay: "13si 25cp", descriptionFull: "Fine Axe-Knife Polearm. Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for close-quarters chopping and thrusting." },
    { name: "Axe-Knife Polearm", region: "Southern Steppes", size: "Medium", hands: 1, reach: "Medium", description: "Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe.", fightingStyle: "Close-quarters chopping and thrusting", attackSpeed: 5.5, damage: 6.8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 2150, priceDisplay: "1g 1si 50cp", descriptionFull: "Masterwork Axe-Knife Polearm. Compact axelike steel head with a reinforced knife edge set on a short, hide-bound shaft; carriage-friendly and doorway-safe. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for close-quarters chopping and thrusting." },
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
    { name: "Chain Morning Star", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks.", fightingStyle: "Circular momentum strikes; wraps and sudden snaps", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Standard", priceCp: 1025, priceDisplay: "10si 25cp", descriptionFull: "Chain Morning Star. Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks. Trusted from High Kingdoms, it proves dependable steel sized for medium engagements. Favoured for circular momentum strikes; wraps and sudden snaps." },
    { name: "Chain Morning Star", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks.", fightingStyle: "Circular momentum strikes; wraps and sudden snaps", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Fine", priceCp: 1490, priceDisplay: "14si 90cp", descriptionFull: "Fine Chain Morning Star. Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks. Fine finishing from High Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for circular momentum strikes; wraps and sudden snaps." },
    { name: "Chain Morning Star", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Short/Medium", description: "Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks.", fightingStyle: "Circular momentum strikes; wraps and sudden snaps", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Masterwork", priceCp: 2410, priceDisplay: "1g 4si 10cp", descriptionFull: "Masterwork Chain Morning Star. Spiked steel ball on a short iron chain anchored to a hardwood handle with iron cap; leather wrist loop and choke wrap for control; bites through helmets when momentum peaks. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for circular momentum strikes; wraps and sudden snaps." },
    { name: "Meteor Chain", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Long", description: "Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify.", fightingStyle: "Wide swings, entanglement tactics, punishing impacts", attackSpeed: 4, damage: 8, armorPen: "Medium-High", quality: "Standard", priceCp: 1225, priceDisplay: "12si 25cp", descriptionFull: "Meteor Chain. Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify. Trusted from Southern Steppes, it proves dependable steel sized for medium engagements. Favoured for wide swings, entanglement tactics, punishing impacts." },
    { name: "Meteor Chain", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Long", description: "Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify.", fightingStyle: "Wide swings, entanglement tactics, punishing impacts", attackSpeed: 4, damage: 8, armorPen: "Medium-High", quality: "Fine", priceCp: 1775, priceDisplay: "17si 75cp", descriptionFull: "Fine Meteor Chain. Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify. Fine finishing from Southern Steppes dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for wide swings, entanglement tactics, punishing impacts." },
    { name: "Meteor Chain", region: "Southern Steppes", size: "Medium", hands: 2, reach: "Long", description: "Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify.", fightingStyle: "Wide swings, entanglement tactics, punishing impacts", attackSpeed: 4, damage: 8, armorPen: "Medium-High", quality: "Masterwork", priceCp: 2875, priceDisplay: "1g 8si 75cp", descriptionFull: "Masterwork Meteor Chain. Dark-iron link chain with twin fist-sized steel weights studded with brass knobs; leather-wrapped sections for grip; arcs of glinting metal that crush, tangle, and terrify. Masterwork artisans from Southern Steppes layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for wide swings, entanglement tactics, punishing impacts." },
  ],
  whips: [
    { name: "Punisher Lash", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve.", fightingStyle: "Rapid lacerations, disarms, stance disruption", attackSpeed: 9, damage: 3.5, armorPen: "Low", quality: "Standard", priceCp: 150, priceDisplay: "1si 50cp", descriptionFull: "Punisher Lash. Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve. Trusted from Eastern Realms, it proves dependable steel sized for small engagements. Favoured for rapid lacerations, disarms, stance disruption." },
    { name: "Punisher Lash", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve.", fightingStyle: "Rapid lacerations, disarms, stance disruption", attackSpeed: 9, damage: 3.5, armorPen: "Low", quality: "Fine", priceCp: 215, priceDisplay: "2si 15cp", descriptionFull: "Fine Punisher Lash. Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its small frame. Favoured for rapid lacerations, disarms, stance disruption." },
    { name: "Punisher Lash", region: "Eastern Realms", size: "Small", hands: 1, reach: "Short", description: "Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve.", fightingStyle: "Rapid lacerations, disarms, stance disruption", attackSpeed: 9, damage: 3.5, armorPen: "Low", quality: "Masterwork", priceCp: 350, priceDisplay: "3si 50cp", descriptionFull: "Masterwork Punisher Lash. Braided leather whip with a lead-weighted tip; iron-ring bound handle in dyed hide; snaps with a crack that scars skin and shakes nerve. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for rapid lacerations, disarms, stance disruption." },
    { name: "Scorpion Whip", region: "Southern Kingdoms", size: "Medium", hands: 2, reach: "Medium", description: "Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear.", fightingStyle: "Wraps, tears, and control; risky in close press", attackSpeed: 6.5, damage: 5.5, armorPen: "Medium", quality: "Standard", priceCp: 295, priceDisplay: "2si 95cp", descriptionFull: "Scorpion Whip. Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear. Trusted from Southern Kingdoms, it proves dependable steel sized for medium engagements. Favoured for wraps, tears, and control; risky in close press." },
    { name: "Scorpion Whip", region: "Southern Kingdoms", size: "Medium", hands: 2, reach: "Medium", description: "Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear.", fightingStyle: "Wraps, tears, and control; risky in close press", attackSpeed: 6.5, damage: 5.5, armorPen: "Medium", quality: "Fine", priceCp: 425, priceDisplay: "4si 25cp", descriptionFull: "Fine Scorpion Whip. Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear. Fine finishing from Southern Kingdoms dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for wraps, tears, and control; risky in close press." },
    { name: "Scorpion Whip", region: "Southern Kingdoms", size: "Medium", hands: 2, reach: "Medium", description: "Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear.", fightingStyle: "Wraps, tears, and control; risky in close press", attackSpeed: 6.5, damage: 5.5, armorPen: "Medium", quality: "Masterwork", priceCp: 690, priceDisplay: "6si 90cp", descriptionFull: "Masterwork Scorpion Whip. Segmented leather cords, each tipped with small steel barbs and hooks; grip wrapped in crimson hide with brass rings; lashes that wrap and tear. Masterwork artisans from Southern Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for wraps, tears, and control; risky in close press." },
  ],
  staves: [
    { name: "Quarterstaff", region: "High Villages", size: "Large", hands: 2, reach: "Long", description: "Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards.", fightingStyle: "Thrusts, strikes, parries; excellent reach discipline", attackSpeed: 7, damage: 4.5, armorPen: "Low-Medium", quality: "Standard", priceCp: 260, priceDisplay: "2si 60cp", descriptionFull: "Quarterstaff. Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards. Trusted from High Villages, it proves dependable steel sized for large engagements. Favoured for thrusts, strikes, parries; excellent reach discipline." },
    { name: "Quarterstaff", region: "High Villages", size: "Large", hands: 2, reach: "Long", description: "Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards.", fightingStyle: "Thrusts, strikes, parries; excellent reach discipline", attackSpeed: 7, damage: 4.5, armorPen: "Low-Medium", quality: "Fine", priceCp: 375, priceDisplay: "3si 75cp", descriptionFull: "Fine Quarterstaff. Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards. Fine finishing from High Villages dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for thrusts, strikes, parries; excellent reach discipline." },
    { name: "Quarterstaff", region: "High Villages", size: "Large", hands: 2, reach: "Long", description: "Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards.", fightingStyle: "Thrusts, strikes, parries; excellent reach discipline", attackSpeed: 7, damage: 4.5, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 610, priceDisplay: "6si 10cp", descriptionFull: "Masterwork Quarterstaff. Straight hardwood staff (6–8 ft) with iron ferrules; palm-smooth from drills; simple waxed finish; an honest weapon of thrusts, beats, and guards. Masterwork artisans from High Villages layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for thrusts, strikes, parries; excellent reach discipline." },
    { name: "Ironwood Staff", region: "Eastern Realms", size: "Large", hands: 2, reach: "Long", description: "Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters.", fightingStyle: "Heavy blocks and sweeping counters", attackSpeed: 7.2, damage: 4.5, armorPen: "Low-Medium", quality: "Standard", priceCp: 260, priceDisplay: "2si 60cp", descriptionFull: "Ironwood Staff. Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters. Trusted from Eastern Realms, it proves dependable steel sized for large engagements. Favoured for heavy blocks and sweeping counters." },
    { name: "Ironwood Staff", region: "Eastern Realms", size: "Large", hands: 2, reach: "Long", description: "Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters.", fightingStyle: "Heavy blocks and sweeping counters", attackSpeed: 7.2, damage: 4.5, armorPen: "Low-Medium", quality: "Fine", priceCp: 380, priceDisplay: "3si 80cp", descriptionFull: "Fine Ironwood Staff. Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters. Fine finishing from Eastern Realms dresses every fitting and coaxes a livelier balance out of its large frame. Favoured for heavy blocks and sweeping counters." },
    { name: "Ironwood Staff", region: "Eastern Realms", size: "Large", hands: 2, reach: "Long", description: "Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters.", fightingStyle: "Heavy blocks and sweeping counters", attackSpeed: 7.2, damage: 4.5, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 615, priceDisplay: "6si 15cp", descriptionFull: "Masterwork Ironwood Staff. Dense ironwood shaft with reinforced steel caps; lacquered mid-grip and rawhide wraps; punishing blocks and ringing counters. Masterwork artisans from Eastern Realms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for heavy blocks and sweeping counters." },
    { name: "Short Staff", region: "Island Clans", size: "Medium", hands: 2, reach: "Medium", description: "Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys.", fightingStyle: "Quick transitions between strikes and traps", attackSpeed: 7.5, damage: 4, armorPen: "Low-Medium", quality: "Standard", priceCp: 180, priceDisplay: "1si 80cp", descriptionFull: "Short Staff. Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys. Trusted from Island Clans, it proves dependable steel sized for medium engagements. Favoured for quick transitions between strikes and traps." },
    { name: "Short Staff", region: "Island Clans", size: "Medium", hands: 2, reach: "Medium", description: "Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys.", fightingStyle: "Quick transitions between strikes and traps", attackSpeed: 7.5, damage: 4, armorPen: "Low-Medium", quality: "Fine", priceCp: 260, priceDisplay: "2si 60cp", descriptionFull: "Fine Short Staff. Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for quick transitions between strikes and traps." },
    { name: "Short Staff", region: "Island Clans", size: "Medium", hands: 2, reach: "Medium", description: "Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys.", fightingStyle: "Quick transitions between strikes and traps", attackSpeed: 7.5, damage: 4, armorPen: "Low-Medium", quality: "Masterwork", priceCp: 420, priceDisplay: "4si 20cp", descriptionFull: "Masterwork Short Staff. Trim hardwood staff just under shoulder height; corded central grip; quick to pack on ships and quicker to spin in alleys. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for quick transitions between strikes and traps." },
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
    { name: "Spiked Morning Star", region: "High Kingdoms", size: "Medium", hands: 1, reach: "Short", description: "Rigid ash haft capped with a solid steel ball bristling with pyramidal spikes; iron langets protect the wood; brutal, simple, and cheap to keep.", fightingStyle: "Overhand crashes and shield-busting blows", attackSpeed: 5.8, damage: 7, armorPen: "High", quality: "Masterwork", priceCp: 2240, priceDisplay: "1g 2si 40cp", descriptionFull: "Masterwork Spiked Morning Star. Rigid ash haft capped with a solid steel ball bristling with pyramidal spikes; iron langets protect the wood; brutal, simple, and cheap to keep. Masterwork artisans from High Kingdoms layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for overhand crashes and shield-busting blows." },
    { name: "Flanged Mace", region: "Borderlands", size: "Medium", hands: 1, reach: "Short", description: "Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates.", fightingStyle: "Short-range battering; targets helms and pauldrons", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Standard", priceCp: 945, priceDisplay: "9si 45cp", descriptionFull: "Flanged Mace. Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates. Trusted from Borderlands, it proves dependable steel sized for medium engagements. Favoured for short-range battering; targets helms and pauldrons." },
    { name: "Flanged Mace", region: "Borderlands", size: "Medium", hands: 1, reach: "Short", description: "Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates.", fightingStyle: "Short-range battering; targets helms and pauldrons", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Fine", priceCp: 1370, priceDisplay: "13si 70cp", descriptionFull: "Fine Flanged Mace. Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates. Fine finishing from Borderlands dresses every fitting and coaxes a livelier balance out of its medium frame. Favoured for short-range battering; targets helms and pauldrons." },
    { name: "Flanged Mace", region: "Borderlands", size: "Medium", hands: 1, reach: "Short", description: "Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates.", fightingStyle: "Short-range battering; targets helms and pauldrons", attackSpeed: 5.5, damage: 7.2, armorPen: "High", quality: "Masterwork", priceCp: 2225, priceDisplay: "1g 2si 25cp", descriptionFull: "Masterwork Flanged Mace. Steel head with radiating flanges mounted on a stout haft; leather-bound grip and wrist loop; concentrates force to crease and crack helmet plates. Masterwork artisans from Borderlands layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for short-range battering; targets helms and pauldrons." },
    { name: "Iron-Studded Great Club", region: "Island Clans", size: "Very Large", hands: 2, reach: "Long", description: "Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear.", fightingStyle: "Crushing sweeps and pounding overhead smashes", attackSpeed: 3, damage: 9.2, armorPen: "High", quality: "Standard", priceCp: 2085, priceDisplay: "1g 85cp", descriptionFull: "Iron-Studded Great Club. Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear. Trusted from Island Clans, it proves dependable steel sized for very large engagements. Favoured for crushing sweeps and pounding overhead smashes." },
    { name: "Iron-Studded Great Club", region: "Island Clans", size: "Very Large", hands: 2, reach: "Long", description: "Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear.", fightingStyle: "Crushing sweeps and pounding overhead smashes", attackSpeed: 3, damage: 9.2, armorPen: "High", quality: "Fine", priceCp: 3020, priceDisplay: "1g 10si 20cp", descriptionFull: "Fine Iron-Studded Great Club. Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear. Fine finishing from Island Clans dresses every fitting and coaxes a livelier balance out of its very large frame. Favoured for crushing sweeps and pounding overhead smashes." },
    { name: "Iron-Studded Great Club", region: "Island Clans", size: "Very Large", hands: 2, reach: "Long", description: "Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear.", fightingStyle: "Crushing sweeps and pounding overhead smashes", attackSpeed: 3, damage: 9.2, armorPen: "High", quality: "Masterwork", priceCp: 4895, priceDisplay: "2g 8si 95cp", descriptionFull: "Masterwork Iron-Studded Great Club. Heavy iron-shod wooden staff reinforced with rows of riveted studs; dark-blued rings and end-caps; demands strength and timing to bring its mass to bear. Masterwork artisans from Island Clans layer select steels, enrich the fittings, and tune the balance to heirloom precision. Favoured for crushing sweeps and pounding overhead smashes." },
  ],
};

export interface WeaponUpgradeOnHitEffect {
  chancePct: number;
  power?: number;
  durationSec?: number;
  stacksMax?: number;
  powerPct?: number;
  cdSec?: number;
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
          "Companion Blade"
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
        }
      }
    },
    {
      "match": {
        "category": "swords",
        "names": [
          "Falchion",
          "Steppe Sabre",
          "Blade of the Tide"
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
          "Great-Edge"
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
        }
      }
    },
    {
      "match": {
        "category": "daggers",
        "names": [
          "Misericorde",
          "Rondel",
          "Piercer"
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
          "Cairn Dirk"
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
          "Hooked War Axe"
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
          "Trident Fork"
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
        }
      }
    },
    {
      "match": {
        "category": "polearms",
        "names": [
          "Glaive",
          "River-Blade"
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
      }
    },
    {
      "match": {
        "category": "polearms",
        "names": [
          "Halberd",
          "Axe-Knife Polearm"
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
          "Meteor Chain"
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
      }
    },
    {
      "match": {
        "category": "whips",
        "names": [
          "Punisher Lash"
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
          "Short Staff"
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
          "Flanged Mace"
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
      }
    },
    {
      "match": {
        "category": "maces",
        "names": [
          "Iron-Studded Great Club"
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
      }
    }
  ]
} as const;
