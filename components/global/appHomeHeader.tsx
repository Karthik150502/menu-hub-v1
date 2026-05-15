import { DIMENSIONS } from '@/constants/themes/dimensions';
import { FONT_WEIGHTS, TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React from 'react';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../custom/appText';
import { SidebarButton } from './sidebar/sidebar-button';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppHeaderProps {
    /** Restaurant / app name shown in the centre-left */
    title: string;
    /** User's initials rendered inside the avatar pill */
    userInitials: string;
    /** Called when the avatar is tapped — wire up navigation here */
    onProfilePress?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    userInitials,
    onProfilePress,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>

            {/* Left — sidebar trigger + restaurant name */}
            <View style={styles.left}>
                <SidebarButton />
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
            </View>

            {/* Right — user avatar */}
            <TouchableOpacity
                onPress={onProfilePress}
                activeOpacity={0.8}
                style={styles.avatarBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Go to profile"
                accessibilityRole="button"
            >
                <Text style={styles.avatarText}>
                    {userInitials.slice(0, 2).toUpperCase()}
                </Text>
            </TouchableOpacity>

        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.sm,
        backgroundColor: DESIGN_TOKENS.background_1,
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        flex: 1,
        marginRight: SPACING.md,
    },

    title: {
        ...TYPOGRAPHY.body_bold,
        color: DESIGN_TOKENS.titleText,
        flexShrink: 1,
    },

    avatarBtn: {
        width: DIMENSIONS.touchXxl,
        height: DIMENSIONS.touchXxl,
        borderRadius: DIMENSIONS.touchXxl / 2,
        backgroundColor: DESIGN_TOKENS.accentDefault,
        alignItems: 'center',
        justifyContent: 'center',
        // Subtle ring
        borderWidth: 2,
        borderColor: DESIGN_TOKENS.primaryBorder,
        flexShrink: 0,
    },

    avatarText: {
        ...TYPOGRAPHY.label,
        color: DESIGN_TOKENS.primaryWhite,
        fontWeight: FONT_WEIGHTS.bold,
        // nudge optical vertical centering
        lineHeight: Platform.OS === 'ios' ? undefined : DIMENSIONS.touchXxl * 0.55,
    },
});

export default AppHeader;