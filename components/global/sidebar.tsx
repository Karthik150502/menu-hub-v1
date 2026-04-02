import { DESIGN_TOKENS } from '@/constants/theme';
import { SidebarOptionGroup } from '@/types/sidebar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SidebarBuilder from '../sidebar-builder';
import Icon from '../ui/icon.example';
import { useSidebar } from './sidebar-context';


// ─── Sidebar option groups ────────────────────────────────────────────────
const optionGroups: SidebarOptionGroup[] = [
    {
        groupLabel: 'Navigation',
        options: [
            {
                key: 'home',
                label: 'Home',
                icon: <Icon char="🏠" />,
                onPress: () => console.log('Home pressed'),
            },
            {
                key: 'explore',
                label: 'Explore',
                icon: <Icon char="🔍" />,
                onPress: () => console.log('Explore pressed'),
            },
            {
                key: 'notifications',
                label: 'Notifications',
                icon: <Icon char="🔔" />,
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
                icon: <Icon char="👤" />,
                onPress: () => console.log('Profile pressed'),
            },
            {
                key: 'settings',
                label: 'Settings',
                icon: <Icon char="⚙️" />,
                onPress: () => console.log('Settings pressed'),
            },
            {
                key: 'billing',
                label: 'Billing',
                icon: <Icon char="💳" />,
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
                icon: <Icon char="❌" />,
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
        fontSize: 16,
    },
    name: {
        color: DESIGN_TOKENS.primaryWhite,
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.2,
    },
    email: {
        color: DESIGN_TOKENS.subNeutral,
        fontSize: 12,
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
        fontSize: 12,
    },
    help: {
        color: DESIGN_TOKENS.subNeutral,
        fontSize: 13,
        fontWeight: '500',
    },
});

export default Sidebar;