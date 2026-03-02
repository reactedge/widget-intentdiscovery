export type ContextSnapshot = {
    page: {
        type: "home" | "plp" | "pdp";
        category?: string;
        productSku?: string;
    };

    filters?: {
        [attribute: string]: string[];
    };

    signals: {
        dwellTimeMs?: number;
        interactionsCount?: number;
        stalled?: boolean;
    };

    locale: {
        language: string;
        country: string;
    };
};

export type IntentStage =
    | "exploring"
    | "narrowing"
    | "comparing"
    | "ready"
    | "unknown";

export type SuggestionStrategy =
    | "complementary_products"
    | "alternative_products"
    | "best_sellers"
    | "refine_filters"
    | "do_nothing";

export type Suggestion = {
    id: string;
    label: string;
    type: "product" | "category";
    confidence: number;
};

export type SuggestionResponse = {
    //intentStage: IntentStage;
    //strategy: SuggestionStrategy;

    suggestions: Array<Suggestion>;
};

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

interface IntentState {
    attributeScore?: Record<string, Record<string, number>>
}

interface MagentoProduct {
    name: string
    short_description?: string
    attributes: Record<string, string> // already label-mapped
}

export interface AiRecommendationResponse {
    suggestions: MagentoProduct[]
    message?: string
}

export interface MagentoAggregationOption {
    count: number;
    label: string;
    value: string;
}

export interface MagentoAggregation {
    attribute_code: string;
    label: string;
    count: number;
    options: MagentoAggregationOption[];
}

export type ModelInput = {
    intent: Record<string, Record<string, number>>;
    products: {
        title: string;
        shortDescription?: string;
        attributes: Record<string, string[]>;
    }[];
};