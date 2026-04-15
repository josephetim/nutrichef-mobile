import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appTheme } from '@/src/shared/constants/theme';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle'>;
}>;

export function Screen({
  children,
  scroll = true,
  style,
  contentContainerStyle,
  scrollProps,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.content,
    {
      paddingTop: insets.top + 12,
      paddingBottom: insets.bottom + 32,
    },
    contentContainerStyle,
    style,
  ];

  return (
    <View style={styles.root}>
      <LinearGradient colors={appTheme.pageGradient} style={StyleSheet.absoluteFillObject} />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={containerStyle}
          {...scrollProps}>
          {children}
        </ScrollView>
      ) : (
        <View style={containerStyle}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: appTheme.spacing.lg,
    gap: appTheme.spacing.lg,
  },
});
