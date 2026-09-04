// ─── Register flow manifest ───────────────────────────────────────────────────
// Single source of truth for the numbered steps in app/(auth)'s registration
// flow. `welcome` is an intro screen, not a numbered step, so it's excluded.
//
// To add a step: add a screen under app/(auth), register it in
// app/(auth)/_layout.tsx, then add one line here. useRegisterStep (see
// hooks/use-register-step.ts) resolves each screen's position and the new
// total from this list automatically — no other screen needs to change.

export interface RegisterFlowStep {
    /** Route/file name under app/(auth), e.g. "register" for register.tsx */
    route: string;
    /** Shown next to the step count, e.g. "Step 1 of 2 · Phone number" */
    label: string;
}

export const REGISTER_FLOW_STEPS: RegisterFlowStep[] = [
    { route: 'register', label: 'Phone number' },
    { route: 'otp', label: 'Verify OTP' },
];
