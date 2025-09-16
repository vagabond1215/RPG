export const WEAPON_SKILL_CATALOG = {
  Sword: {
    keyAttribute: "STR",
    secondaryAttribute: "DEX",
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Slash",
          target: "ST",
          description: "A fundamental sword swing that teaches proper weight transfer and edge alignment.",
          combatNotes: "Reliable single-target strike with quick recovery, ideal for opening an exchange or finishing weakened foes.",
          keywords: ["Damage", "Single Target", "Starter"]
        },
        {
          name: "Heavy Chop",
          target: "ST",
          description: "A weighty vertical chop that tests the wielder's strength and stance.",
          combatNotes: "Deals higher base damage than Slash but at a slower cadence, punishing exposed defenses.",
          keywords: ["Damage", "Single Target", "Power"]
        },
        {
          name: "Riposte",
          target: "ST",
          description: "A lightning counter-thrust delivered immediately after deflecting a blow.",
          combatNotes: "Strikes harder when timed after a block or parry, rewarding high proficiency and precise play.",
          keywords: ["Damage", "Single Target", "Counter"]
        },
        {
          name: "Piercing Lunge",
          target: "ST",
          description: "A driving thrust that closes distance with a single explosive step.",
          combatNotes: "Ignores a portion of physical guard, making it perfect for puncturing armored adversaries or distant threats.",
          keywords: ["Damage", "Single Target", "Gap Closer"]
        },
        {
          name: "Twin Strike",
          target: "ST",
          description: "A double cut that alternates edges mid-swing to overwhelm a guard.",
          combatNotes: "Delivers two quick hits that scale well with precision-based bonuses and critical modifiers.",
          keywords: ["Damage", "Single Target", "Combo"]
        }
      ],
      aoe: [
        {
          name: "Blade Sweep",
          target: "AoE",
          description: "A sweeping waist-high cut meant to clear space around the swordsman.",
          combatNotes: "Hits multiple targets in a forward arc, great for carving through clustered melee opponents.",
          keywords: ["Damage", "Area", "Cleave"]
        },
        {
          name: "Whirlwind Edge",
          target: "AoE",
          description: "A spinning flourish that turns the wielder into a whirlwind of steel.",
          combatNotes: "360-degree area attack that trades stamina for exceptional crowd control through damage pressure.",
          keywords: ["Damage", "Area", "360"]
        }
      ],
      mastery: {
        name: "Twin Strike (Mastery)",
        target: "ST",
        description: "A perfected dual cut that threads two lethal angles into a single motion.",
        combatNotes: "Adds a precision follow-up that dramatically increases critical damage and armor penetration.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Excalibur’s Wrath",
        target: "ST/AoE",
        description: "Unleash a radiant cross-cut that cleaves the battlefield in light.",
        combatNotes: "Ultimate sword technique that deals massive damage in a wide arc and leaves enemies staggered by the shockwave.",
        keywords: ["Damage", "Ultimate", "Burst", "Area"]
      },
      specials: [
        {
          name: "Hamstring",
          target: "ST",
          type: "Control",
          description: "A precise cut across the back of the leg to sever tendons.",
          combatNotes: "Inflicts a severe slow that scales with proficiency, crippling enemy movement and escape options.",
          keywords: ["Control", "Slow", "Single Target"],
          effect: { template: "disable", variant: "slow" }
        },
        {
          name: "Bleeding Edge",
          target: "ST",
          type: "DoT",
          description: "A deep cross slash that leaves opponents bleeding out.",
          combatNotes: "Applies a stacking bleed that punishes long fights and combos well with other sustained damage sources.",
          keywords: ["Damage", "Bleed", "Damage over Time"],
          effect: { template: "dot", school: "bleed" }
        }
      ]
    }
  },
  Greatsword: {
    keyAttribute: "STR",
    secondaryAttribute: null,
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Cleave Strike",
          target: "ST",
          description: "A heavy diagonal cleave that carries the weapon’s full momentum.",
          combatNotes: "Delivers punishing single-target damage and chips adjacent foes through shock impact.",
          keywords: ["Damage", "Single Target", "Heavy"]
        },
        {
          name: "Heavy Arc",
          target: "ST",
          description: "A broad swing that sweeps from shoulder to hip with crushing force.",
          combatNotes: "High damage attack ideal for breaking shields and forcing enemies off balance.",
          keywords: ["Damage", "Single Target", "Guard Break"]
        },
        {
          name: "Overhead Slam",
          target: "ST",
          description: "Raise the blade high before smashing it down like a falling guillotine.",
          combatNotes: "Concentrated blow that excels at cracking armor and staggering large foes.",
          keywords: ["Damage", "Single Target", "Armor Crush"]
        },
        {
          name: "Driving Impale",
          target: "ST",
          description: "A lunging thrust that drives the full weight of the blade through a target.",
          combatNotes: "Pierces defenses and deals bonus damage to enemies already staggered or stunned.",
          keywords: ["Damage", "Single Target", "Pierce"]
        },
        {
          name: "Decapitator",
          target: "ST",
          description: "A merciless swing aimed squarely at an opponent’s neck line.",
          combatNotes: "Devastating finisher with high critical payoff against weakened or bleeding foes.",
          keywords: ["Damage", "Single Target", "Execute"]
        }
      ],
      aoe: [
        {
          name: "Wide Arc",
          target: "AoE",
          description: "Sweep the greatsword in a huge arc to carve open a front line.",
          combatNotes: "Hits multiple foes in front with raw force, knocking light enemies backward.",
          keywords: ["Damage", "Area", "Knockback"]
        },
        {
          name: "Earthbreaker",
          target: "AoE",
          description: "Drive the blade into the ground to send a shockwave outward.",
          combatNotes: "Radial burst that damages and briefly destabilizes everyone caught near the impact.",
          keywords: ["Damage", "Area", "Shockwave"]
        }
      ],
      mastery: {
        name: "Decapitator (Mastery)",
        target: "ST",
        description: "A flawless execution swing that turns momentum into unstoppable lethality.",
        combatNotes: "Greatly increases decapitation threshold and massively boosts critical hit severity.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Cataclysmic Blade",
        target: "ST/AoE",
        description: "Channel the battlefield’s fury into one apocalyptic overhand strike.",
        combatNotes: "Ultimate slam that creates a fissure, damaging everything in front and sending debris skyward.",
        keywords: ["Damage", "Ultimate", "Area", "Burst"]
      },
      specials: [
        {
          name: "Crushing Blow",
          target: "ST",
          type: "Control",
          description: "A brutal pommel smash aimed at the opponent’s helm.",
          combatNotes: "Delivers a concussive stun that leaves enemies reeling and open to follow-up attacks.",
          keywords: ["Control", "Stun", "Single Target"],
          effect: { template: "disable", variant: "stun" }
        },
        {
          name: "Rend Armor",
          target: "ST",
          type: "Debuff",
          description: "A jagged upward drag that tears plates away from the target.",
          combatNotes: "Shreds physical defenses for the party, amplifying subsequent weapon strikes.",
          keywords: ["Debuff", "Armor", "Single Target"],
          effect: {
            template: "debuff",
            modifiers: [
              { stat: "DEF_PCT_DOWN", scale: "enhance" }
            ]
          }
        }
      ]
    }
  },
  Dagger: {
    keyAttribute: "DEX",
    secondaryAttribute: "LCK",
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Quick Stab",
          target: "ST",
          description: "A rapid jab aimed at exposed joints and arteries.",
          combatNotes: "Lightning-fast opener that builds combo points and pressures low-health targets.",
          keywords: ["Damage", "Single Target", "Starter"]
        },
        {
          name: "Dual Cut",
          target: "ST",
          description: "Twin slashes delivered from opposite hands in a criss-cross pattern.",
          combatNotes: "Two-hit strike that scales well with critical and on-hit effects.",
          keywords: ["Damage", "Single Target", "Dual Wield"]
        },
        {
          name: "Backstab",
          target: "ST",
          description: "Slip behind the target before driving the dagger between their ribs.",
          combatNotes: "Deals massive bonus damage when attacking from stealth or while the foe is distracted.",
          keywords: ["Damage", "Single Target", "Positional"]
        },
        {
          name: "Fan of Blades (single)",
          target: "ST",
          description: "A tight spread of daggers thrown in rapid succession.",
          combatNotes: "Single-target barrage that hits multiple times, excelling at shredding magical wards.",
          keywords: ["Damage", "Single Target", "Multi-Hit"]
        },
        {
          name: "Precision Strike",
          target: "ST",
          description: "A carefully measured thrust guided by instinct and luck.",
          combatNotes: "Ignores a large portion of armor and has elevated critical damage scaling.",
          keywords: ["Damage", "Single Target", "Armor Pierce"]
        }
      ],
      aoe: [
        {
          name: "Blade Flurry",
          target: "AoE",
          description: "Spin in place while slashing outward with both daggers.",
          combatNotes: "Hits everyone nearby with a flurry of light cuts, perfect for finishing weakened mobs.",
          keywords: ["Damage", "Area", "Whirl"]
        },
        {
          name: "Dance of Knives",
          target: "AoE",
          description: "A graceful weaving assault that scatters blades in every direction.",
          combatNotes: "Mobile area attack that keeps the rogue untouchable while carving through clustered foes.",
          keywords: ["Damage", "Area", "Mobile"]
        }
      ],
      mastery: {
        name: "Precision Strike (Mastery)",
        target: "ST",
        description: "A flawless heart-seeking thrust unleashed with uncanny timing.",
        combatNotes: "Dramatically boosts critical hit chance and enables near-guaranteed finishing blows.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Assassinate",
        target: "ST",
        description: "Disappear in a blur before reappearing behind the target for the kill.",
        combatNotes: "Ultimate execution that deals catastrophic damage, especially to unaware or disabled enemies.",
        keywords: ["Damage", "Ultimate", "Execute"]
      },
      specials: [
        {
          name: "Poisoned Blade",
          target: "ST",
          type: "DoT",
          description: "Coat the dagger in toxic venom before delivering a deep cut.",
          combatNotes: "Applies a stacking poison that deals damage over time and weakens enemy healing.",
          keywords: ["Poison", "Damage over Time", "Single Target"],
          effect: { template: "dot", school: "poison" }
        },
        {
          name: "Blindstrike",
          target: "ST",
          type: "Control",
          description: "A precise jab to the eyes that robs the target of sight.",
          combatNotes: "Temporarily blinds the foe, reducing their accuracy and chance to counterattack.",
          keywords: ["Control", "Blind", "Single Target"],
          effect: { template: "disable", variant: "blind" }
        }
      ]
    }
  },
  Axe: {
    keyAttribute: "STR",
    secondaryAttribute: null,
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Chop",
          target: "ST",
          description: "A basic but brutal chop aimed at shoulders or hips.",
          combatNotes: "Solid opener that digs into armor and sets up deeper cuts.",
          keywords: ["Damage", "Single Target", "Starter"]
        },
        {
          name: "Heavy Swing",
          target: "ST",
          description: "A wide overhand swing that leverages the axe's head-heavy design.",
          combatNotes: "High-impact strike that pushes enemies back and breaks their stance.",
          keywords: ["Damage", "Single Target", "Knockback"]
        },
        {
          name: "Crashing Blow",
          target: "ST",
          description: "Bring the axe down with enough force to crack stone.",
          combatNotes: "Deals massive single-hit damage and increases stagger build-up on large foes.",
          keywords: ["Damage", "Single Target", "Stagger"]
        },
        {
          name: "Hooked Strike",
          target: "ST",
          description: "Hook the axe head around a guard to yank it aside before striking.",
          combatNotes: "Bypasses shields and exposes the target to follow-up attacks from allies.",
          keywords: ["Damage", "Single Target", "Displace"]
        },
        {
          name: "Splitting Edge",
          target: "ST",
          description: "A vicious vertical strike meant to split foes from crown to chest.",
          combatNotes: "Excels at finishing heavily armored opponents with brutal efficiency.",
          keywords: ["Damage", "Single Target", "Execute"]
        }
      ],
      aoe: [
        {
          name: "Sweeping Chop",
          target: "AoE",
          description: "Sweep the axe in a low arc to cut through clustered legs.",
          combatNotes: "Area attack that slows enemies briefly by crippling their footing.",
          keywords: ["Damage", "Area", "Slow"]
        },
        {
          name: "Lumberjack’s Rage",
          target: "AoE",
          description: "A frenzy of chops that shatter everything in reach.",
          combatNotes: "Delivers repeated hits to all nearby enemies, ideal for clearing entrenched packs.",
          keywords: ["Damage", "Area", "Frenzy"]
        }
      ],
      mastery: {
        name: "Splitting Edge (Mastery)",
        target: "ST",
        description: "The apex axe execution that cleaves through armor and bone without slowing.",
        combatNotes: "Adds a devastating secondary impact that greatly increases finishing potential.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Executioner’s Cleave",
        target: "ST",
        description: "Channel all might into a single executioner's stroke.",
        combatNotes: "Ultimate single-target attack that deals colossal damage and guarantees a bleed on survivors.",
        keywords: ["Damage", "Ultimate", "Execute"]
      },
      specials: [
        {
          name: "Sundering Blow",
          target: "ST",
          type: "Debuff",
          description: "A shattering strike aimed at armor seams.",
          combatNotes: "Reduces the target’s physical resistance, amplifying all subsequent weapon hits.",
          keywords: ["Debuff", "Armor", "Single Target"],
          effect: {
            template: "debuff",
            modifiers: [
              { stat: "DEF_PCT_DOWN", scale: "enhance" }
            ]
          }
        },
        {
          name: "Maim",
          target: "ST",
          type: "Control",
          description: "A vicious hamstringing chop that mauls limbs.",
          combatNotes: "Inflicts a strong slow and reduces enemy attack speed through sheer pain.",
          keywords: ["Control", "Slow", "Single Target"],
          effect: { template: "disable", variant: "slow" }
        }
      ]
    }
  },
  Greataxe: {
    keyAttribute: "STR",
    secondaryAttribute: null,
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Bone Splitter",
          target: "ST",
          description: "A brutal chop designed to crush through the hardest of foes.",
          combatNotes: "Massive impact that leaves fractures and raises stagger on anything it hits.",
          keywords: ["Damage", "Single Target", "Heavy"]
        },
        {
          name: "Heavy Hack",
          target: "ST",
          description: "A relentless diagonal hack that carries the full weight of the greataxe.",
          combatNotes: "Hits like a runaway cart and cleaves through multiple bodies in a line.",
          keywords: ["Damage", "Single Target", "Line"]
        },
        {
          name: "Skull Cleaver",
          target: "ST",
          description: "Aim for the helm with an overhead smash intended to split skulls.",
          combatNotes: "High critical rate against stunned or prone targets.",
          keywords: ["Damage", "Single Target", "Critical"]
        },
        {
          name: "Ravager’s Cut",
          target: "ST",
          description: "A relentless flurry that tears from hip to shoulder.",
          combatNotes: "Sustained pressure strike that increases bleed build-up on each hit.",
          keywords: ["Damage", "Single Target", "Bleed"]
        },
        {
          name: "Titanic Chop",
          target: "ST",
          description: "Wind up before delivering a colossal chop that could fell a giant.",
          combatNotes: "The greataxe's highest raw damage strike, crushing even fortified foes.",
          keywords: ["Damage", "Single Target", "Colossal"]
        }
      ],
      aoe: [
        {
          name: "Reaper’s Swing",
          target: "AoE",
          description: "Swing the greataxe in a deadly waist-high arc.",
          combatNotes: "Broad sweep that clears a forward cone and inflicts heavy stagger.",
          keywords: ["Damage", "Area", "Cone"]
        },
        {
          name: "Mountain Splitter",
          target: "AoE",
          description: "Raise the axe overhead before cleaving the ground to send a shockwave.",
          combatNotes: "Area impact that cracks the terrain and leaves enemies slowed by falling debris.",
          keywords: ["Damage", "Area", "Shockwave"]
        }
      ],
      mastery: {
        name: "Titanic Chop (Mastery)",
        target: "ST",
        description: "The ultimate greataxe swing that harnesses unstoppable momentum.",
        combatNotes: "Adds an aftershock that ripples outward, damaging secondary targets as well.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Ragnarok Slash",
        target: "ST/AoE",
        description: "Bring about the end with a cataclysmic sweeping strike.",
        combatNotes: "Ultimate cleave that carves a flaming arc, hitting everything in a wide radius.",
        keywords: ["Damage", "Ultimate", "Area", "Burst"]
      },
      specials: [
        {
          name: "Knockback Smash",
          target: "ST",
          type: "Control",
          description: "A shoulder-first smash that sends enemies flying.",
          combatNotes: "Launches foes backward and interrupts casting or channeling.",
          keywords: ["Control", "Knockback", "Single Target"],
          effect: { template: "disable", variant: "stun" }
        },
        {
          name: "Hemorrhage",
          target: "ST",
          type: "DoT",
          description: "A savage cleave that opens arteries and refuses to close.",
          combatNotes: "Applies a brutal bleed that scales with strength, ideal for long boss encounters.",
          keywords: ["Damage", "Bleed", "Damage over Time"],
          effect: { template: "dot", school: "bleed" }
        }
      ]
    }
  },
  Spear: {
    keyAttribute: "STR",
    secondaryAttribute: "DEX",
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Thrust",
          target: "ST",
          description: "A direct thrust targeting the chest or abdomen.",
          combatNotes: "Fast lunge that keeps enemies at bay and sets up combos.",
          keywords: ["Damage", "Single Target", "Reach"]
        },
        {
          name: "Skewer",
          target: "ST",
          description: "Drive the spear straight through, using momentum to pin the foe.",
          combatNotes: "Deals bonus damage if the target is already slowed or rooted.",
          keywords: ["Damage", "Single Target", "Control Synergy"]
        },
        {
          name: "Piercing Strike",
          target: "ST",
          description: "A precise thrust aimed at weak points in armor.",
          combatNotes: "Ignores a significant portion of armor and shields.",
          keywords: ["Damage", "Single Target", "Armor Pierce"]
        },
        {
          name: "Dragoon’s Dive",
          target: "ST",
          description: "Leap skyward before descending spear-first onto the target.",
          combatNotes: "Gap-closing strike that deals bonus damage when initiated from range.",
          keywords: ["Damage", "Single Target", "Gap Closer"]
        },
        {
          name: "Impaling Drive",
          target: "ST",
          description: "Brace and drive the spear forward with unstoppable force.",
          combatNotes: "Extremely high penetration capable of pinning large foes in place.",
          keywords: ["Damage", "Single Target", "Pin"]
        }
      ],
      aoe: [
        {
          name: "Sweeping Spear",
          target: "AoE",
          description: "Swing the spear in a wide circle to clear surrounding enemies.",
          combatNotes: "Area sweep that inflicts minor bleeding, deterring foes from closing in.",
          keywords: ["Damage", "Area", "Cleave"]
        },
        {
          name: "Pike Wall",
          target: "AoE",
          description: "Set the spear in place to create an impaling barrier.",
          combatNotes: "Creates a defensive zone that damages and slows enemies who push through.",
          keywords: ["Damage", "Area", "Control"]
        }
      ],
      mastery: {
        name: "Impaling Drive (Mastery)",
        target: "ST",
        description: "Channel every lesson into a relentless penetrating thrust.",
        combatNotes: "Pins even gigantic foes and inflicts a heavy bleed over the duration of the pin.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Dragon’s Fang",
        target: "ST",
        description: "Summon draconic force through the spear and strike straight through the enemy.",
        combatNotes: "Ultimate line thrust that devastates the primary target and shocks those behind it.",
        keywords: ["Damage", "Ultimate", "Line"]
      },
      specials: [
        {
          name: "Pinning Strike",
          target: "ST",
          type: "Control",
          description: "Skewer the target's leg to nail them to the ground.",
          combatNotes: "Immobilizes the foe, preventing movement and dashes for the duration.",
          keywords: ["Control", "Immobilize", "Single Target"],
          effect: { template: "disable", variant: "immobilize" }
        },
        {
          name: "Heartpiercer",
          target: "ST",
          type: "DoT",
          description: "A twisting thrust that leaves mortal wounds behind.",
          combatNotes: "Applies a grievous bleed that scales with both strength and dexterity.",
          keywords: ["Damage", "Bleed", "Damage over Time"],
          effect: { template: "dot", school: "bleed" }
        }
      ]
    }
  },
  Bow: {
    keyAttribute: "DEX",
    secondaryAttribute: "AGI",
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Quick Shot",
          target: "ST",
          description: "Loose an arrow the instant the string is drawn.",
          combatNotes: "Fast-firing shot ideal for keeping pressure while on the move.",
          keywords: ["Damage", "Single Target", "Fast"]
        },
        {
          name: "Power Shot",
          target: "ST",
          description: "Draw the bow to its limit for a punishing release.",
          combatNotes: "High-damage arrow that can stagger on impact when fully charged.",
          keywords: ["Damage", "Single Target", "Charged"]
        },
        {
          name: "Piercing Arrow",
          target: "ST",
          description: "A needle-like arrow meant to punch through armor.",
          combatNotes: "Penetrates shields and continues through to lightly damage a target behind.",
          keywords: ["Damage", "Single Target", "Pierce"]
        },
        {
          name: "Double Nock",
          target: "ST",
          description: "Loose two arrows in quick succession without fully resetting your aim.",
          combatNotes: "Twin hits that benefit from on-hit procs and elemental coatings.",
          keywords: ["Damage", "Single Target", "Multi-Hit"]
        },
        {
          name: "Sniper’s Mark",
          target: "ST",
          description: "Carefully line up a shot that lands exactly where it hurts most.",
          combatNotes: "Long-range precision shot with immense critical chance and damage.",
          keywords: ["Damage", "Single Target", "Critical"]
        }
      ],
      aoe: [
        {
          name: "Arrow Rain",
          target: "AoE",
          description: "Signal a volley that rains arrows down over a target area.",
          combatNotes: "Area denial that blankets enemies with continuous hits.",
          keywords: ["Damage", "Area", "Zone"]
        },
        {
          name: "Explosive Arrow",
          target: "AoE",
          description: "A powder-tipped arrow that detonates on impact.",
          combatNotes: "Burst of area damage that leaves burning ground for a short time.",
          keywords: ["Damage", "Area", "Explosion"]
        }
      ],
      mastery: {
        name: "Sniper’s Mark (Mastery)",
        target: "ST",
        description: "The ultimate long-range shot delivered with unerring focus.",
        combatNotes: "Guarantees critical hits and gains bonus damage with every meter of travel.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Storm of Arrows",
        target: "AoE",
        description: "Call upon the skies to unleash a storm of ethereal arrows.",
        combatNotes: "Ultimate area bombardment that saturates a wide zone with heavy damage.",
        keywords: ["Damage", "Ultimate", "Area", "Zone"]
      },
      specials: [
        {
          name: "Crippling Arrow",
          target: "ST",
          type: "Control",
          description: "Loose an arrow that splinters inside the target’s leg.",
          combatNotes: "Applies a powerful slow and reduces the target's evasion.",
          keywords: ["Control", "Slow", "Single Target"],
          effect: { template: "disable", variant: "slow" }
        },
        {
          name: "Poison Arrow",
          target: "ST",
          type: "DoT",
          description: "A venom-coated arrow that leaves a toxic wound.",
          combatNotes: "Stacks poison damage over time and weakens enemy healing received.",
          keywords: ["Poison", "Damage over Time", "Single Target"],
          effect: { template: "dot", school: "poison" }
        }
      ]
    }
  },
  Crossbow: {
    keyAttribute: "DEX",
    secondaryAttribute: "STR",
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Quick Bolt",
          target: "ST",
          description: "Snap off a quick shot with a light crossbow.",
          combatNotes: "Rapid fire bolt that keeps pressure on agile foes.",
          keywords: ["Damage", "Single Target", "Fast"]
        },
        {
          name: "Piercer Bolt",
          target: "ST",
          description: "A hardened bolt designed to punch through shields.",
          combatNotes: "Ignores a portion of armor and continues through to strike secondary targets for reduced damage.",
          keywords: ["Damage", "Single Target", "Pierce"]
        },
        {
          name: "Rapid Fire",
          target: "ST",
          description: "Loose a burst of bolts by fanning the trigger.",
          combatNotes: "Multiple quick hits that stack on-hit effects and criticals.",
          keywords: ["Damage", "Single Target", "Burst"]
        },
        {
          name: "Heavy Bolt",
          target: "ST",
          description: "A heavy crank-shot meant for armored targets.",
          combatNotes: "Slow but devastating bolt that deals bonus damage to constructs and plated foes.",
          keywords: ["Damage", "Single Target", "Armor Break"]
        },
        {
          name: "Sharpshot",
          target: "ST",
          description: "Line up a precise crossbow shot with deadly accuracy.",
          combatNotes: "Extremely accurate strike with enhanced critical chance and range.",
          keywords: ["Damage", "Single Target", "Critical"]
        }
      ],
      aoe: [
        {
          name: "Scattershot",
          target: "AoE",
          description: "Fire a spread of bolts that blanket a corridor.",
          combatNotes: "Short-range cone that peppers multiple enemies at once.",
          keywords: ["Damage", "Area", "Cone"]
        },
        {
          name: "Explosive Bolt",
          target: "AoE",
          description: "A volatile bolt that detonates shortly after impact.",
          combatNotes: "Area explosion that deals heavy damage and briefly disorients survivors.",
          keywords: ["Damage", "Area", "Explosion"]
        }
      ],
      mastery: {
        name: "Sharpshot (Mastery)",
        target: "ST",
        description: "An impeccable crossbow shot that never misses its mark.",
        combatNotes: "Guaranteed hit that critically strikes and pierces through lined-up foes.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Ballista’s Wrath",
        target: "ST",
        description: "Wind a colossal siege bolt and fire it with lethal force.",
        combatNotes: "Ultimate single-target shot that devastates the primary foe and shatters fortifications behind them.",
        keywords: ["Damage", "Ultimate", "Siege"]
      },
      specials: [
        {
          name: "Crippling Bolt",
          target: "ST",
          type: "Control",
          description: "A barbed bolt that shreds tendons on impact.",
          combatNotes: "Severely slows the target and reduces their attack speed.",
          keywords: ["Control", "Slow", "Single Target"],
          effect: { template: "disable", variant: "slow" }
        },
        {
          name: "Bolted Net",
          target: "ST",
          type: "Control",
          description: "Launch a weighted net that pins enemies to the ground.",
          combatNotes: "Immobilizes the target and briefly silences them while they struggle free.",
          keywords: ["Control", "Immobilize", "Single Target"],
          effect: { template: "disable", variant: "immobilize" }
        }
      ]
    }
  },
  Mace: {
    keyAttribute: "STR",
    secondaryAttribute: "CON",
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Bash",
          target: "ST",
          description: "A blunt strike to test an opponent’s guard.",
          combatNotes: "Reliable opener that deals solid damage and builds stagger.",
          keywords: ["Damage", "Single Target", "Starter"]
        },
        {
          name: "Crushing Blow",
          target: "ST",
          description: "Bring the mace down with bone-shattering force.",
          combatNotes: "High impact strike that increases stun buildup on heavy foes.",
          keywords: ["Damage", "Single Target", "Stagger"]
        },
        {
          name: "Skullbreaker",
          target: "ST",
          description: "Aim for the helm with brutal intent.",
          combatNotes: "Has a high chance to inflict a short daze on hit.",
          keywords: ["Damage", "Single Target", "Daze"]
        },
        {
          name: "Smite",
          target: "ST",
          description: "Channel righteous fury into a downward strike.",
          combatNotes: "Deals bonus radiant damage to undead and fiends.",
          keywords: ["Damage", "Single Target", "Holy"]
        },
        {
          name: "Pulverize",
          target: "ST",
          description: "Pulverize bones and armor with repeated heavy swings.",
          combatNotes: "Slow but devastating series of hits that ignore a portion of defense.",
          keywords: ["Damage", "Single Target", "Armor Crush"]
        }
      ],
      aoe: [
        {
          name: "Earthshaker",
          target: "AoE",
          description: "Slam the mace into the ground to send tremors outward.",
          combatNotes: "Area impact that damages and briefly stuns nearby enemies.",
          keywords: ["Damage", "Area", "Stun"]
        },
        {
          name: "Shockwave Smash",
          target: "AoE",
          description: "Follow up with a second ground slam that releases a shockwave.",
          combatNotes: "Extends the tremor radius and keeps foes off their feet.",
          keywords: ["Damage", "Area", "Shockwave"]
        }
      ],
      mastery: {
        name: "Pulverize (Mastery)",
        target: "ST",
        description: "An unstoppable sequence of crushing blows that never relents.",
        combatNotes: "Adds armor sundering and increases the duration of enemy stuns.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Divine Judgment",
        target: "ST/AoE",
        description: "Call down a pillar of radiant force through the mace.",
        combatNotes: "Ultimate smite that deals holy damage in an area and sears enemies with lingering light.",
        keywords: ["Damage", "Ultimate", "Area", "Holy"]
      },
      specials: [
        {
          name: "Concussive Strike",
          target: "ST",
          type: "Control",
          description: "A ringing blow to the head meant to dizzy foes.",
          combatNotes: "Applies a moderate stun and reduces enemy accuracy while it lasts.",
          keywords: ["Control", "Stun", "Single Target"],
          effect: { template: "disable", variant: "stun" }
        },
        {
          name: "Armor Shatter",
          target: "ST",
          type: "Debuff",
          description: "Smash armor joints until plates fall apart.",
          combatNotes: "Greatly reduces enemy physical defense for the party.",
          keywords: ["Debuff", "Armor", "Single Target"],
          effect: {
            template: "debuff",
            modifiers: [
              { stat: "DEF_PCT_DOWN", scale: "enhance" }
            ]
          }
        }
      ]
    }
  },
  Staff: {
    keyAttribute: "STR",
    secondaryAttribute: "AGI",
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Staff Strike",
          target: "ST",
          description: "A quick jab to keep opponents at bay.",
          combatNotes: "Fast strike with extended reach and excellent guard damage.",
          keywords: ["Damage", "Single Target", "Reach"]
        },
        {
          name: "Heavy Swing",
          target: "ST",
          description: "Swing the staff in a heavy arc for a stunning impact.",
          combatNotes: "High stagger potential that opens foes for follow-ups.",
          keywords: ["Damage", "Single Target", "Stagger"]
        },
        {
          name: "Spinning Strike",
          target: "ST",
          description: "Spin the staff to deliver a flurry of strikes.",
          combatNotes: "Multi-hit attack that excels at stripping defensive buffs.",
          keywords: ["Damage", "Single Target", "Multi-Hit"]
        },
        {
          name: "Crushing Jab",
          target: "ST",
          description: "Drive the reinforced tip into the target’s midsection.",
          combatNotes: "Pierces defenses and inflicts a brief stagger.",
          keywords: ["Damage", "Single Target", "Pierce"]
        },
        {
          name: "Staff Combo",
          target: "ST",
          description: "String together strikes to overwhelm the opponent.",
          combatNotes: "Combo finisher that scales with momentum buffs and attack speed.",
          keywords: ["Damage", "Single Target", "Combo"]
        }
      ],
      aoe: [
        {
          name: "Whirling Sweep",
          target: "AoE",
          description: "Spin the staff low to trip surrounding enemies.",
          combatNotes: "Area sweep that briefly knocks enemies off balance.",
          keywords: ["Damage", "Area", "Trip"]
        },
        {
          name: "Quarterstaff Dance",
          target: "AoE",
          description: "A flowing sequence of spins and strikes around the wielder.",
          combatNotes: "Sustained area pressure that excels at controlling crowds.",
          keywords: ["Damage", "Area", "Control"]
        }
      ],
      mastery: {
        name: "Staff Combo (Mastery)",
        target: "ST",
        description: "A perfected combo that leaves no opening.",
        combatNotes: "Adds an empowered finisher that boosts subsequent attack speed.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Sage’s Wrath",
        target: "AoE",
        description: "Channel ancient technique to strike every foe in reach.",
        combatNotes: "Ultimate area barrage that chains together multiple crushing impacts.",
        keywords: ["Damage", "Ultimate", "Area", "Combo"]
      },
      specials: [
        {
          name: "Stunning Sweep",
          target: "ST",
          type: "Control",
          description: "A sweeping strike aimed at the temple.",
          combatNotes: "Applies a short-duration stun ideal for interrupting spellcasters.",
          keywords: ["Control", "Stun", "Single Target"],
          effect: { template: "disable", variant: "stun" }
        },
        {
          name: "Momentum Flow",
          target: "ST",
          type: "Enhance",
          description: "Channel rhythmic motion to accelerate your attacks.",
          combatNotes: "Grants attack and movement speed bonuses that stack with combos.",
          keywords: ["Enhance", "Buff", "Self"],
          effect: { template: "momentum" }
        }
      ]
    }
  },
  Shield: {
    keyAttribute: "CON",
    secondaryAttribute: "VIT",
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Shield Bash",
          target: "ST",
          description: "A quick bash to stagger the opponent.",
          combatNotes: "Low-cost strike that interrupts enemy attacks and builds threat.",
          keywords: ["Damage", "Single Target", "Interrupt"]
        },
        {
          name: "Guard Slam",
          target: "ST",
          description: "Slam the shield edge-first to knock the foe off balance.",
          combatNotes: "Deals solid damage and generates additional guard meter.",
          keywords: ["Damage", "Single Target", "Guard"]
        },
        {
          name: "Iron Wall",
          target: "ST",
          description: "A reinforced shield thrust that shrugs off retaliation.",
          combatNotes: "Damage scales with Constitution and increases block chance temporarily.",
          keywords: ["Damage", "Single Target", "Defense"]
        },
        {
          name: "Tower Slam",
          target: "ST",
          description: "Lift and slam the shield like a falling tower.",
          combatNotes: "High damage strike that briefly stuns smaller foes.",
          keywords: ["Damage", "Single Target", "Stun"]
        },
        {
          name: "Retribution Strike",
          target: "ST",
          description: "Return stored kinetic force in a punishing blow.",
          combatNotes: "Damage increases when performed after blocking or absorbing hits.",
          keywords: ["Damage", "Single Target", "Counter"]
        }
      ],
      aoe: [
        {
          name: "Shield Wave",
          target: "AoE",
          description: "Release a wave of force by slamming the shield into the ground.",
          combatNotes: "Area knockback that buys breathing room for allies.",
          keywords: ["Damage", "Area", "Knockback"]
        },
        {
          name: "Bulwark Circle",
          target: "AoE",
          description: "Spin with the shield extended to clear space around you.",
          combatNotes: "Circular sweep that taunts enemies and reinforces guard strength.",
          keywords: ["Damage", "Area", "Guard"]
        }
      ],
      mastery: {
        name: "Retribution Strike (Mastery)",
        target: "ST",
        description: "A perfected riposte that turns defense into unstoppable force.",
        combatNotes: "Reflects a portion of absorbed damage back at the attacker while striking.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Aegis of Valor",
        target: "AoE",
        description: "Raise the shield high to project an impenetrable dome.",
        combatNotes: "Ultimate defensive technique that shields allies and retaliates with radiant pulses.",
        keywords: ["Ultimate", "Shield", "Support"]
      },
      specials: [
        {
          name: "Shield of Recovery",
          target: "ST",
          type: "Heal",
          description: "Channel restorative force through the shield.",
          combatNotes: "Restores health based on Constitution, ideal for emergency self-sustain.",
          keywords: ["Heal", "Self", "Sustain"],
          effect: { template: "heal", attribute: "CON", coeffMultiplier: 0.8 }
        },
        {
          name: "Guardian’s Roar",
          target: "AoE",
          type: "Buff",
          description: "A rallying shout that steels allies’ resolve.",
          combatNotes: "Grants nearby allies damage reduction and boosts their guard strength.",
          keywords: ["Buff", "Support", "Area"],
          effect: {
            template: "buff",
            target: "AoE",
            mods: {
              DMG_REDUCTION_PCT: "enhance"
            }
          }
        }
      ]
    }
  },
  Wand: {
    keyAttribute: "INT",
    secondaryAttribute: "WIS",
    resourceType: "mana",
    skills: {
      st: [
        {
          name: "Focused Bolt",
          target: "ST",
          description: "Focus arcane energy into a concentrated bolt.",
          combatNotes: "Reliable single-target spell that scales purely with intellect.",
          keywords: ["Damage", "Single Target", "Arcane"]
        },
        {
          name: "Arc Lash",
          target: "ST",
          description: "Whip crackling energy across the target.",
          combatNotes: "Hits quickly and applies a brief shock debuff, setting up combos.",
          keywords: ["Damage", "Single Target", "Shock"]
        },
        {
          name: "Resonant Pierce",
          target: "ST",
          description: "A piercing beam that harmonizes with magical barriers.",
          combatNotes: "Ignores a portion of elemental resistance and disrupts wards.",
          keywords: ["Damage", "Single Target", "Pierce"]
        },
        {
          name: "Channelled Ray",
          target: "ST",
          description: "Channel a sustained ray of energy that bores through armor.",
          combatNotes: "Deals continuous damage and scales well with spell haste buffs.",
          keywords: ["Damage", "Single Target", "Channel"]
        },
        {
          name: "Prism Break",
          target: "ST",
          description: "Split arcane light into multiple converging beams.",
          combatNotes: "High burst spell that deals bonus damage to shielded targets.",
          keywords: ["Damage", "Single Target", "Burst"]
        }
      ],
      aoe: [
        {
          name: "Scatter Pulse",
          target: "AoE",
          description: "Release a wave of arcane pulses that ricochet between foes.",
          combatNotes: "Area spell that hits multiple targets with cascading bolts.",
          keywords: ["Damage", "Area", "Arcane"]
        },
        {
          name: "Arc Nova",
          target: "AoE",
          description: "Detonate a ring of energy that expands outward.",
          combatNotes: "Creates a large burst that deals heavy damage and briefly weakens magical defenses.",
          keywords: ["Damage", "Area", "Burst"]
        }
      ],
      mastery: {
        name: "Prism Break (Mastery)",
        target: "ST",
        description: "A flawless spectrum beam that amplifies itself mid-flight.",
        combatNotes: "Adds a second refracted beam that increases damage and applies a short weaken debuff.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Starfall Conduit",
        target: "AoE",
        description: "Open a conduit to the stars and rain down concentrated starlight.",
        combatNotes: "Ultimate spell that bombards a wide area with repeated arcane impacts.",
        keywords: ["Damage", "Ultimate", "Area", "Arcane"]
      },
      specials: [
        {
          name: "Mind Lock",
          target: "ST",
          type: "Control",
          description: "Bind the target’s thoughts with a crushing mental grip.",
          combatNotes: "Applies a potent stun that also silences the target for the duration.",
          keywords: ["Control", "Stun", "Single Target"],
          effect: { template: "disable", variant: "paralyze" }
        },
        {
          name: "Mana Siphon",
          target: "ST",
          type: "Enhance",
          description: "Leech arcane energy from the target and feed it back to the caster.",
          combatNotes: "Grants lifesteal and minor mana regeneration on hit for a short period.",
          keywords: ["Enhance", "Lifesteal", "Self"],
          effect: { template: "lifesteal" }
        }
      ]
    }
  },
  Unarmed: {
    keyAttribute: "STR",
    secondaryAttribute: "AGI",
    resourceType: "stamina",
    skills: {
      st: [
        {
          name: "Jab Cross",
          target: "ST",
          description: "A rapid one-two combo that keeps foes guessing.",
          combatNotes: "Fast strikes that build combo momentum and exploit openings.",
          keywords: ["Damage", "Single Target", "Combo"]
        },
        {
          name: "Elbow Smash",
          target: "ST",
          description: "Drive an elbow into the target at close range.",
          combatNotes: "Deals heavy stagger damage and disrupts casting.",
          keywords: ["Damage", "Single Target", "Stagger"]
        },
        {
          name: "Rising Uppercut",
          target: "ST",
          description: "Launch the enemy skyward with a powerful uppercut.",
          combatNotes: "Juggles lighter foes and leaves them vulnerable mid-air.",
          keywords: ["Damage", "Single Target", "Launcher"]
        },
        {
          name: "Tiger Palm",
          target: "ST",
          description: "A focused palm strike that channels inner force.",
          combatNotes: "Deals bonus damage when chi-enhancing buffs are active.",
          keywords: ["Damage", "Single Target", "Chi"]
        },
        {
          name: "Dragon Fang Kick",
          target: "ST",
          description: "A spinning heel kick that crackles with inner energy.",
          combatNotes: "High-damage finisher with excellent critical scaling.",
          keywords: ["Damage", "Single Target", "Finisher"]
        }
      ],
      aoe: [
        {
          name: "Sweeping Heel",
          target: "AoE",
          description: "Sweep the leg in a wide arc to knock down nearby foes.",
          combatNotes: "Area attack that topples enemies, reducing their evasion.",
          keywords: ["Damage", "Area", "Knockdown"]
        },
        {
          name: "Shockwave Clap",
          target: "AoE",
          description: "Clap your hands to release a concussive wave of chi.",
          combatNotes: "Short-range blast that stuns lightly armored foes and interrupts spellcasting.",
          keywords: ["Damage", "Area", "Stun"]
        }
      ],
      mastery: {
        name: "Dragon Fang Kick (Mastery)",
        target: "ST",
        description: "Channel perfected chi through a devastating spin kick.",
        combatNotes: "Adds a chi shockwave that deals extra damage and briefly slows enemies struck.",
        keywords: ["Damage", "Single Target", "Mastery"]
      },
      ultimate: {
        name: "Heavenly Comet Fist",
        target: "ST",
        description: "Gather immense chi before striking like a falling star.",
        combatNotes: "Ultimate single-target technique that detonates on impact, dealing splash damage.",
        keywords: ["Damage", "Ultimate", "Burst"]
      },
      specials: [
        {
          name: "Nerve Strike",
          target: "ST",
          type: "Control",
          description: "A precision jab to critical nerve clusters.",
          combatNotes: "Paralyzes the target briefly, stopping movement and actions.",
          keywords: ["Control", "Paralyze", "Single Target"],
          effect: { template: "disable", variant: "paralyze" }
        },
        {
          name: "Chi Siphon",
          target: "ST",
          type: "Enhance",
          description: "Drain vitality with each strike and recycle it as your own.",
          combatNotes: "Grants powerful lifesteal and minor chi regeneration on hit.",
          keywords: ["Enhance", "Lifesteal", "Self"],
          effect: { template: "lifesteal" }
        }
      ]
    }
  }
};
