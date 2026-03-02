import type { MagentoCategory } from "../../types/infra/magento/category.types.ts";
import { useProductAttributeLayer } from "../infra/useProductAttributeLayer.tsx";

export function useFindAttributeLayer(categoryData: MagentoCategory) {
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
