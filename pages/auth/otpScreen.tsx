// eslint-disable-next-line import/no-named-as-default
import AppButton from '@/components/custom/AppButton';
import OtpInput from '@/components/custom/otpField';
import { useToast } from '@/components/feedback/Toast';
// eslint-disable-next-line import/no-named-as-default
import PageIntro from '@/components/intros/pageIntro';
import { AuthPage } from '@/components/Page';
import { SPACING } from '@/constants/themes/spacing';
import { sendPhoneOtp, verifyPhoneOtp } from '@/lib/supabase/auth';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

// ─── Phone formatting ─────────────────────────────────────────────────────────
// Mirrors registerScreen.tsx — the route only carries the 10-digit local
// number, Supabase needs E.164. India-only for now, hence the hardcoded +91.

const toE164 = (phone: string) => `+91${phone}`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface OtpScreenProps {
    onBack?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const OtpScreen: React.FC<OtpScreenProps> = ({
}) => {
    const { phno } = useLocalSearchParams<{ phno: string }>();
    const toast = useToast();
    const [otp, setOtp] = useState('');
    const [otpComplete, setOtpComplete] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async () => {
        if (!phno) return;
        setVerifying(true);
        try {
            await verifyPhoneOtp(toE164(phno), otp);
            // Session is now set on the Supabase client — AuthSync (app/_layout.tsx)
            // picks up the change and updates auth state; navigate straight to tabs.
            router.replace('/(tabs)');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
            toast.error(message, 'Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!phno) return;
        setResending(true);
        try {
            await sendPhoneOtp(toE164(phno));
            toast.success(`Otp has been resent to ${phno}`, 'OTP Sent');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Could not resend the OTP. Please try again.';
            toast.error(message, 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

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
                    onComplete={(value) => { setOtp(value); setOtpComplete(true); }}
                    onChange={(value) => { setOtp(value); setOtpComplete(false); }}
                    disabled={verifying}
                />
                <AppButton
                    fullWidth
                    variant="outline"
                    accessibilityRole="button"
                    accessibilityLabel="Verify"
                    disabled={!otpComplete || verifying}
                    loading={verifying}
                    loadingLabel="Verifying…"
                    onPress={handleVerify}
                    label='Verify'
                />
                <AppButton
                    fullWidth
                    variant="ghost"
                    accessibilityRole="button"
                    accessibilityLabel="Resend OTP"
                    disabled={resending || verifying}
                    loading={resending}
                    loadingLabel="Resending…"
                    onPress={handleResend}
                    label="Didn't get it? Resend OTP"
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
