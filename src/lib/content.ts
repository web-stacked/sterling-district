import { loadCollection, loadEntry } from '@caretcms/core/runtime';

// Eager-import every seed file at build time so pages can render from local JSON.
const seedModules = import.meta.glob<Record<string, unknown>>(
  '../content/seeds/**/*.json',
  { eager: true, import: 'default' },
);

export interface ContentEntry<T = Record<string, unknown>> {
  id: string;
  data: T;
}

export interface ContentEntryResult<T = Record<string, unknown>> {
  entry: ContentEntry<T> | undefined;
  error: Error | undefined;
}

export interface ContentCollectionResult<T = Record<string, unknown>> {
  entries: ContentEntry<T>[];
  error: Error | undefined;
}

function getSeed(collection: string, id: string): Record<string, unknown> | null {
  const path = `../content/seeds/${collection}/${id}.json`;
  return (seedModules[path] as Record<string, unknown>) ?? null;
}

function getSeedIds(collection: string): string[] {
  const prefix = `../content/seeds/${collection}/`;
  return Object.keys(seedModules)
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.slice(prefix.length, -5));
}

async function getRuntimeEntry<T>(
  collection: string,
  id: string,
): Promise<ContentEntry<T> | null> {
  try {
    const data = await loadEntry(collection, id);
    return data ? { id, data: data as T } : null;
  } catch {
    return null;
  }
}

async function getRuntimeCollection<T>(
  collection: string,
): Promise<ContentEntry<T>[] | null> {
  try {
    const entries = await loadCollection(collection);
    return entries.map((entry) => ({
      id: entry.id,
      data: entry.data as T,
    }));
  } catch {
    return null;
  }
}

export async function getContentEntry<T = Record<string, unknown>>(
  collection: string,
  id: string,
): Promise<ContentEntryResult<T>> {
  try {
    const runtimeEntry = await getRuntimeEntry<T>(collection, id);
    if (runtimeEntry) return { entry: runtimeEntry, error: undefined };

    const seed = getSeed(collection, id) as T | null;
    if (seed) return { entry: { id, data: seed }, error: undefined };

    return {
      entry: undefined,
      error: new Error(`Entry not found: ${collection}::${id}`),
    };
  } catch (e) {
    return {
      entry: undefined,
      error: e instanceof Error ? e : new Error(String(e)),
    };
  }
}

export async function getContentCollection<T = Record<string, unknown>>(
  collection: string,
): Promise<ContentCollectionResult<T>> {
  try {
    const entriesById = new Map<string, ContentEntry<T>>();

    for (const id of getSeedIds(collection)) {
      const seed = getSeed(collection, id) as T | null;
      if (seed) entriesById.set(id, { id, data: seed });
    }

    const runtimeEntries = await getRuntimeCollection<T>(collection);
    for (const entry of runtimeEntries ?? []) {
      entriesById.set(entry.id, entry);
    }

    return {
      entries: Array.from(entriesById.values()),
      error: undefined,
    };
  } catch (e) {
    return {
      entries: [],
      error: e instanceof Error ? e : new Error(String(e)),
    };
  }
}
