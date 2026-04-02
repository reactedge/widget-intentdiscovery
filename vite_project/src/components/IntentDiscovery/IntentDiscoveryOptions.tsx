import {useEffect} from "react";
import { StepFinder } from "../FinderWidget/StepFinder.tsx";
import { StepPriceFinder } from "../FinderWidget/StepPriceFinder.tsx";
import { FinderRow } from "../FinderRow.tsx";
import type { CategoryData } from "../../types/infra/magento/category.types.ts";
import { activity } from "../../activity";
import {Icon} from "../AttributeLayer/Icon.tsx";
import {useInteractionState} from "../../state/Interaction/useInteractionState.ts";
import {useIntentState} from "../../state/Intent/useIntentState.ts";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";

export interface Props {
    categoryData: CategoryData
    attributeLayerData: MagentoLayeredNavigation
}

export const IntentDiscoveryOptions = ({
       attributeLayerData
   }: Props) => {
    const { navigation } = useInteractionState().interactionState;
    const stepCode = navigation.activeAttribute
    const { intentState } = useIntentState()
    const isSearching = intentState.status === "suggestionProcessing"

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