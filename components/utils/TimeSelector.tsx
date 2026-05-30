import { TYPOGRAPHY } from '@/constants/themes/font';
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

const ITEM_H = 36;

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
        width: 60,
        overflow: 'hidden',
        position: 'relative',
    },
    highlight: {
        position: 'absolute',
        top: ITEM_H,
        left: 0,
        right: 0,
        height: ITEM_H,
        backgroundColor: 'rgba(148,0,171,0.14)',
        borderRadius: 8,
        zIndex: 1,
        pointerEvents: 'none',
    },
    item: {
        height: ITEM_H,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 15,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.35)',
    },
    itemTextActive: {
        color: DESIGN_TOKENS.textPrimary,
        fontWeight: '700',
        fontSize: 17,
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
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
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
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.30)',
    },
    ampmBtn: {
        backgroundColor: 'rgba(148,0,171,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(148,0,171,0.30)',
        borderRadius: 8,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs + 2,
        marginLeft: SPACING.xs,
    },
    ampmText: {
        fontSize: 12,
        fontWeight: '700',
        color: DESIGN_TOKENS.primaryBright,
    },
});

export default TimeSelector;
