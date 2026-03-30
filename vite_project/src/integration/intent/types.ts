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
    status: IntentStatus
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
    | "interpreted"
    | "readyToSearch"
    | "suggestionProcessing"
    | "suggestionSent";