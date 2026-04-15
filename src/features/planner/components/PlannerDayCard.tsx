import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DayPlan } from '@/src/features/planner/store/planner-store';
import { MealImage } from '@/src/shared/components/MealImage';
import {
  mealSlotLabels,
  mealSlots,
  plannerDayLabels,
  type PlannerDay,
} from '@/src/shared/constants/planner';
import { appTheme } from '@/src/shared/constants/theme';

type PlannerDayCardProps = {
  day: PlannerDay;
  plan: DayPlan;
  onRemove: (slot: (typeof mealSlots)[number]) => void;
  onOpenMeal: (mealId: string) => void;
  onExplore: () => void;
};

export function PlannerDayCard({
  day,
  plan,
  onRemove,
  onOpenMeal,
  onExplore,
}: PlannerDayCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{plannerDayLabels[day]}</Text>
      <View style={styles.slotList}>
        {mealSlots.map((slot) => {
          const meal = plan[slot];

          if (!meal) {
            return (
              <Pressable
                key={slot}
                onPress={onExplore}
                style={({ pressed }) => [styles.emptySlot, pressed && styles.pressed]}>
                <View>
                  <Text style={styles.slotLabel}>{mealSlotLabels[slot]}</Text>
                  <Text style={styles.emptyLabel}>Add a meal from discovery</Text>
                </View>
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  size={22}
                  color={appTheme.colors.primary}
                />
              </Pressable>
            );
          }

          return (
            <View key={slot} style={styles.filledSlot}>
              <Pressable style={styles.mealButton} onPress={() => onOpenMeal(meal.id)}>
                <MealImage uri={meal.image} style={styles.image} />
                <View style={styles.mealCopy}>
                  <Text style={styles.slotLabel}>{mealSlotLabels[slot]}</Text>
                  <Text style={styles.mealName} numberOfLines={2}>
                    {meal.name}
                  </Text>
                  <Text style={styles.meta}>
                    {[meal.category, meal.area].filter(Boolean).join(' • ')}
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => onRemove(slot)} style={({ pressed }) => pressed && styles.pressed}>
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={22}
                  color={appTheme.colors.danger}
                />
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    padding: appTheme.spacing.lg,
    gap: appTheme.spacing.md,
    ...appTheme.shadow,
  },
  title: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.displayMedium,
    fontSize: 24,
  },
  slotList: {
    gap: appTheme.spacing.sm,
  },
  emptySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: appTheme.radii.md,
    backgroundColor: appTheme.colors.surface,
    padding: appTheme.spacing.md,
  },
  filledSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.sm,
    borderRadius: appTheme.radii.md,
    backgroundColor: appTheme.colors.surface,
    padding: appTheme.spacing.sm,
  },
  mealButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.md,
  },
  image: {
    width: 82,
    height: 82,
    borderRadius: appTheme.radii.md,
  },
  mealCopy: {
    flex: 1,
    gap: 4,
  },
  slotLabel: {
    color: appTheme.colors.primary,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  mealName: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 15,
  },
  meta: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 13,
  },
  emptyLabel: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.84,
  },
});
