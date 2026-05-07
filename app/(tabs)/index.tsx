import Sidebar from '@/components/global/sidebar/sidebar';
import { SidebarButton } from '@/components/global/sidebar/sidebar-button';
import DishesDisplay from '@/components/interactive/dishes-display';
// eslint-disable-next-line import/no-named-as-default
import HomePageHero from '@/components/interactive/homeHeroComponent';
import ScrollableStatsStrip from '@/components/interactive/scrollable-stats';
import { SPACING } from '@/constants/themes/spacing';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {

  return (
    <View style={{ flex: 1 }}>
      <Sidebar />
      {/* ── Main content ─────────────────────────────────────────────────── */}
      <View style={styles.headerContainer}>
        {/* ── Dishes in a fixed-height box ─────────────────────────────── */}
        <SidebarButton />
        <HomePageHero
          name={"Frank"}
          isOpen
          restaurantName={"Mijoko"}
        />
        <ScrollableStatsStrip />
      </View>
      <View style={styles.dishesContainer}>
        <DishesDisplay />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Index container ──────────────────────────────────────────────────────
  dishesContainer: {
    width: "100%",
    paddingHorizontal: SPACING.sm,
    flex: 1,           // fills remaining screen height
    marginBottom: SPACING.lg,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerContainer: {
    width: "100%",
    height: "auto",        // ~60% of a typical screen
    padding: SPACING.lg,
    paddingTop: SPACING.giant
  }
});