# Kingdom Hex Grid Reference

The kingdom map uses an axial hex coordinate system maintained in `data/game/hexGrid.ts`. Each entry in `KINGDOM_HEX_GRID` binds a settlement or point of interest to:

- **Axial coordinates (`q`, `r`)** that identify its position relative to the capital at `(0, 0)`.
- **Habitat and terrain context** so location-aware systems can surface appropriate encounters, resources, and weather patterns.
- **Supported travel modes** (road, river, sea, trail, mountain pass, or portage) paired with a default travel method (walk, wagon, horse, ship, or river barge).
- **Neighbor connections** that declare the method used, distance, environmental conditions (biome, weather, wind, currents, and time of day), logistical upgrades (roads, depots, beacons, locks, etc.), the computed travel time, and optional narrative notes.

## Adding or Updating Locations

1. Pick axial coordinates for the new hex. Neighboring hexes differ by one step in any of the six directions; use `axialToCube` and `hexDistance` from the module to validate spacing.
2. Define the habitat, terrain, elevation, and notable features that characterize the location.
3. List available travel modes. The shared helpers map each mode to a default travel method (for example, roads prefer wagons while mountain passes assume surefooted mounts) and baseline pacing via `TRAVEL_METHOD_DAYS_PER_HEX` / `TRAVEL_MODE_DAYS_PER_HEX`.
4. Document neighbors and their connecting routes. Provide the `method` in use and a `conditions` block when the route warrants special treatment:
   - `biome` tags (grassland, forest, marsh, mountain, urban, river, or open/coastal waters) influence footing and navigation.
   - Weather, wind, current, and time-of-day modifiers capture seasonal storms, prevailing currents, or nocturnal marches.
   - Logistics improvements (paved roads, supply depots, stone switchbacks, harbor pilots, etc.) encode ongoing investments that speed—or occasionally slow—travel.
   The calculator will derive the travel time from these factors, but you can still hard-code `travelTimeDays` when a story beat demands a bespoke duration.
5. Update the matching entry in `data/game/locations.ts` to call `createLocation` with the same name and a bespoke description. The factory throws if the hex metadata is missing, keeping the map and narrative in sync.

## Testing the Grid

Run `npm test` to execute the Vitest suite. `tests/hexGrid.test.ts` covers coordinate math, travel pacing, and wiring between the hex grid and registered locations. Extend the tests when you introduce new travel modes or unusual distance calculations.
