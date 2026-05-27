import { FONT_SIZES, TYPOGRAPHY } from "@/constants/themes/font"
import { SPACING } from "@/constants/themes/spacing"
import { DESIGN_TOKENS } from "@/constants/themes/theme"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useRef } from "react"
import { Animated, StyleSheet } from "react-native"
import Text from "./appText"

interface ErrorTextProps {
    message: string
}

const ErrorText = ({
    message
}: ErrorTextProps) => {
    const translateX = useRef(new Animated.Value(-8)).current
    const opacity = useRef(new Animated.Value(0)).current

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
            <Text style={errorTextStyles.errorText}>{message}</Text>
            <Ionicons name={"alert"} size={FONT_SIZES.md} color={DESIGN_TOKENS.subNegativeDark} />
        </Animated.View>
    )
}

export const errorTextStyles = StyleSheet.create({
    container: {
        width: "100%",
        // gap: SPACING.xs,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-end"
    },
    errorText: {
        color: DESIGN_TOKENS.subNegativeDark,
        ...TYPOGRAPHY.bodySmallSemiBold
    }
})

export default ErrorText;