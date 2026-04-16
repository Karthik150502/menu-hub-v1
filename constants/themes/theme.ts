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
  dangerGlow: 'rgba(248,113,113,0.30)',
  dangerFaint: 'rgba(248,113,113,0.10)',
  dangerBorder: 'rgba(248,113,113,0.40)',
  textDisabled: 'rgba(255,255,255,0.28)',

  disabled: 'rgba(255,255,255,0.06)',
  disabledBorder: 'rgba(255,255,255,0.08)',

  ghostBorder: 'rgba(255,255,255,0.14)',
  ghostBg: 'rgba(255,255,255,0.05)',

  errorWarn: "#f56e6e81",

  // ── Text ──────────────────────────────────────────────────────────────────
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
  cardBorder: 'rgba(255,255,255,0.10)',

  /** Form input background */
  inputBg: 'rgba(255,255,255,0.04)',

  // ── Dividers & chrome ─────────────────────────────────────────────────────
  divider: 'rgba(255,255,255,0.06)',
  dragPill: 'rgba(255,255,255,0.15)',

  // ── Switch / toggle ───────────────────────────────────────────────────────
  switchTrackOff: '#2E2E38',

  // ── Accent ────────────────────────────────────────────────────────────────
  accentDefault: '#9400AB',
  primaryBright: '#AA00FF',
  bottomToastBg: 'rgba(22,22,32,0.96)',

  /** ~15% opacity tint of accentDefault for chip/badge backgrounds */
  accentFaint: 'rgba(148,0,171,0.15)',

  /** Warm tint behind the ₹ badge — intentional brand warmth */
  currencyBadgeBg: 'rgba(249,115,22,0.10)',

  black: '#000',

  // ── Toast specific ───────────────────────────────────────────────
  toastSuccessBg: 'rgba(97, 6, 111, 0.91)',
  toastErrorBg: 'rgba(88, 6, 6, 0.91)',
  toastWarningBg: 'rgba(122, 89, 5, 0.85)',
  toastInfoBg: 'rgba(4, 38, 80, 0.97)',

  toastWarningAccent: '#dfa30b',
  toastInfoAccent: '#0565dbfc',

  toastWarningIconBg: 'rgba(251,191,36,0.20)',
  toastInfoIconBg: 'rgba(96,165,250,0.20)',




  // ── Sidebar specific ───────────────────────────────────────────────
  sidebarAccentLine: 'rgba(99,179,237,0.18)',

  sidebarDivider: 'rgba(255,255,255,0.07)',
  sidebarDividerSoft: 'rgba(255,255,255,0.06)',

  sidebarOptionText: 'rgba(255,255,255,0.87)',
  sidebarOptionDisabled: 'rgba(255,255,255,0.35)',
  sidebarChevron: 'rgba(255,255,255,0.2)',



  whiteFadeSm: "rgba(255,255,255,0.18)",
  whiteFadeXs: "rgba(255,255,255,0.08)",


  // ── Dish Card specific ─────────────────────────────────────────────
  settingsBtnBg: 'rgba(0,0,0,0.45)',

  dropdownBorder: 'rgba(255,255,255,0.10)',
  textOnGhost: 'rgba(255,255,255,0.82)',

  badgeBg: 'rgba(0,0,0,0.38)',

  unavailableScrim: 'rgba(0,0,0,0.52)',
  unavailableText: 'rgba(255,255,255,0.55)',

  decorCircleStrong: 'rgba(255,255,255,0.12)',

  menuBadgePositiveBg: 'rgba(0,255,13,0.15)',
  menuBadgePositiveBorder: 'rgba(0,255,13,0.35)',
  menuBadgeNegativeBg: 'rgba(255,0,0,0.15)',
  menuBadgeNegativeBorder: 'rgba(255,0,0,0.35)',

  primaryAccent1: '#440246',
  primaryAccent2: '#650368',
  primaryAccent3: '#261c26',
  primaryAccent4: '#f916d7',
  primaryGlow: 'rgba(148,0,171,0.35)',
  primaryFaint: 'rgba(148,0,171,0.12)',
  primaryBorder: 'rgba(148,0,171,0.45)',
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