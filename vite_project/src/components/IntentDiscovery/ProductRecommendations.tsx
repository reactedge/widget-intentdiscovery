import type {MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";
import {useAnalyseSearch} from "../../hooks/domain/useAnalyseSearch.tsx";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {Spinner} from "../global/Spinner.tsx";
import {SuggestionContainer} from "../Suggestions/SuggestionContainer.tsx";
import {useEffect} from "react";
import {useTranslationState} from "../../state/Translation/useTranslationState.ts";
import {useIntentSearch} from "../../hooks/domain/useIntentSearch.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";

type Props = {
    config: IntentDiscoveryDataConfig
    categoryData: CategoryData
    attributeLayerData: MagentoProducts
    search: {
        setIsSearching: (state: boolean) => void
    }
    onVisibilityChange: (visible: boolean) => void
}

export const ProductRecommendations = ({
   config,
   categoryData,
   attributeLayerData,
   search,
   onVisibilityChange
}: Props) => {
    const { shouldSearch } = useIntentSearch(
        attributeLayerData,
        config
    )

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
        search.setIsSearching(searchLoading);
    }, [searchLoading]);

    if (!shouldSearch) return null;
    if (searchLoading) return <Spinner />;
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