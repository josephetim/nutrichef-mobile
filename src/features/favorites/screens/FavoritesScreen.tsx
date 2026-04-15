import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useFavoritesStore } from '@/src/features/favorites/store/favorites-store';
import { MealCard } from '@/src/features/meals/components/MealCard';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { Screen } from '@/src/shared/components/Screen';
import { SkeletonBlock } from '@/src/shared/components/SkeletonBlock';
import { appTheme } from '@/src/shared/constants/theme';

export function FavoritesScreen() {
  const router = useRouter();
  const favoritesMap = useFavoritesStore((state) => state.favorites);
  const hasHydrated = useFavoritesStore((state) => state.hasHydrated);
  const favorites = Object.values(favoritesMap);

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(420)} style={styles.hero}>
        <Text style={styles.eyebrow}>Favorites</Text>
        <Text style={styles.title}>Your saved recipes, kept close.</Text>
        <Text style={styles.body}>
          Favorites are persisted locally so you can jump back into meal details and planner decisions quickly.
        </Text>
      </Animated.View>

      {!hasHydrated ? (
        <View style={styles.list}>
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBlock key={index} height={124} borderRadius={appTheme.radii.lg} />
          ))}
        </View>
      ) : favorites.length ? (
        <View style={styles.list}>
          {favorites.map((meal, index) => (
            <Animated.View key={meal.id} entering={FadeInDown.delay(index * 35).duration(320)}>
              <MealCard
                meal={meal}
                variant="list"
                onPress={() =>
                  router.push({
                    pathname: '/meal/[id]',
                    params: { id: meal.id },
                  })
                }
              />
            </Animated.View>
          ))}
        </View>
      ) : (
        <EmptyState
          title="No favorites saved"
          description="Open any meal detail screen and save it to favorites so you can revisit it later."
          actionLabel="Search meals"
          onActionPress={() => router.push('/search')}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: appTheme.spacing.sm,
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
    fontSize: 36,
    lineHeight: 42,
  },
  body: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 15,
    lineHeight: 24,
  },
  list: {
    gap: appTheme.spacing.md,
  },
});
