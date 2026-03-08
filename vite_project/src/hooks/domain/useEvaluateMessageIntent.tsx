import {useAiInterpreter} from "../infra/useAiInterpreter.tsx";
import type {MagentoAggregation} from "../infra/useProductAttributeLayer.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import {useIntentAttributes} from "./useIntentAttributes.tsx";

export function useEvaluateMessageIntent(
    config: IntentDiscoveryDataConfig,
    intentText: string,
    aggregations: MagentoAggregation[],
    enabled: boolean
) {
    const attributes = useIntentAttributes(aggregations, config)

    const {
        data: aiFilters,
        loading: aiLoading,
        error: aiError,
    } = useAiInterpreter(attributes, intentText, enabled);

    return {
        evaluationFilters: aiFilters,
        evaluationLoading: aiLoading,
        evaluationError: aiError,
    };
}