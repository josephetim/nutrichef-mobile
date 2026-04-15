export const plannerDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type PlannerDay = (typeof plannerDays)[number];

export const plannerDayLabels: Record<PlannerDay, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export const mealSlots = ['breakfast', 'lunch', 'dinner'] as const;

export type MealSlot = (typeof mealSlots)[number];

export const mealSlotLabels: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};
