import { unescapeHtml } from "../../lib/string.ts";
import { useFindAttributeOptionsByCode } from "../../hooks/domain/useFindAttributeOptionsByCode.tsx";
import {useInteractionState} from "../../state/Interaction/useInteractionState.ts";
import {activity} from "../../activity";
import {useIntentState} from "../../state/Intent/useIntentState.ts";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";
import type {MergedAttributeOption} from "../../hooks/infra/useMagentoLayeredData.tsx";

interface StepFinderProps {
    optionCode: string
    attributeLayerData: MagentoLayeredNavigation
}

export const StepFinder: React.FC<StepFinderProps> = ({ optionCode, attributeLayerData }: StepFinderProps) => {
    const { setActiveAttribute, setFocusedOption } = useInteractionState()
    const { attributeData } = useFindAttributeOptionsByCode(optionCode, attributeLayerData)
    const { setPreference, intentState } = useIntentState()

    const handleOnClick = async (option: MergedAttributeOption) => {
        setActiveAttribute(optionCode);
        setPreference(optionCode, option.value)
        setFocusedOption(option.value)

        activity('intent-discovery-option', 'Intent Option Selection', {intentState, optionCode, value: option.value});
    };

    const selectedMap = intentState.attributeScore?.[optionCode] || {};
    const isOptionSelected = (value: string) => value in selectedMap;

    const renderOptionVisual = (option: MergedAttributeOption) => {
        if (!option.visual) return null

        const { type, value } = option.visual

        if (type === "color") {
            //return 'color to show ' + option.visual.value
            return (
                <span
                    className="swatch swatch--color"
                    style={{backgroundColor: value}}
                />
            )
        }

        /*if (type === "swatch") {
            return (
                <img
                    src={value}
                    alt={option.label}
                    className="w-4 h-4 rounded-full object-cover"
                />
            )
        }*/

        return null
    }

    return (
            <div className="step-finder">
                {attributeData?.options.map((option: MergedAttributeOption) => (
                    <label
                        key={option.value}
                        className="choice-tile"
                        data-intent-option={option.label}
                        data-intent-selected={isOptionSelected(option.value)}
                        data-intent-count={option.filteredCount}
                    >
                        <input
                            type="radio"
                            name="preference"
                            checked={isOptionSelected(option.value)}
                            value={option.value}
                            onClick={() => handleOnClick(option)}
                            readOnly
                        />

                        {renderOptionVisual(option)}

                        <span className={`choice-tile__label ${isOptionSelected(option.value) ? 'choice-tile__label--active' : ''}`}>
                            {unescapeHtml(option.label)} ({option.filteredCount})
                        </span>
                    </label>
                ))}
            </div>
    );
};