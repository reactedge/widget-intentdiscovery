import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {IntentLookup} from "./components/IntentLookup.tsx";
import {TranslationStateProvider} from "./state/Translation/TranslationStateProvider.tsx";
import {SpinnerOverlay} from "./components/global/SpinnerOverlay.tsx";
import {IntentStateProvider} from "./state/Intent/IntentStateProvider.tsx";
import {useEffect, useState} from "react";
import {type IntentDiscoveryWidgetConfig, readWidgetConfig} from "./IntentDiscoveryConfig.ts";

type Props = {
    host: HTMLElement;
    rawConfig: IntentDiscoveryWidgetConfig;
    storeCode: string
};

export const IntentDiscoveryWidgetWrapper = ({ host, rawConfig, storeCode }: Props) => {
    const [bootReady, setBootReady] = useState(false);
    const config = readWidgetConfig(rawConfig, storeCode);

    useEffect(() => {
        if (!config) return;

        // delay first meaningful render
        requestAnimationFrame(() => {
            setBootReady(true);
        });
    }, [config]);

    if (!config) return null;

    return  <SystemStateProvider config={config.integrations} store={config.storeCode}>
                <IntentStateProvider config={config.data}>
                    <TranslationStateProvider translations={config.translations}>
                        <div className="intent-widget-container">
                            {!bootReady
                                ? <SpinnerOverlay/>
                                : <IntentLookup config={config} host={host}/>
                            }
                        </div>
                    </TranslationStateProvider>
                </IntentStateProvider>
    </SystemStateProvider>
};

