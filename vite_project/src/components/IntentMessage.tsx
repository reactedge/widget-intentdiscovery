import {useEvaluateMessageIntent} from "../hooks/domain/useEvaluateMessageIntent.tsx";
import type {MagentoProducts} from "../hooks/infra/useProductAttributeLayer.tsx";
import {Spinner} from "./global/Spinner.tsx";
import {ErrorState} from "./global/ErrorState.tsx";
import type {IntentDiscoveryDataConfig} from "../domain/intent-discovery.types.ts";

type Props = {
    config: IntentDiscoveryDataConfig,
    shouldInterpret: boolean,
    intentText: string,
    onIntentChange: (intent: string) => void,
    attributeLayerData: MagentoProducts
};
export const IntentMessage = ({config, shouldInterpret, intentText, onIntentChange, attributeLayerData}: Props) => {
    const { evaluationLoading, evaluationError } = useEvaluateMessageIntent(
        config,
        intentText,
        attributeLayerData?.aggregations,
        shouldInterpret
    )

    if (evaluationLoading) return <Spinner />
    if (evaluationError) return <ErrorState error={evaluationError} />

    return (
        <div className="intent-input-wrapper">
            <input
                type="text"
                placeholder="Tell us what matters most for your purchase"
                value={intentText}
                onChange={(e) => onIntentChange(e.target.value)}
                className="intent-input"
            />
        </div>
    )
}