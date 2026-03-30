import { useState} from "react";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {MagentoAggregation} from "../../hooks/infra/useProductAttributeLayer.tsx";
import type {IntentControllerState} from "../../domain/intent.types.ts";
import {useAskAi} from "../../hooks/domain/useAiInterpretation.tsx";
import {AttributeSelectorLayer} from "../AttributeLayer/AttributeSelectorLayer.tsx";
import {IntentExplanation} from "../AttributeLayer/IntentExplanation.tsx";
import {SearchSpinnerOverlay} from "../global/SearchSpinnerOverlay.tsx";
import {useIntentState} from "../../state/Intent/useIntentState.ts";

type Props = {
    config: IntentDiscoveryDataConfig
    intent: IntentControllerState
    searchPossible: boolean
    aggregations: MagentoAggregation[],
    disabled: boolean
}

export const AttributeLayer = ({
       config,
       intent,
       searchPossible,
       aggregations,
       disabled
    }: Props) => {
    const [loading, setLoading] = useState(false);
    const { setIntentStatus } = useIntentState()

    const askAi = useAskAi({
        intent,
        aggregations,
        config,
        setLoading
    })

    const handleAsk = () => {
        if (intent.text?.trim()) {
            askAi()
        } else {
            setIntentStatus("readyToSearch")
        }
    }

    if (loading) return <SearchSpinnerOverlay />

    return (
            <div className="finder">
                <IntentExplanation
                    remainingChars={intent.remainingChars}
                    searchPossible={searchPossible}
                    onAsk={handleAsk}
                />
                <AttributeSelectorLayer
                    isDisabled={disabled}
                    aggregations={aggregations}
                    config={config}
                />
            </div>
    );
};
