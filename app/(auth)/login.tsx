// eslint-disable-next-line import/no-named-as-default
import WelcomeHero from '@/components/design/welcomeIntro';
import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.heroWrapper}>
                <WelcomeHero />
            </View>

            <TouchableOpacity
                style={styles.homeBtn}
                onPress={() => router.replace('/(tabs)')}
                activeOpacity={0.75}
            >
                <Ionicons name="home-outline" size={DIMENSIONS.iconLg} color={DESIGN_TOKENS.primaryWhite} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: DESIGN_TOKENS.background_1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeBtn: {
        width: DIMENSIONS.touchXxxl,
        height: DIMENSIONS.touchXxxl,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: DESIGN_TOKENS.accentDefault,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: DESIGN_TOKENS.accentDefault,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
    },
});
