import { FONT_SIZES } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
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
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BottomToastOptions {
    message: string;
    duration?: number;
}

interface BottomToastEntry extends BottomToastOptions {
    id: number;
}

interface BottomToastContextValue {
    show: (opts: BottomToastOptions) => void;
    info: (message: string, duration?: number) => void;
    // ↓ Exposed so BottomToastPortal can render the same toasts inside a Modal
    toasts: BottomToastEntry[];
    dismiss: (id: number) => void;
}

const DEFAULT_DURATION = 3000;
const SLIDE_FROM = 80;

// ─── Single item ─────────────────────────────────────────────────────────────

const BottomToastItem: React.FC<{
    entry: BottomToastEntry;
    onDismiss: (id: number) => void;
}> = ({ entry, onDismiss }) => {
    const translateY = useRef(new Animated.Value(SLIDE_FROM)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const dismissed = useRef(false);

    const dismiss = useCallback(() => {
        if (dismissed.current) return;
        dismissed.current = true;
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: SLIDE_FROM, duration: 260,
                easing: Easing.in(Easing.quad), useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0, duration: 200, useNativeDriver: true,
            }),
        ]).start(() => onDismiss(entry.id));
    }, [entry.id, onDismiss, opacity, translateY]);

    React.useEffect(() => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0, tension: 80, friction: 12, useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1, duration: 200, useNativeDriver: true,
            }),
        ]).start();

        const dur = entry.duration ?? DEFAULT_DURATION;
        if (dur > 0) {
            const t = setTimeout(dismiss, dur);
            return () => clearTimeout(t);
        }
    }, []);

    return (
        <Animated.View style={[styles.pill, { opacity, transform: [{ translateY }] }]}>
            <Text style={styles.message} numberOfLines={2}>{entry.message}</Text>
            <Pressable onPress={dismiss} hitSlop={12} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
            </Pressable>
        </Animated.View>
    );
};

// ─── Shared container — used by both Provider and Portal ─────────────────────

export const BottomToastContainer: React.FC<{
    toasts: BottomToastEntry[];
    onDismiss: (id: number) => void;
    /** Pass inset manually when used inside a Modal (safe area context may differ) */
    bottomInset?: number;
}> = ({ toasts, onDismiss, bottomInset }) => {
    const insets = useSafeAreaInsets();
    const bottom = (bottomInset ?? insets.bottom) + 16;

    return (
        <View
            style={[styles.container, { bottom }]}
            pointerEvents="box-none"
        >
            {toasts.map(entry => (
                <BottomToastItem key={entry.id} entry={entry} onDismiss={onDismiss} />
            ))}
        </View>
    );
};

// ─── Portal — drop this inside any Modal to show toasts above it ──────────────
//
// Usage inside your Modal:
//   <BottomToastPortal />
//
// It reads from the same context as useBottomToast(), so calling
// info('...') anywhere will show the toast inside the modal automatically.

export const BottomToastPortal: React.FC<{ bottomInset?: number }> = ({ bottomInset }) => {
    const { toasts, dismiss } = useBottomToast();
    return (
        <BottomToastContainer
            toasts={toasts}
            onDismiss={dismiss}
            bottomInset={bottomInset}
        />
    );
};

// ─── Context + Provider ───────────────────────────────────────────────────────

const BottomToastContext = createContext<BottomToastContextValue | null>(null);

export const BottomToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<BottomToastEntry[]>([]);
    const counter = useRef(0);

    const show = useCallback((opts: BottomToastOptions) => {
        const id = ++counter.current;
        setToasts(prev => [...prev, { ...opts, id }]);
    }, []);

    const dismiss = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const info = useCallback((message: string, duration?: number) =>
        show({ message, duration }), [show]);

    return (
        <BottomToastContext.Provider value={{ show, info, toasts, dismiss }}>
            {children}
            {/* Default container — visible on all normal screens */}
            <BottomToastContainer toasts={toasts} onDismiss={dismiss} />
        </BottomToastContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBottomToast(): BottomToastContextValue {
    const ctx = useContext(BottomToastContext);
    if (!ctx) throw new Error('useBottomToast must be used inside <BottomToastProvider>');
    return ctx;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 24,
        right: 24,
        alignItems: 'center',
        gap: 8,
        zIndex: 9999,
        pointerEvents: 'box-none',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: DESIGN_TOKENS.bottomToastBg,
        borderRadius: 100,
        paddingVertical: SPACING.md,
        paddingLeft: SPACING.xl,
        paddingRight: SPACING.bg,
        gap: 12,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.cardBorder,
        shadowColor: DESIGN_TOKENS.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 20,
        elevation: 14,
        maxWidth: 360,
    },
    message: {
        flex: 1,
        color: DESIGN_TOKENS.secondaryText,
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
        letterSpacing: 0.1,
        lineHeight: 18,
    },
    closeBtn: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    closeText: {
        color: DESIGN_TOKENS.textMuted,
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
    },
});