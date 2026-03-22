import {useActiveAttributeState} from "../../state/ActiveAttribute/useActiveAttributeState.ts";
import {useSystemState} from "../../state/System/useSystemState.ts";
import {useSelectedPreferences} from "../SelectionsSummary/selectedPreferencesUtils.ts";
import {useState} from "react";
import {useIntentAttributes} from "../../hooks/domain/useIntentAttributes.tsx";
import {AttributeTile} from "./AttributeTile.tsx";
import {useTranslationState} from "../../state/Translation/useTranslationState.ts";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {MagentoAggregation} from "../../hooks/infra/useProductAttributeLayer.tsx";

type Props = {
    isDisabled: boolean
    aggregations: MagentoAggregation[]
    config: IntentDiscoveryDataConfig
}

export const AttributeSelectorLayer = ({
       isDisabled,
       aggregations,
       config
   }: Props) => {
    const { intentState } = useSystemState()
    const { setActiveAttributeCode } = useActiveAttributeState();
    const [showAll, setShowAll] = useState(false);

    const allAttributes = useIntentAttributes(aggregations, config)
    const visibleAttributes = showAll ? allAttributes : allAttributes.slice(0, 3);
    const { valueFor: prefValue } =
        useSelectedPreferences(aggregations, intentState);
    const {t} = useTranslationState()

    const isAttributeSelected = (code: string) =>
        code in (intentState?.attributeScore ?? {}) ||
        (code === 'price' && Object.keys(intentState?.priceAffinity ?? {}).length > 0);

    if (!aggregations?.length) return null;

    return (
        <div className={`step-finder ${isDisabled ? 'step-finder--disabled' : ''}`}>
            {visibleAttributes.map((attr) => {
                const code = attr.attribute_code;
                const isSelected = isAttributeSelected(code);

                return (
                    <AttributeTile
                        key={code}
                        attr={attr}
                        isSelected={isSelected}
                        value={prefValue(code)}
                        onClick={() => setActiveAttributeCode(code)}
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