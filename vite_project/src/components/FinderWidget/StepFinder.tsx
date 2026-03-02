import { unescapeHtml } from "../../lib/string.ts";
import { useFindAttributeOptionsByCode } from "../../hooks/domain/useFindAttributeOptionsByCode.tsx";
import { useOptionPreferenceState } from "../../state/OptionPreference/useOptionPreferenceState.ts";
import { useActiveAttributeState } from "../../state/ActiveAttribute/useActiveAttributeState.ts";
import type {MagentoAggregationOption, MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";
import {activity} from "../../activity";


interface StepFinderProps {
    optionCode: string
    attributeLayerData: MagentoProducts
}

export const StepFinder: React.FC<StepFinderProps> = ({ optionCode, attributeLayerData }: StepFinderProps) => {
    const { optionState, toggleOptionSelection } = useOptionPreferenceState()
    const { setActiveAttributeCode } = useActiveAttributeState()
    const { attributeData } = useFindAttributeOptionsByCode(optionCode, attributeLayerData)

    // find the currently selected value for this option code
    const currentSelection = optionState.optionSelection.find(sel => sel.code === optionCode);

    const onChange = async (option: MagentoAggregationOption) => {
        setActiveAttributeCode(optionCode);
        const action = toggleOptionSelection(optionCode, attributeData.label, option.value, option.label);

        activity('select-options', `Select ${optionCode}`, action);

        if (action === 'select') {
            window.ReactEdgeIntent.emit({
                type: 'filter_select',
                attribute: optionCode,
                value: option.value
            });
        } else {
            window.ReactEdgeIntent.emit({
                type: 'filter_deselect',
                attribute: optionCode,
                value: option.value
            });
        }
    };

    // check if current option value is selected (handles both single and multiple selections)
    const isOptionSelected = (optionValue: string): boolean => {
        if (!currentSelection) return false;
        return currentSelection.value === optionValue;
    };

    return (
            <div className="step-finder">
                {attributeData?.options.map((option: MagentoAggregationOption) => (
                    <label
                        key={option.value}
                        className="choice-tile"
                    >
                        <input
                            type="radio"
                            name="preference"
                            value={option.value}
                            onChange={() => onChange(option)}
                        />

                        <span className={`choice-tile__label ${isOptionSelected(option.value) ? 'choice-tile__label--active' : ''}`}>
                            {unescapeHtml(option.label)} ({option.count})
                        </span>
                    </label>
                ))}
            </div>
    );
};