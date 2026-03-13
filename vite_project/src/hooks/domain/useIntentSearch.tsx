import type {MagentoProducts} from "../infra/useProductAttributeLayer.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";

const MIN_TEXT_LENGTH = 50

export const useIntentSearch = (
    attributeLayerData: MagentoProducts | undefined,
    config: IntentDiscoveryDataConfig,
) => {

    const threshold = config.ai?.matchThreshold ?? MIN_TEXT_LENGTH
    const total = attributeLayerData?.total_count ?? 0

    return {
        total,
        shouldSearch: total <= threshold
    }
}