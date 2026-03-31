import React, { useCallback, useRef } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface Dish {
    key: string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    color: string | [string, string];
    available: boolean;
    badge?: string;
    imageUrl?: string;
    category: string;
}

export interface DishListProps {
    dishes: Dish[];
    onToggleAvailability?: (key: string, newValue: boolean) => void;
    onDishPress?: (dish: Dish) => void;
    style?: ViewStyle;
}

// ─── Category colour map ──────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    starters: { bg: 'rgba(251,191,36,0.15)',  text: '#FBBF24' },
    mains:    { bg: 'rgba(249,115,22,0.15)',  text: '#F97316' },
    drinks:   { bg: 'rgba(59,130,246,0.15)',  text: '#60A5FA' },
    desserts: { bg: 'rgba(168,85,247,0.15)',  text: '#C084FC' },
    sides:    { bg: 'rgba(34,197,94,0.15)',   text: '#4ADE80' },
};
const DEFAULT_CAT = { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.5)' };

function getCategoryColor(category: string) {
    return CATEGORY_COLORS[category.toLowerCase()] ?? DEFAULT_CAT;
}

// ─── Animated Dish Card ───────────────────────────────────────────────────────

const DishCard: React.FC<{
    dish: Dish;
    index: number;
    onToggle?: (key: string, val: boolean) => void;
    onPress?: (dish: Dish) => void;
}> = ({ dish, index, onToggle, onPress }) => {
    const mountAnim = useRef(new Animated.Value(0)).current;
    const pressAnim = useRef(new Animated.Value(1)).current;
    const switchAnim = useRef(new Animated.Value(dish.available ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.spring(mountAnim, {
            toValue: 1,
            delay: index * 70,
            useNativeDriver: true,
            tension: 60,
            friction: 10,
        }).start();
    }, []);

    const onPressIn = () =>
        Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
    const onPressOut = () =>
        Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 5 }).start();

    const handleToggle = (val: boolean) => {
        Animated.spring(switchAnim, { toValue: val ? 1 : 0, useNativeDriver: false, speed: 20, bounciness: 8 }).start();
        onToggle?.(dish.key, val);
    };

    const bannerColors = Array.isArray(dish.color) ? dish.color : [dish.color, dish.color];
    const cardOpacity = switchAnim.interpolate({ inputRange: [0, 1], outputRange: [0.58, 1] });
    const catColor = getCategoryColor(dish.category);

    return (
        <Animated.View
            style={{
                opacity: Animated.multiply(
                    mountAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                    cardOpacity,
                ),
                transform: [
                    { scale: pressAnim },
                    { translateY: mountAnim.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) },
                ],
            }}
        >
            <TouchableOpacity
                onPress={() => onPress?.(dish)}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
                style={styles.card}
            >
                {/* ── Banner ── */}
                <View style={styles.bannerWrapper}>
                    <View style={[styles.banner, { backgroundColor: bannerColors[0] }]} />
                    {bannerColors[0] !== bannerColors[1] && (
                        <View style={[styles.banner, styles.bannerOverlay, { backgroundColor: bannerColors[1] }]} />
                    )}
                    <View style={[styles.decorCircle, styles.decorCircleLg, { borderColor: 'rgba(255,255,255,0.12)' }]} />
                    <View style={[styles.decorCircle, styles.decorCircleSm, { borderColor: 'rgba(255,255,255,0.08)' }]} />
                    {dish.badge && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{dish.badge}</Text>
                        </View>
                    )}
                    {!dish.available && (
                        <View style={styles.unavailableScrim}>
                            <Text style={styles.unavailableText}>UNAVAILABLE</Text>
                        </View>
                    )}
                </View>

                {/* ── Info row ── */}
                <View style={styles.infoRow}>
                    <View style={styles.infoLeft}>

                        {/* Name + category pill */}
                        <View style={styles.nameRow}>
                            <Text style={styles.dishName} numberOfLines={1}>{dish.name}</Text>
                            <View style={[styles.categoryPill, { backgroundColor: catColor.bg }]}>
                                <Text style={[styles.categoryText, { color: catColor.text }]}>
                                    {dish.category}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.dishDesc} numberOfLines={2}>{dish.description}</Text>
                    </View>

                    <View style={styles.infoRight}>
                        <Text style={styles.price}>
                            <Text style={styles.currencySymbol}>{dish.currency ?? '₹'}</Text>
                            {dish.price}
                        </Text>
                        <Switch
                            value={dish.available}
                            onValueChange={handleToggle}
                            trackColor={{ false: '#2E2E38', true: '#22C55E' }}
                            thumbColor="#fff"
                            ios_backgroundColor="#2E2E38"
                            style={styles.switch}
                        />
                    </View>
                </View>

                {/* Left accent bar */}
                <View style={[styles.accentBar, { backgroundColor: bannerColors[0] }]} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Main DishList ────────────────────────────────────────────────────────────

export const DishList: React.FC<DishListProps> = ({
    dishes,
    onToggleAvailability,
    onDishPress,
    style,
}) => {
    const renderItem = useCallback(
        ({ item, index }: { item: Dish; index: number }) => (
            <DishCard dish={item} index={index} onToggle={onToggleAvailability} onPress={onDishPress} />
        ),
        [onToggleAvailability, onDishPress],
    );

    return (
        <FlatList
            data={dishes}
            keyExtractor={(d) => d.key}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            style={[styles.list, style]}
        />
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_RADIUS = 20;
const BANNER_HEIGHT = 130;

const styles = StyleSheet.create({
    list: { flex: 1 },
    listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 14 },

    card: {
        backgroundColor: '#1C1C26',
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 10,
    },

    bannerWrapper: { height: BANNER_HEIGHT, overflow: 'hidden', position: 'relative' },
    banner: { ...StyleSheet.absoluteFillObject },
    bannerOverlay: {
        opacity: 0.5,
        transform: [{ skewX: '-20deg' }, { translateX: SCREEN_WIDTH * 0.4 }],
    },
    decorCircle: { position: 'absolute', borderWidth: 1, borderRadius: 999 },
    decorCircleLg: { width: 140, height: 140, bottom: -50, right: -30 },
    decorCircleSm: { width: 80, height: 80, top: -20, right: 60 },

    badge: {
        position: 'absolute',
        top: 12, left: 12,
        backgroundColor: 'rgba(0,0,0,0.38)',
        paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },

    unavailableScrim: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.52)',
        alignItems: 'center', justifyContent: 'center',
    },
    unavailableText: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '800', letterSpacing: 3 },

    infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
    infoLeft: { flex: 1 },

    // Name + pill on same line
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 3,
        flexWrap: 'wrap',
    },
    dishName: {
        color: '#F0F0F5',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.1,
        flexShrink: 1,
    },

    // Category pill
    categoryPill: {
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 999,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'capitalize',
    },

    dishDesc: { color: 'rgba(255,255,255,0.42)', fontSize: 12, lineHeight: 17 },
    infoRight: { alignItems: 'flex-end', gap: 8 },
    price: { color: '#ffffff', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
    currencySymbol: { fontSize: 14, fontWeight: '700' },
    switch: { transform: [{ scaleX: 0.88 }, { scaleY: 0.88 }] },

    accentBar: {
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 3,
        borderTopLeftRadius: CARD_RADIUS,
        borderBottomLeftRadius: CARD_RADIUS,
    },
});

export default DishList;