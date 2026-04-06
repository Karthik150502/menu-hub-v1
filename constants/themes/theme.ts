/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#800AA4';
const tintColorDark = '#FFF';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    primary: '#63136F',
    primary_2: '#9400AB',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    headerBackgroundColor: '#CEA1DC',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    primary: '#480353',
    primary_2: '#9400ab',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    headerBackgroundColor: '#1E0C1F',
  },
};

export const DESIGN_TOKENS: Record<string, string> = {
  // ── Semantic feedback ─────────────────────────────────────────────────────
  subPositive: '#09c60f',
  subNegative: '#FF0000',
  subNegativeDark: '#990000',
  subNegativeDarkFade: '#c3050521',
  subPositiveDarkFade: '#00ff0d41',
  subNeutral: 'rgba(234, 186, 255, 0.35)',
  subNeutralDark: 'rgba(193, 79, 242, 0.35)',

  // ── Text ──────────────────────────────────────────────────────────────────
  primaryText: '#FFFFFF',
  primaryWhite: '#FFFFFF',
  secondaryText: '#E0E0E0',
  textLabel: 'rgba(255,255,255,0.42)',
  titleText: 'rgba(255,255,255,0.75)',

  /** Subtle text — hints, helper copy */
  textHint: 'rgba(255, 255, 255, 0.44)',
  /** Dimmed text — optional labels, metadata */
  textMuted: 'rgba(255,255,255,0.25)',
  /** Disabled / placeholder text */
  textPlaceholder: 'rgba(255,255,255,0.20)',
  /** Secondary descriptive text */
  textSubtle: 'rgba(255,255,255,0.38)',
  /** Section / category titles */
  textSectionTitle: 'rgba(255,255,255,0.30)',
  /** Close / dismiss button text */
  textDismiss: 'rgba(255,255,255,0.50)',

  // ── Surfaces ──────────────────────────────────────────────────────────────
  background_1: '#110013',
  cardBg: '#1D1120',
  cardBorder: 'rgba(255,255,255,0.07)',

  /** Form input background */
  inputBg: 'rgba(255,255,255,0.04)',
  /** Form input default border */
  inputBorder: 'rgba(255,255,255,0.08)',

  // ── Dividers & chrome ─────────────────────────────────────────────────────
  divider: 'rgba(255,255,255,0.06)',
  dragPill: 'rgba(255,255,255,0.15)',

  /** Icon-button background (close, dismiss) */
  chromeBtnBg: 'rgba(255,255,255,0.08)',

  // ── Switch / toggle ───────────────────────────────────────────────────────
  switchTrackOff: '#2E2E38',

  // ── Accent ────────────────────────────────────────────────────────────────
  accentDefault: '#9400AB',
  primaryBright: '#AA00FF',

  /** ~15% opacity tint of accentDefault for chip/badge backgrounds */
  accentFaint: 'rgba(148,0,171,0.15)',

  // ── Price field ───────────────────────────────────────────────────────────
  /** Warm tint behind the ₹ badge — intentional brand warmth */
  currencyBadgeBg: 'rgba(249,115,22,0.10)',
};

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
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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