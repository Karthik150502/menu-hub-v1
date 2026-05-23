import { BORDER_RADIUS } from '@/constants/themes/dimensions';
import { FONT_SIZES, FONT_WEIGHTS } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { StyleSheet } from 'react-native';

/**
 * Centralised theme for the Page system.
 * Keeps magic values in one place; components import from here — not from the
 * global theme directly — so the Page subtree can be restyled independently.
 */
export const PAGE_THEME = {
    colors: {
        background: DESIGN_TOKENS.background_1,
        surface: DESIGN_TOKENS.cardBg,
        text: DESIGN_TOKENS.textPrimary,
        textSecondary: DESIGN_TOKENS.textHint,
        accent: DESIGN_TOKENS.accentDefault,
        error: DESIGN_TOKENS.subNegative,
        errorSubtle: DESIGN_TOKENS.feedbackNegativeSubtle,
        errorBorder: DESIGN_TOKENS.feedbackNegativeBorder,
        border: DESIGN_TOKENS.borderSubtle,
        loaderBg: 'rgba(0,0,0,0.45)',
    },
    spacing: {
        xs: SPACING.xs,    // 4
        sm: SPACING.sm,    // 8
        md: SPACING.md,    // 12
        lg: SPACING.lg,    // 16
        xl: SPACING.xl,    // 20
        xxl: SPACING.xxl,   // 24
        page: SPACING.lg,   // default horizontal page padding
    },
    radius: {
        sm: BORDER_RADIUS.sm,
        md: BORDER_RADIUS.md,
        lg: BORDER_RADIUS.lg,
        xl: BORDER_RADIUS.xl,
        pill: BORDER_RADIUS.pill,
    },
} as const;

export const pageStyles = StyleSheet.create({
    // ── Root container ────────────────────────────────────────────────────────
    root: {
        flex: 1,
    },
    // Centers the KAV column when mobileSize=true
    rootCentered: {
        alignItems: 'center',
    },

    // ── KeyboardAvoidingView ──────────────────────────────────────────────────
    // Must have flex:1 so it fills the SafeAreaView and doesn't clip content.
    keyboardAvoid: {
        flex: 1,
    },
    // Caps width to a single mobile column on larger screens
    kavMobile: {
        width: '100%',
        maxWidth: 430,
    },

    // ── Inner layout shell ────────────────────────────────────────────────────
    // Holds header + scrollArea + footer in a column.
    shell: {
        flex: 1,
    },

    // ── ScrollView ────────────────────────────────────────────────────────────
    scrollView: {
        flex: 1,
    },

    // ── ScrollView content container ──────────────────────────────────────────
    // flexGrow:1 lets short content stretch to fill, while long content scrolls.
    scrollContent: {
        flexGrow: 1,
        padding: PAGE_THEME.spacing.page,
    },

    // ── Static (non-scroll) content area ─────────────────────────────────────
    staticContent: {
        flex: 1,
        padding: PAGE_THEME.spacing.page,
    },

    // ── Footer wrapper ────────────────────────────────────────────────────────
    // Bottom padding is injected dynamically from useSafeAreaInsets().
    footer: {
        width: '100%',
    },

    // ── FullScreenLoader ──────────────────────────────────────────────────────
    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ── ErrorState ────────────────────────────────────────────────────────────
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: PAGE_THEME.spacing.xxl,
    },
    errorIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: PAGE_THEME.colors.errorSubtle,
        borderWidth: 1,
        borderColor: PAGE_THEME.colors.errorBorder,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: PAGE_THEME.spacing.lg,
    },
    errorTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.semibold,
        color: DESIGN_TOKENS.textPrimary,
        textAlign: 'center',
        marginBottom: PAGE_THEME.spacing.sm,
    },
    errorMessage: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.regular,
        color: DESIGN_TOKENS.textHint,
        textAlign: 'center',
        lineHeight: FONT_SIZES.sm * 1.5,
        marginBottom: PAGE_THEME.spacing.xl,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: PAGE_THEME.spacing.sm,
        paddingVertical: PAGE_THEME.spacing.sm + 2,
        paddingHorizontal: PAGE_THEME.spacing.xl,
        borderRadius: PAGE_THEME.radius.pill,
        backgroundColor: PAGE_THEME.colors.accent,
        minHeight: 44, // accessibility minimum touch target
    },
    retryLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
        color: DESIGN_TOKENS.primaryWhite,
    },
});
