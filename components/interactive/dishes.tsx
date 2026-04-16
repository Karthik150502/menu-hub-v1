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

import { FONT_SIZES } from '@/constants/themes/font';

import { BANNER_HEIGHT, CARD_RADIUS, GAP, H_PADDING, MAX_CARD_W, MIN_CARD_W } from '@/constants/dimensions';

import { dishSplashIcon } from '@/constants/images';
import { SPACING } from '@/constants/themes/spacing';
import DishFormModal from './DishFormModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


function getColumns(screenWidth: number): number {
    const usable = screenWidth - H_PADDING * 2;
    return Math.max(1, Math.floor((usable + GAP) / (MIN_CARD_W + GAP)));
}

export interface Dish {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    available: boolean;
    imageUrl?: string;
    category: string;
    veg: boolean;
    showInMenu?: boolean;
    tag?: string;
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
    { key: 'edit', label: 'Edit Item', icon: 'create-outline' },
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
                        color={DESIGN_TOKENS.titleText}
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

    const bg = showInMenu
        ? DESIGN_TOKENS.menuBadgePositiveBg
        : DESIGN_TOKENS.menuBadgeNegativeBg;
    const border = showInMenu
        ? DESIGN_TOKENS.menuBadgePositiveBorder
        : DESIGN_TOKENS.menuBadgeNegativeBorder;
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
            <Ionicons name={icon as any} size={FONT_SIZES.xs} color={color} />
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
        onToggle?.(dish.id, val);
    };

    const bannerColors = [
        DESIGN_TOKENS.primaryAccent1,
        DESIGN_TOKENS.primaryAccent2,
    ];
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
                            <View style={[styles.decorCircle, styles.decorCircleLg, { borderColor: DESIGN_TOKENS.decorCircleStrong }]} />
                            <View style={[styles.decorCircle, styles.decorCircleSm, { borderColor: DESIGN_TOKENS.whiteFadeXs }]} />

                            {dish.tag && (
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>{dish.tag}</Text>
                                </View>
                            )}

                            {/* Menu visibility — bottom left of banner */}
                            <MenuVisibilityBadge showInMenu={dish.showInMenu ?? true} />

                            {/* Top-right: settings dropdown */}
                            <CardSettings
                                onEdit={() => setEditModalVisible(true)}
                                onInfo={() => { /* hook up an info sheet here */ }}
                                onDelete={() => onDelete?.(dish.id)}
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
                                    trackColor={{ false: DESIGN_TOKENS.switchTrackOff, true: DESIGN_TOKENS.subPositive }}
                                    ios_backgroundColor={DESIGN_TOKENS.switchTrackOff}
                                    thumbColor={DESIGN_TOKENS.primaryWhite}
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
                    key={dish.id}
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
        paddingTop: SPACING.md,
        paddingBottom: SPACING.xxl,
    },

    cardWrapper: { flexGrow: 1, flexShrink: 1, flexBasis: MIN_CARD_W, maxWidth: MAX_CARD_W },
    ghostCard: { flex: 1, borderRadius: CARD_RADIUS, backgroundColor: 'transparent' },

    card: {
        flex: 1,
        backgroundColor: DESIGN_TOKENS.cardBg,
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        shadowColor: DESIGN_TOKENS.shadowColor,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.cardBorder,
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
        backgroundColor: DESIGN_TOKENS.settingsBtnBg,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.whiteFadeSm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // ── Dropdown ──────────────────────────────────────────────────────────────
    dropdown: {
        position: 'absolute',
        minWidth: 160,
        backgroundColor: DESIGN_TOKENS.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.dropdownBorder,
        shadowColor: DESIGN_TOKENS.black,
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
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    dropdownLabel: {
        color: DESIGN_TOKENS.textOnGhost,
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
        letterSpacing: 0.1,
    },
    dropdownLabelDanger: {
        color: DESIGN_TOKENS.subNegativeDark
    },
    dropdownDivider: {
        height: 1,
        backgroundColor: DESIGN_TOKENS.divider,
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
        fontSize: FONT_SIZES.xs,
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

    tag: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: DESIGN_TOKENS.badgeBg,
        paddingHorizontal: SPACING.ssm,
        paddingVertical: SPACING.xs,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.whiteFadeSm,
    },
    tagText: { color: DESIGN_TOKENS.primaryWhite, fontSize: FONT_SIZES.xs, fontWeight: '700', letterSpacing: 0.6 },
    unavailableScrim: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: DESIGN_TOKENS.unavailableScrim,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unavailableText: { color: DESIGN_TOKENS.unavailableText, fontSize: FONT_SIZES.sm, fontWeight: '800', letterSpacing: 3 },

    infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.bg, gap: 12 },
    infoLeft: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' },
    dishName: { color: DESIGN_TOKENS.primaryWhite, fontSize: FONT_SIZES.lg, fontWeight: '700', letterSpacing: 0.1, flexShrink: 1 },
    categoryPill: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 999 },
    categoryText: { fontSize: FONT_SIZES.xs, fontWeight: '700', letterSpacing: 0.5, textTransform: 'capitalize' },
    dishDesc: { color: DESIGN_TOKENS.textLabel, fontSize: FONT_SIZES.xs, lineHeight: 17 },
    infoRight: { alignItems: 'flex-end', gap: 8 },
    price: { color: DESIGN_TOKENS.primaryWhite, fontSize: FONT_SIZES.lg, fontWeight: '800', letterSpacing: -0.5 },
    currencySymbol: { fontSize: FONT_SIZES.md, fontWeight: '700' },
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