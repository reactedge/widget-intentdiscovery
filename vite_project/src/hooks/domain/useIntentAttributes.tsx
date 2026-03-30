import { useMemo } from "react"
import { getOrderedAttributes } from "../../lib/attributes"
import type {MagentoAggregation} from "../infra/useProductAttributeLayer"
import type { IntentDiscoveryDataConfig } from "../../domain/intent-discovery.types"
import {useIntentState} from "../../state/Intent/useIntentState.ts";

export function useFindIntentProducts() {
    const {intentState} = useIntentState()
    const intentAttributes = Object.keys(intentState.attributeScore)

    return intentAttributes.join("\n")
}

export function useIntentAttributes(
    attributeData: MagentoAggregation[],
    config: IntentDiscoveryDataConfig
) {
    return useMemo(
        () => getOrderedAttributes(attributeData, config),
        [attributeData, config]
    )
}