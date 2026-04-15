import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';

import { appTheme } from '@/src/shared/constants/theme';

type MealImageProps = {
  uri: string | null;
  style?: StyleProp<ImageStyle>;
};

export function MealImage({ uri, style }: MealImageProps) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View style={[styles.frame, style]}>
        <LinearGradient colors={appTheme.accentGradient} style={StyleSheet.absoluteFillObject} />
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={28}
          color={appTheme.colors.surfaceElevated}
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      transition={220}
      contentFit="cover"
      style={[styles.frame, style]}
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.colors.surfaceMuted,
  },
});
