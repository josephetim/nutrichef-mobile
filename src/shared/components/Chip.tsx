import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { appTheme } from '@/src/shared/constants/theme';

type ChipProps = {
  label: string;
  active?: boolean;
  compact?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, active = false, compact = false, onPress, style }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        active && styles.active,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: appTheme.radii.pill,
    backgroundColor: appTheme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    paddingHorizontal: appTheme.spacing.md,
    paddingVertical: 10,
  },
  compact: {
    paddingVertical: 8,
    paddingHorizontal: appTheme.spacing.sm,
  },
  active: {
    backgroundColor: appTheme.colors.primary,
    borderColor: appTheme.colors.primary,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 13,
  },
  labelActive: {
    color: appTheme.colors.surfaceElevated,
  },
});
