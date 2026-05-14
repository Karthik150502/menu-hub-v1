import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BannerType    = 'info' | 'error' | 'warning' | 'success';
export type BannerVariant = 'standard' | 'compact';

export interface AppBannerProps {
    type:          BannerType;
    title:         string;
    message?:      string;
    actionLabel?:  string;
    onAction?:     () => void;
    onDismiss?:    () => void;
    variant?:      BannerVariant;
    dismissible?:  boolean;
    dismissRef?:   (triggerFn: () => void) => void;
}

// ─── Per-type config ──────────────────────────────────────────────────────────

interface TypeConfig {
    icon:    string;
    accent:  string;
    bg:      string;
    border:  string;
    bar:     string;   // 3px left accent bar
    iconBg:  string;
}

const CONFIG: Record<BannerType, TypeConfig> = {
    success: {
        icon:   'checkmark-circle-outline',
        accent: DESIGN_TOKENS.subPositive,
        bg:     'rgba(9,198,15,0.05)',
        border: 'rgba(9,198,15,0.18)',
        bar:    DESIGN_TOKENS.subPositive,
        iconBg: 'rgba(9,198,15,0.10)',
    },
    info: {
        icon:   'information-circle-outline',
        accent: DESIGN_TOKENS.feedbackInfo,
        bg:     'rgba(5,101,219,0.05)',
        border: 'rgba(5,101,219,0.18)',
        bar:    DESIGN_TOKENS.feedbackInfo,
        iconBg: 'rgba(5,101,219,0.10)',
    },
    warning: {
        icon:   'warning-outline',
        accent: DESIGN_TOKENS.feedbackWarning,
        bg:     'rgba(223,163,11,0.05)',
        border: 'rgba(223,163,11,0.18)',
        bar:    DESIGN_TOKENS.feedbackWarning,
        iconBg: 'rgba(223,163,11,0.10)',
    },
    error: {
        icon:   'alert-circle-outline',
        accent: DESIGN_TOKENS.subNegative,
        bg:     'rgba(255,0,0,0.04)',
        border: 'rgba(255,0,0,0.16)',
        bar:    DESIGN_TOKENS.subNegative,
        iconBg: 'rgba(255,0,0,0.08)',
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
    variant     = 'standard',
    dismissible = onDismiss !== undefined,
    dismissRef,
}) => {
    const cfg       = CONFIG[type];
    const isCompact = variant === 'compact';

    const slideY  = useRef(new Animated.Value(-10)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const maxH    = useRef(new Animated.Value(1)).current;

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
                toValue: 0, duration: 240,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1, duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        // Outer — JS driver only: collapses maxHeight on dismiss.
        // Cannot share a View with native-driver properties (opacity/transform).
        <Animated.View
            style={[
                styles.wrapper,
                {
                    maxHeight: maxH.interpolate({
                        inputRange:  [0, 1],
                        outputRange: [0, 300],
                    }),
                    overflow: 'hidden',
                },
            ]}
        >
            {/* Inner — native driver: opacity + translateY */}
            <Animated.View
                style={{
                    opacity,
                    transform: [{ translateY: slideY }],
                }}
            >
            <View
                style={[
                    styles.container,
                    isCompact && styles.containerCompact,
                    {
                        backgroundColor: cfg.bg,
                        borderColor:     cfg.border,
                    },
                ]}
            >
                {/* 3px left accent bar */}
                <View style={[styles.accentBar, { backgroundColor: cfg.bar }]} />

                {/* Icon */}
                <View
                    style={[
                        styles.iconWrap,
                        isCompact && styles.iconWrapCompact,
                        { backgroundColor: cfg.iconBg },
                    ]}
                >
                    <Ionicons
                        name={cfg.icon as any}
                        size={isCompact ? 14 : 17}
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
        flexDirection:   'row',
        alignItems:      'flex-start',
        gap:             SPACING.sm + 2,
        paddingVertical: SPACING.sm + 2,
        paddingRight:    SPACING.sm + 2,
        paddingLeft:     0,
        borderWidth:     1,
        borderRadius:    14,
        overflow:        'hidden',
    },
    containerCompact: {
        alignItems:      'center',
        paddingVertical: SPACING.sm,
    },

    // 3px left bar — sits flush against the left border, inside overflow:hidden
    accentBar: {
        width:     3,
        alignSelf: 'stretch',
        flexShrink: 0,
        marginLeft: 0,
        // borderRadius is 0 here — single-sided bars must not have radius
    },

    iconWrap: {
        width:          32,
        height:         32,
        borderRadius:   9,
        alignItems:     'center',
        justifyContent: 'center',
        flexShrink:     0,
    },
    iconWrapCompact: {
        width:        26,
        height:       26,
        borderRadius: 7,
    },

    body:        { flex: 1 },
    bodyCompact: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           SPACING.xs,
    },

    title: {
        ...TYPOGRAPHY.label,
        fontWeight:    '600',
        lineHeight:    17,
        letterSpacing: 0.1,
    },

    message: {
        ...TYPOGRAPHY.bodySmall,
        color:      DESIGN_TOKENS.textSubtle,
        marginTop:  3,
        lineHeight: 18,
        opacity:    0.75,
    },

    actionBtn: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           3,
        marginTop:     SPACING.sm,
        alignSelf:     'flex-start',
    },
    actionLabel: {
        ...TYPOGRAPHY.bodySmall,
        fontWeight:    '500',
        letterSpacing: 0.2,
    },

    dismissBtn: {
        width:          22,
        height:         22,
        alignItems:     'center',
        justifyContent: 'center',
        flexShrink:     0,
    marginTop:      2,
        opacity:        0.38,
    },
});

export default AppBanner;