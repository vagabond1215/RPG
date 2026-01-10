# Codex Backstory Narrative Guidelines

Backstories now render through a four-beat pipeline so Codex biographies read like cohesive vignettes rather than stitched-together fragments. Every record that feeds the generator should supply:

1. **Early life beat** – establish childhood cadence, neighborhood texture, and early mentors. This text is stored under `biographyBeats.earlyLife`.
2. **Training beat** – describe how formal practice unfolded. The helper stitches this template together with the race cadence string (from `raceCadences`) and the dynamically built class philosophy drawn from `race_class_angles.yaml`.
3. **Moral test beat** – narrate a pivotal choice that reveals alignment nuance. The helper pairs this beat with the alignment reflection sentences defined in `backstory_helpers.createAlignmentReflection`.
4. **Lingering rumor beat** – close with a whispered consequence that hints at future hooks. The helper appends the lingering rumor stanza so every biography ends with a reflective line.

## Writing new data

- **Biography beats** should be declarative paragraphs written in full sentences. Use `{characterName}`, `{shortName}`, `{spawnDistrict}`, and the pronoun placeholders (`${pronoun.subject}`, `${pronoun.object}`, etc.) where you need dynamic gendering.
- **Race cadences** live in `raceCadences`. Provide a `default` entry per race that conveys cultural rhythm and how that community approaches training. Keep the sentence fluid so it can sit alongside the class philosophy fragment.
- **Avoid legacy inserts.** `classAlignmentInsert`, `alignmentMemory`, and `emberHook` are no longer consumed. Embed moral and philosophical cues directly in your prose.
- **Verb agreement matters.** The helpers conjugate verbs for singular and neutral they pronouns, but prefer neutral constructions when possible to minimise edge cases.

## Catalog fields and id semantics

- Backstory entries in `data/game/backstories.ts` use a stable, slug-style `id` and a short `title`.
- Narrative context lives in `origin`, `currentSituation`, and `motivation`, while `appearance`, `themes`, `responsibilities`, and `alignmentBias` round out the roleplay metadata.
- Optional `recommendedProfessionIds` should capture profession affinity without binding a backstory to a specific job loadout.
- Character creation persists both `backstoryId` and `jobId` in the save payload so the narrative and loadout can be restored independently.

## Sample biographies

The following samples were generated with the new pipeline and demonstrate the expected tone and structure.

### Elf — Coral Keep Athenaeum (Mage, Lawful Neutral)
Sariel catalogued the cadence of Coral Keep's bells while crystal light spilled across The South Docks & Steel Docks's lecture balconies. Sariel traded measured whispers with archivists and mapped the salt-laden drafts curling through the Auric Athenaeum.

Once the curators trusted Sariel with sealed stacks, she synchronized copying drills to the tower clocks and learned to translate memory into margins before the ink dried. Starlit scribes from The South Docks & Steel Docks insisted Sariel measure silence before action, gifting Sariel a patient, measured rhythm that threads through every mage form. Sariel treated sigil chalk ground beside midnight lamps like a sunrise drill, steadying her breath before the city stirred. She bound lecture margins packed with rune sketches to crystal quill, promising every apprentice that craft mattered more than spectacle. She still repeats ward candles rotated to follow stellar charts when dusk lessons drift toward doubt.

An edict banning sympathetic magic reached the Athenaeum the same week a refugee choir begged for rain, forcing Sariel to choose between quiet duty and the promise she made to librarians. Sariel once enforced a tribunal verdict against librarians, polishing crystal quill until the hall doors opened. She still studies the paperwork, reminding her that order is only honest when questioned.

Students still lean over the balcony rail to trade theories about which tome Sariel smuggled beneath that polished coat the night the bells rang thrice. Rumors still coil around an auric sigil, tucked where Sariel trusted her crystal quill to hide a promise. She still wonders if naming a forbidden footnote would heal librarians or scatter discipline.

### Dwarf — Warm Springs Forge (Templar, Lawful Good)
Brenna breathed mineral steam long before she traced the hymns etched into Warm Springs bathhouse pillars. Brenna timed resonant chants to the geysers that crowned Shrine Terrace's terraces at dawn.

Temple elders let Brenna anchor the dawn rotations once she proved able to braid incense, steam, and sermon into a single breath, and Brenna recorded the patterns on pumice slates. Stone-blooded mentors near Shrine Terrace hammered cadence into Brenna's shoulders, so Brenna hears each templar stance as another verse in the forge-sung litany. Brenna treated reliquaries weighed before tribunal sittings like a sunrise drill, steadying her breath before the city stirred. She bound edicts copied in meticulous script to ashwood hammer, promising every apprentice that craft mattered more than spectacle. She still repeats patrol boots shined for shrine inspections when dusk lessons drift toward doubt.

When a fever swept the terrace, Brenna confronted whether the city edicts or forge choir's pleas should guide the rationing of the springwater that made every ritual possible. Brenna once audited guild ledgers with ashwood hammer, refusing to abandon forge choir when a magistrate ordered silence. She still believes resolve only breathes when the law bends toward mercy.

Pilgrims murmur that the vents still answer Brenna's footsteps, and their guesses about what promise keeps her returning grow stranger each season. Rumors still coil around a radiant idol, tucked where Brenna trusted her ashwood hammer to hide a promise. She still wonders if naming a hidden oath would heal forge choir or scatter resolve.

### Cait Sith — Creekside Whisper (Scout, Chaotic Neutral)
Nim learned Creekside's moonlit rafters by scent, balancing over jasmine crates while barge songs drifted from Lantern Quay. Nim set playful stories to reed flutes for shrineboat spirits who preferred wit over coin.

The canal wardens eventually accepted Nim's patrol routes after they mapped every bridge shadow without torchlight, recording gossip in ink that smelled of lilac and rust. Lantern-proud Cait Sith kin along Lantern Quay taught Nim to read reflections before footsteps, letting Nim fold sly observation into every scout drill until the rhythm felt like second nature. Nim treated gull flights tracked from rooftop perches like a sunrise drill, steadying their breath before the city stirred. They bound river reeds braided into silent whistles to tideglass compass, promising every apprentice that craft mattered more than spectacle. They still repeat survey stakes hammered beside moonlit trails when dusk lessons drift toward doubt.

When a masked envoy offered hush money to divert barges away from canal couriers, Nim had to decide whether the district's fragile peace outweighed the law they recited as a pledge. Nim vanished from duty to chase a rumor tied to a mirrored coin, trusting tideglass compass to talk through any fallout. They still shrug at the reprimand and call freedom the only honest compass.

Lantern boat skippers still swap rumors about the night Nim left a sealed letter on the Perfumer's pier and stared at the moon until it set. Rumors still coil around a mirrored coin, tucked where Nim trusted their tideglass compass to hide a promise. They still wonder if naming a moonlit bargain would heal canal couriers or scatter curiosity.
