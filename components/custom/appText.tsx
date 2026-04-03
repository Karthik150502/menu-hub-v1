import { StyleSheet, Text, TextProps } from 'react-native';

// ─── Font family map ──────────────────────────────────────────────────────────
// Maps fontWeight values to the correct loaded Montserrat font family string.
// Add more weights here if you load them in _layout.tsx.

const WEIGHT_MAP: Record<string, string> = {
    '300': 'Montserrat_300Light',
    '400': 'Montserrat_400Regular',
    '500': 'Montserrat_500Medium',
    '600': 'Montserrat_600SemiBold',
    '700': 'Montserrat_700Bold',
    '800': 'Montserrat_800ExtraBold',
    // fallback for keyword values
    normal: 'Montserrat_400Regular',
    bold: 'Montserrat_700Bold',
};

const DEFAULT_FONT = 'Montserrat_300Light';

export function AppText({ style, ...props }: TextProps) {
    // Flatten so we can read individual properties
    const flat = StyleSheet.flatten(style) ?? {};

    // Pick the right family from the weight, or default to 300 Light
    const weight = String(flat.fontWeight ?? '300');
    const fontFamily = WEIGHT_MAP[weight] ?? DEFAULT_FONT;

    return (
        <Text
            {...props}
            style={[
                flat,
                {
                    fontFamily,
                    fontWeight: undefined, // clear it — the family already encodes the weight
                },
            ]}
        />
    );
}

export default AppText;