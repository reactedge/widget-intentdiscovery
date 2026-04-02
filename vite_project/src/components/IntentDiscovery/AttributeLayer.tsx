import {useEffect, useRef, useState} from "react";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {IntentControllerState} from "../../domain/intent.types.ts";
import {useAskAi} from "../../hooks/domain/useAiInterpretation.tsx";
import {AttributeSelectorLayer} from "../AttributeLayer/AttributeSelectorLayer.tsx";
import {IntentExplanation} from "../AttributeLayer/IntentExplanation.tsx";
import {useIntentState} from "../../state/Intent/useIntentState.ts";
import {useAnalyseSearch} from "../../hooks/domain/useAnalyseSearch.tsx";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";

type Props = {
    config: IntentDiscoveryDataConfig
    intent: IntentControllerState
    attributeLayerData: MagentoLayeredNavigation,
    categoryData: CategoryData
}

export const AttributeLayer = ({
   config,
   intent,
   attributeLayerData,
   categoryData
}: Props) => {
    const [loading, setLoading] = useState(false);
    const { dispatch, intentState } = useIntentState()

    const askAi = useAskAi({
        intent,
        attributeLayerData,
        config,
        setLoading
    })

    const askAiRecommendations = useAnalyseSearch({
        attributeLayerData,
        categoryData,
        intentState
    });

    useEffect(() => {
        if (intentState.status === "readyToRecommend") {
            askAiRecommendations()
        }
    }, [intentState.status])

    const prevRemaining = useRef<number | null>(null);

    useEffect(() => {
        const prev = prevRemaining.current;
        const current = intent.remainingChars;

        const crossedThreshold =
            prev !== null &&
            prev > 0 &&
            current <= 0;

        if (crossedThreshold) {
            dispatch({ type: "INTERPRETATION_READY" });
        }

        prevRemaining.current = current;
    }, [intent.remainingChars, intent.text]);

    const handleAsk = () => {
        dispatch({ type: "INTERPRETATION_READY" })
        askAi()
    }

    if (loading) return null

    return (
            <div className="finder">
                <IntentExplanation
                    attributeLayerData={attributeLayerData}
                    intent={intent}
                    remainingChars={intent.remainingChars}
                    onAsk={handleAsk}
                />
                <AttributeSelectorLayer
                    attributeLayerData={attributeLayerData}
                    config={config}
                />
            </div>
    );
};


