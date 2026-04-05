import {
    BASE_LAYERED_ATTRIBUTE_DATA
} from "../../hooks/infra/useMagentoLayeredData.tsx";
import type {GraphqlClient} from "../../lib/graphql.ts";
import {getCategoryFilter} from "./buildFilter.ts";
import type {MagentoProducts, ProductAttributesResponse} from "../../hooks/infra/useProductFilteredAttributeLayer.tsx";

const baseCache = new Map()

export async function fetchBase(
    categoryIds: number[],
    graphqlClient: GraphqlClient
): Promise<MagentoProducts> {
    const key = categoryIds.join(",")

    if (baseCache.has(key)) {
        return baseCache.get(key)
    }

    const filter = getCategoryFilter(categoryIds);
    const result = await graphqlClient<ProductAttributesResponse>(
        BASE_LAYERED_ATTRIBUTE_DATA,
        { filter }
    );
    baseCache.set(key, structuredClone(result?.products))

    return result?.products
}
