import type { MealSummary } from '@/src/features/meals/models/meal';
import { createFavoritesStore } from '@/src/features/favorites/store/favorites-store';
import { STORAGE_KEYS } from '@/src/shared/constants/storage';
import type { StateStorage } from 'zustand/middleware';

const favoriteMeal: MealSummary = {
  id: '52771',
  name: 'Spicy Arrabiata Penne',
  image: 'https://example.com/arrabiata.jpg',
  category: 'Vegetarian',
  area: 'Italian',
};

function createInspectableStorage(initialValues: Record<string, string> = {}) {
  const backingStore = new Map<string, string>(Object.entries(initialValues));

  const storage: StateStorage & { backingStore: Map<string, string> } = {
    backingStore,
    getItem: async (name) => backingStore.get(name) ?? null,
    setItem: async (name, value) => {
      backingStore.set(name, value);
    },
    removeItem: async (name) => {
      backingStore.delete(name);
    },
  };

  return storage;
}

describe('favorites store persistence', () => {
  it('rehydrates from storage and persists toggles', async () => {
    const storage = createInspectableStorage({
      [STORAGE_KEYS.favorites]: JSON.stringify({
        state: {
          favorites: {
            [favoriteMeal.id]: favoriteMeal,
          },
        },
        version: 0,
      }),
    });
    const store = createFavoritesStore(storage);

    await store.persist.rehydrate();

    expect(store.getState().favorites[favoriteMeal.id]).toEqual(favoriteMeal);

    store.getState().toggleFavorite(favoriteMeal);
    await Promise.resolve();

    expect(store.getState().favorites[favoriteMeal.id]).toBeUndefined();
    expect(storage.backingStore.get(STORAGE_KEYS.favorites)).toContain('"favorites":{}');
  });
});
