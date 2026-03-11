import { useOptionPreferenceState } from "../state/OptionPreference/useOptionPreferenceState.ts";
import {useEffect, useState} from "react";
import type { IntentDiscoveryDataConfig } from "../domain/intent-discovery.types.ts";
import type { CategoryData } from "../types/infra/magento/category.types.ts";
import {useFindAttributeLayer} from "../hooks/domain/useFindAttributeLayer.tsx";
import {Spinner} from "./global/Spinner.tsx";
import {ErrorState} from "./global/ErrorState.tsx";
import {AttributeLayer} from "./AttributeLayer.tsx";
import {IntentDiscoveryOptions} from "./IntentDiscoveryOptions.tsx";
import {ProductRecommendations} from "./ProductRecommendations.tsx";
import {activity} from "../activity";
import {useIntentDecision} from "../hooks/domain/useIntentDecision.tsx";
import {EvaluationOverlay} from "./EvaluationOverlay.tsx";

export interface Props {
    config: IntentDiscoveryDataConfig
    categoryData: CategoryData
}

export const IntentDiscovery = ({ config, categoryData }: Props) => {
    const { setActiveCategoryName } = useOptionPreferenceState();
    const { attributeLayerData, attributeLayerLoading, attributeLayerError } =
        useFindAttributeLayer(categoryData);
    const [intentText, setIntentText] = useState("");
    //const [intentSubmitted, setIntentSubmitted] = useState(false)

    const [showRightColumn, setShowRightColumn] = useState(false)
    const { shouldSearch, shouldInterpret } = useIntentDecision(attributeLayerData, config, intentText)
    const [isEvaluating, setIsEvaluating] = useState(false)

    useEffect(() => {
        if (!attributeLayerData?.aggregations) return
        setActiveCategoryName(config.categoryUrlKey);
    }, [config.categoryUrlKey, setActiveCategoryName, attributeLayerData?.aggregations]);

    if (attributeLayerLoading) return <Spinner />;
    if (attributeLayerError) return <ErrorState error={attributeLayerError}  />;
    if (!attributeLayerData) return null;

    activity('attribute-layer', 'Attribute Layer', attributeLayerData);

    return (
        <div className="intent-widget">
            {isEvaluating && <EvaluationOverlay/>}
            <div className={showRightColumn ? "re-intent-layout re-intent-layout--two" : "re-intent-layout"}>
                <div className="re-intent-col re-intent-col--left">
                    <AttributeLayer
                        config={config}
                        attributeLayerData={attributeLayerData}
                        disabled={isEvaluating}
                        intent={{
                            text: intentText,
                            onChange: setIntentText,
                            shouldInterpret
                        }}
                    />
                    <IntentDiscoveryOptions
                        config={config}
                        categoryData={categoryData}
                        attributeLayerData={attributeLayerData}
                    />
                </div>

                <div className="re-intent-col re-intent-col--right">
                    <ProductRecommendations
                        categoryData={categoryData}
                        attributeLayerData={attributeLayerData}
                        search={{
                            shouldRun: shouldSearch,
                            setIsEvaluating
                        }}
                        onVisibilityChange={setShowRightColumn}
                    />
                </div>
            </div>
        </div>
    );
};