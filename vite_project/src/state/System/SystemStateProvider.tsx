import {type ReactNode, useEffect, useMemo, useState} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import {createGraphqlClient} from "../../lib/graphql.ts";
import type {ReactEdgeRuntimeIntegrations} from "../../domain/intent-discovery.types.ts";
import {createIntentEngine} from "../../integration/intent/IntentEngine.ts";

interface SystemStateProviderProps {
    children: ReactNode;
    config: ReactEdgeRuntimeIntegrations;
}

const LocalStateProvider = LocalSystemStateContext.Provider;

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({ children, config }) => {
    if (!config?.magentoGraphql?.api) {
        throw new Error('GraphQL client cannot be created without API endpoint');
    }

    const graphqlClient = useMemo(
        () => createGraphqlClient(config.magentoGraphql.api),
        [config.magentoGraphql?.api]
    );

    // ✅ One single engine instance
    const intentEngine = useMemo(
        () => createIntentEngine(),
        []
    );

    const [intentState, setIntentState] = useState(
        intentEngine.getState()
    );

    useEffect(() => {
        const handler = (event: any) => {
            const signal = event.detail;

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
                intentState
            }}
        >
            {children}
        </LocalStateProvider>
    );
};