import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import Text from '../custom/appText';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SectionTab<T extends string = string> {
    key: T;
    label: string;
}

export interface SectionSwitcherProps<T extends string = string> {
    tabs: SectionTab<T>[];
    value: T;
    onChange: (key: T) => void;
    /** Content rendered below the tab bar — keyed by tab key */
    children?: Partial<Record<T, React.ReactNode>>;
    label?: string;
    style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SectionSwitcher<T extends string>({
    tabs,
    value,
    onChange,
    children,
    label,
    style,
}: SectionSwitcherProps<T>) {
    return (
        <View style={[styles.root, style]}>

            {label && (
                <Text style={styles.label}>{label}</Text>
            )}

            {/*
              flexWrap:'wrap' lets tabs spill onto a second row when there
              are too many to fit on one line. Each tab uses flexGrow:1 with
              a minWidth so it fills the available space but never gets too narrow.
            */}
            <View style={styles.tabBar} accessibilityRole="tablist">
                {tabs.map(tab => {
                    const active = tab.key === value;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tab, active && styles.tabActive]}
                            onPress={() => onChange(tab.key)}
                            activeOpacity={0.75}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: active }}
                            accessibilityLabel={tab.label}
                        >
                            <Text style={[styles.tabText, active && styles.tabTextActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Render only the active tab's content */}
            {children && children[value] && (
                <View style={styles.content} accessibilityRole="tab">
                    {children[value]}
                </View>
            )}

        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: {
        width: '100%',
    },

    label: {
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1.3,
        textTransform: 'uppercase',
        color: DESIGN_TOKENS.textSectionTitle,
        marginBottom: SPACING.sm,
    },

    // Wrapping flex row — tabs flow to next line if they don't fit
    tabBar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },

    tab: {
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 90,         // never narrower than this
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.sm + 2,
        paddingHorizontal: SPACING.md,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: DESIGN_TOKENS.cardBorder,
        backgroundColor: DESIGN_TOKENS.inputBg,
    },

    tabActive: {
        backgroundColor: DESIGN_TOKENS.primaryFaint,
        borderColor: DESIGN_TOKENS.primaryBorder,
    },

    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: DESIGN_TOKENS.textSubtle,
    },

    tabTextActive: {
        color: DESIGN_TOKENS.primaryBright,
    },

    content: {
        width: '100%',
    },
});

export default SectionSwitcher;