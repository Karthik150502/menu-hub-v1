import { FONT_SIZES, TYPOGRAPHY } from '@/constants/themes/font';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

const T = {
    // Surface
    inputBg: DESIGN_TOKENS.inputBg,
    inputBorder: DESIGN_TOKENS.inputBorder,

    // Accent
    accent: DESIGN_TOKENS.accentDefault,

    // Text
    textPrimary: DESIGN_TOKENS.primaryText,
    textLabel: DESIGN_TOKENS.textLabel,
    textPlaceholder: DESIGN_TOKENS.textPlaceholder,
    textMuted: DESIGN_TOKENS.textMuted,
    textHint: DESIGN_TOKENS.textHint,

    // Semantic
    error: DESIGN_TOKENS.errorWarn,
} as const;

interface FieldProps {
    label: string;
    value?: string;
    onChange: (v: string) => void;
    onBlur: () => void;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'url';
    multiline?: boolean;
    error?: string;
    hint?: string;
    optional?: boolean;
}

const Field: React.FC<FieldProps> = ({
    label, value, onChange, onBlur, placeholder,
    keyboardType = 'default', multiline, error, hint, optional,
}) => {
    const borderAnim = useRef(new Animated.Value(0)).current;
    const isFocused = useRef(false);

    // Re-evaluate border color whenever `error` changes.
    // If the field isn't focused, snap back to the error/neutral resting color.
    useEffect(() => {
        if (!isFocused.current) {
            Animated.spring(borderAnim, {
                toValue: 0,
                useNativeDriver: false,
                speed: 22,
                bounciness: 0,
            }).start();
        }
    }, [error]);

    const handleFocus = () => {
        isFocused.current = true;
        Animated.spring(borderAnim, {
            toValue: 1, useNativeDriver: false, speed: 22, bounciness: 4,
        }).start();
    };

    const handleBlur = () => {
        isFocused.current = false;
        onBlur();
        Animated.spring(borderAnim, {
            toValue: 0, useNativeDriver: false, speed: 22, bounciness: 0,
        }).start();
    };

    // Interpolation reads `error` at call time — inside the component body,
    // so it gets the latest value on every render.
    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [T.inputBorder, T.accent],
    });

    return (
        <View style={fieldStyles.wrapper}>
            {/* Label row */}
            <View style={fieldStyles.labelRow}>
                <Text style={fieldStyles.label}>{label}</Text>
                {optional && <Text style={fieldStyles.optional}>optional</Text>}
            </View>

            {/* Input */}
            <Animated.View style={[
                fieldStyles.inputWrap,
                { borderColor },
            ]}>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    placeholderTextColor={T.textPlaceholder}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    underlineColorAndroid="transparent"
                    numberOfLines={multiline ? 3 : 1}
                    autoCapitalize={keyboardType === 'default' ? 'sentences' : 'none'}
                    autoCorrect={keyboardType === 'default'}
                    style={[fieldStyles.input, multiline && fieldStyles.inputMulti]}
                />
            </Animated.View>

            {/* Error takes priority over hint */}
            {error
                ? <Text style={fieldStyles.error}>⚠ {error}</Text>
                : hint
                    ? <Text style={fieldStyles.hint}>{hint}</Text>
                    : null
            }
        </View>
    );
};



export const fieldStyles = StyleSheet.create({
    wrapper: { marginBottom: 20 },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    label: { color: T.textLabel, ...TYPOGRAPHY.caption_sm_700, letterSpacing: 1.1, textTransform: 'uppercase' },
    optional: { marginLeft: 8, color: T.textMuted, ...TYPOGRAPHY.overline_xs_500 },
    inputWrap: { borderWidth: 1.5, borderRadius: 12, backgroundColor: T.inputBg, paddingHorizontal: 14 },
    input: { color: T.textPrimary, fontSize: FONT_SIZES.lg, paddingVertical: 13 },
    inputMulti: { minHeight: 80, textAlignVertical: 'top', paddingTop: 12 },
    error: { color: T.error, ...TYPOGRAPHY.heading_lg_500, marginTop: 6 },
    hint: { color: T.textHint, fontSize: FONT_SIZES.sm, marginTop: 6 },
});


export default Field;