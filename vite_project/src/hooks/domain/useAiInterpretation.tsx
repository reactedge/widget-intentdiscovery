import {buildAiInterpretationPayload} from "../../lib/ai-recommendations.ts";
import {sendRequestToAi} from "../../services/message-interpret.ts";
import type {IntentState, IntentStatus} from "../../integration/intent/types.ts";
import type {IntentControllerState} from "../../domain/intent.types.ts";
import type {MagentoAggregation} from "../infra/useProductAttributeLayer.tsx";
import type {OptionLabelMap} from "../../state/OptionPreference/type.ts";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {IntentApiClient} from "../../state/System/type.ts";

type UseAskAiParams = {
    intentState: IntentState;
    intent: IntentControllerState;
    aggregations: MagentoAggregation[];
    optionLabelMap: OptionLabelMap;
    config: IntentDiscoveryDataConfig;
    intentApiClient: IntentApiClient;

    setIntentText: (text: string) => void;
    setIntentStatus: (status: IntentStatus) => void;
    setPreference: (attribute: string, value: string) => void;

    setLoading: (loading: boolean) => void;
};

export const useAskAi = ({
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
  }: UseAskAiParams) => {
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
                if (!json?.filters) return

                setIntentText(intent.text)
                setIntentStatus("readyToSearch")

                for (const [attribute, value] of Object.entries(json?.filters)) {
                    setPreference(attribute, value)
                }
            }
        })
    }
};