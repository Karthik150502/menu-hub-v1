// eslint-disable-next-line import/no-named-as-default
import AppButton from '@/components/custom/AppButton';
import OtpInput from '@/components/custom/otpField';
import { useToast } from '@/components/feedback/Toast';
// eslint-disable-next-line import/no-named-as-default
import StepIndicator from '@/components/interactive/stepIndicator';
// eslint-disable-next-line import/no-named-as-default
import PageIntro from '@/components/intros/pageIntro';
import { AuthPage } from '@/components/Page';
import { LOGIN_FLOW_STEPS } from '@/constants/auth/loginFlow';
import { REGISTER_FLOW_STEPS } from '@/constants/auth/registerFlow';
import { SPACING } from '@/constants/themes/spacing';
import { useCallingCode } from '@/hooks/use-calling-code';
import { useFlowStep } from '@/hooks/use-flow-step';
import { sendPhoneOtp, verifyPhoneOtp } from '@/lib/api/auth';
import { DEFAULT_DIAL_CODE, toE164 } from '@/lib/phone';
import { applySession } from '@/lib/supabase/auth';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

// ─── Phone formatting ─────────────────────────────────────────────────────────
// Mirrors registerScreen.tsx/loginScreen.tsx — the route only carries the
// 10-digit local number, Supabase needs E.164. Must reconstruct it with the
// same (pinned, India-only for now — see registerScreen.tsx) dial code that
// was used to send the OTP, or verify/resend would target the wrong number.

// ─── Types ────────────────────────────────────────────────────────────────────

interface OtpScreenProps {
    /**
     * Which auth flow this verification belongs to — decides the step count
     * shown and where verify sends the user next. Set by the route file that
     * renders this screen (app/(auth)/otp.tsx vs login-otp.tsx), not a URL
     * param, since it's a fixed property of the screen, not user-supplied
     * data.
     * @default 'register'
     */
    flow?: 'register' | 'login';
    onBack?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const OtpScreen: React.FC<OtpScreenProps> = ({
    flow = 'register',
}) => {
    const { phno } = useLocalSearchParams<{ phno: string }>();
    const toast = useToast();
    const dialCode = useCallingCode(DEFAULT_DIAL_CODE);
    const flowStep = useFlowStep(flow === 'login' ? LOGIN_FLOW_STEPS : REGISTER_FLOW_STEPS);
    const [otp, setOtp] = useState('');
    const [otpComplete, setOtpComplete] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async () => {
        if (!phno) return;
        setVerifying(true);
        try {
            const tokens = await verifyPhoneOtp(toE164(dialCode, phno), otp);
            // Hand the backend-minted token pair to the Supabase client so it's
            // persisted (SecureStore) and auto-refreshes — AuthSync
            // (app/_layout.tsx) picks up the change via onAuthStateChange and
            // updates auth state.
            await applySession(tokens);
            if (flow === 'login') {
                // Existing account — already has a name on file, skip straight in.
                router.replace('/(tabs)');
            } else {
                // New account — one more step (name) before we're done.
                router.push(`/name?phno=${phno}`);
            }
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
            await sendPhoneOtp(toE164(dialCode, phno));
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
    }} backLabel="back"
        headerBelow={<StepIndicator {...flowStep} />}
    >
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
