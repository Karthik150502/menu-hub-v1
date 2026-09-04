import type { Session, User } from '@supabase/supabase-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// ─── Types ────────────────────────────────────────────────────────────────────
// Mirrors the Supabase session — populated from onAuthStateChange (see
// lib/supabase/auth.ts) so it stays in sync regardless of whether the session
// came from the backend login endpoint, phone OTP, or a token refresh.

interface AuthState {
    session: Session | null;
    user: User | null;
    // 'idle' until the first onAuthStateChange fires — lets the root layout
    // hold the splash screen instead of flashing the welcome screen.
    status: 'idle' | 'authenticated' | 'unauthenticated';
}

const initialState: AuthState = {
    session: null,
    user: null,
    status: 'idle',
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSession(s, a: PayloadAction<{ session: Session | null; user: User | null }>) {
            s.session = a.payload.session;
            s.user = a.payload.user;
            s.status = a.payload.session ? 'authenticated' : 'unauthenticated';
        },
        clearSession(s) {
            s.session = null;
            s.user = null;
            s.status = 'unauthenticated';
        },
    },
});

export const { setSession, clearSession } = authSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectSession = (s: RootState) => s.auth.session;
export const selectAuthUser = (s: RootState) => s.auth.user;
export const selectAuthStatus = (s: RootState) => s.auth.status;
export const selectIsAuthenticated = (s: RootState) => s.auth.status === 'authenticated';

// ─── Display name ─────────────────────────────────────────────────────────────
// `user` here is decoded straight from the access token's claims (Supabase
// parses the JWT for us — see onAuthStateChange in lib/supabase/auth.ts), so
// user_metadata.full_name is "the name from the access token". Nothing in the
// phone-OTP sign-up flow collects a name yet, so this comes back null for
// every current user until a profile step sets it (e.g. via
// supabase.auth.updateUser({ data: { full_name } })) — callers get a sensible
// fallback instead of a blank UI.

const getFullName = (user: User | null): string | null => {
    const meta = user?.user_metadata as { full_name?: string; name?: string } | undefined;
    return meta?.full_name?.trim() || meta?.name?.trim() || null;
};

export const selectDisplayName = (s: RootState): string =>
    getFullName(s.auth.user) ?? 'Owner';

export const selectUserInitials = (s: RootState): string => {
    const name = getFullName(s.auth.user);
    if (!name) return 'U';
    const parts = name.split(/\s+/).filter(Boolean);
    return parts.length === 1
        ? parts[0].slice(0, 2).toUpperCase()
        : (parts[0][0] + parts[1][0]).toUpperCase();
};

export default authSlice.reducer;
