import { BORDER_RADIUS } from '@/constants/themes/dimensions';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    NativeSyntheticEvent,
    Pressable,
    StyleSheet,
    TextInput,
    TextInputKeyPressEventData,
    View,
    ViewStyle,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OtpInputProps {
    /** Number of OTP digits. Typically 4 or 6. Default: 6 */
    length?:      number;
    /** Called with the full OTP string whenever all digits are filled */
    onComplete?:  (otp: string) => void;
    /** Called on every change with the current partial/full OTP string */
    onChange?:    (otp: string) => void;
    /** Show an error state (red border) on all boxes */
    error?:       boolean;
    /** Disable all inputs */
    disabled?:    boolean;
    style?:       ViewStyle;
}

// ─── Single digit box ─────────────────────────────────────────────────────────

interface DigitBoxProps {
    value:    string;
    focused:  boolean;
    error:    boolean;
    disabled: boolean;
}

const DigitBox: React.FC<DigitBoxProps> = ({ value, focused, error, disabled }) => {
    const borderAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim  = useRef(new Animated.Value(1)).current;

    // JS driver — borderColor + backgroundColor (layout props, can't use native driver)
    useEffect(() => {
        Animated.timing(borderAnim, {
            toValue:  error ? 2 : focused ? 1 : 0,
            duration: 180,
            easing:   Easing.out(Easing.quad),
            useNativeDriver: false,
        }).start();
    }, [focused, error]);

    // Native driver — scale transform only (no colour props on this view)
    useEffect(() => {
        if (!value) return;
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.08, duration: 80,  useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1,    duration: 100, useNativeDriver: true }),
        ]).start();
    }, [value]);

    const borderColor = borderAnim.interpolate({
        inputRange:  [0, 1, 2],
        outputRange: [
            DESIGN_TOKENS.whiteFadeXs,
            DESIGN_TOKENS.accentDefault,
            DESIGN_TOKENS.subNegative,
        ],
    });

    const backgroundColor = borderAnim.interpolate({
        inputRange:  [0, 1, 2],
        outputRange: [
            DESIGN_TOKENS.inputBg,
            'rgba(148,0,171,0.07)',
            'rgba(255,0,0,0.05)',
        ],
    });

    return (
        // Outer — JS driver: borderColor + backgroundColor + opacity
        // Must NOT have any transform here
        <Animated.View
            style={[
                styles.box,
                {
                    borderColor,
                    backgroundColor,
                    opacity: disabled ? 0.45 : 1,
                },
            ]}
        >
            {/* Inner — native driver: scale only, no colour props */}
            <Animated.View
                style={[
                    styles.boxInner,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                {focused && !value && (
                    <View style={styles.cursor} />
                )}
                {value ? (
                    <Animated.Text style={styles.digit}>{value}</Animated.Text>
                ) : null}
            </Animated.View>
        </Animated.View>
    );
};

// ─── OtpInput ─────────────────────────────────────────────────────────────────

export const OtpInput: React.FC<OtpInputProps> = ({
    length   = 6,
    onComplete,
    onChange,
    error    = false,
    disabled = false,
    style,
}) => {
    const [values,       setValues]       = useState<string[]>(Array(length).fill(''));
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Focus first box on mount
    useEffect(() => {
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, []);

    const handleChange = (text: string, index: number) => {
        // Accept only digits, take the last char if multiple pasted
        const digit = text.replace(/\D/g, '').slice(-1);

        const next = [...values];
        next[index] = digit;
        setValues(next);

        const otp = next.join('');
        onChange?.(otp);

        if (digit && index < length - 1) {
            // Move focus forward
            inputRefs.current[index + 1]?.focus();
        }

        if (otp.length === length && !next.includes('')) {
            onComplete?.(otp);
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number,
    ) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (values[index]) {
                // Clear current box
                const next = [...values];
                next[index] = '';
                setValues(next);
                onChange?.(next.join(''));
            } else if (index > 0) {
                // Move back and clear previous
                const next = [...values];
                next[index - 1] = '';
                setValues(next);
                onChange?.(next.join(''));
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    // Handle paste — fill all boxes from a pasted string
    const handlePaste = (text: string, startIndex: number) => {
        const digits = text.replace(/\D/g, '').slice(0, length - startIndex);
        if (!digits) return;

        const next = [...values];
        for (let i = 0; i < digits.length; i++) {
            next[startIndex + i] = digits[i];
        }
        setValues(next);

        const otp = next.join('');
        onChange?.(otp);

        // Focus the box after the last pasted digit
        const lastFilled = Math.min(startIndex + digits.length, length - 1);
        inputRefs.current[lastFilled]?.focus();

        if (otp.length === length && !next.includes('')) {
            onComplete?.(otp);
        }
    };

    return (
        <View
            style={[styles.row, style]}
            accessible
            accessibilityLabel={`OTP input, ${length} digits`}
            accessibilityRole="none"
        >
            {Array.from({ length }).map((_, i) => (
                <Pressable
                    key={i}
                    style={styles.boxWrap}
                    onPress={() => inputRefs.current[i]?.focus()}
                    accessibilityRole="none"
                >
                    {/* Visual box — pure display */}
                    <DigitBox
                        value={values[i]}
                        focused={focusedIndex === i}
                        error={error}
                        disabled={disabled}
                    />

                    {/* Invisible TextInput — absoluteFill over the box, captures all input */}
                    <TextInput
                        ref={(ref) => { inputRefs.current[i] = ref; }}
                        style={styles.hiddenInput}
                        value={values[i]}
                        onChangeText={(text) => {
                            if (text.length > 1) {
                                handlePaste(text, i);
                            } else {
                                handleChange(text, i);
                            }
                        }}
                        onKeyPress={(e) => handleKeyPress(e, i)}
                        onFocus={() => setFocusedIndex(i)}
                        onBlur={() => setFocusedIndex(-1)}
                        keyboardType="number-pad"
                        maxLength={length}
                        editable={!disabled}
                        selectTextOnFocus
                        caretHidden
                        accessibilityLabel={`Digit ${i + 1} of ${length}`}
                        autoCorrect={false}
                        autoComplete="one-time-code"
                        textContentType="oneTimeCode"
                        importantForAutofill="yes"
                    />
                </Pressable>
            ))}
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const BOX_SIZE = 52;

const styles = StyleSheet.create({
    row: {
        flexDirection:   'row',
        gap:             SPACING.sm,
        justifyContent:  'center',
    },

    boxWrap: {
        position: 'relative',
        width:    BOX_SIZE,
        height:   BOX_SIZE,
    },

    boxInner: {
        width:          '100%',
        height:         '100%',
        alignItems:     'center',
        justifyContent: 'center',
    },

    box: {
        width:          BOX_SIZE,
        height:         BOX_SIZE,
        borderRadius:   BORDER_RADIUS.lg,
        borderWidth:    1.5,
        alignItems:     'center',
        justifyContent: 'center',
    },

    digit: {
        ...TYPOGRAPHY.h3,
        color:      DESIGN_TOKENS.textPrimary,
        fontWeight: '700',
        lineHeight: BOX_SIZE * 0.55,
        includeFontPadding: false,
    },

    // Blinking cursor when the box is focused and empty
    cursor: {
        width:           2,
        height:          22,
        borderRadius:    1,
        backgroundColor: DESIGN_TOKENS.accentDefault,
    },

    // Completely transparent — captures input, sits on top of the visual box
    hiddenInput: {
        ...StyleSheet.absoluteFillObject,
        opacity:    0,
        color:      'transparent',
        fontSize:   1,
    },
});

export default OtpInput;