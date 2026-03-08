import type {MagentoProducts} from "../infra/useProductAttributeLayer.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";

export const useIntentDecision = (
    attributeLayerData: MagentoProducts | undefined,
    config: IntentDiscoveryDataConfig,
    intentText: string
) => {

    const threshold = config.ai?.matchThreshold ?? 50
    const total = attributeLayerData?.total_count ?? 0

    const text = intentText.trim()
    const hasTextIntent = text.length > 50

    return {
        total,
        shouldSearch: total <= threshold,
        shouldInterpret: total > threshold && hasTextIntent
    }
}