import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    View,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FloatCardProps {
    icon: string;
    iconColor: string;
}

interface FloatingCardConfig {
    icon: string;
    iconColor: string;
    radius: number;
    startAngle: number;
    duration: number;
    ringDuration: number;
    clockwise: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const SCENE_CENTER = DIMENSIONS.sceneLg / 2;

// Each orbit is 65 px apart (card diameter 54 + 11 buffer) so no two cards ever touch.
// Radii: 90 → 155 → 220 → 285 → 350 (inner to outer).
const CARDS: FloatingCardConfig[] = [
    { icon: 'flash-outline', iconColor: DESIGN_TOKENS.subPositive, radius: 90, startAngle: 0, duration: 14000, ringDuration: 18000, clockwise: true },
    { icon: 'trending-up-outline', iconColor: DESIGN_TOKENS.iconAccentPurple, radius: 155, startAngle: (2 * Math.PI) / 5, duration: 20000, ringDuration: 9000, clockwise: false },
    { icon: 'star-outline', iconColor: DESIGN_TOKENS.iconAccentYellow, radius: 220, startAngle: (4 * Math.PI) / 5, duration: 8000, ringDuration: 22000, clockwise: true },
    { icon: 'repeat-outline', iconColor: DESIGN_TOKENS.iconAccentBlue, radius: 285, startAngle: (6 * Math.PI) / 5, duration: 24000, ringDuration: 5000, clockwise: false },
];

// ─── Orbit ring (dotted glowing path) ────────────────────────────────────────
// Dots are spaced ~14 px of arc apart so density scales naturally with radius.

const DOT_ARC_SPACING = 18;

// Deterministic size/glow tier from dot index — no Math.random() so layout is stable.
// Prime-based hash spreads large and medium dots irregularly across the ring.
const getDotTier = (i: number): { size: number; opacity: number; glow: number } => {
    const h = (i * 11 + 7) % 19;
    if (h < 2) return { size: 4.5, opacity: 0.75, glow: 8 }; // accent dot  ~10%
    if (h < 5) return { size: 2.5, opacity: 0.50, glow: 5 }; // medium dot  ~16%
    return { size: 1.5, opacity: 0.22, glow: 3 }; // small dot   ~74%
};

const OrbitRing: React.FC<{
    radius: number;
    color: string;
    duration: number;
    clockwise: boolean;
}> = ({ radius, color, duration: ringDuration, clockwise }) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: ringDuration,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        loop.start();
        return () => loop.stop();
    }, []);

    // Opposite direction: clockwise card → counterclockwise ring, and vice-versa.
    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: clockwise ? ['0deg', '-360deg'] : ['0deg', '360deg'],
    });

    const dotCount = Math.round((2 * Math.PI * radius) / DOT_ARC_SPACING);

    return (
        // Full-scene container so React Native rotates around (sceneLg/2, sceneLg/2)
        // — exactly SCENE_CENTER — without any extra transform math.
        <Animated.View style={[styles.orbitRingContainer, { transform: [{ rotate }] }]}>
            {Array.from({ length: dotCount }, (_, i) => {
                const angle = (2 * Math.PI * i) / dotCount;
                const { size, opacity, glow } = getDotTier(i);
                return (
                    <View
                        key={i}
                        style={[
                            styles.orbitDot,
                            {
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                                left: SCENE_CENTER + radius * Math.cos(angle) - size / 2,
                                top: SCENE_CENTER + radius * Math.sin(angle) - size / 2,
                                opacity,
                                backgroundColor: color,
                                shadowColor: color,
                                shadowRadius: glow,
                                elevation: size > 3 ? 4 : 2,
                            },
                        ]}
                    />
                );
            })}
        </Animated.View>
    );
};

// ─── Circle float card (icon only) ───────────────────────────────────────────

const FloatCard: React.FC<FloatCardProps> = ({ icon, iconColor }) => (
    <View style={[styles.floatCard, { borderColor: `${iconColor}40` }]}>
        <Ionicons name={icon as any} size={22} color={iconColor} />
    </View>
);

// ─── Circular orbit animation ─────────────────────────────────────────────────
// Pre-computes 16 keyframe positions on the circle so Animated.interpolate
// traces a smooth orbit without needing cos/sin at runtime.

const STEPS = 60;
const INPUT_RANGE = Array.from({ length: STEPS + 1 }, (_, i) => i / STEPS);

const FloatingCard: React.FC<FloatingCardConfig> = ({
    icon, iconColor, radius, startAngle, duration, clockwise,
}) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(anim, {
                toValue: 1,
                duration,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        loop.start();
        return () => loop.stop();
    }, []);

    const dir = clockwise ? 1 : -1;
    const translateX = anim.interpolate({
        inputRange: INPUT_RANGE,
        outputRange: INPUT_RANGE.map(t =>
            radius * Math.cos(startAngle + dir * 2 * Math.PI * t)
        ),
        extrapolate: 'clamp',
    });
    const translateY = anim.interpolate({
        inputRange: INPUT_RANGE,
        outputRange: INPUT_RANGE.map(t =>
            radius * Math.sin(startAngle + dir * 2 * Math.PI * t)
        ),
        extrapolate: 'clamp',
    });

    return (
        <Animated.View
            style={[styles.floatAnchor, { transform: [{ translateX }, { translateY }] }]}
        >
            <FloatCard icon={icon} iconColor={iconColor} />
        </Animated.View>
    );
};

// ─── WelcomeHero ──────────────────────────────────────────────────────────────

export const WelcomeHero: React.FC = () => {
    const slideY = useRef(new Animated.Value(-500)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideY, {
                toValue: 0,
                duration: 1600,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1600,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.scene, { opacity, transform: [{ translateY: slideY }] }]}>

            {/* Dotted orbit rings — rendered behind the cards */}
            {CARDS.map((card, i) => (
                <OrbitRing
                    key={`ring-${i}`}
                    radius={card.radius}
                    color={card.iconColor}
                    duration={card.ringDuration}
                    clockwise={card.clockwise}
                />
            ))}

            {/* Orbiting icon cards */}
            {CARDS.map((card, i) => (
                <FloatingCard key={i} {...card} />
            ))}

            {/* Centre icon — outer bloom → mid bloom → icon circle */}
            <View style={styles.centerIcon}>
                <Ionicons name="fast-food-outline" size={DIMENSIONS.touchXxl} color={DESIGN_TOKENS.primaryWhite} />
            </View>

        </Animated.View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    scene: {
        width: DIMENSIONS.sceneLg,
        height: DIMENSIONS.sceneLg,
        alignSelf: 'center',
        position: 'relative',
    },

    // Full-scene container for each orbit ring — position:absolute at (0,0) with
    // the same dimensions as the scene so the default pivot (50%,50%) lands exactly
    // on SCENE_CENTER, letting the rotate transform spin the ring in place.
    orbitRingContainer: {
        position: 'absolute',
        width: DIMENSIONS.sceneLg,
        height: DIMENSIONS.sceneLg,
        left: 0,
        top: 0,
    },

    orbitDot: {
        position: 'absolute',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
    },

    floatAnchor: {
        position: 'absolute',
        left: SCENE_CENTER - DIMENSIONS.cardFloating / 2,
        top: SCENE_CENTER - DIMENSIONS.cardFloating / 2,
    },

    floatCard: {
        width: DIMENSIONS.cardFloating,
        height: DIMENSIONS.cardFloating,
        backgroundColor: DESIGN_TOKENS.floatCardBg,
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.full,
        alignItems: 'center',
        justifyContent: 'center',
    },

    centerIcon: {
        position: 'absolute',
        width: DIMENSIONS.featureIcon,
        height: DIMENSIONS.featureIcon,
        borderRadius: BORDER_RADIUS.panel,
        backgroundColor: DESIGN_TOKENS.accentDefault,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        top: (DIMENSIONS.sceneLg - DIMENSIONS.featureIcon) / 2,
        left: (DIMENSIONS.sceneLg - DIMENSIONS.featureIcon) / 2,
        shadowColor: DESIGN_TOKENS.accentDefault,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.55,
        shadowRadius: 24,
        elevation: 14,
    },
});

export default WelcomeHero;
