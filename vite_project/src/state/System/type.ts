import type {GraphqlClient} from "../../lib/graphql.ts";
import type {IntentEngine} from "../../integration/intent/IntentEngine.ts";
import type {IntentState} from "../../integration/intent/types.ts";
import type {AiRecommendationRequest, AiRecommendationResponse} from "../../hooks/infra/useAiRecommendations.tsx";
import type {AiInterpretationRequest, AiInterpretationResponse} from "../../hooks/infra/useAiInterpreter.tsx";

export interface IntentApiClient {
    suggest: (payload: AiRecommendationRequest) => Promise<AiRecommendationResponse>;
    interpret: (payload: AiInterpretationRequest) => Promise<AiInterpretationResponse>
}

export interface SystemState {
    graphqlClient: GraphqlClient;
    intentApiClient: IntentApiClient
    intentEngine: IntentEngine;
    intentState: IntentState;
    setPreference: (attributeCode: string, optionValue: string) => void
}