import type {OptionLabelMap} from "../state/OptionPreference/type.ts";
import type {GraphqlProduct} from "../hooks/infra/useMagentoProducts.tsx";
import type {IntentState} from "../integration/intent/types.ts";
import type {AiRecommendationRequest} from "../hooks/infra/useAiRecommendations.tsx";
import type {MagentoAggregation} from "../hooks/infra/useProductAttributeLayer.tsx";
import type {AiInterpretationRequest} from "../hooks/infra/useAiInterpreter.tsx";
import type {IntentDiscoveryDataConfig} from "../domain/intent-discovery.types.ts";

export function buildAiRecommendationPayload(
    intentState: IntentState,
    products: GraphqlProduct[],
    optionLabelMap: OptionLabelMap
): AiRecommendationRequest {

    const rawSignals = intentState.attributeScore ?? {};

    const signals = buildIntentSignals(rawSignals, optionLabelMap);

    const relevantAttributes = Object.keys(signals);

    const transformedProducts = products.map(product => ({
        title: product.name,
        shortDescription: product.short_description?.html,
        attributes: resolveProductAttributes(
            product,
            relevantAttributes,
            optionLabelMap
        )
    }));

    return {
        intent: { signals },
        products: transformedProducts
    };
}

export function buildAiInterpretationPayload(
    intentState: IntentState,
    aggregations: MagentoAggregation[],
    intentText: string,
    optionLabelMap: OptionLabelMap,
    config: IntentDiscoveryDataConfig
): AiInterpretationRequest {

    const rawSignals = intentState.attributeScore ?? {};

    const signals = buildIntentSignals(rawSignals, optionLabelMap);

    const attributes = aggregations
        .filter(attr =>
            !config.attributeExcludedInLayer?.includes(attr.attribute_code)
        ).
        map(attr => ({
            code: attr.attribute_code,
            label: attr.label,
            options: attr.options.map(option => ({
                label: option.label,
                value: option.value,
                count: option.count
            }))
        }));

    return {
        intent: {
            text: intentText,
            signals
        },
        attributes
    };
}

function buildIntentSignals(
    rawSignals: Record<string, Record<string, number>>,
    optionLabelMap: OptionLabelMap
): Record<string, Record<string, number>> {

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

    return signals;
}

function resolveProductAttributes(
    product: GraphqlProduct,
    relevantAttributes: string[],
    optionLabelMap: OptionLabelMap
): Record<string, string[]> {

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

    return attributes;
}