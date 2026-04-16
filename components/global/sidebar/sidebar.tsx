import { FONT_SIZES } from '@/constants/themes/font';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { SidebarOptionGroup } from '@/types/sidebar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SidebarBuilder from './sidebar-builder';
import { useSidebar } from './sidebar-context';


// ─── Sidebar option groups ────────────────────────────────────────────────
const optionGroups: SidebarOptionGroup[] = [
    {
        groupLabel: 'Navigation',
        options: [
            {
                key: 'home',
                label: 'Home',
                onPress: () => console.log('Home pressed'),
            },
            {
                key: 'explore',
                label: 'Explore',
                onPress: () => console.log('Explore pressed'),
            },
            {
                key: 'notifications',
                label: 'Notifications',
                onPress: () => console.log('Notifications pressed'),
            },
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
                onPress: () => console.log('Logout pressed'),
                danger: true,
                // disabled:true,
            },
        ],
    },
];


const Sidebar: React.FC = () => {

    const { isOpen, closeSidebar } = useSidebar();

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

    return <SidebarBuilder
        visible={isOpen}
        onClose={closeSidebar}
        side="left"
        header={sidebarHeader}
        footer={sidebarFooter}
        optionGroups={optionGroups}
        overlayOpacity={0.55}
    />

}



const headerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: DESIGN_TOKENS.primaryBright,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: DESIGN_TOKENS.primaryWhite,
        fontWeight: '700',
        fontSize: FONT_SIZES.lg,
    },
    name: {
        color: DESIGN_TOKENS.primaryWhite,
        fontWeight: '600',
        fontSize: FONT_SIZES.lg,
        letterSpacing: 0.2,
    },
    email: {
        color: DESIGN_TOKENS.subNeutral,
        fontSize: FONT_SIZES.sm,
        marginTop: 2,
    },
});

const footerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    version: {
        color: DESIGN_TOKENS.subNeutral,
        fontSize: FONT_SIZES.sm,
    },
    help: {
        color: DESIGN_TOKENS.subNeutral,
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
    },
});

export default Sidebar;