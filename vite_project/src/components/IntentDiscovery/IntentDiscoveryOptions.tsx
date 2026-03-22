import { useOptionPreferenceState } from "../../state/OptionPreference/useOptionPreferenceState.ts";
import {useEffect} from "react";
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
    attributeLayerData: MagentoProducts
}

export const IntentDiscoveryOptions = ({
       config,
       categoryData,
       attributeLayerData
   }: Props) => {
    const { setActiveCategoryName } = useOptionPreferenceState();
    const { attributeCode: stepCode } = useActiveAttributeState().attributeState;

    useEffect(() => {
        setActiveCategoryName(config.categoryUrlKey);
    }, [config.categoryUrlKey, setActiveCategoryName]);

    useEffect(() => {
        if (stepCode !== null) {
            activity('intent-discovery', 'Intent Discover Step', stepCode);
        }
    }, [stepCode]);

    if (!attributeLayerData || stepCode === null) return null;

    let step;

    if (stepCode === "price") {
        step = <StepPriceFinder attributeLayerData={attributeLayerData} />;
    } else if (stepCode === "result") {
        step = <ResultMatch categoryData={categoryData} />;
    } else {
        step = <StepFinder optionCode={stepCode} attributeLayerData={attributeLayerData} />;
    }

    return (
        <div className="finder">
            <FinderRow>
                <Icon attribute_code={stepCode} size={70} />
                {step}
            </FinderRow>
        </div>
    );
};