import { LOGIN_FLOW_STEPS } from '@/constants/auth/loginFlow';
import { FlowStep, useFlowStep } from './use-flow-step';

export function useLoginStep(): FlowStep {
    return useFlowStep(LOGIN_FLOW_STEPS);
}

export default useLoginStep;
