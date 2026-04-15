import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Screen } from '@/src/shared/components/Screen';
import { appTheme } from '@/src/shared/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.title}>That page is not on the menu.</Text>
      <Text style={styles.body}>
        The route you opened does not exist. Return to the home feed and keep planning from there.
      </Text>
      <Pressable onPress={() => router.replace('/(tabs)/home')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text style={styles.buttonLabel}>Go home</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: appTheme.colors.text,
    fontFamily: appTheme.fontFamilies.display,
    fontSize: 36,
    lineHeight: 42,
  },
  body: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamilies.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: appTheme.radii.pill,
    backgroundColor: appTheme.colors.primary,
    paddingHorizontal: appTheme.spacing.lg,
    paddingVertical: 14,
  },
  buttonLabel: {
    color: appTheme.colors.surfaceElevated,
    fontFamily: appTheme.fontFamilies.medium,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.9,
  },
});
