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
import { updateMe } from '@/lib/api/users';
import { updateUserMetadata } from '@/lib/supabase/auth';
import { setUserMetadata, useAppDispatch } from '@/store';
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
    const [saving, setSaving] = useState(false);
    const registerStep = useRegisterStep();
    const dispatch = useAppDispatch();

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
            // The bearer token from OTP verify (applySession, in otpScreen) is
            // already on the Supabase client, so apiClient attaches it here
            // automatically — the backend resolves the user from it and
            // updates their profile row.
            const user = await updateMe({ full_name: values.name });
            // Also persist it onto the Supabase Auth user itself, so it lands
            // in user_metadata and gets baked into the JWT on the next
            // refresh — updateMe above only updates our own `profiles` row,
            // it doesn't touch Supabase Auth.
            await updateUserMetadata({ full_name: user.full_name });
            // Mirror the saved name onto the in-memory session immediately —
            // updateUserMetadata triggers onAuthStateChange too, but that's
            // async, so this avoids a flash of the old/blank name.
            dispatch(setUserMetadata({ full_name: user.full_name }));
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
