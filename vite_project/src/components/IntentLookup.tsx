import type {ResolvedIntentDiscoveryConfig} from "../domain/intent-discovery.types.ts";
import {useCurrentIntentCategory} from "../hooks/domain/useCurrentIntentCategory.tsx";
import {IntentDiscoveryWidget} from "./IntentDiscoveryWidget.tsx";

export interface Props {
    config: ResolvedIntentDiscoveryConfig
}
export const IntentLookup = ({ config }: Props) => {
    const category = useCurrentIntentCategory(config.data.enabledCategories);

    if (!category) return null;

    return (
        <IntentDiscoveryWidget config={config} categoryUrlKey={category} />
    )
}