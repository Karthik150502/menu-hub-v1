// eslint-disable-next-line import/no-named-as-default
import OtpInput from '@/components/custom/otpField';
// eslint-disable-next-line import/no-named-as-default
import PageIntro from '@/components/intros/pageIntro';
import { AuthPage } from '@/components/Page';
import { SPACING } from '@/constants/themes/spacing';
import { router } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OtpScreenProps {
    onBack?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const OtpScreen: React.FC<OtpScreenProps> = ({
}) => {
    
    return <AuthPage onBack={() => {
        router.back()
    }} backLabel="back">
        {/* ── Content below the hero ── */}
        <View style={styles.content}>
            {/* Headline */}
            <View style={styles.headlineWrap}>
                <PageIntro
                    title={`OTP sent to ${"7483935582"}`}
                    subtitle={`Enter the otp`}
                />
            </View>

            <OtpInput
                onComplete={() => {

                }}
            />
        </View>

    </AuthPage>
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

    // ── Content ─────────────────────────────────────────────────────────────
    content: {
        alignItems: 'center',
        // paddingHorizontal: SPACING.lg,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
    },

    headlineWrap: {
        alignItems: 'center',
        marginBottom: SPACING.sm,
        width: "100%"
    }
});

export default OtpScreen;
