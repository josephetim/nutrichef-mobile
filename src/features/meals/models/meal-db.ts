type IndexedField =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

export type MealDbMeal = {
  idMeal: string;
  strMeal: string;
  strMealAlternate?: string | null;
  strCategory?: string | null;
  strArea?: string | null;
  strInstructions?: string | null;
  strMealThumb?: string | null;
  strTags?: string | null;
  strYoutube?: string | null;
  strSource?: string | null;
  strImageSource?: string | null;
  strCreativeCommonsConfirmed?: string | null;
  strDescription?: string | null;
  dateModified?: string | null;
} & {
  [Key in `strIngredient${IndexedField}`]: string | null;
} & {
  [Key in `strMeasure${IndexedField}`]: string | null;
};

export type MealDbCategory = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string | null;
  strCategoryDescription: string;
};

export type MealDbMealListItem = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string | null;
};

export type MealDbAreaListItem = {
  strArea: string;
};

export type MealDbMealsResponse<TMeal> = {
  meals: TMeal[] | null;
};

export type MealDbCategoriesResponse = {
  categories: MealDbCategory[] | null;
};
