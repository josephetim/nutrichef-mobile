import type { PlannedMealSnapshot } from '@/src/features/meals/models/meal';
import { createPlannerStore } from '@/src/features/planner/store/planner-store';
import { createMemoryStorage } from '@/src/shared/test-utils/create-memory-storage';

const teriyaki: PlannedMealSnapshot = {
  id: '52772',
  name: 'Teriyaki Chicken',
  image: 'https://example.com/teriyaki.jpg',
  category: 'Chicken',
  area: 'Japanese',
  ingredients: [{ name: 'Chicken', measure: '2 breasts' }],
};

const arrabiata: PlannedMealSnapshot = {
  id: '52771',
  name: 'Arrabiata',
  image: 'https://example.com/arrabiata.jpg',
  category: 'Vegetarian',
  area: 'Italian',
  ingredients: [{ name: 'Penne', measure: '1 lb' }],
};

describe('planner store', () => {
  it('adds, avoids duplicates in the same slot, replaces, and removes meals', async () => {
    const store = createPlannerStore(createMemoryStorage());

    await store.persist.rehydrate();

    expect(store.getState().assignMeal('monday', 'dinner', teriyaki)).toBe('added');
    expect(store.getState().plan.monday.dinner?.id).toBe('52772');

    expect(store.getState().assignMeal('monday', 'dinner', teriyaki)).toBe('unchanged');
    expect(store.getState().plan.monday.dinner?.id).toBe('52772');

    expect(store.getState().assignMeal('monday', 'dinner', arrabiata)).toBe('replaced');
    expect(store.getState().plan.monday.dinner?.id).toBe('52771');
    expect(store.getState().isMealPlanned('52771')).toBe(true);

    store.getState().removeMeal('monday', 'dinner');
    expect(store.getState().plan.monday.dinner).toBeNull();
  });
});
