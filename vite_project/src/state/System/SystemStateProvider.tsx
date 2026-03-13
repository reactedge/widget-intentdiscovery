import {type ReactNode, useEffect, useMemo, useState} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import {createGraphqlClient} from "../../lib/graphql.ts";
import type {ReactEdgeRuntimeIntegrations} from "../../domain/intent-discovery.types.ts";
import {createIntentEngine} from "../../integration/intent/IntentEngine.ts";
import type {AiRecommendationRequest} from "../../hooks/infra/useAiRecommendations.tsx";
import type {IntentSignal, IntentStatus} from "../../integration/intent/types.ts";
import type {AiInterpretationRequest} from "../../hooks/infra/useAiInterpreter.tsx";

interface SystemStateProviderProps {
    children: ReactNode;
    config: ReactEdgeRuntimeIntegrations;
    store: string
}

const LocalStateProvider = LocalSystemStateContext.Provider;

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({ children, config, store }) => {
    if (!config?.magentoGraphql?.api) {
        throw new Error('GraphQL client cannot be created without API endpoint');
    }
    if (!config?.intentApi?.baseUrl) {
        throw new Error('intentApi endpoint is required');
    }

    const graphqlClient = useMemo(
        () => createGraphqlClient(config.magentoGraphql.api, store),
        [config.magentoGraphql?.api]
    );

    // ✅ One single engine instance
    const intentEngine = useMemo(
        () => createIntentEngine(),
        []
    );

    const intentApiClient = useMemo(() => {
        const baseUrl = config.intentApi?.baseUrl ?? "";

        return {
            suggest: async (payload: AiRecommendationRequest) => {
                const response = await fetch(`${baseUrl}/intent/suggest`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Store": store },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error("Intent API request failed");
                }

                return response.json();
            },
            interpret: async (payload: AiInterpretationRequest) => {
                const response = await fetch(`${baseUrl}/intent/interpret`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Store": store },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error("Intent API request failed");
                }

                return response.json();
            },
            dummy: async (payload: AiInterpretationRequest) => {
                const response = await fetch(`${baseUrl}/intent/dummy`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Store": store },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error("Intent API request failed");
                }

                return response.json();
            }
        };
    }, [config.intentApi?.baseUrl]);

    const setPreference = (attributeCode: string, optionValue: string) => {
        setIntentState(prev => {

            const attributeScore = { ...(prev.attributeScore ?? {}) }

            if (!attributeScore[attributeCode]) {
                attributeScore[attributeCode] = {}
            }

            attributeScore[attributeCode][optionValue] = 1

            return {
                ...prev,
                attributeScore
            }
        })
    }

    const setIntentStatus = (status: IntentStatus) => {
        setIntentState(prev => ({
            ...prev,
            status
        }))
    }

    const setIntentText = (text: string) => {
        setIntentState(prev => ({
            ...prev,
            intentText: text
        }))
    }

    const [intentState, setIntentState] = useState(
        intentEngine.getState()
    );

    useEffect(() => {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<IntentSignal>;

            const signal = customEvent.detail;

            intentEngine.handle(signal);
            setIntentState({ ...intentEngine.getState() });
        };

        window.addEventListener("reactedge:intent", handler);

        return () => {
            window.removeEventListener("reactedge:intent", handler);
        };
    }, [intentEngine]);

    return (
        <LocalStateProvider
            value={{
                graphqlClient,
                intentApiClient,
                intentEngine,
                intentState,
                setIntentText,
                setIntentStatus,
                setPreference
            }}
        >
            {children}
        </LocalStateProvider>
    );
};