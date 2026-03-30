import {type ReactNode, useMemo} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import {createGraphqlClient} from "../../lib/graphql.ts";
import type {ReactEdgeRuntimeIntegrations} from "../../domain/intent-discovery.types.ts";
import {createIntentEngine} from "../../integration/intent/IntentEngine.ts";
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

    return (
        <LocalStateProvider
            value={{
                graphqlClient,
                intentEngine
            }}
        >
            {children}
        </LocalStateProvider>
    );
};