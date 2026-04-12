export const FONT_SIZES = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 26,
} as const;


export const TYPOGRAPHY = {
    heading_xl_700: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
    },
    heading_lg_500: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '500',
    },
    body: {
        fontSize: FONT_SIZES.md,
    },
    caption_sm_700: {
        fontSize: FONT_SIZES.sm,
        fontWeight: "700"
    },
    overline_xs_500: {
        fontSize: FONT_SIZES.xs,
        fontWeight:"500"
    }
} as const;