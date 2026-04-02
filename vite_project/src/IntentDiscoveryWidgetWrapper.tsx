import {useWidgetConfig} from "./hooks/useWidgetConfig.ts";
import {ErrorState} from "./components/global/ErrorState.tsx";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {IntentLookup} from "./components/IntentLookup.tsx";
import {TranslationStateProvider} from "./state/Translation/TranslationStateProvider.tsx";
import {SpinnerOverlay} from "./components/global/SpinnerOverlay.tsx";
import {IntentStateProvider} from "./state/Intent/IntentStateProvider.tsx";

type Props = {
    host: HTMLElement;
};

export const IntentDiscoveryWidgetWrapper = ({ host }: Props) => {
    const {config, error, loading} = useWidgetConfig(host);

    if (!config) return null;
    if (error) return <ErrorState error={error}  />

    return  <SystemStateProvider config={config.integrations} store={config.storeCode}>
                <IntentStateProvider config={config.data}>
                    <TranslationStateProvider translations={config.translations}>
                        <div className="intent-widget-container">
                            {loading ? <SpinnerOverlay /> : <IntentLookup config={config} />}
                        </div>
                    </TranslationStateProvider>
                </IntentStateProvider>
            </SystemStateProvider>
};

