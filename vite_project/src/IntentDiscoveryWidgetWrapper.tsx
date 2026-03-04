import {useWidgetConfig} from "./hooks/useWidgetConfig.ts";
import {ErrorState} from "./components/global/ErrorState.tsx";
import {Spinner} from "./components/global/Spinner.tsx";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {IntentLookup} from "./components/IntentLookup.tsx";

type Props = {
    host: HTMLElement;
};

export const IntentDiscoveryWidgetWrapper = ({ host }: Props) => {
    const {config, error, loading} = useWidgetConfig(host);

    if (!config) return null;
    if (error) return <ErrorState error={error}  />
    if (loading) return <Spinner />

    return  <SystemStateProvider config={config.integrations}>
                <IntentLookup config={config} />
            </SystemStateProvider>
};

