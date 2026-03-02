import type {IntentState} from "../integration/intent/types.ts";
import type {AiRecommendationRequest} from "../hooks/infra/useAiRecommendations.tsx";
import type {GraphqlProduct} from "../hooks/infra/useMagentoProducts.tsx";
import type {OptionLabelMap} from "../state/OptionPreference/type.ts";

export function buildAiRecommendationPayload(
    intentState: IntentState,
    products: GraphqlProduct[],
    optionLabelMap: OptionLabelMap
): AiRecommendationRequest {

    const rawSignals = intentState.attributeScore ?? {};

    const signals: Record<string, Record<string, number>> = {};

    for (const [attributeCode, values] of Object.entries(rawSignals)) {

        const optionMap = optionLabelMap.get(attributeCode);
        if (!optionMap) continue;

        const labelScores: Record<string, number> = {};

        for (const [valueId, score] of Object.entries(values)) {

            const label = optionMap.get(valueId);
            if (!label) continue;

            labelScores[label] = score;
        }

        if (Object.keys(labelScores).length > 0) {
            signals[attributeCode] = labelScores;
        }
    }

    const relevantAttributes = Object.keys(signals);

    const transformedProducts = products.map(product => {

        const attributes: Record<string, string[]> = {};

        for (const attributeCode of relevantAttributes) {

            const rawValue = product[attributeCode];

            if (!rawValue || typeof rawValue !== "string") continue;

            const optionMap = optionLabelMap.get(attributeCode);
            if (!optionMap) continue;

            const values = rawValue.split(",");

            const labels = values
                .map(value => optionMap.get(value))
                .filter((label): label is string => Boolean(label));

            if (labels.length) {
                attributes[attributeCode] = labels;
            }
        }

        return {
            title: product.name,
            shortDescription: product.short_description?.html,
            attributes
        };
    });

    return {
        intent: { signals },
        products: transformedProducts
    };
}