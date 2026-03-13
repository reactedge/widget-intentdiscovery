import {Spinner} from "./global/Spinner.tsx";
import {useTranslationState} from "../state/Translation/useTranslationState.ts";

export const SearchOverlay = () => {
    const {t} = useTranslationState()

    return (
        <div className="intent-evaluation-overlay">
            <Spinner />
            <p>{t("Searching your best match…")}</p>
        </div>
    )
}