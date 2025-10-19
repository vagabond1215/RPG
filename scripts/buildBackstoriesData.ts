import fs from "fs";
import path from "path";

function normalizeWhitespace(text: string): string {
  return text.replace(/\r\n/g, "\n").trim();
}

function normalizeTag(tag: unknown): string | undefined {
  if (tag === undefined || tag === null) return undefined;
  const text = String(tag).trim();
  if (!text) return undefined;
  return text;
}

interface BeatOption {
  text: string;
  tags?: string[];
}

type RawBeatOption = string | { text?: string; summary?: string; tags?: unknown } | null | undefined;

type RawBeatValue = RawBeatOption | RawBeatOption[];

function normalizeBeatOption(option: RawBeatOption): BeatOption | undefined {
  if (!option) return undefined;
  if (typeof option === "string") {
    const text = normalizeWhitespace(option);
    return text ? { text } : undefined;
  }
  if (typeof option === "object") {
    const rawText = "text" in option ? option.text : option.summary;
    if (typeof rawText !== "string") return undefined;
    const text = normalizeWhitespace(rawText);
    if (!text) return undefined;
    const tags: string[] = [];
    const source = (option as { tags?: unknown }).tags;
    if (Array.isArray(source)) {
      for (const value of source) {
        const normalized = normalizeTag(value);
        if (normalized) tags.push(normalized);
      }
    }
    return tags.length ? { text, tags } : { text };
  }
  return undefined;
}

function normalizeBeatValue(value: RawBeatValue): BeatOption[] {
  if (Array.isArray(value)) {
    const options = value
      .map(entry => normalizeBeatOption(entry))
      .filter((entry): entry is BeatOption => Boolean(entry));
    return options;
  }
  const option = normalizeBeatOption(value);
  return option ? [option] : [];
}

function normalizeBiographyBeats(source: Record<string, RawBeatValue> | undefined): Record<string, BeatOption[]> {
  if (!source || typeof source !== "object") return {};
  const result: Record<string, BeatOption[]> = {};
  for (const [key, value] of Object.entries(source)) {
    const normalized = normalizeBeatValue(value as RawBeatValue);
    if (normalized.length) {
      result[key] = normalized;
    }
  }
  return result;
}

interface RawBackstoryEntry {
  id: string;
  title: string;
  characterName: string;
  race: string;
  class: string;
  alignment: string;
  availableIn: string[];
  spawnDistricts: string[];
  hook?: string;
  biographyBeats?: Record<string, RawBeatValue>;
  [key: string]: unknown;
}

interface BackstoriesFile {
  backstories: RawBackstoryEntry[];
  [key: string]: unknown;
}

const inputPath = path.resolve("data/backstories.json");
const outputPath = path.resolve("data/backstories_data.js");

const rawText = fs.readFileSync(inputPath, "utf8");
const parsed = JSON.parse(rawText) as BackstoriesFile;

const normalizedBackstories = Array.isArray(parsed.backstories)
  ? parsed.backstories.map(entry => ({
      ...entry,
      hook: typeof entry.hook === "string" ? entry.hook.trim() : entry.hook,
      biographyBeats: normalizeBiographyBeats(entry.biographyBeats),
    }))
  : [];

const normalizedData = {
  ...parsed,
  backstories: normalizedBackstories,
};

const output =
  "// Auto-generated from backstories.json to avoid relying on browser import assertions.\n" +
  `export default ${JSON.stringify(normalizedData, null, 2)};\n`;

fs.writeFileSync(outputPath, output);
