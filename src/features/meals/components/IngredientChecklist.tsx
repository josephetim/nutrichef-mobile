import { StyleSheet, Text, View } from 'react-native';

import type { IngredientPair } from '@/src/features/meals/models/meal';
import { appTheme } from '@/src/shared/constants/theme';

type IngredientChecklistProps = {
  ingredients: IngredientPair[];
};

export function IngredientChecklist({ ingredients }: IngredientChecklistProps) {
  return (
    <View style={styles.card}>
      {ingredients.map((ingredient) => (
        <View key={`${ingredient.name}-${ingredient.measure ?? 'unit'}`} style={styles.row}>
          <View style={styles.dot} />
          <View style={styles.copy}>
            <Text style={styles.name}>{ingredient.name}</Text>
            {ingredient.measure ? <Text style={styles.measure}>{ingredient.measure}</Text> : null}
          </View>
        </View>
      ))}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.md,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: appTheme.radii.pill,
    backgroundColor: appTheme.colors.accent,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 15,
  },
  measure: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 13,
  },
});
