import {Spinner} from "./SearchOverlay/Spinner.tsx";
import {useTranslationState} from "../../state/Translation/useTranslationState.ts";
import {Sparkle} from "./SearchOverlay/Sparkle.tsx";

export const SearchSpinnerOverlay = () => {
    const {t} = useTranslationState()

    return (
        <div className="intent-search-overlay">
            <Spinner/>
            <div className="intent-text">{t("Searching your best match…")}</div>

            <Sparkle />
        </div>
    )
}