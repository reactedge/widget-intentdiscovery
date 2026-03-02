import type { ResolvedIntentDiscoveryConfig } from "../domain/intent-discovery.types.ts";
import { useCategory } from "../hooks/domain/useCategory.tsx";
import { Spinner } from "./global/Spinner.tsx";
import { ErrorState } from "./global/ErrorState.tsx";
import { IntentDiscovery } from "./IntentDiscovery.tsx";
import { OptionPreferenceStateProvider } from "../state/OptionPreference/OptionPreferenceStateProvider.tsx";
import { ActiveAttributeStateProvider } from "../state/ActiveAttribute/ActiveAttributeStateProvider.tsx";
import {useSystemState} from "../state/System/useSystemState.ts";
import {activity} from "../activity";

type Props = {
    config: ResolvedIntentDiscoveryConfig
};

export const IntentDiscoveryWidget = ({ config }: Props) => {
    const { categoryData, categoryError, categoryLoading } =
        useCategory(config.data.categoryUrlKey);
    const { intentState } = useSystemState();

    if (categoryLoading) return <Spinner />;
    if (categoryError) return <ErrorState />;
    if (!categoryData) return null;

    activity('intent-state', 'Intent State', intentState);

    return (
        <OptionPreferenceStateProvider>
            <ActiveAttributeStateProvider>
                <IntentDiscovery
                    config={config.data}
                    categoryData={categoryData}
                />
            </ActiveAttributeStateProvider>
        </OptionPreferenceStateProvider>
    );
};
