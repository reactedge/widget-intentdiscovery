import {useTranslationState} from "../../../state/Translation/useTranslationState.ts";
import {useIntentState} from "../../../state/Intent/useIntentState.ts";
import type {MagentoLayeredNavigation} from "../../../hooks/domain/useLayeredNavigation.tsx";

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
        let message = ''

        if (intentStarted) {
            return "Add %s+ characters or refine your preferences"
        }

        const filtered = attributeLayerData.totalCount ?? 0

        // 3. No results (hard stop)
        if (filtered === 0) {
            message = "No results — try different keywords or remove filters"
        }

        // 4. Not enough results (below threshold)
        if (coveragePct < 100) {
            if (coveragePct < 80) {
                message = "Getting closer — refine a bit more"
            }

            if (coveragePct < 50) {
                message = "Add more detail or refine your preferences"
            }
        }

        // 5. Enough results but too broad
        if (coveragePct > 60) {
            message = "Results are too broad — refine your preferences"
        }

        if (coveragePct > 30) {
            message = "You can refine further for better matches"
        }

        return message
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
                    : t("AI ready to interpret your request")}
            </div>
        </div>
    )
}