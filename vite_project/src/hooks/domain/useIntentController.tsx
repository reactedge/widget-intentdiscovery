import {useState} from "react";
import {useIntentDecision} from "./useIntentDecision.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {MagentoProducts} from "../infra/useProductAttributeLayer.tsx";
import type {IntentControllerState} from "../../domain/intent.types.ts";
import {useActiveCategory} from "./useActiveCategory.tsx";

export const useIntentController = (
    attributeLayerData: MagentoProducts,
    config: IntentDiscoveryDataConfig
) => {
    useActiveCategory(attributeLayerData, config);

    const [intentText, setIntentText] = useState("");
    const { remainingChars } = useIntentDecision(config, intentText)

    const intent: IntentControllerState = {
        text: intentText,
        setIntent: setIntentText,
        remainingChars
    }

    return { intent }
}