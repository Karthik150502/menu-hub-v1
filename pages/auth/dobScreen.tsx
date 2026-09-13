// eslint-disable-next-line import/no-named-as-default
import AppButton from '@/components/custom/AppButton';
import ErrorText from '@/components/custom/errortext';
import { useToast } from '@/components/feedback/Toast';
// eslint-disable-next-line import/no-named-as-default
import StepIndicator from '@/components/interactive/stepIndicator';
// eslint-disable-next-line import/no-named-as-default
import PageIntro from '@/components/intros/pageIntro';
import { AuthPage } from '@/components/Page';
import { SPACING } from '@/constants/themes/spacing';
import { useRegisterStep } from '@/hooks/use-register-step';
import { updateMe } from '@/lib/api/users';
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

// eslint-disable-next-line import/no-named-as-default
import DatePicker from '@/components/utils/DatePicker';
import { DobFormValues, dobSchema } from '@/types/zod/validations/dob';
import { zodResolver } from '@hookform/resolvers/zod';

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Backend's UserUpdate.date_of_birth is an ISO "YYYY-MM-DD" string (format:
// date) — DatePicker hands back a local Date, so format it in local time
// rather than toISOString() (which would shift the date at UTC offsets).

function toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DobScreenProps {
    defaultValues?: {
        dateOfBirth: Date
    };
    onSubmit?: (values: {
        dateOfBirth: Date
    }) => void;
    submitLabel?: string;
    isSubmitting?: boolean;
    onBack?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DobScreen: React.FC<DobScreenProps> = ({
    onSubmit,
    defaultValues,
}) => {

    const toast = useToast();
    const [saving, setSaving] = useState(false);
    const registerStep = useRegisterStep();

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<DobFormValues>({
        resolver: zodResolver(dobSchema),
        defaultValues: { ...defaultValues } as DobFormValues,
        mode: "onSubmit",
        reValidateMode: 'onChange',
    });

    const onValid: SubmitHandler<DobFormValues> = async (values) => {
        onSubmit?.(values);
        setSaving(true);
        try {
            // Same bearer-token path as nameScreen — the session set by
            // applySession (otpScreen) is already on the Supabase client, so
            // apiClient attaches it here automatically.
            await updateMe({ date_of_birth: toISODate(values.dateOfBirth) });
            router.replace('/(tabs)');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Could not save your date of birth. Please try again.';
            toast.error(message, 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const onInvalid: SubmitErrorHandler<DobFormValues> = (errs) => {
        console.warn('[DobScreen] Validation failed', errs);
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
                    title="When's your birthday?"
                    subtitle="We need this to confirm you're old enough to run an account."
                />
            </View>
            <View style={styles.content}>
                <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field: { value, onChange } }) => (
                        <DatePicker
                            label="Date of birth"
                            placeholder="Select your date of birth"
                            value={value ?? null}
                            onChange={onChange}
                            mode="date"
                            dateConstraint={{ type: 'past' }}
                            style={styles.datePicker}
                        />
                    )}
                />
                {errors.dateOfBirth?.message ? (
                    <ErrorText message={errors.dateOfBirth.message} />
                ) : null}
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
    },

    datePicker: {
        width: '100%',
    },
});

export default DobScreen;
