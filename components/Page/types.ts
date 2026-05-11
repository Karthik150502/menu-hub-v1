import type { ReactNode } from 'react';
import type { StatusBarStyle, StyleProp, ViewStyle } from 'react-native';

/**
 * Padding can be a single number (all sides) or an object for granular control.
 * `horizontal`/`vertical` are shorthand; explicit `top`/`bottom`/`left`/`right`
 * override them when both are provided.
 */
export type PaddingValue =
    | number
    | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
        horizontal?: number;
        vertical?: number;
    };

export interface PageProps {
    // ── Core ─────────────────────────────────────────────────────────────────
    children: ReactNode;
    testID?: string;

    // ── Layout ───────────────────────────────────────────────────────────────
    /**
     * Wraps content in a ScrollView.
     * Set false for screens whose content should NOT scroll (e.g. camera, map).
     * @default true
     */
    scrollable?: boolean;

    /**
     * Applies safe-area insets (notch, home indicator) via useSafeAreaInsets.
     * Disable only for full-bleed screens (splash, media player).
     * @default true
     */
    safeArea?: boolean;

    // ── State ─────────────────────────────────────────────────────────────────
    /** Shows a full-screen loading indicator instead of content. */
    loading?: boolean;

    /** Shows an error state with an optional retry button instead of content. */
    error?: string | null;

    /** Called when the user taps "Try again" in the error state. */
    onRetry?: () => void;

    // ── Pull to refresh ───────────────────────────────────────────────────────
    /** Controlled refreshing state. Requires scrollable=true. */
    refreshing?: boolean;

    /** Called when the user pulls down. Requires scrollable=true. */
    onRefresh?: () => void;

    // ── Status bar ────────────────────────────────────────────────────────────
    /**
     * Controls the status bar icon/text color.
     * Use 'light-content' on dark backgrounds, 'dark-content' on light ones.
     * @default 'light-content'
     */
    statusBarStyle?: StatusBarStyle;

    // ── Keyboard ──────────────────────────────────────────────────────────────
    /**
     * Enables KeyboardAvoidingView so inputs are never hidden by the soft keyboard.
     * Also adds TouchableWithoutFeedback to dismiss keyboard on outside tap.
     * @default true
     */
    keyboardAware?: boolean;

    // ── Styling ───────────────────────────────────────────────────────────────
    /** Screen background colour. Applied to the root container and StatusBar. */
    backgroundColor?: string;

    /**
     * Padding applied to the scrollable content area (or static content View).
     * Does NOT affect header/footer — those are outside the scroll viewport.
     */
    padding?: PaddingValue;

    /** Extra styles on the outermost container. */
    style?: StyleProp<ViewStyle>;

    /**
     * Passed directly to ScrollView's contentContainerStyle (or the inner View
     * when scrollable=false). Use for centering content, min-heights etc.
     */
    contentContainerStyle?: StyleProp<ViewStyle>;

    // ── Layout slots ──────────────────────────────────────────────────────────
    /**
     * Fixed header rendered above the scroll area. Unaffected by scrolling.
     * Ideal for custom navigation bars or sticky titles.
     */
    header?: ReactNode;

    /**
     * Fixed footer rendered below the scroll area. Stays in place as content
     * scrolls. Ideal for CTA buttons, tab bars, action strips.
     */
    footer?: ReactNode;

    // ── Accessibility ─────────────────────────────────────────────────────────
    accessibilityLabel?: string;
}

export interface FullScreenLoaderProps {
    /** ActivityIndicator color. Defaults to theme accent. */
    color?: string;
    size?: 'small' | 'large';
    backgroundColor?: string;
}

export interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
}
