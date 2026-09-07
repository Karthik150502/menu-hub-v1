import { api } from './apiClient';
import { UserRead } from './auth';
import { ENDPOINTS } from './endpoints';

// ─── Backend users API ────────────────────────────────────────────────────────
// Wraps FastAPI's /users routes. PATCH /users/me resolves the caller from the
// bearer token attached by apiClient (any Supabase session — email/password
// or phone OTP, see lib/api/auth.ts) and updates the profiles row through
// ProfileService — it doesn't care how that session was created.

// Every backend response is wrapped: { success, message, data }.
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface UpdateMePayload {
    full_name?: string | null;
    avatar_url?: string | null;
}

export async function updateMe(payload: UpdateMePayload): Promise<UserRead> {
    const res = await api.patch<ApiResponse<UserRead>>(ENDPOINTS.users.me, payload);
    return res.data;
}
