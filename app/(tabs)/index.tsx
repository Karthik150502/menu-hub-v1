import Sidebar from '@/components/global/sidebar';
import { useSidebar } from '@/components/global/sidebar-context';
import DishesDisplay from '@/components/interactive/dishes-display';
import ScrollableStatsStrip from '@/components/interactive/scrollable-stats';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';


export default function HomeScreen() {

  const { openSidebar } = useSidebar();

  return (
    <View style={{ flex: 1 }}>
      <Sidebar />
      {/* ── Main content ─────────────────────────────────────────────────── */}
      <ParallaxScrollView
        headerBackgroundColor={{ light: Colors.light.headerBackgroundColor, dark: Colors.dark.headerBackgroundColor }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
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

        {/* ── Dishes in a fixed-height box ─────────────────────────────── */}
        <View style={styles.dishesContainer}>
          <DishesDisplay />
        </View>


      </ParallaxScrollView>
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

  // ── Dishes container ──────────────────────────────────────────────────────
  dishesContainer: {
    width: "100%",
    height: 580,        // ~60% of a typical screen
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden', // clips the FlatList scroll within rounded corners
  },
});