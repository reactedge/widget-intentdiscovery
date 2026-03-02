
import type {MagentoCategory} from "../../types/infra/magento/category.types.ts";
import {useMagentoLayeredData} from "../infra/useMagentoLayeredData.tsx";

export function useFindLayeredData(categoryData: MagentoCategory) {
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