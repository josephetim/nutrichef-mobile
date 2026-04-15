import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useFavoritesStore } from '@/src/features/favorites/store/favorites-store';
import { useFeaturedMealsQuery, useMealAreasQuery, useMealCategoriesQuery } from '@/src/features/meals/api/meal-queries';
import { CategoryHighlightCard } from '@/src/features/meals/components/CategoryHighlightCard';
import { MealCard } from '@/src/features/meals/components/MealCard';
import { Chip } from '@/src/shared/components/Chip';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { Screen } from '@/src/shared/components/Screen';
import { SectionHeader } from '@/src/shared/components/SectionHeader';
import { SkeletonBlock } from '@/src/shared/components/SkeletonBlock';
import { appTheme } from '@/src/shared/constants/theme';

export function HomeScreen() {
  const router = useRouter();
  const featuredMealsQuery = useFeaturedMealsQuery();
  const categoriesQuery = useMealCategoriesQuery();
  const areasQuery = useMealAreasQuery();
  const favoritesMap = useFavoritesStore((state) => state.favorites);
  const favoritesHydrated = useFavoritesStore((state) => state.hasHydrated);
  const favorites = Object.values(favoritesMap);

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(450)} style={styles.hero}>
        <Text style={styles.heroEyebrow}>Recipe discovery and meal planning</Text>
        <Text style={styles.heroTitle}>NutriChef</Text>
        <Text style={styles.heroBody}>
          Discover globally inspired meals, save the ones you love, and turn a full week of plans
          into a practical shopping list.
        </Text>
        <Pressable onPress={() => router.push('/search')} style={({ pressed }) => [styles.searchCta, pressed && styles.pressed]}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={appTheme.colors.surfaceElevated}
          />
          <Text style={styles.searchCtaLabel}>Search meals, categories, and cuisines</Text>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(50).duration(450)} style={styles.section}>
        <SectionHeader
          title="Featured categories"
          subtitle="Start from a craving and let the details do the rest."
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {categoriesQuery.isLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <SkeletonBlock key={index} height={250} width={220} borderRadius={appTheme.radii.lg} />
              ))
            : categoriesQuery.data?.slice(0, 8).map((category) => (
                <CategoryHighlightCard
                  key={category.id}
                  category={category}
                  onPress={() =>
                    router.push({
                      pathname: '/search',
                      params: { category: category.name },
                    })
                  }
                />
              ))}
        </ScrollView>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(450)} style={styles.section}>
        <SectionHeader
          title="Fresh picks"
          subtitle="A rolling feed of discovery meals from TheMealDB."
        />
        {featuredMealsQuery.isLoading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonBlock key={index} height={320} width={250} borderRadius={appTheme.radii.xl} />
            ))}
          </ScrollView>
        ) : featuredMealsQuery.data?.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {featuredMealsQuery.data.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onPress={() =>
                  router.push({
                    pathname: '/meal/[id]',
                    params: { id: meal.id },
                  })
                }
              />
            ))}
          </ScrollView>
        ) : (
          <EmptyState
            title="Discovery feed unavailable"
            description="Search by meal name or browse a category to keep planning even when the remote feed is thin."
            actionLabel="Open search"
            onActionPress={() => router.push('/search')}
          />
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(450)} style={styles.section}>
        <SectionHeader
          title="Favorites"
          subtitle="Your saved meals stay available locally."
          actionLabel={favorites.length ? 'See all' : undefined}
          onActionPress={() => router.push('/(tabs)/favorites')}
        />
        {!favoritesHydrated ? (
          <SkeletonBlock height={132} borderRadius={appTheme.radii.lg} />
        ) : favorites.length ? (
          <View style={styles.listColumn}>
            {favorites.slice(0, 3).map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                variant="list"
                onPress={() =>
                  router.push({
                    pathname: '/meal/[id]',
                    params: { id: meal.id },
                  })
                }
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No favorites yet"
            description="Save meals from the detail screen to build your own tasting board."
          />
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(450)} style={styles.section}>
        <SectionHeader
          title="Cuisine moods"
          subtitle="Jump into a regional lens when you want a faster browse."
        />
        <View style={styles.chipWrap}>
          {areasQuery.isLoading
            ? Array.from({ length: 8 }, (_, index) => (
                <SkeletonBlock
                  key={index}
                  height={40}
                  width={90 + (index % 3) * 18}
                  borderRadius={appTheme.radii.pill}
                />
              ))
            : areasQuery.data?.slice(0, 12).map((area) => (
                <Chip
                  key={area}
                  label={area}
                  onPress={() =>
                    router.push({
                      pathname: '/search',
                      params: { area },
                    })
                  }
                />
              ))}
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: appTheme.radii.xl,
    backgroundColor: appTheme.colors.primary,
    padding: appTheme.spacing.xl,
    gap: appTheme.spacing.md,
  },
  heroEyebrow: {
    color: '#D9E3DD',
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: appTheme.colors.surfaceElevated,
    fontFamily: appTheme.fontFamilies.display,
    fontSize: 42,
    lineHeight: 46,
  },
  heroBody: {
    color: '#E7EFEA',
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 16,
    lineHeight: 25,
  },
  searchCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.sm,
    borderRadius: appTheme.radii.pill,
    backgroundColor: appTheme.colors.secondary,
    paddingHorizontal: appTheme.spacing.lg,
    paddingVertical: 14,
  },
  searchCtaLabel: {
    color: appTheme.colors.surfaceElevated,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 14,
  },
  section: {
    gap: appTheme.spacing.md,
  },
  horizontalList: {
    gap: appTheme.spacing.md,
    paddingRight: appTheme.spacing.lg,
  },
  listColumn: {
    gap: appTheme.spacing.md,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
  },
  pressed: {
    opacity: 0.9,
  },
});
