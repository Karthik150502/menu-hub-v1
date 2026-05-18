// eslint-disable-next-line import/no-named-as-default
import AppButton from "@/components/custom/appButton";
import { BORDER_RADIUS, DIMENSIONS } from "@/constants/themes/dimensions";
import { SPACING } from "@/constants/themes/spacing";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
import { StyleSheet, View } from "react-native";
// eslint-disable-next-line import/no-unresolved
import { openSidebar, useAppDispatch } from "@/store";

export const SidebarButton: React.FC = () => {
    const dispatch = useAppDispatch();

    return <AppButton
        onPress={() => dispatch(openSidebar())}
        variant="ghost"
        size="icon"
    >
        <View style={styles.menuButton}>
            <View style={styles.menuLine} />
            <View style={[styles.menuLine, { width: DIMENSIONS.barShort }]} />
            <View style={styles.menuLine} />
        </View>
    </AppButton>
}



const styles = StyleSheet.create({
    menuButton: {
        alignSelf: 'flex-start',
        gap: SPACING.xs,
        padding: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    menuLine: {
        height: DIMENSIONS.barThin,
        width: DIMENSIONS.barFull,
        backgroundColor: DESIGN_TOKENS.textPrimary,
        borderRadius: BORDER_RADIUS.xxs,
    }
});