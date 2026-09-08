import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import AppButton from './AppButton';
import Text from './appText';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfirmationModalProps {
    /** Whether the dialog is visible. */
    visible: boolean;
    title: string;
    message: string;
    /** Called when the user confirms ("Yes"). */
    onConfirm: () => void;
    /** Called when the user backs out ("No"), taps the backdrop, or (Android) presses back. */
    onCancel: () => void;
    /** @default 'Yes' */
    confirmLabel?: string;
    /** @default 'No' */
    cancelLabel?: string;
    /**
     * Styles the confirm button as a destructive ("danger") action rather than
     * a primary one — appropriate for anything that can't be casually undone
     * (logging out, deleting, discarding). @default true
     */
    destructive?: boolean;
}

// ─── Theme tokens (local aliases for readability) ─────────────────────────────

const T = {
    backdrop: DESIGN_TOKENS.backdropColor,
    cardBg: DESIGN_TOKENS.cardBg,
    cardBorder: DESIGN_TOKENS.cardBorder,
    title: DESIGN_TOKENS.textPrimary,
    message: DESIGN_TOKENS.textSubtle,
} as const;

// ─── Component ────────────────────────────────────────────────────────────────
// A small centered Yes/No dialog — distinct from AppModal (a full-screen sheet
// for forms/content). Use this for anything that needs a quick "are you sure?"
// before running an action that isn't trivially reversible.

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Yes',
    cancelLabel = 'No',
    destructive = true,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <Pressable style={styles.backdrop} onPress={onCancel} accessibilityRole="none">
                {/* Swallow taps on the card itself so they don't bubble to the backdrop */}
                <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actions}>
                        <AppButton
                            label={cancelLabel}
                            variant="secondary"
                            onPress={onCancel}
                            accessibilityRole="button"
                            accessibilityLabel={cancelLabel}
                            style={styles.action}
                            fullWidth
                        />
                        <AppButton
                            label={confirmLabel}
                            variant={destructive ? 'danger' : 'primary'}
                            onPress={onConfirm}
                            accessibilityRole="button"
                            accessibilityLabel={confirmLabel}
                            style={styles.action}
                            fullWidth
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: T.backdrop,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xxl,
    },
    card: {
        width: '100%',
        maxWidth: DIMENSIONS.cardMinWidth,
        backgroundColor: T.cardBg,
        borderWidth: 1,
        borderColor: T.cardBorder,
        borderRadius: BORDER_RADIUS.card,
        padding: SPACING.xxl,
    },
    title: {
        ...TYPOGRAPHY.h4,
        color: T.title,
        marginBottom: SPACING.sm,
    },
    message: {
        ...TYPOGRAPHY.bodySmall,
        color: T.message,
        lineHeight: 20,
        marginBottom: SPACING.xl,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    action: {
        flex: 1,
    },
});

export default ConfirmationModal;
