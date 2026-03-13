import { useOptionPreferenceState } from "../../state/OptionPreference/useOptionPreferenceState.ts";
import { useEffect } from "react";
import { useActiveAttributeState } from "../../state/ActiveAttribute/useActiveAttributeState.ts";
import type { IntentDiscoveryDataConfig } from "../../domain/intent-discovery.types.ts";
import { StepFinder } from "../FinderWidget/StepFinder.tsx";
import { StepPriceFinder } from "../FinderWidget/StepPriceFinder.tsx";
import { ResultMatch } from "../FinderWidget/ResultMatch.tsx";
import { FinderRow } from "../FinderRow.tsx";
import type { CategoryData } from "../../types/infra/magento/category.types.ts";
import { activity } from "../../activity";
import type {MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";
import {Icon} from "../AttributeLayer/Icon.tsx";

export interface Props {
    config: IntentDiscoveryDataConfig
    categoryData: CategoryData
    excludeCodes?: string[];
    attributeLayerData: MagentoProducts
}

// step codes are dynamic strings derived from the active attribute or preference state
// we no longer hard‑code a union type here

export const IntentDiscoveryOptions = ({ config, categoryData, attributeLayerData }: Props) => {
    const { setActiveCategoryName } = useOptionPreferenceState();
    const { attributeState } = useActiveAttributeState();

    useEffect(() => {
        setActiveCategoryName(config.categoryUrlKey);
    }, [config.categoryUrlKey, setActiveCategoryName]);

    if (!attributeLayerData) return null;

    // prefer active attribute code if there's one, else fall back to preference progression
    const stepCode = attributeState.attributeCode

    if (stepCode === null) return

    const renderStep = () => {
        if (stepCode === "price") return <StepPriceFinder attributeLayerData={attributeLayerData} />;
        if (stepCode === "result") return <ResultMatch categoryData={categoryData} />;

        return <StepFinder optionCode={stepCode} attributeLayerData={attributeLayerData} />;
    };

    activity('intent-discovery', 'Intent Discover Step', stepCode);

    return (
        <div className="finder">
            <FinderRow>
                <Icon attribute_code={stepCode} size={70} />
                {renderStep()}
            </FinderRow>
        </div>
    );
};