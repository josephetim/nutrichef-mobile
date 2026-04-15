import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

import type { MealSummary } from '@/src/features/meals/models/meal';
import { STORAGE_KEYS } from '@/src/shared/constants/storage';

export type FavoritesState = {
  favorites: Record<string, MealSummary>;
  hasHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  toggleFavorite: (meal: MealSummary) => boolean;
  removeFavorite: (mealId: string) => void;
  isFavorite: (mealId: string) => boolean;
};

export function createFavoritesStore(storage: StateStorage = AsyncStorage) {
  return createStore<FavoritesState>()(
    persist(
      (set, get) => ({
        favorites: {},
        hasHydrated: false,
        setHydrated: (hydrated) => set({ hasHydrated: hydrated }),
        toggleFavorite: (meal) => {
          const alreadyFavorite = Boolean(get().favorites[meal.id]);

          set((state) => {
            if (state.favorites[meal.id]) {
              const nextFavorites = { ...state.favorites };
              delete nextFavorites[meal.id];

              return {
                favorites: nextFavorites,
              };
            }

            return {
              favorites: {
                ...state.favorites,
                [meal.id]: meal,
              },
            };
          });

          return !alreadyFavorite;
        },
        removeFavorite: (mealId) =>
          set((state) => {
            if (!state.favorites[mealId]) {
              return state;
            }

            const nextFavorites = { ...state.favorites };
            delete nextFavorites[mealId];

            return {
              favorites: nextFavorites,
            };
          }),
        isFavorite: (mealId) => Boolean(get().favorites[mealId]),
      }),
      {
        name: STORAGE_KEYS.favorites,
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
          favorites: state.favorites,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
      }
    )
  );
}

export const favoritesStore = createFavoritesStore();

export function useFavoritesStore<TValue>(selector: (state: FavoritesState) => TValue) {
  return useStore(favoritesStore, selector);
}
