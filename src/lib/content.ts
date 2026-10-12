import { loadCollection, loadEntry } from '@caretcms/core/runtime';

// Content comes from CaretCMS storage. Before KV holds an entry, the Cloudflare
// adapter serves the bundled baseline in `.caret/data`, so no local fallback is
// needed here.

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

function toError(e: unknown): Error {
  return e instanceof Error ? e : new Error(String(e));
}

export async function getContentEntry<T = Record<string, unknown>>(
  collection: string,
  id: string,
): Promise<ContentEntryResult<T>> {
  try {
    const data = await loadEntry(collection, id);
    return data
      ? { entry: { id, data: data as T }, error: undefined }
      : { entry: undefined, error: new Error(`Entry not found: ${collection}::${id}`) };
  } catch (e) {
    return { entry: undefined, error: toError(e) };
  }
}

export async function getContentCollection<T = Record<string, unknown>>(
  collection: string,
): Promise<ContentCollectionResult<T>> {
  try {
    const entries = await loadCollection(collection);
    return {
      entries: entries.map((entry) => ({ id: entry.id, data: entry.data as T })),
      error: undefined,
    };
  } catch (e) {
    return { entries: [], error: toError(e) };
  }
}
