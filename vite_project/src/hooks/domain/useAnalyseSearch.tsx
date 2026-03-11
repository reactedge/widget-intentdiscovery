import {useAiRecommendations} from "../infra/useAiRecommendations.tsx";
import type {MagentoAggregation} from "../infra/useProductAttributeLayer.tsx";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {useFindProducts} from "./useFindProducts.tsx";

export function useAnalyseSearch(
    aggregations: MagentoAggregation[] | undefined,
    categoryData: CategoryData,
    enabled: boolean,
) {

    const {
        productData,
        productLoading,
        productError,
    } = useFindProducts(categoryData, enabled);

    const {
        data: aiRecommendation,
        loading: aiLoading,
        error: aiError,
    } = useAiRecommendations(aggregations, productData, enabled);

    const searchLoading = productLoading || aiLoading;

    return {
        aiRecommendation,
        searchLoading,
        error: productError ?? aiError,
    };
}