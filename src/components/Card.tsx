import { StyleSheet, View, ViewProps } from 'react-native';

import { colors, radii, spacing } from '@/design/tokens';

export function Card({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,253,244,0.94)',
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 18,
    paddingVertical: spacing.lg,
    shadowColor: colors.aqua,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
});
