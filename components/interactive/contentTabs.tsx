import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { FONT_SIZES, FONT_WEIGHTS } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import Text from '../custom/appText';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContentSection<T extends string = string> {
    key: T;
    label: string;
    /** Optional Ionicons name shown before the label */
    icon?: string;
    content: React.ReactNode;
}

export interface ContentTabsProps<T extends string = string> {
    /** 2 to 5 sections — the switcher is a browser-tab style layout, not a wrapping list */
    sections: ContentSection<T>[];
    /** Controlled active section key */
    value?: T;
    /** Initial active section key when uncontrolled */
    defaultValue?: T;
    onChange?: (key: T) => void;
    style?: ViewStyle;
}

const MIN_SECTIONS = 2;
const MAX_SECTIONS = 5;

// ─── Component ────────────────────────────────────────────────────────────────
//
// Renders a row of tabs sitting on top of a rounded content panel. The panel
// carries no top border of its own — each tab draws its own bottom edge
// instead. The active tab drops that bottom border, so with nothing drawn
// between it and the panel, the two read as one continuous element; inactive
// tabs keep theirs and stay visually boxed off. Matches the reference
// concept (browser-style tabs) in /reference/image.png.

export function ContentTabs<T extends string>({
    sections,
    value,
    defaultValue,
    onChange,
    style,
}: ContentTabsProps<T>) {
    if (__DEV__ && (sections.length < MIN_SECTIONS || sections.length > MAX_SECTIONS)) {
        console.warn(
            `ContentTabs expects between ${MIN_SECTIONS} and ${MAX_SECTIONS} sections, received ${sections.length}.`
        );
    }
    const visibleSections = sections.slice(0, MAX_SECTIONS);

    const [internalValue, setInternalValue] = useState<T | undefined>(
        value ?? defaultValue ?? visibleSections[0]?.key
    );
    const active = value ?? internalValue;

    const fade = useRef(new Animated.Value(1)).current;

    const handleChange = (key: T) => {
        if (key === active) return;
        if (value === undefined) setInternalValue(key);
        onChange?.(key);

        fade.setValue(0);
        Animated.timing(fade, {
            toValue: 1,
            duration: 180,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    };

    if (visibleSections.length === 0) return null;

    const activeSection = visibleSections.find(s => s.key === active) ?? visibleSections[0];

    return (
        <View style={[styles.root, style]}>

            {/* Tab bar — sits above the panel, zIndex keeps it painting over the
                panel's top border so the active tab can hide the seam beneath it */}
            <View style={styles.tabRow} accessibilityRole="tablist">
                {visibleSections.map((section, index) => {
                    const isActive = section.key === active;
                    return (
                        <TouchableOpacity
                            key={section.key}
                            onPress={() => handleChange(section.key)}
                            activeOpacity={0.75}
                            style={[
                                styles.tab,
                                isActive ? styles.tabActive : styles.tabInactive,
                                // Only the first tab needs its own left border — every
                                // other tab shares the previous tab's right border,
                                // so the internal seams stay a single clean line.
                                index > 0 && styles.tabNotFirst,
                            ]}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: isActive }}
                            accessibilityLabel={section.label}
                        >
                            {section.icon && (
                                <Ionicons
                                    name={section.icon as any}
                                    size={DIMENSIONS.iconMd}
                                    color={isActive ? DESIGN_TOKENS.primaryBright : DESIGN_TOKENS.textSubtle}
                                    style={styles.tabIcon}
                                />
                            )}
                            <Text
                                numberOfLines={1}
                                style={[styles.tabText, isActive && styles.tabTextActive]}
                            >
                                {section.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Content panel — only the active section's content is mounted */}
            <View style={styles.panel}>
                <Animated.View style={{ opacity: fade }}>
                    {activeSection?.content}
                </Animated.View>
            </View>

        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: {
        width: '100%',
    },

    // No gap — adjacent tabs sit flush against each other, sharing a border,
    // so there's no empty notch cut into the panel's borderless top edge
    // between an active tab and its neighbour.
    tabRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        zIndex: 1,
    },

    tab: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.sm + 2,
        paddingHorizontal: SPACING.sm,
        borderWidth: DIMENSIONS.borderWidthMedium,
        borderColor: DESIGN_TOKENS.cardBorder,
        borderTopLeftRadius: BORDER_RADIUS.lg,
        borderTopRightRadius: BORDER_RADIUS.lg,
    },

    tabNotFirst: {
        borderLeftWidth: 0,
    },

    // Rounded top only, sits flush against the panel below it — no gap. Its
    // own bottom border stands in for the panel's top edge (which carries no
    // top border of its own), so it reads as one clean boxed tab.
    tabInactive: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: DIMENSIONS.borderWidthMedium,
        backgroundColor: 'transparent',
    },

    // Square bottom + no bottom border. The panel below has no top border
    // either, so there's nothing drawn between them at all — button and
    // panel read as one continuous element.
    tabActive: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
    },

    tabIcon: {
        marginRight: SPACING.xs,
    },

    tabText: {
        fontSize: FONT_SIZES.compact,
        fontWeight: FONT_WEIGHTS.semibold,
        color: DESIGN_TOKENS.textSubtle,
    },

    tabTextActive: {
        color: DESIGN_TOKENS.primaryBright,
    },

    panel: {
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: DIMENSIONS.borderWidthMedium,
        borderTopWidth: 0,
        borderColor: DESIGN_TOKENS.cardBorder,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: BORDER_RADIUS.card,
        borderBottomRightRadius: BORDER_RADIUS.card,
        padding: SPACING.lg,
    },
});

export default ContentTabs;
