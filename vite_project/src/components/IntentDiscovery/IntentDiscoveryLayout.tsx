import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {useIntentLayoutState} from "../../hooks/domain/useIntentLayoutState.tsx";
import {useIntentController} from "../../hooks/domain/useIntentController.tsx";
import {SearchOverlay} from "../SearchOverlay.tsx";
import {IntentMessage} from "./IntentMessage.tsx";
import {AttributeLayer} from "./AttributeLayer.tsx";
import {IntentDiscoveryOptions} from "./IntentDiscoveryOptions.tsx";
import {ProductRecommendations} from "./ProductRecommendations.tsx";
import type {MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";

export interface Props {
    config: IntentDiscoveryDataConfig
    categoryData: CategoryData
    attributeLayerData: MagentoProducts
}

export const IntentDiscoveryLayout = ({ config, categoryData, attributeLayerData}: Props) => {
    const {
        showRightColumn,
        setShowRightColumn,
        isSearching,
        setIsSearching
    } = useIntentLayoutState()

    const { intent } = useIntentController(attributeLayerData, config)

    return (
        <div className="intent-widget">
            {isSearching && <SearchOverlay />}
            <div className={showRightColumn ? "re-intent-layout re-intent-layout--two" : "re-intent-layout"}>
                <div className="re-intent-col re-intent-col--left">
                    <IntentMessage
                        config={config}
                        intent={intent}
                        attributeLayerData={attributeLayerData}
                    />
                    <AttributeLayer
                        config={config}
                        attributeLayerData={attributeLayerData}
                        disabled={isSearching}
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
                        search={{
                            setIsSearching
                        }}
                        onVisibilityChange={setShowRightColumn}
                    />
                </div>
            </div>
        </div>
    );
};