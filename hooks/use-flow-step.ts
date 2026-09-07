import { RegisterFlowStep } from '@/constants/auth/registerFlow';
import { usePathname } from 'expo-router';

export interface FlowStep {
    currentStep: number;
    totalSteps: number;
    stepLabel?: string;
}

/**
 * Resolves the current screen's position in a numbered auth flow from its
 * route name against the given step manifest (e.g. REGISTER_FLOW_STEPS or
 * LOGIN_FLOW_STEPS), so individual screens never hardcode a step number or
 * total — the count stays correct as steps are added, removed, or reordered
 * in one place.
 *
 * Falls back to step 1 for a route not listed in the manifest (e.g. `welcome`,
 * which is an intro screen rather than a numbered step).
 */
export function useFlowStep(steps: RegisterFlowStep[]): FlowStep {
    const pathname = usePathname();
    const routeName = pathname.split('/').filter(Boolean).pop() ?? '';
    const index = steps.findIndex((step) => step.route === routeName);

    return {
        currentStep: index === -1 ? 1 : index + 1,
        totalSteps: steps.length,
        stepLabel: index === -1 ? undefined : steps[index].label,
    };
}

export default useFlowStep;
