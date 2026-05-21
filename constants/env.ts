// ─── Environment variables ────────────────────────────────────────────────────
// Single source of truth for all EXPO_PUBLIC_ vars.
// Expo replaces `process.env.EXPO_PUBLIC_*` at build time via string
// substitution, so each key must be referenced statically — no dynamic lookups.

function requireEnv(name: string, value: string | undefined, fallback?: string): string {
    const resolved = value ?? fallback;
    if (!resolved) throw new Error(`Missing required environment variable: ${name}`);
    return resolved;
}

export const ENV = {
    SUPABASE_URL: requireEnv('EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL),
    SUPABASE_ANON_KEY: requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
    API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
} as const;
