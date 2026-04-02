import {
    LAYERER_ATTRIBUTE_DATA
} from "../../hooks/infra/useMagentoLayeredData.tsx";
import type {GraphqlClient} from "../../lib/graphql.ts";
import {getCategoryFilter} from "./buildFilter.ts";

const baseCache = new Map()

// type ProductsResponse = {
//     products: {items: GraphqlProduct[]}
// }

export type ProductsResponse = {
    products: MagentoProducts
}

export interface MagentoAggregationOption {
    count: number;
    label: string;
    value: string;
}

export interface MagentoAggregation {
    attribute_code: string;
    label: string;
    count: number;
    options: MagentoAggregationOption[];
}

export interface MagentoProducts {
    total_count: number;
    aggregations: MagentoAggregation[];
};

export async function fetchBase(
    categoryIds: number[],
    graphqlClient: GraphqlClient
): Promise<MagentoProducts> {
    const key = categoryIds.join(",")

    if (baseCache.has(key)) {
        return baseCache.get(key)
    }

    const filter = getCategoryFilter(categoryIds);
    const result = await graphqlClient<ProductsResponse>(
        LAYERER_ATTRIBUTE_DATA,
        { filter }
    );
    baseCache.set(key, structuredClone(result?.products))

    return result?.products
}
