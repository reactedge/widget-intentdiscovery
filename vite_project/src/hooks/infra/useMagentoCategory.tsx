import { useEffect, useState } from "react";
import {useSystemState} from "../../state/System/useSystemState.ts";
import type {MagentoCategory} from "../../types/infra/magento/category.types.ts";
import {getError} from "../../lib/error.ts";

type CategoryResponse = {
    categories: {
        items: MagentoCategory[]
    }
}

const QUERY = `
  query MagentoCategories($filter: CategoryFilterInput!) {
      categories(
        filters: $filter
      ) {
        items {
          id        
          name        
          children {
            id           
          }
        }
      }
    }
`;

export function useMagentoCategory(urlKey?: string) {
    const [data, setData] = useState<CategoryResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = async (urlKey?: string) => {
        if (!urlKey) return;

        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<CategoryResponse>(
                QUERY,
                { filter: { url_key: { eq: urlKey } } }
            );
            setData(result);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(urlKey);
    }, [urlKey]);

    return { magentoCategory: data?.categories.items?.[0], loading, error, refetch: load };
}
