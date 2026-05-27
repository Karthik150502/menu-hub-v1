import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import Text from './appText';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BannerType = 'info' | 'error' | 'warning' | 'success';
export type BannerVariant = 'standard' | 'compact';

export interface AppBannerProps {
    type: BannerType;
    title: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    onDismiss?: () => void;
    variant?: BannerVariant;
    dismissible?: boolean;
    dismissRef?: (triggerFn: () => void) => void;
}

// ─── Per-type config ──────────────────────────────────────────────────────────

interface TypeConfig {
    icon: string;
    accent: string;
    bg: string;
    border: string;
    iconBg: string;
}

const CONFIG: Record<BannerType, TypeConfig> = {
    success: {
        icon: 'checkmark-circle-sharp',
        accent: DESIGN_TOKENS.subPositive,
        bg: 'rgba(9,198,15,0.06)',
        border: 'rgba(0, 255, 8, 0.23)',
        iconBg: 'rgba(9,198,15,0.14)',
    },
    info: {
        icon: 'information-circle-sharp',
        accent: DESIGN_TOKENS.feedbackInfo,
        bg: 'rgba(5,101,219,0.06)',
        border: 'rgba(5, 101, 219, 0.34)',
        iconBg: 'rgba(5,101,219,0.14)',
    },
    warning: {
        icon: 'warning-sharp',
        accent: DESIGN_TOKENS.feedbackWarning,
        bg: 'rgba(223,163,11,0.06)',
        border: 'rgba(223,163,11,0.20)',
        iconBg: 'rgba(223,163,11,0.14)',
    },
    error: {
        icon: 'alert-circle-sharp',
        accent: DESIGN_TOKENS.subNegative,
        bg: 'rgba(255,40,40,0.06)',
        border: 'rgba(255,40,40,0.18)',
        iconBg: 'rgba(255,40,40,0.12)',
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const AppBanner: React.FC<AppBannerProps> = ({
    type,
    title,
    message,
    actionLabel,
    onAction,
    onDismiss,
    variant = 'standard',
    dismissible = onDismiss !== undefined,
    dismissRef,
}) => {
    const cfg = CONFIG[type];
    const isCompact = variant === 'compact';

    // JS driver — maxHeight collapse
    const maxH = useRef(new Animated.Value(1)).current;
    // Native driver — opacity + translate
    const slideY = useRef(new Animated.Value(-10)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const handleDismiss = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0, duration: 160,
                useNativeDriver: true,
            }),
            Animated.timing(slideY, {
                toValue: -6, duration: 180,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(maxH, {
                toValue: 0, duration: 260, delay: 80,
                easing: Easing.in(Easing.quad),
                useNativeDriver: false,
            }),
        ]).start(() => onDismiss?.());
    };

    useEffect(() => {
        dismissRef?.(handleDismiss);
        Animated.parallel([
            Animated.timing(slideY, {
                toValue: 0, duration: 260,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1, duration: 220,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        // Outer — JS driver: maxHeight collapse only
        <Animated.View
            style={[
                styles.wrapper,
                {
                    maxHeight: maxH.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 300],
                    }),
                    overflow: 'hidden',
                },
            ]}
        >
            {/* Inner — native driver: opacity + translateY */}
            <Animated.View style={{ opacity, transform: [{ translateY: slideY }] }}>
                <View
                    style={[
                        styles.container,
                        isCompact && styles.containerCompact,
                        {
                            backgroundColor: cfg.bg,
                            borderColor: cfg.border,
                        },
                    ]}
                >
                    {/* Icon pill — square rounded */}
                    <View
                        style={[
                            styles.iconPill,
                            isCompact && styles.iconPillCompact,
                            { backgroundColor: cfg.iconBg },
                        ]}
                    >
                        <Ionicons
                            name={cfg.icon as any}
                            size={isCompact ? 14 : 18}
                            color={cfg.accent}
                        />
                    </View>

                    {/* Body */}
                    <View style={[styles.body, isCompact && styles.bodyCompact]}>
                        <Text
                            style={[styles.title, { color: cfg.accent }]}
                            numberOfLines={isCompact ? 1 : undefined}
                        >
                            {title}
                        </Text>

                        {!isCompact && message && (
                            <Text style={styles.message}>{message}</Text>
                        )}

                        {!isCompact && actionLabel && onAction && (
                            <TouchableOpacity
                                onPress={onAction}
                                activeOpacity={0.7}
                                style={styles.actionBtn}
                                hitSlop={{ top: 6, bottom: 6, left: 0, right: 8 }}
                            >
                                <Text style={[styles.actionLabel, { color: cfg.accent }]}>
                                    {actionLabel}
                                </Text>
                                <Ionicons
                                    name="arrow-forward-outline"
                                    size={11}
                                    color={cfg.accent}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Dismiss */}
                    {dismissible && (
                        <TouchableOpacity
                            onPress={handleDismiss}
                            activeOpacity={0.6}
                            style={styles.dismissBtn}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            accessibilityLabel="Dismiss"
                            accessibilityRole="button"
                        >
                            <Ionicons
                                name="close-outline"
                                size={15}
                                color={DESIGN_TOKENS.textSubtle}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </Animated.View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: {
        marginTop: SPACING.sm,
    },

    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.sm + 2,
        padding: SPACING.sm + 2,
        borderWidth: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    containerCompact: {
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },

    // Square rounded pill — no left bar, fully enclosed
    iconPill: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    iconPillCompact: {
        width: 28,
        height: 28,
        borderRadius: 8,
    },

    body: { flex: 1 },
    bodyCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },

    title: {
        ...TYPOGRAPHY.label,
        fontWeight: '600',
        lineHeight: 17,
        letterSpacing: 0.1,
    },

    message: {
        ...TYPOGRAPHY.bodySmall,
        color: DESIGN_TOKENS.textSubtle,
        marginTop: 3,
        lineHeight: 18,
        opacity: 0.70,
    },

    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginTop: SPACING.sm,
        alignSelf: 'flex-start',
    },
    actionLabel: {
        ...TYPOGRAPHY.bodySmall,
        fontWeight: '500',
        letterSpacing: 0.2,
    },

    dismissBtn: {
        width: 26,
        height: 26,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        opacity: 0.55,
    },
});

export default AppBanner;