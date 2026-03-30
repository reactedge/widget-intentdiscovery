import { unescapeHtml } from "../../lib/string.ts";
import { useFindAttributeOptionsByCode } from "../../hooks/domain/useFindAttributeOptionsByCode.tsx";
import type {MagentoAggregationOption, MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";
import {useInteractionState} from "../../state/Interaction/useInteractionState.ts";
import {activity} from "../../activity";
import {useIntentState} from "../../state/Intent/useIntentState.ts";

interface StepFinderProps {
    optionCode: string
    attributeLayerData: MagentoProducts
}

export const StepFinder: React.FC<StepFinderProps> = ({ optionCode, attributeLayerData }: StepFinderProps) => {
    const { setActiveAttribute, setFocusedOption } = useInteractionState()
    const { attributeData } = useFindAttributeOptionsByCode(optionCode, attributeLayerData)
    const { setPreference, intentState } = useIntentState()

    const handleOnClick = async (option: MagentoAggregationOption) => {
        setActiveAttribute(optionCode);
        setPreference(optionCode, option.value)
        setFocusedOption(option.value)

        activity('intent-discovery-option', 'Intent Option Selection', {intentState, optionCode, value: option.value});
    };

    const selectedMap = intentState.attributeScore?.[optionCode] || {};
    const isOptionSelected = (value: string) => value in selectedMap;

    return (
            <div className="step-finder">
                {attributeData?.options.map((option: MagentoAggregationOption) => (
                    <label
                        key={option.value}
                        className="choice-tile"
                        data-intent-option={option.label}
                        data-intent-selected={isOptionSelected(option.value)}
                        data-intent-count={option.count}
                    >
                        <input
                            type="radio"
                            name="preference"
                            checked={isOptionSelected(option.value)}
                            value={option.value}
                            onClick={() => handleOnClick(option)}
                            readOnly
                        />

                        <span className={`choice-tile__label ${isOptionSelected(option.value) ? 'choice-tile__label--active' : ''}`}>
                            {unescapeHtml(option.label)} ({option.count})
                        </span>
                    </label>
                ))}
            </div>
    );
};