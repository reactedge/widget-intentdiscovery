import type {MagentoProducts} from "../hooks/infra/useProductAttributeLayer.tsx";
import {useAnalyseSearch} from "../hooks/domain/useAnalyseSearch.tsx";
import type {CategoryData} from "../types/infra/magento/category.types.ts";
import {Spinner} from "./global/Spinner.tsx";
import {SuggestionContainer} from "./Suggestions/SuggestionContainer.tsx";
import {useEffect} from "react";

type Props = {
    categoryData: CategoryData
    attributeLayerData: MagentoProducts
    search: {
        shouldRun: boolean
        setIsEvaluating: (state: boolean) => void
    }
    onVisibilityChange: (visible: boolean) => void
}

export const ProductRecommendations = ({
   categoryData,
   attributeLayerData,
   search,
   onVisibilityChange
}: Props) => {
    const { aiRecommendation, searchLoading, error } =
        useAnalyseSearch(
            attributeLayerData?.aggregations,
            categoryData,
            search.shouldRun
        );

    const hasSuggestions = !!aiRecommendation?.suggestions?.length

    useEffect(() => {
        onVisibilityChange?.(hasSuggestions)
    }, [hasSuggestions, onVisibilityChange])

    useEffect(() => {
        search.setIsEvaluating(searchLoading);
    }, [searchLoading]);

    if (!search.shouldRun) return null;
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