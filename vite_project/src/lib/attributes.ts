import type {MagentoAggregation} from "../hooks/infra/useProductAttributeLayer.tsx";
import type {IntentDiscoveryDataConfig} from "../domain/intent-discovery.types.ts";

export function getOrderedAttributes(
    attributes: MagentoAggregation[],
    config: IntentDiscoveryDataConfig
): MagentoAggregation[] {

    const filtered = (attributes || [])
        .filter(attr =>
            !config.attributeExcludedInLayer?.includes(attr.attribute_code)
        )
        .map(attr => ({
            ...attr,
            label: config.labelMap?.[attr.attribute_code] ?? attr.label
        }));

    const order = config.attributeOrder || [];

    const ordered: MagentoAggregation[] = [];
    const remaining = new Map(filtered.map(a => [a.attribute_code, a]));

    // bring contract attributes first
    order.forEach(code => {
        const attr = remaining.get(code);
        if (attr) {
            ordered.push(attr);
            remaining.delete(code);
        }
    });

    return [...ordered, ...remaining.values()];
}