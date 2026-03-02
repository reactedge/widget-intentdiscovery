import type {GraphqlClient} from "../../lib/graphql.ts";
import type {IntentEngine} from "../../integration/intent/IntentEngine.ts";
import type {IntentState} from "../../integration/intent/types.ts";
import type {AiRecommendationRequest, AiRecommendationResponse} from "../../hooks/infra/useAiRecommendations.tsx";

export interface IntentApiClient {
    suggest: (payload: AiRecommendationRequest) => Promise<AiRecommendationResponse>;
}

export interface SystemState {
    graphqlClient: GraphqlClient;
    intentApiClient: IntentApiClient
    intentEngine: IntentEngine;
    intentState: IntentState
}