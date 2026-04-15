import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useFavoritesStore } from '@/src/features/favorites/store/favorites-store';
import { useMealDetailsQuery } from '@/src/features/meals/api/meal-queries';
import { IngredientChecklist } from '@/src/features/meals/components/IngredientChecklist';
import { toPlannedMealSnapshot } from '@/src/features/meals/models/meal';
import { usePlannerStore } from '@/src/features/planner/store/planner-store';
import { Chip } from '@/src/shared/components/Chip';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { MealImage } from '@/src/shared/components/MealImage';
import { Screen } from '@/src/shared/components/Screen';
import { SectionHeader } from '@/src/shared/components/SectionHeader';
import { SkeletonBlock } from '@/src/shared/components/SkeletonBlock';
import {
  type MealSlot,
  type PlannerDay,
  mealSlotLabels,
  mealSlots,
  plannerDayLabels,
  plannerDays,
} from '@/src/shared/constants/planner';
import { appTheme } from '@/src/shared/constants/theme';
import { formatInstructionSteps } from '@/src/shared/utils/text';

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export function MealDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const mealId = readParam(params.id);
  const mealQuery = useMealDetailsQuery(mealId);
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const assignMeal = usePlannerStore((state) => state.assignMeal);
  const mealAlreadyPlanned = usePlannerStore((state) => state.isMealPlanned(mealId));
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<PlannerDay>(plannerDays[0]);
  const [selectedSlot, setSelectedSlot] = useState<MealSlot>(mealSlots[2]);
  const [plannerMessage, setPlannerMessage] = useState('');

  if (mealQuery.isLoading) {
    return (
      <Screen>
        <SkeletonBlock height={320} borderRadius={appTheme.radii.xl} />
        <SkeletonBlock height={34} width="72%" borderRadius={appTheme.radii.md} />
        <SkeletonBlock height={18} width="54%" borderRadius={appTheme.radii.md} />
        <SkeletonBlock height={200} borderRadius={appTheme.radii.lg} />
      </Screen>
    );
  }

  if (!mealQuery.data) {
    return (
      <Screen>
        <EmptyState
          title="Meal not found"
          description="The recipe details could not be loaded. Try returning to search and opening the meal again."
          actionLabel="Back to search"
          onActionPress={() => router.replace('/search')}
        />
      </Screen>
    );
  }

  const meal = mealQuery.data;
  const instructionSteps = formatInstructionSteps(meal.instructions);
  const isFavorite = Boolean(favorites[meal.id]);

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.topButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={appTheme.colors.text} />
        </Pressable>
        <Pressable
          onPress={() => toggleFavorite(meal)}
          style={({ pressed }) => [styles.topButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? appTheme.colors.secondary : appTheme.colors.text}
          />
        </Pressable>
      </View>

      <Animated.View entering={FadeInDown.duration(420)} style={styles.heroCard}>
        <MealImage uri={meal.image} style={styles.heroImage} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(40).duration(420)} style={styles.copyBlock}>
        <View style={styles.chipWrap}>
          {meal.category ? <Chip label={meal.category} compact /> : null}
          {meal.area ? <Chip label={meal.area} compact /> : null}
          {mealAlreadyPlanned ? <Chip label="On your plan" compact active /> : null}
        </View>
        <Text style={styles.title}>{meal.name}</Text>
        <Text style={styles.body}>
          Save this meal for quick access or assign it directly to your weekly plan.
        </Text>
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => setPickerVisible(true)}
            style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}>
            <MaterialCommunityIcons
              name="calendar-plus"
              size={18}
              color={appTheme.colors.surfaceElevated}
            />
            <Text style={styles.primaryActionLabel}>Add to planner</Text>
          </Pressable>
          <Pressable
            onPress={() => toggleFavorite(meal)}
            style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}>
            <Text style={styles.secondaryActionLabel}>
              {isFavorite ? 'Remove favorite' : 'Save favorite'}
            </Text>
          </Pressable>
        </View>
        {plannerMessage ? <Text style={styles.plannerMessage}>{plannerMessage}</Text> : null}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(420)} style={styles.section}>
        <SectionHeader title="Ingredients" subtitle="Cleaned and paired from TheMealDB ingredient fields." />
        <IngredientChecklist ingredients={meal.ingredients} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(420)} style={styles.section}>
        <SectionHeader title="Instructions" subtitle="A readable breakdown for cooking without scrolling fatigue." />
        <View style={styles.instructionsCard}>
          {instructionSteps.map((step, index) => (
            <View key={`${index}-${step.slice(0, 12)}`} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeLabel}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setPickerVisible(false)} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add to weekly planner</Text>
            <Text style={styles.modalBody}>Choose a day and slot for {meal.name}.</Text>

            <View style={styles.modalBlock}>
              <Text style={styles.modalLabel}>Day</Text>
              <View style={styles.chipWrap}>
                {plannerDays.map((day) => (
                  <Chip
                    key={day}
                    label={plannerDayLabels[day]}
                    compact
                    active={selectedDay === day}
                    onPress={() => setSelectedDay(day)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.modalBlock}>
              <Text style={styles.modalLabel}>Meal slot</Text>
              <View style={styles.chipWrap}>
                {mealSlots.map((slot) => (
                  <Chip
                    key={slot}
                    label={mealSlotLabels[slot]}
                    compact
                    active={selectedSlot === slot}
                    onPress={() => setSelectedSlot(slot)}
                  />
                ))}
              </View>
            </View>

            <Pressable
              onPress={() => {
                const result = assignMeal(selectedDay, selectedSlot, toPlannedMealSnapshot(meal));
                setPickerVisible(false);
                setPlannerMessage(
                  result === 'replaced'
                    ? `Updated ${plannerDayLabels[selectedDay]} ${mealSlotLabels[selectedSlot].toLowerCase()}.`
                    : result === 'unchanged'
                      ? 'That slot already contains this meal.'
                      : `Added to ${plannerDayLabels[selectedDay]} ${mealSlotLabels[selectedSlot].toLowerCase()}.`
                );
              }}
              style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}>
              <Text style={styles.primaryActionLabel}>Save to planner</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topButton: {
    width: 46,
    height: 46,
    borderRadius: appTheme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
  },
  heroCard: {
    borderRadius: appTheme.radii.xl,
    overflow: 'hidden',
    backgroundColor: appTheme.colors.surfaceMuted,
  },
  heroImage: {
    width: '100%',
    height: 320,
  },
  copyBlock: {
    gap: appTheme.spacing.md,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
  },
  title: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.display,
    fontSize: 38,
    lineHeight: 44,
  },
  body: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 15,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: appTheme.spacing.sm,
    borderRadius: appTheme.radii.pill,
    backgroundColor: appTheme.colors.primary,
    paddingHorizontal: appTheme.spacing.lg,
    paddingVertical: 14,
  },
  primaryActionLabel: {
    color: appTheme.colors.surfaceElevated,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 14,
  },
  secondaryAction: {
    borderRadius: appTheme.radii.pill,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    paddingHorizontal: appTheme.spacing.lg,
    paddingVertical: 14,
  },
  secondaryActionLabel: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 14,
  },
  plannerMessage: {
    color: appTheme.colors.success,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 14,
  },
  section: {
    gap: appTheme.spacing.md,
  },
  instructionsCard: {
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    padding: appTheme.spacing.lg,
    gap: appTheme.spacing.lg,
    ...appTheme.shadow,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: appTheme.spacing.md,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: appTheme.radii.pill,
    backgroundColor: appTheme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBadgeLabel: {
    color: appTheme.colors.surfaceElevated,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 15,
    lineHeight: 24,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(28, 23, 19, 0.22)',
    padding: appTheme.spacing.lg,
  },
  modalCard: {
    borderRadius: appTheme.radii.xl,
    backgroundColor: appTheme.colors.surfaceElevated,
    padding: appTheme.spacing.xl,
    gap: appTheme.spacing.lg,
  },
  modalTitle: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.displayMedium,
    fontSize: 28,
  },
  modalBody: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  modalBlock: {
    gap: appTheme.spacing.sm,
  },
  modalLabel: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.88,
  },
});
