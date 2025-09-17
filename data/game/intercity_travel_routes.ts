export interface IntercityTravelRoute {
  from: string;
  to: string;
  durationDays: number | [number, number];
  mode: "land" | "sea" | "river" | "mixed";
  route: string;
}

export const INTERCITY_TRAVEL_ROUTES: IntercityTravelRoute[] = [
  { from: "Corona", to: "Corner Stone", durationDays: 6, mode: "land", route: "major road" },
  { from: "Corona", to: "Mountain Top", durationDays: 10, mode: "land", route: "major road" },
  { from: "Corona", to: "Whiteheart", durationDays: 4, mode: "land", route: "forest road" },
  { from: "Corner Stone", to: "Whiteheart", durationDays: 3, mode: "land", route: "rough forest road" },
  { from: "Corner Stone", to: "Dragon's Reach Road", durationDays: [6, 7], mode: "land", route: "northern forest road" },
  { from: "Wave's Break", to: "Mountain Top", durationDays: 10, mode: "land", route: "major road" },
  { from: "Wave's Break", to: "Coral Keep", durationDays: 7, mode: "sea", route: "gulf crossing" },
  { from: "Coral Keep", to: "Creekside", durationDays: 4, mode: "river", route: "river and gulf (shallow water vessels only)" },
  { from: "Coral Keep", to: "Timber Grove", durationDays: [5, 7], mode: "land", route: "mountain pass" },
  { from: "Creekside", to: "Timber Grove", durationDays: [7, 8], mode: "land", route: "river valley trail" },
  { from: "Creekside", to: "Warm Springs", durationDays: [2, 3], mode: "land", route: "mountain road" },
  { from: "Mountain Top", to: "Dancing Pines", durationDays: [5, 6], mode: "land", route: "highland road" },
];

export default INTERCITY_TRAVEL_ROUTES;
