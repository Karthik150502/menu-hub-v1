import { api } from './apiClient';
import { ENDPOINTS } from './endpoints';

// ─── Backend auth API ─────────────────────────────────────────────────────────
// Wraps the FastAPI auth routes (see /docs → `auth` tag). These sit in front of
// Supabase Auth on the server, so a successful login/register still needs its
// token pair handed to the Supabase client (see lib/supabase/auth.ts →
// `applySession`) so the rest of the app keeps working off `supabase.auth`.

// Every backend response is wrapped: { success, message, data }.
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface TokenPair {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface UserRead {
    id: string;
    email: string | null;
    phone: string | null;
    full_name: string | null;
    avatar_url: string | null;
    is_active: boolean;
    is_superuser: boolean;
    email_confirmed: boolean;
    created_at: string;
    updated_at: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    phone?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
}

// ─── Email + password ─────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<TokenPair> {
    const res = await api.post<ApiResponse<TokenPair>>(ENDPOINTS.auth.login, payload);
    return res.data;
}

export async function register(payload: RegisterPayload): Promise<UserRead> {
    const res = await api.post<ApiResponse<UserRead>>(ENDPOINTS.auth.register, payload);
    return res.data;
}

export async function refresh(refresh_token: string): Promise<TokenPair> {
    const res = await api.post<ApiResponse<TokenPair>>(ENDPOINTS.auth.refresh, { refresh_token });
    return res.data;
}

export async function me(): Promise<UserRead> {
    const res = await api.get<ApiResponse<UserRead>>(ENDPOINTS.auth.me);
    return res.data;
}

// ─── Phone OTP ─────────────────────────────────────────────────────────────────
// Phone must be in E.164 format: +919876543210 (country code + number, no spaces).

// Step 1 — send a 6-digit OTP SMS to the given phone number.
export async function sendPhoneOtp(phone: string): Promise<void> {
    const res = await api.post<ApiResponse<null>>(ENDPOINTS.auth.phoneOtp, { phone });
    console.log({
        "result": res
    })
}

// Step 2 — verify the OTP the user received. Works for both sign-up and
// sign-in — the backend creates the Supabase user if new, signs them in if
// they already exist. The returned token pair still needs handing to the
// Supabase client — see `applySession` in lib/supabase/auth.ts — before any
// other bearer-authenticated call (e.g. `updateMe` below) will work.
export async function verifyPhoneOtp(phone: string, token: string): Promise<TokenPair> {
    const res = await api.post<ApiResponse<TokenPair>>(ENDPOINTS.auth.phoneVerify, { phone, token });
    return res.data;
}
