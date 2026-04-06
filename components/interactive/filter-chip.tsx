import { CATEGORIES } from "@/constants/mock-data";
import { Colors } from "@/constants/theme";
import React, { useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
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
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {label}
                </Text>
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
                            info('Need a category always selected');
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


const ACCENT = Colors.light.primary;

const styles = StyleSheet.create({
    // ── Filter bar ────────────────────────────────────────────────────────────
    bar: {
        flexGrow: 0,
        flexShrink: 0,
    },
    barContent: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
    },

    // ── Chips ─────────────────────────────────────────────────────────────────
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: "#1C1C26",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
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
    chipText: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.2,
    },
    chipTextSelected: {
        color: "#fff",
    },

});

export default CategoryBar;