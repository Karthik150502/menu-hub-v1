// ─── API endpoint paths ───────────────────────────────────────────────────────
// Single source of truth for every FastAPI route this app calls, so callers
// (auth.ts, users.ts, …) never hardcode a path string. Mirrors the backend's
// route prefixes (see fastapi-supabase-starter/app/api/v1/endpoints/*.py) —
// keep this in sync when a route is added, renamed, or moved there.

const V1 = '/api/v1';

export const ENDPOINTS = {
    auth: {
        login: `${V1}/auth/login`,
        register: `${V1}/auth/register`,
        refresh: `${V1}/auth/refresh`,
        me: `${V1}/auth/me`,
        phoneOtp: `${V1}/auth/phone/otp`,
        phoneVerify: `${V1}/auth/phone/verify`,
    },
    users: {
        me: `${V1}/users/me`,
    },
} as const;

export const SUPABASE_ENDPOINTS = {
    users: {

    }
}
