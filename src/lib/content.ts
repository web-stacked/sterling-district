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

export async function getContentEntry<T = Record<string, unknown>>(
  collection: string,
  id: string,
): Promise<ContentEntryResult<T>> {
  try {
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
    const results = await Promise.all(
      getSeedIds(collection).map((id) => getContentEntry<T>(collection, id)),
    );

    return {
      entries: results.flatMap((result) => result.entry ? [result.entry] : []),
      error: undefined,
    };
  } catch (e) {
    return {
      entries: [],
      error: e instanceof Error ? e : new Error(String(e)),
    };
  }
}
