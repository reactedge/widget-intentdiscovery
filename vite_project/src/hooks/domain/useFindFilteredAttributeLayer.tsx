import type { CategoryData } from "../../types/infra/magento/category.types.ts";
import { useProductFilteredAttributeLayer } from "../infra/useProductFilteredAttributeLayer.tsx";

export function useFindFilteredAttributeLayer(categoryData: CategoryData) {
    const {
        magentoAttributesLayer: attributeFilteredLayerData,
        loading: attributeFilteredLayerLoading,
        error: attributeFilteredLayerError,
        refetch,
    } = useProductFilteredAttributeLayer(categoryData);

    return {
        attributeFilteredLayerData,
        attributeFilteredLayerLoading,
        attributeFilteredLayerError,
        refetch,
    };
}