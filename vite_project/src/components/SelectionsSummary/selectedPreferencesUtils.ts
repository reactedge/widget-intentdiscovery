import type {MagentoAggregation} from "../../hooks/infra/useProductAttributeLayer.tsx";
import type {OptionLabelMap} from "../../state/OptionPreference/type.ts";
import {useOptionLabelMap} from "../../hooks/domain/useOptionLabelMap.ts";

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

export function renderPreferenceValue(
    attributeCode: string,
    labelLookup: OptionLabelMap,
    intent?: IntentRecord
): string {
    if (intent?.attributeScore && intent.attributeScore[attributeCode]) {
        const entries = Object.entries(
            intent.attributeScore[attributeCode] as Record<string, number>
        );
        function getOptionLabel(val: string) {
            return labelLookup.get(attributeCode)?.get(val);
        }
        return entries.map(([val, count]) => `${getOptionLabel(val)} (${count})`).join(", ");
    }

    if (attributeCode === "price" && intent?.priceAffinity) {
        const { min, max, avg } = intent.priceAffinity;
        const parts: string[] = [];
        if (min !== undefined) parts.push(`min: ${min}`);
        if (max !== undefined) parts.push(`max: ${max}`);
        if (avg !== undefined) parts.push(`avg: ${avg}`);
        return parts.join(", ");
    }

    return "";
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
    const optionLabelMap = useOptionLabelMap(aggregations);

    const selected = getSelectedAttributes(aggregations, intent);

    const valueFor = (code: string) => renderPreferenceValue(code, optionLabelMap, intent);

    return { selected, valueFor };
}
