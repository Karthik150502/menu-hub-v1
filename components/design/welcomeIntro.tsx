import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FloatCardProps {
    dot: string;
    title: string;
    sub: string;
}

// ─── Float card ───────────────────────────────────────────────────────────────

const FloatCard: React.FC<FloatCardProps> = ({ dot, title, sub }) => (
    <View style={styles.floatCard}>
        <View style={[styles.floatDot, { backgroundColor: dot }]} />
        <View>
            <Text style={styles.floatTitle}>{title}</Text>
            <Text style={styles.floatSub}>{sub}</Text>
        </View>
    </View>
);

// ─── Orbiting wrapper ─────────────────────────────────────────────────────────
// Rotates the orbit ring, then counter-rotates the card so it stays upright.

const OrbitRing: React.FC<{
    size: number;
    duration: number;
    reverse?: boolean;
    children: React.ReactNode;
    cardOffset: { top?: number; bottom?: number; left?: number; right?: number };
}> = ({ size, duration, reverse = false, children, cardOffset }) => {
    const spin = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spin, {
                toValue: 1,
                duration,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, []);

    const rotate = spin.interpolate({
        inputRange: [0, 1],
        outputRange: reverse ? ['0deg', '-360deg'] : ['0deg', '360deg'],
    });

    // Counter-rotate the card so its text is always upright
    const counterRotate = spin.interpolate({
        inputRange: [0, 1],
        outputRange: reverse ? ['0deg', '360deg'] : ['0deg', '-360deg'],
    });

    return (
        <Animated.View
            style={[
                styles.orbitBase,
                { width: size, height: size, borderRadius: size / 2 },
                { transform: [{ rotate }] },
            ]}
        >
            <Animated.View
                style={[
                    styles.cardAnchor,
                    cardOffset,
                    { transform: [{ rotate: counterRotate }] },
                ]}
            >
                {children}
            </Animated.View>
        </Animated.View>
    );
};

// ─── WelcomeHero ──────────────────────────────────────────────────────────────

export const WelcomeHero: React.FC = () => (
    <View style={styles.scene}>

        {/* Purple glow in the background */}
        <View style={styles.glow} />

        {/* Concentric decorative rings */}
        <View style={[styles.ring, styles.ring3]} />
        <View style={[styles.ring, styles.ring2]} />
        <View style={[styles.ring, styles.ring1]} />

        {/* Orbit 1 — inner ring, clockwise, 14s */}
        <OrbitRing
            size={210}
            duration={14000}
            cardOffset={{ top: -18, right: -56 }}
        >
            <FloatCard
                dot={DESIGN_TOKENS.subPositive}
                title="294 orders"
                sub="today"
            />
        </OrbitRing>

        {/* Orbit 2 — outer ring, counter-clockwise, 20s */}
        <OrbitRing
            size={280}
            duration={20000}
            reverse
            cardOffset={{ bottom: -18, left: -62 }}
        >
            <FloatCard
                dot={DESIGN_TOKENS.accentDefault}
                title="₹98,420"
                sub="this week"
            />
        </OrbitRing>

        {/* Centre icon */}
        <View style={styles.centerIcon}>
            <Ionicons name="fast-food-outline" size={38} color="#fff" />
        </View>

    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const SCENE = 300;
const RING_COLOR = 'rgba(148,0,171,0.15)';
const RING_COLOR_FAINT = 'rgba(148,0,171,0.08)';
const RING_COLOR_XS = 'rgba(255,255,255,0.04)';

const styles = StyleSheet.create({
    scene: {
        width: SCENE,
        height: SCENE,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    // Radial purple glow
    glow: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: DESIGN_TOKENS.primaryFaint,
        // React Native doesn't support CSS blur — approximate with opacity layers
    },

    // Decorative rings
    ring: {
        position: 'absolute',
        borderRadius: 999,
        borderWidth: 1,
    },
    ring1: {
        width: 130,
        height: 130,
        borderColor: RING_COLOR,
    },
    ring2: {
        width: 200,
        height: 200,
        borderColor: RING_COLOR_FAINT,
        borderStyle: 'dashed',
    },
    ring3: {
        width: 270,
        height: 270,
        borderColor: RING_COLOR_XS,
    },

    // Orbit mechanics
    orbitBase: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardAnchor: {
        position: 'absolute',
    },

    // Floating stat card
    floatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: DESIGN_TOKENS.primaryFaintDark,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.primaryGlow,
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 13,
    },
    floatDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        flexShrink: 0,
    },
    floatTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: DESIGN_TOKENS.titleText,
        lineHeight: 17,
    },
    floatSub: {
        fontSize: 10,
        color: DESIGN_TOKENS.textHint,
        lineHeight: 14,
    },

    // Centre logo button
    centerIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: DESIGN_TOKENS.accentDefault,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        // Subtle purple shadow on iOS
        shadowColor: DESIGN_TOKENS.accentDefault,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 12,
    },
});

export default WelcomeHero;