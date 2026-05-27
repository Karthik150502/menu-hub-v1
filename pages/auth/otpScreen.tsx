// eslint-disable-next-line import/no-named-as-default
import AppButton from '@/components/custom/AppButton';
import OtpInput from '@/components/custom/otpField';
// eslint-disable-next-line import/no-named-as-default
import PageIntro from '@/components/intros/pageIntro';
import { AuthPage } from '@/components/Page';
import { SPACING } from '@/constants/themes/spacing';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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
    const { phno } = useLocalSearchParams<{ phno: string }>();
    const [otpComplete, setOtpComplete] = useState(false);

    return <AuthPage onBack={() => {
        router.back()
    }} backLabel="back">
        {/* ── Content below the hero ── */}
        <View style={styles.container}>
            {/* Headline */}
            <View style={styles.headlineWrap}>
                <PageIntro
                    title={`OTP sent to ${phno ?? ''}`}
                    subtitle={`Enter the otp`}
                />
            </View>
            <View style={styles.content}>
                <OtpInput
                    onComplete={() => setOtpComplete(true)}
                    onChange={() => setOtpComplete(false)}
                />
                <AppButton
                    fullWidth
                    variant="outline"
                    accessibilityRole="button"
                    accessibilityLabel="Send OTP"
                    disabled={!otpComplete}
                    onPress={() => {
                        router.push("/(tabs)")
                    }}
                    label='Verify'
                />
            </View>
        </View>

    </AuthPage>
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

    // ── Container ─────────────────────────────────────────────────────────────
    container: {
        alignItems: 'center',
        flex: 1,
        display: "flex",
        justifyContent: "flex-start",
    },
    content: {
        alignItems: 'center',
        height: "auto",
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        gap: SPACING.xl
    },

    headlineWrap: {
        alignItems: 'center',
        marginBottom: SPACING.sm,
        width: "100%"
    }
});

export default OtpScreen;
