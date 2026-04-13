import {useWidgetConfig} from "./hooks/useWidgetConfig.ts";
import {ErrorState} from "./components/global/ErrorState.tsx";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {IntentLookup} from "./components/IntentLookup.tsx";
import {TranslationStateProvider} from "./state/Translation/TranslationStateProvider.tsx";
import {SpinnerOverlay} from "./components/global/SpinnerOverlay.tsx";
import {IntentStateProvider} from "./state/Intent/IntentStateProvider.tsx";
import {useEffect, useState} from "react";

type Props = {
    host: HTMLElement;
};

export const IntentDiscoveryWidgetWrapper = ({ host }: Props) => {
    const [bootReady, setBootReady] = useState(false);
    const {config, error, loading} = useWidgetConfig(host);

    useEffect(() => {
        if (!config || loading) return;

        // delay first meaningful render
        requestAnimationFrame(() => {
            setBootReady(true);
        });
    }, [config, loading]);

    if (!config) return null;
    if (error) return <ErrorState error={error}  />

    return  <SystemStateProvider config={config.integrations} store={config.storeCode}>
                <IntentStateProvider config={config.data}>
                    <TranslationStateProvider translations={config.translations}>
                        <div className="intent-widget-container">
                            {loading || !bootReady
                                ? <SpinnerOverlay/>
                                : <IntentLookup config={config} host={host}/>
                            }
                        </div>
                    </TranslationStateProvider>
                </IntentStateProvider>
    </SystemStateProvider>
};

