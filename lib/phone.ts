// ─── Phone number helpers ─────────────────────────────────────────────────────
// International dialing (calling) codes, keyed by ISO 3166-1 alpha-2 region —
// the same region code expo-localization reports for the device (see
// hooks/use-calling-code.ts). Not exhaustive: covers the regions we're likely
// to see users from; add more as the app expands. Any region not listed here
// falls back to DEFAULT_DIAL_CODE.

export const CALLING_CODES: Record<string, string> = {
    IN: '+91',
    US: '+1', CA: '+1',
    GB: '+44',
    AE: '+971',
    SA: '+966',
    SG: '+65',
    MY: '+60',
    ID: '+62',
    PH: '+63',
    TH: '+66',
    VN: '+84',
    PK: '+92',
    BD: '+880',
    LK: '+94',
    NP: '+977',
    AU: '+61',
    NZ: '+64',
    DE: '+49',
    FR: '+33',
    ES: '+34',
    IT: '+39',
    NL: '+31',
    IE: '+353',
    ZA: '+27',
    NG: '+234',
    KE: '+254',
    BR: '+55',
    MX: '+52',
    JP: '+81',
    KR: '+82',
    CN: '+86',
    HK: '+852',
};

export const DEFAULT_REGION = 'IN';
export const DEFAULT_DIAL_CODE = CALLING_CODES[DEFAULT_REGION];

/** Maps a device/region code to its dial code, falling back to DEFAULT_DIAL_CODE. */
export function resolveCallingCode(regionCode?: string | null): string {
    if (!regionCode) return DEFAULT_DIAL_CODE;
    return CALLING_CODES[regionCode.toUpperCase()] ?? DEFAULT_DIAL_CODE;
}

/** Combines a dial code with a local number into E.164 (+<code><digits>, no spaces). */
export function toE164(dialCode: string, localNumber: string): string {
    const digits = localNumber.replace(/\D/g, '');
    return `${dialCode}${digits}`;
}
