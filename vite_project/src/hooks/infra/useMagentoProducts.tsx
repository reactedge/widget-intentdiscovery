import { useEffect, useState } from "react";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { getError } from "../../lib/error.ts";
import { useOptionSelectionFilter } from "../domain/useOptionSelectionFilter.tsx";
import type { CategoryData } from "../../types/infra/magento/category.types.ts";
import {useFindIntentProducts} from "../domain/useIntentAttributes.tsx";
import type {GraphqlProduct} from "../../types/infra/magento/product.types.ts";

type ProductsResponse = {
    products: {items: GraphqlProduct[]}
}

function buildProductQuery(dynamicFields: string) {
    return `
      query GetIntentProducts($filter: ProductAttributeFilterInput!) {
          products(filter: $filter) {           
            items {
              id
              sku
              name    
              url_key
              small_image { url }
              price_range {
                minimum_price {
                  final_price {
                    value
                    currency
                  }
                }
              }
              short_description {
                html
              }  
              ${dynamicFields}       
            }
          }
        }
    `;
}

export function useMagentoProducts(categoryData: CategoryData, enabled: boolean) {
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
