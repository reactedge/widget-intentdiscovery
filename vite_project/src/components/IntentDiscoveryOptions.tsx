import { useOptionPreferenceState } from "../state/OptionPreference/useOptionPreferenceState.ts";
import { useEffect } from "react";
import { useActiveAttributeState } from "../state/ActiveAttribute/useActiveAttributeState.ts";
import type { IntentDiscoveryDataConfig } from "../domain/intent-discovery.types.ts";
import { getNextPreferenceStep } from "../types/domain/magento/attribute.ts";
import { StepFinder } from "./FinderWidget/StepFinder.tsx";
import { StepPriceFinder } from "./FinderWidget/StepPriceFinder.tsx";
import { ResultMatch } from "./FinderWidget/ResultMatch.tsx";
import { FinderRow } from "./FinderRow.tsx";
import type { MagentoCategory } from "../types/infra/magento/category.types.ts";
import { activity } from "../activity";
import type {MagentoProducts} from "../hooks/infra/useProductAttributeLayer.tsx";

export interface Props {
    config: IntentDiscoveryDataConfig
    categoryData: MagentoCategory
    excludeCodes?: string[];
    attributeLayerData: MagentoProducts
}

// step codes are dynamic strings derived from the active attribute or preference state
// we no longer hard‑code a union type here

export const IntentDiscoveryOptions = ({ config, categoryData, attributeLayerData }: Props) => {
    const { optionState, setActiveCategoryName } = useOptionPreferenceState();
    const { attributeState } = useActiveAttributeState();

    useEffect(() => {
        setActiveCategoryName(config.categoryUrlKey);
    }, [config.categoryUrlKey, setActiveCategoryName]);

    if (!attributeLayerData) return null;

    // retrieve labels from the configuration (contract); fall back to an empty map
    const labelMap: Record<string, string> = config.labelMap || {};

    // prefer active attribute code if there's one, else fall back to preference progression
    const stepCode: string =
        attributeState.attributeCode ||
        getNextPreferenceStep(attributeLayerData.aggregations, optionState.activeOptionCode || '', config.attributeExcludedInLayer);

    const stepLabel = labelMap[stepCode] || "";

    const renderStep = () => {
        if (stepCode === "price") return <StepPriceFinder attributeLayerData={attributeLayerData} />;
        if (stepCode === "result") return <ResultMatch categoryData={categoryData} />;

        return <StepFinder optionCode={stepCode} attributeLayerData={attributeLayerData} />;
    };

    activity('intent-discovery', 'Intent Discover Step', stepCode);

    return (
        <div className="finder">
            <h2 className="finder__title">
                Let's roll up our sleeves, put some sweat in this search
            </h2>

            <FinderRow>
                <p className="finder__label">{stepLabel}</p>
                {renderStep()}
            </FinderRow>
        </div>
    );
};