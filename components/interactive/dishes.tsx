import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    LayoutChangeEvent,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
    useWindowDimensions,
} from 'react-native';
import dishSplashIcon from "../../assets/images/web/dish/dish-splash-icon.png";

import { Image } from 'expo-image';
import DishFormModal from './DishFormModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const H_PADDING = 8;
const GAP = 16;
const MIN_CARD_W = 260;
const MAX_CARD_W = 520;
const CARD_RADIUS = 20;
const BANNER_HEIGHT = 130;

function getColumns(screenWidth: number): number {
    const usable = screenWidth - H_PADDING * 2;
    return Math.max(1, Math.floor((usable + GAP) / (MIN_CARD_W + GAP)));
}

export interface Dish {
    key: string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    available: boolean;
    badge?: string;
    imageUrl?: string;
    category: string;
    veg: boolean;
    showInMenu?: boolean;
}

export interface DishListProps {
    dishes: Dish[];
    onToggleAvailability?: (key: string, newValue: boolean) => void;
    onDishPress?: (dish: Dish) => void;
    onDishEdit?: (updated: Dish) => void;
    style?: ViewStyle;
}

// ─── Edit icon ────────────────────────────────────────────────────────────────

const EditIcon: React.FC<{ onPress: () => void }> = ({ onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.88, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
    const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

    return (
        <Animated.View style={[styles.editBtnWrap, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
                style={styles.editBtn}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
                <Text style={styles.editBtnText}>✎</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Menu visibility badge ────────────────────────────────────────────────────
// Shows in the bottom-left of the banner.
// Green eye = visible in menu | Red eye-off = hidden from menu

const MenuVisibilityBadge: React.FC<{ showInMenu: boolean }> = ({ showInMenu }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Subtle pulse when hidden to draw attention
    React.useEffect(() => {
        if (!showInMenu) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 0.6, duration: 900, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
        }
    }, [showInMenu]);

    const bg = showInMenu ? 'rgba(0,255,13,0.15)' : 'rgba(255,0,0,0.15)';
    const border = showInMenu ? 'rgba(0,255,13,0.35)' : 'rgba(255,0,0,0.35)';
    const color = showInMenu ? DESIGN_TOKENS.subPositive : DESIGN_TOKENS.subNegative;
    const icon = showInMenu ? 'eye-outline' : 'eye-off-outline';
    const label = showInMenu ? 'In Menu' : 'Hidden';

    return (
        <Animated.View
            style={[
                styles.menuBadge,
                { backgroundColor: bg, borderColor: border, opacity: pulseAnim },
            ]}
        >
            <Ionicons name={icon as any} size={11} color={color} />
            <Text style={[styles.menuBadgeText, { color }]}>{label}</Text>
        </Animated.View>
    );
};

// ─── Dish Card ────────────────────────────────────────────────────────────────

const DishCard: React.FC<{
    dish: Dish;
    index: number;
    onLayout?: (e: LayoutChangeEvent) => void;
    onToggle?: (key: string, val: boolean) => void;
    onPress?: (dish: Dish) => void;
    onEdit?: (updated: Dish) => void;
}> = ({ dish, index, onLayout, onToggle, onPress, onEdit }) => {
    const mountAnim = useRef(new Animated.Value(0)).current;
    const pressAnim = useRef(new Animated.Value(1)).current;
    const switchAnim = useRef(new Animated.Value(dish.available ? 1 : 0)).current;
    const [editModalVisible, setEditModalVisible] = useState(false);

    React.useEffect(() => {
        Animated.spring(mountAnim, {
            toValue: 1, delay: index * 70,
            useNativeDriver: true, tension: 60, friction: 10,
        }).start();
    }, []);

    const onPressIn = () => Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
    const onPressOut = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 5 }).start();

    const handleToggle = (val: boolean) => {
        Animated.spring(switchAnim, { toValue: val ? 1 : 0, useNativeDriver: false, speed: 20, bounciness: 8 }).start();
        onToggle?.(dish.key, val);
    };

    const bannerColors = ["#440246", "#650368"];
    const switchOpacity = switchAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });

    return (
        <>
            <Animated.View style={[styles.cardWrapper, { opacity: switchOpacity }]} onLayout={onLayout}>
                <Animated.View style={{
                    flex: 1,
                    opacity: mountAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                    transform: [
                        { scale: pressAnim },
                        { translateY: mountAnim.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) },
                    ],
                }}>
                    <TouchableOpacity
                        onPress={() => onPress?.(dish)}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        activeOpacity={1}
                        style={styles.card}
                    >
                        {/* ── Banner ── */}
                        <View style={styles.bannerWrapper}>
                            {/* <View style={[styles.banner, { backgroundColor: bannerColors[0] }]} />
                            {bannerColors[0] !== bannerColors[1] && (
                                <View style={[styles.banner, styles.bannerOverlay, { backgroundColor: bannerColors[1] }]} />
                            )} */}
                            <Image source={dishSplashIcon} style={[styles.banner]} />
                            <View style={[styles.decorCircle, styles.decorCircleLg, { borderColor: 'rgba(255,255,255,0.12)' }]} />
                            <View style={[styles.decorCircle, styles.decorCircleSm, { borderColor: 'rgba(255,255,255,0.08)' }]} />

                            {dish.badge && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{dish.badge}</Text>
                                </View>
                            )}

                            {/* Menu visibility — bottom left of banner */}
                            <MenuVisibilityBadge showInMenu={dish.showInMenu ?? true} />

                            {/* Edit — top right of banner */}
                            <EditIcon onPress={() => setEditModalVisible(true)} />

                            {!dish.available && (
                                <View style={styles.unavailableScrim}>
                                    <Text style={styles.unavailableText}>UNAVAILABLE</Text>
                                </View>
                            )}
                        </View>

                        {/* ── Info row ── */}
                        <View style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.dishName} numberOfLines={1}>{dish.name}</Text>
                                    <View style={[
                                        styles.categoryPill,
                                        { backgroundColor: dish.veg ? DESIGN_TOKENS.subPositiveDarkFade : DESIGN_TOKENS.subNegativeDarkFade },
                                    ]}>
                                        <Text style={[styles.categoryText, { color: DESIGN_TOKENS.titleText }]}>
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
                                    trackColor={{ false: '#2E2E38', true: DESIGN_TOKENS.subPositive }}
                                    thumbColor="#fff"
                                    ios_backgroundColor="#2E2E38"
                                    style={styles.switch}
                                />
                            </View>
                        </View>

                        <View style={[styles.accentBar, { backgroundColor: bannerColors[0] }]} />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            <DishFormModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                defaultValues={dish}
                onSubmit={(updatedDish) => {
                    onEdit?.({ ...dish, ...updatedDish });
                    setEditModalVisible(false);
                }}
            />
        </>
    );
};

// ─── DishList ─────────────────────────────────────────────────────────────────

export const DishList: React.FC<DishListProps> = ({
    dishes, onToggleAvailability, onDishPress, onDishEdit, style,
}) => {
    const { width: screenWidth } = useWindowDimensions();
    const columns = getColumns(screenWidth);
    const remainder = dishes.length % columns;
    const ghostCount = remainder === 0 ? 0 : columns - remainder;

    const [cardHeight, setCardHeight] = useState<number | null>(null);
    const measured = useRef(false);

    const onFirstCardLayout = useCallback((e: LayoutChangeEvent) => {
        if (!measured.current) {
            measured.current = true;
            setCardHeight(e.nativeEvent.layout.height);
        }
    }, []);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.grid}
            style={[styles.list, style]}
        >
            {dishes.map((dish, index) => (
                <DishCard
                    key={dish.key}
                    dish={dish}
                    index={index}
                    onLayout={index === 0 ? onFirstCardLayout : undefined}
                    onToggle={onToggleAvailability}
                    onPress={onDishPress}
                    onEdit={onDishEdit}
                />
            ))}

            {cardHeight !== null && Array.from({ length: ghostCount }).map((_, i) => (
                <View key={`ghost-${i}`} style={[styles.cardWrapper, { height: cardHeight }]}>
                    <View style={[styles.ghostCard, { height: cardHeight }]} />
                </View>
            ))}
        </ScrollView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    list: { flex: 1 },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
        paddingHorizontal: H_PADDING,
        paddingTop: 12,
        paddingBottom: 24,
    },

    cardWrapper: { flexGrow: 1, flexShrink: 1, flexBasis: MIN_CARD_W, maxWidth: MAX_CARD_W },
    ghostCard: { flex: 1, borderRadius: CARD_RADIUS, backgroundColor: 'transparent' },

    card: {
        flex: 1,
        backgroundColor: '#1C1C26',
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 10,
    },

    // Edit button
    editBtnWrap: { position: 'absolute', top: 6, right: 6 },
    editBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.40)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editBtnText: { color: '#fff', fontSize: 16, lineHeight: 20 },

    // ── Menu visibility badge ─────────────────────────────────────────────────
    menuBadge: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    menuBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.4,
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
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.38)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
    unavailableScrim: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.52)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unavailableText: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '800', letterSpacing: 3 },

    infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
    infoLeft: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' },
    dishName: { color: '#F0F0F5', fontSize: 16, fontWeight: '700', letterSpacing: 0.1, flexShrink: 1 },
    categoryPill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
    categoryText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'capitalize' },
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