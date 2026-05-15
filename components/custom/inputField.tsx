import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import AppBanner from './appBanner';
import Text from './appText';

const T = {
    inputBg: DESIGN_TOKENS.inputBg,
    inputBorder: DESIGN_TOKENS.whiteFadeXs,
    accent: DESIGN_TOKENS.accentDefault,
    textPrimary: DESIGN_TOKENS.textPrimary,
    textLabel: DESIGN_TOKENS.textLabel,
    textPlaceholder: DESIGN_TOKENS.textPlaceholder,
    textMuted: DESIGN_TOKENS.textMuted,
    textHint: DESIGN_TOKENS.textHint,
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

    useEffect(() => {
        if (!isFocused.current) {
            Animated.spring(borderAnim, {
                toValue: 0, useNativeDriver: false, speed: 22, bounciness: 0,
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

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [T.inputBorder, T.accent],
    });

    return (
        <View style={fieldStyles.wrapper}>
            <View style={fieldStyles.labelRow}>
                <Text style={fieldStyles.label}>{label}</Text>
                {optional && <Text style={fieldStyles.optional}>optional</Text>}
            </View>

            <Animated.View style={[fieldStyles.inputWrap, { borderColor }]}>
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

            {error
                ? <AppBanner dismissible={false} title={label} type="warning" message={error} /> : hint
                    ? <Text style={fieldStyles.hint}>{hint}</Text>
                    : null
            }
        </View>
    );
};

export const fieldStyles = StyleSheet.create({
    wrapper: { marginBottom: SPACING.xl },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
    label: { color: T.textLabel, ...TYPOGRAPHY.label, letterSpacing: 1.1, textTransform: 'uppercase' },
    optional: { marginLeft: SPACING.sm, color: T.textMuted, ...TYPOGRAPHY.overline },

    inputWrap: {
        borderWidth: 1.5,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: T.inputBg,
        paddingHorizontal: SPACING.bg,
        justifyContent: 'center',
    },

    input: {
        color: T.textPrimary,
        fontFamily: 'Montserrat_400Regular',
        fontSize: TYPOGRAPHY.body.fontSize,
        letterSpacing: (TYPOGRAPHY.body as any).letterSpacing,
        paddingVertical: SPACING.slg,   // 12px — balanced on both iOS and Android
        includeFontPadding: false,
        textAlignVertical: 'center',
    },

    inputMulti: {
        minHeight: DIMENSIONS.inputMultilineMin,
        textAlignVertical: 'top',   // multiline reads top-to-bottom
        paddingTop: SPACING.md,
        paddingBottom: SPACING.md,
    },

    error: { color: T.error, ...TYPOGRAPHY.body, marginTop: SPACING.xs },
    hint: { color: T.textHint, ...TYPOGRAPHY.bodySmall, marginTop: SPACING.xs },
});

export default Field;