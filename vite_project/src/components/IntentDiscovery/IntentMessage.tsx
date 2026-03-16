import type {MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import {useTranslationState} from "../../state/Translation/useTranslationState.ts";
import type {IntentControllerState} from "../../domain/intent.types.ts";
import {buildAiInterpretationPayload} from "../../lib/ai-recommendations.ts";
import {useSystemState} from "../../state/System/useSystemState.ts";
import {useOptionLabelMap} from "../../hooks/domain/useOptionLabelMap.ts";
import {useState} from "react";
import {sendRequestToAi} from "../../services/message-interpret.ts";
import {SpinnerOverlay} from "../SpinnerOverlay.tsx";

type Props = {
    config: IntentDiscoveryDataConfig,
    intent: IntentControllerState,
    attributeLayerData: MagentoProducts
};
export const IntentMessage = ({intent, attributeLayerData, config}: Props) => {
    const { intentState, setIntentText, setPreference, intentApiClient } = useSystemState()
    const optionLabelMap = useOptionLabelMap(attributeLayerData?.aggregations);

    const {t} = useTranslationState()

    const [loading, setLoading] = useState(false)

    const handleAsk = async () => {
        const payload = buildAiInterpretationPayload(
            intentState,
            attributeLayerData?.aggregations,
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

                for (const [attribute, value] of Object.entries(json?.filters)) {
                    setPreference(attribute, value)
                }
            }
        })
    }

    if (loading) return <SpinnerOverlay />

    return (
        <div className="finder">
            <h2 className="finder__title">{t("May I ask why you came here to shop?")}</h2>
            <div className="intent-input-wrapper">
                <input
                    type="text"
                    placeholder={t("Tell us what matters most for your purchase")}
                    value={intent.text}
                    onChange={(e) => intent.setIntent(e.target.value)}
                    className="intent-input"
                />
                <button
                    className="intent-input-button"
                    onClick={handleAsk}
                    disabled={intent.remainingChars > 0}
                >
                    Ask
                </button>
                <div className={`intent-ai-threshold ${intent.remainingChars === 0 ? "ready" : ""}`}>
                    {intent.remainingChars > 0
                        ? t("AI can be activated in %s more characters", intent.remainingChars)
                        : t("AI ready to interpret your request")}
                </div>
            </div>
        </div>
    )
}