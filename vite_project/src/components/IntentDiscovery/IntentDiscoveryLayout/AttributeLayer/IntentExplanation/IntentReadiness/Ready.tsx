import type {MagentoLayeredNavigation} from "../../../../../../hooks/domain/useLayeredNavigation.tsx";
import {useTranslationState} from "../../../../../../state/Translation/useTranslationState.ts";

type Props = {
    attributeLayerData: MagentoLayeredNavigation
}

export const Ready = ({
        attributeLayerData
    }: Props) => {
    const {t} = useTranslationState()

    return (
        <div className="intent-ai-threshold ready" data-state="warning">
            <div className="confidence">
                {t("Ready to suggest")}
            </div>
            <div className="help" data-readiness-hint>
                {t(`${attributeLayerData.totalCount} matches - AI ready to interpret your request`)}
            </div>
        </div>
    )
}