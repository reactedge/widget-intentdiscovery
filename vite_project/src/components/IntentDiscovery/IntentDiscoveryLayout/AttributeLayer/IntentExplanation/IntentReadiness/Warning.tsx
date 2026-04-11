import type {MagentoLayeredNavigation} from "../../../../../../hooks/domain/useLayeredNavigation.tsx";
import {useTranslationState} from "../../../../../../state/Translation/useTranslationState.ts";
import {useIntentState} from "../../../../../../state/Intent/useIntentState.ts";

type Props = {
    attributeLayerData: MagentoLayeredNavigation
    intentStarted: boolean;
    remainingChars: number;
}

export const Warning = ({
        attributeLayerData,
        intentStarted,
        remainingChars
    }: Props) => {
    const {t} = useTranslationState()
    const { intentState, getAiReadiness } = useIntentState()
    const gap = getAiReadiness(attributeLayerData)

    const getAiReadinessMessage = () => {
        if (intentStarted) {
            return "Add %s+ characters or refine your preferences"
        }

        return `${attributeLayerData.totalCount} matches, Target < 30`
    }

    if (intentState.status === "suggestionSent" || intentState.status === "suggestionProcessing" || intentState.status === "readyToRecommend") return null;

    return (
        <div className={`intent-ai-threshold ${gap === 100 ? "ready" : ""}`} data-state="warning">
            <div className="confidence">
                {t("Ready to suggest")}
            </div>
            <div className="help" data-readiness-hint>
                {t(getAiReadinessMessage(), remainingChars, gap)}
            </div>
        </div>
    )
}