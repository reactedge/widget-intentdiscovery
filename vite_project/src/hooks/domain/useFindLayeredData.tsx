
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {useMagentoLayeredData} from "../infra/useMagentoLayeredData.tsx";

export function useFindLayeredData(categoryData: CategoryData) {
    const {
        magentoProducts,
        loading: productLoading,
        error: productError,
        refetch,
    } = useMagentoLayeredData(categoryData);

    const productData = magentoProducts

    return {
        productData,
        productLoading,
        productError,
        refetch,
    };
}