import type { PlannedMealSnapshot } from '@/src/features/meals/models/meal';
import { createEmptyPlan } from '@/src/features/planner/store/planner-store';
import { aggregateShoppingList } from '@/src/features/planner/utils/shopping-list';

const breakfastMeal: PlannedMealSnapshot = {
  id: '1',
  name: 'Breakfast Bowl',
  image: null,
  category: 'Breakfast',
  area: 'American',
  ingredients: [
    { name: 'Eggs', measure: '2' },
    { name: 'Spinach' },
  ],
};

const dinnerMeal: PlannedMealSnapshot = {
  id: '2',
  name: 'Dinner Bowl',
  image: null,
  category: 'Chicken',
  area: 'American',
  ingredients: [
    { name: 'Eggs', measure: '2' },
    { name: 'Rice', measure: '1 cup' },
  ],
};

describe('aggregateShoppingList', () => {
  it('groups duplicate ingredients, preserves recipe references, and marks bought items', () => {
    const plan = createEmptyPlan();
    plan.monday.breakfast = breakfastMeal;
    plan.tuesday.dinner = dinnerMeal;

    const items = aggregateShoppingList(plan, { eggs: true });

    expect(items).toHaveLength(3);

    const eggs = items.find((item) => item.key === 'eggs');
    const spinach = items.find((item) => item.key === 'spinach');

    expect(eggs).toMatchObject({
      name: 'Eggs',
      quantityLabel: '2 x2',
      plannedCount: 2,
      bought: true,
    });
    expect(eggs?.recipes).toEqual(expect.arrayContaining(['Breakfast Bowl', 'Dinner Bowl']));

    expect(spinach).toMatchObject({
      name: 'Spinach',
      quantityLabel: '1 planned meal',
      plannedCount: 1,
      bought: false,
    });
  });
});
