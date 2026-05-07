import { TYPOGRAPHY } from '@/constants/themes/font';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

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
    const ringColor = isOpen ? 'rgba(9,198,15,0.20)' : 'rgba(255,0,0,0.18)';
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
        gap: 5,
    },
    dotRing: {
        width: 14,
        height: 14,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    label: {
        ...TYPOGRAPHY.bodySmallBold,
    },
    sep: {
        fontSize: 16,
        fontWeight: "700",
        color: DESIGN_TOKENS.textSectionTitle,
    },
    sub: {
        ...TYPOGRAPHY.bodySmallSemiBold,
        color: DESIGN_TOKENS.textSectionTitle,
    },
});

export default RestaurantLiveBadge;