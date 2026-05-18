import { CATEGORIES } from "@/constants/mock-data";
import { BORDER_RADIUS } from "@/constants/themes/dimensions";
import { TYPOGRAPHY } from "@/constants/themes/font";
import { SPACING } from "@/constants/themes/spacing";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../custom/appText";
import { useBottomToast } from "../feedback/BottomToast";
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
    const pressAnim = useRef(new Animated.Value(1)).current;

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

const CategoryBar: React.FC<{
    selected: string[];
    onSelect: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ selected, onSelect }) => {
    const { info } = useBottomToast();

    return <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.barContent}
        style={styles.bar}
    >
        {CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat.key)

            return <FilterChip
                key={cat.key}
                label={cat.label}
                selected={isSelected}
                onPress={() => onSelect(prev => {
                    if (isSelected) {
                        if (prev.length === 1) {
                            info('Atleast select one category');
                            return prev;
                        }
                        return prev.filter(key => key !== cat.key)
                    } else {
                        if (selected.includes("all") && cat.key !== "all") {
                            return [...prev.filter(key => key !== "all"), cat.key]
                        }
                        if (cat.key === "all") {
                            return [cat.key]
                        }
                        return [...prev, cat.key]
                    }
                })}
            />
        })}
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

});

export default CategoryBar;