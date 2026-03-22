import type {IntentControllerState} from "../../domain/intent.types.ts";
import {useTranslationState} from "../../state/Translation/useTranslationState.ts";

type Props = {
    intent: IntentControllerState,
};
export const IntentMessage = ({intent}: Props) => {
    const {t} = useTranslationState()

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
            </div>
        </div>
    )
}