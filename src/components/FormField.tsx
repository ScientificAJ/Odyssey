import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { colors, radii, spacing, type } from '@/design/tokens';

import { AppText } from './AppText';

export function FormField({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={styles.group}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        {...props}
        style={[styles.input, props.multiline && styles.multiline]}
      />
      {!!error && (
        <AppText variant="small" style={styles.error}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.compact,
    backgroundColor: colors.foam,
    paddingHorizontal: spacing.lg,
    color: colors.ink,
    ...type.body,
  },
  multiline: {
    minHeight: 96,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  error: { color: colors.danger },
});
