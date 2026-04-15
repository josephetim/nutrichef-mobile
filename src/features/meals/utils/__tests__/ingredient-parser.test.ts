import { extractIngredientPairs } from '@/src/features/meals/utils/ingredient-parser';
import type { MealDbMeal } from '@/src/features/meals/models/meal-db';

describe('extractIngredientPairs', () => {
  it('keeps valid ingredients and ignores empty ingredient fields', () => {
    const meal: Partial<MealDbMeal> = {
      strIngredient1: ' Chicken breast ',
      strMeasure1: ' 2 fillets ',
      strIngredient2: '   ',
      strMeasure2: '1 tsp',
      strIngredient3: 'Garlic',
      strMeasure3: null,
      strIngredient4: null,
      strMeasure4: '',
    };

    expect(extractIngredientPairs(meal)).toEqual([
      { name: 'Chicken breast', measure: '2 fillets' },
      { name: 'Garlic', measure: undefined },
    ]);
  });

  it('removes null-like measurement strings', () => {
    const meal: Partial<MealDbMeal> = {
      strIngredient1: 'Olive Oil',
      strMeasure1: ' null ',
    };

    expect(extractIngredientPairs(meal)).toEqual([{ name: 'Olive Oil', measure: undefined }]);
  });
});
