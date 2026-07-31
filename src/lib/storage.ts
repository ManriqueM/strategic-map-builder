import type { StrategyMap } from "../types";

const STORAGE_KEY = "strategy-map-builder:maps";
const ENVELOPE_VERSION = 1;

export interface SavedMap {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  map: StrategyMap;
}

interface Envelope {
  version: number;
  maps: Record<string, SavedMap>;
}

function emptyEnvelope(): Envelope {
  return { version: ENVELOPE_VERSION, maps: {} };
}

function readEnvelope(): Envelope {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyEnvelope();
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || typeof parsed.maps !== "object") {
      return emptyEnvelope();
    }
    return { version: ENVELOPE_VERSION, maps: parsed.maps as Record<string, SavedMap> };
  } catch {
    return emptyEnvelope();
  }
}

function writeEnvelope(envelope: Envelope): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
}

function normalizeMap(saved: SavedMap): SavedMap {
  const needsConnections = !saved.map.connections;
  const needsStatus = saved.map.perspectives.some((p) =>
    p.objectives.some((o) => !o.status),
  );
  const needsInitiativeProgress = saved.map.perspectives.some((p) =>
    p.objectives.some((o) => o.initiatives.some((i) => !i.progress)),
  );
  if (!needsConnections && !needsStatus && !needsInitiativeProgress) return saved;
  return {
    ...saved,
    map: {
      ...saved.map,
      connections: saved.map.connections ?? [],
      perspectives: saved.map.perspectives.map((p) => ({
        ...p,
        objectives: p.objectives.map((o) => ({
          ...o,
          status: o.status ?? "none",
          initiatives: o.initiatives.map((i) => ({ ...i, progress: i.progress ?? "none" })),
        })),
      })),
    },
  };
}

export function listMaps(): SavedMap[] {
  const envelope = readEnvelope();
  return Object.values(envelope.maps)
    .map(normalizeMap)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getMap(id: string): SavedMap | undefined {
  const saved = readEnvelope().maps[id];
  return saved && normalizeMap(saved);
}

export function saveMap(id: string, name: string, map: StrategyMap): SavedMap {
  const envelope = readEnvelope();
  const existing = envelope.maps[id];
  const now = new Date().toISOString();
  const saved: SavedMap = {
    id,
    name,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    map,
  };
  envelope.maps[id] = saved;
  writeEnvelope(envelope);
  return saved;
}

export function renameMap(id: string, name: string): SavedMap | undefined {
  const envelope = readEnvelope();
  const existing = envelope.maps[id];
  if (!existing) return undefined;
  const updated: SavedMap = { ...existing, name, updatedAt: new Date().toISOString() };
  envelope.maps[id] = updated;
  writeEnvelope(envelope);
  return updated;
}

export function duplicateMap(id: string, newId: string, newName: string): SavedMap | undefined {
  const envelope = readEnvelope();
  const existing = envelope.maps[id];
  if (!existing) return undefined;
  const now = new Date().toISOString();
  const duplicate: SavedMap = {
    id: newId,
    name: newName,
    createdAt: now,
    updatedAt: now,
    map: normalizeMap(existing).map,
  };
  envelope.maps[newId] = duplicate;
  writeEnvelope(envelope);
  return duplicate;
}

export function deleteMap(id: string): void {
  const envelope = readEnvelope();
  delete envelope.maps[id];
  writeEnvelope(envelope);
}
