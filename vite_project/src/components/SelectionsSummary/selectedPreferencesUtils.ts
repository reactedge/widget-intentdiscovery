import type { MagentoAggregation } from "../../hooks/infra/useProductAttributeLayer.tsx";

export type IntentRecord = Record<string, any> | undefined;

export function isAttributeSelected(
    attributeCode: string,
    intent?: IntentRecord
): boolean {
    if (intent?.attributeScore && attributeCode in intent.attributeScore) {
        return true;
    }

    if (
        attributeCode === "price" &&
        intent?.priceAffinity &&
        Object.keys(intent.priceAffinity).length > 0
    ) {
        return true;
    }

    return false;
}

export function getSelectedValues(
    attributeCode: string,
    aggregations: MagentoAggregation[],
    intent?: IntentRecord
): string[] {
    const scores = intent?.attributeScore?.[attributeCode];
    if (!scores) return [];

    const aggregation = aggregations.find(a => a.attribute_code === attributeCode);

    return Object.entries(scores)
        .map(([val]) => {
            const option = aggregation?.options.find(o => String(o.value) === String(val));
            const label = option?.label ?? val;

            return label;
        })
}

export function getSelectedAttributes(
    aggregations: MagentoAggregation[] | undefined,
    intent?: IntentRecord
) {
    return (
        aggregations?.filter((attr: MagentoAggregation) =>
            isAttributeSelected(attr.attribute_code, intent)
        ) || []
    );
}

export function useSelectedPreferences(
    aggregations: MagentoAggregation[],
    intent?: IntentRecord
) {
    const selected = getSelectedAttributes(aggregations, intent);

    const valueFor = (code: string): string | null => {
        const scores = intent?.attributeScore?.[code];
        if (!scores) return null;

        const [bestValue] = Object.entries(scores)
            .sort((a: Record<number, any>, b: Record<number, any>) => b[1] - a[1])[0] || [];

        if (!bestValue) return null;

        const aggregation = aggregations.find(a => a.attribute_code === code);
        if (!aggregation) return null;

        const valid = aggregation.options.find(o => String(o.value) === String(bestValue));

        return valid ? String(valid.value) : null;
    };

    const displayFor = (code: string): string[] => {
        return getSelectedValues(code, aggregations, intent);
    };

    return { selected, valueFor, displayFor };
}