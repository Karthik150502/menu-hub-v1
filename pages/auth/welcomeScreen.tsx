// eslint-disable-next-line import/no-named-as-default
import AppButton from '@/components/custom/AppButton';
import { Brand } from '@/components/design/brand';

import Text from '@/components/custom/appText';
// eslint-disable-next-line import/no-named-as-default
import WelcomeHero from '@/components/design/welcomeIntro';
import Page from '@/components/Page';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WelcomeScreenProps {
    onGetStarted: () => void;
    onSignIn: () => void;
}

// ─── Feature pills ────────────────────────────────────────────────────────────

const FEATURES: { icon: string; label: string }[] = [
    { icon: 'construct-outline', label: 'Instant Menu' },
    { icon: 'receipt-outline', label: 'Ordering' },
    { icon: 'bar-chart-outline', label: 'Analytics' },
    { icon: 'sparkles-outline', label: 'AI Insights' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
    onGetStarted,
    onSignIn,
}) => (
    <Page>
        {/* ── Content below the hero ── */}
        <View style={styles.content}>
            {/* Headline */}
            <View style={styles.headlineWrap}>
                <Brand size='lg' />
                <Text style={styles.headlineLine1}>Your restaurant,</Text>
                <Text style={styles.headlineAccent}>fully in control</Text>
            </View>


            {/* Subtext */}
            <Text style={styles.sub}>
                Everything you need to run a modern{'\n'}restaurant — in one place.
            </Text>

            {/* Feature grid */}
            <View style={styles.featGrid}>
                {FEATURES.map(f => (
                    <View key={f.label} style={styles.featPill}>
                        <Ionicons
                            name={f.icon as any}
                            size={15}
                            color={DESIGN_TOKENS.textSubtle}
                        />
                        <Text style={styles.featLabel}>{f.label}</Text>
                    </View>
                ))}
            </View>

        </View>

        {/* ── Hero animation — WelcomeHero fills the upper space ── */}
        <WelcomeHero />

        {/* ── CTA buttons ── */}
        <View style={styles.bottom}>
            <AppButton
                onPress={onGetStarted}
                accessibilityRole="button"
                accessibilityLabel="Get started"
                iconRight="arrow-forward"
                label={"Get Started"}
                fullWidth
            />
            <AppButton
                onPress={onSignIn}
                accessibilityRole="button"
                accessibilityLabel="Already have an account? Sign in"
                fullWidth
                variant="ghost"
                label="Already have an account? Sign in"
            />
        </View>

    </Page>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: DESIGN_TOKENS.background_1,
    },

    // ── Content ─────────────────────────────────────────────────────────────
    content: {
        alignItems: 'center',
        paddingHorizontal: SPACING.xxl,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
    },

    headlineWrap: {
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    headlineLine1: {
        ...TYPOGRAPHY.h4,
        lineHeight: 22,
        color: DESIGN_TOKENS.textOnGhost,
        textAlign: 'center',
        fontWeight: '800',
    },
    headlineAccent: {
        ...TYPOGRAPHY.h4,
        lineHeight: 22,
        color: DESIGN_TOKENS.primaryBright,   // bright purple
        textAlign: 'center',
        fontWeight: '800',
    },

    sub: {
        ...TYPOGRAPHY.bodySmall,
        color: DESIGN_TOKENS.textSubtle,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: SPACING.xl,
    },

    // ── Feature pills grid — 2×2 ─────────────────────────────────────────────
    featGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        justifyContent: 'center',
    },
    featPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs + 2,
        backgroundColor: DESIGN_TOKENS.inputBg,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.cardBorder,
        borderRadius: 10,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm + 2,
        // each pill takes ~45% width so two sit per row
        width: '45%',
    },
    featLabel: {
        ...TYPOGRAPHY.bodySmall,
        color: DESIGN_TOKENS.textSubtle,
        fontWeight: '600',
    },

    // ── Bottom CTAs ──────────────────────────────────────────────────────────
    bottom: {
        width: '100%',
        maxWidth: 480,   // caps at tablet width on bigger screens
        alignSelf: 'center',  // centres the capped container on desktop
        paddingHorizontal: SPACING.sm,
        paddingBottom: SPACING.xxl,
        paddingTop: SPACING.xl,
        gap: SPACING.md,
        marginTop: 'auto',
    },
});

export default WelcomeScreen;
