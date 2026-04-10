import type {MagentoLayeredNavigation} from "../../../../../../hooks/domain/useLayeredNavigation.tsx";
import {useTranslationState} from "../../../../../../state/Translation/useTranslationState.ts";
import {useIntentState} from "../../../../../../state/Intent/useIntentState.ts";

type Props = {
    attributeLayerData: MagentoLayeredNavigation
    intentStarted: boolean;
    canInterpretOrSuggest: boolean;
    remainingChars: number;
}

export const Warning = ({
        attributeLayerData,
        intentStarted,
        canInterpretOrSuggest,
        remainingChars
    }: Props) => {
    const {t} = useTranslationState()
    const { intentState, getAiReadiness } = useIntentState()
    const gap = getAiReadiness(attributeLayerData)

    const coveragePct = getAiReadiness(attributeLayerData)

    const getAiReadinessMessage = () => {
        if (intentStarted) {
            return "Add %s+ characters or refine your preferences"
        }

        return `${attributeLayerData.totalCount} matches, Target < 30`
    }

    if (intentState.status === "suggestionSent" || intentState.status === "suggestionProcessing" || intentState.status === "readyToRecommend") return null;

    return (
        <div className={`intent-ai-threshold ${coveragePct === 100 ? "ready" : ""}`}>
            <div className="confidence">
                {t("Ready to suggest")}
            </div>
            <div className="help">
                {!canInterpretOrSuggest
                    ? t(
                        getAiReadinessMessage(),
                        remainingChars,
                        gap
                    )
                    : t(`${attributeLayerData.totalCount} matches - AI ready to interpret your request`)}
            </div>
        </div>
    )
}