import type {IntentEngineState, IntentStatus} from "../../integration/intent/types.ts";

export interface IntentState {
    intentState: IntentEngineState;
    setIntentText: (text: string) => void
    setIntentStatus: (status: IntentStatus) => void
    setPreference: (attributeCode: string, optionValue: string) => void,
    resetPreference: () => void
}