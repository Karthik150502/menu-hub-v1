import Sidebar from '@/components/global/sidebar/sidebar';
import { useSidebar } from '@/components/global/sidebar/sidebar-context';
import DishesDisplay from '@/components/interactive/dishes-display';
import ScrollableStatsStrip from '@/components/interactive/scrollable-stats';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {

  const { openSidebar } = useSidebar();

  return (
    <View style={{ flex: 1 }}>
      <Sidebar />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <View style={styles.statsContainer}>
        {/* ── Dishes in a fixed-height box ─────────────────────────────── */}
        <ScrollableStatsStrip />
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openSidebar}
          activeOpacity={0.75}
        >
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 18 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
      </View>
      <View style={styles.dishesContainer}>
        <DishesDisplay />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  stepContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  menuButton: {
    alignSelf: 'flex-start',
    gap: SPACING.xs,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  menuLine: {
    height: 2,
    width: 24,
    backgroundColor: DESIGN_TOKENS.textPrimary,
    borderRadius: 2,
  },

  // ── Index container ──────────────────────────────────────────────────────
  dishesContainer: {
    width: "100%",
    padding: SPACING.sm,
    flex: 1,           // fills remaining screen height
    marginBottom: SPACING.lg,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsContainer: {
    width: "100%",
    height: "auto",        // ~60% of a typical screen
    borderRadius: 20,
    padding: SPACING.lg
  }
});