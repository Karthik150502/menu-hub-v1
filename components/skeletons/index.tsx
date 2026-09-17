import { BORDER_RADIUS } from '@/constants/themes/dimensions';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    DimensionValue,
    Easing,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

/** 'rectangle' (default) is a free-form block, 'square' and 'circle' are equal-sided. */
export type SkeletonShape = 'rectangle' | 'square' | 'circle';

export interface SkeletonProps {
    /**
     * Shape helper. 'square'/'circle' use `size` (or `width`/`height`) for both
     * dimensions and pick the matching app-standard radius automatically.
     * Defaults to 'rectangle'.
     */
    shape?: SkeletonShape;
    /** Height of the skeleton block. Number = px, string = '100%' etc. */
    height?: number | DimensionValue;
    /** Width of the skeleton block. Defaults to '100%' for rectangles. */
    width?: number | DimensionValue;
    /** Convenience for 'square'/'circle' — sets both width and height. */
    size?: number;
    /**
     * Border radius override. Defaults to the app's standard radius for the
     * shape: BORDER_RADIUS.full for 'circle', BORDER_RADIUS.base otherwise.
     */
    borderRadius?: number;
    /** Extra styles applied to the outer container */
    style?: ViewStyle;
}

// ─── Colours ──────────────────────────────────────────────────────────────────
// Base and highlight pulled from design tokens so they stay consistent across
// the app without any hardcoded values here.

const BASE_COLOR = DESIGN_TOKENS.cardBg;            // '#1D1120'
const HIGHLIGHT_COLOR = DESIGN_TOKENS.inputBg;           // 'rgba(255,255,255,0.04)' — slightly lighter

// ─── Single skeleton block ────────────────────────────────────────────────────

export const Skeleton: React.FC<SkeletonProps> = ({
    shape = 'rectangle',
    height,
    width,
    size,
    borderRadius,
    style,
}) => {
    const isEqualSided = shape === 'square' || shape === 'circle';
    const equalSize = size ?? (typeof height === 'number' ? height : typeof width === 'number' ? width : 40);

    const resolvedWidth = isEqualSided ? (width ?? equalSize) : (width ?? '100%');
    const resolvedHeight = isEqualSided ? (height ?? equalSize) : (height ?? 12);
    const resolvedRadius = borderRadius ?? (shape === 'circle' ? BORDER_RADIUS.full : BORDER_RADIUS.base);

    const shimmer = useState(() => new Animated.Value(0))[0];

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, {
                    toValue: 1,
                    duration: 5000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: false,
                }),
                Animated.timing(shimmer, {
                    toValue: 0,
                    duration: 5000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: false,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    const backgroundColor = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [BASE_COLOR, HIGHLIGHT_COLOR],
    });

    return (
        <Animated.View
            style={[
                styles.base,
                { height: resolvedHeight, width: resolvedWidth, borderRadius: resolvedRadius, backgroundColor },
                style,
            ]}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading"
        />
    );
};

// ─── Compound helpers — common skeleton shapes ────────────────────────────────
// These are convenience wrappers. You can build any layout you want using
// the base Skeleton, but these cover the most common patterns in the app.

/** Circle — avatar, icon placeholder */
export const SkeletonCircle: React.FC<{ size: number; style?: ViewStyle }> = ({ size, style }) => (
    <Skeleton shape="circle" size={size} style={style} />
);

/** Square — thumbnail, icon tile placeholder */
export const SkeletonSquare: React.FC<{ size: number; borderRadius?: number; style?: ViewStyle }> = ({
    size,
    borderRadius,
    style,
}) => <Skeleton shape="square" size={size} borderRadius={borderRadius} style={style} />;

/** Single line of text — use multiple stacked for a paragraph */
export const SkeletonText: React.FC<{
    width?: number | DimensionValue;
    lines?: number;
    style?: ViewStyle;
}> = ({ width = '100%', lines = 1, style }) => (
    <View style={[{ gap: 8 }, style]}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                height={12}
                // Last line is shorter — mimics natural prose line breaks
                width={i === lines - 1 && lines > 1 ? '65%' : width}
                borderRadius={6}
            />
        ))}
    </View>
);

/** Rounded pill — category chip, badge placeholder */
export const SkeletonPill: React.FC<{
    width?: number | DimensionValue;
    height?: number;
    style?: ViewStyle;
}> = ({ width = 80, height = 28, style }) => (
    <Skeleton height={height} width={width} borderRadius={9999} style={style} />
);

/** Card skeleton — matches DishCard proportions */
export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
    <View style={[styles.card, style]}>
        {/* Banner placeholder */}
        <Skeleton height={130} width="100%" borderRadius={0} />
        {/* Info row */}
        <View style={styles.cardBody}>
            <View style={styles.cardLeft}>
                <View style={styles.cardNameRow}>
                    <Skeleton height={14} width="55%" borderRadius={6} />
                    <SkeletonPill width={52} height={20} />
                </View>
                <SkeletonText lines={2} style={{ marginTop: 8 }} />
            </View>
            <View style={styles.cardRight}>
                <Skeleton height={22} width={64} borderRadius={6} />
                <SkeletonPill width={44} height={24} />
            </View>
        </View>
    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    base: {
        overflow: 'hidden',
    },

    card: {
        backgroundColor: DESIGN_TOKENS.cardBg,
        borderRadius: 20,
        overflow: 'hidden',
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    cardLeft: { flex: 1 },
    cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardRight: { alignItems: 'flex-end', gap: 10 },
});


export default Skeleton;