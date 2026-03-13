import type {GraphqlClient} from "../../lib/graphql.ts";
import type {IntentEngine} from "../../integration/intent/IntentEngine.ts";
import type {IntentState, IntentStatus} from "../../integration/intent/types.ts";
import type {AiRecommendationRequest, AiRecommendationResponse} from "../../hooks/infra/useAiRecommendations.tsx";
import type {AiInterpretationRequest, AiInterpretationResponse} from "../../hooks/infra/useAiInterpreter.tsx";

export interface IntentApiClient {
    suggest: (payload: AiRecommendationRequest) => Promise<AiRecommendationResponse>;
    interpret: (payload: AiInterpretationRequest) => Promise<AiInterpretationResponse>
    dummy: (payload: AiInterpretationRequest) => Promise<AiInterpretationResponse>
}

export interface SystemState {
    graphqlClient: GraphqlClient;
    intentApiClient: IntentApiClient
    intentEngine: IntentEngine;
    intentState: IntentState;
    setIntentText: (text: string) => void
    setIntentStatus: (status: IntentStatus) => void
    setPreference: (attributeCode: string, optionValue: string) => void
}