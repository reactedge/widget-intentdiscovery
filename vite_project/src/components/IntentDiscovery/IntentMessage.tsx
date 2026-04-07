import type {IntentControllerState} from "../../domain/intent.types.ts";
import {useTranslationState} from "../../state/Translation/useTranslationState.ts";
import {type ChangeEvent} from "react";
import {useIntentState} from "../../state/Intent/useIntentState.ts";

type Props = {
    intent: IntentControllerState,
};
export const IntentMessage = ({intent}: Props) => {
    const {t} = useTranslationState()
    const { intentState } = useIntentState()

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        intent.setIntent(e.target.value)
    }

    if (intentState.status === "suggestionProcessing" ||
        intentState.status === "readyToRecommend") return null;

    return (
        <div className="finder">
            <h2 className="finder__title">{t("May I ask why you came here to shop?")}</h2>
            <div className="intent-input-wrapper">
                <input
                    type="text"
                    placeholder={t("Tell us what matters most for your purchase")}
                    value={intent.text}
                    onChange={(e) => handleTextChange(e)}
                    className="intent-input"
                />
            </div>
        </div>
    )
}