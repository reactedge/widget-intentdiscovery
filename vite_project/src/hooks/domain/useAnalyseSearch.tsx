import type { CategoryData } from "../../types/infra/magento/category.types.ts";
import type {IntentEngineState} from "../../integration/intent/types.ts";
import {
    analyseSearch
} from "../../services/recommendations/analysesearch.service.ts";
import {useSystemState} from "../../state/System/useSystemState.ts";
import {useOptionSelectionFilter} from "./useOptionSelectionFilter.tsx";
import {useOptionLabelMap} from "./useOptionLabelMap.ts";
import type {MagentoLayeredNavigation} from "./useLayeredNavigation.tsx";
import {useIntentState} from "../../state/Intent/useIntentState.ts";
import type {EnrichedSuggestion} from "../../types/infra/magento/product.types.ts";
import type {AiRecommendationResponse} from "../infra/useAiRecommendations.tsx";

type UseAskAnalyseSearch = {
    attributeLayerData: MagentoLayeredNavigation
    categoryData: CategoryData,
    intentState: IntentEngineState
};

// export function useAnalyseSearch({
//      attributes,
//      categoryData
//  }: UseAskAnalyseSearch) {
//     const { intentState } = useIntentState()
//     const enabled = intentState.status === "readyToRecommend"
//
//     console.log('useAnalyseSearch', enabled)
//
//     const {
//         productData,
//         productLoading,
//         productError,
//     } = useFindProducts(categoryData, enabled);
//
//     const {
//         data: aiRecommendation,
//         loading: aiLoading,
//         error: aiError,
//     } = useAiRecommendations(attributes, productData, enabled);
//
//     const searchLoading = productLoading || aiLoading;
//
//     return {
//         aiRecommendation,
//         searchLoading,
//         error: productError ?? aiError,
//     };
// }

export type AnalyseSearchResult = {
    aiRecommendation: EnrichedSuggestion[] | null,
    searchLoading: boolean,
    error: Error | null
}

export type SearchDataState = {
    data: AiRecommendationResponse | null,
    loading: boolean,
    error: Error | null
}

export function useAnalyseSearch({
     attributeLayerData,
     categoryData,
     intentState
 }: UseAskAnalyseSearch) {

    const {graphqlClient, intentEngine} = useSystemState()
    const {dispatch} = useIntentState()

    const filter = useOptionSelectionFilter(categoryData)
    const optionLabelMap = useOptionLabelMap(attributeLayerData.attributes)

    const intentApiClient = intentEngine.getApiClient()

    const {attributeScore} = intentState

    const run = async () => {
        const result = await analyseSearch({
            graphqlClient,
            intentApiClient,
            filter,
            attributeScore,
            attributes: attributeLayerData.attributes ?? [],
            optionLabelMap,
            intentState
        })

        dispatch(
            result.ai?.suggestions?.length
                ? {type: "SUGGESTION_SUCCESS", recommendations: result.ai.suggestions}
                : {type: "SUGGESTION_EMPTY"}
        )
    }

    return run;
}

