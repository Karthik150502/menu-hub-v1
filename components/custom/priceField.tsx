import { TYPOGRAPHY } from "@/constants/themes/font";
import { SPACING } from "@/constants/themes/spacing";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
import { useRef } from "react";
import { Animated, StyleSheet, Text, TextInput, View } from "react-native";
import { fieldStyles } from "./inputField";

const T = {
    // Surfaces
    inputBorder: DESIGN_TOKENS.whiteFadeXs,

    // Accent
    accent: DESIGN_TOKENS.accentDefault,

    // Text
    textPlaceholder: DESIGN_TOKENS.textPlaceholder,

    // Price field
    currencyBadgeBg: DESIGN_TOKENS.primaryAccent5,
    currencyText: DESIGN_TOKENS.accentDefault,
    priceDivider: DESIGN_TOKENS.whiteFadeXs,
} as const;

export interface PriceFieldProps {
    value: string;
    onChange: (v: string) => void;
    onBlur: () => void;
    error?: string;
}

export const PriceField: React.FC<PriceFieldProps> = ({ value, onChange, onBlur, error }) => {
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => Animated.spring(borderAnim, {
        toValue: 1, useNativeDriver: false, speed: 22, bounciness: 4,
    }).start();

    const handleBlur = () => {
        onBlur();
        Animated.spring(borderAnim, {
            toValue: 0, useNativeDriver: false, speed: 22, bounciness: 0,
        }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [T.inputBorder, T.accent],
    });

    return (
        <View style={fieldStyles.wrapper}>
            <View style={fieldStyles.labelRow}>
                <Text style={fieldStyles.label}>Price</Text>
            </View>
            <Animated.View style={[
                fieldStyles.inputWrap,
                priceStyles.inputWrap,
                { borderColor },
            ]}>
                <View style={priceStyles.currencyBadge}>
                    <Text style={priceStyles.currencyText}>₹</Text>
                </View>
                <View style={priceStyles.divider} />
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="0.00"
                    placeholderTextColor={T.textPlaceholder}
                    keyboardType="decimal-pad"
                    style={[fieldStyles.input, priceStyles.input]}
                />
            </Animated.View>
            {error && <Text style={fieldStyles.error}>⚠ {error}</Text>}
        </View>
    );
};

const priceStyles = StyleSheet.create({
    inputWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.none, overflow: 'hidden' },
    currencyBadge: { paddingHorizontal: SPACING.bg, paddingVertical: SPACING.bg, backgroundColor: T.currencyBadgeBg, alignItems: 'center', justifyContent: 'center' },
    currencyText: { color: T.currencyText, ...TYPOGRAPHY.h4 },
    divider: { width: 1, alignSelf: 'stretch', backgroundColor: T.priceDivider },
    input: { flex: 1, paddingHorizontal: SPACING.bg },
});
