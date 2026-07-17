import { Pressable, StyleSheet } from 'react-native';

import { colors, radii, spacing } from '@/design/tokens';

import { AppText } from './AppText';

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
    >
      <AppText variant="small" style={selected && styles.label}>
        {selected ? '✓ ' : ''}
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.foam,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.sand,
    borderColor: colors.aqua,
    borderWidth: 2,
  },
  label: { fontFamily: 'Manrope_700Bold' },
});
