import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useFeaturedMealsQuery,
  useMealAreasQuery,
  useMealCategoriesQuery,
  useMealsByAreaQuery,
  useMealsByCategoryQuery,
  useSearchMealsQuery,
} from '@/src/features/meals/api/meal-queries';
import { MealCard } from '@/src/features/meals/components/MealCard';
import { useRecentSearchesStore } from '@/src/features/search/store/recent-searches-store';
import { Chip } from '@/src/shared/components/Chip';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { Screen } from '@/src/shared/components/Screen';
import { SectionHeader } from '@/src/shared/components/SectionHeader';
import { SkeletonBlock } from '@/src/shared/components/SkeletonBlock';
import { appTheme } from '@/src/shared/constants/theme';

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; area?: string; q?: string }>();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const deferredQuery = useDeferredValue(query.trim());
  const categoriesQuery = useMealCategoriesQuery();
  const areasQuery = useMealAreasQuery();
  const discoveryQuery = useFeaturedMealsQuery();
  const recentSearches = useRecentSearchesStore((state) => state.recentSearches);
  const addRecentSearch = useRecentSearchesStore((state) => state.addRecentSearch);
  const clearRecentSearches = useRecentSearchesStore((state) => state.clearRecentSearches);

  useEffect(() => {
    const nextCategory = readParam(params.category);
    const nextArea = readParam(params.area);
    const nextQuery = readParam(params.q);

    setQuery(nextQuery);
    setSelectedCategory(nextCategory);
    setSelectedArea(nextArea);
  }, [params.area, params.category, params.q]);

  const textModeActive = deferredQuery.length >= 2;
  const categoryModeActive = !textModeActive && Boolean(selectedCategory);
  const areaModeActive = !textModeActive && !selectedCategory && Boolean(selectedArea);
  const searchQuery = useSearchMealsQuery(deferredQuery, textModeActive);
  const categoryQuery = useMealsByCategoryQuery(selectedCategory, categoryModeActive);
  const areaQuery = useMealsByAreaQuery(selectedArea, areaModeActive);

  const results = textModeActive
    ? searchQuery.data ?? []
    : categoryModeActive
      ? categoryQuery.data ?? []
      : areaModeActive
        ? areaQuery.data ?? []
        : discoveryQuery.data ?? [];

  const resultsLoading = textModeActive
    ? searchQuery.isLoading
    : categoryModeActive
      ? categoryQuery.isLoading
      : areaModeActive
        ? areaQuery.isLoading
        : discoveryQuery.isLoading;

  const activeTitle = textModeActive
    ? `Results for "${deferredQuery}"`
    : categoryModeActive
      ? `${selectedCategory} meals`
      : areaModeActive
        ? `${selectedArea} cuisine`
        : 'Discovery picks';

  const hasActiveSearch = textModeActive || categoryModeActive || areaModeActive;

  const commitSearch = (value: string) => {
    if (value.trim().length >= 2) {
      addRecentSearch(value.trim());
    }
  };

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={appTheme.colors.text} />
        </Pressable>
        <View style={styles.inputShell}>
          <MaterialCommunityIcons name="magnify" size={18} color={appTheme.colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={(value) => {
              startTransition(() => {
                setQuery(value);

                if (value.trim()) {
                  setSelectedCategory('');
                  setSelectedArea('');
                }
              });
            }}
            onSubmitEditing={() => commitSearch(query)}
            placeholder="Search meals by name"
            placeholderTextColor={appTheme.colors.textMuted}
            style={styles.input}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query ? (
            <Pressable
              onPress={() => setQuery('')}
              style={({ pressed }) => pressed && styles.pressed}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={appTheme.colors.textMuted}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            variant="list"
            onPress={() => {
              if (query.trim()) {
                commitSearch(query);
              }

              router.push({
                pathname: '/meal/[id]',
                params: { id: item.id },
              });
            }}
          />
        )}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={styles.searchIntro}>
              <Text style={styles.searchTitle}>Find dinner in a different mood.</Text>
              <Text style={styles.searchBody}>
                Search by name, pivot into a category, or browse cuisine filters when you want a quicker route.
              </Text>
            </View>

            {recentSearches.length ? (
              <View style={styles.recentBlock}>
                <SectionHeader
                  title="Recent searches"
                  actionLabel="Clear"
                  onActionPress={clearRecentSearches}
                />
                <View style={styles.chipWrap}>
                  {recentSearches.map((recentSearch) => (
                    <Chip
                      key={recentSearch}
                      label={recentSearch}
                      onPress={() => {
                        setSelectedArea('');
                        setSelectedCategory('');
                        setQuery(recentSearch);
                      }}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.filterBlock}>
              <SectionHeader title="Browse by category" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroller}>
                {categoriesQuery.isLoading
                  ? Array.from({ length: 5 }, (_, index) => (
                      <SkeletonBlock
                        key={index}
                        height={40}
                        width={100 + index * 4}
                        borderRadius={appTheme.radii.pill}
                      />
                    ))
                  : categoriesQuery.data?.map((category) => (
                      <Chip
                        key={category.id}
                        label={category.name}
                        active={!textModeActive && selectedCategory === category.name}
                        onPress={() => {
                          startTransition(() => {
                            setQuery('');
                            setSelectedArea('');
                            setSelectedCategory((current) =>
                              current === category.name ? '' : category.name
                            );
                          });
                        }}
                      />
                    ))}
              </ScrollView>
            </View>

            <View style={styles.filterBlock}>
              <SectionHeader title="Browse by cuisine" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroller}>
                {areasQuery.isLoading
                  ? Array.from({ length: 6 }, (_, index) => (
                      <SkeletonBlock
                        key={index}
                        height={40}
                        width={90 + index * 8}
                        borderRadius={appTheme.radii.pill}
                      />
                    ))
                  : areasQuery.data?.map((area) => (
                      <Chip
                        key={area}
                        label={area}
                        active={!textModeActive && !selectedCategory && selectedArea === area}
                        onPress={() => {
                          startTransition(() => {
                            setQuery('');
                            setSelectedCategory('');
                            setSelectedArea((current) => (current === area ? '' : area));
                          });
                        }}
                      />
                    ))}
              </ScrollView>
            </View>

            <SectionHeader
              title={activeTitle}
              subtitle={
                hasActiveSearch
                  ? 'Tap a card to inspect ingredients, save favorites, or add it to the planner.'
                  : 'Start with these discovery picks when you do not have a specific dish in mind.'
              }
            />
          </View>
        }
        ListEmptyComponent={
          resultsLoading ? (
            <View style={styles.skeletonList}>
              {Array.from({ length: 4 }, (_, index) => (
                <SkeletonBlock key={index} height={124} borderRadius={appTheme.radii.lg} />
              ))}
            </View>
          ) : (
            <EmptyState
              title="No meals matched"
              description={
                hasActiveSearch
                  ? 'Try a shorter search phrase or switch to a different category or cuisine.'
                  : 'Search by meal name or browse a category to start discovering recipes.'
              }
              actionLabel="Reset filters"
              onActionPress={() => {
                setQuery('');
                setSelectedArea('');
                setSelectedCategory('');
              }}
            />
          )
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.sm,
    marginBottom: appTheme.spacing.lg,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: appTheme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
  },
  inputShell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.sm,
    borderRadius: appTheme.radii.pill,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    paddingHorizontal: appTheme.spacing.md,
    minHeight: 52,
  },
  input: {
    flex: 1,
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: appTheme.spacing.xl,
  },
  headerContent: {
    gap: appTheme.spacing.lg,
    marginBottom: appTheme.spacing.lg,
  },
  searchIntro: {
    gap: appTheme.spacing.sm,
  },
  searchTitle: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.display,
    fontSize: 34,
    lineHeight: 40,
  },
  searchBody: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 15,
    lineHeight: 24,
  },
  recentBlock: {
    gap: appTheme.spacing.md,
  },
  filterBlock: {
    gap: appTheme.spacing.md,
  },
  filterScroller: {
    gap: appTheme.spacing.sm,
    paddingRight: appTheme.spacing.md,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
  },
  skeletonList: {
    gap: appTheme.spacing.md,
  },
  separator: {
    height: appTheme.spacing.md,
  },
  pressed: {
    opacity: 0.86,
  },
});
