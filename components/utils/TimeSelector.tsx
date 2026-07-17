import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { FONT_SIZES, FONT_WEIGHTS, TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import Text from '../custom/appText';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimeSelectorProps {
    label: string;
    hour12: string;
    onHour12Change: (v: string) => void;
    minute: string;
    onMinuteChange: (v: string) => void;
    ampm: 'AM' | 'PM';
    onAmpmToggle: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

// ─── Scroll picker ────────────────────────────────────────────────────────────

const ITEM_H = DIMENSIONS.scrollPickerItemH;

const ScrollPicker: React.FC<{
    items: string[];
    selected: string;
    onSelect: (v: string) => void;
}> = ({ items, selected, onSelect }) => {
    const scrollRef = useRef<ScrollView>(null);
    const initialIdx = items.indexOf(selected);
    const [centerIdx, setCenterIdx] = useState(initialIdx);

    useEffect(() => {
        scrollRef.current?.scrollTo({ y: Math.max(0, initialIdx) * ITEM_H, animated: false });
    }, []);

    const resolveIdx = (y: number) =>
        Math.max(0, Math.min(Math.round(y / ITEM_H), items.length - 1));

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const newIdx = resolveIdx(e.nativeEvent.contentOffset.y);
        setCenterIdx(prev => (prev !== newIdx ? newIdx : prev));
    };

    const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const newIdx = resolveIdx(e.nativeEvent.contentOffset.y);
        setCenterIdx(newIdx);
        onSelect(items[newIdx]);
    };

    return (
        <View style={sp.wrap}>
            <View style={sp.highlight} pointerEvents="none" />
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_H}
                decelerationRate="fast"
                scrollEventThrottle={16}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleScrollEnd}
                onScrollEndDrag={handleScrollEnd}
            >
                <View style={{ height: ITEM_H }} />
                {items.map((item, i) => (
                    <View key={item} style={sp.item}>
                        <Text style={[sp.itemText, i === centerIdx && sp.itemTextActive]}>
                            {item}
                        </Text>
                    </View>
                ))}
                <View style={{ height: ITEM_H }} />
            </ScrollView>
        </View>
    );
};

const sp = StyleSheet.create({
    wrap: {
        height: ITEM_H * 3,
        width: DIMENSIONS.scrollPickerW,
        overflow: 'hidden',
        position: 'relative',
    },
    highlight: {
        position: 'absolute',
        top: ITEM_H,
        left: 0,
        right: 0,
        height: ITEM_H,
        backgroundColor: DESIGN_TOKENS.primaryTint,
        borderRadius: BORDER_RADIUS.base,
        zIndex: 1,
        pointerEvents: 'none',
    },
    item: {
        height: ITEM_H,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: FONT_SIZES.mdx,
        fontWeight: FONT_WEIGHTS.medium,
        color: DESIGN_TOKENS.textTertiary,
    },
    itemTextActive: {
        color: DESIGN_TOKENS.textPrimary,
        fontWeight: FONT_WEIGHTS.bold,
        fontSize: FONT_SIZES.base,
    },
});

// ─── TimeSelector ─────────────────────────────────────────────────────────────

const TimeSelector: React.FC<TimeSelectorProps> = ({
    label,
    hour12,
    onHour12Change,
    minute,
    onMinuteChange,
    ampm,
    onAmpmToggle,
}) => (
    <View style={styles.row}>
        <View style={styles.left}>
            <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.right}>
            <ScrollPicker items={HOURS_12} selected={hour12} onSelect={onHour12Change} />
            <Text style={styles.sep}>:</Text>
            <ScrollPicker items={MINUTES} selected={minute} onSelect={onMinuteChange} />
            <TouchableOpacity
                onPress={onAmpmToggle}
                style={styles.ampmBtn}
                accessibilityLabel={`Toggle AM PM, currently ${ampm}`}
            >
                <Text style={styles.ampmText}>{ampm}</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderTopWidth: DIMENSIONS.borderWidthBase,
        borderTopColor: DESIGN_TOKENS.borderFaint,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    label: {
        color: DESIGN_TOKENS.textSubtle,
        ...TYPOGRAPHY.body
    },
    sep: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: DESIGN_TOKENS.textSectionTitle,
    },
    ampmBtn: {
        backgroundColor: DESIGN_TOKENS.primaryFaint,
        borderWidth: DIMENSIONS.borderWidthBase,
        borderColor: DESIGN_TOKENS.primaryBorderLight,
        borderRadius: BORDER_RADIUS.base,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xsm,
        marginLeft: SPACING.xs,
    },
    ampmText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.bold,
        color: DESIGN_TOKENS.primaryBright,
    },
});

export default TimeSelector;
