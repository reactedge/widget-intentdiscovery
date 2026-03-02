import { useOptionPreferenceState } from "../state/OptionPreference/useOptionPreferenceState.ts";
import {useEffect, useState} from "react";
import type { IntentDiscoveryDataConfig } from "../domain/intent-discovery.types.ts";
import type { MagentoCategory } from "../types/infra/magento/category.types.ts";
import {useFindAttributeLayer} from "../hooks/domain/useFindAttributeLayer.tsx";
import {Spinner} from "./global/Spinner.tsx";
import {ErrorState} from "./global/ErrorState.tsx";
import {AttributeLayer} from "./AttributeLayer.tsx";
import {IntentDiscoveryOptions} from "./IntentDiscoveryOptions.tsx";
import {ProductRecommendations} from "./ProductRecommendations.tsx";

export interface Props {
    config: IntentDiscoveryDataConfig
    categoryData: MagentoCategory
}

export const IntentDiscovery = ({ config, categoryData }: Props) => {
    const { setActiveCategoryName } = useOptionPreferenceState();
    const { attributeLayerData, attributeLayerLoading, attributeLayerError } =
        useFindAttributeLayer(categoryData);

    const [showRightColumn, setShowRightColumn] = useState(false)

    useEffect(() => {
        if (!attributeLayerData?.aggregations) return
        setActiveCategoryName(config.categoryUrlKey);
    }, [config.categoryUrlKey, setActiveCategoryName, attributeLayerData?.aggregations]);

    if (attributeLayerLoading) return <Spinner />;
    if (attributeLayerError) return <ErrorState />;
    if (!attributeLayerData) return null;

    return (
        <div className={showRightColumn ? "re-intent-layout re-intent-layout--two" : "re-intent-layout"}>
            <div className="re-intent-col re-intent-col--left">
                <AttributeLayer
                    config={config}
                    categoryData={categoryData}
                    attributeLayerData={attributeLayerData}
                />
                <IntentDiscoveryOptions
                    config={config}
                    categoryData={categoryData}
                    attributeLayerData={attributeLayerData}
                />
            </div>

            <div className="re-intent-col re-intent-col--right">
                <ProductRecommendations
                    config={config}
                    categoryData={categoryData}
                    attributeLayerData={attributeLayerData}
                    onVisibilityChange={setShowRightColumn}
                />
            </div>
        </div>
    );
};