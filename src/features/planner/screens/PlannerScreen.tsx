import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PlannerDayCard } from '@/src/features/planner/components/PlannerDayCard';
import { countPlannedMeals, usePlannerStore } from '@/src/features/planner/store/planner-store';
import { plannerDays } from '@/src/shared/constants/planner';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { Screen } from '@/src/shared/components/Screen';
import { SkeletonBlock } from '@/src/shared/components/SkeletonBlock';
import { appTheme } from '@/src/shared/constants/theme';

export function PlannerScreen() {
  const router = useRouter();
  const plan = usePlannerStore((state) => state.plan);
  const removeMeal = usePlannerStore((state) => state.removeMeal);
  const hasHydrated = usePlannerStore((state) => state.hasHydrated);
  const plannedCount = countPlannedMeals(plan);

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(420)} style={styles.hero}>
        <Text style={styles.eyebrow}>Weekly planner</Text>
        <Text style={styles.title}>Build your week like a menu.</Text>
        <Text style={styles.body}>
          Assign breakfast, lunch, and dinner from any recipe detail screen. Your planner stays local
          for offline review.
        </Text>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryValue}>{plannedCount}</Text>
            <Text style={styles.summaryLabel}>Meals planned</Text>
          </View>
          <Pressable onPress={() => router.push('/search')} style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
            <Text style={styles.ctaLabel}>Discover meals</Text>
          </Pressable>
        </View>
      </Animated.View>

      {!hasHydrated ? (
        <View style={styles.list}>
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBlock key={index} height={330} borderRadius={appTheme.radii.lg} />
          ))}
        </View>
      ) : plannedCount === 0 ? (
        <EmptyState
          title="Your planner is still open"
          description="Start from a recipe, then add it to any day and meal slot from the detail screen."
          actionLabel="Open search"
          onActionPress={() => router.push('/search')}
        />
      ) : (
        <View style={styles.list}>
          {plannerDays.map((day, index) => (
            <Animated.View key={day} entering={FadeInDown.delay(index * 35).duration(360)}>
              <PlannerDayCard
                day={day}
                plan={plan[day]}
                onRemove={(slot) => removeMeal(day, slot)}
                onOpenMeal={(mealId) =>
                  router.push({
                    pathname: '/meal/[id]',
                    params: { id: mealId },
                  })
                }
                onExplore={() => router.push('/search')}
              />
            </Animated.View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: appTheme.radii.xl,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    padding: appTheme.spacing.xl,
    gap: appTheme.spacing.md,
    ...appTheme.shadow,
  },
  eyebrow: {
    color: appTheme.colors.primary,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.display,
    fontSize: 34,
    lineHeight: 40,
  },
  body: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 15,
    lineHeight: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: appTheme.spacing.md,
  },
  summaryValue: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.displayMedium,
    fontSize: 30,
  },
  summaryLabel: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 13,
  },
  cta: {
    borderRadius: appTheme.radii.pill,
    backgroundColor: appTheme.colors.primary,
    paddingHorizontal: appTheme.spacing.lg,
    paddingVertical: 14,
  },
  ctaLabel: {
    color: appTheme.colors.surfaceElevated,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 14,
  },
  list: {
    gap: appTheme.spacing.md,
  },
  pressed: {
    opacity: 0.9,
  },
});
