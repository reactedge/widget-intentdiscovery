import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {categoryLayereIds} from "../../lib/category.ts";
import {useMemo} from "react";

type FilterValue =
    | { eq: string | number }
    | { in: (string | number)[] };

export type MagentoProductFilter = Record<string, FilterValue>;

export function useCategoryFilter(categoryData?: CategoryData) {
    const categoryIds = useMemo(
        () => categoryLayereIds(categoryData),
        [categoryData?.id]
    );

    return useMemo(() => {
        const filter: MagentoProductFilter = {
            category_id: {
                in: categoryIds
            }
        };

        return filter;

    }, [categoryIds]);
}