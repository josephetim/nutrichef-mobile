import type { WeeklyPlan } from '@/src/features/planner/store/planner-store';
import { mealSlots, plannerDays } from '@/src/shared/constants/planner';
import { normalizeOptionalString } from '@/src/shared/utils/text';

export type ShoppingListEntry = {
  key: string;
  name: string;
  quantityLabel: string;
  plannedCount: number;
  recipes: string[];
  bought: boolean;
};

type AggregatedIngredient = {
  key: string;
  name: string;
  measureCounts: Record<string, number>;
  plannedCount: number;
  recipes: Set<string>;
};

function formatQuantityLabel(measureCounts: Record<string, number>, plannedCount: number) {
  const measures = Object.entries(measureCounts).map(([measure, count]) =>
    count > 1 ? `${measure} x${count}` : measure
  );

  if (!measures.length) {
    return `${plannedCount} planned meal${plannedCount === 1 ? '' : 's'}`;
  }

  return measures.join(' • ');
}

export function aggregateShoppingList(
  plan: WeeklyPlan,
  boughtItems: Record<string, boolean> = {}
) {
  const ingredientMap = new Map<string, AggregatedIngredient>();

  for (const day of plannerDays) {
    for (const slot of mealSlots) {
      const meal = plan[day][slot];

      if (!meal) {
        continue;
      }

      for (const ingredient of meal.ingredients) {
        const ingredientName = normalizeOptionalString(ingredient.name);

        if (!ingredientName) {
          continue;
        }

        const key = ingredientName.toLowerCase();
        const existing = ingredientMap.get(key) ?? {
          key,
          name: ingredientName,
          measureCounts: {},
          plannedCount: 0,
          recipes: new Set<string>(),
        };

        existing.plannedCount += 1;
        existing.recipes.add(meal.name);

        if (ingredient.measure) {
          existing.measureCounts[ingredient.measure] =
            (existing.measureCounts[ingredient.measure] ?? 0) + 1;
        }

        ingredientMap.set(key, existing);
      }
    }
  }

  return Array.from(ingredientMap.values())
    .map<ShoppingListEntry>((ingredient) => ({
      key: ingredient.key,
      name: ingredient.name,
      quantityLabel: formatQuantityLabel(ingredient.measureCounts, ingredient.plannedCount),
      plannedCount: ingredient.plannedCount,
      recipes: Array.from(ingredient.recipes),
      bought: Boolean(boughtItems[ingredient.key]),
    }))
    .sort((left, right) => Number(left.bought) - Number(right.bought) || left.name.localeCompare(right.name));
}
