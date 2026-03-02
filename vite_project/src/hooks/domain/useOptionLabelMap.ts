import type {MagentoAggregation} from "../infra/useProductAttributeLayer.tsx";
import {useMemo} from "react";
import type {OptionLabelMap} from "../../state/OptionPreference/type.ts";

export function useOptionLabelMap(
    aggregations?: MagentoAggregation[]
) {
    return useMemo(() => {
        if (!aggregations) return new Map();

        const map: OptionLabelMap = new Map<string, Map<string, string>>();

        for (const agg of aggregations) {
            const optionMap = new Map<string, string>();

            for (const opt of agg.options) {
                optionMap.set(opt.value, opt.label);
            }

            map.set(agg.attribute_code, optionMap);
        }

        return map;

    }, [aggregations]);
}