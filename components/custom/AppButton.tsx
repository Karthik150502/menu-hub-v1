import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { FONT_WEIGHTS, TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import Text from './appText';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ghostTransparent';
export type ButtonSize = 'icon' | 'sm' | 'md' | 'lg';

export interface AppButtonProps extends Omit<TouchableOpacityProps, 'style'> {
    label?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    iconLeft?: string;
    iconRight?: string;
    loading?: boolean;
    /**
     * Applied to the outer Animated.View wrapper.
     * Use for layout concerns: margin, alignSelf, flex, position.
     */
    style?: ViewStyle;
    /**
     * Applied LAST to the inner TouchableOpacity surface.
     * Wins over every computed variant/size style —
     * use this to override background, padding, radius, border, etc.
     */
    buttonStyle?: ViewStyle;
    fullWidth?: boolean;
    children?: React.ReactNode;
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

    textOnFilled: DESIGN_TOKENS.textPrimary,
    textOnGhost: DESIGN_TOKENS.textOnGhost,
    textDisabled: DESIGN_TOKENS.textDisabled,
    disabled: DESIGN_TOKENS.disabled,
    disabledBorder: DESIGN_TOKENS.whiteFadeXs,
} as const;

// ─── Size config ──────────────────────────────────────────────────────────────

const SIZE = {
    icon: { paddingH: SPACING.xs, paddingV: SPACING.xs, ...TYPOGRAPHY.bodySmall, iconSize: DIMENSIONS.iconXs, gap: 0, radius: BORDER_RADIUS.lg },
    sm: { paddingH: SPACING.md, paddingV: SPACING.xxs, ...TYPOGRAPHY.bodySmall, iconSize: DIMENSIONS.iconSm, gap: SPACING.xs, radius: BORDER_RADIUS.xl },
    md: { paddingH: SPACING.xl, paddingV: SPACING.sm, ...TYPOGRAPHY.body, iconSize: DIMENSIONS.iconMd, gap: SPACING.xsm, radius: BORDER_RADIUS.lg },
    lg: { paddingH: SPACING.xxl, paddingV: SPACING.lg, ...TYPOGRAPHY.bodyLarge, iconSize: DIMENSIONS.iconLg, gap: SPACING.ssm, radius: BORDER_RADIUS.xxl },
} as const;

// ─── Variant config ───────────────────────────────────────────────────────────

function getVariantStyle(variant: ButtonVariant, disabled: boolean) {
    if (disabled) return {
        bg: C.disabled, border: C.disabledBorder,
        text: C.textDisabled, icon: C.textDisabled,
        shadow: 'transparent', shadowOp: 0,
    };
    switch (variant) {
        case 'primary': return { bg: C.primary, border: C.primaryBorder, text: C.textOnFilled, icon: C.textOnFilled, shadow: C.primary, shadowOp: 0.45 };
        case 'secondary': return { bg: C.secondaryBg, border: C.secondaryBorder, text: C.textOnGhost, icon: C.textOnGhost, shadow: 'transparent', shadowOp: 0 };
        case 'ghost': return { bg: C.ghostBg, border: C.ghostBorder, text: C.textOnGhost, icon: DESIGN_TOKENS.accentDefault, shadow: 'transparent', shadowOp: 0 };
        case 'danger': return { bg: C.dangerFaint, border: C.dangerBorder, text: C.danger, icon: C.danger, shadow: C.danger, shadowOp: 0.25 };
        case 'ghostTransparent':
            return {
                bg: 'transparent',
                border: 'transparent',
                text: C.textOnGhost,
                icon: DESIGN_TOKENS.accentDefault,
                shadow: 'transparent',
                shadowOp: 0,
            };
    }
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner: React.FC<{ color: string; size: number }> = ({ color, size }) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, { toValue: 1, duration: 700, useNativeDriver: true })
        ).start();
    }, []);
    const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    return (
        <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="reload-outline" size={size} color={color} />
        </Animated.View>
    );
};

// ─── AppButton ────────────────────────────────────────────────────────────────

export const AppButton: React.FC<AppButtonProps> = ({
    label,
    variant = 'primary',
    size = 'md',
    iconLeft,
    iconRight,
    disabled = false,
    loading = false,
    style,
    buttonStyle,
    fullWidth = false,
    children,
    // Extract our custom press handlers so we can compose with the animation
    onPress,
    onPressIn: externalPressIn,
    onPressOut: externalPressOut,
    // Everything else (testID, accessibilityLabel, hitSlop, onLongPress…)
    // passes straight through to TouchableOpacity
    ...touchableProps
}) => {
    const pressAnim = useRef(new Animated.Value(1)).current;
    const isInactive = disabled || loading;
    const v = getVariantStyle(variant, isInactive);
    const s = SIZE[size];

    const handlePressIn = (e: any) => {
        if (!isInactive) {
            Animated.spring(pressAnim, {
                toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 0,
            }).start();
        }
        externalPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
        if (!isInactive) {
            Animated.spring(pressAnim, {
                toValue: 1, useNativeDriver: true, speed: 28, bounciness: 5,
            }).start();
        }
        externalPressOut?.(e);
    };

    return (
        <Animated.View
            style={[
                styles.wrapper,
                fullWidth && styles.wrapperFull,
                { transform: [{ scale: pressAnim }] },
                // Outer wrapper style — layout concerns only (margin, flex, position)
                style,
            ]}
        >
            <TouchableOpacity
                accessibilityRole="button"
                {...touchableProps}                      // spread native props first
                onPress={isInactive ? undefined : onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isInactive}
                style={[
                    styles.btn,
                    // Computed variant + size styles
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
                    // ghostTransparent — strips border, shadow and padding entirely
                    variant === 'ghostTransparent' && styles.btnGhostTransparent,
                    // buttonStyle is LAST — highest priority, overrides everything above
                    buttonStyle,
                ]}
            >
                {children ? children : (
                    <>
                        {loading ? (
                            <Spinner color={v.icon} size={s.iconSize} />
                        ) : iconLeft ? (
                            <Ionicons name={iconLeft as any} size={s.iconSize} color={v.icon} />
                        ) : null}

                        <Text style={[styles.label, { color: v.text, fontSize: s.fontSize }]}>
                            {loading ? 'Loading…' : label}
                        </Text>

                        {!loading && iconRight && (
                            <Ionicons name={iconRight as any} size={s.iconSize} color={v.icon} />
                        )}
                    </>
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
    btnGhostTransparent: {
        borderWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },

    label: {
        fontWeight: FONT_WEIGHTS.bold,
        letterSpacing: 0.2,
    },
});

export default AppButton;