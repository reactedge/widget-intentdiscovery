import {useTranslationState} from "../../state/Translation/useTranslationState.ts";

type IntentExplanationProps = {
    remainingChars: number;
    searchPossible: boolean;
    onAsk: () => void;
};

export const IntentExplanation = ({
   remainingChars,
   searchPossible,
   onAsk
}: IntentExplanationProps) => {
    const { t } = useTranslationState();

    return (
        <div className="intent-explanations">
            <button
                onClick={onAsk}
                className="filter-apply-button"
                disabled={remainingChars > 0 && !searchPossible}
            >
                {t("Suggest Products")}
            </button>

            <div className={`intent-ai-threshold ${remainingChars === 0 ? "ready" : ""}`}>
                {remainingChars > 0
                    ? t("Add %s+ characters in the text intent or refine your preferences", remainingChars)
                    : t("AI ready to interpret your request")}
            </div>

            <label className="intent-subtitle">
                {t("Describe what you're looking for")}
            </label>
        </div>
    );
};