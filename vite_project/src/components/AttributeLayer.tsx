import { useState } from "react";
import type { MagentoCategory } from "../types/infra/magento/category.types.ts";
import { useActiveAttributeState } from "../state/ActiveAttribute/useActiveAttributeState.ts";
import { useSelectedPreferences } from "./selectedPreferencesUtils";
import type {IntentDiscoveryDataConfig} from "../domain/intent-discovery.types.ts";
import {useSystemState} from "../state/System/useSystemState.ts";
import {getExcludedAttributes} from "../lib/attributes.ts";
import type {MagentoAggregation, MagentoProducts} from "../hooks/infra/useProductAttributeLayer.tsx";

type Props = {
    config: IntentDiscoveryDataConfig;
    categoryData: MagentoCategory;
    attributeLayerData: MagentoProducts
};

export const AttributeLayer = ({ config, attributeLayerData }: Props) => {
    const { setActiveAttributeCode } = useActiveAttributeState();
    const {intentState} = useSystemState()
    const excludeCodes = getExcludedAttributes(config.attributes)

    const { valueFor: prefValue } =
        useSelectedPreferences(attributeLayerData, intentState);

    const [showAll, setShowAll] = useState(false);

    const allAttributes = (attributeLayerData?.aggregations || []).filter(
        (attr: MagentoAggregation) => !excludeCodes?.includes(attr.attribute_code)
    );
    const visibleAttributes = showAll ? allAttributes : allAttributes.slice(0, 4);

    const isAttributeSelected = (attributeCode: string): boolean => {
        // Check if attribute is in attributeScore
        if (intentState?.attributeScore && attributeCode in intentState.attributeScore) {
            return true;
        }

        // Check if this is the price attribute and priceAffinity has been set
        if (attributeCode === 'price' && intentState?.priceAffinity &&
            Object.keys(intentState.priceAffinity).length > 0) {
            return true;
        }

        return false;
    };

    return (
        <>
            {/*<SelectedPreferences categoryData={categoryData} intent={intent} />*/}
            <div className="finder">
                <div className="step-finder">
                    {visibleAttributes.map((attr: MagentoAggregation) => (
                        <div
                            key={attr.attribute_code}
                            className="choice-tile"
                            onClick={() => setActiveAttributeCode(attr.attribute_code)}
                        >
                            <span
                                className={`choice-tile__label ${isAttributeSelected(attr.attribute_code) ? 'choice-tile__label--selected' : ''}`}
                            >
                                {attr.label}
                            </span>
                            {prefValue(attr.attribute_code) && (
                                <span className="choice-tile__info">
                                    {prefValue(attr.attribute_code)}
                                </span>
                            )}
                        </div>
                    ))}
                    {allAttributes.length > 4 && (
                        <button
                            className="choice-tile choice-tile--view-all"
                            onClick={() => setShowAll(prev => !prev)}
                        >
                            {showAll ? "Show less" : "View all"}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};
