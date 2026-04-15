import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { MealSummary } from '@/src/features/meals/models/meal';
import { Chip } from '@/src/shared/components/Chip';
import { MealImage } from '@/src/shared/components/MealImage';
import { appTheme } from '@/src/shared/constants/theme';

type MealCardProps = {
  meal: MealSummary;
  onPress: () => void;
  variant?: 'featured' | 'list';
};

export function MealCard({ meal, onPress, variant = 'featured' }: MealCardProps) {
  const primaryTag = meal.category ?? meal.area;
  const secondaryTag =
    meal.area && meal.area !== primaryTag ? meal.area : meal.category !== primaryTag ? meal.category : null;

  if (variant === 'list') {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.listCard, pressed && styles.pressed]}>
        <MealImage uri={meal.image} style={styles.listImage} />
        <View style={styles.listCopy}>
          <Text style={styles.listTitle} numberOfLines={2}>
            {meal.name}
          </Text>
          <View style={styles.tagRow}>
            {primaryTag ? <Chip label={primaryTag} compact /> : null}
            {secondaryTag ? <Chip label={secondaryTag} compact /> : null}
          </View>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={appTheme.colors.textMuted}
        />
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.featuredCard, pressed && styles.pressed]}>
      <MealImage uri={meal.image} style={styles.featuredImage} />
      <LinearGradient colors={appTheme.imageOverlay} style={styles.featuredOverlay} />
      <View style={styles.featuredContent}>
        <View style={styles.tagRow}>
          {primaryTag ? <Chip label={primaryTag} compact /> : null}
          {secondaryTag ? <Chip label={secondaryTag} compact /> : null}
        </View>
        <Text style={styles.featuredTitle} numberOfLines={2}>
          {meal.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    width: 250,
    height: 320,
    borderRadius: appTheme.radii.xl,
    overflow: 'hidden',
    backgroundColor: appTheme.colors.surfaceMuted,
  },
  featuredImage: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: appTheme.spacing.lg,
    gap: appTheme.spacing.sm,
  },
  featuredTitle: {
    color: appTheme.colors.surfaceElevated,
    fontFamily: appTheme.fontFamilies.display,
    fontSize: 28,
    lineHeight: 34,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.md,
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    padding: appTheme.spacing.sm,
    ...appTheme.shadow,
  },
  listImage: {
    width: 104,
    height: 104,
    borderRadius: appTheme.radii.md,
  },
  listCopy: {
    flex: 1,
    gap: appTheme.spacing.sm,
  },
  listTitle: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.displayMedium,
    fontSize: 22,
    lineHeight: 28,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.xs,
  },
  pressed: {
    opacity: 0.92,
  },
});
