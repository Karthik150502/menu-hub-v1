/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#800aa4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    primary: "#63136f",
    primary_2: "#9400ab",
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    headerBackgroundColor: '#cea1dc'
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    primary: "#480353",
    primary_2: "#9400ab",
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    headerBackgroundColor: '#1e0c1f'
  },
};


export const DESIGN_TOKENS = {
  subPositive: '#00ff08',
  subNegative: '#ff0000',
  subNegativeDark: '#990000',
  subNeutral: 'rgba(234, 186, 255, 0.35)',
  textLabel: 'rgba(255,255,255,0.42)',
  primaryText: '#ffffff',
  secondaryText: "#e0e0e0",
  titleText: 'rgba(255,255,255,0.75)',
  cardBg: '#1d1120',
  cardBorder: 'rgba(255,255,255,0.07)',
  accentDefault: "#9400ab",
  background_1: "#110013",
  primaryBright: "#aa00ff",
  primaryWhite:"#ffffff"
}

export const STATS_CARD_COLORS = {
  bg: DESIGN_TOKENS.background_1,
  cardBg: DESIGN_TOKENS.cardBg,
  cardBorder: DESIGN_TOKENS.cardBorder,
  label: DESIGN_TOKENS.textLabel,
  value: DESIGN_TOKENS.primaryText,
  subPositive: DESIGN_TOKENS.subPositive,
  subNegative: DESIGN_TOKENS.subNegative,
  subNeutral: DESIGN_TOKENS.subNeutral,
  accentDefault: DESIGN_TOKENS.accentDefault,
  refreshIcon: DESIGN_TOKENS.subNeutral,
  title: DESIGN_TOKENS.titleText,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
