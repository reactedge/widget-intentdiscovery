import type {MagentoProducts} from "../hooks/infra/useProductAttributeLayer.tsx";
import type {IntentDiscoveryDataConfig} from "../domain/intent-discovery.types.ts";
import {useAnalyseSearch} from "../hooks/domain/useAnalyseSearch.tsx";
import type {MagentoCategory} from "../types/infra/magento/category.types.ts";
import {Spinner} from "./global/Spinner.tsx";
import {SuggestionContainer} from "./Suggestions/SuggestionContainer.tsx";
import {useEffect} from "react";

export interface Props {
    config: IntentDiscoveryDataConfig
    categoryData: MagentoCategory
    attributeLayerData: MagentoProducts
    onVisibilityChange?: (visible: boolean) => void
}

export const ProductRecommendations = ({
   config,
   categoryData,
   attributeLayerData,
   onVisibilityChange
}: Props) => {
    const threshold = config.ai.matchThreshold
    const total = attributeLayerData?.total_count ?? 0
    const shouldSearch = total <= threshold;

    const { aiRecommendation, searchLoading, error } =
        useAnalyseSearch(
            attributeLayerData?.aggregations,
            categoryData,
            shouldSearch
        );

    const hasSuggestions = !!aiRecommendation?.suggestions?.length

    useEffect(() => {
        onVisibilityChange?.(hasSuggestions)
    }, [hasSuggestions, onVisibilityChange])

    if (!shouldSearch) return null;
    if (searchLoading) return <Spinner />;
    if (!aiRecommendation?.suggestions?.length) return null;

    return (
        <SuggestionContainer
            data={aiRecommendation}
            loading={searchLoading}
            error={error?.message ?? null}
            title="AI suggestions"
        />
    )
}