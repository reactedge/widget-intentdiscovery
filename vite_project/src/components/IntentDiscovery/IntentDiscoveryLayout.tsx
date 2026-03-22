import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {useIntentLayoutState} from "../../hooks/domain/useIntentLayoutState.tsx";
import {useIntentController} from "../../hooks/domain/useIntentController.tsx";
import {IntentMessage} from "./IntentMessage.tsx";
import {AttributeLayer} from "./AttributeLayer.tsx";
import {IntentDiscoveryOptions} from "./IntentDiscoveryOptions.tsx";
import {ProductRecommendations} from "./ProductRecommendations.tsx";
import type {MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";
import {useIntentSearch} from "../../hooks/domain/useIntentSearch.tsx";
import {useSystemState} from "../../state/System/useSystemState.ts";

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

    const { searchPossible } = useIntentSearch(
        attributeLayerData,
        config
    )

    const { intentState } = useSystemState()

    return (
        <div className="intent-widget">
            <div className={showRightColumn ? "re-intent-layout re-intent-layout--two" : "re-intent-layout"}>
                <div className="re-intent-col re-intent-col--left">
                    <IntentMessage intent={intent} />
                    <AttributeLayer
                        config={config}
                        intent={intent}
                        searchPossible={searchPossible}
                        aggregations={attributeLayerData?.aggregations}
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
                        setIsSearching={setIsSearching}
                        shouldSearch={ searchPossible && intentState.status === "readyToSearch" }
                        onVisibilityChange={setShowRightColumn}
                    />
                </div>
            </div>
        </div>
    );
};