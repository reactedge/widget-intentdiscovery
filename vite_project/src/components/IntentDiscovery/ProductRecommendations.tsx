import { SuggestionContainer } from "../Suggestions/SuggestionContainer.tsx";
import { useTranslationState } from "../../state/Translation/useTranslationState.ts";
import {useIntentState} from "../../state/Intent/useIntentState.ts";

export const ProductRecommendations = () => {
    const { intentState } = useIntentState()

    const { t } = useTranslationState()

    if (intentState.status !== "suggestionSent") return null;

    return (
        <SuggestionContainer
            recommendations={intentState.recommendations}
            title={t("AI suggestions")}
        />
    )
}