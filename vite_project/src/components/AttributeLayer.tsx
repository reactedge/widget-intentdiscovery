import { useState} from "react";
import {useActiveAttributeState} from "../state/ActiveAttribute/useActiveAttributeState.ts";
import {useSelectedPreferences} from "./selectedPreferencesUtils";
import type {IntentDiscoveryDataConfig} from "../domain/intent-discovery.types.ts";
import {useSystemState} from "../state/System/useSystemState.ts";
import type {MagentoAggregation, MagentoProducts} from "../hooks/infra/useProductAttributeLayer.tsx";
import {IntentMessage} from "./IntentMessage.tsx";
import {useIntentAttributes} from "../hooks/domain/useIntentAttributes.tsx";

type Props = {
    config: IntentDiscoveryDataConfig
    attributeLayerData: MagentoProducts
    intent: {
        text: string
        onChange: (intent: string) => void
        shouldInterpret: boolean
    }
    disabled: boolean
}

export const AttributeLayer = ({
       config,
       attributeLayerData,
       intent,
       disabled
    }: Props) => {
    const { setActiveAttributeCode } = useActiveAttributeState();
    const {intentState} = useSystemState()
    const { valueFor: prefValue } =
        useSelectedPreferences(attributeLayerData, intentState);

    const [showAll, setShowAll] = useState(false);

    const allAttributes = useIntentAttributes(attributeLayerData?.aggregations, config)
    const visibleAttributes = showAll ? allAttributes : allAttributes.slice(0, 3);

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
            <div className="finder">
                <h2 className="finder__title">May I ask why you came here to shop?</h2>
                <IntentMessage
                    config={config}
                    shouldInterpret={intent.shouldInterpret}
                    intentText={intent.text}
                    onIntentChange={intent.onChange}
                    attributeLayerData={attributeLayerData}
                />
                <label className="intent-subtitle">
                    Describe what you're looking for
                </label>
                <div className={`step-finder ${disabled ? 'step-finder--disabled' : ''}`}>
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
    );
};
