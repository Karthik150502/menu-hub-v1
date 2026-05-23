


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

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegisterScreenProps {
    onBack?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const RegisterScreen: React.FC<RegisterScreenProps> = () => {

    const toast = useToast();

    return <AuthPage onBack={() => {
        router.back()
    }} backLabel="back">
        {/* ── Content below the hero ── */}
        <View style={styles.content}>
            {/* Headline */}
            <View style={styles.headlineWrap}>
                <PageIntro
                    title="Get started"
                    subtitle="Enter the phone number to create your restaurant account."
                />
            </View>
            <AppButton
                fullWidth
                variant="primary"
                accessibilityRole="button"
                accessibilityLabel="Send OTP"
                onPress={() => {
                    // router.push("/otp")
                    toast.error("Hello boys", "Title")
                }}
                label='Send OTP'
            />
        </View>

    </AuthPage>
};

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

export default RegisterScreen;
