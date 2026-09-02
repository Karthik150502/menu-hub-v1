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

export default authSlice.reducer;
