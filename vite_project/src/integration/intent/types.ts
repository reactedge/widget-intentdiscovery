export type IntentState = {
    intentText: string
    categoryScore: Record<string, number>
    attributeScore: Record<string, Record<string, number>>
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
    | { type: "category_view"; id: string }
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
    | "interpreted";