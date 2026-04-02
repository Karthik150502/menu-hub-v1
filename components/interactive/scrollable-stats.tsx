import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
// eslint-disable-next-line import/no-named-as-default
import StatStrip, { StatCard } from "../stat-strip";


// ─── Mock data fetcher (replace with real API call) ─────────────────────
function generateStats(): StatCard[] {
    return [
        {
            key: 'orders',
            label: 'Orders Today',
            value: Math.floor(Math.random() * 600 + 200),
            subValue: `↑ ${Math.floor(Math.random() * 20 + 1)}% vs yesterday`,
            trend: 'positive',
            onPress: () => console.log('Orders tapped'),
        },
        {
            key: 'revenue',
            label: "Today's Revenue",
            value: `₹ ${(Math.random() * 100000 + 50).toFixed(2)}`,
            subValue: `↑ ${Math.floor(Math.random() * 15 + 1)}%`,
            trend: 'positive',
            onPress: () => console.log('Revenue tapped'),
        },
        {
            key: 'returns',
            label: 'Returns',
            value: Math.floor(Math.random() * 20),
            subValue: `↓ ${Math.floor(Math.random() * 5 + 1)}% vs avg`,
            trend: 'negative',
        },
        {
            key: 'customers',
            label: 'New Customers',
            value: Math.floor(Math.random() * 80 + 10),
            subValue: 'This week',
            trend: 'neutral',
        },
        {
            key: 'rating',
            label: 'Avg Rating',
            value: (Math.random() * 1 + 4).toFixed(1),
            subValue: '★★★★★',
            trend: 'positive',
        },
    ];
}

const ScrollableStatsStrip = () => {

    const [stats, setStats] = useState<StatCard[]>(generateStats);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate network call — replace with your actual fetch
        setTimeout(() => {
            setStats(generateStats());
            setRefreshing(false);
        }, 900);
    }, []);

    return <StatStrip
        title="Live Stats"
        cards={stats}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        cardWidth={148}
        cardHeight={108}
        style={styles.strip}
    />
}

const styles = StyleSheet.create({
    reactLogo: { height: 178, width: 290, bottom: 0, left: 0, position: 'absolute' },
    titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    stepContainer: { gap: 8, marginBottom: 8, marginTop: 8 },
    strip: {
        marginHorizontal: -16, // bleed to screen edges
        marginBottom: 8,
    },
});


export default ScrollableStatsStrip;