import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React from 'react';
import {
    Modal, ModalProps,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";


type AppModalProps = ModalProps & {
    modalTitle: string,
    children: React.ReactNode
}

// ─── Theme tokens (local aliases for readability) ─────────────────────────────
// All color values come from @/constants/theme/theme — zero hardcoded hex here.

const T = {
    // Surfaces
    screenBg: DESIGN_TOKENS.background_1,

    // Text
    textPrimary: DESIGN_TOKENS.textPrimary,

    // UI chrome
    divider: DESIGN_TOKENS.disabled,
    closeBtn: DESIGN_TOKENS.whiteFadeXs,
    closeBtnText: DESIGN_TOKENS.textDismiss,
    dragPill: DESIGN_TOKENS.dragPill,
} as const;

export const AppModal: React.FC<AppModalProps> = (props) => {
    return <Modal
        {...props}
    >
        <View style={modalStyles.root}>
            {/* ── Header ── */}
            <View style={modalStyles.header}>
                <View style={modalStyles.dragPill} />
                <View style={modalStyles.headerRow}>
                    <Text style={modalStyles.title}>
                        {props.modalTitle}
                    </Text>
                    <TouchableOpacity
                        onPress={props.onRequestClose}
                        style={modalStyles.closeBtn}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={modalStyles.closeBtnText}>✕</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Form ── */}
            <ScrollView
                style={modalStyles.scroll}
                contentContainerStyle={modalStyles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {props.children}
            </ScrollView>
        </View>
    </Modal>
}


// ─── Styles ───────────────────────────────────────────────────────────────────

const modalStyles = StyleSheet.create({
    root: { flex: 1, backgroundColor: T.screenBg },
    header: { paddingTop: SPACING.md, paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: T.divider },
    dragPill: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: T.dragPill, marginBottom: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { color: T.textPrimary, ...TYPOGRAPHY.h3 },
    closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: T.closeBtn, alignItems: 'center', justifyContent: 'center' },
    closeBtnText: { color: T.closeBtnText, ...TYPOGRAPHY.bodySmall },
    scroll: { flex: 1 },
    content: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxl, paddingBottom: Platform.OS === 'ios' ? SPACING.giant : SPACING.xxxl },
});