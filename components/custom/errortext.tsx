import { BORDER_RADIUS } from "@/constants/themes/dimensions"
import { FONT_SIZES, TYPOGRAPHY } from "@/constants/themes/font"
import { SPACING } from "@/constants/themes/spacing"
import { DESIGN_TOKENS } from "@/constants/themes/theme"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Animated, StyleSheet } from "react-native"
import Text from "./appText"

interface ErrorTextProps {
    message: string
}

// A compact "danger" chip — same bg/border/text trio as AppButton's danger
// variant (see components/custom/AppButton.tsx) — rather than bare colored
// text, so field errors read as one consistent visual language with the
// rest of the app's destructive/error UI.
const ErrorText = ({
    message
}: ErrorTextProps) => {
    const translateX = useState(() => new Animated.Value(-8))[0]
    const opacity = useState(() => new Animated.Value(0))[0]

    useEffect(() => {
        translateX.setValue(-8)
        opacity.setValue(0)
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateX, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start()
    }, [message])

    return (
        <Animated.View style={{ opacity, transform: [{ translateX }], ...errorTextStyles.container }}>
            <Ionicons
                name="alert-circle"
                size={FONT_SIZES.md}
                color={DESIGN_TOKENS.subNegativeDark}
                style={errorTextStyles.icon}
            />
            <Text style={errorTextStyles.errorText}>{message}</Text>
        </Animated.View>
    )
}

export const errorTextStyles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        maxWidth: "100%",
        marginTop: SPACING.sm,
        paddingVertical: SPACING.xxs,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: DESIGN_TOKENS.dangerFaint,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.dangerBorder,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
    },
    icon: {
        flexShrink: 0,
    },
    errorText: {
        flexShrink: 1,
        color: DESIGN_TOKENS.subNegativeDark,
        ...TYPOGRAPHY.bodySmallSemiBold,
    },
})

export default ErrorText;
