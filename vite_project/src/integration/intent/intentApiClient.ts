import type {AiRecommendationRequest, AiRecommendationResponse} from "../../hooks/infra/useAiRecommendations.tsx";
import type {AiInterpretationRequest, AiInterpretationResponse} from "../../hooks/infra/useAiInterpreter.tsx";

export interface IntentApiClientConfig {
    baseUrl: string;
    store: string;
    promptVersion: string;
}

export interface IntentApiClient {
    suggest(payload: AiRecommendationRequest): Promise<AiRecommendationResponse>;
    interpret(payload: AiInterpretationRequest): Promise<AiInterpretationResponse>;
    dummy(payload: AiInterpretationRequest): Promise<AiInterpretationResponse>;
}

export const createIntentApiClient = (
    config: IntentApiClientConfig
): IntentApiClient => {
    const { baseUrl, store, promptVersion } = config;

    const call = async (path: string, payload: unknown) => {
        const response = await fetch(`${baseUrl}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Store": store,
                "X-Prompt-Version": promptVersion
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Intent API request failed: ${path}`);
        }

        return response.json();
    };

    return {
        suggest: (payload) => call("/intent/suggest", payload),
        interpret: (payload) => call("/intent/interpret", payload),
        dummy: (payload) => call("/intent/dummy", payload),
    };
};
