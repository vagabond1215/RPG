import { CLASSES, type ClassId } from "./classes";

export interface GuildDefinition {
  id: string;
  name: string;
  description: string;
  subdivisions?: ClassId[];
}

const TIER_ONE_CLASS_IDS = CLASSES.filter(entry => entry.tier === 1).map(entry => entry.id);

export const GUILDS = [
  {
    id: "adventurers_guild",
    name: "Adventurers' Guild",
    description:
      "Umbrella organization for monster hunters, explorers, and freelance protectors across the realm.",
    subdivisions: TIER_ONE_CLASS_IDS,
  },
  {
    id: "merchant_guild",
    name: "Merchant Guild",
    description:
      "Consortium of caravans, brokers, and factors regulating trade routes and market standards.",
  },
  {
    id: "workers_guild",
    name: "Workers' Guild",
    description:
      "Collective of laborers, builders, and civic trades overseeing work rosters and safety charters.",
  },
  {
    id: "agricultural_guild",
    name: "Agricultural Guild",
    description:
      "Stewards of farms, mills, and rural supply chains coordinating harvest cycles and granaries.",
  },
] as const satisfies GuildDefinition[];

export type GuildId = (typeof GUILDS)[number]["id"];

export const GUILD_BY_ID = Object.fromEntries(
  GUILDS.map(entry => [entry.id, entry]),
) as Record<GuildId, GuildDefinition>;
