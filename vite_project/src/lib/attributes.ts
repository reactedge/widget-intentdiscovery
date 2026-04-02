import type {IntentDiscoveryDataConfig} from "../domain/intent-discovery.types.ts";
import type {MergedAttribute} from "../hooks/infra/useMagentoLayeredData.tsx";

export function getOrderedAttributes(
    attributes: MergedAttribute[],
    config: IntentDiscoveryDataConfig
): MergedAttribute[] {

    const filtered = (attributes || [])
        .filter(attr =>
            !config.attributeExcludedInLayer?.includes(attr.code)
        )
        .map(attr => ({
            ...attr,
            label: config.labelMap?.[attr.code] ?? attr.label
        }));

    const order = config.attributeOrder || [];

    const ordered: MergedAttribute[] = [];
    const remaining = new Map(filtered.map(a => [a.code, a]));

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
