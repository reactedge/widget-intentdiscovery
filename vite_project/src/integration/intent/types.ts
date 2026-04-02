import type {EnrichedSuggestion} from "../../types/infra/magento/product.types.ts";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";

export type AttributeFilters = Record<string, Record<string, number>>

export type IntentEngineState = {
    intentText: string
    categoryScore: Record<string, number>
    attributeScore: AttributeFilters
    productScore: Record<string, number>
    priceAffinity: {
        min?: number
        max?: number
        avg?: number
    },
    currentUrl?: string
    recommendations: EnrichedSuggestion[]
    resultCount: number
    status: IntentStatus
    intentInterpreted: boolean;
    intentInterpretationReady: boolean;
    searchReady: boolean;
    initialTotalAggregations: number;
    totalFilteredAggregations: number;
}

export type IntentSignal =
    | { type: "status_updated"; status: IntentStatus }
    | { type: "text_updated"; text: string }
    | { type: "category_view"; id: string }
    | { type: "filter_toggle"; attribute: string; value: string }
    | { type: "filter_select"; attribute: string; value: string }
    | { type: "filter_deselect"; attribute: string; value: string }
    | { type: "product_view"; sku: string }
    | { type: "add_to_cart"; sku: string; price: number }
    | { type: "url"; }

export type IntentStatus =
    | "idle"
    | "ready"
    | "canBeInterpreted"
    | "interpreting"
    | "readyToRecommend"
    | "suggestionProcessing"
    | "suggestionSent"
    | "noSuggestionFound";

export type IntentEvent =
    | { type: "RESULTS_UPDATED"; totalFiltered: number }
    | { type: "FILTER_CHANGED"; attributeLayerData: MagentoLayeredNavigation }
    | { type: "INTERPRETATION_STARTED" }
    | { type: "INTERPRETATION_PROCESSING" }
    | { type: "INTERPRETATION_READY" }
    | { type: "INTERPRETATION_DONE" }
    | { type: "SUGGEST_CLICKED" }
    | { type: "SUGGESTION_SUCCESS"; recommendations: EnrichedSuggestion[] }
    | { type: "SEARCH_PROCESSING" }
    | { type: "SUGGESTION_EMPTY" }
    | { type: "CLEAR_FILTERS" };