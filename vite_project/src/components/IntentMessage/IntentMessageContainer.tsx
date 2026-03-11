import {useEvaluateMessageIntent} from "../../hooks/domain/useEvaluateMessageIntent.tsx";
import type {MagentoAggregation} from "../../hooks/infra/useProductAttributeLayer.tsx";
import {Spinner} from "../global/Spinner.tsx";
import {ErrorState} from "../global/ErrorState.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import {IntentMessage} from "../IntentMessage.tsx";
import type {IntentControllerState} from "../../domain/intent.types.ts";

type IntentActions = {
    onChange: (intent: string) => void
    onSubmit: () => void
}

type Props = {
    config: IntentDiscoveryDataConfig
    intent: IntentControllerState
    actions: IntentActions
    aggregations: MagentoAggregation[]
}

export const IntentMessageContainer = ({
       config,
       intent,
       actions,
       aggregations
   }: Props) => {

    const { evaluationLoading, evaluationError } = useEvaluateMessageIntent(
        config,
        intent.text,
        aggregations,
        intent.shouldInterpret
    )

    if (evaluationLoading) return <Spinner />
    if (evaluationError) return <ErrorState error={evaluationError} />

    return (
        <IntentMessage
            intentText={intent.text}
            onIntentChange={actions.onChange}
            onSubmit={actions.onSubmit}
            isReady={intent.isIntentValid}
        />
    )
}