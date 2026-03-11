import { useEffect, useState } from "react";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { getError } from "../../lib/error.ts";
import { useOptionSelectionFilter } from "../domain/useOptionSelectionFilter.tsx";
import type { CategoryData } from "../../types/infra/magento/category.types.ts";

type ProductsResponse = {
    products: any
}

const QUERY = `
  query MagentoProducts($filter: ProductAttributeFilterInput!) {
      products(filter: $filter) {
        total_count
        aggregations{
          attribute_code
          label
          count
          options{
            count
            label
            value
          }
        }
      }
    }
`;

export function useMagentoLayeredData(categoryData: CategoryData) {
    const [data, setData] = useState<ProductsResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const filter = useOptionSelectionFilter(categoryData)
    const load = async () => {
        if (!filter) return;

        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<ProductsResponse>(
                QUERY,
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
