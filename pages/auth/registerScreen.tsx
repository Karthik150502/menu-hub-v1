// eslint-disable-next-line import/no-named-as-default
import AppButton from '@/components/custom/AppButton';
import { useToast } from '@/components/feedback/Toast';
// eslint-disable-next-line import/no-named-as-default
import StepIndicator from '@/components/interactive/stepIndicator';
// eslint-disable-next-line import/no-named-as-default
import PageIntro from '@/components/intros/pageIntro';
import { AuthPage } from '@/components/Page';
import { SPACING } from '@/constants/themes/spacing';
import { useCallingCode } from '@/hooks/use-calling-code';
import { useRegisterStep } from '@/hooks/use-register-step';
import { sendPhoneOtp } from '@/lib/api/auth';
import { DEFAULT_DIAL_CODE, toE164 } from '@/lib/phone';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

import {
    Controller,
    SubmitErrorHandler,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import PhoneField from '@/components/custom/phoneField';
import { mobileLoginSchema, PhoneFormValues } from '@/types/zod/validations/mobile_login';
import { zodResolver } from '@hookform/resolvers/zod';

// ─── Types ────────────────────────────────────────────────────────────────────


export interface RegisterScreenProps {
    defaultValues?: {
        phone: string
    };
    onSubmit?: (mobile: {
        phone: string
    }) => void;
    submitLabel?: string;
    isSubmitting?: boolean;
    onBack?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────
// The form only collects a 10-digit local number (see mobileLoginSchema) —
// Supabase's phone auth needs E.164 (+<dial code><number>, no spaces).
//
// India-only for now (phone auth/Twilio and the OTP flow only support Indian
// numbers today), so the dial code is pinned to DEFAULT_DIAL_CODE ('+91')
// rather than left to useCallingCode's device-locale detection — that's
// unreliable for this: an India-based user's OS/browser locale often reports
// as "en-US", which resolves to +1. useCallingCode still takes an override,
// so this is the one place to swap in a real country picker once multi-
// country support exists.

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
    onSubmit,
    defaultValues,
}) => {

    const toast = useToast();
    const [sending, setSending] = useState(false);
    const registerStep = useRegisterStep();
    const dialCode = useCallingCode(DEFAULT_DIAL_CODE);

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<PhoneFormValues>({
        resolver: zodResolver(mobileLoginSchema),
        defaultValues: { phone: '', ...defaultValues },
        mode: "onSubmit",
        reValidateMode: 'onChange',
    });

    const onValid: SubmitHandler<PhoneFormValues> = async (values) => {
        onSubmit?.(values);
        setSending(true);
        try {
            await sendPhoneOtp(toE164(dialCode, values.phone));
            router.push(`/otp?phno=${values.phone}`);
            toast.success(`Otp has been sent to ${values.phone}`, "OTP Sent");
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Could not send the OTP. Please try again.';
            toast.error(message, 'Failed to send OTP');
        } finally {
            setSending(false);
        }
    };

    const onInvalid: SubmitErrorHandler<PhoneFormValues> = (errs) => {
        console.warn('[MobileLoginForm] Validation failed', errs);
        toast.warning('Resolve all the errors before submitting');
    };

    return <AuthPage onBack={() => {
        router.back()
    }} backLabel="back"
        headerBelow={<StepIndicator {...registerStep} />}
    >
        {/* ── Content below the hero ── */}
        <View style={styles.container}>
            {/* Headline */}
            <View style={styles.headlineWrap}>
                <PageIntro
                    title="Get started"
                    subtitle="Enter the phone number to create your restaurant account."
                />
            </View>
            <View style={styles.content}>
                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <PhoneField
                            label="Phone number"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder="e.g. 9876543210"
                            error={errors.phone?.message}
                            dialCode={dialCode}
                        />
                    )}
                />
                <AppButton
                    fullWidth
                    variant="outline"
                    accessibilityRole="button"
                    accessibilityLabel="Send OTP"
                    disabled={!isDirty || sending}
                    loading={sending}
                    loadingLabel="Sending…"
                    onPress={handleSubmit(onValid, onInvalid)}
                    label='Send OTP'
                />
            </View>
        </View>

    </AuthPage>
};

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
    },

    headlineWrap: {
        alignItems: 'center',
        marginBottom: SPACING.sm,
        width: "100%"
    }
});

export default RegisterScreen;
