// eslint-disable-next-line import/no-named-as-default
import ConfirmationModal from '@/components/custom/confirmationModal';
import Text from '@/components/custom/appText';
import { DIMENSIONS } from '@/constants/themes/dimensions';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { signOut } from '@/lib/supabase/auth';
import { SidebarOptionGroup } from '@/types/sidebar';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import SidebarBuilder from './sidebar-builder';

import { clearSession, closeSidebar, selectSidebarOpen, useAppDispatch, useAppSelector } from '@/store';


const Sidebar: React.FC = () => {

    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(selectSidebarOpen);

    // The "Log Out" option is marked `keepOpen` (see optionGroups below), so
    // the sidebar stays open behind the confirmation modal instead of
    // closing on press.
    const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

    // ─── Log out ──────────────────────────────────────────────────────────────
    // Best-effort remote sign-out (invalidates the refresh token on Supabase),
    // but the local session is cleared and the user is sent to `/welcome`
    // regardless of whether that network call succeeds — a logout should never
    // leave someone stuck signed in on their own device just because the
    // request failed. `router.replace` (not `push`) so back-navigation can't
    // return to an authenticated screen.
    const handleConfirmLogout = useCallback(async () => {
        setLogoutConfirmVisible(false);
        dispatch(closeSidebar());
        try {
            await signOut();
        } catch (err) {
            console.warn('[Sidebar] signOut request failed, clearing local session anyway', err);
        } finally {
            dispatch(clearSession());
            router.replace('/welcome');
        }
    }, [dispatch]);

    const handleRequestLogout = useCallback(() => setLogoutConfirmVisible(true), []);
    const handleCancelLogout = useCallback(() => setLogoutConfirmVisible(false), []);

    // ─── Sidebar option groups ────────────────────────────────────────────────
    const optionGroups: SidebarOptionGroup[] = useMemo(() => [
        {
            groupLabel: 'Navigation',
            options: [
                {
                    key: 'home',
                    label: 'Home',
                    href: '/(tabs)',
                },
                {
                    key: 'welcome',
                    label: 'Welcome',
                    href: '/welcome',
                },
                {
                    key: 'register',
                    label: 'Register',
                    href: '/register',
                }
            ],
        },
        {
            groupLabel: 'Account',
            options: [
                {
                    key: 'profile',
                    label: 'My Profile',
                    onPress: () => console.log('Profile pressed'),
                },
                {
                    key: 'settings',
                    label: 'Settings',
                    onPress: () => console.log('Settings pressed'),
                },
                {
                    key: 'billing',
                    label: 'Billing',
                    onPress: () => console.log('Billing pressed'),
                },
            ],
        },
        {
            groupLabel: 'Danger zone',
            options: [
                {
                    key: 'logout',
                    label: 'Log Out',
                    onPress: handleRequestLogout,
                    danger: true,
                    keepOpen: true,
                },
            ],
        },
    ], [handleRequestLogout]);

    // ─── Sidebar header ───────────────────────────────────────────────────────
    const sidebarHeader = (
        <View style={headerStyles.container}>
            <View style={headerStyles.avatar}>
                <Text style={headerStyles.avatarText}>JD</Text>
            </View>
            <View>
                <Text style={headerStyles.name}>John Doe</Text>
                <Text style={headerStyles.email}>john@example.com</Text>
            </View>
        </View>
    );

    // ─── Sidebar footer ───────────────────────────────────────────────────────
    const sidebarFooter = (
        <View style={footerStyles.container}>
            <Text style={footerStyles.version}>App v1.0.0</Text>
            <Pressable onPress={() => console.log('Help pressed')}>
                <Text style={footerStyles.help}>Help & Support</Text>
            </Pressable>
        </View>
    );

    return <>
        <SidebarBuilder
            visible={isOpen}
            onClose={() => dispatch(closeSidebar())}
            side="left"
            header={sidebarHeader}
            footer={sidebarFooter}
            optionGroups={optionGroups}
            overlayOpacity={0.55}
        />
        <ConfirmationModal
            visible={logoutConfirmVisible}
            title="Log out?"
            message="Are you sure you want to log out?"
            onConfirm={handleConfirmLogout}
            onCancel={handleCancelLogout}
        />
    </>

}



const headerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.bg,
    },
    avatar: {
        width: DIMENSIONS.touchXxxl,
        height: DIMENSIONS.touchXxxl,
        borderRadius: DIMENSIONS.touchXxxl / 2,
        backgroundColor: DESIGN_TOKENS.primaryBright,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: DESIGN_TOKENS.textPrimary,
        ...TYPOGRAPHY.h4
    },
    name: {
        color: DESIGN_TOKENS.textPrimary,
        ...TYPOGRAPHY.h4
    },
    email: {
        color: DESIGN_TOKENS.textLabel,
        ...TYPOGRAPHY.bodySmall,
        marginTop: SPACING.xxs,
    },
});

const footerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    version: {
        color: DESIGN_TOKENS.textSectionTitle,
        textAlign: "left",
        ...TYPOGRAPHY.caption_bold,
    },
    help: {
        color: DESIGN_TOKENS.textSectionTitle,
        textAlign: "left",
        ...TYPOGRAPHY.caption_bold,
    },
});

export default Sidebar;