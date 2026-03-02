import { useEffect, useState } from "react";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { getError } from "../../lib/error.ts";
import { useOptionSelectionFilter } from "../domain/useOptionSelectionFilter.tsx";
import type { MagentoCategory } from "../../types/infra/magento/category.types.ts";
import {useFindIntentProducts} from "../domain/useIntentAttributes.tsx";

type BaseProduct = {
    name: string
    short_description?: {
        html: string
    }
}

export type GraphqlProduct = BaseProduct & Record<string, string | null | undefined>

type ProductsResponse = {
    products: {items: GraphqlProduct[]}
}

function buildProductQuery(dynamicFields: string) {
    return `
      query GetIntentProducts($filter: ProductAttributeFilterInput!) {
          products(filter: $filter) {           
            items {
              id
              name    
              short_description {
                html
              }  
              ${dynamicFields}       
            }
          }
        }
    `;
}

export function useMagentoProducts(categoryData: MagentoCategory, enabled: boolean) {
    const [data, setData] = useState<ProductsResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()
    const dynamicAttributes = useFindIntentProducts()

    const filter = useOptionSelectionFilter(categoryData)
    const load = async () => {
        if (!filter) return;
        if (!enabled) return;

        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<ProductsResponse>(
                buildProductQuery(dynamicAttributes),
                { filter }
            );
            setData(result);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [filter]);

    return { magentoProducts: data?.products, loading, error, refetch: load };
}
