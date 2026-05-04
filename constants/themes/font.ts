export const FONT_SIZES = {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
} as const;

export const FONT_WEIGHTS = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
} as const;

export const LINE_HEIGHTS = {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
} as const;


export const TYPOGRAPHY = {
    // ── Display (Hero / Big titles) ─────────────────────
    display: {
        fontSize: FONT_SIZES.display,
        fontWeight: FONT_WEIGHTS.bold,
        lineHeight: FONT_SIZES.display * LINE_HEIGHTS.tight,
    },

    // ── Headings ────────────────────────────────────────
    h1: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold,
        lineHeight: FONT_SIZES.xxxl * LINE_HEIGHTS.tight,
    },
    h2: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.semibold,
        lineHeight: FONT_SIZES.xxl * LINE_HEIGHTS.tight,
    },
    h3: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.semibold,
        lineHeight: FONT_SIZES.xl * LINE_HEIGHTS.normal,
    },
    h3_bold: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        lineHeight: FONT_SIZES.xl * LINE_HEIGHTS.normal,
    },
    h4: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.medium,
        lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.normal,
    },
    h4_bold: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.normal,
    },

    // ── Body Text ───────────────────────────────────────
    bodyLarge: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.regular,
        lineHeight: FONT_SIZES.base * LINE_HEIGHTS.relaxed,
    },
    body: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.regular,
        lineHeight: FONT_SIZES.md * LINE_HEIGHTS.relaxed,
    },
    body_bold: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.bold,
        lineHeight: FONT_SIZES.md * LINE_HEIGHTS.relaxed,
    },
    bodyBase: {
        fontSize: FONT_SIZES.base,
        fontWeight: FONT_WEIGHTS.regular,
        lineHeight: FONT_SIZES.md * LINE_HEIGHTS.relaxed,
    },
    bodySmall: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.regular,
        lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
    },

    // ── Labels / UI Text ────────────────────────────────
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium,
        letterSpacing: 0.3,
    },
    caption: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.regular,
        letterSpacing: 0.2,
    },
    caption_bold: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.bold,
        letterSpacing: 0.2,
    },
    overline: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.medium,
        letterSpacing: 1,
        textTransform: 'uppercase' as const,
    },

    // ── Buttons ─────────────────────────────────────────
    buttonLarge: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    button: {
        fontSize: FONT_SIZES.base,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    buttonSmall: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium,
    },

    // ── Inputs ──────────────────────────────────────────
    input: {
        fontSize: FONT_SIZES.base,
        fontWeight: FONT_WEIGHTS.regular,
    },
    inputLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium,
    },
    inputHelper: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.regular,
    },

} as const;