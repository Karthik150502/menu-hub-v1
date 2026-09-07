import type { RegisterFlowStep } from './registerFlow';

// ─── Login flow manifest ──────────────────────────────────────────────────────
// Mirrors registerFlow.ts, but for the (shorter) sign-in flow: an existing
// user only re-proves their phone number, they don't go through `name` again.
// Kept as its own manifest/routes rather than reusing `/register` + a
// `?mode=signin` query param, so the two flows don't share step-counting or
// navigation logic that has to branch on a URL param.

export const LOGIN_FLOW_STEPS: RegisterFlowStep[] = [
    { route: 'login', label: 'Phone number' },
    { route: 'login-otp', label: 'Verify OTP' },
];
