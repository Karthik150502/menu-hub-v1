import { FONT_SIZES } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useRef } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';


const T = {
    bg: DESIGN_TOKENS.background_1,
    cardBg: DESIGN_TOKENS.cardBg,
    cardBorder: DESIGN_TOKENS.cardBorder,
    label: DESIGN_TOKENS.textLabel,
    value: DESIGN_TOKENS.primaryWhite,
    subPositive: DESIGN_TOKENS.subPositive,
    subNegative: DESIGN_TOKENS.subNegative,
    subNeutral: DESIGN_TOKENS.subNeutral,
    accentDefault: DESIGN_TOKENS.accentDefault,
    refreshIcon: DESIGN_TOKENS.subNeutral,
    title: DESIGN_TOKENS.titleText,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatCard {
    /** Unique key */
    key: string;
    /** Label shown above the value */
    label: string;
    /** The primary value to display */
    value: string | number;
    /** Optional secondary line (e.g. "↑ 12% vs yesterday") */
    subValue?: string;
    /** Positive = green tint, negative = red tint, neutral = default */
    trend?: 'positive' | 'negative' | 'neutral';
    /** Optional accent colour override for the card's top border */
    accentColor?: string;
    /** Called when the card is tapped */
    onPress?: () => void;
}

export interface StatStripProps {
    /** Array of stat cards to render */
    cards: StatCard[];
    /** Section title shown above the strip */
    title?: string;
    /** Called when the refresh icon is tapped */
    onRefresh?: () => void;
    /** Whether a refresh is in progress (spins the icon) */
    refreshing?: boolean;
    /** Width of each card. Defaults to 140 */
    cardWidth?: number;
    /** Height of each card. Defaults to 100 */
    cardHeight?: number;
    /** Container style override */
    style?: ViewStyle;
}

// ─── StatCard component ───────────────────────────────────────────────────────

const StatCardItem: React.FC<{ card: StatCard; width: number; height: number }> = ({
    card,
    width,
    height,
}) => {
    const pressAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () =>
        Animated.spring(pressAnim, { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 0 }).start();

    const onPressOut = () =>
        Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

    const subColor =
        card.trend === 'positive'
            ? T.subPositive
            : card.trend === 'negative'
                ? T.subNegative
                : T.subNeutral;
    ;

    return (
        <Animated.View style={[{ transform: [{ scale: pressAnim }] }]}>
            <TouchableOpacity
                onPress={card.onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
            >
                <View
                    style={[
                        styles.card,
                        { width, height, borderTopColor: T.accentDefault },
                    ]}
                >
                    <Text style={styles.cardLabel} numberOfLines={1}>
                        {card.label}
                    </Text>
                    <Text style={styles.cardValue} numberOfLines={1} adjustsFontSizeToFit>
                        {card.value}
                    </Text>
                    {card.subValue ? (
                        <Text style={[styles.cardSub, { color: subColor }]} numberOfLines={1}>
                            {card.subValue}
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Refresh button ───────────────────────────────────────────────────────────

const RefreshButton: React.FC<{ onPress?: () => void; spinning: boolean }> = ({
    onPress,
    spinning,
}) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const animRef = useRef<Animated.CompositeAnimation | null>(null);

    React.useEffect(() => {
        if (spinning) {
            rotation.setValue(0);
            animRef.current = Animated.loop(
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
            );
            animRef.current.start();
        } else {
            animRef.current?.stop();
        }
    }, [spinning, rotation]);

    const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
        <TouchableOpacity onPress={onPress} style={styles.refreshBtn} activeOpacity={0.7}>
            <Animated.Text style={[styles.refreshIcon, { transform: [{ rotate }] }]}>↻</Animated.Text>
        </TouchableOpacity>
    );
};

// ─── Main StatStrip ───────────────────────────────────────────────────────────

export const StatStrip: React.FC<StatStripProps> = ({
    cards,
    title,
    onRefresh,
    refreshing = false,
    cardWidth = 140,
    cardHeight = 100,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            {/* Header row */}
            {(title || onRefresh) && (
                <View style={styles.header}>
                    {title ? <Text style={styles.title}>{title}</Text> : <View />}
                    {onRefresh && <RefreshButton onPress={onRefresh} spinning={refreshing} />}
                </View>
            )}

            {/* Horizontal scroll strip */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.strip, { paddingRight: SPACING.lg }]}
                decelerationRate="fast"
                snapToInterval={cardWidth + 10}
                snapToAlignment="start"
            >
                {cards.map((card) => (
                    <StatCardItem
                        key={card.key}
                        card={card}
                        width={cardWidth}
                        height={cardHeight}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        backgroundColor: T.bg,
        paddingVertical: SPACING.lg
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.bg,
        paddingBottom: SPACING.ssm,
    },
    title: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
        letterSpacing: 1.6,
        color: T.title,
        textTransform: 'uppercase',
    },
    refreshBtn: {
        padding: SPACING.xs,
    },
    refreshIcon: {
        fontSize: FONT_SIZES.xxl,
        color: T.refreshIcon,
        lineHeight: 24,
    },

    // Strip
    strip: {
        paddingLeft: SPACING.lg,
        gap: 10,
        alignItems: 'flex-start',
    },

    // Card
    card: {
        backgroundColor: T.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: T.cardBorder,
        borderTopWidth: 2,
        paddingHorizontal: SPACING.bg,
        paddingVertical: SPACING.bg,
        justifyContent: 'space-between',
        // shadow
        shadowColor: DESIGN_TOKENS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    cardLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        letterSpacing: 0.8,
        color: T.label,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    cardValue: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '500',
        color: T.value,
        letterSpacing: -0.5,
        flex: 1,
    },
    cardSub: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '500',
        marginTop: 4,
    },
});

export default StatStrip;