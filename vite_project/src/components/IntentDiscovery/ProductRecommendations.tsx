import type {MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";
import {useAnalyseSearch} from "../../hooks/domain/useAnalyseSearch.tsx";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {SuggestionContainer} from "../Suggestions/SuggestionContainer.tsx";
import {useEffect} from "react";
import {useTranslationState} from "../../state/Translation/useTranslationState.ts";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import {SpinnerOverlay} from "../SpinnerOverlay.tsx";

type Props = {
    config: IntentDiscoveryDataConfig
    categoryData: CategoryData
    attributeLayerData: MagentoProducts
    setIsSearching: (state: boolean) => void
    shouldSearch: boolean
    onVisibilityChange: (visible: boolean) => void
}

export const ProductRecommendations = ({
   categoryData,
   attributeLayerData,
   setIsSearching,
   shouldSearch,
   onVisibilityChange
}: Props) => {
    const { aiRecommendation, searchLoading, error } =
        useAnalyseSearch(
            attributeLayerData?.aggregations,
            categoryData,
            shouldSearch
        );

    const hasSuggestions = !!aiRecommendation?.suggestions?.length
    const {t} = useTranslationState()

    useEffect(() => {
        onVisibilityChange?.(hasSuggestions)
    }, [hasSuggestions, onVisibilityChange])

    useEffect(() => {
        setIsSearching(searchLoading);
    }, [searchLoading]);

    if (!shouldSearch) return null;
    if (searchLoading) return <SpinnerOverlay />;
    if (!aiRecommendation?.suggestions?.length) return null;

    return (
        <SuggestionContainer
            data={aiRecommendation}
            loading={searchLoading}
            error={error?.message ?? null}
            title={t("AI suggestions")}
        />
    )
}