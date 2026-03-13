import {useOptionPreferenceState} from "../../state/OptionPreference/useOptionPreferenceState.ts";
import {useEffect} from "react";
import type {MagentoProducts} from "../infra/useProductAttributeLayer.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";

export function useActiveCategory(attributeLayerData: MagentoProducts, config: IntentDiscoveryDataConfig) {
    const { setActiveCategoryName } = useOptionPreferenceState();

    useEffect(() => {
        if (!attributeLayerData?.aggregations) return
        setActiveCategoryName(config.categoryUrlKey);
    }, [config.categoryUrlKey, setActiveCategoryName, attributeLayerData?.aggregations]);
}