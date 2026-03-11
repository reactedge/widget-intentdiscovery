
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {useMagentoProducts} from "../infra/useMagentoProducts.tsx";

export function useFindProducts(categoryData: CategoryData, enabled: boolean) {
    const {
        magentoProducts,
        loading: productLoading,
        error: productError,
        refetch,
    } = useMagentoProducts(categoryData, enabled);

    const productData = magentoProducts?.items

    return {
        productData,
        productLoading,
        productError,
        refetch,
    };
}