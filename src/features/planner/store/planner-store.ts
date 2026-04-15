import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

import type { PlannedMealSnapshot } from '@/src/features/meals/models/meal';
import { mealSlots, plannerDays, type MealSlot, type PlannerDay } from '@/src/shared/constants/planner';
import { STORAGE_KEYS } from '@/src/shared/constants/storage';

export type DayPlan = Record<MealSlot, PlannedMealSnapshot | null>;
export type WeeklyPlan = Record<PlannerDay, DayPlan>;
export type AssignMealResult = 'added' | 'replaced' | 'unchanged';

export type PlannerState = {
  plan: WeeklyPlan;
  boughtItems: Record<string, boolean>;
  hasHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  assignMeal: (day: PlannerDay, slot: MealSlot, meal: PlannedMealSnapshot) => AssignMealResult;
  removeMeal: (day: PlannerDay, slot: MealSlot) => void;
  toggleBought: (itemKey: string) => void;
  isMealPlanned: (mealId: string) => boolean;
};

export function createEmptyPlan(): WeeklyPlan {
  return plannerDays.reduce<WeeklyPlan>((week, day) => {
    week[day] = mealSlots.reduce<DayPlan>((slots, slot) => {
      slots[slot] = null;
      return slots;
    }, {} as DayPlan);

    return week;
  }, {} as WeeklyPlan);
}

export function countPlannedMeals(plan: WeeklyPlan) {
  return plannerDays.reduce((count, day) => {
    return count + mealSlots.filter((slot) => Boolean(plan[day][slot])).length;
  }, 0);
}

export function isMealPlannedInWeek(plan: WeeklyPlan, mealId: string) {
  return plannerDays.some((day) => mealSlots.some((slot) => plan[day][slot]?.id === mealId));
}

export function createPlannerStore(storage: StateStorage = AsyncStorage) {
  return createStore<PlannerState>()(
    persist(
      (set, get) => ({
        plan: createEmptyPlan(),
        boughtItems: {},
        hasHydrated: false,
        setHydrated: (hydrated) => set({ hasHydrated: hydrated }),
        assignMeal: (day, slot, meal) => {
          const currentMeal = get().plan[day][slot];

          if (currentMeal?.id === meal.id) {
            return 'unchanged';
          }

          set((state) => ({
            plan: {
              ...state.plan,
              [day]: {
                ...state.plan[day],
                [slot]: meal,
              },
            },
          }));

          return currentMeal ? 'replaced' : 'added';
        },
        removeMeal: (day, slot) =>
          set((state) => {
            if (!state.plan[day][slot]) {
              return state;
            }

            return {
              plan: {
                ...state.plan,
                [day]: {
                  ...state.plan[day],
                  [slot]: null,
                },
              },
            };
          }),
        toggleBought: (itemKey) =>
          set((state) => ({
            boughtItems: {
              ...state.boughtItems,
              [itemKey]: !state.boughtItems[itemKey],
            },
          })),
        isMealPlanned: (mealId) => isMealPlannedInWeek(get().plan, mealId),
      }),
      {
        name: STORAGE_KEYS.planner,
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
          plan: state.plan,
          boughtItems: state.boughtItems,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
      }
    )
  );
}

export const plannerStore = createPlannerStore();

export function usePlannerStore<TValue>(selector: (state: PlannerState) => TValue) {
  return useStore(plannerStore, selector);
}
