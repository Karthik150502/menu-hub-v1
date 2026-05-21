import { supabase } from '@/lib/supabase';
import { ENV } from '@/constants/env';

const BASE_URL = ENV.API_URL;

// ─── API error ────────────────────────────────────────────────────────────────
// A typed error so callers can distinguish network errors from server errors
// and render the right message in the UI.

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: string,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    // Attach the Supabase JWT on every request so FastAPI can verify the user.
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        // FastAPI returns { detail: string | { code, message } }
        const body = await response.json().catch(() => ({}));
        const detail = body?.detail;
        const code = typeof detail === 'object' ? detail?.code : 'API_ERROR';
        const message = typeof detail === 'object' ? detail?.message : (detail ?? response.statusText);
        throw new ApiError(response.status, code, message);
    }

    // 204 No Content — return undefined instead of trying to parse empty body
    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

export const api = {
    get: <T>(path: string) => apiFetch<T>(path),
    post: <T>(path: string, body: unknown) => apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    patch: <T>(path: string, body: unknown) => apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) => apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};