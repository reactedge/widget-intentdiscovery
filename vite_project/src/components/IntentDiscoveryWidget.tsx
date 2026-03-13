import type { ResolvedIntentDiscoveryConfig } from "../domain/intent-discovery.types.ts";
import { useCategory } from "../hooks/domain/useCategory.tsx";
import { Spinner } from "./global/Spinner.tsx";
import { ErrorState } from "./global/ErrorState.tsx";
import { OptionPreferenceStateProvider } from "../state/OptionPreference/OptionPreferenceStateProvider.tsx";
import { ActiveAttributeStateProvider } from "../state/ActiveAttribute/ActiveAttributeStateProvider.tsx";
import {IntentDiscoveryLoader} from "./IntentDiscovery/IntentDiscoveryLoader.tsx";

type Props = {
    config: ResolvedIntentDiscoveryConfig
    categoryUrlKey: string
};

export const IntentDiscoveryWidget = ({ config, categoryUrlKey }: Props) => {
    const { categoryData, categoryError, categoryLoading } =
        useCategory(categoryUrlKey);

    if (categoryLoading) return <Spinner />;
    if (categoryError) return <ErrorState error={categoryError}  />;
    if (!categoryData) return null;

    return (
        <OptionPreferenceStateProvider>
            <ActiveAttributeStateProvider>
                <IntentDiscoveryLoader
                    config={config.data}
                    categoryData={categoryData}
                />
            </ActiveAttributeStateProvider>
        </OptionPreferenceStateProvider>
    );
};
