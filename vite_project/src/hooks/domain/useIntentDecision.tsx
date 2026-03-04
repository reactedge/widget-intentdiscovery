import type {MagentoProducts} from "../infra/useProductAttributeLayer.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";

export const useIntentDecision = (attributeLayerData: MagentoProducts | undefined, config: IntentDiscoveryDataConfig) => {
    const threshold = config.ai.matchThreshold
    const total = attributeLayerData?.total_count ?? 0

    return {
        total,
        shouldSearch: total <= threshold
    }
}