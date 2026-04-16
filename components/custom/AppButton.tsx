import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Ionicons icon name rendered before the label */
    iconLeft?: string;
    /** Ionicons icon name rendered after the label */
    iconRight?: string;
    disabled?: boolean;
    loading?: boolean;
    /** Override the container style */
    style?: ViewStyle;
    fullWidth?: boolean;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
    primary: DESIGN_TOKENS.accentDefault,
    primaryDark: DESIGN_TOKENS.primaryAccent2,
    primaryGlow: DESIGN_TOKENS.primaryGlow,
    primaryFaint: DESIGN_TOKENS.primaryFaint,
    primaryBorder: DESIGN_TOKENS.primaryBorder,

    danger: DESIGN_TOKENS.subNegative,
    dangerDark: DESIGN_TOKENS.subNegativeDark,
    dangerGlow: DESIGN_TOKENS.dangerGlow,
    dangerFaint: DESIGN_TOKENS.dangerFaint,
    dangerBorder: DESIGN_TOKENS.dangerBorder,

    ghostBorder: DESIGN_TOKENS.ghostBorder,
    ghostBg: DESIGN_TOKENS.ghostBg,

    secondaryBg: DESIGN_TOKENS.cardBg,
    secondaryBorder: DESIGN_TOKENS.cardBorder,

    textOnFilled: DESIGN_TOKENS.primaryWhite,
    textOnGhost: DESIGN_TOKENS.textOnGhost,
    textDisabled: DESIGN_TOKENS.textDisabled,

    disabled: DESIGN_TOKENS.disabled,
    disabledBorder: DESIGN_TOKENS.disabledBorder,
} as const;

// ─── Size config ──────────────────────────────────────────────────────────────

const SIZE = {
    sm: { paddingH: 14, paddingV: 8, fontSize: 12, iconSize: 13, gap: 5, radius: 10 },
    md: { paddingH: 20, paddingV: 13, fontSize: 14, iconSize: 15, gap: 7, radius: 13 },
    lg: { paddingH: 26, paddingV: 16, fontSize: 16, iconSize: 18, gap: 9, radius: 16 },
} as const;

// ─── Variant config ───────────────────────────────────────────────────────────

function getVariantStyle(variant: ButtonVariant, disabled: boolean) {
    if (disabled) {
        return {
            bg: C.disabled,
            border: C.disabledBorder,
            text: C.textDisabled,
            icon: C.textDisabled,
            shadow: 'transparent',
            shadowOp: 0,
        };
    }
    switch (variant) {
        case 'primary':
            return {
                bg: C.primary,
                border: C.primaryBorder,
                text: C.textOnFilled,
                icon: C.textOnFilled,
                shadow: C.primary,
                shadowOp: 0.45,
            };
        case 'secondary':
            return {
                bg: C.secondaryBg,
                border: C.secondaryBorder,
                text: C.textOnGhost,
                icon: C.textOnGhost,
                shadow: 'transparent',
                shadowOp: 0,
            };
        case 'ghost':
            return {
                bg: C.ghostBg,
                border: C.ghostBorder,
                text: C.textOnGhost,
                icon: DESIGN_TOKENS.accentDefault,
                shadow: 'transparent',
                shadowOp: 0,
            };
        case 'danger':
            return {
                bg: C.dangerFaint,
                border: C.dangerBorder,
                text: C.danger,
                icon: C.danger,
                shadow: C.danger,
                shadowOp: 0.25,
            };
    }
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner: React.FC<{ color: string; size: number }> = ({ color, size }) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="reload-outline" size={size} color={color} />
        </Animated.View>
    );
};

// ─── AppButton ────────────────────────────────────────────────────────────────

export const AppButton: React.FC<AppButtonProps> = ({
    label,
    onPress,
    variant = 'primary',
    size = 'md',
    iconLeft,
    iconRight,
    disabled = false,
    loading = false,
    style,
    fullWidth = false,
}) => {
    const pressAnim = useRef(new Animated.Value(1)).current;
    const isInactive = disabled || loading;
    const v = getVariantStyle(variant, isInactive);
    const s = SIZE[size];

    const onPressIn = () => {
        if (isInactive) return;
        Animated.spring(pressAnim, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 50,
            bounciness: 0,
        }).start();
    };

    const onPressOut = () => {
        if (isInactive) return;
        Animated.spring(pressAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 28,
            bounciness: 5,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.wrapper,
                fullWidth && styles.wrapperFull,
                { transform: [{ scale: pressAnim }] },
                style,
            ]}
        >
            <TouchableOpacity
                onPress={isInactive ? undefined : onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
                style={[
                    styles.btn,
                    {
                        backgroundColor: v.bg,
                        borderColor: v.border,
                        paddingHorizontal: s.paddingH,
                        paddingVertical: s.paddingV,
                        borderRadius: s.radius,
                        gap: s.gap,
                        shadowColor: v.shadow,
                        shadowOpacity: v.shadowOp,
                    },
                    fullWidth && styles.btnFull,
                ]}
            >
                {/* Left icon or spinner */}
                {loading ? (
                    <Spinner color={v.icon} size={s.iconSize} />
                ) : iconLeft ? (
                    <Ionicons name={iconLeft as any} size={s.iconSize} color={v.icon} />
                ) : null}

                {/* Label */}
                <Text style={[styles.label, { color: v.text, fontSize: s.fontSize }]}>
                    {loading ? 'Loading…' : label}
                </Text>

                {/* Right icon */}
                {!loading && iconRight && (
                    <Ionicons name={iconRight as any} size={s.iconSize} color={v.icon} />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: { alignSelf: 'flex-start' },
    wrapperFull: { alignSelf: 'stretch' },

    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 14,
        elevation: 8,
    },
    btnFull: { width: '100%' },

    label: {
        fontWeight: '700',
        letterSpacing: 0.2,
    },
});

export default AppButton;