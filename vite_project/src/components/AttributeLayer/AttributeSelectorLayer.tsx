import { useSelectedPreferences } from "../SelectionsSummary/selectedPreferencesUtils.ts";
import { useState } from "react";
import { useIntentAttributes } from "../../hooks/domain/useIntentAttributes.tsx";
import { AttributeTile } from "./AttributeTile.tsx";
import { useTranslationState } from "../../state/Translation/useTranslationState.ts";
import type { IntentDiscoveryDataConfig } from "../../domain/intent-discovery.types.ts";
import { useInteractionState } from "../../state/Interaction/useInteractionState.ts";
import {NoResult} from "../global/NoResult.tsx";
import {useIntentState} from "../../state/Intent/useIntentState.ts";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";
import type {MergedAttribute} from "../../hooks/infra/useMagentoLayeredData.tsx";

type Props = {
    attributeLayerData: MagentoLayeredNavigation
    config: IntentDiscoveryDataConfig
}

export const AttributeSelectorLayer = ({
    attributeLayerData,
    config
}: Props) => {
    const { setActiveAttribute } = useInteractionState();
    const [showAll, setShowAll] = useState(false);
    const {intentState} = useIntentState()
    const { interactionState } = useInteractionState()

    const allAttributes = useIntentAttributes(attributeLayerData.attributes as MergedAttribute[], config)
    const visibleAttributes = showAll ? allAttributes : allAttributes.slice(0, 3);
    const { displayFor } =
        useSelectedPreferences(attributeLayerData.attributes as MergedAttribute[], intentState);
    const { t } = useTranslationState()

    const isAttributeSelected = (code: string) => {
        return interactionState?.navigation.activeAttribute === code;
    }

    const isDisabled = intentState.status === "suggestionProcessing"

    if (!attributeLayerData?.totalCount) return <NoResult />;

    return (
        <div className={`step-finder ${isDisabled ? 'step-finder--disabled' : ''}`}>
            {visibleAttributes.map((attr) => {
                const code = attr.code;
                const isSelected = isAttributeSelected(code);

                return (
                    <AttributeTile
                        key={code}
                        attr={attr}
                        isSelected={isSelected}
                        value={displayFor(code)}
                        onClick={() => setActiveAttribute(code)}
                    />
                );
            })}
            {allAttributes.length > 4 && (
                <button
                    className="choice-tile choice-tile--view-all"
                    onClick={() => setShowAll(prev => !prev)}
                >
                    {showAll ? t("Show less") : t("View all")}
                </button>
            )}
        </div>
    );
};