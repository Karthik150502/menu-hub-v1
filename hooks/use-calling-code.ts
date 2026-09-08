import { DEFAULT_DIAL_CODE, resolveCallingCode } from '@/lib/phone';
import * as Localization from 'expo-localization';
import { useMemo } from 'react';

/**
 * Resolves the calling code (dial code) to show/use for phone input.
 *
 * - Pass `override` to pin a specific code (e.g. a future country picker) —
 *   it always wins.
 * - Otherwise it's derived from the device's own region setting (Settings ▸
 *   Language & Region on iOS, Region on Android) via expo-localization, so a
 *   user in the UK sees +44 and a user in India sees +91 without either
 *   being hardcoded here.
 * - Falls back to DEFAULT_DIAL_CODE (see lib/phone.ts) if the device region
 *   isn't in CALLING_CODES or can't be determined (e.g. some web contexts).
 */
export function useCallingCode(override?: string): string {
    return useMemo(() => {
        if (override) return override;
        try {
            const region = Localization.getLocales()[0]?.regionCode;
            return resolveCallingCode(region);
        } catch {
            return DEFAULT_DIAL_CODE;
        }
    }, [override]);
}

export default useCallingCode;
