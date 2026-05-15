import { BORDER_RADIUS } from '@/constants/themes/dimensions';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React from 'react';
import Text from '@/components/custom/appText';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { fieldStyles } from './inputField';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
    key: string;
    label: string;
}

export interface ChipSelectProps {
    label: string;
    options: SelectOption[];
    value: string;
    onChange: (key: string) => void;
    error?: string;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

const T = {
    inputBg: DESIGN_TOKENS.inputBg,
    inputBorder: DESIGN_TOKENS.whiteFadeXs,
    accent: DESIGN_TOKENS.accentDefault,
    accentFaint: DESIGN_TOKENS.accentFaint,
    textPrimary: DESIGN_TOKENS.textPrimary,
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

const ChipSelect: React.FC<ChipSelectProps> = ({ label, options, value, onChange, error }) => (
    <View style={styles.wrapper}>
        <View style={fieldStyles.labelRow}>
            <Text style={fieldStyles.label}>{label}</Text>
        </View>
        <View style={styles.grid}>
            {options.map(opt => {
                const active = opt.key === value;
                return (
                    <TouchableOpacity
                        key={opt.key}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => onChange(opt.key)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
        {error && <Text style={fieldStyles.error}>⚠ {error}</Text>}
    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: { marginBottom: SPACING.xl },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    chip: { paddingHorizontal: SPACING.bg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.card, borderWidth: 1.5, borderColor: T.inputBorder, backgroundColor: T.inputBg },
    chipActive: { borderColor: T.accent, backgroundColor: T.accentFaint },
    chipText: { color: T.textPrimary, ...TYPOGRAPHY.bodySmall },
    chipTextActive: { color: T.accent },
});

export default ChipSelect;
