import { api } from './apiClient';

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
    const res = await api.post<ApiResponse<TokenPair>>('/api/v1/auth/login', payload);
    return res.data;
}

export async function register(payload: RegisterPayload): Promise<UserRead> {
    const res = await api.post<ApiResponse<UserRead>>('/api/v1/auth/register', payload);
    return res.data;
}

export async function refresh(refresh_token: string): Promise<TokenPair> {
    const res = await api.post<ApiResponse<TokenPair>>('/api/v1/auth/refresh', { refresh_token });
    return res.data;
}

export async function me(): Promise<UserRead> {
    const res = await api.get<ApiResponse<UserRead>>('/api/v1/auth/me');
    return res.data;
}
