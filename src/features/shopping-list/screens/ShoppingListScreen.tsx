import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { aggregateShoppingList } from '@/src/features/planner/utils/shopping-list';
import { usePlannerStore } from '@/src/features/planner/store/planner-store';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { Screen } from '@/src/shared/components/Screen';
import { SkeletonBlock } from '@/src/shared/components/SkeletonBlock';
import { appTheme } from '@/src/shared/constants/theme';

export function ShoppingListScreen() {
  const plan = usePlannerStore((state) => state.plan);
  const boughtItems = usePlannerStore((state) => state.boughtItems);
  const toggleBought = usePlannerStore((state) => state.toggleBought);
  const hasHydrated = usePlannerStore((state) => state.hasHydrated);
  const shoppingItems = aggregateShoppingList(plan, boughtItems);
  const boughtCount = shoppingItems.filter((item) => item.bought).length;

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(420)} style={styles.hero}>
        <Text style={styles.eyebrow}>Shopping list</Text>
        <Text style={styles.title}>Everything your week needs.</Text>
        <Text style={styles.body}>
          Ingredients are aggregated from planned meals and stay locally available, even if the API is offline.
        </Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{shoppingItems.length}</Text>
            <Text style={styles.metricLabel}>Unique ingredients</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{boughtCount}</Text>
            <Text style={styles.metricLabel}>Marked bought</Text>
          </View>
        </View>
      </Animated.View>

      {!hasHydrated ? (
        <View style={styles.list}>
          {Array.from({ length: 5 }, (_, index) => (
            <SkeletonBlock key={index} height={88} borderRadius={appTheme.radii.lg} />
          ))}
        </View>
      ) : !shoppingItems.length ? (
        <EmptyState
          title="Nothing to shop yet"
          description="Once meals are on the planner, the shopping list will aggregate their ingredients here."
        />
      ) : (
        <View style={styles.list}>
          {shoppingItems.map((item, index) => (
            <Animated.View
              key={item.key}
              entering={FadeInDown.delay(index * 30).duration(320)}
              layout={LinearTransition.springify()}>
              <Pressable
                onPress={() => toggleBought(item.key)}
                style={({ pressed }) => [styles.itemCard, item.bought && styles.itemCardBought, pressed && styles.pressed]}>
                <View style={[styles.checkbox, item.bought && styles.checkboxBought]}>
                  {item.bought ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color={appTheme.colors.surfaceElevated}
                    />
                  ) : null}
                </View>
                <View style={styles.itemCopy}>
                  <Text style={[styles.itemName, item.bought && styles.itemNameBought]}>{item.name}</Text>
                  <Text style={styles.itemMeta}>{item.quantityLabel}</Text>
                  <Text style={styles.itemRecipes} numberOfLines={1}>
                    {item.recipes.join(' • ')}
                  </Text>
                </View>
              </Pressable>
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
    backgroundColor: appTheme.colors.secondary,
    padding: appTheme.spacing.xl,
    gap: appTheme.spacing.md,
  },
  eyebrow: {
    color: '#FFEAD8',
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    color: appTheme.colors.surfaceElevated,
    fontFamily: appTheme.fontFamilies.display,
    fontSize: 34,
    lineHeight: 40,
  },
  body: {
    color: '#FFF2E8',
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 15,
    lineHeight: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: appTheme.spacing.md,
  },
  metricCard: {
    flex: 1,
    borderRadius: appTheme.radii.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    padding: appTheme.spacing.md,
    gap: 4,
  },
  metricValue: {
    color: appTheme.colors.surfaceElevated,
    fontFamily: appTheme.fontFamilies.displayMedium,
    fontSize: 30,
  },
  metricLabel: {
    color: '#FFF2E8',
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 13,
  },
  list: {
    gap: appTheme.spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.md,
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    padding: appTheme.spacing.md,
    ...appTheme.shadow,
  },
  itemCardBought: {
    opacity: 0.72,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: appTheme.radii.pill,
    borderWidth: 2,
    borderColor: appTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBought: {
    backgroundColor: appTheme.colors.primary,
  },
  itemCopy: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 16,
  },
  itemNameBought: {
    textDecorationLine: 'line-through',
  },
  itemMeta: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 13,
  },
  itemRecipes: {
    color: appTheme.colors.primary,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.9,
  },
});
