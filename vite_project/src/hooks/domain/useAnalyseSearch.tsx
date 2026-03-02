import {useAiRecommendations} from "../infra/useAiRecommendations.tsx";
import type {MagentoAggregation} from "../infra/useProductAttributeLayer.tsx";
import {useEffect, useState} from "react";
import type {MagentoCategory} from "../../types/infra/magento/category.types.ts";
import {useFindProducts} from "./useFindProducts.tsx";

export function useAnalyseSearch(
    aggregations: MagentoAggregation[] | undefined,
    categoryData: MagentoCategory,
    enabled: boolean
) {
    const {
        productData,
        productLoading,
        productError,
    } = useFindProducts(categoryData, enabled);

    const {
        data: aiRecommendation,
        loading: aiLoading,
        error: aiError,
    } = useAiRecommendations(aggregations, productData);

    return {
        aiRecommendation,
        searchLoading: productLoading || aiLoading,
        error: productError ?? aiError,
    };
}

export interface MockRecommendation {
    sku: string
    name: string
    score: number
}

export interface MockAnalyseResult {
    productData: MockRecommendation[]
    message?: string
}

export function useAnalyseSearchMock(attributeData: MagentoAggregation[]) {
    const [data, setData] = useState<MockAnalyseResult | null>(null)

    useEffect(() => {
        if (!attributeData?.length) {
            setData(null)
            return
        }

        // simple scoring heuristic
        const sizeAgg = attributeData.find(a => a.attribute_code === "size")
        const colourAgg = attributeData.find(a => a.attribute_code === "color")

        const sizeSignals = sizeAgg?.options?.filter(o => o.count > 0).length ?? 0
        const colourSignals = colourAgg?.options?.filter(o => o.count > 0).length ?? 0

        const mockProducts: MockRecommendation[] = [
            {
                sku: "MOCK-1",
                name: "Slim Fit Cotton Shirt",
                score: sizeSignals * 2 + colourSignals
            },
            {
                sku: "MOCK-2",
                name: "Relaxed Fit Linen Shirt",
                score: sizeSignals + colourSignals * 2
            }
        ]

        const sorted = mockProducts.sort((a, b) => b.score - a.score)

        setData({
            productData: sorted,
            message:
                sorted[0].score > 2
                    ? "Based on your filters, these may match your intent."
                    : "You might want to refine your selection."
        })

    }, [attributeData])

    return {
        productData: data?.productData ?? [],
        message: data?.message,
        productLoading: false,
        productError: null,
        refetch: () => {}
    }
}