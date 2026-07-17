import { Text, TextProps } from 'react-native';

import { colors, type } from '@/design/tokens';

type Variant = keyof typeof type;

export function AppText({
  variant = 'body',
  style,
  ...props
}: TextProps & { variant?: Variant }) {
  return (
    <Text
      maxFontSizeMultiplier={2}
      {...props}
      style={[type[variant], { color: colors.ink }, style]}
    />
  );
}
