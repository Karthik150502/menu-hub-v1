import { supabase } from '@/lib/supabase';

// ─── Apply a backend-issued token pair ───────────────────────────────────────
// The FastAPI backend's /api/v1/auth/login (and /register, /phone/verify)
// return an access + refresh token pair minted through Supabase Auth on the
// server. Handing that pair to the Supabase client persists it (SecureStore)
// and lets it auto-refresh — so every other call, which reads its bearer
// token from supabase.auth.getSession() (see lib/api/apiClient.ts), keeps
// working without knowing the login happened via the backend.

export async function applySession(tokens: { access_token: string; refresh_token: string }) {
    const { data, error } = await supabase.auth.setSession(tokens);
    if (error) throw error;
    return data;   // { session, user }
}

// ─── Phone OTP — Step 1 ───────────────────────────────────────────────────────
// Sends a 6-digit OTP SMS to the given phone number.
// Phone must be in E.164 format: +919876543210 (country code + number, no spaces).

export async function sendPhoneOtp(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
    return data;
}

// ─── Phone OTP — Step 2 ───────────────────────────────────────────────────────
// Verifies the OTP the user received.
// Works for both sign-up and sign-in — Supabase creates the user if new,
// signs them in if they already exist.

export async function verifyPhoneOtp(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
    });
    if (error) throw error;
    return data;   // { session, user }
}

// ─── Sign out ─────────────────────────────────────────────────────────────────

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
}

export async function getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
}

// ─── Auth state listener ──────────────────────────────────────────────────────
// Subscribe to session changes (sign in, sign out, token refresh).
// Call this once in your root _layout.tsx and dispatch setSession to Redux.
//
// Usage:
//   useEffect(() => {
//     const { data: { subscription } } = onAuthStateChange((session) => {
//       dispatch(setSession({ session, user: session?.user ?? null }));
//     });
//     return () => subscription.unsubscribe();
//   }, []);

export function onAuthStateChange(
    callback: (session: Awaited<ReturnType<typeof getSession>>) => void,
) {
    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });
}