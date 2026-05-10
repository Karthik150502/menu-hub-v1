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
    icon:      string;
    iconColor: string;
    title:     string;
    sub:       string;
    style?:    object;
}

interface FloatingCardConfig {
    icon:       string;
    iconColor:  string;
    title:      string;
    sub:        string;
    // Starting position inside the scene
    startX:     number;
    startY:     number;
    // How far it drifts in each axis (the "float range")
    driftX:     number;
    driftY:     number;
    // How long one full float cycle takes (ms)
    duration:   number;
    // Delay before animation starts, so cards are out of phase
    delay:      number;
}

// ─── Config — 5 cards, each with a unique float personality ──────────────────

const CARDS: FloatingCardConfig[] = [
    {
        // Starts top-left, drifts diagonally to bottom-right
        icon: 'receipt-outline', iconColor: DESIGN_TOKENS.subPositive,
        title: '294', sub: 'orders',
        startX: 16,  startY: 16,
        driftX: 240, driftY: 230,
        duration: 3800, delay: 0,
    },
    {
        // Starts top-right, drifts diagonally to bottom-left
        icon: 'trending-up-outline', iconColor: '#C040D8',
        title: '₹98,420', sub: 'this week',
        startX: 300, startY: 20,
        driftX: -230, driftY: 240,
        duration: 4400, delay: 600,
    },
    {
        // Starts centre-top, drifts down
        icon: 'star-outline', iconColor: '#FBBF24',
        title: '4.7 ★', sub: 'avg rating',
        startX: 160, startY: 20,
        driftX: -140, driftY: 260,
        duration: 3600, delay: 1200,
    },
    {
        // Starts bottom-left, drifts right and up
        icon: 'repeat-outline', iconColor: '#60A5FA',
        title: '61%', sub: 'repeat rate',
        startX: 16,  startY: 300,
        driftX: 250, driftY: -240,
        duration: 4800, delay: 300,
    },
    {
        // Starts bottom-right, drifts left and up
        icon: 'flash-outline', iconColor: '#A78BFA',
        title: 'Sat #1', sub: 'best day',
        startX: 300, startY: 300,
        driftX: -240, driftY: -250,
        duration: 4000, delay: 900,
    },
];

// ─── Square float card ────────────────────────────────────────────────────────

const FloatCard: React.FC<FloatCardProps> = ({
    icon, iconColor, title, sub, style,
}) => (
    <View style={[styles.floatCard, style]}>
        <View style={[styles.iconWrap, { backgroundColor: `${iconColor}20` }]}>
            <Ionicons name={icon as any} size={15} color={iconColor} />
        </View>
        <Text style={styles.floatTitle}>{title}</Text>
        <Text style={styles.floatSub}>{sub}</Text>
    </View>
);

// ─── Animated floating wrapper ────────────────────────────────────────────────
// Uses two sine-like ping-pong animations on X and Y independently,
// offset by phase so the card traces a smooth Lissajous-style path.

const FloatingCard: React.FC<FloatingCardConfig> = ({
    icon, iconColor, title, sub,
    startX, startY, driftX, driftY,
    duration, delay,
}) => {
    const animX = useRef(new Animated.Value(0)).current;
    const animY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // X and Y loop at slightly different durations so the path never repeats
        const loopX = Animated.loop(
            Animated.sequence([
                Animated.timing(animX, {
                    toValue: 1, duration: duration,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true, delay,
                }),
                Animated.timing(animX, {
                    toValue: 0, duration: duration,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );
        const loopY = Animated.loop(
            Animated.sequence([
                Animated.timing(animY, {
                    toValue: 1, duration: duration * 1.3,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true, delay: delay + 400,
                }),
                Animated.timing(animY, {
                    toValue: 0, duration: duration * 1.3,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        loopX.start();
        loopY.start();

        return () => { loopX.stop(); loopY.stop(); };
    }, []);

    const translateX = animX.interpolate({
        inputRange: [0, 1], outputRange: [0, driftX],
    });
    const translateY = animY.interpolate({
        inputRange: [0, 1], outputRange: [0, driftY],
    });

    return (
        <Animated.View
            style={[
                styles.floatAnchor,
                { left: startX, top: startY },
                { transform: [{ translateX }, { translateY }] },
            ]}
        >
            <FloatCard
                icon={icon}
                iconColor={iconColor}
                title={title}
                sub={sub}
            />
        </Animated.View>
    );
};

// ─── WelcomeHero ──────────────────────────────────────────────────────────────

export const WelcomeHero: React.FC = () => (
    <View style={styles.scene}>

        {/* Purple radial glow */}
        <View style={styles.glow} />

        {/* Floating stat cards */}
        {CARDS.map((card, i) => (
            <FloatingCard key={i} {...card} />
        ))}

        {/* Centre icon — on top of everything */}
        <View style={styles.centerIcon}>
            <Ionicons name="fast-food-outline" size={38} color="#fff" />
        </View>

    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const SCENE_SIZE  = 400;
const CARD_SIZE   = 70;

const styles = StyleSheet.create({
    scene: {
        width:          SCENE_SIZE,
        height:         SCENE_SIZE,
        alignSelf:      'center',
        position:       'relative',
        overflow:       'hidden',       // cards stay inside the box
        borderRadius:   32,
    },

    glow: {
        position:        'absolute',
        width:           260,
        height:          260,
        borderRadius:    130,
        backgroundColor: DESIGN_TOKENS.primaryFaint,
        top:             70,
        left:            70,
    },

    floatAnchor: {
        position: 'absolute',
    },

    // Square card
    floatCard: {
        width:           CARD_SIZE,
        height:          CARD_SIZE,
        backgroundColor: '#1E0C24',  // solid — no transparency
        borderWidth:     1,
        borderColor:     DESIGN_TOKENS.primaryGlow,
        borderRadius:    18,
        alignItems:      'center',
        justifyContent:  'center',
        gap:             4,
        padding:         10,
    },
    iconWrap: {
        width:          28,
        height:         28,
        borderRadius:   8,
        alignItems:     'center',
        justifyContent: 'center',
        marginBottom:   2,
    },
    floatTitle: {
        fontSize:   10,
        fontWeight: '700',
        color:      DESIGN_TOKENS.titleText,
        textAlign:  'center',
    },
    floatSub: {
        fontSize:  8,
        color:     DESIGN_TOKENS.textHint,
        textAlign: 'center',
    },

    // Centre icon
    centerIcon: {
        position:        'absolute',
        width:           80,
        height:          80,
        borderRadius:    24,
        backgroundColor: DESIGN_TOKENS.accentDefault,
        alignItems:      'center',
        justifyContent:  'center',
        zIndex:          20,
        top:             (SCENE_SIZE - 80) / 2,
        left:            (SCENE_SIZE - 80) / 2,
        shadowColor:     DESIGN_TOKENS.accentDefault,
        shadowOffset:    { width: 0, height: 8 },
        shadowOpacity:   0.55,
        shadowRadius:    24,
        elevation:       14,
    },
});

export default WelcomeHero;