import {Spinner} from "./SearchOverlay/Spinner.tsx";
import {useTranslationState} from "../state/Translation/useTranslationState.ts";
import {Sparkle} from "./SearchOverlay/Sparkle.tsx";

export const SpinnerOverlay = () => {
    const {t} = useTranslationState()

    return (
        <div className="intent-evaluation-overlay">
            <Spinner/>
            <div className="intent-text">{t("Searching your best match…")}</div>

            <Sparkle />
        </div>
    )
}