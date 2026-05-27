


// eslint-disable-next-line import/no-named-as-default
import AppButton from '@/components/custom/AppButton';
import { useToast } from '@/components/feedback/Toast';
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

// ─── Component ────────────────────────────────────────────────────────────────

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
    onSubmit,
    defaultValues,
}) => {

    const toast = useToast();

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

    const onValid: SubmitHandler<PhoneFormValues> = (values) => {
        onSubmit?.(values);
        router.push(`/otp?phno=${values.phone}`)
        toast.success(`Otp has been sent to ${values.phone}`, "OTP Sent")
    };

    const onInvalid: SubmitErrorHandler<PhoneFormValues> = (errs) => {
        console.warn('[MobileLoginForm] Validation failed', errs);
        toast.warning('Resolve all the errors before submitting');
    };

    return <AuthPage onBack={() => {
        router.back()
    }} backLabel="back">
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
                    disabled={!isDirty}
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
