import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { FONT_SIZES, TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { dismissToast, selectToasts, showToast, Toast as ReduxToast } from '@/store/uiSlice';
import { Ionicons } from '@expo/vector-icons';
import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';
import {
    Animated,
    Easing,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import Text from '../custom/appText';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
    message: string;
    title?: string;
    type?: ToastType;
    /** Duration in ms before auto-dismiss. Pass 0 to stay until manually closed. */
    duration?: number;
}

type ToastEntry = ReduxToast;

interface ToastContextValue {
    show: (opts: ToastOptions) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    // Exposed so ToastPortal can render the same toasts inside a Modal
    toasts: ToastEntry[];
    dismiss: (id: string) => void;
    registerPortal: () => void;
    unregisterPortal: () => void;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<ToastType, { accent: string; bg?: string; icon: string }> = {
    success: {
        accent: DESIGN_TOKENS.subPositiveDark,
        bg: DESIGN_TOKENS.background_1,
        icon: 'checkmark-sharp',
    },
    error: {
        accent: DESIGN_TOKENS.errorRedDark,
        bg: DESIGN_TOKENS.background_1,
        icon: 'ban-outline',
    },
    warning: {
        accent: DESIGN_TOKENS.feedbackWarning,
        bg: DESIGN_TOKENS.background_1,
        icon: 'alert-circle-outline',
    },
    info: {
        accent: DESIGN_TOKENS.feedbackInfo,
        bg: DESIGN_TOKENS.background_1,
        icon: 'information-circle-outline',
    },
};

const DEFAULT_DURATION = 3500;
const SLIDE_FROM = -120; // slides in from above

// ─── Single Toast ─────────────────────────────────────────────────────────────

const ToastItem: React.FC<{
    entry: ToastEntry;
    onDismiss: (id: string) => void;
}> = ({ entry, onDismiss }) => {
    const cfg = TOAST_CONFIG[entry.type ?? 'info'];
    const translateY = useRef(new Animated.Value(SLIDE_FROM)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scaleX = useRef(new Animated.Value(1)).current;     // progress bar
    const dismissed = useRef(false);

    const dismiss = useCallback(() => {
        if (dismissed.current) return;
        dismissed.current = true;
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: SLIDE_FROM,
                duration: 280,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start(() => onDismiss(entry.id));
    }, [entry.id, onDismiss, opacity, translateY]);

    // Enter animation
    React.useEffect(() => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                tension: 70,
                friction: 11,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start();

        // Progress bar shrink
        const dur = entry.duration ?? DEFAULT_DURATION;
        if (dur > 0) {
            Animated.timing(scaleX, {
                toValue: 0,
                duration: dur,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(dismiss, dur);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <Animated.View
            style={[
                styles.toast,
                {
                    backgroundColor: cfg.bg,
                    borderColor: cfg.accent,
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            {/* Left accent bar */}
            <View style={[styles.accentBar, { backgroundColor: cfg.accent }]} />

            {/* Icon */}
            <View style={[styles.iconWrap, { backgroundColor: cfg.bg, borderColor: cfg.accent }]}>
                <Ionicons name={cfg.icon as any} size={FONT_SIZES.xxl} color={cfg.accent} />
            </View>

            {/* Text */}
            <View style={styles.textWrap}>
                {entry.title ? (
                    <Text style={styles.title} numberOfLines={4} ellipsizeMode="tail">{entry.title}</Text>
                ) : null}
                {entry.message ? (
                    <Text style={styles.message} numberOfLines={3}>{entry.message}</Text>
                ) : null}
            </View>

            {/* Close */}
            <Pressable onPress={dismiss} style={styles.closeBtn} hitSlop={10}>
                <Text style={styles.closeText}>✕</Text>
            </Pressable>
            {/* Progress bar */}
            {(entry.duration ?? DEFAULT_DURATION) > 0 && (
                <Animated.View
                    style={[
                        styles.progressBar,
                        { backgroundColor: cfg.accent, transform: [{ scaleX }] },
                    ]}
                />
            )}
        </Animated.View>
    );
};

// ─── Toast Container ──────────────────────────────────────────────────────────

export const ToastContainer: React.FC<{
    toasts: ToastEntry[];
    onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => (
    <View style={styles.container} pointerEvents="box-none">
        {toasts.map(entry => (
            <ToastItem key={entry.id} entry={entry} onDismiss={onDismiss} />
        ))}
    </View>
);

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const toasts = useAppSelector(selectToasts);
    const [hasPortal, setHasPortal] = useState(false);
    const portalCount = useRef(0);

    const show = useCallback((opts: ToastOptions) => {
        dispatch(showToast({
            type: opts.type ?? 'info',
            title: opts.title,
            message: opts.message,
            duration: opts.duration,
        }));
    }, [dispatch]);

    const dismiss = useCallback((id: string) => {
        dispatch(dismissToast(id));
    }, [dispatch]);

    const registerPortal = useCallback(() => {
        portalCount.current += 1;
        setHasPortal(true);
    }, []);

    const unregisterPortal = useCallback(() => {
        portalCount.current -= 1;
        if (portalCount.current === 0) setHasPortal(false);
    }, []);

    const success = useCallback((message: string, title?: string) =>
        show({ message, title, type: 'success' }), [show]);

    const error = useCallback((message: string, title?: string) =>
        show({ message, title, type: 'error' }), [show]);

    const warning = useCallback((message: string, title?: string) =>
        show({ message, title, type: 'warning' }), [show]);

    const info = useCallback((message: string, title?: string) =>
        show({ message, title, type: 'info' }), [show]);

    return (
        <ToastContext.Provider value={{ show, success, error, warning, info, toasts, dismiss, registerPortal, unregisterPortal }}>
            {children}
            {!hasPortal && <ToastContainer toasts={toasts} onDismiss={dismiss} />}
        </ToastContext.Provider>
    );
};

// ─── Portal — drop inside any Modal to show toasts above it ──────────────────
//
// Usage inside your Modal:
//   <ToastPortal />
//
// Reads from the same context as useToast(), so calling toast.success(...)
// anywhere will show the toast inside the modal automatically.

export const ToastPortal: React.FC = () => {
    const { toasts, dismiss, registerPortal, unregisterPortal } = useToast();

    React.useEffect(() => {
        registerPortal();
        return () => unregisterPortal();
    }, []);

    return <ToastContainer toasts={toasts} onDismiss={dismiss} />;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? DIMENSIONS.safeAreaTopIOS : 40,
        left: SPACING.lg,
        right: SPACING.lg,
        zIndex: 9999,
        gap: SPACING.ssm,
        pointerEvents: 'box-none',
    },

    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.xxl,
        overflow: 'hidden',
        paddingVertical: SPACING.bg,
        paddingRight: SPACING.bg,
        paddingLeft: SPACING.none,
        gap: SPACING.md,
        // shadow
        shadowColor: DESIGN_TOKENS.primaryBlack,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 12,
        backgroundColor: DESIGN_TOKENS.background_1,
    },

    accentBar: {
        width: DIMENSIONS.barNormal,
        alignSelf: 'stretch',
        borderRadius: BORDER_RADIUS.xxs,
        marginLeft: 0,
        flexShrink: 0,
    },

    iconWrap: {
        width: DIMENSIONS.touchXl,
        height: DIMENSIONS.touchXl,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    iconText: {
        ...TYPOGRAPHY.h4
    },

    textWrap: { flex: 1 },
    title: {
        color: DESIGN_TOKENS.titleText,
        ...TYPOGRAPHY.body_bold,
        marginBottom: SPACING.xxs,
    },
    message: {
        color: DESIGN_TOKENS.textSubtle,
        ...TYPOGRAPHY.body
    },

    closeBtn: {
        width: DIMENSIONS.touchMd,
        height: DIMENSIONS.touchMd,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    closeText: {
        color: DESIGN_TOKENS.textMuted,
        ...TYPOGRAPHY.bodySmall,
    },

    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: DIMENSIONS.barThin,
        transformOrigin: 'left',
        borderRadius: BORDER_RADIUS.xxs,
    },
});