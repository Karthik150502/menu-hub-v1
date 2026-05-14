import { FONT_SIZES, FONT_WEIGHTS, TYPOGRAPHY } from '@/constants/themes/font';
import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useEffect, useRef } from 'react';
import Text from '@/components/custom/appText';
import { Animated, StyleSheet, View } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RestaurantLiveBadgeProps {
    isOpen: boolean;
    restaurantName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const RestaurantLiveBadge: React.FC<RestaurantLiveBadgeProps> = ({
    isOpen,
    restaurantName,
}) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Pulse the dot when open — stops when closed
    useEffect(() => {
        if (!isOpen) {
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
            return;
        }
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.25,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [isOpen, pulseAnim]);

    const dotColor = isOpen ? DESIGN_TOKENS.subPositive : DESIGN_TOKENS.subNegative;
    const ringColor = isOpen ? DESIGN_TOKENS.liveRingOpen : DESIGN_TOKENS.liveRingClosed;
    const label = isOpen ? 'LIVE' : 'CLOSED';
    const labelColor = isOpen ? DESIGN_TOKENS.subPositive : DESIGN_TOKENS.subNegative;
    const sub = isOpen
        ? `${restaurantName ?? 'Restaurant'} is open`
        : `${restaurantName ?? 'Restaurant'} is closed`;

    return (
        <View style={styles.row}>
            {/* Animated pulsing dot */}
            <View style={[styles.dotRing, { backgroundColor: ringColor }]}>
                <Animated.View
                    style={[
                        styles.dot,
                        { backgroundColor: dotColor, opacity: pulseAnim },
                    ]}
                />
            </View>

            {/* LIVE / CLOSED label */}
            <Text style={[styles.label, { color: labelColor }]}>{label}</Text>

            {/* Separator */}
            <Text style={styles.sep}>·</Text>

            {/* Sub-text */}
            <Text style={styles.sub}>{sub}</Text>
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    dotRing: {
        width: DIMENSIONS.dotMd,
        height: DIMENSIONS.dotMd,
        borderRadius: DIMENSIONS.dotMd / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: DIMENSIONS.dotSm,
        height: DIMENSIONS.dotSm,
        borderRadius: BORDER_RADIUS.xs,
    },
    label: {
        ...TYPOGRAPHY.bodySmallBold,
    },
    sep: {
        fontSize: FONT_SIZES.base,
        fontWeight: FONT_WEIGHTS.bold,
        color: DESIGN_TOKENS.textSectionTitle,
    },
    sub: {
        ...TYPOGRAPHY.bodySmallSemiBold,
        color: DESIGN_TOKENS.textSectionTitle,
    },
});

export default RestaurantLiveBadge;