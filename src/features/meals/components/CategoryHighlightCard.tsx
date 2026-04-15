import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { MealCategory } from '@/src/features/meals/models/meal';
import { MealImage } from '@/src/shared/components/MealImage';
import { appTheme } from '@/src/shared/constants/theme';

type CategoryHighlightCardProps = {
  category: MealCategory;
  onPress: () => void;
};

export function CategoryHighlightCard({ category, onPress }: CategoryHighlightCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <MealImage uri={category.thumbnail} style={styles.image} />
      <View style={styles.copy}>
        <Text style={styles.title}>{category.name}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {category.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: appTheme.radii.lg,
    overflow: 'hidden',
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    ...appTheme.shadow,
  },
  image: {
    width: '100%',
    height: 140,
  },
  copy: {
    padding: appTheme.spacing.md,
    gap: 6,
  },
  title: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.displayMedium,
    fontSize: 24,
  },
  description: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.92,
  },
});
