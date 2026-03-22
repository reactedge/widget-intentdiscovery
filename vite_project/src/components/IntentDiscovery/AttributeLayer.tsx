import { useState} from "react";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import {useSystemState} from "../../state/System/useSystemState.ts";
import type {MagentoAggregation} from "../../hooks/infra/useProductAttributeLayer.tsx";
import type {IntentControllerState} from "../../domain/intent.types.ts";
import {useOptionLabelMap} from "../../hooks/domain/useOptionLabelMap.ts";
import {SpinnerOverlay} from "../SpinnerOverlay.tsx";
import {useAskAi} from "../../hooks/domain/useAiInterpretation.tsx";
import {AttributeSelectorLayer} from "../AttributeLayer/AttributeSelectorLayer.tsx";
import {IntentExplanation} from "../AttributeLayer/IntentExplanation.tsx";

type Props = {
    config: IntentDiscoveryDataConfig
    intent: IntentControllerState
    searchPossible: boolean
    aggregations: MagentoAggregation[]
    disabled: boolean
}

export const AttributeLayer = ({
       config,
       intent,
       searchPossible,
       aggregations,
       disabled
    }: Props) => {
    const { intentState, setIntentText, setIntentStatus, setPreference, intentApiClient } = useSystemState()
    const optionLabelMap = useOptionLabelMap(aggregations);
    const [loading, setLoading] = useState(false);

    const handleAsk = useAskAi({
        intentState,
        intent,
        aggregations,
        optionLabelMap,
        config,
        intentApiClient,
        setIntentText,
        setIntentStatus,
        setPreference,
        setLoading
    });

    if (loading) return <SpinnerOverlay />

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
