import { supabase } from '@/lib/supabase';
import { ENV } from '@/constants/env';
import axios from 'axios';

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

// ─── Axios instance ───────────────────────────────────────────────────────────

// eslint-disable-next-line import/no-named-as-default-member
const client = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach the Supabase JWT on every request so FastAPI can verify the user.
client.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
});

// ─── Error normalization ──────────────────────────────────────────────────────

function toApiError(err: unknown): ApiError {
    // eslint-disable-next-line import/no-named-as-default-member
    if (axios.isAxiosError(err)) {
        const response = err.response;
        if (!response) {
            // Request never got a response — device can't reach BASE_URL, DNS
            // failure, timeout, etc. (see constants/env.ts for the common
            // localhost-on-a-device gotcha).
            return new ApiError(0, 'NETWORK_ERROR', err.message || 'Network request failed');
        }

        // Two error shapes come back from this backend:
        //  - our Response envelope, for business-logic errors: { success: false, message, data: null }
        //  - FastAPI's own validation errors (422), which bypass that envelope: { detail: ValidationError[] }
        const body = response.data ?? {};
        const detail = body?.detail;

        let code = 'API_ERROR';
        let message: string = response.statusText || err.message;

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

        return new ApiError(response.status, code, message);
    }

    return new ApiError(0, 'UNKNOWN_ERROR', err instanceof Error ? err.message : 'Something went wrong');
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

async function unwrap<T>(request: Promise<{ status: number; data: T }>): Promise<T> {
    try {
        const res = await request;
        // 204 No Content — axios still resolves, just with an empty body.
        if (res.status === 204) return undefined as T;
        return res.data;
    } catch (err) {
        throw toApiError(err);
    }
}

export const api = {
    get: <T>(path: string) => unwrap<T>(client.get<T>(path)),
    post: <T>(path: string, body: unknown) => unwrap<T>(client.post<T>(path, body)),
    patch: <T>(path: string, body: unknown) => unwrap<T>(client.patch<T>(path, body)),
    put: <T>(path: string, body: unknown) => unwrap<T>(client.put<T>(path, body)),
    delete: <T>(path: string) => unwrap<T>(client.delete<T>(path)),
};
