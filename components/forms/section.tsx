import { TYPOGRAPHY } from "@/constants/themes/font";
import { SPACING } from "@/constants/themes/spacing";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
import { StyleSheet, View } from "react-native";
import Text from "../custom/appText";

// ─── Theme ────────────────────────────────────────────────────────────────────

const T = {
    textSectionTitle: DESIGN_TOKENS.textSectionTitle,
    divider: DESIGN_TOKENS.disabled,
} as const;

export const Section: React.FC<{ title: string }> = ({ title }) => (
    <View style={sectionStyles.wrap}>
        <Text style={sectionStyles.title}>{title}</Text>
        <View style={sectionStyles.line} />
    </View>
);

const sectionStyles = StyleSheet.create({
    wrap: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, marginTop: SPACING.sm, gap: SPACING.sm },
    title: { color: T.textSectionTitle, ...TYPOGRAPHY.caption_bold, textTransform: 'uppercase', flexShrink: 0 },
    line: { flex: 1, height: 1, backgroundColor: T.divider },
});