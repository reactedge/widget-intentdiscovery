import {buildAiInterpretationPayload} from "../../lib/ai-recommendations.ts";
import {sendRequestToAi} from "../../services/message-interpret.ts";
import type {IntentControllerState} from "../../domain/intent.types.ts";
import type {MagentoAggregation} from "../infra/useProductAttributeLayer.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import {useOptionLabelMap} from "./useOptionLabelMap.ts";
import {useSystemState} from "../../state/System/useSystemState.ts";
import {useIntentState} from "../../state/Intent/useIntentState.ts";

type UseAskAiParams = {
    intent: IntentControllerState;
    aggregations: MagentoAggregation[];
    config: IntentDiscoveryDataConfig;
    setLoading: (loading: boolean) => void;
};

export const useAskAi = ({
      intent,
      aggregations,
      config,
      setLoading
  }: UseAskAiParams) => {
    const optionLabelMap = useOptionLabelMap(aggregations);
    const { intentEngine} = useSystemState()
    const { intentState, setIntentText, setIntentStatus, setPreference, resetPreference} = useIntentState()
    const intentApiClient = intentEngine.getApiClient()

    return async () => {
        const payload = buildAiInterpretationPayload(
            intentState,
            aggregations,
            intent.text,
            optionLabelMap,
            config
        )

        await sendRequestToAi({
            payload,
            intentApiClient,
            setLoading,
            onSuccess: (json) => {
                resetPreference()
                setIntentStatus("readyToSearch")
                if (!json?.filters) return

                setIntentText(intent.text)

                for (const filter of json?.filters || []) {
                    if (!filter.attribute || !filter.value) {
                        continue
                    }

                    setPreference(filter.attribute, filter.value)
                }
            }
        })
    }
};