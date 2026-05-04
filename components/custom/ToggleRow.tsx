// ─── Toggle Row ───────────────────────────────────────────────────────────────

import { TYPOGRAPHY } from "@/constants/themes/font";
import { SPACING } from "@/constants/themes/spacing";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
import { StyleSheet, Switch, Text, View } from "react-native";

interface ToggleRowProps {
    label: string;
    subLabel: string;
    value: boolean;
    onChange: (v: boolean) => void;
    activeColor?: string;
    disabled?: boolean;
}

// ─── Theme tokens (local aliases for readability) ─────────────────────────────
// All color values come from @/constants/theme/theme — zero hardcoded hex here.

const T = {
    // Text
    textPrimary: DESIGN_TOKENS.textPrimary,
    textSubtle: DESIGN_TOKENS.textSubtle,

    // Semantic
    success: DESIGN_TOKENS.subPositive,

    // UI chrome
    toggleBg: DESIGN_TOKENS.inputBg,
    toggleBorder: DESIGN_TOKENS.whiteFadeXs,
    switchTrackOff: DESIGN_TOKENS.switchTrackOff,

} as const;


const ToggleRow: React.FC<ToggleRowProps> = ({
    label, subLabel, value, onChange, activeColor = T.success, disabled,
}) => (
    <View style={[toggleStyles.row, disabled && toggleStyles.rowDisabled]}>
        <View style={toggleStyles.text}>
            <Text style={toggleStyles.label}>{label}</Text>
            <Text style={toggleStyles.sub}>{subLabel}</Text>
        </View>
        <Switch
            disabled={disabled}
            value={value}
            onValueChange={onChange}
            trackColor={{ false: T.switchTrackOff, true: activeColor }}
            thumbColor={T.textPrimary}
            ios_backgroundColor={T.switchTrackOff}
        />
    </View>
);


const toggleStyles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: T.toggleBg, borderWidth: 1, borderColor: T.toggleBorder, borderRadius: 12, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.bg, marginBottom: SPACING.bg },
    rowDisabled: { opacity: 0.55 },
    text: { flex: 1, marginRight: SPACING.md },
    label: { color: T.textPrimary, ...TYPOGRAPHY.body },
    sub: { color: T.textSubtle, ...TYPOGRAPHY.bodySmall },
});

export default ToggleRow;