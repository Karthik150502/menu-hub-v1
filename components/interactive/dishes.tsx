import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    LayoutChangeEvent,
    Modal,
    Pressable,
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
// eslint-disable-next-line import/no-named-as-default
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
    onDishDelete?: (key: string) => void;
    style?: ViewStyle;
}

// ─── Card settings dropdown ───────────────────────────────────────────────────

interface DropdownItem {
    key: string;
    label: string;
    icon: string;
    danger?: boolean;
}

const DROPDOWN_ITEMS: DropdownItem[] = [
    { key: 'edit', label: 'Edit Dish', icon: 'create-outline' },
    { key: 'info', label: 'Info', icon: 'information-circle-outline' },
    { key: 'delete', label: 'Delete', icon: 'trash-outline', danger: true },
];

interface CardSettingsProps {
    onEdit: () => void;
    onInfo: () => void;
    onDelete: () => void;
}

const CardSettings: React.FC<CardSettingsProps> = ({ onEdit, onInfo, onDelete }) => {
    const [open, setOpen] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const dropdownAnim = useRef(new Animated.Value(0)).current;
    const btnRef = useRef<View>(null);
    const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0 });

    const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.88, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
    const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

    const openDropdown = () => {
        btnRef.current?.measureInWindow((x, y, width, height) => {
            setAnchor({ x, y: y + height + 4, width });
            setOpen(true);
            dropdownAnim.setValue(0);
            Animated.timing(dropdownAnim, {
                toValue: 1,
                duration: 180,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        });
    };

    const closeDropdown = () => {
        Animated.timing(dropdownAnim, {
            toValue: 0,
            duration: 130,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
        }).start(() => setOpen(false));
    };

    const handleSelect = (key: string) => {
        closeDropdown();
        // Small delay so close animation plays before action
        setTimeout(() => {
            if (key === 'edit') onEdit();
            if (key === 'info') onInfo();
            if (key === 'delete') onDelete();
        }, 250);
    };

    const dropdownStyle = {
        opacity: dropdownAnim,
        transform: [
            {
                translateY: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-8, 0],
                }),
            },
            {
                scale: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                }),
            },
        ],
    };

    return (
        <>
            {/* Settings button */}
            <Animated.View
                ref={btnRef as any}
                style={[styles.settingsBtnWrap, { transform: [{ scale: scaleAnim }] }]}
            >
                <TouchableOpacity
                    onPress={open ? closeDropdown : openDropdown}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    activeOpacity={1}
                    style={styles.settingsBtn}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                    <Ionicons
                        name={open ? 'close' : "options-outline"}
                        size={15}
                        color="rgba(255,255,255,0.75)"
                    />
                </TouchableOpacity>
            </Animated.View>

            {/* Dropdown rendered in a Modal so it escapes card overflow:hidden */}
            {open && (
                <Modal transparent animationType="none" onRequestClose={closeDropdown}>
                    {/* Backdrop — tap outside to close */}
                    <Pressable style={StyleSheet.absoluteFill} onPress={closeDropdown} />

                    <Animated.View
                        style={[
                            styles.dropdown,
                            dropdownStyle,
                            { top: anchor.y, right: SCREEN_WIDTH - anchor.x - anchor.width },
                        ]}
                    >
                        {DROPDOWN_ITEMS.map((item, i) => (
                            <React.Fragment key={item.key}>
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => handleSelect(item.key)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.dropdownLabel,
                                        item.danger && styles.dropdownLabelDanger,
                                    ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                                {/* Divider between items, not after last */}
                                {i < DROPDOWN_ITEMS.length - 1 && (
                                    <View style={styles.dropdownDivider} />
                                )}
                            </React.Fragment>
                        ))}
                    </Animated.View>
                </Modal>
            )}
        </>
    );
};

// ─── Menu visibility badge ────────────────────────────────────────────────────

const MenuVisibilityBadge: React.FC<{ showInMenu: boolean }> = ({ showInMenu }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

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
    onDelete?: (key: string) => void;
}> = ({ dish, index, onLayout, onToggle, onPress, onEdit, onDelete }) => {
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
                            <Image source={dishSplashIcon} style={styles.banner} />
                            <View style={[styles.decorCircle, styles.decorCircleLg, { borderColor: 'rgba(255,255,255,0.12)' }]} />
                            <View style={[styles.decorCircle, styles.decorCircleSm, { borderColor: 'rgba(255,255,255,0.08)' }]} />

                            {dish.badge && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{dish.badge}</Text>
                                </View>
                            )}

                            {/* Menu visibility — bottom left of banner */}
                            <MenuVisibilityBadge showInMenu={dish.showInMenu ?? true} />

                            {/* Top-right: settings dropdown */}
                            <CardSettings
                                onEdit={() => setEditModalVisible(true)}
                                onInfo={() => { /* hook up an info sheet here */ }}
                                onDelete={() => onDelete?.(dish.key)}
                            />

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
    dishes, onToggleAvailability, onDishPress, onDishEdit, onDishDelete, style,
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
                    onDelete={onDishDelete}
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
        backgroundColor: DESIGN_TOKENS.cardBg,
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        shadowColor: '#000',
        borderWidth: 0.25,
        borderColor: "#ffffff41",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 10,
    },

    // ── Settings button ────────────────────────────────────────────────────────
    settingsBtnWrap: { position: 'absolute', top: 6, right: 6 },
    settingsBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // ── Dropdown ──────────────────────────────────────────────────────────────
    dropdown: {
        position: 'absolute',
        minWidth: 160,
        backgroundColor: '#1E1E2A',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.55,
        shadowRadius: 20,
        elevation: 20,
        overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    dropdownLabel: {
        color: 'rgba(255,255,255,0.82)',
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.1,
    },
    dropdownLabelDanger: {
        color: '#F87171',
    },
    dropdownDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginHorizontal: 12,
    },

    // ── Menu visibility badge ──────────────────────────────────────────────────
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