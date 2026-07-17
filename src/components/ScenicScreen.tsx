import {
  ImageBackground,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/design/tokens';

export function ScenicScreen({
  children,
  scroll = true,
  contentContainerStyle,
  ...props
}: ScrollViewProps & { scroll?: boolean }) {
  const content = scroll ? (
    <ScrollView
      {...props}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.fill, contentContainerStyle]}>
      {children}
    </View>
  );
  return (
    <ImageBackground
      source={require('../../assets/images/odyssey-scenic-bg.png')}
      resizeMode="cover"
      style={styles.background}
      accessibilityIgnoresInvertColors
      accessible={false}
    >
      <View style={styles.wash} />
      <SafeAreaView style={styles.safe}>{content}</SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: colors.sky },
  wash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(234,251,255,0.60)',
  },
  safe: { flex: 1 },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 120,
    gap: spacing.lg,
  },
  fill: { flex: 1 },
});
