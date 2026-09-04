import { REGISTER_FLOW_STEPS } from '@/constants/auth/registerFlow';
import { usePathname } from 'expo-router';

export interface RegisterStep {
    currentStep: number;
    totalSteps: number;
    stepLabel?: string;
}

/**
 * Resolves the current screen's position in the registration flow from its
 * route name against the REGISTER_FLOW_STEPS manifest, so individual screens
 * never hardcode a step number or total — the count stays correct as steps
 * are added, removed, or reordered in one place.
 *
 * Falls back to step 1 for a route not listed in the manifest (e.g. `welcome`,
 * which is an intro screen rather than a numbered step).
 */
export function useRegisterStep(): RegisterStep {
    const pathname = usePathname();
    const routeName = pathname.split('/').filter(Boolean).pop() ?? '';
    const index = REGISTER_FLOW_STEPS.findIndex((step) => step.route === routeName);

    return {
        currentStep: index === -1 ? 1 : index + 1,
        totalSteps: REGISTER_FLOW_STEPS.length,
        stepLabel: index === -1 ? undefined : REGISTER_FLOW_STEPS[index].label,
    };
}

export default useRegisterStep;
