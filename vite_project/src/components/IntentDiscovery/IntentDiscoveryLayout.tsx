import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";
import {useOptionPreferenceState} from "../../state/OptionPreference/useOptionPreferenceState.ts";
import {useEffect} from "react";
import {EvaluationOverlay} from "../EvaluationOverlay.tsx";
import {AttributeLayer} from "../AttributeLayer.tsx";
import {IntentDiscoveryOptions} from "../IntentDiscoveryOptions.tsx";
import {ProductRecommendations} from "../ProductRecommendations.tsx";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {useIntentController} from "../../hooks/domain/useIntentController.tsx";
import {useIntentLayoutState} from "../../hooks/domain/useIntentLayoutState.tsx";

type LayoutProps = {
    config: IntentDiscoveryDataConfig
    categoryData: CategoryData
    attributeLayerData: MagentoProducts
}

export const IntentDiscoveryLayout = ({
      config,
      categoryData,
      attributeLayerData
  }: LayoutProps) => {

    const { setActiveCategoryName } = useOptionPreferenceState()

    const { intent } =
        useIntentController(attributeLayerData, config)

    const {
        showRightColumn,
        setShowRightColumn,
        isEvaluating,
        setIsEvaluating
    } = useIntentLayoutState()

    useEffect(() => {
        setActiveCategoryName(config.categoryUrlKey)
    }, [config.categoryUrlKey, setActiveCategoryName])

    return (
        <div className="intent-widget">
            {isEvaluating && <EvaluationOverlay />}
            <div className={
                showRightColumn
                    ? "re-intent-layout re-intent-layout--two"
                    : "re-intent-layout"
            }>
                <div className="re-intent-col re-intent-col--left">
                    <AttributeLayer
                        config={config}
                        attributeLayerData={attributeLayerData}
                        disabled={isEvaluating}
                        intent={intent}
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
                        shouldRun={intent.shouldSearch}
                        onVisibilityChange={setShowRightColumn}
                        setIsEvaluating={setIsEvaluating}
                    />
                </div>
            </div>
        </div>
    )
}