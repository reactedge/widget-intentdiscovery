import {type ReactNode, useEffect, useMemo, useState} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import {createGraphqlClient} from "../../lib/graphql.ts";
import type {ReactEdgeRuntimeIntegrations} from "../../domain/intent-discovery.types.ts";
import {createIntentEngine} from "../../integration/intent/IntentEngine.ts";
import type {IntentSignal, IntentStatus} from "../../integration/intent/types.ts";
import {createIntentApiClient} from "../../integration/intent/intentApiClient.ts";

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

    const graphqlClient = useMemo(
        () => createGraphqlClient(config.magentoGraphql.api, store),
        [config.magentoGraphql?.api, store]
    );

    const intentApi = config.intentApi;

    if (!intentApi?.baseUrl) {
        throw new Error('intentApi endpoint is required');
    }

    const intentApiClient = useMemo(() => {
        return createIntentApiClient({
            baseUrl: intentApi.baseUrl,
            store
        });
    }, [
        intentApi.baseUrl,
        store
    ]);

    // ✅ One single engine instance
    const intentEngine = useMemo(
        () => createIntentEngine({
            intentApiClient
        }),
        [intentApiClient]
    );

    const [intentState, setIntentState] = useState(
        intentEngine.getState()
    );

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

    const resetPreference = () => {
        setIntentState(prev => ({
            ...prev,
            attributeScore: {}
        }))
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
                intentEngine,
                intentState,
                setIntentText,
                setIntentStatus,
                setPreference,
                resetPreference
            }}
        >
            {children}
        </LocalStateProvider>
    );
};