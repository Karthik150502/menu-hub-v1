import { DIMENSIONS } from '@/constants/themes/dimensions';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import BrandLogo from "../../assets/images/web/brand/plato_app_logo_no_bg.png";
import Text from './appText';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppLoaderProps {
    /** Optional label below the animation. Defaults to "Loading" */
    label?: string;
    /** Hide the text label entirely */
    hideLabel?: boolean;
    /** Wrap in a full-screen overlay */
    fullScreen?: boolean;
    style?: ViewStyle;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = DESIGN_TOKENS.accentDefault;    // #9400AB
const ACCENT2 = DESIGN_TOKENS.primaryBright;    // #AA00FF
const SCENE = 140;
const CENTER = SCENE / 2;
const ICON_SIZE = 60;
const INNER_R = 48;   // radius of inner orbit
const OUTER_R = 67;   // radius of outer orbit

// ─── Orbiting dot ─────────────────────────────────────────────────────────────
// Rotates an invisible arm and places the dot at its tip.
// A counter-rotate keeps the dot upright (not that it matters for a circle,
// but preserves the pattern if we ever add icon dots).

const OrbitDot: React.FC<{
    radius: number;
    size: number;
    color: string;
    duration: number;
    startDeg: number;
    opacity?: number;
}> = ({ radius, size, color, duration, startDeg, opacity = 1 }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(anim, {
                toValue: 1,
                duration,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const STEPS = 60;
    const inputs = Array.from({ length: STEPS + 1 }, (_, i) => i / STEPS);
    const startRad = (startDeg * Math.PI) / 180;

    const translateX = anim.interpolate({
        inputRange: inputs,
        outputRange: inputs.map(t =>
            radius * Math.cos(startRad + 2 * Math.PI * t)
        ),
        extrapolate: 'clamp',
    });
    const translateY = anim.interpolate({
        inputRange: inputs,
        outputRange: inputs.map(t =>
            radius * Math.sin(startRad + 2 * Math.PI * t)
        ),
        extrapolate: 'clamp',
    });

    return (
        <Animated.View
            style={[
                styles.dotAnchor,
                {
                    width: size,
                    height: size,
                    top: CENTER - size / 2,
                    left: CENTER - size / 2,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    opacity,
                    transform: [{ translateX }, { translateY }],
                },
            ]}
        />
    );
};

// ─── Typing dots ──────────────────────────────────────────────────────────────

const TypingDot: React.FC<{ delay: number }> = ({ delay }) => {
    const anim = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0.2,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return <Animated.View style={[styles.typingDot, { opacity: anim }]} />;
};

// ─── AppLoader ────────────────────────────────────────────────────────────────

export const AppLoader: React.FC<AppLoaderProps> = ({
    label = 'Loading',
    hideLabel = false,
    fullScreen = false,
    style,
}) => {
    // Centre icon pulse
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1.08,
                    duration: 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const content = (
        <View style={[styles.stage, style]}>
            {/* Orbit scene */}
            <View style={styles.scene} accessibilityRole="progressbar" accessibilityLabel="Loading">
                {/* Decorative rings */}
                <View style={[styles.ring, styles.ring1]} />
                <View style={[styles.ring, styles.ring2]} />

                {/* Orbiting dots */}
                <OrbitDot radius={INNER_R} size={7} color={ACCENT} duration={2200} startDeg={0} opacity={1} />
                <OrbitDot radius={OUTER_R} size={7} color={ACCENT2} duration={3100} startDeg={120} opacity={0.7} />
                <OrbitDot radius={INNER_R} size={5} color={ACCENT} duration={1800} startDeg={240} opacity={0.5} />

                {/* Centre icon */}
                <Animated.View
                    style={[styles.centerBox, { transform: [{ scale: pulse }] }]}
                >
                    <Image source={BrandLogo} style={styles.logo} />
                </Animated.View>
            </View>

            {/* Label */}
            {!hideLabel && (
                <View style={styles.labelArea}>
                    <Text style={styles.labelText}>{label.toUpperCase()}</Text>
                    <View style={styles.typingRow} accessibilityElementsHidden>
                        <TypingDot delay={0} />
                        <TypingDot delay={200} />
                        <TypingDot delay={400} />
                    </View>
                </View>
            )}
        </View>
    );

    if (fullScreen) {
        return <View style={styles.overlay}>{content}</View>;
    }

    return content;
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: DESIGN_TOKENS.background_1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },

    stage: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        paddingVertical: 40,
    },

    scene: {
        width: SCENE,
        height: SCENE,
        position: 'relative',
    },

    ring: {
        position: 'absolute',
        borderRadius: 999,
        borderWidth: 1,
    },
    ring1: {
        width: INNER_R * 2,
        height: INNER_R * 2,
        top: CENTER - INNER_R,
        left: CENTER - INNER_R,
        borderColor: 'rgba(148,0,171,0.18)',
    },
    ring2: {
        width: OUTER_R * 2,
        height: OUTER_R * 2,
        top: CENTER - OUTER_R,
        left: CENTER - OUTER_R,
        borderColor: 'rgba(148,0,171,0.09)',
        borderStyle: 'dashed',
    },

    dotAnchor: {
        position: 'absolute',
    },

    centerBox: {
        position: 'absolute',
        width: ICON_SIZE,
        height: ICON_SIZE,
        top: CENTER - ICON_SIZE / 2,
        left: CENTER - ICON_SIZE / 2,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: DESIGN_TOKENS.accentDefault,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 18,
        elevation: 10,
    },

    labelArea: {
        alignItems: 'center',
        gap: 8,
    },
    labelText: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1.4,
        color: 'rgba(255,255,255,0.35)',
    },
    typingRow: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    typingDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: DESIGN_TOKENS.accentDefault,
    },
    logo: {
        width: DIMENSIONS.featureIcon,
        height: DIMENSIONS.featureIcon,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AppLoader;