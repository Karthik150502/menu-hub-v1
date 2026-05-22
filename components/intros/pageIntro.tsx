import Text from '@/components/custom/appText';
import { Brand } from '@/components/design/brand';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageIntroProps {
    title: string;
    subtitle?: string;
    style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PageIntro: React.FC<PageIntroProps> = ({
    title,
    subtitle,
    style,
}) => (
    <View style={[styles.wrap, style]}>
        <Brand size="lg" align='left' />
        <Text style={styles.headlineLine1}>{title}</Text>
        {/* Subtext */}
        {subtitle && <Text style={styles.sub}>
            {subtitle}
        </Text>}

    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrap: {
        gap: SPACING.xs,
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
    },
    sub: {
        ...TYPOGRAPHY.bodySmall,
        color: DESIGN_TOKENS.textSubtle,
        textAlign: 'left',
        lineHeight: 20,
        marginBottom: SPACING.xl,
    },
    headlineLine1: {
        ...TYPOGRAPHY.h4,
        lineHeight: 22,
        color: DESIGN_TOKENS.textOnGhost,
        textAlign: 'left',
        fontWeight: '800',
    },
});

export default PageIntro;