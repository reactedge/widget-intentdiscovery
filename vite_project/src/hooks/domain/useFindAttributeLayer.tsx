import type { CategoryData } from "../../types/infra/magento/category.types.ts";
import { useProductAttributeLayer } from "../infra/useProductAttributeLayer.tsx";

export function useFindAttributeLayer(categoryData: CategoryData) {
    const {
        magentoAttributesLayer: attributeLayerData,
        loading: attributeLayerLoading,
        error: attributeLayerError,
        refetch,
    } = useProductAttributeLayer(categoryData);

    return {
        attributeLayerData,
        attributeLayerLoading,
        attributeLayerError,
        refetch,
    };
}
