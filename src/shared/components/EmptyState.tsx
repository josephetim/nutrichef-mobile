import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appTheme } from '@/src/shared/constants/theme';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel ? (
        <Pressable onPress={onActionPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
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
    gap: appTheme.spacing.sm,
    ...appTheme.shadow,
  },
  title: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.displayMedium,
    fontSize: 24,
  },
  description: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 15,
    lineHeight: 23,
  },
  action: {
    alignSelf: 'flex-start',
    marginTop: 6,
    borderRadius: appTheme.radii.pill,
    backgroundColor: appTheme.colors.primary,
    paddingHorizontal: appTheme.spacing.md,
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.9,
  },
  actionLabel: {
    color: appTheme.colors.surfaceElevated,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 14,
  },
});
