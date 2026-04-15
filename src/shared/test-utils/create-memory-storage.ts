import type { StateStorage } from 'zustand/middleware';

export function createMemoryStorage(initialValues: Record<string, string> = {}): StateStorage {
  const storage = new Map<string, string>(Object.entries(initialValues));

  return {
    getItem: async (name) => storage.get(name) ?? null,
    setItem: async (name, value) => {
      storage.set(name, value);
    },
    removeItem: async (name) => {
      storage.delete(name);
    },
  };
}
