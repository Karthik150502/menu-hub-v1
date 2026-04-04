import Sidebar from '@/components/global/sidebar/sidebar';
import { useSidebar } from '@/components/global/sidebar/sidebar-context';
import DishesDisplay from '@/components/interactive/dishes-display';
import ScrollableStatsStrip from '@/components/interactive/scrollable-stats';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {

  const { openSidebar } = useSidebar();

  return (
    <View style={{ flex: 1 }}>
      <Sidebar />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openSidebar}
          activeOpacity={0.75}
        >
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 18 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        {/* ── Dishes in a fixed-height box ─────────────────────────────── */}
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
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  menuButton: {
    alignSelf: 'flex-start',
    gap: 5,
    padding: 8,
    marginBottom: 4,
  },
  menuLine: {
    height: 2,
    width: 24,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },

  // ── Index container ──────────────────────────────────────────────────────
  dishesContainer: {
    width: "100%",
    padding: 8,
    flex: 1,           // fills remaining screen height
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsContainer: {
    width: "100%",
    height: "auto",        // ~60% of a typical screen
    borderRadius: 20,
    padding: 16
  }
});