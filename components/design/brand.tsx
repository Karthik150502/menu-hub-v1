import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Text from '../custom/appText';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BrandSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BrandProps {
    /**
     * xs → 13px   nav bars, footers, list rows
     * sm → 18px   compact headers, sidebar
     * md → 24px   default — most screens
     * lg → 32px   auth screens, welcome header
     * xl → 48px   onboarding hero, splash
     */
    size?: BrandSize;
    style?: ViewStyle;
    align?: "left" | "center" | "right"
}

// ─── Scale ────────────────────────────────────────────────────────────────────

const SCALE: Record<BrandSize, { fontSize: number; letterSpacing: number }> = {
    xs: { fontSize: 13, letterSpacing: 5 },
    sm: { fontSize: 18, letterSpacing: 7 },
    md: { fontSize: 24, letterSpacing: 9 },
    lg: { fontSize: 36, letterSpacing: 11 },
    xl: { fontSize: 48, letterSpacing: 14 },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Brand: React.FC<BrandProps> = ({ size = 'md', style, align = "center" }) => {
    const { fontSize, letterSpacing } = SCALE[size];
    return (
        <View style={[styles.container, style, { alignSelf: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end" }]}>
            <Text
                style={[styles.text, { fontSize, letterSpacing }]}
                accessibilityLabel="Plato"
                accessibilityRole="text"
            >
                PLATO
            </Text>
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
    },
    text: {
        fontWeight: '700',
        color: DESIGN_TOKENS.accentDefault,
    },
});

export default Brand;