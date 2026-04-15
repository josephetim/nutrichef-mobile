export type IngredientPair = {
  name: string;
  measure?: string;
};

export type MealSummary = {
  id: string;
  name: string;
  image: string | null;
  category: string | null;
  area: string | null;
};

export type MealDetail = MealSummary & {
  instructions: string;
  ingredients: IngredientPair[];
  tags: string[];
  sourceUrl: string | null;
  youtubeUrl: string | null;
};

export type MealCategory = {
  id: string;
  name: string;
  thumbnail: string | null;
  description: string;
};

export type PlannedMealSnapshot = MealSummary & {
  ingredients: IngredientPair[];
};

export function toPlannedMealSnapshot(meal: MealDetail): PlannedMealSnapshot {
  return {
    id: meal.id,
    name: meal.name,
    image: meal.image,
    category: meal.category,
    area: meal.area,
    ingredients: meal.ingredients,
  };
}
