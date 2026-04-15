import type { MealDbMeal } from '@/src/features/meals/models/meal-db';
import type { IngredientPair } from '@/src/features/meals/models/meal';
import { normalizeOptionalString } from '@/src/shared/utils/text';

const ingredientIndexes = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const;

export function extractIngredientPairs(meal: Partial<MealDbMeal>) {
  const pairs: IngredientPair[] = [];

  for (const index of ingredientIndexes) {
    const ingredientKey = `strIngredient${index}` as keyof MealDbMeal;
    const measureKey = `strMeasure${index}` as keyof MealDbMeal;
    const ingredient = normalizeOptionalString(meal[ingredientKey] as string | null | undefined);
    const measure = normalizeOptionalString(meal[measureKey] as string | null | undefined);

    if (!ingredient) {
      continue;
    }

    pairs.push({
      name: ingredient,
      measure: measure ?? undefined,
    });
  }

  return pairs;
}
