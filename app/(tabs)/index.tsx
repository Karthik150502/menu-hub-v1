// eslint-disable-next-line import/no-named-as-default
import WelcomeHero from '@/components/design/welcomeIntro';
// eslint-disable-next-line import/no-named-as-default
import AppHeader from '@/components/global/appHomeHeader';
import Sidebar from '@/components/global/sidebar/sidebar';
import DishesDisplay from '@/components/interactive/dishes-display';
// eslint-disable-next-line import/no-named-as-default
import HomePageHero from '@/components/interactive/homeHeroComponent';
import ScrollableStatsStrip from '@/components/interactive/scrollable-stats';
import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    /*
      SafeAreaView with edges={['bottom']} ONLY.
      - 'top' is intentionally excluded — AppHeader already reads
        useSafeAreaInsets().top and applies its own paddingTop, so adding
        top here would double-pad the header.
      - 'bottom' IS needed — without it the ScrollView's last item slides
        under the home indicator bar on iPhone and the Android nav bar.
      - 'left'/'right' are excluded — no hardware cutouts on the sides
        on any device we support.
    */
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <Sidebar />

      {/*
        AppHeader is outside the ScrollView so it stays pinned at the top.
        It handles its own top safe area via useSafeAreaInsets() internally.
      */}
      <AppHeader
        title="Mijoko"
        userInitials="KJ"
        onProfilePress={() => { }}
      />

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <WelcomeHero />
        <View style={styles.heroSection}>
          <HomePageHero
            name="Frank"
            isOpen
            restaurantName="Mijoko"
          />
          <ScrollableStatsStrip />
        </View>

        <View style={styles.dishesContainer}>
          <DishesDisplay />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DESIGN_TOKENS.background_1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  heroSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  dishesContainer: {
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.card,
    overflow: 'hidden',
    height: DIMENSIONS.sectionHeight,
  },
});