import React, { memo } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    TouchableWithoutFeedback,
    View,
    type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ErrorState from './components/ErrorState';
import FullScreenLoader from './components/FullScreenLoader';
import { PAGE_THEME, pageStyles } from './styles';
import type { PaddingValue, PageProps } from './types';

// ─── Padding resolver ─────────────────────────────────────────────────────────
// Converts the flexible `padding` prop into a concrete ViewStyle object so that
// callers can pass either a single number or per-side/axis objects.

function resolvePadding(padding?: PaddingValue): ViewStyle {
    if (padding === undefined || padding === null) return {};
    if (typeof padding === 'number') return { padding };

    const style: ViewStyle = {};
    // Apply shorthand axes first, then explicit sides override them.
    if (padding.horizontal !== undefined) {
        style.paddingLeft = padding.horizontal;
        style.paddingRight = padding.horizontal;
    }
    if (padding.vertical !== undefined) {
        style.paddingTop = padding.vertical;
        style.paddingBottom = padding.vertical;
    }
    if (padding.top !== undefined) style.paddingTop = padding.top;
    if (padding.bottom !== undefined) style.paddingBottom = padding.bottom;
    if (padding.left !== undefined) style.paddingLeft = padding.left;
    if (padding.right !== undefined) style.paddingRight = padding.right;
    return style;
}

// ─── KeyboardAvoidingView behaviour ──────────────────────────────────────────
// iOS:     "padding" — the KAV adds bottom padding equal to the keyboard height,
//          pushing all content up. Works reliably with ScrollViews.
// Android: "height" — the KAV shrinks its own height. On Android the OS usually
//          handles keyboard avoidance via windowSoftInputMode="adjustResize" in
//          the manifest, so "height" is a safe fallback that avoids double-offset.

const KAV_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Page
 *
 * Production-grade screen wrapper. Drop it at the root of any screen component
 * to get safe area handling, keyboard avoidance, pull-to-refresh, loading/error
 * states, and fixed header/footer slots — all in one composable API.
 *
 * Architecture (outermost → innermost):
 *
 *   StatusBar
 *   └─ View (root — carries backgroundColor, top-safe-area padding)
 *      └─ KeyboardAvoidingView (always rendered; enabled prop toggles it)
 *         └─ TouchableWithoutFeedback? (keyboard dismiss — only when keyboardAware)
 *            └─ View (shell — flex column, fills KAV)
 *               ├─ {header}           ← fixed, above scroll area
 *               ├─ ScrollView | View  ← content area (conditional)
 *               │    └─ {children}
 *               └─ View (footer)      ← fixed, respects bottom safe area
 *
 * Why each layer exists:
 * - StatusBar: must be explicitly managed per-screen on Android; on iOS it
 *   inherits from the nearest navigator but explicit control is safer.
 * - Root View: holds the background colour behind safe areas so there is no
 *   white flash on older iPhones with notches.
 * - useSafeAreaInsets: more flexible than <SafeAreaView> — lets us decide
 *   independently which edges get inset (top always; bottom only on footer).
 * - KeyboardAvoidingView: without it, the soft keyboard overlaps TextInputs
 *   on iOS. Setting enabled=false makes it behave as a plain View when not needed.
 * - TouchableWithoutFeedback: wraps the whole shell so ANY tap outside an input
 *   dismisses the keyboard. `accessible={false}` prevents it from swallowing
 *   screen-reader focus from child elements.
 * - ScrollView vs View: ScrollView is only mounted when scrollable=true — it
 *   carries overhead (scroll position tracking, layout passes) that non-scrollable
 *   screens (camera, maps, splash) don't need.
 * - footer outside ScrollView: if the footer were inside the ScrollView it would
 *   scroll away with the content. Keeping it outside guarantees it stays fixed.
 */
const Page: React.FC<PageProps> = memo(({
    children,
    testID,

    scrollable = true,
    safeArea = true,

    loading = false,
    error = null,
    onRetry,

    refreshing = false,
    onRefresh,

    statusBarStyle = 'light-content',
    keyboardAware = true,

    backgroundColor = PAGE_THEME.colors.background,
    padding,
    style,
    contentContainerStyle,

    header,
    footer,

    accessibilityLabel,
}) => {
    // Safe-area insets — gives us the exact pixel values for notch, home bar etc.
    // We apply the top inset to the root container and the bottom inset only to
    // the footer (or the content area when there is no footer). This avoids the
    // double-padding problem that occurs when nesting SafeAreaView inside a
    // navigator that already handles safe areas.
    const insets = useSafeAreaInsets();
    const topInset = safeArea ? insets.top : 0;
    const bottomInset = safeArea ? insets.bottom : 0;

    const paddingStyle = resolvePadding(padding);

    // ── Scroll area ───────────────────────────────────────────────────────────
    const scrollContentStyle = [
        pageStyles.scrollContent,
        paddingStyle,
        contentContainerStyle,
    ];

    const staticContentStyle = [
        pageStyles.staticContent,
        paddingStyle,
        contentContainerStyle,
    ];

    // ── Footer wrapper ────────────────────────────────────────────────────────
    // The bottom safe-area inset is applied here rather than on the root so
    // that the footer background extends behind the home indicator on iOS.
    const footerStyle = [
        pageStyles.footer,
        { paddingBottom: bottomInset },
    ];

    // ── Content area (loading / error / normal) ───────────────────────────────
    const contentArea = loading ? (
        <FullScreenLoader backgroundColor={backgroundColor} />
    ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
    ) : scrollable ? (
        /*
         * ScrollView is conditionally rendered only when scrollable=true.
         * keyboardDismissMode="on-drag" dismisses the keyboard as soon as the
         * user starts scrolling — feels natural on iOS.
         * keyboardShouldPersistTaps="handled" lets buttons inside the scroll
         * area receive taps without first requiring a tap to dismiss the keyboard.
         * showsVerticalScrollIndicator=false keeps the UI clean.
         */
        <ScrollView
            style={pageStyles.scrollView}
            contentContainerStyle={scrollContentStyle}
            keyboardDismissMode={keyboardAware ? 'on-drag' : 'none'}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={PAGE_THEME.colors.accent}
                        colors={[PAGE_THEME.colors.accent]}
                    />
                ) : undefined
            }
        >
            {children}
        </ScrollView>
    ) : (
        /*
         * Non-scrollable screens (camera, map, splash) use a plain View.
         * flex:1 ensures the content fills the remaining space between the
         * header and footer without needing explicit height calculations.
         */
        <View style={staticContentStyle}>
            {children}
        </View>
    );

    // ── Shell (column layout) ─────────────────────────────────────────────────
    // The shell is what sits inside the KAV. It is a plain View rather than
    // a Fragment because TouchableWithoutFeedback requires a single child.
    const shell = (
        <View
            style={pageStyles.shell}
            accessible={!!accessibilityLabel}
            accessibilityLabel={accessibilityLabel}
        >
            {header}
            {contentArea}
            {/* Footer only shown in normal state — not during loading/error */}
            {!loading && !error && footer && (
                <View style={footerStyle}>
                    {footer}
                </View>
            )}
        </View>
    );

    return (
        <View
            style={[
                pageStyles.root,
                { backgroundColor, paddingTop: topInset },
                style,
            ]}
            testID={testID}
        >
            {/*
             * StatusBar must be inside the component tree (not the View) so that
             * screens deeper in the navigator can override it. On Android,
             * backgroundColor keeps the status bar tinted to match the page.
             */}
            <StatusBar
                barStyle={statusBarStyle}
                backgroundColor={backgroundColor}
                translucent={false}
            />

            {/*
             * KeyboardAvoidingView is always mounted; `enabled` toggles its
             * behaviour. When disabled it renders as a plain View so the layout
             * remains identical regardless of the keyboardAware prop.
             */}
            <KeyboardAvoidingView
                style={pageStyles.keyboardAvoid}
                behavior={KAV_BEHAVIOR}
                enabled={keyboardAware}
            >
                {/*
                 * TouchableWithoutFeedback with Keyboard.dismiss is only applied
                 * when keyboardAware=true. accessible=false prevents the wrapper
                 * from creating a spurious accessibility node that swallows focus.
                 */}
                {keyboardAware ? (
                    <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss}
                        accessible={false}
                    >
                        {shell}
                    </TouchableWithoutFeedback>
                ) : (
                    shell
                )}
            </KeyboardAvoidingView>
        </View>
    );
});

Page.displayName = 'Page';
export default Page;
