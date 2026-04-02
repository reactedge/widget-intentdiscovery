
import {fetchRecommendations} from "./fetchRecommendations.ts";
import type {GraphqlClient} from "../../lib/graphql.ts";
import type {AttributeFilters, IntentEngineState} from "../../integration/intent/types.ts";
import {findProducts} from "./fetchProducts.ts";
import type {MagentoProductFilter} from "../../hooks/domain/useOptionSelectionFilter.tsx";
import type {MergedAttribute} from "../../hooks/infra/useMagentoLayeredData.tsx";
import type {OptionLabelMap} from "../../domain/intent-discovery.types.ts";
import type {IntentApiClient} from "../../integration/intent/intentApiClient.ts";

export type AnalyseSearchParams = {
    intentApiClient: IntentApiClient
    graphqlClient: GraphqlClient
    filter: MagentoProductFilter
    attributeScore: AttributeFilters
    attributes: MergedAttribute[]
    optionLabelMap: OptionLabelMap
    intentState: IntentEngineState
}

// export async const analyseSearch = ({
//         intentEngine,
//         attributeScore,
//         attributes,
//         optionLabelMap,
//         filter,
//         intentState,
//         graphqlClient
//     }: AnalyseSearchParams
// ) => {
//     const dynamicAttributes = getDynamicAttributes(intentState)
//     const intentApiClient = intentEngine.getApiClient()
//
//     const products = await findProducts({
//         filter,
//         dynamicAttributes,
//         graphqlClient
//     })
//
//     const ai = await fetchRecommendations({
//             attributeScore,
//             attributes,
//             productData: products,
//             optionLabelMap,
//             intentApiClient
//     })
//
//     return { products, ai }
// }
export async function analyseSearch(params: AnalyseSearchParams) {
    const products = await findProducts(params)

    const ai = await fetchRecommendations({
        ...params,
        products
    })

    return { products, ai }
}

export async function runAnalyseSearch(params: AnalyseSearchParams) {
    return analyseSearch(params)
}