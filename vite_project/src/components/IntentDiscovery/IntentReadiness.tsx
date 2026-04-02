import {useIntentState} from "../../state/Intent/useIntentState.ts";
import {Warning} from "./IntentReadiness/Warning.tsx";
import {Success} from "./IntentReadiness/Success.tsx";
import {NoResult} from "./IntentReadiness/NoResult.tsx";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";

type Props = {
    attributeLayerData: MagentoLayeredNavigation
    intentStarted: boolean;
    canInterpretOrSuggest: boolean;
    remainingChars: number;
}

export const IntentReadiness = ({
     attributeLayerData,
     intentStarted,
     canInterpretOrSuggest,
     remainingChars
}: Props) => {
    const { intentState } = useIntentState()

    if (intentState.status === "noSuggestionFound") return <NoResult />

    if (intentState.status === "suggestionSent") return <Success />

    return <Warning
                attributeLayerData={attributeLayerData}
                intentStarted={intentStarted}
                remainingChars={remainingChars}
                canInterpretOrSuggest={canInterpretOrSuggest}
    />
}