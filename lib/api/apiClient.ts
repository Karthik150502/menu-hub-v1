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
        // Two error shapes come back from this backend:
        //  - our Response envelope, for business-logic errors: { success: false, message, data: null }
        //  - FastAPI's own validation errors (422), which bypass that envelope: { detail: ValidationError[] }
        const body = await response.json().catch(() => ({}));
        const detail = body?.detail;

        let code = 'API_ERROR';
        let message: string = response.statusText;

        if (typeof body?.message === 'string') {
            message = body.message;
        } else if (Array.isArray(detail)) {
            code = 'VALIDATION_ERROR';
            message = detail.map((e: any) => e?.msg).filter(Boolean).join('; ') || message;
        } else if (typeof detail === 'string') {
            message = detail;
        } else if (detail && typeof detail === 'object') {
            code = detail.code ?? code;
            message = detail.message ?? message;
        }

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
