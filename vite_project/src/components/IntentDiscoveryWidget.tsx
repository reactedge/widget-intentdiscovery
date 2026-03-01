import type { ResolvedIntentDiscoveryConfig } from "../domain/intent-discovery.types.ts";
import { useCategory } from "../hooks/domain/useCategory.tsx";
import { Spinner } from "./global/Spinner.tsx";
import { ErrorState } from "./global/ErrorState.tsx";
import { IntentDiscovery } from "./IntentDiscovery.tsx";
import { OptionPreferenceStateProvider } from "../state/OptionPreference/OptionPreferenceStateProvider.tsx";
import { LastIntentDisplay } from "./Intent/LastIntentDisplay.tsx";
import { useIntent } from "../hooks/domain/useLastIntent.tsx";
import { AttributeLayer } from "./AttributeLayer.tsx";

type Props = {
    config: ResolvedIntentDiscoveryConfig
};

export const IntentDiscoveryWidget = ({ config }: Props) => {
    const { categoryData, categoryError, categoryLoading } =
        useCategory(config.data.categoryUrlKey);
    const intent = useIntent();

    if (categoryLoading) return <Spinner />;
    if (categoryError) return <ErrorState />;
    if (!categoryData) return null;

    return (
        <OptionPreferenceStateProvider>
            <AttributeLayer categoryData={categoryData} intent={intent} />
            <IntentDiscovery
                config={config.data}
                categoryData={categoryData}
            />
            <LastIntentDisplay intent={intent} />
        </OptionPreferenceStateProvider>
    );
};
