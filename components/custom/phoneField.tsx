import { BORDER_RADIUS } from '@/constants/themes/dimensions';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { useCallingCode } from '@/hooks/use-calling-code';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import Text from './appText';
import ErrorText from './errortext';

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
    divider: DESIGN_TOKENS.whiteFadeXs,
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhoneFieldProps {
    label?: string;
    /** Local number only, digits — e.g. "9876543210". The dial code is shown/handled separately (see lib/phone.ts → toE164). */
    value?: string;
    onChange: (v: string) => void;
    onBlur: () => void;
    placeholder?: string;
    error?: string;
    hint?: string;
    /** Max digits accepted for the local number. @default 10 */
    maxLength?: number;
    /** Pin a specific dial code instead of the device-detected one (see useCallingCode). */
    dialCode?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
// Same look and animated-border behavior as Field (inputField.tsx), plus a
// fixed, non-editable calling-code prefix resolved dynamically from the
// device's region — never hardcoded to one country.

const PhoneField: React.FC<PhoneFieldProps> = ({
    label = 'Phone number',
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    hint,
    maxLength = 10,
    dialCode: dialCodeOverride,
}) => {
    const dialCode = useCallingCode(dialCodeOverride);
    const borderAnim = useState(() => new Animated.Value(0))[0];
    const isFocused = useRef(false);

    useEffect(() => {
        if (!isFocused.current) {
            Animated.spring(borderAnim, {
                toValue: 0, useNativeDriver: false, speed: 22, bounciness: 0,
            }).start();
        }
    }, [error, borderAnim]);

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

    const handleChangeText = (text: string) => {
        onChange(text.replace(/\D/g, '').slice(0, maxLength));
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [T.inputBorder, T.accent],
    });

    return (
        <View style={styles.wrapper}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{label}</Text>
            </View>

            <Animated.View style={[styles.inputWrap, { borderColor }]}>
                <Text style={styles.dialCode}>{dialCode}</Text>
                <View style={styles.divider} />
                <TextInput
                    value={value}
                    onChangeText={handleChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    placeholderTextColor={T.textPlaceholder}
                    keyboardType="numeric"
                    maxLength={maxLength}
                    underlineColorAndroid="transparent"
                    autoCorrect={false}
                    style={styles.input}
                />
            </Animated.View>

            {error
                ? <ErrorText message={error} /> : hint
                    ? <Text style={styles.hint}>{hint}</Text>
                    : null
            }
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: { marginBottom: SPACING.xl, width: '100%' },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
    label: { color: T.textLabel, ...TYPOGRAPHY.label, letterSpacing: 1.1, textTransform: 'uppercase' },

    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: T.inputBg,
        paddingHorizontal: SPACING.bg,
    },

    dialCode: {
        color: T.textMuted,
        fontFamily: 'Montserrat_400Regular',
        fontSize: TYPOGRAPHY.body.fontSize,
        paddingVertical: SPACING.slg,
        includeFontPadding: false,
    },
    divider: {
        width: 1,
        alignSelf: 'stretch',
        marginVertical: SPACING.xs,
        marginHorizontal: SPACING.sm,
        backgroundColor: T.divider,
    },

    input: {
        flex: 1,
        color: T.textPrimary,
        fontFamily: 'Montserrat_400Regular',
        fontSize: TYPOGRAPHY.body.fontSize,
        letterSpacing: (TYPOGRAPHY.body as any).letterSpacing,
        paddingVertical: SPACING.slg,   // 12px — balanced on both iOS and Android
        includeFontPadding: false,
        textAlignVertical: 'center',
    },

    hint: { color: T.textHint, ...TYPOGRAPHY.bodySmall, marginTop: SPACING.xs },
});

export default PhoneField;
