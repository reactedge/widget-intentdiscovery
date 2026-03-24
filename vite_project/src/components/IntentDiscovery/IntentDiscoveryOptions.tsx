import {useEffect} from "react";
import { StepFinder } from "../FinderWidget/StepFinder.tsx";
import { StepPriceFinder } from "../FinderWidget/StepPriceFinder.tsx";
import { FinderRow } from "../FinderRow.tsx";
import type { CategoryData } from "../../types/infra/magento/category.types.ts";
import { activity } from "../../activity";
import type {MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";
import {Icon} from "../AttributeLayer/Icon.tsx";
import {useInteractionState} from "../../state/Interaction/useInteractionState.ts";

export interface Props {
    categoryData: CategoryData
    attributeLayerData: MagentoProducts
    isSearching: boolean
}

export const IntentDiscoveryOptions = ({
       attributeLayerData,
       isSearching
   }: Props) => {
    const { navigation } = useInteractionState().interactionState;
    const stepCode = navigation.activeAttribute

    useEffect(() => {
        if (stepCode !== null) {
            activity('intent-discovery', 'Intent Discover Step', stepCode);
        }
    }, [stepCode]);

    if (!attributeLayerData || stepCode === null) return null;

    let step;

    if (stepCode === "price") {
        step = <StepPriceFinder attributeLayerData={attributeLayerData} />;
    } else {
        step = <StepFinder optionCode={stepCode} attributeLayerData={attributeLayerData} />;
    }

    if (isSearching) return null; // make the feature more compact when the search is processing

    return (
        <div className="finder">
            <FinderRow>
                <Icon attribute_code={stepCode} size={70} />
                {step}
            </FinderRow>
        </div>
    );
};