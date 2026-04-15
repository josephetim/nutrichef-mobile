import type {
  MealDbAreaListItem,
  MealDbCategoriesResponse,
  MealDbMeal,
  MealDbMealListItem,
  MealDbMealsResponse,
} from '@/src/features/meals/models/meal-db';
import type { MealCategory, MealDetail, MealSummary } from '@/src/features/meals/models/meal';
import { extractIngredientPairs } from '@/src/features/meals/utils/ingredient-parser';
import { normalizeOptionalString } from '@/src/shared/utils/text';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

async function request<TResponse>(path: string) {
  const response = await fetch(`${BASE_URL}/${path}`);

  if (!response.ok) {
    throw new Error('Unable to reach TheMealDB right now.');
  }

  return (await response.json()) as TResponse;
}

function ensureArray<TValue>(value: TValue[] | null | undefined) {
  return Array.isArray(value) ? value : [];
}

function isUsableMeal(meal: Partial<MealDbMeal>) {
  return Boolean(normalizeOptionalString(meal.strMeal) && normalizeOptionalString(meal.strMealThumb));
}

function dateRank(value: string | null | undefined) {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function uniqueMeals(meals: MealDbMeal[]) {
  const seen = new Set<string>();

  return meals.filter((meal) => {
    if (seen.has(meal.idMeal)) {
      return false;
    }

    seen.add(meal.idMeal);
    return true;
  });
}

function mapMealSummary(
  meal: Partial<MealDbMeal> | MealDbMealListItem,
  overrides: Partial<Pick<MealSummary, 'category' | 'area'>> = {}
): MealSummary {
  return {
    id: meal.idMeal ?? 'unknown-meal',
    name: normalizeOptionalString(meal.strMeal) ?? 'Untitled meal',
    image: normalizeOptionalString(meal.strMealThumb),
    category: overrides.category ?? normalizeOptionalString((meal as MealDbMeal).strCategory),
    area: overrides.area ?? normalizeOptionalString((meal as MealDbMeal).strArea),
  };
}

function mapMealDetail(meal: MealDbMeal): MealDetail {
  return {
    ...mapMealSummary(meal),
    instructions: normalizeOptionalString(meal.strInstructions) ?? 'No instructions available yet.',
    ingredients: extractIngredientPairs(meal),
    tags: (normalizeOptionalString(meal.strTags)?.split(',') ?? [])
      .map((tag) => tag.trim())
      .filter(Boolean),
    sourceUrl: normalizeOptionalString(meal.strSource),
    youtubeUrl: normalizeOptionalString(meal.strYoutube),
  };
}

async function getMealsByFirstLetter(letter: string) {
  const response = await request<MealDbMealsResponse<MealDbMeal>>(`search.php?f=${letter}`);

  return ensureArray(response.meals).filter(isUsableMeal);
}

export async function getFeaturedMeals() {
  try {
    const latestResponse = await request<{ meals?: unknown }>('latest.php');
    const latestMeals = ensureArray(latestResponse.meals as MealDbMeal[] | null).filter(isUsableMeal);

    if (latestMeals.length >= 4) {
      return latestMeals.map((meal) => mapMealSummary(meal)).slice(0, 10);
    }
  } catch {
    // Fall through to the letter-based discovery feed.
  }

  const discoveryMeals = (await Promise.all(['a', 'b', 'c'].map(getMealsByFirstLetter))).flat();

  return uniqueMeals(discoveryMeals)
    .sort((left, right) => dateRank(right.dateModified) - dateRank(left.dateModified))
    .map((meal) => mapMealSummary(meal))
    .slice(0, 10);
}

export async function getMealCategories() {
  const response = await request<MealDbCategoriesResponse>('categories.php');

  return ensureArray(response.categories).map<MealCategory>((category) => ({
    id: category.idCategory,
    name: category.strCategory,
    thumbnail: normalizeOptionalString(category.strCategoryThumb),
    description: category.strCategoryDescription,
  }));
}

export async function getMealAreas() {
  const response = await request<MealDbMealsResponse<MealDbAreaListItem>>('list.php?a=list');

  return ensureArray(response.meals)
    .map((area) => normalizeOptionalString(area.strArea))
    .filter((area): area is string => Boolean(area));
}

export async function searchMealsByName(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const response = await request<MealDbMealsResponse<MealDbMeal>>(
    `search.php?s=${encodeURIComponent(trimmedQuery)}`
  );

  return ensureArray(response.meals).map((meal) => mapMealSummary(meal));
}

export async function getMealsByCategory(category: string) {
  const response = await request<MealDbMealsResponse<MealDbMealListItem>>(
    `filter.php?c=${encodeURIComponent(category)}`
  );

  return ensureArray(response.meals).map((meal) => mapMealSummary(meal, { category }));
}

export async function getMealsByArea(area: string) {
  const response = await request<MealDbMealsResponse<MealDbMealListItem>>(
    `filter.php?a=${encodeURIComponent(area)}`
  );

  return ensureArray(response.meals).map((meal) => mapMealSummary(meal, { area }));
}

export async function getMealById(id: string) {
  const response = await request<MealDbMealsResponse<MealDbMeal>>(
    `lookup.php?i=${encodeURIComponent(id)}`
  );
  const meal = ensureArray(response.meals)[0];

  return meal ? mapMealDetail(meal) : null;
}
