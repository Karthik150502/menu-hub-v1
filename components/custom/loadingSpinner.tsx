import React, { useRef } from 'react';
import {
    Animated,
    Easing,
    View
} from 'react-native';

// ─── Spinner ──────────────────────────────────────────────────────────────────
// Dotted circle: N dots arranged on a circle, each scaled/faded by position.
// The whole ring rotates — giving the illusion of a travelling highlight.

const DOT_COUNT = 8;

const Spinner: React.FC<{ color: string; size: number }> = ({ color, size }) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 900,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const radius = size / 2;       // ring radius = half the requested size
    const dotSize = size * 0.25;    // each dot is ~25% of the total size

    return (
        <Animated.View
            style={{
                width: size,
                height: size,
                transform: [{ rotate }],
            }}
        >
            {Array.from({ length: DOT_COUNT }).map((_, i) => {
                const angle = (2 * Math.PI * i) / DOT_COUNT;
                // Dots get progressively smaller/more opaque as position increases
                // — creates a comet-tail effect
                const opacity = 0.20 + (i / DOT_COUNT) * 0.80;
                const scale = 0.45 + (i / DOT_COUNT) * 0.55;
                const cx = radius + radius * Math.cos(angle) - dotSize / 2;
                const cy = radius + radius * Math.sin(angle) - dotSize / 2;

                return (
                    <View
                        key={i}
                        style={{
                            position: 'absolute',
                            left: cx,
                            top: cy,
                            width: dotSize,
                            height: dotSize,
                            borderRadius: dotSize / 2,
                            backgroundColor: color,
                            opacity,
                            transform: [{ scale }],
                        }}
                    />
                );
            })}
        </Animated.View>
    );
};
export default Spinner;