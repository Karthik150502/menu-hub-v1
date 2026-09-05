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
import { NameFormValues, nameSchema } from '@/types/zod/validations/name';
import { zodResolver } from '@hookform/resolvers/zod';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NameScreenProps {
    defaultValues?: {
        name: string
    };
    onSubmit?: (values: {
        name: string
    }) => void;
    submitLabel?: string;
    isSubmitting?: boolean;
    onBack?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NameScreen: React.FC<NameScreenProps> = ({
    onSubmit,
    defaultValues,
}) => {

    const toast = useToast();
    const { phno } = useLocalSearchParams<{ phno?: string }>();
    const [saving, setSaving] = useState(false);
    const registerStep = useRegisterStep();

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<NameFormValues>({
        resolver: zodResolver(nameSchema),
        defaultValues: { name: '', ...defaultValues },
        mode: "onSubmit",
        reValidateMode: 'onChange',
    });

    const onValid: SubmitHandler<NameFormValues> = async (values) => {
        onSubmit?.(values);
        setSaving(true);
        try {
            // TODO: wire up to backend once the profile API is ready — persist
            // `values.name` (and `phno`, if needed) against the account created
            // during OTP verification.
            router.replace('/(tabs)');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Could not save your name. Please try again.';
            toast.error(message, 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const onInvalid: SubmitErrorHandler<NameFormValues> = (errs) => {
        console.warn('[NameScreen] Validation failed', errs);
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
                    title="What's your name?"
                    subtitle="Let us know who we're setting the account up for."
                />
            </View>
            <View style={styles.content}>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <Field
                            label="Full name"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder="e.g. Jane Doe"
                            autoComplete="off"
                            error={errors.name?.message}
                        />
                    )}
                />
                <AppButton
                    fullWidth
                    variant="outline"
                    accessibilityRole="button"
                    accessibilityLabel="Continue"
                    disabled={!isDirty || saving}
                    loading={saving}
                    loadingLabel="Saving…"
                    onPress={handleSubmit(onValid, onInvalid)}
                    label='Continue'
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

export default NameScreen;
