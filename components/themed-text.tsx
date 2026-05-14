import { FONT_SIZES, FONT_WEIGHTS } from '@/constants/themes/font';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import Text from '@/components/custom/appText';
import { StyleSheet, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: FONT_SIZES.base,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: FONT_SIZES.base,
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  title: {
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.display,
  },
  subtitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  link: {
    lineHeight: 30,
    fontSize: FONT_SIZES.base,
    color: DESIGN_TOKENS.linkColor,
  },
});
