import { useQuery } from '@tanstack/react-query';

import {
  getFeaturedMeals,
  getMealAreas,
  getMealById,
  getMealCategories,
  getMealsByArea,
  getMealsByCategory,
  searchMealsByName,
} from '@/src/features/meals/api/meal-db';

export const mealKeys = {
  all: ['meals'] as const,
  featured: () => [...mealKeys.all, 'featured'] as const,
  categories: () => [...mealKeys.all, 'categories'] as const,
  areas: () => [...mealKeys.all, 'areas'] as const,
  search: (query: string) => [...mealKeys.all, 'search', query] as const,
  category: (category: string) => [...mealKeys.all, 'category', category] as const,
  area: (area: string) => [...mealKeys.all, 'area', area] as const,
  detail: (mealId: string) => [...mealKeys.all, 'detail', mealId] as const,
};

export function useFeaturedMealsQuery() {
  return useQuery({
    queryKey: mealKeys.featured(),
    queryFn: getFeaturedMeals,
  });
}

export function useMealCategoriesQuery() {
  return useQuery({
    queryKey: mealKeys.categories(),
    queryFn: getMealCategories,
  });
}

export function useMealAreasQuery() {
  return useQuery({
    queryKey: mealKeys.areas(),
    queryFn: getMealAreas,
  });
}

export function useSearchMealsQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: mealKeys.search(query),
    queryFn: () => searchMealsByName(query),
    enabled,
  });
}

export function useMealsByCategoryQuery(category: string, enabled: boolean) {
  return useQuery({
    queryKey: mealKeys.category(category),
    queryFn: () => getMealsByCategory(category),
    enabled,
  });
}

export function useMealsByAreaQuery(area: string, enabled: boolean) {
  return useQuery({
    queryKey: mealKeys.area(area),
    queryFn: () => getMealsByArea(area),
    enabled,
  });
}

export function useMealDetailsQuery(mealId: string) {
  return useQuery({
    queryKey: mealKeys.detail(mealId),
    queryFn: () => getMealById(mealId),
    enabled: Boolean(mealId),
  });
}
