import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    Pressable,
    StyleSheet,
    ViewStyle,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToggleVariant = 'primary' | 'success' | 'danger';

export interface AppToggleProps {
    value: boolean;
    onValueChange: (next: boolean) => void;
    variant?: ToggleVariant;
    disabled?: boolean;
    style?: ViewStyle;
    accessibilityLabel?: string;
}

// ─── Variant config ───────────────────────────────────────────────────────────

interface VariantConfig {
    trackOn: string;   // track fill when on
    trackBorderOn: string;   // track border when on
    thumbShadowOn: string;   // thumb glow when on
}

const VARIANTS: Record<ToggleVariant, VariantConfig> = {
    primary: {
        trackOn: DESIGN_TOKENS.accentDefault,         // #9400AB
        trackBorderOn: DESIGN_TOKENS.primaryBorder,         // rgba(148,0,171,0.45)
        thumbShadowOn: DESIGN_TOKENS.primaryGlow,           // rgba(148,0,171,0.35)
    },
    success: {
        trackOn: DESIGN_TOKENS.subPositive,           // #09c60f
        trackBorderOn: DESIGN_TOKENS.feedbackPositiveBorder,// rgba(9,198,15,0.35)
        thumbShadowOn: 'rgba(9,198,15,0.30)',
    },
    danger: {
        trackOn: DESIGN_TOKENS.subNegative,           // #FF0000
        trackBorderOn: DESIGN_TOKENS.feedbackNegativeBorder,// rgba(255,0,0,0.35)
        thumbShadowOn: 'rgba(220,34,34,0.30)',
    },
};

// ─── Dimensions ───────────────────────────────────────────────────────────────

const TRACK_W = 50;
const TRACK_H = 28;
const TRACK_BORDER = 1.5;
const THUMB_D = 20;          // thumb diameter
const THUMB_PAD = 3;          // gap between thumb and track edge
const TRAVEL = TRACK_W - THUMB_D - THUMB_PAD * 2 - TRACK_BORDER * 2;  // inner width - thumb - pads

// ─── Component ────────────────────────────────────────────────────────────────

export const AppToggle: React.FC<AppToggleProps> = ({
    value,
    onValueChange,
    variant = 'primary',
    disabled = false,
    style,
    accessibilityLabel,
}) => {
    const cfg = VARIANTS[variant];

    // 0 = off, 1 = on
    const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: value ? 1 : 0,
            duration: 220,
            // Slight overshoot on the way on, snappy linear on the way off
            easing: value
                ? Easing.out(Easing.back(1.6))
                : Easing.out(Easing.quad),
            useNativeDriver: false,   // borderColor + backgroundColor need JS driver
        }).start();
    }, [value]);

    // ── Interpolated styles ───────────────────────────────────────────────────

    const trackBg = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255,255,255,0.08)', cfg.trackOn],
    });

    const trackBorder = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255,255,255,0.14)', cfg.trackBorderOn],
    });

    const thumbX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [THUMB_PAD, THUMB_PAD + TRAVEL],
    });

    const thumbShadow = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0,0,0,0.25)', cfg.thumbShadowOn],
    });

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <Pressable
            onPress={() => !disabled && onValueChange(!value)}
            disabled={disabled}
            accessibilityRole="switch"
            accessibilityState={{ checked: value, disabled }}
            accessibilityLabel={accessibilityLabel}
            style={[{ opacity: disabled ? 0.38 : 1 }, style]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
            {/* Track */}
            <Animated.View
                style={[
                    styles.track,
                    {
                        backgroundColor: trackBg,
                        borderColor: trackBorder,
                    },
                ]}
            >
                {/* Thumb */}
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            transform: [{ translateX: thumbX }],
                            shadowColor: thumbShadow,
                        },
                    ]}
                />
            </Animated.View>
        </Pressable>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    track: {
        width: TRACK_W,
        height: TRACK_H,
        borderRadius: TRACK_H / 2,
        borderWidth: TRACK_BORDER,
        // justify content isn't used — thumb is absolutely positioned via translateX
        justifyContent: 'center',
    },

    thumb: {
        position: 'absolute',
        top: THUMB_PAD,
        left: 0,              // translateX drives horizontal position
        width: THUMB_D,
        height: THUMB_D,
        borderRadius: THUMB_D / 2,
        backgroundColor: '#ffffff',

        // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 6,
        // Android elevation (colour not applied on Android, but gives depth)
        elevation: 3,
    },
});

export default AppToggle;