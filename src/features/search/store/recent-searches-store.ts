import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

import { STORAGE_KEYS } from '@/src/shared/constants/storage';

export type RecentSearchesState = {
  recentSearches: string[];
  hasHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
};

export function createRecentSearchesStore(storage: StateStorage = AsyncStorage) {
  return createStore<RecentSearchesState>()(
    persist(
      (set) => ({
        recentSearches: [],
        hasHydrated: false,
        setHydrated: (hydrated) => set({ hasHydrated: hydrated }),
        addRecentSearch: (query) =>
          set((state) => {
            const trimmedQuery = query.trim();

            if (!trimmedQuery) {
              return state;
            }

            return {
              recentSearches: [
                trimmedQuery,
                ...state.recentSearches.filter(
                  (existingQuery) => existingQuery.toLowerCase() !== trimmedQuery.toLowerCase()
                ),
              ].slice(0, 8),
            };
          }),
        clearRecentSearches: () => set({ recentSearches: [] }),
      }),
      {
        name: STORAGE_KEYS.recentSearches,
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
          recentSearches: state.recentSearches,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
      }
    )
  );
}

export const recentSearchesStore = createRecentSearchesStore();

export function useRecentSearchesStore<TValue>(selector: (state: RecentSearchesState) => TValue) {
  return useStore(recentSearchesStore, selector);
}
