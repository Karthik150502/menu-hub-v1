import Text from '@/components/custom/appText';
import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StepIndicatorProps {
    /** Current step, 1-indexed (e.g. 2 of 4) */
    currentStep: number;
    /** Total number of steps in the flow */
    totalSteps: number;
    /** Name of the current step, shown next to the count (e.g. "Verify OTP") */
    stepLabel?: string;
    /** Show the "Step X of Y" caption below the bar. @default true */
    showCount?: boolean;
    style?: ViewStyle;
}

// ─── Segment ──────────────────────────────────────────────────────────────────
// One bar per step. Animates its fill in/out as `currentStep` changes so the
// indicator reads as progress rather than a static state.

const Segment: React.FC<{ filled: boolean }> = ({ filled }) => {
    const progress = useRef(new Animated.Value(filled ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: filled ? 1 : 0,
            duration: 280,
            useNativeDriver: false, // animating width, not transform/opacity
        }).start();
    }, [filled, progress]);

    return (
        <View style={styles.track}>
            <Animated.View
                style={[
                    styles.fill,
                    {
                        width: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                    },
                ]}
            />
        </View>
    );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const StepIndicator: React.FC<StepIndicatorProps> = ({
    currentStep,
    totalSteps,
    stepLabel,
    showCount = true,
    style,
}) => {
    const step = Math.min(Math.max(currentStep, 1), totalSteps);

    return (
        <View
            style={[styles.container, style]}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 1, max: totalSteps, now: step }}
            accessibilityLabel={`Step ${step} of ${totalSteps}${stepLabel ? `: ${stepLabel}` : ''}`}
        >
            <View style={styles.segments}>
                {Array.from({ length: totalSteps }, (_, i) => (
                    <Segment key={i} filled={i < step} />
                ))}
            </View>

            {showCount && (
                <Text style={styles.caption}>
                    {`Step ${step} of ${totalSteps}`}
                    {stepLabel ? ` · ${stepLabel}` : ''}
                </Text>
            )}
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    segments: {
        flexDirection: 'row',
        gap: SPACING.xs,
    },
    track: {
        flex: 1,
        height: DIMENSIONS.barThick,
        borderRadius: BORDER_RADIUS.xxs,
        backgroundColor: DESIGN_TOKENS.cardBorder,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: BORDER_RADIUS.xxs,
        backgroundColor: DESIGN_TOKENS.accentDefault,
    },
    caption: {
        ...TYPOGRAPHY.overline,
        color: DESIGN_TOKENS.textSectionTitle,
        marginTop: SPACING.sm,
    },
});

export default StepIndicator;
