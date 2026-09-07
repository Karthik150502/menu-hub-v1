import { REGISTER_FLOW_STEPS } from '@/constants/auth/registerFlow';
import { FlowStep, useFlowStep } from './use-flow-step';

export type { FlowStep as RegisterStep };

export function useRegisterStep(): FlowStep {
    return useFlowStep(REGISTER_FLOW_STEPS);
}

export default useRegisterStep;
