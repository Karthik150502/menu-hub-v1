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
    // background_1, not cardBg — this is a floating modal surface, same as
    // AppModal (components/custom/appModal.tsx) and the sidebar panel
    // (sidebar-builder.tsx). cardBg is a lighter purple meant for inline
    // content cards (dish cards, stat strips, …), not modals — using it here
    // was the one surface in the app that didn't match the rest of the dark
    // theme.
    cardBg: DESIGN_TOKENS.background_1,
    cardBorder: DESIGN_TOKENS.cardBorder,
    title: DESIGN_TOKENS.textPrimary,
    message: DESIGN_TOKENS.textSubtle,
} as const;

// ─── Dialog content ───────────────────────────────────────────────────────────
// Split out from the `<Modal>` wrapper below so a caller that already has its
// own native Modal open (e.g. the sidebar) can render this directly inside
// it, instead of opening a second one. Two concurrently-visible RN <Modal>s
// is a known iOS bug — each Modal presents as its own native window, and
// iOS frequently drops touches on (or mis-stacks) the second one. Android's
// Modal is backed by a Dialog window instead, so this only shows up on iOS.

export type ConfirmationDialogContentProps = Omit<ConfirmationModalProps, 'visible'>;

export const ConfirmationDialogContent: React.FC<ConfirmationDialogContentProps> = ({
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Yes',
    cancelLabel = 'No',
    destructive = true,
}) => (
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
);

// ─── Component ────────────────────────────────────────────────────────────────
// A small centered Yes/No dialog — distinct from AppModal (a full-screen sheet
// for forms/content). Use this for anything that needs a quick "are you sure?"
// before running an action that isn't trivially reversible, as long as it
// isn't itself opening inside another already-visible Modal — if it is, use
// ConfirmationDialogContent directly inside that Modal instead (see Sidebar).

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    ...contentProps
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={contentProps.onCancel}
        >
            <ConfirmationDialogContent {...contentProps} />
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
