import type {IntentState} from "../integration/intent/types.ts";

export function enrichWithIntent(attribute: any, intent: any) {
    const intentScores =
        intent?.attributeScore?.[attribute.attribute_code] || {};

    return {
        ...attribute,
        options: attribute.options.map((option: any) => {
            const score = intentScores[option.value] || 0;

            return {
                ...option,
                intentScore: score,
                isBoosted: score > 0,
            };
        }),
    };
}

export function intentToFilter(intentState: IntentState) {
    const { attributeScore } = intentState;

    const filter: Record<string, string[]> = {};

    for (const [attribute, options] of Object.entries(attributeScore)) {
        if (!options) continue;

        const values = Object.entries(options)
            .filter(([_, score]) => score > 0)
            .map(([value]) => value);

        if (values.length > 0) {
            filter[attribute] = values;
        }
    }

    return filter;
}