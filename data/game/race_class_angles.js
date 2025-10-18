const anglesUrl = new URL("../race_class_angles.yaml", import.meta.url);
let anglesText;

try {
  const response = await fetch(anglesUrl);
  if (!response.ok) {
    throw new Error(`Failed to load race_class_angles.yaml: ${response.status} ${response.statusText}`);
  }
  anglesText = await response.text();
} catch (error) {
  if (anglesUrl.protocol === "file:") {
    const { readFile } = await import("fs/promises");
    anglesText = await readFile(anglesUrl, "utf8");
  } else {
    throw error;
  }
}

function parseAnglesYaml(text) {
  const root = {};
  const stack = [{ indent: -1, container: root, parent: null, key: null }];
  const lines = text.split(/\r?\n/);

  const isCommentOrEmpty = value => !value || value.startsWith("#");

  for (const rawLine of lines) {
    if (!rawLine) continue;
    const indentMatch = rawLine.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;
    const trimmed = rawLine.trim();
    if (isCommentOrEmpty(trimmed)) continue;

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1];

    if (trimmed.startsWith("- ")) {
      const value = trimmed.slice(2).trim();
      if (!Array.isArray(current.container)) {
        const array = [];
        if (current.parent && current.key != null) {
          current.parent[current.key] = array;
        } else if (stack.length === 1) {
          throw new Error("Invalid YAML structure: top-level sequence not supported");
        }
        current.container = array;
      }
      current.container.push(value);
      continue;
    }

    const match = trimmed.match(/^([^:]+):(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    const rest = match[2].trim();

    if (!rest) {
      const value = {};
      if (Array.isArray(current.container)) {
        const obj = {};
        current.container.push({ [key]: obj });
        stack.push({ indent, container: obj, parent: null, key: null });
      } else {
        current.container[key] = value;
        stack.push({ indent, container: value, parent: current.container, key });
      }
    } else {
      if (Array.isArray(current.container)) {
        current.container.push({ [key]: rest });
      } else {
        current.container[key] = rest;
      }
    }
  }

  return root;
}

const RAW_ANGLES = Object.freeze(parseAnglesYaml(anglesText));

function lookupCaseInsensitive(map, key) {
  if (!map || typeof map !== "object" || !key) return undefined;
  if (key in map) return map[key];
  const lower = key.toLowerCase();
  const matchKey = Object.keys(map).find(entry => entry.toLowerCase() === lower);
  return matchKey ? map[matchKey] : undefined;
}

export function getAnglesForRaceClass(race, className) {
  const defaultEntry = lookupCaseInsensitive(RAW_ANGLES, "default") || {};
  const raceEntry = race ? lookupCaseInsensitive(RAW_ANGLES, race) : undefined;
  const classAngles = raceEntry ? lookupCaseInsensitive(raceEntry, className) : undefined;
  if (Array.isArray(classAngles) && classAngles.length) return classAngles;
  const fallback = lookupCaseInsensitive(defaultEntry, className);
  return Array.isArray(fallback) ? fallback : [];
}

export function getAnglesMatrix() {
  return RAW_ANGLES;
}
