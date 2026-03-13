import {useCallback, useEffect, useState} from "react";
import {useSystemState} from "../../state/System/useSystemState.ts";
import type {MagentoAggregation} from "./useProductAttributeLayer.tsx";
import type {GraphqlProduct} from "./useMagentoProducts.tsx";
import {activity} from "../../activity";
import {buildAiRecommendationPayload} from "../../lib/ai-recommendations.ts";
import {useOptionLabelMap} from "../domain/useOptionLabelMap.ts";

export interface AiRecommendationRequest {
    intent: {
        signals: Record<string, Record<string, number>>
    }
    products: {
        title: string
        shortDescription?: string
        attributes: Record<string, string[]>
    }[]
}

interface APISugggestion {
    title: string
    confidence?: number
    reason: string
}
export interface AiRecommendationResponse {
    suggestions: APISugggestion[]
    message: string
}

export function useAiRecommendations(
    attributeData: MagentoAggregation[] | undefined,
    productData: GraphqlProduct[] | undefined,
    enabled: boolean
) {
    const { intentState } = useSystemState()

    const [data, setData] = useState<AiRecommendationResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const optionLabelMap = useOptionLabelMap(attributeData);
    const { intentApiClient } = useSystemState();

    const load = useCallback(async () => {
        if (!intentState || !attributeData?.length || !productData?.length || !enabled) return

        setLoading(true)
        setError(null)

        try {
            const payload = buildAiRecommendationPayload(
                intentState,
                productData,
                optionLabelMap
            );

            const json = await intentApiClient.suggest(payload);
            activity('ai-recommendations', 'AI recommendations API ran', json);

            setData(json)
        } catch (err: unknown) {
            activity('ai-recommendations', 'AI recommendations Error', {
                error: (err as Error).message
            }, 'error');
            setError(err instanceof Error ? err : new Error("Unknown error"))
        } finally {
            setLoading(false)
        }
    }, [intentState, attributeData, productData])

    useEffect(() => {
        load()
    }, [load])

    return {
        data,
        loading,
        error,
        refetch: load,
    }
}