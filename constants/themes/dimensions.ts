// constants/themes/dimensions.ts

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const DIMENSIONS = {
    // ── Icon rendering sizes (for vector icon libraries) ─────────────────────
    iconXs: 8,
    iconSm: 13,
    iconMd: 15,
    iconLg: 18,

    // ── Touch target / component sizes ────────────────────────────────────────
    // Reuse for: avatars, icon buttons, close buttons, icon wraps, dots
    touchSm: 20,
    touchMd: 24,
    touchLg: 32,
    touchXl: 34,
    touchXxl: 38,
    touchXxxl: 46,

    // ── Dot / indicator sizes ─────────────────────────────────────────────────
    dotSm: 7,
    dotMd: 14,

    // ── Line / bar dimensions ─────────────────────────────────────────────────
    // Reuse for: accent bars, progress bars, menu lines, thin decorative elements
    barThin: 2,
    barNormal: 3,
    barThick: 4,

    // ── Pill / handle ─────────────────────────────────────────────────────────
    pillWidth: 36,

    // ── Decorative line widths ────────────────────────────────────────────────
    // Reuse for: menu bars, rule lines
    barShort: 12,
    barFull: 18,

    // ── Feature / hero icon container ─────────────────────────────────────────
    featureIcon: 80,

    // ── Panel / overlay constraints ───────────────────────────────────────────
    // Reuse for: sidebars, drawers, sheets
    panelMaxWidth: 220,
    // Reuse for: dropdowns, context menus, select menus
    menuMinWidth: 160,
    // Reuse for: toasts, snackbars, notifications
    notifMaxWidth: 360,

    // ── Scene / hero area dimensions ──────────────────────────────────────────
    sceneSm: 300,
    sceneLg: 400,
    cardFloating: 54,

    // ── Card layout constraints ───────────────────────────────────────────────
    cardMinWidth: 260,
    cardMaxWidth: 520,

    // ── Context heights ───────────────────────────────────────────────────────
    bannerHeight: 130,
    inputMultilineMin: 80,
    sectionHeight: 540,

    // ── Platform safe area offsets ────────────────────────────────────────────
    safeAreaTopIOS: 56,
    safeAreaTopAndroid: 32,
    safeAreaBottomIOS: 40,
    safeAreaBottomAndroid: 24,
};

export const BORDER_RADIUS = {
    none: 0,
    xxs: 2,    // progress bars, drag pill
    xs: 4,     // tiny rounds (badge dots)
    sm: 6,     // small chips
    md: 10,    // button sm
    lg: 12,    // inputs, toggle rows
    xl: 14,    // dropdown panels, stat cards
    xxl: 16,   // toasts, button lg, icon buttons (32/2)
    card: 20,  // cards, containers
    panel: 24, // sidebar corners, center icons
    scene: 32, // large scene containers
    pill: 100, // pill shapes
    full: 999, // fully circular
};
