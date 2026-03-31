import Sidebar from '@/components/global/sidebar';
import { useSidebar } from '@/components/global/sidebar-context';
import { HelloWave } from '@/components/hello-wave';
import DishesDisplay from '@/components/interactive/dishes-display';
import ScrollableStatsStrip from '@/components/interactive/scrollable-stats';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function HomeScreen() {

  const { openSidebar } = useSidebar();

  return (
    <View style={{ flex: 1 }}>
      <Sidebar />
      {/* ── Main content ─────────────────────────────────────────────────── */}
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ScrollableStatsStrip />
        {/* ── Dishes in a fixed-height box ─────────────────────────────── */}
        <View style={styles.dishesContainer}>
          <DishesDisplay />
        </View>

        {/* Menu button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openSidebar}
          activeOpacity={0.75}
        >
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 18 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>

        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome user!</ThemedText>
          <HelloWave />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>
            Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see
            changes. Press{' '}
            <ThemedText type="defaultSemiBold">
              {Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'F12' })}
            </ThemedText>{' '}
            to open developer tools.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 2: Open the sidebar</ThemedText>
          <ThemedText>
            Tap the <ThemedText type="defaultSemiBold">☰ menu button</ThemedText> above or the
            button below to open the animated sidebar.
          </ThemedText>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={openSidebar}
            activeOpacity={0.8}
          >
            <Text style={styles.demoButtonText}>Open Sidebar ›</Text>
          </TouchableOpacity>
        </ThemedView>
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
    backgroundColor: '#63B3ED',
    borderRadius: 2,
  },
  demoButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#1A56DB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  demoButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // ── Dishes container ──────────────────────────────────────────────────────
  dishesContainer: {
    width:"99%",
    height: 460,        // ~60% of a typical screen
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden', // clips the FlatList scroll within rounded corners
  },
});