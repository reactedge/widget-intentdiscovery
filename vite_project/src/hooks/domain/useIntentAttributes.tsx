import {useSystemState} from "../../state/System/useSystemState.ts";
import { useMemo } from "react"
import { getOrderedAttributes } from "../../lib/attributes"
import type {MagentoAggregation} from "../infra/useProductAttributeLayer"
import type { IntentDiscoveryDataConfig } from "../../domain/intent-discovery.types"

export function useFindIntentProducts() {
    const {intentState} = useSystemState()
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