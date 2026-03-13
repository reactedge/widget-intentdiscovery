import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {categoryLayereIds} from "../../lib/category.ts";
import {useMemo} from "react";
import {useSystemState} from "../../state/System/useSystemState.ts";
import {intentToFilter} from "../../lib/option-match.ts";

type FilterValue =
    | { eq: string | number }
    | { in: (string | number)[] };

export type MagentoProductFilter = Record<string, FilterValue>;

export function useOptionSelectionFilter(categoryData?: CategoryData) {
    const { intentState } = useSystemState();

    const categoryIds = useMemo(
        () => categoryLayereIds(categoryData),
        [categoryData?.id]
    );

    const intentFilter = useMemo(
        () => intentToFilter(intentState),
        [intentState]
    );

    return useMemo(() => {
        const filter: MagentoProductFilter = {
            category_id: {
                in: categoryIds
            }
        };

        Object.entries(intentFilter).forEach(([attribute, value]) => {
            filter[attribute] = { eq: value };
        });

        return filter;

    }, [categoryIds, intentFilter]);
}