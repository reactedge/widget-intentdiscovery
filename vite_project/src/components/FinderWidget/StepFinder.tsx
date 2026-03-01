import {unescapeHtml} from "../../lib/string.ts";
import {useFindAttributeOptionsByCode} from "../../hooks/domain/useFindAttributeOptionsByCode.tsx";
import {useOptionPreferenceState} from "../../state/OptionPreference/useOptionPreferenceState.ts";
import type {MagentoCategory} from "../../types/infra/magento/category.types.ts";
import {Spinner} from "../global/Spinner.tsx";
import {ErrorState} from "../global/ErrorState.tsx";


interface StepFinderProps {
    optionCode: string
    categoryData: MagentoCategory
}

export const StepFinder: React.FC<StepFinderProps> = ({optionCode, categoryData}: StepFinderProps) => {
    const {setActiveOptionCode, setOptionSelection} = useOptionPreferenceState()
    const {totalCount, attributeData, attributeLoading, attributeError} = useFindAttributeOptionsByCode(optionCode, categoryData)

    const onChange = async (option: any) => {
        setActiveOptionCode(optionCode);
        setOptionSelection(optionCode, attributeData.label, option.value, option.label)
    };

    if (attributeLoading) return <Spinner />
    if (attributeError) return <ErrorState />


    return (
        <>
            {totalCount && `${totalCount} products`}
            <div className="step-finder">
                {attributeData?.options.map((option) => (
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

                        <span className="choice-tile__label">
                            {unescapeHtml(option.label)} ({option.count})
                        </span>
                    </label>
                ))}
            </div>
        </>
    );
};