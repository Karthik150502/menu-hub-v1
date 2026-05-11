// eslint-disable-next-line import/no-named-as-default
import WelcomeHero from '@/components/design/welcomeIntro';
// eslint-disable-next-line import/no-named-as-default
import AppHeader from '@/components/global/appHomeHeader';
import Sidebar from '@/components/global/sidebar/sidebar';
import DishesDisplay from '@/components/interactive/dishes-display';
// eslint-disable-next-line import/no-named-as-default
import HomePageHero from '@/components/interactive/homeHeroComponent';
import ScrollableStatsStrip from '@/components/interactive/scrollable-stats';
import { Page } from '@/components/Page';
import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    /*
      Thin root View with flex:1 so that Sidebar (an absolute-positioned overlay)
      has a sized parent to position itself against while Page fills the rest.
    */
    <View style={styles.root}>

      {/*
        Sidebar is an absolutely-positioned drawer overlay.
        It lives outside <Page> so it can render above every page layer,
        including the header and footer slots.
      */}
      <Sidebar />

      <Page
        scrollable
        /*
          safeArea={false} — AppHeader already applies useSafeAreaInsets().top
          internally, so letting Page also add paddingTop would double-pad the
          notch area. Bottom safe area is covered by paddingBottom in scrollContent.
        */
        safeArea={false}
        /*
          keyboardAware={false} — the home screen has no TextInput fields.
          Disabling KeyboardAvoidingView and the Keyboard.dismiss tap handler
          removes unnecessary layout overhead.
        */
        keyboardAware={false}
        backgroundColor={DESIGN_TOKENS.background_1}
        /*
          AppHeader passed as the fixed header slot — it stays pinned above the
          scroll area and handles its own safe-area top padding.
        */
        header={
          <AppHeader
            title="Mijoko"
            userInitials="KJ"
            onProfilePress={() => { }}
          />
        }
        /*
          padding={0} — each content section owns its own horizontal padding
          so the Page default (16px) would conflict with section-level gutters.
        */
        padding={0}
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

      </Page>
    </View>
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
