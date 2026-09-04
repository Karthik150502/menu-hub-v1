// eslint-disable-next-line import/no-named-as-default
import AppButton from '@/components/custom/AppButton';
import { useToast } from '@/components/feedback/Toast';
// eslint-disable-next-line import/no-named-as-default
import StepIndicator from '@/components/interactive/stepIndicator';
// eslint-disable-next-line import/no-named-as-default
import PageIntro from '@/components/intros/pageIntro';
import { AuthPage } from '@/components/Page';
import { SPACING } from '@/constants/themes/spacing';
import { useRegisterStep } from '@/hooks/use-register-step';
import { sendPhoneOtp } from '@/lib/supabase/auth';
import { router, useLocalSearchParams } from 'expo-router';
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

import Field from '@/components/custom/inputField';
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

// ─── Phone formatting ─────────────────────────────────────────────────────────
// The form only collects a 10-digit local number (see mobileLoginSchema) —
// Supabase's phone auth needs E.164 (+<country code><number>, no spaces).
// India-only for now, hence the hardcoded +91.

const toE164 = (phone: string) => `+91${phone}`;

// ─── Component ────────────────────────────────────────────────────────────────

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
    onSubmit,
    defaultValues,
}) => {

    const toast = useToast();
    const { mode } = useLocalSearchParams<{ mode?: string }>();
    const isSignIn = mode === 'signin';
    const [sending, setSending] = useState(false);
    const registerStep = useRegisterStep();

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
            await sendPhoneOtp(toE164(values.phone));
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
                    title={isSignIn ? 'Welcome back' : 'Get started'}
                    subtitle={
                        isSignIn
                            ? 'Enter your phone number to sign in.'
                            : 'Enter the phone number to create your restaurant account.'
                    }
                />
            </View>
            <View style={styles.content}>
                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <Field
                            label="Phone number"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            keyboardType="numeric"
                            placeholder="e.g. 9876543210"
                            error={errors.phone?.message}
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
