import { ALL_CATEGORY_ID, useCategories } from "@/hooks/use-categories";
import { BORDER_RADIUS } from "@/constants/themes/dimensions";
import { TYPOGRAPHY } from "@/constants/themes/font";
import { SPACING } from "@/constants/themes/spacing";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../custom/appText";
import { useBottomToast } from "../feedback/BottomToast";
import { SkeletonPill } from "../skeletons";
import { Dish } from "./dishes";

export interface Category {
    key: string;
    label: string;
    /** If undefined, shows all dishes */
    filter?: (dish: Dish) => boolean;
}

// ─── Animated filter chip ─────────────────────────────────────────────────────

const FilterChip: React.FC<{
    label: string;
    selected: boolean;
    onPress: () => void;
}> = ({ label, selected, onPress }) => {
    const pressAnim = useState(() => new Animated.Value(1))[0];

    const onPressIn = () =>
        Animated.spring(pressAnim, { toValue: 0.93, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
    const onPressOut = () =>
        Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

    return (
        <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
                style={[styles.chip, selected && styles.chipSelected]}
            >
                <View style={styles.chipInner}>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {label}
                    </Text>
                    {selected && (
                        <TouchableOpacity
                            onPress={onPress}
                            hitSlop={{ top: 6, bottom: 6, left: 4, right: 6 }}
                            style={styles.closeBtn}
                        >
                            <Ionicons name="close" size={16} color={DESIGN_TOKENS.textPrimary} />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Category filter bar ──────────────────────────────────────────────────────

// Varied widths so the loading row reads as label-shaped chips, not a uniform brick.
const SKELETON_CHIP_WIDTHS = [56, 84, 68, 96, 64];

const CategoryBar: React.FC<{
    selected: string[];
    onSelect: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ selected, onSelect }) => {
    const { info } = useBottomToast();
    const { data: categories, isLoading, isError, refetch } = useCategories();

    // "All" isn't a real category from the backend — it's UI-only logic for
    // "no filter" (see ALL_CATEGORY_ID). It's always known up front, so it
    // stays a real, interactive chip even while the rest are still loading —
    // only the fetched categories need a skeleton placeholder.
    const handlePress = (categoryId: string) => {
        const isSelected = selected.includes(categoryId);
        onSelect(prev => {
            if (isSelected) {
                if (prev.length === 1) {
                    info('Atleast select one category');
                    return prev;
                }
                return prev.filter(key => key !== categoryId)
            } else {
                if (selected.includes(ALL_CATEGORY_ID) && categoryId !== ALL_CATEGORY_ID) {
                    return [...prev.filter(key => key !== ALL_CATEGORY_ID), categoryId]
                }
                if (categoryId === ALL_CATEGORY_ID) {
                    return [categoryId]
                }
                return [...prev, categoryId]
            }
        });
    };

    if (isError) {
        return (
            <TouchableOpacity style={styles.retryChip} onPress={() => refetch()}>
                <Ionicons name="refresh" size={14} color={DESIGN_TOKENS.textLabel} />
                <Text style={styles.retryText}>Couldn&apos;t load categories — tap to retry</Text>
            </TouchableOpacity>
        );
    }

    return <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.barContent}
        style={styles.bar}
    >
        <FilterChip
            label="All"
            selected={selected.includes(ALL_CATEGORY_ID)}
            onPress={() => handlePress(ALL_CATEGORY_ID)}
        />

        {isLoading
            ? SKELETON_CHIP_WIDTHS.map((width, i) => (
                <SkeletonPill key={i} width={width} height={36} />
            ))
            : categories?.map((cat) => (
                <FilterChip
                    key={cat.id}
                    label={cat.label}
                    selected={selected.includes(cat.id)}
                    onPress={() => handlePress(cat.id)}
                />
            ))}
    </ScrollView>
}


const ACCENT = DESIGN_TOKENS.accentDefault;

const styles = StyleSheet.create({
    // ── Filter bar ────────────────────────────────────────────────────────────
    bar: {
        flexGrow: 0,
        flexShrink: 0,
    },
    barContent: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.ssm,
        gap: SPACING.sm,
        flexDirection: "row",
        alignItems: "center",
    },

    // ── Chips ─────────────────────────────────────────────────────────────────
    chip: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: DESIGN_TOKENS.cardBg,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.cardBorder,
    },
    chipSelected: {
        backgroundColor: ACCENT,
        borderColor: ACCENT,
        shadowColor: ACCENT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 8,
        elevation: 6,
    },
    chipInner: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
    },
    closeBtn: {
        justifyContent: "center",
        alignItems: "center",
    },
    chipText: {
        color: DESIGN_TOKENS.textLabel,
        ...TYPOGRAPHY.body
    },
    chipTextSelected: {
        color: DESIGN_TOKENS.textPrimary,
    },

    // ── Error state ───────────────────────────────────────────────────────────
    retryChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
        marginHorizontal: SPACING.md,
        marginVertical: SPACING.ssm,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: DESIGN_TOKENS.cardBg,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.cardBorder,
        alignSelf: "flex-start",
    },
    retryText: {
        color: DESIGN_TOKENS.textLabel,
        ...TYPOGRAPHY.bodySmall,
    },
});

export default CategoryBar;