import type {GraphqlClient} from "../../lib/graphql.ts";
import type {IntentEngine} from "../../integration/intent/IntentEngine.ts";
import type {IntentState, IntentStatus} from "../../integration/intent/types.ts";

export interface SystemState {
    graphqlClient: GraphqlClient;
    intentEngine: IntentEngine;
    intentState: IntentState;
    setIntentText: (text: string) => void
    setIntentStatus: (status: IntentStatus) => void
    setPreference: (attributeCode: string, optionValue: string) => void,
    resetPreference: () => void
}