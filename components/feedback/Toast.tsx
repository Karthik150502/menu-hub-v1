import { FONT_SIZES } from '@/constants/themes/font';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
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
    Text,
    View,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
    message: string;
    title?: string;
    type?: ToastType;
    /** Duration in ms before auto-dismiss. Pass 0 to stay until manually closed. */
    duration?: number;
}

interface ToastEntry extends ToastOptions {
    id: number;
}

interface ToastContextValue {
    show: (opts: ToastOptions) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<ToastType, { accent: string; bg: string; icon: string; iconBg: string }> = {
    success: {
        accent: DESIGN_TOKENS.primaryBright,
        bg: DESIGN_TOKENS.toastSuccessBg,
        icon: '✓',
        iconBg: DESIGN_TOKENS.accentFaint,
    },
    error: {
        accent: DESIGN_TOKENS.subNegative,
        bg: DESIGN_TOKENS.toastErrorBg,
        icon: '✕',
        iconBg: DESIGN_TOKENS.errorWarn,
    },
    warning: {
        accent: DESIGN_TOKENS.toastWarningAccent,
        bg: DESIGN_TOKENS.toastWarningBg,
        icon: '⚠',
        iconBg: DESIGN_TOKENS.toastWarningIconBg,
    },
    info: {
        accent: DESIGN_TOKENS.toastInfoAccent,
        bg: DESIGN_TOKENS.toastInfoBg,
        icon: 'i',
        iconBg: DESIGN_TOKENS.toastInfoIconBg,
    },
};

const DEFAULT_DURATION = 3500;
const SLIDE_FROM = -120; // slides in from above

// ─── Single Toast ─────────────────────────────────────────────────────────────

const ToastItem: React.FC<{
    entry: ToastEntry;
    onDismiss: (id: number) => void;
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
            <View style={[styles.iconWrap, { backgroundColor: cfg.iconBg }]}>
                <Text style={[styles.iconText, { color: cfg.accent }]}>{cfg.icon}</Text>
            </View>

            {/* Text */}
            <View style={styles.textWrap}>
                {entry.title ? (
                    <Text style={styles.title} numberOfLines={1}>{entry.title}</Text>
                ) : null}
                <Text style={styles.message} numberOfLines={3}>{entry.message}</Text>
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

const ToastContainer: React.FC<{
    toasts: ToastEntry[];
    onDismiss: (id: number) => void;
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
    const [toasts, setToasts] = useState<ToastEntry[]>([]);
    const counter = useRef(0);

    const show = useCallback((opts: ToastOptions) => {
        const id = ++counter.current;
        setToasts(prev => [...prev, { ...opts, id }]);
    }, []);

    const dismiss = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
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
        <ToastContext.Provider value={{ show, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
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
        top: Platform.OS === 'ios' ? 56 : 40,
        left: 16,
        right: 16,
        zIndex: 9999,
        gap: 10,
        pointerEvents: 'box-none',
    },

    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        overflow: 'hidden',
        paddingVertical: 14,
        paddingRight: 14,
        paddingLeft: 0,
        gap: 12,
        // shadow
        shadowColor: DESIGN_TOKENS.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 12,
        backgroundColor: DESIGN_TOKENS.bottomToastBg,
    },

    accentBar: {
        width: 3,
        alignSelf: 'stretch',
        borderRadius: 2,
        marginLeft: 0,
        flexShrink: 0,
    },

    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    iconText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '800',
        lineHeight: 18,
    },

    textWrap: { flex: 1 },
    title: {
        color: DESIGN_TOKENS.primaryText,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        letterSpacing: 0.1,
        marginBottom: 2,
    },
    message: {
        color: DESIGN_TOKENS.textSubtle,
        fontSize: FONT_SIZES.md,
        lineHeight: 18,
        fontWeight: '500'
    },

    closeBtn: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    closeText: {
        color: DESIGN_TOKENS.textMuted,
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
    },

    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        transformOrigin: 'left',
        borderRadius: 1,
    },
});