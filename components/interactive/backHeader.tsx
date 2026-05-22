import Text from '@/components/custom/appText';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BackHeaderProps {
    /** Called when the back button is pressed */
    onBack: () => void;
    /** Override the label. Defaults to "Back" */
    label?: string;
    /** Optional right-side element (e.g. a skip button) */
    right?: React.ReactNode;
    style?: ViewStyle;
    paddingTop?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BackHeader: React.FC<BackHeaderProps> = ({
    onBack,
    label = 'Back',
    right,
    style,
    paddingTop = SPACING.xxxl
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                { paddingTop: insets.top + paddingTop },
                style,
            ]}
        >
            <TouchableOpacity
                onPress={onBack}
                activeOpacity={0.6}
                style={styles.backBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 16 }}
                accessibilityRole="button"
                accessibilityLabel={`Go back${label !== 'Back' ? ` to ${label}` : ''}`}
            >
                <Ionicons
                    name="arrow-back-outline"
                    size={18}
                    color={DESIGN_TOKENS.textSubtle}
                    aria-hidden
                />
                <Text style={styles.label}>{label}</Text>
            </TouchableOpacity>

            {/* Optional right slot — skip button, step indicator, etc. */}
            {right && <View style={styles.right}>{right}</View>}
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg
    },

    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },

    label: {
        ...TYPOGRAPHY.bodyLarge,
        color: DESIGN_TOKENS.textSubtle,
        fontWeight: '500',
    },

    right: {
        marginLeft: 'auto',
    },
});

export default BackHeader;