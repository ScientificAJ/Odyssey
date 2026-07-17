import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';

import { colors, radii, spacing } from '@/design/tokens';

import { AppText } from './AppText';

export function Button({
  label,
  variant = 'primary',
  loading,
  icon,
  style,
  ...props
}: PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={loading || props.disabled}
      {...props}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        (loading || props.disabled) && styles.disabled,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
    >
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={colors.ink} /> : icon}
        {!loading && (
          <AppText variant="body" style={styles.label}>
            {label}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radii.button,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: { backgroundColor: colors.coral, borderColor: colors.coral },
  secondary: { backgroundColor: colors.foam, borderColor: colors.aqua },
  quiet: { backgroundColor: 'transparent', borderColor: 'transparent' },
  danger: { backgroundColor: colors.foam, borderColor: colors.danger },
  pressed: { transform: [{ translateY: 2 }], opacity: 0.88 },
  disabled: { opacity: 0.48 },
  content: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: 'Manrope_700Bold' },
});
